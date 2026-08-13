# V356 semantic review — Level 10 chunk 1

Cards 1-20 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L10_risk_001
- level: 10
- file: cards_seed_v1.json
- title: 불안정한 코드 위험 찾기
- question_type: risk_finding
- concepts: ["for","print","encoding","missing_key","import","error_handling"]
- reading_goal: import와 encoding이 갖춰진 뒤에도 입력 데이터의 key 누락 때문에 실패할 수 있는 지점을 찾는다.
- code:
```python
import json

with open("chunks.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        row = json.loads(line)
        print(row["doc_id"])
```
- question: 이 코드에서 여전히 남아 있는 데이터 의존 위험을 고르시오.
- answer: doc_id가 없는 줄이면 에러가 난다
- explanation: 이 코드에는 json import와 UTF-8 encoding이 이미 들어 있다. 하지만 row["doc_id"]는 모든 줄에 doc_id key가 있다고 가정하므로, 해당 key가 없는 줄을 만나면 KeyError가 난다. 따라서 정답은 ‘doc_id가 없는 줄이면 에러가 난다’이다. doc_id가 선택 필드라면 row.get("doc_id")를 쓰고, 필수 필드라면 읽은 직후 명확한 검증 오류를 내는 방식이 알맞다.
- project_context: PM이 개발자에게 확인해야 할 위험 지점을 찾는 훈련이다.

## PY52_L10_a11y_as_product_quality_001
- level: 10
- file: python_accessibility_a11y_ui_v52.json
- title: a11y as product quality 읽기
- question_type: meaning_choice
- concepts: ["a11y","product_quality","inclusive_design"]
- reading_goal: 접근성을 부가 기능이 아니라 제품 품질로 보는 관점을 이해한다.
- code:
```python
good UX = usable by more people
accessibility = product quality
```
- question: 접근성을 제품 품질로 봐야 하는 이유는?
- answer: 더 많은 사용자가 안정적으로 학습할 수 있게 하기 위해
- explanation: 학습앱은 초보자, 모바일 사용자, 키보드 사용자, 보조기기 사용자 모두를 고려해야 한다. 접근성은 별도 부가 기능이 아니라 제품 품질의 일부다. 키보드 조작, 명확한 오류 안내, 읽기 쉬운 구조가 모든 사용자에게 도움이 된다. 따라서 정답은 ‘더 많은 사용자가 안정적으로 학습할 수 있게 하기 위해’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L10_accessibility_checklist_001
- level: 10
- file: python_accessibility_a11y_ui_v52.json
- title: accessibility checklist 읽기
- question_type: meaning_choice
- concepts: ["accessibility_checklist","quality_gate","UI_review"]
- reading_goal: UI 변경 후 접근성 체크리스트로 최소 품질을 확인하는 습관을 이해한다.
- code:
```python
checklist = ['keyboard', 'focus', 'label', 'contrast', 'screen reader text']
```
- question: 접근성 체크리스트에 들어갈 항목은?
- answer: 키보드 조작, 포커스 표시, label, 대비, 화면낭독기 텍스트
- explanation: checklist와 automated scanner는 label 누락·일부 contrast 같은 반복 문제를 줄인다. 자동 검사는 keyboard flow, screen reader 의미, zoom, cognitive clarity를 모두 판정하지 못하므로 실제 keyboard, browser zoom, screen reader와 사용자 test를 함께 한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L10_accessible_card_component_001
- level: 10
- file: python_accessibility_a11y_ui_v52.json
- title: accessible card component 읽기
- question_type: meaning_choice
- concepts: ["card_component","semantic_structure","accessibility"]
- reading_goal: 학습 카드 컴포넌트가 제목, 본문, 선택지, 결과를 의미 있게 가져야 함을 이해한다.
- code:
```python
<article aria-labelledby="card-title">
  <h2 id="card-title">카드 제목</h2>
</article>
```
- question: accessible card component에서 중요한 것은?
- answer: 카드의 제목과 본문 구조를 보조기기도 이해할 수 있게 만드는 것
- explanation: accessible card component는 키보드, 보조기기, 명확한 상태 표시를 함께 고려한 카드 UI다. 카드가 많아질수록 구조가 명확해야 유지보수도 쉬워진다. 따라서 정답은 ‘카드의 제목과 본문 구조를 보조기기도 이해할 수 있게 만드는 것’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY5_L10_agent_router_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: agent router 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","agent","router","tool_calling"]
- reading_goal: 작업 타입에 따라 다른 도구로 보내는 에이전트 라우팅을 읽는다.
- code:
```python
def route_task(task):
    if task["type"] == "search":
        return search_tool(task["query"])
    if task["type"] == "write_file":
        return write_file(task["path"], task["content"])
    return chat(task["message"])
```
- question: type이 search이면 무엇을 호출하는가?
- answer: search_tool
- explanation: route_task는 task['type']을 위에서부터 검사한다. 값이 'search'이면 첫 번째 if가 True가 되어 search_tool(task['query'])를 호출하고, 그 도구가 돌려준 값을 route_task가 그대로 반환하면서 함수가 끝난다. 따라서 질문처럼 search 타입에서 호출되는 함수는 search_tool이다.
- project_context: 코드 에이전트와 자동화 워크플로우를 이해하는 핵심 패턴이다.

## PY5_L10_asyncio_run_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: asyncio.run 흐름 읽기
- question_type: output_prediction
- concepts: ["return","import","print","async","await","asyncio"]
- reading_goal: 비동기 main 함수를 실행하고 await 결과를 받는 흐름을 읽는다.
- code:
```python
import asyncio

async def fetch():
    return "data"

async def main():
    result = await fetch()
    print(result)

asyncio.run(main())
```
- question: 출력은?
- answer: data
- explanation: main()은 main 코루틴 객체를 만들고 asyncio.run(...)이 이를 실행할 이벤트 루프를 시작한다. main 안의 await fetch()가 fetch를 실행해 "data"를 돌려주면 result에 저장되고 print가 data를 출력한다. asyncio.run은 보통 비동기 프로그램의 최상위 진입점에서 한 번 사용하며, async 함수 이름만 넘기는 것이 아니라 main()처럼 만든 코루틴을 넘긴다는 점을 구분해야 한다.
- project_context: 비동기 API 서버, 크롤러, 에이전트 도구 호출 코드에서 보인다.

## PY5_L10_chunk_loop_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: chunk 생성 루프 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","range","chunk","loop","text_processing"]
- reading_goal: 긴 텍스트를 일정 크기 조각으로 나누는 흐름을 읽는다.
- code:
```python
def make_chunks(text, size):
    chunks = []
    for i in range(0, len(text), size):
        chunks.append(text[i:i+size])
    return chunks
```
- question: range(0, len(text), size)의 역할은?
- answer: size 간격으로 위치를 이동한다
- explanation: range(0, len(text), size)는 i를 0, size, 2*size처럼 size만큼 이동시킨다. 매번 text[i:i+size]가 최대 size개의 문자를 잘라 chunks에 넣으므로 마지막 조각만 더 짧을 수 있고, 이 코드에는 겹침이 없다. size는 양수여야 한다. 또한 문자 수 기준으로 자르므로 실제 RAG에서 token 한도나 단어 경계를 맞추려면 별도 로직이 필요하다.
- project_context: RAG 청킹과 긴 문서 처리의 기본 흐름이다.

## PY5_L10_claim_check_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: claim 문자열 포함 검사 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","claim","evidence","validation"]
- reading_goal: claim 문자열이 evidence text에 그대로 포함됐는지 확인하는 단순 규칙을 읽는다.
- code:
```python
def check_claim(answer, evidence):
    if answer["claim"] not in evidence["text"]:
        return "needs_review"
    return "supported"
```
- question: claim이 evidence text에 없으면?
- answer: needs_review
- explanation: not in은 answer["claim"] 문자열이 evidence["text"] 안에 글자 그대로 포함됐는지만 검사한다. 없으면 needs_review, 있으면 supported를 반환한다. 하지만 같은 뜻의 바꿔 쓴 문장은 놓칠 수 있고, 문자열이 우연히 포함돼도 문맥상 근거가 아닐 수 있으므로 supported는 실제 의미 검증 완료를 뜻하지 않는다. 이는 사람이나 더 강한 검증으로 보낼 후보를 가르는 단순 휴리스틱이다.
- project_context: RAG 답변을 본격 검증하기 전에 적용할 수 있는 기초 문자열 휴리스틱에 가깝다.

## PY5_L10_curation_skip_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: 큐레이션 skip 조건 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","curation","filter","score","dedup"]
- reading_goal: 중복 URL과 낮은 점수를 기준으로 후보를 제외하는 흐름을 읽는다.
- code:
```python
def should_skip(item, seen_urls):
    if item["url"] in seen_urls:
        return True
    if item.get("score", 0) < 0.5:
        return True
    return False
```
- question: skip되는 조건은?
- answer: 이미 본 URL이거나 score가 0.5 미만
- explanation: 첫 번째 if는 item의 URL이 seen_urls에 있으면 즉시 True를 반환한다. 중복이 아니어도 score가 0.5보다 작으면 두 번째 if가 True를 반환하므로, 두 조건은 논리적으로 OR처럼 작동한다. score가 정확히 0.5면 제외되지 않는다. score key가 없으면 get의 기본값 0 때문에 제외되며, url key가 없으면 대괄호 접근에서 KeyError가 난다는 입력 전제도 확인해야 한다.
- project_context: 수집 자료 선별과 읽을거리 큐 생성 흐름에 직접 연결된다.

## PY5_L10_evidence_attach_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: evidence id 부착 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","evidence","rag","list_comprehension"]
- reading_goal: 답변에 사용한 문서 id 목록을 함께 붙이는 구조를 읽는다.
- code:
```python
def attach_evidence(answer, docs):
    return {
        "answer": answer,
        "evidence_ids": [doc["id"] for doc in docs]
    }
```
- question: evidence_ids에는 무엇이 들어가는가?
- answer: docs의 id 목록
- explanation: 리스트 컴프리헨션이 docs를 순서대로 돌며 각 doc["id"]를 꺼내 evidence_ids 목록을 만든다. 반환값은 원래 answer와 그 ID 목록을 함께 담은 dict다. 이 연결은 나중에 출처를 다시 찾게 해 주지만, ID를 붙였다는 사실만으로 해당 문서가 답변을 실제로 뒷받침한다고 검증되지는 않는다. doc에 id가 없으면 KeyError가 난다는 전제도 확인해야 한다.
- project_context: 근거 기반 RAG와 검증 가능한 답변 구조에 중요하다.

## PY5_L10_failure_summary_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: 실패 원인 집계 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","failure","dict","aggregation"]
- reading_goal: 실패 row들의 reason을 세어 요약하는 코드를 읽는다.
- code:
```python
def summarize_failures(rows):
    by_reason = {}
    for row in rows:
        reason = row.get("reason", "unknown")
        by_reason[reason] = by_reason.get(reason, 0) + 1
    return by_reason
```
- question: by_reason의 역할은?
- answer: 실패 원인별 개수 집계
- explanation: 각 row에서 reason을 읽고, key가 없으면 "unknown"을 사용한다. by_reason.get(reason, 0)은 아직 없는 원인이면 0에서 시작하고, 같은 원인이 다시 나오면 기존 개수에 1을 더한다. 반환되는 dict는 {실패 원인: 발생 횟수} 형태다. 이 집계는 빈도가 높은 문제를 찾는 데 도움을 주지만, 빈도만으로 수정 우선순위가 확정되는 것은 아니므로 영향도도 함께 봐야 한다.
- project_context: dataset 실패 분석, 회귀 테스트, 품질 개선 루프에 직접 연결된다.

## PY5_L10_httpx_async_001
- level: 10
- file: python_advanced_expansion_v5.json
- title: httpx 비동기 API 호출 읽기
- question_type: meaning_choice
- concepts: ["return","import","httpx","async","api","client"]
- reading_goal: async with와 await로 비동기 HTTP 요청을 보내는 구조를 읽는다.
- code:
```python
import httpx

async def get_items():
    async with httpx.AsyncClient() as client:
        res = await client.get("https://example.com/api/items")
        return res.status_code
```
- question: await client.get(...)은 무엇을 기다리는가?
- answer: HTTP 응답
- explanation: async with는 AsyncClient를 열고 블록이 끝날 때 연결 자원을 정리한다. await client.get(...)에서 현재 get_items 코루틴은 HTTP 요청과 응답을 기다리며 잠시 멈추지만, 이벤트 루프는 그동안 이미 예약된 다른 코루틴을 실행할 수 있다. 다만 이 함수 하나만 호출한다고 여러 요청이 자동으로 동시에 실행되는 것은 아니다. 여러 요청을 겹쳐 처리하려면 여러 코루틴을 task나 gather 등으로 함께 예약해야 한다.
- project_context: 대량 API 호출이나 FastAPI 내부 비동기 코드에서 자주 나온다.

## PY14_L10_model_strategy_map_001
- level: 10
- file: python_ai_learning_methods_v14.json
- title: 상황별 AI 학습/적용 전략 지도
- question_type: meaning_choice
- concepts: ["rag","lora","quantization","distillation","strategy"]
- reading_goal: 문제 상황별로 RAG/LoRA/양자화/증류를 비교해 선택한다.
- code:
```python
Need latest knowledge -> RAG
Need response style/task habit -> LoRA or fine-tuning
Need smaller memory -> quantization
Need smaller faster model -> distillation
Need on-device inference -> quantization + NPU/runtime support
```
- question: 최신 문서 기반 답변이 핵심이면 우선순위가 높은 전략은?
- answer: RAG
- explanation: 새 지식을 자주 바꿔야 하면 검색 인덱스/문서 저장소를 업데이트하는 편이 실용적이다. 모델 전략 지도는 RAG, fine-tuning, prompt 개선, 도구 호출 중 어떤 방법을 쓸지 고르는 기준표다. 문제 원인이 지식 부족인지 형식 문제인지 먼저 나누어야 한다.
- project_context: 네 KG/RAG/LoRA 서비스 구조 설계 판단과 직접 연결된다.

## PY12_L10_peft_lora_load_001
- level: 10
- file: python_ai_toolchain_expansion_v12.json
- title: PEFT LoRA adapter 로드 읽기
- question_type: meaning_choice
- concepts: ["import","peft","lora","adapter","llm"]
- reading_goal: base model에 LoRA adapter를 붙이는 코드를 읽는다.
- code:
```python
from peft import PeftModel

model = PeftModel.from_pretrained(base_model, adapter_path)
```
- question: 이 코드의 목적은?
- answer: base_model에 LoRA adapter를 로드한다
- explanation: PeftModel.from_pretrained는 이미 메모리에 불러온 base_model을 adapter_path의 PEFT 설정·가중치로 감싸 LoRA adapter가 적용된 모델을 반환한다. adapter는 base model 전체를 대신하지 않으며, 학습에 사용한 base 모델 구조·이름·tokenizer와 호환돼야 한다. 이 호출만으로 adapter가 base 가중치에 영구 병합되는 것은 아니며 병합·저장은 별도 동작이다.
- project_context: 네 LoRA 추론/학습 코드 독해에 직접 필요하다.

## PY60_L10_analytics_privacy_flow_001
- level: 10
- file: python_analytics_privacy_optin_v60.json
- title: analytics privacy flow 읽기
- question_type: meaning_choice
- concepts: ["analytics_privacy_flow","privacy_opt_in","event_tracking"]
- reading_goal: 분석 동의, 최소 수집, 이벤트 기록, 집계, 설정 변경까지 이어지는 전체 흐름을 이해한다.
- code:
```python
explainAndAskConsent()
trackMinimalEventsIfAllowed()
aggregateWithSafeguards()
honorWithdrawalAndDeletion()
```
- question: analytics privacy flow의 자연스러운 순서는?
- answer: 목적 설명과 동의 확인 → 허용된 최소 이벤트만 수집 → 보호 조건을 둔 집계 → 철회와 삭제 요청 반영
- explanation: 먼저 수집 목적과 범위를 설명하고 사용자의 선택을 확인한다. 허용된 경우에만 최소 이벤트를 만들고, 작은 집단 노출을 막는 조건을 둬 집계한다. 철회 기능은 마지막에 한 번 제공하는 단계가 아니라 언제든 사용할 수 있어야 하며, 철회와 삭제 요청이 대기 이벤트와 저장 데이터에 어떻게 반영되는지도 정해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L10_analytics_quality_gate_001
- level: 10
- file: python_analytics_privacy_optin_v60.json
- title: analytics quality gate 읽기
- question_type: meaning_choice
- concepts: ["quality_gate","analytics","test_case"]
- reading_goal: 분석 기능이 동의 상태를 지키는지 테스트하는 품질 기준을 이해한다.
- code:
```python
assert noEventWhenOptedOut()
assert eventWhenOptedIn()
```
- question: analytics quality gate의 목적은?
- answer: 동의하지 않은 상태에서 이벤트가 수집되지 않는지 검증하기 위해
- explanation: analytics quality gate는 동의 전이나 철회 후에 이벤트가 생성·대기·전송되지 않는지 검증한다. opt-in 상태의 정상 전송만 확인해서는 부족하다. 철회 직전 큐에 있던 이벤트, 네트워크 재연결, 저장된 식별자와 보존 기간까지 테스트해야 제품이 약속한 통제권을 실제로 지킬 수 있다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L10_privacy_policy_notice_001
- level: 10
- file: python_analytics_privacy_optin_v60.json
- title: privacy policy notice 읽기
- question_type: meaning_choice
- concepts: ["privacy_notice","consent","documentation"]
- reading_goal: 사용자에게 어떤 데이터를 왜 수집하는지 안내하는 privacy notice를 이해한다.
- code:
```python
notice = '익명 사용 통계는 앱 개선을 위해 사용됩니다.'
```
- question: privacy notice에 들어갈 내용은?
- answer: 무엇을 왜 수집하고 어떻게 끌 수 있는지에 대한 설명
- explanation: privacy notice는 수집 항목, 목적, 보존 기간, 제3자 제공 여부, 끄거나 철회하는 방법을 사용자가 이해할 수 있게 설명한다. 화면의 한 문장은 요약일 뿐이며 실제 수집 범위가 더 넓다면 자세한 안내로 연결해야 한다. '익명'이라는 표현도 다시 식별할 수 없는 경우에만 사용해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY41_L10_architecture_diagram_001
- level: 10
- file: python_architecture_layers_patterns_v41.json
- title: architecture diagram 읽기
- question_type: meaning_choice
- concepts: ["architecture_diagram","data_flow","component"]
- reading_goal: 아키텍처 그림을 박스와 화살표의 의미로 읽는다.
- code:
```python
[User]
  -> [PWA]
  -> [API]
  -> [Service]
  -> [Repository]
  -> [JSON/DB]
```
- question: 아키텍처 다이어그램에서 화살표는 보통 무엇을 뜻하는가?
- answer: 데이터나 요청이 이동하는 방향
- explanation: 이 다이어그램에서는 화살표가 요청이나 데이터가 다음 component로 흐르는 주 방향을 나타낸다. 하지만 다른 그림에서는 dependency, event, network connection을 뜻할 수 있고 응답 방향이 생략될 수도 있다. 실제 의미는 제목, legend, 화살표 종류와 함께 확인해야 한다.
- project_context: 학습앱, RAG 검색, KG 파이프라인을 그림으로 볼 때 흐름을 따라 읽는 훈련이 된다.

## PY41_L10_kg_lora_pipeline_architecture_001
- level: 10
- file: python_architecture_layers_patterns_v41.json
- title: KG/LoRA pipeline architecture 읽기
- question_type: meaning_choice
- concepts: ["pipeline_architecture","KG","LoRA","validation"]
- reading_goal: KG/LoRA 작업을 단계별 파이프라인 구조로 읽는 연습을 한다.
- code:
```python
Input chunks
  -> Node extraction
  -> Node promotion
  -> Edge extraction
  -> Validation
  -> Dataset / KG output
```
- question: 이 구조에서 Validation 단계의 역할은?
- answer: 앞 단계 산출물이 규칙에 맞는지 검사하고 깨진 결과를 걸러낸다
- explanation: 이 그림의 Validation은 node·edge 추출 결과가 schema, 참조, 품질 규칙을 만족하는지 검사하고 부적합 결과를 final output에서 제외하거나 재처리로 보낸다. 각 단계의 입력·출력 version과 checkpoint를 남겨야 실패 지점에서 재개하고 어느 변환이 문제를 만들었는지 추적할 수 있다.
- project_context: 노드패스, 노드승격, 엣지패스, 평가셋 생성 흐름을 전체 지형으로 읽는 카드다.

## PY41_L10_monolith_modular_001
- level: 10
- file: python_architecture_layers_patterns_v41.json
- title: monolith vs modular structure 읽기
- question_type: meaning_choice
- concepts: ["monolith","modular_structure","module"]
- reading_goal: 한 덩어리 구조와 모듈형 구조의 차이를 읽는다.
- code:
```python
monolith:
  app.js does almost everything

modular:
  cardLoader.js
  progressStore.js
  reviewEngine.js
  uiRenderer.js
```
- question: modular structure의 장점은?
- answer: 역할별 파일로 나뉘어 수정과 테스트 범위를 줄일 수 있다
- explanation: 기능을 역할별 module로 나누면 공개 API를 통해 필요한 부분만 의존하게 만들 수 있다. 파일을 여러 개로 쪼개는 것만으로 modular해지지는 않으며, 전역 상태와 순환 import가 그대로면 영향 범위도 줄지 않는다. 응집도 높은 책임과 명확한 의존 방향이 핵심이다.
- project_context: 현재 app.js가 커질수록 card loader, state, UI, 검증 로직을 나누는 방향을 생각할 수 있다.
