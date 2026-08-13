# V356 semantic review — Level 5 chunk 1

Cards 1-20 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L05_function_chain_001
- level: 5
- file: cards_seed_v1.json
- title: 함수 호출 결과 따라가기
- question_type: output_prediction
- concepts: ["function","print","def","return","strip","lower"]
- reading_goal: 함수에 값이 들어가고 return으로 나온 값이 출력되는 흐름을 읽는다.
- code:
```python
def normalize_label(label):
    return label.strip().lower()

result = normalize_label("  LiDAR  ")
print(result)
```
- question: strip().lower()를 차례로 적용한 최종 출력은?
- answer: lidar
- explanation: strip()이 문자열 양쪽 공백을 먼저 제거하고, lower()가 남은 문자열을 소문자로 바꾸므로 정리된 소문자 값이 출력된다. 체인 형태에서는 왼쪽 메서드의 결과가 오른쪽 메서드의 입력이 된다고 순서대로 따라가면 된다. 따라서 출력은 ‘lidar’이다.
- project_context: label 정규화는 KG 중복 제거와 canonical 처리에서 중요하다.

## PY125_L05_ARGPARSE_TYPE_INT_001
- level: 5
- file: python_argparse_cli_beginner_v125_a1.json
- title: type=int로 숫자 인자 받기
- question_type: multiple_choice
- concepts: ["import","print","argparse","type=int","type conversion","command line input"]
- reading_goal: argparse의 type=int가 문자열 인자를 정수로 바꾸는 역할임을 이해한다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--count', type=int)
args = parser.parse_args()
print(args.count + 1)
```
- question: argparse에서 다음처럼 type=int를 붙이는 이유로 알맞은 것은?

parser.add_argument('--count', type=int)
- answer: 입력 문자열을 정수로 변환해서 받게 한다
- explanation: 터미널에서 들어오는 값은 기본적으로 문자열이다. type=int를 지정하면 argparse가 입력 문자열을 정수로 바꿔 주고, 변환 실패도 오류로 알려 준다.
- project_context: 

## PY125_L05_ARGUMENT_NAME_FLAG_001
- level: 5
- file: python_argparse_cli_beginner_v125_a1.json
- title: --input 옵션 읽기
- question_type: multiple_choice
- concepts: ["import","print","flag","option","argparse","args.input"]
- reading_goal: --input 같은 옵션 이름과 뒤에 오는 값의 관계를 읽을 수 있다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--input')
args = parser.parse_args()
print(args.input)
```
- question: 터미널에서 다음처럼 실행했다.

python tool.py --input data.csv

여기서 --input data.csv의 의미로 가장 알맞은 것은?
- answer: input이라는 이름의 옵션에 data.csv 값을 넘긴다
- explanation: --input data.csv처럼 쓰면 input이라는 옵션 이름에 data.csv 값을 넘긴다는 뜻이다. argparse를 쓰면 나중에 args.input처럼 이름으로 꺼낼 수 있다.
- project_context: 

## PY125_L05_DEFAULT_VALUE_001
- level: 5
- file: python_argparse_cli_beginner_v125_a1.json
- title: default 기본값 설정하기
- question_type: multiple_choice
- concepts: ["import","print","argparse","default","optional argument","CLI UX"]
- reading_goal: default가 옵션 생략 시 쓰는 기본값이라는 점을 CLI 흐름에서 읽을 수 있다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--output', default='result.json')
args = parser.parse_args()
print(args.output)
```
- question: argparse에서 default 값의 역할로 알맞은 것은?
- answer: 사용자가 옵션을 안 줬을 때 쓸 기본값
- explanation: default는 사용자가 옵션을 생략했을 때 대신 쓸 값이다. 기본값을 정해 두면 매번 모든 옵션을 입력하지 않아도 프로그램이 예측 가능하게 동작한다.
- project_context: 

## PY125_L05_PARSE_ARGS_RESULT_001
- level: 5
- file: python_argparse_cli_beginner_v125_a1.json
- title: parse_args 결과 읽기
- question_type: multiple_choice
- concepts: ["import","print","parse_args","args object","args.input","argparse"]
- reading_goal: parse_args() 이후 args.input처럼 옵션 값을 꺼내는 흐름을 읽을 수 있다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--input')
args = parser.parse_args()
print(args.input)
```
- question: 다음 코드에서 args.input은 무엇을 뜻하는가?

args = parser.parse_args()
print(args.input)
- answer: input 옵션으로 받은 값을 꺼내 읽는다
- explanation: parse_args()가 끝나면 옵션 값은 args 객체에 담긴다. --input으로 받은 값은 args.input처럼 이름으로 읽을 수 있어 코드가 훨씬 명확해진다.
- project_context: 

## PY3_L05_nested_dict_001
- level: 5
- file: python_broad_expansion_v3.json
- title: 중첩 dict 값 읽기
- question_type: output_prediction
- concepts: ["print","dict","nested","json"]
- reading_goal: 여러 단계로 들어간 JSON/dict 값을 따라 읽는다.
- code:
```python
item = {
    "source": {"name": "arXiv"},
    "meta": {"score": 0.92}
}
print(item["source"]["name"])
```
- question: 출력은?
- answer: arXiv
- explanation: 중첩 dict는 dict 안에 또 다른 dict가 들어 있는 구조다. source key로 안쪽 dict에 들어간 뒤 name 값을 꺼낸다. 중첩 구조는 바깥 key를 먼저 찾고 그 결과 dict에서 다시 안쪽 key를 찾는 순서로 따라가면 된다. 따라서 출력은 ‘arXiv’이다.
- project_context: API 응답과 메타데이터 JSON을 읽을 때 자주 나오는 구조다.

## PY3_L05_safe_nested_get_001
- level: 5
- file: python_broad_expansion_v3.json
- title: 중첩 get() 안전 접근
- question_type: output_prediction
- concepts: ["print","dict","get","missing_key"]
- reading_goal: 없는 필드가 있어도 에러 없이 기본값을 쓰는 구조를 읽는다.
- code:
```python
row = {"meta": {}}
score = row.get("meta", {}).get("score", 0)
print(score)
```
- question: 출력은?
- answer: 0
- explanation: row.get('meta', {})는 meta key가 없으면 빈 dict를 반환한다. 이 예제에서는 meta가 빈 dict이므로 이어지는 .get('score', 0)이 기본값 0을 반환한다. 다만 meta key가 있으면서 값이 None이나 다른 자료형이면 첫 get의 기본값은 쓰이지 않아 두 번째 .get에서 오류가 날 수 있다. 그래서 이 패턴은 중간 값이 dict라는 전제까지 보장될 때만 안전하다.
- project_context: 불완전한 수집 데이터와 API 응답을 다룰 때 안전한 패턴이다.

## PY_L05_default_arg_001
- level: 5
- file: python_core_expansion_v1.json
- title: 기본 인자 읽기
- question_type: output_prediction
- concepts: ["function","print","def","default_argument","parameter"]
- reading_goal: 함수 인자에 기본값이 있으면 생략 가능하다는 것을 읽는다.
- code:
```python
def greet(name="user"):
    print(f"hello {name}")

greet()
```
- question: greet()를 실행하면 무엇이 출력되는가?
- answer: hello user
- explanation: greet()는 name 인자를 생략했으므로 함수 정의에 적힌 기본값 'user'를 사용한다. f-string의 {name}이 user로 바뀌어 hello user가 출력된다. greet('Mina')처럼 값을 직접 넘기면 기본값 대신 전달한 값이 사용된다.
- project_context: CLI 옵션이나 함수 설정값에 기본값을 줄 때 자주 쓴다.

## PY_L05_kwargs_001
- level: 5
- file: python_core_expansion_v1.json
- title: **kwargs 읽기
- question_type: output_prediction
- concepts: ["def","print","kwargs","dict","function"]
- reading_goal: **kwargs가 이름 붙은 여러 인자를 dict처럼 받는 구조임을 읽는다.
- code:
```python
def show_config(**kwargs):
    print(kwargs["mode"])

show_config(mode="fast", limit=10)
```
- question: 이 코드가 출력하는 것은?
- answer: fast
- explanation: **kwargs는 이름을 붙여 전달한 추가 인자들을 하나의 딕셔너리로 모은다. 이 호출에서 kwargs는 {'mode': 'fast', 'limit': 10}이 되고, kwargs['mode']는 그중 mode의 값인 'fast'를 꺼낸다. 따라서 fast가 출력된다.
- project_context: 설정값을 유연하게 넘기는 코드에서 자주 보인다.

## PY_L05_lambda_001
- level: 5
- file: python_core_expansion_v1.json
- title: lambda 읽기
- question_type: output_prediction
- concepts: ["print","lambda","function","sorted"]
- reading_goal: lambda x: x["score"]가 작은 익명 함수라는 것을 읽는다.
- code:
```python
rows = [{"score": 3}, {"score": 1}]
rows = sorted(rows, key=lambda x: x["score"])
print(rows[0]["score"])
```
- question: 출력은?
- answer: 1
- explanation: lambda는 이름 없는 짧은 함수를 만들 때 쓴다. 이 코드에서는 score 값을 기준으로 정렬하므로 가장 작은 score인 1이 먼저 온다. 짧은 기준 함수를 한 줄로 넘길 수 있어 sorted나 max 같은 함수의 key 인자로 자주 쓰인다.
- project_context: 점수순 정렬, 날짜순 정렬에서 자주 나온다.

## PY120_L05_CSV_KEYERROR_COLUMN_001
- level: 5
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: CSV 컬럼명 KeyError 읽기
- question_type: multiple_choice
- concepts: ["for","print","KeyError","csv.DictReader","header"]
- reading_goal: DictReader로 읽은 row에서 없는 컬럼명을 접근하면 KeyError가 날 수 있음을 읽는다.
- code:
```python
for row in csv.DictReader(f):
    print(row['score'])
```
- question: row['score']에서 KeyError가 난다면 먼저 확인할 것은?
- answer: 실제 CSV 헤더에 score가 있는지 본다
- explanation: DictReader의 row key는 CSV 헤더에서 온다. 헤더 이름이 score가 아니거나 공백이 있으면 KeyError가 날 수 있다.
- project_context: CSV 컬럼명 오타와 대소문자 문제를 찾는 초보 디버깅 카드다.

## PY120_L05_DICTREADER_LIST_ROWS_001
- level: 5
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: DictReader 결과를 리스트로 모으기
- question_type: multiple_choice
- concepts: ["csv.DictReader","list","row dict"]
- reading_goal: csv.DictReader의 행들을 list(reader)로 모으면 row dict 리스트가 된다는 점을 읽는다.
- code:
```python
with open('scores.csv', newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
```
- question: rows = list(csv.DictReader(f))의 결과로 알맞은 것은?
- answer: 각 행을 dict 형태로 모은 리스트
- explanation: DictReader는 첫 행을 기본 헤더로 삼아 이후 각 행을 dict 형태로 만든다. list(...)는 남은 모든 행을 메모리에 모으며, 별도 변환을 하지 않으면 CSV 필드 값은 문자열이다. 큰 파일은 리스트로 만들지 않고 reader를 바로 반복하는 편이 낫다.
- project_context: CSV 데이터를 읽어 Python 리스트로 처리하는 기본 흐름을 만든다.

## PY120_L05_DICTWRITER_FIELDNAMES_001
- level: 5
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: DictWriter fieldnames 읽기
- question_type: multiple_choice
- concepts: ["csv.DictWriter","fieldnames","columns"]
- reading_goal: csv.DictWriter에서 fieldnames가 CSV 컬럼 이름과 순서를 정한다는 점을 읽는다.
- code:
```python
writer = csv.DictWriter(f, fieldnames=['name', 'score'])
```
- question: fieldnames=['name', 'score']의 의미로 알맞은 것은?
- answer: 쓸 컬럼 이름과 순서를 정한다
- explanation: fieldnames는 DictWriter가 어떤 key를 어떤 컬럼 순서로 쓸지 정한다. dict 데이터 저장에서 중요한 기준이다.
- project_context: dict 형태 데이터를 CSV로 저장할 때 컬럼 기준을 읽는 카드다.

## PY120_L05_DICTWRITER_WRITEHEADER_001
- level: 5
- file: python_csv_writer_dictreader_beginner_v120_a1.json
- title: writeheader 읽기
- question_type: multiple_choice
- concepts: ["writeheader","csv.DictWriter","header"]
- reading_goal: writeheader()가 CSV 맨 위에 컬럼 이름 행을 쓰는 메서드임을 이해한다.
- code:
```python
writer = csv.DictWriter(f, fieldnames=['name', 'score'])
writer.writeheader()
```
- question: writer.writeheader()가 하는 일로 알맞은 것은?
- answer: 헤더 행을 먼저 기록한다
- explanation: writeheader()는 fieldnames에 있는 컬럼 이름을 CSV의 첫 행으로 쓴다. 나중에 DictReader가 컬럼명을 읽기 쉬워진다. 따라서 정답은 ‘헤더 행을 먼저 기록한다’이다.
- project_context: CSV 파일을 사람이 읽기 좋고 다시 읽기 좋게 저장하는 카드다.

## PY123_L05_DATE_RANGE_FILTER_001
- level: 5
- file: python_datetime_beginner_v123_a1.json
- title: 최근 날짜 범위 필터 읽기
- question_type: multiple_choice
- concepts: ["date filter","timedelta","created_at"]
- reading_goal: 날짜 객체와 timedelta를 이용해 최근 며칠 범위에 들어오는 기록만 남기는 흐름을 읽는다.
- code:
```python
cutoff = date.today() - timedelta(days=7)
recent = [row for row in rows if row['created_at'] >= cutoff]
```
- question: 이 코드의 의도로 알맞은 것은?
- answer: 최근 7일 기준 이후의 행만 남긴다
- explanation: cutoff는 오늘에서 7일을 뺀 포함 기준 날짜다. row['created_at']도 문자열이 아니라 cutoff와 비교 가능한 date 객체라는 전제에서, created_at >= cutoff인 행을 남긴다. 오늘을 포함하면 달력 날짜로 최대 8개가 걸릴 수 있어 '최근 7일'의 경계 정의도 확인한다.
- project_context: 최근 기록, 최근 파일, 최근 학습 로그를 필터링하는 흐름이다.

## PY123_L05_STRPTIME_PARSE_001
- level: 5
- file: python_datetime_beginner_v123_a1.json
- title: strptime으로 날짜 문자열 해석
- question_type: multiple_choice
- concepts: ["import","strptime","datetime","date parsing"]
- reading_goal: datetime.strptime()이 문자열 날짜를 datetime 객체로 바꾸는 함수임을 읽는다.
- code:
```python
from datetime import datetime

dt = datetime.strptime('2026-06-03', '%Y-%m-%d')
```
- question: datetime.strptime('2026-06-03', '%Y-%m-%d')의 의미로 알맞은 것은?
- answer: 문자열을 날짜 객체로 해석한다
- explanation: strptime()은 문자열을 지정한 형식에 맞춰 datetime 객체로 바꾼다. 날짜 정렬이나 기간 계산을 하려면 문자열보다 날짜 객체가 안전하다.
- project_context: CSV나 API에서 받은 날짜 문자열을 실제 날짜로 바꾸는 카드다.

## PY123_L05_STRPTIME_VALUEERROR_001
- level: 5
- file: python_datetime_beginner_v123_a1.json
- title: strptime 형식 오류 읽기
- question_type: multiple_choice
- concepts: ["strptime","ValueError","date format"]
- reading_goal: strptime()에서 문자열과 포맷이 맞지 않으면 ValueError가 날 수 있음을 읽는다.
- code:
```python
datetime.strptime('2026/06/03', '%Y-%m-%d')
```
- question: 이 코드에서 ValueError가 날 수 있는 이유로 알맞은 것은?
- answer: 문자열 형식과 포맷 코드가 달라서
- explanation: 문자열은 2026/06/03처럼 슬래시를 쓰는데 포맷은 %Y-%m-%d처럼 하이픈을 기대한다. 형식이 다르면 ValueError가 날 수 있다.
- project_context: 날짜 파싱 오류를 traceback에서 읽고 원인을 찾는 카드다.

## PY123_L05_TIMEDELTA_DAYS_001
- level: 5
- file: python_datetime_beginner_v123_a1.json
- title: timedelta로 며칠 전 계산
- question_type: multiple_choice
- concepts: ["import","timedelta","date","days"]
- reading_goal: timedelta(days=7)이 날짜에서 7일을 빼거나 더하는 데 쓰이는 기간 객체임을 읽는다.
- code:
```python
from datetime import date, timedelta

today = date.today()
week_ago = today - timedelta(days=7)
```
- question: today - timedelta(days=7)의 결과로 알맞은 것은?
- answer: 오늘보다 7일 전 날짜
- explanation: timedelta(days=7)은 7일이라는 기간을 뜻한다. 날짜에서 빼면 7일 전 날짜를 계산할 수 있다. 문자열이 아니라 날짜 객체끼리 계산해야 안전하다.
- project_context: 최근 7일 파일이나 기록을 다룰 때 필요한 날짜 계산 카드다.

## PY4_L05_finally_001
- level: 5
- file: python_deep_expansion_v4.json
- title: finally 정리 흐름 읽기
- question_type: meaning_choice
- concepts: ["print","try_except","finally","cleanup"]
- reading_goal: 성공/실패와 관계없이 finally 블록이 실행되는 흐름을 읽는다.
- code:
```python
try:
    print("run")
except Exception:
    print("error")
finally:
    print("cleanup")
```
- question: finally 블록의 역할은?
- answer: 마지막 정리 작업
- explanation: 일반적인 제어 흐름에서는 try가 정상 종료되거나 예외·return으로 빠져나갈 때 finally가 마지막으로 실행된다. 이 코드에는 예외가 없으므로 run 다음 cleanup이 출력된다. 파일 닫기나 임시 상태 정리에 쓰지만, 프로세스 강제 종료나 전원 중단까지 보장하는 절대적인 의미의 ‘항상’은 아니다.
- project_context: 파일 닫기, DB 연결 해제, 임시 상태 정리에 중요하다.

## PY4_L05_guard_return_001
- level: 5
- file: python_deep_expansion_v4.json
- title: 함수 return 조기 종료 읽기
- question_type: output_prediction
- concepts: ["if","def","print","return","function","guard_clause"]
- reading_goal: 조건에 맞지 않으면 함수가 바로 끝나는 guard clause 패턴을 읽는다.
- code:
```python
def normalize(label):
    if not label:
        return ""
    return label.strip().lower()

print(normalize(None))
```
- question: 출력은?
- answer: 빈 문자열
- explanation: label이 None이면 not label이 True여서 첫 return이 빈 문자열을 즉시 돌려주고 strip은 실행되지 않는다. 다만 not label은 None뿐 아니라 '', 0, False, 빈 컨테이너도 참으로 보므로, 오직 None만 특별 처리하려는 함수라면 label is None처럼 조건을 좁혀야 한다. 이 예제의 출력은 빈 문자열이다.
- project_context: 정규화 함수와 방어 코드에서 자주 보인다.
