# V356 semantic review — Level 8 chunk 8

Cards 141-160 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY32_L08_test_path_001
- level: 8
- file: python_files_paths_project_structure_v32.json
- title: 파일 존재 확인 Test-Path
- question_type: meaning_choice
- concepts: ["Test-Path","exists","file_check"]
- reading_goal: 파일이나 폴더가 실제로 있는지 확인하는 명령을 읽는다.
- code:
```python
Test-Path ".\src\pwa\app.js"
Test-Path ".\data\lessons\missing.json"
```
- question: Test-Path가 True를 반환하면?
- answer: 해당 경로가 존재한다
- explanation: Test-Path는 파일이나 폴더가 실제로 존재하는지 확인하는 명령이다. 존재 여부만 알려주므로 JSON 내용 품질 검증은 별도 단계가 필요하다. 파일을 읽기 전에 Test-Path로 guard를 두면 없는 파일 때문에 생기는 오류를 더 친절하게 처리할 수 있다. 따라서 반환/호출 결과는 ‘해당 경로가 존재한다’이다.
- project_context: 패치 전에 대상 파일이 있는지 확인할 때 쓴다.

## PY10_L08_argparse_store_true_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: argparse store_true 읽기
- question_type: meaning_choice
- concepts: ["import","argparse","cli","flag"]
- reading_goal: 플래그가 있으면 True가 되는 CLI 옵션을 읽는다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()
```
- question: --dry-run을 붙이면 args.dry_run은?
- answer: True
- explanation: argparse의 store_true는 옵션이 명령어에 있으면 True로 저장하는 설정이다. 플래그형 옵션을 만들 때 자주 사용한다. 옵션을 붙이지 않으면 기본값은 보통 False가 되므로 실행 명령에 플래그가 있는지 먼저 보면 된다.
- project_context: 실행은 안 하고 계획만 보는 dry-run 옵션에 자주 쓰인다.

## PY10_L08_copy_update_merge_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: copy 후 update 병합 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","dict","copy","update","merge"]
- reading_goal: 원본 dict를 보존하면서 새 메타데이터를 합치는 코드를 읽는다.
- code:
```python
def merge_meta(item, meta):
    merged = dict(item)
    merged.update(meta)
    return merged
```
- question: merged = dict(item)의 목적은?
- answer: item을 복사해 원본 변경을 줄인다
- explanation: dict(item)은 item과 별도의 바깥 dict를 만든다. 이어서 merged.update(meta)가 같은 키의 값을 덮어쓰거나 새 키를 추가해도 원본 item의 바깥 키 구성은 바뀌지 않는다. 다만 이것은 얕은 복사라서 값 안에 list나 dict 같은 중첩 객체가 있으면 그 객체는 공유될 수 있다.
- project_context: 메타데이터 보강, score 병합, 설정 병합에 자주 쓰인다.

## PY10_L08_count_by_key_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: key별 count 집계 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","dict","count","aggregation"]
- reading_goal: dict를 이용해 domain별 개수를 집계하는 코드를 읽는다.
- code:
```python
def count_by_domain(rows):
    counts = {}
    for row in rows:
        domain = row.get("domain", "unknown")
        counts[domain] = counts.get(domain, 0) + 1
    return counts
```
- question: counts[domain] = counts.get(domain, 0) + 1의 의미는?
- answer: domain별 개수를 1 증가시킨다
- explanation: 각 row에서 domain을 읽고, 키가 없으면 문자열 unknown을 사용한다. counts.get(domain, 0)은 해당 domain의 기존 횟수를 가져오되 처음 등장한 값이면 0을 준다. 여기에 1을 더해 다시 같은 키에 저장하므로 domain별 횟수가 한 번씩 증가한다. domain 값이 실제로 0인 경우가 아니라 집계 dict에 키가 아직 없는 경우에만 기본값 0을 쓴다.
- project_context: 도메인/레벨/상태별 집계 코드에 자주 나온다.

## PY10_L08_dataclass_basic_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: dataclass 기본 읽기
- question_type: output_prediction
- concepts: ["import","print","dataclass","class","schema"]
- reading_goal: 작은 데이터 구조를 class처럼 정의하는 코드를 읽는다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Item:
    id: str
    score: float

item = Item(id="a", score=0.7)
print(item.id)
```
- question: 출력은?
- answer: a
- explanation: dataclass는 데이터를 담는 클래스를 간단히 만들게 해 준다. 생성할 때 id에 a를 넣었으므로 item.id를 읽으면 a가 나온다. dataclass는 __init__ 같은 기본 메서드를 자동으로 만들어 주어 데이터 객체를 짧게 정의하게 해 준다.
- project_context: 노드/엣지/카드 row 같은 구조를 명확히 표현할 때 유용하다.

## PY10_L08_filter_rows_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: row 필터링 읽기
- question_type: output_prediction
- concepts: ["print","filter","list_comprehension","dict"]
- reading_goal: 조건을 만족하는 row만 남기는 코드를 읽는다.
- code:
```python
rows = [{"id": "1", "ok": True}, {"id": "2", "ok": False}]
valid = [row for row in rows if row["ok"]]
print(len(valid))
```
- question: 출력은?
- answer: 1
- explanation: filter rows는 조건을 만족하는 행만 남기는 과정이다. ok 값이 True인 row만 통과시키면 결과에는 해당 row 하나만 남는다. 조건식이 True인 항목만 남는다고 보면 필터링 뒤 결과 개수와 내용을 쉽게 예측할 수 있다.
- project_context: 검증 통과 항목, 후보 항목, 실패 항목 분리에 자주 쓰인다.

## PY10_L08_fstring_status_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: f-string 상태문 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","f_string","format","status"]
- reading_goal: 변수 값을 문자열에 넣어 상태 메시지를 만드는 코드를 읽는다.
- code:
```python
def format_status(done, total):
    return f"{done}/{total} done"

print(format_status(3, 10))
```
- question: 출력은?
- answer: 3/10 done
- explanation: f-string은 문자열 안에 변수 값을 바로 넣을 수 있는 문법이다. done과 total 값이 중괄호 위치에 들어가 상태 문장이 만들어진다. 반복 작업의 진행률이나 상태 로그를 만들 때 f-string을 쓰면 변수 값을 읽기 좋게 섞을 수 있다. 따라서 출력은 ‘3/10 done’이다.
- project_context: 진행률 로그, 큐 상태, shard 상태 메시지에 자주 보인다.

## PY10_L08_function_loop_result_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: 함수 안 loop와 result 읽기
- question_type: output_prediction
- concepts: ["def","return","print","function","for","list","normalization"]
- reading_goal: 함수 내부에서 결과 리스트를 쌓아 반환하는 구조를 읽는다.
- code:
```python
def normalize_many(labels):
    result = []
    for label in labels:
        result.append(label.strip().lower())
    return result

print(normalize_many([" LiDAR ", "RADAR"]))
```
- question: 출력은?
- answer: ["lidar", "radar"]
- explanation: 반복문 안에서 각 label을 strip과 lower로 정리한 뒤 result에 추가한다. 여러 입력을 같은 규칙으로 정규화할 때 쓰는 흐름이다. 함수 안에서 결과 리스트를 만들면 입력 처리 규칙을 재사용 가능한 작은 단위로 묶을 수 있다. 따라서 출력은 ‘["lidar", "radar"]’이다.
- project_context: 데이터 전처리 함수의 기본 패턴이다.

## PY10_L08_guard_clause_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: guard clause 읽기
- question_type: output_prediction
- concepts: ["def","function","print","guard_clause","if","return"]
- reading_goal: 빈 입력이면 일찍 반환하는 방어 코드를 읽는다.
- code:
```python
def summarize(items):
    if not items:
        return "empty"
    return f"count={len(items)}"

print(summarize([]))
```
- question: 출력은?
- answer: empty
- explanation: guard clause는 처리할 수 없는 경우를 함수 앞부분에서 먼저 반환하는 방식이다. items가 빈 리스트라 not items가 참이고 empty를 반환한다.
- project_context: 근거 없음, 검색결과 없음, 입력 없음 처리에 자주 쓰인다.

## PY10_L08_id_index_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: id index 만들기
- question_type: output_prediction
- concepts: ["def","function","return","print","dict","index","id"]
- reading_goal: row 리스트를 id로 바로 찾을 수 있는 dict로 바꾸는 코드를 읽는다.
- code:
```python
def build_index(rows):
    return {row["id"]: row for row in rows}

index = build_index([{"id": "n1", "label": "LiDAR"}])
print(index["n1"]["label"])
```
- question: 출력은?
- answer: LiDAR
- explanation: id index는 id를 key로 삼아 row를 빠르게 찾기 위한 dict다. index['n1']은 해당 row를 반환하고 그 안의 label은 LiDAR다. 목록을 매번 반복 검색하지 않아도 되므로 카드나 노드가 많을 때 조회 속도를 높일 수 있다.
- project_context: 대량 데이터에서 특정 id를 빠르게 찾는 기본 패턴이다.

## PY10_L08_if_elif_mode_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: mode 조건 분기 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","if","mode","branch"]
- reading_goal: mode 값에 따라 다른 문자열을 반환하는 분기 코드를 읽는다.
- code:
```python
def select_mode(mode):
    if mode == "review":
        return "daily_review"
    if mode == "all":
        return "normal+review"
    return "normal"
```
- question: mode가 review이면 반환값은?
- answer: daily_review
- explanation: 첫 번째 if에서 mode == "review"가 참이므로 즉시 daily_review를 반환하고 함수가 끝난다. 따라서 아래의 두 번째 if와 마지막 return은 실행되지 않는다. 이 예제는 if/elif가 아니라 return으로 흐름을 끝내는 두 개의 독립된 if 문이지만, 위에서부터 조건을 확인한다는 점은 같다.
- project_context: 앱 필터, 실행 모드, 큐 모드 코드를 읽는 기초다.

## PY10_L08_keyword_args_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: keyword argument 읽기
- question_type: output_prediction
- concepts: ["def","return","print","function","keyword_argument","config"]
- reading_goal: 함수 호출에서 이름으로 인자를 넘기는 구조를 읽는다.
- code:
```python
def make_config(debug=False, limit=100):
    return {
        "debug": debug,
        "limit": limit,
    }

print(make_config(limit=10)["limit"])
```
- question: 출력은?
- answer: 10
- explanation: 키워드 인자는 함수 호출에서 이름을 붙여 값을 전달하는 방식이다. limit=10은 기본값 100을 덮어써서 최대 개수를 10으로 바꾼다. 위치가 아니라 이름으로 값을 전달하므로 인자가 많아져도 어떤 설정을 바꾸는지 비교적 명확하게 보인다.
- project_context: 설정 객체와 실행 옵션 코드를 읽는 데 필요하다.

## PY10_L08_non_empty_validation_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: 빈 문자열 검증 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","validation","strip","raise"]
- reading_goal: 공백만 있는 입력을 막는 검증 코드를 읽는다.
- code:
```python
def require_non_empty(text):
    text = text.strip()
    if not text:
        raise ValueError("empty text")
    return text
```
- question: text가 공백뿐이면?
- answer: ValueError를 발생시킨다
- explanation: 먼저 strip()이 문자열 양끝의 공백을 제거한다. 공백뿐인 입력은 빈 문자열 ""이 되고 not text가 True이므로 ValueError("empty text")가 발생한다. 공백이 아닌 문자가 하나라도 있으면 예외 없이, 양끝 공백이 제거된 문자열을 반환한다.
- project_context: 질문 입력, 제목, 카드 필수 필드 검증에 중요하다.

## PY10_L08_pipeline_steps_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: pipeline steps 읽기
- question_type: meaning_choice
- concepts: ["def","return","pipeline","function","for"]
- reading_goal: 여러 함수를 순서대로 적용하는 파이프라인 구조를 읽는다.
- code:
```python
def apply_pipeline(text, steps):
    value = text
    for step in steps:
        value = step(value)
    return value
```
- question: 이 함수의 핵심 흐름은?
- answer: text에 steps를 순서대로 적용한다
- explanation: pipeline은 여러 처리 단계를 순서대로 연결한 구조다. value가 각 step을 거치며 계속 갱신되어 최종 결과로 이어진다. 각 단계가 입력을 받아 출력으로 넘기는 구조인지 보면 긴 처리 흐름도 작은 조각으로 나누어 읽을 수 있다. 따라서 반환/호출 결과는 ‘text에 steps를 순서대로 적용한다’이다.
- project_context: 수집→정제→청킹→검색 같은 파이프라인을 읽는 기초다.

## PY10_L08_raise_required_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: 필수 key 없으면 raise
- question_type: meaning_choice
- concepts: ["if","def","function","return","raise","KeyError","validation"]
- reading_goal: 필수 필드 누락을 조용히 넘기지 않고 에러로 드러내는 코드를 읽는다.
- code:
```python
def read_required(row, key):
    if key not in row:
        raise KeyError(key)
    return row[key]
```
- question: key가 row에 없으면?
- answer: KeyError를 발생시킨다
- explanation: 필수 필드가 없을 때 조용히 기본값을 쓰면 데이터 오류를 놓칠 수 있다. 그래서 raise로 명확한 예외를 내는 편이 더 안전한 경우가 있다. 필수 key 검증은 데이터가 다음 단계로 넘어가기 전에 형식 오류를 명확히 드러내는 역할을 한다. 따라서 반환/호출 결과는 ‘KeyError를 발생시킨다’이다.
- project_context: 데이터 품질 검증과 파이프라인 실패 원인 추적에 중요하다.

## PY10_L08_retry_once_001
- level: 8
- file: python_foundation_expansion_v10.json
- title: 간단 retry 함수 읽기
- question_type: meaning_choice
- concepts: ["def","return","retry","try_except","function"]
- reading_goal: 실패하면 한 번 더 실행하는 단순 재시도 코드를 읽는다.
- code:
```python
def retry_once(fn):
    try:
        return fn()
    except Exception:
        return fn()
```
- question: 첫 번째 fn()이 실패하면?
- answer: except에서 fn()을 한 번 더 호출한다
- explanation: 첫 fn()이 정상 반환하면 그 값을 바로 돌려주고 재시도하지 않는다. 첫 호출이 Exception 계열 예외를 내면 except에서 fn()을 딱 한 번 더 호출한다. 두 번째 호출은 try 블록 밖이므로 다시 실패하면 그 예외가 호출자에게 전파된다. 모든 Exception을 재시도하면 코드 오류까지 반복할 수 있어 실제 코드에서는 재시도할 예외, 대기 시간, 로그를 좁혀 정한다.
- project_context: API 호출/다운로드/배치 실행 안정화의 기초다.

## PY39_L08_cache_001
- level: 8
- file: python_frontend_state_storage_cache_v39.json
- title: cache 읽기
- question_type: meaning_choice
- concepts: ["cache","browser","performance"]
- reading_goal: 이미 받은 파일을 다시 쓰는 cache 개념을 이해한다.
- code:
```python
first visit:
  GET app.js 200

second visit:
  use cached app.js
```
- question: cache의 장점은?
- answer: 같은 파일을 더 빠르게 다시 사용할 수 있다
- explanation: cache는 이전 응답을 재사용해 전송 시간과 네트워크 사용을 줄일 수 있다. 두 번째 방문에 실제로 cache를 그대로 쓰는지, 서버에 재검증하는지, 다시 다운로드하는지는 Cache-Control, validator, service worker 전략에 따라 달라진다. 속도와 최신성의 기준을 함께 설계해야 한다.
- project_context: PWA에서 app.js나 lesson JSON이 캐시에 남아 업데이트가 안 보일 수 있다.

## PY39_L08_cache_busting_001
- level: 8
- file: python_frontend_state_storage_cache_v39.json
- title: cache busting 읽기
- question_type: meaning_choice
- concepts: ["return","cache_busting","version_query","APP_DATA_VERSION"]
- reading_goal: URL에 버전값을 붙여 새 파일 요청을 유도하는 cache busting을 이해한다.
- code:
```python
const APP_DATA_VERSION = "20260529_v39"

function withDataVersion(path) {
  return path + "?v=" + APP_DATA_VERSION
}
```
- question: APP_DATA_VERSION을 바꾸는 이유는?
- answer: 브라우저가 새 URL로 인식해 최신 데이터를 받게 하려고
- explanation: 버전 query가 달라지면 일반 HTTP cache는 보통 다른 URL로 취급해 이전 응답과 분리한다. 하지만 service worker가 query를 무시하는 custom cache key를 쓰거나 중간 cache가 잘못 설정되면 최신 본문이 보장되지 않는다. 내용 기반 파일명이나 명확한 cache 정책과 함께 사용하고 실제 응답 버전을 확인한다.
- project_context: 지금 app.js에서 v38, v39처럼 버전을 올리는 이유다.

## PY39_L08_stale_data_001
- level: 8
- file: python_frontend_state_storage_cache_v39.json
- title: stale data 읽기
- question_type: meaning_choice
- concepts: ["stale_data","cache","freshness"]
- reading_goal: 캐시 때문에 오래된 데이터가 보이는 stale data 문제를 이해한다.
- code:
```python
server has:
  APP_DATA_VERSION = v39

browser still shows:
  APP_DATA_VERSION = v38
```
- question: 이 상황은 무엇에 가까운가?
- answer: 브라우저가 오래된 캐시를 보고 있다
- explanation: 서버 파일은 새 버전인데 브라우저가 이전 파일을 들고 있으면 stale data가 된다. stale data는 화면이나 캐시에 남은 데이터가 최신 상태와 달라진 경우다. 새로고침, 재요청, 버전 키 변경이 필요한지 확인해야 한다. 따라서 정답은 ‘브라우저가 오래된 캐시를 보고 있다’이다.
- project_context: 새 v39가 반영되지 않을 때 강력 새로고침이나 버전 쿼리를 확인해야 한다.

## PY30_L08_early_return_001
- level: 8
- file: python_function_design_io_v30.json
- title: early return 흐름 읽기
- question_type: meaning_choice
- concepts: ["if","def","return","early_return","control_flow","function"]
- reading_goal: 조건별로 빨리 반환해서 복잡한 if 중첩을 줄이는 방식을 읽는다.
- code:
```python
def label_score(score):
    if score >= 80:
        return "good"
    if score >= 50:
        return "review"
    return "retry"
```
- question: label_score(65)의 반환값은?
- answer: review
- explanation: 65는 80 이상은 아니지만 50 이상이므로 두 번째 조건에서 review를 반환한다. early return은 더 진행할 필요가 없을 때 함수에서 일찍 빠져나오는 방식이다. 조건이 참일 때 바로 끝나는지, 이후 코드가 실행되지 않는지 확인해야 한다.
- project_context: 리스크 레벨, 카드 추천 레벨, 검증 결과 라벨링 함수에서 자주 쓰인다.
