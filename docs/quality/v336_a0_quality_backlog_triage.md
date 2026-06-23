# V336-A0 Quality Backlog Triage

Date: 2026-06-23
Base tag: quality-v335-project-analyzer-mobile-overflow-a3-20260623
Runtime version: 20260623_v335_a2

## Purpose

Start V336 from a clean baseline and separate current actionable work from historical TODO/WARN noise.

## Baseline

Current Git state:

- Working tree: clean
- Latest tag: quality-v335-project-analyzer-mobile-overflow-a3-20260623
- Latest V335 sequence:
  - V335-A1: Project Analyzer digest/raw command UX manual smoke documented.
  - V335-A2: Mobile study-tools settings label stability fixed and live/phone verified.
  - V335-A3: Project Analyzer mobile overflow concern reviewed; no patch needed after real-phone PASS.

## Version consistency

Current version references are consistent:

- Root `index.html`: `20260623_v335_a2`
- PWA `style.css`: `20260623_v335_a2`
- PWA analyzer scripts:
  - `code_explainer_rules.js?v=20260623_v335_a2`
  - `code_explainer.js?v=20260623_v335_a2`
  - `project_analyzer.js?v=20260623_v335_a2`
  - `command_explainer.js?v=20260623_v335_a2`
  - `app.js?v=20260623_v335_a2`
- `APP_DATA_VERSION`: `20260623_v335_a2`

## TODO/WARN scan interpretation

The broad TODO/WARN scan is noisy because it includes old audit documents and historical planning notes.

Important interpretation:

- `docs/quality/v335_a1_ux_manual_smoke.md` still records the original mobile/narrow viewport WARN, but that warning was resolved or closed by later V335 documents.
- `docs/quality/v335_a2_mobile_study_tools_label_stability.md` closes the mobile study-tools label flicker issue.
- `docs/quality/v335_a3_project_analyzer_mobile_overflow_verdict.md` closes the Project Analyzer mobile overflow concern as real-phone PASS and emulator-only non-blocking WARN.
- Older V323/V328/V334 TODO/WARN hits are historical audit trails unless a fresh runtime sample reproduces the issue.
- README V200 TODO remains a documentation/backlog cleanup candidate, not an immediate runtime blocker.

## Decision

No CSS or JavaScript patch is applied in V336-A0.

V336 should not start by patching old TODO/WARN text directly. It should start with a current-state audit and only patch issues that are reproduced against the current runtime.

## Recommended V336-A1

Run a current runtime regression audit covering:

1. Root entry reaches the latest PWA runtime.
2. Project Analyzer still separates digest and raw PowerShell command.
3. Project Analyzer raw command copy still starts with `$ErrorActionPreference = "Stop"`.
4. Code Explainer still handles representative Python/JavaScript samples.
5. Command Explainer still warns on dangerous Git/PowerShell commands.
6. Lesson validation still passes.
7. Running the audit does not dirty tracked files.

## Candidate work after V336-A1

Prioritize only after the fresh audit:

- Current live/runtime regression failure, if any.
- README stale TODO cleanup.
- Current answer-quality drift in Code/Command/Project Analyzer.
- Lesson/data copy quality issues that are reproduced by a current audit.
- Mobile UX issues only if reproduced on real phone or clearly visible in root-entry flow.

## V336-A0 status

V336-A0 is a no-code planning/triage document.

Status:

- V335: CLOSED
- V336 baseline: CLEAN
- Immediate code patch: NONE
- Next action: V336-A1 current runtime regression audit
