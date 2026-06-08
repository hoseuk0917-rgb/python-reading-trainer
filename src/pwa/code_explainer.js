// === CODE EXPLAINER UI V208-A1 START ===
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
      auto: "자동 감지",
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

  // DETECTION_UX_V185_A2
  function getDetectionReasons(result, requested, source) {
    const language = result && result.language ? result.language : "";
    const text = String(source || "");
    const reasons = [];

    function add(reason) {
      if (reason && !reasons.includes(reason)) reasons.push(reason);
    }

    if (requested && requested !== "auto") {
      add("사용자가 언어를 직접 선택했습니다.");
    } else {
      add("자동감지로 코드 모양을 판별했습니다.");
    }

    if (language === "powershell") {
      if (/Set-Location|Copy-Item|Remove-Item|Test-Path|Invoke-WebRequest/i.test(text)) add("PowerShell 명령어 패턴이 보입니다.");
      if (/\$[A-Za-z_][\w-]*\s*=/.test(text)) add("PowerShell 변수($이름) 사용이 보입니다.");
      if (/\bgit\s+(status|add|commit|push|tag|stash|reset|clean)\b/i.test(text)) add("Git 작업 명령이 포함되어 있습니다.");
    }

    if (language === "python") {
      if (/^\s*(import|from)\s+/m.test(text)) add("Python import 문이 보입니다.");
      if (/^\s*(async\s+)?def\s+\w+\s*\(/m.test(text)) add("Python 함수 정의가 보입니다.");
      if (/^\s*class\s+\w+[:(]/m.test(text)) add("Python 클래스 정의가 보입니다.");
    }

    if (language === "javascript") {
      if (/\b(const|let|var)\s+\w+\s*=/.test(text)) add("JavaScript 변수 선언이 보입니다.");
      if (/document\.getElementById|querySelector|addEventListener|localStorage/.test(text)) add("브라우저 DOM/이벤트 코드가 보입니다.");
      if (/function\s+\w*\s*\(|=>/.test(text)) add("JavaScript 함수 패턴이 보입니다.");
    }

    if (language === "workers") {
      if (/export\s+default/.test(text) || /fetch\s*\(\s*request\s*,\s*env/.test(text)) add("Cloudflare Worker fetch 진입점이 보입니다.");
      if (/\benv\.(DB|KV|R2|AI)\b/.test(text)) add("Cloudflare env 바인딩 사용이 보입니다.");
      if (/Response\.json|new\s+Response/.test(text)) add("Worker 응답 반환 코드가 보입니다.");
    }

    if (language === "java") {
      if (/public\s+static\s+void\s+main/.test(text)) add("Java main 메서드가 보입니다.");
      if (/System\.out\.println|public\s+class/.test(text)) add("Java 클래스/출력 문법이 보입니다.");
    }

    if (language === "package_json") {
      if (/"scripts"\s*:\s*\{/.test(text)) add("package.json scripts 영역이 보입니다.");
      if (/"dependencies"|"devDependencies"/.test(text)) add("npm 의존성 영역이 보입니다.");
    }

    if (language === "github_actions") {
      if (/^\s*on\s*:/m.test(text) && /^\s*jobs\s*:/m.test(text)) add("GitHub Actions의 on/jobs 구조가 보입니다.");
      if (/uses:\s*actions\//.test(text)) add("actions/checkout 같은 GitHub Action 사용이 보입니다.");
    }

    if (language === "dockerfile") {
      if (/^\s*FROM\s+\S+/m.test(text)) add("Dockerfile FROM 베이스 이미지 줄이 보입니다.");
      if (/^\s*(RUN|COPY|WORKDIR|CMD|ENTRYPOINT|EXPOSE|ENV|ARG)\s+/m.test(text)) add("Dockerfile 명령어 패턴이 보입니다.");
    }

    if (language === "env_file") {
      if (/^\s*[A-Z][A-Z0-9_]*\s*=.+/m.test(text)) add("대문자 환경변수 KEY=VALUE 패턴이 보입니다.");
      if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(text)) add("비밀값으로 보이는 환경변수명이 포함되어 있습니다.");
    }

    if (language === "requirements_txt") {
      if (/^\s*[-\w.]+(\[[^\]]+\])?\s*(==|>=|<=|~=|>|<).+/m.test(text)) add("Python 패키지 버전 조건이 보입니다.");
      if (/^\s*-r\s+\S+/m.test(text)) add("다른 requirements 파일을 포함하는 줄이 보입니다.");
    }

    if (language === "pyproject_toml") {
      if (/^\s*\[project\]\s*$/m.test(text)) add("pyproject.toml의 [project] 영역이 보입니다.");
      if (/^\s*\[build-system\]\s*$/m.test(text)) add("Python build-system 설정이 보입니다.");
    }

    if (language === "yaml") {
      if (/^\s*[A-Za-z0-9_-]+\s*:\s*/m.test(text)) add("YAML key: value 구조가 보입니다.");
      if (/^\s+[-A-Za-z0-9_]+\s*:/m.test(text)) add("들여쓰기 기반 설정 구조가 보입니다.");
    }

    if (language === "markdown") {
      if (/^\s*#\s+.+/m.test(text) || /^\s*#{2,6}\s+.+/m.test(text)) add("Markdown 제목(#)이 보입니다.");
      if (/```/.test(text)) add("Markdown 코드블록이 포함되어 있습니다.");
      if (/\[[^\]]+\]\([^)]+\)/.test(text)) add("Markdown 링크 문법이 보입니다.");
    }

    if (language === "gitignore") {
      if (/^!/.test(text) || /^\*\./m.test(text) || /\/$/m.test(text)) add(".gitignore 무시/예외 패턴이 보입니다.");
      if (/node_modules\/|dist\/|__pycache__\/|\.env/m.test(text)) add("Git에서 제외할 폴더/파일 패턴이 보입니다.");
    }

    if (language === "ini_file") {
      if (/^\s*\[[A-Za-z0-9_. -]+\]\s*$/m.test(text)) add("INI 섹션([section])이 보입니다.");
      if (/^\s*[A-Za-z0-9_.-]+\s*=\s*[^=]+/m.test(text)) add("INI key=value 설정이 보입니다.");
    }

    if (language === "toml") {
      if (/^\s*\[[A-Za-z0-9_.-]+\]\s*$/m.test(text)) add("TOML 테이블([table])이 보입니다.");
      if (/^\s*[A-Za-z0-9_.-]+\s*=\s*("|\[|true|false|\d)/m.test(text)) add("TOML 값 형식이 보입니다.");
    }

    add("감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요.");

    return reasons.slice(0, 5);
  }

  function renderDetectionDetails(result, requested, source) {
    const box = el("codeDetectionDetails");
    if (!box) return;

    const reasons = getDetectionReasons(result, requested, source);
    const requestedLabel = requested === "auto" ? "자동 감지" : languageLabel(requested);
    const detectedLabel = languageLabel(result.language);

    box.className = "code-detection-details";
    box.innerHTML = '<div class="code-detection-head">' +
      '<span class="code-detection-chip">선택: ' + escapeHtml(requestedLabel) + '</span>' +
      '<span class="code-detection-chip strong">감지: ' + escapeHtml(detectedLabel) + '</span>' +
      '</div>' +
      '<ul>' + reasons.map(function(reason) {
        return '<li>' + escapeHtml(reason) + '</li>';
      }).join("") + '</ul>';
  }

  function riskLabel(risk) {
    if (risk === "high") return "높음";
    if (risk === "medium") return "주의";
    return "낮음";
  }

  // CONFIDENCE_UI_V202_A1
  function confidenceLabel(confidence) {
    if (confidence === "exact") return "확실";
    if (confidence === "inferred") return "추정";
    if (confidence === "unsupported") return "미지원";
    return "추정";
  }

  function confidenceClass(confidence) {
    if (confidence === "exact") return "confidence-exact";
    if (confidence === "unsupported") return "confidence-unsupported";
    return "confidence-inferred";
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
    const confidence = step.confidence || "inferred";

    const tagHtml = tags.slice(0, 4).map(function(tag) {
      return '<span class="code-step-tag">' + escapeHtml(tag) + '</span>';
    }).join("");

    return '<div class="code-step-meta">' +
      '<span class="code-confidence-chip ' + confidenceClass(confidence) + '">' + escapeHtml(confidenceLabel(confidence)) + '</span>' +
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
      const confidence = step.confidence || "inferred";
      const item = document.createElement("div");
      item.className = "code-step risk-" + step.risk + " " + confidenceClass(confidence);
      item.innerHTML = `
        <div class="code-step-head">
          <span class="step-number">${idx + 1}</span>
          <strong>${escapeHtml(step.title)}</strong>
          <span class="confidence-badge ${confidenceClass(confidence)}">${confidenceLabel(confidence)}</span>
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

  // LONG_CODE_OVERVIEW_V186_A3
  function getSourceStats(source) {
    const lines = String(source || "").split(/\r?\n/);
    const nonEmpty = lines.filter(function(line) { return line.trim(); }).length;
    const commentLike = lines.filter(function(line) {
      const t = line.trim();
      return t.startsWith("#") || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*") || t.startsWith(";") || t.startsWith("<!--");
    }).length;

    return {
      lineCount: lines.length,
      nonEmptyCount: nonEmpty,
      commentLikeCount: commentLike,
      charCount: String(source || "").length
    };
  }

  function addOutlineItem(list, lineNo, type, name, detail) {
    if (!name && !detail) return;
    list.push({
      lineNo: lineNo,
      type: type,
      name: name || detail,
      detail: detail || ""
    });
  }

  function extractCodeOutline(source, language) {
    const lines = String(source || "").split(/\r?\n/);
    const outline = [];

    lines.forEach(function(line, idx) {
      const lineNo = idx + 1;
      const t = line.trim();
      let match;

      if (!t) return;

      if (language === "python") {
        match = t.match(/^(async\s+def|def)\s+([A-Za-z_][\w_]*)\s*\(/);
        if (match) addOutlineItem(outline, lineNo, "함수", match[2], match[1]);
        match = t.match(/^class\s+([A-Za-z_][\w_]*)/);
        if (match) addOutlineItem(outline, lineNo, "클래스", match[1], "class");
        if (/^if\s+__name__\s*==\s*["']__main__["']/.test(t)) addOutlineItem(outline, lineNo, "실행 시작점", "__main__", "직접 실행될 때 시작되는 구간");
      }

      if (language === "javascript" || language === "workers") {
        match = t.match(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
        if (match) addOutlineItem(outline, lineNo, "함수", match[2], "function");
        match = t.match(/^(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(async\s*)?\(?/);
        if (match && /=>|function|\(/.test(t)) addOutlineItem(outline, lineNo, "함수/핸들러", match[2], match[1]);
        if (/export\s+default/.test(t)) addOutlineItem(outline, lineNo, "모듈 진입점", "export default", "외부로 공개되는 기본 객체");
        if (/fetch\s*\(\s*request\s*,\s*env/.test(t)) addOutlineItem(outline, lineNo, "요청 처리", "fetch(request, env)", "Workers 요청 처리 함수");
        if (/addEventListener\s*\(/.test(t)) addOutlineItem(outline, lineNo, "이벤트 연결", "addEventListener", "사용자 동작과 함수를 연결");
      }

      if (language === "java") {
        match = t.match(/class\s+([A-Za-z_][\w_]*)/);
        if (match) addOutlineItem(outline, lineNo, "클래스", match[1], "class");
        if (/public\s+static\s+void\s+main/.test(t)) addOutlineItem(outline, lineNo, "실행 시작점", "main", "Java 프로그램 시작 메서드");
        match = t.match(/(?:public|private|protected)?\s*(?:static\s+)?[A-Za-z_<>\[\]]+\s+([A-Za-z_][\w_]*)\s*\([^)]*\)\s*\{/);
        if (match && match[1] !== "main") addOutlineItem(outline, lineNo, "메서드", match[1], "method");
      }

      if (language === "powershell") {
        match = t.match(/^function\s+([A-Za-z_][\w-]*)/i);
        if (match) addOutlineItem(outline, lineNo, "함수", match[1], "PowerShell function");
        if (/^param\s*\(/i.test(t)) addOutlineItem(outline, lineNo, "입력 파라미터", "param", "스크립트 입력값 정의");
        if (/^git\s+/i.test(t)) addOutlineItem(outline, lineNo, "Git 작업", t.split(/\s+/).slice(0, 3).join(" "), "버전관리 명령");
        if (/wrangler/i.test(t)) addOutlineItem(outline, lineNo, "Cloudflare 작업", t, "wrangler 명령");
      }

      if (language === "markdown") {
        match = t.match(/^(#{1,6})\s+(.+)/);
        if (match) addOutlineItem(outline, lineNo, "문서 제목", match[2], "level " + match[1].length);
      }

      if (language === "yaml" || language === "github_actions") {
        match = t.match(/^([A-Za-z0-9_-]+)\s*:\s*$/);
        if (match) addOutlineItem(outline, lineNo, "설정 구간", match[1], "YAML block");
      }

      if (language === "toml" || language === "pyproject_toml" || language === "ini_file") {
        match = t.match(/^\[([^\]]+)\]$/);
        if (match) addOutlineItem(outline, lineNo, "설정 섹션", match[1], "section");
      }

      if (language === "dockerfile") {
        match = t.match(/^(FROM|WORKDIR|COPY|RUN|CMD|ENTRYPOINT|EXPOSE|ENV)\b/i);
        if (match) addOutlineItem(outline, lineNo, "Docker 단계", match[1].toUpperCase(), t);
      }
    });

    return outline.slice(0, 16);
  }

  function buildReadingOrder(result) {
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const categories = countByValue(steps, function(step) { return step.category || "처리"; });
    const order = [];

    function has(category) {
      return categories[category] > 0;
    }

    if (has("의존성") || has("패키지설정") || has("프로젝트설정")) order.push("1. 먼저 import, 의존성, 프로젝트 설정을 확인합니다.");
    if (has("구조") || has("CLI") || has("웹서버")) order.push("2. 함수, 클래스, CLI 진입점, API 엔드포인트 같은 큰 구조를 봅니다.");
    if (has("파일/경로") || has("저장소") || has("DB")) order.push("3. 파일, 저장소, DB처럼 데이터가 들어오고 나가는 지점을 확인합니다.");
    if (has("조건") || has("반복") || has("검증")) order.push("4. 조건문, 반복문, 검증 로직이 실제 처리를 어떻게 나누는지 봅니다.");
    if (has("출력/응답") || has("배포")) order.push("5. 마지막 출력, 응답, 배포 명령으로 결과가 어디로 나가는지 확인합니다.");

    if (!order.length) {
      order.push("1. 위에서 아래로 읽되, 제목/섹션/함수처럼 큰 구간부터 먼저 확인합니다.");
      order.push("2. 그다음 위험/주의 단계와 출력 지점을 확인합니다.");
    }

    return order.slice(0, 5);
  }

  function buildLongCodeOverview(result) {
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const warnings = Array.isArray(result.warnings) ? result.warnings : [];
    const source = String(result.sourceCode || "");
    const stats = getSourceStats(source);
    const categories = countByValue(steps, function(step) { return step.category || "처리"; });
    const tags = countByValue(steps, function(step) {
      if (!Array.isArray(step.tags) || !step.tags.length) return "";
      return step.tags[0];
    });

    return {
      stats: stats,
      topCategories: formatCountSummary(categories),
      topTags: formatCountSummary(tags),
      outline: extractCodeOutline(source, result.language),
      readingOrder: buildReadingOrder(result),
      warningLines: warnings.slice(0, 8).map(function(step) {
        return "line " + step.lineNo + " · " + step.title;
      })
    };
  }

  function renderStructureOverview(result) {
    const box = el("codeStructureOverview");
    if (!box) return;

    // TEXT_REPORT_LONG_OVERVIEW_V187_A2
    const overview = buildLongCodeOverview(result);
    const stats = overview.stats;
    const outline = overview.outline;
    const readingOrder = overview.readingOrder;
    const warningLines = overview.warningLines;

    const outlineHtml = outline.length
      ? '<ul>' + outline.map(function(item) {
          return '<li><strong>' + escapeHtml(item.type) + '</strong> · line ' + item.lineNo + ' · ' + escapeHtml(item.name) + (item.detail ? ' <span class="muted">(' + escapeHtml(item.detail) + ')</span>' : '') + '</li>';
        }).join("") + '</ul>'
      : '<p class="muted">함수/클래스/섹션 같은 큰 구조는 뚜렷하게 감지되지 않았습니다.</p>';

    const orderHtml = '<ol>' + readingOrder.map(function(item) {
      return '<li>' + escapeHtml(item.replace(/^\d+\.\s*/, "")) + '</li>';
    }).join("") + '</ol>';

    const warningHtml = warningLines.length
      ? '<p class="code-structure-warning">주의 구간: ' + escapeHtml(warningLines.join(" / ")) + '</p>'
      : '<p class="muted">주의/위험 구간은 별도로 감지되지 않았습니다.</p>';

    box.className = "code-structure-overview";
    box.innerHTML = '<div class="code-structure-stats">' +
      '<span><strong>' + stats.lineCount + '</strong><small>줄</small></span>' +
      '<span><strong>' + stats.nonEmptyCount + '</strong><small>내용 줄</small></span>' +
      '<span><strong>' + stats.commentLikeCount + '</strong><small>주석/문서 줄</small></span>' +
      '<span><strong>' + stats.charCount + '</strong><small>글자</small></span>' +
      '</div>' +
      '<p class="code-structure-categories">주요 분류: ' + escapeHtml(overview.topCategories || "분류 없음") + '</p>' +
      '<p class="code-structure-categories">주요 태그: ' + escapeHtml(overview.topTags || "태그 없음") + '</p>' +
      '<details open class="code-structure-detail"><summary>주요 함수/구간</summary>' + outlineHtml + '</details>' +
      '<details class="code-structure-detail"><summary>추천 읽는 순서</summary>' + orderHtml + '</details>' +
      warningHtml;
  }

  function buildPlainTextReport(result) {
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const warnings = Array.isArray(result.warnings) ? result.warnings : [];
    const lines = [];

    lines.push("[코드 해석 리포트]");
    lines.push("언어: " + languageLabel(result.language));
    if (result.requestedLanguage) {
      lines.push("입력 선택: " + languageLabel(result.requestedLanguage));
    }
    if (Array.isArray(result.detectionReasons) && result.detectionReasons.length) {
      lines.push("감지 근거: " + result.detectionReasons.join(" / "));
    }
    lines.push("요약: " + (result.summary || ""));
    if (result.flowSummary) lines.push("흐름: " + result.flowSummary);
    lines.push("단계 수: " + steps.length);
    lines.push("주의/위험 줄: " + warnings.length);

    const confidence = result.confidenceSummary || {};
    const unsupportedItems = Array.isArray(result.unsupportedItems) ? result.unsupportedItems : [];
    lines.push("확신도: 확실 " + (confidence.exact || 0) + " / 추정 " + (confidence.inferred || 0) + " / 미지원 " + (confidence.unsupported || 0));

    if (unsupportedItems.length) {
      lines.push("미지원/확인필요:");
      unsupportedItems.slice(0, 12).forEach(function(item) {
        lines.push("- line " + item.lineNo + " · " + item.token + " · " + item.code);
      });
    }

    const dataFlow = Array.isArray(result.dataFlow) ? result.dataFlow : [];
    const callFlow = Array.isArray(result.callFlow) ? result.callFlow : [];

    if (dataFlow.length) {
      lines.push("");
      lines.push("[데이터 흐름]");
      dataFlow.slice(0, 16).forEach(function(item) {
        lines.push("- line " + item.lineNo + " · " + item.kind + " · " + item.name + " · " + item.summary);
      });
    }

    if (callFlow.length) {
      lines.push("");
      lines.push("[호출 흐름]");
      callFlow.slice(0, 16).forEach(function(item) {
        lines.push("- line " + item.lineNo + " · " + item.type + " · " + item.name + (item.target ? " → " + item.target : "") + " · " + item.summary);
      });
    }

    const overview = buildLongCodeOverview(result);
    lines.push("");
    lines.push("[긴 코드 구조 요약]");
    lines.push("원본 규모: " + overview.stats.lineCount + "줄 / 내용 " + overview.stats.nonEmptyCount + "줄 / 글자 " + overview.stats.charCount);
    lines.push("주요 분류: " + (overview.topCategories || "분류 없음"));
    lines.push("주요 태그: " + (overview.topTags || "태그 없음"));
    if (overview.outline.length) {
      lines.push("주요 함수/구간:");
      overview.outline.slice(0, 12).forEach(function(item) {
        lines.push("- line " + item.lineNo + " · " + item.type + " · " + item.name + (item.detail ? " (" + item.detail + ")" : ""));
      });
    }
    if (overview.readingOrder.length) {
      lines.push("추천 읽는 순서:");
      overview.readingOrder.forEach(function(item) {
        lines.push("- " + item);
      });
    }

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
      lines.push((idx + 1) + ". line " + step.lineNo + " · " + confidenceLabel(step.confidence) + " · " + step.title + " · " + step.explain + tags);
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
    const confidence = result.confidenceSummary || {};
    const unsupportedItems = Array.isArray(result.unsupportedItems) ? result.unsupportedItems : [];

    box.className = "code-quick-report";
    box.innerHTML = '<div class="code-report-mini-grid">' +
      '<span class="code-report-chip"><strong>' + steps.length + '</strong><small>단계</small></span>' +
      '<span class="code-report-chip"><strong>' + warnings.length + '</strong><small>위험/주의</small></span>' +
      '<span class="code-report-chip"><strong>' + (confidence.unsupported || 0) + '</strong><small>미지원</small></span>' +
      '<span class="code-report-chip"><strong>' + unsupportedItems.length + '</strong><small>확인필요</small></span>' +
      '</div>' +
      '<p class="code-report-categories">' + escapeHtml(formatCountSummary(categories) || "분류 없음") + '</p>';
  }

  function renderConfidenceReport(result) {
    const box = el("codeConfidenceReport");
    if (!box) return;

    const confidence = result.confidenceSummary || {};
    const unsupportedItems = Array.isArray(result.unsupportedItems) ? result.unsupportedItems : [];

    const unsupportedHtml = unsupportedItems.length
      ? '<ul>' + unsupportedItems.slice(0, 10).map(function(item) {
          return '<li>line ' + item.lineNo + ' · <strong>' + escapeHtml(item.token) + '</strong> · ' + escapeHtml(item.code) + '</li>';
        }).join("") + '</ul>'
      : '<p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p>';

    box.className = "code-confidence-report";
    box.innerHTML = '<div class="code-confidence-grid">' +
      '<span class="code-confidence-chip confidence-exact"><strong>' + (confidence.exact || 0) + '</strong><small>확실</small></span>' +
      '<span class="code-confidence-chip confidence-inferred"><strong>' + (confidence.inferred || 0) + '</strong><small>추정</small></span>' +
      '<span class="code-confidence-chip confidence-unsupported"><strong>' + (confidence.unsupported || 0) + '</strong><small>미지원</small></span>' +
      '</div>' +
      '<details class="code-unsupported-detail" ' + (unsupportedItems.length ? 'open' : '') + '>' +
      '<summary>미지원/확인필요 함수·명령</summary>' +
      unsupportedHtml +
      '</details>';
  }

  // DATA_CALL_FLOW_UI_V203_A1
  function renderFlowList(items, emptyMessage) {
    if (!Array.isArray(items) || !items.length) {
      return '<p class="muted">' + escapeHtml(emptyMessage) + '</p>';
    }

    return '<ul>' + items.slice(0, 12).map(function(item) {
      const summary = item.summary ? ' <span class="muted">· ' + escapeHtml(item.summary) + '</span>' : "";
      const target = item.target ? ' <span class="muted">→ ' + escapeHtml(item.target) + '</span>' : "";
      return '<li><strong>line ' + item.lineNo + '</strong> · ' +
        escapeHtml(item.kind || item.type || "흐름") + ' · ' +
        escapeHtml(item.name || "값") + target + summary + '</li>';
    }).join("") + '</ul>';
  }

  function renderFlowAnalysisReport(result) {
    const box = el("codeFlowAnalysisReport");
    if (!box) return;

    const dataFlow = Array.isArray(result.dataFlow) ? result.dataFlow : [];
    const callFlow = Array.isArray(result.callFlow) ? result.callFlow : [];

    box.className = "code-flow-analysis-report";
    box.innerHTML = '<div class="code-flow-mini-grid">' +
      '<span class="code-report-chip"><strong>' + dataFlow.length + '</strong><small>데이터 흐름</small></span>' +
      '<span class="code-report-chip"><strong>' + callFlow.length + '</strong><small>호출 흐름</small></span>' +
      '</div>' +
      '<details open class="code-flow-detail"><summary>데이터 흐름</summary>' +
      renderFlowList(dataFlow, "변수 저장, 가공, 출력 흐름이 뚜렷하게 감지되지 않았습니다.") +
      '</details>' +
      '<details class="code-flow-detail"><summary>호출 흐름</summary>' +
      renderFlowList(callFlow, "함수 정의/호출 흐름이 뚜렷하게 감지되지 않았습니다.") +
      '</details>';
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
    result.requestedLanguage = requested;
    result.detectionReasons = getDetectionReasons(result, requested, input.value);
    lastAnalysis = result;
    lastReport = buildPlainTextReport(result);

    if (summary) {
      summary.className = "code-summary";
      summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' +
        escapeHtml(result.summary) +
        (result.flowSummary ? '<br><span class="code-flow-summary">' + escapeHtml(result.flowSummary) + '</span>' : "");
    }

    renderDetectionDetails(result, requested, input.value);
    renderQuickReport(result);
    renderConfidenceReport(result);
    renderFlowAnalysisReport(result);
    renderStructureOverview(result);
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
    const confidence = el("codeConfidenceReport");
    const flowAnalysis = el("codeFlowAnalysisReport");
    const structure = el("codeStructureOverview");
    const detection = el("codeDetectionDetails");
    const largeBody = el("diagramLargeBody");
    const largeModal = el("diagramLargeModal");
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
    if (largeBody) largeBody.innerHTML = "";
    if (largeModal) {
      largeModal.classList.add("hidden");
      largeModal.setAttribute("aria-hidden", "true");
    }
    if (quick) {
      quick.className = "code-quick-report muted";
      quick.textContent = "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.";
    }
    if (confidence) {
      confidence.className = "code-confidence-report muted";
      confidence.textContent = "분석하면 확실/추정/미지원 단계가 표시됩니다.";
    }
    if (flowAnalysis) {
      flowAnalysis.className = "code-flow-analysis-report muted";
      flowAnalysis.textContent = "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.";
    }
    if (structure) {
      structure.className = "code-structure-overview muted";
      structure.textContent = "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.";
    }
    if (detection) {
      detection.className = "code-detection-details muted";
      detection.textContent = "분석하면 자동감지 결과와 판단 근거가 표시됩니다.";
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

  // DIAGRAM_EXPORT_UX_V192_A1
  function getCurrentDiagramSvg() {
    const diagram = el("mermaidDiagram");
    const svg = diagram ? diagram.querySelector("svg") : null;
    return svg ? svg.outerHTML : "";
  }

  function setDiagramStatus(message) {
    const status = el("diagramStatus");
    if (status) status.textContent = message;
  }

  async function copyDiagramSvg() {
    const svg = getCurrentDiagramSvg();
    if (!svg) {
      alert("복사할 SVG가 없습니다. 먼저 분석하기를 눌러 흐름도를 생성하세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(svg);
      setDiagramStatus("SVG 원문 복사 완료");
      alert("SVG 원문을 복사했습니다.");
    } catch (error) {
      alert("SVG 복사 실패: " + String(error));
    }
  }

  function downloadDiagramSvg() {
    const svg = getCurrentDiagramSvg();
    if (!svg) {
      alert("다운로드할 SVG가 없습니다. 먼저 분석하기를 눌러 흐름도를 생성하세요.");
      return;
    }

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    link.href = url;
    link.download = "code-flow-diagram-" + stamp + ".svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDiagramStatus("SVG 다운로드 완료");
  }

  function openLargeDiagram() {
    const svg = getCurrentDiagramSvg();
    const modal = el("diagramLargeModal");
    const body = el("diagramLargeBody");

    if (!svg) {
      alert("크게 볼 흐름도가 없습니다. 먼저 분석하기를 눌러주세요.");
      return;
    }

    if (!modal || !body) return;
    body.innerHTML = svg;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    setDiagramStatus("큰 보기 열림");
  }

  function closeLargeDiagram() {
    const modal = el("diagramLargeModal");
    const body = el("diagramLargeBody");

    if (body) body.innerHTML = "";
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
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
    const downloadSvgBtn = el("downloadDiagramSvgBtn");
    const copySvgBtn = el("copyDiagramSvgBtn");
    const openLargeBtn = el("openLargeDiagramBtn");
    const closeLargeBtn = el("closeLargeDiagramBtn");
    const largeModal = el("diagramLargeModal");
    const riskOnlyToggle = el("showRiskOnlyToggle");

    if (analyzeBtn) analyzeBtn.onclick = analyzeCurrentCode;
    if (sampleBtn) sampleBtn.onclick = loadSample;
    if (clearBtn) clearBtn.onclick = clearInput;
    if (copyBtn) copyBtn.onclick = copyMermaid;
    if (copyReportBtn) copyReportBtn.onclick = copyCodeReport;
    if (downloadSvgBtn) downloadSvgBtn.onclick = downloadDiagramSvg;
    if (copySvgBtn) copySvgBtn.onclick = copyDiagramSvg;
    if (openLargeBtn) openLargeBtn.onclick = openLargeDiagram;
    if (closeLargeBtn) closeLargeBtn.onclick = closeLargeDiagram;
    if (largeModal) {
      largeModal.onclick = function(event) {
        if (event.target === largeModal) closeLargeDiagram();
      };
    }
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") closeLargeDiagram();
    });
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
// === CODE EXPLAINER UI V208-A1 END ===
