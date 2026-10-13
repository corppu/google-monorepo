import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { getPgPool, hasDatabase } from '@gm/lib-rest-google';
import {
  InMemoryOidcRepository,
  OidcAuthService,
  PgOidcRepository,
} from '@gm/lib-rest-auth';
import { createApiRouter } from './routes/api';
import { createRSCRouter } from '@gm/lib-express-rsc';
import { createSSRRouter } from '@gm/lib-express-ssr';

const port = Number(process.env.PORT ?? 3000);
const production = process.env.NODE_ENV === 'production';

/** Reads a secret from env, or from the file named by `<NAME>_FILE` (Docker secrets). */
function secretOf(name: string): string {
  const file = process.env[`${name}_FILE`];
  const value = file ? readFileSync(file, 'utf8').trim() : process.env[name];
  if (value) return value;
  if (production) throw new Error(`${name} (or ${name}_FILE) is required`);
  console.warn(
    `${name} not set; using a random value (not shared by replicas)`,
  );
  return randomBytes(32).toString('hex');
}

const secret = secretOf('SESSION_SECRET');

// With DATABASE_URL (PostGIS) logins and Express sessions are shared by all replicas.
const usePg = hasDatabase();
const PgSessionStore = connectPgSimple(session);

const auth = new OidcAuthService(
  usePg ? new PgOidcRepository(getPgPool()) : new InMemoryOidcRepository(),
  {
    allowedRedirectUris: (
      process.env.NATIVE_REDIRECT_URIS ?? 'google://callback'
    )
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: secretOf('GOOGLE_CLIENT_SECRET'),
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ??
      `http://localhost:${port}/api/auth/callback`,
    tokenEncryptionKey: secretOf('TOKEN_ENCRYPTION_KEY'),
  },
);
const ctx = {
  auth,
  defaultReturnTo: '/spa/google/dashboard',
  jwtSecret: secret,
};
const app = express();
const clientDistPath = path.resolve(__dirname, '../../app-client/dist');
app.locals.googleContext = ctx;
app.set('trust proxy', 1);
app.disable('x-powered-by');
// Strict CSP; RSC streams inline bootstrap scripts, so only /rsc may run inline scripts.
const csp = (scriptSrc: string[]) => {
  const directives: Record<string, Iterable<string> | null> = {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'img-src': ["'self'", 'data:', 'https:'],
    'script-src': scriptSrc,
    'style-src': ["'self'", "'unsafe-inline'"],
  };
  if (!production) directives['upgrade-insecure-requests'] = null;
  return helmet({ contentSecurityPolicy: { directives } });
};
app.use('/rsc', csp(["'self'", "'unsafe-inline'"]));
app.use((req, res, next) =>
  req.path.startsWith('/rsc') ? next() : csp(["'self'"])(req, res, next),
);
app.use(express.json());
app.use(
  session({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure:
        process.env.COOKIE_SECURE !== undefined
          ? process.env.COOKIE_SECURE === 'true'
          : process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    secret,
    ...(usePg && {
      store: new PgSessionStore({
        createTableIfMissing: true,
        pool: getPgPool(),
        tableName: 'http_sessions',
      }),
    }),
  }),
);

app.use('/api', createApiRouter(ctx));
app.use('/ssr', createSSRRouter());
app.use('/rsc', createRSCRouter());
app.use('/spa', express.static(clientDistPath));
app.get('/spa/*splat', (_req, res) =>
  res.sendFile(path.join(clientDistPath, 'index.html')),
);
app.get('/', (_req, res) => res.redirect('/spa/google'));

app.listen(port, () => console.log(`listening on :${port}`));
