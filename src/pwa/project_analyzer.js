// === PROJECT ANALYZER V193-A1 START ===
(function() {
  const PROJECT_ANALYZER_VERSION = "20260606_v193_a1";
  const rootKey = "python-reading-trainer-project-root-v193";
  let lastCommand = "";
  let lastMermaid = "";

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
"from datetime import datetime",
"",
"ROOT = Path('.').resolve()",
"OUT_DIR = ROOT / '.tmp'",
"OUT_JSON = OUT_DIR / 'project_probe_v193.json'",
"OUT_MD = OUT_DIR / 'project_probe_v193_report.md'",
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
"    elif ext == '.py':",
"        s = extract_py_symbols(text)",
"        if s:",
"            symbols[f['path']] = s",
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
"    'symbols': symbols,",
"    'references': references,",
"    'json_errors': {'lesson_errors': lesson_bad, 'side_card_errors': side_bad},",
"    'mermaid': '\\n'.join(mermaid_lines),",
"}",
"",
"OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')",
"md = []",
"md.append('# Project Probe V193')",
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
"md.append('## Mermaid')",
"md.extend(mermaid_lines)",
"md.append('')",
"md.append('## Output files')",
"md.append('- ' + rel(OUT_JSON))",
"md.append('- ' + rel(OUT_MD))",
"OUT_MD.write_text('\\n'.join(md), encoding='utf-8')",
"",
"print('PROJECT_PROBE_V193_OK')",
"print('ROOT', ROOT)",
"print('GIT_HEAD', report['git']['head'])",
"print('GIT_STATUS', report['git']['status_short'] or 'clean')",
"print('FILES_TOTAL', report['counts']['files_total'])",
"print('LESSON_FILES', report['counts']['lesson_files'])",
"print('SIDE_CARD_FILES', report['counts']['side_card_files'])",
"print('LESSON_CARDS_ESTIMATED', report['counts']['lesson_cards_estimated'])",
"print('SIDE_CARDS_ESTIMATED', report['counts']['side_cards_estimated'])",
"print('ROLE_COUNTS', json.dumps(report['role_counts'], ensure_ascii=False))",
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
      "@'",
      pythonCode,
      "'@ | Set-Content .\\.tmp\\project_probe_v193_from_app.py -Encoding UTF8",
      "",
      "python .\\.tmp\\project_probe_v193_from_app.py",
      "",
      '"`n=== REPORT PREVIEW ==="',
      "Get-Content .\\.tmp\\project_probe_v193_report.md -Encoding UTF8 -TotalCount 220"
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

  function parseProbeOutput(text) {
    const raw = String(text || "");
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
      ok: raw.includes("PROJECT_PROBE_V193_OK") || raw.includes("# Project Probe V193"),
      root: getLineValue(raw, "ROOT") || (raw.match(/- root: `([^`]+)`/) || [])[1] || "",
      gitHead: getLineValue(raw, "GIT_HEAD") || (raw.match(/- git_head: `([^`]+)`/) || [])[1] || "",
      gitStatus: getLineValue(raw, "GIT_STATUS") || (raw.match(/- git_status_short: `([^`]+)`/) || [])[1] || "",
      outJson: getLineValue(raw, "OUT_JSON"),
      outMd: getLineValue(raw, "OUT_MD"),
      counts: counts,
      roleCounts: roleCounts,
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

  function buildRecommendations(parsed) {
    const items = [];

    items.push("프로젝트 수정 전에는 probe 출력의 핵심 파일 묶음을 먼저 확인하세요.");
    items.push("코드해석/다이어그램 수정 시 src/pwa/index.html, code_explainer.js, code_explainer_rules.js, style.css, smoke/verify 스크립트를 같이 봐야 합니다.");
    items.push("학습 카드 수정 시 data/lessons, data/side_cards, tools/validate_lessons.py를 함께 검증해야 합니다.");

    if (String(parsed.gitStatus || "").includes("?? .tmp/")) {
      items.push(".tmp는 probe 산출물이므로 커밋하지 말고 마지막에 삭제하세요.");
    }

    if (!parsed.ok) {
      items.push("PROJECT_PROBE_V193_OK 또는 # Project Probe V193가 보이지 않습니다. 출력이 잘렸을 수 있습니다.");
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

  function renderProbeAnalysis(parsed) {
    const summary = el("projectAnalysisSummary");
    const details = el("projectAnalysisDetails");

    if (!summary || !details) return;

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
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>역할별 파일 수</h3>' +
      renderRoleCounts(parsed.roleCounts) +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>다음에 같이 봐야 할 파일 묶음</h3>' +
      '<ul>' + recommendations.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join("") + '</ul>' +
      '</div>' +
      '<div class="project-detail-section">' +
      '<h3>산출 파일</h3>' +
      '<p>' + escapeHtml([parsed.outJson, parsed.outMd].filter(Boolean).join(" · ") || ".tmp/project_probe_v193_report.md") + '</p>' +
      '</div>';

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
 // === PROJECT ANALYZER V193-A1 END ===
