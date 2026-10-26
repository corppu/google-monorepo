import { MapsEurostatService } from './Eurostat/MapsEurostatService';
import { MapsStatFiService } from './StatFi/MapsStatFiService';
import { MapsNlsFiService } from './NlsFi/MapsNlsFiService';

import { MapsSearchParamsSchema } from '@gm/lib-contracts-maps';

export function createMapsService(rawParams: unknown) {
  const params = MapsSearchParamsSchema.parse(rawParams);
  switch (params.origin) {
    case 'eurostat':
      return new MapsEurostatService(rawParams);

    case 'statfi':
      return new MapsStatFiService(rawParams);

    case 'nlsfi':
      return new MapsNlsFiService(rawParams);

    default:
      throw new Error(`Unknown maps origin: ${params.origin}`);
  }
}
