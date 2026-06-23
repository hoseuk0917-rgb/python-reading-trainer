# V334-A14V Project Probe Digest / Raw Command Split

Purpose: make the Project Analyzer generated command easier to understand before showing the long raw PowerShell command.

## Strategy

- Line-based insertion, not fragile multi-line exact block replacement.
- Add digest box in the UI before the raw command box.
- Keep `lastCommand = buildProbeCommand(root)` as the raw command source for copy.
- Add direct API digest wrapper for direct analyzer audit readability.

## Changes

| target | change | count |
|---|---|---:|
| src/pwa/index.html | add_project_probe_digest_box_line_based | 1 |
| src/pwa/project_analyzer.js | add_digest_ui_helpers | 1 |
| src/pwa/project_analyzer.js | render_digest_after_generate_command_line_based | 1 |
| src/pwa/project_analyzer.js | reset_digest_on_clear_line_based | 1 |
| src/pwa/project_analyzer.js | append_direct_api_digest_wrapper | 1 |
