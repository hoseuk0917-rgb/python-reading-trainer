# V334-A11C Runtime Visible Risk Locator

Purpose: treat raw makeStep Korean as safe only after the centralized runtime translation layer is installed.

## Summary

| metric | value |
|---|---:|
| total pattern hits | 360 |
| risky hits | 164 |
| has runtime makeStep translator | true |

## Risky by class

| class | risky hits |
|---|---:|
| code_explainer | 57 |
| code_explainer_rules | 49 |
| command_explainer | 27 |
| pwa_html | 16 |
| project_analyzer | 11 |
| app_js | 4 |

## Risky hits

### src/pwa/code_explainer.js:66

- class: code_explainer
- patterns: 파일/경로

    ["파일/경로", "file/path"],

### src/pwa/code_explainer.js:67

- class: code_explainer
- patterns: 버전관리

    ["버전관리", "version control"],

### src/pwa/code_explainer.js:68

- class: code_explainer
- patterns: 변수/값

    ["변수/값", "variable/value"],

### src/pwa/code_explainer.js:70

- class: code_explainer
- patterns: 데이터 흐름

    ["데이터 흐름", "data flow"],

### src/pwa/code_explainer.js:71

- class: code_explainer
- patterns: 호출 흐름

    ["호출 흐름", "call flow"],

### src/pwa/code_explainer.js:72

- class: code_explainer
- patterns: 함수 해석

    ["함수 해석", "function explanation"],

### src/pwa/code_explainer.js:73

- class: code_explainer
- patterns: 함수 목록

    ["함수 목록", "function list"],

### src/pwa/code_explainer.js:75

- class: code_explainer
- patterns: 주요 분류

    ["주요 분류", "main categories"],

### src/pwa/code_explainer.js:76

- class: code_explainer
- patterns: 주요 태그

    ["주요 태그", "main tags"],

### src/pwa/code_explainer.js:77

- class: code_explainer
- patterns: 주요 함수/구간

    ["주요 함수/구간", "main functions/sections"],

### src/pwa/code_explainer.js:78

- class: code_explainer
- patterns: 추천 읽는 순서

    ["추천 읽는 순서", "recommended reading order"],

### src/pwa/code_explainer.js:79

- class: code_explainer
- patterns: 주의

    ["주의/위험", "caution/risk"],

### src/pwa/code_explainer.js:81

- class: code_explainer
- patterns: 미지원

    ["미지원", "unsupported"],

### src/pwa/code_explainer.js:82

- class: code_explainer
- patterns: 확실

    ["확실", "exact"],

### src/pwa/code_explainer.js:83

- class: code_explainer
- patterns: 추정

    ["추정", "inferred"],

### src/pwa/code_explainer.js:84

- class: code_explainer
- patterns: 검증

    ["검증", "validation"],

### src/pwa/code_explainer.js:95

- class: code_explainer
- patterns: 줄, 내용 줄

    ["내용 줄", "content lines"],

### src/pwa/code_explainer.js:96

- class: code_explainer
- patterns: 줄, 주석/문서 줄

    ["주석/문서 줄", "comment/doc lines"],

### src/pwa/code_explainer.js:97

- class: code_explainer
- patterns: 글자

    ["글자", "characters"],

### src/pwa/code_explainer.js:98

- class: code_explainer
- patterns: 줄

    ["줄", "lines"],

### src/pwa/code_explainer.js:254

- class: code_explainer
- patterns: 검증

    - 검증 명령을 실행합니다.

### src/pwa/code_explainer.js:312

- class: code_explainer
- patterns: 추정

    auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",

### src/pwa/code_explainer.js:1385

- class: code_explainer
- patterns: 줄

    summary: "명령줄 입력값을 정의하거나 읽는 CLI 처리입니다."

### src/pwa/code_explainer.js:1415

- class: code_explainer
- patterns: 줄

    variable.role = "명령줄 인자를 정의하고 읽기 위한 argparse 파서입니다.";

### src/pwa/code_explainer.js:1417

- class: code_explainer
- patterns: 줄

    variable.role = "사용자가 명령줄에서 입력한 옵션 값을 담는 객체입니다.";

### src/pwa/code_explainer.js:1437

- class: code_explainer
- patterns: 줄

    return "명령줄 옵션을 정의하고 parse_args로 사용자의 입력값을 읽어 준비하는 CLI 진입 함수로 보입니다.";

### src/pwa/code_explainer.js:2222

- class: code_explainer
- patterns: 줄

    hints.push("with open은 파일을 열고 작업이 끝나면 자동으로 닫아 주기 때문에, 파일 처리에서 실수를 줄이는 안전한 패턴입니다.");

### src/pwa/code_explainer.js:2264

- class: code_explainer
- patterns: 줄

    ir.roleSummary = "명령줄에서 받은 옵션으로 파일 경로를 정하고, 그 파일을 읽거나 처리하는 CLI 기반 파일 처리 함수로 보입니다.";

### src/pwa/code_explainer.js:2301

- class: code_explainer
- patterns: 줄

    hints.push("fetch와 await가 함께 있으면, 서버/API 요청이 끝날 때까지 기다린 뒤 응답 데이터를 다음 줄에서 처리합니다.");

### src/pwa/code_explainer.js:2551

- class: code_explainer
- patterns: 줄

    summary: "컴프리헨션으로 반복과 생성/필터링을 한 줄에 압축했습니다."

### src/pwa/code_explainer.js:2757

- class: code_explainer
- patterns: 검증

    ir.roleSummary = signals.classContext.name + " 클래스 안에서 조건을 검사하고 필요하면 예외를 발생시키는 검증 메서드로 보입니다.";

### src/pwa/code_explainer.js:2763

- class: code_explainer
- patterns: 검증

    ir.roleSummary = "조건을 검사하고 문제가 있으면 예외를 발생시키는 방어적 검증 함수로 보입니다.";

### src/pwa/code_explainer.js:3893

- class: code_explainer
- patterns: 데이터 흐름

    if (skeleton.signals.hasStorage) signalItems.push("저장/JSON 데이터 흐름 포함");

### src/pwa/code_explainer.js:3902

- class: code_explainer
- patterns: 함수 목록

    '<p class="code-report-categories">기본 해석은 앞쪽 함수 몇 개가 아니라, 전체 파일의 함수 역할 분포를 먼저 보여줍니다. 세부 흐름은 아래 함수 목록에서 하나를 선택해 확인합니다.</p>' +

### src/pwa/code_explainer.js:4300

- class: code_explainer
- patterns: 줄

    '<p class="code-report-categories">너무 흔한 보조 호출은 줄이고, 실제 읽기 순서에 도움이 되는 호출만 성격별로 묶었습니다.</p>' +

### src/pwa/code_explainer.js:4627

- class: code_explainer
- patterns: 버전관리

    if (/^git\s+/i.test(t)) addOutlineItem(outline, lineNo, "Git 작업", t.split(/\s+/).slice(0, 3).join(" "), "버전관리 명령");

### src/pwa/code_explainer.js:4666

- class: code_explainer
- patterns: 파일/경로

    if (has("파일/경로") || has("저장소") || has("DB")) order.push("3. 파일, 저장소, DB처럼 데이터가 들어오고 나가는 지점을 확인합니다.");

### src/pwa/code_explainer.js:4667

- class: code_explainer
- patterns: 검증

    if (has("조건") || has("반복") || has("검증")) order.push("4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다.");

### src/pwa/code_explainer.js:4672

- class: code_explainer
- patterns: 주의

    order.push("2. 그다음 위험/주의 단계와 출력 지점을 확인합니다.");

### src/pwa/code_explainer.js:4748

- class: code_explainer
- patterns: 선택:

    lines.push("입력 선택: " + languageLabel(result.requestedLanguage));

### src/pwa/code_explainer.js:4756

- class: code_explainer
- patterns: 줄, 주의

    lines.push("주의/위험 줄: " + warnings.length);

### src/pwa/code_explainer.js:4760

- class: code_explainer
- patterns: 확실, 추정, 미지원

    lines.push("확신도: 확실 " + (confidence.exact || 0) + " / 추정 " + (confidence.inferred || 0) + " / 미지원 " + (confidence.unsupported || 0));

### src/pwa/code_explainer.js:4763

- class: code_explainer
- patterns: 미지원, 미지원/확인필요

    lines.push("미지원/확인필요:");

### src/pwa/code_explainer.js:4774

- class: code_explainer
- patterns: 데이터 흐름

    lines.push("[데이터 흐름]");

### src/pwa/code_explainer.js:4784

- class: code_explainer
- patterns: 호출 흐름

    lines.push("[호출 흐름]");

### src/pwa/code_explainer.js:4806

- class: code_explainer
- patterns: 줄, 글자

    lines.push("원본 규모: " + overview.stats.lineCount + "줄 / 내용 " + overview.stats.nonEmptyCount + "줄 / 글자 " + overview.stats.charCount);

### src/pwa/code_explainer.js:4807

- class: code_explainer
- patterns: 주요 분류

    lines.push("주요 분류: " + (overview.topCategories || "분류 없음"));

### src/pwa/code_explainer.js:4808

- class: code_explainer
- patterns: 주요 태그

    lines.push("주요 태그: " + (overview.topTags || "태그 없음"));

### src/pwa/code_explainer.js:4810

- class: code_explainer
- patterns: 주요 함수/구간

    lines.push("주요 함수/구간:");

### src/pwa/code_explainer.js:4816

- class: code_explainer
- patterns: 추천 읽는 순서

    lines.push("추천 읽는 순서:");

### src/pwa/code_explainer.js:4835

- class: code_explainer
- patterns: 주의

    lines.push("[주의/위험 명령]");

### src/pwa/code_explainer.js:5065

- class: code_explainer
- patterns: 주의

    '<p><strong>주의할 점</strong><br>파일 경로나 JSON 형식이 틀리면 읽기 단계에서 오류가 날 수 있습니다.</p>' +

### src/pwa/code_explainer.js:5118

- class: code_explainer
- patterns: 글자

    text: "글자 데이터",

### src/pwa/code_explainer.js:5123

- class: code_explainer
- patterns: 줄

    rows: "표나 CSV에서 여러 줄 데이터",

### src/pwa/code_explainer.js:5124

- class: code_explainer
- patterns: 줄

    row: "표나 CSV에서 한 줄 데이터",

### src/pwa/code_explainer.js:5133

- class: code_explainer
- patterns: 줄

    line: "파일에서 읽은 한 줄",

### src/pwa/code_explainer.js:5134

- class: code_explainer
- patterns: 줄

    lines: "파일에서 읽은 여러 줄"

### src/pwa/code_explainer_rules.js:272

- class: code_explainer_rules
- patterns: 변수에 값 저장

    if (/변수에 값 저장|값 반환|값 돌려주기|Markdown 문단|YAML 설정|TOML 설정|INI 설정|객체 속성 설정|문자열 데이터 항목|예제 코드 문자열|블록\/객체 닫기|딕셔너리 항목 설정|함수 호출|입력 파라미터 선언|문자열\/HTML 조각|예제\/문서 문자열|객체\/배열 값 항목|변수 선언|오류 발생|반복 다음 항목으로 이동|코드블록 경계|예제 명령 문자열|배열 데이터 항목|조건부 UI 조각|반응형 화면 조건 확인|DOM 스타일 설정|중첩 객체 값 갱신|배열\/문자열 길이 계산|객체 메서드 호출|블록\/콜백 닫기|조건\/표현식 경계|정규식 조건 검사|UI 조각 연결|콜백 결과 저장|Blob 파일 데이터 생성|화면\/콘솔에 출력|메서드 체인 이어쓰기/.test(t)) {

### src/pwa/code_explainer_rules.js:416

- class: code_explainer_rules
- patterns: 파일/경로

    ["파일/경로", "file/path"],

### src/pwa/code_explainer_rules.js:417

- class: code_explainer_rules
- patterns: 버전관리

    ["버전관리", "version control"],

### src/pwa/code_explainer_rules.js:418

- class: code_explainer_rules
- patterns: 변수/값

    ["변수/값", "variable/value"],

### src/pwa/code_explainer_rules.js:420

- class: code_explainer_rules
- patterns: 검증

    ["검증", "validation"],

### src/pwa/code_explainer_rules.js:421

- class: code_explainer_rules
- patterns: 주의

    ["주의", "caution"],

### src/pwa/code_explainer_rules.js:431

- class: code_explainer_rules
- patterns: 줄

    ["줄", "line"],

### src/pwa/code_explainer_rules.js:2426

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2526

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2557

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2565

- class: code_explainer_rules
- patterns: 검증

    if (/try|except|finally|raise|assert|예외|조건 검증/.test(codeTitle)) {

### src/pwa/code_explainer_rules.js:2632

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2730

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2745

- class: code_explainer_rules
- patterns: 버전관리

    category = "버전관리";

### src/pwa/code_explainer_rules.js:2749

- class: code_explainer_rules
- patterns: 검증

    category = category === "처리" ? "검증" : category;

### src/pwa/code_explainer_rules.js:2750

- class: code_explainer_rules
- patterns: 검증

    pushUnique(tags, "검증");

### src/pwa/code_explainer_rules.js:2753

- class: code_explainer_rules
- patterns: 파일/경로

    category = category === "처리" ? "파일/경로" : category;

### src/pwa/code_explainer_rules.js:2796

- class: code_explainer_rules
- patterns: 변수/값

    category = "변수/값";

### src/pwa/code_explainer_rules.js:2883

- class: code_explainer_rules
- patterns: 파일/경로

    if (category === "DB" || category === "파일/경로" || category === "저장소" || category === "데이터변환" || category === "데이터처리") return "dataStep";

### src/pwa/code_explainer_rules.js:2925

- class: code_explainer_rules
- patterns: 주의

    const riskPrefix = step.risk === "high" ? "위험 · " : step.risk === "medium" ? "주의 · " : "";

### src/pwa/code_explainer_rules.js:2956

- class: code_explainer_rules
- patterns: 데이터 흐름

    lines.push("  subgraph DATA_FLOW[데이터 흐름]");

### src/pwa/code_explainer_rules.js:3012

- class: code_explainer_rules
- patterns: 호출 흐름

    lines.push("  subgraph CALL_FLOW[호출 흐름]");

### src/pwa/code_explainer_rules.js:3589

- class: code_explainer_rules
- patterns: 변수에 값 저장

    if (title === "변수에 값 저장") return;

### src/pwa/code_explainer_rules.js:3596

- class: code_explainer_rules
- patterns: 변수에 값 저장

    "변수에 값 저장",

### src/pwa/code_explainer_rules.js:4018

- class: code_explainer_rules
- patterns: 줄

    else steps.push(makeStep(lineNo, cleanLine(line), "코드 실행", "이 줄을 순서대로 실행합니다.", "low"));

### src/pwa/code_explainer_rules.js:4197

- class: code_explainer_rules
- patterns: 터미널 명령

    "PowerShell/CLI(터미널 명령) 확인",

### src/pwa/code_explainer_rules.js:4198

- class: code_explainer_rules
- patterns: 명령이 설치된 도구인지, 위험한 옵션

    command + " 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.",

### src/pwa/code_explainer_rules.js:4242

- class: code_explainer_rules
- patterns: 미지원

    "미지원 항목 확인",

### src/pwa/code_explainer_rules.js:4366

- class: code_explainer_rules
- patterns: 줄

    explain: "파일이 없을 때 text를 빈 문자열('')로 바꿉니다. 그래서 프로그램이 멈추지 않고 다음 줄로 넘어갑니다."

### src/pwa/code_explainer_rules.js:4417

- class: code_explainer_rules
- patterns: 주의

    explain: "Client에 api_key를 넣어 사용할 준비를 합니다. api_key는 보통 서비스 인증에 쓰이므로 노출에 주의해야 합니다."

### src/pwa/code_explainer_rules.js:4492

- class: code_explainer_rules
- patterns: 줄

    result.summary = "첫 줄은 Invoke-MysteryTool이라는 알 수 없는 도구를 실행합니다. 둘째 줄은 out 폴더의 항목에서 이름과 크기만 골라 보여줍니다. 첫 줄은 실행 전에 반드시 확인해야 합니다.";

### src/pwa/code_explainer_rules.js:4496

- class: code_explainer_rules
- patterns: 확실

    explain: "Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다."

### src/pwa/code_explainer_rules.js:4611

- class: code_explainer_rules
- patterns: 스크립트를, 단계로 나눠 해석했습니다

    return /코드를 \d+단계로 나눠 해석했습니다|스크립트를 \d+단계로 나눠 해석했습니다/.test(String(summary || ""));

### src/pwa/code_explainer_rules.js:4692

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A2(action && action.title));

### src/pwa/code_explainer_rules.js:4839

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A3(action && action.title));

### src/pwa/code_explainer_rules.js:4892

- class: code_explainer_rules
- patterns: 글자

    explain: targetSelector + " 요소의 textContent를 '" + textValue + "'로 바꿉니다. 즉 화면에 보이는 글자가 바뀝니다."

### src/pwa/code_explainer_rules.js:5028

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A4(action && action.title));

### src/pwa/code_explainer_rules.js:5053

- class: code_explainer_rules
- patterns: 줄

    result.summary = folder + " 폴더에서 " + filter + " 파일을 찾고, 그 안에서 '" + pattern + "' 문자가 들어간 줄만 찾습니다. 마지막에는 " + fieldText + " 열만 골라 보여줍니다.";

### src/pwa/code_explainer_rules.js:5061

- class: code_explainer_rules
- patterns: 줄

    title: "'" + pattern + "'가 들어간 줄 찾기",

### src/pwa/code_explainer_rules.js:5062

- class: code_explainer_rules
- patterns: 줄

    explain: "Select-String \"" + pattern + "\"은 앞 단계에서 넘어온 파일 내용 중 '" + pattern + "' 문자가 들어간 줄만 찾습니다."

### src/pwa/code_explainer_rules.js:5065

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 열 선택",

### src/pwa/code_explainer_rules.js:5075

- class: code_explainer_rules
- patterns: 줄

    result.flow.roleSummary = "파일 목록을 찾고, 특정 문자열이 있는 줄만 골라낸 뒤, 필요한 열만 보여주는 PowerShell 파이프라인입니다.";

### src/pwa/code_explainer_rules.js:5115

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 열 선택",

### src/pwa/code_explainer_rules.js:5321

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A5(action && action.title));

### src/pwa/code_explainer_rules.js:5381

- class: code_explainer_rules
- patterns: 줄

    title: "보여줄 개수 제한",

### src/pwa/code_explainer_rules.js:5665

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A6(action && action.title));

### src/pwa/code_explainer_rules.js:5692

- class: code_explainer_rules
- patterns: 줄

    explain: "display: flex 설정은 " + selector + " 안의 자식 요소들을 한 줄 레이아웃으로 배치할 때 쓰는 설정입니다."

### src/pwa/code_explainer_rules.js:5902

- class: code_explainer_rules
- patterns: 미지원

    return !/미지원 항목 확인/.test(compactV334A7(action && action.title));

### src/pwa/code_explainer_rules.js:6105

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

