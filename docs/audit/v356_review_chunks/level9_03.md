# V356 semantic review — Level 9 chunk 3

Cards 41-60 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY41_L09_boundary_001
- level: 9
- file: python_architecture_layers_patterns_v41.json
- title: boundary 읽기
- question_type: meaning_choice
- concepts: ["boundary","module_boundary","api_boundary"]
- reading_goal: 코드와 코드 사이의 경계를 명확히 두는 이유를 이해한다.
- code:
```python
UI boundary: click, render
API boundary: request, response
Storage boundary: read, write
```
- question: boundary가 명확하면 좋은 점은?
- answer: 문제가 어느 경계 안쪽에서 생겼는지 좁히기 쉽다
- explanation: 경계가 명확하면 UI 문제, API 문제, 저장소 문제를 분리해서 추적할 수 있다. Boundary는 책임이 나뉘는 경계다. 화면, 서버, DB, 외부 API 중 어디까지가 한 모듈의 책임인지 확인하면 수정 범위와 오류 위치를 좁히기 쉽다.
- project_context: Qwen 응답 문제도 UI, API, 모델 호출, 프롬프트 경계를 나누어 봐야 원인을 찾기 쉽다.

## PY41_L09_dependency_injection_001
- level: 9
- file: python_architecture_layers_patterns_v41.json
- title: dependency injection 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","dependency_injection","dependency","testability"]
- reading_goal: 필요한 의존성을 함수나 객체 바깥에서 넣어주는 방식을 이해한다.
- code:
```python
def build_recommender(card_repo):
    return Recommender(card_repo)

recommender = build_recommender(JsonCardRepo())
```
- question: dependency injection의 장점은?
- answer: 실제 저장소 대신 테스트용 저장소를 넣기 쉬워진다
- explanation: dependency injection은 필요한 의존성을 함수나 객체 안에서 직접 만들지 않고 바깥에서 넣어 주는 방식이다. 교체와 테스트가 쉬워진다. 예를 들어 실제 DB 대신 fake repository를 넣으면 외부 환경 없이도 테스트할 수 있다.
- project_context: 실제 lesson JSON 대신 작은 샘플 repo를 넣어 추천 로직만 테스트할 수 있다.

## PY41_L09_pure_function_side_effect_001
- level: 9
- file: python_architecture_layers_patterns_v41.json
- title: pure function vs side effect 읽기
- question_type: meaning_choice
- concepts: ["pure_function","side_effect","state"]
- reading_goal: 계산만 하는 함수와 외부 상태를 바꾸는 함수를 구분한다.
- code:
```python
pure:
  score = grade(answer, correct)

side effect:
  localStorage.setItem('progress', score)
```
- question: side effect에 가까운 것은?
- answer: localStorage에 값을 저장한다
- explanation: side effect는 파일, DB, 화면, 네트워크, localStorage처럼 함수 밖의 상태를 바꾸는 동작이다. pure function은 같은 입력에 항상 같은 출력을 내고 외부 상태를 바꾸지 않는다. side effect는 파일 저장, 로그, 네트워크 요청처럼 바깥에 영향을 남긴다. 따라서 정답은 ‘localStorage에 값을 저장한다’이다.
- project_context: 채점 계산은 pure function으로 두고, 진도 저장은 side effect로 분리하면 테스트가 쉬워진다.

## PY41_L09_separation_of_concerns_001
- level: 9
- file: python_architecture_layers_patterns_v41.json
- title: separation of concerns 읽기
- question_type: meaning_choice
- concepts: ["separation_of_concerns","responsibility","architecture"]
- reading_goal: 서로 다른 관심사를 분리해 코드를 읽기 쉽게 만드는 원칙을 이해한다.
- code:
```python
bad:
  fetch + select + render + save in one function

better:
  fetchCards()
  selectCards()
  renderCards()
  saveProgress()
```
- question: separation of concerns의 의미는?
- answer: 데이터 가져오기, 선택, 화면 표시, 저장 같은 관심사를 나눈다
- explanation: 데이터 가져오기, 선택 규칙, 화면 렌더링, 진행 저장은 서로 다른 변경 이유를 가지므로 분리할 수 있다. 함수 이름을 네 개로 나눈 것만으로 경계가 생기는 것은 아니다. 입력·출력을 명시하고 숨은 공유 상태와 순환 의존을 줄여야 각 부분을 독립적으로 테스트하고 교체할 수 있다.
- project_context: 카드 로딩, 복습 선택, 화면 렌더링, progress 저장을 분리하는 방향과 연결된다.

## PY26_L09_checkpoint_resume_001
- level: 9
- file: python_async_batch_queue_v26.json
- title: checkpoint/resume 읽기
- question_type: meaning_choice
- concepts: ["if","for","continue","checkpoint","resume","long_running_job"]
- reading_goal: 이미 끝난 작업을 기록해 재실행 시 건너뛰는 구조를 읽는다.
- code:
```python
done = load_done_ids("done.txt")

for item in items:
    if item.id in done:
        continue
    process(item)
    append_done_id("done.txt", item.id)
```
- question: item.id가 done에 있으면 어떻게 되는가?
- answer: 이미 처리된 것으로 보고 건너뛴다
- explanation: done에 있는 id는 `continue`로 건너뛴다. 대량의 id를 다룬다면 `done`을 set으로 만들어 membership 검사를 빠르게 하는 편이 좋다. 주의할 점은 `process(item)`의 외부 작업이 성공한 뒤 checkpoint 기록만 실패하는 경우다. 그러면 재실행 때 같은 item이 다시 처리될 수 있다. 따라서 외부 작업을 재실행해도 안전하게 만들거나, 결과 저장과 checkpoint 기록을 하나의 원자적 작업으로 묶는 방법을 고려한다. 여러 worker가 동시에 실행된다면 같은 id를 둘 이상이 가져가지 않도록 claim 방식도 필요하다.
- project_context: 노드패스 shard, PDF 추출, 대량 API 호출 재개에 직접 연결된다.

## PY26_L09_retry_queue_001
- level: 9
- file: python_async_batch_queue_v26.json
- title: retry queue 읽기
- question_type: meaning_choice
- concepts: ["for","try_except","retry_queue","failed_items","resilience"]
- reading_goal: 실패한 작업만 따로 모아 재시도하는 구조를 읽는다.
- code:
```python
failed = []
for item in items:
    try:
        process(item)
    except Exception:
        failed.append(item)

for item in failed:
    retry_process(item)
```
- question: failed 리스트에는 무엇이 들어가는가?
- answer: 처리 중 예외가 난 item
- explanation: 첫 loop에서 Exception이 난 원래 item object가 failed에 들어가고 두 번째 loop에서 한 번 더 처리된다. broad Exception은 영구 data error와 일시 network error를 구분하지 않으며 retry_process의 exception도 잡지 않는다. error type·attempt count·last error·next retry time을 기록하고 안전한 operation에만 backoff와 dead-letter 정책을 적용한다.
- project_context: 대량 다운로드/모델 호출/카드 생성에서 실패 샘플만 따로 복구할 때 유용하다.

## PY26_L09_semaphore_limit_001
- level: 9
- file: python_async_batch_queue_v26.json
- title: Semaphore 동시성 제한 읽기
- question_type: meaning_choice
- concepts: ["return","asyncio","semaphore","concurrency_limit"]
- reading_goal: 동시에 너무 많은 작업이 실행되지 않게 제한하는 코드를 읽는다.
- code:
```python
sem = asyncio.Semaphore(5)

async def guarded_fetch(url):
    async with sem:
        return await fetch(url)
```
- question: Semaphore(5)의 의미에 가장 가까운 것은?
- answer: 동시에 최대 5개 작업만 들어가게 제한한다
- explanation: 이 semaphore를 공유하며 async with 영역에 들어오는 cooperating coroutine은 동시에 최대 다섯 개다. block 밖의 작업은 제한되지 않고 여러 process에는 별도 semaphore가 있으므로 system 전체 rate limit은 아니다. 요청/초 단위 제한이 필요하면 time-based limiter도 함께 사용하고, 적절한 timeout과 cancellation을 처리한다.
- project_context: 외부 API 호출, 다운로드, 모델 추론 요청을 과하게 몰지 않게 할 때 필요하다.

## PY26_L09_worker_pool_001
- level: 9
- file: python_async_batch_queue_v26.json
- title: worker pool 구조 읽기
- question_type: meaning_choice
- concepts: ["if","for","while","def","function","return","try_except","import","range","worker_pool","queue","parallel"]
- reading_goal: 여러 worker가 queue에서 작업을 꺼내 처리하는 구조를 이해한다.
- code:
```python
from queue import Queue
from threading import Thread

q = Queue()
for item in items:
    q.put(item)
for _ in range(4):
    q.put(None)

def worker():
    while True:
        item = q.get()
        try:
            if item is None:
                return
            process(item)
        finally:
            q.task_done()

threads = [Thread(target=worker) for _ in range(4)]
for thread in threads:
    thread.start()
q.join()
for thread in threads:
    thread.join()
```
- question: Thread를 4개 시작하는 이유는?
- answer: 여러 worker가 작업을 나눠 처리하게 하려고
- explanation: 네 thread가 하나의 thread-safe Queue에서 서로 다른 item을 가져가므로 I/O-bound work를 나눌 수 있다. q.empty 확인 뒤 다른 thread가 item을 가져가는 race를 없애고 sentinel None으로 종료한다. finally의 task_done, q.join과 thread.join으로 실패 없이 가져간 모든 queue item과 thread 종료를 기다린다. process exception을 수집·전파하는 정책은 여전히 별도로 필요하다.
- project_context: 다운로드/변환/검증 작업을 병렬화할 때 자주 쓰는 구조다.

## PY36_L09_checkpoint_001
- level: 9
- file: python_async_queue_batch_jobs_v36.json
- title: checkpoint 읽기
- question_type: meaning_choice
- concepts: ["checkpoint","resume","long_running_job"]
- reading_goal: 긴 작업 중간 결과를 저장해 재시작 가능한 구조를 이해한다.
- code:
```python
after each shard:
    save_result(shard_id)
    write_checkpoint(last_done=shard_id)
```
- question: checkpoint를 저장하는 이유는?
- answer: 중간에 멈춰도 완료 지점부터 이어가기 위해
- explanation: checkpoint는 긴 작업에서 완료 사실을 내구성 있게 기록해 재시작 위치를 정한다. 결과 저장과 checkpoint 갱신 사이에 중단될 수 있으므로 둘을 transaction으로 묶거나, 다시 처리해도 같은 결과가 되는 idempotent 저장을 사용해야 한다. 단순히 last_done 하나만 쓰면 작업 순서가 바뀌거나 병렬 완료될 때 누락될 수도 있다.
- project_context: EC2나 ICT 서버에서 긴 노드패스/샤드 작업을 돌릴 때 핵심이다.

## PY36_L09_concurrency_parallelism_001
- level: 9
- file: python_async_queue_batch_jobs_v36.json
- title: concurrency와 parallelism 구분
- question_type: meaning_choice
- concepts: ["concurrency","parallelism","performance"]
- reading_goal: 동시에 진행되는 것처럼 다루는 concurrency와 실제 여러 계산을 동시에 하는 parallelism을 구분한다.
- code:
```python
concurrency:
  one worker switches between tasks

parallelism:
  multiple workers run tasks at the same time
```
- question: parallelism에 가까운 설명은?
- answer: 여러 worker가 실제로 동시에 작업한다
- explanation: concurrency는 여러 작업의 진행 구간이 겹치도록 관리하는 개념이고 parallelism은 같은 순간에 실제 실행되는 작업이 둘 이상인 상태다. 그림은 각각 한 event-loop worker의 전환과 여러 worker의 동시 실행을 단순화한 예다. concurrency도 여러 스레드를 쓸 수 있으므로 worker 수만으로 두 개념을 정의하지는 않는다.
- project_context: GPU 여러 대, 프로세스 여러 개, API 요청 여러 개의 차이를 이해할 때 필요하다.

## PY36_L09_semaphore_001
- level: 9
- file: python_async_queue_batch_jobs_v36.json
- title: semaphore 읽기
- question_type: meaning_choice
- concepts: ["semaphore","concurrency_limit","rate_limit"]
- reading_goal: 동시에 실행되는 작업 수를 제한하는 semaphore 개념을 이해한다.
- code:
```python
sem = Semaphore(3)

async with sem:
    await call_api(job)
```
- question: Semaphore(3)의 의미로 가장 가까운 것은?
- answer: 동시에 최대 3개까지만 실행하게 제한한다
- explanation: Semaphore(3)을 공유하는 task들이 async with sem 구간에 들어갈 수 있는 허가를 최대 3개까지 갖게 한다. 따라서 이 semaphore를 실제로 함께 사용하는 호출만 동시에 최대 3개로 제한된다. 다른 프로세스나 semaphore를 거치지 않는 호출까지 전역으로 제한하는 것은 아니다.
- project_context: 샤드 병렬 처리나 외부 API 호출 수를 조절할 때 중요하다.

## PY38_L09_oauth_001
- level: 9
- file: python_auth_security_tokens_permissions_v38.json
- title: OAuth 기초 읽기
- question_type: order_choice
- concepts: ["OAuth","Google_login","delegated_auth"]
- reading_goal: Google 같은 외부 계정으로 로그인하는 OAuth 흐름을 이해한다.
- code:
```python
User clicks "Login with Google"
Google authenticates the user and asks consent
App validates the OpenID Connect result
App creates its own session
```
- question: Google verifies user 다음 단계로 자연스러운 것은?
- answer: App receives auth result
- explanation: OAuth 2.0은 앱이 사용자의 비밀번호를 받지 않고 제한된 리소스 접근 권한을 위임받는 framework다. 'Google로 로그인'처럼 사용자 인증 정보를 받으려면 보통 OAuth 위의 OpenID Connect를 사용해 ID token의 signature, issuer, audience, nonce 등을 검증한다. 단순히 redirect에서 값을 받았다는 이유만으로 session을 만들면 안 된다.
- project_context: 학습앱을 Google 계정 기반으로 확장할 때 필요한 흐름이다.

## PY38_L09_password_hash_001
- level: 9
- file: python_auth_security_tokens_permissions_v38.json
- title: password hash 읽기
- question_type: meaning_choice
- concepts: ["comment","password_hash","hashing","security"]
- reading_goal: 비밀번호 원문을 저장하지 않고 해시를 저장하는 이유를 이해한다.
- code:
```python
password_hash = argon2.hash(plain_password)

# later, during login
argon2.verify(password_hash, submitted_password)
```
- question: DB에 password_hash를 저장하는 이유는?
- answer: 비밀번호 원문 노출 위험을 줄이기 위해
- explanation: 비밀번호는 원문이나 빠른 일반 hash 대신 Argon2id 같은 비밀번호용 KDF로 무작위 salt와 함께 저장한다. 로그인 때 새 hash 문자열이 같은지 비교하는 것이 아니라 검증 함수가 저장된 parameter·salt를 사용해 submitted_password를 확인한다. 검증 성공 뒤 필요하면 더 강한 parameter로 재해시한다.
- project_context: 직접 회원가입을 구현한다면 반드시 알아야 하는 기본 보안이다.

## PY38_L09_secret_env_001
- level: 9
- file: python_auth_security_tokens_permissions_v38.json
- title: secret / env 읽기
- question_type: meaning_choice
- concepts: ["import","secret","environment_variable","env"]
- reading_goal: 비밀값을 코드가 아니라 환경변수로 주입하는 방식을 이해한다.
- code:
```python
import os

api_key = os.environ["OPENAI_API_KEY"]
```
- question: 환경변수를 쓰는 이유로 가장 맞는 것은?
- answer: 비밀값을 코드 파일에 직접 쓰지 않기 위해
- explanation: 환경 변수는 환경마다 다른 비밀값을 소스 코드와 저장소에서 분리하는 한 방법이다. 하지만 환경 변수라고 자동으로 안전한 것은 아니며 프로세스, 오류 로그, 진단 화면, CI 설정을 통해 노출될 수 있다. 최소 권한과 회전 정책을 적용하고 운영 환경에서는 접근 통제된 비밀 저장소를 함께 검토한다.
- project_context: GitHub에 올라가는 코드에는 비밀키가 없어야 한다.

## PY22_L09_jwt_payload_claims_001
- level: 9
- file: python_auth_security_tokens_v22.json
- title: JWT payload claim 읽기
- question_type: meaning_choice
- concepts: ["jwt","claim","exp","sub","payload"]
- reading_goal: 토큰 payload 안의 sub, exp 같은 claim 의미를 이해한다.
- code:
```python
payload = {
    "sub": "user_123",
    "role": "admin",
    "exp": 1893456000
}
```
- question: sub claim은 보통 무엇을 나타내는가?
- answer: token이 가리키는 subject의 identifier
- explanation: sub는 subject를 뜻하며 issuer의 문맥에서 token이 가리키는 주체의 identifier다. 주체가 사용자일 수 있지만 service나 다른 entity일 수도 있으므로 항상 user id라고 단정하지 않는다. payload를 decode한 것만으로는 믿을 수 없고 signature와 exp, iss, aud 등 application이 요구하는 claims를 검증해야 한다.
- project_context: 사용자별 API key 저장/조회, 개인 학습 기록 분리와 연결된다.

## PY22_L09_password_hash_001
- level: 9
- file: python_auth_security_tokens_v22.json
- title: 비밀번호 해시 검증 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","password_hash","verify","security"]
- reading_goal: 비밀번호 원문을 저장하지 않고 해시 검증을 하는 구조를 이해한다.
- code:
```python
def login(email, password):
    user = repo.find_user_by_email(email)
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid login")
    return create_access_token(user.id)
```
- question: user.password_hash를 쓰는 이유에 가장 가까운 것은?
- answer: 비밀번호 원문 대신 해시를 저장/검증하기 위해
- explanation: repo 결과가 없을 때도 같은 generic 401을 반환하고 timing 차이를 줄여 account 존재 여부 노출을 막아야 한다. verify_password는 저장 hash에 포함된 salt와 cost를 이용하는 Argon2id, bcrypt, scrypt, PBKDF2 같은 password hashing scheme으로 검증해야 한다. 일반 fast hash나 직접 == 비교는 부적절하며 plaintext password를 저장하거나 log에 남기면 안 된다.
- project_context: 교육 서비스나 API 앱에서 자체 로그인 구현을 읽을 때 중요한 보안 개념이다.

## PY22_L09_permission_check_001
- level: 9
- file: python_auth_security_tokens_v22.json
- title: 권한 체크 코드 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","permission","role","authorization","403"]
- reading_goal: 인증은 되었지만 권한이 부족할 때 403을 반환하는 구조를 읽는다.
- code:
```python
def require_admin(user):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="forbidden")
```
- question: role이 admin이 아니면 어떤 상태 코드가 나오는가?
- answer: 403
- explanation: 인증된 user의 신뢰할 수 있는 role이 admin이 아니면 이 함수는 403 Forbidden을 발생시킨다. user가 단순 client 입력 dict라면 role을 위조할 수 있으므로 검증된 token claim이나 server-side 권한 저장소에서 가져와야 한다. 세밀한 시스템에서는 role 한 개보다 resource와 action을 함께 검사하고, user에 role key가 없을 때의 오류도 처리한다.
- project_context: 관리자용 데이터 수정 API와 일반 사용자 API를 구분하는 데 필요하다.

## PY22_L09_refresh_token_001
- level: 9
- file: python_auth_security_tokens_v22.json
- title: access token과 refresh token 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","access_token","refresh_token","session","auth"]
- reading_goal: 짧은 access token과 긴 refresh token을 구분한다.
- code:
```python
if access_token_expired:
    access_token = refresh_access_token(refresh_token)
```
- question: refresh token의 역할에 가장 가까운 것은?
- answer: 만료된 access token을 새로 발급받는 데 사용한다
- explanation: refresh token은 authorization server 정책이 허용하는 동안 새 access token을 요청하는 credential이다. access token보다 오래 사는 경우가 많아 탈취 피해도 크다. 안전한 저장, server-side revoke, rotation과 reuse detection, session 종료 시 폐기가 필요하며 client가 임의로 token을 새로 만드는 것은 아니다.
- project_context: 사용자 API 키를 계정 단위로 불러오는 앱 구조와 연결된다.

## PY3_L09_dataclass_list_001
- level: 9
- file: python_broad_expansion_v3.json
- title: dataclass 리스트 읽기
- question_type: output_prediction
- concepts: ["import","print","dataclass","list","class"]
- reading_goal: 여러 데이터 객체를 리스트에 담아 처리하는 코드를 읽는다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Node:
    id: str
    label: str

nodes = [Node("n001", "LiDAR"), Node("n002", "Radar")]
print(nodes[1].label)
```
- question: 출력은?
- answer: Radar
- explanation: 리스트 안에 dataclass 객체를 넣으면 순서대로 접근할 수 있다. nodes[1]은 두 번째 Node 객체이고 그 label 값은 Radar다. dataclass를 쓰면 관련 필드를 이름 있는 객체로 묶어 리스트 안에서도 의미를 잃지 않는다.
- project_context: 명확한 데이터 구조를 만들고 리스트로 처리하는 프로젝트 코드에서 자주 보인다.

## PY3_L09_fastapi_query_001
- level: 9
- file: python_broad_expansion_v3.json
- title: FastAPI query parameter 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","fastapi","query_parameter","endpoint"]
- reading_goal: URL 쿼리 파라미터가 함수 인자로 들어오는 구조를 읽는다.
- code:
```python
@app.get("/api/search")
def search(q: str, limit: int = 10):
    return {"query": q, "limit": limit}
```
- question: limit: int = 10의 의미는?
- answer: limit 기본값은 10이고 정수로 받는다
- explanation: app이 FastAPI 객체라는 전제에서 경로에 포함되지 않은 q와 limit은 쿼리 파라미터가 된다. URL의 값은 문자열로 오지만 FastAPI가 limit을 int로 변환하고 검증한다. limit을 생략하면 기본값 10을 쓰고, 정수로 바꿀 수 없는 값을 보내면 검증 오류 응답이 난다. q에는 기본값이 없으므로 필수다. 질문의 정답은 ‘limit 기본값은 10이고 정수로 받는다’이다.
- project_context: 검색 API와 RAG API 서버 구조를 읽을 때 중요하다.
