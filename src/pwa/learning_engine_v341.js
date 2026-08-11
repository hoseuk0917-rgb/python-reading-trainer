(function(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.LearningEngineV341 = api;
})(typeof window !== "undefined" ? window : globalThis, function() {
  "use strict";

  const VERSION = "v341_a1";
  // LEARNING_EXPERIENCE_V341_R2_EXACT_MISSION_MAPPING
  const CHECKPOINT_INTERVAL = 30;
  const WEEKLY_CARD_GOAL = 50;
  const WEEKLY_DAY_GOAL = 5;

  const MASTERY_LEVELS = [
    { key: "not_started", ko: "미학습", en: "Not started", rank: 0 },
    { key: "introduced", ko: "처음 봄", en: "Introduced", rank: 1 },
    { key: "understood", ko: "이해함", en: "Understood", rank: 2 },
    { key: "variant_passed", ko: "변형 성공", en: "Variant passed", rank: 3 },
    { key: "spaced_review", ko: "간격 복습 중", en: "Spaced review", rank: 4 },
    { key: "consolidated", ko: "정착", en: "Consolidated", rank: 5 }
  ];

  const PRACTICE_MODULES = [
    { id: "safe_change", threshold: 30, missionCheckpoint: 1, ko: "안전한 변경 절차", en: "Safe change procedure", descriptionKo: "요구 확인 → 작은 변경 → 테스트 → diff 확인 → commit 순서를 읽습니다.", descriptionEn: "Read the flow from requirement to small change, test, diff, and commit." },
    { id: "regression", threshold: 60, missionCheckpoint: 2, ko: "회귀 테스트", en: "Regression testing", descriptionKo: "수정한 기능뿐 아니라 예전에 되던 기능이 깨지지 않았는지 확인합니다.", descriptionEn: "Check that previously working behavior still works after a change." },
    { id: "idempotence", threshold: 90, missionCheckpoint: 3, ko: "멱등성과 재실행 안전성", en: "Idempotence and rerun safety", descriptionKo: "같은 작업을 두 번 실행해도 결과가 더 망가지지 않는 조건을 익힙니다.", descriptionEn: "Learn when running the same operation twice should not create extra damage." },
    { id: "test_layers", threshold: 120, missionCheckpoint: 4, ko: "단위·통합·스모크 테스트", en: "Unit, integration, and smoke tests", descriptionKo: "테스트가 어디까지 확인하는지 범위를 구분합니다.", descriptionEn: "Distinguish test types by the scope of behavior they verify." },
    { id: "git_review", threshold: 150, missionCheckpoint: 6, ko: "브랜치·diff·PR 리뷰", en: "Branch, diff, and PR review", descriptionKo: "변경 전후 차이와 영향 범위를 보고 승인 여부를 판단합니다.", descriptionEn: "Use diffs and impact scope to reason about whether a change is safe to approve." },
    { id: "ci_gate", threshold: 180, missionCheckpoint: 7, ko: "CI 품질 게이트", en: "CI quality gates", descriptionKo: "push 뒤 자동 검사가 왜 필요한지와 실패 시 중단 원칙을 익힙니다.", descriptionEn: "Learn why automated checks run after push and why failed gates should block release." },
    { id: "reproducibility", threshold: 240, missionCheckpoint: 8, ko: "재현성과 입력 고정", en: "Reproducibility and pinned inputs", descriptionKo: "버전·입력·환경을 고정해 같은 검증을 다시 만들 수 있게 합니다.", descriptionEn: "Pin versions, inputs, and environment so a validation can be reproduced." },
    { id: "baseline_rollback", threshold: 300, missionCheckpoint: 9, ko: "기준선 비교와 롤백", en: "Baseline comparison and rollback", descriptionKo: "변경 전 기준선을 보존하고 문제가 생기면 안전하게 되돌리는 흐름을 익힙니다.", descriptionEn: "Preserve a baseline and reason about safe rollback after a bad change." }
  ];

  const MISSION_TEMPLATES = [
    {
      kind: "change_procedure",
      ko: "작은 기능을 수정한 뒤 가장 안전한 다음 순서는?",
      en: "After a small feature change, which next sequence is safest?",
      choicesKo: ["테스트 → diff 확인 → commit", "commit → 테스트 생략 → 배포", "main 직접 수정 → 문제 생기면 기억으로 복구"],
      choicesEn: ["Test → inspect diff → commit", "Commit → skip tests → deploy", "Edit main directly → recover from memory if needed"],
      answerIndex: 0,
      explainKo: "작은 변경 뒤에는 먼저 동작을 검증하고, 실제 변경 범위를 diff로 확인한 다음 저장하는 순서가 안전합니다.",
      explainEn: "After a small change, verify behavior first, inspect the actual diff, then save the change."
    },
    {
      kind: "regression",
      ko: "버그를 고쳤다. 회귀 테스트가 특히 확인해야 하는 것은?",
      en: "A bug was fixed. What should regression testing especially verify?",
      choicesKo: ["예전에 정상 동작하던 기능이 그대로 동작하는지", "새 파일 이름이 예쁜지", "커밋 메시지가 긴지"],
      choicesEn: ["Previously working behavior still works", "The new filename looks nice", "The commit message is long"],
      answerIndex: 0,
      explainKo: "회귀 테스트의 핵심은 수정 때문에 기존 정상 기능이 다시 깨지지 않았는지 확인하는 것입니다.",
      explainEn: "Regression testing checks that a change did not break behavior that worked before."
    },
    {
      kind: "idempotence",
      ko: "폴더 생성 스크립트를 같은 입력으로 두 번 실행했다. 멱등적인 동작에 가장 가까운 결과는?",
      en: "A folder-creation script runs twice with the same input. Which result is closest to idempotent behavior?",
      choicesKo: ["두 번째 실행도 같은 최종 상태를 유지한다", "두 번째 실행 때 폴더를 하나 더 복제한다", "두 번째 실행 때 첫 결과를 삭제한다"],
      choicesEn: ["The second run keeps the same final state", "The second run duplicates the folder", "The second run deletes the first result"],
      answerIndex: 0,
      explainKo: "멱등성은 같은 요청을 반복해도 최종 상태가 불필요하게 계속 변하지 않는 성질입니다.",
      explainEn: "Idempotence means repeating the same request does not keep changing the final state unnecessarily."
    },
    {
      kind: "test_scope",
      ko: "앱이 실제 브라우저에서 열리고 핵심 버튼이 눌리는지 빠르게 확인하는 검사는?",
      en: "Which test quickly checks that the app opens in a real browser and core buttons work?",
      choicesKo: ["스모크 테스트", "변수 이름 검사", "README 맞춤법 검사"],
      choicesEn: ["Smoke test", "Variable-name check", "README spelling check"],
      answerIndex: 0,
      explainKo: "스모크 테스트는 배포본이나 통합된 앱이 최소 핵심 경로를 실행할 수 있는지 빠르게 확인합니다.",
      explainEn: "A smoke test quickly verifies that an integrated or deployed app can run its essential path."
    },
    {
      kind: "bug_hunt",
      ko: "다음 중 재실행할수록 데이터가 중복될 위험이 가장 큰 패턴은?",
      en: "Which pattern has the greatest risk of duplicating data on every rerun?",
      choicesKo: ["기존 목록을 읽지 않고 매번 같은 행을 append", "exist_ok=True로 폴더 생성", "같은 입력의 해시를 다시 계산"],
      choicesEn: ["Append the same row every time without checking existing data", "Create a folder with exist_ok=True", "Recalculate a hash for the same input"],
      answerIndex: 0,
      explainKo: "기존 결과를 확인하지 않고 append만 반복하면 같은 입력으로 실행할 때 중복이 계속 늘어날 수 있습니다.",
      explainEn: "Blindly appending without checking existing output can grow duplicates on every rerun."
    },
    {
      kind: "pr_review",
      ko: "PR에서 코드 2줄만 바뀌었다. 리뷰할 때 가장 먼저 볼 것은?",
      en: "Only two lines changed in a PR. What should review focus on first?",
      choicesKo: ["두 줄이 영향을 주는 실행 경로와 테스트", "줄 수가 적으니 바로 승인", "작성자 프로필 사진"],
      choicesEn: ["The execution paths and tests affected by those lines", "Approve immediately because the diff is small", "The author's profile photo"],
      answerIndex: 0,
      explainKo: "변경 줄 수보다 영향 범위가 중요합니다. 작은 diff도 공통 함수나 데이터 형식을 바꾸면 큰 회귀를 만들 수 있습니다.",
      explainEn: "Impact matters more than line count. A tiny diff can cause a large regression if it changes shared behavior."
    },
    {
      kind: "ci_gate",
      ko: "CI에서 회귀 테스트가 실패했다. release 전에 가장 적절한 행동은?",
      en: "A regression test fails in CI. What is the best action before release?",
      choicesKo: ["실패 원인을 해결하거나 정당한 기준 변경을 검토한 뒤 다시 검증", "실패한 테스트만 삭제", "경고를 숨기고 배포"],
      choicesEn: ["Resolve the cause or review a justified baseline change, then rerun validation", "Delete the failing test", "Hide the warning and deploy"],
      answerIndex: 0,
      explainKo: "품질 게이트 실패는 원인을 이해하기 전까지 release를 막는 신호로 다뤄야 합니다.",
      explainEn: "A failed quality gate should block release until the cause is understood and handled."
    },
    {
      kind: "reproducibility",
      ko: "어제 PASS한 검증을 오늘 다시 재현하려면 무엇을 남기는 것이 가장 도움이 되는가?",
      en: "What most helps reproduce yesterday's passing validation today?",
      choicesKo: ["입력 버전·코드 SHA·실행 환경·검증 명령", "결과가 좋았다는 기억", "브라우저 탭을 열어둔 상태"],
      choicesEn: ["Input version, code SHA, environment, and validation command", "A memory that it passed", "Leaving a browser tab open"],
      answerIndex: 0,
      explainKo: "재현성은 같은 입력과 코드·환경·절차를 다시 만들 수 있어야 확보됩니다.",
      explainEn: "Reproducibility requires enough evidence to reconstruct the same input, code, environment, and procedure."
    },
    {
      kind: "baseline",
      ko: "성능 개선 전후를 비교할 때 가장 중요한 기준은?",
      en: "What is most important when comparing performance before and after a change?",
      choicesKo: ["같은 입력과 같은 측정 조건의 기준선", "서로 다른 데이터로 더 높은 숫자 선택", "가장 최근 실행 하나만 보기"],
      choicesEn: ["A baseline measured with the same input and conditions", "Pick the higher number from different data", "Look only at the most recent run"],
      answerIndex: 0,
      explainKo: "조건이 달라지면 변화가 코드 때문인지 입력 때문인지 구분하기 어렵습니다.",
      explainEn: "If conditions change, it becomes hard to tell whether the difference came from code or input."
    },
    {
      kind: "rollback",
      ko: "새 배포에서 치명적 오류가 발견됐다. 안전한 롤백을 위해 미리 보존해야 할 것은?",
      en: "A critical error appears after release. What should have been preserved for safe rollback?",
      choicesKo: ["직전 정상 버전과 배포 기준 SHA", "브라우저 방문 기록", "임시 메모 한 줄"],
      choicesEn: ["The last known-good version and release SHA", "Browser history", "A one-line temporary note"],
      answerIndex: 0,
      explainKo: "되돌릴 정확한 기준점이 있어야 기억이나 수작업에 의존하지 않고 안전하게 복구할 수 있습니다.",
      explainEn: "A precise known-good reference lets rollback avoid guesswork and manual reconstruction."
    }
  ];

  function listConcepts(card) {
    return Array.isArray(card && card.concepts) ? card.concepts.filter(Boolean) : [];
  }

  function attempted(progress, cardId) {
    const p = progress || {};
    return Boolean((p.correct && p.correct[cardId]) || (p.confused && p.confused[cardId]));
  }

  function attemptedCount(cards, progress) {
    return (cards || []).filter(function(card) { return attempted(progress, card.id); }).length;
  }

  function masteryForCard(card, progress, reviewState) {
    const p = progress || {};
    const review = reviewState && reviewState[card.id] ? reviewState[card.id] : null;
    const seen = Boolean(p.seen && p.seen[card.id]);
    const correct = Boolean(p.correct && p.correct[card.id]);
    if (!seen && !correct && !attempted(p, card.id)) return MASTERY_LEVELS[0];
    if (!correct) return MASTERY_LEVELS[1];
    if (!review) return MASTERY_LEVELS[2];
    if (review.mastered) return MASTERY_LEVELS[5];
    if (Number(review.stage || 0) >= 2) return MASTERY_LEVELS[4];
    if (Number(review.stage || 0) >= 1 || review.lastResult === "correct-review") return MASTERY_LEVELS[3];
    return MASTERY_LEVELS[2];
  }

  function conceptMastery(cards, progress, reviewState, primaryResolver) {
    const map = new Map();
    (cards || []).forEach(function(card, index) {
      const concepts = listConcepts(card);
      const primary = typeof primaryResolver === "function" ? primaryResolver(card, index) : concepts[0];
      const level = masteryForCard(card, progress, reviewState);
      concepts.forEach(function(concept) {
        if (!map.has(concept)) {
          map.set(concept, { concept: concept, totalCards: 0, primaryCards: 0, attemptedCards: 0, correctCards: 0, bestRank: 0, evidenceRank: 0 });
        }
        const row = map.get(concept);
        row.totalCards += 1;
        if (concept === primary) row.primaryCards += 1;
        if (attempted(progress, card.id)) row.attemptedCards += 1;
        if (progress && progress.correct && progress.correct[card.id]) row.correctCards += 1;
        row.bestRank = Math.max(row.bestRank, level.rank);
        if (concept === primary) row.evidenceRank = Math.max(row.evidenceRank, level.rank);
      });
    });
    return Array.from(map.values()).map(function(row) {
      const rank = row.primaryCards > 0 ? row.evidenceRank : row.bestRank;
      return Object.assign({}, row, { level: MASTERY_LEVELS[Math.max(0, Math.min(rank, MASTERY_LEVELS.length - 1))] });
    }).sort(function(a, b) {
      if (b.level.rank !== a.level.rank) return b.level.rank - a.level.rank;
      if (b.attemptedCards !== a.attemptedCards) return b.attemptedCards - a.attemptedCards;
      return a.concept.localeCompare(b.concept);
    });
  }

  function unlockedCheckpointCount(count) {
    return Math.floor(Math.max(0, Number(count || 0)) / CHECKPOINT_INTERVAL);
  }

  function nextCheckpoint(count) {
    const value = Math.max(0, Number(count || 0));
    const unlocked = unlockedCheckpointCount(value);
    const target = (unlocked + 1) * CHECKPOINT_INTERVAL;
    return { unlocked: unlocked, target: target, remaining: Math.max(0, target - value), progress: Math.min(CHECKPOINT_INTERVAL, value - unlocked * CHECKPOINT_INTERVAL) };
  }

  function missionForCheckpoint(checkpointNumber, locale) {
    const number = Math.max(1, Number(checkpointNumber || 1));
    const template = MISSION_TEMPLATES[(number - 1) % MISSION_TEMPLATES.length];
    const en = locale === "en";
    return {
      checkpoint: number,
      kind: template.kind,
      question: en ? template.en : template.ko,
      choices: (en ? template.choicesEn : template.choicesKo).slice(),
      answerIndex: template.answerIndex,
      explanation: en ? template.explainEn : template.explainKo
    };
  }

  function unlockedPracticeModules(count) {
    const value = Math.max(0, Number(count || 0));
    return PRACTICE_MODULES.map(function(module) {
      return Object.assign({}, module, { unlocked: value >= module.threshold, remaining: Math.max(0, module.threshold - value) });
    });
  }

  function startOfWeek(now) {
    const date = new Date(now == null ? Date.now() : now);
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = (local.getDay() + 6) % 7;
    local.setDate(local.getDate() - day);
    return local.getTime();
  }

  function weeklyStatus(events, now) {
    const start = startOfWeek(now);
    const end = start + 7 * 24 * 60 * 60 * 1000;
    const rows = (Array.isArray(events) ? events : []).filter(function(event) {
      const ts = Number(event && event.at || 0);
      return ts >= start && ts < end;
    });
    const lessonAttempts = rows.filter(function(event) { return event.kind === "lesson_attempt"; });
    const daySet = new Set(lessonAttempts.map(function(event) {
      const d = new Date(Number(event.at));
      return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
    }));
    return {
      cardAttempts: lessonAttempts.length,
      studyDays: daySet.size,
      cardGoal: WEEKLY_CARD_GOAL,
      dayGoal: WEEKLY_DAY_GOAL,
      cardsComplete: lessonAttempts.length >= WEEKLY_CARD_GOAL,
      daysComplete: daySet.size >= WEEKLY_DAY_GOAL,
      complete: lessonAttempts.length >= WEEKLY_CARD_GOAL && daySet.size >= WEEKLY_DAY_GOAL
    };
  }

  function appendEvent(events, event) {
    const rows = Array.isArray(events) ? events.slice() : [];
    rows.push(Object.assign({ at: Date.now() }, event || {}));
    const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
    return rows.filter(function(row) { return Number(row.at || 0) >= cutoff; }).slice(-5000);
  }

  function completionSummary(completedCheckpoints, checkpointCount) {
    const completed = new Set((completedCheckpoints || []).map(Number));
    let passed = 0;
    for (let i = 1; i <= checkpointCount; i += 1) if (completed.has(i)) passed += 1;
    return { available: checkpointCount, passed: passed, pending: Math.max(0, checkpointCount - passed) };
  }

  return {
    VERSION: VERSION,
    CHECKPOINT_INTERVAL: CHECKPOINT_INTERVAL,
    WEEKLY_CARD_GOAL: WEEKLY_CARD_GOAL,
    WEEKLY_DAY_GOAL: WEEKLY_DAY_GOAL,
    MASTERY_LEVELS: MASTERY_LEVELS.map(function(row) { return Object.assign({}, row); }),
    PRACTICE_MODULES: PRACTICE_MODULES.map(function(row) { return Object.assign({}, row); }),
    attemptedCount: attemptedCount,
    masteryForCard: masteryForCard,
    conceptMastery: conceptMastery,
    unlockedCheckpointCount: unlockedCheckpointCount,
    nextCheckpoint: nextCheckpoint,
    missionForCheckpoint: missionForCheckpoint,
    unlockedPracticeModules: unlockedPracticeModules,
    startOfWeek: startOfWeek,
    weeklyStatus: weeklyStatus,
    appendEvent: appendEvent,
    completionSummary: completionSummary
  };
});
