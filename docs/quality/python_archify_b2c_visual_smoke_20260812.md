# Python Reading Trainer — Archify B2C Visual Smoke Evidence

Date: 2026-08-12
Feature branch: `feat/python-reading-graph-ir`
B2B wiring commit: `c65cfb8cfc4ba442a3a238de9a9f744f6cab0847`
B2C harness-final commit: `e56f57c116ac43c806b45015a1ac573acefdd12c`
Main baseline during smoke: `fd018ef05c5a716cbddbe72a305ec58880e355dc`

## Final result

`RESULT=PASS_PWA_ARCHIFY_EXECUTION_LENS_B2C_VISUAL_SMOKE`

## Desktop 1200px

- `PWA_LOAD=PASS` — pathname `/src/pwa/index.html`
- `CODE_TAB_HANDLER_READY=PASS` — `onclick=ready`
- `CODE_VIEW_VISIBLE=PASS` — `width=1180 height=2110`
- `ARCHIFY_READY=PASS` — `state=ready`
- `ONE_LENS_CARD=PASS` — count 1
- `ONE_ARCHIFY_IFRAME=PASS` — count 1
- `MERMAID_PRESERVED=PASS`
- `LENS_VISIBLE=PASS`
- `ARCHIFY_BEFORE_MERMAID=PASS` — indices `2,3`
- `CARD_WITHIN_VIEWPORT=PASS` — left `38`, right `1148`, width `1110`, viewport `1185`
- `NO_OUTER_HORIZONTAL_OVERFLOW=PASS` — scrollWidth/clientWidth `1185/1185`
- `IFRAME_FITS_CARD=PASS` — iframe `1076`, card `1110`
- `VIEWPORT_HEIGHT_POLICY=PASS` — `520px`
- `SANDBOX_STATIC=PASS` — `sandbox=""`
- `SRCDOC_HAS_SVG=PASS` — bytes `616857`
- `SVG_VIEWBOX_PRESENT=PASS` — `0 0 720 652`
- `CANONICAL_PAYLOAD_PRESENT=PASS` — idMap 5

## Narrow 390px

- `PWA_LOAD=PASS` — pathname `/src/pwa/index.html`
- `CODE_TAB_HANDLER_READY=PASS` — `onclick=ready`
- `CODE_VIEW_VISIBLE=PASS` — `width=375 height=6507`
- `ARCHIFY_READY=PASS` — `state=ready`
- `ONE_LENS_CARD=PASS` — count 1
- `ONE_ARCHIFY_IFRAME=PASS` — count 1
- `MERMAID_PRESERVED=PASS`
- `LENS_VISIBLE=PASS`
- `ARCHIFY_BEFORE_MERMAID=PASS` — indices `2,3`
- `CARD_WITHIN_VIEWPORT=PASS` — left `27`, right `348`, width `321`, viewport `375`
- `NO_OUTER_HORIZONTAL_OVERFLOW=PASS` — scrollWidth/clientWidth `375/375`
- `IFRAME_FITS_CARD=PASS` — iframe `287`, card `321`
- `VIEWPORT_HEIGHT_POLICY=PASS` — `440px`
- `SANDBOX_STATIC=PASS` — `sandbox=""`
- `SRCDOC_HAS_SVG=PASS` — bytes `616857`
- `SVG_VIEWBOX_PRESENT=PASS` — `0 0 720 652`
- `CANONICAL_PAYLOAD_PRESENT=PASS` — idMap 5

## Intermediate smoke-harness failures

Two earlier failures were test-harness races, not product failures.

1. The first iframe's initial `about:blank` document was mistaken for the loaded PWA because `readyState=complete` was used too early.
2. The first desktop case clicked the Code tab before `app.js` had installed the tab `onclick` handler, so the Archify artifact rendered while the Code view ancestor remained hidden and layout measurements returned zero.

Both fixes were made only in `tools/pwa_archify_visual_smoke_harness_v0_1.html`. Production PWA/server code was not changed for these fixes.

## Release interpretation

B2C is considered PASS. Main merge and GitHub Pages deployment remain blocked until the final pre-main readiness gate re-runs the non-visual regression suite and verifies branch/main cleanliness and wiring invariants.
