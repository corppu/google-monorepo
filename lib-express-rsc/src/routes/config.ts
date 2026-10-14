import type { unstable_RSCRouteConfig as RSCRouteConfig } from 'react-router';

export function routes() {
  return [
    {
      children: [
        {
          id: 'home',
          index: true,
          lazy: () => import('./redirect/route'),
        },
        {
          id: 'landing',
          lazy: () => import('./landing/route'),
          path: 'google',
        },
        {
          id: 'scopes',
          lazy: () => import('./scopes/route'),
          path: 'google/scopes',
        },
        {
          id: 'dashboard',
          lazy: () => import('./dashboard/route'),
          path: 'google/dashboard',
        },
      ],
      id: 'root',
      lazy: () => import('./root/route'),
      path: '',
    },
  ] satisfies RSCRouteConfig;
}
