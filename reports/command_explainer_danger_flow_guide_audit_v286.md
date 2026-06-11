# V286 명령어해석 위험 명령 흐름 안내 감사 리포트

AUDIT_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1

- 앱 버전: 20260611_v286_a1
- 총평: PASS
- 감사 유형: 위험 명령 / 삭제·강제 초기화 / 실행 전 확인 흐름 감사

## 1. 결론

- V286은 명령어해석 결과에서 위험 명령을 별도 안내 박스로 먼저 보여주는 버전이다.
- 위험 실행 흐름은 `대상 확인 → 백업 확인 → 실행 → 결과 확인`으로 정리한다.
- `Remove-Item`, `rm -rf`, `sudo`, `git reset --hard`, `git clean -fd` 계열을 위험 안내 대상으로 본다.

## 2. 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v286_a1 |
| root index version | Y | 20260611_v286_a1 |
| command script version | Y | script cache busting |
| V286 marker | Y | danger flow marker |
| V286 version marker | Y | version marker |
| V285 marker kept | Y | action guide lineage |
| danger flow export | Y | dangerFlowStepsV286 |
| danger builder export | Y | buildDangerGuideV286 |
| danger renderer export | Y | renderDangerGuideV286 |
| raw danger detector export | Y | git destructive raw detection |
| powershell danger count | Y | 3 |
| bash danger count | Y | 3 |
| flow text | Y | 대상 확인 → 백업 확인 → 실행 → 결과 확인 |
| powershell html title | Y | powershell danger title |
| bash html includes risky commands | Y | bash dangerous commands |
| render inserted before action guide | Y | danger guide before action guide |
| danger css present | Y | danger guide css |
| mobile css present | Y | mobile danger guide css |

## 3. PowerShell 위험 안내 HTML 샘플

```html
<div class="command-danger-guide-v286"><div class="command-danger-guide-title-v286">위험 명령 실행 전 확인: 대상 확인 → 백업 확인 → 실행 → 결과 확인</div><div class="command-danger-guide-flow-v286"><div class="command-danger-guide-flow-item-v286"><span class="badge bad">1</span><strong>대상 확인</strong><span>삭제하거나 되돌릴 경로/브랜치/파일 이름이 맞는지 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">2</span><strong>백업 확인</strong><span>되돌릴 수 없는 작업이면 커밋, 복사본, 백업, 원격 저장 상태를 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">3</span><strong>실행</strong><span>명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">4</span><strong>결과 확인</strong><span>실행 후 파일 존재 여부, git status, 로그를 확인합니다.</span></div></div><div class="command-danger-guide-targets-v286"><div class="command-danger-guide-target-v286"><strong>line 2 · Remove-Item</strong><pre class="code-block small-code">Remove-Item &quot;.tmp&quot; -Recurse -Force</pre><div>파일/폴더 삭제 명령입니다. -Recurse 또는 -Force가 있으면 삭제 범위가 커질 수 있습니다.</div></div><div class="command-danger-guide-target-v286"><strong>line 3 · git</strong><pre class="code-block small-code">git reset --hard HEAD~1</pre><div>Git 변경사항을 강제로 되돌릴 수 있는 명령입니다. 커밋되지 않은 작업이 사라질 수 있습니다.</div></div><div class="command-danger-guide-target-v286"><strong>line 4 · git</strong><pre class="code-block small-code">git clean -fd</pre><div>Git이 추적하지 않는 파일/폴더를 삭제할 수 있는 명령입니다.</div></div></div></div>
```

## 4. Bash 위험 안내 HTML 샘플

```html
<div class="command-danger-guide-v286"><div class="command-danger-guide-title-v286">위험 명령 실행 전 확인: 대상 확인 → 백업 확인 → 실행 → 결과 확인</div><div class="command-danger-guide-flow-v286"><div class="command-danger-guide-flow-item-v286"><span class="badge bad">1</span><strong>대상 확인</strong><span>삭제하거나 되돌릴 경로/브랜치/파일 이름이 맞는지 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">2</span><strong>백업 확인</strong><span>되돌릴 수 없는 작업이면 커밋, 복사본, 백업, 원격 저장 상태를 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">3</span><strong>실행</strong><span>명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">4</span><strong>결과 확인</strong><span>실행 후 파일 존재 여부, git status, 로그를 확인합니다.</span></div></div><div class="command-danger-guide-targets-v286"><div class="command-danger-guide-target-v286"><strong>line 2 · rm -rf</strong><pre class="code-block small-code">rm -rf .tmp</pre><div>강제 삭제 명령입니다. 경로를 잘못 쓰면 복구가 어려울 수 있습니다.</div></div><div class="command-danger-guide-target-v286"><strong>line 3 · sudo</strong><pre class="code-block small-code">sudo apt update</pre><div>관리자 권한 명령입니다. 시스템 설정이나 중요한 파일이 바뀔 수 있습니다.</div></div><div class="command-danger-guide-target-v286"><strong>line 4 · git</strong><pre class="code-block small-code">git clean -fd</pre><div>Git이 추적하지 않는 파일/폴더를 삭제할 수 있는 명령입니다.</div></div></div></div>
```

## 5. 위험 단계 의미

| 단계 | 의미 |
|---|---|
| 대상 확인 | 삭제하거나 되돌릴 경로/브랜치/파일 이름 확인 |
| 백업 확인 | 커밋, 복사본, 원격 저장 여부 확인 |
| 실행 | 명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행 |
| 결과 확인 | 실행 후 파일 존재 여부, git status, 로그 확인 |

## 6. 다음 단계

- V287에서는 실제 브라우저에서 Git 흐름 안내와 위험 명령 안내가 동시에 뜰 때 화면이 너무 길어지지 않는지 점검한다.
- 필요하면 위험 안내도 접기 UI로 바꾼다.
