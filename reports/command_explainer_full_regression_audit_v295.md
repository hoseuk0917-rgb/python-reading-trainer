# V295 명령어해석 전체 회귀 감사 리포트

AUDIT_COMMAND_EXPLAINER_FULL_REGRESSION_V295_A1

- 앱 버전: 20260611_v295_a1
- 총평: PASS
- 감사 범위: V288 예제 프리셋, V289 예제 설명, V290 안전 체크리스트, V291 정밀 체크, V292 그룹 UI, V293 이유 설명, V294 예제 안전 그룹 안내

## 1. 결론

- V295는 명령어해석 메뉴의 안전/예제 관련 기능을 한 번에 검증하는 전체 회귀 감사 버전이다.
- PowerShell/Bash 분석, 위험 명령 체크리스트, 그룹 UI, 복사 버튼, 모바일 CSS, 예제 설명 안전 그룹 안내를 함께 확인한다.
- 새 UI 기능을 추가하지 않고 현재 안정 상태를 감사 리포트와 검증 스크립트로 고정한다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v295_a1 |
| root index version | Y | 20260611_v295_a1 |
| command script version | Y | script cache busting |
| V295 marker | Y | full regression marker |
| V295 version marker | Y | version marker |
| visible version V295 | Y | visible version |
| V288 marker kept | Y | sample preset lineage |
| V289 marker kept | Y | sample description lineage |
| V290 marker kept | Y | safety checklist lineage |
| V291 marker kept | Y | danger precision lineage |
| V292 marker kept | Y | grouped UI lineage |
| V293 marker kept | Y | group reason lineage |
| V294 marker kept | Y | sample safety hint lineage |
| PowerShell analyzer | Y | steps=5 |
| Bash analyzer | Y | steps=6 |
| beginner/git wording enhancers | Y | enhanced results available |
| V290 safety checklist PowerShell | Y | Get-Location / git status --short / git diff --check / git branch --show-current |
| V290 safety checklist Bash | Y | pwd / git status --short / git diff --check / git branch --show-current |
| V291 PowerShell precision | Y | git clean/reset backup precision |
| V291 Bash precision | Y | sudo/reset backup precision |
| V292 PowerShell groups | Y | 공통 확인 / 삭제 계열 / Git 복구 계열 |
| V292 Bash groups | Y | 공통 확인 / 삭제 계열 / Git 복구 계열 / 권한 계열 |
| V292 grouped HTML | Y | grouped checklist HTML |
| copy button/source | Y | copy button/source preserved |
| mobile/group CSS | Y | mobile grouped css |
| V293 group reasons meta | Y | all group reasons exist |
| V293 reason HTML | Y | reason HTML |
| V294 dangerous sample hint | Y | 공통 확인 / 삭제 계열 |
| V294 bash sample hint | Y | 공통 확인 / 삭제 계열 / 권한 계열 |
| V294 safe sample no hint | Y | safe sample groups=0 |
| sample/catalog exports | Y | V288/V289 exports |
| safety exports | Y | V290/V292 exports |
| V293/V294 exports | Y | reason/sample safety exports |

## 3. PowerShell 안전 체크리스트 그룹

### 공통 확인

- 설명: 현재 위치, 브랜치, Git 변경 상태를 먼저 확인합니다.
- 왜 먼저?: 현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다.

```text
Get-Location
git status --short
git diff --check
git branch --show-current
```

### 삭제 계열

- 설명: 파일이나 폴더가 실제로 무엇인지, 몇 개인지, 얼마나 큰지 확인합니다.
- 왜 먼저?: 삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다.

```text
Test-Path ".tmp"
Get-Item -Force ".tmp"
Get-ChildItem -Force ".tmp" | Select-Object -First 20
(Get-ChildItem -Force ".tmp" -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
git clean -nd
git clean -ndx
```

### Git 복구 계열

- 설명: 되돌리기 전에 최근 커밋과 백업 브랜치를 확인합니다.
- 왜 먼저?: reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다.

```text
git log --oneline -5
$backupBranch = "backup/before-reset-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
git branch --list "backup/before-reset-*"
```

## 4. Bash 안전 체크리스트 그룹

### 공통 확인

- 설명: 현재 위치, 브랜치, Git 변경 상태를 먼저 확인합니다.
- 왜 먼저?: 현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다.

```text
pwd
git status --short
git diff --check
git branch --show-current
```

### 삭제 계열

- 설명: 파일이나 폴더가 실제로 무엇인지, 몇 개인지, 얼마나 큰지 확인합니다.
- 왜 먼저?: 삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다.

```text
test -e ".tmp" && echo "target exists"
ls -la ".tmp"
find ".tmp" -maxdepth 2 -print | head -50
du -sh ".tmp" 2>/dev/null
git clean -nd
git clean -ndx
```

### Git 복구 계열

- 설명: 되돌리기 전에 최근 커밋과 백업 브랜치를 확인합니다.
- 왜 먼저?: reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다.

```text
git log --oneline -5
backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)"
git branch "$backup_branch"
git branch --list "backup/before-reset-*"
```

### 권한 계열

- 설명: 관리자 권한 실행 전 현재 사용자와 권한 범위를 확인합니다.
- 왜 먼저?: sudo 같은 권한 명령은 시스템 범위에 영향을 줄 수 있어서 실행 주체를 먼저 확인해야 합니다.

```text
whoami
groups
sudo -l
```

## 5. 예제 안전 그룹 요약

| sample | safety groups |
|---|---|
| danger_delete_flow / PowerShell | 공통 확인 / 삭제 계열 |
| auto_by_shell / Bash | 공통 확인 / 삭제 계열 / 권한 계열 |
| git_save_flow / PowerShell | 안전 그룹 없음 |

## 6. 다음 단계

- V296에서는 기능 추가보다 실제 화면 수동 점검 체크리스트를 추가하는 것이 좋다.
- 수동 점검 항목: 모바일 폭, 예제 전환, 복사 버튼, 위험 명령 그룹 표시, 안전한 예제의 안내 미표시.
