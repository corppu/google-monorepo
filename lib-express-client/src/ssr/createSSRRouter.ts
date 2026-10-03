import { Router } from 'express';
import { loadDashboardData, sessionIdOf } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';
import { createSSRRenderer } from './createSSRRenderer';

/**
 * Handles /ssr/*. The host app shares the Google handler context via
 * `app.locals.googleContext`, so the host only has to mount this router.
 */
export function createSSRRouter(): Router {
  const router = Router();
  const render = createSSRRenderer();
  router.get('/', (_req, res) => res.redirect('/ssr/google'));
  router.get('/google', (_req, res) => res.send(render('/google')));
  router.get('/google/scopes', (_req, res) =>
    res.send(render('/google/scopes')),
  );
  router.get('/dashboard', async (req, res) => {
    const ctx = req.app.locals.googleContext as
      GoogleHandlerContext | undefined;
    const sid = ctx && sessionIdOf(ctx, req);
    try {
      if (!ctx || !sid) return void res.redirect('/ssr/google');
      res.send(render('/dashboard', await loadDashboardData(ctx, sid)));
    } catch {
      res.redirect('/ssr/google');
    }
  });
  return router;
}
