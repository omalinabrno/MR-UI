import { test as baseTest } from '@playwright/test';

// Extend the base test runner to inject stealth properties
export const test = baseTest.extend({
  page: async ({ page }, use) => {
    // 1. Strip the automated browser flag before any script executes
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // 2. Extra evasion parameters (Spoof plugins and hardware details)
    await page.addInitScript(() => {
      // FIXED: Safely returns a mock array instead of a broken empty token
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3], 
      });
      
      // Mock languages array to match standard localizations
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    // Pass the modified page instance down to your test block
    await use(page);
  },
});

export { expect } from '@playwright/test';