import { BrowserRouter } from 'react-router-dom';
import { GoogleRouter } from '@gm/lib-client-google';
import { GoogleLandingPage } from './pages/GoogleLandingPage';
import { GoogleScopesPage } from './pages/GoogleScopesPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapsPage } from '@gm/lib-client-maps';

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
