# V322-A3-pre reviewed sample output audit

## Purpose

This document reviews the raw sample-output audit result and corrects over-lenient raw verdicts.
The raw harness used broad token checks, so pass_or_partial is not enough when unsupported lines remain.

## Summary

- total samples: 9
- supported_enough: 5
- weak_candidate: 3
- static_evidence_present: 1

## Reviewed decision table

| area | pattern | raw verdict | reviewed verdict | steps | unsupported | recommendation |
|---|---|---|---|---:|---:|---|
| code_explainer | __init__ | pass_or_partial | weak_candidate | 4 | 2 | Raw sample passes broad token checks, but object/instance state lines are still unsupported. Patch state-assignment/object-construction explanation before calling this solved. |
| code_explainer | self | pass_or_partial | weak_candidate | 5 | 2 | Raw sample passes broad token checks, but object/instance state lines are still unsupported. Patch state-assignment/object-construction explanation before calling this solved. |
| code_explainer | with open | pass_or_partial | supported_enough | 3 | 0 | No unsupported lines were found in this sample. Keep as lower priority unless UI review shows wording problems. |
| code_explainer | requests | pass_or_partial | supported_enough | 3 | 0 | No unsupported lines were found in this sample. Keep as lower priority unless UI review shows wording problems. |
| code_explainer | lambda | pass_or_partial | weak_candidate | 3 | 1 | Raw sample passes broad token checks, but lambda sort-key line is still unsupported. Patch list method/lambda explanation before calling this solved. |
| command_explainer | pipeline | pass_or_partial | supported_enough | 1 | 0 | The command sample passed the reviewed checks. Keep as lower priority. |
| command_explainer | git clean | pass_or_partial | supported_enough | 1 | 0 | The command sample passed the reviewed checks. Keep as lower priority. |
| command_explainer | wrangler | pass_or_partial | supported_enough | 1 | 0 | The command sample passed the reviewed checks. Keep as lower priority. |
| project_analyzer | PWA | present_static | static_evidence_present |  | 0 | Static PWA evidence exists, but project_analyzer runtime behavior was not tested. Lower priority unless project analyzer UI misses it. |

## Patch decision

### V322-A3 primary patch candidates

- code_explainer: __init__ / self object state assignment
- code_explainer: lambda used inside list method call such as scores.sort(key=lambda x: x)

### Keep as lower priority for now

- code_explainer: with open
- code_explainer: requests
- project_analyzer: PWA static evidence exists, runtime analyzer check can be separate

### Needs separate harness/schema audit before patch

- command_explainer: pipeline
- command_explainer: git clean -fd
- command_explainer: npx wrangler deploy

## Guardrail

Do not patch from broad keyword misses alone. Patch only cases where the sample output is unsupported, generic, or misleading.
Keep side-card JSON and lesson JSON out of scope.

## Generated files

- raw JSON: .tmp/interpretation_sample_output_audit_v322_a3_pre.json
- reviewed TSV: .tmp/interpretation_sample_output_audit_v322_a3_pre_reviewed.tsv
- reviewed MD: docs/quality/interpretation_sample_output_audit_v322_a3_pre.md
