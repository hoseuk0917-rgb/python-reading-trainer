# V337-A2 Local PRT Server Analyze-Code Smoke

Date: 2026-06-23
Base tag: feature-v337-local-prt-server-health-a1-20260623
Runtime version: 20260623_v335_a2

## Purpose

Add the first analyzer-backed endpoint to the Local PRT Server.

This step proves that the local server can load src/pwa/code_explainer_rules.js through Node and execute CodeExplainerRules.analyze() without requiring an open browser PWA tab.

## Changed file

- tools/local_prt_server.js

## Endpoint

- GET /health
- POST /analyze-code

## Validation

- node --check tools/local_prt_server.js: PASS
- GET http://127.0.0.1:3377/health: PASS
- POST http://127.0.0.1:3377/analyze-code: PASS
- JavaScript JSON.parse sample signal: PASS
- froopyMessage field: PASS
- original input persisted by default: NO
- external API use: NONE
- automatic clipboard monitoring: NONE
- background file scanning: NONE

## Sample input

    const rawUser = '{"name":"Ayla","level":2}';
    const user = JSON.parse(rawUser);
    console.log(user.name);

## Health response sample

    {
        "ok":  true,
        "service":  "local-prt-server",
        "version":  "v337_a2",
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
                        "code":  true,
                        "command":  false,
                        "project":  false,
                        "froopy":  true
                    },
        "endpoints":  [
                          "GET /health",
                          "POST /analyze-code"
                      ],
        "privacy":  {
                        "localhostOnly":  true,
                        "externalApiByDefault":  false,
                        "automaticClipboardMonitoring":  false,
                        "backgroundFileScanning":  false,
                        "persistOriginalInputByDefault":  false
                    },
        "next":  "V337-A3 will add a Froopy response adapter over analyzer output."
    }

## Analyze-code response sample

    {
        "ok":  true,
        "service":  "local-prt-server",
        "version":  "v337_a2",
        "kind":  "code",
        "mode":  "long_code_understanding",
        "language":  "javascript",
        "sourceMeta":  {
                           "characters":  102,
                           "lines":  3
                       },
        "summary":  "JavaScript 코드를 3단계로 나눠 해석했습니다. 특별히 높은 위험 명령은 감지되지 않았습니다.",
        "flowSummary":  "주요 흐름: 검증 1개 · 데이터변환 1개 · 변수/값 1개",
        "mainFlow":  [
                         "변수에 값 저장",
                         "JSON 문자열 변환",
                         "화면/콘솔에 출력",
                         "주요 흐름: 검증 1개 · 데이터변환 1개 · 변수/값 1개",
                         "JavaScript 코드를 3단계로 나눠 해석했습니다. 특별히 높은 위험 명령은 감지되지 않았습니다."
                     ],
        "beginnerFocus":  [
                              "JSON.parse는 JSON 문자열을 JavaScript 객체로 바꾸는 핵심 부분입니다.",
                              "파싱 전 값은 문자열이고, 파싱 후 값은 객체처럼 속성에 접근할 수 있습니다."
                          ],
        "warnings":  [
    
                     ],
        "nextChecks":  [
                           "적용 후 JavaScript 파일이면 node --check \u003c파일경로\u003e로 문법을 확인하세요.",
                           "적용 전후 git status --short와 git diff --stat로 변경 범위를 확인하세요."
                       ],
        "froopyMessage":  "이 코드는 JSON 문자열을 실제 JavaScript 객체로 바꾸는 흐름이야. 핵심은 JSON.parse 앞뒤로 값의 형태가 달라진다는 점이야!",
        "froopyMood":  "thinking",
        "detail":  {
                       "analyzerPath":  "src\\pwa\\code_explainer_rules.js",
                       "stepCount":  3,
                       "warningCount":  0,
                       "originalInputPersisted":  false
                   }
    }

## Decision

V337-A2 proves the local Froopy bridge can receive code text and return a compact beginner-facing code explanation through localhost.

Next action:

- V337-A3: add Froopy response adapter
- add POST /froopy/explain
- classify input as code, command, error, project output, or plain question
- route code-like input to POST /analyze-code logic

## V337-A2 status

Status: PASS
