# V283 명령어해석 추가 설명 접기 UI 감사 리포트

AUDIT_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1

- 앱 버전: 20260611_v283_a1
- 총평: PASS
- 감사 유형: 초보자 메모 / Git 흐름 메모 화면 길이 완화 감사

## 1. 결론

- V283은 V281 초보자 메모와 V282 Git 흐름 메모를 유지하면서 화면 복잡도를 줄이는 버전이다.
- 각 명령 카드에서 추가 설명은 `<details>` 접기 영역으로 렌더링된다.
- `git push`처럼 초보자 메모와 Git 흐름이 모두 있는 명령은 `Git: 업로드 / 초보자 메모` 요약으로 접힌다.
- `git status`처럼 Git 흐름만 있는 명령은 `Git: 상태 확인` 요약으로 접힌다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v283_a1 |
| root index version | Y | 20260611_v283_a1 |
| command script version | Y | script cache busting |
| V283 marker | Y | compact extra notes marker |
| V283 version marker | Y | version marker |
| V281 beginner marker kept | Y | beginner note lineage |
| V282 git flow marker kept | Y | git flow lineage |
| details renderer export | Y | renderExtraNotesV283 |
| push html uses details | Y | git push compact note |
| push html has summary | Y | summary combines git flow + beginner note |
| push html keeps beginner note | Y | beginner note still visible inside details |
| push html keeps git flow note | Y | git flow still visible inside details |
| status html uses compact git-only summary | Y | git status has compact flow-only note |
| inline always-open notes removed | Y | main card no longer renders both always open |
| compact css present | Y | compact details CSS |

## 3. git push 접기 HTML 샘플

```html
<details class="command-extra-note-v283"><summary>Git: 업로드 / 초보자 메모</summary><div class="command-extra-note-body-v283"><div class="git-flow-note-v282"><strong>Git 흐름:</strong> <span class="git-flow-label-v282">업로드</span> — 내 컴퓨터에 저장된 커밋이나 태그를 GitHub 같은 원격 저장소로 올리는 단계입니다.</div><div class="beginner-note-v281"><strong>초보자 메모:</strong> 원격 저장소는 내 컴퓨터 밖의 GitHub 저장소처럼 팀이나 배포용으로 쓰는 저장 위치입니다.</div></div></details>
```

## 4. git status 접기 HTML 샘플

```html
<details class="command-extra-note-v283"><summary>Git: 상태 확인</summary><div class="command-extra-note-body-v283"><div class="git-flow-note-v282"><strong>Git 흐름:</strong> <span class="git-flow-label-v282">상태 확인</span> — 현재 어떤 파일이 바뀌었는지 먼저 확인하는 단계입니다.</div></div></details>
```

## 5. 다음 단계

- V284에서는 실제 브라우저에서 접기 UI 클릭 동작과 모바일 폭에서의 가독성을 점검한다.
- 필요하면 접기 요약 문구를 더 짧게 줄인다.
