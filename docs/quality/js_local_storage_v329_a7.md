# V329-A7 JavaScript localStorage assignment expansion

## Scope

V329-A7 fixes the next V329-A2 expanded audit finding after JavaScript async event handler expansion.

## Finding from V329-A2

- Sample: js_local_storage
- Status before patch: REVIEW
- Missing expected title:
  - 변수에 값 저장

## Root cause

A line such as `const savedTheme = localStorage.getItem("theme")` combines two beginner-relevant concepts:

- using browser storage
- saving the returned value into a variable

The line-level rule matched `localStorage` first and returned only `브라우저 저장소 사용`.
Because the rule returns one step per line, the assignment concept was not visible to the audit.

## Changed behavior

- JavaScript and Worker lines that assign `localStorage.getItem(...)` or `sessionStorage.getItem(...)` to `const`, `let`, or `var` keep the original storage step.
- The analyzer adds a supplemental `변수에 값 저장` step when needed.

## Marker

- JS_LOCAL_STORAGE_ASSIGNMENT_EXPAND_V329_A7

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_js_local_storage_v329_a7.js
- node tools/smoke_js_local_storage_v329_a7.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
