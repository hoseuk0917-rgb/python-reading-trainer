# V356 semantic review — Level 7 chunk 7

Cards 121-140 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY61_L07_cache_strategy_001
- level: 7
- file: python_offline_first_sync_conflict_v61.json
- title: cache strategy 읽기
- question_type: meaning_choice
- concepts: ["cache_strategy","network_first","cache_first"]
- reading_goal: 데이터 성격에 따라 cache-first와 network-first 전략을 고르는 방식을 이해한다.
- code:
```python
strategy = isStaticFile ? 'cache-first' : 'network-first'
```
- question: cache strategy를 나누는 이유는?
- answer: 파일 종류에 따라 최신성이나 속도 요구가 다르기 때문에
- explanation: 변경이 드문 앱 셸에는 cache-first, 최신성이 중요한 데이터에는 timeout과 fallback을 둔 network-first가 어울릴 수 있다. 그러나 파일 확장자만으로 전략을 고정하기보다 자료의 갱신 빈도와 오프라인 요구를 기준으로 정해야 한다. 어떤 전략이든 오래된 자료 표시, 캐시 만료, 요청 실패를 처리해야 한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L07_service_worker_cache_001
- level: 7
- file: python_offline_first_sync_conflict_v61.json
- title: service worker cache 읽기
- question_type: meaning_choice
- concepts: ["service_worker","cache","offline"]
- reading_goal: 서비스 워커가 앱 파일과 데이터 파일을 캐시에 저장해 오프라인을 돕는 방식을 이해한다.
- code:
```python
cache.addAll(['/src/pwa/index.html', '/src/pwa/app.js'])
```
- question: service worker cache의 역할은?
- answer: 앱 파일을 캐시에 저장해 다시 빠르게 열 수 있게 한다
- explanation: service worker의 Cache API는 앱 셸 같은 요청 응답을 저장해 오프라인 재실행을 돕는다. cache.addAll은 항목 하나라도 가져오지 못하면 전체 추가가 실패할 수 있으므로 설치 실패 처리도 필요하다. 캐시는 영구 저장이나 자동 최신화를 보장하지 않으므로 버전 교체와 오래된 캐시 정리 전략을 둔다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L07_sync_queue_001
- level: 7
- file: python_offline_first_sync_conflict_v61.json
- title: sync queue 읽기
- question_type: meaning_choice
- concepts: ["sync_queue","offline","retry"]
- reading_goal: 오프라인 중 생긴 변경사항을 큐에 쌓았다가 온라인에서 보내는 sync queue를 이해한다.
- code:
```python
syncQueue.push({ type: 'progress_update', payload })
```
- question: sync queue의 목적은?
- answer: 오프라인 중 발생한 변경사항을 나중에 서버와 맞추기 위해
- explanation: sync queue는 오프라인 변경을 나중에 서버로 보내기 위한 목록이다. 예시의 메모리 배열만 쓰면 새로고침 때 사라질 수 있으므로 IndexedDB 같은 영속 저장소가 필요할 수 있다. 각 항목에 안정적인 작업 ID와 생성 순서를 두고, 성공 응답을 확인한 뒤에만 제거하며 실패는 제한된 backoff로 재시도한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY27_L07_python_version_001
- level: 7
- file: python_packaging_env_dependencies_v27.json
- title: Python 버전 확인 명령 읽기
- question_type: meaning_choice
- concepts: ["python","version","environment"]
- reading_goal: 현재 실행 중인 Python 버전을 확인하는 명령을 이해한다.
- code:
```python
python --version
py -0p
```
- question: py -0p 명령의 목적에 가장 가까운 것은?
- answer: 설치된 Python 버전과 경로를 확인한다
- explanation: Windows에서는 여러 Python 버전이 설치될 수 있어 실제 어떤 버전/경로를 쓰는지 확인하는 것이 중요하다. Python 버전 확인은 실행 환경 차이를 잡는 기본 점검이다. 같은 코드도 3.10, 3.11, 3.12에서 의존성이나 문법 지원이 다를 수 있다.
- project_context: Fooocus, LoRA, FastAPI, PDF 처리 등 프로젝트별로 필요한 Python 버전이 다를 수 있다.

## PY27_L07_venv_create_activate_001
- level: 7
- file: python_packaging_env_dependencies_v27.json
- title: venv 생성과 활성화 읽기
- question_type: meaning_choice
- concepts: ["venv","virtual_environment","activation"]
- reading_goal: 프로젝트별 독립 Python 환경을 만드는 명령을 읽는다.
- code:
```python
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
- question: python -m venv .venv의 역할은?
- answer: 현재 프로젝트에 가상환경 폴더를 만든다
- explanation: python -m venv .venv는 선택한 Python으로 project-local environment를 만든다. activation은 현재 shell의 PATH 등을 바꿔 python과 pip가 그 environment를 가리키게 하는 편의 기능이지 필수는 아니다. .venv의 Python을 직접 호출할 수도 있고, venv 자체는 dependency version을 기록하지 않으므로 lock이나 requirement file이 별도로 필요하다.
- project_context: LLM_Lora, FastAPI, PDF 추출, 학습 앱별 환경을 분리하는 기본이다.

## PY53_L07_empty_state_001
- level: 7
- file: python_performance_large_card_ux_v53.json
- title: empty state 읽기
- question_type: meaning_choice
- concepts: ["empty_state","filtering","UX"]
- reading_goal: 검색이나 필터 결과가 없을 때 안내 문구를 보여주는 empty state를 이해한다.
- code:
```python
if (filteredCards.length === 0) {
  showEmpty('조건에 맞는 카드가 없습니다')
}
```
- question: empty state의 역할은?
- answer: 결과가 없는 상황을 사용자에게 명확히 알려준다
- explanation: empty state는 검색 결과나 표시할 데이터가 없을 때 보여주는 안내 상태다. 아무것도 안 보이면 오류인지 결과 없음인지 구분하기 어렵다. 좋은 empty state는 사용자가 다음에 무엇을 하면 되는지 안내해 막힌 느낌을 줄인다. 따라서 정답은 ‘결과가 없는 상황을 사용자에게 명확히 알려준다’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L07_lazy_loading_001
- level: 7
- file: python_performance_large_card_ux_v53.json
- title: lazy loading 읽기
- question_type: meaning_choice
- concepts: ["lazy_loading","load_timing","performance"]
- reading_goal: 필요한 시점에 데이터를 늦게 불러오는 lazy loading을 이해한다.
- code:
```python
if (userOpensReviewTab) {
  loadReviewCards()
}
```
- question: lazy loading의 장점은?
- answer: 처음 화면을 빠르게 열고 필요한 데이터만 나중에 불러올 수 있다
- explanation: review tab을 열 때만 관련 card를 load하면 초기 network와 parse 작업을 미룰 수 있다. click이 반복될 때 중복 요청을 합치고 loading, error, retry, cancellation과 prefetch 정책을 설계한다. 늦게 load하는 비용이 사라지는 것이 아니라 사용자 flow의 다른 시점으로 이동한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L07_loading_indicator_001
- level: 7
- file: python_performance_large_card_ux_v53.json
- title: loading indicator 읽기
- question_type: meaning_choice
- concepts: ["loading_indicator","feedback","UX"]
- reading_goal: 데이터를 불러오는 동안 사용자가 상태를 알 수 있게 표시하는 UI를 이해한다.
- code:
```python
showLoading('카드를 불러오는 중입니다');
try {
  await loadCards();
} finally {
  hideLoading();
}
```
- question: loading indicator가 필요한 이유는?
- answer: 앱이 멈춘 것이 아니라 작업 중임을 알려주기 위해
- explanation: loading indicator는 비동기 작업 중임을 알려 준다. loadCards가 실패해도 finally에서 indicator를 닫고 별도 error·retry UI를 보여야 무한 loading처럼 보이지 않는다. screen reader에는 busy state와 status announcement도 제공한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY45_L07_avoid_nested_herestring_001
- level: 7
- file: python_powershell_automation_reliable_scripts_v45.json
- title: 중첩 here-string 피하기
- question_type: meaning_choice
- concepts: ["comment","here_string","nesting_bug","script_safety"]
- reading_goal: here-string을 중첩하면 내용이 꼬일 수 있다는 점을 이해한다.
- code:
```python
# safer
@'
python code here
'@ | Set-Content script.py -Encoding UTF8
python script.py
```
- question: 긴 스크립트에서 중첩 here-string을 피하는 이유는?
- answer: 끝나는 경계가 꼬이면 엉뚱한 코드가 실행될 수 있기 때문
- explanation: here-string delimiter와 같은 독립 줄이 내용 안에 나타나면 block이 예상보다 일찍 끝나거나 parse error가 날 수 있다. 긴 code를 여러 quoting layer 안에 중첩할수록 경계를 검토하기 어렵다. 가능한 한 source file을 직접 관리하거나 고유한 임시 파일과 명시적 argument 전달을 사용한다.
- project_context: v41 초기에 다른 프로젝트 코드가 실행된 원인이 이런 계열의 실수였다.

## PY45_L07_here_string_001
- level: 7
- file: python_powershell_automation_reliable_scripts_v45.json
- title: PowerShell here-string 읽기
- question_type: meaning_choice
- concepts: ["here_string","PowerShell","multiline_text"]
- reading_goal: PowerShell에서 여러 줄 텍스트를 파일로 저장하는 here-string을 이해한다.
- code:
```python
@'
hello
world
'@ | Set-Content -Path out.txt -Encoding UTF8
```
- question: here-string을 쓰는 이유는?
- answer: 여러 줄 문자열을 그대로 파일이나 파이프에 넘기기 위해
- explanation: @' ... '@는 interpolation을 하지 않는 single-quoted here-string이라 여러 줄 text를 거의 그대로 pipeline에 전달한다. opening marker 뒤와 closing marker 앞의 newline도 내용 규칙에 영향을 주며 closing '@는 독립된 줄의 시작에 있어야 한다. 외부 입력을 code로 넣어 실행하면 안전해지는 문법은 아니다.
- project_context: v41 이후 임시 Python 파일을 만들 때 here-string을 사용했다.

## PY45_L07_remove_variable_001
- level: 7
- file: python_powershell_automation_reliable_scripts_v45.json
- title: Remove-Variable 읽기
- question_type: meaning_choice
- concepts: ["Remove-Variable","stale_variable","PowerShell_state"]
- reading_goal: PowerShell 세션에 남아 있는 변수를 지우는 이유를 이해한다.
- code:
```python
Remove-Variable py -ErrorAction SilentlyContinue
Remove-Variable cards -ErrorAction SilentlyContinue
```
- question: stale variable이 위험한 이유는?
- answer: 이전 작업의 값이 남아 엉뚱한 코드가 실행될 수 있기 때문
- explanation: Remove-Variable은 현재 scope의 이름을 지우지만 SilentlyContinue는 실패를 숨기고 다른 scope의 값이나 environment state까지 초기화하지 않는다. 신뢰할 수 있는 automation은 대화형 session의 잔여 변수 정리에 의존하지 말고 새 process·script scope, Set-StrictMode, 명시적 초기화를 사용해야 한다.
- project_context: v41 문제 확인 때 py, cards 변수를 먼저 제거하고 상태를 점검했다.

## PY2_L07_logging_basic_001
- level: 7
- file: python_practical_expansion_v2.json
- title: logging.info() 읽기
- question_type: meaning_choice
- concepts: ["import","logging","log","batch"]
- reading_goal: INFO 수준의 로그 레코드를 로깅 시스템에 전달하는 코드를 읽는다.
- code:
```python
import logging

logging.info("harvest started")
```
- question: logging.info는 무엇에 가까운가?
- answer: INFO 수준 로그 기록을 요청한다
- explanation: logging.info는 INFO 수준의 메시지를 로깅 시스템에 전달한다. 실제로 화면이나 파일에 남는지는 로그 수준과 handler 설정에 달려 있다. 파이썬의 기본 root logger 수준은 WARNING이므로 이 두 줄만 실행하면 INFO 메시지는 보통 표시되지 않는다. 예를 들어 logging.basicConfig(level=logging.INFO)를 먼저 설정해야 화면에 보이게 할 수 있으며, 파일 저장도 별도 handler가 필요하다.
- project_context: 긴 배치나 서버 실행 상태를 추적할 때 중요하다.

## PY2_L07_requests_get_001
- level: 7
- file: python_practical_expansion_v2.json
- title: requests.get() API 호출 읽기
- question_type: meaning_choice
- concepts: ["import","print","requests","api","http","get"]
- reading_goal: requests.get(url)이 외부 주소로 요청을 보내는 코드임을 읽는다.
- code:
```python
import requests

response = requests.get("https://example.com/api/items")
print(response.status_code)
```
- question: 이 코드는 무엇을 하는가?
- answer: API 주소로 GET 요청을 보낸다
- explanation: requests.get은 지정한 URL로 HTTP GET 요청을 보내고 응답 객체를 반환한다. 이 코드는 요청이 끝난 뒤 response.status_code를 출력한다. 상태 코드뿐 아니라 응답 본문과 예상 형식도 확인해야 하며, 네트워크 오류는 예외가 될 수 있다. 현재 호출에는 timeout이 없으므로 실제 서비스 코드에서는 제한 시간을 지정했는지도 확인해야 한다.
- project_context: 외부 API나 수집 대상에서 데이터를 가져올 때 쓰인다.

## PY2_L07_response_json_001
- level: 7
- file: python_practical_expansion_v2.json
- title: response.json() 읽기
- question_type: meaning_choice
- concepts: ["print","requests","json","api"]
- reading_goal: API 응답 본문을 JSON 자료구조로 바꾸는 코드를 읽는다.
- code:
```python
response = requests.get(url)
data = response.json()
print(data["items"])
```
- question: response.json()은 무엇을 하는가?
- answer: JSON 응답 본문을 파이썬 값으로 파싱한다
- explanation: response.json()은 응답 본문을 JSON으로 해석해 dict, list, 문자열, 숫자 같은 대응하는 파이썬 값으로 만든다. 이 예제는 결과가 dict이고 items key가 있다는 전제에서 data['items']를 읽는다. 본문이 올바른 JSON이 아니면 파싱 예외가 나며, 이 메서드만으로 HTTP 성공 여부나 필요한 key의 존재까지 검증되지는 않는다.
- project_context: API 기반 하베스트와 데이터 수집 코드에서 자주 나온다.

## PY2_L07_status_code_001
- level: 7
- file: python_practical_expansion_v2.json
- title: status_code 읽기
- question_type: meaning_choice
- concepts: ["if","else","print","http","status_code","api"]
- reading_goal: HTTP 응답 상태코드로 성공/실패를 판단하는 구조를 읽는다.
- code:
```python
response = requests.get(url)

if response.status_code == 200:
    print("success")
else:
    print("failed")
```
- question: 200은 보통 무엇을 의미하는가?
- answer: 요청 성공
- explanation: HTTP status code는 요청 결과를 숫자로 알려준다. 200은 일반적으로 성공을 뜻하므로, 응답을 처리해도 되는지 판단할 때 쓴다. 다만 200이어도 응답 내용이 기대한 JSON인지 따로 확인해야 안전한 API 처리가 된다.
- project_context: 크롤링, API 호출, 서버 상태 점검에서 기본이다.

## PY50_L07_mistake_note_001
- level: 7
- file: python_progress_score_mistake_note_v50.json
- title: mistake note 읽기
- question_type: meaning_choice
- concepts: ["mistake_note","wrong_answer","review"]
- reading_goal: 틀린 카드와 해설을 오답노트로 다시 보여주는 구조를 이해한다.
- code:
```python
mistake_note = [
    {**row, 'card': cards_by_id[row['card_id']]}
    for row in history
    if row.get('correct') is False and row['card_id'] in cards_by_id
]
```
- question: mistake note에 가장 알맞은 데이터는?
- answer: 틀린 카드, 선택한 답, 정답, 해설
- explanation: history에서 명시적으로 틀린 기록만 고르고 card_id로 현재 card metadata를 연결해야 선택한 답, 정답, 해설을 화면에 보여 줄 수 있다. 원래 filter만으로는 history에 들어 있지 않은 해설이 자동 생기지 않는다. 삭제되거나 version이 바뀐 card의 fallback도 필요하다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L07_retry_wrong_card_001
- level: 7
- file: python_progress_score_mistake_note_v50.json
- title: retry wrong card 읽기
- question_type: meaning_choice
- concepts: ["retry","wrong_card","review_queue"]
- reading_goal: 틀린 카드만 다시 풀도록 복습 큐를 만드는 방식을 읽는다.
- code:
```python
retry_queue = [card_id for card_id, row in progress.items() if row['last_correct'] == False]
```
- question: retry wrong card 기능의 목적은?
- answer: 최근 틀린 카드만 다시 풀게 하기 위해
- explanation: last_correct가 false인 card ID를 모으면 최근 오답 queue를 만들 수 있다. 즉시 같은 문항만 반복하면 답 위치를 외우는 착각이 생길 수 있으므로 설명·유사 문제 뒤에 간격을 두고 재시도하는 선택도 제공한다. last_correct field 누락과 중복 ID를 처리해야 한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L07_wrong_answer_log_001
- level: 7
- file: python_progress_score_mistake_note_v50.json
- title: wrong answer log 읽기
- question_type: meaning_choice
- concepts: ["if","wrong_answer_log","mistake","learning_feedback"]
- reading_goal: 오답 기록이 약점 복습과 재시도 기능으로 이어지는 흐름을 읽는다.
- code:
```python
if not correct:
    wrong_log.append({'card_id': card_id, 'selected': selected, 'answer': answer})
```
- question: wrong answer log의 역할은?
- answer: 틀린 문제를 나중에 다시 볼 수 있게 기록한다
- explanation: 오답 log는 card_id, 선택값, 당시 정답과 timestamp를 남겨 재검토와 분석에 쓴다. card 내용이 나중에 바뀔 수 있으므로 card version 또는 prompt snapshot을 연결해야 당시 판정을 재현할 수 있다. 개인 학습 data이므로 최소 수집과 보존 기간도 정한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY6_L07_count_by_level_001
- level: 7
- file: python_project_expansion_v6.json
- title: 레벨별 카드 수 집계 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","aggregation","dict","level"]
- reading_goal: 카드 배열에서 level별 개수를 세는 코드를 읽는다.
- code:
```python
def count_by_level(cards):
    counts = {}
    for card in cards:
        level = card["level"]
        counts[level] = counts.get(level, 0) + 1
    return counts
```
- question: counts dict의 key는 무엇인가?
- answer: level
- explanation: 각 card의 level 값을 counts의 key로 사용한다. 처음 보는 level은 counts.get(level, 0)이 0을 주어 1부터 시작하고, 다시 나오면 기존 개수에 1을 더한다. 반환값은 {level: 카드 수} 형태다. level key가 없는 카드에서는 대괄호 접근 때문에 KeyError가 나므로 대량 데이터 집계 전 스키마 검증이 필요하다.
- project_context: 현재 앱 진행현황/목차 통계를 이해하는 데 연결된다.

## PY6_L07_error_parse_001
- level: 7
- file: python_project_expansion_v6.json
- title: 에러 로그 분류 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","error","log","classification"]
- reading_goal: 로그 한 줄에서 에러 유형을 분류하는 코드를 읽는다.
- code:
```python
def parse_error_line(line):
    if "FileNotFoundError" in line:
        return "missing_file"
    if "Timeout" in line:
        return "timeout"
    return "unknown"
```
- question: Timeout이 포함되면 결과는?
- answer: timeout
- explanation: line에 "Timeout"이 있고 앞의 "FileNotFoundError" 조건은 거짓이면 두 번째 분기에서 "timeout"을 반환한다. 두 문자열이 모두 있으면 첫 return이 먼저 실행돼 missing_file이 된다는 순서도 중요하다. 이 방식은 대소문자와 정확한 문구에 의존하는 단순 분류이므로 실제 로그에서는 예외 타입·구조화 필드·우선순위 규칙을 함께 쓰는 편이 안정적이다.
- project_context: 긴 실행 로그에서 실패 원인을 자동 분류하는 데 연결된다.
