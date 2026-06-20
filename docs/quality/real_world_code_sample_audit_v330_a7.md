# V330-A1 expanded real-world sample audit baseline

## Scope

This audit runs representative real-world code snippets through `window.CodeExplainerRules.analyze`.
It does not change app behavior. It extends the V329-A2 audit baseline from 31 samples to 50 samples.

## Summary

- Total samples: 50
- Review-needed samples: 0
- Samples with generic step titles: 0
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
| java_loop_sum | java | OK | 5 | 0 | 0 | 0 | - |
| py_list_comprehension | python | OK | 4 | 0 | 0 | 0 | - |
| py_dict_update | python | OK | 4 | 0 | 0 | 0 | - |
| py_pathlib_glob | python | OK | 4 | 0 | 0 | 0 | - |
| py_requests_error_handling | python | OK | 5 | 0 | 0 | 0 | - |
| py_subprocess_run | python | OK | 4 | 1 | 0 | 0 | - |
| ps_remove_item_danger | powershell | OK | 2 | 1 | 0 | 0 | - |
| ps_git_clean_reset | powershell | OK | 2 | 2 | 0 | 0 | - |
| ps_foreach_object | powershell | OK | 1 | 0 | 0 | 0 | - |
| js_fetch_try_catch | javascript | OK | 7 | 0 | 0 | 0 | - |
| js_async_event_handler | javascript | OK | 3 | 0 | 0 | 0 | - |
| js_local_storage | javascript | OK | 3 | 0 | 0 | 0 | - |
| java_stream_collect | java | OK | 5 | 0 | 0 | 0 | - |
| java_try_catch_read | java | OK | 6 | 0 | 0 | 0 | - |
| java_map_put_get | java | OK | 3 | 0 | 0 | 0 | - |
| config_package_json | auto | OK | 4 | 0 | 0 | 0 | - |
| config_wrangler_toml | toml | OK | 5 | 0 | 0 | 0 | - |
| config_github_actions | auto | OK | 8 | 0 | 0 | 0 | - |
| html_basic_form | html | OK | 4 | 0 | 0 | 0 | - |
| html_image_link | html | OK | 3 | 0 | 0 | 0 | - |
| css_flex_card | css | OK | 4 | 0 | 0 | 0 | - |
| css_media_query | css | OK | 3 | 0 | 0 | 0 | - |
| sql_select_group | sql | OK | 5 | 0 | 0 | 0 | - |
| sql_join_users_orders | sql | OK | 4 | 0 | 0 | 0 | - |
| yaml_github_actions_matrix | yaml | OK | 12 | 0 | 0 | 0 | - |
| yaml_docker_compose | yaml | OK | 7 | 0 | 0 | 0 | - |
| dockerfile_node_build | dockerfile | OK | 6 | 0 | 0 | 0 | - |
| dockerfile_python_fastapi | dockerfile | OK | 6 | 1 | 0 | 0 | - |
| json_tsconfig | json | OK | 4 | 0 | 0 | 0 | - |
| json_vscode_settings | json | OK | 3 | 0 | 0 | 0 | - |
| cf_worker_post_json | javascript | OK | 5 | 0 | 0 | 0 | - |
| cf_worker_route_path | javascript | OK | 6 | 0 | 0 | 0 | - |
| py_fastapi_route | python | OK | 5 | 0 | 0 | 0 | - |
| py_flask_route | python | OK | 5 | 0 | 0 | 0 | - |
| py_pandas_groupby | python | OK | 4 | 0 | 0 | 0 | - |
| py_numpy_mean | python | OK | 3 | 0 | 0 | 0 | - |
| js_node_read_file | javascript | OK | 3 | 0 | 0 | 0 | - |

## Detailed findings

### py_filter_users — Python filter users

- Status: OK
- Note: A1/A3 대표 샘플. 초보자용 결과 설명이 떠야 하는 유형.
- Step titles: 함수 정의 / 변수에 값 저장 / for 반복문 실행 / 조건 검사 / 목록에 항목 추가 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.
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
- Step titles: 함수 정의 / 변수에 값 저장 / for 반복문 실행 / 누적 더하기 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.
  - 4. 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다.

### py_transform_names — Python transform list

- Status: OK
- Note: 목록 변환 유형. name.strip().lower() 설명 품질 확인 필요.
- Step titles: 함수 정의 / 변수에 값 저장 / for 반복문 실행 / 목록에 항목 추가 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.
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
  - 2. 수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.
  - 3. 준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.
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
  - 1. 나중에 호출해서 실행할 코드 묶음을 만듭니다. async가 붙으면 함수 안에서 await로 비동기 작업을 기다릴 수 있습니다.
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

- Status: OK
- Note: Java 함수/반복/누적 설명 품질 확인.
- Step titles: 메서드 정의 / 변수 선언과 값 저장 / 반복 실행 / 누적 더하기 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다.
  - 2. 변수의 종류를 정하고 값을 넣습니다.
  - 3. 정해진 조건이나 횟수에 따라 중괄호 안 코드를 반복합니다.
  - 4. 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다.

### py_list_comprehension — Python list comprehension filter transform

- Status: OK
- Note: 한 줄 리스트 컴프리헨션 안의 반복/조건/변환을 충분히 설명하는지 확인.
- Step titles: 함수 정의 / 값 돌려주기 / 반복문 / 조건 검사
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.
  - 3. 리스트 컴프리헨션 안의 for 부분은 원본 목록에서 값을 하나씩 꺼내 결과 리스트를 만드는 반복 흐름입니다.
  - 4. 리스트 컴프리헨션 안의 if 부분은 조건에 맞는 항목만 결과 리스트에 포함하게 거르는 역할을 합니다.

### py_dict_update — Python dict update

- Status: OK
- Note: 딕셔너리 복사와 update 갱신 설명 품질 확인.
- Step titles: 함수 정의 / 변수에 값 저장 / 자료구조 확장/갱신 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 2. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 3. 리스트나 딕셔너리에 여러 값을 추가하거나 기존 값을 갱신합니다.
  - 4. 함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.

### py_pathlib_glob — Python pathlib glob

- Status: OK
- Note: Path.glob 파일 검색 흐름 설명 품질 확인.
- Step titles: 라이브러리 불러오기 / 함수 정의 / 파일 목록 검색 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 3. 폴더 안의 파일 목록을 패턴이나 반복으로 찾습니다. 처리 대상이 너무 넓지 않은지 확인해야 합니다.
  - 4. 찾은 파일 목록을 함수 밖으로 돌려줍니다. 호출한 쪽에서는 이 반환값을 받아서 후속 처리나 반복에 사용할 수 있습니다.

### py_requests_error_handling — Python requests error handling

- Status: OK
- Note: requests 요청, 상태 확인, JSON 변환 설명 품질 확인.
- Step titles: 라이브러리 불러오기 / 함수 정의 / HTTP 요청 / HTTP 오류 확인 / 응답 JSON 변환
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 3. 웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.
  - 4. API 응답이 실패 상태 코드이면 예외를 발생시켜 문제를 조기에 드러냅니다.

### py_subprocess_run — Python subprocess run

- Status: OK
- Note: Python에서 외부 명령을 실행하는 흐름 설명 품질 확인.
- Step titles: 라이브러리 불러오기 / 함수 정의 / 외부 프로그램 실행 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.
  - 3. Python 코드에서 다른 명령어나 프로그램을 실행합니다. 인자와 check=True 여부를 확인해야 합니다.
  - 4. 함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.

### ps_remove_item_danger — PowerShell Remove-Item danger

- Status: OK
- Note: Remove-Item -Recurse -Force 위험도와 삭제 대상 설명 확인.
- Step titles: 변수에 값 저장 / 파일/폴더 삭제
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. $Target 변수에 값을 넣습니다. 이후 줄에서 $Target을 쓰면 이 값을 다시 사용합니다.
  - 2. 지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.

### ps_git_clean_reset — PowerShell git clean reset

- Status: OK
- Note: 되돌리기/삭제형 Git 명령 위험 설명 확인.
- Step titles: 변경사항 강제 되돌리기 / 추적되지 않는 파일 삭제
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.
  - 2. Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.

### ps_foreach_object — PowerShell ForEach-Object pipeline

- Status: OK
- Note: 한 줄 파이프라인 안의 ForEach-Object를 별도 반복 처리로 잡는지 확인.
- Step titles: 각 항목 반복 처리
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.

### js_fetch_try_catch — JavaScript fetch try catch

- Status: OK
- Note: try/catch 안 fetch와 JSON 변환 설명 품질 확인.
- Step titles: 함수 정의 / 오류 대비 시작 / 비동기 외부 요청 / 응답 JSON 변환 / 오류 처리 / 화면/콘솔에 출력 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 호출해서 실행할 코드 묶음을 만듭니다. async가 붙으면 함수 안에서 await로 비동기 작업을 기다릴 수 있습니다.
  - 2. 아래 코드에서 오류가 나면 catch/finally로 넘어가 처리할 수 있게 준비합니다.
  - 3. fetch 요청이 끝날 때까지 기다립니다. 네트워크 실패와 응답 상태 확인이 필요합니다.
  - 4. fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다.

### js_async_event_handler — JavaScript async event handler

- Status: OK
- Note: 한 줄 DOM 선택 + 이벤트 연결 + async 콜백을 충분히 잡는지 확인.
- Step titles: 화면 요소 찾기 / 이벤트 처리 함수 정의 / 비동기 작업 대기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. HTML 화면에서 특정 요소를 찾아 값을 읽거나 내용을 바꾸기 위해 준비합니다.
  - 2. 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수를 화면 요소에 연결합니다. async 콜백이면 내부에서 await로 비동기 작업을 기다릴 수 있습니다.
  - 3. Promise가 끝날 때까지 기다린 뒤 다음 줄을 실행합니다. 실패하면 catch로 넘어갈 수 있습니다.

### js_local_storage — JavaScript localStorage

- Status: OK
- Note: localStorage 저장/읽기 설명 품질 확인.
- Step titles: 브라우저 저장소 사용 / 브라우저 저장소 사용 / 변수에 값 저장
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다.
  - 2. 현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다.
  - 3. 브라우저 저장소에서 꺼낸 값을 const, let, var 같은 변수 이름에 담습니다. 이후 코드에서 이 이름으로 저장된 값을 다시 사용할 수 있습니다.

### java_stream_collect — Java stream filter map collect

- Status: OK
- Note: Java Stream 체인 설명 품질 확인.
- Step titles: 메서드 정의 / 스트림 처리 시작 / 스트림 필터링 / 스트림 변환 / 스트림 결과 모으기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다.
  - 2. 컬렉션 데이터를 filter/map/collect 같은 연속 처리 흐름으로 다루기 시작합니다.
  - 3. 조건에 맞는 항목만 남깁니다. 조건식이 실제 의도와 맞는지 확인해야 합니다.
  - 4. 각 항목을 다른 형태의 값으로 바꿉니다.

### java_try_catch_read — Java try catch read

- Status: OK
- Note: Java try/catch 파일 읽기 흐름 설명 품질 확인.
- Step titles: 메서드 정의 / 오류 대비 시작 / 파일/경로 처리 / 입출력 예외 처리 / 오류 처리 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다.
  - 2. 아래 코드를 실행하다가 예외가 생기면 catch/finally 구간에서 처리할 수 있게 준비합니다.
  - 3. Java NIO로 파일 경로를 만들거나 파일을 읽고 씁니다. 삭제/이동은 대상 경로를 확인해야 합니다.
  - 4. 파일 읽기/쓰기나 네트워크 입출력 중 발생할 수 있는 IOException을 처리합니다. 실패 시 사용자에게 어떤 메시지를 보여줄지 확인해야 합니다.

### java_map_put_get — Java Map put get

- Status: OK
- Note: Map 생성, put 저장, get 조회 설명 품질 확인.
- Step titles: 컬렉션/맵 만들기 / 맵에 값 저장 / 변수 선언과 값 저장
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 여러 값을 담는 List, Map, Set 같은 자료구조를 준비합니다.
  - 2. Map 구조에 key와 value를 저장합니다. 같은 key가 있으면 값이 바뀔 수 있습니다.
  - 3. 변수의 종류를 정하고 값을 넣습니다.

### config_package_json — package.json scripts

- Status: OK
- Note: package.json 자동 감지와 scripts 설명 품질 확인.
- Step titles: 패키지 이름 설정 / 패키지 버전 설정 / npm 스크립트 목록 / npm 스크립트 정의
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. package.json에서 이 Node/npm 프로젝트의 이름을 정합니다.
  - 2. package.json에서 현재 패키지의 버전 번호를 정합니다.
  - 3. npm run build 같은 명령으로 실행할 스크립트들을 모아 둔 영역입니다.
  - 4. 터미널에서 npm run 뒤에 붙여 실행할 작업을 정의합니다.

### config_wrangler_toml — wrangler.toml bindings

- Status: OK
- Note: wrangler.toml D1 바인딩 설명 품질 확인.
- Step titles: TOML 키-값 설정 / TOML 키-값 설정 / Cloudflare D1 설정 / Cloudflare binding 이름 설정 / Cloudflare 리소스 이름 설정
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 왼쪽 키에 오른쪽 값을 넣는 TOML 설정입니다.
  - 2. 왼쪽 키에 오른쪽 값을 넣는 TOML 설정입니다.
  - 3. wrangler.toml에서 Cloudflare D1 데이터베이스 바인딩 묶음을 시작합니다. binding 이름과 database_name이 코드의 env.DB 사용과 맞는지 확인합니다.
  - 4. Worker 코드에서 env.DB, env.ASSETS처럼 접근할 바인딩 이름을 설정합니다. 코드에서 쓰는 이름과 정확히 일치해야 합니다.

### config_github_actions — GitHub Actions workflow

- Status: OK
- Note: GitHub Actions YAML 자동 감지와 CI 단계 설명 품질 확인.
- Step titles: 워크플로 이름 / 실행 조건 설정 / 작업 묶음 / 액션 옵션 설정 / 실행 환경 선택 / 작업 단계 목록 / GitHub Action 사용 / 쉘 명령 실행
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. GitHub Actions 화면에 표시될 자동화 작업 이름입니다.
  - 2. push, pull_request 같은 어떤 사건에서 자동화를 실행할지 정합니다.
  - 3. 하나 이상의 job을 모아 정의하는 영역입니다. 각 job은 어떤 환경에서 어떤 steps를 순서대로 실행할지 담습니다.
  - 4. 앞에서 사용한 action이나 job에 필요한 옵션을 지정합니다.

### html_basic_form — HTML basic form

- Status: OK
- Note: HTML form/input/button 구조 설명 가능 여부 확인.
- Step titles: 입력 폼 정의 / 입력 칸 정의 / 버튼 정의 / HTML 영역 닫기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 사용자가 입력한 값을 제출할 수 있는 form 영역을 만듭니다. action, method, id 같은 속성을 확인합니다.
  - 2. 사용자가 글자, 이메일, 체크박스 같은 값을 넣는 입력 칸을 만듭니다. type, name, required 속성을 확인합니다.
  - 3. 사용자가 클릭할 수 있는 버튼을 만듭니다. form 안에서는 type이 submit인지 button인지 확인해야 합니다.
  - 4. 앞에서 시작한 HTML 태그 영역을 닫습니다. 열린 태그와 닫는 태그가 맞는지 확인합니다.

### html_image_link — HTML image link

- Status: OK
- Note: HTML 링크와 이미지 태그 설명 가능 여부 확인.
- Step titles: 링크 정의 / 이미지 표시 / HTML 영역 닫기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 다른 페이지나 위치로 이동하는 링크를 만듭니다. href 주소와 새 창 여부를 확인합니다.
  - 2. 화면에 이미지를 보여줍니다. src 경로와 alt 대체 텍스트가 있는지 확인합니다.
  - 3. 앞에서 시작한 HTML 태그 영역을 닫습니다. 열린 태그와 닫는 태그가 맞는지 확인합니다.

### css_flex_card — CSS flex card

- Status: OK
- Note: CSS selector/property/flex layout 설명 가능 여부 확인.
- Step titles: CSS 선택자 블록 시작 / Flex 레이아웃 설정 / 요소 간격 설정 / 안쪽 여백 설정
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 어떤 HTML 요소에 스타일을 적용할지 선택하고, 중괄호 안에 스타일 규칙을 작성합니다.
  - 2. 자식 요소들을 가로/세로 방향으로 유연하게 배치하는 flex 레이아웃을 켭니다.
  - 3. flex나 grid 안의 자식 요소 사이 간격을 정합니다.
  - 4. 요소 테두리 안쪽의 여백을 정해서 내용이 가장자리에 붙지 않게 합니다.

### css_media_query — CSS media query

- Status: OK
- Note: 반응형 CSS media query 설명 가능 여부 확인.
- Step titles: 반응형 조건 시작 / CSS 선택자 블록 시작 / Grid 행열 크기 설정
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 화면 너비나 기기 조건에 따라 다른 CSS 규칙을 적용하는 구간을 시작합니다.
  - 2. 어떤 HTML 요소에 스타일을 적용할지 선택하고, 중괄호 안에 스타일 규칙을 작성합니다.
  - 3. grid 레이아웃에서 열이나 행의 개수와 크기 비율을 정합니다.

### sql_select_group — SQL select group by

- Status: OK
- Note: SQL SELECT/WHERE/GROUP BY/ORDER BY 설명 가능 여부 확인.
- Step titles: 조회할 컬럼 선택 / 기준 테이블 선택 / 조회 조건 필터 / 그룹으로 묶기 / 결과 정렬
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 데이터베이스에서 어떤 컬럼 값을 가져올지 정합니다. COUNT 같은 집계 함수가 있으면 여러 행을 묶어 요약한 값을 함께 조회합니다. 별칭 AS가 있으면 결과 컬럼 이름을 바꿉니다.
  - 2. 조회의 기준이 되는 테이블을 지정합니다. 이 테이블에서 행을 읽기 시작합니다.
  - 3. 조건에 맞는 행만 남깁니다. 상태값, 날짜, id 같은 기준으로 결과를 줄입니다.
  - 4. 같은 값을 가진 행들을 하나의 그룹으로 묶습니다. COUNT, SUM, AVG 같은 집계와 함께 자주 씁니다.

### sql_join_users_orders — SQL join users orders

- Status: OK
- Note: SQL JOIN 조건과 필터 설명 가능 여부 확인.
- Step titles: 조회할 컬럼 선택 / 기준 테이블 선택 / SQL 테이블 조인 / 조회 조건 필터
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 데이터베이스에서 어떤 컬럼 값을 가져올지 정합니다. 별칭 AS가 있으면 결과 컬럼 이름을 바꿉니다.
  - 2. 조회의 기준이 되는 테이블을 지정합니다. 이 테이블에서 행을 읽기 시작합니다.
  - 3. 다른 테이블을 함께 붙여서 조회합니다. JOIN 조건이 맞는 행끼리 연결되므로, 어떤 기준 컬럼으로 이어지는지 확인해야 합니다.
  - 4. 조건에 맞는 행만 남깁니다. 상태값, 날짜, id 같은 기준으로 결과를 줄입니다.

### yaml_github_actions_matrix — GitHub Actions matrix workflow

- Status: OK
- Note: GitHub Actions matrix/with 구조 설명 가능 여부 확인.
- Step titles: YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 목록 항목 / YAML 설정 키 / YAML 설정 키
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 2. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 3. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 4. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.

### yaml_docker_compose — Docker Compose service

- Status: OK
- Note: Docker Compose service/build/ports/environment 설명 가능 여부 확인.
- Step titles: YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 설정 키 / YAML 목록 항목 / YAML 설정 키 / YAML 설정 키
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 2. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 3. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.
  - 4. 들여쓰기 아래에 묶일 설정 이름을 정의합니다.

### dockerfile_node_build — Dockerfile Node build

- Status: OK
- Note: Dockerfile FROM/WORKDIR/COPY/RUN/CMD 설명 가능 여부 확인.
- Step titles: 베이스 이미지 선택 / 작업 폴더 설정 / 파일 복사 / 이미지 빌드 중 명령 실행 / 파일 복사 / 컨테이너 시작 명령
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 컨테이너를 어떤 기본 이미지에서 시작할지 정합니다. Python/Node 같은 실행 환경의 출발점입니다.
  - 2. 이후 RUN, COPY, CMD 명령이 실행될 컨테이너 안의 기본 폴더를 정합니다.
  - 3. 로컬 파일이나 폴더를 컨테이너 이미지 안으로 넣습니다. 불필요한 파일이 들어가지 않게 .dockerignore도 확인해야 합니다.
  - 4. 이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다.

### dockerfile_python_fastapi — Dockerfile Python FastAPI

- Status: OK
- Note: Python API 서버용 Dockerfile 설명 가능 여부 확인.
- Step titles: 베이스 이미지 선택 / 작업 폴더 설정 / 파일 복사 / 이미지 빌드 중 명령 실행 / 파일 복사 / 컨테이너 시작 명령
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 컨테이너를 어떤 기본 이미지에서 시작할지 정합니다. Python/Node 같은 실행 환경의 출발점입니다.
  - 2. 이후 RUN, COPY, CMD 명령이 실행될 컨테이너 안의 기본 폴더를 정합니다.
  - 3. 로컬 파일이나 폴더를 컨테이너 이미지 안으로 넣습니다. 불필요한 파일이 들어가지 않게 .dockerignore도 확인해야 합니다.
  - 4. 이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다.

### json_tsconfig — tsconfig JSON

- Status: OK
- Note: JSON config 중첩 객체와 TypeScript 설정 설명 가능 여부 확인.
- Step titles: JSON 설정 그룹 시작 / 문자열 설정값 / 문자열 설정값 / 불리언 설정값
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. compilerOptions 설정 묶음을 시작합니다. 아래 들여쓰기된 값들이 이 그룹에 속합니다.
  - 2. target 설정에 문자열 값을 지정합니다. 따옴표 안의 값이 실제 옵션 이름입니다.
  - 3. module 설정에 문자열 값을 지정합니다. 따옴표 안의 값이 실제 옵션 이름입니다.
  - 4. strict 설정을 켜거나 끕니다. true는 사용, false는 사용하지 않음을 뜻합니다.

### json_vscode_settings — VS Code settings JSON

- Status: OK
- Note: 점 포함 JSON key와 nested boolean 설정 설명 가능 여부 확인.
- Step titles: 불리언 설정값 / JSON 설정 그룹 시작 / 불리언 설정값
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. editor.formatOnSave 설정을 켜거나 끕니다. true는 사용, false는 사용하지 않음을 뜻합니다.
  - 2. files.exclude 설정 묶음을 시작합니다. 아래 들여쓰기된 값들이 이 그룹에 속합니다.
  - 3. dist 설정을 켜거나 끕니다. true는 사용, false는 사용하지 않음을 뜻합니다.

### cf_worker_post_json — Cloudflare Worker POST JSON

- Status: OK
- Note: Worker request.json, D1 prepare/bind/run, Response.json 설명 가능 여부 확인.
- Step titles: Worker 진입 객체 정의 / 요청 처리 함수 / 요청 본문 JSON 읽기 / D1 SQL 준비 / JSON 응답 반환
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. Cloudflare Worker가 요청을 받을 때 사용할 기본 객체를 정의합니다.
  - 2. 사용자가 Worker 주소로 접속하면 이 함수가 실행됩니다. request는 들어온 요청, env는 DB/KV/R2 같은 연결값입니다.
  - 3. 사용자가 보낸 요청 본문을 JSON으로 읽습니다. 잘못된 JSON이 들어올 수 있으므로 실제 서비스에서는 예외 처리가 필요합니다.
  - 4. Cloudflare D1에 보낼 SQL 문장을 준비합니다. SELECT는 조회, INSERT는 추가, UPDATE는 수정, DELETE는 삭제입니다.

### cf_worker_route_path — Cloudflare Worker route path

- Status: OK
- Note: Worker URL/pathname 조건 분기와 404 응답 설명 가능 여부 확인.
- Step titles: Worker 진입 객체 정의 / 외부 요청 / 요청 주소 분석 / 경로 조건 확인 / 응답 반환 / 응답 반환
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. Cloudflare Worker가 요청을 받을 때 사용할 기본 객체를 정의합니다.
  - 2. 다른 URL이나 API에 네트워크 요청을 보냅니다.
  - 3. 들어온 요청 주소를 URL 객체로 바꿔서 pathname이나 query를 확인할 수 있게 합니다.
  - 4. 사용자가 어떤 주소로 들어왔는지 보고 분기합니다.

### py_fastapi_route — FastAPI route

- Status: OK
- Note: FastAPI 앱 생성, 데코레이터 라우트, path parameter 설명 가능 여부 확인.
- Step titles: FastAPI 기능 불러오기 / FastAPI 앱 생성 / FastAPI 라우트 연결 / 함수 정의 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.
  - 2. HTTP 요청을 받을 API 서버 앱 객체를 만듭니다. 이후 @app.get, @app.post 같은 라우트가 이 앱에 연결됩니다.
  - 3. 특정 HTTP 메서드와 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. response_model, status_code, 경로 파라미터가 있는지 확인해야 합니다.
  - 4. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.

### py_flask_route — Flask route

- Status: OK
- Note: Flask 앱 생성, route 데코레이터, JSON 응답 설명 가능 여부 확인.
- Step titles: 라이브러리 불러오기 / 객체 생성 결과 저장 / Flask 라우트 등록 / 함수 정의 / 값 돌려주기
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. Flask 클래스로 새 객체를 만들고, 그 결과를 app 변수에 저장합니다. 이때 클래스의 __init__ 메서드가 객체의 초기값을 설정할 수 있습니다.
  - 3. Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다.
  - 4. 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.

### py_pandas_groupby — pandas groupby mean

- Status: OK
- Note: pandas read_csv, boolean filtering, groupby mean 설명 가능 여부 확인.
- Step titles: 라이브러리 불러오기 / pandas 파일 읽기 / 변수에 값 저장 / pandas 그룹 집계
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.
  - 3. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.
  - 4. 특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.

### py_numpy_mean — numpy array mean

- Status: OK
- Note: numpy import, array 생성, mean 계산 설명 가능 여부 확인.
- Step titles: 라이브러리 불러오기 / NumPy 배열 만들기 / 변수에 값 저장
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.
  - 2. 리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.
  - 3. 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.

### js_node_read_file — Node fs read file

- Status: OK
- Note: Node ESM import, await readFile, 문자열 slice 설명 가능 여부 확인.
- Step titles: 모듈 불러오기 / 미등록 함수 결과 저장 / 화면/콘솔에 출력
- Missing expected titles: -
- Unsupported conflicts: -
- First explanations:
  - 1. 다른 JavaScript 파일이나 패키지에서 필요한 기능을 가져옵니다.
  - 2. readFile 함수 호출 결과를 변수에 저장합니다. 이 코드 조각 안에서는 함수 정의가 보이지 않으므로 외부 정의나 오타 여부를 확인해야 합니다.
  - 3. 개발자 콘솔에 값이나 오류 메시지를 출력합니다. 디버깅, 스모크 테스트 실패 원인 확인, 상태 보고에 쓰입니다.

## Next V330 candidates

- Improve samples marked REVIEW first.
- Reduce generic step titles for JavaScript and Cloudflare Worker patterns.
- Add targeted rules only when a sample proves the gap.
- Keep V328 beginner-first UX and collapsed advanced details unchanged.
