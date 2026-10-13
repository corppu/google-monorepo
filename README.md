# google-monorepo

Base monorepo for developing Google related content.

## Layout

`app-express` (SSR `/ssr`, SPA `/spa`, API `/api`), `app-client` (React SPA), `app-native` (React Native), plus `lib-*` packages.

```bash
npm install
npm run build:client   # builds app-client into app-client/dist
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... npm start
npm run typecheck
```

## Authentication

Pure OpenID Connect (authorization code + PKCE, no local passwords) via `lib-rest-auth` / `lib-express-auth`. Users are keyed by the Google `sub`; the granted access/refresh tokens are encrypted (AES-256-GCM) and used to call googleapis.

Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TOKEN_ENCRYPTION_KEY`, `SESSION_SECRET`, optional `GOOGLE_REDIRECT_URI` (default `http://localhost:PORT/api/auth/callback`), `NATIVE_REDIRECT_URIS` (default `google://callback`), `ALLOW_MOCK`. Secrets also accept a `NAME_FILE` variant. Register the redirect URI in the Google Cloud console.
