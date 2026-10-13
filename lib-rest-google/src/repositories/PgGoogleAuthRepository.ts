import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import { ensurePgSchema, getPgPool } from '../db/pg';
import type { AuthRepository, GoogleAuthSession } from './authRepository';

const COLUMNS =
  'session_id, gmail, password_hash, scopes, nonce, state, tokens';

const toSession = (r: any): GoogleAuthSession => ({
  gmail: r.gmail,
  nonce: r.nonce ?? undefined,
  password: r.password_hash,
  scopes: r.scopes,
  sessionId: r.session_id,
  state: r.state ?? undefined,
  tokens: r.tokens ?? undefined,
});

export class PgGoogleAuthRepository implements AuthRepository {
  constructor(private db: Pool = getPgPool()) {}

  private async ready() {
    await ensurePgSchema(this.db);
  }

  async findByGmail(gmail: string) {
    await this.ready();
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS} FROM google_auth_sessions WHERE lower(gmail) = lower($1)`,
      [gmail],
    );
    return rows[0] ? toSession(rows[0]) : undefined;
  }

  async findBySessionId(sessionId: string) {
    await this.ready();
    const { rows } = await this.db.query(
      `SELECT ${COLUMNS} FROM google_auth_sessions WHERE session_id = $1`,
      [sessionId],
    );
    return rows[0] ? toSession(rows[0]) : undefined;
  }

  async create(gmail: string, password: string) {
    await this.ready();
    const { rows } = await this.db.query(
      `INSERT INTO google_auth_sessions (session_id, gmail, password_hash)
       VALUES ($1, $2, $3) RETURNING ${COLUMNS}`,
      [randomUUID(), gmail, password],
    );
    return toSession(rows[0]);
  }

  async update(
    sessionId: string,
    patch: Partial<Omit<GoogleAuthSession, 'sessionId'>>,
  ) {
    await this.ready();
    const columns: Record<string, string> = {
      gmail: 'gmail',
      nonce: 'nonce',
      password: 'password_hash',
      scopes: 'scopes',
      state: 'state',
      tokens: 'tokens',
    };
    const sets: string[] = [];
    const values: unknown[] = [sessionId];
    for (const [key, column] of Object.entries(columns)) {
      if (!(key in patch)) continue;
      const value = (patch as Record<string, unknown>)[key];
      values.push(
        key === 'tokens' && value ? JSON.stringify(value) : (value ?? null),
      );
      sets.push(`${column} = $${values.length}`);
    }
    if (!sets.length) return this.findBySessionId(sessionId);
    const { rows } = await this.db.query(
      `UPDATE google_auth_sessions SET ${sets.join(', ')}
       WHERE session_id = $1 RETURNING ${COLUMNS}`,
      values,
    );
    return rows[0] ? toSession(rows[0]) : undefined;
  }
}
