(function() {
  "use strict";

  const VERSION = "v0.1";
  const WORKER_URL = "./python_browser_worker.mjs?v=20260812_b3a1";
  const DEFAULT_TIMEOUT_MS = 30000;

  let worker = null;
  let serial = 0;
  const pending = new Map();
  let state = {
    status: "idle",
    usable: null,
    error: null,
    pyodideVersion: null
  };

  function failAll(reason) {
    const error = reason instanceof Error ? reason : new Error(String(reason || "browser_python_runtime_failed"));
    for (const entry of pending.values()) {
      window.clearTimeout(entry.timer);
      entry.reject(error);
    }
    pending.clear();
  }

  function disposeWorker(reason) {
    if (worker) {
      try { worker.terminate(); } catch (_) {}
      worker = null;
    }
    failAll(reason || new Error("browser_python_worker_disposed"));
  }

  function workerHref() {
    return new URL(WORKER_URL, document.baseURI || window.location.href).href;
  }

  function ensureWorker() {
    if (worker) return worker;
    if (typeof Worker !== "function") {
      throw new Error("module_worker_unavailable");
    }

    state = {
      status: "loading",
      usable: null,
      error: null,
      pyodideVersion: null
    };

    worker = new Worker(workerHref(), {
      type: "module",
      name: "prt-python-browser-runtime"
    });

    worker.addEventListener("message", function(event) {
      const message = event && event.data ? event.data : {};
      const id = String(message.id || "");
      if (!id || !pending.has(id)) return;

      const entry = pending.get(id);
      pending.delete(id);
      window.clearTimeout(entry.timer);

      if (message.ok === true) {
        const runtimeMeta = message.runtimeMeta || {};
        const readyVersion = message.result && message.result.kind === "python_browser_runtime_ready"
          ? message.result.pyodideVersion
          : null;
        const reportedVersion = String(
          runtimeMeta.pyodideVersion || readyVersion || state.pyodideVersion || ""
        );
        state = {
          status: "ready",
          usable: true,
          error: null,
          pyodideVersion: reportedVersion || null
        };
        entry.resolve(message.result);
        return;
      }

      const detail = message.error || {};
      const error = new Error(String(detail.message || "browser_python_worker_failed"));
      error.name = String(detail.name || "BrowserPythonWorkerError");
      error.workerStack = String(detail.stack || "");
      state = {
        status: "error",
        usable: false,
        error: error.message,
        pyodideVersion: state.pyodideVersion
      };
      entry.reject(error);
    });

    worker.addEventListener("error", function(event) {
      const message = event && event.message ? event.message : "browser_python_worker_error";
      state = {
        status: "error",
        usable: false,
        error: String(message),
        pyodideVersion: state.pyodideVersion
      };
      disposeWorker(new Error(String(message)));
    });

    worker.addEventListener("messageerror", function() {
      state = {
        status: "error",
        usable: false,
        error: "browser_python_worker_message_error",
        pyodideVersion: state.pyodideVersion
      };
      disposeWorker(new Error("browser_python_worker_message_error"));
    });

    return worker;
  }

  function call(type, payload, timeoutMs) {
    let target;
    try {
      target = ensureWorker();
    } catch (error) {
      state = {
        status: "error",
        usable: false,
        error: String(error && error.message || error),
        pyodideVersion: null
      };
      return Promise.reject(error);
    }

    serial += 1;
    const id = "prt-browser-python-" + serial;
    const timeout = Number(timeoutMs || DEFAULT_TIMEOUT_MS);

    return new Promise(function(resolve, reject) {
      const timer = window.setTimeout(function() {
        pending.delete(id);
        const error = new Error("browser_python_runtime_timeout");
        state = {
          status: "error",
          usable: false,
          error: error.message,
          pyodideVersion: state.pyodideVersion
        };
        reject(error);
      }, timeout);

      pending.set(id, { resolve: resolve, reject: reject, timer: timer });
      target.postMessage({
        id: id,
        type: String(type || ""),
        payload: payload || {}
      });
    });
  }

  function warmup() {
    return call("warmup", {}, DEFAULT_TIMEOUT_MS);
  }

  function analyze(source, ruleAnalysis, requestedLanguage, sourceName) {
    return call("analyze", {
      source: String(source || ""),
      ruleAnalysis: ruleAnalysis || {},
      requestedLanguage: String(requestedLanguage || "auto"),
      sourceName: String(sourceName || "pwa_input.py")
    }, DEFAULT_TIMEOUT_MS);
  }

  function project(structurePayload, locale) {
    return call("project", {
      structurePayload: structurePayload || {},
      locale: String(locale || "ko")
    }, DEFAULT_TIMEOUT_MS);
  }

  window.PythonBrowserRuntime = {
    version: VERSION,
    workerUrl: WORKER_URL,
    warmup: warmup,
    analyze: analyze,
    project: project,
    dispose: function() {
      disposeWorker(new Error("browser_python_runtime_disposed"));
      state = {
        status: "idle",
        usable: null,
        error: null,
        pyodideVersion: null
      };
    },
    getState: function() {
      return {
        status: state.status,
        usable: state.usable,
        error: state.error,
        pyodideVersion: state.pyodideVersion
      };
    }
  };
})();
