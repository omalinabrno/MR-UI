import { Page, Locator, expect } from '@playwright/test';

export class MoroPage {
  readonly page: Page;
  readonly nav: Locator;
  readonly langToggle: Locator;
  readonly czLink: Locator;
  readonly oNasNavLink: Locator;
  readonly kariereNavLink: Locator;
  readonly otevrenePoziceLink: Locator;
  readonly vsechnaMestaLink: Locator;
  readonly cookieAcceptButton: Locator;
  readonly mobileMenuToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('#menu-hlavni-menu');
    this.langToggle = page.locator('.js-toggle-dropdown');
    this.czLink = page.locator('.dropdown__menu a.dropdown__link', { hasText: 'cz' });
    this.oNasNavLink = this.nav.getByRole('link', { name: 'O nás', exact: true });
    this.kariereNavLink = this.nav.getByRole('link', { name: 'Kariéra', exact: true });
    this.otevrenePoziceLink = page.getByRole('link', { name: 'Otevřené pozice', exact: true });
    this.vsechnaMestaLink = page.getByRole('link', { name: 'Všechna města' });
    this.cookieAcceptButton = page.locator('#cookiescript_accept');
    this.mobileMenuToggle = page.locator('.js-toggle-menu');
  }

  // Dynamic locators, parameterized by city
  private cityLabel(city: string): Locator {
    return this.page.locator('label').filter({ hasText: city });
  }

  private cityRadio(city: string): Locator {
    return this.page.getByRole('radio', { name: city });
  }

  async acceptCookiesIfPresent() {
    await this.page.mouse.move(10, 10);
    const banner = this.page.locator('#cookiescript_injected');
    try {
      await banner.waitFor({ state: 'visible', timeout: 5000 });
      await this.cookieAcceptButton.click();
      await banner.waitFor({ state: 'hidden' });
    } catch {
      // never appeared — continue
    }
  }

  async ensureCzechLanguage() {
    if (!this.page.url().includes('morosystems.cz')) {
      await this.langToggle.click();
      await expect(this.czLink).toBeVisible();
      await Promise.all([
        this.page.waitForURL(/morosystems\.cz/),
        this.czLink.click(),
      ]);
    }
  }

  async goToKariera() {
    await this.acceptCookiesIfPresent();
    await this.oNasNavLink.hover();
    await expect(this.kariereNavLink).toBeVisible();
    await this.kariereNavLink.click();
    await expect(this.page).toHaveURL(/\/kariera\/?/);
  }

  async filterOpenPositionsByCity(city: string) {
    await this.otevrenePoziceLink.click();
    await this.vsechnaMestaLink.click();
    await this.cityLabel(city).click();
    await expect(this.cityRadio(city)).toBeChecked();
    await this.validateCityFilterResults(city);
  }

  async validateCityFilterResults(city: string) {
    const visibleItems = this.page.locator('.c-positions__item.js-filter__item:visible');
    await expect(visibleItems.first()).toBeVisible();

    const count = await visibleItems.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(visibleItems.nth(i).locator('.c-positions__info')).toContainText(city);
    }
  }
async validateLayoutVisible() {
  const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = this.page.viewportSize()?.width ?? 0;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);

  const navVisible = await this.nav.isVisible();
  if (!navVisible) {
    await expect(this.mobileMenuToggle).toBeVisible();
  }

  await expect(this.page.locator('footer.footer')).toBeVisible();
}
async forceLoadAllImages() {
  await this.page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img[loading="lazy"]'));
    images.forEach(img => img.setAttribute('loading', 'eager'));
    // Scroll through the page to trigger any scroll-based lazy loaders
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve(true);
        }
      }, 100);
    });
  });
}
}