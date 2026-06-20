# V329-A4 Python list comprehension expansion

## Scope

V329-A4 fixes the next V329-A2 expanded audit finding after package.json auto detection.

## Finding from V329-A2

- Sample: py_list_comprehension
- Status before patch: REVIEW
- Missing expected titles:
  - 반복문
  - 조건 검사

## Root cause

`return [item for item in items if condition]` is one physical Python line, but it contains multiple beginner-relevant concepts:
return value, iteration, and filtering condition.

The line-level explainer returned only `값 돌려주기`, so the audit could not see the internal `for` and `if` concepts.

## Changed behavior

- Python return-list-comprehension lines now keep the original `값 돌려주기` step.
- The analyzer adds a supplemental `반복문` step for the `for` part.
- If the comprehension includes `if`, the analyzer adds a supplemental `조건 검사` step.

## Marker

- PYTHON_LIST_COMPREHENSION_EXPAND_V329_A4

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_python_list_comprehension_v329_a4.js
- node tools/smoke_python_list_comprehension_v329_a4.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
