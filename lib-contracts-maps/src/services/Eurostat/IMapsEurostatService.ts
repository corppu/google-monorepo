import { z } from 'zod';

import { IMapsRepository } from '../../repositories/IMapsRepository';
import {
  IMapsService,
  GeoJSONFeatureSchema,
  GeoJSONFeatureCollectionSchema,
} from '../IMapsService';

/* -------------------------------------------------------------------------- */
/*                         Shared Country Enum                                */
/* -------------------------------------------------------------------------- */

export const SupportedCountries = ['EE', 'FI', 'NO', 'SE', 'LV', 'LT'] as const;
export const CountryCodeEnum = z.enum(SupportedCountries);
export type CountryCode = z.infer<typeof CountryCodeEnum>;

/* -------------------------------------------------------------------------- */
/*                         Supported Eurostat Years                           */
/* -------------------------------------------------------------------------- */

// Canonical common year array (single source of truth)
export const SupportedCommonYears = [2013, 2016, 2021, 2024] as const;

// NUTS supported years
export const SupportedNutsYears = [
  2003,
  2006,
  2010,
  ...SupportedCommonYears,
] as const;

// LAU supported years
export const SupportedLauYears = [
  2011,
  2012,
  // 2013 common
  2014,
  2015,
  // 2016 common
  2017,
  2018,
  2019,
  2020,
  // 2021 common
  2022,
  2023,
  // 2024 common
  ...SupportedCommonYears,
] as const;

export type CommonYear = (typeof SupportedCommonYears)[number];
export type NutsYear = (typeof SupportedNutsYears)[number];
export type LauYear = (typeof SupportedLauYears)[number];
export type PopKey<Y extends number> = `POP_${Y}`;
export type PopDensKey<Y extends number> = `POP_DENS_${Y}`;
export type CommonPopKey = PopKey<CommonYear>;
export type CommonPopDensKey = PopDensKey<CommonYear>;
export type NutsPopKey = PopKey<NutsYear>;
export type NutsPopDensKey = PopDensKey<NutsYear>;
export type LauPopKey = PopKey<LauYear>;
export type LauPopDensKey = PopDensKey<LauYear>;

// Zod numeric enums (must have at least 2 elements)
export const SupportedNutsYearSchema = z
  .number()
  .int()
  .refine((year) => SupportedNutsYears.includes(year as any), {
    message: 'Unsupported NUTS year',
  });
export const SupportedLauYearSchema = z
  .number()
  .int()
  .refine((year) => SupportedLauYears.includes(year as any), {
    message: 'Unsupported LAU year',
  });

/* -------------------------------------------------------------------------- */
/*                         Strict Eurostat Search Params                      */
/* -------------------------------------------------------------------------- */

export const MapsEurostatSearchParamsSchema = z.preprocess(
  (raw) => {
    const v = raw as Record<string, unknown>;

    return {
      ...v,

      countries:
        typeof v.countries === 'string'
          ? (v.countries as string).split(',')
          : v.countries,

      nutsLevel:
        typeof v.nutsLevel === 'string' ? Number(v.nutsLevel) : v.nutsLevel,

      year: typeof v.year === 'string' ? Number(v.year) : v.year,
    };
  },
  z.discriminatedUnion('dataset', [
    z.object({
      countries: z.array(CountryCodeEnum).optional(),
      dataset: z.literal('nuts'),
      nutsLevel: z.number().int().min(0).max(3).optional(),
      origin: z.literal('eurostat'),
      year: SupportedNutsYearSchema,
    }),

    z.object({
      countries: z.array(CountryCodeEnum).optional(),
      dataset: z.literal('lau'),
      nutsLevel: z.never().optional(),
      origin: z.literal('eurostat'),
      year: SupportedLauYearSchema,
    }),
  ]),
);

export type MapsEurostatSearchParams = z.infer<
  typeof MapsEurostatSearchParamsSchema
>;

/* -------------------------------------------------------------------------- */
/*                         COMMON Eurostat PROPERTIES                         */
/* -------------------------------------------------------------------------- */
/*  These fields exist in BOTH NUTS and LAU datasets.                         */
/*  NUTS and LAU strict schemas extend this.                                   */
/* -------------------------------------------------------------------------- */

const PositiveInteger = z.number().gte(0);

export const EurostatCommonPropertiesSchema = z.object({
  AREA_KM2: z.number().positive().optional(),
  CNTR_CODE: CountryCodeEnum,
  GISCO_ID: z.string().nonempty().optional(),

  ...Object.fromEntries(
    SupportedCommonYears.map((year) => [
      `POP_${year}`,
      PositiveInteger.optional(),
    ]),
  ),

  ...Object.fromEntries(
    SupportedCommonYears.map((year) => [
      `POP_DENS_${year}`,
      PositiveInteger.optional(),
    ]),
  ),
});

type EurostatYearProps = {
  YEAR: number;
} & Record<string, unknown>;

const requirePopulationForYear = (
  props: EurostatYearProps,
  ctx: z.RefinementCtx,
) => {
  const year = props.YEAR;

  const popKey: PopKey<typeof year> = `POP_${year}`;
  const densKey: PopDensKey<typeof year> = `POP_DENS_${year}`;

  const pop = props[popKey];
  const dens = props[densKey];

  const popResult = PositiveInteger.optional().safeParse(pop);
  const densResult = PositiveInteger.optional().safeParse(dens);

  if (!popResult.success) {
    popResult.error.issues.forEach((issue) =>
      ctx.addIssue({
        ...issue,
        path: [popKey],
      }),
    );
  }

  if (!densResult.success) {
    densResult.error.issues.forEach((issue) =>
      ctx.addIssue({
        ...issue,
        path: [densKey],
      }),
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                         STRICT NUTS PROPERTIES                             */
/* -------------------------------------------------------------------------- */

export const EurostatNutsPropertiesSchema =
  EurostatCommonPropertiesSchema.extend({
    LEVL_CODE: z.number().int().min(0).max(3),
    NUTS_ID: z.string().nonempty(),
    NUTS_NAME: z.string().nonempty(),
    YEAR: SupportedNutsYearSchema,
    ...Object.fromEntries(
      SupportedNutsYears.map((year) => [
        `POP_${year}`,
        PositiveInteger.optional(),
      ]),
    ),

    ...Object.fromEntries(
      SupportedNutsYears.map((year) => [
        `POP_DENS_${year}`,
        PositiveInteger.optional(),
      ]),
    ),
  }).superRefine(requirePopulationForYear);

/* -------------------------------------------------------------------------- */
/*                         STRICT LAU PROPERTIES                              */
/* -------------------------------------------------------------------------- */

export const EurostatLauPropertiesSchema =
  EurostatCommonPropertiesSchema.extend({
    LAU_ID: z.string().nonempty().optional(),
    LAU_NAME: z.string().nonempty(),
    YEAR: SupportedLauYearSchema,
    ...Object.fromEntries(
      SupportedLauYears.map((year) => [
        `POP_${year}`,
        PositiveInteger.optional(),
      ]),
    ),

    ...Object.fromEntries(
      SupportedLauYears.map((year) => [
        `POP_DENS_${year}`,
        PositiveInteger.optional(),
      ]),
    ),
  }).superRefine(requirePopulationForYear);

/* -------------------------------------------------------------------------- */
/*                         Strict Feature Schemas                             */
/* -------------------------------------------------------------------------- */

export const EurostatNutsFeatureSchema = GeoJSONFeatureSchema.extend({
  properties: EurostatNutsPropertiesSchema,
});

export type EurostatNutsFeature = z.infer<typeof EurostatNutsFeatureSchema>;

export const EurostatLauFeatureSchema = GeoJSONFeatureSchema.extend({
  properties: EurostatLauPropertiesSchema,
});

export type EurostatLauFeature = z.infer<typeof EurostatLauFeatureSchema>;

export type EurostatFeature = EurostatNutsFeature | EurostatLauFeature;

export function validateEurostatFeature(
  dataset: 'nuts' | 'lau',
  feature: unknown,
) {
  if (dataset === 'nuts') {
    return EurostatNutsFeatureSchema.safeParse(feature);
  }
  return EurostatLauFeatureSchema.safeParse(feature);
}

/* -------------------------------------------------------------------------- */
/*                         Strict Feature Collections                         */
/* -------------------------------------------------------------------------- */

export const EurostatNutsFeatureCollectionSchema =
  GeoJSONFeatureCollectionSchema.extend({
    features: z.array(EurostatNutsFeatureSchema),
  });

export const EurostatLauFeatureCollectionSchema =
  GeoJSONFeatureCollectionSchema.extend({
    features: z.array(EurostatLauFeatureSchema),
  });

/* -------------------------------------------------------------------------- */
/*                         Strict Eurostat Interface                          */
/* -------------------------------------------------------------------------- */

export interface IMapsEurostatService extends IMapsService {
  readonly mapsRepository: IMapsRepository;
  readonly searchParams: MapsEurostatSearchParams;
  stream(
    signal: AbortSignal,
  ): AsyncGenerator<EurostatNutsFeature | EurostatLauFeature>;
}
