const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v283_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_compact_extra_notes_audit_v283.md");

const SAMPLE = [
  'git status --short',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
  'git push origin main --tags'
].join("\n");

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

function findStep(result, command) {
  return result.steps.find(step => step.command === command);
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const raw = global.CommandExplainer.analyzePowerShellV277(SAMPLE);
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(raw);
  const flow = global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
  const pushStep = findStep(flow, "git push");
  const statusStep = findStep(flow, "git status");

  const pushHtml = global.CommandExplainer.renderExtraNotesV283(pushStep);
  const statusHtml = global.CommandExplainer.renderExtraNotesV283(statusStep);

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
      name: "V283 marker",
      ok: command.includes("COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"),
      detail: "compact extra notes marker"
    },
    {
      name: "V283 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V283_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V281 beginner marker kept",
      ok: command.includes("COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"),
      detail: "beginner note lineage"
    },
    {
      name: "V282 git flow marker kept",
      ok: command.includes("COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"),
      detail: "git flow lineage"
    },
    {
      name: "details renderer export",
      ok: typeof global.CommandExplainer.renderExtraNotesV283 === "function",
      detail: "renderExtraNotesV283"
    },
    {
      name: "push html uses details",
      ok: pushHtml.includes("<details") && pushHtml.includes("</details>"),
      detail: "git push compact note"
    },
    {
      name: "push html has summary",
      ok: pushHtml.includes("<summary>Git: 업로드 / 초보자 메모</summary>"),
      detail: "summary combines git flow + beginner note"
    },
    {
      name: "push html keeps beginner note",
      ok: pushHtml.includes("초보자 메모") && pushHtml.includes("원격 저장소"),
      detail: "beginner note still visible inside details"
    },
    {
      name: "push html keeps git flow note",
      ok: pushHtml.includes("Git 흐름") && pushHtml.includes("업로드"),
      detail: "git flow still visible inside details"
    },
    {
      name: "status html uses compact git-only summary",
      ok: statusHtml.includes("<summary>Git: 상태 확인</summary>"),
      detail: "git status has compact flow-only note"
    },
    {
      name: "inline always-open notes removed",
      ok: !command.includes("(step.beginnerNote ? '<div class=\"beginner-note-v281\"") && !command.includes("(step.gitFlowNoteV282 ? '<div class=\"git-flow-note-v282\""),
      detail: "main card no longer renders both always open"
    },
    {
      name: "compact css present",
      ok: command.includes("command-extra-note-v283") && command.includes("command-extra-note-body-v283"),
      detail: "compact details CSS"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V283 명령어해석 추가 설명 접기 UI 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 초보자 메모 / Git 흐름 메모 화면 길이 완화 감사",
    "",
    "## 1. 결론",
    "",
    "- V283은 V281 초보자 메모와 V282 Git 흐름 메모를 유지하면서 화면 복잡도를 줄이는 버전이다.",
    "- 각 명령 카드에서 추가 설명은 `<details>` 접기 영역으로 렌더링된다.",
    "- `git push`처럼 초보자 메모와 Git 흐름이 모두 있는 명령은 `Git: 업로드 / 초보자 메모` 요약으로 접힌다.",
    "- `git status`처럼 Git 흐름만 있는 명령은 `Git: 상태 확인` 요약으로 접힌다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. git push 접기 HTML 샘플",
    "",
    "```html",
    pushHtml,
    "```",
    "",
    "## 4. git status 접기 HTML 샘플",
    "",
    "```html",
    statusHtml,
    "```",
    "",
    "## 5. 다음 단계",
    "",
    "- V284에서는 실제 브라우저에서 접기 UI 클릭 동작과 모바일 폭에서의 가독성을 점검한다.",
    "- 필요하면 접기 요약 문구를 더 짧게 줄인다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
