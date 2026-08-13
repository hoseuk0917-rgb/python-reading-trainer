# V356 semantic review — Level 9 chunk 13

Cards 241-260 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY51_L09_service_worker_waiting_001
- level: 9
- file: python_pwa_install_update_ux_v51.json
- title: service worker waiting 읽기
- question_type: meaning_choice
- concepts: ["service_worker_waiting","PWA_update","lifecycle"]
- reading_goal: 새 service worker가 대기 중인 상태와 업데이트 안내의 관계를 이해한다.
- code:
```python
if (registration.waiting) {
  showUpdateBanner()
}
```
- question: registration.waiting이 의미하는 상황은?
- answer: 새 service worker가 준비됐지만 아직 적용 대기 중인 상황
- explanation: registration.waiting은 새 worker가 install을 마치고 activate를 기다린다는 뜻이다. 기존 worker가 control하는 client가 남아 있으면 자동 activation이 늦어질 수 있고, skipWaiting을 쓰면 열린 app과 version mismatch가 생길 수 있다. 사용자 작업을 보존한 뒤 activation·reload 정책을 적용한다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L09_stale_app_warning_001
- level: 9
- file: python_pwa_install_update_ux_v51.json
- title: stale app warning 읽기
- question_type: meaning_choice
- concepts: ["stale_app","cache_issue","PWA_update"]
- reading_goal: 오래된 앱 버전을 보고 있을 때 경고하는 UX를 이해한다.
- code:
```python
if (currentVersion !== latestVersion) {
  showWarning('오래된 버전입니다')
}
```
- question: stale app warning이 필요한 이유는?
- answer: 오래된 캐시로 이전 버전을 쓰는 상황을 알려주기 위해
- explanation: stale app warning은 오래된 캐시 때문에 이전 앱 버전이 보일 수 있음을 알리는 경고다. PWA 캐시는 장점이지만 갱신 지연도 만든다. 버전 안내와 새로고침 버튼을 함께 제공하면 사용자가 오래된 화면에서 학습하는 문제를 줄일 수 있다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L09_update_check_button_001
- level: 9
- file: python_pwa_install_update_ux_v51.json
- title: update check button 읽기
- question_type: meaning_choice
- concepts: ["update_check","manual_refresh","PWA_update"]
- reading_goal: 사용자가 직접 새 버전 확인을 누를 수 있는 버튼을 이해한다.
- code:
```python
checkButton.onclick = async () => {
  await registration.update()
}
```
- question: update check button의 목적은?
- answer: 사용자가 새 버전 확인을 직접 요청할 수 있게 하기 위해
- explanation: registration.update()는 service worker script update check를 요청한다. 호출 완료가 새 version 발견, cache 갱신 또는 app reload를 뜻하지는 않는다. updatefound, installing state, waiting과 오류를 관찰해 실제 결과를 표시하고 지나친 수동 polling을 막는다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY16_L09_cache_ttl_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: cache와 TTL 조건 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","import","cache","ttl","time","api"]
- reading_goal: 캐시가 아직 유효하면 API 호출을 건너뛰는 코드를 읽는다.
- code:
```python
import time

def get_or_fetch(key, cache, fetch, ttl=3600):
    item = cache.get(key)
    if item and time.time() - item["saved_at"] < ttl:
        return item["value"]
    value = fetch(key)
    cache[key] = {"value": value, "saved_at": time.time()}
    return value
```
- question: time.time() - item['saved_at'] < ttl의 의미는?
- answer: 저장 후 지난 시간이 ttl보다 작으면 캐시가 유효하다
- explanation: TTL은 cache에 저장한 값을 얼마 동안 유효하다고 볼지 정한 시간이다. 현재 시각에서 저장 시각을 뺀 경과 시간이 ttl보다 작으면 조건이 True라서 아직 cache를 사용할 수 있다. ttl 이상 지났다면 오래된 값으로 보고 다시 계산하거나 원본에서 새로 불러오는 쪽으로 넘어간다.
- project_context: API 비용과 지연을 줄이는 운영 코드에서 자주 보이는 패턴이다.

## PY16_L09_chunk_id_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: chunk_id 생성 규칙 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","chunk_id","stable_id","provenance"]
- reading_goal: 문서 ID와 순번으로 재현 가능한 chunk_id를 만드는 코드를 읽는다.
- code:
```python
def make_chunk_id(doc_id, index):
    return f"{doc_id}::chunk::{index:04d}"

print(make_chunk_id("doc_17", 3))
```
- question: 출력은?
- answer: doc_17::chunk::0003
- explanation: chunk_id는 잘라낸 텍스트 조각을 구분하는 식별자다. {index:04d}는 숫자를 4자리로 맞추고 앞을 0으로 채워 정렬하기 쉽게 만든다. 문서 id와 순번을 함께 넣으면 검색 결과가 어느 문서의 몇 번째 조각인지 추적하기 쉽다. 따라서 출력은 ‘doc_17::chunk::0003’이다.
- project_context: chunk_id가 흔들리면 임베딩, evidence, node/edge 후보 연결이 모두 꼬인다.

## PY16_L09_dedup_hash_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: claim/hash dedup 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","dedup","hash","claim","canonicalization"]
- reading_goal: 정규화한 텍스트로 해시를 만들어 중복을 판단하는 코드를 읽는다.
- code:
```python
import hashlib

def claim_hash(text):
    norm = " ".join(text.lower().split())
    return hashlib.sha256(norm.encode("utf-8")).hexdigest()
```
- question: ' '.join(text.lower().split())의 역할은?
- answer: 대소문자와 공백 차이를 줄여 정규화한다
- explanation: lower는 대소문자를 통일하고 split 뒤 " ".join은 앞뒤 공백과 연속 공백을 한 칸으로 정리한다. 그 정규화 문자열을 UTF-8 바이트로 바꿔 SHA-256 해시를 만든다. 해시는 암호화가 아니며 원문을 복원하기 위한 값도 아니다. 이 방식은 철자와 공백이 정규화된 동일 문장만 찾고, 뜻만 같은 문장은 찾지 못하며 대소문자가 중요한 표현을 잘못 합칠 수도 있다.
- project_context: claim 기반 dedup, 중복 기사 제거, 동일 주장 묶기에 쓰이는 기본 아이디어다.

## PY16_L09_embedding_batch_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: 임베딩 배치 처리 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","range","embedding","batch","vector","gpu"]
- reading_goal: 텍스트를 일정 크기 배치로 나눠 임베딩하는 코드를 읽는다.
- code:
```python
def embed_in_batches(texts, model, batch_size=32):
    vectors = []
    for start in range(0, len(texts), batch_size):
        batch = texts[start:start + batch_size]
        vectors.extend(model.encode(batch))
    return vectors
```
- question: range(0, len(texts), batch_size)의 의미는?
- answer: 0부터 batch_size 간격으로 시작 위치를 만든다
- explanation: start는 각 배치의 시작 인덱스가 된다. texts[start:start+batch_size]로 작은 묶음을 만든다. 임베딩 배치 처리는 여러 텍스트를 묶어 벡터로 변환하는 방식이다. batch size가 너무 크면 메모리 문제가 나고 너무 작으면 속도가 느려질 수 있다.
- project_context: 70k+ chunk를 한 번에 처리하지 않고 배치로 나눠 메모리와 속도를 조절하는 패턴이다.

## PY16_L09_rerank_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: rerank 후보 재정렬 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","rerank","score","retrieval","ranking"]
- reading_goal: 1차 검색 후보를 다른 점수로 다시 정렬하는 코드를 읽는다.
- code:
```python
def rerank(question, candidates, scorer):
    scored = []
    for chunk in candidates:
        score = scorer(question, chunk["text"])
        scored.append({"chunk": chunk, "score": score})
    return sorted(scored, key=lambda x: x["score"], reverse=True)
```
- question: reverse=True의 의미는?
- answer: score가 큰 후보가 앞에 오게 한다
- explanation: 각 candidate에 대해 scorer가 question과 text의 점수를 만들고, scored에는 원래 chunk와 score가 함께 저장된다. sorted의 reverse=True는 score를 큰 값부터 정렬한다. 이 해석은 scorer가 큰 점수를 더 관련 있는 후보로 정의한다는 전제에 따른다. reranking은 검색 품질을 높일 수 있지만 후보마다 추가 계산 비용과 지연이 든다.
- project_context: 벡터 검색 결과를 그대로 쓰지 않고, 더 정밀한 기준으로 재정렬하는 RAG 고급 흐름이다.

## PY16_L09_sentence_chunking_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: 문장 단위 chunking 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","chunking","sentence","overlap","rag"]
- reading_goal: 문장 경계를 유지하면서 chunk를 만드는 흐름을 읽는다.
- code:
```python
def make_chunks(sentences, max_chars=900):
    chunks = []
    current = []
    size = 0

    for sent in sentences:
        if size + len(sent) > max_chars and current:
            chunks.append(" ".join(current))
            current = current[-2:]
            size = sum(len(x) for x in current)
        current.append(sent)
        size += len(sent)

    if current:
        chunks.append(" ".join(current))
    return chunks
```
- question: current = current[-2:]의 역할은?
- answer: 이전 chunk의 마지막 두 문장을 다음 chunk에도 겹치게 한다
- explanation: current[-2:]는 현재 목록의 마지막 두 문장만 새 목록으로 남긴다. 직전에 완성한 chunk의 끝 두 문장이 다음 chunk의 시작에도 들어가므로 정답은 ‘이전 chunk의 마지막 두 문장을 다음 chunk에도 겹치게 한다’이다. 이 overlap은 경계에서 문맥이 끊기는 일을 줄이지만, 너무 크면 같은 문장이 여러 검색 결과에 반복될 수 있다. 문장 경계 보존은 sentences가 미리 올바르게 분리되어 있다는 전제도 필요하다.
- project_context: 문장 중간이나 단어 중간을 자르지 않고, 검색에 필요한 앞뒤 문맥을 일부 겹치는 chunking 원칙과 연결된다.

## PY16_L09_vector_topk_001
- level: 9
- file: python_rag_kg_pipeline_review_v16.json
- title: 벡터 검색 top-k 결과 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","vector_search","top_k","similarity","rag"]
- reading_goal: 질문 벡터와 가장 가까운 chunk 후보를 가져오는 코드를 읽는다.
- code:
```python
def retrieve(question, embedder, index, top_k=5):
    qvec = embedder.encode(question)
    hits = index.search(qvec, top_k=top_k)
    return [hit["chunk_id"] for hit in hits]
```
- question: return [hit['chunk_id'] for hit in hits]는 무엇을 반환하는가?
- answer: 검색된 chunk_id 목록
- explanation: vector top-k는 임베딩 검색 결과 중 점수가 높은 후보 몇 개만 고르는 과정이다. hits에서 chunk_id만 뽑으면 후속 근거 조회에 쓸 수 있다. chunk_id 목록만 분리하면 다음 단계에서 실제 문서 조각을 다시 조회하기 쉬워진다.
- project_context: RAG 검색 결과가 answer 생성으로 넘어가기 전 어떤 후보를 잡았는지 확인하는 코드다.

## PY8_L09_appjs_multi_lesson_load_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: 여러 lesson 파일 로딩 읽기
- question_type: meaning_choice
- concepts: ["return","javascript","Promise.all","fetch","flat"]
- reading_goal: 여러 JSON 카드 파일을 병렬 로딩 후 하나로 합치는 흐름을 읽는다.
- code:
```python
const lessonResults = await Promise.all(lessonFiles.map(function(path) {
  return fetch(path).then(function(res) {
    if (!res.ok) return [];
    return res.json();
  });
}));
cards = lessonResults.flat();
```
- question: res.ok가 false이면 무엇을 반환하는가?
- answer: 빈 배열
- explanation: 각 path에 대해 fetch를 시작하고, HTTP 상태가 성공 범위가 아니어서 res.ok가 false이면 그 항목의 Promise를 빈 배열로 이행시킨다. 모든 항목이 이행되면 Promise.all은 입력 순서대로 배열을 만들고 flat()이 한 단계 합친다. 다만 네트워크 오류로 fetch가 거부되거나 res.json()이 실패하면 그 Promise는 거부되고, 별도 catch가 없으므로 Promise.all 전체도 거부된다. 따라서 이 코드는 HTTP 비정상 응답만 빈 배열로 건너뛴다.
- project_context: 학습 앱에서 여러 카드 JSON 파일을 합치는 핵심 구조다.

## PY8_L09_domain_classifier_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: 도메인 분류 규칙 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","classification","domain","rule"]
- reading_goal: 제목 키워드로 도메인을 분류하는 간단한 규칙 코드를 읽는다.
- code:
```python
def classify_domain(title):
    text = title.lower()
    if "uam" in text or "vertiport" in text:
        return "UAM"
    if "robot" in text:
        return "Robotics"
    return "Other"
```
- question: title에 vertiport가 있으면 결과는?
- answer: UAM
- explanation: title.lower()로 대소문자를 통일한 뒤 uam 또는 vertiport라는 부분 문자열이 있으면 첫 분기에서 UAM을 반환한다. 따라서 title에 vertiport가 있으면 뒤의 robot 검사까지 가지 않는다. 이 코드는 단어 경계나 문맥을 보지 않는 규칙이므로 관련 없는 단어의 일부가 우연히 맞아 오분류할 수 있고, title이 문자열이 아니면 lower()에서 실패한다. 빠른 1차 라벨링 뒤 검토가 필요한 이유다.
- project_context: 홈 큐레이션 도메인/테마/렌즈 분류와 연결된다.

## PY8_L09_lens_classifier_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: lens 분류 규칙 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","classification","lens","curation"]
- reading_goal: 규정/리스크/기술 렌즈 중 하나를 고르는 코드를 읽는다.
- code:
```python
def choose_lens(item):
    if item.get("regulation"):
        return "regulation"
    if item.get("risk"):
        return "risk"
    return "technology"
```
- question: regulation이 참이면 결과는?
- answer: regulation
- explanation: item.get('regulation')의 값이 truthy이면 즉시 regulation을 반환하므로 risk 값도 참이어도 첫 결과가 우선한다. regulation이 falsy일 때만 risk를 검사하고, 둘 다 falsy이거나 key가 없으면 technology를 반환한다. get은 key 부재를 false처럼 처리하지만 값의 타입이나 의미를 검증하지 않으므로 문자열 'false'처럼 truthy인 값도 regulation으로 분류될 수 있다.
- project_context: Domain/Theme/Lens 큐레이션 구조와 연결된다.

## PY8_L09_resume_output_exists_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: 산출물 존재 여부로 재실행 건너뛰기
- question_type: meaning_choice
- concepts: ["if","def","function","return","print","resume","pathlib","batch"]
- reading_goal: 이미 결과 파일이 있으면 해당 작업을 건너뛰는 구조를 읽는다.
- code:
```python
def should_resume(output_path):
    return Path(output_path).exists()

if should_resume("out_0042.json"):
    print("skip")
```
- question: out_0042.json이 있으면 출력은?
- answer: skip
- explanation: Path(output_path).exists()가 true이면 if 본문이 실행되어 skip을 출력한다. exists()는 이름과 달리 작업 완료 여부가 아니라 그 경로에 파일이나 디렉터리가 존재하는지만 확인한다. 따라서 빈 파일·부분 기록·잘못된 JSON도 skip할 수 있고, Path를 import하지 않았다면 NameError가 난다. 안전한 재개 로직은 파일 종류·크기·파싱·완료 메타데이터 등을 확인한 뒤 건너뛰어야 한다.
- project_context: 긴 배치 작업 중복 실행 방지에 필요하다.

## PY8_L09_shard_range_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: shard 범위 계산 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","shard","batch","range"]
- reading_goal: shard 번호와 크기로 처리 범위를 계산하는 코드를 읽는다.
- code:
```python
def shard_range(shard_id, shard_size):
    start = shard_id * shard_size
    end = start + shard_size
    return start, end

print(shard_range(3, 200))
```
- question: 출력은?
- answer: (600, 800)
- explanation: start는 3 * 200인 600이고 end는 600 + 200인 800이므로 튜플 (600, 800)을 출력한다. 보통 이 경계는 [600, 800), 즉 600 이상 800 미만으로 사용하며 shard_id를 0부터 센다면 id 3은 네 번째 조각이다. 이 함수는 경계만 계산할 뿐 실제 처리 범위의 끝을 배타적으로 쓰게 강제하지 않으므로, 호출부가 같은 규칙을 지켜야 누락과 중복을 막을 수 있다.
- project_context: LLM batch/shard 실행 계획을 읽는 데 직접 도움이 된다.

## PY8_L09_sidecard_integrity_001
- level: 9
- file: python_realworld_expansion_v8.json
- title: 사이드카드 연결 검증 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","validation","side_card","integrity"]
- reading_goal: 카드가 참조하는 side_card_id가 실제 존재하는지 검사하는 흐름을 읽는다.
- code:
```python
def find_missing_side_cards(cards, side_ids):
    missing = []
    for card in cards:
        for side_id in card.get("side_card_ids", []):
            if side_id not in side_ids:
                missing.append((card["id"], side_id))
    return missing
```
- question: 사이드카드 무결성 검사에서 missing에는 무엇이 들어가는가?
- answer: 없는 side_card_id 참조
- explanation: 각 카드의 side_card_ids가 없으면 빈 리스트로 보고 넘어가며, 각 side_id가 side_ids에 없을 때 (card['id'], side_id) 튜플을 missing에 추가한다. 반환값에는 어떤 카드가 어떤 없는 id를 참조했는지가 들어간다. 같은 잘못된 참조가 여러 번 나오면 중복 기록될 수 있고, 이 검사는 대상 id의 존재만 볼 뿐 사이드카드 내용이나 양방향 연결의 정확성까지 검증하지는 않는다. side_ids를 set으로 받으면 반복 membership 검사가 더 효율적이다.
- project_context: 카드/사이드카드 데이터 무결성 점검에 필요하다.

## PY40_L09_config_separation_001
- level: 9
- file: python_refactoring_maintainability_v40.json
- title: config 분리 읽기
- question_type: meaning_choice
- concepts: ["config","separation","hardcoded_value"]
- reading_goal: 자주 바뀌는 설정을 코드와 분리하는 이유를 이해한다.
- code:
```python
config:
  dailyCardCount = 10
  dataVersion = "20260529_v40"

app code:
  use config.dailyCardCount
```
- question: config 분리의 장점은?
- answer: 설정 변경 때 핵심 코드를 덜 건드린다
- explanation: 동작 정책인 dailyCardCount와 dataVersion을 실행 로직에서 분리하면 환경·실험별 변경 위치가 분명해진다. 하지만 설정을 한 파일로 옮기는 것만으로 안전하거나 유효해지는 것은 아니다. schema와 범위를 검증하고, secret은 일반 config나 클라이언트 bundle과 별도로 관리한다.
- project_context: 추천 10장, APP_DATA_VERSION, lessonFiles도 장기적으로 config화 후보가 된다.

## PY40_L09_dead_code_001
- level: 9
- file: python_refactoring_maintainability_v40.json
- title: dead code 읽기
- question_type: meaning_choice
- concepts: ["dead_code","cleanup","maintenance"]
- reading_goal: 더 이상 쓰이지 않는 코드가 왜 위험한지 이해한다.
- code:
```python
function oldRecommendCards() {
  // no caller
}
```
- question: dead code의 문제는?
- answer: 실제로 쓰이는지 헷갈려 유지보수를 어렵게 한다
- explanation: dead code는 실제 실행 경로에서 도달하지 않는 코드다. 유지하면 독자를 혼란스럽게 하고 테스트되지 않은 오래된 동작을 실수로 다시 사용할 수 있다. 삭제 전에는 동적 호출, 설정, plugin, 외부 사용자가 없는지 검색과 테스트로 확인하고, 필요하면 과거 코드는 version control에서 찾는다.
- project_context: 오래된 Expand V3 스크립트처럼 현재 구조와 맞지 않는 코드는 특히 위험하다.

## PY40_L09_magic_number_001
- level: 9
- file: python_refactoring_maintainability_v40.json
- title: magic number 읽기
- question_type: meaning_choice
- concepts: ["if","magic_number","constant","readability"]
- reading_goal: 의미가 드러나지 않는 숫자를 상수로 바꾸는 이유를 이해한다.
- code:
```python
bad:
  if retryCount >= 3:

better:
  const MAX_RETRIES = 3
  if retryCount >= MAX_RETRIES:
```
- question: MAX_RETRY 상수의 장점은?
- answer: 숫자 3의 의미가 드러난다
- explanation: MAX_RETRIES라는 이름은 3이 허용할 총 시도 횟수라는 정책을 드러내고 한곳에서 바꾸게 한다. 비교 연산도 정책과 맞아야 한다. retryCount가 이미 수행한 횟수라면 >=에서 더 시도하지 않도록 해야 하며 >를 쓰면 한 번 더 허용하는 off-by-one이 생길 수 있다.
- project_context: 추천 카드 수, 재시도 횟수, timeout 값에 적용할 수 있다.

## PY46_L09_failed_only_rerun_001
- level: 9
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: failed items only rerun 읽기
- question_type: meaning_choice
- concepts: ["for","failed_only_rerun","selective_retry","cost_saving"]
- reading_goal: 실패한 항목만 선별 재실행하는 방식의 장점을 이해한다.
- code:
```python
failed_ids = load_failed_ids('audit.tsv')
for item_id in failed_ids:
    rerun(item_id)
```
- question: failed only rerun의 장점은?
- answer: 성공한 작업을 반복하지 않아 시간과 비용을 줄인다
- explanation: audit에서 실패 ID만 재실행하면 성공 항목의 비용을 줄일 수 있다. audit가 현재 input·code version과 일치하는지, 실패 항목의 upstream dependency가 바뀌지 않았는지 확인해야 한다. 수정이 공통 로직에 영향을 줬다면 성공 항목도 regression 검사가 필요하다.
- project_context: AWS GPU 비용이나 LLM 호출 비용을 아끼려면 실패분만 다시 돌리는 구조가 중요하다.
