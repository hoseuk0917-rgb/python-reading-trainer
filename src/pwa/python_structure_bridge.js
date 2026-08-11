(function() {
  "use strict";

  const VERSION = "v0.1";
  const ENDPOINT = "http://127.0.0.1:3377/analyze-python-structure";
  const TIMEOUT_MS = 2500;

  let requestSerial = 0;
  let activeController = null;
  let state = {
    status: "idle",
    usable: false,
    result: null,
    error: null
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
      error: null
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
      error: reason || "fallback"
    };
    renderStatus(
      "fallback",
      message || text(
        "구조 교차검증: 로컬 AST 분석기를 사용할 수 없어 기존 규칙 분석을 유지합니다.",
        "Structure cross-check: local AST analyzer unavailable; keeping the existing rule analysis."
      ),
      false
    );
  }

  function summarizeReady(payload) {
    const summary = payload.summary || {};
    const agreed = Number(summary.agreed || 0);
    const astOnly = Number(summary.ast_only || 0);
    const quarantined = Number(summary.rule_only || 0) + Number(summary.conflict || 0);

    if (isEnglish()) {
      return "Structure cross-check complete · agreed " + agreed +
        " · AST supplements " + astOnly +
        " · quarantined " + quarantined;
    }
    return "구조 교차검증 완료 · 일치 " + agreed +
      " · AST 보강 " + astOnly +
      " · 격리 " + quarantined;
  }

  function dispatchReady(payload) {
    try {
      if (typeof window.CustomEvent === "function" && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new window.CustomEvent("python-reading-structure-ready", {
          detail: {
            version: VERSION,
            summary: payload.summary || {},
            executionProjectionNodeIds: payload.executionProjectionNodeIds || []
          }
        }));
      }
    } catch (_) {
      // The bridge remains usable even if custom events are unavailable.
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

    const controller = typeof AbortController === "function" ? new AbortController() : null;
    activeController = controller;
    state = {
      status: "checking",
      usable: false,
      result: null,
      error: null
    };
    renderStatus(
      "checking",
      text("구조 교차검증: Python AST와 규칙 분석을 대조하는 중…", "Structure cross-check: comparing Python AST and rule analysis…"),
      false
    );

    let timer = null;
    if (controller) {
      timer = window.setTimeout(function() {
        try { controller.abort(); } catch (_) {}
      }, TIMEOUT_MS);
    }

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

      const validation = validatePayload(payload);
      if (!validation.ok) {
        setFallback("invalid_payload:" + validation.reason);
        return null;
      }

      if (validation.conflictCount > 0) {
        state = {
          status: "conflict",
          usable: false,
          result: payload,
          error: "semantic_conflict"
        };
        renderStatus(
          "conflict",
          text(
            "구조 교차검증에서 해석 충돌이 발견되어 AST 보강을 적용하지 않고 기존 규칙 분석을 유지합니다.",
            "Structure cross-check found a semantic conflict; AST supplementation is disabled and the existing rule analysis is kept."
          ),
          false
        );
        return null;
      }

      state = {
        status: "ready",
        usable: true,
        result: payload,
        error: null
      };
      renderStatus("ready", summarizeReady(payload), false);
      dispatchReady(payload);
      return payload;
    } catch (error) {
      if (serial !== requestSerial) return null;
      const reason = error && error.name === "AbortError" ? "timeout_or_abort" : "local_endpoint_unavailable";
      setFallback(reason);
      return null;
    } finally {
      if (timer !== null) window.clearTimeout(timer);
      if (activeController === controller) activeController = null;
    }
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
    request: request,
    requestFromUi: requestFromUi,
    validatePayload: validatePayload,
    getState: function() {
      return {
        status: state.status,
        usable: state.usable,
        result: state.result,
        error: state.error
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
