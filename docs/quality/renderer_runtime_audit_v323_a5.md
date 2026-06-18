# V323-A5 renderer runtime audit

## Purpose

Runs representative code, command, and project analyzer render flows in a DOM stub to check whether prior object-stringification candidates actually leak `[object Object]` into rendered UI text.

## Version

- app version observed: 20260618_v323_a4

## Summary

- total checks: 5
- PASS: 4
- INFO: 1

## Checks

| area | check | status | evidence |
|---|---|---|---|
| code_explainer | python_object_lambda_render | PASS | steps=6; unsupported=0; objectLeak=false |
| command_explainer | git_clean_render | PASS | objectLeak=false; hasGitClean=true; hasDryRun=true |
| project_analyzer | pwa_render | PASS | manifest=true; sw=true; objectLeak=false |
| global_dom | all_rendered_elements_object_leak_scan | PASS | elements=51; objectLeak=false |
| static_reference | renderer_assignment_candidates_count | INFO | candidateLines=22 |

## Details

### python_object_lambda_render

- area: code_explainer
- status: PASS
- evidence: steps=6; unsupported=0; objectLeak=false

codeSummary code-summary <strong>Python</strong><br>Python 코드를 6단계로 나눠 해석했습니다. 특별히 높은 위험 명령은 감지되지 않았습니다.<br><span class="code-flow-summary">주요 흐름: 구조 4개 · 변수/값 2개</span>
codeWarnings code-warnings muted 위험/주의 명령은 감지되지 않았습니다.
codeSteps div code-step risk-low confidence-exact 
      <div class="code-step-head">
        <span class="step-number">1</span>
        <strong>클래스 정의</strong>
        <span class="confidence-badge confidence-exact">규칙 일치</span>
        <span class="risk-badge">낮음</span>
      </div>
      <p>관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.</p>
      <div class="code-step-meta"><span class="code-confidence-chip confidence-exact">규칙 일치</span><span class="code-step-category">구조</span><span class="code-step-tag">함수/구조</span></div>
      <pre class="code-step-line">line 1: class User:</pre>
     div code-step risk-low confidence-exact 
      <div class="code-step-head">
        <span class="step-number">2</span>
        <strong>객체 초기화 메서드 정의</strong>
        <span class="confidence-badge confidence-exact">규칙 일치</span>
        <span class="risk-badge">낮음</span>
      </div>
      <p>__init__ 메서드는 새 객체가 만들어질 때 처음 실행되며 self.name처럼 객체가 기억할 속성의 초기값을 준비합니다.</p>
      <div class="code-step-meta"><span class="code-confidence-chip confidence-exact">규칙 일치</span><span class="code-step-category">구조</span><span class="code-step-tag">함수/구조</span></div>
      <pre class="code-step-line">line 2: def __init__(self, name):</pre>
     div code-step risk-low confidence-exact 
      <div class="code-step-head">
        <span class="step-number">3</span>
        <strong>인스턴스 속성 저장</strong>
        <span class="confidence-badge confidence-exact">규칙 일치</span>
        <span class="risk-badge">낮음</span>
      </div>
      <p>self.name에 값을 저장해 이 객체가 기억할 상태를 만듭니다. 오른쪽 값(name)이 나중에 메서드에서 다시 사용될 수 있습니다.</p>
      <div class="code-step-meta"><span class="code-confidence-chip confidence-exact">규칙 일치</span><span class="code-step-category">변수/값</span><span class="code-step-tag">변수</span></div>
      <pre class="code-step-line">line 3: self.name = name</pre>
     div code-step risk-low confidence-exact 
      <div class="code-step-head">
        <span class="step-number">4</span>
        <

### git_clean_render

- area: command_explainer
- status: PASS
- evidence: objectLeak=false; hasGitClean=true; hasDryRun=true

commandSummary code-summary <div><strong>PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 1개, 주의 0개, 미확인 0개입니다.</strong></div><div class="muted">그룹: Git 위험 정리 1개</div>
commandWarnings code-warnings <div class="code-warning-item bad"><strong>위험 · line 1 · git clean</strong><div>untracked 파일/폴더를 삭제할 수 있고, 삭제 후 Git으로 복구하기 어려울 수 있습니다. -x 옵션이 있으면 ignored 파일까지 포함될 수 있습니다. 실행 전에는 반드시 dry-run인 git clean -fdn으로 미리보기하세요.</div></div>
commandSteps <details class="command-danger-guide-v286 command-danger-guide-collapsible-v287"><summary><span class="command-danger-summary-title-v287">위험 명령 1개 감지</span><span class="command-danger-summary-flow-v287">대상 확인 → 백업 확인 → 실행 → 결과 확인</span></summary><div class="command-danger-guide-expanded-v287"><div class="command-danger-guide-title-v286">실행 전 확인 흐름: 대상 확인 → 백업 확인 → 실행 → 결과 확인</div><div class="command-danger-guide-flow-v286"><div class="command-danger-guide-flow-item-v286"><span class="badge bad">1</span><strong>대상 확인</strong><span>삭제하거나 되돌릴 경로/브랜치/파일 이름이 맞는지 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">2</span><strong>백업 확인</strong><span>되돌릴 수 없는 작업이면 커밋, 복사본, 백업, 원격 저장 상태를 먼저 확인합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">3</span><strong>실행</strong><span>명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행합니다.</span></div><div class="command-danger-guide-flow-item-v286"><span class="badge bad">4</span><strong>결과 확인</strong><span>실행 후 파일 존재 여부, git status, 로그를 확인합니다.</span></div></div><div class="command-danger-guide-targets-v286"><div class="command-danger-guide-target-v286"><strong>line 1 · git clean</strong><pre class="code-block small-code">git clean -fd</pre><div>Git이 추적하지 않는 파일/폴더를 삭제할 수 있는 명령입니다.</div></div></div></div></details><details class="command-safety-checklist-v290 command-safety-checklist-grouped-v292" open><summary><span class="command-safety-title-v290">위험 명령 실행 전 안전 확인</span><span class="badge command-safety-shell-v290">PowerShell</span><span class="badge command-safety-group-count-v292">2개 그룹</span></summary><div class="command-safety-body-v290"><p>아래 명령은 삭제/초기화 명령이 아니라 현재 상태를 먼저 확인하는 안전 확인 명령입니다. 그룹별로 확인하면 실수 가능성을 줄일 수 있습니다.</p><button type="button" cl

### pwa_render

- area: project_analyzer
- status: PASS
- evidence: manifest=true; sw=true; objectLeak=false

projectAnalysisSummary <div class="project-summary-grid"><div class="summary-card"><div class="summary-num">6</div><div class="summary-label">파일 수</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">lesson 파일</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">side 파일</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">lesson 카드</div></div></div>
projectAnalysisDetails <div class="project-detail-section"><h3>기본 상태</h3><p><strong>Root:</strong> D:/sample/pwa-app</p><p><strong>Git:</strong> sample-render-audit</p><p><strong>Status:</strong> clean</p><p><strong>입력 방식:</strong> json</p></div><div class="project-detail-section"><h3>환경 감사</h3><div class="project-env-list"><div class="project-env-row"><strong>Python</strong><span>python</span></div><div class="project-env-row"><strong>Git</strong><span>git sample</span></div><div class="project-env-row"><strong>Node</strong><span>v22</span></div><div class="project-env-row"><strong>pip</strong><span>pip sample</span></div><div class="project-env-row"><strong>필요 pip 패키지</strong><span>none</span></div><div class="project-env-row"><strong>표준 라이브러리만 사용</strong><span>true</span></div></div></div><div class="project-detail-section"><h3>역할별 파일 수</h3><div class="project-mini-grid"><div class="project-mini-card"><strong>1</strong><span>html_entry</span></div><div class="project-mini-card"><strong>2</strong><span>pwa_app</span></div><div class="project-mini-card"><strong>2</strong><span>json_config_or_data</span></div><div class="project-mini-card"><strong>1</strong><span>source_or_script</span></div></div></div><div class="project-detail-section"><h3>함수 호출 후보</h3><p>호출 후보가 감지된 파일 수: 2</p></div><div class="project-detail-section project-usage-hint"><h3>붙여넣기 품질 안내</h3><div class="project-hint-grid"><div class="project-hint-card"><strong>현재 입력</strong><span>JSON report 전체</span></div><div class="project-hint-card"><strong>추천 입력</strong><span>project_probe_v199.json 전체 붙여넣기</span></div><div class="project-hint-card"><strong>왜 필요한가</strong><span>핵심 파일, 함수/클래스, 호출 후보, 참조 후보를 더 정확히 볼 수 있습니다.</span></div></div><p class="muted">JSON report로 분석 중입니다. 기능별 파일 묶음과 상세 후보가 아래에 함께 표시됩니다.</p></div><div class="project-detail-section project-focus-files"><h3>수정 전 같이 봐야 할 파일</h3><p class="muted">다음 패치에서 한 파일만 고치지 않도록, 관련 파일을 묶어서 확인합니다.</p><div class="project-focus-grid"><div class="project-focus-card"><strong>프로젝트분석</strong><span>src/pwa/index.html · src/pwa/project_analyzer.js · src/pwa/style.css · tools/veri

### all_rendered_elements_object_leak_scan

- area: global_dom
- status: PASS
- evidence: elements=51; objectLeak=false

analyzeCodeBtn: analyzeCodeBtn
analyzeCommandBtn: analyzeCommandBtn
analyzeProjectProbeBtn: analyzeProjectProbeBtn
clearCodeBtn: clearCodeBtn
clearCommandBtn: clearCommandBtn
clearProjectAnalyzerBtn: clearProjectAnalyzerBtn
closeLargeDiagramBtn: closeLargeDiagramBtn
codeConfidenceReport: codeConfidenceReport code-confidence-report <div class="code-confidence-grid"><span class="code-confidence-chip confidence-exact"><strong>5</strong><small>확실</small></span><span class="code-confidence-chip confidence-inferred"><strong>1</strong><small>추정</small></span><span class="code-confidence-chip confidence-unsupported"><strong>0</strong><small>미지원</small></span></div><details class="code-unsupported-detail" ><summary>미지원/확인필요 함수·명령</summary><p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p></details>
codeDetectionDetails: codeDetectionDetails code-detection-details <div class="code-detection-head"><span class="code-detection-chip">선택: Python</span><span class="code-detection-chip strong">감지: Python</span></div><ul><li>사용자가 언어를 직접 선택했습니다.</li><li>Python 함수 정의가 보입니다.</li><li>Python 클래스 정의가 보입니다.</li><li>감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.</li></ul>
codeFlowAnalysisReport: codeFlowAnalysisReport code-flow-analysis-report <div class="code-flow-mini-grid"><span class="code-report-chip"><strong>2</strong><small>데이터 흐름</small></span><span class="code-report-chip"><strong>1</strong><small>호출 흐름</small></span><span class="code-report-chip"><strong>1</strong><small>함수 해석</small></span><span class="code-report-chip"><strong>0</strong><small>함수 목록</small></span></div><details open class="code-flow-detail"><summary>데이터 흐름</summary><ul><li><strong>line 5</strong> · 생성/저장 · u <span class="muted">· u에 User('Kim') 결과를 저장합니다. 사용: User.</span><div class="code-flow-pills"><span class="code-flow-pill produce">생성: u</span><span class="code-flow-pill consume">사용: User</span></div></li><li><strong>line 6</strong> · 생성/저장 · scores <span class="muted">· scores에 [3, 1, 2] 결과를 저장합니다.</span><div class="code-flow-pills"><span class="code-flow-pill produce">생성: scores</span></div></li></ul></details><details class="code-flow-detail"><summary>호출 흐름</summary><ul><li><strong>line 2</strong> · 정의 · __init__ <span class="muted">· 사용자 함수 정의입니다.</span></li></ul></details><details open class="code-flow-detail"><summary>함수 단위 해석</summary><article class="code-flow-item function-ir-card"><h4>__init__ <small>line 2</small></h4><p><strong>역할:</strong> User 클래스 안에서 객체의 동작을 담당하는 메서드로 보입니다.</p><p><strong>입력:</strong> self, name</p><p><strong>내부 변수:</strong></p><p class="muted">감지된 내부 변수가 없습니다.</p><p><strong>처리 흐름:</strong></p><ol><li>도식 핵심 신호: 입력값 중심으로 읽으면 됩니다.</li><li>도식 모드: 함수 흐름도입니다. 입력, 조건, 반복, 호출, 반환처럼 함수 내부 실행 순서를 보여주는 도식입니다.</li><li>self, name 값을 입력으로 받습니다.</li><li>함수 형태: Python 클래스 메서드입니다.</li><li>User 클래스 안에 들어 있는 메서드입니다.</li></ol><div class="code-flow-mini-grid"><span class="code-report-chip"><small>class_method</small></span><span class="code-report-chip"><small>function</small></span><span class="code-report-chip"><small>mermaid_function_flow</small></span><span class="code-report-chip"><small>mermaid_quality_mode</small></span><span class="code-report-chip"><small>parameter</small></span></

### renderer_assignment_candidates_count

- area: static_reference
- status: INFO
- evidence: candidateLines=22

code_explainer:523:title.textContent = card.title || card.id || "사이드카드"; || code_explainer:527:body.textContent = card.body || card.summary || card.description || ""; || code_explainer:533:summary.textContent = "자세히 보기"; || code_explainer:536:detailBody.textContent = card.detail || card.body || ""; || code_explainer:682:item.textContent = "line " + step.lineNo + " · " + riskLabel(step.risk) + " · " + step.title + " · " + step.code; || code_explainer:3363:box.innerHTML = rendered && rendered.svg ? rendered.svg : '<p class="muted">렌더링 결과가 비어 있습니다.</p>'; || code_explainer:4134:box.innerHTML = rendered && rendered.svg ? rendered.svg : ""; || code_explainer:4732:diagram.innerHTML = result.svg; || code_explainer:4814:summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' + || code_explainer:4888:summary.textContent = "아직 분석한 코드가 없습니다."; || code_explainer:4892:warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다."; || code_explainer:4894:if (steps) steps.innerHTML = ""; || code_explainer:5002:body.innerHTML = svg; || command_explainer:1146:box.innerHTML = result.warnings.map(function(step) { || command_explainer:1896:box.innerHTML = dangerGuideHtmlV286 + safetyChecklistHtmlV290 + actionGuideHtmlV285 + result.steps.map(function(step, index) { || command_explainer:1924:box.innerHTML = result.nextChecks.map(function(check) { || command_explainer:1989:summary.textContent = "아직 분석한 명령어가 없습니다."; || command_explainer:1993:warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다."; || command_explainer:1995:if (steps) steps.innerHTML = ""; || project_analyzer:758:diagram.innerHTML = result.svg; || project_analyzer:2099:summary.innerHTML = || project_analyzer:2222:summary.textContent = "아직 분석 결과가 없습니다.";

## Decision

No `[object Object]` leak was observed in the targeted runtime render samples. Keep the static candidate list as watch items, but do not patch renderer code from static suspicion alone.
