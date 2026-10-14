import { expect, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { APPS, openPage, PAGES } from './pages';

// Every page must render identically in all apps. The SPA is the reference.
const MAX_DIFF_RATIO = 0.001;
const [REFERENCE, ...OTHERS] = APPS;

for (const path of PAGES) {
  for (const app of OTHERS) {
    test(`${app}/${path} looks the same as ${REFERENCE}/${path}`, async ({
      page,
    }) => {
      await openPage(page, REFERENCE, path);
      const expected = PNG.sync.read(await page.screenshot({ fullPage: true }));
      await openPage(page, app, path);
      const actualBuffer = await page.screenshot({ fullPage: true });
      const actual = PNG.sync.read(actualBuffer);

      expect([actual.width, actual.height]).toEqual([
        expected.width,
        expected.height,
      ]);
      const diff = new PNG({ height: expected.height, width: expected.width });
      const changed = pixelmatch(
        expected.data,
        actual.data,
        diff.data,
        expected.width,
        expected.height,
        { threshold: 0.1 },
      );
      if (changed / (expected.width * expected.height) > MAX_DIFF_RATIO) {
        await test.info().attach('diff.png', {
          body: PNG.sync.write(diff),
          contentType: 'image/png',
        });
      }
      expect(changed / (expected.width * expected.height)).toBeLessThanOrEqual(
        MAX_DIFF_RATIO,
      );
    });
  }
}
