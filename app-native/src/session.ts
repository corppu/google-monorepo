export const api = { baseUrl: 'http://localhost:3000', token: undefined as string | undefined };

export const REDIRECT_URI = 'google://callback';

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...(api.token ? { Authorization: `Bearer ${api.token}` } : {})
});
