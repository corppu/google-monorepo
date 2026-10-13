import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import {
  GoogleAuthService,
  GoogleInMemoryAuthRepository,
  PgGoogleAuthRepository,
  getPgPool,
  hasDatabase,
} from '@gm/lib-rest-google';
import { createApiRouter } from './routes/api';
import { createRSCRouter } from '@gm/lib-express-rsc';
import { createSSRRouter } from '@gm/lib-express-ssr';

const port = Number(process.env.PORT ?? 3000);
const secret = process.env.SESSION_SECRET ?? randomBytes(32).toString('hex');

// With DATABASE_URL (PostGIS) auth state and Express sessions are shared by all replicas.
const usePg = hasDatabase();
const PgSessionStore = connectPgSimple(session);

const auth = new GoogleAuthService(
  usePg ? new PgGoogleAuthRepository() : new GoogleInMemoryAuthRepository(),
  {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ??
      `http://localhost:${port}/api/google/auth/callback`,
  },
);
const ctx = { auth, jwtSecret: secret };

const app = express();
const clientDistPath = path.resolve(__dirname, '../../app-client/dist');
app.locals.googleContext = ctx;
app.set('trust proxy', 1);
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
