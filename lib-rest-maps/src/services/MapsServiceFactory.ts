import { MapsSearchParamsSchema } from '@gm/lib-contracts-maps';

import { MapsEurostatService } from './Eurostat/MapsEurostatService';
import { MapsNlsFiService } from './NlsFi/MapsNlsFiService';
import { MapsStatFiService } from './StatFi/MapsStatFiService';

export function createMapsService(rawParams: unknown) {
  const params = MapsSearchParamsSchema.parse(rawParams);
  switch (params.origin) {
    case 'eurostat':
      return new MapsEurostatService(rawParams);

    case 'nlsfi':
      return new MapsNlsFiService(rawParams);

    case 'statfi':
      return new MapsStatFiService(rawParams);

    default:
      throw new Error(`Unknown maps origin: ${params.origin}`);
  }
}
