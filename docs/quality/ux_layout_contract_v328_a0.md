# V328-A0 UX layout contract

## Purpose

V328 should not add more analysis features first.

The current code explanation engine already detects functions, variables, loops, conditions, returns, unsupported calls, data flow, call flow, Mermaid, related cards, and next-check advisors.

The problem is presentation order.

The product should first answer:

1. What result does this code make?
2. Which function makes that result?
3. What does each function do in plain language?
4. What do the code names mean?
5. What is the simple flow?

Detailed analysis should still exist, but it should not be the first thing a beginner sees.

## Current structure summary

### Main files

- `src/pwa/index.html`
  - Holds the visible DOM containers.
  - Already has code explanation, command explanation, and project analysis containers.
  - Should not be heavily rewritten in V328 unless a new top-level container is truly needed.

- `src/pwa/code_explainer.js`
  - Main code explanation renderer.
  - Very large and already has many render functions.
  - V328 code UX changes should mostly happen here.

- `src/pwa/code_explainer_rules.js`
  - Analysis engine.
  - Should mostly be preserved in V328.
  - Do not rewrite parsing rules unless the new simple UX requires one missing field.

- `src/pwa/command_explainer.js`
  - Command explanation engine and renderer.
  - Should be handled after code explanation UX is stabilized.

- `src/pwa/project_analyzer.js`
  - Project analysis engine and renderer.
  - Should be handled after command explanation UX is stabilized.

## V328 product principle

### Beginner first, internal detail later

Bad default:

- 9 steps
- 0 danger
- 1 unsupported
- data flow count
- call flow count
- roleSummary
- orderedSteps
- tags
- related card score
- Mermaid source

Good default:

- This code makes this kind of result.
- This function is the main one.
- These names are labels used by the code.
- Here is the short execution flow.
- Open details only if needed.

## Code explanation default layout

### 1. Result first

The first visible block should be:

`이 코드는 어떤 결과를 만드나요?`

It should explain the likely result or effect in plain Korean.

For the sample:

    def run(config):
        handler = load_handler(config["type"])
        return handler(config)

    def filter_users(users):
        result = []
        for user in users:
            if user.get("active"):
                result.append(user["name"])
        return result

Expected beginner-facing explanation:

    이 코드에서 가장 분명한 결과는
    조건에 맞는 사람의 이름 목록을 만드는 것입니다.

    그 결과를 만드는 핵심 함수는 filter_users(users)입니다.

    run(config)는 어떤 함수를 실행할지 고르는 역할로 보이지만,
    load_handler가 이 코드 안에 없어서 실제로 무엇을 고르는지는 아직 알 수 없습니다.

Important rule:

- Do not overclaim.
- If a function depends on an external function such as `load_handler`, say that the exact behavior is not fully known from this snippet.

### 2. Result example when safe

If the code shape is clear enough, show a tiny example.

For `filter_users(users)`:

    예를 들어 users에 이런 값이 있으면:

    철수: active = true
    영희: active = false
    민수: active = true

    결과는 이렇게 됩니다:

    ["철수", "민수"]

Do not generate fake examples for unclear dynamic code unless it is clearly labeled as an example.

### 3. Main function first

The result-making function should appear before helper/dynamic functions.

For the sample, show:

1. `filter_users(users)`
2. `run(config)`

Reason:

- `filter_users(users)` clearly creates the name list.
- `run(config)` depends on external `load_handler`, so it is not the clearest result-maker.

### 4. Function purpose cards

Each function card should follow this structure:

    함수: filter_users(users)

    무슨 일을 하나요?
    사람 목록(users)에서 조건에 맞는 사람의 이름만 골라냅니다.

    무엇을 하나씩 보나요?
    user는 users에서 꺼낸 사람 한 명입니다.

    어떤 조건을 보나요?
    active 값이 참인지 확인합니다.

    무엇을 모으나요?
    name 값을 result 목록에 모읍니다.

    최종 결과는?
    조건에 맞는 사람들의 이름 목록을 돌려줍니다.

For unclear dynamic functions:

    함수: run(config)

    무슨 일을 하나요?
    config를 보고 실행할 함수(handler)를 고른 뒤 실행합니다.

    아직 모르는 점
    load_handler가 이 코드 안에 없어서, 실제로 어떤 함수를 고르는지는 아직 알 수 없습니다.

    더 정확히 보려면
    load_handler가 정의된 코드를 찾아야 합니다.

### 5. Code name labels

Show a compact glossary:

    코드 속 이름표

    users: 사람 목록
    user: 목록에서 꺼낸 사람 한 명
    active: 조건에 맞는지 보는 표시
    name: 사람 이름
    result: 골라낸 이름을 모아두는 목록
    config: 어떤 작업을 고를 때 쓰는 입력값
    handler: 실제 일을 처리할 함수

Rules:

- Use real code names.
- Explain them as labels, not abstract programming terms.
- Avoid saying only "variable", "parameter", "return value" in the default view.

### 6. Simple execution flow

Show 5 to 8 short steps.

For the sample:

    실행 순서

    1. filter_users(users)가 사람 목록을 받습니다.
    2. result라는 빈 목록을 만듭니다.
    3. users에서 사람을 한 명씩 꺼내 user라고 부릅니다.
    4. user의 active 값이 참인지 확인합니다.
    5. 조건에 맞으면 user의 name을 result에 넣습니다.
    6. 마지막에 result를 돌려줍니다.
    7. run(config)는 config를 보고 실행할 함수를 찾은 뒤 실행합니다.
    8. 다만 load_handler의 실제 내용은 이 코드만으로는 알 수 없습니다.

### 7. Mermaid

Default:

- Show one simple diagram.
- Hide Mermaid source by default.
- Hide advanced legend by default.

Do not show multiple diagrams and internal flow blocks all expanded by default.

## Details hidden by default

The following sections should be preserved but collapsed:

- Full numeric summary
- Confidence report
- Detection details
- Data flow
- Call flow
- Long per-line steps
- Function-level long explanation
- Related cards
- Unsupported/unknown details
- Mermaid source
- Mermaid quality guide
- Internal tags
- Internal fields such as:
  - `roleSummary`
  - `orderedSteps`
  - `functionFlowV326A4`
  - `nextCheckAdvisorV326A4`
  - `mermaid_quality_mode`

## Command explanation layout

Handle after code explanation UX stabilizes.

Default command layout should answer:

    이 명령은 실행해도 되나요?

Then:

1. Safety level
2. What will happen
3. What to check first
4. Paste-back guidance only when context is unclear

For example:

    git reset --hard HEAD~1

Expected default explanation:

    위험합니다.

    이 명령은 Git 기록을 이전 상태로 되돌리면서
    현재 작업 중인 파일 변경을 지울 수 있습니다.

    먼저 확인하세요:

    git status --short
    git diff

Hide by default:

- raw groups
- summary JSON
- internal advisorMode
- long technical classification

## Project analysis layout

Handle after command explanation UX stabilizes.

Default project layout should answer:

    이 프로젝트는 무엇으로 보이나요?

Then:

1. Project type
2. First files to open
3. How it likely runs
4. What is unknown
5. Safe read-only command to confirm

Hide by default:

- full file list
- long JSON details
- internal scores
- all cross-file edges unless requested

## V328 implementation order

### V328-A1

Add a new beginner-first panel in `code_explainer.js`.

It should render above existing detailed sections.

Required blocks:

1. Result first
2. Main function first
3. Function purpose cards
4. Code name labels
5. Simple execution flow

Existing detailed UI remains visible for now.

### V328-A2

Collapse old detailed sections by default.

Do not delete them.

### V328-A3

Improve function ordering and purpose inference.

Result-making functions should appear before dynamic/helper functions.

### V328-A4

Simplify Mermaid default display.

Show one diagram first. Keep source and advanced options collapsed.

### V328-A5

Apply the same beginner-first UX to command explanation.

### V328-A6

Apply the same beginner-first UX to project analysis.

## Acceptance criteria for V328-A1

For the sample code, the top of code explanation must clearly show:

- The likely result is a list of matching user names.
- `filter_users(users)` is the clearest result-making function.
- `run(config)` is dynamic and depends on external `load_handler`.
- `users`, `user`, `active`, `name`, `result`, `config`, and `handler` are explained in plain Korean.
- No internal field names are visible in the default beginner panel.

## Acceptance criteria for V328-A2

Old detailed sections must still exist but be collapsed by default.

The default screen should not begin with:

- step counts
- confidence counts
- unsupported counts
- related card scores
- internal tags
- long per-line explanation

## Non-goals

V328 should not:

- Replace the whole analysis engine.
- Remove related cards permanently.
- Remove Mermaid.
- Remove detailed data flow or call flow.
- Rewrite all menus at once.
- Add more parsing rules unless required by the new UX contract.

## Decision

Proceed with V328 only after this contract is reviewed.

First implementation target:

`src/pwa/code_explainer.js`
