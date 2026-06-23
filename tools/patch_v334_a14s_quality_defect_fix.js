const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const COMMAND = path.join(ROOT, "src", "pwa", "command_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14s_quality_defect_fix.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14s_quality_defect_fix.json");

let rules = fs.readFileSync(RULES, "utf8");
let command = fs.readFileSync(COMMAND, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

if (!rules.includes("V334_A14S_PYTHON_AUTO_DETECT_GUARD")) {
  const patch = `

// V334_A14S_PYTHON_AUTO_DETECT_GUARD
(function() {
  if (typeof window === "undefined" || !window.CodeExplainerRules) return;

  const api = window.CodeExplainerRules;
  const originalAnalyze = api.analyze;
  const originalDetectLanguage = api.detectLanguage;

  function looksLikePythonV334A14S(source) {
    const text = String(source || "");
    const lines = text.split(/\r?\n/).map(function(line) {
      return line.replace(/\s+$/g, "");
    });
    const nonEmpty = lines.filter(function(line) {
      return line.trim();
    });

    if (nonEmpty.length < 2) return false;

    const joined = nonEmpty.join("\n");

    const powerShellSignals = [
      /\bSet-Location\b/i,
      /\bGet-ChildItem\b/i,
      /\bGet-Date\b/i,
      /\bNew-Item\b/i,
      /\bCopy-Item\b/i,
      /\bRemove-Item\b/i,
      /\bCompress-Archive\b/i,
      /\bInvoke-\w+\b/i,
      /\$[A-Za-z_][\w-]*\s*=/
    ];

    const strongPowerShell = powerShellSignals.some(function(re) {
      return re.test(joined);
    });

    if (strongPowerShell) return false;

    let score = 0;

    if (/^\s*[A-Za-z_][\w]*\s*=\s*\[/m.test(joined)) score += 2;
    if (/^\s*[A-Za-z_][\w]*\s*=\s*\{/m.test(joined)) score += 2;
    if (/^\s*for\s+[A-Za-z_][\w]*\s+in\s+[^:]+:\s*$/m.test(joined)) score += 3;
    if (/^\s*if\s+.+:\s*$/m.test(joined)) score += 2;
    if (/\bprint\s*\(/.test(joined)) score += 2;
    if (/\.append\s*\(/.test(joined)) score += 2;
    if (/\bTrue\b|\bFalse\b|\bNone\b/.test(joined)) score += 1;
    if (/['"][A-Za-z_][\w-]*['"]\s*:/.test(joined)) score += 2;
    if (/^\s{4,}\S/m.test(joined)) score += 1;

    return score >= 5;
  }

  api.detectLanguage = function(source) {
    if (looksLikePythonV334A14S(source)) return "python";
    return originalDetectLanguage.apply(this, arguments);
  };

  api.analyze = function(source, requestedLanguage) {
    const requested = String(requestedLanguage || "auto").toLowerCase();
    if ((requested === "auto" || requested === "") && looksLikePythonV334A14S(source)) {
      return originalAnalyze.call(this, source, "python");
    }
    return originalAnalyze.apply(this, arguments);
  };

  api.__v334A14SPythonAutoDetectGuard = looksLikePythonV334A14S;
})();
`;

  rules = rules.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ name: "append_python_auto_detect_guard", target: "code_explainer_rules.js", count: 1 });
} else {
  changes.push({ name: "append_python_auto_detect_guard", target: "code_explainer_rules.js", count: 0 });
}

if (!command.includes("V334_A14S_COMMAND_SUMMARY_TEXT_NORMALIZER")) {
  const patch = `

// V334_A14S_COMMAND_SUMMARY_TEXT_NORMALIZER
(function() {
  if (typeof window === "undefined" || !window.CommandExplainer) return;

  const api = window.CommandExplainer;

  function normalizeSummaryObjectV334A14S(result) {
    if (!result || typeof result !== "object") return result;

    const summary = result.summary;
    if (summary && typeof summary === "object") {
      const text = String(summary.text || "").trim();

      if (text) {
        result.summaryText = text;

        try {
          Object.defineProperty(summary, "toString", {
            value: function() {
              return text;
            },
            configurable: true,
            enumerable: false
          });
        } catch (error) {
          summary.toString = function() {
            return text;
          };
        }
      }
    }

    return result;
  }

  function wrapAnalyzerV334A14S(name) {
    if (typeof api[name] !== "function") return;

    const original = api[name];
    if (original.__v334A14SWrapped) return;

    const wrapped = function() {
      return normalizeSummaryObjectV334A14S(original.apply(this, arguments));
    };

    wrapped.__v334A14SWrapped = true;
    api[name] = wrapped;
  }

  wrapAnalyzerV334A14S("analyzePowerShellV277");
  wrapAnalyzerV334A14S("analyzeBashV278");

  api.__v334A14SNormalizeSummaryObject = normalizeSummaryObjectV334A14S;
})();
`;

  command = command.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ name: "append_command_summary_text_normalizer", target: "command_explainer.js", count: 1 });
} else {
  changes.push({ name: "append_command_summary_text_normalizer", target: "command_explainer.js", count: 0 });
}

app = app.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14s");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14s");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14s");

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(COMMAND, command.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14S_QUALITY_DEFECT_FIX",
  version: "20260623_v334_a14s",
  fixes: [
    "Python-like snippets are forced to Python in auto mode before PowerShell line heuristics can misclassify them.",
    "Command summary objects now stringify to summary.text and expose result.summaryText."
  ],
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14S Quality Defect Fix");
md.push("");
md.push("Purpose: fix two answer-quality defects found by direct analyzer inspection.");
md.push("");
md.push("## Fixed");
md.push("");
md.push("- Python-like beginner snippets were detected as PowerShell in auto mode.");
md.push("- Command analyzer summary objects stringified as [object Object] in direct/report contexts.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | count |");
md.push("|---|---:|");
for (const c of changes) {
  md.push("| " + c.name + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14S_QUALITY_DEFECT_FIX");
console.log("version=20260623_v334_a14s");
console.log("report=docs\\quality\\v334_a14s_quality_defect_fix.md");
changes.forEach((c) => console.log(c.name + "=" + c.count));
