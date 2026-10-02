import { GoogleRouter } from '@gm/lib-native-google';
import { GoogleLandingScreen } from './routes/GoogleLandingScreen';
import { GoogleScopesScreen } from './routes/GoogleScopesScreen';
import { DashboardScreen } from './routes/DashboardScreen';

export default function App() {
  return <GoogleRouter screens={{ landing: GoogleLandingScreen, scopes: GoogleScopesScreen, dashboard: DashboardScreen }} />;
}
