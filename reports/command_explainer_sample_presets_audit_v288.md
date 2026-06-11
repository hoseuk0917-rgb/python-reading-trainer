# V288 명령어해석 예제 프리셋 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1

- 앱 버전: 20260611_v288_a1
- 총평: PASS
- 감사 유형: 예제 버튼 / 샘플 입력 / 셸 자동 전환 / 학습 흐름 감사

## 1. 결론

- V288은 명령어해석 모드의 예제 입력을 실제 사용 흐름 기준으로 재정리한 버전이다.
- 예제는 `Git 저장 흐름`, `위험 삭제 명령`, `가상환경 실행`, `검증/커밋 루틴`, `Bash Git 흐름`, `Bash 가상환경 실행`으로 나뉜다.
- 선택한 예제에 맞춰 PowerShell/Bash 셸 선택도 자동으로 맞춘다.
- V285 Git 다음 실행 흐름, V287 위험 명령 접기 UI는 유지된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v288_a1 |
| root index version | Y | 20260611_v288_a1 |
| command script version | Y | script cache busting |
| V288 marker | Y | sample presets marker |
| V288 version marker | Y | version marker |
| V287 marker kept | Y | danger collapse lineage |
| index sample selector | Y | sample select options |
| version badge V288 | Y | visible version |
| catalog export | Y | 6 |
| get sample export | Y | getSampleV288 |
| load sample export | Y | loadSampleV288 |
| git sample shell | Y | PowerShell Git sample |
| danger sample shell | Y | danger sample |
| venv sample | Y | venv sample |
| bash sample shell | Y | bash git sample |
| git sample action guide | Y | 확인 → 비교 → 준비 → 저장 → 업로드 |
| danger sample guide | Y | 2 |
| bash sample action guide | Y | 확인 → 비교 → 준비 → 저장 → 업로드 |
| selector binding | Y | selector event binding |
| sample CSS | Y | sample select responsive css |

## 3. 예제 카탈로그

| id | label | shell | description |
|---|---|---|---|
| git_save_flow | Git 저장 흐름 | powershell | 변경 확인부터 GitHub 업로드까지의 기본 저장 흐름입니다. |
| danger_delete_flow | 위험 삭제 명령 | powershell | 삭제/강제 정리 명령을 실행하기 전 확인해야 하는 흐름입니다. |
| venv_run_flow | 가상환경 실행 | powershell | 가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다. |
| verify_commit_flow | 검증/커밋 루틴 | powershell | 검증 스크립트 실행 후 diff 확인, add, commit까지 이어지는 루틴입니다. |
| bash_git_save_flow | Bash Git 흐름 | bash | Bash/Shell에서 변경 확인부터 push까지의 기본 Git 흐름입니다. |
| bash_venv_run_flow | Bash 가상환경 실행 | bash | Bash/Shell에서 가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다. |

## 4. 핵심 샘플 검증

| 샘플 | 기대 결과 | 실제 |
|---|---|---|
| Git 저장 흐름 | 확인 → 비교 → 준비 → 저장 → 업로드 | 확인 → 비교 → 준비 → 저장 → 업로드 |
| 위험 삭제 명령 | 위험 명령 2개 이상 감지 | 2개 |
| Bash Git 흐름 | 확인 → 비교 → 준비 → 저장 → 업로드 | 확인 → 비교 → 준비 → 저장 → 업로드 |

## 5. 다음 단계

- V289에서는 명령어해석 모드의 예제별 설명 문구를 화면에 표시할지 검토한다.
- 예: 예제를 선택하면 `이 예제는 Git 저장 흐름을 연습합니다` 같은 안내를 입력창 위에 보여준다.
