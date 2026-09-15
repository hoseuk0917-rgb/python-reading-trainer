#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = fs.readFileSync(path.join(ROOT, "src/pwa/app.js"), "utf8");
const semantics = require(path.join(ROOT, "src/pwa/content_quality_semantics.js"));
const engine = require(path.join(ROOT, "src/pwa/learning_engine_v340.js"));
const worked = require(path.join(ROOT, "src/pwa/worked_example_quality_v355.js"));

function conceptInfoKeys() {
  const begin = APP.indexOf("const conceptInfo = {");
  const endMarker = "// === CONTENT_QUALITY_FINAL_PASS_V339 END ===";
  const end = APP.indexOf(endMarker, begin);
  if (begin < 0 || end < 0) throw new Error("conceptInfo block not found");
  const block = APP.slice(begin, end);
  const keys = new Set();
  const re = /[\"']([^\"']+)[\"']\s*:\s*\{\s*definition\s*:/g;
  let m;
  while ((m = re.exec(block))) keys.add(m[1]);
  const out = {};
  keys.forEach((key) => { out[key] = { definition: "audit" }; });
  return out;
}

function lessonFileNames() {
  const patterns = [
    /const\s+lessonFiles\s*=\s*\[([\s\S]*?)\];/,
    /let\s+lessonFiles\s*=\s*\[([\s\S]*?)\];/,
    /lessonFiles\s*=\s*\[([\s\S]*?)\];/
  ];
  for (const re of patterns) {
    const m = APP.match(re);
    if (!m) continue;
    const names = [];
    const q = /[\"']([^\"']+\.json)[\"']/g;
    let hit;
    while ((hit = q.exec(m[1]))) names.push(path.basename(hit[1]));
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
    const p = path.join(dir, name);
    if (!fs.existsSync(p)) throw new Error(`${language}: missing lesson file ${name}`);
    const rows = JSON.parse(fs.readFileSync(p, "utf8"));
    if (!Array.isArray(rows)) throw new Error(`${language}: lesson file is not array ${name}`);
    rows.forEach((card) => cards.push(card));
  });
  return cards;
}

const KEYWORDS = new Set(["if", "for", "while", "def", "return", "with", "try", "except", "elif", "else", "lambda", "class"]);

function focusText(card) {
  return String(card.focus_span || card.target_statement || "").trim();
}

function isV23RichCard(card) {
  return Boolean(
    card &&
    card.authoring_version === "V2.3" &&
    card.concept_explanation &&
    card.teaching_example &&
    card.answer_explanation
  );
}

function syntaxSignals(card) {
  const text = focusText(card);
  const signals = [];
  const seen = new Set();
  function add(kind, value) {
    const key = `${kind}:${value}`;
    if (!seen.has(key)) { seen.add(key); signals.push({ kind, value, key }); }
  }

  const dotted = /\b(?:[A-Za-z_]\w*\.)+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = dotted.exec(text))) add("memberCall", m[1]);

  const simple = /(?<!\.)\b([A-Za-z_]\w*)\s*\(/g;
  while ((m = simple.exec(text))) {
    const name = m[1];
    if (!KEYWORDS.has(name)) add("call", name);
  }

  ["if", "for", "while", "def", "return", "with", "try", "except", "class", "lambda"].forEach((kw) => {
    if (new RegExp(`\\b${kw}\\b`).test(text)) add("keyword", kw);
  });

  const assignment = /(^|[^=!<>])=(?!=)/.test(text);
  if (assignment) add("syntax", "assignment");

  if (/\[[^\]]+\]/.test(text)) add("syntax", "subscription");
  return signals;
}

function selectedHasSignal(code, signal) {
  const text = String(code || "");
  const value = signal.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (signal.kind === "memberCall") return new RegExp(`\\.${value}\\s*\\(`).test(text);
  if (signal.kind === "call") return new RegExp(`(?<!\\.)\\b${value}\\s*\\(`).test(text);
  if (signal.kind === "keyword") return new RegExp(`\\b${value}\\b`).test(text);
  if (signal.kind === "syntax" && signal.value === "assignment") return /(^|[^=!<>])=(?!=)/m.test(text);
  if (signal.kind === "syntax" && signal.value === "subscription") return /\[[^\]]+\]/.test(text);
  return true;
}

function pickPrimary(card, conceptInfo) {
  try {
    return semantics.pickPrimaryConcept(card || {}, Array.isArray(card.concepts) ? card.concepts : [], conceptInfo);
  } catch (_) {
    return engine.pickPrimaryConcept(card || {}, conceptInfo);
  }
}

function choose(card, cards, index, primary) {
  const variants = [worked.EXAMPLES[primary], worked.ALTERNATES[primary]].filter(Boolean);
  for (const variant of variants) {
    if (worked.validateCurated(engine, card, cards, index, primary, variant)) {
      return variant;
    }
  }
  return null;
}

function auditLanguage(language, cards, conceptInfo) {
  const stats = {
    language,
    cards: cards.length,
    v23LegacyPanelSuppressed: 0,
    hasPanelCandidate: 0,
    selected: 0,
    assessable: 0,
    exactSyntaxPass: 0,
    exactSyntaxMismatch: 0,
    noFocusSignals: 0,
    teachingExampleMissing: 0,
    teachingExampleMalformed: 0,
    teachingFocusAssessable: 0,
    teachingFocusPass: 0,
    teachingFocusMismatch: 0,
  };
  const mismatches = [];
  const teachingMismatches = [];
  const byPrimary = new Map();

  cards.forEach((card, index) => {
    const teaching = card && card.teaching_example;
    if (!teaching || typeof teaching !== "object") stats.teachingExampleMissing += 1;
    else if (typeof teaching.code !== "string" || !teaching.code.trim() || typeof teaching.walkthrough !== "string" || !teaching.walkthrough.trim()) stats.teachingExampleMalformed += 1;

    const signals = syntaxSignals(card || {});
    if (signals.length && teaching && typeof teaching.code === "string" && teaching.code.trim()) {
      stats.teachingFocusAssessable += 1;
      const failedTeaching = signals.filter((s) => !selectedHasSignal(teaching.code, s));
      if (failedTeaching.length) {
        stats.teachingFocusMismatch += 1;
        teachingMismatches.push({
          id: String(card.id || ""),
          focus: focusText(card),
          failed: failedTeaching.map((s) => s.key),
          example: teaching.code.replace(/\n/g, "\\n")
        });
      } else stats.teachingFocusPass += 1;
    }

    if (isV23RichCard(card)) {
      stats.v23LegacyPanelSuppressed += 1;
      return;
    }

    const primary = pickPrimary(card || {}, conceptInfo);
    const variants = [worked.EXAMPLES[primary], worked.ALTERNATES[primary]].filter(Boolean);
    if (!variants.length) return;
    stats.hasPanelCandidate += 1;
    const selected = choose(card, cards, index, primary);
    if (!selected) return;
    stats.selected += 1;
    byPrimary.set(primary, (byPrimary.get(primary) || 0) + 1);

    if (!signals.length) {
      stats.noFocusSignals += 1;
      return;
    }
    stats.assessable += 1;
    const failed = signals.filter((s) => !selectedHasSignal(selected.code, s));
    if (!failed.length) {
      stats.exactSyntaxPass += 1;
      return;
    }
    stats.exactSyntaxMismatch += 1;
    mismatches.push({
      id: String(card.id || ""),
      index,
      primary,
      concepts: Array.isArray(card.concepts) ? card.concepts : [],
      focus: focusText(card),
      signals: signals.map((s) => s.key),
      failed: failed.map((s) => s.key),
      selected: selected.code.replace(/\n/g, "\\n")
    });
  });

  console.log(`=== ${language.toUpperCase()} EFFECTIVE SAME-SYNTAX AUDIT ===`);
  Object.entries(stats).forEach(([k, v]) => console.log(`${k.toUpperCase()}=${v}`));
  console.log("PRIMARY_SELECTION_COUNTS=" + JSON.stringify(Object.fromEntries([...byPrimary.entries()].sort((a,b) => b[1]-a[1]))));
  console.log("--- CONFIRMED EFFECTIVE PANEL MISMATCHES ---");
  mismatches.forEach((row) => console.log("PANEL_MISMATCH|" + JSON.stringify(row)));
  console.log("--- TEACHING EXAMPLE FOCUS MISMATCH CANDIDATES ---");
  teachingMismatches.forEach((row) => console.log("TEACHING_MISMATCH|" + JSON.stringify(row)));
  return { stats, mismatches, teachingMismatches };
}

function main() {
  console.log("=== EFFECTIVE SAME-SYNTAX V400 EXHAUSTIVE AUDIT ===");
  console.log("READ_ONLY=True");
  console.log("RUNTIME_SELECTION_EMULATION=True");
  console.log("BROWSER_EXECUTION=False");

  const info = conceptInfoKeys();
  const fileNames = lessonFileNames();
  console.log(`CONCEPT_INFO_KEY_COUNT=${Object.keys(info).length}`);
  console.log(`LESSON_FILE_COUNT=${fileNames.length}`);

  const koCards = loadCards("ko", fileNames);
  const enCards = loadCards("en", fileNames);
  const ko = auditLanguage("ko", koCards, info);
  const en = auditLanguage("en", enCards, info);

  console.log("=== SUMMARY ===");
  console.log(`KO_CARD_COUNT=${ko.stats.cards}`);
  console.log(`EN_CARD_COUNT=${en.stats.cards}`);
  console.log(`TOTAL_CARD_VARIANTS=${ko.stats.cards + en.stats.cards}`);
  console.log(`KO_V23_LEGACY_PANEL_SUPPRESSED_COUNT=${ko.stats.v23LegacyPanelSuppressed}`);
  console.log(`EN_V23_LEGACY_PANEL_SUPPRESSED_COUNT=${en.stats.v23LegacyPanelSuppressed}`);
  console.log(`KO_EFFECTIVE_PANEL_MISMATCH_COUNT=${ko.stats.exactSyntaxMismatch}`);
  console.log(`EN_EFFECTIVE_PANEL_MISMATCH_COUNT=${en.stats.exactSyntaxMismatch}`);
  console.log(`KO_TEACHING_FOCUS_MISMATCH_COUNT=${ko.stats.teachingFocusMismatch}`);
  console.log(`EN_TEACHING_FOCUS_MISMATCH_COUNT=${en.stats.teachingFocusMismatch}`);
  const legacyMismatchTotal = ko.stats.exactSyntaxMismatch + en.stats.exactSyntaxMismatch;
  if (legacyMismatchTotal !== 0) {
    console.log(`LEGACY_PANEL_MISMATCH_TOTAL=${legacyMismatchTotal}`);
    console.log("LEGACY_PANEL_INVARIANT_PASS=False");
    process.exitCode = 1;
    return;
  }
  console.log("LEGACY_PANEL_MISMATCH_TOTAL=0");
  console.log("LEGACY_PANEL_INVARIANT_PASS=True");
  console.log("RESULT=AUDIT_COMPLETE");
}

main();
