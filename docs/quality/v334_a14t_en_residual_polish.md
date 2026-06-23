# V334-A14T-EN Residual Polish

Purpose: remove remaining Korean text from English Code/Command explainer outputs after A14T.

## Fixed

- Code Explainer EN Python `active_names` summary now appears in English.
- Code Explainer EN Python flow and common step wording now appears in English for the audited beginner example.
- Command Explainer EN summary no longer starts with Korean `PowerShell 명령 ...`.
- Command Explainer EN warning groups and common file-impact text are translated for dangerous cleanup and validation commands.

## Not in scope

- Project Analyzer probe-command explanation remains for the next A14U/A14V pass.

## Changes

| target | change | count |
|---|---|---:|
| src/pwa/code_explainer_rules.js | append_en_python_residual_polish | 1 |
| src/pwa/command_explainer.js | append_en_command_residual_polish | 1 |
