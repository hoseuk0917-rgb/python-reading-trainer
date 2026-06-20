# V329-A1 Java accumulator explanation

## Scope

V329-A1 fixes the first V329-A0 audit finding.

## Finding from V329-A0

- Sample: java_loop_sum
- Problem: Java line `total += score;` was explained as a generic Java execution line.
- Audit status before patch: REVIEW

## Changed behavior

- Java plus-equals accumulator lines are now explained as `누적 더하기`.
- Explanation says the left variable receives its old value plus the right value.
- This mirrors the Python plus-equals accumulator rule added in V328-A3.

## Marker

- JAVA_PLUS_EQUALS_ACCUMULATOR_V329_A1

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_java_accumulator_v329_a1.js
- node tools/smoke_java_accumulator_v329_a1.js
- node tools/audit_real_world_code_samples_v329_a0.js
- python tools/validate_lessons.py
