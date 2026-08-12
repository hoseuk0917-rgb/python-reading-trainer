const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = fs.readFileSync(path.join(ROOT, 'src/pwa/app.js'), 'utf8');
const INDEX = fs.readFileSync(path.join(ROOT, 'src/pwa/index.html'), 'utf8');
const EXPERIENCE = fs.readFileSync(path.join(ROOT, 'src/pwa/learning_experience_v341.js'), 'utf8');
const engine = require(path.join(ROOT, 'src/pwa/learning_engine_v341.js'));
const semantics = require(path.join(ROOT, 'src/pwa/content_quality_semantics.js'));

function fail(message) { errors.push(message); }
function pass(name, detail) { console.log(`${name}=PASS${detail == null ? '' : ` DETAIL=${detail}`}`); }
function note(name, detail) { console.log(`${name}=INFO DETAIL=${detail}`); }
function norm(v) { return String(v == null ? '' : v).trim().toLowerCase(); }

const errors = [];

function extractArray(source, constName) {
  const marker = `const ${constName} = [`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`ARRAY_NOT_FOUND:${constName}`);
  const end = source.indexOf('];', start);
  if (end < 0) throw new Error(`ARRAY_END_NOT_FOUND:${constName}`);
  const body = source.slice(start + marker.length, end);
  return Array.from(body.matchAll(/["']([^"']+\.json)["']/g)).map(m => m[1]);
}

function repoPathFromApp(p) {
  return p.replace(/^\.\.\/\.\.\//, '');
}

function loadCards(locale) {
  const lessonFiles = extractArray(APP, 'lessonFiles');
  const rootPrefix = locale === 'en' ? 'data_i18n/en/' : 'data/';
  const cards = [];
  for (const item of lessonFiles) {
    let repoPath = repoPathFromApp(item);
    if (locale === 'en') repoPath = repoPath.replace(/^data\//, rootPrefix);
    const full = path.join(ROOT, repoPath);
    const rows = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!Array.isArray(rows)) throw new Error(`LESSON_NOT_ARRAY:${repoPath}`);
    rows.forEach(card => cards.push(card));
  }
  return { lessonFiles, cards };
}

const ko = loadCards('ko');
const en = loadCards('en');
const cards = ko.cards;

if (cards.length !== 1785) fail(`KO_CARD_COUNT:${cards.length}`); else pass('KO_CARD_COUNT', cards.length);
if (en.cards.length !== cards.length) fail(`EN_CARD_COUNT:${en.cards.length}`); else pass('EN_CARD_COUNT', en.cards.length);
const idParity = cards.every((card, i) => en.cards[i] && en.cards[i].id === card.id);
if (!idParity) fail('KO_EN_ORDER_ID_PARITY'); else pass('KO_EN_ORDER_ID_PARITY', cards.length);

const allConcepts = new Set();
cards.forEach(card => (card.concepts || []).forEach(c => allConcepts.add(String(c))));
const conceptInfoProxy = {};
allConcepts.forEach(c => { conceptInfoProxy[c] = true; });
function primary(card) {
  return semantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfoProxy);
}

const primaryCounts = new Map();
cards.forEach(card => {
  const p = norm(primary(card));
  if (p) primaryCounts.set(p, (primaryCounts.get(p) || 0) + 1);
});
pass('PRIMARY_CONCEPT_RESOLVED', `${primaryCounts.size} unique`);

function moduleForConcept(concept) {
  const key = norm(concept);
  const family = engine.familyOf(key);
  return engine.PRACTICE_MODULES.find(module =>
    (module.matchConcepts || []).map(norm).includes(key) ||
    (module.matchFamilies || []).includes(family)
  ) || null;
}

const unmappedPrimary = Array.from(primaryCounts.entries())
  .filter(([concept]) => !moduleForConcept(concept))
  .sort((a,b) => b[1]-a[1]);
if (unmappedPrimary.length) {
  fail(`UNMAPPED_PRIMARY_CONCEPTS:${unmappedPrimary.map(([c,n]) => `${c}:${n}`).join(',')}`);
} else pass('ALL_PRIMARY_CONCEPTS_HAVE_PRACTICE_MODULE', primaryCounts.size);

const mastery = engine.conceptMastery(cards, {seen:{},correct:{},confused:{}}, {}, card => primary(card));
const masteryNames = new Set(mastery.map(row => String(row.concept)));
const missingMastery = Array.from(allConcepts).filter(c => !masteryNames.has(c));
if (missingMastery.length) fail(`MASTERY_MISSING_CONCEPTS:${missingMastery.join(',')}`); else pass('MASTERY_COVERS_ALL_CARD_CONCEPTS', mastery.length);
note('MASTERY_UNIQUE_CONCEPTS', mastery.length);
const uiLimit = /mastery\.slice\(0,\s*80\)/.test(EXPERIENCE);
if (uiLimit && mastery.length > 80) fail(`MASTERY_UI_TRUNCATES:${mastery.length}->80`);
else pass('MASTERY_UI_NOT_TRUNCATED', `${mastery.length}`);

const totalExpectedCheckpoints = Math.ceil(cards.length / engine.CHECKPOINT_INTERVAL);
const currentUnlockedAtEnd = engine.unlockedCheckpointCount(cards.length);
if (currentUnlockedAtEnd !== totalExpectedCheckpoints) {
  fail(`FINAL_TAIL_CHECKPOINT_UNREACHABLE:expected=${totalExpectedCheckpoints},actual=${currentUnlockedAtEnd},tail=${cards.length % engine.CHECKPOINT_INTERVAL}`);
} else pass('FINAL_TAIL_CHECKPOINT_REACHABLE', currentUnlockedAtEnd);

const KNOWN_SYNTAX = [
  ['print', /\bprint\s*\(/], ['len', /\blen\s*\(/], ['range', /\brange\s*\(/],
  ['append', /\.append\s*\(/], ['get', /\.get\s*\(/], ['open', /\bopen\s*\(/],
  ['json.loads', /\bjson\.loads\s*\(/], ['json.dumps', /\bjson\.dumps\s*\(/],
  ['pathlib', /\bPath\s*\(/], ['regex', /\bre\.(?:fullmatch|match|search|findall)\s*\(/],
  ['int', /\bint\s*\(/], ['bool', /\bbool\s*\(/],
  ['if', /^\s*if\b/m], ['elif', /^\s*elif\b/m], ['else', /^\s*else\s*:/m],
  ['for', /^\s*for\b/m], ['while', /^\s*while\b/m], ['break', /^\s*break\b/m], ['continue', /^\s*continue\b/m],
  ['def', /^\s*def\b/m], ['return', /^\s*return\b/m], ['class', /^\s*class\b/m], ['self', /\bself\b/],
  ['import', /^\s*(?:from\s+\S+\s+)?import\b/m], ['with', /^\s*with\b/m],
  ['try_except', /^\s*(?:try|except)\b/m], ['raise', /^\s*raise\b/m]
];

function syntaxTokens(code) {
  return KNOWN_SYNTAX.filter(([,rx]) => rx.test(String(code || ''))).map(([name]) => name);
}
function learnedToken(context, token) {
  const key = norm(token);
  if (context.concepts.has(key)) return true;
  const family = engine.familyOf(key);
  return context.families.has(family);
}

const missions = [];
const leakRows = [];
const invalidRows = [];
for (let n = 1; n <= totalExpectedCheckpoints; n += 1) {
  const mission = engine.missionForCheckpoint(n, 'ko', cards, (card) => primary(card));
  const boundary = Math.min(cards.length, n * engine.CHECKPOINT_INTERVAL);
  const context = engine.buildLearningContext(cards, boundary, card => primary(card));
  missions.push(mission);
  if (!mission || !mission.question || !Array.isArray(mission.choices) || mission.choices.length < 3 || mission.answerIndex < 0 || mission.answerIndex >= mission.choices.length || !mission.explanation) {
    invalidRows.push(n);
  }
  const leaks = syntaxTokens(mission.code).filter(token => !learnedToken(context, token));
  if (leaks.length) leakRows.push({n, id: mission.id, boundary, leaks});
}
if (invalidRows.length) fail(`INVALID_CHECKPOINT_MISSIONS:${invalidRows.join(',')}`); else pass('ALL_CHECKPOINT_MISSIONS_STRUCTURALLY_VALID', missions.length);
if (leakRows.length) fail(`FUTURE_SYNTAX_LEAKS:${leakRows.map(r => `${r.n}:${r.id}:${r.leaks.join('+')}`).join(',')}`); else pass('ALL_CHECKPOINTS_USE_LEARNED_NAMED_SYNTAX_ONLY', missions.length);

const missionIdCounts = new Map();
const missionKindCounts = new Map();
missions.forEach(m => {
  missionIdCounts.set(m.id, (missionIdCounts.get(m.id)||0)+1);
  missionKindCounts.set(m.kind, (missionKindCounts.get(m.kind)||0)+1);
});
const uniqueMissionIds = missionIdCounts.size;
const uniqueKinds = missionKindCounts.size;
const maxRepeat = Math.max(...missionIdCounts.values());
let adjacentSame = 0;
for (let i=1;i<missions.length;i++) if (missions[i].id === missions[i-1].id) adjacentSame += 1;
note('CHECKPOINT_MISSION_ID_DISTRIBUTION', Array.from(missionIdCounts.entries()).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(','));
note('CHECKPOINT_KIND_DISTRIBUTION', Array.from(missionKindCounts.entries()).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(','));
if (uniqueMissionIds < 16) fail(`CHECKPOINT_VARIETY_TOO_LOW:unique=${uniqueMissionIds}`); else pass('CHECKPOINT_TEMPLATE_VARIETY', uniqueMissionIds);
if (uniqueKinds < 7) fail(`CHECKPOINT_KIND_VARIETY_TOO_LOW:kinds=${uniqueKinds}`); else pass('CHECKPOINT_KIND_VARIETY', uniqueKinds);
if (maxRepeat > 8) fail(`CHECKPOINT_TEMPLATE_OVERREPEATED:max=${maxRepeat}`); else pass('CHECKPOINT_MAX_REPEAT', maxRepeat);
if (adjacentSame > 3) fail(`CHECKPOINT_ADJACENT_REPEATS:${adjacentSame}`); else pass('CHECKPOINT_ADJACENT_REPEAT_LIMIT', adjacentSame);

const templateModuleCounts = new Map();
const templateKindCounts = new Map();
engine.PRACTICE_TEMPLATES.forEach(t => {
  templateModuleCounts.set(t.moduleId, (templateModuleCounts.get(t.moduleId)||0)+1);
  templateKindCounts.set(t.kind, (templateKindCounts.get(t.kind)||0)+1);
});
for (const module of engine.PRACTICE_MODULES) {
  const count = templateModuleCounts.get(module.id) || 0;
  if (count < 2) fail(`PRACTICE_MODULE_TEMPLATE_THIN:${module.id}:${count}`);
}
note('PRACTICE_TEMPLATE_COUNT', engine.PRACTICE_TEMPLATES.length);
note('PRACTICE_TEMPLATE_MODULE_COUNTS', Array.from(templateModuleCounts.entries()).map(([k,v])=>`${k}:${v}`).join(','));
note('PRACTICE_TEMPLATE_KIND_COUNTS', Array.from(templateKindCounts.entries()).map(([k,v])=>`${k}:${v}`).join(','));

const firstIndexByConcept = new Map();
cards.forEach((card,i) => (card.concepts||[]).forEach(c => { const k=norm(c); if(k && !firstIndexByConcept.has(k)) firstIndexByConcept.set(k,i+1); }));
const unknownFamilies = Array.from(allConcepts).map(norm).filter(c => engine.familyOf(c) === c && !['comment','input','indentation','none','with'].includes(c));
note('RAW_CONCEPT_COUNT', allConcepts.size);
note('UNALIASED_CONCEPT_COUNT', new Set(unknownFamilies).size);
note('UNALIASED_CONCEPT_SAMPLE', Array.from(new Set(unknownFamilies)).slice(0,40).join(','));

const hasNoCacheMeta = /Cache-Control[^>]+no-cache, no-store, must-revalidate/i.test(INDEX);
if (!hasNoCacheMeta) fail('INDEX_NO_CACHE_META_MISSING'); else pass('INDEX_NO_CACHE_META', 'present');
const engineQuery = (INDEX.match(/learning_engine_v341\.js\?v=([^"&]+)/) || [])[1] || '';
const experienceQuery = (INDEX.match(/learning_experience_v341\.js\?v=([^"&]+)/) || [])[1] || '';
note('ENGINE_CACHE_QUERY', engineQuery || 'missing');
note('EXPERIENCE_CACHE_QUERY', experienceQuery || 'missing');
const serviceWorkerMention = /serviceWorker|service-worker|sw\.js/i.test(APP + '\n' + INDEX);
note('SERVICE_WORKER_RUNTIME', serviceWorkerMention ? 'present' : 'absent; versioned URL/browser cache strategy');

console.log(`ERRORS=${errors.length}`);
errors.forEach((e,i) => console.log(`ERROR_${i+1}=${e}`));
if (errors.length) {
  console.log('RESULT=FAIL_LEARNING_HARDENING_V342_AUDIT');
  process.exit(1);
}
console.log('RESULT=PASS_LEARNING_HARDENING_V342_AUDIT');
