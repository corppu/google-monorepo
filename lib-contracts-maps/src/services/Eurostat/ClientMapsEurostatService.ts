import {
  MapsEurostatSearchParamsSchema,
  IMapsEurostatService,
  EurostatLauFeature,
  EurostatNutsFeature,
  validateEurostatFeature,
} from '@gm/lib-contracts-maps';

import { ClientMapsRepository } from '../../repositories/ClientMapsRepository';

export class ClientMapsEurostatService implements IMapsEurostatService {
  readonly contentType = 'application/geo+json-seq';
  readonly mapsRepository = new ClientMapsRepository();
  readonly searchParams;

  constructor(rawParams: unknown) {
    this.searchParams = MapsEurostatSearchParamsSchema.parse(rawParams);
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

  async *stream(
    signal: AbortSignal,
  ): AsyncGenerator<EurostatNutsFeature | EurostatLauFeature> {
    const url = this.buildUrl();

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      const parsed = validateEurostatFeature(
        this.searchParams.dataset,
        feature,
      );

      if (parsed.success) {
        yield parsed.data;
      }
      // invalid features are silently dropped
    }
  }
}
