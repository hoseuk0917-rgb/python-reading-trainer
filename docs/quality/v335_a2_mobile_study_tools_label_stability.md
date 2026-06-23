# V335-A2 Mobile Study Tools Label Stability

Date: 2026-06-23
Base tag: quality-v335-ux-manual-smoke-a1-20260623
Version: 20260623_v335_a2

## Scope

Stabilize the mobile study-tools settings toggle label.

During real-phone smoke testing, the study-tools toggle label could appear as either:

- `설정`
- `설정 펼치기`

depending on mobile viewport/cache/state timing.

## Root cause

Multiple mobile study-tools layers wrote to the same toggle button:

- V27.2 used `설정 펼치기` / `설정 접기`.
- V27.3 used `설정 펼치기` for default collapsed mobile state.
- V27.4 shortened the mobile label to `설정` / `접기`.

Mobile browser address-bar collapse/expand can trigger resize-like behavior, causing the visible label to be rewritten.

## Change

V27.4 now uses the same explicit labels as the earlier compact layer:

- collapsed: `설정 펼치기`
- expanded: `설정 접기`

English labels remain:

- collapsed: `Open settings`
- expanded: `Collapse settings`

## Validation

- `node --check src\pwa\app.js`: PASS
- Version bumped to `20260623_v335_a2`.
- Root entry version updated.
- PWA script/style cache-bust query updated.
- Direct PWA runtime scripts now reference `20260623_v335_a2`.

## Expected mobile behavior

On mobile, the study-tools toggle should no longer flicker between the shortened label and the explicit label.

Expected Korean labels:

- `설정 펼치기`
- `설정 접기`

This is a mobile study-tools UX stabilization patch, separate from the V335-A1 Project Analyzer digest/raw command smoke.

## Live verification

Live verification completed after GitHub Pages propagation.

PowerShell live check:

- `root has v335_a2`: PASS
- `pwa has v335_a2`: PASS
- `app has v335_a2`: PASS
- `old short setter removed`: PASS
- `LIVE_V335_A2_OK`: PASS

Real-phone check:

- Public root URL was used for verification.
- The app routed into the latest PWA runtime.
- The study-tools settings toggle no longer flickered while scrolling.
- The previous `설정` / `설정 펼치기` label instability was not reproduced.

Final result:

- V335-A2: PASS
- Mobile study-tools settings label stability issue: CLOSED
