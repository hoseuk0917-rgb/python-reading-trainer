# V356 semantic review — Level 8 chunk 10

Cards 181-200 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY15_L08_node_chunk_document_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Document / Chunk / Node 비교
- question_type: meaning_choice
- concepts: ["document","chunk","node","rag","knowledge_graph"]
- reading_goal: RAG와 KG에서 문서 단위를 어떻게 나누는지 이해한다.
- code:
```python
Document: 저장하거나 처리하는 원문 파일, 페이지, 문서 단위
Chunk: 검색이나 모델 입력을 위해 원문에서 나눈 텍스트 조각
Node: 이 예시의 KG에서 개념이나 개체를 나타내는 그래프 단위
```
- question: 검색을 위해 원문을 잘게 나눈 텍스트 조각은?
- answer: Chunk
- explanation: document는 원문 단위이고, chunk는 검색이나 모델 입력에 쓰려고 원문을 나눈 조각이다. 여기서 node는 KG의 개념이나 개체를 나타낸다. 다만 일부 RAG 프레임워크는 chunk도 node라고 부르므로, 실제 코드에서는 라이브러리의 정의를 확인해야 한다.
- project_context: 네 청킹/노드패스/엣지패스 구조를 앱에서 설명하기 위한 카드다.

## PY15_L08_owl_shacl_sparql_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: OWL / SHACL / SPARQL 비교
- question_type: meaning_choice
- concepts: ["owl","shacl","sparql","ontology","semantic_web"]
- reading_goal: 시맨틱 웹 도구들의 역할을 한 번에 구분한다.
- code:
```python
OWL: 클래스와 관계의 의미를 표현하고 추론을 지원하는 온톨로지 언어
SHACL: RDF 그래프가 지정한 shape와 제약을 만족하는지 검증하는 언어
SPARQL: RDF 그래프의 패턴을 질의하고 결과를 가져오는 언어
```
- question: RDF 그래프를 조회하는 질의 언어는?
- answer: SPARQL
- explanation: OWL, SHACL, SPARQL은 모두 RDF 생태계에서 쓰이지만 역할이 다르다. OWL은 의미 모델과 추론 규칙을 표현하고, SHACL은 실제 그래프 데이터가 정한 조건을 만족하는지 검사한다. SPARQL은 그래프에서 원하는 패턴을 조회하므로 이 문제의 정답이다.
- project_context: KG 검증/질의/온톨로지 문서를 읽을 때 유용하다.

## PY15_L08_pii_secret_compare_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: PII / Secret / Credential 비교
- question_type: meaning_choice
- concepts: ["pii","secret","credential","security"]
- reading_goal: 민감정보와 인증정보를 분리해서 다뤄야 하는 이유를 읽는다.
- code:
```python
PII: 이름, 이메일, 전화번호처럼 개인을 식별하거나 식별 가능하게 하는 정보
Secret: 공개되면 안 되는 값의 넓은 분류
Credential: 로그인이나 접근 권한을 증명하는 비밀번호, 키, 토큰 등의 정보
```
- question: DB password를 가장 정확하게 분류한 것은?
- answer: Secret이면서 Credential
- explanation: DB password는 접근 권한을 증명하므로 credential이고, 공개되면 안 되므로 secret이기도 하다. 한 값이 여러 보안 분류에 동시에 속할 수 있다. 코드나 로그에 직접 남기지 말고 비밀 저장소나 안전하게 관리되는 환경 변수에서 읽어야 한다.
- project_context: 로그/환경변수/설정 파일을 다룰 때 필요한 개념이다.

## PY15_L08_queue_worker_scheduler_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Queue / Worker / Scheduler 비교
- question_type: meaning_choice
- concepts: ["queue","worker","scheduler","pipeline"]
- reading_goal: 작업을 쌓고 처리하고 예약하는 운영 구조를 이해한다.
- code:
```python
Queue: 처리할 작업 메시지를 생산자와 소비자 사이에 보관
Worker: queue에서 작업을 가져와 실행하고 성공이나 실패를 기록
Scheduler: 정해진 시간이나 조건에 맞춰 작업을 직접 시작하거나 queue에 등록
```
- question: 정해진 시간에 작업을 시작하게 하는 역할은?
- answer: Scheduler
- explanation: scheduler는 작업을 언제 시작할지 결정하고, queue는 대기 중인 작업을 보관하며, worker는 작업을 실제로 처리한다. 시스템에 따라 scheduler가 직접 실행하기도 하고 queue에 넣기만 하기도 한다. 실패 재시도와 중복 실행 처리 방식도 함께 정해야 한다.
- project_context: 하베스트/큐레이션/배치 작업 운영 구조와 직접 연결된다.

## PY15_L08_rdf_triple_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: RDF Triple 읽기
- question_type: meaning_choice
- concepts: ["rdf","triple","subject","predicate","object"]
- reading_goal: RDF가 subject-predicate-object 구조로 의미를 표현한다는 점을 이해한다.
- code:
```python
Subject: LiDAR
Predicate: produces
Object: PointCloud

Triple: LiDAR --produces--> PointCloud
```
- question: RDF triple의 세 구성요소는?
- answer: Subject / Predicate / Object
- explanation: RDF는 하나의 사실을 subject, predicate, object의 세 부분으로 표현한다. 여기서는 LiDAR가 subject, produces가 둘 사이의 관계를 나타내는 predicate, PointCloud가 object다. 같은 자원이 다른 triple의 subject나 object로 다시 연결될 수 있다.
- project_context: semantic web, ontology, linked data 설명을 읽을 때 필요하다.

## PY15_L08_semantic_keyword_graph_search_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Keyword / Semantic / Graph Search 비교
- question_type: meaning_choice
- concepts: ["keyword_search","semantic_search","graph_search","vector_search"]
- reading_goal: semantic, keyword, graph search의 차이를 비교해 읽는다.
- code:
```python
Keyword search: 입력한 단어나 문자열이 포함되는지 찾음
Semantic/vector search: 임베딩 벡터가 의미상 가까운 항목을 찾음
Graph search: 노드와 관계를 따라 조건에 맞는 경로를 탐색함
```
- question: 노드 사이의 관계 경로를 따라 탐색하는 방식은?
- answer: Graph search
- explanation: keyword search는 주로 글자 일치를 보고, semantic search는 임베딩의 유사도를 이용한다. graph search는 노드 사이의 엣지를 따라 경로나 이웃을 찾는다. graph search가 찾은 경로가 곧바로 믿을 만한 근거가 되는 것은 아니므로 출처와 증거는 별도로 확인해야 한다.
- project_context: KG+RAG 검색 설계를 이해하는 핵심 비교다.

## PY15_L08_sql_injection_xss_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: SQL Injection / XSS 비교
- question_type: meaning_choice
- concepts: ["sql_injection","xss","security","web"]
- reading_goal: 웹과 DB 보안 공격 유형이 어디서 발생하는지 구분한다.
- code:
```python
SQL Injection: 입력이 SQL 문의 구조로 해석되어 의도하지 않은 질의를 실행하게 함
XSS: 신뢰하지 않은 값이 브라우저에서 스크립트로 실행되게 함
```
- question: 사용자 입력이 SQL 쿼리 구조를 바꾸는 공격은?
- answer: SQL Injection
- explanation: SQL injection은 사용자 입력이 데이터가 아니라 SQL 문법으로 해석될 때 생긴다. 값은 문자열 이어 붙이기 대신 매개변수 바인딩으로 전달하고, 동적인 테이블명 같은 식별자는 허용 목록으로 제한한다. XSS는 HTML, 속성, URL, JavaScript 등 출력 위치에 맞는 인코딩과 안전한 DOM API로 막아야 하며 SQL injection과 방어 위치가 다르다.
- project_context: API/DB 코드리뷰에서 자주 확인해야 하는 보안 포인트다.

## PY15_L08_test_harness_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Test harness 코드 흐름
- question_type: meaning_choice
- concepts: ["for","test_harness","test","expected","validation"]
- reading_goal: 입력과 기대값을 돌려 검증하는 테스트 틀을 읽는다.
- code:
```python
cases = [
    {"input": "2+3", "expected": 5},
    {"input": "1+1", "expected": 2},
]

for case in cases:
    assert run(case["input"]) == case["expected"]
```
- question: 이 코드의 목적은?
- answer: 여러 테스트 케이스를 자동 검증한다
- explanation: cases의 각 딕셔너리에는 입력과 기대 결과가 들어 있다. 반복문은 각 입력을 run에 전달하고 실제 결과와 expected를 비교한다. 다르면 assert가 AssertionError를 일으켜 실패를 알린다. 단, assert는 Python의 -O 옵션에서 제거될 수 있으므로 운영 입력 검증 대신 테스트 코드에서 사용한다.
- project_context: 카드 품질검사/데이터셋 평가/모델 평가 스크립트와 연결된다.

## PY15_L08_thread_process_async_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Thread / Process / Async 비교
- question_type: meaning_choice
- concepts: ["thread","process","async","concurrency"]
- reading_goal: thread, process, async의 차이를 한 번에 비교해 읽는다.
- code:
```python
Thread: 한 프로세스의 메모리를 공유하는 여러 실행 흐름
Process: 보통 독립된 메모리 공간을 가진 실행 단위
Async: 작업이 I/O를 기다리는 동안 이벤트 루프가 다른 준비된 작업을 실행하는 방식
```
- question: 네트워크 요청처럼 기다리는 시간이 많은 작업에 자주 어울리는 방식은?
- answer: Async
- explanation: 네트워크처럼 대기 시간이 긴 작업은 비동기 API를 쓸 수 있을 때 async가 적합할 수 있다. thread도 블로킹 I/O를 겹쳐 처리할 수 있고, process는 격리나 Python CPU 연산의 병렬 처리에 자주 쓰인다. async를 쓴다고 CPU 계산 자체가 빨라지는 것은 아니며, 블로킹 함수를 이벤트 루프에서 직접 호출하면 다른 작업도 멈춘다.
- project_context: API 수집기/웹서버/큐 처리 코드를 읽을 때 필요하다.

## PY15_L08_wiring_harness_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Wiring harness 개념
- question_type: meaning_choice
- concepts: ["wiring_harness","connector","sensor","actuator","system"]
- reading_goal: 자율시스템에서 하네스가 센서/전원/통신 연결과 관련됨을 이해한다.
- code:
```python
Sensor -> connector -> wiring harness -> ECU/controller
전원선 + 신호선 + 차폐 + 커넥터를 물리적으로 묶고 관리
```
- question: wiring harness의 역할에 가까운 것은?
- answer: 센서/제어기/전원/통신선을 묶고 연결한다
- explanation: wiring harness는 여러 전선과 커넥터를 정리해 센서, 제어기, 전원 사이에 전력과 신호를 전달한다. 차폐, 고정, 커넥터 선택은 노이즈와 진동, 정비성을 고려한다. 이름이 비슷한 software test harness와는 전혀 다른 물리 구성품이다.
- project_context: 로봇/자율차/UAM 시스템 문서에서 하네스 용어를 만날 때 필요하다.

## PY62_L08_date_format_001
- level: 8
- file: python_i18n_locale_language_toggle_v62.json
- title: locale date format 읽기
- question_type: meaning_choice
- concepts: ["date_format","locale","UI"]
- reading_goal: locale에 따라 날짜 표시가 달라질 수 있음을 이해한다.
- code:
```python
date.toLocaleDateString(locale)
```
- question: locale date format이 필요한 이유는?
- answer: 사용자 지역에 맞게 날짜를 자연스럽게 보여주기 위해
- explanation: 같은 날짜도 ko-KR에서는 ‘2026. 5. 31.’, en-US에서는 ‘5/31/2026’처럼 다르게 표시될 수 있다. toLocaleDateString은 locale에 맞춘 표시를 돕지만 어떤 순간을 어느 날짜로 볼지는 timeZone 옵션에 따라 달라진다. streak처럼 날짜 경계가 중요한 기능은 사용자 시간대를 명시해야 한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L08_fallback_locale_001
- level: 8
- file: python_i18n_locale_language_toggle_v62.json
- title: fallback locale 읽기
- question_type: meaning_choice
- concepts: ["fallback_locale","i18n","resilience"]
- reading_goal: 선택한 언어의 문구가 없을 때 기본 언어로 대체하는 fallback locale을 이해한다.
- code:
```python
text = messages.get(locale, {}).get(key) or messages['ko-KR'][key]
```
- question: fallback locale의 목적은?
- answer: 번역이 빠진 문구가 있어도 앱이 깨지지 않게 하기 위해
- explanation: fallback locale은 선택한 locale 또는 key가 없을 때 기본 언어 문구를 보여 주는 전략이다. 먼저 빈 사전으로 안전하게 대체해야 지원하지 않는 locale에서도 조회 자체가 실패하지 않는다. 기본 언어에도 key가 없다면 개발 로그와 눈에 띄는 대체 문구를 남겨 누락을 조용히 숨기지 않아야 한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L08_missing_translation_001
- level: 8
- file: python_i18n_locale_language_toggle_v62.json
- title: missing translation 읽기
- question_type: meaning_choice
- concepts: ["missing_translation","quality_gate","i18n"]
- reading_goal: 번역이 빠진 key를 검출하는 missing translation 검사를 이해한다.
- code:
```python
missing = requiredKeys - messages['en-US'].keys()
```
- question: missing translation 검사의 목적은?
- answer: 언어별로 빠진 번역 문구를 찾기 위해
- explanation: 필수 key 집합과 각 언어의 key 집합을 비교하면 빠진 번역을 배포 전에 찾을 수 있다. 실행 중 fallback은 화면이 깨지는 것을 막지만 번역 완료를 증명하지는 않는다. CI에서는 누락 key, 불필요해진 key, 변수 자리표시자가 언어별로 같은지도 함께 검사한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L08_number_format_001
- level: 8
- file: python_i18n_locale_language_toggle_v62.json
- title: number format 읽기
- question_type: meaning_choice
- concepts: ["number_format","locale","UI"]
- reading_goal: locale에 따라 숫자와 퍼센트 표시를 맞추는 방식을 이해한다.
- code:
```python
new Intl.NumberFormat(locale).format(score)
```
- question: number format의 목적은?
- answer: 숫자를 사용자의 지역 형식에 맞게 보여주기 위해
- explanation: Intl.NumberFormat(locale)의 기본 설정은 일반 숫자의 자릿수 구분과 소수점 표기를 locale에 맞춘다. 퍼센트나 통화를 표시하려면 style: 'percent' 또는 style: 'currency'와 통화 코드를 별도로 지정해야 한다. 값의 의미에 맞는 옵션 없이 기호만 붙이면 지역에 따라 잘못 보일 수 있다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY63_L08_goal_completion_001
- level: 8
- file: python_learning_streak_goal_habit_v63.json
- title: goal completion 읽기
- question_type: meaning_choice
- concepts: ["goal_completion","daily_goal","reward"]
- reading_goal: 오늘 목표를 달성했는지 판단하는 goal completion을 이해한다.
- code:
```python
completed = completedToday >= dailyGoal.cards
```
- question: goal completion의 기준은?
- answer: 오늘 완료한 카드 수가 목표 카드 수 이상인지 여부
- explanation: 이 조건은 오늘 완료 수가 목표 카드 수 이상인지 계산할 뿐, 학습 내용을 이해했는지까지 판단하지 않는다. 달성 메시지나 선택적 배지를 보여 줄 수 있지만 streak 유지나 기능 접근을 강제로 묶지 않는 편이 좋다. 목표가 꺼져 있거나 0인 경우의 의미도 별도로 정의해야 한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L08_habit_loop_001
- level: 8
- file: python_learning_streak_goal_habit_v63.json
- title: habit loop 읽기
- question_type: meaning_choice
- concepts: ["habit_loop","cue_routine_reward","learning_ux"]
- reading_goal: 습관 형성의 단서, 행동, 보상 흐름을 학습앱에 적용하는 habit loop를 이해한다.
- code:
```python
cue -> studyCards -> rewardMessage
```
- question: habit loop의 기본 흐름은?
- answer: 단서 → 학습 행동 → 작은 보상
- explanation: habit loop는 단서, 행동, 피드백이 반복되는 구조다. 오늘 목표가 단서, 카드 풀이가 행동, 완료 안내가 피드백이 될 수 있다. 알림은 사용자가 동의한 경우에만 적절한 시간에 보내고, 보상이나 streak로 불안을 자극해 강제 접속을 유도하지 않아야 학습자가 통제권을 유지한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L08_streak_freeze_001
- level: 8
- file: python_learning_streak_goal_habit_v63.json
- title: streak freeze 읽기
- question_type: meaning_choice
- concepts: ["if","streak_freeze","habit","UX"]
- reading_goal: 하루 놓쳤을 때 연속 기록을 한 번 보호하는 streak freeze 개념을 이해한다.
- code:
```python
if missedDay and freezeAvailable:
  keepStreak()
```
- question: streak freeze의 목적은?
- answer: 하루 실패가 전체 습관을 포기하게 만들지 않도록 완충하기 위해
- explanation: streak freeze는 쉬는 날 하나 때문에 모든 연속 기록이 사라졌다고 느끼지 않게 하는 완충 장치다. 조건을 어렵게 만들어 벌주기보다 사용자가 켜거나 끌 수 있는 휴식일·유예 규칙으로 설명하는 편이 낫다. freeze를 써도 실제 학습일과 보호된 날을 구분해 정직하게 보여 준다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L08_study_day_log_001
- level: 8
- file: python_learning_streak_goal_habit_v63.json
- title: study day log 읽기
- question_type: meaning_choice
- concepts: ["study_day_log","progress_history","habit"]
- reading_goal: 학습한 날짜를 기록해 streak 계산에 쓰는 study day log를 이해한다.
- code:
```python
studyDays.add('2026-06-01')
```
- question: study day log의 역할은?
- answer: 학습한 날짜를 기록해 연속 학습 여부를 계산한다
- explanation: study day log는 사용자가 학습한 날짜를 중복 없이 기록해 오늘 학습 여부와 연속 날짜를 계산하게 한다. 날짜 문자열은 앞 카드와 같은 time zone 규칙으로 만들어야 한다. 서버 동기화 때 같은 날짜를 합치고, 시간대 변경으로 하루가 빠지거나 두 번 세어지지 않는지 확인한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY49_L08_answer_history_001
- level: 8
- file: python_learning_ux_review_algorithm_v49.json
- title: answer history 읽기
- question_type: meaning_choice
- concepts: ["answer_history","learning_log","progress_data"]
- reading_goal: 사용자의 정답/오답 기록을 저장해야 복습 알고리즘을 만들 수 있음을 이해한다.
- code:
```python
history.append({
    'card_id': card_id,
    'correct': correct,
    'answered_at': now
})
```
- question: answer history가 필요한 이유는?
- answer: 카드별로 얼마나 잘 맞혔는지 판단하기 위해
- explanation: answer history는 학습자가 과거에 어떤 카드에 맞고 틀렸는지 남긴 기록이다. 복습 일정과 난이도 조절은 이 기록을 기반으로 계산할 수 있다. 최근 기록과 누적 기록을 함께 보면 일시적 실수와 반복 약점을 구분할 수 있다. 따라서 정답은 ‘카드별로 얼마나 잘 맞혔는지 판단하기 위해’이다.
- project_context: localStorage나 DB에 card_id, correct, answered_at을 남기면 학습 패턴을 분석할 수 있다.

## PY49_L08_difficulty_adjustment_001
- level: 8
- file: python_learning_ux_review_algorithm_v49.json
- title: difficulty adjustment 읽기
- question_type: meaning_choice
- concepts: ["if","difficulty_adjustment","adaptive_learning","level"]
- reading_goal: 학습 결과에 따라 다음 카드 난이도를 조절하는 방식을 이해한다.
- code:
```python
if recent_accuracy > 0.85:
    next_level = level + 1
elif recent_accuracy < 0.5:
    next_level = max(1, level - 1)
```
- question: difficulty adjustment의 목적은?
- answer: 너무 쉽거나 어려운 카드만 계속 나오지 않게 조절하기 위해
- explanation: recent_accuracy가 충분한 수의 최근 시도에서 계산됐다는 전제에서 높으면 level을 올리고 낮으면 최소 1까지 내린다. 적은 표본으로 매번 level을 바꾸면 출렁일 수 있으므로 최소 시도, hysteresis, 최고 level bound와 사용자 선택을 둔다. accuracy만으로 학습자의 능력을 단정하지 않는다.
- project_context: 초보자는 level 6 이전을 더 보고, 익숙해지면 level 9~10 카드로 올라가게 만들 수 있다.
