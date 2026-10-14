# LESSON EXPLANATION CONTRACT V1

Status: **FROZEN**
Authority: **Highest lesson-explanation quality contract for V1**
Scope: Python Reading Trainer lesson cards, Korean and English semantic equivalents
Change policy: **Do not edit this V1 contract during lesson rewriting. If the standard must change, propose a separate V2 contract.**

---

## 1. Goal

A non-major / complete beginner should be able to:

1. understand what the concept means in ordinary language,
2. see the technically correct Python definition,
3. mentally follow what the code does step by step,
4. understand why the output or answer is produced,
5. distinguish the concept from the most likely confusion,
6. read a similar new snippet without memorizing the previous answer.

The pass condition is **not** “the explanation is technically correct.”
The pass condition is:

> After reading the explanation, a beginner can use the same idea to read the next similar piece of Python code.

---

## 2. Required explanation order

Each concept explanation must preserve this learning order.

### 2.1 Easy meaning — one line

Start with one short sentence that a beginner can understand before knowing Python terminology.

Example:

> `len()`은 “안에 몇 개 있지?”를 알려주는 기능이다.

Do not start with jargon.

### 2.2 Exact technical definition — one line

Immediately after the easy meaning, include one technically accurate definition using the real Python concept/term.

Example:

> `len()`은 객체의 길이, 즉 포함된 항목의 수를 정수로 반환하는 Python 내장 함수다.

Rules:

- Do not remove the real technical term merely to make the sentence easier.
- Do not require the learner to already understand the technical term.
- If a technical term appears, the following explanation must make its meaning understandable from context.
- Prefer Python's actual semantics over a loose analogy.
- Keep this definition to one sentence whenever possible.

### 2.3 Intuitive mental model

Explain the concept in a way the learner can picture.

Good tools include:

- name tags / pointers for assignment,
- boxes or collections for containers,
- “ask this function to do a job” for a function call,
- decision gates for `if`,
- repeated visits for `for`,
- input → processing → result flow.

An analogy is only a bridge. It must not contradict actual Python behavior.

### 2.4 Real code example

Show a minimal, realistic example of the exact concept.

The example must:

- actually exercise the target concept,
- avoid unrelated advanced syntax,
- be short enough to trace,
- have a uniquely explainable result.

### 2.5 Read the code line by line

Explain what each relevant line means in the order a beginner should read it.

Do not merely paraphrase the whole program.

### 2.6 Execution flow

Show what Python evaluates or executes, in sequence.

Preferred form:

```text
value
↓
operation
↓
intermediate result
↓
next operation
↓
final result
```

The learner should be able to replay the execution mentally.

### 2.7 Result

State the resulting value/output explicitly.

Do not rely on the learner inferring it from prose.

### 2.8 Most likely beginner confusion

Every explanation should address the most likely misconception when one exists.

Examples:

- `=` vs `==`
- index number vs item count
- `print` vs `return`
- string `"20"` vs integer `20`
- `strip()` removing edge whitespace vs removing internal spaces
- function object vs function call
- condition block vs code after the block

Do not invent a confusion just to fill a template. Use one that is genuinely relevant.

### 2.9 Similar-but-different case

When useful, contrast the target concept with the nearest concept that a beginner could confuse with it.

This section must clarify a boundary, not add unrelated trivia.

### 2.10 Another example of the same concept

The teaching example must use the **same target concept/syntax**, not merely a concept that happens to coexist in the original code.

Examples:

- a `.strip()` lesson needs another real `.strip()` example,
- a `len()` lesson needs another real `len()` example,
- a `return` lesson needs another real return-value example.

A generic assignment example is **not** a valid “same grammar” example for a `.strip()` lesson.

---

## 3. Answer explanation contract

After the learner answers, `answer_explanation` must reconstruct the execution, not merely announce correctness.

Bad:

> `strip()` removes spaces, so the answer is `Python`.

Required style:

```text
처음 값은 "   Python   "이다.
↓
strip()이 문자열 양쪽 끝의 공백을 제거한다.
↓
"Python"이라는 새 문자열이 만들어진다.
↓
그 값이 clean에 연결된다.
↓
print(clean)이 Python을 출력한다.
```

The learner must see **why** the answer follows from the code.

When distractors represent common misconceptions, explain the important misconception without exhaustively discussing every obviously wrong option.

---

## 4. Technical-definition rule

Every concept card must contain both layers:

1. **Easy meaning**
2. **Exact technical definition**

Neither replaces the other.

### Example: assignment

Easy meaning:

> `=`은 값을 이름에 연결해 나중에 다시 사용할 수 있게 한다.

Exact definition:

> 대입문은 오른쪽 표현식을 평가한 결과를 왼쪽의 이름이나 대상에 바인딩한다.

### Example: `strip()`

Easy meaning:

> `strip()`은 문자열 양쪽 끝의 불필요한 공백을 떼어내는 기능이다.

Exact definition:

> `str.strip()`은 문자열의 시작과 끝에서 지정된 문자들을 제거한 새로운 문자열을 반환하는 문자열 메서드이며, 인자를 생략하면 공백 문자를 제거한다.

### Example: `input()`

Easy meaning:

> `input()`은 프로그램이 사용자에게 한 줄을 입력받는 기능이다.

Exact definition:

> `input()`은 선택적으로 프롬프트를 출력한 뒤 표준 입력에서 한 줄을 읽고 마지막 줄바꿈을 제거한 문자열을 반환하는 Python 내장 함수다.

---

## 5. Invariants — must not drift

These rules apply to the **first card and the last card equally**.

1. Do not shorten later cards merely because many cards remain.
2. Do not use a previously rewritten card as the new quality authority.
3. Re-read or re-check this V1 contract for every card.
4. Do not replace explanation with terminology-only definitions.
5. Do not remove technical terminology merely to sound beginner-friendly.
6. Do not explain behavior that the shown code does not perform.
7. Do not invent hidden execution steps.
8. Do not use an analogy that becomes false when mapped back to Python.
9. Do not use generic filler such as “this is useful in many situations” unless it teaches something specific.
10. Do not make `teaching_example` merely “related”; it must demonstrate the same target concept.
11. Do not change card identity, answer, question code, learning order, or concept routing solely to improve prose.
12. If a separate factual/code/answer defect is discovered, record it separately instead of silently changing it inside an explanation rewrite.
13. Do not change this V1 contract during card rewriting.
14. If the standard itself needs revision, stop and propose `LESSON_EXPLANATION_CONTRACT_V2.md`.

---

## 6. Existing-card preservation rule

The rewrite task primarily targets:

- `concept_explanation`
- `teaching_example`
- `answer_explanation`

Preserve unless a separately verified defect requires a dedicated fix:

- card ID / identity,
- question code,
- correct answer,
- choice meaning,
- lesson ordering,
- prerequisite relationships,
- concept routing,
- learning objective.

Never hide an unrelated defect inside a prose-quality commit.

---

## 7. Beginner readability test

Before accepting a card, ask:

> Could a learner with no programming major and no prior knowledge understand this without asking what the explanation itself means?

Then ask:

> After reading it, could that learner predict what a similar short program does?

If the first answer is “no,” simplify the explanatory bridge.
If the second answer is “no,” add execution reasoning rather than more terminology.

---

## 8. Per-card acceptance checklist

A card passes V1 only when all applicable items are true.

- [ ] Easy meaning appears first and is understandable without jargon.
- [ ] One-line technically accurate definition is present.
- [ ] Real Python terminology is preserved and then made understandable.
- [ ] The explanation creates a usable mental model.
- [ ] The code example actually demonstrates the target concept.
- [ ] Relevant lines are explained in reading order.
- [ ] Execution flow is explicit enough to replay mentally.
- [ ] Final value/output is explicit.
- [ ] A genuine beginner misconception is addressed when applicable.
- [ ] Similar-but-different behavior is clarified when useful.
- [ ] `teaching_example` demonstrates the same concept/syntax.
- [ ] `answer_explanation` reconstructs why the answer follows.
- [ ] No unsupported code/answer/identity changes were made.
- [ ] The explanation is not materially thinner than the approved V1 standard.

If any required item fails, the card remains **NOT DONE**.

---

## 9. Language parity

Korean and English do not need literal sentence-by-sentence translation, but they must teach the same semantics.

Both versions must preserve:

- the same technical truth,
- the same concept boundary,
- the same important misconception,
- the same execution logic,
- the same answer reasoning.

Do not allow the English version to collapse two distinct choices or concepts into the same visible wording.

---

## 10. Canonical style example

### `strip()`

**쉽게 말하면**

`strip()`은 문자열 양쪽 끝에 붙은 불필요한 공백을 떼어내는 기능이다.

**정확한 정의**

`str.strip()`은 문자열의 시작과 끝에서 지정된 문자들을 제거한 새로운 문자열을 반환하는 문자열 메서드이며, 인자를 생략하면 공백 문자를 제거한다.

**직관적으로 보기**

```text
"   Radar   "
 ↑↑↑     ↑↑↑
 제거     제거
```

가운데의 `Radar`는 그대로 남는다.

**코드**

```python
raw = "   Radar   "
clean = raw.strip()
print(clean)
```

**한 줄씩 읽기**

- `raw = "   Radar   "`: 앞뒤에 공백이 있는 문자열을 `raw`라는 이름으로 사용한다.
- `raw.strip()`: `raw`가 가리키는 문자열의 양쪽 끝 공백을 제거한 새 문자열을 만든다.
- `clean = ...`: 새 문자열을 `clean`이라는 이름으로 사용한다.
- `print(clean)`: `clean`의 값을 화면에 출력한다.

**실행 흐름**

```text
raw
↓
"   Radar   "
↓
raw.strip()
↓
"Radar"
↓
clean = "Radar"
↓
print(clean)
↓
Radar
```

**헷갈리기 쉬운 점**

`strip()`은 가운데 공백까지 전부 삭제하는 기능이 아니다.

```python
text = "Hello Python"
print(text.strip())
```

결과는 여전히 `Hello Python`이다.

또한 문자열은 변경 가능한 상자처럼 직접 수정되는 것이 아니다.

```text
raw   → "   Radar   "
clean → "Radar"
```

`strip()`은 정리된 **새 문자열**을 반환한다.

---

## 11. Authority rule for automated/agent work

For every card:

```text
READ CONTRACT V1
      ↓
READ ONE CARD
      ↓
IDENTIFY THE ACTUAL TARGET CONCEPT
      ↓
REWRITE ONE CARD
      ↓
RUN THE PER-CARD CHECKLIST
      ↓
VALIDATE
      ↓
RECORD COMPLETION
      ↓
ONLY THEN MOVE TO THE NEXT CARD
```

The agent must not infer a new standard from its own previous outputs.

**This file is the authority.**
