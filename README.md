# Farid / Interactive Developer Portfolio

Off-white editorial theme with serif typography, bento content, floating cards, a procedural chrome Three.js sculpture, and a bold contact CTA. React + TypeScript + Vite and lazy Three.js; native CSS handles interface motion. Run `npm install`, `npm run dev`; production: `npm run build`.

## Content
- `src/data/profile.ts`: identity, email, WhatsApp, GitHub, production URL. Empty contact URLs are hidden.
- `src/data/projects.ts`: five live demo URLs, case studies, categories, optional repositories. CleanCraft Laundry uses a real website screenshot; the other project previews are interface illustrations. Backend implementation and architecture are not asserted.
- `src/data/skills.ts`: provisional proficiency levels; review before publishing.
- `src/data/experience.ts`: project milestones rather than employment history.
- `src/three/Scene.tsx`: lazy Three.js, adaptive DPR/particles, offscreen pause, cleanup, static fallback, reduced motion.

## Launch
The GitHub repositories page is linked in contact. Navbar, hero, conversation, and the large contact banner open WhatsApp with contextual messages. Edit `whatsappMessages` in `src/data/profile.ts` to customize the text. LinkedIn and CV actions have been removed. WhatsApp accepts a phone number or HTTPS wa.me link. Set `profile.siteUrl` or the SITE_URL environment variable before building; the prerender script generates canonical, og:url, sitemap.xml and sitemap robots directives using that real domain.

Analytics emits `portfolio:analytics` CustomEvents and pushes to an existing `window.dataLayer`: page_view, project_view, project_demo_click, github_click, contact_click. Connect a provider to collect events; nothing transmitted by default.

The production build prerenders all content to HTML and hydrates React; content remains available without JavaScript, independently of 3D. Vite retained because Next.js was recommended rather than mandatory. Measure LCP/CLS/INP after deployment; build checks do not guarantee PRD performance targets.

Unused sketchbook reference code/assets, download helpers, and the original prompt have been deleted from the workspace. Generated build files, dependencies, screenshots, performance reports, and private environment files are also ignored. The GitHub repository contains the active website source, configuration, dependency lockfile, and reusable checks.

## Paper interactions
Hold the right mouse button over non-interactive page content to reveal a 1.75x magnifier. Release to close; Shift + right-click and right-clicks on links/controls retain their native menus. The bottom-left button toggles the lens for mouse/keyboard use; arrows move it and Escape closes it. The visual clone is inert, hides duplicate IDs, and uses the static sculpture fallback in place of the WebGL canvas. Lens closes on blur, pointer cancellation, mobile resize, or opening a dialog.

Paper grain, a pointer spotlight, and an SVG paper airplane add subtle motion. The plane follows section positions in both scroll directions; on mobile it follows the side margin. No extra WebGL context or canvas renderer is created. Plane, trail, and spotlight stop under reduced motion. Animation frames are scheduled only while moving; listeners/observers are disposed on unmount.

## Mobile navigation and feedback
Mobile retains no magnifier. A compositor transform/opacity menu animates open and closed with a two-line hamburger morph without animating panel height. Closed links are inert; outside tap, Escape, selecting a section, and switching to desktop close the menu. Open menus lock background scrolling and restore it on close; short landscape screens scroll inside the panel. A thin reading-progress line tracks scroll.

Mobile feedback uses one reusable ink ring via compositor animation, only on short taps (swipes and pointer cancellation suppress it). Section headings, bento tiles, and new filtered cards reveal once via IntersectionObserver; markup remains visible without JS. Reduced motion disables ripple/reveals/menu transitions, and no additional canvas or rendering dependency is added.

## Small-screen performance
Phones retain the animated Three.js sculpture at DPR 1, with fewer geometry segments and a pre-rendered chrome matcap texture. Desktop shares this baked lighting instead of generating a runtime environment; `npm run assets:matcap` regenerates the mobile texture. The small static scene shell is included in the initial HTML and client bundle; Three.js loads separately when the scene is visible and after critical fonts paint. Scene rendering stops outside the viewport, while a menu, dialog, or magnifier is open, or when the tab is hidden. Animation time pauses with it, so resuming never skips the sculpture ahead. Reduced motion and unavailable WebGL use the static fallback.

`PaperFlight` and `usePaperFlight` handle airplane motion separately from the desktop lens. Section geometry is cached on layout changes, scroll updates are batched, and interpolation uses elapsed time. Smooth route transitions and a stable mobile flight viewport avoid jumps when browser toolbars resize. The mobile dashed tail travels with the plane in one layer; desktop retains its longer path. Navbar progress caches document height, and section navigation waits for the panel to close before scrolling. Mobile blur filters are removed; at <=480px, grain is disabled and scroll reveals only affect headings.

Secondary text shares a darker token, and small labels/body copy have larger responsive sizes. `npm run format` maintains readable formatting of the active portfolio. `node scripts/mobile-performance.mjs` records menu/scroll layout and frame metrics under 4x CPU slowdown at 320x568; browser emulation does not guarantee frame rate on a physical phone.

## Verification

Run `npm run lint`, `npm run build`, `npm run test:smoke`, `npm run test:mobile`, `npm run test:desktop`, and `npm run test:seo`. Browser checks use an installed Google Chrome. Screenshots and performance reports are written to the ignored `artifacts/` folder.

## Mobile redesign and SEO

Phones use a left-aligned hero, a bounded 3D scene, two stable navigation cards, readable body text, horizontally scrollable filters, larger tap targets, and a simplified skills/timeline layout. The desktop editorial direction remains. Project counts are derived from the data; CleanCraft Laundry uses a real demo screenshot. UI illustrations remain for the other projects.

All five project case studies are prerendered to `/projects/<slug>/index.html`, with real internal links and content that remains readable without JavaScript. Homepage and case-study pages have unique titles/descriptions, canonical URLs, Open Graph/Twitter cards, and matching JSON-LD. The sitemap lists only real indexable pages; `404.html` uses noindex and Netlify serves missing paths with status 404 via `_redirects`. No blanket SPA rewrite should override these static pages.

WOFF2 fonts are served locally with swap and selected preloads. The initial client bundle no longer includes Framer Motion. `_headers` configures cache rules on Netlify; configure equivalent rules in other hosts. `npm run assets:social` regenerates the 1200 x 630 social preview using local Chrome. `npm run test:seo` verifies generated HTML, sitemap, schemas, image/font references and case-study hydration.

After deploying the built `dist/` folder, submit `https://ridzweb.online/sitemap.xml` to Google Search Console and verify indexing of the homepage and case-study URLs. Search Console ownership verification and indexing are account actions, not performed by the build. Technical SEO and local audits cannot guarantee search rankings. References: [Google developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers), [ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

A local Lighthouse mobile audit after the 3D optimization scored Performance 96-97, Accessibility 100, SEO 100 across the optimized and final runs, with LCP 2.3s, TBT 100-150ms and CLS 0.001. These are simulated local measurements; hosting latency, real device hardware and search indexing require checks after deployment. This earlier mobile-only audit predates the desktop optimization below.


## Desktop performance and animation

Desktop now uses the existing chrome matcap, a lighter torus mesh, and one instanced draw for its five orbiting satellites. DPR is capped at 1.25 and falls to 1 after sustained slow frames. A 60 fps render budget preserves the fractional timing remainder on high-refresh displays; time-based pointer easing keeps the sculpture responsive without abrupt rotation. The still-life fallback remains until the first real frame is drawn.

The pointer glow moves a bounded gradient with a compositor transform. Desktop cards, labels and the scrolling navbar no longer blur the moving content underneath. Project tilt uses one delegated handler, caches card geometry, batches pointer bursts into a single animation frame, and resets on scroll, resize or reduced motion. The hero's italic font is preloaded. Case studies expose a breadcrumb navigation landmark linked to their WebPage JSON-LD.

Local Chrome Lighthouse audits on 2026-10-07 (production build, same local origin):

| Metric | Desktop before | Desktop final | Mobile final |
| --- | --- | --- | --- |
| Performance | 86 | 100 | 98 |
| Accessibility | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| LCP | 0.53 s | 0.47 s | 2.12 s |
| Total Blocking Time | 329 ms | 0 ms | 80 ms |
| CLS | 0.0095 | <0.001 | <0.001 |

Run npm run test:desktop to exercise pointer/scroll motion at 1440x1000, DPR 2 and 4x CPU slowdown. In the recorded before/final runs, script time fell from 472 ms to 266 ms; frame p95 was 17 ms in both, with frames over 50 ms falling from 1 to 0. It also checks DPR, pause/resume around the lens/dialog/offscreen state, pointer batching and reduced-motion cleanup. Use node scripts/desktop-performance.mjs <label> to retain a named report; the before label records a baseline without the new lifecycle assertions.

Raw audit reports and screenshots are in the ignored artifacts/ folder (desktop-before.json, desktop-final.json, mobile-final.json, and desktop-performance-final.json). Measurements are local simulations, not guaranteed production scores or physical-device frame rates. The larger Three.js chunk remains lazy-loaded; the production build still reports its size advisory. Recheck the deployed URL after publishing.

Implementation references: [animation performance](https://web.dev/articles/animations-and-performance/) and [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
