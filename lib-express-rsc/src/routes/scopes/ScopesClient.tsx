'use client';

import { useState } from 'react';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';
import {
  Button,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';

export const ScopesClient = () => {
  const [selected, setSelected] = useState<string[]>(MINIMUM_SCOPES);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((scope) => scope !== id)
        : [...current, id],
    );
  const submit = () => {
    const query = new URLSearchParams({
      returnTo: '/rsc/google/dashboard',
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
