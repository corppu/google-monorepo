import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express, { type RequestHandler, Router } from 'express';

export const RSC_BASENAME = '/rsc';

const distPath = path.resolve(__dirname, '../dist');
const serverEntry = path.join(distPath, 'rsc', 'index.js');

// The RSC build is ESM; import it natively from a CommonJS host.
const nativeImport = new Function('p', 'return import(p)') as (
  p: string,
) => Promise<any>;

export function isRSCBuilt() {
  return existsSync(serverEntry);
}

/**
 * Express router serving the React Router RSC app. Mount it at `/rsc`.
 * Requires `npm run build:rsc` first.
 */
export function createRSCRouter(): Router {
  const router = Router();
  if (!isRSCBuilt()) {
    console.warn(
      'lib-express-rsc is not built; /rsc is disabled (npm run build:rsc).',
    );
    return router;
  }

  // The client bundle is a production build, so the server must emit production payloads too.
  process.env.NODE_ENV ??= 'production';

  let handler: Promise<RequestHandler> | undefined;
  const load = () =>
    (handler ??= (async () => {
      const { createRequestListener } = await nativeImport(
        '@remix-run/node-fetch-server',
      );
      const rsc = await nativeImport(pathToFileURL(serverEntry).href);
      return createRequestListener(rsc.default) as RequestHandler;
    })());

  router.use(express.static(path.join(distPath, 'client'), { index: false }));
  router.all('/{*splat}', (req, res, next) => {
    // The RSC app routes with its own `/rsc` basename, so it needs the unstripped URL.
    req.url = req.originalUrl;
    load()
      .then((h) => h(req, res, next))
      .catch(next);
  });
  return router;
}
