# V356 semantic review — Level 9 chunk 11

Cards 201-220 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY25_L09_health_check_001
- level: 9
- file: python_logging_monitoring_ops_v25.json
- title: health check endpoint 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","health_check","api","monitoring"]
- reading_goal: 서버가 살아 있는지 빠르게 확인하는 endpoint를 이해한다.
- code:
```python
@app.get("/health")
def health():
    return {"ok": True, "version": APP_VERSION}
```
- question: /health endpoint의 주된 목적은?
- answer: 서버 기본 상태를 빠르게 확인한다
- explanation: 이 endpoint는 process가 request에 응답하고 APP_VERSION을 읽을 수 있다는 liveness signal만 준다. DB, queue, 외부 API가 실제로 준비됐는지는 검사하지 않는다. orchestrator가 process 재시작에 쓰는 liveness와 traffic 수신 판단에 쓰는 readiness를 분리하고, dependency check에는 짧은 timeout과 과부하 방지가 필요하다.
- project_context: FastAPI 검색 API나 서빙 API를 띄운 뒤 첫 확인용으로 좋다.

## PY25_L09_metrics_counter_001
- level: 9
- file: python_logging_monitoring_ops_v25.json
- title: metrics counter 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","try_except","metrics","counter","monitoring","requests"]
- reading_goal: 요청 수나 실패 수를 숫자로 집계하는 기본 구조를 읽는다.
- code:
```python
metrics = {"requests": 0, "errors": 0}

def handle_request():
    metrics["requests"] += 1
    try:
        return run()
    except Exception:
        metrics["errors"] += 1
        raise
```
- question: run()에서 예외가 발생하면 errors는 어떻게 되는가?
- answer: 1 증가한다
- explanation: handle_request를 한 번 호출하고 run이 예외를 내면 requests는 먼저 1 증가하고 errors도 1 증가한 뒤 exception이 다시 전달된다. 이 in-memory dictionary는 process마다 따로 있고 thread/async update에서 정확성을 보장하지 않으며 재시작하면 초기화된다. 운영 지표는 thread-safe metrics client와 중앙 backend를 사용하고 요청 수·오류 수의 정의를 일관되게 한다.
- project_context: 요청량/오류율/실패율을 추적하는 가장 기본적인 형태다.

## PY25_L09_retry_backoff_001
- level: 9
- file: python_logging_monitoring_ops_v25.json
- title: retry/backoff 루프 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","try_except","import","range","retry","backoff","timeout","resilience"]
- reading_goal: 일시적 실패 때 잠시 기다렸다가 재시도하는 코드를 읽는다.
- code:
```python
import random
import time

def call_with_retry(max_attempts=3):
    if max_attempts < 1:
        raise ValueError("max_attempts must be positive")
    for attempt in range(max_attempts):
        try:
            return call_api()
        except TimeoutError:
            if attempt == max_attempts - 1:
                raise
            wait = 2 ** attempt + random.uniform(0, 0.5)
            time.sleep(wait)
```
- question: attempt가 2이면 지수 backoff의 기본값 2 ** attempt는?
- answer: 4
- explanation: 2 ** 2는 4다. code는 마지막 실패 뒤 불필요하게 sleep하지 않고 원래 TimeoutError를 다시 발생시키며, 여러 client가 동시에 재시도하지 않도록 작은 jitter를 더한다. retry는 일시적 오류와 반복해도 안전한 operation에만 적용하고 server의 Retry-After, 총 deadline과 최대 시도 수를 존중해야 한다.
- project_context: 외부 API, RSS, 모델 호출, GitHub 호출이 일시적으로 실패할 때 쓰는 패턴이다.

## PY25_L09_timeout_guard_001
- level: 9
- file: python_logging_monitoring_ops_v25.json
- title: timeout 방어 코드 읽기
- question_type: meaning_choice
- concepts: ["import","timeout","requests","network","ops"]
- reading_goal: 네트워크 요청이 무한정 기다리지 않도록 timeout을 거는 구조를 읽는다.
- code:
```python
import requests

response = requests.get(url, timeout=10)
response.raise_for_status()
```
- question: timeout guard에서 timeout=10의 의미는?
- answer: 응답을 너무 오래 기다리지 않도록 제한한다
- explanation: Requests의 timeout=10은 connect와 socket read가 각각 너무 오래 진행되지 않게 하는 timeout 값으로 사용되며 전체 wall-clock 10초 deadline을 보장하지는 않는다. DNS, redirect, 여러 response chunk와 retry layer 때문에 총 시간은 더 길 수 있다. raise_for_status는 4xx/5xx를 HTTPError로 바꾸므로 caller가 timeout, connection, HTTP error를 구분해야 한다.
- project_context: 수집기/검증기/외부 API 호출 코드에서 기본 방어다.

## PY54_L09_hover_vs_touch_001
- level: 9
- file: python_mobile_touch_responsive_ux_v54.json
- title: hover vs touch 읽기
- question_type: meaning_choice
- concepts: ["hover","touch_device","responsive_interaction"]
- reading_goal: 마우스 hover에만 의존하면 터치 기기에서 정보가 사라질 수 있음을 이해한다.
- code:
```python
@media (hover: hover) {
  .hint:hover { display: block; }
}
```
- question: hover에만 의존하면 안 되는 이유는?
- answer: 터치 기기에서는 hover가 없거나 다르게 동작하기 때문에
- explanation: hover vs touch는 마우스를 올리는 동작과 손가락 터치의 차이를 말한다. 힌트나 설명이 hover로만 보이면 모바일 학습자는 접근하기 어렵다. 터치 환경에서는 눌렀을 때, 펼쳤을 때, 항상 보일 때 같은 대체 UI가 필요하다. 따라서 정답은 ‘터치 기기에서는 hover가 없거나 다르게 동작하기 때문에’이다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L09_mobile_input_zoom_001
- level: 9
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile input zoom 읽기
- question_type: meaning_choice
- concepts: ["mobile_input","font_size","UX"]
- reading_goal: 모바일 입력창에서 글자 크기가 작으면 자동 확대가 생길 수 있음을 이해한다.
- code:
```python
input, select {
  font-size: 16px;
}
```
- question: 모바일 입력창 font-size를 충분히 주는 이유는?
- answer: 입력할 때 화면이 갑자기 확대되는 일을 줄이기 위해
- explanation: 일부 모바일 browser, 특히 iOS Safari는 작은 form font에 focus할 때 자동 zoom할 수 있어 16px가 이를 줄이는 흔한 기준이다. 모든 browser에서 같은 동작을 보장하지 않으며 viewport로 사용자 zoom을 막는 해결책은 피한다. 실제 device와 접근성 font 확대에서 확인한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L09_orientation_change_001
- level: 9
- file: python_mobile_touch_responsive_ux_v54.json
- title: orientation change 읽기
- question_type: meaning_choice
- concepts: ["orientation_change","mobile_viewport","layout"]
- reading_goal: 휴대폰을 세로/가로로 돌렸을 때 레이아웃이 다시 맞춰져야 함을 이해한다.
- code:
```python
window.addEventListener('resize', () => {
  updateLayout()
})
```
- question: orientation change 대응이 필요한 이유는?
- answer: 화면 방향이 바뀌면 사용 가능한 폭과 높이가 달라지기 때문에
- explanation: orientation이나 resize로 사용 가능한 width·height가 바뀐다. 단순 layout은 CSS media/container query로 처리하고 JavaScript가 꼭 필요하면 handler를 throttle하며 visualViewport와 onscreen keyboard를 고려한다. resize event가 곧 orientation change만을 뜻하지는 않는다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L09_responsive_code_block_001
- level: 9
- file: python_mobile_touch_responsive_ux_v54.json
- title: responsive code block 읽기
- question_type: meaning_choice
- concepts: ["code_block","responsive_layout","mobile_reading"]
- reading_goal: 코드 블록이 모바일 화면에서 읽기 좋게 줄바꿈 또는 스크롤 처리되는 방식을 이해한다.
- code:
```python
pre {
  overflow-x: auto;
  white-space: pre-wrap;
}
```
- question: responsive code block의 목적은?
- answer: 코드가 모바일 화면에서 잘리거나 레이아웃을 깨지 않게 하기 위해
- explanation: overflow-x:auto는 긴 code line을 container 안에서 scroll하게 하고 pre-wrap은 whitespace를 보존하면서 줄바꿈을 허용한다. 두 정책을 함께 쓰면 대부분 line이 wrap되어 horizontal scroll이 덜 필요할 수 있지만, indentation 관계가 흐려질 수 있다. 코드 유형에 따라 nowrap·wrap toggle과 accessible scroll hint를 제공한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY61_L09_conflict_resolution_ui_001
- level: 9
- file: python_offline_first_sync_conflict_v61.json
- title: conflict resolution UI 읽기
- question_type: meaning_choice
- concepts: ["conflict_resolution_UI","UX","sync_conflict"]
- reading_goal: 자동으로 결정하기 어려운 충돌을 사용자에게 선택하게 하는 UI를 이해한다.
- code:
```python
showConflictChoices(localNote, remoteNote)
```
- question: conflict resolution UI의 목적은?
- answer: 자동 병합이 어려운 충돌에서 사용자가 선택하게 하기 위해
- explanation: 자동 병합이 안전하지 않은 메모는 로컬과 서버 버전을 나란히 보여 주고 사용자가 한쪽 선택, 둘 다 보관, 직접 병합 중에서 고르게 할 수 있다. 수정 시각만 아니라 기기나 변경된 부분도 보여 주면 판단하기 쉽다. 사용자가 결정하기 전에는 어느 버전도 삭제하지 않아야 한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L09_last_write_wins_001
- level: 9
- file: python_offline_first_sync_conflict_v61.json
- title: last write wins 읽기
- question_type: meaning_choice
- concepts: ["last_write_wins","conflict_resolution","sync"]
- reading_goal: 가장 최근 수정본을 채택하는 last write wins 전략을 이해한다.
- code:
```python
winner = max(local, remote, key=lambda x: x.updatedAt)
```
- question: last write wins의 핵심은?
- answer: 가장 최근에 수정된 데이터를 최종값으로 선택하는 것
- explanation: last write wins는 정해진 순서에서 마지막 쓰기를 최종값으로 고르는 단순한 정책이다. 클라이언트 updatedAt을 그대로 비교하면 기기 시계 오차 때문에 실제 순서와 달라질 수 있으므로 서버 시각이나 단조 증가 revision을 쓰는 편이 낫다. 어느 방식을 써도 이전 내용이 사라질 수 있어 중요한 메모에는 버전 보관이나 사용자 선택이 필요하다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L09_merge_strategy_001
- level: 9
- file: python_offline_first_sync_conflict_v61.json
- title: merge strategy 읽기
- question_type: meaning_choice
- concepts: ["merge_strategy","conflict_resolution","data_model"]
- reading_goal: 북마크처럼 합치기 쉬운 데이터는 병합 전략을 쓸 수 있음을 이해한다.
- code:
```python
mergedBookmarks = union(localBookmarks, remoteBookmarks)
```
- question: merge strategy가 유용한 데이터는?
- answer: 북마크 목록처럼 서로 합쳐도 자연스러운 데이터
- explanation: merge strategy는 데이터 성격에 맞춰 충돌 값을 합치는 규칙이다. 서로 다른 북마크를 추가한 경우 집합 합치기가 자연스럽지만, 한쪽에서 삭제한 항목은 별도 삭제 기록이 없으면 다시 살아날 수 있다. 자유 형식 메모는 자동 병합이 오히려 의미를 망칠 수 있고, 진도도 단순 최신값보다 문제별 규칙이 필요하므로 자료마다 정책을 정한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L09_sync_conflict_001
- level: 9
- file: python_offline_first_sync_conflict_v61.json
- title: sync conflict 읽기
- question_type: meaning_choice
- concepts: ["if","sync_conflict","cloud_sync","data_integrity"]
- reading_goal: 두 기기에서 같은 데이터를 다르게 수정했을 때 생기는 sync conflict를 이해한다.
- code:
```python
if local.baseVersion != remote.version:
  detectConflict(local, remote)
```
- question: sync conflict가 생기는 상황은?
- answer: 여러 기기에서 같은 데이터를 서로 다르게 수정했을 때
- explanation: sync conflict는 로컬 편집을 시작한 뒤 서버의 같은 기록이 다른 곳에서 바뀌었을 때 생긴다. 단순히 updatedAt 값이 다르다는 사실만으로 동시 편집을 정확히 판정하기는 어렵다. 예시처럼 편집의 기준 버전(baseVersion)과 현재 서버 버전을 비교하면 오래된 기반에서 만든 변경을 감지할 수 있다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY27_L09_execution_policy_001
- level: 9
- file: python_packaging_env_dependencies_v27.json
- title: PowerShell 실행 정책 오류 읽기
- question_type: meaning_choice
- concepts: ["powershell","execution_policy","activate"]
- reading_goal: Activate.ps1 실행이 막힐 때 실행 정책 문제를 파악한다.
- code:
```python
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.\.venv\Scripts\Activate.ps1
```
- question: -Scope CurrentUser의 의미에 가장 가까운 것은?
- answer: 현재 사용자 범위에서 정책을 바꾼다
- explanation: -Scope CurrentUser는 현재 user account의 execution policy를 지속적으로 바꾸며 현재 process에만 한정되지 않는다. RemoteSigned도 security boundary가 아니고 organization Group Policy가 우선할 수 있다. 정책 변경이 허용되는지 먼저 확인하고, 임시 필요라면 더 좁은 Process scope나 venv Python 직접 호출처럼 activation script가 필요 없는 방법을 고려한다.
- project_context: 새 Windows 서버/노트북에서 가상환경 활성화가 안 될 때 자주 확인한다.

## PY27_L09_import_error_debug_001
- level: 9
- file: python_packaging_env_dependencies_v27.json
- title: ModuleNotFoundError 디버깅 읽기
- question_type: meaning_choice
- concepts: ["comment","print","import_error","module","environment","debugging"]
- reading_goal: 모듈을 찾지 못하는 오류가 환경 문제인지 경로 문제인지 판단하는 관점을 익힌다.
- code:
```python
ModuleNotFoundError: No module named "sentence_transformers"

# check
python -c "import sys; print(sys.executable)"
python -m pip show sentence-transformers
```
- question: sys.executable을 확인하는 이유는?
- answer: 현재 실행 중인 Python 경로를 확인하려고
- explanation: sys.executable은 code를 실행하는 interpreter path를 보여 주고 같은 python -m pip show는 그 environment에 distribution이 설치됐는지 확인한다. import name sentence_transformers와 distribution name sentence-transformers처럼 이름이 다를 수 있다. 설치 여부 외에 package version, shadowing local file과 import path도 확인한다.
- project_context: FastAPI 검색 API나 LoRA 환경에서 자주 만나는 오류 유형이다.

## PY27_L09_pyproject_basic_001
- level: 9
- file: python_packaging_env_dependencies_v27.json
- title: pyproject.toml 기본 구조 읽기
- question_type: meaning_choice
- concepts: ["pyproject","packaging","metadata"]
- reading_goal: Python 프로젝트 메타데이터와 의존성을 pyproject.toml에서 읽는다.
- code:
```python
[project]
name = "python-reading-trainer"
version = "0.1.0"
dependencies = [
  "fastapi",
  "uvicorn"
]
```
- question: dependencies 배열의 역할은?
- answer: 프로젝트 실행에 필요한 패키지를 적는다
- explanation: [project] dependencies는 이 distribution의 runtime requirements를 선언한다. pyproject.toml은 [build-system]과 tool-specific table도 담을 수 있으며 모든 setting이 [project]에 들어가는 것은 아니다. version 제약이 없는 fastapi와 uvicorn은 설치 시점에 다른 release가 선택될 수 있어 reproducibility 정책이 별도로 필요하다.
- project_context: 나중에 단순 스크립트가 아니라 패키지 형태로 정리할 때 필요하다.

## PY27_L09_windows_path_001
- level: 9
- file: python_packaging_env_dependencies_v27.json
- title: Windows 경로와 raw string 읽기
- question_type: meaning_choice
- concepts: ["import","windows_path","raw_string","pathlib"]
- reading_goal: 역슬래시가 있는 Windows 경로를 안전하게 쓰는 방법을 이해한다.
- code:
```python
from pathlib import Path

root = Path(r"D:\projects\python-reading-trainer")
lesson_dir = root / "data" / "lessons"
```
- question: r'D:\projects...'에서 r의 의미는?
- answer: 문자열을 raw string으로 취급한다
- explanation: r prefix는 대부분의 backslash escape를 문자 그대로 보존해 Windows path를 읽기 쉽게 한다. raw string도 quote 처리 규칙은 있고 홀수 개 backslash로 끝날 수 없으므로 모든 path 문제를 없애는 것은 아니다. pathlib.Path와 / 결합을 사용하면 separator 처리를 줄일 수 있으며 이 code는 path object만 만들고 directory를 생성하지 않는다.
- project_context: D:\projects 아래 여러 프로젝트 경로를 다룰 때 실수를 줄인다.

## PY53_L09_incremental_render_001
- level: 9
- file: python_performance_large_card_ux_v53.json
- title: incremental render 읽기
- question_type: meaning_choice
- concepts: ["incremental_render","chunking","performance"]
- reading_goal: 큰 목록을 여러 번에 나누어 렌더링하는 incremental render를 이해한다.
- code:
```python
function renderNextChunk(start, size = 50) {
  const end = Math.min(start + size, cards.length);
  render(cards.slice(start, end));
  if (end < cards.length) {
    requestAnimationFrame(() => renderNextChunk(end, size));
  }
}
renderNextChunk(0);
```
- question: incremental render의 목적은?
- answer: 큰 렌더링 작업을 작은 덩어리로 나누어 화면 멈춤을 줄이기 위해
- explanation: start와 end를 전진시키고 마지막 card에서 예약을 멈춰야 무한 scheduling을 피한다. chunk로 나누면 browser가 frame 사이에 paint할 기회를 얻지만 각 chunk가 frame budget보다 크면 여전히 끊긴다. cancellation과 중복 시작도 막는다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L09_large_json_split_001
- level: 9
- file: python_performance_large_card_ux_v53.json
- title: large JSON split 읽기
- question_type: meaning_choice
- concepts: ["large_json_split","data_loading","architecture"]
- reading_goal: 데이터가 너무 커지면 여러 JSON 파일로 나누어 로드하는 전략을 이해한다.
- code:
```python
const neededFiles = selectLessonFiles(route, filters);
const lessons = await Promise.all(neededFiles.map(loadJson));
```
- question: large JSON split의 장점은?
- answer: 데이터를 여러 파일로 나누어 관리하고 필요한 단위로 불러올 수 있다
- explanation: 큰 data를 file로 나누면 version·cache·필요 단위 loading을 분리할 수 있다. 원래처럼 lessonFiles 전체에 Promise.all을 쓰면 모든 file을 동시에 load하므로 초기 전송량이 줄지 않고 connection·memory burst가 생길 수 있다. 필요한 file만 고르고 concurrency·error 정책을 둔다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L09_memory_usage_001
- level: 9
- file: python_performance_large_card_ux_v53.json
- title: memory usage 읽기
- question_type: meaning_choice
- concepts: ["memory_usage","large_json","browser"]
- reading_goal: 대량 JSON과 DOM 요소가 브라우저 메모리를 사용할 수 있음을 이해한다.
- code:
```python
cards.length
renderedNodes.length
cache.size
```
- question: memory usage를 점검해야 하는 이유는?
- answer: 데이터와 화면 요소가 많아지면 브라우저 메모리 사용량이 커질 수 있기 때문에
- explanation: memory usage는 카드 데이터, 검색 인덱스, DOM 요소가 차지하는 메모리 양이다. 카드가 많아질수록 저장 구조와 화면 렌더링을 함께 봐야 한다. 메모리가 커지면 모바일 브라우저에서 느려지거나 탭이 강제로 종료될 수 있다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L09_request_animation_frame_001
- level: 9
- file: python_performance_large_card_ux_v53.json
- title: requestAnimationFrame 읽기
- question_type: meaning_choice
- concepts: ["requestAnimationFrame","browser_rendering","performance"]
- reading_goal: 브라우저 렌더링 타이밍에 맞춰 UI 작업을 예약하는 requestAnimationFrame을 이해한다.
- code:
```python
requestAnimationFrame(() => {
  renderVisibleCards()
})
```
- question: requestAnimationFrame을 쓰는 이유는?
- answer: 브라우저 화면 갱신 흐름에 맞춰 렌더링 작업을 실행하기 위해
- explanation: requestAnimationFrame은 callback을 다음 paint 전에 예약해 시각 update timing을 맞춘다. callback 안의 renderVisibleCards가 길면 main thread와 frame을 그대로 막으므로 작업량을 줄이거나 chunking·worker 계산을 사용해야 한다. background tab에서는 호출 빈도가 낮아질 수 있다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.
