# V356 semantic review — Level 7 chunk 3

Cards 41-60 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY42_L07_pandas_dataframe_001
- level: 7
- file: python_data_processing_pandas_jsonl_v42.json
- title: pandas DataFrame 읽기
- question_type: meaning_choice
- concepts: ["import","print","pandas","DataFrame","table"]
- reading_goal: DataFrame을 행과 열이 있는 표 데이터 구조로 이해한다.
- code:
```python
import pandas as pd

df = pd.read_csv('nodes.tsv', sep='\t')
print(df.shape)
print(df.columns)
```
- question: df.shape가 알려주는 것은?
- answer: 행 수와 열 수
- explanation: DataFrame은 표처럼 다루는 데이터 구조이고 shape는 전체 크기를 빠르게 확인하게 해준다. pandas DataFrame은 행과 열로 된 표 데이터를 다루는 구조다. CSV를 읽은 뒤 필터링, 정렬, 집계 같은 처리를 할 때 자주 사용된다. 따라서 출력은 ‘행 수와 열 수’이다.
- project_context: 노드 후보, 엣지 후보, 제출 CSV, 평가 결과를 점검할 때 기본 확인값이다.

## PY42_L07_read_csv_sep_001
- level: 7
- file: python_data_processing_pandas_jsonl_v42.json
- title: read_csv sep 읽기
- question_type: meaning_choice
- concepts: ["read_csv","sep","TSV"]
- reading_goal: pandas에서 CSV와 TSV를 읽을 때 sep 인자를 이해한다.
- code:
```python
df_csv = pd.read_csv('items.csv')
df_tsv = pd.read_csv('audit.tsv', sep='\t')
```
- question: TSV를 pandas로 읽을 때 sep='\t'를 주는 이유는?
- answer: 열 구분자가 탭이기 때문이다
- explanation: read_csv의 sep 인자는 컬럼을 어떤 문자 기준으로 나눌지 알려준다. TSV는 탭 문자를 기준으로 나누므로 sep='\t'를 사용한다. 구분자를 잘못 지정하면 한 줄 전체가 하나의 컬럼으로 들어가거나 컬럼 수가 깨질 수 있다. 따라서 정답은 ‘열 구분자가 탭이기 때문이다’이다.
- project_context: KG 작업의 manifest.tsv, audit.tsv, mapping.tsv 파일을 읽을 때 자주 쓴다.

## PY29_L07_list_of_dict_001
- level: 7
- file: python_data_structures_json_v29.json
- title: list of dict 읽기
- question_type: meaning_choice
- concepts: ["print","list","dict","json","cards"]
- reading_goal: 여러 개의 카드 객체가 리스트 안에 들어 있는 구조를 읽는다.
- code:
```python
cards = [
    {"id": "c1", "level": 1, "title": "len 읽기"},
    {"id": "c2", "level": 2, "title": "dict 읽기"},
]

print(cards[0]["title"])
```
- question: 출력되는 값은?
- answer: len 읽기
- explanation: cards[0]은 첫 번째 dict이고, 그 안의 title 값을 꺼내므로 'len 읽기'가 출력된다. list of dict는 여러 개의 dict를 순서대로 담은 구조다. 카드 목록, 사용자 목록처럼 같은 필드를 가진 항목들을 반복 처리할 때 자주 쓰인다.
- project_context: lesson JSON은 카드 dict 여러 개가 리스트로 묶인 구조다.

## PY29_L07_nested_dict_001
- level: 7
- file: python_data_structures_json_v29.json
- title: nested dict 접근 읽기
- question_type: meaning_choice
- concepts: ["print","dict","nested","json"]
- reading_goal: dict 안에 dict가 들어 있는 중첩 구조에서 값을 꺼내는 법을 익힌다.
- code:
```python
item = {
    "id": "run_001",
    "stats": {
        "items_seen": 120,
        "items_written": 20
    }
}

print(item["stats"]["items_written"])
```
- question: 출력되는 값은?
- answer: 20
- explanation: 먼저 item['stats']로 내부 dict를 꺼내고, 다시 ['items_written'] 값을 읽는다. nested dict는 dict 안에 또 다른 dict가 들어 있는 구조다. 설정 파일이나 JSON 응답을 읽을 때 key를 단계별로 따라가며 값을 확인해야 한다. 따라서 출력은 ‘20’이다.
- project_context: run stats, progress, API 응답 같은 구조화 데이터를 읽는 기본이다.

## PY21_L07_parameterized_query_001
- level: 7
- file: python_database_sql_repository_v21.json
- title: 파라미터 바인딩 SQL 읽기
- question_type: meaning_choice
- concepts: ["sql","parameterized_query","security","sqlite"]
- reading_goal: 문자열 붙이기 대신 파라미터를 안전하게 넘기는 SQL 패턴을 읽는다.
- code:
```python
item_id = "item_001"
row = conn.execute(
    "SELECT title FROM items WHERE id = ?",
    (item_id,)
).fetchone()
```
- question: WHERE id = ?에서 ?의 의미는?
- answer: 나중에 안전하게 바인딩될 파라미터 자리
- explanation: ?는 SQL 값 한 칸을 위한 placeholder이고 (item_id,)의 trailing comma는 한 원소 tuple을 만든다. driver가 값을 SQL 문법과 분리해 bind하므로 문자열 이어 붙이기보다 injection 위험이 줄어든다. placeholder는 table명이나 column명 같은 identifier에는 쓸 수 없으므로 그런 동적 부분은 allowlist로 제한해야 한다.
- project_context: 검색어, item_id, user_id를 DB 쿼리에 넣을 때 기본 보안 패턴이다.

## PY21_L07_sqlite_connect_001
- level: 7
- file: python_database_sql_repository_v21.json
- title: sqlite3 연결과 조회 읽기
- question_type: meaning_choice
- concepts: ["import","print","sqlite","connect","execute","fetchall"]
- reading_goal: SQLite DB에 연결해 SELECT 결과를 가져오는 흐름을 읽는다.
- code:
```python
import sqlite3

conn = sqlite3.connect("app.db")
rows = conn.execute("SELECT id, title FROM items LIMIT 10").fetchall()
print(len(rows))
conn.close()
```
- question: fetchall()의 역할은?
- answer: 쿼리 결과 행들을 모두 가져온다
- explanation: fetchall은 아직 가져오지 않은 result row를 모두 list로 반환한다. 이 query에는 LIMIT 10이 있어 최대 열 행만 가져오지만, 제한 없는 큰 query에서는 메모리를 많이 쓸 수 있다. conn.close가 예외 때도 실행되게 하려면 with sqlite3.connect(...) as conn 같은 transaction context와 명시적 close 정책을 사용한다.
- project_context: 로컬 메타 DB나 검증용 SQLite를 읽는 기본 코드다.

## PY37_L07_foreign_key_001
- level: 7
- file: python_database_storage_crud_v37.json
- title: foreign key 읽기
- question_type: meaning_choice
- concepts: ["foreign_key","relationship","reference"]
- reading_goal: 다른 테이블의 row를 참조하는 foreign key를 이해한다.
- code:
```python
progress.card_id -> cards.id
wrong_answers.card_id -> cards.id
```
- question: progress.card_id -> cards.id의 의미는?
- answer: progress가 cards 테이블의 카드를 참조한다
- explanation: foreign key는 한 테이블의 column 값이 다른 테이블의 key를 참조한다는 제약이다. 실제 DB 스키마에 제약이 선언되고 활성화되어 있을 때 없는 cards.id를 가리키는 progress 입력을 막을 수 있다. 화살표만 적은 이 그림은 관계를 설명할 뿐 제약을 생성하는 SQL은 아니다.
- project_context: 오답/진행률이 어떤 카드에 대한 기록인지 연결할 때 필요하다.

## PY37_L07_primary_key_001
- level: 7
- file: python_database_storage_crud_v37.json
- title: primary key 읽기
- question_type: meaning_choice
- concepts: ["primary_key","id","unique"]
- reading_goal: 각 row를 고유하게 구분하는 primary key를 이해한다.
- code:
```python
cards table

id                    | title
PY37_L07_primary_key  | primary key 읽기
```
- question: primary key의 역할은?
- answer: 각 row를 고유하게 구분한다
- explanation: primary key는 테이블의 각 row를 고유하게 식별하는 한 개 이상의 column이다. 값은 중복될 수 없고 NULL도 허용되지 않는다. 조회나 관계 연결에서는 어떤 column 또는 복합 column이 이 역할을 하는지 확인한다.
- project_context: 카드 id가 중복되면 안 되는 이유와도 연결된다.

## PY17_L07_http_log_200_304_001
- level: 7
- file: python_debug_logs_cache_git_v17.json
- title: 서버 로그 200과 304 읽기
- question_type: meaning_choice
- concepts: ["http_status","200","304","cache"]
- reading_goal: 정적 서버 로그에서 200과 304의 차이를 읽는다.
- code:
```python
127.0.0.1 - - [29/May/2026] "GET /src/pwa/index.html HTTP/1.1" 200 -
127.0.0.1 - - [29/May/2026] "GET /src/pwa/style.css HTTP/1.1" 304 -
```
- question: 304는 무엇에 가까운가?
- answer: 브라우저 캐시를 써도 된다는 응답
- explanation: 200 OK는 요청이 성공했고 보통 응답 본문이 전송되었다는 뜻이다. 304 Not Modified는 브라우저가 If-None-Match나 If-Modified-Since 같은 조건부 요청을 보냈고 서버가 리소스가 바뀌지 않았다고 알려 본문을 다시 보내지 않은 경우다. 브라우저는 기존 캐시를 재사용할 수 있다. 둘 다 이 로그에서는 성공 흐름이지만 내용이 최신인지와 앱이 실행됐는지는 별도 확인이 필요하다.
- project_context: Loading... 문제를 볼 때 index/app.js/style.css가 실제로 새로 로딩됐는지 판단하는 데 쓰인다.

## PY17_L07_query_cache_bust_001
- level: 7
- file: python_debug_logs_cache_git_v17.json
- title: 쿼리스트링 캐시 깨기 읽기
- question_type: meaning_choice
- concepts: ["cache_bust","query_string","url","browser_cache"]
- reading_goal: URL 뒤의 ?v=...가 왜 캐시를 우회하는지 이해한다.
- code:
```python
app.js?v=20260529_v16
style.css?v=20260529_force1
index.html?sidefix=1
```
- question: ?v=20260529_v16을 붙이는 주된 이유는?
- answer: 브라우저가 이전 파일과 다른 URL로 인식하게 하려고
- explanation: 쿼리 값이 달라지면 전체 URL이 달라져 일반적인 브라우저와 CDN 캐시에서 별도 항목으로 취급될 수 있다. 그래서 배포한 JS나 CSS를 다시 요청하게 만드는 데 쓴다. 다만 서버·CDN·service worker가 쿼리를 무시하도록 설정될 수도 있어 항상 캐시를 우회한다고 보장할 수는 없다. 내용 버전이나 해시를 일관되게 관리해야 한다.
- project_context: 배포 뒤 오래된 정적 자산을 재사용하는 문제를 줄이는 버전 URL 패턴이다.

## PY28_L07_error_read_order_001
- level: 7
- file: python_debugging_error_routines_v28.json
- title: 에러 메시지 읽는 순서
- question_type: meaning_choice
- concepts: ["print","debugging","error_message","traceback"]
- reading_goal: 에러 로그에서 먼저 봐야 할 위치와 원인 문장을 구분한다.
- code:
```python
Traceback (most recent call last):
  File "main.py", line 12, in <module>
    run()
  File "main.py", line 8, in run
    print(user["name"])
KeyError: "name"
```
- question: 이 로그에서 직접적인 오류 이름은?
- answer: KeyError
- explanation: 맨 아래의 KeyError: 'name'이 직접적인 예외 종류와 원인을 알려준다. 줄번호는 원인 위치를 찾는 데 쓴다. 처음에는 오류 이름을 보고, 그다음 위쪽 traceback에서 어떤 코드 줄이 그 값을 찾으려 했는지 따라가면 된다.
- project_context: 붙여넣은 오류 로그를 볼 때 아래쪽 예외명과 위쪽 줄번호를 같이 보는 습관이다.

## PY28_L07_name_error_001
- level: 7
- file: python_debugging_error_routines_v28.json
- title: NameError 읽기
- question_type: meaning_choice
- concepts: ["comment","print","NameError","variable","debugging"]
- reading_goal: 정의되지 않은 변수나 오타 때문에 나는 오류를 이해한다.
- code:
```python
count = 3
print(cout)
# NameError: name "cout" is not defined
```
- question: 이 오류의 가장 가능성 높은 원인은?
- answer: count를 cout으로 잘못 쓴 오타
- explanation: NameError는 이름이 정의되지 않았다는 뜻이다. 변수명 오타나 import 누락이 흔한 원인이다. NameError는 아직 정의되지 않은 이름을 사용했을 때 나는 오류다. 변수명 오타, import 누락, 함수 안팎의 scope를 순서대로 확인해야 한다. 따라서 출력은 ‘count를 cout으로 잘못 쓴 오타’이다.
- project_context: 짧은 스크립트를 빠르게 고칠 때 가장 자주 만나는 기본 오류다.

## PY28_L07_type_error_001
- level: 7
- file: python_debugging_error_routines_v28.json
- title: TypeError 읽기
- question_type: meaning_choice
- concepts: ["comment","TypeError","type","string","integer"]
- reading_goal: 자료형이 맞지 않아 연산이 실패하는 상황을 읽는다.
- code:
```python
age = "20"
next_age = age + 1
# TypeError: can only concatenate str (not "int") to str
```
- question: 이 오류를 고치는 방향으로 가장 맞는 것은?
- answer: age를 int로 바꾼 뒤 더한다
- explanation: TypeError는 값의 타입이 맞지 않을 때 나는 오류다. 문자열과 숫자는 바로 더할 수 없으므로 int(age)처럼 필요한 타입으로 변환해야 한다. 오류 메시지에서 실제 타입과 기대 타입을 읽으면 어디서 변환이 필요한지 찾기 쉽다. 따라서 정답은 ‘age를 int로 바꾼 뒤 더한다’이다.
- project_context: CSV/JSON에서 읽은 숫자가 문자열로 들어오는 경우가 많아 중요하다.

## PY4_L07_auth_header_001
- level: 7
- file: python_deep_expansion_v4.json
- title: Authorization header 읽기
- question_type: meaning_choice
- concepts: ["api","auth","header","token"]
- reading_goal: API 토큰을 HTTP 헤더에 넣어 요청하는 코드를 읽는다.
- code:
```python
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(url, headers=headers)
```
- question: Bearer token은 어디에 들어가는가?
- answer: Authorization 헤더
- explanation: 이 코드는 Authorization 헤더 값을 'Bearer '와 token을 합친 문자열로 만든다. 서버는 자신의 인증 규칙에 따라 토큰의 유효성과 요청 권한을 검사하며, 토큰이 반드시 사람 사용자를 뜻하는 것은 아니다. Bearer 토큰은 노출되면 소지자가 사용할 수 있으므로 HTTPS로 전송하고 로그나 오류 메시지에 남기지 않아야 한다.
- project_context: GitHub API, OpenAI API, 내부 API 호출에서 자주 보인다.

## PY4_L07_request_timeout_001
- level: 7
- file: python_deep_expansion_v4.json
- title: requests timeout 읽기
- question_type: meaning_choice
- concepts: ["import","print","requests","timeout","api"]
- reading_goal: API 요청이 너무 오래 걸릴 때 중단시키는 옵션을 읽는다.
- code:
```python
import requests

response = requests.get("https://example.com", timeout=10)
print(response.status_code)
```
- question: requests.get(..., timeout=10)의 의미는?
- answer: 연결·응답 데이터 대기의 timeout을 10초로 둔다
- explanation: requests에서 숫자 하나인 timeout=10은 연결과 응답 데이터 읽기의 대기 제한에 사용되며, 제한을 넘기면 Timeout 예외가 날 수 있다. 이는 전체 응답 다운로드가 반드시 10초 안에 끝난다는 총 실행시간 보장은 아니다. 질문은 출력값이 아니라 옵션의 의미를 묻고 있으므로 정답은 ‘연결·응답 데이터 대기의 timeout을 10초로 둔다’이다.
- project_context: 하베스트와 외부 API 호출 안정성에 중요하다.

## PY4_L07_retry_loop_001
- level: 7
- file: python_deep_expansion_v4.json
- title: 간단 retry loop 읽기
- question_type: meaning_choice
- concepts: ["print","range","break","retry","for","try_except"]
- reading_goal: 실패하면 여러 번 다시 시도하는 구조를 읽는다.
- code:
```python
for attempt in range(3):
    try:
        result = call_api()
        break
    except Exception:
        print("retry", attempt)
```
- question: range(3)은 무엇을 의미하는가?
- answer: 최대 3번 시도한다
- explanation: range(3)은 attempt에 0, 1, 2를 넣어 call_api를 최대 세 번 시도하게 한다. 성공하면 break로 즉시 반복을 끝낸다. 하지만 이 예제는 모든 시도가 실패한 뒤 예외를 다시 내거나 fallback을 실행하지 않고, 지연·backoff도 없으며 모든 Exception을 넓게 잡는다. 실제 재시도 코드는 재시도 가능한 오류, 대기 정책, 최종 실패 처리를 함께 정해야 한다.
- project_context: 불안정한 네트워크/API/크롤링 작업에서 자주 쓰인다.

## PY23_L07_github_pages_url_001
- level: 7
- file: python_deploy_pwa_cache_storage_v23.json
- title: GitHub Pages 고정 URL 이해
- question_type: meaning_choice
- concepts: ["comment","github_pages","deploy","static_site","url"]
- reading_goal: GitHub Pages 주소는 고정이고 push 후 내용만 갱신된다는 것을 이해한다.
- code:
```python
# repository URL 예시
https://github.com/<account>/<repository>

# project Pages URL 예시
https://<account>.github.io/<repository>/
```
- question: 계정·저장소 이름과 Pages 설정을 유지한 채 새 commit을 배포하면 URL은?
- answer: 보통 같은 주소에서 배포 내용만 갱신된다
- explanation: 같은 account, repository와 Pages 설정을 유지하면 일반적인 새 배포는 같은 공개 URL의 내용을 갱신한다. repository나 account 이름, custom domain, Pages source 설정을 바꾸면 URL이 달라질 수 있다. project site에는 repository base path가 있으므로 root-relative와 relative asset 경로도 실제 배포 URL에서 검증해야 한다.
- project_context: 로컬 개발 URL과 공개 GitHub Pages project URL을 구분하는 카드다.

## PY23_L07_static_loading_order_001
- level: 7
- file: python_deploy_pwa_cache_storage_v23.json
- title: 정적 앱 로딩 순서 읽기
- question_type: meaning_choice
- concepts: ["html","css","javascript","static_loading"]
- reading_goal: 브라우저가 index.html에서 CSS와 JS를 따라 로딩하는 흐름을 읽는다.
- code:
```python
<link rel="stylesheet" href="style.css?v=20260529_force1" />
<script src="app.js?v=20260529_force1" defer></script>
```
- question: 이 HTML 조각에서 app.js는 어떻게 로딩되는가?
- answer: script 태그의 src 경로로 로딩된다
- explanation: link는 stylesheet를 요청하고 script의 src는 JavaScript를 요청한다. defer script는 HTML parsing과 병렬로 download되고 document parsing이 끝난 뒤 document 순서대로 실행되며 DOMContentLoaded보다 먼저 완료된다. stylesheet는 rendering을 막을 수 있고 defer script가 필요한 style 계산 때문에 기다릴 수도 있으므로 단순히 “초기 화면을 방해하지 않는다”라고 보장할 수는 없다.
- project_context: Loading...이 멈출 때 index는 열렸는지, app.js가 요청됐는지 보는 이유다.

## PY103_L07_absolute_relative_path_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: 절대경로와 상대경로 구분
- question_type: meaning_choice
- concepts: ["absolute_path","relative_path","path"]
- reading_goal: 두 경로 방식의 기준점 차이를 읽는다.
- code:
```python
D:\projects\python-reading-trainer\data\lessons
.\data\lessons
```
- question: 상대경로의 기준은 무엇인가?
- answer: 현재 작업 폴더
- explanation: 절대경로는 드라이브나 루트부터 위치를 적고, 상대경로는 현재 작업 폴더를 기준으로 해석된다. 자동화 명령을 실행할 때는 무조건 프로젝트 루트여야 하는 것이 아니라 그 스크립트가 기대하는 기준 폴더와 현재 위치가 같아야 한다. pwd나 Get-Location으로 기준을 확인하고, 필요하면 스크립트 파일 위치를 기준으로 절대경로를 만들어 실행 위치에 덜 의존하게 한다.
- project_context: JSON 파일 생성과 app.js 연결 검증에서 경로 실수를 줄이기 위한 카드다.

## PY103_L07_apt_update_install_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: apt update와 apt install 읽기
- question_type: meaning_choice
- concepts: ["apt","ubuntu","package_manager"]
- reading_goal: Ubuntu 시스템 패키지 설치 흐름을 이해한다.
- code:
```python
sudo apt update
sudo apt install tesseract-ocr
```
- question: apt install은 무엇을 설치하는 명령인가?
- answer: Ubuntu 시스템 패키지
- explanation: apt는 Ubuntu의 시스템 패키지 관리 도구다. apt update는 설치 가능한 패키지 목록을 갱신하고, apt install은 실제 패키지를 설치한다. OCR, PDF 이미지 추출, 시스템 라이브러리처럼 Python 바깥의 실행 도구가 필요할 때 apt가 등장할 수 있다. pip와 apt를 구분해야 설치 위치와 영향 범위를 정확히 이해할 수 있다. 또한 apt는 시스템 전체에 영향을 주므로 venv 안의 Python 패키지 설치와 구분해야 하며, 설치 뒤에는 실제 명령이 인식되는지까지 확인하는 습관이 필요하다.
- project_context: PDF/OCR 도구나 서버 패키지 설치에서 자주 등장한다.
