import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const label = process.argv[2] || 'current';
assert.match(label, /^[a-z0-9-]+$/i);
const baseline = label === 'before';
const server = await preview({
  preview: { host: '127.0.0.1', port: 4177, strictPort: true },
});
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__renders = 0;
    window.__rectReads = 0;
    const clear = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function (...args) {
      window.__renders++;
      return clear.apply(this, args);
    };
    const rect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (...args) {
      window.__rectReads++;
      return rect.apply(this, args);
    };
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Performance.enable');
  await page.goto('http://127.0.0.1:4177');
  await page.waitForFunction(() =>
    document
      .querySelector('.scene-caption')
      ?.textContent.includes('LIVE RENDER'),
  );
  const before = await cdp.send('Performance.getMetrics');
  const sample = await page.evaluate(async () => {
    const gaps = [];
    const reads = window.__rectReads;
    let previous = 0;
    let start;
    await new Promise((resolve) => {
      const tick = (time) => {
        start ??= time;
        if (previous) gaps.push(time - previous);
        previous = time;
        const elapsed = time - start;
        const x = innerWidth * (0.5 + Math.sin(elapsed / 180) * 0.35);
        window.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerType: 'mouse',
            clientX: x,
            clientY: 350,
          }),
        );
        // Pointer motion, then a scroll down and back up, using the same scenario in every build.
        if (elapsed > 1000) {
          const progress = Math.min((elapsed - 1000) / 2400, 1);
          window.scrollTo({
            top: Math.sin(progress * Math.PI) * 2600,
            behavior: 'instant',
          });
        }
        if (elapsed < 3600) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    return { gaps, rectReads: window.__rectReads - reads };
  });
  const after = await cdp.send('Performance.getMetrics');
  const values = Object.fromEntries(
    after.metrics.map((m) => [m.name, m.value]),
  );
  const original = Object.fromEntries(
    before.metrics.map((m) => [m.name, m.value]),
  );
  const sorted = [...sample.gaps].sort((a, b) => a - b);
  const report = {
    viewport: '1440x1000',
    deviceScaleFactor: 2,
    cpuThrottle: 4,
    frames: sample.gaps.length,
    frameP95Ms: Math.round(sorted[Math.floor(sorted.length * 0.95)] || 0),
    framesOver50ms: sample.gaps.filter((gap) => gap > 50).length,
    layouts: values.LayoutCount - original.LayoutCount,
    layoutMs: Math.round(
      (values.LayoutDuration - original.LayoutDuration) * 1000,
    ),
    styleMs: Math.round(
      (values.RecalcStyleDuration - original.RecalcStyleDuration) * 1000,
    ),
    scriptMs: Math.round(
      (values.ScriptDuration - original.ScriptDuration) * 1000,
    ),
    rectReads: sample.rectReads,
  };
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);
  const renders = () => page.evaluate(() => window.__renders);
  const paused = async (reason) => {
    await page.waitForTimeout(120);
    const count = await renders();
    await page.waitForTimeout(180);
    assert.equal(await renders(), count, reason);
  };
  const resumed = async () => {
    const count = await renders();
    await page.waitForFunction(
      (previous) => window.__renders > previous,
      count,
    );
  };
  if (!baseline) {
    const dpr = await page
      .locator('.scene-canvas canvas')
      .evaluate((el) => el.width / el.clientWidth);
    assert.ok(dpr <= 1.26, 'Desktop DPR budget exceeded');
    await page
      .getByRole('button', { name: 'Kaca pembesar', exact: true })
      .click();
    await paused('3D should pause while the magnifier is open');
    await page.keyboard.press('Escape');
    await resumed();
    await page.keyboard.press('Control+k');
    await paused('3D should pause while a dialog is open');
    await page.keyboard.press('Escape');
    await resumed();
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await paused('Offscreen 3D should pause');
    const card = page.locator('.project-card').first();
    await card.evaluate((el) => {
      window.__rectReads = 0;
      for (let index = 0; index < 100; index++)
        el.dispatchEvent(
          new PointerEvent('pointermove', {
            bubbles: true,
            pointerType: 'mouse',
            clientX: 300 + index,
            clientY: 350,
          }),
        );
    });
    await page.waitForTimeout(100);
    assert.ok(
      await page.evaluate(() => window.__rectReads < 10),
      'Pointer burst repeatedly read layout',
    );
    assert.ok(await card.evaluate((el) => el.style.getPropertyValue('--tilt')));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('canvas'));
    assert.equal(
      await card.evaluate((el) => el.style.getPropertyValue('--tilt')),
      '',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() =>
      document
        .querySelector('.scene-caption')
        ?.textContent.includes('LIVE RENDER'),
    );
    await resumed();
    report.lifecycle =
      'PASS: DPR, lens/dialog/offscreen pause, resume, batched card tilt, reduced-motion cleanup';
  }
  assert.deepEqual(errors, []);
  await mkdir('artifacts', { recursive: true });
  await writeFile(
    'artifacts/desktop-performance-' + label + '.json',
    JSON.stringify(report, null, 2),
  );
  await page.screenshot({
    path: 'artifacts/desktop-performance-' + label + '.png',
  });
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
