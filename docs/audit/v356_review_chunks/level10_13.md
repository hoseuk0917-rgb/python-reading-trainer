# V356 semantic review — Level 10 chunk 13

Cards 241-260 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY46_L10_crash_recovery_001
- level: 10
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: crash recovery 읽기
- question_type: meaning_choice
- concepts: ["crash_recovery","restart","checkpoint"]
- reading_goal: 프로그램이 죽은 뒤 checkpoint와 output 검증으로 복구하는 흐름을 이해한다.
- code:
```python
on_start:
  load checkpoint
  scan outputs
  validate done markers
  resume pending jobs
```
- question: crash recovery에서 먼저 해야 할 일은?
- answer: checkpoint와 기존 output 상태를 다시 확인한다
- explanation: 시작 시 checkpoint, output, done marker를 입력·code version과 함께 reconcile해 어느 상태가 authoritative한지 정한다. 유효한 hash·schema·count를 가진 완료 output만 보존하고 partial·stale 상태는 격리하거나 idempotent하게 다시 처리한다. checkpoint만 무조건 믿으면 누락이 생길 수 있다.
- project_context: 중간에 끊긴 shard, partial JSONL, 누락된 done marker를 점검하는 루틴이다.

## PY46_L10_final_manifest_001
- level: 10
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: final manifest 읽기
- question_type: meaning_choice
- concepts: ["final_manifest","audit","reproducibility"]
- reading_goal: 최종 산출물 목록과 검증 결과를 manifest로 남기는 이유를 이해한다.
- code:
```python
final_manifest.tsv
output_path	rows	sha256	status	validated_at
```
- question: final manifest가 있으면 좋은 점은?
- answer: 최종 산출물의 경로, row 수, hash와 검증 상태를 재확인한다
- explanation: manifest의 output_path, rows, sha256, status, validated_at은 예상 파일과 record 수, 정확한 byte content, 검증 시점을 확인하는 근거다. hash를 신뢰하려면 어떤 algorithm과 생성 version을 썼는지, manifest 자체의 무결성과 입력 provenance도 관리해야 한다.
- project_context: KG pack, clean text, lesson files, shard outputs를 묶을 때 final manifest가 필요하다.

## PY46_L10_resume_safe_nodepass_001
- level: 10
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: resume-safe node_pass 읽기
- question_type: meaning_choice
- concepts: ["for","node_pass","resume_safe","shard_pipeline"]
- reading_goal: KG node_pass 같은 실제 장시간 작업에 resume-safe 원칙을 적용한다.
- code:
```python
for shard in pending_shards:
    run_node_pass(shard)
    validate_jsonl(shard.output)
    mark_done(shard)
```
- question: resume-safe node_pass에서 mark_done은 언제 해야 하나?
- answer: jsonl 출력 검증이 통과한 뒤
- explanation: run_node_pass가 output을 durable하게 저장하고 validate_jsonl이 schema·count·참조를 통과한 뒤 mark_done을 atomic하게 기록한다. validation 뒤 marker 전 crash가 나면 재실행될 수 있으므로 node pass와 저장은 idempotent해야 한다. 실패 목록과 input/model version도 shard 상태에 연결한다.
- project_context: 노드 추출, 노드 승격, 엣지 승격 파이프라인을 안정화하는 핵심 습관이다.

## PY43_L10_no_answer_fallback_001
- level: 10
- file: python_search_embedding_rag_flow_v43.json
- title: no-answer fallback 읽기
- question_type: meaning_choice
- concepts: ["if","return","fallback","no_answer","retrieval_confidence"]
- reading_goal: 근거가 부족할 때 억지 답변 대신 fallback하는 방식을 이해한다.
- code:
```python
evidence = retrieve(question)
confidence = calibrated_confidence(evidence)
if not evidence or confidence < threshold:
    return '근거가 부족합니다'
answer = generate_answer(question, evidence)
return answer
```
- question: no-answer fallback이 필요한 이유는?
- answer: 근거가 없을 때 환각 답변을 줄이기 위해
- explanation: 근거가 없거나 calibration된 confidence가 기준보다 낮으면 답을 꾸며내지 않고 부족함을 알린다. threshold가 부정확하면 답할 수 있는 질문을 과도하게 거절하거나 근거 없는 답을 허용할 수 있으므로 labeled evaluation으로 조정한다. 가능하면 필요한 추가 정보나 검색 범위도 안내한다.
- project_context: 교육앱이나 KG 질의응답에서 모르면 모른다고 하고 추가 근거를 요청해야 한다.

## PY43_L10_rag_evaluation_001
- level: 10
- file: python_search_embedding_rag_flow_v43.json
- title: RAG evaluation 읽기
- question_type: meaning_choice
- concepts: ["RAG_evaluation","retrieval_eval","answer_eval"]
- reading_goal: RAG 평가는 검색 품질과 답변 품질을 나누어 봐야 함을 이해한다.
- code:
```python
retrieval_eval:
  did we retrieve the right evidence?

answer_eval:
  did the answer use the evidence correctly?
```
- question: RAG 평가를 나누어 보는 이유는?
- answer: 검색이 틀린 문제와 답변 생성이 틀린 문제를 구분하기 위해
- explanation: retrieval 평가와 answer 평가를 나누면 관련 근거를 못 찾은 문제와 찾은 근거를 잘못 사용한 문제를 구분할 수 있다. retrieval에는 recall·context precision, generation에는 faithfulness·answer correctness·citation accuracy 같은 서로 다른 지표와 labeled 질문이 필요하다. 최종 사용자 과업 성공도 별도로 확인한다.
- project_context: 검색 recall, evidence precision, answer faithfulness를 따로 보면 개선 지점이 선명해진다.

## PY43_L10_retrieval_log_001
- level: 10
- file: python_search_embedding_rag_flow_v43.json
- title: retrieval log 읽기
- question_type: meaning_choice
- concepts: ["retrieval_log","debugging","audit"]
- reading_goal: 검색 결과와 점수를 로그로 남기는 이유를 이해한다.
- code:
```python
log = {
  'query': query,
  'top_ids': [r.id for r in results],
  'scores': [r.score for r in results]
}
```
- question: retrieval log가 있으면 좋은 점은?
- answer: 왜 특정 근거가 선택됐는지 나중에 추적할 수 있다
- explanation: query, top_ids, scores는 어떤 후보가 선택됐는지 재현·분석하는 기초다. 같은 결과를 비교하려면 model/index/query-normalization version, filter, top_k와 request ID도 기록해야 한다. query와 문서 내용에는 개인정보가 있을 수 있으므로 최소 수집, 접근 통제, 보존 기간과 redaction 정책을 적용한다.
- project_context: query, top_k, score, doc_id, chunk_id를 남기면 실패 분석과 회귀 테스트가 쉬워진다.

## PY55_L10_advanced_search_quality_gate_001
- level: 10
- file: python_tag_filter_advanced_search_v55.json
- title: advanced search quality gate 읽기
- question_type: meaning_choice
- concepts: ["search_quality","quality_gate","test_case"]
- reading_goal: 고급 검색 기능이 제대로 동작하는지 테스트 케이스로 확인하는 습관을 이해한다.
- code:
```python
assert [c.id for c in search('json', levelMin=8)] == expected_ranked_ids
assert {c.id for c in filterByConcept('validation')} == expected_concept_ids
```
- question: advanced search quality gate의 목적은?
- answer: 검색/필터/정렬이 의도대로 동작하는지 검증하기 위해
- explanation: 단순 truthy assert는 잘못된 card나 순서를 반환해도 통과할 수 있다. 고정 fixture에서 expected ID와 ranking order를 비교하고 empty, Unicode, invalid level, combined filter도 검사한다. Python -O에 의존하지 않도록 test runner를 사용한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L10_filter_pipeline_001
- level: 10
- file: python_tag_filter_advanced_search_v55.json
- title: filter pipeline 읽기
- question_type: meaning_choice
- concepts: ["filter_pipeline","search_architecture","pipeline"]
- reading_goal: 검색어 처리, 필터링, 정렬, 렌더링이 이어지는 filter pipeline을 이해한다.
- code:
```python
normalizeQuery()
filterCards()
rankResults()
renderResults()
```
- question: filter pipeline의 자연스러운 순서는?
- answer: 검색어 정규화 → 카드 필터링 → 관련도 정렬 → 결과 렌더링
- explanation: filter pipeline은 검색어 적용, 태그 필터, level 필터, 정렬을 단계별로 처리하는 흐름이다. 대량 카드 앱에서는 단계 분리가 유지보수에 좋다. 각 단계를 함수로 나누면 검색 조건이 늘어나도 특정 단계만 고쳐 확장할 수 있다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L10_search_index_fields_001
- level: 10
- file: python_tag_filter_advanced_search_v55.json
- title: search index fields 읽기
- question_type: meaning_choice
- concepts: ["search_index","index_fields","performance"]
- reading_goal: 검색 인덱스에 어떤 필드를 넣을지 정하는 방식을 이해한다.
- code:
```python
searchText = [
  card.title,
  card.question,
  card.explanation,
  card.concepts.join(' ')
].join(' ')
```
- question: search index fields에 넣기 좋은 값은?
- answer: title, question, answer, concepts 같은 검색 대상 필드
- explanation: learner-facing search index에는 title, question, explanation, concepts를 모은다. 정답을 아직 풀기 전에 answer를 index와 snippet에 넣으면 quiz spoiler가 될 수 있으므로 일반 검색에서는 제외하고 authoring/admin search에만 별도 포함한다. field 변경 때 index도 재생성한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY47_L10_ci_check_001
- level: 10
- file: python_tests_regression_quality_gate_v47.json
- title: CI check 읽기
- question_type: meaning_choice
- concepts: ["CI","automated_test","remote_validation"]
- reading_goal: Git push 후 원격에서 자동으로 테스트하는 CI 개념을 이해한다.
- code:
```python
on push:
  install dependencies
  run validation.py
  report pass/fail
```
- question: CI check의 핵심은?
- answer: push된 코드에 대해 자동 검증을 실행한다
- explanation: CI check는 원격 저장소에서 자동으로 실행되는 검증 절차다. 사람이 매번 수동으로 실행하지 않아도 같은 기준으로 반복 확인할 수 있다. 커밋이나 PR마다 검증이 자동 실행되면 로컬에서 놓친 회귀를 원격에서 한 번 더 잡을 수 있다. 따라서 정답은 ‘push된 코드에 대해 자동 검증을 실행한다’이다.
- project_context: 향후 GitHub Actions로 lesson JSON 검증을 자동화할 수 있다.

## PY47_L10_quality_gate_before_commit_001
- level: 10
- file: python_tests_regression_quality_gate_v47.json
- title: quality gate before commit 읽기
- question_type: meaning_choice
- concepts: ["if","else","quality_gate","commit_policy","release_safety"]
- reading_goal: 커밋 전 품질 게이트를 통과시키는 작업 규칙을 이해한다.
- code:
```python
if validation_ok and server_200_ok:
    git add ...
    git commit ...
else:
    stop
```
- question: commit 전 quality gate가 중요한 이유는?
- answer: 검증된 변경만 이력에 남기기 위해
- explanation: 이 조건은 validation과 HTTP smoke check가 모두 true일 때만 add·commit을 진행하는 policy를 표현한다. server_200_ok만으로 화면 동작을 보장하지 않고, commit이 곧 배포 안전을 뜻하지도 않는다. relevant test, diff review와 배포 검증을 위험도에 맞게 추가한다.
- project_context: v41~v46은 생성, 검증, 서버 200 확인, 커밋, push 순서로 안정화했다.

## PY47_L10_regression_suite_001
- level: 10
- file: python_tests_regression_quality_gate_v47.json
- title: regression suite 읽기
- question_type: meaning_choice
- concepts: ["regression_suite","test_suite","repeatable_validation"]
- reading_goal: 여러 회귀검증 항목을 묶어 반복 실행하는 regression suite를 이해한다.
- code:
```python
run_suite([
  check_json_loads,
  check_duplicate_ids,
  check_answers,
  check_side_refs
])
```
- question: regression suite의 장점은?
- answer: 여러 검증을 매번 같은 순서로 반복 실행할 수 있다
- explanation: suite로 묶으면 새 버전을 추가할 때마다 같은 기준으로 안정성을 확인할 수 있다. regression suite는 예전에 되던 기능이 다시 깨지지 않았는지 확인하는 테스트 묶음이다. 새 기능을 넣은 뒤 기존 핵심 흐름을 함께 검사해야 한다.
- project_context: 현재 반복 중인 full validation 스크립트를 나중에 tests/validate_lessons.py로 고정할 수 있다.

## PY47_L10_test_report_001
- level: 10
- file: python_tests_regression_quality_gate_v47.json
- title: test report 읽기
- question_type: meaning_choice
- concepts: ["test_report","summary","failure_detail"]
- reading_goal: 검증 결과를 사람이 읽기 좋은 보고서로 남기는 이유를 이해한다.
- code:
```python
TEST REPORT
passed: 6
failed: 1
failure: PY47_x answer not in choices
```
- question: test report에 들어가면 좋은 정보는?
- answer: 통과/실패 개수와 실패 원인
- explanation: test report는 어떤 테스트가 성공했고 무엇이 실패했는지 정리한 결과물이다. 실패 위치와 원인을 빠르게 파악하게 해준다. 단순히 실패했다는 말보다 어떤 입력, 어떤 기대값, 어떤 실제값에서 깨졌는지 적히면 수정이 쉬워진다.
- project_context: MISSING FILES, DUPLICATE IDS, ANSWER NOT IN CHOICES 같은 출력이 test report 역할을 한다.

## PY24_L10_ci_fail_fast_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: CI fail-fast 사고방식 읽기
- question_type: meaning_choice
- concepts: ["ci","fail_fast","quality_gate","automation"]
- reading_goal: 검증 실패 시 배포나 다음 단계로 넘어가지 않게 막는 품질 게이트를 이해한다.
- code:
```python
python scripts/validate_lessons.py
if ($LASTEXITCODE -ne 0) {
  throw "validation failed; stop deploy"
}
```
- question: 0이 아니면 무엇을 의미하는가?
- answer: 직전 명령이 실패했다
- explanation: CI fail fast는 검증 명령이 실패하면 뒤 단계를 멈추는 방식이다. 종료 코드가 0이 아니면 배포나 커밋 후속 작업을 막아 실수를 줄인다. 자동화에서는 실패한 상태로 계속 진행하면 잘못된 결과가 배포될 수 있어 즉시 중단이 중요하다. 따라서 정답은 ‘직전 명령이 실패했다’이다.
- project_context: 나중에 자동 검증 스크립트를 만들 때 품질 게이트로 쓸 수 있다.

## PY24_L10_ci_github_actions_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: GitHub Actions CI YAML 읽기
- question_type: meaning_choice
- concepts: ["github_actions","ci","yaml","test"]
- reading_goal: push할 때 자동으로 검증 명령을 실행하는 CI 설정을 읽는다.
- code:
```python
name: validate
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: python scripts/validate_lessons.py
```
- question: CI workflow에서 on: [push]의 의미는?
- answer: push 이벤트 때 workflow를 실행한다
- explanation: on: [push]는 repository에 push event가 생길 때 workflow를 시작한다. checkout 뒤 setup-python으로 Python을 준비하고 validation script를 실행한다. 재현성을 위해 Python version을 명시하고 action reference 정책을 정하며, script가 실패할 때 nonzero exit code를 반환하는지 확인해야 한다. CI 통과는 이 한 command가 검사한 범위만 보장한다.
- project_context: 카드 수가 많아진 뒤에는 GitHub Actions로 기본 검증을 자동화할 수 있다.

## PY24_L10_commit_after_tests_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: 테스트 후 커밋 루틴 읽기
- question_type: order_choice
- concepts: ["comment","workflow","test","commit","git"]
- reading_goal: 검증 통과 후에만 커밋하는 안전한 작업 순서를 이해한다.
- code:
```python
# 1. run expand script
# 2. validate JSON/card integrity
# 3. run local server smoke test
# 4. git status
# 5. git add / commit / push
```
- question: 가장 안전한 순서에 가까운 것은?
- answer: 검증 → 로컬 확인 → git add/commit/push
- explanation: 먼저 검증하고 로컬에서 200 로딩을 확인한 뒤 안정 상태를 커밋하는 것이 안전하다. 테스트 후 커밋 루틴은 검증을 통과한 상태만 저장소에 남기기 위한 습관이다. 실패한 테스트가 있으면 먼저 원인을 고치고 다시 검증한 뒤 커밋해야 한다.
- project_context: v16~v23에서 반복한 안정 루틴을 카드화한 것이다.

## PY24_L10_lessonfiles_tail_check_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: lessonFiles tail 검사 읽기
- question_type: meaning_choice
- concepts: ["lessonFiles","tail_check","regression","app_js"]
- reading_goal: app.js의 lessonFiles 마지막 항목이 최신 파일인지 확인하는 코드를 읽는다.
- code:
```python
const expected = "python_tests_validation_regression_v24.json";
const connected = lessonFiles.some((path) => path.endsWith("/" + expected));
if (!connected) {
  throw new Error("lesson not connected: " + expected);
}
```
- question: 이 검사가 잡으려는 문제는?
- answer: 기대 lesson file이 app.js loading list에 없는 문제
- explanation: some은 lessonFiles 전체에서 expected filename으로 끝나는 path가 하나라도 있는지 검사한다. 마지막 원소만 검사하면 list 정렬 방식에 불필요하게 의존하고 includes는 비슷한 긴 filename도 통과시킬 수 있다. 더 강한 검사는 실제 file manifest와 loading list의 exact path set을 양방향 비교한다.
- project_context: Select-String으로 APP_DATA_VERSION과 최신 파일명을 확인하던 습관과 연결된다.

## PY24_L10_schema_level_range_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: level 범위 검사 읽기
- question_type: meaning_choice
- concepts: ["if","for","schema","level","range_check","validation"]
- reading_goal: 카드 난이도 level이 허용 범위 안에 있는지 검사하는 코드를 읽는다.
- code:
```python
for card in cards:
    level = card["level"]
    if type(level) is not int or not (1 <= level <= 10):
        raise ValueError(f"bad level: {card['id']}={level!r}")
```
- question: level이 11이면 어떻게 되는가?
- answer: ValueError가 발생한다
- explanation: level이 Python int가 아니거나 1~10 밖이면 ValueError가 난다. 먼저 int(...)로 강제 변환하면 "3" 같은 잘못된 schema type이 조용히 통과하고 bool도 int의 subclass라 단순 isinstance로 통과할 수 있다. type(level) is int를 확인하면 JSON number로 의도한 정수와 범위를 함께 검증할 수 있다.
- project_context: 난이도 필터와 목차 통계가 깨지지 않게 하는 검증이다.

## PY24_L10_server_200_smoke_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: 로컬 서버 200 smoke test 읽기
- question_type: meaning_choice
- concepts: ["for","import","smoke_test","http_status","local_server","requests"]
- reading_goal: 앱 핵심 파일과 새 JSON이 200으로 응답하는지 확인하는 테스트를 읽는다.
- code:
```python
import requests

urls = [
    "http://127.0.0.1:8790/src/pwa/index.html",
    "http://127.0.0.1:8790/data/lessons/python_tests_validation_regression_v24.json",
]
for url in urls:
    r = requests.get(url, timeout=5)
    assert r.status_code == 200, (url, r.status_code)
```
- question: status_code가 404이면 assert는 어떻게 되는가?
- answer: 실패한다
- explanation: 404이면 status_code == 200이 false라 assert가 AssertionError를 낸다. timeout이나 connection error는 requests.get에서 별도 exception이 난다. requests는 redirect를 기본적으로 따라가므로 최종 200이 원래 URL의 기대 file임을 보장하지 않고, body의 JSON·HTML 내용과 version도 확인하지 않는다. 이 검사는 availability의 한 조각이다.
- project_context: 로컬 서버 로그에서 v1~v23 JSON이 200인지 확인하던 과정을 자동화한 형태다.

## PY24_L10_test_report_summary_001
- level: 10
- file: python_tests_validation_regression_v24.json
- title: 실패 로그 요약 코드 읽기
- question_type: meaning_choice
- concepts: ["if","print","test_report","failure_summary","debugging"]
- reading_goal: 검증 실패를 사람이 읽기 좋은 요약으로 모으는 구조를 이해한다.
- code:
```python
failures = []
if duplicates:
    failures.append(f"duplicate ids: {len(duplicates)}")
if bad_answers:
    failures.append(f"bad answers: {len(bad_answers)}")
if missing_side:
    failures.append(f"missing side cards: {len(missing_side)}")

if failures:
    print("FAIL: " + ", ".join(failures))
    raise SystemExit(1)
print("OK")
```
- question: failures가 비어 있으면 출력은?
- answer: OK
- explanation: failures가 비어 있으면 if를 건너뛰고 OK를 출력한다. 하나라도 있으면 요약을 출력하고 exit code 1로 종료한다. 원래처럼 FAIL text만 출력하고 정상 종료하면 CI가 성공으로 오해할 수 있으므로 machine-readable 실패 신호가 필요하다.
- project_context: 현재 PowerShell 검증 로그를 더 자동화된 리포트로 만들 때 쓰기 좋다.
