# V356 semantic review — Level 4 chunk 2

Cards 21-40 of 97.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY107_A1_ENV_007_CUDA_GPU
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: CUDA와 nvidia-smi 감각 잡기
- question_type: debug
- concepts: ["print","cuda","gpu","nvidia-smi","torch.cuda"]
- reading_goal: GPU 문제를 nvidia-smi와 torch.cuda.is_available()로 나누어 확인한다.
- code:
```python
nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"
```
- question: GPU가 Python에서 안 잡힐 때 확인 흐름으로 가장 알맞은 것은?
- answer: nvidia-smi로 GPU/드라이버를 보고, torch.cuda.is_available()도 확인한다
- explanation: GPU 문제는 하드웨어, 드라이버, CUDA, PyTorch 빌드가 나뉘어 있다. nvidia-smi는 GPU와 드라이버 상태를 보는 시작점이고, torch.cuda.is_available()은 PyTorch가 GPU를 실제로 쓸 수 있는지 확인한다. pip나 git 상태만으로는 GPU 사용 가능 여부를 판단할 수 없다.
- project_context: 

## PY107_A1_ENV_008_GIT_FLOW
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: Git 기본 흐름 잡기
- question_type: flow
- concepts: ["git","git_status","git_add","git_commit","git_push"]
- reading_goal: Git의 status, add, commit, push 기본 흐름을 순서대로 읽는다.
- code:
```python
git status
git add path/to/changed_file.py
git commit -m "message"
git push origin main
```
- question: Git에서 변경을 기록하고 원격 저장소에 올리는 기본 흐름으로 가장 알맞은 것은?
- answer: status로 확인하고 add, commit, push 순서로 진행한다
- explanation: git status로 변경을 확인하고, git add로 이번 commit에 넣을 파일을 명시해 staging한다. git commit은 로컬 기록을 만들고 git push는 그 기록을 원격 브랜치에 전송한다. git add .은 의도하지 않은 파일까지 포함할 수 있으므로 초보 단계에서는 status와 diff를 읽고 대상 경로를 좁혀 추가하는 편이 안전하다.
- project_context: 

## PY113_L04_APT_VS_PIP_001
- level: 4
- file: python_dev_environment_practical_v113_a1.json
- title: apt와 pip 구분
- question_type: multiple_choice
- concepts: ["apt","pip","package","dependency"]
- reading_goal: apt와 pip가 설치하는 대상이 다르며 시스템 도구와 Python 패키지를 구분한다.
- code:
```python
sudo apt install git
python -m pip install requests
```
- question: 두 명령의 차이는?
- answer: apt는 시스템 도구, pip는 Python 패키지
- explanation: git 같은 시스템 도구는 apt로, requests 같은 Python 라이브러리는 pip로 설치하는 경우가 많다. 두 명령은 설치 대상이 다르다.
- project_context: AI 서버 세팅에서 apt와 pip를 섞어 쓰므로 둘을 구분하는 것이 중요하다.

## PY113_L04_SUDO_001
- level: 4
- file: python_dev_environment_practical_v113_a1.json
- title: sudo 의미 읽기
- question_type: multiple_choice
- concepts: ["sudo","apt","permission","linux"]
- reading_goal: sudo가 관리자 권한 실행이며 필요한 작업에만 조심해서 써야 한다는 점을 읽는다.
- code:
```python
sudo apt update
sudo apt install git
```
- question: sudo를 붙이는 가장 알맞은 이유는?
- answer: 관리자 권한이 필요한 설치 작업이라서
- explanation: sudo는 Linux에서 관리자 권한으로 실행한다는 뜻이다. 시스템 설치처럼 권한이 필요한 작업에만 쓰고, 아무 오류에나 붙이는 해결책은 아니다.
- project_context: 서버 세팅 중 sudo를 볼 때 무작정 복붙하지 말고 권한 작업인지 확인해야 한다.

## PY113_L04_UBUNTU_WSL_001
- level: 4
- file: python_dev_environment_practical_v113_a1.json
- title: Ubuntu와 WSL 구분
- question_type: multiple_choice
- concepts: ["ubuntu","wsl","powershell","bash","venv"]
- reading_goal: Ubuntu, Linux, WSL이 Python 코드와 어떤 관계인지 구분한다.
- code:
```python
Windows PowerShell: .\.venv\Scripts\Activate.ps1
Ubuntu Bash: source .venv/bin/activate
```
- question: 위 코드가 보여주는 핵심 차이는?
- answer: 쉘에 따라 활성화 명령이 달라진다
- explanation: Python 개념은 같아도 PowerShell과 Bash는 명령 모양이 다를 수 있다. 그래서 운영체제와 쉘을 구분해서 읽어야 한다. 따라서 정답은 ‘쉘에 따라 활성화 명령이 달라진다’이다.
- project_context: Windows 노트북과 Ubuntu 서버를 오가며 작업할 때 헷갈리기 쉬운 부분이다.

## PY113_L04_VENV_ACTIVATE_001
- level: 4
- file: python_dev_environment_practical_v113_a1.json
- title: 가상환경 활성화 읽기
- question_type: multiple_choice
- concepts: ["venv","activate","powershell"]
- reading_goal: 프롬프트에 .venv가 보이면 현재 가상환경이 활성화된 상태임을 읽는다.
- code:
```python
PS D:\project> .\.venv\Scripts\Activate.ps1
(.venv) PS D:\project>
```
- question: 두 번째 줄의 (.venv)는 무엇을 뜻할까?
- answer: 현재 가상환경이 활성화된 상태
- explanation: 프롬프트의 (.venv)는 활성화 스크립트가 PATH 등을 바꾸어 이 가상환경의 Python을 우선 사용하게 했다는 표시다. 다만 프롬프트 표시는 이름일 뿐이므로, 헷갈리면 python -c "import sys; print(sys.executable)"로 실제 실행 파일을 확인한다.
- project_context: pip install 전에 어떤 가상환경이 켜져 있는지 확인하는 습관이 중요하다.

## PY113_L04_VENV_WHY_001
- level: 4
- file: python_dev_environment_practical_v113_a1.json
- title: 가상환경을 쓰는 이유
- question_type: multiple_choice
- concepts: ["venv","virtual environment","dependency"]
- reading_goal: 가상환경이 프로젝트별 패키지를 분리해 충돌을 줄이는 장치임을 읽는다.
- code:
```python
project_a/.venv  -> numpy 1.x
project_b/.venv  -> numpy 2.x
```
- question: 가상환경을 쓰는 가장 큰 이유는?
- answer: 프로젝트별 패키지를 따로 관리하려고
- explanation: 프로젝트마다 필요한 라이브러리 버전이 다를 수 있다. 가상환경은 프로젝트별로 패키지를 분리해 충돌과 설치 혼란을 줄이고 재현성을 높인다.
- project_context: 여러 대회/서비스 프로젝트를 동시에 할 때 패키지가 서로 꼬이지 않게 해준다.

## PY117_L04_EXCEPTION_TYPE_001
- level: 4
- file: python_exception_traceback_beginner_v117_a1.json
- title: 에러 종류 읽기
- question_type: multiple_choice
- concepts: ["comment","ValueError","exception type","debugging"]
- reading_goal: ValueError, TypeError 같은 예외 종류가 문제의 성격을 알려 준다는 점을 읽는다.
- code:
```python
int('abc')
# ValueError
```
- question: ValueError라는 이름이 주는 힌트로 알맞은 것은?
- answer: 값의 형태나 내용이 맞지 않을 수 있다는 뜻
- explanation: ValueError는 값 자체가 기대한 형태와 맞지 않을 때 자주 나온다. 여기서는 'abc'를 int로 바꿀 수 없어서 생긴다.
- project_context: 에러 이름을 단순 암기하지 않고 원인 범주를 추측하는 데 도움이 된다.

## PY117_L04_TRACEBACK_FILE_LINE_001
- level: 4
- file: python_exception_traceback_beginner_v117_a1.json
- title: traceback 파일과 줄 번호
- question_type: multiple_choice
- concepts: ["traceback","line number","file path"]
- reading_goal: traceback의 File과 line 정보를 이용해 고칠 후보 위치를 찾는다.
- code:
```python
File "main.py", line 7, in load_data
    data = open(path).read()
```
- question: line 7 정보가 알려 주는 것은?
- answer: main.py의 7번째 줄이 확인 후보라는 뜻
- explanation: File과 line은 에러가 난 코드 위치를 찾는 힌트다. 해당 줄의 변수와 입력값을 확인하면 원인을 좁힐 수 있다. 여러 파일이 나와도 먼저 내 코드 줄을 확인한다. 따라서 정답은 ‘main.py의 7번째 줄이 확인 후보라는 뜻’이다.
- project_context: 긴 프로젝트에서 에러 위치를 찾는 기본 독해 훈련이다.

## PY117_L04_TRACEBACK_LAST_LINE_001
- level: 4
- file: python_exception_traceback_beginner_v117_a1.json
- title: traceback 마지막 줄 읽기
- question_type: multiple_choice
- concepts: ["traceback","ValueError","error message"]
- reading_goal: traceback의 마지막 줄에서 에러 종류와 메시지를 먼저 확인하는 습관을 익힌다.
- code:
```python
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    age = int('abc')
ValueError: invalid literal for int()
```
- question: 이 traceback에서 가장 먼저 확인하기 좋은 부분은?
- answer: 마지막 줄의 ValueError와 메시지
- explanation: traceback은 마지막 줄에 에러 종류와 메시지를 보여 주는 경우가 많다. 먼저 원인 범주를 보고, 그다음 파일과 줄 번호를 확인하면 된다.
- project_context: 터미널에 긴 에러가 나왔을 때 어디부터 읽어야 하는지 정하는 기초 카드다.

## PY118_L04_EXISTS_BEFORE_READ_001
- level: 4
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: 파일 읽기 전 exists 확인
- question_type: multiple_choice
- concepts: ["if","import","Path.exists","read_text","FileNotFoundError"]
- reading_goal: 파일을 읽기 전에 Path.exists()로 경로가 실제 존재하는지 확인하는 이유를 읽는다.
- code:
```python
from pathlib import Path

path = Path('data/input.txt')
if path.exists():
    text = path.read_text(encoding='utf-8')
```
- question: 이 코드에서 path.exists()를 먼저 확인하는 이유로 알맞은 것은?
- answer: 파일이 있는지 먼저 확인하기 위해
- explanation: exists()는 검사한 순간 그 경로가 존재하는지 알려 준다. 초보자에게 빠른 사전 확인은 되지만 검사 직후 파일이 사라질 수 있으므로, 실제 읽기 코드는 read_text()에서 나는 FileNotFoundError도 처리해야 한다. 파일만 허용한다면 is_file()도 확인한다.
- project_context: 데이터 파일을 읽기 전에 경로 문제를 먼저 확인하는 초보 실전 카드다.

## PY118_L04_EXISTS_FALSE_MEANING_001
- level: 4
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: exists()가 False인 경우
- question_type: multiple_choice
- concepts: ["print","Path.exists","path","current working directory"]
- reading_goal: Path.exists()가 False일 때 경로 오타, 작업 폴더, 파일 누락을 점검해야 함을 이해한다.
- code:
```python
path = Path('data/input.txt')
print(path.exists())  # False
```
- question: exists()가 False라면 먼저 의심할 만한 것은?
- answer: 경로가 틀렸거나 파일이 없을 수 있다
- explanation: False는 그 경로를 찾지 못했다는 뜻이다. 파일명 오타, 현재 작업 폴더, 실제 파일 존재 여부를 먼저 확인하는 게 좋다. 따라서 출력은 ‘경로가 틀렸거나 파일이 없을 수 있다’이다.
- project_context: FileNotFoundError가 나기 전에 어디를 확인해야 하는지 알려 주는 카드다.

## PY10_L04_default_param_001
- level: 4
- file: python_foundation_expansion_v10.json
- title: 기본 파라미터 읽기
- question_type: output_prediction
- concepts: ["def","return","print","function","parameter","default"]
- reading_goal: 인자를 생략하면 기본값이 쓰이는 코드를 읽는다.
- code:
```python
def greet(name="user"):
    return "hello " + name

print(greet())
```
- question: 출력은?
- answer: hello user
- explanation: 기본 매개변수는 인자를 주지 않았을 때 사용할 값을 미리 정한다. name 기본값이 user라서 greet()는 hello user를 반환한다. 기본값은 함수 정의 시 정해지며, 호출자가 값을 넘기면 그 값이 기본값을 대신한다.
- project_context: CLI 옵션, API 기본값, 함수 옵션을 읽는 데 필요하다.

## PY10_L04_function_chain_001
- level: 4
- file: python_foundation_expansion_v10.json
- title: 함수 안 메서드 체인 읽기
- question_type: output_prediction
- concepts: ["def","return","print","function","strip","lower","normalization"]
- reading_goal: 함수 안에서 문자열을 정규화하는 흐름을 읽는다.
- code:
```python
def normalize(text):
    return text.strip().lower()

print(normalize(" LiDAR "))
```
- question: 출력은?
- answer: lidar
- explanation: 함수 체인은 한 결과를 다음 함수나 메서드로 이어 처리하는 방식이다. strip으로 공백을 제거한 뒤 lower로 소문자로 바꾼다. 중간 결과를 머릿속에 적어 두면 여러 메서드가 이어져도 최종 출력이 어떻게 바뀌는지 놓치지 않는다. 따라서 출력은 ‘lidar’이다.
- project_context: 노드 label, 검색어, 태그 정규화에 자주 쓰인다.

## PY10_L04_path_join_001
- level: 4
- file: python_foundation_expansion_v10.json
- title: Path / 연산자 읽기
- question_type: meaning_choice
- concepts: ["import","print","pathlib","path","file"]
- reading_goal: pathlib에서 / 로 경로를 이어 붙이는 코드를 읽는다.
- code:
```python
from pathlib import Path

path = Path("data") / "items.json"
print(path)
```
- question: Path('data') / 'items.json'의 의미는?
- answer: data 폴더 아래 items.json 경로
- explanation: Path 객체 사이의 /는 나눗셈이 아니라 경로 조각을 잇는 연산이다. 따라서 Path("data") / "items.json"은 data 폴더 아래의 items.json을 나타내는 경로 객체를 만든다. Path는 현재 운영체제에 맞는 구분자를 사용하지만, 이 줄만으로 폴더나 파일을 실제로 만들지는 않는다.
- project_context: Windows 경로 꼬임을 줄이는 데 도움이 된다.

## PY10_L04_scope_local_001
- level: 4
- file: python_foundation_expansion_v10.json
- title: local scope 읽기
- question_type: output_prediction
- concepts: ["def","return","print","scope","function","variable"]
- reading_goal: 함수 안 지역 변수와 바깥 변수를 구분해 읽는다.
- code:
```python
def outer():
    value = "inside"
    return value

value = "outside"
print(outer())
```
- question: 출력은?
- answer: inside
- explanation: 함수 안에서 만든 변수는 보통 그 함수 안의 지역 변수로 동작한다. outer 함수 안의 local value가 return되어 바깥 값과 구분된다. 지역 변수는 함수 호출이 끝나면 보통 사라지므로 다른 함수나 전역 코드와 이름 충돌을 줄인다. 따라서 출력은 ‘inside’이다.
- project_context: 긴 코드에서 같은 이름의 변수가 어디의 값인지 구분하는 훈련이다.

## PYF95_A5_OOP_001_CLASS_ONLY
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: class 정의만 있는 코드
- question_type: concept_reading
- concepts: ["class","object"]
- reading_goal: class 정의와 실제 object 생성을 구분한다.
- code:
```python
class Dog:
    pass
```
- question: 이 코드를 실행했을 때 맞는 설명은?
- answer: class 본문이 실행되어 Dog class만 만들어지고 instance는 없다
- explanation: class 문을 실행하면 들여쓰기된 class 본문이 한 번 실행되고 그 결과로 Dog class 객체가 만들어진다. 이 예시의 본문은 pass라서 눈에 보이는 동작이 없다. Dog() 호출은 없으므로 Dog의 instance는 아직 만들어지지 않는다. ‘class 정의는 전혀 실행되지 않는다’고 이해하면 안 된다.
- project_context: 객체지향 코드를 읽을 때 class 블록과 실행 흐름을 분리해서 봐야 한다.

## PYF95_A5_OOP_002_CREATE_OBJECT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: class로 object 만들기
- question_type: output_prediction
- concepts: ["print","class","object","type"]
- reading_goal: Dog() 호출로 object가 만들어지고 type 이름을 확인하는 흐름을 읽는다.
- code:
```python
class Dog:
    pass

pet = Dog()
print(type(pet).__name__)
```
- question: 출력 결과는?
- answer: Dog
- explanation: pet은 Dog class로 만든 object이므로 타입 이름은 Dog다.
- project_context: 데이터를 같은 모양으로 묶어 다루는 프로젝트 코드에서 object 생성이 등장할 수 있다.

## PYF95_A5_OOP_003_SET_ATTRIBUTE_OUTSIDE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object attribute 밖에서 넣기
- question_type: output_prediction
- concepts: ["print","class","object","attribute"]
- reading_goal: object에 점 표기법으로 attribute를 추가하고 다시 읽는 흐름을 따라간다.
- code:
```python
class User:
    pass

u = User()
u.name = "Mina"
print(u.name)
```
- question: 출력 결과는?
- answer: Mina
- explanation: u.name에 Mina가 저장되었으므로 u.name 출력은 Mina다.
- project_context: 간단한 object는 필요한 값을 attribute로 붙여 사용할 수 있다.

## PYF95_A5_OOP_004_CHANGE_ATTRIBUTE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: attribute 값 바꾸기
- question_type: output_prediction
- concepts: ["class","print","attribute","assignment","object"]
- reading_goal: 같은 attribute에 다시 대입하면 마지막 값이 남는 흐름을 읽는다.
- code:
```python
class User:
    pass

u = User()
u.score = 80
u.score = 90
print(u.score)
```
- question: 출력 결과는?
- answer: 90
- explanation: u.score가 80에서 90으로 바뀌었으므로 90이 출력된다.
- project_context: 진행도나 점수 상태가 object attribute로 갱신되는 코드를 이해하는 데 필요하다.
