import { createServer } from 'vite';
import { renderToPipeableStream } from 'react-dom/server';
import { createElement } from 'react';
import { Writable } from 'node:stream';
import { readFile, writeFile } from 'node:fs/promises';
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const { projects } = await server.ssrLoadModule('/src/data/projects.ts');
  const { profile } = await server.ssrLoadModule('/src/data/profile.ts');
  const markup = await new Promise((resolve, reject) => {
    let html = '';
    const output = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
    });
    output.on('finish', () => resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(createElement(App), {
      onAllReady() {
        stream.pipe(output);
      },
      onError: reject,
    });
  });
  let html = await readFile('dist/index.html', 'utf8');
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        url: p.demo,
        creator: { '@type': 'Person', name: profile.name },
      },
    })),
  });
  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${schema}</script></head>`,
  );
  const configured = process.env.SITE_URL || profile.siteUrl;
  if (configured) {
    const url = new URL(
      configured.includes('://') ? configured : `https://${configured}`,
    );
    if (url.protocol !== 'https:' && url.protocol !== 'http:')
      throw new Error('SITE_URL must use HTTP(S)');
    const canonical = url.origin + '/';
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${canonical}"/><meta property="og:url" content="${canonical}"/></head>`,
    );
    await writeFile(
      'dist/sitemap.xml',
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc></url></urlset>`,
    );
    await writeFile(
      'dist/robots.txt',
      `User-agent: *\nAllow: /\nSitemap: ${canonical}sitemap.xml\n`,
    );
  }
  await writeFile('dist/index.html', html);
  console.log(
    'Prerendered all portfolio sections and project structured data.',
  );
} finally {
  await server.close();
}
