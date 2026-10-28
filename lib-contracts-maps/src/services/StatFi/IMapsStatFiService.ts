import { z } from 'zod';

import {
  IMapsService,
  MapsSearchParamsSchema,
  GeoJSONFeatureSchema,
} from '../IMapsService';

/* -------------------------------------------------------------------------- */
/*                         Strict StatFi Search Params                       */
/* -------------------------------------------------------------------------- */

export const MapsStatFiSearchParamsSchema = MapsSearchParamsSchema.extend({
  dataset: z.enum(['municipalities', 'grid']),
  year: z.number().int().min(1900).max(2100),
});

export type MapsStatFiSearchParams = z.infer<
  typeof MapsStatFiSearchParamsSchema
>;

/* -------------------------------------------------------------------------- */
/*                         Strict StatFi Properties                          */
/* -------------------------------------------------------------------------- */

export const StatFiPropertiesSchema = z.object({
  MUNICIPALITY_CODE: z.string(),
  MUNICIPALITY_NAME: z.string(),
  POPULATION: z.number().optional(),
  YEAR: z.number().int(),
});

/* -------------------------------------------------------------------------- */
/*                         Strict StatFi Feature                             */
/* -------------------------------------------------------------------------- */

export const StatFiFeatureSchema = GeoJSONFeatureSchema.extend({
  properties: StatFiPropertiesSchema,
});

export type StatFiFeature = z.infer<typeof StatFiFeatureSchema>;

export function validateStatFiFeature(feature: unknown) {
  return StatFiFeatureSchema.safeParse(feature);
}

/* -------------------------------------------------------------------------- */
/*                         Strict StatFi Interface                           */
/* -------------------------------------------------------------------------- */

export interface IMapsStatFiService extends IMapsService {
  readonly searchParams: MapsStatFiSearchParams;
  stream(signal: AbortSignal): AsyncGenerator<StatFiFeature>;
}
