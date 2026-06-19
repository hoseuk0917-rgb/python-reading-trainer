# V327-A1 real-world explainer UX smoke

## Purpose

After V326 was live-verified, this audit checks whether the newly improved explainer surface behaves well on realistic user snippets rather than only narrow unit fixtures.

## Scope

The smoke covers:

- PowerShell command explanation:
  - `git reset --hard`
  - `git restore`
  - `pip install -r requirements.txt`
  - `Select-String`
  - `uvicorn app:app --reload`
- Bash command explanation:
  - `find`
- Python code explanation:
  - filter/collector function
  - dynamic handler dispatch
  - file/JSON loader
  - simple value-returning function

## UX checks

Each sample checks for practical beginner-facing behavior:

- Known command/function pattern is recognized.
- Risk level is present for commands.
- Existing command summary counters are present (`unknown`, `safe`, `caution`, `danger`).
- Safe next-check commands are suggested where useful.
- `advisorMode`, `pasteBackHint`, `functionFlowV326A4`, and `nextCheckAdvisorV326A4` surfaces are available.
- No `[object Object]` leakage appears in serialized results.

## Note

The first A1 smoke was too strict because it expected a non-existent command summary field named `known`. The actual command explainer summary uses risk counters such as `safe`, `caution`, `danger`, and `unknown`. A1B keeps the same real-world samples and checks the actual result shape.

## Validation

- `node --check tools/smoke_real_world_explainer_ux_v327_a1.js`
- `node tools/smoke_real_world_explainer_ux_v327_a1.js`
- `node tools/quality_gate_explainer_v324_a1.js`
- `python tools/validate_lessons.py`

## Result

PASS: real-world explainer UX smoke passed after aligning the smoke with the actual command summary shape, current quality gate passed, and lesson validation remained OK.