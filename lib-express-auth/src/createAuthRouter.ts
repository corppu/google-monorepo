import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AuthError, safeReturnTo } from '@gm/lib-rest-auth';
import { requireAuth, signJwt, userIdOf, verifyJwtClaims } from './context';
import type { AuthContext } from './context';

const str = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const scopeList = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.filter(str)
    : str(v)
      ? v.split(/[\s,]+/).filter(Boolean)
      : [];

const regenerate = (req: Request) =>
  new Promise<void>((resolve, reject) =>
    req.session.regenerate((e) => (e ? reject(e) : resolve())),
  );
const save = (req: Request) =>
  new Promise<void>((resolve, reject) =>
    req.session.save((e) => (e ? reject(e) : resolve())),
  );
const destroy = (req: Request) =>
  new Promise<void>((resolve) => req.session.destroy(() => resolve()));

/**
 * CSRF defence for cookie-authenticated unsafe requests: a browser always sends `Origin`
 * on cross-site POSTs, so a foreign Origin is rejected; sessions also need a custom header
 * (`X-Requested-With`), which cross-site forms cannot set. Bearer (native) requests carry no cookies.
 */
export function csrfGuard(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers.authorization?.startsWith('Bearer ')) return next();
  const origin = req.headers.origin;
  if (origin && origin !== `${req.protocol}://${req.get('host')}`)
    return void res.status(403).json({ error: 'Cross-origin request blocked' });
  if (req.session?.userId && !req.headers['x-requested-with'])
    return void res.status(403).json({ error: 'Missing X-Requested-With' });
  next();
}

/**
 * Mounted under /api; serves /api/auth/*:
 * GET login, GET callback, POST logout, GET me, POST native/start, POST native/exchange, POST native/refresh.
 */
export function createAuthRouter(ctx: AuthContext): Router {
  const router = Router();
  const nativeTokens = (s: {
    familyId: string;
    refreshToken: string;
    userId: string;
  }) => ({
    refreshToken: s.refreshToken,
    token: signJwt(
      s.userId,
      ctx.jwtSecret,
      ctx.nativeTokenTtlSeconds,
      s.familyId,
    ),
  });
  const limiter = rateLimit({
    legacyHeaders: false,
    limit: 30,
    standardHeaders: 'draft-7',
    windowMs: 60_000,
  });
  router.use('/auth', limiter);

  /** Starts the Authorization Code flow with PKCE; `scopes` may be a comma/space separated list. */
  router.get('/auth/login', async (req: Request, res: Response) => {
    try {
      const { state, url } = await ctx.auth.beginLogin({
        returnTo: safeReturnTo(req.query.returnTo),
        scopes: scopeList(req.query.scopes),
      });
      req.session.oidcState = state;
      res.redirect(url);
    } catch {
      res.status(400).json({ error: 'Could not start login' });
    }
  });

  router.get('/auth/callback', async (req: Request, res: Response) => {
    const { code, state } = req.query;
    if (
      !str(code) ||
      !str(state) ||
      !req.session.oidcState ||
      req.session.oidcState !== state
    )
      return void res.status(400).json({ error: 'Invalid callback' });
    try {
      const { returnTo, user } = await ctx.auth.completeLogin({ code, state });
      // New session id after login prevents session fixation.
      await regenerate(req);
      req.session.userId = user.id;
      await save(req);
      res.redirect(returnTo ?? ctx.defaultReturnTo ?? '/');
    } catch (e) {
      res.status(e instanceof AuthError ? 400 : 502).json({
        error: 'Authorization failed',
      });
    }
  });

  router.post('/auth/logout', async (req: Request, res: Response) => {
    const h = req.headers.authorization;
    const family = h?.startsWith('Bearer ')
      ? verifyJwtClaims(h.slice(7), ctx.jwtSecret)?.familyId
      : undefined;
    if (family) await ctx.auth.revokeSession(family).catch(() => undefined);
    const id = userIdOf(ctx, req);
    if (id) await ctx.auth.logout(id).catch(() => undefined);
    await destroy(req);
    res.clearCookie('connect.sid').json({ ok: true });
  });

  router.get('/auth/me', requireAuth(ctx), async (req, res) => {
    const user = await ctx.auth.getUser(userIdOf(ctx, req)!);
    if (!user) return void res.status(401).json({ error: 'Unauthenticated' });
    res.json({
      email: user.email,
      id: user.id,
      name: user.name,
      picture: user.picture,
      scopes: user.scopes,
    });
  });

  /** Native: body { scopes, codeChallenge, redirectUri } -> { url }. */
  router.post('/auth/native/start', async (req: Request, res: Response) => {
    const { codeChallenge, redirectUri, scopes } = req.body ?? {};
    if (!str(codeChallenge) || !str(redirectUri))
      return void res
        .status(400)
        .json({ error: 'codeChallenge and redirectUri required' });
    try {
      const { url } = await ctx.auth.beginLogin({
        codeChallenge,
        redirectUri,
        scopes: scopeList(scopes),
      });
      res.json({ url });
    } catch {
      res.status(400).json({ error: 'Could not start login' });
    }
  });

  /** Native: body { code, state, codeVerifier, redirectUri } -> { token }. Google tokens stay on the server. */
  router.post('/auth/native/exchange', async (req: Request, res: Response) => {
    const { code, codeVerifier, redirectUri, state } = req.body ?? {};
    if (!str(code) || !str(state) || !str(codeVerifier) || !str(redirectUri))
      return void res.status(400).json({
        error: 'code, state, codeVerifier and redirectUri required',
      });
    try {
      const { user } = await ctx.auth.completeLogin({
        code,
        codeVerifier,
        redirectUri,
        state,
      });
      const session = await ctx.auth.issueRefreshToken(user.id);
      res.json(nativeTokens(session));
    } catch {
      res.status(400).json({ error: 'Authorization failed' });
    }
  });

  /** Native: body { refreshToken } -> { token, refreshToken }. Refresh tokens are single use and rotate. */
  router.post('/auth/native/refresh', async (req: Request, res: Response) => {
    const { refreshToken } = req.body ?? {};
    if (!str(refreshToken))
      return void res.status(400).json({ error: 'refreshToken required' });
    try {
      res.json(nativeTokens(await ctx.auth.rotateRefreshToken(refreshToken)));
    } catch {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  });

  return router;
}
