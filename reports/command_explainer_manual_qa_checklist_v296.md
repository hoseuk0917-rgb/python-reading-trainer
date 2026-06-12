# V296 명령어해석 실제 화면 수동 점검 체크리스트

AUDIT_COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1

- 앱 버전: 20260611_v296_a1
- 총평: PASS
- 목적: 자동 검증으로 잡기 어려운 실제 화면/브라우저 사용성을 사람이 확인하기 위한 체크리스트

## 1. 결론

- V296은 기능 추가보다 실제 화면 수동 점검 절차를 고정하는 버전이다.
- V288~V295에서 추가된 예제, 안전 체크리스트, 그룹 UI, 이유 설명, 예제 안전 그룹 안내가 브라우저에서 자연스럽게 보이는지 확인한다.
- 이 리포트는 다음 배포 전 수동 QA 기준표로 사용한다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v296_a1 |
| root index version | Y | 20260611_v296_a1 |
| command script version | Y | script cache busting |
| V296 marker | Y | manual QA marker |
| V296 version marker | Y | version marker |
| visible version V296 | Y | visible version |
| V288~V295 markers kept | Y | lineage markers kept |
| manual checklist groups | Y | 진입 / 버전 / 예제 전환 / 위험 명령 체크리스트 / 복사 / 사용성 / 모바일 폭 / 회귀 확인 |
| manual checklist item count | Y | 25 |
| manual checklist covers mobile | Y | mobile width covered |
| manual checklist covers copy | Y | copy covered |
| manual checklist covers danger | Y | danger command covered |
| manual checklist covers regression | Y | regression covered |

# 수동 점검표

## 진입 / 버전

- [ ] 브라우저에서 명령어해석 메뉴가 열린다.
- [ ] 명령어해석 배지가 V296으로 보인다.
- [ ] 기존 카드/학습 메뉴 이동이 깨지지 않는다.

## 예제 전환

- [ ] PowerShell 예제를 불러오면 입력창에 PowerShell 명령이 들어간다.
- [ ] Bash 예제를 불러오면 입력창에 Bash 명령이 들어간다.
- [ ] 예제 설명 박스에 예제 이름, 셸 종류, 학습 목적이 보인다.
- [ ] 위험 예제에는 이 예제에서 뜨는 안전 체크 그룹 배지가 보인다.
- [ ] 안전한 Git 저장 예제에는 불필요한 안전 체크 그룹 안내가 뜨지 않는다.

## 위험 명령 체크리스트

- [ ] Remove-Item / rm -rf 예제에서 삭제 계열 그룹이 보인다.
- [ ] git clean 예제에서 git clean -nd, git clean -ndx 사전 확인 명령이 보인다.
- [ ] git reset --hard 예제에서 백업 브랜치 생성 명령이 보인다.
- [ ] sudo 예제에서 whoami, groups, sudo -l 확인 명령이 보인다.
- [ ] 각 그룹에 왜 먼저? 설명이 보인다.

## 복사 / 사용성

- [ ] 전체 체크리스트 복사 버튼이 보인다.
- [ ] 복사 버튼을 누르면 안전 체크리스트 전체를 복사할 수 있다.
- [ ] 그룹별 코드블록은 줄바꿈이 유지되어 읽을 수 있다.
- [ ] 입력 지우기 후 예제 설명/결과 영역이 이상하게 남지 않는다.

## 모바일 폭

- [ ] 브라우저 폭을 640px 이하로 줄여도 그룹 카드가 화면 밖으로 넘치지 않는다.
- [ ] 안전 체크 그룹 배지가 줄바꿈되어 보인다.
- [ ] 코드블록이 좁은 화면에서도 읽을 수 있다.
- [ ] 버튼과 배지 간격이 너무 붙지 않는다.

## 회귀 확인

- [ ] PowerShell 분석 결과 단계가 정상 표시된다.
- [ ] Bash 분석 결과 단계가 정상 표시된다.
- [ ] V288~V295에서 추가한 예제/안전/그룹/이유/회귀 감사 기능이 유지된다.
- [ ] 브라우저 콘솔에 치명적인 JavaScript 오류가 없다.

## 권장 수동 점검 순서

1. 데스크톱 폭에서 명령어해석 메뉴 진입
2. PowerShell 안전 예제, 위험 예제, Bash 예제 순서로 전환
3. 위험 예제 분석 후 안전 체크리스트 그룹/이유/복사 버튼 확인
4. 브라우저 폭을 640px 이하로 줄이고 모바일 표시 확인
5. 콘솔 오류 확인

## 다음 단계

- V297에서는 수동 점검 결과를 반영해 실제 UI 문구나 여백만 미세 조정한다.
- 기능 추가는 수동 점검에서 문제가 없을 때 진행한다.
