# V324-A1 explainer quality gate

## Purpose

Provides one repeatable quality gate for the explainer-related runtime and data checks created through V323.

## Version

- app version observed: 20260618_v323_a4

## Summary

- total checks: 8
- pass: 8
- fail: 0
- syntax:pass: 6
- runtime:pass: 1
- data:pass: 1

## Checks

| check | group | ok | evidence |
|---|---|---|---|
| node_check_src_pwa_code_explainer_rules_js | syntax | true | exit=0; durationMs=5505; requiredText=n/a |
| node_check_src_pwa_code_explainer_js | syntax | true | exit=0; durationMs=5514; requiredText=n/a |
| node_check_src_pwa_command_explainer_js | syntax | true | exit=0; durationMs=6310; requiredText=n/a |
| node_check_src_pwa_project_analyzer_js | syntax | true | exit=0; durationMs=3240; requiredText=n/a |
| node_check_src_pwa_app_js | syntax | true | exit=0; durationMs=6021; requiredText=n/a |
| node_check_tools_smoke_explainer_regression_v323_a6_js | syntax | true | exit=0; durationMs=3039; requiredText=n/a |
| explainer_regression_smoke_v323_a6 | runtime | true | exit=0; durationMs=6158; requiredText=true |
| lesson_data_validation | data | true | exit=0; durationMs=796; requiredText=true |

## Details

### node_check_src_pwa_code_explainer_rules_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/code_explainer_rules.js
- exitCode: 0
- durationMs: 5505

Output excerpt:




### node_check_src_pwa_code_explainer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/code_explainer.js
- exitCode: 0
- durationMs: 5514

Output excerpt:




### node_check_src_pwa_command_explainer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/command_explainer.js
- exitCode: 0
- durationMs: 6310

Output excerpt:




### node_check_src_pwa_project_analyzer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/project_analyzer.js
- exitCode: 0
- durationMs: 3240

Output excerpt:




### node_check_src_pwa_app_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/app.js
- exitCode: 0
- durationMs: 6021

Output excerpt:




### node_check_tools_smoke_explainer_regression_v323_a6_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check tools/smoke_explainer_regression_v323_a6.js
- exitCode: 0
- durationMs: 3039

Output excerpt:




### explainer_regression_smoke_v323_a6

- group: runtime
- ok: true
- command: C:\Program Files\nodejs\node.exe tools/smoke_explainer_regression_v323_a6.js
- exitCode: 0
- durationMs: 6158
- requiredText: FAIL 0

Output excerpt:

V323_A6_EXPLAINER_REGRESSION_SMOKE
APP_VERSION 20260618_v323_a4
PASS 4
FAIL 0
JSON .tmp/explainer_regression_smoke_v323_a6.json
TSV .tmp/explainer_regression_smoke_v323_a6.tsv
MD docs/quality/explainer_regression_smoke_v323_a6.md



### lesson_data_validation

- group: data
- ok: true
- command: python tools/validate_lessons.py
- exitCode: 0
- durationMs: 796
- requiredText: VALIDATION OK

Output excerpt:

APP_VERSION: 20260618_v323_a4
LESSON_FILES: 98
SIDE_FILES: 50
LESSON_CARDS: 1785
SIDE_CARDS: 440

APP CHECK LAST LESSONS:
['../../data/lessons/python_file_cli_error_recovery_v128_a1.json', '../../data/lessons/python_logging_verbose_cli_beginner_v129_a1.json', '../../data/lessons/python_env_secret_config_beginner_v130_a1.json', '../../data/lessons/python_requirements_dependency_repro_v131_a1.json', '../../data/lessons/python_readme_setup_troubleshooting_v132_a1.json']

MISSING FILES: OK
JSON ERRORS: OK
DUPLICATE LESSON IDS: OK
DUPLICATE SIDE IDS: OK
MISSING REQUIRED FIELDS: OK
ANSWER NOT IN CHOICES: OK
EMPTY CONCEPTS: OK
BAD LEVELS: OK
MISSING SIDE CARD REFERENCES: OK

VALIDATION OK



## Result

PASS: explainer quality gate passed.
