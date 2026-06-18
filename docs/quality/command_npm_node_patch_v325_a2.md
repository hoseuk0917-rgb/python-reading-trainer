# V325-A2 command npm/node patch

## Purpose

Patch the command explainer for the A-priority V325-A1 gap: `command_npm_node_scripts`.

## Scope

- Add `npm install` / `npm i` interpretation.
- Add `npm run ...` interpretation.
- Add `node ...` JavaScript execution interpretation.
- Apply the same coverage to PowerShell and Bash/Shell analyzers.
- Bump PWA cache/version strings to `20260619_v325_a2`.
- Make the V324 quality gate version parser accept later date-based app versions.

## Validation

- `node --check src/pwa/command_explainer.js`
- `node --check src/pwa/app.js`
- `node --check tools/quality_gate_explainer_v324_a1.js`
- `node --check tools/smoke_command_npm_node_v325_a2.js`
- `node tools/smoke_command_npm_node_v325_a2.js`
- `node tools/quality_gate_explainer_v324_a1.js`
- `python tools/validate_lessons.py`

## Expected smoke

- PowerShell sample: `npm install`, `npm run build`, `node tools\audit.js`
- Bash sample: `npm install`, `npm run test`, `node tools/audit.js`
- Unknown command count must remain zero.
- Caution count should be 3 for each sample.
- Command explainer version must be `20260619_v325_a2`.

## Result

PASS: npm/node command interpretation smoke passed, current quality gate passed, and lesson validation remained OK.
