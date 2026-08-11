(function() {
  "use strict";

  const VERSION = "v0.1";
  const BROWSER_MODE = "b3_v0.1";
  const ENDPOINT = "http://127.0.0.1:3377/render-python-execution";
  const STRUCTURE_EVENT = "python-reading-structure-ready";
  const TIMEOUT_MS = 18000;
  const STRUCTURE_SETTLE_MS = 3200;
  const ARCHIFY_ID_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

  let requestSerial = 0;
  let analysisSerial = 0;
  let activeController = null;
  let settleTimer = null;
  let bound = false;
  let state = {
    status: "idle",
    usable: false,
    payload: null,
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

  function unique(values) {
    return Array.from(new Set(values));
  }

  function clearChildren(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function ensureStyles() {
    if (byId("pythonExecutionLensStyle") || !document.createElement) return;
    const style = document.createElement("style");
    style.id = "pythonExecutionLensStyle";
    style.textContent = [
      ".python-execution-lens-card{grid-column:1/-1;min-width:0}",
      ".python-execution-lens-card[hidden]{display:none!important}",
      ".python-execution-lens-body{min-width:0;border:1px solid rgba(127,127,127,.25);border-radius:12px;overflow:hidden;background:var(--panel-bg,#fff)}",
      ".python-execution-lens-placeholder{padding:18px;line-height:1.55}",
      ".python-execution-lens-frame{display:block;width:100%;height:520px;border:0;background:#fff}",
      ".python-execution-lens-hint{margin:.35rem 0 .8rem;line-height:1.5}",
      ".python-execution-lens-status[data-status=ready]{font-weight:700}",
      ".python-execution-lens-status[data-status=fallback],.python-execution-lens-status[data-status=conflict]{font-weight:700}",
      "@media (max-width:760px){.python-execution-lens-frame{height:440px}.python-execution-lens-placeholder{padding:14px}}"
    ].join("");
    const target = document.head || document.body;
    if (target) target.appendChild(style);
  }

  function ensurePanel() {
    const existing = byId("pythonExecutionLensCard");
    if (existing) return existing;

    const mermaid = byId("mermaidDiagram");
    if (!mermaid || !mermaid.parentNode || !mermaid.parentNode.parentNode || !document.createElement) {
      return null;
    }

    ensureStyles();

    const mermaidCard = mermaid.parentNode;
    const parent = mermaidCard.parentNode;
    const card = document.createElement("div");
    card.id = "pythonExecutionLensCard";
    card.className = "diagram-card python-execution-lens-card";
    card.setAttribute("data-python-execution-lens", VERSION);
    card.hidden = true;

    const row = document.createElement("div");
    row.className = "status-row";

    const heading = document.createElement("h2");
    heading.textContent = text("실행 흐름 — Archify", "Execution flow — Archify");

    const status = document.createElement("span");
    status.id = "pythonExecutionLensStatus";
    status.className = "muted python-execution-lens-status";
    status.setAttribute("data-status", "idle");
    status.textContent = text("Python 분석 후 표시됩니다.", "Shown after Python analysis.");

    row.appendChild(heading);
    row.appendChild(status);

    const hint = document.createElement("p");
    hint.className = "code-diagram-hint python-execution-lens-hint";
    hint.textContent = text(
      "Python AST를 구조 기준으로 사용한 실행 흐름입니다. 브라우저에서 직접 렌더링하며, 불가능한 환경에서는 로컬 Archify 또는 기존 Mermaid로 안전하게 전환합니다.",
      "Execution flow projected from Python AST authority. It renders in the browser first, with safe local Archify or Mermaid fallback when needed."
    );

    const body = document.createElement("div");
    body.id = "pythonExecutionLensBody";
    body.className = "python-execution-lens-body";

    card.appendChild(row);
    card.appendChild(hint);
    card.appendChild(body);

    if (typeof parent.insertBefore === "function") {
      parent.insertBefore(card, mermaidCard);
    } else {
      parent.appendChild(card);
    }

    renderPlaceholder(
      text("Python 코드를 분석하면 실행 흐름을 표시합니다.", "Analyze Python code to show its execution flow."),
      "idle",
      true
    );
    return card;
  }

  function setStatus(kind, message) {
    const status = byId("pythonExecutionLensStatus");
    if (!status) return;
    status.setAttribute("data-status", kind);
    status.textContent = message || "";
  }

  function renderPlaceholder(message, kind, keepHidden) {
    const card = ensurePanel();
    const body = byId("pythonExecutionLensBody");
    if (!card || !body) return;

    clearChildren(body);
    const placeholder = document.createElement("div");
    placeholder.className = "python-execution-lens-placeholder muted";
    placeholder.textContent = message || "";
    body.appendChild(placeholder);
    card.hidden = Boolean(keepHidden);
    setStatus(kind || "idle", message || "");
  }

  function hidePanel() {
    const card = ensurePanel();
    if (card) card.hidden = true;
  }

  function resetState(status) {
    state = {
      status: status || "idle",
      usable: false,
      payload: null,
      error: null,
      runtime: null
    };
  }

  function cancelActiveRender() {
    requestSerial += 1;
    if (activeController) {
      try { activeController.abort(); } catch (_) {}
      activeController = null;
    }
  }

  function clearSettleTimer() {
    if (settleTimer !== null) {
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  function validateStructureResult(payload) {
    if (!payload || payload.ok !== true || payload.kind !== "python_structure_reconciliation" || payload.language !== "python") {
      return { ok: false, reason: "invalid_structure_payload" };
    }
    const authority = payload.authority || {};
    if (
      authority.canonical_structure !== "python_ast" ||
      authority.rule_only_auto_registration !== false ||
      authority.conflict_auto_registration !== false
    ) {
      return { ok: false, reason: "structure_authority_contract_failed" };
    }
    const conflicts = Number((payload.summary || {}).conflict || 0);
    if (!Number.isFinite(conflicts) || conflicts !== 0) {
      return { ok: false, reason: "semantic_conflict" };
    }
    const projection = Array.isArray(payload.executionProjectionNodeIds)
      ? payload.executionProjectionNodeIds.map(String)
      : [];
    if (!projection.length || projection.length !== unique(projection).length) {
      return { ok: false, reason: "invalid_structure_projection" };
    }
    return { ok: true, projection: projection };
  }

  function validateRenderPayload(payload, structurePayload) {
    const structureValidation = validateStructureResult(structurePayload);
    if (!structureValidation.ok) return structureValidation;

    if (!payload || payload.ok !== true || payload.kind !== "python_archify_execution" || payload.renderer !== "archify") {
      return { ok: false, reason: "invalid_render_payload" };
    }
    if (payload.quality !== "standard") {
      return { ok: false, reason: "wrong_render_quality" };
    }
    const authority = payload.authority || {};
    if (authority.canonical_structure !== "python_ast") {
      return { ok: false, reason: "render_authority_contract_failed" };
    }
    if (Number((payload.summary || {}).conflict || 0) !== 0) {
      return { ok: false, reason: "render_conflict" };
    }

    const projection = Array.isArray(payload.executionProjectionNodeIds)
      ? payload.executionProjectionNodeIds.map(String)
      : [];
    if (
      projection.length !== structureValidation.projection.length ||
      projection.some(function(id, index) { return id !== structureValidation.projection[index]; })
    ) {
      return { ok: false, reason: "render_projection_mismatch" };
    }

    const sourceIds = Array.isArray(payload.workflowSourceNodeIds)
      ? payload.workflowSourceNodeIds.map(String)
      : [];
    const projectionSet = new Set(projection);
    if (!sourceIds.length || sourceIds.length !== unique(sourceIds).length) {
      return { ok: false, reason: "invalid_workflow_source_ids" };
    }
    if (sourceIds.some(function(id) { return !projectionSet.has(id); })) {
      return { ok: false, reason: "noncanonical_workflow_source_id" };
    }

    const idMap = Array.isArray(payload.workflowIdMap) ? payload.workflowIdMap : [];
    if (idMap.length !== sourceIds.length) {
      return { ok: false, reason: "workflow_id_map_count_mismatch" };
    }
    const mappedCanonical = [];
    const mappedArchify = [];
    for (let index = 0; index < idMap.length; index += 1) {
      const item = idMap[index] || {};
      const canonical = String(item.canonicalNodeId || "");
      const archify = String(item.archifyNodeId || "");
      if (!canonical || !ARCHIFY_ID_RE.test(archify)) {
        return { ok: false, reason: "invalid_workflow_id_map" };
      }
      if (canonical !== sourceIds[index]) {
        return { ok: false, reason: "workflow_id_map_order_mismatch" };
      }
      mappedCanonical.push(canonical);
      mappedArchify.push(archify);
    }
    if (
      mappedCanonical.length !== unique(mappedCanonical).length ||
      mappedArchify.length !== unique(mappedArchify).length
    ) {
      return { ok: false, reason: "workflow_id_map_duplicate" };
    }

    const workflow = payload.workflow || {};
    const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
    const nodeIds = nodes.map(function(item) { return String(item && item.id || ""); });
    if (
      nodeIds.length !== mappedArchify.length ||
      nodeIds.some(function(id, index) { return id !== mappedArchify[index] || !ARCHIFY_ID_RE.test(id); })
    ) {
      return { ok: false, reason: "workflow_node_map_mismatch" };
    }

    const edges = Array.isArray(workflow.edges) ? workflow.edges : [];
    const nodeIdSet = new Set(nodeIds);
    for (const edge of edges) {
      const edgeId = String(edge && edge.id || "");
      const from = String(edge && edge.from || "");
      const to = String(edge && edge.to || "");
      if (!ARCHIFY_ID_RE.test(edgeId) || !nodeIdSet.has(from) || !nodeIdSet.has(to)) {
        return { ok: false, reason: "workflow_edge_contract_failed" };
      }
    }

    const collapsed = Array.isArray(payload.collapsedAuxiliaryNodeIds)
      ? payload.collapsedAuxiliaryNodeIds.map(String)
      : [];
    if (collapsed.length !== unique(collapsed).length) {
      return { ok: false, reason: "duplicate_collapsed_auxiliary" };
    }
    if (collapsed.some(function(id) { return projectionSet.has(id) || sourceIds.includes(id); })) {
      return { ok: false, reason: "collapsed_auxiliary_leak" };
    }

    const artifact = payload.artifact || {};
    const html = typeof artifact.html === "string" ? artifact.html : "";
    if (!html || !/<svg\b/i.test(html) || Number(artifact.bytes || 0) <= 0 || artifact.containsSvg !== true) {
      return { ok: false, reason: "invalid_archify_artifact" };
    }

    const privacy = payload.privacy || {};
    if (
      privacy.externalApiUsed !== false ||
      privacy.originalSourcePersisted !== false ||
      privacy.temporaryFilesPersisted !== false
    ) {
      return { ok: false, reason: "render_privacy_contract_failed" };
    }

    return {
      ok: true,
      sourceIds: sourceIds,
      archifyIds: nodeIds,
      collapsed: collapsed,
      html: html
    };
  }

  function fallbackMessage(reason) {
    if (reason === "semantic_conflict") {
      return text(
        "구조 해석 충돌이 있어 Archify 실행 흐름은 표시하지 않습니다. 기존 Mermaid 분석을 사용하세요.",
        "A structural interpretation conflict blocks the Archify execution view. Use the existing Mermaid analysis."
      );
    }
    if (reason === "render_not_supported") {
      return text(
        "이 코드 범위는 현재 Archify 실행 흐름으로 표시할 수 없어 기존 Mermaid 분석을 유지합니다.",
        "This code scope cannot currently be rendered as an Archify execution flow; keeping the existing Mermaid analysis."
      );
    }
    return text(
      "브라우저와 로컬 Archify 렌더링을 사용할 수 없어 기존 Mermaid 분석을 유지합니다.",
      "Browser and local Archify rendering are unavailable; keeping the existing Mermaid analysis."
    );
  }

  function setFallback(reason) {
    state = {
      status: reason === "semantic_conflict" ? "conflict" : "fallback",
      usable: false,
      payload: null,
      error: reason || "fallback",
      runtime: null
    };
    renderPlaceholder(
      fallbackMessage(reason),
      state.status,
      false
    );
  }

  function renderReady(payload, validation, runtime) {
    const card = ensurePanel();
    const body = byId("pythonExecutionLensBody");
    if (!card || !body) {
      setFallback("panel_unavailable");
      return;
    }

    clearChildren(body);
    const frame = document.createElement("iframe");
    frame.id = "pythonExecutionArchifyFrame";
    frame.className = "python-execution-lens-frame";
    frame.setAttribute("sandbox", "");
    frame.setAttribute("title", text("Python 실행 흐름 Archify", "Python execution flow Archify"));
    frame.setAttribute("loading", "eager");
    frame.srcdoc = validation.html;
    body.appendChild(frame);
    card.hidden = false;

    state = {
      status: "ready",
      usable: true,
      payload: payload,
      error: null,
      runtime: runtime || payload.rendererRuntime || "local"
    };

    const runtimeLabel = state.runtime === "browser"
      ? text("브라우저", "browser")
      : text("로컬", "local");
    setStatus(
      "ready",
      text(
        "AST 기준 · Archify · " + runtimeLabel + " · " + validation.sourceIds.length + "개 실행 노드",
        "AST authority · Archify · " + runtimeLabel + " · " + validation.sourceIds.length + " execution nodes"
      )
    );
  }

  function sourceStillCurrent(serial, sourceSnapshot) {
    if (serial !== requestSerial) return false;
    const currentInput = byId("codeInput");
    return !currentInput || String(currentInput.value || "") === sourceSnapshot;
  }

  async function tryBrowserRender(structurePayload, serial, sourceSnapshot) {
    const runtime = window.PythonBrowserRuntime;
    const renderer = window.PythonArchifyBrowserRenderer;
    if (
      !runtime || typeof runtime.project !== "function" ||
      !renderer || typeof renderer.render !== "function"
    ) {
      return { handled: false, reason: "browser_renderer_unavailable" };
    }

    renderPlaceholder(
      text(
        "브라우저에서 AST 구조를 Archify 실행 흐름으로 렌더링하는 중…",
        "Rendering the AST structure as an Archify execution flow in the browser…"
      ),
      "rendering",
      false
    );

    try {
      const locale = isEnglish() ? "en" : "ko";
      const projection = await runtime.project(structurePayload, locale);
      if (!sourceStillCurrent(serial, sourceSnapshot)) return { handled: true, stale: true };
      const payload = await renderer.render(projection, structurePayload, locale);
      if (!sourceStillCurrent(serial, sourceSnapshot)) return { handled: true, stale: true };

      const validation = validateRenderPayload(payload, structurePayload);
      if (!validation.ok) {
        return { handled: false, reason: "invalid_browser_render:" + validation.reason };
      }
      renderReady(payload, validation, "browser");
      return { handled: true, payload: payload };
    } catch (error) {
      if (!sourceStillCurrent(serial, sourceSnapshot)) return { handled: true, stale: true };
      return {
        handled: false,
        reason: "browser_render_failed",
        error: error
      };
    }
  }

  async function requestLocalRender(structurePayload, raw, requestedLanguage, sourceName, serial, sourceSnapshot) {
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    activeController = controller;

    renderPlaceholder(
      text(
        "브라우저 렌더링을 사용할 수 없어 로컬 Archify로 다시 시도하는 중…",
        "Browser rendering is unavailable; retrying with local Archify…"
      ),
      "rendering",
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
          language: structurePayload.language || requestedLanguage || "python",
          sourceName: String(sourceName || "pwa_input.py"),
          locale: isEnglish() ? "en" : "ko"
        }),
        signal: controller ? controller.signal : undefined
      });

      if (!sourceStillCurrent(serial, sourceSnapshot)) return null;

      if (!response.ok) {
        let errorCode = "";
        try {
          const errorPayload = await response.json();
          errorCode = String(errorPayload && errorPayload.error || "");
        } catch (_) {}

        if (response.status === 422) {
          setFallback("render_not_supported");
        } else if (response.status === 503 || /runtime_unavailable|checker_unavailable/.test(errorCode)) {
          setFallback("renderer_unavailable");
        } else {
          setFallback("render_http_" + response.status);
        }
        return null;
      }

      const payload = await response.json();
      if (!sourceStillCurrent(serial, sourceSnapshot)) return null;
      const validation = validateRenderPayload(payload, structurePayload);
      if (!validation.ok) {
        setFallback("invalid_render_payload:" + validation.reason);
        return null;
      }

      renderReady(payload, validation, "local");
      return payload;
    } catch (error) {
      if (!sourceStillCurrent(serial, sourceSnapshot)) return null;
      const reason = error && error.name === "AbortError"
        ? "render_timeout_or_abort"
        : "renderer_unavailable";
      setFallback(reason);
      return null;
    } finally {
      if (timer !== null) window.clearTimeout(timer);
      if (activeController === controller) activeController = null;
    }
  }

  async function requestRender(structurePayload, source, requestedLanguage, sourceName) {
    const structureValidation = validateStructureResult(structurePayload);
    if (!structureValidation.ok) {
      setFallback(structureValidation.reason);
      return null;
    }

    const raw = String(source || "");
    if (!raw.trim()) {
      reset();
      return null;
    }

    cancelActiveRender();
    clearSettleTimer();
    const serial = requestSerial;
    const sourceSnapshot = raw;

    const card = ensurePanel();
    if (card) card.hidden = false;
    state = {
      status: "rendering",
      usable: false,
      payload: null,
      error: null,
      runtime: null
    };

    const browser = await tryBrowserRender(structurePayload, serial, sourceSnapshot);
    if (!sourceStillCurrent(serial, sourceSnapshot)) return null;
    if (browser.handled) return browser.payload || null;

    return requestLocalRender(
      structurePayload,
      raw,
      requestedLanguage,
      sourceName,
      serial,
      sourceSnapshot
    );
  }

  function currentSourceContext() {
    const input = byId("codeInput");
    const select = byId("codeLangSelect");
    return {
      source: input ? String(input.value || "") : "",
      requestedLanguage: select ? String(select.value || "auto").toLowerCase() : "auto"
    };
  }

  function handleStructureReady() {
    const bridge = window.PythonReadingStructureBridge;
    const structurePayload = bridge && typeof bridge.getUsableResult === "function"
      ? bridge.getUsableResult()
      : null;
    const validation = validateStructureResult(structurePayload);
    if (!validation.ok) {
      setFallback(validation.reason);
      return Promise.resolve(null);
    }

    const context = currentSourceContext();
    if (!context.source.trim()) {
      reset();
      return Promise.resolve(null);
    }
    if (context.requestedLanguage !== "python" && context.requestedLanguage !== "auto") {
      hidePanel();
      resetState("skipped");
      return Promise.resolve(null);
    }

    return requestRender(
      structurePayload,
      context.source,
      context.requestedLanguage,
      "pwa_input.py"
    );
  }

  function syncFromStructureState(expectedAnalysisSerial) {
    if (expectedAnalysisSerial !== undefined && expectedAnalysisSerial !== analysisSerial) return;

    const bridge = window.PythonReadingStructureBridge;
    const bridgeState = bridge && typeof bridge.getState === "function"
      ? bridge.getState()
      : null;

    if (!bridgeState) {
      setFallback("structure_bridge_unavailable");
      return;
    }
    if (bridgeState.status === "ready" && bridgeState.usable === true) {
      handleStructureReady();
      return;
    }
    if (bridgeState.status === "conflict") {
      setFallback("semantic_conflict");
      return;
    }
    if (bridgeState.status === "fallback") {
      setFallback("structure_endpoint_unavailable");
      return;
    }
    if (bridgeState.status === "skipped") {
      hidePanel();
      resetState("skipped");
      return;
    }
    setFallback("structure_not_ready");
  }

  function handleAnalyzeClick() {
    analysisSerial += 1;
    const serial = analysisSerial;
    cancelActiveRender();
    clearSettleTimer();

    const context = currentSourceContext();
    if (!context.source.trim()) {
      reset();
      return;
    }
    if (context.requestedLanguage !== "python" && context.requestedLanguage !== "auto") {
      hidePanel();
      resetState("skipped");
      return;
    }

    const card = ensurePanel();
    if (card) card.hidden = false;
    renderPlaceholder(
      text("Python 구조 교차검증 결과를 기다리는 중…", "Waiting for the Python structure cross-check…"),
      "checking",
      false
    );
    state = {
      status: "checking",
      usable: false,
      payload: null,
      error: null,
      runtime: null
    };

    settleTimer = window.setTimeout(function() {
      settleTimer = null;
      syncFromStructureState(serial);
    }, STRUCTURE_SETTLE_MS);
  }

  function reset() {
    analysisSerial += 1;
    cancelActiveRender();
    clearSettleTimer();
    resetState("idle");
    renderPlaceholder(
      text("Python 코드를 분석하면 실행 흐름을 표시합니다.", "Analyze Python code to show its execution flow."),
      "idle",
      true
    );
  }

  function bind() {
    if (bound) return;
    bound = true;
    ensurePanel();

    if (typeof window.addEventListener === "function") {
      window.addEventListener(STRUCTURE_EVENT, function() {
        clearSettleTimer();
        handleStructureReady();
      });
    }

    const analyzeButton = byId("analyzeCodeBtn");
    if (analyzeButton && analyzeButton.dataset.pythonExecutionLensBound !== "true") {
      analyzeButton.dataset.pythonExecutionLensBound = "true";
      analyzeButton.addEventListener("click", handleAnalyzeClick);
    }

    const clearButton = byId("clearCodeBtn");
    if (clearButton && clearButton.dataset.pythonExecutionLensBound !== "true") {
      clearButton.dataset.pythonExecutionLensBound = "true";
      clearButton.addEventListener("click", reset);
    }
  }

  const api = {
    version: VERSION,
    browserMode: BROWSER_MODE,
    endpoint: ENDPOINT,
    preferredRuntime: "browser",
    bind: bind,
    reset: reset,
    requestRender: requestRender,
    validateStructureResult: validateStructureResult,
    validateRenderPayload: validateRenderPayload,
    handleStructureReady: handleStructureReady,
    syncFromStructureState: syncFromStructureState,
    getState: function() {
      return {
        status: state.status,
        usable: state.usable,
        payload: state.payload,
        error: state.error,
        runtime: state.runtime
      };
    }
  };

  window.PythonExecutionLens = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
