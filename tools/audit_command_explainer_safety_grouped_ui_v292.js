const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v292_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_safety_grouped_ui_audit_v292.md");

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
  'git clean -fd',
  'git reset --hard HEAD~1'
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

function enhance(result) {
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(result);
  return global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`).join("\n");
}

function groupTitles(groups) {
  return groups.map(group => group.title).join(" / ");
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
  const psGroups = global.CommandExplainer.getSafetyGroupsV292(psChecklist);
  const bashGroups = global.CommandExplainer.getSafetyGroupsV292(bashChecklist);
  const psHtml = global.CommandExplainer.renderSafetyChecklistV290(psResult);
  const bashHtml = global.CommandExplainer.renderSafetyChecklistV290(bashResult);

  const psTitles = groupTitles(psGroups);
  const bashTitles = groupTitles(bashGroups);

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V292 marker", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"), detail: "grouped UI marker" },
    { name: "V292 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V292_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "V291 marker kept", ok: command.includes("COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"), detail: "danger precision lineage" },
    { name: "visible version V292", ok: index.includes('commandExplainerVersion" class="badge">V292') && command.includes('version.textContent = "V292";'), detail: "visible version" },
    { name: "group export", ok: typeof global.CommandExplainer.getSafetyGroupsV292 === "function", detail: "getSafetyGroupsV292" },
    { name: "PowerShell groups", ok: psTitles.includes("공통 확인") && psTitles.includes("삭제 계열") && psTitles.includes("Git 복구 계열"), detail: psTitles },
    { name: "Bash groups", ok: bashTitles.includes("공통 확인") && bashTitles.includes("삭제 계열") && bashTitles.includes("Git 복구 계열") && bashTitles.includes("권한 계열"), detail: bashTitles },
    { name: "PowerShell grouped HTML", ok: psHtml.includes("command-safety-checklist-grouped-v292") && psHtml.includes("공통 확인") && psHtml.includes("삭제 계열") && psHtml.includes("Git 복구 계열"), detail: "PowerShell grouped HTML" },
    { name: "Bash grouped HTML", ok: bashHtml.includes("권한 계열") && bashHtml.includes("Bash/Shell") && bashHtml.includes("개 그룹"), detail: "Bash grouped HTML" },
    { name: "copy source keeps full checklist", ok: psHtml.includes("command-safety-copy-source-v292") && psHtml.includes("전체 체크리스트 복사"), detail: "hidden full copy source" },
    { name: "group CSS", ok: command.includes("command-safety-groups-v292") && command.includes("command-safety-group-code-v292"), detail: "group css" },
    { name: "mobile group CSS", ok: command.includes(".command-safety-groups-v292") && command.includes("gap: 8px"), detail: "mobile group css" },
    { name: "old V290 render export kept", ok: typeof global.CommandExplainer.renderSafetyChecklistV290 === "function", detail: "renderSafetyChecklistV290 still exported" },
    { name: "V291 precision still present", ok: psChecklist.commandText.includes("git clean -ndx") && bashChecklist.commandText.includes("sudo -l"), detail: "V291 precision commands remain" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V292 안전 체크리스트 그룹 UI 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 안전 체크리스트 그룹 UI / 복사 유지 / V291 정밀 체크 유지 감사",
    "",
    "## 1. 결론",
    "",
    "- V292는 V291의 정밀 안전 체크리스트를 UI에서 그룹별로 나눠 보여주는 버전이다.",
    "- 그룹은 `공통 확인`, `삭제 계열`, `Git 복구 계열`, `권한 계열`이다.",
    "- 사용자는 그룹별 코드블록을 읽고, 복사 버튼으로 전체 체크리스트를 한 번에 복사할 수 있다.",
    "- V291의 Remove-Item, rm, git clean, git reset --hard, sudo 정밀 확인 명령은 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 그룹",
    "",
    psGroups.map(group => `### ${group.title}\n\n${group.description}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 4. Bash 그룹",
    "",
    bashGroups.map(group => `### ${group.title}\n\n${group.description}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 5. 다음 단계",
    "",
    "- V293에서는 각 그룹에 `왜 먼저 확인해야 하는지`를 한 줄 설명으로 추가할지 검토한다.",
    "- 또는 위험 명령 예제 프리셋에서 그룹 UI가 잘 보이도록 샘플 설명 문구를 보강할 수 있다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
