# V356 semantic review — Level 9 chunk 9

Cards 161-180 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY39_L09_service_worker_001
- level: 9
- file: python_frontend_state_storage_cache_v39.json
- title: service worker 기초 읽기
- question_type: meaning_choice
- concepts: ["service_worker","PWA","offline_cache"]
- reading_goal: PWA에서 네트워크 요청과 캐시를 중간에서 다룰 수 있는 service worker를 이해한다.
- code:
```python
self.addEventListener("fetch", event => {
  event.respondWith(cacheFirst(event.request))
})
```
- question: service worker의 역할로 가장 가까운 것은?
- answer: 요청을 가로채 캐시나 네트워크 응답을 선택할 수 있다
- explanation: service worker는 자신의 scope 안에서 fetch event를 가로채 custom cacheFirst 함수가 고른 Response를 돌려줄 수 있다. cache-first는 offline과 속도에 유리하지만 오래된 응답을 계속 제공할 수 있다. install·activate·control lifecycle과 cache 이름 정리, update 전략을 함께 이해해야 한다.
- project_context: PWA로 배포할 때 최신 lesson 반영 문제를 이해하는 데 중요하다.

## PY30_L09_parser_function_001
- level: 9
- file: python_function_design_io_v30.json
- title: parser function 읽기
- question_type: meaning_choice
- concepts: ["def","return","import","parser","json","function","input_output"]
- reading_goal: 문자열이나 파일 내용을 구조화 데이터로 바꾸는 parser 함수를 이해한다.
- code:
```python
import json

def parse_card_json(text):
    data = json.loads(text)
    return data
```
- question: parse_card_json의 역할은?
- answer: JSON 문자열을 Python 데이터로 바꾼다
- explanation: parser는 raw text를 list/dict 같은 구조화된 데이터로 바꾸는 함수다. parser function은 문자열이나 파일 내용을 프로그램이 쓰기 쉬운 구조로 바꾸는 함수다. 입력 형식, 실패 처리, 반환되는 dict나 list의 모양을 함께 확인해야 한다. 따라서 반환/호출 결과는 ‘JSON 문자열을 Python 데이터로 바꾼다’이다.
- project_context: lesson JSON, manifest, API 응답을 읽을 때 parser 함수가 필요하다.

## PY30_L09_renderer_function_001
- level: 9
- file: python_function_design_io_v30.json
- title: renderer function 읽기
- question_type: meaning_choice
- concepts: ["def","return","import","renderer","html","ui","function"]
- reading_goal: 데이터를 화면 표시용 HTML 문자열로 바꾸는 renderer 함수를 이해한다.
- code:
```python
from html import escape

def render_title(card):
    title = escape(str(card["title"]))
    return f"<h2>{title}</h2>"
```
- question: 이 함수는 무엇을 만드는가?
- answer: 카드 title을 담은 HTML 문자열
- explanation: card title을 문자열로 바꾸고 html.escape로 <, &, quote 같은 문자를 encoding한 뒤 h2 HTML string을 만든다. 원래처럼 untrusted title을 그대로 삽입하면 결과를 innerHTML에 사용할 때 XSS가 될 수 있다. 가능한 경우 DOM textContent나 template의 auto-escaping을 쓰고 rendering context에 맞는 escaping을 적용한다.
- project_context: app.js의 renderCard, renderSideCards를 읽을 때 중요한 개념이다.

## PY30_L09_side_effect_001
- level: 9
- file: python_function_design_io_v30.json
- title: side effect 읽기
- question_type: meaning_choice
- concepts: ["side_effect","localStorage","file_write","state"]
- reading_goal: 함수가 외부 상태를 바꾸는 side effect를 구분한다.
- code:
```python
function saveProgress(progress) {
  localStorage.setItem("progress", JSON.stringify(progress));
}
```
- question: 이 함수의 side effect는?
- answer: localStorage에 값을 저장한다
- explanation: 이 code는 JavaScript function이며 localStorage라는 external browser state를 변경하고 반환값은 undefined다. JSON.stringify나 setItem은 circular data, quota 또는 privacy setting 때문에 실패할 수 있다. 핵심 계산과 storage adapter를 분리하면 test가 쉬워지고 caller가 error를 처리할 수 있다.
- project_context: loadProgress/saveProgress처럼 상태 저장 함수는 side effect가 있는 함수다.

## PY30_L09_validation_function_001
- level: 9
- file: python_function_design_io_v30.json
- title: validation function 읽기
- question_type: meaning_choice
- concepts: ["if","def","return","validation","function","data_quality"]
- reading_goal: 데이터가 조건을 만족하는지 검사하고 문제 목록을 반환하는 함수를 이해한다.
- code:
```python
def validate_card(card):
    errors = []
    if "id" not in card:
        errors.append("missing id")
    if card.get("answer") not in card.get("choices", []):
        errors.append("bad answer")
    return errors
```
- question: 검증에 문제가 없으면 이 함수는 무엇을 반환하는가?
- answer: 빈 리스트
- explanation: errors에 아무것도 추가되지 않으면 []가 반환된다. 문제 목록이 곧 검증 결과다. validation function은 입력값이 규칙에 맞는지 검사하는 함수다. 반환값이 True/False인지, 오류 메시지인지, 예외를 던지는지 확인하면 사용 흐름이 보인다. 따라서 반환/호출 결과는 ‘빈 리스트’이다.
- project_context: 매 확장 후 DUPLICATE/ANSWER/BAD LEVEL 검증을 함수화할 때 쓰는 구조다.

## PY33_L09_branch_basic_001
- level: 9
- file: python_git_github_workflow_v33.json
- title: branch 기초 읽기
- question_type: meaning_choice
- concepts: ["branch","main","feature"]
- reading_goal: main과 작업용 branch의 차이를 이해한다.
- code:
```python
git switch -c feature/v33-git-cards
```
- question: 이 명령의 의미는?
- answer: 새 작업 브랜치를 만들고 이동한다
- explanation: branch는 main과 분리된 작업 흐름을 만드는 Git 기능이다. 실험 작업이나 큰 변경을 안전하게 진행한 뒤 나중에 합칠 수 있다. main을 바로 바꾸기 부담스러운 수정은 새 branch에서 검증한 뒤 merge하는 식으로 관리한다. 따라서 정답은 ‘새 작업 브랜치를 만들고 이동한다’이다.
- project_context: 큰 변경은 작업 브랜치에서 검증한 뒤 main에 병합하면 main의 안정성을 지키기 쉽다.

## PY33_L09_git_restore_001
- level: 9
- file: python_git_github_workflow_v33.json
- title: git restore 주의해서 읽기
- question_type: meaning_choice
- concepts: ["git_restore","rollback","danger"]
- reading_goal: 커밋하지 않은 변경을 되돌리는 restore의 위험을 이해한다.
- code:
```python
git restore src/pwa/app.js
```
- question: 이 명령의 위험은?
- answer: app.js의 커밋되지 않은 수정이 사라질 수 있다
- explanation: 기본 git restore <파일>은 작업 트리의 해당 파일을 index에 있는 내용으로 되돌려 stage하지 않은 수정을 버릴 수 있다. stage된 변경은 기본적으로 그대로 남는다. 실행 전 status와 두 종류의 diff를 확인하고, HEAD 복원이나 stage 해제는 --source 또는 --staged 옵션의 의미를 구분해야 한다.
- project_context: 패치가 잘못됐을 때 쓰지만, 필요한 변경까지 날리지 않게 조심해야 한다.

## PY33_L09_merge_conflict_001
- level: 9
- file: python_git_github_workflow_v33.json
- title: merge conflict 기초 읽기
- question_type: meaning_choice
- concepts: ["merge_conflict","git","conflict_marker"]
- reading_goal: 같은 줄을 서로 다르게 고쳤을 때 생기는 충돌 표시를 이해한다.
- code:
```python
<<<<<<< HEAD
APP_DATA_VERSION = "v32"
=======
APP_DATA_VERSION = "v33"
>>>>>>> feature
```
- question: 이 표시는 무엇을 의미하는가?
- answer: Git이 어느 변경을 선택할지 자동 결정하지 못했다
- explanation: <<<<<<<, =======, >>>>>>>는 두 버전이 충돌한 구간을 표시한다. Git이 어느 내용을 남길지 결정하지 못했으므로 사람이 올바른 최종 값을 만들고 모든 marker를 제거한 뒤 테스트하고 add·commit해야 한다. 표시 자체는 유효한 Python 코드가 아니다.
- project_context: 여러 패치가 app.js 같은 같은 줄을 건드릴 때 생길 수 있다.

## PY48_L09_local_vs_ci_001
- level: 9
- file: python_github_actions_ci_validation_v48.json
- title: local check vs CI check 읽기
- question_type: meaning_choice
- concepts: ["local_check","CI_check","defense_in_depth"]
- reading_goal: 로컬 검증과 원격 CI 검증을 둘 다 두는 이유를 이해한다.
- code:
```python
local: python tools/validate_lessons.py
remote: GitHub Actions runs same script
```
- question: 로컬 검증과 CI 검증을 둘 다 쓰는 이유는?
- answer: 내 컴퓨터와 원격 저장소 양쪽에서 같은 기준으로 확인하기 위해
- explanation: 같은 script를 local과 CI에서 실행하면 rule drift를 줄이고 feedback을 빨리 받는다. 하지만 OS, Python patch, locale, timezone, dependency와 environment variable이 다르면 결과가 달라질 수 있다. CI environment를 명시적으로 pin하고 local 재현 방법을 문서화한다.
- project_context: v48 이후에는 로컬에서도 CI에서도 tools/validate_lessons.py를 같은 기준으로 실행한다.

## PY48_L09_path_filter_001
- level: 9
- file: python_github_actions_ci_validation_v48.json
- title: path filter 읽기
- question_type: meaning_choice
- concepts: ["path_filter","workflow_trigger","changed_files"]
- reading_goal: 특정 경로가 바뀔 때만 CI를 실행하는 path filter를 이해한다.
- code:
```python
paths:
  - 'data/lessons/**'
  - 'src/pwa/app.js'
```
- question: path filter를 쓰는 이유는?
- answer: 관련 파일이 바뀔 때만 검증을 실행하기 위해
- explanation: paths filter는 나열된 경로가 바뀐 event에서만 workflow를 실행해 비용을 줄인다. validator, workflow, dependency file, side card처럼 결과에 영향을 주는 모든 경로를 포함해야 하며 누락하면 필요한 검사가 skip된다. branch protection의 required check와 filter 조합에서 대기 상태가 생기는지도 확인한다.
- project_context: lesson, side_cards, app.js, validator가 바뀔 때만 lesson 검증 workflow를 돌릴 수 있다.

## PY48_L09_pull_request_check_001
- level: 9
- file: python_github_actions_ci_validation_v48.json
- title: pull request check 읽기
- question_type: meaning_choice
- concepts: ["pull_request","review","CI_check"]
- reading_goal: PR 단계에서 검증을 돌려 병합 전 오류를 잡는 방식을 이해한다.
- code:
```python
on:
  pull_request:
    branches: [ main ]
```
- question: pull_request check의 장점은?
- answer: main에 합치기 전에 오류를 발견할 수 있다
- explanation: pull request check는 main에 합치기 전에 변경 내용을 자동 검증하는 절차다. 안전한 변경만 main으로 들어오게 하는 품질 관문이다. PR 단계에서 실패를 잡으면 main 브랜치의 안정성을 유지하고 리뷰 부담도 줄일 수 있다.
- project_context: 혼자 작업하더라도 나중에 브랜치 작업이 생기면 PR 검증이 유용하다.

## PY15_L09_feedback_calibration_latency_001
- level: 9
- file: python_grouped_concepts_v15.json
- title: Feedback / Calibration / Latency 비교
- question_type: meaning_choice
- concepts: ["feedback","calibration","latency","control"]
- reading_goal: 제어/센서 시스템에서 자주 보는 세 개념을 구분한다.
- code:
```python
Feedback: 출력 결과를 다시 입력으로 사용해 다음 동작을 조정
Calibration: 알려진 기준과 비교해 센서나 장치의 변환값·파라미터를 맞춤
Latency: 입력이나 요청부터 관측 가능한 반응까지 걸리는 지연 시간
```
- question: 센서 값이 실제보다 계속 치우쳐 있을 때 맞추는 과정은?
- answer: Calibration
- explanation: feedback은 결과를 다음 제어 입력에 되돌리는 흐름이다. calibration은 알려진 기준값과 측정값을 비교해 offset, scale 같은 보정 파라미터를 추정한다. latency는 입력과 반응 사이의 시간 차이다. 센서 값이 일정하게 치우쳐 있다면 기준에 맞추는 calibration을 먼저 떠올릴 수 있다.
- project_context: 센서퓨전/제어/검증 문서에서 자주 등장한다.

## PY15_L09_hallucination_grounding_citation_001
- level: 9
- file: python_grouped_concepts_v15.json
- title: Hallucination / Grounding / Citation 비교
- question_type: meaning_choice
- concepts: ["hallucination","grounding","citation","rag"]
- reading_goal: LLM 답변 신뢰성과 근거 연결 개념을 구분한다.
- code:
```python
Hallucination: 모델이 사실과 다르거나 입력 근거로 뒷받침되지 않는 내용을 생성하는 현상
Grounding: 답변이 제공된 문서, 데이터, 도구 결과에 근거하도록 연결하는 과정
Citation: 사용자가 근거를 찾아 확인할 수 있게 출처 위치를 표시하는 것
```
- question: 외부 근거에 답변을 묶는 것은?
- answer: Grounding
- explanation: grounding은 답변을 외부 자료에 연결하고 citation은 사용자가 그 자료를 확인하게 한다. 둘 다 hallucination 위험을 줄이는 데 도움이 되지만, 검색 자료가 틀리거나 인용이 주장을 실제로 뒷받침하지 않으면 답변도 틀릴 수 있다. 따라서 인용 존재뿐 아니라 주장과 출처의 일치도 확인해야 한다.
- project_context: Evidence-first RAG 앱에서 핵심이 되는 개념이다.

## PY15_L09_noise_drift_sync_001
- level: 9
- file: python_grouped_concepts_v15.json
- title: Noise / Drift / Synchronization 비교
- question_type: meaning_choice
- concepts: ["noise","drift","synchronization","sensor"]
- reading_goal: 센서 데이터 품질 문제를 noise, drift, sync 관점으로 묶어 읽는다.
- code:
```python
Noise: 측정값에 섞여 짧은 시간에 불규칙하게 변하는 오차 성분
Drift: 시간이나 환경 변화에 따라 기준이 서서히 이동하는 현상
Synchronization: 여러 센서의 시계와 타임스탬프를 공통 시간축에 맞추는 과정
```
- question: 시간이 지나며 오차가 서서히 누적되는 현상은?
- answer: Drift
- explanation: noise는 측정값의 빠르고 불규칙한 변동으로 나타나고, drift는 기준이 시간에 따라 서서히 이동하는 현상이다. synchronization은 서로 다른 센서의 관측 시점을 맞춰 같은 사건을 비교하게 한다. 필터링, 보정, 시간 동기화는 각각 해결하려는 문제가 다르다.
- project_context: Kalman/filter/sensor fusion 카드와 연결되는 기초 개념이다.

## PY15_L09_prompt_context_guardrail_001
- level: 9
- file: python_grouped_concepts_v15.json
- title: Prompt / Context Window / Guardrail 비교
- question_type: meaning_choice
- concepts: ["prompt","context_window","guardrail","llm"]
- reading_goal: LLM 앱에서 입력·문맥·제한장치를 구분한다.
- code:
```python
Prompt: 모델에 전달하는 지시와 입력
Context window: 한 요청에서 모델이 처리할 수 있는 입력과 생성 토큰의 전체 한도
Guardrail: 위험하거나 정책을 벗어난 입력·출력·도구 행동을 탐지하고 제한하는 장치
```
- question: 모델이 한 번에 볼 수 있는 토큰 범위는?
- answer: Context window
- explanation: context window는 시스템 지시, 대화 기록, 검색 문서, 사용자 입력과 생성할 출력까지 포함하는 토큰 예산이다. prompt는 그 안에 들어가는 지시와 입력이다. guardrail은 위험을 줄이는 여러 검사와 제한을 뜻하지만 모든 오류나 공격을 완전히 막는 보장은 아니다.
- project_context: RAG chunk 선택과 프롬프트 설계에서 중요하다.

## PY15_L09_sensor_actuator_controller_001
- level: 9
- file: python_grouped_concepts_v15.json
- title: Sensor / Actuator / Controller 비교
- question_type: meaning_choice
- concepts: ["sensor","actuator","controller","robotics"]
- reading_goal: sensor, actuator, controller의 역할을 구분해 읽는다.
- code:
```python
Sensor: 환경이나 시스템의 상태를 측정해 신호를 만듦
Controller: 센서 입력과 목표를 바탕으로 액추에이터 명령을 계산
Actuator: 전기·유압 등의 명령 에너지를 움직임이나 힘으로 바꿈
```
- question: 모터처럼 명령을 실제 움직임으로 바꾸는 것은?
- answer: Actuator
- explanation: sensor는 입력을 측정하고 controller는 그 입력과 목표를 이용해 명령을 결정하며 actuator는 명령을 물리 출력으로 바꾼다. 모든 controller가 단순 비교만 하는 것은 아니지만 입력-판단-출력의 흐름으로 구분하면 시스템 구조를 읽기 쉽다.
- project_context: 로봇/UAM/자율주행 기본 구조를 파이썬 학습과 연결한다.

## PY62_L09_bilingual_hint_001
- level: 9
- file: python_i18n_locale_language_toggle_v62.json
- title: bilingual hint 읽기
- question_type: meaning_choice
- concepts: ["bilingual_hint","learning_ux","i18n"]
- reading_goal: 한국어 설명에 영어 원어를 함께 보여주는 bilingual hint를 이해한다.
- code:
```python
label = '캐시(cache)'
```
- question: bilingual hint가 유용한 상황은?
- answer: 한국어 설명과 영어 개발 용어를 함께 익혀야 할 때
- explanation: bilingual hint는 한국어 설명과 영어 개발 용어를 연결하는 보조 표기다. 처음 등장할 때 ‘캐시(cache)’처럼 병기하고 이후에는 익숙한 표현만 쓰면 읽기 부담을 줄일 수 있다. 화면 낭독기가 괄호와 반복 단어를 과도하게 읽지 않는지도 확인하고, 두 표현이 같은 개념을 가리켜야 한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L09_browser_language_001
- level: 9
- file: python_i18n_locale_language_toggle_v62.json
- title: browser language 읽기
- question_type: meaning_choice
- concepts: ["browser_language","navigator_language","locale"]
- reading_goal: 브라우저 언어를 기본 locale 후보로 쓰는 방식을 이해한다.
- code:
```python
defaultLocale = navigator.language || 'ko-KR'
```
- question: browser language를 참고하는 이유는?
- answer: 사용자에게 익숙한 언어를 기본값으로 추정하기 위해
- explanation: navigator.language은 초기 표시 언어를 추정하는 힌트일 뿐이며 실제 사용자가 원하는 언어와 다를 수 있다. navigator.languages의 우선순위를 앱의 지원 locale 목록과 매칭하고, 정확한 지역 태그가 없으면 같은 기본 언어로 단계적으로 fallback한다. 사용자가 언제든 직접 바꿀 수 있어야 한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L09_language_setting_save_001
- level: 9
- file: python_i18n_locale_language_toggle_v62.json
- title: language setting save 읽기
- question_type: meaning_choice
- concepts: ["language_setting","localStorage","settings"]
- reading_goal: 사용자가 고른 언어를 저장해 다음 실행 때 복원하는 방식을 이해한다.
- code:
```python
localStorage.setItem('locale', locale)
```
- question: language setting save의 목적은?
- answer: 사용자가 고른 언어를 다음 실행 때도 유지하기 위해
- explanation: 사용자가 명시적으로 고른 locale을 저장하면 다음 실행에도 같은 UI 언어를 유지할 수 있다. 저장된 값이 현재 지원 목록에 있는지 읽을 때 다시 검사하고, 값이 없을 때만 브라우저 선호 언어로 돌아간다. ‘시스템 설정 사용’ 선택도 제공하면 사용자가 브라우저 언어 변경을 따르게 할 수 있다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L09_term_translation_001
- level: 9
- file: python_i18n_locale_language_toggle_v62.json
- title: term translation 읽기
- question_type: meaning_choice
- concepts: ["term_translation","learning_terms","education_ux"]
- reading_goal: 학습 용어는 일반 문구보다 더 조심스럽게 번역해야 함을 이해한다.
- code:
```python
terms = {'cache': {'ko': '캐시', 'en': 'cache'}}
```
- question: term translation에서 중요한 점은?
- answer: 학습 개념의 의미가 바뀌지 않게 번역하는 것
- explanation: 기술 용어는 단어를 바꾸는 것보다 개념을 같은 범위로 전달하는 것이 중요하다. 용어집에 번역, 원어, 정의와 사용 문맥을 함께 두면 카드마다 표현이 흔들리는 일을 줄일 수 있다. 뜻이 다른데 철자가 같은 용어는 문맥별 항목으로 나누고, 필요하면 원어를 병기한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.
