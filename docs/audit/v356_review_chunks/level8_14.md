# V356 semantic review — Level 8 chunk 14

Cards 261-280 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY51_L08_version_display_001
- level: 8
- file: python_pwa_install_update_ux_v51.json
- title: version display UX 읽기
- question_type: meaning_choice
- concepts: ["version_display","APP_DATA_VERSION","debug_ux"]
- reading_goal: 현재 앱 데이터 버전을 화면에 표시하는 이유를 이해한다.
- code:
```python
footer.textContent = 'data version: ' + APP_DATA_VERSION
```
- question: version display가 있으면 좋은 점은?
- answer: 사용자가 현재 최신 버전을 보고 있는지 확인할 수 있다
- explanation: APP_DATA_VERSION을 표시하면 현재 load한 data bundle version을 진단하는 데 도움이 된다. 이것이 app code, service worker, API schema version과 같다는 보장은 없으므로 label을 정확히 쓰고 build commit이나 app version을 별도로 표시할 수 있다. 화면 숫자만으로 cache 최신성을 증명하지는 않는다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY16_L08_manifest_load_001
- level: 8
- file: python_rag_kg_pipeline_review_v16.json
- title: 문서 manifest 로딩 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","for","import","print","continue","manifest","jsonl","file","pipeline"]
- reading_goal: JSONL manifest를 한 줄씩 읽어 문서 목록으로 만드는 코드를 읽는다.
- code:
```python
import json
from pathlib import Path

rows = []
for line in Path("manifest.jsonl").read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    rows.append(json.loads(line))

print(len(rows))
```
- question: 이 코드의 목적에 가장 가까운 것은?
- answer: manifest.jsonl의 각 줄을 JSON 객체로 읽어 rows에 모은다
- explanation: JSONL은 보통 한 줄에 JSON 값 하나를 저장하는 형식이다. 이 코드는 파일 전체를 read_text로 메모리에 읽고, 빈 줄을 건너뛴 뒤 각 줄을 json.loads로 파싱해 rows에 모두 저장한다. 따라서 줄 단위로 파싱하지만 메모리를 절약하는 스트리밍 코드는 아니다. 큰 파일은 open으로 연 파일 객체를 직접 반복하고 필요한 줄을 즉시 처리해야 한다.
- project_context: 수집 문서 목록, chunk manifest, node/edge 후보 목록을 읽는 기본 패턴이다.

## PY16_L08_metadata_normalize_001
- level: 8
- file: python_rag_kg_pipeline_review_v16.json
- title: 메타데이터 정규화 함수 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","metadata","normalization","dict","get"]
- reading_goal: 문서마다 다른 메타 필드를 하나의 공통 스키마로 맞추는 코드를 읽는다.
- code:
```python
def normalize_doc(row):
    return {
        "doc_id": str(row.get("doc_id") or row.get("id")),
        "title": (row.get("title") or "").strip(),
        "source_url": row.get("url") or row.get("source_url"),
        "lane": row.get("lane", "B"),
    }
```
- question: row.get('doc_id') or row.get('id')의 실제 동작은?
- answer: doc_id가 truthy이면 쓰고, 아니면 id 값을 대신 쓴다
- explanation: or는 앞 값이 None일 때만이 아니라 빈 문자열, 0, False처럼 falsy인 모든 경우에 뒤 값을 선택한다. 따라서 두 필드명이 다른 입력을 합치는 데 쓸 수 있지만, 두 값이 모두 없으면 str(None)이 되어 문자열 "None"이 생긴다. doc_id가 필수라면 대체값을 고른 뒤 None과 빈 문자열을 명시적으로 검사해야 한다.
- project_context: A/B lane 문서, 수집 소스, PDF 추출본을 하나의 처리 흐름에 태울 때 필요한 코드다.

## PY8_L08_appjs_confused_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 모르겠음 상태 저장 읽기
- question_type: meaning_choice
- concepts: ["javascript","progress","dict"]
- reading_goal: 카드 id를 key로 하여 confused 상태를 저장하는 흐름을 읽는다.
- code:
```python
function markConfused(cardId) {
  const progress = loadProgress();
  progress.confused[cardId] = true;
  saveProgress(progress);
}
```
- question: progress.confused[cardId] = true의 의미는?
- answer: 해당 카드를 모르겠음으로 표시
- explanation: 대괄호 표기법으로 progress.confused 객체의 cardId 속성을 true로 만들거나 기존 값을 true로 덮어쓴 뒤 saveProgress에 전달한다. 이 코드가 실행되려면 loadProgress()의 결과에 confused 객체가 이미 있어야 하며, 없으면 속성을 설정하는 줄에서 TypeError가 난다. 또한 이 함수는 false로 해제하는 동작이나 saveProgress 내부의 실제 저장 성공까지 보장하지 않는다.
- project_context: 복습 우선 모드와 오늘 큐 기준을 이해하는 데 중요하다.

## PY8_L08_appjs_next_modulo_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 다음 카드 modulo 읽기
- question_type: meaning_choice
- concepts: ["javascript","modulo","navigation"]
- reading_goal: 마지막 카드 다음에 다시 처음으로 돌아가는 구조를 읽는다.
- code:
```python
function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;
  renderCard();
}
```
- question: % cards.length의 목적은?
- answer: 끝에서 처음으로 순환
- explanation: cards.length가 0보다 크고 currentIndex가 0부터 마지막 인덱스 사이에 있다고 가정한다. 마지막 인덱스에 1을 더하면 cards.length가 되고, 이를 cards.length로 나눈 나머지는 0이어서 첫 카드로 돌아간다. %는 나눗셈 자체가 아니라 나머지 연산이다. 빈 배열이면 0으로 나머지를 구해 currentIndex가 NaN이 되므로 이 코드만으로 빈 배열까지 안전하게 처리하지는 않는다.
- project_context: 카드 앱의 순환 이동 로직을 읽는 데 중요하다.

## PY8_L08_appjs_progress_load_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: app.js 진도 로딩 읽기
- question_type: meaning_choice
- concepts: ["javascript","localStorage","progress"]
- reading_goal: localStorage에서 진도 JSON을 읽고 기본값을 쓰는 흐름을 읽는다.
- code:
```python
const progressKey = "python-reading-trainer-progress-v1";
const raw = localStorage.getItem(progressKey);
const progress = raw ? JSON.parse(raw) : { seen: {} };
```
- question: 저장된 항목이 없어 raw가 null이면 progress는 무엇이 되는가?
- answer: { seen: {} } 기본값
- explanation: localStorage.getItem은 해당 key가 없으면 null을 반환한다. null은 falsy이므로 삼항연산자는 JSON.parse(raw)를 실행하지 않고 { seen: {} }를 progress에 넣는다. 저장된 값이 빈 문자열이어도 같은 기본값 경로를 탄다. 반면 truthy인 문자열이 잘못된 JSON이면 JSON.parse가 예외를 던지며, 이 코드에는 그 예외나 파싱 결과의 구조를 검사하는 처리가 없다.
- project_context: 현재 앱의 진도 저장 구조를 직접 읽는 카드다.

## PY8_L08_appjs_sort_cards_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 카드 정렬 함수 읽기
- question_type: meaning_choice
- concepts: ["return","javascript","sort","level"]
- reading_goal: 레벨 우선, id 보조 기준으로 카드를 정렬하는 코드를 읽는다.
- code:
```python
cards.sort(function(a, b) {
  if (a.level !== b.level) {
    return a.level - b.level;
  }
  return a.id.localeCompare(b.id);
});
```
- question: level이 같으면 무엇으로 정렬하는가?
- answer: id 문자열
- explanation: level이 다르면 a.level - b.level의 부호에 따라 숫자가 작은 level부터 정렬한다. level이 같을 때만 localeCompare로 id 문자열의 로캘 기준 순서를 비교한다. sort()는 정렬된 복사본을 만드는 것이 아니라 cards 배열 자체의 순서를 바꾼다. 또한 localeCompare는 문자열 비교 방법이지, 같은 비교값의 원래 순서를 보존한다는 의미의 ‘안정 정렬’을 보장하는 함수는 아니다.
- project_context: 카드가 앱에서 어떤 순서로 표시되는지 이해한다.

## PY8_L08_cost_estimate_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: API 비용 추정 코드 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","cost","api","estimate"]
- reading_goal: 요청 수와 단가로 총 비용을 계산하는 코드를 읽는다.
- code:
```python
def estimate_cost(num_requests, cost_per_request):
    return num_requests * cost_per_request

print(estimate_cost(1000, 0.02))
```
- question: 출력은?
- answer: 20.0
- explanation: 함수는 요청 수 1000과 요청당 단가 0.02를 곱하므로 20.0을 출력한다. 결과에는 통화 단위가 없고, 모든 요청의 가격이 같다는 단순한 가정을 사용한다. 실제 API가 입력·출력 토큰, 모델, 캐시, 도구 호출 등에 따라 과금한다면 해당 사용량과 단가를 항목별로 계산해야 하며, 청구 금액처럼 정확한 소수 계산에는 float 대신 Decimal이나 정수 최소 단위를 고려한다.
- project_context: LLM API/Bedrock batch 비용 판단과 연결된다.

## PY8_L08_js_json_parse_catch_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: JSON.parse catch 읽기
- question_type: meaning_choice
- concepts: ["return","javascript","json","try_catch"]
- reading_goal: 저장된 JSON이 깨졌을 때 기본값으로 복구하는 코드를 읽는다.
- code:
```python
try {
  const parsed = JSON.parse(raw);
  return parsed;
} catch {
  return {};
}
```
- question: JSON.parse(raw)가 예외를 던지면 이 try/catch를 포함한 함수는 무엇을 반환하는가?
- answer: 빈 객체
- explanation: JSON.parse 자체는 잘못된 JSON을 반환값으로 처리하지 않고 SyntaxError를 던진다. 그 예외를 주변 catch가 잡아 이 함수가 빈 객체 {}를 반환한다. 따라서 ‘JSON.parse가 {}를 반환한다’고 이해하면 안 된다. 또한 호출부가 seen이나 confused 같은 속성을 기대한다면 빈 객체만으로는 부족할 수 있고, 원인 로그도 남기지 않아 손상 데이터를 알아채기 어렵다.
- project_context: localStorage 기반 앱에서 방어 코드가 중요하다.

## PY8_L08_powershell_marker_patch_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 마커 기반 패치 읽기
- question_type: meaning_choice
- concepts: ["powershell","regex","patch","marker"]
- reading_goal: 이미 패치가 있으면 교체하고 없으면 뒤에 추가하는 구조를 읽는다.
- code:
```python
if ($app.Contains($markerStart)) {
  $app = [regex]::Replace($app, $pattern, $patchBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $patchBlock
}
```
- question: markerStart가 포함되어 있으면 어느 경로를 실행하는가?
- answer: 정규식으로 기존 블록 교체를 시도
- explanation: Contains($markerStart)가 참이면 if 분기로 들어가 [regex]::Replace를 실행하고, 거짓일 때만 파일 끝에 patchBlock을 덧붙인다. 시작 마커가 있다는 사실만으로 $pattern이 끝 마커까지 정확히 매칭된다는 보장은 없다. 패턴이 매칭되지 않으면 Replace 결과는 원문과 같아질 수 있으므로, 실제 패치 도구라면 교체 횟수나 시작·끝 마커의 유일성을 검증해야 한다.
- project_context: SWAP-IN과 비슷하게 안전한 반복 패치 구조를 이해한다.

## PY8_L08_powershell_utf8_nobom_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: BOM 없는 UTF-8 저장 읽기
- question_type: meaning_choice
- concepts: ["powershell","encoding","utf8"]
- reading_goal: System.Text.UTF8Encoding(false)로 BOM 없는 파일을 저장하는 의미를 읽는다.
- code:
```python
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($lessonPath, $json, $utf8NoBom)
```
- question: UTF8Encoding($false)의 $false는 무엇을 뜻하는가?
- answer: BOM을 쓰지 않음
- explanation: UTF8Encoding($false)의 인자는 인코딩 객체가 UTF-8 BOM을 제공할지 정하며, false이므로 BOM 없는 UTF-8을 사용한다. WriteAllText는 $json 문자열을 그 인코딩으로 $lessonPath에 쓰고 기존 파일이 있으면 내용을 덮어쓴다. BOM을 빼는 것은 파일 앞 표시를 제어할 뿐, $json의 JSON 문법이 올바른지까지 검사하지는 않는다.
- project_context: JSON 파일 생성 시 python -m json.tool 오류를 피하는 데 중요하다.

## PY8_L08_sidecard_filter_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 사이드카드 필터 읽기
- question_type: meaning_choice
- concepts: ["return","javascript","filter","side_card"]
- reading_goal: 반복 노출 횟수와 관련성 조건으로 사이드카드를 고르는 흐름을 읽는다.
- code:
```python
const pool = sideCards.filter(function(sc) {
  return seenCount < 3 && (hasOverlap || isGeneral);
});
```
- question: pool에 들어가는 조건은?
- answer: 3회 미만이고 관련 있거나 일반 카드
- explanation: 괄호 때문에 먼저 hasOverlap || isGeneral을 계산하고, 그 결과와 seenCount < 3이 모두 참일 때 현재 요소를 pool에 남긴다. 즉 ‘3회 미만’이면서 동시에 ‘관련 카드이거나 일반 카드’여야 한다. 이 조각에서는 콜백 매개변수 sc를 전혀 사용하지 않고 세 값도 바깥에서 가져오므로, 필터 실행 중 값이 같다면 sideCards의 모든 요소가 함께 남거나 함께 빠진다. 카드마다 판정하려는 코드라면 sc로부터 조건값을 계산하는 위치를 확인해야 한다.
- project_context: 학습앱의 보조 설명 노출 로직과 연결된다.

## PY8_L08_throttle_limit_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 슬라이스로 배치 수 제한 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","limit","throttle","batch"]
- reading_goal: 전체 항목 중 일부만 처리해 비용/시간을 제한하는 코드를 읽는다.
- code:
```python
def throttle(items, limit):
    for item in items[:limit]:
        process(item)
```
- question: items[:limit]의 역할은?
- answer: 앞에서 limit개만 처리
- explanation: items가 슬라이싱 가능한 시퀀스이고 limit이 양수라면 items[:limit]은 앞에서 최대 limit개를 골라 그 항목들에만 process를 호출한다. 이는 한 번의 배치 크기를 자르는 코드이지 초당 호출 수나 호출 간격을 조절하는 rate throttle은 아니다. limit이 음수이면 ‘0개’가 아니라 뒤에서 |limit|개를 뺀 앞부분이 선택되고, generator처럼 슬라이싱할 수 없는 입력은 TypeError가 나므로 입력 조건을 명시해야 한다.
- project_context: 크레딧/시간 제한 안에서 배치 실행할 때 중요하다.

## PY8_L08_unique_id_validation_001
- level: 8
- file: python_realworld_expansion_v8.json
- title: 중복 id 검증 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","validation","set","id"]
- reading_goal: 전체 id 개수와 set 개수를 비교해 중복 여부를 판단하는 코드를 읽는다.
- code:
```python
def validate_unique_ids(cards):
    ids = [card["id"] for card in cards]
    return len(ids) == len(set(ids))
```
- question: False가 나오면 무엇을 의미하는가?
- answer: 중복 id가 있음
- explanation: 먼저 모든 card['id']를 ids에 모으고, set(ids)가 같은 값의 중복을 제거한 뒤 두 길이를 비교한다. 결과가 False라면 적어도 하나의 id 값이 중복되었다는 뜻이다. 다만 id key가 없으면 KeyError, id가 리스트처럼 hash할 수 없는 값이면 TypeError가 나며, 빈 cards는 길이 0과 0이 같아 True다. 이 검사는 형식·빈 문자열·대소문자 규칙까지 검증하지 않는다.
- project_context: 카드 대량 확장 시 앱 오류를 막는 검증이다.

## PY40_L08_dependency_001
- level: 8
- file: python_refactoring_maintainability_v40.json
- title: dependency 읽기
- question_type: meaning_choice
- concepts: ["dependency","coupling","module"]
- reading_goal: 한 코드가 다른 코드에 의존하는 dependency 개념을 이해한다.
- code:
```python
renderCard(card, progressStore)

renderCard depends on:
  card data
  progressStore
```
- question: dependency가 많아질수록 생길 수 있는 문제는?
- answer: 수정 영향 범위가 커질 수 있다
- explanation: dependency는 코드가 다른 값, 모듈, 서비스의 동작에 기대는 관계다. 문제는 단순 개수보다 결합도와 변경 방향이다. renderCard가 progressStore의 구체적인 저장 방식을 알아야 하면 수정 영향이 커지므로 필요한 작은 interface를 전달하고 의존성을 명시하면 테스트와 교체가 쉬워진다.
- project_context: 프론트 UI, 로컬 저장, API 저장이 서로 강하게 묶이지 않게 해야 한다.

## PY40_L08_naming_001
- level: 8
- file: python_refactoring_maintainability_v40.json
- title: naming 읽기
- question_type: meaning_choice
- concepts: ["naming","readability","code_style"]
- reading_goal: 이름이 코드 의미를 전달하는 중요한 도구임을 이해한다.
- code:
```python
bad:
  x = get()

better:
  lessonFiles = loadLessonFileList()
```
- question: lessonFiles라는 이름이 좋은 이유는?
- answer: 값의 의미를 더 잘 설명한다
- explanation: naming은 변수, 함수, 파일 이름으로 코드의 의도를 드러내는 작업이다. 좋은 이름은 주석 없이도 코드가 무엇을 하는지 읽게 해준다. lessonFiles처럼 대상과 용도가 함께 드러나는 이름은 파일 목록을 다루는 변수라는 점을 바로 알려 준다. 따라서 정답은 ‘값의 의미를 더 잘 설명한다’이다.
- project_context: app.js의 lessonFiles처럼 핵심 배열 이름은 명확해야 한다.

## PY40_L08_single_responsibility_001
- level: 8
- file: python_refactoring_maintainability_v40.json
- title: single responsibility 읽기
- question_type: meaning_choice
- concepts: ["single_responsibility","module_design","function_design"]
- reading_goal: 하나의 함수/모듈이 한 가지 책임을 갖는 설계를 이해한다.
- code:
```python
bad:
  loadCardsAndRenderAndSaveProgress()

better:
  loadCards()
  renderCards()
  saveProgress()
```
- question: better 구조의 장점은?
- answer: 각 함수의 책임이 분리된다
- explanation: load, render, save를 별도 함수로 나누면 각 작업의 입력·출력과 실패 범위를 독립적으로 이해하고 테스트하기 쉬워진다. 다만 이름을 세 개로 나눈 것만으로 책임 분리가 완성되지는 않는다. 각 함수가 숨은 전역 상태나 서로의 세부 구현에 강하게 의존하지 않는지도 확인해야 한다.
- project_context: 카드 로딩, 화면 표시, 진행률 저장을 분리하면 앱 확장이 쉬워진다.

## PY46_L08_atomic_write_001
- level: 8
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: atomic write 읽기
- question_type: meaning_choice
- concepts: ["atomic_write","temp_file","rename"]
- reading_goal: 임시 파일에 먼저 쓰고 성공 후 최종 파일명으로 바꾸는 패턴을 이해한다.
- code:
```python
tmp = output.with_suffix('.tmp')
write_result(tmp)
tmp.replace(output)
```
- question: temp file then rename 패턴의 장점은?
- answer: 중간에 끊긴 파일이 최종 output 이름으로 남는 위험을 줄인다
- explanation: 같은 filesystem의 임시 파일을 완전히 쓰고 검증한 뒤 replace하면 최종 이름에 partial content가 보이는 window를 줄일 수 있다. rename의 atomicity와 overwrite 동작은 OS·filesystem에 달려 있고, 전원 장애 내구성에는 flush/fsync와 directory sync가 추가로 필요할 수 있다. 임시 파일 정리도 고려한다.
- project_context: 대용량 JSONL, manifest, audit TSV를 쓸 때 안전한 출력 패턴이다.

## PY46_L08_idempotent_job_001
- level: 8
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: idempotent job 읽기
- question_type: meaning_choice
- concepts: ["comment","idempotent","rerun_safe","automation"]
- reading_goal: 같은 작업을 다시 실행해도 결과가 꼬이지 않는 idempotent 개념을 이해한다.
- code:
```python
upsert(item)
# run once or twice -> final state is same
```
- question: idempotent job의 의미는?
- answer: 여러 번 실행해도 최종 상태가 불필요하게 중복되지 않는다
- explanation: idempotent 작업은 같은 입력과 idempotency key로 한 번 또는 여러 번 적용해도 관찰되는 최종 상태가 같다. upsert도 올바른 UNIQUE key와 update 의미가 있어야 하고 email 전송 같은 외부 side effect는 별도 dedup 기록이 필요하다. 완료 항목을 skip하는 것은 최적화이지 idempotence 정의 자체는 아니다.
- project_context: v41~v45 스크립트의 already exists, already linked guard가 idempotent 안전장치다.

## PY46_L08_retry_queue_001
- level: 8
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: retry queue 읽기
- question_type: meaning_choice
- concepts: ["if","retry_queue","failed_items","rerun"]
- reading_goal: 실패한 항목만 따로 모아 다시 처리하는 retry queue를 이해한다.
- code:
```python
if job_failed(item):
    retry_queue.append(item_id)
```
- question: retry queue의 목적은?
- answer: 실패한 항목만 다시 실행하기 위해
- explanation: retry queue는 transient 실패 항목을 전체 작업과 분리해 다시 실행한다. item_id만 저장하면 input version이나 attempt 정보가 사라질 수 있으므로 payload reference, 오류, attempts, next retry time을 함께 둔다. 최대 횟수 뒤에는 dead-letter 또는 사람 검토로 보내고 idempotency를 보장한다.
- project_context: node extraction, edge promotion, lesson validation에서 실패 목록만 재처리할 수 있다.
