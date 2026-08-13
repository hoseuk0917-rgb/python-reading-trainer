# V356 semantic review — Level 10 chunk 5

Cards 81-100 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY29_L10_flatten_001
- level: 10
- file: python_data_structures_json_v29.json
- title: 중첩 리스트 flatten 읽기
- question_type: meaning_choice
- concepts: ["print","flatten","list","nested"]
- reading_goal: 리스트 안의 리스트를 한 줄짜리 리스트로 펼치는 코드를 읽는다.
- code:
```python
groups = [
    ["json", "dict"],
    ["list", "set"],
]

flat = [x for group in groups for x in group]
print(flat)
```
- question: flat의 값은?
- answer: 평탄화된 리스트 ["json", "dict", "list", "set"]
- explanation: 이중 for comprehension은 각 group 안의 x를 차례대로 꺼내 하나의 리스트로 만든다. flatten은 중첩된 리스트를 한 단계 또는 여러 단계 풀어 하나의 리스트처럼 만드는 처리다. 그룹별 결과를 합쳐 전체 목록으로 만들 때 유용하다. 따라서 출력은 ‘평탄화된 리스트 ["json", "dict", "list", "set"]’이다.
- project_context: 여러 lesson 파일의 카드 목록을 하나로 합치는 사고방식이다.

## PY29_L10_jsonl_stream_001
- level: 10
- file: python_data_structures_json_v29.json
- title: JSONL streaming 읽기
- question_type: meaning_choice
- concepts: ["for","import","jsonl","streaming","large_file","json"]
- reading_goal: 큰 JSONL 파일을 한 줄씩 읽어 메모리를 아끼는 방식을 이해한다.
- code:
```python
import json

with open("chunks.jsonl", encoding="utf-8") as f:
    for line in f:
        item = json.loads(line)
        process(item)
```
- question: JSONL을 한 줄씩 읽는 장점은?
- answer: 큰 파일을 한 번에 전부 메모리에 올리지 않아도 된다
- explanation: file object를 반복해 한 줄씩 parse하므로 전체 file string을 한 번에 memory에 올리지 않는다. 하지만 blank line이나 invalid JSON 한 줄이 나오면 이 code는 중단되고, 자동으로 실패 지점 뒤에서 resume하지 않는다. 계속 처리하려면 line number별 try/except와 checkpoint policy를 명시해야 한다.
- project_context: KG/LoRA chunk, node 후보, 대량 teacher 데이터 처리에 직접 연결된다.

## PY29_L10_lookup_table_001
- level: 10
- file: python_data_structures_json_v29.json
- title: id 기반 lookup table 읽기
- question_type: meaning_choice
- concepts: ["if","print","lookup","dict","id","performance"]
- reading_goal: 리스트를 매번 찾지 않고 id→객체 dict를 만들어 빠르게 조회하는 방식을 이해한다.
- code:
```python
side_by_id = {sc["id"]: sc for sc in side_cards}

card = side_by_id.get("AI_rag_001")
if card:
    print(card["title"])
```
- question: side_by_id의 키는 무엇인가?
- answer: side card의 id
- explanation: dict comprehension의 key는 각 sc["id"]이고 value는 side-card dict 전체다. 같은 id가 여러 번 나오면 뒤 항목이 앞 항목을 조용히 덮어쓰므로 lookup table을 만들기 전에 duplicate ID를 검증해야 한다. get은 없는 id에 None을 반환하고 if card는 empty dict도 없는 것처럼 처리한다.
- project_context: getSideCardById 같은 함수와 직접 연결되는 데이터 구조다.

## PY29_L10_manifest_rows_001
- level: 10
- file: python_data_structures_json_v29.json
- title: manifest row 처리 읽기
- question_type: meaning_choice
- concepts: ["print","manifest","row","csv","pipeline"]
- reading_goal: 파일 목록/상태/경로를 row 단위로 읽어 처리하는 구조를 이해한다.
- code:
```python
rows = [
    {"doc_id": "d1", "path": "a.pdf", "status": "ready"},
    {"doc_id": "d2", "path": "b.pdf", "status": "missing"},
]

ready = [row for row in rows if row["status"] == "ready"]
print(len(ready))
```
- question: ready 리스트에 들어가는 row는?
- answer: status가 ready인 row
- explanation: manifest rows는 파일 목록이나 처리 대상 목록을 표 형태로 관리하는 행이다. status가 ready인 행만 남기면 준비된 항목만 후속 처리할 수 있다.
- project_context: PDF 추출, KG 입력, 수집 manifest, lesson 검증 목록과 연결된다.

## PY29_L10_merge_update_001
- level: 10
- file: python_data_structures_json_v29.json
- title: dict merge/update 읽기
- question_type: meaning_choice
- concepts: ["print","dict_update","merge","override"]
- reading_goal: 기존 dict에 새 값을 덮어쓰거나 추가하는 update 패턴을 이해한다.
- code:
```python
state = {"level": "all", "mode": "all", "queueIds": []}
patch = {"level": "3", "mode": "wrong_or_unseen"}

state.update(patch)
print(state["level"])
```
- question: 출력되는 값은?
- answer: 3
- explanation: state.update(patch)는 state object 자체를 mutate하고 patch의 level과 mode가 같은 key의 기존 값을 덮어쓴다. queueIds는 patch에 없으므로 그대로 남고 print는 문자열 3을 출력한다. update는 nested dict를 재귀 merge하지 않는 shallow operation이므로 nested setting은 전체 value가 교체될 수 있다.
- project_context: localStorage 상태, 추천 진도 상태, 설정 patch에 쓰이는 사고방식이다.

## PY21_L10_d1_prepare_bind_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: Cloudflare D1 prepare/bind 읽기
- question_type: meaning_choice
- concepts: ["d1","prepare","bind","cloudflare"]
- reading_goal: D1에서 SQL과 파라미터를 분리해 실행하는 구조를 읽는다.
- code:
```python
const row = await env.DB.prepare(
  "SELECT id, title FROM items WHERE id = ?"
).bind(itemId).first();
```
- question: bind(itemId)의 역할은?
- answer: SQL의 ? 자리에 itemId 값을 바인딩한다
- explanation: env.DB는 Worker에 설정된 D1 binding이고 prepare가 statement를 만든다. bind(itemId)는 ? placeholder에 값을 분리해 전달해 직접 문자열 연결보다 SQL injection 위험을 줄인다. first()는 첫 result row를 반환하므로 결과가 없을 때의 null과 실행 error를 호출 code에서 구분해야 한다.
- project_context: Cloudflare Worker에서 D1 prepared statement를 실행하는 기본 흐름이다.

## PY21_L10_migration_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: migration SQL 읽기
- question_type: meaning_choice
- concepts: ["migration","alter_table","schema_change"]
- reading_goal: 이미 있는 테이블에 새 컬럼을 추가하는 SQL을 읽는다.
- code:
```python
ALTER TABLE items
ADD COLUMN summary TEXT;
```
- question: 이 SQL의 목적은?
- answer: items 테이블에 summary 컬럼을 추가한다
- explanation: ALTER TABLE ... ADD COLUMN은 기존 items table에 nullable summary column을 추가한다. migration은 이런 schema 변경을 version 순서로 기록하고 각 환경에 한 번씩 적용하는 절차다. DB engine별 지원 범위와 lock 시간을 확인하고, backup·transaction·rollback 또는 forward-fix 계획과 이미 적용됐는지 추적하는 migration table이 필요하다.
- project_context: D1/Supabase schema가 점점 확장될 때 migration을 읽는 기본이다.

## PY21_L10_orphan_check_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: orphan row 점검 쿼리 읽기
- question_type: meaning_choice
- concepts: ["orphan","left_join","integrity","sql"]
- reading_goal: 참조 대상이 없는 행을 찾는 SQL을 읽는다.
- code:
```python
SELECT c.id, c.item_id
FROM curations c
LEFT JOIN items i ON c.item_id = i.id
WHERE i.id IS NULL;
```
- question: WHERE i.id IS NULL은 무엇을 찾는가?
- answer: items에 매칭되지 않는 curations 행
- explanation: LEFT JOIN 후 오른쪽 테이블 값이 NULL이면 참조 대상이 없다는 뜻이다. orphan row 점검은 연결되어야 할 부모 데이터가 없는 행을 찾는 검사다. 외래키 관계나 조인 조건을 보며 빠진 참조가 있는지 확인해야 한다. 따라서 정답은 ‘items에 매칭되지 않는 curations 행’이다.
- project_context: curations → items orphan 검증처럼 데이터 정합성 점검에 쓰인다.

## PY21_L10_pagination_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: LIMIT/OFFSET pagination 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pagination","limit","offset","sql"]
- reading_goal: 목록 API에서 페이지 단위로 데이터를 가져오는 SQL을 읽는다.
- code:
```python
def list_items(conn, page: int, page_size: int = 20):
    offset = (page - 1) * page_size
    return conn.execute(
        "SELECT id, title FROM items ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (page_size, offset)
    ).fetchall()
```
- question: page=3, page_size=20이면 offset은?
- answer: 40
- explanation: page=3이면 (3-1)*20으로 offset 40을 만들고 앞의 40 row를 건너뛴 뒤 최대 20 row를 가져온다. page와 page_size가 양수인지, 최대 page_size가 얼마인지 먼저 검증해야 한다. 같은 created_at 값이 있을 때 page 경계가 흔들리지 않도록 id 같은 고유 tie-breaker도 ORDER BY에 추가하는 것이 안전하다.
- project_context: 카드/문서/검색 결과 목록 API에서 필요한 기본 페이지네이션이다.

## PY21_L10_repository_api_flow_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: API-Service-Repository-DB 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","class","api","service","repository","database"]
- reading_goal: 요청이 endpoint에서 service와 repository를 거쳐 DB로 가는 흐름을 이해한다.
- code:
```python
@app.get("/items/{item_id}")
def get_item(item_id: str):
    return item_service.get_item(item_id)

class ItemService:
    def get_item(self, item_id):
        row = self.repo.find_by_id(item_id)
        if row is None:
            raise NotFound()
        return to_response(row)
```
- question: 이 구조에서 repo.find_by_id의 역할은?
- answer: DB에서 item 행을 찾는다
- explanation: GET endpoint는 item_id를 service에 넘기고, service 안의 repo.find_by_id(item_id)가 저장소에서 해당 item 행을 찾는다. row가 없으면 service가 NotFound를 발생시키고, 있으면 응답 형태로 바꿔 반환한다. 따라서 repo.find_by_id의 책임은 DB 접근 세부사항을 맡아 item 행을 조회하는 것이다.
- project_context: 교육 서비스/RAG 서비스 MVP에서 코드가 커질 때 필요한 계층 구조다.

## PY21_L10_repository_pattern_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: repository 함수 패턴 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","repository","database","architecture"]
- reading_goal: DB 접근 코드를 repository 함수로 분리하는 구조를 이해한다.
- code:
```python
class ItemRepository:
    def __init__(self, conn):
        self.conn = conn

    def find_by_id(self, item_id: str):
        return self.conn.execute(
            "SELECT * FROM items WHERE id = ?",
            (item_id,)
        ).fetchone()
```
- question: ItemRepository의 역할에 가장 가까운 것은?
- answer: items 테이블 접근 로직을 모아둔다
- explanation: ItemRepository는 생성할 때 DB connection을 self.conn에 보관하고 find_by_id 같은 method 안에 SQL을 모은다. 서비스나 API는 SQL 문자열을 직접 만들지 않고 repository method를 호출해 데이터를 얻는다. 따라서 이 객체의 역할은 items 테이블 접근 로직을 한 계층에 모아 저장 방식과 업무 로직을 분리하는 것이다.
- project_context: FastAPI endpoint가 직접 SQL을 많이 들고 있지 않게 만드는 설계다.

## PY21_L10_supabase_select_001
- level: 10
- file: python_database_sql_repository_v21.json
- title: Supabase select 체인 읽기
- question_type: meaning_choice
- concepts: ["supabase","select","database","api_client"]
- reading_goal: Supabase JS 클라이언트의 from/select/eq 체인을 읽는다.
- code:
```python
const { data, error } = await supabase
  .from("items")
  .select("id,title,source_url")
  .eq("id", itemId)
  .single();
```
- question: .eq('id', itemId)의 의미는?
- answer: id가 itemId와 같은 행만 필터링한다
- explanation: .from은 items table을 선택하고 select는 반환할 columns를 정하며 eq는 id가 itemId와 같은 rows만 남긴다. single은 결과가 정확히 한 row이기를 기대하므로 0개이거나 여러 개면 error가 생긴다. 이 code는 error도 구조 분해하므로 반드시 검사해야 하며, 권한은 client filter가 아니라 server의 RLS와 인증 정책으로 보호한다.
- project_context: Supabase 서빙레이어/게시 레이어 접근 코드를 읽는 데 필요하다.

## PY37_L10_migration_001
- level: 10
- file: python_database_storage_crud_v37.json
- title: migration 읽기
- question_type: meaning_choice
- concepts: ["migration","schema_change","database_version"]
- reading_goal: DB 구조 변경을 기록으로 관리하는 migration을 이해한다.
- code:
```python
-- migration_002_add_last_seen.sql
ALTER TABLE progress
ADD COLUMN last_seen_at TEXT;
```
- question: 이 migration은 무엇을 하는가?
- answer: progress 테이블에 last_seen_at column을 추가한다
- explanation: migration은 DB 스키마 변경을 파일로 남겨 순서대로 적용하는 방식이다. 테이블 변경을 재현 가능하게 만들고 배포 실수를 줄인다. 여러 환경에서 같은 DB 구조를 맞춰야 하므로 변경 이력을 코드처럼 관리하는 습관이 중요하다. 따라서 정답은 ‘progress 테이블에 last_seen_at column을 추가한다’이다.
- project_context: 학습앱 저장 구조가 커지면 스키마 변경 이력을 관리해야 한다.

## PY37_L10_progress_storage_001
- level: 10
- file: python_database_storage_crud_v37.json
- title: progress 저장 구조 읽기
- question_type: meaning_choice
- concepts: ["progress","storage","learning_app","schema"]
- reading_goal: 학습앱에서 사용자별 진행률을 어떤 필드로 저장할지 읽는다.
- code:
```python
progress:
  user_id
  card_id
  seen_count
  correct_count
  wrong_count
  last_seen_at
```
- question: last_seen_at의 역할로 가장 가까운 것은?
- answer: 마지막으로 본 시간을 저장한다
- explanation: last_seen_at은 해당 사용자와 카드 조합을 마지막으로 본 시각을 저장하는 필드다. 사용자별 카드 진행률을 한 행으로 유지하려면 (user_id, card_id)에 UNIQUE 또는 primary key 제약을 두고, 시각의 timezone·형식도 정해야 한다. 이 정보는 복습 추천의 입력이지 추천 품질을 혼자 보장하지는 않는다.
- project_context: 오늘의 추천 10장, 오답 복습, 장기 기억 큐를 만들 때 기반 데이터가 된다.

## PY37_L10_repository_pattern_001
- level: 10
- file: python_database_storage_crud_v37.json
- title: repository pattern 읽기
- question_type: meaning_choice
- concepts: ["comment","def","function","class","repository_pattern","data_access","separation"]
- reading_goal: DB 접근 코드를 앱 로직과 분리하는 repository pattern을 이해한다.
- code:
```python
class ProgressRepository:
    def save_answer(self, user_id, card_id, correct):
        # database write here
        pass
```
- question: ProgressRepository의 역할로 가장 자연스러운 것은?
- answer: progress 저장/조회 같은 DB 접근을 담당한다
- explanation: repository는 데이터 저장소 접근을 한 곳에 모아 앱 로직을 깔끔하게 만든다. repository pattern은 DB 접근 코드를 한곳에 모아 서비스 코드와 분리하는 방식이다. 조회, 저장, 삭제 함수가 어디에 모여 있는지 확인하면 구조가 보인다.
- project_context: v31 클래스/객체 카드와 v37 DB 개념을 연결하는 실전 구조다.

## PY37_L10_sqlite_supabase_d1_001
- level: 10
- file: python_database_storage_crud_v37.json
- title: SQLite / Supabase / D1 구분
- question_type: meaning_choice
- concepts: ["SQLite","Supabase","D1","database_choice"]
- reading_goal: 로컬 DB와 클라우드 DB 선택지를 큰 그림에서 구분한다.
- code:
```python
SQLite: embedded file database
Supabase: hosted platform built around Postgres
D1: managed serverless database with SQLite semantics
```
- question: SQLite의 특징으로 가장 가까운 것은?
- answer: 로컬 파일 기반 DB로 시작하기 쉽다
- explanation: SQLite는 애플리케이션에 내장되어 로컬 파일을 직접 사용하는 DB다. Supabase는 Postgres를 중심으로 여러 백엔드 기능을 제공하는 호스팅 플랫폼이고, Cloudflare D1은 SQLite 의미론을 기반으로 한 관리형 serverless DB다. SQL을 쓴다는 공통점만 보고 배포 위치, 동시성, 기능, 운영 모델이 같다고 가정하면 안 된다.
- project_context: 학습 앱의 규모와 배포 환경에 맞춰 embedded DB와 hosted DB의 운영 차이를 비교할 수 있다.

## PY37_L10_transaction_001
- level: 10
- file: python_database_storage_crud_v37.json
- title: transaction 읽기
- question_type: meaning_choice
- concepts: ["transaction","atomic","commit","rollback"]
- reading_goal: 여러 DB 변경을 하나의 묶음으로 성공/실패 처리하는 transaction을 이해한다.
- code:
```python
BEGIN;
UPDATE progress
SET correct_count = correct_count + 1
WHERE user_id = 'u1' AND card_id = 'c101';
INSERT INTO answer_logs (...) VALUES (...);
COMMIT;
```
- question: transaction을 쓰는 이유로 맞는 것은?
- answer: 여러 변경을 한 묶음으로 안전하게 처리하기 위해
- explanation: transaction은 관련된 여러 DB 변경의 all-or-nothing 경계를 만든다. 두 문장이 모두 성공한 뒤 COMMIT해야 함께 반영된다. 중간 실패 때는 애플리케이션이나 DB 도구가 ROLLBACK을 실행하도록 오류 처리를 구성해야 하며, BEGIN만 썼다고 모든 실패가 자동으로 안전하게 복구된다고 가정하면 안 된다.
- project_context: 정답 로그와 진행률 업데이트를 같이 저장할 때 유용하다.

## PY17_L10_loading_stuck_debug_001
- level: 10
- file: python_debug_logs_cache_git_v17.json
- title: Loading... 멈춤 원인 분기 읽기
- question_type: meaning_choice
- concepts: ["if","else","debugging","loading","fetch","browser_cache"]
- reading_goal: Loading 상태에서 멈출 때 원인을 로그 기준으로 나누는 사고방식을 익힌다.
- code:
```python
if index_requested and not app_js_requested:
    cause = "HTML은 열렸지만 JS 로딩이 안 됨: 캐시/PWA/스크립트 태그 의심"
elif app_js_requested and data_json_failed:
    cause = "JS는 실행됐지만 데이터 JSON 로딩 실패"
else:
    cause = "브라우저 콘솔 오류 확인 필요"
```
- question: index만 요청되고 app.js 요청이 없으면 먼저 의심할 것은?
- answer: HTML 캐시/PWA/스크립트 태그 문제
- explanation: 첫 조건이 참이면 HTML 요청은 보였지만 app.js 요청은 보이지 않았으므로 script 태그, HTML/service-worker 캐시, 브라우저 정책이나 네트워크 차단을 먼저 조사한다. 두 번째 조건은 JS 요청 뒤 데이터 JSON 실패를 가리킨다. 이 분기는 원인을 확정하는 진단이 아니라 다음 확인 지점을 고르는 가설이며 Console과 Network 기록으로 검증해야 한다.
- project_context: Loading 화면에서 요청이 멈춘 단계를 기준으로 조사 범위를 좁히는 진단 예시다.

## PY17_L10_pwa_deploy_address_001
- level: 10
- file: python_debug_logs_cache_git_v17.json
- title: GitHub Pages 주소와 로컬 주소 구분
- question_type: meaning_choice
- concepts: ["comment","github_pages","local_server","deployment","url"]
- reading_goal: 공개 배포 주소와 로컬 테스트 주소가 다른 이유를 이해한다.
- code:
```python
# 공개 배포 주소 예시: 일반 push 뒤에도 보통 같은 주소 사용
https://<account>.github.io/<repository>/

# 로컬 테스트 주소: 서버를 실행한 PC에서 접속
http://localhost:8790/src/pwa/index.html
```
- question: 같은 Pages 설정과 저장소 이름을 유지한 채 새 커밋을 배포하면 URL은?
- answer: 보통 그대로이고 배포 내용이 갱신된다
- explanation: 같은 계정, 저장소, Pages 설정을 유지하면 일반적인 새 배포는 같은 공개 URL의 내용을 갱신한다. 저장소 이름, 계정, custom domain, Pages 설정을 바꾸면 주소가 달라질 수 있으므로 절대 고정이라는 뜻은 아니다. 로컬 URL과 공개 URL은 경로, 캐시, 배포 시점이 서로 다른 환경이다.
- project_context: 로컬 개발 주소와 공개 Pages 배포 주소를 구분해 검증하는 카드다.

## PY17_L10_safe_render_fallback_001
- level: 10
- file: python_debug_logs_cache_git_v17.json
- title: 렌더링 fallback 함수 읽기
- question_type: meaning_choice
- concepts: ["return","fallback","rendering","or","side_card"]
- reading_goal: 여러 후보 필드 중 존재하는 값을 순서대로 선택하는 코드를 읽는다.
- code:
```python
function getSideText(sc) {
  return sc.body || sc.summary || sc.description || sc.detail || "";
}
```
- question: sc.body가 빈 문자열이고 sc.summary가 있으면 무엇을 반환하는가?
- answer: sc.summary
- explanation: ||는 왼쪽 값이 undefined나 null뿐 아니라 빈 문자열, 0, false처럼 falsy이면 다음 값을 평가한다. 따라서 body가 빈 문자열이고 summary가 truthy이면 summary를 반환한다. 이 fallback은 화면 중단을 줄이지만 데이터 오류를 숨길 수도 있으므로, 필수 필드는 별도 schema 검증과 경고로 확인해야 한다.
- project_context: 여러 버전의 side-card 텍스트 필드를 읽는 호환 fallback 예시다.
