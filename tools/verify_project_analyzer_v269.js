const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v269_a1";

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
        { type: "object", name: "CodeExplainer", line: 18, snippet: "window.CodeExplainer = { analyzeSnippet }" },
        { type: "function", name: "analyzeSnippet", line: 20, snippet: "function analyzeSnippet(source) { return source; }" },
        { type: "function", name: "customPipeline", line: 24, snippet: "function customPipeline(source) { return source; }" }
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

  assertOk("APP_VERSION_V269", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V269", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v269_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("MARKER_V267", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1"));
  assertOk("MARKER_V269", projectAnalyzer.includes("PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1"));
  assertOk("FOCUS_FUNCTION_V269", projectAnalyzer.includes("filterProjectCrossFileLinksByFocusV269"));
  assertOk("FOCUS_EXPORT_V269", projectAnalyzer.includes("setCrossFileFocusV269: setProjectCrossFileFocusPathV269"));

  const elements = bootProjectAnalyzer();

  assertOk("PROJECT_ANALYZER_EXPORT", !!global.ProjectAnalyzer && typeof global.ProjectAnalyzer.renderProbeAnalysis === "function");
  assertOk("FOCUS_SET_EXPORT", typeof global.ProjectAnalyzer.setCrossFileFocusV269 === "function");
  assertOk("FOCUS_GET_EXPORT", typeof global.ProjectAnalyzer.getCrossFileFocusV269 === "function");
  assertOk("FOCUS_FILTER_EXPORT", typeof global.ProjectAnalyzer.filterCrossFileLinksByFocusV269 === "function");
  assertOk("FOCUS_FILES_EXPORT", typeof global.ProjectAnalyzer.getCrossFileAvailableFilesV269 === "function");

  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(makeProbeReport()));
  const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
  const files = global.ProjectAnalyzer.getCrossFileAvailableFilesV269(links);
  const appLinks = global.ProjectAnalyzer.filterCrossFileLinksByFocusV269(links, "src/pwa/app.js");
  const codeLinks = global.ProjectAnalyzer.filterCrossFileLinksByFocusV269(links, "src/pwa/code_explainer.js");

  assertOk("FOCUS_FILES_BUILT", files.includes("src/pwa/app.js") && files.includes("src/pwa/code_explainer.js"), JSON.stringify(files));
  assertOk("FOCUS_APP_LINKS_ONLY", appLinks.length > 0 && appLinks.every(link => link.from === "src/pwa/app.js" || link.to === "src/pwa/app.js"), JSON.stringify(appLinks));
  assertOk("FOCUS_CODE_LINKS_ONLY", codeLinks.length > appLinks.length && codeLinks.every(link => link.from === "src/pwa/code_explainer.js" || link.to === "src/pwa/code_explainer.js"), JSON.stringify(codeLinks));

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  let detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  let detailsText = stripHtml(detailsHtml);

  assertOk("FOCUS_SELECT_RENDERED", detailsHtml.includes("project-cross-file-focus-v269") && detailsHtml.includes("<select"));
  assertOk("FOCUS_DEFAULT_ALL", detailsText.includes("현재 보기: 전체"));
  assertOk("FOCUS_COUNT_RENDERED", detailsText.includes("표시 중인 연결:") && detailsText.includes("전체"));

  global.ProjectAnalyzer.setCrossFileFocusV269("src/pwa/app.js");

  assertOk("FOCUS_SET_VALUE", global.ProjectAnalyzer.getCrossFileFocusV269() === "src/pwa/app.js");

  detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  detailsText = stripHtml(detailsHtml);

  assertOk("FOCUS_APP_RENDERED", detailsText.includes("현재 보기: src/pwa/app.js"));
  assertOk("FOCUS_APP_ROW_PRESENT", detailsText.includes("src/pwa/app.js → src/pwa/code_explainer.js"));
  assertOk("FOCUS_NON_APP_ROW_HIDDEN", !detailsText.includes("src/pwa/code_explainer.js → src/pwa/code_explainer_rules.js"));
  assertOk("FOCUS_MERMAID_SHRUNK", detailsText.includes("파일 간 연결 Mermaid 코드") && detailsText.includes("app.js"));

  global.ProjectAnalyzer.setCrossFileFocusV269("src/pwa/not_exists.js");

  assertOk("FOCUS_INVALID_RESET", global.ProjectAnalyzer.getCrossFileFocusV269() === "all");

  if (process.exitCode) {
    console.error("V269_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V269_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_VERIFY_OK");
}

main();
