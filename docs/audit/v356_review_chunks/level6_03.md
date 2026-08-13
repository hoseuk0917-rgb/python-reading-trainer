# V356 semantic review — Level 6 chunk 3

Cards 41-60 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY4_L06_jsonl_stream_001
- level: 6
- file: python_deep_expansion_v4.json
- title: JSONL streaming 읽기
- question_type: meaning_choice
- concepts: ["import","print","jsonl","for","json.loads","streaming"]
- reading_goal: 큰 JSONL 파일을 한 줄씩 읽어 처리하는 코드를 이해한다.
- code:
```python
import json

with open("nodes.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        row = json.loads(line)
        print(row["id"])
```
- question: 이 코드의 장점은?
- answer: 파일을 한 줄씩 처리할 수 있다
- explanation: JSONL 파일은 한 줄씩 처리할 수 있어 큰 파일에 유리하다. for line in f는 파일 전체를 한 번에 올리지 않고 줄 단위로 읽게 해 준다. 라인 번호를 함께 기록하면 어떤 JSON 객체에서 파싱 오류가 났는지 추적하기 쉽다.
- project_context: 대량 chunks/nodes/edges JSONL 처리의 핵심 패턴이다.

## PY4_L06_resolve_path_001
- level: 6
- file: python_deep_expansion_v4.json
- title: resolve() 절대경로 읽기
- question_type: meaning_choice
- concepts: ["import","print","pathlib","resolve","path"]
- reading_goal: 상대경로를 실제 절대경로로 해석하는 pathlib 코드를 읽는다.
- code:
```python
from pathlib import Path

path = Path("data/items.json").resolve()
print(path)
```
- question: resolve()는 무엇에 가까운가?
- answer: 절대경로로 바꾼다
- explanation: resolve()는 현재 작업 디렉터리를 기준으로 경로를 절대경로로 만들고, .. 요소와 가능한 심볼릭 링크를 해석한다. 기본 strict=False에서는 경로가 존재하지 않아도 해석할 수 있는 데까지 처리하므로, 결과가 나왔다고 파일 존재까지 확인된 것은 아니다. 실제 존재 여부는 exists() 같은 별도 검사로 확인해야 한다.
- project_context: 작업 폴더가 바뀌어 경로가 꼬이는 문제를 추적할 때 중요하다.

## PY4_L06_tsv_dictreader_001
- level: 6
- file: python_deep_expansion_v4.json
- title: TSV DictReader 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","csv","tsv","DictReader"]
- reading_goal: 탭으로 구분된 TSV 파일을 dict row로 읽는 코드를 읽는다.
- code:
```python
import csv

with open("items.tsv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        print(row["title"])
```
- question: delimiter='\t'는 무엇을 뜻하는가?
- answer: 탭으로 컬럼을 구분한다
- explanation: TSV는 탭으로 컬럼을 구분하는 텍스트 표 형식이다. DictReader에 탭 구분자를 지정하면 각 행을 컬럼명 기반 dict처럼 읽을 수 있다. 컬럼명이 header에서 오므로 이후 코드에서는 row['id']처럼 이름으로 값을 꺼낼 수 있다.
- project_context: 라벨링 결과, 리뷰 TSV, 매핑표를 읽을 때 자주 쓴다.

## PY103_L06_shell_kind_001
- level: 6
- file: python_dev_environment_foundation_v103_a1.json
- title: PowerShell과 Bash 구분하기
- question_type: meaning_choice
- concepts: ["shell","powershell","bash"]
- reading_goal: 현재 명령이 어느 shell 문법인지 구분한다.
- code:
```python
.\.venv\Scripts\Activate.ps1
source .venv/bin/activate
```
- question: 두 줄의 가장 큰 차이는?
- answer: 첫 줄은 PowerShell 쪽, 둘째 줄은 Bash 쪽 활성화 명령이다
- explanation: 같은 가상환경 활성화라도 PowerShell과 Bash는 명령 문법이 다르다. Windows PowerShell에서는 .venv 아래 Scripts 폴더의 Activate.ps1을 실행하고, Ubuntu Bash에서는 source로 bin/activate를 읽는다. 명령이 실패하면 Python 코드보다 먼저 현재 shell이 무엇인지 확인해야 한다. 다른 환경의 명령을 그대로 붙여 넣으면 경로와 실행 방식이 맞지 않을 수 있다.
- project_context: Windows와 Ubuntu 서버를 오가며 작업할 때 필요한 기초다.

## PY103_L06_terminal_command_parts_001
- level: 6
- file: python_dev_environment_foundation_v103_a1.json
- title: 터미널 명령 구조 읽기
- question_type: meaning_choice
- concepts: ["terminal","command","option","argument"]
- reading_goal: 명령어를 실행 프로그램, 옵션, 인자로 나누어 읽는다.
- code:
```python
python tools/validate_lessons.py --expected-app-version 20260602_v103_a1
```
- question: 이 명령에서 tools/validate_lessons.py는 어떤 역할에 가장 가까운가?
- answer: 실행할 Python 스크립트 경로
- explanation: 터미널 명령은 실행 프로그램, 대상, 옵션 이름과 옵션 값으로 나누어 읽는다. 여기서는 python이 실행 프로그램이고 tools/validate_lessons.py가 실행할 스크립트다. --expected-app-version은 옵션 이름이며 바로 뒤의 20260602_v103_a1은 그 옵션에 전달하는 값이다. 이렇게 구분하면 실패 원인이 Python, 경로, 옵션 이름, 옵션 값 중 어디에 있는지 좁히기 쉽다.
- project_context: 검증 명령을 반복해서 실행할 때 명령 구조를 이해하기 위한 기본 카드다.

## PY103_L06_ubuntu_linux_role_001
- level: 6
- file: python_dev_environment_foundation_v103_a1.json
- title: Ubuntu와 Linux 역할 읽기
- question_type: meaning_choice
- concepts: ["ubuntu","linux","server"]
- reading_goal: Ubuntu가 Python 언어가 아니라 실행 환경이라는 점을 이해한다.
- code:
```python
Ubuntu 22.04
sudo apt update
python3 --version
```
- question: Ubuntu는 여기서 무엇에 가장 가까운가?
- answer: Python 코드를 실행하는 운영체제 환경
- explanation: Ubuntu는 Linux 배포판이며 Python 코드를 실행하는 서버 환경으로 자주 쓰인다. Python 자체와 Ubuntu를 구분해야 설치 문제를 정확히 읽을 수 있다. apt는 Ubuntu 시스템 패키지 관리 도구이고, python3는 그 환경 위에서 실행되는 언어다. GPU 서버나 WSL을 다룰 때는 운영체제 명령과 Python 명령을 분리해서 보는 습관이 중요하다.
- project_context: GPU 서버, WSL, GitHub Actions 로그에서 Ubuntu를 자주 만난다.

## PY103_L06_working_directory_001
- level: 6
- file: python_dev_environment_foundation_v103_a1.json
- title: 현재 작업 폴더 확인 명령 읽기
- question_type: meaning_choice
- concepts: ["working_directory","pwd","Get-Location"]
- reading_goal: 상대경로가 해석되는 기준 폴더를 확인한다.
- code:
```python
Get-Location
pwd
```
- question: 이 두 명령이 공통으로 확인하는 것은?
- answer: 현재 작업 폴더
- explanation: 상대경로는 현재 작업 폴더를 기준으로 해석된다. PowerShell에서는 Get-Location, Bash에서는 pwd로 현재 위치를 확인한다. 같은 .\data\lessons 경로라도 어느 폴더에서 실행했는지에 따라 다른 위치를 가리킬 수 있다. FileNotFoundError나 JSON 로딩 실패가 났을 때는 코드를 고치기 전에 작업 폴더부터 확인하는 것이 안전하다.
- project_context: 프로젝트 루트에서 검증과 패치를 실행하는 이유와 연결된다.

## PY113_L06_CUDA_GPU_001
- level: 6
- file: python_dev_environment_practical_v113_a1.json
- title: CUDA와 GPU 확인
- question_type: multiple_choice
- concepts: ["print","cuda","gpu","pytorch","torch"]
- reading_goal: CUDA가 NVIDIA GPU 계산과 연결되며 PyTorch에서 사용 가능 여부를 확인할 수 있음을 읽는다.
- code:
```python
python -c "import torch; print(torch.cuda.is_available())"
```
- question: 이 명령이 확인하려는 것은?
- answer: PyTorch가 CUDA GPU를 쓸 수 있는지 본다
- explanation: torch.cuda.is_available()은 PyTorch에서 CUDA GPU를 쓸 수 있는지 확인한다. AI 작업에서 GPU 사용 가능 여부를 점검할 때 자주 쓴다.
- project_context: LoRA나 모델 추론을 GPU로 돌릴 때 먼저 확인하는 기본 점검이다.

## PY113_L06_NVIDIA_SMI_001
- level: 6
- file: python_dev_environment_practical_v113_a1.json
- title: nvidia-smi 출력 읽기
- question_type: multiple_choice
- concepts: ["nvidia-smi","gpu","cuda","driver"]
- reading_goal: nvidia-smi가 GPU 인식, 드라이버 상태, 메모리 사용량을 확인하는 명령임을 읽는다.
- code:
```python
nvidia-smi
GPU  Name        Memory-Usage
0    RTX 4060    1024MiB / 8192MiB
```
- question: 이 출력에서 확인할 수 있는 것은?
- answer: GPU 인식과 메모리 사용량을 본다
- explanation: nvidia-smi는 NVIDIA GPU와 드라이버 상태, 메모리 사용량 등을 확인할 때 자주 쓴다. GPU가 인식되는지 보는 기본 명령이다.
- project_context: GPU 서버나 로컬 노트북에서 모델 작업 전에 자주 확인하는 명령이다.

## PY113_L06_PERMISSION_DENIED_001
- level: 6
- file: python_dev_environment_practical_v113_a1.json
- title: Permission denied 읽기
- question_type: multiple_choice
- concepts: ["permission","sudo","chmod","linux"]
- reading_goal: 권한 오류를 sudo로만 해결하지 말고 원인부터 확인해야 한다는 점을 읽는다.
- code:
```python
Permission denied
chmod +x run.sh
./run.sh
```
- question: 가장 안전한 접근은?
- answer: 권한 원인을 확인하고 필요한 경우만 조정
- explanation: 권한 오류는 실행 권한, 파일 소유자, 시스템 권한 등 원인이 다를 수 있다. 먼저 원인을 확인하고 필요한 경우만 조정해야 한다.
- project_context: 서버 스크립트를 실행할 때 chmod와 sudo의 차이를 이해하는 데 필요하다.

## PY130_L06_CONFIG_VS_SECRET_001
- level: 6
- file: python_env_secret_config_beginner_v130_a1.json
- title: 설정값과 비밀값 구분하기
- question_type: multiple_choice
- concepts: ["config","secret","API key","environment variable"]
- reading_goal: 일반 설정값과 외부에 노출되면 안 되는 비밀값을 실제 예시로 구분한다.
- code:
```python
APP_MODE=dev
LOG_LEVEL=INFO
OPENAI_API_KEY=...
PAGE_SIZE=20
```
- question: 다음 중 비밀값으로 다루는 것이 가장 알맞은 것은?
- answer: OPENAI_API_KEY
- explanation: APP_MODE, PAGE_SIZE, LOG_LEVEL은 공개되어도 큰 문제가 없는 설정값일 수 있다. 반면 API Key는 비용과 권한이 연결될 수 있어 비밀값으로 다뤄야 한다. 따라서 정답은 ‘OPENAI_API_KEY’이다.
- project_context: 

## PY130_L06_REQUIRED_ENV_CLI_FLOW_001
- level: 6
- file: python_env_secret_config_beginner_v130_a1.json
- title: 필수 환경변수 검사 흐름
- question_type: multiple_choice
- concepts: ["if","required env var","SystemExit","API key","CLI startup"]
- reading_goal: 필수 환경변수를 실행 초기에 검사하고 누락 시 안전하게 멈추는 흐름을 이해한다.
- code:
```python
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    raise SystemExit('OPENAI_API_KEY를 설정하세요')
run_client(api_key)
```
- question: CLI 실행 전에 필수 API Key 환경변수를 검사하는 흐름으로 가장 알맞은 것은?
- answer: 필수 환경변수가 없으면 쉬운 메시지로 멈춘다
- explanation: 필수 환경변수가 없는데 계속 실행하면 나중에 더 헷갈리는 오류가 날 수 있다. 시작 단계에서 확인하고 쉬운 메시지로 멈추는 편이 안전하다.
- project_context: 

## PY59_L06_load_failed_001
- level: 6
- file: python_error_recovery_retry_ux_v59.json
- title: load failed 읽기
- question_type: meaning_choice
- concepts: ["load_failed","error_recovery","UX"]
- reading_goal: 데이터 로딩 실패를 사용자에게 명확히 알려주는 방식을 이해한다.
- code:
```python
if (!response.ok) {
  showError('카드를 불러오지 못했습니다')
}
```
- question: load failed 메시지의 목적은?
- answer: 데이터를 불러오지 못한 상황을 사용자에게 알려주기 위해
- explanation: load failed는 앱이 필요한 데이터나 파일을 불러오지 못한 상태다. 빈 화면만 보이면 사용자는 로딩 중인지 실패했는지 구분하기 어렵다. 원인을 확실히 알 수 없을 때는 추측하지 말고, 이해하기 쉬운 실패 안내와 다시 시도 같은 다음 행동을 보여 줘야 한다. 내부 경로나 오류 상세는 사용자 메시지에 노출하지 않는다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L06_retry_button_001
- level: 6
- file: python_error_recovery_retry_ux_v59.json
- title: retry button 읽기
- question_type: meaning_choice
- concepts: ["retry_button","error_recovery","UX"]
- reading_goal: 실패한 작업을 사용자가 다시 시도할 수 있게 하는 retry button을 이해한다.
- code:
```python
<button onclick="loadCards()">다시 시도</button>
```
- question: retry button의 역할은?
- answer: 실패한 작업을 사용자가 다시 실행할 수 있게 한다
- explanation: retry button은 실패한 로딩이나 요청을 사용자가 다시 시도하게 한다. 다만 결제나 중복 저장처럼 반복 실행 시 결과가 달라지는 작업은 그대로 재전송하면 안 된다. 일시적이고 안전하게 반복 가능한 작업인지 확인하고, 처리 중에는 버튼을 비활성화하거나 같은 요청을 합쳐 중복 실행을 막는다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY117_L06_BARE_EXCEPT_RISK_001
- level: 6
- file: python_exception_traceback_beginner_v117_a1.json
- title: bare except 위험
- question_type: multiple_choice
- concepts: ["try_except","bare except","debugging","exception handling"]
- reading_goal: except:처럼 모든 예외를 잡으면 실제 버그가 숨겨질 수 있음을 읽는다.
- code:
```python
try:
    result = data['score'] / count
except:
    result = 0
```
- question: 이 코드에서 except:가 위험할 수 있는 이유는?
- answer: 모든 예외를 잡아 원인을 숨길 수 있기 때문에
- explanation: bare except는 KeyError나 ZeroDivisionError뿐 아니라 KeyboardInterrupt와 SystemExit까지 잡아 정상적인 중단과 예상하지 못한 버그를 숨길 수 있다. 처리할 수 있는 구체적인 예외만 좁게 잡고, 나머지는 traceback이 보이게 두는 편이 안전하다.
- project_context: 에러를 없애는 것과 원인을 숨기는 것을 구분하는 연습이다.

## PY117_L06_DONT_SWALLOW_ERRORS_001
- level: 6
- file: python_exception_traceback_beginner_v117_a1.json
- title: 에러를 삼키지 않기
- question_type: multiple_choice
- concepts: ["try_except","print","raise","logging","except","debugging"]
- reading_goal: except에서 실패 이유를 기록하지 않고 넘어가면 나중에 원인 추적이 어려워짐을 읽는다.
- code:
```python
try:
    save_result(data)
except ValueError as e:
    print('save failed:', e)
    raise
```
- question: print 후 raise를 다시 하는 이유로 알맞은 것은?
- answer: 에러 내용을 남기고 다시 위로 알리기 위해
- explanation: 에러를 로그로 남긴 뒤 raise로 다시 알리면 원인 추적이 쉬워진다. 조용히 실패를 숨기는 것보다 디버깅에 안전하다. 나중에 같은 실패가 반복될 때 위치를 다시 찾기 쉽다.
- project_context: 실전 저장/검증 코드에서 실패를 숨기지 않고 추적 가능하게 만드는 방식이다.

## PY117_L06_SPECIFIC_EXCEPT_001
- level: 6
- file: python_exception_traceback_beginner_v117_a1.json
- title: 구체적인 except 쓰기
- question_type: multiple_choice
- concepts: ["try_except","except","ValueError","specific exception"]
- reading_goal: except ValueError처럼 예상한 예외를 구체적으로 잡는 이유를 읽는다.
- code:
```python
try:
    age = int(text)
except ValueError:
    age = 0
```
- question: except ValueError라고 구체적으로 적는 장점은?
- answer: 예상한 값 변환 실패만 따로 처리하기 쉽다
- explanation: 구체적인 except는 내가 예상한 실패를 분리해서 처리하게 해 준다. 너무 넓은 except는 다른 버그까지 숨길 수 있다. 따라서 정답은 ‘예상한 값 변환 실패만 따로 처리하기 쉽다’이다.
- project_context: 입력 변환이나 파싱 코드에서 안전하게 예외를 처리하는 기준이 된다.

## PY128_L06_SAFE_LOAD_DATA_FLOW_001
- level: 6
- file: python_file_cli_error_recovery_v128_a1.json
- title: 안전한 load_data 흐름
- question_type: multiple_choice
- concepts: ["if","def","function","return","load_data","input validation","suffix dispatch","error recovery"]
- reading_goal: 파일 존재 확인, 확장자 분기, 구체적 오류 메시지가 안전한 CLI 흐름을 만든다는 점을 이해한다.
- code:
```python
def load_data(input_path):
    if not input_path.exists():
        raise SystemExit('입력 파일이 없습니다')
    if input_path.suffix == '.json':
        return load_json(input_path)
    if input_path.suffix == '.csv':
        return load_csv(input_path)
    raise SystemExit('지원하지 않는 파일 형식입니다')
```
- question: JSON/CSV CLI에서 load_data(input_path)를 안전하게 만들 때 가장 알맞은 흐름은?
- answer: 존재 확인, 확장자 분기, 구체적 오류 안내
- explanation: 이 함수는 존재 여부와 마지막 확장자를 확인해 로더를 고르고, 지원하지 않는 확장자는 종료한다. 다만 load_json/load_csv의 파싱 실패를 이 코드 자체가 처리하지는 않으므로 각 로더나 호출부에서 구체적인 예외를 쉬운 메시지로 바꿔야 한다.
- project_context: 

## PY128_L06_SPECIFIC_EXCEPT_FIRST_001
- level: 6
- file: python_file_cli_error_recovery_v128_a1.json
- title: 구체적인 except 먼저 쓰기
- question_type: multiple_choice
- concepts: ["try_except","specific exception","bare except","debugging","CLI UX"]
- reading_goal: 구체적인 예외를 잡는 것이 오류 원인 안내와 디버깅에 더 안전하다는 점을 이해한다.
- code:
```python
try:
    data = json.loads(text)
except json.JSONDecodeError:
    raise SystemExit('JSON 형식 오류')
```
- question: 파일 처리 CLI에서 bare except보다 구체적인 except를 우선 쓰는 이유로 알맞은 것은?
- answer: 어떤 실패인지 구분해 알리기 위해
- explanation: 구체적인 except를 쓰면 JSON 형식 오류, 파일 없음, 컬럼 없음처럼 실패 원인을 나누어 안내할 수 있다. bare except는 중요한 버그까지 숨길 수 있다. 따라서 정답은 ‘어떤 실패인지 구분해 알리기 위해’이다.
- project_context: 

## PY128_L06_SYSTEM_EXIT_MESSAGE_001
- level: 6
- file: python_file_cli_error_recovery_v128_a1.json
- title: SystemExit로 쉬운 오류 메시지 만들기
- question_type: multiple_choice
- concepts: ["if","SystemExit","friendly error","CLI","validation"]
- reading_goal: SystemExit 메시지가 traceback보다 사용자 친화적인 종료 방식을 제공함을 이해한다.
- code:
```python
if not input_path.exists():
    raise SystemExit(f'입력 파일이 없습니다: {input_path}')
```
- question: CLI 도구에서 raise SystemExit('입력 파일이 없습니다')처럼 쓰는 주된 이유는?
- answer: 사용자에게 쉬운 메시지를 보여 주고 종료하기 위해
- explanation: SystemExit에 메시지를 넣으면 CLI가 실패했을 때 사용자가 이해하기 쉬운 안내를 보여 주고 종료할 수 있다. 초보자용 도구에서는 특히 중요하다.
- project_context:
