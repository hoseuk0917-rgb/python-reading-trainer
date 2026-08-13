# V356 semantic review — Level 7 chunk 5

Cards 81-100 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY10_L07_tsv_parse_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: TSV 한 줄 파싱 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","split","tsv","dict"]
- reading_goal: 탭으로 나뉜 한 줄을 dict로 바꾸는 코드를 읽는다.
- code:
```python
def parse_line(line):
    parts = line.split("\t")
    return {"id": parts[0], "title": parts[1]}

print(parse_line("1\tNews")["title"])
```
- question: 출력은?
- answer: News
- explanation: TSV는 탭 문자로 컬럼을 나눈 텍스트 표 형식이다. 한 줄을 탭 기준으로 split하면 parts[1] 위치에 News가 들어간다. CSV와 비슷하지만 쉼표가 아니라 탭을 기준으로 나누기 때문에 split('\t') 형태를 확인해야 한다.
- project_context: 리뷰 TSV, 매핑표, 라벨링 결과를 읽는 기초다.

## PY10_L07_validation_function_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: 검증 함수 읽기
- question_type: output_prediction
- concepts: ["def","return","print","validation","function","dict"]
- reading_goal: 필수 key가 있는지 검사하는 함수를 읽는다.
- code:
```python
def is_valid(row):
    return "id" in row and "title" in row

print(is_valid({"id": "1"}))
```
- question: 출력은?
- answer: False
- explanation: and는 양쪽 조건이 모두 참일 때만 True를 반환한다. 입력 dict에는 id 키는 있지만 title 키는 없으므로 두 번째 조건이 False가 되어 함수가 False를 반환한다. 이 함수는 판정값만 돌려줄 뿐 저장을 자동으로 중단하지는 않으며, 호출하는 코드가 반환값을 확인해 다음 동작을 결정해야 한다.
- project_context: 카드/JSONL/메타데이터 품질 검증과 직접 연결된다.

## PY39_L07_localstorage_001
- level: 7
- file: python_frontend_state_storage_cache_v39.json
- title: localStorage 읽기
- question_type: meaning_choice
- concepts: ["localStorage","browser_storage","persistence"]
- reading_goal: 브라우저에 작은 데이터를 오래 저장하는 localStorage를 이해한다.
- code:
```python
localStorage.setItem("studyMode", "review")
const mode = localStorage.getItem("studyMode")
```
- question: localStorage의 특징으로 맞는 것은?
- answer: 브라우저에 값을 저장해 새로고침 후에도 남길 수 있다
- explanation: localStorage는 같은 origin의 브라우저 저장소에 문자열을 두며 새로고침과 브라우저 재시작 뒤에도 남을 수 있다. JSON 저장 시 stringify·parse와 손상·schema 변경을 처리해야 한다. 같은 origin의 JavaScript가 읽을 수 있으므로 access token이나 비밀값을 저장하기에는 XSS 위험이 크다.
- project_context: 로그인 전 개인 설정, 추천 옵션, 마지막 선택 레벨 저장에 사용할 수 있다.

## PY39_L07_sessionstorage_001
- level: 7
- file: python_frontend_state_storage_cache_v39.json
- title: sessionStorage 읽기
- question_type: meaning_choice
- concepts: ["sessionStorage","browser_storage","session"]
- reading_goal: 탭 세션 동안만 유지되는 sessionStorage를 이해한다.
- code:
```python
sessionStorage.setItem("temporaryFilter", "level10")
```
- question: sessionStorage가 localStorage와 다른 점으로 가까운 것은?
- answer: 탭/세션이 끝나면 사라질 수 있다
- explanation: sessionStorage는 임시 필터처럼 오래 보관할 필요가 적은 값에 적합하다. sessionStorage는 브라우저 탭이 살아 있는 동안만 값을 저장하는 저장소다. localStorage와 달리 탭을 닫으면 사라질 수 있으므로 임시 상태 저장에 적합하다. 따라서 정답은 ‘탭/세션이 끝나면 사라질 수 있다’이다.
- project_context: 잠깐 쓰는 검색 필터나 현재 세션의 UI 선택값에 어울린다.

## PY39_L07_ui_state_server_state_001
- level: 7
- file: python_frontend_state_storage_cache_v39.json
- title: UI state와 server state 구분
- question_type: meaning_choice
- concepts: ["UI_state","server_state","frontend"]
- reading_goal: 화면 내부 상태와 서버에서 온 데이터를 구분한다.
- code:
```python
UI state:
  isSettingsOpen = true

server state:
  progress = await fetch("/api/progress")
```
- question: isSettingsOpen은 어떤 상태에 가까운가?
- answer: UI state
- explanation: isSettingsOpen은 현재 화면에서만 의미가 있는 UI state다. progress는 서버가 소유하는 데이터의 로컬 사본이므로 server state로 본다. server state에는 loading, error, stale 여부와 재검증 정책이 필요하고, UI state와 섞으면 서버 갱신 뒤 화면이 어긋나기 쉽다.
- project_context: 추천 10장 설정 패널, 모바일 학습도구 접기/펴기는 UI state다.

## PY30_L07_function_input_output_001
- level: 7
- file: python_function_design_io_v30.json
- title: 함수 input/output 읽기
- question_type: meaning_choice
- concepts: ["def","return","function","input","output","parameter"]
- reading_goal: 함수가 무엇을 입력받고 무엇을 반환하는지 구분한다.
- code:
```python
def get_card_title(card):
    return card["title"]

title = get_card_title({"id": "c1", "title": "함수 읽기"})
```
- question: 이 함수의 입력과 출력으로 맞는 것은?
- answer: 입력: card dict, 출력: title 문자열
- explanation: function input/output은 함수가 무엇을 받고 무엇을 돌려주는지 보는 관점이다. parameter로 card를 받아 card 안의 title 값을 반환할 수 있다.
- project_context: renderCard, filterCards 같은 함수도 입력과 출력 관점으로 읽으면 구조가 보인다.

## PY30_L07_helper_function_001
- level: 7
- file: python_function_design_io_v30.json
- title: helper function 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","helper_function","reuse","function_design"]
- reading_goal: 반복되는 작은 작업을 helper 함수로 빼는 이유를 이해한다.
- code:
```python
def is_unseen(card, progress):
    return not progress["seen"].get(card["id"])

queue = [card for card in cards if is_unseen(card, progress)]
```
- question: is_unseen 함수의 역할은?
- answer: 카드가 아직 안 본 카드인지 판정한다
- explanation: helper function은 큰 작업에서 반복되거나 독립적으로 설명할 수 있는 작은 단계를 분리한 함수다. 여기서는 normalize_title이 title의 양끝 공백을 제거하고 소문자로 바꾸는 한 가지 일을 맡는다. 이런 작은 함수로 빼면 같은 정규화를 여러 곳에서 재사용하고 그 동작만 따로 테스트하기 쉽다.
- project_context: 오늘 큐, 복습 우선, 추천 진도 같은 기능을 작게 쪼개는 방식이다.

## PY33_L07_git_add_001
- level: 7
- file: python_git_github_workflow_v33.json
- title: git add 읽기
- question_type: meaning_choice
- concepts: ["git_add","staging_area","commit"]
- reading_goal: 커밋에 포함할 파일을 staging area에 올리는 명령을 이해한다.
- code:
```python
git add data/lessons/python_git_github_workflow_v33.json src/pwa/app.js
```
- question: Git 기본 workflow에서 git add의 역할은?
- answer: 다음 커밋에 포함할 변경사항을 준비한다
- explanation: git add는 수정한 파일을 다음 커밋에 포함할 준비 영역으로 올리는 명령이다. 원격 저장소에 올리는 단계가 아니라 커밋 준비 단계다. 수정한 모든 파일이 자동으로 커밋되는 것이 아니므로 git status와 함께 staged 상태를 확인해야 한다.
- project_context: lesson JSON과 app.js를 함께 커밋하려면 둘 다 add해야 한다.

## PY33_L07_git_commit_001
- level: 7
- file: python_git_github_workflow_v33.json
- title: git commit 읽기
- question_type: meaning_choice
- concepts: ["git_commit","snapshot","message"]
- reading_goal: staged 변경사항을 하나의 기록으로 남기는 commit을 이해한다.
- code:
```python
git commit -m "Add Git workflow reading cards"
```
- question: commit message의 역할은?
- answer: 이번 변경의 목적을 짧게 기록한다
- explanation: git commit은 준비된 변경을 하나의 기록으로 저장하는 명령이다. 커밋 메시지는 나중에 변경 이력을 읽을 때 무엇을 했는지 알려준다. 좋은 커밋 메시지는 변경 이유와 범위를 짧게 남겨 나중에 로그만 봐도 흐름을 복원하게 해 준다. 따라서 정답은 ‘이번 변경의 목적을 짧게 기록한다’이다.
- project_context: v28~v32처럼 주제별 확장을 커밋 메시지로 남겨두면 추적이 쉽다.

## PY33_L07_untracked_unstaged_001
- level: 7
- file: python_git_github_workflow_v33.json
- title: untracked와 unstaged 읽기
- question_type: meaning_choice
- concepts: ["untracked","unstaged","git_status"]
- reading_goal: Git이 아직 추적하지 않는 파일과 수정됐지만 add 안 된 파일을 구분한다.
- code:
```python
Changes not staged for commit:
  modified: src/pwa/app.js

Untracked files:
  data/lessons/new_lesson.json
```
- question: Untracked files에 있는 파일은 어떤 상태인가?
- answer: Git이 아직 추적하지 않는 새 파일
- explanation: 새로 만든 lesson JSON은 git add 전까지 untracked로 보일 수 있다. untracked는 Git이 아직 추적하지 않는 새 파일이고, unstaged는 수정됐지만 커밋 후보에 올리지 않은 변경이다. git status에서 둘을 구분해야 한다.
- project_context: 새 v33 lesson 파일은 처음에는 untracked로 나타나는 것이 정상이다.

## PY48_L07_checkout_action_001
- level: 7
- file: python_github_actions_ci_validation_v48.json
- title: checkout action 읽기
- question_type: meaning_choice
- concepts: ["checkout","GitHub_Actions","repository"]
- reading_goal: CI 서버에서 저장소 파일을 가져오는 checkout 단계를 이해한다.
- code:
```python
- uses: actions/checkout@v4
```
- question: actions/checkout의 역할은?
- answer: CI 실행 환경에 저장소 파일을 내려받는다
- explanation: actions/checkout은 runner workspace에 event가 가리키는 repository revision을 받아 뒤 step이 file을 읽게 한다. 보안 요구가 높은 workflow에서는 movable major tag만 믿지 않고 검토한 full commit SHA로 pin하고 Dependabot 같은 절차로 갱신한다. credential persistence와 fetch-depth도 작업 필요에 맞게 제한한다.
- project_context: validate_lessons.py와 data/lessons 파일을 CI에서 읽으려면 checkout 단계가 필요하다.

## PY48_L07_setup_python_action_001
- level: 7
- file: python_github_actions_ci_validation_v48.json
- title: setup-python action 읽기
- question_type: meaning_choice
- concepts: ["setup_python","Python","CI"]
- reading_goal: CI 환경에서 Python 버전을 준비하는 단계를 이해한다.
- code:
```python
- uses: actions/setup-python@v5
  with:
    python-version: '3.11'
```
- question: setup-python 단계가 필요한 이유는?
- answer: 검증 스크립트를 실행할 Python 환경을 준비하기 위해
- explanation: setup-python은 runner에 요청한 Python 3.11 계열을 준비하고 PATH에 둔다. 정확한 재현성이 필요하면 patch version과 dependency lock을 pin하고, ubuntu-latest image 변화도 고려한다. 표준 library만 쓴다는 사실은 repository script가 항상 같은 결과를 낸다는 보장은 아니다.
- project_context: tools/validate_lessons.py는 표준 Python만 사용하므로 setup-python 뒤 바로 실행할 수 있다.

## PY48_L07_yaml_indentation_001
- level: 7
- file: python_github_actions_ci_validation_v48.json
- title: YAML 들여쓰기 읽기
- question_type: meaning_choice
- concepts: ["YAML","indentation","configuration"]
- reading_goal: YAML 설정 파일에서 들여쓰기가 구조를 결정한다는 점을 이해한다.
- code:
```python
jobs:
  validate:
    runs-on: ubuntu-latest
```
- question: YAML에서 들여쓰기가 중요한 이유는?
- answer: 들여쓰기가 설정의 포함 관계를 나타내기 때문
- explanation: YAML은 괄호보다 들여쓰기로 계층을 표현하므로 공백이 틀리면 설정 의미가 바뀔 수 있다. YAML 들여쓰기는 GitHub Actions 설정에서 구조를 결정한다. 한 칸만 어긋나도 job, step, run 위치가 달라질 수 있어 오류 원인이 된다. 따라서 정답은 ‘들여쓰기가 설정의 포함 관계를 나타내기 때문’이다.
- project_context: GitHub Actions workflow를 만들 때 jobs, steps, run의 들여쓰기를 맞춰야 한다.

## PY15_L07_authn_authz_001
- level: 7
- file: python_grouped_concepts_v15.json
- title: Authentication / Authorization 비교
- question_type: meaning_choice
- concepts: ["authentication","authorization","security","access_control"]
- reading_goal: 인증과 권한 부여의 역할 차이를 코드 흐름에서 구분한다.
- code:
```python
Authentication: 사용자가 누구인지 자격 증명으로 확인
Authorization: 확인된 사용자가 요청한 작업을 해도 되는지 권한 확인
```
- question: 사용자가 특정 API를 호출할 권한이 있는지 확인하는 것은?
- answer: Authorization
- explanation: authentication은 비밀번호나 토큰 등으로 신원을 확인하는 단계다. authorization은 그 신원에 허용된 작업과 자원을 검사하는 단계다. 로그인에 성공했어도 모든 API를 호출할 권한이 생기는 것은 아니므로 두 검사를 분리해야 한다.
- project_context: API 서버, OAuth, JWT 코드를 읽을 때 반드시 필요한 구분이다.

## PY15_L07_entity_relation_attribute_001
- level: 7
- file: python_grouped_concepts_v15.json
- title: Entity / Relation / Attribute 비교
- question_type: meaning_choice
- concepts: ["entity","relation","attribute","knowledge_graph"]
- reading_goal: KG에서 entity, relation, attribute의 역할을 구분해 읽는다.
- code:
```python
Entity: LiDAR, Radar, UAM처럼 구별해 다루는 대상
Relation: LiDAR PRODUCES PointCloud처럼 대상 사이의 연결
Attribute: label, version, score처럼 대상이나 관계에 붙는 속성값
```
- question: LiDAR PRODUCES PointCloud에서 PRODUCES는?
- answer: Relation
- explanation: entity는 구별해 관리하는 대상이고, relation은 두 대상 사이의 의미 있는 연결이다. attribute는 entity나 relation의 세부 특성을 나타내는 값이다. 예문에서 PRODUCES는 LiDAR와 PointCloud를 연결하므로 relation이다.
- project_context: node/edge/evidence를 읽을 때 가장 기본이 되는 구분이다.

## PY15_L07_float_precision_001
- level: 7
- file: python_grouped_concepts_v15.json
- title: float precision error 읽기
- question_type: meaning_choice
- concepts: ["comment","print","float","precision_error","rounding"]
- reading_goal: 실수형 계산에서 작은 오차가 생길 수 있음을 이해한다.
- code:
```python
print(0.1 + 0.2)
# 0.30000000000000004가 출력됨
```
- question: 이 현상의 원인에 가까운 것은?
- answer: float가 소수를 근사 표현하기 때문
- explanation: 파이썬 float는 대부분의 소수를 이진 분수의 근삿값으로 저장한다. 0.1과 0.2의 저장 오차가 덧셈 뒤 드러나므로 0.3과 정확히 같은 비트 값이 되지 않는다. 근삿값 비교에는 math.isclose 같은 허용 오차를 쓰고, 정확한 10진 규칙이 필요하면 Decimal을 검토한다.
- project_context: 모델 점수/평균/비용 계산 결과를 읽을 때 당황하지 않게 해준다.

## PY15_L07_kg_ontology_taxonomy_schema_001
- level: 7
- file: python_grouped_concepts_v15.json
- title: Taxonomy / Ontology / Schema / KG 한 번에 비교
- question_type: meaning_choice
- concepts: ["taxonomy","ontology","schema","knowledge_graph","semantic"]
- reading_goal: 지식 구조 개념을 따로 외우지 않고 역할 차이로 묶어 이해한다.
- code:
```python
Taxonomy: 대상을 상하위 범주로 분류하는 체계
Schema: 데이터 필드, 자료형, 구조, 제약을 정하는 명세
Ontology: 개념, 관계, 제약을 형식적으로 표현한 의미 모델
Knowledge Graph: 실제 개체와 관계를 노드와 엣지로 저장한 그래프 데이터
```
- question: 개념과 관계, 제약까지 정의하는 의미 모델에 가까운 것은?
- answer: Ontology
- explanation: taxonomy는 대상을 범주로 분류하고, schema는 데이터의 모양과 제약을 정한다. ontology는 개념과 관계의 의미를 형식적으로 정의한다. knowledge graph는 그 정의를 활용해 실제 개체와 관계를 그래프 데이터로 담을 수 있다. 네 용어가 함께 쓰이기도 하지만 서로 같은 뜻은 아니다.
- project_context: KG의 노드, 엣지, 스키마를 설계할 때 필요한 기본 구분이다.

## PY15_L07_none_empty_nan_001
- level: 7
- file: python_grouped_concepts_v15.json
- title: None / empty / NaN 비교
- question_type: meaning_choice
- concepts: ["none","empty_string","nan","missing_value"]
- reading_goal: None, 빈 값, NaN이 서로 다른 상태임을 구분한다.
- code:
```python
None: 값이 없음을 나타내는 파이썬의 단일 객체
"": 존재하지만 길이가 0인 문자열
NaN: 수치 계산에서 정의되지 않은 값이며 pandas가 결측 표시에 자주 사용하는 특수값
```
- question: pandas 수치 컬럼에서 결측으로 자주 보이는 값은?
- answer: NaN
- explanation: None, 빈 문자열, NaN은 화면에서 모두 비어 보일 수 있지만 같은 값이 아니다. pandas의 isna는 기본적으로 None과 NaN을 결측으로 찾지만 빈 문자열은 결측으로 보지 않는다. NaN은 자기 자신과도 같지 않으므로 == 대신 math.isnan이나 pandas.isna 같은 함수를 사용한다.
- project_context: 데이터 품질검사와 결측 처리 코드리뷰에 중요하다.

## PY62_L07_language_toggle_001
- level: 7
- file: python_i18n_locale_language_toggle_v62.json
- title: language toggle 읽기
- question_type: meaning_choice
- concepts: ["language_toggle","settings","UX"]
- reading_goal: 사용자가 앱 언어를 직접 바꾸는 language toggle을 이해한다.
- code:
```python
setLocale('en-US')
```
- question: language toggle의 목적은?
- answer: 사용자가 원하는 언어로 앱을 바꾸게 하기 위해
- explanation: language toggle은 사용자가 표시 언어를 직접 바꾸는 기능이다. 선택한 태그가 앱이 지원하는지 확인한 뒤 저장하고, 번역 문구뿐 아니라 날짜·숫자와 접근성 이름도 다시 렌더링해야 한다. 언어를 바꿔도 사용자가 작성한 메모나 코드 자체는 동의 없이 번역하거나 바꾸지 않는다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L07_message_key_001
- level: 7
- file: python_i18n_locale_language_toggle_v62.json
- title: message key 읽기
- question_type: meaning_choice
- concepts: ["message_key","translation","i18n"]
- reading_goal: 문구를 직접 쓰지 않고 key로 찾아오는 message key 방식을 이해한다.
- code:
```python
t('button.next')
```
- question: message key를 쓰는 이유는?
- answer: 같은 의미의 문구를 언어별로 안정적으로 찾아오기 위해
- explanation: message key는 화면 문구를 직접 쓰지 않고 번역표에서 찾는 안정적인 이름이다. button.next처럼 역할을 나타내는 key를 쓰면 영어 원문이 바뀌어도 코드 위치를 바꿀 필요가 적다. 같은 단어라도 문맥과 문법 역할이 다르면 별도 key를 써야 번역자가 자연스러운 문장을 만들 수 있다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.
