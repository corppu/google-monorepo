import type { Pool } from 'pg';
import type {
  OidcRepository,
  OidcUser,
  PendingLogin,
  RefreshTokenRecord,
} from './types';

const SCHEMA_LOCK = 4242002;

/** Shared by all replicas of a swarm service so any replica can finish a login another one started. */
export class PgOidcRepository implements OidcRepository {
  private ready?: Promise<void>;

  constructor(private pool: Pool) {}

  private ensureSchema(): Promise<void> {
    return (this.ready ??= (async () => {
      const client = await this.pool.connect();
      try {
        await client.query('SELECT pg_advisory_lock($1)', [SCHEMA_LOCK]);
        await client.query(`
          CREATE TABLE IF NOT EXISTS oidc_users (
            id text PRIMARY KEY,
            email text NOT NULL,
            email_verified boolean NOT NULL,
            name text,
            picture text,
            scopes text[] NOT NULL DEFAULT '{}',
            tokens text,
            created_at timestamptz NOT NULL DEFAULT now()
          );
          CREATE TABLE IF NOT EXISTS oidc_pending_logins (
            state text PRIMARY KEY,
            nonce text NOT NULL,
            code_verifier text,
            redirect_uri text NOT NULL,
            return_to text,
            scopes text[] NOT NULL,
            expires_at timestamptz NOT NULL
          );
          CREATE TABLE IF NOT EXISTS oidc_refresh_tokens (
            hash text PRIMARY KEY,
            user_id text NOT NULL,
            family_id text NOT NULL,
            expires_at timestamptz NOT NULL
          );
          CREATE INDEX IF NOT EXISTS oidc_refresh_tokens_family
            ON oidc_refresh_tokens (family_id);
          CREATE INDEX IF NOT EXISTS oidc_refresh_tokens_user
            ON oidc_refresh_tokens (user_id);
        `);
      } finally {
        await client
          .query('SELECT pg_advisory_unlock($1)', [SCHEMA_LOCK])
          .catch(() => undefined);
        client.release();
      }
    })().catch((e) => {
      this.ready = undefined;
      throw e;
    }));
  }

  async deleteRefreshTokens(by: { familyId: string } | { userId: string }) {
    await this.ensureSchema();
    if ('familyId' in by)
      await this.pool.query(
        'DELETE FROM oidc_refresh_tokens WHERE family_id = $1',
        [by.familyId],
      );
    else
      await this.pool.query(
        'DELETE FROM oidc_refresh_tokens WHERE user_id = $1',
        [by.userId],
      );
  }

  async isFamilyActive(familyId: string) {
    await this.ensureSchema();
    const { rowCount } = await this.pool.query(
      'SELECT 1 FROM oidc_refresh_tokens WHERE family_id = $1 AND expires_at > now() LIMIT 1',
      [familyId],
    );
    return (rowCount ?? 0) > 0;
  }

  async saveRefreshToken(r: RefreshTokenRecord) {
    await this.ensureSchema();
    await this.pool.query(
      'DELETE FROM oidc_refresh_tokens WHERE expires_at < now()',
    );
    await this.pool.query(
      `INSERT INTO oidc_refresh_tokens (hash, user_id, family_id, expires_at)
       VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))`,
      [r.hash, r.userId, r.familyId, r.expiresAt],
    );
  }

  async takeRefreshToken(
    hash: string,
  ): Promise<RefreshTokenRecord | undefined> {
    await this.ensureSchema();
    const { rows } = await this.pool.query(
      `DELETE FROM oidc_refresh_tokens WHERE hash = $1 AND expires_at > now()
       RETURNING *, extract(epoch FROM expires_at) * 1000 AS expires_ms`,
      [hash],
    );
    const r = rows[0];
    return (
      r && {
        expiresAt: Number(r.expires_ms),
        familyId: r.family_id,
        hash: r.hash,
        userId: r.user_id,
      }
    );
  }

  async findUser(id: string): Promise<OidcUser | undefined> {
    await this.ensureSchema();
    const { rows } = await this.pool.query(
      'SELECT * FROM oidc_users WHERE id = $1',
      [id],
    );
    const r = rows[0];
    return r && this.toUser(r);
  }

  async savePendingLogin(login: PendingLogin) {
    await this.ensureSchema();
    await this.pool.query(
      'DELETE FROM oidc_pending_logins WHERE expires_at < now()',
    );
    await this.pool.query(
      `INSERT INTO oidc_pending_logins
         (state, nonce, code_verifier, redirect_uri, return_to, scopes, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7 / 1000.0))`,
      [
        login.state,
        login.nonce,
        login.codeVerifier ?? null,
        login.redirectUri,
        login.returnTo ?? null,
        login.scopes,
        login.expiresAt,
      ],
    );
  }

  async takePendingLogin(state: string): Promise<PendingLogin | undefined> {
    await this.ensureSchema();
    const { rows } = await this.pool.query(
      `DELETE FROM oidc_pending_logins WHERE state = $1 AND expires_at > now()
       RETURNING *, extract(epoch FROM expires_at) * 1000 AS expires_ms`,
      [state],
    );
    const r = rows[0];
    if (!r) return undefined;
    return {
      codeVerifier: r.code_verifier ?? undefined,
      expiresAt: Number(r.expires_ms),
      nonce: r.nonce,
      redirectUri: r.redirect_uri,
      returnTo: r.return_to ?? undefined,
      scopes: r.scopes,
      state: r.state,
    };
  }

  async upsertUser(user: OidcUser) {
    await this.ensureSchema();
    await this.pool.query(
      `INSERT INTO oidc_users (id, email, email_verified, name, picture, scopes, tokens)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         email_verified = EXCLUDED.email_verified,
         name = EXCLUDED.name,
         picture = EXCLUDED.picture,
         scopes = EXCLUDED.scopes,
         tokens = EXCLUDED.tokens`,
      [
        user.id,
        user.email,
        user.emailVerified,
        user.name ?? null,
        user.picture ?? null,
        user.scopes,
        user.tokens ?? null,
      ],
    );
  }

  private toUser(r: Record<string, any>): OidcUser {
    return {
      createdAt: new Date(r.created_at).getTime(),
      email: r.email,
      emailVerified: r.email_verified,
      id: r.id,
      name: r.name ?? undefined,
      picture: r.picture ?? undefined,
      scopes: r.scopes,
      tokens: r.tokens ?? undefined,
    };
  }
}
