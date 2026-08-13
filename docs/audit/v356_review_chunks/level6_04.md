# V356 semantic review — Level 6 chunk 4

Cards 61-80 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY128_L06_TRY_EXCEPT_ELSE_FLOW_001
- level: 6
- file: python_file_cli_error_recovery_v128_a1.json
- title: try except else 흐름 읽기
- question_type: multiple_choice
- concepts: ["try_except","print","try","except","else","normal path"]
- reading_goal: try 성공 시 else가 실행되고, 오류 처리와 정상 처리를 분리할 수 있음을 이해한다.
- code:
```python
try:
    data = json.loads(text)
except json.JSONDecodeError:
    print('오류')
else:
    print('정상 처리')
```
- question: try / except / else 구조에서 else 블록이 실행되는 경우는?
- answer: try 블록에서 오류가 나지 않았을 때
- explanation: else는 try 블록이 성공했을 때만 실행된다. 오류 처리 코드와 정상 처리 코드를 나누고 싶을 때 try/except/else 흐름을 사용할 수 있다. 따라서 출력은 ‘try 블록에서 오류가 나지 않았을 때’이다.
- project_context: 

## PY19_L06_csv_dictreader_001
- level: 6
- file: python_file_data_processing_v19.json
- title: CSV DictReader 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","csv","DictReader","file","row"]
- reading_goal: CSV 파일을 행 단위 dict로 읽는 코드를 이해한다.
- code:
```python
import csv

with open("items.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["title"])
```
- question: csv.DictReader의 특징은?
- answer: 각 행을 컬럼명 기반 dict처럼 읽는다
- explanation: DictReader는 첫 줄 헤더를 key로 사용해 각 행을 dict처럼 읽게 해준다. CSV DictReader는 CSV의 각 행을 dict처럼 읽게 해 주는 도구다. 열 이름이 key가 되고 각 칸의 값이 value가 되므로, 코드에서 어떤 column을 참조하는지 확인해야 한다.
- project_context: doc_master.csv, registry, audit TSV/CSV를 읽을 때 기본이 되는 패턴이다.

## PY19_L06_tsv_delimiter_001
- level: 6
- file: python_file_data_processing_v19.json
- title: TSV delimiter 읽기
- question_type: meaning_choice
- concepts: ["import","print","tsv","delimiter","csv","file"]
- reading_goal: 탭으로 구분된 TSV 파일을 csv 모듈로 읽는 방법을 이해한다.
- code:
```python
import csv

with open("nodes.tsv", "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f, delimiter="\t")
    rows = list(reader)

print(len(rows))
```
- question: delimiter='\t'의 의미는?
- answer: 탭 문자를 컬럼 구분자로 쓴다
- explanation: TSV는 tab-separated values의 줄임말이다. delimiter="\t"를 지정하면 DictReader가 탭을 열 경계로 사용하고 첫 줄을 헤더로 읽는다. 값 안에 쉼표가 있어도 탭이 아니므로 열이 나뉘지 않지만, 탭이나 줄바꿈 자체가 든 값은 CSV와 마찬가지로 올바른 quoting 규칙이 필요하다.
- project_context: KG 후보/리뷰/매핑 TSV를 읽을 때 자주 보이는 코드다.

## PY118_L06_PARENT_DIR_BEFORE_WRITE_001
- level: 6
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: 파일 쓰기 전 parent 폴더 만들기
- question_type: multiple_choice
- concepts: ["parent","mkdir","write_text"]
- reading_goal: output/result.txt를 쓰기 전에 path.parent.mkdir로 부모 폴더를 준비하는 순서를 읽는다.
- code:
```python
path = Path('output/result.txt')
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text('done', encoding='utf-8')
```
- question: path.parent.mkdir(...)를 먼저 실행하는 이유는?
- answer: 파일이 들어갈 output 폴더를 준비하기 위해
- explanation: path.parent는 파일이 들어갈 폴더를 뜻한다. 폴더가 없으면 파일 쓰기가 실패할 수 있으므로 먼저 만들어 둔다. 결과 파일을 만들기 전에 저장 위치를 준비하는 순서다.
- project_context: 결과 파일 저장 파이프라인에서 자주 쓰는 안정 패턴이다.

## PY118_L06_SAFE_FILE_PIPELINE_001
- level: 6
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: 안전한 파일 출력 순서
- question_type: multiple_choice
- concepts: ["if","parent","mkdir","Path.exists","write_text"]
- reading_goal: 출력 경로를 만들고, 부모 폴더를 준비한 뒤, 파일을 쓰는 순서를 하나의 흐름으로 읽는다.
- code:
```python
out = Path('reports/today.txt')
out.parent.mkdir(parents=True, exist_ok=True)
if not out.exists():
    out.write_text('summary', encoding='utf-8')
```
- question: 이 코드의 전체 흐름으로 가장 알맞은 것은?
- answer: 부모 폴더를 준비하고 기존 파일이 없을 때 쓴다
- explanation: 코드는 부모 디렉터리를 준비하고, 검사 시점에 출력 파일이 없을 때만 쓴다. 반복 실행의 우발적 덮어쓰기는 줄이지만 검사와 쓰기는 원자적이지 않으므로 동시 실행까지 막아야 하면 배타적 생성이나 원자적 교체 전략이 필요하다.
- project_context: 학습 앱 데이터나 리포트 파일을 저장할 때 안전한 출력 순서를 익히는 카드다.

## PY32_L06_absolute_path_001
- level: 6
- file: python_files_paths_project_structure_v32.json
- title: 절대경로 읽기
- question_type: meaning_choice
- concepts: ["absolute_path","windows_path","file_system"]
- reading_goal: 드라이브부터 시작하는 Windows 절대경로를 읽는다.
- code:
```python
path = r"C:\work\app\data\lessons"
```
- question: 이 경로가 절대경로인 이유는?
- answer: C: 드라이브부터 전체 위치를 적었기 때문
- explanation: absolute path는 드라이브 문자나 루트부터 시작해 대상의 전체 위치를 나타낸다. 같은 컴퓨터에서는 현재 작업 폴더가 바뀌어도 같은 대상을 가리키지만, 다른 컴퓨터에 그 경로가 없을 수 있으므로 이식 가능한 설정에는 하드코딩하지 않는 편이 좋다.
- project_context: 로그에 해석된 절대경로를 남기면 스크립트가 실제로 어느 파일을 다뤘는지 확인하기 쉽다.

## PY32_L06_relative_path_001
- level: 6
- file: python_files_paths_project_structure_v32.json
- title: 상대경로 읽기
- question_type: meaning_choice
- concepts: ["relative_path","working_directory","path"]
- reading_goal: 현재 작업 폴더 기준으로 해석되는 상대경로를 이해한다.
- code:
```python
path = r".\data\lessons\cards_seed_v1.json"
```
- question: 이 상대경로는 무엇을 기준으로 해석되는가?
- answer: 현재 작업 폴더
- explanation: 상대경로는 현재 작업 폴더를 기준으로 해석된다. 앞의 .은 현재 폴더를 뜻하므로 실행 위치가 바뀌면 같은 문자열도 다른 대상을 가리킬 수 있다. Python 문자열에서는 Windows 역슬래시가 이스케이프 문자로 해석되지 않도록 raw string을 쓰거나 pathlib를 사용할 수 있다.
- project_context: 스크립트 실행 전 Set-Location을 먼저 하는 이유다.

## PY10_L06_class_init_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: class와 __init__ 읽기
- question_type: output_prediction
- concepts: ["def","function","print","class","__init__","self"]
- reading_goal: 객체가 만들어질 때 초기값이 설정되는 흐름을 읽는다.
- code:
```python
class Counter:
    def __init__(self):
        self.value = 0

counter = Counter()
print(counter.value)
```
- question: 출력은?
- answer: 0
- explanation: __init__은 객체가 만들어질 때 자동으로 실행되는 초기화 메서드다. Counter 객체 생성 시 self.value를 0으로 설정한다. __init__에서 만든 속성은 이후 메서드들이 공유하는 객체의 초기 상태가 된다.
- project_context: FastAPI/Pydantic/데이터 객체 코드를 읽기 위한 기초다.

## PY10_L06_class_method_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: method가 객체 상태 바꾸기
- question_type: output_prediction
- concepts: ["def","function","print","class","method","self","state"]
- reading_goal: 메서드가 self.value를 바꾸는 흐름을 읽는다.
- code:
```python
class Counter:
    def __init__(self):
        self.value = 0

    def add(self):
        self.value += 1

counter = Counter()
counter.add()
print(counter.value)
```
- question: 출력은?
- answer: 1
- explanation: counter.add()는 counter 객체를 self로 받아 인스턴스 메서드 add를 실행한다. self.value += 1은 같은 객체의 value를 0에서 1로 바꾼다. 지역 계산만 한 것이 아니라 객체 속성을 수정했으므로, 호출이 끝난 뒤 counter.value를 읽어도 1이 유지된다.
- project_context: 상태를 가진 파이프라인/필터/클라이언트 객체를 읽는 기초다.

## PY10_L06_dict_comprehension_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: dict comprehension 읽기
- question_type: output_prediction
- concepts: ["print","dict_comprehension","dict","len"]
- reading_goal: 리스트에서 dict를 한 줄로 만드는 코드를 읽는다.
- code:
```python
labels = ["LiDAR", "Radar"]
lengths = {label: len(label) for label in labels}
print(lengths["Radar"])
```
- question: 출력은?
- answer: 5
- explanation: dict comprehension은 반복문으로 새 dict를 만드는 문법이다. key에는 이름을, value에는 len(name)을 넣으므로 Radar의 길이 5가 저장된다.
- project_context: id→row, label→score 같은 매핑 테이블을 만들 때 유용하다.

## PY10_L06_list_comp_filter_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: 조건이 있는 list comprehension
- question_type: output_prediction
- concepts: ["print","list_comprehension","filter","modulo"]
- reading_goal: 조건에 맞는 값만 새 리스트에 넣는 코드를 읽는다.
- code:
```python
items = [1, 2, 3, 4]
evens = [x for x in items if x % 2 == 0]
print(evens)
```
- question: 출력은?
- answer: [2, 4]
- explanation: 리스트 컴프리헨션에는 조건 필터를 붙일 수 있다. x % 2 == 0 조건은 짝수인 값만 통과시켜 결과 리스트에 넣는다. 조건이 있는 list comprehension은 반복 대상 중 조건을 만족하는 값만 새 리스트에 담는다. for 부분과 if 부분을 나누어 읽으면 쉽다. 따라서 출력은 ‘[2, 4]’이다.
- project_context: 후보 필터링과 품질 조건 적용에 자주 쓰인다.

## PY10_L06_list_comprehension_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: list comprehension 읽기
- question_type: output_prediction
- concepts: ["print","list_comprehension","for","list"]
- reading_goal: 반복문을 한 줄로 써서 새 리스트를 만드는 코드를 읽는다.
- code:
```python
items = [1, 2, 3]
doubled = [x * 2 for x in items]
print(doubled)
```
- question: 출력은?
- answer: [2, 4, 6]
- explanation: 리스트 컴프리헨션은 반복 결과를 모아 새 리스트를 만드는 문법이다. for x in items가 1, 2, 3을 차례로 꺼내고, 앞의 x * 2가 각각 2, 4, 6을 만든다. 원본 items는 바뀌지 않으며 doubled에 새 리스트 [2, 4, 6]이 저장된다.
- project_context: 검색 결과 변환, 응답 생성, 데이터 전처리에서 자주 보인다.

## PY10_L06_logging_basic_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: logging 기본 읽기
- question_type: meaning_choice
- concepts: ["import","logging","info","debug"]
- reading_goal: print 대신 logging으로 실행 상태를 남기는 코드를 읽는다.
- code:
```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("started")
```
- question: logging.info('started')의 목적은?
- answer: started라는 정보 로그를 남긴다
- explanation: logging은 print보다 관리하기 좋은 실행 기록 방식이다. INFO 레벨 로그는 오류가 아니라 정상 진행 상태를 남길 때 자주 쓴다. 시작, 완료, 건수 같은 정상 흐름을 남기면 오류가 없어도 작업이 진행됐는지 확인할 수 있다. 따라서 정답은 ‘started라는 정보 로그를 남긴다’이다.
- project_context: 배치/서버 로그를 읽고 디버깅하는 데 필요하다.

## PY10_L06_mkdir_exist_ok_001
- level: 6
- file: python_foundation_expansion_v10.json
- title: mkdir exist_ok 읽기
- question_type: meaning_choice
- concepts: ["import","pathlib","mkdir","folder"]
- reading_goal: 폴더가 이미 있어도 에러 없이 넘어가는 코드를 읽는다.
- code:
```python
from pathlib import Path

Path("reports").mkdir(exist_ok=True)
```
- question: exist_ok=True의 의미는?
- answer: 폴더가 이미 있어도 에러를 내지 않는다
- explanation: Path("reports").mkdir(exist_ok=True)는 reports 폴더가 없으면 만들고, 같은 이름의 폴더가 이미 있으면 FileExistsError를 내지 않는다. 다만 같은 경로에 파일이 있으면 여전히 실패하고, 이 예제에는 parents=True가 없으므로 존재하지 않는 상위 폴더까지 자동으로 만들지는 않는다.
- project_context: reports, outputs, tmp 폴더 생성 코드에 자주 보인다.

## PY39_L06_state_001
- level: 6
- file: python_frontend_state_storage_cache_v39.json
- title: state 읽기
- question_type: meaning_choice
- concepts: ["state","frontend","UI"]
- reading_goal: 화면이 현재 어떤 상태인지 나타내는 state 개념을 이해한다.
- code:
```python
state = {
  "currentCardId": "PY39_L06_state_001",
  "showAnswer": false,
  "selectedChoice": null
}
```
- question: showAnswer: false는 무엇을 의미하는가?
- answer: 아직 정답 해설을 보여주지 않는 상태
- explanation: state는 현재 UI가 무엇을 보여줄지 결정하는 값들의 묶음이다. 선택된 카드, 필터, 로딩 여부 같은 화면 상태를 저장한다. showAnswer가 false이면 정답 영역을 아직 숨긴 상태라는 뜻으로, 사용자가 답을 고르기 전 화면 흐름을 나타낸다.
- project_context: 퀴즈 화면에서 선택지, 정답 표시, 추천 카드 목록 모두 state로 이해할 수 있다.

## PY30_L06_return_vs_print_001
- level: 6
- file: python_function_design_io_v30.json
- title: return vs print 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","print","output"]
- reading_goal: 화면에 보여주는 print와 값을 돌려주는 return의 차이를 읽는다.
- code:
```python
def add(a, b):
    return a + b

result = add(2, 3)
print(result)
```
- question: add(2, 3)이 직접 돌려주는 값은?
- answer: 5
- explanation: return은 함수 밖으로 값을 돌려준다. print는 그 값을 화면에 보여주는 역할이다. return은 함수 밖으로 값을 돌려주는 것이고, print는 화면에 보여 주는 동작이다. 다른 코드가 결과를 이어 쓰려면 return이 필요하다. 따라서 출력은 ‘5’이다.
- project_context: 검증 함수나 필터 함수는 print보다 return으로 결과를 넘기는 편이 재사용하기 좋다.

## PY33_L06_git_status_001
- level: 6
- file: python_git_github_workflow_v33.json
- title: git status 읽기
- question_type: meaning_choice
- concepts: ["git","status","working_tree"]
- reading_goal: 현재 Git 작업 상태를 확인하는 git status 출력의 의미를 읽는다.
- code:
```python
git status

On branch main
Your branch is up to date with origin/main.

nothing to commit, working tree clean
```
- question: working tree clean의 의미는?
- answer: 커밋할 변경사항이 없다
- explanation: working tree clean은 Git이 보여 주는 추적 파일과 일반 untracked 파일 중 커밋할 변경이 없다는 뜻이다. ignored 파일은 남아 있을 수 있고, origin/main과 같다는 문구도 마지막 fetch로 갱신된 로컬 원격 추적 정보와의 비교이므로 원격 서버의 실시간 상태를 보장하지 않는다.
- project_context: 각 확장 작업 마지막에 git status clean을 확인하는 이유다.

## PY48_L06_ci_basic_001
- level: 6
- file: python_github_actions_ci_validation_v48.json
- title: CI 기본 개념 읽기
- question_type: meaning_choice
- concepts: ["CI","automation","validation"]
- reading_goal: CI가 push 이후 자동으로 검증을 실행하는 구조임을 이해한다.
- code:
```python
git push
  -> GitHub Actions
  -> run validation
  -> pass or fail
```
- question: CI의 핵심 역할은?
- answer: 코드가 올라갈 때 자동 검증을 실행한다
- explanation: CI는 코드가 push되거나 PR이 열릴 때 자동으로 검증 명령을 실행하는 구조다. 사람이 매번 수동으로 검사하지 않아도 같은 품질 기준을 유지한다. CI가 반복 검증을 맡으면 코드 변경 때마다 누락 없이 테스트와 품질 검사를 실행할 수 있다.
- project_context: lesson JSON 검증을 GitHub Actions로 자동화하면 깨진 카드가 원격에 남는 위험을 줄일 수 있다.

## PY48_L06_github_actions_workflow_001
- level: 6
- file: python_github_actions_ci_validation_v48.json
- title: GitHub Actions workflow 읽기
- question_type: meaning_choice
- concepts: ["GitHub_Actions","workflow","YAML"]
- reading_goal: GitHub Actions가 .github/workflows/*.yml 파일로 동작한다는 점을 이해한다.
- code:
```python
.github/workflows/validate-lessons.yml
```
- question: GitHub Actions workflow 파일은 보통 어디에 두나?
- answer: .github/workflows 폴더
- explanation: GitHub는 .github/workflows 아래의 YAML 파일을 읽어 자동화 작업을 실행한다. GitHub Actions workflow는 push나 pull request 같은 이벤트에 맞춰 검증 명령을 실행하는 설정이다. job, step, run의 구조를 읽어야 흐름이 보인다.
- project_context: 이번 v48에서 validate-lessons.yml을 추가해 lesson 데이터 검증을 자동화한다.

## PY15_L06_number_types_001
- level: 6
- file: python_grouped_concepts_v15.json
- title: int / float / Decimal / NaN 비교
- question_type: meaning_choice
- concepts: ["int","float","decimal","nan","number_type"]
- reading_goal: 정수형/실수형과 정밀도 문제를 묶어 이해한다.
- code:
```python
int: 소수 부분이 없는 임의 정밀도 정수
float: 이진 부동소수점 근삿값으로 표현하는 실수
Decimal: 10진수 규칙과 정밀도를 명시해 계산하는 타입
NaN: 정의되지 않은 수치 결과나 결측을 표시할 때 쓰는 특수 부동소수점 값
```
- question: 돈 계산처럼 소수 정밀도가 중요한 경우 더 적합한 것은?
- answer: Decimal
- explanation: float는 많은 10진 소수를 정확히 저장하지 못하므로 금액 규칙처럼 10진수 정밀도가 중요한 계산에는 Decimal을 고려한다. Decimal도 문자열 "0.1"처럼 정확한 10진 입력에서 만들어야 의도한 값이 된다. NaN은 pandas에서 결측 표시에 자주 쓰이지만 모든 값 없음이 NaN인 것은 아니다.
- project_context: 점수/비용/평가값을 다룰 때 수치 표현 차이를 이해해야 한다.
