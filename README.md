# google-monorepo
Base monorepo for developing Google related content.

## Layout
`app-express` (SSR `/ssr`, SPA `/spa`, API `/api`), `app-client` (React SPA), `app-native` (React Native), plus `lib-*` packages.

```
pnpm install
pnpm build:client   # builds app-client into app-client/dist
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... pnpm start
pnpm typecheck
```
