import { Button, PageTemplate } from '@gm/lib-client-common';
import { useNavigate } from 'react-router';

export const SSRLandingPage = () => {
  const navigate = useNavigate();
  return (
    <PageTemplate title="Sign in with Google">
      <Button onClick={() => navigate('/google/scopes')}>
        Continue with Google
      </Button>
    </PageTemplate>
  );
};
