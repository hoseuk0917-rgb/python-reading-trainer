# Python Reading Trainer

Python 코드를 **작성하는 법보다 읽는 법**을 반복 훈련하는 모바일 우선 학습 앱입니다.

- 코드 한 줄과 작은 블록의 의미 읽기
- 값·조건·반복·함수·파일·객체·데이터 처리 흐름 추적
- 프로젝트 코드의 입력 → 처리 → 출력 구조 이해
- 진단 결과 기반 맞춤학습
- 코드/명령어/프로젝트 구조 해석
- KO/EN 학습 데이터 지원

## 바로 실행

GitHub Pages: https://hoseuk0917-rgb.github.io/python-reading-trainer/

모바일 브라우저에서 열어 그대로 학습하거나 홈 화면에 추가할 수 있습니다.

## 현재 릴리즈: V400.1

V400 계열에서 다음 기능을 통합했습니다.

- 1,785개 KO 학습 카드 + 1,785개 EN 카드
- 8축 Python 독해 진단
  - 값·대입 추적
  - 조건·분기
  - 반복·컬렉션
  - 함수 호출·반환
  - 파일·예외·경로
  - 객체·모듈
  - 데이터 처리
  - 프로젝트 코드 흐름
- Form A 최초 진단 → 진단 결과 기반 10장 맞춤학습 → Checkpoint → 재학습 → Form B 최종 재진단
- 학습 / 실전 / 진행 / 더보기의 4개 primary navigation
- Developer Mode
- Admin Mode
- 모바일·데스크톱 브라우저 회귀 검증

V400.1에서는 릴리즈 마감 품질을 보강했습니다.

- 학습 홈에서 `내 수준부터 확인해볼까요?` 진단 안내가 더 이상 사라지지 않음
- 모바일 GitHub Pages용 읽기 전용 Admin 진입
- V400 cache-buster 정리
- PWA manifest/icon/service worker 보강
- `main`/release branch용 GitHub Actions gate 추가

## 진단 시작

앱의 `학습` 홈 상단에 진단 안내가 표시됩니다. 이를 지나쳤더라도 다시 학습 홈으로 돌아오면 계속 확인할 수 있습니다.

또는:

`더보기 → 진단`

으로 언제든 진단 화면을 열 수 있습니다.

## 폰에서 관리자 모드 열기

GitHub Pages 주소 뒤에 `?admin=1`을 붙입니다.

https://hoseuk0917-rgb.github.io/python-reading-trainer/?admin=1

V400.1에서는 위 주소의 query string을 실제 PWA까지 보존하며, Admin 화면을 자동으로 엽니다. 닫은 뒤에는 우측 상단 `⋯` 메뉴의 `관리자`로 다시 열 수 있습니다.

**중요:** 폰 원격 Admin은 콘텐츠 검색·상태 확인용 읽기 전용 운영 화면입니다. 실제 카드 편집과 export를 위한 Developer Mode 권한은 원격 Admin과 분리되어 있으며 로컬 개발 환경 또는 별도 인증이 필요합니다.

## 일반 사용자 메뉴

항상 보이는 메뉴는 네 개만 유지합니다.

- 학습
- 실전
- 진행
- 더보기

`더보기`에는 다음 기능이 있습니다.

- 진단
- 목차
- 메모
- 코드해석
- 명령어해석
- 프로젝트분석

## 로컬 실행

PowerShell:

```powershell
Set-Location D:\projects\python-reading-trainer
python -m http.server 8000
```

브라우저:

http://127.0.0.1:8000/

로컬에서는 Developer/Admin 개발 기능을 사용할 수 있습니다.

## PWA / 오프라인

V400.1부터 manifest에 앱 아이콘과 maskable 아이콘을 등록하고 service worker를 사용합니다.

- 앱 shell과 주요 JS/CSS는 캐시됩니다.
- JSON 학습 데이터는 **network-first**로 최신본을 우선하고 오프라인일 때 캐시를 사용합니다.
- Mermaid는 외부 CDN을 사용하므로 완전 오프라인 상태에서는 일부 흐름도 기능이 제한될 수 있습니다.

## 저장 데이터

학습 진도, 메모, 진단 결과, staged draft 등은 기본적으로 현재 브라우저의 Local/Session Storage에 저장됩니다.

Admin/Developer 기능이 production JSON을 브라우저에서 직접 덮어쓰지는 않습니다. Developer Mode는 검증된 patch/export workflow를 사용합니다.

## 주요 경로

- `src/pwa/` — PWA UI와 런타임
- `data/` — KO 학습/진단 데이터
- `data_i18n/en/` — EN 학습/진단 데이터
- `tools/` — validation, audit, browser smoke 도구
- `.github/workflows/` — 자동 품질 gate
- `docs/` — 설계·감사 기록

## 품질 기준

V400 통합 시 다음 회귀를 실제 브라우저에서 봉인했습니다.

- KO/EN 진단
- 진단 후 맞춤학습 / checkpoint / retest
- desktop/mobile consumer navigation
- Admin authorized/unauthorized regression
- Developer export safety regression
- production data 변경 범위와 Git diff integrity

V400.1 이후 `main` 변경에는 `.github/workflows/v400-release.yml`의 정적·데이터 품질 gate를 사용합니다.

## 프로젝트 정체성

Python Reading Trainer는 문법 암기나 빈 화면 코딩 시험보다 다음 능력을 우선합니다.

1. 코드를 읽는다.
2. 값과 실행 흐름을 따라간다.
3. 함수와 모듈의 역할을 추론한다.
4. 프로젝트의 입력·처리·출력 구조를 파악한다.
5. 위험·누락·수정 지점을 찾는다.
6. 개발자나 코드 에이전트에게 더 정확하게 지시한다.

과거 V200~V399 개발 기록은 Git history와 `docs/`의 감사 자료에서 확인할 수 있습니다.
