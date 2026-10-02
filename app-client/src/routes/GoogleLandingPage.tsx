import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@gm/lib-client-common';
import { GenericAuthArticleForm } from '@gm/lib-client-google';

export const GoogleLandingPage = () => {
  const navigate = useNavigate();
  const login = async (gmail: string, password: string) => {
    const r = await fetch('/api/google/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail, password })
    });
    if (r.ok) navigate('/google/scopes');
    else alert('Login failed');
  };
  return (
    <PageTemplate title="Sign in with Google">
      <GenericAuthArticleForm onSubmit={login} />
    </PageTemplate>
  );
};
