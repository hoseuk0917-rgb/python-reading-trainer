# V356 semantic review — Level 10 chunk 14

Cards 261-274 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY34_L10_answer_choices_test_001
- level: 10
- file: python_tests_validation_regression_v34.json
- title: answer in choices 검증
- question_type: meaning_choice
- concepts: ["if","answer_in_choices","quiz_validation","data_quality"]
- reading_goal: 퀴즈 정답이 선택지 안에 들어 있는지 확인하는 검증을 이해한다.
- code:
```python
if card["answer"] not in card["choices"]:
    raise AssertionError(f"bad answer: {card['id']}")
```
- question: 이 검증이 필요한 가장 큰 이유는?
- answer: 정답이 선택지에 없으면 사용자가 맞힐 수 없기 때문
- explanation: 정답이 choices 안에 없으면 사용자는 정답을 선택할 수 없다. 단순히 메시지만 출력하면 자동 검증이 성공 코드로 끝날 수 있으므로, 이 코드는 AssertionError를 발생시켜 테스트와 CI가 실패를 감지하게 한다.
- project_context: v29/v31에서 실제로 이 검증이 문제를 잡아냈다.

## PY34_L10_lessonfiles_loading_test_001
- level: 10
- file: python_tests_validation_regression_v34.json
- title: lessonFiles 로딩 검증
- question_type: meaning_choice
- concepts: ["lessonFiles","loading_test","HTTP_200"]
- reading_goal: app.js에 연결된 lesson 파일들이 실제로 200으로 로딩되는지 확인하는 검증을 이해한다.
- code:
```python
GET /data/lessons/python_git_github_workflow_v33.json 200
GET /data/lessons/python_tests_validation_regression_v34.json 200
```
- question: HTTP 200은 무엇을 의미하는가?
- answer: 파일 요청이 성공했다
- explanation: HTTP 200은 서버가 해당 요청을 성공 상태로 응답했다는 뜻이다. 파일 경로 연결 여부를 확인하는 데 유용하지만, 본문이 올바른 JSON인지, 스키마가 맞는지, 앱이 렌더링했는지는 증명하지 않는다. 응답 본문 파싱과 데이터 검증을 이어서 수행해야 한다.
- project_context: 로컬 서버 로그에서 v1~최신 lesson이 모두 200인지 보는 핵심 검증이다.

## PY34_L10_release_checklist_001
- level: 10
- file: python_tests_validation_regression_v34.json
- title: 배포 전 체크리스트 읽기
- question_type: meaning_choice
- concepts: ["checklist","release","deploy","quality_gate"]
- reading_goal: 커밋/푸시 전 확인해야 할 항목을 체크리스트로 묶는 이유를 이해한다.
- code:
```python
[ ] validation OK
[ ] local smoke test OK
[ ] asset/data version updated if required
[ ] git status and diff expected
[ ] commit and push
[ ] deployed revision/status verified
```
- question: 체크리스트의 장점은?
- answer: 반복 작업에서 빠뜨리는 항목을 줄인다
- explanation: release checklist는 반복 배포에서 누락하기 쉬운 검증을 순서대로 기록한다. 버전 갱신은 캐시 전략상 필요한 경우에만 하고, push 뒤에는 배포 상태와 실제 공개 revision도 확인해야 한다. 체크 표시 자체보다 각 항목의 증거가 중요하다.
- project_context: v27~v33 확장 작업에서 사실상 같은 체크리스트를 반복하고 있다.

## PY34_L10_side_card_ref_test_001
- level: 10
- file: python_tests_validation_regression_v34.json
- title: side_card reference 검증
- question_type: meaning_choice
- concepts: ["if","for","side_card","reference","foreign_key","validation"]
- reading_goal: 카드가 참조하는 side_card_id가 실제 존재하는지 확인하는 검증을 이해한다.
- code:
```python
for sid in card.get("side_card_ids", []):
    if sid not in side_ids:
        raise AssertionError(f"missing side card: {sid}")
```
- question: sid not in side_ids가 의미하는 것은?
- answer: 카드가 없는 side card를 참조하고 있다
- explanation: sid not in side_ids는 lesson이 실제 목록에 없는 side card ID를 참조한다는 뜻이다. get(..., [])는 선택적인 참조 목록이 없는 카드를 빈 목록으로 다루고, AssertionError는 깨진 참조가 있으면 자동 검증을 확실히 실패시킨다.
- project_context: MISSING SIDE CARD REFERENCES: OK를 확인하는 이유다.

## PY34_L10_total_count_test_001
- level: 10
- file: python_tests_validation_regression_v34.json
- title: 카드 총수 검증 읽기
- question_type: meaning_choice
- concepts: ["if","total_count","validation","regression"]
- reading_goal: 전체 카드 수가 예상대로 증가했는지 검증하는 이유를 이해한다.
- code:
```python
expected_total = previous_total + new_file_card_count
if total_cards != expected_total:
    raise AssertionError("unexpected card count")
```
- question: 이 검증이 잡아낼 수 있는 문제는?
- answer: 새 lesson이 app.js에 연결되지 않았거나 합산되지 않은 문제
- explanation: 이 검사는 실제 총수가 이전 총수와 새 파일의 카드 수를 더한 정확한 예상값과 같은지 확인한다. 새 lesson 연결 누락뿐 아니라 예상 밖 중복이나 추가도 잡을 수 있다. 총수만 맞아도 ID·참조·내용이 옳다는 뜻은 아니므로 다른 검증과 함께 사용한다.
- project_context: 각 확장 후 카드 수가 늘었는지 확인하는 이유다.

## PY56_L10_import_notes_001
- level: 10
- file: python_user_notes_bookmarks_v56.json
- title: import notes 읽기
- question_type: meaning_choice
- concepts: ["import_notes","restore","validation"]
- reading_goal: 백업한 메모 파일을 다시 가져올 때 검증이 필요함을 이해한다.
- code:
```python
if (isValidNotesBackup(data)) {
  restoreNotes(data)
}
```
- question: import notes에서 검증이 필요한 이유는?
- answer: 깨진 파일이나 잘못된 구조가 앱 상태를 망치지 않게 하기 위해
- explanation: import file은 untrusted이므로 size, schema version, text type·length, 허용 key와 card ID를 검증한다. 기존 data를 backup하고 overwrite, merge, 충돌·중복 처리 방식을 사용자에게 보여 준 뒤 atomic하게 반영한다. isValid 이름만으로 검증 범위가 보장되지는 않는다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L10_notes_bookmarks_quality_gate_001
- level: 10
- file: python_user_notes_bookmarks_v56.json
- title: notes bookmarks quality gate 읽기
- question_type: meaning_choice
- concepts: ["quality_gate","notes","bookmarks"]
- reading_goal: 메모/북마크 기능이 저장, 복원, 삭제, 필터까지 되는지 확인하는 품질 기준을 이해한다.
- code:
```python
saved = saveNote(fixtureNote)
assert saved
assert loadNote(fixtureNote.cardId) == fixtureNote
assert toggleBookmark(fixtureCardId) is True
assert fixtureCardId in filterBookmarks()
```
- question: notes/bookmarks quality gate의 목적은?
- answer: 개인 메모와 북마크 기능이 안정적으로 동작하는지 확인하기 위해
- explanation: 저장 함수가 truthy인지뿐 아니라 같은 fixture가 round-trip되는지와 bookmark 상태·filter 결과를 확인한다. 저장 실패, malformed legacy data, quota, duplicate, migration과 export/import recovery도 별도 test한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L10_personal_review_queue_001
- level: 10
- file: python_user_notes_bookmarks_v56.json
- title: personal review queue 읽기
- question_type: meaning_choice
- concepts: ["personal_review_queue","bookmark","mistake_note"]
- reading_goal: 북마크, 오답, 메모를 합쳐 개인 복습 큐를 만드는 전략을 이해한다.
- code:
```python
queue = deduplicateAndPrioritize(
  bookmarkedCards, wrongCards, notedCards
)
```
- question: personal review queue의 핵심은?
- answer: 북마크, 오답, 메모가 있는 카드를 개인 복습 대상으로 묶는 것
- explanation: 세 source에 같은 card가 있을 수 있으므로 stable ID로 deduplicate하고 due·오답·사용자 선택의 priority 규칙을 적용한다. 단순 merge 순서가 학습 효과를 보장하지 않으며 queue가 빈 경우와 삭제된 card도 처리한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY35_L10_cors_basic_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: CORS 기초 읽기
- question_type: meaning_choice
- concepts: ["CORS","browser_security","origin"]
- reading_goal: 브라우저가 다른 출처 API 호출을 제한할 수 있다는 CORS 개념을 이해한다.
- code:
```python
Access to fetch at http://localhost:8000/api/search
from origin http://localhost:8790
has been blocked by CORS policy.
```
- question: 이 오류가 말하는 핵심은?
- answer: 브라우저가 다른 origin API 호출을 차단했다
- explanation: origin은 scheme, host, port의 조합이므로 포트가 다르면 다른 출처다. CORS는 브라우저가 다른 origin의 응답을 프론트엔드 코드에 공개해도 되는지 서버 헤더를 보고 판단하는 규칙이다. 요청이 서버에 도달했어도 브라우저가 응답 읽기를 막을 수 있으며, 서버 장애와 같은 뜻은 아니다.
- project_context: PWA는 8790, FastAPI는 8000처럼 포트가 다를 때 만날 수 있다.

## PY35_L10_fastapi_route_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: FastAPI route 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","FastAPI","route","backend","API"]
- reading_goal: FastAPI에서 URL 경로와 Python 함수가 연결되는 방식을 이해한다.
- code:
```python
@app.get("/api/search")
def search(q: str):
    return {"items": search_cards(q)}
```
- question: 이 코드에서 /api/search는 무엇인가?
- answer: GET 요청을 받을 API route
- explanation: FastAPI route는 특정 HTTP 경로와 파이썬 함수를 연결하는 설정이다. @app.get은 해당 경로로 들어온 GET 요청을 아래 함수에 연결한다. route를 읽을 때는 HTTP method, 경로, 함수 인자를 함께 보면 요청 흐름이 보인다.
- project_context: 나중에 reading trainer에 검색 라우터나 RAG 검색 API를 붙일 때 필요한 구조다.

## PY35_L10_frontend_backend_flow_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: frontend ↔ backend 흐름 읽기
- question_type: order_choice
- concepts: ["frontend","backend","API_flow","fetch"]
- reading_goal: 화면에서 버튼을 누른 뒤 API를 거쳐 결과가 다시 화면에 표시되는 흐름을 이해한다.
- code:
```python
User clicks search
Frontend fetches /api/search?q=RAG
Backend searches data
Backend returns JSON
Frontend renders results
```
- question: Backend returns JSON 다음 단계로 자연스러운 것은?
- answer: Frontend renders results
- explanation: 사용자가 검색을 누르면 frontend가 API 요청을 보내고 backend가 데이터를 검색해 JSON 응답을 만든다. 그 응답이 browser로 돌아온 다음 단계는 frontend가 JSON을 읽어 결과 화면을 다시 그리는 것이다. 따라서 전체 흐름은 사용자 행동 → 요청 → 서버 처리 → JSON 응답 → 화면 렌더링 순서로 이어진다.
- project_context: 현재 정적 PWA에서 API 붙은 학습/검색 앱으로 확장할 때 핵심 흐름이다.

## PY35_L10_rate_limit_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: rate limit 읽기
- question_type: meaning_choice
- concepts: ["rate_limit","429","quota","API"]
- reading_goal: 짧은 시간에 너무 많은 요청을 보내면 제한될 수 있다는 개념을 이해한다.
- code:
```python
429 Too Many Requests
Retry-After: 60
```
- question: Retry-After: 60은 무엇을 의미하는가?
- answer: 60초 뒤 다시 시도하라는 뜻
- explanation: 429는 짧은 시간에 허용량보다 많은 요청을 보냈음을 뜻한다. Retry-After 값은 초 단위 지연 또는 HTTP 날짜 형식일 수 있는데, 여기의 60은 60초 뒤 재시도하라는 뜻이다. 클라이언트는 이 헤더와 자체 최대 재시도 횟수를 함께 지켜야 한다.
- project_context: GitHub API, 모델 API, 검색 API를 많이 호출할 때 중요한 운영 개념이다.

## PY35_L10_retry_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: retry 읽기
- question_type: meaning_choice
- concepts: ["if","for","return","try_except","range","retry","transient_error","backoff"]
- reading_goal: 일시적 실패일 수 있는 요청을 다시 시도하는 retry 패턴을 이해한다.
- code:
```python
for attempt in range(3):
    try:
        return call_api()
    except TimeoutError:
        if attempt == 2:
            raise
        sleep(2 ** attempt)
```
- question: 이 코드는 최대 몇 번 call_api를 시도하는가?
- answer: 3번
- explanation: range(3)으로 call_api는 최대 세 번 시도한다. 첫 두 번의 TimeoutError에는 1초, 2초를 기다린 뒤 재시도하고 마지막 실패는 호출자에게 다시 전달한다. 재시도는 일시적 오류와 중복 실행해도 안전한 작업에 제한하고, 횟수 제한과 backoff를 둬야 한다.
- project_context: 외부 API, 검색 API, 대량 처리 job에서 일시적 오류를 견디는 데 필요하다.

## PY35_L10_timeout_001
- level: 10
- file: python_web_http_api_flow_v35.json
- title: timeout 읽기
- question_type: meaning_choice
- concepts: ["try_except","import","print","timeout","network","API"]
- reading_goal: 응답이 너무 오래 걸릴 때 요청을 포기하는 timeout 개념을 이해한다.
- code:
```python
import requests

try:
    response = requests.get(url, timeout=10)
except requests.Timeout:
    print("request timed out")
```
- question: timeout이 필요한 이유는?
- answer: 응답 없는 요청을 무한히 기다리지 않기 위해
- explanation: timeout을 두면 연결이나 응답이 끝없이 지연될 때 호출자가 무한히 기다리는 문제를 줄일 수 있다. requests에서는 requests.Timeout처럼 실제 라이브러리가 정의한 예외를 잡아야 한다. timeout 뒤 서버 작업이 이미 수행됐을 수도 있으므로 재시도 전에는 요청의 중복 실행 안전성도 확인한다.
- project_context: 검색 API나 외부 모델 호출을 붙일 때 중요하다.
