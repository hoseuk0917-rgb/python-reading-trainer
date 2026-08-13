# V356 semantic review — Level 10 chunk 7

Cards 121-140 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY59_L10_error_recovery_flow_001
- level: 10
- file: python_error_recovery_retry_ux_v59.json
- title: error recovery flow 읽기
- question_type: meaning_choice
- concepts: ["error_recovery_flow","fallback_UI","retry"]
- reading_goal: 오류 감지, 안내, 재시도, 캐시 대체, 로그 기록까지 이어지는 복구 흐름을 이해한다.
- code:
```python
detectError()
logSafely()
showCacheOrFallback()
offerRetry()
restoreState()
```
- question: error recovery flow의 자연스러운 순서는?
- answer: 오류 감지 → 안전한 로그 기록 → 캐시 또는 대체 안내 → 재시도 제공 → 상태 복구
- explanation: 오류를 감지하면 먼저 진단 정보를 민감 정보 없이 기록한다. 그다음 사용할 수 있는 캐시나 대체 화면을 보여 주고, 안전하게 반복 가능한 작업에는 재시도를 제공한다. 성공하면 입력과 화면 상태를 복구해야 한다. 실제 구현에서는 캐시 표시와 재시도 순서가 상황에 따라 달라질 수 있지만, 사용자가 데이터 손실 없이 다음 행동을 알 수 있어야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L10_recovery_quality_gate_001
- level: 10
- file: python_error_recovery_retry_ux_v59.json
- title: recovery quality gate 읽기
- question_type: meaning_choice
- concepts: ["quality_gate","error_recovery","test_case"]
- reading_goal: 오류 복구 UX가 실제로 동작하는지 테스트 케이스로 확인하는 습관을 이해한다.
- code:
```python
assert loadFailedShowsRetry()
assert invalidJsonShowsMessage()
assert cacheFallbackWorks()
```
- question: recovery quality gate의 목적은?
- answer: 실패 상황에서도 앱이 안내와 복구 행동을 제공하는지 검증하기 위해
- explanation: recovery quality gate는 실패 상황에서도 사용자가 복구할 수 있는지 확인하는 검증 기준이다. 성공 케이스만 테스트하면 실제 실패 UX를 놓치기 쉽다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L10_retry_policy_001
- level: 10
- file: python_error_recovery_retry_ux_v59.json
- title: retry policy 읽기
- question_type: meaning_choice
- concepts: ["retry_policy","backoff","resilience"]
- reading_goal: 무한 재시도를 피하고 횟수와 간격을 정하는 retry policy를 이해한다.
- code:
```python
maxRetries = 3
waitMs = 500 * (2 ** attempt)
```
- question: retry policy가 필요한 이유는?
- answer: 무한 재시도나 과도한 요청을 막기 위해
- explanation: retry policy는 어떤 실패를 몇 번, 어떤 간격으로 다시 시도할지 정하는 규칙이다. 예시는 시도 횟수에 따라 대기 시간이 커지는 지수 backoff의 단순 형태다. 실제 서비스에서는 여러 클라이언트가 동시에 몰리지 않도록 작은 무작위 지연(jitter)을 더하고, 일시적이며 반복 실행해도 안전한 요청만 재시도해야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY20_L10_api_service_repository_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: API-Service-Repository 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","api","service","repository","architecture"]
- reading_goal: endpoint가 직접 모든 일을 하지 않고 service/repository로 위임하는 구조를 읽는다.
- code:
```python
@app.get("/search")
def search(q: str):
    return search_service.search(q)

class SearchService:
    def search(self, q):
        chunks = self.repo.find_chunks(q)
        return self.answer_builder.build(q, chunks)
```
- question: endpoint가 search_service.search(q)를 호출하는 이유에 가장 가까운 것은?
- answer: API 계층과 검색 로직을 분리하기 위해
- explanation: endpoint는 요청/응답에 집중하고, 실제 검색 로직은 service가 담당하게 나누면 유지보수가 쉽다. API-Service-Repository 흐름은 endpoint가 요청을 받고 service가 규칙을 처리한 뒤 repository가 DB를 다루는 구조다. 테스트와 유지보수에 유리하다.
- project_context: 교육 서비스/RAG 서비스 MVP를 조금 더 깔끔하게 키울 때 필요한 구조다.

## PY20_L10_api_timeout_retry_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: fetch timeout과 AbortController 흐름 읽기
- question_type: meaning_choice
- concepts: ["return","timeout","retry","fetch","AbortController"]
- reading_goal: 느린 API 요청을 제한 시간 안에 끝내고 실패 시 재시도하는 구조를 읽는다.
- code:
```python
async function fetchWithTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
```
- question: controller.abort()는 언제 호출되는가?
- answer: ms 시간이 지나 timeout이 발생할 때
- explanation: setTimeout callback은 ms가 지난 뒤 controller.abort()를 호출하고, 아직 진행 중인 fetch는 보통 AbortError로 reject된다. fetch가 먼저 끝나면 finally가 timer를 지운다. 이 함수는 timeout만 구현하며 retry는 전혀 하지 않는다. 재시도를 추가할 때는 AbortError와 사용자 취소를 구분하고 안전한 요청에만 횟수 제한과 backoff를 적용해야 한다.
- project_context: 로컬 RAG API가 느릴 때 프론트가 무한 대기하지 않게 하는 코드다.

## PY20_L10_async_endpoint_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: async endpoint 읽기
- question_type: meaning_choice
- concepts: ["return","async","await","endpoint","fastapi"]
- reading_goal: 비동기 endpoint에서 await로 작업을 기다리는 구조를 읽는다.
- code:
```python
@app.get("/health")
async def health():
    status = await check_database()
    return {"db": status}
```
- question: await check_database()의 의미는?
- answer: 비동기 작업 check_database가 끝날 때까지 기다린다
- explanation: await는 check_database coroutine이 완료될 때까지 현재 health task를 일시 중단한다. 그 coroutine이 non-blocking I/O에서 제어권을 event loop에 돌려주면 server가 그동안 다른 준비된 task를 실행할 수 있다. 단순히 async def로 바꾸는 것만으로 blocking DB driver나 CPU 작업이 non-blocking이 되는 것은 아니다.
- project_context: 외부 API, DB, 파일 I/O가 섞인 서버 코드에서 자주 나온다.

## PY20_L10_fetch_error_handling_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: fetch 오류 처리 읽기
- question_type: meaning_choice
- concepts: ["fetch","error_handling","http_status","frontend"]
- reading_goal: HTTP 응답이 실패일 때 명확히 에러를 던지는 코드를 읽는다.
- code:
```python
const res = await fetch("/api/search?q=lidar");
if (!res.ok) {
  throw new Error("API failed: " + res.status);
}
const data = await res.json();
```
- question: res.ok가 false이면 무슨 일이 일어나는가?
- answer: Error를 던지고 data 파싱으로 넘어가지 않는다
- explanation: Response.ok는 status가 200~299이면 true다. false이면 throw가 현재 async 흐름을 중단하므로 이 함수 안에서는 res.json까지 가지 않는다. 그러나 화면이 멈추지 않게 하려면 이 코드를 호출한 곳에서 try/catch로 error를 받아 사용자 메시지와 재시도 동작을 제공해야 한다. fetch 자체의 network rejection도 같은 경계에서 처리한다.
- project_context: 프론트에서 API 실패를 조용히 무시하지 않게 만드는 실전 패턴이다.

## PY20_L10_frontend_fetch_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: 프론트엔드 fetch API 호출 읽기
- question_type: meaning_choice
- concepts: ["return","fetch","frontend","api","json"]
- reading_goal: 브라우저 JS에서 로컬 API를 호출하고 JSON을 읽는 흐름을 이해한다.
- code:
```python
async function search(q) {
  const res = await fetch("http://127.0.0.1:8000/search?q=" + encodeURIComponent(q));
  const data = await res.json();
  return data;
}
```
- question: encodeURIComponent(q)를 쓰는 이유는?
- answer: 검색어의 공백/특수문자를 URL에 안전하게 넣기 위해
- explanation: encodeURIComponent는 q를 query 값 한 칸에 넣을 수 있도록 공백, &, # 같은 문자를 percent-encode한다. 암호화나 접근 제어는 아니다. fetch는 404나 500에서도 보통 resolve하므로 이 함수는 res.ok를 검사해야 하고, JSON이 아닌 응답이나 network 오류를 caller가 처리해야 한다.
- project_context: 정적 PWA에서 로컬 RAG API를 붙이는 흐름이다.

## PY20_L10_request_logging_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: 요청 로그 middleware 읽기
- question_type: meaning_choice
- concepts: ["return","try_except","import","print","middleware","logging","request","api"]
- reading_goal: 모든 요청의 경로와 처리 시간을 기록하는 middleware 구조를 읽는다.
- code:
```python
import time

@app.middleware("http")
async def log_requests(request, call_next):
    start = time.perf_counter()
    status = 500
    try:
        response = await call_next(request)
        status = response.status_code
        return response
    finally:
        elapsed = time.perf_counter() - start
        print(request.method, request.url.path, status, elapsed)
```
- question: call_next(request)의 역할은?
- answer: 다음 요청 처리 단계로 요청을 넘기고 응답을 받는다
- explanation: call_next는 요청을 다음 middleware와 endpoint로 보내고 response를 돌려준다. status를 먼저 500으로 두어 아래 단계가 예외를 내도 finally에서 시간과 실패 상태를 기록한다. 경과 시간에는 시스템 시각 조정의 영향을 덜 받는 perf_counter를 쓴다. production에서는 print 대신 구조화 logger와 request ID를 사용하고 민감한 query·header는 기록하지 않는다.
- project_context: API 사용량, 응답시간, 오류 상태를 추적하는 운영 코드의 기본이다.

## PY20_L10_static_plus_api_001
- level: 10
- file: python_fastapi_api_server_v20.json
- title: 정적 PWA와 API 서버 역할 구분
- question_type: meaning_choice
- concepts: ["comment","static_app","api_server","architecture","pwa"]
- reading_goal: 정적 파일 서버와 API 서버가 하는 일이 다르다는 것을 이해한다.
- code:
```python
# 정적 개발 서버
python -m http.server 8790 --bind 127.0.0.1
# 디렉터리의 HTML/CSS/JS/JSON 파일 제공

# ASGI API 개발 서버
uvicorn search_api:app --host 127.0.0.1 --port 8000
# application 코드가 검색/질문/DB 조회 요청 처리
```
- question: uvicorn 서버의 역할에 가장 가까운 것은?
- answer: 검색/질문/DB 조회 같은 동적 요청 처리
- explanation: 첫 command는 현재 디렉터리의 파일을 거의 그대로 제공하는 개발용 정적 server다. 둘째 command는 ASGI application을 실행해 route 함수가 입력에 따라 동적 응답을 만든다. FastAPI도 설정하면 정적 파일을 제공할 수 있으므로 기술적으로 완전히 분리된다는 뜻은 아니며, 둘 다 예시 설정은 localhost 개발용이다.
- project_context: 정적 frontend와 동적 API의 책임 및 개발 port를 구분하는 구조다.

## PY19_L10_atomic_write_001
- level: 10
- file: python_file_data_processing_v19.json
- title: 임시 파일 후 교체 저장 읽기
- question_type: meaning_choice
- concepts: ["import","atomic_write","temp_file","replace","safe_write"]
- reading_goal: 저장 중 실패해도 원본 파일 손상을 줄이는 패턴을 이해한다.
- code:
```python
from pathlib import Path

path = Path("result.json")
tmp = path.with_suffix(".tmp")

tmp.write_text("{\"ok\": true}", encoding="utf-8")
tmp.replace(path)
```
- question: tmp.replace(path)의 의미는?
- answer: 임시 파일을 최종 파일 위치로 교체한다
- explanation: result.tmp를 완전히 쓴 뒤 replace가 같은 디렉터리의 result.json 위치로 이름을 바꾼다. 같은 filesystem에서 운영체제가 atomic rename을 제공하면 독자가 중간 파일을 볼 위험이 줄어든다. 하지만 write가 storage에 영구 반영됐음을 보장하려면 flush/fsync와 디렉터리 fsync 정책이 필요할 수 있고, 권한·filesystem·다른 process 조건에 따라 replace도 실패할 수 있다.
- project_context: 중요한 manifest, progress, 검증 결과를 안전하게 저장할 때 쓸 수 있다.

## PY19_L10_failed_list_001
- level: 10
- file: python_file_data_processing_v19.json
- title: 실패 목록 수집 패턴 읽기
- question_type: meaning_choice
- concepts: ["for","print","error_handling","failed_list","try_except","batch"]
- reading_goal: 배치 처리 중 실패한 파일만 따로 모으는 코드를 읽는다.
- code:
```python
failed = []

for path in files:
    try:
        convert(path)
    except Exception as e:
        failed.append({"path": str(path), "error": str(e)})

print("failed", len(failed))
```
- question: 이 코드가 실패해도 전체 루프가 계속될 수 있는 이유는?
- answer: try/except로 각 파일의 오류를 잡기 때문에
- explanation: 각 convert 호출을 try/except로 감싸므로 Exception이 발생한 파일은 path와 오류 문자열을 failed에 추가한 뒤 다음 반복으로 넘어간다. 모든 Exception을 같은 방식으로 삼키면 디스크 부족이나 설정 오류 같은 시스템 전체 문제도 계속 반복할 수 있다. 예상 가능한 항목별 오류만 잡고, 치명적 오류는 중단하며, 오류 문자열의 민감 정보도 정제해야 한다.
- project_context: PDF 추출, zip 해제, JSON 파싱, 수집 파일 처리에서 꼭 필요한 운용 패턴이다.

## PY19_L10_file_exists_guard_001
- level: 10
- file: python_file_data_processing_v19.json
- title: 파일 존재 여부 guard 읽기
- question_type: meaning_choice
- concepts: ["if","import","exists","guard","file","error_handling"]
- reading_goal: 입력 파일이 없을 때 명확한 오류를 내는 코드를 읽는다.
- code:
```python
from pathlib import Path

input_path = Path("input.jsonl")
if not input_path.exists():
    raise FileNotFoundError(f"missing input: {input_path}")
```
- question: 이 guard의 목적은?
- answer: 입력 파일이 없을 때 조기에 명확히 실패시키기
- explanation: exists가 False이면 뒤 처리로 가지 않고 구체적인 path가 든 FileNotFoundError를 일찍 발생시킨다. 다만 exists는 같은 이름의 디렉터리에도 True이므로 입력이 일반 파일이어야 한다면 input_path.is_file()을 검사해야 한다. 검사 직후 파일이 사라질 수도 있으므로 실제 open 오류도 여전히 처리해야 한다.
- project_context: 긴 파이프라인에서 잘못된 경로를 빠르게 잡아내는 습관이다.

## PY19_L10_large_file_count_001
- level: 10
- file: python_file_data_processing_v19.json
- title: 대용량 파일 줄 수 세기
- question_type: meaning_choice
- concepts: ["for","print","large_file","streaming","count","memory"]
- reading_goal: 큰 파일을 전체 로드하지 않고 줄 수만 세는 코드를 읽는다.
- code:
```python
count = 0
with open("chunks.jsonl", "r", encoding="utf-8") as f:
    for _ in f:
        count += 1

print(count)
```
- question: 이 방식이 read_text().splitlines()보다 유리한 점은?
- answer: 파일 전체를 메모리에 올리지 않는다
- explanation: 대용량 파일은 한 번에 모두 읽으면 메모리를 많이 쓸 수 있다. for _ in f처럼 줄 단위로 순차 처리하면 더 안전하게 개수를 셀 수 있다. 스트리밍 방식은 파일 크기가 커져도 메모리 사용량이 비교적 일정해 배치 처리에 적합하다. 따라서 출력은 ‘파일 전체를 메모리에 올리지 않는다’이다.
- project_context: 수 GB chunk jsonl처럼 큰 파일을 점검할 때 필요한 독해다.

## PY19_L10_resume_done_set_001
- level: 10
- file: python_file_data_processing_v19.json
- title: resume 가능한 처리 루프 읽기
- question_type: meaning_choice
- concepts: ["if","for","continue","resume","checkpoint","set","batch"]
- reading_goal: 이미 처리한 id를 건너뛰고 중단 지점부터 이어가는 코드를 읽는다.
- code:
```python
done_ids = set(load_done_ids("done.txt"))

for row in rows:
    if row["id"] in done_ids:
        continue
    process(row)
    append_done_id("done.txt", row["id"])
```
- question: if row['id'] in done_ids: continue의 의미는?
- answer: 이미 처리한 항목은 건너뛴다
- explanation: done_ids에 있는 id는 continue로 건너뛰고, 새 항목은 process가 성공한 뒤 done.txt에 기록한다. set membership은 평균적으로 빠르다. 다만 process의 외부 효과는 성공했는데 완료 기록이 실패하면 재실행 때 중복 처리될 수 있다. 작업을 idempotent하게 만들거나 결과와 완료 상태를 하나의 transaction으로 기록하고, 동시 worker의 중복 실행도 제어해야 한다.
- project_context: 샤드/노드패스/파일 추출 작업처럼 오래 걸리는 루틴에 필요한 패턴이다.

## PY32_L10_config_location_001
- level: 10
- file: python_files_paths_project_structure_v32.json
- title: config 파일 위치 읽기
- question_type: meaning_choice
- concepts: ["config","settings","project_structure"]
- reading_goal: 바뀔 수 있는 설정을 코드와 분리하는 이유를 이해한다.
- code:
```python
config/
  app_settings.json

src/
  app.py
```
- question: config를 따로 두는 장점은?
- answer: 코드를 덜 고치고 설정만 바꿀 수 있다
- explanation: 일반 설정을 코드와 분리하면 환경별 값을 바꿀 때 애플리케이션 코드를 덜 수정해도 된다. 하지만 app_settings.json이나 커밋되는 .env 파일에 비밀값을 넣어도 안전해지는 것은 아니다. 비밀값은 배포 환경의 환경 변수나 전용 비밀 저장소처럼 접근이 통제된 위치에서 관리해야 한다.
- project_context: lessonFiles 목록이나 API endpoint를 장기적으로 config화할 때 필요한 사고방식이다.

## PY32_L10_file_pipeline_001
- level: 10
- file: python_files_paths_project_structure_v32.json
- title: 파일 처리 파이프라인 읽기
- question_type: meaning_choice
- concepts: ["pipeline","input","output","file_processing"]
- reading_goal: 입력 파일을 읽고 변환한 뒤 출력 파일로 저장하는 흐름을 이해한다.
- code:
```python
input_path = ".\data\raw\cards_source.json"
output_path = ".\data\lessons\cards_clean.json"

raw = read_json(input_path)
clean = normalize_cards(raw)
write_json(output_path, clean)
```
- question: 이 코드의 흐름으로 맞는 것은?
- answer: 읽기 → 정리 → 쓰기
- explanation: 이 코드는 input_path의 JSON을 읽고 normalize_cards로 정리한 뒤 output_path에 쓴다. 따라서 보이는 흐름은 읽기 → 정리 → 쓰기다. 검증이 필요하다면 write_json 전에 별도의 validate 단계가 코드에 실제로 있어야 한다.
- project_context: 카드 생성, 문서 추출, KG chunk 처리 모두 같은 패턴이다.

## PY32_L10_git_ignore_outputs_001
- level: 10
- file: python_files_paths_project_structure_v32.json
- title: .gitignore와 산출물 분리
- question_type: meaning_choice
- concepts: ["comment","gitignore","outputs","temporary_files"]
- reading_goal: Git에 올릴 파일과 올리지 않을 파일을 구분하는 이유를 이해한다.
- code:
```python
# .gitignore 예시
tmp/
outputs/
*.bak
```
- question: tmp/를 .gitignore에 넣는 이유로 가장 맞는 것은?
- answer: 임시 파일을 Git 추적에서 제외하기 위해
- explanation: .gitignore의 tmp/, outputs/, *.bak 규칙은 아직 추적되지 않은 일치 항목이 새로 Git에 추가되지 않게 한다. 이미 커밋되어 추적 중인 파일에는 규칙만 추가해도 적용되지 않는다. 또한 재생성 가능한 임시 산출물인지 확인한 뒤 제외하고, 필요한 공식 산출물은 프로젝트 정책에 따라 추적한다.
- project_context: 패치 ps1, 임시 백업, 검증 산출물을 정리할 때 필요한 개념이다.

## PY32_L10_output_folder_001
- level: 10
- file: python_files_paths_project_structure_v32.json
- title: output 폴더 구조 읽기
- question_type: meaning_choice
- concepts: ["output","artifact","folder_structure"]
- reading_goal: 스크립트 산출물을 output 폴더에 모으는 이유를 이해한다.
- code:
```python
outputs/
  validation_report_20260529.txt
  cards_summary_20260529.json
```
- question: outputs 폴더에 넣기 좋은 것은?
- answer: 검증 리포트나 생성 결과물
- explanation: output folder는 생성 결과와 리포트를 원본 코드에서 분리해 모으는 위치다. 이렇게 하면 정리, 보존 기간, 배포 포함 여부를 한곳에서 관리하기 쉽다. 다만 재현이 어렵거나 공식 산출물인 파일은 무조건 Git에서 제외하지 말고 프로젝트 정책에 따라 추적 여부를 정해야 한다.
- project_context: 확장 스크립트 결과, 검증 로그, 카드 통계를 모으는 데 쓸 수 있다.

## PY32_L10_project_structure_001
- level: 10
- file: python_files_paths_project_structure_v32.json
- title: scripts/data/src 구조 읽기
- question_type: meaning_choice
- concepts: ["project_structure","scripts","data","src"]
- reading_goal: 프로젝트에서 코드, 데이터, 스크립트 폴더를 나누는 이유를 이해한다.
- code:
```python
project/
  src/
    pwa/
  data/
    lessons/
  scripts/
    validate_lessons.ps1
```
- question: data/lessons 폴더의 역할로 맞는 것은?
- answer: 학습 카드 JSON 데이터를 보관한다
- explanation: src는 앱 코드, data는 데이터, scripts는 자동화 스크립트로 나누면 찾기 쉽다. scripts/data/src 구조는 실행 도구, 데이터 파일, 앱 코드를 역할별로 나누는 방식이다. 파일이 어디에 있어야 하는지 기준이 생겨 유지보수가 쉬워진다. 따라서 정답은 ‘학습 카드 JSON 데이터를 보관한다’이다.
- project_context: 현재 python-reading-trainer 프로젝트 구조와 직접 연결된다.
