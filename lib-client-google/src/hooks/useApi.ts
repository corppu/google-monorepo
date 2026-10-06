import { useEffect, useState } from 'react';

/** Adds mock=true to API calls when the page itself was opened with ?mock=true. */
export function googleApiUrl(path: string): string {
  const url = `/api/google/${path}`;
  const mock =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mock') === 'true';
  return mock ? `${url}${path.includes('?') ? '&' : '?'}mock=true` : url;
}

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
    fetch(googleApiUrl(path), { credentials: 'include' })
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
