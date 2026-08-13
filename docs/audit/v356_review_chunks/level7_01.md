# V356 semantic review — Level 7 chunk 1

Cards 1-20 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L07_pipeline_001
- level: 7
- file: cards_seed_v1.json
- title: load-filter-write 구조 읽기
- question_type: meaning_choice
- concepts: ["def","function","pipeline","load_jsonl","filter","write_jsonl","main"]
- reading_goal: 입력, 처리, 출력으로 나뉜 작은 프로그램 구조를 읽는다.
- code:
```python
def load_jsonl(path):
    ...

def filter_nodes(rows, kind):
    ...

def write_jsonl(rows, path):
    ...

def main():
    rows = load_jsonl("nodes.jsonl")
    selected = filter_nodes(rows, "Sensor")
    write_jsonl(selected, "sensor_nodes.jsonl")
```
- question: main()에서 실행되는 처리 순서는?
- answer: nodes.jsonl에서 Sensor 노드만 골라 sensor_nodes.jsonl로 저장한다.
- explanation: main() 함수 안에서 load, filter, write가 순서대로 호출된다. 그래서 데이터 읽기, 거르기, 쓰기의 파이프라인 흐름이 만들어진다. 이런 구조는 입력, 처리, 출력 단계를 분리해 디버깅과 테스트를 쉽게 만든다. 따라서 정답은 ‘nodes.jsonl에서 Sensor 노드만 골라 sensor_nodes.jsonl로 저장한다.’이다.
- project_context: 작은 배치 스크립트는 대부분 입력-처리-출력 구조로 읽으면 된다.

## PY52_L07_aria_label_001
- level: 7
- file: python_accessibility_a11y_ui_v52.json
- title: aria-label 읽기
- question_type: meaning_choice
- concepts: ["aria_label","screen_reader","accessibility"]
- reading_goal: 아이콘 버튼처럼 글자가 없는 요소에 접근 가능한 이름을 붙이는 방식을 이해한다.
- code:
```python
<button aria-label="다음 카드">▶</button>
```
- question: aria-label의 역할은?
- answer: 화면낭독기가 버튼의 의미를 읽을 수 있게 한다
- explanation: icon-only button에는 aria-label이 accessible name을 제공해 screen reader가 목적을 읽게 한다. aria-label은 내부 visible text보다 accessible name에서 우선할 수 있으므로 눈에 보이는 label이 있으면 native text나 aria-labelledby를 우선하고, 언어 변경 때 번역과 동기화한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L07_button_semantics_001
- level: 7
- file: python_accessibility_a11y_ui_v52.json
- title: button semantics 읽기
- question_type: meaning_choice
- concepts: ["semantic_html","button","accessibility"]
- reading_goal: 클릭 가능한 요소는 div보다 button을 쓰는 것이 좋은 이유를 이해한다.
- code:
```python
<button id="nextCard">다음</button>
```
- question: button 태그를 쓰면 좋은 점은?
- answer: 기본 키보드 조작과 의미가 함께 제공된다
- explanation: button semantics는 클릭 가능한 요소를 의미 있는 버튼으로 표현하는 원칙이다. div에 클릭 이벤트만 붙이면 키보드 접근성과 의미가 약해질 수 있다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L07_screen_reader_text_001
- level: 7
- file: python_accessibility_a11y_ui_v52.json
- title: screen reader text 읽기
- question_type: meaning_choice
- concepts: ["screen_reader","sr_only","accessibility"]
- reading_goal: 화면에는 작게 보이거나 숨기되 보조기기에는 읽히는 설명 텍스트를 이해한다.
- code:
```python
<span class="sr-only">정답 선택 결과</span>
```
- question: screen reader text의 목적은?
- answer: 시각적으로 부족한 정보를 보조기기 사용자에게 제공하기 위해
- explanation: sr-only text는 시각적으로 숨기되 accessibility tree에는 남기는 검증된 CSS pattern이 있어야 한다. display:none이나 hidden을 쓰면 보조기기도 읽지 않을 수 있다. 상태 변화는 적절한 live region과 visible text로도 전달하고 중복 announcement를 피한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY14_L07_learning_methods_compare_001
- level: 7
- file: python_ai_learning_methods_v14.json
- title: 지도학습/비지도학습/자기지도학습/강화학습 한 번에 비교
- question_type: meaning_choice
- concepts: ["supervised_learning","unsupervised_learning","self_supervised_learning","reinforcement_learning","ai_learning_method"]
- reading_goal: AI 학습 방법을 따로 외우지 않고 데이터와 피드백 형태 기준으로 비교한다.
- code:
```python
Supervised learning: 정답 label이 있는 데이터로 배운다.
Unsupervised learning: 정답 label 없이 패턴/군집을 찾는다.
Self-supervised learning: 데이터 안에서 문제와 정답을 만들어 표현을 배운다.
Reinforcement learning: 행동 -> 보상/패널티를 통해 정책을 배운다.
```
- question: 정답 label이 있는 데이터로 입력→정답 관계를 배우는 방식은?
- answer: 지도학습
- explanation: 지도학습은 이미지 분류, 스팸 분류, 점수 예측처럼 정답 label이 있는 데이터로 학습한다. 지도학습, 비지도학습, 자기지도학습, 강화학습은 데이터와 피드백 방식이 다르다. 정답 라벨, 숨은 구조, 보상 신호 중 무엇을 쓰는지 구분해야 한다.
- project_context: 모델/데이터셋 설명을 읽을 때 가장 먼저 구분해야 하는 축이다.

## PY14_L07_supervised_learning_001
- level: 7
- file: python_ai_learning_methods_v14.json
- title: 지도학습 코드 흐름 읽기
- question_type: meaning_choice
- concepts: ["for","supervised_learning","label","training"]
- reading_goal: 입력 x와 정답 y를 함께 쓰는 학습 흐름을 읽는다.
- code:
```python
for x, y in train_loader:
    optimizer.zero_grad()
    pred = model(x)
    loss = loss_fn(pred, y)
    loss.backward()
    optimizer.step()
```
- question: 여기서 y의 역할은?
- answer: 정답 label
- explanation: train_loader는 입력 x와 그에 대응하는 정답 label y를 묶어 준다. model(x)의 예측 pred와 y를 loss_fn이 비교하고, backward와 optimizer.step이 그 loss를 줄이는 방향으로 parameter를 갱신한다. y는 모델 입력이 아니라 학습 목표다. 일반 loop에서는 이전 gradient가 누적되지 않도록 새 batch 전에 zero_grad도 필요하다.
- project_context: 분류/회귀 모델 학습 코드를 읽는 기본이다.

## PY14_L07_unsupervised_learning_001
- level: 7
- file: python_ai_learning_methods_v14.json
- title: 비지도학습 감각 읽기
- question_type: meaning_choice
- concepts: ["import","unsupervised_learning","clustering","pattern"]
- reading_goal: 정답 label 없이 데이터 구조를 찾는 방식을 이해한다.
- code:
```python
from sklearn.cluster import KMeans

model = KMeans(n_clusters=3)
clusters = model.fit_predict(vectors)
```
- question: 이 코드 흐름에 가장 가까운 학습 방식은?
- answer: 비지도학습
- explanation: 비지도학습은 정답 label 없이 데이터의 구조를 찾는 방식이다. KMeans는 벡터들을 비슷한 특징끼리 묶어 군집을 만든다. 정답을 맞히는 문제라기보다 데이터 사이의 비슷함을 기준으로 묶는 과정인지 확인하면 된다.
- project_context: 문서 클러스터링, 실패군 묶기, 후보 패턴 탐색과 연결된다.

## PY12_L07_path_env_001
- level: 7
- file: python_ai_toolchain_expansion_v12.json
- title: PATH 환경변수 의미
- question_type: meaning_choice
- concepts: ["path","env","cli","windows"]
- reading_goal: 명령어가 어디서 찾아지는지 PATH 개념을 이해한다.
- code:
```python
$env:PATH
```
- question: PATH 환경변수는 무엇에 가까운가?
- answer: 명령어 실행 파일을 찾는 폴더 목록
- explanation: python, git, nvidia-smi 같은 명령이 인식되지 않을 때 PATH 문제가 원인일 수 있다. PATH 환경변수는 명령어를 입력했을 때 실행 파일을 찾는 폴더 목록이다. 설치했는데 명령이 안 먹히면 PATH 반영 여부를 확인해야 한다.
- project_context: 서버/워크스테이션 세팅 문제를 이해하는 데 중요하다.

## PY12_L07_pyproject_toml_001
- level: 7
- file: python_ai_toolchain_expansion_v12.json
- title: pyproject.toml 의미 읽기
- question_type: meaning_choice
- concepts: ["pyproject","toml","package","config"]
- reading_goal: pyproject.toml이 파이썬 프로젝트 설정 파일이라는 것을 이해한다.
- code:
```python
[project]
name = "trainer"
dependencies = ["fastapi", "pandas"]
```
- question: 이 파일 조각의 목적은?
- answer: 프로젝트 이름과 의존성을 설정한다
- explanation: [project]는 pyproject.toml의 프로젝트 메타데이터 표이고, name은 배포 이름 trainer를, dependencies는 설치 시 필요한 fastapi와 pandas를 선언한다. 이 조각은 프로젝트 이름과 의존성만 보여 주며 빌드 백엔드나 포맷터 설정까지 정의한 것은 아니다. 실제 설치 가능 여부는 선택한 빌드 도구와 나머지 필수 메타데이터도 함께 확인해야 한다.
- project_context: 오픈소스/AI 라이브러리 repo를 읽을 때 자주 보인다.

## PY60_L07_consent_state_001
- level: 7
- file: python_analytics_privacy_optin_v60.json
- title: consent state 읽기
- question_type: meaning_choice
- concepts: ["consent_state","localStorage","privacy"]
- reading_goal: 사용자의 동의 여부를 상태로 저장하고 확인하는 방식을 이해한다.
- code:
```python
consent = {
  analytics: true,
  updatedAt: now
}
```
- question: consent state에 들어갈 수 있는 값은?
- answer: analytics 동의 여부와 업데이트 시각
- explanation: consent state는 분석 수집 허용 여부와 그 선택 시각을 기록한다. 예시의 true 값은 사용자가 명시적으로 동의한 뒤에만 저장되어야 하며 기본값으로 미리 켜 두면 안 된다. 동의하지 않았거나 철회한 경우에는 식별자를 제거하는 것만으로 충분하지 않고 분석 이벤트 자체를 수집·전송하지 않아야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L07_opt_out_001
- level: 7
- file: python_analytics_privacy_optin_v60.json
- title: opt-out 읽기
- question_type: meaning_choice
- concepts: ["opt_out","privacy","settings"]
- reading_goal: 사용자가 언제든 분석 수집을 끌 수 있는 opt-out 개념을 이해한다.
- code:
```python
settings.analyticsEnabled = false
```
- question: opt-out이 필요한 이유는?
- answer: 사용자가 원하지 않으면 분석 수집을 중단할 수 있어야 하기 때문에
- explanation: opt-out은 사용자가 분석 수집을 더 이상 원하지 않을 때 끄는 선택권이다. 설정을 false로 바꾸는 것만으로 끝나지 않고 새 이벤트 생성과 전송을 즉시 멈추며, 이미 대기 중인 이벤트와 기존 데이터의 처리·삭제 정책도 안내해야 한다. 필수 기능 데이터와 선택적 분석 데이터를 분리하면 철회 후에도 앱 핵심 기능을 유지하기 쉽다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L07_privacy_opt_in_001
- level: 7
- file: python_analytics_privacy_optin_v60.json
- title: privacy opt-in 읽기
- question_type: meaning_choice
- concepts: ["privacy_opt_in","consent","privacy"]
- reading_goal: 분석 수집 전에 사용자의 동의를 받는 privacy opt-in을 이해한다.
- code:
```python
if (userConsent.analytics) {
  trackEvent('app_open')
}
```
- question: privacy opt-in의 목적은?
- answer: 사용자가 동의한 경우에만 분석 데이터를 수집하기 위해
- explanation: privacy opt-in은 사용자가 분석 수집에 명확히 동의한 뒤에만 분석 기능을 켜는 방식이다. 동의 전에는 이벤트를 만들거나 전송 대기열에 넣지 않아야 한다. 무엇을 왜 수집하는지 먼저 설명하고, 선택하지 않은 상태를 동의로 간주하지 않으며, 나중에 같은 수준으로 쉽게 철회할 수 있어야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY41_L07_controller_service_repository_001
- level: 7
- file: python_architecture_layers_patterns_v41.json
- title: controller service repository 읽기
- question_type: meaning_choice
- concepts: ["controller","service","repository"]
- reading_goal: controller, service, repository의 역할 차이를 구분한다.
- code:
```python
controller: HTTP 요청/응답 처리
service: 실제 규칙과 흐름 처리
repository: DB/파일 저장소 접근
```
- question: repository의 역할에 가장 가까운 것은?
- answer: DB나 파일 같은 저장소와 직접 대화한다
- explanation: controller는 HTTP 입력을 해석하고 응답으로 변환하며, service는 업무 흐름을 조립하고, repository는 DB나 파일 접근을 추상화한다. repository 구현은 저장소와 직접 대화하지만 service는 그 interface에 의존해 구체적인 SQL·파일 형식을 몰라도 되게 할 수 있다. 경계와 오류 변환 규칙을 일관되게 지켜야 한다.
- project_context: KG/LoRA 파이프라인에서도 chunk 파일 읽기, 결과 저장, 상태 조회를 repository처럼 분리할 수 있다.

## PY41_L07_domain_model_001
- level: 7
- file: python_architecture_layers_patterns_v41.json
- title: domain model 읽기
- question_type: meaning_choice
- concepts: ["domain_model","card","business_object"]
- reading_goal: 프로젝트에서 중요한 개념을 코드 객체로 표현하는 domain model을 이해한다.
- code:
```python
Card
  id
  title
  question
  choices
  answer
  concepts
```
- question: 이 프로젝트에서 Card가 domain model에 가까운 이유는?
- answer: 학습앱의 핵심 개념을 데이터 구조로 표현하기 때문이다
- explanation: domain model은 앱이 해결하는 문제 영역의 개념, 관계, 규칙을 코드로 표현한다. Card의 id, question, choices, answer는 학습 앱의 핵심 개념을 나타내므로 이 구조는 domain model의 일부로 볼 수 있다. 단순 필드 목록만으로 모든 불변조건이 보장되지는 않으므로 정답 포함 같은 규칙도 모델이나 검증 계층에 명시한다.
- project_context: KG 쪽에서는 Node, Edge, Evidence, Chunk 같은 것이 domain model에 가깝다.

## PY41_L07_service_layer_001
- level: 7
- file: python_architecture_layers_patterns_v41.json
- title: service layer 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","service_layer","business_logic","orchestration"]
- reading_goal: service layer가 여러 작업을 묶어 실제 기능 흐름을 만든다는 점을 이해한다.
- code:
```python
def recommend_today_cards(user_id, repo):
    progress = repo.load_progress(user_id)
    cards = repo.load_cards()
    return select_cards(cards, progress)
```
- question: 위 코드에서 service layer가 맡는 역할은?
- answer: progress와 cards를 가져와 추천 흐름을 조립한다
- explanation: service 함수는 주입받은 repo에서 progress와 cards를 읽고 select_cards라는 추천 규칙에 전달한다. HTTP 응답이나 구체적인 SQL을 직접 처리하지 않아 호출 계층과 저장 구현에서 분리된다. 권한 검사와 transaction 경계를 어느 층에서 맡을지도 명시해야 한다.
- project_context: 학습카드 추천, 복습 카드 선택, 진도 저장 같은 기능은 service layer로 묶기 좋다.

## PY26_L07_async_await_basic_001
- level: 7
- file: python_async_batch_queue_v26.json
- title: async/await 기본 읽기
- question_type: meaning_choice
- concepts: ["return","async","await","coroutine"]
- reading_goal: 비동기 함수와 await의 기본 의미를 읽는다.
- code:
```python
async def fetch_item(item_id):
    data = await api_get(item_id)
    return data
```
- question: await api_get(item_id)의 의미에 가장 가까운 것은?
- answer: 비동기 작업이 끝날 때까지 기다린다
- explanation: await는 api_get coroutine의 완료까지 현재 fetch_item task를 suspend한다. api_get이 non-blocking I/O 대기 중 event loop에 제어를 돌려주면 다른 준비된 task가 실행될 수 있다. await가 OS thread를 막으며 기다린다는 뜻도, blocking function이나 CPU 계산을 자동으로 비동기로 바꾼다는 뜻도 아니다.
- project_context: API 호출, 파일 처리, 검색 서버 코드에서 자주 보이는 패턴이다.

## PY36_L07_async_await_001
- level: 7
- file: python_async_queue_batch_jobs_v36.json
- title: async / await 읽기
- question_type: meaning_choice
- concepts: ["return","async","await","coroutine"]
- reading_goal: async 함수와 await가 비동기 작업을 표현하는 방식을 이해한다.
- code:
```python
async def fetch_card(url):
    response = await http_get(url)
    return response.json()
```
- question: await http_get(url)의 의미는?
- answer: 비동기 요청이 끝날 때까지 기다린다
- explanation: async def는 coroutine을 정의하고, await는 기다리는 동안 현재 coroutine을 일시 중단해 event loop가 다른 준비된 작업을 실행할 수 있게 한다. 결과가 오면 해당 지점부터 이어진다. await를 썼다고 모든 호출이 자동 동시 실행되는 것은 아니며 여러 작업을 겹치려면 task 생성 같은 구조가 필요하다.
- project_context: 여러 API 요청을 다루는 Python 백엔드나 JS fetch 흐름과 연결된다.

## PY36_L07_task_001
- level: 7
- file: python_async_queue_batch_jobs_v36.json
- title: task 읽기
- question_type: meaning_choice
- concepts: ["task","asyncio","scheduled_work"]
- reading_goal: 비동기 작업 단위인 task의 의미를 이해한다.
- code:
```python
task1 = asyncio.create_task(fetch("lesson_v35.json"))
task2 = asyncio.create_task(fetch("lesson_v36.json"))

results = await asyncio.gather(task1, task2)
```
- question: task1과 task2는 무엇을 나타내는가?
- answer: 동시에 진행할 수 있는 비동기 작업
- explanation: create_task는 coroutine을 event loop에 실행하도록 예약하고 Task 객체를 돌려준다. 두 fetch가 독립적이면 I/O 대기 시간을 겹칠 수 있고 gather가 두 결과를 순서대로 모은다. 예외 처리 정책을 정하지 않으면 한 작업의 실패가 gather 호출을 실패시킬 수 있으므로 취소·부분 결과 정책도 설계해야 한다.
- project_context: 여러 lesson이나 API 요청을 병렬처럼 가져오는 구조를 이해하는 데 필요하다.

## PY38_L07_access_token_001
- level: 7
- file: python_auth_security_tokens_permissions_v38.json
- title: access token 읽기
- question_type: meaning_choice
- concepts: ["access_token","API","authorization_header"]
- reading_goal: API 요청 때 사용자를 증명하는 access token의 역할을 이해한다.
- code:
```python
Authorization: Bearer access_token_abc123

GET /api/progress
```
- question: Authorization header의 access token은 왜 보내는가?
- answer: API가 요청한 사용자를 확인하게 하려고
- explanation: access token은 API에 제시하는 bearer credential이다. 서버는 토큰의 서명 또는 조회 결과, issuer, audience, expiry, scope를 검증한 뒤 요청자와 허용 작업을 판단한다. Authorization 헤더에 문자열이 있다는 사실만으로 인증되는 것은 아니며 TLS로 전송하고 로그에 남기지 않아야 한다.
- project_context: 프론트엔드가 progress 저장 API를 호출할 때 필요한 구조다.

## PY38_L07_session_001
- level: 7
- file: python_auth_security_tokens_permissions_v38.json
- title: login session 읽기
- question_type: meaning_choice
- concepts: ["session","login_state","cookie"]
- reading_goal: 로그인 상태를 일정 시간 유지하는 session 개념을 이해한다.
- code:
```python
session:
  user_id = "u1"
  expires_at = "2026-05-30T10:00:00"
```
- question: session의 역할은?
- answer: 로그인 상태를 일정 시간 유지한다
- explanation: 서버 기반 session은 로그인 성공 뒤 임의의 session ID를 만들고, 실제 사용자·만료 정보는 서버 저장소에 보관하는 방식이다. 브라우저는 보통 Secure·HttpOnly·SameSite 속성을 둔 cookie로 ID만 보내며 매 요청마다 비밀번호를 다시 보내지 않는다. 만료, 로그아웃 시 폐기, ID 재생성도 함께 설계한다.
- project_context: 학습앱에서 로그인 후 진행률을 계속 저장하려면 세션/토큰 개념이 필요하다.
