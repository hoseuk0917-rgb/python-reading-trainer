# V279 명령어해석 실제 샘플 출력 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAMPLE_OUTPUT_V279_A1

- 앱 버전: 20260611_v279_a1
- 총평: PASS
- PowerShell steps: 13
- PowerShell danger/caution/unknown: 1/5/0
- Bash steps: 16
- Bash danger/caution/unknown: 2/6/0

## 1. 결론

- V277은 명령어해석 모드에 PowerShell 규칙을 추가한 버전이다.
- V278은 같은 `src/pwa/command_explainer.js` 안에 Bash/Shell 규칙을 추가한 확장 버전이다.
- V279는 버전 주석을 정리하고, PowerShell/Bash 실제 analyze 함수 출력이 기대대로 나오는지 감사한다.
- 따라서 V277/V278은 중복 기능이 아니라 같은 명령어해석 모드의 단계적 확장이다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v279_a1 |
| root index version | Y | 20260611_v279_a1 |
| V277 PowerShell marker kept | Y | PowerShell mode lineage kept |
| V278 Bash marker kept | Y | Bash mode lineage kept |
| V279 version marker cleaned | Y | version marker should be V279 |
| PowerShell Remove-Item danger | Y | Remove-Item -Recurse -Force |
| PowerShell git push caution | Y | git push origin main --tags |
| Bash rm -rf danger | Y | rm -rf .tmp |
| Bash chmod caution | Y | chmod +x |
| Bash sudo danger | Y | sudo apt update |
| Bash git push caution | Y | git push origin main --tags |
| same mode extension | Y | one command_explainer.js with PowerShell + Bash |

## 3. PowerShell 출력 요약

| line | command | group | risk | meaning |
|---|---|---|---|---|
| 1 | Set-Location | 작업 위치 | safe | 작업 폴더를 이동합니다. 이후 명령은 이 폴더를 기준으로 실행됩니다. |
| 2 | 조건/블록 | 흐름 제어 | safe | 조건문이나 블록 구조입니다. 중괄호 안의 명령이 조건에 따라 실행됩니다. |
| 3 | Remove-Item | 파일 삭제 | danger | 파일이나 폴더를 삭제합니다. |
| 4 | 조건/블록 | 흐름 제어 | safe | 조건문이나 블록 구조입니다. 중괄호 안의 명령이 조건에 따라 실행됩니다. |
| 5 | New-Item | 파일 생성 | safe | 새 파일이나 폴더를 만듭니다. |
| 6 | Get-Content | 파일 읽기 | safe | 파일 내용을 읽어서 출력합니다. |
| 7 | python | 스크립트 실행 | caution | Python 스크립트나 Python 명령을 실행합니다. |
| 8 | git status | Git 확인 | safe | Git 작업트리의 변경 상태를 확인합니다. |
| 9 | git diff | Git 확인 | safe | Git에서 추적 중인 변경 내용을 비교해서 보여줍니다. |
| 10 | git add | Git 반영 준비 | caution | 변경 파일을 다음 커밋에 포함되도록 스테이징합니다. |
| 11 | git commit | Git 기록 | caution | 스테이징된 변경을 로컬 Git 기록으로 저장합니다. |
| 12 | git tag | Git 기록 | caution | 현재 커밋에 이름표를 붙입니다. |
| 13 | git push | Git 원격 반영 | caution | 로컬 커밋이나 태그를 GitHub 같은 원격 저장소로 보냅니다. |

## 4. Bash/Shell 출력 요약

| line | command | group | risk | meaning |
|---|---|---|---|---|
| 1 | cd | 작업 위치 | safe | 작업 폴더를 이동합니다. 이후 명령은 이 폴더를 기준으로 실행됩니다. |
| 2 | 조건/블록 | 흐름 제어 | safe | Bash 조건문이나 반복문 구조입니다. 조건에 따라 안쪽 명령이 실행됩니다. |
| 3 | rm -rf | 파일 삭제 | danger | 파일이나 폴더를 강제로 삭제합니다. |
| 4 | 조건/블록 | 흐름 제어 | safe | Bash 조건문이나 반복문 구조입니다. 조건에 따라 안쪽 명령이 실행됩니다. |
| 5 | mkdir | 파일 생성 | safe | 새 폴더를 만듭니다. |
| 6 | cat | 파일 읽기 | safe | 파일 내용을 터미널에 출력합니다. |
| 7 | grep | 텍스트 검색 | safe | 파일이나 출력 내용에서 특정 문자열을 찾습니다. |
| 8 | chmod | 권한 변경 | caution | 파일의 실행/읽기/쓰기 권한을 바꿉니다. |
| 9 | sudo | 관리자 권한 | danger | 관리자 권한으로 명령을 실행합니다. |
| 10 | python3 | 스크립트 실행 | caution | Python 3 스크립트나 Python 명령을 실행합니다. |
| 11 | git status | Git 확인 | safe | Git 작업트리의 변경 상태를 확인합니다. |
| 12 | git diff | Git 확인 | safe | Git에서 추적 중인 변경 내용을 비교해서 보여줍니다. |
| 13 | git add | Git 반영 준비 | caution | 변경 파일을 다음 커밋에 포함되도록 스테이징합니다. |
| 14 | git commit | Git 기록 | caution | 스테이징된 변경을 로컬 Git 기록으로 저장합니다. |
| 15 | git tag | Git 기록 | caution | 현재 커밋에 이름표를 붙입니다. |
| 16 | git push | Git 원격 반영 | caution | 로컬 커밋이나 태그를 GitHub 같은 원격 저장소로 보냅니다. |

## 5. 다음 단계

- V280에서는 명령어해석 UI의 사용성 감사 또는 실제 브라우저 화면 점검을 진행한다.
- 이후 필요하면 Windows PowerShell 특화 명령과 Git 명령 설명을 더 늘린다.
