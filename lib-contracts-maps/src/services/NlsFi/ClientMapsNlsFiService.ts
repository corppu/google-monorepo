// google-monorepo/lib-contracts-maps/src/services/NlsFi/ClientMapsNlsFiService.ts

import { ClientMapsRepository } from '../../repositories/ClientMapsRepository';
import {
  IMapsNlsFiService,
  MapsNlsFiSearchParamsSchema,
  NlsFiFeature,
  validateNlsFiFeature,
} from './IMapsNlsFiService';

export class ClientMapsNlsFiService implements IMapsNlsFiService {
  readonly contentType = 'application/geo+json-seq';
  readonly mapsRepository = new ClientMapsRepository();
  readonly searchParams;

  constructor(rawParams: unknown) {
    this.searchParams = MapsNlsFiSearchParamsSchema.parse(rawParams);
  }

  buildUrl(): URL {
    const url = new URL('/api/maps/stream', window.location.origin);

    for (const [key, value] of Object.entries(this.searchParams)) {
      if (value != null) {
        url.searchParams.set(key, String(value));
      }
    }

    return url;
  }

  async *stream(signal: AbortSignal): AsyncGenerator<NlsFiFeature> {
    const url = this.buildUrl();

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      const parsed = validateNlsFiFeature(feature);

      if (parsed.success) {
        yield parsed.data;
      }
    }
  }
}
