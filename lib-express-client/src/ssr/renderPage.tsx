import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function renderPage(element: ReactElement, opts: { title: string; location: string; script?: string }): string {
  const script = opts.script ? `<script>${opts.script}</script>` : '';
  const body = renderToString(<StaticRouter location={opts.location}>{element}</StaticRouter>);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(opts.title)}</title></head><body>${body}${script}</body></html>`;
}
