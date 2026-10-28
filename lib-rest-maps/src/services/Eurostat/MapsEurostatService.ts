import {
  MapsEurostatSearchParamsSchema,
  IMapsEurostatService,
  EurostatLauFeature,
  EurostatNutsFeature,
  validateEurostatFeature,
  SupportedCommonYears,
} from '@gm/lib-contracts-maps';

import { MapsRepository } from '../../repositories/MapsRepository';

export class MapsEurostatService implements IMapsEurostatService {
  readonly contentType = 'application/geo+json-seq';
  readonly mapsRepository = new MapsRepository();
  readonly searchParams;

  constructor(rawParams: unknown) {
    this.searchParams = MapsEurostatSearchParamsSchema.parse(rawParams);
  }

  buildUrl(): URL {
    const { dataset } = this.searchParams;

    const year = this.closestSupportedYear();

    // Eurostat GISCO distribution API (verified working)
    const base = 'https://gisco-services.ec.europa.eu/distribution/v2';
    const file = `${dataset}/geojson/${dataset.toUpperCase()}_RG_01M_${year}_4326.geojson`;

    return new URL(`${base}/${file}`);
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

      if (parsed.success && this.passesFilters(parsed.data)) {
        console.log('SUCCESS');
        yield parsed.data;
      }

      // invalid features are silently dropped
    }
  }
  private closestSupportedYear(): number {
    const requested = this.searchParams.year;
    const supported = SupportedCommonYears;

    let closest: number = supported[0];
    for (const y of supported) {
      if (y <= requested && y >= closest) closest = y;
    }
    return closest;
  }

  private passesFilters(
    feature: EurostatNutsFeature | EurostatLauFeature,
  ): boolean {
    const { countries, dataset, nutsLevel } = this.searchParams;

    // Country filter (applies to both NUTS and LAU)
    if (countries && !countries.includes(feature.properties.CNTR_CODE)) {
      return false;
    }

    // NUTS-level filter (only applies to NUTS dataset)
    if (dataset === 'nuts' && nutsLevel != null) {
      // Now TypeScript knows this is a NUTS feature
      const nutsFeature = feature as EurostatNutsFeature;

      if (nutsFeature.properties.LEVL_CODE !== nutsLevel) {
        return false;
      }
    }

    // LAU dataset never checks LEVL_CODE
    return true;
  }
}
