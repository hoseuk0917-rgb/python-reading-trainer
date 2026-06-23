# V334-A10T Visible Korean Source Locator

Purpose: locate visible Korean residuals reported from EN-mode browser smoke.

## Summary

| metric | value |
|---|---:|
| total hits | 119 |

## Top files

| file | hits |
|---|---:|
| src/pwa/app.js | 72 |
| src/pwa/index.html | 43 |
| data_i18n\en\curriculum\side_card_schema_v1.json | 1 |
| data_i18n\en\lessons\python_tag_filter_advanced_search_v55.json | 1 |
| data_i18n\en\side_cards\platform_cards_v1.json | 1 |
| data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json | 1 |

## Top patterns

| pattern | hits |
|---|---:|
| 줄 | 10 |
| 주의 | 6 |
| 본 카드 | 5 |
| 더 읽어보기 | 4 |
| 맞힘 | 4 |
| 데이터 흐름 | 4 |
| 작업 순서 | 4 |
| 명령 생성 | 4 |
| 외부 자료 | 2 |
| 자세히 보기 | 2 |
| 헷갈림 | 2 |
| 아직 저장된 메모가 없습니다 | 2 |
| 이 메모는 현재 브라우저에만 저장됩니다 | 2 |
| 붙여넣은 코드를 초보자 | 2 |
| 모든 언어를 완전 파싱 | 2 |
| 전체 함수 호출 그래프 | 2 |
| 터미널 명령 안전 확인 | 2 |
| 프로젝트 전체 구조 파악 | 2 |
| 코드를 붙여넣으면 | 2 |
| 자동감지 | 2 |
| 주요 분류 | 2 |
| 확실 | 2 |
| 추정 | 2 |
| 미지원 | 2 |
| 호출 흐름 | 2 |
| 주요 함수/구간 | 2 |
| 명령을 붙여넣으면 | 2 |
| 현재 셸 기본 예제 | 2 |
| 선택 예제 불러오기 | 2 |
| 명령어 분석 | 2 |
| 명령어는 실행하지 않고 | 2 |
| 명령어 요약 | 2 |
| 아직 분석한 명령어가 없습니다 | 2 |
| 로컬 프로젝트 루트를 입력하면 | 2 |
| 프로젝트 루트 입력 | 2 |
| 생성된 PowerShell 명령 | 2 |
| 아래 명령은 파일을 수정하지 않고 | 2 |
| 프로젝트 루트를 입력하고 | 2 |
| 터미널 출력 붙여넣기 | 2 |
| 붙여넣은 결과 분석 | 2 |
| 분석 요약 | 2 |
| 아직 분석 결과가 없습니다 | 2 |
| 프로젝트 Mermaid 원문 보기 | 2 |
| 랜덤 배경지식 | 1 |
| 퀴즈와 1:1 | 1 |
| 랜덤 상식 | 1 |
| 다른 배경지식 | 1 |
| 전체 카드 | 1 |
| 맞힌 카드 | 1 |
| 헷갈린 카드 | 1 |
| 위험/주의 명령 | 1 |

## Hits

### src/pwa/app.js:221

- kind: source
- pattern: 줄

    definition: "dict에서 값을 꺼내되, key가 없을 때 기본값을 줄 수 있는 메서드다.",

### src/pwa/app.js:257

- kind: source
- pattern: 줄

    definition: "JSON 문자열을 파이썬 dict/list로 바꾼다. JSONL을 한 줄씩 읽을 때 핵심이다.",

### src/pwa/app.js:265

- kind: source
- pattern: 줄

    definition: "한 줄에 JSON 하나씩 저장하는 형식이다. LLM 학습 데이터, 로그, KG chunks/nodes/edges에 자주 쓰인다.",

### src/pwa/app.js:269

- kind: source
- pattern: 줄

    definition: "파일 경로를 문자열보다 안전하게 다루는 표준 라이브러리다. Windows/Linux 경로 차이를 줄이는 데 도움이 된다.",

### src/pwa/app.js:665

- kind: source
- pattern: 더 읽어보기

    title.textContent = studyToolsTextV334A10N("더 읽어보기", "Read more");

### src/pwa/app.js:669

- kind: source
- pattern: 외부 자료

    note.textContent = studyToolsTextV334A10N("외부 자료는 본문 복사 없이 링크와 출처만 연결합니다.", "For external sources, include only the link and source without copying the text.");

### src/pwa/app.js:681

- kind: source
- pattern: 외부 자료

    type.textContent = studyToolsTextV334A10N("외부 자료", "External resource") + " · " + (resource.tier || "link") + " · " + (resource.language || "");

### src/pwa/app.js:1023

- kind: source
- pattern: 자세히 보기

    detailBtn.textContent = studyToolsTextV334A10N("자세히 보기", "View details");

### src/pwa/app.js:1036

- kind: source
- pattern: 자세히 보기

    detailBtn.textContent = studyToolsTextV334A10N("자세히 보기", "View details");

### src/pwa/app.js:1121

- kind: source
- pattern: 랜덤 배경지식

    "랜덤 배경지식",

### src/pwa/app.js:1122

- kind: source
- pattern: 퀴즈와 1:1

    "퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다."

### src/pwa/app.js:1125

- kind: source
- pattern: 랜덤 상식

    makeSideCard(randomCard, studyToolsTextV334A10N("랜덤 상식", "Random fact"));

### src/pwa/app.js:1130

- kind: source
- pattern: 다른 배경지식

    nextBtn.textContent = studyToolsTextV334A10N("다른 배경지식", "Another background note");

### src/pwa/app.js:1307

- kind: source
- pattern: 맞힘

    : "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;

### src/pwa/app.js:1307

- kind: source
- pattern: 헷갈림

    : "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;

### src/pwa/app.js:1454

- kind: source
- pattern: 아직 저장된 메모가 없습니다

    box.innerHTML = '<p class="muted">' + studyToolsTextV334A10N("아직 저장된 메모가 없습니다.", "No saved notes yet.") + '</p>';

### src/pwa/app.js:1530

- kind: source
- pattern: 전체 카드

    '<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">' + studyToolsTextV334A10N("전체 카드", "Total cards") + '</div></div>' +

### src/pwa/app.js:1531

- kind: source
- pattern: 본 카드

    '<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("본 카드", "Seen cards") + '</div></div>' +

### src/pwa/app.js:1532

- kind: source
- pattern: 맞힌 카드

    '<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("맞힌 카드", "Correct cards") + '</div></div>' +

### src/pwa/app.js:1533

- kind: source
- pattern: 헷갈린 카드

    '<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("헷갈린 카드", "Not sure cards") + '</div></div>';

### src/pwa/app.js:1552

- kind: source
- pattern: 본 카드

    : '본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused

### src/pwa/app.js:1552

- kind: source
- pattern: 맞힘

    : '본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused

### src/pwa/app.js:1552

- kind: source
- pattern: 헷갈림

    : '본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused

### src/pwa/app.js:1605

- kind: source
- pattern: 이 메모는 현재 브라우저에만 저장됩니다

    "이 메모는 현재 브라우저에만 저장됩니다.": "These notes are stored only in this browser.",

### src/pwa/app.js:1606

- kind: source
- pattern: 아직 저장된 메모가 없습니다

    "아직 저장된 메모가 없습니다.": "No saved notes yet.",

### src/pwa/app.js:1607

- kind: source
- pattern: 붙여넣은 코드를 초보자

    "붙여넣은 코드를 초보자 눈높이로 순서대로 설명": "Explains pasted code step by step at a beginner-friendly level",

### src/pwa/app.js:1612

- kind: source
- pattern: 모든 언어를 완전 파싱

    "모든 언어를 완전 파싱하는 도구는 아님": "This is not a complete parser for every language",

### src/pwa/app.js:1613

- kind: source
- pattern: 전체 함수 호출 그래프

    "전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음": "It does not precisely analyze full function call graphs or data flow",

### src/pwa/app.js:1613

- kind: source
- pattern: 데이터 흐름

    "전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음": "It does not precisely analyze full function call graphs or data flow",

### src/pwa/app.js:1614

- kind: source
- pattern: 터미널 명령 안전 확인

    "터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합": "Use Command explainer for safer terminal command review",

### src/pwa/app.js:1615

- kind: source
- pattern: 프로젝트 전체 구조 파악

    "프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합": "Use Project analyzer for understanding whole project structure",

### src/pwa/app.js:1616

- kind: source
- pattern: 코드를 붙여넣으면

    "PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.": "Paste PowerShell, Python, JavaScript, Cloudflare Workers, or Java code to generate beginner-friendly step-by-step explanations and flowcharts.",

### src/pwa/app.js:1617

- kind: source
- pattern: 자동감지

    "분석하면 자동감지 결과와 판단 근거가 표시됩니다.": "After analysis, automatic detection results and reasoning will appear.",

### src/pwa/app.js:1618

- kind: source
- pattern: 줄

    "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.": "After analysis, step count, risky lines, and main categories will be summarized.",

### src/pwa/app.js:1618

- kind: source
- pattern: 주요 분류

    "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.": "After analysis, step count, risky lines, and main categories will be summarized.",

### src/pwa/app.js:1619

- kind: source
- pattern: 확실

    "분석하면 확실/추정/미지원 단계가 표시됩니다.": "After analysis, exact, inferred, and unsupported steps will be shown.",

### src/pwa/app.js:1619

- kind: source
- pattern: 추정

    "분석하면 확실/추정/미지원 단계가 표시됩니다.": "After analysis, exact, inferred, and unsupported steps will be shown.",

### src/pwa/app.js:1619

- kind: source
- pattern: 미지원

    "분석하면 확실/추정/미지원 단계가 표시됩니다.": "After analysis, exact, inferred, and unsupported steps will be shown.",

### src/pwa/app.js:1620

- kind: source
- pattern: 데이터 흐름

    "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.": "After analysis, data flow and function call flow will be shown.",

### src/pwa/app.js:1620

- kind: source
- pattern: 호출 흐름

    "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.": "After analysis, data flow and function call flow will be shown.",

### src/pwa/app.js:1621

- kind: source
- pattern: 주요 함수/구간

    "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.": "After analyzing long code, the overall structure, main functions/sections, and reading order will be shown.",

### src/pwa/app.js:1622

- kind: source
- pattern: 주의

    "주의/위험 명령": "Caution/risky commands",

### src/pwa/app.js:1623

- kind: source
- pattern: 더 읽어보기

    "해석 후 더 읽어보기": "Read more after analysis",

### src/pwa/app.js:1625

- kind: source
- pattern: 명령을 붙여넣으면

    "PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.": "Paste PowerShell or Bash commands to get a beginner-friendly explanation of the work order, file impact, risky commands, and Git impact.",

### src/pwa/app.js:1625

- kind: source
- pattern: 작업 순서

    "PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.": "Paste PowerShell or Bash commands to get a beginner-friendly explanation of the work order, file impact, risky commands, and Git impact.",

### src/pwa/app.js:1626

- kind: source
- pattern: 현재 셸 기본 예제

    "현재 셸 기본 예제": "Default example for current shell",

### src/pwa/app.js:1627

- kind: source
- pattern: 선택 예제 불러오기

    "선택 예제 불러오기": "Load selected example",

### src/pwa/app.js:1628

- kind: source
- pattern: 명령어 분석

    "명령어 분석": "Analyze command",

### src/pwa/app.js:1629

- kind: source
- pattern: 명령어는 실행하지 않고

    "명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.": "Commands are not executed; they are analyzed statically. Examples cover Git save flows, risky deletion, virtual environment execution, and validation/commit routines.",

### src/pwa/app.js:1630

- kind: source
- pattern: 명령어 요약

    "명령어 요약": "Command summary",

### src/pwa/app.js:1631

- kind: source
- pattern: 아직 분석한 명령어가 없습니다

    "아직 분석한 명령어가 없습니다.": "No command has been analyzed yet.",

### src/pwa/app.js:1632

- kind: source
- pattern: 작업 순서

    "작업 순서": "Work order",

### src/pwa/app.js:1633

- kind: source
- pattern: 로컬 프로젝트 루트를 입력하면

    "로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.": "Enter a local project root to generate a read-only scan command, then paste the output to analyze the project structure.",

### src/pwa/app.js:1634

- kind: source
- pattern: 프로젝트 루트 입력

    "1. 프로젝트 루트 입력": "1. Enter project root",

### src/pwa/app.js:1635

- kind: source
- pattern: 명령 생성

    "명령 생성": "Generate command",

### src/pwa/app.js:1636

- kind: source
- pattern: 생성된 PowerShell 명령

    "2. 생성된 PowerShell 명령": "2. Generated PowerShell command",

### src/pwa/app.js:1637

- kind: source
- pattern: 아래 명령은 파일을 수정하지 않고

    "아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.": "The command below does not modify files. It only creates summary reports under .tmp and does not print .env contents or full file bodies.",

### src/pwa/app.js:1638

- kind: source
- pattern: 명령 생성

    "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.": "Enter a project root and press Generate command.",

### src/pwa/app.js:1638

- kind: source
- pattern: 프로젝트 루트를 입력하고

    "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.": "Enter a project root and press Generate command.",

### src/pwa/app.js:1639

- kind: source
- pattern: 터미널 출력 붙여넣기

    "3. 터미널 출력 붙여넣기": "3. Paste terminal output",

### src/pwa/app.js:1640

- kind: source
- pattern: 붙여넣은 결과 분석

    "붙여넣은 결과 분석": "Analyze pasted output",

### src/pwa/app.js:1641

- kind: source
- pattern: 분석 요약

    "5. 분석 요약": "5. Analysis summary",

### src/pwa/app.js:1642

- kind: source
- pattern: 아직 분석 결과가 없습니다

    "아직 분석 결과가 없습니다.": "No analysis result yet.",

### src/pwa/app.js:1643

- kind: source
- pattern: 프로젝트 Mermaid 원문 보기

    "프로젝트 Mermaid 원문 보기": "View project Mermaid source",

### src/pwa/app.js:1671

- kind: source
- pattern: 주의

    "주의/위험 명령": "Caution/risky commands",

### src/pwa/app.js:1673

- kind: source
- pattern: 더 읽어보기

    "해석 후 더 읽어보기": "Read more after analysis",

### src/pwa/app.js:1683

- kind: source
- pattern: 주의

    "위험/주의 단계만 보기": "Show only caution/risk steps",

### src/pwa/app.js:1710

- kind: source
- pattern: 맞힘

    re: /^현재 L(.+) · 추천 L(.+) · 안 본 (.+) · 모르겠음 (.+) · 맞힘 (.+) \/ (.+)$/,

### src/pwa/app.js:1714

- kind: source
- pattern: 본 카드

    re: /^조건 일치 (.+)장 \/ 전체 (.+)장 · 본 카드 (.+)장 · 모르겠음 (.+)장$/,

### src/pwa/app.js:2573

- kind: source
- pattern: 본 카드

    <option value="unseen">${studyToolsTextV334A10N("안 본 카드", "Unseen cards")}</option>

### src/pwa/app.js:2636

- kind: source
- pattern: 본 카드

    : "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";

### src/pwa/app.js:3285

- kind: source
- pattern: 맞힘

    : "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;

### src/pwa/index.html:117

- kind: source
- pattern: 이 메모는 현재 브라우저에만 저장됩니다

    <span class="muted">이 메모는 현재 브라우저에만 저장됩니다.</span>

### src/pwa/index.html:137

- kind: source
- pattern: 붙여넣은 코드를 초보자

    <li>붙여넣은 코드를 초보자 눈높이로 순서대로 설명</li>

### src/pwa/index.html:147

- kind: source
- pattern: 모든 언어를 완전 파싱

    <li>모든 언어를 완전 파싱하는 도구는 아님</li>

### src/pwa/index.html:148

- kind: source
- pattern: 전체 함수 호출 그래프

    <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li>

### src/pwa/index.html:148

- kind: source
- pattern: 데이터 흐름

    <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li>

### src/pwa/index.html:149

- kind: source
- pattern: 터미널 명령 안전 확인

    <li>터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합</li>

### src/pwa/index.html:150

- kind: source
- pattern: 프로젝트 전체 구조 파악

    <li>프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합</li>

### src/pwa/index.html:160

- kind: source
- pattern: 코드를 붙여넣으면

    <p class="muted">PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.</p>

### src/pwa/index.html:193

- kind: source
- pattern: 자동감지

    <div id="codeDetectionDetails" class="code-detection-details muted">분석하면 자동감지 결과와 판단 근거가 표시됩니다.</div>

### src/pwa/index.html:203

- kind: source
- pattern: 주의

    위험/주의 단계만 보기

### src/pwa/index.html:211

- kind: source
- pattern: 줄

    <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div>

### src/pwa/index.html:211

- kind: source
- pattern: 주요 분류

    <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div>

### src/pwa/index.html:212

- kind: source
- pattern: 확실

    <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>

### src/pwa/index.html:212

- kind: source
- pattern: 추정

    <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>

### src/pwa/index.html:212

- kind: source
- pattern: 미지원

    <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>

### src/pwa/index.html:213

- kind: source
- pattern: 데이터 흐름

    <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div>

### src/pwa/index.html:213

- kind: source
- pattern: 호출 흐름

    <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div>

### src/pwa/index.html:214

- kind: source
- pattern: 주요 함수/구간

    <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div>

### src/pwa/index.html:215

- kind: source
- pattern: 주의

    <h2>주의/위험 명령</h2>

### src/pwa/index.html:220

- kind: source
- pattern: 더 읽어보기

    <h2>해석 후 더 읽어보기 <span class="code-related-subtitle">사이드카드 보충</span></h2>

### src/pwa/index.html:255

- kind: source
- pattern: 명령을 붙여넣으면

    <p class="muted">PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.</p>

### src/pwa/index.html:255

- kind: source
- pattern: 작업 순서

    <p class="muted">PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.</p>

### src/pwa/index.html:270

- kind: source
- pattern: 현재 셸 기본 예제

    <option value="auto_by_shell">현재 셸 기본 예제</option>

### src/pwa/index.html:278

- kind: source
- pattern: 선택 예제 불러오기

    <button id="loadCommandSampleBtn" type="button">선택 예제 불러오기</button>

### src/pwa/index.html:279

- kind: source
- pattern: 명령어 분석

    <button id="analyzeCommandBtn" type="button">명령어 분석</button>

### src/pwa/index.html:282

- kind: source
- pattern: 명령어는 실행하지 않고

    <p id="commandModeHint" class="code-lang-hint">명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.</p>

### src/pwa/index.html:292

- kind: source
- pattern: 명령어 요약

    <h2>명령어 요약</h2>

### src/pwa/index.html:293

- kind: source
- pattern: 아직 분석한 명령어가 없습니다

    <div id="commandSummary" class="code-summary muted">아직 분석한 명령어가 없습니다.</div>

### src/pwa/index.html:295

- kind: source
- pattern: 주의

    <h2>위험/주의 명령</h2>

### src/pwa/index.html:295

- kind: source
- pattern: 위험/주의 명령

    <h2>위험/주의 명령</h2>

### src/pwa/index.html:298

- kind: source
- pattern: 작업 순서

    <h2>작업 순서</h2>

### src/pwa/index.html:314

- kind: source
- pattern: 로컬 프로젝트 루트를 입력하면

    <p class="muted">로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.</p>

### src/pwa/index.html:321

- kind: source
- pattern: 프로젝트 루트 입력

    <h2>1. 프로젝트 루트 입력</h2>

### src/pwa/index.html:325

- kind: source
- pattern: 명령 생성

    <button id="generateProjectProbeBtn" type="button">명령 생성</button>

### src/pwa/index.html:328

- kind: source
- pattern: 생성된 PowerShell 명령

    <h2>2. 생성된 PowerShell 명령</h2>

### src/pwa/index.html:329

- kind: source
- pattern: 아래 명령은 파일을 수정하지 않고

    <p class="muted">아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.</p>

### src/pwa/index.html:334

- kind: source
- pattern: 명령 생성

    <pre id="projectProbeCommand" class="code-block project-command-box">프로젝트 루트를 입력하고 “명령 생성”을 누르세요.</pre>

### src/pwa/index.html:334

- kind: source
- pattern: 프로젝트 루트를 입력하고

    <pre id="projectProbeCommand" class="code-block project-command-box">프로젝트 루트를 입력하고 “명령 생성”을 누르세요.</pre>

### src/pwa/index.html:338

- kind: source
- pattern: 터미널 출력 붙여넣기

    <h2>3. 터미널 출력 붙여넣기</h2>

### src/pwa/index.html:341

- kind: source
- pattern: 붙여넣은 결과 분석

    <button id="analyzeProjectProbeBtn" type="button">붙여넣은 결과 분석</button>

### src/pwa/index.html:346

- kind: source
- pattern: 분석 요약

    <h2>5. 분석 요약</h2>

### src/pwa/index.html:347

- kind: source
- pattern: 아직 분석 결과가 없습니다

    <div id="projectAnalysisSummary" class="project-analysis-summary muted">아직 분석 결과가 없습니다.</div>

### src/pwa/index.html:358

- kind: source
- pattern: 프로젝트 Mermaid 원문 보기

    <summary>프로젝트 Mermaid 원문 보기</summary>

### data_i18n\en\curriculum\side_card_schema_v1.json:13

- kind: en_data
- pattern: 줄

    "when_to_show": "어떤 문제나 개념에서 보여줄지"

### data_i18n\en\lessons\python_tag_filter_advanced_search_v55.json:277

- kind: en_data
- pattern: 줄

    "code": "if (results.length === 0) {\n  showHint('필터를 줄여보세요')\n}",

### data_i18n\en\side_cards\platform_cards_v1.json:74

- kind: en_data
- pattern: 줄

    "when_to_show": "스케줄, 자동화, 하베스트 문제",

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json:308

- kind: en_data
- pattern: 줄

    "when_to_show": "입력값이나 파일 줄을 다듬을 때",

