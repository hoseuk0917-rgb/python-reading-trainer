const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v277_a1";

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

function bootCommandExplainer() {
  global.window = global;
  global.document = {
    readyState: "loading",
    head: { appendChild() {} },
    addEventListener() {},
    createElement() {
      return {
        id: "",
        textContent: "",
        className: "",
        style: {},
        appendChild() {}
      };
    },
    getElementById() {
      return null;
    }
  };

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), { filename: "command_explainer.js" });
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  assertOk("ROOT_VERSION_V277", rootIndex.includes("20260611_v277_a1"));
  assertOk("APP_VERSION_V277", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_VERSION_V277", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_INCLUDED", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_TAB_ADDED", index.includes('data-view="command"') && index.includes("명령어해석"));
  assertOk("COMMAND_VIEW_ADDED", index.includes('id="commandView"') && index.includes("commandInput") && index.includes("commandSteps"));
  assertOk("APP_COMMAND_REFRESH_HOOK", app.includes('viewName === "command"') && app.includes("window.CommandExplainer.refresh"));
  assertOk("COMMAND_MARKER_V277", command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"));
  assertOk("COMMAND_VERSION_TEXT_V277", command.includes(EXPECTED_VERSION));
  assertOk("COMMAND_NO_BASH_IMPL", command.includes("Bash/Shell 해석은 V278에서 구현 예정"));

  bootCommandExplainer();

  assertOk("COMMAND_EXPORT", !!global.CommandExplainer);
  assertOk("COMMAND_ANALYZE_EXPORT", typeof global.CommandExplainer.analyzePowerShellV277 === "function");
  assertOk("COMMAND_CLASSIFY_EXPORT", typeof global.CommandExplainer.classifyPowerShellLineV277 === "function");
  assertOk("COMMAND_DETECT_EXPORT", typeof global.CommandExplainer.detectCommandLanguageV277 === "function");

  const sample = [
    'Set-Location "D:\\projects\\python-reading-trainer"',
    'if (Test-Path ".tmp") {',
    '  Remove-Item ".tmp" -Recurse -Force',
    '}',
    'New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null',
    'Get-Content "src\\pwa\\app.js" -Raw -Encoding UTF8',
    'python ".tmp\\script.py"',
    'git status --short',
    'git diff --check',
    'git add src\\pwa\\app.js',
    'git commit -m "Update app"',
    'git tag quality-test',
    'git push origin main --tags'
  ].join("\n");

  const result = global.CommandExplainer.analyzePowerShellV277(sample);

  assertOk("POWERSHELL_TOTAL_STEPS", result.steps.length >= 12, "steps=" + result.steps.length);
  assertOk("POWERSHELL_REMOVE_DANGER", result.steps.some(step => step.command === "Remove-Item" && step.risk === "danger"));
  assertOk("POWERSHELL_NEW_ITEM", result.steps.some(step => step.command === "New-Item"));
  assertOk("POWERSHELL_GET_CONTENT", result.steps.some(step => step.command === "Get-Content"));
  assertOk("POWERSHELL_PYTHON_CAUTION", result.steps.some(step => step.command === "python" && step.risk === "caution"));
  assertOk("POWERSHELL_GIT_STATUS_SAFE", result.steps.some(step => step.command === "git status" && step.risk === "safe"));
  assertOk("POWERSHELL_GIT_DIFF_SAFE", result.steps.some(step => step.command === "git diff" && step.risk === "safe"));
  assertOk("POWERSHELL_GIT_ADD_CAUTION", result.steps.some(step => step.command === "git add" && step.risk === "caution"));
  assertOk("POWERSHELL_GIT_COMMIT_CAUTION", result.steps.some(step => step.command === "git commit" && step.risk === "caution"));
  assertOk("POWERSHELL_GIT_TAG_CAUTION", result.steps.some(step => step.command === "git tag" && step.risk === "caution"));
  assertOk("POWERSHELL_GIT_PUSH_CAUTION", result.steps.some(step => step.command === "git push" && step.risk === "caution"));
  assertOk("POWERSHELL_WARNINGS", result.warnings.length >= 5);
  assertOk("POWERSHELL_NEXT_CHECKS", result.nextChecks.includes("git status --short") && result.nextChecks.some(item => item.includes("git --no-pager log")));
  assertOk("POWERSHELL_SUMMARY", result.summary.text.includes("PowerShell 명령"));

  const detected = global.CommandExplainer.detectCommandLanguageV277('Remove-Item ".tmp" -Recurse -Force');
  assertOk("DETECT_POWERSHELL", detected === "powershell");

  if (process.exitCode) {
    console.error("V277_COMMAND_EXPLAINER_POWERSHELL_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V277_COMMAND_EXPLAINER_POWERSHELL_VERIFY_OK");
}

main();
