import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const serif = (
    await readFile('public/fonts/instrument-serif.woff2')
  ).toString('base64');
  await page.setContent(
    `<style>@font-face{font-family:Editorial;src:url(data:font/woff2;base64,${serif})}*{box-sizing:border-box}body{margin:0;background:#e9e6db;font-family:Arial,sans-serif;color:#191919}.page{margin:20px;padding:48px 58px;height:590px;background:#fafaf7;border:1px solid #d7d3c7;border-radius:24px;position:relative;overflow:hidden}.brand{font-size:38px;font-weight:700;letter-spacing:-2px}.label{font-size:13px;letter-spacing:2px;margin-top:54px;color:#55544b}h1{font:92px/1 Editorial,Georgia,serif;letter-spacing:-2px;margin:22px 0;width:790px}p{font-size:20px;line-height:1.6;max-width:650px;color:#55544b}.footer{position:absolute;left:58px;right:58px;bottom:42px;border-top:1px solid #d7d3c7;padding-top:24px;display:flex;justify-content:space-between;font-size:14px}.mark{position:absolute;right:-65px;top:165px;width:350px;height:350px;border:1px solid #b0a68d;border-radius:50%;transform:rotate(-25deg)}.mark:before,.mark:after{content:'';position:absolute;inset:35px -20px;border:1px solid #b0a68d;border-radius:50%;transform:rotate(55deg)}.mark:after{transform:rotate(-35deg)}.star{position:absolute;right:103px;top:70px;font-size:54px}</style><div class="page"><div class="brand">farid<sup style="font-size:12px;vertical-align:super;letter-spacing:0">&reg;</sup></div><div class="star"><svg width="44" height="44" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 1 24 16 39 20 24 24 20 39 16 24 1 20 16 16Z" fill="#191919"/></svg></div><div class="label">FULL STACK DEVELOPER / INDONESIA</div><h1>Thoughtful code.<br>Meaningful experiences.</h1><p>Website, sistem booking, dan pengalaman digital<br>yang dirancang dengan perhatian.</p><div class="mark"></div><div class="footer"><span>SELECTED WORK / DEVELOPER PORTFOLIO</span><span>ridzweb.online</span></div></div>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await mkdir('public/og', { recursive: true });
  await page.screenshot({ path: 'public/og/portfolio.png' });
} finally {
  await browser.close();
}
