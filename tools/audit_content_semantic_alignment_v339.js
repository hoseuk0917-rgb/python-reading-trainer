"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SEMANTICS = path.join(ROOT, "src", "pwa", "content_quality_semantics.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const EXPECTED_VERSION = "20260812_v339_quality3";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = fs.readFileSync(SEMANTICS, "utf8");
const appSource = fs.readFileSync(APP, "utf8");
const indexSource = fs.readFileSync(INDEX, "utf8");

const context = vm.createContext({
  window: {},
  module: { exports: {} },
  console,
  Set,
  String,
  Array,
  Object,
  Math,
  RegExp
});
vm.runInContext(source, context, { filename: "content_quality_semantics.js" });
const api = context.module.exports;
assert(api && api.version === "v339_r3", "semantic module API/version missing");
console.log("SEMANTIC_MODULE_API=PASS");

const info = {
  comment: {}, print: {}, indentation: {}, type: {}, str: {}, value: {}, if: {}, comparison: {}, bool: {},
  list: {}, index: {}, assignment: {}, variable: {}, function: {}, return: {}, path: {}, import: {}
};

const commentCard = {
  title: "주석 읽기",
  reading_goal: "# 뒤의 설명이 실행 결과에 영향을 주는지 읽는다.",
  question: "이 코드를 실행하면 무엇이 출력되는가?",
  code: '# 이 줄은 설명이다\nprint("hello")',
  concepts: ["comment", "print", "indentation"]
};
assert(api.pickPrimaryConcept(commentCard, commentCard.concepts, info) === "comment", "comment problem did not select comment concept");
console.log("COMMENT_PROBLEM_PRIMARY_CONCEPT=PASS");

const typeCard = {
  title: "자료형 이름 읽기",
  reading_goal: "문자열 값의 자료형 이름이 str로 표시되는 흐름을 읽는다.",
  question: "출력 결과는?",
  code: 'value = "hello"\nprint(type(value).__name__)',
  concepts: ["print", "str", "type", "value"]
};
assert(api.pickPrimaryConcept(typeCard, typeCard.concepts, info) === "type", "type problem was hijacked by print syntax");
console.log("TYPE_PROBLEM_PRIMARY_CONCEPT=PASS");

const assignmentCard = {
  title: "변수 다시 대입 읽기",
  reading_goal: "같은 변수에 다시 대입될 때 마지막 값이 어떻게 바뀌는지 읽는다.",
  question: "출력 결과는?",
  code: "x = 2\nx = x + 3\nprint(x)",
  concepts: ["print", "variable", "assignment"]
};
const assignmentPrimary = api.pickPrimaryConcept(assignmentCard, assignmentCard.concepts, info);
assert(["variable", "assignment"].includes(assignmentPrimary), "assignment problem was hijacked by print syntax");
console.log("ASSIGNMENT_PRIMARY_CONCEPT=PASS");

const unrelatedIndent = { id: "indent", related_concepts: ["indentation", "python"] };
const relatedComment = { id: "comment", related_concepts: ["comment", "python"] };
assert(api.isSideCardRelevant(commentCard, unrelatedIndent) === false, "unrelated indentation card considered relevant to comment problem");
assert(api.isSideCardRelevant(commentCard, relatedComment) === true, "comment side card not considered relevant");
console.log("COMMENT_SIDECARD_RELEVANCE=PASS");

const typeSystem = { related_concepts: ["type", "dynamic_typing"] };
const compiler = { related_concepts: ["compile", "interpreter", "python"] };
assert(api.isSideCardRelevant(typeCard, typeSystem) === true, "type side card not relevant to type problem");
assert(api.isSideCardRelevant(typeCard, compiler) === false, "compiler side card incorrectly relevant to type problem");
console.log("TYPE_SIDECARD_RELEVANCE=PASS");

assert(/window\.ContentQualitySemantics/.test(appSource), "app does not delegate to semantic module");
assert(/directIds\.map\(getSideCardById\)\.filter\(Boolean\)\.filter/.test(appSource), "direct side cards are not relevance-filtered");
assert(/const randomCard = null;/.test(appSource), "unrelated random background card is still active");
assert(!/const randomCard = pickRandomBackgroundCard\(excludeIds\);/.test(appSource), "old random background call remains active");
console.log("APP_RELEVANCE_POLICY=PASS");

const semanticTag = `./content_quality_semantics.js?v=${EXPECTED_VERSION}`;
const appTag = `./app.js?v=${EXPECTED_VERSION}`;
assert(indexSource.includes(semanticTag), "semantic module script tag missing");
assert(indexSource.includes(appTag), "app cache-bust tag missing");
assert(indexSource.indexOf(semanticTag) < indexSource.indexOf(appTag), "semantic module must load before app.js");
console.log("SCRIPT_ORDER_AND_CACHE_BUST=PASS");

console.log("RESULT=PASS_CONTENT_SEMANTIC_ALIGNMENT_V339_AUDIT");
