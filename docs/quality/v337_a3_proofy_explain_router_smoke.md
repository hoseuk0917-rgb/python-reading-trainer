# V337-A3 Proofy Explain Router Smoke

Date: 2026-06-23 KST

## Baseline

- Previous HEAD: 319dbe0
- Previous tag: feature-v337-proofy-naming-correction-a2b-20260623
- Previous server version: v337_a2b

## Scope

V337-A3 adds POST /proofy/explain to tools/local_prt_server.js.

This route is intentionally a Proofy response adapter over the existing compactAnalyzeCode output.
It does not introduce a new analyzer engine, external API call, clipboard monitor, background scanner, or input persistence.

## Implemented behavior

- GET /health now advertises POST /proofy/explain.
- POST /proofy/explain accepts source, code, or text.
- POST /proofy/explain accepts language or requestedLanguage.
- Missing source returns 400 missing_source.
- Successful response returns kind=proofy_explain and route=POST /proofy/explain.
- Proofy-facing fields are grouped under proofy.
- Compact analyzer fields are preserved under analysis.
- Privacy flags state externalApiUsed=false and originalInputPersisted=false.

## Validation

- node --check tools/local_prt_server.js: PASS
- node --check src/pwa/code_explainer_rules.js: PASS
- node --check src/pwa/code_explainer.js: PASS
- node --check src/pwa/app.js: PASS
- GET /health version v337_a3: PASS
- GET /health includes POST /proofy/explain: PASS
- POST /proofy/explain JSON.parse sample: PASS
- POST /proofy/explain missing source 400: PASS

## Sample response checkpoints

- kind: proofy_explain
- route: POST /proofy/explain
- language: javascript
- proofy mood: thinking
- proofy message: 이 코드는 JSON 문자열을 실제 JavaScript 객체로 바꾸는 흐름이야. 핵심은 JSON.parse 앞뒤로 값의 형태가 달라진다는 점이야!

## Next candidate

V337-A4 can connect the PWA or future Proofy overlay client to POST /proofy/explain.