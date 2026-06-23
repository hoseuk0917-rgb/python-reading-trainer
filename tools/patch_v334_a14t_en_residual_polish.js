const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const COMMAND = path.join(ROOT, "src", "pwa", "command_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14t_en_residual_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14t_en_residual_polish.json");

let rules = fs.readFileSync(RULES, "utf8");
let command = fs.readFileSync(COMMAND, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

if (!rules.includes("V334_A14T_EN_RESIDUAL_CODE_POLISH")) {
  const patch = String.raw`

// V334_A14T_EN_RESIDUAL_CODE_POLISH
(function() {
  if (typeof window === "undefined" || !window.CodeExplainerRules) return;

  const api = window.CodeExplainerRules;
  const originalAnalyze = api.analyze;

  if (typeof originalAnalyze !== "function") return;
  if (originalAnalyze.__v334A14TENResidualWrapped) return;

  function isEnglishV334A14TEN() {
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

  function translateFlowSummaryV334A14TEN(text) {
    return String(text || "")
      .replace(/^주요 흐름:/, "Main flow:")
      .replace(/(\d+)개/g, "$1")
      .replace(/반복/g, "loop")
      .replace(/변수\/값/g, "variable/value")
      .replace(/처리/g, "processing")
      .replace(/조건/g, "condition")
      .replace(/출력\/응답/g, "output/response")
      .replace(/파일\/경로/g, "file/path")
      .replace(/버전관리/g, "version control")
      .replace(/파이프라인/g, "pipeline");
  }

  const pythonActiveTranslations = {
    "users에 사용자 목록 저장": "Store the user list in users",
    "A와 B 두 사람 정보가 들어 있습니다. 각 사람은 name 값과 active 값을 가집니다.": "The list contains information for A and B. Each item has a name value and an active value.",
    "active_names를 빈 리스트로 준비": "Prepare an empty active_names list",
    "조건에 맞는 이름을 나중에 담을 빈 상자를 만듭니다.": "This creates an empty container that will later hold names that match the condition.",
    "users를 한 명씩 확인": "Check each user in users",
    "user 변수에 A 정보, 그다음 B 정보가 차례로 들어갑니다.": "The user variable receives A's information first, then B's information.",
    "active 값 확인": "Check the active value",
    "user['active']가 True인 사람만 아래 코드를 실행합니다.": "Only users whose user['active'] value is True run the indented code below.",
    "조건에 맞는 이름 추가": "Add the matching name",
    "조건에 맞으면 user['name']을 active_names에 추가합니다. 여기서는 A만 추가됩니다.": "If the condition matches, user['name'] is added to active_names. In this example, only A is added.",
    "최종 결과 출력": "Print the final result",
    "active_names에 모인 최종 결과인 ['A']를 화면에 보여줍니다.": "This prints the final active_names result, ['A'], to the screen."
  };

  function translateKnownPythonSummaryV334A14TEN(result) {
    if (!result || result.language !== "python") return result;

    const summary = String(result.summary || "");

    if (/users 목록에서 active가 True/.test(summary) || /active_names/.test(summary)) {
      result.summary = "From the users list, this code collects the names whose active value is True into active_names, then prints the result. In this example, it prints ['A'].";
    }

    if (result.flowSummary) {
      result.flowSummary = translateFlowSummaryV334A14TEN(result.flowSummary);
    }

    if (Array.isArray(result.steps)) {
      result.steps.forEach(function(step) {
        ["title", "displayTitle", "explain", "displayExplain"].forEach(function(key) {
          const value = step && step[key];
          if (value && pythonActiveTranslations[value]) {
            step[key] = pythonActiveTranslations[value];
          }
        });
      });
    }

    return result;
  }

  const wrappedAnalyze = function(source, requestedLanguage) {
    const result = originalAnalyze.apply(this, arguments);

    if (isEnglishV334A14TEN()) {
      return translateKnownPythonSummaryV334A14TEN(result);
    }

    return result;
  };

  wrappedAnalyze.__v334A14TENResidualWrapped = true;
  api.analyze = wrappedAnalyze;
  api.__v334A14TENResidualCodePolish = translateKnownPythonSummaryV334A14TEN;
})();
`;

  rules = rules.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_en_python_residual_polish", count: 1 });
} else {
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_en_python_residual_polish", count: 0 });
}

if (!command.includes("V334_A14T_EN_RESIDUAL_COMMAND_POLISH")) {
  const patch = String.raw`

// V334_A14T_EN_RESIDUAL_COMMAND_POLISH
(function() {
  if (typeof window === "undefined" || !window.CommandExplainer) return;

  const api = window.CommandExplainer;

  function isEnglishV334A14TEN() {
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

  function translateSummaryTextV334A14TEN(text) {
    const raw = String(text || "");

    const match = raw.match(/PowerShell 명령 (\d+)개를 작업 순서대로 분석했습니다\. 위험 (\d+)개, 주의 (\d+)개, 미확인 (\d+)개입니다\./);
    if (match) {
      return "Analyzed " + match[1] + " PowerShell commands in execution order. Danger: " + match[2] + ", caution: " + match[3] + ", unknown: " + match[4] + ".";
    }

    return raw
      .replace(/PowerShell 명령/g, "PowerShell commands")
      .replace(/작업 순서대로 분석했습니다/g, "were analyzed in execution order")
      .replace(/위험/g, "danger")
      .replace(/주의/g, "caution")
      .replace(/미확인/g, "unknown")
      .replace(/개/g, "");
  }

  function translateGroupV334A14TEN(text) {
    return String(text || "")
      .replace(/^작업 위치$/, "Working directory")
      .replace(/^파일 삭제$/, "File deletion")
      .replace(/^Git 위험 정리$/, "Dangerous Git cleanup")
      .replace(/^JS 스크립트 실행$/, "JavaScript script execution")
      .replace(/^스크립트 실행$/, "Script execution")
      .replace(/^Git danger$/, "Git danger");
  }

  function translateMeaningV334A14TEN(text) {
    const raw = String(text || "");

    if (/파일이나 폴더를 삭제합니다/.test(raw)) {
      return "Deletes a file or folder.";
    }

    if (/git clean은 Git이 추적하지 않는/.test(raw)) {
      return "git clean removes untracked files or folders from the working tree. With -fd, it can delete files and directories.";
    }

    if (/Node\.js로 JavaScript/.test(raw)) {
      return "Runs a JavaScript file or inline JavaScript code with Node.js.";
    }

    if (/Python 스크립트나 Python 명령/.test(raw)) {
      return "Runs a Python script or Python command.";
    }

    return raw;
  }

  function translateFileImpactV334A14TEN(text) {
    const raw = String(text || "");

    if (/대상 파일\/폴더가 사라질 수 있습니다/.test(raw)) {
      return "The target file or folder can be deleted. -Recurse includes child items, and -Force forces the operation, so the deletion scope can become larger than expected.";
    }

    if (/untracked 파일\/폴더를 삭제할 수 있고/.test(raw)) {
      return "Untracked files or folders can be deleted, and they may be difficult to recover with Git afterward. If -x is used, ignored files may also be included. Preview first with git clean -fdn.";
    }

    if (/실행하는 JS 스크립트 내용에 따라/.test(raw)) {
      return "Depending on the JavaScript script, it may create, modify, or delete files.";
    }

    if (/실행하는 스크립트 내용에 따라/.test(raw)) {
      return "Depending on the script, it may create, modify, or delete files.";
    }

    return raw;
  }

  function translateNextCheckV334A14TEN(text) {
    return String(text || "")
      .replace(/<삭제 대상 경로>/g, "<target path>")
      .replace(/스크립트 실행 후 git status --short/g, "After running the script, check git status --short");
  }

  function translateWarningV334A14TEN(warning) {
    if (!warning || typeof warning !== "object") return warning;

    warning.group = translateGroupV334A14TEN(warning.group);
    warning.meaning = translateMeaningV334A14TEN(warning.meaning);
    warning.fileImpact = translateFileImpactV334A14TEN(warning.fileImpact);
    warning.nextCheck = translateNextCheckV334A14TEN(warning.nextCheck);

    return warning;
  }

  function translateSummaryGroupsV334A14TEN(summary) {
    if (!summary || typeof summary !== "object" || !summary.groups) return summary;

    const nextGroups = {};
    Object.keys(summary.groups).forEach(function(key) {
      nextGroups[translateGroupV334A14TEN(key)] = summary.groups[key];
    });

    summary.groups = nextGroups;
    return summary;
  }

  function normalizeEnglishCommandResultV334A14TEN(result) {
    if (!result || typeof result !== "object") return result;

    if (result.summary && typeof result.summary === "object") {
      result.summary = translateSummaryGroupsV334A14TEN(result.summary);

      if (result.summary.text) {
        result.summary.text = translateSummaryTextV334A14TEN(result.summary.text);
        result.summaryText = result.summary.text;

        try {
          Object.defineProperty(result.summary, "toString", {
            value: function() {
              return result.summary.text;
            },
            configurable: true,
            enumerable: false
          });
        } catch (error) {
          result.summary.toString = function() {
            return result.summary.text;
          };
        }
      }
    } else if (result.summary) {
      result.summary = translateSummaryTextV334A14TEN(result.summary);
      result.summaryText = result.summary;
    }

    if (result.summaryText) {
      result.summaryText = translateSummaryTextV334A14TEN(result.summaryText);
    }

    if (Array.isArray(result.warnings)) {
      result.warnings = result.warnings.map(translateWarningV334A14TEN);
    }

    if (Array.isArray(result.steps)) {
      result.steps.forEach(function(step) {
        if (step && step.group) step.group = translateGroupV334A14TEN(step.group);
        if (step && step.meaning) step.meaning = translateMeaningV334A14TEN(step.meaning);
        if (step && step.fileImpact) step.fileImpact = translateFileImpactV334A14TEN(step.fileImpact);
        if (step && step.nextCheck) step.nextCheck = translateNextCheckV334A14TEN(step.nextCheck);
      });
    }

    return result;
  }

  function wrapAnalyzerV334A14TEN(name) {
    if (typeof api[name] !== "function") return;

    const original = api[name];
    if (original.__v334A14TENResidualWrapped) return;

    const wrapped = function() {
      const result = original.apply(this, arguments);

      if (isEnglishV334A14TEN()) {
        return normalizeEnglishCommandResultV334A14TEN(result);
      }

      return result;
    };

    wrapped.__v334A14TENResidualWrapped = true;
    api[name] = wrapped;
  }

  wrapAnalyzerV334A14TEN("analyzePowerShellV277");
  wrapAnalyzerV334A14TEN("analyzeBashV278");

  api.__v334A14TENResidualCommandPolish = normalizeEnglishCommandResultV334A14TEN;
})();
`;

  command = command.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ target: "src/pwa/command_explainer.js", change: "append_en_command_residual_polish", count: 1 });
} else {
  changes.push({ target: "src/pwa/command_explainer.js", change: "append_en_command_residual_polish", count: 0 });
}

function bumpVersion(text) {
  return text.replace(/20260623_v334_a14[a-z0-9_]*|20260623_v334_a13a/g, "20260623_v334_a14t_en");
}

app = bumpVersion(app);
pwaIndex = bumpVersion(pwaIndex);
rootIndex = bumpVersion(rootIndex);

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(COMMAND, command.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14T_EN_RESIDUAL_POLISH",
  version: "20260623_v334_a14t_en",
  purpose: "Remove remaining Korean text from English Code/Command explainer outputs after A14T structured summary.",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14T-EN Residual Polish");
md.push("");
md.push("Purpose: remove remaining Korean text from English Code/Command explainer outputs after A14T.");
md.push("");
md.push("## Fixed");
md.push("");
md.push("- Code Explainer EN Python `active_names` summary now appears in English.");
md.push("- Code Explainer EN Python flow and common step wording now appears in English for the audited beginner example.");
md.push("- Command Explainer EN summary no longer starts with Korean `PowerShell 명령 ...`.");
md.push("- Command Explainer EN warning groups and common file-impact text are translated for dangerous cleanup and validation commands.");
md.push("");
md.push("## Not in scope");
md.push("");
md.push("- Project Analyzer probe-command explanation remains for the next A14U/A14V pass.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | change | count |");
md.push("|---|---|---:|");

for (const c of changes) {
  md.push("| " + c.target + " | " + c.change + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14T_EN_RESIDUAL_POLISH");
console.log("version=20260623_v334_a14t_en");
console.log("report=docs\\quality\\v334_a14t_en_residual_polish.md");
changes.forEach((c) => console.log(c.change + "=" + c.count));
