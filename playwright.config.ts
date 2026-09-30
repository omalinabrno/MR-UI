import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',

  /* Settings shared across ALL browsers — keep this browser-agnostic */
  use: {
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // real installed Chrome, not bundled Chromium
        headless: false,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--start-maximized',
            '--no-sandbox',
          ],
        },
      },
    },

    {
  name: 'firefox',
  use: {
    ...devices['Desktop Firefox'],
    headless: false,
    locale: 'cs-CZ',
    extraHTTPHeaders: {
      'Accept-Language': 'cs-CZ,cs;q=0.9,en;q=0.8',
    },
  },
},

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: false,
      },
    },

    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: false,
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },
  ],
});