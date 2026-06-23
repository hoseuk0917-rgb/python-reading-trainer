# V337-A0 Local PRT Server + Proofy Bridge Architecture

Date: 2026-06-23
Base tag: quality-v336-json-parse-sample-a4-20260623
Runtime version: 20260623_v335_a2

## Purpose

Start V337 by defining a local-server architecture that allows Proofy, the PWA, and future tools to reuse the existing python-reading-trainer analysis engines.

The goal is not clipboard monitoring, PowerShell interception, or a separate patch-review product.

The goal is:

- user provides long code, pasted GPT code, command text, or selected file content
- local server analyzes it using existing PWA analyzer logic
- Proofy receives a short beginner-friendly explanation
- detailed results remain available to the PWA or local report files

## Current baseline

V336 closed the current quality-audit loop:

- V336-A0: backlog/TODO/WARN triage
- V336-A1: current runtime regression audit PASS
- V336-A2: answer-quality marker audit WARN
- V336-A3: WARN locator, false positives separated
- V336-A4: JSON.parse sample audit PASS

Current conclusion:

- no immediate runtime regression
- no immediate code patch candidate
- Code Explainer can already analyze focused JavaScript samples through `CodeExplainerRules.analyze()`
- V336-A4 proved that `code_explainer_rules.js` can be loaded by a Node script and used outside the browser PWA

## Direction decision

V337 should not start with:

- automatic clipboard monitoring
- PowerShell command interception
- VS Code extension-first implementation
- PC-wide Proofy overlay
- external API/LLM dependency

V337 should start with:

- localhost-only Local PRT Server
- existing analyzer reuse
- explicit user-provided input
- long-code understanding support
- Proofy-ready short explanation output

## Target architecture

```text
User
  |
  | paste long code / provide file text / type question
  v
Proofy UI or PWA
  |
  | HTTP POST localhost
  v
Local PRT Server
  |
  | reuse existing analysis engines
  v
Analyzer Core
  - code_explainer_rules.js
  - command_explainer.js
  - project analyzer parser/probe logic where reusable
  - secret masker
  |
  v
Structured JSON result
  - summary
  - mainFlow
  - beginnerFocus
  - warnings
  - nextChecks
  - proofyMessage
  - proofyMood
  |
  v
Proofy speech bubble / PWA result panel / local report
```

## Important distinction

This architecture should not require an open browser PWA tab.

Preferred approach:

- Local PRT Server loads reusable PWA JavaScript analysis files directly through Node or a small adapter.
- Proofy calls the local server.
- PWA can also call the same local server later if needed.

Non-preferred approach:

- Proofy sends input to a browser tab running the PWA.
- Browser PWA returns output through WebSocket.

Reason:

- browser-tab dependency is fragile
- local server is easier to test
- local server can later support Proofy, PWA, VS Code, and PowerShell clients

## Initial endpoints

Planned local server:

- `GET /health`
- `POST /analyze-code`
- `POST /analyze-command`
- `POST /proofy/explain`
- `POST /mask-secrets`
- later: `POST /analyze-project`

### GET /health

Purpose:

- verify local server is running
- return version and enabled engines

Example response:

```json
{
  "ok": true,
  "service": "local-prt-server",
  "version": "v337_a1",
  "engines": {
    "code": true,
    "command": false,
    "project": false,
    "proofy": true
  }
}
```

### POST /analyze-code

Purpose:

- analyze pasted code or file content
- reuse `CodeExplainerRules.analyze()`
- return beginner-oriented structure

Example request:

```json
{
  "language": "javascript",
  "source": "const user = JSON.parse(rawUser);",
  "mode": "long_code_understanding"
}
```

Example response shape:

```json
{
  "ok": true,
  "kind": "code",
  "language": "javascript",
  "summary": "This code parses a JSON string into a JavaScript object.",
  "mainFlow": [
    "Read raw JSON text",
    "Convert the text with JSON.parse",
    "Use a property from the parsed object"
  ],
  "beginnerFocus": [
    "JSON text is still a string before parsing.",
    "JSON.parse turns the string into an object."
  ],
  "nextChecks": [
    "Check whether the input string is valid JSON.",
    "Run node --check on the target file after applying changes."
  ],
  "proofyMessage": "핵심은 JSON.parse가 문자열을 객체로 바꾸는 부분이야. 먼저 rawUser와 user의 차이를 보면 쉬워!",
  "proofyMood": "thinking"
}
```

### POST /proofy/explain

Purpose:

- accept general Proofy input
- internally classify whether the input looks like code, command, error, project output, or plain question
- call the correct analyzer
- return a short speech-bubble answer plus optional detailed payload

Example response shape:

```json
{
  "ok": true,
  "intent": "code_explain",
  "proofyMood": "thinking",
  "proofyMessage": "이 코드는 버튼을 누르면 분석 함수를 실행하게 연결하는 부분이야.",
  "detail": {
    "summary": "...",
    "mainFlow": [],
    "nextChecks": []
  }
}
```

## Privacy and safety policy

V337 must be privacy-first.

Required rules:

- no automatic clipboard monitoring
- no background file scanning
- no external API transmission by default
- localhost only
- original input is not persisted by default
- `.tmp/` reports may store derived summaries, not secrets
- API keys, tokens, passwords, JWTs, private keys, and authorization headers must be masked before logging
- if a secret-like value is detected, Proofy should explain the situation without repeating the secret

Secret-like patterns to consider:

- `sk-...`
- `ghp_...`
- `github_pat_...`
- `Bearer ...`
- `Authorization:`
- `password=`
- `$env:*KEY=`
- JWT-like three-part tokens
- PEM private key blocks

## Large code understanding policy

The feature should remain part of Code Explainer, not a separate patch-review product.

The long-code mode should focus on understanding:

- overall purpose
- file-level structure
- main functions
- event handlers
- state variables
- DOM/API usage
- beginner reading order
- after-apply validation commands

Risk detection is secondary.

Typical warnings should be practical, not security-heavy:

- function name may conflict with existing code
- DOM selector may not match HTML
- version string may need update
- full-file replacement may drop existing patches
- syntax check is needed after applying code

## Proofy role

Proofy should not be the analyzer itself.

Proofy should be a friendly output layer over structured analyzer results.

Proofy responsibilities:

- show one short message
- choose mood/pose
- guide the user's reading order
- tell the user what to check next
- avoid overwhelming the user with full report text

Planned moods:

- `thinking`: code explanation
- `happy`: PASS / no issue
- `warning`: possible confusion or missing check
- `blocked`: secret-like value detected
- `working`: analysis in progress

## V337 implementation plan

### V337-A1: local server health endpoint

Add a minimal local server script:

- `tools/local_prt_server.js`
- `GET /health`
- no analyzer integration yet

Validation:

- `node --check tools/local_prt_server.js`
- run server locally
- `Invoke-RestMethod http://127.0.0.1:3377/health`
- no tracked source dirty except intended files

### V337-A2: analyze-code endpoint

Add:

- `POST /analyze-code`
- load `code_explainer_rules.js`
- call `CodeExplainerRules.analyze(source, language)`
- return compact JSON summary

Validation sample:

- JavaScript `JSON.parse`
- Python `with open`
- browser `addEventListener`
- localStorage/theme snippet

### V337-A3: Proofy response adapter

Add a function that converts analyzer output into:

- `proofyMessage`
- `proofyMood`
- `beginnerFocus`
- `nextChecks`

### V337-A4: secret masker

Add masking before logs or report output.

### V337-A5: PWA localhost connection test

Add optional PWA setting or test button:

- checks whether local server is running
- does not require it for normal PWA operation

### V337-A6: Proofy UI/client prototype

Later connect Proofy input to:

- `POST /proofy/explain`
- speech bubble output
- mood/pose selection

## Non-goals for V337 initial phase

Do not start with:

- always-on clipboard watcher
- global keyboard hook
- VS Code extension
- PowerShell interception
- full desktop overlay
- local LLM integration
- KG integration

These can be later extensions after the local server boundary is stable.

## Decision

V337 starts as:

- Local PRT Server
- Proofy Bridge
- long-code understanding support
- privacy-first localhost architecture

Immediate next action:

- V337-A1 local server health endpoint

## V337-A0 status

Status:

- Architecture selected
- Immediate code patch: NONE
- Next implementation: V337-A1 `tools/local_prt_server.js` health endpoint

