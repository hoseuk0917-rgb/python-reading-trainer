from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / 'src/pwa/learning_engine_v341.js'
EXPERIENCE = ROOT / 'src/pwa/learning_experience_v341.js'
INDEX = ROOT / 'src/pwa/index.html'
APPLY = '--apply' in sys.argv

engine = ENGINE.read_text(encoding='utf-8')
experience = EXPERIENCE.read_text(encoding='utf-8')
index = INDEX.read_text(encoding='utf-8')
orig_engine, orig_experience, orig_index = engine, experience, index

# Engine family lookup must also be prototype-safe.
old_family = '''  function familyOf(concept) {\n    const key = normalizeConcept(concept);\n    return CONCEPT_FAMILY[key] || key;\n  }\n'''
new_family = '''  function ownValue(map, key) {\n    return map && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;\n  }\n\n  function familyOf(concept) {\n    const key = normalizeConcept(concept);\n    return ownValue(CONCEPT_FAMILY, key) || key;\n  }\n'''
if old_family in engine:
    engine = engine.replace(old_family, new_family, 1)
elif new_family not in engine:
    raise SystemExit('ENGINE_FAMILY_ANCHOR_NOT_FOUND')

# A few Python syntax concepts should join their natural practice families.
old_alias = '    input: "input", indentation: "indentation", comment: "comment", none: "none"\n'
new_alias = '    input: "input", indentation: "indentation", comment: "comment", none: "none",\n    with: "file", enumerate: "loop", zip: "loop", sorted: "list", finally: "exception"\n'
if old_alias in engine:
    engine = engine.replace(old_alias, new_alias, 1)
elif new_alias not in engine:
    raise SystemExit('ENGINE_ALIAS_ANCHOR_NOT_FOUND')

# Add additional learned-syntax-only variants. The existing availability gate still applies.
anchor = '''    {\n      id: "for_sum", moduleId: "loop", kind: "loop_trace",\n'''
extra = '''    {\n      id: "if_false_branch", moduleId: "condition", kind: "branch_trace",\n      requires: [["if", "condition"], ["print", "output"]],\n      code: 'temperature = 18\\nif temperature >= 20:\\n    print("warm")\\nelse:\\n    print("cool")',\n      questionKo: "조건을 계산한 뒤 실제로 출력되는 값은 무엇일까요?",\n      questionEn: "After evaluating the condition, what is actually printed?",\n      choicesKo: ["warm", "cool", "둘 다"],\n      choicesEn: ["warm", "cool", "Both"],\n      answerIndex: 1,\n      explainKo: "18 >= 20은 거짓이므로 if 블록을 건너뛰고 else 블록의 cool을 출력합니다.",\n      explainEn: "18 >= 20 is false, so the if block is skipped and the else branch prints cool."\n    },\n    {\n      id: "if_value_after_branch", moduleId: "condition", kind: "value_trace",\n      requires: [["if", "condition"], ["variable", "assignment"], ["print", "output"]],\n      code: 'count = 2\\nif count > 0:\\n    label = "ready"\\nelse:\\n    label = "empty"\\nprint(label)',\n      questionKo: "마지막 줄에서 출력되는 label 값은 무엇일까요?",\n      questionEn: "Which label value is printed on the last line?",\n      choicesKo: ["ready", "empty", "2"],\n      choicesEn: ["ready", "empty", "2"],\n      answerIndex: 0,\n      explainKo: "count > 0이 참이므로 label에 ready가 저장되고 마지막 print가 그 값을 출력합니다.",\n      explainEn: "count > 0 is true, so label becomes ready and the final print displays it."\n    },\n    {\n      id: "elif_route", moduleId: "condition", kind: "branch_trace",\n      requires: [["if", "condition"], ["elif"], ["print", "output"]],\n      code: 'score = 70\\nif score >= 90:\\n    print("A")\\nelif score >= 60:\\n    print("B")\\nelse:\\n    print("C")',\n      questionKo: "위에서부터 조건을 검사할 때 실제로 선택되는 분기는 무엇일까요?",\n      questionEn: "Which branch is selected when conditions are checked from top to bottom?",\n      choicesKo: ["A", "B", "C"],\n      choicesEn: ["A", "B", "C"],\n      answerIndex: 1,\n      explainKo: "첫 조건은 거짓이고 70 >= 60은 참이므로 elif 분기의 B가 출력됩니다.",\n      explainEn: "The first condition is false and 70 >= 60 is true, so the elif branch prints B."\n    },\n''' + anchor
if anchor in engine and 'id: "if_false_branch"' not in engine:
    engine = engine.replace(anchor, extra, 1)
elif 'id: "if_false_branch"' not in engine:
    raise SystemExit('CONDITION_TEMPLATE_ANCHOR_NOT_FOUND')

anchor2 = '''    {\n      id: "list_index", moduleId: "collections", kind: "collection_lookup",\n'''
extra2 = '''    {\n      id: "for_last_value", moduleId: "loop", kind: "value_trace",\n      requires: [["for", "loop"], ["list"], ["print", "output"]],\n      code: 'last = ""\\nfor name in ["A", "B", "C"]:\\n    last = name\\nprint(last)',\n      questionKo: "반복이 모두 끝난 뒤 last에 남아 출력되는 값은 무엇일까요?",\n      questionEn: "What remains in last and is printed after the loop finishes?",\n      choicesKo: ["A", "B", "C"],\n      choicesEn: ["A", "B", "C"],\n      answerIndex: 2,\n      explainKo: "반복할 때마다 last가 현재 name으로 바뀌므로 마지막 항목 C가 남습니다.",\n      explainEn: "last is replaced by the current name on every iteration, so the final item C remains."\n    },\n    {\n      id: "break_exit", moduleId: "loop", kind: "loop_trace",\n      requires: [["for", "loop"], ["range"], ["break"], ["print", "output"]],\n      code: 'value = -1\\nfor n in range(5):\\n    value = n\\n    if n == 2:\\n        break\\nprint(value)',\n      questionKo: "break로 반복이 끝난 뒤 출력되는 value는 무엇일까요?",\n      questionEn: "What value is printed after break stops the loop?",\n      choicesKo: ["1", "2", "4"],\n      choicesEn: ["1", "2", "4"],\n      answerIndex: 1,\n      explainKo: "n이 2인 회차에서 value에 2가 저장된 뒤 break가 실행되어 반복이 끝납니다.",\n      explainEn: "When n reaches 2, value becomes 2 and break ends the loop."\n    },\n    {\n      id: "continue_skip", moduleId: "loop", kind: "loop_trace",\n      requires: [["for", "loop"], ["range"], ["continue"], ["print", "output"]],\n      code: 'total = 0\\nfor n in range(4):\\n    if n == 2:\\n        continue\\n    total = total + n\\nprint(total)',\n      questionKo: "n == 2 회차를 건너뛴 뒤 total의 최종 값은 무엇일까요?",\n      questionEn: "What is the final total after the n == 2 iteration is skipped?",\n      choicesKo: ["4", "6", "3"],\n      choicesEn: ["4", "6", "3"],\n      answerIndex: 0,\n      explainKo: "0, 1, 3만 더하므로 total은 4가 됩니다.",\n      explainEn: "Only 0, 1, and 3 are added, so total becomes 4."\n    },\n''' + anchor2
if anchor2 in engine and 'id: "for_last_value"' not in engine:
    engine = engine.replace(anchor2, extra2, 1)
elif 'id: "for_last_value"' not in engine:
    raise SystemExit('LOOP_TEMPLATE_ANCHOR_NOT_FOUND')

anchor3 = '''    {\n      id: "file_with", moduleId: "file_error", kind: "resource_flow",\n'''
extra3 = '''    {\n      id: "function_parameter_flow", moduleId: "functions", kind: "call_trace",\n      requires: [["def", "function"], ["parameter", "argument"], ["return"]],\n      code: 'def add_tax(price):\\n    return price + 1\\n\\nresult = add_tax(4)',\n      questionKo: "4가 매개변수 price로 들어간 뒤 result에 저장되는 값은 무엇일까요?",\n      questionEn: "After 4 is passed into parameter price, what is stored in result?",\n      choicesKo: ["4", "5", "None"],\n      choicesEn: ["4", "5", "None"],\n      answerIndex: 1,\n      explainKo: "호출 인자 4가 price에 들어가고 return price + 1이 5를 호출한 곳으로 돌려줍니다.",\n      explainEn: "Argument 4 is bound to price, and return price + 1 sends 5 back to the caller."\n    },\n''' + anchor3
if anchor3 in engine and 'id: "function_parameter_flow"' not in engine:
    engine = engine.replace(anchor3, extra3, 1)
elif 'id: "function_parameter_flow"' not in engine:
    raise SystemExit('FUNCTION_TEMPLATE_ANCHOR_NOT_FOUND')

# Rotate among near-best recent candidates instead of always choosing one dominant template.
old_choose = '''  function chooseTemplate(candidates, context, seed) {\n    if (!candidates.length) return null;\n    return candidates.slice().sort(function(a, b) {\n      const scoreDiff = templateRecencyScore(b, context) - templateRecencyScore(a, context);\n      if (scoreDiff) return scoreDiff;\n      return simpleHash(a.id + "|" + seed) - simpleHash(b.id + "|" + seed);\n    })[0];\n  }\n'''
new_choose = '''  function chooseTemplate(candidates, context, seed, rotationIndex) {\n    if (!candidates.length) return null;\n    const scored = candidates.map(function(template) {\n      return { template: template, score: templateRecencyScore(template, context) };\n    }).sort(function(a, b) {\n      if (b.score !== a.score) return b.score - a.score;\n      return a.template.id.localeCompare(b.template.id);\n    });\n    const maxScore = scored[0].score;\n    let pool = scored.filter(function(row) { return row.score >= Math.max(0, maxScore - 3); }).slice(0, 8);\n    if (pool.length < Math.min(3, scored.length)) pool = scored.slice(0, Math.min(5, scored.length));\n    const rawIndex = Number.isFinite(Number(rotationIndex)) ? Math.max(0, Number(rotationIndex)) : simpleHash(seed);\n    return pool[rawIndex % pool.length].template;\n  }\n'''
if old_choose in engine:
    engine = engine.replace(old_choose, new_choose, 1)
elif new_choose not in engine:
    raise SystemExit('CHOOSE_TEMPLATE_ANCHOR_NOT_FOUND')

old_cp_choose = '    const template = chooseTemplate(candidates, context, "checkpoint:" + number);\n'
new_cp_choose = '    const template = chooseTemplate(candidates, context, "checkpoint:" + number, number - 1);\n'
if old_cp_choose in engine:
    engine = engine.replace(old_cp_choose, new_cp_choose, 1)
elif new_cp_choose not in engine:
    raise SystemExit('CHECKPOINT_CHOOSE_ANCHOR_NOT_FOUND')

# Final partial curriculum segment becomes a real final checkpoint while keeping old API compatibility.
old_checkpoint = '''  function unlockedCheckpointCount(count) {\n    return Math.floor(Math.max(0, Number(count || 0)) / CHECKPOINT_INTERVAL);\n  }\n\n  function nextCheckpoint(count) {\n    const value = Math.max(0, Number(count || 0));\n    const unlocked = unlockedCheckpointCount(value);\n    const target = (unlocked + 1) * CHECKPOINT_INTERVAL;\n    return { unlocked: unlocked, target: target, remaining: Math.max(0, target - value), progress: Math.min(CHECKPOINT_INTERVAL, value - unlocked * CHECKPOINT_INTERVAL) };\n  }\n'''
new_checkpoint = '''  function unlockedCheckpointCount(count, totalCards) {\n    const value = Math.max(0, Number(count || 0));\n    const total = Math.max(0, Number(totalCards || 0));\n    let unlocked = Math.floor(value / CHECKPOINT_INTERVAL);\n    if (total > 0 && total % CHECKPOINT_INTERVAL !== 0 && value >= total) {\n      unlocked = Math.max(unlocked, Math.ceil(total / CHECKPOINT_INTERVAL));\n    }\n    return unlocked;\n  }\n\n  function nextCheckpoint(count, totalCards) {\n    const value = Math.max(0, Number(count || 0));\n    const total = Math.max(0, Number(totalCards || 0));\n    const unlocked = unlockedCheckpointCount(value, total);\n    if (total > 0 && value >= total) {\n      return { unlocked: unlocked, target: total, remaining: 0, progress: total % CHECKPOINT_INTERVAL || CHECKPOINT_INTERVAL, complete: true };\n    }\n    let target = (unlocked + 1) * CHECKPOINT_INTERVAL;\n    if (total > 0) target = Math.min(target, total);\n    const base = unlocked * CHECKPOINT_INTERVAL;\n    return { unlocked: unlocked, target: target, remaining: Math.max(0, target - value), progress: Math.max(0, Math.min(CHECKPOINT_INTERVAL, value - base)), complete: false };\n  }\n'''
if old_checkpoint in engine:
    engine = engine.replace(old_checkpoint, new_checkpoint, 1)
elif new_checkpoint not in engine:
    raise SystemExit('CHECKPOINT_FUNCTION_ANCHOR_NOT_FOUND')

# Experience: use total curriculum for tail checkpoint and display all curated user-facing mastery concepts.
experience = experience.replace('engine().nextCheckpoint(count);', 'engine().nextCheckpoint(count, cards.length);')
experience = experience.replace('engine().unlockedCheckpointCount(count);', 'engine().unlockedCheckpointCount(count, cards.length);')
experience = experience.replace('engine().unlockedCheckpointCount(beforeCount);', 'engine().unlockedCheckpointCount(beforeCount, Array.isArray(cards) ? cards.length : 0);')
experience = experience.replace('engine().unlockedCheckpointCount(afterCount);', 'engine().unlockedCheckpointCount(afterCount, Array.isArray(cards) ? cards.length : 0);')

helper_anchor = '''  function renderLearningSummary() {\n'''
helper = '''  function masteryDisplayRows(rows) {\n    const source = Array.isArray(rows) ? rows : [];\n    try {\n      if (typeof conceptInfo === "object" && conceptInfo) {\n        const curated = source.filter(function(row) {\n          return row && Object.prototype.hasOwnProperty.call(conceptInfo, row.concept);\n        });\n        if (curated.length) return curated;\n      }\n    } catch (_) {}\n    return source.filter(function(row) { return row && row.primaryCards > 0; });\n  }\n\n''' + helper_anchor
if helper_anchor in experience and 'function masteryDisplayRows(rows)' not in experience:
    experience = experience.replace(helper_anchor, helper, 1)
elif 'function masteryDisplayRows(rows)' not in experience:
    raise SystemExit('MASTERY_HELPER_ANCHOR_NOT_FOUND')

old_summary_mastery = '''    const mastery = engine().conceptMastery(cards, safeProgress(), reviewState(), function(card) { return primaryConcept(card); });\n    const consolidated = mastery.filter(function(row) { return row.level.key === "consolidated"; }).length;\n'''
new_summary_mastery = '''    const mastery = engine().conceptMastery(cards, safeProgress(), reviewState(), function(card) { return primaryConcept(card); });\n    const displayMastery = masteryDisplayRows(mastery);\n    const consolidated = displayMastery.filter(function(row) { return row.level.key === "consolidated"; }).length;\n'''
if old_summary_mastery in experience:
    experience = experience.replace(old_summary_mastery, new_summary_mastery, 1)
elif new_summary_mastery not in experience:
    raise SystemExit('SUMMARY_MASTERY_ANCHOR_NOT_FOUND')

old_practice_mastery = '''    const mastery = engine().conceptMastery(cards, progress, reviews, function(card) { return primaryConcept(card); });\n    const modules = engine().unlockedPracticeModules(count, cards, function(card) { return primaryConcept(card); });\n    const consolidated = mastery.filter(function(row) { return row.level.key === "consolidated"; }).length;\n'''
new_practice_mastery = '''    const mastery = engine().conceptMastery(cards, progress, reviews, function(card) { return primaryConcept(card); });\n    const displayMastery = masteryDisplayRows(mastery);\n    const modules = engine().unlockedPracticeModules(count, cards, function(card) { return primaryConcept(card); });\n    const consolidated = displayMastery.filter(function(row) { return row.level.key === "consolidated"; }).length;\n'''
if old_practice_mastery in experience:
    experience = experience.replace(old_practice_mastery, new_practice_mastery, 1)
elif new_practice_mastery not in experience:
    raise SystemExit('PRACTICE_MASTERY_ANCHOR_NOT_FOUND')

experience = experience.replace('[consolidated + " / " + mastery.length, t("정착 개념", "Consolidated concepts")]', '[consolidated + " / " + displayMastery.length, t("정착 개념", "Consolidated concepts")]')
experience = experience.replace('mastery.slice(0, 80).forEach(function(row) {', 'displayMastery.forEach(function(row) {')
old_mastery_text = '''    masteryCard.innerHTML = '<h2>' + t("개념 숙련도 지도", "Concept mastery map") + '</h2><p>' + t("정답 수가 아니라 실제 학습·변형복습 근거로 상태를 표시합니다.", "States reflect actual learning and variant-review evidence rather than raw points.") + '</p>';\n'''
new_mastery_text = '''    masteryCard.innerHTML = '<h2>' + t("개념 숙련도 지도", "Concept mastery map") + '</h2><p>' + t("모든 세부 개념의 학습 증거는 내부에 집계하고, 여기에는 설명이 준비된 핵심 개념을 빠짐없이 표시합니다.", "Evidence is tracked for every detailed concept; this map shows every core concept with a prepared explanation, without an arbitrary cutoff.") + '</p>';\n'''
if old_mastery_text in experience:
    experience = experience.replace(old_mastery_text, new_mastery_text, 1)
elif new_mastery_text not in experience:
    raise SystemExit('MASTERY_TEXT_ANCHOR_NOT_FOUND')

# Cache-bust only the hardened V341 runtime assets while preserving historical version identifiers.
old_engine_script = '<script src="./learning_engine_v341.js?v=20260812_v341_a2"></script>'
new_engine_script = '<script src="./learning_engine_v341.js?v=20260812_v341_a2&h=20260812_v342_a1"></script>'
if old_engine_script in index:
    index = index.replace(old_engine_script, new_engine_script, 1)
elif new_engine_script not in index:
    raise SystemExit('INDEX_ENGINE_ANCHOR_NOT_FOUND')
old_exp_script = '<script src="./learning_experience_v341.js?v=20260812_v341_a2"></script>'
new_exp_script = '<script src="./learning_experience_v341.js?v=20260812_v341_a2&h=20260812_v342_a1"></script>'
if old_exp_script in index:
    index = index.replace(old_exp_script, new_exp_script, 1)
elif new_exp_script not in index:
    raise SystemExit('INDEX_EXPERIENCE_ANCHOR_NOT_FOUND')

changes = int(engine != orig_engine) + int(experience != orig_experience) + int(index != orig_index)
print('PATCH_VERSION=v342_learning_hardening_a1')
print(f'APPLY={APPLY}')
print(f'CHANGES={changes}')
checks = {
    'ENGINE_PROTOTYPE_SAFE': 'ownValue(CONCEPT_FAMILY' in engine,
    'TAIL_CHECKPOINT_AWARE': 'Math.ceil(total / CHECKPOINT_INTERVAL)' in engine,
    'ROTATING_TEMPLATE_POOL': 'rotationIndex' in engine and 'pool[rawIndex % pool.length]' in engine,
    'CONDITION_VARIANTS': all(x in engine for x in ['if_false_branch','if_value_after_branch','elif_route']),
    'LOOP_VARIANTS': all(x in engine for x in ['for_last_value','break_exit','continue_skip']),
    'FUNCTION_VARIANT': 'function_parameter_flow' in engine,
    'MASTERY_NO_80_CUTOFF': 'mastery.slice(0, 80)' not in experience,
    'MASTERY_CURATED_COMPLETE': 'masteryDisplayRows' in experience and 'displayMastery.forEach' in experience,
    'V342_RUNTIME_CACHE_BUST': index.count('&h=20260812_v342_a1') >= 3,
}
for k,v in checks.items(): print(f'{k}={v}')
if not all(checks.values()): raise SystemExit('HARDENING_CHECK_FAILED')

if APPLY:
    ENGINE.write_text(engine, encoding='utf-8')
    EXPERIENCE.write_text(experience, encoding='utf-8')
    INDEX.write_text(index, encoding='utf-8')
else:
    if changes:
        raise SystemExit('NOT_IDEMPOTENT')
    print('IDEMPOTENT=True')
print('RESULT=PASS_LEARNING_HARDENING_V342')
