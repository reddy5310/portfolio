/* Browser regression checks. See README for local setup and invocation. */
const { chromium } = require('../.local/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const origin = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.CHROME_PATH;
const pages = ['index.html', 'work/genai-platform.html', 'work/modernization.html', 'work/iac-governance.html', 'resume.html'];

(async () => {
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  fs.mkdirSync(path.resolve('.local/qa'), { recursive: true });
  let checkedLinks = 0;
  for (const file of pages) {
    await page.goto(`${origin}/${file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1, `${file}: one main heading`);
    const duplicates = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]'), el => el.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    });
    assert.deepEqual(duplicates, [], `${file}: unique IDs`);
    for (const width of [1440, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth, offenders: Array.from(document.querySelectorAll('body *')).filter(el => el.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed').slice(0, 5).map(el => el.className) }));
      assert.ok(overflow.page <= width + 1, `${file} at ${width}px overflows: ${JSON.stringify(overflow)}`);
    }
    const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.href));
    for (const href of new Set(links.filter(href => href.startsWith(origin)))) {
      const url = new URL(href);
      const response = await context.request.get(origin + url.pathname);
      assert.equal(response.status(), 200, `Missing local destination: ${href}`);
      if (url.hash && /\.html$/.test(url.pathname)) {
        const html = await response.text();
        assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${href}`);
      }
      checkedLinks++;
    }
    if (file !== 'resume.html') {
      await page.evaluate(async () => {
        for (const image of document.images) { image.loading = 'eager'; }
        await Promise.all(Array.from(document.images, image => image.decode()));
      });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: `.local/qa/${file.replaceAll('/', '-')}-desktop.png`, fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: `.local/qa/${file.replaceAll('/', '-')}-mobile.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${origin}/index.html`);
  await page.getByRole('button', { name: /Search/ }).click();
  await page.getByRole('searchbox').fill('Wiz');
  await page.locator('#search-results a').first().click();
  await page.waitForURL('**/work/iac-governance.html');
  await page.getByRole('button', { name: /Search/ }).click();
  await page.getByRole('searchbox').fill('modernization');
  await page.keyboard.press('ArrowDown');
  assert.ok(await page.locator('#search-results a').first().evaluate(el => el === document.activeElement), 'Search keyboard navigation');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#portfolio-search').evaluate(el => el.open), false);
  assert.ok(await page.locator('[data-search-open]').evaluate(el => el === document.activeElement), 'Search restores focus');

  await page.goto(`${origin}/index.html#lab`);
  for (const scenario of ['service', 'events']) {
    await page.selectOption('#lab-scenario', scenario);
    await page.locator('#lab-risk').uncheck();
    await page.locator('[data-stage="2"]').click();
    assert.match(await page.locator('#lab-visual').innerText(), /public_access = false/);
    await page.locator('#lab-risk').check();
    assert.match(await page.locator('#lab-step-title').innerText(), /policy issue stops/);
    assert.equal(await page.locator('.policy-row .fail').count(), 1);
    await page.locator('[data-stage="4"]').click();
    assert.equal(await page.locator('.approval-state.blocked').count(), 1);
    await page.locator('#lab-risk').uncheck();
    assert.match(await page.locator('.approval-state').innerText(), /Awaiting review/);
    await page.locator('#lab-next').click();
    assert.equal(await page.locator('[data-stage="0"]').getAttribute('aria-pressed'), 'true');
  }
  await page.goto(`${origin}/index.html#project-archive`);
  assert.equal(await page.locator('#project-archive').evaluate(el => el.open), true, 'Archive deep link opens content');
  await page.goto(`${origin}/index.html#skills`);
  assert.equal(await page.locator('#skills details').evaluate(el => el.open), true, 'Credentials deep link opens content');
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(`${origin}/index.html`);
  assert.equal(await staticPage.locator('#work h2').isVisible(), true, 'Professional work stays visible without JS');
  assert.equal(await staticPage.locator('.mobile-nav').isVisible(), true, 'Mobile navigation works without JS');
  assert.equal(await staticPage.locator('[data-search-open]').isVisible(), false, 'Unavailable search is hidden without JS');
  await noJS.close();

  if (process.argv.includes('--pdf')) {
    await page.goto(`${origin}/resume.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: 'assets/Satyanarayana-Reddy-Resume.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    console.log('Updated résumé PDF.');
  }
  assert.deepEqual(errors, [], 'No JavaScript or local resource errors');
  await browser.close();
  console.log(`PASS: ${pages.length} pages, four viewport widths, ${checkedLinks} local destinations, search, policy gating, disclosure links and no-JS fallback.`);
})().catch(error => { console.error(error); process.exit(1); });
