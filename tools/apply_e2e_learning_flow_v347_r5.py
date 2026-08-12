#!/usr/bin/env python3
"""Add the exact iframe viewport contract to the V347 browser case."""
from __future__ import annotations
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "tools" / "e2e_learning_flow_v347_browser_case.js"
OLD = '    note("CASE_VIEWPORT", `${window.innerWidth}x${window.innerHeight}`);'
NEW = '''    note("CASE_VIEWPORT", `${window.innerWidth}x${window.innerHeight}`);
    const caseName = new URLSearchParams(location.search).get("case") || "desktop";
    if (caseName === "narrow") add("APP_VIEWPORT_390", win().innerWidth === 390, win().innerWidth);
    else add("APP_VIEWPORT_DESKTOP", win().innerWidth >= 1000, win().innerWidth);'''

def transform(text: str):
    if NEW in text: return text, 0
    if OLD not in text: raise RuntimeError("viewport anchor missing")
    return text.replace(OLD, NEW, 1), 1

def main():
    p=argparse.ArgumentParser(); g=p.add_mutually_exclusive_group(required=True); g.add_argument('--apply',action='store_true'); g.add_argument('--check',action='store_true'); a=p.parse_args()
    original=TARGET.read_text(encoding='utf-8'); target,changes=transform(original)
    if a.apply and changes: TARGET.write_text(target,encoding='utf-8',newline='\n')
    actual=TARGET.read_text(encoding='utf-8') if a.apply else target; _,remaining=transform(actual); valid=remaining==0
    print('PATCH_VERSION=v347_r5'); print(f'APPLY={a.apply}'); print(f'CHANGES={changes}'); print(f'VALID={valid}')
    if a.check: print(f'IDEMPOTENT={valid and changes==0}')
    if not valid or (a.check and changes!=0): print('RESULT=FAIL_E2E_LEARNING_FLOW_V347_R5_PATCH'); return 1
    print('RESULT=PASS_E2E_LEARNING_FLOW_V347_R5_PATCH'); return 0
if __name__=='__main__': raise SystemExit(main())
