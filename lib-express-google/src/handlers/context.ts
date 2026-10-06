import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { GoogleAuthService } from '@gm/lib-rest-google';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    gsid?: string;
    returnTo?: string;
  }
}

export interface GoogleHandlerContext {
  auth: GoogleAuthService;
  jwtSecret: string;
}

const b64 = (v: string | Buffer) => Buffer.from(v).toString('base64url');

export function signJwt(sessionId: string, secret: string): string {
  const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64(
    JSON.stringify({ iat: Math.floor(Date.now() / 1000), sid: sessionId }),
  );
  const sig = createHmac('sha256', secret)
    .update(`${head}.${body}`)
    .digest('base64url');
  return `${head}.${body}.${sig}`;
}

export function verifyJwt(token: string, secret: string): string | undefined {
  const [head, body, sig] = token.split('.');
  if (!head || !body || !sig) return undefined;
  const expected = createHmac('sha256', secret)
    .update(`${head}.${body}`)
    .digest();
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return undefined;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString()).sid;
  } catch {
    return undefined;
  }
}

/** Resolves the Google session id from a JWT in the Authorization header (native) or the session cookie (SPA/SSR). */
export function sessionIdOf(
  ctx: GoogleHandlerContext,
  req: Request,
): string | undefined {
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) return verifyJwt(h.slice(7), ctx.jwtSecret);
  return req.session?.gsid;
}

export function requireSession(ctx: GoogleHandlerContext) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.query.mock === 'true') return next();
    const sid = sessionIdOf(ctx, req);
    if (!sid || !ctx.auth.getSession(sid))
      return void res.status(401).json({ error: 'Unauthenticated' });
    (res.locals as any).sid = sid;
    next();
  };
}
