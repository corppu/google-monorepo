import type { LoaderFunction, RouteObject } from 'react-router';
import { SSRDashboardPage } from './pages/SSRDashboardPage';
import { SSRLandingPage } from './pages/SSRLandingPage';
import { SSRScopesPage } from './pages/SSRScopesPage';

export interface SSRRouteLoaders {
  dashboard: LoaderFunction;
  /** Runs for unknown paths; expected to redirect to the landing page. */
  fallback: LoaderFunction;
}

export interface SSRRouteHandle {
  title: string;
}

/** Shared by the server (static handler) and the browser (hydrated router). */
export const createSSRRoutes = ({
  dashboard,
  fallback,
}: SSRRouteLoaders): RouteObject[] => [
  {
    element: <SSRLandingPage />,
    handle: { title: 'Sign in with Google' } satisfies SSRRouteHandle,
    id: 'landing',
    path: '/google',
  },
  {
    element: <SSRScopesPage />,
    handle: { title: 'Choose scopes' } satisfies SSRRouteHandle,
    id: 'scopes',
    path: '/google/scopes',
  },
  {
    element: <SSRDashboardPage />,
    handle: { title: 'Dashboard' } satisfies SSRRouteHandle,
    id: 'google-dashboard',
    loader: dashboard,
    path: '/google/dashboard',
  },
  { id: 'fallback', loader: fallback, path: '*' },
];
