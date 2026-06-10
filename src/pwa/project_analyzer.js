// === PROJECT ANALYZER V199-A1 START ===
(function() {
  const PROJECT_ANALYZER_VERSION = "20260608_v199_a1";
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
"def extract_refs(text):",
"    refs = set()",
"    patterns = [r'src=[\\\"\\']([^\\\"\\']+)[\\\"\\']', r'href=[\\\"\\']([^\\\"\\']+)[\\\"\\']', r'fetch\\([\\\"\\']([^\\\"\\']+)[\\\"\\']', r'import\\s+.*?from\\s+[\\\"\\']([^\\\"\\']+)[\\\"\\']', r'require\\([\\\"\\']([^\\\"\\']+)[\\\"\\']\\)']",
"    for pattern in patterns:",
"        for m in re.finditer(pattern, text):",
"            refs.add(m.group(1))",
"    return sorted(refs)[:80]",
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
"md = []",
"md.append('# Project Probe V199')",
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
"for path, syms in list(symbols.items())[:20]:",
"    md.append('- ' + path + ': ' + ', '.join([s['name'] for s in syms[:12]]))",
"md.append('')",
"md.append('## Top call files')",
"for path, calls in list(call_candidates.items())[:20]:",
"    md.append('- ' + path + ': ' + ', '.join([c['name'] + '(' + str(c['count']) + ')' for c in calls[:12]]))",
"md.append('')",
"md.append('## Mermaid')",
"md.extend(mermaid_lines)",
"md.append('')",
"md.append('## Output files')",
"md.append('- ' + rel(OUT_JSON))",
"md.append('- ' + rel(OUT_MD))",
"OUT_MD.write_text('\\n'.join(md), encoding='utf-8')",
"",
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
      ok: raw.includes("PROJECT_PROBE_V199_OK") || raw.includes("PROJECT_PROBE_V198_OK") || raw.includes("PROJECT_PROBE_V197_OK") || raw.includes("PROJECT_PROBE_V195_OK") || raw.includes("PROJECT_PROBE_V193_OK") || raw.includes("# Project Probe V199") || raw.includes("# Project Probe V198") || raw.includes("# Project Probe V197") || raw.includes("# Project Probe V195") || raw.includes("# Project Probe V193"),
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
      items.push("PROJECT_PROBE_V199_OK 또는 # Project Probe V199가 보이지 않습니다. 출력이 잘렸을 수 있습니다. V198/V197 출력도 읽을 수 있지만 새 probe 실행을 권장합니다.");
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

  function renderCandidateBundles(candidateBundles) {
    return renderDataSection("기능별 파일 묶음", objectEntries(candidateBundles).slice(0, 12), function(item) {
      const files = Array.isArray(item[1]) ? item[1] : [];
      return '<div class="project-data-row"><strong>' + escapeHtml(item[0]) + '</strong><span>' + escapeHtml(files.slice(0, 12).join(" · ")) + '</span></div>';
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

  function encodeProjectCodeBridgePayload(kind, path, name, type, snippet) {
    const payload = {
      kind: kind || "call",
      path: path || "",
      name: name || "",
      type: type || ""
    };

    if (snippet) {
      payload.snippet = String(snippet).slice(0, 2400);
    }

    return encodeURIComponent(JSON.stringify(payload));
  }

  function decodeProjectCodeBridgePayload(value) {
    try {
      return JSON.parse(decodeURIComponent(String(value || "")));
    } catch (err) {
      return null;
    }
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

    const snippet = buildProjectCodeBridgeSnippet(payload.kind, payload.path, payload.name, payload.type, payload.snippet || "");
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

  function renderJsonReportSections(parsed) {
    if (!parsed || parsed.inputMode !== "json") {
      return "";
    }

    return [
      renderKeyFiles(parsed.keyFiles),
      renderCandidateBundles(parsed.candidateBundles),
      renderSymbolFiles(parsed.symbols),
      renderCallCandidateDetails(parsed.callCandidates),
      renderReferenceDetails(parsed.references)
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
    const preferred = [
      ["프로젝트분석", bundles["프로젝트분석"]],
      ["코드해석/다이어그램", bundles["코드해석/다이어그램"]],
      ["검증/스모크", bundles["검증/스모크"] || bundles["검증"]]
    ].filter(function(item) {
      return Array.isArray(item[1]) && item[1].length;
    });

    const fallback = [
      ["프로젝트분석", ["src/pwa/index.html", "src/pwa/project_analyzer.js", "src/pwa/style.css", "tools/verify_project_analyzer_v198.py"]],
      ["코드해석/다이어그램", ["src/pwa/code_explainer.js", "src/pwa/code_explainer_rules.js", "tools/code_explainer_smoke_v171.js"]],
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
      "# python-reading-trainer 인계문서 — V199 구조도 표시 개선",
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

    if (command) command.textContent = "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.";
    if (output) output.value = "";
    if (summary) {
      summary.classList.add("muted");
      summary.textContent = "아직 분석 결과가 없습니다.";
    }
    if (details) details.innerHTML = "";
    if (diagram) diagram.innerHTML = "";
    if (source) source.textContent = "";
    if (status) status.textContent = "분석 후 표시됩니다.";
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
    buildCodeBridgeSnippet: buildProjectCodeBridgeSnippet
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
 // === PROJECT ANALYZER V199-A1 END ===
