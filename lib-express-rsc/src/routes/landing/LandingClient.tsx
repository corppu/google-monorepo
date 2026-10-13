'use client';

import { useNavigate } from 'react-router';
import { Button, PageTemplate } from '@gm/lib-client-common';

export const LandingClient = () => {
  const navigate = useNavigate();
  return (
    <PageTemplate title="Sign in with Google">
      <Button onClick={() => navigate('/google/scopes')}>
        Continue with Google
      </Button>
    </PageTemplate>
  );
};
