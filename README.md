# Python Reading Trainer

## 1. 프로젝트 목적

이 프로젝트는 파이썬 코드를 처음부터 전부 작성하는 개발자를 만드는 앱이 아니다.

목표는 다음과 같다.

- 파이썬 코드 구조를 읽을 수 있다.
- 변수, 함수, 파일, JSONL 흐름을 따라갈 수 있다.
- 전체 프로그램이 어떤 기능을 하는지 추론할 수 있다.
- 필요한 수정 지점을 찾을 수 있다.
- 개발자나 코드 에이전트에게 정확히 지시할 수 있다.
- KG, LLM, JSONL, 배치 스크립트 중심의 실전 코드를 이해할 수 있다.

핵심 정체성:

- Python Writing App 이 아니라 Python Reading Trainer
- 문법 암기 앱이 아니라 코드 독해 반복훈련 앱
- 정답 코딩 앱이 아니라 빈칸, 출력, 의미, 흐름, 구조 파악 앱

---

## 2. 기본 방향

이 앱은 외부 튜토리얼 본문을 복사하지 않는다.

대신 다음만 참고한다.

- 배워야 할 파이썬 개념 목록
- 자주 쓰이는 함수 목록
- 학습 순서
- 기초 문법 범위

설명, 예제, 퀴즈, 사이드 개념은 모두 새로 작성한다.

예제는 일반적인 과일/동물 예제보다 다음과 같은 실전형 예제를 우선한다.

- JSONL
- nodes
- edges
- chunks
- doc_id
- label
- kind
- shard
- batch
- API key
- 환경변수
- 파일 경로
- 로그
- 실패 재시도

---

## 3. 학습 목표

최종 목표는 다음 능력이다.

1. 코드 한 줄을 읽는다.
2. 작은 코드 블록의 의미를 파악한다.
3. 변수에 값이 어떻게 들어가고 이동하는지 추적한다.
4. 함수 목록을 보고 프로그램 기능을 추론한다.
5. 기능 목표를 보고 필요한 함수와 모듈을 고른다.
6. 알고리즘 순서를 맞힌다.
7. 위험한 코드 패턴을 알아본다.
8. PM 관점에서 누락, 위험, 개선 지점을 찾는다.
9. 개발자에게 수정 요청을 정확히 줄 수 있다.
10. 코드 에이전트나 LLM에게 넣을 지시문을 더 정확히 만들 수 있다.

---

## 4. 난이도 구조

### Level 1. 단일 문법 / 단일 함수

목표:

- 코드 모양을 알아본다.
- print, len, type, str, int 같은 기본 함수를 익힌다.

예시:

    len(items)

질문:

    이 코드는 무엇을 구하는가?

---

### Level 2. 변수 + 함수 연결

목표:

- 값이 어디서 와서 어디로 가는지 본다.

예시:

    items = ["UAM", "ADAS", "Robotics"]
    count = len(items)
    print(count)

질문:

    count에는 어떤 값이 들어가는가?

---

### Level 3. 자료구조 + 값 꺼내기

목표:

- list, dict 구조를 읽는다.
- key와 value를 이해한다.

예시:

    node = {
        "label": "LiDAR",
        "kind": "Sensor"
    }

    print(node["kind"])

질문:

    무엇이 출력되는가?

---

### Level 4. 반복문 + 조건문 + 리스트

목표:

- 여러 항목 중 조건에 맞는 것만 고르는 흐름을 읽는다.

예시:

    selected = []

    for node in nodes:
        if node["kind"] == "Sensor":
            selected.append(node["label"])

질문:

    이 코드는 어떤 항목을 selected에 넣는가?

---

### Level 5. 함수 2~3개 연계

목표:

- 함수 호출 흐름을 따라간다.

예시:

    def normalize_label(label):
        return label.strip().lower()

    def is_sensor(node):
        return node["kind"] == "Sensor"

핵심:

- 입력값이 함수로 들어간다.
- 함수 내부에서 처리된다.
- return 값이 다음 코드로 넘어간다.

---

### Level 6. 파일 읽기 + JSON 변환 + 조건 필터

목표:

- 파일 입력, JSONL 읽기, dict 변환, 조건 필터 흐름을 읽는다.

예시:

    import json

    with open("nodes.jsonl", "r", encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)

            if row["kind"] == "Sensor":
                print(row["label"])

질문:

    이 코드는 어떤 일을 하는가?

---

### Level 7. 입력 → 처리 → 출력 파이프라인

목표:

- 작은 프로그램 전체 구조를 읽는다.
- main, load, filter, write 구조를 이해한다.

핵심 질문:

- 실행 시작점은 어디인가?
- 입력 파일은 무엇인가?
- 출력 파일은 무엇인가?
- 핵심 처리 함수는 무엇인가?
- 전체 기능을 한 문장으로 설명하면 무엇인가?

---

### Level 8. 함수 목록 → 기능 역추론

목표:

- 함수 이름과 import 목록을 보고 프로그램 목적을 추론한다.

예시:

    def load_jsonl(path):
        ...

    def filter_by_keyword(rows, keyword):
        ...

    def write_jsonl(rows, path):
        ...

질문:

    이 프로그램이 하려는 일에 가장 가까운 것은?

---

### Level 9. 기능 목표 → 필요한 함수 / 모듈 고르기

목표:

- PM 관점에서 기능을 구현하려면 어떤 부품이 필요한지 판단한다.

예시 목표:

    여러 JSONL 파일을 읽어서 label 중복을 제거하고 kind별 개수를 계산한 뒤 summary.csv로 저장한다.

필요 후보:

- Path.glob()
- json.loads()
- set()
- dict counter
- csv 또는 pandas
- argparse

---

### Level 10. PM형 코드 리뷰

목표:

- 코드가 실패할 수 있는 지점을 찾는다.
- 개발자에게 확인해야 할 질문을 만든다.

예시 질문:

    이 코드가 실제 프로젝트에서 불안정할 수 있는 이유는?

보기:

- encoding이 지정되지 않았다.
- doc_id가 없는 줄이면 에러가 난다.
- json import가 없으면 실행되지 않는다.
- API key가 코드에 직접 들어 있다.

---

## 5. 문제 유형

앱의 핵심 문제 유형은 다음과 같다.

1. 빈칸 채우기
2. 출력 결과 맞히기
3. 코드 의미 고르기
4. 흐름 순서 맞히기
5. 중요한 줄 찾기
6. 틀린 코드에서 문제 지점 찾기
7. 함수 이름 보고 역할 추측하기
8. import 보고 프로그램 목적 예측하기
9. JSON / JSONL 구조에서 값 꺼내기
10. 기능 목표에서 필요한 함수 고르기
11. 함수 목록에서 기능 역추론하기
12. PM 관점에서 위험 지점 찾기
13. 개발자에게 할 확인 질문 고르기

---

## 6. 반복학습 구조

전체 콘텐츠는 많이 넣되, 사용자는 순차적으로 학습한다.

기본 방식:

- 오늘의 신규 카드
- 오늘의 복습 카드
- 어제 틀린 카드
- 헷갈린 개념
- 상급 도전 문제

정답 반응:

- 모름
- 헷갈림
- 맞힘
- 너무 쉬움

복습 간격 예시:

- 처음 맞힘 → 10분 뒤
- 다시 맞힘 → 1일 뒤
- 다시 맞힘 → 3일 뒤
- 다시 맞힘 → 7일 뒤
- 다시 맞힘 → 14일 뒤

틀리면:

- 바로 재출제
- 쉬운 예제로 되돌림
- 같은 개념을 다른 코드 모양으로 반복

---

## 7. 사이드 카드 구조

문제 옆에는 재미있는 이야기와 실무 개념을 붙인다.

### 7.1 개념 카드

예시:

- 정수 오버플로우
- 부동소수점 오차
- None과 null
- mutable / immutable
- 얕은 복사 / 깊은 복사
- UTF-8 인코딩
- Windows 경로와 Linux 경로
- JSON과 JSONL 차이
- 환경변수와 .env
- API key를 코드에 직접 쓰면 위험한 이유
- try / except가 필요한 이유
- logging이 print보다 나은 이유

### 7.2 실무 사용처 카드

예시:

- dict는 JSON/API 응답 처리에 많이 쓰인다.
- set은 중복 제거와 이미 처리한 항목 확인에 많이 쓰인다.
- pathlib은 파일 경로 자동화에 많이 쓰인다.
- argparse는 배치 스크립트 옵션 처리에 많이 쓰인다.
- logging은 장시간 실행되는 작업 추적에 중요하다.

### 7.3 요즘 많이 쓰이는 라이브러리 카드

예시:

- numpy
- pandas
- requests
- httpx
- FastAPI
- Streamlit
- pydantic
- pathlib
- rich
- pytest
- tqdm
- transformers
- torch
- scikit-learn

### 7.4 PM 관점 카드

예시:

- 이 코드는 전체 파이프라인에서 어느 단계인가?
- 이 단계가 실패하면 뒤에 어떤 문제가 생기는가?
- 개발자에게 무엇을 확인해야 하는가?
- 성능, 메모리, 에러 리스크는 무엇인가?
- 이 기능을 자동화하려면 입력/출력/로그가 무엇이어야 하는가?

---

## 8. 주요 학습 범위

### A. 기초

- print
- 변수
- 숫자
- 문자열
- bool
- None
- 주석
- type
- 형변환

### B. 자료구조

- list
- tuple
- set
- dict
- index
- slicing
- append
- extend
- remove
- sort
- sorted
- get
- keys
- values
- items

### C. 흐름 제어

- if
- elif
- else
- for
- while
- range
- enumerate
- zip
- break
- continue

### D. 함수

- def
- return
- parameter
- default parameter
- keyword argument
- args
- kwargs
- lambda

### E. 파일 / 데이터

- open
- with open
- read
- readline
- readlines
- write
- pathlib
- glob
- json.load
- json.loads
- json.dump
- json.dumps
- csv
- jsonl

### F. 실전 코드

- import
- from import
- if __name__ == "__main__"
- argparse
- try except
- logging
- os
- sys
- subprocess

### G. 객체지향 기초

- class
- __init__
- self
- method
- dataclass

### H. 데이터 처리

- pandas read_csv
- to_csv
- DataFrame
- filter
- groupby 기초

### I. API / 자동화

- requests
- headers
- API key
- env
- dotenv
- response.json
- status_code

### J. KG / LLM 파이프라인형 실습

- chunks.jsonl 읽기
- nodes.jsonl 읽기
- edges.jsonl 읽기
- label 정규화
- 중복 제거
- doc_id 기준 병합
- node_id 기준 edge 연결
- 실패 로그 저장
- shard 단위 처리
- batch 실행
- 환경변수에서 API key 읽기

---

## 9. 앱 형태

폰 학습을 우선하므로 최종 형태는 PWA가 적합하다.

1차 MVP:

- 정적 HTML
- JavaScript
- JSON 데이터

장점:

- GitHub Pages 배포 가능
- 폰에서 바로 열 수 있음
- 홈 화면에 앱처럼 추가 가능
- 서버 비용 없음
- 진도 저장 가능
- 오프라인 학습 가능

추후 확장:

- Streamlit 또는 FastAPI 기반 코드 구조 분석기

---

## 10. 초기 폴더 구조

python-reading-trainer/
  README.md
  docs/
  data/
    curriculum/
    lessons/
    quizzes/
    side_cards/
    missions/
    samples/
  src/
    pwa/
    tools/
    prototype/
  assets/
    icons/
    screenshots/
  notes/
    design/
    research/
    examples/

---

## 11. 우선 만들 것

1. 전체 커리큘럼 목차
2. lesson/card/quiz JSON 스키마
3. PWA 기본 화면
4. 카드 100~200개 샘플
5. 반복학습 알고리즘
6. KG/JSONL 실전 미션
7. 코드 구조 분석기

---

## 12. 첫 MVP 목표

첫 버전은 다음 수준이면 충분하다.

- 모바일 카드 UI
- 난이도별 학습
- 빈칸 문제
- 출력 예측 문제
- 코드 의미 고르기
- 사이드 개념 카드
- 로컬 진도 저장
- 샘플 JSONL 기반 문제
- KG/LLM 작업형 예제 포함

첫 목표 콘텐츠:

- 변수
- 문자열
- 리스트
- 딕셔너리
- if
- for
- def
- return
- import
- open
- with open
- json.loads
- json.dumps
- jsonl 읽기
- pathlib
- main()
- argparse
- try/except
- set 중복 제거
- dict.get

---

## 13. 앱의 최종 정체성

이 앱은 파이썬 문법을 외우는 앱이 아니다.

이 앱은 다음을 훈련한다.

- 코드를 읽는다.
- 값의 흐름을 따라간다.
- 함수의 역할을 추론한다.
- 전체 기능을 이해한다.
- 필요한 구성요소를 고른다.
- 위험한 지점을 찾는다.
- PM 관점에서 개발 지시를 명확히 한다.

최종 이름 후보:

- Python Reading Trainer
- KG Python Reader
- Python for PM
- Python Code Reading Gym

<!-- CODE_EXPLAINER_COVERAGE_TODO_V200_START -->

## V200 Code Explainer Coverage TODO

기준 버전: `20260608_v199_a1`
기준 HEAD: `66eb6ba Improve project analyzer diagram visibility`
감사 목적: 코드해석기가 타겟 언어별 대표 함수/명령어를 얼마나 설명할 수 있는지 확인하고, 다음 보강 우선순위를 정리한다.

### 감사 결과 요약

| 영역 | 결과 |
|---|---:|
| Python | 24/28 matched, missing 4, coverage 0.857 |
| PowerShell | 25/25 matched, missing 0, coverage 1.0 |
| JavaScript | 22/22 matched, missing 0, coverage 1.0 |
| Cloudflare Workers | 23/23 matched, missing 0, coverage 1.0 |
| Java | 28/29 matched, missing 1, coverage 0.966 |
| Config / Docs | 29/29 matched, missing 0, coverage 1.0 |

### Missing 항목

#### Python
- `range`
- `enumerate`
- `json.dump`
- `json.dumps`

#### Java
- `IOException`

### 구조적 GAP

- `confidence_label`: 확실 / 추정 / 미지원 표시가 아직 없다.
- `data_flow_tracking`: 변수 생성 → 가공 → 저장/출력 흐름 추적이 아직 없다.
- `call_graph`: 사용자 정의 함수 정의와 호출 관계 연결이 아직 없다.

### V201 P0 TODO

- [x] Python `range` 설명 규칙 추가
- [x] Python `enumerate` 설명 규칙 추가
- [x] Python `json.dump` 설명 규칙 추가
- [x] Python `json.dumps` 설명 규칙 추가
- [x] Java `IOException` 설명 규칙 추가
- [x] 위 항목을 포함한 smoke sample 추가
- [x] `tools/code_explainer_smoke_v171.js` 기대 문구 업데이트
- [x] 검증 스크립트에서 새 smoke sample 통과 확인

### V202 P1 TODO

- [x] 각 step에 확신도 표시 추가
- [x] 정확 매칭은 `확실`로 표시
- [x] 이름/문맥 기반 추정은 `추정`으로 표시
- [x] 미등록 함수는 `미지원`으로 분리
- [x] 결과 화면에 미지원 함수 목록 표시

### V203 P2 TODO

- [x] 변수 생성 → 가공 → 저장/출력 데이터 흐름 추적
- [x] 사용자 정의 함수 정의와 호출 연결
- [x] 긴 코드를 함수/블록 단위로 요약
- [x] Mermaid 흐름도에 함수 호출, 데이터 저장, 외부 요청 노드 구분 강화

<!-- CODE_EXPLAINER_COVERAGE_TODO_V200_END -->
V204 코드해석 품질 감사 2차 — 20260608

기준 버전: 20260608_v203_a1
기준 커밋: cbbc887 Add code explainer data and call flow analysis

감사 파일:

docs/audits/code_explainer_quality_audit_v204.md
docs/audits/code_explainer_quality_audit_v204.json
감사 결과

V204_CODE_EXPLAINER_QUALITY_AUDIT_OK
ISSUES 0

Feature Gates

OK app_version_v203
OK confidence_summary
OK unsupported_items
OK data_flow
OK call_flow
OK mermaid_data_call_subgraphs
OK ui_flow_panel
OK css_flow_panel
OK smoke_v203_sample

언어별 대표 샘플 결과

python: samples 2, steps 14, dataFlow 10, callFlow 5, unsupported 0
powershell: samples 1, steps 6, dataFlow 4, callFlow 1, unsupported 1
javascript: samples 1, steps 6, dataFlow 5, callFlow 2, unsupported 1
workers: samples 1, steps 6, dataFlow 5, callFlow 2, unsupported 0
java: samples 1, steps 13, dataFlow 5, callFlow 8, unsupported 0

결론

V203 기능 게이트와 대표 샘플 감사가 통과했다.
다음 단계는 V205에서 흐름 정밀도 보강으로 진행한다.

V205 후보:

PowerShell pipeline Set-Content 오탐/표시 정리
JavaScript return value.trim().toLowerCase() 미지원 표시 정리
Python result = mystery_transform(data) 같은 unknown call을 unsupported로 더 정확히 잡기
Java 메서드 정의 줄을 자기 자신 호출로 잘못 잡는 부분 보정
변수별 producer/consumer 연결 강화

## V205 코드해석 흐름 정밀도 보강 — 20260608

기준 버전: 20260608_v205_a1

### 보강 내용

- PowerShell pipeline Set-Content를 파일 저장 단계로 정확히 표시
- PowerShell callFlow에서 파일 확장자 json 같은 path segment 오탐 방지
- JavaScript return value.trim().toLowerCase() 같은 반환 체인을 값 반환으로 표시
- Python result = mystery_transform(data) 같은 미등록 함수 결과 저장을 unsupported로 표시
- Java 메서드 정의 줄을 자기 자신 호출로 잡는 self-call 오탐 방지
- smoke sample 4개 추가

### 기준선

- V203 smoke 31개 유지
- V205 smoke는 35개 이상 통과해야 함

## V206 코드해석 정밀도 감사 3차 — 20260608

기준 버전: 20260608_v205_a1
기준 커밋: 577c8dd Improve code explainer flow precision

감사 파일:
- docs/audits/code_explainer_precision_audit_v206.md
- docs/audits/code_explainer_precision_audit_v206.json

### 감사 결과

V206_CODE_EXPLAINER_PRECISION_AUDIT_OK
HARD_FAILURES 0
CANDIDATE_NOTES 7

### Feature Gates

OK version_v205
OK rules_v205_marker
OK ps_setcontent
OK ps_convert_json_fix
OK js_return_fix
OK unknown_assignment
OK python_assignment_token
OK call_self_guard
OK smoke_v205

### V207 후보 이슈

- PowerShell param block 내부 [string]$Root 미지원/노이즈 완화
- PowerShell [pscustomobject]@{ 구조 줄 미지원/노이즈 완화
- PowerShell object literal 내부 path = $_ 줄 미지원/노이즈 완화
- Python nested unknown call: list(map(mystery_transform, data)) 탐지
- Python chain call: loader().transform(data)에서 transform까지 탐지할지 검토
- JavaScript nested unknown call: knownWrapper(mysteryTransform(data)) 탐지
- Java Path.of 호출을 callFlow에 더 명시적으로 표시

### 결론

V205 기능 게이트는 안정적이다.
V207에서는 candidateNotes 7개 중 사용자 체감이 큰 항목부터 정밀도 보강한다.
우선순위는 PowerShell 노이즈 완화, Python/JS nested unknown call 탐지, Java Path.of 명시 순서가 적절하다.

## V207 코드해석 후보 이슈 정밀도 보강 — 20260608

기준 버전: 20260608_v207_a1

### 보강 내용

- PowerShell param block 내부 타입 선언 줄의 미지원 표시 완화
- PowerShell object literal 시작 줄의 미지원 표시 완화
- PowerShell object literal 내부 key-value 줄의 미지원 표시 완화
- Python nested unknown call 탐지 보강
- JavaScript nested unknown call 탐지 보강
- Java Path.of 호출을 callFlow에 명시
- Python chain call의 property method 탐지는 과탐 가능성 때문에 보류

### 기준선

- V205 smoke 35개 유지
- V207 smoke는 39개 이상 통과해야 함

## V208 Java package-private method 정밀도 보강 — 20260608

기준 버전: 20260608_v208_a1

### 보강 내용

- V208 감사에서 발견한 Java package-private static method 오탐을 수정했다.
- `static String load(...)`처럼 접근제어자 없이 static 또는 반환 타입으로 시작하는 Java 메서드 정의를 `메서드 정의`로 분류한다.
- 기존 V207 smoke 39개 기준선을 유지하고, Java package-private method smoke sample을 1개 추가한다.

### 남은 후보

- producer-consumer links are still implicit
- 이 항목은 코드해석 규칙 오류가 아니라 UI/데이터 흐름 표현 개선 후보로 분리한다.
