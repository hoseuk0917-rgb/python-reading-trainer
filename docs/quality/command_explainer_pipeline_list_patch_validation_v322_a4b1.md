# V322-A4b1 command_explainer pipeline/list patch validation

## Purpose

Validates a narrow command_explainer patch for PowerShell pipeline and Get-ChildItem before broader A4b command rule work.

## Summary

- total samples: 2
- pass: 2
- fail: 0

## Decision table

| sample | ok | unknown risk | first command | first group | first risk | missing |
|---|---|---:|---|---|---|---|
| powershell_pipeline | true | 0 | PowerShell pipeline | 파이프라인 | safe |  |
| get_child_item | true | 0 | Get-ChildItem | 파일 목록 | safe |  |

## First-step details

### powershell_pipeline

- command: Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length
- first command: PowerShell pipeline
- first group: 파이프라인
- first risk: safe
- meaning: PowerShell pipeline입니다. 왼쪽 명령의 결과 객체가 오른쪽 명령으로 순서대로 넘어갑니다. Where-Object는 조건에 맞는 항목만 통과시킵니다. Select-Object는 필요한 속성이나 일부 항목만 골라 보여줍니다.
- file impact: 이 조합은 주로 목록 조회, 조건 필터링, 표시 항목 선택 흐름입니다. 삭제/쓰기 명령이 없다면 보통 파일을 수정하지 않습니다.
- next check: pipeline steps: Get-ChildItem -File -> Where-Object { $_.Length -gt 1000 } -> Select-Object Name, Length

### get_child_item

- command: Get-ChildItem -File
- first command: Get-ChildItem
- first group: 파일 목록
- first risk: safe
- meaning: 현재 폴더나 지정한 경로의 파일/폴더 목록을 가져옵니다.
- file impact: 목록을 읽는 명령이라 보통 파일을 수정하지 않습니다. -File은 파일만 보겠다는 뜻입니다.
- next check: Get-ChildItem -File | Select-Object -First 5 Name, Length

## Validation result

PASS: all targeted samples passed.
