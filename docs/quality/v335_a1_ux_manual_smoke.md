# V335-A1 UX Manual Smoke

Date: 2026-06-23
Base version: 20260623_v334_a14v
Base commit: ae071b2
Base tag: quality-v334-project-probe-digest-raw-split-a14v-20260623

## Scope

This smoke test verifies the live Project Analyzer UX after the V334-A14U/A14V digest/raw command separation.

No app code was changed in this pass.

## Live target

- repo: D:\projects\python-reading-trainer
- public live entry: https://hoseuk0917-rgb.github.io/python-reading-trainer
- direct PWA runtime: https://hoseuk0917-rgb.github.io/python-reading-trainer/src/pwa/
- tab: 프로젝트분석 / Project Analyzer

## Manual checks

| Check | Result | Notes |
|---|---:|---|
| Project Analyzer tab entry | PASS | Tab opens normally. |
| Project root input | PASS | `D:\projects\python-reading-trainer` is displayed and retained. |
| Command generation | PASS | Digest appears before raw command. |
| Digest/raw separation | PASS | Digest guide is shown outside the raw command box. |
| Raw command first line | PASS | Raw command starts with `$ErrorActionPreference = "Stop"`. |
| Copy command result | PASS | Copied text starts with `$ErrorActionPreference = "Stop"`. |
| Digest copied by command copy button | PASS | Digest text was not included in copied command. |
| Console errors | PASS | No console errors observed. |
| Mobile/narrow viewport 390px | WARN | Horizontal overflow exists, but scrolling works. |
| Mobile/narrow viewport 360px | WARN | Horizontal overflow exists, but scrolling works. |
| Mobile/narrow viewport 320px | WARN | Expected same class if scrolling remains usable. |

## Result

V335-A1 is considered functionally PASS with responsive UX WARN.

The digest/raw command separation works correctly:

- Digest appears first.
- Raw PowerShell remains separate.
- Command copy copies the raw command only.
- Raw command begins with `$ErrorActionPreference = "Stop"`.

## Follow-up candidate

V335-A2 responsive polish candidate:

- Reduce horizontal overflow in narrow viewports.
- Improve digest text wrapping inside the Project Analyzer panel.
- Ensure input, buttons, digest, and raw command box stay inside the visible mobile card width.
- Preserve raw command horizontal scrolling where useful for PowerShell readability.

## Entry comparison note

Live entry comparison was checked after the phone smoke test.

Observed:

- Root page contains `20260623_v334_a14v`.
- Root page references `src/pwa`.
- Root page does not directly include `app.js`.
- Root page does not directly include `project_analyzer.js`.
- PWA page directly includes `app.js?v=20260623_v334_a14v`.
- PWA page directly includes `project_analyzer.js?v=20260623_v334_a14v`.

Interpretation:

- `/python-reading-trainer/src/pwa/` is the direct app runtime target for detailed Project Analyzer checks after entering or reaching the app.
- `/python-reading-trainer/` is the canonical public user entry and must be checked first for final user-facing QA.
- Public user-entry checks should start from the root URL and confirm it references or lands on the latest PWA runtime.
- A mobile study-tools label difference was observed between entry paths. The direct PWA path may show the newer compact label `설정`, while another entry/cache state may show `설정 펼치기`.
- This is not a Project Analyzer digest/raw separation failure.
- Track it separately as a mobile study-tools label stability / cache-state UX candidate.

## Root entry follow-up

The public entry path is still the root URL:

- `https://hoseuk0917-rgb.github.io/python-reading-trainer/`

The direct PWA path is the runtime page used for detailed Project Analyzer checks:

- `https://hoseuk0917-rgb.github.io/python-reading-trainer/src/pwa/`

For final QA, both should be considered:

- Root URL should expose or route to the latest PWA version.
- Direct PWA URL should load the latest app/runtime scripts.
- If mobile labels differ between root entry and direct PWA entry, treat it as a user-entry/cache/state UX issue rather than a Project Analyzer command-copy failure.

