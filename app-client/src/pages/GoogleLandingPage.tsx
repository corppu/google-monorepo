import { useNavigate } from 'react-router-dom';
import { Button, PageTemplate } from '@gm/lib-client-common';

export const GoogleLandingPage = () => {
  const navigate = useNavigate();
  return (
    <PageTemplate title="Sign in with Google">
      <Button onClick={() => navigate('/google/scopes')}>
        Continue with Google
      </Button>
    </PageTemplate>
  );
};
