# V329-A0 real-world code sample audit

## Scope

This audit runs representative real-world code snippets through `window.CodeExplainerRules.analyze`.
It does not change app behavior. It identifies explanation gaps for V329 follow-up patches.

## Summary

- Total samples: 14
- Review-needed samples: 1
- Samples with generic step titles: 1
- Samples with unsupported items: 0

## Result table

| ID | Lang | Status | Steps | Warn | Unsupported | Generic | Missing expected |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| py_filter_users | python | OK | 6 | 0 | 0 | 0 | - |
| py_load_json | python | OK | 5 | 0 | 0 | 0 | - |
| py_sum_scores | python | OK | 5 | 0 | 0 | 0 | - |
| py_transform_names | python | OK | 5 | 0 | 0 | 0 | - |
| py_try_file_read | python | OK | 6 | 0 | 0 | 0 | - |
| ps_backup_script | powershell | OK | 7 | 1 | 0 | 0 | - |
| ps_git_commit | powershell | OK | 4 | 0 | 0 | 0 | - |
| ps_web_request | powershell | OK | 4 | 1 | 0 | 0 | - |
| ps_pipeline_filter | powershell | OK | 1 | 0 | 0 | 0 | - |
| js_dom_click | javascript | OK | 3 | 0 | 0 | 0 | - |
| js_fetch_json | javascript | OK | 4 | 0 | 0 | 0 | - |
| js_array_chain | javascript | OK | 4 | 0 | 0 | 0 | - |
| cf_worker_fetch | javascript | OK | 4 | 0 | 0 | 0 | - |
| java_loop_sum | java | REVIEW | 5 | 0 | 0 | 1 | - |

## Detailed findings

### py_filter_users — Python filter users

- Status: OK
- Note: A1/A3 대표 샘플. 초보자용 결과 설명이 떠야 하는 유형.
- Step titles: 함수 정의 / 변수에 값 저장 / 반복문 / 조건 검사 / 목록에 항목 추가 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내며 아래 코드를 반복합니다.
  - 4. 조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.

### py_load_json — Python load JSON file

- Status: OK
- Note: 파일/JSON loader 설명이 떠야 하는 유형.
- Step titles: 함수 정의 / 라이브러리 불러오기 / 파일 열기 / JSON 읽기 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 3. 파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.
  - 4. JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.

### py_sum_scores — Python sum scores

- Status: OK
- Note: A3-2에서 += 누적 더하기로 개선한 샘플.
- Step titles: 함수 정의 / 변수에 값 저장 / 반복문 / 누적 더하기 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내며 아래 코드를 반복합니다.
  - 4. 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다.

### py_transform_names — Python transform list

- Status: OK
- Note: 목록 변환 유형. name.strip().lower() 설명 품질 확인 필요.
- Step titles: 함수 정의 / 변수에 값 저장 / 반복문 / 목록에 항목 추가 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내며 아래 코드를 반복합니다.
  - 4. 리스트 끝에 새 값을 하나 추가합니다. 반복문 안에서 결과를 모을 때 자주 씁니다.

### py_try_file_read — Python try except file read

- Status: OK
- Note: 예외 처리 흐름이 충분히 설명되는지 확인.
- Step titles: 함수 정의 / 예외 처리 시작 / 파일 열기 / 값 돌려주기 / 예외 잡기 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.
  - 3. 파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.
  - 4. 함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.

### ps_backup_script — PowerShell backup script

- Status: OK
- Note: PowerShell 백업/압축/상태확인 대표 샘플.
- Step titles: 작업 폴더 이동 / 시간값을 변수에 저장 / 변수에 값 저장 / 파이프라인 처리 / 파일/폴더 복사 / ZIP 압축 생성 / Git 변경 상태 확인
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.
  - 2. $stamp 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.
  - 3. $backupRoot 변수에 값을 넣습니다. 이후 줄에서 $backupRoot을 쓰면 이 값을 다시 사용합니다.
  - 4. 앞 명령의 결과를 뒤 명령으로 넘기며 필터링, 반복, 선택, 정렬, 집계, 표 표시 같은 처리를 이어서 수행합니다.

### ps_git_commit — PowerShell git add commit

- Status: OK
- Note: git add/commit/push 세부 설명 품질 확인.
- Step titles: Git 변경 상태 확인 / Git 커밋 준비 / Git 커밋 생성 / 원격 저장소로 업로드
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.
  - 2. 수정한 파일을 다음 커밋에 포함하도록 준비합니다.
  - 3. 준비된 변경사항을 하나의 기록으로 저장합니다.
  - 4. 로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.

### ps_web_request — PowerShell Invoke-WebRequest

- Status: OK
- Note: 웹 요청/다운로드 설명 품질 확인.
- Step titles: 변수에 값 저장 / 변수에 값 저장 / 웹 요청 실행 / 파일 내용 읽기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. $Url 변수에 값을 넣습니다. 이후 줄에서 $Url을 쓰면 이 값을 다시 사용합니다.
  - 2. $Out 변수에 값을 넣습니다. 이후 줄에서 $Out을 쓰면 이 값을 다시 사용합니다.
  - 3. URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.
  - 4. 텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.

### ps_pipeline_filter — PowerShell pipeline filter

- Status: OK
- Note: 파이프라인/필터/선택 설명 품질 확인.
- Step titles: 파이프라인 처리
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 앞 명령의 결과를 뒤 명령으로 넘기며 필터링, 반복, 선택, 정렬, 집계, 표 표시 같은 처리를 이어서 수행합니다.

### js_dom_click — JavaScript DOM click event

- Status: OK
- Note: DOM 선택/이벤트 콜백 설명 품질 확인.
- Step titles: 화면 요소 찾기 / 이벤트 처리 함수 정의 / 화면/콘솔에 출력
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. HTML 화면에서 특정 요소를 찾아 값을 읽거나 내용을 바꾸기 위해 준비합니다.
  - 2. 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수 정의를 연결합니다.
  - 3. 개발자 콘솔에 값이나 오류 메시지를 출력합니다. 디버깅, 스모크 테스트 실패 원인 확인, 상태 보고에 쓰입니다.

### js_fetch_json — JavaScript fetch JSON

- Status: OK
- Note: fetch/json/async 설명 품질 확인.
- Step titles: 함수 정의 / 비동기 외부 요청 / 응답 JSON 변환 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 호출해서 실행할 코드 묶음을 만듭니다.
  - 2. fetch 요청이 끝날 때까지 기다립니다. 네트워크 실패와 응답 상태 확인이 필요합니다.
  - 3. fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다.
  - 4. 함수 안에서 만든 값이나 계산 결과를 호출한 곳으로 돌려줍니다.

### js_array_chain — JavaScript array filter map reduce

- Status: OK
- Note: 배열 체이닝 설명 품질 확인.
- Step titles: 변수에 값 저장 / 배열 필터링 / 배열 변환 / 문자열/배열 메서드 처리
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다.
  - 2. 배열에서 조건에 맞는 항목만 골라 새 배열을 만듭니다. 어떤 조건으로 제외하거나 남기는지 확인해야 합니다.
  - 3. 배열의 각 항목을 다른 값으로 바꿔 새 배열을 만듭니다. 원본 항목에서 어떤 값만 뽑거나 계산하는지 확인합니다.
  - 4. 문자열이나 배열에 메서드를 이어 붙여 변환, 필터링, 정렬, 결합 같은 처리를 합니다. 앞 단계의 결과가 다음 메서드로 넘어갑니다.

### cf_worker_fetch — Cloudflare Worker fetch handler

- Status: OK
- Note: Cloudflare Worker request/env/KV 설명 품질 확인.
- Step titles: Worker 진입 객체 정의 / 요청 처리 함수 / 비동기 작업 대기 / 응답 반환
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. Cloudflare Worker가 요청을 받을 때 사용할 기본 객체를 정의합니다.
  - 2. 사용자가 Worker 주소로 접속하면 이 함수가 실행됩니다. request는 들어온 요청, env는 DB/KV/R2 같은 연결값입니다.
  - 3. Promise가 끝날 때까지 기다린 뒤 다음 줄을 실행합니다. 실패하면 catch로 넘어갈 수 있습니다.
  - 4. 문자열, 상태 코드, 헤더 등을 담은 HTTP 응답을 돌려줍니다.

### java_loop_sum — Java loop sum

- Status: REVIEW
- Note: Java 함수/반복/누적 설명 품질 확인.
- Step titles: 메서드 정의 / 변수 선언과 값 저장 / 반복 실행 / Java 코드 실행 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다.
  - 2. 변수의 종류를 정하고 값을 넣습니다.
  - 3. 정해진 조건이나 횟수에 따라 중괄호 안 코드를 반복합니다.
  - 4. 이 줄은 Java 코드입니다. 중괄호 구조에 따라 실행 흐름이 정해집니다.

## Next V329 candidates

- Improve samples marked REVIEW first.
- Reduce generic step titles for JavaScript and Cloudflare Worker patterns.
- Add targeted rules only when a sample proves the gap.
- Keep V328 beginner-first UX and collapsed advanced details unchanged.
