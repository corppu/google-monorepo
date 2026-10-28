import { GoogleRouter } from '@gm/lib-native-google';

import { DashboardScreen } from './pages/DashboardScreen';
import { GoogleLandingScreen } from './pages/GoogleLandingScreen';
import { GoogleScopesScreen } from './pages/GoogleScopesScreen';

export default function App() {
  return (
    <GoogleRouter
      screens={{
        dashboard: DashboardScreen,
        landing: GoogleLandingScreen,
        scopes: GoogleScopesScreen,
      }}
    />
  );
}
