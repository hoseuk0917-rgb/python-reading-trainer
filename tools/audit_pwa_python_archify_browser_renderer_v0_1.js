"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { TextEncoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const RENDERER_PATH = path.join(ROOT, "src", "pwa", "python_archify_browser_renderer.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function structurePayload() {
  return {
    ok: true,
    kind: "python_structure_reconciliation",
    language: "python",
    authority: {
      canonical_structure: "python_ast",
      rule_only_auto_registration: false,
      conflict_auto_registration: false
    },
    summary: { conflict: 0 },
    sourceMeta: { sourceName: "pwa_input.py" },
    executionProjectionNodeIds: ["s001:n003", "s001:n004"]
  };
}

function projectionPayload() {
  return {
    ok: true,
    kind: "python_archify_browser_projection",
    locale: "ko",
    authority: {
      canonical_structure: "python_ast",
      rule_only_auto_registration: false,
      conflict_auto_registration: false
    },
    summary: { conflict: 0 },
    sourceMeta: { sourceName: "pwa_input.py" },
    executionProjectionNodeIds: ["s001:n003", "s001:n004"],
    workflowSourceNodeIds: ["s001:n003", "s001:n004"],
    workflowIdMap: [
      { canonicalNodeId: "s001:n003", archifyNodeId: "s001_n003" },
      { canonicalNodeId: "s001:n004", archifyNodeId: "s001_n004" }
    ],
    collapsedAuxiliaryNodeIds: ["s001:n001", "s001:n002"],
    workflow: {
      schema_version: 1,
      diagram_type: "workflow",
      meta: {
        title: "테스트 실행 흐름",
        subtitle: "Python Reading Graph IR에서 생성된 학습용 실행 흐름",
        visual_preset: "signal-flow",
        quality_profile: "standard"
      },
      lanes: [
        { id: "setup", label: "준비 / 입력" },
        { id: "control", label: "제어 흐름" },
        { id: "process", label: "데이터 처리" },
        { id: "output", label: "결과" }
      ],
      phases: [],
      groups: [],
      nodes: [
        {
          id: "s001_n003",
          lane: "setup",
          col: 0,
          type: "database",
          label: "값 준비",
          sublabel: "value = 1",
          width: 96
        },
        {
          id: "s001_n004",
          lane: "output",
          col: 5,
          type: "frontend",
          label: "결과 출력",
          sublabel: "print(value)",
          width: 96
        }
      ],
      edges: [
        {
          id: "p001",
          from: "s001_n003",
          to: "s001_n004",
          variant: "emphasis",
          route: "outside-right",
          fromSide: "right",
          toSide: "right",
          label: "다음"
        }
      ],
      cards: []
    },
    privacy: {
      browserOnly: true,
      externalApiUsed: false,
      originalSourcePersisted: false,
      temporaryFilesPersisted: false,
      localServerUsed: false
    }
  };
}

async function main() {
  assert(fs.existsSync(RENDERER_PATH), "browser Archify renderer missing");
  const source = fs.readFileSync(RENDERER_PATH, "utf8");

  const document = { documentElement: { lang: "ko" } };
  const window = {
    document,
    crypto: crypto.webcrypto
  };
  const context = vm.createContext({
    window,
    document,
    console,
    Set,
    Map,
    Array,
    Number,
    String,
    Math,
    RegExp,
    Promise,
    TextEncoder
  });
  vm.runInContext(source, context, { filename: "python_archify_browser_renderer.js" });

  const api = window.PythonArchifyBrowserRenderer;
  assert(api && api.version === "v0.1", "browser renderer API missing");
  assert(api.archifySourceVersion === "2.13.0", "Archify source version mismatch");
  console.log("BROWSER_RENDERER_API=PASS");

  const structure = structurePayload();
  const projection = projectionPayload();
  const validation = api.validateProjection(projection, structure);
  assert(validation.ok === true, `valid projection rejected: ${validation.reason}`);
  console.log("VALID_BROWSER_PROJECTION=PASS");

  const payload = await api.render(projection, structure, "ko");
  assert(payload.ok === true, "render payload not ok");
  assert(payload.kind === "python_archify_execution", "render payload kind mismatch");
  assert(payload.renderer === "archify", "renderer identity mismatch");
  assert(payload.rendererRuntime === "browser", "renderer runtime is not browser");
  assert(payload.archifySourceVersion === "2.13.0", "render Archify source version mismatch");
  assert(payload.quality === "standard", "render quality mismatch");
  assert(payload.workflowSourceNodeIds.join("|") === "s001:n003|s001:n004", "canonical source ids drifted");
  assert(payload.workflow.nodes.map((item) => item.id).join("|") === "s001_n003|s001_n004", "renderer aliases drifted");
  assert(payload.privacy.externalApiUsed === false, "external API privacy flag failed");
  assert(payload.privacy.originalSourcePersisted === false, "source persistence flag failed");
  assert(payload.privacy.temporaryFilesPersisted === false, "temporary persistence flag failed");
  assert(payload.privacy.localServerUsed === false, "local server privacy flag failed");
  console.log("LENS_COMPATIBLE_RENDER_PAYLOAD=PASS");

  const html = payload.artifact && payload.artifact.html || "";
  assert((html.match(/<svg\b/gi) || []).length === 1, "artifact must contain exactly one SVG");
  assert(/viewBox="0 0 720 652"/.test(html), "Archify v2.13 four-lane viewBox contract mismatch");
  assert(/data-preset="signal-flow"/.test(html), "signal-flow preset missing");
  assert(/data-quality-profile="standard"/.test(html), "standard quality profile missing");
  assert(/data-node-id="s001_n003"/.test(html) && /data-node-id="s001_n004"/.test(html), "node semantic hooks missing");
  assert(/data-edge-id="p001"/.test(html), "edge semantic hook missing");
  assert(/route|outside-right|bottom-channel/.test(source), "bounded route adapter contract missing");
  console.log("ARCHIFY_WORKFLOW_GEOMETRY=PASS");

  assert(!/<script\b/i.test(html), "artifact unexpectedly contains executable script");
  assert(!/<link\b|<img\b|<iframe\b/i.test(html), "artifact unexpectedly loads external resources");
  assert(!/https?:\/\//i.test(html), "artifact unexpectedly contains network URL");
  assert(/Derived from Archify v2\.13\.0 Workflow geometry; MIT licensed/.test(html), "Archify provenance marker missing");
  console.log("STATIC_SANDBOX_ARTIFACT=PASS");

  const expectedSha = crypto.createHash("sha256").update(html, "utf8").digest("hex");
  assert(payload.artifact.sha256 === expectedSha, "artifact SHA256 mismatch");
  assert(payload.artifact.bytes === Buffer.byteLength(html, "utf8"), "artifact byte count mismatch");
  assert(payload.artifact.containsSvg === true, "artifact SVG flag mismatch");
  console.log("ARTIFACT_INTEGRITY=PASS");

  const bad = projectionPayload();
  bad.workflowSourceNodeIds[1] = "s001:n999";
  assert(api.validateProjection(bad, structure).ok === false, "noncanonical workflow source accepted");

  const badId = projectionPayload();
  badId.workflowIdMap[0].archifyNodeId = "s001:n003";
  assert(api.validateProjection(badId, structure).ok === false, "unsafe renderer id accepted");
  console.log("CANONICAL_AND_ID_GUARDS=PASS");

  assert(!/localStorage|sessionStorage|indexedDB/.test(source), "persistent storage API referenced");
  assert(!/fetch\s*\(|XMLHttpRequest|WebSocket/.test(source), "browser renderer unexpectedly performs network IO");
  console.log("RENDERER_PRIVACY=PASS");

  console.log("RESULT=PASS_PWA_PYTHON_ARCHIFY_BROWSER_RENDERER_V0_1_AUDIT");
}

main().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
