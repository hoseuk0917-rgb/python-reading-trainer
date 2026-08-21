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

## 현재 릴리즈: V400.6

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

V400.6에서는 앱 첫 인상을 브랜드 splash로 정리했습니다.

- 브랜드 문구: **코드를 쓰기 전에, 읽는 힘부터.**
- EN 문구: **Read code first. Write with confidence.**
- 열린 책 + 코드 괄호를 결합한 Python Reading Trainer 전용 심볼
- 학습 데이터가 준비되는 동안 브랜드 화면과 짧은 progress line 표시
- 데이터가 준비되는 즉시 splash 종료: 별도 최소 노출시간 없음
- splash와 PWA 일반/마스커블 아이콘을 같은 브랜드 심볼로 통일
- 기존 compact loader는 brand splash가 동작하는 경우 중복 표시하지 않음

V400.5의 로딩 최적화도 그대로 유지합니다.

- 98개 lesson JSON을 KO/EN별 runtime lesson bundle 1개로 통합
- side-card/reference/resource JSON도 KO/EN별 support bundle 1개로 통합
- `app.js` 바로 직전의 `content_quality_semantics.js`에서 lesson/support bundle을 동시에 다운로드 시작
- 기존 `app.js`의 파일별 응답 계약은 유지하고 개별 네트워크 요청을 memory bundle 응답으로 대체
- bundle이 없거나 검증에 실패하면 기존 개별 JSON fetch로 자동 fallback
- lesson bundle은 KO/EN 각각 1,785장 전체를 담아 총량·정렬·진도 계약 유지
- 공개 Pages의 Admin/Developer 진입은 계속 비활성화

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

V400.6의 배포 정책:

- HTML navigation과 핵심 consumer UI/runtime preloader는 network-first
- 브랜드 splash와 아이콘은 V400.6 cache key로 갱신
- runtime lesson/support bundle은 service worker의 데이터 cache로 재사용
- 나머지 학습 JSON도 stale-while-revalidate fallback 유지
- 오프라인에서는 설치된 cache를 fallback으로 사용
- release가 바뀌면 이전 V400 cache 내용을 새 cache로 마이그레이션한 뒤 정리
- service worker 갱신을 위해 사용 중인 화면을 강제 reload하지 않음
- 설치형 PWA의 start URL에 V400.6 release key 포함

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
- KO/EN runtime bundle 원본 일치
- 1,785 lesson validation
- 브랜드 splash / PWA icon / cache 계약
- 공개 Admin 차단
- diff integrity
