# V356 semantic review — Level 10 chunk 2

Cards 21-40 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY26_L10_async_producer_consumer_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: async producer-consumer 읽기
- question_type: meaning_choice
- concepts: ["for","while","producer_consumer","asyncio_queue","pipeline"]
- reading_goal: producer가 queue에 넣고 consumer가 꺼내 처리하는 비동기 구조를 읽는다.
- code:
```python
queue = asyncio.Queue()

async def producer(items):
    for item in items:
        await queue.put(item)

async def consumer():
    while True:
        item = await queue.get()
        await process(item)
        queue.task_done()
```
- question: producer의 역할은?
- answer: items를 queue에 넣는다
- explanation: producer는 각 item을 queue에 넣고 consumer는 get 후 process한다. 이 queue는 maxsize가 없어 producer가 훨씬 빠르면 memory가 계속 늘 수 있고, consumer는 종료 sentinel이 없어 영원히 기다린다. process가 exception을 내도 task_done이 호출되게 try/finally를 쓰고 bounded queue, 종료·cancellation·error propagation을 설계한다.
- project_context: 수집→정제→임베딩 같은 파이프라인을 흐름으로 나눌 때 쓰는 구조다.

## PY26_L10_background_job_status_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: background job 상태 저장 읽기
- question_type: meaning_choice
- concepts: ["def","function","try_except","background_job","status","database","progress"]
- reading_goal: 오래 걸리는 작업의 상태를 DB에 기록하는 구조를 이해한다.
- code:
```python
def start_job(job_id):
    repo.update_job(job_id, status="running", progress=0)
    try:
        run_long_task(job_id)
        repo.update_job(job_id, status="done", progress=100)
    except Exception as e:
        repo.update_job(job_id, status="error", error=str(e))
        raise
```
- question: 예외가 발생하면 job 상태는 어떻게 저장되는가?
- answer: error로 저장된다
- explanation: run_long_task가 exception을 내면 error status와 str(e)를 저장하려 한 뒤 exception을 다시 전달한다. error update 자체가 실패하면 running 상태가 남고 원래 exception이 가려질 수 있다. heartbeat/lease와 finally cleanup, sanitized error code, state transition 조건과 durable transaction을 두어 competing worker의 overwrite를 막는다.
- project_context: 긴 LoRA/노드패스/수집 작업 상태를 UI에서 보여주기 위한 기본 구조다.

## PY26_L10_cancel_graceful_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: graceful cancel 읽기
- question_type: meaning_choice
- concepts: ["if","for","break","cancel","graceful_shutdown","checkpoint"]
- reading_goal: 중단 신호가 오면 현재 상태를 저장하고 안전하게 빠지는 구조를 읽는다.
- code:
```python
stop_requested = False

for item in items:
    if stop_requested:
        save_checkpoint()
        break
    process(item)
```
- question: stop_requested가 True이면 무엇을 하는가?
- answer: checkpoint를 저장하고 루프를 빠져나간다
- explanation: 조건이 True이면 checkpoint 저장을 시도한 뒤 break로 loop를 끝낸다. 이 snippet만 보면 stop_requested를 바꾸는 signal handler나 다른 thread가 없어 실제로는 계속 False다. cancellation source, 현재 item의 atomicity, resource cleanup과 checkpoint 실패 처리까지 있어야 graceful하며 강제 종료에는 여전히 대비해야 한다.
- project_context: 비용 제한이나 서버 종료 전에 산출물을 안전하게 남기는 운영 패턴이다.

## PY26_L10_gpu_batch_size_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: GPU batch size 사고방식 읽기
- question_type: meaning_choice
- concepts: ["for","gpu","batch_size","memory","throughput"]
- reading_goal: batch_size가 처리량과 메모리에 영향을 준다는 코드를 읽는다.
- code:
```python
batch_size = 8
for batch in chunks(prompts, batch_size):
    outputs = model.generate(batch)
    save_outputs(outputs)
```
- question: batch_size를 너무 크게 잡으면 주로 어떤 문제가 날 수 있는가?
- answer: GPU 메모리 부족
- explanation: 한 번에 처리하는 input 수가 늘면 model weight 외 activation과 temporary buffer memory가 늘어 GPU OOM이 날 수 있다. 필요한 memory는 sequence length, output length, dtype와 model architecture에도 크게 좌우된다. 또한 실제 library가 list[str]를 직접 받는지 tokenization을 요구하는지 API를 확인하고 측정으로 safe batch size를 정한다.
- project_context: LoRA 추론/노드패스/임베딩 생성에서 속도와 메모리 균형을 볼 때 중요하다.

## PY26_L10_job_manifest_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: job manifest 읽기
- question_type: meaning_choice
- concepts: ["manifest","batch_job","status","resume"]
- reading_goal: 작업 대상과 상태를 manifest 파일로 관리하는 방식을 이해한다.
- code:
```python
{
  "job_id": "nodepass_20260529",
  "shards": [31, 32, 33],
  "status": "running",
  "completed": [31, 32]
}
```
- question: completed에 [31, 32]가 있다는 뜻은?
- answer: 31, 32 shard는 완료된 것으로 기록됐다
- explanation: completed list는 31과 32가 완료됐다고 manifest에 기록되었다는 뜻이지 실제 output이 유효하다는 증명은 아니다. shard result와 checksum을 확인한 뒤 manifest를 atomic하게 갱신하고, status와 completed가 모순되지 않게 validation한다. 여러 worker가 쓸 때 lock이나 compare-and-swap도 필요하다.
- project_context: 샤드 상태 확인, 재개, 산출물 회수 루틴과 잘 맞는다.

## PY26_L10_queue_join_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: queue.join 완료 대기 읽기
- question_type: meaning_choice
- concepts: ["for","print","queue","join","task_done","completion"]
- reading_goal: 큐에 들어간 모든 작업이 끝날 때까지 기다리는 구조를 이해한다.
- code:
```python
for item in items:
    await queue.put(item)

await queue.join()
print("all done")
```
- question: await queue.join()의 의미는?
- answer: 큐에 들어간 작업들이 task_done 될 때까지 기다린다
- explanation: queue.join은 put으로 늘어난 unfinished-task count가 각 item의 task_done으로 0이 될 때까지 기다린다. consumer가 실행 중이어야 하고 get한 item마다 정확히 한 번 task_done을 호출해야 한다. 누락하면 영원히 기다리고 두 번 호출하면 ValueError가 나므로 process를 try/finally로 감싸는 것이 안전하다.
- project_context: 모든 다운로드/추론/검증 작업이 끝난 뒤 다음 단계로 넘어가야 할 때 중요하다.

## PY26_L10_tmux_nohup_concept_001
- level: 10
- file: python_async_batch_queue_v26.json
- title: tmux/nohup 장기 실행 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","tmux","nohup","long_running","server"]
- reading_goal: 내 PC 연결이 끊겨도 서버에서 작업을 계속 돌리는 개념을 이해한다.
- code:
```python
# tmux example
# tmux new -s nodepass
# python run_shards.py --start 31 --end 100
# Press Ctrl+B, then D to detach

# nohup example
# nohup python run_shards.py > run.log 2>&1 &
```
- question: tmux detach의 목적에 가장 가까운 것은?
- answer: 세션을 닫지 않고 뒤에서 계속 실행하게 한다
- explanation: tmux detach는 tmux session과 그 안의 process를 유지한 채 현재 client만 분리하고 나중에 attach할 수 있게 한다. nohup은 hangup signal 처리를 바꾸고 &가 shell background로 실행하며 output을 명시한 log로 보낸다. 어느 방식도 crash recovery를 보장하지 않으므로 exit status, disk space, log rotation, checkpoint와 supervisor를 별도로 둔다.
- project_context: EC2/워크스테이션에서 shard를 밤새 돌릴 때 필요한 운영 개념이다.

## PY36_L10_background_task_001
- level: 10
- file: python_async_queue_batch_jobs_v36.json
- title: background task 읽기
- question_type: meaning_choice
- concepts: ["background_task","long_running_job","server"]
- reading_goal: 요청 응답과 별개로 오래 걸리는 작업을 뒤에서 실행하는 background task 개념을 이해한다.
- code:
```python
POST /api/start-job

202 Accepted
{"job_id": "job_123", "status": "queued"}

durable worker:
  process job_123
```
- question: API가 바로 job_id를 돌려주는 이유는?
- answer: 긴 작업을 기다리지 않고 진행 상태를 나중에 확인하게 하려고
- explanation: 서버는 긴 작업을 내구성 있는 큐에 넣고 202 Accepted와 job_id를 돌려줘 클라이언트가 나중에 상태를 조회하게 할 수 있다. 이 응답은 완료가 아니라 접수됐다는 뜻이다. 프로세스 재시작에도 살아남는 큐, 중복 방지, 실패 기록, 상태 조회와 완료 알림을 함께 설계해야 한다.
- project_context: 노드 추출, 임베딩 생성, 대량 검증 같은 긴 작업을 웹 UI에 붙일 때 필요한 방식이다.

## PY36_L10_job_status_001
- level: 10
- file: python_async_queue_batch_jobs_v36.json
- title: job status 읽기
- question_type: meaning_choice
- concepts: ["job_status","running","done","failed"]
- reading_goal: 긴 작업의 상태를 running/done/failed 같은 값으로 관리하는 이유를 이해한다.
- code:
```python
job = {
  "id": "shard_001",
  "status": "running",
  "done": 120,
  "total": 200
}
```
- question: 이 job은 현재 어떤 상태인가?
- answer: running
- explanation: status는 작업이 대기 중인지, 실행 중인지, 완료됐는지, 실패했는지 알려준다. job status는 작업이 대기 중인지, 실행 중인지, 성공했는지, 실패했는지를 나타내는 상태값이다. 상태 전이가 어떤 조건에서 바뀌는지 보면 운영 흐름을 이해하기 쉽다. 따라서 정답은 ‘running’이다.
- project_context: 서버에서 샤드 진행률을 확인하는 상태 로그와 연결된다.

## PY36_L10_progress_log_001
- level: 10
- file: python_async_queue_batch_jobs_v36.json
- title: progress log 읽기
- question_type: meaning_choice
- concepts: ["progress_log","monitoring","long_running_job"]
- reading_goal: 긴 작업의 진행률 로그에서 현재 처리량과 남은 작업을 읽는다.
- code:
```python
[KG node_pass status]
range: 31~100
done: 33/70
GPU util=23%
```
- question: done: 33/70의 의미는?
- answer: 70개 중 33개가 끝났다
- explanation: done: 33/70은 이 로그가 정의한 전체 70개 중 33개를 완료로 기록했다는 뜻이다. range 31~100을 양끝 포함으로 세면 70개다. GPU util=23%는 순간 자원 사용률일 뿐 완료율이 아니며, 로그가 최신이고 done 판정이 정확한지도 확인해야 한다.
- project_context: EC2/GPU 서버에서 긴 job을 돌릴 때 상태 판단에 쓰는 로그 형태다.

## PY36_L10_resume_001
- level: 10
- file: python_async_queue_batch_jobs_v36.json
- title: resume 처리 읽기
- question_type: meaning_choice
- concepts: ["if","for","continue","resume","checkpoint","skip_done"]
- reading_goal: 이미 끝난 작업을 건너뛰고 남은 작업만 이어서 처리하는 resume 로직을 이해한다.
- code:
```python
done = load_done_ids()

for job in all_jobs:
    if job.id in done:
        continue
    process(job)
```
- question: if job.id in done: continue의 의미는?
- answer: 이미 완료된 job은 건너뛴다
- explanation: done에 있는 ID는 continue로 건너뛰고 나머지만 처리한다. 안전한 resume이 되려면 done 목록이 성공한 결과와 함께 내구성 있고 원자적으로 기록되어야 하며, 손상되거나 너무 일찍 표시되지 않아야 한다. process 자체도 재실행에 견디도록 설계하면 중단 경계의 중복 처리 위험을 줄일 수 있다.
- project_context: 샤드가 일부 완료된 상태에서 재실행할 때 반드시 필요한 패턴이다.

## PY36_L10_retry_queue_001
- level: 10
- file: python_async_queue_batch_jobs_v36.json
- title: retry queue 읽기
- question_type: meaning_choice
- concepts: ["if","else","try_except","retry_queue","failed_jobs","resilience"]
- reading_goal: 실패한 작업만 따로 모아 다시 시도하는 retry queue 구조를 이해한다.
- code:
```python
try:
    process(job)
except TransientError:
    if job.attempts < MAX_ATTEMPTS:
        retry_queue.push(job)
    else:
        dead_letter_queue.push(job)
```
- question: retry_queue.push(job)의 의미는?
- answer: 실패한 작업을 재시도 대기열에 넣는다
- explanation: retry queue에는 네트워크 일시 장애처럼 재시도로 회복될 가능성이 있는 실패만 넣는다. 모든 Exception을 무제한 다시 넣으면 코드 버그나 영구 실패가 끝없이 반복될 수 있다. 시도 횟수, backoff, 중복 실행 안전성, 최종 실패를 보관할 dead-letter 정책이 필요하다.
- project_context: API 호출 실패, 모델 응답 실패, 파일 처리 실패를 관리하는 데 유용하다.

## PY38_L10_cors_auth_header_001
- level: 10
- file: python_auth_security_tokens_permissions_v38.json
- title: CORS와 인증 헤더 읽기
- question_type: meaning_choice
- concepts: ["CORS","Authorization_header","preflight"]
- reading_goal: 브라우저가 Authorization header를 포함한 cross-origin 요청을 더 엄격히 다룰 수 있음을 이해한다.
- code:
```python
fetch("http://localhost:8000/api/progress", {
  headers: {
    "Authorization": "Bearer token"
  }
})
```
- question: 이 요청에서 CORS 설정이 중요해지는 이유는?
- answer: 다른 origin에 인증 헤더를 보내기 때문
- explanation: 다른 origin으로 Authorization 같은 단순 허용 목록 밖의 header를 보내면 브라우저는 보통 preflight 요청으로 서버 허용 여부를 확인한다. 서버는 필요한 origin, method, Authorization header만 명시적으로 허용해야 한다. CORS는 토큰 검증을 대신하지 않으며 허용 origin을 넓게 잡아도 서버 인증·인가가 반드시 필요하다.
- project_context: PWA와 FastAPI 서버를 따로 띄우면 만날 수 있는 문제다.

## PY38_L10_rate_limit_abuse_001
- level: 10
- file: python_auth_security_tokens_permissions_v38.json
- title: rate limit / abuse prevention 읽기
- question_type: meaning_choice
- concepts: ["if","return","rate_limit","abuse_prevention","security"]
- reading_goal: 로그인/API 요청을 너무 많이 보내는 악용을 제한하는 이유를 이해한다.
- code:
```python
if requests_per_minute(user_id) > 60:
    return 429 Too Many Requests
```
- question: 429 Too Many Requests의 의미는?
- answer: 요청이 너무 많아 제한됐다
- explanation: 429는 적용된 제한 기준을 넘어 요청이 너무 많아 현재 요청이 거절됐다는 뜻이다. rate limit은 비용과 자동화 남용을 줄이는 한 겹의 방어지만, 분산 공격·계정별 우회·무차별 로그인 자체를 모두 막지는 않는다. 인증 전에는 IP 등 다른 신호도 쓰고 Retry-After, 탐지, lockout 위험, CAPTCHA 같은 보완책을 함께 설계한다.
- project_context: 공개 API나 학습 서비스 운영 시 필수적인 안전장치다.

## PY38_L10_role_permission_001
- level: 10
- file: python_auth_security_tokens_permissions_v38.json
- title: role / permission 읽기
- question_type: meaning_choice
- concepts: ["role","permission","RBAC"]
- reading_goal: 역할에 따라 허용되는 기능을 나누는 권한 모델을 이해한다.
- code:
```python
roles:
  student: read_cards, save_progress
  parent: read_report
  admin: manage_cards
```
- question: admin 역할에 자연스러운 권한은?
- answer: manage_cards
- explanation: role permission은 사용자 역할에 따라 가능한 작업을 제한하는 권한 방식이다. 관리자, 일반 사용자, 게스트의 허용 기능을 다르게 둘 수 있다. 권한 검사는 화면 숨김뿐 아니라 서버 요청 처리 단계에서도 다시 확인해야 한다. 따라서 정답은 ‘manage_cards’이다.
- project_context: 학생/부모/관리자 기능을 나눌 때 필요한 설계다.

## PY38_L10_server_side_storage_001
- level: 10
- file: python_auth_security_tokens_permissions_v38.json
- title: server-side storage 읽기
- question_type: meaning_choice
- concepts: ["server_side_storage","secret_storage","database"]
- reading_goal: 민감한 토큰/키를 프론트엔드가 아니라 서버 측에 저장하는 이유를 이해한다.
- code:
```python
browser cookie:
  opaque_session_id; Secure; HttpOnly; SameSite=Lax

server secret store:
  encrypted_api_key
  refresh_token
```
- question: API key를 서버 측에 저장하는 이유는?
- answer: 브라우저 코드에 노출되지 않게 하기 위해
- explanation: 비밀 API key와 refresh token을 브라우저 코드에 보내지 않고 접근이 통제된 서버 저장소에 두면 직접 노출을 줄일 수 있다. 암호화 at rest만으로 충분하지 않으므로 암호화 key 분리, 최소 권한, 로그 마스킹, 회전이 필요하다. 브라우저에는 실제 비밀 대신 보안 속성을 둔 불투명 session ID만 전달한다.
- project_context: 사용자별 API 키를 안전하게 저장하는 구조와 연결된다.

## PY38_L10_token_expiration_001
- level: 10
- file: python_auth_security_tokens_permissions_v38.json
- title: token expiration 읽기
- question_type: meaning_choice
- concepts: ["if","return","token_expiration","exp","security"]
- reading_goal: 토큰 만료 시간이 보안과 재로그인 흐름에 주는 영향을 읽는다.
- code:
```python
if token.exp < now:
    return 401 Unauthorized
```
- question: 토큰이 만료되면 보통 어떤 응답이 자연스러운가?
- answer: 401 Unauthorized
- explanation: 서버가 토큰의 exp를 검증해 만료됐다고 판단하면 그 credential으로는 인증할 수 없으므로 보통 401 응답이 자연스럽다. 403은 대개 인증은 됐지만 해당 작업 권한이 없을 때 사용한다. 클라이언트 시각만 믿지 말고 서버 시각과 작은 clock skew 정책을 기준으로 검증한다.
- project_context: access token 만료 후 refresh token으로 재발급받는 흐름과 연결된다.

## PY22_L10_auth_dependency_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: FastAPI 인증 dependency 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","fastapi","depends","auth","current_user"]
- reading_goal: endpoint마다 반복되는 인증 로직을 dependency로 분리하는 구조를 읽는다.
- code:
```python
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
):
    return verify_token(credentials.credentials)

@app.get("/private")
def private(user = Depends(get_current_user)):
    return {"user_id": user.id}
```
- question: Depends(get_current_user)의 역할은?
- answer: 요청 전에 토큰을 검증하고 user를 endpoint에 넣는다
- explanation: HTTPBearer dependency가 Authorization header의 Bearer scheme과 credential을 parse하고, get_current_user가 verify_token으로 signature와 필수 claims를 검증해 user를 만든다. HTTPBearer 자체가 JWT 유효성을 확인하는 것은 아니다. endpoint의 Depends는 이 검증이 성공한 뒤에만 user를 전달하며 resource별 authorization은 별도로 검사해야 한다.
- project_context: private API, 개인 노트/학습 기록, 사용자별 키 조회 API에 필요한 구조다.

## PY22_L10_encrypted_secret_storage_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: 암호화된 secret 저장 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","function","encryption","secret_storage","api_key","database"]
- reading_goal: 사용자 API 키를 평문 대신 암호화해서 DB에 저장하는 흐름을 이해한다.
- code:
```python
def save_user_api_key(user_id, api_key):
    encrypted = encrypt(api_key)
    repo.upsert_secret(user_id=user_id, encrypted_value=encrypted)
```
- question: encrypted_value를 저장하는 이유는?
- answer: DB에 API 키 평문을 직접 저장하지 않기 위해
- explanation: DB에 plaintext API key 대신 ciphertext를 저장하면 DB snapshot만 유출됐을 때 직접 노출을 줄일 수 있다. 효과를 내려면 encryption key를 DB와 분리된 KMS나 secret manager에서 관리하고, authenticated encryption과 user/context binding, 접근 제어, audit, rotation을 사용해야 한다. application이나 key도 함께 침해되면 복호화될 수 있으며 key가 log나 backup에 남지 않게 해야 한다.
- project_context: 사용자 API 키를 서버측에 안전하게 저장하고 OAuth 계정으로 불러오는 구조와 직접 연결된다.

## PY22_L10_oauth_callback_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: OAuth callback 흐름 읽기
- question_type: order_choice
- concepts: ["def","function","return","oauth","callback","code","token_exchange"]
- reading_goal: OAuth 로그인 후 code를 token으로 교환하는 흐름을 이해한다.
- code:
```python
@app.get("/auth/callback")
def callback(code: str):
    token = exchange_code_for_token(code)
    user = fetch_user_profile(token)
    return create_session(user)
```
- question: 이 코드의 흐름으로 맞는 것은?
- answer: code 교환 → 사용자 프로필 조회 → 세션 생성
- explanation: 표면적인 순서는 authorization code 교환, provider의 검증된 user 정보 조회, local session 생성이다. 안전한 OAuth/OIDC callback은 시작 요청과 연결되는 state를 검증하고, public client에는 PKCE를 사용하며, redirect URI와 issuer·audience·nonce를 확인해야 한다. provider token을 곧바로 신뢰하거나 code를 log에 남기면 안 된다.
- project_context: OAuth/OIDC callback에서 외부 identity를 검증한 뒤 local session을 만드는 흐름이다.
