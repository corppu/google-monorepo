// google-monorepo/lib-contracts-maps/src/services/NlsFi/NlsFiSchemas.ts
import { z } from 'zod';

import {
  IMapsService,
  MapsSearchParamsSchema,
  GeoJSONFeatureSchema,
} from '../IMapsService';

/* -------------------------------------------------------------------------- */
/*                         Strict NlsFi Search Params                        */
/* -------------------------------------------------------------------------- */

export const MapsNlsFiSearchParamsSchema = MapsSearchParamsSchema.extend({
  dataset: z.enum(['municipalities', 'administrative_areas']),
  year: z.number().int().min(1900).max(2100),
});

export type MapsNlsFiSearchParams = z.infer<typeof MapsNlsFiSearchParamsSchema>;

/* -------------------------------------------------------------------------- */
/*                         Strict NlsFi Properties                           */
/* -------------------------------------------------------------------------- */

export const NlsFiPropertiesSchema = z.object({
  AREA_ID: z.string(),
  AREA_NAME: z.string(),
  YEAR: z.number().int(),
});

/* -------------------------------------------------------------------------- */
/*                         Strict NlsFi Feature                              */
/* -------------------------------------------------------------------------- */

export const NlsFiFeatureSchema = GeoJSONFeatureSchema.extend({
  properties: NlsFiPropertiesSchema,
});

export type NlsFiFeature = z.infer<typeof NlsFiFeatureSchema>;

export function validateNlsFiFeature(feature: unknown) {
  return NlsFiFeatureSchema.safeParse(feature);
}

/* -------------------------------------------------------------------------- */
/*                         Strict NlsFi Interface                            */
/* -------------------------------------------------------------------------- */

export interface IMapsNlsFiService extends IMapsService {
  readonly searchParams: MapsNlsFiSearchParams;
  stream(signal: AbortSignal): AsyncGenerator<NlsFiFeature>;
}
