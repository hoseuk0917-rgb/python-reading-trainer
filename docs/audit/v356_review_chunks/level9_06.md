# V356 semantic review — Level 9 chunk 6

Cards 101-120 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY57_L09_source_tier_001
- level: 9
- file: python_data_governance_copyright_v57.json
- title: source tier 읽기
- question_type: meaning_choice
- concepts: ["source_tier","trust","data_quality"]
- reading_goal: 자료 출처를 신뢰도나 사용 가능성 기준으로 등급화하는 source tier를 이해한다.
- code:
```python
source.tier = 'official_public'
source.qualityReview = 'pending'
```
- question: source tier를 두는 이유는?
- answer: 출처의 신뢰도와 활용 우선순위를 구분하기 위해
- explanation: official_public은 publisher 유형을 나타낼 수 있지만 개별 data가 정확하고 모든 재사용 권리가 있다는 뜻은 아니다. 신뢰성, 최신성, completeness, bias와 license를 별도 dimension으로 평가하고 review evidence를 남긴다. source tier 하나로 자동 high quality 판정을 하지 않는다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY42_L09_dedup_001
- level: 9
- file: python_data_processing_pandas_jsonl_v42.json
- title: dedup 읽기
- question_type: meaning_choice
- concepts: ["dedup","drop_duplicates","unique_key"]
- reading_goal: 중복 행을 기준 컬럼으로 제거하는 방식을 이해한다.
- code:
```python
df = df.drop_duplicates(subset=['id'])
```
- question: subset=['id']의 의미는?
- answer: id 컬럼이 같은 행을 중복으로 본다
- explanation: drop_duplicates(subset=['id'])는 id가 같은 행을 한 중복 그룹으로 보고 기본적으로 첫 행을 남긴다. 다른 column 값이 충돌해도 조용히 하나가 제거될 수 있고 missing id들도 중복 취급될 수 있으므로, 삭제 전 중복 그룹을 조사하고 고유 ID 누락을 먼저 검증해야 한다.
- project_context: 노드 후보, 문서 후보, 카드 ID 중복 제거에서 핵심 패턴이다.

## PY42_L09_groupby_001
- level: 9
- file: python_data_processing_pandas_jsonl_v42.json
- title: groupby 읽기
- question_type: meaning_choice
- concepts: ["groupby","aggregation","count"]
- reading_goal: 특정 컬럼별로 묶어서 개수를 세는 패턴을 이해한다.
- code:
```python
summary = df.groupby('status').size().reset_index(name='count')
```
- question: groupby('status').size()는 무엇에 가까운가?
- answer: status 값별 행 개수를 센다
- explanation: groupby('status').size()는 같은 non-missing status 값의 row를 묶어 각 그룹 크기를 센다. pandas는 기본적으로 NaN status 그룹을 제외하므로 누락도 보고 싶으면 dropna=False를 사용하거나 별도 집계한다. reset_index(name='count')는 결과를 status와 count column의 DataFrame으로 만든다.
- project_context: PASS/FAIL, accept/reject, error type 분포를 볼 때 바로 쓰인다.

## PY42_L09_merge_join_001
- level: 9
- file: python_data_processing_pandas_jsonl_v42.json
- title: merge / join 읽기
- question_type: meaning_choice
- concepts: ["merge","join","key"]
- reading_goal: 두 표를 공통 key 기준으로 합치는 merge를 이해한다.
- code:
```python
merged = nodes.merge(edges, left_on='node_id', right_on='to_node_id', how='left')
```
- question: merge에서 key가 중요한 이유는?
- answer: 어떤 행끼리 연결할지 정하기 때문이다
- explanation: left_on과 right_on은 어떤 key 값끼리 행을 연결할지 정한다. left join은 모든 nodes 행을 보존하지만 edges 쪽에 같은 key가 여러 개면 결과 row 수가 늘고, match가 없으면 오른쪽 값이 missing이 된다. validate 옵션, key uniqueness, 행 수와 unmatched 비율을 함께 점검해야 잘못된 many-to-many 결합을 잡을 수 있다.
- project_context: node_id, doc_id, chunk_id, card_id 기준으로 파일을 연결할 때 중요하다.

## PY42_L09_sort_filter_001
- level: 9
- file: python_data_processing_pandas_jsonl_v42.json
- title: sort / filter 읽기
- question_type: meaning_choice
- concepts: ["sort_values","filter","boolean_mask"]
- reading_goal: 조건으로 행을 걸러내고 정렬하는 기본 분석 패턴을 읽는다.
- code:
```python
failed = df[df['status'] == 'FAIL']
failed = failed.sort_values('score')
```
- question: df[df['status'] == 'FAIL']의 의미는?
- answer: status가 FAIL인 행만 고른다
- explanation: sort/filter는 데이터를 정렬하고 조건에 맞는 행만 남기는 기본 처리다. boolean mask는 pandas에서 조건 필터를 만들 때 자주 쓰는 패턴이다. 따라서 정답은 ‘status가 FAIL인 행만 고른다’이다.
- project_context: 검증 실패 카드, 실패 shard, 낮은 점수 후보를 빠르게 찾는 데 쓴다.

## PY29_L09_counter_001
- level: 9
- file: python_data_structures_json_v29.json
- title: Counter로 개수 세기
- question_type: meaning_choice
- concepts: ["import","print","Counter","collections","count","concepts"]
- reading_goal: 여러 카드의 개념 태그가 몇 번 등장했는지 세는 코드를 읽는다.
- code:
```python
from collections import Counter

concepts = ["json", "dict", "json", "list"]
counts = Counter(concepts)

print(counts["json"])
```
- question: 출력되는 값은?
- answer: 2
- explanation: Counter는 리스트 안의 값이 몇 번 나왔는지 세는 도구다. json이 리스트에 두 번 등장하면 Counter 결과에서 json의 개수는 2가 된다. Counter를 쓰면 직접 dict에 누적하는 코드보다 짧고 실수 가능성이 낮다.
- project_context: 개념별 카드 분포, 약한 주제 찾기, 보강 우선순위 계산에 쓸 수 있다.

## PY29_L09_group_by_level_001
- level: 9
- file: python_data_structures_json_v29.json
- title: level별 group by 읽기
- question_type: meaning_choice
- concepts: ["for","print","group_by","dict","level","aggregation"]
- reading_goal: 카드를 level별로 묶어 집계하는 코드를 이해한다.
- code:
```python
by_level = {}

for card in cards:
    level = card["level"]
    by_level.setdefault(level, []).append(card)

print(len(by_level[1]))
```
- question: setdefault(level, [])의 역할은?
- answer: level 키가 없으면 빈 리스트를 만들고 그 리스트를 반환한다
- explanation: setdefault는 그룹을 만들 때 자주 쓰는 패턴이다. 키가 없으면 기본값을 넣어준다. level별 group by는 항목들을 난이도나 단계 기준으로 묶는 처리다. dict에 level을 key로 두고 목록을 value로 쌓는 흐름을 보면 된다.
- project_context: 진행현황에서 레벨별 카드 수/본 카드/맞힌 카드를 집계하는 사고방식이다.

## PY29_L09_schema_required_fields_001
- level: 9
- file: python_data_structures_json_v29.json
- title: required fields 검증 읽기
- question_type: meaning_choice
- concepts: ["if","for","print","schema","validation","required_fields"]
- reading_goal: 각 카드에 필수 필드가 있는지 검사하는 코드를 읽는다.
- code:
```python
required = ["id", "level", "title", "question", "choices", "answer"]

missing = []
for field in required:
    if field not in card:
        missing.append(field)

print(missing)
```
- question: missing 리스트에는 무엇이 들어가는가?
- answer: card에 없는 필수 필드 이름
- explanation: required 순서대로 key 존재를 검사해 card에 없는 field name을 missing에 넣는다. key가 있어도 value가 None·empty이거나 잘못된 type인 경우는 잡지 않는다. 완전한 schema 검사에는 choices list type, level range, answer membership과 duplicate ID 같은 field 간 rule도 필요하다.
- project_context: v24 검증 카드와 실제 lesson JSON 검증 루틴에 직접 연결된다.

## PY29_L09_sort_key_001
- level: 9
- file: python_data_structures_json_v29.json
- title: sort key 읽기
- question_type: meaning_choice
- concepts: ["print","sort","key","lambda","level"]
- reading_goal: dict 리스트를 특정 필드 기준으로 정렬하는 코드를 읽는다.
- code:
```python
cards = [
    {"id": "c2", "level": 3},
    {"id": "c1", "level": 1},
    {"id": "c3", "level": 2},
]

cards.sort(key=lambda card: card["level"])
print(cards[0]["id"])
```
- question: 출력되는 id는?
- answer: c1
- explanation: sort key는 정렬할 때 어떤 값을 기준으로 볼지 정하는 함수다. level 값을 key로 쓰면 level이 작은 카드가 앞에 오게 된다. 정렬 기준 함수가 무엇을 반환하는지 보면 어떤 항목이 앞에 올지 예측할 수 있다. 따라서 출력은 ‘c1’이다.
- project_context: 추천 큐나 복습 큐에서 낮은 레벨/우선순위를 먼저 배치할 때 쓰인다.

## PY21_L09_foreign_key_001
- level: 9
- file: python_database_sql_repository_v21.json
- title: FOREIGN KEY 관계 읽기
- question_type: meaning_choice
- concepts: ["foreign_key","relationship","schema","sql"]
- reading_goal: 한 테이블의 값이 다른 테이블의 id를 참조하는 구조를 읽는다.
- code:
```python
CREATE TABLE curations (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```
- question: FOREIGN KEY (item_id) REFERENCES items(id)의 의미는?
- answer: curations.item_id가 items.id를 참조한다
- explanation: 이 FOREIGN KEY는 curations.item_id가 items.id를 참조한다는 관계를 선언한다. 부모에 없는 id를 막거나 delete 동작을 제어하려면 database가 외래키 제약을 실제로 활성화하고 있어야 한다. SQLite는 connection마다 PRAGMA foreign_keys = ON 설정을 확인해야 하며, 기존 orphan data와 ON DELETE 정책도 별도로 점검한다.
- project_context: curations가 존재하지 않는 item을 가리키는 orphan 문제를 막는 개념이다.

## PY21_L09_index_001
- level: 9
- file: python_database_sql_repository_v21.json
- title: CREATE INDEX 읽기
- question_type: meaning_choice
- concepts: ["index","query_performance","sql"]
- reading_goal: 조회가 자주 걸리는 컬럼에 index를 만드는 이유를 이해한다.
- code:
```python
CREATE INDEX IF NOT EXISTS idx_items_source
ON items(source_url);
```
- question: 이 index의 목적에 가장 가까운 것은?
- answer: source_url 조건 검색을 빠르게 하기 위해
- explanation: index는 특정 컬럼 조건으로 데이터를 더 빠르게 찾기 위한 보조 구조다. 조회는 빨라질 수 있지만 쓰기 비용과 저장 공간이 늘 수 있다. 인덱스는 책의 찾아보기처럼 위치를 빨리 찾게 하지만 데이터가 바뀔 때 인덱스도 함께 갱신해야 한다.
- project_context: 중복 URL 검사, claim hash 조회, 날짜별 조회 성능과 연결된다.

## PY21_L09_join_001
- level: 9
- file: python_database_sql_repository_v21.json
- title: JOIN 쿼리 읽기
- question_type: meaning_choice
- concepts: ["join","sql","relationship","select"]
- reading_goal: 두 테이블을 연결해 필요한 필드를 함께 가져오는 SQL을 읽는다.
- code:
```python
SELECT c.position, i.title, i.source_url
FROM curations c
JOIN items i ON c.item_id = i.id
WHERE c.page = 'home'
ORDER BY c.position;
```
- question: JOIN items i ON c.item_id = i.id의 역할은?
- answer: curations와 items를 item_id/id 기준으로 연결한다
- explanation: JOIN은 관련된 여러 테이블의 행을 연결해 함께 조회하는 SQL 기능이다. 사용자 정보와 주문 정보처럼 나뉜 데이터를 한 결과로 볼 수 있다. ON 조건은 두 테이블의 어떤 컬럼을 맞춰 연결할지 정하므로 결과 행의 의미를 좌우한다. 따라서 정답은 ‘curations와 items를 item_id/id 기준으로 연결한다’이다.
- project_context: 홈 큐레이션 API에서 카드와 원문 item 정보를 함께 가져올 때 쓰는 구조다.

## PY21_L09_upsert_001
- level: 9
- file: python_database_sql_repository_v21.json
- title: UPSERT 읽기
- question_type: meaning_choice
- concepts: ["upsert","insert","update","conflict"]
- reading_goal: 이미 있으면 갱신하고 없으면 삽입하는 SQL 패턴을 읽는다.
- code:
```python
INSERT INTO items(id, title, source_url)
VALUES (?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  source_url = excluded.source_url;
```
- question: ON CONFLICT(id) DO UPDATE의 의미는?
- answer: 같은 id가 이미 있으면 UPDATE한다
- explanation: upsert는 insert와 update를 합친 운용 패턴이다. 새 행이면 추가하고, 이미 있으면 기존 행을 갱신하는 흐름에 쓴다. ON CONFLICT(id)는 id가 이미 있을 때 충돌로 보고, 그 경우 DO UPDATE 쪽 로직을 실행한다는 뜻이다.
- project_context: 수집 item이나 source 메타를 반복 적재할 때 중복을 안정적으로 처리한다.

## PY37_L09_delete_001
- level: 9
- file: python_database_storage_crud_v37.json
- title: DELETE 읽기
- question_type: meaning_choice
- concepts: ["DELETE","SQL","remove"]
- reading_goal: 조건에 맞는 row를 삭제하는 DELETE 문을 이해한다.
- code:
```python
DELETE FROM wrong_answers
WHERE created_at < '2026-01-01';
```
- question: 이 SQL은 무엇을 삭제하는가?
- answer: 2026-01-01보다 오래된 오답 기록
- explanation: 이 조건은 created_at이 비교 가능한 ISO 날짜·시간 형식으로 일관되게 저장되어 있다는 전제에서 2026-01-01 이전 행을 삭제한다. DELETE 전 같은 WHERE로 SELECT해 대상을 확인하고, transaction·backup·보존 정책을 갖춰야 한다. WHERE가 없으면 테이블의 모든 행이 대상이 된다.
- project_context: 오래된 임시 기록이나 캐시성 데이터를 정리할 때 필요하다.

## PY37_L09_index_001
- level: 9
- file: python_database_storage_crud_v37.json
- title: index 읽기
- question_type: meaning_choice
- concepts: ["index","query_performance","database"]
- reading_goal: 자주 찾는 column에 index를 두는 이유를 이해한다.
- code:
```python
CREATE INDEX idx_progress_user
ON progress(user_id);
```
- question: 이 index의 목적은?
- answer: user_id로 progress를 더 빨리 찾기 위해
- explanation: 이 index는 user_id 값으로 정렬된 보조 구조를 만들어 해당 조건 조회의 전체 table scan을 줄일 가능성이 있다. 실제 사용 여부와 속도는 데이터 분포와 query planner가 결정한다. index는 저장 공간을 차지하고 INSERT·UPDATE·DELETE 때 유지 비용이 생기므로 실행 계획을 보고 선택한다.
- project_context: 사용자별 진행률을 자주 조회한다면 user_id index가 도움이 된다.

## PY37_L09_update_001
- level: 9
- file: python_database_storage_crud_v37.json
- title: UPDATE 읽기
- question_type: meaning_choice
- concepts: ["UPDATE","SQL","modify"]
- reading_goal: 기존 row 값을 바꾸는 UPDATE 문을 이해한다.
- code:
```python
UPDATE progress
SET correct_count = correct_count + 1
WHERE user_id = 'u1' AND card_id = 'c101';
```
- question: 이 SQL의 의미는?
- answer: u1의 c101 맞힌 횟수를 1 증가시킨다
- explanation: UPDATE는 조건에 맞는 기존 row의 값을 수정하는 SQL 명령이다. WHERE 조건을 잘못 쓰면 원하지 않는 여러 row가 바뀔 수 있다. UPDATE를 실행하기 전에는 WHERE가 원하는 행만 고르는지 SELECT로 먼저 확인하는 습관이 안전하다. 따라서 정답은 ‘u1의 c101 맞힌 횟수를 1 증가시킨다’이다.
- project_context: 정답을 맞힐 때 누적 카운트를 저장하는 방식이다.

## PY37_L09_upsert_001
- level: 9
- file: python_database_storage_crud_v37.json
- title: upsert 읽기
- question_type: meaning_choice
- concepts: ["if","else","upsert","insert_or_update","conflict"]
- reading_goal: 있으면 수정하고 없으면 추가하는 upsert 개념을 이해한다.
- code:
```python
upsert progress:
  if (user_id, card_id) exists:
      update score
  else:
      insert new row
```
- question: upsert의 핵심은?
- answer: 기존 기록이 있으면 업데이트하고 없으면 새로 넣는다
- explanation: upsert는 충돌 기준에 맞는 행이 있으면 update하고 없으면 insert하는 원자적 DB 연산이다. 이 예시에서는 (user_id, card_id)에 UNIQUE 제약이나 같은 역할의 key가 있어야 중복 기준이 명확하다. 먼저 SELECT한 뒤 따로 INSERT하는 방식은 동시 요청에서 race condition이 생길 수 있으므로 DB의 upsert 구문을 사용한다.
- project_context: 학습 진행률 저장 API에서 자주 필요한 패턴이다.

## PY17_L09_git_add_commit_push_001
- level: 9
- file: python_debug_logs_cache_git_v17.json
- title: git add/commit/push 흐름 읽기
- question_type: meaning_choice
- concepts: ["git","commit","push","workflow"]
- reading_goal: 로컬 변경을 원격 GitHub에 올리는 기본 흐름을 읽는다.
- code:
```python
git add src/pwa/app.js data/lessons/python_debug_logs_cache_git_v17.json
git commit -m "Add debug log and cache reading cards"
git push
```
- question: 커밋/푸시 흐름에서 git add의 역할은?
- answer: 커밋에 포함할 파일을 스테이징한다
- explanation: git add는 지정한 두 파일의 현재 내용을 staging area에 올린다. git commit은 staged snapshot을 로컬 기록으로 만들고, git push는 현재 브랜치와 설정된 원격·upstream 조건에 따라 커밋을 전송한다. 작업 폴더의 다른 변경은 자동으로 포함되지 않으므로 commit 전에 git diff --cached로 범위를 확인해야 한다.
- project_context: 검증한 변경만 의미 있는 단위로 기록하고 원격 브랜치에 공유하는 기본 흐름이다.

## PY17_L09_git_status_001
- level: 9
- file: python_debug_logs_cache_git_v17.json
- title: git status 결과 읽기
- question_type: meaning_choice
- concepts: ["git","status","modified","untracked"]
- reading_goal: Git이 추적하는 변경과 추적하지 않는 파일을 구분한다.
- code:
```python
Changes not staged for commit:
        modified:   src/pwa/app.js

Untracked files:
        run_local_server.ps1
```
- question: run_local_server.ps1이 Untracked라는 뜻은?
- answer: Git이 아직 추적하지 않는 새 파일이다
- explanation: git status는 작업 폴더의 변경 상태를 보여 준다. Untracked files는 Git이 아직 추적하지 않는 새 파일이므로 add 전에는 커밋되지 않는다.
- project_context: 스크립트를 만들었는데 커밋 대상에 포함할지 판단할 때 꼭 읽어야 한다.

## PY17_L09_gitignore_reports_001
- level: 9
- file: python_debug_logs_cache_git_v17.json
- title: .gitignore에 reports 추가하기
- question_type: meaning_choice
- concepts: ["gitignore","reports","untracked","git"]
- reading_goal: 임시 산출물 폴더를 Git 추적 대상에서 제외하는 이유를 이해한다.
- code:
```python
Add-Content .gitignore "`nreports/"
git add .gitignore
git commit -m "Ignore local reports directory"
```
- question: reports/를 .gitignore에 넣는 이유는?
- answer: 검증 산출물 같은 로컬 파일을 Git에 올리지 않기 위해
- explanation: .gitignore의 reports/ 패턴은 아직 추적하지 않는 reports 디렉터리 파일을 기본적으로 무시하게 한다. Add-Content를 여러 번 실행하면 같은 줄이 중복될 수 있고, 이미 Git이 추적 중인 파일은 .gitignore에 적어도 자동으로 추적 해제되지 않는다. 또한 팀이 공유해야 하는 공식 보고서라면 무조건 제외하지 말고 저장소 정책을 먼저 정해야 한다.
- project_context: 재생성 가능한 로컬 산출물을 저장소에 포함할지 정책에 따라 정하는 예시다.
