import {
  MapsEurostatSearchParams,
  MapsStatFiSearchParams,
  MapsNlsFiSearchParams,
} from '@gm/lib-contracts-maps';

import { useClientMapsEurostatStream } from './useClientMapsEurostatStream';
import { useClientMapsNlsFiStream } from './useClientMapsNlsFiStream';
import { useClientMapsStatFiStream } from './useClientMapsStatFiStream';

export type AnyParams =
  MapsEurostatSearchParams | MapsStatFiSearchParams | MapsNlsFiSearchParams;

export const useClientMapsStreams = (layers: AnyParams[]) => {
  const eurostatLayers = layers.filter((l) => l.origin === 'eurostat');
  const statfiLayers = layers.filter((l) => l.origin === 'statfi');
  const nlsfiLayers = layers.filter((l) => l.origin === 'nlsfi');

  const eurostatStreams = eurostatLayers.map((l) =>
    useClientMapsEurostatStream(l),
  );
  const statfiStreams = statfiLayers.map((l) => useClientMapsStatFiStream(l));
  const nlsfiStreams = nlsfiLayers.map((l) => useClientMapsNlsFiStream(l));

  return [...eurostatStreams, ...statfiStreams, ...nlsfiStreams];
};
