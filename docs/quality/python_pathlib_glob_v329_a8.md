# V329-A8 Python pathlib glob return expansion

## Scope

V329-A8 fixes the next V329-A2 expanded audit finding after JavaScript localStorage assignment expansion.

## Finding from V329-A2

- Sample: py_pathlib_glob
- Status before patch: REVIEW
- Missing expected title:
  - 값 돌려주기

## Root cause

A line such as `return list(Path(root).glob("*.md"))` combines two beginner-relevant concepts:

- searching files with pathlib glob
- returning the found list from the function

The line-level rule matched `.glob(...)` first and returned only `파일 목록 검색`.
Because the rule returns one step per line, the return concept was not visible to the audit.

## Changed behavior

- Python lines that start with `return` and contain `.glob(...)` or `.rglob(...)` keep the original file-search step.
- The analyzer adds a supplemental `값 돌려주기` step when needed.

## Marker

- PYTHON_PATHLIB_GLOB_RETURN_EXPAND_V329_A8

## Validation

- node --check src/pwa/code_explainer_rules.js
- node --check tools/smoke_python_pathlib_glob_v329_a8.js
- node tools/smoke_python_pathlib_glob_v329_a8.js
- node tools/audit_real_world_code_samples_v329_a2.js
- python tools/validate_lessons.py
