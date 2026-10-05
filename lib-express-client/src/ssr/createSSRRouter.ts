import { Router } from 'express';
import { MOCK_DASHBOARD_DATA } from '@gm/lib-common-google';
import { loadDashboardData, sessionIdOf } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';
import { createSSRRenderer } from './createSSRRenderer';

/**
 * Handles /ssr/*. The host app shares the Google handler context via
 * `app.locals.googleContext`, so the host only has to mount this router.
 */
export function createSSRRouter(stylesheets: string[] = []): Router {
  const router = Router();
  const render = createSSRRenderer(stylesheets);
  router.get('/', (_req, res) => res.redirect('/ssr/google'));
  router.get('/google', (_req, res) => res.send(render('/google')));
  router.get('/google/scopes', (_req, res) =>
    res.send(render('/google/scopes')),
  );
  router.get(['/dashboard', '/google/dashboard'], async (req, res) => {
    const renderPath =
      req.path === '/google/dashboard' ? '/google/dashboard' : '/dashboard';
    if (req.query.mock === 'true') {
      return void res.send(render(renderPath, MOCK_DASHBOARD_DATA));
    }
    const ctx = req.app.locals.googleContext as
      GoogleHandlerContext | undefined;
    const sid = ctx && sessionIdOf(ctx, req);
    try {
      if (!ctx || !sid) return void res.redirect('/ssr/google');
      res.send(render(renderPath, await loadDashboardData(ctx, sid)));
    } catch {
      res.redirect('/ssr/google');
    }
  });
  return router;
}
