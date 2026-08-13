# V356 semantic review — Level 4 chunk 1

Cards 1-20 of 97.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L04_for_if_001
- level: 4
- file: cards_seed_v1.json
- title: for와 if로 원하는 항목 고르기
- question_type: output_prediction
- concepts: ["print","for","if","append","dict","list"]
- reading_goal: 반복문과 조건문으로 Sensor 노드만 고르는 흐름을 읽는다.
- code:
```python
nodes = [
    {"label": "LiDAR", "kind": "Sensor"},
    {"label": "UAM", "kind": "System"},
    {"label": "Radar", "kind": "Sensor"}
]

selected = []

for node in nodes:
    if node["kind"] == "Sensor":
        selected.append(node["label"])

print(selected)
```
- question: selected에는 최종적으로 무엇이 들어갈까?
- answer: ['LiDAR', 'Radar']가 남는다
- explanation: for는 여러 항목을 하나씩 꺼내고, if는 그중 조건에 맞는 항목만 골라 처리한다. 이 예제에서는 kind가 Sensor인 LiDAR와 Radar의 label만 selected에 추가된다. 반복문 안에서 dict의 어떤 key를 확인하는지, 조건을 통과한 뒤 어떤 값을 append하는지 순서대로 봐야 한다. 최종 리스트는 모든 항목이 아니라 조건을 통과한 항목만 모은 결과다.
- project_context: 노드 후보 중 특정 종류만 골라낼 때 자주 나오는 흐름이다.

## PY125_L04_ARGPARSE_WHY_001
- level: 4
- file: python_argparse_cli_beginner_v125_a1.json
- title: argparse를 쓰는 이유
- question_type: multiple_choice
- concepts: ["import","argparse","sys.argv","CLI options","help message"]
- reading_goal: argparse를 쓰는 이유를 sys.argv 직접 처리와 비교해 설명할 수 있다.
- code:
```python
import argparse

parser = argparse.ArgumentParser(description='작은 CLI 도구')
parser.add_argument('--input', help='입력 파일 경로')
```
- question: sys.argv를 직접 다루는 대신 argparse를 쓰는 가장 큰 이유로 알맞은 것은?
- answer: 옵션 이름과 도움말이 있는 실행 인자를 읽기 위해
- explanation: argparse는 옵션 이름, 도움말, 타입, 기본값과 오류 메시지를 함께 정의하고 -h/--help도 만들어 준다. 다만 parser.add_argument('--input')만 쓰면 선택 옵션이라 생략 시 None이므로, 필수 입력이면 required=True 또는 위치 인자로 선언한다.
- project_context: 

## PY125_L04_SYS_ARGV_BASIC_001
- level: 4
- file: python_argparse_cli_beginner_v125_a1.json
- title: sys.argv로 실행 인자 읽기
- question_type: multiple_choice
- concepts: ["comment","import","print","sys.argv","CLI","command line arguments","script execution"]
- reading_goal: sys.argv가 터미널 실행 인자를 어떤 리스트로 보여 주는지 읽을 수 있다.
- code:
```python
import sys

print(sys.argv)
# 예: python tool.py data.csv
# 결과 예: ['tool.py', 'data.csv']
```
- question: 다음 코드에서 sys.argv가 의미하는 것은 무엇인가?

import sys
print(sys.argv)
- answer: 실행할 때 함께 넘긴 인자 목록을 담은 리스트
- explanation: sys.argv는 프로그램을 실행할 때 함께 들어온 인자를 리스트로 보여 준다. 첫 번째 값은 보통 실행한 파일 이름이고, 그 뒤에 사용자가 넘긴 값들이 들어온다.
- project_context: 

## PY3_L04_set_dedup_001
- level: 4
- file: python_broad_expansion_v3.json
- title: set으로 중복 제거하기
- question_type: output_prediction
- concepts: ["if","print","continue","set","dedup","for"]
- reading_goal: 이미 본 값을 set에 저장해 중복을 건너뛰는 코드를 읽는다.
- code:
```python
labels = ["LiDAR", "Radar", "LiDAR"]
seen = set()
unique = []

for label in labels:
    if label in seen:
        continue
    seen.add(label)
    unique.append(label)

print(unique)
```
- question: 출력은?
- answer: ['LiDAR', 'Radar']만 남는다
- explanation: seen set은 이미 본 값을 빠르게 확인하는 용도이고, unique 리스트는 처음 등장한 순서대로 결과를 보관한다. 첫 LiDAR와 Radar는 둘 다 추가되지만 두 번째 LiDAR는 seen에 있어 continue로 건너뛴다. 따라서 ['LiDAR', 'Radar']만 남는다. set 자체의 반복 순서가 원본 순서를 보장하는 것은 아니며, 이 예제의 순서는 labels를 앞에서부터 읽어 unique에 append하기 때문에 유지된다.
- project_context: 노드 후보, URL, 문서 중복 제거의 기본 패턴이다.

## PY3_L04_sort_key_001
- level: 4
- file: python_broad_expansion_v3.json
- title: sorted key 함수 읽기
- question_type: output_prediction
- concepts: ["print","sorted","lambda","dict"]
- reading_goal: dict 리스트를 특정 필드 기준으로 정렬하는 코드를 읽는다.
- code:
```python
rows = [
    {"label": "A", "score": 0.7},
    {"label": "B", "score": 0.9}
]
ranked = sorted(rows, key=lambda row: row["score"], reverse=True)
print(ranked[0]["label"])
```
- question: 출력은?
- answer: B
- explanation: sorted의 key는 각 항목에서 정렬 기준값을 꺼내는 함수다. lambda가 score를 반환하고 reverse=True가 큰 값을 앞으로 보내므로 0.9인 B가 먼저 온다. sorted는 새 리스트 ranked를 만들며 원본 rows의 순서를 직접 바꾸지 않는다. 따라서 ranked[0]['label']은 B다.
- project_context: 검색 결과, 큐레이션 후보, 모델 점수 정렬에 자주 나온다.

## PY_L04_continue_001
- level: 4
- file: python_core_expansion_v1.json
- title: continue로 이번 반복 건너뛰기
- question_type: output_prediction
- concepts: ["print","continue","for","if"]
- reading_goal: continue가 현재 항목 처리를 건너뛰고 다음 반복으로 넘어가는 코드임을 읽는다.
- code:
```python
items = ["", "LiDAR", "Radar"]

for item in items:
    if not item:
        continue
    print(item)
```
- question: 이 코드가 출력하는 것은?
- answer: LiDAR, Radar
- explanation: 첫 항목은 빈 문자열이므로 not item이 True가 되고 continue가 실행된다. continue는 현재 반복의 남은 코드인 print를 건너뛰고 다음 항목으로 이동한다. LiDAR와 Radar에서는 조건이 False여서 각각 출력되므로 결과는 LiDAR, Radar이다.
- project_context: 비어 있는 줄이나 잘못된 데이터를 건너뛸 때 자주 쓴다.

## PY_L04_enumerate_001
- level: 4
- file: python_core_expansion_v1.json
- title: enumerate로 번호와 값 함께 읽기
- question_type: meaning_choice
- concepts: ["print","enumerate","for","list"]
- reading_goal: enumerate(items)가 순번과 값을 함께 꺼내는 구조임을 읽는다.
- code:
```python
items = ["UAM", "ADAS"]

for i, item in enumerate(items):
    print(i, item)
```
- question: enumerate()는 반복문에서 무엇을 함께 제공하는가?
- answer: 순번과 값
- explanation: enumerate()는 각 항목의 인덱스와 값을 (인덱스, 값) 순서로 제공한다. 기본 시작 번호는 0이므로 i, item에는 차례로 (0, 'UAM')과 (1, 'ADAS')가 들어간다. 이 코드의 실제 출력은 0 UAM과 1 ADAS이고, 질문의 정답은 ‘순번과 값’이다.
- project_context: 카드 번호, 파일 순번, shard 번호를 붙일 때 유용하다.

## PY_L04_zip_001
- level: 4
- file: python_core_expansion_v1.json
- title: zip으로 두 리스트 묶기
- question_type: meaning_choice
- concepts: ["print","zip","for","list"]
- reading_goal: zip(a, b)가 두 리스트를 짝지어 반복하는 구조임을 읽는다.
- code:
```python
labels = ["LiDAR", "Radar"]
kinds = ["Sensor", "Sensor"]

for label, kind in zip(labels, kinds):
    print(label, kind)
```
- question: zip()은 여러 리스트를 어떻게 묶는가?
- answer: 두 리스트를 짝지어 반복한다
- explanation: zip()은 여러 반복 가능한 값에서 같은 위치의 항목끼리 묶는다. 이 코드에서는 ('LiDAR', 'Sensor')와 ('Radar', 'Sensor')가 차례로 만들어져 두 변수가 한 쌍씩 받는다. 입력 목록의 길이가 다르면 기본 zip은 가장 짧은 목록이 끝날 때 멈춘다. 따라서 질문의 정답은 ‘두 리스트를 짝지어 반복한다’이다.
- project_context: 두 컬럼이나 두 목록을 함께 비교할 때 쓰인다.

## PY120_L04_CSV_NEWLINE_WRITE_001
- level: 4
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: CSV 저장에서 newline 읽기
- question_type: multiple_choice
- concepts: ["CSV","newline","open"]
- reading_goal: CSV 파일을 쓸 때 newline=''를 함께 쓰는 패턴을 읽는다.
- code:
```python
with open('scores.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
```
- question: CSV 파일을 쓸 때 newline=''를 자주 함께 쓰는 이유는?
- answer: 빈 줄이 끼는 문제를 줄이기 위해
- explanation: 텍스트 파일을 newline=''로 열면 csv 모듈이 CSV 레코드의 줄바꿈을 직접 처리한다. 특히 Windows에서 텍스트 계층의 줄바꿈 변환과 csv.writer의 줄바꿈이 겹쳐 빈 줄이 생기는 문제를 피하는 표준 패턴이다.
- project_context: 윈도우에서 CSV 저장 시 빈 줄이 끼는 문제를 줄이는 기초 카드다.

## PY120_L04_CSV_WRITER_WRITEROW_001
- level: 4
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: csv.writer와 writerow 읽기
- question_type: multiple_choice
- concepts: ["import","csv.writer","writerow","CSV"]
- reading_goal: csv.writer가 한 행을 CSV 파일에 쓰고 writerow가 행 하나를 기록한다는 점을 읽는다.
- code:
```python
import csv

with open('scores.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['name', 'score'])
```
- question: writer.writerow(['name', 'score'])의 역할로 알맞은 것은?
- answer: 한 행씩 CSV 파일에 쓰기 위해
- explanation: writerow()는 CSV에 행 하나를 기록한다. 리스트의 각 값은 CSV의 한 칸에 들어가는 값으로 다뤄진다. 그래서 헤더 행과 데이터 행을 같은 방식으로 쓸 수 있다. 따라서 정답은 ‘한 행씩 CSV 파일에 쓰기 위해’이다.
- project_context: CSV 결과 파일을 직접 저장하는 초보 실전 카드다.

## PY123_L04_STRFTIME_FILENAME_001
- level: 4
- file: python_datetime_beginner_v123_a1.json
- title: strftime으로 날짜 파일명 만들기
- question_type: multiple_choice
- concepts: ["import","strftime","filename","date"]
- reading_goal: strftime('%Y%m%d')가 날짜를 파일명에 넣기 좋은 문자열로 바꾸는 패턴임을 읽는다.
- code:
```python
from datetime import date

stamp = date.today().strftime('%Y%m%d')
filename = f'backup_{stamp}.json'
```
- question: strftime('%Y%m%d')의 역할로 알맞은 것은?
- answer: 날짜를 원하는 문자열 형식으로 바꾸기 위해
- explanation: strftime('%Y%m%d')는 날짜를 20260603 같은 문자열로 바꾼다. 날짜가 들어간 백업 파일명이나 실행 로그 이름에 자주 쓴다.
- project_context: 날짜가 들어간 백업 파일명을 만드는 실전 패턴이다.

## PY123_L04_TODAY_NOW_BASIC_001
- level: 4
- file: python_datetime_beginner_v123_a1.json
- title: 오늘 날짜와 현재 시각 읽기
- question_type: multiple_choice
- concepts: ["import","date.today","datetime.now","datetime"]
- reading_goal: date.today()와 datetime.now()가 오늘 날짜와 현재 시각을 만드는 기본 함수임을 읽는다.
- code:
```python
from datetime import date, datetime

today = date.today()
now = datetime.now()
```
- question: date.today()와 datetime.now()를 쓰는 이유로 알맞은 것은?
- answer: 오늘 날짜나 현재 시각을 만들기 위해
- explanation: date.today()는 시스템의 로컬 날짜를, 인자 없는 datetime.now()는 시간대 정보가 없는 로컬 날짜·시각을 만든다. 한 컴퓨터 안의 파일명에는 편리하지만 여러 시간대를 오가는 기록에는 datetime.now(timezone.utc) 같은 aware datetime을 쓴다.
- project_context: 날짜 기반 파일명, 백업, 로그를 만들기 위한 첫 datetime 카드다.

## PY4_L04_all_001
- level: 4
- file: python_deep_expansion_v4.json
- title: all() 조건 읽기
- question_type: output_prediction
- concepts: ["print","all","condition","validation"]
- reading_goal: 여러 조건이 모두 참인지 확인하는 all() 코드를 읽는다.
- code:
```python
required = ["id", "title"]
row = {"id": "1", "title": "News"}
print(all(key in row for key in required))
```
- question: 출력은?
- answer: True
- explanation: all()은 생성된 조건이 모두 참일 때 True를 반환한다. id와 title이 둘 다 row의 key이므로 결과는 True다. 이 검사는 key의 존재만 확인하며 값이 빈 문자열인지까지 검증하지 않는다. 또한 required가 빈 목록이면 검사할 거짓 조건이 없어 all은 True를 반환하므로, 필수 필드 목록 자체가 올바른지도 따로 확인해야 한다.
- project_context: 필수 필드 검증, 스키마 점검 코드에서 자주 나온다.

## PY4_L04_any_001
- level: 4
- file: python_deep_expansion_v4.json
- title: any() 조건 읽기
- question_type: output_prediction
- concepts: ["if","print","any","condition","list"]
- reading_goal: 여러 조건 중 하나라도 참이면 참이 되는 코드를 읽는다.
- code:
```python
tags = ["robotics", "sensor"]
if any(tag == "sensor" for tag in tags):
    print("has sensor")
```
- question: 출력은?
- answer: has sensor
- explanation: any()는 여러 조건 중 하나라도 참이면 True를 반환한다. tags 안에 sensor가 하나라도 있으므로 전체 조건은 참이 된다. 반대로 모든 조건이 참이어야 하는 상황은 all()을 쓰므로 문제에서 하나라도인지 전부인지 확인해야 한다. 따라서 출력은 ‘has sensor’이다.
- project_context: 태그, 키워드, 위험 신호 중 하나라도 있는지 확인할 때 자주 쓴다.

## PY4_L04_list_copy_001
- level: 4
- file: python_deep_expansion_v4.json
- title: list 복사로 원본 보호
- question_type: output_prediction
- concepts: ["print","copy","list","mutable"]
- reading_goal: list(items)가 새 리스트를 만들어 원본 변경을 피하는 구조임을 읽는다.
- code:
```python
original = ["LiDAR"]
copy = list(original)
copy.append("Radar")
print(original)
```
- question: 출력은?
- answer: ["LiDAR"]
- explanation: list(original)은 원본과 다른 새 리스트를 만든다. 그래서 복사본의 바깥 리스트에 Radar를 append해도 original은 ['LiDAR'] 그대로다. 다만 이것은 얕은 복사라서 원소 안에 또 리스트나 dict가 있다면 그 중첩 객체는 공유될 수 있다. 이 코드가 호출한 것은 copy() 메서드가 아니라 list() 생성자라는 점도 구분해야 한다.
- project_context: 후보 목록을 임시 수정할 때 원본을 보존하는 데 필요하다.

## PY4_L04_mutable_alias_001
- level: 4
- file: python_deep_expansion_v4.json
- title: mutable alias 버그 읽기
- question_type: output_prediction
- concepts: ["print","mutable","list","alias"]
- reading_goal: 두 변수가 같은 리스트 객체를 가리킬 때 생기는 변화를 읽는다.
- code:
```python
a = ["LiDAR"]
b = a
b.append("Radar")
print(a)
```
- question: 출력은?
- answer: ["LiDAR", "Radar"]
- explanation: 리스트 같은 mutable 객체는 여러 변수가 같은 객체를 가리킬 수 있다. b와 a가 같은 리스트를 보므로 b를 바꾸면 a도 바뀐 것처럼 보인다. 원본을 독립적으로 유지하려면 copy나 list()로 새 리스트를 만든 뒤 수정해야 한다. 따라서 출력은 ‘["LiDAR", "Radar"]’이다.
- project_context: 리스트/딕트 공유 버그를 읽고 잡는 데 중요하다.

## PY107_A1_ENV_003_ACTIVATE_PIP
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: activate와 pip 위치 이해하기
- question_type: flow
- concepts: ["activate","pip","venv"]
- reading_goal: activate 후 pip를 써야 현재 가상환경에 설치된다는 흐름을 읽는다.
- code:
```python
.\.venv\Scripts\Activate.ps1
python -m pip install requests
```
- question: 가상환경을 만든 뒤 패키지를 그 환경에 설치하려면 보통 먼저 해야 할 일은?
- answer: 가상환경을 activate한다
- explanation: 가상환경을 만들기만 하면 현재 터미널이 자동으로 그 환경을 쓰는 것은 아니다. activate를 해야 그 터미널에서 실행하는 python과 pip가 해당 가상환경을 바라보게 된다. 그래서 설치 전에 현재 터미널이 어떤 Python을 쓰는지 확인하는 습관이 중요하다. 따라서 정답은 ‘가상환경을 activate한다’이다.
- project_context: 

## PY107_A1_ENV_004_REQUIREMENTS
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: requirements.txt 역할 읽기
- question_type: concept
- concepts: ["requirements.txt","pip","reproducibility"]
- reading_goal: requirements.txt가 패키지 설치 목록을 재현하는 파일임을 이해한다.
- code:
```python
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
```
- question: requirements.txt의 역할로 가장 알맞은 것은?
- answer: 필요한 패키지 목록을 저장해 환경을 다시 만들기 쉽게 한다
- explanation: requirements.txt는 설치할 Python 패키지와 선택적으로 버전 조건을 기록한다. 다른 환경에서 python -m pip install -r requirements.txt를 실행하면 비슷한 패키지 구성을 만들 수 있다. 같은 결과를 더 안정적으로 재현하려면 버전 고정뿐 아니라 Python 버전, 운영체제 의존 도구와 설치·검증 절차도 함께 기록해야 한다.
- project_context: 

## PY107_A1_ENV_005_UBUNTU_WSL
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: Ubuntu, WSL, 셸 구분하기
- question_type: concept
- concepts: ["ubuntu","wsl","shell"]
- reading_goal: PowerShell, Bash, Ubuntu, WSL의 실행 환경 차이를 구분한다.
- code:
```python
PowerShell: Set-Location D:\projects
Bash/Ubuntu: cd ~/projects
```
- question: 명령어를 따라 하기 전에 먼저 확인해야 할 것으로 가장 알맞은 것은?
- answer: PowerShell인지 Bash인지 현재 셸을 확인한다
- explanation: PowerShell과 Bash는 명령 문법이 다를 수 있다. 같은 가상환경 활성화도 Windows PowerShell과 Ubuntu/WSL Bash에서 명령이 다르므로, 먼저 현재 셸을 확인하는 습관이 중요하다. 명령어가 틀린 것이 아니라 실행하는 환경이 다른 경우도 많다.
- project_context: 

## PY107_A1_ENV_006_SUDO
- level: 4
- file: python_dev_environment_foundation_v103_a1.json
- title: sudo를 조심해서 읽기
- question_type: safety
- concepts: ["sudo","permission","admin"]
- reading_goal: sudo가 관리자 권한 실행이며 무조건 붙이면 안 된다는 점을 이해한다.
- code:
```python
sudo apt install git
python -m pip install requests
```
- question: sudo에 대한 설명으로 가장 알맞은 것은?
- answer: 관리자 권한으로 실행하겠다는 뜻이므로 필요할 때만 쓴다
- explanation: sudo는 관리자 권한으로 명령을 실행한다는 뜻이다. 시스템 패키지 설치에는 필요할 수 있지만, pip install에 습관적으로 붙이면 시스템 Python 환경을 더 복잡하게 만들 수 있다. 오류가 났을 때는 sudo부터 붙이기보다 권한, 경로, 가상환경을 나누어 확인해야 한다.
- project_context:
