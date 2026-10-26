import { describe, it, expect, vi } from 'vitest';
import { IMapsRepository } from '../../repositories/IMapsRepository';
import { GeoJSONFeature } from '../IMapsService';
import {
  IMapsEurostatService,
  MapsEurostatSearchParamsSchema,
  EurostatNutsPropertiesSchema,
  EurostatLauPropertiesSchema,
  validateEurostatFeature,
  EurostatNutsFeatureCollectionSchema,
  EurostatLauFeatureCollectionSchema,
  EurostatLauFeature,
  EurostatNutsFeature,
  SupportedLauYears,
  SupportedCommonYears,
  SupportedNutsYears,
} from './IMapsEurostatService';

/* -------------------------------------------------------------------------- */
/*                               Mock Repository                              */
/* -------------------------------------------------------------------------- */

function createMockRepository(features: GeoJSONFeature[]): IMapsRepository {
  return {
    accept: 'application/geo+json',
    async *stream(_url: URL, signal: AbortSignal) {
      for (const feature of features) {
        if (signal.aborted) break;
        yield feature;
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                               Mock Service                                 */
/* -------------------------------------------------------------------------- */

function createMockService(
  params: any,
  features: GeoJSONFeature[],
): IMapsEurostatService {
  const repo = createMockRepository(features);

  return {
    buildUrl: function (): URL {
      throw new Error('Function not implemented.');
    },

    contentType: 'application/geo+json-seq',
    mapsRepository: repo,
    searchParams: params,

    async *stream(
      signal: AbortSignal,
    ): AsyncGenerator<EurostatNutsFeature | EurostatLauFeature> {
      const url = new URL('https://mock/eurostat');

      for await (const feature of repo.stream(url, signal)) {
        // Determine dataset type from searchParams
        if (params.dataset === 'nuts') {
          yield feature as EurostatNutsFeature;
        } else {
          yield feature as EurostatLauFeature;
        }
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                               Test Helpers                                 */
/* -------------------------------------------------------------------------- */

function makeValidNutsFeature(year: number): GeoJSONFeature {
  return {
    geometry: { coordinates: [24.94, 60.17], type: 'Point' },
    properties: {
      [`POP_${year}`]: 500000,
      [`POP_DENS_${year}`]: 300,
      AREA_KM2: 100,
      CNTR_CODE: 'FI',
      GISCO_ID: 'FI123',
      LEVL_CODE: 2,
      NUTS_ID: 'FI1',
      NUTS_NAME: 'Helsinki',
      YEAR: year,
    },
    type: 'Feature',
  };
}

function makeValidLauFeature(year: number): GeoJSONFeature {
  return {
    geometry: { coordinates: [24.94, 60.17], type: 'Point' },
    properties: {
      [`POP_${year}`]: 500000,
      [`POP_DENS_${year}`]: 300,
      AREA_KM2: 100,
      CNTR_CODE: 'FI',
      GISCO_ID: 'FI123',
      LAU_ID: '091',
      LAU_NAME: 'Helsinki',
      YEAR: year,
    },
    type: 'Feature',
  };
}

/* -------------------------------------------------------------------------- */
/*                               Schema Tests                                 */
/* -------------------------------------------------------------------------- */

describe('MapsEurostatSearchParamsSchema', () => {
  it('validates NUTS params', () => {
    const result = MapsEurostatSearchParamsSchema.safeParse({
      countries: ['FI'],
      dataset: 'nuts',
      nutsLevel: 2,
      origin: 'eurostat',
      year: 2021,
    });

    expect(result.success).toBe(true);
  });

  it('validates LAU params', () => {
    const result = MapsEurostatSearchParamsSchema.safeParse({
      countries: ['FI'],
      dataset: 'lau',
      origin: 'eurostat',
      year: 2022,
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched year', () => {
    const result = MapsEurostatSearchParamsSchema.safeParse({
      dataset: 'lau',
      origin: 'eurostat',
      year: 2006,
    });

    expect(result.success).toBe(false);
  });
});

describe('EurostatNutsPropertiesSchema', () => {
  it('validates correct NUTS feature', () => {
    const feature = makeValidNutsFeature(2021);
    const result = EurostatNutsPropertiesSchema.safeParse(feature.properties);
    expect(result.success).toBe(true);
  });

  it('rejects missing POP_YEAR', () => {
    const feature = makeValidNutsFeature(2021);
    delete feature.properties.POP_2021;

    const result = EurostatNutsPropertiesSchema.safeParse(feature.properties);
    expect(result.success).toBe(false);
  });
});

describe('EurostatLauPropertiesSchema', () => {
  it('validates correct LAU feature', () => {
    const feature = makeValidLauFeature(2022);
    const result = EurostatLauPropertiesSchema.safeParse(feature.properties);
    expect(result.success).toBe(true);
  });

  it('rejects missing POP_YEAR', () => {
    const feature = makeValidLauFeature(2022);
    delete feature.properties.POP_2022;

    const result = EurostatLauPropertiesSchema.safeParse(feature.properties);
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*                         validateEurostatFeature Tests                      */
/* -------------------------------------------------------------------------- */

describe('validateEurostatFeature()', () => {
  it('validates NUTS', () => {
    const feature = makeValidNutsFeature(2021);
    const result = validateEurostatFeature('nuts', feature);
    expect(result.success).toBe(true);
  });

  it('validates LAU', () => {
    const feature = makeValidLauFeature(2022);
    const result = validateEurostatFeature('lau', feature);
    expect(result.success).toBe(true);
  });

  it('rejects mismatched dataset', () => {
    const feature = makeValidNutsFeature(2021);
    const result = validateEurostatFeature('lau', feature);
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*                         Feature Collection Tests                           */
/* -------------------------------------------------------------------------- */

describe('Eurostat Feature Collections', () => {
  it('validates NUTS collection', () => {
    const feature = makeValidNutsFeature(2021);
    const result = EurostatNutsFeatureCollectionSchema.safeParse({
      features: [feature],
      type: 'FeatureCollection',
    });

    expect(result.success).toBe(true);
  });

  it('validates LAU collection', () => {
    const feature = makeValidLauFeature(2022);
    const result = EurostatLauFeatureCollectionSchema.safeParse({
      features: [feature],
      type: 'FeatureCollection',
    });

    expect(result.success).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/*                         IMapsEurostatService.stream Tests                  */
/* -------------------------------------------------------------------------- */

describe('IMapsEurostatService.stream()', () => {
  it('streams features from repository', async () => {
    const feature = makeValidNutsFeature(2021);

    const service = createMockService(
      {
        dataset: 'nuts',
        origin: 'eurostat',
        year: 2021,
      },
      [feature],
    );

    const signal = new AbortController().signal;
    const results: GeoJSONFeature[] = [];

    for await (const f of service.stream(signal)) {
      results.push(f);
    }

    expect(results.length).toBe(1);
    expect(results[0].properties.NUTS_NAME).toBe('Helsinki');
  });
});

describe('validateEurostatFeature() — loop through all valid years', () => {
  it('validates every supported NUTS year', () => {
    for (const year of SupportedNutsYears) {
      const feature = makeValidNutsFeature(year);

      // Ensure correct population fields exist
      feature.properties[`POP_${year}`] = 1000;
      feature.properties[`POP_DENS_${year}`] = 50;

      const result = validateEurostatFeature('nuts', feature);
      expect(result.success).toBe(true);
    }
  });

  it('validates every supported LAU year', () => {
    for (const year of SupportedLauYears) {
      const feature = makeValidLauFeature(year);

      // Ensure correct population fields exist
      feature.properties[`POP_${year}`] = 2000;
      feature.properties[`POP_DENS_${year}`] = 100;

      const result = validateEurostatFeature('lau', feature);
      expect(result.success).toBe(true);
    }
  });

  it('rejects NUTS features when POP_YEAR is missing for any supported year', () => {
    for (const year of SupportedNutsYears) {
      const feature = makeValidNutsFeature(year);
      delete feature.properties[`POP_${year}`];

      const result = validateEurostatFeature('nuts', feature);
      expect(result.success).toBe(false);
    }
  });

  it('rejects LAU features when POP_YEAR is missing for any supported year', () => {
    for (const year of SupportedLauYears) {
      const feature = makeValidLauFeature(year);
      delete feature.properties[`POP_${year}`];

      const result = validateEurostatFeature('lau', feature);
      expect(result.success).toBe(false);
    }
  });

  it('rejects NUTS features when POP_DENS_YEAR is missing for any supported year', () => {
    for (const year of SupportedNutsYears) {
      const feature = makeValidNutsFeature(year);
      delete feature.properties[`POP_DENS_${year}`];

      const result = validateEurostatFeature('nuts', feature);
      expect(result.success).toBe(false);
    }
  });

  it('rejects LAU features when POP_DENS_YEAR is missing for any supported year', () => {
    for (const year of SupportedLauYears) {
      const feature = makeValidLauFeature(year);
      delete feature.properties[`POP_DENS_${year}`];

      const result = validateEurostatFeature('lau', feature);
      expect(result.success).toBe(false);
    }
  });

  it('rejects NUTS features when population fields belong to a different year', () => {
    const feature = makeValidNutsFeature(SupportedCommonYears[0]);

    // Remove correct year fields
    delete feature.properties[`POP_${SupportedCommonYears[0]}`];
    delete feature.properties[`POP_DENS_${SupportedCommonYears[0]}`];

    // Add wrong year fields
    feature.properties[`POP_${SupportedCommonYears[1]}`] = 999;
    feature.properties[`POP_DENS_${SupportedCommonYears[1]}`] = 10;

    const result = validateEurostatFeature('nuts', feature);
    expect(result.success).toBe(false);
  });

  it('rejects LAU features when population fields belong to a different year', () => {
    const feature = makeValidLauFeature(SupportedCommonYears[0]);

    // Remove correct year fields
    delete feature.properties[`POP_${SupportedCommonYears[0]}`];
    delete feature.properties[`POP_DENS_${SupportedCommonYears[0]}`];

    // Add wrong year fields
    feature.properties[`POP_${SupportedCommonYears[1]}`] = 999;
    feature.properties[`POP_DENS_${SupportedCommonYears[1]}`] = 10;

    const result = validateEurostatFeature('lau', feature);
    expect(result.success).toBe(false);
  });
});

describe('MapsEurostatSearchParamsSchema', () => {
  it('parses and transforms Express query params for NUTS', () => {
    const raw = {
      countries: 'EE,FI,NO,SE',
      dataset: 'nuts',
      nutsLevel: '2',
      origin: 'eurostat',
      year: '2021',
    };

    const parsed = MapsEurostatSearchParamsSchema.parse(raw);

    expect(parsed).toEqual({
      countries: ['EE', 'FI', 'NO', 'SE'],
      dataset: 'nuts',
      nutsLevel: 2,
      origin: 'eurostat',
      year: 2021,
    });
  });

  it('parses and transforms Express query params for LAU', () => {
    const raw = {
      countries: 'FI,SE',
      dataset: 'lau',
      origin: 'eurostat',
      year: '2023',
    };

    const parsed = MapsEurostatSearchParamsSchema.parse(raw);

    expect(parsed).toEqual({
      countries: ['FI', 'SE'],
      dataset: 'lau',
      nutsLevel: undefined,
      origin: 'eurostat',
      year: 2023,
    });
  });

  it('rejects invalid NUTS year', () => {
    const raw = {
      countries: 'FI',
      dataset: 'nuts',
      nutsLevel: '2',
      origin: 'eurostat',
      year: '2022', // invalid NUTS year
    };

    expect(() => MapsEurostatSearchParamsSchema.parse(raw)).toThrow();
  });

  it('rejects invalid LAU year', () => {
    const raw = {
      countries: 'FI',
      dataset: 'lau',
      origin: 'eurostat',
      year: '2010', // invalid LAU year
    };

    expect(() => MapsEurostatSearchParamsSchema.parse(raw)).toThrow();
  });
});
