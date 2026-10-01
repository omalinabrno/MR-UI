import { test, expect } from '@playwright/test';
import { MoroPage } from './pages/MoroPage';

const resolutions = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

for (const res of resolutions) {
  test.describe(`Visual testing — ${res.name} (${res.width}x${res.height})`, () => {
    test.use({ viewport: { width: res.width, height: res.height } });

    test(`header/nav matches baseline on ${res.name}`, async ({ page }) => {
      test.skip(
        test.info().project.name !== 'chromium',
        'Visual regression baselines maintained for the chromium project only'
      );

      const moroPage = new MoroPage(page);
      await page.goto('https://www.morosystems.cz/', { waitUntil: 'networkidle' });
      await moroPage.acceptCookiesIfPresent();
      await page.waitForTimeout(500);

      await expect(page.locator('#menu-main')).toHaveScreenshot(
        `header-${res.name}.png`,
        { timeout: 15000, maxDiffPixelRatio: 0.02 }
      );
    });
  });
}