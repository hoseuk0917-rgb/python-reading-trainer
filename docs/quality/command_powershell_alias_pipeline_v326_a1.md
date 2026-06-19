# V326-A1 PowerShell alias pipeline patch

## Purpose

Patch the next V325-A1 priority gap: PowerShell pipeline aliases `?` and `%`.

## Scope

- Add explicit pipeline interpretation for `?` as the short alias of `Where-Object`.
- Add explicit pipeline interpretation for `%` as the short alias of `ForEach-Object`.
- Add explicit pipeline interpretation for `ForEach-Object` even when the left side is not `Get-ChildItem`.
- Keep the result as a safe pipeline summary when the line is only filtering/listing/iterating.
- Bump app/cache version to `20260619_v326_a1`.

## Validation

- `node --check src/pwa/command_explainer.js`
- `node --check src/pwa/app.js`
- `node --check tools/smoke_command_powershell_alias_pipeline_v326_a1.js`
- `node tools/smoke_command_powershell_alias_pipeline_v326_a1.js`
- `node tools/quality_gate_explainer_v324_a1.js`
- `python tools/validate_lessons.py`

## Expected smoke

- `Get-ChildItem -File | ? Name -like "*.js" | % FullName`
- `$items | ForEach-Object { $_.Name }`
- Both should produce one `PowerShell pipeline` step, `unknown=0`, `risk=safe`, and no `[object Object]`.

## Result

PASS: PowerShell alias pipeline smoke passed, current quality gate passed, and lesson validation remained OK.
