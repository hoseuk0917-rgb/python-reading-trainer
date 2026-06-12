# V292 안전 체크리스트 그룹 UI 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1

- 앱 버전: 20260611_v292_a1
- 총평: PASS
- 감사 유형: 안전 체크리스트 그룹 UI / 복사 유지 / V291 정밀 체크 유지 감사

## 1. 결론

- V292는 V291의 정밀 안전 체크리스트를 UI에서 그룹별로 나눠 보여주는 버전이다.
- 그룹은 `공통 확인`, `삭제 계열`, `Git 복구 계열`, `권한 계열`이다.
- 사용자는 그룹별 코드블록을 읽고, 복사 버튼으로 전체 체크리스트를 한 번에 복사할 수 있다.
- V291의 Remove-Item, rm, git clean, git reset --hard, sudo 정밀 확인 명령은 유지된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v292_a1 |
| root index version | Y | 20260611_v292_a1 |
| command script version | Y | script cache busting |
| V292 marker | Y | grouped UI marker |
| V292 version marker | Y | version marker |
| V291 marker kept | Y | danger precision lineage |
| visible version V292 | Y | visible version |
| group export | Y | getSafetyGroupsV292 |
| PowerShell groups | Y | 공통 확인 / 삭제 계열 / Git 복구 계열 |
| Bash groups | Y | 공통 확인 / 삭제 계열 / Git 복구 계열 / 권한 계열 |
| PowerShell grouped HTML | Y | PowerShell grouped HTML |
| Bash grouped HTML | Y | Bash grouped HTML |
| copy source keeps full checklist | Y | hidden full copy source |
| group CSS | Y | group css |
| mobile group CSS | Y | mobile group css |
| old V290 render export kept | Y | renderSafetyChecklistV290 still exported |
| V291 precision still present | Y | V291 precision commands remain |

## 3. PowerShell 그룹

### 공통 확인

현재 위치, 브랜치, Git 변경 상태를 먼저 확인합니다.

```text
Get-Location
git status --short
git diff --check
git branch --show-current
```

### 삭제 계열

파일이나 폴더가 실제로 무엇인지, 몇 개인지, 얼마나 큰지 확인합니다.

```text
Test-Path ".tmp"
Get-Item -Force ".tmp"
Get-ChildItem -Force ".tmp" | Select-Object -First 20
(Get-ChildItem -Force ".tmp" -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
git clean -nd
git clean -ndx
```

### Git 복구 계열

되돌리기 전에 최근 커밋과 백업 브랜치를 확인합니다.

```text
git log --oneline -5
$backupBranch = "backup/before-reset-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
git branch --list "backup/before-reset-*"
```

## 4. Bash 그룹

### 공통 확인

현재 위치, 브랜치, Git 변경 상태를 먼저 확인합니다.

```text
pwd
git status --short
git diff --check
git branch --show-current
```

### 삭제 계열

파일이나 폴더가 실제로 무엇인지, 몇 개인지, 얼마나 큰지 확인합니다.

```text
test -e ".tmp" && echo "target exists"
ls -la ".tmp"
find ".tmp" -maxdepth 2 -print | head -50
du -sh ".tmp" 2>/dev/null
git clean -nd
git clean -ndx
```

### Git 복구 계열

되돌리기 전에 최근 커밋과 백업 브랜치를 확인합니다.

```text
git log --oneline -5
backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)"
git branch "$backup_branch"
git branch --list "backup/before-reset-*"
```

### 권한 계열

관리자 권한 실행 전 현재 사용자와 권한 범위를 확인합니다.

```text
whoami
groups
sudo -l
```

## 5. 다음 단계

- V293에서는 각 그룹에 `왜 먼저 확인해야 하는지`를 한 줄 설명으로 추가할지 검토한다.
- 또는 위험 명령 예제 프리셋에서 그룹 UI가 잘 보이도록 샘플 설명 문구를 보강할 수 있다.
