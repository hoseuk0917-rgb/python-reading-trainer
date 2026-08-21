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

## 현재 릴리즈: V400.7

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
- GitHub 본인 인증 기반 원격 Developer 콘텐츠 워크벤치
- localhost 전용 Admin Mode

### V400.7 Hardening

V400.7은 기능 추가보다 장시간 모바일 사용과 배포 안정성을 강화하는 릴리즈입니다.

- Developer 메뉴의 상시 body-wide `MutationObserver`와 polling 제거
- release polish의 자기 DOM 변경 재감지 구조 제거
- Developer workbench/원격 진입/모바일 종료 파일을 release gate syntax 검사에 포함
- 공개 Pages에서 Admin CSS/JS를 직접 로드하지 않고 localhost에서만 동적 로드
- KO/EN 1,785개 학습카드 공통 semantic validation 추가
- KO/EN 진단 stage·8축·문항·정답 구조 parity validation 추가
- root / manifest / service worker / Developer loader cache key를 V400.7로 통일
- 최근 Developer/Auth 런타임 파일을 service worker의 critical UI 계약에 포함

V400.6의 브랜드 splash도 그대로 유지합니다.

- 브랜드 문구: **코드를 쓰기 전에, 읽는 힘부터.**
- EN 문구: **Read code first. Write with confidence.**
- 열린 책 + 코드 괄호를 결합한 Python Reading Trainer 전용 심볼
- 학습 데이터가 준비되는 동안 브랜드 화면과 짧은 progress line 표시
- 데이터가 준비되는 즉시 splash 종료: 별도 최소 노출시간 없음
- splash와 PWA 일반/마스커블 아이콘을 같은 브랜드 심볼로 통일

V400.5의 로딩 최적화도 유지합니다.

- 98개 lesson JSON을 KO/EN별 runtime lesson bundle 1개로 통합
- side-card/reference/resource JSON도 KO/EN별 support bundle 1개로 통합
- `app.js` 바로 직전의 `content_quality_semantics.js`에서 lesson/support bundle을 동시에 다운로드 시작
- 기존 `app.js`의 파일별 응답 계약은 유지하고 개별 네트워크 요청을 memory bundle 응답으로 대체
- bundle이 없거나 검증에 실패하면 기존 개별 JSON fetch로 자동 fallback
- lesson bundle은 KO/EN 각각 1,785장 전체를 담아 총량·정렬·진도 계약 유지

## 진단 시작

`학습` 홈의 진단 안내 또는 아래 경로를 사용합니다.

`더보기 → 진단`

처음에 넘겼더라도 언제든 다시 진단 화면에 들어갈 수 있습니다.

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
- Developer

## Admin / Developer

### Developer

공개 GitHub Pages에서는 `더보기 → Developer`로 진입합니다.

- 미인증 상태에서는 GitHub OAuth 본인 인증을 거칩니다.
- 허용된 GitHub 계정만 원격 Developer authority를 얻습니다.
- 인증 후에는 콘텐츠 검색·필터·현재값/초안 비교·기본 검증·staged draft 저장·고급 편집기 이동을 사용할 수 있습니다.
- production lesson JSON을 브라우저에서 직접 덮어쓰지 않습니다.
- staged draft와 편집 상태는 브라우저 저장소를 사용합니다.

localhost에서는 외부 OAuth 없이 로컬 Developer authority를 사용할 수 있습니다.

### Admin

Admin Mode는 **localhost 전용**입니다.

공개 Pages 진입 HTML은 `admin_mode_v1.css`와 `admin_mode_v1.js`를 직접 로드하지 않습니다. `admin_local_loader_v400_7.js`가 localhost에서만 해당 자산을 동적으로 로드합니다.

로컬 실행 예:

```powershell
Set-Location D:\projects\python-reading-trainer
python -m http.server 8000
```

브라우저:

```text
http://127.0.0.1:8000/
```

## PWA / 캐시

V400.7의 배포 정책:

- HTML navigation과 핵심 consumer/Developer UI는 network-first
- 브랜드 splash와 PWA 아이콘 유지
- runtime lesson/support bundle은 service worker의 데이터 cache로 재사용
- 나머지 학습 JSON도 stale-while-revalidate fallback 유지
- 오프라인에서는 설치된 cache를 fallback으로 사용
- release가 바뀌면 이전 V400 cache 내용을 새 cache로 마이그레이션한 뒤 정리
- service worker 갱신을 위해 사용 중인 화면을 강제 reload하지 않음
- 설치형 PWA의 start URL에 V400.7 release key 포함

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

- 핵심 및 최근 Developer JavaScript syntax
- JSON/릴리즈 wiring
- KO/EN runtime bundle 원본 일치
- KO legacy lesson validation
- KO/EN 1,785장 bilingual semantic validation
- KO/EN 진단 parity validation
- 브랜드 splash / PWA icon / cache 계약
- 공개 Admin 정적 로딩 차단 + localhost loader 계약
- Developer observer/polling hardening 계약
- diff integrity
