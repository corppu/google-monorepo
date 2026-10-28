// google-monorepo\lib-contracts-maps\src\services\ClientMapsServiceFactory.ts
import { ClientMapsEurostatService } from './Eurostat/ClientMapsEurostatService';
import { MapsSearchParams } from './IMapsService';
import { ClientMapsNlsFiService } from './NlsFi/ClientMapsNlsFiService';
import { ClientMapsStatFiService } from './StatFi/ClientMapsStatFiService';

export function createClientMapsService(params: MapsSearchParams) {
  switch (params.origin) {
    case 'eurostat':
      return new ClientMapsEurostatService(params);

    case 'nlsfi':
      return new ClientMapsNlsFiService(params);

    case 'statfi':
      return new ClientMapsStatFiService(params);

    default:
      throw new Error(`Unknown maps origin: ${params.origin}`);
  }
}
