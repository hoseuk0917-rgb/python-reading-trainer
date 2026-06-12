# V291 위험 명령 종류별 정밀 체크리스트 감사 리포트

AUDIT_COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1

- 앱 버전: 20260611_v291_a1
- 총평: PASS
- 감사 유형: Remove-Item / rm / git clean / git reset --hard / sudo 정밀 안전 체크 감사

## 1. 결론

- V291은 V290 안전 체크리스트를 위험 명령 종류별로 세분화한 버전이다.
- Remove-Item은 대상 존재, 목록, 재귀 개수 확인을 추가했다.
- rm은 대상 존재, 목록, find 미리보기, du 크기 확인을 추가했다.
- git clean은 `git clean -nd`, `git clean -ndx`를 함께 제공한다.
- git reset --hard는 실행 전 백업 브랜치 생성 명령을 제공한다.
- sudo는 현재 사용자, 그룹, sudo 권한 확인 명령을 제공한다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v291_a1 |
| root index version | Y | 20260611_v291_a1 |
| command script version | Y | script cache busting |
| V291 marker | Y | danger precision marker |
| V291 version marker | Y | version marker |
| V290 marker kept | Y | safety checklist lineage |
| visible version V291 | Y | visible version |
| classifier export | Y | classifyDangerStepV291 |
| Remove-Item precision | Y | Get-Location / git status --short / git diff --check / git branch --show-current / Test-Path ".tmp" / Get-Item -Force ".tmp" / Get-ChildItem -Force ".tmp" / Select-Object -First 20 / (Get-ChildItem -Force ".tmp" -Recurse -ErrorAction SilentlyContinue / Measure-Object).Count / git clean -nd / git clean -ndx / git log --oneline -5 / $backupBranch = "backup/before-reset-$(Get-Date -Format 'yyyyMMdd-HHmmss')" / git branch $backupBranch / git branch --list "backup/before-reset-*" |
| rm target precision | Y | pwd / git status --short / git diff --check / git branch --show-current / test -e ".tmp" && echo "target exists" / ls -la ".tmp" / find ".tmp" -maxdepth 2 -print / head -50 / du -sh ".tmp" 2>/dev/null / whoami / groups / sudo -l / git clean -nd / git clean -ndx / git log --oneline -5 / backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)" / git branch "$backup_branch" / git branch --list "backup/before-reset-*" |
| git clean precision | Y | dry-run and ignored-file dry-run |
| reset backup PowerShell | Y | PowerShell backup branch |
| reset backup Bash | Y | Bash backup branch |
| sudo precision | Y | sudo user/permission checks |
| PowerShell HTML still renders | Y | PowerShell checklist html |
| Bash HTML still renders | Y | Bash checklist html |
| reportable notes | Y | specific safety notes |

## 3. PowerShell 정밀 체크리스트

```text
Get-Location
git status --short
git diff --check
git branch --show-current
Test-Path ".tmp"
Get-Item -Force ".tmp"
Get-ChildItem -Force ".tmp" | Select-Object -First 20
(Get-ChildItem -Force ".tmp" -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
git clean -nd
git clean -ndx
git log --oneline -5
$backupBranch = "backup/before-reset-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
git branch --list "backup/before-reset-*"
```

## 4. Bash 정밀 체크리스트

```text
pwd
git status --short
git diff --check
git branch --show-current
test -e ".tmp" && echo "target exists"
ls -la ".tmp"
find ".tmp" -maxdepth 2 -print | head -50
du -sh ".tmp" 2>/dev/null
whoami
groups
sudo -l
git clean -nd
git clean -ndx
git log --oneline -5
backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)"
git branch "$backup_branch"
git branch --list "backup/before-reset-*"
```

## 5. 다음 단계

- V292에서는 체크리스트를 UI에서 `삭제 계열`, `Git 복구 계열`, `권한 계열`처럼 그룹별로 나눠 보여줄지 검토한다.
