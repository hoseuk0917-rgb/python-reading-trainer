# V356 semantic review — Level 6 chunk 8

Cards 141-160 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY8_L06_git_push_success_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: git push 성공 로그 읽기
- question_type: meaning_choice
- concepts: ["git","push","log"]
- reading_goal: push가 원격 main 브랜치에 반영된 로그를 읽는다.
- code:
```python
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To https://github.com/user/repo.git
   abc123..def456  main -> main
```
- question: push 결과의 main -> main은 무엇을 의미하는가?
- answer: 로컬 main이 원격 main에 반영됨
- explanation: 화살표 왼쪽 main은 보낸 로컬 ref, 오른쪽 main은 갱신된 원격 ref를 나타낸다. abc123..def456은 원격 main이 앞 커밋에서 뒤 커밋으로 이동했음을 보여 준다. 이는 해당 브랜치 갱신의 성공을 뜻할 뿐 저장소의 모든 브랜치·태그가 서로 같다는 뜻은 아니다. 다른 환경은 자동으로 바뀌지 않으며 fetch나 pull 같은 별도 동작이 필요하다.
- project_context: 푸시 성공 여부를 로그에서 판단할 수 있게 한다.

## PY8_L06_http_304_log_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: HTTP 304 로그 읽기
- question_type: meaning_choice
- concepts: ["http","status_code","cache"]
- reading_goal: 304가 캐시된 리소스 재사용과 관련된 상태임을 읽는다.
- code:
```python
::1 - - [28/May/2026 22:29:11] "GET /data/lessons/file.json HTTP/1.1" 304 -
```
- question: 304는 보통 무엇을 의미하는가?
- answer: 변경 없음, 캐시 사용 가능
- explanation: 304 Not Modified는 조건부 요청의 ETag나 수정 시각 같은 검증자를 기준으로, 클라이언트가 가진 표현을 계속 사용할 수 있다고 서버가 알린 응답이다. 보통 응답 본문을 다시 보내지 않아 브라우저가 캐시된 본문을 재사용한다. 이 상태만으로 서버 디스크의 파일이 절대 바뀌지 않았다고 단정할 수는 없다. 새 내용을 기대했다면 요청 URL, 검증자·캐시 헤더, 서비스 워커 동작을 함께 확인해야 한다.
- project_context: 로컬 http.server 로그와 GitHub Pages 반영 확인에 중요하다.

## PY8_L06_safe_int_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: safe_int 방어 함수 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","try_except","int","default"]
- reading_goal: 숫자로 바꿀 수 없으면 기본값을 쓰는 방어 코드를 읽는다.
- code:
```python
def safe_int(value, default=0):
    try:
        return int(value)
    except ValueError:
        return default

print(safe_int("abc", 10))
```
- question: 출력은?
- answer: 10
- explanation: int('abc')는 ValueError를 던지고 이 except가 그 오류를 잡아 전달된 default 10을 반환하므로 출력은 10이다. 그러나 이 함수가 모든 변환 실패를 막는 것은 아니다. 예를 들어 int(None)은 TypeError를 던져 현재 except에 잡히지 않으며, 무조건 기본값으로 바꾸면 잘못된 입력 원인을 숨길 수도 있다. 허용할 입력 타입과 잡을 예외를 정하고 필요하면 오류를 기록해야 한다.
- project_context: 사용자 입력/CSV 값/환경변수 파싱에서 자주 쓰인다.

## PY40_L06_refactoring_001
- level: 6
- file: python_refactoring_maintainability_v40.json
- title: refactoring 읽기
- question_type: meaning_choice
- concepts: ["refactoring","maintainability","behavior_preserving_change"]
- reading_goal: 동작은 유지하면서 코드 구조를 개선하는 refactoring을 이해한다.
- code:
```python
before:
  same behavior, messy code

after:
  same behavior, cleaner code
```
- question: refactoring의 핵심은?
- answer: 동작은 유지하고 코드 구조를 개선한다
- explanation: refactoring은 외부에서 관찰되는 동작을 의도적으로 바꾸지 않으면서 내부 구조를 개선하는 변경이다. '더 깨끗하다'는 목표를 구체적인 이름, 중복, 의존성 문제로 설명해야 한다. 테스트는 기존 동작 보존에 대한 증거를 주지만 테스트하지 않은 동작까지 같음을 보장하지는 않는다.
- project_context: 카드가 800장 이상이 되면 기능 추가만큼 구조 정리가 중요해진다.

## PY124_L06_REGEX_SAFE_FLOW_001
- level: 6
- file: python_regex_beginner_v124_a1.json
- title: 정규식 추출 안전 흐름
- question_type: multiple_choice
- concepts: ["re.findall","re.search","group","None check"]
- reading_goal: 정규식으로 여러 값을 찾고, 없는 경우를 처리하고, 필요한 부분만 캡처하는 전체 흐름을 읽는다.
- code:
```python
ids = re.findall(r'ID-(\d+)', text)
m = re.search(r'email: (\S+)', text)
email = m.group(1) if m else ''
```
- question: 이 코드의 전체 흐름으로 알맞은 것은?
- answer: 정규식으로 ID 목록을 찾고 이메일은 있을 때만 꺼낸다
- explanation: findall()은 여러 ID를 리스트로 찾고, search()는 이메일 패턴 하나를 찾는다. m이 있을 때만 group(1)을 읽으면 None 오류를 피할 수 있다.
- project_context: 로그나 텍스트에서 필요한 값들을 안전하게 추출하는 종합 카드다.

## PY124_L06_RE_MATCH_START_001
- level: 6
- file: python_regex_beginner_v124_a1.json
- title: re.match는 시작부터 확인
- question_type: multiple_choice
- concepts: ["re.match","start","^"]
- reading_goal: re.match()가 문자열 중간이 아니라 시작 위치부터 패턴이 맞는지 확인하는 함수임을 읽는다.
- code:
```python
ok = re.match(r'^ID-\d+', 'ID-2048 ready')
```
- question: re.match()의 특징으로 알맞은 것은?
- answer: 문자열 시작 부분부터 패턴이 맞는지 본다
- explanation: re.match()는 문자열 시작 위치에서 패턴이 맞는지 본다. re.search()처럼 중간부터 찾지는 않지만 뒤에 남는 문자는 허용할 수 있다. 입력 전체가 형식과 정확히 일치해야 한다면 re.fullmatch()를 사용한다.
- project_context: 입력 문자열이 정해진 형식으로 시작하는지 검사하는 카드다.

## PY121_L06_RESPONSE_JSON_AFTER_STATUS_001
- level: 6
- file: python_requests_api_beginner_v121_a1.json
- title: 상태 확인 후 response.json 읽기
- question_type: multiple_choice
- concepts: ["response.json","raise_for_status","JSON"]
- reading_goal: response.json()은 응답이 실제 JSON일 때 Python dict/list로 바꾸므로 상태 확인 뒤 쓰는 흐름을 읽는다.
- code:
```python
response = requests.get(url, timeout=10)
response.raise_for_status()
data = response.json()
```
- question: 이 코드에서 response.json()을 호출하기 전에 raise_for_status()를 둔 이유는?
- answer: 실패 상태를 먼저 드러내기 위해
- explanation: 먼저 raise_for_status()를 호출하면 4xx·5xx HTTP 실패를 HTTPError로 드러낸 뒤 성공 응답의 본문만 JSON으로 해석할 수 있다. 성공 상태라도 본문이 유효한 JSON이라는 보장은 없으므로 JSON 디코딩 실패는 별도로 처리한다.
- project_context: API 응답을 데이터로 바꾸기 전에 실패 상태를 먼저 확인하는 실전 흐름이다.

## PY121_L06_SAFE_API_FLOW_001
- level: 6
- file: python_requests_api_beginner_v121_a1.json
- title: 안전한 API 호출 흐름 읽기
- question_type: multiple_choice
- concepts: ["try_except","print","timeout","raise_for_status","response.json","RequestException"]
- reading_goal: timeout, raise_for_status, response.json, RequestException을 연결한 기본 API 호출 흐름을 읽는다.
- code:
```python
try:
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
except requests.RequestException as e:
    print('request failed:', e)
```
- question: 이 코드의 전체 흐름으로 가장 알맞은 것은?
- answer: 시간 제한을 두고 실패 상태와 요청 오류를 처리한다
- explanation: timeout은 무기한 대기를 막고, raise_for_status()는 4xx·5xx를 예외로 바꾸며, RequestException은 requests가 낸 요청 예외를 처리한다. 실제 도구라면 JSON 형식과 필수 필드도 검증하고, 오류를 출력만 한 뒤 data를 사용하지 않도록 실패 경로를 명확히 끝내야 한다.
- project_context: 실제 API 연동 코드에서 기본 안전장치를 한 번에 읽는 카드다.

## PY131_L06_AFTER_CLONE_SETUP_FLOW_001
- level: 6
- file: python_requirements_dependency_repro_v131_a1.json
- title: clone 후 환경 복구 순서
- question_type: multiple_choice
- concepts: ["git clone","venv","requirements.txt","setup flow"]
- reading_goal: clone 이후 프로젝트 실행 준비가 저장소 받기와 가상환경/의존성 설치 순서로 이어짐을 이해한다.
- code:
```python
git clone <repo-url>
cd project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```
- question: GitHub에서 프로젝트를 clone한 뒤 실행 준비 순서로 가장 알맞은 것은?
- answer: clone, 폴더 이동, venv 생성, 활성화, requirements 설치
- explanation: 다른 컴퓨터에서 프로젝트를 받으면 먼저 저장소를 받고, 프로젝트 폴더로 들어가 가상환경을 만든 뒤 requirements.txt로 필요한 패키지를 설치한다.
- project_context: 

## PY131_L06_VENV_REQUIREMENTS_REPRO_001
- level: 6
- file: python_requirements_dependency_repro_v131_a1.json
- title: venv와 requirements 재현
- question_type: multiple_choice
- concepts: ["venv","requirements.txt","activate","reproducible environment"]
- reading_goal: 가상환경 생성, 활성화, requirements 설치가 실행환경 재현 흐름으로 연결됨을 이해한다.
- code:
```python
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```
- question: 새 컴퓨터에서 프로젝트 실행환경을 재현하는 흐름으로 가장 알맞은 것은?
- answer: venv를 만들고 활성화한 뒤 requirements를 설치한다
- explanation: 가상환경을 만들고 그 환경의 pip로 requirements를 설치하면 프로젝트별 패키지를 분리할 수 있다. 동일성 수준을 높이려면 README에 지원 Python 버전과 운영체제 조건도 기록하고, 의존성 버전도 충분히 고정해야 한다.
- project_context: 

## PY46_L06_checkpoint_file_001
- level: 6
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: checkpoint file 읽기
- question_type: meaning_choice
- concepts: ["checkpoint","state_file","progress"]
- reading_goal: 작업 진행 상태를 파일로 남기는 checkpoint 개념을 이해한다.
- code:
```python
checkpoint.json
{
  "last_done": "shard_0042",
  "updated_at": "2026-05-31"
}
```
- question: checkpoint file의 역할은?
- answer: 어디까지 작업했는지 기록한다
- explanation: checkpoint는 재시작에 필요한 progress와 입력·code version을 내구성 있게 기록한다. last_done 하나는 작업이 고정 순서로 완료될 때만 안전하며 병렬 또는 순서 변경에서는 아직 안 끝난 shard를 건너뛸 수 있다. 그런 경우 완료 ID 집합이나 shard별 상태를 쓰고 atomic하게 갱신한다.
- project_context: shard 범위, 완료 개수, 마지막 처리 id를 남기면 장애 후 복구가 쉬워진다.

## PY46_L06_resume_safe_pipeline_001
- level: 6
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: resume-safe pipeline 읽기
- question_type: meaning_choice
- concepts: ["if","for","continue","resume_safe","pipeline","restart"]
- reading_goal: 중간에 멈춰도 이어서 다시 실행할 수 있는 파이프라인 구조를 이해한다.
- code:
```python
for shard in shards:
    if is_done(shard):
        continue
    run_shard(shard)
```
- question: resume-safe pipeline의 핵심은?
- answer: 이미 끝난 작업은 건너뛰고 남은 작업만 이어서 실행하는 것
- explanation: is_done이 성공 결과와 원자적으로 기록된 신뢰할 수 있는 상태일 때 완료 shard를 건너뛰고 나머지를 실행한다. resume-safe가 되려면 run_shard가 중단 경계에서 재실행돼도 안전해야 하고, checkpoint 손상·version 불일치·병렬 완료 순서를 처리해야 한다. 단순 file 존재 검사는 충분하지 않다.
- project_context: KG node_pass shard나 대용량 카드 생성 작업처럼 오래 걸리는 작업에 필요하다.

## PY43_L06_query_normalization_001
- level: 6
- file: python_search_embedding_rag_flow_v43.json
- title: query normalization 읽기
- question_type: meaning_choice
- concepts: ["query_normalization","normalization","search"]
- reading_goal: 검색 전 질문 문자열을 정리하는 이유를 이해한다.
- code:
```python
query = query.strip().lower()
query = normalize_spaces(query)
```
- question: query.strip().lower()의 목적에 가까운 것은?
- answer: 검색어의 불필요한 공백과 대소문자 차이를 줄인다
- explanation: strip()은 양끝 공백을 제거하고 lower()는 대문자를 소문자로 바꾼 뒤, normalize_spaces가 내부 공백을 정리한다. 자연어의 대소문자 차이를 줄이는 데 유용하지만 Python, US처럼 case가 의미를 가지거나 정확한 ID를 찾는 검색에서는 원문을 보존하거나 field별 normalization 규칙을 써야 한다.
- project_context: 문서 제목, 노드명, 질문 텍스트를 비교할 때 normalize_id나 slug 처리와 연결된다.

## PY43_L06_search_pipeline_001
- level: 6
- file: python_search_embedding_rag_flow_v43.json
- title: search pipeline 읽기
- question_type: meaning_choice
- concepts: ["search_pipeline","query","retrieval"]
- reading_goal: 검색 요청이 여러 단계를 지나 결과가 되는 흐름을 읽는다.
- code:
```python
query
  -> normalize
  -> retrieve candidates
  -> rank
  -> return results
```
- question: search pipeline의 핵심 의미는?
- answer: 검색어가 여러 처리 단계를 거쳐 결과가 되는 흐름
- explanation: 검색은 보통 query 정리, 후보 찾기, 순위 매기기, 결과 반환 단계로 나뉜다. search pipeline은 입력 질의가 검색 조건으로 바뀌고 후보 결과가 정렬되는 전체 흐름이다. 검색 전처리, 필터, 랭킹 기준을 나누어 보면 된다.
- project_context: KG/RAG 앱에서 질문이 들어오면 바로 답하는 것이 아니라 먼저 관련 근거를 찾는다.

## PY55_L06_level_filter_001
- level: 6
- file: python_tag_filter_advanced_search_v55.json
- title: level filter 읽기
- question_type: meaning_choice
- concepts: ["level_filter","difficulty_filter","learning_ux"]
- reading_goal: 난이도 level 기준으로 카드를 거르는 필터를 이해한다.
- code:
```python
filtered = cards.filter(card => card.level >= 8)
```
- question: level filter의 역할은?
- answer: 원하는 난이도 범위의 카드만 보여준다
- explanation: 이 조건은 level이 8 이상인 card만 보여 주는 최소 난이도 filter다. 범위 filter라고 부르려면 level <= max 조건도 필요하다. level 누락이나 숫자가 아닌 값을 validation하고, 숫자 level이 실제 학습 난이도를 완벽히 나타낸다고 가정하지 않는다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L06_tag_filter_001
- level: 6
- file: python_tag_filter_advanced_search_v55.json
- title: tag filter 읽기
- question_type: meaning_choice
- concepts: ["tag_filter","concept_filter","search"]
- reading_goal: 카드의 concepts나 태그로 원하는 카드만 골라보는 tag filter를 이해한다.
- code:
```python
filtered = cards.filter(card =>
  (card.concepts ?? []).includes('validation')
)
```
- question: tag filter의 목적은?
- answer: 특정 개념이나 태그가 붙은 카드만 골라보기 위해
- explanation: concepts가 없을 수 있는 card는 빈 배열로 다뤄 runtime error를 피하고, 배열에 validation과 정확히 같은 tag가 있는 card만 고른다. tag의 대소문자·별칭·hierarchy를 지원하려면 저장 단계에서 canonical ID로 normalize해야 한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY47_L06_integration_test_001
- level: 6
- file: python_tests_regression_quality_gate_v47.json
- title: integration test 읽기
- question_type: meaning_choice
- concepts: ["integration_test","module_connection","end_to_end_part"]
- reading_goal: 여러 모듈이 함께 연결될 때 정상 동작하는지 확인하는 테스트를 이해한다.
- code:
```python
load app.js
  -> read lesson files
  -> validate cards
```
- question: integration test가 보는 것은?
- answer: 여러 구성요소가 연결됐을 때의 동작
- explanation: unit test가 작은 조각을 본다면 integration test는 조각들이 연결된 흐름을 본다. integration test는 여러 모듈이 함께 동작하는 흐름을 확인하는 테스트다. 개별 함수는 맞아도 연결 과정에서 깨지는 문제를 잡는 데 필요하다.
- project_context: app.js의 lessonFiles와 실제 JSON 파일들이 함께 맞는지 확인하는 검증이 이에 가깝다.

## PY47_L06_unit_test_001
- level: 6
- file: python_tests_regression_quality_gate_v47.json
- title: unit test 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","unit_test","function_test","small_test"]
- reading_goal: 작은 함수 하나를 따로 검증하는 unit test를 이해한다.
- code:
```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
```
- question: unit test의 핵심은?
- answer: 작은 함수나 로직 하나를 독립적으로 확인한다
- explanation: unit test는 작은 함수나 로직을 가능한 한 독립적으로 검사한다. 이 pytest 스타일 test에서 실제값 add(2, 3)와 기대값 5가 다르면 실패한다. 일반 Python을 -O로 실행하면 assert가 제거될 수 있으므로 pytest 같은 test runner로 실행한다.
- project_context: 카드 검증 함수, JSON 파서, id 중복 검사 같은 작은 로직에 적용할 수 있다.

## PY34_L06_smoke_test_001
- level: 6
- file: python_tests_validation_regression_v34.json
- title: smoke test 읽기
- question_type: meaning_choice
- concepts: ["smoke_test","basic_check","validation"]
- reading_goal: 큰 기능 검증 전 앱이 기본적으로 켜지는지 확인하는 smoke test를 이해한다.
- code:
```python
.\run_local_server.ps1

GET /src/pwa/index.html 200
GET /src/pwa/app.js 200
GET /src/pwa/style.css 200
BROWSER: main screen rendered
CONSOLE ERRORS: 0
```
- question: smoke test의 목적은?
- answer: 앱이 기본적으로 뜨는지 빠르게 확인한다
- explanation: smoke test는 세부 기능을 깊게 검사하기 전에 핵심 경로가 기본적으로 동작하는지 빠르게 확인하는 1차 검사다. 정적 파일의 HTTP 200만으로 JavaScript 실행과 화면 렌더링까지 증명되지는 않으므로, 여기서는 기본 화면과 브라우저 오류도 함께 확인한다. 통과해도 모든 기능이 맞다는 뜻은 아니다.
- project_context: 로컬 서버에서 index, app.js, style.css가 200인지 보는 것이 대표적인 smoke test다.

## PY56_L06_bookmark_001
- level: 6
- file: python_user_notes_bookmarks_v56.json
- title: bookmark 읽기
- question_type: meaning_choice
- concepts: ["bookmark","learning_ux","save_for_later"]
- reading_goal: 다시 보고 싶은 카드를 표시해두는 bookmark 개념을 이해한다.
- code:
```python
bookmarkedCardIds.add(card.id)
```
- question: bookmark의 목적은?
- answer: 다시 보고 싶은 카드를 표시해두기 위해
- explanation: bookmark는 사용자가 중요한 카드를 표시해 나중에 다시 찾을 수 있게 하는 기능이다. 카드가 많아질수록 개인 복습 목록을 만드는 데 유용하다. 북마크 상태는 카드 id와 함께 저장해야 앱을 다시 열어도 같은 카드를 찾아 표시할 수 있다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.
