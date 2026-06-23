// === PROJECT ANALYZER V248-A1 START ===
// PROJECT_CONFIG_SEMANTICS_V326_A3 package.json requirements.txt README wrangler Dockerfile GitHub Actions pyproject.toml
(function() {
  const PROJECT_ANALYZER_VERSION = "20260619_v326_a3";
  const rootKey = "python-reading-trainer-project-root-v193";
  let lastCommand = "";
  let lastMermaid = "";
  let lastParsedReport = null;
  let lastHandoffText = "";

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function quotePowerShellSingle(value) {
    return "'" + String(value || "").replace(/'/g, "''") + "'";
  }

  function probePythonCode() {
    return [
"from pathlib import Path",
"from collections import Counter",
"import ast",
"import json",
"import re",
"import subprocess",
"import sys",
"from shutil import which",
"from datetime import datetime",
"",
"ROOT = Path('.').resolve()",
"OUT_DIR = ROOT / '.tmp'",
"OUT_JSON = OUT_DIR / 'project_probe_v199.json'",
"OUT_MD = OUT_DIR / 'project_probe_v199_report.md'",
"OUT_JSON_LATEST = OUT_DIR / 'project_probe_latest.json'",
"OUT_MD_LATEST = OUT_DIR / 'project_probe_latest_report.md'",
"SKIP_DIRS = {'.git', '.tmp', 'node_modules', '.venv', '.venv_lora_infer', '__pycache__', '.pytest_cache', 'dist', 'build', '.next'}",
"TEXT_EXTS = {'.js', '.css', '.html', '.json', '.py', '.ps1', '.md', '.toml', '.yml', '.yaml', '.txt', '.gitignore', '.env'}",
"KEY_FILES = ['index.html', 'src/pwa/index.html', 'src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js', 'src/pwa/style.css', 'tools/validate_lessons.py', 'tools/code_explainer_smoke_v171.js']",
"",
"def run(cmd):",
"    try:",
"        return subprocess.check_output(cmd, cwd=ROOT, shell=True, text=True, stderr=subprocess.STDOUT, encoding='utf-8', errors='replace').strip()",
"    except Exception as e:",
"        return 'ERROR: ' + str(e)",
"",
"# ENV_AUDIT_REPORT_V194_A1",
"def audit_environment():",
"    required_pip_packages = []",
"    return {",
"        'python_executable': sys.executable,",
"        'python_version': sys.version.split()[0],",
"        'git': run('git --version') if which('git') else 'missing_optional',",
"        'node': run('node --version') if which('node') else 'missing_optional',",
"        'pip': run('python -m pip --version') if which('python') else 'missing_optional',",
"        'required_pip_packages': required_pip_packages,",
"        'standard_library_only': len(required_pip_packages) == 0,",
"    }",
"",
"def rel(path):",
"    return str(path.relative_to(ROOT)).replace('\\\\', '/')",
"",
"def should_skip(path):",
"    return bool(set(path.parts) & SKIP_DIRS)",
"",
"def read_text(path, limit=350000):",
"    try:",
"        data = path.read_bytes()",
"        if len(data) > limit:",
"            data = data[:limit]",
"        return data.decode('utf-8-sig', errors='replace')",
"    except Exception:",
"        return ''",
"",
"def classify_file(path):",
"    r = rel(path)",
"    name = path.name.lower()",
"    ext = path.suffix.lower()",
"    if r in ['src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js']:",
"        return 'pwa_core_js'",
"    if r in ['src/pwa/index.html', 'index.html']:",
"        return 'html_entry'",
"    if r == 'src/pwa/style.css':",
"        return 'style'",
"    if r.startswith('data/lessons/') and ext == '.json':",
"        return 'lesson_data'",
"    if r.startswith('data/side_cards/') and ext == '.json':",
"        return 'side_card_data'",
"    if r.startswith('tools/') and ext == '.py':",
"        return 'python_tool'",
"    if r.startswith('tools/') and ext == '.ps1':",
"        return 'powershell_verify'",
"    if name == 'package.json':",
"        return 'package_config'",
"    if ext == '.md':",
"        return 'documentation'",
"    if ext in ['.yml', '.yaml']:",
"        return 'yaml_config'",
"    if ext == '.json':",
"        return 'json_config_or_data'",
"    return 'other'",
"",
"# PROJECT_PROBE_SNIPPETS_V239_A1",
"def line_no_from_offset(text, offset):",
"    return text.count('\\n', 0, max(0, offset)) + 1",
"",
"def make_line_snippet(text, line, radius=5, max_chars=1800):",
"    try:",
"        line = int(line or 0)",
"    except Exception:",
"        return ''",
"    if line <= 0:",
"        return ''",
"    rows = text.splitlines()",
"    if not rows:",
"        return ''",
"    start = max(1, line - radius)",
"    end = min(len(rows), line + radius)",
"    snippet = '\\n'.join(rows[start-1:end]).strip()",
"    return snippet[:max_chars]",
"",
"def make_ast_snippet(text, node, radius=2, max_chars=2200):",
"    rows = text.splitlines()",
"    start = getattr(node, 'lineno', None)",
"    end = getattr(node, 'end_lineno', None) or start",
"    if not start:",
"        return ''",
"    start = max(1, int(start) - radius)",
"    end = min(len(rows), int(end) + radius)",
"    snippet = '\\n'.join(rows[start-1:end]).strip()",
"    return snippet[:max_chars]",
"",
"def extract_js_symbols(text):",
"    symbols = []",
"    for m in re.finditer(r'\\bfunction\\s+([A-Za-z_$][\\w$]*)\\s*\\(', text):",
"        line = line_no_from_offset(text, m.start())",
"        symbols.append({'type': 'function', 'name': m.group(1), 'line': line, 'snippet': make_line_snippet(text, line)})",
"    for m in re.finditer(r'\\b(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*(?:async\\s*)?(?:function|\\([^)]*\\)\\s*=>|[A-Za-z_$][\\w$]*\\s*=>)', text):",
"        line = line_no_from_offset(text, m.start())",
"        symbols.append({'type': 'function_like', 'name': m.group(1), 'line': line, 'snippet': make_line_snippet(text, line)})",
"    for m in re.finditer(r'\\bclass\\s+([A-Za-z_$][\\w$]*)', text):",
"        line = line_no_from_offset(text, m.start())",
"        symbols.append({'type': 'class', 'name': m.group(1), 'line': line, 'snippet': make_line_snippet(text, line)})",
"    return symbols[:120]",
"",
"def extract_py_symbols(text):",
"    try:",
"        tree = ast.parse(text)",
"    except Exception:",
"        return []",
"    symbols = []",
"    for node in ast.walk(tree):",
"        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):",
"            symbols.append({'type': 'function', 'name': node.name, 'line': getattr(node, 'lineno', None), 'snippet': make_ast_snippet(text, node)})",
"        elif isinstance(node, ast.ClassDef):",
"            symbols.append({'type': 'class', 'name': node.name, 'line': getattr(node, 'lineno', None), 'snippet': make_ast_snippet(text, node)})",
"    return symbols[:120]",
"",
"# PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1",
"def extract_refs(text):",
"    refs = set()",
"    patterns = [",
"        r'src=[\\\"\\']([^\\\"\\']+)[\\\"\\']',",
"        r'href=[\\\"\\']([^\\\"\\']+)[\\\"\\']',",
"        r'fetch\\(\\s*[\\\"\\']([^\\\"\\']+)[\\\"\\']',",
"        r'import\\s+.*?from\\s+[\\\"\\']([^\\\"\\']+)[\\\"\\']',",
"        r'import\\s*\\(\\s*[\\\"\\']([^\\\"\\']+)[\\\"\\']\\s*\\)',",
"        r'require\\(\\s*[\\\"\\']([^\\\"\\']+)[\\\"\\']\\s*\\)',",
"        r'@import\\s+(?:url\\()?\\s*[\\\"\\']([^\\\"\\']+)[\\\"\\']',",
"    ]",
"    for pattern in patterns:",
"        for m in re.finditer(pattern, text):",
"            value = m.group(1).strip()",
"            if value and not value.startswith(('http://', 'https://', 'data:', '#')):",
"                refs.add(value)",
"    return sorted(refs)[:120]",
"",
"# CALL_CANDIDATES_V194_A1",
"def extract_js_calls(text):",
"    exclude = set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof', 'new', 'class', 'import', 'from', 'require', 'console', 'Math', 'JSON', 'String', 'Number', 'Boolean', 'Array', 'Object'])",
"    counts = Counter()",
"    first_line = {}",
"    for m in re.finditer(r'\\b([A-Za-z_$][\\w$]*)\\s*\\(', text):",
"        name = m.group(1)",
"        if name not in exclude:",
"            counts[name] += 1",
"            if name not in first_line:",
"                first_line[name] = line_no_from_offset(text, m.start())",
"    return [{'name': k, 'count': v, 'line': first_line.get(k), 'snippet': make_line_snippet(text, first_line.get(k))} for k, v in counts.most_common(30)]",
"",
"def extract_py_calls(text):",
"    try:",
"        tree = ast.parse(text)",
"    except Exception:",
"        return []",
"    counts = Counter()",
"    first_line = {}",
"    for node in ast.walk(tree):",
"        if isinstance(node, ast.Call):",
"            func = node.func",
"            name = None",
"            if isinstance(func, ast.Name):",
"                name = func.id",
"            elif isinstance(func, ast.Attribute):",
"                name = func.attr",
"            if name:",
"                counts[name] += 1",
"                if name not in first_line:",
"                    first_line[name] = getattr(node, 'lineno', None)",
"    return [{'name': k, 'count': v, 'line': first_line.get(k), 'snippet': make_line_snippet(text, first_line.get(k))} for k, v in counts.most_common(30)]",
"",
"# PROJECT_PROBE_FILES_BLOCK_RESTORE_V240_A1",
"files = []",
"for p in sorted(ROOT.rglob('*')):",
"    try:",
"        rel_path = rel(p)",
"    except Exception:",
"        continue",
"    try:",
"        parts = set(p.relative_to(ROOT).parts)",
"    except Exception:",
"        parts = set()",
"    if any(part in SKIP_DIRS for part in parts):",
"        continue",
"    if not p.is_file():",
"        continue",
"    ext = p.suffix.lower()",
"    role_func = globals().get('classify_role') or globals().get('classify_file_role') or globals().get('detect_role')",
"    role = None",
"    if role_func:",
"        try:",
"            role = role_func(p)",
"        except Exception:",
"            try:",
"                role = role_func(rel_path)",
"            except Exception:",
"                role = None",
"    if not role:",
"        if rel_path in KEY_FILES:",
"            role = 'key_file'",
"        elif rel_path.startswith('data/lessons/'):",
"            role = 'lesson_data'",
"        elif rel_path.startswith('data/side_cards/'):",
"            role = 'side_card_data'",
"        elif rel_path.startswith('src/pwa/'):",
"            role = 'pwa_app'",
"        elif rel_path.startswith('tools/'):",
"            role = 'tooling'",
"        elif ext == '.json':",
"            role = 'json_config_or_data'",
"        elif ext in ['.js', '.jsx', '.ts', '.tsx', '.py', '.ps1', '.html', '.css']:",
"            role = 'source_or_script'",
"        elif ext == '.md':",
"            role = 'documentation'",
"        else:",
"            role = 'other'",
"    files.append({'path': rel_path, 'size': p.stat().st_size, 'ext': ext, 'role': role})",
"",
"ext_counts = Counter(f['ext'] or '[none]' for f in files)",
"",
"role_counts = Counter(f['role'] for f in files)",
"top_dirs = Counter(f['path'].split('/')[0] for f in files)",
"",
"key_status = {}",
"for k in KEY_FILES:",
"    p = ROOT / k",
"    key_status[k] = {'exists': p.exists(), 'size': p.stat().st_size if p.exists() else 0}",
"",
"symbols = {}",
"references = {}",
"call_candidates = {}",
"for f in files:",
"    p = ROOT / f['path']",
"    ext = p.suffix.lower()",
"    if ext not in TEXT_EXTS and p.name not in ['.gitignore']:",
"        continue",
"    text = read_text(p)",
"    if ext in ['.js', '.jsx', '.ts', '.tsx']:",
"        s = extract_js_symbols(text)",
"        if s:",
"            symbols[f['path']] = s",
"        c = extract_js_calls(text)",
"        if c:",
"            call_candidates[f['path']] = c",
"    elif ext == '.py':",
"        s = extract_py_symbols(text)",
"        if s:",
"            symbols[f['path']] = s",
"        c = extract_py_calls(text)",
"        if c:",
"            call_candidates[f['path']] = c",
"    refs = extract_refs(text)",
"    if refs:",
"        references[f['path']] = refs",
"",
"lesson_dir = ROOT / 'data' / 'lessons'",
"side_dir = ROOT / 'data' / 'side_cards'",
"lesson_files = sorted(lesson_dir.glob('*.json')) if lesson_dir.exists() else []",
"side_files = sorted(side_dir.glob('*.json')) if side_dir.exists() else []",
"",
"def count_json_cards(paths):",
"    total = 0",
"    bad = []",
"    for p in paths:",
"        try:",
"            data = json.loads(read_text(p, limit=5000000))",
"            if isinstance(data, list):",
"                total += len(data)",
"            elif isinstance(data, dict):",
"                for key in ['cards', 'items', 'lessons', 'side_cards']:",
"                    if isinstance(data.get(key), list):",
"                        total += len(data[key])",
"                        break",
"        except Exception as e:",
"            bad.append(rel(p) + ': ' + str(e))",
"    return total, bad[:20]",
"",
"lesson_card_count, lesson_bad = count_json_cards(lesson_files)",
"side_card_count, side_bad = count_json_cards(side_files)",
"environment = audit_environment()",
"",
"verify_files = sorted([f['path'] for f in files if f['path'].startswith('tools/') and ('verify' in f['path'].lower() or 'smoke' in f['path'].lower() or 'validate' in f['path'].lower())])[:60]",
"",
"mermaid_lines = ['flowchart TD', '  ROOT[project root]', '  ROOT --> PWA[src/pwa]', '  ROOT --> DATA[data]', '  ROOT --> TOOLS[tools]', '  PWA --> APP[app.js]', '  PWA --> CE[code_explainer.js]', '  PWA --> PA[project_analyzer.js]', '  PWA --> RULES[code_explainer_rules.js]', '  PWA --> STYLE[style.css]', '  DATA --> LESSONS[lessons JSON]', '  DATA --> SIDES[side_cards JSON]', '  TOOLS --> VALIDATE[validate/smoke/verify]', '  CE --> RULES', '  PA --> TOOLS', '  APP --> LESSONS', '  APP --> SIDES']",
"",
"# RAW_REPORT_TOP_FILE_SORT_V246_A1",
"def report_top_file_priority(path):",
"    p = str(path).replace('\\\\', '/')",
"    if p == 'src/pwa/app.js':",
"        return (0, p)",
"    if p == 'src/pwa/code_explainer.js':",
"        return (1, p)",
"    if p == 'src/pwa/code_explainer_rules.js':",
"        return (2, p)",
"    if p == 'src/pwa/project_analyzer.js':",
"        return (3, p)",
"    if p.startswith('src/pwa/'):",
"        return (4, p)",
"    if p == 'tools/validate_lessons.py':",
"        return (10, p)",
"    if p == 'tools/code_explainer_smoke_v171.js':",
"        return (11, p)",
"    if p.startswith('tools/verify_project_analyzer_'):",
"        return (20, p)",
"    if p.startswith('tools/verify_code_explainer_'):",
"        return (21, p)",
"    if p.startswith('tools/'):",
"        return (30, p)",
"    if p.startswith('notes/design/backup_') or '/backup_' in p or p.startswith('notes/'):",
"        return (90, p)",
"    return (50, p)",
"",
"report = {",
"    'generated_at': datetime.now().isoformat(timespec='seconds'),",
"    'root': str(ROOT),",
"    'git': {'head': run('git --no-pager log --oneline -1'), 'status_short': run('git status --short'), 'tags_at_head': run('git tag --points-at HEAD')},",
"    'counts': {'files_total': len(files), 'bytes_total': sum(f['size'] for f in files), 'lesson_files': len(lesson_files), 'side_card_files': len(side_files), 'lesson_cards_estimated': lesson_card_count, 'side_cards_estimated': side_card_count},",
"    'extension_counts': dict(ext_counts.most_common(30)),",
"    'role_counts': dict(role_counts.most_common()),",
"    'top_dirs': dict(top_dirs.most_common(30)),",
"    'key_files': key_status,",
"    'candidate_bundles': {'code_explainer_diagram': ['src/pwa/index.html', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/style.css'], 'project_analyzer': ['src/pwa/index.html', 'src/pwa/project_analyzer.js', 'src/pwa/style.css'], 'learning_card_data': ['data/lessons', 'data/side_cards', 'tools/validate_lessons.py'], 'verification_smoke': verify_files},",
"    'environment': environment,",
"    'symbols': symbols,",
"    'call_candidates': call_candidates,",
"    'references': references,",
"    'json_errors': {'lesson_errors': lesson_bad, 'side_card_errors': side_bad},",
"    'mermaid': '\\n'.join(mermaid_lines),",
"}",
"",
"OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')",
"OUT_JSON_LATEST.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')",
"md = []",
"md.append('# Project Probe Report V248')",
"md.append('')",
"md.append('- generated_at: ' + report['generated_at'])",
"md.append('- root: `' + report['root'] + '`')",
"md.append('- git_head: `' + report['git']['head'] + '`')",
"md.append('- git_status_short: `' + (report['git']['status_short'] or 'clean') + '`')",
"md.append('- tags_at_head: `' + report['git']['tags_at_head'] + '`')",
"md.append('')",
"md.append('## Counts')",
"for k, v in report['counts'].items():",
"    md.append('- ' + k + ': ' + str(v))",
"md.append('')",
"md.append('## Role counts')",
"for k, v in report['role_counts'].items():",
"    md.append('- ' + k + ': ' + str(v))",
"md.append('')",
"md.append('## Environment')",
"for k, v in report['environment'].items():",
"    md.append('- ' + k + ': ' + json.dumps(v, ensure_ascii=False))",
"md.append('')",
"md.append('## Key files')",
"for k, v in report['key_files'].items():",
"    md.append('- ' + k + ': ' + ('OK' if v['exists'] else 'MISSING') + ' (' + str(v['size']) + ' bytes)')",
"md.append('')",
"md.append('## Candidate bundles')",
"for name, items in report['candidate_bundles'].items():",
"    md.append('### ' + name)",
"    for item in items:",
"        md.append('- ' + item)",
"md.append('')",
"md.append('## Top symbol files')",
"for path, syms in sorted(symbols.items(), key=lambda item: report_top_file_priority(item[0]))[:20]:",
"    md.append('- ' + path + ': ' + ', '.join([s['name'] for s in syms[:12]]))",
"md.append('')",
"md.append('## Top call files')",
"for path, calls in sorted(call_candidates.items(), key=lambda item: report_top_file_priority(item[0]))[:20]:",
"    md.append('- ' + path + ': ' + ', '.join([c['name'] + '(' + str(c['count']) + ')' for c in calls[:12]]))",
"md.append('')",
"md.append('## Mermaid')",
"md.extend(mermaid_lines)",
"md.append('')",
"md.append('## Output files')",
"md.append('- ' + rel(OUT_JSON))",
"md.append('- ' + rel(OUT_MD))",
"md.append('- ' + rel(OUT_JSON_LATEST))",
"md.append('- ' + rel(OUT_MD_LATEST))",
"OUT_MD.write_text('\\n'.join(md), encoding='utf-8')",
"OUT_MD_LATEST.write_text('\\n'.join(md), encoding='utf-8')",
"",
"print('PROJECT_PROBE_V248_OK')",
"print('PROJECT_PROBE_V199_OK')",
"print('ROOT', ROOT)",
"print('GIT_HEAD', report['git']['head'])",
"print('GIT_STATUS', report['git']['status_short'] or 'clean')",
"print('FILES_TOTAL', report['counts']['files_total'])",
"print('LESSON_FILES', report['counts']['lesson_files'])",
"print('SIDE_CARD_FILES', report['counts']['side_card_files'])",
"print('LESSON_CARDS_ESTIMATED', report['counts']['lesson_cards_estimated'])",
"print('SIDE_CARDS_ESTIMATED', report['counts']['side_cards_estimated'])",
"print('ROLE_COUNTS', json.dumps(report['role_counts'], ensure_ascii=False))",
"print('ENV_PYTHON_VERSION', environment.get('python_version', ''))",
"print('ENV_STANDARD_LIBRARY_ONLY', environment.get('standard_library_only', True))",
"print('CALL_CANDIDATE_FILES', len(call_candidates))",
"print('OUT_JSON', rel(OUT_JSON))",
"print('OUT_MD', rel(OUT_MD))",
"print('MERMAID_START')",
"print(report['mermaid'])",
"print('MERMAID_END')"
    ].join("\n");
  }

  function buildProbeCommand(projectRoot) {
    const root = String(projectRoot || "").trim();

    if (!root) {
      return "";
    }

    const pythonCode = probePythonCode();

    return [
      '$ErrorActionPreference = "Stop"',
      "$ProjectRoot = " + quotePowerShellSingle(root),
      "Set-Location $ProjectRoot",
      "",
      "if (-not (Test-Path .\\.tmp)) {",
      "  New-Item -ItemType Directory -Force .\\.tmp | Out-Null",
      "}",
      "",
      "# ENV_AUDIT_V194_A1",
      "$PythonCmd = Get-Command python -ErrorAction SilentlyContinue",
      "if (-not $PythonCmd) { throw 'PYTHON_NOT_FOUND: Python을 설치하거나 PATH에 추가한 뒤 다시 실행하세요.' }",
      "$GitCmd = Get-Command git -ErrorAction SilentlyContinue",
      "$NodeCmd = Get-Command node -ErrorAction SilentlyContinue",
      "$PipCmd = python -m pip --version 2>$null",
      "$RequiredPipPackages = @()",
      "Write-Host 'ENV_AUDIT_V194_A1'",
      "Write-Host ('ENV_PYTHON ' + $PythonCmd.Source)",
      "Write-Host ('ENV_GIT ' + $(if ($GitCmd) { $GitCmd.Source } else { 'missing_optional' }))",
      "Write-Host ('ENV_NODE ' + $(if ($NodeCmd) { $NodeCmd.Source } else { 'missing_optional' }))",
      "Write-Host ('ENV_PIP ' + $(if ($PipCmd) { $PipCmd } else { 'missing_optional' }))",
      "if ($RequiredPipPackages.Count -eq 0) {",
      "  Write-Host 'ENV_PIP_PACKAGES none'",
      "} else {",
      "  foreach ($pkg in $RequiredPipPackages) {",
      "    python -m pip show $pkg *> $null",
      "    if ($LASTEXITCODE -ne 0) {",
      "      Write-Host ('ENV_INSTALLING_PIP_PACKAGE ' + $pkg)",
      "      python -m pip install $pkg",
      "    } else {",
      "      Write-Host ('ENV_PIP_PACKAGE_OK ' + $pkg)",
      "    }",
      "  }",
      "}",
      "",
      "@'",
      pythonCode,
      "'@ | Set-Content .\\.tmp\\project_probe_v199_from_app.py -Encoding UTF8",
      "",
      "python .\\.tmp\\project_probe_v199_from_app.py",
      "",
      '"`n=== REPORT PREVIEW ==="',
      "Get-Content .\\.tmp\\project_probe_v199_report.md -Encoding UTF8 -TotalCount 220"
    ].join("\n");
  }

  function getLineValue(text, key) {
    const pattern = new RegExp("^" + key.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "\\s+(.+)$", "m");
    const match = text.match(pattern);
    return match ? match[1].trim() : "";
  }

  function parseMarkdownCount(text, label) {
    const match = text.match(new RegExp("- " + label + ":\\s*([^\\n\\r]+)"));
    return match ? match[1].trim() : "";
  }

  // ENV_PARSE_V194_A1
  function parseEnvironmentAudit(text) {
    return {
      audit: getLineValue(text, "ENV_AUDIT_V194_A1") || "",
      python: getLineValue(text, "ENV_PYTHON") || "",
      git: getLineValue(text, "ENV_GIT") || "",
      node: getLineValue(text, "ENV_NODE") || "",
      pip: getLineValue(text, "ENV_PIP") || "",
      pipPackages: getLineValue(text, "ENV_PIP_PACKAGES") || "none",
      pythonVersion: getLineValue(text, "ENV_PYTHON_VERSION") || "",
      standardLibraryOnly: getLineValue(text, "ENV_STANDARD_LIBRARY_ONLY") || ""
    };
  }

  // JSON_REPORT_PARSE_V195_A1
  function normalizeJsonCounts(counts) {
    const c = counts || {};
    return {
      filesTotal: String(c.files_total || c.filesTotal || ""),
      lessonFiles: String(c.lesson_files || c.lessonFiles || ""),
      sideCardFiles: String(c.side_card_files || c.sideCardFiles || ""),
      lessonCards: String(c.lesson_cards_estimated || c.lessonCards || ""),
      sideCards: String(c.side_cards_estimated || c.sideCards || "")
    };
  }

  function normalizeJsonEnvironment(environment) {
    const env = environment || {};
    return {
      audit: "json_report",
      python: env.python_executable || "",
      git: env.git || "",
      node: env.node || "",
      pip: env.pip || "",
      pipPackages: Array.isArray(env.required_pip_packages) ? env.required_pip_packages.join(", ") || "none" : "none",
      pythonVersion: env.python_version || "",
      standardLibraryOnly: String(env.standard_library_only !== false)
    };
  }

  // PROJECT_ANALYZER_CLEANUP_V199_A1
  function parseProjectReportJson(text) {
    const raw = String(text || "").trim();

    if (!raw || raw[0] !== "{") {
      return null;
    }

    let report = null;

    try {
      report = JSON.parse(raw);
    } catch (error) {
      return null;
    }

    if (!report || typeof report !== "object") {
      return null;
    }

    const git = report.git || {};
    const callCandidates = report.call_candidates || {};
    const symbols = report.symbols || {};
    const references = report.references || {};
    const keyFiles = report.key_files || {};
    const candidateBundles = report.candidate_bundles || {};

    return {
      ok: true,
      inputMode: "json",
      root: report.root || "",
      gitHead: git.head || "",
      gitStatus: git.status_short || "",
      outJson: "",
      outMd: "",
      counts: normalizeJsonCounts(report.counts || {}),
      roleCounts: report.role_counts || {},
      environment: normalizeJsonEnvironment(report.environment || {}),
      callCandidateFiles: String(Object.keys(callCandidates).length),
      symbols: symbols,
      callCandidates: callCandidates,
      references: references,
      keyFiles: keyFiles,
      candidateBundles: candidateBundles,
      mermaid: report.mermaid || "",
      raw: raw
    };
  }

  function parseProbeOutput(text) {
    const raw = String(text || "");
    const jsonParsed = parseProjectReportJson(raw);

    if (jsonParsed) {
      return jsonParsed;
    }

    const roleRaw = getLineValue(raw, "ROLE_COUNTS");
    let roleCounts = {};

    if (roleRaw) {
      try {
        roleCounts = JSON.parse(roleRaw);
      } catch (error) {
        roleCounts = {};
      }
    }

    const counts = {
      filesTotal: getLineValue(raw, "FILES_TOTAL") || parseMarkdownCount(raw, "files_total"),
      lessonFiles: getLineValue(raw, "LESSON_FILES") || parseMarkdownCount(raw, "lesson_files"),
      sideCardFiles: getLineValue(raw, "SIDE_CARD_FILES") || parseMarkdownCount(raw, "side_card_files"),
      lessonCards: getLineValue(raw, "LESSON_CARDS_ESTIMATED") || parseMarkdownCount(raw, "lesson_cards_estimated"),
      sideCards: getLineValue(raw, "SIDE_CARDS_ESTIMATED") || parseMarkdownCount(raw, "side_cards_estimated")
    };

    return {
      ok: raw.includes("PROJECT_PROBE_V248_OK") || raw.includes("PROJECT_PROBE_V199_OK") || raw.includes("PROJECT_PROBE_V198_OK") || raw.includes("PROJECT_PROBE_V197_OK") || raw.includes("PROJECT_PROBE_V195_OK") || raw.includes("PROJECT_PROBE_V193_OK") || raw.includes("# Project Probe Report V248") || raw.includes("# Project Probe Report V247") || raw.includes("# Project Probe V247") || raw.includes("# Project Probe V199") || raw.includes("# Project Probe V198") || raw.includes("# Project Probe V197") || raw.includes("# Project Probe V195") || raw.includes("# Project Probe V193"),
      inputMode: "terminal",
      root: getLineValue(raw, "ROOT") || (raw.match(/- root: `([^`]+)`/) || [])[1] || "",
      gitHead: getLineValue(raw, "GIT_HEAD") || (raw.match(/- git_head: `([^`]+)`/) || [])[1] || "",
      gitStatus: getLineValue(raw, "GIT_STATUS") || (raw.match(/- git_status_short: `([^`]+)`/) || [])[1] || "",
      outJson: getLineValue(raw, "OUT_JSON"),
      outMd: getLineValue(raw, "OUT_MD"),
      counts: counts,
      roleCounts: roleCounts,
      environment: parseEnvironmentAudit(raw),
      callCandidateFiles: getLineValue(raw, "CALL_CANDIDATE_FILES"),
      symbols: {},
      callCandidates: {},
      references: {},
      keyFiles: {},
      candidateBundles: {},
      mermaid: extractMermaid(raw),
      raw: raw
    };
  }

  function extractMermaid(text) {
    const sentinel = text.match(/MERMAID_START\s*([\s\S]*?)\s*MERMAID_END/);
    if (sentinel) {
      return sentinel[1].trim();
    }

    const fence = text.match(/```mermaid\s*([\s\S]*?)```/);
    if (fence) {
      return fence[1].trim();
    }

    const direct = text.match(/flowchart TD[\s\S]*?(?=\n## Output files|\n\(.+?\) PS|\n[A-Z_]+ |\s*$)/);
    if (direct) {
      return direct[0].trim();
    }

    return "";
  }

  function statusLabel(status) {
    if (!status || status === "clean") return "clean";
    if (status.trim() === "?? .tmp/") return "clean except .tmp";
    return status;
  }

  function renderRoleCounts(roleCounts) {
    const entries = Object.keys(roleCounts || {}).map(function(key) {
      return [key, roleCounts[key]];
    });

    if (!entries.length) {
      return '<p class="muted">역할별 집계가 출력에 포함되지 않았습니다.</p>';
    }

    return '<div class="project-mini-grid">' + entries.slice(0, 12).map(function(item) {
      return '<div class="project-mini-card"><strong>' + escapeHtml(item[1]) + '</strong><span>' + escapeHtml(item[0]) + '</span></div>';
    }).join("") + '</div>';
  }

  function renderEnvironmentAudit(environment) {
    const env = environment || {};
    const rows = [
      ["Python", env.python || env.pythonVersion || "-"],
      ["Git", env.git || "-"],
      ["Node", env.node || "-"],
      ["pip", env.pip || "-"],
      ["필요 pip 패키지", env.pipPackages || "none"],
      ["표준 라이브러리만 사용", env.standardLibraryOnly || "true"]
    ];

    return '<div class="project-env-list">' + rows.map(function(row) {
      return '<div class="project-env-row"><strong>' + escapeHtml(row[0]) + '</strong><span>' + escapeHtml(row[1]) + '</span></div>';
    }).join("") + '</div>';
  }

  function buildRecommendations(parsed) {
    const items = [];

    items.push("프로젝트 수정 전에는 probe 출력의 핵심 파일 묶음을 먼저 확인하세요.");
    items.push("코드해석/다이어그램 수정 시 src/pwa/index.html, code_explainer.js, code_explainer_rules.js, style.css, smoke/verify 스크립트를 같이 봐야 합니다.");
    items.push("학습 카드 수정 시 data/lessons, data/side_cards, tools/validate_lessons.py를 함께 검증해야 합니다.");

    if (parsed.inputMode !== "json") {
      items.push("JSON 리포트 전체를 붙여넣으면 핵심 파일, 함수/클래스, 호출 후보, 참조 관계까지 더 자세히 볼 수 있습니다.");
    }

    if (String(parsed.gitStatus || "").includes("?? .tmp/")) {
      items.push(".tmp는 probe 산출물이므로 커밋하지 말고 마지막에 삭제하세요.");
    }

    if (!parsed.ok) {
      items.push("PROJECT_PROBE_V248_OK, PROJECT_PROBE_V199_OK 또는 최신 Project Probe Report 제목이 보이지 않습니다. 출력이 잘렸을 수 있습니다. V199/V198/V197 출력도 읽을 수 있지만 새 probe 실행을 권장합니다.");
    }

    return items;
  }

  async function renderProjectMermaid(source) {
    const diagram = el("projectMermaidDiagram");
    const src = el("projectMermaidSource");
    const status = el("projectDiagramStatus");

    lastMermaid = source || "";

    if (src) src.textContent = lastMermaid;
    if (!diagram) return;

    if (!lastMermaid) {
      diagram.innerHTML = '<p class="muted">Mermaid 구조도가 출력에 없습니다.</p>';
      if (status) status.textContent = "구조도 없음";
      return;
    }

    if (!window.mermaid) {
      diagram.innerHTML = '<p class="muted">Mermaid 라이브러리 로딩 후 다시 분석하세요.</p>';
      if (status) status.textContent = "Mermaid 대기";
      return;
    }

    try {
      const id = "project-mermaid-" + Date.now();
      const result = await window.mermaid.render(id, lastMermaid);
      diagram.innerHTML = result.svg;
      if (status) status.textContent = "구조도 생성 완료";
    } catch (error) {
      diagram.textContent = String(error);
      if (status) status.textContent = "구조도 오류";
    }
  }

  // JSON_REPORT_RENDER_V195_A1
  function objectEntries(obj) {
    return Object.keys(obj || {}).map(function(key) {
      return [key, obj[key]];
    });
  }

  function renderDataSection(title, entries, renderer, emptyText) {
    if (!entries || entries.length === 0) {
      return "";
    }

    return '<div class="project-detail-section">' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<div class="project-data-list">' +
      entries.map(renderer).join("") +
      '</div>' +
      '</div>';
  }

  function renderKeyFiles(keyFiles) {
    return renderDataSection("핵심 파일 상태", objectEntries(keyFiles).slice(0, 20), function(item) {
      const info = item[1] || {};
      const status = info.exists ? "OK" : "MISSING";
      const size = typeof info.size === "number" ? " · " + info.size + " bytes" : "";
      return '<div class="project-data-row"><strong>' + escapeHtml(item[0]) + '</strong><span>' + escapeHtml(status + size) + '</span></div>';
    });
  }

  // PROJECT_CANDIDATE_BUNDLE_KEYS_V244_A1
  function candidateBundleDisplayLabel(key) {
    const labels = {
      code_explainer_diagram: "코드해석/다이어그램",
      project_analyzer: "프로젝트분석",
      learning_card_data: "학습 카드/데이터",
      verification_smoke: "검증/스모크"
    };

    return labels[key] || key;
  }

  function renderCandidateBundles(candidateBundles) {
    return renderDataSection("기능별 파일 묶음", objectEntries(candidateBundles).slice(0, 12), function(item) {
      const files = Array.isArray(item[1]) ? item[1] : [];
      return '<div class="project-data-row"><strong>' + escapeHtml(candidateBundleDisplayLabel(item[0])) + '</strong><span>' + escapeHtml(files.slice(0, 12).join(" · ")) + '</span></div>';
    });
  }

  // PROJECT_TO_CODE_EXPLAINER_BRIDGE_V233_A1
  function inferBridgeSnippetLanguage(path) {
    const p = String(path || "").toLowerCase();
    if (/\.py$/.test(p)) return "python";
    if (/\.ps1$/.test(p)) return "powershell";
    if (/\.(js|jsx|ts|tsx)$/.test(p)) return "javascript";
    if (/\.java$/.test(p)) return "java";
    return "auto";
  }

  function buildProjectCodeBridgeSnippet(kind, path, name, type, snippet) {
    const providedSnippet = String(snippet || "").trim();
    if (providedSnippet) {
      return providedSnippet;
    }

    const lang = inferBridgeSnippetLanguage(path);
    const rawName = String(name || "target");
    const safeName = rawName.replace(/[^\w$]/g, "_") || "target";

    if (kind === "symbol") {
      if (lang === "python") {
        if (String(type || "").toLowerCase().indexOf("class") >= 0) {
          return "class " + safeName + ":\n    pass";
        }
        return "def " + safeName + "():\n    pass";
      }
      if (lang === "javascript") {
        if (String(type || "").toLowerCase().indexOf("class") >= 0) {
          return "class " + safeName + " {\n  constructor() {}\n}";
        }
        return "function " + safeName + "() {\n  return null;\n}";
      }
      if (lang === "java") {
        return "class " + safeName + " {\n  void run() {}\n}";
      }
      return safeName + "()";
    }

    if (lang === "python") return "result = " + safeName + "()";
    if (lang === "javascript") return "const result = " + safeName + "();";
    if (lang === "powershell") return rawName || safeName;
    if (lang === "java") return safeName + "();";
    return safeName + "()";
  }

  // PROJECT_BRIDGE_PAYLOAD_LIGHT_V242_A1
  function encodeProjectCodeBridgePayload(kind, path, name, type, snippet) {
    const payload = {
      kind: kind || "call",
      path: path || "",
      name: name || "",
      type: type || ""
    };

    return encodeURIComponent(JSON.stringify(payload));
  }

  function decodeProjectCodeBridgePayload(value) {
    try {
      return JSON.parse(decodeURIComponent(String(value || "")));
    } catch (err) {
      return null;
    }
  }

  function findProjectCodeBridgeSnippet(kind, path, name, type) {
    const report = lastParsedReport || {};
    const source = kind === "symbol" ? report.symbols : report.callCandidates;
    const filePath = String(path || "");
    const targetName = String(name || "");
    const targetType = String(type || "").toLowerCase();

    if (!source || !filePath || !targetName || !Array.isArray(source[filePath])) {
      return "";
    }

    const items = source[filePath];
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i] || {};
      const itemName = String(item.name || "");
      const itemType = String(item.type || "").toLowerCase();

      if (itemName !== targetName) continue;
      if (kind === "symbol" && targetType && itemType && itemType !== targetType) continue;

      const snippet = String(item.snippet || "").trim();
      if (snippet) return snippet;
    }

    return "";
  }

  function renderProjectCodeBridgeButton(kind, path, name, type, snippet) {
    if (!name) return "";
    const payload = encodeProjectCodeBridgePayload(kind, path, name, type, snippet || "");
    return '<button type="button" class="project-code-bridge-btn" data-project-code-bridge="' + escapeHtml(payload) + '">코드해석</button>';
  }

  // PROJECT_TO_CODE_BRIDGE_UI_V234_A1
  function switchToCodeExplainerViewV234() {
    const tab = document.querySelector('[data-view="code"]');
    if (tab && typeof tab.click === "function") {
      tab.click();
      return true;
    }

    const views = document.querySelectorAll(".view");
    views.forEach(function(view) {
      view.classList.remove("active-view");
    });

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(function(button) {
      button.classList.toggle("active", button.getAttribute("data-view") === "code");
    });

    const codeView = el("codeView");
    if (codeView) {
      codeView.classList.add("active-view");
      return true;
    }

    return false;
  }

  function handleProjectCodeBridgeClick(event) {
    const target = event && event.target && event.target.closest
      ? event.target.closest("[data-project-code-bridge]")
      : null;
    if (!target) return;

    const payload = decodeProjectCodeBridgePayload(target.getAttribute("data-project-code-bridge"));
    if (!payload || !payload.name) return;

    event.preventDefault();

    const reportSnippet = findProjectCodeBridgeSnippet(payload.kind, payload.path, payload.name, payload.type);
    const snippet = buildProjectCodeBridgeSnippet(payload.kind, payload.path, payload.name, payload.type, reportSnippet || payload.snippet || "");
    const language = inferBridgeSnippetLanguage(payload.path);

    if (window.CodeExplainer && typeof window.CodeExplainer.analyzeSnippet === "function") {
      switchToCodeExplainerViewV234();
      window.CodeExplainer.analyzeSnippet(snippet, language);
      target.textContent = "전송됨";
      target.classList.add("is-sent");
      return;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(snippet);
      target.textContent = "복사됨";
      target.classList.add("is-sent");
    }
  }


  // PROJECT_CODE_MORE_TOGGLE_V238_A1
  function buildProjectCodeMoreId(kind, path) {
    const raw = String(kind || "items") + "-" + String(path || "file");
    return raw.replace(/[^A-Za-z0-9_-]/g, "-").slice(0, 96) || "project-code-more";
  }

  function renderProjectCodeChip(kind, filePath, name, type, label, snippet) {
    if (!name) return "";
    return '<span class="project-code-chip"><span>' + escapeHtml(label || name) + '</span> ' +
      renderProjectCodeBridgeButton(kind, filePath, name, type || "", snippet || "") +
      '</span>';
  }

  function renderProjectCodeMoreToggle(id, hiddenCount) {
    const moreLabel = "외 " + hiddenCount + "개 더보기";
    return '<button type="button" class="project-code-more-toggle" data-project-code-more-toggle="' + escapeHtml(id) + '" data-more-label="' + escapeHtml(moreLabel) + '" aria-expanded="false">' + escapeHtml(moreLabel) + '</button>';
  }

  function renderProjectCodeHiddenItems(id, chips) {
    if (!chips || !chips.length) return "";
    return '<span class="project-code-hidden-items" data-project-code-more-items="' + escapeHtml(id) + '" hidden>' + chips.join(" · ") + '</span>';
  }

  function handleProjectCodeMoreToggleClick(event) {
    const target = event && event.target && event.target.closest
      ? event.target.closest("[data-project-code-more-toggle]")
      : null;
    if (!target) return;

    const id = target.getAttribute("data-project-code-more-toggle");
    if (!id) return;

    const hiddenItems = document.querySelector('[data-project-code-more-items="' + id + '"]');
    if (!hiddenItems) return;

    event.preventDefault();

    const expanded = target.getAttribute("aria-expanded") === "true";
    if (expanded) {
      hiddenItems.hidden = true;
      target.setAttribute("aria-expanded", "false");
      target.textContent = target.getAttribute("data-more-label") || "더보기";
      return;
    }

    hiddenItems.hidden = false;
    target.setAttribute("aria-expanded", "true");
    target.textContent = "접기";
  }
  // PROJECT_DETAIL_FOCUS_SORT_V241_A1
  function projectDetailPathPriority(path) {
    const p = String(path || "").replace(/\\/g, "/").toLowerCase();

    if (p === "src/pwa/app.js") return 0;
    if (p === "src/pwa/code_explainer.js") return 1;
    if (p === "src/pwa/code_explainer_rules.js") return 2;
    if (p === "src/pwa/project_analyzer.js") return 3;
    if (p.startsWith("src/pwa/")) return 4;
    if (p === "tools/validate_lessons.py") return 10;
    if (p === "tools/code_explainer_smoke_v171.js") return 11;
    if (p.startsWith("tools/verify_project_analyzer_")) return 20;
    if (p.startsWith("tools/verify_code_explainer_")) return 21;
    if (p.startsWith("tools/")) return 25;
    if (p.startsWith("notes/design/backup") || p.indexOf("/backup") >= 0 || p.indexOf("backup_") >= 0) return 90;
    if (p.startsWith("notes/")) return 80;
    return 50;
  }

  function sortProjectDetailEntries(entries) {
    return (Array.isArray(entries) ? entries : []).slice().sort(function(a, b) {
      const pa = projectDetailPathPriority(a && a[0]);
      const pb = projectDetailPathPriority(b && b[0]);
      if (pa !== pb) return pa - pb;
      return String((a && a[0]) || "").localeCompare(String((b && b[0]) || ""));
    });
  }

  function renderSymbolFiles(symbols) {
    return renderDataSection("주요 함수/클래스", sortProjectDetailEntries(objectEntries(symbols)).slice(0, 15), function(item) {
      const filePath = item[0];
      const symbolItems = Array.isArray(item[1]) ? item[1] : [];
      const visibleSymbols = symbolItems.slice(0, 5);
      const hiddenSymbols = symbolItems.slice(5);
      const moreId = buildProjectCodeMoreId("symbol", filePath);
      const names = visibleSymbols.map(function(symbol) {
        const name = symbol.name || "";
        return renderProjectCodeChip("symbol", filePath, name, symbol.type || "", name, symbol.snippet || "");
      }).filter(Boolean);
      const hiddenNames = hiddenSymbols.map(function(symbol) {
        const name = symbol.name || "";
        return renderProjectCodeChip("symbol", filePath, name, symbol.type || "", name, symbol.snippet || "");
      }).filter(Boolean);
      const moreHtml = hiddenNames.length
        ? ' · ' + renderProjectCodeMoreToggle(moreId, hiddenNames.length) + ' ' + renderProjectCodeHiddenItems(moreId, hiddenNames)
        : '';
      return '<div class="project-data-row"><strong>' + escapeHtml(filePath) + '</strong><span>' + names.join(" · ") + moreHtml + '</span></div>';
    });
  }

  function renderCallCandidateDetails(callCandidates) {
    return renderDataSection("함수 호출 후보 상세", sortProjectDetailEntries(objectEntries(callCandidates)).slice(0, 15), function(item) {
      const filePath = item[0];
      const callItems = Array.isArray(item[1]) ? item[1] : [];
      const visibleCalls = callItems.slice(0, 5);
      const hiddenCalls = callItems.slice(5);
      const moreId = buildProjectCodeMoreId("call", filePath);
      const calls = visibleCalls.map(function(call) {
        const name = call.name || "";
        return renderProjectCodeChip("call", filePath, name, "call", name + "(" + (call.count || 0) + ")", call.snippet || "");
      }).filter(Boolean);
      const hiddenCallChips = hiddenCalls.map(function(call) {
        const name = call.name || "";
        return renderProjectCodeChip("call", filePath, name, "call", name + "(" + (call.count || 0) + ")", call.snippet || "");
      }).filter(Boolean);
      const moreHtml = hiddenCallChips.length
        ? ' · ' + renderProjectCodeMoreToggle(moreId, hiddenCallChips.length) + ' ' + renderProjectCodeHiddenItems(moreId, hiddenCallChips)
        : '';
      return '<div class="project-data-row"><strong>' + escapeHtml(filePath) + '</strong><span>' + calls.join(" · ") + moreHtml + '</span></div>';
    });
  }

  function renderReferenceDetails(references) {
    return renderDataSection("참조 관계 후보", objectEntries(references).slice(0, 15), function(item) {
      const refs = Array.isArray(item[1]) ? item[1].slice(0, 10) : [];
      return '<div class="project-data-row"><strong>' + escapeHtml(item[0]) + '</strong><span>' + escapeHtml(refs.join(" · ")) + '</span></div>';
    });
  }


  // PROJECT_CROSS_FILE_LINKS_V265_A1
  function normalizeProjectPathV265(path) {
    return String(path || "").replace(/\\/g, "/").replace(/^\.\//, "");
  }

  // PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4

  // PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1
  const PROJECT_CROSS_FILE_GENERIC_SYMBOLS_V266 = new Set([
    "add",
    "has",
    "get",
    "set",
    "map",
    "filter",
    "reduce",
    "init",
    "refresh",
    "render",
    "update",
    "create",
    "build",
    "parse",
    "format",
    "escape",
    "escapeHtml",
    "normalize",
    "resolve",
    "count",
    "push",
    "then",
    "catch"
  ]);

  const PROJECT_CROSS_FILE_STRONG_SYMBOLS_V266 = new Set([
    "CodeExplainer",
    "ProjectAnalyzer",
    "CodeExplainerRules",
    "analyzeSnippet",
    "analyze",
    "detectLanguage",
    "buildProbeCommand",
    "parseProbeOutput",
    "renderProbeAnalysis",
    "buildCodeBridgeSnippet",
    "buildCrossFileLinksV265"
  ]);

  function isProjectGenericSymbolV266(name) {
    const value = String(name || "").trim();
    if (!value) return true;
    if (value.length <= 2) return true;
    return PROJECT_CROSS_FILE_GENERIC_SYMBOLS_V266.has(value);
  }

  function isProjectStrongSymbolV266(name) {
    const value = String(name || "").trim();
    if (!value) return false;
    return PROJECT_CROSS_FILE_STRONG_SYMBOLS_V266.has(value) || /^[A-Z][A-Za-z0-9_$]+$/.test(value);
  }

  function getProjectCrossFileConfidenceV266(link) {
    const symbol = String((link && link.symbol) || "");
    const kind = String((link && link.kind) || "");

    if (kind === "file-reference") return "high";
    if (kind.indexOf("window_object") >= 0) return "high";
    if (isProjectStrongSymbolV266(symbol)) return "high";
    if (isProjectGenericSymbolV266(symbol)) return "low";
    return "medium";
  }

  function shouldKeepProjectCrossFileLinkV266(link) {
    const symbol = String((link && link.symbol) || "");
    const kind = String((link && link.kind) || "");

    if (kind === "file-reference") return true;
    if (kind.indexOf("window_object") >= 0) return true;
    if (isProjectStrongSymbolV266(symbol)) return true;
    if (isProjectGenericSymbolV266(symbol)) return false;

    return true;
  }

  function annotateProjectCrossFileLinkV266(link) {
    const confidence = getProjectCrossFileConfidenceV266(link);
    return Object.assign({}, link, {
      confidence: confidence,
      reason: confidence === "high"
        ? "명확한 파일 간 연결 신호"
        : confidence === "medium"
          ? "일반 함수명 기반 연결 후보"
          : "흔한 이름 기반 저신뢰 후보"
    });
  }

  function filterAndRankProjectCrossFileLinksV266(links) {
    const confidenceRank = { high: 3, medium: 2, low: 1 };

    return (Array.isArray(links) ? links : [])
      .map(annotateProjectCrossFileLinkV266)
      .filter(shouldKeepProjectCrossFileLinkV266)
      .sort(function(a, b) {
        const rankDiff = (confidenceRank[b.confidence] || 0) - (confidenceRank[a.confidence] || 0);
        if (rankDiff) return rankDiff;
        if (b.count !== a.count) return b.count - a.count;
        return (a.from + a.to + a.symbol).localeCompare(b.from + b.to + b.symbol);
      });
  }


  function buildProjectSymbolOwnerIndexV265(symbols) {
    const index = {};
    objectEntries(symbols || {}).forEach(function(entry) {
      const filePath = normalizeProjectPathV265(entry[0]);
      const items = Array.isArray(entry[1]) ? entry[1] : [];

      items.forEach(function(item) {
        const name = String((item && item.name) || "").trim();
        if (!name || name.length < 3) return;

        if (!index[name]) index[name] = [];
        if (index[name].indexOf(filePath) < 0) {
          index[name].push(filePath);
        }
      });
    });

    return index;
  }

  function isProjectPwaManifestFileV323A4(path) {
    return /(?:^|\/)(manifest\.webmanifest|manifest\.json|site\.webmanifest)$/i.test(normalizeProjectPathV265(path));
  }

  function isProjectServiceWorkerFileV323A4(path) {
    return /(?:^|\/)(sw\.js|service-worker\.js|serviceWorker\.js|worker\.js)$/i.test(normalizeProjectPathV265(path));
  }

  function collectKnownProjectFilesV323A4(parsed) {
    const known = [];
    const seen = new Set();

    function add(path) {
      const normalized = normalizeProjectPathV265(path);
      if (!normalized || /^https?:\/\//i.test(normalized) || normalized === "#") return;
      if (seen.has(normalized)) return;
      seen.add(normalized);
      known.push(normalized);
    }

    objectEntries((parsed && parsed.symbols) || {}).forEach(function(entry) {
      add(entry[0]);
    });

    objectEntries((parsed && parsed.callCandidates) || {}).forEach(function(entry) {
      add(entry[0]);
    });

    objectEntries((parsed && parsed.references) || {}).forEach(function(entry) {
      add(entry[0]);
    });

    objectEntries((parsed && parsed.keyFiles) || {}).forEach(function(entry) {
      const value = entry[1];
      if (value && value.exists === false) return;
      add(entry[0]);
    });

    objectEntries((parsed && (parsed.candidateBundles || parsed.candidate_bundles)) || {}).forEach(function(entry) {
      const files = Array.isArray(entry[1]) ? entry[1] : [];
      files.forEach(add);
    });

    // PWA manifest / service worker files often have no parsed symbols.
    // They still need to be known files so index.html -> manifest.webmanifest
    // and app.js -> sw.js references can become cross-file links.
    known.slice().forEach(function(file) {
      if (isProjectPwaManifestFileV323A4(file) || isProjectServiceWorkerFileV323A4(file)) {
        add(file);
      }
    });

    return known;
  }

  function resolveProjectReferenceTargetV265(fromPath, ref, knownFiles) {
    const raw = String(ref || "").split("?")[0].trim();
    if (!raw || /^https?:\/\//i.test(raw)) return "";

    const normalized = normalizeProjectPathV265(raw);
    const fromDir = normalizeProjectPathV265(fromPath).split("/").slice(0, -1).join("/");
    const candidates = [
      normalized,
      normalizeProjectPathV265(fromDir ? fromDir + "/" + normalized : normalized),
      normalizeProjectPathV265("src/pwa/" + normalized.replace(/^src\/pwa\//, "")),
      normalizeProjectPathV265(normalized.replace(/^\.\.\//, ""))
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      if (knownFiles.indexOf(candidates[i]) >= 0) return candidates[i];
    }

    return "";
  }

  function buildProjectCrossFileLinksV265(parsed) {
    const symbols = parsed && parsed.symbols ? parsed.symbols : {};
    const callCandidates = parsed && parsed.callCandidates ? parsed.callCandidates : {};
    const references = parsed && parsed.references ? parsed.references : {};
    const ownerIndex = buildProjectSymbolOwnerIndexV265(symbols);
    const knownFiles = collectKnownProjectFilesV323A4(parsed);
    const links = [];
    const seen = new Set();

    function addLink(from, to, symbol, kind, count) {
      const fromPath = normalizeProjectPathV265(from);
      const toPath = normalizeProjectPathV265(to);

      if (!fromPath || !toPath || fromPath === toPath) return;

      const key = [fromPath, toPath, symbol, kind].join("::");
      if (seen.has(key)) return;
      seen.add(key);

      links.push({
        from: fromPath,
        to: toPath,
        symbol: symbol || "",
        kind: kind || "unknown",
        count: Number(count || 1)
      });
    }

    objectEntries(callCandidates).forEach(function(entry) {
      const fromPath = normalizeProjectPathV265(entry[0]);
      const calls = Array.isArray(entry[1]) ? entry[1] : [];

      calls.forEach(function(call) {
        const name = String((call && call.name) || "").trim();
        const owners = ownerIndex[name] || [];
        owners.forEach(function(ownerPath) {
          addLink(fromPath, ownerPath, name, "call-to-symbol", call.count || 1);
        });
      });
    });

    objectEntries(references).forEach(function(entry) {
      const fromPath = normalizeProjectPathV265(entry[0]);
      const refs = Array.isArray(entry[1]) ? entry[1] : [];

      refs.forEach(function(ref) {
        const target = resolveProjectReferenceTargetV265(fromPath, ref, knownFiles);
        if (target) {
          addLink(fromPath, target, ref, "file-reference", 1);
        }
      });
    });

    return filterAndRankProjectCrossFileLinksV266(links).slice(0, 80);
  }

  function buildProjectCrossFileMermaidV265(links) {
    const items = Array.isArray(links) ? links.slice(0, 20) : [];
    const files = [];
    const idMap = {};

    function idFor(file) {
      if (!idMap[file]) {
        idMap[file] = "F" + Object.keys(idMap).length;
        files.push(file);
      }
      return idMap[file];
    }

    items.forEach(function(link) {
      idFor(link.from);
      idFor(link.to);
    });

    if (!items.length) {
      return "graph LR\n  empty[파일 간 연결 후보 없음]";
    }

    const lines = ["graph LR"];

    files.forEach(function(file) {
      lines.push('  ' + idFor(file) + '["' + file.replace("src/pwa/", "") + '"]');
    });

    items.forEach(function(link) {
      const label = String(link.symbol || link.kind || "link")
        .replace(/[\[\]{}()"`|]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 48);
      lines.push("  " + idFor(link.from) + " -->|" + label + "| " + idFor(link.to));
    });

    return lines.join("\n");
  }


  // PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1
  function getProjectCrossFileGroupKeyV267(link) {
    const symbol = String((link && link.symbol) || "");
    const kind = String((link && link.kind) || "");

    if (kind === "file-reference") return "file-reference";
    if (kind.indexOf("window_object") >= 0) return "public-api";
    if (/^[A-Z][A-Za-z0-9_$]+$/.test(symbol)) return "public-api";
    if (PROJECT_CROSS_FILE_STRONG_SYMBOLS_V266.has(symbol)) return "public-api";
    if (kind === "call-to-symbol") return "function-call";
    return "other";
  }

  function getProjectCrossFileGroupLabelV267(key) {
    if (key === "public-api") return "전역 객체 / 공개 API 연결";
    if (key === "file-reference") return "파일 참조 / 로딩 연결";
    if (key === "function-call") return "함수 호출 후보";
    return "기타 연결 후보";
  }

  function groupProjectCrossFileLinksV267(links) {
    const order = ["public-api", "file-reference", "function-call", "other"];
    const groups = {};

    order.forEach(function(key) {
      groups[key] = [];
    });

    (Array.isArray(links) ? links : []).forEach(function(link) {
      const key = getProjectCrossFileGroupKeyV267(link);
      if (!groups[key]) groups[key] = [];
      groups[key].push(link);
    });

    return order.map(function(key) {
      return {
        key: key,
        label: getProjectCrossFileGroupLabelV267(key),
        items: groups[key] || []
      };
    }).filter(function(group) {
      return group.items.length > 0;
    });
  }

  function renderProjectCrossFileConfidenceBadgeV267(confidence) {
    const value = String(confidence || "medium");
    const label = value === "high" ? "high" : value === "low" ? "low" : "medium";
    return '<span class="project-code-chip project-cross-file-confidence-v267"><span>' + escapeHtml(label) + '</span></span>';
  }


  // PROJECT_CROSS_FILE_DETAIL_PANEL_V271_A1
  function getProjectCrossFileSourceEvidenceV271(parsed, link) {
    const from = normalizeProjectPathV265(link && link.from);
    const symbol = String((link && link.symbol) || "");
    const kind = String((link && link.kind) || "");
    const callsByFile = (parsed && parsed.callCandidates) || {};
    const refsByFile = (parsed && parsed.references) || {};

    if (kind === "file-reference") {
      const refs = Array.isArray(refsByFile[from]) ? refsByFile[from] : [];
      const foundRef = refs.find(function(ref) {
        const raw = typeof ref === "string" ? ref : (ref && (ref.path || ref.reference || ref.name || ref.value));
        return String(raw || "") === symbol || String(raw || "").indexOf(symbol) >= 0;
      });

      if (foundRef) {
        const raw = typeof foundRef === "string" ? foundRef : (foundRef.path || foundRef.reference || foundRef.name || foundRef.value || "");
        return {
          type: "reference",
          line: foundRef.line || "",
          snippet: String(raw || "")
        };
      }

      return {
        type: "reference",
        line: "",
        snippet: symbol
      };
    }

    const calls = Array.isArray(callsByFile[from]) ? callsByFile[from] : [];
    const foundCall = calls.find(function(call) {
      return call && call.name === symbol;
    });

    if (foundCall) {
      return {
        type: "call_candidate",
        line: foundCall.line || "",
        snippet: foundCall.snippet || foundCall.name || symbol
      };
    }

    return {
      type: kind || "link",
      line: "",
      snippet: symbol
    };
  }

  function getProjectCrossFileTargetEvidenceV271(parsed, link) {
    const to = normalizeProjectPathV265(link && link.to);
    const symbol = String((link && link.symbol) || "");
    const symbolsByFile = (parsed && parsed.symbols) || {};
    const symbols = Array.isArray(symbolsByFile[to]) ? symbolsByFile[to] : [];
    const foundSymbol = symbols.find(function(item) {
      return item && item.name === symbol;
    });

    if (foundSymbol) {
      return {
        type: foundSymbol.type || "symbol",
        line: foundSymbol.line || "",
        snippet: foundSymbol.snippet || foundSymbol.name || symbol
      };
    }

    return {
      type: "target_file",
      line: "",
      snippet: symbol
    };
  }

  function enrichProjectCrossFileLinksWithEvidenceV271(parsed, links) {
    return (Array.isArray(links) ? links : []).map(function(link) {
      return Object.assign({}, link, {
        sourceEvidenceV271: getProjectCrossFileSourceEvidenceV271(parsed, link),
        targetEvidenceV271: getProjectCrossFileTargetEvidenceV271(parsed, link)
      });
    });
  }

  function renderProjectCrossFileEvidenceBlockV271(title, evidence) {
    const ev = evidence || {};
    const meta = [ev.type || "evidence", ev.line ? "line " + ev.line : ""].filter(Boolean).join(" · ");

    return '<div class="project-cross-file-evidence-v271">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<p class="muted">' + escapeHtml(meta || "evidence") + '</p>' +
      '<pre class="code-block">' + escapeHtml(String(ev.snippet || "").slice(0, 420)) + '</pre>' +
      '</div>';
  }

  function renderProjectCrossFileDetailPanelV271(link) {
    return '<details class="project-cross-file-detail-v271">' +
      '<summary>연결 상세</summary>' +
      '<div class="project-detail-grid">' +
      '<div><strong>from</strong><p class="muted">' + escapeHtml(link.from || "") + '</p></div>' +
      '<div><strong>to</strong><p class="muted">' + escapeHtml(link.to || "") + '</p></div>' +
      '<div><strong>symbol</strong><p class="muted">' + escapeHtml(link.symbol || "") + '</p></div>' +
      '<div><strong>confidence</strong><p class="muted">' + escapeHtml(link.confidence || "medium") + '</p></div>' +
      '</div>' +
      '<p class="muted">reason: ' + escapeHtml(link.reason || "일반 파일 간 연결 후보") + '</p>' +
      renderProjectCrossFileEvidenceBlockV271("from 파일 근거", link.sourceEvidenceV271) +
      renderProjectCrossFileEvidenceBlockV271("to 파일 근거", link.targetEvidenceV271) +
      '</details>';
  }


  function renderProjectCrossFileRowV267(link) {
    const reason = link.reason ? " · " + link.reason : "";

    return '<div class="project-data-row project-cross-file-row-v267 project-cross-file-row-v271">' +
      '<strong>' + escapeHtml(link.from + " → " + link.to) + '</strong>' +
      '<span>' +
      renderProjectCrossFileConfidenceBadgeV267(link.confidence || "medium") + ' ' +
      escapeHtml(link.kind + " · " + link.symbol + " · " + link.count + "회" + reason) +
      '</span>' +
      renderProjectCrossFileDetailPanelV271(link) +
      '</div>';
  }

  function renderProjectCrossFileGroupsV267(links) {
    const groups = groupProjectCrossFileLinksV267(links);

    if (!groups.length) {
      return '<p class="muted">표시할 파일 간 연결 후보가 없습니다.</p>';
    }

    return groups.map(function(group) {
      return '<div class="project-detail-section project-cross-file-group-v267">' +
        '<h4>' + escapeHtml(group.label + " · " + group.items.length + "개") + '</h4>' +
        '<div class="project-data-list">' +
        group.items.slice(0, 8).map(renderProjectCrossFileRowV267).join("") +
        '</div>' +
        '</div>';
    }).join("");
  }



  // PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1
  let projectCrossFileFocusPathV269 = "all";
  let lastProjectCrossFileParsedV269 = null;

  function getProjectCrossFileFocusPathV269() {
    return projectCrossFileFocusPathV269 || "all";
  }

  function setProjectCrossFileFocusPathV269(filePath) {
    projectCrossFileFocusPathV269 = normalizeProjectPathV265(filePath || "all") || "all";

    if (lastProjectCrossFileParsedV269) {
      renderProbeAnalysis(lastProjectCrossFileParsedV269);
    }

    return projectCrossFileFocusPathV269;
  }

  function getProjectCrossFileAvailableFilesV269(links) {
    const files = [];
    const seen = new Set();

    (Array.isArray(links) ? links : []).forEach(function(link) {
      [link.from, link.to].forEach(function(filePath) {
        const normalized = normalizeProjectPathV265(filePath);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        files.push(normalized);
      });
    });

    return files.sort(function(a, b) {
      return a.localeCompare(b);
    });
  }

  function filterProjectCrossFileLinksByFocusV269(links, focusPath) {
    const focus = normalizeProjectPathV265(focusPath || "all");

    if (!focus || focus === "all") {
      return Array.isArray(links) ? links : [];
    }

    return (Array.isArray(links) ? links : []).filter(function(link) {
      return normalizeProjectPathV265(link.from) === focus || normalizeProjectPathV265(link.to) === focus;
    });
  }

  function renderProjectCrossFileFocusSelectV269(links, focusPath) {
    const files = getProjectCrossFileAvailableFilesV269(links);
    const current = normalizeProjectPathV265(focusPath || "all");
    const options = ['<option value="all"' + (current === "all" ? " selected" : "") + '>전체 보기</option>']
      .concat(files.map(function(filePath) {
        return '<option value="' + escapeHtml(filePath) + '"' + (current === filePath ? " selected" : "") + '>' +
          escapeHtml(filePath.replace("src/pwa/", "")) +
          '</option>';
      }));

    return '<div class="project-detail-section project-cross-file-focus-v269">' +
      '<h4>파일 중심 필터</h4>' +
      '<p class="muted">특정 파일을 선택하면 해당 파일이 보내거나 받는 연결만 좁혀서 봅니다.</p>' +
      '<label class="inline-label">기준 파일 ' +
      '<select onchange="window.ProjectAnalyzer.setCrossFileFocusV269(this.value)">' +
      options.join("") +
      '</select>' +
      '</label>' +
      '<p class="muted">현재 보기: ' + escapeHtml(current === "all" ? "전체" : current) + '</p>' +
      '</div>';
  }


  function renderProjectCrossFileLinksV265(parsed) {
    if (!parsed || parsed.inputMode !== "json") {
      return "";
    }

    lastProjectCrossFileParsedV269 = parsed;

    const allLinks = enrichProjectCrossFileLinksWithEvidenceV271(parsed, buildProjectCrossFileLinksV265(parsed));
    const availableFiles = getProjectCrossFileAvailableFilesV269(allLinks);
    let focusPath = getProjectCrossFileFocusPathV269();

    if (focusPath !== "all" && availableFiles.indexOf(focusPath) < 0) {
      focusPath = "all";
      projectCrossFileFocusPathV269 = "all";
    }

    const links = filterProjectCrossFileLinksByFocusV269(allLinks, focusPath);
    const mermaid = buildProjectCrossFileMermaidV265(links);

    if (!allLinks.length) {
      return '<div class="project-detail-section project-cross-file-links-v265">' +
        '<h3>파일 간 연결 후보</h3>' +
        '<p class="muted">JSON 리포트에서 파일 간 연결 후보를 찾지 못했습니다.</p>' +
        '</div>';
    }

    return '<div class="project-detail-section project-cross-file-links-v265 project-cross-file-links-v267 project-cross-file-links-v269">' +
      '<h3>파일 간 연결 후보</h3>' +
      '<p class="muted">프로젝트분석 영역입니다. 단일 함수 설명은 코드해석, 여러 파일 연결은 프로젝트분석에서 봅니다. V266 노이즈 필터, V267 그룹 보기, V269 파일 중심 필터를 유지하고, V271에서 연결 상세 패널을 추가했습니다.</p>' +
      renderProjectCrossFileFocusSelectV269(allLinks, focusPath) +
      '<p class="muted">표시 중인 연결: ' + escapeHtml(String(links.length)) + '개 / 전체 ' + escapeHtml(String(allLinks.length)) + '개</p>' +
      renderProjectCrossFileGroupsV267(links) +
      '<details class="project-detail-section"><summary>파일 간 연결 Mermaid 코드</summary><pre class="code-block">' +
      escapeHtml(mermaid) +
      '</pre></details>' +
      '</div>';
  }



  // PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1
  const PROJECT_CONNECTION_KIND_LABELS_V305 = {
    public_api: "전역 객체 / 공개 API",
    script_or_import: "script/import 연결",
    style_reference: "style/css 연결",
    data_reference: "data/fetch 연결",
    document_reference: "문서/html 연결",
    file_reference: "파일 참조",
    call_to_symbol: "함수 호출 후보",
    other: "기타 연결 후보"
  };

  function classifyProjectConnectionKindV305(link) {
    const kind = String((link && link.kind) || "");
    const symbol = String((link && link.symbol) || "").split("?")[0].toLowerCase();

    if (kind.indexOf("window_object") >= 0) return "public_api";

    if (kind === "file-reference") {
      if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(symbol)) return "script_or_import";
      if (/\.(css|scss|sass|less)$/.test(symbol)) return "style_reference";
      if (/\.(json|csv|tsv|yml|yaml|toml)$/.test(symbol)) return "data_reference";
      if (/\.(html|htm|md)$/.test(symbol)) return "document_reference";
      return "file_reference";
    }

    if (kind === "call-to-symbol") return "call_to_symbol";
    return "other";
  }

  function getProjectConnectionKindLabelV305(kind) {
    return PROJECT_CONNECTION_KIND_LABELS_V305[kind] || PROJECT_CONNECTION_KIND_LABELS_V305.other;
  }

  function summarizeProjectConnectionGraphV305(links) {
    const summary = {
      total: 0,
      confidence: { high: 0, medium: 0, low: 0 },
      kinds: {},
      topFiles: {}
    };

    (Array.isArray(links) ? links : []).forEach(function(link) {
      const confidence = String((link && link.confidence) || "medium");
      const kind = classifyProjectConnectionKindV305(link);
      const from = normalizeProjectPathV265(link && link.from);
      const to = normalizeProjectPathV265(link && link.to);

      summary.total += 1;
      summary.confidence[confidence] = (summary.confidence[confidence] || 0) + 1;
      summary.kinds[kind] = (summary.kinds[kind] || 0) + 1;

      [from, to].forEach(function(filePath) {
        if (!filePath) return;
        summary.topFiles[filePath] = (summary.topFiles[filePath] || 0) + 1;
      });
    });

    summary.kindRows = Object.keys(summary.kinds).map(function(kind) {
      return {
        kind: kind,
        label: getProjectConnectionKindLabelV305(kind),
        count: summary.kinds[kind]
      };
    }).sort(function(a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });

    summary.topFileRows = Object.keys(summary.topFiles).map(function(filePath) {
      return {
        filePath: filePath,
        count: summary.topFiles[filePath]
      };
    }).sort(function(a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.filePath.localeCompare(b.filePath);
    }).slice(0, 5);

    return summary;
  }

  function renderProjectConnectionCandidateNoticeV305(summary) {
    const total = summary && typeof summary.total === "number" ? summary.total : 0;

    return '<div class="project-detail-section project-connection-notice-v305">' +
      '<h4>V305 연결 후보 그래프 안내</h4>' +
      '<p class="muted">이 그래프는 import, require, script src, link href, fetch, 함수 호출명, 공개 객체명 등을 근거로 만든 후보 그래프입니다. 정밀 AST/런타임 호출 그래프가 아니라서 실제 실행 흐름과 다를 수 있습니다.</p>' +
      '<p class="muted">현재 후보 연결: ' + escapeHtml(String(total)) + '개 · high/medium/low 신뢰도와 연결 종류를 함께 봅니다.</p>' +
      '</div>';
  }

  function renderProjectConnectionSummaryCardsV305(summary) {
    if (!summary || !summary.total) {
      return "";
    }

    const confidence = summary.confidence || {};
    const kindText = (summary.kindRows || []).slice(0, 5).map(function(item) {
      return item.label + " " + item.count;
    }).join(" · ");

    const topFileText = (summary.topFileRows || []).map(function(item) {
      return item.filePath.replace("src/pwa/", "") + " " + item.count;
    }).join(" · ");

    const cards = [
      ["전체 후보", String(summary.total)],
      ["high", String(confidence.high || 0)],
      ["medium", String(confidence.medium || 0)],
      ["low", String(confidence.low || 0)],
      ["연결 종류", kindText || "-"],
      ["중심 파일", topFileText || "-"]
    ];

    return '<div class="project-connection-summary-grid-v305">' + cards.map(function(card) {
      return '<div class="project-connection-summary-card-v305">' +
        '<strong>' + escapeHtml(card[0]) + '</strong>' +
        '<span>' + escapeHtml(card[1]) + '</span>' +
        '</div>';
    }).join("") + '</div>';
  }

  function buildProjectCrossFileMermaidV305(links) {
    const items = Array.isArray(links) ? links.slice(0, 24) : [];
    const files = [];
    const idMap = {};

    function idFor(file) {
      if (!idMap[file]) {
        idMap[file] = "F" + Object.keys(idMap).length;
        files.push(file);
      }
      return idMap[file];
    }

    items.forEach(function(link) {
      idFor(link.from);
      idFor(link.to);
    });

    if (!items.length) {
      return "graph LR\n  empty[파일 간 연결 후보 없음]";
    }

    const lines = [
      "graph LR",
      "  guide[\"V305 후보 그래프<br/>정밀 AST가 아니라 연결 후보\"]"
    ];

    files.forEach(function(file) {
      const label = file.replace("src/pwa/", "");
      lines.push('  ' + idFor(file) + '["' + label.replace(/[\[\]{}()"`|]/g, " ") + '"]');
    });

    items.forEach(function(link, index) {
      const kind = classifyProjectConnectionKindV305(link);
      const confidence = String(link.confidence || "medium");
      const symbol = String(link.symbol || link.kind || "link")
        .replace(/[\[\]{}()"`|]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 36);
      const label = getProjectConnectionKindLabelV305(kind).replace(/\s+/g, " ") + " · " + confidence + (symbol ? " · " + symbol : "");

      if (index === 0) {
        lines.push("  guide -.-> " + idFor(link.from));
      }

      lines.push("  " + idFor(link.from) + " -->|" + label.slice(0, 64) + "| " + idFor(link.to));
    });

    return lines.join("\n");
  }

  const buildProjectCrossFileMermaidV265BaseV305 = buildProjectCrossFileMermaidV265;

  buildProjectCrossFileMermaidV265 = function(links) {
    return buildProjectCrossFileMermaidV305(links);
  };

  const renderProjectCrossFileLinksV265BaseV305 = renderProjectCrossFileLinksV265;

  renderProjectCrossFileLinksV265 = function(parsed) {
    const html = renderProjectCrossFileLinksV265BaseV305(parsed);

    if (!parsed || parsed.inputMode !== "json" || !html) {
      return html;
    }

    const allLinks = enrichProjectCrossFileLinksWithEvidenceV271(parsed, buildProjectCrossFileLinksV265(parsed));
    const summary = summarizeProjectConnectionGraphV305(allLinks);
    const guide = renderProjectConnectionCandidateNoticeV305(summary) + renderProjectConnectionSummaryCardsV305(summary);

    return html.replace(
      '<h3>파일 간 연결 후보</h3>',
      '<h3>파일 간 연결 후보</h3>' + guide
    );
  };

  function renderJsonReportSections(parsed) {
    if (!parsed || parsed.inputMode !== "json") {
      return "";
    }

    return [
      renderKeyFiles(parsed.keyFiles),
      renderCandidateBundles(parsed.candidateBundles),
      renderSymbolFiles(parsed.symbols),
      renderCallCandidateDetails(parsed.callCandidates),
      renderReferenceDetails(parsed.references),
      renderProjectCrossFileLinksV265(parsed)
    ].filter(Boolean).join("");
  }

  // PROJECT_ANALYZER_UX_V199_A1
  function renderProjectUsageHint(parsed) {
    const mode = parsed.inputMode || "terminal";
    const jsonReady = mode === "json";

    return '<div class="project-detail-section project-usage-hint">' +
      '<h3>붙여넣기 품질 안내</h3>' +
      '<div class="project-hint-grid">' +
      '<div class="project-hint-card"><strong>현재 입력</strong><span>' + escapeHtml(jsonReady ? "JSON report 전체" : "터미널/Markdown 출력") + '</span></div>' +
      '<div class="project-hint-card"><strong>추천 입력</strong><span>' + escapeHtml("project_probe_v199.json 전체 붙여넣기") + '</span></div>' +
      '<div class="project-hint-card"><strong>왜 필요한가</strong><span>' + escapeHtml("핵심 파일, 함수/클래스, 호출 후보, 참조 후보를 더 정확히 볼 수 있습니다.") + '</span></div>' +
      '</div>' +
      (jsonReady ? '<p class="muted">JSON report로 분석 중입니다. 기능별 파일 묶음과 상세 후보가 아래에 함께 표시됩니다.</p>' : '<p class="muted">현재 출력도 분석 가능하지만, JSON report 전체를 붙여넣으면 다음 수정에 필요한 파일 묶음이 더 선명해집니다.</p>') +
      '</div>';
  }

  function renderRecommendationCards(recommendations) {
    const items = Array.isArray(recommendations) ? recommendations : [];
    if (!items.length) {
      return '<p class="muted">추가 추천이 없습니다.</p>';
    }

    return '<div class="project-recommendation-grid">' + items.map(function(item, index) {
      return '<div class="project-recommendation-card">' +
        '<strong>' + escapeHtml("추천 " + (index + 1)) + '</strong>' +
        '<span>' + escapeHtml(item) + '</span>' +
        '</div>';
    }).join("") + '</div>';
  }

  function renderFocusFiles(parsed) {
    const bundles = parsed.candidateBundles || {};

    function firstBundle(keys) {
      for (let i = 0; i < keys.length; i += 1) {
        const value = bundles[keys[i]];
        if (Array.isArray(value) && value.length) {
          return value;
        }
      }

      return [];
    }

    const preferred = [
      ["프로젝트분석", firstBundle(["project_analyzer", "프로젝트분석"])],
      ["코드해석/다이어그램", firstBundle(["code_explainer_diagram", "코드해석/다이어그램"])],
      ["학습 카드/데이터", firstBundle(["learning_card_data", "학습 카드/데이터", "학습카드/데이터"])],
      ["검증/스모크", firstBundle(["verification_smoke", "검증/스모크", "검증"])]
    ].filter(function(item) {
      return Array.isArray(item[1]) && item[1].length;
    });

    const fallback = [
      ["프로젝트분석", ["src/pwa/index.html", "src/pwa/project_analyzer.js", "src/pwa/style.css", "tools/verify_project_analyzer_v198.py"]],
      ["코드해석/다이어그램", ["src/pwa/code_explainer.js", "src/pwa/code_explainer_rules.js", "tools/code_explainer_smoke_v171.js"]],
      ["학습 카드/데이터", ["data/lessons", "data/side_cards", "tools/validate_lessons.py"]],
      ["버전/배포", ["index.html", "src/pwa/index.html", "src/pwa/app.js"]]
    ];

    const rows = (preferred.length ? preferred : fallback).slice(0, 4);

    return '<div class="project-detail-section project-focus-files">' +
      '<h3>수정 전 같이 봐야 할 파일</h3>' +
      '<p class="muted">다음 패치에서 한 파일만 고치지 않도록, 관련 파일을 묶어서 확인합니다.</p>' +
      '<div class="project-focus-grid">' +
      rows.map(function(item) {
        return '<div class="project-focus-card">' +
          '<strong>' + escapeHtml(item[0]) + '</strong>' +
          '<span>' + escapeHtml((item[1] || []).slice(0, 8).join(" · ")) + '</span>' +
          '</div>';
      }).join("") +
      '</div>' +
      '</div>';
  }

  function buildProjectHandoff(parsed) {
    const counts = parsed.counts || {};
    const recommendations = buildRecommendations(parsed);
    const env = parsed.environment || {};
    const keyFiles = objectEntries(parsed.keyFiles || {}).map(function(item) {
      const info = item[1] || {};
      return "- " + item[0] + ": " + (info.exists ? "OK" : "MISSING");
    }).slice(0, 14);

    const lines = [
      "# python-reading-trainer 인계문서 — V244 후보 파일 묶음 정합성 개선",
      "",
      "## 현재 상태",
      "",
      "프로젝트:",
      parsed.root || "D:\\projects\\python-reading-trainer",
      "",
      "APP_VERSION:",
      PROJECT_ANALYZER_VERSION,
      "",
      "Git:",
      parsed.gitHead || "-",
      "",
      "Working tree:",
      statusLabel(parsed.gitStatus),
      "",
      "입력 방식:",
      parsed.inputMode || "terminal",
      "",
      "## 프로젝트 수치",
      "",
      "- 파일 수: " + (counts.filesTotal || "-"),
      "- lesson 파일: " + (counts.lessonFiles || "-"),
      "- side 파일: " + (counts.sideCardFiles || "-"),
      "- lesson 카드: " + (counts.lessonCards || "-"),
      "- side 카드: " + (counts.sideCards || "-"),
      "- 함수 호출 후보 파일 수: " + (parsed.callCandidateFiles || "-"),
      "",
      "## 환경 감사",
      "",
      "- Python: " + (env.pythonVersion || "-"),
      "- Git: " + (env.git || "-"),
      "- Node: " + (env.node || "-"),
      "- pip: " + (env.pip || "-"),
      "- 표준 라이브러리 only: " + (env.standardLibraryOnly ? "yes" : "no"),
      "",
      "## 핵심 파일 상태",
      "",
      keyFiles.length ? keyFiles.join("\n") : "- JSON report를 붙여넣으면 핵심 파일 상태가 더 자세히 표시됨",
      "",
      "## 다음에 같이 봐야 할 파일 묶음",
      "",
      recommendations.length ? recommendations.map(function(item) { return "- " + item; }).join("\n") : "- 추가 권장 묶음 없음",
      "",
      "## 다음 권장 작업",
      "",
      "1. 구조도 표시 위치와 Mermaid 렌더링 검증",
      "2. JSON report 붙여넣기 후 구조도, 파일 추천, 인계문서 복사 UX 확인",
      "3. 검증 통과 후 커밋, 태그, 푸시, GitHub Pages live 확인",
      "",
      "## 주의",
      "",
      "- .tmp는 probe/검증 산출물이므로 커밋하지 않는다.",
      "- 검증 전 커밋 금지.",
      "- 코드 수정 전에는 관련 기존 블록을 먼저 추출한다."
    ];

    return lines.join("\n");
  }

  async function copyProjectHandoff() {
    if (!lastHandoffText && lastParsedReport) {
      lastHandoffText = buildProjectHandoff(lastParsedReport);
    }

    if (!lastHandoffText) {
      alert("먼저 분석 결과를 생성하세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(lastHandoffText);
      alert("다음 대화창용 인계문서를 복사했습니다.");
    } catch (error) {
      alert("인계문서 복사 실패: " + String(error));
    }
  }

  function renderProbeAnalysis(parsed) {
    const summary = el("projectAnalysisSummary");
    const details = el("projectAnalysisDetails");

    if (!summary || !details) return;

    lastParsedReport = parsed;
    lastHandoffText = buildProjectHandoff(parsed);

    const counts = parsed.counts || {};
    summary.classList.remove("muted");
    summary.innerHTML =
      '<div class="project-summary-grid">' +
      '<div class="summary-card"><div class="summary-num">' + escapeHtml(counts.filesTotal || "-") + '</div><div class="summary-label">파일 수</div></div>' +
      '<div class="summary-card"><div class="summary-num">' + escapeHtml(counts.lessonFiles || "-") + '</div><div class="summary-label">lesson 파일</div></div>' +
      '<div class="summary-card"><div class="summary-num">' + escapeHtml(counts.sideCardFiles || "-") + '</div><div class="summary-label">side 파일</div></div>' +
      '<div class="summary-card"><div class="summary-num">' + escapeHtml(counts.lessonCards || "-") + '</div><div class="summary-label">lesson 카드</div></div>' +
      '</div>';

    const recommendations = buildRecommendations(parsed);

    details.innerHTML =
      '<div class="project-detail-section">' +
      '<h3>기본 상태</h3>' +
      '<p><strong>Root:</strong> ' + escapeHtml(parsed.root || "-") + '</p>' +
      '<p><strong>Git:</strong> ' + escapeHtml(parsed.gitHead || "-") + '</p>' +
      '<p><strong>Status:</strong> ' + escapeHtml(statusLabel(parsed.gitStatus)) + '</p>' +
      '<p><strong>입력 방식:</strong> ' + escapeHtml(parsed.inputMode || "terminal") + '</p>' +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>환경 감사</h3>' +
      renderEnvironmentAudit(parsed.environment) +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>역할별 파일 수</h3>' +
      renderRoleCounts(parsed.roleCounts) +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>함수 호출 후보</h3>' +
      '<p>호출 후보가 감지된 파일 수: ' + escapeHtml(parsed.callCandidateFiles || "-") + '</p>' +
      '</div>' +
      renderProjectUsageHint(parsed) +
      renderFocusFiles(parsed) +
      renderJsonReportSections(parsed) +
      '<div class="project-detail-section project-recommendations-section">' +
      '<h3>다음에 같이 봐야 할 파일 묶음</h3>' +
      renderRecommendationCards(recommendations) +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>산출 파일</h3>' +
      '<p>' + escapeHtml([parsed.outJson, parsed.outMd].filter(Boolean).join(" · ") || ".tmp/project_probe_v199_report.md") + '</p>' +
      '</div>' +
      '<div class="project-detail-section project-handoff-section">' +
      '<h3>다음 대화창 인계문서</h3>' +
      '<p class="muted">분석 결과에서 버전, Git 상태, 카드 수, 핵심 파일, 수정 전 같이 볼 파일, 다음 작업을 자동 정리합니다.</p>' +
      '<div class="project-action-row">' +
      '<button id="copyProjectHandoffBtn" type="button">인계문서 복사</button>' +
      '</div>' +
      '<pre id="projectHandoffOutput" class="code-block project-handoff-box">' + escapeHtml(lastHandoffText) + '</pre>' +
      '</div>';

    const handoffBtn = el("copyProjectHandoffBtn");
    if (handoffBtn) handoffBtn.onclick = copyProjectHandoff;

    renderProjectMermaid(parsed.mermaid);
  }

  function generateCommand() {
    const input = el("projectRootInput");
    const box = el("projectProbeCommand");
    const root = input ? input.value.trim() : "";

    if (!root) {
      alert("프로젝트 루트 경로를 입력하세요.");
      return;
    }

    localStorage.setItem(rootKey, root);
    lastCommand = buildProbeCommand(root);

    if (box) {
      box.textContent = lastCommand;
    }
  }

  async function copyCommand() {
    if (!lastCommand) {
      const box = el("projectProbeCommand");
      lastCommand = box ? box.textContent : "";
    }

    if (!lastCommand || lastCommand.includes("프로젝트 루트를 입력")) {
      alert("먼저 명령을 생성하세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(lastCommand);
      alert("프로젝트 분석 명령을 복사했습니다.");
    } catch (error) {
      alert("복사 실패: " + String(error));
    }
  }

  function analyzePastedOutput() {
    const output = el("projectProbeOutput");
    const text = output ? output.value : "";

    if (!text.trim()) {
      alert("터미널 출력이나 report.md 내용을 붙여넣으세요.");
      return;
    }

    renderProbeAnalysis(parseProbeOutput(text));
  }

  function clearProjectAnalyzer() {
    const command = el("projectProbeCommand");
    const output = el("projectProbeOutput");
    const summary = el("projectAnalysisSummary");
    const details = el("projectAnalysisDetails");
    const diagram = el("projectMermaidDiagram");
    const source = el("projectMermaidSource");
    const status = el("projectDiagramStatus");

    lastCommand = "";
    lastMermaid = "";
    lastParsedReport = null;
    lastHandoffText = "";

    if (command) command.textContent = "Enter a project root and click “Generate command”.";
    if (output) output.value = "";
    if (summary) {
      summary.classList.add("muted");
      summary.textContent = "아직 분석 결과가 없습니다.";
    }
    if (details) details.innerHTML = "";
    if (diagram) diagram.innerHTML = "";
    if (source) source.textContent = "";
    if (status) status.textContent = "Shown after analysis.";
  }

  function refresh() {
    const input = el("projectRootInput");
    if (input && !input.value) {
      input.value = localStorage.getItem(rootKey) || "D:\\projects\\python-reading-trainer";
    }
  }

  // PROJECT_ANALYZER_MERMAID_READY_V199_A1
  function rerenderProjectMermaidWhenReady() {
    if (lastParsedReport && lastParsedReport.mermaid) {
      renderProjectMermaid(lastParsedReport.mermaid);
    }
  }

  function init() {
    const generateBtn = el("generateProjectProbeBtn");
    const copyBtn = el("copyProjectProbeCommandBtn");
    const analyzeBtn = el("analyzeProjectProbeBtn");
    const clearBtn = el("clearProjectAnalyzerBtn");
    const input = el("projectRootInput");

    if (input && !input.value) {
      input.value = localStorage.getItem(rootKey) || "D:\\projects\\python-reading-trainer";
    }

    if (generateBtn) generateBtn.onclick = generateCommand;
    if (copyBtn) copyBtn.onclick = copyCommand;
    if (analyzeBtn) analyzeBtn.onclick = analyzePastedOutput;
    if (clearBtn) clearBtn.onclick = clearProjectAnalyzer;

    window.removeEventListener("mermaid-ready", rerenderProjectMermaidWhenReady);
    window.addEventListener("mermaid-ready", rerenderProjectMermaidWhenReady);

    document.removeEventListener("click", handleProjectCodeMoreToggleClick);
    document.addEventListener("click", handleProjectCodeMoreToggleClick);

    document.removeEventListener("click", handleProjectCodeBridgeClick);
    document.addEventListener("click", handleProjectCodeBridgeClick);
  }

  window.ProjectAnalyzer = {
    refresh: refresh,
    buildProbeCommand: buildProbeCommand,
    parseProbeOutput: parseProbeOutput,
    renderProbeAnalysis: renderProbeAnalysis,
    buildCodeBridgeSnippet: buildProjectCodeBridgeSnippet,
    buildCrossFileLinksV265: buildProjectCrossFileLinksV265,
    filterCrossFileLinksV266: filterAndRankProjectCrossFileLinksV266,
    groupCrossFileLinksV267: groupProjectCrossFileLinksV267,
    setCrossFileFocusV269: setProjectCrossFileFocusPathV269,
    getCrossFileFocusV269: getProjectCrossFileFocusPathV269,
    filterCrossFileLinksByFocusV269: filterProjectCrossFileLinksByFocusV269,
    getCrossFileAvailableFilesV269: getProjectCrossFileAvailableFilesV269,
    enrichCrossFileLinksWithEvidenceV271: enrichProjectCrossFileLinksWithEvidenceV271,
    renderCrossFileDetailPanelV271: renderProjectCrossFileDetailPanelV271
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
 // === PROJECT ANALYZER V248-A1 END ===

function projectAnalyzerEnglishModeV334A13A() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const queryLang = String(params.get("lang") || params.get("locale") || "").toLowerCase();
    if (queryLang === "en" || queryLang === "english") return true;

    const htmlLang = String(document.documentElement && document.documentElement.lang || "").toLowerCase();
    if (htmlLang.indexOf("en") === 0) return true;

    const bodyLang = String(document.body && (document.body.getAttribute("data-lang") || document.body.getAttribute("data-locale")) || "").toLowerCase();
    if (bodyLang === "en" || bodyLang === "english") return true;

    const keys = ["ptr_lang", "ptr_locale", "ptr_locale_v334_a10n", "language", "locale"];
    for (const key of keys) {
      const value = String(window.localStorage && window.localStorage.getItem(key) || "").toLowerCase();
      if (value === "en" || value === "english") return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

function projectAnalyzerVisiblePolishV334A13A() {
  if (!projectAnalyzerEnglishModeV334A13A()) return;

  const root =
    document.querySelector("#projectAnalyzer") ||
    document.querySelector("[data-project-analyzer]") ||
    document.body;

  if (!root) return;

  const replacements = [
    ["예: D:\\projects\\python-reading-trainer", "Example: D:\\projects\\python-reading-trainer"],
    ["프로젝트 루트를 입력하고 “명령 생성”을 누르세요.", "Enter a project root and click “Generate command”."],
    ['프로젝트 루트를 입력하고 "명령 생성"을 누르세요.', 'Enter a project root and click "Generate command".'],
    ["최신 probe 터미널 출력(PROJECT_PROBE_V248_OK 또는 PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, 또는 JSON 전체 내용을 붙여넣으세요.", "Paste the latest probe terminal output (PROJECT_PROBE_V248_OK or PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, or the full JSON content."],
    ["4. 구조도", "4. Structure diagram"],
    ["구조도", "Structure diagram"],
    ["분석 후 표시됩니다.", "Shown after analysis."],
    ["명령 생성", "Generate command"],
    ["최신", "latest"],
    ["터미널 출력", "terminal output"],
    ["또는", "or"],
    ["전체 내용", "full content"]
  ];

  const elements = root.querySelectorAll("textarea, input, button, select, option, [placeholder], [title], [aria-label]");
  Array.prototype.forEach.call(elements, function(element) {
    ["placeholder", "title", "aria-label", "value"].forEach(function(attr) {
      if (!element.hasAttribute || !element.hasAttribute(attr)) return;
      let value = element.getAttribute(attr) || "";
      if (!/[가-힣]/.test(value)) return;
      replacements.forEach(function(pair) {
        value = value.split(pair[0]).join(pair[1]);
      });
      element.setAttribute(attr, value);
    });
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      const parent = node && node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName ? parent.tagName.toLowerCase() : "";
      if (tag === "textarea" || tag === "input" || tag === "script" || tag === "style") {
        return NodeFilter.FILTER_REJECT;
      }
      const value = node.nodeValue || "";
      if (!/[가-힣]/.test(value)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function(node) {
    let text = node.nodeValue || "";
    replacements.forEach(function(pair) {
      text = text.split(pair[0]).join(pair[1]);
    });
    node.nodeValue = text;
  });
}

function projectAnalyzerScheduleVisiblePolishV334A13A() {
  if (!projectAnalyzerEnglishModeV334A13A()) return;
  [0, 60, 180, 500, 1000].forEach(function(delay) {
    window.setTimeout(projectAnalyzerVisiblePolishV334A13A, delay);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", projectAnalyzerScheduleVisiblePolishV334A13A);
  } else {
    projectAnalyzerScheduleVisiblePolishV334A13A();
  }

  document.addEventListener("click", function(event) {
    const text = String(event && event.target && event.target.textContent || "");
    if (/Project analyzer|Generate command|Analyze pasted output|Reset|Copy command/.test(text)) {
      projectAnalyzerScheduleVisiblePolishV334A13A();
    }
  }, true);

  document.addEventListener("focusin", projectAnalyzerScheduleVisiblePolishV334A13A, true);
}
