# V356 semantic review — Level 9 chunk 15

Cards 281-288 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY34_L09_test_failure_log_001
- level: 9
- file: python_tests_validation_regression_v34.json
- title: 테스트 실패 로그 읽기
- question_type: meaning_choice
- concepts: ["test_failure","log","debugging"]
- reading_goal: 실패 로그에서 어떤 테스트가 왜 실패했는지 찾는 순서를 익힌다.
- code:
```python
FAILED test_cards.py::test_answer_in_choices

AssertionError:
answer not found in choices
card_id = PY31_L09_dict_vs_object_001
```
- question: 이 로그에서 먼저 고칠 카드 id는?
- answer: PY31_L09_dict_vs_object_001
- explanation: 실패 원인은 answer가 choices에 없다는 것이고, card_id가 수정 대상을 알려준다. 테스트 실패 로그는 어떤 검사에서 어떤 기대값이 깨졌는지 보여 준다. 실패 메시지와 입력 파일, 최근 변경을 함께 보면 원인을 빨리 좁힐 수 있다. 따라서 정답은 ‘PY31_L09_dict_vs_object_001’이다.
- project_context: v29/v31에서 실제로 겪었던 정답/선택지 불일치 문제와 같다.

## PY56_L09_bookmark_filter_001
- level: 9
- file: python_user_notes_bookmarks_v56.json
- title: bookmark filter 읽기
- question_type: meaning_choice
- concepts: ["bookmark_filter","saved_cards","filter"]
- reading_goal: 북마크한 카드만 따로 모아 복습 목록으로 보여주는 필터를 읽는다.
- code:
```python
const bookmarkSet = new Set(bookmarks);
const filtered = cards.filter(card => bookmarkSet.has(card.id));
```
- question: bookmark filter의 목적은?
- answer: 북마크한 카드만 따로 모아보기 위해
- explanation: Set.has로 여러 card를 검사할 때 반복적인 배열 scan을 줄인다. 저장된 ID가 삭제되거나 다른 version에서 바뀌었을 수 있으므로 stale bookmark를 보존·표시할지 정하고, 중복 ID는 load 단계에서 normalize한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L09_export_notes_001
- level: 9
- file: python_user_notes_bookmarks_v56.json
- title: export notes 읽기
- question_type: meaning_choice
- concepts: ["export_notes","backup","JSON"]
- reading_goal: 개인 메모와 북마크를 백업 파일로 내보내는 흐름을 이해한다.
- code:
```python
exportData = JSON.stringify({ notes, bookmarks }, null, 2)
```
- question: export notes의 목적은?
- answer: 개인 메모와 북마크를 백업하거나 옮기기 위해
- explanation: export에는 notes, bookmarks뿐 아니라 schemaVersion, exportedAt, appVersion을 넣어 나중 import가 format을 판단하게 한다. JSON download가 실제로 성공했는지 test하고 개인 내용이 포함된 file임을 알린다. 암호화되지 않은 backup의 저장·공유 위험도 안내한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L09_note_privacy_001
- level: 9
- file: python_user_notes_bookmarks_v56.json
- title: note privacy 읽기
- question_type: meaning_choice
- concepts: ["note_privacy","local_data","privacy"]
- reading_goal: 개인 메모는 사적인 학습 기록이므로 저장 위치와 공유 여부를 조심해야 함을 이해한다.
- code:
```python
privateData = { notes, bookmarks, progress }
```
- question: note privacy에서 중요한 점은?
- answer: 개인 메모가 어디에 저장되고 공유되는지 명확히 하는 것
- explanation: 메모에는 사용자의 약점, 생각, 학습 습관이 들어갈 수 있으므로 개인정보처럼 다뤄야 한다. note privacy는 사용자의 개인 메모가 어디에 저장되고 누구에게 보이는지 확인하는 관점이다. 로컬 저장, 동기화, 내보내기 범위를 구분해야 한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L09_notes_search_001
- level: 9
- file: python_user_notes_bookmarks_v56.json
- title: notes search 읽기
- question_type: meaning_choice
- concepts: ["notes_search","personal_search","search"]
- reading_goal: 사용자 메모 내용까지 검색 대상에 넣는 방식을 이해한다.
- code:
```python
const normalizedQuery = query.trim().toLocaleLowerCase();
const matches = note.text.toLocaleLowerCase().includes(normalizedQuery);
```
- question: notes search가 유용한 이유는?
- answer: 사용자가 직접 남긴 메모 내용으로 카드를 다시 찾을 수 있기 때문에
- explanation: note와 query 양쪽을 같은 방식으로 normalize해 case 차이를 줄인다. 빈 query의 의미, locale·Unicode와 note 없는 card를 처리한다. 개인 note 검색 index가 server나 analytics로 전송되는지 명확히 하고 기본적으로 local 범위에 둔다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY35_L09_api_endpoint_001
- level: 9
- file: python_web_http_api_flow_v35.json
- title: API endpoint 읽기
- question_type: meaning_choice
- concepts: ["endpoint","route","API"]
- reading_goal: 특정 기능에 대응하는 URL 경로인 endpoint를 이해한다.
- code:
```python
GET /api/search?q=kalman
GET /api/cards/today
POST /api/progress
```
- question: /api/search의 역할로 자연스러운 것은?
- answer: 검색 요청을 처리하는 endpoint
- explanation: API endpoint는 HTTP 메서드와 URL을 통해 특정 서버 기능에 접근하는 지점이다. /api/search라는 이름은 검색 기능을 암시하지만 실제 동작은 서버 구현과 API 계약이 정한다. 프론트엔드와 백엔드는 경로뿐 아니라 method, 입력, 상태 코드, 응답 스키마도 맞춰야 한다.
- project_context: FastAPI 검색 서버를 붙일 때 /api/search 같은 endpoint가 필요하다.

## PY35_L09_fetch_basic_001
- level: 9
- file: python_web_http_api_flow_v35.json
- title: fetch 기본 읽기
- question_type: meaning_choice
- concepts: ["fetch","JavaScript","HTTP","JSON"]
- reading_goal: 브라우저 JavaScript에서 HTTP 요청을 보내고 JSON을 읽는 흐름을 이해한다.
- code:
```python
const res = await fetch("/data/lessons/cards.json");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const cards = await res.json();
```
- question: await res.json()의 역할은?
- answer: 응답 본문을 JSON 데이터로 읽는다
- explanation: fetch는 먼저 Response 객체를 돌려주고, res.json()은 응답 본문을 읽어 JSON으로 파싱한다. fetch는 404나 500 응답만으로 promise를 reject하지 않으므로 res.ok나 status를 먼저 확인해야 한다. 본문이 유효한 JSON이 아니면 res.json() 자체도 실패할 수 있다.
- project_context: 현재 app.js가 curriculum과 lesson JSON을 불러오는 방식과 연결된다.

## PY35_L09_json_response_001
- level: 9
- file: python_web_http_api_flow_v35.json
- title: JSON response 읽기
- question_type: meaning_choice
- concepts: ["JSON_response","API","frontend"]
- reading_goal: API가 돌려주는 JSON 응답 구조를 읽는다.
- code:
```python
{
  "ok": true,
  "items": [
    {"id": "c1", "title": "HTTP 읽기"}
  ]
}
```
- question: items 필드에는 무엇이 들어 있는가?
- answer: 결과 객체들의 리스트
- explanation: 이 JSON 객체에서 items 값은 결과 객체 하나를 담은 리스트다. ok는 성공 여부를 나타내도록 설계한 애플리케이션 필드일 뿐 HTTP 표준 필드는 아니다. 클라이언트는 HTTP 상태와 JSON 스키마를 각각 확인해야 한다.
- project_context: 검색 API나 카드 API를 만들 때 프론트엔드가 읽기 쉬운 응답 구조가 필요하다.
