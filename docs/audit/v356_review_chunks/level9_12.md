# V356 semantic review — Level 9 chunk 12

Cards 221-240 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY45_L09_favicon_404_ignore_001
- level: 9
- file: python_powershell_automation_reliable_scripts_v45.json
- title: favicon 404 읽기
- question_type: meaning_choice
- concepts: ["HTTP_404","favicon","noise_log"]
- reading_goal: 서버 로그에서 무시해도 되는 404와 중요한 404를 구분한다.
- code:
```python
GET /favicon.ico HTTP/1.1" 404
```
- question: favicon.ico 404가 보통 큰 문제가 아닌 이유는?
- answer: 브라우저 아이콘 요청이 실패한 것이고 lesson 로딩과 직접 관련이 적기 때문
- explanation: 중요한 것은 새 lesson JSON과 data 파일들이 200으로 로드되는지다. favicon 404는 브라우저가 자동으로 아이콘 파일을 요청했다가 실패한 경우가 많다. 핵심 데이터 요청 실패와 구분해야 불필요한 디버깅을 줄일 수 있다.
- project_context: 로컬 서버 확인 때 favicon 404는 반복적으로 보였지만 앱 동작에는 영향이 없었다.

## PY45_L09_full_validation_001
- level: 9
- file: python_powershell_automation_reliable_scripts_v45.json
- title: 전체 검증 루틴 읽기
- question_type: meaning_choice
- concepts: ["for","full_validation","side_cards","lesson_cards"]
- reading_goal: lesson 카드뿐 아니라 side card까지 포함해 참조 검증하는 방식을 이해한다.
- code:
```python
for card in lessons:
    for sid in card.get('side_card_ids', []):
        assert sid in side_ids, (card['id'], sid)
```
- question: side_cards까지 포함해 검증해야 하는 이유는?
- answer: lesson 카드가 side card ID를 참조할 수 있기 때문
- explanation: side_card_ids는 lesson ID가 아니라 실제 side card ID를 참조해야 하므로 side_ids 집합만 검사한다. lesson_ids와 union하면 우연히 같은 lesson ID를 쓴 잘못된 참조가 통과할 수 있다. 참조가 optional이면 get(..., [])로 처리하고 실패 시 source card와 sid를 함께 보고한다.
- project_context: v41 초기에 side_card_ids 검증이 오탐났고, 이후 side_cards 포함 방식으로 고쳤다.

## PY45_L09_server_log_200_001
- level: 9
- file: python_powershell_automation_reliable_scripts_v45.json
- title: 서버 로그 200 읽기
- question_type: meaning_choice
- concepts: ["server_log","HTTP_200","local_server"]
- reading_goal: 로컬 서버 로그에서 파일이 정상 로드됐는지 확인하는 방법을 이해한다.
- code:
```python
GET /data/lessons/python_xxx_v45.json?v=... HTTP/1.1" 200
```
- question: 서버 로그의 200은 무엇을 뜻하나?
- answer: 요청한 파일을 정상적으로 제공했다는 뜻
- explanation: 200은 서버가 해당 URL에 성공 status와 response를 보냈다는 뜻이다. 경로 연결을 확인하는 한 단계지만 body가 기대한 JSON인지, schema가 맞는지, browser가 parse·render했는지는 보장하지 않는다. response content-type·body 검증과 browser 오류 확인을 이어서 수행한다.
- project_context: v41~v44에서 로컬 서버 로그로 새 lesson 파일 200 로드를 확인했다.

## PY45_L09_validation_expectation_001
- level: 9
- file: python_powershell_automation_reliable_scripts_v45.json
- title: 검증 기대값 관리 읽기
- question_type: meaning_choice
- concepts: ["if","validation","expected_count","test_assertion"]
- reading_goal: 검증 코드의 기대값이 실제 생성 수와 맞아야 함을 이해한다.
- code:
```python
if len(cards) != 16:
    raise SystemExit('wrong card count')
```
- question: expected_count가 틀리면 어떤 일이 생길 수 있나?
- answer: 실제 데이터는 정상인데 검증만 실패할 수 있다
- explanation: 이 check는 cards가 독립적으로 정한 spec의 16개와 다르면 실패한다. expected 값을 실제 len(cards)에서 다시 계산하면 검증 의미가 사라지고, spec이 틀리면 정상 data도 실패하거나 잘못된 data가 통과할 수 있다. 요구사항 변경과 함께 version 관리하고 실패 때 실제와 expected를 모두 출력한다.
- project_context: 카드 수를 바꿀 때는 expected total도 함께 갱신해야 한다.

## PY2_L09_config_dict_001
- level: 9
- file: python_practical_expansion_v2.json
- title: config dict 읽기
- question_type: output_prediction
- concepts: ["print","dict","config","settings"]
- reading_goal: 설정값을 dict로 모아두고 key로 꺼내 쓰는 구조를 읽는다.
- code:
```python
config = {
    "input": "nodes.jsonl",
    "limit": 100,
    "mode": "fast"
}

print(config["mode"])
```
- question: 출력은?
- answer: fast
- explanation: config dict는 여러 설정값을 한곳에 모아 관리한다. 이 코드에서는 mode key에 연결된 값이 fast이므로 config['mode']는 fast를 반환한다.
- project_context: 배치 실행 옵션과 파이프라인 설정을 읽을 때 자주 보인다.

## PY2_L09_fastapi_endpoint_001
- level: 9
- file: python_practical_expansion_v2.json
- title: FastAPI endpoint 코드 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","fastapi","endpoint","decorator","api"]
- reading_goal: @app.get 경로와 함수가 API 엔드포인트로 연결되는 구조를 읽는다.
- code:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
def health():
    return {"ok": True}
```
- question: 이 코드가 만드는 것에 가까운 것은?
- answer: /api/health 엔드포인트
- explanation: @app.get은 특정 URL 경로로 들어온 GET 요청을 아래 함수에 연결한다. FastAPI에서 API 엔드포인트를 정의할 때 쓰는 기본 패턴이다. 경로, 메서드, 함수가 함께 API의 입구를 만들므로 셋을 묶어서 읽어야 한다.
- project_context: 검색 API, 학습앱 API, RAG API 서버 코드를 읽을 때 중요하다.

## PY50_L09_localstorage_progress_load_001
- level: 9
- file: python_progress_score_mistake_note_v50.json
- title: localStorage progress load 읽기
- question_type: meaning_choice
- concepts: ["localStorage","progress_load","JSON_parse"]
- reading_goal: localStorage에 저장된 진도 문자열을 객체로 복원하는 흐름을 읽는다.
- code:
```python
const raw = localStorage.getItem('pythonReadingProgress');
let progress = {};
if (raw) {
  try {
    progress = validateProgress(JSON.parse(raw));
  } catch (error) {
    showRecoveryOption(error);
  }
}
```
- question: JSON.parse가 필요한 이유는?
- answer: 저장된 JSON 문자열을 다시 객체로 바꾸기 위해
- explanation: JSON.parse는 저장된 text를 객체로 바꾸지만 malformed JSON이면 throw한다. try/catch와 schema validation을 거쳐야 손상·옛 version을 안전하게 다룰 수 있다. 조용히 빈 객체로 덮지 말고 backup·복구 option을 제공한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L09_localstorage_progress_save_001
- level: 9
- file: python_progress_score_mistake_note_v50.json
- title: localStorage progress save 읽기
- question_type: meaning_choice
- concepts: ["localStorage","progress_save","browser_storage"]
- reading_goal: 브라우저 localStorage에 진도 데이터를 저장한다.
- code:
```python
localStorage.setItem('pythonReadingProgress', JSON.stringify(progress))
```
- question: localStorage.setItem의 역할은?
- answer: 브라우저에 문자열 데이터를 저장한다
- explanation: JSON.stringify로 progress를 문자열화해 현재 origin의 localStorage에 저장한다. 새로고침 뒤 남지만 device·browser 사이 sync가 없고 quota, private mode, storage 오류로 setItem이 실패할 수 있다. same-origin script가 읽을 수 있으므로 secret이나 민감한 상세 data에는 적합하지 않다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L09_progress_migration_001
- level: 9
- file: python_progress_score_mistake_note_v50.json
- title: progress migration 읽기
- question_type: meaning_choice
- concepts: ["if","progress_migration","schema_version","compatibility"]
- reading_goal: 진도 저장 구조가 바뀔 때 기존 데이터를 새 구조로 옮긴다.
- code:
```python
version = progress.get('schema_version', 1)
if version == 1:
    progress = migrate_v1_to_v2(progress)
validate_v2(progress)
```
- question: progress migration이 필요한 경우는?
- answer: 진도 저장 구조를 바꿨지만 기존 사용자 데이터를 살려야 할 때
- explanation: schema_version이 없는 legacy data를 v1로 해석하고 명시적 migration 뒤 v2 schema를 검증한다. migration 전에 backup을 만들고 반복 실행에도 같은 결과가 되게 하며, 알 수 없는 미래 version은 억지로 변환하지 않고 중단한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L09_reset_progress_guard_001
- level: 9
- file: python_progress_score_mistake_note_v50.json
- title: reset progress guard 읽기
- question_type: meaning_choice
- concepts: ["if","reset_progress","guard","user_data"]
- reading_goal: 진도 초기화 기능에는 실수 방지 확인 절차가 필요하다.
- code:
```python
if confirm('정말 진도를 초기화할까요?'):
    localStorage.removeItem('pythonReadingProgress')
```
- question: reset progress에 확인창이 필요한 이유는?
- answer: 사용자 학습 기록이 실수로 지워지는 것을 막기 위해
- explanation: confirm은 실수 click을 줄이지만 browser dialog 하나가 삭제 복구를 보장하지는 않는다. 어떤 data가 지워지는지 명시하고 export 또는 짧은 undo window를 제공한 뒤 정확한 key만 삭제한다. 동기화 중인 server data까지 지울지 별도로 확인한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY6_L09_apirouter_001
- level: 9
- file: python_project_expansion_v6.json
- title: APIRouter 파일 읽기
- question_type: meaning_choice
- concepts: ["comment","def","function","return","import","fastapi","APIRouter","endpoint"]
- reading_goal: APIRouter 파일에서 경로와 함수가 어떻게 연결되는지 읽는다.
- code:
```python
# app/api/routes.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {"ok": True}
```
- question: 최종 경로가 /api/health가 되는 이유는?
- answer: main.py의 prefix와 router 경로가 합쳐져서
- explanation: include_router(prefix='/api')와 @router.get('/health')가 합쳐진다. APIRouter는 FastAPI에서 관련 endpoint를 묶는 도구다. 기능별 파일로 router를 나누면 main.py가 짧아지고 API 구조를 찾기 쉬워진다.
- project_context: API 파일이 여러 개로 나뉠 때 실제 URL을 추적하는 훈련이다.

## PY6_L09_card_schema_validation_001
- level: 9
- file: python_project_expansion_v6.json
- title: 카드 스키마 검증 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","schema","validation","list_comprehension"]
- reading_goal: 카드에 필수 필드가 빠졌는지 확인하는 코드를 읽는다.
- code:
```python
def validate_card(card):
    required = ["id", "level", "title", "question", "answer"]
    missing = [key for key in required if key not in card]
    return missing
```
- question: 카드 스키마 검증에서 missing에는 무엇이 들어가는가?
- answer: 빠진 필수 key 목록
- explanation: 리스트 컴프리헨션이 required의 각 key에 대해 key not in card를 검사하고, 존재하지 않는 이름만 missing에 모은다. 따라서 반환값은 빠진 필수 key 목록이며 모두 있으면 빈 리스트다. 이 검사는 key 존재 여부만 보므로 값이 빈 문자열인지, level 타입이 맞는지, answer가 choices에 있는지까지 검증하지는 않는다.
- project_context: 카드 대량 확장 시 앱이 깨지지 않도록 검증하는 데 필요하다.

## PY6_L09_fastapi_router_001
- level: 9
- file: python_project_expansion_v6.json
- title: FastAPI router 연결 읽기
- question_type: meaning_choice
- concepts: ["comment","import","fastapi","router","module"]
- reading_goal: 분리된 API 라우터를 메인 앱에 연결하는 구조를 읽는다.
- code:
```python
# app/main.py
from fastapi import FastAPI
from app.api.routes import router

app = FastAPI()
app.include_router(router, prefix="/api")
```
- question: prefix='/api'의 의미는?
- answer: 라우터 경로 앞에 /api를 붙인다
- explanation: include_router는 별도 router를 앱에 붙이고 prefix를 경로 앞에 붙인다. FastAPI router는 관련 API 경로들을 묶어 관리하는 구조다. 기능별 router를 나누면 main 앱이 단순해지고 endpoint 위치를 찾기 쉬워진다.
- project_context: FastAPI 프로젝트 구조를 읽을 때 app/main.py와 routes 파일 연결을 이해해야 한다.

## PY6_L09_progress_migration_001
- level: 9
- file: python_project_expansion_v6.json
- title: 진도 데이터 migration 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","migration","localStorage","dict"]
- reading_goal: 기존 저장 데이터를 새 구조로 옮기는 코드를 읽는다.
- code:
```python
def migrate_progress(old):
    return {
        "seen": old.get("seen", {}),
        "correct": old.get("correct", {}),
        "confused": old.get("confused", {})
    }
```
- question: old에 confused가 없으면?
- answer: 빈 dict를 쓴다
- explanation: old에 confused key가 없으면 old.get("confused", {})가 새 빈 dict를 반환하므로 정답은 ‘빈 dict를 쓴다’이다. key가 존재하지만 값이 None이면 기본값이 아니라 None이 그대로 들어간다. 또한 seen·correct·confused의 기존 dict를 복사하지 않고 같은 객체 참조를 새 구조에 넣으므로, 실제 migration에서는 타입 검증과 필요 시 복사를 함께 고려해야 한다.
- project_context: 앱 데이터 구조를 바꿀 때 기존 사용자 진도를 보존하는 데 필요하다.

## PY6_L09_service_worker_install_001
- level: 9
- file: python_project_expansion_v6.json
- title: Service Worker install 이벤트 읽기
- question_type: meaning_choice
- concepts: ["service_worker","pwa","cache"]
- reading_goal: PWA가 설치될 때 캐시를 준비하는 흐름을 읽는다.
- code:
```python
self.addEventListener("install", function(event) {
  event.waitUntil(caches.open("app-v1"));
});
```
- question: caches.open('app-v1')의 목적은?
- answer: 캐시 저장소 열기
- explanation: install 이벤트에서 event.waitUntil(...)은 전달한 Promise가 끝날 때까지 설치 작업을 연장한다. caches.open("app-v1")은 이름이 같은 Cache를 열거나 없으면 새로 만들므로 정답은 ‘캐시 저장소 열기’다. 하지만 이 코드에는 cache.add(), addAll(), put()이 없어서 파일은 하나도 저장하지 않는다. 오프라인 화면을 만들려면 열린 Cache에 실제 응답을 넣고 fetch 처리에서도 그 캐시를 사용해야 한다.
- project_context: 학습앱을 모바일 PWA처럼 발전시킬 때 필요하다.

## PY18_L09_circular_import_001
- level: 9
- file: python_project_structure_imports_v18.json
- title: 순환 import 문제 읽기
- question_type: meaning_choice
- concepts: ["comment","def","function","return","import","circular_import","module","dependency"]
- reading_goal: 두 모듈이 서로를 import할 때 생길 수 있는 문제를 이해한다.
- code:
```python
# a.py
from b import run_b

def run_a():
    return run_b()

# b.py
from a import run_a

def run_b():
    return "B"
```
- question: 이 구조의 위험은?
- answer: a와 b가 서로 import해서 순환 import 문제가 생길 수 있다
- explanation: 모듈 간 의존성이 서로 물리면 import 시점에 아직 정의되지 않은 이름을 참조할 수 있다. 순환 import는 두 파일이 서로를 import하면서 초기화 순서가 꼬이는 문제다. 공통 코드를 별도 파일로 빼거나 의존 방향을 단순하게 만들어야 한다.
- project_context: 파일이 많아지는 앱/파이프라인에서 의존성 방향을 정리해야 하는 이유다.

## PY18_L09_exception_boundary_001
- level: 9
- file: python_project_structure_imports_v18.json
- title: 예외 경계 함수 읽기
- question_type: meaning_choice
- concepts: ["def","function","exception","try_except","pipeline","error_handling"]
- reading_goal: 파이프라인 전체 실패를 잡아 상태를 기록하는 구조를 읽는다.
- code:
```python
def main():
    try:
        run_pipeline()
        finalize(status="ok")
    except Exception as e:
        finalize(status="error", error=str(e))
        raise
```
- question: except 안에서 raise를 다시 하는 이유는?
- answer: 오류를 기록한 뒤 호출자에게도 실패를 알리기 위해
- explanation: run_pipeline이나 성공 finalize에서 예외가 나면 except가 error 상태를 기록하려 한 뒤 bare raise로 현재 예외와 traceback을 다시 전달한다. 따라서 호출자나 자동화 시스템도 실패를 인식할 수 있다. 다만 error finalize 자체가 실패하면 원래 예외가 가려질 수 있고, str(e)에 민감 정보가 있을 수 있으므로 실제 경계에서는 두 위험도 처리해야 한다.
- project_context: runs 테이블에 ok/error를 기록하는 작업 흐름과 연결된다.

## PY18_L09_logging_config_001
- level: 9
- file: python_project_structure_imports_v18.json
- title: logging 설정 읽기
- question_type: meaning_choice
- concepts: ["import","logging","level","debugging"]
- reading_goal: print 대신 logging을 쓰는 기본 구조를 읽는다.
- code:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("pipeline started")
```
- question: logger.info는 언제 주로 쓰는가?
- answer: 실행 상태를 로그로 남길 때
- explanation: logging config는 로그 수준과 출력 형식을 정하는 설정이다. 실행 상태, 오류, 디버그 정보를 일관된 형식으로 남길 수 있다. logger.info는 정상 진행 상황을 남길 때 주로 쓰고, 문제 원인 분석에는 warning이나 error와 구분해 읽는다.
- project_context: 배치 작업, 서버, RAG 파이프라인에서 어디까지 실행됐는지 추적하는 데 중요하다.

## PY18_L09_module_dependency_001
- level: 9
- file: python_project_structure_imports_v18.json
- title: 모듈 의존성 흐름 읽기
- question_type: order_choice
- concepts: ["comment","def","function","return","import","module","dependency","pipeline"]
- reading_goal: 한 모듈이 다른 모듈의 함수를 가져와 파이프라인을 구성하는 흐름을 읽는다.
- code:
```python
# pipeline.py
from .loader import load_documents
from .chunker import make_chunks
from .embedder import embed_chunks

def run():
    docs = load_documents()
    chunks = make_chunks(docs)
    vectors = embed_chunks(chunks)
    return vectors
```
- question: run() 안에서 실행 순서가 맞는 것은?
- answer: load_documents → make_chunks → embed_chunks
- explanation: module dependency는 한 모듈이나 단계가 다른 모듈의 기능·결과에 의존하는 관계다. 이 흐름에서는 먼저 load_documents로 문서를 읽고, 그 결과를 make_chunks가 받아 chunk로 만들며, 다음 embed_chunks가 그 chunk를 임베딩한다. 따라서 실행·데이터 의존 순서는 load_documents → make_chunks → embed_chunks다.
- project_context: 수집→청킹→임베딩→검색으로 이어지는 실제 RAG 파이프라인 독해다.

## PY51_L09_cache_update_message_001
- level: 9
- file: python_pwa_install_update_ux_v51.json
- title: cache update message 읽기
- question_type: meaning_choice
- concepts: ["cache_update","user_message","PWA"]
- reading_goal: 캐시가 갱신되는 동안 사용자에게 상태를 안내하는 메시지를 이해한다.
- code:
```python
showNotice('새 데이터를 준비하는 중입니다')
```
- question: cache update message의 역할은?
- answer: 앱이 멈춘 것이 아니라 업데이트 중임을 알려준다
- explanation: cache update message는 데이터나 앱 파일 갱신 상태를 알려주는 메시지다. 데이터 파일이 많아질수록 사용자가 업데이트 흐름을 알 수 있어야 한다. 갱신 안내가 없으면 사용자는 새 버전이 적용됐는지 오래된 캐시를 보는지 알기 어렵다. 따라서 정답은 ‘앱이 멈춘 것이 아니라 업데이트 중임을 알려준다’이다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.
