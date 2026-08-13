# V356 semantic review — Level 8 chunk 11

Cards 201-220 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY49_L08_mastery_score_001
- level: 8
- file: python_learning_ux_review_algorithm_v49.json
- title: mastery score 읽기
- question_type: meaning_choice
- concepts: ["if","mastery_score","learning_state","score"]
- reading_goal: 카드를 얼마나 익혔는지 나타내는 mastery score 개념을 이해한다.
- code:
```python
mastery = correct_count / total_attempts if total_attempts else 0.0
if total_attempts >= MIN_EVIDENCE and mastery < 0.6:
    mark_as_weak(card_id)
```
- question: mastery score는 무엇을 나타내나?
- answer: 학습자가 해당 카드를 얼마나 익혔는지
- explanation: 이 mastery는 시도 중 정답 비율이며 시도가 0이면 0으로 처리한다. 표본이 적은 한 번의 결과를 확정적 숙련도로 부르지 않도록 최소 evidence를 둔다. 반응 시간, 최근성, hint 사용과 문제 난이도에 따라 실제 이해도와 정답률이 다를 수 있다.
- project_context: 카드별 숙련도를 계산하면 약한 개념을 다시 추천할 수 있다.

## PY49_L08_weak_concept_review_001
- level: 8
- file: python_learning_ux_review_algorithm_v49.json
- title: weak concept review 읽기
- question_type: meaning_choice
- concepts: ["weak_concept","concept_review","recommendation"]
- reading_goal: 오답이 많은 concept를 찾아 관련 카드를 다시 추천하는 흐름을 이해한다.
- code:
```python
weak_concepts = count_wrong_by_concept(history)
recommend_cards(concepts=weak_concepts[:3])
```
- question: weak concept review의 목적은?
- answer: 자주 틀린 개념을 중심으로 다시 복습하게 하기 위해
- explanation: concept별 wrong count는 약점 후보를 찾는 신호다. 많이 노출된 concept가 단순히 더 많이 틀릴 수 있으므로 attempts 대비 비율, 최근성, 문제 난이도와 tag 품질을 함께 본다. 한 카드의 오답이 선행 개념 부족을 자동으로 증명하지는 않는다.
- project_context: concepts 필드가 이미 있으므로 오답 기록과 연결하면 약점 개념 추천이 가능하다.

## PY11_L08_dotenv_pattern_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: dotenv 설정 읽기
- question_type: meaning_choice
- concepts: ["import","dotenv","env","config"]
- reading_goal: .env 파일에서 설정값을 읽는 패턴을 이해한다.
- code:
```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.environ.get("API_KEY")
```
- question: load_dotenv()의 목적은?
- answer: .env 파일의 값을 환경변수로 불러오기 위해
- explanation: python-dotenv의 load_dotenv()는 찾은 .env 파일의 NAME=VALUE 항목을 os.environ에서 읽을 수 있게 불러온다. 기본 설정에서는 이미 존재하는 같은 이름의 환경변수를 덮어쓰지 않는다. 이어서 os.environ.get("API_KEY")가 값을 읽으며, 키가 없으면 None을 반환한다. 실제 비밀값이 든 .env는 보통 Git에서 제외하지만, 파일을 분리했다는 사실만으로 접근 권한이나 로그 노출까지 자동으로 안전해지는 것은 아니다.
- project_context: API 키/설정값 관리에 자주 쓰인다.

## PY11_L08_os_path_exists_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: os/pathlib exists 읽기
- question_type: meaning_choice
- concepts: ["if","else","import","print","pathlib","exists","file"]
- reading_goal: 파일이나 폴더가 있는지 확인하는 코드를 읽는다.
- code:
```python
from pathlib import Path

path = Path("config.json")
if path.exists():
    print("found")
else:
    print("missing")
```
- question: path.exists()는 무엇을 확인하는가?
- answer: 경로가 실제로 존재하는지
- explanation: os.path.exists는 파일이나 폴더가 실제로 있는지 확인한다. 결과에 따라 읽기, 생성, 스킵 같은 분기를 만들 때 자주 쓴다. True이면 이미 경로가 있다는 뜻이고 False이면 새로 만들거나 오류 처리해야 할 수 있다.
- project_context: 설정 파일, 산출물, 캐시 존재 여부 확인에 필요하다.

## PY11_L08_pytest_assert_002
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: pytest 테스트 함수 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","test","assert"]
- reading_goal: 테스트 함수가 기대 결과를 검증하는 구조를 읽는다.
- code:
```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
```
- question: test_add 함수의 목적은?
- answer: add(2,3)이 5인지 검증한다
- explanation: pytest는 test_로 시작하는 함수를 테스트 함수로 인식한다. 함수 안의 assert가 참이면 통과하고, 거짓이면 실패로 기록된다. 테스트 이름과 assert 식을 함께 보면 무엇을 검증하려는 함수인지 빠르게 파악할 수 있다. 따라서 반환/호출 결과는 ‘add(2,3)이 5인지 검증한다’이다.
- project_context: 데이터 품질검사와 함수 동작검증 자동화에 필요하다.

## PY11_L08_queue_basic_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: queue 기본 흐름 읽기
- question_type: output_prediction
- concepts: ["import","print","queue","worker","fifo"]
- reading_goal: Queue에 작업을 넣고 꺼내는 흐름을 읽는다.
- code:
```python
from queue import Queue

q = Queue()
q.put("task1")
q.put("task2")
print(q.get())
```
- question: 출력은?
- answer: task1
- explanation: Queue는 작업을 순서대로 넣고 꺼내기 위한 자료구조다. 기본적으로 먼저 넣은 값이 먼저 나오는 FIFO 흐름으로 동작한다. 작업 큐에서는 생산자가 넣은 일을 소비자가 하나씩 꺼내 처리하는 흐름으로 자주 읽는다. 따라서 출력은 ‘task1’이다.
- project_context: worker, batch, 비동기 처리 구조를 읽는 기본이다.

## PY11_L08_requests_status_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: requests status_code 읽기
- question_type: meaning_choice
- concepts: ["if","import","print","requests","http","status_code"]
- reading_goal: HTTP 응답 상태코드로 성공/실패를 판단하는 코드를 읽는다.
- code:
```python
import requests

res = requests.get("https://example.com", timeout=10)
if res.status_code == 200:
    print("ok")
```
- question: status_code == 200이 참이라는 것은?
- answer: 해당 요청이 HTTP 200 OK 응답을 받았다는 의미
- explanation: requests.get이 응답을 받으면 status_code에 HTTP 상태 코드가 들어간다. 값이 정확히 200이면 서버가 이 요청에 200 OK로 응답했다는 뜻이어서 이 예제는 ok를 출력한다. 201이나 204 같은 다른 2xx도 성공일 수 있으므로 모든 성공을 검사할 때 status_code == 200만 보면 부족할 수 있다. 연결 실패나 timeout은 응답 객체가 생기기 전에 예외가 날 수 있다.
- project_context: 수집기, API 클라이언트, 웹 요청 코드에서 기본이다.

## PY11_L08_sensor_csv_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: sensor 데이터 한 줄 읽기
- question_type: output_prediction
- concepts: ["print","sensor","csv","float"]
- reading_goal: 센서 로그 문자열에서 시간과 값을 float로 바꾸는 코드를 읽는다.
- code:
```python
line = "0.1,9.8"
time_s, accel = line.split(",")
print(float(accel))
```
- question: 출력은?
- answer: 9.8
- explanation: CSV는 쉼표로 값을 나눈 텍스트 데이터 형식이다. 한 줄을 쉼표로 나눈 뒤 두 번째 값 accel을 float로 바꿔 숫자로 사용한다. 텍스트로 읽은 값은 그대로 계산하기 어렵기 때문에 필요한 컬럼을 고른 뒤 자료형 변환을 확인해야 한다. 따라서 출력은 ‘9.8’이다.
- project_context: 센서 CSV, 시계열 로그, 실험 데이터 처리의 기본이다.

## PY11_L08_sql_parameter_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: SQL parameter binding 읽기
- question_type: meaning_choice
- concepts: ["sql","sqlite","parameter_binding"]
- reading_goal: SQL에 값을 안전하게 전달하는 ? 바인딩을 읽는다.
- code:
```python
conn.execute("SELECT * FROM items WHERE id = ?", (item_id,))
```
- question: ?와 (item_id,)를 쓰는 이유는?
- answer: 값을 SQL 문자열에 직접 붙이지 않고 안전하게 전달하기 위해
- explanation: SQL parameter는 값을 SQL 문자열에 직접 붙이지 않고 별도로 전달하는 방식이다. SQL injection 위험을 줄이는 기본적인 안전 패턴이다. 사용자 입력을 그대로 SQL에 섞지 않는 습관은 검색 기능과 로그인 기능 모두에서 중요하다.
- project_context: 로컬 DB 검색/저장 코드에서 중요하다.

## PY11_L08_yaml_config_001
- level: 8
- file: python_libraries_missing_topics_v11.json
- title: yaml config 읽기
- question_type: meaning_choice
- concepts: ["import","print","yaml","config","file"]
- reading_goal: YAML 설정 파일을 dict로 읽는 코드를 이해한다.
- code:
```python
import yaml

with open("config.yaml", encoding="utf-8") as f:
    config = yaml.safe_load(f)
print(config["mode"])
```
- question: yaml.safe_load(f)는 무엇을 하는가?
- answer: YAML을 파이썬 값으로 파싱한다
- explanation: yaml.safe_load(f)는 파일의 YAML 문법을 읽어 mapping은 dict, sequence는 list, 숫자·문자열·bool은 대응하는 Python 값으로 파싱한다. 문서가 비어 있으면 None처럼 dict/list 이외의 결과도 가능하다. 따라서 이어지는 config["mode"]가 성립하려면 이 파일의 최상위 값이 mode 키를 가진 mapping인지 별도로 확인해야 한다. safe_load는 임의 Python 객체 생성을 허용하는 yaml.load보다 안전한 선택이지만 데이터 스키마까지 검증하지는 않는다.
- project_context: 수집 소스, 모델 설정, 파이프라인 옵션 관리에 유용하다.

## PY44_L08_json_mode_001
- level: 8
- file: python_llm_api_prompt_validation_v44.json
- title: JSON 형식 응답 읽기
- question_type: meaning_choice
- concepts: ["JSON_output","structured_response","parser"]
- reading_goal: LLM 응답을 JSON으로 받아 파싱하는 단계와, 필요한 필드를 별도로 검증하는 단계를 구분한다.
- code:
```python
prompt = '반드시 JSON으로 답하라: {"answer": ..., "reason": ...}'
parsed = json.loads(model_text)
```
- question: JSON 형식의 응답을 요구하는 주된 이유는?
- answer: 앱이 모델 출력을 안정적으로 파싱하기 위해
- explanation: JSON 형식으로 받으면 앱이 model_text를 dict 같은 구조로 바꿔 answer와 reason을 각각 사용할 수 있다. 따라서 주된 이유는 ‘앱이 모델 출력을 안정적으로 파싱하기 위해’이다. 하지만 프롬프트에 JSON을 요구했다고 해서 항상 올바른 JSON이 오는 것은 아니며, json.loads()가 성공해도 필수 필드가 있다는 뜻은 아니다. 파싱 오류 처리와 answer·reason 필드 검증을 따로 둬야 한다.
- project_context: 교육앱에서 answer, hint, followup_question을 분리해 화면에 넣을 때 중요하다.

## PY44_L08_output_parser_001
- level: 8
- file: python_llm_api_prompt_validation_v44.json
- title: output parser 읽기
- question_type: meaning_choice
- concepts: ["try_except","output_parser","json_loads","parse_error"]
- reading_goal: 모델 출력 문자열을 앱이 쓰는 데이터 구조로 바꾸는 parser를 이해한다.
- code:
```python
try:
    data = json.loads(model_text)
except json.JSONDecodeError:
    data = fallback_parse(model_text)
```
- question: output parser가 필요한 이유는?
- answer: 모델 출력 문자열을 코드가 쓸 수 있는 구조로 바꾸기 위해
- explanation: json.loads는 JSON text를 Python 구조로 바꾸고 JSONDecodeError를 구분한다. fallback_parse가 잘못된 출력을 억지로 해석하면 의미가 바뀔 수 있으므로 허용 범위를 좁히고 결과에 동일한 schema validation을 적용해야 한다. 복구할 수 없으면 명확히 실패하거나 model에 형식 수정을 요청한다.
- project_context: Qwen 응답을 교육앱 카드, 힌트, 추천 필드로 나누어 넣는 단계다.

## PY44_L08_output_validation_001
- level: 8
- file: python_llm_api_prompt_validation_v44.json
- title: output validation 읽기
- question_type: meaning_choice
- concepts: ["if","output_validation","schema_check","guardrail"]
- reading_goal: 모델 응답을 그대로 쓰기 전에 검증하는 이유를 이해한다.
- code:
```python
if 'answer' not in data:
    raise ValueError('missing answer')
if forbidden_term in data['answer']:
    reject(data)
```
- question: output validation의 역할은?
- answer: 필수 필드 누락이나 정책 위반을 잡는다
- explanation: 첫 조건은 answer field 누락을 실패시키고, 둘째는 정의된 forbidden_term의 단순 포함 여부를 검사한다. 이런 문자열 검사는 철자 변형·우회·문맥을 놓칠 수 있어 완전한 정책 집행 장치가 아니다. schema, type·길이, allowlist, 근거 검사와 위험도에 맞는 독립 검토를 조합한다.
- project_context: 초3 답변에 금지 개념이 섞이거나 JSON 필드가 빠지는 문제를 막는 단계다.

## PY44_L08_response_schema_001
- level: 8
- file: python_llm_api_prompt_validation_v44.json
- title: response schema 읽기
- question_type: meaning_choice
- concepts: ["class","response_schema","structured_output","required_fields"]
- reading_goal: 모델 답변이 가져야 할 필드 구조를 미리 정하는 response schema를 이해한다.
- code:
```python
class ModelOutput(BaseModel):
    answer: str
    used_concepts: list[str]
    student_check: str

parsed = ModelOutput.model_validate_json(model_text)
```
- question: response schema의 목적은?
- answer: 모델 출력에 필요한 필드가 있는지 확인하기 위해
- explanation: response schema는 필요한 field와 type을 선언하고 model_text가 그 구조를 만족하는지 검증한다. Python dict에 type 객체를 적는 것만으로 검증되지는 않으므로 이 예시는 Pydantic model_validate_json을 실제로 호출한다. 길이, 허용값, 추가 field, 업무 의미는 필요에 따라 더 검증한다.
- project_context: Learning Coach Prompt Contract의 answer, used_concepts, blocked_terms 같은 필드 검증과 연결된다.

## PY25_L08_run_id_trace_001
- level: 8
- file: python_logging_monitoring_ops_v25.json
- title: run_id 추적 읽기
- question_type: meaning_choice
- concepts: ["run_id","trace","pipeline","audit"]
- reading_goal: 한 번의 실행을 run_id로 묶어 여러 단계 로그를 연결하는 구조를 이해한다.
- code:
```python
run_id = "run_20260529_001"
logging.info("start harvest run_id=%s", run_id)
items = harvest(run_id=run_id)
logging.info("finish harvest run_id=%s count=%s", run_id, len(items))
```
- question: run_id를 여러 로그에 넣는 이유는?
- answer: 같은 실행의 로그를 나중에 묶어 찾기 위해
- explanation: 같은 run_id를 시작·처리·종료 log와 downstream call에 전달하면 한 실행의 사건을 묶어 찾을 수 있다. 실제 run_id는 여러 worker와 시간대에서 충돌하지 않게 생성하고, user가 임의로 넣은 값을 신뢰하지 않으며, request/job context 전체에 일관되게 전파해야 한다.
- project_context: 수집→정제→큐레이션→서빙 과정의 감사로그와 연결된다.

## PY25_L08_structured_log_001
- level: 8
- file: python_logging_monitoring_ops_v25.json
- title: structured logging 읽기
- question_type: meaning_choice
- concepts: ["print","structured_logging","json_log","run_id"]
- reading_goal: 문자열 로그 대신 key-value 형태로 상태를 남기는 구조를 이해한다.
- code:
```python
log = {
    "event": "curate_done",
    "run_id": run_id,
    "items_seen": 120,
    "items_written": 20,
}
print(json.dumps(log, ensure_ascii=False))
```
- question: structured log의 장점에 가장 가까운 것은?
- answer: 나중에 event/run_id/items_written 같은 필드로 검색하기 쉽다
- explanation: json object를 한 줄로 기록하면 collector가 event, run_id, count field를 parse해 filter와 aggregate하기 쉽다. 이 예시는 JSON 한 줄만 print하며 timestamp, severity, schema version과 destination 관리가 없다. 값이 JSON 직렬화 가능한지 확인하고 token·개인정보를 제외하며 log size와 retention policy를 정해야 한다.
- project_context: home-curator의 run_id, stats, 상태 요약과 연결된다.

## PY25_L08_traceback_reading_001
- level: 8
- file: python_logging_monitoring_ops_v25.json
- title: traceback 줄번호 읽기
- question_type: meaning_choice
- concepts: ["return","traceback","debugging","line_number"]
- reading_goal: 에러 로그에서 파일명과 줄번호를 찾아 원인 위치로 이동하는 법을 익힌다.
- code:
```python
Traceback (most recent call last):
  File "jobs/curate.py", line 42, in run_curate
    rows = load_items()
  File "jobs/curate.py", line 18, in load_items
    return json.loads(raw)
json.decoder.JSONDecodeError: Expecting value
```
- question: 가장 직접적인 에러 발생 위치는?
- answer: jobs/curate.py line 18의 json.loads(raw)
- explanation: traceback의 아래쪽으로 갈수록 실제 예외가 발생한 위치에 가까운 경우가 많다. traceback은 오류가 어디서 시작되어 어떤 함수들을 거쳐 발생했는지 보여 주는 기록이다. 가장 아래쪽 오류 메시지와 파일명, 줄번호를 먼저 확인하면 된다. 따라서 반환/호출 결과는 ‘jobs/curate.py line 18의 json.loads(raw)’이다.
- project_context: 붙여넣은 오류 로그에서 원인 줄을 찾는 훈련이다.

## PY54_L08_mobile_scroll_001
- level: 8
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile scroll 읽기
- question_type: meaning_choice
- concepts: ["mobile_scroll","content_flow","UX"]
- reading_goal: 긴 카드 설명을 모바일에서 자연스럽게 스크롤하도록 만드는 흐름을 이해한다.
- code:
```python
.card-body {
  overflow-wrap: anywhere;
  line-height: 1.6;
}
```
- question: mobile scroll에서 중요한 점은?
- answer: 긴 코드와 설명이 화면 밖으로 깨지지 않고 읽히게 하는 것
- explanation: overflow-wrap:anywhere는 일반 card text의 긴 token이 container를 넘는 것을 줄인다. Python code는 임의 wrap이 indentation과 line 이해를 어렵게 할 수 있으므로 pre 영역에 가로 scroll, wrap toggle 또는 line-specific layout을 별도로 제공한다. font zoom 200%와 긴 URL·identifier로 test한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L08_one_hand_ux_001
- level: 8
- file: python_mobile_touch_responsive_ux_v54.json
- title: one hand UX 읽기
- question_type: meaning_choice
- concepts: ["one_hand_ux","thumb_zone","mobile_ux"]
- reading_goal: 한 손 사용을 고려해 자주 누르는 버튼 위치를 정하는 방식을 이해한다.
- code:
```python
.primary-action {
  position: sticky;
  bottom: 16px;
}
```
- question: one hand UX에서 중요한 것은?
- answer: 자주 쓰는 버튼을 엄지로 누르기 쉬운 위치에 두는 것
- explanation: 자주 쓰는 action을 bottom 쪽 reachable area에 두면 한 손 조작이 쉬울 수 있다. sticky button이 card content, browser UI나 onscreen keyboard를 가리지 않도록 bottom padding과 viewport 변화를 처리한다. 왼손·오른손, device 크기와 사용자 설정 차이도 있다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L08_thumb_zone_001
- level: 8
- file: python_mobile_touch_responsive_ux_v54.json
- title: thumb zone 읽기
- question_type: meaning_choice
- concepts: ["thumb_zone","mobile_touch","layout"]
- reading_goal: 엄지손가락이 닿기 쉬운 영역을 고려하는 thumb zone 개념을 이해한다.
- code:
```python
placePrimaryButton(bottomCenter)
```
- question: thumb zone을 고려하는 이유는?
- answer: 모바일에서 자주 쓰는 조작을 더 편하게 만들기 위해
- explanation: thumb zone은 엄지손가락이 편하게 닿는 화면 영역이다. 검색보다 다음 카드, 정답 확인 같은 반복 조작이 더 쉽게 닿아야 한다. 모바일에서는 손가락이 닿기 어려운 곳의 버튼 사용률이 떨어질 수 있어 핵심 버튼 위치를 먼저 점검한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.
