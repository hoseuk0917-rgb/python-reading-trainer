const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const PROJECT = path.join(ROOT, "src", "pwa", "project_analyzer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14v_project_probe_digest_raw_split.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14v_project_probe_digest_raw_split.json");

function read(file) {
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function write(file, text) {
  fs.writeFileSync(file, text.replace(/\s+$/g, "") + "\n", "utf8");
}

let index = read(INDEX);
let project = read(PROJECT);
let app = read(APP);
let rootIndex = read(ROOT_INDEX);

const changes = [];

if (!index.includes('id="projectProbeDigest"')) {
  const lines = index.split("\n");
  const buttonLine = lines.findIndex((line) => line.includes('id="copyProjectProbeCommandBtn"'));

  if (buttonLine < 0) {
    throw new Error("copyProjectProbeCommandBtn line not found");
  }

  let actionRowLine = buttonLine;
  while (actionRowLine >= 0 && !lines[actionRowLine].includes('<div class="project-action-row">')) {
    actionRowLine--;
  }

  if (actionRowLine < 0) {
    throw new Error("project-action-row before copy button not found");
  }

  const digestLines = [
    '          <div id="projectProbeDigest" class="project-probe-digest muted">',
    '            명령을 생성하면 실행 목적, 실행 흐름, 실행 전 확인, 산출물이 먼저 표시됩니다.',
    '          </div>',
    ''
  ];

  lines.splice(actionRowLine, 0, ...digestLines);
  index = lines.join("\n");
  changes.push({ target: "src/pwa/index.html", change: "add_project_probe_digest_box_line_based", count: 1 });
} else {
  changes.push({ target: "src/pwa/index.html", change: "add_project_probe_digest_box_line_based", count: 0 });
}

if (!project.includes("V334_A14V_PROJECT_PROBE_DIGEST_UI")) {
  const helper = String.raw`
  // V334_A14V_PROJECT_PROBE_DIGEST_UI
  function isProjectAnalyzerEnglishV334A14V() {
    try {
      if (typeof document !== "undefined") {
        const lang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
        if (lang.indexOf("en") === 0) return true;
      }

      if (typeof location !== "undefined" && /[?&]lang=en\b/i.test(location.search || "")) {
        return true;
      }
    } catch (error) {}

    return false;
  }

  function buildProjectProbeDigestHtmlV334A14V(projectRoot) {
    const root = String(projectRoot || "").trim() || "D:\\projects\\python-reading-trainer";
    const en = isProjectAnalyzerEnglishV334A14V();

    if (en) {
      return '' +
        '<div class="project-detail-section project-probe-digest-card">' +
        '<h3>Command summary</h3>' +
        '<p><strong>What it does:</strong> This is a read-only project inspection command. It does not run the app.</p>' +
        '<p><strong>Flow:</strong></p>' +
        '<ol>' +
        '<li>Check Python, Git, Node, and pip availability.</li>' +
        '<li>Scan the project file tree and key files.</li>' +
        '<li>Count lesson files, side-card files, JS/Python/JSON/Markdown files, and main code patterns.</li>' +
        '<li>Extract function, class, call, reference, and Mermaid structure candidates.</li>' +
        '<li>Write analysis outputs under the .tmp folder.</li>' +
        '</ol>' +
        '<p><strong>Before running:</strong> Confirm the project root path: <code>' + escapeHtml(root) + '</code>. It is normal for .tmp/project_probe_* files to be created.</p>' +
        '<p><strong>Outputs:</strong> <code>.tmp/project_probe_latest.json</code>, <code>.tmp/project_probe_latest_report.md</code>, and preview output in the terminal.</p>' +
        '<p class="muted">The raw PowerShell command below remains fully copyable.</p>' +
        '</div>';
    }

    return '' +
      '<div class="project-detail-section project-probe-digest-card">' +
      '<h3>명령 요약</h3>' +
      '<p><strong>무슨 명령:</strong> 앱을 실행하는 명령이 아니라, 프로젝트 구조를 읽기 전용으로 점검하는 분석 명령입니다.</p>' +
      '<p><strong>실행 흐름:</strong></p>' +
      '<ol>' +
      '<li>Python, Git, Node, pip 사용 가능 여부를 확인합니다.</li>' +
      '<li>프로젝트 파일 트리와 핵심 파일을 스캔합니다.</li>' +
      '<li>lesson 파일, side-card 파일, JS/Python/JSON/Markdown 파일 수와 주요 코드 패턴을 집계합니다.</li>' +
      '<li>함수, 클래스, 호출, 참조, Mermaid 구조도 후보를 추출합니다.</li>' +
      '<li>.tmp 폴더 아래에 분석 산출물을 저장합니다.</li>' +
      '</ol>' +
      '<p><strong>실행 전 확인:</strong> 프로젝트 루트 경로가 맞는지 확인하세요: <code>' + escapeHtml(root) + '</code>. .tmp/project_probe_* 파일이 생기는 것은 정상입니다.</p>' +
      '<p><strong>산출물:</strong> <code>.tmp/project_probe_latest.json</code>, <code>.tmp/project_probe_latest_report.md</code>, 터미널 preview 출력.</p>' +
      '<p class="muted">아래 PowerShell 원문은 그대로 복사해서 실행할 수 있습니다.</p>' +
      '</div>';
  }

  function renderProjectProbeDigestV334A14V(projectRoot) {
    const digest = el("projectProbeDigest");
    if (!digest) return;

    digest.classList.remove("muted");
    digest.innerHTML = buildProjectProbeDigestHtmlV334A14V(projectRoot);
  }

  function resetProjectProbeDigestV334A14V() {
    const digest = el("projectProbeDigest");
    if (!digest) return;

    digest.classList.add("muted");
    digest.textContent = isProjectAnalyzerEnglishV334A14V()
      ? "Generate a command to see its purpose, flow, checks, and outputs first."
      : "명령을 생성하면 실행 목적, 실행 흐름, 실행 전 확인, 산출물이 먼저 표시됩니다.";
  }

`;

  const anchor = "  function generateCommand() {";
  if (!project.includes(anchor)) {
    throw new Error("generateCommand anchor not found");
  }

  project = project.replace(anchor, helper + anchor);
  changes.push({ target: "src/pwa/project_analyzer.js", change: "add_digest_ui_helpers", count: 1 });
} else {
  changes.push({ target: "src/pwa/project_analyzer.js", change: "add_digest_ui_helpers", count: 0 });
}

{
  const lines = project.split("\n");
  const lastCommandLine = lines.findIndex((line) => line.trim() === "lastCommand = buildProbeCommand(root);");

  if (lastCommandLine < 0) {
    throw new Error("lastCommand assignment line not found");
  }

  const alreadyInserted = lines.slice(lastCommandLine + 1, lastCommandLine + 4).some((line) => line.includes("renderProjectProbeDigestV334A14V(root);"));

  if (!alreadyInserted) {
    lines.splice(lastCommandLine + 1, 0, "    renderProjectProbeDigestV334A14V(root);");
    project = lines.join("\n");
    changes.push({ target: "src/pwa/project_analyzer.js", change: "render_digest_after_generate_command_line_based", count: 1 });
  } else {
    changes.push({ target: "src/pwa/project_analyzer.js", change: "render_digest_after_generate_command_line_based", count: 0 });
  }
}

{
  const lines = project.split("\n");
  const resetLine = lines.findIndex((line) => line.includes('if (command) command.textContent = "Enter a project root and click “Generate command”.";'));

  if (resetLine < 0) {
    throw new Error("clearProjectAnalyzer command reset line not found");
  }

  const alreadyInserted = lines.slice(resetLine + 1, resetLine + 4).some((line) => line.includes("resetProjectProbeDigestV334A14V();"));

  if (!alreadyInserted) {
    lines.splice(resetLine + 1, 0, "    resetProjectProbeDigestV334A14V();");
    project = lines.join("\n");
    changes.push({ target: "src/pwa/project_analyzer.js", change: "reset_digest_on_clear_line_based", count: 1 });
  } else {
    changes.push({ target: "src/pwa/project_analyzer.js", change: "reset_digest_on_clear_line_based", count: 0 });
  }
}

if (!project.includes("V334_A14V_PROJECT_PROBE_DIRECT_DIGEST_WRAPPER")) {
  const directWrapper = String.raw`

// V334_A14V_PROJECT_PROBE_DIRECT_DIGEST_WRAPPER
(function() {
  if (typeof window === "undefined" || !window.ProjectAnalyzer) return;

  const api = window.ProjectAnalyzer;
  const originalBuildProbeCommand = api.buildProbeCommand;

  if (typeof originalBuildProbeCommand !== "function") return;
  if (originalBuildProbeCommand.__v334A14VDirectDigestWrapped) return;

  function isEnglishV334A14V() {
    try {
      if (typeof document !== "undefined") {
        const lang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
        if (lang.indexOf("en") === 0) return true;
      }

      if (typeof location !== "undefined" && /[?&]lang=en\b/i.test(location.search || "")) {
        return true;
      }
    } catch (error) {}

    return false;
  }

  function buildDirectDigestLinesV334A14V(projectRoot) {
    const root = String(projectRoot || "").trim() || "project root";

    if (isEnglishV334A14V()) {
      return [
        "# === PROJECT ANALYZER DIGEST V334-A14V ===",
        "# Summary: read-only project inspection command. It checks environment, scans files, extracts code structure candidates, and writes probe reports.",
        "# What it does: inspect project structure, not run the app.",
        "# Flow: check Python/Git/Node -> scan file tree -> count project assets -> extract function/class/call/reference candidates -> write .tmp reports.",
        "# Before running: confirm ProjectRoot is correct: " + root,
        "# Outputs: .tmp/project_probe_latest.json, .tmp/project_probe_latest_report.md, and terminal preview.",
        "# Raw command: starts below and remains fully copyable.",
        "# === RAW POWERSHELL COMMAND BELOW ===",
        ""
      ];
    }

    return [
      "# === PROJECT ANALYZER DIGEST V334-A14V ===",
      "# 종합요약: 프로젝트를 실행하지 않고, 환경 확인·파일 스캔·구조 후보 추출·probe 리포트 생성을 수행하는 읽기 전용 분석 명령입니다.",
      "# 무슨 명령: 앱 실행 명령이 아니라 프로젝트 구조 점검 명령입니다.",
      "# 실행 흐름: Python/Git/Node 확인 -> 파일 트리 스캔 -> 프로젝트 자산 수 집계 -> 함수/클래스/호출/참조 후보 추출 -> .tmp 리포트 저장.",
      "# 실행 전 확인: ProjectRoot 경로가 맞는지 확인: " + root,
      "# 산출물: .tmp/project_probe_latest.json, .tmp/project_probe_latest_report.md, 터미널 preview.",
      "# 원문 명령: 아래부터 그대로 복사 가능한 PowerShell 명령입니다.",
      "# === RAW POWERSHELL COMMAND BELOW ===",
      ""
    ];
  }

  const wrappedBuildProbeCommandV334A14V = function(projectRoot) {
    const command = String(originalBuildProbeCommand.apply(this, arguments) || "");

    if (!command.trim()) return command;
    if (/PROJECT ANALYZER DIGEST V334-A14V/.test(command)) return command;

    return buildDirectDigestLinesV334A14V(projectRoot).join("\n") + command;
  };

  wrappedBuildProbeCommandV334A14V.__v334A14VDirectDigestWrapped = true;
  api.buildProbeCommand = wrappedBuildProbeCommandV334A14V;
  api.__v334A14VBuildDirectDigestLines = buildDirectDigestLinesV334A14V;
})();
`;

  project = project.replace(/\s+$/g, "") + directWrapper + "\n";
  changes.push({ target: "src/pwa/project_analyzer.js", change: "append_direct_api_digest_wrapper", count: 1 });
} else {
  changes.push({ target: "src/pwa/project_analyzer.js", change: "append_direct_api_digest_wrapper", count: 0 });
}

function bumpVersion(text) {
  return text.replace(/20260623_v334_a14[a-z0-9_]*|20260623_v334_a13a/g, "20260623_v334_a14v");
}

index = bumpVersion(index);
app = bumpVersion(app);
rootIndex = bumpVersion(rootIndex);

write(INDEX, index);
write(PROJECT, project);
write(APP, app);
write(ROOT_INDEX, rootIndex);

const report = {
  audit: "V334_A14V_PROJECT_PROBE_DIGEST_RAW_SPLIT",
  version: "20260623_v334_a14v",
  strategy: "line-based insertion after exact line anchors",
  purpose: "Separate the Project Analyzer command digest from the raw PowerShell command in the UI and strengthen direct analyzer summary signals.",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14V Project Probe Digest / Raw Command Split");
md.push("");
md.push("Purpose: make the Project Analyzer generated command easier to understand before showing the long raw PowerShell command.");
md.push("");
md.push("## Strategy");
md.push("");
md.push("- Line-based insertion, not fragile multi-line exact block replacement.");
md.push("- Add digest box in the UI before the raw command box.");
md.push("- Keep `lastCommand = buildProbeCommand(root)` as the raw command source for copy.");
md.push("- Add direct API digest wrapper for direct analyzer audit readability.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | change | count |");
md.push("|---|---|---:|");

for (const c of changes) {
  md.push("| " + c.target + " | " + c.change + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14V_PROJECT_PROBE_DIGEST_RAW_SPLIT_LINE_BASED");
console.log("version=20260623_v334_a14v");
console.log("report=docs\\quality\\v334_a14v_project_probe_digest_raw_split.md");
changes.forEach((c) => console.log(c.change + "=" + c.count));
