import { GeoJSONFeature } from '../services/IMapsService';

export interface IMapsRepository {
  readonly accept: 'application/geo+json' | 'application/geo+json-seq';
  stream(url: URL, signal: AbortSignal): AsyncGenerator<GeoJSONFeature>;
}
