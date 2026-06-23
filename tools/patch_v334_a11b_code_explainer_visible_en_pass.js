const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11b_code_explainer_visible_en_pass.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11b_code_explainer_visible_en_pass.json");

let code = fs.readFileSync(CODE, "utf8");
let rules = fs.readFileSync(RULES, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function countOf(text, needle) {
  return text.split(needle).length - 1;
}

function replaceIn(targetName, fileName, oldValue, newValue) {
  let text = fileName === "code" ? code : fileName === "rules" ? rules : app;
  const count = countOf(text, oldValue);
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (fileName === "code") code = text;
  else if (fileName === "rules") rules = text;
  else app = text;

  changes.push({ target: targetName, file: fileName, count });
}

function replaceRegexIn(targetName, fileName, re, newValue) {
  let text = fileName === "code" ? code : fileName === "rules" ? rules : app;
  const before = text;
  text = text.replace(re, newValue);
  const count = before === text ? 0 : 1;

  if (fileName === "code") code = text;
  else if (fileName === "rules") rules = text;
  else app = text;

  changes.push({ target: targetName, file: fileName, count });
}

function insertCodeHelper() {
  if (code.includes("function codeExplainerTextV334A11B")) {
    changes.push({ target: "insert_code_helper", file: "code", count: 0, skipped: true });
    return;
  }

  const helper = `
function codeExplainerIsEnglishV334A11B() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const queryLang = params.get("lang") || params.get("locale") || "";
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    const storedLang =
      (window.localStorage && (
        localStorage.getItem("pythonTrainerLang") ||
        localStorage.getItem("language") ||
        localStorage.getItem("lang") ||
        ""
      )) || "";
    return /^en/i.test(queryLang) || /^en/i.test(htmlLang) || /^en/i.test(storedLang);
  } catch (_) {
    return false;
  }
}

function codeExplainerTextV334A11B(ko, en) {
  return codeExplainerIsEnglishV334A11B() ? en : ko;
}
`;

  if (code.includes('"use strict";')) {
    code = code.replace('"use strict";', '"use strict";' + helper);
  } else {
    code = helper + "\n" + code;
  }
  changes.push({ target: "insert_code_helper", file: "code", count: 1 });
}

function insertRulesHelper() {
  if (rules.includes("function codeRuleTextV334A11B")) {
    changes.push({ target: "insert_rules_helper", file: "rules", count: 0, skipped: true });
    return;
  }

  const helper = `
function codeRuleIsEnglishV334A11B() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const queryLang = params.get("lang") || params.get("locale") || "";
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    const storedLang =
      (window.localStorage && (
        localStorage.getItem("pythonTrainerLang") ||
        localStorage.getItem("language") ||
        localStorage.getItem("lang") ||
        ""
      )) || "";
    return /^en/i.test(queryLang) || /^en/i.test(htmlLang) || /^en/i.test(storedLang);
  } catch (_) {
    return false;
  }
}

function codeRuleTextV334A11B(ko, en) {
  return codeRuleIsEnglishV334A11B() ? en : ko;
}
`;

  if (rules.includes('"use strict";')) {
    rules = rules.replace('"use strict";', '"use strict";' + helper);
  } else {
    rules = helper + "\n" + rules;
  }
  changes.push({ target: "insert_rules_helper", file: "rules", count: 1 });
}

insertCodeHelper();
insertRulesHelper();

// Code explainer detection / status labels.
replaceIn(
  "code_auto_detect_message",
  "code",
  'add("자동감지로 코드 모양을 판별했습니다.");',
  'add(codeExplainerTextV334A11B("자동감지로 코드 모양을 판별했습니다.", "Automatic detection identified the code shape."));'
);

replaceIn(
  "code_detection_ambiguous_hint",
  "code",
  'add("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.");',
  'add(codeExplainerTextV334A11B("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.", "If detection seems uncertain, choose the language manually from the dropdown and analyze again."));'
);

replaceIn(
  "code_selected_detected_chips",
  "code",
  '\'<span class="code-detection-chip">선택: \' + escapeHtml(requestedLabel) + \'</span>\' +\n      \'<span class="code-detection-chip strong">감지: \' + escapeHtml(detectedLabel) + \'</span>\' +',
  '\'<span class="code-detection-chip">\' + codeExplainerTextV334A11B("선택: ", "Selected: ") + escapeHtml(requestedLabel) + \'</span>\' +\n      \'<span class="code-detection-chip strong">\' + codeExplainerTextV334A11B("감지: ", "Detected: ") + escapeHtml(detectedLabel) + \'</span>\' +'
);

replaceIn(
  "code_risk_medium_label",
  "code",
  'if (risk === "medium") return "주의";',
  'if (risk === "medium") return codeExplainerTextV334A11B("주의", "Caution");'
);

replaceIn(
  "code_risk_low_label",
  "code",
  'return "낮음";',
  'return codeExplainerTextV334A11B("낮음", "Low");'
);

replaceIn(
  "code_confidence_exact_label",
  "code",
  'if (confidence === "exact") return "규칙 일치";',
  'if (confidence === "exact") return codeExplainerTextV334A11B("규칙 일치", "Rule matched");'
);

replaceIn(
  "code_confidence_inferred_label",
  "code",
  'if (confidence === "inferred") return "추정 해석";',
  'if (confidence === "inferred") return codeExplainerTextV334A11B("추정 해석", "Inferred");'
);

replaceIn(
  "code_confidence_default_label",
  "code",
  'return "추정 해석";',
  'return codeExplainerTextV334A11B("추정 해석", "Inferred");'
);

replaceIn(
  "code_related_cards_summary",
  "code",
  'summary.textContent = "추천 카드 " + cards.length + "개 보기";',
  'summary.textContent = codeExplainerIsEnglishV334A11B() ? "Show " + cards.length + " recommended cards" : "추천 카드 " + cards.length + "개 보기";'
);

replaceIn(
  "code_check_commands_summary",
  "code",
  'summary.textContent = "확인할 명령어 " + actions.length + "개 보기";',
  'summary.textContent = codeExplainerIsEnglishV334A11B() ? "Show " + actions.length + " check commands" : "확인할 명령어 " + actions.length + "개 보기";'
);

replaceIn(
  "code_risk_filter_on_notice",
  "code",
  '? "현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다."',
  '? codeExplainerTextV334A11B("현재 위험/주의 필터가 켜져 있어 해당 단계만 보여줍니다.", "The caution/risk filter is on, so only those steps are shown.")'
);

replaceIn(
  "code_no_risk_filter_notice",
  "code",
  '? \'<p class="muted">현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.</p>\'',
  '? \'<p class="muted">\' + codeExplainerTextV334A11B("현재 필터에서 위험/주의 단계가 없습니다. 전체 해석을 보려면 필터를 끄세요.", "No caution/risk steps match the current filter. Turn off the filter to see the full explanation.") + \'</p>\''
);

replaceIn(
  "code_no_risky_commands",
  "code",
  'box.textContent = "위험/주의 명령은 감지되지 않았습니다.";',
  'box.textContent = codeExplainerTextV334A11B("위험/주의 명령은 감지되지 않았습니다.", "No caution/risky commands were detected.");'
);

// Code structure and report labels.
replaceIn(
  "code_structure_warning_line",
  "code",
  '? \'<p class="code-structure-warning">주의 구간: \' + escapeHtml(warningLines.join(" / ")) + \'</p>\'',
  '? \'<p class="code-structure-warning">\' + codeExplainerTextV334A11B("주의 구간: ", "Caution section: ") + escapeHtml(warningLines.join(" / ")) + \'</p>\''
);

replaceIn(
  "code_structure_no_warning",
  "code",
  ': \'<p class="muted">주의/위험 구간은 별도로 감지되지 않았습니다.</p>\';',
  ': \'<p class="muted">\' + codeExplainerTextV334A11B("주의/위험 구간은 별도로 감지되지 않았습니다.", "No separate caution/risk section was detected.") + \'</p>\';'
);

replaceIn(
  "code_stats_line_count",
  "code",
  '\'<span><strong>\' + stats.lineCount + \'</strong><small>줄</small></span>\' +',
  '\'<span><strong>\' + stats.lineCount + \'</strong><small>\' + codeExplainerTextV334A11B("줄", "lines") + \'</small></span>\' +'
);

replaceIn(
  "code_stats_nonempty_count",
  "code",
  '\'<span><strong>\' + stats.nonEmptyCount + \'</strong><small>내용 줄</small></span>\' +',
  '\'<span><strong>\' + stats.nonEmptyCount + \'</strong><small>\' + codeExplainerTextV334A11B("내용 줄", "content lines") + \'</small></span>\' +'
);

replaceIn(
  "code_stats_comment_count",
  "code",
  '\'<span><strong>\' + stats.commentLikeCount + \'</strong><small>주석/문서 줄</small></span>\' +',
  '\'<span><strong>\' + stats.commentLikeCount + \'</strong><small>\' + codeExplainerTextV334A11B("주석/문서 줄", "comment/doc lines") + \'</small></span>\' +'
);

replaceIn(
  "code_stats_char_count",
  "code",
  '\'<span><strong>\' + stats.charCount + \'</strong><small>글자</small></span>\' +',
  '\'<span><strong>\' + stats.charCount + \'</strong><small>\' + codeExplainerTextV334A11B("글자", "characters") + \'</small></span>\' +'
);

replaceIn(
  "code_top_categories",
  "code",
  '\'<p class="code-structure-categories">주요 분류: \' + escapeHtml(overview.topCategories || "분류 없음") + \'</p>\' +',
  '\'<p class="code-structure-categories">\' + codeExplainerTextV334A11B("주요 분류: ", "Main categories: ") + escapeHtml(overview.topCategories || codeExplainerTextV334A11B("분류 없음", "none")) + \'</p>\' +'
);

replaceIn(
  "code_top_tags",
  "code",
  '\'<p class="code-structure-categories">주요 태그: \' + escapeHtml(overview.topTags || "태그 없음") + \'</p>\' +',
  '\'<p class="code-structure-categories">\' + codeExplainerTextV334A11B("주요 태그: ", "Main tags: ") + escapeHtml(overview.topTags || codeExplainerTextV334A11B("태그 없음", "none")) + \'</p>\' +'
);

replaceIn(
  "code_outline_summary",
  "code",
  '\'<details class="code-structure-detail"><summary>주요 함수/구간</summary>\' + outlineHtml + \'</details>\' +',
  '\'<details class="code-structure-detail"><summary>\' + codeExplainerTextV334A11B("주요 함수/구간", "Main functions/sections") + \'</summary>\' + outlineHtml + \'</details>\' +'
);

replaceIn(
  "code_reading_order_summary",
  "code",
  '\'<details class="code-structure-detail"><summary>추천 읽는 순서</summary>\' + orderHtml + \'</details>\' +',
  '\'<details class="code-structure-detail"><summary>\' + codeExplainerTextV334A11B("추천 읽는 순서", "Recommended reading order") + \'</summary>\' + orderHtml + \'</details>\' +'
);

replaceIn(
  "code_legacy_summary",
  "code",
  '\'<details class="code-detail-legacy-summary-v328-a1"><summary>기존 숫자 요약 보기</summary>\' +',
  '\'<details class="code-detail-legacy-summary-v328-a1"><summary>\' + codeExplainerTextV334A11B("기존 숫자 요약 보기", "Show previous numeric summary") + \'</summary>\' +'
);

replaceIn(
  "code_legacy_risk_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + warnings.length + \'</strong><small>위험/주의</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + warnings.length + \'</strong><small>\' + codeExplainerTextV334A11B("위험/주의", "caution/risk") + \'</small></span>\' +'
);

replaceIn(
  "code_legacy_unsupported_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + (confidence.unsupported || 0) + \'</strong><small>미지원</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + (confidence.unsupported || 0) + \'</strong><small>\' + codeExplainerTextV334A11B("미지원", "unsupported") + \'</small></span>\' +'
);

replaceIn(
  "code_no_unsupported",
  "code",
  ': \'<p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p>\';',
  ': \'<p class="muted">\' + codeExplainerTextV334A11B("미지원 함수/명령은 따로 감지되지 않았습니다.", "No unsupported functions/commands were detected.") + \'</p>\';'
);

replaceIn(
  "code_confidence_exact_chip",
  "code",
  '\'<span class="code-confidence-chip confidence-exact"><strong>\' + (confidence.exact || 0) + \'</strong><small>확실</small></span>\' +',
  '\'<span class="code-confidence-chip confidence-exact"><strong>\' + (confidence.exact || 0) + \'</strong><small>\' + codeExplainerTextV334A11B("확실", "exact") + \'</small></span>\' +'
);

replaceIn(
  "code_confidence_inferred_chip",
  "code",
  '\'<span class="code-confidence-chip confidence-inferred"><strong>\' + (confidence.inferred || 0) + \'</strong><small>추정</small></span>\' +',
  '\'<span class="code-confidence-chip confidence-inferred"><strong>\' + (confidence.inferred || 0) + \'</strong><small>\' + codeExplainerTextV334A11B("추정", "inferred") + \'</small></span>\' +'
);

replaceIn(
  "code_confidence_unsupported_chip",
  "code",
  '\'<span class="code-confidence-chip confidence-unsupported"><strong>\' + (confidence.unsupported || 0) + \'</strong><small>미지원</small></span>\' +',
  '\'<span class="code-confidence-chip confidence-unsupported"><strong>\' + (confidence.unsupported || 0) + \'</strong><small>\' + codeExplainerTextV334A11B("미지원", "unsupported") + \'</small></span>\' +'
);

replaceIn(
  "code_unsupported_summary",
  "code",
  '\'<summary>미지원/확인필요 함수·명령</summary>\' +',
  '\'<summary>\' + codeExplainerTextV334A11B("미지원/확인필요 함수·명령", "Unsupported / needs-check functions or commands") + \'</summary>\' +'
);

replaceIn(
  "code_data_flow_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + dataFlow.length + \'</strong><small>데이터 흐름</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + dataFlow.length + \'</strong><small>\' + codeExplainerTextV334A11B("데이터 흐름", "data flow") + \'</small></span>\' +'
);

replaceIn(
  "code_call_flow_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + callFlow.length + \'</strong><small>호출 흐름</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + callFlow.length + \'</strong><small>\' + codeExplainerTextV334A11B("호출 흐름", "call flow") + \'</small></span>\' +'
);

replaceIn(
  "code_function_interpretation_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + functionInterpretations.length + \'</strong><small>함수 해석</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + functionInterpretations.length + \'</strong><small>\' + codeExplainerTextV334A11B("함수 해석", "function explanations") + \'</small></span>\' +'
);

replaceIn(
  "code_function_outline_chip",
  "code",
  '\'<span class="code-report-chip"><strong>\' + functionOutlineV259.length + \'</strong><small>함수 목록</small></span>\' +',
  '\'<span class="code-report-chip"><strong>\' + functionOutlineV259.length + \'</strong><small>\' + codeExplainerTextV334A11B("함수 목록", "function list") + \'</small></span>\' +'
);

replaceIn(
  "code_data_flow_details",
  "code",
  '\'<details class="code-flow-detail"><summary>데이터 흐름</summary>\' +',
  '\'<details class="code-flow-detail"><summary>\' + codeExplainerTextV334A11B("데이터 흐름", "Data flow") + \'</summary>\' +'
);

replaceIn(
  "code_call_flow_details",
  "code",
  '\'<details class="code-flow-detail"><summary>호출 흐름</summary>\' +',
  '\'<details class="code-flow-detail"><summary>\' + codeExplainerTextV334A11B("호출 흐름", "Call flow") + \'</summary>\' +'
);

replaceIn(
  "code_call_flow_empty",
  "code",
  'renderFlowList(callFlow, "함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다.") +',
  'renderFlowList(callFlow, codeExplainerTextV334A11B("함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다.", "No clear function definition/call flow was detected.")) +'
);

replaceIn(
  "code_flowchart_collapsed_title",
  "code",
  '\'<strong>흐름도는 필요할 때 펼쳐서 봅니다</strong>\' +',
  '\'<strong>\' + codeExplainerTextV334A11B("흐름도는 필요할 때 펼쳐서 봅니다", "Open the flowchart only when needed") + \'</strong>\' +'
);

replaceIn(
  "code_flowchart_collapsed_body",
  "code",
  '\'<p class="muted">기본 화면에서는 그림을 바로 펼치지 않습니다. 코드를 먼저 읽고, 흐름이 필요할 때 아래 버튼으로 그림을 생성하세요. 감지된 단계는 \' + stepCount + \'개입니다.</p>\';',
  '\'<p class="muted">\' + (codeExplainerIsEnglishV334A11B() ? "The diagram is not expanded by default. Read the code first, then generate the diagram below when you need the flow. Detected steps: " + stepCount + "." : "기본 화면에서는 그림을 바로 펼치지 않습니다. 코드를 먼저 읽고, 흐름이 필요할 때 아래 버튼으로 그림을 생성하세요. 감지된 단계는 " + stepCount + "개입니다.") + \'</p>\';'
);

replaceIn(
  "code_flowchart_button",
  "code",
  'button.textContent = "흐름도 보기";',
  'button.textContent = codeExplainerTextV334A11B("흐름도 보기", "Show flowchart");'
);

replaceIn(
  "code_flowchart_waiting",
  "code",
  'if (status) status.textContent = "흐름도 대기 중";',
  'if (status) status.textContent = codeExplainerTextV334A11B("흐름도 대기 중", "Flowchart waiting");'
);

replaceIn(
  "code_quick_placeholder",
  "code",
  'quick.textContent = "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.";',
  'quick.textContent = codeExplainerTextV334A11B("분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.", "After analysis, step count, risky lines, and main categories will be summarized.");'
);

replaceIn(
  "code_confidence_placeholder",
  "code",
  'confidence.textContent = "분석하면 확실/추정/미지원 단계가 표시됩니다.";',
  'confidence.textContent = codeExplainerTextV334A11B("분석하면 확실/추정/미지원 단계가 표시됩니다.", "After analysis, exact, inferred, and unsupported steps will be shown.");'
);

replaceIn(
  "code_flow_placeholder",
  "code",
  'flowAnalysis.textContent = "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.";',
  'flowAnalysis.textContent = codeExplainerTextV334A11B("분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.", "After analysis, data flow and function call flow will be shown.");'
);

replaceIn(
  "code_structure_placeholder",
  "code",
  'structure.textContent = "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.";',
  'structure.textContent = codeExplainerTextV334A11B("긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.", "After analyzing long code, the overall structure, main functions/sections, and reading order will be shown.");'
);

// Rule-level labels and representative PowerShell sample steps.
replaceIn(
  "rules_confidence_exact",
  "rules",
  'if (confidence === "exact") return "확실";',
  'if (confidence === "exact") return codeRuleTextV334A11B("확실", "exact");'
);

replaceIn(
  "rules_confidence_inferred",
  "rules",
  'if (confidence === "inferred") return "추정";',
  'if (confidence === "inferred") return codeRuleTextV334A11B("추정", "inferred");'
);

replaceIn(
  "rules_confidence_unsupported",
  "rules",
  'if (confidence === "unsupported") return "미지원";',
  'if (confidence === "unsupported") return codeRuleTextV334A11B("미지원", "unsupported");'
);

replaceIn(
  "rules_confidence_default",
  "rules",
  'return "추정";',
  'return codeRuleTextV334A11B("추정", "inferred");'
);

replaceRegexIn(
  "rules_set_location_step",
  "rules",
  /return makeStep\(lineNo, t, "작업 폴더 이동", "이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("작업 폴더 이동", "Change working directory"), codeRuleTextV334A11B("이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", "This changes the working directory from which later commands will run."), risk);'
);

replaceRegexIn(
  "rules_date_stamp_step",
  "rules",
  /return makeStep\(lineNo, t, "시간값을 변수에 저장", "\$" \+ name \+ " 변수에 현재 날짜\/시간 문자열을 넣습니다\. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);'
);

replaceRegexIn(
  "rules_variable_assignment_step",
  "rules",
  /return makeStep\(lineNo, t, "변수에 값 저장", "\$" \+ name \+ " 변수에 값을 넣습니다\. 이후 줄에서 \$" \+ name \+ "을 쓰면 이 값을 다시 사용합니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);'
);

replaceRegexIn(
  "rules_pipeline_step",
  "rules",
  /return makeStep\(lineNo, t, "파이프라인 처리", "앞 명령의 결과를 뒤 명령으로 넘깁니다\. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);'
);

replaceRegexIn(
  "rules_copy_item_step",
  "rules",
  /return makeStep\(lineNo, t, "파일\/폴더 복사", "원본 파일이나 폴더를 다른 위치로 복사합니다\. -Recurse가 있으면 폴더 안의 내용까지 포함합니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);'
);

replaceRegexIn(
  "rules_compress_archive_step",
  "rules",
  /return makeStep\(lineNo, t, "ZIP 압축 생성", "지정한 파일이나 폴더를 zip 파일로 묶습니다\.", risk\);/g,
  'return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);'
);

app = app.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11b");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11b");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a11b");

fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A11B_CODE_EXPLAINER_VISIBLE_EN_PASS",
  version: "20260623_v334_a11b",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11B Code Explainer Visible EN Pass");
md.push("");
md.push("Purpose: reduce visible Korean in Code explainer detection, summary, report chips, flowchart prompt, and representative PowerShell rule explanations.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a11b |");
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

console.log("V334_A11B_CODE_EXPLAINER_VISIBLE_EN_PASS");
console.log("version=20260623_v334_a11b");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.target + "=" + c.count));
