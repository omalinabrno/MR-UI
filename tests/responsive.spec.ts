import { test, expect } from '@playwright/test';
import { MoroPage } from './pages/MoroPage';

const resolutions = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

for (const res of resolutions) {
  test.describe(`Responsive design — ${res.name} (${res.width}x${res.height})`, () => {
    test.use({ viewport: { width: res.width, height: res.height } });

    test(`homepage displays correctly on ${res.name}`, async ({ page }) => {
      const moroPage = new MoroPage(page);
      await page.goto('https://www.morosystems.cz/', { waitUntil: 'networkidle' });
      await moroPage.acceptCookiesIfPresent();
      await moroPage.validateLayoutVisible();
    });

    test(`Kariéra page displays correctly on ${res.name}`, async ({ page }) => {
      const moroPage = new MoroPage(page);
      await page.goto('https://www.morosystems.cz/kariera/', { waitUntil: 'networkidle' });
      await moroPage.acceptCookiesIfPresent();
      await moroPage.validateLayoutVisible();
    });
  });
}