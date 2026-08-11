# Python Reading Visualization Roles v0.1

## Decision

Python Trainer will not replace Mermaid wholesale with Archify.

The target is one semantic model with multiple learning lenses:

`Python source -> Python Reading Graph IR -> Execution / Data / Call / Detail lenses -> renderer`

Renderer roles:

| Lens | Primary renderer | Secondary / evaluation |
|---|---|---|
| Execution flow | Archify Workflow | Mermaid fallback/static export |
| Branch / loop / exception learning | Archify Workflow | Mermaid fallback |
| Guided learning focus | Archify Workflow | Trainer inspector |
| Data flow | Mermaid | Archify Data Flow evaluation |
| Call / dependency relationships | Mermaid | Archify Architecture when project-scale |
| Detailed code explanation | Trainer inspector | none |
| Project architecture | Archify Architecture | Mermaid static documentation |

## Why

The Archify PoC for `PY16_L08_manifest_load_001` passed both `standard` and `showcase` validation with zero errors and zero warnings after projection correction. Its learner-facing execution view made preparation, loop/branch, parse/collect, and result stages substantially clearer than the current all-in-one Mermaid flow.

The current Mermaid output still has value because it exposes call, data, and dependency relations densely and cheaply. Those relations should not be forced into the execution-flow view.

## Authority boundary

- Lesson JSON and the learner's code remain the semantic source.
- `Python Reading Graph IR` owns extracted code-reading semantics.
- Renderer-specific layout, lane, color, coordinates, route, and theme are not allowed in the IR.
- Archify and Mermaid are projections, never authority.
- The existing `code_explainer.js` remains the production runtime until a browser-side IR adapter reaches parity.

## Planned learner UI

Default tabs:

1. **실행 흐름** — Archify Workflow
2. **데이터 흐름** — Mermaid initially
3. **호출·의존성** — Mermaid
4. **상세 설명** — Trainer inspector

The inspector should connect the selected visual node back to:

- source line range
- exact code text
- reads / writes
- calls
- branch role
- related explanation and lesson concepts

## Guided learning

Archify guided views should be generated from semantic groups, not manually authored per lesson when the structure can be derived safely.

Examples:

- 전체 실행 흐름
- 조건 분기만 보기
- 정상 처리 경로
- 반복 종료 경로
- 예외 처리 경로

## Scale rule

Archify Workflow is the preferred execution renderer for short and medium teaching snippets.

Before production integration, evaluate at least:

- loop + continue
- if / else
- function + return
- try / except
- class method

Large snippets must not become one unreadable workflow. The adapter should collapse structural nodes, split by scope, or fall back to a summarized Mermaid/inspector view rather than forcing every statement into one canvas.

## Localization

Diagram content must be bilingual at the IR level (`ko`, `en`). Raw Archify standalone chrome may remain English during evaluation, but production Trainer integration should wrap or localize the learner-facing controls instead of exposing the standalone authoring UI unchanged.

## Adoption gate

Archify becomes the production execution-flow renderer only when:

- the same IR can drive both Archify and Mermaid projections;
- code-to-node traceability is deterministic;
- KO/EN labels pass layout checks;
- branch/loop/exception semantics remain correct;
- mobile/narrow layout is usable;
- large-code fallback behavior is defined;
- no external service is required at runtime for normal learning.
