import { ScreenTemplate } from '@gm/lib-native-common';
import { GenericAuthArticleForm } from '@gm/lib-native-google';
import { api } from '../session';

export const GoogleLandingScreen = ({ navigation }: { navigation: { navigate: (n: string) => void } }) => {
  const login = async (gmail: string, password: string) => {
    const r = await fetch(`${api.baseUrl}/api/google/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail, password, client: 'native' })
    });
    if (!r.ok) return;
    api.token = (await r.json()).token;
    navigation.navigate('Scopes');
  };
  return (
    <ScreenTemplate title="Sign in with Google">
      <GenericAuthArticleForm onSubmit={login} />
    </ScreenTemplate>
  );
};
