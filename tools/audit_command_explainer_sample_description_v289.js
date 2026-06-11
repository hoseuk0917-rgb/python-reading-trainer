const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v289_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_sample_description_audit_v289.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
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

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), {
    filename: "command_explainer.js"
  });
}

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const gitSample = global.CommandExplainer.getSampleV288("git_save_flow");
  const dangerSample = global.CommandExplainer.getSampleV288("danger_delete_flow");
  const bashSample = global.CommandExplainer.getSampleV288("bash_git_save_flow");

  const gitHtml = global.CommandExplainer.renderSampleDescriptionV289(gitSample);
  const dangerHtml = global.CommandExplainer.renderSampleDescriptionV289(dangerSample);
  const bashHtml = global.CommandExplainer.renderSampleDescriptionV289(bashSample);

  const checks = [
    {
      name: "app version",
      ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'),
      detail: EXPECTED_VERSION
    },
    {
      name: "root index version",
      ok: rootIndex.includes(EXPECTED_VERSION),
      detail: EXPECTED_VERSION
    },
    {
      name: "command script version",
      ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION),
      detail: "script cache busting"
    },
    {
      name: "V289 marker",
      ok: command.includes("COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"),
      detail: "sample description marker"
    },
    {
      name: "V289 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V289_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V288 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"),
      detail: "sample preset lineage"
    },
    {
      name: "index description box",
      ok: index.includes("commandSampleDescription") && index.includes("예제를 선택하면 어떤 흐름을 연습"),
      detail: "description placeholder"
    },
    {
      name: "visible version V289",
      ok: index.includes('commandExplainerVersion" class="badge">V289') && command.includes('version.textContent = "V289";'),
      detail: "visible version"
    },
    {
      name: "render description export",
      ok: typeof global.CommandExplainer.renderSampleDescriptionV289 === "function",
      detail: "renderSampleDescriptionV289"
    },
    {
      name: "update description export",
      ok: typeof global.CommandExplainer.updateSampleDescriptionV289 === "function",
      detail: "updateSampleDescriptionV289"
    },
    {
      name: "git description html",
      ok: gitHtml.includes("Git 저장 흐름") && gitHtml.includes("PowerShell") && gitHtml.includes("변경 확인부터 GitHub 업로드"),
      detail: "git sample description"
    },
    {
      name: "danger description html",
      ok: dangerHtml.includes("위험 삭제 명령") && dangerHtml.includes("삭제/강제 정리"),
      detail: "danger sample description"
    },
    {
      name: "bash description html",
      ok: bashHtml.includes("Bash Git 흐름") && bashHtml.includes("Bash/Shell"),
      detail: "bash sample description"
    },
    {
      name: "sync updates description",
      ok: command.includes("updateCommandSampleDescriptionV289(sampleSelect.value);"),
      detail: "sample onchange update"
    },
    {
      name: "load updates description",
      ok: command.includes("updateCommandSampleDescriptionV289(selectedId);") && command.includes("loadCommandSampleV288"),
      detail: "load sample update"
    },
    {
      name: "init updates description",
      ok: command.includes("updateCommandSampleDescriptionV289();") && command.includes("initCommandExplainerV277"),
      detail: "initial description"
    },
    {
      name: "clear keeps description",
      ok: command.includes("clearCommandInputV277") && command.includes("updateCommandSampleDescriptionV289();"),
      detail: "clear refresh"
    },
    {
      name: "description css",
      ok: command.includes("command-sample-description-v289") && command.includes("command-sample-shell-badge-v289"),
      detail: "description css"
    },
    {
      name: "mobile css",
      ok: command.includes(".command-sample-description-v289") && command.includes("padding: 10px"),
      detail: "mobile description css"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V289 명령어해석 예제 설명 문구 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 예제 선택 설명 / 셸 안내 / 학습 흐름 안내 감사",
    "",
    "## 1. 결론",
    "",
    "- V289는 V288 예제 프리셋에 설명 문구 표시를 추가한 버전이다.",
    "- 예제를 선택하면 입력창 위에 예제 이름, 셸 종류, 연습 목적이 표시된다.",
    "- 예제 변경, 예제 불러오기, 입력 지우기 후에도 설명이 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 설명 HTML 샘플",
    "",
    "### Git 저장 흐름",
    "```html",
    gitHtml,
    "```",
    "",
    "### 위험 삭제 명령",
    "```html",
    dangerHtml,
    "```",
    "",
    "### Bash Git 흐름",
    "```html",
    bashHtml,
    "```",
    "",
    "## 4. 수동 브라우저 점검",
    "",
    "| 항목 | 기대 결과 |",
    "|---|---|",
    "| Git 저장 흐름 선택 | 설명 박스에 Git 저장 흐름 / PowerShell / 업로드 목적이 표시된다 |",
    "| 위험 삭제 명령 선택 | 설명 박스에 삭제/강제 정리 전 확인 목적이 표시된다 |",
    "| Bash Git 흐름 선택 | 셸이 Bash/Shell로 바뀌고 설명도 Bash/Shell로 표시된다 |",
    "| 선택 예제 불러오기 클릭 | 입력창이 채워지고 설명 박스가 유지된다 |",
    "| 입력 지우기 클릭 | 분석 결과는 초기화되고 설명 박스는 현재 선택 예제를 설명한다 |",
    "",
    "## 5. 다음 단계",
    "",
    "- V290에서는 명령어해석 결과에 `복사 가능한 안전 실행 체크리스트`를 추가할지 검토한다.",
    "- 예: 위험 명령이 있으면 실행 전 확인 명령만 따로 복사할 수 있게 한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
