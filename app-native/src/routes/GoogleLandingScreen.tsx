import { GenericAuthArticleForm, ScreenTemplate } from '@gm/lib-native-common';
import { api } from '../session';

export const GoogleLandingScreen = ({
  navigation,
}: {
  navigation: { navigate: (n: string) => void };
}) => {
  const login = async (gmail: string, password: string) => {
    const r = await fetch(`${api.baseUrl}/api/google/auth/native/login`, {
      body: JSON.stringify({ gmail, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    if (!r.ok) return;
    api.token = (await r.json()).token;
    navigation.navigate('Scopes');
  };
  return (
    <ScreenTemplate title="Sign in with Google">
      <GenericAuthArticleForm identifierLabel="Gmail" onSubmit={login} />
    </ScreenTemplate>
  );
};
