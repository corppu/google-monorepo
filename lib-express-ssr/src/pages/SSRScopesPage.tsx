import {
  Button,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';
import { useState } from 'react';

export const SSRScopesPage = () => {
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((scope) => scope !== id)
        : [...current, id],
    );
  const submit = () => {
    const query = new URLSearchParams({
      returnTo: '/ssr/google/dashboard',
      scopes: selected.join(' '),
    });
    window.location.href = `/api/auth/login?${query}`;
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
