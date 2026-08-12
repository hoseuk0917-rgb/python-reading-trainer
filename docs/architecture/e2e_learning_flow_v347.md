# End-to-End Learning Flow V347

## Goal

V347 validates the Python trainer as one continuous learner journey instead of treating V340–V346 as isolated features.

The release question is: **can a learner start fresh, make a mistake, review it, continue the fixed sequence, reach practice, preserve the state, and resume on desktop/mobile without hidden lifecycle breaks?**

## Browser journey

The real-Chrome case covers both 1200 px and 390 px widths.

1. Fresh app state opens the sequential learning home at card 1.
2. The learner opens card 1 and deliberately answers incorrectly.
3. Focus mode reveals support after the answer.
4. V340 creates an immediately due variant review.
5. V346 changes the next action to review-first.
6. The review modal opens, receives usable dialog focus, and closes with Escape.
7. The review is reopened and answered correctly using the deterministic V340 variant contract.
8. V346 returns to the next unseen sequential card.
9. A synthetic but contract-valid 30-card boundary unlocks checkpoint 1.
10. V346 routes to Practice, the checkpoint opens, dialog focus/escape work, and a correct answer records completion.
11. A topic practice module opens independently of checkpoint completion.
12. V345 exports the complete app state, the test mutates app state, then restores the backup while preserving a foreign storage sentinel.
13. V341/V346 rerender from restored state and the restored next action remains correct.
14. English reload preserves state and renders the same learning decision in English.
15. No horizontal overflow or duplicate high-level surfaces are allowed.

## Debt policy

V347 does not rewrite working CSS or content just because older layers contain implementation debt. Findings are ranked as:

- **P0**: breaks the learner journey, loses/corrupts state, exposes future knowledge, or blocks a required action.
- **P1**: accessibility/interaction defects on primary learning actions (focus, Escape, touch target, responsive overflow).
- **P2**: maintainability/visual consolidation debt that does not currently break learning.
- **P3**: cosmetic or low-frequency cleanup.

Only P0/P1 defects found by the journey are release-blocking in V347. P2/P3 items are documented for later consolidation rather than mixed into a risky rewrite.

## Release gates

- Existing V339–V346 static and real-browser regressions stay green.
- V347 real Chrome passes at 1200 px and 390 px.
- Backup/restore preserves all app-state decisions and foreign keys.
- Review/checkpoint/practice dialogs are keyboard reachable and Escape-closeable.
- KO/EN next-action decisions remain equivalent.
- Final closure run is zero-change before main is fast-forwarded.
