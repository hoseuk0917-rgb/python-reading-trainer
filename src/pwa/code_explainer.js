// === CODE EXPLAINER UI V170-A3 START ===
(function() {
  "use strict";

  const samples = {
    powershell: `Set-Location "D:\\projects\\python-reading-trainer"

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupRoot = "D:\\projects\\python-reading-trainer_backup_$stamp"

New-Item -ItemType Directory -Force $backupRoot | Out-Null
Copy-Item .\\data_i18n "$backupRoot\\data_i18n" -Recurse -Force
Compress-Archive -Path "$backupRoot\\*" -DestinationPath "$backupRoot.zip" -Force

git status --short`,

    python: `import json
from pathlib import Path

path = Path("cards.json")

with open(path, encoding="utf-8") as f:
    cards = json.load(f)

for card in cards:
    if card.get("level") == 1:
        print(card["title"])`,

    javascript: `const button = document.getElementById("saveBtn");
const memoBox = document.getElementById("memo");

button.addEventListener("click", function() {
  const value = memoBox.value;
  localStorage.setItem("memo", value);
  alert("저장했습니다.");
});`,

    workers: `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/items") {
      const rows = await env.DB.prepare("SELECT * FROM items").all();
      return Response.json(rows.results);
    }

    return new Response("Not found", { status: 404 });
  }
};`,

    java: `public class Main {
  public static void main(String[] args) {
    int total = 0;

    for (int i = 1; i <= 3; i++) {
      total = total + i;
    }

    System.out.println(total);
  }
}`,

    package_json: `{
  "name": "python-reading-trainer",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "test": "node --check src/pwa/app.js"
  },
  "dependencies": {
    "@vitejs/plugin-legacy": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}`,

    github_actions: `name: Build and test
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`,

    dockerfile: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["python", "app.py"]`,

    env_file: `API_BASE_URL=https://api.example.com
DEBUG=false
DATABASE_URL=sqlite:///app.db
OPENAI_API_KEY=replace_me
SESSION_SECRET=change_me`,

    requirements_txt: `fastapi==0.115.0
uvicorn[standard]>=0.30.0
pandas>=2.2.0
python-dotenv==1.0.1
-r requirements-dev.txt`,

    pyproject_toml: `[project]
name = "python-reading-trainer"
version = "1.0.0"
dependencies = [
  "fastapi>=0.115.0",
  "pandas>=2.2.0"
]

[tool.pytest.ini_options]
testpaths = ["tests"]`,

    yaml: `services:
  app:
    image: python:3.12
    ports:
      - "8000:8000"
    environment:
      DEBUG: "false"
    volumes:
      - .:/app`,

    markdown: `# Python Reading Trainer

파이썬 코드를 읽는 연습을 위한 학습 앱입니다.

## 설치

- Node.js를 설치합니다.
- 의존성을 설치합니다.
- 검증 명령을 실행합니다.

\`\`\`powershell
npm test
\`\`\`

자세한 내용은 [개발 문서](./docs/dev.md)를 참고하세요.`,

    gitignore: `node_modules/
.env
*.log
!important.log
dist/
__pycache__/`,

    ini_file: `[server]
host=127.0.0.1
port=8000
debug=false

[auth]
token=replace_me`,

    toml: `[tool.ruff]
line-length = 100
select = ["E", "F"]

[database]
enabled = true
port = 5432`
  };

  let lastMermaid = "";
  let lastReport = "";
  let lastAnalysis = null;
  let learningCards = [];
  let learningSideCards = [];

  function el(id) {
    return document.getElementById(id);
  }


  function updateLanguageHint() {
    const select = el("codeLangSelect");
    const hint = el("codeLangHint");
    if (!select || !hint) return;

    const value = select.value;
    const messages = {
      auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",
      powershell: "PowerShell은 로컬 작업, Git, 파일 복사, 백업, 압축 명령을 쉽게 풀어 설명합니다.",
      python: "Python은 변수, 조건문, 반복문, 함수, 파일/JSON/CSV/API 흐름을 중심으로 설명합니다.",
      javascript: "JavaScript는 웹페이지 동작, DOM, localStorage, fetch 흐름을 중심으로 설명합니다.",
      workers: "Workers는 request, env, DB/KV/R2/AI, Response 흐름을 중심으로 설명합니다.",
      java: "Java는 class, main, 변수 선언, if/for, method, 출력 흐름을 중심으로 설명합니다.",
      package_json: "package.json은 npm scripts, dependencies, devDependencies를 중심으로 설명합니다.",
      github_actions: "GitHub Actions YAML은 on, jobs, runs-on, steps, uses, run 흐름을 중심으로 설명합니다.",
      dockerfile: "Dockerfile은 이미지 선택, 작업 폴더, 복사, 설치, 실행 명령을 중심으로 설명합니다.",
      env_file: ".env는 환경변수와 비밀값 노출 위험을 중심으로 설명합니다.",
      requirements_txt: "requirements.txt는 Python 패키지와 버전 고정 방식을 중심으로 설명합니다.",
      pyproject_toml: "pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다.",
      yaml: "YAML은 들여쓰기 기반 설정 키, 목록, 서비스 설정을 중심으로 설명합니다.",
      markdown: "Markdown/README는 제목, 목록, 코드블록, 링크를 중심으로 설명합니다.",
      gitignore: ".gitignore는 Git에서 제외할 파일/폴더 패턴과 예외 규칙을 설명합니다.",
      ini_file: "INI 설정은 섹션과 key=value 설정을 중심으로 설명합니다.",
      toml: "TOML 설정은 테이블, 키-값, 목록 설정을 중심으로 설명합니다."
    };

    hint.textContent = messages[value] || messages.auto;
  }

  function languageLabel(language) {
    const map = {
      powershell: "PowerShell",
      python: "Python",
      javascript: "JavaScript",
      workers: "Cloudflare Workers",
      java: "Java",
      package_json: "package.json",
      github_actions: "GitHub Actions YAML",
      dockerfile: "Dockerfile",
      env_file: ".env",
      requirements_txt: "requirements.txt",
      pyproject_toml: "pyproject.toml",
      yaml: "YAML",
      markdown: "Markdown / README",
      gitignore: ".gitignore",
      ini_file: "INI 설정",
      toml: "TOML 설정"
    };
    return map[language] || language || "자동";
  }

  function riskLabel(risk) {
    if (risk === "high") return "높음";
    if (risk === "medium") return "주의";
    return "낮음";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }


  function normalizeSearchText(value) {
    return String(value || "").toLowerCase();
  }

  function extractRelatedKeywords(result) {
    const text = [
      result.language,
      result.summary,
      (result.steps || []).map(function(step) {
        return [step.title, step.explain, step.code].join(" ");
      }).join(" ")
    ].join(" ").toLowerCase();

    const rules = [
      ["git", ["git", "commit", "stash", "diff", "push", "tag"]],
      ["powershell", ["powershell", "set-location", "copy-item", "compress-archive", "remove-item", "invoke-webrequest", "wrangler"]],
      ["backup", ["backup", "백업", "compress-archive", "copy-item", "zip"]],
      ["json", ["json", "json.load", "json.loads", "response.json"]],
      ["api", ["api", "fetch", "request", "response", "http"]],
      ["cloudflare", ["cloudflare", "worker", "workers", "wrangler", "env.db", "env.kv", "env.r2", "env.ai"]],
      ["database", ["database", "db", "d1", "sql", "select", "insert", "update", "delete", "prepare", "bind", "run"]],
      ["javascript", ["javascript", "const", "let", "document", "localstorage", "addeventlistener"]],
      ["python", ["python", "def", "import", "print", "for", "if", "open"]],
      ["file", ["file", "path", "copy", "move", "remove", "파일", "폴더", "경로"]],
      ["test", ["validate", "node --check", "pytest", "test", "regression", "검증"]],
      ["security", ["token", "secret", "env", "auth", "key", "보안", "환경변수"]]
    ];

    const found = new Set();
    rules.forEach(function(rule) {
      const keyword = rule[0];
      const aliases = rule[1];
      if (aliases.some(function(alias) { return text.includes(alias); })) {
        found.add(keyword);
      }
    });

    return Array.from(found);
  }

  function scoreSideCardForKeywords(card, keywords) {
    if (!card || !keywords.length) return 0;

    const related = Array.isArray(card.related_concepts) ? card.related_concepts.join(" ") : "";
    const text = normalizeSearchText([
      card.id,
      card.title,
      card.type,
      card.body,
      card.summary,
      card.description,
      card.detail,
      related
    ].join(" "));

    let score = 0;
    keywords.forEach(function(keyword) {
      if (text.includes(keyword)) score += 5;

      if (keyword === "cloudflare" && /worker|workers|cloudflare|wrangler|d1|kv|r2/.test(text)) score += 8;
      if (keyword === "database" && /database|db|sql|d1|query|table|repository/.test(text)) score += 7;
      if (keyword === "git" && /git|commit|stash|branch|github|version/.test(text)) score += 7;
      if (keyword === "powershell" && /powershell|terminal|script|command|cli/.test(text)) score += 7;
      if (keyword === "json" && /json|encoding|decode|parse/.test(text)) score += 6;
      if (keyword === "api" && /api|http|request|response|fetch|fastapi/.test(text)) score += 6;
      if (keyword === "test" && /test|validation|regression|quality|검증/.test(text)) score += 6;
      if (keyword === "security" && /secret|token|auth|env|security|보안/.test(text)) score += 6;
    });

    if (card.detail && card.detail.length > 120) score += 1;
    if (card.body && card.body.length > 120) score += 1;

    return score;
  }

  function findRelatedCards(result) {
    const keywords = extractRelatedKeywords(result);

    if (!learningSideCards.length || !keywords.length) {
      return [];
    }

    return learningSideCards
      .map(function(card) {
        return {
          card: card,
          score: scoreSideCardForKeywords(card, keywords)
        };
      })
      .filter(function(item) {
        return item.score > 0;
      })
      .sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return String(a.card.title || "").localeCompare(String(b.card.title || ""));
      })
      .slice(0, 3)
      .map(function(item) {
        return item.card;
      });
  }

  function renderRelatedCards(result) {
    const box = el("codeRelatedCards");
    if (!box) return;

    const matches = findRelatedCards(result);
    box.innerHTML = "";

    if (!matches.length) {
      box.className = "code-related-cards muted";
      box.textContent = "해석 후 참고할 만한 보충 사이드카드를 찾지 못했습니다.";
      return;
    }

    box.className = "code-related-cards";

    matches.forEach(function(card) {
      const item = document.createElement("div");
      item.className = "code-related-card";

      const title = document.createElement("div");
      title.className = "code-related-title";
      title.textContent = card.title || card.id || "사이드카드";

      const body = document.createElement("div");
      body.className = "code-related-body";
      body.textContent = card.body || card.summary || card.description || "";

      const detail = document.createElement("details");
      detail.className = "code-related-detail";

      const summary = document.createElement("summary");
      summary.textContent = "자세히 보기";

      const detailBody = document.createElement("p");
      detailBody.textContent = card.detail || card.body || "";

      detail.appendChild(summary);
      detail.appendChild(detailBody);

      item.appendChild(title);
      item.appendChild(body);
      item.appendChild(detail);
      box.appendChild(item);
    });
  }

  function renderStepMeta(step) {
    const tags = Array.isArray(step.tags) ? step.tags : [];
    const category = step.category || "";

    if (!category && !tags.length) return "";

    const tagHtml = tags.slice(0, 4).map(function(tag) {
      return '<span class="code-step-tag">' + escapeHtml(tag) + '</span>';
    }).join("");

    return '<div class="code-step-meta">' +
      (category ? '<span class="code-step-category">' + escapeHtml(category) + '</span>' : "") +
      tagHtml +
      '</div>';
  }

  function shouldShowRiskOnly() {
    const toggle = el("showRiskOnlyToggle");
    return !!(toggle && toggle.checked);
  }

  function getVisibleSteps(steps) {
    const list = Array.isArray(steps) ? steps : [];
    if (!shouldShowRiskOnly()) return list;
    return list.filter(function(step) {
      return step.risk === "medium" || step.risk === "high";
    });
  }

  function renderSteps(steps) {
    const box = el("codeSteps");
    if (!box) return;
    box.innerHTML = "";

    const visibleSteps = getVisibleSteps(steps);

    if (!visibleSteps.length) {
      box.innerHTML = shouldShowRiskOnly()
        ? '<p class="muted">위험/주의 단계가 없습니다. 전체 단계를 보려면 필터를 끄세요.</p>'
        : '<p class="muted">표시할 단계가 없습니다.</p>';
      return;
    }

    visibleSteps.forEach(function(step, idx) {
      const item = document.createElement("div");
      item.className = "code-step risk-" + step.risk;
      item.innerHTML = `
        <div class="code-step-head">
          <span class="step-number">${idx + 1}</span>
          <strong>${escapeHtml(step.title)}</strong>
          <span class="risk-badge">${riskLabel(step.risk)}</span>
        </div>
        <p>${escapeHtml(step.explain)}</p>
        ${renderStepMeta(step)}
        <pre class="code-step-line">line ${step.lineNo}: ${escapeHtml(step.code)}</pre>
      `;
      box.appendChild(item);
    });
  }

  function renderWarnings(warnings) {
    const box = el("codeWarnings");
    if (!box) return;
    box.innerHTML = "";

    if (!warnings.length) {
      box.className = "code-warnings muted";
      box.textContent = "높은 위험 명령은 감지되지 않았습니다.";
      return;
    }

    box.className = "code-warnings";
    warnings.forEach(function(step) {
      const item = document.createElement("div");
      item.className = "warning-item risk-" + step.risk;
      item.textContent = "line " + step.lineNo + " · " + step.title + " · " + step.code;
      box.appendChild(item);
    });
  }


  function countByValue(items, picker) {
    const counts = {};
    (items || []).forEach(function(item) {
      const key = picker(item);
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  function formatCountSummary(counts) {
    return Object.keys(counts)
      .sort(function(a, b) {
        if (counts[b] !== counts[a]) return counts[b] - counts[a];
        return a.localeCompare(b);
      })
      .slice(0, 6)
      .map(function(key) {
        return key + " " + counts[key] + "개";
      })
      .join(" · ");
  }

  function buildPlainTextReport(result) {
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const warnings = Array.isArray(result.warnings) ? result.warnings : [];
    const lines = [];

    lines.push("[코드 해석 리포트]");
    lines.push("언어: " + languageLabel(result.language));
    lines.push("요약: " + (result.summary || ""));
    if (result.flowSummary) lines.push("흐름: " + result.flowSummary);
    lines.push("단계 수: " + steps.length);
    lines.push("주의/위험 줄: " + warnings.length);

    // SOURCE_CODE_PREVIEW_V180_A4
    const sourceCode = String(result.sourceCode || "");
    if (sourceCode.trim()) {
      lines.push("");
      lines.push("[원본 코드 앞부분]");
      const sourceLines = sourceCode.split(/\r?\n/);
      lines.push(sourceLines.slice(0, 120).join("\n").slice(0, 8000));
      if (sourceCode.length > 8000 || sourceLines.length > 120) {
        lines.push("... 원본 코드 일부 생략");
      }
    }
    if (warnings.length) {
      lines.push("");
      lines.push("[주의/위험 명령]");
      warnings.forEach(function(step) {
        lines.push("- line " + step.lineNo + " · " + riskLabel(step.risk) + " · " + step.title + " · " + step.code);
      });
    }

    lines.push("");
    lines.push("[단계별 해설]");
    steps.slice(0, 50).forEach(function(step, idx) {
      const tags = Array.isArray(step.tags) && step.tags.length ? " #" + step.tags.join(" #") : "";
      lines.push((idx + 1) + ". line " + step.lineNo + " · " + step.title + " · " + step.explain + tags);
      lines.push("   코드: " + step.code);
    });

    if (steps.length > 50) {
      lines.push("... 이후 " + (steps.length - 50) + "개 단계 생략");
    }

    if (lastMermaid) {
      lines.push("");
      lines.push("[Mermaid]");
      lines.push(lastMermaid);
    }

    return lines.join("\n");
  }

  function renderQuickReport(result) {
    const box = el("codeQuickReport");
    if (!box) return;

    const steps = Array.isArray(result.steps) ? result.steps : [];
    const warnings = Array.isArray(result.warnings) ? result.warnings : [];
    const categories = countByValue(steps, function(step) { return step.category || "처리"; });
    const mediumOrHigh = steps.filter(function(step) {
      return step.risk === "medium" || step.risk === "high";
    }).length;

    box.className = "code-quick-report";
    box.innerHTML = '<div class="code-report-mini-grid">' +
      '<span class="code-report-chip"><strong>' + steps.length + '</strong><small>단계</small></span>' +
      '<span class="code-report-chip"><strong>' + warnings.length + '</strong><small>위험/주의</small></span>' +
      '<span class="code-report-chip"><strong>' + mediumOrHigh + '</strong><small>확인필요</small></span>' +
      '</div>' +
      '<p class="code-report-categories">' + escapeHtml(formatCountSummary(categories) || "분류 없음") + '</p>';
  }

  async function copyCodeReport() {
    if (!lastReport) {
      alert("복사할 코드 해석 리포트가 없습니다. 먼저 분석하기를 눌러주세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(lastReport);
      alert("코드 해석 리포트를 복사했습니다.");
    } catch (error) {
      alert("리포트 복사 실패: " + String(error));
    }
  }

  async function renderMermaid(source) {
    lastMermaid = source || "";
    const sourceBox = el("mermaidSource");
    const diagram = el("mermaidDiagram");
    const status = el("diagramStatus");

    if (sourceBox) sourceBox.textContent = lastMermaid;
    if (!diagram) return;

    if (!lastMermaid) {
      diagram.textContent = "생성된 Mermaid 코드가 없습니다.";
      if (status) status.textContent = "생성 없음";
      return;
    }

    if (!window.mermaid || typeof window.mermaid.render !== "function") {
      diagram.innerHTML = '<p class="muted">Mermaid 로딩 중입니다. 잠시 후 다시 분석하기를 눌러주세요.</p>';
      if (status) status.textContent = "Mermaid 로딩 중";
      return;
    }

    try {
      const id = "codeFlowDiagram" + Date.now();
      const result = await window.mermaid.render(id, lastMermaid);
      diagram.innerHTML = result.svg;
      if (status) status.textContent = "흐름도 생성 완료";
    } catch (error) {
      diagram.innerHTML = '<p class="muted">Mermaid 렌더링 실패: ' + escapeHtml(String(error)) + '</p>';
      if (status) status.textContent = "렌더링 실패";
    }
  }

  function analyzeCurrentCode() {
    const input = el("codeInput");
    const select = el("codeLangSelect");
    const summary = el("codeSummary");

    if (!input || !window.CodeExplainerRules) return;

    const requested = select ? select.value : "auto";
    const result = window.CodeExplainerRules.analyze(input.value, requested);
    result.sourceCode = input.value;
    lastAnalysis = result;
    lastReport = buildPlainTextReport(result);

    if (summary) {
      summary.className = "code-summary";
      summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' +
        escapeHtml(result.summary) +
        (result.flowSummary ? '<br><span class="code-flow-summary">' + escapeHtml(result.flowSummary) + '</span>' : "");
    }

    renderQuickReport(result);
    renderWarnings(result.warnings || []);
    renderSteps(result.steps || []);
    renderRelatedCards(result);
    renderMermaid(result.mermaid || "");
  }

  function loadSample() {
    const select = el("codeLangSelect");
    const input = el("codeInput");
    if (!input) return;

    const selected = select && select.value !== "auto" ? select.value : "powershell";
    input.value = samples[selected] || samples.powershell;
    analyzeCurrentCode();

    const diagram = el("mermaidDiagram");
    if (diagram && typeof diagram.scrollIntoView === "function") {
      window.setTimeout(function() {
        diagram.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }

  function clearInput() {
    const input = el("codeInput");
    if (input) input.value = "";
    const summary = el("codeSummary");
    const warnings = el("codeWarnings");
    const steps = el("codeSteps");
    const diagram = el("mermaidDiagram");
    const source = el("mermaidSource");
    const quick = el("codeQuickReport");
    const riskOnly = el("showRiskOnlyToggle");
    if (summary) {
      summary.className = "code-summary muted";
      summary.textContent = "아직 분석한 코드가 없습니다.";
    }
    if (warnings) {
      warnings.className = "code-warnings muted";
      warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다.";
    }
    if (steps) steps.innerHTML = "";
    if (riskOnly) riskOnly.checked = false;
    if (diagram) diagram.innerHTML = "";
    if (source) source.textContent = "";
    if (quick) {
      quick.className = "code-quick-report muted";
      quick.textContent = "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.";
    }
    lastMermaid = "";
    lastReport = "";
    lastAnalysis = null;
  }

  async function copyMermaid() {
    if (!lastMermaid) {
      alert("복사할 Mermaid 코드가 없습니다.");
      return;
    }
    try {
      await navigator.clipboard.writeText(lastMermaid);
      alert("Mermaid 코드를 복사했습니다.");
    } catch (error) {
      alert("복사 실패: " + String(error));
    }
  }


  function setLearningContent(cards, sideCards) {
    learningCards = Array.isArray(cards) ? cards : [];
    learningSideCards = Array.isArray(sideCards) ? sideCards : [];
  }

  function refresh() {
    const input = el("codeInput");
    if (input && input.value.trim() && el("codeSteps") && el("codeSteps").children.length === 0) {
      analyzeCurrentCode();
    }
  }

  function init() {
    const analyzeBtn = el("analyzeCodeBtn");
    const sampleBtn = el("loadCodeSampleBtn");
    const clearBtn = el("clearCodeBtn");
    const copyBtn = el("copyMermaidBtn");
    const copyReportBtn = el("copyCodeReportBtn");
    const riskOnlyToggle = el("showRiskOnlyToggle");

    if (analyzeBtn) analyzeBtn.onclick = analyzeCurrentCode;
    if (sampleBtn) sampleBtn.onclick = loadSample;
    if (clearBtn) clearBtn.onclick = clearInput;
    if (copyBtn) copyBtn.onclick = copyMermaid;
    if (copyReportBtn) copyReportBtn.onclick = copyCodeReport;
    if (riskOnlyToggle) {
      riskOnlyToggle.onchange = function() {
        if (lastAnalysis) renderSteps(lastAnalysis.steps || []);
      };
    }

    const select = el("codeLangSelect");
    if (select) {
      select.onchange = updateLanguageHint;
      updateLanguageHint();
    }

    const input = el("codeInput");
    if (input && !input.value.trim()) {
      input.value = samples.powershell;
    }
  }

  window.CodeExplainer = {
    refresh: refresh,
    analyze: analyzeCurrentCode,
    setLearningContent: setLearningContent
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// === CODE EXPLAINER UI V170-A3 END ===
