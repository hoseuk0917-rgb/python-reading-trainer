# Python Reading Reconciliation v0.1

## Purpose

Python Reading Trainer uses two independent views of Python source:

1. the existing rule-based `CodeExplainerRules` learner explanation engine;
2. the Python `ast`-based `Python Reading Graph IR` structural engine.

The reconciliation layer cross-checks those results without concatenating them blindly.
Its primary goals are to recover structural omissions from the rule analyzer while preventing duplicate or conflicting learner nodes.

## Canonical authority

For Python structural execution semantics, **Python AST is the canonical structural anchor**.

- One AST node may have zero, one, or many rule-analyzer evidence records.
- Multiple rule records matching the same AST node are merged into that node's `rule_evidence[]`.
- A matched AST node is `AGREED`.
- An AST structural node with no matching rule record is `AST_ONLY` and may be used to supplement the learner explanation.
- A rule record with no AST anchor is `RULE_ONLY` and is diagnostic only.
- A rule record overlapping AST source lines but disagreeing semantically is `CONFLICT` and is diagnostic only.
- `RULE_ONLY` and `CONFLICT` must never create Archify execution nodes automatically.

This prevents the rule analyzer and AST analyzer from registering the same source structure twice.

## Duplicate-prevention contract

The execution projection obeys all of the following:

1. Exactly one canonical execution record exists per eligible AST node ID.
2. `execution_projection_node_ids` is derived from AST-canonical findings only.
3. Rule evidence can enrich a canonical finding but cannot create a second copy of it.
4. Duplicate rule findings are removed before matching when they are identical within the same evidence source.
5. Additional rule findings that still map to the same AST node are merged after matching.
6. Rule-only and conflict diagnostics have `auto_register=false`.
7. AST synthetic/helper nodes such as scope start/end, merge nodes, loop exit, and loop-source projection helpers are excluded from coverage-miss counting.

## Status meaning

### `AGREED`

Both analyzers found compatible structure at the same source location.
The learner sees one canonical node with both evidence sources.

### `AST_ONLY`

The AST structure is source-grounded but the rule analyzer did not expose a matching structure item.
This is the primary structural omission-recovery path.

### `RULE_ONLY`

The rule analyzer inferred something without a safe AST structural anchor.
Keep it as explanation or diagnostic evidence; do not register it as an execution node automatically.

### `CONFLICT`

The rule analyzer and AST overlap in source location but disagree on structural meaning.
Do not resolve the disagreement by duplicating nodes. Surface it for audit or conservative fallback.

## Auxiliary AST nodes

Graph IR intentionally creates some learner/layout helper nodes that are not direct evidence that the old rule analyzer missed source syntax.
Examples include:

- scope start/end;
- branch merge;
- exception merge;
- loop exit;
- loop input/source helper.

These remain available to the execution renderer but are excluded from reconciliation coverage statistics so the audit does not report false omissions.

## Current implementation

- `tools/python_reading_reconciliation_v0_1.py`
  - builds the Python AST Graph IR;
  - extracts structural rule evidence;
  - matches by source span, semantic family, code similarity, and scope hint;
  - emits canonical findings and isolated diagnostics.
- `tools/export_code_explainer_rule_analysis_v0_1.js`
  - runs the existing browser rule analyzer in a Node VM without changing analyzer semantics.
- `tools/audit_python_reading_reconciliation_v0_1.py`
  - runs the five representative Python structures;
  - duplicates rule evidence intentionally and verifies that canonical execution registration does not increase;
  - injects synthetic `RULE_ONLY` and `CONFLICT` findings and verifies that neither enters the execution projection.

## Production integration rule

Do not wire reconciliation output directly into the PWA until the reconciliation audit passes against the current `CodeExplainerRules` implementation.

After the gate passes:

`Python source`
→ `CodeExplainerRules.analyze()`
+ `Python Reading Graph IR`
→ `Reconciliation`
→ one canonical execution model
→ Archify execution lens

Mermaid data-flow/call-flow lenses remain separate relationship projections and must not be merged into the execution-node registry.
