# V334-A14U Project Probe Command Readability

Purpose: make the generated Project Analyzer probe command understandable before the long raw command starts.

## Strategy

- Append-only wrapper.
- Do not modify the internal `buildProbeCommand()` return array.
- Wrap `window.ProjectAnalyzer.buildProbeCommand` after ProjectAnalyzer is exported.

## Behavior

- The generated PowerShell command now starts with a comment guide.
- The guide explains that the probe inspects the project rather than running the app.
- The guide lists what the probe checks and which output files are created.
- The raw PowerShell command remains copyable and executable because the guide is written as PowerShell comments.
- Korean and English guide text are both supported.

## Changes

| target | change | count |
|---|---|---:|
| src/pwa/project_analyzer.js | append_buildProbeCommand_guide_wrapper | 1 |
