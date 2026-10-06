import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = await preview({
  preview: { host: '127.0.0.1', port: 4176, strictPort: true },
});
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const paths = [
    '/',
    '/projects/cleancraft-laundry/',
    '/projects/catalog/',
    '/projects/creative-agency/',
    '/projects/barbershop/',
    '/projects/wedding/',
  ];
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.ok(robots.includes('Sitemap: https://ridzweb.online/sitemap.xml'));
  assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length);
  assert.ok(!sitemap.includes('404'));
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  const titles = new Set();
  for (const path of paths) {
    const html = await readFile(
      path === '/' ? 'dist/index.html' : `dist${path}index.html`,
      'utf8',
    );
    assert.ok(html.includes('id="root"') && html.includes('<h1'));
    const response = await noJs.goto(`http://127.0.0.1:4176${path}`);
    assert.equal(response.status(), 200);
    const title = await noJs.title();
    assert.ok(!titles.has(title), `Duplicate title for ${path}`);
    titles.add(title);
    assert.equal(await noJs.locator('h1').count(), 1);
    const expected = `https://ridzweb.online${path}`;
    assert.equal(
      await noJs.locator('link[rel="canonical"]').getAttribute('href'),
      expected,
    );
    assert.equal(
      await noJs.locator('meta[property="og:url"]').getAttribute('content'),
      expected,
    );
    assert.ok(sitemap.includes(expected));
    assert.ok(
      await noJs.locator('meta[name="description"]').getAttribute('content'),
    );
    assert.equal(
      await noJs.locator('meta[property="og:image"]').getAttribute('content'),
      'https://ridzweb.online/og/portfolio.png',
    );
    assert.equal(
      await noJs.locator('meta[name="twitter:card"]').getAttribute('content'),
      'summary_large_image',
    );
    assert.match(
      await noJs.locator('meta[name="robots"]').getAttribute('content'),
      /^index,follow/,
    );
    const schema = JSON.parse(
      await noJs.locator('script[type="application/ld+json"]').textContent(),
    );
    assert.equal(schema['@context'], 'https://schema.org');
    assert.ok(schema['@graph'].some((item) => item['@type'] === 'Person'));
    if (path === '/') {
      assert.equal(await noJs.locator('.project-card').count(), 5);
      assert.equal(
        await noJs.locator('.project-actions a[href^="/projects/"]').count(),
        5,
      );
      assert.equal(
        await noJs
          .locator(
            '.project-actions a[href="https://laundrymockup.netlify.app/"]',
          )
          .count(),
        1,
      );
      assert.equal(
        schema['@graph'].find((item) => item['@type'] === 'ItemList')
          .numberOfItems,
        5,
      );
    } else {
      assert.equal(await noJs.locator('.project-next a').count(), 4);
      assert.ok(
        schema['@graph'].some((item) => item['@type'] === 'BreadcrumbList'),
      );
      assert.ok(
        await noJs.getByRole('link', { name: 'Buka live demo' }).isVisible(),
      );
    }
  }
  await noJs.goto('http://127.0.0.1:4176/404.html');
  assert.match(
    await noJs.locator('meta[name="robots"]').getAttribute('content'),
    /^noindex/,
  );
  assert.equal(await noJs.locator('h1').textContent(), 'Mungkin salah belok.');
  assert.ok(
    (await readFile('dist/_redirects', 'utf8')).includes('/* /404.html 404'),
  );
  for (const asset of [
    'og/portfolio.png',
    'fonts/dm-sans-latin.woff2',
    'fonts/space-grotesk-latin.woff2',
    'fonts/instrument-serif.woff2',
    'fonts/instrument-serif-italic.woff2',
    'projects/laundry.jpg',
    'textures/chrome-matcap.png',
  ])
    await access('dist/' + asset);
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|Minified React/.test(message.text())
    )
      errors.push(message.text());
  });
  for (const path of paths.slice(1)) {
    await page.goto('http://127.0.0.1:4176' + path);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('h1').count(), 1);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page.goto('http://127.0.0.1:4176');
  await page.evaluate(() => document.fonts.ready);
  const externalFonts = await page.evaluate(
    () =>
      performance
        .getEntriesByType('resource')
        .filter((entry) => /fonts\.googleapis|fonts\.gstatic/.test(entry.name))
        .length,
  );
  assert.equal(externalFonts, 0);
  assert.equal(
    await page
      .locator('.hero-stage .scene-wrap')
      .evaluate((element) => getComputedStyle(element).position),
    'relative',
  );
  const cards = await page.locator('.floating-card').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom };
    }),
  );
  assert.ok(cards[0].right <= cards[1].x, 'Mobile navigation cards overlap');
  assert.deepEqual(errors, []);
  console.log(
    'PASS: six indexable static pages, unique titles/canonicals, sitemap/robots, 404 noindex/hosting rule, Person/ProfilePage/CreativeWork/breadcrumbs, five projects without JS, mobile detail-page hydration/overflow, local font assets and non-overlapping hero cards.',
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
