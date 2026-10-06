# Farid / Interactive Developer Portfolio

Off-white editorial theme with serif typography, bento content, floating cards, a procedural chrome Three.js sculpture, and a bold contact CTA. React + TypeScript + Vite, Three.js, Framer Motion. Run `npm install`, `npm run dev`; production: `npm run build`.

## Content
- `src/data/profile.ts`: identity, email, WhatsApp, GitHub, production URL. Empty contact URLs are hidden.
- `src/data/projects.ts`: four original demo URLs, case studies, categories, optional repositories. Preview artwork is an interface illustration, not a screenshot. Replace with verified screenshots when available. Backend implementation and architecture are not asserted.
- `src/data/skills.ts`: provisional proficiency levels; review before publishing.
- `src/data/experience.ts`: project milestones rather than employment history.
- `src/three/Scene.tsx`: lazy Three.js, adaptive DPR/particles, offscreen pause, cleanup, static fallback, reduced motion.

## Launch
The GitHub repositories page is linked in contact. Navbar, hero, conversation, and the large contact banner open WhatsApp with contextual messages. Edit `whatsappMessages` in `src/data/profile.ts` to customize the text. LinkedIn and CV actions have been removed. WhatsApp accepts a phone number or HTTPS wa.me link. Set `profile.siteUrl` or the SITE_URL environment variable before building; the prerender script generates canonical, og:url, sitemap.xml and sitemap robots directives using that real domain.

Analytics emits `portfolio:analytics` CustomEvents and pushes to an existing `window.dataLayer`: page_view, project_view, project_demo_click, github_click, contact_click. Connect a provider to collect events; nothing transmitted by default.

The production build prerenders all content to HTML and hydrates React; content remains available without JavaScript, independently of 3D. Vite retained because Next.js was recommended rather than mandatory. Measure LCP/CLS/INP after deployment; build checks do not guarantee PRD performance targets.

Unused sketchbook reference code/assets, download helpers, and the original prompt are kept locally and excluded from the repository. Generated build files, dependencies, screenshots, performance reports, and private environment files are also ignored. The GitHub repository contains the active website source, configuration, dependency lockfile, and reusable checks.

## Paper interactions
Hold the right mouse button over non-interactive page content to reveal a 1.75x magnifier. Release to close; Shift + right-click and right-clicks on links/controls retain their native menus. The bottom-left button toggles the lens for mouse/keyboard use; arrows move it and Escape closes it. The visual clone is inert, hides duplicate IDs, and uses the static sculpture fallback in place of the WebGL canvas. Lens closes on blur, pointer cancellation, mobile resize, or opening a dialog.

Paper grain, a pointer spotlight, and an SVG paper airplane add subtle motion. The plane follows section positions in both scroll directions; on mobile it follows the side margin. No extra WebGL context or canvas renderer is created. Plane, trail, and spotlight stop under reduced motion. Animation frames are scheduled only while moving; listeners/observers are disposed on unmount.

## Mobile navigation and feedback
Mobile retains no magnifier. A compositor transform/opacity menu animates open and closed with a two-line hamburger morph without animating panel height. Closed links are inert; outside tap, Escape, selecting a section, and switching to desktop close the menu. Open menus lock background scrolling and restore it on close; short landscape screens scroll inside the panel. A thin reading-progress line tracks scroll.

Mobile feedback uses one reusable ink ring via compositor animation, only on short taps (swipes and pointer cancellation suppress it). Section headings, bento tiles, and new filtered cards reveal once via IntersectionObserver; markup remains visible without JS. Reduced motion disables ripple/reveals/menu transitions, and no additional canvas or rendering dependency is added.

## Small-screen performance
Phones retain the animated Three.js sculpture at DPR 1, with fewer geometry segments and a standard chrome material. Scene rendering stops outside the viewport, while a menu is open, or when the tab is hidden. Animation time pauses with it, so resuming never skips the sculpture ahead. Reduced motion and unavailable WebGL use the static fallback.

`PaperFlight` and `usePaperFlight` handle airplane motion separately from the desktop lens. Section geometry is cached on layout changes, scroll updates are batched, and interpolation uses elapsed time. Smooth route transitions and a stable mobile flight viewport avoid jumps when browser toolbars resize. The mobile dashed tail travels with the plane in one layer; desktop retains its longer path. Navbar progress caches document height, and section navigation waits for the panel to close before scrolling. Mobile blur filters are removed; at <=480px, grain is disabled and scroll reveals only affect headings.

Secondary text shares a darker token, and small labels/body copy have larger responsive sizes. `npm run format` maintains readable formatting of the active portfolio. `node scripts/mobile-performance.mjs` records menu/scroll layout and frame metrics under 4x CPU slowdown at 320x568; browser emulation does not guarantee frame rate on a physical phone.

## Verification

Run `npm run lint`, `npm run build`, `npm run test:smoke`, and `npm run test:mobile`. Browser checks use an installed Google Chrome. Screenshots and performance reports are written to the ignored `artifacts/` folder.
