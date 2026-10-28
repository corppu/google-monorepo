import type { GoogleScope } from '@gm/lib-common-google';

import {
  Button,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';
import { MINIMUM_SCOPES } from '@gm/lib-common-google';
import { useEffect, useState } from 'react';

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
  const submit = () => {
    const query = new URLSearchParams({
      returnTo: '/spa/google/dashboard',
      scopes: selected.join(' '),
    });
    window.location.href = `/api/auth/login?${query}`;
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
