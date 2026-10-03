import { useEffect, useState } from 'react';

export interface NativeApiConfig {
  baseUrl: string;
  token?: string;
}

export function useApi<T>(
  cfg: NativeApiConfig,
  path: string,
): { data?: T; error?: string } {
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  useEffect(() => {
    let live = true;
    fetch(`${cfg.baseUrl}/api/google/${path}`, {
      headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {},
    })
      .then(async (r) =>
        r.ok ? r.json() : Promise.reject(new Error(String(r.status))),
      )
      .then((data) => live && setState({ data }))
      .catch((e: Error) => live && setState({ error: e.message }));
    return () => {
      live = false;
    };
  }, [cfg.baseUrl, cfg.token, path]);
  return state;
}
