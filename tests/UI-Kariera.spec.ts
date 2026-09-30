import { test, expect } from './stealth-fixture';
import { GooglePage } from './pages/GooglePage';
import { MoroPage } from './pages/MoroPage';
test.describe.configure({ mode: 'serial' });
test('Execute Google Search for MoroSystems', async ({ page, browserName }) => {
test.skip(browserName === 'firefox' || browserName === 'webkit',
    'Google anti-bot detection blocks non-Chromium automation');
  const googlePage = new GooglePage(page);
  await googlePage.open();
await googlePage.acceptConsent();
 await googlePage.search('MoroSystems');
  await googlePage.validateResultsContainLink('morosystems.cz');
  await googlePage.clickResultLink('morosystems.cz');
const moroPage = new MoroPage(page);
await moroPage.ensureCzechLanguage();
await moroPage.acceptCookiesIfPresent();
await moroPage.goToKariera();
await moroPage.filterOpenPositionsByCity('Brno');

});



