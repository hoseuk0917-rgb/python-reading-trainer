const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v271_a1";

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
        { type: "function", name: "init", line: 10, snippet: "function init() { window.CodeExplainer.analyzeSnippet(code); }" }
      ],
      "src/pwa/code_explainer.js": [
        { type: "window_object", name: "CodeExplainer", line: 18, snippet: "window.CodeExplainer = { analyzeSnippet }" },
        { type: "function", name: "analyzeSnippet", line: 20, snippet: "function analyzeSnippet(source) { return source; }" },
        { type: "function", name: "customPipeline", line: 24, snippet: "function customPipeline(source) { return source; }" }
      ],
      "src/pwa/code_explainer_rules.js": [
        { type: "window_object", name: "CodeExplainerRules", line: 28, snippet: "window.CodeExplainerRules = { analyze }" },
        { type: "function", name: "analyze", line: 30, snippet: "function analyze(source) { return source; }" }
      ]
    },
    call_candidates: {
      "src/pwa/app.js": [
        { name: "analyzeSnippet", count: 2, line: 10, snippet: "CodeExplainer.analyzeSnippet(code)" },
        { name: "CodeExplainer", count: 1, line: 10, snippet: "window.CodeExplainer.analyzeSnippet(code)" },
        { name: "customPipeline", count: 2, line: 12, snippet: "customPipeline(code)" },
        { name: "init", count: 8, line: 13, snippet: "init()" }
      ],
      "src/pwa/code_explainer.js": [
        { name: "analyze", count: 3, line: 20, snippet: "CodeExplainerRules.analyze(source)" },
        { name: "CodeExplainerRules", count: 1, line: 20, snippet: "window.CodeExplainerRules.analyze(source)" }
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

  assertOk("APP_VERSION_V271", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V271", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v271_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("MARKER_V267", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1"));
  assertOk("MARKER_V269", projectAnalyzer.includes("PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1"));
  assertOk("MARKER_V271", projectAnalyzer.includes("PROJECT_CROSS_FILE_DETAIL_PANEL_V271_A1"));
  assertOk("DETAIL_FUNCTION_V271", projectAnalyzer.includes("renderProjectCrossFileDetailPanelV271"));
  assertOk("EVIDENCE_ENRICH_FUNCTION_V271", projectAnalyzer.includes("enrichProjectCrossFileLinksWithEvidenceV271"));
  assertOk("DETAIL_EXPORT_V271", projectAnalyzer.includes("renderCrossFileDetailPanelV271: renderProjectCrossFileDetailPanelV271"));

  const elements = bootProjectAnalyzer();

  assertOk("PROJECT_ANALYZER_EXPORT", !!global.ProjectAnalyzer && typeof global.ProjectAnalyzer.renderProbeAnalysis === "function");
  assertOk("DETAIL_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.renderCrossFileDetailPanelV271 === "function");
  assertOk("EVIDENCE_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.enrichCrossFileLinksWithEvidenceV271 === "function");

  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(makeProbeReport()));
  const rawLinks = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
  const enriched = global.ProjectAnalyzer.enrichCrossFileLinksWithEvidenceV271(parsed, rawLinks);

  assertOk("EVIDENCE_ENRICHED", enriched.length === rawLinks.length && enriched.some(link => link.sourceEvidenceV271 && link.targetEvidenceV271), JSON.stringify(enriched));
  assertOk("CALL_SNIPPET_ATTACHED", enriched.some(link => link.symbol === "analyzeSnippet" && String(link.sourceEvidenceV271.snippet).includes("CodeExplainer.analyzeSnippet")), JSON.stringify(enriched));
  assertOk("TARGET_SNIPPET_ATTACHED", enriched.some(link => link.symbol === "analyzeSnippet" && String(link.targetEvidenceV271.snippet).includes("function analyzeSnippet")), JSON.stringify(enriched));

  const detailHtml = global.ProjectAnalyzer.renderCrossFileDetailPanelV271(enriched.find(link => link.symbol === "analyzeSnippet"));
  const detailText = stripHtml(detailHtml);

  assertOk("DETAIL_HTML_RENDERED", detailHtml.includes("project-cross-file-detail-v271") && detailText.includes("연결 상세"));
  assertOk("DETAIL_FIELDS_RENDERED", detailText.includes("from") && detailText.includes("to") && detailText.includes("symbol") && detailText.includes("confidence"));
  assertOk("DETAIL_EVIDENCE_RENDERED", detailText.includes("from 파일 근거") && detailText.includes("to 파일 근거"));

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  const detailsText = stripHtml(detailsHtml);

  assertOk("DETAIL_PANEL_IN_REPORT", detailsHtml.includes("project-cross-file-detail-v271") && detailsText.includes("연결 상세"));
  assertOk("DETAIL_PANEL_TEXT_V271", detailsText.includes("V271") && detailsText.includes("연결 상세 패널"));
  assertOk("DETAIL_PANEL_SNIPPET_IN_REPORT", detailsText.includes("CodeExplainer.analyzeSnippet") || detailsText.includes("function analyzeSnippet"));
  assertOk("FOCUS_FILTER_STILL_OK", detailsText.includes("파일 중심 필터"));
  assertOk("GROUPS_STILL_OK", detailsText.includes("전역 객체 / 공개 API 연결"));
  assertOk("MERMAID_STILL_OK", detailsText.includes("파일 간 연결 Mermaid 코드"));

  if (process.exitCode) {
    console.error("V271_PROJECT_ANALYZER_CROSS_FILE_DETAIL_PANEL_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V271_PROJECT_ANALYZER_CROSS_FILE_DETAIL_PANEL_VERIFY_OK");
}

main();
