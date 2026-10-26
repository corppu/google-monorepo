import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
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
app.locals.googleContext = ctx;
app.set('trust proxy', 1);
app.disable('x-powered-by');
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

const spaClientDistPath = path.resolve(__dirname, '../../app-client/dist');
app.use('/spa', express.static(spaClientDistPath));
app.get('/spa/*splat', (_req, res) =>
  res.sendFile(path.join(spaClientDistPath, 'index.html')),
);

const storybookDistPath = path.resolve(__dirname, '../../app-storybook/dist');
app.use('/storybook', express.static(storybookDistPath));
app.get('/storybook/*splat', (_req, res) =>
  res.sendFile(path.join(storybookDistPath, 'index.html')),
);

app.get('/', (_req, res) => res.redirect('/spa/google'));

app.listen(port, () => console.log(`listening on :${port}`));
