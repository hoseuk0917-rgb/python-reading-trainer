# V356 semantic review — Level 8 chunk 15

Cards 281-300 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY46_L08_validate_before_done_001
- level: 8
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: validate before mark done 읽기
- question_type: meaning_choice
- concepts: ["validation","done_marker","quality_gate"]
- reading_goal: 완료 표시 전에 결과를 검증해야 하는 이유를 이해한다.
- code:
```python
run_job()
validate_output()
write_done_marker()
```
- question: done marker를 언제 써야 가장 안전한가?
- answer: 출력 검증이 통과한 뒤
- explanation: run_job의 output을 완전히 기록·닫고 validation을 통과한 뒤 done marker를 atomic하게 publish한다. validation 범위가 schema와 예상 count·hash를 포함하는지도 확인한다. output과 marker가 다른 storage에 있으면 둘 사이 crash를 reconcile하는 복구 절차가 필요하다.
- project_context: lesson 카드 확장에서도 JSON 생성 후 중복 ID, answer, side_card 참조를 검증한 뒤 커밋했다.

## PY43_L08_chunking_for_search_001
- level: 8
- file: python_search_embedding_rag_flow_v43.json
- title: chunking for search 읽기
- question_type: meaning_choice
- concepts: ["chunking","retrieval_unit","context_window"]
- reading_goal: 문서를 검색하기 좋은 작은 단위로 나누는 chunking을 이해한다.
- code:
```python
document
  -> chunk_001
  -> chunk_002
  -> chunk_003
```
- question: RAG에서 chunk를 만드는 이유는?
- answer: 긴 문서를 검색과 context 투입에 맞는 작은 단위로 나누기 위해
- explanation: 긴 document를 chunk로 나누면 관련 부분을 작은 retrieval·context 단위로 찾을 수 있다. 너무 크면 여러 주제가 섞여 signal과 token 예산이 희석되고, 너무 작으면 필요한 문맥이 끊긴다. 문장·section 경계, overlap, 제목, source·offset provenance를 함께 보존하고 실제 retrieval 평가로 크기를 정한다.
- project_context: PDF-derived text, clean text, root docs를 KG/RAG에 넣기 전 chunk 품질이 중요하다.

## PY43_L08_hybrid_search_001
- level: 8
- file: python_search_embedding_rag_flow_v43.json
- title: hybrid search 읽기
- question_type: meaning_choice
- concepts: ["hybrid_search","keyword_search","vector_search"]
- reading_goal: 키워드 검색과 벡터 검색을 함께 쓰는 이유를 이해한다.
- code:
```python
keyword_hits = keyword_search(query)
vector_hits = vector_search(query)
candidates = deduplicate_and_fuse(keyword_hits, vector_hits)
```
- question: hybrid search의 장점은?
- answer: 정확한 단어 매칭과 의미 기반 검색을 함께 활용할 수 있다
- explanation: hybrid search는 정확한 용어에 강한 keyword 결과와 표현 변화에 강한 vector 결과를 결합한다. 두 목록을 단순 연결하면 중복과 서로 다른 score scale 문제가 생길 수 있으므로 RRF, score normalization, learned ranker 같은 fusion 규칙과 dedup key를 명시해야 한다.
- project_context: 표준명, doc_id, 기술용어는 키워드로 잡고 설명형 질문은 벡터 검색으로 보완할 수 있다.

## PY43_L08_index_build_query_time_001
- level: 8
- file: python_search_embedding_rag_flow_v43.json
- title: index build vs query time 읽기
- question_type: meaning_choice
- concepts: ["index_build","query_time","precompute"]
- reading_goal: 미리 만드는 인덱스와 질문 시 실행하는 검색을 구분한다.
- code:
```python
offline:
  build embeddings index

online:
  search index for user query
```
- question: embedding index를 미리 만들어두는 이유는?
- answer: 질문이 올 때마다 전체 문서를 다시 임베딩하지 않기 위해
- explanation: 문서 embedding을 offline에 계산해 index에 저장하면 query 때는 질문만 encode하고 기존 vector를 검색하면 된다. 문서 내용, chunking, embedding model 또는 normalization version이 바뀌면 해당 vector와 index를 갱신해야 한다. query와 document가 같은 호환 embedding 공간을 사용해야 한다.
- project_context: KG 노드/문서 chunk가 커질수록 offline index build와 online retrieval을 분리해야 한다.

## PY43_L08_similarity_score_001
- level: 8
- file: python_search_embedding_rag_flow_v43.json
- title: similarity score 읽기
- question_type: meaning_choice
- concepts: ["if","similarity_score","cosine_similarity","ranking"]
- reading_goal: 검색 후보가 질문과 얼마나 가까운지 점수로 비교하는 방식을 이해한다.
- code:
```python
score = cosine_similarity(query_vector, chunk_vector)
if score > 0.75:
    keep(chunk)
```
- question: similarity score가 높다는 뜻은?
- answer: 질문과 chunk의 의미가 더 가깝다고 판단된다는 뜻
- explanation: 이 code에서는 cosine score가 0.75보다 큰 chunk만 남기므로, 같은 embedding model과 전처리 안에서는 더 높은 값이 query 방향과 더 비슷함을 뜻한다. threshold의 의미와 score 분포는 model·domain마다 달라 0.75를 보편 기준으로 쓸 수 없다. 높은 similarity도 관련 사실이나 정답성을 보장하지 않는다.
- project_context: simindex, semanticTop, embedding 검색 결과를 해석할 때 점수의 의미를 구분해야 한다.

## PY55_L08_advanced_search_001
- level: 8
- file: python_tag_filter_advanced_search_v55.json
- title: advanced search 읽기
- question_type: meaning_choice
- concepts: ["advanced_search","query","search_ux"]
- reading_goal: 단순 문자열 검색보다 조건을 더 세밀하게 지정하는 advanced search를 이해한다.
- code:
```python
query = {
  text: 'json',
  concept: 'validation',
  levelRange: [7, 10]
}
```
- question: advanced search의 목적은?
- answer: 검색 조건을 더 세밀하게 지정하기 위해
- explanation: advanced search는 제목뿐 아니라 개념, level, 태그, 설명까지 함께 찾는 검색 기능이다. 카드가 많아질수록 단순 제목 검색만으로는 부족하다. 검색 범위를 넓히되 필드별 가중치를 두면 관련 없는 결과가 너무 많이 나오는 일을 줄일 수 있다. 따라서 정답은 ‘검색 조건을 더 세밀하게 지정하기 위해’이다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L08_search_highlight_001
- level: 8
- file: python_tag_filter_advanced_search_v55.json
- title: search highlight 읽기
- question_type: meaning_choice
- concepts: ["search_highlight","result_ui","UX"]
- reading_goal: 검색어가 카드 어디에 걸렸는지 표시하는 search highlight를 이해한다.
- code:
```python
highlight(card.title, query)
```
- question: search highlight의 목적은?
- answer: 검색어가 결과에서 어디에 매칭됐는지 보여주기 위해
- explanation: highlight는 일치 구간을 보여 결과 이유를 이해하게 한다. query를 HTML string에 직접 삽입하면 XSS나 markup 손상이 생길 수 있으므로 text node와 안전한 range를 사용하고, 대소문자·Unicode normalization을 ranking과 같게 맞춘다. 색만이 아니라 mark 의미와 contrast도 제공한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L08_search_ranking_001
- level: 8
- file: python_tag_filter_advanced_search_v55.json
- title: search ranking 읽기
- question_type: meaning_choice
- concepts: ["return","search_ranking","relevance","search"]
- reading_goal: 검색 결과에 관련도 점수를 매겨 순서를 정하는 search ranking을 이해한다.
- code:
```python
function scoreCard(card, query) {
  return titleMatch(card, query) * 3
       + conceptMatch(card, query) * 2
       + bodyMatch(card, query);
}
results.sort((a, b) => scoreCard(b, query) - scoreCard(a, query));
```
- question: search ranking의 핵심은?
- answer: 검색어와 더 관련 높은 카드를 위에 보여주는 것
- explanation: 각 card와 query의 title, concept, body match를 계산해 weighted score로 내림차순 정렬한다. 3·2·1은 예시 weight이며 field 길이와 match 빈도를 normalize하지 않으면 긴 본문이 유리할 수 있다. labeled query와 click·학습 outcome으로 ranking을 평가한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY55_L08_sort_order_001
- level: 8
- file: python_tag_filter_advanced_search_v55.json
- title: sort order 읽기
- question_type: meaning_choice
- concepts: ["sort_order","sorting","UX"]
- reading_goal: 카드 결과를 최신순, 난이도순, 관련도순으로 정렬하는 sort order를 이해한다.
- code:
```python
const sortedCards = [...cards].sort((a, b) =>
  (Number(b.level) || 0) - (Number(a.level) || 0)
);
```
- question: sort order의 역할은?
- answer: 검색 결과를 사용자가 원하는 기준으로 정렬한다
- explanation: 원본 cards를 mutate하지 않도록 copy를 만든 뒤 numeric level 내림차순으로 정렬한다. missing·invalid level은 여기서 0 fallback하지만 data validation에서 별도 보고하는 편이 좋다. 같은 level의 tie-break가 필요하면 stable한 id나 relevance 규칙을 명시한다.
- project_context: 감사 v2에서 TAG_FILTER_ADVANCED_SEARCH가 0 hits였으므로, v55는 대량 카드 학습앱에서 원하는 카드를 빠르게 찾는 검색/필터 UX를 보강한다.

## PY47_L08_edge_case_001
- level: 8
- file: python_tests_regression_quality_gate_v47.json
- title: edge case 읽기
- question_type: meaning_choice
- concepts: ["edge_case","boundary_condition","robustness"]
- reading_goal: 평범하지 않은 경계 상황을 따로 테스트해야 하는 이유를 이해한다.
- code:
```python
cases = [
  empty_file,
  duplicate_id,
  missing_answer,
  broken_json
]
```
- question: edge case의 예시는?
- answer: 빈 파일, 중복 ID, 깨진 JSON 같은 경계 상황
- explanation: edge case는 비어 있는 값, 경계 숫자, 특수 문자처럼 놓치기 쉬운 입력 상황이다. 실제 운영에서는 정상 입력만 오지 않으므로 따로 테스트해야 한다. edge case를 미리 넣어 두면 평소에는 잘 보이지 않는 오류를 배포 전에 잡을 수 있다.
- project_context: lesson JSON 검증에서는 빈 concepts, answer not in choices, missing side refs가 edge case다.

## PY47_L08_expected_actual_001
- level: 8
- file: python_tests_regression_quality_gate_v47.json
- title: expected vs actual 읽기
- question_type: meaning_choice
- concepts: ["expected","actual","assertion"]
- reading_goal: 테스트에서 기대값과 실제값을 비교하는 기본 구조를 이해한다.
- code:
```python
expected = 923
actual = len(lesson_cards)
assert actual == expected
```
- question: expected와 actual을 비교하는 이유는?
- answer: 실제 결과가 기대한 결과와 같은지 확인하기 위해
- explanation: expected/actual 비교는 테스트의 기본 구조다. 기대한 값과 실제 나온 값을 나란히 비교하면 어디에서 결과가 어긋났는지 빠르게 찾을 수 있다. 차이가 났을 때 expected가 틀렸는지 actual 로직이 틀렸는지 다시 확인해야 한다.
- project_context: v42/v44처럼 expected count가 틀리면 실제 데이터가 정상이어도 검증 실패처럼 보일 수 있다.

## PY47_L08_snapshot_test_001
- level: 8
- file: python_tests_regression_quality_gate_v47.json
- title: snapshot test 읽기
- question_type: meaning_choice
- concepts: ["snapshot_test","ui_state","output_change"]
- reading_goal: 현재 출력 상태를 snapshot으로 저장해 이후 변경을 감지하는 테스트를 이해한다.
- code:
```python
snapshot = render_card(card)
compare_with_saved_snapshot(snapshot)
```
- question: snapshot test가 유용한 경우는?
- answer: 출력 모양이나 구조가 갑자기 바뀌었는지 보고 싶을 때
- explanation: snapshot test는 이전에 검토한 rendering이나 구조 output과 새 결과를 비교해 예상 밖 변화를 찾는다. 큰 snapshot을 생각 없이 갱신하면 bug도 승인될 수 있으므로 작은 의미 단위의 diff를 검토하고, 접근성·동작은 별도 assertion으로 검사한다.
- project_context: PWA 카드 화면이나 JSON 카드 구조가 바뀌었는지 확인하는 데 쓸 수 있다.

## PY47_L08_test_fixture_001
- level: 8
- file: python_tests_regression_quality_gate_v47.json
- title: test fixture 읽기
- question_type: meaning_choice
- concepts: ["test_fixture","sample_data","repeatable_test"]
- reading_goal: 테스트에 쓰는 고정 샘플 데이터인 fixture를 이해한다.
- code:
```python
fixture_card = {
  'id': 'TEST_001',
  'answer': 'A',
  'choices': ['A', 'B']
}
```
- question: test fixture의 역할은?
- answer: 반복 가능한 테스트용 입력 데이터를 제공한다
- explanation: fixture_card는 이 코드만 보면 반복 가능한 sample input이다. 넓은 의미의 test fixture라고 할 수 있지만 pytest fixture라면 보통 @pytest.fixture로 등록하고 test에 주입한다. 공통 data를 공유할 때 test 간 mutation이 새어 나오지 않도록 매번 새 객체를 만들거나 복사한다.
- project_context: 정상 카드, answer 누락 카드, side_card 참조 오류 카드 같은 샘플을 만들어 검증기를 테스트할 수 있다.

## PY24_L08_answer_in_choices_001
- level: 8
- file: python_tests_validation_regression_v24.json
- title: 정답이 choices 안에 있는지 검사
- question_type: meaning_choice
- concepts: ["if","for","validation","answer","choices","quality"]
- reading_goal: 객관식 카드의 answer가 choices 안에 실제로 있는지 확인하는 코드를 읽는다.
- code:
```python
bad = []
for card in cards:
    if card["answer"] not in card["choices"]:
        bad.append(card["id"])
```
- question: bad에 들어간 카드의 문제는?
- answer: 정답이 선택지 안에 없다
- explanation: 앱에서 정답 버튼을 고르게 하려면 answer 값이 choices 안에 있어야 한다. 정답이 choices 안에 있는지 검사하는 코드는 객관식 카드의 기본 무결성을 확인한다. 정답 문자열과 선택지 문자열이 정확히 같은지 비교해야 한다.
- project_context: ANSWER NOT IN CHOICES: OK 검증 항목과 직접 연결된다.

## PY24_L08_missing_side_card_check_001
- level: 8
- file: python_tests_validation_regression_v24.json
- title: 누락 side_card 참조 검사
- question_type: meaning_choice
- concepts: ["if","for","validation","side_card","reference","integrity"]
- reading_goal: 카드가 참조하는 side_card_id가 실제 side card 목록에 있는지 확인한다.
- code:
```python
side_ids = {side["id"] for side in side_cards}
missing = []
for card in cards:
    for sid in card.get("side_card_ids", []):
        if sid not in side_ids:
            missing.append((card["id"], sid))
```
- question: missing에 들어가는 것은?
- answer: 존재하지 않는 side_card_id 참조
- explanation: 카드가 없는 side card를 가리키면 오른쪽 보조 설명 렌더링에서 문제가 생길 수 있다. 누락 side_card 참조 검사는 lesson이 연결한 side card가 실제 데이터에 있는지 확인한다. 없는 id가 있으면 관련 읽을거리 표시가 깨질 수 있다. 따라서 정답은 ‘존재하지 않는 side_card_id 참조’이다.
- project_context: MISSING SIDE CARD REFERENCES: OK 검증 항목과 연결된다.

## PY24_L08_schema_required_fields_001
- level: 8
- file: python_tests_validation_regression_v24.json
- title: 필수 필드 schema 검사 읽기
- question_type: meaning_choice
- concepts: ["if","for","print","schema","required_fields","validation"]
- reading_goal: 카드 JSON에 필수 필드가 모두 있는지 확인하는 코드를 읽는다.
- code:
```python
required = {"id", "level", "title", "question", "choices", "answer"}
for card in cards:
    missing = required - set(card.keys())
    if missing:
        print(card.get("id"), missing)
```
- question: required - set(card.keys())는 무엇을 찾는가?
- answer: 카드에 없는 필수 필드
- explanation: required와 card.keys()의 set difference는 필수 이름 중 dictionary key로 존재하지 않는 항목을 찾는다. missing이 있으면 id와 missing set을 출력한다. 이 검사는 key 존재만 확인하므로 value가 None이나 빈 문자열인지, level과 choices type이 맞는지, 추가 field가 허용되는지는 별도 schema validation이 필요하다.
- project_context: 카드가 많아질수록 schema 검증을 자동화해야 한다.

## PY34_L08_expected_output_001
- level: 8
- file: python_tests_validation_regression_v34.json
- title: expected output 읽기
- question_type: meaning_choice
- concepts: ["expected_output","test","assert"]
- reading_goal: 입력에 대해 기대하는 결과를 명확히 적는 테스트 방식을 이해한다.
- code:
```python
result = filter_by_level(cards, 1)
expected = ["c1", "c3"]

assert [c["id"] for c in result] == expected
```
- question: expected는 무엇인가?
- answer: 테스트가 기대하는 정답 결과
- explanation: expected output은 테스트에서 기대하는 정답 결과다. 실제 결과와 기대 결과를 비교하면 함수가 의도대로 동작하는지 확인할 수 있다. 테스트에서는 expected와 actual을 나란히 비교해야 어떤 부분이 달라졌는지 빠르게 알 수 있다.
- project_context: 오늘 큐 추천 결과가 의도한 순서인지 확인할 때 쓸 수 있다.

## PY34_L08_fixture_001
- level: 8
- file: python_tests_validation_regression_v34.json
- title: 테스트 데이터와 fixture 구분
- question_type: meaning_choice
- concepts: ["fixture","test_data","sample"]
- reading_goal: 일반 예시 데이터와 테스트 프레임워크가 제공하는 fixture를 구분한다.
- code:
```python
sample_cards = [
    {"id": "c1", "level": 1},
    {"id": "c2", "level": 2},
]
```
- question: sample_cards의 테스트 관점 역할은?
- answer: 테스트용 예시 데이터
- explanation: sample_cards는 이 코드만 보면 테스트에 사용할 예시 데이터다. 넓은 뜻으로 준비 데이터라고 부를 수 있지만, pytest의 fixture라고 하려면 보통 @pytest.fixture로 등록해 테스트 함수에 주입하는 구조가 보여야 한다. fixture는 데이터뿐 아니라 준비와 정리 과정도 제공할 수 있다.
- project_context: 카드 필터, 추천 큐, 검증 함수를 작은 예시 데이터로 테스트할 때 필요하다.

## PY34_L08_unit_test_001
- level: 8
- file: python_tests_validation_regression_v34.json
- title: unit test 읽기
- question_type: meaning_choice
- concepts: ["def","return","unit_test","function","assert"]
- reading_goal: 작은 함수 하나를 독립적으로 검사하는 unit test를 이해한다.
- code:
```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
```
- question: assert add(2, 3) == 5의 의미는?
- answer: add 함수 결과가 5인지 검사한다
- explanation: unit test는 작은 함수나 로직 하나를 다른 요소와 가능한 한 분리해 검사한다. 이 pytest 스타일 테스트에서 assert 조건이 거짓이면 테스트가 실패한다. Python을 -O로 직접 실행하면 일반 assert가 제거될 수 있으므로 테스트는 pytest 같은 테스트 실행기로 수행해야 한다.
- project_context: filterCards나 makeTodayQueue 같은 작은 함수를 분리하면 unit test하기 쉬워진다.

## PY56_L08_auto_save_note_001
- level: 8
- file: python_user_notes_bookmarks_v56.json
- title: auto save note 읽기
- question_type: meaning_choice
- concepts: ["auto_save","debounce","user_note"]
- reading_goal: 메모 입력 후 자동 저장하되 너무 자주 저장하지 않는 흐름을 이해한다.
- code:
```python
debouncedSaveNote(card.id, textarea.value)
```
- question: auto save note에 debounce가 유용한 이유는?
- answer: 입력할 때마다 너무 자주 저장하는 일을 줄이기 위해
- explanation: debounce는 입력이 잠시 멈춘 뒤 저장해 write 횟수를 줄인다. 이미 진행 중인 async save의 순서, tab 종료 전 pending change와 실패를 처리하고 저장 중·저장됨·실패 상태를 보여야 한다. debounce만으로 data loss가 방지되지는 않는다.
- project_context: 감사 v2에서 USER_NOTES_BOOKMARKS 축이 거의 비어 있었으므로, v56은 사용자가 중요한 카드와 자기 메모를 남겨 개인화 복습에 활용하는 기능을 보강한다.
