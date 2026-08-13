# V356 semantic review — Level 6 chunk 2

Cards 21-40 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY58_L06_authoring_001
- level: 6
- file: python_card_authoring_pipeline_v58.json
- title: authoring 읽기
- question_type: meaning_choice
- concepts: ["authoring","content_pipeline","card_creation"]
- reading_goal: 학습 카드를 직접 작성하거나 생성하는 authoring 개념을 이해한다.
- code:
```python
card = makeCard(title, question, answer)
```
- question: authoring의 목적은?
- answer: 학습 카드를 만들고 관리하기 위해
- explanation: authoring은 학습카드를 기획, 작성, 검토, 배포하는 제작 과정이다. 카드가 많아질수록 즉흥 작성이 아니라 정해진 제작 흐름이 필요하다. 제작 흐름을 정해 두면 질문, 선택지, 해설, 검증 기준을 일관된 품질로 유지할 수 있다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L06_card_template_001
- level: 6
- file: python_card_authoring_pipeline_v58.json
- title: card template 읽기
- question_type: meaning_choice
- concepts: ["card_template","schema","authoring"]
- reading_goal: 새 카드를 만들 때 반복되는 필드를 template으로 잡는 방식을 이해한다.
- code:
```python
template = {
  id: '',
  level: null,
  title: '',
  question: '',
  choices: [],
  answer: '',
  explanation: '',
  concepts: []
}
```
- question: card template의 역할은?
- answer: 카드 작성에 필요한 기본 필드를 빠뜨리지 않게 한다
- explanation: template에 실제 설명이 언급한 choices, explanation, concepts와 level까지 넣어 author가 필요한 field를 보게 한다. 빈 기본값은 완성된 card가 아니므로 schema validation으로 non-empty text, choice 수, answer membership, 허용 level과 concept ID를 검사해야 한다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY13_L06_compute_compare_001
- level: 6
- file: python_compute_concepts_v13.json
- title: CPU/GPU/TPU/NPU 한 번에 비교
- question_type: meaning_choice
- concepts: ["cpu","gpu","tpu","npu","accelerator"]
- reading_goal: 서로 따로 외우지 않고 계산 장치의 역할 차이를 한 묶음으로 이해한다.
- code:
```python
CPU: 범용 계산, 복잡한 분기, 운영체제/일반 프로그램 실행에 강함
GPU: 많은 코어로 같은 연산을 대량 병렬 처리, 행렬/벡터 연산에 강함
TPU: 구글이 만든 딥러닝 행렬 연산 특화 가속기
NPU: 기기나 SoC 안에서 AI 추론을 빠르고 저전력으로 처리하는 가속기
```
- question: GPU의 설명으로 가장 가까운 것은?
- answer: 같은 종류의 연산을 대량 병렬 처리하는 데 강하다
- explanation: GPU는 많은 데이터에 비슷한 산술 연산을 적용하는 행렬·벡터 작업을 높은 병렬성으로 처리하는 데 강하다. CPU는 범용 제어와 지연시간이 중요한 다양한 작업에 유연하고, TPU·NPU는 지원 연산과 배포 환경에 맞춘 전용 가속기다. 장치 이름만으로 속도를 정할 수는 없으며 연산 크기, 메모리 이동, 지원 framework와 하드웨어에 맞게 구현됐는지를 함께 본다.
- project_context: AI 코드에서 cuda/device/batch_size가 왜 나오는지 이해하기 위한 기본 비교다.

## PY13_L06_cpu_role_001
- level: 6
- file: python_compute_concepts_v13.json
- title: CPU가 맡기 좋은 일
- question_type: meaning_choice
- concepts: ["if","else","for","cpu","control_flow","general_purpose"]
- reading_goal: CPU가 범용 제어와 복잡한 분기에 강하다는 것을 이해한다.
- code:
```python
for task in tasks:
    if task["type"] == "download":
        download(task)
    elif task["type"] == "parse":
        parse(task)
    else:
        skip(task)
```
- question: 이런 코드는 어떤 장치의 역할에 더 가깝나?
- answer: CPU
- explanation: 바깥 Python loop는 task 종류를 하나씩 확인해 서로 다른 함수를 호출하므로 범용 CPU가 조율하기 좋은 제어 흐름이다. 다만 download는 network I/O를 기다리고 parse 내부는 다른 library나 accelerator를 사용할 수도 있어, 이 조각만으로 전체 작업이 CPU 계산만 한다고 단정할 수는 없다. CPU가 맡는 부분은 조건 판단과 호출 순서 제어다.
- project_context: 배치 파이프라인/수집기/서버 로직은 대부분 CPU 제어 흐름이다.

## PY_L06_csv_dictreader_001
- level: 6
- file: python_core_expansion_v1.json
- title: csv.DictReader 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","csv","DictReader","dict","file"]
- reading_goal: CSV 행을 dict처럼 읽는 구조를 이해한다.
- code:
```python
import csv

with open("items.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["label"])
```
- question: row는 어떤 형태에 가까운가?
- answer: dict
- explanation: csv.DictReader는 CSV의 첫 줄 컬럼명을 key로 사용해 각 행을 dict처럼 읽게 해 준다. 그래서 row['name']처럼 값을 꺼낼 수 있다. 컬럼 이름으로 접근하므로 순서보다 의미 중심으로 CSV 데이터를 읽을 수 있다.
- project_context: CSV 라벨링 결과를 컬럼명으로 읽을 때 유용하며, TSV는 delimiter='\t'를 따로 지정해야 한다.

## PY_L06_pathlib_glob_001
- level: 6
- file: python_core_expansion_v1.json
- title: Path.glob으로 파일 찾기
- question_type: meaning_choice
- concepts: ["import","print","pathlib","glob","for"]
- reading_goal: Path(...).glob("*.jsonl")이 특정 확장자 파일을 찾는 코드임을 읽는다.
- code:
```python
from pathlib import Path

for path in Path("data").glob("*.jsonl"):
    print(path.name)
```
- question: 이 코드는 무엇을 찾는가?
- answer: data 폴더의 jsonl 파일
- explanation: Path('data')가 검색할 폴더를 data로 정하고, glob('*.jsonl')이 그 폴더 바로 아래에서 이름이 .jsonl로 끝나는 항목을 찾는다. *는 앞부분 이름이 무엇이든 될 수 있다는 뜻이며, 이 패턴은 하위 폴더까지 재귀적으로 찾지는 않는다. 결과는 Path 객체이므로 path.name으로 파일 이름을 읽을 수 있다.
- project_context: 여러 입력 파일을 batch로 처리할 때 자주 쓴다.

## PY_L06_write_jsonl_001
- level: 6
- file: python_core_expansion_v1.json
- title: JSONL 쓰기 흐름
- question_type: meaning_choice
- concepts: ["import","json.dumps","write","jsonl","for"]
- reading_goal: dict를 JSON 문자열로 바꿔 한 줄씩 저장하는 구조를 읽는다.
- code:
```python
import json

rows = [{"label": "LiDAR"}, {"label": "Radar"}]

with open("out.jsonl", "w", encoding="utf-8") as f:
    for row in rows:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
```
- question: 이 코드는 무엇을 하는가?
- answer: rows를 JSONL 파일로 저장한다
- explanation: JSONL은 한 줄에 JSON 객체 하나씩 저장하는 형식이다. 각 row를 json.dumps로 문자열로 바꾸고 줄바꿈을 붙여 한 줄씩 저장한다. JSONL은 대용량 데이터를 한 줄씩 추가하거나 읽기 쉬워 로그와 데이터셋 저장에 자주 쓰인다.
- project_context: 노드/엣지/청크 결과 저장에 핵심이다.

## PY120_L06_DICTWRITER_SAVE_FLOW_001
- level: 6
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: DictWriter 저장 흐름 읽기
- question_type: multiple_choice
- concepts: ["for","csv.DictWriter","writeheader","writerow","fieldnames"]
- reading_goal: DictWriter로 헤더를 쓰고 여러 dict 행을 차례로 저장하는 전체 흐름을 읽는다.
- code:
```python
rows = [{'name': 'Mina', 'score': 90}]
with open('scores.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'score'])
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
```
- question: 이 코드의 전체 흐름으로 가장 알맞은 것은?
- answer: 헤더를 쓰고 각 행을 순서대로 쓴다
- explanation: DictWriter를 만들고 writeheader()로 컬럼명을 먼저 쓴 뒤, 각 dict row를 writerow()로 저장하는 흐름이다. 따라서 정답은 ‘헤더를 쓰고 각 행을 순서대로 쓴다’이다.
- project_context: 가공한 데이터를 CSV 결과 파일로 저장하는 실전 흐름을 읽는 카드다.

## PY120_L06_FIELDNAMES_DEBUG_001
- level: 6
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: reader.fieldnames로 헤더 확인
- question_type: multiple_choice
- concepts: ["print","fieldnames","csv.DictReader","header"]
- reading_goal: reader.fieldnames를 출력하면 DictReader가 인식한 실제 컬럼명을 확인할 수 있음을 읽는다.
- code:
```python
reader = csv.DictReader(f)
print(reader.fieldnames)
```
- question: reader.fieldnames를 출력하는 이유로 알맞은 것은?
- answer: 실제 인식된 컬럼명을 확인하기 위해
- explanation: fieldnames에는 DictReader가 읽은 헤더 이름들이 들어 있다. 컬럼명 오타나 공백 문제를 찾을 때 도움이 된다. 따라서 출력은 ‘실제 인식된 컬럼명을 확인하기 위해’이다.
- project_context: CSV 컬럼 오류를 디버깅할 때 실제 헤더를 먼저 확인하는 습관을 만든다.

## PY57_L06_copyright_001
- level: 6
- file: python_data_governance_copyright_v57.json
- title: copyright 읽기
- question_type: meaning_choice
- concepts: ["copyright","data_governance","source_policy"]
- reading_goal: 데이터나 콘텐츠를 사용할 때 저작권 확인이 필요하다는 점을 이해한다.
- code:
```python
source = {
  title: '교육 자료',
  rightsStatus: 'reviewed',
  reviewedAt: '2026-08-11',
  intendedUse: 'lesson excerpt'
}
```
- question: copyright 확인의 목적은?
- answer: 자료를 써도 되는지 권리와 조건을 확인하기 위해
- explanation: copyright review는 구체적 저작물, 권리자, 관할, intended use와 permission·license·법적 예외를 확인하는 과정이다. copyrightChecked: true 같은 flag만으로 사용 권한이 생기지 않는다. 검토 근거, 날짜, reviewer와 license 문서를 남기고 불확실하거나 고위험한 경우 법률 전문가에게 확인한다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L06_license_001
- level: 6
- file: python_data_governance_copyright_v57.json
- title: license 읽기
- question_type: meaning_choice
- concepts: ["license","reuse_condition","data_policy"]
- reading_goal: 라이선스가 자료의 사용 조건을 정한다는 점을 이해한다.
- code:
```python
license = getVerifiedLicense(item)
canUse = license.allows(intended_use)
           and obligationsCanBeMet(license)
```
- question: license의 역할은?
- answer: 자료를 어떤 조건으로 사용할 수 있는지 알려준다
- explanation: license가 존재한다는 사실만으로 사용 가능하지 않다. 정확한 license text와 version이 intended use의 commercial use, modification, redistribution을 허용하는지, attribution·share-alike 같은 의무를 이행할 수 있는지 확인한다. 권리자가 실제로 license할 권한이 있는지도 검토한다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY42_L06_csv_tsv_001
- level: 6
- file: python_data_processing_pandas_jsonl_v42.json
- title: CSV vs TSV 읽기
- question_type: meaning_choice
- concepts: ["CSV","TSV","delimiter"]
- reading_goal: CSV와 TSV가 구분자만 다른 표 형식 파일이라는 점을 이해한다.
- code:
```python
CSV: name,score
TSV: name\tscore
```
- question: TSV에서 보통 열을 나누는 문자는?
- answer: 탭 문자
- explanation: CSV와 TSV는 표 데이터를 text record로 저장하며 기본 delimiter가 각각 comma와 tab이다. 실제 필드에 delimiter, 따옴표, 줄바꿈이 있으면 quoting·escaping 규칙으로 표현하므로 단순 split(',')이나 split('\t')로 안전하게 읽을 수 없다. csv 같은 parser와 파일의 dialect·encoding을 사용해야 한다.
- project_context: curriculum graph, audit.tsv, manifest.tsv 같은 파일을 읽을 때 자주 나온다.

## PY42_L06_json_vs_jsonl_001
- level: 6
- file: python_data_processing_pandas_jsonl_v42.json
- title: JSON vs JSONL 읽기
- question_type: meaning_choice
- concepts: ["JSON","JSONL","line_delimited_json"]
- reading_goal: JSON과 JSONL의 저장 방식 차이를 구분한다.
- code:
```python
JSON:
[
  {"id": 1},
  {"id": 2}
]

JSONL:
{"id": 1}
{"id": 2}
```
- question: JSONL의 특징은?
- answer: 각 줄에 독립적으로 파싱할 수 있는 JSON 값 하나를 둔다
- explanation: JSON 문서는 배열이나 객체를 포함한 하나의 JSON 값이고, JSONL은 빈 줄 없이 각 줄을 독립적인 JSON 값으로 파싱할 수 있게 저장한다. 레코드는 보통 객체지만 문자열·숫자 같은 다른 JSON 값도 문법상 가능하다. 줄 단위 streaming과 append에는 편하지만 전체 파일 자체는 하나의 일반 JSON 값이 아니다.
- project_context: node_pass output, LoRA dataset, validation result가 JSONL인 경우가 많다.

## PY37_L06_database_table_001
- level: 6
- file: python_database_storage_crud_v37.json
- title: database / table 읽기
- question_type: meaning_choice
- concepts: ["database","table","storage"]
- reading_goal: 데이터베이스 안에서 테이블이 데이터를 나누는 단위임을 이해한다.
- code:
```python
database: learning_app

tables:
  cards
  progress
  wrong_answers
```
- question: table의 역할로 가장 가까운 것은?
- answer: 비슷한 종류의 데이터를 행과 열로 보관한다
- explanation: 데이터베이스 안에는 여러 테이블이 있고, 각 테이블은 특정 종류의 데이터를 저장한다. database는 여러 데이터를 모아 보관하는 저장소이고, table은 그 안에서 행과 열로 정리된 구조다. 어떤 table에 어떤 column이 있는지 먼저 확인하면 된다.
- project_context: 학습앱에서는 카드, 진행률, 오답 기록을 각각 테이블로 나눌 수 있다.

## PY37_L06_row_column_001
- level: 6
- file: python_database_storage_crud_v37.json
- title: row / column 읽기
- question_type: meaning_choice
- concepts: ["row","column","record","field"]
- reading_goal: 테이블에서 행과 열이 각각 무엇을 나타내는지 구분한다.
- code:
```python
progress table

user_id | card_id | correct_count
u1      | c101    | 3
u1      | c102    | 0
```
- question: card_id는 이 표에서 무엇에 가까운가?
- answer: column
- explanation: column은 모든 행이 공유하는 세로 방향의 필드이고, row는 한 항목에 대한 필드 값들의 묶음이다. 이 표에서 card_id는 column 이름이며 c101과 c102는 각 row에 들어 있는 card_id 값이다.
- project_context: 사용자별 카드 진행률을 저장할 때 row/column 구분이 필요하다.

## PY123_L06_DATETIME_SAFE_FLOW_001
- level: 6
- file: python_datetime_beginner_v123_a1.json
- title: 날짜 처리 안전 흐름 읽기
- question_type: multiple_choice
- concepts: ["if","strptime","timedelta","strftime","date filter"]
- reading_goal: 날짜 문자열을 파싱하고, 기준 날짜와 비교하고, 파일명 문자열로 저장하는 전체 흐름을 읽는다.
- code:
```python
dt = datetime.strptime(row['date'], '%Y-%m-%d').date()
cutoff = date.today() - timedelta(days=7)
if dt >= cutoff:
    name = f"report_{dt.strftime('%Y%m%d')}.json"
```
- question: 이 코드의 전체 흐름으로 가장 알맞은 것은?
- answer: 날짜를 파싱해 최근 기준과 비교한 뒤 파일명에 넣는다
- explanation: strptime()으로 문자열을 날짜로 바꾸고, timedelta로 만든 기준 날짜와 비교한 뒤, strftime()으로 파일명에 넣을 문자열을 만든다.
- project_context: 날짜 문자열, 최근 필터, 날짜 파일명을 한 흐름으로 읽는 실전 종합 카드다.

## PY123_L06_TIMEZONE_KST_001
- level: 6
- file: python_datetime_beginner_v123_a1.json
- title: KST 시간대 만들기
- question_type: multiple_choice
- concepts: ["import","timezone","KST","UTC","timedelta"]
- reading_goal: timezone(timedelta(hours=9))로 한국 시간 기준 datetime을 만들 수 있음을 읽는다.
- code:
```python
from datetime import datetime, timedelta, timezone

KST = timezone(timedelta(hours=9))
now_kst = datetime.now(KST)
```
- question: timezone(timedelta(hours=9))의 의미로 알맞은 것은?
- answer: UTC보다 9시간 빠른 시간대를 만든다
- explanation: KST는 UTC보다 9시간 빠른 시간대다. timezone(timedelta(hours=9))는 한국 시간 기준 datetime을 만들 때 쓸 수 있다.
- project_context: GitHub Pages나 서버 로그와 한국 사용자 기준 날짜가 다르게 보이는 문제를 이해하는 카드다.

## PY17_L06_http_server_001
- level: 6
- file: python_debug_logs_cache_git_v17.json
- title: 로컬 정적 서버 명령 읽기
- question_type: meaning_choice
- concepts: ["http_server","localhost","port","static_file"]
- reading_goal: python -m http.server 명령이 어떤 서버를 띄우는지 이해한다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
python -m http.server 8790 --bind 127.0.0.1
```
- question: 이 명령의 목적은?
- answer: 현재 폴더를 8790 포트의 로컬 정적 서버로 연다
- explanation: Set-Location이 작업 폴더를 바꾼 뒤 python -m http.server가 그 폴더의 파일을 HTTP로 제공한다. 8790은 포트 번호이고 --bind 127.0.0.1은 같은 PC에서만 접속하게 제한한다. 이 서버는 로컬 개발과 확인용이며 인증, TLS, 성능 보호가 필요한 운영 서버로 사용하면 안 된다.
- project_context: 정적 학습 앱의 경로와 브라우저 로딩을 로컬에서 확인하는 실행 방식이다.

## PY17_L06_localhost_vs_ip_001
- level: 6
- file: python_debug_logs_cache_git_v17.json
- title: localhost와 내부 IP 구분하기
- question_type: meaning_choice
- concepts: ["comment","localhost","ip_address","network","mobile_test"]
- reading_goal: PC 브라우저와 폰 브라우저에서 접속 주소가 왜 다른지 이해한다.
- code:
```python
# PC에서 같은 PC의 서버 보기
http://localhost:8790/src/pwa/index.html

# 같은 LAN의 폰에서 PC 서버 보기
http://192.168.0.23:8790/src/pwa/index.html
```
- question: 폰에서 localhost 주소가 보통 안 되는 이유는?
- answer: 폰의 localhost는 PC가 아니라 폰 자기 자신을 뜻하기 때문에
- explanation: localhost는 주소를 입력한 기기 자체를 가리키므로 폰의 localhost는 폰이다. 폰에서 PC 서버에 접속하려면 서버가 127.0.0.1만이 아니라 PC의 LAN 주소나 0.0.0.0에 bind되어 있어야 하고, 두 기기가 같은 네트워크에 있으며 방화벽이 포트를 허용해야 한다. PC의 내부 IP는 환경마다 달라지므로 예시 값을 그대로 쓰면 안 된다.
- project_context: GitHub Pages 주소와 로컬 테스트 주소를 구분하는 실전 개념이다.

## PY4_L06_file_suffix_001
- level: 6
- file: python_deep_expansion_v4.json
- title: Path suffix/stem 읽기
- question_type: output_prediction
- concepts: ["import","print","pathlib","suffix","stem"]
- reading_goal: 파일 확장자와 확장자를 뺀 이름을 읽는 코드를 이해한다.
- code:
```python
from pathlib import Path

p = Path("report.jsonl")
print(p.stem, p.suffix)
```
- question: 출력에 가까운 것은?
- answer: report .jsonl
- explanation: Path의 stem은 확장자를 뺀 파일 이름이고 suffix는 확장자다. 파일 종류를 확인하거나 출력 파일명을 만들 때 자주 쓴다. 예를 들어 report.pdf라면 stem은 report, suffix는 .pdf처럼 나뉘므로 파일명 가공 로직을 읽기 쉽다. 따라서 출력은 ‘report .jsonl’이다.
- project_context: 파일 종류별 처리와 출력 파일명 생성에서 자주 쓰인다.
