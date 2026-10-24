import * as SecureStore from 'expo-secure-store';

export const api = {
  baseUrl: 'http://localhost:3000',
  token: undefined as string | undefined,
};

export const REDIRECT_URI = 'google://callback';

const REFRESH_KEY = 'gm.refreshToken';

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...(api.token ? { Authorization: `Bearer ${api.token}` } : {}),
});

/** Keeps the short-lived access token in memory and the rotating refresh token in the Keychain/Keystore. */
export async function storeTokens(t: { refreshToken: string; token: string }) {
  api.token = t.token;
  await SecureStore.setItemAsync(REFRESH_KEY, t.refreshToken);
}

/** Exchanges the stored refresh token for new tokens; false when signed out. */
export async function refreshSession(): Promise<boolean> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  if (!refreshToken) return false;
  const r = await fetch(`${api.baseUrl}/api/auth/native/refresh`, {
    body: JSON.stringify({ refreshToken }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).catch(() => undefined);
  if (!r?.ok) {
    if (r?.status === 401) await SecureStore.deleteItemAsync(REFRESH_KEY);
    return false;
  }
  await storeTokens(await r.json());
  return true;
}

export async function signOut() {
  if (api.token)
    await fetch(`${api.baseUrl}/api/auth/logout`, {
      headers: jsonHeaders(),
      method: 'POST',
    }).catch(() => undefined);
  api.token = undefined;
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
