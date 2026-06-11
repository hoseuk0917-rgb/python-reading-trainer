const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v278_a1";

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

  assertOk("ROOT_VERSION_V278", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V278", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_VERSION_V278", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V278", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_TAB_STILL_OK", index.includes('data-view="command"') && index.includes("명령어해석"));
  assertOk("BASH_OPTION_ENABLED", index.includes('<option value="bash">Bash/Shell</option>') && !index.includes('<option value="bash" disabled>'));
  assertOk("COMMAND_MARKER_V277_STILL_OK", command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"));
  assertOk("COMMAND_MARKER_V278", command.includes("COMMAND_EXPLAINER_BASH_V278_A1"));
  assertOk("COMMAND_VERSION_TEXT_V278", command.includes(EXPECTED_VERSION));
  assertOk("BASH_IMPL_PRESENT", command.includes("function analyzeBashV278") && command.includes("BASH_RULES_V278"));
  assertOk("BASH_PLACEHOLDER_REMOVED", !command.includes("Bash/Shell 해석은 V278에서 구현 예정"));

  bootCommandExplainer();

  assertOk("COMMAND_EXPORT", !!global.CommandExplainer);
  assertOk("POWERSHELL_ANALYZE_STILL_EXPORT", typeof global.CommandExplainer.analyzePowerShellV277 === "function");
  assertOk("BASH_ANALYZE_EXPORT", typeof global.CommandExplainer.analyzeBashV278 === "function");
  assertOk("BASH_CLASSIFY_EXPORT", typeof global.CommandExplainer.classifyBashLineV278 === "function");
  assertOk("BASH_SAMPLE_EXPORT", typeof global.CommandExplainer.sampleBashV278 === "string");

  const bashSample = [
    'cd ~/python-reading-trainer',
    'if [ -d ".tmp" ]; then',
    '  rm -rf ".tmp"',
    'fi',
    'mkdir -p .tmp',
    'cat src/pwa/app.js',
    'grep "APP_DATA_VERSION" src/pwa/app.js',
    'chmod +x tools/run.sh',
    'sudo apt update',
    'python3 .tmp/script.py',
    'git status --short',
    'git diff --check',
    'git add src/pwa/app.js',
    'git commit -m "Update app"',
    'git tag quality-test',
    'git push origin main --tags'
  ].join("\n");

  const bash = global.CommandExplainer.analyzeBashV278(bashSample);

  assertOk("BASH_TOTAL_STEPS", bash.steps.length >= 15, "steps=" + bash.steps.length);
  assertOk("BASH_RM_RF_DANGER", bash.steps.some(step => step.command === "rm -rf" && step.risk === "danger"));
  assertOk("BASH_MKDIR_SAFE", bash.steps.some(step => step.command === "mkdir" && step.risk === "safe"));
  assertOk("BASH_CAT_SAFE", bash.steps.some(step => step.command === "cat" && step.risk === "safe"));
  assertOk("BASH_GREP_SAFE", bash.steps.some(step => step.command === "grep" && step.risk === "safe"));
  assertOk("BASH_CHMOD_CAUTION", bash.steps.some(step => step.command === "chmod" && step.risk === "caution"));
  assertOk("BASH_SUDO_DANGER", bash.steps.some(step => step.command === "sudo" && step.risk === "danger"));
  assertOk("BASH_PYTHON3_CAUTION", bash.steps.some(step => step.command === "python3" && step.risk === "caution"));
  assertOk("BASH_GIT_STATUS_SAFE", bash.steps.some(step => step.command === "git status" && step.risk === "safe"));
  assertOk("BASH_GIT_DIFF_SAFE", bash.steps.some(step => step.command === "git diff" && step.risk === "safe"));
  assertOk("BASH_GIT_ADD_CAUTION", bash.steps.some(step => step.command === "git add" && step.risk === "caution"));
  assertOk("BASH_GIT_COMMIT_CAUTION", bash.steps.some(step => step.command === "git commit" && step.risk === "caution"));
  assertOk("BASH_GIT_TAG_CAUTION", bash.steps.some(step => step.command === "git tag" && step.risk === "caution"));
  assertOk("BASH_GIT_PUSH_CAUTION", bash.steps.some(step => step.command === "git push" && step.risk === "caution"));
  assertOk("BASH_WARNINGS", bash.warnings.length >= 7);
  assertOk("BASH_NEXT_CHECKS", bash.nextChecks.includes("git status --short") && bash.nextChecks.some(item => item.includes("ls -l")));
  assertOk("BASH_SUMMARY", bash.summary.text.includes("Bash/Shell 명령"));

  const psSample = [
    'Set-Location "D:\\projects\\python-reading-trainer"',
    'Remove-Item ".tmp" -Recurse -Force',
    'git status --short',
    'git push origin main --tags'
  ].join("\n");

  const ps = global.CommandExplainer.analyzePowerShellV277(psSample);

  assertOk("POWERSHELL_STILL_WORKS", ps.steps.some(step => step.command === "Remove-Item" && step.risk === "danger") && ps.steps.some(step => step.command === "git push" && step.risk === "caution"));
  assertOk("DETECT_BASH", global.CommandExplainer.detectCommandLanguageV277('rm -rf ".tmp"') === "bash");
  assertOk("DETECT_POWERSHELL", global.CommandExplainer.detectCommandLanguageV277('Remove-Item ".tmp" -Recurse -Force') === "powershell");

  if (process.exitCode) {
    console.error("V278_COMMAND_EXPLAINER_BASH_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V278_COMMAND_EXPLAINER_BASH_VERIFY_OK");
}

main();
