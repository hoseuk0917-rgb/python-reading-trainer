# V337-A1 Local PRT Server Health Smoke

Date: 2026-06-23
Base tag: feature-v337-local-prt-server-froopy-bridge-a0-20260623
Runtime version: 20260623_v335_a2

## Purpose

Add the first local server boundary for V337.

This step only proves that a localhost-only Local PRT Server can run and return a stable health payload.

Analyzer integration is intentionally not included yet.

## Added file

- tools/local_prt_server.js

## Endpoint

- GET /health
- Default host: 127.0.0.1
- Default port: 3377

## Validation

- node --check tools/local_prt_server.js: PASS
- Invoke-RestMethod http://127.0.0.1:3377/health: PASS
- analyzer integration: NOT YET
- external API use: NONE
- automatic clipboard monitoring: NONE
- background file scanning: NONE

## Health response sample

    {
        "ok":  true,
        "service":  "local-prt-server",
        "version":  "v337_a1",
        "runtimeVersion":  "20260623_v335_a2",
        "repo":  "python-reading-trainer",
        "host":  "127.0.0.1",
        "port":  3377,
        "root":  "D:\\projects\\python-reading-trainer",
        "platform":  {
                         "os":  "win32",
                         "arch":  "x64",
                         "node":  "v22.20.0"
                     },
        "engines":  {
                        "code":  false,
                        "command":  false,
                        "project":  false,
                        "froopy":  true
                    },
        "endpoints":  [
                          "GET /health"
                      ],
        "privacy":  {
                        "localhostOnly":  true,
                        "externalApiByDefault":  false,
                        "automaticClipboardMonitoring":  false,
                        "backgroundFileScanning":  false,
                        "persistOriginalInputByDefault":  false
                    },
        "next":  "V337-A2 will add POST /analyze-code and load code_explainer_rules.js."
    }

## Decision

V337-A1 is a minimal localhost health boundary.

Next action:

- V337-A2: add POST /analyze-code
- load src/pwa/code_explainer_rules.js from Node
- return compact code explanation JSON
- keep original input non-persistent by default

## V337-A1 status

Status: PASS
