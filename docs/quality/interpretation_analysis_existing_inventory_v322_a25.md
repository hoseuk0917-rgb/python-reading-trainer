# V322-A2.5 existing interpretation inventory audit

## Purpose

A2 was a broad keyword-based coverage audit. This A2.5 audit checks what is already present in the current code before choosing patches.
The goal is to separate true gaps from already-supported, partial, or sample-test-needed patterns.

## Scope

- src/pwa/code_explainer.js
- src/pwa/code_explainer_rules.js
- src/pwa/command_explainer.js
- src/pwa/project_analyzer.js

## Summary

- total inventory checks: 28
- likely_supported_or_partial: 22
- needs_sample_test: 4
- absent: 2

## By area

- code_explainer: 16
- command_explainer: 7
- project_analyzer: 5

## Inventory table

| status | area | group | pattern | evidence_count | files | judgement |
|---|---|---|---|---:|---|---|
| absent | code_explainer | python | __init__ | 0 |  | No direct keyword evidence in target files. Treat as missing until sample-run proves otherwise. |
| absent | project_analyzer | pwa | manifest/service worker | 0 |  | No direct keyword evidence in target files. Treat as missing until sample-run proves otherwise. |
| needs_sample_test | code_explainer | python | lambda | 2 | src/pwa/project_analyzer.js | Only sparse evidence exists. Run a sample through the UI/parser before deciding whether to patch. |
| needs_sample_test | code_explainer | python | self | 2 | src/pwa/code_explainer_rules.js | Only sparse evidence exists. Run a sample through the UI/parser before deciding whether to patch. |
| needs_sample_test | code_explainer | python | with open | 2 | src/pwa/code_explainer.js | Only sparse evidence exists. Run a sample through the UI/parser before deciding whether to patch. |
| needs_sample_test | code_explainer | python-lib | requests | 2 | src/pwa/code_explainer_rules.js | Only sparse evidence exists. Run a sample through the UI/parser before deciding whether to patch. |
| likely_supported_or_partial | code_explainer | js | DOM events | 48 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | js | fetch/response/request | 62 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | js | import/export | 18 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python | async/await | 135 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python | enumerate | 5 | src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python | try/except/finally | 141 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python-lib | argparse | 9 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python-lib | json/csv/path | 247 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python-lib | logging | 3 | src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python-lib | os.environ | 22 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | code_explainer | python-lib | pandas | 29 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | dev | python/pip/npm/pytest/wrangler/docker | 28 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | git | reset/clean/rebase/stash/tag | 17 | src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | powershell | ConvertFrom-Json | 4 | src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | powershell | ForEach/Where | 522 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | powershell | Remove-Item | 27 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | powershell | pipeline | 1128 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | command_explainer | powershell | web request | 11 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | project_analyzer | config | package/wrangler/pyproject/requirements | 24 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | project_analyzer | entrypoint | html/js entry | 159 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | project_analyzer | entrypoint | python entry | 3 | src/pwa/code_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |
| likely_supported_or_partial | project_analyzer | guidance | first/risk/validate/version | 640 | src/pwa/code_explainer.js, src/pwa/code_explainer_rules.js, src/pwa/command_explainer.js, src/pwa/project_analyzer.js | Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality. |

## Decision rule for next patch

1. Do not patch from A2 keyword misses alone.
2. First inspect absent and needs_sample_test rows with exact source blocks and sample outputs.
3. Patch only if the current UI output is generic, wrong, or unsupported for a realistic beginner sample.
4. Prefer one small patch batch per engine: code_explainer, command_explainer, or project_analyzer.
5. Keep side-card JSON and lesson JSON out of scope.

## Generated files

- TSV: .tmp/interpretation_analysis_existing_inventory_v322_a25.tsv
- MD: docs/quality/interpretation_analysis_existing_inventory_v322_a25.md
