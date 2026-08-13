(function(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.WorkedExampleQualityV355 = api;
  if (root && root.document) api.install(root);
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : null), function() {
  "use strict";

  const VERSION = "v355_a1";

  function row(code, output, token) {
    return Object.freeze({ code: code, output: output, token: token });
  }

  const EXAMPLES = Object.freeze({
    print: row('message = "ready"\nprint(message)', 'ready', 'print('),
    len: row('word = "python"\nvalues = [4, 7, 9]\nprint(len(word))\nprint(len(values))', '6\n3', 'len('),
    variable: row('city = "Seoul"\nprint(city)', 'Seoul', 'city ='),
    assignment: row('count = 4\ncount = 9\nprint(count)', '9', 'count ='),
    type: row('number = 8\nword = "hello"\nprint(type(number))\nprint(type(word))', "<class 'int'>\n<class 'str'>", 'type('),
    str: row('word = "hello"\nprint(word + "!")', 'hello!', '"hello"'),
    int: row('number = int("12")\nprint(number + 3)', '15', 'int('),
    float: row('price = float("2.5")\nprint(price + 0.5)', '3.0', 'float('),
    bool: row('ready = 7 > 3\nprint(ready)', 'True', 'ready ='),
    list: row('colors = ["red", "blue", "green"]\nprint(colors[1])', 'blue', '['),
    dict: row('user = {"name": "Alex", "age": 20}\nprint(user["name"])', 'Alex', '{'),
    set: row('tags = {"python", "python", "web"}\nprint(len(tags))', '2', '{'),
    tuple: row('point = (4, 9)\nprint(point[1])', '9', '('),
    get: row('profile = {"name": "Alex"}\nprint(profile.get("city", "unknown"))', 'unknown', '.get('),
    append: row('numbers = [1, 2]\nnumbers.append(5)\nprint(numbers)', '[1, 2, 5]', '.append('),
    for: row('for letter in ["A", "B"]:\n    print(letter)', 'A\nB', 'for '),
    range: row('for number in range(3):\n    print(number)', '0\n1\n2', 'range('),
    while: row('number = 1\nwhile number <= 3:\n    print(number)\n    number += 1', '1\n2\n3', 'while '),
    if: row('score = 72\nif score >= 60:\n    print("pass")', 'pass', 'if '),
    function: row('def greet(name):\n    print("Hi", name)\n\ngreet("Alex")', 'Hi Alex', 'def '),
    def: row('def greet(name):\n    print("Hi", name)\n\ngreet("Alex")', 'Hi Alex', 'def '),
    parameter: row('def double(number):\n    print(number * 2)\n\ndouble(6)', '12', 'def '),
    argument: row('def greet(name):\n    print("Hello", name)\n\ngreet("Sam")', 'Hello Sam', 'greet('),
    return: row('def square(number):\n    return number * number\n\nprint(square(4))', '16', 'return '),
    scope: row('def show_name():\n    name = "Mina"\n    print(name)\n\nshow_name()', 'Mina', 'def '),
    method: row('word = "  hello  "\nprint(word.strip())', 'hello', '.strip('),
    mutable: row('items = ["A"]\nitems.append("B")\nprint(items)', "['A', 'B']", '.append('),
    iterable: row('for letter in "cat":\n    print(letter)', 'c\na\nt', 'for '),
    comment: row('# 이 줄은 실행되지 않습니다.\nprint("hello")', 'hello', '#'),
    output: row('print("Python")\nprint(2 + 3)', 'Python\n5', 'print('),
    execution_order: row('value = 2\nvalue = value + 5\nprint(value)', '7', 'print('),
    None: row('result = None\nprint(result)', 'None', 'None'),
    class: row('class Dog:\n    pass\n\ndog = Dog()\nprint(type(dog).__name__)', 'Dog', 'class '),
    object: row('class Dog:\n    pass\n\ndog = Dog()\nprint(type(dog).__name__)', 'Dog', 'Dog('),
    import: row('import math\nprint(math.floor(3.8))', '3', 'import '),
    module: row('import math\nprint(math.sqrt(25))', '5.0', 'import math'),
    pathlib: row('from pathlib import Path\npath = Path("data/report.json")\nprint(path.name)', 'report.json', 'Path('),
    "json.loads": row('import json\ntext = "{\\"score\\": 7}"\ndata = json.loads(text)\nprint(data["score"])', '7', 'json.loads('),
    "json.dumps": row('import json\ndata = {"name": "Alex"}\nprint(json.dumps(data))', '{"name": "Alex"}', 'json.dumps('),
    exception: row('try:\n    int("hello")\nexcept ValueError:\n    print("invalid number")', 'invalid number', 'try:'),
    try_except: row('try:\n    int("hello")\nexcept ValueError:\n    print("invalid number")', 'invalid number', 'try:'),
    main: row('def main():\n    print("start")\n\nif __name__ == "__main__":\n    main()', 'start', 'if __name__')
  });

  const ALTERNATES = Object.freeze({
    print: row('status = "done"\nprint(status)', 'done', 'print('),
    len: row('word = "learn"\nvalues = [2, 4]\nprint(len(word))\nprint(len(values))', '5\n2', 'len('),
    variable: row('language = "Python"\nprint(language)', 'Python', 'language ='),
    assignment: row('count = 2\ncount = 11\nprint(count)', '11', 'count ='),
    type: row('score = 42\nname = "Mina"\nprint(type(score))\nprint(type(name))', "<class 'int'>\n<class 'str'>", 'type('),
    str: row('word = "python"\nprint(word + "?")', 'python?', '"python"'),
    int: row('number = int("20")\nprint(number + 2)', '22', 'int('),
    float: row('price = float("1.25")\nprint(price + 0.75)', '2.0', 'float('),
    bool: row('ready = 2 == 5\nprint(ready)', 'False', 'ready ='),
    list: row('animals = ["cat", "dog"]\nprint(animals[0])', 'cat', '['),
    dict: row('product = {"title": "Book", "price": 12}\nprint(product["title"])', 'Book', '{'),
    set: row('tags = {"a", "a", "b", "c"}\nprint(len(tags))', '3', '{'),
    tuple: row('point = (7, 12)\nprint(point[0])', '7', '('),
    get: row('config = {"mode": "dark"}\nprint(config.get("theme", "light"))', 'light', '.get('),
    append: row('numbers = [3, 4]\nnumbers.append(8)\nprint(numbers)', '[3, 4, 8]', '.append('),
    for: row('for letter in ["X", "Y"]:\n    print(letter)', 'X\nY', 'for '),
    range: row('for number in range(2, 5):\n    print(number)', '2\n3\n4', 'range('),
    while: row('number = 2\nwhile number <= 4:\n    print(number)\n    number += 1', '2\n3\n4', 'while '),
    if: row('temperature = 18\nif temperature < 20:\n    print("cold")', 'cold', 'if '),
    function: row('def greet(name):\n    print("Welcome", name)\n\ngreet("Mina")', 'Welcome Mina', 'def '),
    def: row('def greet(name):\n    print("Welcome", name)\n\ngreet("Mina")', 'Welcome Mina', 'def '),
    parameter: row('def add_one(number):\n    print(number + 1)\n\nadd_one(9)', '10', 'def '),
    argument: row('def greet(name):\n    print("Hello", name)\n\ngreet("Mina")', 'Hello Mina', 'greet('),
    return: row('def cube(number):\n    return number * number * number\n\nprint(cube(3))', '27', 'return '),
    scope: row('def show_city():\n    city = "Busan"\n    print(city)\n\nshow_city()', 'Busan', 'def '),
    method: row('word = "  python  "\nprint(word.strip())', 'python', '.strip('),
    mutable: row('items = ["X"]\nitems.append("Y")\nprint(items)', "['X', 'Y']", '.append('),
    iterable: row('for letter in "hi":\n    print(letter)', 'h\ni', 'for '),
    comment: row('# 설명용 주석입니다.\nprint("world")', 'world', '#'),
    output: row('print("Ready")\nprint(10 - 4)', 'Ready\n6', 'print('),
    execution_order: row('value = 10\nvalue = value - 3\nprint(value)', '7', 'print('),
    None: row('item = None\nprint(item)', 'None', 'None'),
    class: row('class Cat:\n    pass\n\ncat = Cat()\nprint(type(cat).__name__)', 'Cat', 'class '),
    object: row('class Cat:\n    pass\n\ncat = Cat()\nprint(type(cat).__name__)', 'Cat', 'Cat('),
    import: row('import math\nprint(math.ceil(3.2))', '4', 'import '),
    module: row('import math\nprint(math.sqrt(16))', '4.0', 'import math'),
    pathlib: row('from pathlib import Path\npath = Path("notes/todo.txt")\nprint(path.suffix)', '.txt', 'Path('),
    "json.loads": row('import json\ntext = "{\\"score\\": 11}"\ndata = json.loads(text)\nprint(data["score"])', '11', 'json.loads('),
    "json.dumps": row('import json\ndata = {"age": 20}\nprint(json.dumps(data))', '{"age": 20}', 'json.dumps('),
    exception: row('try:\n    int("oops")\nexcept ValueError:\n    print("invalid")', 'invalid', 'try:'),
    try_except: row('try:\n    float("x")\nexcept ValueError:\n    print("bad value")', 'bad value', 'try:'),
    main: row('def main():\n    print("ready")\n\nif __name__ == "__main__":\n    main()', 'ready', 'if __name__')
  });

  const CURRENT_CARD_NAMED_SYNTAX = Object.freeze([
    ["json.loads", /\bjson\.loads\s*\(/], ["json.dumps", /\bjson\.dumps\s*\(/],
    ["print", /\bprint\s*\(/], ["len", /\blen\s*\(/], ["range", /\brange\s*\(/],
    ["append", /\.append\s*\(/], ["get", /\.get\s*\(/], ["open", /\bopen\s*\(/],
    ["with", /\bwith\b/], ["def", /\bdef\b/], ["return", /\breturn\b/],
    ["for", /\bfor\b/], ["while", /\bwhile\b/], ["if", /\b(?:if|elif|else)\b/],
    ["class", /\bclass\b/], ["import", /\b(?:import|from)\b/],
    ["try_except", /\b(?:try|except)\b/], ["bool", /\b(?:True|False)\b/], ["None", /\bNone\b/]
  ]);

  function t(win, ko, en) { return win.document.documentElement.lang === "en" ? en : ko; }

  function primaryConcept(win, card, conceptInfoValue, engine, override) {
    if (override) return override;
    try {
      if (win.ContentQualitySemantics && typeof win.ContentQualitySemantics.pickPrimaryConcept === "function") {
        return win.ContentQualitySemantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfoValue || {});
      }
    } catch (_) {}
    try { return engine.pickPrimaryConcept(card || {}, conceptInfoValue || {}); }
    catch (_) { return card && Array.isArray(card.concepts) ? card.concepts[0] || "" : ""; }
  }

  function allowedWithCurrentCardSyntax(engine, cardsValue, index, card) {
    const allowed = new Set(engine.allowedConceptsAt(cardsValue || [], index));
    const problemCode = String(card && card.code || "");
    CURRENT_CARD_NAMED_SYNTAX.forEach(function(entry) { if (entry[1].test(problemCode)) allowed.add(entry[0]); });
    return allowed;
  }

  function validateCurated(engine, card, cardsValue, index, primary, curated) {
    if (!engine || !curated || !curated.code || !curated.output) return false;
    if (curated.token && curated.code.indexOf(curated.token) < 0) return false;
    if (!engine.isWorkedExampleDistinct(String(card && card.code || ""), curated.code)) return false;
    try {
      const allowed = allowedWithCurrentCardSyntax(engine, cardsValue, index, card);
      if (!engine.exampleUsesOnlyKnownNamedSyntax(curated.code, allowed)) return false;
    } catch (_) { return false; }
    return !!primary;
  }

  function variantsFor(primary) {
    return [EXAMPLES[primary], ALTERNATES[primary]].filter(Boolean);
  }

  function chooseCurated(engine, card, cardsValue, index, primary) {
    const variants = variantsFor(primary);
    for (let i = 0; i < variants.length; i += 1) {
      if (validateCurated(engine, card, cardsValue, index, primary, variants[i])) return variants[i];
    }
    return null;
  }

  function patchEngine(win) {
    const engine = win.LearningEngineV340;
    if (!engine || typeof engine.pickSafeExample !== "function") return false;
    if (engine.__workedExampleQualityV355Patched) return true;
    engine.pickSafeExample = function(card, cardsValue, index, conceptInfoValue, primaryOverride) {
      const primary = primaryConcept(win, card, conceptInfoValue, engine, primaryOverride);
      const curated = chooseCurated(engine, card, cardsValue, index, primary);
      if (!curated) { win.__lastWorkedExampleV355 = null; return null; }
      const selected = { concept: primary, code: curated.code, output: curated.output, source: "current", quality: VERSION };
      win.__lastWorkedExampleV355 = selected;
      return selected;
    };
    engine.__workedExampleQualityV355Patched = true;
    return true;
  }

  function resultVisible(win) {
    const result = win.document.getElementById("resultBox");
    return !!result && !result.classList.contains("hidden") && !!String(result.textContent || "").trim();
  }

  function ensureBaseWorkedExample(win) {
    const box = win.document.getElementById("workedExampleV340");
    if (!box || !box.classList.contains("hidden") || !resultVisible(win)) return false;
    if (typeof win.renderWorkedExample !== "function") return false;
    try { win.renderWorkedExample(); } catch (_) { return false; }
    return !box.classList.contains("hidden");
  }

  function ensureOutputUi(win) {
    const doc = win.document;
    const box = doc.getElementById("workedExampleV340");
    if (!box) return false;
    if (box.classList.contains("hidden")) ensureBaseWorkedExample(win);
    if (box.classList.contains("hidden")) return false;
    const selected = win.__lastWorkedExampleV355;
    if (!selected || !selected.output) { box.classList.add("hidden"); box.innerHTML = ""; return false; }

    box.classList.add("worked-v355-ready");
    box.dataset.workedConceptV355 = selected.concept || "";
    const head = box.querySelector(".worked-v340-head");
    const title = head && head.querySelector("strong");
    const meta = head && head.querySelector(".muted");
    if (title && title.textContent !== t(win, "같은 문법 예제", "Same-syntax example")) title.textContent = t(win, "같은 문법 예제", "Same-syntax example");
    if (meta) meta.remove();
    const note = box.querySelector(".worked-v340-note");
    if (note) note.remove();

    let outputWrap = box.querySelector(".worked-v355-output-wrap");
    if (!outputWrap) {
      outputWrap = doc.createElement("div");
      outputWrap.className = "worked-v355-output-wrap";
      const label = doc.createElement("div"); label.className = "worked-v355-output-label";
      const pre = doc.createElement("pre"); pre.className = "worked-v355-output";
      outputWrap.appendChild(label); outputWrap.appendChild(pre); box.appendChild(outputWrap);
    }
    const label = outputWrap.querySelector(".worked-v355-output-label");
    const pre = outputWrap.querySelector(".worked-v355-output");
    const labelText = t(win, "출력", "Output");
    if (label && label.textContent !== labelText) label.textContent = labelText;
    if (pre && pre.textContent !== selected.output) pre.textContent = selected.output;
    return true;
  }

  function auditCurrentCorpus(win) {
    const engine = win.LearningEngineV340;
    let cardsValue = []; let conceptInfoValue = {};
    try { if (typeof cards !== "undefined" && Array.isArray(cards)) cardsValue = cards; } catch (_) {}
    try { if (typeof conceptInfo !== "undefined" && conceptInfo) conceptInfoValue = conceptInfo; } catch (_) {}
    const stats = { total: cardsValue.length, curated: 0, shown: 0, distinctFailures: 0, tokenFailures: 0, outputFailures: 0 };
    cardsValue.forEach(function(card, index) {
      const primary = primaryConcept(win, card, conceptInfoValue, engine, "");
      const variants = variantsFor(primary);
      if (!variants.length) return;
      stats.curated += 1;
      if (variants.some(function(v) { return !v.output; })) stats.outputFailures += 1;
      if (variants.some(function(v) { return v.token && v.code.indexOf(v.token) < 0; })) stats.tokenFailures += 1;
      if (!variants.some(function(v) { return engine.isWorkedExampleDistinct(String(card && card.code || ""), v.code); })) stats.distinctFailures += 1;
      if (chooseCurated(engine, card, cardsValue, index, primary)) stats.shown += 1;
    });
    return stats;
  }

  function install(win) {
    if (!win || !win.document) return false;
    let queued = false;
    function refresh() {
      patchEngine(win);
      ensureOutputUi(win);
      win.document.documentElement.dataset.workedExampleQualityV355 = VERSION;
    }
    function schedule() {
      if (queued) return;
      queued = true;
      win.requestAnimationFrame(function() { queued = false; refresh(); });
    }
    refresh();
    if (win.__workedExampleQualityV355Observer || !win.document.body) return true;
    const observer = new MutationObserver(schedule);
    observer.observe(win.document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    win.__workedExampleQualityV355Observer = observer;
    return true;
  }

  return {
    VERSION: VERSION, EXAMPLES: EXAMPLES, ALTERNATES: ALTERNATES,
    CURRENT_CARD_NAMED_SYNTAX: CURRENT_CARD_NAMED_SYNTAX,
    install: install, validateCurated: validateCurated, auditCurrentCorpus: auditCurrentCorpus
  };
});
