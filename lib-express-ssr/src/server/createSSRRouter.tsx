import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import express, { Router } from 'express';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  redirect,
  StaticRouterProvider,
} from 'react-router';
import { createSSRRoutes } from '../routes';
import type { SSRRouteHandle } from '../routes';
import {
  SSR_BASENAME,
  SSR_DATA_ELEMENT_ID,
  SSR_ROOT_ELEMENT_ID,
} from '../types';
import { readSSRAssets, ssrClientDistPath } from './assets';
import type { SSRAssets } from './assets';
import { loadSSRDashboard } from './loadSSRDashboard';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Makes JSON safe to embed in a <script type="application/json"> element. */
const escapeJson = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

function toFetchRequest(req: ExpressRequest, res: ExpressResponse): Request {
  const controller = new AbortController();
  res.on('close', () => controller.abort());
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(name, v));
    else if (value !== undefined) headers.set(name, value);
  }
  return new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
    headers,
    method: req.method,
    signal: controller.signal,
  });
}

/**
 * Server-renders the React Router app of this package and serves its client
 * bundle for hydration. The host only has to share the Google handler context
 * via `app.locals.googleContext` and mount this router on /ssr.
 */
export function createSSRRouter(assets: SSRAssets = readSSRAssets()): Router {
  const router = Router();
  router.use(
    '/assets',
    express.static(ssrClientDistPath, { index: false, maxAge: '1y' }),
  );

  router.get('/_data/dashboard', async (req, res) => {
    const data = await loadSSRDashboard(req);
    if (!data) return void res.status(401).json({ error: 'Unauthenticated' });
    res.json(data);
  });

  router.get('/{*splat}', async (req, res) => {
    const handler = createStaticHandler(
      createSSRRoutes({
        dashboard: async () =>
          (await loadSSRDashboard(req)) ?? redirect('/google'),
        fallback: () => redirect('/google'),
      }),
      { basename: SSR_BASENAME },
    );
    const context = await handler.query(toFetchRequest(req, res));
    if (context instanceof Response) {
      return void res.redirect(
        context.status,
        context.headers.get('Location') ?? `${SSR_BASENAME}/google`,
      );
    }
    const body = renderToString(
      <StaticRouterProvider
        context={context}
        hydrate={false}
        router={createStaticRouter(handler.dataRoutes, context)}
      />,
    );
    const handle = context.matches.at(-1)?.route.handle as
      SSRRouteHandle | undefined;
    const stylesheets = assets.stylesheets
      .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`)
      .join('');
    const hydration = assets.script
      ? `<script type="application/json" id="${SSR_DATA_ELEMENT_ID}">${escapeJson(context.loaderData)}</script><script type="module" src="${escapeHtml(assets.script)}"></script>`
      : '';
    res
      .status(context.statusCode)
      .type('html')
      .send(
        `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><title>${escapeHtml(handle?.title ?? 'Google')}</title>${stylesheets}</head><body><div id="${SSR_ROOT_ELEMENT_ID}">${body}</div>${hydration}</body></html>`,
      );
  });
  return router;
}
