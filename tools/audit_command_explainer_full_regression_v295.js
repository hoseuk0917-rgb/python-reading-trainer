const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v295_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_full_regression_audit_v295.md");

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
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function groupTitles(groups) {
  return groups.map(group => group.title).join(" / ");
}

function commandText(checklist) {
  return checklist && checklist.commandText ? checklist.commandText : "";
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psRaw = global.CommandExplainer.analyzePowerShellV277(POWERSHELL_DANGER_SAMPLE);
  const bashRaw = global.CommandExplainer.analyzeBashV278(BASH_DANGER_SAMPLE);
  const psResult = enhance(psRaw);
  const bashResult = enhance(bashRaw);

  const psChecklist = global.CommandExplainer.buildSafetyChecklistV290(psResult);
  const bashChecklist = global.CommandExplainer.buildSafetyChecklistV290(bashResult);
  const psGroups = global.CommandExplainer.getSafetyGroupsV292(psChecklist);
  const bashGroups = global.CommandExplainer.getSafetyGroupsV292(bashChecklist);
  const psSafetyHtml = global.CommandExplainer.renderSafetyChecklistV290(psResult);
  const bashSafetyHtml = global.CommandExplainer.renderSafetyChecklistV290(bashResult);

  const dangerSample = global.CommandExplainer.getSampleV288("danger_delete_flow", "powershell");
  const gitSample = global.CommandExplainer.getSampleV288("git_save_flow", "powershell");
  const bashAutoSample = global.CommandExplainer.getSampleV288("auto_by_shell", "bash");

  const dangerSampleGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(dangerSample);
  const gitSampleGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(gitSample);
  const bashSampleGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(bashAutoSample);

  const dangerSampleHtml = global.CommandExplainer.renderSampleDescriptionV289(dangerSample);
  const gitSampleHtml = global.CommandExplainer.renderSampleDescriptionV289(gitSample);
  const bashSampleHtml = global.CommandExplainer.renderSampleDescriptionV289(bashAutoSample);

  const commonMeta = global.CommandExplainer.getSafetyGroupMetaV293("common");
  const deleteMeta = global.CommandExplainer.getSafetyGroupMetaV293("delete");
  const gitMeta = global.CommandExplainer.getSafetyGroupMetaV293("git_recovery");
  const permissionMeta = global.CommandExplainer.getSafetyGroupMetaV293("permission");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V295 marker", ok: command.includes("COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1"), detail: "full regression marker" },
    { name: "V295 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V295_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "visible version V295", ok: index.includes('commandExplainerVersion" class="badge">V295') && command.includes('version.textContent = "V295";'), detail: "visible version" },

    { name: "V288 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"), detail: "sample preset lineage" },
    { name: "V289 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1"), detail: "sample description lineage" },
    { name: "V290 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"), detail: "safety checklist lineage" },
    { name: "V291 marker kept", ok: command.includes("COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"), detail: "danger precision lineage" },
    { name: "V292 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"), detail: "grouped UI lineage" },
    { name: "V293 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"), detail: "group reason lineage" },
    { name: "V294 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"), detail: "sample safety hint lineage" },

    { name: "PowerShell analyzer", ok: psRaw.steps && psRaw.steps.length >= 4, detail: "steps=" + (psRaw.steps || []).length },
    { name: "Bash analyzer", ok: bashRaw.steps && bashRaw.steps.length >= 5, detail: "steps=" + (bashRaw.steps || []).length },
    { name: "beginner/git wording enhancers", ok: Array.isArray(psResult.steps) && Array.isArray(bashResult.steps), detail: "enhanced results available" },

    { name: "V290 safety checklist PowerShell", ok: commandText(psChecklist).includes("Get-Location") && commandText(psChecklist).includes("git status --short"), detail: commandText(psChecklist).split("\n").slice(0, 4).join(" / ") },
    { name: "V290 safety checklist Bash", ok: commandText(bashChecklist).includes("pwd") && commandText(bashChecklist).includes("git status --short"), detail: commandText(bashChecklist).split("\n").slice(0, 4).join(" / ") },
    { name: "V291 PowerShell precision", ok: commandText(psChecklist).includes("git clean -ndx") && commandText(psChecklist).includes("$backupBranch"), detail: "git clean/reset backup precision" },
    { name: "V291 Bash precision", ok: commandText(bashChecklist).includes("sudo -l") && commandText(bashChecklist).includes("backup_branch"), detail: "sudo/reset backup precision" },

    { name: "V292 PowerShell groups", ok: groupTitles(psGroups).includes("공통 확인") && groupTitles(psGroups).includes("삭제 계열") && groupTitles(psGroups).includes("Git 복구 계열"), detail: groupTitles(psGroups) },
    { name: "V292 Bash groups", ok: groupTitles(bashGroups).includes("공통 확인") && groupTitles(bashGroups).includes("삭제 계열") && groupTitles(bashGroups).includes("Git 복구 계열") && groupTitles(bashGroups).includes("권한 계열"), detail: groupTitles(bashGroups) },
    { name: "V292 grouped HTML", ok: psSafetyHtml.includes("command-safety-checklist-grouped-v292") && bashSafetyHtml.includes("command-safety-checklist-grouped-v292"), detail: "grouped checklist HTML" },
    { name: "copy button/source", ok: psSafetyHtml.includes("전체 체크리스트 복사") && psSafetyHtml.includes("command-safety-copy-source-v292"), detail: "copy button/source preserved" },
    { name: "mobile/group CSS", ok: command.includes(".command-safety-groups-v292") && command.includes("gap: 8px") && command.includes(".command-safety-group-code-v292"), detail: "mobile grouped css" },

    { name: "V293 group reasons meta", ok: commonMeta.reason && deleteMeta.reason && gitMeta.reason && permissionMeta.reason, detail: "all group reasons exist" },
    { name: "V293 reason HTML", ok: psSafetyHtml.includes("왜 먼저?") && bashSafetyHtml.includes("command-safety-group-reason-v293"), detail: "reason HTML" },

    { name: "V294 dangerous sample hint", ok: dangerSampleHtml.includes("이 예제에서 뜨는 안전 체크 그룹") && groupTitles(dangerSampleGroups).includes("삭제 계열"), detail: groupTitles(dangerSampleGroups) },
    { name: "V294 bash sample hint", ok: bashSampleHtml.includes("권한 계열") && groupTitles(bashSampleGroups).includes("권한 계열"), detail: groupTitles(bashSampleGroups) },
    { name: "V294 safe sample no hint", ok: gitSampleGroups.length === 0 && !gitSampleHtml.includes("이 예제에서 뜨는 안전 체크 그룹"), detail: "safe sample groups=" + gitSampleGroups.length },

    { name: "sample/catalog exports", ok: typeof global.CommandExplainer.getSampleV288 === "function" && typeof global.CommandExplainer.renderSampleDescriptionV289 === "function", detail: "V288/V289 exports" },
    { name: "safety exports", ok: typeof global.CommandExplainer.buildSafetyChecklistV290 === "function" && typeof global.CommandExplainer.getSafetyGroupsV292 === "function", detail: "V290/V292 exports" },
    { name: "V293/V294 exports", ok: typeof global.CommandExplainer.getSafetyGroupMetaV293 === "function" && typeof global.CommandExplainer.buildSampleSafetyGroupsV294 === "function", detail: "reason/sample safety exports" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V295 명령어해석 전체 회귀 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_FULL_REGRESSION_V295_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 범위: V288 예제 프리셋, V289 예제 설명, V290 안전 체크리스트, V291 정밀 체크, V292 그룹 UI, V293 이유 설명, V294 예제 안전 그룹 안내",
    "",
    "## 1. 결론",
    "",
    "- V295는 명령어해석 메뉴의 안전/예제 관련 기능을 한 번에 검증하는 전체 회귀 감사 버전이다.",
    "- PowerShell/Bash 분석, 위험 명령 체크리스트, 그룹 UI, 복사 버튼, 모바일 CSS, 예제 설명 안전 그룹 안내를 함께 확인한다.",
    "- 새 UI 기능을 추가하지 않고 현재 안정 상태를 감사 리포트와 검증 스크립트로 고정한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 안전 체크리스트 그룹",
    "",
    psGroups.map(group => `### ${group.title}\n\n- 설명: ${group.description}\n- 왜 먼저?: ${group.reason || ""}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 4. Bash 안전 체크리스트 그룹",
    "",
    bashGroups.map(group => `### ${group.title}\n\n- 설명: ${group.description}\n- 왜 먼저?: ${group.reason || ""}\n\n\`\`\`text\n${group.commands.join("\n")}\n\`\`\``).join("\n\n"),
    "",
    "## 5. 예제 안전 그룹 요약",
    "",
    "| sample | safety groups |",
    "|---|---|",
    `| danger_delete_flow / PowerShell | ${groupTitles(dangerSampleGroups) || "안전 그룹 없음"} |`,
    `| auto_by_shell / Bash | ${groupTitles(bashSampleGroups) || "안전 그룹 없음"} |`,
    `| git_save_flow / PowerShell | ${groupTitles(gitSampleGroups) || "안전 그룹 없음"} |`,
    "",
    "## 6. 다음 단계",
    "",
    "- V296에서는 기능 추가보다 실제 화면 수동 점검 체크리스트를 추가하는 것이 좋다.",
    "- 수동 점검 항목: 모바일 폭, 예제 전환, 복사 버튼, 위험 명령 그룹 표시, 안전한 예제의 안내 미표시.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_FULL_REGRESSION_V295_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
