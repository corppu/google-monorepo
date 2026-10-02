import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function renderPage(element: ReactElement, opts: { title: string; script?: string }): string {
  const script = opts.script ? `<script>${opts.script}</script>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeAttr(opts.title)}</title></head><body>${renderToString(element)}${script}</body></html>`;
}
