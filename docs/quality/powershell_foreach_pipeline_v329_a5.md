# V329-A5 PowerShell ForEach-Object pipeline priority

## Scope

V329-A5 fixes the next V329-A2 expanded audit finding after Python list comprehension expansion.

## Finding from V329-A2

- Sample: ps_foreach_object
- Status before patch: REVIEW
- Missing expected title:
  - 각 항목 반복 처리

## Root cause

A one-line PowerShell pipeline such as `Get-ChildItem . -File | ForEach-Object { $_.Name }` was matched by the generic pipeline rule first.
Because line rules return one step, the more specific `ForEach-Object` explanation was not reached.

## Changed behavior

- PowerShell lines containing both a pipeline and `ForEach-Object` are now recognized before generic pipeline handling.
- The line receives the beginner-facing title `각 항목 반복 처리`.

## Marker

- POWERSHELL_FOREACH_PIPELINE_PRIORITY_V329_A5

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_powershell_foreach_pipeline_v329_a5.js
- node tools/smoke_powershell_foreach_pipeline_v329_a5.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
