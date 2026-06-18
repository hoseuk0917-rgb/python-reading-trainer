# V324-A3 quality gate no-dirty patch

## Purpose

Patch `tools/quality_gate_explainer_v324_a1.js` so the default quality-gate run does not rewrite the tracked Markdown report every time it runs.

## Problem

V324-A2 live quality gate executed the local V324-A1 quality gate. The local gate passed, but it rewrote `docs/quality/explainer_quality_gate_v324_a1.md` with new timing values, making the repository dirty even though no meaningful source change happened.

## Patch

- Default run writes the Markdown report to `.tmp/explainer_quality_gate_v324_a1.md`.
- Tracked report update is now opt-in with `--update-doc`.
- JSON and TSV outputs remain under `.tmp`.
- Console output remains unchanged enough for downstream gates that look for `FAIL 0`.

## Validation plan

- `node --check tools/quality_gate_explainer_v324_a1.js`
- `node tools/quality_gate_explainer_v324_a1.js`
- confirm `PASS 8` and `FAIL 0`
- confirm `.tmp/explainer_quality_gate_v324_a1.md` exists
- confirm `docs/quality/explainer_quality_gate_v324_a1.md` has no git diff after a normal gate run
- `python tools/validate_lessons.py`

## Result

PASS: normal quality gate mode no longer dirties the tracked V324-A1 Markdown report.
