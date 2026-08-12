const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = fs.readFileSync(path.join(ROOT, 'src/pwa/app.js'), 'utf8');
const INDEX = fs.readFileSync(path.join(ROOT, 'src/pwa/index.html'), 'utf8');
const EXPERIENCE = fs.readFileSync(path.join(ROOT, 'src/pwa/learning_experience_v341.js'), 'utf8');
const engine = require(path.join(ROOT, 'src/pwa/learning_engine_v341.js'));
const semantics = require(path.join(ROOT, 'src/pwa/content_quality_semantics.js'));
const errors = [];

function norm(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
function pass(name, detail) { console.log(`${name}=PASS${detail == null ? '' : ` DETAIL=${detail}`}`); }
function info(name, detail) { console.log(`${name}=INFO DETAIL=${detail}`); }
function fail(msg) { errors.push(msg); }

function extractArray(source, name) {
  const marker = `const ${name} = [`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`ARRAY_NOT_FOUND:${name}`);
  const end = source.indexOf('];', start);
  if (end < 0) throw new Error(`ARRAY_END_NOT_FOUND:${name}`);
  return Array.from(source.slice(start + marker.length, end).matchAll(/["']([^"']+\.json)["']/g)).map(m => m[1]);
}
function loadCards(locale) {
  const files = extractArray(APP, 'lessonFiles');
  const rows = [];
  files.forEach(item => {
    let repoPath = item.replace(/^\.\.\/\.\.\//, '');
    if (locale === 'en') repoPath = repoPath.replace(/^data\//, 'data_i18n/en/');
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, repoPath), 'utf8'));
    data.forEach(card => rows.push(card));
  });
  return rows;
}

const ko = loadCards('ko');
const en = loadCards('en');
if (ko.length !== 1785) fail(`KO_COUNT:${ko.length}`); else pass('KO_CARD_COUNT', ko.length);
if (en.length !== 1785) fail(`EN_COUNT:${en.length}`); else pass('EN_CARD_COUNT', en.length);
if (!ko.every((c,i) => en[i] && en[i].id === c.id)) fail('KO_EN_ORDER_MISMATCH'); else pass('KO_EN_ORDER_ID_PARITY', ko.length);

const allConcepts = new Set();
ko.forEach(card => (card.concepts || []).forEach(c => allConcepts.add(String(c))));
const curatedConcepts = new Set(Array.from(APP.matchAll(/["']([^"']+)["']\s*:\s*\{\s*definition\s*:/g)).map(m => m[1]));
const conceptInfoProxy = Object.create(null);
curatedConcepts.forEach(c => { conceptInfoProxy[c] = true; });
info('RAW_CONCEPT_COUNT', allConcepts.size);
info('CURATED_CONCEPT_INFO_COUNT', curatedConcepts.size);
if (curatedConcepts.size < 30) fail(`CURATED_CONCEPT_INFO_TOO_SMALL:${curatedConcepts.size}`); else pass('CURATED_CONCEPT_INFO_PRESENT', curatedConcepts.size);

function primary(card) {
  return semantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfoProxy);
}
const primaryCounts = new Map();
ko.forEach(card => {
  const p = norm(primary(card));
  if (p) primaryCounts.set(p, (primaryCounts.get(p) || 0) + 1);
});
info('RUNTIME_PRIMARY_CONCEPT_COUNT', primaryCounts.size);

const mastery = engine.conceptMastery(ko, {seen:{},correct:{},confused:{}}, {}, card => primary(card));
const masteryNames = new Set(mastery.map(r => String(r.concept)));
const missingRaw = Array.from(allConcepts).filter(c => !masteryNames.has(c));
if (missingRaw.length) fail(`RAW_MASTERY_EVIDENCE_MISSING:${missingRaw.slice(0,30).join(',')}`); else pass('RAW_MASTERY_EVIDENCE_COVERS_ALL_TAGS', mastery.length);
const curatedAppearing = Array.from(curatedConcepts).filter(c => allConcepts.has(c));
const missingCurated = curatedAppearing.filter(c => !masteryNames.has(c));
if (missingCurated.length) fail(`CURATED_MASTERY_MISSING:${missingCurated.join(',')}`); else pass('CURATED_MASTERY_COVERAGE', curatedAppearing.length);
if (/mastery\.slice\(0,\s*80\)/.test(EXPERIENCE)) fail('MASTERY_ARBITRARY_80_CUTOFF'); else pass('MASTERY_NO_ARBITRARY_CUTOFF', curatedAppearing.length);
if (!/masteryDisplayRows/.test(EXPERIENCE) || !/hasOwnProperty\.call\(conceptInfo, row\.concept\)/.test(EXPERIENCE)) fail('MASTERY_CURATED_DISPLAY_POLICY_MISSING'); else pass('MASTERY_CURATED_DISPLAY_POLICY', 'full curated set');

function moduleMatchesConcept(concept) {
  const key = norm(concept);
  const family = engine.familyOf(key);
  return engine.PRACTICE_MODULES.some(module =>
    (module.matchConcepts || []).map(norm).includes(key) || (module.matchFamilies || []).includes(family)
  );
}
const runtimePrimaryUnmapped = Array.from(primaryCounts.entries()).filter(([c]) => !moduleMatchesConcept(c)).sort((a,b)=>b[1]-a[1]);
info('UNMAPPED_RUNTIME_PRIMARY_COUNT', runtimePrimaryUnmapped.length);
info('UNMAPPED_RUNTIME_PRIMARY_TOP', runtimePrimaryUnmapped.slice(0,30).map(([c,n])=>`${c}:${n}`).join(','));
// Practice modules intentionally cover Python code-reading topics only; non-Python/tooling concepts remain mastery/reference evidence.
const requiredFamilies = ['output','assignment','string','number','type','condition','loop','list','dict','tuple','set','function','object','module','file','exception','input','comment','none'];
const missingFamilies = requiredFamilies.filter(f => !engine.PRACTICE_MODULES.some(m => (m.matchFamilies || []).includes(f) || (m.matchConcepts || []).some(c => engine.familyOf(c) === f)));
if (missingFamilies.length) fail(`CORE_PYTHON_FAMILY_NOT_ROUTED:${missingFamilies.join(',')}`); else pass('CORE_PYTHON_FAMILIES_ROUTED', requiredFamilies.length);

const totalCheckpoints = Math.ceil(ko.length / engine.CHECKPOINT_INTERVAL);
const unlockedAtEnd = engine.unlockedCheckpointCount(ko.length, ko.length);
if (unlockedAtEnd !== totalCheckpoints) fail(`FINAL_TAIL_CHECKPOINT_UNREACHABLE:${unlockedAtEnd}/${totalCheckpoints}`); else pass('FINAL_TAIL_CHECKPOINT_REACHABLE', `${totalCheckpoints} checkpoints`);
const nextAtEnd = engine.nextCheckpoint(ko.length, ko.length);
if (!nextAtEnd.complete || nextAtEnd.remaining !== 0 || nextAtEnd.target !== ko.length) fail(`FINAL_NEXT_CHECKPOINT_STATE:${JSON.stringify(nextAtEnd)}`); else pass('FINAL_CURRICULUM_COMPLETE_STATE', JSON.stringify(nextAtEnd));

const SYNTAX = [
 ['print',/\bprint\s*\(/],['len',/\blen\s*\(/],['range',/\brange\s*\(/],['append',/\.append\s*\(/],['get',/\.get\s*\(/],['open',/\bopen\s*\(/],
 ['json.loads',/\bjson\.loads\s*\(/],['pathlib',/\bPath\s*\(/],['regex',/\bre\.(?:fullmatch|match|search|findall)\s*\(/],['int',/\bint\s*\(/],['bool',/\bbool\s*\(/],
 ['if',/^\s*if\b/m],['elif',/^\s*elif\b/m],['else',/^\s*else\s*:/m],['for',/^\s*for\b/m],['while',/^\s*while\b/m],['break',/^\s*break\b/m],['continue',/^\s*continue\b/m],
 ['def',/^\s*def\b/m],['return',/^\s*return\b/m],['class',/^\s*class\b/m],['self',/\bself\b/],['import',/^\s*(?:from\s+\S+\s+)?import\b/m],['with',/^\s*with\b/m],['try_except',/^\s*(?:try|except)\b/m],['raise',/^\s*raise\b/m]
];
function tokens(code) { return SYNTAX.filter(([,rx]) => rx.test(String(code || ''))).map(([name])=>name); }
function learned(context, token) { const k=norm(token); return context.concepts.has(k) || context.families.has(engine.familyOf(k)); }

const missions = [];
const syntaxLeaks = [];
const invalid = [];
for (let n=1; n<=totalCheckpoints; n++) {
  const mission = engine.missionForCheckpoint(n, 'ko', ko, card => primary(card));
  const boundary = Math.min(ko.length, n * engine.CHECKPOINT_INTERVAL);
  const context = engine.buildLearningContext(ko, boundary, card => primary(card));
  missions.push(mission);
  if (!mission || !mission.question || !Array.isArray(mission.choices) || mission.choices.length < 3 || mission.answerIndex < 0 || mission.answerIndex >= mission.choices.length || !mission.explanation) invalid.push(n);
  const leaks = tokens(mission.code).filter(t => !learned(context,t));
  if (leaks.length) syntaxLeaks.push(`${n}:${mission.id}:${leaks.join('+')}`);
}
if (invalid.length) fail(`INVALID_CHECKPOINTS:${invalid.join(',')}`); else pass('ALL_CHECKPOINTS_STRUCTURALLY_VALID', missions.length);
if (syntaxLeaks.length) fail(`FUTURE_SYNTAX_LEAKS:${syntaxLeaks.join(',')}`); else pass('ALL_CHECKPOINTS_USE_LEARNED_SYNTAX_ONLY', missions.length);

const ids = new Map(), kinds = new Map();
missions.forEach(m => { ids.set(m.id,(ids.get(m.id)||0)+1); kinds.set(m.kind,(kinds.get(m.kind)||0)+1); });
let adjacent = 0;
for (let i=1;i<missions.length;i++) if (missions[i].id === missions[i-1].id) adjacent++;
const maxRepeat = Math.max(...ids.values());
info('CHECKPOINT_ID_DISTRIBUTION', Array.from(ids.entries()).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(','));
info('CHECKPOINT_KIND_DISTRIBUTION', Array.from(kinds.entries()).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(','));
if (ids.size < 18) fail(`CHECKPOINT_VARIETY_LOW:${ids.size}`); else pass('CHECKPOINT_TEMPLATE_VARIETY', ids.size);
if (kinds.size < 8) fail(`CHECKPOINT_KIND_VARIETY_LOW:${kinds.size}`); else pass('CHECKPOINT_KIND_VARIETY', kinds.size);
if (maxRepeat > 7) fail(`CHECKPOINT_TEMPLATE_OVERREPEATED:${maxRepeat}`); else pass('CHECKPOINT_MAX_TEMPLATE_REPEAT', maxRepeat);
if (adjacent > 2) fail(`CHECKPOINT_ADJACENT_REPEATS:${adjacent}`); else pass('CHECKPOINT_ADJACENT_REPEAT_LIMIT', adjacent);

const byModule = new Map();
engine.PRACTICE_TEMPLATES.forEach(t => byModule.set(t.moduleId,(byModule.get(t.moduleId)||0)+1));
for (const module of engine.PRACTICE_MODULES) {
  const count = byModule.get(module.id)||0;
  if (count < 2) fail(`MODULE_TEMPLATE_THIN:${module.id}:${count}`);
}
info('PRACTICE_TEMPLATE_TOTAL', engine.PRACTICE_TEMPLATES.length);
info('PRACTICE_TEMPLATE_BY_MODULE', Array.from(byModule.entries()).map(([k,v])=>`${k}:${v}`).join(','));

if (!/h=20260812_v342_a1/.test(INDEX)) fail('V342_CACHE_BUST_MISSING'); else pass('V342_CACHE_BUST_PRESENT', 'semantic + learning runtime');
if (!/Cache-Control[^>]+no-cache, no-store, must-revalidate/i.test(INDEX)) fail('INDEX_NO_CACHE_META_MISSING'); else pass('INDEX_NO_CACHE_META', 'present');
const sw = /serviceWorker|service-worker|sw\.js/i.test(APP+'\n'+INDEX);
info('SERVICE_WORKER_RUNTIME', sw ? 'present' : 'absent; versioned URL/browser cache strategy');

console.log(`ERRORS=${errors.length}`);
errors.forEach((e,i)=>console.log(`ERROR_${i+1}=${e}`));
if (errors.length) { console.log('RESULT=FAIL_LEARNING_HARDENING_V342_R2_AUDIT'); process.exit(1); }
console.log('RESULT=PASS_LEARNING_HARDENING_V342_R2_AUDIT');
