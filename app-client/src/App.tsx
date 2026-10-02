import { BrowserRouter } from 'react-router-dom';
import { GoogleRouter } from '@gm/lib-client-google';
import { GoogleLandingPage } from './routes/GoogleLandingPage';
import { GoogleScopesPage } from './routes/GoogleScopesPage';
import { DashboardPage } from './routes/DashboardPage';

export const App = () => (
  <BrowserRouter basename="/spa">
    <GoogleRouter pages={{ landing: <GoogleLandingPage />, scopes: <GoogleScopesPage />, dashboard: <DashboardPage /> }} />
  </BrowserRouter>
);
