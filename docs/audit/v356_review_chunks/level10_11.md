# V356 semantic review — Level 10 chunk 11

Cards 201-220 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY53_L10_performance_measurement_001
- level: 10
- file: python_performance_large_card_ux_v53.json
- title: performance measurement 읽기
- question_type: meaning_choice
- concepts: ["performance_measurement","console_time","profiling"]
- reading_goal: 느낌이 아니라 측정값으로 성능을 확인하는 방식을 이해한다.
- code:
```python
console.time('filter')
filterCards(query)
console.timeEnd('filter')
```
- question: console.time을 쓰는 이유는?
- answer: 특정 작업이 얼마나 걸리는지 측정하기 위해
- explanation: console.time/timeEnd는 같은 label 사이의 경과 시간을 간단히 본다. 한 번의 devtools 측정은 JIT warmup, cache, background work 영향이 커서 대표 성능이 아닐 수 있다. Performance API와 반복 benchmark, 실제 device percentile을 사용하고 filter result가 사용되지 않아 optimizer가 영향을 주지 않는지도 확인한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY45_L10_atomic_commit_001
- level: 10
- file: python_powershell_automation_reliable_scripts_v45.json
- title: atomic commit 읽기
- question_type: meaning_choice
- concepts: ["atomic_commit","git_commit","change_set"]
- reading_goal: 하나의 버전 확장을 하나의 작은 커밋으로 묶는 이유를 이해한다.
- code:
```python
git add data/lessons/v45.json src/pwa/app.js
git commit -m "Add PowerShell automation reading cards"
```
- question: atomic commit의 장점은?
- answer: 문제가 생겼을 때 어떤 변경이 원인인지 찾기 쉽다
- explanation: 버전별 lesson JSON과 app.js 연결만 한 커밋에 넣으면 이력 추적이 쉽다. atomic commit은 하나의 의미 있는 변경만 묶어 커밋하는 습관이다. 검증 통과 결과와 관련 파일만 포함하면 나중에 되돌리거나 추적하기 쉽다. 따라서 정답은 ‘문제가 생겼을 때 어떤 변경이 원인인지 찾기 쉽다’이다.
- project_context: v41, v42, v43, v44가 각각 하나의 기능 커밋으로 남아 있다.

## PY45_L10_rollback_with_git_001
- level: 10
- file: python_powershell_automation_reliable_scripts_v45.json
- title: git rollback 읽기
- question_type: meaning_choice
- concepts: ["rollback","git_restore","recovery"]
- reading_goal: 자동화 적용이 꼬였을 때 Git으로 변경을 되돌리는 방법을 이해한다.
- code:
```python
git restore src/pwa/app.js
Remove-Item data/lessons/bad_v45.json
```
- question: git restore가 필요한 경우는?
- answer: 수정이 잘못 적용되어 추적 파일을 마지막 커밋 상태로 되돌릴 때
- explanation: 기본 git restore app.js는 작업 트리의 unstaged 변경을 index 내용으로 덮어써 사용자 수정을 잃게 할 수 있고 stage된 변경은 남을 수 있다. Remove-Item은 untracked file을 복구 불가능하게 지운다. 실행 전 exact target, status, git diff와 --cached diff를 확인하고 필요한 내용은 patch나 backup으로 보존한다.
- project_context: v41 초기에 상태 확인 후 필요하면 app.js와 생성 파일을 분리해 복구할 수 있었다.

## PY2_L10_agent_tool_001
- level: 10
- file: python_practical_expansion_v2.json
- title: 조건 기반 도구 라우팅 읽기
- question_type: meaning_choice
- concepts: ["if","def","return","agent","tool_calling","function","workflow"]
- reading_goal: if 조건이 task 문자열을 검사해 호출할 함수를 고르는 흐름을 읽는다.
- code:
```python
def run_agent(task):
    if "search" in task:
        return search_tool(task)
    if "file" in task:
        return file_tool(task)
    return chat_model(task)
```
- question: 이 코드의 핵심은?
- answer: task 문자열에 따라 호출할 함수를 고른다
- explanation: 이 선택은 모델이 아니라 run_agent 안의 if 문이 수행한다. task에 search가 있으면 search_tool을 즉시 호출해 반환하고, 그렇지 않고 file이 있으면 file_tool을 호출하며, 둘 다 없으면 chat_model을 호출한다. search와 file이 모두 있으면 첫 번째 조건의 return 때문에 search_tool만 실행된다. 도구 결과를 다시 해석하는 단계는 이 코드에 없다.
- project_context: 코드 에이전트나 자동화 에이전트의 기본 흐름을 이해하는 데 좋다.

## PY2_L10_rag_pipeline_001
- level: 10
- file: python_practical_expansion_v2.json
- title: RAG 파이프라인 함수 흐름 읽기
- question_type: reverse_inference
- concepts: ["def","function","return","rag","embedding","retrieval","llm","pipeline"]
- reading_goal: 검색 후 모델에 근거를 넣는 함수 흐름을 읽는다.
- code:
```python
def answer_question(question):
    query_vec = embed(question)
    docs = search_similar_docs(query_vec)
    prompt = build_prompt(question, docs)
    return call_llm(prompt)
```
- question: 이 함수의 목적에 가장 가까운 것은?
- answer: 질문과 관련 문서를 검색해 LLM 답변을 만든다
- explanation: question을 embed해 query_vec을 만들고, 그 벡터로 docs를 검색한 뒤, 질문과 문서를 prompt에 넣어 LLM을 호출한다. 따라서 질문과 관련 문서를 검색해 답변을 만드는 RAG 흐름이다. 다만 검색된 문서가 실제로 관련 있는지와 생성된 답이 근거에 맞는지는 이 함수 구조만으로 보장되지 않으므로 별도 평가가 필요하다.
- project_context: 검색 증강 생성 코드를 읽을 때 검색 단계와 생성 단계를 분리해 추적하는 예제다.

## PY50_L10_export_progress_001
- level: 10
- file: python_progress_score_mistake_note_v50.json
- title: export progress 읽기
- question_type: meaning_choice
- concepts: ["export_progress","backup","user_data"]
- reading_goal: 진도 데이터를 파일로 내보내 백업하고 옮기는 흐름을 읽는다.
- code:
```python
blob = new Blob([JSON.stringify(progress)], {type: 'application/json'})
download(blob, 'progress_backup.json')
```
- question: export progress의 목적은?
- answer: 학습 기록을 백업하거나 다른 기기로 옮기기 위해
- explanation: export는 계정 sync가 없는 환경에서 progress를 backup·이동하게 한다. file에 schema version, exported_at, app version과 integrity check를 넣고 민감한 user identifier·note는 필요한지 검토한다. download 성공과 나중 import 가능성을 test해야 실제 backup이 된다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L10_import_progress_001
- level: 10
- file: python_progress_score_mistake_note_v50.json
- title: import progress 읽기
- question_type: meaning_choice
- concepts: ["import_progress","restore","validation"]
- reading_goal: 백업한 진도 파일을 다시 불러올 때 검증한다.
- code:
```python
data = JSON.parse(file_text)
clean = validateAndMigrateProgress(data)
backupCurrentProgress()
localStorage.setItem('pythonReadingProgress', JSON.stringify(clean))
```
- question: import progress 전에 validateProgress가 필요한 이유는?
- answer: 깨진 파일이나 다른 형식의 데이터를 막기 위해
- explanation: 외부 file은 untrusted input이므로 size, schema, type, 허용 key와 version을 검증·migration한 clean data만 저장한다. 기존 progress를 먼저 backup하고 overwrite·merge policy를 사용자에게 알려야 한다. parse 성공만으로 안전하거나 호환된다는 뜻은 아니다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L10_privacy_of_progress_001
- level: 10
- file: python_progress_score_mistake_note_v50.json
- title: progress privacy 읽기
- question_type: meaning_choice
- concepts: ["comment","privacy","progress_data","local_storage"]
- reading_goal: 학습 기록도 사용자 데이터이므로 저장 위치와 공개 범위를 신경 쓴다.
- code:
```python
localStorage.setItem('progress', JSON.stringify(progress))
# do not upload without consent
```
- question: progress privacy에서 중요한 원칙은?
- answer: 사용자 동의 없이 학습 기록을 외부로 보내지 않는다
- explanation: 오답, 점수, 학습 pattern은 개인 data가 될 수 있다. 외부 전송에는 목적과 필요한 동의·법적 근거를 확인하고, 수집 최소화, 접근 통제, 보존 기간, 삭제·export 기능을 제공한다. localStorage에만 있어도 같은 origin script와 device 사용자가 접근할 수 있으므로 민감도를 평가한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L10_progress_dashboard_001
- level: 10
- file: python_progress_score_mistake_note_v50.json
- title: progress dashboard 읽기
- question_type: meaning_choice
- concepts: ["progress_dashboard","learning_report","score_history"]
- reading_goal: 진도, 점수, 약점 개념을 대시보드로 요약하는 방식을 읽는다.
- code:
```python
dashboard = {'total_cards': 973, 'seen_cards': 120, 'accuracy': 0.78, 'weak_concepts': ['validation', 'dict']}
```
- question: progress dashboard가 보여주면 좋은 정보는?
- answer: 학습한 카드 수, 정답률, 약한 개념
- explanation: progress dashboard는 진도, 점수, 약점 개념을 한눈에 보여주는 화면이다. 사용자가 자신의 학습 상태를 빠르게 이해하게 돕는다. 최근 학습일, 연속 학습, 오답 추세까지 함께 보이면 사용자가 다음 행동을 정하기 쉽다. 따라서 정답은 ‘학습한 카드 수, 정답률, 약한 개념’이다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY6_L10_bedrock_invoke_001
- level: 10
- file: python_project_expansion_v6.json
- title: Bedrock invoke_model 구조 읽기
- question_type: meaning_choice
- concepts: ["import","bedrock","llm","aws","api"]
- reading_goal: AWS Bedrock Runtime으로 모델을 호출하는 흐름을 읽는다.
- code:
```python
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")
result = client.invoke_model(
    modelId=model_id,
    contentType="application/json",
    body=body_json
)
```
- question: modelId는 무엇을 지정하는가?
- answer: 호출할 모델
- explanation: modelId는 호출할 Bedrock 모델·추론 프로필·배포 자원을 지정한다. body에는 해당 모델이 요구하는 JSON 형식의 prompt와 추론 파라미터를 넣고, contentType="application/json"으로 입력 형식을 밝힌다. 반환된 result 자체가 생성 문장은 아니며 result["body"] 스트림을 읽어 JSON으로 파싱해야 한다. 모델마다 요청·응답 스키마가 다를 수 있어 adapter로 분리하는 편이 안전하다.
- project_context: 노드패스/teacher generation에서 Bedrock 호출 로그를 읽는 데 연결된다.

## PY6_L10_openai_client_001
- level: 10
- file: python_project_expansion_v6.json
- title: OpenAI Responses API 호출 구조 읽기
- question_type: meaning_choice
- concepts: ["import","print","openai","llm","api","client"]
- reading_goal: Responses API 클라이언트로 역할이 표시된 입력 메시지를 보내고 텍스트 출력을 읽는 구조를 이해한다.
- code:
```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
response = client.responses.create(
    model="gpt-5.6",
    input=[{"role": "user", "content": "hello"}]
)
print(response.output_text)
```
- question: input 배열은 무엇에 가까운가?
- answer: 모델에 보낼 입력 메시지
- explanation: 현재 신규 텍스트 생성에는 Responses API가 권장된다. input에는 문자열 하나를 줄 수도 있고, 이 예제처럼 role과 content를 가진 메시지 목록을 줄 수도 있다. 여기서는 user 역할의 "hello"가 모델 입력이며, 응답의 합쳐진 텍스트는 SDK 편의 속성 output_text로 읽는다. OPENAI_API_KEY가 없으면 설정 오류가 나고, 실제 호출에는 네트워크·권한·요금·모델 접근 조건도 따른다.
- project_context: 교육용 LLM/RAG API를 붙일 때 기본 흐름이다.

## PY6_L10_reading_queue_001
- level: 10
- file: python_project_expansion_v6.json
- title: reading queue 생성 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","reading_queue","filter","domain"]
- reading_goal: 후보 중 허용된 도메인만 원래 순서대로 모아 최대 10개의 읽을거리 큐를 만드는 흐름을 읽는다.
- code:
```python
def build_reading_queue(candidates):
    queue = []
    for item in candidates:
        if item["domain"] in ["UAM", "AI", "Robotics"]:
            queue.append(item)
    return queue[:10]
```
- question: queue에 들어가는 조건은?
- answer: domain이 UAM/AI/Robotics 중 하나
- explanation: candidates를 앞에서부터 돌며 item["domain"]이 UAM·AI·Robotics 중 하나일 때만 같은 item을 queue에 추가한다. 마지막 queue[:10] 때문에 조건을 통과한 항목 중 원래 순서가 빠른 최대 10개만 반환된다. 점수 정렬이나 중복 제거는 하지 않으며, domain key가 없는 item은 KeyError가 난다.
- project_context: 사용자의 daily reading queue와 학습앱 콘텐츠 선별에 연결된다.

## PY18_L10_cli_entrypoint_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: CLI entrypoint 함수 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","cli","entrypoint","argparse","main"]
- reading_goal: 명령행 인자를 받아 파이프라인 함수를 호출하는 구조를 읽는다.
- code:
```python
def main():
    args = parse_args()
    run_pipeline(
        input_path=args.input,
        output_path=args.output,
        limit=args.limit,
    )

if __name__ == "__main__":
    main()
```
- question: main 함수의 역할에 가장 가까운 것은?
- answer: CLI 인자를 파이프라인 실행 함수에 연결한다
- explanation: main은 parse_args와 run_pipeline을 이어주는 실행 진입점 역할을 한다. CLI entrypoint 함수는 명령줄에서 실행될 때 가장 먼저 호출되는 시작점이다. 인자를 읽고 핵심 함수로 넘기는 흐름을 확인하면 구조가 보인다.
- project_context: 배치 스크립트가 내부 파이프라인 함수를 호출하는 구조를 이해하는 카드다.

## PY18_L10_import_error_debug_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: ModuleNotFoundError 디버깅 읽기
- question_type: meaning_choice
- concepts: ["comment","import_error","pythonpath","module","debugging"]
- reading_goal: 모듈을 못 찾는 오류가 경로 문제일 수 있음을 이해한다.
- code:
```python
ModuleNotFoundError: No module named 'app'

# 확인할 항목
# 1. 프로젝트가 현재 환경에 설치됐는가
# 2. src가 import 경로에 포함됐는가
# 3. 실행한 Python과 설치한 Python이 같은가
```
- question: 이 오류의 원인과 관련이 없는 것은?
- answer: CSS 색상이 파란색인 것
- explanation: ModuleNotFoundError는 import가 이름에 해당하는 module이나 package를 검색 경로에서 찾지 못했다는 뜻이다. 현재 작업 폴더 자체보다 어떤 Python 실행 파일을 썼는지, package가 그 환경에 설치됐는지, sys.path에 project root나 src가 들어 있는지를 확인한다. 단순히 project root에서 실행한다고 src layout의 app이 항상 import되는 것은 아니다.
- project_context: 서버/배치 스크립트 실행 중 모듈을 못 찾는 오류를 해석하는 기본 카드다.

## PY18_L10_layered_architecture_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: 레이어드 구조 흐름 읽기
- question_type: meaning_choice
- concepts: ["comment","def","function","return","architecture","layer","service","repository"]
- reading_goal: API, service, repository 역할 분리를 읽는다.
- code:
```python
# api.py
@app.get("/search")
def search(q: str):
    return search_service.search(q)

# service.py
def search(q):
    chunks = repository.find_chunks(q)
    return build_answer(chunks)

# repository.py
def find_chunks(q):
    return db.query(q)
```
- question: repository.py의 역할에 가장 가까운 것은?
- answer: DB나 저장소 접근을 담당한다
- explanation: API는 요청을 받고, service는 업무 로직을 처리하고, repository는 저장소 접근을 담당하는 식으로 나눌 수 있다. repository.py는 DB나 파일 같은 저장소 세부 처리를 감싸서 다른 계층이 저장 방식에 덜 묶이게 해 준다.
- project_context: RAG API나 교육 서비스 MVP를 만들 때 코드가 커지면 필요한 구조다.

## PY18_L10_pytest_basic_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: pytest 기본 테스트 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","assert","test"]
- reading_goal: 함수 출력이 기대값과 같은지 검사하는 테스트 코드를 읽는다.
- code:
```python
def normalize(text):
    return " ".join(text.lower().split())

def test_normalize():
    assert normalize("  LiDAR   Sensor ") == "lidar sensor"
```
- question: assert가 실패하면 무엇을 의미하는가?
- answer: 실제 결과가 기대값과 다르다
- explanation: pytest는 test_로 시작하는 함수를 찾아 테스트로 실행한다. 함수 안의 assert 조건이 참이면 통과하고 거짓이면 실패로 표시한다. 실패한 assert는 실제 값이 기대값과 다르다는 뜻이므로 실패 메시지와 입력값을 함께 봐야 한다.
- project_context: 정규화, dedup, chunk_id 생성 같은 작은 함수부터 테스트할 수 있다.

## PY18_L10_src_vs_scripts_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: src 코드와 scripts 실행파일 구분
- question_type: meaning_choice
- concepts: ["comment","def","function","return","import","src","scripts","entrypoint","architecture"]
- reading_goal: 재사용 가능한 코드와 실행용 스크립트를 구분하는 설계를 이해한다.
- code:
```python
# src/app/chunker.py
def make_chunks(text):
    return text.split("\n\n")

# scripts/build_chunks.py
from app.chunker import make_chunks

chunks = make_chunks(open("input.txt", encoding="utf-8").read())
```
- question: make_chunks가 src/app/chunker.py에 있는 이유에 가장 가까운 것은?
- answer: 여러 스크립트에서 재사용할 핵심 로직이기 때문에
- explanation: make_chunks는 재사용할 핵심 변환이므로 import 가능한 src package에 두고, scripts 파일은 입력을 읽고 함수를 호출하는 실행 조립을 맡는다. 다만 예시의 from app... import가 동작하려면 프로젝트를 설치하거나 src를 import 경로에 넣어야 한다. 파일도 with open(...)으로 열면 닫힘 시점이 명확해진다.
- project_context: 실행 스크립트가 늘어나는 프로젝트에서 재사용 로직과 일회성 조립 코드를 구분하는 예시다.

## PY18_L10_test_fixture_001
- level: 10
- file: python_project_structure_imports_v18.json
- title: pytest fixture 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","pytest","fixture","test_data"]
- reading_goal: 테스트에서 반복 사용할 데이터를 fixture로 제공하는 구조를 읽는다.
- code:
```python
import pytest

@pytest.fixture
def sample_doc():
    return {"doc_id": "d1", "text": "LiDAR detects objects."}

def test_doc_has_id(sample_doc):
    assert sample_doc["doc_id"] == "d1"
```
- question: sample_doc fixture의 역할은?
- answer: 테스트에 사용할 샘플 dict를 제공한다
- explanation: pytest는 test_doc_has_id의 sample_doc 매개변수 이름을 보고 같은 이름의 fixture를 실행한 뒤 반환 dict를 인자로 전달한다. 기본 function scope에서는 fixture가 필요한 테스트마다 새 값이 만들어진다. 여러 테스트가 같은 준비 코드를 재사용한다는 뜻이지, 반드시 같은 dict 객체 하나를 공유한다는 뜻은 아니다.
- project_context: chunk, node, evidence 샘플을 테스트에 반복 사용하기 좋다.

## PY51_L10_install_onboarding_001
- level: 10
- file: python_pwa_install_update_ux_v51.json
- title: install onboarding 읽기
- question_type: meaning_choice
- concepts: ["install_onboarding","PWA_install","user_guidance"]
- reading_goal: 처음 방문한 사용자에게 설치 방법과 앱 사용 흐름을 안내하는 onboarding을 이해한다.
- code:
```python
steps = ['앱 열기', '설치 버튼 누르기', '홈 화면에서 실행하기']
```
- question: install onboarding에 들어가면 좋은 내용은?
- answer: 설치 방법과 설치 후 실행 방법
- explanation: 모바일 사용자는 브라우저와 설치 앱의 차이를 모를 수 있으므로 짧은 안내가 필요하다. install onboarding은 사용자가 앱을 설치하고 처음 쓰는 과정을 안내하는 흐름이다. 설치 가능 조건과 안내 메시지가 언제 보이는지 확인해야 한다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L10_pwa_update_flow_001
- level: 10
- file: python_pwa_install_update_ux_v51.json
- title: PWA update flow 전체 읽기
- question_type: meaning_choice
- concepts: ["PWA_update_flow","install_update_ux","release_safety"]
- reading_goal: 새 버전 감지부터 사용자 안내, 새로고침, 버전 확인까지의 전체 흐름을 이해한다.
- code:
```python
detectNewVersion()
showUpdateBanner()
saveProgress()
reloadApp()
showVersion()
```
- question: PWA update flow의 자연스러운 순서는?
- answer: 새 버전 감지 → 업데이트 안내 → 진도 저장 → 새로고침 → 버전 확인
- explanation: 새 service worker 발견 뒤 사용자의 저장 중 작업을 확인하고 update를 안내한다. 동의하면 progress 저장 성공을 확인하고 waiting worker를 activate한 뒤 controllerchange에서 한 번 reload하며, 실행된 app·data version을 확인한다. 단계별 실패와 여러 tab의 old client도 처리해야 한다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.
