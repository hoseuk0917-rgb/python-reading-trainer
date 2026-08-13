# V356 semantic review — Level 10 chunk 10

Cards 181-200 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY25_L10_audit_log_001
- level: 10
- file: python_logging_monitoring_ops_v25.json
- title: audit log 저장 읽기
- question_type: meaning_choice
- concepts: ["def","function","audit_log","security","traceability","database"]
- reading_goal: 누가 어떤 중요한 작업을 했는지 기록하는 감사로그 구조를 이해한다.
- code:
```python
def write_audit(user_id, action, target_id):
    repo.insert_audit_log({
        "user_id": user_id,
        "action": action,
        "target_id": target_id,
        "created_at": now_iso(),
    })
```
- question: audit log의 목적에 가장 가까운 것은?
- answer: 중요 작업의 주체/행위/대상을 추적하기 위해
- explanation: 이 record는 누가(user_id), 어떤 action을, 어느 target에, 언제 수행했는지 추적하는 기본 field를 저장한다. 중요한 audit에는 결과, request/run id와 정책에 맞는 source context도 필요하다. log 자체를 최소 권한으로 보호하고 tamper-resistant storage, 시간 동기화, 보존·삭제 정책을 적용하며 secret이나 불필요한 PII를 넣지 않는다.
- project_context: 비공개 자산, API 키, 프롬프트/스코어링 변경 이력 관리와 연결된다.

## PY25_L10_cost_quota_monitor_001
- level: 10
- file: python_logging_monitoring_ops_v25.json
- title: 비용/쿼터 모니터링 코드 읽기
- question_type: meaning_choice
- concepts: ["if","quota","cost","rate_limit","monitoring"]
- reading_goal: 사용량이 예산이나 한도에 가까워지면 경고하는 코드를 읽는다.
- code:
```python
usage_ratio = used_credits / max(total_credits, 1)
if usage_ratio > 0.8:
    logging.warning("credit usage high: %.1f%%", usage_ratio * 100)
```
- question: usage_ratio가 0.85이면 어떤 로그가 남는가?
- answer: warning 로그
- explanation: total_credits가 양수이고 ratio가 0.85이면 threshold 0.8을 넘으므로 warning을 남긴다. total_credits가 0인 경우 max(...,1)은 division error만 피할 뿐 의미 있는 quota ratio가 아니므로 별도 configuration error로 처리해야 한다. 경고는 과금을 막지 않으므로 hard budget, rate limit과 provider usage source도 함께 둔다.
- project_context: AWS credit, LLM API 사용량, 무료 quota를 안전하게 쓰는 운영 습관이다.

## PY25_L10_cron_log_001
- level: 10
- file: python_logging_monitoring_ops_v25.json
- title: worker cron 로그 읽기
- question_type: meaning_choice
- concepts: ["cron","worker","scheduled_job","log"]
- reading_goal: 스케줄러가 어떤 작업을 언제 실행했는지 로그로 확인하는 구조를 읽는다.
- code:
```python
export default {
  async scheduled(event, env, ctx) {
    console.log("cron fired", event.cron)
    ctx.waitUntil(runCurate(env))
  }
}
```
- question: ctx.waitUntil(runCurate(env))의 의미에 가장 가까운 것은?
- answer: 스케줄 이벤트에서 비동기 작업을 끝까지 실행하도록 등록한다
- explanation: ctx.waitUntil은 scheduled handler가 반환한 뒤에도 platform execution lifetime 안에서 promise를 추적하도록 등록한다. 무제한 실행이나 반드시 완료를 보장하는 것은 아니며 platform limit, exception, deployment로 중단될 수 있다. runCurate는 idempotent하게 만들고 실패 log·retry·durable checkpoint를 두며 ctx.waitUntil에 전달한 promise의 rejection도 관찰해야 한다.
- project_context: wrangler tail로 cron 실행 로그를 확인하던 흐름과 연결된다.

## PY25_L10_incident_summary_001
- level: 10
- file: python_logging_monitoring_ops_v25.json
- title: 장애 요약 객체 읽기
- question_type: meaning_choice
- concepts: ["incident","summary","ops","postmortem"]
- reading_goal: 문제가 생겼을 때 원인/영향/조치/다음 할 일을 구조화하는 방식을 이해한다.
- code:
```python
incident = {
    "symptom": "Loading screen stuck",
    "impact": "cards not visible",
    "root_cause": "old app.js cache",
    "fix": "bump asset query version",
    "next_action": "add cache-bust validation"
}
```
- question: root_cause 필드는 무엇을 담는가?
- answer: 문제의 근본 원인
- explanation: root_cause에는 증상이 아니라 evidence로 검증한 근본 원인을 기록한다. 이 object는 symptom, impact, suspected/confirmed cause, fix와 next action을 구분하는 출발점이지만 timestamp, detection, affected version, evidence links, owner와 verification 결과가 없다. 원인을 확정하기 전에는 hypothesis로 표시해 잘못된 결론이 재발 방지 작업을 이끌지 않게 한다.
- project_context: 대화창을 넘어갈 때 현재상황/앞으로할일/관련명령어를 정리하는 습관과 연결된다.

## PY25_L10_stale_job_reaper_001
- level: 10
- file: python_logging_monitoring_ops_v25.json
- title: stale job reaper 읽기
- question_type: meaning_choice
- concepts: ["def","function","stale_job","reaper","cron","run_status"]
- reading_goal: 오래 running 상태로 남은 작업을 error로 정리하는 운영 코드를 읽는다.
- code:
```python
def reap_stale_runs(db, cutoff_time):
    db.execute("""
        UPDATE runs
        SET status = 'error', error_message = 'stale run reaped'
        WHERE status = 'running' AND started_at < ?
    """, (cutoff_time,))
```
- question: 이 코드는 어떤 runs를 정리하는가?
- answer: 오래 running 상태로 남은 runs
- explanation: status가 running이고 started_at이 cutoff보다 이른 모든 row를 error로 바꾼다. 오래 실행되는 정상 job도 잘못 reap할 수 있으므로 started_at 하나보다 갱신되는 heartbeat나 lease expiry를 사용하고, update 직전 ownership/version 조건을 비교해 완료와 reaper가 경쟁하는 race를 막아야 한다. 영향을 받은 row count도 audit한다.
- project_context: home-curator D1 runs 테이블 reaper 로직과 직접 연결된다.

## PY54_L10_mobile_first_design_001
- level: 10
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile first design 읽기
- question_type: meaning_choice
- concepts: ["mobile_first","responsive_design","product_quality"]
- reading_goal: 작은 화면을 먼저 기준으로 잡고 큰 화면을 확장하는 mobile first 관점을 이해한다.
- code:
```python
.card { padding: 16px; }
@media (min-width: 900px) {
  .card { max-width: 840px; }
}
```
- question: mobile first design의 핵심은?
- answer: 작은 화면에서 먼저 잘 작동하게 만들고 큰 화면을 확장하는 것
- explanation: 학습앱은 휴대폰으로 짧게 반복 학습할 가능성이 높으므로 모바일 기준 설계가 중요하다. mobile first design은 작은 화면과 터치 조작을 먼저 기준으로 설계하는 방식이다. 이후 큰 화면으로 확장하면 핵심 기능이 더 안정적으로 유지된다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L10_mobile_learning_flow_001
- level: 10
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile learning flow 읽기
- question_type: meaning_choice
- concepts: ["mobile_learning_flow","learning_ux","touch_flow"]
- reading_goal: 모바일에서 카드 읽기, 답 선택, 해설 확인, 다음 카드 이동이 자연스럽게 이어지는 흐름을 이해한다.
- code:
```python
readCard()
tapChoice()
showExplanation()
tapNext()
```
- question: mobile learning flow의 좋은 순서는?
- answer: 카드 읽기 → 답 선택 → 해설 확인 → 다음 카드 이동
- explanation: mobile learning flow는 모바일에서 카드 읽기, 정답 선택, 해설 확인, 다음 카드 이동이 자연스럽게 이어지는 흐름이다. 반복 학습 전체가 손에 맞아야 한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L10_mobile_ux_checklist_001
- level: 10
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile UX checklist 읽기
- question_type: meaning_choice
- concepts: ["mobile_ux_checklist","quality_gate","responsive_review"]
- reading_goal: 모바일 UI 변경 후 확인해야 할 체크리스트를 이해한다.
- code:
```python
checklist = ['viewport', 'touch target', 'spacing', 'safe area', 'code block']
```
- question: mobile UX checklist에 들어갈 항목은?
- answer: viewport, 터치 크기, 버튼 간격, safe area, 코드 블록
- explanation: viewport, hit area, spacing, safe area, code readability를 checklist로 확인한다. emulator만으로 실제 thumb reach, browser chrome, keyboard, screen reader와 performance를 알 수 없으므로 여러 실제 device, zoom, orientation과 assistive technology로 test한다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY61_L10_idempotent_sync_001
- level: 10
- file: python_offline_first_sync_conflict_v61.json
- title: idempotent sync 읽기
- question_type: meaning_choice
- concepts: ["idempotent","sync","retry"]
- reading_goal: 같은 동기화 요청이 여러 번 가도 결과가 망가지지 않게 만드는 idempotent sync를 이해한다.
- code:
```python
upsertProgress(record.id, record, operationId)
```
- question: idempotent sync가 필요한 이유는?
- answer: 재시도 때문에 같은 요청이 여러 번 실행될 수 있기 때문에
- explanation: 재시도하면 같은 요청이 여러 번 도착할 수 있으므로 서버는 안정적인 operationId로 이미 처리한 작업인지 확인해야 한다. 같은 ID와 절대 상태를 쓰는 upsert는 도움이 되지만 내부에서 점수를 누적하거나 알림을 보내면 그것만으로 멱등성이 보장되지는 않는다. 중복 요청이 와도 최종 상태와 부수 효과가 한 번 처리된 것과 같아야 한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L10_offline_sync_flow_001
- level: 10
- file: python_offline_first_sync_conflict_v61.json
- title: offline sync flow 읽기
- question_type: meaning_choice
- concepts: ["offline_sync_flow","offline_first","cloud_sync"]
- reading_goal: 로컬 저장, 큐 적재, 온라인 감지, 서버 동기화, 충돌 해결까지 이어지는 전체 흐름을 이해한다.
- code:
```python
saveLocal()
markDirty()
queueSync()
flushOnline()
resolveConflict()
```
- question: offline sync flow의 자연스러운 순서는?
- answer: 로컬 저장 → dirty 표시 → sync queue 적재 → 온라인 시 전송 → 충돌 해결
- explanation: 먼저 변경을 로컬에 영속 저장하고 dirty 표시와 안정적인 작업 ID를 큐에 남긴다. 온라인 상태라는 신호만 믿지 말고 실제 전송을 시도해 서버 승인을 확인한다. 서버 버전이 달라 충돌하면 해결한 뒤 새 버전을 저장하고, 성공이 확인된 큐 항목만 제거해야 빠른 저장과 데이터 보존을 함께 만족한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L10_sync_quality_gate_001
- level: 10
- file: python_offline_first_sync_conflict_v61.json
- title: sync quality gate 읽기
- question_type: meaning_choice
- concepts: ["quality_gate","sync","test_case"]
- reading_goal: 오프라인 저장, 온라인 복구, 충돌 처리를 테스트하는 품질 기준을 이해한다.
- code:
```python
assert saveOffline()
assert syncWhenOnline()
assert conflictDetected()
```
- question: sync quality gate의 목적은?
- answer: 오프라인과 동기화 상황에서도 기록이 안전한지 검증하기 위해
- explanation: sync quality gate는 오프라인 저장, 재실행 뒤 큐 복구, 중복 요청, 연결 재개와 실제 충돌을 검증한다. 필드 존재만 확인해서는 충분하지 않다. 실패 직후 앱을 닫는 경우, 여러 기기에서 동시에 고치는 경우, 삭제와 수정이 맞서는 경우에도 기록이 조용히 사라지지 않는지 테스트해야 한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY27_L10_dependency_lock_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: dependency lock 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","dependency_lock","reproducibility","package"]
- reading_goal: 의존성 버전을 고정해 재현성을 높이는 이유를 이해한다.
- code:
```python
# requirements.txt
fastapi==0.115.0
uvicorn==0.30.6
pydantic==2.8.2
```
- question: 이처럼 ==로 버전을 고정하는 장점은?
- answer: 다른 PC에서도 같은 버전 조합을 재현하기 쉽다
- explanation: 세 direct package의 exact version은 이 세 requirement가 다른 PC에서도 같은 release를 선택하게 돕는다. 하지만 transitive dependencies, artifact hash, Python/platform marker가 완전히 고정되지 않아 엄밀한 lock file은 아니다. resolver로 생성한 lock, trusted index와 hash, 정기 update·security review를 함께 사용한다.
- project_context: GPU 서버/노트북/로컬 PC에서 같은 결과를 만들려면 의존성 재현성이 중요하다.

## PY27_L10_dev_prod_config_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: dev/prod 설정 분리 읽기
- question_type: meaning_choice
- concepts: ["config","dev_prod","environment"]
- reading_goal: 개발환경과 운영환경의 API URL을 분리하는 구조를 이해한다.
- code:
```python
CONFIG = {
    "dev": {"api_base": "http://127.0.0.1:8000"},
    "prod": {"api_base": "https://api.example.com"},
}

env_name = "dev"
api_base = CONFIG[env_name]["api_base"]
```
- question: env_name이 dev이면 api_base는?
- answer: http://127.0.0.1:8000
- explanation: dev/prod config는 개발 환경과 운영 환경의 설정을 나누는 방식이다. CONFIG['dev']['api_base']처럼 환경별 값을 읽으면 배포 대상에 맞게 주소를 바꿀 수 있다. 따라서 정답은 ‘http://127.0.0.1:8000’이다.
- project_context: 로컬 FastAPI와 배포 API 주소를 혼동하지 않게 하는 방식이다.

## PY27_L10_env_file_load_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: .env 로딩 코드 읽기
- question_type: meaning_choice
- concepts: ["import","dotenv","env_file","configuration","secret"]
- reading_goal: .env 파일에서 설정값을 로딩하는 코드의 의미를 이해한다.
- code:
```python
from dotenv import load_dotenv
import os

load_dotenv()
api_base = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
```
- question: API_BASE_URL이 없으면 api_base는?
- answer: http://127.0.0.1:8000
- explanation: load_dotenv는 기본적으로 기존 environment value를 덮어쓰지 않고 .env에서 아직 없는 값을 채운다. os.getenv의 default는 variable이 아예 없을 때만 쓰이며 값이 empty string이면 empty string을 반환한다. production에서 잘못된 missing setting을 조용히 localhost로 보내지 않도록 environment별 required validation을 두고 .env secret은 commit하지 않는다.
- project_context: 로컬/운영 API 주소, 키, 옵션을 코드 수정 없이 바꾸는 방식이다.

## PY27_L10_package_entrypoint_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: 패키지 entrypoint 개념 읽기
- question_type: meaning_choice
- concepts: ["entrypoint","cli","packaging"]
- reading_goal: 명령어 하나로 Python 함수를 실행하게 연결하는 개념을 이해한다.
- code:
```python
[project.scripts]
py-reader-validate = "tools.validate:main"
```
- question: py-reader-validate는 무엇에 연결되는가?
- answer: tools.validate 모듈의 main 함수
- explanation: package를 install하면 packaging tool이 py-reader-validate command를 만들고 실행 시 import 가능한 tools.validate module의 main callable을 부른다. module path가 package에 포함되어야 하고 main은 argument·exit code를 CLI 규약에 맞게 처리해야 한다. 이 table을 적는 것만으로 source checkout에서 command가 즉시 생기지는 않는다.
- project_context: 나중에 검증 스크립트를 명령어화할 때 유용하다.

## PY27_L10_readme_run_section_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: README 실행법 섹션 읽기
- question_type: meaning_choice
- concepts: ["comment","readme","setup","runbook","documentation"]
- reading_goal: README에 설치/실행/검증 명령을 남기는 이유를 이해한다.
- code:
```python
## Run locally

1. Clone the repository and create the documented Python environment.
2. Run `./run_local_server.ps1` from the repository root.
3. Open `http://localhost:8790/src/pwa/index.html`.
```
- question: README의 Run locally 섹션이 중요한 이유는?
- answer: 나중에 같은 실행 절차를 빠르게 재현하기 위해
- explanation: Run section은 새 reader가 prerequisite, environment 생성, dependency 설치, validation과 launch를 순서대로 재현하게 해야 한다. 개인 absolute path 대신 repository root 기준 command와 지원 OS/shell, expected output, stop 방법과 common error link를 적어야 실제 runbook이 된다.
- project_context: 다음 대화창 인계와 로컬 실행 루틴 정리에 중요하다.

## PY27_L10_repro_setup_checklist_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: 재현 가능한 설치 체크리스트 읽기
- question_type: order_choice
- concepts: ["comment","setup_checklist","reproducibility","environment"]
- reading_goal: 새 PC/서버에서 같은 프로젝트를 다시 띄우는 순서를 이해한다.
- code:
```python
# 1. git clone
# 2. python --version
# 3. python -m venv .venv
# 4. activate venv
# 5. pip install -r requirements.txt
# 6. run validation
# 7. start local server
```
- question: 가상환경을 만든 뒤 보통 바로 이어질 단계는?
- answer: venv 활성화 후 의존성 설치
- explanation: venv 생성 뒤에는 해당 shell에서 activate하고 그 interpreter의 python -m pip로 verified requirements를 설치하는 흐름이 흔하다. activation 없이 .venv Python을 직접 호출해도 된다. 재현성을 위해 repository revision, Python version, lock/hash, OS prerequisite, validation result까지 기록하며 local server는 개발용으로 제한한다.
- project_context: 새 워크스테이션/서버를 받을 때 프로젝트를 재현하는 절차다.

## PY27_L10_run_script_portable_001
- level: 10
- file: python_packaging_env_dependencies_v27.json
- title: portable run script 읽기
- question_type: meaning_choice
- concepts: ["run_script","portable","path","server"]
- reading_goal: 프로젝트 루트로 이동한 뒤 서버를 실행하는 스크립트 구조를 읽는다.
- code:
```python
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
python -m http.server 8790 --bind 127.0.0.1
```
- question: Set-Location을 먼저 하는 이유는?
- answer: 상대경로 기준을 프로젝트 루트로 맞추기 위해
- explanation: script 자신의 directory를 계산해 그곳으로 이동하므로 사용자별 D: 경로를 hard-code하지 않고 상대 file serving root를 맞춘다. 그래도 python command가 원하는 interpreter인지와 port 사용 여부를 확인해야 한다. http.server는 localhost 개발용이지 production server가 아니다.
- project_context: 현재 run_local_server.ps1의 핵심 구조다.

## PY53_L10_large_card_ux_strategy_001
- level: 10
- file: python_performance_large_card_ux_v53.json
- title: large card UX strategy 읽기
- question_type: meaning_choice
- concepts: ["large_card_ux","performance_strategy","learning_app"]
- reading_goal: 대량 카드 학습앱에서 로딩, 검색, 렌더링, 피드백을 함께 설계하는 전략을 이해한다.
- code:
```python
loadFast()
showProgress()
searchWithDebounce()
renderVisibleOnly()
```
- question: large card UX strategy의 핵심은?
- answer: 빠르게 로드하고, 상태를 보여주고, 검색을 줄이고, 보이는 것만 렌더링하는 것
- explanation: 빠른 첫 화면, 명확한 loading·error 상태, 입력 debounce, visible-only rendering은 큰 목록 UX의 후보 전략이다. 모든 app에 전부 필요한 것은 아니며 측정된 bottleneck과 사용자 task에 맞춰 pagination, indexing, virtualization을 고른다. 검색 정확성과 접근성을 성능 때문에 희생하지 않는다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L10_performance_budget_001
- level: 10
- file: python_performance_large_card_ux_v53.json
- title: performance budget 읽기
- question_type: meaning_choice
- concepts: ["performance_budget","quality_gate","UX"]
- reading_goal: 로딩 시간이나 렌더링 시간에 목표 기준을 두는 performance budget을 이해한다.
- code:
```python
budget = {
  initialLoadMs: 1500,
  searchMs: 100,
  renderMs: 200
}
```
- question: performance budget의 목적은?
- answer: 앱이 느려지지 않도록 성능 목표를 정해두기 위해
- explanation: performance budget은 initial load, search, render의 목표를 수치로 정해 regression을 찾게 한다. 1500/100/200ms는 예시이며 device·network 조건과 p75/p95 같은 percentile, 측정 시작·종료점을 명시해야 한다. 넘었다고 기능을 바로 제거하기보다 profile로 원인을 찾는다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.
