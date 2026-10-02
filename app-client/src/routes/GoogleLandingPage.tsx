import { useNavigate } from 'react-router-dom';
import { GenericAuthArticleForm, PageTemplate } from '@gm/lib-client-common';

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
      <GenericAuthArticleForm identifierLabel="Gmail" identifierName="gmail" onSubmit={login} />
    </PageTemplate>
  );
};
