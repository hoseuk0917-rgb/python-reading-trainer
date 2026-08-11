"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const vm = require("vm");

const SERVICE = "local-prt-server";
const VERSION = "v338_reconcile_a1";
const RUNTIME_VERSION = "20260623_v335_a2";
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3377;
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_RECONCILIATION_OUTPUT_BYTES = 8 * 1024 * 1024;
const MAX_RECONCILIATION_STDERR_BYTES = 64 * 1024;
const PYTHON_COMMAND = process.env.PRT_PYTHON_COMMAND || "python";
const PYTHON_RECONCILIATION_BRIDGE = path.join(
  ROOT,
  "tools",
  "python_reading_reconciliation_server_bridge_v0_1.py"
);

const host = process.env.PRT_LOCAL_HOST || DEFAULT_HOST;
const portRaw = process.env.PRT_LOCAL_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(portRaw, 10);

let cachedCodeAnalyzer = null;

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(JSON.stringify({
    ok: false,
    service: SERVICE,
    error: "invalid_port",
    portRaw
  }, null, 2));
  process.exit(1);
}

const allowedOrigins = new Set([
  "http://127.0.0.1:3377",
  "http://localhost:3377",
  "https://hoseuk0917-rgb.github.io"
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return allowedOrigins.has(origin);
}

function setCommonHeaders(req, res, statusCode) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
  }
}

function sendJson(req, res, statusCode, payload) {
  setCommonHeaders(req, res, statusCode);
  res.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("request_body_too_large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(Object.assign(new Error("invalid_json_body"), { statusCode: 400, cause: error }));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

function getHealthPayload() {
  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    runtimeVersion: RUNTIME_VERSION,
    repo: "python-reading-trainer",
    host,
    port,
    root: ROOT,
    platform: {
      os: os.platform(),
      arch: os.arch(),
      node: process.version
    },
    engines: {
      code: true,
      command: false,
      project: false,
      proofy: true,
      pythonAst: true,
      pythonReconciliation: true
    },
    endpoints: [
      "GET /health",
      "POST /analyze-code",
      "POST /analyze-python-structure",
      "POST /proofy/explain"
    ],
    privacy: {
      localhostOnly: host === "127.0.0.1" || host === "localhost",
      externalApiByDefault: false,
      automaticClipboardMonitoring: false,
      backgroundFileScanning: false,
      persistOriginalInputByDefault: false,
      pythonProcessLocalOnly: true
    },
    next: "V338 reconciliation A1 adds a localhost Python AST + rule-analyzer structural endpoint without replacing /analyze-code."
  };
}

function createBrowserLikeSandbox() {
  const sandbox = {
    console,
    navigator: { language: "ko-KR" },
    location: { search: "", href: "http://127.0.0.1:3377/" },
    localStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
      clear() {}
    },
    sessionStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
      clear() {}
    },
    document: {
      documentElement: {
        getAttribute(name) {
          if (String(name || "").toLowerCase() === "lang") return "ko-KR";
          return "";
        }
      },
      addEventListener() {},
      querySelector() { return null; },
      getElementById() { return null; },
      body: { dataset: {} }
    },
    URLSearchParams,
    setTimeout,
    clearTimeout
  };

  sandbox.window = sandbox;
  return sandbox;
}

function loadCodeAnalyzer() {
  if (cachedCodeAnalyzer) return cachedCodeAnalyzer;

  const rulesPath = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
  const rulesText = fs.readFileSync(rulesPath, "utf8");
  const sandbox = createBrowserLikeSandbox();

  vm.createContext(sandbox);
  vm.runInContext(rulesText, sandbox, { filename: "code_explainer_rules.js" });

  const api = sandbox.window.CodeExplainerRules || sandbox.CodeExplainerRules;
  if (!api || typeof api.analyze !== "function") {
    throw new Error("CodeExplainerRules.analyze is not callable");
  }

  cachedCodeAnalyzer = {
    rulesPath,
    analyze(source, language) {
      return api.analyze(source, language);
    }
  };

  return cachedCodeAnalyzer;
}

function runPythonReconciliation(source, ruleAnalysis, sourceName) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let stdout = "";
    let stderr = "";
    let stdoutBytes = 0;
    let stderrBytes = 0;

    function fail(message, statusCode) {
      if (settled) return;
      settled = true;
      reject(Object.assign(new Error(message), { statusCode }));
    }

    function succeed(value) {
      if (settled) return;
      settled = true;
      resolve(value);
    }

    const child = childProcess.spawn(
      PYTHON_COMMAND,
      [PYTHON_RECONCILIATION_BRIDGE],
      {
        cwd: ROOT,
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      }
    );

    child.stdout.on("data", (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > MAX_RECONCILIATION_OUTPUT_BYTES) {
        child.kill();
        fail("python_reconciliation_output_too_large", 500);
        return;
      }
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      if (stderrBytes >= MAX_RECONCILIATION_STDERR_BYTES) return;
      stderrBytes += chunk.length;
      stderr += chunk.toString("utf8");
      if (stderr.length > MAX_RECONCILIATION_STDERR_BYTES) {
        stderr = stderr.slice(0, MAX_RECONCILIATION_STDERR_BYTES);
      }
    });

    child.on("error", (error) => {
      if (error && error.code === "ENOENT") {
        fail("python_runtime_unavailable", 503);
        return;
      }
      fail("python_reconciliation_spawn_failed", 500);
    });

    child.on("close", (code) => {
      if (settled) return;
      if (code !== 0) {
        fail(/SyntaxError/.test(stderr) ? "python_parse_failed" : "python_reconciliation_failed", /SyntaxError/.test(stderr) ? 422 : 500);
        return;
      }

      try {
        succeed(JSON.parse(stdout));
      } catch (_) {
        fail("python_reconciliation_invalid_json", 500);
      }
    });

    const envelope = {
      source: String(source || ""),
      source_name: String(sourceName || "<memory>.py"),
      rule_analysis: ruleAnalysis || {}
    };

    child.stdin.on("error", () => {
      if (!settled) fail("python_reconciliation_stdin_failed", 500);
    });
    child.stdin.end(JSON.stringify(envelope));
  });
}

async function buildPythonStructurePayload(source, requestedLanguage, sourceName) {
  const analyzer = loadCodeAnalyzer();
  const ruleAnalysis = analyzer.analyze(source, requestedLanguage || "auto") || {};
  const language = ruleAnalysis.language || ruleAnalysis.detectedLanguage || requestedLanguage || "unknown";

  if (language !== "python") {
    throw Object.assign(new Error("python_source_required"), { statusCode: 422 });
  }

  const reconciliation = await runPythonReconciliation(source, ruleAnalysis, sourceName);

  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    kind: "python_structure_reconciliation",
    language: "python",
    sourceMeta: {
      characters: String(source || "").length,
      lines: lineCount(source),
      sourceName: String(sourceName || "<memory>.py")
    },
    authority: reconciliation.authority,
    summary: reconciliation.summary,
    canonicalFindings: reconciliation.canonical_findings,
    diagnostics: reconciliation.diagnostics,
    astAuxiliary: reconciliation.ast_auxiliary,
    executionProjectionNodeIds: reconciliation.execution_projection_node_ids,
    graphIr: reconciliation.graph_ir,
    ruleAnalysis,
    privacy: {
      localhostOnly: host === "127.0.0.1" || host === "localhost",
      externalApiUsed: false,
      originalInputPersisted: false,
      pythonProcessLocalOnly: true
    }
  };
}

function lineCount(text) {
  const raw = String(text || "");
  if (!raw) return 0;
  return raw.split(/\r?\n/).length;
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function uniqueStrings(values, limit) {
  const seen = new Set();
  const out = [];

  toArray(values).forEach((value) => {
    const text = cleanText(value);
    if (!text) return;

    const key = text.toLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    out.push(text);
  });

  return out.slice(0, limit || 8);
}

function extractMainFlow(result) {
  const steps = Array.isArray(result && result.steps) ? result.steps : [];
  const fromSteps = steps.map((step) => {
    return step && (
      step.displayTitle ||
      step.title ||
      step.label ||
      step.kind ||
      step.explain ||
      step.displayExplain
    );
  });

  const fallback = [
    result && result.flowSummary,
    result && result.summary
  ];

  return uniqueStrings(fromSteps.concat(fallback), 8);
}

function extractWarnings(result) {
  const warnings = Array.isArray(result && result.warnings) ? result.warnings : [];

  return warnings.map((warning) => {
    if (typeof warning === "string") return cleanText(warning);
    return cleanText([
      warning && warning.title,
      warning && warning.risk,
      warning && warning.explain
    ].filter(Boolean).join(" - "));
  }).filter(Boolean).slice(0, 6);
}

function buildBeginnerFocus(source, result, language) {
  const text = String(source || "");
  const focus = [];

  if (/JSON\.parse\s*\(/.test(text)) {
    focus.push("JSON.parse는 JSON 문자열을 JavaScript 객체로 바꾸는 핵심 부분입니다.");
    focus.push("파싱 전 값은 문자열이고, 파싱 후 값은 객체처럼 속성에 접근할 수 있습니다.");
  }

  if (/addEventListener\s*\(/.test(text)) {
    focus.push("addEventListener는 버튼 클릭 같은 이벤트가 발생했을 때 실행할 함수를 연결합니다.");
  }

  if (/document\.getElementById|querySelector/.test(text)) {
    focus.push("document.getElementById/querySelector는 HTML 화면에서 특정 요소를 찾는 코드입니다.");
  }

  if (/localStorage/.test(text)) {
    focus.push("localStorage는 브라우저에 설정값을 저장하거나 다시 읽을 때 사용합니다.");
  }

  if (/^\s*def\s+\w+\s*\(/m.test(text)) {
    focus.push("def는 Python에서 함수를 만드는 문법입니다. 함수 이름과 매개변수부터 보면 됩니다.");
  }

  if (/^\s*with\s+open\s*\(/m.test(text)) {
    focus.push("with open은 파일을 열고, 작업이 끝나면 자동으로 닫아주는 Python 파일 처리 패턴입니다.");
  }

  if (!focus.length && result && result.summary) {
    focus.push(cleanText(result.summary).slice(0, 220));
  }

  if (!focus.length) {
    focus.push("먼저 전체 목적을 보고, 그다음 함수/조건/반복/출력 흐름 순서로 읽으면 됩니다.");
  }

  return uniqueStrings(focus, 5);
}

function buildNextChecks(source, language) {
  const text = String(source || "");
  const checks = [];

  if (/node|javascript|js/i.test(language) || /function|const|let|addEventListener|JSON\.parse/.test(text)) {
    checks.push("적용 후 JavaScript 파일이면 node --check <파일경로>로 문법을 확인하세요.");
  }

  if (/python/i.test(language) || /^\s*def\s+\w+\s*\(/m.test(text) || /^\s*with\s+open\s*\(/m.test(text)) {
    checks.push("Python 파일이면 python -m py_compile <파일경로> 또는 실제 실행 명령으로 확인하세요.");
  }

  if (/document\.getElementById|querySelector|addEventListener/.test(text)) {
    checks.push("HTML id/class 이름과 JavaScript selector가 실제로 일치하는지 확인하세요.");
  }

  if (/APP_VERSION|APP_DATA_VERSION|runtimeVersion|version/i.test(text)) {
    checks.push("버전 문자열을 바꾸는 코드라면 index.html, src/pwa/index.html, app.js 기준을 함께 확인하세요.");
  }

  checks.push("적용 전후 git status --short와 git diff --stat로 변경 범위를 확인하세요.");

  return uniqueStrings(checks, 6);
}

function buildProofyMessage(source, result, language, beginnerFocus) {
  const text = String(source || "");
  const lang = String(language || (result && result.language) || "").toLowerCase();

  if (/JSON\.parse\s*\(/.test(text)) {
    return "이 코드는 JSON 문자열을 실제 JavaScript 객체로 바꾸는 흐름이야. 핵심은 JSON.parse 앞뒤로 값의 형태가 달라진다는 점이야!";
  }

  if (/addEventListener\s*\(/.test(text)) {
    return "이 코드는 화면에서 어떤 일이 일어났을 때 실행할 함수를 연결하는 부분이야. 버튼 → 이벤트 → 함수 실행 순서로 보면 쉬워!";
  }

  if (/with\s+open\s*\(/.test(text)) {
    return "이 Python 코드는 파일을 안전하게 열고 처리하는 패턴이야. with 블록 안에서 파일을 읽거나 쓰는 흐름을 보면 돼!";
  }

  const focus = beginnerFocus && beginnerFocus[0];
  if (focus) return "먼저 이것부터 보면 돼: " + focus;

  if (lang) {
    return "이 코드는 " + lang + " 코드로 보입니다. 전체 목적 → 주요 함수 → 실행 흐름 순서로 읽으면 쉬워요.";
  }

  return "이 코드는 전체 목적을 먼저 잡고, 그다음 주요 줄을 순서대로 보면 이해하기 쉬워요.";
}

function compactAnalyzeCode(source, requestedLanguage, mode) {
  const analyzer = loadCodeAnalyzer();
  const result = analyzer.analyze(source, requestedLanguage || "auto") || {};
  const language = result.language || result.detectedLanguage || requestedLanguage || "unknown";
  const mainFlow = extractMainFlow(result);
  const warnings = extractWarnings(result);
  const beginnerFocus = buildBeginnerFocus(source, result, language);
  const nextChecks = buildNextChecks(source, language);
  const proofyMessage = buildProofyMessage(source, result, language, beginnerFocus);

  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    kind: "code",
    mode: mode || "long_code_understanding",
    language,
    sourceMeta: {
      characters: String(source || "").length,
      lines: lineCount(source)
    },
    summary: cleanText(result.summary || result.title || result.flowSummary || mainFlow[0] || "코드 분석 결과입니다."),
    flowSummary: result.flowSummary || null,
    mainFlow,
    beginnerFocus,
    warnings,
    nextChecks,
    proofyMessage,
    proofyMood: warnings.length ? "warning" : "thinking",
    detail: {
      analyzerPath: path.relative(ROOT, analyzer.rulesPath),
      stepCount: Array.isArray(result.steps) ? result.steps.length : 0,
      warningCount: warnings.length,
      originalInputPersisted: false
    }
  };
}

function buildProofyExplainPayload(source, requestedLanguage, mode) {
  const analysis = compactAnalyzeCode(source, requestedLanguage, mode || "proofy_explain");

  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    kind: "proofy_explain",
    route: "POST /proofy/explain",
    proofy: {
      name: "Proofy",
      message: analysis.proofyMessage,
      mood: analysis.proofyMood,
      beginnerFocus: analysis.beginnerFocus,
      mainFlow: analysis.mainFlow,
      warnings: analysis.warnings,
      nextChecks: analysis.nextChecks
    },
    analysis: {
      kind: analysis.kind,
      mode: analysis.mode,
      language: analysis.language,
      sourceMeta: analysis.sourceMeta,
      summary: analysis.summary,
      flowSummary: analysis.flowSummary,
      detail: analysis.detail
    },
    privacy: {
      localhostOnly: host === "127.0.0.1" || host === "localhost",
      externalApiUsed: false,
      originalInputPersisted: false
    }
  };
}

async function handleProofyExplain(req, res) {
  const body = await readJsonBody(req);
  const source = body.source || body.code || body.text || "";
  const language = body.language || body.requestedLanguage || "auto";
  const mode = body.mode || "proofy_explain";

  if (!String(source).trim()) {
    sendJson(req, res, 400, {
      ok: false,
      service: SERVICE,
      version: VERSION,
      error: "missing_source",
      message: "POST /proofy/explain requires a non-empty source, code, or text field."
    });
    return;
  }

  const payload = buildProofyExplainPayload(String(source), String(language), String(mode));
  sendJson(req, res, 200, payload);
}

async function handleAnalyzePythonStructure(req, res) {
  const body = await readJsonBody(req);
  const source = body.source || body.code || body.text || "";
  const language = body.language || body.requestedLanguage || "auto";
  const sourceName = body.sourceName || body.source_name || "<memory>.py";

  if (!String(source).trim()) {
    sendJson(req, res, 400, {
      ok: false,
      service: SERVICE,
      version: VERSION,
      error: "missing_source",
      message: "POST /analyze-python-structure requires a non-empty source, code, or text field."
    });
    return;
  }

  const payload = await buildPythonStructurePayload(
    String(source),
    String(language),
    String(sourceName)
  );
  sendJson(req, res, 200, payload);
}

async function handleAnalyzeCode(req, res) {
  const body = await readJsonBody(req);
  const source = body.source || body.code || body.text || "";
  const language = body.language || body.requestedLanguage || "auto";
  const mode = body.mode || "long_code_understanding";

  if (!String(source).trim()) {
    sendJson(req, res, 400, {
      ok: false,
      service: SERVICE,
      version: VERSION,
      error: "missing_source",
      message: "POST /analyze-code requires a non-empty source, code, or text field."
    });
    return;
  }

  const payload = compactAnalyzeCode(String(source), String(language), String(mode));
  sendJson(req, res, 200, payload);
}

async function handleRequest(req, res) {
  const url = new URL(req.url || "/", "http://" + (req.headers.host || host + ":" + port));

  if (req.method === "OPTIONS") {
    setCommonHeaders(req, res, 204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(req, res, 200, getHealthPayload());
    return;
  }

  if (req.method === "POST" && url.pathname === "/analyze-code") {
    await handleAnalyzeCode(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/analyze-python-structure") {
    await handleAnalyzePythonStructure(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/proofy/explain") {
    await handleProofyExplain(req, res);
    return;
  }

  sendJson(req, res, 404, {
    ok: false,
    service: SERVICE,
    version: VERSION,
    error: "not_found",
    method: req.method,
    path: url.pathname,
    availableEndpoints: [
      "GET /health",
      "POST /analyze-code",
      "POST /analyze-python-structure",
      "POST /proofy/explain"
    ]
  });
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    const statusCode = error && error.statusCode ? error.statusCode : 500;
    sendJson(req, res, statusCode, {
      ok: false,
      service: SERVICE,
      version: VERSION,
      error: error && error.message ? error.message : "internal_server_error"
    });
  });
});

server.on("error", (error) => {
  console.error(JSON.stringify({
    ok: false,
    service: SERVICE,
    version: VERSION,
    error: "server_error",
    code: error.code || null,
    message: error.message
  }, null, 2));
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(JSON.stringify({
    ok: true,
    service: SERVICE,
    version: VERSION,
    listening: "http://" + host + ":" + port,
    endpoints: [
      "http://" + host + ":" + port + "/health",
      "http://" + host + ":" + port + "/analyze-code",
      "http://" + host + ":" + port + "/analyze-python-structure",
      "http://" + host + ":" + port + "/proofy/explain"
    ]
  }, null, 2));
});

function shutdown(signal) {
  console.log(JSON.stringify({
    ok: true,
    service: SERVICE,
    version: VERSION,
    event: "shutdown",
    signal
  }, null, 2));

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

