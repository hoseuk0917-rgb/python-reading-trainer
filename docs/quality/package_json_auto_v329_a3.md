# V329-A3 package.json auto detection

## Scope

V329-A3 fixes the highest-priority finding from the V329-A2 expanded real-world code sample audit.

## Finding from V329-A2

- Sample: config_package_json
- Status before patch: REVIEW
- Unsupported items before patch: 4
- Missing expected titles:
  - 패키지 이름 설정
  - 패키지 버전 설정
  - npm 스크립트 목록
  - npm 스크립트 정의

## Root cause

The package.json explainer already existed, but auto language detection required `scripts` plus `dependencies` or `devDependencies`.
A common minimal package.json with only `name`, `version`, and `scripts` was not detected as package_json.

## Changed behavior

- Auto detection now recognizes package.json when `scripts` appears with `name`, `version`, `dependencies`, or `devDependencies`.
- Minimal package.json snippets with `{`, `name`, and `scripts` are detected as package_json.
- Package name, version, and npm script definition lines have explicit beginner-facing titles.

## Markers

- PACKAGE_JSON_AUTO_DETECT_V329_A3
- PACKAGE_JSON_FIELD_RULES_V329_A3

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_package_json_auto_v329_a3.js
- node tools/smoke_package_json_auto_v329_a3.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
