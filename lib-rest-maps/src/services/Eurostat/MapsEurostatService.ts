import {
  MapsEurostatSearchParamsSchema,
  IMapsEurostatService,
  EurostatLauFeature,
  EurostatNutsFeature,
  validateEurostatFeature,
  SupportedCommonYears,
  CountryCode,
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
    let startedAt = Date.now();

    const url = this.buildUrl();
    const year = this.closestSupportedYear();
    let accepted = 0;
    let rejected = 0;
    let filtered = 0;

    for await (const feature of this.mapsRepository.stream(url, signal)) {
      feature.properties.YEAR = year;
      const parsed = validateEurostatFeature(
        this.searchParams.dataset,
        feature,
      );

      if (parsed.success && this.passesFilters(parsed.data)) {
        ++accepted;
        yield parsed.data;
      } else if (!parsed.success) {
        ++rejected;

        if (
          process.env.NODE_ENV === 'development' &&
          this.searchParams.countries?.includes(feature.properties.CNTR_CODE)
        ) {
          console.error(
            'MapsEurostatService',
            feature.properties,
            parsed.error.issues,
          );
        }
      } else {
        ++filtered;
      }
      // invalid features are silently dropped
    }

    console.info(
      'MapsEurostatService',
      `Fetched ${url.toString()}\n` +
        ` total of ${accepted + filtered + rejected} features:\n` +
        ` accepted ${accepted} features,\n` +
        ` filtered ${filtered} features\n` +
        ` and rejected ${rejected} features\n` +
        ` within ${(Date.now() - startedAt) / 1000} seconds`,
    );
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
