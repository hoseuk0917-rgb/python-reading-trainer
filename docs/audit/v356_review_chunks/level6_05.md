# V356 semantic review — Level 6 chunk 5

Cards 81-100 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY62_L06_i18n_001
- level: 6
- file: python_i18n_locale_language_toggle_v62.json
- title: i18n 읽기
- question_type: meaning_choice
- concepts: ["i18n","localization","UI_text"]
- reading_goal: 앱 문구를 여러 언어로 바꿀 수 있게 준비하는 i18n 개념을 이해한다.
- code:
```python
text = messages[locale]['startButton']
```
- question: i18n의 목적은?
- answer: 앱 문구를 여러 언어로 제공하기 위해
- explanation: i18n은 앱을 여러 언어와 지역 규칙에 맞게 만들기 위한 설계다. 문구를 key로 분리하는 것은 시작일 뿐이며, 복수형, 날짜·숫자 형식, 문장 순서와 오른쪽에서 왼쪽으로 쓰는 화면도 고려해야 한다. 현재 locale에 key가 없을 때의 fallback까지 정해야 빈 화면을 막을 수 있다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY62_L06_locale_001
- level: 6
- file: python_i18n_locale_language_toggle_v62.json
- title: locale 읽기
- question_type: meaning_choice
- concepts: ["locale","language","settings"]
- reading_goal: 사용자의 언어와 지역 설정을 나타내는 locale 개념을 이해한다.
- code:
```python
locale = 'ko-KR'
```
- question: locale의 역할은?
- answer: 언어와 지역 형식을 구분하기 위해
- explanation: ko-KR, en-US 같은 언어 태그는 언어와 지역별 형식 선택에 쓰인다. 그러나 locale 하나가 사용자의 언어, 통화, 시간대를 모두 확정하는 것은 아니다. 앱이 지원하는 BCP 47 태그 목록과 fallback을 두고, 날짜의 시간대나 결제 통화처럼 별도 선택이 필요한 값은 따로 관리한다.
- project_context: 감사 v2에서 I18N_LANGUAGE_TOGGLE이 0 hits였으므로, v62는 언어 설정, locale, 번역 dictionary, fallback, 다국어 학습 UX를 보강한다.

## PY114_L06_PYTHONPATH_CAUTION_001
- level: 6
- file: python_import_debug_beginner_v114_a1.json
- title: PYTHONPATH는 조심해서 쓰기
- question_type: multiple_choice
- concepts: ["PYTHONPATH","environment variable","import","sys.path"]
- reading_goal: PYTHONPATH가 import 경로를 억지로 추가할 수 있지만 초보자에게는 마지막 수단임을 읽는다.
- code:
```python
$env:PYTHONPATH="D:\projects\myapp"
python main.py
```
- question: PYTHONPATH를 초보자에게 조심시키는 이유는?
- answer: 경로를 억지로 추가해 재현이 어려워질 수 있다
- explanation: PYTHONPATH는 import 경로를 추가할 수 있지만, 로컬 PC에서만 동작하는 숨은 설정이 되기 쉽다. 먼저 프로젝트 구조와 실행 위치를 바로잡는 편이 낫다. 따라서 정답은 ‘경로를 억지로 추가해 재현이 어려워질 수 있다’이다.
- project_context: 서버나 다른 PC에서만 import가 깨지는 문제를 줄이려면 숨은 환경변수 의존을 피하는 편이 좋다.

## PY114_L06_SYS_PATH_001
- level: 6
- file: python_import_debug_beginner_v114_a1.json
- title: sys.path는 import 후보 경로 목록
- question_type: multiple_choice
- concepts: ["print","sys.path","import","module search path"]
- reading_goal: sys.path가 Python이 import할 때 살펴보는 경로 목록임을 읽는다.
- code:
```python
python -c "import sys; print(sys.path)"
```
- question: 이 명령의 의미로 가장 알맞은 것은?
- answer: Python이 모듈을 찾는 후보 경로를 본다
- explanation: sys.path에는 import 때 Python이 확인하는 경로들이 들어 있다. 다만 초보자는 먼저 실행 위치와 가상환경부터 확인하는 것이 안전하다. 따라서 출력은 ‘Python이 모듈을 찾는 후보 경로를 본다’이다.
- project_context: 정말 import 경로가 헷갈릴 때만 진단용으로 확인하는 항목이다.

## PY127_L06_CSV_DICTWRITER_SAVE_001
- level: 6
- file: python_json_csv_cli_practice_v127_a1.json
- title: csv.DictWriter로 결과 CSV 저장하기
- question_type: multiple_choice
- concepts: ["import","csv.DictWriter","fieldnames","writeheader","writerows"]
- reading_goal: DictWriter에서 fieldnames, writeheader, writerows가 각각 어떤 역할인지 이해한다.
- code:
```python
import csv

rows = [{'name': 'A', 'score': 10}]
with open('out.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'score'])
    writer.writeheader()
    writer.writerows(rows)
```
- question: DictWriter로 CSV를 저장할 때 fieldnames를 지정하는 이유로 알맞은 것은?
- answer: 저장할 컬럼 순서와 이름을 정하기 위해
- explanation: csv.DictWriter의 fieldnames는 CSV에 저장할 컬럼 이름과 순서를 정한다. writeheader()는 첫 줄에 헤더를 쓰고 writerows()는 여러 행을 저장한다.
- project_context: 

## PY127_L06_JSON_CSV_CLI_FLOW_001
- level: 6
- file: python_json_csv_cli_practice_v127_a1.json
- title: JSON/CSV 처리 CLI 전체 흐름
- question_type: multiple_choice
- concepts: ["def","function","CLI flow","JSON","CSV","summary","save result"]
- reading_goal: argparse, pathlib, JSON/CSV 읽기, 결과 저장이 하나의 CLI 흐름으로 연결되는 방식을 이해한다.
- code:
```python
def main():
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    data = load_data(input_path)
    summary = make_summary(data)
    output_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
```
- question: JSON/CSV 입력 파일을 받아 요약 JSON을 저장하는 CLI 흐름으로 가장 알맞은 것은?
- answer: 인자 파싱, 입력 읽기, 요약 생성, 결과 저장
- explanation: 인자를 파싱하고 형식에 맞게 입력을 읽은 뒤 요약을 JSON 문자열로 만들어 저장하는 흐름이다. 실제 실행 코드에서는 output_path.parent를 만들고, 파일·파싱·쓰기 오류를 단계별로 처리해야 질문의 '실전 CLI'에 가까워진다.
- project_context: 

## PY119_L06_JSON_SAVE_CHECKLIST_001
- level: 6
- file: python_json_error_encoding_beginner_v119_a1.json
- title: JSON 저장 체크리스트
- question_type: multiple_choice
- concepts: ["json.dumps","ensure_ascii=False","indent=2","encoding"]
- reading_goal: JSON 저장 시 ensure_ascii=False, indent=2, encoding='utf-8' 조합을 하나의 체크리스트로 읽는다.
- code:
```python
json_text = json.dumps(data, ensure_ascii=False, indent=2)
out.write_text(json_text, encoding='utf-8')
```
- question: 이 코드의 전체 의도로 가장 알맞은 것은?
- answer: JSON을 사람이 읽기 좋게 만들고 UTF-8로 저장한다
- explanation: indent=2는 보기 좋게 정렬하고, ensure_ascii=False는 한글 표시를 돕고, encoding='utf-8'은 저장 인코딩을 명시한다.
- project_context: 카드 데이터나 설정 파일을 안정적으로 저장하는 기본 루틴을 만든다.

## PY119_L06_SAFE_JSON_PARSE_001
- level: 6
- file: python_json_error_encoding_beginner_v119_a1.json
- title: 안전한 JSON 파싱 흐름
- question_type: multiple_choice
- concepts: ["try_except","print","JSONDecodeError","json.loads","try except"]
- reading_goal: 파일을 읽고 json.loads로 파싱할 때 JSONDecodeError를 따로 처리하는 흐름을 읽는다.
- code:
```python
try:
    text = path.read_text(encoding='utf-8-sig')
    data = json.loads(text)
except json.JSONDecodeError as e:
    print('bad json:', e)
```
- question: except json.JSONDecodeError가 따로 잡는 것은?
- answer: JSON 문법을 해석하지 못한 오류
- explanation: 이 except는 파일을 읽은 뒤 JSON 문법을 해석하지 못한 경우만 처리한다. 파일 없음은 FileNotFoundError, 바이트를 UTF-8로 해석하지 못한 경우는 UnicodeDecodeError이므로 필요하면 별도로 처리해야 한다.
- project_context: 외부 데이터 파일을 읽을 때 파일 오류와 JSON 문법 오류를 구분하는 데 도움이 된다.

## PY63_L06_daily_goal_001
- level: 6
- file: python_learning_streak_goal_habit_v63.json
- title: daily goal 읽기
- question_type: meaning_choice
- concepts: ["daily_goal","goal","learning_plan"]
- reading_goal: 하루에 풀 카드 수나 복습 수를 정하는 daily goal을 이해한다.
- code:
```python
dailyGoal = { cards: 10 }
```
- question: daily goal의 역할은?
- answer: 하루 학습 목표를 작고 분명하게 정한다
- explanation: daily goal은 하루에 풀 카드 수처럼 작고 분명한 목표를 사용자가 정하게 하는 기능이다. 예시의 10장은 기본값일 뿐 모든 학습자에게 적절한 목표가 아니다. 목표를 끄거나 낮출 수 있게 하고, 달성 여부를 실력이나 실패의 판정으로 사용하지 않아야 건강한 학습 보조가 된다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L06_learning_streak_001
- level: 6
- file: python_learning_streak_goal_habit_v63.json
- title: learning streak 읽기
- question_type: meaning_choice
- concepts: ["learning_streak","habit","learning_ux"]
- reading_goal: 며칠 연속으로 학습했는지 보여주는 learning streak 개념을 이해한다.
- code:
```python
streakDays = countConsecutiveStudyDays(history)
```
- question: learning streak의 목적은?
- answer: 연속 학습 일수를 보여줘 학습 습관을 유지하게 돕기 위해
- explanation: learning streak는 사용자가 정한 날짜 기준으로 며칠 연속 학습했는지 보여 주는 선택적 습관 지표다. 학습을 다시 시작하는 단서가 될 수 있지만 실력이나 성실성을 증명하는 점수는 아니다. 쉬는 날과 비활성화 선택을 존중하고, streak가 끊겨도 누적 학습 기록은 보존해야 부담 없이 돌아올 수 있다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY49_L06_due_cards_001
- level: 6
- file: python_learning_ux_review_algorithm_v49.json
- title: due cards 읽기
- question_type: meaning_choice
- concepts: ["import","due_cards","review_queue","date_check"]
- reading_goal: 오늘 복습해야 할 카드만 골라내는 due cards 개념을 이해한다.
- code:
```python
from datetime import date

today = date.today()
due = [card for card in cards
       if date.fromisoformat(card['next_review_at']) <= today]
```
- question: due cards는 무엇인가?
- answer: 오늘 다시 볼 차례가 된 카드
- explanation: next_review_at을 ISO date로 parse해 오늘 이하인 카드를 due로 고른다. YYYY-MM-DD string끼리는 같은 형식에서 정렬 가능하지만 명시적 date type이 형식 오류를 빨리 잡는다. timestamp를 쓰면 timezone과 day boundary도 정의해야 한다.
- project_context: 매일 학습 화면에서 전체 카드 대신 오늘 복습할 카드만 보여주는 데 필요하다.

## PY49_L06_spaced_repetition_001
- level: 6
- file: python_learning_ux_review_algorithm_v49.json
- title: spaced repetition 읽기
- question_type: meaning_choice
- concepts: ["if","else","spaced_repetition","review","learning_ux"]
- reading_goal: 어려운 카드를 일정 간격으로 다시 보여주는 spaced repetition 개념을 이해한다.
- code:
```python
if answer_correct:
    next_review_days = 3
else:
    next_review_days = 1
```
- question: spaced repetition의 목적은?
- answer: 잊어버리기 전에 적절한 간격으로 다시 복습하게 하는 것
- explanation: spaced repetition은 학습 결과를 바탕으로 다음 review 간격을 정해 기억 retrieval을 반복하는 방식이다. 이 예시는 correct면 3일, 아니면 1일이라는 단순 policy일 뿐 개인의 실제 망각 시점을 안다는 뜻은 아니다. 간격 규칙은 학습 성과와 부담을 측정해 조정한다.
- project_context: 카드가 900장 이상으로 늘었으므로 이제 어떤 카드를 언제 다시 보여줄지가 중요하다.

## PY11_L06_csv_dictreader_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: csv.DictReader 읽기
- question_type: meaning_choice
- concepts: ["import","print","csv","DictReader","file"]
- reading_goal: CSV 행을 dict처럼 읽는 코드를 이해한다.
- code:
```python
import csv

with open("items.csv", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))
print(rows[0]["title"])
```
- question: csv.DictReader의 장점은?
- answer: 컬럼명을 key로 사용해 행을 dict처럼 읽는다
- explanation: csv.DictReader는 각 행을 컬럼명 기반 dict처럼 읽게 해 준다. CSV나 TSV 메타데이터를 다룰 때 컬럼 위치보다 이름으로 접근할 수 있어 편하다.
- project_context: 수집 메타, 평가표, 매핑표 처리에 자주 쓰인다.

## PY11_L06_datetime_now_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: datetime 현재시간 읽기
- question_type: meaning_choice
- concepts: ["import","print","datetime","timestamp","format"]
- reading_goal: 현재 시간을 문자열로 포맷하는 코드를 읽는다.
- code:
```python
from datetime import datetime

now = datetime.now()
print(now.strftime("%Y-%m-%d"))
```
- question: strftime('%Y-%m-%d')는 무엇을 만드는가?
- answer: 연-월-일 형식 문자열
- explanation: datetime.now()는 실행 환경의 현재 로컬 날짜와 시각을 담은 datetime 객체를 만든다. strftime("%Y-%m-%d")에서 %Y는 네 자리 연도, %m은 두 자리 월, %d는 두 자리 일을 뜻하므로 예를 들어 2026-05-29 같은 문자열이 된다. 이 코드는 시간대 정보가 없는 로컬 시각을 사용하므로 여러 지역의 시간을 비교할 때는 시간대 처리도 따로 확인해야 한다.
- project_context: 로그, 리포트 파일명, run_id, 날짜별 큐 생성에 필요하다.

## PY11_L06_finally_002
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: finally 흐름 읽기
- question_type: meaning_choice
- concepts: ["print","finally","try_except","cleanup"]
- reading_goal: 성공/실패와 관계없이 실행되는 finally를 읽는다.
- code:
```python
try:
    print("work")
finally:
    print("cleanup")
```
- question: finally 블록은 언제 실행되는가?
- answer: try 성공/실패와 관계없이 실행된다
- explanation: finally 블록은 예외 발생 여부와 관계없이 마지막에 실행된다. 파일 닫기, 락 해제, 임시 상태 정리 같은 마무리 작업에 자주 쓴다. try가 성공해도 실패해도 실행되므로 공통 마무리 코드를 한곳에 모아 두는 역할을 한다.
- project_context: 자원 정리와 안전한 batch 종료 코드에 필요하다.

## PY11_L06_main_guard_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: main guard 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","print","main_guard","module","script"]
- reading_goal: 스크립트로 실행될 때만 main이 실행되는 구조를 읽는다.
- code:
```python
def main():
    print("run")

if __name__ == "__main__":
    main()
```
- question: if __name__ == '__main__'의 목적은?
- answer: 파일을 직접 실행할 때만 main을 실행하기 위해
- explanation: Python 파일을 직접 실행하면 __name__이 "__main__"이므로 main()을 호출한다. 다른 파일이 이 모듈을 import하면 __name__에는 모듈 이름이 들어가 guard 안의 호출은 건너뛴다. 따라서 실행 진입점의 부수효과를 import와 분리할 수 있다. 단, guard 밖의 함수·클래스 정의와 다른 최상위 문장까지 import 때 실행되지 않는 것은 아니다.
- project_context: 배치 스크립트, CLI 도구, 테스트 가능한 코드에서 자주 쓰인다.

## PY11_L06_math_sqrt_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: math.sqrt 읽기
- question_type: output_prediction
- concepts: ["import","print","math","sqrt","float"]
- reading_goal: math.sqrt로 제곱근을 계산하는 코드를 읽는다.
- code:
```python
import math

print(math.sqrt(9))
```
- question: 출력은?
- answer: 3.0
- explanation: math.sqrt(9)는 9의 음이 아닌 제곱근을 계산해 float 3.0을 반환한다. 그래서 print 출력도 3.0이다. 거리나 벡터 크기처럼 제곱한 값을 다시 크기로 바꿀 때 쓰며, 실수 범위에서 음수를 전달하면 ValueError가 발생한다.
- project_context: 거리, 오차, norm 계산을 읽는 기초다.

## PY11_L06_random_seed_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: random seed 읽기
- question_type: output_prediction
- concepts: ["import","print","random","seed","sampling"]
- reading_goal: 랜덤 결과를 재현 가능하게 만드는 seed 코드를 읽는다.
- code:
```python
import random

random.seed(42)
items = ["a", "b", "c"]
print(random.choice(items) in items)
```
- question: 출력은?
- answer: True
- explanation: random.seed(42)는 이후 의사 난수 생성기의 시작 상태를 고정해 같은 환경에서 같은 호출 순서를 재현하기 쉽게 한다. 하지만 이 문제의 True는 seed 값 때문이 아니다. random.choice(items)는 비어 있지 않은 items의 원소 하나를 반환하므로, 그 결과가 items 안에 있는지 검사하면 어떤 원소가 뽑혀도 True다. seed는 보안용 난수에는 적합하지 않다.
- project_context: 랜덤 샘플링, 문제 카드 섞기, 실험 재현성에 중요하다.

## PY11_L06_statistics_mean_001
- level: 6
- file: python_libraries_missing_topics_v11.json
- title: statistics.mean 읽기
- question_type: output_prediction
- concepts: ["import","print","statistics","mean","average"]
- reading_goal: statistics.mean으로 평균을 계산하는 코드를 읽는다.
- code:
```python
from statistics import mean

print(mean([1, 2, 3]))
```
- question: 출력은?
- answer: 2
- explanation: statistics.mean은 숫자 목록의 평균을 계산하는 표준 라이브러리 함수다. 1, 2, 3의 합을 개수로 나누어 평균 2를 만든다. 평균은 전체 합계를 항목 수로 나눈 값이므로 리스트 안 숫자들이 모두 계산 가능한 값이어야 한다.
- project_context: 점수 평균, 실행시간 평균, 평가 결과 요약에 유용하다.

## PY44_L06_llm_api_request_001
- level: 6
- file: python_llm_api_prompt_validation_v44.json
- title: LLM API request 읽기
- question_type: meaning_choice
- concepts: ["LLM_API","request","payload"]
- reading_goal: LLM API에 질문과 설정을 요청 payload로 보내는 흐름을 이해한다.
- code:
```python
payload = {
    'model': 'configured-model-id',
    'messages': messages,
    'temperature': 0.2
}
response = client.chat(**payload)
```
- question: payload의 역할은?
- answer: 모델에 보낼 입력과 설정을 담는다
- explanation: payload는 이 예시 SDK 호출에 전달할 model ID, message 목록, 생성 option을 묶는다. 실제 field 이름과 호출 형식은 provider SDK 계약을 따라야 하며 model 별칭을 임의로 넣어도 동작하지 않는다. API key는 보통 payload가 아니라 SDK 설정이나 Authorization header로 안전하게 전달하고 로그에 남기지 않는다.
- project_context: Qwen이나 GPT를 교육앱에 붙일 때 질문, 학년, 정책, 근거 context를 payload로 보낸다.
