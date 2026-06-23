# V334-A14R Direct Analyzer Answer Quality

목적: UI 전체 텍스트가 아니라 analyzer 직접 호출 결과만으로 답변 품질을 평가한다.

## Summary

| metric | value |
|---|---:|
| cases | 7 |
| average | 17.3 / 20 |
| A | 6 |
| B | 0 |
| C | 1 |
| D | 0 |

## Case scores

| grade | score | menu | lang | case | issues |
|---|---:|---|---|---|---|
| A | 20 | code | ko | PowerShell backup script | 큰 품질 문제 없음 |
| A | 20 | code | ko | Python active_names filter | 큰 품질 문제 없음 |
| A | 20 | code | en | PowerShell backup script EN | 큰 품질 문제 없음 |
| A | 17 | command | ko | Dangerous cleanup command | 큰 품질 문제 없음 |
| A | 18 | command | ko | Validation routine command | 큰 품질 문제 없음 |
| A | 16 | command | en | Dangerous cleanup command EN | generic/빈약한 요약 표현 남음 |
| C | 10 | project | ko | Project probe command generation | 출력이 길어 가독성이 떨어질 수 있음; 핵심 동작 설명 일부 부족; 종합요약 신호 부족 |

## Direct output samples

### A · code · ko · PowerShell backup script

- score: 20 / 20
- issues: 큰 품질 문제 없음

```text
summary: 전체적으로 이 PowerShell 스크립트는 작업 폴더를 프로젝트 위치로 옮기고 현재 시각으로 겹치지 않는 실행 이름이나 백업 이름을 만들고 백업 경로를 변수에 저장해 뒤의 명령에서 재사용하고 필요한 백업 폴더를 만들고 원본 파일이나 폴더를 백업 위치로 복사하고 백업 내용을 ZIP 파일로 묶고 마지막으로 Git 변경 상태를 확인합니다. 실행 전에는 -Force 옵션 때문에 기존 대상이 덮이거나 강제로 처리될 수 있는지 확인해야 합니다; Compress-Archive가 현재 PowerShell 환경에서 사용 가능한 명령인지 확인하면 안전합니다. flowSummary: 주요 흐름: 파일/경로 4개 · 버전관리 1개 · 변수/값 1개 · 파이프라인 1개 confidence: {"exact":6,"inferred":1,"unsupported":0} warnings: 7 · 파일/폴더 복사 · 원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다. · medium steps: 1. line 1 · 작업 폴더 이동 · 이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다. · risk=low 2. line 3 · 시간값을 변수에 저장 · $stamp 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다. · risk=low 3. line 4 · 변수에 값 저장 · $backupRoot 변수에 값을 넣습니다. 이후 줄에서 $backupRoot을 쓰면 이 값을 다시 사용합니다. · risk=low 4. line 6 · 파이프라인 처리 · 앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다. · risk=low 5. line 7 · 파일/폴더 복사 · 원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다. · risk=medium 6. line 8 · ZIP 압축 생성 · 지정한 파일이나 폴더를 zip 파일로 묶습니다. · risk=low 7. line 10 · Git 변경 상태 확인 · 현재 폴더에서 어떤 파일이 수정되었는지 확인합니다. · risk=low
```

### A · code · ko · Python active_names filter

- score: 20 / 20
- issues: 큰 품질 문제 없음

```text
summary: users 목록에서 active가 True인 사람만 골라 이름을 active_names에 모은 뒤 출력합니다. 이 예시에서는 ['A']가 출력됩니다. flowSummary: 주요 흐름: 반복 2개 · 변수/값 2개 · 처리 2개 · 조건 1개 · 출력/응답 1개 confidence: {"exact":4,"inferred":2,"unsupported":2} steps: 1. line 1 · users에 사용자 목록 저장 · A와 B 두 사람 정보가 들어 있습니다. 각 사람은 name 값과 active 값을 가집니다. · risk=low 2. line 2 · active_names를 빈 리스트로 준비 · 조건에 맞는 이름을 나중에 담을 빈 상자를 만듭니다. · risk=low 3. line 3 · users를 한 명씩 확인 · user 변수에 A 정보, 그다음 B 정보가 차례로 들어갑니다. · risk=low 4. line 6 · active 값 확인 · user['active']가 True인 사람만 아래 코드를 실행합니다. · risk=low 5. line 7 · 조건에 맞는 이름 추가 · 조건에 맞으면 user['name']을 active_names에 추가합니다. 여기서는 A만 추가됩니다. · risk=low 6. line 8 · 최종 결과 출력 · active_names에 모인 최종 결과인 ['A']를 화면에 보여줍니다. · risk=low
```

### A · code · en · PowerShell backup script EN

- score: 20 / 20
- issues: 큰 품질 문제 없음

```text
summary: Overall, this PowerShell script changes to the project folder, creates a timestamp for a unique run or backup name, stores the backup path in a variable for reuse, creates the backup folder, copies the source files or folders to the backup location, compresses the backup content into a ZIP file, then checks the Git working-tree status. Before running it, check whether -Force could overwrite or force-handle an existing target; confirm that Compress-Archive is available in the current PowerShell environment. flowSummary: Main flow: file/path 3 · variable/value 2 · version control 1 · DB 1 confidence: {"exact":7,"inferred":0,"unsupported":0} warnings: 7 · Copying files/folders · Copies the original file or folder to another location. With -Recurse, folder contents are included. · medium steps: 1. line 1 · Change working directory · This changes the working directory from which later commands will run. · risk=low 2. line 3 · Store current time in a variable · $stamp stores the current date/time string. It is useful for unique backup names or run IDs. · risk=low 3. line 4 · Store a value in a variable · $backupRoot stores a value. Later lines can reuse that value by referring to $backupRoot. · risk=low 4. line 6 · Pipeline processing · The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed. · risk=low 5. line 7 · Copying files/folders · Copies the original file or folder to another location. With -Recurse, folder contents are included. · risk=medium 6. line 8 · Create ZIP archive · Creates a ZIP archive from the specified files or folders. · risk=low 7. line 10 · Check Git status · This line is interpreted as: Check Git status. Review the original line, paths, options, and surrounding context before running it
```

### A · command · ko · Dangerous cleanup command

- score: 17 / 20
- issues: 큰 품질 문제 없음

```text
summary: PowerShell 명령 4개를 작업 순서대로 분석했습니다. 위험 3개, 주의 0개, 미확인 0개입니다. language: powershell steps: 1. safe · Set-Location "D:\projects\python-reading-trainer" 2. danger · Remove-Item ".tmp\old_probe" -Recurse -Force 3. danger · git clean -fd 4. danger · git reset --hard HEAD warnings: - {"line":2,"command":"Remove-Item","group":"파일 삭제","risk":"danger","raw":"Remove-Item \".tmp\\old_probe\" -Recurse -Force","meaning":"파일이나 폴더를 삭제합니다.","fileImpact":"대상 파일/폴더가 사라질 수 있습니다. -Recurse는 하위 항목까지, -Force는 강제로 처리한다는 뜻입니다. 현재 줄에는 -Recurse 또는 -Force가 있어 삭제 범위가 커질 수 있습니다.","nextCheck":"Test-Path <삭제 대상 경로>"} - {"line":3,"command":"git clean","group":"Git 위험 정리","risk":"danger","raw":"git clean -fd","meaning":"git clean은 Git이 추적하지 않는 untracked 파일/폴더를 작업 폴더에서 정리하는 명령입니다. -fd는 파일과 폴더 삭제를 실행할 수 있습니다.","fileImpact":"untracked 파일/폴더를 삭제할 수 있고, 삭제 후 Git으로 복구하기 어려울 수 있습니다. -x 옵션이 있으면 ignored 파일까지 포함될 수 있습니다. 실행 전에는 반드시 dry-run인 git clean -fdn으로 미리보기하세요.","nextCheck":"git clean -fdn; git status --short"} - {"line":4,"command":"git reset","group":"Git danger","risk":"danger","raw":"git reset --hard HEAD","meaning":"Moves Git state. With --hard, local tracked file changes can be discarded. Treat this as a recovery/destructive command, not a normal save command.","fileImpact":"Can change Git history pointers and can discard local file changes when --hard is used.","nextCheck":"git status --short; git --no-pager log --oneline -5"}
```

### A · command · ko · Validation routine command

- score: 18 / 20
- issues: 큰 품질 문제 없음

```text
summary: PowerShell 명령 6개를 작업 순서대로 분석했습니다. 위험 0개, 주의 3개, 미확인 0개입니다. language: powershell steps: 1. safe · Set-Location "D:\projects\python-reading-trainer" 2. caution · node --check "src\pwa\app.js" 3. caution · node "tools\audit_v334_a9_language_toggle.js" 4. caution · python "tools\validate_lessons.py" 5. safe · git diff --check 6. safe · git status --short warnings: - {"line":2,"command":"node","group":"JS 스크립트 실행","risk":"caution","raw":"node --check \"src\\pwa\\app.js\"","meaning":"Node.js로 JavaScript 파일이나 인라인 코드를 실행합니다.","fileImpact":"실행하는 JS 스크립트 내용에 따라 파일 생성/수정/삭제가 일어날 수 있습니다.","nextCheck":"스크립트 실행 후 git status --short"} - {"line":3,"command":"node","group":"JS 스크립트 실행","risk":"caution","raw":"node \"tools\\audit_v334_a9_language_toggle.js\"","meaning":"Node.js로 JavaScript 파일이나 인라인 코드를 실행합니다.","fileImpact":"실행하는 JS 스크립트 내용에 따라 파일 생성/수정/삭제가 일어날 수 있습니다.","nextCheck":"스크립트 실행 후 git status --short"} - {"line":4,"command":"python","group":"스크립트 실행","risk":"caution","raw":"python \"tools\\validate_lessons.py\"","meaning":"Python 스크립트나 Python 명령을 실행합니다.","fileImpact":"실행하는 스크립트 내용에 따라 파일 생성/수정/삭제가 일어날 수 있습니다.","nextCheck":"스크립트 실행 후 git status --short"}
```

### A · command · en · Dangerous cleanup command EN

- score: 16 / 20
- issues: generic/빈약한 요약 표현 남음

```text
summary: PowerShell 명령 4개를 작업 순서대로 분석했습니다. 위험 3개, 주의 0개, 미확인 0개입니다. language: powershell steps: 1. safe · Set-Location "D:\projects\python-reading-trainer" 2. danger · Remove-Item ".tmp\old_probe" -Recurse -Force 3. danger · git clean -fd 4. danger · git reset --hard HEAD warnings: - {"line":2,"command":"Remove-Item","group":"파일 삭제","risk":"danger","raw":"Remove-Item \".tmp\\old_probe\" -Recurse -Force","meaning":"파일이나 폴더를 삭제합니다.","fileImpact":"대상 파일/폴더가 사라질 수 있습니다. -Recurse는 하위 항목까지, -Force는 강제로 처리한다는 뜻입니다. 현재 줄에는 -Recurse 또는 -Force가 있어 삭제 범위가 커질 수 있습니다.","nextCheck":"Test-Path <삭제 대상 경로>"} - {"line":3,"command":"git clean","group":"Git 위험 정리","risk":"danger","raw":"git clean -fd","meaning":"git clean은 Git이 추적하지 않는 untracked 파일/폴더를 작업 폴더에서 정리하는 명령입니다. -fd는 파일과 폴더 삭제를 실행할 수 있습니다.","fileImpact":"untracked 파일/폴더를 삭제할 수 있고, 삭제 후 Git으로 복구하기 어려울 수 있습니다. -x 옵션이 있으면 ignored 파일까지 포함될 수 있습니다. 실행 전에는 반드시 dry-run인 git clean -fdn으로 미리보기하세요.","nextCheck":"git clean -fdn; git status --short"} - {"line":4,"command":"git reset","group":"Git danger","risk":"danger","raw":"git reset --hard HEAD","meaning":"Moves Git state. With --hard, local tracked file changes can be discarded. Treat this as a recovery/destructive command, not a normal save command.","fileImpact":"Can change Git history pointers and can discard local file changes when --hard is used.","nextCheck":"git status --short; git --no-pager log --oneline -5"}
```

### C · project · ko · Project probe command generation

- score: 10 / 20
- issues: 출력이 길어 가독성이 떨어질 수 있음; 핵심 동작 설명 일부 부족; 종합요약 신호 부족

```text
$ErrorActionPreference = "Stop" $ProjectRoot = 'D:\projects\python-reading-trainer' Set-Location $ProjectRoot if (-not (Test-Path .\.tmp)) { New-Item -ItemType Directory -Force .\.tmp | Out-Null } # ENV_AUDIT_V194_A1 $PythonCmd = Get-Command python -ErrorAction SilentlyContinue if (-not $PythonCmd) { throw 'PYTHON_NOT_FOUND: Python을 설치하거나 PATH에 추가한 뒤 다시 실행하세요.' } $GitCmd = Get-Command git -ErrorAction SilentlyContinue $NodeCmd = Get-Command node -ErrorAction SilentlyContinue $PipCmd = python -m pip --version 2>$null $RequiredPipPackages = @() Write-Host 'ENV_AUDIT_V194_A1' Write-Host ('ENV_PYTHON ' + $PythonCmd.Source) Write-Host ('ENV_GIT ' + $(if ($GitCmd) { $GitCmd.Source } else { 'missing_optional' })) Write-Host ('ENV_NODE ' + $(if ($NodeCmd) { $NodeCmd.Source } else { 'missing_optional' })) Write-Host ('ENV_PIP ' + $(if ($PipCmd) { $PipCmd } else { 'missing_optional' })) if ($RequiredPipPackages.Count -eq 0) { Write-Host 'ENV_PIP_PACKAGES none' } else { foreach ($pkg in $RequiredPipPackages) { python -m pip show $pkg *> $null if ($LASTEXITCODE -ne 0) { Write-Host ('ENV_INSTALLING_PIP_PACKAGE ' + $pkg) python -m pip install $pkg } else { Write-Host ('ENV_PIP_PACKAGE_OK ' + $pkg) } } } @' from pathlib import Path from collections import Counter import ast import json import re import subprocess import sys from shutil import which from datetime import datetime ROOT = Path('.').resolve() OUT_DIR = ROOT / '.tmp' OUT_JSON = OUT_DIR / 'project_probe_v199.json' OUT_MD = OUT_DIR / 'project_probe_v199_report.md' OUT_JSON_LATEST = OUT_DIR / 'project_probe_latest.json' OUT_MD_LATEST = OUT_DIR / 'project_probe_latest_report.md' SKIP_DIRS = {'.git', '.tmp', 'node_modules', '.venv', '.venv_lora_infer', '__pycache__', '.pytest_cache', 'dist', 'build', '.next'} TEXT_EXTS = {'.js',
```

