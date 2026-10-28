import {
  MapsStatFiSearchParamsSchema,
  IMapsStatFiService,
  StatFiFeature,
  validateStatFiFeature,
} from '@gm/lib-contracts-maps';

import { MapsRepository } from '../../repositories/MapsRepository';

export class MapsStatFiService implements IMapsStatFiService {
  readonly contentType = 'application/geo+json-seq';
  readonly mapsRepository = new MapsRepository();
  readonly searchParams;

  constructor(rawParams: unknown) {
    this.searchParams = MapsStatFiSearchParamsSchema.parse(rawParams);
  }

  buildUrl(): URL {
    const { dataset, year } = this.searchParams;

    if (dataset === 'municipalities') {
      return new URL(
        `https://geo.stat.fi/geoserver/tilastointialueet/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta_${year}&outputFormat=application/json`,
      );
    }

    if (dataset === 'grid') {
      return new URL(
        `https://geo.stat.fi/geoserver/vaestoruutu/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=vaestoruutu:vaki_1km_${year}&outputFormat=application/json`,
      );
    }

    throw new Error(`Unsupported StatFi dataset: ${dataset}`);
  }

  async *stream(signal: AbortSignal): AsyncGenerator<StatFiFeature> {
    const url = this.buildUrl();

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      const parsed = validateStatFiFeature(feature);
      if (parsed.success) yield parsed.data;
    }
  }
}
