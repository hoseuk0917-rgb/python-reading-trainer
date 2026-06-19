# V325-A4 live quality gate

## Purpose

Verify that the V325-A2 npm/node command interpretation and V325-A3 no-dirty regression smoke changes are available in the deployed GitHub Pages build.

## Note

This fixed V325-A4 live gate uses literal string matching instead of PowerShell -like, because version-parser strings contain square brackets such as [0-9a-z_].

## Summary

- expected version: 20260619_v325_a2
- expected commit: c983b4b
- pass: 14
- fail: 0
- live attempt: 1

## Checks

| check | status | detail |
|---|---|---|
| local_head | PASS | HEAD c983b4b |
| local_quality_gate | PASS | PASS 8 / FAIL 0 / 20260619_v325_a2 |
| local_validate_lessons | PASS | VALIDATION OK / 20260619_v325_a2 |
| live_root_version | PASS | root index contains expected app version |
| live_pwa_version | PASS | pwa index contains expected app version |
| live_app_version | PASS | app.js contains expected app version |
| live_command_version | PASS | command_explainer.js contains expected command version |
| live_npm_marker | PASS | npm/node command marker exists |
| live_npm_install | PASS | npm install rule exists |
| live_npm_run | PASS | npm run rule exists |
| live_node_script | PASS | node script rule exists |
| live_quality_gate_version_parser | PASS | quality gate accepts later date-based versions |
| live_regression_no_dirty_marker | PASS | regression smoke no-dirty marker exists |
| live_regression_version_parser | PASS | regression smoke accepts later date-based versions |

## Decision

V325-A4 live gate passed. The deployed app contains the V325-A2 npm/node command interpretation and the V325-A3 no-dirty regression smoke markers.
