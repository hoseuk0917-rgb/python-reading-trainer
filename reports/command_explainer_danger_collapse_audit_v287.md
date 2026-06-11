# V287 명령어해석 위험 안내 접기 UI 감사 리포트

AUDIT_COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1

- 앱 버전: 20260611_v287_a1
- 총평: PASS
- 감사 유형: 위험 명령 안내 / 접기 UI / Git 흐름 안내 동시 표시 감사

## 1. 결론

- V287은 V286의 위험 명령 안내를 접기 UI로 바꾸는 버전이다.
- 기본 화면에서는 `위험 명령 N개 감지`와 실행 전 흐름만 짧게 보여준다.
- 상세를 펼치면 `대상 확인 → 백업 확인 → 실행 → 결과 확인`과 위험 명령 목록이 표시된다.
- V285의 Git 다음 실행 흐름 안내는 그대로 유지된다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v287_a1 |
| root index version | Y | 20260611_v287_a1 |
| command script version | Y | script cache busting |
| V287 marker | Y | danger collapse marker |
| V287 version marker | Y | version marker |
| V286 marker kept | Y | danger flow lineage |
| V285 marker kept | Y | action guide lineage |
| danger collapse renderer export | Y | renderDangerGuideV287 |
| danger count | Y | 2 |
| danger html uses details | Y | collapsible danger guide |
| danger summary count | Y | summary count |
| danger expanded flow kept | Y | expanded flow |
| danger targets kept | Y | danger targets |
| action guide still works | Y | git action guide |
| render uses V287 danger guide | Y | renderCommandStepsV277 |
| danger collapse css present | Y | danger collapse css |
| focus css present | Y | keyboard focus |
| mobile css present | Y | mobile danger collapse |

## 3. 위험 안내 접기 HTML 샘플

```html
<details class="command-danger-guide-v286 command-danger-guide-collapsible-v287"><summary><span class="command-danger-summary-title-v287">위험 명령 2개 감지</span><span class="command-danger-summary-flow-v287">대상 확인 → 백업 확인 → 실행 → 결과 확인</span></summary><div class="command-danger-guide-expanded-v287"><div class="command-danger-guide-title-v286">실행 전 확인 흐름: 대상 확인 → 백업 확인 → 실행 → 결과 확인</div><div class="command-danger-guide-flow-v286"><div class="command-danger-guide-flow-item-v286"><span class="badge bad">1</span><strong>대상 확인</strong><span>삭제하거나 되돌릴 경로/브랜치/파일 이름이 맞는지 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">2</span><strong>백업 확인</strong><span>되돌릴 수 없는 작업이면 커밋, 복사본, 백업, 원격 저장 상태를 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">3</span><strong>실행</strong><span>명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">4</span><strong>결과 확인</strong><span>실행 후 파일 존재 여부, git status, 로그를 확인합니다.</span></div></div><div class="command-danger-guide-targets-v286"><div class="command-danger-guide-target-v286"><strong>line 3 · Remove-Item</strong><pre class="code-block small-code">Remove-Item &quot;.tmp&quot; -Recurse -Force</pre><div>파일/폴더 삭제 명령입니다. -Recurse 또는 -Force가 있으면 삭제 범위가 커질 수 있습니다.</div></div><div class="command-danger-guide-target-v286"><strong>line 7 · git</strong><pre class="code-block small-code">git clean -fd</pre><div>Git이 추적하지 않는 파일/폴더를 삭제할 수 있는 명령입니다.</div></div></div></div></details>
```

## 4. Git 흐름 안내 유지 샘플

```html
<div class="command-action-guide-v285"><div class="command-action-guide-title-v285">다음 실행 흐름: 확인 → 비교 → 준비 → 저장 → 업로드</div><div class="command-action-guide-items-v285"><div class="command-action-guide-item-v285"><span class="badge">1</span><strong>확인</strong><code>git status</code><span>현재 어떤 파일이 바뀌었는지 먼저 확인합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">2</span><strong>비교</strong><code>git diff</code><span>저장하기 전에 실제 변경 내용을 비교합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">3</span><strong>준비</strong><code>git add</code><span>이번 저장 기록에 넣을 파일을 고릅니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">4</span><strong>저장</strong><code>git commit</code><span>준비한 변경사항을 내 컴퓨터 Git 기록에 저장합니다.</span></div><div class="command-action-guide-item-v285"><span class="badge">5</span><strong>업로드</strong><code>git push</code><span>저장한 기록을 GitHub 같은 원격 저장소로 올립니다.</span></div></div></div>
```

## 5. 수동 브라우저 점검 체크리스트

| 항목 | 기대 결과 |
|---|---|
| 위험 명령이 포함된 PowerShell 샘플 분석 | 상단에 `위험 명령 N개 감지` 접기 박스가 표시된다 |
| 위험 안내 summary 클릭 | 위험 단계와 위험 명령 목록이 펼쳐진다 |
| 다시 클릭 | 위험 안내가 접힌다 |
| Git 명령도 함께 있는 샘플 분석 | 위험 안내 아래에 Git 다음 실행 흐름도 표시된다 |
| 모바일 폭 640px 이하 | 위험 안내 summary가 화면 밖으로 튀지 않는다 |
| Tab 키 이동 | 위험 안내 summary에 포커스 표시가 보인다 |

## 6. 다음 단계

- V288에서는 명령어해석 모드의 예제 버튼/샘플 입력을 실제 사용 흐름 기준으로 재정리한다.
- 예: Git 저장 흐름 예제, 위험 삭제 예제, 가상환경 실행 예제를 분리한다.
