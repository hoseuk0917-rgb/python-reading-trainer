#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('src/pwa/app.js', 'utf8');
const REPORT = 'docs/audit/v356_concept_info_review.json';

function extractObjectAt(braceIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = braceIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { literal: source.slice(braceIndex, i + 1), end: i + 1 };
    }
  }
  throw new Error('OBJECT_END_NOT_FOUND_AT_' + braceIndex);
}

function blockRanges(pattern) {
  const ranges = [];
  let match;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(source))) {
    const brace = source.indexOf('{', match.index);
    if (brace < 0) continue;
    const obj = extractObjectAt(brace);
    ranges.push([match.index, obj.end]);
    pattern.lastIndex = obj.end;
  }
  return ranges;
}

function inRanges(pos, ranges) {
  return ranges.some(([start, end]) => pos >= start && pos < end);
}

const anchor = 'const conceptInfo = {';
const anchorPos = source.indexOf(anchor);
if (anchorPos < 0) throw new Error('CONCEPT_INFO_NOT_FOUND');
const initialBrace = source.indexOf('{', anchorPos);
const initial = extractObjectAt(initialBrace);
const conceptInfo = vm.runInNewContext('(' + initial.literal + ')', {}, {timeout: 1000});

const englishRanges = blockRanges(/if\s*\(\s*currentLanguage\s*===\s*["']en["']\s*\)\s*\{/g);
const assignPattern = /Object\.assign\(conceptInfo,\s*\{/g;
let match;
let appliedBlocks = 0;
while ((match = assignPattern.exec(source))) {
  if (inRanges(match.index, englishRanges)) continue;
  const brace = source.indexOf('{', match.index);
  const obj = extractObjectAt(brace);
  const payload = vm.runInNewContext('(' + obj.literal + ')', {}, {timeout: 1000});
  Object.assign(conceptInfo, payload);
  appliedBlocks += 1;
  assignPattern.lastIndex = obj.end;
}

const keys = Object.keys(conceptInfo).sort();
const failures = [];
const reviewed = [];
for (const key of keys) {
  const row = conceptInfo[key] || {};
  const definition = String(row.definition || '').replace(/\s+/g, ' ').trim();
  const example = String(row.example || '').trim();
  const reasons = [];
  if (definition.length < 38) reasons.push('definition_too_short');
  if (!example) reasons.push('example_missing');
  if (/특히 .{0,100}조심해야/.test(definition)) reasons.push('generic_caution');
  if (/가리키는 이름/.test(definition)) reasons.push('abstract_pointer_language');
  if (/자료구조다[.]?$/.test(definition) && !/(값|항목|key|키|순서|중복|위치)/.test(definition)) reasons.push('technical_only_definition');
  reviewed.push({
    concept: key,
    reviewed: true,
    status: reasons.length ? 'needs_fix' : 'clear',
    reasons,
    definition,
    example,
  });
  if (reasons.length) failures.push(key + ':' + reasons.join('+'));
}

fs.mkdirSync('docs/audit', {recursive: true});
fs.writeFileSync(REPORT, JSON.stringify({
  version: 'v356-full',
  language: 'ko',
  effectiveConceptCount: keys.length,
  unconditionalExtensionBlocks: appliedBlocks,
  reviewed: keys.length,
  concepts: reviewed,
}, null, 2) + '\n', 'utf8');

console.log('V356_CONCEPT_INFO_EFFECTIVE_COUNT=' + keys.length);
console.log('V356_CONCEPT_INFO_EXTENSION_BLOCKS=' + appliedBlocks);
console.log('V356_CONCEPT_INFO_REVIEWED=' + reviewed.length);
console.log('V356_CONCEPT_INFO_FAILURES=' + failures.length);
for (const item of failures) console.log('V356_CONCEPT_INFO_FAILURE=' + item);
if (keys.length < 25) throw new Error('CONCEPT_INFO_EFFECTIVE_SET_TOO_SMALL_' + keys.length);
if (reviewed.length !== keys.length) throw new Error('CONCEPT_INFO_REVIEW_COVERAGE_MISMATCH');
if (failures.length) throw new Error('CONCEPT_INFO_CLARITY_FAILURE');
console.log('RESULT=PASS_V356_CONCEPT_INFO_EFFECTIVE_SET');
