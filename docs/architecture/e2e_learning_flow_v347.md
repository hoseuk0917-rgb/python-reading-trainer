# End-to-End Learning Flow V347

## Goal

V347 validates the Python trainer as one continuous learner journey instead of treating V340–V346 as isolated features.

The release question is: **can a learner start fresh, make a mistake, review it, continue the fixed sequence, reach practice, preserve the state, and resume on desktop/mobile without hidden lifecycle breaks?**

## Browser journey

The real-Chrome case covers both 1200 px and an exact 390 px iframe browsing context.

1. Fresh app state opens the sequential learning home at card 1.
2. The learner opens card 1 and deliberately answers incorrectly.
3. Focus mode reveals support after the answer.
4. V340 creates an immediately due variant review.
5. V346 changes the next action to review-first.
6. The review modal opens, receives usable dialog focus, closes with Escape, returns to Progress, and restores focus to the current semantic review action.
7. The review is reopened and answered correctly using the deterministic V340 variant contract.
8. V346 returns to the next unseen sequential card.
9. A synthetic but contract-valid 30-card boundary unlocks checkpoint 1.
10. V346 routes to Practice, the checkpoint opens, dialog focus/escape work, and a correct answer records completion.
11. A topic practice module opens independently of checkpoint completion.
12. V345 exports the complete app state, the test mutates app state, then restores the backup while preserving a foreign storage sentinel.
13. V341/V346 rerender from restored state and the restored next action remains correct.
14. English reload preserves state and renders the same learning decision in English.
15. No horizontal overflow or duplicate high-level surfaces are allowed.

## Findings and debt disposition

### P0 fixed in V347

- The integrated answer-click path could record an incorrect answer without reliably materializing the V340 review row. V347 adds a guarded fallback that calls the existing V340 scheduler only when the canonical path has not already done so, preventing double lapse accounting.

### P1 fixed in V347

- V340 review/syntax and V341 mission dialogs now receive usable keyboard focus when opened.
- V340 review/syntax dialogs are Escape-closeable in the integrated flow.
- A review launched from V346 Progress no longer strands the learner on the Learn view when cancelled; it returns to Progress and reconnects focus to the current semantic action across V346 rerenders.
- Checkpoint/practice dialog focus and Escape behavior are covered by the E2E gate.
- The narrow E2E case now verifies the app inside an exact 390 px iframe, rather than relying on headless Chrome's outer-window minimum width.

### P2 deferred

- Review scheduling ownership is still distributed across V340's canonical wrapper and the V347 integration safeguard. The safeguard is intentionally minimal and audited, but a later architecture cleanup can consolidate answer-attempt ownership into one event pipeline.
- Dialog behavior spans V340, V341, V345 and V347. A later consolidation can move focus, Escape, focus-return and modal lifecycle into one shared dialog controller after equivalent regression coverage exists.
- V339–V347 remain layered compatibility patches. Removing old layers is a separate migration project and should not be mixed with learning-flow fixes.

### P3 deferred

- Older visual/CSS selectors can still be consolidated beyond the V346 shared component layer. No cosmetic rewrite is release-blocking while the current responsive and accessibility gates remain green.

No new content-quality debt was found in this E2E pass; V339 content relevance and V346 future-terminology gates remain authoritative.

## Release gates

- Existing V339–V346 static and real-browser regressions stay green.
- V347 real Chrome passes at desktop and exact 390 px app width.
- Backup/restore preserves all app-state decisions and foreign keys.
- Review/checkpoint/practice dialogs are keyboard reachable and Escape-closeable.
- KO/EN next-action decisions remain equivalent.
- Temporary focus diagnostics are absent from release harnesses.
- Final closure run is zero-change before main is fast-forwarded.
