#!/usr/bin/env python3
from __future__ import annotations

import argparse, ast, json, re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data" / "lessons"

LANGUAGE_PRIMARY = {
    "assignment","argument_passing","arithmetic","assert_statement","async_function_definition",
    "async_with_statement","attribute_access","augmented_assignment","await_expression",
    "boolean_operation","break_statement","call","class_definition","comment","comparison",
    "conditional_expression","continue_statement","decorator","dict_comprehension","elif_clause",
    "else_clause","except_clause","finally_clause","for_statement","from_import_statement",
    "function_definition","generator_expression","global_statement","identity_test","if_statement",
    "import_statement","lambda_expression","list_comprehension","literal","match_statement",
    "matrix_multiplication","membership_test","name_reference","parameter_definition",
    "pass_statement","raise_statement","return_statement","sequence_operation","set_comprehension",
    "slice","star_unpacking","subscription","try_else_clause","try_statement","type_annotation",
    "unary_operation","while_statement","with_statement","yield_expression",
}

STDLIB_ROOTS = {
    "argparse","asyncio","collections","contextlib","csv","dataclasses","datetime","hashlib","io",
    "json","logging","os","pathlib","re","shutil","sqlite3","stat","subprocess","sys","tempfile",
    "threading","urllib","venv","zipfile",
}
THIRD_PARTY_ROOTS = {
    "fastapi","gradio","numpy","pandas","peft","pydantic","requests","sklearn","streamlit",
    "torch","transformers","uvicorn","cv2","pytesseract","fitz","pdfplumber","PIL",
}

SEMANTIC_CALL_LEAFS = {
    "abs","all","any","bool","dict","enumerate","float","input","int","len","list","max","min",
    "open","range","reversed","round","set","sorted","str","sum","tuple","type","zip",
    "append","extend","get","insert","items","join","keys","lower","pop","remove","replace",
    "sort","split","startswith","strip","upper","values",
}

AST_PRIMARY = {
    "assignment": (ast.Assign, ast.AnnAssign),
    "augmented_assignment": (ast.AugAssign,),
    "assert_statement": (ast.Assert,),
    "await_expression": (ast.Await,),
    "break_statement": (ast.Break,),
    "call": (ast.Call,),
    "class_definition": (ast.ClassDef,),
    "conditional_expression": (ast.IfExp,),
    "continue_statement": (ast.Continue,),
    "dict_comprehension": (ast.DictComp,),
    "for_statement": (ast.For, ast.AsyncFor),
    "function_definition": (ast.FunctionDef,),
    "async_function_definition": (ast.AsyncFunctionDef,),
    "generator_expression": (ast.GeneratorExp,),
    "if_statement": (ast.If,),
    "lambda_expression": (ast.Lambda,),
    "list_comprehension": (ast.ListComp,),
    "raise_statement": (ast.Raise,),
    "return_statement": (ast.Return,),
    "set_comprehension": (ast.SetComp,),
    "try_statement": (ast.Try,),
    "while_statement": (ast.While,),
    "with_statement": (ast.With,),
    "async_with_statement": (ast.AsyncWith,),
    "yield_expression": (ast.Yield, ast.YieldFrom),
    "unary_operation": (ast.UnaryOp,),
}

TECHNICAL_TERMS = re.compile(
    r"\b(?:parameter|argument|iterable|iterator|expression|statement|method|attribute|instance|"
    r"object|class|binding|keyword|positional|context manager|generator|comprehension|exception|"
    r"schema|vector|embedding)\b", re.I
)
EASY_BRIDGE_TERMS = re.compile(
    r"(쉽게|말하면|처럼|기능|역할|뜻|의미|먼저|하나씩|골라|묶|꺼내|보여|돌려|저장|연결|반복|선택|확인|만들|easy meaning|in simple terms|put simply)",
    re.I
)

def load_cards():
    rows=[]
    for path in sorted(LESSON_DIR.glob("*.json")):
        data=json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(data,list):
            continue
        for idx,card in enumerate(data):
            if isinstance(card,dict) and card.get("id"):
                row=dict(card); row["_file"]=path.name; row["_index"]=idx; rows.append(row)
    return rows

def parse_code(code):
    try: return ast.parse(code or "")
    except SyntaxError: return None

def imported_roots(tree):
    out=set()
    if tree is None: return out
    for node in ast.walk(tree):
        if isinstance(node,ast.Import):
            out.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node,ast.ImportFrom) and node.module:
            out.add(node.module.split(".")[0])
    return out

def local_callable_names(tree):
    if tree is None: return set()
    return {
        node.name
        for node in ast.walk(tree)
        if isinstance(node,(ast.FunctionDef,ast.AsyncFunctionDef,ast.ClassDef))
    }

def call_leafs(text):
    try: tree=ast.parse(text,mode="eval")
    except SyntaxError:
        try: tree=ast.parse(text)
        except SyntaxError:
            if text.rstrip().endswith(":"):
                try: tree=ast.parse(text.rstrip()+"\n    pass")
                except SyntaxError: return []
            else: return []
    out=set()
    for node in ast.walk(tree):
        if isinstance(node,ast.Call):
            if isinstance(node.func,ast.Name): out.add(node.func.id)
            elif isinstance(node.func,ast.Attribute): out.add(node.func.attr)
    return sorted(out)

def meaningful_code_lines(code):
    return [
        line for line in str(code or "").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

def specific_target_call_required(card, focus_calls):
    if not focus_calls:
        return set()
    primary=str(card.get("primary_concept",""))
    if primary not in {"call","argument_passing"}:
        return set()

    authority=authority_class(card)
    if authority=="LOCAL_CODE_AUTHORITY":
        return set()

    blob=" ".join(
        [str(card.get("title","")), str(card.get("reading_goal",""))] +
        [str(x) for x in (card.get("coverage_topics",[]) or [])]
    ).lower()
    topics={str(x).lower() for x in (card.get("coverage_topics",[]) or [])}
    required=set()

    for leaf in focus_calls:
        low=leaf.lower()
        named=low+"(" in blob or low+"()" in blob or low in topics
        if not named:
            continue
        if low in SEMANTIC_CALL_LEAFS:
            required.add(leaf)
        elif authority in {"STDLIB_API_AUTHORITY","THIRD_PARTY_API_AUTHORITY","DOMAIN_AUTHORITY_REVIEW"}:
            required.add(leaf)

    return required

def has_primary_syntax(primary, teaching_code):
    tree=parse_code(teaching_code)
    if tree is None: return False
    classes=AST_PRIMARY.get(primary)
    if classes and any(isinstance(node,classes) for node in ast.walk(tree)): return True
    if primary=="subscription":
        return any(isinstance(n,ast.Subscript) and not isinstance(n.slice,ast.Slice) for n in ast.walk(tree))
    if primary=="slice":
        return any(isinstance(n,ast.Subscript) and isinstance(n.slice,ast.Slice) for n in ast.walk(tree))
    if primary=="comparison": return any(isinstance(n,ast.Compare) for n in ast.walk(tree))
    if primary=="boolean_operation":
        return any(
            isinstance(n,ast.BoolOp)
            or (isinstance(n,ast.UnaryOp) and isinstance(n.op,ast.Not))
            for n in ast.walk(tree)
        )
    if primary=="membership_test":
        return any(isinstance(n,ast.Compare) and any(isinstance(op,(ast.In,ast.NotIn)) for op in n.ops) for n in ast.walk(tree))
    if primary=="identity_test":
        return any(isinstance(n,ast.Compare) and any(isinstance(op,(ast.Is,ast.IsNot)) for op in n.ops) for n in ast.walk(tree))
    if primary=="import_statement": return any(isinstance(n,ast.Import) for n in ast.walk(tree))
    if primary=="from_import_statement": return any(isinstance(n,ast.ImportFrom) for n in ast.walk(tree))
    if primary=="literal":
        return any(
            isinstance(n,(ast.Constant,ast.List,ast.Tuple,ast.Set,ast.Dict))
            for n in ast.walk(tree)
        )
    if primary=="attribute_access": return any(isinstance(n,ast.Attribute) for n in ast.walk(tree))
    if primary=="name_reference": return any(isinstance(n,ast.Name) for n in ast.walk(tree))
    if primary=="arithmetic": return any(isinstance(n,ast.BinOp) for n in ast.walk(tree))
    return True

def authority_class(card):
    code=str(card.get("code","")); focus=str(card.get("focus_span",""))
    primary=str(card.get("primary_concept","")); domain=str(card.get("coverage_domain",""))
    tree=parse_code(code); imports=imported_roots(tree); focus_calls=set(call_leafs(focus))
    if focus_calls & local_callable_names(tree): return "LOCAL_CODE_AUTHORITY"
    if imports & THIRD_PARTY_ROOTS: return "THIRD_PARTY_API_AUTHORITY"
    if imports & STDLIB_ROOTS: return "STDLIB_API_AUTHORITY"
    if domain not in {"","python_core","data_structures","functions_and_oop"} and ("." in focus or focus_calls):
        return "DOMAIN_AUTHORITY_REVIEW"
    if primary in LANGUAGE_PRIMARY: return "PYTHON_LANGUAGE_AUTHORITY"
    return "AUTHORITY_REVIEW"

def quality_reasons(card):
    reasons=[]
    concept=card.get("concept_explanation") if isinstance(card.get("concept_explanation"),dict) else {}
    teaching=card.get("teaching_example") if isinstance(card.get("teaching_example"),dict) else {}
    answer=card.get("answer_explanation") if isinstance(card.get("answer_explanation"),dict) else {}
    what=str(concept.get("what_it_is","")).strip()
    how=str(concept.get("how_to_read","")).strip()
    key=str(concept.get("key_point","")).strip()
    confusion=str(concept.get("common_mistake","")).strip()
    teach_code=str(teaching.get("code","")).strip()
    walkthrough=str(teaching.get("walkthrough","")).strip()
    step=str(answer.get("step_by_step","")).strip()
    why=str(answer.get("why_correct","")).strip()
    takeaway=str(answer.get("takeaway","")).strip()
    wrong=answer.get("common_wrong_choice") if isinstance(answer.get("common_wrong_choice"),dict) else {}

    if not what: reasons.append("MISSING_CONCEPT_EXPLANATION")
    else:
        if len(what)<35: reasons.append("EASY_OR_DEFINITION_THIN")
        if TECHNICAL_TERMS.search(what) and not EASY_BRIDGE_TERMS.search(what):
            reasons.append("EASY_BRIDGE_REVIEW")
    if not how or len(how)<35: reasons.append("MENTAL_MODEL_OR_READ_GUIDE_THIN")
    if not key: reasons.append("MISSING_KEY_POINT")
    if not confusion: reasons.append("MISSING_CONFUSION")

    if not teach_code:
        reasons.append("MISSING_TEACHING_EXAMPLE")
    else:
        primary=str(card.get("primary_concept",""))
        focus_calls=set(call_leafs(str(card.get("focus_span",""))))
        teach_calls=set(call_leafs(teach_code))
        required_calls=specific_target_call_required(card,focus_calls)
        if required_calls and not (required_calls & teach_calls):
            reasons.append("TEACHING_EXAMPLE_TARGET_CALL_MISMATCH")
        elif not has_primary_syntax(primary,teach_code):
            reasons.append("TEACHING_EXAMPLE_PRIMARY_SYNTAX_MISMATCH")

    teach_line_count=len(meaningful_code_lines(teach_code))
    card_line_count=len(meaningful_code_lines(str(card.get("code",""))))
    if not walkthrough:
        reasons.append("WALKTHROUGH_THIN")
    elif teach_line_count>=4 and len(walkthrough)<55:
        reasons.append("WALKTHROUGH_THIN")

    if not step:
        reasons.append("ANSWER_TRACE_THIN")
    elif card_line_count>=7 and len(step)<90:
        reasons.append("ANSWER_TRACE_THIN")
    elif card_line_count>=4 and len(step)<60:
        reasons.append("ANSWER_TRACE_THIN")

    if not why or len(why)<18: reasons.append("WHY_CORRECT_THIN")
    if not str(wrong.get("choice","")).strip() or not str(wrong.get("why_wrong","")).strip():
        reasons.append("WRONG_CHOICE_REASONING_THIN")
    if not takeaway or len(takeaway)<25: reasons.append("TAKEAWAY_THIN")
    return reasons

def disposition(reasons,authority):
    if any(r.startswith("TEACHING_EXAMPLE_") for r in reasons): return "EXAMPLE_REWRITE"
    if any(r in {"ANSWER_TRACE_THIN","WHY_CORRECT_THIN","WRONG_CHOICE_REASONING_THIN"} for r in reasons):
        return "WALKTHROUGH_OR_ANSWER_REWRITE"
    if any(r in {"MISSING_CONCEPT_EXPLANATION","EASY_OR_DEFINITION_THIN","EASY_BRIDGE_REVIEW","MENTAL_MODEL_OR_READ_GUIDE_THIN"} for r in reasons):
        return "CONCEPT_EXPLANATION_REWRITE"
    if authority in {"THIRD_PARTY_API_AUTHORITY","STDLIB_API_AUTHORITY","DOMAIN_AUTHORITY_REVIEW","AUTHORITY_REVIEW"}:
        return "SOURCE_MAPPING_REVIEW"
    return "KEEP_CANDIDATE"

def main():
    ap=argparse.ArgumentParser(description="Stdout-only V1 explanation readiness audit.")
    ap.add_argument("--limit",type=int,default=120)
    args=ap.parse_args()
    cards=load_cards(); ids=[str(c["id"]) for c in cards]
    authority_counts=Counter(); disposition_counts=Counter(); reason_counts=Counter(); rows=[]
    for card in cards:
        authority=authority_class(card); reasons=quality_reasons(card); disp=disposition(reasons,authority)
        authority_counts[authority]+=1; disposition_counts[disp]+=1; reason_counts.update(reasons)
        if disp!="KEEP_CANDIDATE":
            rows.append((disp,int(card.get("level") or 999),str(card["id"]),authority,reasons,card["_file"],str(card.get("title",""))))
    order={"EXAMPLE_REWRITE":0,"WALKTHROUGH_OR_ANSWER_REWRITE":1,"CONCEPT_EXPLANATION_REWRITE":2,"SOURCE_MAPPING_REVIEW":3}
    rows.sort(key=lambda r:(order.get(r[0],9),r[1],r[2]))
    print("EXPLANATION_READINESS_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"UNIQUE_ID_COUNT={len(set(ids))}")
    print(f"DUPLICATE_ID_COUNT={len(ids)-len(set(ids))}")
    print("AUTHORITY_COUNTS="+json.dumps(dict(sorted(authority_counts.items())),ensure_ascii=False,sort_keys=True))
    print("DISPOSITION_COUNTS="+json.dumps(dict(sorted(disposition_counts.items())),ensure_ascii=False,sort_keys=True))
    print("REASON_COUNTS="+json.dumps(dict(sorted(reason_counts.items())),ensure_ascii=False,sort_keys=True))
    print(f"REVIEW_ROW_COUNT={len(rows)}")
    for disp,level,cid,authority,reasons,filename,title in rows[:max(0,args.limit)]:
        print(f"REVIEW\t{disp}\tL{level}\t{cid}\t{authority}\t{'+'.join(reasons) if reasons else '-'}\t{filename}\t{title}")
    if len(cards)!=1785: raise SystemExit(f"EXPLANATION_READINESS_R1=FAIL_CARD_COUNT_{len(cards)}")
    if len(ids)!=len(set(ids)): raise SystemExit("EXPLANATION_READINESS_R1=FAIL_DUPLICATE_IDS")
    print("EXPLANATION_READINESS_R1=PASS_INVENTORY_CANDIDATES_REPORTED")

if __name__=="__main__":
    main()
