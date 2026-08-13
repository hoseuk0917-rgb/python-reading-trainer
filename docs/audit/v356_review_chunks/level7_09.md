# V356 semantic review — Level 7 chunk 9

Cards 161-176 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY43_L07_vector_search_topk_001
- level: 7
- file: python_search_embedding_rag_flow_v43.json
- title: vector search top_k 읽기
- question_type: meaning_choice
- concepts: ["vector_search","top_k","nearest_neighbors"]
- reading_goal: 벡터 검색에서 top_k가 상위 몇 개 후보를 가져오는 값임을 이해한다.
- code:
```python
results = vector_db.search(query_vector, top_k=5)
```
- question: RAG 후보 검색에서 top_k=5의 의미는?
- answer: 가장 가까운 후보 5개를 가져온다
- explanation: top_k=5는 index가 사용하는 거리·유사도와 filter 기준에 따라 가장 높은 순위 후보를 최대 5개 요청한다. approximate index라면 전역적으로 정확한 최근접 5개가 아닐 수 있고 결과가 5개보다 적을 수도 있다. k는 retrieval recall, latency, reranking·context 예산으로 평가해 정한다.
- project_context: RAG에서 너무 적게 가져오면 근거가 빠지고, 너무 많이 가져오면 context가 지저분해질 수 있다.

## PY55_L07_clear_filter_001
- level: 7
- file: python_tag_filter_advanced_search_v55.json
- title: clear filter 읽기
- question_type: meaning_choice
- concepts: ["clear_filter","reset","UX"]
- reading_goal: 필터를 한 번에 초기화하는 clear filter UX를 이해한다.
- code:
```python
clearButton.onclick = () => {
  filterState = structuredClone(defaultFilterState);
  syncUrlAndRender(filterState);
};
```
- question: clear filter 버튼의 목적은?
- answer: 적용된 검색과 필터 조건을 기본값으로 되돌리기 위해
- explanation: default object의 새 copy로 state를 초기화해 이후 mutation이 기본값 자체를 바꾸지 않게 한다. state만 대입하고 끝내지 말고 URL, control value와 결과 rendering을 같은 값으로 동기화해야 화면과 실제 filter가 일치한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L07_filter_state_001
- level: 7
- file: python_tag_filter_advanced_search_v55.json
- title: filter state 읽기
- question_type: meaning_choice
- concepts: ["filter_state","UI_state","search"]
- reading_goal: 현재 선택된 검색/필터 조건을 상태로 저장하는 방식을 이해한다.
- code:
```python
filterState = {
  query: 'json',
  levelMin: 7,
  concept: 'validation'
}
```
- question: filter state에 들어갈 수 있는 값은?
- answer: 검색어, 최소 난이도, 선택한 concept
- explanation: filter state는 현재 어떤 필터 조건이 켜져 있는지 저장한 상태값이다. 상태가 명확해야 화면 표시와 검색 결과가 일관되게 움직인다. 필터 상태를 URL이나 저장소와 연결하면 새로고침 후에도 같은 검색 조건을 복원할 수 있다. 따라서 정답은 ‘검색어, 최소 난이도, 선택한 concept’이다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L07_multi_filter_001
- level: 7
- file: python_tag_filter_advanced_search_v55.json
- title: multi filter 읽기
- question_type: meaning_choice
- concepts: ["multi_filter","combined_filter","search"]
- reading_goal: 검색어, level, concept를 함께 적용하는 multi filter를 이해한다.
- code:
```python
filtered = cards
  .filter(matchQuery)
  .filter(matchLevel)
  .filter(matchConcept)
```
- question: multi filter가 필요한 이유는?
- answer: 여러 조건을 동시에 적용해 원하는 카드를 좁히기 위해
- explanation: 예를 들어 level 8 이상이면서 validation 개념이 들어간 카드만 볼 수 있다. multi filter는 여러 조건을 동시에 적용해 목록을 좁히는 기능이다. 태그, 난이도, 키워드 조건이 AND인지 OR인지 확인해야 결과를 이해할 수 있다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY47_L07_golden_file_001
- level: 7
- file: python_tests_regression_quality_gate_v47.json
- title: golden file 읽기
- question_type: meaning_choice
- concepts: ["golden_file","expected_output","comparison"]
- reading_goal: 정답 기준 파일과 실제 출력을 비교하는 golden file 테스트를 이해한다.
- code:
```python
expected = read('golden.json')
actual = build_output()
assert actual == expected
```
- question: golden file의 역할은?
- answer: 기대 출력의 기준값으로 실제 결과와 비교한다
- explanation: golden file은 의도적으로 승인한 기대 output의 exact 기준이다. 차이가 나면 regression일 수도 있고 올바른 요구사항 변경일 수도 있으므로 diff를 사람이 검토한 뒤 별도 절차로 golden을 갱신한다. 실행마다 바뀌는 timestamp·순서 같은 값은 normalize하지 않으면 불필요한 실패를 만든다.
- project_context: 카드 생성 결과나 manifest 출력 형식을 안정적으로 유지할 때 쓸 수 있다.

## PY47_L07_regression_test_001
- level: 7
- file: python_tests_regression_quality_gate_v47.json
- title: regression test 읽기
- question_type: meaning_choice
- concepts: ["regression_test","bug_prevention","repeat_check"]
- reading_goal: 예전에 되던 기능이 새 변경 후에도 계속 되는지 확인하는 회귀검증을 이해한다.
- code:
```python
before: 923 cards OK
after v47: old cards still OK + new cards OK
```
- question: regression test의 목적은?
- answer: 새 변경이 기존 정상 기능을 깨뜨리지 않았는지 확인한다
- explanation: regression test는 새 작업 때문에 기존 기능이 망가지지 않았는지 확인하는 검증이다. 카드 수, 파일 로딩, 정답 일관성처럼 이미 통과하던 기준을 다시 본다.
- project_context: v47을 추가해도 v1~v46 카드의 answer, concepts, side_card_ids가 여전히 정상이어야 한다.

## PY47_L07_smoke_test_001
- level: 7
- file: python_tests_regression_quality_gate_v47.json
- title: smoke test 읽기
- question_type: meaning_choice
- concepts: ["smoke_test","basic_check","quick_test"]
- reading_goal: 큰 검증 전에 앱이 최소한 켜지고 핵심 파일이 로드되는지 보는 smoke test를 이해한다.
- code:
```python
run server
request core files and expect 200
open index.html in a browser
verify main screen renders with no console errors
```
- question: smoke test에 가까운 것은?
- answer: 앱이 기본적으로 켜지고 핵심 파일이 로드되는지 빠르게 확인하는 것
- explanation: smoke test는 깊은 기능 검사 전에 핵심 경로가 기본적으로 작동하는지 빠르게 본다. 파일의 200 status만으로 JavaScript 실행과 rendering을 증명할 수 없으므로 기본 화면과 console error도 확인한다. 통과해도 모든 기능과 data 의미가 옳다는 보장은 아니다.
- project_context: run_local_server.ps1 실행 후 새 lesson JSON이 200으로 뜨는지 보는 단계다.

## PY24_L07_duplicate_id_check_001
- level: 7
- file: python_tests_validation_regression_v24.json
- title: 중복 ID 검사 코드 읽기
- question_type: meaning_choice
- concepts: ["if","for","validation","duplicate_id","set","quality"]
- reading_goal: 이미 본 id를 set에 넣고 중복을 찾는 검증 코드를 읽는다.
- code:
```python
seen = set()
duplicates = []
for card in cards:
    if card["id"] in seen:
        duplicates.append(card["id"])
    seen.add(card["id"])
```
- question: duplicates list에는 무엇이 기록되는가?
- answer: 첫 등장 뒤 다시 나온 각 card id
- explanation: seen에 이미 든 id가 다시 나오면 duplicates에 append한 뒤 seen에는 그대로 id를 넣는다. 같은 id가 세 번 나오면 두 번째와 세 번째 등장 때 각각 append되어 duplicates에도 두 번 들어간다. 중복된 고유 id 목록만 필요하면 duplicates도 set으로 만들 수 있다.
- project_context: 매번 보강 후 DUPLICATE IDS: OK를 확인하는 검증과 연결된다.

## PY24_L07_pytest_assert_001
- level: 7
- file: python_tests_validation_regression_v24.json
- title: pytest assert 기본 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","assert","test"]
- reading_goal: 함수 결과가 기대값과 같은지 검사하는 기본 테스트를 읽는다.
- code:
```python
def normalize(text):
    return text.strip().lower()

def test_normalize():
    assert normalize(" LiDAR ") == "lidar"
```
- question: assert 조건이 False이면 무슨 일이 일어나는가?
- answer: 테스트가 실패한다
- explanation: pytest는 test_ 함수 안의 assert가 실패하면 테스트 실패로 표시한다. pytest assert는 기대값과 실제값을 비교해 테스트 실패를 알려 준다. 실패 메시지를 읽을 때는 어떤 값이 예상과 달랐는지 먼저 확인해야 한다. 따라서 반환/호출 결과는 ‘테스트가 실패한다’이다.
- project_context: 정규화, ID 생성, side card 매칭 같은 작은 함수부터 검증할 수 있다.

## PY34_L07_regression_test_001
- level: 7
- file: python_tests_validation_regression_v34.json
- title: regression test 읽기
- question_type: meaning_choice
- concepts: ["regression_test","existing_feature","bug_prevention"]
- reading_goal: 새 변경이 기존 기능을 깨뜨리지 않았는지 확인하는 회귀 테스트를 이해한다.
- code:
```python
새 v34를 추가한 뒤에도:
v1 lesson 200
v20 lesson 200
v33 lesson 200
side_cards 200
```
- question: 이 확인이 regression test인 이유는?
- answer: 새 v34가 기존 v1~v33 로딩을 깨지 않았는지 보기 때문
- explanation: regression test는 새 변경 뒤에도 이미 보장하던 동작이 유지되는지 확인한다. 이 예시는 기존 lesson과 side_cards 요청이 계속 성공하는지를 보는 좁은 회귀 검사다. HTTP 200은 내용의 의미까지 검증하지 않으므로 기존 렌더링이나 퀴즈 동작에는 별도 테스트가 필요하다.
- project_context: v34 추가 후 v1~v34 전체 lesson 200을 보는 이유다.

## PY34_L07_validation_test_001
- level: 7
- file: python_tests_validation_regression_v34.json
- title: validation test 읽기
- question_type: meaning_choice
- concepts: ["validation","data_quality","test"]
- reading_goal: 데이터가 정해진 규칙을 만족하는지 검사하는 validation test를 이해한다.
- code:
```python
DUPLICATE IDS: OK
ANSWER NOT IN CHOICES: OK
BAD LEVELS: OK
```
- question: 이 검증 결과가 의미하는 것은?
- answer: 카드 데이터의 기본 규칙을 통과했다
- explanation: 중복 id, 정답/선택지 불일치, 잘못된 level 같은 데이터 품질 문제를 확인한다. validation test는 데이터 구조와 필수 조건이 깨지지 않았는지 확인하는 검사다. 앱 실행 전 JSON, 참조, 정답 형식을 먼저 점검하는 역할을 한다. 따라서 결과는 ‘카드 데이터의 기본 규칙을 통과했다’이다.
- project_context: 새 lesson을 추가할 때 매번 보는 핵심 품질 체크다.

## PY56_L07_bookmark_schema_001
- level: 7
- file: python_user_notes_bookmarks_v56.json
- title: bookmark schema 읽기
- question_type: meaning_choice
- concepts: ["bookmark_schema","card_id","data_model"]
- reading_goal: 북마크 목록을 card id 기준으로 저장하는 방식을 이해한다.
- code:
```python
bookmarks = ['PY55_L06_tag_filter_001', 'PY54_L07_touch_target_001']
```
- question: bookmark schema에서 card id를 쓰는 이유는?
- answer: 어떤 카드를 북마크했는지 안정적으로 찾기 위해
- explanation: bookmark schema는 북마크 정보를 어떤 카드 id와 함께 저장할지 정한 구조다. 제목은 바뀔 수 있지만 id는 안정적인 식별자로 쓰기 좋다. id를 기준으로 저장하면 제목을 다듬거나 번역해도 같은 카드와 북마크를 계속 연결할 수 있다. 따라서 정답은 ‘어떤 카드를 북마크했는지 안정적으로 찾기 위해’이다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L07_note_schema_001
- level: 7
- file: python_user_notes_bookmarks_v56.json
- title: note schema 읽기
- question_type: meaning_choice
- concepts: ["note_schema","localStorage","data_model"]
- reading_goal: 메모를 저장하기 위한 간단한 데이터 구조를 이해한다.
- code:
```python
note = {
  cardId: card.id,
  text: memo,
  schemaVersion: 1,
  updatedAt: new Date().toISOString()
}
```
- question: note schema에 들어갈 값은?
- answer: cardId, text, updatedAt 같은 메모 정보
- explanation: cardId, text, schemaVersion과 timezone-aware updatedAt을 저장하면 연결·migration·충돌 비교가 가능하다. createdAt과 device/user ID가 필요한 sync model도 있다. text 길이와 허용 형식을 검증하고 timestamp만으로 모든 동시 편집 충돌이 해결된다고 보지 않는다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L07_user_note_001
- level: 7
- file: python_user_notes_bookmarks_v56.json
- title: user note 읽기
- question_type: meaning_choice
- concepts: ["user_note","personal_note","learning_memory"]
- reading_goal: 사용자가 카드마다 자기만의 메모를 남기는 user note를 이해한다.
- code:
```python
notes[card.id] = '이 부분은 다시 복습하기'
```
- question: user note의 목적은?
- answer: 카드에 개인 학습 메모를 남기기 위해
- explanation: user note는 사용자가 카드에 직접 남기는 개인 메모다. 같은 카드라도 헷갈린 지점은 사람마다 다르므로 개인 기록이 학습에 도움된다. 개인 메모는 공통 해설과 별도로 사용자의 오답 이유나 기억할 점을 남기는 보조 학습 데이터가 된다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY35_L07_get_method_001
- level: 7
- file: python_web_http_api_flow_v35.json
- title: GET 요청 읽기
- question_type: meaning_choice
- concepts: ["GET","HTTP_method","read"]
- reading_goal: 서버에서 데이터를 가져오는 GET 요청을 이해한다.
- code:
```python
GET /data/lessons/python_web_http_api_flow_v35.json
```
- question: GET 요청의 일반적인 목적은?
- answer: 데이터나 파일을 가져오기
- explanation: GET은 서버의 리소스 표현을 조회할 때 쓰는 HTTP 메서드다. 쿼리 문자열로 조회 조건을 전달하는 경우가 많으며, 규약상 같은 요청을 반복해도 의도한 서버 상태가 바뀌지 않는 안전한 메서드로 구현해야 한다. 주소창 테스트는 인증·헤더가 필요 없는 단순 GET에만 적합하다.
- project_context: PWA가 lesson JSON 파일을 가져올 때 GET 요청이 사용된다.

## PY35_L07_post_method_001
- level: 7
- file: python_web_http_api_flow_v35.json
- title: POST 요청 읽기
- question_type: meaning_choice
- concepts: ["POST","HTTP_method","body"]
- reading_goal: 서버에 새 데이터나 요청 본문을 보내는 POST 요청을 이해한다.
- code:
```python
POST /api/search
Content-Type: application/json

{"query": "RAG"}
```
- question: POST 요청에서 body에 들어간 것은?
- answer: 검색어 query JSON
- explanation: POST method는 서버에 새 데이터나 처리 요청을 보낼 때 자주 쓰는 HTTP 방식이다. body에 JSON 같은 데이터를 담아 전달할 수 있다. 조회 중심의 GET과 달리 POST는 생성, 제출, 분석 요청처럼 본문이 필요한 작업에 자주 쓰인다. 따라서 정답은 ‘검색어 query JSON’이다.
- project_context: 나중에 FastAPI 검색 API에 질문을 보낼 때 자주 쓰는 방식이다.
