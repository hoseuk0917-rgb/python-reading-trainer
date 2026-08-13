# V356 semantic review — Level 9 chunk 14

Cards 261-280 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY46_L09_heartbeat_001
- level: 9
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: heartbeat 읽기
- question_type: meaning_choice
- concepts: ["while","heartbeat","liveness","watchdog"]
- reading_goal: 프로세스가 살아 있음을 주기적으로 표시하는 heartbeat를 이해한다.
- code:
```python
while running:
    write_heartbeat(now())
    sleep(60)
```
- question: heartbeat가 알려주는 것은?
- answer: 작업 프로세스가 아직 살아 있는지
- explanation: heartbeat는 해당 timestamp에 loop가 신호를 쓸 수 있었다는 뜻이다. 최근 heartbeat는 process 생존의 단서지만 실제 업무가 진행되거나 결과가 정확하다는 보장은 아니다. stale 판단 threshold는 갱신 주기와 일시 지연을 고려하고 progress counter와 worker lease도 함께 확인한다.
- project_context: 서버에서 장시간 LoRA/node_pass를 돌릴 때 상태 감시용으로 쓸 수 있다.

## PY46_L09_progress_log_001
- level: 9
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: progress log 읽기
- question_type: meaning_choice
- concepts: ["print","progress_log","observability","long_running_job"]
- reading_goal: 오래 걸리는 작업에서 진행 로그를 남기는 이유를 이해한다.
- code:
```python
print(f'DONE {done}/{total} shard={shard_id}')
```
- question: progress log가 중요한 이유는?
- answer: 작업이 멈춘 것인지 진행 중인지 판단할 수 있기 때문
- explanation: progress log는 마지막으로 관찰된 done과 shard를 알려 주어 진단에 도움을 준다. 오래된 buffered log나 반복 출력만으로 process가 건강하거나 결과가 durable하다고 증명할 수는 없다. timestamp, attempt, worker ID를 남기고 checkpoint·heartbeat·실제 output과 함께 본다.
- project_context: node_pass status 메시지의 done, running_processes, GPU util 같은 로그가 이에 해당한다.

## PY46_L09_shard_status_001
- level: 9
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: shard status 읽기
- question_type: meaning_choice
- concepts: ["shard","status","batch_job"]
- reading_goal: 여러 shard의 진행 상태를 표로 관리하는 방식을 이해한다.
- code:
```python
shard_id | total | done | status
0031     | 200   | 200  | DONE
0067     | 200   | 154  | RUNNING
```
- question: shard status 표가 필요한 이유는?
- answer: 어느 조각이 완료/진행/실패 상태인지 한눈에 보기 위해
- explanation: shard별 total, done, status를 모으면 남은 양과 실패 구간을 볼 수 있다. RUNNING이 실제로 살아 있는지 판단하려면 worker/lease ID와 updated_at 또는 heartbeat가 필요하고, total 정의와 중복 처리 여부도 일관돼야 한다. 상태 전이는 atomic하게 기록한다.
- project_context: AWS node_pass에서 0031~0100 shard 진행률을 관리했던 방식과 연결된다.

## PY43_L09_context_packing_001
- level: 9
- file: python_search_embedding_rag_flow_v43.json
- title: context packing 읽기
- question_type: meaning_choice
- concepts: ["context_packing","context_window","evidence"]
- reading_goal: 검색된 근거를 LLM 입력에 넣기 좋게 묶는 과정을 이해한다.
- code:
```python
context = pack([
    chunk_1,
    chunk_2,
    chunk_3
], max_tokens=3000)
```
- question: context packing에서 중요한 것은?
- answer: 중요한 근거를 토큰 한도 안에 넣는 것
- explanation: context packing은 검색 근거를 model tokenizer 기준 max_tokens 안에 배치하는 과정이다. 관련성뿐 아니라 중복 제거, 출처 다양성, 문서 순서, 질문과 함께 쓸 token, citation provenance를 고려해야 한다. chunk를 자르면 주장과 출처가 분리되지 않게 경계를 관리한다.
- project_context: 근거 chunk가 많을 때 어떤 것을 답변 context에 넣을지가 품질과 비용을 좌우한다.

## PY43_L09_grounded_answer_001
- level: 9
- file: python_search_embedding_rag_flow_v43.json
- title: grounded answer 읽기
- question_type: meaning_choice
- concepts: ["if","grounded_answer","citation","evidence_first"]
- reading_goal: 답변이 검색 근거에 묶여 있어야 한다는 grounded answer 개념을 이해한다.
- code:
```python
answer = generate_answer(question, context)
report = check_evidence_support(answer, context)
if not report.supported:
    answer = revise_or_decline(question, context, report)
```
- question: grounded answer의 핵심은?
- answer: 검색된 근거를 바탕으로 답변하는 것
- explanation: grounded answer는 각 주요 주장이 제공된 evidence로 뒷받침되도록 작성한 답변이다. 자동 support checker도 오판할 수 있으므로 assert 하나가 groundedness를 증명하지는 않는다. 중요한 용도에서는 claim별 citation, 원문 대조, 평가 dataset 또는 사람 검토를 함께 사용한다.
- project_context: Cross-Verified RAG/Evidence-first 원칙과 직접 연결되는 카드다.

## PY43_L09_metadata_filter_001
- level: 9
- file: python_search_embedding_rag_flow_v43.json
- title: metadata filter 읽기
- question_type: meaning_choice
- concepts: ["metadata_filter","domain_filter","source_filter"]
- reading_goal: 검색 결과를 domain, source, date 같은 메타데이터로 제한하는 방식을 이해한다.
- code:
```python
results = search(query, filter={
    'domain': 'UAM',
    'doc_type': 'standard'
})
```
- question: metadata filter를 쓰는 이유는?
- answer: 검색 범위를 원하는 문서군으로 좁히기 위해
- explanation: metadata filter는 domain과 doc_type이 지정값인 문서만 retrieval 후보로 제한한다. 관련 없는 문서를 줄일 수 있지만 metadata가 누락·오분류됐거나 filter가 너무 좁으면 관련 근거도 제외된다. filter 가능한 field가 index에 저장됐는지와 결과가 0일 때의 완화 정책을 함께 확인한다.
- project_context: A-lane/B-lane, domain, theme, lens, doc_type 필터는 KG 검색 품질에 직접 연결된다.

## PY43_L09_reranking_001
- level: 9
- file: python_search_embedding_rag_flow_v43.json
- title: reranking 읽기
- question_type: meaning_choice
- concepts: ["reranking","candidate_ranking","retrieval_quality"]
- reading_goal: 1차 검색 후보를 다시 정렬하는 reranking의 목적을 이해한다.
- code:
```python
candidates = retrieve_top_50(query)
final = rerank(query, candidates)[:5]
```
- question: reranking의 역할은?
- answer: 1차 후보 중 질문에 더 잘 맞는 것을 위로 올린다
- explanation: reranker는 1차 top 50 안의 후보를 query와 다시 비교해 점수를 매기고 상위 5개를 선택한다. 1차 retrieval에서 빠진 문서는 되살릴 수 없고 reranker도 오류가 있으므로 candidate recall과 최종 relevance를 따로 평가한다. [:5]는 Python에서 최대 다섯 항목을 취한다.
- project_context: home-curator나 RAG 앱에서 후보가 많을 때 최종 context에 넣을 근거를 고르는 단계다.

## PY55_L09_filter_chips_001
- level: 9
- file: python_tag_filter_advanced_search_v55.json
- title: filter chips 읽기
- question_type: meaning_choice
- concepts: ["filter_chips","active_filter","UI"]
- reading_goal: 현재 적용된 필터를 작은 칩 UI로 보여주는 방식을 이해한다.
- code:
```python
chips = ['level 8+', 'concept: validation', 'query: json']
```
- question: filter chips의 역할은?
- answer: 현재 적용된 필터 조건을 눈에 보이게 보여준다
- explanation: filter chips는 켜져 있는 필터 조건을 작은 태그처럼 보여주는 UI다. 필터가 많아지면 사용자가 어떤 조건이 적용됐는지 잊기 쉽다. 사용자는 chip을 보고 조건을 끄거나 바꾸며 검색 범위를 빠르게 조정할 수 있다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L09_no_result_recovery_001
- level: 9
- file: python_tag_filter_advanced_search_v55.json
- title: no result recovery 읽기
- question_type: meaning_choice
- concepts: ["no_result","filter_recovery","UX"]
- reading_goal: 검색 결과가 없을 때 조건을 줄이도록 안내하는 UX를 이해한다.
- code:
```python
if (results.length === 0) {
  showHint('필터를 줄여보세요')
}
```
- question: no result recovery의 목적은?
- answer: 결과 없음 상태에서 사용자가 다음 행동을 알 수 있게 하기 위해
- explanation: 빈 화면만 보여주면 사용자는 검색이 실패한 것인지 조건이 너무 좁은 것인지 알기 어렵다. no result recovery는 검색 결과가 없을 때 사용자가 다음 행동을 할 수 있게 돕는 흐름이다. 필터 해제, 추천 검색어, 전체 보기 버튼이 있는지 확인해야 한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L09_saved_search_001
- level: 9
- file: python_tag_filter_advanced_search_v55.json
- title: saved search 읽기
- question_type: meaning_choice
- concepts: ["saved_search","bookmark_filter","learning_ux"]
- reading_goal: 자주 쓰는 검색 조건을 저장하는 saved search 개념을 이해한다.
- code:
```python
savedSearches.push({
  name: '오답 validation',
  filterState: structuredClone(filterState)
});
```
- question: saved search가 유용한 상황은?
- answer: 자주 쓰는 필터 조건을 다시 빠르게 불러오고 싶을 때
- explanation: 현재 filterState의 snapshot을 copy해 저장해야 나중 state mutation이 saved search까지 바꾸지 않는다. schema version과 canonical tag를 저장하고 load할 때 validate한다. search 이름이나 query에 민감한 내용이 있을 수 있으므로 sync·공유 범위를 알려 준다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L09_url_query_state_001
- level: 9
- file: python_tag_filter_advanced_search_v55.json
- title: URL query state 읽기
- question_type: meaning_choice
- concepts: ["url_query","shareable_filter","state"]
- reading_goal: 검색 조건을 URL query에 담아 공유하거나 복원하는 방식을 이해한다.
- code:
```python
const params = new URLSearchParams({
  q: filterState.query,
  level: String(filterState.levelMin),
  concept: filterState.concept
});
const url = `?${params}`;
```
- question: URL query state의 장점은?
- answer: 검색 조건을 링크로 공유하거나 새로고침 후 복원할 수 있다
- explanation: URLSearchParams가 space와 특수문자를 encode한다. load할 때 level 범위와 허용 concept를 validate하고 unknown parameter는 안전하게 무시한다. URL은 history, log, referrer와 공유될 수 있으므로 private note나 민감한 query를 넣지 않는다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY47_L09_fail_fast_001
- level: 9
- file: python_tests_regression_quality_gate_v47.json
- title: fail fast 읽기
- question_type: meaning_choice
- concepts: ["if","fail_fast","early_error","guard"]
- reading_goal: 문제를 발견하면 뒤 작업을 계속하지 않고 바로 중단하는 fail fast를 이해한다.
- code:
```python
if missing_files:
    raise SystemExit('missing files')

commit_changes()
```
- question: fail fast의 장점은?
- answer: 깨진 상태로 뒤 단계가 계속 진행되는 것을 막는다
- explanation: fail fast는 문제가 보이면 뒤 단계를 계속 진행하지 않고 바로 멈추는 방식이다. 원인 파악이 쉬워지고 잘못된 산출물이 퍼지는 것을 막는다. 검증 실패를 초기에 멈추면 뒤에서 생기는 2차 오류와 원래 오류를 섞어 보지 않아도 된다.
- project_context: version guard, missing file check, duplicate ID check가 fail fast 역할을 한다.

## PY47_L09_mock_fake_001
- level: 9
- file: python_tests_regression_quality_gate_v47.json
- title: mock / fake 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","mock","fake","test_double"]
- reading_goal: 외부 API나 무거운 의존성을 테스트용 대체물로 바꾸는 mock/fake를 이해한다.
- code:
```python
class FakeLLM:
    def generate(self, prompt):
        return {'answer': 'test'}
```
- question: FakeLLM을 쓰는 이유는?
- answer: 실제 LLM API 비용 없이 호출 흐름을 테스트하기 위해
- explanation: mock/fake는 외부 의존성을 가짜 구현으로 바꿔 빠르고 안전하게 테스트하게 한다. mock과 fake는 테스트에서 실제 외부 시스템 대신 쓰는 대체 객체다. 네트워크나 DB 없이도 흐름을 검증할 수 있지만, 실제 동작과 차이가 생기지 않게 주의해야 한다.
- project_context: Qwen/GPT 호출 없이 prompt, parser, validation 흐름만 테스트할 때 유용하다.

## PY47_L09_pre_commit_check_001
- level: 9
- file: python_tests_regression_quality_gate_v47.json
- title: pre-commit check 읽기
- question_type: meaning_choice
- concepts: ["pre_commit","local_check","commit_safety"]
- reading_goal: 커밋 전에 로컬에서 자동 검증을 실행하는 pre-commit check를 이해한다.
- code:
```python
before commit:
  run json validation
  run duplicate id check
  run answer check
```
- question: pre-commit check가 필요한 이유는?
- answer: 깨진 파일을 커밋하기 전에 잡기 위해
- explanation: pre-commit check는 commit 전에 실행하는 검사라는 뜻이며 hook이나 도구 설정이 있어야 자동 실행된다. JSON parse, ID uniqueness, answer 일관성을 조기에 잡지만 remote CI와 review를 대체하지 않는다. hook을 건너뛸 수 있으므로 같은 검사 script를 CI에서도 실행한다.
- project_context: lesson JSON을 git add 하기 전 count, first, last, full validation을 확인한 흐름이다.

## PY47_L09_validation_gate_001
- level: 9
- file: python_tests_regression_quality_gate_v47.json
- title: validation gate 읽기
- question_type: meaning_choice
- concepts: ["if","validation_gate","quality_gate","pipeline_step"]
- reading_goal: 다음 단계로 넘어가기 전에 반드시 통과해야 하는 검증 관문을 이해한다.
- code:
```python
generate_files()
ok = run_validation_gate()
if not ok:
    raise SystemExit(1)
commit_and_push()
```
- question: validation gate의 역할은?
- answer: 검증을 통과한 산출물만 다음 단계로 보내는 것
- explanation: gate 결과를 ok로 받아 false면 nonzero exit로 중단하고 true일 때만 다음 단계를 호출한다. 실제 automation에서 commit·push는 별도 권한과 review가 필요한 side effect이므로 validation 함수가 직접 수행하기보다 명시적인 release 단계로 분리하는 편이 추적하기 쉽다.
- project_context: 카드 생성 후 전체 validation OK가 떠야 서버 확인과 commit으로 넘어갔다.

## PY24_L09_json_parse_all_001
- level: 9
- file: python_tests_validation_regression_v24.json
- title: 전체 JSON parse smoke test 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","json","parse","smoke_test","validation"]
- reading_goal: 모든 lesson JSON이 파싱 가능한지 빠르게 확인하는 smoke test를 읽는다.
- code:
```python
import json
from pathlib import Path

for path in Path("data/lessons").glob("*.json"):
    json.loads(path.read_text(encoding="utf-8"))
    print("OK", path.name)
```
- question: 이 테스트가 잡아낼 수 있는 문제는?
- answer: JSON 문법 깨짐
- explanation: 각 .json file의 전체 text를 읽고 json.loads가 syntax상 valid JSON인지 확인한다. 한 file이 invalid하면 exception에서 loop가 중단되어 그 뒤 file은 검사하지 않으며, glob은 하위 directory를 재귀적으로 찾지 않는다. parse 성공은 card schema나 id·answer 관계가 올바르다는 뜻도 아니므로 smoke test 뒤 semantic validation이 필요하다.
- project_context: 새 lesson 파일을 추가할 때 가장 먼저 돌릴 수 있는 기본 검증이다.

## PY24_L09_regression_total_cards_001
- level: 9
- file: python_tests_validation_regression_v24.json
- title: 총 카드 수 회귀검사 읽기
- question_type: meaning_choice
- concepts: ["if","regression_test","total_count","validation"]
- reading_goal: 새 보강 후 카드 수가 줄어들지 않았는지 확인하는 회귀검사를 이해한다.
- code:
```python
previous_total = 552
current_total = len(cards)
if current_total < previous_total:
    raise AssertionError("card count decreased")
```
- question: current_total이 previous_total보다 작으면?
- answer: 회귀로 보고 실패시킨다
- explanation: current_total이 552보다 작으면 AssertionError가 난다. 이 검사는 예상치 않은 감소 신호를 잡지만 증가, 같은 수의 잘못된 교체, 특정 file 누락을 찾지는 못한다. hard-coded 이전 수보다 manifest별 기대 수와 ID snapshot 또는 명시적인 승인 baseline을 함께 검증해야 회귀 원인을 정확히 알 수 있다.
- project_context: lesson loading 누락으로 total count가 감소하는 회귀를 보조적으로 감지하는 검사다.

## PY24_L09_snapshot_hash_001
- level: 9
- file: python_tests_validation_regression_v24.json
- title: snapshot hash 비교 읽기
- question_type: meaning_choice
- concepts: ["comment","def","function","return","import","print","snapshot","hash","regression","integrity"]
- reading_goal: 중요 파일의 해시를 비교해 의도치 않은 변경을 감지하는 구조를 읽는다.
- code:
```python
import hashlib
from pathlib import Path

def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

before = sha256("src/pwa/app.js")
# patch here
after = sha256("src/pwa/app.js")
print(before == after)
```
- question: before == after가 False면 무엇을 의미하는가?
- answer: 파일 내용이 바뀌었다
- explanation: 두 read 사이에 bytes가 달라지면 SHA-256 digest도 사실상 확실히 달라져 False가 된다. 반대로 같은 digest는 accidental change가 없다는 강한 evidence지만 어떤 줄이 바뀌었는지 설명하지 못하고, 신뢰되지 않은 hash는 source authenticity도 보장하지 않는다. 실제 review에는 git diff와 예상 변경 범위를 함께 쓴다.
- project_context: 패치 전후 변경 파일을 감시하거나 산출물 무결성을 확인하는 데 쓸 수 있다.

## PY34_L09_before_after_compare_001
- level: 9
- file: python_tests_validation_regression_v34.json
- title: 변경 전/후 비교 읽기
- question_type: meaning_choice
- concepts: ["before_after","diff","validation"]
- reading_goal: 패치 전후 결과 수치를 비교해 의도대로 바뀌었는지 확인한다.
- code:
```python
before: TOTAL CARDS 708
after:  TOTAL CARDS 723
increase: 15
```
- question: 이 비교에서 알 수 있는 것은?
- answer: 카드가 15장 늘었다
- explanation: 이 수치로 직접 알 수 있는 것은 총 카드 수가 708에서 723으로 15장 늘었다는 사실이다. 예상 증가량과 비교하면 누락이나 중복의 단서를 얻을 수 있지만, 새 카드의 내용이 정확하거나 기존 카드가 보존되었다는 사실까지는 총수만으로 증명할 수 없다.
- project_context: v33에서 708장에서 723장으로 늘어난 것을 확인한 방식이다.

## PY34_L09_edge_case_001
- level: 9
- file: python_tests_validation_regression_v34.json
- title: edge case 읽기
- question_type: meaning_choice
- concepts: ["edge_case","empty_list","boundary"]
- reading_goal: 보통 입력이 아닌 빈 값, 경계값, 누락값 테스트를 이해한다.
- code:
```python
assert filter_by_level([], 1) == []
assert get_title({}) == ""
```
- question: 빈 리스트나 빈 dict를 테스트하는 이유는?
- answer: 경계 상황에서도 함수가 깨지지 않는지 보기 위해
- explanation: 실제 앱에서는 데이터가 비어 있거나 필드가 누락될 수 있으므로 edge case 검증이 중요하다. edge case는 보통 흐름에서는 잘 안 보이지만 오류를 만들 수 있는 경계 상황이다. 빈 값, 아주 긴 값, 없는 파일 같은 경우를 따로 점검해야 한다. 따라서 정답은 ‘경계 상황에서도 함수가 깨지지 않는지 보기 위해’이다.
- project_context: lesson이 아직 로딩 전이거나 side card가 없는 경우를 안전하게 처리하는 데 필요하다.
