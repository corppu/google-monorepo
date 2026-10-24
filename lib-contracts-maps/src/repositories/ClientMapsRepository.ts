import { GeoJSONFeature, GeoJSONFeatureSchema } from '../services/IMapsService';
import { IMapsRepository } from './IMapsRepository';

const RS = String.fromCharCode(0x1e);

export class ClientMapsRepository implements IMapsRepository {
  readonly accept = 'application/geo+json-seq';
  async *stream(url: URL, signal: AbortSignal): AsyncGenerator<GeoJSONFeature> {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/geo+json-seq',
      },
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch geo+json-seq: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (signal?.aborted) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.startsWith(RS)) line = line.slice(1);
        line = line.trim();
        if (!line) continue;

        try {
          const parsed = GeoJSONFeatureSchema.safeParse(JSON.parse(line));
          if (parsed.success) yield parsed.data;
        } catch {
          // ignore malformed chunks
        }
      }
    }
  }
}
