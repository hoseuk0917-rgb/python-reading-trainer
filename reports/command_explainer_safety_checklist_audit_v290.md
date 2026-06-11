# V290 명령어해석 안전 실행 체크리스트 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1

- 앱 버전: 20260611_v290_a1
- 총평: PASS
- 감사 유형: 위험 명령 / 안전 확인 명령 / 복사 버튼 / PowerShell-Bash 분기 감사

## 1. 결론

- V290은 위험 명령이 감지될 때 실행 전 확인 명령만 따로 모아주는 안전 실행 체크리스트를 추가한 버전이다.
- 체크리스트에는 실제 위험 명령 자체가 아니라 `git status`, `git diff`, `git clean -nd`, `Test-Path`, `Get-ChildItem`, `ls -la` 같은 확인 명령이 표시된다.
- 체크리스트에는 복사 버튼이 있으며, 복사가 실패해도 코드블록을 직접 복사할 수 있다.
- V287 위험 명령 접기 UI, V289 예제 설명 문구는 유지된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v290_a1 |
| root index version | Y | 20260611_v290_a1 |
| command script version | Y | script cache busting |
| V290 marker | Y | safety checklist marker |
| V290 version marker | Y | version marker |
| V289 marker kept | Y | sample description lineage |
| visible version V290 | Y | visible version |
| safety checklist exports | Y | build/render safety checklist |
| PowerShell checklist commands | Y | Get-Location / git status --short / git diff --check / git branch --show-current / Test-Path ".tmp" / Get-ChildItem -Force ".tmp" / git clean -nd / git log --oneline -5 |
| Bash checklist commands | Y | pwd / git status --short / git diff --check / git branch --show-current / ls -la "." / whoami / groups / git clean -nd |
| PowerShell HTML | Y | PowerShell checklist html |
| Bash HTML | Y | Bash checklist html |
| copy button binding | Y | copy button |
| render insertion order | Y | danger -> safety -> action |
| clipboard fallback | Y | clipboard fallback |
| safety CSS | Y | safety css |
| mobile safety CSS | Y | mobile copy button |

## 3. PowerShell 안전 체크리스트

```text
Get-Location
git status --short
git diff --check
git branch --show-current
Test-Path ".tmp"
Get-ChildItem -Force ".tmp"
git clean -nd
git log --oneline -5
```

## 4. Bash 안전 체크리스트

```text
pwd
git status --short
git diff --check
git branch --show-current
ls -la "."
whoami
groups
git clean -nd
```

## 5. 다음 단계

- V291에서는 안전 체크리스트를 위험 명령 종류별로 더 정밀화할지 검토한다.
