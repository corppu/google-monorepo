import { useEffect } from 'react';
import { Button, ScreenTemplate } from '@gm/lib-native-common';
import { refreshSession } from '../session';

export const GoogleLandingScreen = ({
  navigation,
}: {
  navigation: { navigate: (n: string) => void };
}) => {
  useEffect(() => {
    void refreshSession().then((ok) => ok && navigation.navigate('Dashboard'));
  }, [navigation]);
  return (
    <ScreenTemplate title="Sign in with Google">
      <Button
        title="Continue with Google"
        onPress={() => navigation.navigate('Scopes')}
      />
    </ScreenTemplate>
  );
};
