# V334-A11A Visible Analyzer Korean Locator

Purpose: locate Korean strings still visible in Code/Command/Project analyzer outputs after A10W.

## Summary

| metric | value |
|---|---:|
| total hits | 310 |

## By class

| class | hits |
|---|---:|
| code_explainer_rules | 145 |
| code_explainer | 95 |
| command_explainer | 27 |
| pwa_html | 17 |
| app_js | 15 |
| project_analyzer | 11 |

## By file

| file | hits |
|---|---:|
| src/pwa/code_explainer_rules.js | 145 |
| src/pwa/code_explainer.js | 95 |
| src/pwa/command_explainer.js | 27 |
| src/pwa/index.html | 17 |
| src/pwa/app.js | 15 |
| src/pwa/project_analyzer.js | 11 |

## Hits

### src/pwa/code_explainer.js:168

- class: code_explainer
- patterns: 검증

    - 검증 명령을 실행합니다.

### src/pwa/code_explainer.js:226

- class: code_explainer
- patterns: 추정

    auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",

### src/pwa/code_explainer.js:284

- class: code_explainer
- patterns: 자동감지로 코드 모양을 판별했습니다

    add(codeExplainerTextV334A11B("자동감지로 코드 모양을 판별했습니다.", "Automatic detection identified the code shape."));

### src/pwa/code_explainer.js:327

- class: code_explainer
- patterns: 줄

    if (/^\s*FROM\s+\S+/m.test(text)) add("Dockerfile FROM 베이스 이미지 줄이 보입니다.");

### src/pwa/code_explainer.js:338

- class: code_explainer
- patterns: 줄

    if (/^\s*-r\s+\S+/m.test(text)) add("다른 requirements 파일을 포함하는 줄이 보입니다.");

### src/pwa/code_explainer.js:372

- class: code_explainer
- patterns: 감지가 애매하면

    add(codeExplainerTextV334A11B("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.", "If detection seems uncertain, choose the language manually from the dropdown and analyze again."));

### src/pwa/code_explainer.js:387

- class: code_explainer
- patterns: 선택:

    '<span class="code-detection-chip">' + codeExplainerTextV334A11B("선택: ", "Selected: ") + escapeHtml(requestedLabel) + '</span>' +

### src/pwa/code_explainer.js:388

- class: code_explainer
- patterns: 감지:

    '<span class="code-detection-chip strong">' + codeExplainerTextV334A11B("감지: ", "Detected: ") + escapeHtml(detectedLabel) + '</span>' +

### src/pwa/code_explainer.js:397

- class: code_explainer
- patterns: 주의

    if (risk === "medium") return codeExplainerTextV334A11B("주의", "Caution");

### src/pwa/code_explainer.js:398

- class: code_explainer
- patterns: 낮음

    return codeExplainerTextV334A11B("낮음", "Low");

### src/pwa/code_explainer.js:403

- class: code_explainer
- patterns: 규칙 일치

    if (confidence === "exact") return codeExplainerTextV334A11B("규칙 일치", "Rule matched");

### src/pwa/code_explainer.js:404

- class: code_explainer
- patterns: 추정, 추정 해석

    if (confidence === "inferred") return codeExplainerTextV334A11B("추정 해석", "Inferred");

### src/pwa/code_explainer.js:406

- class: code_explainer
- patterns: 추정, 추정 해석

    return codeExplainerTextV334A11B("추정 해석", "Inferred");

### src/pwa/code_explainer.js:502

- class: code_explainer
- patterns: 검증

    ["test", ["validate", "node --check", "pytest", "test", "regression", "검증"]],

### src/pwa/code_explainer.js:543

- class: code_explainer
- patterns: 검증

    if (keyword === "test" && /test|validation|regression|quality|검증/.test(text)) score += 6;

### src/pwa/code_explainer.js:595

- class: code_explainer
- patterns: 추천 카드

    summary.textContent = codeExplainerIsEnglishV334A11B() ? "Show " + cards.length + " recommended cards" : "추천 카드 " + cards.length + "개 보기";

### src/pwa/code_explainer.js:625

- class: code_explainer
- patterns: 확인할 명령어

    summary.textContent = codeExplainerIsEnglishV334A11B() ? "Show " + actions.length + " check commands" : "확인할 명령어 " + actions.length + "개 보기";

### src/pwa/code_explainer.js:766

- class: code_explainer
- patterns: 주의

    ? codeExplainerTextV334A11B("현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다.", "The caution/risk filter is on, so only those steps are shown.")

### src/pwa/code_explainer.js:776

- class: code_explainer
- patterns: 줄

    : '<p class="muted">현재 전체 단계 표시 중입니다. 화면이 무거우면 다시 120개만 보기로 줄일 수 있습니다.</p>');

### src/pwa/code_explainer.js:822

- class: code_explainer
- patterns: 주의

    ? '<p class="muted">' + codeExplainerTextV334A11B("현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.", "No caution/risk steps match the current filter. Turn off the filter to see the full explanation.") + '</p>'

### src/pwa/code_explainer.js:856

- class: code_explainer
- patterns: 주의, 위험/주의 명령

    box.textContent = codeExplainerTextV334A11B("위험/주의 명령은 감지되지 않았습니다.", "No caution/risky commands were detected.");

### src/pwa/code_explainer.js:1299

- class: code_explainer
- patterns: 줄

    summary: "명령줄 입력값을 정의하거나 읽는 CLI 처리입니다."

### src/pwa/code_explainer.js:1329

- class: code_explainer
- patterns: 줄

    variable.role = "명령줄 인자를 정의하고 읽기 위한 argparse 파서입니다.";

### src/pwa/code_explainer.js:1331

- class: code_explainer
- patterns: 줄

    variable.role = "사용자가 명령줄에서 입력한 옵션 값을 담는 객체입니다.";

### src/pwa/code_explainer.js:1351

- class: code_explainer
- patterns: 줄

    return "명령줄 옵션을 정의하고 parse_args로 사용자의 입력값을 읽어 준비하는 CLI 진입 함수로 보입니다.";

### src/pwa/code_explainer.js:2136

- class: code_explainer
- patterns: 줄

    hints.push("with open은 파일을 열고 작업이 끝나면 자동으로 닫아 주기 때문에, 파일 처리에서 실수를 줄이는 안전한 패턴입니다.");

### src/pwa/code_explainer.js:2178

- class: code_explainer
- patterns: 줄

    ir.roleSummary = "명령줄에서 받은 옵션으로 파일 경로를 정하고, 그 파일을 읽거나 처리하는 CLI 기반 파일 처리 함수로 보입니다.";

### src/pwa/code_explainer.js:2215

- class: code_explainer
- patterns: 줄

    hints.push("fetch와 await가 함께 있으면, 서버/API 요청이 끝날 때까지 기다린 뒤 응답 데이터를 다음 줄에서 처리합니다.");

### src/pwa/code_explainer.js:2465

- class: code_explainer
- patterns: 줄

    summary: "컴프리헨션으로 반복과 생성/필터링을 한 줄에 압축했습니다."

### src/pwa/code_explainer.js:2671

- class: code_explainer
- patterns: 검증

    ir.roleSummary = signals.classContext.name + " 클래스 안에서 조건을 검사하고 필요하면 예외를 발생시키는 검증 메서드로 보입니다.";

### src/pwa/code_explainer.js:2677

- class: code_explainer
- patterns: 검증

    ir.roleSummary = "조건을 검사하고 문제가 있으면 예외를 발생시키는 방어적 검증 함수로 보입니다.";

### src/pwa/code_explainer.js:3403

- class: code_explainer
- patterns: 줄

    "argparse": ["argparse", "cli", "명령줄", "인자"],

### src/pwa/code_explainer.js:3404

- class: code_explainer
- patterns: 줄

    "cli": ["cli", "명령줄", "터미널", "인자"]

### src/pwa/code_explainer.js:3445

- class: code_explainer
- patterns: 줄

    if (keyword === "argparse" && /argparse|cli|command line|명령줄|인자|터미널/.test(text)) score += 8;

### src/pwa/code_explainer.js:3446

- class: code_explainer
- patterns: 줄

    if (keyword === "cli" && /cli|command|terminal|명령어|명령줄|터미널|인자/.test(text)) score += 8;

### src/pwa/code_explainer.js:3807

- class: code_explainer
- patterns: 데이터 흐름

    if (skeleton.signals.hasStorage) signalItems.push("저장/JSON 데이터 흐름 포함");

### src/pwa/code_explainer.js:3816

- class: code_explainer
- patterns: 함수 목록

    '<p class="code-report-categories">기본 해석은 앞쪽 함수 몇 개가 아니라, 전체 파일의 함수 역할 분포를 먼저 보여줍니다. 세부 흐름은 아래 함수 목록에서 하나를 선택해 확인합니다.</p>' +

### src/pwa/code_explainer.js:4214

- class: code_explainer
- patterns: 줄

    '<p class="code-report-categories">너무 흔한 보조 호출은 줄이고, 실제 읽기 순서에 도움이 되는 호출만 성격별로 묶었습니다.</p>' +

### src/pwa/code_explainer.js:4379

- class: code_explainer
- patterns: 함수 목록

    return '<details class="code-flow-detail function-picker-v259 function-picker-filter-v260"><summary>함수 목록 / 선택 해석 · 전체 ' +

### src/pwa/code_explainer.js:4541

- class: code_explainer
- patterns: 버전관리

    if (/^git\s+/i.test(t)) addOutlineItem(outline, lineNo, "Git 작업", t.split(/\s+/).slice(0, 3).join(" "), "버전관리 명령");

### src/pwa/code_explainer.js:4580

- class: code_explainer
- patterns: 파일/경로

    if (has("파일/경로") || has("저장소") || has("DB")) order.push("3. 파일, 저장소, DB처럼 데이터가 들어오고 나가는 지점을 확인합니다.");

### src/pwa/code_explainer.js:4581

- class: code_explainer
- patterns: 검증

    if (has("조건") || has("반복") || has("검증")) order.push("4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다.");

### src/pwa/code_explainer.js:4586

- class: code_explainer
- patterns: 주의

    order.push("2. 그다음 위험/주의 단계와 출력 지점을 확인합니다.");

### src/pwa/code_explainer.js:4637

- class: code_explainer
- patterns: 주의 구간, 주의

    ? '<p class="code-structure-warning">' + codeExplainerTextV334A11B("주의 구간: ", "Caution section: ") + escapeHtml(warningLines.join(" / ")) + '</p>'

### src/pwa/code_explainer.js:4638

- class: code_explainer
- patterns: 주의

    : '<p class="muted">' + codeExplainerTextV334A11B("주의/위험 구간은 별도로 감지되지 않았습니다.", "No separate caution/risk section was detected.") + '</p>';

### src/pwa/code_explainer.js:4642

- class: code_explainer
- patterns: 줄

    '<span><strong>' + stats.lineCount + '</strong><small>' + codeExplainerTextV334A11B("줄", "lines") + '</small></span>' +

### src/pwa/code_explainer.js:4643

- class: code_explainer
- patterns: 줄, 내용 줄

    '<span><strong>' + stats.nonEmptyCount + '</strong><small>' + codeExplainerTextV334A11B("내용 줄", "content lines") + '</small></span>' +

### src/pwa/code_explainer.js:4644

- class: code_explainer
- patterns: 줄, 주석/문서 줄

    '<span><strong>' + stats.commentLikeCount + '</strong><small>' + codeExplainerTextV334A11B("주석/문서 줄", "comment/doc lines") + '</small></span>' +

### src/pwa/code_explainer.js:4645

- class: code_explainer
- patterns: 글자

    '<span><strong>' + stats.charCount + '</strong><small>' + codeExplainerTextV334A11B("글자", "characters") + '</small></span>' +

### src/pwa/code_explainer.js:4647

- class: code_explainer
- patterns: 주요 분류

    '<p class="code-structure-categories">' + codeExplainerTextV334A11B("주요 분류: ", "Main categories: ") + escapeHtml(overview.topCategories || codeExplainerTextV334A11B("분류 없음", "none")) + '</p>' +

### src/pwa/code_explainer.js:4648

- class: code_explainer
- patterns: 주요 태그

    '<p class="code-structure-categories">' + codeExplainerTextV334A11B("주요 태그: ", "Main tags: ") + escapeHtml(overview.topTags || codeExplainerTextV334A11B("태그 없음", "none")) + '</p>' +

### src/pwa/code_explainer.js:4649

- class: code_explainer
- patterns: 주요 함수/구간

    '<details class="code-structure-detail"><summary>' + codeExplainerTextV334A11B("주요 함수/구간", "Main functions/sections") + '</summary>' + outlineHtml + '</details>' +

### src/pwa/code_explainer.js:4650

- class: code_explainer
- patterns: 추천 읽는 순서

    '<details class="code-structure-detail"><summary>' + codeExplainerTextV334A11B("추천 읽는 순서", "Recommended reading order") + '</summary>' + orderHtml + '</details>' +

### src/pwa/code_explainer.js:4662

- class: code_explainer
- patterns: 선택:

    lines.push("입력 선택: " + languageLabel(result.requestedLanguage));

### src/pwa/code_explainer.js:4670

- class: code_explainer
- patterns: 줄, 주의

    lines.push("주의/위험 줄: " + warnings.length);

### src/pwa/code_explainer.js:4674

- class: code_explainer
- patterns: 확실, 추정, 미지원

    lines.push("확신도: 확실 " + (confidence.exact || 0) + " / 추정 " + (confidence.inferred || 0) + " / 미지원 " + (confidence.unsupported || 0));

### src/pwa/code_explainer.js:4677

- class: code_explainer
- patterns: 미지원, 미지원/확인필요

    lines.push("미지원/확인필요:");

### src/pwa/code_explainer.js:4688

- class: code_explainer
- patterns: 데이터 흐름

    lines.push("[데이터 흐름]");

### src/pwa/code_explainer.js:4698

- class: code_explainer
- patterns: 호출 흐름

    lines.push("[호출 흐름]");

### src/pwa/code_explainer.js:4720

- class: code_explainer
- patterns: 줄, 글자

    lines.push("원본 규모: " + overview.stats.lineCount + "줄 / 내용 " + overview.stats.nonEmptyCount + "줄 / 글자 " + overview.stats.charCount);

### src/pwa/code_explainer.js:4721

- class: code_explainer
- patterns: 주요 분류

    lines.push("주요 분류: " + (overview.topCategories || "분류 없음"));

### src/pwa/code_explainer.js:4722

- class: code_explainer
- patterns: 주요 태그

    lines.push("주요 태그: " + (overview.topTags || "태그 없음"));

### src/pwa/code_explainer.js:4724

- class: code_explainer
- patterns: 주요 함수/구간

    lines.push("주요 함수/구간:");

### src/pwa/code_explainer.js:4730

- class: code_explainer
- patterns: 추천 읽는 순서

    lines.push("추천 읽는 순서:");

### src/pwa/code_explainer.js:4749

- class: code_explainer
- patterns: 주의

    lines.push("[주의/위험 명령]");

### src/pwa/code_explainer.js:4979

- class: code_explainer
- patterns: 주의

    '<p><strong>주의할 점</strong><br>파일 경로나 JSON 형식이 틀리면 읽기 단계에서 오류가 날 수 있습니다.</p>' +

### src/pwa/code_explainer.js:5032

- class: code_explainer
- patterns: 글자

    text: "글자 데이터",

### src/pwa/code_explainer.js:5037

- class: code_explainer
- patterns: 줄

    rows: "표나 CSV에서 여러 줄 데이터",

### src/pwa/code_explainer.js:5038

- class: code_explainer
- patterns: 줄

    row: "표나 CSV에서 한 줄 데이터",

### src/pwa/code_explainer.js:5047

- class: code_explainer
- patterns: 줄

    line: "파일에서 읽은 한 줄",

### src/pwa/code_explainer.js:5048

- class: code_explainer
- patterns: 줄

    lines: "파일에서 읽은 여러 줄"

### src/pwa/code_explainer.js:5187

- class: code_explainer
- patterns: 줄

    ? '<p class="code-report-categories">긴 코드 모드: ' + steps.length + '개 단계 / ' + lineCount + '줄. 화면에는 핵심 앞부분을 우선 보여주고, 전체 흐름은 리포트와 Mermaid 원문으로 확인합니다.</p>'

### src/pwa/code_explainer.js:5192

- class: code_explainer
- patterns: 기존 숫자 요약 보기

    '<details class="code-detail-legacy-summary-v328-a1"><summary>' + codeExplainerTextV334A11B("기존 숫자 요약 보기", "Show previous numeric summary") + '</summary>' +

### src/pwa/code_explainer.js:5195

- class: code_explainer
- patterns: 주의

    '<span class="code-report-chip"><strong>' + warnings.length + '</strong><small>' + codeExplainerTextV334A11B("위험/주의", "caution/risk") + '</small></span>' +

### src/pwa/code_explainer.js:5196

- class: code_explainer
- patterns: 미지원

    '<span class="code-report-chip"><strong>' + (confidence.unsupported || 0) + '</strong><small>' + codeExplainerTextV334A11B("미지원", "unsupported") + '</small></span>' +

### src/pwa/code_explainer.js:5215

- class: code_explainer
- patterns: 미지원

    : '<p class="muted">' + codeExplainerTextV334A11B("미지원 함수/명령은 따로 감지되지 않았습니다.", "No unsupported functions/commands were detected.") + '</p>';

### src/pwa/code_explainer.js:5219

- class: code_explainer
- patterns: 확실

    '<span class="code-confidence-chip confidence-exact"><strong>' + (confidence.exact || 0) + '</strong><small>' + codeExplainerTextV334A11B("확실", "exact") + '</small></span>' +

### src/pwa/code_explainer.js:5220

- class: code_explainer
- patterns: 추정

    '<span class="code-confidence-chip confidence-inferred"><strong>' + (confidence.inferred || 0) + '</strong><small>' + codeExplainerTextV334A11B("추정", "inferred") + '</small></span>' +

### src/pwa/code_explainer.js:5221

- class: code_explainer
- patterns: 미지원

    '<span class="code-confidence-chip confidence-unsupported"><strong>' + (confidence.unsupported || 0) + '</strong><small>' + codeExplainerTextV334A11B("미지원", "unsupported") + '</small></span>' +

### src/pwa/code_explainer.js:5224

- class: code_explainer
- patterns: 미지원, 미지원/확인필요

    '<summary>' + codeExplainerTextV334A11B("미지원/확인필요 함수·명령", "Unsupported / needs-check functions or commands") + '</summary>' +

### src/pwa/code_explainer.js:5273

- class: code_explainer
- patterns: 데이터 흐름

    '<span class="code-report-chip"><strong>' + dataFlow.length + '</strong><small>' + codeExplainerTextV334A11B("데이터 흐름", "data flow") + '</small></span>' +

### src/pwa/code_explainer.js:5274

- class: code_explainer
- patterns: 호출 흐름

    '<span class="code-report-chip"><strong>' + callFlow.length + '</strong><small>' + codeExplainerTextV334A11B("호출 흐름", "call flow") + '</small></span>' +

### src/pwa/code_explainer.js:5275

- class: code_explainer
- patterns: 함수 해석

    '<span class="code-report-chip"><strong>' + functionInterpretations.length + '</strong><small>' + codeExplainerTextV334A11B("함수 해석", "function explanations") + '</small></span>' +

### src/pwa/code_explainer.js:5276

- class: code_explainer
- patterns: 함수 목록

    '<span class="code-report-chip"><strong>' + functionOutlineV259.length + '</strong><small>' + codeExplainerTextV334A11B("함수 목록", "function list") + '</small></span>' +

### src/pwa/code_explainer.js:5281

- class: code_explainer
- patterns: 데이터 흐름

    '<details class="code-flow-detail"><summary>' + codeExplainerTextV334A11B("데이터 흐름", "Data flow") + '</summary>' +

### src/pwa/code_explainer.js:5284

- class: code_explainer
- patterns: 호출 흐름

    '<details class="code-flow-detail"><summary>' + codeExplainerTextV334A11B("호출 흐름", "Call flow") + '</summary>' +

### src/pwa/code_explainer.js:5285

- class: code_explainer
- patterns: 호출 흐름

    renderFlowList(callFlow, codeExplainerTextV334A11B("함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다.", "No clear function definition/call flow was detected.")) +

### src/pwa/code_explainer.js:5346

- class: code_explainer
- patterns: 흐름도는 필요할 때 펼쳐서 봅니다

    '<strong>' + codeExplainerTextV334A11B("흐름도는 필요할 때 펼쳐서 봅니다", "Open the flowchart only when needed") + '</strong>' +

### src/pwa/code_explainer.js:5347

- class: code_explainer
- patterns: 기본 화면에서는 그림을 바로 펼치지 않습니다

    '<p class="muted">' + (codeExplainerIsEnglishV334A11B() ? "The diagram is not expanded by default. Read the code first, then generate the diagram below when you need the flow. Detected steps: " + stepCount + "." : "기본 화면에서는 그림을 바로 펼치지 않습니다. 코드를 먼저 읽고, 흐름이 필요할 때 아래 버튼으로 그림을 생성하세요. 감지된 단계는 " + stepCount + "개입니다.") + '</p>';

### src/pwa/code_explainer.js:5352

- class: code_explainer
- patterns: 흐름도 보기

    button.textContent = codeExplainerTextV334A11B("흐름도 보기", "Show flowchart");

### src/pwa/code_explainer.js:5361

- class: code_explainer
- patterns: 흐름도 대기 중

    if (status) status.textContent = codeExplainerTextV334A11B("흐름도 대기 중", "Flowchart waiting");

### src/pwa/code_explainer.js:5490

- class: code_explainer
- patterns: 줄, 주요 분류

    quick.textContent = codeExplainerTextV334A11B("분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.", "After analysis, step count, risky lines, and main categories will be summarized.");

### src/pwa/code_explainer.js:5494

- class: code_explainer
- patterns: 확실, 추정, 미지원

    confidence.textContent = codeExplainerTextV334A11B("분석하면 확실/추정/미지원 단계가 표시됩니다.", "After analysis, exact, inferred, and unsupported steps will be shown.");

### src/pwa/code_explainer.js:5498

- class: code_explainer
- patterns: 데이터 흐름, 호출 흐름

    flowAnalysis.textContent = codeExplainerTextV334A11B("분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.", "After analysis, data flow and function call flow will be shown.");

### src/pwa/code_explainer.js:5502

- class: code_explainer
- patterns: 주요 함수/구간

    structure.textContent = codeExplainerTextV334A11B("긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.", "After analyzing long code, the overall structure, main functions/sections, and reading order will be shown.");

### src/pwa/code_explainer_rules.js:67

- class: code_explainer_rules
- patterns: 줄

    // 닫는 중괄호/괄호만 있는 줄은 설명 step으로 만들지 않는다.

### src/pwa/code_explainer_rules.js:70

- class: code_explainer_rules
- patterns: 줄

    // JS/Workers 객체 리터럴의 단순 키 시작 줄은 실제 동작이 아니라 구조 보조 줄이다.

### src/pwa/code_explainer_rules.js:272

- class: code_explainer_rules
- patterns: 변수에 값 저장

    if (/변수에 값 저장|값 반환|값 돌려주기|Markdown 문단|YAML 설정|TOML 설정|INI 설정|객체 속성 설정|문자열 데이터 항목|예제 코드 문자열|블록\/객체 닫기|딕셔너리 항목 설정|함수 호출|입력 파라미터 선언|문자열\/HTML 조각|예제\/문서 문자열|객체\/배열 값 항목|변수 선언|오류 발생|반복 다음 항목으로 이동|코드블록 경계|예제 명령 문자열|배열 데이터 항목|조건부 UI 조각|반응형 화면 조건 확인|DOM 스타일 설정|중첩 객체 값 갱신|배열\/문자열 길이 계산|객체 메서드 호출|블록\/콜백 닫기|조건\/표현식 경계|정규식 조건 검사|UI 조각 연결|콜백 결과 저장|Blob 파일 데이터 생성|화면\/콘솔에 출력|메서드 체인 이어쓰기/.test(t)) {

### src/pwa/code_explainer_rules.js:280

- class: code_explainer_rules
- patterns: 확실

    if (confidence === "exact") return codeRuleTextV334A11B("확실", "exact");

### src/pwa/code_explainer_rules.js:281

- class: code_explainer_rules
- patterns: 추정

    if (confidence === "inferred") return codeRuleTextV334A11B("추정", "inferred");

### src/pwa/code_explainer_rules.js:282

- class: code_explainer_rules
- patterns: 미지원

    if (confidence === "unsupported") return codeRuleTextV334A11B("미지원", "unsupported");

### src/pwa/code_explainer_rules.js:283

- class: code_explainer_rules
- patterns: 추정

    return codeRuleTextV334A11B("추정", "inferred");

### src/pwa/code_explainer_rules.js:345

- class: code_explainer_rules
- patterns: 작업 폴더 이동

    return makeStep(lineNo, t, codeRuleTextV334A11B("작업 폴더 이동", "Change working directory"), codeRuleTextV334A11B("이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", "This changes the working directory from which later commands will run."), risk);

### src/pwa/code_explainer_rules.js:353

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);

### src/pwa/code_explainer_rules.js:362

- class: code_explainer_rules
- patterns: 시간값을 변수에 저장

    return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);

### src/pwa/code_explainer_rules.js:377

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:396

- class: code_explainer_rules
- patterns: 줄, 변수에 값 저장

    return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);

### src/pwa/code_explainer_rules.js:404

- class: code_explainer_rules
- patterns: 스크립트를

    return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:417

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);

### src/pwa/code_explainer_rules.js:420

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);

### src/pwa/code_explainer_rules.js:423

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:429

- class: code_explainer_rules
- patterns: 파이프라인 처리

    return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);

### src/pwa/code_explainer_rules.js:435

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);

### src/pwa/code_explainer_rules.js:476

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);

### src/pwa/code_explainer_rules.js:503

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);

### src/pwa/code_explainer_rules.js:516

- class: code_explainer_rules
- patterns: 파일/폴더 복사

    return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);

### src/pwa/code_explainer_rules.js:525

- class: code_explainer_rules
- patterns: ZIP 압축 생성

    return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);

### src/pwa/code_explainer_rules.js:549

- class: code_explainer_rules
- patterns: 스크립트를, 검증

    return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);

### src/pwa/code_explainer_rules.js:573

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);

### src/pwa/code_explainer_rules.js:582

- class: code_explainer_rules
- patterns: 주의

    return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:597

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);

### src/pwa/code_explainer_rules.js:614

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:617

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);

### src/pwa/code_explainer_rules.js:620

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:636

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:659

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:662

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:676

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:679

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);

### src/pwa/code_explainer_rules.js:690

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);

### src/pwa/code_explainer_rules.js:735

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:745

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:749

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:894

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "CSV 딕셔너리 읽기", "CSV의 첫 줄을 컬럼명으로 보고 각 행을 딕셔너리 형태로 읽습니다. 컬럼 이름 오타를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:906

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "CSV 헤더 쓰기", "CSV 파일의 첫 줄에 컬럼명을 기록합니다.", risk);

### src/pwa/code_explainer_rules.js:948

- class: code_explainer_rules
- patterns: 파일/경로

    return makeStep(lineNo, t, "파일/경로 처리", "pathlib 기반으로 파일 경로를 만들거나 파일을 읽고 씁니다.", risk);

### src/pwa/code_explainer_rules.js:964

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 의존성 주입", "요청 처리 전에 인증, DB 연결, 공통 검증 같은 보조 함수를 실행해 결과를 함수 인자로 넣습니다.", risk);

### src/pwa/code_explainer_rules.js:967

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 요청값 검증 설정", "쿼리 문자열, 요청 본문, 경로 파라미터의 기본값과 검증 조건을 설정합니다. 필수 여부와 기본값을 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:977

- class: code_explainer_rules
- patterns: 줄, 검증

    return makeStep(lineNo, t, "딕셔너리 항목 설정", "딕셔너리 안에서 키와 값을 연결하는 데이터 줄입니다. 검증 항목 이름과 검사 결과를 묶어 저장할 때 자주 나옵니다.", risk);

### src/pwa/code_explainer_rules.js:983

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "화면에 출력", "괄호 안 값을 콘솔 화면에 보여줍니다. 중간 결과를 확인하거나 프로그램이 계산한 값을 사용자에게 보여줄 때 사용합니다.", risk);

### src/pwa/code_explainer_rules.js:986

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "검증 함수 호출", "검증 스크립트 안에서 미리 정의된 보조 함수를 실행합니다. 명령 실행, 조건 확인, 메인 흐름 시작처럼 검증 절차를 묶어 호출할 때 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:1010

- class: code_explainer_rules
- patterns: 변수에 값 저장

    return makeStep(lineNo, t, "변수에 값 저장", "왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1021

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Python 코드 실행", "이 줄은 Python 코드입니다. 위에서 아래로 순서대로 실행됩니다.", risk);

### src/pwa/code_explainer_rules.js:1041

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "엄격 모드 선언", "JavaScript 파일을 더 엄격한 규칙으로 실행하게 하는 선언입니다. 실수로 전역 변수를 만들거나 조용히 넘어가는 오류를 줄이는 데 도움이 됩니다.", risk);

### src/pwa/code_explainer_rules.js:1050

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Node.js 경로 처리", "path 모듈로 파일 경로를 안전하게 합치거나 파일명, 폴더명, 확장자를 계산합니다. Windows와 Linux 경로 차이를 줄이는 데 도움이 됩니다.", risk);

### src/pwa/code_explainer_rules.js:1070

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "블록/콜백 닫기", "앞에서 시작한 객체, 함수, 콜백, 예제 문자열 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다.", risk);

### src/pwa/code_explainer_rules.js:1073

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "조건/표현식 경계", "여러 줄로 나뉜 조건식이나 삼항 연산자 표현식을 마무리하는 경계 줄입니다. 앞줄의 조건과 함께 읽어야 합니다.", risk);

### src/pwa/code_explainer_rules.js:1076

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "정규식 조건 검사", "정규식으로 문자열 형태를 검사하거나 특정 패턴을 찾습니다. 파일명, 코드펜스, 설정 줄처럼 형식 판별에 자주 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:1082

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "UI 조각 연결", "앞뒤 HTML 문자열 조각을 이어 붙이거나 이미 만든 조각을 결과에 포함합니다. 화면 렌더링 문자열을 조립하는 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1094

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "메서드 체인 이어쓰기", "앞줄의 문자열, 배열, 스트림 처리 결과에 메서드를 이어 붙입니다. 여러 줄 체인에서는 앞 단계의 결과가 이 줄로 넘어옵니다.", risk);

### src/pwa/code_explainer_rules.js:1097

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "예제 코드 문자열", "JavaScript 파일 안에 샘플로 들어 있는 Python, Java 같은 다른 언어 코드입니다. 현재 JavaScript로 직접 실행되는 줄이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1100

- class: code_explainer_rules
- patterns: 검증

    return makeStep(lineNo, t, "오류 발생", "조건이 맞지 않거나 검증에 실패했을 때 Error를 만들어 실행을 중단합니다. 실패 원인을 메시지로 남기는 방어 코드입니다.", risk);

### src/pwa/code_explainer_rules.js:1109

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "예제 명령 문자열", "JavaScript 파일 안에 들어 있는 PowerShell, npm, node, python 같은 예제 명령입니다. 현재 JavaScript 줄로 직접 실행되는 것이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1112

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "예제/문서 문자열", "문서, 설정 예시, .gitignore 예시처럼 문자열 안에 들어 있는 파일명이나 설정 줄입니다. 현재 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1121

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "조건부 UI 조각", "삼항 연산자의 ? 또는 : 쪽에 놓인 화면 문구나 HTML 조각입니다. 조건에 따라 어떤 문구를 보여줄지 나누는 부분입니다.", risk);

### src/pwa/code_explainer_rules.js:1133

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "배열/문자열 길이 계산", "앞에서 filter나 map 같은 처리를 끝낸 뒤 length로 개수를 계산하는 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1179

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "JSX 화면 구조", "React 컴포넌트가 화면에 보여줄 JSX 구조를 작성합니다. className은 CSS 클래스, onClick 같은 속성은 이벤트 처리 함수 연결에 쓰입니다.", risk);

### src/pwa/code_explainer_rules.js:1197

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다.", risk);

### src/pwa/code_explainer_rules.js:1200

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "문자열/HTML 조각", "화면에 넣을 HTML 문자열, 템플릿 문자열, 메시지 조각입니다. 실제 실행 명령이라기보다 UI 출력 내용을 조립하는 데이터 줄일 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1203

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "예제/문서 문자열", "JavaScript 문자열 안에 들어 있는 문서, 목록, 예제 코드 내용입니다. 현재 파일의 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1206

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다.", risk);

### src/pwa/code_explainer_rules.js:1209

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "객체 속성 설정", "객체 안에서 이름과 값을 연결하는 데이터 설정 줄입니다. 설정값, 예제 문자열, 화면 문구, 계산 결과를 담을 때 자주 나옵니다.", risk);

### src/pwa/code_explainer_rules.js:1212

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "객체/배열 초기화", "여러 설정값이나 항목을 담기 위해 객체나 배열을 새로 만듭니다. 이후 줄에서 속성과 항목이 채워지는지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:1233

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "객체/배열 값 항목", "객체나 배열 안에 들어가는 값 항목입니다. 앞뒤 줄의 중괄호나 대괄호와 함께 데이터 묶음을 구성합니다.", risk);

### src/pwa/code_explainer_rules.js:1236

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "예제 코드 문자열", "JavaScript 파일 안에 샘플로 들어 있는 다른 언어 코드나 설정 파일 내용입니다. 이 줄 자체가 현재 JavaScript로 실행되는 것이 아니라 화면 표시나 테스트 샘플로 쓰일 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1242

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "블록/객체 닫기", "앞에서 시작한 함수 호출, 객체, 배열, 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다.", risk);

### src/pwa/code_explainer_rules.js:1273

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "스케줄 실행 함수", "Cloudflare Workers Cron Trigger가 정해진 시간에 호출하는 scheduled 핸들러입니다. 보통 주기 작업, 백필, 큐 투입을 시작합니다.", risk);

### src/pwa/code_explainer_rules.js:1404

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "비동기 작업 대기", "Promise가 끝날 때까지 기다린 뒤 다음 줄을 실행합니다. 실패하면 catch로 넘어갈 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:1453

- class: code_explainer_rules
- patterns: 주의

    return makeStep(lineNo, t, "Node.js 환경변수 읽기", "Node.js 실행 환경에 설정된 환경변수를 읽습니다. API 주소, 실행 모드, 비밀키 이름처럼 코드 밖에서 주입되는 설정값을 확인할 때 자주 씁니다. 실제 비밀값을 코드나 화면에 그대로 출력하지 않도록 주의해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:1472

- class: code_explainer_rules
- patterns: 변수에 값 저장

    return makeStep(lineNo, t, "변수에 값 저장", "값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다.", risk);

### src/pwa/code_explainer_rules.js:1490

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, language === "workers" ? "Worker/JavaScript 코드 실행" : "JavaScript 코드 실행", "이 줄은 위에서 아래로 실행되는 JavaScript 코드입니다.", risk);

### src/pwa/code_explainer_rules.js:1546

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "JSON 설정 줄", "JSON 설정 파일의 한 줄입니다. key, value, 쉼표, 중괄호 구조가 맞는지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:1571

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "조회 조건 필터", "조건에 맞는 행만 남깁니다. 상태값, 날짜, id 같은 기준으로 결과를 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1610

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "SQL 줄 해석", "SQL 쿼리의 한 줄입니다. 데이터를 조회, 필터링, 묶기, 정렬하기 위한 문장인지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:1655

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Flex 배치 방식 설정", "flex 아이템의 방향, 줄바꿈, 크기 비율 같은 배치 방식을 정합니다.", risk);

### src/pwa/code_explainer_rules.js:1661

- class: code_explainer_rules
- patterns: 글자

    return makeStep(lineNo, t, "색상 설정", "글자색이나 배경색을 정해서 화면의 시각적 표현을 바꿉니다.", risk);

### src/pwa/code_explainer_rules.js:1664

- class: code_explainer_rules
- patterns: 줄, 글자

    return makeStep(lineNo, t, "글자 스타일 설정", "글자 크기, 굵기, 줄간격, 정렬 같은 텍스트 표현을 정합니다.", risk);

### src/pwa/code_explainer_rules.js:1676

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "CSS 줄 해석", "CSS 스타일시트의 한 줄입니다. 어떤 화면 요소의 모양이나 배치를 바꾸는지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:1730

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "텍스트 표시", "사용자에게 보여줄 문장이나 짧은 텍스트 조각을 화면에 배치합니다.", risk);

### src/pwa/code_explainer_rules.js:1745

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "HTML 줄 해석", "HTML 문서의 한 줄입니다. 화면 구조나 속성 설정에 어떤 역할을 하는지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:1786

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "package.json 설정", "Node/npm 프로젝트 설정 파일의 한 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1818

- class: code_explainer_rules
- patterns: 터미널 명령

    return makeStep(lineNo, t, "쉘 명령 실행", "CI 환경에서 npm, python 같은 터미널 명령을 실행합니다.", risk);

### src/pwa/code_explainer_rules.js:1824

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "GitHub Actions YAML 설정", "GitHub Actions 자동화 설정 파일의 한 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1842

- class: code_explainer_rules
- patterns: 주의

    return makeStep(lineNo, t, "이미지 빌드 중 명령 실행", "이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:1857

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Dockerfile 설정", "컨테이너 이미지를 만들기 위한 Dockerfile 설정 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1872

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, ".env 설정", ".env 파일의 환경설정 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1889

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Python 패키지 의존성", "pip install -r requirements.txt로 설치할 Python 패키지를 적은 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1915

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "pyproject.toml 설정", "Python 프로젝트 설정 파일의 한 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:1935

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "YAML 설정", "들여쓰기 구조로 값을 표현하는 YAML 설정 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:2002

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "INI 설정", "섹션과 key=value 구조로 쓰는 설정 파일의 한 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:2039

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "TOML 설정", "TOML 설정 파일의 한 줄입니다.", risk);

### src/pwa/code_explainer_rules.js:2064

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Optional null 처리", "값이 null일 수 있는 경우 Optional로 감싸고 기본값을 지정합니다. null 때문에 프로그램이 멈추는 일을 줄이는 방어 코드입니다.", risk);

### src/pwa/code_explainer_rules.js:2095

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "입출력 예외 처리", "파일 읽기/쓰기나 네트워크 입출력 중 발생할 수 있는 IOException을 처리합니다. 실패 시 사용자에게 어떤 메시지를 보여줄지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:2131

- class: code_explainer_rules
- patterns: 파일/경로

    return makeStep(lineNo, t, "파일/경로 처리", "Java NIO로 파일 경로를 만들거나 파일을 읽고 씁니다. 삭제/이동은 대상 경로를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:2163

- class: code_explainer_rules
- patterns: 줄

    return makeStep(lineNo, t, "Java 코드 실행", "이 줄은 Java 코드입니다. 중괄호 구조에 따라 실행 흐름이 정해집니다.", risk);

### src/pwa/code_explainer_rules.js:2237

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2337

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2368

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2376

- class: code_explainer_rules
- patterns: 검증

    if (/try|except|finally|raise|assert|예외|조건 검증/.test(codeTitle)) {

### src/pwa/code_explainer_rules.js:2443

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2541

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2556

- class: code_explainer_rules
- patterns: 버전관리

    category = "버전관리";

### src/pwa/code_explainer_rules.js:2559

- class: code_explainer_rules
- patterns: 검증

    if (/node --check|validate|pytest|test|검증|확인|status|diff/.test(text)) {

### src/pwa/code_explainer_rules.js:2560

- class: code_explainer_rules
- patterns: 검증

    category = category === "처리" ? "검증" : category;

### src/pwa/code_explainer_rules.js:2561

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2564

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2607

- class: code_explainer_rules
- patterns: 변수/값

    category = "변수/값";

### src/pwa/code_explainer_rules.js:2647

- class: code_explainer_rules
- patterns: 주요 흐름

    return "주요 흐름: " + ordered.join(" · ");

### src/pwa/code_explainer_rules.js:2671

- class: code_explainer_rules
- patterns: 단계로 나눠 해석했습니다, 주의가 필요한 단계, 주의

    return (names[language] || "코드") + "를 " + steps.length + "단계로 나눠 해석했습니다." + (risky ? " 주의가 필요한 단계가 " + risky + "개 있습니다." : " 특별히 높은 위험 명령은 감지되지 않았습니다.");

### src/pwa/code_explainer_rules.js:2692

- class: code_explainer_rules
- patterns: 파일/경로

    if (category === "DB" || category === "파일/경로" || category === "저장소" || category === "데이터변환" || category === "데이터처리") return "dataStep";

### src/pwa/code_explainer_rules.js:2734

- class: code_explainer_rules
- patterns: 주의

    const riskPrefix = step.risk === "high" ? "위험 · " : step.risk === "medium" ? "주의 · " : "";

### src/pwa/code_explainer_rules.js:2765

- class: code_explainer_rules
- patterns: 데이터 흐름

    lines.push("  subgraph DATA_FLOW[데이터 흐름]");

### src/pwa/code_explainer_rules.js:2821

- class: code_explainer_rules
- patterns: 호출 흐름

    lines.push("  subgraph CALL_FLOW[호출 흐름]");

### src/pwa/code_explainer_rules.js:3398

- class: code_explainer_rules
- patterns: 변수에 값 저장

    if (title === "변수에 값 저장") return;

### src/pwa/code_explainer_rules.js:3405

- class: code_explainer_rules
- patterns: 변수에 값 저장

    "변수에 값 저장",

### src/pwa/code_explainer_rules.js:3827

- class: code_explainer_rules
- patterns: 줄

    else steps.push(makeStep(lineNo, cleanLine(line), "코드 실행", "이 줄을 순서대로 실행합니다.", "low"));

### src/pwa/code_explainer_rules.js:4006

- class: code_explainer_rules
- patterns: 터미널 명령

    "PowerShell/CLI(터미널 명령) 확인",

### src/pwa/code_explainer_rules.js:4007

- class: code_explainer_rules
- patterns: 명령이 설치된 도구인지, 위험한 옵션

    command + " 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.",

### src/pwa/code_explainer_rules.js:4051

- class: code_explainer_rules
- patterns: 미지원

    "미지원 항목 확인",

### src/pwa/code_explainer_rules.js:4175

- class: code_explainer_rules
- patterns: 줄

    explain: "파일이 없을 때 text를 빈 문자열('')로 바꿉니다. 그래서 프로그램이 멈추지 않고 다음 줄로 넘어갑니다."

### src/pwa/code_explainer_rules.js:4226

- class: code_explainer_rules
- patterns: 주의

    explain: "Client에 api_key를 넣어 사용할 준비를 합니다. api_key는 보통 서비스 인증에 쓰이므로 노출에 주의해야 합니다."

### src/pwa/code_explainer_rules.js:4301

- class: code_explainer_rules
- patterns: 줄

    result.summary = "첫 줄은 Invoke-MysteryTool이라는 알 수 없는 도구를 실행합니다. 둘째 줄은 out 폴더의 항목에서 이름과 크기만 골라 보여줍니다. 첫 줄은 실행 전에 반드시 확인해야 합니다.";

### src/pwa/code_explainer_rules.js:4305

- class: code_explainer_rules
- patterns: 확실

    explain: "Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다."

### src/pwa/code_explainer_rules.js:4420

- class: code_explainer_rules
- patterns: 스크립트를, 단계로 나눠 해석했습니다

    return /코드를 \d+단계로 나눠 해석했습니다|스크립트를 \d+단계로 나눠 해석했습니다/.test(String(summary || ""));

### src/pwa/code_explainer_rules.js:4501

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A2(action && action.title));

### src/pwa/code_explainer_rules.js:4648

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A3(action && action.title));

### src/pwa/code_explainer_rules.js:4701

- class: code_explainer_rules
- patterns: 글자

    explain: targetSelector + " 요소의 textContent를 '" + textValue + "'로 바꿉니다. 즉 화면에 보이는 글자가 바뀝니다."

### src/pwa/code_explainer_rules.js:4837

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A4(action && action.title));

### src/pwa/code_explainer_rules.js:4862

- class: code_explainer_rules
- patterns: 줄

    result.summary = folder + " 폴더에서 " + filter + " 파일을 찾고, 그 안에서 '" + pattern + "' 문자가 들어간 줄만 찾습니다. 마지막에는 " + fieldText + " 열만 골라 보여줍니다.";

### src/pwa/code_explainer_rules.js:4870

- class: code_explainer_rules
- patterns: 줄

    title: "'" + pattern + "'가 들어간 줄 찾기",

### src/pwa/code_explainer_rules.js:4871

- class: code_explainer_rules
- patterns: 줄

    explain: "Select-String \"" + pattern + "\"은 앞 단계에서 넘어온 파일 내용 중 '" + pattern + "' 문자가 들어간 줄만 찾습니다."

### src/pwa/code_explainer_rules.js:4874

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 열 선택",

### src/pwa/code_explainer_rules.js:4884

- class: code_explainer_rules
- patterns: 줄

    result.flow.roleSummary = "파일 목록을 찾고, 특정 문자열이 있는 줄만 골라낸 뒤, 필요한 열만 보여주는 PowerShell 파이프라인입니다.";

### src/pwa/code_explainer_rules.js:4924

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 열 선택",

### src/pwa/code_explainer_rules.js:5130

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A5(action && action.title));

### src/pwa/code_explainer_rules.js:5190

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 개수 제한",

### src/pwa/code_explainer_rules.js:5474

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A6(action && action.title));

### src/pwa/code_explainer_rules.js:5501

- class: code_explainer_rules
- patterns: 줄

    explain: "display: flex 설정은 " + selector + " 안의 자식 요소들을 한 줄 레이아웃으로 배치할 때 쓰는 설정입니다."

### src/pwa/code_explainer_rules.js:5711

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A7(action && action.title));

### src/pwa/code_explainer_rules.js:5914

- class: code_explainer_rules
- patterns: 스크립트를

    explain: "npm test는 프로젝트의 테스트 스크립트를 실행해서 코드가 기대대로 동작하는지 확인합니다."

### src/pwa/command_explainer.js:101

- class: command_explainer
- patterns: 검증

    description: "가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",

### src/pwa/command_explainer.js:110

- class: command_explainer
- patterns: 검증

    label: "검증/커밋 루틴",

### src/pwa/command_explainer.js:112

- class: command_explainer
- patterns: 검증

    description: "검증 스크립트 실행 후 diff 확인, add, commit까지 이어지는 루틴입니다.",

### src/pwa/command_explainer.js:137

- class: command_explainer
- patterns: 검증

    description: "Bash/Shell에서 가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",

### src/pwa/command_explainer.js:167

- class: command_explainer
- patterns: 현재 셸 기본 PowerShell 예제

    label: "현재 셸 기본 PowerShell 예제",

### src/pwa/command_explainer.js:169

- class: command_explainer
- patterns: 현재 PowerShell 선택에 맞춘 기본 예제입니다

    description: "현재 PowerShell 선택에 맞춘 기본 예제입니다.",

### src/pwa/command_explainer.js:210

- class: command_explainer
- patterns: 줄, 분석하면 먼저 보여줄 안전 확인 그룹

    '<div class="command-sample-safety-title-v294">분석하면 먼저 보여줄 안전 확인 그룹</div>' +

### src/pwa/command_explainer.js:216

- class: command_explainer
- patterns: 예제를 불러와 분석하면

    '<div class="command-sample-safety-hint-v294">예제를 불러와 분석하면 결과 위쪽에 이 안전 확인 그룹들이 표시됩니다.</div>' +

### src/pwa/command_explainer.js:706

- class: command_explainer
- patterns: 줄

    fileImpact: "새 폴더를 생성합니다. -p는 중간 폴더가 없어도 같이 만들고, 이미 있으면 오류를 줄입니다.",

### src/pwa/command_explainer.js:859

- class: command_explainer
- patterns: 줄

    forceDelete: "강제 삭제는 확인을 줄이고 바로 지우는 방식이라 경로를 잘못 쓰면 복구가 어려울 수 있습니다.",

### src/pwa/command_explainer.js:1032

- class: command_explainer
- patterns: 주의

    if (risk === "caution") return "주의";

### src/pwa/command_explainer.js:1062

- class: command_explainer
- patterns: 줄

    fileImpact: "이 줄 자체는 보통 파일을 바꾸지 않고, 안쪽 명령의 실행 여부를 결정합니다.",

### src/pwa/command_explainer.js:1081

- class: command_explainer
- patterns: 줄

    meaning: "실행되지 않는 설명 줄입니다.",

### src/pwa/command_explainer.js:1160

- class: command_explainer
- patterns: 확실

    fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",

### src/pwa/command_explainer.js:1171

- class: command_explainer
- patterns: 줄

    fileImpact += " 현재 줄에는 -Recurse 또는 -Force가 있어 삭제 범위가 커질 수 있습니다.";

### src/pwa/command_explainer.js:1227

- class: command_explainer
- patterns: 주의

    text: "PowerShell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + dangerous + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."

### src/pwa/command_explainer.js:1258

- class: command_explainer
- patterns: 줄

    fileImpact: "이 줄 자체는 보통 파일을 바꾸지 않고, 안쪽 명령의 실행 여부를 결정합니다.",

### src/pwa/command_explainer.js:1277

- class: command_explainer
- patterns: 줄

    meaning: "실행되지 않는 설명 줄입니다.",

### src/pwa/command_explainer.js:1300

- class: command_explainer
- patterns: 확실

    fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",

### src/pwa/command_explainer.js:1310

- class: command_explainer
- patterns: 줄

    fileImpact += " 현재 줄은 rm 계열 삭제 명령이라 실행 전 경로를 반드시 확인해야 합니다.";

### src/pwa/command_explainer.js:1366

- class: command_explainer
- patterns: 주의

    text: "Bash/Shell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + danger + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."

### src/pwa/command_explainer.js:1409

- class: command_explainer
- patterns: 주의, 위험/주의 명령

    box.textContent = "위험/주의 명령이 없습니다.";

### src/pwa/command_explainer.js:1981

- class: command_explainer
- patterns: 공통 확인

    title: "공통 확인",

### src/pwa/command_explainer.js:1986

- class: command_explainer
- patterns: 삭제 계열

    title: "삭제 계열",

### src/pwa/command_explainer.js:1998

- class: command_explainer
- patterns: 줄

    reason: "sudo 같은 권한 명령은 시스템 범위에 영향을 줄 수 있어서 실행 주체를 먼저 확인해야 합니다."

### src/pwa/command_explainer.js:2075

- class: command_explainer
- patterns: 줄

    '<p>아래 명령은 삭제/초기화 명령이 아니라 현재 상태를 먼저 확인하는 안전 확인 명령입니다. 그룹별로 확인하면 실수 가능성을 줄일 수 있습니다.</p>' +

### src/pwa/command_explainer.js:2256

- class: command_explainer
- patterns: 미지원

    warnings: [{ line: 1, command: "미지원 셸", risk: "caution", fileImpact: "현재 V278은 PowerShell과 Bash/Shell 1차 해석만 지원합니다." }],

### src/pwa/project_analyzer.js:716

- class: project_analyzer
- patterns: 스크립트를

    items.push("코드해석/다이어그램 수정 시 src/pwa/index.html, code_explainer.js, code_explainer_rules.js, style.css, smoke/verify 스크립트를 같이 봐야 합니다.");

### src/pwa/project_analyzer.js:717

- class: project_analyzer
- patterns: 검증

    items.push("학습 카드 수정 시 data/lessons, data/side_cards, tools/validate_lessons.py를 함께 검증해야 합니다.");

### src/pwa/project_analyzer.js:802

- class: project_analyzer
- patterns: 검증

    verification_smoke: "검증/스모크"

### src/pwa/project_analyzer.js:1973

- class: project_analyzer
- patterns: 검증

    ["검증/스모크", firstBundle(["verification_smoke", "검증/스모크", "검증"])]

### src/pwa/project_analyzer.js:2057

- class: project_analyzer
- patterns: 검증

    "1. 구조도 표시 위치와 Mermaid 렌더링 검증",

### src/pwa/project_analyzer.js:2059

- class: project_analyzer
- patterns: 검증

    "3. 검증 통과 후 커밋, 태그, 푸시, GitHub Pages live 확인",

### src/pwa/project_analyzer.js:2061

- class: project_analyzer
- patterns: 주의

    "## 주의",

### src/pwa/project_analyzer.js:2063

- class: project_analyzer
- patterns: 검증

    "- .tmp는 probe/검증 산출물이므로 커밋하지 않는다.",

### src/pwa/project_analyzer.js:2064

- class: project_analyzer
- patterns: 검증

    "- 검증 전 커밋 금지.",

### src/pwa/project_analyzer.js:2219

- class: project_analyzer
- patterns: 프로젝트 루트를 입력하고

    if (command) command.textContent = "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.";

### src/pwa/project_analyzer.js:2228

- class: project_analyzer
- patterns: 분석 후 표시됩니다

    if (status) status.textContent = "분석 후 표시됩니다.";

### src/pwa/index.html:148

- class: pwa_html
- patterns: 데이터 흐름

    <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li>

### src/pwa/index.html:149

- class: pwa_html
- patterns: 터미널 명령

    <li>터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합</li>

### src/pwa/index.html:203

- class: pwa_html
- patterns: 주의

    위험/주의 단계만 보기

### src/pwa/index.html:211

- class: pwa_html
- patterns: 줄, 주요 분류

    <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div>

### src/pwa/index.html:212

- class: pwa_html
- patterns: 확실, 추정, 미지원

    <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>

### src/pwa/index.html:213

- class: pwa_html
- patterns: 데이터 흐름, 호출 흐름

    <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div>

### src/pwa/index.html:214

- class: pwa_html
- patterns: 주요 함수/구간

    <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div>

### src/pwa/index.html:215

- class: pwa_html
- patterns: 주의

    <h2>주의/위험 명령</h2>

### src/pwa/index.html:229

- class: pwa_html
- patterns: 흐름도는 필요할 때만 생성합니다, 흐름도 보기

    <p class="code-diagram-hint">흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.</p>

### src/pwa/index.html:274

- class: pwa_html
- patterns: 검증

    <option value="verify_commit_flow">검증/커밋 루틴</option>

### src/pwa/index.html:282

- class: pwa_html
- patterns: 검증

    <p id="commandModeHint" class="code-lang-hint">명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.</p>

### src/pwa/index.html:284

- class: pwa_html
- patterns: 여기에 PowerShell 명령을 붙여넣으세요

    <textarea id="commandInput" class="code-input" spellcheck="false" placeholder="여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status"></textarea>

### src/pwa/index.html:295

- class: pwa_html
- patterns: 주의, 위험/주의 명령

    <h2>위험/주의 명령</h2>

### src/pwa/index.html:334

- class: pwa_html
- patterns: 프로젝트 루트를 입력하고

    <pre id="projectProbeCommand" class="code-block project-command-box">프로젝트 루트를 입력하고 “명령 생성”을 누르세요.</pre>

### src/pwa/index.html:339

- class: pwa_html
- patterns: 최신 probe 터미널 출력

    <textarea id="projectProbeOutput" class="project-probe-output" spellcheck="false" placeholder="최신 probe 터미널 출력(PROJECT_PROBE_V248_OK 또는 PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, 또는 JSON 전체 내용을 붙여넣으세요."></textarea>

### src/pwa/index.html:353

- class: pwa_html
- patterns: 4. 구조도

    <h2>4. 구조도</h2>

### src/pwa/index.html:354

- class: pwa_html
- patterns: 분석 후 표시됩니다

    <span id="projectDiagramStatus" class="muted">분석 후 표시됩니다.</span>

### src/pwa/app.js:221

- class: app_js
- patterns: 줄

    definition: "dict에서 값을 꺼내되, key가 없을 때 기본값을 줄 수 있는 메서드다.",

### src/pwa/app.js:257

- class: app_js
- patterns: 줄

    definition: "JSON 문자열을 파이썬 dict/list로 바꾼다. JSONL을 한 줄씩 읽을 때 핵심이다.",

### src/pwa/app.js:265

- class: app_js
- patterns: 줄

    definition: "한 줄에 JSON 하나씩 저장하는 형식이다. LLM 학습 데이터, 로그, KG chunks/nodes/edges에 자주 쓰인다.",

### src/pwa/app.js:269

- class: app_js
- patterns: 줄

    definition: "파일 경로를 문자열보다 안전하게 다루는 표준 라이브러리다. Windows/Linux 경로 차이를 줄이는 데 도움이 된다.",

### src/pwa/app.js:1613

- class: app_js
- patterns: 데이터 흐름

    "전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음": "It does not precisely analyze full function call graphs or data flow",

