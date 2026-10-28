import {
  EurostatFeature,
  ClientMapsEurostatService,
} from '@gm/lib-contracts-maps';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useClientMapsEurostatStream = (params: unknown) => {
  const [data, setData] = useState<EurostatFeature[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const service = useMemo(
    () => new ClientMapsEurostatService(params),
    [JSON.stringify(params)],
  );

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    const run = async () => {
      try {
        for await (const feature of service.stream(controller.signal)) {
          setData((prev) => [...prev, feature]);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    run();

    return () => controller.abort();
  }, [service]);

  return {
    data,
    error,
    id:
      service.searchParams.origin +
      '-' +
      service.searchParams.dataset +
      '-' +
      service.searchParams.nutsLevel +
      '-' +
      service.searchParams.countries?.join('-') +
      '-' +
      service.searchParams.year,
    loading,
    searchParams: service.searchParams,
  };
};
