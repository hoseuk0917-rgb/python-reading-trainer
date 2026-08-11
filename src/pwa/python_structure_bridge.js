(function() {
  "use strict";

  const VERSION = "v0.2";
  const ENDPOINT = "http://127.0.0.1:3377/analyze-python-structure";
  const TIMEOUT_MS = 2500;

  let requestSerial = 0;
  let activeController = null;
  let state = {
    status: "idle",
    usable: false,
    result: null,
    error: null,
    runtime: null
  };

  function isEnglish() {
    try {
      return /^en/i.test(document.documentElement.getAttribute("lang") || "");
    } catch (_) {
      return false;
    }
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function byId(id) {
    return typeof document !== "undefined" ? document.getElementById(id) : null;
  }

  function ensureStatusElement() {
    const existing = byId("pythonStructureBridgeStatus");
    if (existing) return existing;

    const anchor = byId("codeFlowAnalysisReport") || byId("codeStructureOverview");
    if (!anchor || !anchor.parentNode || !document.createElement) return null;

    const node = document.createElement("div");
    node.id = "pythonStructureBridgeStatus";
    node.className = "code-flow-analysis-report muted";
    node.setAttribute("data-python-structure-bridge", VERSION);
    node.hidden = true;

    if (anchor.nextSibling) {
      anchor.parentNode.insertBefore(node, anchor.nextSibling);
    } else {
      anchor.parentNode.appendChild(node);
    }
    return node;
  }

  function renderStatus(kind, message, hidden) {
    const node = ensureStatusElement();
    if (!node) return;
    node.dataset.status = kind;
    node.hidden = Boolean(hidden);
    node.textContent = message || "";
  }

  function resetState(status) {
    state = {
      status: status || "idle",
      usable: false,
      result: null,
      error: null,
      runtime: null
    };
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function validatePayload(payload) {
    if (!payload || payload.ok !== true) {
      return { ok: false, reason: "payload_not_ok" };
    }
    if (payload.kind !== "python_structure_reconciliation" || payload.language !== "python") {
      return { ok: false, reason: "wrong_payload_kind" };
    }

    const authority = payload.authority || {};
    if (
      authority.canonical_structure !== "python_ast" ||
      authority.rule_only_auto_registration !== false ||
      authority.conflict_auto_registration !== false
    ) {
      return { ok: false, reason: "authority_contract_failed" };
    }

    const summary = payload.summary || {};
    const canonical = Array.isArray(payload.canonicalFindings) ? payload.canonicalFindings : null;
    const diagnostics = Array.isArray(payload.diagnostics) ? payload.diagnostics : null;
    const projection = Array.isArray(payload.executionProjectionNodeIds)
      ? payload.executionProjectionNodeIds.map(String)
      : null;

    if (!canonical || !diagnostics || !projection) {
      return { ok: false, reason: "missing_reconciliation_collections" };
    }
    if (projection.length !== unique(projection).length) {
      return { ok: false, reason: "duplicate_execution_projection_node_ids" };
    }

    const canonicalNodeIds = [];
    for (const item of canonical) {
      if (!item || item.auto_register !== true) {
        return { ok: false, reason: "canonical_auto_register_contract_failed" };
      }
      if (item.status !== "AGREED" && item.status !== "AST_ONLY") {
        return { ok: false, reason: "canonical_status_contract_failed" };
      }
      const nodeId = item.ast && item.ast.node_id ? String(item.ast.node_id) : "";
      if (!nodeId) {
        return { ok: false, reason: "canonical_ast_node_id_missing" };
      }
      canonicalNodeIds.push(nodeId);
    }

    if (canonicalNodeIds.length !== unique(canonicalNodeIds).length) {
      return { ok: false, reason: "duplicate_canonical_ast_node_ids" };
    }
    if (
      canonicalNodeIds.length !== projection.length ||
      canonicalNodeIds.some(function(id, index) { return id !== projection[index]; })
    ) {
      return { ok: false, reason: "projection_not_canonical_order" };
    }

    for (const item of diagnostics) {
      if (!item || item.auto_register !== false) {
        return { ok: false, reason: "diagnostic_auto_register_contract_failed" };
      }
      if (item.status !== "RULE_ONLY" && item.status !== "CONFLICT") {
        return { ok: false, reason: "diagnostic_status_contract_failed" };
      }
    }

    const canonicalCount = Number(summary.canonical_execution_nodes);
    const conflictCount = Number(summary.conflict || 0);
    if (!Number.isFinite(canonicalCount) || canonicalCount !== canonical.length) {
      return { ok: false, reason: "canonical_count_mismatch" };
    }
    if (!Number.isFinite(conflictCount) || conflictCount < 0) {
      return { ok: false, reason: "invalid_conflict_count" };
    }

    return {
      ok: true,
      conflictCount: conflictCount,
      canonicalCount: canonicalCount
    };
  }

  function setFallback(reason, message) {
    state = {
      status: "fallback",
      usable: false,
      result: null,
      error: reason || "fallback",
      runtime: null
    };
    renderStatus(
      "fallback",
      message || text(
        "구조 교차검증: 브라우저 AST와 로컬 AST를 사용할 수 없어 기존 규칙 분석을 유지합니다.",
        "Structure cross-check: browser and local AST analyzers are unavailable; keeping the existing rule analysis."
      ),
      false
    );
  }

  function summarizeReady(payload, runtime) {
    const summary = payload.summary || {};
    const agreed = Number(summary.agreed || 0);
    const astOnly = Number(summary.ast_only || 0);
    const quarantined = Number(summary.rule_only || 0) + Number(summary.conflict || 0);
    const engine = runtime === "browser"
      ? (isEnglish() ? "browser CPython AST" : "브라우저 CPython AST")
      : (isEnglish() ? "local CPython AST" : "로컬 CPython AST");

    if (isEnglish()) {
      return "Structure cross-check complete · " + engine +
        " · agreed " + agreed +
        " · AST supplements " + astOnly +
        " · quarantined " + quarantined;
    }
    return "구조 교차검증 완료 · " + engine +
      " · 일치 " + agreed +
      " · AST 보강 " + astOnly +
      " · 격리 " + quarantined;
  }

  function dispatchReady(payload, runtime) {
    try {
      if (typeof window.CustomEvent === "function" && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new window.CustomEvent("python-reading-structure-ready", {
          detail: {
            version: VERSION,
            runtime: runtime || null,
            summary: payload.summary || {},
            executionProjectionNodeIds: payload.executionProjectionNodeIds || []
          }
        }));
      }
    } catch (_) {
      // The bridge remains usable even if custom events are unavailable.
    }
  }

  function acceptPayload(payload, runtime) {
    const validation = validatePayload(payload);
    if (!validation.ok) {
      return { accepted: false, reason: "invalid_payload:" + validation.reason };
    }

    if (validation.conflictCount > 0) {
      state = {
        status: "conflict",
        usable: false,
        result: payload,
        error: "semantic_conflict",
        runtime: runtime || null
      };
      renderStatus(
        "conflict",
        text(
          "구조 교차검증에서 해석 충돌이 발견되어 AST 보강을 적용하지 않고 기존 규칙 분석을 유지합니다.",
          "Structure cross-check found a semantic conflict; AST supplementation is disabled and the existing rule analysis is kept."
        ),
        false
      );
      return { accepted: false, conflict: true, reason: "semantic_conflict" };
    }

    state = {
      status: "ready",
      usable: true,
      result: payload,
      error: null,
      runtime: runtime || null
    };
    renderStatus("ready", summarizeReady(payload, runtime), false);
    dispatchReady(payload, runtime);
    return { accepted: true, payload: payload };
  }

  function ruleAnalysisForBrowser(source, requested) {
    const analyzer = window.CodeExplainerRules;
    if (!analyzer || typeof analyzer.analyze !== "function") return null;
    const result = analyzer.analyze(source, requested || "auto") || {};
    const language = String(result.language || result.detectedLanguage || requested || "unknown").toLowerCase();
    return { result: result, language: language };
  }

  async function tryBrowserRequest(raw, requested, sourceName, serial) {
    const runtime = window.PythonBrowserRuntime;
    if (!runtime || typeof runtime.analyze !== "function") {
      return { handled: false, reason: "browser_runtime_unavailable" };
    }

    let analyzed;
    try {
      analyzed = ruleAnalysisForBrowser(raw, requested);
    } catch (error) {
      return { handled: false, reason: "browser_rule_analysis_failed", error: error };
    }
    if (!analyzed) {
      return { handled: false, reason: "browser_rule_analyzer_unavailable" };
    }

    if (analyzed.language !== "python") {
      if (serial !== requestSerial) return { handled: true, stale: true };
      resetState("skipped");
      renderStatus("skipped", "", true);
      return { handled: true, skipped: true };
    }

    renderStatus(
      "checking",
      text(
        "구조 교차검증: 브라우저에서 CPython AST 엔진을 준비하고 분석하는 중…",
        "Structure cross-check: preparing the in-browser CPython AST engine…"
      ),
      false
    );

    try {
      const payload = await runtime.analyze(
        raw,
        analyzed.result,
        requested,
        String(sourceName || "pwa_input.py")
      );
      if (serial !== requestSerial) return { handled: true, stale: true };

      const accepted = acceptPayload(payload, "browser");
      if (accepted.accepted || accepted.conflict) {
        return { handled: true, payload: accepted.payload || null };
      }
      return { handled: false, reason: accepted.reason };
    } catch (error) {
      if (serial !== requestSerial) return { handled: true, stale: true };
      return {
        handled: false,
        reason: "browser_runtime_failed",
        error: error
      };
    }
  }

  async function requestLocal(raw, requested, sourceName, serial) {
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    activeController = controller;
    let timer = null;
    if (controller) {
      timer = window.setTimeout(function() {
        try { controller.abort(); } catch (_) {}
      }, TIMEOUT_MS);
    }

    renderStatus(
      "checking",
      text(
        "브라우저 AST를 사용할 수 없어 로컬 CPython AST로 다시 확인하는 중…",
        "Browser AST is unavailable; retrying with the local CPython AST analyzer…"
      ),
      false
    );

    try {
      const response = await window.fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: raw,
          language: requested,
          sourceName: String(sourceName || "pwa_input.py")
        }),
        signal: controller ? controller.signal : undefined
      });

      if (serial !== requestSerial) return null;

      if (response.status === 422 && requested === "auto") {
        resetState("skipped");
        renderStatus("skipped", "", true);
        return null;
      }
      if (!response.ok) {
        setFallback("http_" + response.status);
        return null;
      }

      const payload = await response.json();
      if (serial !== requestSerial) return null;
      const accepted = acceptPayload(payload, "local");
      if (!accepted.accepted) {
        if (!accepted.conflict) setFallback(accepted.reason);
        return null;
      }
      return payload;
    } catch (error) {
      if (serial !== requestSerial) return null;
      const reason = error && error.name === "AbortError" ? "timeout_or_abort" : "all_ast_runtimes_unavailable";
      setFallback(reason);
      return null;
    } finally {
      if (timer !== null) window.clearTimeout(timer);
      if (activeController === controller) activeController = null;
    }
  }

  async function request(source, requestedLanguage, sourceName) {
    const raw = String(source || "");
    const requested = String(requestedLanguage || "auto").toLowerCase();

    requestSerial += 1;
    const serial = requestSerial;

    if (activeController) {
      try { activeController.abort(); } catch (_) {}
      activeController = null;
    }

    if (!raw.trim()) {
      resetState("idle");
      renderStatus("idle", "", true);
      return null;
    }
    if (requested !== "python" && requested !== "auto") {
      resetState("skipped");
      renderStatus("skipped", "", true);
      return null;
    }

    state = {
      status: "checking",
      usable: false,
      result: null,
      error: null,
      runtime: null
    };
    renderStatus(
      "checking",
      text(
        "구조 교차검증: 브라우저 CPython AST와 규칙 분석을 대조하는 중…",
        "Structure cross-check: comparing browser CPython AST with rule analysis…"
      ),
      false
    );

    const browser = await tryBrowserRequest(raw, requested, sourceName, serial);
    if (serial !== requestSerial) return null;
    if (browser.handled) return browser.payload || null;

    return requestLocal(raw, requested, sourceName, serial);
  }

  function requestFromUi() {
    const input = byId("codeInput");
    const select = byId("codeLangSelect");
    if (!input) return Promise.resolve(null);
    return request(input.value, select ? select.value : "auto", "pwa_input.py");
  }

  function bind() {
    const button = byId("analyzeCodeBtn");
    if (!button || button.dataset.pythonStructureBridgeBound === "true") return;
    button.dataset.pythonStructureBridgeBound = "true";
    button.addEventListener("click", function() {
      const input = byId("codeInput");
      const select = byId("codeLangSelect");
      const source = input ? input.value : "";
      const requested = select ? select.value : "auto";
      window.setTimeout(function() {
        request(source, requested, "pwa_input.py");
      }, 0);
    });
  }

  const api = {
    version: VERSION,
    endpoint: ENDPOINT,
    preferredRuntime: "browser",
    request: request,
    requestFromUi: requestFromUi,
    validatePayload: validatePayload,
    getState: function() {
      return {
        status: state.status,
        usable: state.usable,
        result: state.result,
        error: state.error,
        runtime: state.runtime
      };
    },
    getUsableResult: function() {
      return state.usable ? state.result : null;
    },
    reset: function() {
      requestSerial += 1;
      if (activeController) {
        try { activeController.abort(); } catch (_) {}
        activeController = null;
      }
      resetState("idle");
      renderStatus("idle", "", true);
    },
    bind: bind
  };

  window.PythonReadingStructureBridge = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
