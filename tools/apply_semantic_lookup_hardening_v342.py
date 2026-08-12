from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SEM = ROOT / 'src/pwa/content_quality_semantics.js'
INDEX = ROOT / 'src/pwa/index.html'
APPLY = '--apply' in sys.argv

sem = SEM.read_text(encoding='utf-8')
index = INDEX.read_text(encoding='utf-8')
orig_sem = sem
orig_index = index

old_family = '''  function family(value) {\n    const key = String(value == null ? "" : value);\n    return FAMILY[key] || FAMILY[key.toLowerCase()] || key.toLowerCase();\n  }\n'''
new_family = '''  function ownValue(map, key) {\n    return map && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;\n  }\n\n  function family(value) {\n    const key = String(value == null ? "" : value);\n    return ownValue(FAMILY, key) || ownValue(FAMILY, key.toLowerCase()) || key.toLowerCase();\n  }\n'''
if old_family in sem:
    sem = sem.replace(old_family, new_family, 1)
elif new_family not in sem:
    raise SystemExit('FAMILY_ANCHOR_NOT_FOUND')

old_score = '''  function scoreConcept(card, concept, index) {\n    const tokens = TOKENS[concept] || TOKENS[String(concept || "").toLowerCase()] || [String(concept || "")];\n'''
new_score = '''  function scoreConcept(card, concept, index) {\n    const directTokens = ownValue(TOKENS, concept);\n    const lowerTokens = ownValue(TOKENS, String(concept || "").toLowerCase());\n    const tokens = Array.isArray(directTokens) ? directTokens : (Array.isArray(lowerTokens) ? lowerTokens : [String(concept || "")]);\n'''
if old_score in sem:
    sem = sem.replace(old_score, new_score, 1)
elif new_score not in sem:
    raise SystemExit('SCORE_ANCHOR_NOT_FOUND')

old_filter = '''    const candidates = (Array.isArray(concepts) ? concepts : []).filter(function(concept) {\n      return conceptInfo && conceptInfo[concept];\n    });\n'''
new_filter = '''    const candidates = (Array.isArray(concepts) ? concepts : []).filter(function(concept) {\n      return conceptInfo && Object.prototype.hasOwnProperty.call(conceptInfo, concept);\n    });\n'''
if old_filter in sem:
    sem = sem.replace(old_filter, new_filter, 1)
elif new_filter not in sem:
    raise SystemExit('FILTER_ANCHOR_NOT_FOUND')

old_script = '<script src="./content_quality_semantics.js?v=20260812_v339_quality3"></script>'
new_script = '<script src="./content_quality_semantics.js?v=20260812_v339_quality3&h=20260812_v342_a1"></script>'
if old_script in index:
    index = index.replace(old_script, new_script, 1)
elif new_script not in index:
    raise SystemExit('INDEX_SEMANTIC_SCRIPT_ANCHOR_NOT_FOUND')

changes = int(sem != orig_sem) + int(index != orig_index)
print('PATCH_VERSION=v342_semantic_lookup_hardening_a1')
print(f'APPLY={APPLY}')
print(f'CHANGES={changes}')
print('PROTOTYPE_SAFE_FAMILY=' + str('ownValue(FAMILY' in sem))
print('PROTOTYPE_SAFE_TOKENS=' + str('ownValue(TOKENS' in sem))
print('PROTOTYPE_SAFE_CONCEPT_INFO=' + str('hasOwnProperty.call(conceptInfo' in sem))
print('V342_SEMANTIC_CACHE_BUST=' + str('&h=20260812_v342_a1' in index))

if APPLY:
    SEM.write_text(sem, encoding='utf-8')
    INDEX.write_text(index, encoding='utf-8')
else:
    if changes:
        raise SystemExit('NOT_IDEMPOTENT')
    print('IDEMPOTENT=True')

print('RESULT=PASS_SEMANTIC_LOOKUP_HARDENING_V342')
