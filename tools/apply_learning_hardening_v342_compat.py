from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / 'src/pwa/learning_engine_v341.js'
EXPERIENCE = ROOT / 'src/pwa/learning_experience_v341.js'
INDEX = ROOT / 'src/pwa/index.html'
ORIGINAL = ROOT / 'tools/apply_learning_hardening_v342.py'
APPLY = '--apply' in sys.argv


def read_state():
    engine = ENGINE.read_text(encoding='utf-8')
    experience = EXPERIENCE.read_text(encoding='utf-8')
    index = INDEX.read_text(encoding='utf-8')
    checks = {
        'ENGINE_PROTOTYPE_SAFE': 'ownValue(CONCEPT_FAMILY' in engine,
        'LEARNED_FAMILY_ALIASES': all(token in engine for token in ['with: "file"', 'enumerate: "loop"', 'zip: "loop"', 'sorted: "list"', 'finally: "exception"']),
        'CONDITION_VARIANTS': all(token in engine for token in ['id: "if_false_branch"', 'id: "if_value_after_branch"', 'id: "elif_route"']),
        'LOOP_VARIANTS': all(token in engine for token in ['id: "for_last_value"', 'id: "break_exit"', 'id: "continue_skip"']),
        'FUNCTION_VARIANT': 'id: "function_parameter_flow"' in engine,
        'ROTATION_INDEX_WIRED': 'chooseTemplate(candidates, context, "checkpoint:" + number, number - 1)' in engine,
        'TAIL_CHECKPOINT_AWARE': 'Math.ceil(total / CHECKPOINT_INTERVAL)' in engine and 'complete: true' in engine,
        'MASTERY_TOTAL_AWARE': 'engine().nextCheckpoint(count, cards.length)' in experience and 'masteryDisplayRows' in experience,
        'MASTERY_NO_80_CUTOFF': 'mastery.slice(0, 80)' not in experience,
        'V342_RUNTIME_CACHE_BUST': index.count('&h=20260812_v342_a1') >= 3,
    }
    final_r2 = 'row.score > 0' in engine and 'Number(rotationIndex)) * 5 + 1' in engine
    a1_rotation = 'row.score >= Math.max(0, maxScore - 3)' in engine
    return checks, final_r2, a1_rotation


checks, final_r2, a1_rotation = read_state()
all_ok = all(checks.values())
print('PATCH_VERSION=v342_learning_hardening_a1_compat')
print(f'APPLY={APPLY}')
print(f'FINAL_R2_ROTATION_PRESENT={final_r2}')
print(f'A1_ROTATION_PRESENT={a1_rotation}')
for key, value in checks.items():
    print(f'{key}={value}')

if all_ok:
    print('CHANGES=0')
    print('IDEMPOTENT=True')
    print('RESULT=PASS_LEARNING_HARDENING_V342_A1_COMPAT')
    raise SystemExit(0)

if final_r2:
    missing = [key for key, value in checks.items() if not value]
    raise SystemExit('FINAL_R2_STATE_INCOMPLETE:' + ','.join(missing))

if not APPLY:
    missing = [key for key, value in checks.items() if not value]
    raise SystemExit('A1_HARDENING_MISSING:' + ','.join(missing))

result = subprocess.run([sys.executable, str(ORIGINAL), '--apply'], cwd=ROOT)
if result.returncode != 0:
    raise SystemExit(result.returncode)

checks, final_r2, a1_rotation = read_state()
missing = [key for key, value in checks.items() if not value]
if missing:
    raise SystemExit('A1_APPLY_INCOMPLETE:' + ','.join(missing))
print('CHANGES=APPLIED_BY_ORIGINAL_A1')
print('RESULT=PASS_LEARNING_HARDENING_V342_A1_COMPAT')
