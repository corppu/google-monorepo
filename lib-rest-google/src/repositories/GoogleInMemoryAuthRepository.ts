import { randomUUID } from 'node:crypto';

export interface GoogleAuthSession {
  gmail: string;
  nonce?: string;
  password: string;
  scopes: string[];
  sessionId: string;
  state?: string;
  tokens?: Record<string, any>;
}

export class GoogleInMemoryAuthRepository {
  private byId = new Map<string, GoogleAuthSession>();
  private byGmail = new Map<string, string>();

  findByGmail(gmail: string): GoogleAuthSession | undefined {
    const id = this.byGmail.get(gmail.toLowerCase());
    return id ? this.byId.get(id) : undefined;
  }

  findBySessionId(sessionId: string): GoogleAuthSession | undefined {
    return this.byId.get(sessionId);
  }

  create(gmail: string, password: string): GoogleAuthSession {
    const session: GoogleAuthSession = {
      gmail,
      password,
      scopes: [],
      sessionId: randomUUID(),
    };
    this.byId.set(session.sessionId, session);
    this.byGmail.set(gmail.toLowerCase(), session.sessionId);
    return session;
  }

  update(
    sessionId: string,
    patch: Partial<Omit<GoogleAuthSession, 'sessionId'>>,
  ): GoogleAuthSession | undefined {
    const s = this.byId.get(sessionId);
    if (!s) return undefined;
    Object.assign(s, patch);
    return s;
  }
}
