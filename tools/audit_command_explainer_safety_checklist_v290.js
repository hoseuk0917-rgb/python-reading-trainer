const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v290_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_safety_checklist_audit_v290.md");

const POWERSHELL_DANGER_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'git status --short',
  'Remove-Item ".tmp" -Recurse -Force',
  'git clean -fd',
  'git reset --hard HEAD~1'
].join("\n");

const BASH_DANGER_SAMPLE = [
  'cd ~/python-reading-trainer',
  'git status --short',
  'rm -rf .tmp',
  'sudo apt update',
  'git clean -fd'
].join("\n");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function bootCommandExplainer() {
  global.window = global;
  global.navigator = {
    clipboard: {
      writeText() {
        return Promise.resolve();
      }
    }
  };
  global.document = {
    readyState: "loading",
    body: { appendChild() {}, removeChild() {} },
    head: { appendChild() {} },
    addEventListener() {},
    execCommand() { return true; },
    createElement() {
      return {
        id: "",
        textContent: "",
        className: "",
        style: {},
        value: "",
        setAttribute() {},
        select() {},
        appendChild() {}
      };
    },
    getElementById() { return null; }
  };

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), {
    filename: "command_explainer.js"
  });
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`).join("\n");
}

function enhance(result) {
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(result);
  return global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psResult = enhance(global.CommandExplainer.analyzePowerShellV277(POWERSHELL_DANGER_SAMPLE));
  const bashResult = enhance(global.CommandExplainer.analyzeBashV278(BASH_DANGER_SAMPLE));

  const psChecklist = global.CommandExplainer.buildSafetyChecklistV290(psResult);
  const bashChecklist = global.CommandExplainer.buildSafetyChecklistV290(bashResult);
  const psHtml = global.CommandExplainer.renderSafetyChecklistV290(psResult);
  const bashHtml = global.CommandExplainer.renderSafetyChecklistV290(bashResult);

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V290 marker", ok: command.includes("COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"), detail: "safety checklist marker" },
    { name: "V290 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V290_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "V289 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"), detail: "sample description lineage" },
    { name: "visible version V290", ok: index.includes('commandExplainerVersion" class="badge">V290') && command.includes('version.textContent = "V290";'), detail: "visible version" },
    { name: "safety checklist exports", ok: typeof global.CommandExplainer.buildSafetyChecklistV290 === "function" && typeof global.CommandExplainer.renderSafetyChecklistV290 === "function", detail: "build/render safety checklist" },
    { name: "PowerShell checklist commands", ok: psChecklist.commandText.includes("Get-Location") && psChecklist.commandText.includes("Test-Path \".tmp\"") && psChecklist.commandText.includes("git clean -nd") && psChecklist.commandText.includes("git log --oneline -5"), detail: psChecklist.commandText.replace(/\n/g, " / ") },
    { name: "Bash checklist commands", ok: bashChecklist.commandText.includes("pwd") && bashChecklist.commandText.includes("ls -la") && bashChecklist.commandText.includes("whoami") && bashChecklist.commandText.includes("git clean -nd"), detail: bashChecklist.commandText.replace(/\n/g, " / ") },
    { name: "PowerShell HTML", ok: psHtml.includes("복사 가능한 안전 실행 체크리스트") && psHtml.includes("체크리스트 복사") && psHtml.includes("PowerShell"), detail: "PowerShell checklist html" },
    { name: "Bash HTML", ok: bashHtml.includes("복사 가능한 안전 실행 체크리스트") && bashHtml.includes("Bash/Shell"), detail: "Bash checklist html" },
    { name: "copy button binding", ok: command.includes("data-command-safety-copy-v290") && command.includes("bindCommandSafetyChecklistCopyV290(box);"), detail: "copy button" },
    { name: "render insertion order", ok: command.includes("dangerGuideHtmlV286 + safetyChecklistHtmlV290 + actionGuideHtmlV285"), detail: "danger -> safety -> action" },
    { name: "clipboard fallback", ok: command.includes("navigator.clipboard.writeText") && command.includes("fallbackCopyTextV290"), detail: "clipboard fallback" },
    { name: "safety CSS", ok: command.includes("command-safety-checklist-v290") && command.includes("command-safety-copy-btn-v290"), detail: "safety css" },
    { name: "mobile safety CSS", ok: command.includes(".command-safety-copy-btn-v290") && command.includes("width: 100%"), detail: "mobile copy button" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V290 명령어해석 안전 실행 체크리스트 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 위험 명령 / 안전 확인 명령 / 복사 버튼 / PowerShell-Bash 분기 감사",
    "",
    "## 1. 결론",
    "",
    "- V290은 위험 명령이 감지될 때 실행 전 확인 명령만 따로 모아주는 안전 실행 체크리스트를 추가한 버전이다.",
    "- 체크리스트에는 실제 위험 명령 자체가 아니라 `git status`, `git diff`, `git clean -nd`, `Test-Path`, `Get-ChildItem`, `ls -la` 같은 확인 명령이 표시된다.",
    "- 체크리스트에는 복사 버튼이 있으며, 복사가 실패해도 코드블록을 직접 복사할 수 있다.",
    "- V287 위험 명령 접기 UI, V289 예제 설명 문구는 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 안전 체크리스트",
    "",
    "```text",
    psChecklist.commandText,
    "```",
    "",
    "## 4. Bash 안전 체크리스트",
    "",
    "```text",
    bashChecklist.commandText,
    "```",
    "",
    "## 5. 다음 단계",
    "",
    "- V291에서는 안전 체크리스트를 위험 명령 종류별로 더 정밀화할지 검토한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
