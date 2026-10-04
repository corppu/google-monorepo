import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function renderPage(
  element: ReactElement,
  opts: {
    location: string;
    script?: string;
    stylesheets?: string[];
    title: string;
  },
): string {
  const script = opts.script ? `<script>${opts.script}</script>` : '';
  const stylesheets = (opts.stylesheets ?? [])
    .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`)
    .join('');
  const body = renderToString(
    <StaticRouter location={opts.location}>{element}</StaticRouter>,
  );
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(opts.title)}</title>${stylesheets}</head><body>${body}${script}</body></html>`;
}
