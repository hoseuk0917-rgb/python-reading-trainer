# V356 semantic review — Level 9 chunk 7

Cards 121-140 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY17_L09_regex_replace_block_001
- level: 9
- file: python_debug_logs_cache_git_v17.json
- title: 정규식 블록 교체 읽기
- question_type: meaning_choice
- concepts: ["regex","replace","swap_in","function"]
- reading_goal: 함수 하나를 정규식으로 찾아 통째로 교체하는 패턴을 읽는다.
- code:
```python
$pattern = '(?s)function renderSideCards\(card\) \{[\s\S]*?\r?\n\}\r?\n\r?\nfunction markSeen'
$app = [regex]::Replace($app, $pattern, $newRenderSideCards + "`r`n`r`nfunction markSeen")
```
- question: 이 코드의 목적은?
- answer: renderSideCards 함수만 찾아 새 블록으로 교체한다
- explanation: Replace는 renderSideCards 선언에서 뒤의 markSeen 선언까지 정규식으로 찾고, 새 함수 문자열 뒤에 markSeen 선언을 다시 붙인다. 이 패턴은 중간에 비슷한 문자열이나 예상과 다른 줄바꿈·함수 배치가 있으면 잘못된 범위를 바꾸거나 아무것도 바꾸지 않을 수 있다. 소스 코드는 가능하면 구문 분석기나 명확한 수동 patch로 바꾸고, 변경 건수와 diff를 반드시 확인해야 한다.
- project_context: 큰 소스 파일에서 함수 단위 변경 범위와 diff 검증의 중요성을 보여 주는 예시다.

## PY28_L09_http_404_001
- level: 9
- file: python_debugging_error_routines_v28.json
- title: HTTP 404 로그 읽기
- question_type: meaning_choice
- concepts: ["HTTP","404","static_server","path"]
- reading_goal: 정적 서버 로그에서 404가 어떤 의미인지 이해한다.
- code:
```python
127.0.0.1 - - "GET /data/lessons/missing.json HTTP/1.1" 404 -
127.0.0.1 - - "GET /src/pwa/app.js HTTP/1.1" 200 -
```
- question: missing.json의 404 의미는?
- answer: 서버가 해당 경로의 파일을 찾지 못했다
- explanation: 404는 경로에 해당 리소스가 없다는 뜻이다. app.js의 200과 구분해서 봐야 한다. HTTP 404는 요청한 파일이나 API 경로를 서버가 찾지 못했다는 뜻이다. URL 철자, 상대경로, 서버 루트 위치를 먼저 확인해야 한다.
- project_context: lessonFiles에 파일명을 잘못 넣었을 때 바로 보이는 로그다.

## PY28_L09_http_500_001
- level: 9
- file: python_debugging_error_routines_v28.json
- title: HTTP 500 읽기
- question_type: meaning_choice
- concepts: ["return","HTTP","500","server_error","api"]
- reading_goal: API 서버의 500 오류가 클라이언트보다 서버 내부 문제에 가깝다는 점을 이해한다.
- code:
```python
GET /api/search?q=rag 500 Internal Server Error

Traceback:
  File "search_api.py", line 41, in search
    return router.search(q)
```
- question: 500 오류에서 먼저 봐야 하는 곳은?
- answer: 서버 traceback과 API 내부 로그
- explanation: 500은 서버 내부 오류다. 클라이언트 요청 형식도 보지만 우선 서버 로그가 중요하다. HTTP 500은 서버 내부에서 오류가 났다는 뜻이다. 클라이언트 요청만 보지 말고 서버 로그, traceback, 최근 배포 변경을 함께 확인해야 한다.
- project_context: FastAPI 검색 서버나 로컬 API가 죽을 때 원인을 찾는 루틴이다.

## PY28_L09_module_not_found_001
- level: 9
- file: python_debugging_error_routines_v28.json
- title: ModuleNotFoundError 환경 확인
- question_type: meaning_choice
- concepts: ["print","ModuleNotFoundError","venv","pip","environment"]
- reading_goal: 패키지를 설치했는데도 import가 안 될 때 실행 Python을 확인한다.
- code:
```python
ModuleNotFoundError: No module named "fastapi"

python -c "import sys; print(sys.executable)"
python -m pip show fastapi
```
- question: sys.executable을 찍는 이유는?
- answer: 실제로 실행 중인 Python 경로를 확인하기 위해
- explanation: sys.executable은 실제 code를 실행한 interpreter path를 보여 주고 같은 python -m pip show는 그 environment에 FastAPI distribution이 있는지 확인한다. 설치했어도 다른 venv나 interpreter를 쓰면 import하지 못한다. local file 이름이 package를 가리는지와 sys.path도 함께 본다.
- project_context: 로컬 venv, GPU 서버, FastAPI 검색 API를 오갈 때 핵심 확인 루틴이다.

## PY28_L09_port_in_use_001
- level: 9
- file: python_debugging_error_routines_v28.json
- title: 포트 충돌 오류 읽기
- question_type: meaning_choice
- concepts: ["port","server","address_in_use"]
- reading_goal: 서버 실행 시 이미 포트가 사용 중이라는 오류를 이해한다.
- code:
```python
OSError: [Errno 98] Address already in use

python -m http.server 8790 --bind 127.0.0.1
```
- question: 이 오류의 의미는?
- answer: 8790 포트를 이미 다른 프로세스가 사용 중일 수 있다
- explanation: 같은 포트에 서버를 두 개 띄우면 충돌한다. 기존 서버를 끄거나 다른 포트를 써야 한다. 포트 충돌은 이미 다른 프로그램이 같은 포트를 쓰고 있을 때 발생한다. 어떤 프로세스가 포트를 점유했는지 확인하고 종료하거나 다른 포트로 바꿔야 한다.
- project_context: run_local_server.ps1을 여러 번 켰을 때 확인해야 하는 오류다.

## PY4_L09_cache_dict_001
- level: 9
- file: python_deep_expansion_v4.json
- title: dict cache 패턴 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","cache","dict","performance"]
- reading_goal: 이미 계산한 결과를 dict에 저장해 재사용하는 코드를 읽는다.
- code:
```python
cache = {}

def get_summary(doc_id):
    if doc_id in cache:
        return cache[doc_id]
    summary = summarize(doc_id)
    cache[doc_id] = summary
    return summary
```
- question: cache의 목적은?
- answer: 같은 요약을 반복 계산하지 않기
- explanation: cache dict는 이미 계산한 결과를 저장해 재사용하는 구조다. 같은 입력이 cache에 있으면 summarize를 다시 호출하지 않아도 된다. 비싼 계산이나 API 호출 결과를 저장할 때 특히 효과가 크지만 오래된 값 갱신 기준도 필요하다. 따라서 반환/호출 결과는 ‘같은 요약을 반복 계산하지 않기’이다.
- project_context: LLM 비용 절감, API 호출 절감, 앱 속도 개선에 연결된다.

## PY4_L09_evidence_check_001
- level: 9
- file: python_deep_expansion_v4.json
- title: 근거 없는 답변 차단 흐름
- question_type: meaning_choice
- concepts: ["if","def","function","return","evidence","validation","rag"]
- reading_goal: 근거 문서가 없으면 답변 생성을 막는 방어 코드를 읽는다.
- code:
```python
def answer(question, docs):
    if not docs:
        return "근거 문서가 부족합니다."
    return call_llm(build_prompt(question, docs))
```
- question: docs가 비어 있으면 어떻게 되는가?
- answer: 근거 부족 메시지를 반환한다
- explanation: docs가 빈 목록처럼 falsy이면 근거 부족 메시지를 즉시 반환하고 call_llm은 실행하지 않는다. 다만 docs가 하나라도 있다는 사실만 확인할 뿐, 문서가 질문과 관련 있는지·신뢰할 수 있는지·답변이 문서를 따르는지는 검증하지 않는다. 따라서 이 분기는 빈 근거 호출을 막는 한 단계이지 환각을 차단하는 완전한 보장은 아니다.
- project_context: Evidence-first RAG와 환각 방지에 직접 연결된다.

## PY4_L09_prompt_template_001
- level: 9
- file: python_deep_expansion_v4.json
- title: prompt template 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","prompt","template","llm"]
- reading_goal: 질문과 문서를 템플릿에 넣어 프롬프트를 만드는 코드를 읽는다.
- code:
```python
def build_prompt(question, docs):
    context = "\n".join(docs)
    return f"Context:\n{context}\n\nQuestion: {question}"
```
- question: 이 함수는 무엇을 만드는가?
- answer: LLM에 넣을 프롬프트
- explanation: docs의 각 문자열을 줄바꿈으로 합쳐 context를 만들고, question과 함께 고정 형식 문자열로 반환한다. 따라서 결과는 LLM에 전달할 프롬프트다. docs 항목이 문자열이 아니면 join에서 오류가 나며, 형식을 고정했다고 해서 모델이 지시를 반드시 따르거나 문서 안의 악성 지시를 무시하는 것은 아니다.
- project_context: RAG와 에이전트 코드에서 핵심이다.

## PY4_L09_rerank_flow_001
- level: 9
- file: python_deep_expansion_v4.json
- title: rerank 흐름 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","rerank","retrieval","score"]
- reading_goal: 검색 후보를 다시 점수화해 상위 결과를 고르는 흐름을 읽는다.
- code:
```python
def rerank(query, hits):
    scored = []
    for hit in hits:
        scored.append((score_pair(query, hit), hit))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [hit for score, hit in scored[:5]]
```
- question: rerank의 목적은?
- answer: 검색 후보를 다시 점수순으로 정렬한다
- explanation: 각 hit와 query의 score_pair 결과를 (점수, hit)로 저장하고, key가 점수만 꺼내도록 지정해 내림차순 정렬한 뒤 최대 5개 hit를 반환한다. 점수가 같은 경우에도 hit 객체끼리 비교하지 않으므로 dict 같은 비교 불가능한 객체에서 생길 수 있는 오류를 피한다. 위쪽 결과가 실제로 더 관련 있는지는 score_pair의 품질에 달려 있다.
- project_context: RAG 품질을 높이는 2단계 검색 구조에 자주 나온다.

## PY23_L09_fetch_json_fail_001
- level: 9
- file: python_deploy_pwa_cache_storage_v23.json
- title: JSON fetch 실패 처리 읽기
- question_type: meaning_choice
- concepts: ["if","return","fetch","json","error_handling","http_status"]
- reading_goal: fetch 응답이 실패하면 명확한 오류를 던지는 코드를 읽는다.
- code:
```python
async function loadJson(path) {
  const res = await fetch(withDataVersion(path));
  if (!res.ok) throw new Error("failed to load " + path + ": " + res.status);
  return await res.json();
}
```
- question: res.ok가 false이면 어떻게 되는가?
- answer: Error를 던지고 JSON 파싱으로 넘어가지 않는다
- explanation: res.ok가 false이면 Error를 던져 이 함수 안에서는 res.json을 실행하지 않는다. 2xx여도 body가 invalid JSON이면 res.json 자체가 reject할 수 있고, network error는 response를 받기 전 fetch에서 reject한다. caller는 두 종류를 catch해 path와 안전한 error context를 표시하고 app 전체가 무한 Loading에 남지 않게 해야 한다.
- project_context: lesson JSON 하나가 404일 때 앱 전체 Loading이 멈추는 원인을 잡는 데 필요하다.

## PY23_L09_localstorage_load_001
- level: 9
- file: python_deploy_pwa_cache_storage_v23.json
- title: localStorage 불러오기 fallback 읽기
- question_type: meaning_choice
- concepts: ["localStorage","fallback","JSON.parse","browser_storage"]
- reading_goal: 저장된 값이 없을 때 기본값을 쓰는 구조를 읽는다.
- code:
```python
const raw = localStorage.getItem("ptr_progress");
const progress = raw ? JSON.parse(raw) : { seen: [], unknown: [] };
```
- question: raw가 없으면 progress는 무엇이 되는가?
- answer: { seen: [], unknown: [] }
- explanation: raw가 null이면 삼항식이 기본 object를 선택하므로 정답과 같다. raw가 존재하지만 invalid JSON이면 JSON.parse가 예외를 내며 이 code에는 fallback이 없다. 안전한 loader는 try/catch로 parse를 감싸고 parsed value가 기대한 schema인지 확인한 뒤, 오류를 기록하고 명시적으로 기본값을 선택해야 한다.
- project_context: 처음 앱을 여는 사용자도 빈 진행상황으로 시작하게 만드는 코드다.

## PY23_L09_localstorage_progress_001
- level: 9
- file: python_deploy_pwa_cache_storage_v23.json
- title: localStorage 진행상황 저장 읽기
- question_type: meaning_choice
- concepts: ["localStorage","progress","json","browser_storage"]
- reading_goal: 브라우저에 학습 진행상황을 저장하는 구조를 읽는다.
- code:
```python
const progress = { seen: ["PY1_001"], unknown: [] };
localStorage.setItem("ptr_progress", JSON.stringify(progress));
```
- question: JSON.stringify(progress)를 쓰는 이유는?
- answer: 객체를 localStorage에 저장 가능한 문자열로 바꾸기 위해
- explanation: localStorage는 string만 저장하므로 JSON.stringify가 object를 JSON string으로 직렬화한다. 데이터는 origin별 browser storage에 남고 같은 origin의 script가 읽을 수 있으므로 secret이나 민감한 개인 정보 저장에는 적합하지 않다. 동기 API라 큰 값을 자주 쓰면 UI를 막을 수 있고 quota·private mode·storage 정책 때문에 setItem이 실패할 수도 있다.
- project_context: 학습/모름/메모/오늘 큐 상태가 브라우저에 남는 방식이다.

## PY23_L09_promise_all_001
- level: 9
- file: python_deploy_pwa_cache_storage_v23.json
- title: Promise.all lesson 로딩 읽기
- question_type: meaning_choice
- concepts: ["promise_all","fetch","async","json"]
- reading_goal: 여러 lesson 파일을 병렬로 로딩하는 구조와 실패 특성을 이해한다.
- code:
```python
const lessonArrays = await Promise.all(
  lessonFiles.map((path) => loadJson(path))
);
const cards = lessonArrays.flat();
```
- question: Promise.all의 특징은?
- answer: 여러 요청 중 하나라도 실패하면 전체가 실패할 수 있다
- explanation: map이 각 loadJson promise를 만들고 Promise.all은 입력 순서대로 결과를 모아 모든 promise가 fulfill될 때 resolve한다. 하나가 reject되면 전체 await가 reject하지만 이미 시작한 다른 fetch를 자동으로 cancel하지는 않는다. 필수 파일은 fail-fast로 처리하고 선택 파일은 Promise.allSettled나 개별 catch로 fallback할지 정책을 나눈다.
- project_context: lessonFiles에 없는 파일을 넣으면 앱이 Loading에서 멈출 수 있는 이유다.

## PY103_L09_branch_conflict_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: branch와 merge conflict 읽기
- question_type: meaning_choice
- concepts: ["branch","merge","conflict"]
- reading_goal: 분리 작업 흐름과 충돌 해결의 의미를 이해한다.
- code:
```python
<<<<<<< HEAD
old line
=======
new line
>>>>>>> feature
```
- question: 이 표시는 무엇을 뜻하는가?
- answer: merge conflict가 남아 있어 사람이 선택해야 한다
- explanation: branch는 main과 분리된 작업 흐름을 만들고, merge는 변경을 합친다. 같은 부분을 서로 다르게 고치면 Git이 자동으로 선택하지 못해 conflict marker를 남긴다. 이 표시는 코드로 남겨 두면 안 되고 사람이 어떤 내용을 유지할지 고른 뒤 제거해야 한다. 충돌 해결 후에는 다시 검증하고 commit해야 한다. 충돌 표시를 해결한 뒤에는 단순히 marker를 지우는 데서 끝내지 말고, 남긴 코드가 실제로 실행되고 검증을 통과하는지 확인해야 한다.
- project_context: 협업이나 큰 실험 작업을 이해하기 위한 Git 기초다.

## PY103_L09_cuda_oom_batch_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: CUDA out of memory와 batch size
- question_type: meaning_choice
- concepts: ["cuda_oom","vram","batch_size"]
- reading_goal: GPU 메모리 부족의 주요 원인을 읽는다.
- code:
```python
CUDA out of memory
batch_size = 16
```
- question: 이 오류를 줄이는 대표 방법은?
- answer: batch size나 입력 길이, 모델 크기를 줄인다
- explanation: CUDA out of memory는 GPU 메모리인 VRAM이 부족할 때 발생한다. 원인은 모델 크기, batch size, 입력 길이, dtype, 동시 실행 프로세스일 수 있다. batch size를 줄이면 한 번에 올리는 데이터가 줄어 메모리 사용량이 낮아질 수 있다. nvidia-smi로 현재 사용량을 보고, 코드에서 어떤 값이 메모리를 키우는지 함께 확인해야 한다.
- project_context: GPU 서버에서 학습/추론 실패를 해석하는 기본 카드다.

## PY103_L09_cuda_visible_devices_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: CUDA_VISIBLE_DEVICES 읽기
- question_type: meaning_choice
- concepts: ["CUDA_VISIBLE_DEVICES","gpu","environment_variable"]
- reading_goal: 보이는 GPU를 제한하는 환경변수의 의미를 이해한다.
- code:
```python
CUDA_VISIBLE_DEVICES=0 python train.py
```
- question: 이 설정의 의미로 가장 가까운 것은?
- answer: 프로세스가 볼 GPU를 0번으로 제한한다
- explanation: CUDA_VISIBLE_DEVICES=0은 이 프로세스에 물리 장치 목록의 0번 GPU만 보이게 한다. 노출된 장치는 프로세스 안에서 다시 cuda:0으로 번호가 매겨지므로 여러 장치를 골라 순서를 바꾸면 논리 번호와 물리 번호가 달라질 수 있다. 변수 변경은 GPU 메모리를 비우거나 장치 사용을 보장하지 않으며, 실행 전에 설정해야 한다.
- project_context: 다중 GPU 서버나 공유 GPU 환경에서 필요한 카드다.

## PY103_L09_dotenv_gitignore_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: .env와 .gitignore 읽기
- question_type: meaning_choice
- concepts: ["dotenv","gitignore","secret"]
- reading_goal: 비밀 설정 파일을 Git에 올리지 않는 이유를 이해한다.
- code:
```python
.env
.env.example
.gitignore
```
- question: 실제 API key가 들어간 .env를 보통 Git에 올리지 않는 이유는?
- answer: 비밀값 유출을 막기 위해
- explanation: .env에는 API key 같은 비밀 설정이 들어갈 수 있어 보통 .gitignore로 새 파일의 추적을 막고, 변수 이름과 가짜 예시만 담은 .env.example을 공유한다. 이미 Git이 추적 중인 .env에는 ignore 규칙만 추가해도 효과가 없으므로 추적 해제 여부를 확인해야 한다. 비밀이 commit되었다면 파일 삭제만으로 해결되지 않으며 키를 즉시 폐기·재발급하고 이력 노출도 대응한다.
- project_context: API key를 안전하게 저장하고 배포 설정과 구분하는 카드다.

## PY103_L09_env_var_os_getenv_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: 환경변수 os.getenv 읽기
- question_type: meaning_choice
- concepts: ["import","environment_variable","os.getenv","config"]
- reading_goal: 코드 밖 설정값을 Python에서 읽는 흐름을 이해한다.
- code:
```python
import os
api_key = os.getenv('OPENAI_API_KEY')
```
- question: 이 코드가 값을 가져오는 위치는?
- answer: 코드 밖 환경변수
- explanation: 환경변수는 코드 밖에서 주입되는 설정값이다. os.getenv('OPENAI_API_KEY')는 코드 안에 실제 키를 쓰지 않고, 실행 환경에 설정된 값을 읽는다. API key나 DB 주소처럼 환경마다 달라지는 값은 코드에 직접 넣지 않는 것이 안전하다. 값이 없을 때 기본값을 쓰는지, 오류를 내는지 함께 확인해야 배포 환경 문제를 빠르게 찾을 수 있다.
- project_context: API key와 비밀 설정을 안전하게 다루는 기초다.

## PY103_L09_git_pull_tracking_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: pull과 origin/main 상태 읽기
- question_type: meaning_choice
- concepts: ["git_pull","origin","remote_tracking"]
- reading_goal: 원격 저장소와 로컬 브랜치의 관계를 이해한다.
- code:
```python
git pull origin main
git --no-pager log --oneline -3
```
- question: git pull의 목적에 가장 가까운 것은?
- answer: 원격 main의 변경을 로컬로 가져와 반영한다
- explanation: git pull origin main은 origin의 main을 fetch한 뒤 그 내용을 현재 checkout한 브랜치에 통합한다. 현재 브랜치가 main일 때는 보통 로컬 main을 갱신하지만, 다른 브랜치에서 실행하면 그 브랜치에 main을 합칠 수 있다. 실행 전 git status와 현재 브랜치를 확인하고, 작업 중 변경이 있다면 충돌 가능성을 먼저 처리한다.
- project_context: 원격 백업과 다른 PC 작업 연속성을 이해하기 위한 카드다.

## PY103_L09_module_not_found_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: ModuleNotFoundError 환경 확인
- question_type: meaning_choice
- concepts: ["ModuleNotFoundError","import","venv"]
- reading_goal: 설치 여부보다 현재 환경 불일치를 먼저 확인한다.
- code:
```python
ModuleNotFoundError: No module named 'requests'
```
- question: 이 오류를 볼 때 먼저 확인할 것으로 가장 적절한 것은?
- answer: 현재 Python/venv와 pip 설치 환경이 같은지
- explanation: ModuleNotFoundError는 현재 실행 중인 Python의 import 경로에서 모듈을 찾지 못했다는 뜻이다. requests가 설치되지 않았을 수도 있고, 다른 venv의 pip로 설치했거나 import 이름과 배포 패키지 이름을 혼동했을 수도 있다. python -m pip --version과 python -m pip show requests로 같은 환경인지 확인한 뒤 필요한 경우에만 설치한다.
- project_context: 패키지 설치 후에도 import가 실패하는 상황을 다룬다.
