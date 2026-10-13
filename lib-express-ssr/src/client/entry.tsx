import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, redirect } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { createSSRRoutes } from '../routes';
import {
  SSR_BASENAME,
  SSR_DATA_ELEMENT_ID,
  SSR_ROOT_ELEMENT_ID,
} from '../types';

const router = createBrowserRouter(
  createSSRRoutes({
    dashboard: async ({ request }) => {
      const response = await fetch(
        `${SSR_BASENAME}/_data/dashboard${new URL(request.url).search}`,
        { credentials: 'include', signal: request.signal },
      );
      if (response.status === 401) return redirect('/google');
      if (!response.ok) throw response;
      return response.json();
    },
    fallback: () => redirect('/google'),
  }),
  {
    basename: SSR_BASENAME,
    hydrationData: {
      loaderData: JSON.parse(
        document.getElementById(SSR_DATA_ELEMENT_ID)?.textContent ?? '{}',
      ),
    },
  },
);

hydrateRoot(
  document.getElementById(SSR_ROOT_ELEMENT_ID)!,
  <RouterProvider router={router} />,
);
