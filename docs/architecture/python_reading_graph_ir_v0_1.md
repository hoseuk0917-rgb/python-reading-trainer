# Python Reading Graph IR v0.1

## Purpose

`Python Reading Graph IR` is the renderer-neutral semantic contract between Python code analysis and learning visualization.

It exists to prevent Mermaid, Archify, or any future renderer from becoming the source of truth for code meaning.

## Pipeline

`Python source`
→ `Python Reading Graph IR`
→ `Execution / Data / Call / Detail lenses`
→ `Archify / Mermaid / Trainer Inspector`

The first reference generator is:

- `tools/python_reading_graph_ir_v0_1.py`

The deterministic five-case audit is:

- `tools/audit_python_reading_graph_ir_v0_1.py`

The JSON Schema is:

- `docs/architecture/python_reading_graph_ir_v0_1.schema.json`

## Scope model

The IR contains one or more scopes.

Supported v0.1 scope kinds:

- `module`
- `function`
- `method`

Each scope has its own control-flow graph.

A snippet that contains only one function or method definition can select that nested scope as `primary_scope_id`; otherwise the module scope remains primary.

## Node contract

Each node contains:

- `id`
- `kind`
- `semantic_role`
- bilingual `label.ko` / `label.en`
- exact or reconstructed `code`
- `code_span.start_line` / `end_line`
- facts:
  - `reads`
  - `writes`
  - `calls`
- `confidence`

Typical node kinds:

- `start`
- `end`
- `setup`
- `source`
- `loop`
- `decision`
- `continue`
- `break`
- `process`
- `output`
- `return`
- `try`
- `except`
- `definition`
- `merge`

`merge` is semantic control structure and may be hidden by a learner-facing renderer.

## Edge contract

Control edges are renderer-neutral.

Important roles include:

- `next`
- `true`
- `false`
- `loop_body`
- `loop_back`
- `loop_exit`
- `continue`
- `break`
- `return`
- `exception`
- `merge`
- `finally`

A renderer may convert some semantic nodes or edges into labels, channels, guided views, or hidden joins, but it must not change the underlying control meaning.

## Lens contract

### Execution

Source:

- scope nodes
- scope control edges

Preferred renderer:

- Archify Workflow

### Data flow

Source:

- `indexes.data_dependencies`

Initial renderer:

- Mermaid

Future comparison:

- Archify Data Flow

### Call / dependency

Source:

- `indexes.calls`

Initial renderer:

- Mermaid

### Detail

Source:

- node code
- line span
- facts
- labels

Renderer:

- Trainer inspector

## Confidence

- `exact`: directly supported by Python AST structure.
- `structural`: graph shape is correct at a structural level but runtime routing is simplified.
- `inferred`: reserved for later heuristics.

In v0.1, `try/except` exception routing is marked `structural` because the reference extractor does not perform full Python runtime exception analysis.

## Reference extractor boundary

The Python reference generator uses the standard-library `ast` module. It is a contract/prototyping authority for the IR shape, not the final browser runtime implementation.

The production static PWA cannot depend on a local Python process. Once the contract stabilizes, the relevant semantics must be implemented or adapted inside the browser-side analyzer while preserving parity with the reference audit.

## Mutation awareness

The reference extractor treats common mutating calls such as `append`, `extend`, `update`, and `add` as writes to the receiver object so the data-flow lens can connect mutation to later reads.

This is intentionally conservative and must be expanded only with explicit tests.

## Renderer isolation rule

The following fields are forbidden from becoming authoritative IR semantics:

- Archify lane / col
- SVG coordinates
- route / via points
- Mermaid node IDs or syntax
- color / theme
- renderer-specific label offsets

Those belong in renderer projections.

## v0.1 acceptance cases

The audit covers:

1. loop + `continue`
2. `if / else`
3. function + `return`
4. `try / except`
5. class method

The audit also verifies:

- unique node IDs
- unique edge IDs
- all edge endpoints exist
- expected control roles exist
- selected call facts exist
- primary scope selection works

## Next phase

After v0.1 contract validation:

1. add a browser-side adapter from Code Explainer analysis to this IR;
2. generate learner-facing Execution projection for Archify;
3. generate Data and Call projections from the same IR;
4. add code↔node inspector synchronization;
5. run narrow/mobile and long-code fallback audits;
6. only then replace the current default Mermaid execution view.
