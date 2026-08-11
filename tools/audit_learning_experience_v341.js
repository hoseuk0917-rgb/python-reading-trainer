const fs = require('fs');
const path = require('path');
const engine = require('../src/pwa/learning_engine_v341.js');

let errors = 0;
function check(name, condition, detail) {
  const ok = Boolean(condition);
  console.log(name + '=' + (ok ? 'PASS' : 'FAIL') + (detail ? ' DETAIL=' + detail : ''));
  if (!ok) errors += 1;
}

const cards = Array.from({ length: 100 }, (_, i) => ({
  id: 'C' + String(i + 1).padStart(3, '0'),
  concepts: i < 35 ? ['len', 'print'] : i < 70 ? ['for', 'list'] : ['if', 'bool']
}));
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

check('ENGINE_VERSION', engine.VERSION === 'v341_a1', engine.VERSION);
check('NO_POINTS_MODEL', engine.PRACTICE_MODULES.every(m => !('points' in m) && !('xp' in m)), 'modules=' + engine.PRACTICE_MODULES.length);
check('CHECKPOINT_INTERVAL_30', engine.CHECKPOINT_INTERVAL === 30, String(engine.CHECKPOINT_INTERVAL));
check('ATTEMPTED_COUNT', engine.attemptedCount(cards, progress) === 65, String(engine.attemptedCount(cards, progress)));
check('UNLOCKED_CHECKPOINTS', engine.unlockedCheckpointCount(65) === 2, String(engine.unlockedCheckpointCount(65)));
const next = engine.nextCheckpoint(65);
check('NEXT_CHECKPOINT', next.target === 90 && next.remaining === 25, JSON.stringify(next));
const modules = engine.unlockedPracticeModules(65);
check('PRACTICE_UNLOCK_BY_PROGRESS', modules[0].unlocked && modules[1].unlocked && !modules[2].unlocked, modules.map(m => m.unlocked ? '1' : '0').join(''));
const mission = engine.missionForCheckpoint(3, 'ko');
check('MISSION_HAS_CHOICES', mission.choices.length >= 3 && mission.answerIndex >= 0, mission.kind);
check('MISSION_IS_NOT_ORIGINAL_QA_REPEAT', !String(mission.question).includes('len(items)의 출력'), mission.question);
check('MISSION_COVERS_IDEMPOTENCE', engine.missionForCheckpoint(3, 'ko').kind === 'idempotence', engine.missionForCheckpoint(3, 'ko').kind);

const mastery = engine.conceptMastery(cards, progress, reviews, card => card.concepts[0]);
const len = mastery.find(row => row.concept === 'len');
check('MASTERY_MAP_PRESENT', Boolean(len), len && len.level.key);
check('MASTERY_EVIDENCE_ADVANCES', len && len.level.rank >= 3, len && String(len.level.rank));

const monday = new Date(2026, 7, 10, 12, 0, 0).getTime();
let events = [];
for (let d = 0; d < 5; d += 1) {
  for (let i = 0; i < 10; i += 1) {
    events.push({ kind: 'lesson_attempt', at: monday + d * 86400000 + i * 1000 });
  }
}
const weekly = engine.weeklyStatus(events, monday + 5 * 86400000);
check('WEEKLY_GOAL_EVIDENCE', weekly.cardAttempts === 50 && weekly.studyDays === 5 && weekly.complete, JSON.stringify(weekly));

const completion = engine.completionSummary([1], 2);
check('CHECKPOINT_COMPLETION_SUMMARY', completion.passed === 1 && completion.pending === 1, JSON.stringify(completion));

const uiSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'pwa', 'learning_experience_v341.js'), 'utf8');
check('NO_XP_UI', !/\bXP\b|experience points|coins?|loot/i.test(uiSource), 'no xp/coin/loot');
check('NO_STREAK_PRESSURE', !/연속\s*\d|streak\s*reset|streak-loss/i.test(uiSource), 'weekly goal only');
check('PRACTICE_TAB_RENDER_API', uiSource.includes('renderPracticeV341') && uiSource.includes('practiceDashboardV341'), 'render API');
check('RESET_INCLUDES_V341_STATE', uiSource.includes('localStorage.removeItem(STORAGE_KEY)'), 'state reset');

console.log('ERRORS=' + errors);
console.log('RESULT=' + (errors ? 'FAIL_LEARNING_EXPERIENCE_V341_AUDIT' : 'PASS_LEARNING_EXPERIENCE_V341_AUDIT'));
process.exitCode = errors ? 1 : 0;
