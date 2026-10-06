import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import session from 'express-session';
import {
  GoogleAuthService,
  GoogleInMemoryAuthRepository,
} from '@gm/lib-rest-google';
import { createApiRouter } from './routes/api';
import { createSSRRouter } from '@gm/lib-express-client';

const port = Number(process.env.PORT ?? 3000);
const secret = process.env.SESSION_SECRET ?? randomBytes(32).toString('hex');

const auth = new GoogleAuthService(new GoogleInMemoryAuthRepository(), {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI ??
    `http://localhost:${port}/api/google/auth/callback`,
});
const ctx = { auth, jwtSecret: secret };

const app = express();
const clientDistPath = path.resolve(__dirname, '../../app-client/dist');
const clientManifestPath = path.join(clientDistPath, '.vite', 'manifest.json');
const clientManifest = existsSync(clientManifestPath)
  ? (JSON.parse(readFileSync(clientManifestPath, 'utf8')) as Record<
      string,
      { css?: string[] }
    >)
  : {};
const ssrStylesheets = (clientManifest['index.html']?.css ?? []).map(
  (file) => `/spa/${file}`,
);
app.locals.googleContext = ctx;
app.use(express.json());
app.use(
  session({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    secret,
  }),
);

app.use('/api', createApiRouter(ctx));
app.use('/ssr', createSSRRouter(ssrStylesheets));
app.use('/spa', express.static(clientDistPath));
app.get('/spa/*splat', (_req, res) =>
  res.sendFile(path.join(clientDistPath, 'index.html')),
);
app.get('/', (_req, res) => res.redirect('/spa/google'));

async function mountRsc() {
  const rscDistPath = path.resolve(__dirname, '../../app-rsc/dist');
  if (existsSync(path.join(rscDistPath, 'rsc', 'index.js'))) {
    // The client bundle is a production build, so the RSC server must emit production payloads too.
    process.env.NODE_ENV ??= 'production';
    // The RSC build is ESM; import it natively from this CommonJS entry.
    const nativeImport = new Function('p', 'return import(p)') as (
      p: string,
    ) => Promise<any>;
    const { createRequestListener } = await nativeImport(
      '@remix-run/node-fetch-server',
    );
    const rsc = await nativeImport(
      pathToFileURL(path.join(rscDistPath, 'rsc', 'index.js')).href,
    );
    app.use(
      '/rsc',
      express.static(path.join(rscDistPath, 'client'), { index: false }),
    );
    app.all('/rsc{/*splat}', createRequestListener(rsc.default));
  } else {
    console.warn('app-rsc is not built; /rsc is disabled (npm run build:rsc).');
  }
}

mountRsc().then(() =>
  app.listen(port, () => console.log(`listening on :${port}`)),
);
