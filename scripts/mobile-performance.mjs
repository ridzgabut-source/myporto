import { chromium } from 'playwright';
import { preview } from 'vite';
import { writeFile, mkdir } from 'node:fs/promises';
const server = await preview({
  preview: { host: '127.0.0.1', port: 4174, strictPort: true },
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
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Performance.enable');
  await page.goto('http://127.0.0.1:4174');
  await page.waitForTimeout(1600);
  const before = await cdp.send('Performance.getMetrics');
  const times = await page.evaluate(async () => {
    const gaps = [];
    let previous = 0;
    const observe = (time) => {
      if (previous) gaps.push(time - previous);
      previous = time;
      if (gaps.length < 220) requestAnimationFrame(observe);
    };
    requestAnimationFrame(observe);
    const wait = (duration) =>
      new Promise((resolve) => setTimeout(resolve, duration));
    const menu = document.querySelector('.menu-toggle');
    for (let i = 0; i < 3; i++) {
      menu.click();
      await wait(350);
      menu.click();
      await wait(350);
    }
    await new Promise((resolve) => {
      let first;
      const scroll = (time) => {
        first ??= time;
        const progress = Math.min((time - first) / 1200, 1);
        window.scrollTo({ top: progress * 2500, behavior: 'instant' });
        if (progress < 1) requestAnimationFrame(scroll);
        else resolve();
      };
      requestAnimationFrame(scroll);
    });
    await wait(500);
    return gaps;
  });
  const after = await cdp.send('Performance.getMetrics');
  const values = Object.fromEntries(
    after.metrics.map((metric) => [metric.name, metric.value]),
  );
  const original = Object.fromEntries(
    before.metrics.map((metric) => [metric.name, metric.value]),
  );
  const sorted = [...times].sort((a, b) => a - b);
  const report = {
    viewport: '320x568',
    cpuThrottle: 4,
    frames: times.length,
    frameP95Ms: Math.round(sorted[Math.floor(sorted.length * 0.95)] || 0),
    framesOver50ms: times.filter((gap) => gap > 50).length,
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
    canvases: await page.locator('canvas').count(),
  };
  await mkdir('artifacts', { recursive: true });
  await writeFile(
    `artifacts/mobile-performance-${process.argv[2] || 'current'}.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
