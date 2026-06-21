# V334-A4 General PowerShell Pipeline Synthesis Audit

Purpose: verify that non-preloaded PowerShell pipeline examples get synthesis explanations.

## Summary

| metric | value |
|---|---:|
| samples | 2 |
| failed | 0 |

## ps_log_error_pipeline

- title: PowerShell log ERROR search pipeline
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions__logs
- OK mentions__log
- OK mentions_ERROR
- OK mentions_Path
- OK mentions_LineNumber
- OK mentions_Line
- OK mentions_파이프라인
- OK has_steps
- OK no_generic_unsupported_action
- OK no_unknown_actions
- OK no_known_pipeline_unsupported

### Output

요약: .\logs 폴더에서 *.log 파일을 찾고, 그 안에서 'ERROR' 문자가 들어간 줄만 찾습니다. 마지막에는 Path, LineNumber, Line 열만 골라 보여줍니다.

단계:
1. .\logs에서 파일 찾기
   - Get-ChildItem이 .\logs 위치의 파일을 찾습니다. -Filter "*.log" 조건이 있으면 *.log에 맞는 파일만 대상으로 삼습니다.
2. 'ERROR'가 들어간 줄 찾기
   - Select-String "ERROR" 명령은 앞 단계에서 넘어온 파일 내용 중 'ERROR' 문자가 들어간 줄만 찾습니다.
3. 보여줄 열 선택
   - Select-Object Path, LineNumber, Line 명령은 결과에서 Path, LineNumber, Line 정보만 골라 보여줍니다.
4. 파이프라인으로 순서대로 전달
   - | 기호는 왼쪽 명령의 결과를 오른쪽 명령으로 넘깁니다. 그래서 파일 찾기 → 문자열 검색 → 필요한 열만 보기 순서로 처리됩니다.

## ps_large_file_pipeline

- title: PowerShell large file filter pipeline
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions__src
- OK mentions_Length
- OK mentions_100000
- OK mentions_FullName
- OK mentions_파이프라인
- OK mentions_하위_폴더
- OK has_steps
- OK no_generic_unsupported_action
- OK no_unknown_actions
- OK no_known_pipeline_unsupported

### Output

요약: .\src 폴더에서 파일을 찾고, Length가 100000보다 큰 항목만 남긴 뒤, FullName, Length 열만 골라 보여줍니다.

단계:
1. .\src에서 파일 찾기
   - Get-ChildItem이 .\src 위치의 항목을 찾습니다. -Recurse가 있으면 하위 폴더까지 포함하고, -File이 있으면 파일만 대상으로 봅니다.
2. Length가 100000보다 큰 항목만 남기기
   - Where-Object는 앞 단계 결과 중 조건에 맞는 항목만 통과시킵니다. 여기서는 $_.Length -gt 100000 조건을 봅니다.
3. 보여줄 열 선택
   - Select-Object FullName, Length 명령은 결과에서 FullName, Length 정보만 골라 보여줍니다.
4. 파이프라인으로 순서대로 전달
   - | 기호 때문에 파일 찾기 → 조건 필터링 → 필요한 열만 보기 순서로 처리됩니다.

