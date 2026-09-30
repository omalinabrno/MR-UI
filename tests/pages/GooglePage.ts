import { Page, Locator, expect } from '@playwright/test';

export class GooglePage {
    constructor(private page: Page) {}

    private acceptButton = this.page.locator('#L2AGLb');
    public searchBar = this.page.locator('#search');

    async open() {
        await this.page.goto('https://www.google.com', { waitUntil: 'networkidle' });
         console.log('Google page opened');
    }

    async acceptConsent() {
        if (await this.acceptButton.isVisible().catch(() => false)) {
            await this.page.waitForTimeout(Math.random() * 800 + 400);  
            await this.acceptButton.click();
              console.log('Clicked on Accept All button in consent page');
        }
    }

  async search(searchPattern: string) {
  const searchBox = this.page.locator('textarea[name="q"]');
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.click();

  await searchBox.pressSequentially(searchPattern, { delay: 80 });
  await this.page.waitForTimeout(500);
  await searchBox.fill(searchPattern);
  await expect(searchBox).toHaveValue(searchPattern);
  await searchBox.press('End');
  await searchBox.press('Enter');

  await this.page.waitForURL(/\/search\?/);
  await this.waitForUrlToStabilize();
}

private async waitForUrlToStabilize() {
  // Known: Google's auto-refine navigation happens ~2s after initial load.
  // Wait past that window unconditionally first.
  await this.page.waitForTimeout(3000);

  // Now confirm the URL has actually settled (no further changes)
  let lastUrl = this.page.url();
  let stableCount = 0;
  const requiredStableChecks = 3; // 1.5s of no change
  const checkIntervalMs = 500;
  const maxChecks = 10; // up to 5s more, in case refresh is delayed further

  for (let i = 0; i < maxChecks && stableCount < requiredStableChecks; i++) {
    await this.page.waitForTimeout(checkIntervalMs);
    const currentUrl = this.page.url();
    if (currentUrl === lastUrl) {
      stableCount++;
    } else {
      stableCount = 0;
      lastUrl = currentUrl;
    }
  }
}

  async validateResultsContainLink(domainPart: string) {
    const link = this.page.locator(`a[href*="${domainPart}"]`).first();
    await expect(link).toBeVisible();
  }

  async clickResultLink(domainPart: string) {
  const exactPattern = new RegExp(`^https://(www\\.)?${domainPart.replace(/\./g, '\\.')}/?$`);
  const cite = this.page.locator('cite').filter({ hasText: exactPattern }).first();

  const hasExactResult = await cite.isVisible().catch(() => false);

  if (hasExactResult) {
    const link = cite.locator('xpath=ancestor::a[1]');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    return;
  }

  // Fallback: no bare-domain organic result found — try the sidebar "Website"/"Web" link
  await this.clickSidebarWebsiteLink(domainPart);
}
async clickSidebarWebsiteLink(domainPart: string) {
  const sidebarLink = this.page.locator(`a[href*="${domainPart}"]`, {
    hasText: /^(Web|Website)$/,
  }).first();

  await sidebarLink.waitFor({ state: 'visible', timeout: 5000 });
  await sidebarLink.scrollIntoViewIfNeeded();
  await sidebarLink.click();
}
}