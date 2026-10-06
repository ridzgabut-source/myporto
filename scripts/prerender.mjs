import { createServer } from 'vite';
import { renderToPipeableStream } from 'react-dom/server';
import { createElement } from 'react';
import { Writable } from 'node:stream';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
const json = (value) => JSON.stringify(value).replace(/</g, '\u003c');
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const { projects } = await server.ssrLoadModule('/src/data/projects.ts');
  const { profile } = await server.ssrLoadModule('/src/data/profile.ts');
  const { getPageMetadata, structuredData, projectPath, siteOrigin } =
    await server.ssrLoadModule('/src/lib/seo.ts');
  const site = process.env.SITE_URL || profile.siteUrl;
  const template = await readFile('dist/index.html', 'utf8');
  const routes = ['/', ...projects.map(projectPath), '/404.html'];
  for (const path of routes) {
    const meta = getPageMetadata(path, site);
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
      const stream = renderToPipeableStream(createElement(App, { path }), {
        onAllReady() {
          stream.pipe(output);
        },
        onError: reject,
      });
    });
    const head = `<title>${escape(meta.title)}</title>
<meta name="description" content="${escape(meta.description)}"/>
<meta name="robots" content="${meta.indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow'}"/>
<link rel="canonical" href="${escape(meta.canonical)}"/>
<meta property="og:type" content="website"/><meta property="og:site_name" content="Farid — Developer Portfolio"/>
<meta property="og:locale" content="id_ID"/><meta property="og:title" content="${escape(meta.title)}"/>
<meta property="og:description" content="${escape(meta.description)}"/><meta property="og:url" content="${escape(meta.canonical)}"/>
<meta property="og:image" content="${escape(meta.image)}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="Farid, Full Stack Developer Indonesia ? portfolio website"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(meta.title)}"/><meta name="twitter:description" content="${escape(meta.description)}"/><meta name="twitter:image" content="${escape(meta.image)}"/><meta name="twitter:image:alt" content="Portofolio website Farid"/>
<script type="application/ld+json">${json(structuredData(path, site))}</script>`;
    const html = template
      .replace(/<title>[^]*?<\/title>/, '')
      .replace(/<meta name="description"[^>]*>/, '')
      .replace('</head>', head + '</head>')
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    const file =
      path === '/'
        ? 'dist/index.html'
        : path === '/404.html'
          ? 'dist/404.html'
          : `dist${path}index.html`;
    if (path.endsWith('/') && path !== '/')
      await mkdir(`dist${path}`, { recursive: true });
    await writeFile(file, html);
  }
  const base = siteOrigin(site);
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
      .filter((path) => path !== '/404.html')
      .map(
        (path) => `<url><loc>${escape(new URL(path, base).href)}</loc></url>`,
      )
      .join('')}</urlset>`,
  );
  await writeFile(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`,
  );
  console.log(
    `Prerendered homepage, ${projects.length} project pages, and 404; generated metadata, structured data, robots and sitemap.`,
  );
} finally {
  await server.close();
}
