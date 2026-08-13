# V356 semantic review — Level 7 chunk 6

Cards 101-120 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY62_L07_translation_dict_001
- level: 7
- file: python_i18n_locale_language_toggle_v62.json
- title: translation dictionary 읽기
- question_type: meaning_choice
- concepts: ["translation_dict","messages","i18n"]
- reading_goal: 언어별 문구 묶음을 dictionary로 관리하는 방식을 이해한다.
- code:
```python
messages = {
  'ko-KR': {'next': '다음'},
  'en-US': {'next': 'Next'}
}
```
- question: translation dictionary의 역할은?
- answer: 언어별 화면 문구를 한곳에 모아 관리한다
- explanation: translation dict는 화면 문구의 key와 언어별 번역을 모아 둔 사전이다. 번역 문구가 흩어져 있으면 빠진 문구를 찾기 어렵다. 문구 key를 기준으로 관리하면 같은 UI를 한국어와 영어로 바꿔도 코드 구조는 크게 바뀌지 않는다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY63_L07_goal_progress_001
- level: 7
- file: python_learning_streak_goal_habit_v63.json
- title: goal progress 읽기
- question_type: meaning_choice
- concepts: ["goal_progress","progress","UX"]
- reading_goal: 오늘 목표 중 얼마나 완료했는지 보여주는 goal progress를 이해한다.
- code:
```python
progress = min(completedToday / max(dailyGoal.cards, 1), 1)
```
- question: goal progress의 목적은?
- answer: 오늘 목표 달성 정도를 보여주기 위해
- explanation: goal progress는 오늘 목표 중 완료한 비율을 0에서 1 사이로 보여 준다. 예시는 목표가 0일 때 나눗셈 오류를 피하고, 목표를 넘겨 풀어도 진행 막대가 100%를 넘지 않게 한다. 원래 완료 수는 별도로 보존하고 숫자뿐 아니라 ‘7/10장’ 같은 텍스트도 제공해야 접근하기 쉽다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L07_goal_state_001
- level: 7
- file: python_learning_streak_goal_habit_v63.json
- title: goal state 읽기
- question_type: meaning_choice
- concepts: ["goal_state","localStorage","settings"]
- reading_goal: 사용자의 목표 설정을 상태로 저장하는 goal state를 이해한다.
- code:
```python
goalState = {
  dailyCards: 10,
  enabled: true
}
```
- question: goal state에 들어갈 수 있는 값은?
- answer: 하루 카드 수와 목표 사용 여부
- explanation: 이 예시의 goal state에는 하루 목표 카드 수와 목표 기능 사용 여부가 들어 있다. 현재 진행값은 코드에 없으므로 이 객체가 달성 상태까지 저장한다고 읽으면 안 된다. 진행은 오늘의 완료 기록에서 계산하거나 별도 필드로 명확히 두고, 설정 변경 시 과거 학습 기록을 지우지 않는다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L07_streak_date_001
- level: 7
- file: python_learning_streak_goal_habit_v63.json
- title: streak date 읽기
- question_type: meaning_choice
- concepts: ["streak_date","date_logic","habit"]
- reading_goal: 연속 학습 계산에서 날짜 기준을 명확히 해야 함을 이해한다.
- code:
```python
todayKey = formatDateInTimeZone(new Date(), userTimeZone)
```
- question: streak 계산에서 날짜 기준이 중요한 이유는?
- answer: 같은 날 여러 번 학습해도 하루로 계산해야 하기 때문에
- explanation: 같은 날 여러 번 학습해도 streak에는 하루로 기록해야 한다. new Date().toISOString()은 UTC 날짜이므로 사용자의 현지 날짜와 어긋날 수 있다. 사용자가 정한 time zone으로 날짜 key를 만들고, 여행이나 시간대 변경 시 기존 기록을 어떻게 해석할지도 일관되게 정해야 한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY49_L07_daily_review_queue_001
- level: 7
- file: python_learning_ux_review_algorithm_v49.json
- title: daily review queue 읽기
- question_type: meaning_choice
- concepts: ["for","daily_review","queue","learning_session"]
- reading_goal: 하루에 풀 카드 목록을 review queue로 만드는 흐름을 이해한다.
- code:
```python
queue = due_cards[:20]
for card in queue:
    show_card(card)
```
- question: daily review queue의 역할은?
- answer: 오늘 학습할 카드 목록을 정해준다
- explanation: due_cards가 우선순위와 due time으로 이미 정렬됐다는 전제에서 앞 20개를 오늘 queue로 고른다. 정렬되지 않았다면 중요한 overdue card가 뒤로 밀릴 수 있다. 20은 보편적 최적값이 아니며 사용자 시간, 미처리 backlog와 새 카드 비율에 맞춰 조절한다.
- project_context: 카드가 많아졌기 때문에 하루에 볼 양을 제한하고 우선순위를 정해야 한다.

## PY49_L07_forgetting_curve_001
- level: 7
- file: python_learning_ux_review_algorithm_v49.json
- title: forgetting curve 읽기
- question_type: meaning_choice
- concepts: ["if","forgetting_curve","memory_decay","review_timing"]
- reading_goal: 시간이 지나면 기억이 약해지므로 복습 시점이 중요하다는 점을 이해한다.
- code:
```python
elapsed_days = (today - last_review_date).days
memory_strength = estimate_retention(elapsed_days, prior_strength)
if memory_strength < 0.5:
    schedule_review(card)
```
- question: forgetting curve와 가장 가까운 설명은?
- answer: 시간이 지나면 기억 강도가 떨어질 수 있다는 생각
- explanation: forgetting curve는 복습 뒤 시간이 흐르며 recall probability가 낮아지는 경향을 model한다. 매 실행마다 무조건 0.8을 곱하면 실제 경과 시간을 반영하지 않으므로 이 예시는 elapsed_days를 사용한다. 개인과 자료마다 curve가 다르므로 0.5 threshold도 평가로 정한다.
- project_context: 사용자가 한 번 맞힌 카드도 시간이 지나면 다시 확인할 필요가 있다.

## PY49_L07_review_interval_001
- level: 7
- file: python_learning_ux_review_algorithm_v49.json
- title: review interval 읽기
- question_type: meaning_choice
- concepts: ["if","else","review_interval","schedule","learning_memory"]
- reading_goal: 정답 여부에 따라 다음 복습 간격을 조절하는 방식을 이해한다.
- code:
```python
if correct_count >= 3:
    interval_days = 7
elif correct_count == 2:
    interval_days = 3
else:
    interval_days = 1
```
- question: review interval을 조절하는 이유는?
- answer: 잘 아는 카드는 덜 자주, 약한 카드는 더 자주 보기 위해
- explanation: 이 rule은 누적 correct_count만으로 1·3·7일을 정하는 예시다. 최근 실패, 답변 난이도, 마지막 간격과 시간 경과를 무시하므로 숙련도를 정확히 추정하지는 않는다. 실제 algorithm은 interval 상한·하한과 lapse 정책을 정하고 학습 결과로 보정한다.
- project_context: Python 카드 학습앱에서 난이도와 정답 이력을 기반으로 다음 복습일을 정할 수 있다.

## PY11_L07_collections_counter_001
- level: 7
- file: python_libraries_missing_topics_v11.json
- title: collections.Counter 읽기
- question_type: output_prediction
- concepts: ["import","print","collections","Counter","count"]
- reading_goal: Counter로 리스트 안 값의 등장 횟수를 세는 코드를 읽는다.
- code:
```python
from collections import Counter

domains = ["AI", "UAM", "AI"]
counts = Counter(domains)
print(counts["AI"])
```
- question: 출력은?
- answer: 2
- explanation: collections.Counter는 리스트 안 값이 몇 번 등장했는지 세는 도구다. AI가 두 번 들어 있으므로 Counter 결과에서 AI의 개수는 2가 된다.
- project_context: 도메인별 카드 수, concept 빈도, 오류 유형 집계에 유용하다.

## PY11_L07_defaultdict_001
- level: 7
- file: python_libraries_missing_topics_v11.json
- title: collections.defaultdict 읽기
- question_type: output_prediction
- concepts: ["import","print","collections","defaultdict","dict"]
- reading_goal: 없는 key도 자동으로 기본값을 만드는 dict를 읽는다.
- code:
```python
from collections import defaultdict

groups = defaultdict(list)
groups["AI"].append("RAG")
print(groups["AI"])
```
- question: 출력은?
- answer: ["RAG"]
- explanation: defaultdict는 없는 key를 읽을 때 기본값을 자동으로 만들어 준다. 없는 key AI에 빈 리스트가 생기고 그 안에 RAG가 추가된다. 그룹별 목록을 모을 때 key 존재 여부를 매번 검사하지 않아도 되어 코드가 짧아진다.
- project_context: 도메인별 그룹핑, 파일별 오류 목록 수집에 자주 쓰인다.

## PY11_L07_itertools_islice_001
- level: 7
- file: python_libraries_missing_topics_v11.json
- title: itertools.islice 읽기
- question_type: output_prediction
- concepts: ["import","print","range","itertools","islice","limit"]
- reading_goal: 반복 가능한 데이터에서 앞부분만 가져오는 코드를 읽는다.
- code:
```python
from itertools import islice

nums = range(100)
print(list(islice(nums, 3)))
```
- question: 출력은?
- answer: [0, 1, 2]
- explanation: itertools.islice는 반복 가능한 값에서 필요한 앞부분만 잘라 가져온다. islice(nums, 3)은 nums의 앞 3개 값만 읽는다. 전체를 리스트로 만들지 않고 필요한 만큼만 소비할 수 있어 큰 반복자 처리에 유용하다. 따라서 출력은 ‘[0, 1, 2]’이다.
- project_context: 큰 파일/큰 iterator에서 일부만 샘플링할 때 유용하다.

## PY11_L07_re_search_001
- level: 7
- file: python_libraries_missing_topics_v11.json
- title: re.search 정규식 읽기
- question_type: output_prediction
- concepts: ["import","print","regex","re","search"]
- reading_goal: 문자열에서 특정 패턴이 있는지 찾는 코드를 읽는다.
- code:
```python
import re

text = "shard_0042_done.json"
match = re.search(r"shard_(\d+)", text)
print(match.group(1))
```
- question: 출력은?
- answer: 0042
- explanation: re.search는 문자열 전체에서 첫 번째 일치 위치를 찾는다. 패턴의 shard_는 그대로 맞고, 괄호 안 \d+는 숫자 한 개 이상인 0042를 캡처한다. 그래서 group(0)은 전체 일치 문자열 shard_0042이고 group(1)은 0042다. 이 입력은 일치하므로 출력할 수 있지만, 일치하지 않으면 match가 None이 되어 group 호출 전에 확인해야 한다.
- project_context: 파일명에서 shard 번호, 날짜, id를 뽑을 때 유용하다.

## PY11_L07_venv_requirements_002
- level: 7
- file: python_libraries_missing_topics_v11.json
- title: requirements.txt 의미 읽기
- question_type: meaning_choice
- concepts: ["comment","venv","pip","requirements"]
- reading_goal: 프로젝트 의존성을 파일로 관리하는 이유를 이해한다.
- code:
```python
# requirements.txt
fastapi
pandas
requests
```
- question: requirements.txt의 목적은?
- answer: 필요한 파이썬 패키지 목록을 기록한다
- explanation: requirements.txt는 pip가 설치할 패키지와 선택적인 버전 조건을 줄마다 기록한다. pip install -r requirements.txt로 목록을 한 번에 설치할 수 있고 venv와 함께 쓰면 프로젝트별 환경을 분리할 수 있다. 그러나 이 예제처럼 버전을 적지 않으면 설치 시점의 최신 호환 버전이 들어갈 수 있어 완전히 같은 환경을 보장하지 않는다. 정확한 재현에는 버전 고정과 Python 버전 기록이 필요하다.
- project_context: 서버/노트북/로컬 환경을 옮길 때 중요하다.

## PY44_L07_prompt_template_001
- level: 7
- file: python_llm_api_prompt_validation_v44.json
- title: prompt template 읽기
- question_type: meaning_choice
- concepts: ["prompt_template","variable_slot","formatting"]
- reading_goal: 반복되는 프롬프트 구조에 변수만 채워 넣는 방식을 이해한다.
- code:
```python
template = '학년: {grade}\n질문: {question}\n근거: {context}'
prompt = template.format(grade=grade, question=q, context=ctx)
```
- question: prompt template을 쓰는 이유는?
- answer: 반복되는 프롬프트 구조를 안정적으로 재사용하기 위해
- explanation: template은 grade, question, context를 같은 label과 순서로 조립해 누락을 줄인다. 구조의 일관성은 높이지만 입력 내용이 instruction처럼 해석되는 prompt injection을 막지는 않는다. untrusted context에는 명확한 delimiter를 쓰고 길이·형식 검증과 model 밖의 정책 집행을 함께 둔다.
- project_context: 학년, 질문, 근거, 금지어, 출력 형식을 항상 같은 구조로 넣는 데 유용하다.

## PY44_L07_system_prompt_001
- level: 7
- file: python_llm_api_prompt_validation_v44.json
- title: system prompt 읽기
- question_type: meaning_choice
- concepts: ["system_prompt","instruction","policy"]
- reading_goal: system prompt가 모델의 기본 역할과 규칙을 정한다는 점을 이해한다.
- code:
```python
messages = [
    {'role': 'system', 'content': '초3 수준으로 설명하라'},
    {'role': 'user', 'content': question}
]
```
- question: system prompt의 역할에 가장 가까운 것은?
- answer: 모델이 따라야 할 기본 역할과 규칙을 정한다
- explanation: system 역할의 메시지는 사용자 질문보다 앞에서 모델의 기본 역할과 답변 규칙을 정한다. 예제에서는 ‘초3 수준’이라는 설명 난이도를 먼저 지정하고, 그다음 user 메시지의 실제 질문을 처리한다. 따라서 정답은 ‘모델이 따라야 할 기본 역할과 규칙을 정한다’이다. 다만 프롬프트만으로 규칙 준수가 보장되는 것은 아니므로 중요한 형식이나 안전 조건은 출력 검증도 함께 둬야 한다.
- project_context: 교육용 답변의 대상 수준, 설명 방식, 근거 사용 규칙과 금지 표현을 공통 지침으로 두는 위치다.

## PY44_L07_user_prompt_001
- level: 7
- file: python_llm_api_prompt_validation_v44.json
- title: user prompt 읽기
- question_type: meaning_choice
- concepts: ["user_prompt","question","task_input"]
- reading_goal: user prompt가 실제 사용자 질문이나 작업 요청을 담는다는 점을 이해한다.
- code:
```python
messages = [
    {'role': 'system', 'content': policy},
    {'role': 'user', 'content': '비행기는 왜 날아?'}
]
```
- question: user prompt에 들어가는 내용은?
- answer: 사용자의 실제 질문이나 요청
- explanation: user message에는 처리할 실제 질문이나 요청을 넣는다. 일반적으로 system instruction보다 낮은 우선순위지만 model이 항상 우선순위를 완벽히 지킨다는 보안 보장은 없다. 외부 문서나 사용자 입력은 untrusted data로 취급하고 권한 검사, tool allowlist, 출력 검증을 model 밖에서 시행한다.
- project_context: 학생 질문, 학년, 과목, 문제 텍스트를 user 입력으로 묶어 보낼 수 있다.

## PY25_L07_logging_basic_001
- level: 7
- file: python_logging_monitoring_ops_v25.json
- title: logging 기본 레벨 읽기
- question_type: meaning_choice
- concepts: ["import","logging","info","warning","error"]
- reading_goal: print 대신 logging 레벨로 운영 메시지를 남기는 코드를 읽는다.
- code:
```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("harvest started")
logging.warning("source returned empty feed")
logging.error("curation failed")
```
- question: warning 로그에 가장 가까운 의미는?
- answer: 즉시 중단은 아니지만 주의가 필요한 상태
- explanation: INFO는 일반 흐름, WARNING은 주의 상태, ERROR는 실패 상황에 가깝다. logging은 실행 중 일어난 일을 기록하는 방법이다. debug, info, warning, error처럼 수준을 나누어 기록하면 문제 원인을 찾기 쉬워진다. 따라서 반환/호출 결과는 ‘즉시 중단은 아니지만 주의가 필요한 상태’이다.
- project_context: 수집/큐레이션/학습 배치의 상태를 읽을 때 로그 레벨 구분이 중요하다.

## PY25_L07_try_except_log_001
- level: 7
- file: python_logging_monitoring_ops_v25.json
- title: try/except 로그 읽기
- question_type: meaning_choice
- concepts: ["try_except","logging","error_handling"]
- reading_goal: 예외가 발생했을 때 오류를 기록하고 다시 던지는 구조를 이해한다.
- code:
```python
try:
    run_job()
except Exception:
    logging.exception("job failed")
    raise
```
- question: raise를 다시 쓰는 이유는?
- answer: 오류를 기록한 뒤 실패를 상위로 전달하기 위해
- explanation: except에서 logging.exception은 현재 exception message와 traceback을 기록하고 bare raise는 같은 exception을 상위 caller로 다시 전달한다. logging.error(..., e)만 쓰면 traceback이 빠져 원인 위치를 잃기 쉽다. 실제 log에는 token·password·개인정보가 섞이지 않게 정제하고, 처리할 수 없는 Exception을 잡는 경계를 최소화한다.
- project_context: 배치 실패를 조용히 무시하지 않게 만드는 기본 패턴이다.

## PY54_L07_safe_area_001
- level: 7
- file: python_mobile_touch_responsive_ux_v54.json
- title: safe area 읽기
- question_type: meaning_choice
- concepts: ["safe_area","mobile_viewport","PWA"]
- reading_goal: 모바일 기기의 노치나 하단 바를 피하는 safe area 개념을 이해한다.
- code:
```python
.app {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
```
- question: safe area를 고려하는 이유는?
- answer: 노치나 홈 인디케이터에 UI가 가려지지 않게 하기 위해
- explanation: safe-area inset을 기존 16px 여백에 더해 home indicator와 content가 겹치지 않게 한다. edge-to-edge 표시에는 viewport-fit=cover 등 platform 조건도 필요할 수 있고 env 미지원 fallback을 둔다. inset을 넣었다고 keyboard overlay까지 자동 해결되지는 않는다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L07_tap_target_spacing_001
- level: 7
- file: python_mobile_touch_responsive_ux_v54.json
- title: tap target spacing 읽기
- question_type: meaning_choice
- concepts: ["tap_target","spacing","mobile_ux"]
- reading_goal: 터치 대상 사이에 충분한 간격이 필요하다는 점을 이해한다.
- code:
```python
.choice-button + .choice-button {
  margin-top: 10px;
}
```
- question: tap target spacing의 목적은?
- answer: 가까운 버튼을 실수로 잘못 누르는 일을 줄이기 위해
- explanation: tap target spacing은 터치 대상 사이의 간격이다. 카드 선택지가 연속으로 배치되면 모바일에서는 간격이 좁아 오탭이 생기기 쉽다. 충분한 간격을 두면 손가락으로 누를 때 옆 선택지를 잘못 누르는 실수를 줄일 수 있다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L07_touch_target_001
- level: 7
- file: python_mobile_touch_responsive_ux_v54.json
- title: touch target 읽기
- question_type: meaning_choice
- concepts: ["touch_target","mobile_touch","button"]
- reading_goal: 손가락으로 누르기 쉬운 버튼 크기를 확보하는 touch target 개념을 이해한다.
- code:
```python
.choice-button {
  min-height: 44px;
  padding: 12px;
}
```
- question: touch target이 중요한 이유는?
- answer: 손가락으로 버튼을 정확히 누르기 쉽게 하기 위해
- explanation: min-height 44 CSS px와 padding은 선택지의 실제 hit area를 키우는 출발점이다. 폭, target 사이 간격, device pixel과 접근성 guideline을 함께 확인하고 실제 touch test를 한다. 시각적 button이 커 보여도 overlay나 작은 clickable child 때문에 hit area가 작을 수 있다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.
