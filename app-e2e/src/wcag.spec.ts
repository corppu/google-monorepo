import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { APPS, openPage, PAGES } from './pages';

for (const app of APPS) {
  for (const path of PAGES) {
    test(`${app}/${path} has no WCAG violations`, async ({ page }) => {
      await openPage(page, app, path);
      const { violations } = await new AxeBuilder({ page })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ])
        .analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
      ).toEqual([]);
    });
  }
}
