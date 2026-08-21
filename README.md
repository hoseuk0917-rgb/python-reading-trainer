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

## 현재 릴리즈: V400.3

V400 계열의 핵심 기능:

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
- Form A 최초 진단 → 진단 결과 기반 맞춤학습 → Checkpoint → 재학습 → Form B 최종 재진단
- 학습 / 실전 / 진행 / 더보기의 4개 primary navigation
- Developer Mode / Admin Mode는 로컬 개발 환경에서 사용

V400.3에서는 모바일 첫 화면과 배포 캐시 계약을 다시 정리했습니다.

- 루트 페이지가 별도 안내 화면을 먼저 그리지 않고 PWA로 바로 이동
- 예전 큰 진단 카드를 먼저 그린 뒤 compact 카드로 덮던 이중 렌더 제거
- consumer shell 준비 전 legacy 화면을 숨겨 초기 번쩍임 억제
- service worker cache를 V400.3으로 승격
- 핵심 UI CSS/JS는 온라인에서 network-first로 최신본 우선
- 새 service worker 활성화 시 현재 탭을 새 release key로 한 번 갱신
- 하단 네비게이션을 작은 SVG 아이콘 + 얇은 active indicator 방식으로 정리
- 진단 홈/버튼/3단계 트랙을 모바일 밀도에 맞게 축소
- KO/EN 모바일 typography 보정
- 공개 Pages의 원격 Admin 진입/우회 shim 제거

## 진단 시작

`학습` 홈에서 compact 진단 안내를 사용할 수 있습니다.

처음에 넘겼더라도:

`더보기 → 진단`

으로 언제든 다시 진단 화면에 들어갈 수 있습니다.

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

## Admin / Developer

**공개 GitHub Pages에서는 Admin/Developer 진입을 제공하지 않습니다.**

GitHub 앱이 휴대폰에 설치되어 있다는 사실만으로 정적 Pages가 사용자를 안전하게 인증할 수 없기 때문입니다. 원격 관리가 필요하면 별도 인증 계층을 붙여야 합니다.

현재 Admin/Developer는 로컬 개발 환경에서만 사용합니다.

로컬 실행 예:

```powershell
Set-Location D:\projects\python-reading-trainer
python -m http.server 8000
```

브라우저:

```text
http://127.0.0.1:8000/
```

Developer Mode는 로컬 authority 계약을 사용하고, Admin은 해당 Developer authority가 허용된 환경에서 진입합니다.

## PWA / 캐시

V400.3의 배포 정책:

- HTML navigation과 학습 JSON은 network-first
- consumer UI와 release polish 핵심 CSS/JS도 network-first
- 나머지 정적 자산은 stale-while-revalidate
- 오프라인에서는 설치된 cache를 fallback으로 사용
- release가 바뀌면 이전 V400 cache를 제거
- 설치형 PWA의 start URL에도 V400.3 release key를 포함

Mermaid는 외부 CDN을 사용하므로 완전 오프라인 상태에서는 일부 흐름도 기능이 제한될 수 있습니다.

## 저장 데이터

학습 진도, 메모, 진단 결과, staged draft 등은 기본적으로 현재 브라우저의 Local/Session Storage에 저장됩니다.

Admin/Developer 기능이 production lesson JSON을 브라우저에서 직접 덮어쓰지는 않습니다. Developer Mode는 검증된 patch/export workflow를 사용합니다.

## 주요 경로

- `src/pwa/` — PWA UI와 런타임
- `data/` — KO 학습/진단 데이터
- `data_i18n/en/` — EN 학습/진단 데이터
- `tools/` — validation, audit, browser smoke 도구
- `.github/workflows/` — 자동 품질 gate
- `docs/` — 설계·감사 기록

## 품질 gate

`main`과 `main` 대상 PR에서는 V400 release gate가 다음을 확인합니다.

- 핵심 JavaScript syntax
- JSON/릴리즈 wiring
- 1,785 lesson validation
- V400 release polish 계약
- diff integrity
