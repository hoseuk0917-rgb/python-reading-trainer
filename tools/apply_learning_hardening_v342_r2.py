from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / 'src/pwa/learning_engine_v341.js'
APPLY = '--apply' in sys.argv
text = ENGINE.read_text(encoding='utf-8')
orig = text

old = '''  function chooseTemplate(candidates, context, seed, rotationIndex) {\n    if (!candidates.length) return null;\n    const scored = candidates.map(function(template) {\n      return { template: template, score: templateRecencyScore(template, context) };\n    }).sort(function(a, b) {\n      if (b.score !== a.score) return b.score - a.score;\n      return a.template.id.localeCompare(b.template.id);\n    });\n    const maxScore = scored[0].score;\n    let pool = scored.filter(function(row) { return row.score >= Math.max(0, maxScore - 3); }).slice(0, 8);\n    if (pool.length < Math.min(3, scored.length)) pool = scored.slice(0, Math.min(5, scored.length));\n    const rawIndex = Number.isFinite(Number(rotationIndex)) ? Math.max(0, Number(rotationIndex)) : simpleHash(seed);\n    return pool[rawIndex % pool.length].template;\n  }\n'''
new = '''  function chooseTemplate(candidates, context, seed, rotationIndex) {\n    if (!candidates.length) return null;\n    const scored = candidates.map(function(template) {\n      return { template: template, score: templateRecencyScore(template, context) };\n    }).sort(function(a, b) {\n      if (b.score !== a.score) return b.score - a.score;\n      return a.template.id.localeCompare(b.template.id);\n    });\n    let pool = scored.filter(function(row) { return row.score > 0; });\n    if (pool.length < Math.min(4, scored.length)) pool = scored.slice(0, Math.min(6, scored.length));\n    pool = pool.sort(function(a, b) { return a.template.id.localeCompare(b.template.id); });\n    const hasRotation = Number.isFinite(Number(rotationIndex));\n    const rawIndex = hasRotation ? Math.max(0, Number(rotationIndex)) * 5 + 1 : simpleHash(seed);\n    return pool[rawIndex % pool.length].template;\n  }\n'''
if old in text:
    text = text.replace(old, new, 1)
elif new not in text:
    raise SystemExit('ROTATION_POLICY_ANCHOR_NOT_FOUND')

changes = int(text != orig)
print('PATCH_VERSION=v342_learning_hardening_r2_balanced_rotation')
print(f'APPLY={APPLY}')
print(f'CHANGES={changes}')
print('RECENT_RELEVANT_POOL=' + str('row.score > 0' in text))
print('DETERMINISTIC_ROTATION=' + str('Number(rotationIndex)) * 5 + 1' in text))
if APPLY:
    ENGINE.write_text(text, encoding='utf-8')
else:
    if changes:
        raise SystemExit('NOT_IDEMPOTENT')
    print('IDEMPOTENT=True')
print('RESULT=PASS_LEARNING_HARDENING_V342_R2')
