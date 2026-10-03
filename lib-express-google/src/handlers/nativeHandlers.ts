import type { Request, Response } from 'express';
import { signJwt } from './context';
import type { GoogleHandlerContext } from './context';

const NATIVE_REDIRECT_PREFIX = 'google://';
const str = (v: unknown): v is string => typeof v === 'string' && v.length > 0;

/** POST /api/google/auth/native/login: same credentials check as web, but returns a signed JWT instead of setting a cookie. */
export const nativeLoginHandler =
  (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
    const { gmail, password } = req.body ?? {};
    if (!str(gmail) || !str(password))
      return void res
        .status(400)
        .json({ error: 'gmail and password required' });
    try {
      const session = ctx.auth.login(gmail, password);
      res.json({
        sessionId: session.sessionId,
        token: signJwt(session.sessionId, ctx.jwtSecret),
      });
    } catch {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };

/** POST /api/google/auth/native/start: body { scopes, codeChallenge, redirectUri } -> { url } */
export const nativeStartHandler =
  (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
    const { codeChallenge, redirectUri, scopes } = req.body ?? {};
    if (
      !str(codeChallenge) ||
      !str(redirectUri) ||
      !redirectUri.startsWith(NATIVE_REDIRECT_PREFIX)
    ) {
      return void res
        .status(400)
        .json({ error: 'codeChallenge and a google:// redirectUri required' });
    }
    const sid = (res.locals as any).sid as string;
    ctx.auth.setScopes(
      sid,
      Array.isArray(scopes)
        ? scopes.filter((s: unknown) => typeof s === 'string')
        : [],
    );
    res.json({ url: ctx.auth.nativeStartUrl(sid, codeChallenge, redirectUri) });
  };

/** POST /api/google/auth/native/exchange: body { code, state, codeVerifier, redirectUri }. Tokens never leave the server. */
export const nativeExchangeHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    const { code, codeVerifier, redirectUri, state } = req.body ?? {};
    if (
      !str(code) ||
      !str(state) ||
      !str(codeVerifier) ||
      !str(redirectUri) ||
      !redirectUri.startsWith(NATIVE_REDIRECT_PREFIX)
    ) {
      return void res.status(400).json({
        error: 'code, state, codeVerifier and a google:// redirectUri required',
      });
    }
    try {
      await ctx.auth.nativeExchange(
        (res.locals as any).sid,
        code,
        state,
        codeVerifier,
        redirectUri,
      );
      res.json({ ok: true });
    } catch {
      res.status(400).json({ error: 'Authorization failed' });
    }
  };
