const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11c_code_explainer_runtime_i18n_layer.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11c_code_explainer_runtime_i18n_layer.json");

let rules = fs.readFileSync(RULES, "utf8");
let code = fs.readFileSync(CODE, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceExact(target, file, oldValue, newValue, required = false) {
  let text = file === "rules" ? rules : file === "code" ? code : app;
  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);
  if (required && count === 0) throw new Error("Required replacement failed: " + target);

  if (file === "rules") rules = text;
  else if (file === "code") code = text;
  else app = text;

  changes.push({ target, file, count });
}

function replaceRegex(target, file, re, newValue, required = false) {
  let text = file === "rules" ? rules : file === "code" ? code : app;
  const before = text;
  text = text.replace(re, newValue);
  const count = before === text ? 0 : 1;
  if (required && count === 0) throw new Error("Required regex replacement failed: " + target);

  if (file === "rules") rules = text;
  else if (file === "code") code = text;
  else app = text;

  changes.push({ target, file, count });
}

function insertRulesRuntimeLayer() {
  if (rules.includes("function codeRuleTranslateTitleV334A11C")) {
    changes.push({ target: "insert_rules_runtime_i18n_layer", file: "rules", count: 0, skipped: true });
    return;
  }

  const layer = `
  const CODE_RULE_TITLE_MAP_V334_A11C = {
    "각 항목 반복 처리": "Process each item",
    "환경변수 설정": "Set environment variable",
    "오류 시 즉시 중단 설정": "Stop immediately on errors",
    "경로 확인 결과 저장": "Store path-check result",
    "웹 요청 결과 저장": "Store web request result",
    "경로 조합 결과 저장": "Store combined path result",
    "CSV 읽기 결과 저장": "Store CSV read result",
    "CSV 파이프라인 요약 저장": "Store CSV pipeline summary",
    "JSON 처리 결과 저장": "Store JSON processing result",
    "파일 내용 읽기 결과 저장": "Store file-read result",
    "파이프라인 결과 저장": "Store pipeline result",
    "프로세스 실행 결과 저장": "Store process result",
    "현재 시간 만들기": "Create current timestamp",
    "입력 파라미터 정의": "Define input parameters",
    "입력 파라미터 기본값": "Set input parameter defaults",
    "PowerShell 객체 만들기": "Create PowerShell object",
    "객체 속성 값 설정": "Set object property value",
    "함수 정의": "Define function",
    "여러 줄 문자열 경계": "Here-string boundary",
    "CSV 그룹 정렬 선택 저장": "Group, sort, select, and save CSV data",
    "파일 목록 가져오기": "Get file list",
    "파일 내용 읽기": "Read file contents",
    "파일로 출력 저장": "Save output to file",
    "객체를 JSON으로 변환 후 파일 저장": "Convert object to JSON and save",
    "파일에 내용 저장": "Save content to file",
    "파일에 내용 추가": "Append content to file",
    "조건으로 필터링": "Filter by condition",
    "필요한 속성 선택": "Select needed properties",
    "정렬": "Sort data",
    "그룹별 묶기": "Group items",
    "개수/합계 측정": "Measure count or total",
    "JSON을 객체로 변환": "Convert JSON to object",
    "객체를 JSON으로 변환": "Convert object to JSON",
    "CSV 읽기": "Read CSV",
    "CSV 저장": "Save CSV",
    "CSV 문자열 변환": "Convert CSV string",
    "REST API 호출": "Call REST API",
    "외부 프로그램 실행": "Run external program",
    "프로세스 조회": "Check process",
    "프로세스 종료": "Stop process",
    "작업 완료 대기": "Wait for job completion",
    "작업 결과 받기": "Receive job result",
    "오류 발생시키기": "Raise an error",
    "스크립트 종료": "Exit script",
    "값 반환": "Return value",
    "새 항목 생성": "Create new item",
    "파일/폴더 이동": "Move file/folder",
    "파일/폴더 삭제": "Delete file/folder",
    "ZIP 압축 해제": "Extract ZIP archive",
    "경로 존재 확인": "Check path existence",
    "조건 확인": "Check condition",
    "반복 실행": "Run loop",
    "Node 문법 검사": "Check Node.js syntax",
    "npm 의존성 설치": "Install npm dependencies",
    "npm 스크립트 실행": "Run npm script",
    "Python 검증 실행": "Run Python validation",
    "Python 실행": "Run Python",
    "Git 변경 상태 확인": "Check Git status",
    "Git 커밋 준비": "Stage Git changes",
    "Git 커밋 생성": "Create Git commit",
    "Git 태그 생성": "Create Git tag",
    "원격 저장소로 업로드": "Push to remote repository",
    "임시 보관": "Stash changes",
    "변경량 요약 확인": "Check diff summary",
    "변경 내용 확인": "Review code changes",
    "커밋 기록 확인": "Check commit history",
    "변경사항 강제 되돌리기": "Force-discard changes",
    "추적되지 않는 파일 삭제": "Delete untracked files",
    "Node.js 실행": "Run Node.js",
    "파일에서 문자열 검색": "Search text in files",
    "스크립트블록 실행": "Run script block",
    "검증 단계 실행": "Run validation step",
    "문자열 포함 검증": "Check whether text contains a string",
    "스크립트 실행 정책 변경": "Change script execution policy",
    "표 형태로 출력": "Display as table",
    "명령 실행": "Run command",
    "FastAPI 기능 불러오기": "Import FastAPI features",
    "Pydantic 모델 기능 불러오기": "Import Pydantic model features",
    "친절한 종료": "Exit with a helpful message",
    "조건 검증": "Validate condition",
    "next 값 꺼내기": "Get next value",
    "CSV 딕셔너리 읽기": "Read CSV as dictionaries",
    "CSV 헤더 쓰기": "Write CSV header",
    "파일/경로 처리": "Handle file/path",
    "FastAPI 의존성 주입": "Use FastAPI dependency injection",
    "FastAPI 요청값 검증 설정": "Configure FastAPI request validation",
    "딕셔너리 항목 설정": "Set dictionary item",
    "화면에 출력": "Print to screen",
    "검증 함수 호출": "Call validation function",
    "JavaScript 코드 실행": "Run JavaScript code",
    "Worker/JavaScript 코드 실행": "Run Worker/JavaScript code",
    "JSON 설정 줄": "JSON configuration line",
    "조회 조건 필터": "Filter query condition",
    "SQL 줄 해석": "SQL line",
    "Flex 배치 방식 설정": "Set flex layout",
    "색상 설정": "Set color",
    "글자 스타일 설정": "Set text style",
    "CSS 줄 해석": "CSS line",
    "텍스트 표시": "Display text",
    "HTML 줄 해석": "HTML line",
    "package.json 설정": "package.json setting",
    "쉘 명령 실행": "Run shell command",
    "GitHub Actions YAML 설정": "GitHub Actions YAML setting",
    "이미지 빌드 중 명령 실행": "Run command while building image",
    "Dockerfile 설정": "Dockerfile setting",
    ".env 설정": ".env setting",
    "Python 패키지 의존성": "Python package dependency",
    "pyproject.toml 설정": "pyproject.toml setting",
    "YAML 설정": "YAML setting",
    "변수에 값 저장": "Store a value in a variable",
    "작업 폴더 이동": "Change working directory",
    "시간값을 변수에 저장": "Store current time in a variable",
    "파이프라인 처리": "Pipeline processing",
    "파일/폴더 복사": "Copying files/folders",
    "ZIP 압축 생성": "Create ZIP archive"
  };

  function codeRuleHasKoreanV334A11C(value) {
    return /[가-힣]/.test(String(value || ""));
  }

  function codeRuleTranslateTitleV334A11C(title) {
    if (!codeRuleIsEnglishV334A11B()) return title;
    const raw = String(title || "");
    if (CODE_RULE_TITLE_MAP_V334_A11C[raw]) return CODE_RULE_TITLE_MAP_V334_A11C[raw];

    let out = raw;
    const replacements = [
      ["파일/경로", "file/path"],
      ["버전관리", "version control"],
      ["변수/값", "variable/value"],
      ["파이프라인", "pipeline"],
      ["검증", "validation"],
      ["주의", "caution"],
      ["조건", "condition"],
      ["반복", "loop"],
      ["함수", "function"],
      ["파일", "file"],
      ["폴더", "folder"],
      ["문자열", "string"],
      ["객체", "object"],
      ["배열", "array"],
      ["값", "value"],
      ["줄", "line"],
      ["설정", "setting"],
      ["실행", "run"],
      ["저장", "save"],
      ["읽기", "read"],
      ["쓰기", "write"],
      ["생성", "create"],
      ["확인", "check"],
      ["처리", "process"],
      ["변환", "convert"],
      ["출력", "output"]
    ];

    replacements.forEach(function(pair) {
      out = out.split(pair[0]).join(pair[1]);
    });

    return codeRuleHasKoreanV334A11C(out) ? "Interpreted code step" : out;
  }

  function codeRuleTranslateExplainV334A11C(title, explain) {
    if (!codeRuleIsEnglishV334A11B()) return explain;

    const raw = String(explain || "");
    if (!codeRuleHasKoreanV334A11C(raw)) return raw;

    const enTitle = codeRuleTranslateTitleV334A11C(title);
    return "This line is interpreted as: " + enTitle + ". Review the original line, paths, options, and surrounding context before running it.";
  }
`;

  rules = rules.replace("  function makeStep(lineNo, code, title, explain, risk) {", layer + "\n\n  function makeStep(lineNo, code, title, explain, risk) {");
  changes.push({ target: "insert_rules_runtime_i18n_layer", file: "rules", count: 1 });
}

function insertCodeDisplayLayer() {
  if (code.includes("function codeExplainerDisplayTextV334A11C")) {
    changes.push({ target: "insert_code_display_i18n_layer", file: "code", count: 0, skipped: true });
    return;
  }

  const layer = `
function codeExplainerHasKoreanV334A11C(value) {
  return /[가-힣]/.test(String(value || ""));
}

function codeExplainerDisplayTextV334A11C(value) {
  const raw = String(value || "");
  if (!codeExplainerIsEnglishV334A11B()) return raw;

  const exact = {
    "처리": "process",
    "분류 없음": "none",
    "태그 없음": "none",
    "흐름": "flow",
    "값": "value",
    "생성": "produces",
    "사용": "uses",
    "파일/경로": "file/path",
    "버전관리": "version control",
    "변수/값": "variable/value",
    "파이프라인": "pipeline",
    "검증": "validation",
    "파일": "file",
    "변수": "variable",
    "주의": "caution",
    "확인필요": "needs check",
    "단계": "steps",
    "함수 단위 해석": "Function-level explanation",
    "함수 단위 해석 대상이 아직 감지되지 않았습니다.": "No function-level explanation target has been detected yet.",
    "변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다.": "No clear variable storage, processing, or output flow was detected.",
    "함수/클래스/섹션 같은 큰 구조는 뚜렷하게 감지되지 않았습니다.": "No large structure such as a function, class, or section was clearly detected.",
    "분석 후 표시됩니다.": "Shown after analysis."
  };

  if (exact[raw]) return exact[raw];

  let out = raw;
  const replacements = [
    ["파일/경로", "file/path"],
    ["버전관리", "version control"],
    ["변수/값", "variable/value"],
    ["파이프라인", "pipeline"],
    ["데이터 흐름", "data flow"],
    ["호출 흐름", "call flow"],
    ["함수 해석", "function explanation"],
    ["함수 목록", "function list"],
    ["함수 단위 해석", "function-level explanation"],
    ["주요 분류", "main categories"],
    ["주요 태그", "main tags"],
    ["주요 함수/구간", "main functions/sections"],
    ["추천 읽는 순서", "recommended reading order"],
    ["주의/위험", "caution/risk"],
    ["확인필요", "needs check"],
    ["미지원", "unsupported"],
    ["확실", "exact"],
    ["추정", "inferred"],
    ["검증", "validation"],
    ["파일", "file"],
    ["폴더", "folder"],
    ["변수", "variable"],
    ["값", "value"],
    ["흐름", "flow"],
    ["생성:", "produces:"],
    ["사용:", "uses:"],
    ["생성", "produces"],
    ["사용", "uses"],
    ["단계", "steps"],
    ["내용 줄", "content lines"],
    ["주석/문서 줄", "comment/doc lines"],
    ["글자", "characters"],
    ["줄", "lines"],
    ["개", "items"],
    ["분류 없음", "none"],
    ["태그 없음", "none"]
  ];

  replacements.forEach(function(pair) {
    out = out.split(pair[0]).join(pair[1]);
  });

  out = out.replace(/(\\d+)items/g, "$1 items");
  out = out.replace(/(\\d+)lines/g, "$1 lines");

  return codeExplainerHasKoreanV334A11C(out) ? "Translated summary" : out;
}
`;

  const anchor = `function codeExplainerTextV334A11B(ko, en) {
  return codeExplainerIsEnglishV334A11B() ? en : ko;
}
`;

  if (!code.includes(anchor)) {
    throw new Error("Could not find codeExplainerTextV334A11B anchor");
  }

  code = code.replace(anchor, anchor + layer + "\n");
  changes.push({ target: "insert_code_display_i18n_layer", file: "code", count: 1 });
}

insertRulesRuntimeLayer();
insertCodeDisplayLayer();

replaceExact(
  "rules_make_step_runtime_translation",
  "rules",
  `  function makeStep(lineNo, code, title, explain, risk) {
    const confidence = confidenceForStep(title, explain);
    return {
      lineNo: lineNo,
      code: code,
      title: title,
      explain: explain,
      risk: risk || "low",
      confidence: confidence,
      confidenceLabel: confidenceLabel(confidence)
    };
  }`,
  `  function makeStep(lineNo, code, title, explain, risk) {
    const originalTitle = title;
    const originalExplain = explain;
    const displayTitle = codeRuleTranslateTitleV334A11C(originalTitle);
    const displayExplain = codeRuleTranslateExplainV334A11C(originalTitle, originalExplain);
    const confidence = confidenceForStep(originalTitle, originalExplain);
    return {
      lineNo: lineNo,
      code: code,
      title: displayTitle,
      explain: displayExplain,
      titleKo: originalTitle,
      explainKo: originalExplain,
      risk: risk || "low",
      confidence: confidence,
      confidenceLabel: confidenceLabel(confidence)
    };
  }`,
  true
);

replaceExact(
  "code_outline_empty",
  "code",
  `      : '<p class="muted">함수/클래스/섹션 같은 큰 구조는 뚜렷하게 감지되지 않았습니다.</p>';`,
  `      : '<p class="muted">' + codeExplainerDisplayTextV334A11C("함수/클래스/섹션 같은 큰 구조는 뚜렷하게 감지되지 않았습니다.") + '</p>';`
);

replaceExact(
  "code_reading_order_translate",
  "code",
  `      return '<li>' + escapeHtml(item.replace(/^\\d+\\.\\s*/, "")) + '</li>';`,
  `      return '<li>' + escapeHtml(codeExplainerDisplayTextV334A11C(item.replace(/^\\d+\\.\\s*/, ""))) + '</li>';`
);

replaceExact(
  "code_quick_categories_count_translate",
  "code",
  `    const categories = countByValue(steps, function(step) { return step.category || "처리"; });`,
  `    const categories = countByValue(steps, function(step) { return codeExplainerDisplayTextV334A11C(step.category || "처리"); });`
);

replaceExact(
  "code_long_code_notice",
  "code",
  `      ? '<p class="code-report-categories">긴 코드 모드: ' + steps.length + '개 단계 / ' + lineCount + '줄. 화면에는 핵심 앞부분을 우선 보여주고, 전체 흐름은 리포트와 Mermaid 원문으로 확인합니다.</p>'`,
  `      ? '<p class="code-report-categories">' + (codeExplainerIsEnglishV334A11B() ? "Long-code mode: " + steps.length + " steps / " + lineCount + " lines. The screen shows the key first part first; use the report and Mermaid source for the full flow." : "긴 코드 모드: " + steps.length + "개 단계 / " + lineCount + "줄. 화면에는 핵심 앞부분을 우선 보여주고, 전체 흐름은 리포트와 Mermaid 원문으로 확인합니다.") + '</p>'`
);

replaceExact(
  "code_steps_chip",
  "code",
  `      '<span class="code-report-chip"><strong>' + steps.length + '</strong><small>단계</small></span>' +`,
  `      '<span class="code-report-chip"><strong>' + steps.length + '</strong><small>' + codeExplainerTextV334A11B("단계", "steps") + '</small></span>' +`
);

replaceExact(
  "code_needs_check_chip",
  "code",
  `      '<span class="code-report-chip"><strong>' + unsupportedItems.length + '</strong><small>확인필요</small></span>' +`,
  `      '<span class="code-report-chip"><strong>' + unsupportedItems.length + '</strong><small>' + codeExplainerTextV334A11B("확인필요", "needs check") + '</small></span>' +`
);

replaceExact(
  "code_format_count_summary_translate",
  "code",
  `      '<p class="code-report-categories">' + escapeHtml(formatCountSummary(categories) || "분류 없음") + '</p>' +`,
  `      '<p class="code-report-categories">' + escapeHtml(codeExplainerDisplayTextV334A11C(formatCountSummary(categories) || "분류 없음")) + '</p>' +`
);

replaceExact(
  "code_flow_pill_produce",
  "code",
  `      parts.push('<span class="code-flow-pill produce">생성: ' + escapeHtml(produces.join(", ")) + '</span>');`,
  `      parts.push('<span class="code-flow-pill produce">' + codeExplainerTextV334A11B("생성: ", "Produces: ") + escapeHtml(produces.join(", ")) + '</span>');`
);

replaceExact(
  "code_flow_pill_consume",
  "code",
  `      parts.push('<span class="code-flow-pill consume">사용: ' + escapeHtml(consumes.join(", ")) + '</span>');`,
  `      parts.push('<span class="code-flow-pill consume">' + codeExplainerTextV334A11B("사용: ", "Uses: ") + escapeHtml(consumes.join(", ")) + '</span>');`
);

replaceExact(
  "code_flow_list_summary_translate",
  "code",
  `      const summary = item.summary ? ' <span class="muted">· ' + escapeHtml(item.summary) + '</span>' : "";`,
  `      const summary = item.summary ? ' <span class="muted">· ' + escapeHtml(codeExplainerDisplayTextV334A11C(item.summary)) + '</span>' : "";`
);

replaceExact(
  "code_flow_list_kind_name_translate",
  "code",
  `        escapeHtml(item.kind || item.type || "흐름") + ' · ' +
        escapeHtml(item.name || "값") + target + summary +`,
  `        escapeHtml(codeExplainerDisplayTextV334A11C(item.kind || item.type || "흐름")) + ' · ' +
        escapeHtml(item.name || codeExplainerDisplayTextV334A11C("값")) + target + summary +`
);

replaceExact(
  "code_data_flow_empty_message",
  "code",
  `      renderFlowList(dataFlow, "변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다.") +`,
  `      renderFlowList(dataFlow, codeExplainerDisplayTextV334A11C("변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다.")) +`
);

replaceExact(
  "code_function_interpretation_summary",
  "code",
  `      '<details class="code-flow-detail"><summary>함수 단위 해석</summary>' +`,
  `      '<details class="code-flow-detail"><summary>' + codeExplainerTextV334A11B("함수 단위 해석", "Function-level explanation") + '</summary>' +`
);

replaceExact(
  "code_function_interpretation_empty",
  "code",
  `      renderFunctionInterpretationListV251(functionInterpretations, "함수 단위 해석 대상이 아직 감지되지 않았습니다.") +`,
  `      renderFunctionInterpretationListV251(functionInterpretations, codeExplainerDisplayTextV334A11C("함수 단위 해석 대상이 아직 감지되지 않았습니다.")) +`
);

replaceExact(
  "code_function_picker_selected",
  "code",
  `    ? '<p class="code-report-categories">선택 해석 중: <strong>' + escapeHtml(selected.name) + '</strong> · line ' + escapeHtml(String(selected.lineNo)) + '</p>'`,
  `    ? '<p class="code-report-categories">' + codeExplainerTextV334A11B("선택 해석 중: ", "Selected for explanation: ") + '<strong>' + escapeHtml(selected.name) + '</strong> · line ' + escapeHtml(String(selected.lineNo)) + '</p>'`
);

replaceExact(
  "code_function_picker_intro",
  "code",
  `    : '<p class="code-report-categories">대형 파일에서는 전체 뼈대를 먼저 보고, 검색/필터로 함수를 찾은 뒤 하나를 골라 단독 해석할 수 있습니다.</p>';`,
  `    : '<p class="code-report-categories">' + codeExplainerTextV334A11B("대형 파일에서는 전체 뼈대를 먼저 보고, 검색/필터로 함수를 찾은 뒤 하나를 골라 단독 해석할 수 있습니다.", "For large files, first review the overall skeleton, then search/filter functions and choose one for focused explanation.") + '</p>';`
);

replaceExact(
  "code_function_picker_hidden",
  "code",
  `    ? '<p class="muted">검색 결과가 길어 처음 ' + shown.length + '개만 표시합니다. 검색어나 역할군 필터로 더 좁혀보세요.</p>'`,
  `    ? '<p class="muted">' + (codeExplainerIsEnglishV334A11B() ? "The result list is long, so only the first " + shown.length + " items are shown. Narrow it with a search term or role filter." : "검색 결과가 길어 처음 " + shown.length + "개만 표시합니다. 검색어나 역할군 필터로 더 좁혀보세요.") + '</p>'`
);

replaceExact(
  "code_function_picker_empty",
  "code",
  `    : '<p class="muted">검색/필터 조건에 맞는 함수가 없습니다.</p>';`,
  `    : '<p class="muted">' + codeExplainerTextV334A11B("검색/필터 조건에 맞는 함수가 없습니다.", "No function matches the current search/filter conditions.") + '</p>';`
);

replaceExact(
  "code_function_picker_summary",
  "code",
  `  return '<details class="code-flow-detail function-picker-v259 function-picker-filter-v260"><summary>함수 목록 / 선택 해석 · 전체 ' +
    escapeHtml(String(outline.length)) + '개 · 결과 ' + escapeHtml(String(filtered.length)) + '개</summary>' +`,
  `  return '<details class="code-flow-detail function-picker-v259 function-picker-filter-v260"><summary>' + codeExplainerTextV334A11B("함수 목록 / 선택 해석 · 전체 ", "Function list / selected explanation · total ") +
    escapeHtml(String(outline.length)) + codeExplainerTextV334A11B("개 · 결과 ", " · results ") + escapeHtml(String(filtered.length)) + codeExplainerTextV334A11B("개", "") + '</summary>' +`
);

replaceExact(
  "code_copy_report_missing_alert",
  "code",
  `      alert("복사할 코드 해석 리포트가 없습니다. 먼저 분석하기를 눌러주세요.");`,
  `      alert(codeExplainerTextV334A11B("복사할 코드 해석 리포트가 없습니다. 먼저 분석하기를 눌러주세요.", "There is no code explanation report to copy. Analyze code first."));`
);

replaceExact(
  "code_copy_report_success_alert",
  "code",
  `      alert("코드 해석 리포트를 복사했습니다.");`,
  `      alert(codeExplainerTextV334A11B("코드 해석 리포트를 복사했습니다.", "Copied the code explanation report."));`
);

replaceExact(
  "code_copy_report_fail_alert",
  "code",
  `      alert("리포트 복사 실패: " + String(error));`,
  `      alert(codeExplainerTextV334A11B("리포트 복사 실패: ", "Failed to copy report: ") + String(error));`
);

app = app.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11c");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11c");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11c");

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A11C_CODE_EXPLAINER_RUNTIME_I18N_LAYER",
  version: "20260623_v334_a11c",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11C Code Explainer Runtime i18n Layer");
md.push("");
md.push("Purpose: translate Code explainer rule outputs at the makeStep boundary and clean remaining Code explainer rendering labels.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a11c |");
md.push("| changed targets | " + changes.filter((c) => c.count > 0).length + " |");
md.push("");
md.push("## Replacement counts");
md.push("");
md.push("| target | file | count |");
md.push("|---|---|---:|");
for (const c of changes) {
  md.push("| " + c.target + " | " + c.file + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A11C_CODE_EXPLAINER_RUNTIME_I18N_LAYER");
console.log("version=20260623_v334_a11c");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.target + "=" + c.count));
