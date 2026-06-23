# V334-A10U Full PWA Visible Korean Locator

Purpose: expand A10T beyond app.js/index.html and locate Korean strings in all PWA source modules.

## Summary

| metric | value |
|---|---:|
| total Korean lines | 2567 |
| visible pattern hits | 229 |
| analyzer Korean lines | 2197 |

## By file class

| class | lines |
|---|---:|
| code_explainer | 1800 |
| command_explainer | 253 |
| app_js | 239 |
| project_analyzer | 144 |
| pwa_html | 120 |
| other_pwa_source | 11 |

## Top files

| file | lines |
|---|---:|
| src\pwa\code_explainer_rules.js | 1154 |
| src\pwa\code_explainer.js | 646 |
| src\pwa\command_explainer.js | 253 |
| src\pwa\app.js | 239 |
| src\pwa\project_analyzer.js | 144 |
| src\pwa\index.html | 120 |
| src\pwa\style.css | 8 |
| index.html | 3 |

## Visible-pattern hits

### src\pwa\app.js:665

- file_class: app_js
- line_class: visible_render_source
- patterns: 더 읽어보기

    title.textContent = "더 읽어보기";

### src\pwa\app.js:669

- file_class: app_js
- line_class: visible_render_source
- patterns: 외부 자료

    note.textContent = "외부 자료는 본문 복사 없이 링크와 출처만 연결합니다.";

### src\pwa\app.js:681

- file_class: app_js
- line_class: visible_render_source
- patterns: 외부 자료

    type.textContent = "외부 자료 · " + (resource.tier || "link") + " · " + (resource.language || "");

### src\pwa\app.js:1023

- file_class: app_js
- line_class: visible_render_source
- patterns: 자세히 보기

    detailBtn.textContent = "자세히 보기";

### src\pwa\app.js:1036

- file_class: app_js
- line_class: visible_render_source
- patterns: 자세히 보기

    detailBtn.textContent = "자세히 보기";

### src\pwa\app.js:1121

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 랜덤 배경지식

    "랜덤 배경지식",

### src\pwa\app.js:1125

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 랜덤 상식

    makeSideCard(randomCard, "랜덤 상식");

### src\pwa\app.js:1130

- file_class: app_js
- line_class: visible_render_source
- patterns: 다른 배경지식

    nextBtn.textContent = "다른 배경지식";

### src\pwa\app.js:1305

- file_class: app_js
- line_class: visible_render_source
- patterns: 맞힘, 헷갈림

    meta.textContent = "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;

### src\pwa\app.js:1452

- file_class: app_js
- line_class: visible_render_source
- patterns: 아직 저장된 메모가 없습니다

    box.innerHTML = '<p class="muted">아직 저장된 메모가 없습니다.</p>';

### src\pwa\app.js:1528

- file_class: app_js
- line_class: static_visible_html
- patterns: 전체 카드

    '<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">전체 카드</div></div>' +

### src\pwa\app.js:1529

- file_class: app_js
- line_class: static_visible_html
- patterns: 본 카드

    '<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">본 카드</div></div>' +

### src\pwa\app.js:1530

- file_class: app_js
- line_class: static_visible_html
- patterns: 맞힌 카드

    '<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">맞힌 카드</div></div>' +

### src\pwa\app.js:1531

- file_class: app_js
- line_class: static_visible_html
- patterns: 헷갈린 카드

    '<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">헷갈린 카드</div></div>';

### src\pwa\app.js:1547

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 본 카드, 맞힘, 헷갈림

    '<div class="level-row-meta">본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused + '</div>';

### src\pwa\app.js:1624

- file_class: app_js
- line_class: translation_or_data_map
- patterns: 주의

    "주의/위험 명령": "Caution/risky commands",

### src\pwa\app.js:1626

- file_class: app_js
- line_class: translation_or_data_map
- patterns: 더 읽어보기

    "해석 후 더 읽어보기": "Read more after analysis",

### src\pwa\app.js:1636

- file_class: app_js
- line_class: translation_or_data_map
- patterns: 주의

    "위험/주의 단계만 보기": "Show only caution/risk steps",

### src\pwa\app.js:1663

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 맞힘

    re: /^현재 L(.+) · 추천 L(.+) · 안 본 (.+) · 모르겠음 (.+) · 맞힘 (.+) \/ (.+)$/,

### src\pwa\app.js:1667

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 본 카드

    re: /^조건 일치 (.+)장 \/ 전체 (.+)장 · 본 카드 (.+)장 · 모르겠음 (.+)장$/,

### src\pwa\app.js:2526

- file_class: app_js
- line_class: static_visible_html
- patterns: 본 카드

    <option value="unseen">안 본 카드</option>

### src\pwa\app.js:2587

- file_class: app_js
- line_class: visible_render_source
- patterns: 본 카드

    status.textContent = "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";

### src\pwa\app.js:3236

- file_class: app_js
- line_class: unknown_ko_source
- patterns: 맞힘

    : "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;

### src\pwa\code_explainer.js:146

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    - 검증 명령을 실행합니다.

### src\pwa\code_explainer.js:204

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 추정

    auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",

### src\pwa\code_explainer.js:262

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 자동감지

    add("자동감지로 코드 모양을 판별했습니다.");

### src\pwa\code_explainer.js:350

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 감지가 애매하면

    add("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.");

### src\pwa\code_explainer.js:365

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 선택:

    '<span class="code-detection-chip">선택: ' + escapeHtml(requestedLabel) + '</span>' +

### src\pwa\code_explainer.js:366

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 감지:

    '<span class="code-detection-chip strong">감지: ' + escapeHtml(detectedLabel) + '</span>' +

### src\pwa\code_explainer.js:375

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 주의

    if (risk === "medium") return "주의";

### src\pwa\code_explainer.js:376

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 낮음

    return "낮음";

### src\pwa\code_explainer.js:381

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 규칙 일치

    if (confidence === "exact") return "규칙 일치";

### src\pwa\code_explainer.js:382

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 추정, 추정 해석

    if (confidence === "inferred") return "추정 해석";

### src\pwa\code_explainer.js:384

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 추정, 추정 해석

    return "추정 해석";

### src\pwa\code_explainer.js:480

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    ["test", ["validate", "node --check", "pytest", "test", "regression", "검증"]],

### src\pwa\code_explainer.js:521

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    if (keyword === "test" && /test|validation|regression|quality|검증/.test(text)) score += 6;

### src\pwa\code_explainer.js:573

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 추천 카드

    summary.textContent = "추천 카드 " + cards.length + "개 보기";

### src\pwa\code_explainer.js:603

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 확인할 명령어

    summary.textContent = "확인할 명령어 " + actions.length + "개 보기";

### src\pwa\code_explainer.js:691

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 자세히 보기

    summary.textContent = "자세히 보기";

### src\pwa\code_explainer.js:744

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주의

    ? "현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다."

### src\pwa\code_explainer.js:800

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주의

    ? '<p class="muted">현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.</p>'

### src\pwa\code_explainer.js:834

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 주의, 위험/주의 명령

    box.textContent = "위험/주의 명령은 감지되지 않았습니다.";

### src\pwa\code_explainer.js:2649

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    ir.roleSummary = signals.classContext.name + " 클래스 안에서 조건을 검사하고 필요하면 예외를 발생시키는 검증 메서드로 보입니다.";

### src\pwa\code_explainer.js:2655

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    ir.roleSummary = "조건을 검사하고 문제가 있으면 예외를 발생시키는 방어적 검증 함수로 보입니다.";

### src\pwa\code_explainer.js:3785

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 데이터 흐름

    if (skeleton.signals.hasStorage) signalItems.push("저장/JSON 데이터 흐름 포함");

### src\pwa\code_explainer.js:3794

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 함수 목록

    '<p class="code-report-categories">기본 해석은 앞쪽 함수 몇 개가 아니라, 전체 파일의 함수 역할 분포를 먼저 보여줍니다. 세부 흐름은 아래 함수 목록에서 하나를 선택해 확인합니다.</p>' +

### src\pwa\code_explainer.js:4357

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 함수 목록

    return '<details class="code-flow-detail function-picker-v259 function-picker-filter-v260"><summary>함수 목록 / 선택 해석 · 전체 ' +

### src\pwa\code_explainer.js:4519

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 버전관리

    if (/^git\s+/i.test(t)) addOutlineItem(outline, lineNo, "Git 작업", t.split(/\s+/).slice(0, 3).join(" "), "버전관리 명령");

### src\pwa\code_explainer.js:4558

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 파일/경로

    if (has("파일/경로") || has("저장소") || has("DB")) order.push("3. 파일, 저장소, DB처럼 데이터가 들어오고 나가는 지점을 확인합니다.");

### src\pwa\code_explainer.js:4559

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    if (has("조건") || has("반복") || has("검증")) order.push("4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다.");

### src\pwa\code_explainer.js:4564

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주의

    order.push("2. 그다음 위험/주의 단계와 출력 지점을 확인합니다.");

### src\pwa\code_explainer.js:4615

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주의 구간, 주의

    ? '<p class="code-structure-warning">주의 구간: ' + escapeHtml(warningLines.join(" / ")) + '</p>'

### src\pwa\code_explainer.js:4616

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주의

    : '<p class="muted">주의/위험 구간은 별도로 감지되지 않았습니다.</p>';

### src\pwa\code_explainer.js:4621

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 내용 줄

    '<span><strong>' + stats.nonEmptyCount + '</strong><small>내용 줄</small></span>' +

### src\pwa\code_explainer.js:4622

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주석/문서 줄

    '<span><strong>' + stats.commentLikeCount + '</strong><small>주석/문서 줄</small></span>' +

### src\pwa\code_explainer.js:4623

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 글자

    '<span><strong>' + stats.charCount + '</strong><small>글자</small></span>' +

### src\pwa\code_explainer.js:4625

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주요 분류

    '<p class="code-structure-categories">주요 분류: ' + escapeHtml(overview.topCategories || "분류 없음") + '</p>' +

### src\pwa\code_explainer.js:4626

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주요 태그

    '<p class="code-structure-categories">주요 태그: ' + escapeHtml(overview.topTags || "태그 없음") + '</p>' +

### src\pwa\code_explainer.js:4627

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 주요 함수/구간

    '<details class="code-structure-detail"><summary>주요 함수/구간</summary>' + outlineHtml + '</details>' +

### src\pwa\code_explainer.js:4628

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 추천 읽는 순서

    '<details class="code-structure-detail"><summary>추천 읽는 순서</summary>' + orderHtml + '</details>' +

### src\pwa\code_explainer.js:4640

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 선택:

    lines.push("입력 선택: " + languageLabel(result.requestedLanguage));

### src\pwa\code_explainer.js:4648

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    lines.push("주의/위험 줄: " + warnings.length);

### src\pwa\code_explainer.js:4652

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 확실, 추정, 미지원

    lines.push("확신도: 확실 " + (confidence.exact || 0) + " / 추정 " + (confidence.inferred || 0) + " / 미지원 " + (confidence.unsupported || 0));

### src\pwa\code_explainer.js:4655

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 미지원, 미지원/확인필요

    lines.push("미지원/확인필요:");

### src\pwa\code_explainer.js:4666

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 데이터 흐름

    lines.push("[데이터 흐름]");

### src\pwa\code_explainer.js:4676

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 호출 흐름

    lines.push("[호출 흐름]");

### src\pwa\code_explainer.js:4698

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 글자

    lines.push("원본 규모: " + overview.stats.lineCount + "줄 / 내용 " + overview.stats.nonEmptyCount + "줄 / 글자 " + overview.stats.charCount);

### src\pwa\code_explainer.js:4699

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주요 분류

    lines.push("주요 분류: " + (overview.topCategories || "분류 없음"));

### src\pwa\code_explainer.js:4700

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주요 태그

    lines.push("주요 태그: " + (overview.topTags || "태그 없음"));

### src\pwa\code_explainer.js:4702

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주요 함수/구간

    lines.push("주요 함수/구간:");

### src\pwa\code_explainer.js:4708

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 추천 읽는 순서

    lines.push("추천 읽는 순서:");

### src\pwa\code_explainer.js:4727

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주의

    lines.push("[주의/위험 명령]");

### src\pwa\code_explainer.js:4957

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주의

    '<p><strong>주의할 점</strong><br>파일 경로나 JSON 형식이 틀리면 읽기 단계에서 오류가 날 수 있습니다.</p>' +

### src\pwa\code_explainer.js:5010

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 글자

    text: "글자 데이터",

### src\pwa\code_explainer.js:5170

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 기존 숫자 요약 보기

    '<details class="code-detail-legacy-summary-v328-a1"><summary>기존 숫자 요약 보기</summary>' +

### src\pwa\code_explainer.js:5173

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    '<span class="code-report-chip"><strong>' + warnings.length + '</strong><small>위험/주의</small></span>' +

### src\pwa\code_explainer.js:5174

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 미지원

    '<span class="code-report-chip"><strong>' + (confidence.unsupported || 0) + '</strong><small>미지원</small></span>' +

### src\pwa\code_explainer.js:5193

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    : '<p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p>';

### src\pwa\code_explainer.js:5197

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 확실

    '<span class="code-confidence-chip confidence-exact"><strong>' + (confidence.exact || 0) + '</strong><small>확실</small></span>' +

### src\pwa\code_explainer.js:5198

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 추정

    '<span class="code-confidence-chip confidence-inferred"><strong>' + (confidence.inferred || 0) + '</strong><small>추정</small></span>' +

### src\pwa\code_explainer.js:5199

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 미지원

    '<span class="code-confidence-chip confidence-unsupported"><strong>' + (confidence.unsupported || 0) + '</strong><small>미지원</small></span>' +

### src\pwa\code_explainer.js:5202

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원, 미지원/확인필요

    '<summary>미지원/확인필요 함수·명령</summary>' +

### src\pwa\code_explainer.js:5251

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 데이터 흐름

    '<span class="code-report-chip"><strong>' + dataFlow.length + '</strong><small>데이터 흐름</small></span>' +

### src\pwa\code_explainer.js:5252

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 호출 흐름

    '<span class="code-report-chip"><strong>' + callFlow.length + '</strong><small>호출 흐름</small></span>' +

### src\pwa\code_explainer.js:5253

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 함수 해석

    '<span class="code-report-chip"><strong>' + functionInterpretations.length + '</strong><small>함수 해석</small></span>' +

### src\pwa\code_explainer.js:5254

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 함수 목록

    '<span class="code-report-chip"><strong>' + functionOutlineV259.length + '</strong><small>함수 목록</small></span>' +

### src\pwa\code_explainer.js:5259

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 데이터 흐름

    '<details class="code-flow-detail"><summary>데이터 흐름</summary>' +

### src\pwa\code_explainer.js:5262

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 호출 흐름

    '<details class="code-flow-detail"><summary>호출 흐름</summary>' +

### src\pwa\code_explainer.js:5263

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 호출 흐름

    renderFlowList(callFlow, "함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다.") +

### src\pwa\code_explainer.js:5468

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 주요 분류

    quick.textContent = "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.";

### src\pwa\code_explainer.js:5472

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 확실, 추정, 미지원

    confidence.textContent = "분석하면 확실/추정/미지원 단계가 표시됩니다.";

### src\pwa\code_explainer.js:5476

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 데이터 흐름, 호출 흐름

    flowAnalysis.textContent = "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.";

### src\pwa\code_explainer.js:5480

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 주요 함수/구간

    structure.textContent = "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.";

### src\pwa\code_explainer.js:5484

- file_class: code_explainer
- line_class: visible_render_source
- patterns: 자동감지

    detection.textContent = "분석하면 자동감지 결과와 판단 근거가 표시됩니다.";

### src\pwa\code_explainer_rules.js:250

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 변수에 값 저장

    if (/변수에 값 저장|값 반환|값 돌려주기|Markdown 문단|YAML 설정|TOML 설정|INI 설정|객체 속성 설정|문자열 데이터 항목|예제 코드 문자열|블록\/객체 닫기|딕셔너리 항목 설정|함수 호출|입력 파라미터 선언|문자열\/HTML 조각|예제\/문서 문자열|객체\/배열 값 항목|변수 선언|오류 발생|반복 다음 항목으로 이동|코드블록 경계|예제 명령 문자열|배열 데이터 항목|조건부 UI 조각|반응형 화면 조건 확인|DOM 스타일 설정|중첩 객체 값 갱신|배열\/문자열 길이 계산|객체 메서드 호출|블록\/콜백 닫기|조건\/표현식 경계|정규식 조건 검사|UI 조각 연결|콜백 결과 저장|Blob 파일 데이터 생성|화면\/콘솔에 출력|메서드 체인 이어쓰기/.test(t)) {

### src\pwa\code_explainer_rules.js:258

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 확실

    if (confidence === "exact") return "확실";

### src\pwa\code_explainer_rules.js:259

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 추정

    if (confidence === "inferred") return "추정";

### src\pwa\code_explainer_rules.js:260

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 미지원

    if (confidence === "unsupported") return "미지원";

### src\pwa\code_explainer_rules.js:261

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 추정

    return "추정";

### src\pwa\code_explainer_rules.js:323

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 작업 폴더 이동

    return makeStep(lineNo, t, "작업 폴더 이동", "이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", risk);

### src\pwa\code_explainer_rules.js:331

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);

### src\pwa\code_explainer_rules.js:340

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 시간값을 변수에 저장

    return makeStep(lineNo, t, "시간값을 변수에 저장", "$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", risk);

### src\pwa\code_explainer_rules.js:374

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 변수에 값 저장

    return makeStep(lineNo, t, "변수에 값 저장", "$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", risk);

### src\pwa\code_explainer_rules.js:382

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 스크립트를

    return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);

### src\pwa\code_explainer_rules.js:395

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);

### src\pwa\code_explainer_rules.js:407

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 파이프라인 처리

    return makeStep(lineNo, t, "파이프라인 처리", "앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", risk);

### src\pwa\code_explainer_rules.js:481

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);

### src\pwa\code_explainer_rules.js:494

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 파일/폴더 복사

    return makeStep(lineNo, t, "파일/폴더 복사", "원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", risk);

### src\pwa\code_explainer_rules.js:503

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: ZIP 압축 생성

    return makeStep(lineNo, t, "ZIP 압축 생성", "지정한 파일이나 폴더를 zip 파일로 묶습니다.", risk);

### src\pwa\code_explainer_rules.js:527

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 스크립트를, 검증

    return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);

### src\pwa\code_explainer_rules.js:560

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);

### src\pwa\code_explainer_rules.js:592

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);

### src\pwa\code_explainer_rules.js:595

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);

### src\pwa\code_explainer_rules.js:598

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);

### src\pwa\code_explainer_rules.js:637

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);

### src\pwa\code_explainer_rules.js:654

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);

### src\pwa\code_explainer_rules.js:657

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);

### src\pwa\code_explainer_rules.js:723

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);

### src\pwa\code_explainer_rules.js:926

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 파일/경로

    return makeStep(lineNo, t, "파일/경로 처리", "pathlib 기반으로 파일 경로를 만들거나 파일을 읽고 씁니다.", risk);

### src\pwa\code_explainer_rules.js:942

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 의존성 주입", "요청 처리 전에 인증, DB 연결, 공통 검증 같은 보조 함수를 실행해 결과를 함수 인자로 넣습니다.", risk);

### src\pwa\code_explainer_rules.js:945

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "FastAPI 요청값 검증 설정", "쿼리 문자열, 요청 본문, 경로 파라미터의 기본값과 검증 조건을 설정합니다. 필수 여부와 기본값을 확인해야 합니다.", risk);

### src\pwa\code_explainer_rules.js:955

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "딕셔너리 항목 설정", "딕셔너리 안에서 키와 값을 연결하는 데이터 줄입니다. 검증 항목 이름과 검사 결과를 묶어 저장할 때 자주 나옵니다.", risk);

### src\pwa\code_explainer_rules.js:964

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "검증 함수 호출", "검증 스크립트 안에서 미리 정의된 보조 함수를 실행합니다. 명령 실행, 조건 확인, 메인 흐름 시작처럼 검증 절차를 묶어 호출할 때 쓰입니다.", risk);

### src\pwa\code_explainer_rules.js:988

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 변수에 값 저장

    return makeStep(lineNo, t, "변수에 값 저장", "왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.", risk);

### src\pwa\code_explainer_rules.js:1078

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 검증

    return makeStep(lineNo, t, "오류 발생", "조건이 맞지 않거나 검증에 실패했을 때 Error를 만들어 실행을 중단합니다. 실패 원인을 메시지로 남기는 방어 코드입니다.", risk);

### src\pwa\code_explainer_rules.js:1431

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    return makeStep(lineNo, t, "Node.js 환경변수 읽기", "Node.js 실행 환경에 설정된 환경변수를 읽습니다. API 주소, 실행 모드, 비밀키 이름처럼 코드 밖에서 주입되는 설정값을 확인할 때 자주 씁니다. 실제 비밀값을 코드나 화면에 그대로 출력하지 않도록 주의해야 합니다.", risk);

### src\pwa\code_explainer_rules.js:1450

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 변수에 값 저장

    return makeStep(lineNo, t, "변수에 값 저장", "값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다.", risk);

### src\pwa\code_explainer_rules.js:1639

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 글자

    return makeStep(lineNo, t, "색상 설정", "글자색이나 배경색을 정해서 화면의 시각적 표현을 바꿉니다.", risk);

### src\pwa\code_explainer_rules.js:1642

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 글자

    return makeStep(lineNo, t, "글자 스타일 설정", "글자 크기, 굵기, 줄간격, 정렬 같은 텍스트 표현을 정합니다.", risk);

### src\pwa\code_explainer_rules.js:1820

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    return makeStep(lineNo, t, "이미지 빌드 중 명령 실행", "이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다.", risk);

### src\pwa\code_explainer_rules.js:2109

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 파일/경로

    return makeStep(lineNo, t, "파일/경로 처리", "Java NIO로 파일 경로를 만들거나 파일을 읽고 씁니다. 삭제/이동은 대상 경로를 확인해야 합니다.", risk);

### src\pwa\code_explainer_rules.js:2215

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    pushUnique(tags, "검증");

### src\pwa\code_explainer_rules.js:2315

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    pushUnique(tags, "검증");

### src\pwa\code_explainer_rules.js:2346

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src\pwa\code_explainer_rules.js:2354

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    if (/try|except|finally|raise|assert|예외|조건 검증/.test(codeTitle)) {

### src\pwa\code_explainer_rules.js:2421

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src\pwa\code_explainer_rules.js:2519

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src\pwa\code_explainer_rules.js:2534

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 버전관리

    category = "버전관리";

### src\pwa\code_explainer_rules.js:2537

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    if (/node --check|validate|pytest|test|검증|확인|status|diff/.test(text)) {

### src\pwa\code_explainer_rules.js:2538

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    category = category === "처리" ? "검증" : category;

### src\pwa\code_explainer_rules.js:2539

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 검증

    pushUnique(tags, "검증");

### src\pwa\code_explainer_rules.js:2542

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src\pwa\code_explainer_rules.js:2585

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 변수/값

    category = "변수/값";

### src\pwa\code_explainer_rules.js:2625

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 주요 흐름

    return "주요 흐름: " + ordered.join(" · ");

### src\pwa\code_explainer_rules.js:2649

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 단계로 나눠 해석했습니다, 주의가 필요한 단계, 주의

    return (names[language] || "코드") + "를 " + steps.length + "단계로 나눠 해석했습니다." + (risky ? " 주의가 필요한 단계가 " + risky + "개 있습니다." : " 특별히 높은 위험 명령은 감지되지 않았습니다.");

### src\pwa\code_explainer_rules.js:2670

- file_class: code_explainer
- line_class: dynamic_return_text
- patterns: 파일/경로

    if (category === "DB" || category === "파일/경로" || category === "저장소" || category === "데이터변환" || category === "데이터처리") return "dataStep";

### src\pwa\code_explainer_rules.js:2712

- file_class: code_explainer
- line_class: analyzer_text_source
- patterns: 주의

    const riskPrefix = step.risk === "high" ? "위험 · " : step.risk === "medium" ? "주의 · " : "";

### src\pwa\code_explainer_rules.js:2743

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 데이터 흐름

    lines.push("  subgraph DATA_FLOW[데이터 흐름]");

### src\pwa\code_explainer_rules.js:2799

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 호출 흐름

    lines.push("  subgraph CALL_FLOW[호출 흐름]");

### src\pwa\code_explainer_rules.js:3376

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 변수에 값 저장

    if (title === "변수에 값 저장") return;

### src\pwa\code_explainer_rules.js:3383

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 변수에 값 저장

    "변수에 값 저장",

### src\pwa\code_explainer_rules.js:3985

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 명령이 설치된 도구인지

    command + " 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.",

### src\pwa\code_explainer_rules.js:4029

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 미지원

    "미지원 항목 확인",

### src\pwa\code_explainer_rules.js:4204

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 주의

    explain: "Client에 api_key를 넣어 사용할 준비를 합니다. api_key는 보통 서비스 인증에 쓰이므로 노출에 주의해야 합니다."

### src\pwa\code_explainer_rules.js:4283

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 확실

    explain: "Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다."

### src\pwa\code_explainer_rules.js:4398

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 스크립트를, 단계로 나눠 해석했습니다

    return /코드를 \d+단계로 나눠 해석했습니다|스크립트를 \d+단계로 나눠 해석했습니다/.test(String(summary || ""));

### src\pwa\code_explainer_rules.js:4479

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A2(action && action.title));

### src\pwa\code_explainer_rules.js:4626

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A3(action && action.title));

### src\pwa\code_explainer_rules.js:4679

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 글자

    explain: targetSelector + " 요소의 textContent를 '" + textValue + "'로 바꿉니다. 즉 화면에 보이는 글자가 바뀝니다."

### src\pwa\code_explainer_rules.js:4815

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A4(action && action.title));

### src\pwa\code_explainer_rules.js:5108

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A5(action && action.title));

### src\pwa\code_explainer_rules.js:5452

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A6(action && action.title));

### src\pwa\code_explainer_rules.js:5689

- file_class: code_explainer
- line_class: static_visible_html
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A7(action && action.title));

### src\pwa\code_explainer_rules.js:5892

- file_class: code_explainer
- line_class: unknown_ko_source
- patterns: 스크립트를

    explain: "npm test는 프로젝트의 테스트 스크립트를 실행해서 코드가 기대대로 동작하는지 확인합니다."

### src\pwa\command_explainer.js:101

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 검증

    description: "가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",

### src\pwa\command_explainer.js:110

- file_class: command_explainer
- line_class: static_visible_html
- patterns: 검증

    label: "검증/커밋 루틴",

### src\pwa\command_explainer.js:112

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 검증

    description: "검증 스크립트 실행 후 diff 확인, add, commit까지 이어지는 루틴입니다.",

### src\pwa\command_explainer.js:137

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 검증

    description: "Bash/Shell에서 가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",

### src\pwa\command_explainer.js:169

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 현재 PowerShell 선택에 맞춘 기본 예제입니다

    description: "현재 PowerShell 선택에 맞춘 기본 예제입니다.",

### src\pwa\command_explainer.js:210

- file_class: command_explainer
- line_class: static_visible_html
- patterns: 분석하면 먼저 보여줄 안전 확인 그룹

    '<div class="command-sample-safety-title-v294">분석하면 먼저 보여줄 안전 확인 그룹</div>' +

### src\pwa\command_explainer.js:216

- file_class: command_explainer
- line_class: unknown_ko_source
- patterns: 예제를 불러와 분석하면

    '<div class="command-sample-safety-hint-v294">예제를 불러와 분석하면 결과 위쪽에 이 안전 확인 그룹들이 표시됩니다.</div>' +

### src\pwa\command_explainer.js:1032

- file_class: command_explainer
- line_class: dynamic_return_text
- patterns: 주의

    if (risk === "caution") return "주의";

### src\pwa\command_explainer.js:1160

- file_class: command_explainer
- line_class: unknown_ko_source
- patterns: 확실

    fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",

### src\pwa\command_explainer.js:1227

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 주의, 작업 순서

    text: "PowerShell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + dangerous + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."

### src\pwa\command_explainer.js:1300

- file_class: command_explainer
- line_class: unknown_ko_source
- patterns: 확실

    fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",

### src\pwa\command_explainer.js:1366

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 주의, 작업 순서

    text: "Bash/Shell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + danger + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."

### src\pwa\command_explainer.js:1409

- file_class: command_explainer
- line_class: visible_render_source
- patterns: 주의, 위험/주의 명령

    box.textContent = "위험/주의 명령이 없습니다.";

### src\pwa\command_explainer.js:1981

- file_class: command_explainer
- line_class: static_visible_html
- patterns: 공통 확인

    title: "공통 확인",

### src\pwa\command_explainer.js:1986

- file_class: command_explainer
- line_class: static_visible_html
- patterns: 삭제 계열

    title: "삭제 계열",

### src\pwa\command_explainer.js:2256

- file_class: command_explainer
- line_class: analyzer_text_source
- patterns: 미지원

    warnings: [{ line: 1, command: "미지원 셸", risk: "caution", fileImpact: "현재 V278은 PowerShell과 Bash/Shell 1차 해석만 지원합니다." }],

### src\pwa\command_explainer.js:2291

- file_class: command_explainer
- line_class: visible_render_source
- patterns: 아직 분석한 명령어가 없습니다

    summary.textContent = "아직 분석한 명령어가 없습니다.";

### src\pwa\index.html:117

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 이 메모는 현재 브라우저에만 저장됩니다

    <span class="muted">이 메모는 현재 브라우저에만 저장됩니다.</span>

### src\pwa\index.html:137

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 붙여넣은 코드를 초보자

    <li>붙여넣은 코드를 초보자 눈높이로 순서대로 설명</li>

### src\pwa\index.html:147

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 모든 언어를 완전 파싱

    <li>모든 언어를 완전 파싱하는 도구는 아님</li>

### src\pwa\index.html:148

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 전체 함수 호출 그래프, 데이터 흐름

    <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li>

### src\pwa\index.html:149

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 터미널 명령 안전 확인

    <li>터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합</li>

### src\pwa\index.html:150

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 프로젝트 전체 구조 파악

    <li>프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합</li>

### src\pwa\index.html:160

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 코드를 붙여넣으면

    <p class="muted">PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.</p>

### src\pwa\index.html:193

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 자동감지

    <div id="codeDetectionDetails" class="code-detection-details muted">분석하면 자동감지 결과와 판단 근거가 표시됩니다.</div>

### src\pwa\index.html:203

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 주의

    위험/주의 단계만 보기

### src\pwa\index.html:211

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 주요 분류

    <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div>

### src\pwa\index.html:212

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 확실, 추정, 미지원

    <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>

### src\pwa\index.html:213

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 데이터 흐름, 호출 흐름

    <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div>

### src\pwa\index.html:214

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 주요 함수/구간

    <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div>

### src\pwa\index.html:215

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 주의

    <h2>주의/위험 명령</h2>

### src\pwa\index.html:220

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 더 읽어보기

    <h2>해석 후 더 읽어보기 <span class="code-related-subtitle">사이드카드 보충</span></h2>

### src\pwa\index.html:255

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 명령을 붙여넣으면, 작업 순서

    <p class="muted">PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.</p>

### src\pwa\index.html:270

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 현재 셸 기본 예제

    <option value="auto_by_shell">현재 셸 기본 예제</option>

### src\pwa\index.html:274

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 검증

    <option value="verify_commit_flow">검증/커밋 루틴</option>

### src\pwa\index.html:278

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 선택 예제 불러오기

    <button id="loadCommandSampleBtn" type="button">선택 예제 불러오기</button>

### src\pwa\index.html:279

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 명령어 분석

    <button id="analyzeCommandBtn" type="button">명령어 분석</button>

### src\pwa\index.html:282

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 검증, 명령어는 실행하지 않고

    <p id="commandModeHint" class="code-lang-hint">명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.</p>

### src\pwa\index.html:284

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 여기에 PowerShell 명령을 붙여넣으세요

    <textarea id="commandInput" class="code-input" spellcheck="false" placeholder="여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status"></textarea>

### src\pwa\index.html:292

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 명령어 요약

    <h2>명령어 요약</h2>

### src\pwa\index.html:293

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 아직 분석한 명령어가 없습니다

    <div id="commandSummary" class="code-summary muted">아직 분석한 명령어가 없습니다.</div>

### src\pwa\index.html:295

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 주의, 위험/주의 명령

    <h2>위험/주의 명령</h2>

### src\pwa\index.html:298

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 작업 순서

    <h2>작업 순서</h2>

### src\pwa\index.html:314

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 로컬 프로젝트 루트를 입력하면

    <p class="muted">로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.</p>

### src\pwa\index.html:321

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 프로젝트 루트 입력

    <h2>1. 프로젝트 루트 입력</h2>

### src\pwa\index.html:325

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 명령 생성

    <button id="generateProjectProbeBtn" type="button">명령 생성</button>

### src\pwa\index.html:328

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 생성된 PowerShell 명령

    <h2>2. 생성된 PowerShell 명령</h2>

### src\pwa\index.html:329

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 아래 명령은 파일을 수정하지 않고

    <p class="muted">아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.</p>

### src\pwa\index.html:334

- file_class: pwa_html
- line_class: unknown_ko_source
- patterns: 명령 생성, 프로젝트 루트를 입력하고

    <pre id="projectProbeCommand" class="code-block project-command-box">프로젝트 루트를 입력하고 “명령 생성”을 누르세요.</pre>

### src\pwa\index.html:338

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 터미널 출력 붙여넣기

    <h2>3. 터미널 출력 붙여넣기</h2>

### src\pwa\index.html:341

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 붙여넣은 결과 분석

    <button id="analyzeProjectProbeBtn" type="button">붙여넣은 결과 분석</button>

### src\pwa\index.html:346

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 분석 요약

    <h2>5. 분석 요약</h2>

### src\pwa\index.html:347

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 아직 분석 결과가 없습니다

    <div id="projectAnalysisSummary" class="project-analysis-summary muted">아직 분석 결과가 없습니다.</div>

### src\pwa\index.html:358

- file_class: pwa_html
- line_class: static_visible_html
- patterns: 프로젝트 Mermaid 원문 보기

    <summary>프로젝트 Mermaid 원문 보기</summary>

### src\pwa\project_analyzer.js:716

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 스크립트를

    items.push("코드해석/다이어그램 수정 시 src/pwa/index.html, code_explainer.js, code_explainer_rules.js, style.css, smoke/verify 스크립트를 같이 봐야 합니다.");

### src\pwa\project_analyzer.js:717

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    items.push("학습 카드 수정 시 data/lessons, data/side_cards, tools/validate_lessons.py를 함께 검증해야 합니다.");

### src\pwa\project_analyzer.js:802

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    verification_smoke: "검증/스모크"

### src\pwa\project_analyzer.js:1973

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    ["검증/스모크", firstBundle(["verification_smoke", "검증/스모크", "검증"])]

### src\pwa\project_analyzer.js:2057

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    "1. 구조도 표시 위치와 Mermaid 렌더링 검증",

### src\pwa\project_analyzer.js:2059

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    "3. 검증 통과 후 커밋, 태그, 푸시, GitHub Pages live 확인",

### src\pwa\project_analyzer.js:2061

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 주의

    "## 주의",

### src\pwa\project_analyzer.js:2063

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    "- .tmp는 probe/검증 산출물이므로 커밋하지 않는다.",

### src\pwa\project_analyzer.js:2064

- file_class: project_analyzer
- line_class: unknown_ko_source
- patterns: 검증

    "- 검증 전 커밋 금지.",

### src\pwa\project_analyzer.js:2219

- file_class: project_analyzer
- line_class: visible_render_source
- patterns: 명령 생성, 프로젝트 루트를 입력하고

    if (command) command.textContent = "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.";

### src\pwa\project_analyzer.js:2223

- file_class: project_analyzer
- line_class: visible_render_source
- patterns: 아직 분석 결과가 없습니다

    summary.textContent = "아직 분석 결과가 없습니다.";


## Analyzer source Korean sample

### src\pwa\code_explainer.js:38

- line_class: unknown_ko_source

    alert("저장했습니다.");

### src\pwa\code_explainer.js:140

- line_class: unknown_ko_source

    파이썬 코드를 읽는 연습을 위한 학습 앱입니다.

### src\pwa\code_explainer.js:142

- line_class: unknown_ko_source

    ## 설치

### src\pwa\code_explainer.js:144

- line_class: unknown_ko_source

    - Node.js를 설치합니다.

### src\pwa\code_explainer.js:145

- line_class: unknown_ko_source

    - 의존성을 설치합니다.

### src\pwa\code_explainer.js:146

- line_class: unknown_ko_source

    - 검증 명령을 실행합니다.

### src\pwa\code_explainer.js:152

- line_class: unknown_ko_source

    자세한 내용은 [개발 문서](./docs/dev.md)를 참고하세요.`,

### src\pwa\code_explainer.js:204

- line_class: unknown_ko_source

    auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",

### src\pwa\code_explainer.js:205

- line_class: unknown_ko_source

    powershell: "PowerShell은 로컬 작업, Git, 파일 복사, 백업, 압축 명령을 쉽게 풀어 설명합니다.",

### src\pwa\code_explainer.js:206

- line_class: unknown_ko_source

    python: "Python은 변수, 조건문, 반복문, 함수, 파일/JSON/CSV/API 흐름을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:207

- line_class: unknown_ko_source

    javascript: "JavaScript는 웹페이지 동작, DOM, localStorage, fetch 흐름을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:208

- line_class: unknown_ko_source

    workers: "Workers는 request, env, DB/KV/R2/AI, Response 흐름을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:209

- line_class: unknown_ko_source

    java: "Java는 class, main, 변수 선언, if/for, method, 출력 흐름을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:210

- line_class: unknown_ko_source

    package_json: "package.json은 npm scripts, dependencies, devDependencies를 중심으로 설명합니다.",

### src\pwa\code_explainer.js:211

- line_class: analyzer_text_source

    github_actions: "GitHub Actions YAML은 on, jobs, runs-on, steps, uses, run 흐름을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:212

- line_class: unknown_ko_source

    dockerfile: "Dockerfile은 이미지 선택, 작업 폴더, 복사, 설치, 실행 명령을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:213

- line_class: unknown_ko_source

    env_file: ".env는 환경변수와 비밀값 노출 위험을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:214

- line_class: unknown_ko_source

    requirements_txt: "requirements.txt는 Python 패키지와 버전 고정 방식을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:215

- line_class: unknown_ko_source

    pyproject_toml: "pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:216

- line_class: unknown_ko_source

    yaml: "YAML은 들여쓰기 기반 설정 키, 목록, 서비스 설정을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:217

- line_class: unknown_ko_source

    markdown: "Markdown/README는 제목, 목록, 코드블록, 링크를 중심으로 설명합니다.",

### src\pwa\code_explainer.js:218

- line_class: unknown_ko_source

    gitignore: ".gitignore는 Git에서 제외할 파일/폴더 패턴과 예외 규칙을 설명합니다.",

### src\pwa\code_explainer.js:219

- line_class: unknown_ko_source

    ini_file: "INI 설정은 섹션과 key=value 설정을 중심으로 설명합니다.",

### src\pwa\code_explainer.js:220

- line_class: unknown_ko_source

    toml: "TOML 설정은 테이블, 키-값, 목록 설정을 중심으로 설명합니다."

### src\pwa\code_explainer.js:228

- line_class: unknown_ko_source

    auto: "자동 감지",

### src\pwa\code_explainer.js:243

- line_class: unknown_ko_source

    ini_file: "INI 설정",

### src\pwa\code_explainer.js:244

- line_class: unknown_ko_source

    toml: "TOML 설정"

### src\pwa\code_explainer.js:246

- line_class: unknown_ko_source

    return map[language] || language || "자동";

### src\pwa\code_explainer.js:260

- line_class: unknown_ko_source

    add("사용자가 언어를 직접 선택했습니다.");

### src\pwa\code_explainer.js:262

- line_class: unknown_ko_source

    add("자동감지로 코드 모양을 판별했습니다.");

### src\pwa\code_explainer.js:266

- line_class: unknown_ko_source

    if (/Set-Location|Copy-Item|Remove-Item|Test-Path|Invoke-WebRequest/i.test(text)) add("PowerShell 명령어 패턴이 보입니다.");

### src\pwa\code_explainer.js:267

- line_class: unknown_ko_source

    if (/\$[A-Za-z_][\w-]*\s*=/.test(text)) add("PowerShell 변수($이름) 사용이 보입니다.");

### src\pwa\code_explainer.js:268

- line_class: unknown_ko_source

    if (/\bgit\s+(status|add|commit|push|tag|stash|reset|clean)\b/i.test(text)) add("Git 작업 명령이 포함되어 있습니다.");

### src\pwa\code_explainer.js:272

- line_class: unknown_ko_source

    if (/^\s*(import|from)\s+/m.test(text)) add("Python import 문이 보입니다.");

### src\pwa\code_explainer.js:273

- line_class: unknown_ko_source

    if (/^\s*(async\s+)?def\s+\w+\s*\(/m.test(text)) add("Python 함수 정의가 보입니다.");

### src\pwa\code_explainer.js:274

- line_class: unknown_ko_source

    if (/^\s*class\s+\w+[:(]/m.test(text)) add("Python 클래스 정의가 보입니다.");

### src\pwa\code_explainer.js:278

- line_class: unknown_ko_source

    if (/\b(const|let|var)\s+\w+\s*=/.test(text)) add("JavaScript 변수 선언이 보입니다.");

### src\pwa\code_explainer.js:279

- line_class: unknown_ko_source

    if (/document\.getElementById|querySelector|addEventListener|localStorage/.test(text)) add("브라우저 DOM/이벤트 코드가 보입니다.");

### src\pwa\code_explainer.js:280

- line_class: unknown_ko_source

    if (/function\s+\w*\s*\(|=>/.test(text)) add("JavaScript 함수 패턴이 보입니다.");

### src\pwa\code_explainer.js:284

- line_class: unknown_ko_source

    if (/export\s+default/.test(text) || /fetch\s*\(\s*request\s*,\s*env/.test(text)) add("Cloudflare Worker fetch 진입점이 보입니다.");

### src\pwa\code_explainer.js:285

- line_class: unknown_ko_source

    if (/\benv\.(DB|KV|R2|AI)\b/.test(text)) add("Cloudflare env 바인딩 사용이 보입니다.");

### src\pwa\code_explainer.js:286

- line_class: unknown_ko_source

    if (/Response\.json|new\s+Response/.test(text)) add("Worker 응답 반환 코드가 보입니다.");

### src\pwa\code_explainer.js:290

- line_class: unknown_ko_source

    if (/public\s+static\s+void\s+main/.test(text)) add("Java main 메서드가 보입니다.");

### src\pwa\code_explainer.js:291

- line_class: unknown_ko_source

    if (/System\.out\.println|public\s+class/.test(text)) add("Java 클래스/출력 문법이 보입니다.");

### src\pwa\code_explainer.js:295

- line_class: unknown_ko_source

    if (/"scripts"\s*:\s*\{/.test(text)) add("package.json scripts 영역이 보입니다.");

### src\pwa\code_explainer.js:296

- line_class: unknown_ko_source

    if (/"dependencies"|"devDependencies"/.test(text)) add("npm 의존성 영역이 보입니다.");

### src\pwa\code_explainer.js:300

- line_class: unknown_ko_source

    if (/^\s*on\s*:/m.test(text) && /^\s*jobs\s*:/m.test(text)) add("GitHub Actions의 on/jobs 구조가 보입니다.");

### src\pwa\code_explainer.js:301

- line_class: unknown_ko_source

    if (/uses:\s*actions\//.test(text)) add("actions/checkout 같은 GitHub Action 사용이 보입니다.");

### src\pwa\code_explainer.js:305

- line_class: unknown_ko_source

    if (/^\s*FROM\s+\S+/m.test(text)) add("Dockerfile FROM 베이스 이미지 줄이 보입니다.");

### src\pwa\code_explainer.js:306

- line_class: unknown_ko_source

    if (/^\s*(RUN|COPY|WORKDIR|CMD|ENTRYPOINT|EXPOSE|ENV|ARG)\s+/m.test(text)) add("Dockerfile 명령어 패턴이 보입니다.");

### src\pwa\code_explainer.js:310

- line_class: unknown_ko_source

    if (/^\s*[A-Z][A-Z0-9_]*\s*=.+/m.test(text)) add("대문자 환경변수 KEY=VALUE 패턴이 보입니다.");

### src\pwa\code_explainer.js:311

- line_class: unknown_ko_source

    if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(text)) add("비밀값으로 보이는 환경변수명이 포함되어 있습니다.");

### src\pwa\code_explainer.js:315

- line_class: unknown_ko_source

    if (/^\s*[-\w.]+(\[[^\]]+\])?\s*(==|>=|<=|~=|>|<).+/m.test(text)) add("Python 패키지 버전 조건이 보입니다.");

### src\pwa\code_explainer.js:316

- line_class: unknown_ko_source

    if (/^\s*-r\s+\S+/m.test(text)) add("다른 requirements 파일을 포함하는 줄이 보입니다.");

### src\pwa\code_explainer.js:320

- line_class: unknown_ko_source

    if (/^\s*\[project\]\s*$/m.test(text)) add("pyproject.toml의 [project] 영역이 보입니다.");

### src\pwa\code_explainer.js:321

- line_class: unknown_ko_source

    if (/^\s*\[build-system\]\s*$/m.test(text)) add("Python build-system 설정이 보입니다.");

### src\pwa\code_explainer.js:325

- line_class: unknown_ko_source

    if (/^\s*[A-Za-z0-9_-]+\s*:\s*/m.test(text)) add("YAML key: value 구조가 보입니다.");

### src\pwa\code_explainer.js:326

- line_class: unknown_ko_source

    if (/^\s+[-A-Za-z0-9_]+\s*:/m.test(text)) add("들여쓰기 기반 설정 구조가 보입니다.");

### src\pwa\code_explainer.js:330

- line_class: unknown_ko_source

    if (/^\s*#\s+.+/m.test(text) || /^\s*#{2,6}\s+.+/m.test(text)) add("Markdown 제목(#)이 보입니다.");

### src\pwa\code_explainer.js:331

- line_class: unknown_ko_source

    if (/```/.test(text)) add("Markdown 코드블록이 포함되어 있습니다.");

### src\pwa\code_explainer.js:332

- line_class: unknown_ko_source

    if (/\[[^\]]+\]\([^)]+\)/.test(text)) add("Markdown 링크 문법이 보입니다.");

### src\pwa\code_explainer.js:336

- line_class: unknown_ko_source

    if (/^!/.test(text) || /^\*\./m.test(text) || /\/$/m.test(text)) add(".gitignore 무시/예외 패턴이 보입니다.");

### src\pwa\code_explainer.js:337

- line_class: unknown_ko_source

    if (/node_modules\/|dist\/|__pycache__\/|\.env/m.test(text)) add("Git에서 제외할 폴더/파일 패턴이 보입니다.");

### src\pwa\code_explainer.js:341

- line_class: unknown_ko_source

    if (/^\s*\[[A-Za-z0-9_. -]+\]\s*$/m.test(text)) add("INI 섹션([section])이 보입니다.");

### src\pwa\code_explainer.js:342

- line_class: unknown_ko_source

    if (/^\s*[A-Za-z0-9_.-]+\s*=\s*[^=]+/m.test(text)) add("INI key=value 설정이 보입니다.");

### src\pwa\code_explainer.js:346

- line_class: unknown_ko_source

    if (/^\s*\[[A-Za-z0-9_.-]+\]\s*$/m.test(text)) add("TOML 테이블([table])이 보입니다.");

### src\pwa\code_explainer.js:347

- line_class: unknown_ko_source

    if (/^\s*[A-Za-z0-9_.-]+\s*=\s*("|\[|true|false|\d)/m.test(text)) add("TOML 값 형식이 보입니다.");

### src\pwa\code_explainer.js:350

- line_class: unknown_ko_source

    add("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.");

### src\pwa\code_explainer.js:360

- line_class: analyzer_text_source

    const requestedLabel = requested === "auto" ? "자동 감지" : languageLabel(requested);

### src\pwa\code_explainer.js:365

- line_class: analyzer_text_source

    '<span class="code-detection-chip">선택: ' + escapeHtml(requestedLabel) + '</span>' +

### src\pwa\code_explainer.js:366

- line_class: analyzer_text_source

    '<span class="code-detection-chip strong">감지: ' + escapeHtml(detectedLabel) + '</span>' +

### src\pwa\code_explainer.js:374

- line_class: dynamic_return_text

    if (risk === "high") return "위험";

### src\pwa\code_explainer.js:375

- line_class: dynamic_return_text

    if (risk === "medium") return "주의";

### src\pwa\code_explainer.js:376

- line_class: dynamic_return_text

    return "낮음";

### src\pwa\code_explainer.js:381

- line_class: dynamic_return_text

    if (confidence === "exact") return "규칙 일치";

### src\pwa\code_explainer.js:382

- line_class: dynamic_return_text

    if (confidence === "inferred") return "추정 해석";

### src\pwa\code_explainer.js:383

- line_class: dynamic_return_text

    if (confidence === "unsupported") return "일반 설명";

### src\pwa\code_explainer.js:384

- line_class: dynamic_return_text

    return "추정 해석";

### src\pwa\code_explainer.js:428

- line_class: unknown_ko_source

    (commands.length ? '<div class="function-flow-next-v327-a3"><strong>다음 확인 명령:</strong><pre class="code-block small-code">' +

### src\pwa\code_explainer.js:447

- line_class: static_visible_html

    '<summary>함수 흐름 / 다음 확인</summary>' +

### src\pwa\code_explainer.js:472

- line_class: unknown_ko_source

    ["backup", ["backup", "백업", "compress-archive", "copy-item", "zip"]],

### src\pwa\code_explainer.js:479

- line_class: unknown_ko_source

    ["file", ["file", "path", "copy", "move", "remove", "파일", "폴더", "경로"]],

### src\pwa\code_explainer.js:480

- line_class: unknown_ko_source

    ["test", ["validate", "node --check", "pytest", "test", "regression", "검증"]],

### src\pwa\code_explainer.js:481

- line_class: unknown_ko_source

    ["security", ["token", "secret", "env", "auth", "key", "보안", "환경변수"]]

### src\pwa\code_explainer.js:521

- line_class: unknown_ko_source

    if (keyword === "test" && /test|validation|regression|quality|검증/.test(text)) score += 6;

### src\pwa\code_explainer.js:522

- line_class: unknown_ko_source

    if (keyword === "security" && /secret|token|auth|env|security|보안/.test(text)) score += 6;

### src\pwa\code_explainer.js:573

- line_class: visible_render_source

    summary.textContent = "추천 카드 " + cards.length + "개 보기";

### src\pwa\code_explainer.js:577

- line_class: visible_render_source

    hint.textContent = "필요할 때만 펼쳐서 보세요. 기본 설명을 먼저 읽는 흐름을 방해하지 않도록 접어 둡니다.";

### src\pwa\code_explainer.js:603

- line_class: visible_render_source

    summary.textContent = "확인할 명령어 " + actions.length + "개 보기";

### src\pwa\code_explainer.js:607

- line_class: visible_render_source

    intro.textContent = "모르는 항목이 있으면 아래 PowerShell 명령을 먼저 실행하세요. 결과를 붙여넣으면 더 정확히 해석할 수 있습니다.";

### src\pwa\code_explainer.js:621

- line_class: visible_render_source

    title.textContent = (index + 1) + ". " + (action.title || "미확인 항목 확인");

### src\pwa\code_explainer.js:625

- line_class: visible_render_source

    reason.textContent = action.reason || action.note || "실행 전 의미와 설치 여부를 확인해야 합니다.";

### src\pwa\code_explainer.js:637

- line_class: visible_render_source

    note.textContent = action.note || "읽기/조회 명령 위주로 먼저 확인하세요.";

### src\pwa\code_explainer.js:669

- line_class: visible_render_source

    box.textContent = "관련 보충 카드가 아직 연결되지 않았습니다. 위의 단계별 해석만으로도 학습을 진행할 수 있습니다.";

### src\pwa\code_explainer.js:681

- line_class: visible_render_source

    title.textContent = card.title || card.id || "사이드카드";

### src\pwa\code_explainer.js:691

- line_class: visible_render_source

    summary.textContent = "자세히 보기";

### src\pwa\code_explainer.js:744

- line_class: unknown_ko_source

    ? "현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다."

### src\pwa\code_explainer.js:745

- line_class: unknown_ko_source

    : "전체 단계 중 앞부분을 우선 렌더링합니다.";

### src\pwa\code_explainer.js:750

- line_class: unknown_ko_source

    '<strong>긴 코드 요약 보기</strong>' +

### src\pwa\code_explainer.js:751

- line_class: static_visible_html

    '<p class="muted">감지된 단계가 ' + visibleSteps.length + '개입니다. ' + filterText + '</p>' +

### src\pwa\code_explainer.js:753

- line_class: static_visible_html

    ? '<p class="muted">화면 성능을 위해 먼저 ' + renderedSteps.length + '개만 표시했습니다. 전체 순서는 복사 리포트와 Mermaid 원문에서 함께 확인할 수 있습니다.</p>'

### src\pwa\code_explainer.js:754

- line_class: static_visible_html

    : '<p class="muted">현재 전체 단계 표시 중입니다. 화면이 무거우면 다시 120개만 보기로 줄일 수 있습니다.</p>');

### src\pwa\code_explainer.js:760

- line_class: visible_render_source

    button.textContent = showAllCodeSteps ? "120개만 보기" : "전체 단계 펼치기";

### src\pwa\code_explainer.js:800

- line_class: static_visible_html

    ? '<p class="muted">현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.</p>'

### src\pwa\code_explainer.js:801

- line_class: static_visible_html

    : '<p class="muted">표시할 해석 단계가 없습니다. 언어 선택이나 코드 범위를 확인한 뒤 다시 분석해 보세요.</p>';

### src\pwa\code_explainer.js:822

- line_class: visible_render_source

    tail.textContent = "나머지 " + (visibleSteps.length - renderedSteps.length) + "개 단계는 리포트 복사 또는 Mermaid 원문에서 이어서 확인하세요.";

### src\pwa\code_explainer.js:834

- line_class: visible_render_source

    box.textContent = "위험/주의 명령은 감지되지 않았습니다.";

### src\pwa\code_explainer.js:866

- line_class: unknown_ko_source

    return key + " " + counts[key] + "개";

### src\pwa\code_explainer.js:925

- line_class: dynamic_return_text

    if (/^\[\]$|list\(/.test(e)) return "조건에 맞는 값을 모아둘 빈 목록으로 보입니다.";

### src\pwa\code_explainer.js:926

- line_class: dynamic_return_text

    if (/^\{\}$|dict\(/.test(e)) return "키와 값을 모아둘 사전으로 보입니다.";

### src\pwa\code_explainer.js:927

- line_class: dynamic_return_text

    if (/json\.load|json\.loads/.test(e)) return "JSON 데이터를 Python에서 다루는 값으로 바꾼 결과입니다.";

### src\pwa\code_explainer.js:928

- line_class: dynamic_return_text

    if (/json\.dump|json\.dumps/.test(e)) return "Python 데이터를 JSON 형태로 바꾼 결과입니다.";

### src\pwa\code_explainer.js:929

- line_class: dynamic_return_text

    if (/Path\(|open\(|read_text|write_text/.test(e)) return "파일이나 경로와 관련된 값을 담습니다.";

### src\pwa\code_explainer.js:930

- line_class: dynamic_return_text

    if (/filter\(|map\(|sorted\(/.test(e)) return "기존 데이터를 걸러내거나 변환한 결과입니다.";

### src\pwa\code_explainer.js:931

- line_class: dynamic_return_text

    if (/len\(|count|total|size/i.test(n + " " + e)) return "개수나 크기 같은 숫자 정보를 담습니다.";

### src\pwa\code_explainer.js:932

- line_class: dynamic_return_text

    if (/result|results|out|output|items|rows/i.test(n)) return "함수의 최종 결과나 중간 결과를 모아두는 변수로 보입니다.";

### src\pwa\code_explainer.js:933

- line_class: dynamic_return_text

    if (/card|item|row|entry|file|line/i.test(n)) return "반복문 안에서 항목 하나를 가리키는 변수로 보입니다.";

### src\pwa\code_explainer.js:934

- line_class: dynamic_return_text

    if (/text|raw|content|source/i.test(n)) return "입력이나 파일에서 읽은 문자열 내용을 담는 변수로 보입니다.";

### src\pwa\code_explainer.js:936

- line_class: dynamic_return_text

    return "함수 안에서 계산하거나 다음 단계에 넘기기 위해 만든 중간 값으로 보입니다.";

### src\pwa\code_explainer.js:985

- line_class: unknown_ko_source

    lines.push('  A["' + name + ' 입력"] --> B["내부 변수/초기값 준비"]');

### src\pwa\code_explainer.js:992

- line_class: static_visible_html

    lines.push("  " + prev + ' --> ' + id + '["반복: ' + mermaidSafeTextV251(loop.summary) + '"]');

### src\pwa\code_explainer.js:998

- line_class: unknown_ko_source

    lines.push("  " + prev + ' --> ' + id + '{"조건: ' + mermaidSafeTextV251(condition.condition) + '"}');

### src\pwa\code_explainer.js:1004

- line_class: unknown_ko_source

    lines.push("  " + prev + ' --> ' + id + '["호출: ' + mermaidSafeTextV251(call.name) + '"]');

### src\pwa\code_explainer.js:1009

- line_class: unknown_ko_source

    lines.push("  " + prev + ' --> R["반환: ' + mermaidSafeTextV251(ir.returns[0]) + '"]');

### src\pwa\code_explainer.js:1011

- line_class: unknown_ko_source

    lines.push("  " + prev + ' --> R["결과/부수효과 완료"]');

### src\pwa\code_explainer.js:1027

- line_class: dynamic_return_text

    return "입력 목록을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다.";

### src\pwa\code_explainer.js:1030

- line_class: dynamic_return_text

    return "여러 항목을 순회하면서 결과 목록을 만들고 반환하는 수집 함수로 보입니다.";

### src\pwa\code_explainer.js:1033

- line_class: dynamic_return_text

    return "JSON 데이터를 읽거나 변환해서 다음 처리에 넘기는 데이터 처리 함수로 보입니다.";

### src\pwa\code_explainer.js:1036

- line_class: dynamic_return_text

    return "파일이나 경로를 읽고 쓰는 파일 처리 함수로 보입니다.";

### src\pwa\code_explainer.js:1039

- line_class: dynamic_return_text

    return "여러 항목을 순회하면서 필요한 값을 화면/터미널에 출력하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1042

- line_class: dynamic_return_text

    return "여러 항목을 순회해 계산하거나 가공한 뒤 결과를 반환하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1045

- line_class: dynamic_return_text

    return "입력값이나 내부 계산값을 처리해 결과를 반환하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1048

- line_class: dynamic_return_text

    return "입력값과 내부 명령을 실행해 상태를 바꾸거나 부수효과를 만드는 함수로 보입니다.";

### src\pwa\code_explainer.js:1056

- line_class: unknown_ko_source

    if (ir.variables.some(function(v) { return /\[\]|목록|list/i.test(v.expr + " " + v.role); })) concepts.add("list");

### src\pwa\code_explainer.js:1057

- line_class: unknown_ko_source

    if (ir.variables.some(function(v) { return /\{\}|사전|dict/i.test(v.expr + " " + v.role); })) concepts.add("dict");

### src\pwa\code_explainer.js:1116

- line_class: static_visible_html

    summary: match[2] + "에서 " + match[1] + "를 하나씩 꺼냅니다."

### src\pwa\code_explainer.js:1122

- line_class: unknown_ko_source

    role: match[2] + " 안의 항목 하나를 반복 중에 가리킵니다."

### src\pwa\code_explainer.js:1156

- line_class: analyzer_text_source

    ir.steps.push(ir.params.join(", ") + " 값을 입력으로 받습니다.");

### src\pwa\code_explainer.js:1160

- line_class: analyzer_text_source

    ir.steps.push(variable.name + " 값을 준비합니다: " + variable.role);

### src\pwa\code_explainer.js:1168

- line_class: analyzer_text_source

    ir.steps.push(condition.condition + " 조건을 확인합니다.");

### src\pwa\code_explainer.js:1172

- line_class: analyzer_text_source

    ir.steps.push(call.name + " 호출을 실행합니다.");

### src\pwa\code_explainer.js:1176

- line_class: analyzer_text_source

    ir.steps.push(value + " 값을 함수 밖으로 반환합니다.");

### src\pwa\code_explainer.js:1251

- line_class: static_visible_html

    summary: match[1] + " 값을 열거나 준비한 뒤 " + match[2] + " 이름으로 다룹니다."

### src\pwa\code_explainer.js:1259

- line_class: static_visible_html

    summary: "실패할 수 있는 처리를 먼저 시도합니다."

### src\pwa\code_explainer.js:1269

- line_class: static_visible_html

    summary: match[1] + " 예외가 발생했을 때 대체 흐름으로 처리합니다."

### src\pwa\code_explainer.js:1277

- line_class: static_visible_html

    summary: "명령줄 입력값을 정의하거나 읽는 CLI 처리입니다."

### src\pwa\code_explainer.js:1285

- line_class: static_visible_html

    summary: "파일이나 경로를 읽고 쓰는 처리입니다."

### src\pwa\code_explainer.js:1293

- line_class: static_visible_html

    summary: "JSON 데이터를 읽거나 변환하는 처리입니다."

### src\pwa\code_explainer.js:1307

- line_class: unknown_ko_source

    variable.role = "명령줄 인자를 정의하고 읽기 위한 argparse 파서입니다.";

### src\pwa\code_explainer.js:1309

- line_class: unknown_ko_source

    variable.role = "사용자가 명령줄에서 입력한 옵션 값을 담는 객체입니다.";

### src\pwa\code_explainer.js:1311

- line_class: unknown_ko_source

    variable.role = "JSON 문자열이나 파일 내용을 Python 데이터로 바꾼 결과입니다.";

### src\pwa\code_explainer.js:1313

- line_class: unknown_ko_source

    variable.role = "파일이나 폴더 위치를 나타내거나 파일 처리에 쓰이는 값입니다.";

### src\pwa\code_explainer.js:1315

- line_class: unknown_ko_source

    variable.role = "파일 저장/읽기 위치를 나타내는 값입니다.";

### src\pwa\code_explainer.js:1329

- line_class: dynamic_return_text

    return "명령줄 옵션을 정의하고 parse_args로 사용자의 입력값을 읽어 준비하는 CLI 진입 함수로 보입니다.";

### src\pwa\code_explainer.js:1333

- line_class: dynamic_return_text

    return "JSON 파싱을 시도하고 실패하면 예외를 처리해 안전한 값을 반환하는 방어적 데이터 파싱 함수로 보입니다.";

### src\pwa\code_explainer.js:1337

- line_class: dynamic_return_text

    return "파일을 열어 JSON 데이터를 읽고 Python 데이터로 바꿔 반환하는 파일 로더 함수로 보입니다.";

### src\pwa\code_explainer.js:1341

- line_class: dynamic_return_text

    return "경로를 만들고 텍스트나 보고서를 파일에 저장한 뒤 결과 경로를 반환하는 파일 저장 함수로 보입니다.";

### src\pwa\code_explainer.js:1371

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "사용 라이브러리/모듈: " + importNames.slice(0, 6).join(", "));

### src\pwa\code_explainer.js:1388

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "write_text로 텍스트를 파일에 저장합니다.");

### src\pwa\code_explainer.js:1390

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "read_text로 파일 내용을 문자열로 읽습니다.");

### src\pwa\code_explainer.js:1392

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "open으로 파일을 열어 읽거나 씁니다.");

### src\pwa\code_explainer.js:1394

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "Path로 파일/폴더 경로를 만듭니다.");

### src\pwa\code_explainer.js:1400

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "json.loads로 JSON 문자열을 Python 데이터로 바꿉니다.");

### src\pwa\code_explainer.js:1402

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "json.load로 파일에서 JSON 데이터를 읽습니다.");

### src\pwa\code_explainer.js:1404

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "json.dumps로 Python 데이터를 JSON 문자열로 바꿉니다.");

### src\pwa\code_explainer.js:1406

- line_class: analyzer_text_source

    appendUniqueStepV252(ir.steps, "json.dump로 Python 데이터를 JSON 파일에 저장합니다.");

### src\pwa\code_explainer.js:1558

- line_class: dynamic_return_text

    if (/^\[\s*\]$/.test(value)) return "조건에 맞는 값을 모아둘 빈 배열로 보입니다.";

### src\pwa\code_explainer.js:1559

- line_class: dynamic_return_text

    if (/^\{\s*\}$/.test(value)) return "키와 값을 묶어 저장할 빈 객체로 보입니다.";

### src\pwa\code_explainer.js:1560

- line_class: dynamic_return_text

    if (/JSON\.parse/.test(value)) return "JSON 문자열을 JavaScript 값으로 바꾼 결과입니다.";

### src\pwa\code_explainer.js:1561

- line_class: dynamic_return_text

    if (/JSON\.stringify/.test(value)) return "JavaScript 값을 JSON 문자열로 바꾼 결과입니다.";

### src\pwa\code_explainer.js:1562

- line_class: dynamic_return_text

    if (/document\.querySelector|getElementById/.test(value)) return "화면의 HTML 요소를 찾아 담은 값입니다.";

### src\pwa\code_explainer.js:1563

- line_class: dynamic_return_text

    if (/fetch\s*\(/.test(value)) return "네트워크 요청 결과나 응답을 담는 값으로 보입니다.";

### src\pwa\code_explainer.js:1564

- line_class: dynamic_return_text

    if (/await\s+/.test(value)) return "비동기 처리 결과를 기다려 받은 값입니다.";

### src\pwa\code_explainer.js:1565

- line_class: dynamic_return_text

    if (/map\(|filter\(|reduce\(/.test(value)) return "배열을 가공해서 만든 결과입니다.";

### src\pwa\code_explainer.js:1566

- line_class: dynamic_return_text

    if (/path|file|url/.test(lowerName)) return "파일, 경로, URL 같은 위치 정보를 담는 값으로 보입니다.";

### src\pwa\code_explainer.js:1567

- line_class: dynamic_return_text

    if (/result|items|list|cards|rows/.test(lowerName)) return "여러 값을 모으거나 다음 단계로 넘기기 위한 묶음 데이터로 보입니다.";

### src\pwa\code_explainer.js:1569

- line_class: dynamic_return_text

    return "함수 안에서 계산하거나 다음 단계에 넘기기 위해 만든 중간 값으로 보입니다.";

### src\pwa\code_explainer.js:1603

- line_class: analyzer_text_source

    ir.steps.push(ir.params.join(", ") + " 값을 입력으로 받습니다.");

### src\pwa\code_explainer.js:1619

- line_class: analyzer_text_source

    ir.steps.push(variable.name + " 값을 준비합니다: " + variable.role);

### src\pwa\code_explainer.js:1628

- line_class: static_visible_html

    let summary = header + " 조건으로 반복합니다.";

### src\pwa\code_explainer.js:1632

- line_class: static_visible_html

    summary = ofMatch[2].trim() + "에서 " + ofMatch[1].trim() + " 값을 하나씩 꺼냅니다.";

### src\pwa\code_explainer.js:1649

- line_class: static_visible_html

    summary: match[1] + " 조건을 확인합니다."

### src\pwa\code_explainer.js:1651

- line_class: analyzer_text_source

    ir.steps.push(match[1] + " 조건을 확인합니다.");

### src\pwa\code_explainer.js:1661

- line_class: static_visible_html

    summary: (expr || "undefined") + " 값을 함수 밖으로 반환합니다."

### src\pwa\code_explainer.js:1663

- line_class: analyzer_text_source

    ir.steps.push((expr || "undefined") + " 값을 함수 밖으로 반환합니다.");

### src\pwa\code_explainer.js:1678

- line_class: static_visible_html

    summary: callName + " 호출을 실행합니다."

### src\pwa\code_explainer.js:1712

- line_class: dynamic_return_text

    return "fetch 같은 비동기 요청을 실행하고 응답 데이터를 다음 단계로 넘기는 네트워크 처리 함수로 보입니다.";

### src\pwa\code_explainer.js:1716

- line_class: dynamic_return_text

    return "화면 요소를 찾거나 이벤트를 연결해 브라우저 UI 동작을 처리하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1720

- line_class: dynamic_return_text

    return "JSON 데이터를 JavaScript 값으로 바꾸거나 문자열로 변환하는 데이터 처리 함수로 보입니다.";

### src\pwa\code_explainer.js:1724

- line_class: dynamic_return_text

    return "입력 배열을 반복하면서 조건에 맞는 항목을 모아 반환하는 필터링/수집 함수로 보입니다.";

### src\pwa\code_explainer.js:1728

- line_class: dynamic_return_text

    return "배열 데이터를 map/filter/reduce 같은 메서드로 가공하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1732

- line_class: dynamic_return_text

    return "입력값이나 내부 계산값을 처리해 결과를 반환하는 JavaScript 함수로 보입니다.";

### src\pwa\code_explainer.js:1735

- line_class: dynamic_return_text

    return "JavaScript 코드 흐름을 함수 단위로 묶어 실행하는 함수로 보입니다.";

### src\pwa\code_explainer.js:1741

- line_class: unknown_ko_source

    lines.push('  A["' + mermaidSafeTextV251(ir.name + " 입력") + '"] --> B["내부 변수/초기값 준비"]');

### src\pwa\code_explainer.js:1748

- line_class: static_visible_html

    lines.push('  ' + previous + ' --> ' + id + '["반복: ' + mermaidSafeTextV251(loop.summary) + '"]');

### src\pwa\code_explainer.js:1754

- line_class: unknown_ko_source

    lines.push('  ' + previous + ' --> ' + id + '{"조건: ' + mermaidSafeTextV251(condition.expr) + '"}');

### src\pwa\code_explainer.js:1760

- line_class: unknown_ko_source

    lines.push('  ' + previous + ' --> ' + id + '["호출: ' + mermaidSafeTextV251(call.name) + '"]');

### src\pwa\code_explainer.js:1766

- line_class: unknown_ko_source

    lines.push('  ' + previous + ' --> R["반환: ' + mermaidSafeTextV251(ret.expr) + '"]');

### src\pwa\code_explainer.js:1905

- line_class: static_visible_html

    summary: "await로 비동기 처리 결과를 기다립니다."

### src\pwa\code_explainer.js:1913

- line_class: static_visible_html

    summary: "try 블록에서 실패할 수 있는 처리를 먼저 시도합니다."

### src\pwa\code_explainer.js:1923

- line_class: static_visible_html

    summary: "catch 블록에서 " + match[1] + " 오류를 받아 대체 흐름으로 처리합니다."

### src\pwa\code_explainer.js:1931

- line_class: static_visible_html

    summary: "then으로 Promise 성공 결과를 이어서 처리합니다."

### src\pwa\code_explainer.js:1939

- line_class: static_visible_html

    summary: "catch로 Promise 실패 흐름을 처리합니다."

### src\pwa\code_explainer.js:1946

- line_class: static_visible_html

    summary: "fetch로 네트워크 요청을 실행합니다."

### src\pwa\code_explainer.js:1960

- line_class: unknown_ko_source

    variable.role = "fetch 요청의 응답 객체를 기다려 받은 값입니다.";

### src\pwa\code_explainer.js:1962

- line_class: unknown_ko_source

    variable.role = "응답 본문을 JSON으로 변환해 얻은 JavaScript 데이터입니다.";

### src\pwa\code_explainer.js:1964

- line_class: unknown_ko_source

    variable.role = "Promise 체인에서 이어지는 비동기 처리 결과입니다.";

### src\pwa\code_explainer.js:1977

- line_class: dynamic_return_text

    return "async/await로 네트워크 요청을 시도하고 실패하면 catch에서 안전하게 처리하는 비동기 데이터 로더 함수로 보입니다.";

### src\pwa\code_explainer.js:1981

- line_class: dynamic_return_text

    return "fetch 요청 뒤 then/catch Promise 체인으로 성공·실패 흐름을 이어 처리하는 네트워크 함수로 보입니다.";

### src\pwa\code_explainer.js:1985

- line_class: dynamic_return_text

    return "다른 파일에서 import해 쓸 수 있도록 공개된 JavaScript 함수로, 입력을 처리해 결과를 반환합니다.";

### src\pwa\code_explainer.js:1989

- line_class: dynamic_return_text

    return "클래스 객체 안에서 특정 동작을 담당하는 메서드로 보입니다.";

### src\pwa\code_explainer.js:1993

- line_class: dynamic_return_text

    return "await로 비동기 작업 결과를 기다린 뒤 다음 처리를 이어가는 JavaScript 함수로 보입니다.";

### src\pwa\code_explainer.js:1997

- line_class: dynamic_return_text

    return "실패할 수 있는 처리를 try에서 시도하고 catch에서 오류를 처리하는 방어적 함수로 보입니다.";

### src\pwa\code_explainer.js:2018

- line_class: analyzer_text_source

    appendUniqueJsStepV257(ir.steps, "export로 다른 파일에서 import해 쓸 수 있게 공개합니다.");

### src\pwa\code_explainer.js:2023

- line_class: analyzer_text_source

    appendUniqueJsStepV257(ir.steps, "async 함수로 비동기 작업을 다룰 수 있습니다.");

### src\pwa\code_explainer.js:2028

- line_class: analyzer_text_source

    appendUniqueJsStepV257(ir.steps, "class 안에 정의된 메서드로 객체의 동작을 담당합니다.");

### src\pwa\code_explainer.js:2110

- line_class: unknown_ko_source

    hints.push("try/except는 실패할 수 있는 부분을 안전하게 감싸고, 실패했을 때도 프로그램이 바로 멈추지 않게 대체 흐름을 준비합니다.");

### src\pwa\code_explainer.js:2114

- line_class: unknown_ko_source

    hints.push("with open은 파일을 열고 작업이 끝나면 자동으로 닫아 주기 때문에, 파일 처리에서 실수를 줄이는 안전한 패턴입니다.");

### src\pwa\code_explainer.js:2118

- line_class: unknown_ko_source

    hints.push("json.load/load는 JSON을 Python 데이터로 읽고, json.dump/dumps는 Python 데이터를 JSON 형태로 내보내는 역할입니다.");

### src\pwa\code_explainer.js:2122

- line_class: unknown_ko_source

    hints.push("argparse는 사용자가 터미널에서 입력한 옵션을 코드 안의 args 값으로 바꿔 주는 입구 역할을 합니다.");

