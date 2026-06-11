const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v288_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_sample_presets_audit_v288.md");

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

  const catalog = global.CommandExplainer.sampleCatalogV288;
  const gitSample = global.CommandExplainer.getSampleV288("git_save_flow");
  const dangerSample = global.CommandExplainer.getSampleV288("danger_delete_flow");
  const venvSample = global.CommandExplainer.getSampleV288("venv_run_flow");
  const bashGitSample = global.CommandExplainer.getSampleV288("bash_git_save_flow");

  const gitFlow = enhance(global.CommandExplainer.analyzePowerShellV277(gitSample.source));
  const dangerFlow = enhance(global.CommandExplainer.analyzePowerShellV277(dangerSample.source));
  const bashFlow = enhance(global.CommandExplainer.analyzeBashV278(bashGitSample.source));

  const gitGuide = global.CommandExplainer.buildActionGuideV285(gitFlow);
  const dangerGuide = global.CommandExplainer.buildDangerGuideV286(dangerFlow);
  const bashGuide = global.CommandExplainer.buildActionGuideV285(bashFlow);

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
      name: "V288 marker",
      ok: command.includes("COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"),
      detail: "sample presets marker"
    },
    {
      name: "V288 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V288_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V287 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"),
      detail: "danger collapse lineage"
    },
    {
      name: "index sample selector",
      ok: index.includes("commandSampleSelect") && index.includes("Git 저장 흐름") && index.includes("위험 삭제 명령"),
      detail: "sample select options"
    },
    {
      name: "version badge V288",
      ok: index.includes('commandExplainerVersion" class="badge">V288') && command.includes('version.textContent = "V288";'),
      detail: "visible version"
    },
    {
      name: "catalog export",
      ok: catalog && Object.keys(catalog).length >= 6,
      detail: String(catalog ? Object.keys(catalog).length : 0)
    },
    {
      name: "get sample export",
      ok: typeof global.CommandExplainer.getSampleV288 === "function",
      detail: "getSampleV288"
    },
    {
      name: "load sample export",
      ok: typeof global.CommandExplainer.loadSampleV288 === "function",
      detail: "loadSampleV288"
    },
    {
      name: "git sample shell",
      ok: gitSample.shell === "powershell" && gitSample.source.includes("git status --short") && gitSample.source.includes("git push origin main --tags"),
      detail: "PowerShell Git sample"
    },
    {
      name: "danger sample shell",
      ok: dangerSample.shell === "powershell" && dangerSample.source.includes("Remove-Item") && dangerSample.source.includes("git clean -fd"),
      detail: "danger sample"
    },
    {
      name: "venv sample",
      ok: venvSample.source.includes(".venv") && venvSample.source.includes("pip install -r requirements.txt"),
      detail: "venv sample"
    },
    {
      name: "bash sample shell",
      ok: bashGitSample.shell === "bash" && bashGitSample.source.includes("cd ~/python-reading-trainer"),
      detail: "bash git sample"
    },
    {
      name: "git sample action guide",
      ok: gitGuide.flowText === "확인 → 비교 → 준비 → 저장 → 업로드",
      detail: gitGuide.flowText
    },
    {
      name: "danger sample guide",
      ok: dangerGuide.items.length >= 2,
      detail: String(dangerGuide.items.length)
    },
    {
      name: "bash sample action guide",
      ok: bashGuide.flowText === "확인 → 비교 → 준비 → 저장 → 업로드",
      detail: bashGuide.flowText
    },
    {
      name: "selector binding",
      ok: command.includes("sampleSelect.onchange = syncCommandSampleShellV288") && command.includes("loadCommandSampleV288"),
      detail: "selector event binding"
    },
    {
      name: "sample CSS",
      ok: command.includes("command-sample-select-v288") && command.includes("min-width: 100%"),
      detail: "sample select responsive css"
    }
  ];

  const pass = checks.every(check => check.ok);

  const catalogRows = Object.keys(catalog || {}).map(id => {
    const item = catalog[id];
    return `| ${id} | ${item.label} | ${item.shell} | ${item.description} |`;
  }).join("\n");

  const report = [
    "# V288 명령어해석 예제 프리셋 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 예제 버튼 / 샘플 입력 / 셸 자동 전환 / 학습 흐름 감사",
    "",
    "## 1. 결론",
    "",
    "- V288은 명령어해석 모드의 예제 입력을 실제 사용 흐름 기준으로 재정리한 버전이다.",
    "- 예제는 `Git 저장 흐름`, `위험 삭제 명령`, `가상환경 실행`, `검증/커밋 루틴`, `Bash Git 흐름`, `Bash 가상환경 실행`으로 나뉜다.",
    "- 선택한 예제에 맞춰 PowerShell/Bash 셸 선택도 자동으로 맞춘다.",
    "- V285 Git 다음 실행 흐름, V287 위험 명령 접기 UI는 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 예제 카탈로그",
    "",
    "| id | label | shell | description |",
    "|---|---|---|---|",
    catalogRows,
    "",
    "## 4. 핵심 샘플 검증",
    "",
    "| 샘플 | 기대 결과 | 실제 |",
    "|---|---|---|",
    `| Git 저장 흐름 | 확인 → 비교 → 준비 → 저장 → 업로드 | ${gitGuide.flowText} |`,
    `| 위험 삭제 명령 | 위험 명령 2개 이상 감지 | ${dangerGuide.items.length}개 |`,
    `| Bash Git 흐름 | 확인 → 비교 → 준비 → 저장 → 업로드 | ${bashGuide.flowText} |`,
    "",
    "## 5. 다음 단계",
    "",
    "- V289에서는 명령어해석 모드의 예제별 설명 문구를 화면에 표시할지 검토한다.",
    "- 예: 예제를 선택하면 `이 예제는 Git 저장 흐름을 연습합니다` 같은 안내를 입력창 위에 보여준다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
