# V356 semantic review — Level 8 chunk 16

Cards 301-306 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY56_L08_load_notes_001
- level: 8
- file: python_user_notes_bookmarks_v56.json
- title: load notes 읽기
- question_type: meaning_choice
- concepts: ["load_notes","JSON_parse","state_restore"]
- reading_goal: 저장된 메모를 앱 시작 시 다시 불러오는 흐름을 이해한다.
- code:
```python
let notes = {};
try {
  notes = validateNotes(JSON.parse(localStorage.getItem('userNotes') || '{}'));
} catch (error) {
  showNotesRecovery(error);
}
```
- question: load notes의 목적은?
- answer: 이전에 저장한 개인 메모를 다시 화면에 복원하기 위해
- explanation: JSON parse와 schema validation을 try/catch해 malformed 또는 낡은 data가 app 시작을 깨뜨리지 않게 한다. 조용히 {}로 덮어쓰면 유일한 note를 잃을 수 있으므로 원본을 보존하고 recovery·migration을 제공한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L08_localstorage_notes_001
- level: 8
- file: python_user_notes_bookmarks_v56.json
- title: localStorage notes 읽기
- question_type: meaning_choice
- concepts: ["localStorage","user_note","browser_storage"]
- reading_goal: 개인 메모를 브라우저 localStorage에 저장하는 방식을 이해한다.
- code:
```python
localStorage.setItem('userNotes', JSON.stringify(notes))
```
- question: localStorage notes의 장점은?
- answer: 서버 없이 브라우저에 개인 메모를 저장할 수 있다
- explanation: localStorage는 server 없이 같은 browser origin에 note JSON 문자열을 남길 수 있다. device sync가 없고 quota·private mode·XSS·storage 삭제 위험이 있으므로 저장 예외, schema validation과 export를 제공한다. 민감한 note에는 더 강한 보호가 필요할 수 있다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY56_L08_note_editor_001
- level: 8
- file: python_user_notes_bookmarks_v56.json
- title: note editor 읽기
- question_type: meaning_choice
- concepts: ["note_editor","textarea","UX"]
- reading_goal: 카드 아래에 개인 메모 입력창을 제공하는 note editor UX를 이해한다.
- code:
```python
<textarea placeholder="내 메모"></textarea>
```
- question: note editor의 역할은?
- answer: 사용자가 카드에 대한 자기 생각을 입력하게 한다
- explanation: 메모 입력창은 작지만 학습자가 자신의 이해 상태를 기록하는 핵심 UI가 될 수 있다. note editor는 사용자가 직접 적은 학습 메모를 만들고 수정하는 화면이다. 저장 버튼, 입력값 검증, 기존 노트 불러오기 흐름을 함께 확인하면 된다. 따라서 정답은 ‘사용자가 카드에 대한 자기 생각을 입력하게 한다’이다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY35_L08_headers_001
- level: 8
- file: python_web_http_api_flow_v35.json
- title: HTTP headers 읽기
- question_type: meaning_choice
- concepts: ["headers","content_type","metadata"]
- reading_goal: 요청/응답의 부가정보를 담는 header의 역할을 이해한다.
- code:
```python
Content-Type: application/json
Cache-Control: no-cache
Authorization: Bearer token
```
- question: Content-Type: application/json은 무엇을 알려주는가?
- answer: 본문이 JSON 형식임을 알려준다
- explanation: HTTP headers는 요청이나 응답에 붙는 부가정보 영역이다. 데이터 형식, 인증 토큰, 캐시 정책처럼 본문 밖에서 필요한 정보를 전달한다. 본문을 읽기 전에 header를 보면 서버가 어떤 형식으로 응답했는지 먼저 판단할 수 있다. 따라서 정답은 ‘본문이 JSON 형식임을 알려준다’이다.
- project_context: API 서버와 프론트엔드가 JSON을 주고받을 때 중요한 정보다.

## PY35_L08_query_string_001
- level: 8
- file: python_web_http_api_flow_v35.json
- title: query string 읽기
- question_type: meaning_choice
- concepts: ["query_string","URL","cache_busting"]
- reading_goal: URL 뒤에 붙는 물음표 파라미터를 이해한다.
- code:
```python
/data/curriculum/curriculum_v1.json?v=20260529_v35
```
- question: v=20260529_v35의 역할로 가장 가까운 것은?
- answer: 버전 값을 붙여 캐시된 파일 대신 새 요청을 유도한다
- explanation: URL의 query string은 ? 뒤에 key=value 형태로 붙는 추가 정보다. 이 예시처럼 버전 값이 바뀌면 캐시는 다른 URL로 인식해 이전 응답을 재사용하지 않는 경우가 많다. 다만 실제 재검증·저장 동작은 응답의 Cache-Control과 중간 캐시 정책에도 좌우되므로 query 값만으로 항상 새 본문을 보장하지는 않는다.
- project_context: APP_DATA_VERSION으로 캐시 문제를 줄이는 구조와 직접 연결된다.

## PY35_L08_status_codes_001
- level: 8
- file: python_web_http_api_flow_v35.json
- title: HTTP status code 읽기
- question_type: meaning_choice
- concepts: ["status_code","200","404","500"]
- reading_goal: 200, 404, 500 같은 대표 상태코드의 의미를 구분한다.
- code:
```python
200 OK
404 Not Found
500 Internal Server Error
```
- question: 404 Not Found의 의미는?
- answer: 요청한 경로의 리소스를 찾지 못했다
- explanation: status code는 HTTP 응답의 처리 결과를 숫자로 알려 주는 값이다. 404는 경로, 파일명, 라우트가 틀렸을 때 자주 보이는 오류다. 404를 보면 서버 전체 장애보다 요청한 URL이 실제로 존재하는지부터 확인하는 흐름이 좋다. 따라서 정답은 ‘요청한 경로의 리소스를 찾지 못했다’이다.
- project_context: favicon.ico 404는 앱 핵심 파일이 아니라서 보통 무시 가능했다.
