const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14t_structured_code_summary.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14t_structured_code_summary.json");

let rules = fs.readFileSync(RULES, "utf8");
let code = fs.readFileSync(CODE, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

if (!rules.includes("V334_A14T_STRUCTURED_CODE_SUMMARY")) {
  const patch = String.raw`

// V334_A14T_STRUCTURED_CODE_SUMMARY
(function() {
  if (typeof window === "undefined" || !window.CodeExplainerRules) return;

  const api = window.CodeExplainerRules;
  const originalAnalyze = api.analyze;

  if (typeof originalAnalyze !== "function") return;
  if (originalAnalyze.__v334A14TWrapped) return;

  function isEnglishV334A14T(result) {
    try {
      if (typeof document !== "undefined") {
        const lang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
        if (lang.indexOf("en") === 0) return true;
      }

      if (typeof location !== "undefined" && /[?&]lang=en\b/i.test(location.search || "")) {
        return true;
      }
    } catch (error) {}

    const text = String((result && result.summary) || "") + " " + String((result && result.flowSummary) || "");
    return /Overall|Main flow|Before running|Check Git status/i.test(text) && !/[가-힣]/.test(text);
  }

  function cleanTitleV334A14T(step, fallbackIndex, english) {
    const raw = String(
      (step && (step.title || step.displayTitle || step.summary || step.explain || step.displayExplain)) ||
      (english ? "Step " + fallbackIndex : fallbackIndex + "단계")
    ).trim();

    return raw
      .replace(/\s+/g, " ")
      .replace(/\.$/, "")
      .slice(0, 64);
  }

  function uniqueFlowV334A14T(steps, english) {
    const seen = {};
    const items = [];

    (steps || []).forEach(function(step) {
      const title = cleanTitleV334A14T(step, items.length + 1, english);
      const key = title.toLowerCase();

      if (!title || seen[key]) return;

      seen[key] = true;
      items.push(title);
    });

    return items.slice(0, 8);
  }

  function buildTaskLineV334A14T(source, steps, english) {
    const text = String(source || "");
    const stepText = (steps || []).map(function(step) {
      return [
        step && step.title,
        step && step.displayTitle,
        step && step.explain,
        step && step.displayExplain
      ].filter(Boolean).join(" ");
    }).join(" ");

    const all = text + "\n" + stepText;

    const hasCopy = /Copy-Item|복사|copy/i.test(all);
    const hasZip = /Compress-Archive|ZIP|압축|archive|compress/i.test(all);
    const hasGit = /git\s+status|Git 변경 상태|Check Git status/i.test(all);
    const hasBackup = /backup|백업/i.test(all);

    if (english) {
      if ((hasCopy || hasBackup) && hasZip && hasGit) {
        return "What it does: This script backs up project files or folders, compresses the backup into a ZIP file, then checks the Git working-tree status.";
      }

      if ((hasCopy || hasBackup) && hasZip) {
        return "What it does: This script copies files or folders to a backup location and compresses the result into a ZIP file.";
      }

      if (hasGit) {
        return "What it does: This PowerShell script runs project maintenance commands and checks the Git state at the end.";
      }

      return "What it does: This PowerShell script runs several commands in order. Read the flow first, then check the risky lines before running it.";
    }

    if ((hasCopy || hasBackup) && hasZip && hasGit) {
      return "무슨 작업: 프로젝트 파일이나 폴더를 백업 위치로 복사하고 ZIP으로 묶은 뒤 Git 변경 상태를 확인하는 절차입니다.";
    }

    if ((hasCopy || hasBackup) && hasZip) {
      return "무슨 작업: 파일이나 폴더를 백업 위치로 복사하고 결과를 ZIP 파일로 압축하는 절차입니다.";
    }

    if (hasGit) {
      return "무슨 작업: 프로젝트 유지보수 명령을 순서대로 실행하고 마지막에 Git 상태를 확인하는 절차입니다.";
    }

    return "무슨 작업: 여러 PowerShell 명령을 순서대로 실행하는 스크립트입니다. 흐름을 먼저 보고, 위험한 줄은 실행 전에 확인해야 합니다.";
  }

  function buildChecksV334A14T(source, result, english) {
    const text = String(source || "");
    const checks = [];
    const warningText = ((result && result.warnings) || []).map(function(w) {
      return [w && w.title, w && w.explain, w && w.risk].filter(Boolean).join(" ");
    }).join(" ");

    if (/-Force\b/i.test(text)) {
      checks.push(english
        ? "Check whether -Force could overwrite or force-handle an existing target."
        : "-Force 옵션 때문에 기존 대상이 덮이거나 강제로 처리될 수 있는지 확인");
    }

    if (/Copy-Item\b/i.test(text) || /복사/.test(warningText)) {
      checks.push(english
        ? "Confirm the source and destination paths before copying."
        : "복사 원본과 백업 대상 경로가 맞는지 확인");
    }

    if (/Compress-Archive\b/i.test(text)) {
      checks.push(english
        ? "Confirm that Compress-Archive is available in the current PowerShell environment."
        : "Compress-Archive 명령이 현재 PowerShell 환경에서 사용 가능한지 확인");
    }

    if (/git\s+status/i.test(text)) {
      checks.push(english
        ? "Use git status --short after the run to confirm what changed."
        : "실행 후 git status --short로 변경 파일을 확인");
    }

    if (/Remove-Item|git\s+clean|git\s+reset\s+--hard/i.test(text)) {
      checks.push(english
        ? "This includes destructive commands. Preview or back up before running."
        : "삭제/초기화 계열 명령이 포함되어 있으면 실행 전 미리보기 또는 백업 필요");
    }

    if (!checks.length && /medium|high|danger/i.test(warningText)) {
      checks.push(english
        ? "Review the medium or high risk lines before running."
        : "중간 이상 위험으로 표시된 줄은 실행 전에 원문과 경로를 확인");
    }

    if (!checks.length) {
      checks.push(english
        ? "Check paths and options before running the script."
        : "실행 전에 경로와 옵션이 의도한 값인지 확인");
    }

    const unique = [];
    const seen = {};
    checks.forEach(function(check) {
      const key = check.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      unique.push(check);
    });

    return unique.slice(0, 5);
  }

  function structurePowerShellSummaryV334A14T(source, result) {
    if (!result || result.language !== "powershell") return result;
    if (!Array.isArray(result.steps) || result.steps.length < 2) return result;

    const english = isEnglishV334A14T(result);
    const flow = uniqueFlowV334A14T(result.steps, english);
    const checks = buildChecksV334A14T(source, result, english);

    const lines = [];

    lines.push(buildTaskLineV334A14T(source, result.steps, english));
    lines.push(english ? "Flow:" : "실행 흐름:");

    flow.forEach(function(title, index) {
      lines.push((index + 1) + ". " + title);
    });

    lines.push(english ? "Before running:" : "실행 전 확인:");

    checks.forEach(function(check) {
      lines.push("- " + check);
    });

    result.summary = lines.join("\n");
    result.summaryStructuredV334A14T = true;

    return result;
  }

  const wrappedAnalyze = function(source, requestedLanguage) {
    const result = originalAnalyze.apply(this, arguments);
    return structurePowerShellSummaryV334A14T(source, result);
  };

  wrappedAnalyze.__v334A14TWrapped = true;
  api.analyze = wrappedAnalyze;
  api.__v334A14TStructurePowerShellSummary = structurePowerShellSummaryV334A14T;
})();
`;

  rules = rules.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_structured_powershell_summary_wrapper", count: 1 });
} else {
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_structured_powershell_summary_wrapper", count: 0 });
}

if (!code.includes("V334A14T_SUMMARY_LINE_BREAKS")) {
  const before = "escapeHtml(result.summary)";
  const after = "escapeHtml(result.summary).replace(/\\r?\\n/g, '<br>') /* V334A14T_SUMMARY_LINE_BREAKS */";

  if (!code.includes(before)) {
    throw new Error("Could not find Code Explainer summary escape render target");
  }

  code = code.replace(before, after);
  changes.push({ target: "src/pwa/code_explainer.js", change: "render_summary_newlines_as_br", count: 1 });
} else {
  changes.push({ target: "src/pwa/code_explainer.js", change: "render_summary_newlines_as_br", count: 0 });
}

app = app.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14t");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14t");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14t");

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14T_STRUCTURED_CODE_SUMMARY",
  version: "20260623_v334_a14t",
  purpose: "Make Code Explainer PowerShell summary readable by splitting it into task, flow, and before-running checks.",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14T Structured Code Summary");
md.push("");
md.push("Purpose: improve Code Explainer summary readability without changing the detailed step cards.");
md.push("");
md.push("## Behavior");
md.push("");
md.push("- PowerShell summaries are now structured as task, flow, and before-running checks.");
md.push("- Summary line breaks are rendered as visible line breaks in the existing Code Summary box.");
md.push("- Python auto-detect and Command summary fixes from A14S are preserved.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | change | count |");
md.push("|---|---|---:|");

for (const c of changes) {
  md.push("| " + c.target + " | " + c.change + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14T_STRUCTURED_CODE_SUMMARY");
console.log("version=20260623_v334_a14t");
console.log("report=docs\\quality\\v334_a14t_structured_code_summary.md");
changes.forEach((c) => console.log(c.change + "=" + c.count));
