import { GoogleRouter } from '@gm/lib-native-google';
import { GoogleLandingScreen } from './pages/GoogleLandingScreen';
import { GoogleScopesScreen } from './pages/GoogleScopesScreen';
import { DashboardScreen } from './pages/DashboardScreen';

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
