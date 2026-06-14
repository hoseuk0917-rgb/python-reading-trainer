const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v299_a1";
const REPORT_PATH = path.join(ROOT, "reports", "code_tools_capability_gap_audit_v299.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function has(text, needle) {
  return text.includes(needle);
}

function countNeedles(text, needles) {
  return needles.filter(needle => text.includes(needle)).length;
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function renderMatrix(rows) {
  return rows.map(row => `| ${row.menu} | ${row.current} | ${row.good} | ${row.limit} | ${row.judgement} |`).join("\n");
}

function renderList(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");
  const command = readText("src/pwa/command_explainer.js");
  const project = readText("src/pwa/project_analyzer.js");
  const style = readText("src/pwa/style.css");

  const languageNeedles = [
    "PowerShell",
    "Python",
    "JavaScript",
    "Cloudflare",
    "Workers",
    "Java",
    "package.json",
    "GitHub Actions",
    "Dockerfile",
    "requirements",
    "pyproject",
    "YAML",
    "Markdown",
    ".env"
  ];

  const pythonFunctionNeedles = [
    "def ",
    "async def",
    "function",
    "return",
    "for ",
    "if ",
    "class ",
    "call",
    "Mermaid",
    "graph TD"
  ];

  const commandNeedles = [
    "PowerShell",
    "Bash",
    "Remove-Item",
    "rm -rf",
    "git clean",
    "git reset",
    "sudo",
    "안전",
    "위험",
    "체크리스트"
  ];

  const projectNeedles = [
    "project",
    "files",
    "symbols",
    "function",
    "class",
    "ast.parse",
    "mermaid",
    "graph TD",
    "role",
    "bundle",
    "lesson"
  ];

  const mermaidNeedles = [
    "Mermaid",
    "mermaid",
    "graph TD",
    "flowchart",
    "sequenceDiagram"
  ];

  const menuNeedles = [
    "codeView",
    "commandView",
    "projectView",
    "코드해석",
    "명령어해석",
    "프로젝트분석"
  ];

  const languageEvidence = countNeedles(code, languageNeedles);
  const pythonEvidence = countNeedles(code, pythonFunctionNeedles);
  const commandEvidence = countNeedles(command, commandNeedles);
  const projectEvidence = countNeedles(project, projectNeedles);
  const mermaidEvidence = countNeedles(code + "\n" + project, mermaidNeedles);
  const menuEvidence = countNeedles(index, menuNeedles);

  const capabilityMatrix = [
    {
      menu: "코드해석",
      current: "붙여넣은 코드 한 덩어리 해석",
      good: "초보자용 단계 설명, Python 함수 흐름, JS/설정파일 대표 패턴, Mermaid 초안",
      limit: "완전 파서 아님. 복잡한 호출 그래프, 타입 추론, 예외 흐름, 다중 파일 의존성은 부족",
      judgement: "학습용 1차 해석기로 적합"
    },
    {
      menu: "명령어해석",
      current: "PowerShell/Bash 명령어 안전 해석",
      good: "삭제/초기화/권한 명령 위험 감지, 사전 확인 명령, 복사 가능한 안전 체크리스트",
      limit: "실제 실행 결과를 읽는 기능은 아님. 셸 문법 전체 파서는 아니며 복잡한 파이프라인 해석은 제한",
      judgement: "초보자 안전 가드로 적합"
    },
    {
      menu: "프로젝트분석",
      current: "로컬 프로젝트 구조/파일 역할 분석",
      good: "핵심 파일, 폴더 역할, 심볼 후보, 프로젝트 지도, 구조도 초안",
      limit: "정밀 의존성 그래프/실제 런타임 호출관계/데이터 흐름 분석은 아직 부족",
      judgement: "프로젝트 첫 진단용으로 적합"
    },
    {
      menu: "Mermaid",
      current: "코드 흐름도와 프로젝트 구조도 생성",
      good: "학습용 개요도, 함수 흐름 초안, 프로젝트 지도 초안",
      limit: "정밀 분기/예외/비동기/호출 그래프를 완전 반영하지 못함",
      judgement: "개요도 품질은 괜찮지만 정밀도 강화 필요"
    },
    {
      menu: "메뉴 구조",
      current: "코드해석 / 명령어해석 / 프로젝트분석 3개 독립 메뉴",
      good: "입력 방식과 목적이 분리되어 엔진 관리가 쉬움",
      limit: "사용자 입장에서는 코드 관련 메뉴가 3개라 헷갈릴 수 있음",
      judgement: "엔진은 유지, UI는 코드도구 상위 묶음 추천"
    }
  ];

  const gapItems = [
    "Python은 함수/조건/반복/반환 흐름을 어느 정도 읽지만 모든 함수 전체를 무제한 정밀 분석하지는 않는다.",
    "JavaScript는 함수/DOM/이벤트/대표 패턴 중심이며 TypeScript 타입, 복잡한 클래스 메서드, 고차함수 체인은 약하다.",
    "PowerShell/Bash는 안전 해석은 강하지만 셸 문법 전체 파서나 실제 실행 결과 분석기는 아니다.",
    "프로젝트분석은 파일 구조와 핵심 후보 추출은 좋지만 실제 import graph, call graph, data flow graph는 아직 약하다.",
    "Mermaid는 학습용 개요도 수준이며 정밀 호출 그래프나 예외 흐름도는 아직 부족하다.",
    "코드해석과 명령어해석은 PowerShell/Bash 영역이 일부 겹친다. 명령어 안전 분석은 명령어해석으로 몰아주는 편이 좋다.",
    "세 메뉴가 나란히 있어 초보자에게 목적 차이가 즉시 보이지 않는다."
  ];

  const recommendedRoadmap = [
    "V300: 코드도구 메뉴 구조 설계 문서화. 완전 통합이 아니라 상위 메뉴/하위 모드 구조로 정리.",
    "V301: 코드해석 지원 범위 표를 UI에 표시. 무엇을 잘 읽고 무엇은 못 읽는지 사용자에게 고지.",
    "V302: Python 함수 정밀도 강화. 함수 개수 제한/중첩/호출 후보/예외 처리 표시 개선.",
    "V303: JavaScript 구조 강화. DOM 이벤트, async/await, fetch, import/export, class method 추출 개선.",
    "V304: Mermaid 품질 강화. overview / function flow / call graph 초안 모드 분리.",
    "V305: 프로젝트분석 정밀도 강화. 파일 간 import/reference/call 후보를 별도 그래프로 분리."
  ];

  const menuRecommendation = [
    "지금 당장 엔진 통합은 하지 않는다.",
    "나중에 상단 메뉴는 `코드도구` 하나로 묶는다.",
    "`코드도구` 안에서 `코드 한 조각 해석`, `터미널 명령 해석`, `프로젝트 구조 분석` 3개 모드로 나눈다.",
    "기존 엔진 파일은 `code_explainer.js`, `command_explainer.js`, `project_analyzer.js`로 분리 유지한다.",
    "사용자 안내 문구에는 `코드를 붙여넣을 때`, `터미널 명령을 붙여넣을 때`, `프로젝트 폴더를 볼 때`로 구분한다."
  ];

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code explainer script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "project analyzer script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },

    { name: "three code menus present", ok: menuEvidence >= 6, detail: `menuEvidence=${menuEvidence}` },
    { name: "code language evidence", ok: languageEvidence >= 5, detail: `languageEvidence=${languageEvidence}` },
    { name: "python/function evidence", ok: pythonEvidence >= 5, detail: `pythonEvidence=${pythonEvidence}` },
    { name: "command safety evidence", ok: commandEvidence >= 6, detail: `commandEvidence=${commandEvidence}` },
    { name: "project analyzer evidence", ok: projectEvidence >= 6, detail: `projectEvidence=${projectEvidence}` },
    { name: "mermaid evidence", ok: mermaidEvidence >= 2, detail: `mermaidEvidence=${mermaidEvidence}` },
    { name: "V298 layout kept", ok: style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"), detail: "layout fix lineage kept" },
    { name: "capability matrix prepared", ok: capabilityMatrix.length === 5, detail: "5 sections" },
    { name: "gap list prepared", ok: gapItems.length >= 7, detail: `${gapItems.length} gaps` },
    { name: "roadmap prepared", ok: recommendedRoadmap.length >= 6, detail: `${recommendedRoadmap.length} steps` },
    { name: "menu recommendation prepared", ok: menuRecommendation.length >= 5, detail: `${menuRecommendation.length} recommendations` }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V299 코드도구 해석 역량/한계 정밀 감사 리포트",
    "",
    "AUDIT_CODE_TOOLS_CAPABILITY_GAP_V299_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 판정: 현재는 `학습용 정적 해석기 + 패턴 기반 구조 요약기` 수준이다.",
    "- 결론: 초보자 학습용으로는 충분히 의미가 있지만, 모든 언어/모든 함수/정밀 호출 그래프를 완전 해석하는 수준은 아니다.",
    "",
    "## 1. 핵심 결론",
    "",
    "- 코드해석은 붙여넣은 코드 한 덩어리를 초보자가 읽기 좋게 풀어주는 데 초점이 맞다.",
    "- 명령어해석은 PowerShell/Bash 명령어를 실제 실행하지 않고 위험도와 안전 확인 순서를 알려주는 데 강점이 있다.",
    "- 프로젝트분석은 폴더 구조와 핵심 파일을 빠르게 파악하는 1차 스캔 도구에 가깝다.",
    "- Mermaid는 보기 좋은 학습용 개요도를 만들 수 있지만, 아직 정밀 호출 그래프 품질은 아니다.",
    "- 메뉴는 완전 통합보다 `코드도구` 상위 메뉴 아래 3개 모드로 묶는 방식이 가장 안전하다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 역량 매트릭스",
    "",
    "| 메뉴/영역 | 현재 역할 | 잘하는 것 | 부족한 것 | 판단 |",
    "|---|---|---|---|---|",
    renderMatrix(capabilityMatrix),
    "",
    "## 4. 부족한 점",
    "",
    renderList(gapItems),
    "",
    "## 5. 메뉴 통합 판단",
    "",
    renderList(menuRecommendation),
    "",
    "## 6. 권장 메뉴 구조",
    "",
    "```text",
    "코드도구",
    "├─ 코드 한 조각 해석",
    "│  └─ Python / JavaScript / PowerShell / 설정파일 등 붙여넣기 해석",
    "├─ 터미널 명령 해석",
    "│  └─ PowerShell / Bash / Git / 삭제 / 권한 명령 안전 확인",
    "└─ 프로젝트 구조 분석",
    "   └─ 프로젝트 루트 / 파일 구조 / 핵심 파일 / Mermaid 지도",
    "```",
    "",
    "## 7. 강화 로드맵",
    "",
    renderList(recommendedRoadmap),
    "",
    "## 8. 다음 버전 제안",
    "",
    "- V300: 코드도구 상위 메뉴 설계 감사 또는 UI 문구 설계",
    "- V301: 코드해석 지원 범위/한계 안내 박스 추가",
    "- V302: Python 함수 정밀 해석 강화",
    "- V303: JavaScript 이벤트/비동기 구조 강화",
    "- V304: Mermaid 품질 모드 분리",
    "- V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CODE_TOOLS_CAPABILITY_GAP_V299_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("LANGUAGE_EVIDENCE", languageEvidence);
  console.log("PYTHON_FUNCTION_EVIDENCE", pythonEvidence);
  console.log("COMMAND_EVIDENCE", commandEvidence);
  console.log("PROJECT_EVIDENCE", projectEvidence);
  console.log("MERMAID_EVIDENCE", mermaidEvidence);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
