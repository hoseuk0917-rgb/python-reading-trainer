// === CODE EXPLAINER UI V169-A6 START ===
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
}`
  };

  let lastMermaid = "";
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
      java: "Java는 class, main, 변수 선언, if/for, method, 출력 흐름을 중심으로 설명합니다."
    };

    hint.textContent = messages[value] || messages.auto;
  }

  function languageLabel(language) {
    const map = {
      powershell: "PowerShell",
      python: "Python",
      javascript: "JavaScript",
      workers: "Cloudflare Workers",
      java: "Java"
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

  function renderSteps(steps) {
    const box = el("codeSteps");
    if (!box) return;
    box.innerHTML = "";

    if (!steps.length) {
      box.innerHTML = '<p class="muted">표시할 단계가 없습니다.</p>';
      return;
    }

    steps.forEach(function(step, idx) {
      const item = document.createElement("div");
      item.className = "code-step risk-" + step.risk;
      item.innerHTML = `
        <div class="code-step-head">
          <span class="step-number">${idx + 1}</span>
          <strong>${escapeHtml(step.title)}</strong>
          <span class="risk-badge">${riskLabel(step.risk)}</span>
        </div>
        <p>${escapeHtml(step.explain)}</p>
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

    if (summary) {
      summary.className = "code-summary";
      summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' + escapeHtml(result.summary);
    }

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
    if (summary) {
      summary.className = "code-summary muted";
      summary.textContent = "아직 분석한 코드가 없습니다.";
    }
    if (warnings) {
      warnings.className = "code-warnings muted";
      warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다.";
    }
    if (steps) steps.innerHTML = "";
    if (diagram) diagram.innerHTML = "";
    if (source) source.textContent = "";
    lastMermaid = "";
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

    if (analyzeBtn) analyzeBtn.onclick = analyzeCurrentCode;
    if (sampleBtn) sampleBtn.onclick = loadSample;
    if (clearBtn) clearBtn.onclick = clearInput;
    if (copyBtn) copyBtn.onclick = copyMermaid;

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
// === CODE EXPLAINER UI V169-A6 END ===
