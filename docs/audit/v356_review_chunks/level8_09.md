# V356 semantic review — Level 8 chunk 9

Cards 161-180 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY30_L08_guard_clause_001
- level: 8
- file: python_function_design_io_v30.json
- title: guard clause 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","guard_clause","early_return","validation"]
- reading_goal: 조건이 맞지 않으면 함수 초반에 빠져나가는 guard clause를 이해한다.
- code:
```python
def render_card(card):
    if not card:
        return ""

    return f"<h2>{card['title']}</h2>"
```
- question: if not card: return ""의 동작은?
- answer: card가 falsy이면 뒤 title 접근 없이 빈 문자열을 반환한다
- explanation: None뿐 아니라 empty dict 같은 모든 falsy card에서 즉시 empty string을 반환하므로 아래 title access는 실행되지 않는다. empty card가 invalid input이라면 조용한 empty UI보다 ValueError나 explicit placeholder가 더 적절할 수 있다. guard clause는 early exit를 명확히 하지만 올바른 failure policy를 대신 정해 주지는 않는다.
- project_context: 앱에서 선택된 카드가 없거나 로딩 전일 때 화면이 깨지지 않게 하는 패턴이다.

## PY30_L08_pure_function_001
- level: 8
- file: python_function_design_io_v30.json
- title: pure function 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pure_function","side_effect","testable"]
- reading_goal: 같은 입력이면 항상 같은 출력을 내는 pure function의 장점을 이해한다.
- code:
```python
def make_status(done, total):
    return f"{done}/{total} 완료"

text = make_status(3, 10)
```
- question: 순수 함수가 테스트하기 쉬운 이유는?
- answer: 입력만 보면 출력이 결정되기 때문
- explanation: pure function은 같은 입력이면 같은 결과를 만들고 함수 밖의 상태를 바꾸지 않는 함수를 뜻한다. 그래서 테스트에서는 파일, 시간, 전역 변수 같은 숨은 조건을 준비하지 않고 입력과 반환값만 비교하기 쉽다. 이 코드가 테스트하기 쉬운 이유도 결과가 전달한 입력으로 결정되기 때문이다.
- project_context: 상태 문구, 추천 요약, 검증 메시지를 만드는 함수는 pure function으로 두면 안정적이다.

## PY33_L08_git_diff_001
- level: 8
- file: python_git_github_workflow_v33.json
- title: git diff 읽기
- question_type: meaning_choice
- concepts: ["git_diff","changes","review"]
- reading_goal: 커밋 전 어떤 줄이 바뀌었는지 확인하는 diff를 이해한다.
- code:
```python
git diff src/pwa/app.js
```
- question: git diff를 커밋 전에 보는 이유는?
- answer: 의도하지 않은 변경이 섞였는지 확인하기 위해
- explanation: 인자 없이 이 형태의 git diff는 app.js의 작업 트리와 index 사이, 즉 주로 아직 stage하지 않은 변경을 보여 준다. git add로 stage한 변경은 git diff --cached로 따로 확인해야 하므로 커밋 전에는 두 diff를 모두 검토하는 것이 안전하다.
- project_context: app.js lessonFiles가 유지됐는지 확인할 때 유용하다.

## PY33_L08_git_log_001
- level: 8
- file: python_git_github_workflow_v33.json
- title: git log 읽기
- question_type: meaning_choice
- concepts: ["git_log","history","commit_hash"]
- reading_goal: 커밋 이력을 확인하고 최신 커밋 해시를 읽는다.
- code:
```python
git log --oneline -5

0998190 Add files paths and project structure reading cards
4d2080b Fix v31 dict object card answer
```
- question: 0998190은 무엇인가?
- answer: 커밋을 가리키는 짧은 해시
- explanation: git log --oneline은 각 커밋을 축약 해시와 제목으로 보여 준다. 0998190은 전체 객체 ID의 앞부분이며 저장소 안에서 충분히 고유할 때 특정 커밋을 가리킨다. 충돌 가능성이 있으면 Git이 요구하는 더 긴 해시나 전체 해시를 사용한다.
- project_context: 문제가 생겼을 때 어느 커밋부터 깨졌는지 추적할 수 있다.

## PY33_L08_git_push_001
- level: 8
- file: python_git_github_workflow_v33.json
- title: git push 읽기
- question_type: meaning_choice
- concepts: ["git_push","remote","GitHub"]
- reading_goal: 로컬 커밋을 GitHub 원격 저장소로 올리는 명령을 이해한다.
- code:
```python
git push

To https://github.com/user/repo.git
   abc1234..def5678  main -> main
```
- question: main -> main은 무엇을 뜻하는가?
- answer: 로컬 main의 커밋이 원격 main에 반영됐다
- explanation: 이 출력은 로컬 main의 abc1234 이후 커밋이 해당 원격의 main 참조를 def5678로 갱신했다는 뜻이다. push 성공은 저장소 업데이트를 뜻할 뿐, GitHub Pages 배포 성공까지 보장하지 않는다. Pages는 별도의 설정된 빌드·배포가 끝났는지 확인해야 한다.
- project_context: 정적 사이트가 main을 배포 원본으로 사용하도록 설정된 경우 push 뒤 별도 배포가 시작될 수 있다.

## PY48_L08_cli_args_001
- level: 8
- file: python_github_actions_ci_validation_v48.json
- title: CLI 인자 읽기
- question_type: meaning_choice
- concepts: ["CLI_args","argparse","expected_count"]
- reading_goal: 검증 스크립트에 기대 버전이나 기대 카드 수를 인자로 넘기는 방식을 이해한다.
- code:
```python
python tools/validate_lessons.py --expected-lesson-cards 956
```
- question: CLI 인자를 쓰는 이유는?
- answer: 검증 조건을 실행 시점에 지정할 수 있기 때문
- explanation: CLI option은 같은 validator에 release별 expected count를 외부에서 전달한다. 값의 source가 실제 data에서 다시 계산되면 누락을 못 잡으므로 version 관리된 manifest나 독립 spec에서 가져와야 한다. argparse type과 범위 validation, help, 실패 message도 제공한다.
- project_context: v48 로컬 검증에서는 expected app version과 expected lesson cards를 함께 확인한다.

## PY48_L08_exit_code_001
- level: 8
- file: python_github_actions_ci_validation_v48.json
- title: exit code 읽기
- question_type: meaning_choice
- concepts: ["if","exit_code","CI_fail","SystemExit"]
- reading_goal: 검증 실패 시 0이 아닌 종료 코드가 CI 실패로 이어짐을 이해한다.
- code:
```python
if errors:
    raise SystemExit(1)
```
- question: CI에서 exit code가 중요한 이유는?
- answer: 실패를 자동화 시스템이 감지하는 기준이기 때문
- explanation: exit code는 프로그램이 성공했는지 실패했는지 운영체제에 알려주는 숫자다. 0이 아니면 CI에서는 보통 실패로 처리한다. 자동화에서는 사람이 화면을 보지 않아도 exit code만으로 다음 단계를 진행할지 멈출지 결정한다. 따라서 정답은 ‘실패를 자동화 시스템이 감지하는 기준이기 때문’이다.
- project_context: validate_lessons.py는 오류가 있으면 SystemExit로 중단해 CI 실패를 만들 수 있다.

## PY48_L08_on_push_001
- level: 8
- file: python_github_actions_ci_validation_v48.json
- title: on push 트리거 읽기
- question_type: meaning_choice
- concepts: ["on_push","trigger","CI"]
- reading_goal: push 이벤트가 workflow를 실행하는 조건이 될 수 있음을 이해한다.
- code:
```python
on:
  push:
    branches: [ main ]
```
- question: on: push의 의미는?
- answer: main 브랜치에 push될 때 workflow를 실행한다
- explanation: on push는 GitHub Actions가 push 이벤트가 발생했을 때 실행되도록 하는 트리거다. 자동화가 언제 시작될지를 정하는 조건이다. main에 push될 때마다 검증을 돌리면 원격 저장소 기준의 품질 게이트를 만들 수 있다.
- project_context: lesson 파일을 push하면 원격에서 검증이 자동으로 돌게 할 수 있다.

## PY48_L08_validate_lessons_py_001
- level: 8
- file: python_github_actions_ci_validation_v48.json
- title: validate_lessons.py 고정화 읽기
- question_type: meaning_choice
- concepts: ["validation_script","tooling","repeatable_check"]
- reading_goal: 매번 붙여넣던 검증 코드를 파일로 고정하는 이유를 이해한다.
- code:
```python
python tools/validate_lessons.py
```
- question: 검증 스크립트를 파일로 고정하는 장점은?
- answer: 매번 긴 코드를 붙여넣지 않고 같은 검증을 반복 실행할 수 있다
- explanation: validate_lessons.py는 lesson 파일 수, 카드 수, 필수 필드, 정답 일관성을 확인하는 검증 도구다. 반복 검증은 도구 파일로 고정해야 누락을 줄일 수 있다.
- project_context: v41~v47에서 반복한 full validation을 tools/validate_lessons.py로 분리한다.

## PY15_L08_alias_redirect_canonical_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Alias / Redirect / Canonical 비교
- question_type: meaning_choice
- concepts: ["alias","redirect","canonical","knowledge_graph"]
- reading_goal: KG 정리에서 같은 개념을 다루는 세 용어를 구분한다.
- code:
```python
Alias: 같은 대상을 가리키는 다른 이름이나 ID
Canonical: 시스템이 대표로 선택한 이름이나 ID
Redirect: 이전 ID나 alias에서 canonical ID로 보내는 매핑
```
- question: 대표 id로 삼는 값은?
- answer: Canonical
- explanation: alias는 같은 대상을 부르는 다른 표기이고 canonical은 대표 표기다. redirect는 오래된 ID나 alias로 들어온 요청을 대표 ID에 연결한다. redirect가 순환하지 않게 검사하고, 대표 ID가 바뀌어도 기존 링크와 출처를 추적할 수 있게 이력을 남겨야 한다.
- project_context: KG 중복 노드 정리와 node_pages 동기화에 필요하다.

## PY15_L08_cache_ttl_retry_timeout_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Cache / TTL / Retry / Timeout 비교
- question_type: meaning_choice
- concepts: ["try_except","cache","ttl","retry","timeout","operation"]
- reading_goal: 운영 코드에서 자주 보는 안정화 개념을 묶어 이해한다.
- code:
```python
Cache: 다시 계산하거나 요청하지 않도록 결과를 재사용해 저장
TTL: 저장값을 유효하다고 볼 수 있는 기간
Retry: 실패 조건과 횟수를 정해 작업을 다시 시도
Timeout: 정한 시간 안에 완료되지 않으면 기다리기를 끝내고 실패로 처리
```
- question: 캐시가 유효한 시간을 나타내는 것은?
- answer: TTL
- explanation: TTL이 지나면 저장값은 만료된 것으로 취급하지만 구현에 따라 즉시 삭제되지는 않는다. timeout이 발생해 호출자가 기다리기를 멈춰도 서버 작업이 자동으로 취소된다고 단정할 수 없다. retry는 일시적 실패에만 제한하고, 중복 실행이 안전한지 확인한 뒤 횟수 제한과 backoff·jitter를 둔다.
- project_context: API 호출 비용 절감과 운영 안정화에 자주 쓰인다.

## PY15_L08_dtype_tensor_compare_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Tensor dtype과 양자화 비트 수 비교
- question_type: meaning_choice
- concepts: ["dtype","tensor_dtype","fp32","fp16","int8"]
- reading_goal: 배열/텐서 내부 숫자 표현 방식이 메모리와 정밀도에 영향을 준다는 점을 이해한다.
- code:
```python
float32: 텐서 원소 하나를 보통 32비트 부동소수점으로 저장
float16/bfloat16: 원소당 비트 수를 줄이지만 범위와 정밀도 특성이 서로 다름
int8/4-bit quantization: 값을 낮은 비트로 표현하고 scale 등의 메타데이터와 커널을 함께 사용
```
- question: 모델 가중치의 VRAM 사용량과 가장 직접 관련 있는 것은?
- answer: dtype와 양자화 비트 수
- explanation: 원소당 비트 수가 작아지면 같은 개수의 가중치가 차지하는 메모리를 줄일 수 있다. 다만 4-bit는 많은 라이브러리에서 일반 텐서 dtype이라기보다 압축된 저장 형식과 양자화 방식이며 scale 같은 추가 정보가 필요하다. 활성값, KV cache, 옵티마이저 상태까지 모두 같은 비율로 줄어드는 것도 아니다.
- project_context: LLM 양자화와 fp16/bf16 설정을 이해하는 데 필요하다.

## PY15_L08_encryption_hashing_salt_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Encryption / Hashing / Salt 비교
- question_type: meaning_choice
- concepts: ["encryption","hashing","salt","security"]
- reading_goal: 암호화, 해시, salt의 차이를 구분해 읽는다.
- code:
```python
Encryption: 올바른 복호화 키가 있으면 원문을 복원할 수 있음
Hashing: 입력을 고정 길이 값으로 바꾸며 일반적으로 원문 복원을 목적으로 하지 않음
Salt: 비밀번호마다 새로 만드는 랜덤값으로 같은 비밀번호의 저장 결과를 다르게 함
```
- question: 원문 복원이 어렵고 지문처럼 비교하는 방식은?
- answer: Hashing
- explanation: 암호화는 허가된 사용자가 원문을 다시 읽어야 할 때 쓰고, 해시는 입력 비교나 무결성 확인 등에 쓴다. 비밀번호는 빠른 일반 해시 한 번이 아니라 Argon2, bcrypt, scrypt, PBKDF2 같은 느린 비밀번호 해시 함수와 고유한 랜덤 salt로 저장해야 한다. salt는 비밀일 필요는 없지만 비밀번호마다 달라야 한다.
- project_context: 비밀번호/토큰/무결성 검증 설명을 읽을 때 중요하다.

## PY15_L08_evidence_provenance_lineage_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Evidence / Provenance / Lineage 비교
- question_type: meaning_choice
- concepts: ["evidence","provenance","lineage","citation"]
- reading_goal: evidence, provenance, lineage의 차이를 구분해 읽는다.
- code:
```python
Evidence: 주장을 뒷받침하는 구체적인 자료나 관찰
Provenance: 데이터의 출처, 생성 주체, 수집 방법 등 기원 정보
Lineage: 원천 데이터부터 산출물까지 거친 변환과 이동 경로
Citation: 사용자가 근거 원문을 확인할 수 있게 표시한 인용이나 링크
```
- question: 데이터가 어떤 변환을 거쳤는지 추적하는 개념은?
- answer: Lineage
- explanation: evidence는 주장을 뒷받침하는 자료이고 citation은 사용자가 그 자료를 확인하게 하는 표시다. provenance는 데이터의 기원과 생성 맥락을 기록하며, 시스템에 따라 변환 이력도 포함할 수 있다. lineage는 특히 데이터가 어느 단계를 거쳐 현재 결과가 되었는지를 추적한다.
- project_context: evidence-first KG/RAG 구조에서 신뢰도를 지키는 핵심 개념이다.

## PY15_L08_extract_chunk_dedup_canonical_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Extract / Chunk / Dedup / Canonicalization 비교
- question_type: meaning_choice
- concepts: ["extract","chunk","dedup","canonicalization","pipeline"]
- reading_goal: 문서 처리 파이프라인의 주요 단계를 묶어 이해한다.
- code:
```python
Extract: 원문에서 텍스트와 메타데이터를 추출
Chunk: 검색이나 모델 입력 단위로 텍스트를 분할
Dedup: 정한 동일성 기준에 따라 중복 항목을 제거하거나 병합
Canonicalization: 여러 표기를 대표 이름이나 ID에 연결
```
- question: LiDAR, lidar, LIDAR를 하나의 대표 label로 정리하는 과정은?
- answer: Canonicalization
- explanation: extract, chunk, dedup, canonicalization은 서로 다른 파이프라인 단계다. LiDAR의 대소문자 표기를 하나로 연결하는 일은 canonicalization에 가깝다. 다만 단순 소문자 변환은 서로 다른 고유명사를 잘못 합칠 수 있으므로 alias 규칙과 원문 근거를 보존해야 한다.
- project_context: KG 노드 정리와 데이터 파이프라인 품질에 중요하다.

## PY15_L08_harness_compare_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Test Harness / Wiring Harness / Safety Harness 비교
- question_type: meaning_choice
- concepts: ["harness","test_harness","wiring_harness","safety_harness"]
- reading_goal: harness라는 단어가 분야에 따라 다르게 쓰인다는 점을 이해한다.
- code:
```python
Test harness: 테스트 입력, 실행, 결과 수집, 검증을 자동화하는 틀
Wiring harness: 전원과 신호를 전달하는 전선·케이블·커넥터 묶음
Safety harness: 추락이나 이탈을 막기 위해 몸을 지지하는 안전 장비
```
- question: 소프트웨어 테스트 자동화 맥락의 harness는?
- answer: Test harness
- explanation: harness는 여러 요소를 묶어 함께 작동하게 하는 구조라는 공통 느낌이 있지만 분야마다 대상이 다르다. 코드와 테스트 결과가 나오면 test harness, 전선과 커넥터가 나오면 wiring harness, 사람의 추락 방지가 나오면 safety harness로 읽는다.
- project_context: 파이썬 테스트와 자율시스템 하드웨어 문서를 함께 볼 때 필요한 구분이다.

## PY15_L08_jsonld_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: JSON-LD 의미 읽기
- question_type: meaning_choice
- concepts: ["json_ld","linked_data","semantic","json"]
- reading_goal: JSON 형식에 의미 연결 정보를 붙이는 JSON-LD 개념을 이해한다.
- code:
```python
{
  "@context": "https://schema.org",
  "@type": "Article",
  "name": "UAM Safety Report"
}
```
- question: @context의 목적에 가까운 것은?
- answer: 필드 이름의 의미 기준을 연결한다
- explanation: JSON-LD는 JSON에 Linked Data의 의미를 붙이는 형식이다. @context는 name 같은 짧은 용어를 어떤 IRI와 의미로 해석할지 연결한다. 이 연결은 필드의 의미를 알려 주지만, 데이터가 올바른지 자동으로 검증하는 schema와는 역할이 다르다.
- project_context: 웹 데이터/구조화 데이터/시맨틱 메타데이터를 읽는 데 필요하다.

## PY15_L08_jwt_oauth_api_key_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: JWT / OAuth / API Key 비교
- question_type: meaning_choice
- concepts: ["jwt","oauth","api_key","token","security"]
- reading_goal: 인증/연동에서 자주 만나는 토큰 종류를 비교한다.
- code:
```python
API Key: 애플리케이션이나 프로젝트의 API 호출을 식별·허용하는 값
JWT: claim을 담고 서명할 수 있는 토큰 형식이며 내용이 자동으로 암호화되지는 않음
OAuth 2.0: 사용자가 비밀번호를 앱에 주지 않고 제한된 접근 권한을 위임하는 프레임워크
```
- question: 앱이 사용자의 Google API 접근 권한을 위임받는 흐름에 가까운 것은?
- answer: OAuth
- explanation: OAuth 2.0은 사용자가 다른 앱에 제한된 접근 권한을 위임하는 표준 프레임워크다. Google 계정으로 사용자의 신원까지 확인하는 로그인은 보통 OAuth 2.0 위에 OpenID Connect를 함께 사용한다. JWT는 토큰 형식이고 API key는 서비스에 따라 프로젝트나 앱을 식별하는 값이므로 서로 같은 역할이 아니다.
- project_context: 네 서버/API 키 저장/로그인 구조와 직접 연결된다.

## PY15_L08_leakage_compare_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Credential/Secret Leakage / Data Leakage / Prompt Injection 비교
- question_type: meaning_choice
- concepts: ["token_leakage","data_leakage","prompt_injection","security","leakage"]
- reading_goal: AI 앱에서 자주 나오는 누설/공격 개념을 묶어 이해한다.
- code:
```python
Credential/secret leakage: API key, access token, 비밀번호 같은 비밀값이 노출됨
Data leakage: 사용자 정보나 내부 데이터가 허가되지 않은 곳에 노출됨
Prompt injection: 입력이 모델의 상위 지시를 무시하게 하거나 허용되지 않은 도구 사용을 유도함
```
- question: API key가 공개 GitHub 저장소에 올라간 상황은?
- answer: Credential/secret leakage
- explanation: 공개 저장소에 올라간 API key는 비밀 자격 증명이 노출된 경우다. 발견하면 파일에서 지우는 것만으로 끝내지 말고 키를 즉시 폐기하거나 회전하고, 커밋 기록과 사용 로그도 확인해야 한다. data leakage와 범위가 겹칠 수 있지만 이 질문은 특히 접근 자격 증명의 노출을 묻는다.
- project_context: LLM/RAG 앱과 서버 운영에서 꼭 알아야 할 리스크다.

## PY15_L08_least_privilege_audit_001
- level: 8
- file: python_grouped_concepts_v15.json
- title: Least Privilege / Audit Log 비교
- question_type: meaning_choice
- concepts: ["least_privilege","audit_log","access_control","security"]
- reading_goal: 권한 최소화와 감사 로그의 역할을 함께 구분해 읽는다.
- code:
```python
Least privilege: 계정과 서비스에 작업에 필요한 최소 권한만 부여
Audit log: 누가 언제 어떤 자원에 어떤 작업을 했고 결과가 어땠는지 기록
```
- question: 문제 발생 후 누가 어떤 작업을 했는지 추적하는 기록은?
- answer: Audit log
- explanation: least privilege는 침해나 실수의 피해 범위를 줄이는 예방 원칙이다. audit log는 사건이 생긴 뒤 작업 흐름을 재구성하게 돕는다. 로그 자체에도 민감 정보 최소화, 접근 제한, 변조 방지, 보존 기간 같은 관리가 필요하다.
- project_context: API key/사용자 요청/관리자 작업 기록 설계와 연결된다.
