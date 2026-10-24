import { ClientMapsRepository } from '../../repositories/ClientMapsRepository';
import {
  IMapsStatFiService,
  MapsStatFiSearchParamsSchema,
  StatFiFeature,
  validateStatFiFeature,
} from './IMapsStatFiService';

export class ClientMapsStatFiService implements IMapsStatFiService {
  readonly contentType = 'application/geo+json-seq';
  readonly searchParams;
  readonly mapsRepository = new ClientMapsRepository();

  constructor(rawParams: unknown) {
    this.searchParams = MapsStatFiSearchParamsSchema.parse(rawParams);
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

  async *stream(signal: AbortSignal): AsyncGenerator<StatFiFeature> {
    const url = this.buildUrl();

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      const parsed = validateStatFiFeature(feature);

      if (parsed.success) {
        yield parsed.data;
      }
    }
  }
}
