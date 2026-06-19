# V326-A2 broad interpretation surface audit

## Purpose

Move from narrow rule-by-rule work to a broad practical audit for vibe-coding interpretation.

Target capability: explain code/commands/project files when obvious, and when not obvious recommend safe read-only commands whose output can be pasted back for easier interpretation.

## Summary

- command explainer version: `20260619_v326_a3`
- total checks: 22
- status counts: `{"OK":19,"GAP":3}`
- priority counts: `{"A":16,"B":6}`
- high-impact A gaps: 2

## Checks

| area | id | status | priority | detail | next action |
|---|---|---|---|---|---|
| command_powershell | npm_run_build_needs_package_json | OK | A | commands=npm run; unknown=0; nextChecks=npm run; git status --short | Keep npm run nextCheck oriented to package.json scripts; add paste-back hint later. |
| command_powershell | git_reset_hard_safety | OK | A | commands=git reset; unknown=0; nextChecks=git status --short; git --no-pager log --oneline -5 | Add explicit git reset safety rule with read-only precheck: git status --short; git log --oneline -5. |
| command_powershell | git_restore_file_safety | OK | A | commands=git restore; unknown=0; nextChecks=git diff -- <path>; git status --short | Add explicit git restore rule with precheck: git diff -- <file>. |
| command_powershell | git_branch_switch_checkout | OK | B | commands=git switch/checkout; unknown=0; nextChecks=git status --short; git branch --show-current; git --no-pager log --oneline -5 | Add git branch/switch/checkout family rule. |
| command_powershell | pip_install_requirements | OK | A | commands=pip install; unknown=0; nextChecks=python -m pip --version; Get-Content requirements.txt -TotalCount 40 | Add pip install/requirements rule with precheck: python -m pip --version; Get-Content requirements.txt -TotalCount 40. |
| command_powershell | python_venv | OK | A | commands=python -m venv; unknown=0; nextChecks=Test-Path .\.venv; python -c "import sys; print(sys.executable)" | Make python -m venv explanation more specific. |
| command_powershell | pytest | OK | B | commands=pytest; unknown=0; nextChecks=pytest -q; git status --short | Add pytest rule with next check: pytest -q; echo LASTEXITCODE. |
| command_powershell | uvicorn_fastapi | OK | B | commands=uvicorn; unknown=0; nextChecks=python -m pip show fastapi uvicorn; Get-ChildItem -Recurse -File -Filter app.py | Add uvicorn/FastAPI dev-server rule with next check: python -m pip show fastapi uvicorn. |
| command_powershell | select_string_definition_search | OK | A | commands=Select-String; unknown=0; nextChecks=Select-String -Path .\*.py -Recurse -Pattern "def <name>\|class <name>" | Add read-only source search rule; this is key for follow-up command advisor. |
| command_powershell | read_package_json | OK | A | commands=Get-Content; unknown=0; nextChecks=Get-Content <파일> -TotalCount 20 | Already useful; later add semantic paste-back path. |
| command_bash | bash_npm_run_build | OK | A | commands=npm run; unknown=0; nextChecks=npm run; git status --short | Mirror npm run rule in Bash analyzer. |
| command_bash | bash_pip_install_requirements | OK | A | commands=pip install; unknown=0; nextChecks=python3 -m pip --version; head -n 40 requirements.txt | Mirror pip install rule in Bash analyzer. |
| command_bash | bash_pytest | OK | B | commands=pytest; unknown=0; nextChecks=pytest -q; git status --short | Mirror pytest rule in Bash analyzer. |
| command_bash | bash_grep_definition_search | OK | A | commands=grep; unknown=0; nextChecks=grep -n <검색어> <파일> | Add read-only grep/search rule for function tracing. |
| command_bash | bash_find_config | OK | B | commands=find; unknown=0; nextChecks=find . -maxdepth 3 -type f \| head -n 40 | Add find/listing rule. |
| code_surface | python_flow_tokens | GAP | A | Python basic function/flow surface should be visible. file=src/pwa/code_explainer_rules.js tokens=def , return, for , if , with open | Add function-flow summary audit/patch. |
| code_surface | python_dynamic_unknown_tokens | GAP | A | Dynamic call uncertainty should trigger follow-up command suggestion. file=src/pwa/code_explainer_rules.js tokens=getattr, globals(), importlib, callback, handler | Add unknown-call advisor: search definition, inspect registry, paste output. |
| code_surface | python_data_io_tokens | OK | A | Common Python IO/API/data-library surface. file=src/pwa/code_explainer_rules.js tokens=json.load, json.dump, requests.get, pandas, read_csv, Path( |  |
| code_surface | js_flow_tokens | GAP | B | Common browser/JS flow surface. file=src/pwa/code_explainer_rules.js tokens=addEventListener, fetch, JSON.parse, localStorage | Patch JS runtime/data flow rules. |
| project_surface | project_config_tokens | OK | A | Project config file semantic coverage. file=src/pwa/project_analyzer.js tokens=package.json, requirements.txt, README, wrangler, Dockerfile |  |
| interactive_advisor | next_check_core | OK | A | Command analysis should produce follow-up checks. file=src/pwa/command_explainer.js tokens=nextCheck, nextChecks, Get-Help |  |
| interactive_advisor | paste_back_hint | OK | A | User-facing paste-back workflow should exist. file=src/pwa/command_explainer.js tokens=pasteBack, paste back, output paste, paste_back_hint |  |

## Decision

Next patch should be one broad closure, not many tiny patches:

1. Add command-family coverage for git reset/restore/switch, pip, pytest, uvicorn, Select-String/grep/find.
2. Add project config semantics for README/package/requirements/pyproject/wrangler/Dockerfile/GitHub Actions.
3. Add an interactive advisor shape: unknowns + safe read-only next commands + paste-back hint.
4. Add function-flow summary separately only after the advisor surface is stable.
