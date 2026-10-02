import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { MINIMUM_SCOPES, GOOGLE_SCOPES } from '@gm/lib-common-google';
import { Button, GenericScopesSelectorFieldset, ScreenTemplate } from '@gm/lib-native-common';
import { api, jsonHeaders, REDIRECT_URI } from '../session';
import { createPkcePair } from '../pkce';

export const GoogleScopesScreen = ({ navigation }: { navigation: { navigate: (n: string) => void } }) => {
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  const verifier = useRef<string>();
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (!url.startsWith(REDIRECT_URI) || !verifier.current) return;
      const params = new URL(url).searchParams;
      const r = await fetch(`${api.baseUrl}/api/google/auth/native/exchange`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ code: params.get('code'), state: params.get('state'), codeVerifier: verifier.current, redirectUri: REDIRECT_URI })
      });
      verifier.current = undefined;
      if (r.ok) navigation.navigate('Dashboard');
    });
    return () => sub.remove();
  }, [navigation]);

  const authorize = async () => {
    const { codeVerifier, codeChallenge } = await createPkcePair();
    verifier.current = codeVerifier;
    const r = await fetch(`${api.baseUrl}/api/google/auth/native/start`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ scopes: selected, codeChallenge, redirectUri: REDIRECT_URI })
    });
    if (r.ok) await Linking.openURL((await r.json()).url);
  };

  return (
    <ScreenTemplate title="Choose scopes">
      <GenericScopesSelectorFieldset scopes={GOOGLE_SCOPES} selected={selected} onToggle={toggle} />
      <Button title="Authorize" onPress={authorize} />
    </ScreenTemplate>
  );
};
