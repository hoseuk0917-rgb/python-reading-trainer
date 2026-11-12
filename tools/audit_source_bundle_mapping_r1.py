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
    "PY_BUILTIN_EXCEPTIONS": "https://docs.python.org/3.10/library/exceptions.html",
    "PY_TUTORIAL_CONTROL_FLOW": "https://docs.python.org/3.10/tutorial/controlflow.html",
    "PY_TUTORIAL_DATA_STRUCTURES": "https://docs.python.org/3.10/tutorial/datastructures.html",
    "THIRD_PARTY_PANDAS_READ_CSV": "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html",
    "DOMAIN_FASTAPI_PATH_OPERATION": "https://fastapi.tiangolo.com/tutorial/first-steps/",
    "DOMAIN_FASTAPI_REQUEST_BODY": "https://fastapi.tiangolo.com/tutorial/body/",
    "DOMAIN_GITHUB_IGNORE_FILES": "https://docs.github.com/en/get-started/git-basics/ignoring-files",
    "DOMAIN_GITHUB_PAGES": "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages",
    "DOMAIN_GITHUB_SENSITIVE_DATA": "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository",
    "DOMAIN_GIT_STATUS": "https://git-scm.com/docs/git-status",
    "DOMAIN_MDN_FAVICON": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel",
    "DOMAIN_MDN_HTTP_200": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200",
    "DOMAIN_MDN_HTTP_404": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404",
    "DOMAIN_MDN_HTTP_429": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429",
    "DOMAIN_MDN_SERVICE_WORKER_WAITING": "https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/waiting",
    "DOMAIN_OWASP_SECRETS": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet",
    "DOMAIN_PYPA_REQUIREMENTS": "https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/",
    "DOMAIN_PYTHON_VENV": "https://docs.python.org/3.10/library/venv.html",
    "DOMAIN_PYTORCH_CUDA": "https://docs.pytorch.org/docs/stable/notes/cuda.html",
    "DOMAIN_PYTORCH_MODULE": "https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html",
    "DOMAIN_REQUESTS_QUICKSTART": "https://requests.readthedocs.io/en/latest/user/quickstart/",
    "DOMAIN_TQDM_ITERABLE": "https://tqdm.github.io/docs/tqdm/",
    "DOMAIN_UBUNTU_DOCS": "https://help.ubuntu.com/",
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
    "match_statement": "PY_REF_COMPOUND_STATEMENTS",

    "comment": "PY_REF_LEXICAL_ANALYSIS",
    "f_string": "PY_REF_LEXICAL_ANALYSIS",
    "argument_passing": "PY_REF_EXPRESSIONS",
}

BUILTIN_CALLS = {
    "abs","all","any","bool","dict","enumerate","float","input","int","len","list","max","min",
    "open","print","range","reversed","round","set","sorted","str","sum","tuple","type","zip",
}
BUILTIN_TYPE_METHODS = {
    "add","append","casefold","clear","copy","count","decode","encode","endswith","extend",
    "find","format","get","index","insert","isdisjoint","items","join","keys","lower","pop",
    "remove","replace","reverse","rsplit","setdefault","sort","split","splitlines","startswith",
    "strip","union","upper","values",
}

BUILTIN_EXCEPTION_CALLS = {
    "FileNotFoundError","KeyError","ModuleNotFoundError","RuntimeError","SystemExit","ValueError",
}

FOCUS_METHOD_BUNDLES = {
    "readline": "PY_STDLIB_IO",
    "readlines": "PY_STDLIB_IO",
    "write": "PY_STDLIB_IO",
}

STDLIB_MODULES = {
    "argparse","asyncio","collections","contextlib","csv","dataclasses","datetime","hashlib","io",
    "itertools","json","logging","os","pathlib","re","shutil","sqlite3","stat","statistics",
    "subprocess","sys","tempfile","threading","types","urllib","venv","zipfile",
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
    "tqdm": "https://tqdm.github.io/docs/tqdm/",
}

CARD_SOURCE_BUNDLES = {
    "PY42_L07_read_csv_sep_001": ("THIRD_PARTY_PANDAS_READ_CSV",),
    "PY103_L06_shell_kind_001": ("DOMAIN_PYTHON_VENV",),
    "PY103_L06_ubuntu_linux_role_001": ("DOMAIN_UBUNTU_DOCS",),
    "PY103_L09_dotenv_gitignore_001": ("DOMAIN_GITHUB_IGNORE_FILES", "DOMAIN_GITHUB_SENSITIVE_DATA"),
    "PY107_A1_ENV_004_REQUIREMENTS": ("DOMAIN_PYPA_REQUIREMENTS",),
    "PY113_L04_UBUNTU_WSL_001": ("DOMAIN_PYTHON_VENV",),
    "PY113_L04_VENV_ACTIVATE_001": ("DOMAIN_PYTHON_VENV",),
    "PY11_L08_requests_status_001": ("DOMAIN_MDN_HTTP_200",),
    "PY11_L09_tqdm_progress_001": ("DOMAIN_TQDM_ITERABLE",),
    "PY121_L06_SAFE_API_FLOW_001": ("DOMAIN_REQUESTS_QUICKSTART",),
    "PY12_L08_model_eval_001": ("DOMAIN_PYTORCH_MODULE",),
    "PY12_L08_model_to_device_001": ("DOMAIN_PYTORCH_MODULE",),
    "PY17_L09_git_status_001": ("DOMAIN_GIT_STATUS",),
    "PY22_L10_encrypted_secret_storage_001": ("DOMAIN_OWASP_SECRETS",),
    "PY22_L10_rate_limit_001": ("DOMAIN_MDN_HTTP_429",),
    "PY23_L07_github_pages_url_001": ("DOMAIN_GITHUB_PAGES",),
    "PY25_L09_health_check_001": ("DOMAIN_FASTAPI_PATH_OPERATION",),
    "PY26_L10_gpu_batch_size_001": ("DOMAIN_PYTORCH_CUDA",),
    "PY28_L09_http_404_001": ("DOMAIN_MDN_HTTP_404",),
    "PY2_L07_status_code_001": ("DOMAIN_MDN_HTTP_200",),
    "PY45_L09_favicon_404_ignore_001": ("DOMAIN_MDN_FAVICON", "DOMAIN_MDN_HTTP_404"),
    "PY51_L09_service_worker_waiting_001": ("DOMAIN_MDN_SERVICE_WORKER_WAITING",),
    "PY5_L09_fastapi_post_body_001": ("DOMAIN_FASTAPI_REQUEST_BODY",),
    "PY6_L06_gitignore_001": ("DOMAIN_GITHUB_IGNORE_FILES", "DOMAIN_GITHUB_SENSITIVE_DATA"),
    "PY6_L06_requirements_001": ("DOMAIN_PYPA_REQUIREMENTS",),
    "PY9_REVIEW_FASTAPI_001": ("DOMAIN_FASTAPI_PATH_OPERATION",),
}

# Frozen manual resolution of the post-rewrite 93-card domain provenance queue.
# Every ID is verified by tools/verify_source_mapping_resolution_r1.py against
# learner-facing claim content so later text drift cannot silently inherit this resolution.
SOURCE_MAPPING_RESOLVED_IDS = frozenset({
    "PY103_L06_shell_kind_001",
    "PY103_L06_ubuntu_linux_role_001",
    "PY103_L09_dotenv_gitignore_001",
    "PY107_A1_ENV_004_REQUIREMENTS",
    "PY10_L08_pipeline_steps_001",
    "PY113_L04_UBUNTU_WSL_001",
    "PY113_L04_VENV_ACTIVATE_001",
    "PY114_L05_INIT_PY_001",
    "PY11_L08_requests_status_001",
    "PY11_L09_tqdm_progress_001",
    "PY121_L06_SAFE_API_FLOW_001",
    "PY122_L05_COLUMNS_CHECK_001",
    "PY125_L05_DEFAULT_VALUE_001",
    "PY128_L06_SAFE_LOAD_DATA_FLOW_001",
    "PY12_L08_cv2_threshold_001",
    "PY12_L08_fastapi_cors_001",
    "PY12_L08_model_eval_001",
    "PY12_L08_model_to_device_001",
    "PY12_L08_no_grad_001",
    "PY130_L05_GITIGNORE_ENV_001",
    "PY131_L05_PIP_INSTALL_REQUIREMENTS_001",
    "PY131_L05_PYTHON_M_PIP_REASON_001",
    "PY131_L05_REQUIREMENTS_TXT_ROLE_001",
    "PY132_L05_PREREQUISITES_001",
    "PY132_L05_RUN_COMMAND_001",
    "PY13_L08_data_transfer_001",
    "PY14_L08_epoch_batch_lr_001",
    "PY14_L09_freeze_layers_001",
    "PY17_L09_git_status_001",
    "PY18_L07_init_py_001",
    "PY18_L07_relative_import_001",
    "PY18_L08_config_settings_001",
    "PY18_L10_cli_entrypoint_001",
    "PY18_L10_src_vs_scripts_001",
    "PY20_L10_api_service_repository_001",
    "PY21_L10_repository_pattern_001",
    "PY21_L10_supabase_select_001",
    "PY22_L07_gitignore_env_001",
    "PY22_L10_encrypted_secret_storage_001",
    "PY22_L10_oauth_callback_001",
    "PY22_L10_rate_limit_001",
    "PY23_L07_github_pages_url_001",
    "PY25_L09_health_check_001",
    "PY25_L10_alert_condition_001",
    "PY25_L10_cost_quota_monitor_001",
    "PY26_L07_async_await_basic_001",
    "PY26_L10_gpu_batch_size_001",
    "PY28_L09_http_404_001",
    "PY28_L10_reproduce_command_001",
    "PY2_L07_status_code_001",
    "PY31_L10_repository_object_001",
    "PY31_L10_service_object_001",
    "PY31_L10_to_dict_001",
    "PY32_L10_config_location_001",
    "PY32_L10_git_ignore_outputs_001",
    "PY32_L10_output_folder_001",
    "PY33_L10_commit_scope_001",
    "PY35_L08_query_string_001",
    "PY36_L07_task_001",
    "PY39_L10_render_flow_001",
    "PY40_L10_small_commit_001",
    "PY41_L07_service_layer_001",
    "PY41_L08_adapter_001",
    "PY44_L09_cost_logging_001",
    "PY45_L09_favicon_404_ignore_001",
    "PY45_L10_atomic_commit_001",
    "PY46_L10_final_manifest_001",
    "PY48_L07_setup_python_action_001",
    "PY49_L07_forgetting_curve_001",
    "PY49_L08_difficulty_adjustment_001",
    "PY49_L08_mastery_score_001",
    "PY49_L10_learning_state_schema_001",
    "PY4_L10_edge_promotion_001",
    "PY51_L09_service_worker_waiting_001",
    "PY52_L08_reduced_motion_001",
    "PY54_L08_touch_feedback_001",
    "PY57_L09_license_unknown_001",
    "PY57_L09_source_tier_001",
    "PY58_L07_card_generator_001",
    "PY5_L09_fastapi_post_body_001",
    "PY60_L09_learning_metric_001",
    "PY61_L08_dirty_record_001",
    "PY62_L07_message_key_001",
    "PY63_L09_goal_adjustment_001",
    "PY6_L06_gitignore_001",
    "PY6_L06_requirements_001",
    "PY6_L07_import_path_001",
    "PY8_L05_cache_bust_query_001",
    "PY9_REVIEW_FASTAPI_001",
    "PY9_REVIEW_RAG_006",
    "PYF95_A4_FILE_002_READLINE_FIRST",
    "PY_L09_decorator_001",
    "PY_L10_pm_trace_001",
})

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

    bundles=set(CARD_SOURCE_BUNDLES.get(str(card.get("id","")), ()))
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
    if focus_leaves & BUILTIN_EXCEPTION_CALLS:
        bundles.add("PY_BUILTIN_EXCEPTIONS")
    for leaf in sorted(focus_leaves):
        bundle = FOCUS_METHOD_BUNDLES.get(leaf)
        if bundle:
            bundles.add(bundle)

    imports=set(aliases.values())
    for module in sorted(imports & STDLIB_MODULES):
        bundles.add("PY_STDLIB_"+module.upper())
    for package in sorted(imports & set(THIRD_PARTY_URLS)):
        bundles.add("THIRD_PARTY_"+package.upper())

    domain=str(card.get("coverage_domain",""))
    cid=str(card.get("id",""))
    if domain and domain not in DOMAIN_REVIEW_EXEMPT and cid not in SOURCE_MAPPING_RESOLVED_IDS:
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
