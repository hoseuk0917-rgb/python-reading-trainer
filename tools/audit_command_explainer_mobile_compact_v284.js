const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v284_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_mobile_compact_audit_v284.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
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
      name: "V284 marker",
      ok: command.includes("COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"),
      detail: "mobile compact audit marker"
    },
    {
      name: "V284 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V284_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V283 compact marker kept",
      ok: command.includes("COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"),
      detail: "compact details lineage"
    },
    {
      name: "summary touch target",
      ok: command.includes("min-height: 42px") && command.includes("display: flex") && command.includes("align-items: center"),
      detail: "mobile summary tap area"
    },
    {
      name: "summary wrapping",
      ok: command.includes("overflow-wrap: anywhere") && command.includes("line-height: 1.45"),
      detail: "long summary wrapping"
    },
    {
      name: "keyboard focus style",
      ok: command.includes("summary:focus-visible") && command.includes("outline-offset"),
      detail: "keyboard focus visible"
    },
    {
      name: "mobile media query",
      ok: command.includes("@media (max-width: 640px)") && command.includes("font-size: 0.94rem"),
      detail: "mobile width rule"
    },
    {
      name: "note body readability",
      ok: command.includes("line-height: 1.55") && command.includes(".beginner-note-v281") && command.includes(".git-flow-note-v282"),
      detail: "expanded note readability"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V284 명령어해석 접기 UI 모바일 사용성 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 접기 UI / 모바일 폭 / 키보드 포커스 / 수동 브라우저 점검 체크리스트",
    "",
    "## 1. 결론",
    "",
    "- V284는 V283의 접기 UI를 유지하면서 실제 브라우저와 모바일 폭에서 쓰기 편하도록 CSS를 보강하는 버전이다.",
    "- 접기 summary의 터치 영역을 키우고, 긴 문구가 좁은 화면에서 줄바꿈되도록 처리한다.",
    "- 키보드 사용자를 위해 `summary:focus-visible` 표시를 추가한다.",
    "- 자동 검증은 정적 구조 감사이며, 실제 클릭 동작은 아래 수동 체크리스트로 확인한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 수동 브라우저 점검 체크리스트",
    "",
    "| 항목 | 기대 결과 |",
    "|---|---|",
    "| 데스크톱에서 명령어해석 탭 열기 | 탭이 정상 표시된다 |",
    "| PowerShell 예제 불러오기 후 분석 | 명령 카드가 표시되고 추가 설명은 접혀 있다 |",
    "| `Git: 업로드 / 초보자 메모` 클릭 | Git 흐름과 초보자 메모가 펼쳐진다 |",
    "| 다시 클릭 | 추가 설명이 접힌다 |",
    "| Bash/Shell 예제 분석 | PowerShell과 동일하게 접기 UI가 적용된다 |",
    "| 브라우저 폭을 640px 이하로 줄이기 | summary 문구가 화면 밖으로 튀지 않고 줄바꿈된다 |",
    "| Tab 키로 접기 summary 이동 | 초록색 포커스 outline이 보인다 |",
    "| 모바일 또는 개발자도구 모바일 모드 | 접기 summary 터치 영역이 너무 작지 않다 |",
    "",
    "## 4. 다음 단계",
    "",
    "- V285에서는 실제 명령어해석 결과에 `다음에 무엇을 눌러야 하는지` 안내를 더 넣을지 검토한다.",
    "- 예: 분석 후 `git status → git diff → git add → git commit → git push`를 단계형 안내로 따로 보여주기.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
