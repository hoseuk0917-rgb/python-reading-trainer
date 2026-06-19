# V326-A4 function flow advisor patch

## Purpose

Close the remaining high-impact broad-audit gap around function-flow explanation and dynamic-call next-check advice.

## Scope

- Add functionFlowV326A4 to CodeExplainerRules.analyze for Python function-level flow summaries.
- Add ordered beginner-readable flow steps: input, value preparation, file/JSON work, loop, condition, collect/transform, dynamic call, return.
- Add nextCheckAdvisorV326A4 for dynamic handler/registry/callback patterns.
- Keep the advisor read-only: Select-String, git status --short, and file listing checks.
- Bump app/cache version to 20260619_v326_a4.

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check src/pwa/app.js
- node --check tools/smoke_function_flow_advisor_v326_a4.js
- node tools/smoke_function_flow_advisor_v326_a4.js
- node tools/audit_broad_interpretation_surface_v326_a2.js
- node tools/quality_gate_explainer_v324_a1.js
- python tools/validate_lessons.py

## Result

PASS: function-flow advisor smoke passed, broad audit reran, current quality gate passed, and lesson validation remained OK.
