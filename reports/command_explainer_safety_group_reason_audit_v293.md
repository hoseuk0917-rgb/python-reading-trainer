# V293 안전 체크리스트 그룹 이유 설명 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1

- 앱 버전: 20260611_v293_a1
- 총평: PASS
- 감사 유형: 그룹별 왜 먼저 설명 / V292 그룹 UI 유지 / V291 정밀 체크 유지 감사

## 1. 결론

- V293은 V292 안전 체크리스트 그룹마다 `왜 먼저?` 설명을 추가한 버전이다.
- 공통 확인은 현재 위치와 브랜치 확인 이유를 설명한다.
- 삭제 계열은 삭제 대상 경로와 범위 확인 이유를 설명한다.
- Git 복구 계열은 백업 브랜치와 복구 지점 확인 이유를 설명한다.
- 권한 계열은 sudo/권한 명령 실행 전 사용자와 권한 범위 확인 이유를 설명한다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v293_a1 |
| root index version | Y | 20260611_v293_a1 |
| command script version | Y | script cache busting |
| V293 marker | Y | group reason marker |
| V293 version marker | Y | version marker |
| V292 marker kept | Y | group UI lineage |
| visible version V293 | Y | visible version |
| meta export | Y | getSafetyGroupMetaV293 |
| common reason | Y | 현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다. |
| delete reason | Y | 삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다. |
| git recovery reason | Y | reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다. |
| permission reason | Y | sudo 같은 권한 명령은 시스템 범위에 영향을 줄 수 있어서 실행 주체를 먼저 확인해야 합니다. |
| PowerShell group reasons | Y | 공통 확인: 현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다. / 삭제 계열: 삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다. / Git 복구 계열: reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다. |
| Bash group reasons | Y | 공통 확인: 현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다. / 삭제 계열: 삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다. / Git 복구 계열: reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다. / 권한 계열: sudo 같은 권한 명령은 시스템 범위에 영향을 줄 수 있어서 실행 주체를 먼저 확인해야 합니다. |
| PowerShell HTML reason | Y | PowerShell reason html |
| Bash HTML reason | Y | Bash reason html |
| V292/V291 still present | Y | precision/group/copy preserved |
| reason CSS | Y | reason css |

## 3. PowerShell 그룹 이유

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

## 4. Bash 그룹 이유

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

## 5. 다음 단계

- V294에서는 위험 명령 예제 프리셋 설명에 그룹 UI 안내를 추가할지 검토한다.
- 또는 체크리스트 그룹을 접기/펼치기 가능한 하위 details로 바꿀지 검토한다.
