# V356 semantic review — Level 10 chunk 6

Cards 101-120 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY17_L10_service_recovery_habit_001
- level: 10
- file: python_debug_logs_cache_git_v17.json
- title: 실험 패치 후 복구 습관 읽기
- question_type: order_choice
- concepts: ["comment","rollback","recovery","commit","debugging"]
- reading_goal: 실험 패치가 실패했을 때 안정 지점을 만드는 절차를 이해한다.
- code:
```python
# 1. git diff로 실패를 만든 변경 범위 확인
# 2. 해당 실험 블록만 비활성화하거나 되돌림
# 3. JSON parse와 lessonFiles 검증
# 4. 로컬 서버와 브라우저 Console/Network 확인
# 5. 검증된 복구 변경만 커밋
```
- question: 실험 패치가 앱 로딩을 깨뜨렸을 때 가장 먼저 해야 할 일은?
- answer: 실험 블록을 제거하고 정상 로딩을 복구한다
- explanation: 먼저 diff와 오류 기록으로 실패를 만든 변경을 특정한 뒤 해당 실험 범위만 되돌리거나 비활성화한다. 작업 폴더에 다른 미완성 변경이 있을 수 있으므로 전체 파일이나 저장소를 무작정 되돌리면 안 된다. 정상 로딩을 복구하고 자동 검증과 브라우저 확인을 통과한 변경만 별도 커밋으로 기록한다.
- project_context: 실험 변경으로 앱이 깨졌을 때 다른 작업을 보존하며 최소 범위로 복구하는 절차다.

## PY17_L10_side_card_field_bug_001
- level: 10
- file: python_debug_logs_cache_git_v17.json
- title: side card 필드 불일치 버그 읽기
- question_type: meaning_choice
- concepts: ["field_mismatch","rendering","summary","detail"]
- reading_goal: 데이터는 있는데 화면에 안 보이는 필드명 불일치 버그를 읽는다.
- code:
```python
const body = document.createElement("div");
body.className = "side-card-body";
body.textContent = sc.body;
```
- question: side card 데이터가 summary/detail 중심이면 이 코드의 문제는?
- answer: sc.body만 읽어서 summary/detail이 화면에 안 보일 수 있다
- explanation: 렌더러는 sc.body만 읽으므로 데이터가 summary나 detail에 있어도 그 값은 사용하지 않는다. sc.body가 undefined이면 브라우저의 DOM 문자열 변환 결과가 의도치 않게 표시될 수도 있다. 해결하려면 데이터 schema를 하나로 통일하거나, 지원할 필드를 명시적인 우선순위와 기본값으로 처리하고 schema 테스트를 추가해야 한다.
- project_context: 데이터 필드 이름과 화면 렌더러의 계약이 어긋났을 때 생기는 표시 오류다.

## PY28_L10_browser_cache_001
- level: 10
- file: python_debugging_error_routines_v28.json
- title: 브라우저 캐시 문제 읽기
- question_type: meaning_choice
- concepts: ["cache","version","browser","PWA"]
- reading_goal: 코드를 바꿨는데 화면이 그대로일 때 버전 쿼리와 캐시를 확인한다.
- code:
```python
const APP_DATA_VERSION = "20260529_v28";

fetch("../../data/lessons/cards.json?v=" + APP_DATA_VERSION)
```
- question: v=APP_DATA_VERSION을 붙이는 이유는?
- answer: 브라우저가 오래된 데이터 캐시를 계속 쓰는 것을 줄이기 위해
- explanation: query version이 바뀌면 전체 URL이 달라져 일반 browser cache에서 별도 resource로 다시 요청될 가능성이 높다. 그러나 server, CDN이나 service worker가 query를 무시하거나 자체 cache key를 쓰면 보장되지 않는다. response의 content version과 service-worker update state를 확인하고 일관된 version/hash policy를 사용한다.
- project_context: PWA/정적 앱에서 업데이트했는데 안 바뀌는 문제를 줄이는 핵심 패턴이다.

## PY28_L10_devtools_network_001
- level: 10
- file: python_debugging_error_routines_v28.json
- title: DevTools Network 확인 루틴
- question_type: order_choice
- concepts: ["DevTools","Network","status_code","debugging"]
- reading_goal: 브라우저에서 파일 로딩 성공/실패를 Network 탭으로 확인하는 루틴을 이해한다.
- code:
```python
확인 순서:
1. F12
2. Network tab
3. 새로고침
4. app.js / style.css / lesson JSON의 URL·status·response 확인
```
- question: lesson JSON이 로딩되지 않을 때 가장 직접적으로 볼 탭은?
- answer: Network
- explanation: Network tab은 request URL, status, response body, initiator와 cache/service-worker 정보를 보여 준다. lesson JSON이 안 보이면 request가 시작됐는지, 어느 URL인지, 404/500인지, 200 body가 기대한 JSON인지 순서대로 본다. parse와 runtime error는 Console에서도 함께 확인해야 한다.
- project_context: 모바일/PC에서 화면이 안 뜰 때 서버 로그와 함께 보는 기본 도구다.

## PY28_L10_git_restore_001
- level: 10
- file: python_debugging_error_routines_v28.json
- title: git restore 사고방식
- question_type: meaning_choice
- concepts: ["git","restore","rollback","working_tree"]
- reading_goal: 잘못 수정한 파일을 마지막 커밋 상태로 되돌리는 명령의 위험과 의미를 이해한다.
- code:
```python
git status
git restore src/pwa/app.js
```
- question: staged change가 없는 상태에서 git restore src/pwa/app.js는 무엇을 하는가?
- answer: working tree의 app.js를 index 상태로 되돌린다
- explanation: source를 지정하지 않은 git restore는 기본적으로 working tree file을 index 상태로 복원한다. staged change가 없다면 보통 마지막 commit과 같지만 staged content가 있으면 그 staged version으로 돌아간다. local 수정이 사라질 수 있으므로 먼저 git diff와 git diff --cached를 보고 필요한 patch를 보관한 뒤 exact file만 복원한다.
- project_context: 깨진 패치를 되돌릴 때 유용하지만, 작업물을 잃을 수 있어 조심해야 한다.

## PY28_L10_hypothesis_debug_001
- level: 10
- file: python_debugging_error_routines_v28.json
- title: 원인 가설 세우기
- question_type: meaning_choice
- concepts: ["hypothesis","debugging","evidence","validation"]
- reading_goal: 무작정 고치기보다 가설과 확인 명령을 나눠 생각하는 방법을 익힌다.
- code:
```python
증상: 새 card가 화면에 안 보임

가설 A: loading manifest에 file이 빠짐
확인: exact path set을 file manifest와 비교

가설 B: JSON syntax 또는 schema 오류
확인: Get-Content file.json -Raw | ConvertFrom-Json
```
- question: 이 방식의 장점은?
- answer: 원인 후보별로 확인 명령을 분리해 헛수정을 줄인다
- explanation: 하나의 symptom에 대해 서로 배타적이지 않은 hypothesis를 세우고 각 hypothesis를 falsify할 evidence를 정한다. 단순 v28 substring은 false positive가 날 수 있어 exact path set을 비교하고, PowerShell JSON은 -Raw로 전체 document를 parse한다. 한 번에 한 변수를 확인하고 결과를 기록한 뒤 fix를 적용한다.
- project_context: 이번 앱 작업처럼 캐시/JSON/app.js/서버 로그가 얽힐 때 필요한 사고방식이다.

## PY28_L10_reproduce_command_001
- level: 10
- file: python_debugging_error_routines_v28.json
- title: 재현 명령어 남기기
- question_type: meaning_choice
- concepts: ["comment","reproduction","debugging","runbook","command"]
- reading_goal: 오류를 다시 만들 수 있는 최소 명령어를 남기는 이유를 이해한다.
- code:
```python
# reproduction command
Set-Location "<repository-root>"
.\run_local_server.ps1

# symptom
browser remains on "Loading..."
```
- question: 재현 명령어를 남기는 가장 큰 이유는?
- answer: 같은 문제를 다시 확인하고 수정 여부를 검증하기 위해
- explanation: 재현 절차는 다른 사람이 같은 symptom을 반복하고 fix 전후를 비교하게 한다. 개인 absolute path 대신 repository revision, OS/shell, Python/browser version, 입력 data, exact command, expected·actual result와 log를 함께 남긴다. secret이나 개인 경로는 report에서 제거한다.
- project_context: 다음 대화창 인계, 패치 검증, 서버 문제 추적에 매우 중요하다.

## PY4_L10_edge_promotion_001
- level: 10
- file: python_deep_expansion_v4.json
- title: 엣지 승격 조건 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","kg","edge","promotion","evidence"]
- reading_goal: 점수와 근거 조건을 만족할 때 후보 엣지를 승격하는 코드를 읽는다.
- code:
```python
def promote_edge(candidate):
    if candidate["score"] >= 0.8 and candidate["evidence_count"] >= 2:
        return {"status": "promoted", "edge": candidate}
    return {"status": "rejected"}
```
- question: 승격 조건은?
- answer: score 0.8 이상이고 evidence_count 2 이상
- explanation: and 조건이므로 score가 0.8 이상이고 evidence_count가 2 이상일 때만 promoted 상태와 원본 candidate를 반환한다. 그 외에는 rejected다. 이 임계값은 코드에 정한 정책일 뿐이며, evidence_count가 2라는 사실만으로 근거의 품질이나 독립성이 보장되지는 않는다. 두 key가 없으면 KeyError가 날 수 있다는 입력 전제도 확인해야 한다.
- project_context: KG edge promotion과 evidence-first 검증 사고에 직접 연결된다.

## PY4_L10_label_adjudication_001
- level: 10
- file: python_deep_expansion_v4.json
- title: 라벨 adjudication 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","labeling","adjudication","dataset"]
- reading_goal: 여러 라벨 후보를 규칙으로 최종 확정하는 흐름을 읽는다.
- code:
```python
def adjudicate(labels):
    if labels.count("KEEP") >= 2:
        return "KEEP"
    if "REJECT" in labels:
        return "REJECT"
    return "REVIEW"
```
- question: KEEP이 2개 이상이면 결과는?
- answer: KEEP
- explanation: labels에서 KEEP이 두 번 이상이면 첫 번째 return이 즉시 실행되어 KEEP이 된다. 이 규칙은 REJECT가 함께 있어도 KEEP 조건을 먼저 적용하므로 조건 순서가 우선순위다. KEEP이 두 개 미만일 때만 REJECT 포함 여부를 보고, 둘 다 아니면 REVIEW를 반환한다. 코드의 라벨 이름은 DROP이 아니라 REJECT다.
- project_context: 노드 승격/라벨 검수/teacher data 정리 흐름과 연결된다.

## PY4_L10_node_candidate_extract_001
- level: 10
- file: python_deep_expansion_v4.json
- title: 노드 후보 추출 흐름 읽기
- question_type: reverse_inference
- concepts: ["if","for","def","function","return","kg","node_candidate","extraction"]
- reading_goal: 텍스트에서 용어 후보를 찾아 node 후보 row로 만드는 흐름을 읽는다.
- code:
```python
def extract_candidates(chunk):
    rows = []
    for term in TERMS:
        if term.lower() in chunk["text"].lower():
            rows.append({"term": term, "chunk_id": chunk["id"]})
    return rows
```
- question: 이 함수의 목적은?
- answer: chunk text에서 용어 후보를 찾는다
- explanation: 각 term과 chunk text를 소문자로 바꾼 뒤 단순 부분 문자열 포함 여부를 검사하고, 맞으면 term과 chunk_id를 후보 row로 추가한다. 이는 최종 노드 확정이 아니라 검토 후보 수집 단계다. 단어 경계를 보지 않으므로 짧은 term이 더 긴 단어 일부와 우연히 맞는 오탐이 생길 수 있어 후속 검증이 필요하다.
- project_context: KG node pass의 아주 단순화된 독해 버전이다.

## PY4_L10_shard_status_001
- level: 10
- file: python_deep_expansion_v4.json
- title: shard status 집계 읽기
- question_type: output_prediction
- concepts: ["print","shard","status","batch"]
- reading_goal: 여러 shard의 완료 상태를 집계하는 코드를 읽는다.
- code:
```python
statuses = ["DONE", "DONE", "FAILED", "PENDING"]
done = sum(1 for status in statuses if status == "DONE")
print(done)
```
- question: 출력은?
- answer: 2
- explanation: shard status는 여러 작업 조각의 진행 상태를 나타낸다. DONE 상태가 두 개라면 완료된 shard 수를 세어 2가 출력된다. 대량 배치에서는 shard별 상태를 세어야 재시작할 범위와 실패한 조각을 빠르게 찾을 수 있다.
- project_context: LLM batch/shard 진행 상황을 읽는 데 직접 도움이 된다.

## PY23_L10_deploy_verify_checklist_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: 배포 후 검증 체크리스트 읽기
- question_type: order_choice
- concepts: ["comment","deploy","verification","checklist","github_pages"]
- reading_goal: push 후 앱이 실제로 최신 파일을 보는지 확인하는 순서를 익힌다.
- code:
```python
# 1. commit과 push 대상 branch 확인
# 2. CI/Pages deployment 성공과 source revision 확인
# 3. 공개 URL에서 HTML·JS·JSON status/response 확인
# 4. app.js와 data content version 확인
# 5. Console 오류와 service-worker/cache 상태 확인
```
- question: push 후 최신 반영이 안 보이면 특히 확인할 것은?
- answer: 브라우저/Pages 캐시와 app.js/data version
- explanation: local git status나 200 status 하나만으로 원하는 commit이 공개 배포됐다고 증명할 수 없다. remote branch와 deployment job이 가리키는 revision, 공개 URL의 response content/version, browser Console과 service worker cache를 순서대로 대조한다. cache 삭제부터 하기 전에 실제 어느 계층이 오래된지 evidence를 남기면 원인 추적이 쉽다.
- project_context: GitHub Pages 고정 주소에서 내용만 갱신되는 구조를 검증하는 루틴이다.

## PY23_L10_devtools_console_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: DevTools Console 오류 읽기
- question_type: meaning_choice
- concepts: ["devtools","console","javascript_error","debugging"]
- reading_goal: Console 오류가 파일명/줄번호/메시지를 제공한다는 것을 이해한다.
- code:
```python
Uncaught SyntaxError: Unexpected token '}'
    at app.js?v=20260529_force1:312:5
```
- question: 이 오류에서 먼저 확인할 위치는?
- answer: app.js의 312번째 줄 근처
- explanation: stack location은 app.js의 312행 5열 부근을 먼저 볼 단서다. SyntaxError는 parser가 더 진행한 뒤 문제를 발견할 수 있어 실제 누락된 quote나 brace가 앞줄에 있을 수도 있다. generated/minified bundle이면 source map으로 원본 위치를 찾고, 표시 줄 주변의 최근 diff와 syntax validation을 함께 확인한다.
- project_context: 함수 블록 교체 후 괄호가 깨졌는지 확인하는 데 중요하다.

## PY23_L10_devtools_network_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: DevTools Network 점검 포인트
- question_type: meaning_choice
- concepts: ["devtools","network","debugging","http_status"]
- reading_goal: 브라우저 Network 탭에서 어떤 파일이 실제로 로딩됐는지 확인하는 관점을 익힌다.
- code:
```python
Network tab check:
- index.html status
- app.js status and query version
- style.css status
- lesson JSON status
- side_cards JSON status
```
- question: Loading 화면을 조사할 때 Network에서 확인할 내용은?
- answer: app.js와 JSON 요청의 status·response·version
- explanation: Network tab에서 request URL, status, response body, initiator와 cache/service-worker 표시를 확인한다. 200만 보인다고 JavaScript 실행이나 JSON parse가 성공한 것은 아니고 304도 정상 cache validation일 수 있다. Console error와 application state를 함께 연결해 어느 단계에서 멈췄는지 찾는다.
- project_context: 서버 로그와 브라우저 Network 탭을 같이 보면 캐시/404/JS 오류를 빨리 좁힐 수 있다.

## PY23_L10_manifest_json_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: PWA manifest.json 읽기
- question_type: meaning_choice
- concepts: ["pwa","manifest","install","web_app"]
- reading_goal: PWA 설치 정보가 manifest.json에 담긴다는 것을 이해한다.
- code:
```python
{
  "name": "Python Reading Trainer",
  "short_name": "PyReader",
  "start_url": "./index.html",
  "display": "standalone"
}
```
- question: display: standalone의 의미에 가장 가까운 것은?
- answer: 브라우저 UI가 덜 보이는 앱처럼 실행되게 한다
- explanation: display="standalone"은 installed app을 열 때 가능한 경우 browser UI를 줄인 standalone 표시 mode를 선호한다는 뜻이다. 이것만으로 설치 가능하거나 실제 standalone 표시가 보장되지는 않으며 browser와 platform 지원에 따라 fallback된다. name, icons, start_url, scope와 HTTPS/service worker 등 설치 기준도 함께 검증해야 한다.
- project_context: 폰 홈 화면에 학습 앱처럼 붙여 쓰는 방향과 연결된다.

## PY23_L10_mobile_layout_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: 모바일 화면 대응 CSS 읽기
- question_type: meaning_choice
- concepts: ["responsive","css","media_query","mobile"]
- reading_goal: 화면 폭이 좁을 때 레이아웃을 바꾸는 CSS를 읽는다.
- code:
```python
@media (max-width: 720px) {
  .app-shell {
    grid-template-columns: 1fr;
  }
}
```
- question: max-width: 720px 조건은 언제 적용되는가?
- answer: 화면 폭이 720px 이하일 때
- explanation: mobile layout은 작은 화면에서도 버튼과 글자가 잘 보이게 배치하는 방식이다. media query를 쓰면 화면 크기에 따라 CSS를 다르게 적용할 수 있다. 따라서 정답은 ‘화면 폭이 720px 이하일 때’이다.
- project_context: 폰에서 오른쪽 패널이나 코드 블록이 너무 넓어지는 문제를 줄이는 방식이다.

## PY23_L10_service_worker_concept_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: service worker 캐시 개념 읽기
- question_type: meaning_choice
- concepts: ["service_worker","cache","offline","pwa"]
- reading_goal: service worker가 네트워크 요청과 캐시 사이에 끼어들 수 있음을 이해한다.
- code:
```python
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```
- question: cached가 있으면 어떻게 되는가?
- answer: 네트워크 대신 캐시된 응답을 반환할 수 있다
- explanation: caches.match가 response를 찾으면 network에 가지 않고 cached response를 반환하는 cache-first 흐름이다. 이 snippet은 cache에 항목을 넣거나 version·삭제·network failure fallback을 구현하지 않는다. cache-first는 빠르고 offline에 도움이 되지만 stale asset을 오래 제공할 수 있으므로 install/activate의 version migration과 update 안내가 필요하다.
- project_context: PWA 캐시가 강하면 app.js를 바꿔도 오래된 코드가 보일 수 있다.

## PY23_L10_static_api_connection_001
- level: 10
- file: python_deploy_pwa_cache_storage_v23.json
- title: 정적 앱과 API 서버 연결 구조
- question_type: meaning_choice
- concepts: ["comment","static_app","api_server","fetch","architecture"]
- reading_goal: 정적 PWA가 fetch로 별도 API 서버를 호출하는 구조를 이해한다.
- code:
```python
# static app
http://localhost:8790/src/pwa/index.html

# API server
http://127.0.0.1:8000/search?q=lidar

# browser JS
fetch("http://127.0.0.1:8000/search?q=" + encodeURIComponent(q))
```
- question: 이 구조에서 8790 서버의 역할은?
- answer: HTML/CSS/JS 같은 정적 파일 제공
- explanation: 8790 server는 이 예시에서 HTML, CSS, JavaScript 같은 frontend file을 제공하고 8000 application은 search response를 만든다. 두 origin은 port가 달라 CORS 설정이 필요할 수 있다. phone에서 이 code를 실행하면 127.0.0.1은 PC가 아니라 phone이므로 공개 API host나 PC LAN address 및 bind/firewall 조건으로 바꿔야 한다.
- project_context: 정적 학습 frontend와 별도 search API를 연결할 때 origin과 host를 구분하는 구조다.

## PY103_L10_restore_reset_revert_001
- level: 10
- file: python_dev_environment_foundation_v103_a1.json
- title: restore, reset, revert 차이 읽기
- question_type: meaning_choice
- concepts: ["restore","reset","revert","git"]
- reading_goal: 되돌리기 명령의 영향 범위를 구분한다.
- code:
```python
git restore src/pwa/app.js
git revert 57bf043
```
- question: 커밋하지 않은 파일 수정을 되돌릴 때 먼저 고려할 명령은?
- answer: git restore
- explanation: git restore는 보통 작업 폴더의 미커밋 변경을 기준 commit 상태로 되돌리고, git revert는 이미 기록된 commit을 취소하는 새 commit을 만든다. restore는 대상 파일의 미커밋 내용을 잃게 할 수 있으므로 먼저 git diff를 읽고 필요한 변경은 복사하거나 stash한다. reset은 index나 이력까지 움직일 수 있어 범위를 이해한 뒤 사용해야 한다.
- project_context: 잘못된 패치나 임시 변경을 되돌릴 때 필요한 카드다.

## PY103_L10_setup_checklist_001
- level: 10
- file: python_dev_environment_foundation_v103_a1.json
- title: 개발환경 재현 체크리스트 읽기
- question_type: meaning_choice
- concepts: ["setup_checklist","validation","reproducibility"]
- reading_goal: 새 PC나 서버에서 환경을 재현하는 순서를 정리한다.
- code:
```python
python --version
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python tools/validate_lessons.py
```
- question: 이 흐름의 목적은?
- answer: 새 환경에서 같은 프로젝트 실행 조건을 재현하고 검증한다
- explanation: 개발환경 재현은 Python 버전 확인, venv 생성, 활성화, 패키지 설치, 검증 명령 실행을 한 묶음으로 본다. 설치만 끝났다고 성공이 아니라 실제 프로젝트 검증이 통과해야 환경이 맞다고 볼 수 있다. Windows와 Ubuntu는 활성화 명령이 다를 수 있고, GPU 프로젝트는 nvidia-smi와 torch.cuda 확인도 추가해야 한다. 체크리스트를 남기면 새 장비나 서버에서 시행착오가 줄어든다.
- project_context: 앞으로 프로젝트를 다른 PC나 GPU 서버에 옮길 때 기준이 되는 카드다.
