import {
  GeoJSONFeature,
  GeoJSONFeatureSchema,
  SupportedCountries,
} from '@gm/lib-contracts-maps';
import { IMapsRepository } from '@gm/lib-contracts-maps/src/repositories/IMapsRepository';
import chain from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/pick.js';
import { streamArray } from 'stream-json/streamers/stream-array.js';

export class MapsRepository implements IMapsRepository {
  readonly accept = 'application/geo+json';

  async *stream(url: URL, signal: AbortSignal): AsyncGenerator<GeoJSONFeature> {
    console.info('Fetching data from ' + url.toString());

    const response = await fetch(url.toString(), {
      headers: { accept: this.accept },
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to fetch GeoJSON from ${url.toString()} with status ${response.status}`,
      );
    }

    // Convert Web ReadableStream → async iterator
    const webReader = response.body.getReader();

    async function readChunk(): Promise<Uint8Array | null> {
      const { done, value } = await webReader.read();
      if (done) return null;
      return value!;
    }

    // Build stream-json pipeline
    const pipeline = chain([
      parser(),
      pick({ filter: 'features' }),
      streamArray(),
    ]);

    // Feed chunks manually into stream-json
    (async () => {
      while (!signal.aborted) {
        const chunk = await readChunk();
        if (chunk === null) {
          pipeline.end();
          break;
        }
        pipeline.write(chunk);
      }
    })();

    let accepted = 0;
    let rejected = 0;

    for await (const { value } of pipeline) {
      if (signal.aborted) break;

      const validated = GeoJSONFeatureSchema.safeParse(value);

      if (validated.success) {
        accepted++;
        yield validated.data;
      } else {
        rejected++;
        if (process.env.NODE_ENV === 'development') {
          console.error('MapsRepository', validated.error.issues);
        }
      }
    }

    console.info(
      'MapsRepository',
      `Fetched ${url.toString()}\n` +
        ` total of ${accepted + rejected} features:\n` +
        ` accepted ${accepted} features\n` +
        ` and rejected ${rejected} features.`,
    );
  }
}
