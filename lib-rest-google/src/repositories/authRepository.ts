export interface GoogleAuthSession {
  gmail: string;
  nonce?: string;
  /** Password hash (scrypt), never the raw password. */
  password: string;
  scopes: string[];
  sessionId: string;
  state?: string;
  tokens?: Record<string, any>;
}

type MaybePromise<T> = T | Promise<T>;

export interface AuthRepository {
  create(gmail: string, password: string): MaybePromise<GoogleAuthSession>;
  findByGmail(gmail: string): MaybePromise<GoogleAuthSession | undefined>;
  findBySessionId(
    sessionId: string,
  ): MaybePromise<GoogleAuthSession | undefined>;
  update(
    sessionId: string,
    patch: Partial<Omit<GoogleAuthSession, 'sessionId'>>,
  ): MaybePromise<GoogleAuthSession | undefined>;
}
