# V325-A1 interpretation gap priority audit

## Purpose

Starts the next work unit after V324 by ranking remaining code/command/project analyzer interpretation gaps without changing runtime behavior.

## Version

- app version observed: 20260618_v323_a4

## Summary

- total checks: 11
- status COVERED: 7
- status PARTIAL: 3
- status GAP: 1
- priority OK: 7
- priority B: 2
- priority A: 1
- priority C: 1

## Checks

| area | check | status | priority | evidence | next |
|---|---|---|---|---|---|
| code_explainer | python_enumerate_loop | COVERED | OK | enumerate, index | Add a runtime sample for enumerate(items) and for i, x in enumerate(items). |
| code_explainer | python_logging_basic | COVERED | OK | logging, logger | Separate rules for import logging, logging.info(...), and logger.warning(...). |
| code_explainer | python_requests_http | COVERED | OK | requests | Add requests.get(url), response.status_code, and response.json() sample coverage. |
| code_explainer | python_file_with_open | COVERED | OK | with open, open( | Add a with open(..., encoding='utf-8') runtime sample in a later smoke. |
| command_explainer | powershell_foreach_where_alias | PARTIAL | B | Where-Object, %, ? | Analyze Get-ChildItem \| ? Name -like *.js \| % FullName as a narrow sample. |
| command_explainer | command_npm_node_scripts | GAP | A | (none) | Add npm install, npm run build, and node tools/script.js interpretation. |
| command_explainer | command_wrangler_deploy | COVERED | OK | wrangler deploy, Cloudflare, WRANGLER | Keep current support; later inspect wrangler dev and dry-run-like options. |
| command_explainer | command_git_safety_family | PARTIAL | C | git clean, git reset, danger | Add git reset --hard, git restore ., and git rm -r samples one cluster at a time. |
| project_analyzer | project_readme_package_config_semantics | PARTIAL | B | package.json, config | Add a synthetic report with README, package.json, requirements/config role explanation. |
| project_analyzer | project_pwa_manifest_service_worker | COVERED | OK | manifest.webmanifest, sw.js, service-worker, collectKnownProjectFilesV323A4 | Preserve current coverage through A6 smoke and live/no-dirty gates. |
| quality_gate | quality_gate_no_dirty_default | COVERED | OK | QUALITY_GATE_NO_DIRTY_DEFAULT_V324_A3, --update-doc, .tmp | Preserve current behavior; revisit only if live gate dirties tracked docs again. |

## Top next candidates

1. **A - command_explainer - command_npm_node_scripts** - Add npm install, npm run build, and node tools/script.js interpretation.
2. **B - command_explainer - powershell_foreach_where_alias** - Analyze Get-ChildItem | ? Name -like *.js | % FullName as a narrow sample.
3. **B - project_analyzer - project_readme_package_config_semantics** - Add a synthetic report with README, package.json, requirements/config role explanation.

## Details

### python_enumerate_loop

- area: code_explainer
- status: COVERED
- priority: OK
- required hits: 1/1
- evidence: enumerate, index
- rationale: enumerate is a common beginner loop pattern for reading index and value together.
- recommended next: Add a runtime sample for enumerate(items) and for i, x in enumerate(items).

### python_logging_basic

- area: code_explainer
- status: COVERED
- priority: OK
- required hits: 1/1
- evidence: logging, logger
- rationale: logging.info/debug/warning appears frequently in real project code and needs beginner-friendly explanation.
- recommended next: Separate rules for import logging, logging.info(...), and logger.warning(...).

### python_requests_http

- area: code_explainer
- status: COVERED
- priority: OK
- required hits: 1/1
- evidence: requests
- rationale: requests.get/post is common in API examples and should explain network dependency and failure paths.
- recommended next: Add requests.get(url), response.status_code, and response.json() sample coverage.

### python_file_with_open

- area: code_explainer
- status: COVERED
- priority: OK
- required hits: 1/1
- evidence: with open, open(
- rationale: File read/write patterns had previous support signals but are not yet anchored in the consolidated smoke.
- recommended next: Add a with open(..., encoding='utf-8') runtime sample in a later smoke.

### powershell_foreach_where_alias

- area: command_explainer
- status: PARTIAL
- priority: B
- required hits: 3/4
- evidence: Where-Object, %, ?
- rationale: PowerShell aliases % and ? are common in real logs but confusing for beginners.
- recommended next: Analyze Get-ChildItem | ? Name -like *.js | % FullName as a narrow sample.

### command_npm_node_scripts

- area: command_explainer
- status: GAP
- priority: A
- required hits: 0/2
- evidence: (none)
- rationale: npm install/run and node script execution are core commands in JS/PWA projects.
- recommended next: Add npm install, npm run build, and node tools/script.js interpretation.

### command_wrangler_deploy

- area: command_explainer
- status: COVERED
- priority: OK
- required hits: 1/1
- evidence: wrangler deploy, Cloudflare, WRANGLER
- rationale: Wrangler deploy was improved in V322 and should be tracked as a preserved command pattern.
- recommended next: Keep current support; later inspect wrangler dev and dry-run-like options.

### command_git_safety_family

- area: command_explainer
- status: PARTIAL
- priority: C
- required hits: 2/3
- evidence: git clean, git reset, danger
- rationale: git clean is covered; reset/restore/rm should be audited as the same danger family.
- recommended next: Add git reset --hard, git restore ., and git rm -r samples one cluster at a time.

### project_readme_package_config_semantics

- area: project_analyzer
- status: PARTIAL
- priority: B
- required hits: 2/3
- evidence: package.json, config
- rationale: Project analysis should explain README/package/config roles in human-readable terms.
- recommended next: Add a synthetic report with README, package.json, requirements/config role explanation.

### project_pwa_manifest_service_worker

- area: project_analyzer
- status: COVERED
- priority: OK
- required hits: 3/3
- evidence: manifest.webmanifest, sw.js, service-worker, collectKnownProjectFilesV323A4
- rationale: V323-A4 fixed PWA manifest/service-worker link coverage and should remain preserved.
- recommended next: Preserve current coverage through A6 smoke and live/no-dirty gates.

### quality_gate_no_dirty_default

- area: quality_gate
- status: COVERED
- priority: OK
- required hits: 3/3
- evidence: QUALITY_GATE_NO_DIRTY_DEFAULT_V324_A3, --update-doc, .tmp
- rationale: V324-A3 no-dirty behavior should remain visible in source.
- recommended next: Preserve current behavior; revisit only if live gate dirties tracked docs again.

## Decision

Use this audit to choose the next narrow V325 patch. Do not patch all candidates at once; pick one A-priority cluster, validate it with a runtime sample, then commit/tag/push.
