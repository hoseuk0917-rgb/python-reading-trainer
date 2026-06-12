const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v293_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_safety_group_reason_audit_v293.md");

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

function allGroupsHaveReason(groups) {
  return groups.every(group => typeof group.reason === "string" && group.reason.length >= 15);
}

function reasonText(groups) {
  return groups.map(group => `${group.title}: ${group.reason}`).join(" / ");
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

  const commonMeta = global.CommandExplainer.getSafetyGroupMetaV293("common");
  const deleteMeta = global.CommandExplainer.getSafetyGroupMetaV293("delete");
  const gitMeta = global.CommandExplainer.getSafetyGroupMetaV293("git_recovery");
  const permissionMeta = global.CommandExplainer.getSafetyGroupMetaV293("permission");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V293 marker", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"), detail: "group reason marker" },
    { name: "V293 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V293_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "V292 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"), detail: "group UI lineage" },
    { name: "visible version V293", ok: index.includes('commandExplainerVersion" class="badge">V293') && command.includes('version.textContent = "V293";'), detail: "visible version" },
    { name: "meta export", ok: typeof global.CommandExplainer.getSafetyGroupMetaV293 === "function", detail: "getSafetyGroupMetaV293" },
    { name: "common reason", ok: commonMeta.reason.includes("현재 위치") && commonMeta.reason.includes("브랜치"), detail: commonMeta.reason },
    { name: "delete reason", ok: deleteMeta.reason.includes("삭제 명령") && deleteMeta.reason.includes("대상 경로"), detail: deleteMeta.reason },
    { name: "git recovery reason", ok: gitMeta.reason.includes("돌아갈 지점") && gitMeta.reason.includes("복구"), detail: gitMeta.reason },
    { name: "permission reason", ok: permissionMeta.reason.includes("sudo") && permissionMeta.reason.includes("권한"), detail: permissionMeta.reason },
    { name: "PowerShell group reasons", ok: allGroupsHaveReason(psGroups), detail: reasonText(psGroups) },
    { name: "Bash group reasons", ok: allGroupsHaveReason(bashGroups), detail: reasonText(bashGroups) },
    { name: "PowerShell HTML reason", ok: psHtml.includes("왜 먼저?") && psHtml.includes("command-safety-group-reason-v293"), detail: "PowerShell reason html" },
    { name: "Bash HTML reason", ok: bashHtml.includes("왜 먼저?") && bashHtml.includes("권한 명령"), detail: "Bash reason html" },
    { name: "V292/V291 still present", ok: psChecklist.commandText.includes("git clean -ndx") && bashChecklist.commandText.includes("sudo -l") && bashHtml.includes("전체 체크리스트 복사"), detail: "precision/group/copy preserved" },
    { name: "reason CSS", ok: command.includes(".command-safety-group-reason-v293") && command.includes("font-style: normal"), detail: "reason css" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V293 안전 체크리스트 그룹 이유 설명 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 그룹별 왜 먼저 설명 / V292 그룹 UI 유지 / V291 정밀 체크 유지 감사",
    "",
    "## 1. 결론",
    "",
    "- V293은 V292 안전 체크리스트 그룹마다 `왜 먼저?` 설명을 추가한 버전이다.",
    "- 공통 확인은 현재 위치와 브랜치 확인 이유를 설명한다.",
    "- 삭제 계열은 삭제 대상 경로와 범위 확인 이유를 설명한다.",
    "- Git 복구 계열은 백업 브랜치와 복구 지점 확인 이유를 설명한다.",
    "- 권한 계열은 sudo/권한 명령 실행 전 사용자와 권한 범위 확인 이유를 설명한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 그룹 이유",
    "",
    psGroups.map(group => `### ${group.title}\n\n- 설명: ${group.description}\n- 왜 먼저?: ${group.reason}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 4. Bash 그룹 이유",
    "",
    bashGroups.map(group => `### ${group.title}\n\n- 설명: ${group.description}\n- 왜 먼저?: ${group.reason}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 5. 다음 단계",
    "",
    "- V294에서는 위험 명령 예제 프리셋 설명에 그룹 UI 안내를 추가할지 검토한다.",
    "- 또는 체크리스트 그룹을 접기/펼치기 가능한 하위 details로 바꿀지 검토한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
