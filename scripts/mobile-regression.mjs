import { chromium } from 'playwright';
import { preview } from 'vite';
import assert from 'node:assert/strict';
const server = await preview({
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
});
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 320, height: 568 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__drawCalls = 0;
    for (const context of [WebGLRenderingContext, WebGL2RenderingContext]) {
      for (const name of ['drawElements', 'drawArrays']) {
        const original = context.prototype[name];
        context.prototype[name] = function (...args) {
          window.__drawCalls++;
          return original.apply(this, args);
        };
      }
    }
  });
  await page.goto('http://127.0.0.1:4175');
  await page.waitForFunction(() => window.__drawCalls > 0);
  assert.equal(await page.locator('canvas').count(), 1);
  assert.match(
    await page.locator('.scene-caption').textContent(),
    /LIVE RENDER/,
  );
  assert.equal(
    await page.locator('canvas').evaluate((canvas) => canvas.width),
    await page.locator('.scene-canvas').evaluate((host) => host.clientWidth),
  );
  assert.ok(await page.locator('.mobile-flight-tail').isVisible());
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  await menu.tap();
  await page.waitForTimeout(300);
  const menuDraws = await page.evaluate(() => window.__drawCalls);
  await page.waitForTimeout(160);
  assert.equal(
    await page.evaluate(() => window.__drawCalls),
    menuDraws,
    '3D should pause while the menu is open',
  );
  await menu.tap();
  await page.waitForTimeout(300);
  assert.ok(
    (await page.evaluate(() => window.__drawCalls)) > menuDraws,
    '3D should resume after closing the menu',
  );
  assert.equal(
    await page
      .locator('.navbar')
      .evaluate((element) => getComputedStyle(element).backdropFilter),
    'none',
  );
  await page.evaluate(() =>
    window.scrollTo({ top: 1500, behavior: 'instant' }),
  );
  await page.waitForTimeout(1200);
  const hiddenDraws = await page.evaluate(() => window.__drawCalls);
  await page.waitForTimeout(160);
  assert.equal(
    await page.evaluate(() => window.__drawCalls),
    hiddenDraws,
    'Offscreen 3D should stop rendering',
  );
  const before = await page
    .locator('.paper-plane')
    .evaluate((element) => element.style.transform);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForTimeout(350);
  assert.equal(
    await page
      .locator('.paper-plane')
      .evaluate((element) => element.style.transform),
    before,
    'Height-only toolbar resize should not shift the flight route',
  );
  assert.equal(
    await page.locator('canvas').count(),
    1,
    'Toolbar resize should retain the renderer',
  );
  assert.equal(
    await page
      .locator('.navbar.scrolled')
      .evaluate((element) => getComputedStyle(element).backdropFilter),
    'none',
  );
  // Section positions are cached: a scrolling frame should not read all six rectangles.
  const reads = await page.evaluate(async () => {
    let count = 0;
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      if (this.matches?.('#main section[id]')) count++;
      return original.call(this);
    };
    await new Promise((resolve) => {
      let start;
      const scroll = (time) => {
        start ??= time;
        const progress = Math.min((time - start) / 600, 1);
        window.scrollTo({ top: 1500 + progress * 1000, behavior: 'instant' });
        if (progress < 1) requestAnimationFrame(scroll);
        else resolve();
      };
      requestAnimationFrame(scroll);
    });
    await new Promise((resolve) => setTimeout(resolve, 150));
    Element.prototype.getBoundingClientRect = original;
    return count;
  });
  assert.ok(
    reads <= 12,
    `Unexpected repeated section measurements during scroll: ${reads}`,
  );
  // Exercise actual browser touch scrolling rather than only programmatic scrolling.
  const cdp = await page.context().newCDPSession(page);
  const initialScroll = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 150, y: 450 }],
  });
  for (let index = 1; index <= 8; index++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 150, y: 450 - index * 28 }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await page.waitForTimeout(200);
  assert.ok((await page.evaluate(() => scrollY)) > initialScroll);
  for (const width of [280, 320, 360]) {
    await page.setViewportSize({ width, height: 640 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px page overflows`,
    );
    await menu.tap();
    await page.waitForTimeout(280);
    assert.equal(await page.locator('nav a:visible').count(), 6);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px menu overflows`,
    );
    await page.keyboard.press('Escape');
    await page.waitForTimeout(280);
  }
  // Check secondary text against its nearest opaque surface, including dark terminal text.
  const contrasts = await page.evaluate(() => {
    const selectors = [
      '.hero-description',
      '.floating-card p',
      '.card-caption',
      '.section-description',
      '.eyebrow',
      '.about-bento .mono',
      '.tags>span',
      '.timeline-date',
      '.project-meta',
      '.contact-links>.mono',
      '.contact-time',
      'footer>span',
      '.terminal-top',
      '.terminal-status',
    ];
    const rgb = (color) =>
      color
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number);
    const luminance = (color) =>
      rgb(color)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        })
        .reduce(
          (total, value, index) =>
            total + value * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    const result = [];
    for (const element of document.querySelectorAll(selectors.join(','))) {
      if (element.closest('.project-preview')) continue;
      let surface = element;
      while (
        surface &&
        getComputedStyle(surface).backgroundColor.endsWith(', 0)')
      )
        surface = surface.parentElement;
      const foreground = luminance(getComputedStyle(element).color);
      const background = luminance(
        surface
          ? getComputedStyle(surface).backgroundColor
          : 'rgb(250,250,247)',
      );
      result.push({
        text: element.textContent.trim().slice(0, 32),
        ratio:
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05),
      });
    }
    return result;
  });
  const failures = contrasts.filter((item) => item.ratio < 4.5);
  assert.deepEqual(
    failures,
    [],
    `Low contrast secondary text: ${JSON.stringify(failures)}`,
  );
  await page.screenshot({
    path: 'artifacts/mobile-restored.png',
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(150);
  assert.equal(await page.locator('canvas').count(), 0);
  assert.ok(!(await page.locator('.flight-layer').isVisible()));
  assert.deepEqual(errors, []);
  console.log(
    `PASS: mobile 3D/DPR 1, render pause/resume/offscreen, mobile airplane tail, stable toolbar resize, cached scroll geometry (${reads} reads), touch scrolling, menus at 280/320/360px, no blur, ${contrasts.length} secondary-text contrast checks, reduced-motion cleanup.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
