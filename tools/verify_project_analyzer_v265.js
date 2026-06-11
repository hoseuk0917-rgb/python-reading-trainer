const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v265_a1";

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
        { type: "function", name: "analyzeSnippet", line: 20, snippet: "function analyzeSnippet(source) { return source; }" }
      ],
      "src/pwa/code_explainer_rules.js": [
        { type: "function", name: "analyze", line: 30, snippet: "function analyze(source) { return source; }" }
      ]
    },
    call_candidates: {
      "src/pwa/app.js": [
        { name: "analyzeSnippet", count: 2, line: 10, snippet: "CodeExplainer.analyzeSnippet(code)" }
      ],
      "src/pwa/code_explainer.js": [
        { name: "analyze", count: 3, line: 20, snippet: "CodeExplainerRules.analyze(source)" }
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

  assertOk("APP_VERSION_V265", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V265", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v265_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("RENDER_CROSS_FILE_FUNCTION", projectAnalyzer.includes("renderProjectCrossFileLinksV265"));
  assertOk("EXPORT_CROSS_FILE_BUILDER", projectAnalyzer.includes("buildCrossFileLinksV265: buildProjectCrossFileLinksV265"));

  const elements = bootProjectAnalyzer();

  assertOk("PROJECT_ANALYZER_EXPORT", !!global.ProjectAnalyzer && typeof global.ProjectAnalyzer.renderProbeAnalysis === "function");
  assertOk("CROSS_FILE_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.buildCrossFileLinksV265 === "function");

  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(makeProbeReport()));
  const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);

  assertOk("CROSS_FILE_LINKS_BUILT", Array.isArray(links) && links.length >= 2, JSON.stringify(links));
  assertOk("CROSS_FILE_APP_TO_CODE", links.some(link =>
    link.from === "src/pwa/app.js" &&
    link.to === "src/pwa/code_explainer.js" &&
    link.symbol === "analyzeSnippet"
  ), JSON.stringify(links));
  assertOk("CROSS_FILE_CODE_TO_RULES", links.some(link =>
    link.from === "src/pwa/code_explainer.js" &&
    link.to === "src/pwa/code_explainer_rules.js" &&
    link.symbol === "analyze"
  ), JSON.stringify(links));

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  const detailsText = stripHtml(detailsHtml);

  assertOk("CROSS_FILE_SECTION_RENDERED", detailsHtml.includes("파일 간 연결 후보"));
  assertOk("CROSS_FILE_BOUNDARY_TEXT", detailsText.includes("단일 함수 설명은 코드해석") && detailsText.includes("여러 파일 연결은 프로젝트분석"));
  assertOk("CROSS_FILE_ROW_APP_TO_CODE", detailsText.includes("src/pwa/app.js → src/pwa/code_explainer.js"));
  assertOk("CROSS_FILE_ROW_CODE_TO_RULES", detailsText.includes("src/pwa/code_explainer.js → src/pwa/code_explainer_rules.js"));
  assertOk("CROSS_FILE_MERMAID_CODE", detailsText.includes("graph LR") && detailsText.includes("analyzeSnippet"));

  if (process.exitCode) {
    console.error("V265_PROJECT_ANALYZER_CROSS_FILE_LINK_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V265_PROJECT_ANALYZER_CROSS_FILE_LINK_VERIFY_OK");
}

main();
