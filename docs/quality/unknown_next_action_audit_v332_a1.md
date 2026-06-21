# V332-A1 Unknown / Next Action Audit

Purpose: check whether unknown or unsupported code produces actionable next-step guidance, especially PowerShell commands the user can run.

## Summary

| metric | value |
|---|---:|
| samples | 5 |
| OK | 5 |
| WATCH | 0 |
| REVIEW | 0 |
| NO_UNKNOWN_SIGNAL | 0 |

## Results

| id | lang | status | unknown signal | PowerShell/action | concrete command | unsupported | focus |
|---|---|---:|---:|---:|---:|---:|---|
| unknown_python_library_call | python | OK | true | true | true | 0 | 모르는 Python 라이브러리/함수 |
| unknown_javascript_package_call | javascript | OK | true | true | true | 1 | 모르는 JS 패키지/함수 |
| unknown_powershell_command | powershell | OK | true | true | true | 1 | 모르는 PowerShell 명령 |
| unknown_cli_command | powershell | OK | true | true | true | 2 | 모르는 CLI 명령 |
| unknown_config_key | json | OK | true | true | true | 0 | 모르는 설정 키 |

## Matched Guidance Strings

### unknown_python_library_call — OK

- unknownNextActions.0.title: Python 외부 모듈 확인
- unknownNextActions.0.shell: PowerShell
- unknownNextActions.0.commands.0: python -m pip show strange-sdk
- unknownNextActions.0.commands.1: python -c "import importlib.util; print(importlib.util.find_spec('strange_sdk'))"
- unknownNextActions.0.commands.2: Get-ChildItem -Recurse -File | Select-String "strange_sdk"
- unknownNextActions.1.title: Python 미확인 메서드 추적
- unknownNextActions.1.shell: PowerShell
- unknownNextActions.1.commands.0: Get-ChildItem -Recurse -File | Select-String "magic_upload"
- unknownNextActions.1.commands.1: Get-ChildItem -Recurse -File | Select-String "client"
- unknownNextActions.1.commands.2: python -m pip list

### unknown_javascript_package_call — OK

- sourceCode: import { runMagic } from 'unknown-kit'; const result = await runMagic('./input.json'); console.log(result);
- summary: unknown-kit 패키지에서 runMagic을 가져와 input.json을 처리하고 결과를 출력합니다. unknown-kit이 설치된 패키지인지 먼저 확인해야 합니다.
- unsupportedItems.0.title: 미등록 함수 결과 저장
- steps.0.code: import { runMagic } from 'unknown-kit';
- steps.0.title: unknown-kit에서 runMagic 가져오기
- steps.1.confidence: unsupported
- steps.1.confidenceLabel: 미지원
- mermaid: flowchart TD   classDef startEnd fill:#eef2ff,stroke:#4338ca,color:#111827;   classDef highRisk fill:#fee2e2,stroke:#b91c1c,color:#111827;   classDef mediumRisk fill:#fef3c7,stroke:#b45309,color:#111827;   classDef conditionStep fill:#e0f2fe,stroke:#0369a1,color:#111827;   classDef loopStep fill:#f3e8ff,stroke:#7e22ce,color:#111827;   classDef errorStep fill:#ffe4e6,stroke:#be123c,color:#111827;   classDef dataStep fill:#dcfce7,stroke:#15803d,color:#111827;   classDef ioStep fill:#ccfbf1,stroke:
- unknownNextActions.0.key: js-package:unknown-kit
- unknownNextActions.0.reason: unknown-kit 패키지가 package.json(프로젝트 설치 목록 파일)에 있는지, 실제로 설치되어 있는지 확인해야 합니다.
- unknownNextActions.0.shell: PowerShell
- unknownNextActions.0.commands.0: npm ls unknown-kit
- unknownNextActions.0.commands.1: npm view unknown-kit version
- unknownNextActions.0.commands.2: Get-Content package.json -ErrorAction SilentlyContinue | Select-String "unknown-kit"

### unknown_powershell_command — OK

- language: powershell
- callFlow.0.target: PowerShell 명령
- callFlow.0.summary: PowerShell 내장 명령이나 cmdlet을 호출합니다.
- callFlow.1.target: PowerShell 명령
- callFlow.1.summary: PowerShell 내장 명령이나 cmdlet을 호출합니다.
- steps.0.explain: Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다.
- steps.0.confidence: unsupported
- steps.0.confidenceLabel: 미지원
- unknownNextActions.0.title: PowerShell/CLI(터미널 명령) 확인
- unknownNextActions.0.shell: PowerShell
- unknownNextActions.0.commands.0: Get-Command Invoke-MysteryTool -ErrorAction SilentlyContinue
- unknownNextActions.0.commands.1: Get-Help Invoke-MysteryTool -Full

### unknown_cli_command — OK

- language: powershell
- summary: PowerShell 스크립트를 2단계로 나눠 해석했습니다. 특별히 높은 위험 명령은 감지되지 않았습니다.
- steps.0.explain: 이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.
- steps.0.confidence: unsupported
- steps.0.confidenceLabel: 미지원
- steps.1.explain: 이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.
- steps.1.confidence: unsupported
- steps.1.confidenceLabel: 미지원
- unknownNextActions.0.title: PowerShell/CLI(터미널 명령) 확인
- unknownNextActions.0.shell: PowerShell
- unknownNextActions.0.commands.0: Get-Command weird-cli -ErrorAction SilentlyContinue
- unknownNextActions.0.commands.1: Get-Help weird-cli -Full

### unknown_config_key — OK

- sourceCode: {   "experimentalMagicMode": true,   "unknownAdapter": "fast" }
- steps.1.code: "unknownAdapter": "fast"
- steps.1.explain: unknownAdapter 설정에 문자열 값을 지정합니다. 따옴표 안의 값이 실제 옵션 이름입니다.
- unknownNextActions.0.shell: PowerShell
- unknownNextActions.0.commands.0: Get-ChildItem -Recurse -File | Select-String "experimentalMagicMode"
- unknownNextActions.0.commands.2: Get-Content package.json -ErrorAction SilentlyContinue
- unknownNextActions.1.key: json-key:unknownAdapter
- unknownNextActions.1.reason: unknownAdapter 설정 키가 어느 도구에서 쓰이는 옵션인지 프로젝트 안에서 확인해야 합니다.
- unknownNextActions.1.shell: PowerShell
- unknownNextActions.1.commands.0: Get-ChildItem -Recurse -File | Select-String "unknownAdapter"
- unknownNextActions.1.commands.2: Get-Content package.json -ErrorAction SilentlyContinue
