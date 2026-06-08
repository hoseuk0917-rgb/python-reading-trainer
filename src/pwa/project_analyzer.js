// === PROJECT ANALYZER V197-A1 START ===
(function() {
  const PROJECT_ANALYZER_VERSION = "20260608_v197_a1";
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
"OUT_JSON = OUT_DIR / 'project_probe_v197.json'",
"OUT_MD = OUT_DIR / 'project_probe_v197_report.md'",
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
"def extract_js_symbols(text):",
"    symbols = []",
"    for m in re.finditer(r'\\bfunction\\s+([A-Za-z_$][\\w$]*)\\s*\\(', text):",
"        symbols.append({'type': 'function', 'name': m.group(1)})",
"    for m in re.finditer(r'\\b(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*(?:async\\s*)?(?:function|\\([^)]*\\)\\s*=>|[A-Za-z_$][\\w$]*\\s*=>)', text):",
"        symbols.append({'type': 'function_like', 'name': m.group(1)})",
"    for m in re.finditer(r'\\bclass\\s+([A-Za-z_$][\\w$]*)', text):",
"        symbols.append({'type': 'class', 'name': m.group(1)})",
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
"            symbols.append({'type': 'function', 'name': node.name, 'line': getattr(node, 'lineno', None)})",
"        elif isinstance(node, ast.ClassDef):",
"            symbols.append({'type': 'class', 'name': node.name, 'line': getattr(node, 'lineno', None)})",
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
"    exclude = {'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof', 'new'}",
"    counts = Counter()",
"    for m in re.finditer(r'\\b([A-Za-z_$][\\w$]*)\\s*\\(', text):",
"        name = m.group(1)",
"        if name not in exclude:",
"            counts[name] += 1",
"    return [{'name': k, 'count': v} for k, v in counts.most_common(30)]",
"",
"def extract_py_calls(text):",
"    try:",
"        tree = ast.parse(text)",
"    except Exception:",
"        return []",
"    counts = Counter()",
"    for node in ast.walk(tree):",
"        if isinstance(node, ast.Call):",
"            func = node.func",
"            if isinstance(func, ast.Name):",
"                counts[func.id] += 1",
"            elif isinstance(func, ast.Attribute):",
"                counts[func.attr] += 1",
"    return [{'name': k, 'count': v} for k, v in counts.most_common(30)]",
"",
"files = []",
"for p in ROOT.rglob('*'):",
"    if p.is_file() and not should_skip(p):",
"        try:",
"            st = p.stat()",
"        except Exception:",
"            continue",
"        files.append({'path': rel(p), 'ext': p.suffix.lower() or p.name.lower(), 'size': st.st_size, 'role': classify_file(p)})",
"",
"ext_counts = Counter(f['ext'] for f in files)",
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
"    if ext == '.js':",
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
"    'candidate_bundles': {'코드해석/다이어그램': ['src/pwa/index.html', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/style.css'], '프로젝트분석': ['src/pwa/index.html', 'src/pwa/project_analyzer.js', 'src/pwa/style.css'], '학습카드 데이터': ['data/lessons', 'data/side_cards', 'tools/validate_lessons.py'], '검증/품질': verify_files},",
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
"md.append('# Project Probe V197')",
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
"print('PROJECT_PROBE_V197_OK')",
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
      "'@ | Set-Content .\\.tmp\\project_probe_v197_from_app.py -Encoding UTF8",
      "",
      "python .\\.tmp\\project_probe_v197_from_app.py",
      "",
      '"`n=== REPORT PREVIEW ==="',
      "Get-Content .\\.tmp\\project_probe_v197_report.md -Encoding UTF8 -TotalCount 220"
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

  // PROJECT_ANALYZER_CLEANUP_V197_A1
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
      ok: raw.includes("PROJECT_PROBE_V197_OK") || raw.includes("PROJECT_PROBE_V195_OK") || raw.includes("PROJECT_PROBE_V193_OK") || raw.includes("# Project Probe V197") || raw.includes("# Project Probe V195") || raw.includes("# Project Probe V193"),
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
      items.push("PROJECT_PROBE_V197_OK 또는 # Project Probe V197가 보이지 않습니다. 출력이 잘렸을 수 있습니다.");
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

  function renderSymbolFiles(symbols) {
    return renderDataSection("주요 함수/클래스", objectEntries(symbols).slice(0, 15), function(item) {
      const names = Array.isArray(item[1]) ? item[1].slice(0, 10).map(function(symbol) { return symbol.name || ""; }).filter(Boolean) : [];
      return '<div class="project-data-row"><strong>' + escapeHtml(item[0]) + '</strong><span>' + escapeHtml(names.join(" · ")) + '</span></div>';
    });
  }

  function renderCallCandidateDetails(callCandidates) {
    return renderDataSection("함수 호출 후보 상세", objectEntries(callCandidates).slice(0, 15), function(item) {
      const calls = Array.isArray(item[1]) ? item[1].slice(0, 10).map(function(call) {
        return (call.name || "") + "(" + (call.count || 0) + ")";
      }) : [];
      return '<div class="project-data-row"><strong>' + escapeHtml(item[0]) + '</strong><span>' + escapeHtml(calls.join(" · ")) + '</span></div>';
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

  function buildProjectHandoff(parsed) {
    const counts = parsed.counts || {};
    const recommendations = buildRecommendations(parsed);
    const env = parsed.environment || {};
    const keyFiles = objectEntries(parsed.keyFiles || {}).map(function(item) {
      const info = item[1] || {};
      return "- " + item[0] + ": " + (info.exists ? "OK" : "MISSING");
    }).slice(0, 14);

    const lines = [
      "# python-reading-trainer 인계문서 — V197 프로젝트분석 인계문서 자동 생성",
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
      "1. 프로젝트분석 결과 복사 / 인계문서 자동 생성 기능 검증",
      "2. JSON report 붙여넣기 안내와 기능별 파일 묶음 강조 UX 확인",
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
      '<div class="project-detail-section">' +
      '<h3>다음에 같이 봐야 할 파일 묶음</h3>' +
      '<ul>' + recommendations.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join("") + '</ul>' +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>산출 파일</h3>' +
      '<p>' + escapeHtml([parsed.outJson, parsed.outMd].filter(Boolean).join(" · ") || ".tmp/project_probe_v197_report.md") + '</p>' +
      '</div>' +
      '<div class="project-detail-section project-handoff-section">' +
      '<h3>다음 대화창 인계문서</h3>' +
      '<p class="muted">분석 결과에서 버전, Git 상태, 카드 수, 핵심 파일, 다음 작업을 자동 정리합니다.</p>' +
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
  }

  window.ProjectAnalyzer = {
    refresh: refresh,
    buildProbeCommand: buildProbeCommand,
    parseProbeOutput: parseProbeOutput,
    renderProbeAnalysis: renderProbeAnalysis
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
 // === PROJECT ANALYZER V197-A1 END ===
