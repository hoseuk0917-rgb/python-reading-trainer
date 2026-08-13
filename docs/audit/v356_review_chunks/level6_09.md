# V356 semantic review — Level 6 chunk 9

Cards 161-162 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY56_L06_favorite_card_001
- level: 6
- file: python_user_notes_bookmarks_v56.json
- title: favorite card 읽기
- question_type: meaning_choice
- concepts: ["favorite","bookmark","card_state"]
- reading_goal: 자주 보는 카드를 즐겨찾기로 저장하는 favorite card 개념을 이해한다.
- code:
```python
favoriteCardIds.add(card.id)
```
- question: favorite card의 역할은?
- answer: 자주 보는 카드를 빠르게 다시 열 수 있게 한다
- explanation: favorite는 shared card object를 바꾸기보다 사용자별 ID set에 저장한다. card.favorite=true를 canonical data에 넣으면 다른 사용자와 cache에 개인 상태가 섞이거나 update 때 사라질 수 있다. stable ID와 사용자 storage를 분리한다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.

## PY35_L06_http_request_response_001
- level: 6
- file: python_web_http_api_flow_v35.json
- title: HTTP request / response 읽기
- question_type: meaning_choice
- concepts: ["HTTP","request","response","web"]
- reading_goal: 브라우저가 요청을 보내고 서버가 응답을 돌려주는 기본 흐름을 이해한다.
- code:
```python
Browser -> GET /src/pwa/app.js
Server  -> 200 OK + app.js content
```
- question: 이 흐름에서 200 OK는 무엇을 뜻하는가?
- answer: 요청이 성공했고 응답을 받았다
- explanation: HTTP는 클라이언트 요청과 서버 응답으로 통신한다. 200 OK는 서버가 이 요청을 HTTP 수준에서 성공적으로 처리했다는 대표 상태 코드다. 응답을 받았다는 사실만으로는 부족하고, 200이어도 본문 형식이나 업무 데이터가 올바른지는 별도로 검증해야 한다.
- project_context: 로컬 서버 로그에서 app.js, lesson JSON이 200인지 확인하는 이유다.
