# V356 semantic review — Level 8 chunk 3

Cards 41-60 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY12_L08_torch_device_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: cuda/cpu device 선택
- question_type: meaning_choice
- concepts: ["import","print","torch","cuda","cpu","device"]
- reading_goal: GPU가 있으면 cuda, 없으면 cpu를 선택하는 코드를 읽는다.
- code:
```python
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)
```
- question: 이 코드의 목적은?
- answer: 가능하면 GPU를 쓰고 아니면 CPU를 쓰도록 device를 정한다
- explanation: 조건식은 CUDA 사용 가능 여부에 따라 문자열 device를 "cuda" 또는 "cpu"로 정한다. 이 줄은 사용할 대상만 선택하며 모델이나 tensor를 실제로 이동시키지는 않는다. 뒤에서 model.to(device), tensor.to(device)를 호출해 같은 장치에 놓아야 연산할 수 있다. "cuda"는 기본 CUDA 장치를 뜻하므로 여러 GPU 중 특정 장치를 쓰려면 cuda:1처럼 명시한다.
- project_context: PyTorch/Transformers 추론 코드를 읽는 기본이다.

## PY12_L08_torch_tensor_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: torch.tensor 기본 읽기
- question_type: meaning_choice
- concepts: ["import","print","torch","tensor","array"]
- reading_goal: 리스트를 PyTorch 텐서로 바꾸는 코드를 읽는다.
- code:
```python
import torch

x = torch.tensor([1, 2, 3])
print(x.shape)
```
- question: torch.tensor([1,2,3])는 무엇을 만드는가?
- answer: PyTorch tensor
- explanation: torch.tensor([1, 2, 3])은 세 정수를 가진 1차원 PyTorch tensor를 만들고 x에 대입한다. tensor에는 값 외에도 dtype, device, shape 정보가 있다. 이 예제의 질문 대상은 생성 결과이고, 실제 print(x.shape)는 원소가 3개인 한 축을 뜻하는 torch.Size([3])을 출력한다. tensor를 만들었다고 자동으로 GPU로 이동하거나 gradient를 추적하는 것은 아니다.
- project_context: 모델 입력/출력 코드를 읽기 위한 기초다.

## PY12_L08_uvicorn_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: uvicorn 실행 명령 읽기
- question_type: meaning_choice
- concepts: ["uvicorn","fastapi","server"]
- reading_goal: FastAPI 앱을 로컬 서버로 실행하는 명령을 읽는다.
- code:
```python
uvicorn search_api:app --reload --port 8000
```
- question: search_api:app의 의미에 가까운 것은?
- answer: search_api 모듈 안의 app 객체를 불러와 실행한다
- explanation: search_api:app에서 search_api는 현재 import 경로에서 찾을 모듈이고 app은 그 모듈 안의 ASGI 애플리케이션 객체다. 반드시 같은 폴더의 search_api.py만 뜻하는 것은 아니며 패키지 모듈일 수도 있다. --port 8000은 수신 포트를 정하고 --reload는 소스 변경 시 재시작하는 개발 편의 기능이므로 일반 운영 배포에서는 보통 사용하지 않는다.
- project_context: 로컬 RAG/search API 서버 실행과 직접 연결된다.

## PY60_L08_anonymous_id_001
- level: 8
- file: python_analytics_privacy_optin_v60.json
- title: anonymous id 읽기
- question_type: meaning_choice
- concepts: ["anonymous_id","privacy","analytics"]
- reading_goal: 개인 식별 정보 대신 익명 ID를 쓰는 방식을 이해한다.
- code:
```python
userId = createAnonymousId()
```
- question: anonymous id의 목적은?
- answer: 개인을 직접 식별하지 않고 사용 흐름을 묶어 보기 위해
- explanation: 이처럼 무작위 ID로 여러 이벤트를 연결하면 이름이나 이메일을 직접 쓰는 위험은 줄어든다. 그러나 반복 행동을 같은 ID로 묶을 수 있으므로 엄밀히는 익명이라기보다 가명 처리된 식별자에 가깝고, 다른 정보와 결합하면 다시 식별될 가능성도 있다. 동의, 접근 제한, 회전 주기와 보존 기간을 함께 적용해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L08_event_schema_001
- level: 8
- file: python_analytics_privacy_optin_v60.json
- title: event schema 읽기
- question_type: meaning_choice
- concepts: ["event_schema","analytics","data_model"]
- reading_goal: 분석 이벤트의 이름과 필드를 일정하게 정의하는 event schema를 이해한다.
- code:
```python
event = {
  name: 'card_answered',
  properties: { cardId, level, isCorrect }
}
```
- question: event schema의 역할은?
- answer: 이벤트 이름과 속성 구조를 일관되게 관리한다
- explanation: event schema는 이벤트 이름, 시각, 카드 id, action 같은 분석 필드 구조다. 스키마가 없으면 같은 행동도 여러 이름으로 기록되어 분석이 어려워진다. 따라서 정답은 ‘이벤트 이름과 속성 구조를 일관되게 관리한다’이다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L08_minimal_event_data_001
- level: 8
- file: python_analytics_privacy_optin_v60.json
- title: minimal event data 읽기
- question_type: meaning_choice
- concepts: ["minimal_data","event_tracking","privacy"]
- reading_goal: 이벤트에는 필요한 최소 정보만 담아야 한다는 원칙을 이해한다.
- code:
```python
trackEvent('card_answered', { cardId, isCorrect })
```
- question: minimal event data 원칙은?
- answer: 개선에 필요한 최소한의 정보만 수집하는 것
- explanation: minimal event data는 정해 둔 개선 목적에 필요한 속성만 수집하는 원칙이다. 예시는 카드 ID와 정답 여부만 보내지만, 카드 ID 자체가 민감한 학습 주제를 드러내는지도 검토해야 한다. 검색어와 메모 원문, 계정 식별자처럼 목적에 불필요한 값은 보내지 않고 보존 기간도 짧게 정한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L08_no_personal_note_tracking_001
- level: 8
- file: python_analytics_privacy_optin_v60.json
- title: no personal note tracking 읽기
- question_type: meaning_choice
- concepts: ["personal_note","privacy","analytics_guard"]
- reading_goal: 사용자 메모 같은 개인 내용을 분석 이벤트에 넣지 않는 원칙을 이해한다.
- code:
```python
trackEvent('note_saved', { length: note.length })
// note text itself is not sent
```
- question: 개인 메모를 그대로 추적하면 안 되는 이유는?
- answer: 사용자의 사적인 학습 기록이 포함될 수 있기 때문에
- explanation: 개인 메모 원문에는 건강, 업무, 계정 정보 같은 사적인 내용이 섞일 수 있으므로 분석 이벤트에 보내지 않는다. 글자 수는 원문보다 위험이 낮지만 완전히 무해한 값은 아니며 목적이 없으면 수집하지 않는 편이 낫다. 분석 목적과 보존 기간을 먼저 정한 뒤 꼭 필요한 파생값만 사용한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY41_L08_adapter_001
- level: 8
- file: python_architecture_layers_patterns_v41.json
- title: adapter 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","adapter","wrapper","external_service"]
- reading_goal: 외부 도구나 API를 내부 코드에 맞게 감싸는 adapter 개념을 읽는다.
- code:
```python
class QwenAdapter:
    def generate(self, prompt):
        return call_qwen_api(prompt)
```
- question: adapter의 역할은?
- answer: 외부 API나 도구의 복잡한 사용법을 내부에서 쓰기 좋은 모양으로 감싼다
- explanation: adapter는 외부 Qwen 호출 방식을 앱이 기대하는 generate(prompt) interface로 변환한다. 효과적인 adapter라면 입력·출력 형식뿐 아니라 timeout, 외부 예외, rate limit 같은 공급자 차이도 내부의 일관된 결과나 오류로 바꾼다. 외부 서비스 교체가 쉬워지는 정도는 호출이 이 경계를 실제로 지키는지에 달려 있다.
- project_context: Qwen, GPT, 검색 라우터, 임베딩 모델을 붙일 때 adapter 계층이 있으면 교체가 쉽다.

## PY41_L08_dto_001
- level: 8
- file: python_architecture_layers_patterns_v41.json
- title: DTO 읽기
- question_type: meaning_choice
- concepts: ["DTO","data_transfer_object","api_response"]
- reading_goal: DTO가 내부 객체와 외부 응답 사이의 전달용 구조라는 점을 이해한다.
- code:
```python
internal Card object
  -> CardResponseDTO
  -> JSON response
```
- question: DTO를 쓰는 이유에 가장 가까운 것은?
- answer: 외부로 보내는 데이터 모양을 안정적으로 정하기 위해
- explanation: DTO는 계층이나 프로세스 경계를 넘어 전달할 데이터 모양을 명시한다. CardResponseDTO가 필요한 필드만 선택하고 validation·serialization 규칙을 가지면 내부 Card 변경이 곧바로 API 노출 변경이 되는 것을 줄일 수 있다. 외부 형식의 안정성은 DTO 이름만이 아니라 versioning과 호환성 정책으로 유지한다.
- project_context: 학습앱 API가 나중에 생기면 Card 내부 데이터와 화면 응답 DTO를 분리하는 것이 안전하다.

## PY41_L08_interface_001
- level: 8
- file: python_architecture_layers_patterns_v41.json
- title: interface 읽기
- question_type: meaning_choice
- concepts: ["interface","contract","implementation"]
- reading_goal: interface가 실제 구현보다 먼저 정하는 약속이라는 점을 이해한다.
- code:
```python
SearchEngine interface:
  search(query) -> results

VectorSearch implements SearchEngine
KeywordSearch implements SearchEngine
```
- question: interface의 핵심은?
- answer: 구현체가 달라도 같은 방식으로 호출할 수 있는 약속을 만든다
- explanation: interface는 search(query)가 받는 입력, 돌려주는 결과, 오류와 의미를 구현체들이 지켜야 한다는 계약이다. 같은 메서드 이름만 갖는 것으로 충분하지 않고 KeywordSearch와 VectorSearch가 호출자가 기대하는 결과 구조와 동작을 만족해야 교체할 수 있다.
- project_context: 키워드 검색, 벡터 검색, GraphRAG 검색을 같은 search(query) 형태로 묶을 수 있다.

## PY26_L08_asyncio_gather_001
- level: 8
- file: python_async_batch_queue_v26.json
- title: asyncio.gather 병렬 요청 읽기
- question_type: meaning_choice
- concepts: ["return","import","asyncio","gather","concurrency"]
- reading_goal: 여러 비동기 작업을 동시에 실행하고 결과를 모으는 구조를 읽는다.
- code:
```python
import asyncio

async def main(ids):
    tasks = [fetch_item(x) for x in ids]
    results = await asyncio.gather(*tasks)
    return results
```
- question: asyncio.gather(*tasks)의 역할은?
- answer: 여러 비동기 작업을 함께 실행하고 결과를 모은다
- explanation: gather는 coroutine들을 schedule하고 모두 성공하면 입력 순서와 같은 순서의 result list를 반환한다. 기본 설정에서 하나가 exception을 내면 await하는 caller에 그 exception이 전달되지만 다른 awaitable이 모두 자동 취소되는 것으로 가정하면 안 된다. 부분 실패 정책이 필요하면 TaskGroup, return_exceptions 또는 개별 error handling을 선택한다.
- project_context: 여러 URL/API/문서를 동시에 처리할 때 쓰는 기본 비동기 패턴이다.

## PY26_L08_batch_loop_001
- level: 8
- file: python_async_batch_queue_v26.json
- title: batch loop 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","range","batch","loop","chunking"]
- reading_goal: 큰 목록을 일정 크기의 배치로 나누어 처리하는 코드를 읽는다.
- code:
```python
def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]

for batch in chunks(rows, 100):
    process_batch(batch)
```
- question: rows가 250개이고 size가 100이면 배치는 몇 번 나오는가?
- answer: 3
- explanation: range는 0, 100, 200에서 시작하므로 slice가 100, 100, 50개인 세 batch를 만든다. size가 0이면 range가 ValueError를 내고 음수이면 이 입력에서는 batch가 나오지 않으므로 positive integer를 먼저 검증해야 한다. batch는 memory peak를 줄일 수 있지만 process_batch의 failure와 resume 경계도 설계해야 한다.
- project_context: 대량 카드/청크/노드 후보를 한 번에 다 처리하지 않고 나누는 방식이다.

## PY26_L08_shard_range_001
- level: 8
- file: python_async_batch_queue_v26.json
- title: shard range 처리 읽기
- question_type: meaning_choice
- concepts: ["for","shard","range","batch_job"]
- reading_goal: 큰 작업을 shard 번호 범위로 나누어 실행하는 구조를 이해한다.
- code:
```python
start_shard = 31
end_shard = 100

for shard_id in range(start_shard, end_shard + 1):
    run_shard(shard_id)
```
- question: 이 루프가 처리하는 마지막 shard_id는?
- answer: 100
- explanation: shard range는 큰 작업을 번호 구간으로 나눠 처리하는 방식이다. range(start, end + 1)을 쓰면 마지막 번호까지 포함할 수 있다. 구간을 명확히 기록하면 여러 PC나 실행에서 작업 범위가 겹치지 않게 나눌 수 있다. 따라서 정답은 ‘100’이다.
- project_context: 노드패스/샤드 처리 상태를 읽을 때 직접 연결되는 패턴이다.

## PY36_L08_batch_001
- level: 8
- file: python_async_queue_batch_jobs_v36.json
- title: batch 처리 읽기
- question_type: meaning_choice
- concepts: ["for","batch","bulk_processing","shard"]
- reading_goal: 많은 작업을 묶어서 처리하는 batch 개념을 이해한다.
- code:
```python
batch = cards[0:100]

for card in batch:
    validate(card)
```
- question: batch = cards[0:100]의 의미는?
- answer: 카드 중 앞의 100개를 한 묶음으로 잡는다
- explanation: cards[0:100]은 전체 cards 중 인덱스 0부터 99까지, 최대 첫 100개만 새 리스트로 선택한다. 이 한 조각을 batch로 처리하는 예시이며 전체 데이터를 모두 batch로 순회하려면 시작 인덱스를 100씩 늘리는 바깥 반복이 추가로 필요하다.
- project_context: 노드패스 shard, 카드 검증, 대량 API 호출에서 자주 쓰는 사고방식이다.

## PY36_L08_queue_basic_001
- level: 8
- file: python_async_queue_batch_jobs_v36.json
- title: queue 기초 읽기
- question_type: meaning_choice
- concepts: ["queue","job","FIFO"]
- reading_goal: 처리할 일을 줄 세워 worker가 하나씩 가져가는 queue 구조를 이해한다.
- code:
```python
queue:
  shard_001
  shard_002
  shard_003

worker takes shard_001
```
- question: queue의 역할로 가장 가까운 것은?
- answer: 처리할 작업을 순서대로 보관한다
- explanation: queue는 생산자가 넣은 미처리 작업을 worker가 꺼낼 때까지 보관한다. 이 그림은 먼저 들어온 shard를 먼저 꺼내는 FIFO 큐를 나타낸다. 모든 큐가 반드시 FIFO인 것은 아니며 priority queue처럼 선택 규칙이 다른 구현도 있다.
- project_context: KG/LoRA shard 처리, 카드 생성 batch, API 호출 대기열에 모두 적용된다.

## PY36_L08_worker_001
- level: 8
- file: python_async_queue_batch_jobs_v36.json
- title: worker 읽기
- question_type: meaning_choice
- concepts: ["else","while","try_except","worker","queue","job_processing"]
- reading_goal: queue에서 작업을 꺼내 실제 처리하는 worker의 역할을 이해한다.
- code:
```python
while queue_has_items():
    job = queue.get()
    try:
        process(job)
    except Exception as error:
        mark_failed(job, error)
    else:
        mark_done(job)
```
- question: worker가 하는 일은?
- answer: queue에서 job을 꺼내 처리하고 완료 표시한다
- explanation: worker는 큐에서 작업을 가져와 실제 처리를 수행하는 실행 주체다. 성공한 작업만 done으로 표시하고 실패는 별도 상태와 재시도 정책으로 넘겨야 한다. 여러 worker가 같은 작업을 가져가지 않도록 queue의 claim·acknowledgement 방식도 필요하다.
- project_context: 샤드 여러 개를 서버에서 돌릴 때 worker 개념으로 이해하면 쉽다.

## PY38_L08_api_key_001
- level: 8
- file: python_auth_security_tokens_permissions_v38.json
- title: API key 읽기
- question_type: meaning_choice
- concepts: ["API_key","secret","service_auth"]
- reading_goal: 외부 서비스나 서버 API를 호출할 때 쓰는 API key 개념을 이해한다.
- code:
```python
headers = {
  "X-API-Key": "sk_live_..."
}
```
- question: API key를 코드에 그대로 공개하면 위험한 이유는?
- answer: 다른 사람이 내 권한으로 API를 호출할 수 있기 때문
- explanation: API key는 외부 서비스나 서버 기능을 사용할 수 있게 해 주는 비밀값이다. 공개 저장소나 프론트엔드 코드에 넣으면 유출 위험이 크다. 키가 노출되면 다른 사람이 비용을 발생시키거나 권한 있는 API를 호출할 수 있으므로 서버 쪽에서 보호해야 한다.
- project_context: OpenAI/Bedrock/Supabase 키 같은 값은 서버 측이나 env로 관리해야 한다.

## PY38_L08_jwt_001
- level: 8
- file: python_auth_security_tokens_permissions_v38.json
- title: JWT 읽기
- question_type: meaning_choice
- concepts: ["JWT","token","claims"]
- reading_goal: JWT payload의 sub·role·exp가 각각 무엇을 나타내며, payload가 암호화된 비밀 공간은 아니라는 점을 이해한다.
- code:
```python
JWT payload:
{
  "sub": "u1",
  "role": "student",
  "exp": 1893456000
}
```
- question: sub 필드는 보통 무엇을 나타내는가?
- answer: 사용자 식별자
- explanation: sub(subject)는 토큰이 가리키는 주체의 식별자이며 이 예시에서는 사용자 u1이다. exp는 Unix 시간 기준 만료 시각이다. 서명된 JWT의 payload는 기본적으로 암호화되지 않으므로 비밀값을 넣지 말고, 서버는 서명뿐 아니라 허용 algorithm, issuer, audience, exp 같은 claim도 검증해야 한다.
- project_context: 서버가 user_id를 토큰에서 읽어 사용자별 progress를 저장할 수 있다.

## PY38_L08_refresh_token_001
- level: 8
- file: python_auth_security_tokens_permissions_v38.json
- title: refresh token 읽기
- question_type: meaning_choice
- concepts: ["refresh_token","token_refresh","session"]
- reading_goal: 짧게 만료되는 access token을 새로 받기 위한 refresh token을 이해한다.
- code:
```python
access_token expires in 15 minutes
refresh_token expires in 30 days

POST /auth/refresh
```
- question: refresh token의 역할로 맞는 것은?
- answer: 새 access token을 발급받는 데 사용한다
- explanation: refresh token은 access token이 만료될 때 인증 서버에서 새 access token을 받는 데 사용한다. 수명이 긴 만큼 access token보다 더 엄격하게 보호하고, 브라우저 앱에서는 보통 JavaScript가 읽지 못하는 보안 cookie 같은 저장 방식을 검토한다. 회전·재사용 탐지·서버 측 폐기 정책도 필요하다.
- project_context: 사용자가 매번 로그인하지 않게 만들 때 필요한 개념이다.

## PY22_L08_bearer_header_001
- level: 8
- file: python_auth_security_tokens_v22.json
- title: Bearer token header 읽기
- question_type: meaning_choice
- concepts: ["bearer_token","authorization_header","api_auth"]
- reading_goal: API 요청에서 Authorization 헤더로 토큰을 보내는 구조를 읽는다.
- code:
```python
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
}
```
- question: Authorization: Bearer ... 헤더의 목적은?
- answer: 요청자가 가진 접근 토큰을 서버에 전달한다
- explanation: Authorization: Bearer는 token을 소지한 client가 server에 그대로 제시하는 형식이다. Bearer는 이름처럼 소지자에게 권한이 생길 수 있으므로 HTTPS로 전송하고 URL·log·오류 메시지에 남기지 않아야 한다. server는 signature, issuer, audience, expiry와 필요한 scope를 검증해야 하며 header를 보내는 것만으로 인증이 완료되지는 않는다.
- project_context: 프론트에서 FastAPI나 외부 API를 호출할 때 자주 등장한다.
