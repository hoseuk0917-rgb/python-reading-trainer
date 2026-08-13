# V356 semantic review — Level 8 chunk 12

Cards 221-240 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY54_L08_touch_feedback_001
- level: 8
- file: python_mobile_touch_responsive_ux_v54.json
- title: touch feedback 읽기
- question_type: meaning_choice
- concepts: ["touch_feedback","active_state","mobile_touch"]
- reading_goal: 터치했을 때 눌렸다는 피드백을 주는 UI를 이해한다.
- code:
```python
.choice-button:active {
  transform: scale(0.98);
}
```
- question: touch feedback의 역할은?
- answer: 사용자가 버튼을 눌렀다는 느낌을 받을 수 있게 한다
- explanation: :active scale은 press 중 짧은 시각 feedback을 주지만 reduced-motion 설정을 존중하고 layout을 흔들지 않아야 한다. keyboard에는 :focus-visible, 처리 중에는 disabled·busy 상태와 text feedback이 필요하다. 시각 변화만으로 action 성공을 단정하게 하지 않는다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY61_L08_cloud_sync_001
- level: 8
- file: python_offline_first_sync_conflict_v61.json
- title: cloud sync 읽기
- question_type: meaning_choice
- concepts: ["cloud_sync","account","multi_device"]
- reading_goal: 여러 기기에서 같은 학습 기록을 이어가기 위한 cloud sync를 이해한다.
- code:
```python
await uploadProgress(localProgress)
```
- question: cloud sync의 목적은?
- answer: 여러 기기에서 학습 기록을 이어서 쓰기 위해
- explanation: cloud sync는 여러 기기의 로컬 기록을 같은 서버 계정과 맞춰 이어서 쓰게 한다. upload 한 번만으로 동기화가 끝나는 것은 아니다. 인증, 다운로드, 서버 승인 확인, 중복 방지, 삭제 전파와 충돌 해결 규칙을 함께 설계해야 한 기기의 변경이 다른 기기 자료를 조용히 덮어쓰지 않는다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L08_dirty_record_001
- level: 8
- file: python_offline_first_sync_conflict_v61.json
- title: dirty record 읽기
- question_type: meaning_choice
- concepts: ["dirty_record","sync","state"]
- reading_goal: 로컬에서 바뀌었지만 아직 서버에 반영되지 않은 dirty record를 이해한다.
- code:
```python
record.dirty = true
```
- question: dirty record의 의미는?
- answer: 로컬 변경은 있지만 아직 동기화되지 않은 데이터
- explanation: dirty record는 로컬에서 수정됐지만 서버가 아직 확인하지 않은 기록이다. dirty 플래그도 변경 내용과 함께 영속적으로 저장해야 재실행 뒤 전송 대상을 잃지 않는다. 서버 성공 응답을 받은 뒤에만 플래그를 지우고, 전송 도중 다시 수정된 기록까지 잘못 깨끗한 상태로 만들지 않도록 버전도 비교한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L08_sync_status_badge_001
- level: 8
- file: python_offline_first_sync_conflict_v61.json
- title: sync status badge 읽기
- question_type: meaning_choice
- concepts: ["sync_status","UI","offline"]
- reading_goal: 현재 저장/동기화 상태를 사용자에게 보여주는 sync status badge를 이해한다.
- code:
```python
status = '저장됨 / 동기화 대기 / 동기화 완료'
```
- question: sync status badge의 역할은?
- answer: 사용자에게 현재 기록 저장 상태를 알려준다
- explanation: 사용자는 자신의 메모나 진도가 저장됐는지 불안해할 수 있으므로 상태 표시가 중요하다. sync status badge는 현재 데이터가 저장됨, 동기화 중, 실패 상태인지 보여 주는 작은 표시다. 사용자가 안심하고 상태를 알 수 있게 만드는 UX 장치다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L08_updated_at_001
- level: 8
- file: python_offline_first_sync_conflict_v61.json
- title: updated_at 읽기
- question_type: meaning_choice
- concepts: ["updated_at","timestamp","sync"]
- reading_goal: 동기화 충돌 판단에 필요한 updatedAt 시각을 이해한다.
- code:
```python
note.updatedAt = new Date().toISOString()
```
- question: updatedAt이 중요한 이유는?
- answer: 어느 쪽 데이터가 더 최근에 수정됐는지 판단하기 위해
- explanation: updatedAt은 마지막 수정 시각을 보여 주는 유용한 메타데이터지만 이것만으로 어느 변경이 옳거나 더 최신인지 확정할 수는 없다. 기기 시계가 어긋나거나 같은 시각에 수정될 수 있기 때문이다. 충돌 판정에는 서버가 관리하는 revision이나 ETag 같은 버전을 함께 쓰고, 시각은 사용자에게 비교 정보를 보여 주는 보조 기준으로 사용한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY27_L08_pip_freeze_001
- level: 8
- file: python_packaging_env_dependencies_v27.json
- title: pip freeze 읽기
- question_type: meaning_choice
- concepts: ["pip_freeze","requirements","dependency_snapshot"]
- reading_goal: 현재 환경에 설치된 패키지 목록을 파일로 저장하는 명령을 이해한다.
- code:
```python
python -m pip freeze > requirements.txt
```
- question: 이 명령의 결과는?
- answer: 현재 설치된 패키지 목록이 requirements.txt에 저장된다
- explanation: 현재 environment에서 pip가 인식한 설치 distribution과 version 목록을 stdout으로 내고 >가 requirements.txt를 덮어쓴다. direct와 transitive, 실험용 package와 platform-specific entry가 모두 섞일 수 있어 project dependency intent나 cross-platform lock과 같지 않다. 생성 diff를 review하고 목적에 맞는 lock tool을 선택한다.
- project_context: 작업이 잘 되는 환경을 나중에 재현하려면 의존성 스냅샷이 필요하다.

## PY27_L08_pip_install_requirements_001
- level: 8
- file: python_packaging_env_dependencies_v27.json
- title: requirements.txt 설치 읽기
- question_type: meaning_choice
- concepts: ["pip","requirements","dependency"]
- reading_goal: requirements.txt에 적힌 패키지를 한 번에 설치하는 명령을 이해한다.
- code:
```python
python -m pip install -r requirements.txt
```
- question: -r requirements.txt의 의미는?
- answer: requirements.txt 파일을 읽어 패키지를 설치한다
- explanation: -r은 requirements file의 각 requirement를 읽어 resolver가 package와 dependencies를 설치하게 한다. python -m pip 형태는 현재 선택한 Python environment의 pip를 사용한다는 점을 명확히 한다. file이 exact lock이 아니면 platform과 index 시점에 따라 다른 transitive version이 설치될 수 있다.
- project_context: 새 PC나 GPU 서버에서 같은 실행환경을 재현할 때 필요하다.

## PY27_L08_version_pin_001
- level: 8
- file: python_packaging_env_dependencies_v27.json
- title: 패키지 버전 고정 읽기
- question_type: meaning_choice
- concepts: ["version_pin","dependency","requirements"]
- reading_goal: requirements.txt에서 패키지 버전을 고정하는 표기를 읽는다.
- code:
```python
fastapi==0.115.0
uvicorn>=0.30.0
requests
```
- question: fastapi==0.115.0의 의미는?
- answer: FastAPI를 정확히 0.115.0 버전으로 설치한다
- explanation: ==0.115.0은 해당 FastAPI release만 허용한다. 반면 uvicorn>=0.30.0은 상한이 없고 requests는 version 제약이 없어 미래 incompatible release가 선택될 수 있다. direct pin만으로 transitive dependency와 artifact hash가 고정되는 것은 아니므로 tested lock과 update process를 함께 둔다.
- project_context: 모델/라이브러리 조합이 민감할 때 버전 고정이 중요하다.

## PY53_L08_filtering_performance_001
- level: 8
- file: python_performance_large_card_ux_v53.json
- title: filtering performance 읽기
- question_type: meaning_choice
- concepts: ["filtering","performance","search_index"]
- reading_goal: 필터링 성능을 위해 검색용 텍스트를 미리 만들어두는 방식을 이해한다.
- code:
```python
card.searchText = (card.title + ' ' + card.concepts.join(' ')).toLowerCase()
```
- question: 검색용 searchText를 미리 만드는 이유는?
- answer: 매번 검색할 때 문자열 조합을 반복하지 않기 위해
- explanation: title과 concepts를 lower-case searchText로 미리 만들어 query마다 join·lowercase를 반복하지 않는다. title이나 concepts가 바뀌면 index도 갱신해야 하고 locale·Unicode normalization 정책을 정해야 한다. memory 증가와 실제 profiling 결과를 보고 적용한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L08_render_cost_001
- level: 8
- file: python_performance_large_card_ux_v53.json
- title: render cost 읽기
- question_type: meaning_choice
- concepts: ["render_cost","DOM","performance"]
- reading_goal: 화면에 요소를 많이 만들수록 렌더링 비용이 커진다는 점을 이해한다.
- code:
```python
for (const card of visibleCards) {
  renderCard(card)
}
```
- question: render cost가 커지는 대표 상황은?
- answer: 많은 카드 DOM을 한 번에 만드는 상황
- explanation: render cost는 화면에 요소를 그리는 데 드는 브라우저 처리 비용이다. 보이지 않는 카드까지 모두 DOM에 넣으면 렌더링 부담이 커진다. 카드가 많을 때는 페이지네이션이나 가상 목록으로 실제 그리는 요소 수를 줄이는 방식이 필요하다. 따라서 정답은 ‘많은 카드 DOM을 한 번에 만드는 상황’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L08_search_debounce_001
- level: 8
- file: python_performance_large_card_ux_v53.json
- title: search debounce 읽기
- question_type: meaning_choice
- concepts: ["debounce","search","performance"]
- reading_goal: 검색 입력마다 바로 실행하지 않고 잠시 기다렸다 실행하는 debounce를 이해한다.
- code:
```python
clearTimeout(timer)
timer = setTimeout(() => runSearch(query), 250)
```
- question: debounce를 쓰는 이유는?
- answer: 사용자가 입력을 멈춘 뒤 검색을 실행해 불필요한 반복 처리를 줄이기 위해
- explanation: timer를 취소하고 마지막 입력 250ms 뒤 search를 시작해 CPU filter와 요청 수를 줄인다. 이미 시작된 비동기 search는 clearTimeout으로 취소되지 않으므로 AbortController나 request sequence를 사용해 오래된 결과가 최신 query를 덮지 않게 한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L08_virtual_list_001
- level: 8
- file: python_performance_large_card_ux_v53.json
- title: virtual list 읽기
- question_type: meaning_choice
- concepts: ["virtual_list","large_list","rendering"]
- reading_goal: 보이는 항목만 렌더링하는 virtual list 개념을 이해한다.
- code:
```python
visibleRows = getRowsInViewport(scrollTop)
render(visibleRows)
```
- question: virtual list의 핵심은?
- answer: 화면에 보이는 항목만 렌더링하는 것
- explanation: virtual list는 viewport 주변 row만 DOM에 두어 긴 목록 rendering과 memory를 줄인다. dynamic height, scroll 위치, keyboard focus, screen-reader가 전체 목록 위치를 이해하는 방법을 함께 구현해야 한다. 단순히 offscreen node를 제거하면 focus가 사라질 수 있다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY45_L08_expected_version_guard_001
- level: 8
- file: python_powershell_automation_reliable_scripts_v45.json
- title: expected version guard 읽기
- question_type: meaning_choice
- concepts: ["if","version_guard","APP_DATA_VERSION","precondition"]
- reading_goal: 수정 전 app.js가 예상 버전인지 확인하는 이유를 이해한다.
- code:
```python
if 'const APP_DATA_VERSION = "20260531_v44";' not in app:
    raise SystemExit('unexpected version')
```
- question: expected version guard가 필요한 이유는?
- answer: 다른 사람이 이미 수정했거나 현재 기준이 다를 때 중단하기 위해
- explanation: exact baseline string을 확인하면 예상하지 않은 version에서 단순 replace하는 일을 막을 수 있다. 하지만 formatting 차이에도 실패하고 version만 같아도 주변 구조가 같다는 보장은 없다. patch 전 target anchor가 정확히 한 번 있는지와 diff를 함께 확인하고, 실패를 cache 문제로 해석하지 않는다.
- project_context: v45는 v44 상태에서만 적용되어야 하므로 APP_DATA_VERSION guard가 필요하다.

## PY45_L08_prevent_overwrite_001
- level: 8
- file: python_powershell_automation_reliable_scripts_v45.json
- title: overwrite 방지 읽기
- question_type: meaning_choice
- concepts: ["if","overwrite_guard","idempotent_script","safety_check"]
- reading_goal: 이미 생성된 파일이나 app.js 링크가 있으면 중단하는 안전장치를 이해한다.
- code:
```python
if lesson_path.exists():
    raise SystemExit('already exists')

if 'v45.json' in app:
    raise SystemExit('already linked')
```
- question: overwrite guard의 목적은?
- answer: 이미 적용된 작업을 중복 적용하거나 덮어쓰는 사고를 막기 위해
- explanation: 첫 guard는 target file이 이미 있으면 덮어쓰지 않고, 둘째는 app text에 v45.json 문자열이 있으면 중복 link를 피한다. 문자열 포함 검사는 comment나 다른 경로도 match할 수 있으므로 구조를 parse하거나 정확한 anchor와 match count를 검증해야 한다. 재실행 시 기존 결과가 원하는 내용인지도 확인해야 진정한 idempotency가 된다.
- project_context: v42~v44 스크립트는 lesson file exists, app already contains 같은 guard를 넣었다.

## PY45_L08_temp_python_script_001
- level: 8
- file: python_powershell_automation_reliable_scripts_v45.json
- title: 임시 Python 스크립트 방식 읽기
- question_type: meaning_choice
- concepts: ["print","temp_script","Python","automation"]
- reading_goal: 긴 Python 코드를 PowerShell 변수 대신 임시 파일로 저장해 실행하는 방식을 이해한다.
- code:
```python
$script = Join-Path ([IO.Path]::GetTempPath()) ([IO.Path]::GetRandomFileName() + '.py')
try {
  @'
print('hello')
'@ | Set-Content -Path $script -Encoding UTF8
  python $script
  if ($LASTEXITCODE -ne 0) { throw "Python failed" }
} finally {
  Remove-Item -LiteralPath $script -ErrorAction SilentlyContinue
}
```
- question: 임시 Python 파일 방식의 장점은?
- answer: 긴 코드가 PowerShell 변수 상태에 덜 휘둘린다
- explanation: 고유한 임시 Python file은 긴 code의 quoting·indentation을 눈에 보이는 script로 분리한다. try/finally로 성공과 실패 모두에서 정확한 literal path를 정리하고 Python exit code를 검사한다. 임시 code도 실행 전 검토하며 장기 유지할 automation이면 repository의 정식 script로 두는 편이 낫다.
- project_context: v42~v44 확장에서 사용한 안정 패턴이다.

## PY45_L08_utf8_set_content_001
- level: 8
- file: python_powershell_automation_reliable_scripts_v45.json
- title: Set-Content -Encoding UTF8 읽기
- question_type: meaning_choice
- concepts: ["UTF8","Set-Content","encoding"]
- reading_goal: 한글과 JSON을 안전하게 저장하기 위해 UTF-8 인코딩을 지정하는 이유를 이해한다.
- code:
```python
Set-Content -Path $script -Value $text -Encoding UTF8
```
- question: UTF-8 인코딩을 지정하는 이유는?
- answer: 한글과 특수문자가 깨질 위험을 줄이기 위해
- explanation: -Encoding UTF8은 기본 encoding 차이로 생기는 한글·특수문자 손상을 줄인다. 다만 Windows PowerShell 5.1은 UTF8에 BOM을 쓰고 PowerShell 7의 utf8은 기본적으로 BOM이 없으므로 consumer 요구와 실행 version을 확인해야 한다. JSON text 자체가 유효한지는 encoding과 별도다.
- project_context: lesson JSON에는 한글 설명이 많기 때문에 UTF-8 저장이 필수다.

## PY2_L08_numpy_shape_001
- level: 8
- file: python_practical_expansion_v2.json
- title: numpy shape 읽기
- question_type: output_prediction
- concepts: ["import","print","numpy","array","shape"]
- reading_goal: numpy 배열의 행과 열 구조를 확인하는 코드를 읽는다.
- code:
```python
import numpy as np

x = np.array([[1, 2, 3], [4, 5, 6]])
print(x.shape)
```
- question: 출력은?
- answer: (2, 3)
- explanation: numpy 배열의 shape은 배열의 구조를 튜플로 보여 준다. 2행 3열 배열이라면 shape은 (2, 3)이 된다. numpy shape은 배열의 차원과 각 차원의 길이를 나타낸다. 이미지, 표, 벡터 데이터를 다룰 때 shape를 확인하면 입력 구조를 빠르게 이해할 수 있다.
- project_context: 임베딩, 텐서, 모델 입력 형태를 볼 때 shape 확인이 중요하다.

## PY2_L08_pandas_groupby_001
- level: 8
- file: python_practical_expansion_v2.json
- title: pandas groupby 읽기
- question_type: meaning_choice
- concepts: ["import","pandas","groupby","count"]
- reading_goal: 특정 컬럼 기준으로 묶어 개수를 세는 코드를 읽는다.
- code:
```python
import pandas as pd

df = pd.read_csv("nodes.csv")
summary = df.groupby("kind").size()
```
- question: summary는 무엇에 가까운가?
- answer: kind별 행 개수
- explanation: groupby('kind').size()는 kind 값이 같은 행끼리 묶은 뒤 각 묶음의 개수를 센다. 분류별 개수를 빠르게 확인할 때 쓴다. groupby 결과는 데이터 분포를 요약하므로 이상하게 적거나 많은 분류가 있는지도 함께 볼 수 있다. 따라서 정답은 ‘kind별 행 개수’이다.
- project_context: 노드 종류별 개수, 라벨 분포, 실패 유형 집계에 자주 쓴다.

## PY2_L08_pytest_001
- level: 8
- file: python_practical_expansion_v2.json
- title: pytest 테스트 코드 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","assert","test"]
- reading_goal: assert로 기대 결과를 검증하는 테스트 코드를 읽는다.
- code:
```python
def normalize(label):
    return label.strip().lower()

def test_normalize():
    assert normalize(" LiDAR ") == "lidar"
```
- question: assert는 무엇을 확인하는가?
- answer: 기대 결과가 맞는지
- explanation: pytest에서 assert는 결과가 기대와 같은지 확인한다. assert 조건이 False가 되면 테스트가 실패해 코드 문제를 빨리 발견할 수 있다. 작은 assert를 많이 두면 수정 후 핵심 동작이 그대로 유지되는지 자동으로 확인할 수 있다.
- project_context: 코드 수정 후 기존 기능이 깨지지 않았는지 확인하는 데 중요하다.

## PY2_L08_regex_search_001
- level: 8
- file: python_practical_expansion_v2.json
- title: re.search() 정규식 읽기
- question_type: output_prediction
- concepts: ["import","print","regex","re.search","text"]
- reading_goal: 텍스트에서 특정 패턴을 찾는 코드임을 읽는다.
- code:
```python
import re

text = "node_id=n001"
match = re.search(r"node_id=(\w+)", text)
print(match.group(1))
```
- question: 출력은?
- answer: n001
- explanation: re.search는 문자열 전체에서 첫 번째로 맞는 구간을 찾는다. (\w+)의 괄호는 캡처 그룹을 만들고, \w+는 문자·숫자·밑줄이 한 개 이상 이어진 n001을 잡는다. match.group(1)은 첫 번째 괄호 그룹인 n001을 반환한다. 다른 입력에서 패턴을 못 찾으면 match는 None이므로 group을 호출하기 전에 일치 여부를 확인해야 한다.
- project_context: 파일명, 로그, 텍스트에서 ID나 패턴을 추출할 때 쓰인다.
