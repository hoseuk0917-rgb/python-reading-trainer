# V334-A14T Structured Code Summary

Purpose: improve Code Explainer summary readability without changing the detailed step cards.

## Behavior

- PowerShell summaries are now structured as task, flow, and before-running checks.
- Summary line breaks are rendered as visible line breaks in the existing Code Summary box.
- Python auto-detect and Command summary fixes from A14S are preserved.

## Changes

| target | change | count |
|---|---|---:|
| src/pwa/code_explainer_rules.js | append_structured_powershell_summary_wrapper | 1 |
| src/pwa/code_explainer.js | render_summary_newlines_as_br | 1 |
