import {
  MapsNlsFiSearchParamsSchema,
  IMapsNlsFiService,
  NlsFiFeature,
  validateNlsFiFeature,
} from '@gm/lib-contracts-maps';

import { MapsRepository } from '../../repositories/MapsRepository';

export class MapsNlsFiService implements IMapsNlsFiService {
  readonly contentType = 'application/geo+json-seq';
  readonly searchParams;
  readonly mapsRepository = new MapsRepository();

  constructor(rawParams: unknown) {
    this.searchParams = MapsNlsFiSearchParamsSchema.parse(rawParams);
  }

  buildUrl(): URL {
    const { dataset } = this.searchParams;

    const base = 'https://avoin-paikkatieto.maanmittauslaitos.fi/v1';

    if (dataset === 'municipalities') {
      return new URL(
        `${base}/municipalities/collections/municipalities/items?f=json`,
      );
    }

    if (dataset === 'administrative_areas') {
      return new URL(
        `${base}/administrative-divisions/collections/administrative-divisions/items?f=json`,
      );
    }

    throw new Error(`Unsupported NlsFi dataset: ${dataset}`);
  }

  async *stream(signal: AbortSignal): AsyncGenerator<NlsFiFeature> {
    const url = this.buildUrl();

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      const parsed = validateNlsFiFeature(feature);
      if (parsed.success) yield parsed.data;
    }
  }
}
