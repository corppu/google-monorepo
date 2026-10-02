import { useState } from 'react';
import { Linking } from 'react-native';
import { MINIMUM_SCOPES, GOOGLE_SCOPES } from '@gm/lib-common-google';
import { Button, ScreenTemplate } from '@gm/lib-native-common';
import { GenericScopesSelectorFieldset } from '@gm/lib-native-google';
import { api } from '../session';

export const GoogleScopesScreen = () => {
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const authorize = async () => {
    await fetch(`${api.baseUrl}/api/google/auth/scopes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api.token}` },
      body: JSON.stringify({ scopes: selected })
    });
    await Linking.openURL(`${api.baseUrl}/api/google/auth/start?target=spa`);
  };
  return (
    <ScreenTemplate title="Choose scopes">
      <GenericScopesSelectorFieldset scopes={GOOGLE_SCOPES} selected={selected} onToggle={toggle} />
      <Button title="Authorize" onPress={authorize} />
    </ScreenTemplate>
  );
};
