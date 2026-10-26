import { GeoJSONFeature, GeoJSONFeatureSchema } from '@gm/lib-contracts-maps';
import { IMapsRepository } from '@gm/lib-contracts-maps/src/repositories/IMapsRepository';

export class MapsRepository implements IMapsRepository {
  readonly accept = 'application/geo+json';
  async *stream(url: URL, signal: AbortSignal): AsyncGenerator<GeoJSONFeature> {
    const response = await fetch(url.toString(), {
      headers: { accept: this.accept },
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to fetch GeoJSON from ${url.toString()} with status ${response.status}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let insideFeatures = false;
    let depth = 0;
    let obj = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (signal.aborted) break;

      buffer += decoder.decode(value, { stream: true });

      for (let i = 0; i < buffer.length; i++) {
        const c = buffer[i];

        // Find "features": [
        if (!insideFeatures && buffer.startsWith('"features"', i)) {
          const start = buffer.indexOf('[', i);
          if (start !== -1) {
            insideFeatures = true;
            i = start;
            continue;
          }
        }

        if (!insideFeatures) continue;

        if (c === '{') {
          depth++;
          obj += c;
        } else if (c === '}') {
          depth--;
          obj += c;

          if (depth === 0) {
            try {
              const parsed = JSON.parse(obj);
              const validated = GeoJSONFeatureSchema.safeParse(parsed);
              if (validated.success) {
                yield parsed;
              }
            } catch {
              // ignore invalid chunks
            }
            obj = '';
          }
        } else {
          if (depth > 0) obj += c;
        }
      }

      buffer = buffer.slice(-2000);
    }
  }
}
