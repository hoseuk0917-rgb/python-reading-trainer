(function(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.LearningEngineV341 = api;
})(typeof window !== "undefined" ? window : globalThis, function() {
  "use strict";

  const VERSION = "v341_a2";
  const CHECKPOINT_INTERVAL = 30;
  const WEEKLY_CARD_GOAL = 50;
  const WEEKLY_DAY_GOAL = 5;

  const MASTERY_LEVELS = [
    { key: "not_started", ko: "미학습", en: "Not started", rank: 0 },
    { key: "introduced", ko: "처음 봄", en: "Introduced", rank: 1 },
    { key: "understood", ko: "이해함", en: "Understood", rank: 2 },
    { key: "variant_passed", ko: "변형 성공", en: "Variant passed", rank: 3 },
    { key: "spaced_review", ko: "간격 복습 중", en: "Spaced review", rank: 4 },
    { key: "consolidated", ko: "정착", en: "Consolidated", rank: 5 }
  ];

  const CONCEPT_FAMILY = {
    print: "output", output: "output", len: "basic",
    variable: "assignment", assignment: "assignment", reassign: "assignment", trace: "assignment",
    str: "string", string: "string", text: "string", split: "string",
    int: "number", integer: "number", float: "number", number: "number", numeric: "number",
    type: "type", value: "type", bool: "condition", comparison: "condition",
    if: "condition", elif: "condition", else: "condition", condition: "condition",
    for: "loop", while: "loop", loop: "loop", range: "loop", iteration: "loop", break: "loop", continue: "loop", accumulate: "loop",
    list: "list", index: "list", append: "list",
    dict: "dict", key: "dict", mapping: "dict", get: "dict",
    tuple: "tuple", set: "set",
    def: "function", function: "function", call: "function", parameter: "function", argument: "function", return: "function", scope: "function",
    class: "object", object: "object", method: "object", self: "object", mutable: "object",
    import: "module", module: "module", package: "module",
    file: "file", open: "file", path: "file", pathlib: "file", encoding: "file", csv: "file", json: "file", "json.loads": "file", "json.dumps": "file",
    exception: "exception", error: "exception", raise: "exception", try_except: "exception",
    input: "input", indentation: "indentation", comment: "comment", none: "none",
    with: "file", enumerate: "loop", zip: "loop", sorted: "list", finally: "exception"
  };

  const PRACTICE_MODULES = [
    {
      id: "basics",
      ko: "값·자료형·출력 읽기",
      en: "Values, types, and output",
      descriptionKo: "변수에 어떤 값이 들어가고 표현식이 어떤 결과를 만드는지 한 줄씩 추적합니다.",
      descriptionEn: "Trace values, expressions, and output one line at a time.",
      matchConcepts: ["len", "print", "output", "variable", "assignment", "str", "string", "int", "float", "number", "type", "bool", "comment", "input", "none"],
      matchFamilies: ["output", "assignment", "string", "number", "type", "input", "comment", "none"]
    },
    {
      id: "condition",
      ko: "조건 흐름 추적",
      en: "Conditional flow tracing",
      descriptionKo: "조건이 참인지 거짓인지 판단하고 실제로 실행되는 분기만 따라갑니다.",
      descriptionEn: "Evaluate conditions and follow only the branch that actually runs.",
      matchConcepts: ["if", "elif", "else", "comparison", "bool", "condition"],
      matchFamilies: ["condition"]
    },
    {
      id: "loop",
      ko: "반복 흐름 추적",
      en: "Loop flow tracing",
      descriptionKo: "반복 횟수와 매 회차 값 변화를 추적해 마지막 상태를 예측합니다.",
      descriptionEn: "Trace iteration counts and value changes to predict the final state.",
      matchConcepts: ["for", "while", "range", "break", "continue", "loop", "iteration"],
      matchFamilies: ["loop"]
    },
    {
      id: "collections",
      ko: "컬렉션 읽기",
      en: "Collection reading",
      descriptionKo: "list·dict·tuple·set에서 어떤 값이 선택되고 바뀌는지 읽습니다.",
      descriptionEn: "Read how values are selected and changed in lists, dicts, tuples, and sets.",
      matchConcepts: ["list", "index", "append", "dict", "key", "get", "tuple", "set"],
      matchFamilies: ["list", "dict", "tuple", "set"]
    },
    {
      id: "functions",
      ko: "함수 호출과 반환",
      en: "Function calls and returns",
      descriptionKo: "인자가 어디로 들어가고 return 값이 어디로 돌아오는지 호출 순서대로 읽습니다.",
      descriptionEn: "Follow arguments into functions and return values back to their callers.",
      matchConcepts: ["def", "function", "call", "parameter", "argument", "return", "scope"],
      matchFamilies: ["function"]
    },
    {
      id: "file_error",
      ko: "파일·경로·예외 처리",
      en: "Files, paths, and exceptions",
      descriptionKo: "파일을 여는 과정과 실패했을 때 예외가 어디에서 처리되는지 추적합니다.",
      descriptionEn: "Trace file operations and where failures are handled.",
      matchConcepts: ["file", "open", "path", "pathlib", "encoding", "exception", "error", "raise", "try_except"],
      matchFamilies: ["file", "exception"]
    },
    {
      id: "object_module",
      ko: "객체·모듈 코드 읽기",
      en: "Objects and modules",
      descriptionKo: "class·method·import가 코드 구조를 어떻게 나누는지 실제 호출 관계로 읽습니다.",
      descriptionEn: "Read how classes, methods, and imports organize actual call relationships.",
      matchConcepts: ["class", "object", "method", "self", "import", "module", "package"],
      matchFamilies: ["object", "module"]
    },
    {
      id: "data_tools",
      ko: "데이터·도구 코드 읽기",
      en: "Data and tool code",
      descriptionKo: "JSON·CSV·정규식·CLI·외부 라이브러리처럼 실무에서 자주 만나는 코드를 읽습니다.",
      descriptionEn: "Read practical code using JSON, CSV, regex, CLI tools, and common libraries.",
      matchConcepts: ["json", "json.loads", "json.dumps", "csv", "pandas", "requests", "datetime", "regex", "argparse", "pathlib"],
      matchFamilies: []
    }
  ];

  const PRACTICE_TEMPLATES = [
    {
      id: "len_count", moduleId: "basics", kind: "output_prediction",
      requires: [["len"], ["list"], ["print", "output"]],
      code: 'items = ["A", "B", "C"]\nprint(len(items))',
      questionKo: "이 코드를 실행하면 무엇이 출력될까요?",
      questionEn: "What will this code print?",
      choicesKo: ["3", "2", "[\"A\", \"B\", \"C\"]"],
      choicesEn: ["3", "2", "[\"A\", \"B\", \"C\"]"],
      answerIndex: 0,
      explainKo: "len(items)는 리스트 안의 항목 수 3을 돌려주고 print()가 그 값을 출력합니다.",
      explainEn: "len(items) returns the three-item count, and print() displays that value."
    },
    {
      id: "reassign_value", moduleId: "basics", kind: "value_trace",
      requires: [["variable", "assignment", "reassign"], ["print", "output"]],
      code: "count = 2\ncount = count + 3\nprint(count)",
      questionKo: "마지막 줄에서 count의 값은 무엇일까요?",
      questionEn: "What is the value of count on the final line?",
      choicesKo: ["2", "5", "23"],
      choicesEn: ["2", "5", "23"],
      answerIndex: 1,
      explainKo: "두 번째 줄은 기존 2에 3을 더한 5를 count에 다시 저장합니다.",
      explainEn: "The second line adds 3 to the old value 2 and stores 5 back in count."
    },
    {
      id: "string_join", moduleId: "basics", kind: "output_prediction",
      requires: [["str", "string"], ["print", "output"]],
      code: 'left = "Py"\nright = "thon"\nprint(left + right)',
      questionKo: "+ 연산 뒤 출력되는 문자열은 무엇일까요?",
      questionEn: "Which string is printed after the + operation?",
      choicesKo: ["Py thon", "Python", "Py+thon"],
      choicesEn: ["Py thon", "Python", "Py+thon"],
      answerIndex: 1,
      explainKo: "문자열끼리 +를 사용하면 사이에 공백을 자동으로 넣지 않고 그대로 이어 붙입니다.",
      explainEn: "Using + on strings joins them directly without automatically inserting a space."
    },
    {
      id: "comment_effect", moduleId: "basics", kind: "code_reading",
      requires: [["comment"], ["print", "output"]],
      code: '# print("A")\nprint("B")',
      questionKo: "실제로 실행되어 출력되는 값은 무엇일까요?",
      questionEn: "Which value is actually executed and printed?",
      choicesKo: ["A", "B", "A와 B 모두"],
      choicesEn: ["A", "B", "Both A and B"],
      answerIndex: 1,
      explainKo: "#로 시작한 첫 줄은 주석이므로 실행되지 않고 두 번째 print()만 실행됩니다.",
      explainEn: "The first line starts with #, so it is a comment and only the second print() runs."
    },
    {
      id: "if_branch", moduleId: "condition", kind: "branch_trace",
      requires: [["if", "condition"], ["print", "output"]],
      code: 'score = 7\nif score >= 5:\n    print("pass")\nelse:\n    print("retry")',
      questionKo: "조건을 계산한 뒤 실제로 실행되는 분기는 어느 쪽일까요?",
      questionEn: "After evaluating the condition, which branch actually runs?",
      choicesKo: ["pass 분기", "retry 분기", "두 분기 모두"],
      choicesEn: ["The pass branch", "The retry branch", "Both branches"],
      answerIndex: 0,
      explainKo: "7 >= 5는 참이므로 if 블록만 실행되고 else 블록은 건너뜁니다.",
      explainEn: "7 >= 5 is true, so only the if block runs and the else block is skipped."
    },
    {
      id: "if_false_branch", moduleId: "condition", kind: "branch_trace",
      requires: [["if", "condition"], ["print", "output"]],
      code: 'temperature = 18\nif temperature >= 20:\n    print("warm")\nelse:\n    print("cool")',
      questionKo: "조건을 계산한 뒤 실제로 출력되는 값은 무엇일까요?",
      questionEn: "After evaluating the condition, what is actually printed?",
      choicesKo: ["warm", "cool", "둘 다"],
      choicesEn: ["warm", "cool", "Both"],
      answerIndex: 1,
      explainKo: "18 >= 20은 거짓이므로 if 블록을 건너뛰고 else 블록의 cool을 출력합니다.",
      explainEn: "18 >= 20 is false, so the if block is skipped and the else branch prints cool."
    },
    {
      id: "if_value_after_branch", moduleId: "condition", kind: "value_trace",
      requires: [["if", "condition"], ["variable", "assignment"], ["print", "output"]],
      code: 'count = 2\nif count > 0:\n    label = "ready"\nelse:\n    label = "empty"\nprint(label)',
      questionKo: "마지막 줄에서 출력되는 label 값은 무엇일까요?",
      questionEn: "Which label value is printed on the last line?",
      choicesKo: ["ready", "empty", "2"],
      choicesEn: ["ready", "empty", "2"],
      answerIndex: 0,
      explainKo: "count > 0이 참이므로 label에 ready가 저장되고 마지막 print가 그 값을 출력합니다.",
      explainEn: "count > 0 is true, so label becomes ready and the final print displays it."
    },
    {
      id: "elif_route", moduleId: "condition", kind: "branch_trace",
      requires: [["if", "condition"], ["elif"], ["print", "output"]],
      code: 'score = 70\nif score >= 90:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")',
      questionKo: "위에서부터 조건을 검사할 때 실제로 선택되는 분기는 무엇일까요?",
      questionEn: "Which branch is selected when conditions are checked from top to bottom?",
      choicesKo: ["A", "B", "C"],
      choicesEn: ["A", "B", "C"],
      answerIndex: 1,
      explainKo: "첫 조건은 거짓이고 70 >= 60은 참이므로 elif 분기의 B가 출력됩니다.",
      explainEn: "The first condition is false and 70 >= 60 is true, so the elif branch prints B."
    },
    {
      id: "for_sum", moduleId: "loop", kind: "loop_trace",
      requires: [["for", "loop"], ["list"], ["print", "output"]],
      code: "total = 0\nfor n in [1, 2, 3]:\n    total = total + n\nprint(total)",
      questionKo: "반복이 모두 끝난 뒤 total은 얼마일까요?",
      questionEn: "What is total after the loop finishes?",
      choicesKo: ["3", "6", "0"],
      choicesEn: ["3", "6", "0"],
      answerIndex: 1,
      explainKo: "total은 0→1→3→6 순서로 바뀌므로 마지막 값은 6입니다.",
      explainEn: "total changes 0→1→3→6, so the final value is 6."
    },
    {
      id: "range_trace", moduleId: "loop", kind: "loop_trace",
      requires: [["range"], ["for", "loop"]],
      code: "values = []\nfor n in range(3):\n    values.append(n)",
      questionKo: "반복이 끝난 뒤 values와 같은 것은 무엇일까요?",
      questionEn: "Which value matches values after the loop?",
      choicesKo: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]"],
      choicesEn: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]"],
      answerIndex: 1,
      explainKo: "range(3)은 0, 1, 2를 만들고 3은 포함하지 않습니다.",
      explainEn: "range(3) produces 0, 1, and 2; it does not include 3."
    },
    {
      id: "while_trace", moduleId: "loop", kind: "loop_trace",
      requires: [["while"], ["print", "output"]],
      code: "n = 1\nwhile n < 4:\n    n = n + 1\nprint(n)",
      questionKo: "while문이 끝난 직후 n의 값은 무엇일까요?",
      questionEn: "What is n immediately after the while loop ends?",
      choicesKo: ["3", "4", "5"],
      choicesEn: ["3", "4", "5"],
      answerIndex: 1,
      explainKo: "n이 4가 되는 순간 n < 4가 거짓이 되어 반복이 끝납니다.",
      explainEn: "When n reaches 4, n < 4 becomes false and the loop stops."
    },
    {
      id: "for_last_value", moduleId: "loop", kind: "value_trace",
      requires: [["for", "loop"], ["list"], ["print", "output"]],
      code: 'last = ""\nfor name in ["A", "B", "C"]:\n    last = name\nprint(last)',
      questionKo: "반복이 모두 끝난 뒤 last에 남아 출력되는 값은 무엇일까요?",
      questionEn: "What remains in last and is printed after the loop finishes?",
      choicesKo: ["A", "B", "C"],
      choicesEn: ["A", "B", "C"],
      answerIndex: 2,
      explainKo: "반복할 때마다 last가 현재 name으로 바뀌므로 마지막 항목 C가 남습니다.",
      explainEn: "last is replaced by the current name on every iteration, so the final item C remains."
    },
    {
      id: "break_exit", moduleId: "loop", kind: "loop_trace",
      requires: [["for", "loop"], ["range"], ["break"], ["print", "output"]],
      code: 'value = -1\nfor n in range(5):\n    value = n\n    if n == 2:\n        break\nprint(value)',
      questionKo: "break로 반복이 끝난 뒤 출력되는 value는 무엇일까요?",
      questionEn: "What value is printed after break stops the loop?",
      choicesKo: ["1", "2", "4"],
      choicesEn: ["1", "2", "4"],
      answerIndex: 1,
      explainKo: "n이 2인 회차에서 value에 2가 저장된 뒤 break가 실행되어 반복이 끝납니다.",
      explainEn: "When n reaches 2, value becomes 2 and break ends the loop."
    },
    {
      id: "continue_skip", moduleId: "loop", kind: "loop_trace",
      requires: [["for", "loop"], ["range"], ["continue"], ["print", "output"]],
      code: 'total = 0\nfor n in range(4):\n    if n == 2:\n        continue\n    total = total + n\nprint(total)',
      questionKo: "n == 2 회차를 건너뛴 뒤 total의 최종 값은 무엇일까요?",
      questionEn: "What is the final total after the n == 2 iteration is skipped?",
      choicesKo: ["4", "6", "3"],
      choicesEn: ["4", "6", "3"],
      answerIndex: 0,
      explainKo: "0, 1, 3만 더하므로 total은 4가 됩니다.",
      explainEn: "Only 0, 1, and 3 are added, so total becomes 4."
    },
    {
      id: "list_index", moduleId: "collections", kind: "collection_lookup",
      requires: [["list"]],
      code: 'items = ["red", "green", "blue"]\nselected = items[1]',
      questionKo: "selected에 저장되는 값은 무엇일까요?",
      questionEn: "Which value is stored in selected?",
      choicesKo: ["red", "green", "blue"],
      choicesEn: ["red", "green", "blue"],
      answerIndex: 1,
      explainKo: "리스트 인덱스는 0부터 시작하므로 items[1]은 두 번째 항목 green입니다.",
      explainEn: "List indexes start at 0, so items[1] is the second item, green."
    },
    {
      id: "append_change", moduleId: "collections", kind: "state_change",
      requires: [["list"], ["append"]],
      code: "items = [1, 2]\nitems.append(3)",
      questionKo: "두 번째 줄 실행 뒤 items의 상태는 무엇일까요?",
      questionEn: "What is the state of items after the second line?",
      choicesKo: ["[1, 2]", "[1, 2, 3]", "[3, 1, 2]"],
      choicesEn: ["[1, 2]", "[1, 2, 3]", "[3, 1, 2]"],
      answerIndex: 1,
      explainKo: "append(3)은 기존 리스트 끝에 3 하나를 추가합니다.",
      explainEn: "append(3) adds a single 3 to the end of the existing list."
    },
    {
      id: "dict_lookup", moduleId: "collections", kind: "collection_lookup",
      requires: [["dict"]],
      code: 'node = {"name": "LiDAR", "count": 2}\nvalue = node["name"]',
      questionKo: "value에 저장되는 값은 무엇일까요?",
      questionEn: "Which value is stored in value?",
      choicesKo: ["name", "LiDAR", "2"],
      choicesEn: ["name", "LiDAR", "2"],
      answerIndex: 1,
      explainKo: "dict의 대괄호 조회는 지정한 key에 연결된 value를 가져옵니다.",
      explainEn: "Bracket lookup on a dict returns the value connected to the requested key."
    },
    {
      id: "dict_get", moduleId: "collections", kind: "collection_lookup",
      requires: [["dict"], ["get"]],
      code: 'row = {"name": "A"}\nvalue = row.get("count", 0)',
      questionKo: "count 키가 없을 때 value는 무엇이 될까요?",
      questionEn: "What does value become when the count key is missing?",
      choicesKo: ["0", "None만 가능", "KeyError"],
      choicesEn: ["0", "It must be None", "KeyError"],
      answerIndex: 0,
      explainKo: "get()의 두 번째 인자는 키가 없을 때 사용할 기본값이므로 0이 반환됩니다.",
      explainEn: "The second argument to get() is the default used when the key is missing, so it returns 0."
    },
    {
      id: "set_dedup", moduleId: "collections", kind: "collection_reasoning",
      requires: [["set"]],
      code: "values = {1, 1, 2, 3}",
      questionKo: "이 set에 실제로 남는 서로 다른 값의 개수는 몇 개일까요?",
      questionEn: "How many distinct values remain in this set?",
      choicesKo: ["4", "3", "2"],
      choicesEn: ["4", "3", "2"],
      answerIndex: 1,
      explainKo: "set은 같은 값을 하나만 보관하므로 1, 2, 3 세 값이 남습니다.",
      explainEn: "A set keeps each equal value once, so the remaining values are 1, 2, and 3."
    },
    {
      id: "tuple_index", moduleId: "collections", kind: "collection_lookup",
      requires: [["tuple"]],
      code: 'point = (10, 20)\ny = point[1]',
      questionKo: "y에 저장되는 값은 무엇일까요?",
      questionEn: "Which value is stored in y?",
      choicesKo: ["10", "20", "1"],
      choicesEn: ["10", "20", "1"],
      answerIndex: 1,
      explainKo: "tuple도 인덱스가 0부터 시작하므로 point[1]은 두 번째 값 20입니다.",
      explainEn: "Tuple indexes also start at 0, so point[1] is the second value, 20."
    },
    {
      id: "function_return", moduleId: "functions", kind: "call_trace",
      requires: [["def", "function"], ["return"]],
      code: "def double(x):\n    return x * 2\n\nresult = double(4)",
      questionKo: "함수 호출이 끝난 뒤 result의 값은 무엇일까요?",
      questionEn: "What is result after the function call finishes?",
      choicesKo: ["4", "8", "None"],
      choicesEn: ["4", "8", "None"],
      answerIndex: 1,
      explainKo: "4가 x에 들어가고 return x * 2가 8을 호출한 곳으로 돌려줍니다.",
      explainEn: "4 is passed into x, and return x * 2 sends 8 back to the caller."
    },
    {
      id: "function_scope", moduleId: "functions", kind: "scope_trace",
      requires: [["def", "function"], ["scope"]],
      code: "x = 10\ndef change():\n    x = 3\n    return x\n\nresult = change()",
      questionKo: "change() 안의 x를 읽을 때 먼저 보는 값은 무엇일까요?",
      questionEn: "Which x is read first inside change()?",
      choicesKo: ["함수 안에서 만든 x = 3", "항상 바깥 x = 10", "x는 사용할 수 없음"],
      choicesEn: ["The local x = 3", "Always the outer x = 10", "x cannot be used"],
      answerIndex: 0,
      explainKo: "함수 안에서 x에 값을 대입했으므로 그 함수의 지역 이름 x가 먼저 사용됩니다.",
      explainEn: "Because x is assigned inside the function, that local x is used there."
    },
    {
      id: "function_parameter_flow", moduleId: "functions", kind: "call_trace",
      requires: [["def", "function"], ["parameter", "argument"], ["return"]],
      code: 'def add_tax(price):\n    return price + 1\n\nresult = add_tax(4)',
      questionKo: "4가 매개변수 price로 들어간 뒤 result에 저장되는 값은 무엇일까요?",
      questionEn: "After 4 is passed into parameter price, what is stored in result?",
      choicesKo: ["4", "5", "None"],
      choicesEn: ["4", "5", "None"],
      answerIndex: 1,
      explainKo: "호출 인자 4가 price에 들어가고 return price + 1이 5를 호출한 곳으로 돌려줍니다.",
      explainEn: "Argument 4 is bound to price, and return price + 1 sends 5 back to the caller."
    },
    {
      id: "file_with", moduleId: "file_error", kind: "resource_flow",
      requires: [["open", "file"], ["with"]],
      code: 'with open("note.txt", "r", encoding="utf-8") as f:\n    text = f.read()',
      questionKo: "with 블록을 벗어날 때 파일 객체 f는 어떻게 되는 것이 핵심일까요?",
      questionEn: "What is the key behavior of file object f when the with block ends?",
      choicesKo: ["자동으로 정리되어 닫힌다", "항상 새 파일로 복사된다", "문자열로 자동 변환된다"],
      choicesEn: ["It is cleaned up and closed", "It is always copied to a new file", "It is automatically converted to a string"],
      answerIndex: 0,
      explainKo: "with는 블록이 끝날 때 파일 같은 자원을 정리하도록 도와줍니다.",
      explainEn: "with helps clean up resources such as files when the block ends."
    },
    {
      id: "exception_route", moduleId: "file_error", kind: "exception_trace",
      requires: [["exception", "try_except", "error"]],
      code: 'try:\n    number = int("x")\nexcept ValueError:\n    number = 0',
      questionKo: "int(\"x\")에서 ValueError가 나면 다음에 실행되는 곳은 어디일까요?",
      questionEn: "If int(\"x\") raises ValueError, what runs next?",
      choicesKo: ["except ValueError 블록", "try 블록의 첫 줄부터 무한 반복", "프로그램이 반드시 바로 종료"],
      choicesEn: ["The except ValueError block", "The try block repeats forever", "The program must immediately terminate"],
      answerIndex: 0,
      explainKo: "잡도록 지정한 ValueError가 발생했으므로 해당 except 블록으로 흐름이 이동합니다.",
      explainEn: "Because ValueError is the exception being handled, control moves to that except block."
    },
    {
      id: "class_method", moduleId: "object_module", kind: "call_trace",
      requires: [["class", "object"], ["def", "function"], ["return"]],
      code: 'class Box:\n    def label(self):\n        return "box"\n\nb = Box()\nresult = b.label()',
      questionKo: "마지막 줄의 result에 들어가는 값은 무엇일까요?",
      questionEn: "Which value is stored in result on the final line?",
      choicesKo: ["Box", "box", "label"],
      choicesEn: ["Box", "box", "label"],
      answerIndex: 1,
      explainKo: "b.label()이 method 본문을 실행하고 return \"box\"가 호출 결과가 됩니다.",
      explainEn: "b.label() runs the method body and return \"box\" becomes the call result."
    },
    {
      id: "import_module", moduleId: "object_module", kind: "module_reading",
      requires: [["import", "module"]],
      code: "import math\nresult = math.sqrt(9)",
      questionKo: "math.sqrt를 읽을 때 math는 무엇을 가리킬까요?",
      questionEn: "When reading math.sqrt, what does math refer to?",
      choicesKo: ["불러온 모듈 이름", "문자열 변수", "반복문"],
      choicesEn: ["The imported module name", "A string variable", "A loop"],
      answerIndex: 0,
      explainKo: "import math가 math 모듈을 그 이름으로 사용할 수 있게 하고 sqrt는 그 모듈의 기능입니다.",
      explainEn: "import math makes the module available under that name, and sqrt is a function from it."
    },
    {
      id: "json_loads", moduleId: "data_tools", kind: "data_conversion",
      requires: [["json", "json.loads"], ["dict"]],
      code: 'import json\ntext = "{\\\"count\\\": 2}"\nrow = json.loads(text)',
      questionKo: "json.loads(text) 뒤 row의 형태에 가장 가까운 것은 무엇일까요?",
      questionEn: "After json.loads(text), which value is closest to row?",
      choicesKo: ['{"count": 2} 형태의 dict', "JSON 문자열 그대로", "파일 객체"],
      choicesEn: ['A dict like {"count": 2}', "The unchanged JSON string", "A file object"],
      answerIndex: 0,
      explainKo: "json.loads()는 JSON 문자열을 해석해 이 경우 Python dict로 바꿉니다.",
      explainEn: "json.loads() parses the JSON string into a Python dict in this case."
    },
    {
      id: "pathlib_path", moduleId: "data_tools", kind: "path_reasoning",
      requires: [["pathlib"]],
      code: 'from pathlib import Path\npath = Path("data") / "items.json"',
      questionKo: "두 번째 줄의 / 연산이 하는 일에 가장 가까운 것은 무엇일까요?",
      questionEn: "What is the / operation on the second line doing?",
      choicesKo: ["경로 조각을 이어 붙인다", "숫자 나눗셈만 수행한다", "파일 내용을 읽는다"],
      choicesEn: ["Join path parts", "Only perform numeric division", "Read the file contents"],
      answerIndex: 0,
      explainKo: "Path 객체에서 /는 경로 조각을 자연스럽게 이어 새 경로를 만드는 데 사용됩니다.",
      explainEn: "For Path objects, / joins path parts to form a new path."
    },
    {
      id: "regex_match", moduleId: "data_tools", kind: "pattern_reading",
      requires: [["regex"]],
      code: 'import re\nmatched = bool(re.fullmatch(r"\\d+", "123"))',
      questionKo: "matched 값은 무엇일까요?",
      questionEn: "What is the value of matched?",
      choicesKo: ["True", "False", "None"],
      choicesEn: ["True", "False", "None"],
      answerIndex: 0,
      explainKo: "\\d+는 숫자 문자가 하나 이상인 문자열 전체와 맞고 \"123\"은 그 조건을 만족합니다.",
      explainEn: "\\d+ matches one or more digit characters, and \"123\" satisfies the full pattern."
    }
  ];

  function normalizeConcept(value) {
    return String(value == null ? "" : value).trim().toLowerCase();
  }

  function listConcepts(card) {
    return Array.isArray(card && card.concepts) ? card.concepts.filter(Boolean) : [];
  }

  function ownValue(map, key) {
    return map && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
  }

  function familyOf(concept) {
    const key = normalizeConcept(concept);
    return ownValue(CONCEPT_FAMILY, key) || key;
  }

  function attempted(progress, cardId) {
    const p = progress || {};
    return Boolean((p.correct && p.correct[cardId]) || (p.confused && p.confused[cardId]));
  }

  function attemptedCount(cards, progress) {
    return (cards || []).filter(function(card) { return attempted(progress, card.id); }).length;
  }

  function masteryForCard(card, progress, reviewState) {
    const p = progress || {};
    const review = reviewState && reviewState[card.id] ? reviewState[card.id] : null;
    const seen = Boolean(p.seen && p.seen[card.id]);
    const correct = Boolean(p.correct && p.correct[card.id]);
    if (!seen && !correct && !attempted(p, card.id)) return MASTERY_LEVELS[0];
    if (!correct) return MASTERY_LEVELS[1];
    if (!review) return MASTERY_LEVELS[2];
    if (review.mastered) return MASTERY_LEVELS[5];
    if (Number(review.stage || 0) >= 2) return MASTERY_LEVELS[4];
    if (Number(review.stage || 0) >= 1 || review.lastResult === "correct-review") return MASTERY_LEVELS[3];
    return MASTERY_LEVELS[2];
  }

  function conceptMastery(cards, progress, reviewState, primaryResolver) {
    const map = new Map();
    (cards || []).forEach(function(card, index) {
      const concepts = listConcepts(card);
      const primary = typeof primaryResolver === "function" ? primaryResolver(card, index) : concepts[0];
      const level = masteryForCard(card, progress, reviewState);
      concepts.forEach(function(concept) {
        if (!map.has(concept)) {
          map.set(concept, { concept: concept, totalCards: 0, primaryCards: 0, attemptedCards: 0, correctCards: 0, bestRank: 0, evidenceRank: 0 });
        }
        const row = map.get(concept);
        row.totalCards += 1;
        if (concept === primary) row.primaryCards += 1;
        if (attempted(progress, card.id)) row.attemptedCards += 1;
        if (progress && progress.correct && progress.correct[card.id]) row.correctCards += 1;
        row.bestRank = Math.max(row.bestRank, level.rank);
        if (concept === primary) row.evidenceRank = Math.max(row.evidenceRank, level.rank);
      });
    });
    return Array.from(map.values()).map(function(row) {
      const rank = row.primaryCards > 0 ? row.evidenceRank : row.bestRank;
      return Object.assign({}, row, { level: MASTERY_LEVELS[Math.max(0, Math.min(rank, MASTERY_LEVELS.length - 1))] });
    }).sort(function(a, b) {
      if (b.level.rank !== a.level.rank) return b.level.rank - a.level.rank;
      if (b.attemptedCards !== a.attemptedCards) return b.attemptedCards - a.attemptedCards;
      return a.concept.localeCompare(b.concept);
    });
  }

  function unlockedCheckpointCount(count, totalCards) {
    const value = Math.max(0, Number(count || 0));
    const total = Math.max(0, Number(totalCards || 0));
    let unlocked = Math.floor(value / CHECKPOINT_INTERVAL);
    if (total > 0 && total % CHECKPOINT_INTERVAL !== 0 && value >= total) {
      unlocked = Math.max(unlocked, Math.ceil(total / CHECKPOINT_INTERVAL));
    }
    return unlocked;
  }

  function nextCheckpoint(count, totalCards) {
    const value = Math.max(0, Number(count || 0));
    const total = Math.max(0, Number(totalCards || 0));
    const unlocked = unlockedCheckpointCount(value, total);
    if (total > 0 && value >= total) {
      return { unlocked: unlocked, target: total, remaining: 0, progress: total % CHECKPOINT_INTERVAL || CHECKPOINT_INTERVAL, complete: true };
    }
    let target = (unlocked + 1) * CHECKPOINT_INTERVAL;
    if (total > 0) target = Math.min(target, total);
    const base = unlocked * CHECKPOINT_INTERVAL;
    return { unlocked: unlocked, target: target, remaining: Math.max(0, target - value), progress: Math.max(0, Math.min(CHECKPOINT_INTERVAL, value - base)), complete: false };
  }

  function primaryConceptFor(card, index, primaryResolver) {
    const resolved = typeof primaryResolver === "function" ? primaryResolver(card, index) : "";
    return normalizeConcept(resolved || listConcepts(card)[0] || "");
  }

  function buildLearningContext(cards, count, primaryResolver) {
    const rows = Array.isArray(cards) ? cards : [];
    const boundary = Math.max(0, Math.min(rows.length, Number(count || 0)));
    const concepts = new Set();
    const families = new Set();
    const primaryConcepts = [];
    const primaryFamilies = [];
    const recentConcepts = new Set();
    const recentFamilies = new Set();
    const recentStart = Math.max(0, boundary - CHECKPOINT_INTERVAL);

    for (let i = 0; i < boundary; i += 1) {
      listConcepts(rows[i]).forEach(function(concept) {
        const key = normalizeConcept(concept);
        if (!key) return;
        concepts.add(key);
        families.add(familyOf(key));
      });
      const primary = primaryConceptFor(rows[i], i, primaryResolver);
      if (primary) {
        primaryConcepts.push(primary);
        primaryFamilies.push(familyOf(primary));
        concepts.add(primary);
        families.add(familyOf(primary));
        if (i >= recentStart) {
          recentConcepts.add(primary);
          recentFamilies.add(familyOf(primary));
        }
      }
    }

    return {
      boundary: boundary,
      concepts: concepts,
      families: families,
      primaryConcepts: primaryConcepts,
      primaryFamilies: primaryFamilies,
      recentConcepts: recentConcepts,
      recentFamilies: recentFamilies
    };
  }

  function requirementMatches(group, context, recentOnly) {
    const concepts = recentOnly ? context.recentConcepts : context.concepts;
    const families = recentOnly ? context.recentFamilies : context.families;
    return (group || []).some(function(token) {
      const value = normalizeConcept(token);
      if (!value) return false;
      if (value.charAt(0) === "@") return families.has(value.slice(1));
      return concepts.has(value);
    });
  }

  function templateAvailable(template, context) {
    return (template.requires || []).every(function(group) {
      return requirementMatches(group, context, false);
    });
  }

  function templateRecencyScore(template, context) {
    let score = 0;
    (template.requires || []).forEach(function(group) {
      if (requirementMatches(group, context, true)) score += 4;
    });
    const module = PRACTICE_MODULES.find(function(row) { return row.id === template.moduleId; });
    if (module) {
      if ((module.matchFamilies || []).some(function(family) { return context.recentFamilies.has(family); })) score += 3;
      if ((module.matchConcepts || []).some(function(concept) { return context.recentConcepts.has(normalizeConcept(concept)); })) score += 3;
    }
    return score;
  }

  function simpleHash(text) {
    let h = 2166136261;
    const value = String(text || "");
    for (let i = 0; i < value.length; i += 1) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function shuffledChoices(choices, answerIndex, seed) {
    const rows = (choices || []).map(function(text, index) {
      return { text: text, correct: index === answerIndex, score: simpleHash(seed + "|" + index + "|" + text) };
    }).sort(function(a, b) { return a.score - b.score; });
    return {
      choices: rows.map(function(row) { return row.text; }),
      answerIndex: Math.max(0, rows.findIndex(function(row) { return row.correct; }))
    };
  }

  function localizeTemplate(template, locale, seed) {
    const en = locale === "en";
    const rawChoices = en ? template.choicesEn : template.choicesKo;
    const shuffled = shuffledChoices(rawChoices, template.answerIndex, seed);
    return {
      id: template.id,
      kind: template.kind,
      moduleId: template.moduleId,
      code: template.code || "",
      question: en ? template.questionEn : template.questionKo,
      choices: shuffled.choices,
      answerIndex: shuffled.answerIndex,
      explanation: en ? template.explainEn : template.explainKo
    };
  }

  function chooseTemplate(candidates, context, seed, rotationIndex) {
    if (!candidates.length) return null;
    const scored = candidates.map(function(template) {
      return { template: template, score: templateRecencyScore(template, context) };
    }).sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.template.id.localeCompare(b.template.id);
    });
    let pool = scored.filter(function(row) { return row.score > 0; });
    if (pool.length < Math.min(4, scored.length)) pool = scored.slice(0, Math.min(6, scored.length));
    pool = pool.sort(function(a, b) { return a.template.id.localeCompare(b.template.id); });
    const hasRotation = Number.isFinite(Number(rotationIndex));
    const rawIndex = hasRotation ? Math.max(0, Number(rotationIndex)) * 5 + 1 : simpleHash(seed);
    return pool[rawIndex % pool.length].template;
  }

  function fallbackMission(context, cards, locale, primaryResolver, moduleId, seed) {
    const rows = Array.isArray(cards) ? cards : [];
    const start = Math.max(0, context.boundary - CHECKPOINT_INTERVAL);
    const recent = [];
    for (let i = context.boundary - 1; i >= start; i -= 1) {
      const concept = primaryConceptFor(rows[i], i, primaryResolver);
      if (!concept) continue;
      const module = moduleId ? PRACTICE_MODULES.find(function(row) { return row.id === moduleId; }) : null;
      const family = familyOf(concept);
      if (module) {
        const matched = (module.matchConcepts || []).map(normalizeConcept).includes(concept) || (module.matchFamilies || []).includes(family);
        if (!matched) continue;
      }
      if (!recent.some(function(row) { return row.concept === concept; })) recent.push({ concept: concept, card: rows[i] });
    }
    if (!recent.length) {
      for (let i = context.boundary - 1; i >= 0; i -= 1) {
        const concept = primaryConceptFor(rows[i], i, primaryResolver);
        if (concept) { recent.push({ concept: concept, card: rows[i] }); break; }
      }
    }
    const focus = recent[0] || { concept: "python", card: null };
    const distractorPool = [];
    for (let i = context.primaryConcepts.length - 1; i >= 0; i -= 1) {
      const concept = context.primaryConcepts[i];
      if (concept !== focus.concept && !distractorPool.includes(concept)) distractorPool.push(concept);
      if (distractorPool.length >= 6) break;
    }
    const raw = [focus.concept].concat(distractorPool.slice(0, 3));
    while (raw.length < 3) raw.push(raw.length === 1 ? "value" : "flow");
    const shuffled = shuffledChoices(raw, 0, seed + "|fallback");
    return {
      id: "fallback_recent_concept",
      kind: "concept_trace",
      moduleId: moduleId || "recent",
      code: String(focus.card && focus.card.code || ""),
      question: locale === "en" ? "Which learned concept should you trace first in this code?" : "이 코드를 읽을 때 먼저 추적할 학습 개념은 무엇일까요?",
      choices: shuffled.choices,
      answerIndex: shuffled.answerIndex,
      explanation: locale === "en" ? "This checkpoint reuses a concept that already appeared in your learning sequence: " + focus.concept + "." : "이 체크포인트는 이미 학습 순서에 등장한 개념인 " + focus.concept + "을 다시 추적합니다."
    };
  }

  function missionForCheckpoint(checkpointNumber, locale, cards, primaryResolver) {
    const number = Math.max(1, Number(checkpointNumber || 1));
    const rows = Array.isArray(cards) ? cards : [];
    const context = buildLearningContext(rows, Math.min(rows.length, number * CHECKPOINT_INTERVAL), primaryResolver);
    const candidates = PRACTICE_TEMPLATES.filter(function(template) { return templateAvailable(template, context); });
    const template = chooseTemplate(candidates, context, "checkpoint:" + number, number - 1);
    const mission = template
      ? localizeTemplate(template, locale, "checkpoint:" + number + ":" + template.id)
      : fallbackMission(context, rows, locale, primaryResolver, "", "checkpoint:" + number);
    mission.checkpoint = number;
    mission.boundary = context.boundary;
    return mission;
  }

  function moduleMatches(module, concept) {
    const key = normalizeConcept(concept);
    const family = familyOf(key);
    return (module.matchConcepts || []).map(normalizeConcept).includes(key) || (module.matchFamilies || []).includes(family);
  }

  function moduleFirstIndex(module, cards, primaryResolver) {
    const rows = Array.isArray(cards) ? cards : [];
    for (let i = 0; i < rows.length; i += 1) {
      if (moduleMatches(module, primaryConceptFor(rows[i], i, primaryResolver))) return i;
    }
    return -1;
  }

  function unlockedPracticeModules(count, cards, primaryResolver) {
    const value = Math.max(0, Number(count || 0));
    return PRACTICE_MODULES.map(function(module) {
      const firstIndex = moduleFirstIndex(module, cards, primaryResolver);
      const unlockAt = firstIndex >= 0 ? firstIndex + 1 : null;
      return Object.assign({}, module, {
        unlockAt: unlockAt,
        unlocked: unlockAt != null && value >= unlockAt,
        remaining: unlockAt == null ? null : Math.max(0, unlockAt - value)
      });
    });
  }

  function missionForPracticeModule(moduleId, count, locale, cards, primaryResolver) {
    const rows = Array.isArray(cards) ? cards : [];
    const module = PRACTICE_MODULES.find(function(row) { return row.id === moduleId; });
    const context = buildLearningContext(rows, Math.min(rows.length, Math.max(0, Number(count || 0))), primaryResolver);
    if (!module) return fallbackMission(context, rows, locale, primaryResolver, "", "module:unknown:" + count);
    const candidates = PRACTICE_TEMPLATES.filter(function(template) {
      return template.moduleId === moduleId && templateAvailable(template, context);
    });
    const template = chooseTemplate(candidates, context, "module:" + moduleId + ":" + count);
    const mission = template
      ? localizeTemplate(template, locale, "module:" + moduleId + ":" + count + ":" + template.id)
      : fallbackMission(context, rows, locale, primaryResolver, moduleId, "module:" + moduleId + ":" + count);
    mission.checkpoint = 0;
    mission.boundary = context.boundary;
    mission.moduleId = moduleId;
    return mission;
  }

  function startOfWeek(now) {
    const date = new Date(now == null ? Date.now() : now);
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = (local.getDay() + 6) % 7;
    local.setDate(local.getDate() - day);
    return local.getTime();
  }

  function weeklyStatus(events, now) {
    const start = startOfWeek(now);
    const end = start + 7 * 24 * 60 * 60 * 1000;
    const rows = (Array.isArray(events) ? events : []).filter(function(event) {
      const ts = Number(event && event.at || 0);
      return ts >= start && ts < end;
    });
    const lessonAttempts = rows.filter(function(event) { return event.kind === "lesson_attempt"; });
    const daySet = new Set(lessonAttempts.map(function(event) {
      const d = new Date(Number(event.at));
      return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
    }));
    return {
      cardAttempts: lessonAttempts.length,
      studyDays: daySet.size,
      cardGoal: WEEKLY_CARD_GOAL,
      dayGoal: WEEKLY_DAY_GOAL,
      cardsComplete: lessonAttempts.length >= WEEKLY_CARD_GOAL,
      daysComplete: daySet.size >= WEEKLY_DAY_GOAL,
      complete: lessonAttempts.length >= WEEKLY_CARD_GOAL && daySet.size >= WEEKLY_DAY_GOAL
    };
  }

  function appendEvent(events, event) {
    const rows = Array.isArray(events) ? events.slice() : [];
    rows.push(Object.assign({ at: Date.now() }, event || {}));
    const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
    return rows.filter(function(row) { return Number(row.at || 0) >= cutoff; }).slice(-5000);
  }

  function completionSummary(completedCheckpoints, checkpointCount) {
    const completed = new Set((completedCheckpoints || []).map(Number));
    let passed = 0;
    for (let i = 1; i <= checkpointCount; i += 1) if (completed.has(i)) passed += 1;
    return { available: checkpointCount, passed: passed, pending: Math.max(0, checkpointCount - passed) };
  }

  return {
    VERSION: VERSION,
    CHECKPOINT_INTERVAL: CHECKPOINT_INTERVAL,
    WEEKLY_CARD_GOAL: WEEKLY_CARD_GOAL,
    WEEKLY_DAY_GOAL: WEEKLY_DAY_GOAL,
    MASTERY_LEVELS: MASTERY_LEVELS.map(function(row) { return Object.assign({}, row); }),
    PRACTICE_MODULES: PRACTICE_MODULES.map(function(row) { return Object.assign({}, row); }),
    PRACTICE_TEMPLATES: PRACTICE_TEMPLATES.map(function(row) { return Object.assign({}, row); }),
    attemptedCount: attemptedCount,
    masteryForCard: masteryForCard,
    conceptMastery: conceptMastery,
    unlockedCheckpointCount: unlockedCheckpointCount,
    nextCheckpoint: nextCheckpoint,
    buildLearningContext: buildLearningContext,
    missionForCheckpoint: missionForCheckpoint,
    unlockedPracticeModules: unlockedPracticeModules,
    missionForPracticeModule: missionForPracticeModule,
    familyOf: familyOf,
    startOfWeek: startOfWeek,
    weeklyStatus: weeklyStatus,
    appendEvent: appendEvent,
    completionSummary: completionSummary
  };
});