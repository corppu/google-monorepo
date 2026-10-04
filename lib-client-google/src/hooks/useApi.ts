import { useEffect, useState } from 'react';

export function useApi<T>(
  path: string,
  enabled = true,
): { data?: T; error?: string } {
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  useEffect(() => {
    if (!enabled) {
      setState({});
      return;
    }
    let live = true;
    setState({});
    fetch(`/api/google/${path}`, { credentials: 'include' })
      .then(async (r) =>
        r.ok ? r.json() : Promise.reject(new Error(String(r.status))),
      )
      .then((data) => live && setState({ data }))
      .catch((e: Error) => live && setState({ error: e.message }));
    return () => {
      live = false;
    };
  }, [enabled, path]);
  return state;
}
