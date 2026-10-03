import type { ComponentType } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export interface GoogleRouterScreens {
  dashboard: ComponentType<any>;
  landing: ComponentType<any>;
  scopes: ComponentType<any>;
}

/** Deep links: google://landing, google://scopes, google://dashboard. */
export const GoogleRouter = ({ screens }: { screens: GoogleRouterScreens }) => (
  <NavigationContainer
    linking={{
      config: {
        screens: {
          Dashboard: 'dashboard',
          Landing: 'landing',
          Scopes: 'scopes',
        },
      },
      prefixes: ['google://'],
    }}
  >
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={screens.landing} />
      <Stack.Screen name="Scopes" component={screens.scopes} />
      <Stack.Screen name="Dashboard" component={screens.dashboard} />
    </Stack.Navigator>
  </NavigationContainer>
);
