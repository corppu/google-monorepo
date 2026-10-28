import type { OidcAuthService } from '@gm/lib-rest-auth';
import type { Request, Response, NextFunction } from 'express';

import { createHmac, timingSafeEqual } from 'node:crypto';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    /** `state` of the login started in this browser; binds the callback to it. */
    oidcState?: string;
    /** The OIDC `sub` of the signed-in user. */
    userId?: string;
  }
}

export interface AuthContext {
  auth: OidcAuthService;
  /** Where to send the browser when no `returnTo` was given. */
  defaultReturnTo?: string;
  /** Secret signing the short-lived tokens issued to native apps. */
  jwtSecret: string;
  /** Lifetime of native access tokens in seconds (default 15 minutes). */
  nativeTokenTtlSeconds?: number;
}

const b64 = (v: string | Buffer) => Buffer.from(v).toString('base64url');

/** HS256 JWT carrying the user id (`sub`) and an expiry. */
export function signJwt(
  userId: string,
  secret: string,
  ttlSeconds = 900,
  familyId?: string,
) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64(
    JSON.stringify({
      exp: now + ttlSeconds,
      fam: familyId,
      iat: now,
      sub: userId,
    }),
  );
  const sig = createHmac('sha256', secret)
    .update(`${head}.${body}`)
    .digest('base64url');
  return `${head}.${body}.${sig}`;
}

/** Returns the claims of a valid, unexpired token. */
export function verifyJwtClaims(
  token: string,
  secret: string,
): { familyId?: string; sub: string } | undefined {
  const [head, body, sig] = token.split('.');
  if (!head || !body || !sig) return undefined;
  const expected = createHmac('sha256', secret)
    .update(`${head}.${body}`)
    .digest();
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return undefined;
  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof claims.exp !== 'number' || claims.exp < Date.now() / 1000)
      return undefined;
    return typeof claims.sub === 'string'
      ? {
          familyId: typeof claims.fam === 'string' ? claims.fam : undefined,
          sub: claims.sub,
        }
      : undefined;
  } catch {
    return undefined;
  }
}

/** Returns the user id of a valid, unexpired token. */
export const verifyJwt = (token: string, secret: string) =>
  verifyJwtClaims(token, secret)?.sub;

/** User id from a Bearer token (native) or the session cookie (SPA/SSR/RSC). */
export function userIdOf(ctx: AuthContext, req: Request): string | undefined {
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) return verifyJwt(h.slice(7), ctx.jwtSecret);
  return req.session?.userId;
}

/** `?mock=true` serves mock data without auth; never enabled in production unless ALLOW_MOCK=true. */
export const isMockRequest = (req: Pick<Request, 'query'>) =>
  req.query.mock === 'true' &&
  (process.env.ALLOW_MOCK !== undefined
    ? process.env.ALLOW_MOCK === 'true'
    : process.env.NODE_ENV !== 'production');

/** Rejects with 401 unless the user exists; exposes the id as `res.locals.sid`. */
export function requireAuth(ctx: AuthContext) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isMockRequest(req)) return next();
    const h = req.headers.authorization;
    const claims = h?.startsWith('Bearer ')
      ? verifyJwtClaims(h.slice(7), ctx.jwtSecret)
      : undefined;
    // Native tokens die with their session: logout removes the refresh family.
    if (
      h &&
      (!claims?.familyId || !(await ctx.auth.isSessionActive(claims.familyId)))
    )
      return void res.status(401).json({ error: 'Unauthenticated' });
    const id = claims?.sub ?? userIdOf(ctx, req);
    if (!id || !(await ctx.auth.getUser(id)))
      return void res.status(401).json({ error: 'Unauthenticated' });
    (res.locals as any).sid = id;
    next();
  };
}
