# V356 semantic review — Level 10 chunk 12

Cards 221-240 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY51_L10_update_guard_001
- level: 10
- file: python_pwa_install_update_ux_v51.json
- title: update guard 읽기
- question_type: meaning_choice
- concepts: ["update_guard","unsaved_progress","PWA_update"]
- reading_goal: 업데이트 전에 저장되지 않은 학습 기록을 보호하는 guard를 이해한다.
- code:
```python
if (hasUnsavedProgress) {
  const saved = await saveProgressBeforeReload();
  if (!saved) return;
}
activateUpdate();
```
- question: update guard가 필요한 이유는?
- answer: 새로고침 전에 학습 기록이 사라지지 않게 하기 위해
- explanation: reload 전에 비동기 저장이 성공했는지 확인하고 실패하면 update 적용을 멈춰야 한다. local draft와 server sync가 다른 경우 둘을 구분하고, schema migration backup과 recovery도 준비한다. 함수를 호출했다는 사실만으로 data 보존이 보장되지는 않는다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY16_L10_edge_pass_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: Edge pass 입력 만들기
- question_type: meaning_choice
- concepts: ["def","function","return","edge_pass","relation","promoted_node","kg"]
- reading_goal: 승격된 노드만 사용해 관계 추출 입력을 만드는 코드를 읽는다.
- code:
```python
def make_edge_pass_input(chunk, promoted_nodes):
    return {
        "chunk_id": chunk["chunk_id"],
        "text": chunk["text"],
        "allowed_nodes": promoted_nodes,
        "task": "extract relations only between allowed nodes"
    }
```
- question: allowed_nodes에 promoted_nodes만 넣는 이유는?
- answer: 관계 추출의 정밀도를 높이기 위해
- explanation: allowed_nodes를 승격된 노드로 제한하면 관계 후보의 양을 줄여 정밀도를 높이는 데 도움이 된다. 하지만 이 딕셔너리는 모델에 task 문자열과 목록을 전달할 뿐이며, 실제로 목록 밖 노드를 쓰지 않거나 관계가 문서에 존재한다고 보장하지 않는다. 출력 schema 검증과 원문 근거 위치 확인을 거쳐 관계를 승격해야 한다.
- project_context: Node pass에서 확정한 노드를 바탕으로 Edge pass의 관계 후보 범위를 제한하는 분리 원칙과 연결된다.

## PY16_L10_evidence_pack_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: evidence pack 조립 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","evidence","citation","chunk","grounding"]
- reading_goal: 검색된 chunk를 답변 근거 묶음으로 바꾸는 코드를 읽는다.
- code:
```python
def build_evidence_pack(hits):
    pack = []
    for hit in hits:
        pack.append({
            "doc_id": hit["doc_id"],
            "chunk_id": hit["chunk_id"],
            "quote": hit["text"][:300],
            "score": hit.get("score", 0),
        })
    return pack
```
- question: hit['text'][:300]의 의미는?
- answer: 근거 텍스트 앞 300자만 quote로 저장한다
- explanation: hit["text"][:300]은 파이썬 문자열의 처음 300개 문자를 가져온다. 토큰 300개나 문장 300개가 아니며, 문장 중간에서 끊길 수 있다. 이 코드는 prompt 크기를 제한하는 간단한 예지만 처음 300자가 실제 주장을 뒷받침한다고 보장하지 않으므로, 실무에서는 관련 구간과 원문 위치도 함께 저장해야 한다.
- project_context: 근거 중심 RAG에서 답변보다 먼저 evidence 구조를 안정적으로 만드는 부분이다.

## PY16_L10_grounding_guard_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: 근거 부족 가드 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","grounding","evidence","guardrail","rag"]
- reading_goal: 근거가 부족하면 답변 생성을 막는 조건문을 읽는다.
- code:
```python
def answer_question(question, evidence, llm):
    if len(evidence) < 2:
        return {
            "answer": "근거가 부족해 확답할 수 없습니다.",
            "confidence": "low"
        }
    prompt = make_prompt(question, evidence)
    return {"answer": llm(prompt), "confidence": "normal"}
```
- question: len(evidence) < 2 조건의 목적은?
- answer: 근거가 너무 적으면 저신뢰 답변을 반환한다
- explanation: evidence가 두 개보다 적으면 make_prompt와 llm을 호출하지 않고 low confidence 응답을 반환한다. 그러나 근거 개수만으로 충분성을 판단할 수는 없다. 서로 중복된 두 조각이거나 질문과 무관한 근거일 수도 있으므로 관련도, 출처 다양성, 주장 뒷받침 여부를 함께 검사해야 한다. 이 조건은 단순한 예시 가드이지 hallucination 방지 보장이 아니다.
- project_context: Evidence-first verification pipeline의 소프트 가드와 연결되는 코드 독해다.

## PY16_L10_llm_retry_timeout_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: LLM 호출 재시도 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","try_except","range","retry","timeout","llm","api"]
- reading_goal: 실패할 수 있는 LLM 호출을 재시도하는 코드를 읽는다.
- code:
```python
def call_with_retry(client, prompt, max_attempts=3):
    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1")
    for attempt in range(max_attempts):
        try:
            return client.generate(prompt, timeout=60)
        except TimeoutError:
            if attempt == max_attempts - 1:
                raise
```
- question: 이 함수가 TimeoutError를 만나면 바로 종료하지 않는 이유는?
- answer: 최대 max_attempts번까지 다시 시도하기 위해
- explanation: TimeoutError가 나면 마지막 시도가 아닌 동안 except 블록을 빠져나와 다음 반복으로 간다. 성공하면 즉시 결과를 반환하고, 마지막 시도도 시간 초과이면 bare raise가 원래 TimeoutError를 다시 발생시킨다. 실제 API에서는 재시도해도 안전한 요청인지 확인하고, 서버 부담을 줄이도록 backoff와 jitter를 추가하며 다른 영구 오류까지 무조건 재시도하지 않아야 한다.
- project_context: Bedrock/로컬 LLM/외부 API 호출 자동화에서 실패 복구를 읽는 훈련이다.

## PY16_L10_node_pass_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: Node pass 입력 만들기
- question_type: meaning_choice
- concepts: ["def","function","return","node_pass","candidate","chunk","kg"]
- reading_goal: chunk에서 노드 후보 추출용 입력을 만드는 코드를 읽는다.
- code:
```python
def make_node_pass_input(chunk, node_catalog):
    return {
        "chunk_id": chunk["chunk_id"],
        "text": chunk["text"],
        "known_nodes": node_catalog,
        "task": "extract candidate nodes"
    }
```
- question: known_nodes에 node_catalog를 함께 넣는 가장 직접적인 이유는?
- answer: 후보가 기존 노드와 같은 개념이나 별칭인지 비교하기 위해
- explanation: node pass는 chunk의 text에서 노드 후보를 찾는 단계다. known_nodes로 기존 catalog를 함께 주면 추출한 표현이 기존 노드와 같은 개념인지, 별칭인지, 새 후보인지 비교하기 쉬워진다. 따라서 정답은 ‘후보가 기존 노드와 같은 개념이나 별칭인지 비교하기 위해’이다. 다만 known_nodes에 없는 표현도 새 후보로 남길 수 있어야 하며, 목록에 있는 항목만 고르게 제한하면 새로운 노드를 놓칠 수 있다.
- project_context: 노드 후보를 먼저 식별·정규화한 뒤, 확정된 노드 사이의 관계를 Edge pass에서 추출하는 분리 원칙 중 첫 단계다.

## PY16_L10_pipeline_status_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: pipeline status 기록 읽기
- question_type: meaning_choice
- concepts: ["def","function","pipeline","status","logging","run_id"]
- reading_goal: 실행 성공/실패 상태를 run_id와 함께 기록하는 코드를 읽는다.
- code:
```python
def finalize_run(db, run_id, ok, stats, error=None):
    status = "ok" if ok else "error"
    db.update("runs", run_id, {
        "status": status,
        "stats": stats,
        "error_message": str(error) if error else None,
    })
```
- question: ok가 False이면 status는 무엇이 되는가?
- answer: error
- explanation: 조건식은 ok가 truthy이면 "ok", falsy이면 "error"를 선택하므로 False일 때 정답은 error다. 이어서 db.update가 runs의 해당 run_id 레코드에 상태, 통계, 오류 문자열을 저장한다. 이 코드는 파일 로그를 쓰는 코드는 아니다. str(error)에 토큰이나 개인정보가 섞일 수 있으므로 운영 환경에서는 저장할 오류 내용을 정제해야 한다.
- project_context: 배치 실행 테이블의 상태 일관성과 작업 감사 기록을 읽는 코드다.

## PY16_L10_prompt_with_citations_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: 근거 포함 프롬프트 만들기
- question_type: meaning_choice
- concepts: ["for","def","function","return","prompt","citation","rag","grounding"]
- reading_goal: 근거 목록을 LLM 프롬프트 문자열로 조립하는 코드를 읽는다.
- code:
```python
def make_prompt(question, evidence):
    lines = ["Answer using only the evidence below."]
    for i, ev in enumerate(evidence, start=1):
        lines.append(f"[{i}] {ev['quote']}")
    lines.append("Question: " + question)
    return "\n".join(lines)
```
- question: enumerate(evidence, start=1)의 역할은?
- answer: 근거에 1번부터 번호를 붙인다
- explanation: enumerate는 순번과 값을 함께 꺼내며 start=1 때문에 첫 근거 번호가 1이 된다. 마지막의 "\n".join은 각 항목을 줄바꿈으로 연결한다. 번호를 붙이면 모델과 사용자가 근거를 가리키기 쉬워지지만, 이 문자열만으로 모델이 실제로 [1] 형식의 인용을 출력하거나 해당 근거를 정확히 사용한다고 보장되지는 않는다. 출력 형식 검사와 인용-주장 검증이 별도로 필요하다.
- project_context: 답변이 어떤 근거를 보고 생성됐는지 추적하기 위한 핵심 패턴이다.

## PY16_L10_provenance_lineage_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: provenance/lineage 기록 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","provenance","lineage","evidence","audit"]
- reading_goal: 결과가 어떤 입력과 모델에서 나왔는지 기록하는 코드를 읽는다.
- code:
```python
def attach_lineage(result, run_id, model_name, input_ids):
    result["lineage"] = {
        "run_id": run_id,
        "model": model_name,
        "input_ids": input_ids,
    }
    return result
```
- question: lineage 필드의 주된 목적은?
- answer: 결과의 출처와 생성 과정을 추적한다
- explanation: 이 함수는 기존 result 딕셔너리에 run_id, model, input_ids를 담은 lineage를 붙인 뒤 같은 객체를 반환한다. 이 정보는 어떤 실행과 입력에서 결과가 나왔는지 추적하는 단서다. 다만 완전한 재현을 위해서는 모델 버전, 코드와 설정 버전, 프롬프트, 난수 seed 같은 정보가 더 필요하고, input_ids가 실제 원문 출처를 가리키는지도 별도로 보장해야 한다.
- project_context: KG/LoRA 데이터셋 생성에서 어떤 결과가 어떤 샤드와 모델에서 나왔는지 추적하는 데 필요하다.

## PY16_L10_rag_test_harness_001
- level: 10
- file: python_rag_kg_pipeline_review_v16.json
- title: RAG 테스트 하네스 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","test_harness","rag","evaluation","assert"]
- reading_goal: 질문 세트를 돌려 RAG 출력이 최소 조건을 만족하는지 검사하는 코드를 읽는다.
- code:
```python
def run_eval(cases, rag):
    failures = []
    for case in cases:
        result = rag(case["question"])
        if case["must_cite"] and not result.get("citations"):
            failures.append(case["id"])
    return failures
```
- question: failures에 case id가 들어가는 경우는?
- answer: 인용이 필요한 case인데 citations가 없을 때
- explanation: must_cite가 truthy이고 result.get("citations")가 없거나 빈 값이면 case id가 failures에 들어간다. 이 테스트는 인용의 존재만 검사하며, 인용이 올바른 원문을 가리키는지 또는 답변의 주장을 실제로 뒷받침하는지는 검사하지 않는다. RAG 회귀 테스트에는 관련 근거, 답변 정확성, 실패 응답 같은 기준도 별도로 추가해야 한다.
- project_context: RAG 품질을 감으로 보지 않고 테스트 케이스로 확인하는 기본 구조다.

## PY8_L10_node_page_md_001
- level: 10
- file: python_realworld_expansion_v8.json
- title: 노드페이지 Markdown 생성 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","kg","markdown","node_page"]
- reading_goal: 노드 label과 근거 snippet으로 Markdown 초안을 만드는 흐름을 읽는다.
- code:
```python
def make_node_page(node, evidence):
    return f"# {node['label']}\n\n## Definition\n{evidence[0]['snippet']}"
```
- question: Markdown 제목에는 무엇이 들어가는가?
- answer: node label
- explanation: f-string의 # {node['label']}이 node의 label 값을 1단계 Markdown 제목에 넣고, evidence[0]['snippet']은 Definition 본문에 넣는다. 따라서 제목의 값은 node label이다. 다만 evidence가 비어 있으면 evidence[0]에서 IndexError가 나고, 필수 key가 없으면 KeyError가 난다. label이나 snippet의 Markdown 특수문자를 이스케이프하지도 않으므로 자동 문서 생성 전 입력 검증이 필요하다.
- project_context: KG 노드페이지/기술백서 자동 초안 생성과 연결된다.

## PY8_L10_node_promotion_rule_001
- level: 10
- file: python_realworld_expansion_v8.json
- title: 노드 승격 규칙 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","kg","node_promotion","rule"]
- reading_goal: 출현 횟수와 정의 근거 조건으로 노드 승격 여부를 판단하는 코드를 읽는다.
- code:
```python
def promote_node(candidate):
    if candidate["occurrence_count"] >= 3 and candidate["has_definition"]:
        return "PROMOTE"
    return "REVIEW"
```
- question: PROMOTE 조건은?
- answer: 3회 이상 출현하고 has_definition이 truthy
- explanation: and의 두 피연산자가 모두 참이어야 PROMOTE를 반환한다. 즉 occurrence_count가 3 이상이고 has_definition 값이 truthy여야 하며, 하나라도 거짓이면 REVIEW다. 여기서 코드는 has_definition의 진리값만 볼 뿐 실제 정의 문장이나 근거의 품질을 검증하지 않는다. 두 key가 없으면 KeyError가 나므로 이 함수만으로 완전한 노드 승격 검증이라고 부르기는 어렵다.
- project_context: 노드패스/수동검토앱/teacher dataset 흐름과 연결된다.

## PY8_L10_rag_citation_001
- level: 10
- file: python_realworld_expansion_v8.json
- title: RAG citation 생성 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","rag","citation","evidence"]
- reading_goal: 답변에 근거 doc_id/chunk_id를 붙이는 구조를 읽는다.
- code:
```python
def cite_answer(answer, chunks):
    citations = []
    for chunk in chunks:
        citations.append({"doc_id": chunk["doc_id"], "chunk_id": chunk["id"]})
    return {"answer": answer, "citations": citations}
```
- question: citations에 들어가는 것은?
- answer: doc_id와 chunk_id
- explanation: 반복문은 chunks의 각 항목에서 doc_id와 id를 읽어 {doc_id, chunk_id} 객체를 citations에 추가한다. 그래서 반환값에는 answer와 모든 입력 chunk의 식별자가 함께 들어간다. 이 코드는 answer가 실제로 어느 문장을 사용했는지 확인하지 않고 모든 chunk를 인용하며, 식별자가 존재한다는 사실만으로 답변이 그 근거의 지지를 받거나 신뢰할 수 있다고 보장하지 않는다. 화면에서 출처를 열려면 이 식별자를 원문 위치로 해석하는 별도 매핑도 필요하다.
- project_context: 검증 가능한 답변과 근거 추적에 중요하다.

## PY8_L10_rag_strict_prompt_001
- level: 10
- file: python_realworld_expansion_v8.json
- title: 근거 제한 프롬프트 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","rag","prompt","evidence"]
- reading_goal: 검색된 근거 chunk만 사용하라고 지시하는 프롬프트 생성 흐름을 읽는다.
- code:
```python
def build_prompt(question, evidence_chunks):
    context = "\n\n".join(chunk["text"] for chunk in evidence_chunks)
    return f"Use only the context.\n{context}\nQuestion: {question}"
```
- question: Use only the context의 목적은?
- answer: 근거 밖 답변을 줄이기
- explanation: 함수는 chunk의 text를 빈 줄 두 개로 이어 붙이고, 그 앞에 Use only the context라는 지시를 넣는다. 이 지시의 의도는 근거 밖 답변을 줄이는 것이지만 모델 출력을 기술적으로 강제하는 접근 제어는 아니다. 또한 프롬프트에는 근거가 없을 때 ‘모른다’고 답하라는 명시적 규칙도 없다. 운영 코드라면 빈 evidence를 차단하고, 출력의 주장과 인용 근거가 실제로 맞는지 별도 검증해야 한다.
- project_context: Evidence-first RAG 서비스 설계와 직접 연결된다.

## PY40_L10_backward_compatibility_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: backward compatibility 읽기
- question_type: meaning_choice
- concepts: ["backward_compatibility","compatibility","safe_change"]
- reading_goal: 기존 데이터/기능과 호환되게 바꾸는 backward compatibility를 이해한다.
- code:
```python
old card:
  title

new card:
  title
  difficulty

reader:
  difficulty = card.difficulty ?? "normal"
```
- question: ?? 'normal' 같은 기본값이 필요한 이유는?
- answer: 기존 카드에 difficulty가 없어도 동작하게 하려고
- explanation: JavaScript의 ??는 왼쪽 값이 null 또는 undefined일 때만 normal을 사용하므로 difficulty가 없는 기존 카드도 읽게 한다. 빈 문자열이나 알 수 없는 값은 그대로 통과하므로 허용값 검증은 별도다. 기본값은 호환 정책이며 기존 데이터 오류를 무조건 숨기지 않도록 관찰과 migration도 필요하다.
- project_context: v1~v39 카드가 있는 상태에서 새 필드를 추가할 때 필요한 관점이다.

## PY40_L10_code_review_checklist_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: code review checklist 읽기
- question_type: meaning_choice
- concepts: ["code_review","checklist","quality"]
- reading_goal: 리뷰 때 확인할 항목을 체크리스트로 보는 이유를 이해한다.
- code:
```python
review checklist:
  [ ] intended behavior preserved
  [ ] names are clear
  [ ] duplication is intentional or removed
  [ ] validation and tests pass
  [ ] rollback/forward-fix is planned
```
- question: 이 체크리스트의 목적은?
- answer: 변경이 안전하고 읽기 쉬운지 확인한다
- explanation: 체크리스트는 반복해서 놓치는 검증을 줄이는 보조 도구다. 항목을 기계적으로 체크하는 것만으로 품질이 보장되지는 않으므로 diff, 테스트 결과, 위험한 가정의 근거를 함께 검토한다. 의도된 중복이나 되돌릴 수 없는 side effect처럼 맥락에 따라 판단할 항목도 명시해야 한다.
- project_context: SWAP-IN 방식, 검증 OK, git status clean 확인도 넓은 의미의 리뷰 체크리스트다.

## PY40_L10_migration_safe_change_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: migration-safe change 읽기
- question_type: order_choice
- concepts: ["migration_safe","schema_change","compatibility"]
- reading_goal: 데이터 구조 변경을 한 번에 깨뜨리지 않고 단계적으로 적용하는 방식을 이해한다.
- code:
```python
step 1: reader supports old + new field
step 2: writer starts writing new field
step 3: migrate old data
step 4: remove old field later
```
- question: 가장 먼저 해야 안전한 단계는?
- answer: reader supports old + new field
- explanation: migration safe change는 배포 중간에도 앱이 깨지지 않도록 변경 순서를 잡는 방식이다. 읽는 쪽이 먼저 양쪽 형식을 지원하면 위험이 줄어든다. 새 형식 저장을 시작하기 전에 구버전과 신버전을 모두 읽을 수 있게 만드는 것이 안전하다. 따라서 정답은 ‘reader supports old + new field’이다.
- project_context: 카드 JSON 스키마를 바꾸거나 progress 저장 구조를 바꿀 때 필요한 절차다.

## PY40_L10_patch_risk_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: patch risk 읽기
- question_type: meaning_choice
- concepts: ["patch_risk","risk_management","safe_patch"]
- reading_goal: 패치가 어디를 건드리는지에 따라 위험도가 달라짐을 이해한다.
- code:
```python
low risk:
  add new lesson json

higher risk:
  rewrite app.js loading logic
```
- question: app.js loading logic 재작성의 위험이 더 큰 이유는?
- answer: 기존 모든 lesson 로딩을 깨뜨릴 수 있기 때문
- explanation: patch risk는 작은 수정이 예상보다 넓은 기능에 영향을 줄 가능성이다. 공통 로딩 로직처럼 영향 범위가 넓은 코드는 회귀 검증이 필요하다. 위험이 큰 패치는 작게 나누고 smoke test와 회귀 검증을 붙여 영향 범위를 확인해야 한다. 따라서 정답은 ‘기존 모든 lesson 로딩을 깨뜨릴 수 있기 때문’이다.
- project_context: 오래된 Expand V3 스크립트가 v4 이후 lessonFiles를 지울 수 있었던 위험과 연결된다.

## PY40_L10_rollback_friendly_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: rollback-friendly change 읽기
- question_type: meaning_choice
- concepts: ["rollback","small_change","release_safety"]
- reading_goal: 문제가 생겼을 때 쉽게 되돌릴 수 있는 변경 방식을 이해한다.
- code:
```python
good:
  one topic per commit
  validation passes
  git status clean

bad:
  many unrelated changes in one commit
```
- question: one topic per commit의 장점은?
- answer: 문제 발생 시 특정 변경만 되돌리기 쉽다
- explanation: 한 목적의 작은 커밋은 코드 변경의 원인을 좁히고 특정 commit을 revert하기 쉽게 한다. 하지만 DB migration, 외부 API 호출, 이미 사용자에게 저장된 데이터 같은 side effect는 Git revert만으로 되돌아가지 않을 수 있다. 배포 전 검증과 별도의 rollback·forward-fix 계획이 필요하다.
- project_context: v27~v39를 주제별 커밋으로 나눈 현재 방식과 맞다.

## PY40_L10_small_commit_001
- level: 10
- file: python_refactoring_maintainability_v40.json
- title: small commit 읽기
- question_type: meaning_choice
- concepts: ["small_commit","git","review"]
- reading_goal: 작고 관련된 변경만 묶는 commit 습관을 이해한다.
- code:
```python
commit:
  add v40 lesson json
  update app.js lessonFiles
```
- question: 이 커밋 범위가 좋은 이유는?
- answer: v40 추가라는 한 목적에 집중되어 있다
- explanation: small commit은 관련 있는 작은 변경만 하나의 커밋에 담는 습관이다. 범위가 작으면 리뷰, 검증, 되돌리기가 쉬워진다. 나중에 문제가 생겼을 때 어떤 변경이 원인이었는지 좁히기 쉬워서 품질 관리에도 유리하다. 따라서 정답은 ‘v40 추가라는 한 목적에 집중되어 있다’이다.
- project_context: 새 확장 카드 추가는 lesson JSON + app.js 연결만 커밋하는 것이 깔끔하다.
