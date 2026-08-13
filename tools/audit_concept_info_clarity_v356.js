#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('src/pwa/app.js', 'utf8');
const anchor = 'const conceptInfo = {';
const start = source.indexOf(anchor);
if (start < 0) throw new Error('CONCEPT_INFO_NOT_FOUND');
const objStart = source.indexOf('{', start);
let depth = 0;
let quote = null;
let escaped = false;
let end = -1;
for (let i = objStart; i < source.length; i += 1) {
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
    if (depth === 0) { end = i + 1; break; }
  }
}
if (end < 0) throw new Error('CONCEPT_INFO_PARSE_END_NOT_FOUND');
const literal = source.slice(objStart, end);
const conceptInfo = vm.runInNewContext('(' + literal + ')', {}, {timeout: 1000});
const keys = Object.keys(conceptInfo);
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
  reviewed.push({concept: key, reviewed: true, status: reasons.length ? 'needs_fix' : 'clear', reasons});
  if (reasons.length) failures.push(key + ':' + reasons.join('+'));
}
console.log('V356_CONCEPT_INFO_COUNT=' + keys.length);
console.log('V356_CONCEPT_INFO_REVIEWED=' + reviewed.length);
console.log('V356_CONCEPT_INFO_FAILURES=' + failures.length);
for (const item of failures) console.log('V356_CONCEPT_INFO_FAILURE=' + item);
if (keys.length !== 65) throw new Error('EXPECTED_65_CONCEPTS_ACTUAL_' + keys.length);
if (failures.length) throw new Error('CONCEPT_INFO_CLARITY_FAILURE');
console.log('RESULT=PASS_V356_CONCEPT_INFO_65');
