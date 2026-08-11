(function() {
  "use strict";

  // Browser-only bounded adapter for the Archify v2.13.0 Workflow geometry.
  // Archify is MIT licensed: https://github.com/tt-a1i/archify
  // This adapter renders only the already-authored/validated workflow JSON;
  // it does not discover or infer Python semantics.

  const VERSION = "v0.1";
  const ARCHIFY_SOURCE_VERSION = "2.13.0";
  const ARCHIFY_ID_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

  const LAYOUT = {
    laneX: 40,
    laneY: 52,
    laneW: 640,
    laneH: 104,
    laneGap: 20,
    laneTitleH: 30,
    colXs: [88, 220, 300, 430, 500, 625],
    nodeW: 92,
    nodeH: 52
  };

  const COMPONENT_CLASS = {
    frontend: "c-frontend",
    backend: "c-backend",
    database: "c-database",
    cloud: "c-cloud",
    security: "c-security",
    messagebus: "c-messagebus",
    external: "c-external"
  };

  const EDGE_CLASS = {
    default: ["a-default", "arrow-default"],
    emphasis: ["a-emphasis", "arrow-emphasis"],
    dashed: ["a-dashed", "arrow-dashed"],
    security: ["a-security", "arrow-security"]
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function isFullWidth(codePoint) {
    return (
      (codePoint >= 0x1100 && codePoint <= 0x115f) ||
      (codePoint >= 0x2329 && codePoint <= 0x232a) ||
      (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
      (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
      (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
      (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
      (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
      (codePoint >= 0xff01 && codePoint <= 0xff60) ||
      (codePoint >= 0xffe0 && codePoint <= 0xffe6) ||
      (codePoint >= 0x16fe0 && codePoint <= 0x18dff) ||
      (codePoint >= 0x1aff0 && codePoint <= 0x1afff) ||
      (codePoint >= 0x1b000 && codePoint <= 0x1b2ff) ||
      (codePoint >= 0x1f000 && codePoint <= 0x1faff) ||
      (codePoint >= 0x20000 && codePoint <= 0x3fffd)
    );
  }

  function textUnits(value) {
    let total = 0;
    for (const char of String(value || "")) {
      total += isFullWidth(char.codePointAt(0)) ? 2 : 1;
    }
    return total;
  }

  function fittedFontSize(value, width, preferred, minimum) {
    const units = Math.max(1, textUnits(value));
    const available = Math.max(1, Number(width || 0) - 8);
    const fitted = Math.min(preferred, available / (units * 0.6));
    return Math.max(minimum, Math.floor(fitted * 10) / 10);
  }

  function validateProjection(projection, structurePayload) {
    if (!projection || projection.ok !== true || projection.kind !== "python_archify_browser_projection") {
      return { ok: false, reason: "invalid_browser_projection" };
    }
    const authority = projection.authority || {};
    if (
      authority.canonical_structure !== "python_ast" ||
      authority.rule_only_auto_registration !== false ||
      authority.conflict_auto_registration !== false
    ) {
      return { ok: false, reason: "browser_projection_authority_failed" };
    }
    if (Number((projection.summary || {}).conflict || 0) !== 0) {
      return { ok: false, reason: "browser_projection_conflict" };
    }

    const expectedProjection = Array.isArray(structurePayload && structurePayload.executionProjectionNodeIds)
      ? structurePayload.executionProjectionNodeIds.map(String)
      : [];
    const projected = Array.isArray(projection.executionProjectionNodeIds)
      ? projection.executionProjectionNodeIds.map(String)
      : [];
    if (
      !expectedProjection.length ||
      projected.length !== expectedProjection.length ||
      projected.some(function(id, index) { return id !== expectedProjection[index]; })
    ) {
      return { ok: false, reason: "browser_projection_canonical_mismatch" };
    }

    const sourceIds = Array.isArray(projection.workflowSourceNodeIds)
      ? projection.workflowSourceNodeIds.map(String)
      : [];
    const idMap = Array.isArray(projection.workflowIdMap) ? projection.workflowIdMap : [];
    const workflow = projection.workflow || {};
    const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
    const edges = Array.isArray(workflow.edges) ? workflow.edges : [];

    if (!sourceIds.length || sourceIds.length !== unique(sourceIds).length) {
      return { ok: false, reason: "browser_projection_source_ids_invalid" };
    }
    const projectedSet = new Set(projected);
    if (sourceIds.some(function(id) { return !projectedSet.has(id); })) {
      return { ok: false, reason: "browser_projection_noncanonical_node" };
    }
    if (idMap.length !== sourceIds.length || nodes.length !== sourceIds.length) {
      return { ok: false, reason: "browser_projection_count_mismatch" };
    }

    const renderIds = [];
    for (let index = 0; index < idMap.length; index += 1) {
      const item = idMap[index] || {};
      const canonicalId = String(item.canonicalNodeId || "");
      const archifyId = String(item.archifyNodeId || "");
      const nodeId = String(nodes[index] && nodes[index].id || "");
      if (
        canonicalId !== sourceIds[index] ||
        archifyId !== nodeId ||
        !ARCHIFY_ID_RE.test(archifyId)
      ) {
        return { ok: false, reason: "browser_projection_id_map_invalid" };
      }
      renderIds.push(archifyId);
    }
    if (renderIds.length !== unique(renderIds).length) {
      return { ok: false, reason: "browser_projection_render_id_duplicate" };
    }

    const nodeSet = new Set(renderIds);
    for (const edge of edges) {
      const id = String(edge && edge.id || "");
      const from = String(edge && edge.from || "");
      const to = String(edge && edge.to || "");
      if (!ARCHIFY_ID_RE.test(id) || !nodeSet.has(from) || !nodeSet.has(to)) {
        return { ok: false, reason: "browser_projection_edge_invalid" };
      }
    }

    const collapsed = Array.isArray(projection.collapsedAuxiliaryNodeIds)
      ? projection.collapsedAuxiliaryNodeIds.map(String)
      : [];
    if (collapsed.length !== unique(collapsed).length) {
      return { ok: false, reason: "browser_projection_collapsed_duplicate" };
    }
    if (collapsed.some(function(id) { return sourceIds.includes(id); })) {
      return { ok: false, reason: "browser_projection_collapsed_leak" };
    }

    return { ok: true, workflow: workflow, sourceIds: sourceIds, renderIds: renderIds, collapsed: collapsed };
  }

  function laneTop(laneIndex, laneId) {
    const index = laneIndex.get(laneId);
    if (!Number.isInteger(index)) throw new Error("archify_browser_unknown_lane:" + laneId);
    return LAYOUT.laneY + index * (LAYOUT.laneH + LAYOUT.laneGap);
  }

  function measureNodes(workflow, laneIndex) {
    const map = new Map();
    for (const node of workflow.nodes || []) {
      const col = Number(node.col);
      if (!Number.isInteger(col) || col < 0 || col >= LAYOUT.colXs.length) {
        throw new Error("archify_browser_invalid_column:" + String(node.id));
      }
      const width = Number(node.width || LAYOUT.nodeW);
      const height = Number(node.height || (node.tag ? 68 : LAYOUT.nodeH));
      const cx = LAYOUT.colXs[col];
      const contentH = LAYOUT.laneH - LAYOUT.laneTitleH;
      const y = laneTop(laneIndex, node.lane) + LAYOUT.laneTitleH + (contentH - height) / 2 + Number(node.yOffset || 0);
      map.set(String(node.id), Object.assign({}, node, {
        width: width,
        height: height,
        x: cx - width / 2,
        y: y,
        cx: cx,
        cy: y + height / 2
      }));
    }
    return map;
  }

  function anchor(node, side, offset) {
    const delta = Number(offset || 0);
    if (side === "left") return [node.x, node.cy + delta];
    if (side === "right") return [node.x + node.width, node.cy + delta];
    if (side === "top") return [node.cx + delta, node.y];
    return [node.cx + delta, node.y + node.height];
  }

  function defaultSides(from, to) {
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? ["right", "left"] : ["left", "right"];
    }
    return dy >= 0 ? ["bottom", "top"] : ["top", "bottom"];
  }

  function sideFor(value, fallback) {
    return /^(left|right|top|bottom)$/.test(String(value || "")) ? String(value) : fallback;
  }

  function endpointPlans(workflow, nodes) {
    const plans = [];
    for (const edge of workflow.edges || []) {
      const from = nodes.get(String(edge.from));
      const to = nodes.get(String(edge.to));
      if (!from || !to) throw new Error("archify_browser_edge_endpoint_missing:" + String(edge.id));
      const defaults = defaultSides(from, to);
      plans.push({
        edge: edge,
        from: from,
        to: to,
        fromSide: sideFor(edge.fromSide, defaults[0]),
        toSide: sideFor(edge.toSide, defaults[1]),
        fromOffset: 0,
        toOffset: 0
      });
    }

    const groups = new Map();
    function register(plan, endpoint) {
      const node = endpoint === "from" ? plan.from : plan.to;
      const side = endpoint === "from" ? plan.fromSide : plan.toSide;
      const key = node.id + "|" + side;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ plan: plan, endpoint: endpoint });
    }
    for (const plan of plans) {
      register(plan, "from");
      register(plan, "to");
    }

    for (const group of groups.values()) {
      if (group.length <= 1) continue;
      group.sort(function(a, b) {
        const aOther = a.endpoint === "from" ? a.plan.to : a.plan.from;
        const bOther = b.endpoint === "from" ? b.plan.to : b.plan.from;
        return aOther.cy - bOther.cy || aOther.cx - bOther.cx || String(a.plan.edge.id).localeCompare(String(b.plan.edge.id));
      });
      const center = (group.length - 1) / 2;
      group.forEach(function(item, index) {
        const side = item.endpoint === "from" ? item.plan.fromSide : item.plan.toSide;
        const node = item.endpoint === "from" ? item.plan.from : item.plan.to;
        const extent = side === "left" || side === "right" ? node.height : node.width;
        const step = Math.min(12, Math.max(5, extent / (group.length + 1)));
        const value = (index - center) * step;
        if (item.endpoint === "from") item.plan.fromOffset = value;
        else item.plan.toOffset = value;
      });
    }

    return plans;
  }

  function gapYBetween(laneIndex, fromLane, toLane, bias) {
    const a = laneTop(laneIndex, fromLane) + LAYOUT.laneH;
    const b = laneTop(laneIndex, toLane);
    return a + (b - a) * Number(bias == null ? 0.5 : bias);
  }

  function sameLaneAutoVia(start, end) {
    if (start[0] === end[0] || start[1] === end[1]) return [];
    const midX = (start[0] + end[0]) / 2;
    return [[midX, start[1]], [midX, end[1]]];
  }

  function routeVia(plan, laneIndex, start, end) {
    const edge = plan.edge;
    if (Array.isArray(edge.via)) return edge.via.map(function(point) { return [Number(point[0]), Number(point[1])]; });
    const route = String(edge.route || "auto");
    if (route === "straight") return [];
    if (route === "drop") {
      const y = gapYBetween(laneIndex, plan.from.lane, plan.to.lane, edge.bias);
      return [[start[0], y], [end[0], y]];
    }
    if (route === "outside-right") {
      const x = Number(edge.channelX == null ? LAYOUT.laneX + LAYOUT.laneW + 12 : edge.channelX);
      return [[x, start[1]], [x, end[1]]];
    }
    if (route === "return-left") {
      const x = Number(edge.channelX == null ? Math.min(plan.from.x, plan.to.x) - 28 : edge.channelX);
      return [[x, start[1]], [x, end[1]]];
    }
    if (route === "bottom-channel") {
      const y = Number(edge.channelY == null ? Math.max(plan.from.y + plan.from.height, plan.to.y + plan.to.height) + 32 : edge.channelY);
      return [[start[0], y], [end[0], y]];
    }
    if (route === "up-channel") {
      const y = Number(edge.channelY == null ? Math.min(plan.from.y, plan.to.y) - 28 : edge.channelY);
      return [[start[0], y], [end[0], y]];
    }
    if (plan.from.lane === plan.to.lane) return sameLaneAutoVia(start, end);
    const y = gapYBetween(laneIndex, plan.from.lane, plan.to.lane, edge.bias);
    return [[start[0], y], [end[0], y]];
  }

  function routeFor(plan, laneIndex) {
    const start = anchor(plan.from, plan.fromSide, plan.fromOffset);
    const end = anchor(plan.to, plan.toSide, plan.toOffset);
    const points = [start].concat(routeVia(plan, laneIndex, start, end), [end]);
    return {
      points: points,
      d: points.map(function(point, index) {
        return (index === 0 ? "M" : "L") + point[0] + " " + point[1];
      }).join(" ")
    };
  }

  function labelPoint(edge, points) {
    let index = Number.isInteger(edge.labelSegment) ? edge.labelSegment : -1;
    if (index < 0 || index >= points.length - 1) {
      let best = 0;
      let bestLength = -1;
      for (let i = 0; i < points.length - 1; i += 1) {
        const dx = points[i + 1][0] - points[i][0];
        const dy = points[i + 1][1] - points[i][1];
        const length = Math.hypot(dx, dy);
        if (length > bestLength) {
          best = i;
          bestLength = length;
        }
      }
      index = best;
    }
    const a = points[index];
    const b = points[index + 1];
    return [
      (a[0] + b[0]) / 2 + Number(edge.labelDx || 0),
      (a[1] + b[1]) / 2 + Number(edge.labelDy || 0)
    ];
  }

  function renderDefinitions() {
    return [
      '<defs>',
      '<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--grid)" stroke-width="0.45" opacity="0.6"/></pattern>',
      '<marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--arrow)"/></marker>',
      '<marker id="arrow-emphasis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--arrow-emphasis)"/></marker>',
      '<marker id="arrow-dashed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--database-stroke)"/></marker>',
      '<marker id="arrow-security" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--security-stroke)"/></marker>',
      '</defs>'
    ].join("");
  }

  function renderLane(lane, index) {
    const y = LAYOUT.laneY + index * (LAYOUT.laneH + LAYOUT.laneGap);
    const prefix = lane.variant === "exception" ? "EX" : String(index + 1).padStart(2, "0");
    return '<rect x="' + LAYOUT.laneX + '" y="' + y + '" width="' + LAYOUT.laneW + '" height="' + LAYOUT.laneH + '" rx="10" class="c-lane"/>' +
      '<text x="' + (LAYOUT.laneX + 14) + '" y="' + (y + 22) + '" class="t-dim" font-size="10" font-weight="600">' + esc(prefix + " / " + lane.label) + '</text>';
  }

  function renderNode(node) {
    const cls = COMPONENT_CLASS[node.type] || COMPONENT_CLASS.external;
    const hasSub = node.sublabel != null && String(node.sublabel) !== "";
    const labelSize = fittedFontSize(node.label, node.width, 11, 9);
    const subSize = fittedFontSize(node.sublabel, node.width, 8, 6);
    return '<g id="node-' + esc(node.id) + '" data-node-id="' + esc(node.id) + '" data-node-label="' + esc(node.label) + '">' +
      '<title>' + esc([node.label, node.sublabel].filter(Boolean).join(" · ")) + '</title>' +
      '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.width + '" height="' + node.height + '" rx="6" class="c-mask"/>' +
      '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.width + '" height="' + node.height + '" rx="6" class="' + cls + '"/>' +
      '<text x="' + node.cx + '" y="' + (node.y + 21) + '" class="t-primary" font-size="' + labelSize + '" font-weight="600" text-anchor="middle">' + esc(node.label) + '</text>' +
      (hasSub ? '<text x="' + node.cx + '" y="' + (node.y + 38) + '" class="t-muted" font-size="' + subSize + '" text-anchor="middle">' + esc(node.sublabel) + '</text>' : '') +
      '</g>';
  }

  function renderEdge(plan, routed, index) {
    const edge = plan.edge;
    const pair = EDGE_CLASS[edge.variant] || EDGE_CLASS.default;
    const width = Number(edge.width || (edge.variant === "emphasis" ? 1.8 : 1.4));
    const points = routed.points.map(function(point) { return point[0] + "," + point[1]; }).join(" ");
    const path = '<path data-edge-key="' + index + '" data-edge-id="' + esc(edge.id) + '" data-edge-from="' + esc(edge.from) + '" data-edge-to="' + esc(edge.to) + '" data-composition-points="' + esc(points) + '" d="' + esc(routed.d) + '" class="' + pair[0] + '" stroke-width="' + width + '" marker-end="url(#' + pair[1] + ')"/>';
    if (!edge.label) return path;
    const point = labelPoint(edge, routed.points);
    const labelW = Math.max(30, textUnits(edge.label) * 4.8 + 10);
    const label = '<g><rect x="' + (point[0] - labelW / 2) + '" y="' + (point[1] - 10) + '" width="' + labelW + '" height="14" rx="3" class="c-mask"/><text x="' + point[0] + '" y="' + point[1] + '" class="t-muted" font-size="8" text-anchor="middle">' + esc(edge.label) + '</text></g>';
    return path + label;
  }

  function renderHtml(workflow) {
    const lanes = Array.isArray(workflow.lanes) ? workflow.lanes : [];
    const laneIndex = new Map(lanes.map(function(lane, index) { return [String(lane.id), index]; }));
    const nodes = measureNodes(workflow, laneIndex);
    const plans = endpointPlans(workflow, nodes);
    const routed = plans.map(function(plan) { return routeFor(plan, laneIndex); });
    const autoHeight = LAYOUT.laneY + Math.max(1, lanes.length) * LAYOUT.laneH + Math.max(0, lanes.length - 1) * LAYOUT.laneGap + 124;
    const authoredViewBox = workflow.meta && Array.isArray(workflow.meta.viewBox) ? workflow.meta.viewBox : null;
    const viewBox = authoredViewBox && authoredViewBox.length >= 2
      ? [Number(authoredViewBox[0]), Number(authoredViewBox[1])]
      : [720, autoHeight];
    const title = String(workflow.meta && workflow.meta.title || "Python execution flow");
    const subtitle = String(workflow.meta && workflow.meta.subtitle || "Python Reading Graph IR");

    const svg = '<svg viewBox="0 0 ' + viewBox[0] + ' ' + viewBox[1] + '" role="img" aria-labelledby="archify-diagram-title archify-diagram-description" data-preset="signal-flow" data-quality-profile="standard">' +
      '<title id="archify-diagram-title">' + esc(title) + '</title>' +
      '<desc id="archify-diagram-description">' + esc(subtitle) + '</desc>' +
      renderDefinitions() +
      '<rect width="100%" height="100%" fill="url(#grid)"/>' +
      lanes.map(renderLane).join("") +
      plans.map(function(plan, index) { return renderEdge(plan, routed[index], index); }).join("") +
      Array.from(nodes.values()).map(renderNode).join("") +
      '</svg>';

    return '<!doctype html><html lang="' + esc(document.documentElement.lang || "ko") + '" data-theme="dark" data-preset="signal-flow"><head>' +
      '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="generator" content="archify ' + ARCHIFY_SOURCE_VERSION + ' / PRT browser adapter ' + VERSION + '">' +
      '<title>' + esc(title) + '</title>' +
      '<style>' +
      ':root{--bg:#030711;--grid:#15233a;--text:#f5fbff;--text-muted:#9eb0c7;--text-dim:#52667f;--mask:#07101e;--lane-fill:rgba(9,22,40,.5);--lane-stroke:#2c4564;--frontend-fill:rgba(6,182,212,.14);--frontend-stroke:#67e8f9;--backend-fill:rgba(16,185,129,.14);--backend-stroke:#5eead4;--database-fill:rgba(139,92,246,.16);--database-stroke:#c4b5fd;--cloud-fill:rgba(245,158,11,.13);--cloud-stroke:#fcd34d;--security-fill:rgba(244,63,94,.13);--security-stroke:#fda4af;--messagebus-fill:rgba(249,115,22,.13);--messagebus-stroke:#fdba74;--external-fill:rgba(71,85,105,.24);--external-stroke:#a5b4c7;--arrow:#7890ad;--arrow-emphasis:#2dd4bf}' +
      '@media(prefers-color-scheme:light){:root{--bg:#f4f9fc;--grid:#d4e5ee;--text:#102638;--text-muted:#587287;--text-dim:#8aa2b4;--mask:#fff;--lane-fill:rgba(232,243,248,.62);--lane-stroke:#a9c5d5;--frontend-fill:rgba(6,182,212,.09);--frontend-stroke:#0789a1;--backend-fill:rgba(5,150,105,.09);--backend-stroke:#087f69;--database-fill:rgba(124,58,237,.09);--database-stroke:#7254c7;--cloud-fill:rgba(217,119,6,.08);--cloud-stroke:#b9670b;--security-fill:rgba(225,29,72,.08);--security-stroke:#c53a59;--messagebus-fill:rgba(234,88,12,.08);--messagebus-stroke:#c65f27;--external-fill:rgba(100,116,139,.1);--external-stroke:#607a8c;--arrow:#7b97aa;--arrow-emphasis:#0d9488}}' +
      '*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--text);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Noto Sans Mono CJK KR",monospace}.wrap{display:flex;flex-direction:column;width:100%;height:100%;padding:10px}.head{flex:none;margin:0 0 6px}.title{font-size:13px;font-weight:700}.sub{margin-top:2px;color:var(--text-muted);font-size:9px}.canvas{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--lane-stroke);border-radius:10px;background:rgba(9,22,40,.22)}svg{display:block;max-width:100%;max-height:100%;width:auto;height:auto}.c-lane{fill:var(--lane-fill);stroke:var(--lane-stroke);stroke-width:1}.c-mask{fill:var(--mask);stroke:none}.c-frontend{fill:var(--frontend-fill);stroke:var(--frontend-stroke)}.c-backend{fill:var(--backend-fill);stroke:var(--backend-stroke)}.c-database{fill:var(--database-fill);stroke:var(--database-stroke)}.c-cloud{fill:var(--cloud-fill);stroke:var(--cloud-stroke)}.c-security{fill:var(--security-fill);stroke:var(--security-stroke)}.c-messagebus{fill:var(--messagebus-fill);stroke:var(--messagebus-stroke)}.c-external{fill:var(--external-fill);stroke:var(--external-stroke)}.t-primary{fill:var(--text)}.t-muted{fill:var(--text-muted)}.t-dim{fill:var(--text-dim)}.a-default,.a-emphasis,.a-dashed,.a-security{fill:none;stroke-linecap:round;stroke-linejoin:round}.a-default{stroke:var(--arrow)}.a-emphasis{stroke:var(--arrow-emphasis)}.a-dashed{stroke:var(--database-stroke);stroke-dasharray:5 4}.a-security{stroke:var(--security-stroke)}' +
      '</style></head><body><!-- Derived from Archify v2.13.0 Workflow geometry; MIT licensed. -->' +
      '<div class="wrap"><div class="head"><div class="title">' + esc(title) + '</div><div class="sub">' + esc(subtitle) + '</div></div><div class="canvas">' + svg + '</div></div></body></html>';
  }

  async function sha256Hex(text) {
    if (!window.crypto || !window.crypto.subtle || typeof TextEncoder !== "function") return "";
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map(function(value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }

  async function render(projection, structurePayload, locale) {
    const validation = validateProjection(projection, structurePayload);
    if (!validation.ok) {
      const error = new Error(validation.reason);
      error.code = validation.reason;
      throw error;
    }

    const html = renderHtml(validation.workflow);
    if (!/<svg\b/i.test(html)) throw new Error("archify_browser_svg_missing");
    const bytes = typeof TextEncoder === "function"
      ? new TextEncoder().encode(html).byteLength
      : html.length;

    return {
      ok: true,
      kind: "python_archify_execution",
      renderer: "archify",
      rendererAdapterVersion: VERSION,
      rendererRuntime: "browser",
      archifySourceVersion: ARCHIFY_SOURCE_VERSION,
      locale: String(locale || projection.locale || "ko"),
      quality: "standard",
      sourceMeta: projection.sourceMeta || (structurePayload && structurePayload.sourceMeta) || {},
      authority: projection.authority || {},
      summary: projection.summary || {},
      executionProjectionNodeIds: projection.executionProjectionNodeIds || [],
      workflowSourceNodeIds: validation.sourceIds,
      workflowIdMap: projection.workflowIdMap || [],
      collapsedAuxiliaryNodeIds: validation.collapsed,
      workflow: validation.workflow,
      artifact: {
        html: html,
        bytes: bytes,
        sha256: await sha256Hex(html),
        containsSvg: true
      },
      runtime: {
        kind: "browser",
        archifySourceVersion: ARCHIFY_SOURCE_VERSION,
        adapterVersion: VERSION
      },
      privacy: {
        externalApiUsed: false,
        originalSourcePersisted: false,
        temporaryFilesPersisted: false,
        localServerUsed: false
      }
    };
  }

  window.PythonArchifyBrowserRenderer = {
    version: VERSION,
    archifySourceVersion: ARCHIFY_SOURCE_VERSION,
    validateProjection: validateProjection,
    renderHtml: renderHtml,
    render: render
  };
})();
