const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v258_a1";

const TARGET_FILES = [
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/code_explainer_rules.js"
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function lineNoFromIndex(source, index) {
  return String(source || "").slice(0, Math.max(0, index)).split(/\r?\n/).length;
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function makeEl(id) {
  return {
    id,
    value: "",
    innerHTML: "",
    textContent: "",
    className: "",
    checked: false,
    disabled: false,
    children: [],
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    style: {},
    dataset: {},
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter(x => x !== child); },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return ""; },
    querySelector() { return makeEl("nested"); },
    querySelectorAll() { return []; },
    focus() {},
    select() {},
    scrollIntoView() {}
  };
}

function bootCodeExplainer() {
  const elements = {};

  global.window = global;
  global.navigator = { clipboard: null };
  global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  global.alert = function(message) { console.log("ALERT", String(message)); };
  global.mermaid = {
    async render(id, source) {
      return {
        svg: '<svg data-render-id="' + id + '"><text>' +
          String(source || "").replace(/[<>&]/g, " ") +
          '</text></svg>'
      };
    }
  };

  global.document = {
    readyState: "complete",
    body: makeEl("body"),
    addEventListener() {},
    removeEventListener() {},
    createElement(tag) { return makeEl(tag); },
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    querySelector() { return makeEl("query"); },
    querySelectorAll() { return []; }
  };

  [
    "codeInput",
    "codeSummary",
    "codeFlowAnalysisReport",
    "codeQuickReport",
    "codeConfidenceReport",
    "codeDetectionDetails",
    "codeStructureOverview",
    "codeWarnings",
    "codeSteps",
    "relatedCodeCards",
    "codeRelatedCards",
    "mermaidSource",
    "mermaidDiagram",
    "diagramStatus"
  ].forEach(id => elements[id] = makeEl(id));

  elements.codeLangSelect = makeEl("codeLangSelect");
  elements.codeLangSelect.value = "javascript";

  vm.runInThisContext(readText("src/pwa/code_explainer_rules.js"), { filename: "code_explainer_rules.js" });
  vm.runInThisContext(readText("src/pwa/code_explainer.js"), { filename: "code_explainer.js" });

  return elements;
}

function setAuditLearningContent() {
  global.CodeExplainer.setLearningContent(
    [
      {
        id: "audit_js_function_flow",
        title: "JavaScript 함수 흐름 읽기",
        question: "함수의 입력, 변수, 조건, 반복, return 흐름을 어떻게 읽을까요?",
        concepts: ["function", "return", "parameter", "javascript", "if", "for"],
        explanation: "함수는 입력을 받아 내부 변수와 조건/반복을 거쳐 결과를 반환합니다."
      },
      {
        id: "audit_js_async_fetch",
        title: "JavaScript async fetch 흐름",
        question: "async/await와 fetch는 어떤 순서로 읽을까요?",
        concepts: ["async", "await", "fetch", "promise", "try_catch"],
        explanation: "async 함수는 await로 비동기 결과를 기다리고 try/catch로 실패를 처리할 수 있습니다."
      }
    ],
    [
      {
        id: "audit_side_dom_event",
        title: "DOM 이벤트와 화면 요소",
        body: "querySelector, getElementById, addEventListener는 화면 요소를 찾고 이벤트를 연결할 때 자주 사용됩니다.",
        related_concepts: ["dom", "event_listener", "javascript"]
      },
      {
        id: "audit_side_array_transform",
        title: "배열 반복과 변환",
        body: "for, for...of, map, filter, reduce, push는 배열 데이터를 순서대로 처리하거나 새 배열을 만들 때 사용됩니다.",
        related_concepts: ["array", "for", "push", "map", "filter", "reduce"]
      },
      {
        id: "audit_side_json_data",
        title: "JSON 데이터 변환",
        body: "JSON.parse와 JSON.stringify는 문자열과 JavaScript 데이터 사이를 변환합니다.",
        related_concepts: ["json", "javascript"]
      }
    ]
  );
}

function addCandidate(list, seen, name, kind, lineNo) {
  if (!name) return;
  if (/^(if|for|while|switch|catch|function|return|else|do|try)$/.test(name)) return;

  const key = name + "@" + lineNo + "@" + kind;
  if (seen.has(key)) return;

  seen.add(key);
  list.push({ name, kind, lineNo });
}

function extractCandidateFunctions(source) {
  const text = String(source || "");
  const list = [];
  const seen = new Set();

  const patterns = [
    { kind: "function", regex: /(?:^|[\r\n;])\s*(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g },
    { kind: "arrow_function", regex: /(?:^|[\r\n;])\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/g }
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(text))) {
      addCandidate(list, seen, match[1], pattern.kind, lineNoFromIndex(text, match.index));
    }
  });

  const methodRegex = /(?:^|[\r\n])\s{0,12}(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/g;
  let match;

  while ((match = methodRegex.exec(text))) {
    const before = text.slice(Math.max(0, match.index - 700), match.index);
    const afterHeader = text.slice(match.index, Math.min(text.length, match.index + 120));

    if (!/class\s+[A-Za-z_$][\w$]*[\s\S]*$/.test(before)) continue;
    if (/function\s+$/.test(before.slice(-40))) continue;
    if (/=>/.test(afterHeader.split("{")[0])) continue;

    addCandidate(list, seen, match[1], "class_method", lineNoFromIndex(text, match.index));
  }

  return list.sort((a, b) => a.lineNo - b.lineNo);
}

async function analyzeSource(elements, source) {
  elements.codeFlowAnalysisReport.innerHTML = "";
  elements.codeInput.value = "";
  global.CodeExplainer.analyzeSnippet(source, "javascript");
  await new Promise(resolve => setTimeout(resolve, 100));

  const html = elements.codeFlowAnalysisReport.innerHTML || "";
  return {
    html,
    text: stripHtml(html)
  };
}

function patternPresence(source, outputText) {
  const raw = String(source || "");
  const out = String(outputText || "");

  return {
    source_has_arrow: raw.includes("=>"),
    source_has_async: /\basync\b/.test(raw),
    source_has_fetch: /fetch\s*\(/.test(raw),
    source_has_try_catch: /\btry\b[\s\S]*\bcatch\b/.test(raw),
    source_has_dom_event: /querySelector|getElementById|addEventListener/.test(raw),
    source_has_json: /JSON\.parse|JSON\.stringify/.test(raw),
    output_has_function_section: out.includes("함수 단위 해석"),
    output_has_mermaid: out.includes("함수 흐름도"),
    output_has_related_cards: out.includes("이 함수 이해에 도움 되는 카드") || out.includes("관련 카드"),
    output_has_async: out.includes("async") || out.includes("await"),
    output_has_promise: out.includes("promise") || out.includes("Promise"),
    output_has_dom: out.includes("dom") || out.includes("DOM") || out.includes("event_listener"),
    output_has_json: out.includes("json") || out.includes("JSON")
  };
}

function buildRecommendation(fileResult) {
  const notes = [];
  const p = fileResult.patterns;

  if (fileResult.candidate_count === 0) {
    notes.push("후보 함수가 탐지되지 않았다. 실제 코드가 설정/데이터 중심인지 확인 필요.");
  }

  if (fileResult.candidate_count > fileResult.covered_count) {
    notes.push("후보 함수 일부가 화면 해석 결과에 보이지 않는다. 함수 표시 상한 또는 미지원 패턴 가능성.");
  }

  if (p.source_has_arrow && !fileResult.covered_kinds.includes("arrow_function")) {
    notes.push("arrow function 후보가 있으나 해석 결과에 충분히 반영되지 않은 것으로 보인다.");
  }

  if (p.source_has_dom_event && !p.output_has_dom) {
    notes.push("DOM/event 패턴이 원문에 있으나 개념 표시가 약하다.");
  }

  if (p.source_has_try_catch && !fileResult.output_text.includes("try_catch")) {
    notes.push("try/catch 원문 대비 개념 표시가 약하다.");
  }

  if (notes.length === 0) {
    notes.push("현재 V257 기준 주요 함수 흐름은 감사 리포트에서 정상적으로 포착됨.");
  }

  return notes;
}

async function auditFile(elements, relPath) {
  const source = readText(relPath);
  const candidates = extractCandidateFunctions(source);
  const analysis = await analyzeSource(elements, source);

  const covered = candidates.filter(candidate => analysis.text.includes(candidate.name));
  const missed = candidates.filter(candidate => !analysis.text.includes(candidate.name));
  const coveredKinds = Array.from(new Set(covered.map(item => item.kind))).sort();

  const result = {
    file: relPath,
    line_count: source.split(/\r?\n/).length,
    char_count: source.length,
    candidate_count: candidates.length,
    covered_count: covered.length,
    covered_ratio: candidates.length ? covered.length / candidates.length : 0,
    covered: covered.slice(0, 16),
    missed: missed.slice(0, 16),
    covered_kinds: coveredKinds,
    patterns: patternPresence(source, analysis.text),
    output_text: analysis.text,
    output_excerpt: analysis.text.slice(0, 900)
  };

  result.recommendations = buildRecommendation(result);
  return result;
}

function mdEscape(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function renderReport(results) {
  const lines = [];

  lines.push("# V258 실제 JS 코드해석 감사 리포트");
  lines.push("");
  lines.push("- app_version: `20260611_v258_a1`");
  lines.push("- audit_scope: 실제 `src/pwa/*.js` 핵심 파일을 코드해석기에 입력해 함수 추출/표시/흐름도/관련카드 반응을 점검");
  lines.push("- generated_by: `tools/audit_code_explainer_real_js_v258.js`");
  lines.push("");

  lines.push("## 1. 요약");
  lines.push("");
  lines.push("| file | 후보 함수 | 표시 함수 | 표시율 | 함수 섹션 | Mermaid | 관련카드 |");
  lines.push("|---|---:|---:|---:|---|---|---|");

  results.forEach(result => {
    const ratio = result.candidate_count ? Math.round(result.covered_ratio * 100) + "%" : "N/A";
    lines.push([
      mdEscape(result.file),
      result.candidate_count,
      result.covered_count,
      ratio,
      result.patterns.output_has_function_section ? "Y" : "N",
      result.patterns.output_has_mermaid ? "Y" : "N",
      result.patterns.output_has_related_cards ? "Y" : "N"
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"));
  });

  lines.push("");
  lines.push("## 2. 파일별 상세");
  lines.push("");

  results.forEach(result => {
    lines.push("### " + result.file);
    lines.push("");
    lines.push("- lines: `" + result.line_count + "`");
    lines.push("- chars: `" + result.char_count + "`");
    lines.push("- candidate_functions: `" + result.candidate_count + "`");
    lines.push("- shown_in_output: `" + result.covered_count + "`");
    lines.push("- covered_kinds: `" + (result.covered_kinds.join(", ") || "none") + "`");
    lines.push("");

    lines.push("#### 표시된 후보 함수");
    lines.push("");
    if (result.covered.length) {
      lines.push("| name | kind | line |");
      lines.push("|---|---|---:|");
      result.covered.forEach(item => {
        lines.push("| " + mdEscape(item.name) + " | " + mdEscape(item.kind) + " | " + item.lineNo + " |");
      });
    } else {
      lines.push("- 없음");
    }

    lines.push("");
    lines.push("#### 화면에 보이지 않은 후보 함수");
    lines.push("");
    if (result.missed.length) {
      lines.push("| name | kind | line |");
      lines.push("|---|---|---:|");
      result.missed.forEach(item => {
        lines.push("| " + mdEscape(item.name) + " | " + mdEscape(item.kind) + " | " + item.lineNo + " |");
      });
    } else {
      lines.push("- 없음");
    }

    lines.push("");
    lines.push("#### 패턴 신호");
    lines.push("");
    lines.push("- source_has_arrow: `" + result.patterns.source_has_arrow + "`");
    lines.push("- source_has_async: `" + result.patterns.source_has_async + "`");
    lines.push("- source_has_fetch: `" + result.patterns.source_has_fetch + "`");
    lines.push("- source_has_try_catch: `" + result.patterns.source_has_try_catch + "`");
    lines.push("- source_has_dom_event: `" + result.patterns.source_has_dom_event + "`");
    lines.push("- source_has_json: `" + result.patterns.source_has_json + "`");
    lines.push("- output_has_function_section: `" + result.patterns.output_has_function_section + "`");
    lines.push("- output_has_mermaid: `" + result.patterns.output_has_mermaid + "`");
    lines.push("- output_has_related_cards: `" + result.patterns.output_has_related_cards + "`");
    lines.push("");

    lines.push("#### 추천 보강 방향");
    lines.push("");
    result.recommendations.forEach(note => {
      lines.push("- " + note);
    });
    lines.push("");
  });

  lines.push("## 3. 결론");
  lines.push("");
  lines.push("- V258은 기능 추가보다 실제 프로젝트 파일 대상 감사 리포트 생성에 초점을 둔다.");
  lines.push("- 이 리포트의 `화면에 보이지 않은 후보 함수` 목록이 다음 V259 보강 후보가 된다.");
  lines.push("- 특히 표시 상한, 객체 리터럴 메서드, 이벤트 콜백, 대형 파일 요약 품질을 다음 단계에서 볼 수 있다.");
  lines.push("");
  lines.push("V258_REAL_JS_AUDIT_OK");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const outIndex = process.argv.indexOf("--out");
  const outPath = outIndex >= 0 ? process.argv[outIndex + 1] : "reports/code_explainer_real_js_audit_v258.md";

  const app = readText("src/pwa/app.js");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  if (!app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";')) {
    throw new Error("APP_VERSION_V258_MISSING");
  }

  if (!codeExplainer.includes("FUNCTION_IR_JS_QUALITY_V257_A1")) {
    throw new Error("V257_JS_QUALITY_MARKER_MISSING");
  }

  if (!codeExplainer.includes("FUNCTION_IR_V257_VISIBLE_STEPS_A1")) {
    throw new Error("V257_VISIBLE_STEPS_MARKER_MISSING");
  }

  const elements = bootCodeExplainer();

  if (!global.CodeExplainer || typeof global.CodeExplainer.analyzeSnippet !== "function") {
    throw new Error("CODE_EXPLAINER_EXPORT_MISSING");
  }

  if (typeof global.CodeExplainer.setLearningContent === "function") {
    setAuditLearningContent();
  }

  const results = [];

  for (const relPath of TARGET_FILES) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) {
      results.push({
        file: relPath,
        line_count: 0,
        char_count: 0,
        candidate_count: 0,
        covered_count: 0,
        covered_ratio: 0,
        covered: [],
        missed: [],
        covered_kinds: [],
        patterns: {},
        output_text: "",
        output_excerpt: "",
        recommendations: ["파일이 존재하지 않는다."]
      });
      continue;
    }

    results.push(await auditFile(elements, relPath));
  }

  const report = renderReport(results);
  fs.mkdirSync(path.dirname(path.join(ROOT, outPath)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, outPath), report.trimEnd() + "\n", "utf8");

  const totalCandidates = results.reduce((sum, item) => sum + item.candidate_count, 0);
  const totalCovered = results.reduce((sum, item) => sum + item.covered_count, 0);

  console.log("V258_REAL_JS_AUDIT_OK");
  console.log("TARGET_FILES", results.length);
  console.log("TOTAL_CANDIDATES", totalCandidates);
  console.log("TOTAL_COVERED", totalCovered);
  console.log("REPORT", outPath);
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V258_REAL_JS_AUDIT_ERROR");
  process.exit(1);
});
