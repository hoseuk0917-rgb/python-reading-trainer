# V281 명령어해석 초보자 용어 설명 감사 리포트

AUDIT_COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1

- 앱 버전: 20260611_v281_a1
- 총평: PASS
- 감사 유형: 초보자 용어 설명 / 출력 보강 감사

## 1. 결론

- V281은 명령어해석의 기능 종류를 늘리지 않고, 결과 설명의 이해도를 높이는 버전이다.
- `스테이징`, `커밋`, `태그`, `원격 저장소`, `관리자 권한`, `강제 삭제`, `실행 권한`을 초보자 메모로 보강한다.
- PowerShell과 Bash/Shell 분석 결과 모두 초보자 메모를 받을 수 있다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v281_a1 |
| root index version | Y | 20260611_v281_a1 |
| command script version | Y | script cache busting |
| V281 marker | Y | beginner terms marker |
| V281 version marker | Y | version marker |
| glossary export | Y | beginnerTermsV281 |
| staging explanation | Y | git add |
| commit explanation | Y | git commit |
| tag explanation | Y | git tag |
| remote explanation | Y | git push |
| admin explanation | Y | sudo |
| force delete explanation | Y | Remove-Item / rm -rf |
| execute permission explanation | Y | chmod |
| PowerShell Remove-Item note | Y | PowerShell delete risk |
| PowerShell git add note | Y | staging note |
| PowerShell git push note | Y | remote note |
| Bash rm -rf note | Y | Bash delete risk |
| Bash chmod note | Y | permission note |
| Bash sudo note | Y | admin note |
| render beginner note | Y | UI renders beginner note |

## 3. PowerShell 초보자 메모 출력

| command | risk | beginner note |
|---|---|---|
| Set-Location | safe | 작업 폴더는 현재 명령이 기준으로 삼는 위치입니다. 상대경로는 이 위치를 기준으로 해석됩니다. |
| Remove-Item | danger | 강제 삭제는 확인을 줄이고 바로 지우는 방식이라 경로를 잘못 쓰면 복구가 어려울 수 있습니다. |
| python | caution | 스크립트 실행은 파일 안의 여러 명령을 한 번에 실행하는 것이어서, 내부 내용을 먼저 확인하는 편이 안전합니다. |
| git add | caution | 스테이징은 커밋하기 전에 '이번 기록에 넣을 파일'을 고르는 준비 단계입니다. |
| git commit | caution | 커밋은 현재 변경사항을 Git 안에 하나의 저장 기록으로 남기는 일입니다. |
| git tag | caution | 태그는 특정 커밋에 버전 이름표를 붙여 나중에 쉽게 찾게 하는 표시입니다. |
| git push | caution | 원격 저장소는 내 컴퓨터 밖의 GitHub 저장소처럼 팀이나 배포용으로 쓰는 저장 위치입니다. |

## 4. Bash/Shell 초보자 메모 출력

| command | risk | beginner note |
|---|---|---|
| cd | safe | 작업 폴더는 현재 명령이 기준으로 삼는 위치입니다. 상대경로는 이 위치를 기준으로 해석됩니다. |
| rm -rf | danger | 강제 삭제는 확인을 줄이고 바로 지우는 방식이라 경로를 잘못 쓰면 복구가 어려울 수 있습니다. |
| chmod | caution | 실행 권한은 파일을 프로그램처럼 실행할 수 있게 허용하는 설정입니다. |
| sudo | danger | 관리자 권한은 일반 사용자보다 더 강한 권한이라 시스템 설정이나 중요한 파일도 바꿀 수 있습니다. 위험 명령은 실행 전에 대상 경로와 옵션을 한 번 더 확인해야 합니다. |
| python3 | caution | 스크립트 실행은 파일 안의 여러 명령을 한 번에 실행하는 것이어서, 내부 내용을 먼저 확인하는 편이 안전합니다. |
| git add | caution | 스테이징은 커밋하기 전에 '이번 기록에 넣을 파일'을 고르는 준비 단계입니다. |
| git commit | caution | 커밋은 현재 변경사항을 Git 안에 하나의 저장 기록으로 남기는 일입니다. |
| git tag | caution | 태그는 특정 커밋에 버전 이름표를 붙여 나중에 쉽게 찾게 하는 표시입니다. |
| git push | caution | 원격 저장소는 내 컴퓨터 밖의 GitHub 저장소처럼 팀이나 배포용으로 쓰는 저장 위치입니다. |

## 5. 다음 단계

- V282에서는 실제 브라우저 수동 점검 결과를 반영해 문구를 더 다듬는다.
- 특히 `git add/commit/push` 흐름을 '준비 → 저장 → 업로드'처럼 더 직관적으로 표현하는 개선이 가능하다.
