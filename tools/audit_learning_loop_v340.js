"use strict";

const assert = require("assert");
const engine = require("../src/pwa/learning_engine_v340.js");

function pass(name) {
  console.log(name + "=PASS");
}

const cards = [
  { id: "c1", title: "print", question: "원래 질문 1", answer: "A", concepts: ["print"], code: "print('a')" },
  { id: "c2", title: "variable", question: "원래 질문 2", answer: "B", concepts: ["variable"], code: "x = 1\nprint(x)" },
  { id: "c3", title: "if", question: "원래 질문 3", answer: "C", concepts: ["if"], code: "if x:\n    print(x)" },
  { id: "c4", title: "def", question: "원래 질문 4", answer: "D", concepts: ["def"], code: "def f():\n    print('x')" },
  { id: "c5", title: "return", question: "원래 질문 5", answer: "E", concepts: ["return"], code: "def f():\n    return 1" }
];

const conceptInfo = {
  print: { definition: "print는 값을 화면에 출력한다.", example: "print('hello')" },
  len: { definition: "len은 항목 개수를 돌려준다.", example: "items = ['a', 'b']\nprint(len(items))" },
  list: { definition: "list는 여러 값을 순서대로 담는다.", example: "items = ['a', 'b']\nprint(items[0])" },
  variable: { definition: "변수는 값을 가리키는 이름이다.", example: "x = 1\nprint(x)" },
  if: { definition: "if는 조건이 참일 때 블록을 실행한다.", example: "if True:\n    print('yes')" },
  def: { definition: "def는 함수를 정의한다.", example: "def hello():\n    return 'hi'" },
  return: { definition: "return은 함수 실행을 끝내고 값을 돌려준다.", example: "def one():\n    return 1" }
};

assert.strictEqual(engine.VERSION, "v340_a1");
pass("ENGINE_VERSION");

const viewedButNotAnswered = {
  seen: { c1: 1, c2: 1 },
  correct: { c1: 1 },
  confused: {},
  lastSeenAt: {}
};
assert.strictEqual(engine.firstUnseenIndex(cards, viewedButNotAnswered), 1, "viewing alone must not advance fixed sequence");
pass("FIXED_SEQUENCE_IGNORES_VIEW_ONLY");

const progress = {
  seen: { c1: 1, c2: 1 },
  correct: { c1: 1 },
  confused: { c2: 1 },
  lastSeenAt: {}
};
assert.strictEqual(engine.firstUnseenIndex(cards, progress), 2);
pass("FIXED_SEQUENCE_ADVANCES_AFTER_ATTEMPT");

const allowedAt2 = engine.allowedConceptsAt(cards, 2);
assert(allowedAt2.has("print") && allowedAt2.has("variable") && allowedAt2.has("if"));
assert(!allowedAt2.has("def") && !allowedAt2.has("return"));
pass("CURRENT_AND_PREVIOUS_CONCEPT_BOUNDARY");

const firstMap = engine.conceptFirstIndex(cards);
assert.strictEqual(firstMap.print, 0);
assert.strictEqual(firstMap.return, 4);
pass("CONCEPT_FIRST_INDEX");

const now = 1_700_000_000_000;
let reviewState = engine.scheduleWrong({}, "c2", now);
assert.strictEqual(reviewState.c2.dueAt, now);
assert.strictEqual(reviewState.c2.stage, 0);
pass("WRONG_SCHEDULES_VARIANT_REVIEW");

const session = engine.buildSequentialSession(cards, progress, reviewState, { size: 4, reviewSlots: 1, now });
assert.strictEqual(session.items[0].type, "review");
assert.strictEqual(session.items[0].cardId, "c2");
const newItems = session.items.filter((item) => item.type === "new");
assert.deepStrictEqual(newItems.map((item) => item.cardId), ["c3", "c4", "c5"]);
pass("TODAY_SESSION_PRESERVES_NEW_CARD_ORDER");

const variant = engine.makeReviewVariant(cards[1], cards, 1, conceptInfo, reviewState.c2);
assert.notStrictEqual(variant.question, cards[1].question);
assert.notStrictEqual(String(variant.answer), String(cards[1].answer));
assert(variant.choices.includes(variant.answer));
pass("REVIEW_IS_NOT_ORIGINAL_QA_REPEAT");

reviewState = engine.scheduleReviewResult(reviewState, "c2", true, now);
assert.strictEqual(reviewState.c2.stage, 1);
assert.strictEqual(reviewState.c2.dueAt, now + 24 * 60 * 60 * 1000);
reviewState = engine.scheduleReviewResult(reviewState, "c2", true, reviewState.c2.dueAt);
assert.strictEqual(reviewState.c2.stage, 2);
assert.strictEqual(reviewState.c2.dueAt, now + 4 * 24 * 60 * 60 * 1000);
pass("SPACED_REVIEW_1D_3D");

const safeExample = engine.pickSafeExample(cards[2], cards, 2, conceptInfo);
assert(safeExample && safeExample.code);
assert(engine.exampleUsesOnlyKnownNamedSyntax(safeExample.code, allowedAt2));
pass("WORKED_EXAMPLE_USES_KNOWN_NAMED_SYNTAX");

const mixedCard = {
  id: "mixed_len",
  title: "len()으로 개수 읽기",
  question: "len(items)의 출력은?",
  answer: "2",
  concepts: ["print", "len", "list"],
  code: "items = ['a', 'b']\nprint(len(items))"
};
const mixedCards = [mixedCard];
const primaryExample = engine.pickSafeExample(mixedCard, mixedCards, 0, conceptInfo, "len");
assert.strictEqual(primaryExample.concept, "len");
assert(/\blen\s*\(/.test(primaryExample.code));
pass("WORKED_EXAMPLE_PRIORITIZES_PRIMARY_CONCEPT");

const primaryReview = engine.makeReviewVariant(mixedCard, mixedCards, 0, conceptInfo, { stage: 0, lapses: 1 }, "len");
assert.strictEqual(primaryReview.primaryConcept, "len");
assert.strictEqual(primaryReview.answer, "len");
assert.notStrictEqual(primaryReview.question, mixedCard.question);
pass("VARIANT_REVIEW_USES_PRIMARY_CONCEPT");

const defAllowed = engine.allowedConceptsAt(cards, 3);
const unsafeDefExample = conceptInfo.def.example;
assert.strictEqual(engine.exampleUsesOnlyKnownNamedSyntax(unsafeDefExample, defAllowed), false, "def example contains future return syntax and must be rejected");
pass("FUTURE_NAMED_SYNTAX_REJECTED");

const hits = engine.syntaxHits("if True:\n    print('x')", allowedAt2);
assert(hits.some((hit) => hit.concept === "if"));
assert(hits.some((hit) => hit.concept === "print"));
assert(!hits.some((hit) => hit.concept === "def"));
pass("CLICKABLE_SYNTAX_RESPECTS_LEARNED_BOUNDARY");

console.log("RESULT=PASS_LEARNING_LOOP_V340_AUDIT");
