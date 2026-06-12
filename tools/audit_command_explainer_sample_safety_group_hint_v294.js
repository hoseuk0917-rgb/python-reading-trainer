const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v294_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_sample_safety_group_hint_audit_v294.md");

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
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
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

  const dangerSample = global.CommandExplainer.getSampleV288("danger_delete_flow", "powershell");
  const gitSample = global.CommandExplainer.getSampleV288("git_save_flow", "powershell");
  const bashAutoSample = global.CommandExplainer.getSampleV288("auto_by_shell", "bash");

  const dangerGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(dangerSample);
  const gitGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(gitSample);
  const bashGroups = global.CommandExplainer.buildSampleSafetyGroupsV294(bashAutoSample);

  const dangerHtml = global.CommandExplainer.renderSampleDescriptionV289(dangerSample);
  const gitHtml = global.CommandExplainer.renderSampleDescriptionV289(gitSample);
  const bashHtml = global.CommandExplainer.renderSampleDescriptionV289(bashAutoSample);

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V294 marker", ok: command.includes("COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"), detail: "sample safety group hint marker" },
    { name: "V294 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V294_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "V293 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"), detail: "group reason lineage" },
    { name: "visible version V294", ok: index.includes('commandExplainerVersion" class="badge">V294') && command.includes('version.textContent = "V294";'), detail: "visible version" },
    { name: "build export", ok: typeof global.CommandExplainer.buildSampleSafetyGroupsV294 === "function", detail: "buildSampleSafetyGroupsV294" },
    { name: "render export", ok: typeof global.CommandExplainer.renderSampleSafetyGroupsV294 === "function", detail: "renderSampleSafetyGroupsV294" },
    { name: "danger sample groups", ok: groupTitles(dangerGroups).includes("공통 확인") && groupTitles(dangerGroups).includes("삭제 계열"), detail: groupTitles(dangerGroups) },
    { name: "bash auto groups", ok: groupTitles(bashGroups).includes("권한 계열") && groupTitles(bashGroups).includes("삭제 계열"), detail: groupTitles(bashGroups) },
    { name: "safe git sample no hint", ok: gitGroups.length === 0 && !gitHtml.includes("이 예제에서 뜨는 안전 체크 그룹"), detail: "safe sample groups=" + gitGroups.length },
    { name: "danger sample hint html", ok: dangerHtml.includes("이 예제에서 뜨는 안전 체크 그룹") && dangerHtml.includes("command-sample-safety-groups-v294"), detail: "danger hint html" },
    { name: "bash sample hint html", ok: bashHtml.includes("권한 계열") && bashHtml.includes("예제를 불러오면 분석 결과 위쪽"), detail: "bash hint html" },
    { name: "sample hint css", ok: command.includes(".command-sample-safety-groups-v294") && command.includes(".command-sample-safety-badge-v294"), detail: "sample hint css" },
    { name: "V292/V293 preserved", ok: command.includes("command-safety-checklist-grouped-v292") && command.includes("command-safety-group-reason-v293"), detail: "group UI and reasons preserved" },
    { name: "V291 precision preserved", ok: command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"), detail: "precision commands preserved" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V294 예제 설명 안전 체크 그룹 안내 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 예제 설명 안전 체크 그룹 안내 / V291~V293 유지 감사",
    "",
    "## 1. 결론",
    "",
    "- V294는 예제 설명 영역에 `이 예제에서 뜨는 안전 체크 그룹` 안내를 추가한 버전이다.",
    "- 위험 예제는 공통 확인, 삭제 계열, Git 복구 계열, 권한 계열 같은 그룹 배지를 미리 보여준다.",
    "- 안전한 Git 저장 예제에는 불필요한 안전 그룹 안내를 표시하지 않는다.",
    "- V291 정밀 체크, V292 그룹 UI, V293 왜 먼저 설명은 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 예제별 안전 그룹",
    "",
    "### 위험 삭제 명령",
    "",
    "```text",
    groupTitles(dangerGroups),
    "```",
    "",
    "### 현재 셸 기본 Bash 예제",
    "",
    "```text",
    groupTitles(bashGroups),
    "```",
    "",
    "### Git 저장 흐름",
    "",
    "```text",
    groupTitles(gitGroups) || "안전 그룹 없음",
    "```",
    "",
    "## 4. 다음 단계",
    "",
    "- V295에서는 위험 예제 설명에 `먼저 복사할 안전 체크리스트` 바로가기 또는 강조 문구를 추가할지 검토한다.",
    "- 또는 위험 예제 프리셋을 PowerShell/Bash 각각 별도 추가할지 검토한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
