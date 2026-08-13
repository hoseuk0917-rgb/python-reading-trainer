# V356 semantic review — Level 8 chunk 5

Cards 81-100 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY9_REVIEW_PSPATCH_001
- level: 8
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/5] PowerShell 패치 스크립트 전체 목적
- question_type: review_choice
- concepts: ["powershell","patch","marker","review"]
- reading_goal: 마커 기반으로 app.js 기능 블록을 교체/추가하는 스크립트 흐름을 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
$ErrorActionPreference = "Stop"
$appPath = ".\src\pwa\app.js"
$app = Get-Content $appPath -Raw -Encoding UTF8
$markerStart = "// === FEATURE START ==="
$markerEnd = "// === FEATURE END ==="
$featureBlock = "// === FEATURE START ===
function sayHello() {
  console.log('hello');
}
// === FEATURE END ==="
if ($app.Contains($markerStart)) {
  $pattern = [regex]::Escape($markerStart) + "[\s\S]*?" + [regex]::Escape($markerEnd)
  $app = [regex]::Replace($app, $pattern, $featureBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $featureBlock
}
Set-Content $appPath -Value $app -Encoding UTF8
Select-String -Path $appPath -Pattern "FEATURE START|sayHello" -Context 0,2
```
- question: 이 스크립트의 전체 목적은?
- answer: app.js에 FEATURE 블록을 추가하거나 기존 블록을 교체한다
- explanation: 스크립트는 app.js 전체를 문자열로 읽고, 시작 마커가 있으면 시작·끝 마커를 포함하는 비탐욕 정규식으로 featureBlock 교체를 시도하며, 없으면 파일 끝에 블록을 붙인다. 그 뒤 Set-Content로 파일을 다시 쓰고 Select-String 결과를 표시한다. 시작 마커만 있고 끝 마커가 없으면 정규식이 매칭되지 않아 교체 없이 원문을 다시 쓸 수 있으며, 여러 완전한 블록이 있으면 Regex.Replace가 모두 바꿀 수 있다.
- project_context: SWAP-IN/패치 스크립트 독해에 직접 연결된다.

## PY9_REVIEW_PSPATCH_002
- level: 8
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/5] ErrorActionPreference 의미
- question_type: review_choice
- concepts: ["powershell","error","script"]
- reading_goal: 스크립트 중간 에러를 무시하지 않도록 하는 설정을 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
$ErrorActionPreference = "Stop"
$appPath = ".\src\pwa\app.js"
$app = Get-Content $appPath -Raw -Encoding UTF8
$markerStart = "// === FEATURE START ==="
$markerEnd = "// === FEATURE END ==="
$featureBlock = "// === FEATURE START ===
function sayHello() {
  console.log('hello');
}
// === FEATURE END ==="
if ($app.Contains($markerStart)) {
  $pattern = [regex]::Escape($markerStart) + "[\s\S]*?" + [regex]::Escape($markerEnd)
  $app = [regex]::Replace($app, $pattern, $featureBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $featureBlock
}
Set-Content $appPath -Value $app -Encoding UTF8
Select-String -Path $appPath -Pattern "FEATURE START|sayHello" -Context 0,2
```
- question: ErrorActionPreference = Stop의 목적은?
- answer: 에러가 나면 스크립트를 멈추게 한다
- explanation: $ErrorActionPreference = 'Stop'은 PowerShell cmdlet의 비종료 오류를 종료 오류처럼 처리해 일반 흐름을 중단하게 한다. 이미 종료 오류인 예외에도 중단 흐름이 적용된다. 그러나 모든 외부 실행 파일의 비정상 종료 코드를 자동 예외로 바꾸거나 이전 파일 변경을 rollback하는 트랜잭션은 아니다. 따라서 오류 뒤 계속 실행될 위험은 줄이지만 별도 검증·백업·원자적 쓰기를 대신하지 않는다.
- project_context: 대량 패치에서 실패한 줄 이후가 계속 실행되는 위험을 줄인다.

## PY9_REVIEW_PSPATCH_003
- level: 8
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/5] 마커 탐지 분기
- question_type: review_choice
- concepts: ["powershell","if","marker"]
- reading_goal: 기존 블록이면 교체를 시도하고 없으면 추가하는 조건문을 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
$ErrorActionPreference = "Stop"
$appPath = ".\src\pwa\app.js"
$app = Get-Content $appPath -Raw -Encoding UTF8
$markerStart = "// === FEATURE START ==="
$markerEnd = "// === FEATURE END ==="
$featureBlock = "// === FEATURE START ===
function sayHello() {
  console.log('hello');
}
// === FEATURE END ==="
if ($app.Contains($markerStart)) {
  $pattern = [regex]::Escape($markerStart) + "[\s\S]*?" + [regex]::Escape($markerEnd)
  $app = [regex]::Replace($app, $pattern, $featureBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $featureBlock
}
Set-Content $appPath -Value $app -Encoding UTF8
Select-String -Path $appPath -Pattern "FEATURE START|sayHello" -Context 0,2
```
- question: 이미 FEATURE START가 있으면 어떤 경로로 가는가?
- answer: regex Replace 경로로 들어가 교체를 시도한다
- explanation: app.Contains(markerStart)가 참이면 if 분기에서 pattern을 만들고 Regex.Replace를 호출한다. 그러나 Contains는 시작 마커 하나만 확인한다. 끝 마커가 없거나 순서가 잘못되어 pattern이 매칭되지 않으면 교체되지 않으며, 이 코드에는 매칭 수 확인이 없다. 따라서 같은 패치를 여러 번 실행해도 항상 정확히 한 블록만 남는다고 보장할 수 없다.
- project_context: 같은 패치를 여러 번 실행해도 중복 블록이 안 쌓이게 하는 구조다.

## PY9_REVIEW_PSPATCH_004
- level: 8
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/5] 없으면 append
- question_type: review_choice
- concepts: ["powershell","append","string"]
- reading_goal: 기존 마커가 없을 때 파일 끝에 새 블록을 붙이는 코드를 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
$ErrorActionPreference = "Stop"
$appPath = ".\src\pwa\app.js"
$app = Get-Content $appPath -Raw -Encoding UTF8
$markerStart = "// === FEATURE START ==="
$markerEnd = "// === FEATURE END ==="
$featureBlock = "// === FEATURE START ===
function sayHello() {
  console.log('hello');
}
// === FEATURE END ==="
if ($app.Contains($markerStart)) {
  $pattern = [regex]::Escape($markerStart) + "[\s\S]*?" + [regex]::Escape($markerEnd)
  $app = [regex]::Replace($app, $pattern, $featureBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $featureBlock
}
Set-Content $appPath -Value $app -Encoding UTF8
Select-String -Path $appPath -Pattern "FEATURE START|sayHello" -Context 0,2
```
- question: markerStart가 없으면 어떤 일이 일어나는가?
- answer: 파일 끝에 featureBlock을 붙인다
- explanation: 시작 마커가 없으면 TrimEnd()가 app 문자열 끝의 공백과 줄바꿈을 제거하고, CRLF 한 개와 featureBlock을 이어 붙인다. 이후 공통 Set-Content가 app.js 전체를 다시 쓴다. 이는 추가 경로의 문자열 결과를 설명할 뿐 JavaScript 문법이나 삽입 위치의 적절성을 검증하지 않는다. 또한 -Encoding UTF8의 BOM 동작은 Windows PowerShell과 최신 PowerShell에서 다를 수 있어 대상 실행 환경을 확인해야 한다.
- project_context: 새 기능을 처음 추가할 때의 패치 흐름이다.

## PY57_L08_data_manifest_001
- level: 8
- file: python_data_governance_copyright_v57.json
- title: data manifest 읽기
- question_type: meaning_choice
- concepts: ["data_manifest","metadata","governance"]
- reading_goal: 데이터 파일 목록과 출처/라이선스 정보를 manifest로 관리하는 방식을 이해한다.
- code:
```python
manifest.append({
  file: path,
  sourceUrl: url,
  license: license
})
```
- question: data manifest의 역할은?
- answer: 데이터 파일별 출처와 사용 조건을 한곳에 정리한다
- explanation: 파일이 많아질수록 manifest가 있어야 나중에 검증과 제출 문서 작성이 쉬워진다. data manifest는 데이터셋의 출처, 파일명, 라이선스, 처리 상태를 정리하는 목록이다. 나중에 제출하거나 검증할 때 근거 추적에 도움이 된다. 따라서 정답은 ‘데이터 파일별 출처와 사용 조건을 한곳에 정리한다’이다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L08_derived_data_001
- level: 8
- file: python_data_governance_copyright_v57.json
- title: derived data 읽기
- question_type: meaning_choice
- concepts: ["derived_data","transformation","copyright"]
- reading_goal: 원자료를 가공해 만든 파생 데이터에도 출처와 조건 관리가 필요함을 이해한다.
- code:
```python
derived = {
  sourceId: original.id,
  transform: 'summary'
}
```
- question: derived data에서 sourceId가 필요한 이유는?
- answer: 가공 데이터가 어떤 원자료에서 나왔는지 추적하기 위해
- explanation: summary·chunk·card 같은 derived item은 sourceId뿐 아니라 source version, transform code·date와 applicable license를 이어받아 provenance를 유지해야 한다. 가공했다고 원자료의 저작권·license 의무가 자동으로 사라지는 것은 아니다. 원문 삭제·정정 요청을 파생물에 전파할 수 있게 한다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L08_open_license_001
- level: 8
- file: python_data_governance_copyright_v57.json
- title: open license 읽기
- question_type: meaning_choice
- concepts: ["if","open_license","reuse","attribution"]
- reading_goal: 오픈 라이선스 자료도 조건에 따라 표기나 제한이 있을 수 있음을 이해한다.
- code:
```python
if license.requiresAttribution:
  showAttribution(source)
```
- question: open license에서 확인할 수 있는 조건은?
- answer: 출처표기, 변경 가능 여부, 상업적 이용 가능 여부 같은 조건
- explanation: open license는 정확한 license 이름과 version에 따라 reuse 조건을 미리 부여한다. attribution, commercial restriction, no-derivatives, share-alike와 database rights를 구분하고, 여러 source를 결합할 때 license compatibility도 확인한다. 단순 requiresAttribution flag로 모든 조건을 표현할 수 없다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L08_public_data_001
- level: 8
- file: python_data_governance_copyright_v57.json
- title: public data 읽기
- question_type: meaning_choice
- concepts: ["public_data","open_data","reuse"]
- reading_goal: 공공데이터도 사용 조건과 출처를 확인해야 함을 이해한다.
- code:
```python
dataset = {
  type: 'public_data',
  sourceUrl: url,
  license: licenseText
}
```
- question: public data를 쓸 때도 확인해야 하는 것은?
- answer: 출처와 사용 조건
- explanation: 공개적으로 접근 가능한 public data도 자동으로 무제한 재사용 가능한 것은 아니다. 각 dataset page의 이용허락범위, 출처표시, commercial·derivative 조건, 개인정보·제3자 권리와 API 약관을 확인한다. 같은 portal 안에서도 dataset별 조건이 다를 수 있다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY42_L08_chunksize_001
- level: 8
- file: python_data_processing_pandas_jsonl_v42.json
- title: chunksize 읽기
- question_type: meaning_choice
- concepts: ["for","chunksize","large_file","memory"]
- reading_goal: 큰 파일을 한 번에 다 읽지 않고 조각 단위로 처리하는 방식을 이해한다.
- code:
```python
for chunk in pd.read_csv('large.csv', chunksize=10000):
    process(chunk)
```
- question: chunksize를 쓰는 주된 이유는?
- answer: 큰 파일을 메모리에 한 번에 올리지 않기 위해
- explanation: pd.read_csv(..., chunksize=10000)은 TextFileReader를 돌려주고 반복할 때 최대 약 10,000행씩 DataFrame을 읽으므로 전체 파일을 동시에 메모리에 둘 필요가 없다. 다만 global sort, dedup, groupby처럼 chunk 경계를 넘는 연산은 중간 집계나 외부 저장을 별도로 설계해야 한다.
- project_context: 수십만 줄 JSONL/CSV 결과를 검증할 때 메모리 폭발을 줄이는 방식이다.

## PY42_L08_missing_value_001
- level: 8
- file: python_data_processing_pandas_jsonl_v42.json
- title: missing value 읽기
- question_type: meaning_choice
- concepts: ["print","missing_value","NaN","isna"]
- reading_goal: 빈 값과 NaN을 확인하는 기본 방식을 이해한다.
- code:
```python
missing_count = df['label'].isna().sum()
print(missing_count)
```
- question: df['label'].isna().sum()은 무엇을 세는가?
- answer: label column의 NaN·None 같은 결측값 개수
- explanation: isna()는 각 값이 pandas에서 missing으로 인식되는 NaN, None, NaT 등인지 Boolean으로 만들고 sum()은 True 개수를 센다. 일반적인 빈 문자열 ''은 기본적으로 이 계산에서 missing이 아닐 수 있으므로 공백 제거와 빈 문자열 규칙은 별도로 정해야 한다.
- project_context: 라벨링 결과에서 label, reason, decision 누락을 찾을 때 쓴다.

## PY42_L08_schema_check_001
- level: 8
- file: python_data_processing_pandas_jsonl_v42.json
- title: schema check 읽기
- question_type: meaning_choice
- concepts: ["if","schema","required_fields","validation"]
- reading_goal: 데이터에 필요한 필드가 모두 있는지 검사하는 schema check를 이해한다.
- code:
```python
required = {'id', 'title', 'answer'}
missing = required - row.keys()
if missing:
    raise ValueError(f"missing fields: {sorted(missing)}")
if not isinstance(row['id'], str):
    raise TypeError("id must be a string")
```
- question: schema check의 목적은?
- answer: 필수 컬럼이나 필드 누락을 빨리 찾는 것
- explanation: 첫 검사는 필수 key 누락을 찾고, 두 번째 검사는 id type을 확인한다. key 존재만 확인하면 null, 빈 문자열, 잘못된 type까지 잡지는 못한다. 실제 schema validation은 각 field의 type, 허용값, 중첩 구조와 추가 field 정책을 함께 정의해야 한다.
- project_context: lesson JSON의 id, choices, answer, concepts 검증과 같은 원리다.

## PY42_L08_streaming_jsonl_001
- level: 8
- file: python_data_processing_pandas_jsonl_v42.json
- title: streaming JSONL 읽기
- question_type: meaning_choice
- concepts: ["for","import","streaming","JSONL","memory_safe"]
- reading_goal: JSONL을 한 줄씩 읽는 memory-safe 패턴을 이해한다.
- code:
```python
import json

with open('output.jsonl', encoding='utf-8') as f:
    for line in f:
        row = json.loads(line)
        process(row)
```
- question: 이 코드가 대용량 JSONL에 적합한 이유는?
- answer: 파일 전체를 한 번에 메모리에 올리지 않기 때문이다
- explanation: 파일 반복은 한 줄씩 읽으므로 전체 JSONL을 메모리에 올리지 않는다. 각 non-empty line이 유효한 JSON인지 줄 번호와 함께 오류를 처리해야 하며, process 결과를 저장한 뒤 checkpoint를 원자적으로 갱신해야 안전하게 resume할 수 있다. 줄 단위라는 사실만으로 중단 재개가 자동 제공되지는 않는다.
- project_context: node_pass shard 결과와 LLM 응답 로그를 검증할 때 매우 중요하다.

## PY29_L08_dict_get_default_001
- level: 8
- file: python_data_structures_json_v29.json
- title: dict.get 기본값 읽기
- question_type: meaning_choice
- concepts: ["print","dict_get","default_value","missing_field"]
- reading_goal: 필드가 없을 때 기본값을 쓰는 get 패턴을 이해한다.
- code:
```python
card = {"id": "c1", "title": "len 읽기"}

level = card.get("level", 1)
summary = card.get("summary", "")

print(level)
```
- question: level 값은?
- answer: 1
- explanation: card에는 level key가 없으므로 get이 default 1을 반환해 print한다. get의 default는 key가 없을 때만 사용되며 key가 존재하고 value가 None이면 None을 그대로 반환한다. 필수 field 누락을 조용히 숨기면 안 되므로 default가 domain상 타당한 optional field에만 사용한다.
- project_context: 카드/사이드카드 필드가 일부 비어 있어도 앱이 깨지지 않게 하는 패턴이다.

## PY29_L08_missing_field_guard_001
- level: 8
- file: python_data_structures_json_v29.json
- title: missing field 방어 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","print","missing_field","guard","fallback"]
- reading_goal: 여러 후보 필드 중 있는 값을 순서대로 사용하는 fallback 구조를 읽는다.
- code:
```python
def get_side_text(sc):
    return (
        sc.get("body") or sc.get("summary")
        or sc.get("description") or sc.get("detail") or ""
    )

text = get_side_text({"summary": "짧은 설명"})
print(text)
```
- question: 출력되는 값은?
- answer: 짧은 설명
- explanation: body가 missing이라 falsy이고 summary는 non-empty string이므로 그 값을 반환한다. or는 key 누락뿐 아니라 empty string, 0, False에서도 fallback하므로 유효한 falsy value를 보존해야 하는 schema에는 주의해야 한다. 여러 field 지원은 migration 호환용일 수 있지만 invalid data를 숨기지 않도록 schema warning도 남긴다.
- project_context: 예전에 side card가 제목만 보였던 문제를 고칠 때 핵심이었던 방식이다.

## PY29_L08_set_dedup_001
- level: 8
- file: python_data_structures_json_v29.json
- title: set으로 중복 제거 읽기
- question_type: meaning_choice
- concepts: ["print","set","dedup","id"]
- reading_goal: 중복 id를 제거하거나 이미 본 값을 확인하는 set 구조를 이해한다.
- code:
```python
ids = ["c1", "c2", "c1", "c3"]
unique_ids = set(ids)

print(len(unique_ids))
```
- question: 출력되는 값은?
- answer: 3
- explanation: set은 중복을 하나로 취급한다. c1이 두 번 있어도 unique id는 c1, c2, c3 세 개다. set으로 중복 제거를 할 때는 순서가 보존되지 않을 수 있다. 중복 없는 값만 필요한지, 원래 순서도 유지해야 하는지 먼저 확인해야 한다.
- project_context: 카드 id 중복 검증, side_card id 검증에서 자주 쓰는 개념이다.

## PY21_L08_insert_commit_001
- level: 8
- file: python_database_sql_repository_v21.json
- title: INSERT와 commit 읽기
- question_type: meaning_choice
- concepts: ["insert","commit","transaction","sqlite"]
- reading_goal: 새 행을 DB에 넣고 commit으로 저장을 확정하는 흐름을 이해한다.
- code:
```python
conn.execute(
    "INSERT INTO items(id, title) VALUES (?, ?)",
    ("item_001", "LiDAR basics")
)
conn.commit()
```
- question: conn.commit()의 역할은?
- answer: 변경사항을 DB에 확정 저장한다
- explanation: INSERT나 UPDATE 같은 변경 작업은 데이터베이스에 쓰기 작업을 만든다. commit을 해야 변경이 확정되어 이후 조회에서도 안정적으로 보인다. commit 전 오류가 나면 rollback할 수 있어 여러 변경을 하나의 트랜잭션처럼 다룰 수 있다. 따라서 정답은 ‘변경사항을 DB에 확정 저장한다’이다.
- project_context: 수집 item, run log, progress 저장 코드를 읽을 때 중요하다.

## PY21_L08_not_null_001
- level: 8
- file: python_database_sql_repository_v21.json
- title: NOT NULL 제약 읽기
- question_type: meaning_choice
- concepts: ["not_null","constraint","schema","sql"]
- reading_goal: DB 컬럼이 비어 있으면 안 되는 제약을 이해한다.
- code:
```python
CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  job_name TEXT NOT NULL,
  status TEXT NOT NULL
);
```
- question: job_name TEXT NOT NULL이 직접 금지하는 것은?
- answer: NULL 값
- explanation: NOT NULL은 해당 column에 SQL NULL이 저장되는 것을 금지한다. 빈 문자열 ""이나 공백 문자열까지 막는 제약은 아니므로 실제 job name이 비어 있지 않아야 한다면 CHECK(length(trim(job_name)) > 0) 같은 규칙이나 application validation이 추가로 필요하다.
- project_context: run 상태 기록에서 필수 필드 누락을 막는 DB 제약이다.

## PY21_L08_rollback_001
- level: 8
- file: python_database_sql_repository_v21.json
- title: rollback 예외 처리 읽기
- question_type: meaning_choice
- concepts: ["rollback","transaction","try_except","database"]
- reading_goal: DB 작업 실패 시 변경을 되돌리는 패턴을 읽는다.
- code:
```python
try:
    conn.execute("INSERT INTO items(id, title) VALUES (?, ?)", (id, title))
    conn.commit()
except Exception:
    conn.rollback()
    raise
```
- question: except에서 rollback을 하는 이유는?
- answer: 실패한 트랜잭션 변경을 되돌리기 위해
- explanation: execute나 commit이 Exception을 내면 rollback이 현재 connection의 아직 commit되지 않은 transaction 변경을 되돌린 뒤 bare raise가 원래 오류를 다시 알린다. 이미 commit된 변경이나 다른 connection의 transaction은 되돌리지 않는다. 실제 코드에서는 예상 DB 예외 범위를 정하고 connection context manager로 commit·rollback 경계를 명확히 할 수 있다.
- project_context: runs, items, curations 같은 테이블에 쓰기 작업을 할 때 필요한 방어 패턴이다.

## PY21_L08_schema_create_table_001
- level: 8
- file: python_database_sql_repository_v21.json
- title: CREATE TABLE schema 읽기
- question_type: meaning_choice
- concepts: ["schema","create_table","primary_key","sql"]
- reading_goal: 테이블 생성 SQL에서 컬럼과 primary key를 읽는다.
- code:
```python
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  source_url TEXT,
  created_at TEXT NOT NULL
);
```
- question: PRIMARY KEY가 붙은 id의 의미에 가장 가까운 것은?
- answer: 각 행을 구분하는 고유 식별자
- explanation: PRIMARY KEY는 row를 고유하게 찾는 key이며 중복을 허용하지 않는다. 이 예시는 id에 NOT NULL도 명시해 SQLite rowid table에서 null identifier가 들어갈 수 있는 예외를 피한다. title과 created_at도 NULL을 금지하지만, empty string이나 올바른 날짜 형식까지 자동 검증하는 것은 아니다.
- project_context: D1/Supabase/SQLite schema.sql을 읽는 기본 훈련이다.

## PY37_L08_crud_001
- level: 8
- file: python_database_storage_crud_v37.json
- title: CRUD 읽기
- question_type: meaning_choice
- concepts: ["CRUD","Create","Read","Update","Delete"]
- reading_goal: 데이터 앱의 기본 조작인 CRUD를 이해한다.
- code:
```python
Create: 새 진행률 기록 추가
Read: 오늘의 학습 기록 조회
Update: 맞힌 횟수 증가
Delete: 오래된 임시 기록 삭제
```
- question: Update에 해당하는 예시는?
- answer: 맞힌 횟수 증가
- explanation: CRUD는 Create, Read, Update, Delete의 줄임말이다. 대부분의 데이터 저장 앱은 이 네 가지 기본 동작을 반복해서 구현한다. 예를 들어 오답 노트를 추가하고, 조회하고, 수정하고, 삭제하는 흐름도 CRUD로 설명할 수 있다. 따라서 정답은 ‘맞힌 횟수 증가’이다.
- project_context: 학습앱이 로컬 상태를 넘어 DB 저장으로 가면 CRUD가 핵심이 된다.
