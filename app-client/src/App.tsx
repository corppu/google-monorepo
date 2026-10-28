import { GoogleRouter } from '@gm/lib-client-google';
import { MapsPage } from '@gm/lib-client-maps';
import { BrowserRouter } from 'react-router-dom';

import { DashboardPage } from './pages/DashboardPage';
import { GoogleLandingPage } from './pages/GoogleLandingPage';
import { GoogleScopesPage } from './pages/GoogleScopesPage';

export const App = () => (
  <BrowserRouter basename="/spa">
    <GoogleRouter
      pages={{
        dashboard: <DashboardPage />,
        landing: <GoogleLandingPage />,
        maps: <MapsPage />,
        scopes: <GoogleScopesPage />,
      }}
    />
  </BrowserRouter>
);
