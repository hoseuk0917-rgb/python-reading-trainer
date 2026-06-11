const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v266_a1";

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function assertOk(name, condition, detail) {
  console.log(name, condition ? "OK" : "FAIL");
  if (!condition) {
    if (detail) console.error("DETAIL", detail);
    process.exitCode = 1;
  }
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
    hidden: false,
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

function bootProjectAnalyzer() {
  const elements = {};

  global.window = global;
  global.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
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

  global.addEventListener = function() {};
  global.removeEventListener = function() {};

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
    "projectAnalysisSummary",
    "projectAnalysisDetails",
    "projectMermaidDiagram",
    "projectMermaidSource",
    "projectDiagramStatus",
    "projectRootInput",
    "projectProbeCommand",
    "projectProbeOutput",
    "generateProjectProbeBtn",
    "copyProjectProbeCommandBtn",
    "analyzeProjectProbeBtn",
    "clearProjectAnalyzerBtn"
  ].forEach(id => elements[id] = makeEl(id));

  vm.runInThisContext(readText("src/pwa/project_analyzer.js"), { filename: "project_analyzer.js" });

  return elements;
}

function makeProbeReport() {
  return {
    root: "D:/projects/python-reading-trainer",
    git: { head: "test-head", status_short: "" },
    counts: {
      files_total: 4,
      lesson_files: 98,
      side_card_files: 50,
      lesson_cards_estimated: 1785,
      side_cards_estimated: 440
    },
    role_counts: { pwa_core_js: 4 },
    environment: {
      python_executable: "python",
      python_version: "3.12.0",
      git: "git version test",
      node: "v22",
      pip: "pip test",
      required_pip_packages: [],
      standard_library_only: true
    },
    symbols: {
      "src/pwa/app.js": [
        { type: "function", name: "init", line: 10, snippet: "function init() { window.CodeExplainer.analyzeSnippet(code); }" },
        { type: "function", name: "add", line: 12, snippet: "function add(a, b) { return a + b; }" },
        { type: "function", name: "has", line: 13, snippet: "function has(x) { return !!x; }" }
      ],
      "src/pwa/code_explainer.js": [
        { type: "object", name: "CodeExplainer", line: 18, snippet: "window.CodeExplainer = { analyzeSnippet }" },
        { type: "function", name: "analyzeSnippet", line: 20, snippet: "function analyzeSnippet(source) { return source; }" },
        { type: "function", name: "add", line: 22, snippet: "function add(a, b) { return a + b; }" },
        { type: "function", name: "has", line: 23, snippet: "function has(x) { return !!x; }" },
        { type: "function", name: "escapeHtml", line: 24, snippet: "function escapeHtml(value) { return value; }" }
      ],
      "src/pwa/code_explainer_rules.js": [
        { type: "object", name: "CodeExplainerRules", line: 28, snippet: "window.CodeExplainerRules = { analyze }" },
        { type: "function", name: "analyze", line: 30, snippet: "function analyze(source) { return source; }" }
      ]
    },
    call_candidates: {
      "src/pwa/app.js": [
        { name: "analyzeSnippet", count: 2, line: 10, snippet: "CodeExplainer.analyzeSnippet(code)" },
        { name: "CodeExplainer", count: 1, line: 10, snippet: "window.CodeExplainer.analyzeSnippet(code)" },
        { name: "add", count: 20, line: 11, snippet: "add(a, b)" },
        { name: "has", count: 10, line: 12, snippet: "has(state)" },
        { name: "init", count: 8, line: 13, snippet: "init()" },
        { name: "escapeHtml", count: 7, line: 14, snippet: "escapeHtml(value)" }
      ],
      "src/pwa/code_explainer.js": [
        { name: "analyze", count: 3, line: 20, snippet: "CodeExplainerRules.analyze(source)" },
        { name: "CodeExplainerRules", count: 1, line: 20, snippet: "window.CodeExplainerRules.analyze(source)" },
        { name: "add", count: 5, line: 21, snippet: "add(a, b)" }
      ]
    },
    references: {
      "src/pwa/index.html": [
        "code_explainer_rules.js",
        "code_explainer.js",
        "app.js"
      ]
    },
    key_files: {
      "src/pwa/app.js": { exists: true, size: 100 },
      "src/pwa/code_explainer.js": { exists: true, size: 200 }
    },
    candidate_bundles: {
      project_analyzer: ["src/pwa/project_analyzer.js"],
      code_explainer_diagram: ["src/pwa/code_explainer.js", "src/pwa/code_explainer_rules.js"]
    },
    mermaid: "flowchart TD\n  APP --> CE"
  };
}

function main() {
  const app = readText("src/pwa/app.js");
  const projectAnalyzer = readText("src/pwa/project_analyzer.js");

  assertOk("APP_VERSION_V266", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V266", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v266_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("FILTER_FUNCTION_V266", projectAnalyzer.includes("filterAndRankProjectCrossFileLinksV266"));
  assertOk("EXPORT_FILTER_V266", projectAnalyzer.includes("filterCrossFileLinksV266: filterAndRankProjectCrossFileLinksV266"));

  const elements = bootProjectAnalyzer();

  assertOk("PROJECT_ANALYZER_EXPORT", !!global.ProjectAnalyzer && typeof global.ProjectAnalyzer.renderProbeAnalysis === "function");
  assertOk("CROSS_FILE_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.buildCrossFileLinksV265 === "function");
  assertOk("FILTER_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.filterCrossFileLinksV266 === "function");

  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(makeProbeReport()));
  const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);

  assertOk("CROSS_FILE_LINKS_BUILT", Array.isArray(links) && links.length >= 3, JSON.stringify(links));

  const appToCode = links.find(link =>
    link.from === "src/pwa/app.js" &&
    link.to === "src/pwa/code_explainer.js" &&
    link.symbol === "analyzeSnippet"
  );
  const codeToRules = links.find(link =>
    link.from === "src/pwa/code_explainer.js" &&
    link.to === "src/pwa/code_explainer_rules.js" &&
    link.symbol === "analyze"
  );
  const appToCodeObject = links.find(link =>
    link.from === "src/pwa/app.js" &&
    link.to === "src/pwa/code_explainer.js" &&
    link.symbol === "CodeExplainer"
  );

  assertOk("HIGH_SIGNAL_APP_TO_CODE", !!appToCode && appToCode.confidence === "high", JSON.stringify(links));
  assertOk("HIGH_SIGNAL_CODE_TO_RULES", !!codeToRules && codeToRules.confidence === "high", JSON.stringify(links));
  assertOk("HIGH_SIGNAL_GLOBAL_OBJECT", !!appToCodeObject && appToCodeObject.confidence === "high", JSON.stringify(links));

  assertOk("GENERIC_ADD_FILTERED", !links.some(link => link.symbol === "add" && link.kind === "call-to-symbol"), JSON.stringify(links));
  assertOk("GENERIC_HAS_FILTERED", !links.some(link => link.symbol === "has" && link.kind === "call-to-symbol"), JSON.stringify(links));
  assertOk("GENERIC_INIT_FILTERED", !links.some(link => link.symbol === "init" && link.kind === "call-to-symbol"), JSON.stringify(links));
  assertOk("GENERIC_ESCAPEHTML_FILTERED", !links.some(link => link.symbol === "escapeHtml" && link.kind === "call-to-symbol"), JSON.stringify(links));

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  const detailsText = stripHtml(detailsHtml);

  assertOk("CROSS_FILE_SECTION_RENDERED", detailsHtml.includes("파일 간 연결 후보"));
  assertOk("NOISE_FILTER_TEXT", detailsText.includes("V266 노이즈 필터"));
  assertOk("CONFIDENCE_RENDERED", detailsText.includes("high · call-to-symbol · analyzeSnippet"));
  assertOk("GENERIC_NOT_RENDERED", !detailsText.includes("call-to-symbol · add") && !detailsText.includes("call-to-symbol · has"));
  assertOk("BOUNDARY_TEXT_STILL_OK", detailsText.includes("단일 함수 설명은 코드해석") && detailsText.includes("여러 파일 연결은 프로젝트분석"));
  assertOk("MERMAID_STILL_OK", detailsText.includes("graph LR") && detailsText.includes("analyzeSnippet"));

  if (process.exitCode) {
    console.error("V266_PROJECT_ANALYZER_CROSS_FILE_NOISE_FILTER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V266_PROJECT_ANALYZER_CROSS_FILE_NOISE_FILTER_VERIFY_OK");
}

main();
