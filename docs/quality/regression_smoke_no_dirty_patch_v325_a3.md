# V325-A3 regression smoke no-dirty patch

## Purpose

Patch `tools/smoke_explainer_regression_v323_a6.js` so the normal regression smoke run does not rewrite its tracked Markdown report.

## Problem

During V325-A2 validation, `tools/quality_gate_explainer_v324_a1.js` called the V323-A6 regression smoke. The quality gate itself no longer dirtied its own report after V324-A3, but the nested V323-A6 smoke still rewrote `docs/quality/explainer_regression_smoke_v323_a6.md`.

## Patch

- Default regression smoke Markdown output now goes to `.tmp/explainer_regression_smoke_v323_a6.md`.
- Updating the tracked report is opt-in through `--update-doc`.
- The console output remains compatible with the current quality gate, including `FAIL 0`.
- Make the legacy V323 smoke app-version parser accept later date-based versions.

## Validation

- `node --check tools/smoke_explainer_regression_v323_a6.js`
- `node tools/smoke_explainer_regression_v323_a6.js`
- confirm `PASS 4` and `FAIL 0`
- confirm `.tmp/explainer_regression_smoke_v323_a6.md` exists
- confirm `docs/quality/explainer_regression_smoke_v323_a6.md` is not dirty after a normal smoke run
- `node tools/quality_gate_explainer_v324_a1.js`
- confirm current quality gate `PASS 8` and `FAIL 0`
- confirm both tracked reports stay clean after the quality gate
- `python tools/validate_lessons.py`

## Result

PASS: normal regression smoke and nested quality gate runs no longer dirty tracked report Markdown files. The legacy V323 smoke now reports the current app version instead of unknown.
