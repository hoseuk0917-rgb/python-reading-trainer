# V329-A9 Java try/catch read error handling expansion

## Scope

V329-A9 fixes the last remaining V329-A2 expanded audit REVIEW item.

## Finding from V329-A2

- Sample: java_try_catch_read
- Status before patch: REVIEW
- Missing expected title:
  - 오류 처리

## Root cause

A Java catch line such as `catch (IOException e)` can be matched by a specific exception rule first.
That is useful, but beginner explanation also needs the broader concept:

- this line handles an error so the program does not immediately stop

Because the rule returns one step per line, the generic error-handling concept was not visible to the audit.

## Changed behavior

- Java lines containing `catch (...)` keep the original matched step.
- The analyzer adds a supplemental `오류 처리` step when needed.

## Marker

- JAVA_CATCH_ERROR_HANDLING_EXPAND_V329_A9

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_java_try_catch_read_v329_a9.js
- node tools/smoke_java_try_catch_read_v329_a9.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
