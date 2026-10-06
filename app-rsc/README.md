# app-rsc

Server-rendered Dashboard (mock data) using [React Router RSC Data Mode](https://reactrouter.com/how-to/react-server-components), `@vitejs/plugin-rsc` and Vite.

## Run

```sh
npm run build:rsc   # from the repo root
npm run start:rsc   # http://localhost:3001 (PORT to override)
```

`/` redirects to `/dashboard?mock=true`. Use `npm run dev --workspace=app-rsc` for development.

## How it works

- Follows the official `unstable_rsc-data-mode-vite` template: `entry.rsc.tsx` (server components), `entry.ssr.tsx` (HTML), `entry.browser.tsx` (hydration).
- The `dashboard` route ([route.tsx](./src/routes/dashboard/route.tsx)) is a server component that passes `MOCK_DASHBOARD_DATA` to the client component [DashboardClient.tsx](./src/routes/dashboard/DashboardClient.tsx).
- `DashboardClient` renders the existing `GoogleDashboardPage` and handles selection and mock event create/update. `?eventId=` and `?createEvent=true` set the initial selection.
- The server HTML already contains the mock data, then the page hydrates and becomes interactive.

## Notes

- Runs as a separate server (port 3001); it does not replace the Express `/ssr` router.
- Mock data only: no Google API or auth integration.
- React Router's RSC APIs are unstable and may change in minor releases.
