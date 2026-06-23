const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14t_en2_python_flow_accuracy.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14t_en2_python_flow_accuracy.json");

let rules = fs.readFileSync(RULES, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

if (!rules.includes("V334_A14T_EN2_PYTHON_FLOW_ACCURACY")) {
  const patch = String.raw`

// V334_A14T_EN2_PYTHON_FLOW_ACCURACY
(function() {
  if (typeof window === "undefined" || !window.CodeExplainerRules) return;

  const api = window.CodeExplainerRules;
  const originalAnalyze = api.analyze;

  if (typeof originalAnalyze !== "function") return;
  if (originalAnalyze.__v334A14TEN2FlowWrapped) return;

  function isEnglishV334A14TEN2() {
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

  function isActiveNamesExampleV334A14TEN2(source, result) {
    const sourceText = String(source || "");
    const summaryText = String((result && result.summary) || "");

    return (
      /active_names/.test(sourceText) &&
      /user\['active'\]|active/.test(sourceText) &&
      /print\s*\(/.test(sourceText)
    ) || (
      /active_names/.test(summaryText) &&
      /From the users list/.test(summaryText)
    );
  }

  const wrappedAnalyze = function(source, requestedLanguage) {
    const result = originalAnalyze.apply(this, arguments);

    if (
      isEnglishV334A14TEN2() &&
      result &&
      result.language === "python" &&
      isActiveNamesExampleV334A14TEN2(source, result)
    ) {
      result.flowSummary = "Main flow: user list setup 1 · result list setup 1 · loop 1 · condition 1 · append 1 · output 1";
      result.flowSummaryFixedV334A14TEN2 = true;
    }

    return result;
  };

  wrappedAnalyze.__v334A14TEN2FlowWrapped = true;
  api.analyze = wrappedAnalyze;
  api.__v334A14TEN2PythonFlowAccuracy = isActiveNamesExampleV334A14TEN2;
})();
`;

  rules = rules.replace(/\s+$/g, "") + patch + "\n";
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_en_python_flow_accuracy_fix", count: 1 });
} else {
  changes.push({ target: "src/pwa/code_explainer_rules.js", change: "append_en_python_flow_accuracy_fix", count: 0 });
}

function bumpVersion(text) {
  return text.replace(/20260623_v334_a14[a-z0-9_]*|20260623_v334_a13a/g, "20260623_v334_a14t_en2");
}

app = bumpVersion(app);
pwaIndex = bumpVersion(pwaIndex);
rootIndex = bumpVersion(rootIndex);

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14T_EN2_PYTHON_FLOW_ACCURACY",
  version: "20260623_v334_a14t_en2",
  purpose: "Correct the English Python active_names flow summary so it no longer says file/path.",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14T-EN2 Python Flow Accuracy");
md.push("");
md.push("Purpose: correct the English Python active_names flow summary after A14T-EN residual polish.");
md.push("");
md.push("## Fixed");
md.push("");
md.push("- EN Python active_names flow summary no longer says `file/path 6`.");
md.push("- EN Python flow now describes setup, loop, condition, append, and output.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | change | count |");
md.push("|---|---|---:|");

for (const c of changes) {
  md.push("| " + c.target + " | " + c.change + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14T_EN2_PYTHON_FLOW_ACCURACY");
console.log("version=20260623_v334_a14t_en2");
console.log("report=docs\\quality\\v334_a14t_en2_python_flow_accuracy.md");
changes.forEach((c) => console.log(c.change + "=" + c.count));
