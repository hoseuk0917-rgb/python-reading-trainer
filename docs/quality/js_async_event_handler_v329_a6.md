# V329-A6 JavaScript async event handler expansion

## Scope

V329-A6 fixes the next V329-A2 expanded audit finding after PowerShell ForEach-Object pipeline priority.

## Finding from V329-A2

- Sample: js_async_event_handler
- Status before patch: REVIEW
- Missing expected title:
  - 이벤트 처리 함수 정의

## Root cause

A one-line JavaScript statement can combine DOM selection and event binding:

- `document.querySelector(...).addEventListener("click", async () => {`

The line-level rule matched `querySelector` first and returned `화면 요소 찾기`.
Because the rule returns one step per line, the event handler concept was not visible to the audit.

## Changed behavior

- JavaScript and Worker lines containing `addEventListener(...)` now keep the original matched step.
- The analyzer adds a supplemental `이벤트 처리 함수 정의` step when needed.
- Async event handlers are explained as event callbacks that may wait for async work with `await`.

## Marker

- JS_ASYNC_EVENT_HANDLER_EXPAND_V329_A6

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_js_async_event_handler_v329_a6.js
- node tools/smoke_js_async_event_handler_v329_a6.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
