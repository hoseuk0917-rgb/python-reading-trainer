# V294 예제 설명 안전 체크 그룹 안내 감사 리포트

AUDIT_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1

- 앱 버전: 20260611_v294_a1
- 총평: PASS
- 감사 유형: 예제 설명 안전 체크 그룹 안내 / V291~V293 유지 감사

## 1. 결론

- V294는 예제 설명 영역에 `이 예제에서 뜨는 안전 체크 그룹` 안내를 추가한 버전이다.
- 위험 예제는 공통 확인, 삭제 계열, Git 복구 계열, 권한 계열 같은 그룹 배지를 미리 보여준다.
- 안전한 Git 저장 예제에는 불필요한 안전 그룹 안내를 표시하지 않는다.
- V291 정밀 체크, V292 그룹 UI, V293 왜 먼저 설명은 유지된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v294_a1 |
| root index version | Y | 20260611_v294_a1 |
| command script version | Y | script cache busting |
| V294 marker | Y | sample safety group hint marker |
| V294 version marker | Y | version marker |
| V293 marker kept | Y | group reason lineage |
| visible version V294 | Y | visible version |
| build export | Y | buildSampleSafetyGroupsV294 |
| render export | Y | renderSampleSafetyGroupsV294 |
| danger sample groups | Y | 공통 확인 / 삭제 계열 |
| bash auto groups | Y | 공통 확인 / 삭제 계열 / 권한 계열 |
| safe git sample no hint | Y | safe sample groups=0 |
| danger sample hint html | Y | danger hint html |
| bash sample hint html | Y | bash hint html |
| sample hint css | Y | sample hint css |
| V292/V293 preserved | Y | group UI and reasons preserved |
| V291 precision preserved | Y | precision commands preserved |

## 3. 예제별 안전 그룹

### 위험 삭제 명령

```text
공통 확인 / 삭제 계열
```

### 현재 셸 기본 Bash 예제

```text
공통 확인 / 삭제 계열 / 권한 계열
```

### Git 저장 흐름

```text
안전 그룹 없음
```

## 4. 다음 단계

- V295에서는 위험 예제 설명에 `먼저 복사할 안전 체크리스트` 바로가기 또는 강조 문구를 추가할지 검토한다.
- 또는 위험 예제 프리셋을 PowerShell/Bash 각각 별도 추가할지 검토한다.
