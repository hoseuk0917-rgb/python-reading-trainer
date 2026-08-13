# V356 semantic review — Level 10 chunk 3

Cards 41-60 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY22_L10_prompt_injection_guard_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: prompt injection 입력 방어 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","prompt_injection","input_validation","security","llm"]
- reading_goal: 사용자 입력을 그대로 시스템 명령처럼 믿지 않도록 분리하는 코드를 읽는다.
- code:
```python
def build_prompt(user_query: str):
    safe_query = user_query[:2000]
    return {
        "system": "Answer only from retrieved evidence.",
        "user": safe_query,
    }
```
- question: user_query[:2000]의 목적에 가장 가까운 것은?
- answer: 사용자 입력 길이를 제한한다
- explanation: user_query[:2000]은 Python 문자 기준으로 입력 길이만 제한한다. system과 user 역할을 나누거나 "evidence only"라고 쓰는 것은 유용한 지시지만 prompt injection을 막는 security boundary가 아니다. retrieved document도 공격 지시를 포함할 수 있으므로 tool allowlist와 최소 권한, structured output validation, sensitive data 분리, human approval 같은 application-level control이 필요하다.
- project_context: Cross-Verified RAG/Evidence-first 파이프라인에서 사용자 입력을 안전하게 다루는 사고방식이다.

## PY22_L10_rate_limit_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: rate limit 체크 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","rate_limit","quota","abuse_prevention","api"]
- reading_goal: 사용자별 요청 횟수를 제한하는 기본 구조를 읽는다.
- code:
```python
def check_rate_limit(user_id):
    count = cache.incr(f"rate:{user_id}")
    if count > 100:
        raise HTTPException(status_code=429, detail="too many requests")
```
- question: count가 100을 넘으면 어떤 상태 코드가 나오는가?
- answer: 429
- explanation: count가 101 이상이면 429를 발생시킨다. 그러나 이 예시에는 만료 시간이나 window reset이 없어 key가 영구 누적될 수 있다. 실제 rate limiter는 atomic increment와 TTL 또는 token/leaky bucket, 신뢰할 수 있는 user/IP/key 식별자, 분산 server의 공통 store, Retry-After와 fail-open/closed 정책을 함께 설계한다.
- project_context: LLM API 비용 폭주나 악용을 막는 데 필요한 서버 방어 패턴이다.

## PY22_L10_secret_rotation_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: secret rotation 사고방식 읽기
- question_type: meaning_choice
- concepts: ["if","secret_rotation","api_key","security","version"]
- reading_goal: 키가 노출되었거나 오래되었을 때 교체하는 운영 흐름을 이해한다.
- code:
```python
ACTIVE_KEY_VERSION = "v2"

if request.key_version != ACTIVE_KEY_VERSION:
    raise HTTPException(status_code=401, detail="old key disabled")
```
- question: old key disabled의 의미에 가장 가까운 것은?
- answer: 이전 버전 키는 더 이상 허용하지 않는다
- explanation: request가 보낸 key_version이 active version과 다르면 이 code는 401을 반환한다. 하지만 client의 version 문자열만 비교하면 실제 secret이 유효한지 검증하지 못한다. rotation은 새 key 발급·배포, dual-read 또는 overlap 기간, 사용 현황 확인, old key revoke, log와 backup 점검을 포함하며 노출 사고 때는 즉시 revoke가 우선이다.
- project_context: API 키 저장/암호화/갱신 구조를 설계할 때 필요한 개념이다.

## PY22_L10_session_cookie_001
- level: 10
- file: python_auth_security_tokens_v22.json
- title: 세션 쿠키 설정 읽기
- question_type: meaning_choice
- concepts: ["cookie","session","httponly","secure"]
- reading_goal: 브라우저 쿠키에 세션 값을 저장할 때 보안 옵션을 읽는다.
- code:
```python
response.set_cookie(
    key="session",
    value=session_id,
    httponly=True,
    secure=True,
    samesite="lax"
)
```
- question: httponly=True의 의미에 가장 가까운 것은?
- answer: 브라우저 JS에서 쿠키를 직접 읽기 어렵게 한다
- explanation: HttpOnly는 browser JavaScript의 document.cookie 같은 API로 session cookie를 직접 읽지 못하게 해 token 탈취 경로를 줄인다. XSS code가 사용자의 browser에서 인증 요청을 보내는 것까지 막지는 않는다. Secure는 HTTPS 전송을 요구하고 SameSite=Lax는 일부 cross-site request를 제한하지만, CSRF token·origin 검사와 짧은 session·rotation 등도 threat model에 따라 필요하다.
- project_context: 로그인 세션을 프론트에 붙일 때 토큰 저장 위치를 판단하는 데 필요하다.

## PY3_L10_embedding_pipeline_001
- level: 10
- file: python_broad_expansion_v3.json
- title: 임베딩 생성 흐름 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","embedding","vector","batch","pipeline"]
- reading_goal: 텍스트 목록을 임베딩 벡터 목록으로 바꾸는 함수 흐름을 읽는다.
- code:
```python
def embed_texts(texts, model):
    vectors = []
    for text in texts:
        vectors.append(model.encode(text))
    return vectors
```
- question: 이 함수의 목적은?
- answer: 텍스트들을 벡터로 바꾼다
- explanation: vectors는 빈 리스트로 시작한다. for가 texts의 각 text를 하나씩 꺼내 model.encode(text)로 벡터를 만들고 vectors에 append한다. 모든 텍스트를 처리한 뒤 return vectors가 벡터 목록을 호출자에게 돌려준다. 즉 이 함수의 목적은 여러 텍스트를 같은 순서의 임베딩 벡터 목록으로 바꾸는 것이다.
- project_context: RAG 검색과 벡터DB 구축의 핵심 흐름이다.

## PY3_L10_harvest_curate_flow_001
- level: 10
- file: python_broad_expansion_v3.json
- title: 하베스트-큐레이션 흐름 읽기
- question_type: reverse_inference
- concepts: ["def","function","return","harvest","curation","pipeline","dedup"]
- reading_goal: 수집 후 중복 제거와 랭킹으로 후보를 고르는 흐름을 읽는다.
- code:
```python
def run_daily_job(sources):
    items = harvest(sources)
    unique_items = dedup(items)
    ranked = rank_by_score(unique_items)
    return ranked[:20]
```
- question: 이 함수의 목적에 가장 가까운 것은?
- answer: 자료를 수집·중복 제거·랭킹한 뒤 앞에서 최대 20개를 반환한다
- explanation: harvest가 자료를 모으고 dedup이 중복을 제거한 뒤 rank_by_score가 목록을 반환한다. ranked[:20]은 그 목록의 앞에서 최대 20개를 잘라 반환한다. 이 20개를 실제 ‘상위’ 후보라고 부르려면 rank_by_score가 높은 우선순위부터 정렬한다는 구현 계약이 필요하므로, 함수 본문이나 테스트에서 그 순서를 확인해야 한다.
- project_context: 수집 결과를 중복 제거하고 우선순위 목록으로 줄이는 일일 큐레이션 흐름을 읽는 예제다.

## PY3_L10_kg_edge_build_001
- level: 10
- file: python_broad_expansion_v3.json
- title: KG edge 생성 흐름 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","kg","edge","node","relation"]
- reading_goal: 두 노드 사이 관계를 edge dict로 만드는 코드를 읽는다.
- code:
```python
def make_edge(source_id, target_id, relation):
    return {
        "from": source_id,
        "to": target_id,
        "rel": relation
    }

edge = make_edge("LiDAR", "PointCloud", "PRODUCES")
print(edge["rel"])
```
- question: 출력은?
- answer: PRODUCES
- explanation: KG edge는 두 노드 사이의 관계를 표현한다. 이 코드에서 edge dict의 rel 값은 PRODUCES이므로 생산 관계를 뜻한다. edge를 읽을 때는 from, rel, to가 각각 시작 노드, 관계 이름, 도착 노드를 나타내는지 확인하면 된다.
- project_context: KG 노드/엣지 생성 코드를 읽기 위한 직접 훈련이다.

## PY3_L10_vector_search_flow_001
- level: 10
- file: python_broad_expansion_v3.json
- title: 벡터 검색 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","vector_search","embedding","top_k"]
- reading_goal: 질문 벡터와 가까운 문서 후보를 찾는 흐름을 읽는다.
- code:
```python
def retrieve(question, embedder, index):
    query_vector = embedder.encode(question)
    hits = index.search(query_vector, top_k=5)
    return hits
```
- question: 벡터 검색에서 top_k=5의 의미는?
- answer: 상위 후보를 최대 5개 요청한다
- explanation: top_k=5는 index.search에 점수 순 상위 후보를 최대 5개 요청한다는 뜻이다. 실제 결과는 인덱스에 저장된 항목 수나 필터 조건에 따라 5개보다 적을 수 있고, 무엇을 ‘가깝다’고 보는지는 인덱스의 거리·유사도 설정에 달려 있다. top_k가 작으면 관련 후보를 놓칠 수 있고 너무 크면 후속 재정렬이나 검토 비용이 늘어난다.
- project_context: RAG, 추천, 의미검색 코드에서 자주 나온다.

## PY58_L10_authoring_manifest_001
- level: 10
- file: python_card_authoring_pipeline_v58.json
- title: authoring manifest 읽기
- question_type: meaning_choice
- concepts: ["authoring_manifest","metadata","traceability"]
- reading_goal: 생성된 카드 묶음의 목적, 출처, 버전, 검토 상태를 manifest로 남기는 방식을 이해한다.
- code:
```python
manifest = {
  version: 'v58',
  topic: 'authoring pipeline',
  status: 'approved',
  sourceHash: source_hash,
  cardIds: approved_card_ids,
  validatorVersion: validator_version
}
```
- question: authoring manifest의 역할은?
- answer: 카드 묶음의 제작 정보와 검토 상태를 추적하기 위해
- explanation: manifest는 batch version, topic, status뿐 아니라 source hash, 승인 card ID와 validator version을 연결해 무엇을 검토·배포했는지 추적하게 한다. approved라는 label은 reviewer와 approval timestamp·evidence가 있어야 신뢰할 수 있다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L10_authoring_regression_test_001
- level: 10
- file: python_card_authoring_pipeline_v58.json
- title: authoring regression test 읽기
- question_type: meaning_choice
- concepts: ["regression_test","authoring","validation"]
- reading_goal: 새 카드 추가 후 기존 카드 구조가 깨지지 않았는지 회귀 검증하는 습관을 이해한다.
- code:
```python
python tools/validate_lessons.py --manifest data/lesson_manifest.json
```
- question: authoring regression test의 목적은?
- answer: 새 카드 추가가 기존 앱 데이터를 깨지 않았는지 확인하기 위해
- explanation: version 관리된 manifest의 예상 file·ID·count를 validator가 읽게 하면 workflow command의 오래된 숫자만 바꾸는 실수를 줄일 수 있다. regression test는 기존 ID·answer·reference와 app 연결을 검사해야 하며 총 count 하나만으로 content 보존을 증명하지 않는다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L10_card_authoring_pipeline_001
- level: 10
- file: python_card_authoring_pipeline_v58.json
- title: card authoring pipeline 읽기
- question_type: meaning_choice
- concepts: ["card_authoring_pipeline","workflow","quality_gate"]
- reading_goal: 카드 제작 전체 흐름을 초안, 검토, 검증, 배포, 기록으로 묶어 이해한다.
- code:
```python
draftCards()
humanReviewCards()
validateApprovedCards()
publishCards()
verifyReleaseAndLogEvidence()
```
- question: card authoring pipeline의 핵심 순서는?
- answer: 초안 작성 → 검토 → 검증 → 배포 → 기록
- explanation: draft를 사람 검토해 승인하고 승인본에 자동 validation을 실행한 뒤 publish한다. 마지막에는 실제 배포 revision과 load·schema를 확인하고 source·review evidence를 기록한다. publish 실패나 변경 후 재검토 없이 이전 승인을 재사용하는 경우도 처리한다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY31_L10_domain_model_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: 도메인 모델 읽기
- question_type: meaning_choice
- concepts: ["class","domain_model","Card","Progress","StudySession"]
- reading_goal: 서비스에서 중요한 개념을 모델 이름으로 드러내는 방식을 이해한다.
- code:
```python
@dataclass
class StudySession:
    cards: list[Card]
    progress: Progress
    current_index: int
```
- question: StudySession이 표현하는 개념은?
- answer: 현재 학습 세션의 카드, 진행상태, 위치
- explanation: domain model은 앱에서 중요한 개념을 코드 구조로 표현한 것이다. 카드, 진도, 오답 기록처럼 서비스 핵심 대상을 명확하게 다룰 수 있다. 도메인 모델을 먼저 정하면 화면, 저장소, API가 같은 개념 이름을 기준으로 연결될 수 있다. 따라서 정답은 ‘현재 학습 세션의 카드, 진행상태, 위치’이다.
- project_context: 학습 앱을 장기적으로 키우면 Card/Progress/StudySession 같은 모델이 중심이 된다.

## PY31_L10_from_dict_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: from_dict 패턴 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","from_dict","factory_method","json","model"]
- reading_goal: dict 데이터를 객체로 변환하는 classmethod 패턴을 이해한다.
- code:
```python
@dataclass
class Card:
    id: str
    title: str

    @classmethod
    def from_dict(cls, data):
        return cls(id=data["id"], title=data["title"])
```
- question: from_dict의 역할은?
- answer: dict를 Card 객체로 바꾼다
- explanation: classmethod는 class 자체를 cls로 받아 data의 id와 title로 cls instance를 만든다. Card subclass에서 호출하면 subclass constructor를 사용한다. missing key는 KeyError가 나고 extra field는 무시되므로 input schema, default와 unknown-field policy를 변환 boundary에서 정해야 한다.
- project_context: lesson JSON을 더 엄격한 Python 모델로 다루고 싶을 때 필요하다.

## PY31_L10_repository_object_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: Repository 객체 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","repository","storage","load","save"]
- reading_goal: 데이터 저장/조회 책임을 Repository 객체로 분리하는 이유를 이해한다.
- code:
```python
class CardRepository:
    def __init__(self, path):
        self.path = path

    def load_cards(self):
        return read_json(self.path)
```
- question: CardRepository의 주된 책임은?
- answer: 카드 데이터를 저장소에서 읽는 것
- explanation: CardRepository는 카드가 어디에 저장되어 있는지와 읽는 방법을 한 객체에 모은다. 생성할 때 path를 self.path에 저장하고 load_cards()가 그 경로를 read_json에 넘겨 카드 데이터를 읽는다. 따라서 서비스 코드가 파일 접근 세부사항을 직접 다루지 않게 하는 저장소 접근 객체라고 이해하면 된다.
- project_context: FastAPI나 DB가 붙으면 repository 분리가 중요해진다.

## PY31_L10_service_object_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: Service 객체 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","service","business_logic","recommendation"]
- reading_goal: 규칙과 판단 로직을 Service 객체로 분리하는 구조를 이해한다.
- code:
```python
class StudyService:
    def make_today_queue(self, cards, progress):
        unseen = [c for c in cards if c.id not in progress.seen]
        return unseen[:10]
```
- question: StudyService가 담당하는 일은?
- answer: 오늘 학습 큐를 만드는 규칙
- explanation: StudyService.make_today_queue는 cards와 progress를 받아 학습 규칙을 적용한다. 먼저 progress.seen에 없는 카드만 unseen으로 추리고, 그중 앞에서 최대 10개를 반환한다. 저장소 접근 자체보다 '오늘 어떤 카드를 보여 줄지' 같은 업무 규칙을 Service에 분리한 예시다.
- project_context: 추천 10장, 복습 우선, 레벨 추천 같은 기능을 서비스로 분리할 수 있다.

## PY31_L10_stateful_object_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: 상태를 가진 객체 읽기
- question_type: meaning_choice
- concepts: ["def","function","class","stateful_object","state","method"]
- reading_goal: 객체 내부 상태가 method 호출로 바뀌는 구조를 이해한다.
- code:
```python
class Counter:
    def __init__(self):
        self.count = 0

    def add(self):
        self.count += 1
```
- question: add()를 한 번 호출하면 self.count는 어떻게 되는가?
- answer: 1 증가한다
- explanation: Counter()를 만들면 __init__이 self.count를 0으로 초기화한다. add()를 한 번 호출하면 self.count += 1이 현재 값 0에 1을 더해 같은 객체의 count를 1로 바꾼다. 이처럼 method 호출 뒤에도 값이 객체 안에 남아 다음 호출에 이어지는 객체를 stateful object라고 볼 수 있다.
- project_context: 진행률, 큐 위치, 현재 카드 index처럼 상태가 있는 기능을 이해하는 데 필요하다.

## PY31_L10_to_dict_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: to_dict 패턴 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","to_dict","serialization","json","model"]
- reading_goal: 객체를 다시 저장 가능한 dict로 바꾸는 구조를 이해한다.
- code:
```python
class Card:
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
        }
```
- question: to_dict의 역할은?
- answer: 객체를 dict 형태로 바꾼다
- explanation: method는 선택한 id와 title attribute를 새 dict에 복사한다. password나 internal state처럼 빠뜨려야 할 field를 명시적으로 통제할 수 있다. 반환 dict가 곧 JSON인 것은 아니며 nested custom object, datetime, bytes가 포함되면 별도 serialization이 필요하고 schema version도 고려해야 한다.
- project_context: 학습 결과를 JSON으로 저장하거나 API 응답으로 보낼 때 쓰인다.

## PY31_L10_too_early_class_001
- level: 10
- file: python_class_object_datamodel_v31.json
- title: 너무 이른 class화의 단점
- question_type: meaning_choice
- concepts: ["comment","def","function","return","class_design","overengineering","function_vs_class"]
- reading_goal: 간단한 문제를 너무 빨리 class로 만들면 복잡해질 수 있음을 이해한다.
- code:
```python
# 간단한 변환이면 함수 하나로 충분할 수 있다.
def normalize_title(title):
    return title.strip().lower()
```
- question: 이 예시에서 class가 꼭 필요하지 않을 수 있는 이유는?
- answer: 상태 없이 입력 문자열을 변환만 하기 때문
- explanation: normalize_title은 입력 title을 받아 strip과 lower를 적용한 새 문자열만 반환하고, 호출 사이에 유지해야 할 상태가 없다. 이런 단순 변환은 함수 하나만으로 목적이 분명하므로 class를 추가하면 구조만 더 복잡해질 수 있다. 데이터와 여러 관련 동작을 함께 관리할 필요가 생길 때 class 도입을 검토하면 된다.
- project_context: 앱 구조를 개선할 때 class와 함수 중 무엇이 더 단순한지 판단해야 한다.

## PY13_L10_accelerator_choice_001
- level: 10
- file: python_compute_concepts_v13.json
- title: 작업별 가속기 선택 감각
- question_type: meaning_choice
- concepts: ["cpu","gpu","tpu","npu","workload"]
- reading_goal: 작업 성격에 따라 어떤 장치가 어울리는지 비교해서 판단한다.
- code:
```python
Workload examples:
- Many if/else + file I/O: CPU
- Large matrix multiplication: GPU/TPU
- On-device low-power inference: NPU
- General app logic + orchestration: CPU
```
- question: 대형 행렬곱이 많은 딥러닝 학습에 가장 어울리는 선택은?
- answer: GPU 또는 TPU
- explanation: 대형 tensor·행렬 연산이 반복되는 학습은 지원 framework가 있는 GPU나 TPU가 높은 병렬 처리량을 내기 좋은 workload다. 그러나 실제 선택은 model 지원, accelerator memory, data pipeline, 분산 규모, 비용과 이용 가능성에 따라 달라진다. NPU는 주로 특정 on-device inference에 맞춰져 있어 이 질문의 대형 학습에 자동으로 최선인 선택은 아니다.
- project_context: AI 개발 환경/서버 선택 감각을 키운다.

## PY13_L10_accelerator_misconception_001
- level: 10
- file: python_compute_concepts_v13.json
- title: GPU가 모든 코드를 빠르게 하지는 않음
- question_type: meaning_choice
- concepts: ["comment","for","gpu","cpu","bottleneck","misconception"]
- reading_goal: GPU를 쓴다고 모든 파이썬 코드가 자동으로 빨라지는 것은 아니라는 점을 이해한다.
- code:
```python
# This loop is mostly Python/CPU control work.
for file in files:
    text = file.read_text(encoding="utf-8")
    rows.append(parse(text))
```
- question: 이 코드가 GPU만으로 크게 빨라지기 어려운 이유는?
- answer: 파일 I/O와 파이썬 제어 흐름이 중심이기 때문
- explanation: GPU는 텐서/행렬 연산에 강하지만 파일 읽기/분기/파싱은 다른 병목이 될 수 있다. GPU가 모든 코드를 빠르게 하는 것은 아니다. 병렬화하기 어려운 작업이나 파일 입출력, 조건 분기가 많은 코드는 CPU가 더 적합할 수 있다. 따라서 정답은 ‘파일 I/O와 파이썬 제어 흐름이 중심이기 때문’이다.
- project_context: 배치 작업 속도 병목을 해석하는 데 중요하다.
