# Shared Learning Runtime Refactor V348

## Purpose

V348 removes the cross-cutting implementation debt documented after V347 without changing the learner contract. The refactor centralizes lesson-attempt side effects, dialog lifecycle behavior, and shared dialog presentation while keeping V339–V347 feature behavior and browser regressions authoritative.

## Runtime ownership after V348

### Lesson-attempt pipeline

`learning_runtime_v348.js` is the single production owner for lesson-attempt side effects triggered by answer choices and the explicit "again" action.

- Wrong answers schedule the existing V340 review state exactly once.
- V341 receives a lesson-attempt effect through its exported API instead of wrapping core answer handlers.
- V345 receives activity logging and focus-support reveal through exported APIs instead of installing a second answer listener.
- V340 retains only a boot-time fallback when V348 is unavailable.
- V347 is reduced to a compatibility facade and no longer installs an active click listener, observer, or dialog controller.

### Dialog lifecycle

V348 owns shared dialog lifecycle behavior for V340 review/syntax, V341 checkpoint/practice, V345 study-data dialogs, and the large diagram dialog.

- Initial focus is attempted immediately and reconciled across a bounded number of animation frames when rendering is still settling.
- Escape closes the currently active tracked dialog.
- Tab focus is trapped inside the active dialog.
- A review opened from V346 Progress returns to Progress on cancel and restores focus to the current semantic action after rerender.
- No fixed millisecond focus delay is used.

### Shared UI presentation

`study_ui_v348.css` is the shared owner for common dialog shell presentation.

- overlay positioning and backdrop
- dialog max-height and overflow
- dialog radius/background/shadow/box sizing
- shared keyboard-focus treatment
- narrow-screen dialog padding
- reduced-motion handling for the shared layer

V340, V341, and V345 retain only their feature-specific widths, padding, z-index values, state colors, and content layout.

## Compatibility policy

The historical V339–V347 modules remain as feature modules where they still own distinct product behavior. V348 removes redundant cross-cutting ownership rather than flattening unrelated feature logic into one monolith.

The V347 file remains only as a compatibility API surface for callers that still reference `LearningFlowHardeningV347`; it does not own production event listeners or observers after V348.

## Release gates

V348 is releasable only when all of the following pass on the integrated branch:

- V348 r1/r2/r3/r4 applicators are idempotent.
- Existing lesson validation passes.
- Existing V339 content quality gates pass.
- Existing V340–V346 static contract audits pass.
- V348 architecture audit passes, including centralized dialog CSS and absence of legacy duplicated dialog-shell rules.
- `git diff --check` passes.
- Existing V343–V346 real-Chrome desktop and narrow regressions pass.
- V347 full end-to-end learner journey passes on desktop and exact 390 px app viewport.
- The closure run starts from a committed integrated tree and every V348 applicator reports zero changes.
- The closure run finishes with `V348_ALREADY_CLEAN=True`.

## Debt disposition

The V347 deferred refactor debt is resolved as follows:

- **Review scheduling ownership split:** resolved by the V348 lesson-attempt pipeline, with V340 only as boot fallback.
- **Dialog behavior spread across V340/V341/V345/V347:** resolved by the V348 shared dialog controller.
- **V347 active compatibility patching:** resolved by reducing V347 to a compatibility facade with no production listeners/observers.
- **Repeated dialog CSS in older UI layers:** resolved for the common shell by centralizing overlay/card presentation in `study_ui_v348.css`; feature-specific styling remains local by design.

No content rewrite is part of V348. Existing V339 relevance and V346 terminology gates remain authoritative.
