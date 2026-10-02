import { randomBytes } from 'node:crypto';
import { google } from 'googleapis';
import type { Auth } from 'googleapis';
import { MINIMUM_SCOPES } from '@gm/lib-common-google';
import { GoogleInMemoryAuthRepository } from '../repositories/GoogleInMemoryAuthRepository';
import type { GoogleAuthSession } from '../repositories/GoogleInMemoryAuthRepository';

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleAuthService {
  constructor(
    private repo: GoogleInMemoryAuthRepository,
    private config: GoogleOAuthConfig
  ) {}

  /** Creates a session, or validates the password of an existing one. */
  login(gmail: string, password: string): GoogleAuthSession {
    const existing = this.repo.findByGmail(gmail);
    if (!existing) return this.repo.create(gmail, password);
    if (existing.password !== password) throw new Error('Invalid credentials');
    return existing;
  }

  getSession(sessionId: string): GoogleAuthSession | undefined {
    return this.repo.findBySessionId(sessionId);
  }

  /** Stores scopes; minimum scopes are always included. */
  setScopes(sessionId: string, scopes: string[]): string[] {
    const merged = Array.from(new Set([...MINIMUM_SCOPES, ...scopes]));
    this.require(sessionId);
    this.repo.update(sessionId, { scopes: merged });
    return merged;
  }

  startUrl(sessionId: string, redirectUri = this.config.redirectUri): string {
    const session = this.require(sessionId);
    const state = randomBytes(16).toString('hex');
    const nonce = randomBytes(16).toString('hex');
    this.repo.update(sessionId, { state, nonce });
    return this.client(redirectUri).generateAuthUrl({
      access_type: 'offline',
      scope: session.scopes.length ? session.scopes : MINIMUM_SCOPES,
      state,
      login_hint: session.gmail
    });
  }

  async handleCallback(sessionId: string, code: string, state: string): Promise<void> {
    const session = this.require(sessionId);
    if (!session.state || session.state !== state) throw new Error('Invalid state');
    const { tokens } = await this.client().getToken(code);
    this.repo.update(sessionId, { tokens, state: undefined, nonce: undefined });
  }

  authorizedClient(sessionId: string): Auth.OAuth2Client {
    const session = this.require(sessionId);
    if (!session.tokens) throw new Error('Not authorized with Google');
    const c = this.client();
    c.setCredentials(session.tokens);
    return c;
  }

  private client(redirectUri = this.config.redirectUri): Auth.OAuth2Client {
    return new google.auth.OAuth2(this.config.clientId, this.config.clientSecret, redirectUri);
  }

  private require(sessionId: string): GoogleAuthSession {
    const s = this.repo.findBySessionId(sessionId);
    if (!s) throw new Error('Unknown session');
    return s;
  }
}
