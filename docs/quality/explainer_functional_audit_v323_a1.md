# V323-A1 explainer functional audit

## Purpose

This audit switches from wording-only patches to functional quality checks across command_explainer, code_explainer, project_analyzer, and UI schema surfaces.

## Version

- app version observed: 20260618_v322_a4b4a

## Summary

- total checks: 14
- PASS: 11
- WARN: 3
- FAIL: 0

## Area counts

| area | count |
|---|---:|
| command_runtime | 6 |
| code_static | 3 |
| project_static | 2 |
| ui_static | 3 |

## Findings

| area | id | status | evidence | detail |
|---|---|---|---|---|
| command_runtime | engine_export | PASS | CommandExplainer available | analyzePowerShellV277 is callable |
| command_runtime | powershell_pipeline_list | PASS | PowerShell pipeline / safe | version=20260618_v322_a4b4a; steps=1; missing=; objectLeak=false |
| command_runtime | get_child_item_file | PASS | Get-ChildItem / safe | version=20260618_v322_a4b4a; steps=1; missing=; objectLeak=false |
| command_runtime | invoke_web_request_outfile | PASS | Invoke-WebRequest / caution | version=20260618_v322_a4b4a; steps=1; missing=; objectLeak=false |
| command_runtime | wrangler_deploy | PASS | npx wrangler deploy / caution | version=20260618_v322_a4b4a; steps=1; missing=; objectLeak=false |
| command_runtime | git_clean_fd | PASS | git clean / danger | version=20260618_v322_a4b4a; steps=1; missing=; objectLeak=false |
| code_static | python_object_lambda_rules | PASS | all required tokens present | required=__init__, self., lambda, sort, object |
| code_static | python_file_api_rules | WARN | missing: with open | required=with open, requests, json, csv, Path |
| code_static | unsupported_and_confidence_paths | PASS | all required tokens present | required=unsupported, confidence, risk, steps |
| project_static | pwa_manifest_service_worker | WARN | missing: manifest, service worker | required=manifest, service worker, PWA |
| project_static | entrypoint_detection | PASS | all required tokens present | required=index.html, app.js, package.json |
| ui_static | renderer_schema_terms | PASS | all required tokens present | required=steps, warnings, summary, nextChecks |
| ui_static | sample_load_and_language_controls | PASS | all required tokens present | required=load, sample, codeLangSelect, codeInput |
| ui_static | object_stringification_risk_scan | WARN | 2 file(s) with candidate risky assignments | [{"name":"code_explainer","lines":[{"line":"      body.textContent = card.body \|\| card.summary \|\| card.description \|\| \"\";","n":527},{"line":"      item.textContent = \"line \" + step.lineNo + \" · \" + riskLabel(step.risk) + \" · \" + step.title + \" · \" + step.code;","n":682},{"line":"      diagram.innerHTML = result.svg;","n":4732},{"line":"      summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' +","n":4814}]},{"name":"project_analyzer","lines":[{"line":"      diagram.innerHTML = result.svg;","n":758}]}] |

## Interpretation

No runtime-blocking failure was found, but WARN items should become the next patch candidates.

## Recommended next actions

1. Do not add more wording-only command rules unless a functional audit sample requires it.
2. Turn WARN rows into narrow V323 patches only when they affect real UI/runtime behavior.
3. Add a browser-level smoke test for sample load -> analyze -> render when the repo is ready for a DOM runner.
