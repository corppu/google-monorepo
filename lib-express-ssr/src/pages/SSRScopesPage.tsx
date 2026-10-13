import { useState } from 'react';
import {
  Button,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';

export const SSRScopesPage = () => {
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((scope) => scope !== id)
        : [...current, id],
    );
  const submit = async () => {
    await fetch('/api/google/auth/scopes', {
      body: JSON.stringify({ scopes: selected }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    window.location.href = '/api/google/auth/start?target=ssr';
  };
  return (
    <PageTemplate title="Choose scopes">
      <GenericScopesSelectorFieldset
        scopes={GOOGLE_SCOPES}
        selected={selected}
        onToggle={toggle}
      />
      <Button onClick={submit}>Authorize</Button>
    </PageTemplate>
  );
};
