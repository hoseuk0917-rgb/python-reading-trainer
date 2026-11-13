# Python Reading Trainer UI Lock R1.1

## Authority

- Reference image: `docs/design/python_reading_trainer_r1_1/reference/PRT_RESPONSIVE_UI_R1_1_REFERENCE.png`
- Reference SHA256: `2BCC8574A82F1C9BDC9916858DF4B0ABE6CAF4A6200CB397201144BDD68E6C0F`
- Base commit: `0f4f9546ab598788fe306fc454f75cdb65ffee0a`
- Implementation commit: `c483af38ac07b4caabdd31755d2d33f02bd6d73b`
- Branch: `feat/prt-product-ui-r1-1`
- Frozen authority unchanged: `docs/LESSON_EXPLANATION_CONTRACT_V1.md`, lesson content, mappings, sequence, source/provenance, review/checkpoint/diagnostic/practice eligibility, Developer staged storage, GitHub OAuth, and public Admin policy.

## Modified files

- `docs/design/python_reading_trainer_r1_1/PRT_PRODUCT_DESIGN_SYSTEM_R1_1.md`
- `docs/design/python_reading_trainer_r1_1/PRT_SCREEN_CONTRACT_R1_1.md`
- `docs/design/python_reading_trainer_r1_1/reference/PRT_RESPONSIVE_UI_R1_1_REFERENCE.png` (added as the supplied immutable authority; not transformed)
- `src/pwa/consumer_ux_v349_compat_r2.js`
- `src/pwa/index.html`
- `src/pwa/learning_home_v343.js`
- `src/pwa/product_ui_r1_1.css`
- `src/pwa/product_ui_r1_1.js`
- `src/pwa/sw_v400_1.js`
- `tools/run_product_ui_r1_1_browser_lock.js`

This lock document is intentionally recorded after the implementation commit so it can cite that immutable commit SHA.

## Locked design tokens

| Role | Value |
| --- | --- |
| Primary Navy | `#18324A` |
| Trainer Blue | `#2563EB` |
| Action / Current State Cranberry | `#A63A4A` |
| Success | `#16A34A` |
| Warning / focus | `#F59E0B` |
| Surface | `#F8FAFC` |
| Page Background | `#EEF2F6` |
| Border | `#E2E8F0` |
| Primary Text | `#0F2437` |
| Muted | `#64748B` |

- Typography: local `Pretendard`, `Noto Sans KR`, system UI fallbacks; no network font.
- Spacing: `4 / 8 / 12 / 16 / 24 / 32`.
- Radius: controls 8-12px, cards 12px, major surfaces 16px.
- Separation: border first, soft shadow second; no glow, neon, or glass treatment.
- Icons: generic book/code geometry and AYVNIX text wordmark; no official Python snake mark.

## Responsive viewport results

Real browser: Google Chrome headless through CDP. Captures were reviewed against the reference image.

| Viewport | Overflow | CTA / nav overlap | Dialog bounds | Reflow | Result |
| --- | ---: | --- | --- | --- | --- |
| 1440x900 | 0px | none | in bounds | centered two-column Home | PASS |
| 1366x854 | 0px | none | in bounds | compact two-column Home | PASS |
| 1024x1365 | 0px | none | in bounds | one-column tablet portrait | PASS |
| 390x844 | 0px | none | in bounds | one column plus fixed V349 bottom nav | PASS |

Capture locations are runtime artifacts under `.tmp/prt-r11-browser-lock/` and are not committed.

## Functional regression results

`node tools/run_product_ui_r1_1_browser_lock.js` returned `RESULT=PASS_PRT_PRODUCT_UI_R1_1_BROWSER_LOCK`.

Verified in the real browser:

- public root redirect and direct PWA
- Learn, answer, previous, next, and not-sure actions
- side/support disclosure, ARIA expanded state, mobile Escape close, and focus return
- visible keyboard focus and semantic button elements
- Progress, Practice, Diagnostic, Outline, Notes, Code, Command, and Project
- Developer access contract
- local Admin loader on localhost
- absence of remote public Admin artifacts
- R1.1 live-data status and absence of reference-example learner values

The support compatibility layer received one narrow correction: when V345 had already revealed support after an answer, the V349 capture listener no longer pre-adds the manual-open class before the native button handler. This prevents a double toggle without changing IDs, handlers, storage, or learning logic.

## Command validation results

- CI V400 JavaScript targets plus all modified/new JavaScript: `node --check` PASS.
- `python tools/build_runtime_lesson_bundle_v400_5.py`: PASS; KO/EN 1,785 cards and 526 support items; generated lesson/data diff 0.
- `python tools/validate_lessons.py`: PASS (`VALIDATION OK`).
- `python tools/validate_bilingual_lessons_v400_7.py`: PASS.
- `python tools/validate_diagnostic_v400_7.py`: PASS.
- `node tools/audit_v23_worked_example_boundary_v400.js`: PASS.
- `node tools/audit_effective_same_syntax_v400.js`: completed with exit 0; legacy panel invariant PASS; existing teaching-focus mismatch report remains 184 KO and 184 EN.
- `node tools/audit_v400_release_polish.js`: PASS.
- `node tools/audit_applied_practice_quality_v400.js`: PASS.
- `node tools/run_consumer_ux_v349_browser_smoke.js`: `SKIPPED_NOT_CONFIGURED` (`CHROME_FOUND=False`; script recognizes Linux Chrome paths only).
- `node tools/run_learning_home_v343_browser_smoke.js`: `SKIPPED_NOT_CONFIGURED` for the same reason.
- `node tools/run_study_quality_v346_browser_smoke.js`: `SKIPPED_NOT_CONFIGURED` for the same reason.
- `node tools/run_learning_flow_v350_browser_smoke.js`: `SKIPPED_NOT_CONFIGURED` for the same reason.
- `node tools/run_contextual_practice_v351_browser_smoke.js`: `SKIPPED_NOT_CONFIGURED` for the same reason.
- `tools/run_diagnostic_v400_2_browser_smoke.ps1`: BLOCKED after actual Chrome launch because the legacy script expects more than the current compact baseline's 5 questions (`STAGE_COUNT_INVALID:baseline:5`).
- `tools/run_diagnostic_remediation_v400_2_browser_smoke.ps1`: PASS for KO and EN, full report, tailored 10-card remediation, focus axis, checkpoint prompt, and retest prompt.
- `git diff --check`: PASS before the implementation commit.

## Unresolved warnings

- Five legacy Node browser-smoke wrappers cannot discover the installed Windows Chrome and are recorded as `SKIPPED_NOT_CONFIGURED`, not PASS. Equivalent R1.1 behaviors were exercised by the committed cross-platform CDP browser lock.
- The older diagnostic browser smoke has a stale question-count expectation for the current compact baseline; the current remediation browser E2E and diagnostic data validator pass.
- The effective same-syntax audit reports 184 KO and 184 EN teaching-focus mismatch candidates while its sealed legacy-panel invariant passes. These are frozen lesson-content findings and were not changed by this presentation task.

## Final state

- Implementation: COMPLETE
- Functional lock: PASS through the R1.1 real-browser lock, with the explicit legacy-wrapper warnings above
- Responsive lock: PASS at all four required viewports
- Visual lock: PASS
- Reference image: unchanged from the supplied SHA256
- Lesson/runtime content: unchanged after bundle rebuild
- Public Admin: hidden
- Local Admin: localhost-only policy preserved
