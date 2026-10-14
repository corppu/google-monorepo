import type { Page } from '@playwright/test';

export const APPS = ['spa', 'ssr', 'rsc'] as const;
export const PAGES = ['google', 'google/scopes', 'google/dashboard'] as const;

export const pageUrl = (app: string, page: string) =>
  `/${app}/${page}?mock=true`;

export async function openPage(page: Page, app: string, path: string) {
  await page.goto(pageUrl(app, path));
  await page.waitForLoadState('networkidle');
  // The SPA loads dashboard data async; wait until it has rendered.
  await page.locator('h1:not(:empty)').first().waitFor();
  if (path.endsWith('dashboard')) await page.locator('h2').first().waitFor();
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}',
  });
}
