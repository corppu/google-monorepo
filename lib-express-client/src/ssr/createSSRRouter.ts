import { Router } from 'express';
import { createSSRRenderer } from './createSSRRenderer';
import type { DashboardData } from './createSSRRenderer';

export interface SSRRouterOptions {
  /** Returns dashboard data for the request, or undefined when unauthenticated. */
  loadDashboard: (req: import('express').Request) => Promise<DashboardData | undefined>;
}

export function createSSRRouter(options: SSRRouterOptions): Router {
  const router = Router();
  const render = createSSRRenderer();
  router.get('/', (_req, res) => res.redirect('/ssr/google'));
  router.get('/google', (_req, res) => res.send(render.landing()));
  router.get('/google/scopes', (_req, res) => res.send(render.scopes()));
  router.get('/dashboard', async (req, res) => {
    try {
      const data = await options.loadDashboard(req);
      if (!data) return void res.redirect('/ssr/google');
      res.send(render.dashboard(data));
    } catch {
      res.redirect('/ssr/google');
    }
  });
  return router;
}
