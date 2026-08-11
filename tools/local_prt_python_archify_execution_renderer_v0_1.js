"use strict";

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const VERSION = "v0.2";
const MAX_PROCESS_STDOUT_BYTES = 8 * 1024 * 1024;
const MAX_PROCESS_STDERR_BYTES = 256 * 1024;
const MAX_ARTIFACT_BYTES = 8 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 15000;

function fail(message, statusCode, detail) {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  if (detail) error.detail = detail;
  return error;
}

function resolveArchifyRuntime(repoRoot) {
  const archifyRoot = process.env.PRT_ARCHIFY_ROOT || path.join(
    repoRoot,
    ".tmp",
    "archify_poc_v1",
    "archify-v2.13.0"
  );
  const cli = path.join(archifyRoot, "archify", "bin", "archify.mjs");
  const checker = path.join(archifyRoot, "archify", "scripts", "check-render-output.mjs");

  if (!fs.existsSync(cli) || !fs.statSync(cli).isFile()) {
    throw fail("archify_runtime_unavailable", 503, { archifyRoot, cli });
  }
  if (!fs.existsSync(checker) || !fs.statSync(checker).isFile()) {
    throw fail("archify_artifact_checker_unavailable", 503, { archifyRoot, checker });
  }

  return { archifyRoot, cli, checker };
}

function runProcess(command, args, options) {
  const input = options && options.input !== undefined ? String(options.input) : null;
  const cwd = options && options.cwd ? options.cwd : process.cwd();
  const timeoutMs = options && options.timeoutMs ? options.timeoutMs : PROCESS_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;

    function finishError(error) {
      if (settled) return;
      settled = true;
      reject(error);
    }

    function finishOk(value) {
      if (settled) return;
      settled = true;
      resolve(value);
    }

    const child = childProcess.spawn(command, args, {
      cwd,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    const timer = setTimeout(() => {
      try { child.kill(); } catch (_) {}
      finishError(fail("archify_process_timeout", 504, { command, timeoutMs }));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > MAX_PROCESS_STDOUT_BYTES) {
        try { child.kill(); } catch (_) {}
        finishError(fail("archify_process_stdout_too_large", 500));
        return;
      }
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      if (stderrBytes >= MAX_PROCESS_STDERR_BYTES) return;
      stderrBytes += chunk.length;
      stderr += chunk.toString("utf8");
      if (stderr.length > MAX_PROCESS_STDERR_BYTES) {
        stderr = stderr.slice(0, MAX_PROCESS_STDERR_BYTES);
      }
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      if (error && error.code === "ENOENT") {
        finishError(fail("archify_process_command_unavailable", 503, { command }));
        return;
      }
      finishError(fail("archify_process_spawn_failed", 500, { command }));
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (settled) return;
      finishOk({ code, stdout, stderr });
    });

    child.stdin.on("error", () => {
      if (!settled) finishError(fail("archify_process_stdin_failed", 500, { command }));
    });
    child.stdin.end(input === null ? "" : input);
  });
}

function reconciliationEnvelope(structurePayload, locale) {
  return {
    locale,
    output_name: "python_execution_archify.html",
    reconciliation: {
      authority: structurePayload.authority || {},
      summary: structurePayload.summary || {},
      execution_projection_node_ids: structurePayload.executionProjectionNodeIds || [],
      graph_ir: structurePayload.graphIr || {}
    }
  };
}

function assertRenderedWorkflowContract(projected, structurePayload) {
  const canonical = (structurePayload.executionProjectionNodeIds || []).map(String);
  const canonicalSet = new Set(canonical);
  if (canonical.length !== canonicalSet.size) {
    throw fail("canonical_projection_contains_duplicates", 422);
  }

  const workflow = projected && projected.workflow;
  if (!workflow || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
    throw fail("archify_workflow_projection_invalid", 500);
  }

  const nodeIds = workflow.nodes.map((item) => String(item && item.id || ""));
  if (nodeIds.some((value) => !value)) {
    throw fail("archify_workflow_node_id_missing", 500);
  }
  if (nodeIds.length !== new Set(nodeIds).size) {
    throw fail("archify_workflow_node_id_duplicate", 500);
  }
  if (nodeIds.some((value) => !canonicalSet.has(value))) {
    throw fail("archify_workflow_noncanonical_node", 500);
  }

  const collapsedAuxiliaryNodeIds = Array.isArray(projected && projected.collapsed_auxiliary_node_ids)
    ? projected.collapsed_auxiliary_node_ids.map(String)
    : [];
  if (collapsedAuxiliaryNodeIds.length !== new Set(collapsedAuxiliaryNodeIds).size) {
    throw fail("archify_collapsed_auxiliary_duplicate", 500);
  }
  if (collapsedAuxiliaryNodeIds.some((value) => canonicalSet.has(value))) {
    throw fail("archify_collapsed_auxiliary_is_canonical", 500);
  }
  if (collapsedAuxiliaryNodeIds.some((value) => nodeIds.includes(value))) {
    throw fail("archify_collapsed_auxiliary_leaked", 500);
  }

  const edgeIds = workflow.edges.map((item) => String(item && item.id || ""));
  if (edgeIds.some((value) => !value) || edgeIds.length !== new Set(edgeIds).size) {
    throw fail("archify_workflow_edge_id_contract_failed", 500);
  }

  return { workflow, nodeIds, edgeIds, collapsedAuxiliaryNodeIds };
}

async function renderPythonExecution(options) {
  const repoRoot = String(options && options.repoRoot || "");
  const structurePayload = options && options.structurePayload;
  const locale = String(options && options.locale || "ko").toLowerCase();

  if (!repoRoot || !structurePayload || structurePayload.ok !== true) {
    throw fail("python_structure_payload_required", 500);
  }
  if (structurePayload.language !== "python") {
    throw fail("python_source_required", 422);
  }
  if (locale !== "ko" && locale !== "en") {
    throw fail("unsupported_locale", 400);
  }
  if (Number((structurePayload.summary || {}).conflict || 0) !== 0) {
    throw fail("semantic_conflict_blocks_archify", 422);
  }

  const runtime = resolveArchifyRuntime(repoRoot);
  const pythonCommand = process.env.PRT_PYTHON_COMMAND || "python";
  const pythonBridge = path.join(repoRoot, "tools", "python_reading_archify_server_bridge_v0_1.py");
  if (!fs.existsSync(pythonBridge) || !fs.statSync(pythonBridge).isFile()) {
    throw fail("python_archify_projection_bridge_unavailable", 500);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "prt-python-archify-"));
  const workflowPath = path.join(tempRoot, "python_execution.workflow.json");
  const htmlPath = path.join(tempRoot, "python_execution.html");

  try {
    const projectionResult = await runProcess(
      pythonCommand,
      [pythonBridge],
      {
        cwd: repoRoot,
        input: JSON.stringify(reconciliationEnvelope(structurePayload, locale))
      }
    );
    if (projectionResult.code !== 0) {
      throw fail("python_archify_projection_failed", 422, {
        stderr: projectionResult.stderr.slice(0, 4000)
      });
    }

    let projected;
    try {
      projected = JSON.parse(projectionResult.stdout);
    } catch (_) {
      throw fail("python_archify_projection_invalid_json", 500);
    }

    const contract = assertRenderedWorkflowContract(projected, structurePayload);
    fs.writeFileSync(workflowPath, JSON.stringify(contract.workflow, null, 2) + "\n", "utf8");

    const deliveryResult = await runProcess(
      process.execPath,
      [
        runtime.cli,
        "deliver",
        "workflow",
        workflowPath,
        htmlPath,
        "--quality",
        "standard",
        "--json"
      ],
      { cwd: runtime.archifyRoot }
    );
    if (deliveryResult.code !== 0) {
      throw fail("archify_delivery_failed", 422, {
        stdout: deliveryResult.stdout.slice(0, 6000),
        stderr: deliveryResult.stderr.slice(0, 4000)
      });
    }

    const checkerResult = await runProcess(
      process.execPath,
      [runtime.checker, htmlPath],
      { cwd: runtime.archifyRoot }
    );
    if (checkerResult.code !== 0) {
      throw fail("archify_artifact_check_failed", 422, {
        stdout: checkerResult.stdout.slice(0, 6000),
        stderr: checkerResult.stderr.slice(0, 4000)
      });
    }

    const stat = fs.statSync(htmlPath);
    if (stat.size <= 0 || stat.size > MAX_ARTIFACT_BYTES) {
      throw fail("archify_artifact_size_invalid", 500, { bytes: stat.size });
    }

    const artifactHtml = fs.readFileSync(htmlPath, "utf8");
    if (!/<svg\b/i.test(artifactHtml)) {
      throw fail("archify_artifact_svg_missing", 500);
    }

    return {
      ok: true,
      kind: "python_archify_execution",
      renderer: "archify",
      rendererAdapterVersion: VERSION,
      locale,
      quality: "standard",
      sourceMeta: structurePayload.sourceMeta || {},
      authority: structurePayload.authority || {},
      summary: structurePayload.summary || {},
      executionProjectionNodeIds: (structurePayload.executionProjectionNodeIds || []).map(String),
      collapsedAuxiliaryNodeIds: contract.collapsedAuxiliaryNodeIds,
      workflow: contract.workflow,
      artifact: {
        html: artifactHtml,
        bytes: Buffer.byteLength(artifactHtml, "utf8"),
        sha256: crypto.createHash("sha256").update(artifactHtml, "utf8").digest("hex"),
        containsSvg: true
      },
      runtime: {
        archifyRoot: runtime.archifyRoot,
        cli: runtime.cli,
        artifactChecker: runtime.checker
      },
      privacy: {
        externalApiUsed: false,
        originalSourcePersisted: false,
        temporaryFilesPersisted: false
      }
    };
  } finally {
    try {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    } catch (_) {
      // Temporary cleanup is best-effort; no tracked repository files are written.
    }
  }
}

module.exports = {
  VERSION,
  renderPythonExecution,
  resolveArchifyRuntime,
  assertRenderedWorkflowContract
};
