/** A user known by the OpenID Connect `sub` claim, never by a password. */
export interface OidcUser {
  createdAt: number;
  email: string;
  emailVerified: boolean;
  /** The `sub` claim of the Google id_token. */
  id: string;
  name?: string;
  picture?: string;
  /** Scopes granted by Google (incremental consent accumulates here). */
  scopes: string[];
  /** AES-GCM encrypted JSON of the Google tokens; opaque to repositories. */
  tokens?: string;
}

/** State of an in-flight authorization request, keyed by the `state` parameter. */
export interface PendingLogin {
  /** Present for server-side PKCE; native clients keep their own verifier. */
  codeVerifier?: string;
  expiresAt: number;
  nonce: string;
  redirectUri: string;
  returnTo?: string;
  scopes: string[];
  state: string;
}

/** Opaque, rotating refresh token of a native app session; only its SHA-256 hash is stored. */
export interface RefreshTokenRecord {
  expiresAt: number;
  /** Identifies one native login; all rotated tokens of it share the family. */
  familyId: string;
  hash: string;
  userId: string;
}

export interface OidcRepository {
  /** Removes the refresh tokens of one family, or of every family of a user. */
  deleteRefreshTokens(
    by: { familyId: string } | { userId: string },
  ): Promise<void>;
  findUser(id: string): Promise<OidcUser | undefined>;
  /** True while the family still has an unexpired refresh token (i.e. not logged out). */
  isFamilyActive(familyId: string): Promise<boolean>;
  savePendingLogin(login: PendingLogin): Promise<void>;
  saveRefreshToken(record: RefreshTokenRecord): Promise<void>;
  /** Atomically removes and returns the pending login (single use), ignoring expired ones. */
  takePendingLogin(state: string): Promise<PendingLogin | undefined>;
  /** Atomically removes and returns the refresh token (single use), ignoring expired ones. */
  takeRefreshToken(hash: string): Promise<RefreshTokenRecord | undefined>;
  upsertUser(user: OidcUser): Promise<void>;
}
