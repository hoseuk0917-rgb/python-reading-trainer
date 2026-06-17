# python-reading-trainer quality recovery report V306~V320

QUALITY_RECOVERY_DOCS_HANDOFF_V321_A1

## Current final state

- App version: `20260611_v321_a1`
- V320 base commit: `c22696f`
- V320 base tag: `quality-v320-low-explanation-final-reaudit-a1-20260611`
- Lesson files: `98`
- Side-card files: `50`
- Lesson cards: `1785`
- Side cards: `440`
- Validation: `VALIDATION OK`

## Why this work was done

The V306~V320 track was opened after the first visible card showed that long, inflated, or poorly targeted explanations could confuse beginners. The goal was not to add more cards, but to make existing answer explanations safer and more explicit after the learner answers.

## Timeline

| Version | Purpose | Result |
|---|---|---|
| V306 | Concept intro display and side-card duplicate removal | Completed |
| V307 | Explanation/answer/choice alignment audit | HIGH 0, MEDIUM 632, LOW 219 |
| V308 | reading_goal template cleanup | 544 cleaned, bad template 0 |
| V309~V316 | MEDIUM candidate review and patch batches | 632 candidates covered |
| V317 | MEDIUM final reaudit | PASS |
| V318 | LOW candidate reaudit and triage | 219 candidates classified |
| V319 | LOW REVIEW_AND_PATCH patch | 11 candidates patched |
| V320 | LOW final reaudit | PASS |

## V307 MEDIUM closure

- Original MEDIUM candidates: `632`
- Covered candidates: `632`
- Missing candidates: `0`
- Duplicate candidates: `0`
- Current JSON answer-expression failures: `0`
- Structural issues: `0`
- Final audit: `reports/explanation_medium_final_reaudit_v317.md`
- Final coverage TSV: `reports/explanation_medium_final_coverage_v317.tsv`

## V307 LOW closure

- Original LOW candidates: `219`
- V318 NO_ACTION: `206`
- V318 REVIEW_AND_PATCH: `11`
- V318 REVIEW_ONLY: `2`
- V319 patched rows: `11`
- V320 final failures: `0`
- V320 structural issues: `0`
- Final audit: `reports/explanation_low_final_reaudit_v320.md`
- Final TSV: `reports/explanation_low_final_reaudit_v320.tsv`

## Final interpretation

The V307 explanation alignment track is closed.

- HIGH: no structural issue was found.
- MEDIUM: all 632 candidates were patched or verified and then passed final reaudit.
- LOW: all 219 candidates were triaged; 11 were patched, 206 were already explicit, and 2 were intentionally kept for manual review only.
- No lesson/card count changed.
- The app still passes the repository lesson validator.

## Remaining quality candidates

The next independent quality track should not reopen V307 MEDIUM/LOW. Better next candidates are:

1. side-card repeated phrase cleanup
2. mobile/live GitHub Pages smoke verification
3. UX copy tightening after manual playthrough
4. optional review of the 2 LOW `KEPT_REVIEW_ONLY` items
