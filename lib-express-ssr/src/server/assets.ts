import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { SSR_ASSETS_PATH } from '../types';

export interface SSRAssets {
  script?: string;
  stylesheets: string[];
}

/** Output of `vite build` for the client entry (see vite.config.ts). */
export const ssrClientDistPath = path.resolve(__dirname, '../../dist');

interface ManifestChunk {
  css?: string[];
  file: string;
  isEntry?: boolean;
}

export function readSSRAssets(distPath = ssrClientDistPath): SSRAssets {
  const manifestPath = path.join(distPath, '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.warn(
      'lib-express-ssr client is not built; pages are not hydrated (npm run build:ssr).',
    );
    return { stylesheets: [] };
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
    string,
    ManifestChunk
  >;
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
  return {
    script: entry && `${SSR_ASSETS_PATH}/${entry.file}`,
    stylesheets: (entry?.css ?? []).map((file) => `${SSR_ASSETS_PATH}/${file}`),
  };
}
