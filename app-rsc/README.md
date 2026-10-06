# app-rsc

Server-rendered Dashboard (mock data) using [React Router RSC Data Mode](https://reactrouter.com/how-to/react-server-components), `@vitejs/plugin-rsc` and Vite.

## Run

```sh
npm run build:rsc   # from the repo root
npm run start:rsc   # standalone: http://localhost:3001/rsc (PORT to override)
```

`/` redirects to `/dashboard?mock=true`. Use `npm run dev --workspace=app-rsc` for development.

## How it works

- Follows the official `unstable_rsc-data-mode-vite` template: `entry.rsc.tsx` (server components), `entry.ssr.tsx` (HTML), `entry.browser.tsx` (hydration).
- The `dashboard` route ([route.tsx](./src/routes/dashboard/route.tsx)) loads data in its `loader` through the `@gm/lib-rest-google` services backed by the shared `Mock*Repository` classes. `?groupEmail=`, `?calendarId=`, `?eventId=` and `?createEvent=true` set the selection.
- [DashboardClient.tsx](./src/routes/dashboard/DashboardClient.tsx) renders the existing `GoogleDashboardPage`; selection navigates via the URL and saving calls the `saveEvent` server action ([actions.ts](./src/routes/dashboard/actions.ts)), which creates/updates the event in the mock repository.
- The server HTML already contains the mock data, then the page hydrates and becomes interactive.

## Notes

- Served under the `/rsc` base (Vite `base: '/rsc/'`, React Router `basename: '/rsc'`).
- Also mounted in `app-express` at `http://localhost:3000/rsc` (run `npm run build:rsc` first; otherwise `/rsc` is disabled with a warning). It does not replace the `/ssr` router.
- Mock data only: no Google API or auth integration. Its mock repository state is separate from the one behind `/api`.
- Runs with `NODE_ENV=production` (set by `server.js` and `app-express`) because the client bundle is a production build; a dev-mode server payload breaks hydration.
- React Router's RSC APIs are unstable and may change in minor releases.
