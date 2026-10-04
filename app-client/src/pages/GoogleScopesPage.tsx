import { useEffect, useState } from 'react';
import { MINIMUM_SCOPES } from '@gm/lib-common-google';
import type { GoogleScope } from '@gm/lib-common-google';
import {
  Button,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';

export const GoogleScopesPage = () => {
  const [scopes, setScopes] = useState<GoogleScope[]>([]);
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  useEffect(() => {
    fetch('/api/google/auth/scopes', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setScopes(d.scopes));
  }, []);
  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const submit = async () => {
    await fetch('/api/google/auth/scopes', {
      body: JSON.stringify({ scopes: selected }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    window.location.href = '/api/google/auth/start?target=spa';
  };
  return (
    <PageTemplate title="Choose scopes">
      <GenericScopesSelectorFieldset
        scopes={scopes}
        selected={selected}
        onToggle={toggle}
      />
      <Button onClick={submit}>Authorize</Button>
    </PageTemplate>
  );
};
