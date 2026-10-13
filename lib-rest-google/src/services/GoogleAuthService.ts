import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { google } from 'googleapis';
import type { Auth } from 'googleapis';
import { MINIMUM_SCOPES } from '@gm/lib-common-google';
import type {
  AuthRepository,
  GoogleAuthSession,
} from '../repositories/authRepository';

const scryptAsync = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, 64, (e, key) => (e ? reject(e) : resolve(key))),
  );

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = await scryptAsync(password, Buffer.from(salt, 'hex'));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleAuthService {
  constructor(
    private repo: AuthRepository,
    private config: GoogleOAuthConfig,
  ) {}

  /** Creates a session, or validates the password of an existing one. */
  async login(gmail: string, password: string): Promise<GoogleAuthSession> {
    const existing = await this.repo.findByGmail(gmail);
    if (!existing) return this.repo.create(gmail, await hashPassword(password));
    if (!(await verifyPassword(password, existing.password)))
      throw new Error('Invalid credentials');
    return existing;
  }

  async getSession(sessionId: string): Promise<GoogleAuthSession | undefined> {
    return this.repo.findBySessionId(sessionId);
  }

  /** Stores scopes; minimum scopes are always included. */
  async setScopes(sessionId: string, scopes: string[]): Promise<string[]> {
    const merged = Array.from(new Set([...MINIMUM_SCOPES, ...scopes]));
    await this.require(sessionId);
    await this.repo.update(sessionId, { scopes: merged });
    return merged;
  }

  startUrl(sessionId: string): Promise<string> {
    return this.buildUrl(sessionId, this.config.redirectUri);
  }

  /** Native PKCE: builds the OAuth URL using the code_challenge generated on the device. */
  nativeStartUrl(
    sessionId: string,
    codeChallenge: string,
    redirectUri: string,
  ): Promise<string> {
    return this.buildUrl(sessionId, redirectUri, codeChallenge);
  }

  async handleCallback(
    sessionId: string,
    code: string,
    state: string,
  ): Promise<void> {
    await this.exchange(sessionId, code, state, this.config.redirectUri);
  }

  /** Native PKCE: exchanges the code with the device's code_verifier. Tokens stay on the server. */
  async nativeExchange(
    sessionId: string,
    code: string,
    state: string,
    codeVerifier: string,
    redirectUri: string,
  ): Promise<void> {
    await this.exchange(sessionId, code, state, redirectUri, codeVerifier);
  }

  private async buildUrl(
    sessionId: string,
    redirectUri: string,
    codeChallenge?: string,
  ): Promise<string> {
    const session = await this.require(sessionId);
    const state = randomBytes(16).toString('hex');
    const nonce = randomBytes(16).toString('hex');
    await this.repo.update(sessionId, { nonce, state });
    return this.client(redirectUri).generateAuthUrl({
      access_type: 'offline',
      login_hint: session.gmail,
      scope: session.scopes.length ? session.scopes : MINIMUM_SCOPES,
      state,
      ...(codeChallenge
        ? {
            code_challenge: codeChallenge,
            code_challenge_method: 'S256' as Auth.CodeChallengeMethod,
          }
        : {}),
      // generateAuthUrl forwards unknown params to the authorization URL
      ...({ nonce } as object),
    });
  }

  private async exchange(
    sessionId: string,
    code: string,
    state: string,
    redirectUri: string,
    codeVerifier?: string,
  ): Promise<void> {
    const session = await this.require(sessionId);
    if (!session.state || session.state !== state)
      throw new Error('Invalid state');
    const client = this.client(redirectUri);
    const { tokens } = await client.getToken({ code, codeVerifier });
    if (!tokens.id_token) throw new Error('Missing id_token');
    const ticket = await client.verifyIdToken({
      audience: this.config.clientId,
      idToken: tokens.id_token,
    });
    if (!session.nonce || ticket.getPayload()?.nonce !== session.nonce)
      throw new Error('Invalid nonce');
    await this.repo.update(sessionId, {
      nonce: undefined,
      state: undefined,
      tokens,
    });
  }

  async authorizedClient(sessionId: string): Promise<Auth.OAuth2Client> {
    const session = await this.require(sessionId);
    if (!session.tokens) throw new Error('Not authorized with Google');
    const c = this.client();
    c.setCredentials(session.tokens);
    return c;
  }

  private client(redirectUri = this.config.redirectUri): Auth.OAuth2Client {
    return new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      redirectUri,
    );
  }

  private async require(sessionId: string): Promise<GoogleAuthSession> {
    const s = await this.repo.findBySessionId(sessionId);
    if (!s) throw new Error('Unknown session');
    return s;
  }
}
