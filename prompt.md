# Integrate <MengToSketchbookLandingPage /> from ThreeUI using its exact source

You are working in an existing application. Implement this component from the exact source linked or included below. Do not recreate it from the preview, screenshot, description, or filename.

Component: `MengToSketchbookLandingPage`
Runtime: Full HTML + DOM/CSS + JavaScript
Source revision: `SHA-256 e0330548b1ac`

Reference brief:
A tactile personal portfolio built as a Singapore sketchbook, with nine illustrated plates, curled page turns, a draggable magnifying glass, zoom controls, a botanical paper atmosphere, and an editorial index.

## Current configured usage

```tsx
import { MengToSketchbookLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <MengToSketchbookLandingPage
        headingFont="instrument-serif"
        bodyFont="newsreader"
        headingWeight="400"
        bodyWeight="400"
        primaryColor="#2b2721"
        headingSize={30}
        bodySize={20}
        headingLetterSpacing={0.010}
      />
    </div>
  );
}
```

## Exact implementation source

Canonical HTML: [meng-to-sketchbook.html](https://threeui.com/landing-pages/meng-to-sketchbook.html)
Complete registered source bundle: [https://threeui.com/source-code/meng-to-sketchbook-landing-page.json](https://threeui.com/source-code/meng-to-sketchbook-landing-page.json)

Required registered files:

- `src/shaders/landing-pages/LandingPages.tsx` — component · SHA-256 `4d379461ad00eb4de7900df312878035383de7e1ed4e13283b8143a2eea9d30a`
- `src/shaders/landing-pages/pageTypography.ts` — controls-source · SHA-256 `809cc65797d531cd3b3ca5a56815d55d24b3ee8d293e4e4bad6fdfe6c83244cc`
- `src/shaders/landing-pages/pageRecipes.ts` — controls-source · SHA-256 `c9d9849cc255bac2d1d938d088c50917f84916f1c516d2bbb27fcfd803523233`
- `src/shaders/landing-pages/LandingPageFrame.tsx` — frame-component · SHA-256 `61de2cc50888aac4ac5557420b07fa47ed3543bb57c1e0055fafdefa53dbaa78`
- `public/landing-pages/meng-to-sketchbook.html` — canonical-source · SHA-256 `e0330548b1ac905cf1b81698163ffa29f8a3a8c39b8d39f9b71ba5b9255b6dd1`
- `src/shaders/threeui.css` — shared-style · SHA-256 `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf`

Required binary assets:

Binary assets cannot be represented as executable text. Copy each asset byte-for-byte from the ThreeUI package and verify its hash:

| Path | MIME type | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `public/landing-pages/meng-to-sketchbook/bg-wash.jpg` | image/jpeg | 250415 | `3e8bbb177216bcb41ddc75cdaca38f732b9cd7ff4aaa409921623356072eb1f6` |
| `public/landing-pages/meng-to-sketchbook/bloom.png` | image/png | 239231 | `7786aef42d10f1fbeca055b3ed14f51a47cb2a390b360eae92119f046989943e` |
| `public/landing-pages/meng-to-sketchbook/botanic-gardens.png` | image/png | 822127 | `48ab10869e7afd4519cdc78d62625cd529bd3b2b5ff1c3c2789a8d721733da15` |
| `public/landing-pages/meng-to-sketchbook/botany-left.png` | image/png | 133820 | `b3ed9e8613ba8826a5e137a5f8ad4bd21b6e7a544bc25e6184891079eae0470c` |
| `public/landing-pages/meng-to-sketchbook/botany-right.png` | image/png | 376050 | `608025a35b8697b536e9ac668e51476c79072d1efb4a04316c068073f51cf655` |
| `public/landing-pages/meng-to-sketchbook/buddha-tooth.png` | image/png | 792335 | `cf73e3fffd80a4c81b18ac83dfdba266c9f5c51e6a66047068a39c2885bc388a` |
| `public/landing-pages/meng-to-sketchbook/divider.png` | image/png | 170548 | `ef8ed266a6ee6f2f6fb8f235657d9ea9e4d57af6d84e75e4e81373de9d3632bb` |
| `public/landing-pages/meng-to-sketchbook/gardens-by-the-bay.png` | image/png | 844878 | `cf1d629d6a72d8cd4a98158fac44e9093a12e55257b43adcdaa07ae3ffbad7d3` |
| `public/landing-pages/meng-to-sketchbook/instrument-serif-italic.woff2` | font/woff2 | 15684 | `6ee678c33f388dd7ba59700ebea635deb98821baafd817b09891f7927177f702` |
| `public/landing-pages/meng-to-sketchbook/instrument-serif.woff2` | font/woff2 | 15040 | `60c06664b5a95c7de6cc3e00d1f9034d78bd1e40b564016b241674449a067d4d` |
| `public/landing-pages/meng-to-sketchbook/joo-chiat.png` | image/png | 796739 | `a46701ba26b5ee31fc6484a12d908cb25d70baea92dec3013260c516e1157a0b` |
| `public/landing-pages/meng-to-sketchbook/lau-pa-sat.png` | image/png | 872602 | `bb020724a54e6dbf72c19bc2a8113393aae43408da2bcada4a62b53eeb3b0ddb` |
| `public/landing-pages/meng-to-sketchbook/marina-bay-sands.png` | image/png | 781481 | `c9cb4423072d69c4177833fa3f92923ce50ab7b395a257349793de3840b88608` |
| `public/landing-pages/meng-to-sketchbook/marina-bay-skyline.png` | image/png | 804832 | `1cebb237d910a1429ff4f17f78efac059094c001629a579b598843eb0bdf363f` |
| `public/landing-pages/meng-to-sketchbook/merlion.png` | image/png | 815697 | `bf5082288e212f62b2e15af766364d79e30050528a7ad48a020aa46d59d4666a` |
| `public/landing-pages/meng-to-sketchbook/newsreader.woff2` | font/woff2 | 131848 | `01817351be3edfc1714fe6d60ddea6a22a169a5ebd033b50c7f9495e5d9c386a` |
| `public/landing-pages/meng-to-sketchbook/singapore-river.png` | image/png | 744018 | `a3fc9cf2be0e3ce4b4630df6897d856ca49c6aca48f66a82e910367328bf667b` |

## Implementation requirements

- Preserve the authored structure, styling, shaders, motion, interactions, responsive behavior, dependencies, and asset paths described by the source.
- Use the configured `<MengToSketchbookLandingPage />` usage above, including the selected variant and props.
- Build directly in the destination project. Do not embed the ThreeUI documentation page and do not approximate the result from its rendered appearance.
- Fetch and read the complete source before editing. If the source cannot be retrieved, stop and report that instead of recreating it.
- After implementation, verify the rendered result and its interactions in the browser.

