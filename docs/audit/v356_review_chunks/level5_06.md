# V356 semantic review — Level 5 chunk 6

Cards 101-110 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY121_L05_PARAMS_QUERY_001
- level: 5
- file: python_requests_api_beginner_v121_a1.json
- title: params로 query parameter 보내기
- question_type: multiple_choice
- concepts: ["params","query parameter","requests.get"]
- reading_goal: GET 요청에서 params 딕셔너리가 URL 쿼리 파라미터를 안전하게 붙이는 방법임을 읽는다.
- code:
```python
response = requests.get(url, params={'q': 'python'}, timeout=10)
```
- question: params={'q': 'python'}의 역할로 알맞은 것은?
- answer: URL 쿼리 파라미터를 함께 보낸다
- explanation: params는 GET 요청의 검색 조건이나 필터 값을 URL 쿼리로 보낼 때 쓴다. 직접 문자열을 붙이는 실수를 줄일 수 있다.
- project_context: 검색 API나 목록 API를 호출할 때 조건 값을 안전하게 넘기는 카드다.

## PY121_L05_RAISE_FOR_STATUS_001
- level: 5
- file: python_requests_api_beginner_v121_a1.json
- title: raise_for_status 읽기
- question_type: multiple_choice
- concepts: ["raise_for_status","HTTPError","status_code"]
- reading_goal: raise_for_status()가 실패 HTTP 상태 코드를 예외로 드러내는 역할임을 읽는다.
- code:
```python
response = requests.get(url, timeout=10)
response.raise_for_status()
```
- question: response.raise_for_status()의 역할로 알맞은 것은?
- answer: 실패 상태 코드를 예외로 드러낸다
- explanation: raise_for_status()는 404, 500 같은 실패 상태가 왔을 때 예외를 발생시킨다. 실패를 성공처럼 넘기지 않게 해 준다.
- project_context: API 응답 객체가 왔다고 항상 성공은 아니라는 점을 익히는 카드다.

## PY121_L05_REQUEST_EXCEPTION_001
- level: 5
- file: python_requests_api_beginner_v121_a1.json
- title: RequestException 처리 읽기
- question_type: multiple_choice
- concepts: ["try_except","print","RequestException","requests","try except"]
- reading_goal: requests.RequestException이 요청 과정의 네트워크 오류와 timeout 오류를 묶어 처리하는 데 쓰임을 읽는다.
- code:
```python
try:
    response = requests.get(url, timeout=10)
except requests.RequestException as e:
    print('request failed:', e)
```
- question: except requests.RequestException은 주로 무엇을 처리하는가?
- answer: 요청 중 requests가 발생시키는 예외들의 공통 처리
- explanation: RequestException은 ConnectionError와 Timeout 같은 연결 문제의 공통 기반이며, raise_for_status()가 만든 HTTPError도 포함한다. 단, 예상한 오류를 구분해 다른 대응을 해야 한다면 더 구체적인 예외를 먼저 잡는다.
- project_context: API 요청 실패를 프로그램 전체 실패로 만들지 않고 분리 처리하는 카드다.

## PY121_L05_TIMEOUT_OPTION_001
- level: 5
- file: python_requests_api_beginner_v121_a1.json
- title: requests timeout 옵션 읽기
- question_type: multiple_choice
- concepts: ["timeout","requests.get","network"]
- reading_goal: requests.get에서 timeout 옵션이 응답을 무한히 기다리지 않게 하는 안전장치임을 읽는다.
- code:
```python
response = requests.get(url, timeout=10)
```
- question: timeout=10의 의미로 알맞은 것은?
- answer: 응답을 기다리는 시간을 제한한다
- explanation: Requests의 timeout=10은 전체 다운로드가 반드시 10초 안에 끝난다는 뜻이 아니다. 연결하거나 응답 바이트를 기다리는 동안 지정 시간 이상 진전이 없으면 Timeout을 내어 무기한 대기를 막는다. 연결·읽기 제한을 다르게 두려면 튜플을 쓸 수 있다.
- project_context: API 호출이 멈춘 것처럼 보일 때 timeout을 넣어 안전하게 만드는 카드다.

## PY131_L05_INSTALL_VS_IMPORT_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: 설치와 import 차이
- question_type: multiple_choice
- concepts: ["pip install","import","package","module"]
- reading_goal: 패키지를 설치하는 단계와 코드에서 import하는 단계가 다르다는 점을 이해한다.
- code:
```python
python -m pip install requests

import requests
```
- question: 패키지를 설치하는 것과 import하는 것의 차이로 알맞은 것은?
- answer: 설치는 환경에 패키지를 추가하고, import는 코드에서 불러오는 것이다
- explanation: pip install은 현재 환경에 패키지를 설치하는 작업이고, import는 이미 설치되어 있거나 기본 제공되는 모듈을 코드에서 불러오는 작업이다.
- project_context: 

## PY131_L05_PIP_FREEZE_MEANING_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: pip freeze 의미
- question_type: multiple_choice
- concepts: ["comment","pip freeze","installed packages","package version","requirements"]
- reading_goal: pip freeze가 현재 환경의 설치 패키지 목록을 보여 주며 정리에는 주의가 필요함을 이해한다.
- code:
```python
python -m pip freeze
# requests==2.32.3
# python-dotenv==1.0.1
```
- question: pip freeze 명령의 출력이 뜻하는 것으로 알맞은 것은?
- answer: 현재 Python 환경에 설치된 패키지와 버전 목록
- explanation: pip freeze는 현재 환경에 설치된 패키지와 버전을 보여 준다. 다만 불필요한 패키지까지 섞일 수 있어 requirements 정리에는 주의가 필요하다.
- project_context: 

## PY131_L05_PIP_INSTALL_REQUIREMENTS_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: requirements 설치 명령
- question_type: multiple_choice
- concepts: ["pip install","-r","requirements.txt","python -m pip"]
- reading_goal: requirements.txt를 기준으로 패키지를 한 번에 설치하는 명령을 이해한다.
- code:
```python
python -m pip install -r requirements.txt
```
- question: requirements.txt에 적힌 패키지를 한 번에 설치하는 명령으로 알맞은 것은?
- answer: python -m pip install -r requirements.txt
- explanation: pip install -r requirements.txt는 파일에 적힌 패키지를 읽어 설치한다. python -m pip 형태는 현재 Python 환경의 pip를 쓰게 해 준다.
- project_context: 

## PY131_L05_PYTHON_M_PIP_REASON_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: python -m pip 이유
- question_type: multiple_choice
- concepts: ["python -m pip","pip","Python environment","venv"]
- reading_goal: python -m pip가 현재 Python 환경과 pip를 맞추는 데 도움이 됨을 이해한다.
- code:
```python
python -m pip install requests
```
- question: pip install 대신 python -m pip install 형태를 권장하는 이유로 알맞은 것은?
- answer: 현재 실행하는 Python 환경의 pip를 쓰기 위해
- explanation: 컴퓨터에 Python이 여러 개 있으면 pip가 어느 환경에 설치하는지 헷갈릴 수 있다. python -m pip는 현재 Python에 연결된 pip를 실행한다.
- project_context: 

## PY131_L05_REQUIREMENTS_TXT_ROLE_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: requirements.txt 역할
- question_type: multiple_choice
- concepts: ["comment","requirements.txt","dependency","package","reproducible environment"]
- reading_goal: requirements.txt가 프로젝트 의존성 목록을 기록해 실행환경 재현을 돕는 파일임을 이해한다.
- code:
```python
# requirements.txt
requests==2.32.3
python-dotenv==1.0.1
```
- question: requirements.txt 파일의 대표적인 역할로 가장 알맞은 것은?
- answer: 프로젝트에 필요한 외부 패키지 목록을 적어 두는 것
- explanation: requirements.txt는 pip가 설치할 외부 패키지 요구사항을 적는 입력 파일이다. 버전 범위만 적으면 다른 시점에 다른 버전이 설치될 수 있으므로, 이것만으로 완전한 재현성을 자동 보장하지는 않는다.
- project_context: 

## PY131_L05_VERSION_PINNING_001
- level: 5
- file: python_requirements_dependency_repro_v131_a1.json
- title: 버전 고정 이해하기
- question_type: multiple_choice
- concepts: ["comment","version pinning","==","package version","dependency"]
- reading_goal: 패키지 버전 고정이 실행환경 차이를 줄이는 데 도움이 됨을 이해한다.
- code:
```python
# requirements.txt
requests==2.32.3
```
- question: requirements.txt에서 requests==2.32.3처럼 쓰는 의미로 알맞은 것은?
- answer: requests 패키지를 특정 버전으로 맞춘다
- explanation: ==는 requests 2.32.3이라는 정확한 버전을 요구한다. 직접 의존성 하나를 고정하면 차이를 줄이지만, Python 버전·운영체제·간접 의존성까지 같다는 보장은 없으므로 더 강한 재현에는 잠금 파일이나 해시와 실행 환경 기록이 필요하다.
- project_context:
