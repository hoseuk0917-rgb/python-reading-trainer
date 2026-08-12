# -*- coding: utf-8 -*-
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "src" / "pwa" / "learning_engine_v340.js"
APP = ROOT / "src" / "pwa" / "app.js"
AUDIT = ROOT / "tools" / "audit_learning_loop_v340.js"

HELPERS = r'''
  function normalizeWorkedExampleCode(value) {
    return String(value || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map(function(line) { return line.trim(); })
      .filter(Boolean)
      .join("\n")
      .replace(/[ \t]+/g, " ")
      .trim();
  }

  function compactWorkedExampleCode(value) {
    return normalizeWorkedExampleCode(value).replace(/\s+/g, "");
  }

  function workedExampleEditDistance(a, b) {
    const aa = String(a || "");
    const bb = String(b || "");
    if (aa === bb) return 0;
    if (!aa.length) return bb.length;
    if (!bb.length) return aa.length;
    let prev = Array.from({ length: bb.length + 1 }, function(_, index) { return index; });
    for (let i = 1; i <= aa.length; i += 1) {
      const cur = [i];
      for (let j = 1; j <= bb.length; j += 1) {
        const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[bb.length];
  }

  function workedExampleSimilarity(problemCode, exampleCode) {
    const problem = compactWorkedExampleCode(problemCode);
    const example = compactWorkedExampleCode(exampleCode);
    const longest = Math.max(problem.length, example.length);
    if (!longest) return 1;
    return 1 - workedExampleEditDistance(problem, example) / longest;
  }

  function isWorkedExampleDistinct(problemCode, exampleCode) {
    const problem = compactWorkedExampleCode(problemCode);
    const example = compactWorkedExampleCode(exampleCode);
    if (!problem || !example) return false;
    if (problem === example) return false;
    if (Math.min(problem.length, example.length) >= 20 && workedExampleSimilarity(problem, example) >= 0.92) return false;
    return true;
  }

'''

OLD_SAFE = r'''    const safe = candidates.find(function(candidate) {
      return exampleUsesOnlyKnownNamedSyntax(candidate.code, allowed);
    });
    if (safe) return safe;

    return {
      concept: pickPrimaryConcept(card, conceptInfo),
      code: String(card && card.code || ""),
      source: "current-card"
    };
'''

NEW_SAFE = r'''    const problemCode = String(card && card.code || "");
    const safe = candidates.find(function(candidate) {
      return isWorkedExampleDistinct(problemCode, candidate.code) && exampleUsesOnlyKnownNamedSyntax(candidate.code, allowed);
    });
    return safe || null;
'''

OLD_EXPORT = '    pickSafeExample: pickSafeExample,\n    exampleUsesOnlyKnownNamedSyntax: exampleUsesOnlyKnownNamedSyntax,'
NEW_EXPORT = '    pickSafeExample: pickSafeExample,\n    isWorkedExampleDistinct: isWorkedExampleDistinct,\n    workedExampleSimilarity: workedExampleSimilarity,\n    exampleUsesOnlyKnownNamedSyntax: exampleUsesOnlyKnownNamedSyntax,'

OLD_TUPLE_EXAMPLE = 'example: "point = (10, 20)"'
NEW_TUPLE_EXAMPLE = 'example: "coords = (4, 9)\\nsecond = coords[1]\\nprint(second)"'

OLD_TEST_LEN = 'len: { definition: "len은 항목 개수를 돌려준다.", example: "items = [\'a\', \'b\']\\nprint(len(items))" },'
NEW_TEST_LEN = 'len: { definition: "len은 항목 개수를 돌려준다.", example: "items = [\'a\', \'b\', \'c\']\\nprint(len(items))" },'

OLD_TEST_ASSERT = 'assert(/\\blen\\s*\\(/.test(primaryExample.code));\npass("WORKED_EXAMPLE_PRIORITIZES_PRIMARY_CONCEPT");'
NEW_TEST_ASSERT = 'assert(/\\blen\\s*\\(/.test(primaryExample.code));\nassert(engine.isWorkedExampleDistinct(mixedCard.code, primaryExample.code));\npass("WORKED_EXAMPLE_PRIORITIZES_PRIMARY_CONCEPT");'

INSERT_BEFORE = '  function pickSafeExample(card, cards, index, conceptInfo, primaryConceptOverride) {'


def replace_once(text: str, old: str, new: str, label: str):
    count = text.count(old)
    if count == 0:
        if new in text:
            return text, 0
        raise SystemExit(f"FAIL {label}: expected source not found")
    if count != 1:
        raise SystemExit(f"FAIL {label}: expected one source, got {count}")
    return text.replace(old, new, 1), 1


def patch(apply: bool):
    changes = 0

    engine = ENGINE.read_text(encoding="utf-8-sig")
    if "function isWorkedExampleDistinct(" not in engine:
        engine, n = replace_once(engine, INSERT_BEFORE, HELPERS + INSERT_BEFORE, "engine helpers")
        changes += n
    engine, n = replace_once(engine, OLD_SAFE, NEW_SAFE, "engine safe selection")
    changes += n
    engine, n = replace_once(engine, OLD_EXPORT, NEW_EXPORT, "engine export")
    changes += n

    app = APP.read_text(encoding="utf-8-sig")
    app, n = replace_once(app, OLD_TUPLE_EXAMPLE, NEW_TUPLE_EXAMPLE, "tuple concept example")
    changes += n

    audit = AUDIT.read_text(encoding="utf-8-sig")
    audit, n = replace_once(audit, OLD_TEST_LEN, NEW_TEST_LEN, "v340 len fixture")
    changes += n
    audit, n = replace_once(audit, OLD_TEST_ASSERT, NEW_TEST_ASSERT, "v340 distinct assertion")
    changes += n

    if apply:
        ENGINE.write_text(engine, encoding="utf-8")
        APP.write_text(app, encoding="utf-8")
        AUDIT.write_text(audit, encoding="utf-8")

    print("=== V352 WORKED EXAMPLE DEDUP PATCH ===")
    print(f"APPLY={apply}")
    print(f"CHANGES={changes}")
    print(f"DISTINCT_GUARD={'True' if 'function isWorkedExampleDistinct(' in engine else 'False'}")
    print(f"CURRENT_CARD_FALLBACK_REMOVED={'True' if 'source: \"current-card\"' not in engine else 'False'}")
    print(f"TUPLE_EXAMPLE_CHANGED={'True' if NEW_TUPLE_EXAMPLE in app else 'False'}")
    if not apply and changes:
        raise SystemExit("FAIL V352 patch is not applied")
    print("RESULT=PASS_V352_PATCH" if not changes else "RESULT=V352_PATCH_READY")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    patch(apply=args.apply)


if __name__ == "__main__":
    main()
