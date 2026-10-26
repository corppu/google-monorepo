import { unknown, z } from 'zod';

export const CoordinateSchema = z
  .tuple([
    z.number().min(-180).max(180), // lon
    z.number().min(-90).max(90), // lat
  ])
  .readonly();

export const PointGeometrySchema = z.object({
  coordinates: CoordinateSchema,
  type: z.literal('Point'),
});

export const PolygonGeometrySchema = z.object({
  coordinates: z
    .array(z.array(CoordinateSchema).min(4)) // ring must have ≥4 coords
    .min(1), // polygon must have ≥1 ring
  type: z.literal('Polygon'),
});

export const MultiPolygonGeometrySchema = z.object({
  coordinates: z
    .array(
      z
        .array(
          z.array(CoordinateSchema).min(4), // ring
        )
        .min(1), // polygon
    )
    .min(1), // multi polygon
  type: z.literal('MultiPolygon'),
});

export const GeometrySchema = z.union([
  PointGeometrySchema,
  PolygonGeometrySchema,
  MultiPolygonGeometrySchema,
]);

/* -------------------------------------------------------------------------- */
/*                         Loose Search Params (Base)                         */
/* -------------------------------------------------------------------------- */

export const MapsSearchParamsSchema = z.object({
  dataset: z.string(), // provider decides allowed values
  origin: z.enum(['eurostat', 'statfi', 'nlsfi']),
});

export type MapsSearchParams = z.infer<typeof MapsSearchParamsSchema>;

/* -------------------------------------------------------------------------- */
/*                         Loose Feature Schemas (Base)                       */
/* -------------------------------------------------------------------------- */

export const GeoJSONFeatureSchema = z.object({
  geometry: GeometrySchema,
  properties: z.record(z.any(), z.any()),
  type: z.literal('Feature'),
});

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;

export const GeoJSONFeatureCollectionSchema = z.object({
  features: z.array(GeoJSONFeatureSchema),
  type: z.literal('FeatureCollection'),
});

export type GeoJSONFeatureCollection = z.infer<
  typeof GeoJSONFeatureCollectionSchema
>;

/* -------------------------------------------------------------------------- */
/*                         Base Interface for All Providers                   */
/* -------------------------------------------------------------------------- */

export interface IMapsService {
  buildUrl(): URL;
  readonly contentType: 'application/geo+json-seq';
  readonly searchParams: MapsSearchParams;
  stream(signal: AbortSignal): AsyncGenerator<GeoJSONFeature>;
}
