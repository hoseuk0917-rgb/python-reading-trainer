# V337-A2B Proofy Naming Correction Smoke

Date: 2026-06-23
Base tag: feature-v337-local-prt-server-analyze-code-a2-20260623
Runtime version: 20260623_v335_a2

## Purpose

Correct the mascot/product English spelling from Froopy to Proofy before the V337-A3 Proofy response adapter is implemented.

Korean pronunciation may remain 프루피, but code/docs/API naming should use Proofy/proofy.

## Reason

V337-A0 through V337-A2 used the temporary/wrong spelling Froopy.

This should not be allowed to harden into API fields such as:

- roopyMessage
- roopyMood
- engines.froopy
- /froopy/explain

## Changed files

- tools/local_prt_server.js
- docs/quality/v337_a0_local_prt_server_proofy_bridge_architecture.md

## Renamed file

- docs/quality/v337_a0_local_prt_server_froopy_bridge_architecture.md
- to docs/quality/v337_a0_local_prt_server_proofy_bridge_architecture.md

## Canonical naming from this point

- Proofy
- proofyMessage
- proofyMood
- engines.proofy
- future endpoint: POST /proofy/explain

## Validation

- node --check tools/local_prt_server.js: PASS
- GET http://127.0.0.1:3377/health: PASS
- engines.proofy=true: PASS
- POST http://127.0.0.1:3377/analyze-code: PASS
- proofyMessage field: PASS
- proofyMood field: PASS
- legacy froopyMessage removed: PASS
- legacy froopyMood removed: PASS
- JSON.parse explanation signal preserved: PASS
- external API use: NONE
- automatic clipboard monitoring: NONE
- background file scanning: NONE

## Health response sample

    {
        "ok":  true,
        "service":  "local-prt-server",
        "version":  "v337_a2b",
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
                        "proofy":  true
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
        "next":  "V337-A3 will add a Proofy response adapter over analyzer output."
    }

## Analyze-code response sample

    {
        "ok":  true,
        "service":  "local-prt-server",
        "version":  "v337_a2b",
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
        "proofyMessage":  "이 코드는 JSON 문자열을 실제 JavaScript 객체로 바꾸는 흐름이야. 핵심은 JSON.parse 앞뒤로 값의 형태가 달라진다는 점이야!",
        "proofyMood":  "thinking",
        "detail":  {
                       "analyzerPath":  "src\\pwa\\code_explainer_rules.js",
                       "stepCount":  3,
                       "warningCount":  0,
                       "originalInputPersisted":  false
                   }
    }

## Decision

Proofy is the canonical English spelling.

Existing historical docs/tags may still contain roopy as historical evidence, but active architecture and active server fields should use Proofy/proofy.

Next action:

- V337-A3: add POST /proofy/explain
- classify input as code, command, error, project output, or plain question
- route code-like input to analyze-code logic
- return Proofy speech-bubble output

## V337-A2B status

Status: PASS

