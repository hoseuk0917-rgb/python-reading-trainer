"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const engine = require("../src/pwa/learning_engine_v340.js");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const appText = fs.readFileSync(APP, "utf8");

function extractBalancedObject(text, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1] || "";

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === "\"" || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return { source: text.slice(openIndex, i + 1), end: i + 1 };
    }
  }
  throw new Error("Unbalanced object literal at index " + openIndex);
}

function evalObject(source) {
  return vm.runInNewContext("(" + source + ")", Object.create(null), { timeout: 2000 });
}

function loadConceptInfo() {
  const marker = "const conceptInfo =";
  const start = appText.indexOf(marker);
  if (start < 0) throw new Error("conceptInfo marker not found");
  const open = appText.indexOf("{", start + marker.length);
  const first = extractBalancedObject(appText, open);
  const info = Object.assign({}, evalObject(first.source));

  const assignMarker = "Object.assign(conceptInfo,";
  let cursor = first.end;
  while (true) {
    const hit = appText.indexOf(assignMarker, cursor);
    if (hit < 0) break;
    const objectOpen = appText.indexOf("{", hit + assignMarker.length);
    if (objectOpen < 0) throw new Error("Object.assign conceptInfo object missing");
    const block = extractBalancedObject(appText, objectOpen);
    Object.assign(info, evalObject(block.source));
    cursor = block.end;
  }
  return info;
}

function lessonPaths() {
  return Array.from(appText.matchAll(/"(\.\.\/\.\.\/data\/lessons\/[^\"]+\.json)"/g), (m) => m[1]);
}

function loadCards(lang) {
  const out = [];
  for (const rel of lessonPaths()) {
    const localized = lang === "en" ? rel.replace("../../data/", "../../data_i18n/en/") : rel;
    const full = path.resolve(path.dirname(APP), localized);
    if (!fs.existsSync(full)) throw new Error("Missing " + lang + " lesson file: " + localized);
    const data = JSON.parse(fs.readFileSync(full, "utf8").replace(/^\uFEFF/, ""));
    if (!Array.isArray(data)) throw new Error("Lesson file is not an array: " + localized);
    for (const card of data) out.push(Object.assign({ __file: localized }, card));
  }
  return out;
}

function compactCode(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function noWhitespace(value) {
  return compactCode(value).replace(/\s+/g, "");
}

function levenshtein(a, b) {
  const aa = String(a || "");
  const bb = String(b || "");
  if (aa === bb) return 0;
  if (!aa.length) return bb.length;
  if (!bb.length) return aa.length;
  let prev = Array.from({ length: bb.length + 1 }, (_, i) => i);
  for (let i = 1; i <= aa.length; i += 1) {
    const cur = [i];
    for (let j = 1; j <= bb.length; j += 1) {
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[bb.length];
}

function similarity(a, b) {
  const aa = noWhitespace(a);
  const bb = noWhitespace(b);
  const max = Math.max(aa.length, bb.length);
  if (!max) return 1;
  return 1 - levenshtein(aa, bb) / max;
}

function classify(card, example) {
  const problem = compactCode(card && card.code);
  const sample = compactCode(example && example.code);
  if (!problem || !sample) return null;
  if (problem === sample) return { severity: "EXACT", similarity: 1 };
  if (noWhitespace(problem) === noWhitespace(sample)) return { severity: "WHITESPACE_ONLY", similarity: 1 };
  const sim = similarity(problem, sample);
  if (Math.min(noWhitespace(problem).length, noWhitespace(sample).length) >= 20 && sim >= 0.92) {
    return { severity: "NEAR", similarity: sim };
  }
  return null;
}

function auditLanguage(lang, cards, conceptInfo) {
  const findings = [];
  const sourceCounts = Object.create(null);
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const primary = engine.pickPrimaryConcept(card, conceptInfo);
    const example = engine.pickSafeExample(card, cards, index, conceptInfo, primary);
    if (!example || !example.code) continue;
    sourceCounts[example.source || "unknown"] = (sourceCounts[example.source || "unknown"] || 0) + 1;
    const match = classify(card, example);
    if (match || example.source === "current-card") {
      findings.push({
        lang,
        index: index + 1,
        id: card.id,
        file: card.__file,
        title: card.title,
        primary,
        exampleConcept: example.concept || "",
        exampleSource: example.source || "",
        severity: match ? match.severity : "FALLBACK_CURRENT_CARD",
        similarity: match ? Number(match.similarity.toFixed(4)) : 1,
        problemCode: compactCode(card.code),
        exampleCode: compactCode(example.code)
      });
    }
  }
  return { lang, cards: cards.length, findings, sourceCounts };
}

const conceptInfo = loadConceptInfo();
const koCards = loadCards("ko");
const enCards = loadCards("en");
const ko = auditLanguage("ko", koCards, conceptInfo);
const en = auditLanguage("en", enCards, conceptInfo);
const all = ko.findings.concat(en.findings);

const bySeverity = all.reduce((acc, row) => {
  acc[row.severity] = (acc[row.severity] || 0) + 1;
  return acc;
}, {});
const idsKo = new Set(ko.findings.map((row) => row.id));
const idsEn = new Set(en.findings.map((row) => row.id));
const parityBoth = Array.from(idsKo).filter((id) => idsEn.has(id)).length;
const koOnly = Array.from(idsKo).filter((id) => !idsEn.has(id));
const enOnly = Array.from(idsEn).filter((id) => !idsKo.has(id));

console.log("=== V352 WORKED EXAMPLE FULL CORPUS AUDIT ===");
console.log("ENGINE_VERSION=" + engine.VERSION);
console.log("CONCEPT_INFO_COUNT=" + Object.keys(conceptInfo).length);
console.log("LESSON_FILES=" + lessonPaths().length);
console.log("KO_CARDS=" + ko.cards);
console.log("EN_CARDS=" + en.cards);
console.log("KO_FINDINGS=" + ko.findings.length);
console.log("EN_FINDINGS=" + en.findings.length);
console.log("TOTAL_FINDINGS=" + all.length);
console.log("SEVERITY_COUNTS=" + JSON.stringify(bySeverity));
console.log("KO_SOURCE_COUNTS=" + JSON.stringify(ko.sourceCounts));
console.log("EN_SOURCE_COUNTS=" + JSON.stringify(en.sourceCounts));
console.log("FINDING_ID_PARITY_BOTH=" + parityBoth);
console.log("KO_ONLY_IDS=" + koOnly.length);
console.log("EN_ONLY_IDS=" + enOnly.length);

for (const row of all) {
  console.log("FINDING=" + JSON.stringify(row));
}

console.log("RESULT=PASS_V352_AUDIT_COMPLETED");
