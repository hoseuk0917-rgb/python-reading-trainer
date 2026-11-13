# Python Reading Trainer Product UI R1.3 Closeout

## Release identity

- Base SHA: `7df10ae99ee6d16e19b2bdfd4e7d0b3e1f8a3a9f`
- Implementation SHA: `e039c23791892e9674f6459d38f16a72e509007a`
- Branch: `feat/prt-product-ui-r1-3-closeout`
- Scope: mobile Learn first-viewport compaction and conditional mobile scroll cue only

## R1.2 preservation

R1.2 remains the visual authority. The 60 px desktop Navy shell, typography hierarchy, Home composition and reflow, color semantics, card geometry, Developer/Admin system, navigation destinations, data, and learning logic were not changed. R1.3 is isolated in additive presentation files, with only asset loading and service-worker cache registration added to the existing shell.

## Learn first viewport

Actual installed Chrome was driven through Home → primary learning CTA → first Learn card before an answer was selected.

- 390×844: PASS (`FIRST_LEARN_VIEWPORT_COMPLETE=true`)
- Main panel: top 68 px, bottom 581 px, width 366 px
- Code: top 189 px, bottom 263 px
- Question: top 282 px, bottom 303 px
- Choices: top 311 px, bottom 505 px
- Actions: top 524 px, bottom 568 px
- Fixed bottom navigation: top 782 px
- Action-to-navigation clearance: 214 px
- Horizontal overflow: 0 px
- Bottom-navigation overlap: 0 px

The learning interaction is visually ordered before the existing diagnostic, study-tool, and support sections on compact viewports. All sections and controls remain present. Mobile margins, nested padding, code spacing, question spacing, choice gaps, and action gaps were reduced without clipping text or reducing interactive controls below 40–44 px.

The longest runtime code card selected by the harness contained 25 lines. Its code block exposes 166 px immediately and scrolls internally over 510 px of content. The card remains a long page by design; no content is clipped or given a fixed fake height.

## Scroll cue behavior

- Visibility: only at compact widths when the active view has more than 80 px of meaningful content below the usable viewport.
- Position: fixed, horizontally centered, 12–13 px above the measured mobile navigation.
- Visual: 34 px quiet Navy/Blue chevron on a translucent light surface; no Cranberry CTA treatment.
- Motion: 1.9 s subtle opacity pulse with 4 px vertical travel.
- First-scroll dismissal: a 44 px threshold dismisses the cue for that view for the in-memory page session.
- Return to top: the dismissed cue does not reappear for the same view.
- Per-view state: a different long view can show its own cue.
- Click: dismisses immediately and scrolls about 48% of the usable viewport smoothly.
- Suppression: visible dialogs, menus, Developer Workbench, and keyboard-focus interaction suppress the cue.
- Reduced motion: `animation-name: none` under `prefers-reduced-motion: reduce`.
- Navigation safety: navigation buttons retained their hit targets; measured cue-to-navigation gap was 12 px.

## Viewport validation

| Viewport | Learn result | Actions bottom | Navigation top | Horizontal overflow |
| --- | --- | ---: | ---: | ---: |
| 390×844 | Complete | 568 px | 782 px | 0 px |
| 430×932 | Complete | 570 px | 870 px | 0 px |
| 768×1024 | Complete | 650 px | 962 px | 0 px |
| 1440×900 | R1.2 desktop regression preserved | Natural page flow | Sticky shell | 0 px |

Required screenshots were created for Home, the first Learn card, a long Learn card with cue, Practice before and after scrolling, 430×932, 768×1024, and 1440×900.

## Regression evidence

- R1.1 browser lock: `PASS_PRT_PRODUCT_UI_R1_1_BROWSER_LOCK`
- R1.2 visual tuning lock: `PASS_MEASURED_VISUAL_TUNING`
- R1.3 closeout harness: `PASS_PRT_PRODUCT_UI_R1_3_CLOSEOUT`
- Interaction clarity V353 audit: PASS (28/28)
- Learning flow V350 audit: PASS (15/15)
- V400 release polish audit: PASS
- Modified/new JavaScript syntax checks: PASS
- Staged diff whitespace check: PASS

The R1.1 browser lock revalidated answer, previous, next, not sure, support, Escape/focus return, Progress, Practice, Diagnostic, Outline, Notes, Code, Command, Project, Developer, local Admin, and remote public Admin hiding.

## Remaining known issues

None blocking. Long code and content-heavy cards intentionally require internal code scrolling and/or page scrolling under the locked long-content policy.

## Final UI status

All R1.3 acceptance criteria passed with the R1.2 visual contract and existing functional/data contracts preserved.

`PRT_PRODUCT_UI_CLOSED`
