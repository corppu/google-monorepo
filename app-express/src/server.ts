import { randomBytes } from 'node:crypto';
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import { GoogleAuthService, GoogleInMemoryAuthRepository } from '@gm/lib-rest-google';
import { createApiRouter } from './routes/api';
import { createSsr } from './ssr/ssr';

const port = Number(process.env.PORT ?? 3000);
const secret = process.env.SESSION_SECRET ?? randomBytes(32).toString('hex');

const auth = new GoogleAuthService(new GoogleInMemoryAuthRepository(), {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI ?? `http://localhost:${port}/api/google/auth/callback`
});
const ctx = { auth, jwtSecret: secret };

const app = express();
app.use(express.json());
app.use(session({ secret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } }));

app.use('/api', createApiRouter(ctx));
app.use('/ssr', createSsr(ctx));
app.use('/spa', express.static(path.resolve(__dirname, '../../app-client/dist')));
app.get('/spa/*', (_req, res) => res.sendFile(path.resolve(__dirname, '../../app-client/dist/index.html')));
app.get('/', (_req, res) => res.redirect('/spa/google'));

app.listen(port, () => console.log(`listening on :${port}`));
