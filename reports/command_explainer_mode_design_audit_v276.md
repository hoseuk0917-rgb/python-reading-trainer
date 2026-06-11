# V276 PowerShell/Bash 명령어 해석 모드 설계 감사 리포트

AUDIT_COMMAND_EXPLAINER_MODE_DESIGN_V276_A1

- 앱 버전: 20260611_v276_a1
- 앱 버전 확인: Y
- 기존 Code Explainer V272/V274 유지 확인: Y
- 감사 유형: 설계 감사 / 정적 샘플 감사
- 총평: PASS

## 1. 결론

- PowerShell/Bash는 일반 코드해석에 섞지 않고 별도 `명령어 해석 모드`로 분리한다.
- 기존 Python/JavaScript 코드해석은 함수/클래스/호출/흐름 중심으로 유지한다.
- 명령어 해석 모드는 작업 순서, 파일 영향, 실행 위치, 위험 명령, Git 부작용을 우선 설명한다.
- V277은 PowerShell 1차 구현, V278은 Bash/Shell 1차 구현으로 나누는 것이 안전하다.

## 2. 설계 요구사항

| id | requirement | status | reason |
|---|---|---|---|
| separate_mode | 일반 코드해석과 명령어 해석 분리 | PASS | PowerShell/Bash는 함수/클래스 구조보다 작업 순서, 파일 조작, 실행 환경, 위험 명령을 해석하는 성격이 강함 |
| step_order_first | 명령어는 순서 중심으로 설명 | PASS | Set-Location, Test-Path, Remove-Item, New-Item, python, git 명령은 위에서 아래로 실행되는 작업 흐름 설명이 중요함 |
| risk_warning | 삭제/강제 실행/권한 변경은 위험 경고 | PASS | Remove-Item -Recurse -Force, rm -rf, chmod, sudo 같은 명령은 학습자에게 먼저 위험도를 알려야 함 |
| windows_unix_split | PowerShell과 Bash/Shell 규칙 분리 | PASS | 경로 표기, 변수 문법, 조건문, 파이프, 삭제 명령이 달라서 하나의 규칙으로 섞으면 오해가 생김 |
| git_command_group | Git 명령은 공통 그룹으로 별도 처리 | PASS | git status, git diff, git add, git commit, git tag, git push는 PowerShell/Bash 모두에서 같은 의미로 자주 사용됨 |
| no_auto_execution | 명령어 해석은 실행하지 않음 | PASS | 입력된 명령을 실제로 실행하면 파일 삭제, 커밋, 푸시 같은 부작용이 생길 수 있으므로 정적 해석만 해야 함 |

## 3. PowerShell 1차 지원 후보

| command | beginner meaning | risk |
|---|---|---|
| Set-Location | 작업 폴더 이동 | safe |
| Test-Path | 파일/폴더 존재 확인 | safe |
| Remove-Item | 파일/폴더 삭제 | danger |
| New-Item | 파일/폴더 생성 | safe |
| Get-Content | 파일 내용 읽기 | safe |
| Set-Content | 파일 내용 쓰기 | caution |
| Out-Null | 출력 숨김 | safe |
| python | Python 스크립트 실행 | caution |
| git status | Git 변경 상태 확인 | safe |
| git diff | Git 변경 내용 확인 | safe |
| git add | Git 스테이징 | caution |
| git commit | Git 커밋 생성 | caution |
| git tag | Git 태그 생성 | caution |
| git push | 원격 저장소로 푸시 | caution |

## 4. Bash/Shell 1차 지원 후보

| command | beginner meaning | risk |
|---|---|---|
| cd | 작업 폴더 이동 | safe |
| test / [ -d ] | 파일/폴더 조건 확인 | safe |
| rm -rf | 파일/폴더 강제 삭제 | danger |
| mkdir -p | 폴더 생성 | safe |
| cat | 파일 내용 출력 | safe |
| grep | 텍스트 검색 | safe |
| chmod | 실행 권한 변경 | caution |
| sudo | 관리자 권한 실행 | danger |
| python3 | Python 스크립트 실행 | caution |
| git status | Git 변경 상태 확인 | safe |
| git diff | Git 변경 내용 확인 | safe |
| git add | Git 스테이징 | caution |
| git commit | Git 커밋 생성 | caution |
| git push | 원격 저장소로 푸시 | caution |

## 5. PowerShell 감사 샘플

```powershell
Set-Location "D:\projects\python-reading-trainer"

if (Test-Path ".tmp") {
  Remove-Item ".tmp" -Recurse -Force
}

New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null
Get-Content "src\pwa\app.js" -Raw -Encoding UTF8
python ".tmp\script.py"
git status --short
git diff --check
```

## 6. Bash/Shell 감사 샘플

```bash
cd ~/python-reading-trainer

if [ -d ".tmp" ]; then
  rm -rf ".tmp"
fi

mkdir -p .tmp
cat src/pwa/app.js
python3 .tmp/script.py
git status --short
git diff --check
```

## 7. V277 구현 범위 제안

- `src/pwa/command_explainer.js`를 새 파일로 분리한다.
- `CodeExplainer` 내부에 억지로 섞지 않는다.
- 첫 구현은 PowerShell만 대상으로 한다.
- 출력은 `작업 순서`, `명령어 의미`, `위험 경고`, `Git 영향`, `다음 확인 명령어`로 구성한다.
- `Remove-Item -Recurse -Force`, `rm -rf`, `git push` 같은 명령은 초보자 경고를 항상 붙인다.

## 8. PASS 기준

- 앱 버전이 V276으로 올라가야 한다.
- 기존 V272/V274 Code Explainer 마커가 유지되어야 한다.
- PowerShell/Bash를 분리해야 한다는 설계 결론이 리포트에 있어야 한다.
- PowerShell 1차 구현 후보와 Bash/Shell 1차 구현 후보가 별도로 있어야 한다.
- V277 구현 범위가 PowerShell 1차로 제한되어야 한다.
