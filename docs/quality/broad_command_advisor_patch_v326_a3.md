# V326-A3 broad command advisor patch

## Purpose

Close the biggest practical gaps from the V326-A2 broad audit in one broad patch.

## Scope

- Add explicit PowerShell rules for git reset, git restore, Git branch/change commands, pip install, python -m venv, pytest, uvicorn, and Select-String.
- Add Bash rules for git reset, git restore, Git branch/change commands, pip install, pytest, uvicorn, and find.
- Add interactive advisor fields to command analysis results: unknowns, pasteBackHint, advisorMode.
- Add project analyzer config semantics marker for requirements.txt, pyproject.toml, wrangler.toml, Dockerfile, README files, and GitHub Actions workflows.
- Bump app/cache version to 20260619_v326_a3.

## Validation

- node --check src/pwa/command_explainer.js
- node --check src/pwa/project_analyzer.js
- node --check src/pwa/app.js
- node --check tools/smoke_broad_command_advisor_v326_a3.js
- node tools/smoke_broad_command_advisor_v326_a3.js
- node tools/audit_broad_interpretation_surface_v326_a2.js
- node tools/quality_gate_explainer_v324_a1.js
- python tools/validate_lessons.py

## Decision

This patch is intentionally broad. It does not try to become a full static analyzer. It improves the real workflow: explain what is visible, expose uncertainty, suggest safe read-only checks, and ask the user to paste output back for a more exact explanation.

## Result

PASS: broad command advisor smoke passed, post-patch broad audit ran, current quality gate passed, and lesson validation remained OK.
