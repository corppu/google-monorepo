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
          id: 'dashboard',
          lazy: () => import('./dashboard/route'),
          path: 'dashboard',
        },
      ],
      id: 'root',
      lazy: () => import('./root/route'),
      path: '',
    },
  ] satisfies RSCRouteConfig;
}
