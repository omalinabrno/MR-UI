import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
  ['html', { open: 'never' }],
  ['list'],
  ['json', { outputFile: 'test-results/results.json' }],
],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: !!process.env.CI,   // ← key change
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
        headless: !!process.env.CI,   // ← key change
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: !!process.env.CI,   // ← key change
      },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: !!process.env.CI,   // ← key change
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },
  ],
});