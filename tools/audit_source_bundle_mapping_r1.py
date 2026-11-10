#!/usr/bin/env python3
from __future__ import annotations

import argparse
import ast
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data" / "lessons"

BUNDLE_URLS = {
    "PY_REF_EXPRESSIONS": "https://docs.python.org/3.10/reference/expressions.html",
    "PY_REF_SIMPLE_STATEMENTS": "https://docs.python.org/3.10/reference/simple_stmts.html",
    "PY_REF_COMPOUND_STATEMENTS": "https://docs.python.org/3.10/reference/compound_stmts.html",
    "PY_REF_LEXICAL_ANALYSIS": "https://docs.python.org/3.10/reference/lexical_analysis.html",
    "PY_BUILTIN_FUNCTIONS": "https://docs.python.org/3.10/library/functions.html",
    "PY_BUILTIN_TYPES": "https://docs.python.org/3.10/library/stdtypes.html",
    "PY_TUTORIAL_CONTROL_FLOW": "https://docs.python.org/3.10/tutorial/controlflow.html",
    "PY_TUTORIAL_DATA_STRUCTURES": "https://docs.python.org/3.10/tutorial/datastructures.html",
}

PRIMARY_BUNDLES = {
    "call": "PY_REF_EXPRESSIONS",
    "subscription": "PY_REF_EXPRESSIONS",
    "slice": "PY_REF_EXPRESSIONS",
    "list_comprehension": "PY_REF_EXPRESSIONS",
    "dict_comprehension": "PY_REF_EXPRESSIONS",
    "set_comprehension": "PY_REF_EXPRESSIONS",
    "generator_expression": "PY_REF_EXPRESSIONS",
    "lambda_expression": "PY_REF_EXPRESSIONS",
    "arithmetic": "PY_REF_EXPRESSIONS",
    "comparison": "PY_REF_EXPRESSIONS",
    "boolean_operation": "PY_REF_EXPRESSIONS",
    "conditional_expression": "PY_REF_EXPRESSIONS",
    "attribute_access": "PY_REF_EXPRESSIONS",
    "membership_test": "PY_REF_EXPRESSIONS",
    "identity_test": "PY_REF_EXPRESSIONS",
    "name_reference": "PY_REF_EXPRESSIONS",
    "literal": "PY_REF_EXPRESSIONS",
    "unary_operation": "PY_REF_EXPRESSIONS",
    "await_expression": "PY_REF_EXPRESSIONS",
    "star_unpacking": "PY_REF_EXPRESSIONS",
    "matrix_multiplication": "PY_REF_EXPRESSIONS",
    "yield_expression": "PY_REF_EXPRESSIONS",
    "sequence_operation": "PY_BUILTIN_TYPES",

    "assignment": "PY_REF_SIMPLE_STATEMENTS",
    "augmented_assignment": "PY_REF_SIMPLE_STATEMENTS",
    "assert_statement": "PY_REF_SIMPLE_STATEMENTS",
    "return_statement": "PY_REF_SIMPLE_STATEMENTS",
    "raise_statement": "PY_REF_SIMPLE_STATEMENTS",
    "import_statement": "PY_REF_SIMPLE_STATEMENTS",
    "from_import_statement": "PY_REF_SIMPLE_STATEMENTS",
    "global_statement": "PY_REF_SIMPLE_STATEMENTS",
    "continue_statement": "PY_REF_SIMPLE_STATEMENTS",
    "break_statement": "PY_REF_SIMPLE_STATEMENTS",
    "pass_statement": "PY_REF_SIMPLE_STATEMENTS",
    "type_annotation": "PY_REF_SIMPLE_STATEMENTS",

    "if_statement": "PY_REF_COMPOUND_STATEMENTS",
    "elif_clause": "PY_REF_COMPOUND_STATEMENTS",
    "else_clause": "PY_REF_COMPOUND_STATEMENTS",
    "for_statement": "PY_REF_COMPOUND_STATEMENTS",
    "while_statement": "PY_REF_COMPOUND_STATEMENTS",
    "try_statement": "PY_REF_COMPOUND_STATEMENTS",
    "except_clause": "PY_REF_COMPOUND_STATEMENTS",
    "try_else_clause": "PY_REF_COMPOUND_STATEMENTS",
    "finally_clause": "PY_REF_COMPOUND_STATEMENTS",
    "with_statement": "PY_REF_COMPOUND_STATEMENTS",
    "async_with_statement": "PY_REF_COMPOUND_STATEMENTS",
    "function_definition": "PY_REF_COMPOUND_STATEMENTS",
    "async_function_definition": "PY_REF_COMPOUND_STATEMENTS",
    "class_definition": "PY_REF_COMPOUND_STATEMENTS",
    "decorator": "PY_REF_COMPOUND_STATEMENTS",
    "parameter_definition": "PY_REF_COMPOUND_STATEMENTS",

    "comment": "PY_REF_LEXICAL_ANALYSIS",
    "f_string": "PY_REF_LEXICAL_ANALYSIS",
    "argument_passing": "PY_REF_EXPRESSIONS",
}

BUILTIN_CALLS = {
    "abs","all","any","bool","dict","enumerate","float","input","int","len","list","max","min",
    "open","print","range","reversed","round","set","sorted","str","sum","tuple","type","zip",
}
BUILTIN_TYPE_METHODS = {
    "append","clear","copy","count","endswith","extend","find","get","index","insert","items",
    "join","keys","lower","pop","remove","replace","reverse","sort","split","startswith","strip",
    "upper","values",
}

STDLIB_MODULES = {
    "argparse","asyncio","collections","contextlib","csv","dataclasses","datetime","hashlib","io",
    "json","logging","os","pathlib","re","shutil","sqlite3","stat","subprocess","sys","tempfile",
    "threading","urllib","venv","zipfile",
}

THIRD_PARTY_URLS = {
    "pandas": "https://pandas.pydata.org/docs/",
    "numpy": "https://numpy.org/doc/stable/",
    "fastapi": "https://fastapi.tiangolo.com/",
    "pydantic": "https://docs.pydantic.dev/latest/",
    "requests": "https://requests.readthedocs.io/",
    "torch": "https://docs.pytorch.org/docs/stable/",
    "sklearn": "https://scikit-learn.org/stable/",
    "peft": "https://huggingface.co/docs/peft/",
    "transformers": "https://huggingface.co/docs/transformers/",
    "PIL": "https://pillow.readthedocs.io/",
    "cv2": "https://docs.opencv.org/",
    "pytesseract": "https://github.com/madmaze/pytesseract",
    "fitz": "https://pymupdf.readthedocs.io/",
    "pdfplumber": "https://github.com/jsvine/pdfplumber",
    "gradio": "https://www.gradio.app/docs",
    "streamlit": "https://docs.streamlit.io/",
    "uvicorn": "https://www.uvicorn.org/",
}

DOMAIN_REVIEW_EXEMPT = {
    "python_core","data_structures","functions_and_oop","files_paths_serialization",
    "modules_packages_environment",
}

def load_cards():
    rows=[]
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload=json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(payload,list):
            continue
        for card in payload:
            if isinstance(card,dict) and card.get("id"):
                row=dict(card)
                row["_file"]=path.name
                rows.append(row)
    return rows

def parse_code(code):
    try:
        return ast.parse(str(code or ""))
    except SyntaxError:
        return None

def imports_with_aliases(tree):
    aliases={}
    if tree is None:
        return aliases
    for node in ast.walk(tree):
        if isinstance(node,ast.Import):
            for alias in node.names:
                root=alias.name.split(".")[0]
                aliases[alias.asname or root]=root
        elif isinstance(node,ast.ImportFrom) and node.module:
            root=node.module.split(".")[0]
            for alias in node.names:
                aliases[alias.asname or alias.name]=root
    return aliases

def local_callable_names(tree):
    if tree is None:
        return set()
    return {
        node.name
        for node in ast.walk(tree)
        if isinstance(node,(ast.FunctionDef,ast.AsyncFunctionDef))
    }

def call_nodes(text):
    try:
        tree=ast.parse(str(text or ""),mode="eval")
    except SyntaxError:
        try:
            tree=ast.parse(str(text or ""))
        except SyntaxError:
            if str(text or "").rstrip().endswith(":"):
                try:
                    tree=ast.parse(str(text).rstrip()+"\n    pass")
                except SyntaxError:
                    return []
            else:
                return []
    return [node for node in ast.walk(tree) if isinstance(node,ast.Call)]

def call_leaf(node):
    fn=node.func
    if isinstance(fn,ast.Name):
        return fn.id
    if isinstance(fn,ast.Attribute):
        return fn.attr
    return ""

def call_root(node):
    fn=node.func
    while isinstance(fn,ast.Attribute):
        fn=fn.value
    return fn.id if isinstance(fn,ast.Name) else ""

def supplemental_bundles(card):
    code=str(card.get("code",""))
    focus=str(card.get("focus_span",""))
    tree=parse_code(code)
    aliases=imports_with_aliases(tree)
    local_names=local_callable_names(tree)
    calls=call_nodes(focus)
    if not calls:
        calls=[node for node in ast.walk(tree) if isinstance(node,ast.Call)] if tree is not None else []

    bundles=set()
    focus_leaves={call_leaf(node) for node in calls if call_leaf(node)}

    if focus_leaves & local_names:
        bundles.add("LOCAL_CODE_AUTHORITY")

    for node in calls:
        root=call_root(node)
        resolved=aliases.get(root,root)
        if resolved in STDLIB_MODULES:
            bundles.add("PY_STDLIB_"+resolved.upper())
        if resolved in THIRD_PARTY_URLS:
            bundles.add("THIRD_PARTY_"+resolved.upper())

    if focus_leaves & BUILTIN_CALLS:
        bundles.add("PY_BUILTIN_FUNCTIONS")
    if focus_leaves & BUILTIN_TYPE_METHODS:
        bundles.add("PY_BUILTIN_TYPES")

    imports=set(aliases.values())
    for module in sorted(imports & STDLIB_MODULES):
        bundles.add("PY_STDLIB_"+module.upper())
    for package in sorted(imports & set(THIRD_PARTY_URLS)):
        bundles.add("THIRD_PARTY_"+package.upper())

    domain=str(card.get("coverage_domain",""))
    if domain and domain not in DOMAIN_REVIEW_EXEMPT:
        bundles.add("DOMAIN_CONTEXT_REVIEW")

    return sorted(bundles)

def main():
    ap=argparse.ArgumentParser(description="Stdout-only source bundle mapping R1.")
    ap.add_argument("--limit",type=int,default=120)
    args=ap.parse_args()

    cards=load_cards()
    ids=[str(card["id"]) for card in cards]
    primary_counts=Counter()
    supplemental_counts=Counter()
    unresolved=[]
    rows=[]

    observed_primary=Counter(str(card.get("primary_concept","")) for card in cards)

    for card in cards:
        primary=str(card.get("primary_concept",""))
        primary_bundle=PRIMARY_BUNDLES.get(primary)
        supplemental=supplemental_bundles(card)

        if primary_bundle:
            primary_counts[primary_bundle]+=1
        else:
            unresolved.append(str(card["id"]))

        supplemental_counts.update(supplemental)
        rows.append((
            str(card["id"]),
            card.get("level"),
            primary,
            primary_bundle or "SOURCE_GAP",
            supplemental,
            card.get("_file",""),
            str(card.get("title","")),
        ))

    print("SOURCE_BUNDLE_MAPPING_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"UNIQUE_ID_COUNT={len(set(ids))}")
    print(f"DUPLICATE_ID_COUNT={len(ids)-len(set(ids))}")
    print(f"PRIMARY_CONCEPT_COUNT={len(observed_primary)}")
    print("PRIMARY_CONCEPT_COUNTS="+json.dumps(dict(sorted(observed_primary.items())),ensure_ascii=False,sort_keys=True))
    print("PRIMARY_BUNDLE_COUNTS="+json.dumps(dict(sorted(primary_counts.items())),ensure_ascii=False,sort_keys=True))
    print("SUPPLEMENTAL_BUNDLE_COUNTS="+json.dumps(dict(sorted(supplemental_counts.items())),ensure_ascii=False,sort_keys=True))
    print(f"SOURCE_GAP_COUNT={len(unresolved)}")
    for bundle,url in sorted(BUNDLE_URLS.items()):
        print(f"BUNDLE_URL\t{bundle}\t{url}")
    for package,url in sorted(THIRD_PARTY_URLS.items()):
        print(f"BUNDLE_URL\tTHIRD_PARTY_{package.upper()}\t{url}")
    for module in sorted(STDLIB_MODULES):
        print(f"BUNDLE_URL\tPY_STDLIB_{module.upper()}\thttps://docs.python.org/3.10/library/{module}.html")

    review_rows=[
        row for row in rows
        if row[3]=="SOURCE_GAP" or "DOMAIN_CONTEXT_REVIEW" in row[4] or any(x.startswith("THIRD_PARTY_") for x in row[4])
    ]
    print(f"REVIEW_ROW_COUNT={len(review_rows)}")
    for cid,level,primary,primary_bundle,supplemental,filename,title in review_rows[:max(0,args.limit)]:
        print(
            f"MAP\tL{level}\t{cid}\t{primary}\t{primary_bundle}\t"
            f"{'+'.join(supplemental) if supplemental else '-'}\t{filename}\t{title}"
        )

    if len(cards)!=1785:
        raise SystemExit(f"SOURCE_BUNDLE_MAPPING_R1=FAIL_CARD_COUNT_{len(cards)}")
    if len(ids)!=len(set(ids)):
        raise SystemExit("SOURCE_BUNDLE_MAPPING_R1=FAIL_DUPLICATE_IDS")
    if unresolved:
        raise SystemExit("SOURCE_BUNDLE_MAPPING_R1=FAIL_SOURCE_GAP")

    print("SOURCE_BUNDLE_MAPPING_R1=PASS_ALL_PRIMARY_CONCEPTS_MAPPED")

if __name__=="__main__":
    main()
