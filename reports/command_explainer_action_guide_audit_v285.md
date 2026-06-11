# V285 명령어해석 다음 실행 흐름 안내 감사 리포트

AUDIT_COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1

- 앱 버전: 20260611_v285_a1
- 총평: PASS
- 감사 유형: Git 다음 실행 흐름 / 초보자 단계형 안내 감사

## 1. 결론

- V285는 명령어해석 결과를 본 뒤 다음에 무엇을 해야 하는지 더 쉽게 판단하게 만드는 버전이다.
- `git status → git diff → git add → git commit → git push` 흐름을 `확인 → 비교 → 준비 → 저장 → 업로드`로 보여준다.
- 단계형 안내는 명령 카드 목록 위에 먼저 표시된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v285_a1 |
| root index version | Y | 20260611_v285_a1 |
| command script version | Y | script cache busting |
| V285 marker | Y | action guide marker |
| V285 version marker | Y | version marker |
| V284 marker kept | Y | mobile compact lineage |
| guide order export | Y | actionGuideOrderV285 |
| guide builder export | Y | buildActionGuideV285 |
| guide renderer export | Y | renderActionGuideV285 |
| flow text | Y | 확인 → 비교 → 준비 → 저장 → 업로드 |
| guide item count | Y | 5 |
| html guide title | Y | guide title |
| html includes commands | Y | git commands |
| html includes labels | Y | beginner labels |
| render inserted before steps | Y | renderCommandStepsV277 |
| guide css present | Y | guide css |
| mobile css present | Y | mobile guide css |

## 3. 단계형 안내 HTML 샘플

```html
<div class="command-action-guide-v285"><div class="command-action-guide-title-v285">다음 실행 흐름: 확인 → 비교 → 준비 → 저장 → 업로드</div><div class="command-action-guide-items-v285"><div class="command-action-guide-item-v285"><span class="badge">1</span><strong>확인</strong><code>git status</code><span>현재 어떤 파일이 바뀌었는지 먼저 확인합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">2</span><strong>비교</strong><code>git diff</code><span>저장하기 전에 실제 변경 내용을 비교합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">3</span><strong>준비</strong><code>git add</code><span>이번 저장 기록에 넣을 파일을 고릅니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">4</span><strong>저장</strong><code>git commit</code><span>준비한 변경사항을 내 컴퓨터 Git 기록에 저장합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">5</span><strong>업로드</strong><code>git push</code><span>저장한 기록을 GitHub 같은 원격 저장소로 올립니다.</span></div></div></div>
```

## 4. 단계 의미

| 단계 | 명령 | 의미 |
|---|---|---|
| 확인 | git status | 현재 어떤 파일이 바뀌었는지 먼저 확인 |
| 비교 | git diff | 저장 전 실제 변경 내용 비교 |
| 준비 | git add | 이번 저장 기록에 넣을 파일 선택 |
| 저장 | git commit | 내 컴퓨터 Git 기록에 저장 |
| 업로드 | git push | GitHub 같은 원격 저장소로 올림 |

## 5. 다음 단계

- V286에서는 위험 명령 흐름도 단계형 안내로 따로 분리할지 검토한다.
- 예: 삭제 명령은 `대상 확인 → 백업 여부 확인 → 삭제 후 존재 여부 확인` 형태로 보여줄 수 있다.
