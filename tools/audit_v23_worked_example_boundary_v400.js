#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const APP = fs.readFileSync(path.join(ROOT, "src/pwa/app.js"), "utf8");
const RUNTIME_PATH = path.join(ROOT, "src/pwa/worked_example_quality_v355_r2.js");
const RUNTIME_SOURCE = fs.readFileSync(RUNTIME_PATH, "utf8");

function lessonFileNames() {
  const patterns = [
    /const\s+lessonFiles\s*=\s*\[([\s\S]*?)\];/,
    /let\s+lessonFiles\s*=\s*\[([\s\S]*?)\];/,
    /lessonFiles\s*=\s*\[([\s\S]*?)\];/
  ];
  for (const re of patterns) {
    const match = APP.match(re);
    if (!match) continue;
    const names = [];
    const quoted = /["']([^"']+\.json)["']/g;
    let hit;
    while ((hit = quoted.exec(match[1]))) names.push(path.basename(hit[1]));
    if (names.length) return names;
  }
  throw new Error("lessonFiles array not found");
}

function loadCards(language, fileNames) {
  const dir = language === "en"
    ? path.join(ROOT, "data_i18n/en/lessons")
    : path.join(ROOT, "data/lessons");
  const cards = [];
  fileNames.forEach((name) => {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) throw new Error(`${language}: missing lesson file ${name}`);
    const rows = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(rows)) throw new Error(`${language}: lesson file is not array ${name}`);
    rows.forEach((card) => cards.push(card));
  });
  return cards;
}

function isV23(card) {
  return Boolean(card && card.authoring_version === "V2.3");
}

function isV23Rich(card) {
  return Boolean(
    isV23(card) &&
    card.concept_explanation && typeof card.concept_explanation === "object" &&
    card.teaching_example && typeof card.teaching_example === "object" &&
    card.answer_explanation && typeof card.answer_explanation === "object"
  );
}

function classList(initial) {
  const values = new Set(initial || []);
  return {
    add(...names) { names.forEach((name) => values.add(name)); },
    remove(...names) { names.forEach((name) => values.delete(name)); },
    contains(name) { return values.has(name); }
  };
}

function makeRuntimeHarness(cards, language) {
  let pickerCalls = 0;
  const attributes = new Map();
  const resultBox = {
    classList: classList([]),
    textContent: language === "en" ? "Correct" : "정답"
  };
  const workedBox = {
    classList: classList(["worked-v355-ready"]),
    dataset: {},
    childNodes: [],
    innerHTML: "",
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); },
    querySelector() { return null; }
  };

  const document = {
    readyState: "loading",
    documentElement: { lang: language === "en" ? "en" : "ko", dataset: {} },
    body: {},
    addEventListener() {},
    getElementById(id) {
      if (id === "resultBox") return resultBox;
      if (id === "workedExampleV355") return workedBox;
      if (id === "workedExampleV340") return null;
      return null;
    }
  };

  const context = {
    console,
    document,
    cards,
    currentIndex: 0,
    conceptInfo: {},
    requestAnimationFrame(fn) { if (typeof fn === "function") fn(); },
    setTimeout() {},
    MutationObserver: function MutationObserver() {
      this.observe = function () {};
      this.disconnect = function () {};
    },
    LearningEngineV340: {
      pickSafeExample() {
        pickerCalls += 1;
        return { concept: "assignment", code: "count = 4\ncount = 9\nprint(count)", output: "9" };
      },
      pickPrimaryConcept() { return "assignment"; }
    }
  };
  context.window = context;

  vm.createContext(context);
  vm.runInContext(RUNTIME_SOURCE, context, { filename: RUNTIME_PATH });

  const api = context.WorkedExampleQualityV355R2;
  if (!api || typeof api.reconcileWorkedExample !== "function") {
    throw new Error("WorkedExampleQualityV355R2.reconcileWorkedExample unavailable");
  }

  return {
    context,
    api,
    workedBox,
    attributes,
    pickerCalls() { return pickerCalls; }
  };
}

function auditLanguage(language, cards) {
  const v23Cards = cards.filter(isV23);
  const richCards = cards.filter(isV23Rich);
  const malformed = v23Cards.filter((card) => !isV23Rich(card));

  console.log(`=== ${language.toUpperCase()} V23 WORKED EXAMPLE BOUNDARY ===`);
  console.log(`CARD_COUNT=${cards.length}`);
  console.log(`V23_CARD_COUNT=${v23Cards.length}`);
  console.log(`V23_RICH_CARD_COUNT=${richCards.length}`);
  console.log(`V23_MALFORMED_RICH_COUNT=${malformed.length}`);

  if (malformed.length) {
    malformed.slice(0, 50).forEach((card) => {
      console.log(`V23_MALFORMED|ID=${String(card && card.id || "")}`);
    });
    throw new Error(`${language}: V2.3 card missing rich teaching fields`);
  }

  const harness = makeRuntimeHarness(cards, language);
  let suppressed = 0;
  cards.forEach((card, index) => {
    if (!isV23Rich(card)) return;
    harness.context.currentIndex = index;
    harness.workedBox.classList.remove("hidden");
    harness.workedBox.classList.add("worked-v355-ready");
    harness.attributes.set("aria-hidden", "false");

    const beforePickerCalls = harness.pickerCalls();
    const result = harness.api.reconcileWorkedExample();
    const afterPickerCalls = harness.pickerCalls();

    if (result !== false) {
      throw new Error(`${language}:${card.id}: V2.3 reconcile must return false`);
    }
    if (afterPickerCalls !== beforePickerCalls) {
      throw new Error(`${language}:${card.id}: legacy pickSafeExample was called`);
    }
    if (!harness.workedBox.classList.contains("hidden")) {
      throw new Error(`${language}:${card.id}: legacy worked-example box remained visible`);
    }
    if (harness.attributes.get("aria-hidden") !== "true") {
      throw new Error(`${language}:${card.id}: legacy worked-example aria-hidden is not true`);
    }
    suppressed += 1;
  });

  console.log(`RUNTIME_V23_SUPPRESSED_COUNT=${suppressed}`);
  console.log(`LEGACY_PICKER_CALL_COUNT=${harness.pickerCalls()}`);

  if (suppressed !== richCards.length) {
    throw new Error(`${language}: runtime suppression count mismatch`);
  }
  if (harness.pickerCalls() !== 0) {
    throw new Error(`${language}: legacy picker executed for V2.3 cards`);
  }

  return { cards: cards.length, v23: v23Cards.length, rich: richCards.length, suppressed };
}

function main() {
  console.log("=== V23 WORKED EXAMPLE BOUNDARY V400 AUDIT ===");
  console.log("RUNTIME_SOURCE_EXECUTION=True");
  console.log("BROWSER_EXECUTION=False");

  const fileNames = lessonFileNames();
  const ko = auditLanguage("ko", loadCards("ko", fileNames));
  const en = auditLanguage("en", loadCards("en", fileNames));

  console.log("=== SUMMARY ===");
  console.log(`LESSON_FILE_COUNT=${fileNames.length}`);
  console.log(`KO_CARD_COUNT=${ko.cards}`);
  console.log(`EN_CARD_COUNT=${en.cards}`);
  console.log(`TOTAL_CARD_VARIANTS=${ko.cards + en.cards}`);
  console.log(`KO_V23_RUNTIME_SUPPRESSED_COUNT=${ko.suppressed}`);
  console.log(`EN_V23_RUNTIME_SUPPRESSED_COUNT=${en.suppressed}`);
  console.log("RESULT=PASS_V23_WORKED_EXAMPLE_BOUNDARY");
}

main();
