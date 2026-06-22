# V334-A8 Korean Copy Freeze and i18n Targets

Purpose: freeze Korean visible/explainer copy after V334-A2~A7 and extract English retranslation targets.

## Summary

| metric | value |
|---|---:|
| total Korean rows | 2869 |
| V334 marker rows | 300 |
| high priority rows | 763 |

## By Category

| category | rows |
|---|---:|
| app-ui | 254 |
| css-explainer | 93 |
| devops-explainer | 45 |
| general-copy | 1315 |
| javascript-explainer | 242 |
| powershell-explainer | 30 |
| python-explainer | 210 |
| sql-explainer | 108 |
| unknown-action-ui | 572 |

## By Priority

| priority | rows |
|---|---:|
| high | 763 |
| low | 1280 |
| medium | 826 |

## Freeze Policy

- Keep internal field names such as `roleSummary`, `unknownNextActions`, and `unsupportedItems` unchanged.
- Freeze Korean visible wording in V334-A2~A7 before English retranslation.
- Translate user-visible explanation text, not internal marker names or code identifiers.
- Preserve code tokens such as `npm ci`, `GROUP BY`, `display: flex`, `localStorage`, and `PowerShell`.
- Prefer beginner-friendly English over literal word-for-word translation.

## High Priority Translation Targets

| file | line | category | marker | Korean copy |
|---|---:|---|---|---|
| src/pwa/code_explainer_rules.js | 319 | powershell-explainer | - | 각 항목 반복 처리 |
| src/pwa/code_explainer_rules.js | 319 | powershell-explainer | - | 파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다. |
| src/pwa/code_explainer_rules.js | 340 | javascript-explainer | - | 시간값을 변수에 저장 |
| src/pwa/code_explainer_rules.js | 340 | javascript-explainer | - | 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다. |
| src/pwa/code_explainer_rules.js | 349 | javascript-explainer | - | 경로 조합 결과 저장 |
| src/pwa/code_explainer_rules.js | 349 | javascript-explainer | - | 변수에 여러 경로 조각을 합친 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 355 | powershell-explainer | - | CSV 읽기 결과 저장 |
| src/pwa/code_explainer_rules.js | 355 | powershell-explainer | - | 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 365 | javascript-explainer | - | 파일 내용 읽기 결과 저장 |
| src/pwa/code_explainer_rules.js | 365 | javascript-explainer | - | 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다. |
| src/pwa/code_explainer_rules.js | 374 | javascript-explainer | - | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 374 | javascript-explainer | - | 변수에 값을 넣습니다. 이후 줄에서 $ |
| src/pwa/code_explainer_rules.js | 374 | javascript-explainer | - | 을 쓰면 이 값을 다시 사용합니다. |
| src/pwa/code_explainer_rules.js | 401 | javascript-explainer | - | 여러 줄 문자열 경계 |
| src/pwa/code_explainer_rules.js | 401 | javascript-explainer | - | here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 430 | powershell-explainer | - | 조건으로 필터링 |
| src/pwa/code_explainer_rules.js | 430 | powershell-explainer | - | 파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다. |
| src/pwa/code_explainer_rules.js | 433 | powershell-explainer | - | 각 항목 반복 처리 |
| src/pwa/code_explainer_rules.js | 433 | powershell-explainer | - | 파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다. |
| src/pwa/code_explainer_rules.js | 439 | powershell-explainer | - | 정렬 |
| src/pwa/code_explainer_rules.js | 439 | powershell-explainer | - | 파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 481 | python-explainer | - | 오류 발생시키기 |
| src/pwa/code_explainer_rules.js | 481 | python-explainer | - | 조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다. |
| src/pwa/code_explainer_rules.js | 518 | javascript-explainer | - | Node 문법 검사 |
| src/pwa/code_explainer_rules.js | 518 | javascript-explainer | - | JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다. |
| src/pwa/code_explainer_rules.js | 521 | devops-explainer | - | npm 의존성 설치 |
| src/pwa/code_explainer_rules.js | 521 | devops-explainer | - | package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다. |
| src/pwa/code_explainer_rules.js | 527 | python-explainer | - | Python 검증 실행 |
| src/pwa/code_explainer_rules.js | 527 | python-explainer | - | 학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다. |
| src/pwa/code_explainer_rules.js | 536 | javascript-explainer | - | Git 커밋 준비 |
| src/pwa/code_explainer_rules.js | 536 | javascript-explainer | - | 수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다. |
| src/pwa/code_explainer_rules.js | 539 | javascript-explainer | - | Git 커밋 생성 |
| src/pwa/code_explainer_rules.js | 539 | javascript-explainer | - | 준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다. |
| src/pwa/code_explainer_rules.js | 545 | javascript-explainer | - | 원격 저장소로 업로드 |
| src/pwa/code_explainer_rules.js | 545 | javascript-explainer | - | 로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다. |
| src/pwa/code_explainer_rules.js | 569 | javascript-explainer | - | Node.js 실행 |
| src/pwa/code_explainer_rules.js | 569 | javascript-explainer | - | JavaScript 파일 검사나 실행을 합니다. |
| src/pwa/code_explainer_rules.js | 578 | javascript-explainer | - | 파일 내용 쓰기 |
| src/pwa/code_explainer_rules.js | 578 | javascript-explainer | - | 지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 637 | powershell-explainer | - | 표 형태로 출력 |
| src/pwa/code_explainer_rules.js | 637 | powershell-explainer | - | 파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 654 | javascript-explainer | - | FastAPI 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 654 | javascript-explainer | - | FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 657 | javascript-explainer | - | Pydantic 모델 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 657 | javascript-explainer | - | API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 660 | javascript-explainer | - | 라이브러리 불러오기 |
| src/pwa/code_explainer_rules.js | 660 | javascript-explainer | - | 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다. |
| src/pwa/code_explainer_rules.js | 668 | javascript-explainer | - | 함수 정의 |
| src/pwa/code_explainer_rules.js | 668 | javascript-explainer | - | 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다. |
| src/pwa/code_explainer_rules.js | 679 | general-copy | - | 데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다. |
| src/pwa/code_explainer_rules.js | 688 | general-copy | - | 현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다. |
| src/pwa/code_explainer_rules.js | 720 | python-explainer | - | 예외 발생시키기 |
| src/pwa/code_explainer_rules.js | 720 | python-explainer | - | 조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다. |
| src/pwa/code_explainer_rules.js | 723 | python-explainer | - | 조건 검증 |
| src/pwa/code_explainer_rules.js | 723 | python-explainer | - | 반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 730 | python-explainer | - | 반복자 만들기 |
| src/pwa/code_explainer_rules.js | 730 | python-explainer | - | 리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 745 | python-explainer | - | 조건 검사 |
| src/pwa/code_explainer_rules.js | 745 | python-explainer | - | 조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 748 | python-explainer | - | 다른 조건 검사 |
| src/pwa/code_explainer_rules.js | 748 | python-explainer | - | 앞 조건이 틀렸을 때 추가 조건을 검사합니다. |
| src/pwa/code_explainer_rules.js | 751 | python-explainer | - | 조건이 모두 아닐 때 |
| src/pwa/code_explainer_rules.js | 751 | python-explainer | - | 앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다. |
| src/pwa/code_explainer_rules.js | 754 | python-explainer | - | 다음 반복으로 건너뛰기 |
| src/pwa/code_explainer_rules.js | 754 | python-explainer | - | 현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 765 | general-copy | - | 목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다. |
| src/pwa/code_explainer_rules.js | 777 | javascript-explainer | - | JSON 문자열 만들기 |
| src/pwa/code_explainer_rules.js | 777 | javascript-explainer | - | Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 780 | python-explainer | - | JSON 읽기 |
| src/pwa/code_explainer_rules.js | 780 | python-explainer | - | JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 787 | sql-explainer | - | pandas 표 만들기 |
| src/pwa/code_explainer_rules.js | 787 | sql-explainer | - | 리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 811 | python-explainer | - | NumPy 배열 만들기 |
| src/pwa/code_explainer_rules.js | 811 | python-explainer | - | 리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다. |
| src/pwa/code_explainer_rules.js | 823 | python-explainer | - | NumPy 조건 선택 |
| src/pwa/code_explainer_rules.js | 823 | python-explainer | - | 조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 860 | javascript-explainer | - | 환경변수 파일 로드 |
| src/pwa/code_explainer_rules.js | 860 | javascript-explainer | - | .env 파일에 있는 설정값을 현재 Python 실행 환경으로 불러옵니다. 실제 비밀값은 저장소에 올리지 않아야 합니다. |
| src/pwa/code_explainer_rules.js | 875 | javascript-explainer | - | CSV 딕셔너리 쓰기 |
| src/pwa/code_explainer_rules.js | 875 | javascript-explainer | - | 딕셔너리 데이터를 정해진 fieldnames 순서대로 CSV에 저장할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 881 | javascript-explainer | - | CSV 행 쓰기 |
| src/pwa/code_explainer_rules.js | 881 | javascript-explainer | - | 목록 형태의 행 데이터를 CSV 파일에 저장할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 890 | python-explainer | - | 목록에 항목 추가 |
| src/pwa/code_explainer_rules.js | 890 | python-explainer | - | 리스트 끝에 새 값을 하나 추가합니다. 반복문 안에서 결과를 모을 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 893 | python-explainer | - | 자료구조 확장/갱신 |
| src/pwa/code_explainer_rules.js | 893 | python-explainer | - | 리스트나 딕셔너리에 여러 값을 추가하거나 기존 값을 갱신합니다. |
| src/pwa/code_explainer_rules.js | 902 | python-explainer | - | 표 데이터 만들기 |
| src/pwa/code_explainer_rules.js | 902 | python-explainer | - | 리스트나 딕셔너리 데이터를 pandas DataFrame 표 구조로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 908 | sql-explainer | - | 그룹별 집계 |
| src/pwa/code_explainer_rules.js | 908 | sql-explainer | - | 특정 컬럼 값을 기준으로 데이터를 묶어서 합계, 평균, 개수 같은 통계를 계산할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 920 | python-explainer | - | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 920 | python-explainer | - | 웹 API 응답 본문을 Python 딕셔너리나 리스트로 변환합니다. |
| src/pwa/code_explainer_rules.js | 955 | javascript-explainer | - | 딕셔너리 항목 설정 |
| src/pwa/code_explainer_rules.js | 955 | javascript-explainer | - | 딕셔너리 안에서 키와 값을 연결하는 데이터 줄입니다. 검증 항목 이름과 검사 결과를 묶어 저장할 때 자주 나옵니다. |
| src/pwa/code_explainer_rules.js | 988 | javascript-explainer | - | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 988 | javascript-explainer | - | 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 995 | javascript-explainer | - | 누적 더하기 |
| src/pwa/code_explainer_rules.js | 995 | javascript-explainer | - | 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 999 | python-explainer | - | Python 코드 실행 |
| src/pwa/code_explainer_rules.js | 999 | python-explainer | - | 이 줄은 Python 코드입니다. 위에서 아래로 순서대로 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1019 | javascript-explainer | - | 엄격 모드 선언 |
| src/pwa/code_explainer_rules.js | 1019 | javascript-explainer | - | JavaScript 파일을 더 엄격한 규칙으로 실행하게 하는 선언입니다. 실수로 전역 변수를 만들거나 조용히 넘어가는 오류를 줄이는 데 도움이 됩니다. |
| src/pwa/code_explainer_rules.js | 1022 | javascript-explainer | - | Node.js 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 1022 | javascript-explainer | - | require로 fs, path 같은 Node.js 모듈을 불러와 변수에 저장합니다. 이후 파일 처리, 경로 처리, 프로세스 실행 등에 사용됩니다. |
| src/pwa/code_explainer_rules.js | 1028 | general-copy | - | path 모듈로 파일 경로를 안전하게 합치거나 파일명, 폴더명, 확장자를 계산합니다. Windows와 Linux 경로 차이를 줄이는 데 도움이 됩니다. |
| src/pwa/code_explainer_rules.js | 1051 | python-explainer | - | 조건/표현식 경계 |
| src/pwa/code_explainer_rules.js | 1051 | python-explainer | - | 여러 줄로 나뉜 조건식이나 삼항 연산자 표현식을 마무리하는 경계 줄입니다. 앞줄의 조건과 함께 읽어야 합니다. |
| src/pwa/code_explainer_rules.js | 1054 | python-explainer | - | 정규식 조건 검사 |
| src/pwa/code_explainer_rules.js | 1054 | python-explainer | - | 정규식으로 문자열 형태를 검사하거나 특정 패턴을 찾습니다. 파일명, 코드펜스, 설정 줄처럼 형식 판별에 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1066 | javascript-explainer | - | Blob 파일 데이터 생성 |
| src/pwa/code_explainer_rules.js | 1066 | javascript-explainer | - | 문자열이나 SVG 같은 내용을 브라우저에서 다운로드 가능한 Blob 데이터로 만듭니다. 이후 URL.createObjectURL이나 링크 클릭으로 저장할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1075 | javascript-explainer | - | 예제 코드 문자열 |
| src/pwa/code_explainer_rules.js | 1075 | javascript-explainer | - | JavaScript 파일 안에 샘플로 들어 있는 Python, Java 같은 다른 언어 코드입니다. 현재 JavaScript로 직접 실행되는 줄이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1078 | python-explainer | - | 오류 발생 |
| src/pwa/code_explainer_rules.js | 1078 | python-explainer | - | 조건이 맞지 않거나 검증에 실패했을 때 Error를 만들어 실행을 중단합니다. 실패 원인을 메시지로 남기는 방어 코드입니다. |
| src/pwa/code_explainer_rules.js | 1099 | python-explainer | - | 조건부 UI 조각 |
| src/pwa/code_explainer_rules.js | 1099 | python-explainer | - | 삼항 연산자의 ? 또는 : 쪽에 놓인 화면 문구나 HTML 조각입니다. 조건에 따라 어떤 문구를 보여줄지 나누는 부분입니다. |
| src/pwa/code_explainer_rules.js | 1105 | javascript-explainer | - | DOM 스타일 설정 |
| src/pwa/code_explainer_rules.js | 1105 | javascript-explainer | - | 화면 요소의 style 값을 직접 바꿉니다. 진행률 막대 너비처럼 사용자에게 보이는 시각 상태를 갱신합니다. |
| src/pwa/code_explainer_rules.js | 1108 | javascript-explainer | - | 중첩 객체 값 갱신 |
| src/pwa/code_explainer_rules.js | 1108 | javascript-explainer | - | 객체 안의 객체나 배열 항목처럼 깊은 위치의 값을 바꿉니다. 진도, 정답 수, 마지막 학습 시각 같은 상태 저장에 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1116 | general-copy | - | useEffect, useMemo, useCallback 같은 Hook의 콜백 함수와 의존성 배열을 마무리합니다. 배열 안의 값이 바뀔 때만 Hook이 다시 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1122 | javascript-explainer | - | React 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 1122 | javascript-explainer | - | React 컴포넌트와 useState, useEffect 같은 Hook 기능을 가져옵니다. 화면을 컴포넌트 단위로 만들고 상태 변화에 따라 다시 그리기 위한 준비 단계입니다. |
| src/pwa/code_explainer_rules.js | 1125 | javascript-explainer | - | React DOM 렌더링 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 1125 | javascript-explainer | - | React 컴포넌트를 실제 브라우저 DOM에 붙이기 위한 createRoot 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 1141 | javascript-explainer | - | React 계산값 재사용 |
| src/pwa/code_explainer_rules.js | 1141 | javascript-explainer | - | 비용이 큰 계산 결과를 의존성 값이 바뀔 때만 다시 계산하도록 저장합니다. 의존성 배열이 빠지면 오래된 값이 남을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1147 | javascript-explainer | - | React 참조값 만들기 |
| src/pwa/code_explainer_rules.js | 1147 | javascript-explainer | - | 렌더링 사이에 유지되는 참조 객체를 만듭니다. DOM 요소를 가리키거나 다시 렌더링을 일으키지 않는 값을 저장할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 1154 | python-explainer | - | React props 읽기 |
| src/pwa/code_explainer_rules.js | 1154 | python-explainer | - | 부모 컴포넌트가 넘겨준 값을 읽습니다. props는 보통 현재 컴포넌트가 직접 바꾸지 않고 화면 표시나 조건 분기에 사용합니다. |
| src/pwa/code_explainer_rules.js | 1157 | css-explainer | - | JSX 화면 구조 |
| src/pwa/code_explainer_rules.js | 1157 | css-explainer | - | React 컴포넌트가 화면에 보여줄 JSX 구조를 작성합니다. className은 CSS 클래스, onClick 같은 속성은 이벤트 처리 함수 연결에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1160 | javascript-explainer | - | React 루트 생성 |
| src/pwa/code_explainer_rules.js | 1160 | javascript-explainer | - | React 앱을 붙일 브라우저 DOM 위치를 기준으로 렌더링 루트를 만듭니다. 보통 document.getElementById( |
| src/pwa/code_explainer_rules.js | 1160 | javascript-explainer | - | ) 같은 요소를 넘깁니다. |
| src/pwa/code_explainer_rules.js | 1175 | javascript-explainer | - | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 1175 | javascript-explainer | - | 배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다. |
| src/pwa/code_explainer_rules.js | 1184 | javascript-explainer | - | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 1184 | javascript-explainer | - | 배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다. |
| src/pwa/code_explainer_rules.js | 1208 | python-explainer | - | 문자열/배열 메서드 처리 |
| src/pwa/code_explainer_rules.js | 1208 | python-explainer | - | 문자열이나 배열에 메서드를 이어 붙여 변환, 필터링, 정렬, 결합 같은 처리를 합니다. 앞 단계의 결과가 다음 메서드로 넘어갑니다. |
| src/pwa/code_explainer_rules.js | 1214 | javascript-explainer | - | 예제 코드 문자열 |
| src/pwa/code_explainer_rules.js | 1214 | javascript-explainer | - | JavaScript 파일 안에 샘플로 들어 있는 다른 언어 코드나 설정 파일 내용입니다. 이 줄 자체가 현재 JavaScript로 실행되는 것이 아니라 화면 표시나 테스트 샘플로 쓰일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1217 | python-explainer | - | 조건 분기 |
| src/pwa/code_explainer_rules.js | 1217 | python-explainer | - | 앞 조건이 맞지 않을 때 실행할 흐름으로 넘어갑니다. if와 else가 어떤 상태를 나누는지 함께 봐야 합니다. |
| src/pwa/code_explainer_rules.js | 1228 | javascript-explainer | - | DOM 요소 생성 |
| src/pwa/code_explainer_rules.js | 1228 | javascript-explainer | - | 브라우저 화면에 넣을 HTML 요소를 JavaScript로 새로 만듭니다. 만든 요소는 아직 화면에 붙은 것이 아니므로 appendChild 같은 삽입 단계가 이어지는지 봐야 합니다. |
| src/pwa/code_explainer_rules.js | 1231 | javascript-explainer | - | DOM 텍스트 설정 |
| src/pwa/code_explainer_rules.js | 1231 | javascript-explainer | - | 화면 요소 안에 표시할 텍스트를 설정합니다. 사용자에게 보이는 문구나 버튼 라벨을 바꾸는 단계입니다. |
| src/pwa/code_explainer_rules.js | 1234 | css-explainer | - | DOM 표시 속성 설정 |
| src/pwa/code_explainer_rules.js | 1234 | css-explainer | - | 화면 요소의 CSS 클래스, HTML 내용, 입력값 같은 표시 속성을 설정합니다. 사용자에게 보이는 UI 상태를 바꾸는 단계입니다. |
| src/pwa/code_explainer_rules.js | 1237 | javascript-explainer | - | DOM 속성 설정 |
| src/pwa/code_explainer_rules.js | 1237 | javascript-explainer | - | 화면 요소에 aria-expanded 같은 HTML 속성을 설정합니다. 접근성, 상태 표시, 동작 제어에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1240 | javascript-explainer | - | DOM 요소 삽입 |
| src/pwa/code_explainer_rules.js | 1240 | javascript-explainer | - | 만들어 둔 화면 요소를 body나 다른 부모 요소 안에 실제로 붙입니다. 이 단계 이후 브라우저 화면에 요소가 나타납니다. |
| src/pwa/code_explainer_rules.js | 1243 | javascript-explainer | - | 이벤트 기본 동작 방지 |
| src/pwa/code_explainer_rules.js | 1243 | javascript-explainer | - | 클릭이나 제출 이벤트의 기본 브라우저 동작을 막습니다. 페이지 이동이나 폼 제출을 막고 JavaScript 흐름으로 처리하려는 의도입니다. |
| src/pwa/code_explainer_rules.js | 1254 | general-copy | - | Cloudflare Queue에 들어온 메시지 묶음을 처리하는 소비자 핸들러입니다. batch.messages를 반복하며 각 메시지를 처리합니다. |
| src/pwa/code_explainer_rules.js | 1285 | sql-explainer | - | D1 SQL 준비 |
| src/pwa/code_explainer_rules.js | 1285 | sql-explainer | - | Cloudflare D1에 보낼 SQL 문장을 준비합니다. SELECT는 조회, INSERT는 추가, UPDATE는 수정, DELETE는 삭제입니다. |
| src/pwa/code_explainer_rules.js | 1288 | sql-explainer | - | SQL 값 안전하게 연결 |
| src/pwa/code_explainer_rules.js | 1288 | sql-explainer | - | SQL 문장의 물음표 자리에 실제 값을 연결합니다. 문자열을 직접 붙이는 것보다 안전한 방식입니다. |
| src/pwa/code_explainer_rules.js | 1291 | sql-explainer | - | D1 쿼리 실행 |
| src/pwa/code_explainer_rules.js | 1291 | sql-explainer | - | 준비한 SQL을 실제로 실행합니다. all은 여러 행 조회, first는 한 행 조회, run은 INSERT/UPDATE/DELETE 실행에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1297 | javascript-explainer | - | 백그라운드 작업 예약 |
| src/pwa/code_explainer_rules.js | 1297 | javascript-explainer | - | 응답을 먼저 돌려준 뒤에도 로그 저장이나 캐시 갱신 같은 작업을 이어서 실행하게 합니다. |
| src/pwa/code_explainer_rules.js | 1322 | javascript-explainer | - | KV 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1322 | javascript-explainer | - | Cloudflare KV에서 값을 읽거나 씁니다. |
| src/pwa/code_explainer_rules.js | 1325 | javascript-explainer | - | R2 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1325 | javascript-explainer | - | Cloudflare R2에 있는 파일이나 객체를 읽고 쓸 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1354 | javascript-explainer | - | 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 1354 | javascript-explainer | - | 다른 JavaScript 파일이나 패키지에서 필요한 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 1360 | javascript-explainer | - | DOM 준비 후 실행 |
| src/pwa/code_explainer_rules.js | 1360 | javascript-explainer | - | HTML 문서 구조가 준비된 뒤에 화면 요소를 찾고 이벤트를 연결합니다. |
| src/pwa/code_explainer_rules.js | 1376 | javascript-explainer | - | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 1376 | javascript-explainer | - | fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1400 | javascript-explainer | - | JSON 문자열 변환 |
| src/pwa/code_explainer_rules.js | 1400 | javascript-explainer | - | JSON 문자열을 JavaScript 객체로 바꿉니다. 잘못된 JSON이면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1403 | javascript-explainer | - | JSON 문자열 만들기 |
| src/pwa/code_explainer_rules.js | 1403 | javascript-explainer | - | JavaScript 객체를 저장하거나 전송하기 쉬운 JSON 문자열로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1406 | javascript-explainer | - | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 1406 | javascript-explainer | - | fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1418 | python-explainer | - | 배열 필터링 |
| src/pwa/code_explainer_rules.js | 1418 | python-explainer | - | 배열에서 조건에 맞는 항목만 남긴 새 배열을 만듭니다. |
| src/pwa/code_explainer_rules.js | 1424 | css-explainer | - | CSS 클래스 변경 |
| src/pwa/code_explainer_rules.js | 1424 | css-explainer | - | 화면 요소의 클래스를 추가/삭제/토글해서 스타일이나 상태를 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1427 | javascript-explainer | - | data 속성 읽기 |
| src/pwa/code_explainer_rules.js | 1427 | javascript-explainer | - | HTML의 data-* 속성에 저장된 값을 읽습니다. 화면 요소의 상태나 식별값을 코드에서 사용할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 1437 | javascript-explainer | - | 이벤트 처리 함수 정의 |
| src/pwa/code_explainer_rules.js | 1437 | javascript-explainer | - | 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수 정의를 연결합니다. |
| src/pwa/code_explainer_rules.js | 1440 | javascript-explainer | - | 브라우저 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1440 | javascript-explainer | - | 현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다. |
| src/pwa/code_explainer_rules.js | 1450 | javascript-explainer | - | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 1450 | javascript-explainer | - | 값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다. |
| src/pwa/code_explainer_rules.js | 1456 | python-explainer | - | 조건 검사 |
| src/pwa/code_explainer_rules.js | 1456 | python-explainer | - | 괄호 안 조건이 맞으면 중괄호 안 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1459 | python-explainer | - | 조건이 아닐 때 |
| src/pwa/code_explainer_rules.js | 1459 | python-explainer | - | 앞 조건이 맞지 않을 때 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1468 | javascript-explainer | - | Worker/JavaScript 코드 실행 |
| src/pwa/code_explainer_rules.js | 1468 | javascript-explainer | - | JavaScript 코드 실행 |
| src/pwa/code_explainer_rules.js | 1468 | javascript-explainer | - | 이 줄은 위에서 아래로 실행되는 JavaScript 코드입니다. |
| src/pwa/code_explainer_rules.js | 1535 | sql-explainer | - | 조회할 컬럼 선택 |
| src/pwa/code_explainer_rules.js | 1535 | sql-explainer | - | 데이터베이스에서 어떤 컬럼 값을 가져올지 정합니다. COUNT 같은 집계 함수가 있으면 여러 행을 묶어 요약한 값을 함께 조회합니다. 별칭 AS가 있으면 결과 컬럼 이름을 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1540 | sql-explainer | - | 기준 테이블 선택 |
| src/pwa/code_explainer_rules.js | 1540 | sql-explainer | - | 조회의 기준이 되는 테이블을 지정합니다. 이 테이블에서 행을 읽기 시작합니다. |
| src/pwa/code_explainer_rules.js | 1546 | sql-explainer | - | 조인 조건 지정 |
| src/pwa/code_explainer_rules.js | 1546 | sql-explainer | - | 두 테이블의 어떤 컬럼이 서로 대응되는지 정합니다. 보통 id와 외래키를 비교합니다. |
| src/pwa/code_explainer_rules.js | 1549 | python-explainer | - | 조회 조건 필터 |
| src/pwa/code_explainer_rules.js | 1549 | python-explainer | - | 조건에 맞는 행만 남깁니다. 상태값, 날짜, id 같은 기준으로 결과를 줄입니다. |
| src/pwa/code_explainer_rules.js | 1552 | sql-explainer | - | 그룹으로 묶기 |
| src/pwa/code_explainer_rules.js | 1552 | sql-explainer | - | 같은 값을 가진 행들을 하나의 그룹으로 묶습니다. COUNT, SUM, AVG 같은 집계와 함께 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1555 | sql-explainer | - | 그룹 결과 조건 필터 |
| src/pwa/code_explainer_rules.js | 1555 | sql-explainer | - | GROUP BY로 묶은 뒤의 집계 결과에 조건을 걸어 필요한 그룹만 남깁니다. |
| src/pwa/code_explainer_rules.js | 1564 | sql-explainer | - | 행 추가 |
| src/pwa/code_explainer_rules.js | 1564 | sql-explainer | - | 테이블에 새 데이터를 추가합니다. 컬럼 목록과 VALUES 값의 순서가 맞아야 합니다. |
| src/pwa/code_explainer_rules.js | 1567 | sql-explainer | - | 추가할 값 지정 |
| src/pwa/code_explainer_rules.js | 1567 | sql-explainer | - | INSERT 문에서 테이블에 넣을 실제 값을 지정합니다. |
| src/pwa/code_explainer_rules.js | 1570 | sql-explainer | - | 행 수정 대상 지정 |
| src/pwa/code_explainer_rules.js | 1570 | sql-explainer | - | 어떤 테이블의 기존 데이터를 수정할지 정합니다. WHERE 없이 쓰면 많은 행이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1576 | sql-explainer | - | 행 삭제 대상 지정 |
| src/pwa/code_explainer_rules.js | 1576 | sql-explainer | - | 테이블에서 행을 삭제합니다. WHERE 조건이 없으면 많은 데이터가 삭제될 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1579 | sql-explainer | - | 테이블 생성 |
| src/pwa/code_explainer_rules.js | 1579 | sql-explainer | - | 새 테이블을 만들고 컬럼 구조를 정의합니다. |
| src/pwa/code_explainer_rules.js | 1582 | sql-explainer | - | 집계 함수 사용 |
| src/pwa/code_explainer_rules.js | 1582 | sql-explainer | - | 여러 행을 세거나 합계, 평균, 최솟값, 최댓값으로 요약합니다. |
| src/pwa/code_explainer_rules.js | 1585 | sql-explainer | - | 컬럼 이름 |
| src/pwa/code_explainer_rules.js | 1585 | sql-explainer | - | 조회하거나 그룹으로 묶을 컬럼 이름입니다. 테이블 별칭이 붙으면 어느 테이블의 컬럼인지 더 분명해집니다. |
| src/pwa/code_explainer_rules.js | 1597 | css-explainer | - | 반응형 조건 시작 |
| src/pwa/code_explainer_rules.js | 1597 | css-explainer | - | 화면 너비나 기기 조건에 따라 다른 CSS 규칙을 적용하는 구간을 시작합니다. |
| src/pwa/code_explainer_rules.js | 1600 | css-explainer | - | CSS 기능 지원 조건 |
| src/pwa/code_explainer_rules.js | 1600 | css-explainer | - | 브라우저가 특정 CSS 기능을 지원할 때만 아래 스타일을 적용합니다. |
| src/pwa/code_explainer_rules.js | 1603 | css-explainer | - | 애니메이션 단계 정의 |
| src/pwa/code_explainer_rules.js | 1603 | css-explainer | - | CSS 애니메이션에서 시간 흐름에 따라 바뀔 스타일 단계를 정의합니다. |
| src/pwa/code_explainer_rules.js | 1606 | css-explainer | - | 외부 CSS 불러오기 |
| src/pwa/code_explainer_rules.js | 1606 | css-explainer | - | 다른 CSS 파일이나 글꼴 스타일을 현재 CSS로 불러옵니다. |
| src/pwa/code_explainer_rules.js | 1609 | css-explainer | - | CSS 선택자 블록 시작 |
| src/pwa/code_explainer_rules.js | 1609 | css-explainer | - | 어떤 HTML 요소에 스타일을 적용할지 선택하고, 중괄호 안에 스타일 규칙을 작성합니다. |
| src/pwa/code_explainer_rules.js | 1612 | css-explainer | - | Flex 레이아웃 설정 |
| src/pwa/code_explainer_rules.js | 1612 | css-explainer | - | 자식 요소들을 가로/세로 방향으로 유연하게 배치하는 flex 레이아웃을 켭니다. |
| src/pwa/code_explainer_rules.js | 1615 | css-explainer | - | Grid 레이아웃 설정 |
| src/pwa/code_explainer_rules.js | 1615 | css-explainer | - | 자식 요소들을 행과 열 격자 기준으로 배치하는 grid 레이아웃을 켭니다. |
| src/pwa/code_explainer_rules.js | 1618 | css-explainer | - | Grid 행열 크기 설정 |
| src/pwa/code_explainer_rules.js | 1618 | css-explainer | - | grid 레이아웃에서 열이나 행의 개수와 크기 비율을 정합니다. |
| src/pwa/code_explainer_rules.js | 1621 | css-explainer | - | 요소 간격 설정 |
| src/pwa/code_explainer_rules.js | 1621 | css-explainer | - | flex나 grid 안의 자식 요소 사이 간격을 정합니다. |
| src/pwa/code_explainer_rules.js | 1630 | css-explainer | - | 정렬 방식 설정 |
| src/pwa/code_explainer_rules.js | 1630 | css-explainer | - | flex나 grid 안에서 자식 요소를 가로/세로 방향으로 어떻게 정렬할지 정합니다. |
| src/pwa/code_explainer_rules.js | 1633 | css-explainer | - | Flex 배치 방식 설정 |
| src/pwa/code_explainer_rules.js | 1633 | css-explainer | - | flex 아이템의 방향, 줄바꿈, 크기 비율 같은 배치 방식을 정합니다. |
| src/pwa/code_explainer_rules.js | 1651 | css-explainer | - | CSS 속성 설정 |
| src/pwa/code_explainer_rules.js | 1651 | css-explainer | - | 선택된 HTML 요소에 적용할 스타일 속성과 값을 정합니다. |
| src/pwa/code_explainer_rules.js | 1696 | css-explainer | - | 외부 리소스 연결 |
| src/pwa/code_explainer_rules.js | 1696 | css-explainer | - | CSS 파일이나 아이콘 같은 외부 리소스를 HTML 문서에 연결합니다. |
| src/pwa/code_explainer_rules.js | 1731 | devops-explainer | - | 패키지 이름 설정 |
| src/pwa/code_explainer_rules.js | 1731 | devops-explainer | - | package.json에서 이 Node/npm 프로젝트의 이름을 정합니다. |
| src/pwa/code_explainer_rules.js | 1764 | devops-explainer | - | package.json 설정 |
| src/pwa/code_explainer_rules.js | 1764 | devops-explainer | - | Node/npm 프로젝트 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1772 | devops-explainer | - | 워크플로 이름 |
| src/pwa/code_explainer_rules.js | 1772 | devops-explainer | - | GitHub Actions 화면에 표시될 자동화 작업 이름입니다. |
| src/pwa/code_explainer_rules.js | 1775 | python-explainer | - | 실행 조건 설정 |
| src/pwa/code_explainer_rules.js | 1775 | python-explainer | - | push, pull_request 같은 어떤 사건에서 자동화를 실행할지 정합니다. |
| src/pwa/code_explainer_rules.js | 1781 | python-explainer | - | 브랜치 조건 설정 |
| src/pwa/code_explainer_rules.js | 1781 | python-explainer | - | main 같은 특정 브랜치에서만 실행되도록 제한합니다. |
| src/pwa/code_explainer_rules.js | 1790 | devops-explainer | - | 작업 단계 목록 |
| src/pwa/code_explainer_rules.js | 1790 | devops-explainer | - | checkout, setup, test 같은 실제 실행 단계를 나열합니다. |
| src/pwa/code_explainer_rules.js | 1802 | devops-explainer | - | GitHub Actions YAML 설정 |
| src/pwa/code_explainer_rules.js | 1802 | devops-explainer | - | GitHub Actions 자동화 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1811 | devops-explainer | - | 베이스 이미지 선택 |
| src/pwa/code_explainer_rules.js | 1811 | devops-explainer | - | 컨테이너를 어떤 기본 이미지에서 시작할지 정합니다. Python/Node 같은 실행 환경의 출발점입니다. |
| src/pwa/code_explainer_rules.js | 1823 | devops-explainer | - | 환경변수 설정 |
| src/pwa/code_explainer_rules.js | 1823 | devops-explainer | - | 컨테이너 실행 중 사용할 환경변수를 이미지에 넣습니다. 비밀키를 직접 넣는 것은 피해야 합니다. |
| src/pwa/code_explainer_rules.js | 1829 | devops-explainer | - | 포트 안내 |
| src/pwa/code_explainer_rules.js | 1829 | devops-explainer | - | 컨테이너가 주로 사용할 포트를 문서화합니다. 실제 공개 여부는 실행 옵션이나 배포 설정에서 결정됩니다. |
| src/pwa/code_explainer_rules.js | 1835 | devops-explainer | - | Dockerfile 설정 |
| src/pwa/code_explainer_rules.js | 1835 | devops-explainer | - | 컨테이너 이미지를 만들기 위한 Dockerfile 설정 줄입니다. |
| src/pwa/code_explainer_rules.js | 1861 | python-explainer | - | 패키지 버전 고정 |
| src/pwa/code_explainer_rules.js | 1861 | python-explainer | - | Python 패키지를 특정 버전으로 고정해 재현성을 높입니다. |
| src/pwa/code_explainer_rules.js | 1867 | python-explainer | - | Python 패키지 의존성 |
| src/pwa/code_explainer_rules.js | 1867 | python-explainer | - | pip install -r requirements.txt로 설치할 Python 패키지를 적은 줄입니다. |
| src/pwa/code_explainer_rules.js | 1887 | python-explainer | - | 의존성 목록 시작 |
| src/pwa/code_explainer_rules.js | 1887 | python-explainer | - | 프로젝트 실행에 필요한 Python 패키지 목록을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1890 | python-explainer | - | 의존성 항목 |
| src/pwa/code_explainer_rules.js | 1890 | python-explainer | - | 필요한 패키지와 버전 조건을 적은 항목입니다. |
| src/pwa/code_explainer_rules.js | 1893 | python-explainer | - | pyproject.toml 설정 |
| src/pwa/code_explainer_rules.js | 1893 | python-explainer | - | Python 프로젝트 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1907 | devops-explainer | - | 컨테이너 이미지 설정 |
| src/pwa/code_explainer_rules.js | 1907 | devops-explainer | - | 서비스가 사용할 컨테이너 이미지를 지정합니다. |
| src/pwa/code_explainer_rules.js | 2002 | sql-explainer | - | TOML 테이블 배열 |
| src/pwa/code_explainer_rules.js | 2002 | sql-explainer | - | 같은 종류의 설정 묶음을 여러 개 반복해서 정의하는 영역입니다. |
| src/pwa/code_explainer_rules.js | 2005 | sql-explainer | - | TOML 테이블 |
| src/pwa/code_explainer_rules.js | 2005 | sql-explainer | - | 관련 설정값들을 묶는 TOML 구역입니다. |
| src/pwa/code_explainer_rules.js | 2049 | javascript-explainer | - | 라이브러리 불러오기 |
| src/pwa/code_explainer_rules.js | 2049 | javascript-explainer | - | Java 표준 라이브러리나 외부 클래스 기능을 현재 파일에서 사용할 수 있게 가져옵니다. |
| src/pwa/code_explainer_rules.js | 2082 | python-explainer | - | 예외 발생시키기 |
| src/pwa/code_explainer_rules.js | 2082 | python-explainer | - | 조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 예외를 발생시킵니다. |
| src/pwa/code_explainer_rules.js | 2091 | javascript-explainer | - | 맵에 값 저장 |
| src/pwa/code_explainer_rules.js | 2091 | javascript-explainer | - | Map 구조에 key와 value를 저장합니다. 같은 key가 있으면 값이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 2115 | sql-explainer | - | DB 접근 |
| src/pwa/code_explainer_rules.js | 2115 | sql-explainer | - | Java에서 데이터베이스 연결, SQL 준비, 조회/수정 실행을 처리합니다. |
| src/pwa/code_explainer_rules.js | 2121 | python-explainer | - | 조건 검사 |
| src/pwa/code_explainer_rules.js | 2121 | python-explainer | - | 조건이 맞으면 중괄호 안 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 2124 | python-explainer | - | 조건이 아닐 때 |
| src/pwa/code_explainer_rules.js | 2124 | python-explainer | - | 앞 조건이 맞지 않을 때 실행되는 부분입니다. |
| src/pwa/code_explainer_rules.js | 2127 | python-explainer | - | 반복 실행 |
| src/pwa/code_explainer_rules.js | 2127 | python-explainer | - | 정해진 조건이나 횟수에 따라 중괄호 안 코드를 반복합니다. |
| src/pwa/code_explainer_rules.js | 2133 | javascript-explainer | - | 변수 선언과 값 저장 |
| src/pwa/code_explainer_rules.js | 2133 | javascript-explainer | - | 변수의 종류를 정하고 값을 넣습니다. |
| src/pwa/code_explainer_rules.js | 2138 | javascript-explainer | - | 누적 더하기 |
| src/pwa/code_explainer_rules.js | 2138 | javascript-explainer | - | 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 2162 | devops-explainer | - | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2232 | devops-explainer | - | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2264 | python-explainer | - | 체크리스트 |
| src/pwa/code_explainer_rules.js | 2328 | javascript-explainer | - | if (/localstorage\|브라우저 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2329 | javascript-explainer | - | 저장소 |
| src/pwa/code_explainer_rules.js | 2330 | javascript-explainer | - | 저장소 |
| src/pwa/code_explainer_rules.js | 2354 | python-explainer | - | if (/try\|except\|finally\|raise\|assert\|예외\|조건 검증/.test(codeTitle)) { |
| src/pwa/code_explainer_rules.js | 2390 | devops-explainer | - | /package_json\|package\.json\|npm 스크립트\|npm\|dependencies\|devdependencies\|패키지\|의존성/.test(text) |
| src/pwa/code_explainer_rules.js | 2400 | javascript-explainer | - | if (/패키지 선언\|라이브러리 불러오기\|^package\s+\|^import\s+/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2428 | general-copy | - | if (/drivermanager\|preparedstatement\|resultset\|executequery\|executeupdate\|db 접근/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2437 | general-copy | - | if (/domcontentloaded\|document\.\|queryselector\|getelementbyid\|classlist\|dataset\|화면 요소\|css 클래스/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2454 | javascript-explainer | - | if (/env\.kv\|kv 값\|kv 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2455 | javascript-explainer | - | 처리 |
| src/pwa/code_explainer_rules.js | 2455 | javascript-explainer | - | 저장소 |
| src/pwa/code_explainer_rules.js | 2459 | javascript-explainer | - | if (/env\.r2\|r2 객체\|r2 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2460 | javascript-explainer | - | 처리 |
| src/pwa/code_explainer_rules.js | 2460 | javascript-explainer | - | 저장소 |
| src/pwa/code_explainer_rules.js | 2482 | devops-explainer | - | if (/dockerfile\|docker\|컨테이너\|베이스 이미지\|이미지 빌드\|container/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2483 | devops-explainer | - | 처리 |
| src/pwa/code_explainer_rules.js | 2483 | devops-explainer | - | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2487 | general-copy | - | if (/env_file\|\.env\|환경변수\|비밀 환경변수\|secret\|token\|password\|api[_-]?key/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2510 | powershell-explainer | - | if (/pipeline\|파이프라인\|where-object\|foreach-object\|select-object\|sort-object\|group-object\|measure-object/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2511 | powershell-explainer | - | 처리 |
| src/pwa/code_explainer_rules.js | 2511 | powershell-explainer | - | 파이프라인 |
| src/pwa/code_explainer_rules.js | 2512 | powershell-explainer | - | 파이프라인 |
| src/pwa/code_explainer_rules.js | 2541 | general-copy | - | if (/set-location\|cd\b\|path\|경로\|폴더\|file\|copy-item\|move-item\|remove-item\|new-item\|compress-archive\|expand-archive\|open\(\|read_text\|write_text\|fs\.\|파일/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2561 | python-explainer | - | if (/if\s*\(\|^if\s\|elif\|else\|switch\|case\|조건/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2562 | python-explainer | - | 조건 |
| src/pwa/code_explainer_rules.js | 2563 | python-explainer | - | 조건문 |
| src/pwa/code_explainer_rules.js | 2573 | general-copy | - | if (/try\|catch\|except\|finally\|throw\|raise\|오류 대비\|오류 처리\|exception/.test(codeTitle)) { |
| src/pwa/code_explainer_rules.js | 2577 | general-copy | - | if (/print\|write-host\|console\.log\|alert\|return\|response\.json\|new response\|출력\|응답/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2581 | general-copy | - | if (/token\|secret\|password\|auth\|authorization\|api[_-]?key\|\$env:\|process\.env\|환경변수\|보안/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2633 | python-explainer | - | Python 코드 |
| src/pwa/code_explainer_rules.js | 2634 | javascript-explainer | - | JavaScript 코드 |
| src/pwa/code_explainer_rules.js | 2667 | python-explainer | - | 조건 |
| src/pwa/code_explainer_rules.js | 2670 | javascript-explainer | - | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2670 | javascript-explainer | - | 저장소 |
| src/pwa/code_explainer_rules.js | 2670 | javascript-explainer | - | 데이터변환 |
| src/pwa/code_explainer_rules.js | 2670 | javascript-explainer | - | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2683 | python-explainer | - | 조건 |
| src/pwa/code_explainer_rules.js | 2946 | javascript-explainer | - | 생성/저장 |
| src/pwa/code_explainer_rules.js | 2949 | javascript-explainer | - | 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 2974 | javascript-explainer | - | 파일 저장 |
| src/pwa/code_explainer_rules.js | 2974 | javascript-explainer | - | 처리 결과를 파일에 저장합니다. |
| src/pwa/code_explainer_rules.js | 3203 | javascript-explainer | - | DOM 요소 생성 |
| src/pwa/code_explainer_rules.js | 3204 | javascript-explainer | - | DOM 텍스트 설정 |
| src/pwa/code_explainer_rules.js | 3205 | javascript-explainer | - | DOM 요소 삽입 |
| src/pwa/code_explainer_rules.js | 3207 | javascript-explainer | - | Node.js 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 3267 | javascript-explainer | - | 객체 생성 결과 저장 |
| src/pwa/code_explainer_rules.js | 3268 | javascript-explainer | - | 클래스로 새 객체를 만들고, 그 결과를 |
| src/pwa/code_explainer_rules.js | 3268 | javascript-explainer | - | 변수에 저장합니다. 이때 클래스의 __init__ 메서드가 객체의 초기값을 설정할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3278 | javascript-explainer | - | 미등록 함수 결과 저장 |
| src/pwa/code_explainer_rules.js | 3309 | python-explainer | - | 리스트 컴프리헨션 안의 for 부분은 원본 목록에서 값을 하나씩 꺼내 결과 리스트를 만드는 반복 흐름입니다. |
| src/pwa/code_explainer_rules.js | 3317 | python-explainer | - | 조건 검사 |
| src/pwa/code_explainer_rules.js | 3318 | python-explainer | - | 리스트 컴프리헨션 안의 if 부분은 조건에 맞는 항목만 결과 리스트에 포함하게 거르는 역할을 합니다. |
| src/pwa/code_explainer_rules.js | 3351 | javascript-explainer | - | 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수를 화면 요소에 연결합니다. async 콜백이면 내부에서 await로 비동기 작업을 기다릴 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3376 | javascript-explainer | - | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 3383 | javascript-explainer | - | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 3384 | javascript-explainer | - | 브라우저 저장소에서 꺼낸 값을 const, let, var 같은 변수 이름에 담습니다. 이후 코드에서 이 이름으로 저장된 값을 다시 사용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 4102 | javascript-explainer | - | users에 사용자 목록 저장 |
| src/pwa/code_explainer_rules.js | 4106 | python-explainer | - | active_names를 빈 리스트로 준비 |
| src/pwa/code_explainer_rules.js | 4107 | python-explainer | - | 조건에 맞는 이름을 나중에 담을 빈 상자를 만듭니다. |
| src/pwa/code_explainer_rules.js | 4118 | python-explainer | - | 조건에 맞는 이름 추가 |
| src/pwa/code_explainer_rules.js | 4119 | python-explainer | - | 조건에 맞으면 user[ |
| src/pwa/code_explainer_rules.js | 4119 | python-explainer | - | ]을 active_names에 추가합니다. 여기서는 A만 추가됩니다. |
| src/pwa/code_explainer_rules.js | 4133 | javascript-explainer | - | memo.txt 파일을 읽어 text에 저장하고 마지막에 출력합니다. 파일이 없으면 오류로 멈추지 않고 text를 빈 문자열로 바꾼 뒤 출력합니다. |
| src/pwa/code_explainer_rules.js | 4145 | javascript-explainer | - | memo.txt 파일을 UTF-8 방식으로 읽고, 그 내용을 text 변수에 저장합니다. |
| src/pwa/code_explainer_rules.js | 4175 | javascript-explainer | - | memo.txt 파일을 UTF-8 방식으로 읽고, 그 내용을 text 변수에 저장합니다. |
| src/pwa/code_explainer_rules.js | 4179 | javascript-explainer | - | 오류 없이 파일 읽기에 성공하면 text에 저장된 내용을 화면에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4221 | general-copy | - | /api/users 주소로 사용자 데이터를 요청하고, 받은 JSON 데이터를 콘솔에 출력합니다. 요청 중 오류가 나면 catch에서 오류를 출력합니다. |
| src/pwa/code_explainer_rules.js | 4225 | javascript-explainer | - | 사용자 정보를 불러오는 코드를 함수로 묶습니다. 아직 실행된 것은 아니고, 나중에 호출하면 실행됩니다. |
| src/pwa/code_explainer_rules.js | 4237 | javascript-explainer | - | res.json()은 서버 응답을 JavaScript에서 다룰 수 있는 데이터로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 4296 | javascript-explainer | - | 이 HTML은 이메일을 입력받는 간단한 폼을 만듭니다. 사용자는 입력 칸에 이메일을 넣고 Send 버튼을 누를 수 있습니다. |
| src/pwa/code_explainer_rules.js | 4311 | javascript-explainer | - | 제출 버튼 만들기 |
| src/pwa/code_explainer_rules.js | 4312 | javascript-explainer | - | 은 폼 내용을 제출하는 버튼입니다. 화면에는 Send라고 보입니다. |
| src/pwa/code_explainer_rules.js | 4325 | sql-explainer | - | orders 테이블에서 사용자별 주문 수를 세고, 주문 수가 많은 사용자부터 보여주는 SQL입니다. |
| src/pwa/code_explainer_rules.js | 4328 | sql-explainer | - | 사용자와 주문 수 선택 |
| src/pwa/code_explainer_rules.js | 4329 | sql-explainer | - | user_id별로 결과를 보여주고, COUNT(*)로 주문 개수를 셉니다. order_count는 그 개수에 붙인 이름입니다. |
| src/pwa/code_explainer_rules.js | 4332 | sql-explainer | - | orders 테이블에서 가져오기 |
| src/pwa/code_explainer_rules.js | 4333 | sql-explainer | - | 주문 데이터가 들어 있는 orders 테이블을 대상으로 조회합니다. |
| src/pwa/code_explainer_rules.js | 4337 | sql-explainer | - | GROUP BY user_id는 같은 사용자의 주문을 한 그룹으로 묶습니다. 그래야 사용자별 주문 수를 셀 수 있습니다. |
| src/pwa/code_explainer_rules.js | 4340 | sql-explainer | - | 주문 수 많은 순서로 정렬 |
| src/pwa/code_explainer_rules.js | 4341 | sql-explainer | - | ORDER BY order_count DESC는 주문 수가 큰 결과부터 보여주라는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 4447 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건을 만족하는지 |
| src/pwa/code_explainer_rules.js | 4528 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건에 맞는 값 |
| src/pwa/code_explainer_rules.js | 4535 | javascript-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 에 데이터 목록 저장 |
| src/pwa/code_explainer_rules.js | 4539 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 를 빈 리스트로 준비 |
| src/pwa/code_explainer_rules.js | 4540 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건을 통과한 |
| src/pwa/code_explainer_rules.js | 4540 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 값을 나중에 담기 위해 빈 리스트를 만듭니다. |
| src/pwa/code_explainer_rules.js | 4547 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건 검사 |
| src/pwa/code_explainer_rules.js | 4551 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건을 통과한 |
| src/pwa/code_explainer_rules.js | 4551 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 추가 |
| src/pwa/code_explainer_rules.js | 4552 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 조건이 맞으면 |
| src/pwa/code_explainer_rules.js | 4552 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | ] 값을 |
| src/pwa/code_explainer_rules.js | 4552 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 에 추가합니다. 이 예시에서는 다음 값이 들어갑니다: |
| src/pwa/code_explainer_rules.js | 4561 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 를 반복하면서 조건에 맞는 |
| src/pwa/code_explainer_rules.js | 4561 | python-explainer | GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 에 모으는 필터링 코드입니다. |
| src/pwa/code_explainer_rules.js | 4662 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 요소를 버튼처럼 찾아서 클릭 이벤트를 연결합니다. 사용자가 클릭하면 |
| src/pwa/code_explainer_rules.js | 4662 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 요소의 화면 문구가 |
| src/pwa/code_explainer_rules.js | 4662 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 로 바뀝니다. |
| src/pwa/code_explainer_rules.js | 4674 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 클릭 이벤트 연결 |
| src/pwa/code_explainer_rules.js | 4675 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 요소에 click 이벤트를 연결합니다. 사용자가 이 요소를 클릭하면 안쪽 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 4684 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 클릭을 기다렸다가 |
| src/pwa/code_explainer_rules.js | 4684 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 의 문구를 바꾸는 DOM 이벤트 코드입니다. |
| src/pwa/code_explainer_rules.js | 4709 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 브라우저 저장소(localStorage)에서 |
| src/pwa/code_explainer_rules.js | 4709 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 설정을 읽습니다. 값이 있으면 document.body.dataset. |
| src/pwa/code_explainer_rules.js | 4709 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 에 적용하고, 값이 없으면 기본값 |
| src/pwa/code_explainer_rules.js | 4709 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 를 적용합니다. |
| src/pwa/code_explainer_rules.js | 4713 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 저장된 |
| src/pwa/code_explainer_rules.js | 4713 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 설정 읽기 |
| src/pwa/code_explainer_rules.js | 4714 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | )로 브라우저에 저장된 |
| src/pwa/code_explainer_rules.js | 4714 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 값을 읽어 |
| src/pwa/code_explainer_rules.js | 4714 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 에 넣습니다. |
| src/pwa/code_explainer_rules.js | 4721 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 저장된 값 적용 |
| src/pwa/code_explainer_rules.js | 4726 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 저장된 값이 없으면 else에서 기본값 |
| src/pwa/code_explainer_rules.js | 4726 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 를 document.body.dataset. |
| src/pwa/code_explainer_rules.js | 4726 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 에 넣습니다. |
| src/pwa/code_explainer_rules.js | 4731 | javascript-explainer | GENERAL_JS_SYNTHESIS_V334_A3 | 브라우저 저장소에서 설정을 읽고, 있으면 저장값을 쓰고 없으면 기본값을 쓰는 설정 복원 코드입니다. |
| src/pwa/code_explainer_rules.js | 4788 | python-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 조건을 만족하는 항목 |
| src/pwa/code_explainer_rules.js | 4845 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | Get-ChildItem이 |
| src/pwa/code_explainer_rules.js | 4845 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 위치의 파일을 찾습니다. -Filter |
| src/pwa/code_explainer_rules.js | 4845 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 조건이 있으면 |
| src/pwa/code_explainer_rules.js | 4845 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 에 맞는 파일만 대상으로 삼습니다. |
| src/pwa/code_explainer_rules.js | 4853 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 는 결과에서 |
| src/pwa/code_explainer_rules.js | 4853 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 정보만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4856 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 파이프라인으로 순서대로 전달 |
| src/pwa/code_explainer_rules.js | 4895 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | Get-ChildItem이 |
| src/pwa/code_explainer_rules.js | 4895 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 위치의 항목을 찾습니다. -Recurse가 있으면 하위 폴더까지 포함하고, -File이 있으면 파일만 대상으로 봅니다. |
| src/pwa/code_explainer_rules.js | 4899 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | Where-Object는 앞 단계 결과 중 조건에 맞는 항목만 통과시킵니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 4899 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 조건을 봅니다. |
| src/pwa/code_explainer_rules.js | 4903 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 는 결과에서 |
| src/pwa/code_explainer_rules.js | 4903 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 정보만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4906 | powershell-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 파이프라인으로 순서대로 전달 |
| src/pwa/code_explainer_rules.js | 4907 | python-explainer | GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | \| 기호 때문에 파일 찾기 → 조건 필터링 → 필요한 열만 보기 순서로 처리됩니다. |
| src/pwa/code_explainer_rules.js | 5019 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 값을 모두 더해서 |
| src/pwa/code_explainer_rules.js | 5019 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 계산 |
| src/pwa/code_explainer_rules.js | 5020 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 행 개수를 세어서 |
| src/pwa/code_explainer_rules.js | 5020 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 계산 |
| src/pwa/code_explainer_rules.js | 5021 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 평균을 |
| src/pwa/code_explainer_rules.js | 5021 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 계산 |
| src/pwa/code_explainer_rules.js | 5022 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 최솟값을 |
| src/pwa/code_explainer_rules.js | 5022 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 계산 |
| src/pwa/code_explainer_rules.js | 5023 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 최댓값을 |
| src/pwa/code_explainer_rules.js | 5023 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 계산 |
| src/pwa/code_explainer_rules.js | 5024 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 값을 |
| src/pwa/code_explainer_rules.js | 5024 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 로 집계 |
| src/pwa/code_explainer_rules.js | 5033 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 기준으로 큰 값부터 정렬 |
| src/pwa/code_explainer_rules.js | 5034 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 기준으로 작은 값부터 정렬 |
| src/pwa/code_explainer_rules.js | 5035 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 기준으로 정렬 |
| src/pwa/code_explainer_rules.js | 5123 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 상위 |
| src/pwa/code_explainer_rules.js | 5123 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 개만 보여줍니다. |
| src/pwa/code_explainer_rules.js | 5126 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 테이블에서 |
| src/pwa/code_explainer_rules.js | 5126 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 조건에 맞는 행만 먼저 고릅니다. |
| src/pwa/code_explainer_rules.js | 5127 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 테이블의 행을 대상으로 봅니다. |
| src/pwa/code_explainer_rules.js | 5130 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 그 결과를 |
| src/pwa/code_explainer_rules.js | 5130 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 합니다. |
| src/pwa/code_explainer_rules.js | 5133 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 별로 묶은 뒤, |
| src/pwa/code_explainer_rules.js | 5133 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 합니다. |
| src/pwa/code_explainer_rules.js | 5138 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 테이블에서 데이터 읽기 |
| src/pwa/code_explainer_rules.js | 5139 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 테이블을 대상으로 쿼리를 실행한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5144 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 조건에 맞는 행만 고르기 |
| src/pwa/code_explainer_rules.js | 5145 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 조건으로 필요한 행만 먼저 남깁니다. |
| src/pwa/code_explainer_rules.js | 5150 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 별로 묶기 |
| src/pwa/code_explainer_rules.js | 5151 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 는 같은 |
| src/pwa/code_explainer_rules.js | 5151 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 값을 가진 행들을 한 묶음으로 모읍니다. |
| src/pwa/code_explainer_rules.js | 5155 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 집계 계산 |
| src/pwa/code_explainer_rules.js | 5156 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 는 각 묶음마다 |
| src/pwa/code_explainer_rules.js | 5156 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5161 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 결과 정렬 |
| src/pwa/code_explainer_rules.js | 5162 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 는 집계 결과를 |
| src/pwa/code_explainer_rules.js | 5162 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5168 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 보여줄 개수 제한 |
| src/pwa/code_explainer_rules.js | 5169 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 은 정렬된 결과 중 앞에서 |
| src/pwa/code_explainer_rules.js | 5169 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 개만 보여준다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5176 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 테이블 행을 조건으로 고르고, 그룹별로 묶어서 집계한 뒤, 필요한 순서와 개수로 보여주는 SQL 집계 쿼리입니다. |
| src/pwa/code_explainer_rules.js | 5209 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 주문 수(행 개수) |
| src/pwa/code_explainer_rules.js | 5213 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 고객(customer_id)별 |
| src/pwa/code_explainer_rules.js | 5214 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 같은 고객(customer_id) 값을 |
| src/pwa/code_explainer_rules.js | 5218 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | FROM $1 절은 |
| src/pwa/code_explainer_rules.js | 5219 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | GROUP BY $1 절은 |
| src/pwa/code_explainer_rules.js | 5220 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | ORDER BY $1 절은 |
| src/pwa/code_explainer_rules.js | 5221 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | LIMIT $1 절은 |
| src/pwa/code_explainer_rules.js | 5283 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | orders 테이블에서 사용자별 주문 수를 계산합니다. user_id별로 주문을 묶고, 주문 수(행 개수)를 order_count로 센 뒤, 주문 수가 많은 순서로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 5287 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | orders 테이블에서 데이터 읽기 |
| src/pwa/code_explainer_rules.js | 5288 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | FROM orders 절은 orders 테이블의 주문 데이터를 대상으로 쿼리를 실행한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5291 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 사용자별(user_id)로 묶기 |
| src/pwa/code_explainer_rules.js | 5292 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | GROUP BY user_id 절은 같은 사용자(user_id)의 주문 행들을 한 묶음으로 모읍니다. 그래서 사용자별 주문 수를 계산할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 5295 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 주문 수 계산 |
| src/pwa/code_explainer_rules.js | 5296 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | COUNT(*) AS order_count는 각 사용자 묶음마다 주문 수(행 개수)를 세어서 order_count라는 이름으로 보여준다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5299 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 주문 수가 많은 순서로 정렬 |
| src/pwa/code_explainer_rules.js | 5300 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | ORDER BY order_count DESC 절은 order_count가 큰 사용자부터 보여줍니다. 즉 주문 수가 많은 순서로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 5305 | sql-explainer | GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | orders 테이블에서 사용자별 주문 수를 세고, 주문 수가 많은 사용자부터 보여주는 SQL 집계 쿼리입니다. |
| src/pwa/code_explainer_rules.js | 5393 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 가로 방향으로 가운데 정렬 |
| src/pwa/code_explainer_rules.js | 5394 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 첫 항목과 마지막 항목을 양끝으로 벌려 배치 |
| src/pwa/code_explainer_rules.js | 5395 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 항목 주변에 비슷한 여백을 두고 배치 |
| src/pwa/code_explainer_rules.js | 5396 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 항목 사이 여백을 균등하게 배치 |
| src/pwa/code_explainer_rules.js | 5397 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 앞쪽부터 붙여 배치 |
| src/pwa/code_explainer_rules.js | 5398 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 끝쪽으로 붙여 배치 |
| src/pwa/code_explainer_rules.js | 5399 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 기준으로 가로 배치 |
| src/pwa/code_explainer_rules.js | 5404 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 세로 방향으로 가운데 정렬 |
| src/pwa/code_explainer_rules.js | 5405 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 세로 방향 앞쪽에 맞춤 |
| src/pwa/code_explainer_rules.js | 5406 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 세로 방향 끝쪽에 맞춤 |
| src/pwa/code_explainer_rules.js | 5407 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 세로 방향으로 늘려 맞춤 |
| src/pwa/code_explainer_rules.js | 5408 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 기준으로 세로 정렬 |
| src/pwa/code_explainer_rules.js | 5414 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 칸 grid |
| src/pwa/code_explainer_rules.js | 5415 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 1칸 grid |
| src/pwa/code_explainer_rules.js | 5416 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 구조 |
| src/pwa/code_explainer_rules.js | 5422 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 화면 폭이 |
| src/pwa/code_explainer_rules.js | 5422 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 이하일 때 |
| src/pwa/code_explainer_rules.js | 5424 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 화면 폭이 |
| src/pwa/code_explainer_rules.js | 5424 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 이상일 때 |
| src/pwa/code_explainer_rules.js | 5425 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | ) 조건일 때 |
| src/pwa/code_explainer_rules.js | 5468 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 요소 안의 내용을 flex로 배치합니다. |
| src/pwa/code_explainer_rules.js | 5470 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 합니다. |
| src/pwa/code_explainer_rules.js | 5471 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 합니다. |
| src/pwa/code_explainer_rules.js | 5472 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 항목 사이 간격은 |
| src/pwa/code_explainer_rules.js | 5472 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 둡니다. |
| src/pwa/code_explainer_rules.js | 5478 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 에 flex 배치 적용 |
| src/pwa/code_explainer_rules.js | 5479 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | display: flex 설정은 |
| src/pwa/code_explainer_rules.js | 5479 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 안의 자식 요소들을 한 줄 레이아웃으로 배치할 때 쓰는 설정입니다. |
| src/pwa/code_explainer_rules.js | 5485 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 세로 정렬 설정 |
| src/pwa/code_explainer_rules.js | 5486 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 설정은 |
| src/pwa/code_explainer_rules.js | 5486 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5492 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 가로 배치 방식 설정 |
| src/pwa/code_explainer_rules.js | 5493 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 설정은 |
| src/pwa/code_explainer_rules.js | 5493 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5499 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 항목 사이 간격 설정 |
| src/pwa/code_explainer_rules.js | 5500 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 설정은 flex 안의 항목들 사이에 |
| src/pwa/code_explainer_rules.js | 5500 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 간격을 둔다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5507 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 요소 안의 항목들을 flex 레이아웃으로 배치하고, 정렬과 간격을 조정하는 CSS입니다. |
| src/pwa/code_explainer_rules.js | 5529 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 요소를 |
| src/pwa/code_explainer_rules.js | 5529 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 배치합니다. |
| src/pwa/code_explainer_rules.js | 5530 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 항목 사이 간격은 |
| src/pwa/code_explainer_rules.js | 5530 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 둡니다. |
| src/pwa/code_explainer_rules.js | 5533 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 5540 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 에 grid 배치 적용 |
| src/pwa/code_explainer_rules.js | 5541 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | display: grid 설정은 |
| src/pwa/code_explainer_rules.js | 5541 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 안의 항목들을 행과 열이 있는 격자 형태로 배치한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5547 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 기본 열 구조 설정 |
| src/pwa/code_explainer_rules.js | 5548 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 설정은 기본 화면에서 |
| src/pwa/code_explainer_rules.js | 5548 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 배치한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5554 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | grid 항목 간격 설정 |
| src/pwa/code_explainer_rules.js | 5555 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 설정은 grid 항목들 사이에 |
| src/pwa/code_explainer_rules.js | 5555 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 간격을 둔다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5561 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 반응형 조건 설정 |
| src/pwa/code_explainer_rules.js | 5562 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | ) 조건은 |
| src/pwa/code_explainer_rules.js | 5562 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 안쪽 CSS를 적용한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5567 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 작은 화면 열 구조 변경 |
| src/pwa/code_explainer_rules.js | 5568 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 의 grid-template-columns를 |
| src/pwa/code_explainer_rules.js | 5568 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 로 바꿉니다. 즉 |
| src/pwa/code_explainer_rules.js | 5568 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 가 됩니다. |
| src/pwa/code_explainer_rules.js | 5576 | css-explainer | GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | grid 레이아웃을 만들고, 화면 크기에 따라 열 개수를 바꾸는 반응형 CSS입니다. |
| src/pwa/code_explainer_rules.js | 5660 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 컨테이너가 시작될 때 npm start를 실행 |
| src/pwa/code_explainer_rules.js | 5707 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 이미지를 기반으로 컨테이너를 만듭니다. |
| src/pwa/code_explainer_rules.js | 5709 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | npm ci로 의존성을 설치합니다. |
| src/pwa/code_explainer_rules.js | 5710 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 필요한 파일을 컨테이너 안으로 복사합니다. |
| src/pwa/code_explainer_rules.js | 5840 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 워크플로우는 |
| src/pwa/code_explainer_rules.js | 5840 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 실행됩니다. |
| src/pwa/code_explainer_rules.js | 5844 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | npm ci로 의존성을 설치합니다. |
| src/pwa/code_explainer_rules.js | 5845 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | npm test로 테스트를 실행합니다. |
| src/pwa/code_explainer_rules.js | 5853 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 은 GitHub Actions 화면에 표시될 자동화 이름입니다. |
| src/pwa/code_explainer_rules.js | 5857 | python-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 실행 조건 설정 |
| src/pwa/code_explainer_rules.js | 5870 | javascript-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 저장소 코드 가져오기 |
| src/pwa/code_explainer_rules.js | 5871 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | actions/checkout은 GitHub 저장소의 코드를 워크플로우 실행 환경으로 내려받는 단계입니다. |
| src/pwa/code_explainer_rules.js | 5885 | devops-explainer | GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | npm ci는 package-lock.json 기준으로 필요한 패키지를 깨끗하게 설치합니다. |
| src/pwa/code_explainer.js | 38 | javascript-explainer | - | 저장했습니다. |
| src/pwa/code_explainer.js | 206 | python-explainer | - | Python은 변수, 조건문, 반복문, 함수, 파일/JSON/CSV/API 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 207 | javascript-explainer | - | JavaScript는 웹페이지 동작, DOM, localStorage, fetch 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 210 | devops-explainer | - | package.json은 npm scripts, dependencies, devDependencies를 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 211 | devops-explainer | - | GitHub Actions YAML은 on, jobs, runs-on, steps, uses, run 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 214 | python-explainer | - | requirements.txt는 Python 패키지와 버전 고정 방식을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 215 | python-explainer | - | pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 220 | sql-explainer | - | TOML 설정은 테이블, 키-값, 목록 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 272 | python-explainer | - | Python import 문이 보입니다. |
| src/pwa/code_explainer.js | 273 | python-explainer | - | Python 함수 정의가 보입니다. |
| src/pwa/code_explainer.js | 274 | python-explainer | - | Python 클래스 정의가 보입니다. |
| src/pwa/code_explainer.js | 278 | javascript-explainer | - | JavaScript 변수 선언이 보입니다. |
| src/pwa/code_explainer.js | 279 | javascript-explainer | - | 브라우저 DOM/이벤트 코드가 보입니다. |
| src/pwa/code_explainer.js | 280 | javascript-explainer | - | JavaScript 함수 패턴이 보입니다. |
| src/pwa/code_explainer.js | 296 | devops-explainer | - | npm 의존성 영역이 보입니다. |
| src/pwa/code_explainer.js | 300 | devops-explainer | - | GitHub Actions의 on/jobs 구조가 보입니다. |
| src/pwa/code_explainer.js | 301 | devops-explainer | - | actions/checkout 같은 GitHub Action 사용이 보입니다. |
| src/pwa/code_explainer.js | 305 | devops-explainer | - | Dockerfile FROM 베이스 이미지 줄이 보입니다. |
| src/pwa/code_explainer.js | 315 | python-explainer | - | Python 패키지 버전 조건이 보입니다. |
| src/pwa/code_explainer.js | 321 | python-explainer | - | Python build-system 설정이 보입니다. |
| src/pwa/code_explainer.js | 346 | sql-explainer | - | TOML 테이블([table])이 보입니다. |
| src/pwa/code_explainer.js | 521 | general-copy | - | if (keyword === "test" && /test\|validation\|regression\|quality\|검증/.test(text)) score += 6 |
| src/pwa/code_explainer.js | 522 | general-copy | - | if (keyword === "security" && /secret\|token\|auth\|env\|security\|보안/.test(text)) score += 6 |
| src/pwa/code_explainer.js | 744 | python-explainer | - | 현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다. |
| src/pwa/code_explainer.js | 800 | python-explainer | - | >현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.</p> |
| src/pwa/code_explainer.js | 925 | python-explainer | - | 조건에 맞는 값을 모아둘 빈 목록으로 보입니다. |
| src/pwa/code_explainer.js | 927 | python-explainer | - | JSON 데이터를 Python에서 다루는 값으로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 928 | python-explainer | - | Python 데이터를 JSON 형태로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 998 | python-explainer | - | 조건: |
| src/pwa/code_explainer.js | 1027 | python-explainer | - | 입력 목록을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다. |
| src/pwa/code_explainer.js | 1056 | general-copy | - | if (ir.variables.some(function(v) { return /\[\]\|목록\|list/i.test(v.expr + " " + v.role); })) concepts.add("list") |
| src/pwa/code_explainer.js | 1057 | general-copy | - | if (ir.variables.some(function(v) { return /\{\}\|사전\|dict/i.test(v.expr + " " + v.role); })) concepts.add("dict") |
| src/pwa/code_explainer.js | 1311 | python-explainer | - | JSON 문자열이나 파일 내용을 Python 데이터로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1315 | javascript-explainer | - | 파일 저장/읽기 위치를 나타내는 값입니다. |
| src/pwa/code_explainer.js | 1337 | python-explainer | - | 파일을 열어 JSON 데이터를 읽고 Python 데이터로 바꿔 반환하는 파일 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 1341 | javascript-explainer | - | 경로를 만들고 텍스트나 보고서를 파일에 저장한 뒤 결과 경로를 반환하는 파일 저장 함수로 보입니다. |
| src/pwa/code_explainer.js | 1388 | javascript-explainer | - | write_text로 텍스트를 파일에 저장합니다. |
| src/pwa/code_explainer.js | 1400 | python-explainer | - | json.loads로 JSON 문자열을 Python 데이터로 바꿉니다. |
| src/pwa/code_explainer.js | 1404 | python-explainer | - | json.dumps로 Python 데이터를 JSON 문자열로 바꿉니다. |
| src/pwa/code_explainer.js | 1406 | javascript-explainer | - | json.dump로 Python 데이터를 JSON 파일에 저장합니다. |
| src/pwa/code_explainer.js | 1558 | python-explainer | - | 조건에 맞는 값을 모아둘 빈 배열로 보입니다. |
| src/pwa/code_explainer.js | 1559 | javascript-explainer | - | 키와 값을 묶어 저장할 빈 객체로 보입니다. |
| src/pwa/code_explainer.js | 1560 | javascript-explainer | - | JSON 문자열을 JavaScript 값으로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1561 | javascript-explainer | - | JavaScript 값을 JSON 문자열로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1628 | python-explainer | - | 조건으로 반복합니다. |
| src/pwa/code_explainer.js | 1720 | javascript-explainer | - | JSON 데이터를 JavaScript 값으로 바꾸거나 문자열로 변환하는 데이터 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 1724 | python-explainer | - | 입력 배열을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다. |
| src/pwa/code_explainer.js | 1732 | javascript-explainer | - | 입력값이나 내부 계산값을 처리해 결과를 반환하는 JavaScript 함수로 보입니다. |
| src/pwa/code_explainer.js | 1735 | javascript-explainer | - | JavaScript 코드 흐름을 함수 단위로 묶어 실행하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1754 | python-explainer | - | 조건: |
| src/pwa/code_explainer.js | 1962 | javascript-explainer | - | 응답 본문을 JSON으로 변환해 얻은 JavaScript 데이터입니다. |
| src/pwa/code_explainer.js | 1985 | javascript-explainer | - | 다른 파일에서 import해 쓸 수 있도록 공개된 JavaScript 함수로, 입력을 처리해 결과를 반환합니다. |
| src/pwa/code_explainer.js | 1993 | javascript-explainer | - | await로 비동기 작업 결과를 기다린 뒤 다음 처리를 이어가는 JavaScript 함수로 보입니다. |
| src/pwa/code_explainer.js | 2118 | python-explainer | - | json.load/load는 JSON을 Python 데이터로 읽고, json.dump/dumps는 Python 데이터를 JSON 형태로 내보내는 역할입니다. |
| src/pwa/code_explainer.js | 2160 | python-explainer | - | 파일에서 JSON 데이터를 읽어 Python에서 다룰 수 있는 값으로 바꾸는 데이터 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 2199 | javascript-explainer | - | DOM 코드는 document로 화면 요소를 찾고, 값 변경이나 이벤트 연결로 사용자가 보는 UI를 바꿉니다. |
| src/pwa/code_explainer.js | 2203 | javascript-explainer | - | localStorage/sessionStorage는 브라우저 안에 작은 값을 저장해 새로고침 후에도 다시 사용할 수 있게 합니다. |
| src/pwa/code_explainer.js | 2207 | javascript-explainer | - | JSON.parse/stringify 또는 response.json은 문자열/응답 데이터를 JavaScript 객체로 바꾸거나 다시 문자열로 바꿉니다. |
| src/pwa/code_explainer.js | 2242 | javascript-explainer | - | 배열 데이터를 화면에 표시하기 좋은 형태로 바꾼 뒤 DOM에 반영하는 UI 렌더링 함수로 보입니다. |
| src/pwa/code_explainer.js | 2276 | python-explainer | - | Python 함수 |
| src/pwa/code_explainer.js | 2277 | python-explainer | - | Python async 메서드 |
| src/pwa/code_explainer.js | 2278 | python-explainer | - | Python 클래스 메서드 |
| src/pwa/code_explainer.js | 2279 | python-explainer | - | Python async 함수 |
| src/pwa/code_explainer.js | 2280 | python-explainer | - | Python 함수 |
| src/pwa/code_explainer.js | 2418 | python-explainer | - | 조건이 참인 동안 반복합니다. |
| src/pwa/code_explainer.js | 2443 | python-explainer | - | 컴프리헨션으로 반복과 생성/필터링을 한 줄에 압축했습니다. |
| src/pwa/code_explainer.js | 2451 | python-explainer | - | 앞 조건이 거짓일 때 실행되는 else 흐름입니다. |
| src/pwa/code_explainer.js | 2479 | python-explainer | - | Python 함수 |
| src/pwa/code_explainer.js | 2647 | python-explainer | - | async/await로 외부 작업이 끝나기를 기다린 뒤 결과를 처리하는 비동기 Python 함수로 보입니다. |
| src/pwa/code_explainer.js | 2649 | python-explainer | - | 클래스 안에서 조건을 검사하고 필요하면 예외를 발생시키는 검증 메서드로 보입니다. |
| src/pwa/code_explainer.js | 2655 | python-explainer | - | 조건을 검사하고 문제가 있으면 예외를 발생시키는 방어적 검증 함수로 보입니다. |
| src/pwa/code_explainer.js | 2856 | css-explainer | - | classList로 화면 요소의 CSS 클래스를 바꿉니다. |
| src/pwa/code_explainer.js | 2874 | javascript-explainer | - | 로 브라우저 저장소를 사용합니다. |
| src/pwa/code_explainer.js | 2913 | javascript-explainer | - | JSON 데이터를 JavaScript 객체나 문자열로 변환합니다. |
| src/pwa/code_explainer.js | 2926 | javascript-explainer | - | JavaScript 함수 |
| src/pwa/code_explainer.js | 3026 | javascript-explainer | - | 이벤트 |
| src/pwa/code_explainer.js | 3026 | javascript-explainer | - | 이벤트가 발생했을 때 화면 값, 저장소, DOM 변경을 처리하는 UI 이벤트 콜백으로 보입니다. |
| src/pwa/code_explainer.js | 3075 | javascript-explainer | - | DOM 요소에 이벤트 리스너를 연결해 사용자의 클릭/입력 같은 행동을 처리하도록 준비하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 3077 | javascript-explainer | - | 화면 요소를 찾고 내용을 바꿔 브라우저 UI를 갱신하는 DOM 조작 함수로 보입니다. |
| src/pwa/code_explainer.js | 3079 | javascript-explainer | - | 브라우저 저장소를 읽거나 써서 사용자 입력값이나 상태를 보존하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 3128 | python-explainer | - | 입력, 조건, 반복, 호출, 반환처럼 함수 내부 실행 순서를 보여주는 도식입니다. |
| src/pwa/code_explainer.js | 3133 | javascript-explainer | - | 클릭/입력 이벤트, DOM 변경, fetch/await/Promise 같은 브라우저 흐름을 보여주는 도식입니다. |
| src/pwa/code_explainer.js | 3193 | python-explainer | - | 조건 |
| src/pwa/code_explainer.js | 3199 | javascript-explainer | - | DOM 조회 |
| src/pwa/code_explainer.js | 3200 | javascript-explainer | - | DOM 변경 |
| src/pwa/code_explainer.js | 3368 | javascript-explainer | - | 변수 |
| src/pwa/code_explainer.js | 3368 | javascript-explainer | - | 저장 |
| src/pwa/code_explainer.js | 3371 | python-explainer | - | 조건 |
| src/pwa/code_explainer.js | 3372 | python-explainer | - | 리스트 |
| src/pwa/code_explainer.js | 3372 | python-explainer | - | 추가 |
| src/pwa/code_explainer.js | 3373 | python-explainer | - | 리스트 |
| src/pwa/code_explainer.js | 3373 | python-explainer | - | 배열 |
| src/pwa/code_explainer.js | 3374 | python-explainer | - | 딕셔너리 |
| src/pwa/code_explainer.js | 3374 | python-explainer | - | 사전 |
| src/pwa/code_explainer.js | 3414 | javascript-explainer | - | 변수 |
| src/pwa/code_explainer.js | 3415 | python-explainer | - | 리스트 |
| src/pwa/code_explainer.js | 3416 | python-explainer | - | 조건 |
| src/pwa/code_explainer.js | 3419 | general-copy | - | if (keyword === "json" && /json\|load\|loads\|dump\|dumps\|파싱\|인코딩\|디코딩/.test(text)) score += 8 |
| src/pwa/code_explainer.js | 3721 | javascript-explainer | - | 이벤트/DOM 연결 |
| src/pwa/code_explainer.js | 3723 | javascript-explainer | - | 데이터/상태/저장 |
| src/pwa/code_explainer.js | 3784 | javascript-explainer | - | DOM/UI 이벤트 흐름 포함 |
| src/pwa/code_explainer.js | 3785 | javascript-explainer | - | 저장/JSON 데이터 흐름 포함 |
| src/pwa/code_explainer.js | 4051 | javascript-explainer | - | 저장/JSON |
| src/pwa/code_explainer.js | 4346 | python-explainer | - | >대형 파일에서는 전체 뼈대를 먼저 보고, 검색/필터로 함수를 찾은 뒤 하나를 골라 단독 해석할 수 있습니다.</p> |
| src/pwa/code_explainer.js | 4350 | python-explainer | - | >검색 결과가 길어 처음 |
| src/pwa/code_explainer.js | 4350 | python-explainer | - | 개만 표시합니다. 검색어나 역할군 필터로 더 좁혀보세요.</p> |
| src/pwa/code_explainer.js | 4355 | python-explainer | - | >검색/필터 조건에 맞는 함수가 없습니다.</p> |
| src/pwa/code_explainer.js | 4559 | python-explainer | - | 조건 |
| src/pwa/code_explainer.js | 4559 | python-explainer | - | 반복 |
| src/pwa/code_explainer.js | 4559 | python-explainer | - | 검증 |
| src/pwa/code_explainer.js | 4559 | python-explainer | - | 4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다. |
| src/pwa/code_explainer.js | 4875 | python-explainer | - | 이 코드에서 가장 분명한 결과는 조건에 맞는 사람의 이름 목록을 만드는 것입니다. 그 결과를 만드는 핵심 함수는 |
| src/pwa/code_explainer.js | 4875 | python-explainer | - | 입니다. |
| src/pwa/code_explainer.js | 4887 | python-explainer | - | 이 코드에서 가장 분명한 결과는 조건에 맞는 값을 골라 목록으로 모으는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4887 | python-explainer | - | 입니다. |
| src/pwa/code_explainer.js | 4895 | python-explainer | - | 이 코드에서 가장 분명한 결과는 조건에 맞는 개수를 세는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4895 | python-explainer | - | 입니다. |
| src/pwa/code_explainer.js | 4929 | python-explainer | - | <p><strong>무슨 일을 하나요?</strong><br>사람 목록(users)에서 조건에 맞는 사람의 이름만 골라냅니다.</p> |
| src/pwa/code_explainer.js | 4933 | python-explainer | - | <p><strong>최종 결과는?</strong><br>조건에 맞는 사람들의 이름 목록을 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4940 | python-explainer | - | <p><strong>무슨 일을 하나요?</strong><br>목록에서 조건에 맞는 값만 골라 새 목록에 모읍니다.</p> |
| src/pwa/code_explainer.js | 4948 | python-explainer | - | <p><strong>무슨 일을 하나요?</strong><br>조건에 맞는 항목이 몇 개인지 셉니다.</p> |
| src/pwa/code_explainer.js | 4956 | general-copy | - | <p><strong>무슨 일을 하나요?</strong><br>파일, 경로, JSON 문자열 같은 입력을 읽어서 코드에서 사용할 데이터로 바꿉니다.</p> |
| src/pwa/code_explainer.js | 4982 | general-copy | - | <p><strong>아직 모르는 점</strong><br>load_handler 같은 외부 함수가 이 코드 안에 없으면, 실제로 어떤 함수를 고르는지는 아직 알 수 없습니다.</p> |
| src/pwa/code_explainer.js | 5005 | python-explainer | - | 점수 여러 개가 들어 있는 목록 |
| src/pwa/code_explainer.js | 5024 | python-explainer | - | 딕셔너리에서 값을 찾을 때 쓰는 이름 |
| src/pwa/code_explainer.js | 5089 | python-explainer | - | 조건에 맞으면 user의 name을 result에 넣습니다. |
| src/pwa/code_explainer.js | 5138 | general-copy | - | >참고: load_handler는 이 코드 조각 안에 정의되어 있지 않아서, 실제 연결 대상은 추가 코드가 있어야 더 정확히 설명할 수 있습니다.</p> |
| src/pwa/code_explainer.js | 5260 | javascript-explainer | - | 변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 5325 | javascript-explainer | - | >기본 화면에서는 그림을 바로 펼치지 않습니다. 코드를 먼저 읽고, 흐름이 필요할 때 아래 버튼으로 그림을 생성하세요. 감지된 단계는 |
| src/pwa/code_explainer.js | 5325 | javascript-explainer | - | 개입니다.</p> |
| src/pwa/app.js | 27 | python-explainer | - | 리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다. |
| src/pwa/app.js | 55 | python-explainer | - | 조건이 맞을 때만 특정 코드를 실행한다. |
| src/pwa/app.js | 59 | python-explainer | - | 리스트 끝에 새 값을 추가한다. 필터링 결과를 모을 때 자주 쓴다. |
| src/pwa/app.js | 83 | javascript-explainer | - | 파이썬 dict/list를 JSON 문자열로 바꾼다. JSONL 저장 시 자주 쓴다. |
| src/pwa/app.js | 87 | javascript-explainer | - | 한 줄에 JSON 하나씩 저장하는 형식이다. LLM 학습 데이터, 로그, KG chunks/nodes/edges에 자주 쓰인다. |
| src/pwa/app.js | 163 | general-copy | - | return /예시\|예:\|예를 들어\|print\(\|console\.log\|\[[^\]]+\]\|\{[^}]+\}\|=\|=>\|->\|정답\|출력은\|출력:/i.test(text) |
| src/pwa/app.js | 1209 | javascript-explainer | - | 카드 메모를 저장했습니다. |
| src/pwa/app.js | 1224 | javascript-explainer | - | 개념 메모를 저장했습니다. |
| src/pwa/app.js | 1274 | javascript-explainer | - | >아직 저장된 메모가 없습니다.</p> |
| src/pwa/app.js | 1303 | javascript-explainer | - | - 저장 위치: 이 파일은 브라우저 localStorage 메모를 Markdown으로 내보낸 백업입니다. |
| src/pwa/app.js | 1729 | python-explainer | - | >오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div> |
| src/pwa/app.js | 1883 | python-explainer | - | <button type="button" id="studyToolsApply">조건 적용</button> |
| src/pwa/app.js | 1886 | python-explainer | - | <button type="button" id="studyToolsClear" class="secondary">조건 초기화</button> |
| src/pwa/app.js | 1938 | python-explainer | - | 조건 일치 |
| src/pwa/app.js | 1938 | python-explainer | - | 장 / 전체 |
| src/pwa/app.js | 1938 | python-explainer | - | 장 · 본 카드 |
| src/pwa/app.js | 1938 | python-explainer | - | 장 · 모르겠음 |
| src/pwa/app.js | 1950 | python-explainer | - | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 1968 | python-explainer | - | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 2015 | python-explainer | - | · 현재 필터 기준으로 검색/오늘 큐 생성 |
| src/pwa/app.js | 2076 | python-explainer | - | 현재 조건으로 오늘 최대 10장 |
| src/pwa/app.js | 2091 | python-explainer | - | const match = statusText.match(/조건 일치\s+(\d+)장/) |
| src/pwa/app.js | 2096 | python-explainer | - | 조건에 맞는 카드가 10장 미만이라 |
| src/pwa/app.js | 2096 | python-explainer | - | 장까지만 만들 수 있습니다. |
| src/pwa/app.js | 2102 | python-explainer | - | 현재 조건: <b> |
| src/pwa/app.js | 2102 | python-explainer | - | </b> · 오늘 큐 <b> |
| src/pwa/app.js | 2102 | python-explainer | - | 장</b>. |
| src/pwa/app.js | 2102 | python-explainer | - | 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요. |
| src/pwa/app.js | 2362 | general-copy | - | <button type="button" id="studyQueueDoneV72" class="secondary">현재 카드 완료 표시</button> |
| src/pwa/app.js | 2364 | general-copy | - | <button type="button" id="studyQueueResetV72" class="secondary">큐 완료표시 초기화</button> |
| src/pwa/app.js | 2565 | python-explainer | - | >오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div> |
| src/pwa/app.js | 2719 | python-explainer | - | <button type="button" id="studyToolsApply">조건 적용</button> |
| src/pwa/app.js | 2722 | python-explainer | - | <button type="button" id="studyToolsClear" class="secondary">조건 초기화</button> |
| src/pwa/app.js | 2774 | python-explainer | - | 조건 일치 |
| src/pwa/app.js | 2774 | python-explainer | - | 장 / 전체 |
| src/pwa/app.js | 2774 | python-explainer | - | 장 · 본 카드 |
| src/pwa/app.js | 2774 | python-explainer | - | 장 · 모르겠음 |
| src/pwa/app.js | 2786 | python-explainer | - | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 2804 | python-explainer | - | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 3061 | general-copy | - | <button type="button" id="studyToolsRecommendApplyV272" class="secondary">추천만 적용</button> |
| src/pwa/index.html | 74 | javascript-explainer | - | <button id="saveCardMemoBtn">카드 메모 저장</button> |
| src/pwa/index.html | 101 | javascript-explainer | - | <button id="saveConceptMemoBtn">개념 메모 저장</button> |
| src/pwa/index.html | 117 | javascript-explainer | - | <span class="muted">이 메모는 현재 브라우저에만 저장됩니다.</span> |
| src/pwa/index.html | 138 | python-explainer | - | <li>Python 함수, 조건, 반복, 반환 흐름 요약</li> |
| src/pwa/index.html | 139 | javascript-explainer | - | <li>JavaScript 기본 함수, DOM, 이벤트 패턴 설명</li> |
| src/pwa/index.html | 192 | general-copy | - | <p id="codeLangHint" class="code-lang-hint">언어를 고른 뒤 “선택 언어 예제”를 누르면 해당 언어 예제가 들어갑니다.</p> |
| src/pwa/index.html | 193 | general-copy | - | <div id="codeDetectionDetails" class="code-detection-details muted">분석하면 자동감지 결과와 판단 근거가 표시됩니다.</div> |
| src/pwa/index.html | 211 | general-copy | - | <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div> |
| src/pwa/index.html | 213 | general-copy | - | <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div> |
| src/pwa/index.html | 214 | general-copy | - | <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div> |
| src/pwa/index.html | 221 | general-copy | - | <div id="codeRelatedCards" class="code-related-cards muted">분석 결과와 연결되는 보충 사이드카드가 있으면 여기에 표시됩니다.</div> |
| src/pwa/index.html | 229 | general-copy | - | <p class="code-diagram-hint">흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.</p> |
| src/pwa/index.html | 271 | javascript-explainer | - | <option value="git_save_flow">Git 저장 흐름</option> |
| src/pwa/index.html | 278 | javascript-explainer | - | <button id="loadCommandSampleBtn" type="button">선택 예제 불러오기</button> |
| src/pwa/index.html | 283 | general-copy | - | <div id="commandSampleDescription" class="command-sample-description-v289 muted">예제를 선택하면 어떤 흐름을 연습하는지 여기에 표시됩니다.</div> |
| src/pwa/index.html | 347 | general-copy | - | <div id="projectAnalysisSummary" class="project-analysis-summary muted">아직 분석 결과가 없습니다.</div> |
| index.html | 52 | javascript-explainer | - | <p>자동으로 이동하지 않으면 아래 버튼을 누르세요.</p> |

## All Extracted Korean Rows

| file | line | priority | category | Korean copy |
|---|---:|---|---|---|
| src/pwa/code_explainer_rules.js | 45 | low | general-copy | // 닫는 중괄호/괄호만 있는 줄은 설명 step으로 만들지 않는다. |
| src/pwa/code_explainer_rules.js | 48 | medium | app-ui | // JS/Workers 객체 리터럴의 단순 키 시작 줄은 실제 동작이 아니라 구조 보조 줄이다. |
| src/pwa/code_explainer_rules.js | 109 | medium | unknown-action-ui | // Dockerfile은 Python의 `from ... import ...`와 헷갈리지 않도록 대문자 명령 위주로 판단한다. |
| src/pwa/code_explainer_rules.js | 145 | low | general-copy | // INI는 host=127.0.0.1, token=replace_me처럼 따옴표 없는 값이 자주 나오고 |
| src/pwa/code_explainer_rules.js | 146 | low | general-copy | // TOML은 문자열을 따옴표로 감싸거나 배열/boolean/number 형태가 더 명확하다. |
| src/pwa/code_explainer_rules.js | 238 | low | general-copy | if (/자동 규칙에 없는/.test(e)) { |
| src/pwa/code_explainer_rules.js | 242 | medium | unknown-action-ui | if (/^(코드 실행\|Python 코드 실행\|JavaScript 코드 실행\|Worker\/JavaScript 코드 실행\|명령 실행\|Python 명령 실행)$/.test(t)) { |
| src/pwa/code_explainer_rules.js | 246 | low | general-copy | if (/미등록 함수/.test(t)) { |
| src/pwa/code_explainer_rules.js | 250 | medium | unknown-action-ui | if (/변수에 값 저장\|값 반환\|값 돌려주기\|Markdown 문단\|YAML 설정\|TOML 설정\|INI 설정\|객체 속성 설정\|문자열 데이터 항목\|예제 코드 문자열\|블록\/객체 닫기\|딕셔너리 항목 설정\|함수 호출\|입력 파라미터 선언\|문자열\/HTML 조각\|예제\/문서 문자열\|객체\/배열 값 항목\|변수 선언\|오류 발생\|반복 다음 항목으로 이동\|코드블록 경계\|예제 명령 문자열\|배열 데이터 항목\|조건부 UI 조각\|반응형 화면 조건 확인\|DOM 스타일 설정\|중첩 객체 값 갱신\|배열\/문자열 길이 계산\|객체 메서드 호출\|블록\/콜백 닫기\|조건\/표현식 경계\|정규식 조건 검사\|UI 조각 연결\|콜백 결과 저장\|Blob 파일 데이터 생성\|화면\/콘솔에 출력\|메서드 체인 이어쓰기/.test(t)) { |
| src/pwa/code_explainer_rules.js | 258 | low | general-copy | 확실 |
| src/pwa/code_explainer_rules.js | 259 | low | general-copy | 추정 |
| src/pwa/code_explainer_rules.js | 260 | medium | unknown-action-ui | 미지원 |
| src/pwa/code_explainer_rules.js | 261 | low | general-copy | 추정 |
| src/pwa/code_explainer_rules.js | 319 | high | powershell-explainer | 각 항목 반복 처리 |
| src/pwa/code_explainer_rules.js | 319 | high | powershell-explainer | 파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다. |
| src/pwa/code_explainer_rules.js | 323 | medium | unknown-action-ui | 작업 폴더 이동 |
| src/pwa/code_explainer_rules.js | 323 | medium | unknown-action-ui | 이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다. |
| src/pwa/code_explainer_rules.js | 326 | medium | unknown-action-ui | 환경변수 설정 |
| src/pwa/code_explainer_rules.js | 326 | medium | unknown-action-ui | 현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다. |
| src/pwa/code_explainer_rules.js | 331 | medium | unknown-action-ui | 오류 시 즉시 중단 설정 |
| src/pwa/code_explainer_rules.js | 331 | medium | unknown-action-ui | PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다. |
| src/pwa/code_explainer_rules.js | 340 | high | javascript-explainer | 시간값을 변수에 저장 |
| src/pwa/code_explainer_rules.js | 340 | high | javascript-explainer | 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다. |
| src/pwa/code_explainer_rules.js | 343 | medium | unknown-action-ui | 경로 확인 결과 저장 |
| src/pwa/code_explainer_rules.js | 343 | medium | unknown-action-ui | 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 346 | medium | unknown-action-ui | 웹 요청 결과 저장 |
| src/pwa/code_explainer_rules.js | 346 | medium | unknown-action-ui | 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 349 | high | javascript-explainer | 경로 조합 결과 저장 |
| src/pwa/code_explainer_rules.js | 349 | high | javascript-explainer | 변수에 여러 경로 조각을 합친 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 355 | high | powershell-explainer | CSV 읽기 결과 저장 |
| src/pwa/code_explainer_rules.js | 355 | high | powershell-explainer | 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 358 | medium | unknown-action-ui | CSV 파이프라인 요약 저장 |
| src/pwa/code_explainer_rules.js | 358 | medium | unknown-action-ui | 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 362 | medium | unknown-action-ui | JSON 처리 결과 저장 |
| src/pwa/code_explainer_rules.js | 362 | medium | unknown-action-ui | 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 365 | high | javascript-explainer | 파일 내용 읽기 결과 저장 |
| src/pwa/code_explainer_rules.js | 365 | high | javascript-explainer | 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다. |
| src/pwa/code_explainer_rules.js | 368 | medium | unknown-action-ui | 파이프라인 결과 저장 |
| src/pwa/code_explainer_rules.js | 368 | medium | unknown-action-ui | 변수에 여러 명령을 파이프(\|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 371 | medium | unknown-action-ui | 프로세스 실행 결과 저장 |
| src/pwa/code_explainer_rules.js | 371 | medium | unknown-action-ui | 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 374 | high | javascript-explainer | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 374 | high | javascript-explainer | 변수에 값을 넣습니다. 이후 줄에서 $ |
| src/pwa/code_explainer_rules.js | 374 | high | javascript-explainer | 을 쓰면 이 값을 다시 사용합니다. |
| src/pwa/code_explainer_rules.js | 378 | low | general-copy | 현재 시간 만들기 |
| src/pwa/code_explainer_rules.js | 378 | low | general-copy | 현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 382 | low | general-copy | 입력 파라미터 정의 |
| src/pwa/code_explainer_rules.js | 382 | low | general-copy | 스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 386 | low | general-copy | 입력 파라미터 기본값 |
| src/pwa/code_explainer_rules.js | 386 | low | general-copy | param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다. |
| src/pwa/code_explainer_rules.js | 389 | medium | unknown-action-ui | PowerShell 객체 만들기 |
| src/pwa/code_explainer_rules.js | 389 | medium | unknown-action-ui | 여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 392 | medium | unknown-action-ui | 객체 속성 값 설정 |
| src/pwa/code_explainer_rules.js | 392 | medium | unknown-action-ui | PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다. |
| src/pwa/code_explainer_rules.js | 395 | medium | unknown-action-ui | 오류 시 즉시 중단 설정 |
| src/pwa/code_explainer_rules.js | 395 | medium | unknown-action-ui | PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다. |
| src/pwa/code_explainer_rules.js | 398 | medium | unknown-action-ui | 함수 정의 |
| src/pwa/code_explainer_rules.js | 398 | medium | unknown-action-ui | 반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다. |
| src/pwa/code_explainer_rules.js | 401 | high | javascript-explainer | 여러 줄 문자열 경계 |
| src/pwa/code_explainer_rules.js | 401 | high | javascript-explainer | here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 404 | medium | unknown-action-ui | CSV 그룹 정렬 선택 저장 |
| src/pwa/code_explainer_rules.js | 404 | medium | unknown-action-ui | 파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 407 | medium | unknown-action-ui | 파이프라인 처리 |
| src/pwa/code_explainer_rules.js | 407 | medium | unknown-action-ui | 앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다. |
| src/pwa/code_explainer_rules.js | 410 | low | general-copy | 파일 목록 가져오기 |
| src/pwa/code_explainer_rules.js | 410 | low | general-copy | 폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다. |
| src/pwa/code_explainer_rules.js | 413 | low | general-copy | 파일 내용 읽기 |
| src/pwa/code_explainer_rules.js | 413 | low | general-copy | 텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다. |
| src/pwa/code_explainer_rules.js | 417 | medium | unknown-action-ui | 파일로 출력 저장 |
| src/pwa/code_explainer_rules.js | 417 | medium | unknown-action-ui | 화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 421 | medium | unknown-action-ui | 객체를 JSON으로 변환 후 파일 저장 |
| src/pwa/code_explainer_rules.js | 421 | medium | unknown-action-ui | PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 424 | medium | unknown-action-ui | 파일에 내용 저장 |
| src/pwa/code_explainer_rules.js | 424 | medium | unknown-action-ui | 값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 427 | low | general-copy | 파일에 내용 추가 |
| src/pwa/code_explainer_rules.js | 427 | low | general-copy | 기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다. |
| src/pwa/code_explainer_rules.js | 430 | high | powershell-explainer | 조건으로 필터링 |
| src/pwa/code_explainer_rules.js | 430 | high | powershell-explainer | 파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다. |
| src/pwa/code_explainer_rules.js | 433 | high | powershell-explainer | 각 항목 반복 처리 |
| src/pwa/code_explainer_rules.js | 433 | high | powershell-explainer | 파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다. |
| src/pwa/code_explainer_rules.js | 436 | low | general-copy | 필요한 속성 선택 |
| src/pwa/code_explainer_rules.js | 436 | low | general-copy | 객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다. |
| src/pwa/code_explainer_rules.js | 439 | high | powershell-explainer | 정렬 |
| src/pwa/code_explainer_rules.js | 439 | high | powershell-explainer | 파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 442 | low | general-copy | 그룹별 묶기 |
| src/pwa/code_explainer_rules.js | 442 | low | general-copy | 같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다. |
| src/pwa/code_explainer_rules.js | 445 | low | general-copy | 개수/합계 측정 |
| src/pwa/code_explainer_rules.js | 445 | low | general-copy | 항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다. |
| src/pwa/code_explainer_rules.js | 448 | medium | unknown-action-ui | JSON을 객체로 변환 |
| src/pwa/code_explainer_rules.js | 448 | medium | unknown-action-ui | JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다. |
| src/pwa/code_explainer_rules.js | 451 | medium | unknown-action-ui | 객체를 JSON으로 변환 |
| src/pwa/code_explainer_rules.js | 451 | medium | unknown-action-ui | PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다. |
| src/pwa/code_explainer_rules.js | 454 | low | general-copy | CSV 읽기 |
| src/pwa/code_explainer_rules.js | 454 | low | general-copy | CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다. |
| src/pwa/code_explainer_rules.js | 457 | medium | unknown-action-ui | CSV 저장 |
| src/pwa/code_explainer_rules.js | 457 | medium | unknown-action-ui | PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다. |
| src/pwa/code_explainer_rules.js | 460 | medium | unknown-action-ui | CSV 문자열 변환 |
| src/pwa/code_explainer_rules.js | 460 | medium | unknown-action-ui | CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 463 | medium | unknown-action-ui | REST API 호출 |
| src/pwa/code_explainer_rules.js | 463 | medium | unknown-action-ui | 웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 466 | medium | unknown-action-ui | 외부 프로그램 실행 |
| src/pwa/code_explainer_rules.js | 466 | medium | unknown-action-ui | 별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 469 | medium | unknown-action-ui | 프로세스 조회 |
| src/pwa/code_explainer_rules.js | 469 | medium | unknown-action-ui | 현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다. |
| src/pwa/code_explainer_rules.js | 472 | medium | unknown-action-ui | 프로세스 종료 |
| src/pwa/code_explainer_rules.js | 472 | medium | unknown-action-ui | 실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 475 | low | general-copy | 작업 완료 대기 |
| src/pwa/code_explainer_rules.js | 475 | low | general-copy | 백그라운드 작업이 끝날 때까지 기다립니다. |
| src/pwa/code_explainer_rules.js | 478 | low | general-copy | 작업 결과 받기 |
| src/pwa/code_explainer_rules.js | 478 | low | general-copy | 백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다. |
| src/pwa/code_explainer_rules.js | 481 | high | python-explainer | 오류 발생시키기 |
| src/pwa/code_explainer_rules.js | 481 | high | python-explainer | 조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다. |
| src/pwa/code_explainer_rules.js | 484 | low | general-copy | 스크립트 종료 |
| src/pwa/code_explainer_rules.js | 484 | low | general-copy | 현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다. |
| src/pwa/code_explainer_rules.js | 487 | low | general-copy | 값 반환 |
| src/pwa/code_explainer_rules.js | 487 | low | general-copy | 함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다. |
| src/pwa/code_explainer_rules.js | 491 | medium | unknown-action-ui | 새 항목 생성 |
| src/pwa/code_explainer_rules.js | 491 | medium | unknown-action-ui | 폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다. |
| src/pwa/code_explainer_rules.js | 494 | medium | app-ui | 파일/폴더 복사 |
| src/pwa/code_explainer_rules.js | 494 | medium | app-ui | 원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다. |
| src/pwa/code_explainer_rules.js | 497 | medium | unknown-action-ui | 파일/폴더 이동 |
| src/pwa/code_explainer_rules.js | 497 | medium | unknown-action-ui | 파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 500 | medium | unknown-action-ui | 파일/폴더 삭제 |
| src/pwa/code_explainer_rules.js | 500 | medium | unknown-action-ui | 지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다. |
| src/pwa/code_explainer_rules.js | 503 | low | general-copy | ZIP 압축 생성 |
| src/pwa/code_explainer_rules.js | 503 | low | general-copy | 지정한 파일이나 폴더를 zip 파일로 묶습니다. |
| src/pwa/code_explainer_rules.js | 506 | low | general-copy | ZIP 압축 해제 |
| src/pwa/code_explainer_rules.js | 506 | low | general-copy | zip 파일을 지정한 폴더로 풉니다. |
| src/pwa/code_explainer_rules.js | 509 | medium | unknown-action-ui | 경로 존재 확인 |
| src/pwa/code_explainer_rules.js | 509 | medium | unknown-action-ui | 파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 512 | medium | unknown-action-ui | 조건 확인 |
| src/pwa/code_explainer_rules.js | 512 | medium | unknown-action-ui | 괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다. |
| src/pwa/code_explainer_rules.js | 515 | low | general-copy | 반복 실행 |
| src/pwa/code_explainer_rules.js | 515 | low | general-copy | 목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다. |
| src/pwa/code_explainer_rules.js | 518 | high | javascript-explainer | Node 문법 검사 |
| src/pwa/code_explainer_rules.js | 518 | high | javascript-explainer | JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다. |
| src/pwa/code_explainer_rules.js | 521 | high | devops-explainer | npm 의존성 설치 |
| src/pwa/code_explainer_rules.js | 521 | high | devops-explainer | package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다. |
| src/pwa/code_explainer_rules.js | 524 | medium | unknown-action-ui | npm 스크립트 실행 |
| src/pwa/code_explainer_rules.js | 524 | medium | unknown-action-ui | package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다. |
| src/pwa/code_explainer_rules.js | 527 | high | python-explainer | Python 검증 실행 |
| src/pwa/code_explainer_rules.js | 527 | high | python-explainer | 학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다. |
| src/pwa/code_explainer_rules.js | 530 | medium | unknown-action-ui | Python 실행 |
| src/pwa/code_explainer_rules.js | 530 | medium | unknown-action-ui | Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 533 | medium | unknown-action-ui | Git 변경 상태 확인 |
| src/pwa/code_explainer_rules.js | 533 | medium | unknown-action-ui | 현재 폴더에서 어떤 파일이 수정되었는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 536 | high | javascript-explainer | Git 커밋 준비 |
| src/pwa/code_explainer_rules.js | 536 | high | javascript-explainer | 수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다. |
| src/pwa/code_explainer_rules.js | 539 | high | javascript-explainer | Git 커밋 생성 |
| src/pwa/code_explainer_rules.js | 539 | high | javascript-explainer | 준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다. |
| src/pwa/code_explainer_rules.js | 542 | medium | app-ui | Git 태그 생성 |
| src/pwa/code_explainer_rules.js | 542 | medium | app-ui | 현재 커밋에 버전 이름표를 붙입니다. |
| src/pwa/code_explainer_rules.js | 545 | high | javascript-explainer | 원격 저장소로 업로드 |
| src/pwa/code_explainer_rules.js | 545 | high | javascript-explainer | 로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다. |
| src/pwa/code_explainer_rules.js | 548 | low | general-copy | 임시 보관 |
| src/pwa/code_explainer_rules.js | 548 | low | general-copy | 아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다. |
| src/pwa/code_explainer_rules.js | 551 | medium | unknown-action-ui | 변경량 요약 확인 |
| src/pwa/code_explainer_rules.js | 551 | medium | unknown-action-ui | 어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다. |
| src/pwa/code_explainer_rules.js | 554 | medium | unknown-action-ui | 변경 내용 확인 |
| src/pwa/code_explainer_rules.js | 554 | medium | unknown-action-ui | 커밋 전 실제 코드 변경 내용을 확인합니다. |
| src/pwa/code_explainer_rules.js | 557 | medium | unknown-action-ui | 커밋 기록 확인 |
| src/pwa/code_explainer_rules.js | 557 | medium | unknown-action-ui | 최근 커밋 목록과 태그/브랜치 위치를 확인합니다. |
| src/pwa/code_explainer_rules.js | 560 | low | general-copy | 변경사항 강제 되돌리기 |
| src/pwa/code_explainer_rules.js | 560 | low | general-copy | 커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다. |
| src/pwa/code_explainer_rules.js | 563 | medium | unknown-action-ui | 추적되지 않는 파일 삭제 |
| src/pwa/code_explainer_rules.js | 563 | medium | unknown-action-ui | Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다. |
| src/pwa/code_explainer_rules.js | 566 | medium | unknown-action-ui | Python 실행 |
| src/pwa/code_explainer_rules.js | 566 | medium | unknown-action-ui | Python 스크립트나 명령을 실행합니다. |
| src/pwa/code_explainer_rules.js | 569 | high | javascript-explainer | Node.js 실행 |
| src/pwa/code_explainer_rules.js | 569 | high | javascript-explainer | JavaScript 파일 검사나 실행을 합니다. |
| src/pwa/code_explainer_rules.js | 572 | medium | unknown-action-ui | npm 명령 실행 |
| src/pwa/code_explainer_rules.js | 572 | medium | unknown-action-ui | JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다. |
| src/pwa/code_explainer_rules.js | 575 | low | general-copy | 파일에서 문자열 검색 |
| src/pwa/code_explainer_rules.js | 575 | low | general-copy | 파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다. |
| src/pwa/code_explainer_rules.js | 578 | high | javascript-explainer | 파일 내용 쓰기 |
| src/pwa/code_explainer_rules.js | 578 | high | javascript-explainer | 지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 581 | medium | unknown-action-ui | 백그라운드 작업 시작 |
| src/pwa/code_explainer_rules.js | 581 | medium | unknown-action-ui | 명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다. |
| src/pwa/code_explainer_rules.js | 584 | low | general-copy | 백그라운드 작업 중지 |
| src/pwa/code_explainer_rules.js | 584 | low | general-copy | 실행 중인 백그라운드 작업을 멈춥니다. |
| src/pwa/code_explainer_rules.js | 589 | low | general-copy | 입력 파라미터 선언 |
| src/pwa/code_explainer_rules.js | 589 | low | general-copy | param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 592 | medium | unknown-action-ui | 스크립트블록 실행 |
| src/pwa/code_explainer_rules.js | 592 | medium | unknown-action-ui | 변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다. |
| src/pwa/code_explainer_rules.js | 595 | medium | unknown-action-ui | 검증 단계 실행 |
| src/pwa/code_explainer_rules.js | 595 | medium | unknown-action-ui | 이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다. |
| src/pwa/code_explainer_rules.js | 598 | medium | unknown-action-ui | 문자열 포함 검증 |
| src/pwa/code_explainer_rules.js | 598 | medium | unknown-action-ui | 파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 601 | medium | app-ui | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 601 | medium | app-ui | 배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 605 | medium | unknown-action-ui | 잠시 대기 |
| src/pwa/code_explainer_rules.js | 605 | medium | unknown-action-ui | 다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다. |
| src/pwa/code_explainer_rules.js | 608 | medium | unknown-action-ui | 콘솔에 메시지 출력 |
| src/pwa/code_explainer_rules.js | 608 | medium | unknown-action-ui | 진행 상태나 결과를 PowerShell 화면에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 611 | medium | unknown-action-ui | 파일 차단 해제 |
| src/pwa/code_explainer_rules.js | 611 | medium | unknown-action-ui | 인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 614 | medium | unknown-action-ui | 스크립트 실행 정책 변경 |
| src/pwa/code_explainer_rules.js | 614 | medium | unknown-action-ui | PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 617 | medium | unknown-action-ui | 웹 요청 실행 |
| src/pwa/code_explainer_rules.js | 617 | medium | unknown-action-ui | URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 620 | medium | unknown-action-ui | Cloudflare Wrangler 실행 |
| src/pwa/code_explainer_rules.js | 620 | medium | unknown-action-ui | Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 623 | medium | unknown-action-ui | 오류 대비 시작 |
| src/pwa/code_explainer_rules.js | 623 | medium | unknown-action-ui | 이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다. |
| src/pwa/code_explainer_rules.js | 626 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 626 | low | general-copy | try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다. |
| src/pwa/code_explainer_rules.js | 631 | medium | unknown-action-ui | CSV 그룹 정렬 선택 저장 |
| src/pwa/code_explainer_rules.js | 631 | medium | unknown-action-ui | 파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 634 | medium | unknown-action-ui | 출력 숨기기 |
| src/pwa/code_explainer_rules.js | 634 | medium | unknown-action-ui | 명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다. |
| src/pwa/code_explainer_rules.js | 637 | high | powershell-explainer | 표 형태로 출력 |
| src/pwa/code_explainer_rules.js | 637 | high | powershell-explainer | 파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 640 | medium | unknown-action-ui | 명령 실행 |
| src/pwa/code_explainer_rules.js | 640 | medium | unknown-action-ui | 이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다. |
| src/pwa/code_explainer_rules.js | 649 | medium | unknown-action-ui | Flask 라우트 등록 |
| src/pwa/code_explainer_rules.js | 649 | medium | unknown-action-ui | Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다. |
| src/pwa/code_explainer_rules.js | 654 | high | javascript-explainer | FastAPI 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 654 | high | javascript-explainer | FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 657 | high | javascript-explainer | Pydantic 모델 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 657 | high | javascript-explainer | API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 660 | high | javascript-explainer | 라이브러리 불러오기 |
| src/pwa/code_explainer_rules.js | 660 | high | javascript-explainer | 이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다. |
| src/pwa/code_explainer_rules.js | 668 | high | javascript-explainer | 함수 정의 |
| src/pwa/code_explainer_rules.js | 668 | high | javascript-explainer | 나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다. |
| src/pwa/code_explainer_rules.js | 672 | low | general-copy | Pydantic 데이터 모델 정의 |
| src/pwa/code_explainer_rules.js | 672 | low | general-copy | FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다. |
| src/pwa/code_explainer_rules.js | 675 | low | general-copy | 클래스 정의 |
| src/pwa/code_explainer_rules.js | 675 | low | general-copy | 관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다. |
| src/pwa/code_explainer_rules.js | 679 | low | general-copy | Pydantic 모델 필드 정의 |
| src/pwa/code_explainer_rules.js | 679 | high | general-copy | 데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다. |
| src/pwa/code_explainer_rules.js | 685 | medium | unknown-action-ui | 정규식 검색/치환 |
| src/pwa/code_explainer_rules.js | 685 | medium | unknown-action-ui | re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 688 | low | general-copy | 날짜/시간 생성 / 날짜 문자열 포맷 |
| src/pwa/code_explainer_rules.js | 688 | high | general-copy | 현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다. |
| src/pwa/code_explainer_rules.js | 691 | low | general-copy | 날짜/시간 생성 |
| src/pwa/code_explainer_rules.js | 691 | low | general-copy | 현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다. |
| src/pwa/code_explainer_rules.js | 694 | low | general-copy | 날짜 문자열 포맷 |
| src/pwa/code_explainer_rules.js | 694 | low | general-copy | datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다. |
| src/pwa/code_explainer_rules.js | 697 | medium | unknown-action-ui | 파일 복사 |
| src/pwa/code_explainer_rules.js | 697 | medium | unknown-action-ui | shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 701 | low | general-copy | 직접 실행 진입점 |
| src/pwa/code_explainer_rules.js | 701 | low | general-copy | 이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다. |
| src/pwa/code_explainer_rules.js | 704 | medium | app-ui | 예외 처리 시작 |
| src/pwa/code_explainer_rules.js | 704 | medium | app-ui | 아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다. |
| src/pwa/code_explainer_rules.js | 707 | low | general-copy | 예외 잡기 |
| src/pwa/code_explainer_rules.js | 707 | low | general-copy | try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다. |
| src/pwa/code_explainer_rules.js | 710 | low | general-copy | 마지막 정리 |
| src/pwa/code_explainer_rules.js | 710 | low | general-copy | 성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 713 | medium | app-ui | 친절한 종료 |
| src/pwa/code_explainer_rules.js | 713 | medium | app-ui | CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다. |
| src/pwa/code_explainer_rules.js | 717 | medium | unknown-action-ui | FastAPI HTTP 오류 응답 |
| src/pwa/code_explainer_rules.js | 717 | medium | unknown-action-ui | API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 720 | high | python-explainer | 예외 발생시키기 |
| src/pwa/code_explainer_rules.js | 720 | high | python-explainer | 조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다. |
| src/pwa/code_explainer_rules.js | 723 | high | python-explainer | 조건 검증 |
| src/pwa/code_explainer_rules.js | 723 | high | python-explainer | 반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 727 | low | general-copy | next 값 꺼내기 |
| src/pwa/code_explainer_rules.js | 727 | low | general-copy | 반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다. |
| src/pwa/code_explainer_rules.js | 730 | high | python-explainer | 반복자 만들기 |
| src/pwa/code_explainer_rules.js | 730 | high | python-explainer | 리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 733 | medium | unknown-action-ui | 거꾸로 반복하기 |
| src/pwa/code_explainer_rules.js | 733 | medium | unknown-action-ui | 순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 736 | low | general-copy | 반올림 계산 |
| src/pwa/code_explainer_rules.js | 736 | low | general-copy | 숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다. |
| src/pwa/code_explainer_rules.js | 739 | low | general-copy | 절댓값 계산 |
| src/pwa/code_explainer_rules.js | 739 | low | general-copy | 음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 742 | medium | unknown-action-ui | 자료형 확인 |
| src/pwa/code_explainer_rules.js | 742 | medium | unknown-action-ui | 값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 745 | high | python-explainer | 조건 검사 |
| src/pwa/code_explainer_rules.js | 745 | high | python-explainer | 조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 748 | high | python-explainer | 다른 조건 검사 |
| src/pwa/code_explainer_rules.js | 748 | high | python-explainer | 앞 조건이 틀렸을 때 추가 조건을 검사합니다. |
| src/pwa/code_explainer_rules.js | 751 | high | python-explainer | 조건이 모두 아닐 때 |
| src/pwa/code_explainer_rules.js | 751 | high | python-explainer | 앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다. |
| src/pwa/code_explainer_rules.js | 754 | high | python-explainer | 다음 반복으로 건너뛰기 |
| src/pwa/code_explainer_rules.js | 754 | high | python-explainer | 현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 758 | medium | unknown-action-ui | range 반복 |
| src/pwa/code_explainer_rules.js | 758 | medium | unknown-action-ui | range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 761 | medium | unknown-action-ui | enumerate 반복 |
| src/pwa/code_explainer_rules.js | 761 | medium | unknown-action-ui | enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 765 | low | general-copy | for 반복문 실행 |
| src/pwa/code_explainer_rules.js | 765 | high | general-copy | 목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다. |
| src/pwa/code_explainer_rules.js | 768 | medium | unknown-action-ui | 조건 반복문 |
| src/pwa/code_explainer_rules.js | 768 | medium | unknown-action-ui | 조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 771 | low | general-copy | 파일 열기 |
| src/pwa/code_explainer_rules.js | 771 | low | general-copy | 파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다. |
| src/pwa/code_explainer_rules.js | 774 | medium | unknown-action-ui | JSON 파일 쓰기 |
| src/pwa/code_explainer_rules.js | 774 | medium | unknown-action-ui | Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 777 | high | javascript-explainer | JSON 문자열 만들기 |
| src/pwa/code_explainer_rules.js | 777 | high | javascript-explainer | Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 780 | high | python-explainer | JSON 읽기 |
| src/pwa/code_explainer_rules.js | 780 | high | python-explainer | JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 784 | medium | unknown-action-ui | pandas 파일 읽기 |
| src/pwa/code_explainer_rules.js | 784 | medium | unknown-action-ui | CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 787 | high | sql-explainer | pandas 표 만들기 |
| src/pwa/code_explainer_rules.js | 787 | high | sql-explainer | 리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 790 | medium | unknown-action-ui | pandas 표 이어붙이기 |
| src/pwa/code_explainer_rules.js | 790 | medium | unknown-action-ui | 여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 793 | medium | unknown-action-ui | pandas 미리보기/요약 |
| src/pwa/code_explainer_rules.js | 793 | medium | unknown-action-ui | 표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다. |
| src/pwa/code_explainer_rules.js | 796 | medium | unknown-action-ui | pandas 행/열 선택 |
| src/pwa/code_explainer_rules.js | 796 | medium | unknown-action-ui | loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 799 | medium | unknown-action-ui | pandas 정렬/빈도 계산 |
| src/pwa/code_explainer_rules.js | 799 | medium | unknown-action-ui | 표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 802 | medium | unknown-action-ui | pandas 결측값/자료형 처리 |
| src/pwa/code_explainer_rules.js | 802 | medium | unknown-action-ui | 비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 805 | medium | unknown-action-ui | pandas 그룹 집계 |
| src/pwa/code_explainer_rules.js | 805 | medium | unknown-action-ui | 특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 808 | medium | unknown-action-ui | pandas 표 병합 |
| src/pwa/code_explainer_rules.js | 808 | medium | unknown-action-ui | 공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 811 | high | python-explainer | NumPy 배열 만들기 |
| src/pwa/code_explainer_rules.js | 811 | high | python-explainer | 리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다. |
| src/pwa/code_explainer_rules.js | 814 | medium | unknown-action-ui | NumPy 기본 배열 생성 |
| src/pwa/code_explainer_rules.js | 814 | medium | unknown-action-ui | 0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 817 | medium | unknown-action-ui | NumPy 통계 계산 |
| src/pwa/code_explainer_rules.js | 817 | medium | unknown-action-ui | 배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 820 | medium | unknown-action-ui | NumPy 형태 변경 |
| src/pwa/code_explainer_rules.js | 820 | medium | unknown-action-ui | 배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 823 | high | python-explainer | NumPy 조건 선택 |
| src/pwa/code_explainer_rules.js | 823 | high | python-explainer | 조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 826 | medium | unknown-action-ui | NumPy 무작위 값 |
| src/pwa/code_explainer_rules.js | 826 | medium | unknown-action-ui | 배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 829 | low | general-copy | CSV 표 읽기 |
| src/pwa/code_explainer_rules.js | 829 | low | general-copy | CSV 파일을 표 형태 데이터로 읽습니다. |
| src/pwa/code_explainer_rules.js | 832 | medium | unknown-action-ui | HTTP 요청 |
| src/pwa/code_explainer_rules.js | 832 | medium | unknown-action-ui | 웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다. |
| src/pwa/code_explainer_rules.js | 835 | medium | unknown-action-ui | 명령행 인자 처리 |
| src/pwa/code_explainer_rules.js | 835 | medium | unknown-action-ui | 터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다. |
| src/pwa/code_explainer_rules.js | 840 | low | general-copy | traceback 오류 정보 처리 |
| src/pwa/code_explainer_rules.js | 840 | low | general-copy | 예외가 발생했을 때 호출 경로와 오류 위치 정보를 문자열로 만들거나 출력합니다. 디버깅 로그와 오류 보고에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 843 | medium | unknown-action-ui | time 시간 처리 |
| src/pwa/code_explainer_rules.js | 843 | medium | unknown-action-ui | 현재 시각을 구하거나 잠시 멈추거나 실행 시간을 재는 표준 라이브러리 기능입니다. 대기 시간과 측정 기준을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 846 | low | general-copy | dataclass 데이터 클래스 |
| src/pwa/code_explainer_rules.js | 846 | low | general-copy | 반복해서 쓰는 데이터 묶음 클래스를 간단히 정의하게 해줍니다. 필드 이름과 기본값이 객체 구조를 결정합니다. |
| src/pwa/code_explainer_rules.js | 849 | low | general-copy | collections 자료구조 |
| src/pwa/code_explainer_rules.js | 849 | low | general-copy | defaultdict, Counter, deque 같은 표준 자료구조를 만듭니다. 기본값, 개수 세기, 빠른 큐 처리를 할 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 852 | medium | unknown-action-ui | itertools 반복 조합 |
| src/pwa/code_explainer_rules.js | 852 | medium | unknown-action-ui | 반복 가능한 값들을 조합하거나 이어 붙이거나 필요한 만큼 잘라 쓰는 표준 라이브러리 기능입니다. 반복 규모가 커질 수 있어 범위를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 855 | medium | unknown-action-ui | random 무작위 처리 |
| src/pwa/code_explainer_rules.js | 855 | medium | unknown-action-ui | 목록에서 고르기, 섞기, 난수 만들기 같은 무작위 동작을 합니다. 재현이 필요하면 seed 설정 여부를 확인합니다. |
| src/pwa/code_explainer_rules.js | 860 | high | javascript-explainer | 환경변수 파일 로드 |
| src/pwa/code_explainer_rules.js | 860 | high | javascript-explainer | .env 파일에 있는 설정값을 현재 Python 실행 환경으로 불러옵니다. 실제 비밀값은 저장소에 올리지 않아야 합니다. |
| src/pwa/code_explainer_rules.js | 863 | medium | unknown-action-ui | 환경변수 읽기 |
| src/pwa/code_explainer_rules.js | 863 | medium | unknown-action-ui | API 키, DB 주소, 실행 옵션처럼 코드 밖에서 주입한 설정값을 읽습니다. 값이 없을 때의 처리도 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 866 | medium | app-ui | 로깅 설정 |
| src/pwa/code_explainer_rules.js | 866 | medium | app-ui | 실행 중 상태, 오류, 처리 결과를 기록하기 위한 로그 설정을 준비합니다. |
| src/pwa/code_explainer_rules.js | 869 | low | general-copy | 로그 남기기 |
| src/pwa/code_explainer_rules.js | 869 | low | general-copy | 진행 상태나 오류 정보를 로그로 남깁니다. print보다 운영 상황 추적에 적합합니다. |
| src/pwa/code_explainer_rules.js | 872 | medium | unknown-action-ui | CSV 딕셔너리 읽기 |
| src/pwa/code_explainer_rules.js | 872 | medium | unknown-action-ui | CSV의 첫 줄을 컬럼명으로 보고 각 행을 딕셔너리 형태로 읽습니다. 컬럼 이름 오타를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 875 | high | javascript-explainer | CSV 딕셔너리 쓰기 |
| src/pwa/code_explainer_rules.js | 875 | high | javascript-explainer | 딕셔너리 데이터를 정해진 fieldnames 순서대로 CSV에 저장할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 878 | low | general-copy | CSV 행 읽기 |
| src/pwa/code_explainer_rules.js | 878 | low | general-copy | CSV 파일을 행 단위 목록으로 읽습니다. 컬럼명보다는 위치 번호로 접근하는 방식입니다. |
| src/pwa/code_explainer_rules.js | 881 | high | javascript-explainer | CSV 행 쓰기 |
| src/pwa/code_explainer_rules.js | 881 | high | javascript-explainer | 목록 형태의 행 데이터를 CSV 파일에 저장할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 884 | low | general-copy | CSV 헤더 쓰기 |
| src/pwa/code_explainer_rules.js | 884 | low | general-copy | CSV 파일의 첫 줄에 컬럼명을 기록합니다. |
| src/pwa/code_explainer_rules.js | 887 | low | general-copy | CSV 행 쓰기 |
| src/pwa/code_explainer_rules.js | 887 | low | general-copy | 하나 이상의 데이터 행을 CSV 파일에 기록합니다. |
| src/pwa/code_explainer_rules.js | 890 | high | python-explainer | 목록에 항목 추가 |
| src/pwa/code_explainer_rules.js | 890 | high | python-explainer | 리스트 끝에 새 값을 하나 추가합니다. 반복문 안에서 결과를 모을 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 893 | high | python-explainer | 자료구조 확장/갱신 |
| src/pwa/code_explainer_rules.js | 893 | high | python-explainer | 리스트나 딕셔너리에 여러 값을 추가하거나 기존 값을 갱신합니다. |
| src/pwa/code_explainer_rules.js | 896 | low | general-copy | pathlib 파일 열기 |
| src/pwa/code_explainer_rules.js | 896 | low | general-copy | Path 객체를 통해 파일을 읽거나 쓰기 위해 엽니다. with와 함께 쓰면 자동으로 닫혀 안전합니다. |
| src/pwa/code_explainer_rules.js | 899 | medium | unknown-action-ui | 파일 목록 검색 |
| src/pwa/code_explainer_rules.js | 899 | medium | unknown-action-ui | 폴더 안의 파일 목록을 패턴이나 반복으로 찾습니다. 처리 대상이 너무 넓지 않은지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 902 | high | python-explainer | 표 데이터 만들기 |
| src/pwa/code_explainer_rules.js | 902 | high | python-explainer | 리스트나 딕셔너리 데이터를 pandas DataFrame 표 구조로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 905 | medium | unknown-action-ui | 표 데이터 저장 |
| src/pwa/code_explainer_rules.js | 905 | medium | unknown-action-ui | DataFrame이나 표 데이터를 파일로 저장합니다. 저장 경로와 덮어쓰기 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 908 | high | sql-explainer | 그룹별 집계 |
| src/pwa/code_explainer_rules.js | 908 | high | sql-explainer | 특정 컬럼 값을 기준으로 데이터를 묶어서 합계, 평균, 개수 같은 통계를 계산할 준비를 합니다. |
| src/pwa/code_explainer_rules.js | 911 | medium | unknown-action-ui | 표 병합 |
| src/pwa/code_explainer_rules.js | 911 | medium | unknown-action-ui | 두 표를 공통 키나 인덱스 기준으로 합칩니다. 중복 키와 누락값을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 914 | medium | unknown-action-ui | 결측값 처리 |
| src/pwa/code_explainer_rules.js | 914 | medium | unknown-action-ui | 비어 있는 값을 채우거나 제거합니다. 데이터가 사라지는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 917 | medium | unknown-action-ui | HTTP 오류 확인 |
| src/pwa/code_explainer_rules.js | 917 | medium | unknown-action-ui | API 응답이 실패 상태 코드이면 예외를 발생시켜 문제를 조기에 드러냅니다. |
| src/pwa/code_explainer_rules.js | 920 | high | python-explainer | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 920 | high | python-explainer | 웹 API 응답 본문을 Python 딕셔너리나 리스트로 변환합니다. |
| src/pwa/code_explainer_rules.js | 923 | medium | unknown-action-ui | 비동기 실행 |
| src/pwa/code_explainer_rules.js | 923 | medium | unknown-action-ui | 네트워크 요청이나 오래 걸리는 작업을 기다리거나 동시에 실행합니다. await 위치와 예외 처리를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 926 | low | general-copy | 파일/경로 처리 |
| src/pwa/code_explainer_rules.js | 926 | low | general-copy | pathlib 기반으로 파일 경로를 만들거나 파일을 읽고 씁니다. |
| src/pwa/code_explainer_rules.js | 929 | medium | unknown-action-ui | 외부 프로그램 실행 |
| src/pwa/code_explainer_rules.js | 929 | medium | unknown-action-ui | Python 코드에서 다른 명령어나 프로그램을 실행합니다. 인자와 check=True 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 933 | low | general-copy | FastAPI 앱 생성 |
| src/pwa/code_explainer_rules.js | 933 | low | general-copy | HTTP 요청을 받을 API 서버 앱 객체를 만듭니다. 이후 @app.get, @app.post 같은 라우트가 이 앱에 연결됩니다. |
| src/pwa/code_explainer_rules.js | 936 | low | general-copy | FastAPI 라우터 생성 |
| src/pwa/code_explainer_rules.js | 936 | low | general-copy | API 경로들을 묶어서 관리할 라우터 객체를 만듭니다. prefix, tags 같은 옵션으로 URL 그룹을 나눌 수 있습니다. |
| src/pwa/code_explainer_rules.js | 939 | medium | unknown-action-ui | FastAPI 라우트 연결 |
| src/pwa/code_explainer_rules.js | 939 | medium | unknown-action-ui | 특정 HTTP 메서드와 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. response_model, status_code, 경로 파라미터가 있는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 942 | medium | unknown-action-ui | FastAPI 의존성 주입 |
| src/pwa/code_explainer_rules.js | 942 | medium | unknown-action-ui | 요청 처리 전에 인증, DB 연결, 공통 검증 같은 보조 함수를 실행해 결과를 함수 인자로 넣습니다. |
| src/pwa/code_explainer_rules.js | 945 | medium | unknown-action-ui | FastAPI 요청값 검증 설정 |
| src/pwa/code_explainer_rules.js | 945 | medium | unknown-action-ui | 쿼리 문자열, 요청 본문, 경로 파라미터의 기본값과 검증 조건을 설정합니다. 필수 여부와 기본값을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 948 | medium | unknown-action-ui | Uvicorn 서버 실행 |
| src/pwa/code_explainer_rules.js | 948 | medium | unknown-action-ui | FastAPI 앱을 실제 HTTP 서버로 실행합니다. host, port, reload 옵션을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 951 | medium | app-ui | FastAPI 앱/라우트 설정 |
| src/pwa/code_explainer_rules.js | 951 | medium | app-ui | API 서버 앱을 만들거나 특정 URL로 들어온 요청을 처리할 함수를 연결합니다. |
| src/pwa/code_explainer_rules.js | 955 | high | javascript-explainer | 딕셔너리 항목 설정 |
| src/pwa/code_explainer_rules.js | 955 | high | javascript-explainer | 딕셔너리 안에서 키와 값을 연결하는 데이터 줄입니다. 검증 항목 이름과 검사 결과를 묶어 저장할 때 자주 나옵니다. |
| src/pwa/code_explainer_rules.js | 958 | low | general-copy | 값 돌려주기 |
| src/pwa/code_explainer_rules.js | 958 | low | general-copy | 함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 961 | medium | unknown-action-ui | 화면에 출력 |
| src/pwa/code_explainer_rules.js | 961 | medium | unknown-action-ui | 괄호 안 값을 콘솔 화면에 보여줍니다. 중간 결과를 확인하거나 프로그램이 계산한 값을 사용자에게 보여줄 때 사용합니다. |
| src/pwa/code_explainer_rules.js | 964 | medium | unknown-action-ui | 검증 함수 호출 |
| src/pwa/code_explainer_rules.js | 964 | medium | unknown-action-ui | 검증 스크립트 안에서 미리 정의된 보조 함수를 실행합니다. 명령 실행, 조건 확인, 메인 흐름 시작처럼 검증 절차를 묶어 호출할 때 쓰입니다. |
| src/pwa/code_explainer_rules.js | 988 | high | javascript-explainer | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 988 | high | javascript-explainer | 왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 995 | high | javascript-explainer | 누적 더하기 |
| src/pwa/code_explainer_rules.js | 995 | high | javascript-explainer | 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 999 | high | python-explainer | Python 코드 실행 |
| src/pwa/code_explainer_rules.js | 999 | high | python-explainer | 이 줄은 Python 코드입니다. 위에서 아래로 순서대로 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1008 | medium | unknown-action-ui | 파일 내용 읽기 |
| src/pwa/code_explainer_rules.js | 1008 | medium | unknown-action-ui | Node.js에서 파일 내용을 읽어 문자열이나 Buffer로 가져옵니다. 경로, 인코딩, 파일이 없을 때의 오류 처리를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1011 | medium | unknown-action-ui | 파일 내용 저장 |
| src/pwa/code_explainer_rules.js | 1011 | medium | unknown-action-ui | Node.js에서 파일에 내용을 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 저장 내용을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1014 | medium | unknown-action-ui | 폴더 목록 읽기 |
| src/pwa/code_explainer_rules.js | 1014 | medium | unknown-action-ui | Node.js에서 폴더 안의 파일과 하위 폴더 목록을 읽습니다. 대상 경로와 권한을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1019 | high | javascript-explainer | 엄격 모드 선언 |
| src/pwa/code_explainer_rules.js | 1019 | high | javascript-explainer | JavaScript 파일을 더 엄격한 규칙으로 실행하게 하는 선언입니다. 실수로 전역 변수를 만들거나 조용히 넘어가는 오류를 줄이는 데 도움이 됩니다. |
| src/pwa/code_explainer_rules.js | 1022 | high | javascript-explainer | Node.js 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 1022 | high | javascript-explainer | require로 fs, path 같은 Node.js 모듈을 불러와 변수에 저장합니다. 이후 파일 처리, 경로 처리, 프로세스 실행 등에 사용됩니다. |
| src/pwa/code_explainer_rules.js | 1025 | medium | unknown-action-ui | Node.js 파일 처리 |
| src/pwa/code_explainer_rules.js | 1025 | medium | unknown-action-ui | fs 모듈로 파일이나 폴더를 읽고 쓰거나 존재 여부를 확인합니다. 읽는 경로와 덮어쓰기 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1028 | low | general-copy | Node.js 경로 처리 |
| src/pwa/code_explainer_rules.js | 1028 | high | general-copy | path 모듈로 파일 경로를 안전하게 합치거나 파일명, 폴더명, 확장자를 계산합니다. Windows와 Linux 경로 차이를 줄이는 데 도움이 됩니다. |
| src/pwa/code_explainer_rules.js | 1031 | medium | unknown-action-ui | 외부 명령 실행 |
| src/pwa/code_explainer_rules.js | 1031 | medium | unknown-action-ui | Node.js에서 git, node, python 같은 외부 명령을 실행합니다. 실행 명령, 인자, 작업 폴더, 실패 시 동작을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1034 | medium | unknown-action-ui | 격리 실행 컨텍스트 사용 |
| src/pwa/code_explainer_rules.js | 1034 | medium | unknown-action-ui | Node.js vm 모듈로 코드를 별도 컨텍스트에서 실행합니다. 분석기나 테스트용 샌드박스를 만들 때 쓰지만 실행 대상 코드의 신뢰성을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1039 | medium | unknown-action-ui | CORS 헤더 설정 |
| src/pwa/code_explainer_rules.js | 1039 | medium | unknown-action-ui | 브라우저의 다른 출처 요청을 허용할지 정하는 응답 헤더입니다. 별표(*)는 모든 출처를 허용하므로 공개 범위가 맞는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1045 | medium | unknown-action-ui | 코드블록 경계 |
| src/pwa/code_explainer_rules.js | 1045 | medium | unknown-action-ui | 문서나 예제 문자열 안에서 코드 블록의 시작 또는 끝을 표시합니다. 실행 명령이 아니라 표시용 경계입니다. |
| src/pwa/code_explainer_rules.js | 1048 | medium | app-ui | 블록/콜백 닫기 |
| src/pwa/code_explainer_rules.js | 1048 | medium | app-ui | 앞에서 시작한 객체, 함수, 콜백, 예제 문자열 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다. |
| src/pwa/code_explainer_rules.js | 1051 | high | python-explainer | 조건/표현식 경계 |
| src/pwa/code_explainer_rules.js | 1051 | high | python-explainer | 여러 줄로 나뉜 조건식이나 삼항 연산자 표현식을 마무리하는 경계 줄입니다. 앞줄의 조건과 함께 읽어야 합니다. |
| src/pwa/code_explainer_rules.js | 1054 | high | python-explainer | 정규식 조건 검사 |
| src/pwa/code_explainer_rules.js | 1054 | high | python-explainer | 정규식으로 문자열 형태를 검사하거나 특정 패턴을 찾습니다. 파일명, 코드펜스, 설정 줄처럼 형식 판별에 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1057 | medium | unknown-action-ui | 조건부 UI 조각 |
| src/pwa/code_explainer_rules.js | 1057 | medium | unknown-action-ui | 삼항 연산자의 조건에 따라 화면에 넣을 HTML 조각을 고르는 부분입니다. 어떤 상태에서 어떤 안내 문구가 보이는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1060 | low | general-copy | UI 조각 연결 |
| src/pwa/code_explainer_rules.js | 1060 | low | general-copy | 앞뒤 HTML 문자열 조각을 이어 붙이거나 이미 만든 조각을 결과에 포함합니다. 화면 렌더링 문자열을 조립하는 줄입니다. |
| src/pwa/code_explainer_rules.js | 1063 | medium | unknown-action-ui | 콜백 결과 저장 |
| src/pwa/code_explainer_rules.js | 1063 | medium | unknown-action-ui | 전달받은 picker 콜백 함수를 실행해 분류 키나 값을 꺼내 변수에 저장합니다. countByValue 같은 집계 도우미에서 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1066 | high | javascript-explainer | Blob 파일 데이터 생성 |
| src/pwa/code_explainer_rules.js | 1066 | high | javascript-explainer | 문자열이나 SVG 같은 내용을 브라우저에서 다운로드 가능한 Blob 데이터로 만듭니다. 이후 URL.createObjectURL이나 링크 클릭으로 저장할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1069 | medium | unknown-action-ui | 화면/콘솔에 출력 |
| src/pwa/code_explainer_rules.js | 1069 | medium | unknown-action-ui | 개발자 콘솔에 값이나 오류 메시지를 출력합니다. 디버깅, 스모크 테스트 실패 원인 확인, 상태 보고에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1072 | low | general-copy | 메서드 체인 이어쓰기 |
| src/pwa/code_explainer_rules.js | 1072 | low | general-copy | 앞줄의 문자열, 배열, 스트림 처리 결과에 메서드를 이어 붙입니다. 여러 줄 체인에서는 앞 단계의 결과가 이 줄로 넘어옵니다. |
| src/pwa/code_explainer_rules.js | 1075 | high | javascript-explainer | 예제 코드 문자열 |
| src/pwa/code_explainer_rules.js | 1075 | high | javascript-explainer | JavaScript 파일 안에 샘플로 들어 있는 Python, Java 같은 다른 언어 코드입니다. 현재 JavaScript로 직접 실행되는 줄이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1078 | high | python-explainer | 오류 발생 |
| src/pwa/code_explainer_rules.js | 1078 | high | python-explainer | 조건이 맞지 않거나 검증에 실패했을 때 Error를 만들어 실행을 중단합니다. 실패 원인을 메시지로 남기는 방어 코드입니다. |
| src/pwa/code_explainer_rules.js | 1081 | medium | unknown-action-ui | 반복 다음 항목으로 이동 |
| src/pwa/code_explainer_rules.js | 1081 | medium | unknown-action-ui | 현재 반복의 남은 처리를 건너뛰고 다음 항목으로 넘어갑니다. 어떤 조건에서 건너뛰는지 함께 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1084 | medium | unknown-action-ui | 코드블록 경계 |
| src/pwa/code_explainer_rules.js | 1084 | medium | unknown-action-ui | 문서나 예제 문자열 안에서 코드 블록의 시작 또는 끝을 표시합니다. 실행 명령이 아니라 표시용 경계입니다. |
| src/pwa/code_explainer_rules.js | 1087 | medium | unknown-action-ui | 예제 명령 문자열 |
| src/pwa/code_explainer_rules.js | 1087 | medium | unknown-action-ui | JavaScript 파일 안에 들어 있는 PowerShell, npm, node, python 같은 예제 명령입니다. 현재 JavaScript 줄로 직접 실행되는 것이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1090 | medium | unknown-action-ui | 예제/문서 문자열 |
| src/pwa/code_explainer_rules.js | 1090 | medium | unknown-action-ui | 문서, 설정 예시, .gitignore 예시처럼 문자열 안에 들어 있는 파일명이나 설정 줄입니다. 현재 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1093 | medium | app-ui | 배열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 1093 | medium | app-ui | 배열 안에 들어가는 한 행의 데이터입니다. 라벨과 값, 키워드 묶음, 파일 묶음 같은 설정 목록을 구성합니다. |
| src/pwa/code_explainer_rules.js | 1096 | low | general-copy | 객체/배열 값 항목 |
| src/pwa/code_explainer_rules.js | 1096 | low | general-copy | 객체나 배열 안에 들어가는 값 항목입니다. 없을 때 기본값을 쓰는 표현이 함께 붙을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1099 | high | python-explainer | 조건부 UI 조각 |
| src/pwa/code_explainer_rules.js | 1099 | high | python-explainer | 삼항 연산자의 ? 또는 : 쪽에 놓인 화면 문구나 HTML 조각입니다. 조건에 따라 어떤 문구를 보여줄지 나누는 부분입니다. |
| src/pwa/code_explainer_rules.js | 1102 | medium | unknown-action-ui | 반응형 화면 조건 확인 |
| src/pwa/code_explainer_rules.js | 1102 | medium | unknown-action-ui | 브라우저 화면 너비 같은 미디어 조건을 확인합니다. 모바일/데스크톱 UI를 나누는 데 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1105 | high | javascript-explainer | DOM 스타일 설정 |
| src/pwa/code_explainer_rules.js | 1105 | high | javascript-explainer | 화면 요소의 style 값을 직접 바꿉니다. 진행률 막대 너비처럼 사용자에게 보이는 시각 상태를 갱신합니다. |
| src/pwa/code_explainer_rules.js | 1108 | high | javascript-explainer | 중첩 객체 값 갱신 |
| src/pwa/code_explainer_rules.js | 1108 | high | javascript-explainer | 객체 안의 객체나 배열 항목처럼 깊은 위치의 값을 바꿉니다. 진도, 정답 수, 마지막 학습 시각 같은 상태 저장에 자주 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1111 | low | general-copy | 배열/문자열 길이 계산 |
| src/pwa/code_explainer_rules.js | 1111 | low | general-copy | 앞에서 filter나 map 같은 처리를 끝낸 뒤 length로 개수를 계산하는 줄입니다. |
| src/pwa/code_explainer_rules.js | 1116 | low | general-copy | React Hook 의존성 닫기 |
| src/pwa/code_explainer_rules.js | 1116 | high | general-copy | useEffect, useMemo, useCallback 같은 Hook의 콜백 함수와 의존성 배열을 마무리합니다. 배열 안의 값이 바뀔 때만 Hook이 다시 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1119 | medium | app-ui | React 화면 렌더링 |
| src/pwa/code_explainer_rules.js | 1119 | medium | app-ui | React 컴포넌트를 실제 브라우저 화면에 렌더링합니다. 앱의 시작점에서 루트 컴포넌트를 붙일 때 사용합니다. |
| src/pwa/code_explainer_rules.js | 1122 | high | javascript-explainer | React 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 1122 | high | javascript-explainer | React 컴포넌트와 useState, useEffect 같은 Hook 기능을 가져옵니다. 화면을 컴포넌트 단위로 만들고 상태 변화에 따라 다시 그리기 위한 준비 단계입니다. |
| src/pwa/code_explainer_rules.js | 1125 | high | javascript-explainer | React DOM 렌더링 기능 불러오기 |
| src/pwa/code_explainer_rules.js | 1125 | high | javascript-explainer | React 컴포넌트를 실제 브라우저 DOM에 붙이기 위한 createRoot 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 1128 | medium | app-ui | React 컴포넌트 정의 |
| src/pwa/code_explainer_rules.js | 1128 | medium | app-ui | 대문자로 시작하는 화면 조각 함수를 정의합니다. React에서는 이런 컴포넌트를 조합해서 페이지 화면을 만듭니다. |
| src/pwa/code_explainer_rules.js | 1131 | low | general-copy | React 상태값 만들기 |
| src/pwa/code_explainer_rules.js | 1131 | low | general-copy | 컴포넌트 안에서 바뀔 수 있는 상태값과 그 값을 바꾸는 setter 함수를 만듭니다. 값이 바뀌면 화면이 다시 렌더링될 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1135 | medium | unknown-action-ui | React 상태 변경 |
| src/pwa/code_explainer_rules.js | 1135 | medium | unknown-action-ui | useState로 만든 setter 함수를 호출해 상태값을 바꿉니다. 이전 값에 의존하면 함수형 업데이트가 필요한지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1138 | medium | unknown-action-ui | React 효과 처리 |
| src/pwa/code_explainer_rules.js | 1138 | medium | unknown-action-ui | 렌더링 이후 실행할 작업을 등록합니다. API 요청, 이벤트 연결, 타이머 같은 부수 효과를 넣으며 의존성 배열을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1141 | high | javascript-explainer | React 계산값 재사용 |
| src/pwa/code_explainer_rules.js | 1141 | high | javascript-explainer | 비용이 큰 계산 결과를 의존성 값이 바뀔 때만 다시 계산하도록 저장합니다. 의존성 배열이 빠지면 오래된 값이 남을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1144 | low | general-copy | React 콜백 재사용 |
| src/pwa/code_explainer_rules.js | 1144 | low | general-copy | 함수 자체를 의존성 값이 바뀔 때만 다시 만들도록 합니다. 자식 컴포넌트 렌더링 최적화나 이벤트 핸들러 전달에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1147 | high | javascript-explainer | React 참조값 만들기 |
| src/pwa/code_explainer_rules.js | 1147 | high | javascript-explainer | 렌더링 사이에 유지되는 참조 객체를 만듭니다. DOM 요소를 가리키거나 다시 렌더링을 일으키지 않는 값을 저장할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 1150 | medium | app-ui | React 컨텍스트 읽기 |
| src/pwa/code_explainer_rules.js | 1150 | medium | app-ui | 상위에서 제공한 Context 값을 현재 컴포넌트에서 읽습니다. 테마, 로그인 사용자, 전역 설정 같은 값을 전달할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 1154 | high | python-explainer | React props 읽기 |
| src/pwa/code_explainer_rules.js | 1154 | high | python-explainer | 부모 컴포넌트가 넘겨준 값을 읽습니다. props는 보통 현재 컴포넌트가 직접 바꾸지 않고 화면 표시나 조건 분기에 사용합니다. |
| src/pwa/code_explainer_rules.js | 1157 | high | css-explainer | JSX 화면 구조 |
| src/pwa/code_explainer_rules.js | 1157 | high | css-explainer | React 컴포넌트가 화면에 보여줄 JSX 구조를 작성합니다. className은 CSS 클래스, onClick 같은 속성은 이벤트 처리 함수 연결에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1160 | high | javascript-explainer | React 루트 생성 |
| src/pwa/code_explainer_rules.js | 1160 | high | javascript-explainer | React 앱을 붙일 브라우저 DOM 위치를 기준으로 렌더링 루트를 만듭니다. 보통 document.getElementById( |
| src/pwa/code_explainer_rules.js | 1160 | high | javascript-explainer | ) 같은 요소를 넘깁니다. |
| src/pwa/code_explainer_rules.js | 1163 | medium | app-ui | React 화면 렌더링 |
| src/pwa/code_explainer_rules.js | 1163 | medium | app-ui | React 컴포넌트를 실제 브라우저 화면에 렌더링합니다. 앱의 시작점에서 루트 컴포넌트를 붙일 때 사용합니다. |
| src/pwa/code_explainer_rules.js | 1170 | low | general-copy | 객체 메서드 호출 |
| src/pwa/code_explainer_rules.js | 1170 | low | general-copy | window나 객체에 붙어 있는 메서드를 실행합니다. 화면 갱신, 분석기 새로고침, 이벤트 해제 같은 동작일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1175 | high | javascript-explainer | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 1175 | high | javascript-explainer | 배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다. |
| src/pwa/code_explainer_rules.js | 1178 | medium | unknown-action-ui | 문자열/HTML 조각 |
| src/pwa/code_explainer_rules.js | 1178 | medium | unknown-action-ui | 화면에 넣을 HTML 문자열, 템플릿 문자열, 메시지 조각입니다. 실제 실행 명령이라기보다 UI 출력 내용을 조립하는 데이터 줄일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1180 | low | general-copy | if (/^[-*]\s+/.test(t) \|\| /^```/.test(t) \|\| /^[가-힣][^;{}]*$/.test(t)) { |
| src/pwa/code_explainer_rules.js | 1181 | medium | unknown-action-ui | 예제/문서 문자열 |
| src/pwa/code_explainer_rules.js | 1181 | medium | unknown-action-ui | JavaScript 문자열 안에 들어 있는 문서, 목록, 예제 코드 내용입니다. 현재 파일의 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1184 | high | javascript-explainer | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 1184 | high | javascript-explainer | 배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다. |
| src/pwa/code_explainer_rules.js | 1187 | medium | app-ui | 객체 속성 설정 |
| src/pwa/code_explainer_rules.js | 1187 | medium | app-ui | 객체 안에서 이름과 값을 연결하는 데이터 설정 줄입니다. 설정값, 예제 문자열, 화면 문구, 계산 결과를 담을 때 자주 나옵니다. |
| src/pwa/code_explainer_rules.js | 1190 | medium | unknown-action-ui | 객체/배열 초기화 |
| src/pwa/code_explainer_rules.js | 1190 | medium | unknown-action-ui | 여러 설정값이나 항목을 담기 위해 객체나 배열을 새로 만듭니다. 이후 줄에서 속성과 항목이 채워지는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1193 | low | general-copy | 변수 선언 |
| src/pwa/code_explainer_rules.js | 1193 | low | general-copy | 나중에 값을 넣어 사용할 이름을 미리 선언합니다. 아직 실제 데이터가 들어간 것은 아닐 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1196 | medium | unknown-action-ui | 객체 값 갱신 |
| src/pwa/code_explainer_rules.js | 1196 | medium | unknown-action-ui | 객체의 특정 속성이나 배열/딕셔너리 형태의 항목 값을 바꿉니다. 기존 값을 덮어쓰는지, 누적하는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1199 | low | general-copy | 변수 값 갱신 |
| src/pwa/code_explainer_rules.js | 1199 | low | general-copy | 이미 선언된 변수에 새 값을 넣거나 기존 값에 더해 갱신합니다. 상태값, 인덱스, 계산 결과를 바꾸는 흐름입니다. |
| src/pwa/code_explainer_rules.js | 1202 | medium | unknown-action-ui | 배열 필터링 |
| src/pwa/code_explainer_rules.js | 1202 | medium | unknown-action-ui | 배열에서 조건에 맞는 항목만 골라 새 배열을 만듭니다. 어떤 조건으로 제외하거나 남기는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1205 | medium | unknown-action-ui | 배열 변환 |
| src/pwa/code_explainer_rules.js | 1205 | medium | unknown-action-ui | 배열의 각 항목을 다른 값으로 바꿔 새 배열을 만듭니다. 원본 항목에서 어떤 값만 뽑거나 계산하는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1208 | high | python-explainer | 문자열/배열 메서드 처리 |
| src/pwa/code_explainer_rules.js | 1208 | high | python-explainer | 문자열이나 배열에 메서드를 이어 붙여 변환, 필터링, 정렬, 결합 같은 처리를 합니다. 앞 단계의 결과가 다음 메서드로 넘어갑니다. |
| src/pwa/code_explainer_rules.js | 1211 | low | general-copy | 객체/배열 값 항목 |
| src/pwa/code_explainer_rules.js | 1211 | low | general-copy | 객체나 배열 안에 들어가는 값 항목입니다. 앞뒤 줄의 중괄호나 대괄호와 함께 데이터 묶음을 구성합니다. |
| src/pwa/code_explainer_rules.js | 1214 | high | javascript-explainer | 예제 코드 문자열 |
| src/pwa/code_explainer_rules.js | 1214 | high | javascript-explainer | JavaScript 파일 안에 샘플로 들어 있는 다른 언어 코드나 설정 파일 내용입니다. 이 줄 자체가 현재 JavaScript로 실행되는 것이 아니라 화면 표시나 테스트 샘플로 쓰일 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1217 | high | python-explainer | 조건 분기 |
| src/pwa/code_explainer_rules.js | 1217 | high | python-explainer | 앞 조건이 맞지 않을 때 실행할 흐름으로 넘어갑니다. if와 else가 어떤 상태를 나누는지 함께 봐야 합니다. |
| src/pwa/code_explainer_rules.js | 1220 | medium | app-ui | 블록/객체 닫기 |
| src/pwa/code_explainer_rules.js | 1220 | medium | app-ui | 앞에서 시작한 함수 호출, 객체, 배열, 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다. |
| src/pwa/code_explainer_rules.js | 1225 | medium | unknown-action-ui | URL 쿼리 파라미터 읽기 |
| src/pwa/code_explainer_rules.js | 1225 | medium | unknown-action-ui | URL의 ?id=... 같은 검색 파라미터를 읽기 위한 객체를 만듭니다. 주소에서 어떤 값을 꺼내 이후 요청이나 화면 처리에 쓰는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1228 | high | javascript-explainer | DOM 요소 생성 |
| src/pwa/code_explainer_rules.js | 1228 | high | javascript-explainer | 브라우저 화면에 넣을 HTML 요소를 JavaScript로 새로 만듭니다. 만든 요소는 아직 화면에 붙은 것이 아니므로 appendChild 같은 삽입 단계가 이어지는지 봐야 합니다. |
| src/pwa/code_explainer_rules.js | 1231 | high | javascript-explainer | DOM 텍스트 설정 |
| src/pwa/code_explainer_rules.js | 1231 | high | javascript-explainer | 화면 요소 안에 표시할 텍스트를 설정합니다. 사용자에게 보이는 문구나 버튼 라벨을 바꾸는 단계입니다. |
| src/pwa/code_explainer_rules.js | 1234 | high | css-explainer | DOM 표시 속성 설정 |
| src/pwa/code_explainer_rules.js | 1234 | high | css-explainer | 화면 요소의 CSS 클래스, HTML 내용, 입력값 같은 표시 속성을 설정합니다. 사용자에게 보이는 UI 상태를 바꾸는 단계입니다. |
| src/pwa/code_explainer_rules.js | 1237 | high | javascript-explainer | DOM 속성 설정 |
| src/pwa/code_explainer_rules.js | 1237 | high | javascript-explainer | 화면 요소에 aria-expanded 같은 HTML 속성을 설정합니다. 접근성, 상태 표시, 동작 제어에 쓰입니다. |
| src/pwa/code_explainer_rules.js | 1240 | high | javascript-explainer | DOM 요소 삽입 |
| src/pwa/code_explainer_rules.js | 1240 | high | javascript-explainer | 만들어 둔 화면 요소를 body나 다른 부모 요소 안에 실제로 붙입니다. 이 단계 이후 브라우저 화면에 요소가 나타납니다. |
| src/pwa/code_explainer_rules.js | 1243 | high | javascript-explainer | 이벤트 기본 동작 방지 |
| src/pwa/code_explainer_rules.js | 1243 | high | javascript-explainer | 클릭이나 제출 이벤트의 기본 브라우저 동작을 막습니다. 페이지 이동이나 폼 제출을 막고 JavaScript 흐름으로 처리하려는 의도입니다. |
| src/pwa/code_explainer_rules.js | 1246 | medium | app-ui | 비동기 병렬 처리 |
| src/pwa/code_explainer_rules.js | 1246 | medium | app-ui | 여러 비동기 작업을 동시에 시작하고 모두 끝날 때까지 기다립니다. fetch 요청 여러 개를 묶어 처리할 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1251 | medium | app-ui | 스케줄 실행 함수 |
| src/pwa/code_explainer_rules.js | 1251 | medium | app-ui | Cloudflare Workers Cron Trigger가 정해진 시간에 호출하는 scheduled 핸들러입니다. 보통 주기 작업, 백필, 큐 투입을 시작합니다. |
| src/pwa/code_explainer_rules.js | 1254 | low | general-copy | Queue 소비 함수 |
| src/pwa/code_explainer_rules.js | 1254 | high | general-copy | Cloudflare Queue에 들어온 메시지 묶음을 처리하는 소비자 핸들러입니다. batch.messages를 반복하며 각 메시지를 처리합니다. |
| src/pwa/code_explainer_rules.js | 1257 | medium | unknown-action-ui | Workers AI 실행 |
| src/pwa/code_explainer_rules.js | 1257 | medium | unknown-action-ui | Cloudflare Workers AI 모델을 호출합니다. 입력 텍스트, 모델 이름, 응답 데이터 구조를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1260 | medium | unknown-action-ui | Vectorize 벡터 저장 |
| src/pwa/code_explainer_rules.js | 1260 | medium | unknown-action-ui | Cloudflare Vectorize 인덱스에 임베딩 벡터를 저장하거나 갱신합니다. id와 values가 검색에 쓸 수 있는 형태인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1263 | medium | unknown-action-ui | Queue 메시지 처리 완료 |
| src/pwa/code_explainer_rules.js | 1263 | medium | unknown-action-ui | Queue 메시지를 정상 처리했다고 확인합니다. ack 이후에는 같은 메시지가 다시 처리되지 않는 흐름입니다. |
| src/pwa/code_explainer_rules.js | 1267 | low | general-copy | Worker 진입 객체 정의 |
| src/pwa/code_explainer_rules.js | 1267 | low | general-copy | Cloudflare Worker가 요청을 받을 때 사용할 기본 객체를 정의합니다. |
| src/pwa/code_explainer_rules.js | 1270 | low | general-copy | 요청 처리 함수 |
| src/pwa/code_explainer_rules.js | 1270 | low | general-copy | 사용자가 Worker 주소로 접속하면 이 함수가 실행됩니다. request는 들어온 요청, env는 DB/KV/R2 같은 연결값입니다. |
| src/pwa/code_explainer_rules.js | 1273 | medium | unknown-action-ui | 요청 주소 분석 |
| src/pwa/code_explainer_rules.js | 1273 | medium | unknown-action-ui | 들어온 요청 주소를 URL 객체로 바꿔서 pathname이나 query를 확인할 수 있게 합니다. |
| src/pwa/code_explainer_rules.js | 1276 | medium | unknown-action-ui | 경로 조건 확인 |
| src/pwa/code_explainer_rules.js | 1276 | medium | unknown-action-ui | 사용자가 어떤 주소로 들어왔는지 보고 분기합니다. |
| src/pwa/code_explainer_rules.js | 1279 | low | general-copy | 요청 본문 JSON 읽기 |
| src/pwa/code_explainer_rules.js | 1279 | low | general-copy | 사용자가 보낸 요청 본문을 JSON으로 읽습니다. 잘못된 JSON이 들어올 수 있으므로 실제 서비스에서는 예외 처리가 필요합니다. |
| src/pwa/code_explainer_rules.js | 1282 | medium | unknown-action-ui | 요청 방식 확인 |
| src/pwa/code_explainer_rules.js | 1282 | medium | unknown-action-ui | GET, POST 같은 HTTP 메서드를 보고 어떤 동작을 할지 나눕니다. |
| src/pwa/code_explainer_rules.js | 1285 | high | sql-explainer | D1 SQL 준비 |
| src/pwa/code_explainer_rules.js | 1285 | high | sql-explainer | Cloudflare D1에 보낼 SQL 문장을 준비합니다. SELECT는 조회, INSERT는 추가, UPDATE는 수정, DELETE는 삭제입니다. |
| src/pwa/code_explainer_rules.js | 1288 | high | sql-explainer | SQL 값 안전하게 연결 |
| src/pwa/code_explainer_rules.js | 1288 | high | sql-explainer | SQL 문장의 물음표 자리에 실제 값을 연결합니다. 문자열을 직접 붙이는 것보다 안전한 방식입니다. |
| src/pwa/code_explainer_rules.js | 1291 | high | sql-explainer | D1 쿼리 실행 |
| src/pwa/code_explainer_rules.js | 1291 | high | sql-explainer | 준비한 SQL을 실제로 실행합니다. all은 여러 행 조회, first는 한 행 조회, run은 INSERT/UPDATE/DELETE 실행에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1294 | medium | unknown-action-ui | D1 데이터베이스 사용 |
| src/pwa/code_explainer_rules.js | 1294 | medium | unknown-action-ui | Cloudflare env에 연결된 DB를 사용합니다. 어떤 SQL을 실행하는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1297 | high | javascript-explainer | 백그라운드 작업 예약 |
| src/pwa/code_explainer_rules.js | 1297 | high | javascript-explainer | 응답을 먼저 돌려준 뒤에도 로그 저장이나 캐시 갱신 같은 작업을 이어서 실행하게 합니다. |
| src/pwa/code_explainer_rules.js | 1301 | low | general-copy | KV 값 읽기 |
| src/pwa/code_explainer_rules.js | 1301 | low | general-copy | Cloudflare KV에서 키에 해당하는 값을 읽습니다. json 옵션을 쓰면 객체 형태로 받을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1304 | medium | unknown-action-ui | KV 값 저장 |
| src/pwa/code_explainer_rules.js | 1304 | medium | unknown-action-ui | Cloudflare KV에 키와 값을 저장합니다. TTL이나 만료 정책이 필요한지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1307 | medium | unknown-action-ui | KV 값 삭제 |
| src/pwa/code_explainer_rules.js | 1307 | medium | unknown-action-ui | Cloudflare KV에서 특정 키의 값을 삭제합니다. 복구가 어려울 수 있으니 키를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1310 | medium | unknown-action-ui | R2 객체 읽기 |
| src/pwa/code_explainer_rules.js | 1310 | medium | unknown-action-ui | Cloudflare R2 버킷에서 파일/객체를 읽습니다. 키 경로와 null 처리 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1313 | medium | unknown-action-ui | R2 객체 저장 |
| src/pwa/code_explainer_rules.js | 1313 | medium | unknown-action-ui | Cloudflare R2 버킷에 파일/객체를 저장합니다. 덮어쓰기 여부와 Content-Type을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1316 | medium | unknown-action-ui | R2 객체 삭제 |
| src/pwa/code_explainer_rules.js | 1316 | medium | unknown-action-ui | Cloudflare R2 버킷의 객체를 삭제합니다. 대상 키를 반드시 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1319 | medium | unknown-action-ui | Queue 메시지 전송 |
| src/pwa/code_explainer_rules.js | 1319 | medium | unknown-action-ui | Cloudflare Queue에 나중에 처리할 메시지를 넣습니다. 소비자 Worker가 어떤 형식의 메시지를 기대하는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1322 | high | javascript-explainer | KV 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1322 | high | javascript-explainer | Cloudflare KV에서 값을 읽거나 씁니다. |
| src/pwa/code_explainer_rules.js | 1325 | high | javascript-explainer | R2 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1325 | high | javascript-explainer | Cloudflare R2에 있는 파일이나 객체를 읽고 쓸 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1328 | low | general-copy | Workers AI 사용 |
| src/pwa/code_explainer_rules.js | 1328 | low | general-copy | Cloudflare Workers AI 모델 호출을 준비하거나 실행합니다. |
| src/pwa/code_explainer_rules.js | 1331 | low | general-copy | JSON 응답 반환 |
| src/pwa/code_explainer_rules.js | 1331 | low | general-copy | 처리 결과를 JSON 형식으로 사용자에게 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 1334 | low | general-copy | 응답 반환 |
| src/pwa/code_explainer_rules.js | 1334 | low | general-copy | 문자열, 상태 코드, 헤더 등을 담은 HTTP 응답을 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 1337 | medium | unknown-action-ui | 캐시 응답 조회 |
| src/pwa/code_explainer_rules.js | 1337 | medium | unknown-action-ui | Cloudflare 캐시에서 기존 응답이 있는지 확인합니다. 캐시 hit이면 원본 API나 DB를 다시 호출하지 않을 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1340 | medium | unknown-action-ui | 응답 캐시에 저장 |
| src/pwa/code_explainer_rules.js | 1340 | medium | unknown-action-ui | 응답을 Cloudflare 엣지 캐시에 저장합니다. 캐시 키와 만료 조건을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1343 | medium | unknown-action-ui | 캐시 삭제 |
| src/pwa/code_explainer_rules.js | 1343 | medium | unknown-action-ui | Cloudflare 캐시에서 특정 응답을 삭제합니다. 캐시 키가 맞는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1346 | medium | unknown-action-ui | Cloudflare 캐시 사용 |
| src/pwa/code_explainer_rules.js | 1346 | medium | unknown-action-ui | Cloudflare 엣지 캐시에 응답을 저장하거나 읽습니다. 캐시 키와 만료 정책을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1349 | medium | unknown-action-ui | CORS 헤더 설정 |
| src/pwa/code_explainer_rules.js | 1349 | medium | unknown-action-ui | 다른 도메인에서 이 API를 호출할 수 있는지 제어합니다. 공개 범위를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1354 | high | javascript-explainer | 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 1354 | high | javascript-explainer | 다른 JavaScript 파일이나 패키지에서 필요한 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 1357 | low | general-copy | 모듈로 내보내기 |
| src/pwa/code_explainer_rules.js | 1357 | low | general-copy | 다른 파일에서 import해서 사용할 수 있도록 함수, 값, 클래스를 공개합니다. |
| src/pwa/code_explainer_rules.js | 1360 | high | javascript-explainer | DOM 준비 후 실행 |
| src/pwa/code_explainer_rules.js | 1360 | high | javascript-explainer | HTML 문서 구조가 준비된 뒤에 화면 요소를 찾고 이벤트를 연결합니다. |
| src/pwa/code_explainer_rules.js | 1363 | low | general-copy | 쿼리 문자열 읽기 |
| src/pwa/code_explainer_rules.js | 1363 | low | general-copy | URL의 ?id= 같은 검색 파라미터 값을 읽습니다. 값이 없을 때의 처리가 필요합니다. |
| src/pwa/code_explainer_rules.js | 1366 | medium | app-ui | 오류 대비 시작 |
| src/pwa/code_explainer_rules.js | 1366 | medium | app-ui | 아래 코드에서 오류가 나면 catch/finally로 넘어가 처리할 수 있게 준비합니다. |
| src/pwa/code_explainer_rules.js | 1369 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 1369 | low | general-copy | try 안에서 발생한 오류를 잡아 로그를 남기거나 사용자에게 실패 응답을 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 1372 | low | general-copy | 마지막 정리 |
| src/pwa/code_explainer_rules.js | 1372 | low | general-copy | 성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. |
| src/pwa/code_explainer_rules.js | 1376 | high | javascript-explainer | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 1376 | high | javascript-explainer | fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1380 | medium | unknown-action-ui | 비동기 외부 요청 |
| src/pwa/code_explainer_rules.js | 1380 | medium | unknown-action-ui | fetch 요청이 끝날 때까지 기다립니다. 네트워크 실패와 응답 상태 확인이 필요합니다. |
| src/pwa/code_explainer_rules.js | 1382 | low | general-copy | 비동기 작업 대기 |
| src/pwa/code_explainer_rules.js | 1382 | low | general-copy | Promise가 끝날 때까지 기다린 뒤 다음 줄을 실행합니다. 실패하면 catch로 넘어갈 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1385 | low | general-copy | Promise 묶음 처리 |
| src/pwa/code_explainer_rules.js | 1385 | low | general-copy | 여러 비동기 작업을 함께 실행하거나 가장 먼저 끝나는 작업을 기다립니다. |
| src/pwa/code_explainer_rules.js | 1388 | medium | unknown-action-ui | CSS 클래스 변경 |
| src/pwa/code_explainer_rules.js | 1388 | medium | unknown-action-ui | 화면 요소의 클래스를 추가, 제거, 토글하거나 확인해서 스타일이나 상태 표시를 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1391 | medium | unknown-action-ui | 자료구조 항목 갱신 |
| src/pwa/code_explainer_rules.js | 1391 | medium | unknown-action-ui | 배열, Set, Map 같은 자료구조에 항목을 추가하거나 값을 설정합니다. 누적되는 데이터가 무엇인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1394 | medium | unknown-action-ui | 자료구조 항목 조회 |
| src/pwa/code_explainer_rules.js | 1394 | medium | unknown-action-ui | Map, Set, 저장소, 상태 객체에서 특정 항목을 꺼내거나 존재 여부를 확인합니다. |
| src/pwa/code_explainer_rules.js | 1397 | medium | unknown-action-ui | 함수 호출 |
| src/pwa/code_explainer_rules.js | 1397 | medium | unknown-action-ui | 이미 정의했거나 브라우저가 제공하는 함수를 실행합니다. 인자와 실행 결과가 화면 상태나 데이터에 어떤 영향을 주는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1400 | high | javascript-explainer | JSON 문자열 변환 |
| src/pwa/code_explainer_rules.js | 1400 | high | javascript-explainer | JSON 문자열을 JavaScript 객체로 바꿉니다. 잘못된 JSON이면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1403 | high | javascript-explainer | JSON 문자열 만들기 |
| src/pwa/code_explainer_rules.js | 1403 | high | javascript-explainer | JavaScript 객체를 저장하거나 전송하기 쉬운 JSON 문자열로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1406 | high | javascript-explainer | 응답 JSON 변환 |
| src/pwa/code_explainer_rules.js | 1406 | high | javascript-explainer | fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1409 | medium | unknown-action-ui | 응답 상태 확인 |
| src/pwa/code_explainer_rules.js | 1409 | medium | unknown-action-ui | HTTP 응답이 성공인지 상태 코드로 확인합니다. 실패 응답을 그대로 성공처럼 처리하지 않게 합니다. |
| src/pwa/code_explainer_rules.js | 1412 | low | general-copy | 배열로 변환 |
| src/pwa/code_explainer_rules.js | 1412 | low | general-copy | NodeList나 반복 가능한 값을 배열로 바꿔 map/filter 같은 배열 메서드를 쓰기 쉽게 만듭니다. |
| src/pwa/code_explainer_rules.js | 1415 | low | general-copy | 배열 변환 |
| src/pwa/code_explainer_rules.js | 1415 | low | general-copy | 배열의 각 항목을 다른 값으로 바꾼 새 배열을 만듭니다. |
| src/pwa/code_explainer_rules.js | 1418 | high | python-explainer | 배열 필터링 |
| src/pwa/code_explainer_rules.js | 1418 | high | python-explainer | 배열에서 조건에 맞는 항목만 남긴 새 배열을 만듭니다. |
| src/pwa/code_explainer_rules.js | 1421 | low | general-copy | 배열 누적 계산 |
| src/pwa/code_explainer_rules.js | 1421 | low | general-copy | 배열 값을 하나의 결과로 누적 계산합니다. 합계, 그룹화, 인덱스 만들기에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1424 | high | css-explainer | CSS 클래스 변경 |
| src/pwa/code_explainer_rules.js | 1424 | high | css-explainer | 화면 요소의 클래스를 추가/삭제/토글해서 스타일이나 상태를 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1427 | high | javascript-explainer | data 속성 읽기 |
| src/pwa/code_explainer_rules.js | 1427 | high | javascript-explainer | HTML의 data-* 속성에 저장된 값을 읽습니다. 화면 요소의 상태나 식별값을 코드에서 사용할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 1431 | medium | unknown-action-ui | Node.js 환경변수 읽기 |
| src/pwa/code_explainer_rules.js | 1431 | medium | unknown-action-ui | Node.js 실행 환경에 설정된 환경변수를 읽습니다. API 주소, 실행 모드, 비밀키 이름처럼 코드 밖에서 주입되는 설정값을 확인할 때 자주 씁니다. 실제 비밀값을 코드나 화면에 그대로 출력하지 않도록 주의해야 합니다. |
| src/pwa/code_explainer_rules.js | 1434 | low | general-copy | 화면 요소 찾기 |
| src/pwa/code_explainer_rules.js | 1434 | low | general-copy | HTML 화면에서 특정 요소를 찾아 값을 읽거나 내용을 바꾸기 위해 준비합니다. |
| src/pwa/code_explainer_rules.js | 1437 | high | javascript-explainer | 이벤트 처리 함수 정의 |
| src/pwa/code_explainer_rules.js | 1437 | high | javascript-explainer | 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수 정의를 연결합니다. |
| src/pwa/code_explainer_rules.js | 1440 | high | javascript-explainer | 브라우저 저장소 사용 |
| src/pwa/code_explainer_rules.js | 1440 | high | javascript-explainer | 현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다. |
| src/pwa/code_explainer_rules.js | 1444 | low | general-copy | 값 돌려주기 |
| src/pwa/code_explainer_rules.js | 1444 | low | general-copy | 함수 안에서 만든 값이나 계산 결과를 호출한 곳으로 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 1447 | low | general-copy | 화면/콘솔에 출력 |
| src/pwa/code_explainer_rules.js | 1447 | low | general-copy | 사용자에게 메시지를 보여주거나 개발자 콘솔에 값을 출력합니다. |
| src/pwa/code_explainer_rules.js | 1450 | high | javascript-explainer | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 1450 | high | javascript-explainer | 값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다. |
| src/pwa/code_explainer_rules.js | 1453 | low | general-copy | 함수 정의 |
| src/pwa/code_explainer_rules.js | 1453 | low | general-copy | 나중에 호출해서 실행할 코드 묶음을 만듭니다. async가 붙으면 함수 안에서 await로 비동기 작업을 기다릴 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1456 | high | python-explainer | 조건 검사 |
| src/pwa/code_explainer_rules.js | 1456 | high | python-explainer | 괄호 안 조건이 맞으면 중괄호 안 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1459 | high | python-explainer | 조건이 아닐 때 |
| src/pwa/code_explainer_rules.js | 1459 | high | python-explainer | 앞 조건이 맞지 않을 때 실행됩니다. |
| src/pwa/code_explainer_rules.js | 1462 | low | general-copy | 반복 실행 |
| src/pwa/code_explainer_rules.js | 1462 | low | general-copy | 여러 값을 하나씩 처리하거나 정해진 횟수만큼 반복합니다. |
| src/pwa/code_explainer_rules.js | 1465 | low | general-copy | 외부 요청 |
| src/pwa/code_explainer_rules.js | 1465 | low | general-copy | 다른 URL이나 API에 네트워크 요청을 보냅니다. |
| src/pwa/code_explainer_rules.js | 1468 | high | javascript-explainer | Worker/JavaScript 코드 실행 |
| src/pwa/code_explainer_rules.js | 1468 | high | javascript-explainer | JavaScript 코드 실행 |
| src/pwa/code_explainer_rules.js | 1468 | high | javascript-explainer | 이 줄은 위에서 아래로 실행되는 JavaScript 코드입니다. |
| src/pwa/code_explainer_rules.js | 1481 | medium | app-ui | JSON 객체 시작 |
| src/pwa/code_explainer_rules.js | 1481 | medium | app-ui | 여러 설정 값을 key와 value 쌍으로 묶는 JSON 객체를 시작합니다. |
| src/pwa/code_explainer_rules.js | 1484 | medium | unknown-action-ui | JSON 객체 닫기 |
| src/pwa/code_explainer_rules.js | 1484 | medium | unknown-action-ui | 앞에서 시작한 JSON 객체 영역을 닫습니다. 쉼표 위치가 맞는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1487 | medium | app-ui | JSON 배열 시작 |
| src/pwa/code_explainer_rules.js | 1487 | medium | app-ui | 여러 값을 순서대로 담는 JSON 배열을 시작합니다. |
| src/pwa/code_explainer_rules.js | 1490 | medium | app-ui | JSON 배열 닫기 |
| src/pwa/code_explainer_rules.js | 1490 | medium | app-ui | 앞에서 시작한 JSON 배열 영역을 닫습니다. |
| src/pwa/code_explainer_rules.js | 1499 | medium | app-ui | JSON 설정 그룹 시작 |
| src/pwa/code_explainer_rules.js | 1499 | medium | app-ui | 설정 묶음을 시작합니다. 아래 들여쓰기된 값들이 이 그룹에 속합니다. |
| src/pwa/code_explainer_rules.js | 1502 | medium | app-ui | JSON 목록 설정 시작 |
| src/pwa/code_explainer_rules.js | 1502 | medium | app-ui | 항목에 여러 값을 배열로 넣기 시작합니다. |
| src/pwa/code_explainer_rules.js | 1505 | medium | app-ui | 문자열 설정값 |
| src/pwa/code_explainer_rules.js | 1505 | medium | app-ui | 설정에 문자열 값을 지정합니다. 따옴표 안의 값이 실제 옵션 이름입니다. |
| src/pwa/code_explainer_rules.js | 1508 | medium | app-ui | 불리언 설정값 |
| src/pwa/code_explainer_rules.js | 1508 | medium | app-ui | 설정을 켜거나 끕니다. true는 사용, false는 사용하지 않음을 뜻합니다. |
| src/pwa/code_explainer_rules.js | 1511 | medium | app-ui | 숫자 설정값 |
| src/pwa/code_explainer_rules.js | 1511 | medium | app-ui | 설정에 숫자 값을 지정합니다. |
| src/pwa/code_explainer_rules.js | 1514 | medium | app-ui | 빈 설정값 |
| src/pwa/code_explainer_rules.js | 1514 | medium | app-ui | 값을 null로 두어 값이 없음을 표시합니다. |
| src/pwa/code_explainer_rules.js | 1517 | medium | unknown-action-ui | JSON key-value 설정 |
| src/pwa/code_explainer_rules.js | 1517 | medium | unknown-action-ui | 이름의 설정값을 지정합니다. 콜론 오른쪽 값과 끝 쉼표를 확인합니다. |
| src/pwa/code_explainer_rules.js | 1521 | low | general-copy | JSON 문자열 항목 |
| src/pwa/code_explainer_rules.js | 1521 | low | general-copy | 배열 안에 들어가는 문자열 항목입니다. 쉼표로 다음 항목과 구분합니다. |
| src/pwa/code_explainer_rules.js | 1524 | medium | unknown-action-ui | JSON 설정 줄 |
| src/pwa/code_explainer_rules.js | 1524 | medium | unknown-action-ui | JSON 설정 파일의 한 줄입니다. key, value, 쉼표, 중괄호 구조가 맞는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1535 | high | sql-explainer | 조회할 컬럼 선택 |
| src/pwa/code_explainer_rules.js | 1535 | high | sql-explainer | 데이터베이스에서 어떤 컬럼 값을 가져올지 정합니다. COUNT 같은 집계 함수가 있으면 여러 행을 묶어 요약한 값을 함께 조회합니다. 별칭 AS가 있으면 결과 컬럼 이름을 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1537 | low | general-copy | 조회할 컬럼 선택 |
| src/pwa/code_explainer_rules.js | 1537 | low | general-copy | 데이터베이스에서 어떤 컬럼 값을 가져올지 정합니다. 별칭 AS가 있으면 결과 컬럼 이름을 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1540 | high | sql-explainer | 기준 테이블 선택 |
| src/pwa/code_explainer_rules.js | 1540 | high | sql-explainer | 조회의 기준이 되는 테이블을 지정합니다. 이 테이블에서 행을 읽기 시작합니다. |
| src/pwa/code_explainer_rules.js | 1543 | medium | unknown-action-ui | SQL 테이블 조인 |
| src/pwa/code_explainer_rules.js | 1543 | medium | unknown-action-ui | 다른 테이블을 함께 붙여서 조회합니다. JOIN 조건이 맞는 행끼리 연결되므로, 어떤 기준 컬럼으로 이어지는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1546 | high | sql-explainer | 조인 조건 지정 |
| src/pwa/code_explainer_rules.js | 1546 | high | sql-explainer | 두 테이블의 어떤 컬럼이 서로 대응되는지 정합니다. 보통 id와 외래키를 비교합니다. |
| src/pwa/code_explainer_rules.js | 1549 | high | python-explainer | 조회 조건 필터 |
| src/pwa/code_explainer_rules.js | 1549 | high | python-explainer | 조건에 맞는 행만 남깁니다. 상태값, 날짜, id 같은 기준으로 결과를 줄입니다. |
| src/pwa/code_explainer_rules.js | 1552 | high | sql-explainer | 그룹으로 묶기 |
| src/pwa/code_explainer_rules.js | 1552 | high | sql-explainer | 같은 값을 가진 행들을 하나의 그룹으로 묶습니다. COUNT, SUM, AVG 같은 집계와 함께 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 1555 | high | sql-explainer | 그룹 결과 조건 필터 |
| src/pwa/code_explainer_rules.js | 1555 | high | sql-explainer | GROUP BY로 묶은 뒤의 집계 결과에 조건을 걸어 필요한 그룹만 남깁니다. |
| src/pwa/code_explainer_rules.js | 1558 | low | general-copy | 결과 정렬 |
| src/pwa/code_explainer_rules.js | 1558 | low | general-copy | 조회 결과를 특정 컬럼 기준으로 오름차순 또는 내림차순 정렬합니다. |
| src/pwa/code_explainer_rules.js | 1561 | low | general-copy | 결과 개수 제한 |
| src/pwa/code_explainer_rules.js | 1561 | low | general-copy | 조회 결과 중 가져올 행의 최대 개수를 제한합니다. |
| src/pwa/code_explainer_rules.js | 1564 | high | sql-explainer | 행 추가 |
| src/pwa/code_explainer_rules.js | 1564 | high | sql-explainer | 테이블에 새 데이터를 추가합니다. 컬럼 목록과 VALUES 값의 순서가 맞아야 합니다. |
| src/pwa/code_explainer_rules.js | 1567 | high | sql-explainer | 추가할 값 지정 |
| src/pwa/code_explainer_rules.js | 1567 | high | sql-explainer | INSERT 문에서 테이블에 넣을 실제 값을 지정합니다. |
| src/pwa/code_explainer_rules.js | 1570 | high | sql-explainer | 행 수정 대상 지정 |
| src/pwa/code_explainer_rules.js | 1570 | high | sql-explainer | 어떤 테이블의 기존 데이터를 수정할지 정합니다. WHERE 없이 쓰면 많은 행이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1573 | low | general-copy | 수정할 값 지정 |
| src/pwa/code_explainer_rules.js | 1573 | low | general-copy | UPDATE 문에서 어떤 컬럼 값을 새 값으로 바꿀지 정합니다. |
| src/pwa/code_explainer_rules.js | 1576 | high | sql-explainer | 행 삭제 대상 지정 |
| src/pwa/code_explainer_rules.js | 1576 | high | sql-explainer | 테이블에서 행을 삭제합니다. WHERE 조건이 없으면 많은 데이터가 삭제될 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1579 | high | sql-explainer | 테이블 생성 |
| src/pwa/code_explainer_rules.js | 1579 | high | sql-explainer | 새 테이블을 만들고 컬럼 구조를 정의합니다. |
| src/pwa/code_explainer_rules.js | 1582 | high | sql-explainer | 집계 함수 사용 |
| src/pwa/code_explainer_rules.js | 1582 | high | sql-explainer | 여러 행을 세거나 합계, 평균, 최솟값, 최댓값으로 요약합니다. |
| src/pwa/code_explainer_rules.js | 1585 | high | sql-explainer | 컬럼 이름 |
| src/pwa/code_explainer_rules.js | 1585 | high | sql-explainer | 조회하거나 그룹으로 묶을 컬럼 이름입니다. 테이블 별칭이 붙으면 어느 테이블의 컬럼인지 더 분명해집니다. |
| src/pwa/code_explainer_rules.js | 1588 | medium | unknown-action-ui | SQL 줄 해석 |
| src/pwa/code_explainer_rules.js | 1588 | medium | unknown-action-ui | SQL 쿼리의 한 줄입니다. 데이터를 조회, 필터링, 묶기, 정렬하기 위한 문장인지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1597 | high | css-explainer | 반응형 조건 시작 |
| src/pwa/code_explainer_rules.js | 1597 | high | css-explainer | 화면 너비나 기기 조건에 따라 다른 CSS 규칙을 적용하는 구간을 시작합니다. |
| src/pwa/code_explainer_rules.js | 1600 | high | css-explainer | CSS 기능 지원 조건 |
| src/pwa/code_explainer_rules.js | 1600 | high | css-explainer | 브라우저가 특정 CSS 기능을 지원할 때만 아래 스타일을 적용합니다. |
| src/pwa/code_explainer_rules.js | 1603 | high | css-explainer | 애니메이션 단계 정의 |
| src/pwa/code_explainer_rules.js | 1603 | high | css-explainer | CSS 애니메이션에서 시간 흐름에 따라 바뀔 스타일 단계를 정의합니다. |
| src/pwa/code_explainer_rules.js | 1606 | high | css-explainer | 외부 CSS 불러오기 |
| src/pwa/code_explainer_rules.js | 1606 | high | css-explainer | 다른 CSS 파일이나 글꼴 스타일을 현재 CSS로 불러옵니다. |
| src/pwa/code_explainer_rules.js | 1609 | high | css-explainer | CSS 선택자 블록 시작 |
| src/pwa/code_explainer_rules.js | 1609 | high | css-explainer | 어떤 HTML 요소에 스타일을 적용할지 선택하고, 중괄호 안에 스타일 규칙을 작성합니다. |
| src/pwa/code_explainer_rules.js | 1612 | high | css-explainer | Flex 레이아웃 설정 |
| src/pwa/code_explainer_rules.js | 1612 | high | css-explainer | 자식 요소들을 가로/세로 방향으로 유연하게 배치하는 flex 레이아웃을 켭니다. |
| src/pwa/code_explainer_rules.js | 1615 | high | css-explainer | Grid 레이아웃 설정 |
| src/pwa/code_explainer_rules.js | 1615 | high | css-explainer | 자식 요소들을 행과 열 격자 기준으로 배치하는 grid 레이아웃을 켭니다. |
| src/pwa/code_explainer_rules.js | 1618 | high | css-explainer | Grid 행열 크기 설정 |
| src/pwa/code_explainer_rules.js | 1618 | high | css-explainer | grid 레이아웃에서 열이나 행의 개수와 크기 비율을 정합니다. |
| src/pwa/code_explainer_rules.js | 1621 | high | css-explainer | 요소 간격 설정 |
| src/pwa/code_explainer_rules.js | 1621 | high | css-explainer | flex나 grid 안의 자식 요소 사이 간격을 정합니다. |
| src/pwa/code_explainer_rules.js | 1624 | medium | app-ui | 안쪽 여백 설정 |
| src/pwa/code_explainer_rules.js | 1624 | medium | app-ui | 요소 테두리 안쪽의 여백을 정해서 내용이 가장자리에 붙지 않게 합니다. |
| src/pwa/code_explainer_rules.js | 1627 | medium | app-ui | 바깥 여백 설정 |
| src/pwa/code_explainer_rules.js | 1627 | medium | app-ui | 요소 바깥쪽 여백을 정해서 다른 요소와의 거리를 조절합니다. |
| src/pwa/code_explainer_rules.js | 1630 | high | css-explainer | 정렬 방식 설정 |
| src/pwa/code_explainer_rules.js | 1630 | high | css-explainer | flex나 grid 안에서 자식 요소를 가로/세로 방향으로 어떻게 정렬할지 정합니다. |
| src/pwa/code_explainer_rules.js | 1633 | high | css-explainer | Flex 배치 방식 설정 |
| src/pwa/code_explainer_rules.js | 1633 | high | css-explainer | flex 아이템의 방향, 줄바꿈, 크기 비율 같은 배치 방식을 정합니다. |
| src/pwa/code_explainer_rules.js | 1636 | medium | app-ui | 크기 설정 |
| src/pwa/code_explainer_rules.js | 1636 | medium | app-ui | 요소의 너비나 높이, 최소/최대 크기를 정합니다. |
| src/pwa/code_explainer_rules.js | 1639 | medium | app-ui | 색상 설정 |
| src/pwa/code_explainer_rules.js | 1639 | medium | app-ui | 글자색이나 배경색을 정해서 화면의 시각적 표현을 바꿉니다. |
| src/pwa/code_explainer_rules.js | 1642 | medium | app-ui | 글자 스타일 설정 |
| src/pwa/code_explainer_rules.js | 1642 | medium | app-ui | 글자 크기, 굵기, 줄간격, 정렬 같은 텍스트 표현을 정합니다. |
| src/pwa/code_explainer_rules.js | 1645 | medium | app-ui | 테두리/그림자 설정 |
| src/pwa/code_explainer_rules.js | 1645 | medium | app-ui | 요소의 테두리, 둥근 모서리, 그림자 효과를 정합니다. |
| src/pwa/code_explainer_rules.js | 1648 | medium | app-ui | 위치 배치 설정 |
| src/pwa/code_explainer_rules.js | 1648 | medium | app-ui | 요소의 배치 방식과 화면 내 위치, 겹침 순서를 정합니다. |
| src/pwa/code_explainer_rules.js | 1651 | high | css-explainer | CSS 속성 설정 |
| src/pwa/code_explainer_rules.js | 1651 | high | css-explainer | 선택된 HTML 요소에 적용할 스타일 속성과 값을 정합니다. |
| src/pwa/code_explainer_rules.js | 1654 | medium | unknown-action-ui | CSS 줄 해석 |
| src/pwa/code_explainer_rules.js | 1654 | medium | unknown-action-ui | CSS 스타일시트의 한 줄입니다. 어떤 화면 요소의 모양이나 배치를 바꾸는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1663 | low | general-copy | HTML 문서 타입 선언 |
| src/pwa/code_explainer_rules.js | 1663 | low | general-copy | 브라우저에게 이 파일이 최신 HTML 문서라는 것을 알려줍니다. |
| src/pwa/code_explainer_rules.js | 1666 | medium | app-ui | HTML 문서 시작 |
| src/pwa/code_explainer_rules.js | 1666 | medium | app-ui | 페이지 전체를 감싸는 HTML 문서의 시작 영역입니다. |
| src/pwa/code_explainer_rules.js | 1669 | medium | app-ui | 문서 정보 영역 시작 |
| src/pwa/code_explainer_rules.js | 1669 | medium | app-ui | 화면에 직접 보이기보다 제목, 문자셋, 스타일 연결 같은 문서 정보를 담는 영역입니다. |
| src/pwa/code_explainer_rules.js | 1672 | medium | app-ui | 화면 본문 시작 |
| src/pwa/code_explainer_rules.js | 1672 | medium | app-ui | 사용자에게 실제로 보이는 화면 요소들을 담는 영역입니다. |
| src/pwa/code_explainer_rules.js | 1675 | medium | unknown-action-ui | 입력 폼 정의 |
| src/pwa/code_explainer_rules.js | 1675 | medium | unknown-action-ui | 사용자가 입력한 값을 제출할 수 있는 form 영역을 만듭니다. action, method, id 같은 속성을 확인합니다. |
| src/pwa/code_explainer_rules.js | 1678 | low | general-copy | 입력 라벨 정의 |
| src/pwa/code_explainer_rules.js | 1678 | low | general-copy | 입력 칸이 무엇을 의미하는지 사용자에게 보여주는 설명 문구를 만듭니다. for 속성은 input id와 맞아야 합니다. |
| src/pwa/code_explainer_rules.js | 1681 | medium | unknown-action-ui | 입력 칸 정의 |
| src/pwa/code_explainer_rules.js | 1681 | medium | unknown-action-ui | 사용자가 값을 넣는 입력 칸을 만듭니다. 이메일 칸인지, 필수 입력인지 같은 속성을 확인합니다. |
| src/pwa/code_explainer_rules.js | 1684 | medium | unknown-action-ui | 버튼 정의 |
| src/pwa/code_explainer_rules.js | 1684 | medium | unknown-action-ui | 사용자가 클릭할 수 있는 버튼을 만듭니다. form 안에서는 type이 submit인지 button인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1687 | medium | unknown-action-ui | 링크 정의 |
| src/pwa/code_explainer_rules.js | 1687 | medium | unknown-action-ui | 다른 페이지나 위치로 이동하는 링크를 만듭니다. href 주소와 새 창 여부를 확인합니다. |
| src/pwa/code_explainer_rules.js | 1690 | medium | unknown-action-ui | 이미지 표시 |
| src/pwa/code_explainer_rules.js | 1690 | medium | unknown-action-ui | 화면에 이미지를 보여줍니다. src 경로와 alt 대체 텍스트가 있는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1693 | medium | unknown-action-ui | 스크립트 연결 |
| src/pwa/code_explainer_rules.js | 1693 | medium | unknown-action-ui | JavaScript 파일을 불러오거나 실행합니다. 외부 스크립트 주소와 실행 위치를 확인합니다. |
| src/pwa/code_explainer_rules.js | 1696 | high | css-explainer | 외부 리소스 연결 |
| src/pwa/code_explainer_rules.js | 1696 | high | css-explainer | CSS 파일이나 아이콘 같은 외부 리소스를 HTML 문서에 연결합니다. |
| src/pwa/code_explainer_rules.js | 1699 | medium | app-ui | 메타 정보 설정 |
| src/pwa/code_explainer_rules.js | 1699 | medium | app-ui | 문자셋, 화면 크기, 검색 정보처럼 브라우저가 참고하는 문서 정보를 설정합니다. |
| src/pwa/code_explainer_rules.js | 1702 | low | general-copy | 제목 표시 |
| src/pwa/code_explainer_rules.js | 1702 | low | general-copy | 페이지나 구역의 제목을 화면에 표시합니다. h1에서 h6으로 갈수록 제목 단계가 낮아집니다. |
| src/pwa/code_explainer_rules.js | 1705 | low | general-copy | 화면 구역 정의 |
| src/pwa/code_explainer_rules.js | 1705 | low | general-copy | 여러 화면 요소를 묶는 레이아웃 구역을 만듭니다. class나 id로 스타일과 스크립트 대상이 될 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1708 | low | general-copy | 텍스트 표시 |
| src/pwa/code_explainer_rules.js | 1708 | low | general-copy | 사용자에게 보여줄 문장이나 짧은 텍스트 조각을 화면에 배치합니다. |
| src/pwa/code_explainer_rules.js | 1711 | low | general-copy | 목록 영역 정의 |
| src/pwa/code_explainer_rules.js | 1711 | low | general-copy | 여러 항목을 순서 있는 목록이나 순서 없는 목록으로 묶습니다. |
| src/pwa/code_explainer_rules.js | 1714 | low | general-copy | 목록 항목 정의 |
| src/pwa/code_explainer_rules.js | 1714 | low | general-copy | 목록 안에 들어갈 개별 항목을 만듭니다. |
| src/pwa/code_explainer_rules.js | 1717 | medium | unknown-action-ui | HTML 영역 닫기 |
| src/pwa/code_explainer_rules.js | 1717 | medium | unknown-action-ui | 앞에서 시작한 HTML 태그 영역을 닫습니다. 열린 태그와 닫는 태그가 맞는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1720 | medium | unknown-action-ui | HTML 요소 정의 |
| src/pwa/code_explainer_rules.js | 1720 | medium | unknown-action-ui | 화면에 표시되거나 구조를 만드는 HTML 태그입니다. 태그 이름과 속성 값을 확인합니다. |
| src/pwa/code_explainer_rules.js | 1723 | medium | unknown-action-ui | HTML 줄 해석 |
| src/pwa/code_explainer_rules.js | 1723 | medium | unknown-action-ui | HTML 문서의 한 줄입니다. 화면 구조나 속성 설정에 어떤 역할을 하는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1731 | high | devops-explainer | 패키지 이름 설정 |
| src/pwa/code_explainer_rules.js | 1731 | high | devops-explainer | package.json에서 이 Node/npm 프로젝트의 이름을 정합니다. |
| src/pwa/code_explainer_rules.js | 1734 | medium | app-ui | 패키지 버전 설정 |
| src/pwa/code_explainer_rules.js | 1734 | medium | app-ui | package.json에서 현재 패키지의 버전 번호를 정합니다. |
| src/pwa/code_explainer_rules.js | 1737 | medium | unknown-action-ui | npm 스크립트 정의 |
| src/pwa/code_explainer_rules.js | 1737 | medium | unknown-action-ui | 터미널에서 npm run 뒤에 붙여 실행할 작업을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1743 | medium | app-ui | 패키지 이름 설정 |
| src/pwa/code_explainer_rules.js | 1743 | medium | app-ui | 이 프로젝트나 패키지의 이름을 정합니다. |
| src/pwa/code_explainer_rules.js | 1746 | medium | app-ui | 패키지 버전 설정 |
| src/pwa/code_explainer_rules.js | 1746 | medium | app-ui | 현재 패키지의 버전 번호를 기록합니다. |
| src/pwa/code_explainer_rules.js | 1749 | medium | unknown-action-ui | npm 스크립트 목록 |
| src/pwa/code_explainer_rules.js | 1749 | medium | unknown-action-ui | npm run build 같은 명령으로 실행할 스크립트들을 모아 둔 영역입니다. |
| src/pwa/code_explainer_rules.js | 1752 | medium | unknown-action-ui | npm 스크립트 정의 |
| src/pwa/code_explainer_rules.js | 1752 | medium | unknown-action-ui | 터미널에서 npm run 뒤에 붙여 실행할 작업을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1755 | low | general-copy | 실행 의존성 목록 |
| src/pwa/code_explainer_rules.js | 1755 | low | general-copy | 앱이 실제 실행될 때 필요한 패키지 목록입니다. |
| src/pwa/code_explainer_rules.js | 1758 | low | general-copy | 개발 의존성 목록 |
| src/pwa/code_explainer_rules.js | 1758 | low | general-copy | 개발, 빌드, 테스트 때 필요한 패키지 목록입니다. |
| src/pwa/code_explainer_rules.js | 1761 | medium | unknown-action-ui | 패키지 항목 설정 |
| src/pwa/code_explainer_rules.js | 1761 | medium | unknown-action-ui | package.json 안의 설정 항목입니다. 패키지명, 버전, 스크립트 값을 확인합니다. |
| src/pwa/code_explainer_rules.js | 1764 | high | devops-explainer | package.json 설정 |
| src/pwa/code_explainer_rules.js | 1764 | high | devops-explainer | Node/npm 프로젝트 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1772 | high | devops-explainer | 워크플로 이름 |
| src/pwa/code_explainer_rules.js | 1772 | high | devops-explainer | GitHub Actions 화면에 표시될 자동화 작업 이름입니다. |
| src/pwa/code_explainer_rules.js | 1775 | high | python-explainer | 실행 조건 설정 |
| src/pwa/code_explainer_rules.js | 1775 | high | python-explainer | push, pull_request 같은 어떤 사건에서 자동화를 실행할지 정합니다. |
| src/pwa/code_explainer_rules.js | 1778 | medium | app-ui | 트리거 이벤트 설정 |
| src/pwa/code_explainer_rules.js | 1778 | medium | app-ui | 어떤 GitHub 이벤트에서 워크플로가 시작되는지 지정합니다. |
| src/pwa/code_explainer_rules.js | 1781 | high | python-explainer | 브랜치 조건 설정 |
| src/pwa/code_explainer_rules.js | 1781 | high | python-explainer | main 같은 특정 브랜치에서만 실행되도록 제한합니다. |
| src/pwa/code_explainer_rules.js | 1784 | low | general-copy | 작업 묶음 |
| src/pwa/code_explainer_rules.js | 1784 | low | general-copy | 하나 이상의 job을 모아 정의하는 영역입니다. 각 job은 어떤 환경에서 어떤 steps를 순서대로 실행할지 담습니다. |
| src/pwa/code_explainer_rules.js | 1787 | low | general-copy | 실행 환경 선택 |
| src/pwa/code_explainer_rules.js | 1787 | low | general-copy | ubuntu-latest 같은 어떤 가상 환경에서 job을 실행할지 정합니다. |
| src/pwa/code_explainer_rules.js | 1790 | high | devops-explainer | 작업 단계 목록 |
| src/pwa/code_explainer_rules.js | 1790 | high | devops-explainer | checkout, setup, test 같은 실제 실행 단계를 나열합니다. |
| src/pwa/code_explainer_rules.js | 1793 | low | general-copy | GitHub Action 사용 |
| src/pwa/code_explainer_rules.js | 1793 | low | general-copy | 이미 만들어진 GitHub Action을 가져와 실행합니다. |
| src/pwa/code_explainer_rules.js | 1796 | medium | unknown-action-ui | 쉘 명령 실행 |
| src/pwa/code_explainer_rules.js | 1796 | medium | unknown-action-ui | CI 환경에서 npm, python 같은 터미널 명령을 실행합니다. |
| src/pwa/code_explainer_rules.js | 1799 | medium | app-ui | 액션 옵션 설정 |
| src/pwa/code_explainer_rules.js | 1799 | medium | app-ui | 앞에서 사용한 action이나 job에 필요한 옵션을 지정합니다. |
| src/pwa/code_explainer_rules.js | 1802 | high | devops-explainer | GitHub Actions YAML 설정 |
| src/pwa/code_explainer_rules.js | 1802 | high | devops-explainer | GitHub Actions 자동화 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1811 | high | devops-explainer | 베이스 이미지 선택 |
| src/pwa/code_explainer_rules.js | 1811 | high | devops-explainer | 컨테이너를 어떤 기본 이미지에서 시작할지 정합니다. Python/Node 같은 실행 환경의 출발점입니다. |
| src/pwa/code_explainer_rules.js | 1814 | medium | unknown-action-ui | 작업 폴더 설정 |
| src/pwa/code_explainer_rules.js | 1814 | medium | unknown-action-ui | 이후 RUN, COPY, CMD 명령이 실행될 컨테이너 안의 기본 폴더를 정합니다. |
| src/pwa/code_explainer_rules.js | 1817 | medium | unknown-action-ui | 파일 복사 |
| src/pwa/code_explainer_rules.js | 1817 | medium | unknown-action-ui | 로컬 파일이나 폴더를 컨테이너 이미지 안으로 넣습니다. 불필요한 파일이 들어가지 않게 .dockerignore도 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1820 | medium | unknown-action-ui | 이미지 빌드 중 명령 실행 |
| src/pwa/code_explainer_rules.js | 1820 | medium | unknown-action-ui | 이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다. |
| src/pwa/code_explainer_rules.js | 1823 | high | devops-explainer | 환경변수 설정 |
| src/pwa/code_explainer_rules.js | 1823 | high | devops-explainer | 컨테이너 실행 중 사용할 환경변수를 이미지에 넣습니다. 비밀키를 직접 넣는 것은 피해야 합니다. |
| src/pwa/code_explainer_rules.js | 1826 | medium | app-ui | 빌드 인자 설정 |
| src/pwa/code_explainer_rules.js | 1826 | medium | app-ui | 이미지를 빌드할 때만 쓰는 값을 정의합니다. 런타임 환경변수와 용도를 구분해야 합니다. |
| src/pwa/code_explainer_rules.js | 1829 | high | devops-explainer | 포트 안내 |
| src/pwa/code_explainer_rules.js | 1829 | high | devops-explainer | 컨테이너가 주로 사용할 포트를 문서화합니다. 실제 공개 여부는 실행 옵션이나 배포 설정에서 결정됩니다. |
| src/pwa/code_explainer_rules.js | 1832 | medium | unknown-action-ui | 컨테이너 시작 명령 |
| src/pwa/code_explainer_rules.js | 1832 | medium | unknown-action-ui | 컨테이너가 실행될 때 기본으로 수행할 명령을 정합니다. |
| src/pwa/code_explainer_rules.js | 1835 | high | devops-explainer | Dockerfile 설정 |
| src/pwa/code_explainer_rules.js | 1835 | high | devops-explainer | 컨테이너 이미지를 만들기 위한 Dockerfile 설정 줄입니다. |
| src/pwa/code_explainer_rules.js | 1845 | medium | app-ui | 비밀 환경변수 설정 |
| src/pwa/code_explainer_rules.js | 1845 | medium | app-ui | API 키, 토큰, 비밀번호처럼 노출되면 안 되는 값을 설정합니다. Git에 커밋하지 않아야 합니다. |
| src/pwa/code_explainer_rules.js | 1847 | medium | app-ui | 환경변수 설정 |
| src/pwa/code_explainer_rules.js | 1847 | medium | app-ui | 프로그램이 실행될 때 읽을 설정값을 이름=값 형태로 정의합니다. |
| src/pwa/code_explainer_rules.js | 1850 | medium | app-ui | .env 설정 |
| src/pwa/code_explainer_rules.js | 1850 | medium | app-ui | .env 파일의 환경설정 줄입니다. |
| src/pwa/code_explainer_rules.js | 1858 | low | general-copy | 다른 requirements 파일 포함 |
| src/pwa/code_explainer_rules.js | 1858 | low | general-copy | 현재 파일에서 다른 의존성 목록 파일을 함께 읽도록 연결합니다. |
| src/pwa/code_explainer_rules.js | 1861 | high | python-explainer | 패키지 버전 고정 |
| src/pwa/code_explainer_rules.js | 1861 | high | python-explainer | Python 패키지를 특정 버전으로 고정해 재현성을 높입니다. |
| src/pwa/code_explainer_rules.js | 1864 | medium | app-ui | 패키지 버전 범위 지정 |
| src/pwa/code_explainer_rules.js | 1864 | medium | app-ui | 허용할 패키지 버전 범위를 정합니다. 너무 넓으면 나중에 동작이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 1867 | high | python-explainer | Python 패키지 의존성 |
| src/pwa/code_explainer_rules.js | 1867 | high | python-explainer | pip install -r requirements.txt로 설치할 Python 패키지를 적은 줄입니다. |
| src/pwa/code_explainer_rules.js | 1875 | medium | app-ui | 프로젝트 메타데이터 영역 |
| src/pwa/code_explainer_rules.js | 1875 | medium | app-ui | 프로젝트 이름, 버전, 의존성 같은 기본 정보를 적는 영역입니다. |
| src/pwa/code_explainer_rules.js | 1878 | medium | app-ui | 도구 설정 영역 |
| src/pwa/code_explainer_rules.js | 1878 | medium | app-ui | pytest, black, ruff 같은 개발 도구의 설정을 적는 영역입니다. |
| src/pwa/code_explainer_rules.js | 1881 | medium | app-ui | 프로젝트 이름 설정 |
| src/pwa/code_explainer_rules.js | 1881 | medium | app-ui | 패키지나 프로젝트의 이름을 설정합니다. |
| src/pwa/code_explainer_rules.js | 1884 | medium | app-ui | 프로젝트 버전 설정 |
| src/pwa/code_explainer_rules.js | 1884 | medium | app-ui | 현재 프로젝트의 버전을 설정합니다. |
| src/pwa/code_explainer_rules.js | 1887 | high | python-explainer | 의존성 목록 시작 |
| src/pwa/code_explainer_rules.js | 1887 | high | python-explainer | 프로젝트 실행에 필요한 Python 패키지 목록을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1890 | high | python-explainer | 의존성 항목 |
| src/pwa/code_explainer_rules.js | 1890 | high | python-explainer | 필요한 패키지와 버전 조건을 적은 항목입니다. |
| src/pwa/code_explainer_rules.js | 1893 | high | python-explainer | pyproject.toml 설정 |
| src/pwa/code_explainer_rules.js | 1893 | high | python-explainer | Python 프로젝트 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1901 | medium | app-ui | YAML 설정 키 |
| src/pwa/code_explainer_rules.js | 1901 | medium | app-ui | 들여쓰기 아래에 묶일 설정 이름을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1904 | low | general-copy | YAML 목록 항목 |
| src/pwa/code_explainer_rules.js | 1904 | low | general-copy | 여러 값 중 하나를 목록 형태로 추가합니다. |
| src/pwa/code_explainer_rules.js | 1907 | high | devops-explainer | 컨테이너 이미지 설정 |
| src/pwa/code_explainer_rules.js | 1907 | high | devops-explainer | 서비스가 사용할 컨테이너 이미지를 지정합니다. |
| src/pwa/code_explainer_rules.js | 1910 | low | general-copy | 서비스 실행 옵션 |
| src/pwa/code_explainer_rules.js | 1910 | low | general-copy | 포트, 볼륨, 환경변수처럼 서비스 실행에 필요한 옵션을 정의합니다. |
| src/pwa/code_explainer_rules.js | 1913 | medium | app-ui | YAML 설정 |
| src/pwa/code_explainer_rules.js | 1913 | medium | app-ui | 들여쓰기 구조로 값을 표현하는 YAML 설정 줄입니다. |
| src/pwa/code_explainer_rules.js | 1922 | low | general-copy | Markdown 제목 |
| src/pwa/code_explainer_rules.js | 1922 | low | general-copy | # 개수로 문서 제목이나 소제목 단계를 표시합니다. |
| src/pwa/code_explainer_rules.js | 1925 | medium | unknown-action-ui | 코드 블록 경계 |
| src/pwa/code_explainer_rules.js | 1925 | medium | unknown-action-ui | 문서 안에 명령어나 코드 예시를 넣는 구간의 시작 또는 끝입니다. |
| src/pwa/code_explainer_rules.js | 1928 | medium | unknown-action-ui | Markdown 체크리스트 |
| src/pwa/code_explainer_rules.js | 1928 | medium | unknown-action-ui | 할 일이나 확인 항목을 체크박스 형태로 표시합니다. |
| src/pwa/code_explainer_rules.js | 1931 | low | general-copy | Markdown 목록 |
| src/pwa/code_explainer_rules.js | 1931 | low | general-copy | 여러 항목을 읽기 쉬운 목록 형태로 정리합니다. |
| src/pwa/code_explainer_rules.js | 1934 | medium | unknown-action-ui | Markdown 이미지 |
| src/pwa/code_explainer_rules.js | 1934 | medium | unknown-action-ui | 문서에 이미지를 삽입하는 문법입니다. 대체 텍스트와 파일 경로를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1937 | low | general-copy | Markdown 링크 |
| src/pwa/code_explainer_rules.js | 1937 | low | general-copy | 다른 문서나 웹 주소로 이동하는 링크를 만듭니다. |
| src/pwa/code_explainer_rules.js | 1940 | low | general-copy | Markdown 인용문 |
| src/pwa/code_explainer_rules.js | 1940 | low | general-copy | 다른 문장이나 참고 내용을 인용 블록으로 강조합니다. |
| src/pwa/code_explainer_rules.js | 1943 | low | general-copy | Markdown 문단 |
| src/pwa/code_explainer_rules.js | 1943 | low | general-copy | README나 설명 문서의 일반 문장입니다. |
| src/pwa/code_explainer_rules.js | 1951 | low | general-copy | gitignore 예외 규칙 |
| src/pwa/code_explainer_rules.js | 1951 | low | general-copy | 앞에서 무시한 패턴 중 이 항목은 다시 Git 추적 대상에 포함하겠다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 1954 | low | general-copy | 민감 파일 무시 |
| src/pwa/code_explainer_rules.js | 1954 | low | general-copy | 환경변수나 비밀값 파일이 Git에 올라가지 않게 제외합니다. |
| src/pwa/code_explainer_rules.js | 1957 | low | general-copy | 폴더 무시 |
| src/pwa/code_explainer_rules.js | 1957 | low | general-copy | 해당 폴더와 그 안의 파일들을 Git 추적에서 제외합니다. |
| src/pwa/code_explainer_rules.js | 1960 | low | general-copy | 확장자 패턴 무시 |
| src/pwa/code_explainer_rules.js | 1960 | low | general-copy | 특정 확장자를 가진 파일들을 한 번에 Git 추적에서 제외합니다. |
| src/pwa/code_explainer_rules.js | 1963 | low | general-copy | gitignore 무시 규칙 |
| src/pwa/code_explainer_rules.js | 1963 | low | general-copy | 이 패턴과 맞는 파일이나 폴더를 Git 추적에서 제외합니다. |
| src/pwa/code_explainer_rules.js | 1971 | medium | app-ui | INI 섹션 |
| src/pwa/code_explainer_rules.js | 1971 | medium | app-ui | 관련 설정들을 묶는 구역 이름입니다. |
| src/pwa/code_explainer_rules.js | 1975 | medium | unknown-action-ui | 민감 설정값 |
| src/pwa/code_explainer_rules.js | 1975 | medium | unknown-action-ui | 토큰이나 비밀번호처럼 노출되면 안 되는 설정값입니다. 저장소에 올릴지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 1977 | medium | app-ui | INI 키-값 설정 |
| src/pwa/code_explainer_rules.js | 1977 | medium | app-ui | 왼쪽 이름에 오른쪽 설정값을 넣는 key=value 형식입니다. |
| src/pwa/code_explainer_rules.js | 1980 | medium | app-ui | INI 설정 |
| src/pwa/code_explainer_rules.js | 1980 | medium | app-ui | 섹션과 key=value 구조로 쓰는 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 1989 | medium | unknown-action-ui | Cloudflare D1 설정 |
| src/pwa/code_explainer_rules.js | 1989 | medium | unknown-action-ui | wrangler.toml에서 Cloudflare D1 데이터베이스 바인딩 묶음을 시작합니다. binding 이름과 database_name이 코드의 env.DB 사용과 맞는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1992 | medium | unknown-action-ui | Cloudflare R2 설정 |
| src/pwa/code_explainer_rules.js | 1992 | medium | unknown-action-ui | wrangler.toml에서 Cloudflare R2 버킷 바인딩 묶음을 시작합니다. binding 이름과 bucket_name이 코드의 env.R2 사용과 맞는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 1995 | medium | app-ui | Cloudflare binding 이름 설정 |
| src/pwa/code_explainer_rules.js | 1995 | medium | app-ui | Worker 코드에서 env.DB, env.ASSETS처럼 접근할 바인딩 이름을 설정합니다. 코드에서 쓰는 이름과 정확히 일치해야 합니다. |
| src/pwa/code_explainer_rules.js | 1998 | medium | unknown-action-ui | Cloudflare 리소스 이름 설정 |
| src/pwa/code_explainer_rules.js | 1998 | medium | unknown-action-ui | D1 데이터베이스나 R2 버킷의 실제 리소스 이름을 설정합니다. 운영/개발 환경을 혼동하지 않도록 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2002 | high | sql-explainer | TOML 테이블 배열 |
| src/pwa/code_explainer_rules.js | 2002 | high | sql-explainer | 같은 종류의 설정 묶음을 여러 개 반복해서 정의하는 영역입니다. |
| src/pwa/code_explainer_rules.js | 2005 | high | sql-explainer | TOML 테이블 |
| src/pwa/code_explainer_rules.js | 2005 | high | sql-explainer | 관련 설정값들을 묶는 TOML 구역입니다. |
| src/pwa/code_explainer_rules.js | 2008 | medium | app-ui | TOML 목록 설정 |
| src/pwa/code_explainer_rules.js | 2008 | medium | app-ui | 하나의 키에 여러 값을 배열 형태로 넣습니다. |
| src/pwa/code_explainer_rules.js | 2012 | medium | app-ui | 민감 TOML 설정값 |
| src/pwa/code_explainer_rules.js | 2012 | medium | app-ui | 토큰이나 비밀번호처럼 노출되면 안 되는 설정값입니다. |
| src/pwa/code_explainer_rules.js | 2014 | medium | app-ui | TOML 키-값 설정 |
| src/pwa/code_explainer_rules.js | 2014 | medium | app-ui | 왼쪽 키에 오른쪽 값을 넣는 TOML 설정입니다. |
| src/pwa/code_explainer_rules.js | 2017 | medium | app-ui | TOML 설정 |
| src/pwa/code_explainer_rules.js | 2017 | medium | app-ui | TOML 설정 파일의 한 줄입니다. |
| src/pwa/code_explainer_rules.js | 2027 | medium | unknown-action-ui | interface 정의 |
| src/pwa/code_explainer_rules.js | 2027 | medium | unknown-action-ui | Java interface는 구현 클래스가 따라야 할 메서드 약속을 정의합니다. 어떤 메서드를 반드시 구현해야 하는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 2030 | low | general-copy | enum 열거형 정의 |
| src/pwa/code_explainer_rules.js | 2030 | low | general-copy | Java enum은 FAST, SAFE처럼 정해진 선택지만 갖는 타입을 정의합니다. 상태나 모드를 제한할 때 씁니다. |
| src/pwa/code_explainer_rules.js | 2033 | medium | unknown-action-ui | try-with-resources 예외 처리 / 파일 reader 열기 |
| src/pwa/code_explainer_rules.js | 2033 | medium | unknown-action-ui | Java NIO Files.newBufferedReader로 파일 reader를 열고, try 블록이 끝나면 자동으로 닫는 Java 예외 처리 구조입니다. Path 값과 문자 인코딩, 예외 흐름을 함께 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2036 | medium | unknown-action-ui | try-with-resources 예외 처리 |
| src/pwa/code_explainer_rules.js | 2036 | medium | unknown-action-ui | 파일 reader 같은 자원을 열고 try 블록이 끝나면 자동으로 닫는 Java 예외 처리 구조입니다. 파일 처리와 예외 흐름을 함께 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2039 | medium | unknown-action-ui | 파일 reader 열기 |
| src/pwa/code_explainer_rules.js | 2039 | medium | unknown-action-ui | Java NIO Files.newBufferedReader로 파일을 읽기 위한 reader를 엽니다. Path 값과 문자 인코딩, 예외 처리를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2042 | low | general-copy | Optional null 처리 |
| src/pwa/code_explainer_rules.js | 2042 | low | general-copy | 값이 null일 수 있는 경우 Optional로 감싸고 기본값을 지정합니다. null 때문에 프로그램이 멈추는 일을 줄이는 방어 코드입니다. |
| src/pwa/code_explainer_rules.js | 2046 | low | general-copy | 패키지 선언 |
| src/pwa/code_explainer_rules.js | 2046 | low | general-copy | 이 Java 파일이 어떤 패키지/폴더 논리 그룹에 속하는지 선언합니다. |
| src/pwa/code_explainer_rules.js | 2049 | high | javascript-explainer | 라이브러리 불러오기 |
| src/pwa/code_explainer_rules.js | 2049 | high | javascript-explainer | Java 표준 라이브러리나 외부 클래스 기능을 현재 파일에서 사용할 수 있게 가져옵니다. |
| src/pwa/code_explainer_rules.js | 2052 | medium | app-ui | 어노테이션 설정 |
| src/pwa/code_explainer_rules.js | 2052 | medium | app-ui | 클래스나 메서드에 추가 의미를 붙입니다. Spring, JUnit, Lombok 같은 프레임워크에서 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 2055 | low | general-copy | 인터페이스 정의 |
| src/pwa/code_explainer_rules.js | 2055 | low | general-copy | 구현 클래스가 반드시 제공해야 하는 메서드 약속을 정의합니다. |
| src/pwa/code_explainer_rules.js | 2058 | low | general-copy | 클래스 정의 |
| src/pwa/code_explainer_rules.js | 2058 | low | general-copy | Java에서 관련 변수와 메서드를 묶는 설계도를 정의합니다. |
| src/pwa/code_explainer_rules.js | 2061 | medium | app-ui | 프로그램 시작점 |
| src/pwa/code_explainer_rules.js | 2061 | medium | app-ui | Java 프로그램이 실행될 때 가장 먼저 들어오는 main 메서드입니다. |
| src/pwa/code_explainer_rules.js | 2066 | medium | unknown-action-ui | 메서드 정의 |
| src/pwa/code_explainer_rules.js | 2066 | medium | unknown-action-ui | 나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2069 | medium | app-ui | 오류 대비 시작 |
| src/pwa/code_explainer_rules.js | 2069 | medium | app-ui | 아래 코드를 실행하다가 예외가 생기면 catch/finally 구간에서 처리할 수 있게 준비합니다. |
| src/pwa/code_explainer_rules.js | 2073 | medium | unknown-action-ui | 입출력 예외 처리 |
| src/pwa/code_explainer_rules.js | 2073 | medium | unknown-action-ui | 파일 읽기/쓰기나 네트워크 입출력 중 발생할 수 있는 IOException을 처리합니다. 실패 시 사용자에게 어떤 메시지를 보여줄지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2076 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 2076 | low | general-copy | try 안에서 발생한 예외를 잡아 로그를 남기거나 대체 처리를 합니다. |
| src/pwa/code_explainer_rules.js | 2079 | low | general-copy | 마지막 정리 |
| src/pwa/code_explainer_rules.js | 2079 | low | general-copy | 성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. |
| src/pwa/code_explainer_rules.js | 2082 | high | python-explainer | 예외 발생시키기 |
| src/pwa/code_explainer_rules.js | 2082 | high | python-explainer | 조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 예외를 발생시킵니다. |
| src/pwa/code_explainer_rules.js | 2085 | low | general-copy | 컬렉션/맵 만들기 |
| src/pwa/code_explainer_rules.js | 2085 | low | general-copy | 여러 값을 담는 List, Map, Set 같은 자료구조를 준비합니다. |
| src/pwa/code_explainer_rules.js | 2088 | low | general-copy | 컬렉션에 값 추가 |
| src/pwa/code_explainer_rules.js | 2088 | low | general-copy | List나 Set 같은 컬렉션에 새 값을 추가합니다. |
| src/pwa/code_explainer_rules.js | 2091 | high | javascript-explainer | 맵에 값 저장 |
| src/pwa/code_explainer_rules.js | 2091 | high | javascript-explainer | Map 구조에 key와 value를 저장합니다. 같은 key가 있으면 값이 바뀔 수 있습니다. |
| src/pwa/code_explainer_rules.js | 2094 | medium | app-ui | 스트림 처리 시작 |
| src/pwa/code_explainer_rules.js | 2094 | medium | app-ui | 컬렉션 데이터를 filter/map/collect 같은 연속 처리 흐름으로 다루기 시작합니다. |
| src/pwa/code_explainer_rules.js | 2097 | medium | unknown-action-ui | 스트림 필터링 |
| src/pwa/code_explainer_rules.js | 2097 | medium | unknown-action-ui | 조건에 맞는 항목만 남깁니다. 조건식이 실제 의도와 맞는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2100 | low | general-copy | 스트림 변환 |
| src/pwa/code_explainer_rules.js | 2100 | low | general-copy | 각 항목을 다른 형태의 값으로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 2103 | low | general-copy | 스트림 결과 모으기 |
| src/pwa/code_explainer_rules.js | 2103 | low | general-copy | 스트림 처리 결과를 List, Set, Map 같은 최종 자료구조로 모읍니다. |
| src/pwa/code_explainer_rules.js | 2106 | low | general-copy | 객체 생성 |
| src/pwa/code_explainer_rules.js | 2106 | low | general-copy | 클래스 설계도를 바탕으로 실제 사용할 객체를 만듭니다. |
| src/pwa/code_explainer_rules.js | 2109 | medium | unknown-action-ui | 파일/경로 처리 |
| src/pwa/code_explainer_rules.js | 2109 | medium | unknown-action-ui | Java NIO로 파일 경로를 만들거나 파일을 읽고 씁니다. 삭제/이동은 대상 경로를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2112 | medium | unknown-action-ui | HTTP 요청 처리 |
| src/pwa/code_explainer_rules.js | 2112 | medium | unknown-action-ui | Java 코드에서 웹 API 요청을 만들거나 응답을 받습니다. 상태 코드와 예외 처리를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 2115 | high | sql-explainer | DB 접근 |
| src/pwa/code_explainer_rules.js | 2115 | high | sql-explainer | Java에서 데이터베이스 연결, SQL 준비, 조회/수정 실행을 처리합니다. |
| src/pwa/code_explainer_rules.js | 2118 | low | general-copy | 화면에 출력 |
| src/pwa/code_explainer_rules.js | 2118 | low | general-copy | 괄호 안 값을 콘솔 화면에 보여줍니다. err는 오류 메시지 출력에 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 2121 | high | python-explainer | 조건 검사 |
| src/pwa/code_explainer_rules.js | 2121 | high | python-explainer | 조건이 맞으면 중괄호 안 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 2124 | high | python-explainer | 조건이 아닐 때 |
| src/pwa/code_explainer_rules.js | 2124 | high | python-explainer | 앞 조건이 맞지 않을 때 실행되는 부분입니다. |
| src/pwa/code_explainer_rules.js | 2127 | high | python-explainer | 반복 실행 |
| src/pwa/code_explainer_rules.js | 2127 | high | python-explainer | 정해진 조건이나 횟수에 따라 중괄호 안 코드를 반복합니다. |
| src/pwa/code_explainer_rules.js | 2130 | low | general-copy | 값 돌려주기 |
| src/pwa/code_explainer_rules.js | 2130 | low | general-copy | 메서드에서 만든 결과를 호출한 곳으로 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 2133 | high | javascript-explainer | 변수 선언과 값 저장 |
| src/pwa/code_explainer_rules.js | 2133 | high | javascript-explainer | 변수의 종류를 정하고 값을 넣습니다. |
| src/pwa/code_explainer_rules.js | 2138 | high | javascript-explainer | 누적 더하기 |
| src/pwa/code_explainer_rules.js | 2138 | high | javascript-explainer | 왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다. |
| src/pwa/code_explainer_rules.js | 2141 | low | general-copy | Java 코드 실행 |
| src/pwa/code_explainer_rules.js | 2141 | low | general-copy | 이 줄은 Java 코드입니다. 중괄호 구조에 따라 실행 흐름이 정해집니다. |
| src/pwa/code_explainer_rules.js | 2156 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2159 | medium | app-ui | // 설정 파일 계열은 설명문 안의 단어 때문에 Git/CI/API/DB 등으로 오염되기 쉬워서 |
| src/pwa/code_explainer_rules.js | 2160 | low | general-copy | // 파일 형식별 핵심 분류를 먼저 확정하고 여기서 반환한다. |
| src/pwa/code_explainer_rules.js | 2162 | high | devops-explainer | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2166 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2169 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2172 | low | general-copy | 환경변수 |
| src/pwa/code_explainer_rules.js | 2175 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2184 | medium | app-ui | 환경설정 |
| src/pwa/code_explainer_rules.js | 2185 | low | general-copy | 환경변수 |
| src/pwa/code_explainer_rules.js | 2187 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2196 | medium | app-ui | 패키지설정 |
| src/pwa/code_explainer_rules.js | 2198 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2200 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2209 | medium | app-ui | 프로젝트설정 |
| src/pwa/code_explainer_rules.js | 2212 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2215 | low | general-copy | 검증 |
| src/pwa/code_explainer_rules.js | 2224 | medium | app-ui | YAML설정 |
| src/pwa/code_explainer_rules.js | 2229 | low | general-copy | 서비스 |
| src/pwa/code_explainer_rules.js | 2232 | high | devops-explainer | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2235 | low | general-copy | 포트 |
| src/pwa/code_explainer_rules.js | 2238 | low | general-copy | 환경변수 |
| src/pwa/code_explainer_rules.js | 2241 | low | general-copy | 볼륨 |
| src/pwa/code_explainer_rules.js | 2244 | low | general-copy | 목록 |
| src/pwa/code_explainer_rules.js | 2247 | medium | app-ui | 설정 |
| src/pwa/code_explainer_rules.js | 2258 | low | general-copy | 문서 |
| src/pwa/code_explainer_rules.js | 2260 | low | general-copy | 제목 |
| src/pwa/code_explainer_rules.js | 2261 | low | general-copy | 코드블록 |
| src/pwa/code_explainer_rules.js | 2262 | low | general-copy | 목록 |
| src/pwa/code_explainer_rules.js | 2263 | low | general-copy | 링크 |
| src/pwa/code_explainer_rules.js | 2264 | high | python-explainer | 체크리스트 |
| src/pwa/code_explainer_rules.js | 2265 | low | general-copy | 문서 |
| src/pwa/code_explainer_rules.js | 2273 | low | general-copy | 무시규칙 |
| src/pwa/code_explainer_rules.js | 2275 | low | general-copy | 예외 |
| src/pwa/code_explainer_rules.js | 2276 | low | general-copy | 무시 |
| src/pwa/code_explainer_rules.js | 2277 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2278 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2286 | medium | app-ui | INI설정 |
| src/pwa/code_explainer_rules.js | 2288 | low | general-copy | 섹션 |
| src/pwa/code_explainer_rules.js | 2289 | medium | app-ui | 설정 |
| src/pwa/code_explainer_rules.js | 2290 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2298 | medium | app-ui | TOML설정 |
| src/pwa/code_explainer_rules.js | 2300 | low | general-copy | 섹션 |
| src/pwa/code_explainer_rules.js | 2301 | medium | app-ui | 설정 |
| src/pwa/code_explainer_rules.js | 2302 | low | general-copy | 목록 |
| src/pwa/code_explainer_rules.js | 2303 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2311 | medium | app-ui | 패키지설정 |
| src/pwa/code_explainer_rules.js | 2313 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2315 | low | general-copy | 검증 |
| src/pwa/code_explainer_rules.js | 2323 | medium | app-ui | if (/worker 진입 객체\|export\s+default\|프로그램 시작점\|public\s+static\s+void\s+main/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2324 | low | general-copy | 구조 |
| src/pwa/code_explainer_rules.js | 2325 | low | general-copy | 함수/구조 |
| src/pwa/code_explainer_rules.js | 2328 | high | javascript-explainer | if (/localstorage\|브라우저 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2329 | high | javascript-explainer | 저장소 |
| src/pwa/code_explainer_rules.js | 2330 | high | javascript-explainer | 저장소 |
| src/pwa/code_explainer_rules.js | 2333 | low | general-copy | if (/ctx\.waituntil\|백그라운드 작업\|백그라운드/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2334 | low | general-copy | 백그라운드 |
| src/pwa/code_explainer_rules.js | 2338 | medium | unknown-action-ui | if (/argparse\|명령행 인자/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2346 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2346 | low | general-copy | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2348 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2351 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2351 | low | general-copy | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2354 | high | python-explainer | if (/try\|except\|finally\|raise\|assert\|예외\|조건 검증/.test(codeTitle)) { |
| src/pwa/code_explainer_rules.js | 2355 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2356 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2358 | low | general-copy | if (/logging\|logger\|로그/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2359 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2359 | low | general-copy | 출력/응답 |
| src/pwa/code_explainer_rules.js | 2360 | low | general-copy | 로깅 |
| src/pwa/code_explainer_rules.js | 2362 | low | general-copy | if (/os\.environ\|os\.getenv\|getenv\|load_dotenv\|환경변수/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2363 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2363 | medium | app-ui | 환경설정 |
| src/pwa/code_explainer_rules.js | 2364 | low | general-copy | 환경변수 |
| src/pwa/code_explainer_rules.js | 2366 | low | general-copy | if (/__main__\|직접 실행 진입점/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2367 | low | general-copy | 구조 |
| src/pwa/code_explainer_rules.js | 2368 | low | general-copy | 함수/구조 |
| src/pwa/code_explainer_rules.js | 2372 | low | general-copy | if (/subprocess\|외부 프로그램/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2373 | low | general-copy | 프로세스 |
| src/pwa/code_explainer_rules.js | 2374 | low | general-copy | 프로세스 |
| src/pwa/code_explainer_rules.js | 2377 | low | general-copy | if (/fastapi\|라우트\|api 서버/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2378 | low | general-copy | 웹서버 |
| src/pwa/code_explainer_rules.js | 2390 | high | devops-explainer | /package_json\|package\.json\|npm 스크립트\|npm\|dependencies\|devdependencies\|패키지\|의존성/.test(text) |
| src/pwa/code_explainer_rules.js | 2392 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2392 | medium | app-ui | 패키지설정 |
| src/pwa/code_explainer_rules.js | 2394 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2400 | high | javascript-explainer | if (/패키지 선언\|라이브러리 불러오기\|^package\s+\|^import\s+/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2401 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2401 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2402 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2404 | medium | app-ui | if (/클래스 정의\|메서드 정의\|인터페이스 정의\|프로그램 시작점\|class\s+\|interface\s+\|main\s*\(/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2405 | low | general-copy | 구조 |
| src/pwa/code_explainer_rules.js | 2406 | low | general-copy | 함수/구조 |
| src/pwa/code_explainer_rules.js | 2408 | low | general-copy | if (/try\s*\{\|catch\s*\(\|finally\|throw\|오류 대비\|오류 처리\|예외/.test(codeTitle)) { |
| src/pwa/code_explainer_rules.js | 2409 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2410 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2412 | low | general-copy | if (/arraylist\|hashmap\|hashset\|list<\|map<\|set<\|queue<\|컬렉션\|맵/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2413 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2413 | low | general-copy | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2414 | low | general-copy | 컬렉션 |
| src/pwa/code_explainer_rules.js | 2416 | low | general-copy | if (/stream\s*\(\|\.filter\s*\(\|\.map\s*\(\|collectors\|스트림/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2417 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2417 | low | general-copy | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2418 | low | general-copy | 스트림 |
| src/pwa/code_explainer_rules.js | 2420 | low | general-copy | if (/files\.\|paths\.\|path\.of\|파일\/경로/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2421 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2421 | low | general-copy | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2422 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2424 | low | general-copy | if (/httpclient\|httprequest\|httpresponse\|http 요청/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2425 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2425 | low | general-copy | 네트워크/API |
| src/pwa/code_explainer_rules.js | 2428 | high | general-copy | if (/drivermanager\|preparedstatement\|resultset\|executequery\|executeupdate\|db 접근/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2437 | high | general-copy | if (/domcontentloaded\|document\.\|queryselector\|getelementbyid\|classlist\|dataset\|화면 요소\|css 클래스/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2438 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2438 | low | general-copy | 화면/UI |
| src/pwa/code_explainer_rules.js | 2442 | low | general-copy | if (/json\.parse\|json\.stringify\|응답 json\|json 문자열\|json/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2443 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2443 | low | general-copy | 데이터변환 |
| src/pwa/code_explainer_rules.js | 2446 | low | general-copy | if (/array\.from\|\.map\s*\(\|\.filter\s*\(\|\.reduce\s*\(\|배열/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2447 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2447 | low | general-copy | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2448 | low | general-copy | 배열 |
| src/pwa/code_explainer_rules.js | 2450 | low | general-copy | if (/await\|promise\|비동기/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2451 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2451 | low | general-copy | 비동기 |
| src/pwa/code_explainer_rules.js | 2452 | low | general-copy | 비동기 |
| src/pwa/code_explainer_rules.js | 2454 | high | javascript-explainer | if (/env\.kv\|kv 값\|kv 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2455 | high | javascript-explainer | 처리 |
| src/pwa/code_explainer_rules.js | 2455 | high | javascript-explainer | 저장소 |
| src/pwa/code_explainer_rules.js | 2459 | high | javascript-explainer | if (/env\.r2\|r2 객체\|r2 저장소/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2460 | high | javascript-explainer | 처리 |
| src/pwa/code_explainer_rules.js | 2460 | high | javascript-explainer | 저장소 |
| src/pwa/code_explainer_rules.js | 2464 | low | general-copy | if (/env\.[a-z0-9_]*queue\|queue 메시지\|queue/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2465 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2469 | low | general-copy | if (/caches\.default\|캐시/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2470 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2470 | low | general-copy | 캐시 |
| src/pwa/code_explainer_rules.js | 2471 | low | general-copy | 캐시 |
| src/pwa/code_explainer_rules.js | 2476 | medium | unknown-action-ui | if (/github_actions\|github actions\|워크플로\|runs-on\|uses:\s*actions\/\|ci\/cd\|트리거 이벤트\|실행 환경\|쉘 명령/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2477 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2482 | high | devops-explainer | if (/dockerfile\|docker\|컨테이너\|베이스 이미지\|이미지 빌드\|container/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2483 | high | devops-explainer | 처리 |
| src/pwa/code_explainer_rules.js | 2483 | high | devops-explainer | 컨테이너 |
| src/pwa/code_explainer_rules.js | 2487 | high | general-copy | if (/env_file\|\.env\|환경변수\|비밀 환경변수\|secret\|token\|password\|api[_-]?key/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2488 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2488 | medium | app-ui | 환경설정 |
| src/pwa/code_explainer_rules.js | 2489 | low | general-copy | 환경변수 |
| src/pwa/code_explainer_rules.js | 2492 | medium | app-ui | if (/requirements_txt\|requirements\.txt\|pip install\|패키지 버전\|python 패키지/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2493 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2493 | medium | app-ui | 패키지설정 |
| src/pwa/code_explainer_rules.js | 2495 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2498 | medium | app-ui | if (/pyproject_toml\|pyproject\.toml\|toml\|프로젝트 메타데이터\|도구 설정/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2499 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2499 | medium | app-ui | 프로젝트설정 |
| src/pwa/code_explainer_rules.js | 2503 | medium | app-ui | if (/yaml\|yaml 설정\|설정 키\|목록 항목\|services:\|image:\|ports:\|volumes:/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2504 | medium | app-ui | 처리 |
| src/pwa/code_explainer_rules.js | 2504 | medium | app-ui | YAML설정 |
| src/pwa/code_explainer_rules.js | 2510 | high | powershell-explainer | if (/pipeline\|파이프라인\|where-object\|foreach-object\|select-object\|sort-object\|group-object\|measure-object/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2511 | high | powershell-explainer | 처리 |
| src/pwa/code_explainer_rules.js | 2511 | high | powershell-explainer | 파이프라인 |
| src/pwa/code_explainer_rules.js | 2512 | high | powershell-explainer | 파이프라인 |
| src/pwa/code_explainer_rules.js | 2515 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2515 | low | general-copy | 데이터변환 |
| src/pwa/code_explainer_rules.js | 2519 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2519 | low | general-copy | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2521 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2523 | low | general-copy | if (/start-process\|get-process\|stop-process\|process\|프로세스/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2524 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2524 | low | general-copy | 프로세스 |
| src/pwa/code_explainer_rules.js | 2525 | low | general-copy | 프로세스 |
| src/pwa/code_explainer_rules.js | 2527 | low | general-copy | if (/param\s*\(\|입력 파라미터/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2534 | medium | app-ui | 버전관리 |
| src/pwa/code_explainer_rules.js | 2537 | medium | unknown-action-ui | if (/node --check\|validate\|pytest\|test\|검증\|확인\|status\|diff/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2538 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2538 | low | general-copy | 검증 |
| src/pwa/code_explainer_rules.js | 2539 | low | general-copy | 검증 |
| src/pwa/code_explainer_rules.js | 2541 | high | general-copy | if (/set-location\|cd\b\|path\|경로\|폴더\|file\|copy-item\|move-item\|remove-item\|new-item\|compress-archive\|expand-archive\|open\(\|read_text\|write_text\|fs\.\|파일/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2542 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2542 | low | general-copy | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2543 | low | general-copy | 파일 |
| src/pwa/code_explainer_rules.js | 2546 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2546 | low | general-copy | 네트워크/API |
| src/pwa/code_explainer_rules.js | 2557 | low | general-copy | 배포 |
| src/pwa/code_explainer_rules.js | 2558 | low | general-copy | 배포 |
| src/pwa/code_explainer_rules.js | 2561 | high | python-explainer | if (/if\s*\(\|^if\s\|elif\|else\|switch\|case\|조건/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2562 | high | python-explainer | 조건 |
| src/pwa/code_explainer_rules.js | 2563 | high | python-explainer | 조건문 |
| src/pwa/code_explainer_rules.js | 2565 | low | general-copy | if (/foreach\|for\s*\(\|for\s+.+\s+in\|while\|\.foreach\|반복/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2566 | low | general-copy | 반복 |
| src/pwa/code_explainer_rules.js | 2567 | low | general-copy | 반복문 |
| src/pwa/code_explainer_rules.js | 2569 | low | general-copy | if (/function\|def\s+\|class\s+\|=>\|함수\|클래스\|method/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2570 | low | general-copy | 구조 |
| src/pwa/code_explainer_rules.js | 2571 | low | general-copy | 함수/구조 |
| src/pwa/code_explainer_rules.js | 2573 | high | general-copy | if (/try\|catch\|except\|finally\|throw\|raise\|오류 대비\|오류 처리\|exception/.test(codeTitle)) { |
| src/pwa/code_explainer_rules.js | 2574 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2575 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2577 | high | general-copy | if (/print\|write-host\|console\.log\|alert\|return\|response\.json\|new response\|출력\|응답/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2578 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2578 | low | general-copy | 출력/응답 |
| src/pwa/code_explainer_rules.js | 2579 | low | general-copy | 출력 |
| src/pwa/code_explainer_rules.js | 2581 | high | general-copy | if (/token\|secret\|password\|auth\|authorization\|api[_-]?key\|\$env:\|process\.env\|환경변수\|보안/.test(text)) { |
| src/pwa/code_explainer_rules.js | 2582 | low | general-copy | 보안 |
| src/pwa/code_explainer_rules.js | 2584 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2585 | low | general-copy | 변수/값 |
| src/pwa/code_explainer_rules.js | 2586 | low | general-copy | 변수 |
| src/pwa/code_explainer_rules.js | 2589 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2590 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2590 | low | general-copy | 의존성 |
| src/pwa/code_explainer_rules.js | 2598 | low | general-copy | 코드 |
| src/pwa/code_explainer_rules.js | 2611 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2625 | low | general-copy | 주요 흐름: |
| src/pwa/code_explainer_rules.js | 2629 | low | general-copy | 분석할 코드가 없습니다. |
| src/pwa/code_explainer_rules.js | 2632 | medium | unknown-action-ui | PowerShell 스크립트 |
| src/pwa/code_explainer_rules.js | 2633 | high | python-explainer | Python 코드 |
| src/pwa/code_explainer_rules.js | 2634 | high | javascript-explainer | JavaScript 코드 |
| src/pwa/code_explainer_rules.js | 2635 | low | general-copy | Cloudflare Workers 코드 |
| src/pwa/code_explainer_rules.js | 2636 | low | general-copy | Java 코드 |
| src/pwa/code_explainer_rules.js | 2637 | medium | app-ui | package.json 설정 |
| src/pwa/code_explainer_rules.js | 2640 | low | general-copy | .env 환경변수 파일 |
| src/pwa/code_explainer_rules.js | 2643 | medium | app-ui | YAML 설정 |
| src/pwa/code_explainer_rules.js | 2646 | medium | app-ui | INI 설정 |
| src/pwa/code_explainer_rules.js | 2647 | medium | app-ui | TOML 설정 |
| src/pwa/code_explainer_rules.js | 2649 | medium | unknown-action-ui | 코드 |
| src/pwa/code_explainer_rules.js | 2649 | medium | unknown-action-ui | 단계로 나눠 해석했습니다. |
| src/pwa/code_explainer_rules.js | 2649 | medium | unknown-action-ui | 주의가 필요한 단계가 |
| src/pwa/code_explainer_rules.js | 2649 | medium | unknown-action-ui | 개 있습니다. |
| src/pwa/code_explainer_rules.js | 2649 | medium | unknown-action-ui | 특별히 높은 위험 명령은 감지되지 않았습니다. |
| src/pwa/code_explainer_rules.js | 2667 | high | python-explainer | 조건 |
| src/pwa/code_explainer_rules.js | 2668 | low | general-copy | 반복 |
| src/pwa/code_explainer_rules.js | 2669 | low | general-copy | 오류처리 |
| src/pwa/code_explainer_rules.js | 2670 | high | javascript-explainer | 파일/경로 |
| src/pwa/code_explainer_rules.js | 2670 | high | javascript-explainer | 저장소 |
| src/pwa/code_explainer_rules.js | 2670 | high | javascript-explainer | 데이터변환 |
| src/pwa/code_explainer_rules.js | 2670 | high | javascript-explainer | 데이터처리 |
| src/pwa/code_explainer_rules.js | 2671 | low | general-copy | 출력/응답 |
| src/pwa/code_explainer_rules.js | 2671 | low | general-copy | 네트워크/API |
| src/pwa/code_explainer_rules.js | 2671 | low | general-copy | 배포 |
| src/pwa/code_explainer_rules.js | 2677 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2677 | low | general-copy | 다음 |
| src/pwa/code_explainer_rules.js | 2683 | high | python-explainer | 조건 |
| src/pwa/code_explainer_rules.js | 2684 | low | general-copy | 반복 |
| src/pwa/code_explainer_rules.js | 2685 | low | general-copy | 출력/응답 |
| src/pwa/code_explainer_rules.js | 2685 | low | general-copy | 네트워크/API |
| src/pwa/code_explainer_rules.js | 2685 | low | general-copy | 배포 |
| src/pwa/code_explainer_rules.js | 2690 | medium | app-ui | flowchart TD START_NODE([시작]) START_NODE --> EMPTY[분석할 코드 없음] EMPTY --> END_NODE([끝]) |
| src/pwa/code_explainer_rules.js | 2703 | medium | app-ui | START_NODE([시작]) |
| src/pwa/code_explainer_rules.js | 2704 | low | general-copy | END_NODE([끝]) |
| src/pwa/code_explainer_rules.js | 2712 | low | general-copy | 위험 · |
| src/pwa/code_explainer_rules.js | 2712 | low | general-copy | 주의 · |
| src/pwa/code_explainer_rules.js | 2713 | low | general-copy | 처리 |
| src/pwa/code_explainer_rules.js | 2723 | low | general-copy | 나머지 |
| src/pwa/code_explainer_rules.js | 2723 | low | general-copy | 단계 생략 |
| src/pwa/code_explainer_rules.js | 2724 | low | general-copy | N40 -->\|생략\| MORE |
| src/pwa/code_explainer_rules.js | 2743 | low | general-copy | subgraph DATA_FLOW[데이터 흐름] |
| src/pwa/code_explainer_rules.js | 2750 | low | general-copy | 생성: |
| src/pwa/code_explainer_rules.js | 2751 | low | general-copy | 사용: |
| src/pwa/code_explainer_rules.js | 2774 | low | general-copy | 입력 · |
| src/pwa/code_explainer_rules.js | 2786 | low | general-copy | -->\|사용: |
| src/pwa/code_explainer_rules.js | 2790 | low | general-copy | -.흐름.-> |
| src/pwa/code_explainer_rules.js | 2795 | low | general-copy | START_NODE -.데이터.-> DF1 |
| src/pwa/code_explainer_rules.js | 2799 | low | general-copy | subgraph CALL_FLOW[호출 흐름] |
| src/pwa/code_explainer_rules.js | 2808 | low | general-copy | START_NODE -.호출.-> CF1 |
| src/pwa/code_explainer_rules.js | 2876 | medium | unknown-action-ui | // PowerShell 변수는 $out처럼 일반 변수명이 out일 수 있다. |
| src/pwa/code_explainer_rules.js | 2877 | low | general-copy | // Java System.out 잡음을 막기 위한 공통 noise 목록을 그대로 적용하지 않는다. |
| src/pwa/code_explainer_rules.js | 2941 | low | general-copy | 사용: |
| src/pwa/code_explainer_rules.js | 2946 | high | javascript-explainer | 생성/저장 |
| src/pwa/code_explainer_rules.js | 2949 | high | javascript-explainer | 결과를 저장합니다. |
| src/pwa/code_explainer_rules.js | 2959 | low | general-copy | 가공 |
| src/pwa/code_explainer_rules.js | 2959 | low | general-copy | 값을 추가하거나 갱신합니다. |
| src/pwa/code_explainer_rules.js | 2964 | low | general-copy | 반환 |
| src/pwa/code_explainer_rules.js | 2964 | low | general-copy | 함수 밖으로 결과를 돌려줍니다. |
| src/pwa/code_explainer_rules.js | 2969 | low | general-copy | 출력/응답 |
| src/pwa/code_explainer_rules.js | 2969 | low | general-copy | 처리 결과를 화면이나 응답으로 내보냅니다. |
| src/pwa/code_explainer_rules.js | 2974 | high | javascript-explainer | 파일 저장 |
| src/pwa/code_explainer_rules.js | 2974 | high | javascript-explainer | 처리 결과를 파일에 저장합니다. |
| src/pwa/code_explainer_rules.js | 3032 | low | general-copy | 정의 |
| src/pwa/code_explainer_rules.js | 3032 | low | general-copy | 사용자 함수 정의입니다. |
| src/pwa/code_explainer_rules.js | 3040 | low | general-copy | 정의 |
| src/pwa/code_explainer_rules.js | 3040 | low | general-copy | 사용자 함수/핸들러 정의입니다. |
| src/pwa/code_explainer_rules.js | 3048 | low | general-copy | 정의 |
| src/pwa/code_explainer_rules.js | 3048 | low | general-copy | Java 메서드 정의입니다. |
| src/pwa/code_explainer_rules.js | 3056 | medium | unknown-action-ui | 정의 |
| src/pwa/code_explainer_rules.js | 3056 | medium | unknown-action-ui | PowerShell 함수 정의입니다. |
| src/pwa/code_explainer_rules.js | 3092 | low | general-copy | 호출 |
| src/pwa/code_explainer_rules.js | 3092 | low | general-copy | 사용자 정의 함수/메서드를 호출합니다. |
| src/pwa/code_explainer_rules.js | 3094 | medium | unknown-action-ui | 호출 |
| src/pwa/code_explainer_rules.js | 3094 | medium | unknown-action-ui | PowerShell 명령 |
| src/pwa/code_explainer_rules.js | 3094 | medium | unknown-action-ui | PowerShell 내장 명령이나 cmdlet을 호출합니다. |
| src/pwa/code_explainer_rules.js | 3096 | low | general-copy | 호출 |
| src/pwa/code_explainer_rules.js | 3096 | low | general-copy | 내장/라이브러리 |
| src/pwa/code_explainer_rules.js | 3096 | low | general-copy | 내장 함수나 라이브러리 기능을 호출합니다. |
| src/pwa/code_explainer_rules.js | 3201 | low | general-copy | URL 쿼리 파라미터 읽기 |
| src/pwa/code_explainer_rules.js | 3202 | low | general-copy | 비동기 병렬 처리 |
| src/pwa/code_explainer_rules.js | 3203 | high | javascript-explainer | DOM 요소 생성 |
| src/pwa/code_explainer_rules.js | 3204 | high | javascript-explainer | DOM 텍스트 설정 |
| src/pwa/code_explainer_rules.js | 3205 | high | javascript-explainer | DOM 요소 삽입 |
| src/pwa/code_explainer_rules.js | 3206 | low | general-copy | 엄격 모드 선언 |
| src/pwa/code_explainer_rules.js | 3207 | high | javascript-explainer | Node.js 모듈 불러오기 |
| src/pwa/code_explainer_rules.js | 3208 | low | general-copy | Node.js 파일 처리 |
| src/pwa/code_explainer_rules.js | 3209 | low | general-copy | Node.js 경로 처리 |
| src/pwa/code_explainer_rules.js | 3210 | medium | unknown-action-ui | 외부 명령 실행 |
| src/pwa/code_explainer_rules.js | 3211 | low | general-copy | 격리 실행 컨텍스트 사용 |
| src/pwa/code_explainer_rules.js | 3212 | medium | app-ui | 객체 속성 설정 |
| src/pwa/code_explainer_rules.js | 3213 | low | general-copy | 객체/배열 초기화 |
| src/pwa/code_explainer_rules.js | 3214 | low | general-copy | 객체 값 갱신 |
| src/pwa/code_explainer_rules.js | 3215 | low | general-copy | 문자열/배열 메서드 처리 |
| src/pwa/code_explainer_rules.js | 3216 | low | general-copy | 문자열 데이터 항목 |
| src/pwa/code_explainer_rules.js | 3217 | low | general-copy | 예제 코드 문자열 |
| src/pwa/code_explainer_rules.js | 3218 | low | general-copy | 블록/객체 닫기 |
| src/pwa/code_explainer_rules.js | 3267 | high | javascript-explainer | 객체 생성 결과 저장 |
| src/pwa/code_explainer_rules.js | 3268 | high | javascript-explainer | 클래스로 새 객체를 만들고, 그 결과를 |
| src/pwa/code_explainer_rules.js | 3268 | high | javascript-explainer | 변수에 저장합니다. 이때 클래스의 __init__ 메서드가 객체의 초기값을 설정할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3278 | high | javascript-explainer | 미등록 함수 결과 저장 |
| src/pwa/code_explainer_rules.js | 3279 | medium | unknown-action-ui | 함수 호출 결과를 변수에 저장합니다. 이 코드 조각 안에서는 함수 정의가 보이지 않으므로 외부 정의나 오타 여부를 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 3308 | low | general-copy | 반복문 |
| src/pwa/code_explainer_rules.js | 3309 | high | python-explainer | 리스트 컴프리헨션 안의 for 부분은 원본 목록에서 값을 하나씩 꺼내 결과 리스트를 만드는 반복 흐름입니다. |
| src/pwa/code_explainer_rules.js | 3317 | high | python-explainer | 조건 검사 |
| src/pwa/code_explainer_rules.js | 3318 | high | python-explainer | 리스트 컴프리헨션 안의 if 부분은 조건에 맞는 항목만 결과 리스트에 포함하게 거르는 역할을 합니다. |
| src/pwa/code_explainer_rules.js | 3343 | low | general-copy | 이벤트 처리 함수 정의 |
| src/pwa/code_explainer_rules.js | 3350 | low | general-copy | 이벤트 처리 함수 정의 |
| src/pwa/code_explainer_rules.js | 3351 | high | javascript-explainer | 사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수를 화면 요소에 연결합니다. async 콜백이면 내부에서 await로 비동기 작업을 기다릴 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3376 | high | javascript-explainer | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 3383 | high | javascript-explainer | 변수에 값 저장 |
| src/pwa/code_explainer_rules.js | 3384 | high | javascript-explainer | 브라우저 저장소에서 꺼낸 값을 const, let, var 같은 변수 이름에 담습니다. 이후 코드에서 이 이름으로 저장된 값을 다시 사용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3409 | low | general-copy | 값 돌려주기 |
| src/pwa/code_explainer_rules.js | 3416 | low | general-copy | 값 돌려주기 |
| src/pwa/code_explainer_rules.js | 3417 | low | general-copy | 찾은 파일 목록을 함수 밖으로 돌려줍니다. 호출한 쪽에서는 이 반환값을 받아서 후속 처리나 반복에 사용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 3441 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 3448 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 3449 | medium | app-ui | try 안에서 문제가 생겼을 때 catch 블록으로 넘어와 프로그램이 바로 멈추지 않도록 처리합니다. 예외 객체에는 실패 원인 정보가 들어 있습니다. |
| src/pwa/code_explainer_rules.js | 3524 | medium | unknown-action-ui | 확인 필요 |
| src/pwa/code_explainer_rules.js | 3805 | low | general-copy | 코드 실행 |
| src/pwa/code_explainer_rules.js | 3805 | low | general-copy | 이 줄을 순서대로 실행합니다. |
| src/pwa/code_explainer_rules.js | 3862 | medium | unknown-action-ui | 모르는 항목이면 먼저 설치 여부, 도움말, 프로젝트 내 사용 위치를 확인한 뒤 실행하세요. |
| src/pwa/code_explainer_rules.js | 3893 | medium | unknown-action-ui | Python 외부 모듈 확인 |
| src/pwa/code_explainer_rules.js | 3894 | medium | unknown-action-ui | 모듈이 설치되어 있는지, 어디서 쓰이는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 3914 | medium | unknown-action-ui | Python 미확인 메서드 추적 |
| src/pwa/code_explainer_rules.js | 3915 | medium | unknown-action-ui | 호출이 어떤 라이브러리 기능인지 프로젝트 안에서 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 3941 | medium | unknown-action-ui | JavaScript 패키지 확인 |
| src/pwa/code_explainer_rules.js | 3942 | medium | unknown-action-ui | 패키지가 package.json(프로젝트 설치 목록 파일)에 있는지, 실제로 설치되어 있는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 3961 | medium | unknown-action-ui | JavaScript 미확인 함수 추적 |
| src/pwa/code_explainer_rules.js | 3962 | medium | unknown-action-ui | 함수가 직접 만든 함수인지 외부 패키지 함수인지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 3984 | medium | unknown-action-ui | PowerShell/CLI(터미널 명령) 확인 |
| src/pwa/code_explainer_rules.js | 3985 | medium | unknown-action-ui | 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4014 | medium | unknown-action-ui | JSON 설정 키 확인 |
| src/pwa/code_explainer_rules.js | 4015 | medium | unknown-action-ui | 설정 키가 어느 도구에서 쓰이는 옵션인지 프로젝트 안에서 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4029 | medium | unknown-action-ui | 미지원 항목 확인 |
| src/pwa/code_explainer_rules.js | 4030 | medium | unknown-action-ui | 자동 규칙에 없는 항목이 있으므로 원문 문자열을 프로젝트 안에서 검색해 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4032 | medium | unknown-action-ui | 확인할_문자열 |
| src/pwa/code_explainer_rules.js | 4099 | low | general-copy | users 목록에서 active가 True인 사람만 골라 이름을 active_names에 모은 뒤 출력합니다. 이 예시에서는 [ |
| src/pwa/code_explainer_rules.js | 4099 | low | general-copy | ]가 출력됩니다. |
| src/pwa/code_explainer_rules.js | 4102 | high | javascript-explainer | users에 사용자 목록 저장 |
| src/pwa/code_explainer_rules.js | 4103 | low | general-copy | A와 B 두 사람 정보가 들어 있습니다. 각 사람은 name 값과 active 값을 가집니다. |
| src/pwa/code_explainer_rules.js | 4106 | high | python-explainer | active_names를 빈 리스트로 준비 |
| src/pwa/code_explainer_rules.js | 4107 | high | python-explainer | 조건에 맞는 이름을 나중에 담을 빈 상자를 만듭니다. |
| src/pwa/code_explainer_rules.js | 4110 | medium | unknown-action-ui | users를 한 명씩 확인 |
| src/pwa/code_explainer_rules.js | 4111 | low | general-copy | user 변수에 A 정보, 그다음 B 정보가 차례로 들어갑니다. |
| src/pwa/code_explainer_rules.js | 4114 | medium | unknown-action-ui | active 값 확인 |
| src/pwa/code_explainer_rules.js | 4115 | low | general-copy | ]가 True인 사람만 아래 코드를 실행합니다. |
| src/pwa/code_explainer_rules.js | 4118 | high | python-explainer | 조건에 맞는 이름 추가 |
| src/pwa/code_explainer_rules.js | 4119 | high | python-explainer | 조건에 맞으면 user[ |
| src/pwa/code_explainer_rules.js | 4119 | high | python-explainer | ]을 active_names에 추가합니다. 여기서는 A만 추가됩니다. |
| src/pwa/code_explainer_rules.js | 4122 | low | general-copy | 최종 결과 출력 |
| src/pwa/code_explainer_rules.js | 4123 | low | general-copy | active_names에 모인 최종 결과인 [ |
| src/pwa/code_explainer_rules.js | 4123 | low | general-copy | ]를 화면에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4133 | high | javascript-explainer | memo.txt 파일을 읽어 text에 저장하고 마지막에 출력합니다. 파일이 없으면 오류로 멈추지 않고 text를 빈 문자열로 바꾼 뒤 출력합니다. |
| src/pwa/code_explainer_rules.js | 4136 | low | general-copy | Path 기능 가져오기 |
| src/pwa/code_explainer_rules.js | 4137 | low | general-copy | 파일 경로를 다루기 쉽게 해주는 pathlib의 Path를 가져옵니다. |
| src/pwa/code_explainer_rules.js | 4140 | low | general-copy | 파일 읽기 오류에 대비 |
| src/pwa/code_explainer_rules.js | 4141 | low | general-copy | 파일 읽기 오류가 날 수 있으므로 try 안에서 먼저 실행합니다. |
| src/pwa/code_explainer_rules.js | 4144 | low | general-copy | memo.txt 읽기 |
| src/pwa/code_explainer_rules.js | 4145 | high | javascript-explainer | memo.txt 파일을 UTF-8 방식으로 읽고, 그 내용을 text 변수에 저장합니다. |
| src/pwa/code_explainer_rules.js | 4148 | low | general-copy | 파일이 없을 때 처리 |
| src/pwa/code_explainer_rules.js | 4149 | low | general-copy | memo.txt가 없으면 FileNotFoundError 오류가 발생하고, except 부분에서 처리합니다. |
| src/pwa/code_explainer_rules.js | 4152 | low | general-copy | 빈 문자열로 대체 |
| src/pwa/code_explainer_rules.js | 4153 | low | general-copy | 파일이 없을 때 text를 빈 문자열( |
| src/pwa/code_explainer_rules.js | 4153 | low | general-copy | )로 바꿉니다. 그래서 프로그램이 멈추지 않고 다음 줄로 넘어갑니다. |
| src/pwa/code_explainer_rules.js | 4156 | low | general-copy | 최종 text 출력 |
| src/pwa/code_explainer_rules.js | 4157 | low | general-copy | 파일을 읽었으면 파일 내용을 출력하고, 파일이 없었으면 빈 문자열을 출력합니다. |
| src/pwa/code_explainer_rules.js | 4163 | low | general-copy | memo.txt 파일을 읽어서 화면에 보여줍니다. 파일이 없으면 오류로 멈추는 대신 |
| src/pwa/code_explainer_rules.js | 4163 | low | general-copy | 라고 출력합니다. |
| src/pwa/code_explainer_rules.js | 4166 | low | general-copy | Path 기능 가져오기 |
| src/pwa/code_explainer_rules.js | 4167 | low | general-copy | 파일 경로를 다루기 쉽게 해주는 pathlib의 Path를 가져옵니다. |
| src/pwa/code_explainer_rules.js | 4170 | low | general-copy | 파일 읽기 오류에 대비 |
| src/pwa/code_explainer_rules.js | 4171 | low | general-copy | 파일 읽기 오류가 날 수 있으므로 try 안에서 먼저 실행합니다. |
| src/pwa/code_explainer_rules.js | 4174 | low | general-copy | memo.txt 읽기 |
| src/pwa/code_explainer_rules.js | 4175 | high | javascript-explainer | memo.txt 파일을 UTF-8 방식으로 읽고, 그 내용을 text 변수에 저장합니다. |
| src/pwa/code_explainer_rules.js | 4178 | low | general-copy | 파일 내용 출력 |
| src/pwa/code_explainer_rules.js | 4179 | high | javascript-explainer | 오류 없이 파일 읽기에 성공하면 text에 저장된 내용을 화면에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4182 | low | general-copy | 파일이 없을 때 처리 |
| src/pwa/code_explainer_rules.js | 4183 | low | general-copy | memo.txt가 없으면 FileNotFoundError 오류가 발생하고, except 부분으로 넘어갑니다. |
| src/pwa/code_explainer_rules.js | 4186 | low | general-copy | 안내 문구 출력 |
| src/pwa/code_explainer_rules.js | 4187 | low | general-copy | 파일이 없을 때 프로그램이 멈추지 않고 |
| src/pwa/code_explainer_rules.js | 4187 | low | general-copy | 라고 알려줍니다. |
| src/pwa/code_explainer_rules.js | 4196 | medium | unknown-action-ui | strange_sdk라는 외부 라이브러리에서 Client를 가져와 client를 만들고, data.csv를 magic_upload로 처리한 뒤 결과를 출력합니다. 이 라이브러리와 함수가 무엇인지 확인 전에는 실행을 조심해야 합니다. |
| src/pwa/code_explainer_rules.js | 4199 | low | general-copy | strange_sdk에서 Client 가져오기 |
| src/pwa/code_explainer_rules.js | 4200 | low | general-copy | 현재 코드 안에 정의된 기능이 아니라 외부 라이브러리 기능을 가져옵니다. |
| src/pwa/code_explainer_rules.js | 4203 | low | general-copy | client 만들기 |
| src/pwa/code_explainer_rules.js | 4204 | low | general-copy | Client에 api_key를 넣어 사용할 준비를 합니다. api_key는 보통 서비스 인증에 쓰이므로 노출에 주의해야 합니다. |
| src/pwa/code_explainer_rules.js | 4207 | low | general-copy | data.csv 업로드/처리 실행 |
| src/pwa/code_explainer_rules.js | 4208 | medium | unknown-action-ui | magic_upload 함수에 data.csv를 넘깁니다. 이름상 업로드 기능일 수 있으므로 어디로 보내는지 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4211 | low | general-copy | 실행 결과 출력 |
| src/pwa/code_explainer_rules.js | 4212 | low | general-copy | magic_upload 실행 결과를 화면에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4221 | high | general-copy | /api/users 주소로 사용자 데이터를 요청하고, 받은 JSON 데이터를 콘솔에 출력합니다. 요청 중 오류가 나면 catch에서 오류를 출력합니다. |
| src/pwa/code_explainer_rules.js | 4224 | low | general-copy | loadUsers 함수 만들기 |
| src/pwa/code_explainer_rules.js | 4225 | high | javascript-explainer | 사용자 정보를 불러오는 코드를 함수로 묶습니다. 아직 실행된 것은 아니고, 나중에 호출하면 실행됩니다. |
| src/pwa/code_explainer_rules.js | 4228 | low | general-copy | 오류에 대비 |
| src/pwa/code_explainer_rules.js | 4229 | low | general-copy | 서버 요청은 실패할 수 있으므로 try 안에서 실행합니다. |
| src/pwa/code_explainer_rules.js | 4232 | low | general-copy | 서버에 사용자 목록 요청 |
| src/pwa/code_explainer_rules.js | 4233 | low | general-copy | )로 서버에 데이터를 요청합니다. await는 응답이 올 때까지 기다리라는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 4236 | low | general-copy | 응답을 데이터로 바꾸기 |
| src/pwa/code_explainer_rules.js | 4237 | high | javascript-explainer | res.json()은 서버 응답을 JavaScript에서 다룰 수 있는 데이터로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 4240 | low | general-copy | 받은 데이터 출력 |
| src/pwa/code_explainer_rules.js | 4241 | low | general-copy | 서버에서 받아온 사용자 데이터를 개발자 콘솔에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4244 | low | general-copy | 오류 처리 |
| src/pwa/code_explainer_rules.js | 4245 | low | general-copy | 요청 실패나 데이터 변환 오류가 나면 catch 부분으로 넘어갑니다. |
| src/pwa/code_explainer_rules.js | 4248 | low | general-copy | 오류 내용 출력 |
| src/pwa/code_explainer_rules.js | 4249 | low | general-copy | 어떤 오류가 났는지 개발자 콘솔에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4258 | medium | unknown-action-ui | unknown-kit 패키지에서 runMagic을 가져와 input.json을 처리하고 결과를 출력합니다. unknown-kit이 설치된 패키지인지 먼저 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4261 | low | general-copy | unknown-kit에서 runMagic 가져오기 |
| src/pwa/code_explainer_rules.js | 4262 | low | general-copy | 현재 코드 안에 있는 함수가 아니라 외부 패키지에서 가져오는 함수입니다. |
| src/pwa/code_explainer_rules.js | 4265 | low | general-copy | input.json 처리 실행 |
| src/pwa/code_explainer_rules.js | 4266 | medium | unknown-action-ui | runMagic에 input.json 파일 경로를 넘겨 결과를 받습니다. 함수 정의가 보이지 않으므로 실제 기능을 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4269 | low | general-copy | 결과 출력 |
| src/pwa/code_explainer_rules.js | 4270 | low | general-copy | runMagic 실행 결과를 개발자 콘솔에 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4279 | medium | unknown-action-ui | 첫 줄은 Invoke-MysteryTool이라는 알 수 없는 도구를 실행합니다. 둘째 줄은 out 폴더의 항목에서 이름과 크기만 골라 보여줍니다. 첫 줄은 실행 전에 반드시 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4282 | medium | unknown-action-ui | 알 수 없는 명령 실행 준비 |
| src/pwa/code_explainer_rules.js | 4283 | medium | unknown-action-ui | Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다. |
| src/pwa/code_explainer_rules.js | 4286 | medium | unknown-action-ui | out 폴더 결과 확인 |
| src/pwa/code_explainer_rules.js | 4287 | low | general-copy | .\\out 폴더 안의 항목을 가져온 뒤, Name과 Length만 골라 표처럼 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4296 | high | javascript-explainer | 이 HTML은 이메일을 입력받는 간단한 폼을 만듭니다. 사용자는 입력 칸에 이메일을 넣고 Send 버튼을 누를 수 있습니다. |
| src/pwa/code_explainer_rules.js | 4299 | medium | app-ui | 폼 시작 |
| src/pwa/code_explainer_rules.js | 4300 | low | general-copy | form은 사용자가 입력한 값을 제출할 수 있는 영역을 만듭니다. |
| src/pwa/code_explainer_rules.js | 4303 | low | general-copy | email 입력칸 설명 붙이기 |
| src/pwa/code_explainer_rules.js | 4304 | low | general-copy | label은 입력칸이 무엇을 받는지 알려줍니다. 여기서는 Email이라는 이름표를 붙입니다. |
| src/pwa/code_explainer_rules.js | 4307 | low | general-copy | 이메일 입력칸 만들기 |
| src/pwa/code_explainer_rules.js | 4308 | low | general-copy | input은 사용자가 값을 넣는 칸입니다. type= |
| src/pwa/code_explainer_rules.js | 4308 | low | general-copy | 이라서 이메일 형식 입력에 맞춰져 있습니다. |
| src/pwa/code_explainer_rules.js | 4311 | high | javascript-explainer | 제출 버튼 만들기 |
| src/pwa/code_explainer_rules.js | 4312 | high | javascript-explainer | 은 폼 내용을 제출하는 버튼입니다. 화면에는 Send라고 보입니다. |
| src/pwa/code_explainer_rules.js | 4315 | low | general-copy | 폼 끝내기 |
| src/pwa/code_explainer_rules.js | 4316 | low | general-copy | 마지막 </form>은 입력 영역이 여기서 끝난다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 4325 | high | sql-explainer | orders 테이블에서 사용자별 주문 수를 세고, 주문 수가 많은 사용자부터 보여주는 SQL입니다. |
| src/pwa/code_explainer_rules.js | 4328 | high | sql-explainer | 사용자와 주문 수 선택 |
| src/pwa/code_explainer_rules.js | 4329 | high | sql-explainer | user_id별로 결과를 보여주고, COUNT(*)로 주문 개수를 셉니다. order_count는 그 개수에 붙인 이름입니다. |
| src/pwa/code_explainer_rules.js | 4332 | high | sql-explainer | orders 테이블에서 가져오기 |
| src/pwa/code_explainer_rules.js | 4333 | high | sql-explainer | 주문 데이터가 들어 있는 orders 테이블을 대상으로 조회합니다. |
| src/pwa/code_explainer_rules.js | 4336 | low | general-copy | 사용자별로 묶기 |
| src/pwa/code_explainer_rules.js | 4337 | high | sql-explainer | GROUP BY user_id는 같은 사용자의 주문을 한 그룹으로 묶습니다. 그래야 사용자별 주문 수를 셀 수 있습니다. |
| src/pwa/code_explainer_rules.js | 4340 | high | sql-explainer | 주문 수 많은 순서로 정렬 |
| src/pwa/code_explainer_rules.js | 4341 | high | sql-explainer | ORDER BY order_count DESC는 주문 수가 큰 결과부터 보여주라는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 4398 | medium | app-ui | return /코드를 \d+단계로 나눠 해석했습니다\|스크립트를 \d+단계로 나눠 해석했습니다/.test(String(summary \|\| "")) |
| src/pwa/code_explainer_rules.js | 4441 | low | general-copy | 이상인지 |
| src/pwa/code_explainer_rules.js | 4442 | low | general-copy | 이하인지 |
| src/pwa/code_explainer_rules.js | 4443 | low | general-copy | 보다 큰지 |
| src/pwa/code_explainer_rules.js | 4444 | low | general-copy | 보다 작은지 |
| src/pwa/code_explainer_rules.js | 4445 | low | general-copy | 와 같은지 |
| src/pwa/code_explainer_rules.js | 4446 | low | general-copy | 와 다른지 |
| src/pwa/code_explainer_rules.js | 4447 | high | python-explainer | 조건을 만족하는지 |
| src/pwa/code_explainer_rules.js | 4479 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A2(action && action.title)) |
| src/pwa/code_explainer_rules.js | 4528 | high | python-explainer | 조건에 맞는 값 |
| src/pwa/code_explainer_rules.js | 4531 | medium | unknown-action-ui | 목록에서 |
| src/pwa/code_explainer_rules.js | 4531 | medium | unknown-action-ui | 확인하고, 조건을 만족하는 항목의 |
| src/pwa/code_explainer_rules.js | 4531 | medium | unknown-action-ui | 값을 |
| src/pwa/code_explainer_rules.js | 4531 | medium | unknown-action-ui | 에 모아 출력합니다. 출력 결과는 |
| src/pwa/code_explainer_rules.js | 4531 | medium | unknown-action-ui | 입니다. |
| src/pwa/code_explainer_rules.js | 4535 | high | javascript-explainer | 에 데이터 목록 저장 |
| src/pwa/code_explainer_rules.js | 4536 | low | general-copy | 에는 여러 항목이 들어 있습니다. 각 항목은 |
| src/pwa/code_explainer_rules.js | 4536 | low | general-copy | 같은 값을 가진 데이터 묶음입니다. |
| src/pwa/code_explainer_rules.js | 4539 | high | python-explainer | 를 빈 리스트로 준비 |
| src/pwa/code_explainer_rules.js | 4540 | high | python-explainer | 조건을 통과한 |
| src/pwa/code_explainer_rules.js | 4540 | high | python-explainer | 값을 나중에 담기 위해 빈 리스트를 만듭니다. |
| src/pwa/code_explainer_rules.js | 4543 | medium | unknown-action-ui | 를 하나씩 확인 |
| src/pwa/code_explainer_rules.js | 4544 | low | general-copy | 변수에 목록의 항목이 하나씩 들어오고, 아래 들여쓰기 블록이 반복 실행됩니다. |
| src/pwa/code_explainer_rules.js | 4547 | high | python-explainer | 조건 검사 |
| src/pwa/code_explainer_rules.js | 4548 | medium | unknown-action-ui | ] 값으로 |
| src/pwa/code_explainer_rules.js | 4548 | medium | unknown-action-ui | 확인합니다. |
| src/pwa/code_explainer_rules.js | 4551 | high | python-explainer | 조건을 통과한 |
| src/pwa/code_explainer_rules.js | 4551 | high | python-explainer | 추가 |
| src/pwa/code_explainer_rules.js | 4552 | high | python-explainer | 조건이 맞으면 |
| src/pwa/code_explainer_rules.js | 4552 | high | python-explainer | ] 값을 |
| src/pwa/code_explainer_rules.js | 4552 | high | python-explainer | 에 추가합니다. 이 예시에서는 다음 값이 들어갑니다: |
| src/pwa/code_explainer_rules.js | 4555 | low | general-copy | 최종 결과 출력 |
| src/pwa/code_explainer_rules.js | 4556 | low | general-copy | 에 모인 값을 화면에 보여줍니다. 출력 결과는 |
| src/pwa/code_explainer_rules.js | 4556 | low | general-copy | 입니다. |
| src/pwa/code_explainer_rules.js | 4561 | high | python-explainer | 를 반복하면서 조건에 맞는 |
| src/pwa/code_explainer_rules.js | 4561 | high | python-explainer | 에 모으는 필터링 코드입니다. |
| src/pwa/code_explainer_rules.js | 4626 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A3(action && action.title)) |
| src/pwa/code_explainer_rules.js | 4662 | high | javascript-explainer | 요소를 버튼처럼 찾아서 클릭 이벤트를 연결합니다. 사용자가 클릭하면 |
| src/pwa/code_explainer_rules.js | 4662 | high | javascript-explainer | 요소의 화면 문구가 |
| src/pwa/code_explainer_rules.js | 4662 | high | javascript-explainer | 로 바뀝니다. |
| src/pwa/code_explainer_rules.js | 4666 | low | general-copy | 요소 찾기 |
| src/pwa/code_explainer_rules.js | 4667 | low | general-copy | )로 화면에서 |
| src/pwa/code_explainer_rules.js | 4667 | low | general-copy | 에 해당하는 요소를 찾습니다. |
| src/pwa/code_explainer_rules.js | 4670 | low | general-copy | 요소 찾기 |
| src/pwa/code_explainer_rules.js | 4671 | low | general-copy | )로 나중에 문구를 바꿀 화면 요소를 찾습니다. |
| src/pwa/code_explainer_rules.js | 4674 | high | javascript-explainer | 클릭 이벤트 연결 |
| src/pwa/code_explainer_rules.js | 4675 | high | javascript-explainer | 요소에 click 이벤트를 연결합니다. 사용자가 이 요소를 클릭하면 안쪽 코드가 실행됩니다. |
| src/pwa/code_explainer_rules.js | 4678 | low | general-copy | 화면 문구 변경 |
| src/pwa/code_explainer_rules.js | 4679 | low | general-copy | 요소의 textContent를 |
| src/pwa/code_explainer_rules.js | 4679 | low | general-copy | 로 바꿉니다. 즉 화면에 보이는 글자가 바뀝니다. |
| src/pwa/code_explainer_rules.js | 4684 | high | javascript-explainer | 클릭을 기다렸다가 |
| src/pwa/code_explainer_rules.js | 4684 | high | javascript-explainer | 의 문구를 바꾸는 DOM 이벤트 코드입니다. |
| src/pwa/code_explainer_rules.js | 4707 | low | general-copy | 기본값 |
| src/pwa/code_explainer_rules.js | 4709 | high | javascript-explainer | 브라우저 저장소(localStorage)에서 |
| src/pwa/code_explainer_rules.js | 4709 | high | javascript-explainer | 설정을 읽습니다. 값이 있으면 document.body.dataset. |
| src/pwa/code_explainer_rules.js | 4709 | high | javascript-explainer | 에 적용하고, 값이 없으면 기본값 |
| src/pwa/code_explainer_rules.js | 4709 | high | javascript-explainer | 를 적용합니다. |
| src/pwa/code_explainer_rules.js | 4713 | high | javascript-explainer | 저장된 |
| src/pwa/code_explainer_rules.js | 4713 | high | javascript-explainer | 설정 읽기 |
| src/pwa/code_explainer_rules.js | 4714 | high | javascript-explainer | )로 브라우저에 저장된 |
| src/pwa/code_explainer_rules.js | 4714 | high | javascript-explainer | 값을 읽어 |
| src/pwa/code_explainer_rules.js | 4714 | high | javascript-explainer | 에 넣습니다. |
| src/pwa/code_explainer_rules.js | 4717 | medium | unknown-action-ui | 저장값이 있는지 확인 |
| src/pwa/code_explainer_rules.js | 4718 | medium | unknown-action-ui | ) 조건으로 저장된 값이 비어 있지 않은지 확인합니다. |
| src/pwa/code_explainer_rules.js | 4721 | high | javascript-explainer | 저장된 값 적용 |
| src/pwa/code_explainer_rules.js | 4722 | low | general-copy | 값이 있으면 document.body.dataset. |
| src/pwa/code_explainer_rules.js | 4722 | low | general-copy | 값을 넣습니다. 화면의 테마나 스타일을 이 값으로 바꿀 때 쓰는 방식입니다. |
| src/pwa/code_explainer_rules.js | 4725 | low | general-copy | 기본값 적용 |
| src/pwa/code_explainer_rules.js | 4726 | high | javascript-explainer | 저장된 값이 없으면 else에서 기본값 |
| src/pwa/code_explainer_rules.js | 4726 | high | javascript-explainer | 를 document.body.dataset. |
| src/pwa/code_explainer_rules.js | 4726 | high | javascript-explainer | 에 넣습니다. |
| src/pwa/code_explainer_rules.js | 4731 | high | javascript-explainer | 브라우저 저장소에서 설정을 읽고, 있으면 저장값을 쓰고 없으면 기본값을 쓰는 설정 복원 코드입니다. |
| src/pwa/code_explainer_rules.js | 4782 | low | general-copy | 보다 큰 항목 |
| src/pwa/code_explainer_rules.js | 4783 | low | general-copy | 이상인 항목 |
| src/pwa/code_explainer_rules.js | 4784 | low | general-copy | 보다 작은 항목 |
| src/pwa/code_explainer_rules.js | 4785 | low | general-copy | 이하인 항목 |
| src/pwa/code_explainer_rules.js | 4786 | low | general-copy | 와 같은 항목 |
| src/pwa/code_explainer_rules.js | 4787 | low | general-copy | 와 다른 항목 |
| src/pwa/code_explainer_rules.js | 4788 | high | python-explainer | 조건을 만족하는 항목 |
| src/pwa/code_explainer_rules.js | 4815 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A4(action && action.title)) |
| src/pwa/code_explainer_rules.js | 4835 | low | general-copy | 대상 |
| src/pwa/code_explainer_rules.js | 4840 | low | general-copy | 폴더에서 |
| src/pwa/code_explainer_rules.js | 4840 | low | general-copy | 파일을 찾고, 그 안에서 |
| src/pwa/code_explainer_rules.js | 4840 | low | general-copy | 문자가 들어간 줄만 찾습니다. 마지막에는 |
| src/pwa/code_explainer_rules.js | 4840 | low | general-copy | 열만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4844 | low | general-copy | 에서 파일 찾기 |
| src/pwa/code_explainer_rules.js | 4845 | high | powershell-explainer | Get-ChildItem이 |
| src/pwa/code_explainer_rules.js | 4845 | high | powershell-explainer | 위치의 파일을 찾습니다. -Filter |
| src/pwa/code_explainer_rules.js | 4845 | high | powershell-explainer | 조건이 있으면 |
| src/pwa/code_explainer_rules.js | 4845 | high | powershell-explainer | 에 맞는 파일만 대상으로 삼습니다. |
| src/pwa/code_explainer_rules.js | 4848 | low | general-copy | 가 들어간 줄 찾기 |
| src/pwa/code_explainer_rules.js | 4849 | low | general-copy | 은 앞 단계에서 넘어온 파일 내용 중 |
| src/pwa/code_explainer_rules.js | 4849 | low | general-copy | 문자가 들어간 줄만 찾습니다. |
| src/pwa/code_explainer_rules.js | 4852 | low | general-copy | 보여줄 열 선택 |
| src/pwa/code_explainer_rules.js | 4853 | high | powershell-explainer | 는 결과에서 |
| src/pwa/code_explainer_rules.js | 4853 | high | powershell-explainer | 정보만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4856 | high | powershell-explainer | 파이프라인으로 순서대로 전달 |
| src/pwa/code_explainer_rules.js | 4857 | medium | unknown-action-ui | \| 기호는 왼쪽 명령의 결과를 오른쪽 명령으로 넘깁니다. 그래서 파일 찾기 → 문자열 검색 → 필요한 열만 보기 순서로 처리됩니다. |
| src/pwa/code_explainer_rules.js | 4862 | medium | unknown-action-ui | 파일 목록을 찾고, 특정 문자열이 있는 줄만 골라낸 뒤, 필요한 열만 보여주는 PowerShell 파이프라인입니다. |
| src/pwa/code_explainer_rules.js | 4890 | low | general-copy | 폴더에서 파일을 찾고, |
| src/pwa/code_explainer_rules.js | 4890 | low | general-copy | 만 남긴 뒤, |
| src/pwa/code_explainer_rules.js | 4890 | low | general-copy | 열만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4894 | low | general-copy | 에서 파일 찾기 |
| src/pwa/code_explainer_rules.js | 4895 | high | powershell-explainer | Get-ChildItem이 |
| src/pwa/code_explainer_rules.js | 4895 | high | powershell-explainer | 위치의 항목을 찾습니다. -Recurse가 있으면 하위 폴더까지 포함하고, -File이 있으면 파일만 대상으로 봅니다. |
| src/pwa/code_explainer_rules.js | 4898 | low | general-copy | 만 남기기 |
| src/pwa/code_explainer_rules.js | 4899 | high | powershell-explainer | Where-Object는 앞 단계 결과 중 조건에 맞는 항목만 통과시킵니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 4899 | high | powershell-explainer | 조건을 봅니다. |
| src/pwa/code_explainer_rules.js | 4902 | low | general-copy | 보여줄 열 선택 |
| src/pwa/code_explainer_rules.js | 4903 | high | powershell-explainer | 는 결과에서 |
| src/pwa/code_explainer_rules.js | 4903 | high | powershell-explainer | 정보만 골라 보여줍니다. |
| src/pwa/code_explainer_rules.js | 4906 | high | powershell-explainer | 파이프라인으로 순서대로 전달 |
| src/pwa/code_explainer_rules.js | 4907 | high | python-explainer | \| 기호 때문에 파일 찾기 → 조건 필터링 → 필요한 열만 보기 순서로 처리됩니다. |
| src/pwa/code_explainer_rules.js | 4912 | medium | unknown-action-ui | 파일 목록에서 조건에 맞는 항목만 남기고 필요한 열만 보여주는 PowerShell 파이프라인입니다. |
| src/pwa/code_explainer_rules.js | 4956 | medium | unknown-action-ui | )은/g, |
| src/pwa/code_explainer_rules.js | 4957 | medium | unknown-action-ui | $1 명령은 결과에서 |
| src/pwa/code_explainer_rules.js | 5019 | high | sql-explainer | 값을 모두 더해서 |
| src/pwa/code_explainer_rules.js | 5019 | high | sql-explainer | 로 계산 |
| src/pwa/code_explainer_rules.js | 5020 | high | sql-explainer | 행 개수를 세어서 |
| src/pwa/code_explainer_rules.js | 5020 | high | sql-explainer | 로 계산 |
| src/pwa/code_explainer_rules.js | 5021 | high | sql-explainer | 평균을 |
| src/pwa/code_explainer_rules.js | 5021 | high | sql-explainer | 로 계산 |
| src/pwa/code_explainer_rules.js | 5022 | high | sql-explainer | 최솟값을 |
| src/pwa/code_explainer_rules.js | 5022 | high | sql-explainer | 로 계산 |
| src/pwa/code_explainer_rules.js | 5023 | high | sql-explainer | 최댓값을 |
| src/pwa/code_explainer_rules.js | 5023 | high | sql-explainer | 로 계산 |
| src/pwa/code_explainer_rules.js | 5024 | high | sql-explainer | 값을 |
| src/pwa/code_explainer_rules.js | 5024 | high | sql-explainer | 로 집계 |
| src/pwa/code_explainer_rules.js | 5033 | high | sql-explainer | 기준으로 큰 값부터 정렬 |
| src/pwa/code_explainer_rules.js | 5034 | high | sql-explainer | 기준으로 작은 값부터 정렬 |
| src/pwa/code_explainer_rules.js | 5035 | high | sql-explainer | 기준으로 정렬 |
| src/pwa/code_explainer_rules.js | 5108 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A5(action && action.title)) |
| src/pwa/code_explainer_rules.js | 5123 | high | sql-explainer | 상위 |
| src/pwa/code_explainer_rules.js | 5123 | high | sql-explainer | 개만 보여줍니다. |
| src/pwa/code_explainer_rules.js | 5126 | high | sql-explainer | 테이블에서 |
| src/pwa/code_explainer_rules.js | 5126 | high | sql-explainer | 조건에 맞는 행만 먼저 고릅니다. |
| src/pwa/code_explainer_rules.js | 5127 | high | sql-explainer | 테이블의 행을 대상으로 봅니다. |
| src/pwa/code_explainer_rules.js | 5130 | high | sql-explainer | 그 결과를 |
| src/pwa/code_explainer_rules.js | 5130 | high | sql-explainer | 합니다. |
| src/pwa/code_explainer_rules.js | 5133 | high | sql-explainer | 별로 묶은 뒤, |
| src/pwa/code_explainer_rules.js | 5133 | high | sql-explainer | 합니다. |
| src/pwa/code_explainer_rules.js | 5138 | high | sql-explainer | 테이블에서 데이터 읽기 |
| src/pwa/code_explainer_rules.js | 5139 | high | sql-explainer | 테이블을 대상으로 쿼리를 실행한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5144 | high | sql-explainer | 조건에 맞는 행만 고르기 |
| src/pwa/code_explainer_rules.js | 5145 | high | sql-explainer | 조건으로 필요한 행만 먼저 남깁니다. |
| src/pwa/code_explainer_rules.js | 5150 | high | sql-explainer | 별로 묶기 |
| src/pwa/code_explainer_rules.js | 5151 | high | sql-explainer | 는 같은 |
| src/pwa/code_explainer_rules.js | 5151 | high | sql-explainer | 값을 가진 행들을 한 묶음으로 모읍니다. |
| src/pwa/code_explainer_rules.js | 5155 | high | sql-explainer | 집계 계산 |
| src/pwa/code_explainer_rules.js | 5156 | high | sql-explainer | 는 각 묶음마다 |
| src/pwa/code_explainer_rules.js | 5156 | high | sql-explainer | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5161 | high | sql-explainer | 결과 정렬 |
| src/pwa/code_explainer_rules.js | 5162 | high | sql-explainer | 는 집계 결과를 |
| src/pwa/code_explainer_rules.js | 5162 | high | sql-explainer | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5168 | high | sql-explainer | 보여줄 개수 제한 |
| src/pwa/code_explainer_rules.js | 5169 | high | sql-explainer | 은 정렬된 결과 중 앞에서 |
| src/pwa/code_explainer_rules.js | 5169 | high | sql-explainer | 개만 보여준다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5176 | high | sql-explainer | 테이블 행을 조건으로 고르고, 그룹별로 묶어서 집계한 뒤, 필요한 순서와 개수로 보여주는 SQL 집계 쿼리입니다. |
| src/pwa/code_explainer_rules.js | 5209 | high | sql-explainer | 주문 수(행 개수) |
| src/pwa/code_explainer_rules.js | 5213 | high | sql-explainer | 고객(customer_id)별 |
| src/pwa/code_explainer_rules.js | 5214 | high | sql-explainer | 같은 고객(customer_id) 값을 |
| src/pwa/code_explainer_rules.js | 5218 | high | sql-explainer | FROM $1 절은 |
| src/pwa/code_explainer_rules.js | 5219 | high | sql-explainer | GROUP BY $1 절은 |
| src/pwa/code_explainer_rules.js | 5220 | high | sql-explainer | ORDER BY $1 절은 |
| src/pwa/code_explainer_rules.js | 5221 | high | sql-explainer | LIMIT $1 절은 |
| src/pwa/code_explainer_rules.js | 5283 | high | sql-explainer | orders 테이블에서 사용자별 주문 수를 계산합니다. user_id별로 주문을 묶고, 주문 수(행 개수)를 order_count로 센 뒤, 주문 수가 많은 순서로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 5287 | high | sql-explainer | orders 테이블에서 데이터 읽기 |
| src/pwa/code_explainer_rules.js | 5288 | high | sql-explainer | FROM orders 절은 orders 테이블의 주문 데이터를 대상으로 쿼리를 실행한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5291 | high | sql-explainer | 사용자별(user_id)로 묶기 |
| src/pwa/code_explainer_rules.js | 5292 | high | sql-explainer | GROUP BY user_id 절은 같은 사용자(user_id)의 주문 행들을 한 묶음으로 모읍니다. 그래서 사용자별 주문 수를 계산할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 5295 | high | sql-explainer | 주문 수 계산 |
| src/pwa/code_explainer_rules.js | 5296 | high | sql-explainer | COUNT(*) AS order_count는 각 사용자 묶음마다 주문 수(행 개수)를 세어서 order_count라는 이름으로 보여준다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5299 | high | sql-explainer | 주문 수가 많은 순서로 정렬 |
| src/pwa/code_explainer_rules.js | 5300 | high | sql-explainer | ORDER BY order_count DESC 절은 order_count가 큰 사용자부터 보여줍니다. 즉 주문 수가 많은 순서로 정렬합니다. |
| src/pwa/code_explainer_rules.js | 5305 | high | sql-explainer | orders 테이블에서 사용자별 주문 수를 세고, 주문 수가 많은 사용자부터 보여주는 SQL 집계 쿼리입니다. |
| src/pwa/code_explainer_rules.js | 5393 | high | css-explainer | 가로 방향으로 가운데 정렬 |
| src/pwa/code_explainer_rules.js | 5394 | high | css-explainer | 첫 항목과 마지막 항목을 양끝으로 벌려 배치 |
| src/pwa/code_explainer_rules.js | 5395 | high | css-explainer | 항목 주변에 비슷한 여백을 두고 배치 |
| src/pwa/code_explainer_rules.js | 5396 | high | css-explainer | 항목 사이 여백을 균등하게 배치 |
| src/pwa/code_explainer_rules.js | 5397 | high | css-explainer | 앞쪽부터 붙여 배치 |
| src/pwa/code_explainer_rules.js | 5398 | high | css-explainer | 끝쪽으로 붙여 배치 |
| src/pwa/code_explainer_rules.js | 5399 | high | css-explainer | 기준으로 가로 배치 |
| src/pwa/code_explainer_rules.js | 5404 | high | css-explainer | 세로 방향으로 가운데 정렬 |
| src/pwa/code_explainer_rules.js | 5405 | high | css-explainer | 세로 방향 앞쪽에 맞춤 |
| src/pwa/code_explainer_rules.js | 5406 | high | css-explainer | 세로 방향 끝쪽에 맞춤 |
| src/pwa/code_explainer_rules.js | 5407 | high | css-explainer | 세로 방향으로 늘려 맞춤 |
| src/pwa/code_explainer_rules.js | 5408 | high | css-explainer | 기준으로 세로 정렬 |
| src/pwa/code_explainer_rules.js | 5414 | high | css-explainer | 칸 grid |
| src/pwa/code_explainer_rules.js | 5415 | high | css-explainer | 1칸 grid |
| src/pwa/code_explainer_rules.js | 5416 | high | css-explainer | 구조 |
| src/pwa/code_explainer_rules.js | 5422 | high | css-explainer | 화면 폭이 |
| src/pwa/code_explainer_rules.js | 5422 | high | css-explainer | 이하일 때 |
| src/pwa/code_explainer_rules.js | 5424 | high | css-explainer | 화면 폭이 |
| src/pwa/code_explainer_rules.js | 5424 | high | css-explainer | 이상일 때 |
| src/pwa/code_explainer_rules.js | 5425 | high | css-explainer | ) 조건일 때 |
| src/pwa/code_explainer_rules.js | 5452 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A6(action && action.title)) |
| src/pwa/code_explainer_rules.js | 5468 | high | css-explainer | 요소 안의 내용을 flex로 배치합니다. |
| src/pwa/code_explainer_rules.js | 5470 | high | css-explainer | 합니다. |
| src/pwa/code_explainer_rules.js | 5471 | high | css-explainer | 합니다. |
| src/pwa/code_explainer_rules.js | 5472 | high | css-explainer | 항목 사이 간격은 |
| src/pwa/code_explainer_rules.js | 5472 | high | css-explainer | 로 둡니다. |
| src/pwa/code_explainer_rules.js | 5478 | high | css-explainer | 에 flex 배치 적용 |
| src/pwa/code_explainer_rules.js | 5479 | high | css-explainer | display: flex 설정은 |
| src/pwa/code_explainer_rules.js | 5479 | high | css-explainer | 안의 자식 요소들을 한 줄 레이아웃으로 배치할 때 쓰는 설정입니다. |
| src/pwa/code_explainer_rules.js | 5485 | high | css-explainer | 세로 정렬 설정 |
| src/pwa/code_explainer_rules.js | 5486 | high | css-explainer | 설정은 |
| src/pwa/code_explainer_rules.js | 5486 | high | css-explainer | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5492 | high | css-explainer | 가로 배치 방식 설정 |
| src/pwa/code_explainer_rules.js | 5493 | high | css-explainer | 설정은 |
| src/pwa/code_explainer_rules.js | 5493 | high | css-explainer | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5499 | high | css-explainer | 항목 사이 간격 설정 |
| src/pwa/code_explainer_rules.js | 5500 | high | css-explainer | 설정은 flex 안의 항목들 사이에 |
| src/pwa/code_explainer_rules.js | 5500 | high | css-explainer | 간격을 둔다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5507 | high | css-explainer | 요소 안의 항목들을 flex 레이아웃으로 배치하고, 정렬과 간격을 조정하는 CSS입니다. |
| src/pwa/code_explainer_rules.js | 5529 | high | css-explainer | 요소를 |
| src/pwa/code_explainer_rules.js | 5529 | high | css-explainer | 로 배치합니다. |
| src/pwa/code_explainer_rules.js | 5530 | high | css-explainer | 항목 사이 간격은 |
| src/pwa/code_explainer_rules.js | 5530 | high | css-explainer | 로 둡니다. |
| src/pwa/code_explainer_rules.js | 5533 | high | css-explainer | 로 바꿉니다. |
| src/pwa/code_explainer_rules.js | 5540 | high | css-explainer | 에 grid 배치 적용 |
| src/pwa/code_explainer_rules.js | 5541 | high | css-explainer | display: grid 설정은 |
| src/pwa/code_explainer_rules.js | 5541 | high | css-explainer | 안의 항목들을 행과 열이 있는 격자 형태로 배치한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5547 | high | css-explainer | 기본 열 구조 설정 |
| src/pwa/code_explainer_rules.js | 5548 | high | css-explainer | 설정은 기본 화면에서 |
| src/pwa/code_explainer_rules.js | 5548 | high | css-explainer | 로 배치한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5554 | high | css-explainer | grid 항목 간격 설정 |
| src/pwa/code_explainer_rules.js | 5555 | high | css-explainer | 설정은 grid 항목들 사이에 |
| src/pwa/code_explainer_rules.js | 5555 | high | css-explainer | 간격을 둔다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5561 | high | css-explainer | 반응형 조건 설정 |
| src/pwa/code_explainer_rules.js | 5562 | high | css-explainer | ) 조건은 |
| src/pwa/code_explainer_rules.js | 5562 | high | css-explainer | 안쪽 CSS를 적용한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5567 | high | css-explainer | 작은 화면 열 구조 변경 |
| src/pwa/code_explainer_rules.js | 5568 | high | css-explainer | 의 grid-template-columns를 |
| src/pwa/code_explainer_rules.js | 5568 | high | css-explainer | 로 바꿉니다. 즉 |
| src/pwa/code_explainer_rules.js | 5568 | high | css-explainer | 가 됩니다. |
| src/pwa/code_explainer_rules.js | 5576 | high | css-explainer | grid 레이아웃을 만들고, 화면 크기에 따라 열 개수를 바꾸는 반응형 CSS입니다. |
| src/pwa/code_explainer_rules.js | 5660 | high | devops-explainer | 컨테이너가 시작될 때 npm start를 실행 |
| src/pwa/code_explainer_rules.js | 5661 | medium | unknown-action-ui | 컨테이너가 시작될 때 Node.js 실행 명령을 실행 |
| src/pwa/code_explainer_rules.js | 5662 | medium | unknown-action-ui | 컨테이너가 시작될 때 |
| src/pwa/code_explainer_rules.js | 5662 | medium | unknown-action-ui | 명령을 실행 |
| src/pwa/code_explainer_rules.js | 5689 | medium | unknown-action-ui | return !/미지원 항목 확인/.test(compactV334A7(action && action.title)) |
| src/pwa/code_explainer_rules.js | 5707 | high | devops-explainer | 이미지를 기반으로 컨테이너를 만듭니다. |
| src/pwa/code_explainer_rules.js | 5708 | low | general-copy | 작업 폴더를 |
| src/pwa/code_explainer_rules.js | 5708 | low | general-copy | 로 정합니다. |
| src/pwa/code_explainer_rules.js | 5709 | high | devops-explainer | npm ci로 의존성을 설치합니다. |
| src/pwa/code_explainer_rules.js | 5710 | high | devops-explainer | 필요한 파일을 컨테이너 안으로 복사합니다. |
| src/pwa/code_explainer_rules.js | 5711 | low | general-copy | 포트를 사용할 앱임을 표시합니다. |
| src/pwa/code_explainer_rules.js | 5712 | low | general-copy | 합니다. |
| src/pwa/code_explainer_rules.js | 5719 | low | general-copy | 기반 이미지 선택 |
| src/pwa/code_explainer_rules.js | 5720 | medium | unknown-action-ui | FROM 명령은 컨테이너의 기반 환경을 고릅니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5720 | medium | unknown-action-ui | 이미지를 사용해 Node.js 앱을 담을 가벼운 실행 환경을 준비합니다. |
| src/pwa/code_explainer_rules.js | 5725 | medium | app-ui | 작업 폴더 설정 |
| src/pwa/code_explainer_rules.js | 5726 | medium | unknown-action-ui | WORKDIR 명령은 컨테이너 안에서 기준이 되는 작업 폴더를 정합니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5726 | medium | unknown-action-ui | 폴더를 기준으로 이후 설치와 실행 명령을 처리합니다. |
| src/pwa/code_explainer_rules.js | 5733 | medium | app-ui | 의존성 파일 먼저 복사 |
| src/pwa/code_explainer_rules.js | 5734 | medium | unknown-action-ui | COPY 명령으로 package.json과 package-lock.json 같은 의존성 파일을 먼저 컨테이너에 넣습니다. 이렇게 하면 소스 코드만 바뀐 경우 의존성 설치 단계를 다시 하지 않아도 될 가능성이 커집니다. |
| src/pwa/code_explainer_rules.js | 5741 | low | general-copy | 의존성 설치 |
| src/pwa/code_explainer_rules.js | 5742 | medium | unknown-action-ui | RUN 명령은 이미지를 만드는 중에 설치 명령을 실행합니다. 여기서는 npm ci로 package-lock.json 기준의 npm 패키지를 깨끗하고 재현 가능하게 설치합니다. |
| src/pwa/code_explainer_rules.js | 5749 | medium | app-ui | 프로젝트 파일 복사 |
| src/pwa/code_explainer_rules.js | 5750 | medium | unknown-action-ui | 두 번째 COPY 명령은 애플리케이션 소스 파일을 컨테이너 안의 작업 폴더로 옮깁니다. 의존성 설치 뒤에 복사하면 Docker 캐시를 더 잘 활용할 수 있습니다. |
| src/pwa/code_explainer_rules.js | 5756 | low | general-copy | 앱 포트 표시 |
| src/pwa/code_explainer_rules.js | 5757 | medium | unknown-action-ui | EXPOSE 명령은 컨테이너 안의 앱이 사용할 포트를 문서처럼 표시합니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5757 | medium | unknown-action-ui | 포트를 쓰는 앱이라는 뜻이고, 실제 외부 연결은 docker run의 포트 매핑에서 정합니다. |
| src/pwa/code_explainer_rules.js | 5763 | medium | unknown-action-ui | 컨테이너 시작 명령 설정 |
| src/pwa/code_explainer_rules.js | 5764 | medium | unknown-action-ui | CMD 명령은 컨테이너가 시작될 때 기본으로 실행할 작업을 정합니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5764 | medium | unknown-action-ui | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5768 | medium | unknown-action-ui | 컨테이너 시작 명령 설정 |
| src/pwa/code_explainer_rules.js | 5769 | medium | unknown-action-ui | ENTRYPOINT 명령은 컨테이너가 시작될 때 항상 실행할 작업을 정합니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5769 | medium | unknown-action-ui | 한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5776 | medium | unknown-action-ui | Node.js 앱을 컨테이너 이미지로 만들고, 의존성 설치와 실행 명령을 정하는 Dockerfile입니다. |
| src/pwa/code_explainer_rules.js | 5819 | low | general-copy | 지정된 GitHub 이벤트 |
| src/pwa/code_explainer_rules.js | 5820 | low | general-copy | push나 pull_request가 발생할 때 |
| src/pwa/code_explainer_rules.js | 5821 | low | general-copy | push가 발생할 때 |
| src/pwa/code_explainer_rules.js | 5822 | low | general-copy | pull request가 발생할 때 |
| src/pwa/code_explainer_rules.js | 5823 | low | general-copy | 이벤트가 발생할 때 |
| src/pwa/code_explainer_rules.js | 5840 | high | devops-explainer | 워크플로우는 |
| src/pwa/code_explainer_rules.js | 5840 | high | devops-explainer | 실행됩니다. |
| src/pwa/code_explainer_rules.js | 5841 | low | general-copy | 작업은 |
| src/pwa/code_explainer_rules.js | 5841 | low | general-copy | 환경에서 실행됩니다. |
| src/pwa/code_explainer_rules.js | 5842 | low | general-copy | 코드를 체크아웃합니다. |
| src/pwa/code_explainer_rules.js | 5843 | low | general-copy | Node.js 실행 환경을 준비합니다. |
| src/pwa/code_explainer_rules.js | 5844 | high | devops-explainer | npm ci로 의존성을 설치합니다. |
| src/pwa/code_explainer_rules.js | 5845 | high | devops-explainer | npm test로 테스트를 실행합니다. |
| src/pwa/code_explainer_rules.js | 5852 | medium | unknown-action-ui | 워크플로우 이름 확인 |
| src/pwa/code_explainer_rules.js | 5853 | high | devops-explainer | 은 GitHub Actions 화면에 표시될 자동화 이름입니다. |
| src/pwa/code_explainer_rules.js | 5857 | high | python-explainer | 실행 조건 설정 |
| src/pwa/code_explainer_rules.js | 5858 | medium | app-ui | on 설정은 언제 이 자동화가 실행되는지 정합니다. 여기서는 |
| src/pwa/code_explainer_rules.js | 5858 | medium | app-ui | 실행됩니다. |
| src/pwa/code_explainer_rules.js | 5863 | low | general-copy | 실행 환경 선택 |
| src/pwa/code_explainer_rules.js | 5864 | low | general-copy | 작업을 |
| src/pwa/code_explainer_rules.js | 5864 | low | general-copy | 가상 머신에서 실행한다는 뜻입니다. |
| src/pwa/code_explainer_rules.js | 5870 | high | javascript-explainer | 저장소 코드 가져오기 |
| src/pwa/code_explainer_rules.js | 5871 | high | devops-explainer | actions/checkout은 GitHub 저장소의 코드를 워크플로우 실행 환경으로 내려받는 단계입니다. |
| src/pwa/code_explainer_rules.js | 5877 | low | general-copy | Node.js 환경 준비 |
| src/pwa/code_explainer_rules.js | 5878 | medium | unknown-action-ui | actions/setup-node는 npm 명령을 실행할 수 있도록 Node.js 환경을 준비하는 단계입니다. |
| src/pwa/code_explainer_rules.js | 5884 | low | general-copy | 의존성 설치 |
| src/pwa/code_explainer_rules.js | 5885 | high | devops-explainer | npm ci는 package-lock.json 기준으로 필요한 패키지를 깨끗하게 설치합니다. |
| src/pwa/code_explainer_rules.js | 5891 | low | general-copy | 테스트 실행 |
| src/pwa/code_explainer_rules.js | 5892 | medium | unknown-action-ui | npm test는 프로젝트의 테스트 스크립트를 실행해서 코드가 기대대로 동작하는지 확인합니다. |
| src/pwa/code_explainer_rules.js | 5899 | medium | app-ui | GitHub에 push 또는 pull request가 생겼을 때 의존성을 설치하고 테스트를 실행하는 CI 자동화 설정입니다. |
| src/pwa/code_explainer.js | 38 | high | javascript-explainer | 저장했습니다. |
| src/pwa/code_explainer.js | 140 | medium | app-ui | 파이썬 코드를 읽는 연습을 위한 학습 앱입니다. |
| src/pwa/code_explainer.js | 142 | low | general-copy | ## 설치 |
| src/pwa/code_explainer.js | 144 | low | general-copy | - Node.js를 설치합니다. |
| src/pwa/code_explainer.js | 145 | low | general-copy | - 의존성을 설치합니다. |
| src/pwa/code_explainer.js | 146 | medium | unknown-action-ui | - 검증 명령을 실행합니다. |
| src/pwa/code_explainer.js | 152 | low | general-copy | 자세한 내용은 [개발 문서](./docs/dev.md)를 참고하세요. |
| src/pwa/code_explainer.js | 204 | medium | unknown-action-ui | 자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다. |
| src/pwa/code_explainer.js | 205 | medium | unknown-action-ui | PowerShell은 로컬 작업, Git, 파일 복사, 백업, 압축 명령을 쉽게 풀어 설명합니다. |
| src/pwa/code_explainer.js | 206 | high | python-explainer | Python은 변수, 조건문, 반복문, 함수, 파일/JSON/CSV/API 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 207 | high | javascript-explainer | JavaScript는 웹페이지 동작, DOM, localStorage, fetch 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 208 | low | general-copy | Workers는 request, env, DB/KV/R2/AI, Response 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 209 | low | general-copy | Java는 class, main, 변수 선언, if/for, method, 출력 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 210 | high | devops-explainer | package.json은 npm scripts, dependencies, devDependencies를 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 211 | high | devops-explainer | GitHub Actions YAML은 on, jobs, runs-on, steps, uses, run 흐름을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 212 | medium | unknown-action-ui | Dockerfile은 이미지 선택, 작업 폴더, 복사, 설치, 실행 명령을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 213 | low | general-copy | .env는 환경변수와 비밀값 노출 위험을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 214 | high | python-explainer | requirements.txt는 Python 패키지와 버전 고정 방식을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 215 | high | python-explainer | pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 216 | medium | app-ui | YAML은 들여쓰기 기반 설정 키, 목록, 서비스 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 217 | low | general-copy | Markdown/README는 제목, 목록, 코드블록, 링크를 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 218 | low | general-copy | .gitignore는 Git에서 제외할 파일/폴더 패턴과 예외 규칙을 설명합니다. |
| src/pwa/code_explainer.js | 219 | medium | app-ui | INI 설정은 섹션과 key=value 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 220 | high | sql-explainer | TOML 설정은 테이블, 키-값, 목록 설정을 중심으로 설명합니다. |
| src/pwa/code_explainer.js | 228 | low | general-copy | 자동 감지 |
| src/pwa/code_explainer.js | 243 | medium | app-ui | INI 설정 |
| src/pwa/code_explainer.js | 244 | medium | app-ui | TOML 설정 |
| src/pwa/code_explainer.js | 246 | low | general-copy | 자동 |
| src/pwa/code_explainer.js | 260 | low | general-copy | 사용자가 언어를 직접 선택했습니다. |
| src/pwa/code_explainer.js | 262 | low | general-copy | 자동감지로 코드 모양을 판별했습니다. |
| src/pwa/code_explainer.js | 266 | medium | unknown-action-ui | PowerShell 명령어 패턴이 보입니다. |
| src/pwa/code_explainer.js | 267 | medium | unknown-action-ui | PowerShell 변수($이름) 사용이 보입니다. |
| src/pwa/code_explainer.js | 268 | medium | unknown-action-ui | Git 작업 명령이 포함되어 있습니다. |
| src/pwa/code_explainer.js | 272 | high | python-explainer | Python import 문이 보입니다. |
| src/pwa/code_explainer.js | 273 | high | python-explainer | Python 함수 정의가 보입니다. |
| src/pwa/code_explainer.js | 274 | high | python-explainer | Python 클래스 정의가 보입니다. |
| src/pwa/code_explainer.js | 278 | high | javascript-explainer | JavaScript 변수 선언이 보입니다. |
| src/pwa/code_explainer.js | 279 | high | javascript-explainer | 브라우저 DOM/이벤트 코드가 보입니다. |
| src/pwa/code_explainer.js | 280 | high | javascript-explainer | JavaScript 함수 패턴이 보입니다. |
| src/pwa/code_explainer.js | 284 | low | general-copy | Cloudflare Worker fetch 진입점이 보입니다. |
| src/pwa/code_explainer.js | 285 | low | general-copy | Cloudflare env 바인딩 사용이 보입니다. |
| src/pwa/code_explainer.js | 286 | low | general-copy | Worker 응답 반환 코드가 보입니다. |
| src/pwa/code_explainer.js | 290 | low | general-copy | Java main 메서드가 보입니다. |
| src/pwa/code_explainer.js | 291 | low | general-copy | Java 클래스/출력 문법이 보입니다. |
| src/pwa/code_explainer.js | 295 | low | general-copy | package.json scripts 영역이 보입니다. |
| src/pwa/code_explainer.js | 296 | high | devops-explainer | npm 의존성 영역이 보입니다. |
| src/pwa/code_explainer.js | 300 | high | devops-explainer | GitHub Actions의 on/jobs 구조가 보입니다. |
| src/pwa/code_explainer.js | 301 | high | devops-explainer | actions/checkout 같은 GitHub Action 사용이 보입니다. |
| src/pwa/code_explainer.js | 305 | high | devops-explainer | Dockerfile FROM 베이스 이미지 줄이 보입니다. |
| src/pwa/code_explainer.js | 306 | medium | unknown-action-ui | Dockerfile 명령어 패턴이 보입니다. |
| src/pwa/code_explainer.js | 310 | low | general-copy | 대문자 환경변수 KEY=VALUE 패턴이 보입니다. |
| src/pwa/code_explainer.js | 311 | low | general-copy | 비밀값으로 보이는 환경변수명이 포함되어 있습니다. |
| src/pwa/code_explainer.js | 315 | high | python-explainer | Python 패키지 버전 조건이 보입니다. |
| src/pwa/code_explainer.js | 316 | low | general-copy | 다른 requirements 파일을 포함하는 줄이 보입니다. |
| src/pwa/code_explainer.js | 320 | low | general-copy | pyproject.toml의 [project] 영역이 보입니다. |
| src/pwa/code_explainer.js | 321 | high | python-explainer | Python build-system 설정이 보입니다. |
| src/pwa/code_explainer.js | 325 | low | general-copy | YAML key: value 구조가 보입니다. |
| src/pwa/code_explainer.js | 326 | medium | app-ui | 들여쓰기 기반 설정 구조가 보입니다. |
| src/pwa/code_explainer.js | 330 | low | general-copy | Markdown 제목(#)이 보입니다. |
| src/pwa/code_explainer.js | 331 | low | general-copy | Markdown 코드블록이 포함되어 있습니다. |
| src/pwa/code_explainer.js | 332 | low | general-copy | Markdown 링크 문법이 보입니다. |
| src/pwa/code_explainer.js | 336 | low | general-copy | .gitignore 무시/예외 패턴이 보입니다. |
| src/pwa/code_explainer.js | 337 | low | general-copy | Git에서 제외할 폴더/파일 패턴이 보입니다. |
| src/pwa/code_explainer.js | 341 | low | general-copy | INI 섹션([section])이 보입니다. |
| src/pwa/code_explainer.js | 342 | medium | app-ui | INI key=value 설정이 보입니다. |
| src/pwa/code_explainer.js | 346 | high | sql-explainer | TOML 테이블([table])이 보입니다. |
| src/pwa/code_explainer.js | 347 | low | general-copy | TOML 값 형식이 보입니다. |
| src/pwa/code_explainer.js | 350 | low | general-copy | 감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요. |
| src/pwa/code_explainer.js | 360 | low | general-copy | 자동 감지 |
| src/pwa/code_explainer.js | 365 | low | general-copy | >선택: |
| src/pwa/code_explainer.js | 366 | low | general-copy | >감지: |
| src/pwa/code_explainer.js | 374 | low | general-copy | 위험 |
| src/pwa/code_explainer.js | 375 | low | general-copy | 주의 |
| src/pwa/code_explainer.js | 376 | low | general-copy | 낮음 |
| src/pwa/code_explainer.js | 381 | low | general-copy | 규칙 일치 |
| src/pwa/code_explainer.js | 382 | medium | app-ui | 추정 해석 |
| src/pwa/code_explainer.js | 383 | low | general-copy | 일반 설명 |
| src/pwa/code_explainer.js | 384 | medium | app-ui | 추정 해석 |
| src/pwa/code_explainer.js | 428 | medium | unknown-action-ui | ><strong>다음 확인 명령:</strong><pre class= |
| src/pwa/code_explainer.js | 447 | medium | unknown-action-ui | <summary>함수 흐름 / 다음 확인</summary> |
| src/pwa/code_explainer.js | 472 | low | general-copy | 백업 |
| src/pwa/code_explainer.js | 479 | low | general-copy | 파일 |
| src/pwa/code_explainer.js | 479 | low | general-copy | 폴더 |
| src/pwa/code_explainer.js | 479 | low | general-copy | 경로 |
| src/pwa/code_explainer.js | 480 | low | general-copy | 검증 |
| src/pwa/code_explainer.js | 481 | low | general-copy | 보안 |
| src/pwa/code_explainer.js | 481 | low | general-copy | 환경변수 |
| src/pwa/code_explainer.js | 521 | high | general-copy | if (keyword === "test" && /test\|validation\|regression\|quality\|검증/.test(text)) score += 6 |
| src/pwa/code_explainer.js | 522 | high | general-copy | if (keyword === "security" && /secret\|token\|auth\|env\|security\|보안/.test(text)) score += 6 |
| src/pwa/code_explainer.js | 573 | low | general-copy | 추천 카드 |
| src/pwa/code_explainer.js | 573 | low | general-copy | 개 보기 |
| src/pwa/code_explainer.js | 577 | low | general-copy | 필요할 때만 펼쳐서 보세요. 기본 설명을 먼저 읽는 흐름을 방해하지 않도록 접어 둡니다. |
| src/pwa/code_explainer.js | 603 | medium | unknown-action-ui | 확인할 명령어 |
| src/pwa/code_explainer.js | 603 | medium | unknown-action-ui | 개 보기 |
| src/pwa/code_explainer.js | 607 | medium | unknown-action-ui | 모르는 항목이 있으면 아래 PowerShell 명령을 먼저 실행하세요. 결과를 붙여넣으면 더 정확히 해석할 수 있습니다. |
| src/pwa/code_explainer.js | 621 | medium | unknown-action-ui | 미확인 항목 확인 |
| src/pwa/code_explainer.js | 625 | medium | unknown-action-ui | 실행 전 의미와 설치 여부를 확인해야 합니다. |
| src/pwa/code_explainer.js | 637 | medium | unknown-action-ui | 읽기/조회 명령 위주로 먼저 확인하세요. |
| src/pwa/code_explainer.js | 669 | medium | app-ui | 관련 보충 카드가 아직 연결되지 않았습니다. 위의 단계별 해석만으로도 학습을 진행할 수 있습니다. |
| src/pwa/code_explainer.js | 681 | low | general-copy | 사이드카드 |
| src/pwa/code_explainer.js | 691 | low | general-copy | 자세히 보기 |
| src/pwa/code_explainer.js | 744 | high | python-explainer | 현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다. |
| src/pwa/code_explainer.js | 745 | low | general-copy | 전체 단계 중 앞부분을 우선 렌더링합니다. |
| src/pwa/code_explainer.js | 750 | low | general-copy | <strong>긴 코드 요약 보기</strong> |
| src/pwa/code_explainer.js | 751 | low | general-copy | >감지된 단계가 |
| src/pwa/code_explainer.js | 751 | low | general-copy | 개입니다. |
| src/pwa/code_explainer.js | 753 | medium | unknown-action-ui | >화면 성능을 위해 먼저 |
| src/pwa/code_explainer.js | 753 | medium | unknown-action-ui | 개만 표시했습니다. 전체 순서는 복사 리포트와 Mermaid 원문에서 함께 확인할 수 있습니다.</p> |
| src/pwa/code_explainer.js | 754 | low | general-copy | >현재 전체 단계 표시 중입니다. 화면이 무거우면 다시 120개만 보기로 줄일 수 있습니다.</p> |
| src/pwa/code_explainer.js | 760 | low | general-copy | 120개만 보기 |
| src/pwa/code_explainer.js | 760 | low | general-copy | 전체 단계 펼치기 |
| src/pwa/code_explainer.js | 800 | high | python-explainer | >현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.</p> |
| src/pwa/code_explainer.js | 801 | medium | unknown-action-ui | >표시할 해석 단계가 없습니다. 언어 선택이나 코드 범위를 확인한 뒤 다시 분석해 보세요.</p> |
| src/pwa/code_explainer.js | 822 | medium | unknown-action-ui | 나머지 |
| src/pwa/code_explainer.js | 822 | medium | unknown-action-ui | 개 단계는 리포트 복사 또는 Mermaid 원문에서 이어서 확인하세요. |
| src/pwa/code_explainer.js | 834 | medium | unknown-action-ui | 위험/주의 명령은 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 925 | high | python-explainer | 조건에 맞는 값을 모아둘 빈 목록으로 보입니다. |
| src/pwa/code_explainer.js | 926 | low | general-copy | 키와 값을 모아둘 사전으로 보입니다. |
| src/pwa/code_explainer.js | 927 | high | python-explainer | JSON 데이터를 Python에서 다루는 값으로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 928 | high | python-explainer | Python 데이터를 JSON 형태로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 929 | low | general-copy | 파일이나 경로와 관련된 값을 담습니다. |
| src/pwa/code_explainer.js | 930 | low | general-copy | 기존 데이터를 걸러내거나 변환한 결과입니다. |
| src/pwa/code_explainer.js | 931 | low | general-copy | 개수나 크기 같은 숫자 정보를 담습니다. |
| src/pwa/code_explainer.js | 932 | low | general-copy | 함수의 최종 결과나 중간 결과를 모아두는 변수로 보입니다. |
| src/pwa/code_explainer.js | 933 | low | general-copy | 반복문 안에서 항목 하나를 가리키는 변수로 보입니다. |
| src/pwa/code_explainer.js | 934 | low | general-copy | 입력이나 파일에서 읽은 문자열 내용을 담는 변수로 보입니다. |
| src/pwa/code_explainer.js | 936 | low | general-copy | 함수 안에서 계산하거나 다음 단계에 넘기기 위해 만든 중간 값으로 보입니다. |
| src/pwa/code_explainer.js | 985 | low | general-copy | 입력 |
| src/pwa/code_explainer.js | 985 | low | general-copy | 내부 변수/초기값 준비 |
| src/pwa/code_explainer.js | 992 | low | general-copy | 반복: |
| src/pwa/code_explainer.js | 998 | high | python-explainer | 조건: |
| src/pwa/code_explainer.js | 1004 | low | general-copy | 호출: |
| src/pwa/code_explainer.js | 1009 | low | general-copy | 반환: |
| src/pwa/code_explainer.js | 1011 | low | general-copy | 결과/부수효과 완료 |
| src/pwa/code_explainer.js | 1027 | high | python-explainer | 입력 목록을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다. |
| src/pwa/code_explainer.js | 1030 | low | general-copy | 여러 항목을 순회하면서 결과 목록을 만들고 반환하는 수집 함수로 보입니다. |
| src/pwa/code_explainer.js | 1033 | low | general-copy | JSON 데이터를 읽거나 변환해서 다음 처리에 넘기는 데이터 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 1036 | low | general-copy | 파일이나 경로를 읽고 쓰는 파일 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 1039 | medium | unknown-action-ui | 여러 항목을 순회하면서 필요한 값을 화면/터미널에 출력하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1042 | low | general-copy | 여러 항목을 순회해 계산하거나 가공한 뒤 결과를 반환하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1045 | low | general-copy | 입력값이나 내부 계산값을 처리해 결과를 반환하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1048 | medium | unknown-action-ui | 입력값과 내부 명령을 실행해 상태를 바꾸거나 부수효과를 만드는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1056 | high | general-copy | if (ir.variables.some(function(v) { return /\[\]\|목록\|list/i.test(v.expr + " " + v.role); })) concepts.add("list") |
| src/pwa/code_explainer.js | 1057 | high | general-copy | if (ir.variables.some(function(v) { return /\{\}\|사전\|dict/i.test(v.expr + " " + v.role); })) concepts.add("dict") |
| src/pwa/code_explainer.js | 1116 | low | general-copy | 에서 |
| src/pwa/code_explainer.js | 1116 | low | general-copy | 를 하나씩 꺼냅니다. |
| src/pwa/code_explainer.js | 1122 | low | general-copy | 안의 항목 하나를 반복 중에 가리킵니다. |
| src/pwa/code_explainer.js | 1156 | low | general-copy | 값을 입력으로 받습니다. |
| src/pwa/code_explainer.js | 1160 | low | general-copy | 값을 준비합니다: |
| src/pwa/code_explainer.js | 1168 | medium | unknown-action-ui | 조건을 확인합니다. |
| src/pwa/code_explainer.js | 1172 | low | general-copy | 호출을 실행합니다. |
| src/pwa/code_explainer.js | 1176 | low | general-copy | 값을 함수 밖으로 반환합니다. |
| src/pwa/code_explainer.js | 1251 | low | general-copy | 값을 열거나 준비한 뒤 |
| src/pwa/code_explainer.js | 1251 | low | general-copy | 이름으로 다룹니다. |
| src/pwa/code_explainer.js | 1259 | low | general-copy | 실패할 수 있는 처리를 먼저 시도합니다. |
| src/pwa/code_explainer.js | 1269 | low | general-copy | 예외가 발생했을 때 대체 흐름으로 처리합니다. |
| src/pwa/code_explainer.js | 1277 | medium | unknown-action-ui | 명령줄 입력값을 정의하거나 읽는 CLI 처리입니다. |
| src/pwa/code_explainer.js | 1285 | low | general-copy | 파일이나 경로를 읽고 쓰는 처리입니다. |
| src/pwa/code_explainer.js | 1293 | low | general-copy | JSON 데이터를 읽거나 변환하는 처리입니다. |
| src/pwa/code_explainer.js | 1307 | medium | unknown-action-ui | 명령줄 인자를 정의하고 읽기 위한 argparse 파서입니다. |
| src/pwa/code_explainer.js | 1309 | medium | unknown-action-ui | 사용자가 명령줄에서 입력한 옵션 값을 담는 객체입니다. |
| src/pwa/code_explainer.js | 1311 | high | python-explainer | JSON 문자열이나 파일 내용을 Python 데이터로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1313 | low | general-copy | 파일이나 폴더 위치를 나타내거나 파일 처리에 쓰이는 값입니다. |
| src/pwa/code_explainer.js | 1315 | high | javascript-explainer | 파일 저장/읽기 위치를 나타내는 값입니다. |
| src/pwa/code_explainer.js | 1329 | medium | unknown-action-ui | 명령줄 옵션을 정의하고 parse_args로 사용자의 입력값을 읽어 준비하는 CLI 진입 함수로 보입니다. |
| src/pwa/code_explainer.js | 1333 | low | general-copy | JSON 파싱을 시도하고 실패하면 예외를 처리해 안전한 값을 반환하는 방어적 데이터 파싱 함수로 보입니다. |
| src/pwa/code_explainer.js | 1337 | high | python-explainer | 파일을 열어 JSON 데이터를 읽고 Python 데이터로 바꿔 반환하는 파일 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 1341 | high | javascript-explainer | 경로를 만들고 텍스트나 보고서를 파일에 저장한 뒤 결과 경로를 반환하는 파일 저장 함수로 보입니다. |
| src/pwa/code_explainer.js | 1371 | low | general-copy | 사용 라이브러리/모듈: |
| src/pwa/code_explainer.js | 1388 | high | javascript-explainer | write_text로 텍스트를 파일에 저장합니다. |
| src/pwa/code_explainer.js | 1390 | low | general-copy | read_text로 파일 내용을 문자열로 읽습니다. |
| src/pwa/code_explainer.js | 1392 | low | general-copy | open으로 파일을 열어 읽거나 씁니다. |
| src/pwa/code_explainer.js | 1394 | low | general-copy | Path로 파일/폴더 경로를 만듭니다. |
| src/pwa/code_explainer.js | 1400 | high | python-explainer | json.loads로 JSON 문자열을 Python 데이터로 바꿉니다. |
| src/pwa/code_explainer.js | 1402 | low | general-copy | json.load로 파일에서 JSON 데이터를 읽습니다. |
| src/pwa/code_explainer.js | 1404 | high | python-explainer | json.dumps로 Python 데이터를 JSON 문자열로 바꿉니다. |
| src/pwa/code_explainer.js | 1406 | high | javascript-explainer | json.dump로 Python 데이터를 JSON 파일에 저장합니다. |
| src/pwa/code_explainer.js | 1558 | high | python-explainer | 조건에 맞는 값을 모아둘 빈 배열로 보입니다. |
| src/pwa/code_explainer.js | 1559 | high | javascript-explainer | 키와 값을 묶어 저장할 빈 객체로 보입니다. |
| src/pwa/code_explainer.js | 1560 | high | javascript-explainer | JSON 문자열을 JavaScript 값으로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1561 | high | javascript-explainer | JavaScript 값을 JSON 문자열로 바꾼 결과입니다. |
| src/pwa/code_explainer.js | 1562 | low | general-copy | 화면의 HTML 요소를 찾아 담은 값입니다. |
| src/pwa/code_explainer.js | 1563 | low | general-copy | 네트워크 요청 결과나 응답을 담는 값으로 보입니다. |
| src/pwa/code_explainer.js | 1564 | low | general-copy | 비동기 처리 결과를 기다려 받은 값입니다. |
| src/pwa/code_explainer.js | 1565 | low | general-copy | 배열을 가공해서 만든 결과입니다. |
| src/pwa/code_explainer.js | 1566 | low | general-copy | 파일, 경로, URL 같은 위치 정보를 담는 값으로 보입니다. |
| src/pwa/code_explainer.js | 1567 | low | general-copy | 여러 값을 모으거나 다음 단계로 넘기기 위한 묶음 데이터로 보입니다. |
| src/pwa/code_explainer.js | 1569 | low | general-copy | 함수 안에서 계산하거나 다음 단계에 넘기기 위해 만든 중간 값으로 보입니다. |
| src/pwa/code_explainer.js | 1603 | low | general-copy | 값을 입력으로 받습니다. |
| src/pwa/code_explainer.js | 1619 | low | general-copy | 값을 준비합니다: |
| src/pwa/code_explainer.js | 1628 | high | python-explainer | 조건으로 반복합니다. |
| src/pwa/code_explainer.js | 1632 | low | general-copy | 에서 |
| src/pwa/code_explainer.js | 1632 | low | general-copy | 값을 하나씩 꺼냅니다. |
| src/pwa/code_explainer.js | 1649 | medium | unknown-action-ui | 조건을 확인합니다. |
| src/pwa/code_explainer.js | 1651 | medium | unknown-action-ui | 조건을 확인합니다. |
| src/pwa/code_explainer.js | 1661 | low | general-copy | 값을 함수 밖으로 반환합니다. |
| src/pwa/code_explainer.js | 1663 | low | general-copy | 값을 함수 밖으로 반환합니다. |
| src/pwa/code_explainer.js | 1678 | low | general-copy | 호출을 실행합니다. |
| src/pwa/code_explainer.js | 1712 | low | general-copy | fetch 같은 비동기 요청을 실행하고 응답 데이터를 다음 단계로 넘기는 네트워크 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 1716 | low | general-copy | 화면 요소를 찾거나 이벤트를 연결해 브라우저 UI 동작을 처리하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1720 | high | javascript-explainer | JSON 데이터를 JavaScript 값으로 바꾸거나 문자열로 변환하는 데이터 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 1724 | high | python-explainer | 입력 배열을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다. |
| src/pwa/code_explainer.js | 1728 | low | general-copy | 배열 데이터를 map/filter/reduce 같은 메서드로 가공하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1732 | high | javascript-explainer | 입력값이나 내부 계산값을 처리해 결과를 반환하는 JavaScript 함수로 보입니다. |
| src/pwa/code_explainer.js | 1735 | high | javascript-explainer | JavaScript 코드 흐름을 함수 단위로 묶어 실행하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 1741 | low | general-copy | 입력 |
| src/pwa/code_explainer.js | 1741 | low | general-copy | 내부 변수/초기값 준비 |
| src/pwa/code_explainer.js | 1748 | low | general-copy | 반복: |
| src/pwa/code_explainer.js | 1754 | high | python-explainer | 조건: |
| src/pwa/code_explainer.js | 1760 | low | general-copy | 호출: |
| src/pwa/code_explainer.js | 1766 | low | general-copy | 반환: |
| src/pwa/code_explainer.js | 1905 | low | general-copy | await로 비동기 처리 결과를 기다립니다. |
| src/pwa/code_explainer.js | 1913 | low | general-copy | try 블록에서 실패할 수 있는 처리를 먼저 시도합니다. |
| src/pwa/code_explainer.js | 1923 | low | general-copy | catch 블록에서 |
| src/pwa/code_explainer.js | 1923 | low | general-copy | 오류를 받아 대체 흐름으로 처리합니다. |
| src/pwa/code_explainer.js | 1931 | low | general-copy | then으로 Promise 성공 결과를 이어서 처리합니다. |
| src/pwa/code_explainer.js | 1939 | low | general-copy | catch로 Promise 실패 흐름을 처리합니다. |
| src/pwa/code_explainer.js | 1946 | low | general-copy | fetch로 네트워크 요청을 실행합니다. |
| src/pwa/code_explainer.js | 1960 | low | general-copy | fetch 요청의 응답 객체를 기다려 받은 값입니다. |
| src/pwa/code_explainer.js | 1962 | high | javascript-explainer | 응답 본문을 JSON으로 변환해 얻은 JavaScript 데이터입니다. |
| src/pwa/code_explainer.js | 1964 | low | general-copy | Promise 체인에서 이어지는 비동기 처리 결과입니다. |
| src/pwa/code_explainer.js | 1977 | low | general-copy | async/await로 네트워크 요청을 시도하고 실패하면 catch에서 안전하게 처리하는 비동기 데이터 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 1981 | low | general-copy | fetch 요청 뒤 then/catch Promise 체인으로 성공·실패 흐름을 이어 처리하는 네트워크 함수로 보입니다. |
| src/pwa/code_explainer.js | 1985 | high | javascript-explainer | 다른 파일에서 import해 쓸 수 있도록 공개된 JavaScript 함수로, 입력을 처리해 결과를 반환합니다. |
| src/pwa/code_explainer.js | 1989 | low | general-copy | 클래스 객체 안에서 특정 동작을 담당하는 메서드로 보입니다. |
| src/pwa/code_explainer.js | 1993 | high | javascript-explainer | await로 비동기 작업 결과를 기다린 뒤 다음 처리를 이어가는 JavaScript 함수로 보입니다. |
| src/pwa/code_explainer.js | 1997 | low | general-copy | 실패할 수 있는 처리를 try에서 시도하고 catch에서 오류를 처리하는 방어적 함수로 보입니다. |
| src/pwa/code_explainer.js | 2018 | low | general-copy | export로 다른 파일에서 import해 쓸 수 있게 공개합니다. |
| src/pwa/code_explainer.js | 2023 | low | general-copy | async 함수로 비동기 작업을 다룰 수 있습니다. |
| src/pwa/code_explainer.js | 2028 | low | general-copy | class 안에 정의된 메서드로 객체의 동작을 담당합니다. |
| src/pwa/code_explainer.js | 2110 | low | general-copy | try/except는 실패할 수 있는 부분을 안전하게 감싸고, 실패했을 때도 프로그램이 바로 멈추지 않게 대체 흐름을 준비합니다. |
| src/pwa/code_explainer.js | 2114 | low | general-copy | with open은 파일을 열고 작업이 끝나면 자동으로 닫아 주기 때문에, 파일 처리에서 실수를 줄이는 안전한 패턴입니다. |
| src/pwa/code_explainer.js | 2118 | high | python-explainer | json.load/load는 JSON을 Python 데이터로 읽고, json.dump/dumps는 Python 데이터를 JSON 형태로 내보내는 역할입니다. |
| src/pwa/code_explainer.js | 2122 | medium | unknown-action-ui | argparse는 사용자가 터미널에서 입력한 옵션을 코드 안의 args 값으로 바꿔 주는 입구 역할을 합니다. |
| src/pwa/code_explainer.js | 2126 | low | general-copy | Path는 문자열 경로를 파일/폴더 경로 객체로 다루게 해 주어, 경로 결합과 파일 접근을 더 읽기 쉽게 만듭니다. |
| src/pwa/code_explainer.js | 2130 | medium | unknown-action-ui | subprocess.run은 Python 코드 안에서 외부 명령을 실행하는 도구라서, 실패 가능성과 실행 환경을 함께 확인해야 합니다. |
| src/pwa/code_explainer.js | 2156 | medium | unknown-action-ui | 명령줄에서 받은 옵션으로 파일 경로를 정하고, 그 파일을 읽거나 처리하는 CLI 기반 파일 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 2158 | low | general-copy | JSON 읽기/변환처럼 실패할 수 있는 작업을 try/except로 감싸 안전하게 처리하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 2160 | high | python-explainer | 파일에서 JSON 데이터를 읽어 Python에서 다룰 수 있는 값으로 바꾸는 데이터 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 2185 | low | general-copy | export는 이 함수나 클래스를 다른 파일에서 import해 재사용할 수 있게 공개한다는 뜻입니다. |
| src/pwa/code_explainer.js | 2189 | low | general-copy | class 메서드는 객체가 가진 데이터(this)를 사용해 특정 행동을 수행하는 함수입니다. |
| src/pwa/code_explainer.js | 2193 | low | general-copy | fetch와 await가 함께 있으면, 서버/API 요청이 끝날 때까지 기다린 뒤 응답 데이터를 다음 줄에서 처리합니다. |
| src/pwa/code_explainer.js | 2195 | low | general-copy | fetch는 브라우저나 런타임에서 서버/API에 요청을 보내는 함수입니다. |
| src/pwa/code_explainer.js | 2199 | high | javascript-explainer | DOM 코드는 document로 화면 요소를 찾고, 값 변경이나 이벤트 연결로 사용자가 보는 UI를 바꿉니다. |
| src/pwa/code_explainer.js | 2203 | high | javascript-explainer | localStorage/sessionStorage는 브라우저 안에 작은 값을 저장해 새로고침 후에도 다시 사용할 수 있게 합니다. |
| src/pwa/code_explainer.js | 2207 | high | javascript-explainer | JSON.parse/stringify 또는 response.json은 문자열/응답 데이터를 JavaScript 객체로 바꾸거나 다시 문자열로 바꿉니다. |
| src/pwa/code_explainer.js | 2211 | low | general-copy | map/filter/reduce는 배열을 하나씩 보며 변환, 걸러내기, 누적 계산을 할 때 쓰는 대표 메서드입니다. |
| src/pwa/code_explainer.js | 2240 | low | general-copy | async/await로 API 요청 결과를 기다린 뒤 데이터를 가공하는 비동기 데이터 처리 함수로 보입니다. |
| src/pwa/code_explainer.js | 2242 | high | javascript-explainer | 배열 데이터를 화면에 표시하기 좋은 형태로 바꾼 뒤 DOM에 반영하는 UI 렌더링 함수로 보입니다. |
| src/pwa/code_explainer.js | 2244 | low | general-copy | 화면 요소를 찾고 이벤트나 내용을 연결해 브라우저 UI 동작을 만드는 함수로 보입니다. |
| src/pwa/code_explainer.js | 2276 | high | python-explainer | Python 함수 |
| src/pwa/code_explainer.js | 2277 | high | python-explainer | Python async 메서드 |
| src/pwa/code_explainer.js | 2278 | high | python-explainer | Python 클래스 메서드 |
| src/pwa/code_explainer.js | 2279 | high | python-explainer | Python async 함수 |
| src/pwa/code_explainer.js | 2280 | high | python-explainer | Python 함수 |
| src/pwa/code_explainer.js | 2418 | high | python-explainer | 조건이 참인 동안 반복합니다. |
| src/pwa/code_explainer.js | 2427 | low | general-copy | 예외를 발생시킬 수 있습니다. |
| src/pwa/code_explainer.js | 2435 | low | general-copy | await로 비동기 작업이 끝날 때까지 기다립니다. |
| src/pwa/code_explainer.js | 2443 | high | python-explainer | 컴프리헨션으로 반복과 생성/필터링을 한 줄에 압축했습니다. |
| src/pwa/code_explainer.js | 2451 | high | python-explainer | 앞 조건이 거짓일 때 실행되는 else 흐름입니다. |
| src/pwa/code_explainer.js | 2459 | low | general-copy | 성공/실패와 관계없이 마지막에 실행되는 finally 흐름입니다. |
| src/pwa/code_explainer.js | 2468 | low | general-copy | 값을 하나씩 내보내는 generator 흐름입니다. |
| src/pwa/code_explainer.js | 2479 | high | python-explainer | Python 함수 |
| src/pwa/code_explainer.js | 2481 | medium | app-ui | 시작 |
| src/pwa/code_explainer.js | 2499 | low | general-copy | 클래스 안의 메서드 |
| src/pwa/code_explainer.js | 2503 | low | general-copy | 데코레이터: |
| src/pwa/code_explainer.js | 2507 | low | general-copy | async 함수로 비동기 흐름 준비 |
| src/pwa/code_explainer.js | 2511 | low | general-copy | 입력값: |
| src/pwa/code_explainer.js | 2516 | low | general-copy | for 반복: |
| src/pwa/code_explainer.js | 2545 | low | general-copy | try/except 예외 처리 흐름 |
| src/pwa/code_explainer.js | 2550 | low | general-copy | 호출: |
| src/pwa/code_explainer.js | 2555 | low | general-copy | 예외 발생 가능: |
| src/pwa/code_explainer.js | 2559 | low | general-copy | 반환: |
| src/pwa/code_explainer.js | 2563 | low | general-copy | 완료 |
| src/pwa/code_explainer.js | 2586 | low | general-copy | 함수 형태: |
| src/pwa/code_explainer.js | 2586 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 2589 | low | general-copy | 클래스 안에 들어 있는 메서드입니다. |
| src/pwa/code_explainer.js | 2594 | low | general-copy | 데코레이터 |
| src/pwa/code_explainer.js | 2594 | low | general-copy | 가 함수 동작을 감싸거나 등록합니다. |
| src/pwa/code_explainer.js | 2599 | low | general-copy | 반환 타입 힌트는 |
| src/pwa/code_explainer.js | 2599 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 2604 | low | general-copy | async 함수라서 await와 함께 비동기 작업을 다룰 수 있습니다. |
| src/pwa/code_explainer.js | 2641 | medium | app-ui | 정밀도 안내: 이 코드에는 함수/메서드가 |
| src/pwa/code_explainer.js | 2641 | medium | app-ui | 개 이상 보입니다. 화면 성능을 위해 앞 |
| src/pwa/code_explainer.js | 2641 | medium | app-ui | 개 중심으로 정밀 해석합니다. |
| src/pwa/code_explainer.js | 2647 | high | python-explainer | async/await로 외부 작업이 끝나기를 기다린 뒤 결과를 처리하는 비동기 Python 함수로 보입니다. |
| src/pwa/code_explainer.js | 2649 | high | python-explainer | 클래스 안에서 조건을 검사하고 필요하면 예외를 발생시키는 검증 메서드로 보입니다. |
| src/pwa/code_explainer.js | 2651 | low | general-copy | 클래스 안에서 객체의 동작을 담당하는 메서드로 보입니다. |
| src/pwa/code_explainer.js | 2653 | low | general-copy | 컴프리헨션으로 데이터를 빠르게 만들거나 걸러낸 뒤 결과를 반환하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 2655 | high | python-explainer | 조건을 검사하고 문제가 있으면 예외를 발생시키는 방어적 검증 함수로 보입니다. |
| src/pwa/code_explainer.js | 2820 | low | general-copy | 요소에 |
| src/pwa/code_explainer.js | 2820 | low | general-copy | 이벤트를 연결합니다. |
| src/pwa/code_explainer.js | 2830 | low | general-copy | 이벤트 핸들러를 직접 연결합니다. |
| src/pwa/code_explainer.js | 2840 | low | general-copy | 로 화면의 HTML 요소를 찾습니다. |
| src/pwa/code_explainer.js | 2848 | low | general-copy | 화면 요소의 텍스트/HTML/값을 변경합니다. |
| src/pwa/code_explainer.js | 2856 | high | css-explainer | classList로 화면 요소의 CSS 클래스를 바꿉니다. |
| src/pwa/code_explainer.js | 2864 | low | general-copy | style 속성으로 화면 요소의 인라인 스타일을 바꿉니다. |
| src/pwa/code_explainer.js | 2874 | high | javascript-explainer | 로 브라우저 저장소를 사용합니다. |
| src/pwa/code_explainer.js | 2882 | low | general-copy | 시간 지연/반복 실행 또는 애니메이션 프레임을 예약합니다. |
| src/pwa/code_explainer.js | 2890 | low | general-copy | 이벤트 객체에서 기본 동작, 전파, 발생 대상을 다룹니다. |
| src/pwa/code_explainer.js | 2897 | low | general-copy | finally로 Promise 성공/실패와 관계없이 마지막 처리를 실행합니다. |
| src/pwa/code_explainer.js | 2905 | low | general-copy | 여러 Promise를 함께 기다리거나 경쟁시키는 Promise 헬퍼를 사용합니다. |
| src/pwa/code_explainer.js | 2913 | high | javascript-explainer | JSON 데이터를 JavaScript 객체나 문자열로 변환합니다. |
| src/pwa/code_explainer.js | 2925 | low | general-copy | 이벤트 |
| src/pwa/code_explainer.js | 2926 | high | javascript-explainer | JavaScript 함수 |
| src/pwa/code_explainer.js | 2928 | medium | app-ui | 시작 |
| src/pwa/code_explainer.js | 2946 | low | general-copy | 요소 |
| src/pwa/code_explainer.js | 2946 | low | general-copy | 이벤트 |
| src/pwa/code_explainer.js | 2946 | low | general-copy | 발생 |
| src/pwa/code_explainer.js | 2950 | low | general-copy | async/await 비동기 흐름 |
| src/pwa/code_explainer.js | 2954 | low | general-copy | 입력값: |
| src/pwa/code_explainer.js | 2958 | low | general-copy | 이벤트 연결 |
| src/pwa/code_explainer.js | 2970 | low | general-copy | 반복: |
| src/pwa/code_explainer.js | 2998 | low | general-copy | 반환: |
| src/pwa/code_explainer.js | 3000 | low | general-copy | 완료 |
| src/pwa/code_explainer.js | 3023 | low | general-copy | 요소 |
| src/pwa/code_explainer.js | 3023 | low | general-copy | 에서 |
| src/pwa/code_explainer.js | 3023 | low | general-copy | 이벤트 |
| src/pwa/code_explainer.js | 3023 | low | general-copy | 가 발생했을 때 실행되는 이벤트 콜백입니다. |
| src/pwa/code_explainer.js | 3026 | high | javascript-explainer | 이벤트 |
| src/pwa/code_explainer.js | 3026 | high | javascript-explainer | 이벤트가 발생했을 때 화면 값, 저장소, DOM 변경을 처리하는 UI 이벤트 콜백으로 보입니다. |
| src/pwa/code_explainer.js | 3075 | high | javascript-explainer | DOM 요소에 이벤트 리스너를 연결해 사용자의 클릭/입력 같은 행동을 처리하도록 준비하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 3077 | high | javascript-explainer | 화면 요소를 찾고 내용을 바꿔 브라우저 UI를 갱신하는 DOM 조작 함수로 보입니다. |
| src/pwa/code_explainer.js | 3079 | high | javascript-explainer | 브라우저 저장소를 읽거나 써서 사용자 입력값이나 상태를 보존하는 함수로 보입니다. |
| src/pwa/code_explainer.js | 3085 | medium | app-ui | 정밀도 안내: 이 코드에는 함수/이벤트 콜백이 |
| src/pwa/code_explainer.js | 3085 | medium | app-ui | 개 이상 보입니다. 화면 성능을 위해 앞 |
| src/pwa/code_explainer.js | 3085 | medium | app-ui | 개 중심으로 정밀 해석합니다. |
| src/pwa/code_explainer.js | 3122 | low | general-copy | 간단 개요도 |
| src/pwa/code_explainer.js | 3123 | low | general-copy | 코드 전체의 큰 역할을 짧게 보여주는 기본 도식입니다. |
| src/pwa/code_explainer.js | 3127 | low | general-copy | 함수 흐름도 |
| src/pwa/code_explainer.js | 3128 | high | python-explainer | 입력, 조건, 반복, 호출, 반환처럼 함수 내부 실행 순서를 보여주는 도식입니다. |
| src/pwa/code_explainer.js | 3132 | low | general-copy | 이벤트/비동기 흐름도 |
| src/pwa/code_explainer.js | 3133 | high | javascript-explainer | 클릭/입력 이벤트, DOM 변경, fetch/await/Promise 같은 브라우저 흐름을 보여주는 도식입니다. |
| src/pwa/code_explainer.js | 3192 | low | general-copy | 입력값 |
| src/pwa/code_explainer.js | 3193 | high | python-explainer | 조건 |
| src/pwa/code_explainer.js | 3194 | low | general-copy | 반복 |
| src/pwa/code_explainer.js | 3195 | low | general-copy | 호출 |
| src/pwa/code_explainer.js | 3196 | low | general-copy | 반환 |
| src/pwa/code_explainer.js | 3198 | low | general-copy | 이벤트 연결 |
| src/pwa/code_explainer.js | 3199 | high | javascript-explainer | DOM 조회 |
| src/pwa/code_explainer.js | 3200 | high | javascript-explainer | DOM 변경 |
| src/pwa/code_explainer.js | 3227 | low | general-copy | 도식 모드: |
| src/pwa/code_explainer.js | 3227 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 3233 | low | general-copy | 도식 핵심 신호: |
| src/pwa/code_explainer.js | 3233 | low | general-copy | 중심으로 읽으면 됩니다. |
| src/pwa/code_explainer.js | 3240 | low | general-copy | Mermaid 안내: 여러 함수가 있을 때는 함수별로 도식 모드를 따로 붙여 읽습니다. |
| src/pwa/code_explainer.js | 3325 | low | general-copy | 관련 카드 |
| src/pwa/code_explainer.js | 3326 | low | general-copy | 관련 카드 |
| src/pwa/code_explainer.js | 3366 | low | general-copy | 함수 |
| src/pwa/code_explainer.js | 3367 | low | general-copy | 매개변수 |
| src/pwa/code_explainer.js | 3367 | low | general-copy | 인자 |
| src/pwa/code_explainer.js | 3367 | low | general-copy | 입력값 |
| src/pwa/code_explainer.js | 3368 | high | javascript-explainer | 변수 |
| src/pwa/code_explainer.js | 3368 | high | javascript-explainer | 저장 |
| src/pwa/code_explainer.js | 3369 | low | general-copy | 반환 |
| src/pwa/code_explainer.js | 3370 | low | general-copy | 반복 |
| src/pwa/code_explainer.js | 3371 | high | python-explainer | 조건 |
| src/pwa/code_explainer.js | 3372 | high | python-explainer | 리스트 |
| src/pwa/code_explainer.js | 3372 | high | python-explainer | 추가 |
| src/pwa/code_explainer.js | 3373 | high | python-explainer | 리스트 |
| src/pwa/code_explainer.js | 3373 | high | python-explainer | 배열 |
| src/pwa/code_explainer.js | 3374 | high | python-explainer | 딕셔너리 |
| src/pwa/code_explainer.js | 3374 | high | python-explainer | 사전 |
| src/pwa/code_explainer.js | 3375 | low | general-copy | 파싱 |
| src/pwa/code_explainer.js | 3376 | low | general-copy | 파싱 |
| src/pwa/code_explainer.js | 3377 | low | general-copy | 파일 |
| src/pwa/code_explainer.js | 3377 | low | general-copy | 경로 |
| src/pwa/code_explainer.js | 3378 | low | general-copy | 파일 |
| src/pwa/code_explainer.js | 3378 | low | general-copy | 열기 |
| src/pwa/code_explainer.js | 3379 | low | general-copy | 컨텍스트 |
| src/pwa/code_explainer.js | 3379 | low | general-copy | 파일 |
| src/pwa/code_explainer.js | 3380 | low | general-copy | 예외 |
| src/pwa/code_explainer.js | 3380 | low | general-copy | 오류 |
| src/pwa/code_explainer.js | 3381 | medium | unknown-action-ui | 명령줄 |
| src/pwa/code_explainer.js | 3381 | medium | unknown-action-ui | 인자 |
| src/pwa/code_explainer.js | 3382 | medium | unknown-action-ui | 명령줄 |
| src/pwa/code_explainer.js | 3382 | medium | unknown-action-ui | 터미널 |
| src/pwa/code_explainer.js | 3382 | medium | unknown-action-ui | 인자 |
| src/pwa/code_explainer.js | 3412 | low | general-copy | 함수 |
| src/pwa/code_explainer.js | 3413 | low | general-copy | 매개변수 |
| src/pwa/code_explainer.js | 3414 | high | javascript-explainer | 변수 |
| src/pwa/code_explainer.js | 3415 | high | python-explainer | 리스트 |
| src/pwa/code_explainer.js | 3416 | high | python-explainer | 조건 |
| src/pwa/code_explainer.js | 3417 | low | general-copy | 반복 |
| src/pwa/code_explainer.js | 3418 | low | general-copy | 반환 |
| src/pwa/code_explainer.js | 3419 | high | general-copy | if (keyword === "json" && /json\|load\|loads\|dump\|dumps\|파싱\|인코딩\|디코딩/.test(text)) score += 8 |
| src/pwa/code_explainer.js | 3420 | low | general-copy | 파일 |
| src/pwa/code_explainer.js | 3421 | low | general-copy | 경로 |
| src/pwa/code_explainer.js | 3422 | low | general-copy | 예외 |
| src/pwa/code_explainer.js | 3423 | medium | unknown-action-ui | if (keyword === "argparse" && /argparse\|cli\|command line\|명령줄\|인자\|터미널/.test(text)) score += 8 |
| src/pwa/code_explainer.js | 3424 | medium | unknown-action-ui | if (keyword === "cli" && /cli\|command\|terminal\|명령어\|명령줄\|터미널\|인자/.test(text)) score += 8 |
| src/pwa/code_explainer.js | 3474 | medium | app-ui | >이 함수와 직접 연결되는 학습 카드는 아직 찾지 못했습니다.</p> |
| src/pwa/code_explainer.js | 3477 | low | general-copy | ><summary>이 함수 이해에 도움 되는 카드</summary> |
| src/pwa/code_explainer.js | 3483 | medium | app-ui | 문제카드 |
| src/pwa/code_explainer.js | 3483 | medium | app-ui | 사이드카드 |
| src/pwa/code_explainer.js | 3506 | low | general-copy | >Mermaid 로딩 중입니다. 잠시 후 다시 분석하기를 눌러주세요.</p> |
| src/pwa/code_explainer.js | 3518 | low | general-copy | >함수 흐름도 그리는 중...</p> |
| src/pwa/code_explainer.js | 3523 | low | general-copy | >렌더링 결과가 비어 있습니다.</p> |
| src/pwa/code_explainer.js | 3526 | low | general-copy | >함수 흐름도 렌더링 실패: |
| src/pwa/code_explainer.js | 3668 | low | general-copy | async/await로 네트워크 요청을 시도하고 실패하면 catch에서 안전하게 처리하는 비동기 데이터 로더 함수로 보입니다. |
| src/pwa/code_explainer.js | 3720 | low | general-copy | 화면/렌더링 |
| src/pwa/code_explainer.js | 3721 | high | javascript-explainer | 이벤트/DOM 연결 |
| src/pwa/code_explainer.js | 3722 | low | general-copy | 비동기/API 요청 |
| src/pwa/code_explainer.js | 3723 | high | javascript-explainer | 데이터/상태/저장 |
| src/pwa/code_explainer.js | 3724 | low | general-copy | 유틸/정규화/변환 |
| src/pwa/code_explainer.js | 3725 | low | general-copy | 클래스 메서드 |
| src/pwa/code_explainer.js | 3726 | low | general-copy | 기타 보조 함수 |
| src/pwa/code_explainer.js | 3783 | low | general-copy | 비동기/API 흐름 포함 |
| src/pwa/code_explainer.js | 3784 | high | javascript-explainer | DOM/UI 이벤트 흐름 포함 |
| src/pwa/code_explainer.js | 3785 | high | javascript-explainer | 저장/JSON 데이터 흐름 포함 |
| src/pwa/code_explainer.js | 3786 | low | general-copy | class 구조 포함 |
| src/pwa/code_explainer.js | 3790 | low | general-copy | >주요 신호는 함수명과 내부 호출 기준으로 분류했습니다.</p> |
| src/pwa/code_explainer.js | 3792 | low | general-copy | ><summary>전체 코드 뼈대 요약 · 함수 |
| src/pwa/code_explainer.js | 3793 | low | general-copy | 개</summary> |
| src/pwa/code_explainer.js | 3794 | medium | unknown-action-ui | >기본 해석은 앞쪽 함수 몇 개가 아니라, 전체 파일의 함수 역할 분포를 먼저 보여줍니다. 세부 흐름은 아래 함수 목록에서 하나를 선택해 확인합니다.</p> |
| src/pwa/code_explainer.js | 3805 | low | general-copy | 예시 없음 |
| src/pwa/code_explainer.js | 3860 | low | general-copy | >함수 검색 |
| src/pwa/code_explainer.js | 3861 | low | general-copy | 함수명, 역할, 내부 호출 검색 |
| src/pwa/code_explainer.js | 3864 | low | general-copy | >역할군 |
| src/pwa/code_explainer.js | 3866 | low | general-copy | >전체</option> |
| src/pwa/code_explainer.js | 3875 | low | general-copy | </strong><small>검색 결과 / 전체 |
| src/pwa/code_explainer.js | 4003 | low | general-copy | 없음 |
| src/pwa/code_explainer.js | 4051 | high | javascript-explainer | 저장/JSON |
| src/pwa/code_explainer.js | 4052 | low | general-copy | 네트워크/API |
| src/pwa/code_explainer.js | 4053 | low | general-copy | 배열/컬렉션 |
| src/pwa/code_explainer.js | 4054 | low | general-copy | 내부 함수 |
| src/pwa/code_explainer.js | 4055 | low | general-copy | 유틸/변환 |
| src/pwa/code_explainer.js | 4056 | low | general-copy | 기타 |
| src/pwa/code_explainer.js | 4059 | low | general-copy | 기타 |
| src/pwa/code_explainer.js | 4188 | low | general-copy | >내부 호출/API 신호가 뚜렷하지 않거나, 너무 일반적인 보조 호출만 있어 숨겼습니다.</p> |
| src/pwa/code_explainer.js | 4191 | low | general-copy | ><summary>내부 호출/API 그룹</summary> |
| src/pwa/code_explainer.js | 4192 | low | general-copy | >너무 흔한 보조 호출은 줄이고, 실제 읽기 순서에 도움이 되는 호출만 성격별로 묶었습니다.</p> |
| src/pwa/code_explainer.js | 4195 | low | general-copy | 개</h5> |
| src/pwa/code_explainer.js | 4212 | low | general-copy | >내부 호출/API 신호가 뚜렷하지 않습니다.</p> |
| src/pwa/code_explainer.js | 4219 | low | general-copy | <small>내부 호출</small> |
| src/pwa/code_explainer.js | 4258 | low | general-copy | 직접 호출 신호 없음 |
| src/pwa/code_explainer.js | 4269 | low | general-copy | ><summary>선택 함수 호출 관계 그래프</summary> |
| src/pwa/code_explainer.js | 4270 | low | general-copy | >왼쪽은 이 함수를 호출하는 함수, 오른쪽은 이 함수 내부에서 호출하는 함수/API입니다.</p> |
| src/pwa/code_explainer.js | 4271 | low | general-copy | >호출 관계 그래프 렌더링 대기</div> |
| src/pwa/code_explainer.js | 4272 | low | general-copy | ><summary>Mermaid 코드 보기</summary><pre><code> |
| src/pwa/code_explainer.js | 4288 | low | general-copy | Mermaid 렌더러를 찾지 못했습니다. Mermaid 코드 보기를 사용하세요. |
| src/pwa/code_explainer.js | 4300 | low | general-copy | 호출 관계 그래프 렌더링 실패: |
| src/pwa/code_explainer.js | 4315 | low | general-copy | ><summary>선택 함수 주변 문맥 · |
| src/pwa/code_explainer.js | 4317 | low | general-copy | >이 함수는 <strong> |
| src/pwa/code_explainer.js | 4317 | low | general-copy | 미분류 |
| src/pwa/code_explainer.js | 4318 | medium | unknown-action-ui | </strong> 역할군으로 보이며, 주변 함수/호출 관계를 함께 확인합니다.</p> |
| src/pwa/code_explainer.js | 4319 | low | general-copy | <h4>앞쪽 주변 함수</h4> |
| src/pwa/code_explainer.js | 4320 | low | general-copy | 앞쪽 주변 함수가 없습니다. |
| src/pwa/code_explainer.js | 4321 | low | general-copy | <h4>뒤쪽 주변 함수</h4> |
| src/pwa/code_explainer.js | 4322 | low | general-copy | 뒤쪽 주변 함수가 없습니다. |
| src/pwa/code_explainer.js | 4323 | low | general-copy | <h4>이 함수를 호출하는 함수</h4> |
| src/pwa/code_explainer.js | 4324 | low | general-copy | 현재 파일 안에서 이 함수를 직접 호출하는 함수가 보이지 않습니다. |
| src/pwa/code_explainer.js | 4325 | low | general-copy | <h4>이 함수 내부 호출/API</h4> |
| src/pwa/code_explainer.js | 4345 | medium | app-ui | >선택 해석 중: <strong> |
| src/pwa/code_explainer.js | 4346 | high | python-explainer | >대형 파일에서는 전체 뼈대를 먼저 보고, 검색/필터로 함수를 찾은 뒤 하나를 골라 단독 해석할 수 있습니다.</p> |
| src/pwa/code_explainer.js | 4350 | high | python-explainer | >검색 결과가 길어 처음 |
| src/pwa/code_explainer.js | 4350 | high | python-explainer | 개만 표시합니다. 검색어나 역할군 필터로 더 좁혀보세요.</p> |
| src/pwa/code_explainer.js | 4355 | high | python-explainer | >검색/필터 조건에 맞는 함수가 없습니다.</p> |
| src/pwa/code_explainer.js | 4357 | medium | app-ui | ><summary>함수 목록 / 선택 해석 · 전체 |
| src/pwa/code_explainer.js | 4358 | low | general-copy | 개 · 결과 |
| src/pwa/code_explainer.js | 4358 | low | general-copy | 개</summary> |
| src/pwa/code_explainer.js | 4421 | medium | app-ui | 함수 단위 해석 대상이 아직 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 4425 | low | general-copy | 없음 |
| src/pwa/code_explainer.js | 4430 | low | general-copy | >감지된 내부 변수가 없습니다.</p> |
| src/pwa/code_explainer.js | 4436 | low | general-copy | >처리 흐름을 아직 요약하지 못했습니다.</p> |
| src/pwa/code_explainer.js | 4442 | low | general-copy | >연결된 개념 없음</span> |
| src/pwa/code_explainer.js | 4447 | low | general-copy | ><summary>함수 흐름도</summary> |
| src/pwa/code_explainer.js | 4448 | low | general-copy | >함수 흐름도 렌더링 준비 중...</p></div> |
| src/pwa/code_explainer.js | 4449 | low | general-copy | ><summary>Mermaid 코드 보기</summary><pre><code> |
| src/pwa/code_explainer.js | 4454 | low | general-copy | 함수 |
| src/pwa/code_explainer.js | 4455 | low | general-copy | <p><strong>역할:</strong> |
| src/pwa/code_explainer.js | 4456 | low | general-copy | <p><strong>입력:</strong> |
| src/pwa/code_explainer.js | 4457 | low | general-copy | <p><strong>내부 변수:</strong></p> |
| src/pwa/code_explainer.js | 4459 | low | general-copy | <p><strong>처리 흐름:</strong></p> |
| src/pwa/code_explainer.js | 4491 | low | general-copy | 함수 |
| src/pwa/code_explainer.js | 4493 | low | general-copy | 클래스 |
| src/pwa/code_explainer.js | 4494 | medium | app-ui | 실행 시작점 |
| src/pwa/code_explainer.js | 4494 | medium | app-ui | 직접 실행될 때 시작되는 구간 |
| src/pwa/code_explainer.js | 4499 | low | general-copy | 함수 |
| src/pwa/code_explainer.js | 4501 | low | general-copy | 함수/핸들러 |
| src/pwa/code_explainer.js | 4502 | low | general-copy | 모듈 진입점 |
| src/pwa/code_explainer.js | 4502 | low | general-copy | 외부로 공개되는 기본 객체 |
| src/pwa/code_explainer.js | 4503 | low | general-copy | 요청 처리 |
| src/pwa/code_explainer.js | 4503 | low | general-copy | Workers 요청 처리 함수 |
| src/pwa/code_explainer.js | 4504 | low | general-copy | 이벤트 연결 |
| src/pwa/code_explainer.js | 4504 | low | general-copy | 사용자 동작과 함수를 연결 |
| src/pwa/code_explainer.js | 4509 | low | general-copy | 클래스 |
| src/pwa/code_explainer.js | 4510 | medium | app-ui | 실행 시작점 |
| src/pwa/code_explainer.js | 4510 | medium | app-ui | Java 프로그램 시작 메서드 |
| src/pwa/code_explainer.js | 4512 | low | general-copy | 메서드 |
| src/pwa/code_explainer.js | 4517 | medium | unknown-action-ui | 함수 |
| src/pwa/code_explainer.js | 4518 | low | general-copy | 입력 파라미터 |
| src/pwa/code_explainer.js | 4518 | low | general-copy | 스크립트 입력값 정의 |
| src/pwa/code_explainer.js | 4519 | medium | unknown-action-ui | Git 작업 |
| src/pwa/code_explainer.js | 4519 | medium | unknown-action-ui | 버전관리 명령 |
| src/pwa/code_explainer.js | 4520 | medium | unknown-action-ui | Cloudflare 작업 |
| src/pwa/code_explainer.js | 4520 | medium | unknown-action-ui | wrangler 명령 |
| src/pwa/code_explainer.js | 4525 | low | general-copy | 문서 제목 |
| src/pwa/code_explainer.js | 4530 | medium | app-ui | 설정 구간 |
| src/pwa/code_explainer.js | 4535 | medium | app-ui | 설정 섹션 |
| src/pwa/code_explainer.js | 4540 | low | general-copy | Docker 단계 |
| src/pwa/code_explainer.js | 4549 | low | general-copy | 처리 |
| src/pwa/code_explainer.js | 4556 | medium | unknown-action-ui | 의존성 |
| src/pwa/code_explainer.js | 4556 | medium | unknown-action-ui | 패키지설정 |
| src/pwa/code_explainer.js | 4556 | medium | unknown-action-ui | 프로젝트설정 |
| src/pwa/code_explainer.js | 4556 | medium | unknown-action-ui | 1. 먼저 import, 의존성, 프로젝트 설정을 확인합니다. |
| src/pwa/code_explainer.js | 4557 | low | general-copy | 구조 |
| src/pwa/code_explainer.js | 4557 | low | general-copy | 웹서버 |
| src/pwa/code_explainer.js | 4557 | low | general-copy | 2. 함수, 클래스, CLI 진입점, API 엔드포인트 같은 큰 구조를 봅니다. |
| src/pwa/code_explainer.js | 4558 | medium | unknown-action-ui | 파일/경로 |
| src/pwa/code_explainer.js | 4558 | medium | unknown-action-ui | 저장소 |
| src/pwa/code_explainer.js | 4558 | medium | unknown-action-ui | 3. 파일, 저장소, DB처럼 데이터가 들어오고 나가는 지점을 확인합니다. |
| src/pwa/code_explainer.js | 4559 | high | python-explainer | 조건 |
| src/pwa/code_explainer.js | 4559 | high | python-explainer | 반복 |
| src/pwa/code_explainer.js | 4559 | high | python-explainer | 검증 |
| src/pwa/code_explainer.js | 4559 | high | python-explainer | 4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다. |
| src/pwa/code_explainer.js | 4560 | medium | unknown-action-ui | 출력/응답 |
| src/pwa/code_explainer.js | 4560 | medium | unknown-action-ui | 배포 |
| src/pwa/code_explainer.js | 4560 | medium | unknown-action-ui | 5. 마지막 출력, 응답, 배포 명령으로 결과가 어디로 나가는지 확인합니다. |
| src/pwa/code_explainer.js | 4563 | medium | unknown-action-ui | 1. 위에서 아래로 읽되, 제목/섹션/함수처럼 큰 구간부터 먼저 확인합니다. |
| src/pwa/code_explainer.js | 4564 | medium | unknown-action-ui | 2. 그다음 위험/주의 단계와 출력 지점을 확인합니다. |
| src/pwa/code_explainer.js | 4575 | low | general-copy | 처리 |
| src/pwa/code_explainer.js | 4608 | low | general-copy | >함수/클래스/섹션 같은 큰 구조는 뚜렷하게 감지되지 않았습니다.</p> |
| src/pwa/code_explainer.js | 4615 | low | general-copy | >주의 구간: |
| src/pwa/code_explainer.js | 4616 | low | general-copy | >주의/위험 구간은 별도로 감지되지 않았습니다.</p> |
| src/pwa/code_explainer.js | 4620 | low | general-copy | </strong><small>줄</small></span> |
| src/pwa/code_explainer.js | 4621 | low | general-copy | </strong><small>내용 줄</small></span> |
| src/pwa/code_explainer.js | 4622 | low | general-copy | </strong><small>주석/문서 줄</small></span> |
| src/pwa/code_explainer.js | 4623 | low | general-copy | </strong><small>글자</small></span> |
| src/pwa/code_explainer.js | 4625 | low | general-copy | >주요 분류: |
| src/pwa/code_explainer.js | 4625 | low | general-copy | 분류 없음 |
| src/pwa/code_explainer.js | 4626 | low | general-copy | >주요 태그: |
| src/pwa/code_explainer.js | 4626 | low | general-copy | 태그 없음 |
| src/pwa/code_explainer.js | 4627 | low | general-copy | ><summary>주요 함수/구간</summary> |
| src/pwa/code_explainer.js | 4628 | low | general-copy | ><summary>추천 읽는 순서</summary> |
| src/pwa/code_explainer.js | 4637 | medium | app-ui | [코드 해석 리포트] |
| src/pwa/code_explainer.js | 4638 | low | general-copy | 언어: |
| src/pwa/code_explainer.js | 4640 | low | general-copy | 입력 선택: |
| src/pwa/code_explainer.js | 4643 | low | general-copy | 감지 근거: |
| src/pwa/code_explainer.js | 4645 | low | general-copy | 요약: |
| src/pwa/code_explainer.js | 4646 | low | general-copy | 흐름: |
| src/pwa/code_explainer.js | 4647 | low | general-copy | 단계 수: |
| src/pwa/code_explainer.js | 4648 | low | general-copy | 주의/위험 줄: |
| src/pwa/code_explainer.js | 4652 | medium | unknown-action-ui | 확신도: 확실 |
| src/pwa/code_explainer.js | 4652 | medium | unknown-action-ui | / 추정 |
| src/pwa/code_explainer.js | 4652 | medium | unknown-action-ui | / 미지원 |
| src/pwa/code_explainer.js | 4655 | medium | unknown-action-ui | 미지원/확인필요: |
| src/pwa/code_explainer.js | 4666 | low | general-copy | [데이터 흐름] |
| src/pwa/code_explainer.js | 4668 | low | general-copy | · 생성: |
| src/pwa/code_explainer.js | 4669 | low | general-copy | · 사용: |
| src/pwa/code_explainer.js | 4676 | low | general-copy | [호출 흐름] |
| src/pwa/code_explainer.js | 4684 | medium | app-ui | [함수 단위 해석] |
| src/pwa/code_explainer.js | 4697 | low | general-copy | [긴 코드 구조 요약] |
| src/pwa/code_explainer.js | 4698 | low | general-copy | 원본 규모: |
| src/pwa/code_explainer.js | 4698 | low | general-copy | 줄 / 내용 |
| src/pwa/code_explainer.js | 4698 | low | general-copy | 줄 / 글자 |
| src/pwa/code_explainer.js | 4699 | low | general-copy | 주요 분류: |
| src/pwa/code_explainer.js | 4699 | low | general-copy | 분류 없음 |
| src/pwa/code_explainer.js | 4700 | low | general-copy | 주요 태그: |
| src/pwa/code_explainer.js | 4700 | low | general-copy | 태그 없음 |
| src/pwa/code_explainer.js | 4702 | low | general-copy | 주요 함수/구간: |
| src/pwa/code_explainer.js | 4708 | low | general-copy | 추천 읽는 순서: |
| src/pwa/code_explainer.js | 4718 | low | general-copy | [원본 코드 앞부분] |
| src/pwa/code_explainer.js | 4722 | low | general-copy | ... 원본 코드 일부 생략 |
| src/pwa/code_explainer.js | 4727 | medium | unknown-action-ui | [주의/위험 명령] |
| src/pwa/code_explainer.js | 4734 | low | general-copy | [각 부분별 해설] |
| src/pwa/code_explainer.js | 4738 | low | general-copy | 코드: |
| src/pwa/code_explainer.js | 4742 | low | general-copy | ... 이후 |
| src/pwa/code_explainer.js | 4742 | low | general-copy | 개 단계 생략 |
| src/pwa/code_explainer.js | 4875 | high | python-explainer | 이 코드에서 가장 분명한 결과는 조건에 맞는 사람의 이름 목록을 만드는 것입니다. 그 결과를 만드는 핵심 함수는 |
| src/pwa/code_explainer.js | 4875 | high | python-explainer | 입니다. |
| src/pwa/code_explainer.js | 4879 | low | general-copy | 이 코드에서 가장 분명한 결과는 파일이나 JSON 값을 읽어서 코드에서 쓸 수 있는 데이터로 바꾸는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4879 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 4883 | low | general-copy | 이 코드에서 가장 분명한 결과는 여러 값을 돌면서 합계나 누적값을 계산하는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4883 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 4887 | high | python-explainer | 이 코드에서 가장 분명한 결과는 조건에 맞는 값을 골라 목록으로 모으는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4887 | high | python-explainer | 입니다. |
| src/pwa/code_explainer.js | 4891 | low | general-copy | 이 코드에서 가장 분명한 결과는 목록의 값을 하나씩 처리해서 새 목록을 만드는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4891 | low | general-copy | 입니다. |
| src/pwa/code_explainer.js | 4895 | high | python-explainer | 이 코드에서 가장 분명한 결과는 조건에 맞는 개수를 세는 것입니다. 핵심 함수는 |
| src/pwa/code_explainer.js | 4895 | high | python-explainer | 입니다. |
| src/pwa/code_explainer.js | 4899 | medium | app-ui | 이 코드는 입력값을 보고 실제로 실행할 함수를 고르는 코드로 보입니다. 다만 외부 함수나 설정을 더 봐야 정확히 어떤 일을 실행하는지 알 수 있습니다. |
| src/pwa/code_explainer.js | 4914 | low | general-copy | <h4>예를 들면</h4> |
| src/pwa/code_explainer.js | 4915 | low | general-copy | <p>사람 목록에 이런 값이 있다고 생각하면 됩니다.</p> |
| src/pwa/code_explainer.js | 4916 | low | general-copy | <pre>철수: active = true 영희: active = false 민수: active = true</pre> |
| src/pwa/code_explainer.js | 4917 | low | general-copy | <p>그러면 결과는 이렇게 됩니다.</p> |
| src/pwa/code_explainer.js | 4918 | low | general-copy | 철수 |
| src/pwa/code_explainer.js | 4918 | low | general-copy | 민수 |
| src/pwa/code_explainer.js | 4929 | high | python-explainer | <p><strong>무슨 일을 하나요?</strong><br>사람 목록(users)에서 조건에 맞는 사람의 이름만 골라냅니다.</p> |
| src/pwa/code_explainer.js | 4930 | low | general-copy | <p><strong>무엇을 하나씩 보나요?</strong><br>user는 users에서 꺼낸 사람 한 명입니다.</p> |
| src/pwa/code_explainer.js | 4931 | medium | unknown-action-ui | <p><strong>어떤 조건을 보나요?</strong><br>active 값이 참인지 확인합니다.</p> |
| src/pwa/code_explainer.js | 4932 | low | general-copy | <p><strong>무엇을 모으나요?</strong><br>name 값을 result 목록에 모읍니다.</p> |
| src/pwa/code_explainer.js | 4933 | high | python-explainer | <p><strong>최종 결과는?</strong><br>조건에 맞는 사람들의 이름 목록을 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4940 | high | python-explainer | <p><strong>무슨 일을 하나요?</strong><br>목록에서 조건에 맞는 값만 골라 새 목록에 모읍니다.</p> |
| src/pwa/code_explainer.js | 4941 | low | general-copy | <p><strong>최종 결과는?</strong><br>골라낸 값들의 목록을 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4948 | high | python-explainer | <p><strong>무슨 일을 하나요?</strong><br>조건에 맞는 항목이 몇 개인지 셉니다.</p> |
| src/pwa/code_explainer.js | 4949 | low | general-copy | <p><strong>최종 결과는?</strong><br>숫자 하나를 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4956 | high | general-copy | <p><strong>무슨 일을 하나요?</strong><br>파일, 경로, JSON 문자열 같은 입력을 읽어서 코드에서 사용할 데이터로 바꿉니다.</p> |
| src/pwa/code_explainer.js | 4957 | low | general-copy | <p><strong>주의할 점</strong><br>파일 경로나 JSON 형식이 틀리면 읽기 단계에서 오류가 날 수 있습니다.</p> |
| src/pwa/code_explainer.js | 4958 | low | general-copy | <p><strong>최종 결과는?</strong><br>읽어 온 데이터 객체나 목록을 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4965 | low | general-copy | <p><strong>무슨 일을 하나요?</strong><br>여러 값을 하나씩 보면서 total 같은 누적 변수에 더합니다.</p> |
| src/pwa/code_explainer.js | 4966 | low | general-copy | <p><strong>최종 결과는?</strong><br>합계나 누적 계산 결과를 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4973 | low | general-copy | <p><strong>무슨 일을 하나요?</strong><br>목록의 값을 하나씩 처리해서 새 목록을 만듭니다.</p> |
| src/pwa/code_explainer.js | 4974 | low | general-copy | <p><strong>최종 결과는?</strong><br>변환된 값들의 목록을 돌려줍니다.</p> |
| src/pwa/code_explainer.js | 4981 | low | general-copy | <p><strong>무슨 일을 하나요?</strong><br>입력값을 보고 실행할 함수(handler)를 고른 뒤 실행합니다.</p> |
| src/pwa/code_explainer.js | 4982 | high | general-copy | <p><strong>아직 모르는 점</strong><br>load_handler 같은 외부 함수가 이 코드 안에 없으면, 실제로 어떤 함수를 고르는지는 아직 알 수 없습니다.</p> |
| src/pwa/code_explainer.js | 4983 | low | general-copy | <p><strong>더 정확히 보려면</strong><br>load_handler가 정의된 코드를 같이 봐야 합니다.</p> |
| src/pwa/code_explainer.js | 4989 | low | general-copy | <p><strong>무슨 일을 하나요?</strong><br>입력값을 처리해서 결과를 돌려주는 함수입니다.</p> |
| src/pwa/code_explainer.js | 4995 | low | general-copy | 사람 여러 명이 들어 있는 목록 |
| src/pwa/code_explainer.js | 4996 | low | general-copy | 목록에서 지금 꺼내 본 사람 한 명 |
| src/pwa/code_explainer.js | 4997 | medium | unknown-action-ui | 조건에 맞는지 확인하는 표시 |
| src/pwa/code_explainer.js | 4998 | low | general-copy | 사람 이름 |
| src/pwa/code_explainer.js | 4999 | low | general-copy | 골라낸 값을 모아두는 목록 |
| src/pwa/code_explainer.js | 5000 | low | general-copy | 어떤 작업을 할지 정할 때 쓰는 입력값 |
| src/pwa/code_explainer.js | 5001 | low | general-copy | 실제로 일을 처리할 함수 |
| src/pwa/code_explainer.js | 5002 | low | general-copy | config 안에서 작업 종류를 가리키는 이름 |
| src/pwa/code_explainer.js | 5003 | low | general-copy | 개수를 세기 위해 쓰는 숫자 |
| src/pwa/code_explainer.js | 5004 | low | general-copy | 현재 더하거나 계산에 쓰는 값 하나 |
| src/pwa/code_explainer.js | 5005 | high | python-explainer | 점수 여러 개가 들어 있는 목록 |
| src/pwa/code_explainer.js | 5006 | low | general-copy | 목록에서 꺼낸 항목 하나 |
| src/pwa/code_explainer.js | 5007 | low | general-copy | 여러 항목이 들어 있는 목록 |
| src/pwa/code_explainer.js | 5008 | low | general-copy | 코드가 다루는 데이터 전체 |
| src/pwa/code_explainer.js | 5009 | low | general-copy | 아직 정리되기 전의 원본 값 |
| src/pwa/code_explainer.js | 5010 | low | general-copy | 글자 데이터 |
| src/pwa/code_explainer.js | 5011 | low | general-copy | 파일이나 폴더 위치 |
| src/pwa/code_explainer.js | 5012 | low | general-copy | 읽거나 쓰는 파일 |
| src/pwa/code_explainer.js | 5013 | low | general-copy | 파일 이름 |
| src/pwa/code_explainer.js | 5014 | low | general-copy | 열어 둔 파일을 가리키는 이름 |
| src/pwa/code_explainer.js | 5015 | low | general-copy | 표나 CSV에서 여러 줄 데이터 |
| src/pwa/code_explainer.js | 5016 | low | general-copy | 표나 CSV에서 한 줄 데이터 |
| src/pwa/code_explainer.js | 5017 | low | general-copy | 여러 기록이 들어 있는 목록 |
| src/pwa/code_explainer.js | 5018 | low | general-copy | 기록 하나 |
| src/pwa/code_explainer.js | 5019 | low | general-copy | API나 함수에 넘기는 데이터 묶음 |
| src/pwa/code_explainer.js | 5020 | low | general-copy | 요청을 보낸 뒤 돌아온 응답 |
| src/pwa/code_explainer.js | 5021 | low | general-copy | 값을 계속 더해 모은 합계 |
| src/pwa/code_explainer.js | 5022 | low | general-copy | 하나의 값 |
| src/pwa/code_explainer.js | 5023 | low | general-copy | 여러 값 |
| src/pwa/code_explainer.js | 5024 | high | python-explainer | 딕셔너리에서 값을 찾을 때 쓰는 이름 |
| src/pwa/code_explainer.js | 5025 | low | general-copy | 파일에서 읽은 한 줄 |
| src/pwa/code_explainer.js | 5026 | low | general-copy | 파일에서 읽은 여러 줄 |
| src/pwa/code_explainer.js | 5030 | low | general-copy | 여러 개가 들어 있는 목록처럼 보입니다. |
| src/pwa/code_explainer.js | 5031 | low | general-copy | 코드에서 잠깐 이름 붙여 둔 값입니다. |
| src/pwa/code_explainer.js | 5072 | low | general-copy | <summary>코드 속 이름표</summary> |
| src/pwa/code_explainer.js | 5085 | low | general-copy | 가 사람 목록(users)을 받습니다. |
| src/pwa/code_explainer.js | 5086 | low | general-copy | result라는 빈 목록을 만듭니다. |
| src/pwa/code_explainer.js | 5087 | low | general-copy | users에서 사람을 한 명씩 꺼내 user라고 부릅니다. |
| src/pwa/code_explainer.js | 5088 | medium | unknown-action-ui | user의 active 값이 참인지 확인합니다. |
| src/pwa/code_explainer.js | 5089 | high | python-explainer | 조건에 맞으면 user의 name을 result에 넣습니다. |
| src/pwa/code_explainer.js | 5090 | low | general-copy | 마지막에 result를 돌려줍니다. |
| src/pwa/code_explainer.js | 5092 | low | general-copy | 가 파일 경로나 JSON 값을 받습니다. |
| src/pwa/code_explainer.js | 5093 | low | general-copy | 파일을 열거나 문자열을 읽습니다. |
| src/pwa/code_explainer.js | 5094 | low | general-copy | JSON 파서를 사용해 코드에서 쓸 수 있는 데이터로 바꿉니다. |
| src/pwa/code_explainer.js | 5095 | low | general-copy | 마지막에 읽어 온 데이터를 돌려줍니다. |
| src/pwa/code_explainer.js | 5097 | low | general-copy | 가 여러 값을 받습니다. |
| src/pwa/code_explainer.js | 5098 | low | general-copy | total 같은 누적 변수를 준비합니다. |
| src/pwa/code_explainer.js | 5099 | low | general-copy | 값을 하나씩 보면서 누적 변수에 더합니다. |
| src/pwa/code_explainer.js | 5100 | low | general-copy | 마지막에 합계나 누적 결과를 돌려줍니다. |
| src/pwa/code_explainer.js | 5102 | low | general-copy | 가 목록을 받습니다. |
| src/pwa/code_explainer.js | 5103 | low | general-copy | 새 결과 목록을 준비합니다. |
| src/pwa/code_explainer.js | 5104 | low | general-copy | 원래 목록에서 값을 하나씩 꺼냅니다. |
| src/pwa/code_explainer.js | 5105 | low | general-copy | 각 값을 필요한 형태로 바꿔 새 목록에 넣습니다. |
| src/pwa/code_explainer.js | 5106 | low | general-copy | 마지막에 새 목록을 돌려줍니다. |
| src/pwa/code_explainer.js | 5111 | low | general-copy | 는 입력값을 보고 실행할 함수를 찾은 뒤 실행합니다. |
| src/pwa/code_explainer.js | 5112 | low | general-copy | 다만 외부 함수의 실제 내용은 이 코드만으로는 알 수 없습니다. |
| src/pwa/code_explainer.js | 5119 | low | general-copy | <h4>실행 순서</h4> |
| src/pwa/code_explainer.js | 5138 | high | general-copy | >참고: load_handler는 이 코드 조각 안에 정의되어 있지 않아서, 실제 연결 대상은 추가 코드가 있어야 더 정확히 설명할 수 있습니다.</p> |
| src/pwa/code_explainer.js | 5142 | low | general-copy | >초보자용 먼저 보기</div> |
| src/pwa/code_explainer.js | 5143 | low | general-copy | <h3>이 코드는 어떤 결과를 만드나요?</h3> |
| src/pwa/code_explainer.js | 5147 | low | general-copy | ><h4>함수별로 보면</h4> |
| src/pwa/code_explainer.js | 5159 | low | general-copy | 처리 |
| src/pwa/code_explainer.js | 5165 | medium | unknown-action-ui | >긴 코드 모드: |
| src/pwa/code_explainer.js | 5165 | medium | unknown-action-ui | 개 단계 / |
| src/pwa/code_explainer.js | 5165 | medium | unknown-action-ui | 줄. 화면에는 핵심 앞부분을 우선 보여주고, 전체 흐름은 리포트와 Mermaid 원문으로 확인합니다.</p> |
| src/pwa/code_explainer.js | 5170 | low | general-copy | ><summary>기존 숫자 요약 보기</summary> |
| src/pwa/code_explainer.js | 5172 | low | general-copy | </strong><small>단계</small></span> |
| src/pwa/code_explainer.js | 5173 | low | general-copy | </strong><small>위험/주의</small></span> |
| src/pwa/code_explainer.js | 5174 | medium | unknown-action-ui | </strong><small>미지원</small></span> |
| src/pwa/code_explainer.js | 5175 | medium | unknown-action-ui | </strong><small>확인필요</small></span> |
| src/pwa/code_explainer.js | 5177 | low | general-copy | 분류 없음 |
| src/pwa/code_explainer.js | 5193 | medium | unknown-action-ui | >미지원 함수/명령은 따로 감지되지 않았습니다.</p> |
| src/pwa/code_explainer.js | 5197 | low | general-copy | </strong><small>확실</small></span> |
| src/pwa/code_explainer.js | 5198 | low | general-copy | </strong><small>추정</small></span> |
| src/pwa/code_explainer.js | 5199 | medium | unknown-action-ui | </strong><small>미지원</small></span> |
| src/pwa/code_explainer.js | 5202 | medium | unknown-action-ui | <summary>미지원/확인필요 함수·명령</summary> |
| src/pwa/code_explainer.js | 5215 | low | general-copy | >생성: |
| src/pwa/code_explainer.js | 5219 | low | general-copy | >사용: |
| src/pwa/code_explainer.js | 5234 | low | general-copy | 흐름 |
| src/pwa/code_explainer.js | 5251 | low | general-copy | </strong><small>데이터 흐름</small></span> |
| src/pwa/code_explainer.js | 5252 | low | general-copy | </strong><small>호출 흐름</small></span> |
| src/pwa/code_explainer.js | 5253 | medium | app-ui | </strong><small>함수 해석</small></span> |
| src/pwa/code_explainer.js | 5254 | low | general-copy | </strong><small>함수 목록</small></span> |
| src/pwa/code_explainer.js | 5259 | low | general-copy | ><summary>데이터 흐름</summary> |
| src/pwa/code_explainer.js | 5260 | high | javascript-explainer | 변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 5262 | low | general-copy | ><summary>호출 흐름</summary> |
| src/pwa/code_explainer.js | 5263 | low | general-copy | 함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 5265 | medium | app-ui | ><summary>함수 단위 해석</summary> |
| src/pwa/code_explainer.js | 5266 | medium | app-ui | 함수 단위 해석 대상이 아직 감지되지 않았습니다. |
| src/pwa/code_explainer.js | 5272 | medium | app-ui | 복사할 코드 해석 리포트가 없습니다. 먼저 분석하기를 눌러주세요. |
| src/pwa/code_explainer.js | 5278 | medium | app-ui | 코드 해석 리포트를 복사했습니다. |
| src/pwa/code_explainer.js | 5280 | medium | app-ui | 리포트 복사 실패: |
| src/pwa/code_explainer.js | 5286 | low | general-copy | >Mermaid 로딩 중입니다. 잠시 후 다시 분석하기를 눌러주세요.</p> |
| src/pwa/code_explainer.js | 5287 | low | general-copy | Mermaid 로딩 중 |
| src/pwa/code_explainer.js | 5295 | low | general-copy | 흐름도 생성 완료 |
| src/pwa/code_explainer.js | 5297 | low | general-copy | >Mermaid 렌더링 실패: |
| src/pwa/code_explainer.js | 5298 | low | general-copy | 렌더링 실패 |
| src/pwa/code_explainer.js | 5313 | low | general-copy | 생성된 Mermaid 코드가 없습니다. |
| src/pwa/code_explainer.js | 5314 | low | general-copy | 생성 없음 |
| src/pwa/code_explainer.js | 5324 | low | general-copy | <strong>흐름도는 필요할 때 펼쳐서 봅니다</strong> |
| src/pwa/code_explainer.js | 5325 | high | javascript-explainer | >기본 화면에서는 그림을 바로 펼치지 않습니다. 코드를 먼저 읽고, 흐름이 필요할 때 아래 버튼으로 그림을 생성하세요. 감지된 단계는 |
| src/pwa/code_explainer.js | 5325 | high | javascript-explainer | 개입니다.</p> |
| src/pwa/code_explainer.js | 5330 | low | general-copy | 흐름도 보기 |
| src/pwa/code_explainer.js | 5333 | low | general-copy | 전체 흐름도 그리는 중... |
| src/pwa/code_explainer.js | 5339 | low | general-copy | 흐름도 대기 중 |
| src/pwa/code_explainer.js | 5451 | low | general-copy | 아직 분석한 코드가 없습니다. |
| src/pwa/code_explainer.js | 5455 | medium | unknown-action-ui | 위험 명령이 감지되면 여기에 표시됩니다. |
| src/pwa/code_explainer.js | 5468 | low | general-copy | 분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다. |
| src/pwa/code_explainer.js | 5472 | medium | unknown-action-ui | 분석하면 확실/추정/미지원 단계가 표시됩니다. |
| src/pwa/code_explainer.js | 5476 | low | general-copy | 분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다. |
| src/pwa/code_explainer.js | 5480 | low | general-copy | 긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다. |
| src/pwa/code_explainer.js | 5484 | low | general-copy | 분석하면 자동감지 결과와 판단 근거가 표시됩니다. |
| src/pwa/code_explainer.js | 5494 | medium | app-ui | 복사할 Mermaid 코드가 없습니다. |
| src/pwa/code_explainer.js | 5499 | medium | app-ui | Mermaid 코드를 복사했습니다. |
| src/pwa/code_explainer.js | 5501 | medium | app-ui | 복사 실패: |
| src/pwa/code_explainer.js | 5520 | medium | app-ui | 복사할 SVG가 없습니다. 먼저 분석하기를 눌러 흐름도를 생성하세요. |
| src/pwa/code_explainer.js | 5526 | medium | app-ui | SVG 원문 복사 완료 |
| src/pwa/code_explainer.js | 5527 | medium | app-ui | SVG 원문을 복사했습니다. |
| src/pwa/code_explainer.js | 5529 | medium | app-ui | SVG 복사 실패: |
| src/pwa/code_explainer.js | 5536 | low | general-copy | 다운로드할 SVG가 없습니다. 먼저 분석하기를 눌러 흐름도를 생성하세요. |
| src/pwa/code_explainer.js | 5551 | low | general-copy | SVG 다운로드 완료 |
| src/pwa/code_explainer.js | 5560 | low | general-copy | 크게 볼 흐름도가 없습니다. 먼저 분석하기를 눌러주세요. |
| src/pwa/code_explainer.js | 5568 | low | general-copy | 큰 보기 열림 |
| src/pwa/app.js | 23 | medium | unknown-action-ui | 값을 화면에 출력하는 기본 함수다. 코드 흐름을 확인하거나 간단한 결과를 볼 때 자주 쓴다. |
| src/pwa/app.js | 27 | high | python-explainer | 리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다. |
| src/pwa/app.js | 31 | low | general-copy | 값에 이름표를 붙여두는 방식이다. 코드 독해에서는 값이 변수 이름을 바꿔 이동하는 흐름을 따라가는 것이 중요하다. |
| src/pwa/app.js | 35 | low | general-copy | 여러 값을 순서대로 담는 자료구조다. 노드 목록, 파일 목록, 카드 목록처럼 여러 항목을 처리할 때 자주 쓴다. |
| src/pwa/app.js | 39 | low | general-copy | key와 value로 이루어진 자료구조다. JSON, API 응답, KG 노드 데이터는 dict처럼 읽는 경우가 많다. |
| src/pwa/app.js | 43 | low | general-copy | dict에서 값을 꺼내되, key가 없을 때 기본값을 줄 수 있는 메서드다. |
| src/pwa/app.js | 47 | medium | unknown-action-ui | 중복을 허용하지 않는 자료구조다. label 중복 제거, 처리한 파일 확인 등에 자주 쓴다. |
| src/pwa/app.js | 51 | low | general-copy | 여러 항목을 하나씩 꺼내 반복 처리한다. |
| src/pwa/app.js | 55 | high | python-explainer | 조건이 맞을 때만 특정 코드를 실행한다. |
| src/pwa/app.js | 56 | low | general-copy | 센서 노드 |
| src/pwa/app.js | 59 | high | python-explainer | 리스트 끝에 새 값을 추가한다. 필터링 결과를 모을 때 자주 쓴다. |
| src/pwa/app.js | 63 | low | general-copy | 함수를 정의할 때 쓴다. 반복되는 처리나 하나의 기능 단위를 이름 붙여 분리한다. |
| src/pwa/app.js | 67 | low | general-copy | 함수 안에서 처리한 결과를 함수 밖으로 돌려준다. |
| src/pwa/app.js | 71 | low | general-copy | 파일을 열 때 쓴다. 실제 데이터 처리 스크립트에서 매우 자주 나온다. |
| src/pwa/app.js | 75 | low | general-copy | 파일이나 리소스를 안전하게 열고 닫는 구조다. with open은 파일 처리의 기본 패턴이다. |
| src/pwa/app.js | 79 | low | general-copy | JSON 문자열을 파이썬 dict/list로 바꾼다. JSONL을 한 줄씩 읽을 때 핵심이다. |
| src/pwa/app.js | 83 | high | javascript-explainer | 파이썬 dict/list를 JSON 문자열로 바꾼다. JSONL 저장 시 자주 쓴다. |
| src/pwa/app.js | 87 | high | javascript-explainer | 한 줄에 JSON 하나씩 저장하는 형식이다. LLM 학습 데이터, 로그, KG chunks/nodes/edges에 자주 쓰인다. |
| src/pwa/app.js | 91 | low | general-copy | 파일 경로를 문자열보다 안전하게 다루는 표준 라이브러리다. Windows/Linux 경로 차이를 줄이는 데 도움이 된다. |
| src/pwa/app.js | 95 | medium | unknown-action-ui | 명령어 옵션을 받는 표준 라이브러리다. --input, --output 같은 배치 스크립트 옵션에 쓰인다. |
| src/pwa/app.js | 99 | low | general-copy | 에러가 나도 프로그램이 바로 죽지 않도록 처리하는 구조다. |
| src/pwa/app.js | 103 | low | general-copy | print보다 체계적으로 실행 기록을 남기는 방법이다. 오래 도는 배치 작업에서 중요하다. |
| src/pwa/app.js | 107 | low | general-copy | API 키 같은 민감한 값을 코드에 직접 쓰지 않고 환경변수로 읽는 방식이다. |
| src/pwa/app.js | 111 | low | general-copy | API를 호출할 때 사용하는 비밀 키다. 코드에 직접 넣어 GitHub에 올리면 위험하다. |
| src/pwa/app.js | 115 | low | general-copy | 입력, 처리, 출력으로 이어지는 프로그램 흐름이다. 데이터 처리 스크립트는 대부분 이 구조로 읽을 수 있다. |
| src/pwa/app.js | 119 | medium | app-ui | 스크립트의 실행 시작점을 모아두는 함수 이름으로 자주 쓰인다. |
| src/pwa/app.js | 163 | high | general-copy | return /예시\|예:\|예를 들어\|print\(\|console\.log\|\[[^\]]+\]\|\{[^}]+\}\|=\|=>\|->\|정답\|출력은\|출력:/i.test(text) |
| src/pwa/app.js | 171 | low | general-copy | .split(/(?<=[.!?。]\|다\.\|요\.)\s+/) |
| src/pwa/app.js | 263 | low | general-copy | 기본 개념 |
| src/pwa/app.js | 263 | low | general-copy | 개념 안내 |
| src/pwa/app.js | 287 | low | general-copy | 개념 안내 |
| src/pwa/app.js | 300 | medium | unknown-action-ui | 사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다. |
| src/pwa/app.js | 301 | low | general-copy | 정답을 직접 알려주지 않는 일반 개념 설명입니다. |
| src/pwa/app.js | 487 | low | general-copy | 더 읽어보기 |
| src/pwa/app.js | 491 | medium | app-ui | 외부 자료는 본문 복사 없이 링크와 출처만 연결합니다. |
| src/pwa/app.js | 503 | low | general-copy | 외부 자료 · |
| src/pwa/app.js | 514 | medium | app-ui | 관련 학습 자료입니다. |
| src/pwa/app.js | 578 | medium | app-ui | (코드 없음: 기능 선택형 문제) |
| src/pwa/app.js | 643 | low | general-copy | 예시: |
| src/pwa/app.js | 646 | low | general-copy | 연결 개념: |
| src/pwa/app.js | 657 | low | general-copy | 보너스 개념 미리보기 |
| src/pwa/app.js | 661 | low | general-copy | 카드를 누르면 해당 개념만 펼쳐서 봅니다. |
| src/pwa/app.js | 677 | low | general-copy | 펼치기 |
| src/pwa/app.js | 698 | low | general-copy | 관련 |
| src/pwa/app.js | 698 | low | general-copy | 보너스 |
| src/pwa/app.js | 702 | low | general-copy | 사이드 카드 |
| src/pwa/app.js | 706 | low | general-copy | 펼치기 |
| src/pwa/app.js | 718 | low | general-copy | 추가 설명이 없습니다. |
| src/pwa/app.js | 732 | low | general-copy | 접기 |
| src/pwa/app.js | 732 | low | general-copy | 펼치기 |
| src/pwa/app.js | 774 | low | general-copy | 모바일에서는 위 보너스 개념 카드를 눌러 필요한 설명만 펼쳐 보세요. |
| src/pwa/app.js | 793 | low | general-copy | 예시: |
| src/pwa/app.js | 796 | low | general-copy | 연관 개념: |
| src/pwa/app.js | 826 | low | general-copy | 개념 |
| src/pwa/app.js | 830 | low | general-copy | 개념 카드 |
| src/pwa/app.js | 834 | low | general-copy | 요약 설명이 아직 없는 카드입니다. |
| src/pwa/app.js | 845 | low | general-copy | 자세히 보기 |
| src/pwa/app.js | 855 | low | general-copy | 접기 |
| src/pwa/app.js | 858 | low | general-copy | 자세히 보기 |
| src/pwa/app.js | 907 | low | general-copy | 연결된 개념 |
| src/pwa/app.js | 909 | low | general-copy | 상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다. |
| src/pwa/app.js | 910 | medium | app-ui | 현재 문제와 직접 연결된 보조 개념입니다. |
| src/pwa/app.js | 916 | medium | app-ui | 이 문제에는 직접 연결된 보조 개념이 없습니다. |
| src/pwa/app.js | 920 | low | general-copy | 직접 연결 |
| src/pwa/app.js | 926 | low | general-copy | 가까운 개념 둘러보기 |
| src/pwa/app.js | 927 | low | general-copy | 현재 카드의 concepts와 느슨하게 겹치는 개념입니다. |
| src/pwa/app.js | 931 | low | general-copy | 연관 추천 |
| src/pwa/app.js | 943 | low | general-copy | 랜덤 배경지식 |
| src/pwa/app.js | 944 | low | general-copy | 퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다. |
| src/pwa/app.js | 947 | low | general-copy | 랜덤 상식 |
| src/pwa/app.js | 952 | low | general-copy | 다른 배경지식 |
| src/pwa/app.js | 997 | low | general-copy | 정답. |
| src/pwa/app.js | 1002 | low | general-copy | 오답. 정답: |
| src/pwa/app.js | 1026 | low | general-copy | 모르겠음 처리. 정답: |
| src/pwa/app.js | 1037 | low | general-copy | 진도만 초기화합니다. 메모는 유지됩니다. 계속할까요? |
| src/pwa/app.js | 1097 | low | general-copy | 개 개념 |
| src/pwa/app.js | 1127 | low | general-copy | · 관련 카드 |
| src/pwa/app.js | 1127 | low | general-copy | 개 · 본 |
| src/pwa/app.js | 1127 | low | general-copy | · 맞힘 |
| src/pwa/app.js | 1127 | low | general-copy | · 헷갈림 |
| src/pwa/app.js | 1158 | low | general-copy | 아직 직접 작성한 정의가 없습니다. 공부하면서 이 개념을 내 말로 정리해보세요. |
| src/pwa/app.js | 1159 | low | general-copy | (예시 준비 중) |
| src/pwa/app.js | 1174 | low | general-copy | 아직 관련 카드가 없습니다. |
| src/pwa/app.js | 1209 | high | javascript-explainer | 카드 메모를 저장했습니다. |
| src/pwa/app.js | 1219 | low | general-copy | 먼저 목차에서 개념을 선택하세요. |
| src/pwa/app.js | 1224 | high | javascript-explainer | 개념 메모를 저장했습니다. |
| src/pwa/app.js | 1274 | high | javascript-explainer | >아직 저장된 메모가 없습니다.</p> |
| src/pwa/app.js | 1303 | high | javascript-explainer | - 저장 위치: 이 파일은 브라우저 localStorage 메모를 Markdown으로 내보낸 백업입니다. |
| src/pwa/app.js | 1350 | low | general-copy | >전체 카드</div></div> |
| src/pwa/app.js | 1351 | low | general-copy | >본 카드</div></div> |
| src/pwa/app.js | 1352 | low | general-copy | >맞힌 카드</div></div> |
| src/pwa/app.js | 1353 | low | general-copy | >헷갈린 카드</div></div> |
| src/pwa/app.js | 1369 | low | general-copy | >본 카드 |
| src/pwa/app.js | 1369 | low | general-copy | · 맞힘 |
| src/pwa/app.js | 1369 | low | general-copy | · 헷갈림 |
| src/pwa/app.js | 1600 | low | general-copy | 데이터 로딩 실패 |
| src/pwa/app.js | 1729 | high | python-explainer | >오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div> |
| src/pwa/app.js | 1866 | low | general-copy | >전체 레벨</option> |
| src/pwa/app.js | 1871 | medium | app-ui | <div class="study-tools-title">학습 도구</div> |
| src/pwa/app.js | 1873 | low | general-copy | 카드 검색: 예) FastAPI, RAG, JSONL, 에러 |
| src/pwa/app.js | 1876 | low | general-copy | <option value="all">전체</option> |
| src/pwa/app.js | 1877 | low | general-copy | <option value="unseen">안 본 카드</option> |
| src/pwa/app.js | 1878 | low | general-copy | <option value="confused">모르겠음 카드</option> |
| src/pwa/app.js | 1879 | low | general-copy | <option value="wrong_or_unseen">복습 우선</option> |
| src/pwa/app.js | 1883 | high | python-explainer | <button type="button" id="studyToolsApply">조건 적용</button> |
| src/pwa/app.js | 1884 | low | general-copy | <button type="button" id="studyToolsToday">오늘 10장 만들기</button> |
| src/pwa/app.js | 1885 | low | general-copy | <button type="button" id="studyToolsRandom" class="secondary">랜덤 1장</button> |
| src/pwa/app.js | 1886 | high | python-explainer | <button type="button" id="studyToolsClear" class="secondary">조건 초기화</button> |
| src/pwa/app.js | 1938 | high | python-explainer | 조건 일치 |
| src/pwa/app.js | 1938 | high | python-explainer | 장 / 전체 |
| src/pwa/app.js | 1938 | high | python-explainer | 장 · 본 카드 |
| src/pwa/app.js | 1938 | high | python-explainer | 장 · 모르겠음 |
| src/pwa/app.js | 1950 | high | python-explainer | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 1968 | high | python-explainer | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 2015 | high | python-explainer | · 현재 필터 기준으로 검색/오늘 큐 생성 |
| src/pwa/app.js | 2076 | high | python-explainer | 현재 조건으로 오늘 최대 10장 |
| src/pwa/app.js | 2091 | high | python-explainer | const match = statusText.match(/조건 일치\s+(\d+)장/) |
| src/pwa/app.js | 2096 | high | python-explainer | 조건에 맞는 카드가 10장 미만이라 |
| src/pwa/app.js | 2096 | high | python-explainer | 장까지만 만들 수 있습니다. |
| src/pwa/app.js | 2102 | high | python-explainer | 현재 조건: <b> |
| src/pwa/app.js | 2102 | high | python-explainer | </b> · 오늘 큐 <b> |
| src/pwa/app.js | 2102 | high | python-explainer | 장</b>. |
| src/pwa/app.js | 2102 | high | python-explainer | 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요. |
| src/pwa/app.js | 2263 | low | general-copy | 완료 |
| src/pwa/app.js | 2292 | low | general-copy | 현재 카드는 오늘 큐 안의 카드가 아닙니다. |
| src/pwa/app.js | 2306 | low | general-copy | 오늘 큐가 비어 있습니다. |
| src/pwa/app.js | 2315 | low | general-copy | 오늘 큐가 비어 있습니다. |
| src/pwa/app.js | 2331 | low | general-copy | 오늘 큐를 모두 완료했습니다. |
| src/pwa/app.js | 2361 | low | general-copy | <button type="button" id="studyQueueFirstV72" class="secondary">큐 첫 장</button> |
| src/pwa/app.js | 2362 | high | general-copy | <button type="button" id="studyQueueDoneV72" class="secondary">현재 카드 완료 표시</button> |
| src/pwa/app.js | 2363 | low | general-copy | <button type="button" id="studyQueueNextV72">큐 다음</button> |
| src/pwa/app.js | 2364 | high | general-copy | <button type="button" id="studyQueueResetV72" class="secondary">큐 완료표시 초기화</button> |
| src/pwa/app.js | 2365 | low | general-copy | <button type="button" id="studyQueueClearV72" class="danger">큐 비우기</button> |
| src/pwa/app.js | 2400 | low | general-copy | 오늘 큐 |
| src/pwa/app.js | 2400 | low | general-copy | 완료 |
| src/pwa/app.js | 2400 | low | general-copy | · 현재 |
| src/pwa/app.js | 2400 | low | general-copy | 번째 |
| src/pwa/app.js | 2565 | high | python-explainer | >오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div> |
| src/pwa/app.js | 2702 | low | general-copy | >전체 레벨</option> |
| src/pwa/app.js | 2707 | medium | app-ui | <div class="study-tools-title">학습 도구</div> |
| src/pwa/app.js | 2709 | low | general-copy | 카드 검색: 예) FastAPI, RAG, JSONL, 에러 |
| src/pwa/app.js | 2712 | low | general-copy | <option value="all">전체</option> |
| src/pwa/app.js | 2713 | low | general-copy | <option value="unseen">안 본 카드</option> |
| src/pwa/app.js | 2714 | low | general-copy | <option value="confused">모르겠음 카드</option> |
| src/pwa/app.js | 2715 | low | general-copy | <option value="wrong_or_unseen">복습 우선</option> |
| src/pwa/app.js | 2719 | high | python-explainer | <button type="button" id="studyToolsApply">조건 적용</button> |
| src/pwa/app.js | 2720 | low | general-copy | <button type="button" id="studyToolsToday">오늘 10장 만들기</button> |
| src/pwa/app.js | 2721 | low | general-copy | <button type="button" id="studyToolsRandom" class="secondary">랜덤 1장</button> |
| src/pwa/app.js | 2722 | high | python-explainer | <button type="button" id="studyToolsClear" class="secondary">조건 초기화</button> |
| src/pwa/app.js | 2774 | high | python-explainer | 조건 일치 |
| src/pwa/app.js | 2774 | high | python-explainer | 장 / 전체 |
| src/pwa/app.js | 2774 | high | python-explainer | 장 · 본 카드 |
| src/pwa/app.js | 2774 | high | python-explainer | 장 · 모르겠음 |
| src/pwa/app.js | 2786 | high | python-explainer | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 2804 | high | python-explainer | 조건에 맞는 카드가 없습니다. |
| src/pwa/app.js | 2851 | low | general-copy | 긴 코드 펼치기 |
| src/pwa/app.js | 2854 | low | general-copy | 긴 코드 펼치기 |
| src/pwa/app.js | 2854 | low | general-copy | 긴 코드 접기 |
| src/pwa/app.js | 2973 | low | general-copy | 추천 L |
| src/pwa/app.js | 2973 | low | general-copy | · 안 본 |
| src/pwa/app.js | 2973 | low | general-copy | · 모르겠음 |
| src/pwa/app.js | 2973 | low | general-copy | · 맞힘 |
| src/pwa/app.js | 3019 | medium | app-ui | 설정 펼치기 |
| src/pwa/app.js | 3019 | medium | app-ui | 설정 접기 |
| src/pwa/app.js | 3035 | low | general-copy | 현재 |
| src/pwa/app.js | 3035 | low | general-copy | 전체 레벨 |
| src/pwa/app.js | 3036 | low | general-copy | · 추천 |
| src/pwa/app.js | 3036 | low | general-copy | 전체 |
| src/pwa/app.js | 3060 | low | general-copy | <button type="button" id="studyToolsRecommendStartV272">추천 진도로 오늘 10장</button> |
| src/pwa/app.js | 3061 | high | general-copy | <button type="button" id="studyToolsRecommendApplyV272" class="secondary">추천만 적용</button> |
| src/pwa/app.js | 3062 | medium | app-ui | <button type="button" id="studyToolsToggleV272" class="secondary">설정 펼치기</button> |
| src/pwa/app.js | 3163 | medium | app-ui | 설정 펼치기 |
| src/pwa/app.js | 3177 | medium | app-ui | 학습 설정 |
| src/pwa/app.js | 3281 | low | general-copy | 전체 |
| src/pwa/app.js | 3282 | low | general-copy | 추천 |
| src/pwa/app.js | 3282 | low | general-copy | · 남은 |
| src/pwa/app.js | 3282 | low | general-copy | · 큐 |
| src/pwa/app.js | 3304 | low | general-copy | 추천 10장 |
| src/pwa/app.js | 3309 | low | general-copy | 추천 적용 |
| src/pwa/app.js | 3315 | medium | app-ui | 설정 |
| src/pwa/app.js | 3315 | medium | app-ui | 접기 |
| src/pwa/index.html | 17 | low | general-copy | <div class="app-subtitle">코드 독해 반복훈련</div> |
| src/pwa/index.html | 19 | low | general-copy | <button id="resetBtn" class="ghost-btn">진도 초기화</button> |
| src/pwa/index.html | 23 | medium | app-ui | <button class="tab-btn active" data-view="learn">학습</button> |
| src/pwa/index.html | 24 | low | general-copy | <button class="tab-btn" data-view="outline">목차</button> |
| src/pwa/index.html | 25 | low | general-copy | <button class="tab-btn" data-view="progress">진행현황</button> |
| src/pwa/index.html | 26 | low | general-copy | <button class="tab-btn" data-view="notes">메모</button> |
| src/pwa/index.html | 27 | medium | app-ui | <button class="tab-btn" data-view="code">코드해석</button> |
| src/pwa/index.html | 28 | medium | unknown-action-ui | <button class="tab-btn" data-view="command">명령어해석</button> |
| src/pwa/index.html | 29 | low | general-copy | <button class="tab-btn" data-view="project">프로젝트분석</button> |
| src/pwa/index.html | 44 | low | general-copy | <summary>읽기 목표</summary> |
| src/pwa/index.html | 58 | low | general-copy | <button id="prevBtn">이전</button> |
| src/pwa/index.html | 59 | low | general-copy | <button id="againBtn">모르겠음</button> |
| src/pwa/index.html | 60 | low | general-copy | <button id="nextBtn">다음</button> |
| src/pwa/index.html | 65 | low | general-copy | <h2>사이드 카드</h2> |
| src/pwa/index.html | 68 | low | general-copy | <h2>프로젝트 연결</h2> |
| src/pwa/index.html | 71 | low | general-copy | <h2>현재 카드 메모</h2> |
| src/pwa/index.html | 72 | low | general-copy | 이 카드에서 헷갈린 점을 적어두세요. |
| src/pwa/index.html | 74 | high | javascript-explainer | <button id="saveCardMemoBtn">카드 메모 저장</button> |
| src/pwa/index.html | 82 | low | general-copy | <h1>전체 목차</h1> |
| src/pwa/index.html | 89 | low | general-copy | <h2 id="conceptTitle">개념을 선택하세요</h2> |
| src/pwa/index.html | 92 | low | general-copy | <h2>예시</h2> |
| src/pwa/index.html | 95 | low | general-copy | <h2>관련 카드</h2> |
| src/pwa/index.html | 98 | low | general-copy | <h2>개념 메모</h2> |
| src/pwa/index.html | 99 | low | general-copy | 이 개념에 대해 더 알아본 내용, 내 식의 설명, 헷갈린 점을 Markdown으로 적어두세요. |
| src/pwa/index.html | 101 | high | javascript-explainer | <button id="saveConceptMemoBtn">개념 메모 저장</button> |
| src/pwa/index.html | 108 | low | general-copy | <h1>진행현황</h1> |
| src/pwa/index.html | 116 | low | general-copy | <h1>내 메모</h1> |
| src/pwa/index.html | 117 | high | javascript-explainer | <span class="muted">이 메모는 현재 브라우저에만 저장됩니다.</span> |
| src/pwa/index.html | 121 | low | general-copy | <button id="refreshNotesBtn">메모 새로고침</button> |
| src/pwa/index.html | 122 | low | general-copy | <button id="downloadNotesBtn">Markdown 다운로드</button> |
| src/pwa/index.html | 132 | medium | app-ui | <div class="code-scope-note-title-v301">코드해석은 이런 때 쓰세요</div> |
| src/pwa/index.html | 135 | low | general-copy | <strong>잘하는 것</strong> |
| src/pwa/index.html | 137 | low | general-copy | <li>붙여넣은 코드를 초보자 눈높이로 순서대로 설명</li> |
| src/pwa/index.html | 138 | high | python-explainer | <li>Python 함수, 조건, 반복, 반환 흐름 요약</li> |
| src/pwa/index.html | 139 | high | javascript-explainer | <li>JavaScript 기본 함수, DOM, 이벤트 패턴 설명</li> |
| src/pwa/index.html | 140 | medium | app-ui | <li>설정파일과 짧은 코드의 대표 구조 설명</li> |
| src/pwa/index.html | 141 | medium | app-ui | <li>Mermaid 학습용 흐름도 초안 생성</li> |
| src/pwa/index.html | 145 | low | general-copy | <strong>한계</strong> |
| src/pwa/index.html | 147 | low | general-copy | <li>모든 언어를 완전 파싱하는 도구는 아님</li> |
| src/pwa/index.html | 148 | low | general-copy | <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li> |
| src/pwa/index.html | 149 | medium | unknown-action-ui | <li>터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합</li> |
| src/pwa/index.html | 150 | low | general-copy | <li>프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합</li> |
| src/pwa/index.html | 159 | medium | app-ui | <h1>코드해석</h1> |
| src/pwa/index.html | 160 | medium | unknown-action-ui | <p class="muted">PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.</p> |
| src/pwa/index.html | 168 | low | general-copy | <label for="codeLangSelect">언어</label> |
| src/pwa/index.html | 170 | low | general-copy | <option value="auto">자동 감지</option> |
| src/pwa/index.html | 182 | medium | app-ui | <option value="yaml">YAML 일반 설정</option> |
| src/pwa/index.html | 185 | medium | app-ui | <option value="ini_file">INI 설정</option> |
| src/pwa/index.html | 186 | medium | app-ui | <option value="toml">TOML 일반 설정</option> |
| src/pwa/index.html | 188 | low | general-copy | <button id="loadCodeSampleBtn" type="button">선택 언어 예제</button> |
| src/pwa/index.html | 189 | low | general-copy | <button id="analyzeCodeBtn" type="button">분석하기</button> |
| src/pwa/index.html | 192 | high | general-copy | <p id="codeLangHint" class="code-lang-hint">언어를 고른 뒤 “선택 언어 예제”를 누르면 해당 언어 예제가 들어갑니다.</p> |
| src/pwa/index.html | 193 | high | general-copy | <div id="codeDetectionDetails" class="code-detection-details muted">분석하면 자동감지 결과와 판단 근거가 표시됩니다.</div> |
| src/pwa/index.html | 195 | medium | unknown-action-ui | 여기에 PowerShell, Python, JavaScript, Workers, Java, package.json, GitHub Actions YAML 코드를 붙여넣으세요. |
| src/pwa/index.html | 198 | low | general-copy | <button id="clearCodeBtn" type="button">입력 지우기</button> |
| src/pwa/index.html | 199 | medium | app-ui | <button id="copyMermaidBtn" type="button">흐름도 코드 복사</button> |
| src/pwa/index.html | 200 | medium | app-ui | <button id="copyCodeReportBtn" type="button">텍스트 리포트 복사</button> |
| src/pwa/index.html | 203 | low | general-copy | 위험/주의 단계만 보기 |
| src/pwa/index.html | 209 | low | general-copy | <h2>종합 해설</h2> |
| src/pwa/index.html | 210 | low | general-copy | <div id="codeSummary" class="code-summary muted">아직 분석한 코드가 없습니다.</div> |
| src/pwa/index.html | 211 | high | general-copy | <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div> |
| src/pwa/index.html | 212 | medium | unknown-action-ui | <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div> |
| src/pwa/index.html | 213 | high | general-copy | <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div> |
| src/pwa/index.html | 214 | high | general-copy | <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div> |
| src/pwa/index.html | 215 | medium | unknown-action-ui | <h2>주의/위험 명령</h2> |
| src/pwa/index.html | 216 | medium | unknown-action-ui | <div id="codeWarnings" class="code-warnings muted">위험 명령이 감지되면 여기에 표시됩니다.</div> |
| src/pwa/index.html | 217 | low | general-copy | <h2>각 부분별 해설</h2> |
| src/pwa/index.html | 220 | medium | app-ui | <h2>해석 후 더 읽어보기 <span class="code-related-subtitle">사이드카드 보충</span></h2> |
| src/pwa/index.html | 221 | high | general-copy | <div id="codeRelatedCards" class="code-related-cards muted">분석 결과와 연결되는 보충 사이드카드가 있으면 여기에 표시됩니다.</div> |
| src/pwa/index.html | 226 | low | general-copy | <h2>Mermaid 흐름도</h2> |
| src/pwa/index.html | 227 | low | general-copy | <span id="diagramStatus" class="muted">분석 후 생성됩니다.</span> |
| src/pwa/index.html | 229 | high | general-copy | <p class="code-diagram-hint">흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.</p> |
| src/pwa/index.html | 232 | low | general-copy | <button id="openLargeDiagramBtn" type="button">크게 보기</button> |
| src/pwa/index.html | 233 | low | general-copy | <button id="downloadDiagramSvgBtn" type="button">SVG 다운로드</button> |
| src/pwa/index.html | 234 | medium | app-ui | <button id="copyDiagramSvgBtn" type="button">SVG 원문 복사</button> |
| src/pwa/index.html | 238 | low | general-copy | <summary>Mermaid 원문 보기</summary> |
| src/pwa/index.html | 254 | medium | unknown-action-ui | <h1>명령어해석</h1> |
| src/pwa/index.html | 255 | medium | unknown-action-ui | <p class="muted">PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.</p> |
| src/pwa/index.html | 263 | low | general-copy | <label for="commandShellSelect">셸</label> |
| src/pwa/index.html | 268 | low | general-copy | <label for="commandSampleSelect">예제</label> |
| src/pwa/index.html | 270 | low | general-copy | <option value="auto_by_shell">현재 셸 기본 예제</option> |
| src/pwa/index.html | 271 | high | javascript-explainer | <option value="git_save_flow">Git 저장 흐름</option> |
| src/pwa/index.html | 272 | medium | unknown-action-ui | <option value="danger_delete_flow">위험 삭제 명령</option> |
| src/pwa/index.html | 273 | low | general-copy | <option value="venv_run_flow">가상환경 실행</option> |
| src/pwa/index.html | 274 | low | general-copy | <option value="verify_commit_flow">검증/커밋 루틴</option> |
| src/pwa/index.html | 275 | low | general-copy | <option value="bash_git_save_flow">Bash Git 흐름</option> |
| src/pwa/index.html | 276 | low | general-copy | <option value="bash_venv_run_flow">Bash 가상환경 실행</option> |
| src/pwa/index.html | 278 | high | javascript-explainer | <button id="loadCommandSampleBtn" type="button">선택 예제 불러오기</button> |
| src/pwa/index.html | 279 | medium | unknown-action-ui | <button id="analyzeCommandBtn" type="button">명령어 분석</button> |
| src/pwa/index.html | 282 | medium | unknown-action-ui | <p id="commandModeHint" class="code-lang-hint">명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.</p> |
| src/pwa/index.html | 283 | high | general-copy | <div id="commandSampleDescription" class="command-sample-description-v289 muted">예제를 선택하면 어떤 흐름을 연습하는지 여기에 표시됩니다.</div> |
| src/pwa/index.html | 284 | medium | unknown-action-ui | 여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status |
| src/pwa/index.html | 287 | low | general-copy | <button id="clearCommandBtn" type="button">입력 지우기</button> |
| src/pwa/index.html | 292 | medium | unknown-action-ui | <h2>명령어 요약</h2> |
| src/pwa/index.html | 293 | medium | unknown-action-ui | <div id="commandSummary" class="code-summary muted">아직 분석한 명령어가 없습니다.</div> |
| src/pwa/index.html | 295 | medium | unknown-action-ui | <h2>위험/주의 명령</h2> |
| src/pwa/index.html | 296 | medium | unknown-action-ui | <div id="commandWarnings" class="code-warnings muted">위험 명령이 감지되면 여기에 표시됩니다.</div> |
| src/pwa/index.html | 298 | low | general-copy | <h2>작업 순서</h2> |
| src/pwa/index.html | 301 | medium | unknown-action-ui | <h2>다음 확인 명령어</h2> |
| src/pwa/index.html | 302 | medium | unknown-action-ui | <div id="commandNextChecks" class="code-related-cards muted">분석 후 추천 확인 명령이 표시됩니다.</div> |
| src/pwa/index.html | 313 | low | general-copy | <h1>프로젝트분석</h1> |
| src/pwa/index.html | 314 | medium | unknown-action-ui | <p class="muted">로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.</p> |
| src/pwa/index.html | 321 | low | general-copy | <h2>1. 프로젝트 루트 입력</h2> |
| src/pwa/index.html | 322 | low | general-copy | <p class="muted">예: D:\projects\python-reading-trainer</p> |
| src/pwa/index.html | 325 | medium | unknown-action-ui | <button id="generateProjectProbeBtn" type="button">명령 생성</button> |
| src/pwa/index.html | 328 | medium | unknown-action-ui | <h2>2. 생성된 PowerShell 명령</h2> |
| src/pwa/index.html | 329 | medium | unknown-action-ui | <p class="muted">아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.</p> |
| src/pwa/index.html | 331 | medium | unknown-action-ui | <button id="copyProjectProbeCommandBtn" type="button">명령 복사</button> |
| src/pwa/index.html | 332 | low | general-copy | <button id="clearProjectAnalyzerBtn" type="button">초기화</button> |
| src/pwa/index.html | 334 | medium | unknown-action-ui | <pre id="projectProbeCommand" class="code-block project-command-box">프로젝트 루트를 입력하고 “명령 생성”을 누르세요.</pre> |
| src/pwa/index.html | 338 | medium | unknown-action-ui | <h2>3. 터미널 출력 붙여넣기</h2> |
| src/pwa/index.html | 339 | medium | unknown-action-ui | 최신 probe 터미널 출력(PROJECT_PROBE_V248_OK 또는 PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, 또는 JSON 전체 내용을 붙여넣으세요. |
| src/pwa/index.html | 341 | low | general-copy | <button id="analyzeProjectProbeBtn" type="button">붙여넣은 결과 분석</button> |
| src/pwa/index.html | 346 | low | general-copy | <h2>5. 분석 요약</h2> |
| src/pwa/index.html | 347 | high | general-copy | <div id="projectAnalysisSummary" class="project-analysis-summary muted">아직 분석 결과가 없습니다.</div> |
| src/pwa/index.html | 353 | low | general-copy | <h2>4. 구조도</h2> |
| src/pwa/index.html | 354 | low | general-copy | <span id="projectDiagramStatus" class="muted">분석 후 표시됩니다.</span> |
| src/pwa/index.html | 358 | low | general-copy | <summary>프로젝트 Mermaid 원문 보기</summary> |
| src/pwa/index.html | 369 | low | general-copy | <h2 id="diagramLargeTitle">Mermaid 흐름도 크게 보기</h2> |
| src/pwa/index.html | 370 | low | general-copy | 큰 흐름도 닫기 |
| index.html | 51 | medium | app-ui | <p>학습 앱으로 이동하고 있습니다.</p> |
| index.html | 52 | high | javascript-explainer | <p>자동으로 이동하지 않으면 아래 버튼을 누르세요.</p> |
| index.html | 53 | medium | app-ui | <a href="./src/pwa/">학습 앱 열기</a> |
