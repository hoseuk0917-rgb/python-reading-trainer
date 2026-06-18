# V322-A4b2 command_explainer web request patch validation

## Purpose

Validates a narrow command_explainer patch for PowerShell Invoke-WebRequest / iwr with -OutFile.

## Summary

- total samples: 2
- pass: 2
- fail: 0

## Decision table

| sample | ok | unknown risk | first command | first group | first risk | next check | missing |
|---|---|---:|---|---|---|---|---|
| invoke_web_request_outfile | true | 0 | Invoke-WebRequest | 네트워크 다운로드 | caution | Test-Path <OutFile path>; git diff -- <OutFile path> |  |
| iwr_outfile_alias | true | 0 | Invoke-WebRequest | 네트워크 다운로드 | caution | Test-Path <OutFile path>; git diff -- <OutFile path> |  |

## First-step details

### invoke_web_request_outfile

- command: Invoke-WebRequest -Uri https://example.com -OutFile index.html
- first command: Invoke-WebRequest
- first group: 네트워크 다운로드
- first risk: caution
- meaning: 웹 주소로 HTTP 요청을 보내고 결과를 받아옵니다. -OutFile이 있으면 받은 내용을 파일로 저장합니다.
- file impact: -OutFile을 쓰면 지정한 파일이 새로 만들어지거나 기존 파일이 덮어써질 수 있습니다. 명령의 raw 줄에서 실제 -OutFile 경로를 확인하세요.
- next check: Test-Path <OutFile path>; git diff -- <OutFile path>

### iwr_outfile_alias

- command: iwr -Uri https://example.com/app.js -OutFile app.js
- first command: Invoke-WebRequest
- first group: 네트워크 다운로드
- first risk: caution
- meaning: 웹 주소로 HTTP 요청을 보내고 결과를 받아옵니다. -OutFile이 있으면 받은 내용을 파일로 저장합니다.
- file impact: -OutFile을 쓰면 지정한 파일이 새로 만들어지거나 기존 파일이 덮어써질 수 있습니다. 명령의 raw 줄에서 실제 -OutFile 경로를 확인하세요.
- next check: Test-Path <OutFile path>; git diff -- <OutFile path>

## Validation result

PASS: all targeted samples passed.
