const fs = require('fs');
const path = require('path');
const engine = require('../src/pwa/learning_engine_v341.js');

let errors = 0;
function check(name, condition, detail) {
  const ok = Boolean(condition);
  console.log(name + '=' + (ok ? 'PASS' : 'FAIL') + (detail ? ' DETAIL=' + detail : ''));
  if (!ok) errors += 1;
}

const cards = Array.from({ length: 120 }, (_, i) => {
  if (i < 30) return { id: 'C' + String(i + 1).padStart(3, '0'), concepts: ['len', 'list', 'print'], code: 'items=[1,2,3]\nprint(len(items))' };
  if (i < 60) return { id: 'C' + String(i + 1).padStart(3, '0'), concepts: ['if', 'bool', 'print'], code: 'if ready:\n    print("go")' };
  if (i < 90) return { id: 'C' + String(i + 1).padStart(3, '0'), concepts: ['for', 'list', 'print'], code: 'for item in items:\n    print(item)' };
  return { id: 'C' + String(i + 1).padStart(3, '0'), concepts: ['dict', 'get', 'list'], code: 'value = row.get("x", 0)' };
});
const primary = card => card.concepts[0];
const progress = { seen: {}, correct: {}, confused: {} };
for (let i = 0; i < 65; i += 1) {
  progress.seen[cards[i].id] = 1;
  if (i % 5 === 0) progress.confused[cards[i].id] = 1;
  else progress.correct[cards[i].id] = 1;
}
const reviews = {
  C002: { stage: 1, mastered: false, lastResult: 'correct-review' },
  C003: { stage: 2, mastered: false, lastResult: 'correct-review' },
  C004: { stage: 4, mastered: true, lastResult: 'correct-review' }
};

check('ENGINE_VERSION', engine.VERSION === 'v341_a2', engine.VERSION);
check('NO_POINTS_MODEL', engine.PRACTICE_MODULES.every(m => !('points' in m) && !('xp' in m)), 'modules=' + engine.PRACTICE_MODULES.length);
check('CHECKPOINT_INTERVAL_30', engine.CHECKPOINT_INTERVAL === 30, String(engine.CHECKPOINT_INTERVAL));
check('ATTEMPTED_COUNT', engine.attemptedCount(cards, progress) === 65, String(engine.attemptedCount(cards, progress)));
check('UNLOCKED_CHECKPOINTS', engine.unlockedCheckpointCount(65) === 2, String(engine.unlockedCheckpointCount(65)));
const next = engine.nextCheckpoint(65);
check('NEXT_CHECKPOINT', next.target === 90 && next.remaining === 25, JSON.stringify(next));

const context30 = engine.buildLearningContext(cards, 30, primary);
check('LEARNING_CONTEXT_BOUNDARY', context30.boundary === 30, String(context30.boundary));
check('LEARNING_CONTEXT_HAS_CURRENT_TOPICS', context30.concepts.has('len') && context30.concepts.has('list') && context30.concepts.has('print'), Array.from(context30.concepts).join(','));
check('LEARNING_CONTEXT_BLOCKS_FUTURE_TOPICS', !context30.concepts.has('if') && !context30.concepts.has('for') && !context30.concepts.has('dict'), Array.from(context30.concepts).join(','));

const mission1 = engine.missionForCheckpoint(1, 'ko', cards, primary);
check('CHECKPOINT_HAS_PYTHON_CODE', Boolean(mission1.code) && /len|print|items/.test(mission1.code), mission1.id + ':' + mission1.code.replace(/\n/g, '|'));
check('CHECKPOINT_USES_LEARNED_TOPICS_ONLY', ['output_prediction', 'value_trace', 'code_reading', 'concept_trace'].includes(mission1.kind), mission1.kind);
const devKinds = new Set(['change_procedure', 'regression', 'idempotence', 'test_scope', 'pr_review', 'ci_gate', 'reproducibility', 'baseline', 'rollback']);
check('CHECKPOINT_NOT_DEVELOPMENT_WORKFLOW_TOPIC', !devKinds.has(mission1.kind), mission1.kind);
check('CHECKPOINT_BOUNDARY_30', mission1.boundary === 30, String(mission1.boundary));
check('CHECKPOINT_IS_NOT_ORIGINAL_QA_REPEAT', !String(mission1.question).includes('len(items)의 출력'), mission1.question);

const modules30 = engine.unlockedPracticeModules(30, cards, primary);
const basics30 = modules30.find(m => m.id === 'basics');
const condition30 = modules30.find(m => m.id === 'condition');
const loop30 = modules30.find(m => m.id === 'loop');
check('MODULE_UNLOCKS_FROM_TOPIC_APPEARANCE', basics30 && basics30.unlocked && condition30 && !condition30.unlocked && loop30 && !loop30.unlocked, modules30.map(m => m.id + ':' + (m.unlocked ? '1' : '0')).join(','));
const modules65 = engine.unlockedPracticeModules(65, cards, primary);
check('CONDITION_UNLOCKS_AFTER_CURRICULUM_APPEARANCE', modules65.find(m => m.id === 'condition').unlocked, JSON.stringify(modules65.find(m => m.id === 'condition')));
check('LOOP_UNLOCKS_AFTER_CURRICULUM_APPEARANCE', modules65.find(m => m.id === 'loop').unlocked, JSON.stringify(modules65.find(m => m.id === 'loop')));

const basicPractice = engine.missionForPracticeModule('basics', 30, 'ko', cards, primary);
check('MODULE_PRACTICE_HAS_CODE', Boolean(basicPractice.code), basicPractice.id);
check('MODULE_PRACTICE_SEPARATE_FROM_CHECKPOINT', basicPractice.checkpoint === 0 && basicPractice.moduleId === 'basics', JSON.stringify({checkpoint:basicPractice.checkpoint,moduleId:basicPractice.moduleId}));
check('MODULE_PRACTICE_NOT_DEV_WORKFLOW', !devKinds.has(basicPractice.kind), basicPractice.kind);

const mastery = engine.conceptMastery(cards, progress, reviews, primary);
const len = mastery.find(row => row.concept === 'len');
check('MASTERY_MAP_PRESENT', Boolean(len), len && len.level.key);
check('MASTERY_EVIDENCE_ADVANCES', len && len.level.rank >= 3, len && String(len.level.rank));

const monday = new Date(2026, 7, 10, 12, 0, 0).getTime();
let events = [];
for (let d = 0; d < 5; d += 1) {
  for (let i = 0; i < 10; i += 1) events.push({ kind: 'lesson_attempt', at: monday + d * 86400000 + i * 1000 });
}
const weekly = engine.weeklyStatus(events, monday + 5 * 86400000);
check('WEEKLY_GOAL_EVIDENCE', weekly.cardAttempts === 50 && weekly.studyDays === 5 && weekly.complete, JSON.stringify(weekly));

const completion = engine.completionSummary([1], 2);
check('CHECKPOINT_COMPLETION_SUMMARY', completion.passed === 1 && completion.pending === 1, JSON.stringify(completion));

const uiSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'pwa', 'learning_experience_v341.js'), 'utf8');
check('NO_XP_UI', !/\bXP\b|experience points|coins?|loot/i.test(uiSource), 'no xp/coin/loot');
check('NO_STREAK_PRESSURE', !/연속\s*\d|streak\s*reset|streak-loss/i.test(uiSource), 'weekly goal only');
check('PRACTICE_TAB_RENDER_API', uiSource.includes('renderPracticeV341') && uiSource.includes('practiceDashboardV341'), 'render API');
check('DEVELOPMENT_WORKFLOW_IS_REFERENCE_LAYER', uiSource.includes('developmentWorkflowCards') && uiSource.includes('developmentWorkflowReferenceV341'), 'side-card reference renderer');
check('RESET_INCLUDES_V341_STATE', uiSource.includes('localStorage.removeItem(STORAGE_KEY)'), 'state reset');

console.log('ERRORS=' + errors);
console.log('RESULT=' + (errors ? 'FAIL_LEARNING_EXPERIENCE_V341_AUDIT' : 'PASS_LEARNING_EXPERIENCE_V341_AUDIT'));
process.exitCode = errors ? 1 : 0;
