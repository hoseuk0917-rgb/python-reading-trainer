# Python Browser-Native Archify B3 v0.1

## Goal

Make the Python execution-flow lens usable from GitHub Pages without starting `tools/local_prt_server.js` or any other local process.

Target path:

`PWA source -> existing CodeExplainerRules -> browser CPython AST -> canonical reconciliation -> existing Archify workflow projection -> browser Archify workflow adapter -> sandboxed srcdoc SVG`

## Authority and compatibility

The B3 browser path MUST preserve the contracts already released on `main@6e5dfa75a85547110eedd27ae6efb8be7d9c13d3`.

- Python source / lesson remains the semantic source of truth.
- CPython `ast` remains canonical structural authority.
- `CodeExplainerRules` remains enrichment / cross-check only.
- `RULE_ONLY` and `CONFLICT` remain diagnostics and MUST NOT auto-register.
- Auxiliary nodes remain excluded from the canonical learner projection.
- Canonical node IDs remain the traceability source; renderer-safe IDs are aliases only.
- Mermaid remains available and is not replaced.
- The existing localhost endpoints remain an optional development fallback, not a normal-use requirement.
- Source code MUST NOT be sent to an external analysis or rendering API.
- No persistent source storage is introduced.

## Browser Python runtime

B3 uses Pyodide in a module Web Worker. This preserves the existing Python implementation instead of porting Python semantics to a second JavaScript parser.

The worker loads the following checked-in Python modules from the same GitHub Pages origin into its in-memory Pyodide filesystem:

- `tools/python_reading_graph_ir_v0_1.py`
- `tools/python_reading_reconciliation_v0_1.py`
- `tools/export_python_reading_archify_v0_1.py`
- `tools/python_reading_archify_layout_v0_1.py`
- `tools/export_python_reading_archify_layoutsafe_v0_1.py`
- `tools/python_reading_archify_contract_v0_1.py`
- `tools/python_reading_archify_server_bridge_v0_1.py`
- `tools/python_reading_browser_bridge_v0_1.py`

Pyodide runtime assets are fetched from the pinned `314.0.2` jsDelivr distribution. The user's Python source is passed only to the in-browser worker and is never included in those runtime-asset requests.

Normal learning remains static-page based. The first Python structural analysis may require a one-time browser download of the pinned WebAssembly runtime. The existing non-Archify / Mermaid experience remains available if that runtime cannot load.

## Browser Archify adapter

Archify v2.13.0's Workflow renderer is Node-oriented at generation time, but its learner artifact is HTML/SVG. B3 therefore ports only the bounded Workflow geometry and SVG presentation needed by Python Reading Trainer.

The adapter MUST:

- consume only the already validated workflow JSON emitted by the existing Python projection;
- preserve the v2.13.0 Workflow lane / column geometry used by R7;
- preserve authored edge route hints (`drop`, `outside-right`, `bottom-channel`, explicit sides);
- preserve canonical-to-renderer ID mapping supplied by the projection;
- emit one self-contained static HTML document containing one SVG;
- run inside the existing `sandbox=""` iframe, so artifact scripts are neither required nor allowed;
- identify itself as a Python Reading Trainer browser adapter derived from Archify Workflow v2.13.0 under MIT;
- never infer new semantic nodes or relationships.

The adapter is deliberately narrower than the full Archify CLI. Validation and semantic authority stay upstream; the browser adapter is a renderer only.

## Runtime selection

1. For Python code, `python_structure_bridge.js` first uses the browser Python runtime.
2. If browser runtime initialization or execution fails, it may fall back to the existing localhost structure endpoint.
3. `python_execution_lens.js` first asks the same browser runtime for the canonical Archify workflow projection and renders it with the browser Archify adapter.
4. If browser projection/rendering fails, it may fall back to the existing localhost Archify endpoint.
5. If neither Archify path is available, Mermaid and the existing trainer explanation remain intact.

This makes GitHub Pages standalone the primary path while preserving the already verified local development path.

## Release gates

B3 may not merge to `main` until all of the following pass:

- existing Graph IR audit;
- existing reconciliation audit;
- existing R7 Archify projection audit;
- browser bridge native parity audit;
- browser worker/runtime static contract audit;
- browser Archify renderer contract audit;
- existing localhost endpoint regressions;
- existing PWA bridge and execution-lens regressions;
- browser-first PWA integration audit proving zero localhost calls on the browser-success path;
- no-persistent-storage / no-source-upload checks;
- desktop and narrow browser visual smoke with the localhost PRT server OFF;
- `validate_lessons.py`;
- `git diff --check`;
- main remains unchanged until all B3 gates pass.
