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
