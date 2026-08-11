// === CACHE BUST START ===
const APP_DATA_VERSION = "20260812_v339_quality1";
const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260812_v339_quality3";
function withDataVersion(path) {
  if (typeof path !== "string") return path;
  const versioned = path.indexOf("?") >= 0
    ? path + "&v=" + APP_DATA_VERSION
    : path + "?v=" + APP_DATA_VERSION;
  return versioned + "&cq=" + CONTENT_QUALITY_DATA_EPOCH_V339;
}
// === CACHE BUST END ===
// CONTENT_QUALITY_RELEASE_V339_R4
let curriculum = null;
let cards = [];
let sideCards = [];

// === LANGUAGE_TOGGLE_I18N_V334_A9 START ===
const LANGUAGE_STORAGE_KEY_V334_A9 = "pythonReadingTrainer.language";
const SUPPORTED_LANGUAGES_V334_A9 = ["ko", "en"];
let currentLanguage = readStoredLanguageV334A9();

function readStoredLanguageV334A9() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const queryLang = params.get("lang");
    if (SUPPORTED_LANGUAGES_V334_A9.includes(queryLang)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY_V334_A9, queryLang);
      return queryLang;
    }

    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY_V334_A9);
    if (SUPPORTED_LANGUAGES_V334_A9.includes(stored)) {
      return stored;
    }
  } catch (err) {
    console.warn("Language preference unavailable:", err);
  }

  return "ko";
}

function getLocalizedDataRootV334A9() {
  return currentLanguage === "en" ? "../../data_i18n/en" : "../../data";
}

function localizedDataPath(path) {
  return String(path || "").replace("../../data/", getLocalizedDataRootV334A9() + "/");
}

function setLanguageAndReloadV334A9(lang) {
  if (!SUPPORTED_LANGUAGES_V334_A9.includes(lang) || lang === currentLanguage) {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY_V334_A9, lang);
  } catch (err) {
    console.warn("Could not save language preference:", err);
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    url.searchParams.set("b", String(Date.now()));
    window.location.assign(url.toString());
    return;
  } catch (err) {
    console.warn("Could not update language URL:", err);
  }

  window.location.reload();
}

function findProgressResetButtonV334A9() {
  const candidates = Array.from(document.querySelectorAll("button, a, [role='button'], input, span, div"))
    .filter(function(el) {
      if (!el || el.closest("#languageToggleV334A9")) {
        return false;
      }

      const label = ((el.value || el.textContent || "") + "").replace(/\s+/g, " ").trim();
      if (!(label === "진도 초기화" || label === "Reset progress")) {
        return false;
      }

      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .sort(function(a, b) {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const aScore = Math.abs(ar.top) + Math.abs(window.innerWidth - ar.right);
      const bScore = Math.abs(br.top) + Math.abs(window.innerWidth - br.right);
      return aScore - bScore;
    });

  return candidates[0] || null;
}

function dockLanguageToggleV334A9() {
  const wrap = document.getElementById("languageToggleV334A9");
  if (!wrap) {
    return false;
  }

  const resetButton = findProgressResetButtonV334A9();
  if (resetButton && resetButton.parentElement) {
    let actions = document.getElementById("headerActionsV334A9");

    if (!actions) {
      actions = document.createElement("div");
      actions.id = "headerActionsV334A9";
      actions.style.display = "inline-flex";
      actions.style.alignItems = "center";
      actions.style.justifyContent = "flex-end";
      actions.style.gap = "8px";
      actions.style.marginLeft = "auto";

      resetButton.insertAdjacentElement("beforebegin", actions);
      actions.appendChild(resetButton);
    }

    wrap.style.display = "inline-flex";
    wrap.style.marginRight = "0";
    wrap.style.marginLeft = "0";
    wrap.style.position = "static";
    wrap.style.transform = "none";

    if (wrap.parentElement !== actions) {
      actions.insertBefore(wrap, resetButton);
    }

    return true;
  }

  return false;
}

function renderLanguageToggleV334A9() {
  if (document.getElementById("languageToggleV334A9")) {
    dockLanguageToggleV334A9();
    return;
  }

  document.documentElement.lang = currentLanguage === "en" ? "en" : "ko";

  const wrap = document.createElement("div");
  wrap.id = "languageToggleV334A9";
  wrap.setAttribute("aria-label", "Language switcher");
  wrap.style.display = "none";
  wrap.style.alignItems = "center";
  wrap.style.gap = "4px";
  wrap.style.marginRight = "8px";
  wrap.style.padding = "3px";
  wrap.style.border = "1px solid #d8e1f0";
  wrap.style.borderRadius = "999px";
  wrap.style.background = "#ffffff";
  wrap.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.08)";
  wrap.style.verticalAlign = "middle";

  function makeButton(lang, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.dataset.lang = lang;
    btn.setAttribute("aria-pressed", currentLanguage === lang ? "true" : "false");
    btn.title = lang === "ko" ? "한국어 데이터로 보기" : "View English data";
    btn.style.border = "0";
    btn.style.borderRadius = "999px";
    btn.style.padding = "5px 9px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "800";
    btn.style.lineHeight = "1";
    btn.style.color = currentLanguage === lang ? "#ffffff" : "#334155";
    btn.style.background = currentLanguage === lang ? "#2563eb" : "transparent";
    btn.addEventListener("click", function() {
      setLanguageAndReloadV334A9(lang);
    });
    return btn;
  }

  wrap.appendChild(makeButton("ko", "KO"));
  wrap.appendChild(makeButton("en", "EN"));

  document.body.appendChild(wrap);

  dockLanguageToggleV334A9();
  [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
    window.setTimeout(dockLanguageToggleV334A9, delay);
  });
}
// === LANGUAGE_TOGGLE_I18N_V334_A9 END ===
let resourceCards = [];
let currentIndex = 0;
let selectedChoice = null;
let activeConcept = null;

const progressKey = "python-reading-trainer-progress-v1";
const cardMemoPrefix = "python-reading-trainer-card-memo:";
const conceptMemoPrefix = "python-reading-trainer-concept-memo:";

const conceptInfo = {
  "print": {
    definition: "print()는 괄호 안의 값을 기본 출력 통로(보통 터미널)에 쓴다. 값을 여러 개 주면 기본적으로 사이에 공백을 넣고 끝에 줄바꿈을 붙이므로 결과와 실행 흐름을 확인할 때 유용하다.",
    example: "name = \"LiDAR\"\nprint(name)"
  },
  "len": {
    definition: "len()은 문자열의 문자 수, 리스트의 항목 수, dict의 key(키) 수처럼 여러 값을 담는 자료에 들어 있는 항목 개수를 정수로 돌려준다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(len(items))"
  },
  "variable": {
    definition: "변수는 값을 담는 고정 상자라기보다 문자열·리스트 같은 객체를 가리키는 이름이다. name = label은 label이 가리키던 객체를 name도 가리키게 하며, 객체를 자동 복사하지 않는다.",
    example: "label = \"LiDAR\"\nname = label\nprint(name)"
  },
  "list": {
    definition: "list는 여러 값을 순서대로 저장하고 나중에 바꿀 수 있는 자료구조다. 첫 항목의 인덱스는 0이며 append()로 끝에 값을 추가할 수 있다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(items[0])"
  },
  "dict": {
    definition: "dict는 서로 겹치지 않는 key(키)를 각 value(값)에 연결해 저장하는 자료구조다. node[\"label\"]은 지정한 key가 없으면 KeyError를 내므로 누락 가능성이 있으면 get()을 고려한다.",
    example: "node = {\"label\": \"LiDAR\", \"kind\": \"Sensor\"}\nprint(node[\"label\"])"
  },
  "get": {
    definition: "dict.get(key, default)는 지정한 key(키)가 있으면 연결된 value(값)를, 없으면 default(기본값)를 돌려준다. 대괄호 조회와 달리 key 누락만으로 KeyError를 내지 않는다.",
    example: "row = {\"label\": \"Radar\"}\nprint(row.get(\"doc_id\", \"NO_DOC\"))"
  },
  "set": {
    definition: "set은 같은 값을 하나만 보관하는 순서 없는 자료구조다. 중복 제거와 포함 여부 검사에 알맞지만, 리스트처럼 인덱스로 읽을 수는 없다.",
    example: "seen = set()\nseen.add(\"lidar\")\nprint(\"lidar\" in seen)"
  },
  "for": {
    definition: "for는 리스트처럼 항목을 차례로 꺼낼 수 있는 값에서 하나씩 꺼내 들여쓴 블록을 실행한다. 문자열·dict·range()에도 쓸 수 있고, dict를 그대로 반복하면 key가 나온다.",
    example: "items = [\"UAM\", \"ADAS\"]\nfor item in items:\n    print(item)"
  },
  "if": {
    definition: "if는 조건식을 참 또는 거짓으로 판단해 참일 때만 들여쓴 블록을 실행한다. 조건이 거짓이면 그 블록을 건너뛰고, 필요하면 elif나 else로 다른 흐름을 만든다.",
    example: "kind = \"Sensor\"\nif kind == \"Sensor\":\n    print(\"sensor node\")"
  },
  "append": {
    definition: "list.append(value)는 기존 리스트의 끝에 value 하나를 추가하고 None을 돌려준다. 여러 항목을 이어 붙이는 extend(iterable)와 구분해야 한다.",
    example: "selected = []\nselected.append(\"LiDAR\")\nprint(selected)"
  },
  "def": {
    definition: "def는 함수 객체를 만들고 이름에 연결하는 문장이다. 들여쓴 함수 본문은 정의할 때가 아니라 그 함수를 호출할 때 실행된다.",
    example: "def normalize_label(label):\n    return label.strip().lower()\n\nprint(normalize_label(\" LiDAR \"))"
  },
  "return": {
    definition: "return은 현재 함수 실행을 즉시 끝내고 호출한 곳에 값을 돌려준다. 값을 생략하거나 함수 끝까지 도달하면 None을 돌려준다.",
    example: "def add_one(x):\n    return x + 1\n\nprint(add_one(3))"
  },
  "open": {
    definition: "open(path, mode, encoding=...)은 파일을 열고 읽기·쓰기에 쓰는 파일 객체를 돌려준다. 기본 mode는 텍스트 읽기인 \"r\"이며, 사용 뒤에는 닫아야 하므로 보통 with와 함께 쓴다.",
    example: "with open(\"nodes.jsonl\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "with": {
    definition: "with는 작업의 시작과 정리를 한 묶음으로 관리한다. with open에서는 블록을 벗어날 때 파일을 닫으며, 중간에 예외가 나도 정리 동작이 실행된다.",
    example: "with open(\"input.txt\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "json.loads": {
    definition: "json.loads(text)는 JSON 문자열을 해석해 Python의 dict, list, str, int 같은 값으로 바꾼다. 문자열이 올바른 JSON이 아니면 JSONDecodeError가 난다.",
    example: "import json\nline = \"{\\\"label\\\": \\\"LiDAR\\\"}\"\nrow = json.loads(line)\nprint(row[\"label\"])"
  },
  "json.dumps": {
    definition: "json.dumps(value)는 Python 값을 JSON 문자열로 직렬화한다. 문자열만 돌려줄 뿐 파일에 쓰지는 않으며, 한글을 그대로 보이게 하려면 ensure_ascii=False를 쓸 수 있다.",
    example: "import json\nrow = {\"label\": \"LiDAR\"}\nprint(json.dumps(row, ensure_ascii=False))"
  },
  "jsonl": {
    definition: "JSONL은 각 줄에 서로 독립된 JSON 값 하나를 저장하는 텍스트 형식이다. 파일 전체가 JSON 배열 하나인 것은 아니며, 빈 줄은 레코드로 쓰지 않고 각 줄을 json.loads()로 읽는다.",
    example: "{\"id\":\"n001\",\"label\":\"LiDAR\"}\n{\"id\":\"n002\",\"label\":\"Radar\"}"
  },
  "pathlib": {
    definition: "pathlib은 경로를 Path 객체로 다루는 표준 라이브러리 모듈이다. 문자열을 직접 이어 붙이기보다 /, glob(), exists() 같은 경로 연산을 써서 운영체제 차이를 줄인다.",
    example: "from pathlib import Path\nfor path in Path(\"data\").glob(\"*.jsonl\"):\n    print(path.name)"
  },
  "argparse": {
    definition: "argparse는 명령줄 인자의 규칙과 도움말을 정의하고 입력된 문자열을 해석하는 표준 라이브러리 모듈이다. parse_args() 결과에서 --input 같은 옵션 값을 읽는다.",
    example: "import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument(\"--input\", default=\"input.jsonl\")\nargs = parser.parse_args()\nprint(args.input)"
  },
  "try_except": {
    definition: "try의 코드에서 지정한 예외가 나면 해당 except 흐름으로 이동한다. 오류를 자동으로 고치는 문법은 아니며, 너무 넓게 잡으면 실제 버그를 숨길 수 있다.",
    example: "try:\n    value = row[\"doc_id\"]\nexcept KeyError:\n    value = \"NO_DOC\""
  },
  "logging": {
    definition: "logging은 실행 메시지를 DEBUG, INFO, WARNING 같은 수준과 함께 기록하는 표준 라이브러리다. 출력 수준과 위치를 설정할 수 있으며, 기본 설정에서는 INFO 메시지가 보이지 않을 수 있다.",
    example: "import logging\nlogging.basicConfig(level=logging.INFO)\nlogging.info(\"start job\")"
  },
  "env": {
    definition: "환경변수는 운영체제가 실행 중인 프로그램(프로세스)에 전달하는 이름과 값의 문자열이다. os.environ.get()은 값이 없으면 None 또는 지정한 기본값을 돌려주며, 환경변수 자체가 비밀 저장소인 것은 아니다.",
    example: "import os\napi_key = os.environ.get(\"GOOGLE_API_KEY\")"
  },
  "api_key": {
    definition: "API key는 API 호출자를 식별하거나 권한·사용량을 연결하는 비밀 문자열(자격 증명)이다. 소스 코드, 브라우저 클라이언트, 로그에 넣지 말고 노출되면 폐기·재발급한다.",
    example: "import os\napi_key = os.environ.get(\"GOOGLE_API_KEY\")\nif api_key is None:\n    raise RuntimeError(\"GOOGLE_API_KEY is not set\")"
  },
  "pipeline": {
    definition: "파이프라인은 입력을 여러 처리 단계에 차례로 통과시켜 출력을 만드는 흐름이다. 앞 단계의 출력 형식이 다음 단계가 기대하는 입력 규칙(계약)과 맞아야 하므로 단계별 검증과 실패 처리 지점을 함께 읽는다.",
    example: "rows = load_jsonl(\"input.jsonl\")\nselected = filter_rows(rows)\nwrite_jsonl(selected, \"output.jsonl\")"
  },
  "main": {
    definition: "main은 스크립트의 주요 실행 흐름을 모으는 관례적 함수 이름일 뿐 Python이 자동 호출하는 특별한 이름은 아니다. if __name__ == \"__main__\": 가드를 써야 직접 실행할 때만 호출되고 import할 때는 건너뛴다.",
    example: "def main():\n    print(\"start\")\n\nif __name__ == \"__main__\":\n    main()"
  }
};

// === CONTENT_QUALITY_FINAL_PASS_V339 BEGIN ===
Object.assign(conceptInfo, {
  "comment": {definition: "주석은 코드에 설명을 남기는 글이다. Python에서 # 뒤의 내용은 실행되지 않으므로 출력이나 계산 결과를 직접 바꾸지 않는다.", example: "# 설명\nprint(\"hello\")"},
  "output": {definition: "출력은 프로그램이 계산한 결과를 화면이나 터미널에 보여 주는 것이다. Python에서는 보통 print()로 확인한다.", example: "print(\"hello\")"},
  "execution_order": {definition: "Python 코드는 보통 위에서 아래로 한 줄씩 실행된다. 값을 바꾸는 줄이 있다면 마지막 출력 전에 어떤 값이 되었는지 순서대로 따라간다.", example: "x = 1\nx = 2\nprint(x)"},
  "assignment": {definition: "대입은 오른쪽에서 만든 값을 왼쪽 이름에 저장하는 동작이다. x = 3은 x라는 이름으로 3을 다시 사용할 수 있게 한다.", example: "x = 3\nprint(x)"},
  "str": {definition: "문자열(str)은 글자를 다루는 값이다. 따옴표로 감싼 \"3\"은 숫자처럼 보여도 문자열이라서 정수 3과 다르게 동작한다.", example: "text = \"3\"\nprint(text)"},
  "int": {definition: "정수(int)는 1, 2, 100처럼 소수점이 없는 숫자다. int(\"3\")처럼 숫자 모양의 문자열을 정수로 바꿀 수도 있다.", example: "number = int(\"3\")\nprint(number + 2)"},
  "float": {definition: "실수(float)는 3.5처럼 소수점이 있는 숫자를 다룬다. float(\"3.5\")처럼 문자열을 실수로 바꿀 수 있다.", example: "value = float(\"3.5\")"},
  "type": {definition: "자료형(type)은 값의 종류다. 3은 int, \"3\"은 str처럼 겉보기와 실제 종류가 다를 수 있다.", example: "print(type(\"3\"))"},
  "bool": {definition: "bool은 True 또는 False 두 값으로 참과 거짓을 나타낸다. 조건문은 이 판단을 이용해 실행할 코드를 고른다.", example: "active = True"},
  "comparison": {definition: "비교식은 두 값을 비교해 True 또는 False를 만든다. ==, !=, <, >, <=, >= 같은 기호를 사용한다.", example: "print(3 < 5)"},
  "operator": {definition: "연산자는 값으로 계산이나 비교를 하는 기호다. +는 숫자에서는 덧셈, 문자열에서는 이어 붙이기로 동작할 수 있다.", example: "print(2 + 3)"},
  "else": {definition: "else는 앞의 if 조건이 거짓일 때 실행할 코드를 적는 부분이다.", example: "if ready:\n    print(\"go\")\nelse:\n    print(\"wait\")"},
  "while": {definition: "while은 조건이 참인 동안 같은 코드 묶음을 반복한다. 반복 안에서 조건에 쓰는 값이 어떻게 바뀌는지 확인해야 한다.", example: "i = 0\nwhile i < 3:\n    i += 1"},
  "range": {definition: "range()는 반복할 숫자의 흐름을 만든다. range(3)은 0, 1, 2를 차례로 만든다.", example: "for i in range(3):\n    print(i)"},
  "break": {definition: "break는 현재 반복문을 바로 끝낸다. 반복 뒤의 코드는 계속 실행된다.", example: "for x in items:\n    if x == target:\n        break"},
  "continue": {definition: "continue는 현재 반복의 남은 줄을 건너뛰고 다음 반복으로 넘어간다.", example: "for x in items:\n    if not x:\n        continue"},
  "tuple": {definition: "tuple은 여러 값을 순서대로 묶는 자료형이다. list와 비슷하지만 만든 뒤 항목을 바꿀 수 없다.", example: "point = (10, 20)"},
  "index": {definition: "인덱스는 순서가 있는 자료에서 항목의 위치를 나타내는 번호다. Python의 첫 번째 위치는 0이다.", example: "items = [\"a\", \"b\"]\nprint(items[0])"},
  "key": {definition: "dict의 key는 값을 찾기 위한 이름표다. data[\"name\"]에서 \"name\"이 key다.", example: "data = {\"name\": \"Mina\"}"},
  "value": {definition: "value는 변수나 자료구조에 실제로 들어 있는 값이다. dict에서는 key를 이용해 연결된 value를 꺼낸다.", example: "data = {\"name\": \"Mina\"}"},
  "function": {definition: "함수는 여러 줄의 작업을 이름 하나로 묶어 다시 사용할 수 있게 한 코드다. 함수를 호출할 때 안의 코드가 실행된다.", example: "def greet():\n    print(\"hi\")\ngreet()"},
  "parameter": {definition: "매개변수(parameter)는 함수를 만들 때 입력값을 받을 자리에 붙이는 이름이다.", example: "def greet(name):\n    print(name)"},
  "argument": {definition: "인자(argument)는 함수를 호출할 때 실제로 넘기는 값이다.", example: "greet(\"Mina\")"},
  "scope": {definition: "스코프는 변수 이름을 사용할 수 있는 범위다. 함수 안에서 만든 변수는 보통 그 함수 안에서 사용한다.", example: "def f():\n    x = 1"},
  "import": {definition: "import는 다른 모듈에 있는 기능을 현재 코드에서 사용할 수 있게 불러오는 문장이다.", example: "import json"},
  "module": {definition: "모듈은 관련 기능을 모아 둔 Python 파일이나 라이브러리 단위다. import로 불러와 사용한다.", example: "import json"},
  "file": {definition: "파일은 데이터를 저장해 두는 단위다. 코드를 읽을 때는 어떤 파일을 읽는지, 쓰는지, 닫는지를 확인한다.", example: "with open(\"a.txt\") as f:\n    text = f.read()"},
  "path": {definition: "경로(path)는 파일이나 폴더가 어디에 있는지 나타내는 주소다.", example: "path = \"data/input.txt\""},
  "exception": {definition: "예외는 코드를 실행하다 정상적으로 계속할 수 없는 상황을 나타내는 오류 신호다. try/except로 일부 예외를 처리할 수 있다.", example: "try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
  "json": {definition: "JSON은 데이터를 글자 형태로 저장하거나 주고받을 때 많이 쓰는 형식이다. { }는 객체, [ ]는 목록을 나타낸다.", example: "{\"name\":\"Mina\"}"},
  "csv": {definition: "CSV는 값을 쉼표로 나누어 표처럼 저장하는 텍스트 파일 형식이다. 한 줄이 보통 한 행을 뜻한다.", example: "name,score\nMina,90"},
  "input": {definition: "input()은 사용자가 입력한 내용을 문자열로 돌려준다. 숫자 계산을 하려면 필요에 따라 int()나 float()로 바꾼다.", example: "age = int(input())"},
  "indentation": {definition: "들여쓰기는 줄 앞의 공백이다. Python에서는 if, for, 함수 안에 어떤 줄이 속하는지 들여쓰기로 표시한다.", example: "if ready:\n    print(\"go\")"},
  "class": {definition: "class는 관련된 값과 기능을 한 종류로 묶는 설계도다. 그 설계도로 실제 객체를 만들 수 있다.", example: "class Dog:\n    pass"},
  "object": {definition: "객체(object)는 값과 기능을 함께 가진 실제 데이터다. class로 만든 값도 객체다.", example: "dog = Dog()"},
  "method": {definition: "메서드는 객체에 연결되어 그 객체의 값을 사용하거나 바꾸는 함수다.", example: "items.append(\"a\")"},
  "self": {definition: "self는 메서드 안에서 지금 사용 중인 객체 자신을 가리키는 관례적인 이름이다.", example: "def show(self):\n    print(self.name)"},
  "None": {definition: "None은 '값이 아직 없거나 특별히 돌려줄 값이 없음'을 나타내는 Python의 특별한 값이다.", example: "result = None"},
  "mutable": {definition: "mutable은 만든 뒤에도 내용이 바뀔 수 있다는 뜻이다. list와 dict는 대표적인 mutable 자료형이다.", example: "items = []\nitems.append(1)"},
  "print": {definition: "print()는 괄호 안의 값을 화면이나 터미널에 보여 주는 함수다. 변수 이름을 넣으면 그 변수에 들어 있는 값이 출력된다.", example: "name = \"Mina\"\nprint(name)"},
  "variable": {definition: "변수는 값을 나중에 다시 쓰기 위해 붙여 둔 이름이다. x = 3이라고 쓰면 이후에 x를 사용해 3을 다시 꺼내 쓸 수 있다.", example: "x = 3\nprint(x)"},
  "list": {definition: "list는 여러 값을 순서대로 담는 자료다. 첫 번째 항목의 위치 번호는 0이고 append()로 값을 뒤에 추가할 수 있다.", example: "items = [\"a\", \"b\"]\nprint(items[0])"},
  "dict": {definition: "dict는 key라는 이름표와 value라는 값을 짝지어 저장하는 자료다. key를 사용해 원하는 값을 찾는다.", example: "data = {\"name\": \"Mina\"}\nprint(data[\"name\"])"},
  "for": {definition: "for는 여러 항목을 하나씩 꺼내 같은 코드 묶음을 반복한다. 반복할 때마다 현재 항목이 변수에 들어간다.", example: "for item in [\"a\", \"b\"]:\n    print(item)"},
  "if": {definition: "if는 조건이 True일 때만 들여쓴 코드 묶음을 실행한다. 조건이 False면 그 부분을 건너뛴다.", example: "if score >= 60:\n    print(\"pass\")"},
  "def": {definition: "def는 함수에 이름을 붙여 만드는 문장이다. 함수 안의 코드는 함수를 실제로 호출할 때 실행된다.", example: "def greet():\n    print(\"hi\")"},
  "return": {definition: "return은 함수 실행을 끝내고 호출한 곳으로 값을 돌려준다.", example: "def add(a, b):\n    return a + b"},
  "open": {definition: "open()은 파일을 읽거나 쓰기 위해 여는 함수다. 어떤 파일을 어떤 방식으로 여는지 인자를 확인한다.", example: "open(\"data.txt\", \"r\")"},
  "with": {definition: "with는 파일처럼 사용 후 정리가 필요한 대상을 안전하게 쓰는 문법이다. with open(...) 블록이 끝나면 파일이 자동으로 닫힌다.", example: "with open(\"a.txt\") as f:\n    text = f.read()"},
  "try_except": {definition: "try/except는 실행 중 특정 오류가 나면 프로그램을 바로 끝내지 않고 정해 둔 다른 코드를 실행하게 한다.", example: "try:\n    int(text)\nexcept ValueError:\n    print(\"bad\")"}
});
// === CONTENT_QUALITY_FINAL_PASS_V339 END ===

// === CONTENT_QUALITY_BEGINNER_DENSITY_V339_R2 BEGIN ===
if (currentLanguage === "en") {
  Object.assign(conceptInfo, {
    "comment": {definition:"A comment is explanatory text for people reading the code. In Python, text after # is not executed, so it does not directly change the output or calculation.", example:"# explanation\nprint(\"hello\")"},
    "output": {definition:"Output is the result a program shows on the screen or terminal. In Python, print() is the usual way to display a value.", example:"print(\"hello\")"},
    "execution_order": {definition:"Python normally runs code from top to bottom. Track how a value changes before the final print or return.", example:"x = 1\nx = 2\nprint(x)"},
    "assignment": {definition:"Assignment calculates the right side first and stores that value under the name on the left. x = 3 lets later code use x to get 3.", example:"x = 3\nprint(x)"},
    "str": {definition:"A string (str) is a text value. The quoted value \"3\" looks numeric but is text, so it behaves differently from the integer 3.", example:"text = \"3\""},
    "int": {definition:"An integer (int) is a whole number such as 1, 2, or 100. int(\"3\") converts numeric text into the integer 3.", example:"number = int(\"3\")"},
    "float": {definition:"A float represents numbers with a decimal part, such as 3.5. float(\"3.5\") converts numeric text into a float.", example:"value = float(\"3.5\")"},
    "type": {definition:"A type tells you what kind of value something is. 3 is an int while \"3\" is a str, so they can behave differently.", example:"print(type(\"3\"))"},
    "bool": {definition:"A bool is either True or False. Conditions use these truth values to decide which code should run.", example:"active = True"},
    "comparison": {definition:"A comparison checks two values and produces True or False. Common operators include ==, !=, <, >, <=, and >=.", example:"print(3 < 5)"},
    "operator": {definition:"An operator is a symbol that calculates or compares values. + adds numbers but can join strings.", example:"print(2 + 3)"},
    "else": {definition:"else contains the code to run when the earlier if condition is False.", example:"if ready:\n    print(\"go\")\nelse:\n    print(\"wait\")"},
    "while": {definition:"while repeats a block as long as its condition is True. Track the value that changes the condition so you can see when the loop stops.", example:"i = 0\nwhile i < 3:\n    i += 1"},
    "range": {definition:"range() produces numbers for a loop. range(3) produces 0, 1, and 2.", example:"for i in range(3):\n    print(i)"},
    "break": {definition:"break stops the current loop immediately. Code after the loop can still continue.", example:"if found:\n    break"},
    "continue": {definition:"continue skips the rest of the current loop iteration and moves to the next one.", example:"if not item:\n    continue"},
    "tuple": {definition:"A tuple groups values in order. It is similar to a list, but its items cannot be changed after the tuple is created.", example:"point = (10, 20)"},
    "index": {definition:"An index is a position number in ordered data. Python starts counting positions at 0.", example:"items = [\"a\", \"b\"]\nprint(items[0])"},
    "key": {definition:"A dict key is a label used to find a value. In data[\"name\"], \"name\" is the key.", example:"data = {\"name\": \"Mina\"}"},
    "value": {definition:"A value is the actual data stored in a variable or data structure. In a dict, a key is used to retrieve its value.", example:"data = {\"name\": \"Mina\"}"},
    "function": {definition:"A function gives a name to a reusable group of steps. The code inside runs when the function is called.", example:"def greet():\n    print(\"hi\")"},
    "parameter": {definition:"A parameter is the name used inside a function definition to receive an input value.", example:"def greet(name):\n    print(name)"},
    "argument": {definition:"An argument is the actual value passed when a function is called.", example:"greet(\"Mina\")"},
    "scope": {definition:"Scope is the area where a variable name can be used. A variable created inside a function is normally used inside that function.", example:"def f():\n    x = 1"},
    "import": {definition:"import makes code from another module available in the current file.", example:"import json"},
    "module": {definition:"A module is a Python file or library unit that groups related features. import loads a module for use.", example:"import json"},
    "file": {definition:"A file stores data. When reading code, check which file is opened, whether it is read or written, and when it is closed.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
    "path": {definition:"A path is the address that tells a program where a file or folder is located.", example:"path = \"data/input.txt\""},
    "exception": {definition:"An exception signals that code cannot continue normally. try/except can handle selected exceptions.", example:"try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
    "json": {definition:"JSON is a text format commonly used to store or exchange structured data. { } represents an object and [ ] represents a list.", example:"{\"name\":\"Mina\"}"},
    "csv": {definition:"CSV stores table-like data as text, usually with values separated by commas. One line normally represents one row.", example:"name,score\nMina,90"},
    "input": {definition:"input() returns what the user typed as a string. Convert it with int() or float() when numeric calculation is needed.", example:"age = int(input())"},
    "indentation": {definition:"Indentation is the spaces at the start of a line. Python uses indentation to show which lines belong inside an if, loop, function, or class.", example:"if ready:\n    print(\"go\")"},
    "class": {definition:"A class is a blueprint that groups related data and behavior. Objects can be created from that class.", example:"class Dog:\n    pass"},
    "object": {definition:"An object is an actual value that can contain data and behavior. A value created from a class is an object.", example:"dog = Dog()"},
    "method": {definition:"A method is a function connected to an object. It can read or change that object's data.", example:"items.append(\"a\")"},
    "self": {definition:"self is the conventional name for the current object inside a method.", example:"def show(self):\n    print(self.name)"},
    "None": {definition:"None is Python's special value for 'no value here' or 'no specific result returned.'", example:"result = None"},
    "mutable": {definition:"Mutable means the contents can change after creation. Lists and dicts are common mutable values.", example:"items = []\nitems.append(1)"},
    "print": {definition:"print() displays the value inside its parentheses. If you pass a variable name, Python displays the value stored under that name.", example:"name = \"Mina\"\nprint(name)"},
    "variable": {definition:"A variable is a name attached to a value so the value can be used again later. After x = 3, later code can use x to get 3.", example:"x = 3\nprint(x)"},
    "list": {definition:"A list stores several values in order. The first position is index 0, and append() adds a new value at the end.", example:"items = [\"a\", \"b\"]"},
    "dict": {definition:"A dict stores pairs of keys and values. Use a key as a label to find its value.", example:"data = {\"name\": \"Mina\"}"},
    "for": {definition:"for takes items one at a time and repeats the same block. The current item is placed in the loop variable each time.", example:"for item in [\"a\", \"b\"]:\n    print(item)"},
    "if": {definition:"if runs its indented block only when the condition is True. If the condition is False, that block is skipped.", example:"if score >= 60:\n    print(\"pass\")"},
    "def": {definition:"def creates a function and gives it a name. The function body runs when the function is called.", example:"def greet():\n    print(\"hi\")"},
    "return": {definition:"return ends a function and sends a value back to the caller.", example:"def add(a, b):\n    return a + b"},
    "open": {definition:"open() opens a file for reading or writing. Check the file path and the mode passed to it.", example:"open(\"data.txt\", \"r\")"},
    "with": {definition:"with safely manages resources such as files. A file opened with with is closed automatically when the block ends.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
    "try_except": {definition:"try/except lets code handle selected errors instead of stopping immediately.", example:"try:\n    int(text)\nexcept ValueError:\n    print(\"bad\")"}
  });
}
// === CONTENT_QUALITY_BEGINNER_DENSITY_V339_R2 END ===

function loadProgress() {
  const raw = localStorage.getItem(progressKey);
  if (!raw) {
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }
  try {
    const parsed = JSON.parse(raw);
    parsed.seen = parsed.seen || {};
    parsed.correct = parsed.correct || {};
    parsed.confused = parsed.confused || {};
    parsed.lastSeenAt = parsed.lastSeenAt || {};
    return parsed;
  } catch {
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }
}

function saveProgress(progress) {
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

function normalizeAnswer(value) {
  if (Array.isArray(value)) {
    return value.map(String).sort().join(" | ");
  }
  return String(value);
}


// CONCEPT_INTRO_DEDUP_V306_A1
function normalizeConceptIntroTextV306(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/A9_BODY_THICKENED:/g, "")
    .trim();
}

function sentenceLooksLikeExampleV306(sentence) {
  const text = String(sentence || "");
  return /예시|예:|예를 들어|print\(|console\.log|\[[^\]]+\]|\{[^}]+\}|=|=>|->|정답|출력은|출력:/i.test(text);
}

function trimConceptIntroTextV306(text, limit) {
  const normalized = normalizeConceptIntroTextV306(text);
  if (!normalized) return "";

  const sentences = normalized
    .split(/(?<=[.!?。]|다\.|요\.)\s+/)
    .map(function(sentence) { return sentence.trim(); })
    .filter(Boolean);

  const safe = sentences.filter(function(sentence) {
    return !sentenceLooksLikeExampleV306(sentence);
  });

  const picked = (safe.length ? safe : sentences).slice(0, 2).join(" ");
  return picked.length > limit ? picked.slice(0, limit - 1).trim() + "…" : picked;
}

function getCardConceptsV306(card) {
  return Array.isArray(card && card.concepts) ? card.concepts.filter(Boolean) : [];
}

function getPrimaryConceptV306(card, sourceCard) {
  const concepts = getCardConceptsV306(card);
  const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
  if (semantics && typeof semantics.pickPrimaryConcept === "function") {
    return semantics.pickPrimaryConcept(card || {}, concepts, conceptInfo);
  }
  for (let i = 0; i < concepts.length; i += 1) {
    if (conceptInfo[concepts[i]]) return concepts[i];
  }
  return concepts[0] || "";
}

function pickConceptIntroSideCardV306(card) {
  const directIds = Array.isArray(card && card.side_card_ids) ? card.side_card_ids : [];
  const directCards = directIds.map(getSideCardById).filter(Boolean).filter(function(sc) {
    const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
    return semantics && typeof semantics.isSideCardRelevant === "function"
      ? semantics.isSideCardRelevant(card || {}, sc)
      : false;
  });
  const concepts = getCardConceptsV306(card);

  if (!directCards.length) return null;

  const scored = directCards.map(function(sc) {
    const related = Array.isArray(sc.related_concepts) ? sc.related_concepts : [];
    const overlap = related.filter(function(concept) {
      return concepts.indexOf(concept) >= 0;
    }).length;

    let score = overlap * 5;
    if (sc.detail) score += 3;
    if (sc.summary || sc.description) score += 2;
    if (sc.body) score += 1;
    if (concepts.indexOf(sc.id) >= 0) score += 2;

    return { card: sc, score: score };
  }).sort(function(a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return String(a.card.id).localeCompare(String(b.card.id));
  });

  return scored[0] && scored[0].score > 0 ? scored[0].card : directCards[0];
}

function buildSafeSideCardIntroTextV306(sourceCard) {
  if (!sourceCard) return "";

  const raw = [
    sourceCard.detail,
    sourceCard.summary,
    sourceCard.description,
    sourceCard.body
  ].filter(Boolean).join(" ");

  return trimConceptIntroTextV306(raw, 260);
}

function buildConceptIntroV306(card) {
  const sourceCard = pickConceptIntroSideCardV306(card);
  const primaryConcept = getPrimaryConceptV306(card, sourceCard);
  const concept = primaryConcept && conceptInfo[primaryConcept] ? conceptInfo[primaryConcept] : null;
  const conceptText = concept ? trimConceptIntroTextV306(concept.definition, 220) : "";
  if (conceptText) {
    return {sourceSideCardId:"", concept:primaryConcept || "", title:primaryConcept ? primaryConcept + " 기본 개념" : "개념 안내", body:conceptText, sourceTitle:""};
  }
  const concepts = getCardConceptsV306(card);
  const related = Array.isArray(sourceCard && sourceCard.related_concepts) ? sourceCard.related_concepts.filter(Boolean) : [];
  const meaningful = related.some(function(value) {
    const key = String(value || "").toLowerCase();
    return concepts.indexOf(value) >= 0 && !["python","code","programming","basic"].includes(key);
  });
  if (sourceCard && meaningful) {
    const sideText = buildSafeSideCardIntroTextV306(sourceCard);
    if (sideText) return {sourceSideCardId:sourceCard.id || "", concept:primaryConcept || "", title:sourceCard.title || "개념 안내", body:sideText, sourceTitle:sourceCard.title || ""};
  }
  const goal = trimConceptIntroTextV306(card && card.reading_goal ? card.reading_goal : "", 200);
  if (!goal) return null;
  return {sourceSideCardId:"", concept:primaryConcept || "", title:primaryConcept ? primaryConcept + " 읽기 포인트" : "이 문제의 읽기 포인트", body:goal, sourceTitle:""};
}

function renderConceptIntroV306(card) {
  const box = document.getElementById("conceptIntro");
  if (!box) return "";

  const intro = buildConceptIntroV306(card);
  box.innerHTML = "";

  if (!intro) {
    box.classList.add("hidden");
    box.removeAttribute("data-side-card-id");
    return "";
  }

  box.classList.remove("hidden");
  box.setAttribute("data-side-card-id", intro.sourceSideCardId || "");

  const label = document.createElement("div");
  label.className = "concept-intro-label-v306";
  label.textContent = "개념 안내";

  const title = document.createElement("div");
  title.className = "concept-intro-title-v306";
  title.textContent = intro.title;

  const body = document.createElement("div");
  body.className = "concept-intro-body-v306";
  body.textContent = intro.body;

  const note = document.createElement("div");
  note.className = "concept-intro-note-v306";
  note.textContent = intro.sourceSideCardId
    ? "사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다."
    : "정답을 직접 알려주지 않는 일반 개념 설명입니다.";

  box.appendChild(label);
  box.appendChild(title);
  box.appendChild(body);
  box.appendChild(note);

  return intro.sourceSideCardId || "";
}

function renderReadingGoalV306(card) {
  const goal = document.getElementById("readingGoal");
  const wrap = document.getElementById("readingGoalWrap");
  const text = String(card && card.reading_goal ? card.reading_goal : "").trim();

  if (goal) {
    goal.textContent = text;
  }

  if (!wrap) return;

  if (!text) {
    wrap.classList.add("hidden");
    wrap.open = false;
    return;
  }

  wrap.classList.remove("hidden");
  wrap.open = false;
}

function getSideCardById(id) {
  return sideCards.find(function(card) {
    return card.id === id;
  });
}

const sideSeenKey = "python-reading-trainer-side-seen-v1";

function loadSideSeen() {
  const raw = localStorage.getItem(sideSeenKey);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSideSeen(seen) {
  localStorage.setItem(sideSeenKey, JSON.stringify(seen));
}

function markSideSeen(cardId) {
  const seen = loadSideSeen();
  seen[cardId] = (seen[cardId] || 0) + 1;
  saveSideSeen(seen);
}

function getBonusSideCards(card, alreadyIds) {
  const seen = loadSideSeen();
  const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
  const pool = sideCards.filter(function(sc) {
    if (!sc || !sc.id || alreadyIds.includes(sc.id)) return false;
    const relevant = semantics && typeof semantics.isSideCardRelevant === "function"
      ? semantics.isSideCardRelevant(card || {}, sc)
      : false;
    return relevant && (seen[sc.id] || 0) < 3;
  });
  pool.sort(function(a,b) {
    const ac = seen[a.id] || 0, bc = seen[b.id] || 0;
    if (ac !== bc) return ac - bc;
    return a.id.localeCompare(b.id);
  });
  return pool.slice(0, 2);
}

function normalizeResourceText(value) {
  return String(value || "").toLowerCase();
}

function getExternalResourceMatches(card, visibleSideCards) {
  if (!Array.isArray(resourceCards) || resourceCards.length === 0) {
    return [];
  }

  const conceptSet = new Set();
  (card.concepts || []).forEach(function(concept) {
    conceptSet.add(normalizeResourceText(concept));
  });

  (visibleSideCards || []).forEach(function(sc) {
    (sc.related_concepts || sc.concepts || []).forEach(function(concept) {
      conceptSet.add(normalizeResourceText(concept));
    });
  });

  const concepts = Array.from(conceptSet).filter(Boolean);

  const scored = resourceCards
    .filter(function(resource) {
      return resource && resource.url && resource.tier !== "RSS" && resource.difficulty !== "maintainer";
    })
    .map(function(resource) {
      const blob = [
        resource.id,
        resource.title,
        resource.source_name,
        resource.source_type,
        resource.tier,
        resource.language,
        resource.difficulty,
        resource.why_useful,
        (resource.related_concepts || []).join(" "),
        (resource.recommended_for || []).join(" ")
      ].map(normalizeResourceText).join(" ");

      let score = 0;
      concepts.forEach(function(concept) {
        if (concept && blob.indexOf(concept) >= 0) {
          score += 3;
        }
      });

      if (resource.tier === "A") score += 2;
      if (resource.language === "ko") score += 1;
      if ((resource.source_type || "").indexOf("tutorial") >= 0) score += 1;
      if ((resource.source_type || "").indexOf("quiz") >= 0) score += 1;

      return { resource: resource, score: score };
    })
    .filter(function(item) {
      return item.score > 0;
    })
    .sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.resource.id).localeCompare(String(b.resource.id));
    });

  const picked = scored.slice(0, 3).map(function(item) {
    return item.resource;
  });

  if (picked.length > 0) {
    return picked;
  }

  return resourceCards
    .filter(function(resource) {
      return resource && resource.url && resource.tier !== "RSS" && resource.difficulty !== "maintainer";
    })
    .slice(0, 3);
}

function renderExternalResources(card, visibleSideCards) {
  const sideEl = document.getElementById("sideCards");
  if (!sideEl) {
    return;
  }

  const matches = getExternalResourceMatches(card, visibleSideCards);
  if (matches.length === 0) {
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "side-section-head";

  const title = document.createElement("div");
  title.className = "side-section-title";
  title.textContent = studyToolsTextV334A10N("더 읽어보기", "Read more");

  const note = document.createElement("div");
  note.className = "side-section-note";
  note.textContent = studyToolsTextV334A10N("외부 자료는 본문 복사 없이 링크와 출처만 연결합니다.", "For external sources, include only the link and source without copying the text.");

  wrap.appendChild(title);
  wrap.appendChild(note);
  sideEl.appendChild(wrap);

  matches.forEach(function(resource) {
    const box = document.createElement("div");
    box.className = "side-card external-resource-card";

    const type = document.createElement("div");
    type.className = "side-card-type";
    type.textContent = studyToolsTextV334A10N("외부 자료", "External resource") + " · " + (resource.tier || "link") + " · " + (resource.language || "");

    const link = document.createElement("a");
    link.className = "side-card-title";
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = resource.title || resource.url;

    const body = document.createElement("div");
    body.className = "side-card-body";
    body.textContent = resource.why_useful || "관련 학습 자료입니다.";

    const meta = document.createElement("div");
    meta.className = "side-card-detail";
    meta.textContent = [
      resource.source_name || "",
      resource.difficulty || "",
      resource.use_policy || ""
    ].filter(Boolean).join(" · ");

    box.appendChild(type);
    box.appendChild(link);
    box.appendChild(body);
    box.appendChild(meta);
    sideEl.appendChild(box);
  });
}

function getCurrentCard() {
  return cards[currentIndex];
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach(function(view) {
    view.classList.remove("active-view");
  });

  document.querySelectorAll(".tab-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });

  document.getElementById(viewName + "View").classList.add("active-view");
  document.querySelector('[data-view="' + viewName + '"]').classList.add("active");

  if (viewName === "outline") {
    renderOutline();
  }
  if (viewName === "progress") {
    renderProgress();
  }
  if (viewName === "notes") {
    renderNotesList();
  }
  if (viewName === "code" && window.CodeExplainer && typeof window.CodeExplainer.refresh === "function") {
    window.CodeExplainer.refresh();
  }
  if (viewName === "command" && window.CommandExplainer && typeof window.CommandExplainer.refresh === "function") {
    window.CommandExplainer.refresh();
  }
  if (viewName === "project" && window.ProjectAnalyzer && typeof window.ProjectAnalyzer.refresh === "function") {
    window.ProjectAnalyzer.refresh();
  }
}

function renderCard() {
  const card = getCurrentCard();
  selectedChoice = null;
  document.getElementById("nextBtn").classList.remove("primary-next");

  document.getElementById("levelBadge").textContent = "Level " + card.level;
  document.getElementById("progressText").textContent = (currentIndex + 1) + " / " + cards.length;
  document.getElementById("cardTitle").textContent = card.title;
  const conceptIntroSideCardIdV306 = renderConceptIntroV306(card);
  renderReadingGoalV306(card);
  document.getElementById("codeBlock").textContent = card.code || "(코드 없음: 기능 선택형 문제)";
  document.getElementById("questionText").textContent = card.question || "";
  document.getElementById("projectContext").textContent = card.project_context || "";

  const resultBox = document.getElementById("resultBox");
  resultBox.className = "result-box hidden";
  resultBox.textContent = "";

  const choicesEl = document.getElementById("choices");
  choicesEl.innerHTML = "";

  const choices = card.choices || [];
  choices.forEach(function(choice) {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = Array.isArray(choice) ? choice.join(", ") : String(choice);
    btn.onclick = function() {
      checkAnswer(choice, btn);
    };
    choicesEl.appendChild(btn);
  });

  renderSideCards(card, conceptIntroSideCardIdV306);
  loadCardMemo(card.id);
  markSeen(card.id);
}

function renderMobileSideTeaser(card, directCards, bonusCards) {
  let teaser = document.getElementById("mobileSideTeaser");

  if (!teaser) {
    teaser = document.createElement("div");
    teaser.id = "mobileSideTeaser";
    teaser.className = "mobile-side-teaser hidden";

    const choicesEl = document.getElementById("choices");
    if (choicesEl && choicesEl.parentNode) {
      choicesEl.parentNode.insertBefore(teaser, choicesEl.nextSibling);
    }
  }

  if (!teaser) {
    return;
  }

  const cardsForTeaser = directCards.concat(bonusCards).filter(Boolean).slice(0, 3);
  teaser.innerHTML = "";

  if (cardsForTeaser.length === 0) {
    teaser.className = "mobile-side-teaser hidden";
    return;
  }

  teaser.className = "mobile-side-teaser mobile-side-accordion";

  function getSideText(sc) {
    return sc.body || sc.summary || sc.description || "";
  }

  function getSideDetail(sc) {
    const parts = [];
    if (sc.detail) {
      parts.push(sc.detail);
    }
    if (Array.isArray(sc.examples) && sc.examples.length > 0) {
      parts.push("예시: " + sc.examples.slice(0, 4).join(" / "));
    }
    if (Array.isArray(sc.related_concepts) && sc.related_concepts.length > 0) {
      parts.push("연결 개념: " + sc.related_concepts.slice(0, 6).join(", "));
    }
    return parts.join("\n\n");
  }

  function getFullText(sc) {
    return [getSideText(sc), getSideDetail(sc)].filter(Boolean).join("\n\n");
  }

  const head = document.createElement("div");
  head.className = "mobile-side-teaser-head";
  head.textContent = "보너스 개념 미리보기";

  const note = document.createElement("div");
  note.className = "mobile-side-teaser-note";
  note.textContent = "카드를 누르면 해당 개념만 펼쳐서 봅니다.";

  const list = document.createElement("div");
  list.className = "mobile-side-teaser-list";

  function closeOtherItems(exceptItem) {
    list.querySelectorAll(".mobile-side-teaser-item.is-open").forEach(function(openItem) {
      if (openItem === exceptItem) {
        return;
      }

      openItem.classList.remove("is-open");
      openItem.setAttribute("aria-expanded", "false");

      const toggle = openItem.querySelector(".mobile-side-teaser-toggle");
      if (toggle) {
        toggle.textContent = "펼치기";
      }

      const detail = openItem.querySelector(".mobile-side-teaser-detail");
      if (detail) {
        detail.hidden = true;
      }
    });
  }

  cardsForTeaser.forEach(function(sc, idx) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "mobile-side-teaser-item";
    item.setAttribute("aria-expanded", "false");

    const top = document.createElement("span");
    top.className = "mobile-side-teaser-topline";

    const label = document.createElement("span");
    label.className = "mobile-side-teaser-label";
    label.textContent = idx === 0 ? "관련" : "보너스";

    const title = document.createElement("span");
    title.className = "mobile-side-teaser-title";
    title.textContent = sc.title || sc.id || "사이드 카드";

    const toggle = document.createElement("span");
    toggle.className = "mobile-side-teaser-toggle";
    toggle.textContent = "펼치기";

    top.appendChild(label);
    top.appendChild(title);
    top.appendChild(toggle);

    const summary = document.createElement("span");
    summary.className = "mobile-side-teaser-summary";
    summary.textContent = getSideText(sc);

    const detail = document.createElement("span");
    detail.className = "mobile-side-teaser-detail";
    detail.textContent = getFullText(sc) || "추가 설명이 없습니다.";
    detail.hidden = true;

    item.appendChild(top);
    item.appendChild(summary);
    item.appendChild(detail);

    item.addEventListener("click", function() {
      const willOpen = !item.classList.contains("is-open");

      closeOtherItems(item);

      item.classList.toggle("is-open", willOpen);
      item.setAttribute("aria-expanded", willOpen ? "true" : "false");
      toggle.textContent = willOpen ? "접기" : "펼치기";
      detail.hidden = !willOpen;

      if (willOpen && sc.id) {
        markSideSeen(sc.id);
      }
    });

    list.appendChild(item);
  });

  teaser.appendChild(head);
  teaser.appendChild(note);
  teaser.appendChild(list);
}

function renderSideCards(card, excludedIntroSideCardIdV306) {
  const sideEl = document.getElementById("sideCards");
  sideEl.innerHTML = "";

  const excludedIntroIdsV306 = new Set(
    [excludedIntroSideCardIdV306].filter(Boolean)
  );

  const rawDirectIds = card.side_card_ids || [];
  const directIds = rawDirectIds.filter(function(id) {
    return !excludedIntroIdsV306.has(id);
  });
  const directCards = directIds.map(getSideCardById).filter(Boolean);
  const bonusCards = getBonusSideCards(card, rawDirectIds.concat(Array.from(excludedIntroIdsV306)));
  renderMobileSideTeaser(card, directCards, bonusCards);

  const isMobileSideLayout = typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 820px)").matches;

  if (isMobileSideLayout) {
    sideEl.innerHTML = "";
    sideEl.classList.add("mobile-sidecards-suppressed");

    const compactNote = document.createElement("div");
    compactNote.className = "side-empty-note mobile-sidecards-note";
    compactNote.textContent = "모바일에서는 위 보너스 개념 카드를 눌러 필요한 설명만 펼쳐 보세요.";
    sideEl.appendChild(compactNote);

    renderExternalResources(card, directCards.concat(bonusCards));
    return;
  }

  sideEl.classList.remove("mobile-sidecards-suppressed");

  function getSideText(sc) {
    return sc.body || sc.summary || sc.description || "";
  }

  function getSideDetail(sc) {
    const parts = [];
    if (sc.detail) {
      parts.push(sc.detail);
    }
    if (Array.isArray(sc.examples) && sc.examples.length > 0) {
      parts.push("예시: " + sc.examples.slice(0, 4).join(" / "));
    }
    if (Array.isArray(sc.related_concepts) && sc.related_concepts.length > 0) {
      parts.push("연관 개념: " + sc.related_concepts.slice(0, 6).join(", "));
    }
    return parts.join("\n\n");
  }

  function makeSectionTitle(text, note) {
    const wrap = document.createElement("div");
    wrap.className = "side-section-head";

    const title = document.createElement("div");
    title.className = "side-section-title";
    title.textContent = text;
    wrap.appendChild(title);

    if (note) {
      const desc = document.createElement("div");
      desc.className = "side-section-note";
      desc.textContent = note;
      wrap.appendChild(desc);
    }

    sideEl.appendChild(wrap);
  }

  function makeSideCard(sc, label) {
    const box = document.createElement("div");
    box.className = "side-card";

    const type = document.createElement("div");
    type.className = "side-card-type";
    type.textContent = label || sc.type || "개념";

    const title = document.createElement("div");
    title.className = "side-card-title";
    title.textContent = sc.title || sc.id || "개념 카드";

    const body = document.createElement("div");
    body.className = "side-card-body";
    body.textContent = getSideText(sc) || "요약 설명이 아직 없는 카드입니다.";

    box.appendChild(type);
    box.appendChild(title);
    box.appendChild(body);

    const detailText = getSideDetail(sc);
    if (detailText) {
      const detailBtn = document.createElement("button");
      detailBtn.type = "button";
      detailBtn.className = "side-detail-toggle";
      detailBtn.textContent = studyToolsTextV334A10N("자세히 보기", "View details");

      const detail = document.createElement("div");
      detail.className = "side-card-detail hidden";
      detail.textContent = detailText;

      detailBtn.addEventListener("click", function() {
        const isHidden = detail.classList.contains("hidden");
        if (isHidden) {
          detail.classList.remove("hidden");
          detailBtn.textContent = "접기";
        } else {
          detail.classList.add("hidden");
          detailBtn.textContent = studyToolsTextV334A10N("자세히 보기", "View details");
        }
      });

      box.appendChild(detailBtn);
      box.appendChild(detail);
    }

    sideEl.appendChild(box);
    markSideSeen(sc.id);
  }

  function pickRandomBackgroundCard(excludeIds) {
    const broadWords = [
      "rag", "retrieval", "vector", "embedding", "kg", "knowledge", "graph",
      "ontology", "semantic", "security", "auth", "jwt", "oauth", "secret",
      "prompt", "injection", "gpu", "cuda", "npu", "tpu", "ocr", "pdf",
      "lora", "quant", "sensor", "fusion", "state", "estimation", "kalman",
      "database", "api", "docker", "fastapi"
    ];

    const pool = sideCards.filter(function(sc) {
      if (!sc || !sc.id || excludeIds.includes(sc.id)) {
        return false;
      }

      const text = [
        sc.id,
        sc.title,
        sc.type,
        sc.body,
        sc.summary,
        sc.detail,
        (sc.related_concepts || []).join(" ")
      ].filter(Boolean).join(" ").toLowerCase();

      return broadWords.some(function(word) {
        return text.includes(word);
      });
    });

    if (pool.length === 0) {
      return null;
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  makeSectionTitle(
    "연결된 개념",
    excludedIntroIdsV306.size
      ? "상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다."
      : "현재 문제와 직접 연결된 보조 개념입니다."
  );

  if (directCards.length === 0) {
    const empty = document.createElement("div");
    empty.className = "side-empty-note";
    empty.textContent = "이 문제에는 직접 연결된 보조 개념이 없습니다.";
    sideEl.appendChild(empty);
  } else {
    directCards.forEach(function(sc) {
      makeSideCard(sc, "직접 연결");
    });
  }

  if (bonusCards.length > 0) {
    makeSectionTitle(
      "가까운 개념 둘러보기",
      "현재 카드의 concepts와 느슨하게 겹치는 개념입니다."
    );

    bonusCards.forEach(function(sc) {
      makeSideCard(sc, studyToolsTextV334A10N("연관 추천", "Related suggestion"));
    });
  }

  const excludeIds = directCards.concat(bonusCards).map(function(sc) {
    return sc.id;
  }).concat(Array.from(excludedIntroIdsV306));

  const randomCard = null; // CONTENT_QUALITY_SEMANTIC_ALIGNMENT_V339_R3: unrelated random knowledge is suppressed during quiz study.

  if (randomCard) {
    makeSectionTitle(
      studyToolsTextV334A10N("랜덤 배경지식", "Random background knowledge"),
        studyToolsTextV334A10N("퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다.", "Useful AI/development background knowledge, even when it is not directly linked to the current quiz.")
    );

    makeSideCard(randomCard, studyToolsTextV334A10N("랜덤 상식", "Random fact"));

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "side-random-next";
    nextBtn.textContent = studyToolsTextV334A10N("다른 배경지식", "Another background note");
    nextBtn.addEventListener("click", function() {
      renderSideCards(card, excludedIntroSideCardIdV306);
    });
    sideEl.appendChild(nextBtn);
  }

  renderExternalResources(card, directCards.concat(bonusCards).concat(randomCard ? [randomCard] : []));
}

function markSeen(cardId) {
  const progress = loadProgress();
  progress.seen[cardId] = (progress.seen[cardId] || 0) + 1;
  progress.lastSeenAt[cardId] = new Date().toISOString();
  saveProgress(progress);
}

function markCorrect(cardId) {
  const progress = loadProgress();
  progress.correct[cardId] = (progress.correct[cardId] || 0) + 1;
  saveProgress(progress);
}

function markConfused(cardId) {
  const progress = loadProgress();
  progress.confused[cardId] = (progress.confused[cardId] || 0) + 1;
  saveProgress(progress);
}

function checkAnswer(choice, btn) {
  const card = getCurrentCard();
  const resultBox = document.getElementById("resultBox");

  const expected = normalizeAnswer(card.answer);
  const actual = normalizeAnswer(choice);
  const ok = actual === expected;

  const allBtns = document.querySelectorAll(".choice-btn");
  allBtns.forEach(function(b) {
    b.disabled = true;
  });

  if (ok) {
    btn.classList.add("correct");
    resultBox.className = "result-box good";
    resultBox.textContent = "정답. " + (card.explanation || "");
    markCorrect(card.id);
  } else {
    btn.classList.add("wrong");
    resultBox.className = "result-box bad";
    resultBox.textContent = "오답. 정답: " + expected + " / " + (card.explanation || "");
    markConfused(card.id);
  }

  document.getElementById("nextBtn").classList.add("primary-next");
}

function nextCard() {
  currentIndex = Math.min(cards.length - 1, currentIndex + 1);
  renderCard();
}

function prevCard() {
  currentIndex = Math.max(0, currentIndex - 1);
  renderCard();
}

function jumpToConfusedOrNext() {
  const card = getCurrentCard();
  const resultBox = document.getElementById("resultBox");

  markConfused(card.id);

  resultBox.className = "result-box bad";
  resultBox.textContent = "모르겠음 처리. 정답: " + normalizeAnswer(card.answer) + " / " + (card.explanation || "");
  document.getElementById("nextBtn").classList.add("primary-next");

  const allBtns = document.querySelectorAll(".choice-btn");
  allBtns.forEach(function(b) {
    b.disabled = true;
  });
}


function resetProgress() {
  const ok = confirm("진도만 초기화합니다. 메모는 유지됩니다. 계속할까요?");
  if (!ok) {
    return;
  }
  localStorage.removeItem(progressKey);
  renderCard();
  renderProgress();
}

function getAllConcepts() {
  const map = new Map();

  if (curriculum && Array.isArray(curriculum.levels)) {
    curriculum.levels.forEach(function(level) {
      (level.concepts || []).forEach(function(concept) {
        if (!map.has(concept)) {
          map.set(concept, {
            concept: concept,
            levels: new Set(),
            cards: []
          });
        }
        map.get(concept).levels.add(level.level);
      });
    });
  }

  cards.forEach(function(card) {
    (card.concepts || []).forEach(function(concept) {
      if (!map.has(concept)) {
        map.set(concept, {
          concept: concept,
          levels: new Set(),
          cards: []
        });
      }
      map.get(concept).levels.add(card.level);
      map.get(concept).cards.push(card);
    });
  });

  return Array.from(map.values()).map(function(item) {
    return {
      concept: item.concept,
      levels: Array.from(item.levels).sort(function(a, b) { return a - b; }),
      cards: item.cards
    };
  }).sort(function(a, b) {
    const al = a.levels[0] || 999;
    const bl = b.levels[0] || 999;
    if (al !== bl) {
      return al - bl;
    }
    return a.concept.localeCompare(b.concept);
  });
}

function renderOutline() {
  const concepts = getAllConcepts();
  const progress = loadProgress();
  document.getElementById("outlineSummary").textContent = concepts.length + "개 개념";

  const list = document.getElementById("outlineList");
  list.innerHTML = "";

  concepts.forEach(function(item) {
    const btn = document.createElement("button");
    btn.className = "outline-item";

    const title = document.createElement("div");
    title.className = "outline-title";
    title.textContent = item.concept;

    const seen = item.cards.filter(function(card) {
      return progress.seen[card.id];
    }).length;

    const correct = item.cards.filter(function(card) {
      return progress.correct[card.id];
    }).length;

    const confused = item.cards.filter(function(card) {
      return progress.confused[card.id];
    }).length;

    const total = item.cards.length;
    const percent = total === 0 ? 0 : Math.round((seen / total) * 100);

    const meta = document.createElement("div");
    meta.className = "outline-meta";
    meta.textContent = isEnglishLocaleV334A10N()
    ? "Level " + item.levels.join(", ") + " · related cards " + total + " · seen " + seen + " · correct " + correct + " · not sure " + confused
    : "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;

    const bar = document.createElement("div");
    bar.className = "outline-mini-progress";

    const fill = document.createElement("div");
    fill.className = "outline-mini-fill";
    fill.style.width = percent + "%";

    bar.appendChild(fill);

    btn.appendChild(title);
    btn.appendChild(meta);
    btn.appendChild(bar);

    btn.onclick = function() {
      renderConceptDetail(item.concept);
    };

    list.appendChild(btn);
  });

  if (!activeConcept && concepts.length > 0) {
    renderConceptDetail(concepts[0].concept);
  }
}

function renderConceptDetail(concept) {
  activeConcept = concept;

  const info = conceptInfo[concept] || {
    definition: "아직 직접 작성한 정의가 없습니다. 공부하면서 이 개념을 내 말로 정리해보세요.",
    example: "(예시 준비 중)"
  };

  document.getElementById("conceptTitle").textContent = concept;
  document.getElementById("conceptDefinition").textContent = info.definition;
  document.getElementById("conceptExample").textContent = info.example;

  const related = cards.filter(function(card) {
    return (card.concepts || []).includes(concept);
  });

  const relatedEl = document.getElementById("relatedCards");
  relatedEl.innerHTML = "";

  if (related.length === 0) {
    relatedEl.textContent = "아직 관련 카드가 없습니다.";
  } else {
    related.forEach(function(card) {
      const btn = document.createElement("button");
      btn.className = "related-card-btn";
      btn.textContent = "L" + card.level + " · " + card.title;
      btn.onclick = function() {
        currentIndex = cards.findIndex(function(c) { return c.id === card.id; });
        renderCard();
        setView("learn");
      };
      relatedEl.appendChild(btn);
    });
  }

  loadConceptMemo(concept);
}

function cardMemoKey(cardId) {
  return cardMemoPrefix + cardId;
}

function conceptMemoKey(concept) {
  return conceptMemoPrefix + concept;
}

function loadCardMemo(cardId) {
  const memo = localStorage.getItem(cardMemoKey(cardId)) || "";
  document.getElementById("cardMemo").value = memo;
}

function saveCardMemo() {
  const card = getCurrentCard();
  const value = document.getElementById("cardMemo").value;
  localStorage.setItem(cardMemoKey(card.id), value);
  alert("카드 메모를 저장했습니다.");
}

function loadConceptMemo(concept) {
  const memo = localStorage.getItem(conceptMemoKey(concept)) || "";
  document.getElementById("conceptMemo").value = memo;
}

function saveConceptMemo() {
  if (!activeConcept) {
    alert("먼저 목차에서 개념을 선택하세요.");
    return;
  }
  const value = document.getElementById("conceptMemo").value;
  localStorage.setItem(conceptMemoKey(activeConcept), value);
  alert("개념 메모를 저장했습니다.");
}

function collectNotes() {
  const notes = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) {
      continue;
    }

    if (key.startsWith(cardMemoPrefix)) {
      const cardId = key.slice(cardMemoPrefix.length);
      const card = cards.find(function(c) { return c.id === cardId; });
      notes.push({
        type: "card",
        id: cardId,
        title: card ? card.title : cardId,
        body: localStorage.getItem(key) || ""
      });
    }

    if (key.startsWith(conceptMemoPrefix)) {
      const concept = key.slice(conceptMemoPrefix.length);
      notes.push({
        type: "concept",
        id: concept,
        title: concept,
        body: localStorage.getItem(key) || ""
      });
    }
  }

  return notes.filter(function(note) {
    return note.body.trim().length > 0;
  }).sort(function(a, b) {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    return a.title.localeCompare(b.title);
  });
}

function renderNotesList() {
  const notes = collectNotes();
  const box = document.getElementById("notesList");
  box.innerHTML = "";

  if (notes.length === 0) {
    box.innerHTML = '<p class="muted">' + studyToolsTextV334A10N("아직 저장된 메모가 없습니다.", "No saved notes yet.") + '</p>';
    return;
  }

  notes.forEach(function(note) {
    const item = document.createElement("div");
    item.className = "note-item";

    const title = document.createElement("div");
    title.className = "note-title";
    title.textContent = "[" + note.type + "] " + note.title;

    const body = document.createElement("pre");
    body.className = "note-body";
    body.textContent = note.body;

    item.appendChild(title);
    item.appendChild(body);
    box.appendChild(item);
  });
}

function downloadNotes() {
  const notes = collectNotes();
  const lines = [];

  lines.push("# Python Reading Trainer Notes");
  lines.push("");
  lines.push("- Exported at: " + new Date().toISOString());
  lines.push("- 저장 위치: 이 파일은 브라우저 localStorage 메모를 Markdown으로 내보낸 백업입니다.");
  lines.push("");

  notes.forEach(function(note) {
    lines.push("## " + note.type + ": " + note.title);
    lines.push("");
    lines.push(note.body);
    lines.push("");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  a.href = url;
  a.download = "python-reading-trainer-notes-" + day + ".md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderProgress() {
  const progress = loadProgress();
  const total = cards.length;
  const seenCount = Object.keys(progress.seen).length;
  const correctCount = Object.keys(progress.correct).length;
  const confusedCount = Object.keys(progress.confused).length;

  const byLevel = new Map();
  cards.forEach(function(card) {
    if (!byLevel.has(card.level)) {
      byLevel.set(card.level, { total: 0, seen: 0, correct: 0, confused: 0 });
    }
    const row = byLevel.get(card.level);
    row.total += 1;
    if (progress.seen[card.id]) row.seen += 1;
    if (progress.correct[card.id]) row.correct += 1;
    if (progress.confused[card.id]) row.confused += 1;
  });

  const dash = document.getElementById("progressDashboard");
  dash.innerHTML = "";

  const summary = document.createElement("div");
  summary.className = "summary-grid";
  summary.innerHTML =
    '<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">' + studyToolsTextV334A10N("전체 카드", "Total cards") + '</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("본 카드", "Seen cards") + '</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("맞힌 카드", "Correct cards") + '</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("헷갈린 카드", "Not sure cards") + '</div></div>';

  dash.appendChild(summary);

  const table = document.createElement("div");
  table.className = "level-table";

  Array.from(byLevel.keys()).sort(function(a, b) { return a - b; }).forEach(function(level) {
    const row = byLevel.get(level);
    const percent = row.total === 0 ? 0 : Math.round((row.seen / row.total) * 100);

    const div = document.createElement("div");
    div.className = "level-row";
    div.innerHTML =
      '<div class="level-row-title">Level ' + level + '</div>' +
      '<div class="level-row-bar"><div class="level-row-fill" style="width:' + percent + '%"></div></div>' +
      '<div class="level-row-meta">' + (
      isEnglishLocaleV334A10N()
        ? 'seen ' + row.seen + '/' + row.total + ' · correct ' + row.correct + ' · not sure ' + row.confused
        : '본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused
    ) + '</div>';

    table.appendChild(div);
  });

  dash.appendChild(table);
}


// === STATIC_UI_I18N_V334_A10 START ===
function getStaticUiEnglishMapV334A10() {
  return new Map(Object.entries({
    "코드 독해 반복훈련": "Code reading drills",
    "진도 초기화": "Reset progress",
    "학습": "Learn",
    "목차": "Outline",
    "진행현황": "Progress",
    "메모": "Notes",
    "코드해석": "Code explainer",
    "명령어해석": "Command explainer",
    "프로젝트분석": "Project analyzer",

    "읽기 목표": "Reading goal",
    "이전": "Previous",
    "모르겠음": "Not sure",
    "다음": "Next",
    "사이드 카드": "Side card",
    "프로젝트 연결": "Project connection",
    "현재 카드 메모": "Current card note",
    "카드 메모 저장": "Save card note",
    "전체 목차": "Full outline",
    "개념을 선택하세요": "Select a concept",
    "예시": "Example",
    "관련 카드": "Related cards",
    "개념 메모": "Concept note",
    "개념 메모 저장": "Save concept note",
    "내 메모": "My notes",
    "메모 새로고침": "Refresh notes",
    "Markdown 다운로드": "Download Markdown",

    "개념 안내": "Concept note",
    "연결된 개념": "Linked concepts",
    "가까운 개념 둘러보기": "Explore nearby concepts",
    "연관 추천": "Related suggestion",
    "상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다.": "Cards already used in the top concept note are not repeated here.",
    "이 문제에는 직접 연결된 보조 개념이 없습니다.": "There is no directly linked supplementary concept for this question.",
    "현재 카드의 concepts와 느슨하게 겹치는 개념입니다.": "These are concepts that loosely overlap with the current card concepts.",
    "사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다.": "Only the general concept explanation from the side card is shown first. Examples and answer explanations are checked after solving the question.",

    "학습 도구 · 현재 필터 기준으로 검색/오늘 큐 생성": "Study tools · Search and build today's queue from current filters",
    "추천 진도로 오늘 10장": "Today 10 from recommended level",
    "추천만 적용": "Apply recommendation",
    "이 메모는 현재 브라우저에만 저장됩니다.": "These notes are stored only in this browser.",
    "아직 저장된 메모가 없습니다.": "No saved notes yet.",
    "붙여넣은 코드를 초보자 눈높이로 순서대로 설명": "Explains pasted code step by step at a beginner-friendly level",
    "Python 함수, 조건, 반복, 반환 흐름 요약": "Summarizes Python functions, conditions, loops, and return flow",
    "JavaScript 기본 함수, DOM, 이벤트 패턴 설명": "Explains basic JavaScript functions, DOM, and event patterns",
    "설정파일과 짧은 코드의 대표 구조 설명": "Explains common structures in config files and short code snippets",
    "Mermaid 학습용 흐름도 초안 생성": "Creates draft Mermaid flowcharts for learning",
    "모든 언어를 완전 파싱하는 도구는 아님": "This is not a complete parser for every language",
    "전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음": "It does not precisely analyze full function call graphs or data flow",
    "터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합": "Use Command explainer for safer terminal command review",
    "프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합": "Use Project analyzer for understanding whole project structure",
    "PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.": "Paste PowerShell, Python, JavaScript, Cloudflare Workers, or Java code to generate beginner-friendly step-by-step explanations and flowcharts.",
    "분석하면 자동감지 결과와 판단 근거가 표시됩니다.": "After analysis, automatic detection results and reasoning will appear.",
    "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.": "After analysis, step count, risky lines, and main categories will be summarized.",
    "분석하면 확실/추정/미지원 단계가 표시됩니다.": "After analysis, exact, inferred, and unsupported steps will be shown.",
    "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.": "After analysis, data flow and function call flow will be shown.",
    "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.": "After analyzing long code, the overall structure, main functions/sections, and reading order will be shown.",
    "주의/위험 명령": "Caution/risky commands",
    "해석 후 더 읽어보기": "Read more after analysis",
    "사이드카드 보충": "Side-card supplement",
    "PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.": "Paste PowerShell or Bash commands to get a beginner-friendly explanation of the work order, file impact, risky commands, and Git impact.",
    "현재 셸 기본 예제": "Default example for current shell",
    "선택 예제 불러오기": "Load selected example",
    "명령어 분석": "Analyze command",
    "명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.": "Commands are not executed; they are analyzed statically. Examples cover Git save flows, risky deletion, virtual environment execution, and validation/commit routines.",
    "명령어 요약": "Command summary",
    "아직 분석한 명령어가 없습니다.": "No command has been analyzed yet.",
    "작업 순서": "Work order",
    "로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.": "Enter a local project root to generate a read-only scan command, then paste the output to analyze the project structure.",
    "1. 프로젝트 루트 입력": "1. Enter project root",
    "명령 생성": "Generate command",
    "2. 생성된 PowerShell 명령": "2. Generated PowerShell command",
    "아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.": "The command below does not modify files. It only creates summary reports under .tmp and does not print .env contents or full file bodies.",
    "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.": "Enter a project root and press Generate command.",
    "3. 터미널 출력 붙여넣기": "3. Paste terminal output",
    "붙여넣은 결과 분석": "Analyze pasted output",
    "5. 분석 요약": "5. Analysis summary",
    "아직 분석 결과가 없습니다.": "No analysis result yet.",
    "프로젝트 Mermaid 원문 보기": "View project Mermaid source",
    "다음 확인 명령어": "Next check commands",
    "분석 후 추천 확인 명령이 표시됩니다.": "Recommended follow-up check commands will appear after analysis.",
    "다음 확인 명령어": "Next check commands",
    "분석 후 추천 확인 명령이 표시됩니다.": "Recommended follow-up check commands will appear after analysis.",
    "설정 접기": "Collapse settings",
    "설정 열기": "Open settings",
    "조건 적용": "Apply filters",
    "현재 조건으로 오늘 최대 10장": "Up to 10 today from current filters",
    "랜덤 1장": "Random 1 card",
    "조건 초기화": "Reset filters",
    "큐 첫 장": "First in queue",
    "현재 카드 완료 표시": "Mark current card done",
    "큐 다음": "Next in queue",
    "큐 완료표시 초기화": "Reset queue completion",
    "큐 비우기": "Clear queue",
    "복습 우선": "Review first",
    "전체 레벨": "All levels",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",

    "코드해석은 이런 때 쓰세요": "Use Code explainer when",
    "잘하는 것": "Good for",
    "한계": "Limits",
    "분석하기": "Analyze",
    "입력 지우기": "Clear input",
    "흐름도 코드 복사": "Copy flowchart code",
    "텍스트 리포트 복사": "Copy text report",
    "종합 해설": "Overall explanation",
    "주의/위험 명령": "Caution/risky commands",
    "각 부분별 해설": "Section-by-section explanation",
    "해석 후 더 읽어보기": "Read more after analysis",
    "사이드카드 보충": "Side-card supplement",
    "Mermaid 흐름도": "Mermaid flowchart",
    "크게 보기": "Open large view",
    "SVG 다운로드": "Download SVG",
    "SVG 원문 복사": "Copy SVG source",
    "Mermaid 원문 보기": "Show Mermaid source",
    "언어": "Language",
    "자동 감지": "Auto detect",
    "선택 언어 예제": "Load selected language sample",
    "위험/주의 단계만 보기": "Show only caution/risk steps",

    "명령 복사": "Copy command",
    "초기화": "Reset",
    "명령어해석": "Command explainer",
    "셸": "Shell",
    "예제": "Example",
    "프로젝트분석": "Project analyzer"
  }));
}

function getStaticUiEnglishAttributeMapV334A10() {
  return new Map(Object.entries({
    "카드 검색: 예) FastAPI, RAG, JSONL, 에러": "Search cards: e.g. FastAPI, RAG, JSONL, error",
    "이 카드에서 헷갈린 점을 적어두세요.": "Write what was confusing about this card.",
    "이 개념에 대해 더 알아본 내용, 내 식의 설명, 헷갈린 점을 Markdown으로 적어두세요.": "Write what you learned, your own explanation, or confusing points about this concept in Markdown.",
    "여기에 PowerShell, Python, JavaScript, Workers, Java, package.json, GitHub Actions YAML 코드를 붙여넣으세요.": "Paste PowerShell, Python, JavaScript, Workers, Java, package.json, or GitHub Actions YAML code here."
  }));
}

function applyStaticUiRegexEnglishV334A10(text) {
  const rules = [
    {
      re: /^추천 L(.+) · 남은 (.+) · 큐 (.+)$/,
      fn: function(m) { return "Recommended L" + m[1] + " · remaining " + m[2] + " · queue " + m[3]; }
    },
    {
      re: /^현재 L(.+) · 추천 L(.+) · 안 본 (.+) · 모르겠음 (.+) · 맞힘 (.+) \/ (.+)$/,
      fn: function(m) { return "Current L" + m[1] + " · recommended L" + m[2] + " · unseen " + m[3] + " · not sure " + m[4] + " · correct " + m[5] + " / " + m[6]; }
    },
    {
      re: /^조건 일치 (.+)장 \/ 전체 (.+)장 · 본 카드 (.+)장 · 모르겠음 (.+)장$/,
      fn: function(m) { return "Matches " + m[1] + " / " + m[2] + " cards · seen " + m[3] + " · not sure " + m[4]; }
    },
    {
      re: /^현재 조건: (.+) · (.+) · 오늘 큐 (.+)장\. 10장을 원하면 레벨을 전체 레벨로 바꾸세요\.$/,
      fn: function(m) { return "Current filters: " + m[1] + " · " + m[2] + " · today's queue " + m[3] + ". To build 10 cards, change the level to All levels."; }
    },
    {
      re: /^오늘 큐 (.+) \/ (.+) 완료$/,
      fn: function(m) { return "Today's queue " + m[1] + " / " + m[2] + " complete"; }
    }
  ];

  for (const rule of rules) {
    const match = text.match(rule.re);
    if (match) {
      return rule.fn(match);
    }
  }

  return null;
}

function shouldSkipStaticUiNodeV334A10(node) {
  const parent = node && node.parentElement;
  if (!parent) {
    return true;
  }

  return Boolean(parent.closest("script, style, pre, code, textarea, .code-block, .mermaid, #codeInput, #commandInput, #projectProbeCommand"));
}

function translateStaticUiTextValueV334A10(value) {
  if (currentLanguage !== "en" || typeof value !== "string") {
    return value;
  }

  const map = getStaticUiEnglishMapV334A10();
  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) {
    return value;
  }

  const exact = map.get(trimmed);
  const regex = exact || applyStaticUiRegexEnglishV334A10(trimmed);

  if (!regex || regex === trimmed) {
    return value;
  }

  const leading = value.match(/^\s*/)[0];
  const trailing = value.match(/\s*$/)[0];
  return leading + regex + trailing;
}

function localizeStaticUiOnceV334A10() {
  if (currentLanguage !== "en" || !document.body) {
    return;
  }

  const attrMap = getStaticUiEnglishAttributeMapV334A10();

  document.querySelectorAll("[placeholder]").forEach(function(el) {
    const current = el.getAttribute("placeholder");
    if (attrMap.has(current)) {
      el.setAttribute("placeholder", attrMap.get(current));
    }
  });

  document.querySelectorAll("[title]").forEach(function(el) {
    const current = el.getAttribute("title");
    const next = translateStaticUiTextValueV334A10(current);
    if (next !== current) {
      el.setAttribute("title", next);
    }
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(function(node) {
    if (shouldSkipStaticUiNodeV334A10(node)) {
      return;
    }

    const next = translateStaticUiTextValueV334A10(node.nodeValue);
    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  });
}

function scheduleStaticUiI18nV334A10() {
  if (window.__staticUiI18nScheduledV334A10) {
    return;
  }

  window.__staticUiI18nScheduledV334A10 = true;
  window.setTimeout(function() {
    window.__staticUiI18nScheduledV334A10 = false;
    localizeStaticUiOnceV334A10();
  }, 30);
}

function startStaticUiI18nV334A10() {
  if (currentLanguage !== "en") {
    return;
  }

  localizeStaticUiOnceV334A10();
  [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
    window.setTimeout(localizeStaticUiOnceV334A10, delay);
  });

  if (window.__staticUiI18nObserverV334A10 || !document.body) {
    return;
  }

  window.__staticUiI18nObserverV334A10 = new MutationObserver(scheduleStaticUiI18nV334A10);
  window.__staticUiI18nObserverV334A10.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
// === STATIC_UI_I18N_V334_A10 END ===


// === DYNAMIC_CONCEPT_I18N_V334_A10B START ===
var staticUiTmMapV334A10B = null;
var staticUiTmNormMapV334A10B = null;
var staticUiTmLoadingV334A10B = false;

function getDynamicConceptFallbackMapV334A10B() {
  return new Map(Object.entries({
    "학습 도구": "Study tools",
    "현재 필터 기준으로 검색/오늘 큐 생성": "Search and build today's queue from current filters",
    "현재 조건": "Current filters",
    "복습 우선": "Review first",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "전체 레벨": "All levels",

    "len 기본 개념": "Basic concept of len",
    "리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다.": "Gets the length or count of data such as lists, strings, and dicts.",
    "사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다.": "Only the general concept explanation from the side card is shown first. Examples and answer explanations are checked after solving the question.",

    "그래프: 노드와 관계": "Graph: Nodes and relationships",
    "그래프는 노드와 관계로 이루어진 구조다.": "A graph is a structure made of nodes and relationships.",
    "노드는 개념, 사람, 문서, 장소처럼 하나의 대상이고, 관계는 그 대상들이 어떻게 연결되는지 나타낸다.": "A node is an entity such as a concept, person, document, or place; a relationship shows how those entities are connected."
  }));
}

function applyKnownPhraseReplacementsV334A10B(value) {
  if (typeof applyEnglishResidualPhrasePatchV334A10F === "function") {
    return applyEnglishResidualPhrasePatchV334A10F(value);
  }
  if (typeof applyEnglishResidualPhrasePatchV334A10E === "function") {
    return applyEnglishResidualPhrasePatchV334A10E(value);
  }
  if (typeof applyEnglishResidualPhrasePatchV334A10D === "function") {
    return applyEnglishResidualPhrasePatchV334A10D(value);
  }
  return value;
}

function loadTranslationMemoryForRuntimeI18nV334A10B() {
  if (currentLanguage !== "en") {
    return Promise.resolve(false);
  }

  if (staticUiTmMapV334A10B && staticUiTmNormMapV334A10B) {
    return Promise.resolve(true);
  }

  if (staticUiTmLoadingV334A10B) {
    return Promise.resolve(false);
  }

  staticUiTmLoadingV334A10B = true;

  const tmPath = "../../docs/quality/translation_memory/v334_a8_ko_en_translation_memory.jsonl";
  const url = typeof withDataVersion === "function" ? withDataVersion(tmPath) : tmPath;

  return fetch(url)
    .then(function(res) {
      if (!res.ok) {
        throw new Error("translation memory fetch failed: " + res.status);
      }
      return res.text();
    })
    .then(function(raw) {
      const exact = new Map();
      const norm = new Map();
      const fallback = getDynamicConceptFallbackMapV334A10B();

      fallback.forEach(function(en, ko) {
        exact.set(ko, en);
        norm.set(ko.replace(/\s+/g, " ").trim(), en);
      });

      raw.split(/\r?\n/).forEach(function(line) {
        if (!line.trim()) {
          return;
        }

        try {
          const row = JSON.parse(line);
          if (!row || typeof row.ko !== "string" || typeof row.en !== "string") {
            return;
          }

          if (!/[가-힣]/.test(row.ko) || !row.en.trim()) {
            return;
          }

          if (row.status && row.status !== "translated") {
            return;
          }

          if (!exact.has(row.ko)) {
            exact.set(row.ko, row.en);
          }

          const key = row.ko.replace(/\s+/g, " ").trim();
          if (!norm.has(key)) {
            norm.set(key, row.en);
          }
        } catch (error) {
          // Ignore malformed JSONL rows.
        }
      });

      staticUiTmMapV334A10B = exact;
      staticUiTmNormMapV334A10B = norm;
      staticUiTmLoadingV334A10B = false;

      console.log("V334_A10B_RUNTIME_TM_LOADED", exact.size);
      return true;
    })
    .catch(function(error) {
      staticUiTmLoadingV334A10B = false;
      console.warn("V334_A10B_RUNTIME_TM_LOAD_FAILED", error);
      return false;
    });
}

function translateStaticUiTextValueV334A10(value) {
  if (currentLanguage !== "en" || typeof value !== "string") {
    return value;
  }

  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed || !/[가-힣]/.test(trimmed)) {
    return value;
  }

  const fallback = getDynamicConceptFallbackMapV334A10B();
  const baseMap = typeof getStaticUiEnglishMapV334A10 === "function"
    ? getStaticUiEnglishMapV334A10()
    : new Map();

  let translated = null;

  if (baseMap.has(trimmed)) {
    translated = baseMap.get(trimmed);
  } else if (fallback.has(trimmed)) {
    translated = fallback.get(trimmed);
  } else if (staticUiTmMapV334A10B && staticUiTmMapV334A10B.has(trimmed)) {
    translated = staticUiTmMapV334A10B.get(trimmed);
  } else if (staticUiTmNormMapV334A10B && staticUiTmNormMapV334A10B.has(trimmed)) {
    translated = staticUiTmNormMapV334A10B.get(trimmed);
  } else if (typeof applyStaticUiRegexEnglishV334A10 === "function") {
    translated = applyStaticUiRegexEnglishV334A10(trimmed);
  }

  if (!translated) {
    const phraseFixed = applyKnownPhraseReplacementsV334A10B(trimmed);
    if (phraseFixed !== trimmed) {
      translated = phraseFixed;
    }
  }

  if (!translated || translated === trimmed) {
    return value;
  }

  const leading = value.match(/^\s*/)[0];
  const trailing = value.match(/\s*$/)[0];
  return leading + translated + trailing;
}

function startStaticUiI18nV334A10() {
  if (currentLanguage !== "en") {
    return;
  }

  localizeStaticUiOnceV334A10();

  loadTranslationMemoryForRuntimeI18nV334A10B().then(function() {
    localizeStaticUiOnceV334A10();
    [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
      window.setTimeout(localizeStaticUiOnceV334A10, delay);
    });
  });

  [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
    window.setTimeout(localizeStaticUiOnceV334A10, delay);
  });

  if (window.__staticUiI18nObserverV334A10 || !document.body) {
    return;
  }

  window.__staticUiI18nObserverV334A10 = new MutationObserver(scheduleStaticUiI18nV334A10);
  window.__staticUiI18nObserverV334A10.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
// === DYNAMIC_CONCEPT_I18N_V334_A10B END ===

async function init() {
  renderLanguageToggleV334A9();
  startStaticUiI18nV334A10();
  const curriculumRes = await fetch(withDataVersion(localizedDataPath("../../data/curriculum/curriculum_v1.json")));
  const lessonFiles = [
    "../../data/lessons/cards_seed_v1.json",
    "../../data/lessons/python_core_expansion_v1.json",
    "../../data/lessons/python_practical_expansion_v2.json",
    "../../data/lessons/python_broad_expansion_v3.json",
    "../../data/lessons/python_deep_expansion_v4.json",
    "../../data/lessons/python_advanced_expansion_v5.json",
    "../../data/lessons/python_project_expansion_v6.json",
    "../../data/lessons/python_realworld_expansion_v8.json",
    "../../data/lessons/python_daily_review_expansion_v9.json",
    "../../data/lessons/python_foundation_expansion_v10.json",
    "../../data/lessons/python_libraries_missing_topics_v11.json",
    "../../data/lessons/python_ai_toolchain_expansion_v12.json",
    "../../data/lessons/python_compute_concepts_v13.json",
    "../../data/lessons/python_ai_learning_methods_v14.json",
    "../../data/lessons/python_grouped_concepts_v15.json",
    "../../data/lessons/python_rag_kg_pipeline_review_v16.json",
    "../../data/lessons/python_debug_logs_cache_git_v17.json",
    "../../data/lessons/python_project_structure_imports_v18.json",
    "../../data/lessons/python_file_data_processing_v19.json",
    "../../data/lessons/python_fastapi_api_server_v20.json",
    "../../data/lessons/python_database_sql_repository_v21.json",
    "../../data/lessons/python_auth_security_tokens_v22.json",
    "../../data/lessons/python_deploy_pwa_cache_storage_v23.json",
    "../../data/lessons/python_tests_validation_regression_v24.json",
    "../../data/lessons/python_logging_monitoring_ops_v25.json",
    "../../data/lessons/python_async_batch_queue_v26.json",
    "../../data/lessons/python_packaging_env_dependencies_v27.json",
    "../../data/lessons/python_debugging_error_routines_v28.json",
    "../../data/lessons/python_data_structures_json_v29.json",
    "../../data/lessons/python_function_design_io_v30.json",
    "../../data/lessons/python_class_object_datamodel_v31.json",
    "../../data/lessons/python_files_paths_project_structure_v32.json",
    "../../data/lessons/python_git_github_workflow_v33.json",
    "../../data/lessons/python_tests_validation_regression_v34.json",
    "../../data/lessons/python_web_http_api_flow_v35.json",
    "../../data/lessons/python_async_queue_batch_jobs_v36.json",
    "../../data/lessons/python_database_storage_crud_v37.json",
    "../../data/lessons/python_auth_security_tokens_permissions_v38.json",
    "../../data/lessons/python_frontend_state_storage_cache_v39.json",
    "../../data/lessons/python_refactoring_maintainability_v40.json",
    "../../data/lessons/python_architecture_layers_patterns_v41.json",
    "../../data/lessons/python_data_processing_pandas_jsonl_v42.json",
    "../../data/lessons/python_search_embedding_rag_flow_v43.json",
    "../../data/lessons/python_llm_api_prompt_validation_v44.json",
    "../../data/lessons/python_powershell_automation_reliable_scripts_v45.json",
    "../../data/lessons/python_resume_safe_pipeline_checkpoint_v46.json",
    "../../data/lessons/python_tests_regression_quality_gate_v47.json",
    "../../data/lessons/python_github_actions_ci_validation_v48.json",
    "../../data/lessons/python_learning_ux_review_algorithm_v49.json",
    "../../data/lessons/python_progress_score_mistake_note_v50.json",
    "../../data/lessons/python_pwa_install_update_ux_v51.json",
    "../../data/lessons/python_accessibility_a11y_ui_v52.json",
    "../../data/lessons/python_performance_large_card_ux_v53.json",
    "../../data/lessons/python_mobile_touch_responsive_ux_v54.json",
    "../../data/lessons/python_tag_filter_advanced_search_v55.json",
    "../../data/lessons/python_user_notes_bookmarks_v56.json",
    "../../data/lessons/python_data_governance_copyright_v57.json",
    "../../data/lessons/python_card_authoring_pipeline_v58.json",
    "../../data/lessons/python_error_recovery_retry_ux_v59.json",
    "../../data/lessons/python_analytics_privacy_optin_v60.json",
    "../../data/lessons/python_offline_first_sync_conflict_v61.json",
    "../../data/lessons/python_i18n_locale_language_toggle_v62.json",
    "../../data/lessons/python_learning_streak_goal_habit_v63.json",
    "../../data/lessons/python_dev_environment_foundation_v103_a1.json",
    "../../data/lessons/python_foundation_beginner_v94_a1_part1.json",
    "../../data/lessons/python_foundation_beginner_v94_a1_part2.json",
    "../../data/lessons/python_foundation_level2_v94_a2_part1.json",
    "../../data/lessons/python_foundation_level2_v94_a2_part2.json",
    "../../data/lessons/python_foundation_level3_v95_a1_functions.json",
    "../../data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json",
    "../../data/lessons/python_foundation_level3_v95_a3_loop_tools.json",
    "../../data/lessons/python_foundation_level3_v95_a4_file_exception_path.json",
    "../../data/lessons/python_foundation_level4_v95_a5_oop_basics.json",
    "../../data/lessons/python_beginner_mixed_review_v96_a1.json",
    "../../data/lessons/python_beginner_reading_notes_v96_a2.json",
    "../../data/lessons/python_function_scope_reading_notes_v96_a3.json",
    "../../data/lessons/python_core_gaps_v99_a1.json",
    "../../data/lessons/python_foundation_micro_gaps_v104_a1.json",
    "../../data/lessons/python_dev_environment_practical_v113_a1.json",
    "../../data/lessons/python_import_debug_beginner_v114_a1.json",
    "../../data/lessons/python_mutable_default_beginner_v115_a1.json",
    "../../data/lessons/python_oop_gap_beginner_v116_a1.json",
    "../../data/lessons/python_exception_traceback_beginner_v117_a1.json",
    "../../data/lessons/python_file_exists_mkdir_beginner_v118_a1.json",
    "../../data/lessons/python_json_error_encoding_beginner_v119_a1.json",
    "../../data/lessons/python_csv_writer_dictreader_beginner_v120_a1.json",
    "../../data/lessons/python_requests_api_beginner_v121_a1.json",
    "../../data/lessons/python_pandas_beginner_v122_a1.json",
    "../../data/lessons/python_datetime_beginner_v123_a1.json",
    "../../data/lessons/python_regex_beginner_v124_a1.json",
    "../../data/lessons/python_argparse_cli_beginner_v125_a1.json",
    "../../data/lessons/python_pathlib_argparse_file_cli_v126_a1.json",
    "../../data/lessons/python_json_csv_cli_practice_v127_a1.json",
    "../../data/lessons/python_file_cli_error_recovery_v128_a1.json",
    "../../data/lessons/python_logging_verbose_cli_beginner_v129_a1.json",
    "../../data/lessons/python_env_secret_config_beginner_v130_a1.json",
    "../../data/lessons/python_requirements_dependency_repro_v131_a1.json",
    "../../data/lessons/python_readme_setup_troubleshooting_v132_a1.json",
  ];

  const lessonResults = await Promise.all(lessonFiles.map(function(path) {
    return fetch(withDataVersion(localizedDataPath(path))).then(function(res) {
      if (!res.ok) {
        return [];
      }
      return res.json();
    });
  }));
  const sideFiles = [
    "../../data/side_cards/side_cards_seed_v1.json",
    "../../data/side_cards/language_cards_v1.json",
    "../../data/side_cards/cs_fundamentals_v1.json",
    "../../data/side_cards/ai_cards_v1.json",
    "../../data/side_cards/platform_cards_v1.json",
    "../../data/side_cards/web_app_cards_v1.json",
    "../../data/side_cards/ai_architecture_cards_v1.json",
    "../../data/side_cards/data_system_cards_v1.json",
    "../../data/side_cards/dev_environment_cards_v1.json",
    "../../data/side_cards/python_dev_environment_foundation_side_cards_v103_a1.json",
    "../../data/side_cards/python_foundation_side_cards_v94_a1_part1.json",
    "../../data/side_cards/python_foundation_side_cards_v94_a1_part2.json",
    "../../data/side_cards/python_foundation_level2_side_cards_v94_a2_part1.json",
    "../../data/side_cards/python_foundation_level2_side_cards_v94_a2_part2.json",
    "../../data/side_cards/python_foundation_level3_side_cards_v95_a1_functions.json",
    "../../data/side_cards/python_foundation_level3_side_cards_v95_a2_dict_tuple_set.json",
    "../../data/side_cards/python_foundation_level3_side_cards_v95_a3_loop_tools.json",
    "../../data/side_cards/python_foundation_level3_side_cards_v95_a4_file_exception_path.json",
    "../../data/side_cards/python_foundation_level4_side_cards_v95_a5_oop_basics.json",
    "../../data/side_cards/python_beginner_mixed_review_side_cards_v96_a1.json",
    "../../data/side_cards/python_beginner_reading_notes_side_cards_v96_a2.json",
    "../../data/side_cards/python_function_scope_reading_notes_side_cards_v96_a3.json",
    "../../data/side_cards/python_side_density_reading_pack_v97_a1.json",
    "../../data/side_cards/python_core_gaps_side_cards_v99_a1.json",
    "../../data/side_cards/python_foundation_micro_gaps_side_cards_v104_a1.json",
    "../../data/side_cards/python_zero_visible_support_side_cards_v102_a7.json",
    "../../data/side_cards/python_dev_environment_practical_side_cards_v113_a1.json",
    "../../data/side_cards/python_import_debug_beginner_side_cards_v114_a1.json",
    "../../data/side_cards/python_mutable_default_beginner_side_cards_v115_a1.json",
    "../../data/side_cards/python_oop_gap_beginner_side_cards_v116_a1.json",
    "../../data/side_cards/python_exception_traceback_beginner_side_cards_v117_a1.json",
    "../../data/side_cards/python_file_exists_mkdir_beginner_side_cards_v118_a1.json",
    "../../data/side_cards/python_json_error_encoding_beginner_side_cards_v119_a1.json",
    "../../data/side_cards/python_csv_writer_dictreader_beginner_side_cards_v120_a1.json",
    "../../data/side_cards/python_requests_api_beginner_side_cards_v121_a1.json",
    "../../data/side_cards/python_pandas_beginner_side_cards_v122_a1.json",
    "../../data/side_cards/python_datetime_beginner_side_cards_v123_a1.json",
    "../../data/side_cards/python_regex_beginner_side_cards_v124_a1.json",
    "../../data/side_cards/python_argparse_cli_beginner_side_cards_v125_a1.json",
    "../../data/side_cards/python_pathlib_argparse_file_cli_side_cards_v126_a1.json",
    "../../data/side_cards/python_json_csv_cli_practice_side_cards_v127_a1.json",
    "../../data/side_cards/python_file_cli_error_recovery_side_cards_v128_a1.json",
    "../../data/side_cards/python_logging_verbose_cli_side_cards_v129_a1.json",
    "../../data/side_cards/python_env_secret_config_side_cards_v130_a1.json",
    "../../data/side_cards/python_requirements_dependency_repro_side_cards_v131_a1.json",
    "../../data/side_cards/python_readme_setup_troubleshooting_side_cards_v132_a1.json",
  "../../data/side_cards/python_unlinked_core_gap_side_cards_v158_a1.json",
  "../../data/side_cards/python_unlinked_secondary_gap_side_cards_v159_a1.json",
  "../../data/side_cards/python_unlinked_tertiary_gap_side_cards_v160_a1.json",
  "../../data/side_cards/python_unlinked_quaternary_gap_side_cards_v161_a1.json",
  ];

  const sideResults = await Promise.all(sideFiles.map(function(path) {
    return fetch(withDataVersion(localizedDataPath(path))).then(function(res) {
      if (!res.ok) {
        return [];
      }
      return res.json();
    });
  }));

  const resourceFiles = [
    "../../data/resources/python_external_resource_cards_v97_a2.json",
    "../../data/resources/ai_tool_learning_resource_cards_v98_a1.json"
  ];

  const resourceResults = await Promise.all(resourceFiles.map(function(path) {
    return fetch(withDataVersion(localizedDataPath(path))).then(function(res) {
      if (!res.ok) {
        return [];
      }
      return res.json();
    });
  }));

  curriculum = await curriculumRes.json();
  cards = lessonResults.flat();
  sideCards = sideResults.flat();
  resourceCards = resourceResults.flat();

  if (window.CodeExplainer && typeof window.CodeExplainer.setLearningContent === "function") {
    window.CodeExplainer.setLearningContent(cards, sideCards);
  }

  cards.sort(function(a, b) {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.id.localeCompare(b.id);
  });

  document.getElementById("nextBtn").onclick = nextCard;
  document.getElementById("prevBtn").onclick = prevCard;
  document.getElementById("againBtn").onclick = jumpToConfusedOrNext;

  document.getElementById("resetBtn").onclick = resetProgress;
  document.getElementById("saveCardMemoBtn").onclick = saveCardMemo;
  document.getElementById("saveConceptMemoBtn").onclick = saveConceptMemo;
  document.getElementById("refreshNotesBtn").onclick = renderNotesList;
  document.getElementById("downloadNotesBtn").onclick = downloadNotes;

  document.querySelectorAll(".tab-btn").forEach(function(btn) {
    btn.onclick = function() {
      setView(btn.dataset.view);
    };
  });

  renderCard();
}

init().catch(function(err) {
  document.getElementById("cardTitle").textContent = "데이터 로딩 실패";
  document.getElementById("readingGoal").textContent = String(err);
});


// V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_START
function isEnglishLocaleV334A10N() {
  try {
    if (typeof window !== "undefined") {
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      if (urlLang) return String(urlLang).toLowerCase().startsWith("en");

      const stored = window.localStorage && (
        window.localStorage.getItem("pythonReadingTrainerLocaleV334") ||
        window.localStorage.getItem("python-reading-trainer-lang")
      );
      if (stored) return String(stored).toLowerCase().startsWith("en");
    }

    if (typeof document !== "undefined" && document.documentElement) {
      const lang = document.documentElement.getAttribute("lang") || "";
      if (lang) return String(lang).toLowerCase().startsWith("en");
    }
  } catch (error) {
    return false;
  }

  return false;
}

function studyToolsTextV334A10N(ko, en) {
  return isEnglishLocaleV334A10N() ? en : ko;
}
// V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_END

// === STUDY TOOLS V7 START ===
(function() {
  const toolsStateKey = "python-reading-trainer-study-tools-v7";

  function getProgressSafe() {
    try {
      if (typeof loadProgress === "function") {
        return loadProgress();
      }
    } catch (error) {
      console.warn("progress load failed", error);
    }
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function saveToolsState(state) {
    localStorage.setItem(toolsStateKey, JSON.stringify(state));
  }

  function loadToolsState() {
    const raw = localStorage.getItem(toolsStateKey);
    if (!raw) {
      return { query: "", level: "all", mode: "all", queueIds: [] };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        query: parsed.query || "",
        level: parsed.level || "all",
        mode: parsed.mode || "all",
        queueIds: Array.isArray(parsed.queueIds) ? parsed.queueIds : []
      };
    } catch {
      return { query: "", level: "all", mode: "all", queueIds: [] };
    }
  }

  function cardText(card) {
    return [
      card.id,
      card.title,
      card.reading_goal,
      card.question,
      card.explanation,
      card.project_context,
      card.code,
      (card.concepts || []).join(" ")
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function getLevelOptions() {
    const levels = Array.from(new Set(cards.map(function(card) { return card.level; }))).sort(function(a, b) { return a - b; });
    return levels;
  }

  function filterCards(state) {
    const progress = getProgressSafe();
    const query = (state.query || "").trim().toLowerCase();
    const level = state.level || "all";
    const mode = state.mode || "all";

    return cards.filter(function(card) {
      if (level !== "all" && String(card.level) !== String(level)) {
        return false;
      }
      if (query && !cardText(card).includes(query)) {
        return false;
      }
      if (mode === "unseen" && progress.seen[card.id]) {
        return false;
      }
      if (mode === "confused" && !progress.confused[card.id]) {
        return false;
      }
      if (mode === "wrong_or_unseen" && progress.correct[card.id] && !progress.confused[card.id]) {
        return false;
      }
      return true;
    });
  }

  function setCurrentCardById(cardId) {
    const index = cards.findIndex(function(card) { return card.id === cardId; });
    if (index < 0) {
      return;
    }
    currentIndex = index;
    renderCard();
    renderProgress();
    if (typeof setView === "function") {
      setView("learn");
    }
  }

  function makeTodayQueue(state) {
    const progress = getProgressSafe();
    const candidates = filterCards({
      query: state.query,
      level: state.level,
      mode: "wrong_or_unseen",
      queueIds: []
    });

    candidates.sort(function(a, b) {
      const ac = progress.confused[a.id] ? 0 : progress.seen[a.id] ? 2 : 1;
      const bc = progress.confused[b.id] ? 0 : progress.seen[b.id] ? 2 : 1;
      if (ac !== bc) {
        return ac - bc;
      }
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.id.localeCompare(b.id);
    });

    return candidates.slice(0, 10).map(function(card) { return card.id; });
  }

  function renderQueueList(box, state) {
    const ids = state.queueIds || [];
    const queueCards = ids.map(function(id) {
      return cards.find(function(card) { return card.id === id; });
    }).filter(Boolean);

    if (queueCards.length === 0) {
      box.innerHTML = '<div class="study-tools-empty">' + studyToolsTextV334A10N("오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.", "Today's queue is empty. Change filters or press Today 10.") + '</div>';
      return;
    }

    box.innerHTML = "";
    queueCards.forEach(function(card, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "study-tools-card-btn";
      btn.innerHTML = '<span class="study-tools-num">' + (index + 1) + '</span><span>' + card.title + '</span><small>Lv.' + card.level + '</small>';
      btn.onclick = function() {
        setCurrentCardById(card.id);
      };
      box.appendChild(btn);
    });
  }

  function injectStudyToolsStyle() {
    if (document.getElementById("studyToolsV7Style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "studyToolsV7Style";
    style.textContent = `
      .study-tools-panel {
        margin: 14px 0 18px;
        padding: 14px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.035);
      }
      .study-tools-title {
        font-weight: 800;
        margin-bottom: 10px;
      }
      .study-tools-controls {
        display: grid;
        grid-template-columns: 1fr 110px 150px;
        gap: 8px;
      }
      .study-tools-controls input,
      .study-tools-controls select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        border-radius: 12px;
        font-size: 14px;
        box-sizing: border-box;
      }
      .study-tools-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .study-tools-actions button,
      .study-tools-card-btn {
        border: 0;
        border-radius: 999px;
        padding: 9px 12px;
        background: #111827;
        color: white;
        font-weight: 700;
        cursor: pointer;
      }
      .study-tools-actions button.secondary {
        background: #e5e7eb;
        color: #111827;
      }
      .study-tools-status {
        margin-top: 10px;
        font-size: 13px;
        color: #475569;
      }
      .study-tools-queue {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 8px;
        margin-top: 10px;
      }
      .study-tools-card-btn {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        border-radius: 14px;
        background: #f8fafc;
        color: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.35);
        text-align: left;
      }
      .study-tools-card-btn small {
        margin-left: auto;
        color: #64748b;
      }
      .study-tools-num {
        min-width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #111827;
        color: white;
        font-size: 12px;
      }
      .study-tools-empty {
        padding: 10px 0;
        color: #64748b;
        font-size: 13px;
      }
      @media (max-width: 720px) {
        .study-tools-controls {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectStudyToolsPanel() {
    if (!Array.isArray(cards) || cards.length === 0) {
      return false;
    }
    if (document.getElementById("studyToolsV7")) {
      refreshStudyToolsPanel();
      return true;
    }

    injectStudyToolsStyle();

    const learnView = document.getElementById("learnView") || document.querySelector(".active-view") || document.body;
    const panel = document.createElement("section");
    panel.id = "studyToolsV7";
    panel.className = "study-tools-panel";

    const levels = getLevelOptions();
    const levelOptions = ['<option value="all">전체 레벨</option>'].concat(levels.map(function(level) {
      return '<option value="' + level + '">Lv.' + level + '</option>';
    })).join("");

    panel.innerHTML = `
      <div class="study-tools-title">학습 도구</div>
      <div class="study-tools-controls">
        <input id="studyToolsQuery" type="search" placeholder="카드 검색: 예) FastAPI, RAG, JSONL, 에러" />
        <select id="studyToolsLevel">${levelOptions}</select>
        <select id="studyToolsMode">
          <option value="all">전체</option>
          <option value="unseen">${studyToolsTextV334A10N("안 본 카드", "Unseen cards")}</option>
          <option value="confused">모르겠음 카드</option>
          <option value="wrong_or_unseen">복습 우선</option>
        </select>
      </div>
      <div class="study-tools-actions">
        <button type="button" id="studyToolsApply">조건 적용</button>
        <button type="button" id="studyToolsToday">오늘 10장 만들기</button>
        <button type="button" id="studyToolsRandom" class="secondary">랜덤 1장</button>
        <button type="button" id="studyToolsClear" class="secondary">조건 초기화</button>
      </div>
      <div id="studyToolsStatus" class="study-tools-status"></div>
      <div id="studyToolsQueue" class="study-tools-queue"></div>
    `;

    const firstCard = document.querySelector(".card") || learnView.firstElementChild;
    if (firstCard && firstCard.parentElement) {
      firstCard.parentElement.insertBefore(panel, firstCard);
    } else {
      learnView.prepend(panel);
    }

    const state = loadToolsState();
    document.getElementById("studyToolsQuery").value = state.query || "";
    document.getElementById("studyToolsLevel").value = state.level || "all";
    document.getElementById("studyToolsMode").value = state.mode || "all";

    document.getElementById("studyToolsApply").onclick = applyStudyToolsFilter;
    document.getElementById("studyToolsToday").onclick = createTodayStudyQueue;
    document.getElementById("studyToolsRandom").onclick = jumpRandomStudyCard;
    document.getElementById("studyToolsClear").onclick = clearStudyToolsFilter;
    document.getElementById("studyToolsQuery").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        applyStudyToolsFilter();
      }
    });

    refreshStudyToolsPanel();
    return true;
  }

  function readPanelState() {
    return {
      query: document.getElementById("studyToolsQuery") ? document.getElementById("studyToolsQuery").value : "",
      level: document.getElementById("studyToolsLevel") ? document.getElementById("studyToolsLevel").value : "all",
      mode: document.getElementById("studyToolsMode") ? document.getElementById("studyToolsMode").value : "all",
      queueIds: loadToolsState().queueIds || []
    };
  }

  function refreshStudyToolsPanel() {
    const status = document.getElementById("studyToolsStatus");
    const queue = document.getElementById("studyToolsQueue");
    if (!status || !queue) {
      return;
    }
    const state = readPanelState();
    const matches = filterCards(state);
    const progress = getProgressSafe();
    const seenCount = cards.filter(function(card) { return progress.seen[card.id]; }).length;
    const confusedCount = cards.filter(function(card) { return progress.confused[card.id]; }).length;
    status.textContent = isEnglishLocaleV334A10N()
    ? "Matches " + matches.length + " / " + cards.length + " cards · seen " + seenCount + " · not sure " + confusedCount
    : "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";
    renderQueueList(queue, state);
  }

  function applyStudyToolsFilter() {
    const state = readPanelState();
    const matches = filterCards(state);
    saveToolsState(state);
    refreshStudyToolsPanel();
    if (matches.length > 0) {
      setCurrentCardById(matches[0].id);
    } else {
      alert(studyToolsTextV334A10N("조건에 맞는 카드가 없습니다.", "No cards match the current filters."));
    }
  }

  function createTodayStudyQueue() {
    const state = readPanelState();
    state.queueIds = makeTodayQueue(state);
    saveToolsState(state);
    refreshStudyToolsPanel();
    if (state.queueIds.length > 0) {
      setCurrentCardById(state.queueIds[0]);
    }
  }

  function jumpRandomStudyCard() {
    const state = readPanelState();
    const matches = filterCards(state);
    if (matches.length === 0) {
      alert(studyToolsTextV334A10N("조건에 맞는 카드가 없습니다.", "No cards match the current filters."));
      return;
    }
    const card = matches[Math.floor(Math.random() * matches.length)];
    saveToolsState(state);
    setCurrentCardById(card.id);
    refreshStudyToolsPanel();
  }

  function clearStudyToolsFilter() {
    const state = { query: "", level: "all", mode: "all", queueIds: [] };
    saveToolsState(state);
    document.getElementById("studyToolsQuery").value = "";
    document.getElementById("studyToolsLevel").value = "all";
    document.getElementById("studyToolsMode").value = "all";
    refreshStudyToolsPanel();
  }

  const timer = setInterval(function() {
    try {
      if (injectStudyToolsPanel()) {
        clearInterval(timer);
      }
    } catch (error) {
      console.warn("study tools init failed", error);
    }
  }, 300);
})();
// === STUDY TOOLS V7 END ===

// === STUDY TOOLS V7.1 UX START ===
(function() {
  function injectStudyToolsUxPatchStyle() {
    if (document.getElementById("studyToolsV71Style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "studyToolsV71Style";
    style.textContent = `
      #studyToolsV7 {
        grid-column: 1 / -1 !important;
        width: 100% !important;
        max-width: 100% !important;
        min-height: auto !important;
        box-sizing: border-box !important;
      }
      #studyToolsV7 .study-tools-title::after {
        content: "";
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
      }
      #studyToolsV7 .study-tools-status.warning {
        color: #b45309;
        font-weight: 700;
      }
      #studyToolsV7 .study-tools-filter-badge {
        display: inline-flex;
        align-items: center;
        margin-left: 6px;
        padding: 2px 8px;
        border-radius: 999px;
        background: #fef3c7;
        color: #92400e;
        font-size: 12px;
        font-weight: 800;
      }
      #studyToolsV7 .study-tools-help {
        margin-top: 8px;
        font-size: 12px;
        color: #64748b;
        line-height: 1.5;
      }
      @media (min-width: 900px) {
        #studyToolsV7 .study-tools-queue {
          grid-template-columns: repeat(5, minmax(160px, 1fr)) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getSelectedText(select) {
    if (!select || select.selectedIndex < 0) {
      return "";
    }
    return select.options[select.selectedIndex].textContent || "";
  }

  function enhanceStudyToolsPanel() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      return false;
    }

    injectStudyToolsUxPatchStyle();

    const title = panel.querySelector(".study-tools-title");
    const level = document.getElementById("studyToolsLevel");
    const mode = document.getElementById("studyToolsMode");
    const todayBtn = document.getElementById("studyToolsToday");
    const status = document.getElementById("studyToolsStatus");
    const queue = document.getElementById("studyToolsQueue");

    if (!title || !level || !mode || !todayBtn || !status || !queue) {
      return true;
    }

    todayBtn.textContent = studyToolsTextV334A10N("현재 조건으로 오늘 최대 10장", "Up to 10 today from current filters");

    let help = document.getElementById("studyToolsHelpV71");
    if (!help) {
      help = document.createElement("div");
      help.id = "studyToolsHelpV71";
      help.className = "study-tools-help";
      status.insertAdjacentElement("afterend", help);
    }

    function refreshHelp() {
      const levelText = getSelectedText(level);
      const modeText = getSelectedText(mode);
      const queueCount = queue.querySelectorAll(".study-tools-card-btn").length;
      const statusText = status.textContent || "";
      const match = statusText.match(/조건 일치\s+(\d+)장/);
      const matchCount = match ? Number(match[1]) : null;

      let warning = "";
      if (matchCount !== null && matchCount < 10) {
        warning = " 조건에 맞는 카드가 10장 미만이라 " + matchCount + "장까지만 만들 수 있습니다.";
        status.classList.add("warning");
      } else {
        status.classList.remove("warning");
      }

      const warningEnV334A10N = warning ? " Current filters may not produce 10 cards." : "";
  help.innerHTML = isEnglishLocaleV334A10N()
    ? "Current filters: <b>" + levelText + "</b> · <b>" + modeText + "</b> · today's queue <b>" + queueCount + "</b>." + warningEnV334A10N + " To build 10 cards, change the level to <b>All levels</b>."
    : "현재 조건: <b>" + levelText + "</b> · <b>" + modeText + "</b> · 오늘 큐 <b>" + queueCount + "장</b>." + warning + " 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요.";
    }

    level.addEventListener("change", function() {
      window.setTimeout(refreshHelp, 50);
    });
    mode.addEventListener("change", function() {
      window.setTimeout(refreshHelp, 50);
    });
    todayBtn.addEventListener("click", function() {
      window.setTimeout(refreshHelp, 80);
    });
    const applyBtn = document.getElementById("studyToolsApply");
    if (applyBtn) {
      applyBtn.addEventListener("click", function() {
        window.setTimeout(refreshHelp, 80);
      });
    }
    const clearBtn = document.getElementById("studyToolsClear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        window.setTimeout(refreshHelp, 80);
      });
    }

    const observer = new MutationObserver(function() {
      refreshHelp();
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    observer.observe(queue, { childList: true, subtree: true });

    refreshHelp();
    return true;
  }

  const timer = setInterval(function() {
    try {
      if (enhanceStudyToolsPanel()) {
        clearInterval(timer);
      }
    } catch (error) {
      console.warn("study tools ux patch failed", error);
    }
  }, 300);
})();
// === STUDY TOOLS V7.1 UX END ===

// === STUDY TOOLS V7.2 QUEUE START ===
(function() {
  const toolsStateKey = "python-reading-trainer-study-tools-v7";
  const queueProgressKey = "python-reading-trainer-study-queue-progress-v7-2";

  function loadToolsStateSafe() {
    const raw = localStorage.getItem(toolsStateKey);
    if (!raw) {
      return { query: "", level: "all", mode: "all", queueIds: [] };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        query: parsed.query || "",
        level: parsed.level || "all",
        mode: parsed.mode || "all",
        queueIds: Array.isArray(parsed.queueIds) ? parsed.queueIds : []
      };
    } catch {
      return { query: "", level: "all", mode: "all", queueIds: [] };
    }
  }

  function saveToolsStateSafe(state) {
    localStorage.setItem(toolsStateKey, JSON.stringify(state));
  }

  function loadQueueProgress() {
    const raw = localStorage.getItem(queueProgressKey);
    if (!raw) {
      return { doneIds: [] };
    }
    try {
      const parsed = JSON.parse(raw);
      return { doneIds: Array.isArray(parsed.doneIds) ? parsed.doneIds : [] };
    } catch {
      return { doneIds: [] };
    }
  }

  function saveQueueProgress(progress) {
    localStorage.setItem(queueProgressKey, JSON.stringify(progress));
  }

  function getCurrentCardIdSafe() {
    try {
      if (Array.isArray(cards) && cards[currentIndex]) {
        return cards[currentIndex].id;
      }
    } catch {}
    return null;
  }

  function setCurrentCardByIdSafe(cardId) {
    const index = cards.findIndex(function(card) { return card.id === cardId; });
    if (index < 0) {
      return false;
    }
    currentIndex = index;
    renderCard();
    renderProgress();
    if (typeof setView === "function") {
      setView("learn");
    }
    window.setTimeout(refreshQueueTools, 50);
    return true;
  }

  function ensureQueueToolsStyle() {
    if (document.getElementById("studyToolsV72Style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "studyToolsV72Style";
    style.textContent = `
      #studyToolsQueueNavV72 {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(148, 163, 184, 0.55);
      }
      #studyToolsQueueNavV72 button {
        border: 0;
        border-radius: 999px;
        padding: 8px 12px;
        background: #2563eb;
        color: white;
        font-weight: 800;
        cursor: pointer;
      }
      #studyToolsQueueNavV72 button.secondary {
        background: #e5e7eb;
        color: #111827;
      }
      #studyToolsQueueNavV72 button.danger {
        background: #fee2e2;
        color: #991b1b;
      }
      #studyToolsQueueStatusV72 {
        font-size: 13px;
        color: #475569;
        font-weight: 700;
      }
      #studyToolsV7 .study-tools-card-btn.queue-current {
        border-color: #2563eb !important;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18);
      }
      #studyToolsV7 .study-tools-card-btn.queue-done {
        opacity: 0.58;
      }
      #studyToolsV7 .study-tools-card-btn.queue-done::after {
        content: "완료";
        margin-left: 6px;
        padding: 2px 7px;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        font-size: 11px;
        font-weight: 900;
      }
    `;
    document.head.appendChild(style);
  }

  function getQueueCards() {
    const state = loadToolsStateSafe();
    const ids = state.queueIds || [];
    return ids.map(function(id) {
      return cards.find(function(card) { return card.id === id; });
    }).filter(Boolean);
  }

  function currentQueueIndex(queueCards, currentId) {
    return queueCards.findIndex(function(card) { return card.id === currentId; });
  }

  function markCurrentQueueDone() {
    const currentId = getCurrentCardIdSafe();
    const queueCards = getQueueCards();
    if (!currentId || !queueCards.some(function(card) { return card.id === currentId; })) {
      alert(studyToolsTextV334A10N("현재 카드는 오늘 큐 안의 카드가 아닙니다.", "The current card is not in today's queue."));
      return;
    }
    const progress = loadQueueProgress();
    if (!progress.doneIds.includes(currentId)) {
      progress.doneIds.push(currentId);
      saveQueueProgress(progress);
    }
    refreshQueueTools();
  }

  function jumpQueueFirst() {
    const queueCards = getQueueCards();
    if (queueCards.length === 0) {
      alert(studyToolsTextV334A10N("오늘 큐가 비어 있습니다.", "Today's queue is empty."));
      return;
    }
    setCurrentCardByIdSafe(queueCards[0].id);
  }

  function jumpQueueNext() {
    const queueCards = getQueueCards();
    if (queueCards.length === 0) {
      alert(studyToolsTextV334A10N("오늘 큐가 비어 있습니다.", "Today's queue is empty."));
      return;
    }

    const currentId = getCurrentCardIdSafe();
    const progress = loadQueueProgress();
    if (currentId && queueCards.some(function(card) { return card.id === currentId; }) && !progress.doneIds.includes(currentId)) {
      progress.doneIds.push(currentId);
      saveQueueProgress(progress);
    }

    const done = new Set(progress.doneIds || []);
    const next = queueCards.find(function(card) { return !done.has(card.id); });
    if (next) {
      setCurrentCardByIdSafe(next.id);
    } else {
      alert(studyToolsTextV334A10N("오늘 큐를 모두 완료했습니다.", "Today's queue is complete."));
    }
    refreshQueueTools();
  }

  function clearQueueProgressOnly() {
    saveQueueProgress({ doneIds: [] });
    refreshQueueTools();
  }

  function clearQueueAll() {
    const state = loadToolsStateSafe();
    state.queueIds = [];
    saveToolsStateSafe(state);
    saveQueueProgress({ doneIds: [] });
    refreshQueueTools();
  }

  function injectQueueNav() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      return false;
    }
    ensureQueueToolsStyle();

    let nav = document.getElementById("studyToolsQueueNavV72");
    if (!nav) {
      nav = document.createElement("div");
      nav.id = "studyToolsQueueNavV72";
      nav.innerHTML = `
        <button type="button" id="studyQueueFirstV72" class="secondary">큐 첫 장</button>
        <button type="button" id="studyQueueDoneV72" class="secondary">현재 카드 완료 표시</button>
        <button type="button" id="studyQueueNextV72">큐 다음</button>
        <button type="button" id="studyQueueResetV72" class="secondary">큐 완료표시 초기화</button>
        <button type="button" id="studyQueueClearV72" class="danger">큐 비우기</button>
        <span id="studyToolsQueueStatusV72"></span>
      `;
      const queue = document.getElementById("studyToolsQueue");
      if (queue) {
        queue.insertAdjacentElement("beforebegin", nav);
      } else {
        panel.appendChild(nav);
      }

      document.getElementById("studyQueueFirstV72").onclick = jumpQueueFirst;
      document.getElementById("studyQueueDoneV72").onclick = markCurrentQueueDone;
      document.getElementById("studyQueueNextV72").onclick = jumpQueueNext;
      document.getElementById("studyQueueResetV72").onclick = clearQueueProgressOnly;
      document.getElementById("studyQueueClearV72").onclick = clearQueueAll;
    }

    refreshQueueTools();
    return true;
  }

  function refreshQueueTools() {
    const status = document.getElementById("studyToolsQueueStatusV72");
    const queue = document.getElementById("studyToolsQueue");
    if (!status || !queue) {
      return;
    }

    const queueCards = getQueueCards();
    const currentId = getCurrentCardIdSafe();
    const progress = loadQueueProgress();
    const done = new Set(progress.doneIds || []);
    const doneCount = queueCards.filter(function(card) { return done.has(card.id); }).length;
    const idx = currentQueueIndex(queueCards, currentId);

    status.textContent = isEnglishLocaleV334A10N()
    ? "Today's queue " + doneCount + " / " + queueCards.length + " complete" + (idx >= 0 ? " · current " + (idx + 1) : "")
    : "오늘 큐 " + doneCount + " / " + queueCards.length + " 완료" + (idx >= 0 ? " · 현재 " + (idx + 1) + "번째" : "");

    Array.from(queue.querySelectorAll(".study-tools-card-btn")).forEach(function(btn) {
      btn.classList.remove("queue-current", "queue-done");
      const titleEl = btn.querySelector("span:nth-child(2)");
      const title = titleEl ? titleEl.textContent : "";
      const card = queueCards.find(function(item) { return item.title === title; });
      if (!card) {
        return;
      }
      if (card.id === currentId) {
        btn.classList.add("queue-current");
      }
      if (done.has(card.id)) {
        btn.classList.add("queue-done");
      }
    });
  }

  const originalRenderCard = typeof renderCard === "function" ? renderCard : null;
  if (originalRenderCard && !window.__studyToolsV72RenderPatched) {
    window.__studyToolsV72RenderPatched = true;
    renderCard = function() {
      originalRenderCard.apply(this, arguments);
      window.setTimeout(refreshQueueTools, 30);
    };
  }

  const timer = setInterval(function() {
    try {
      if (injectQueueNav()) {
        clearInterval(timer);
      }
    } catch (error) {
      console.warn("study queue tools failed", error);
    }
  }, 300);
})();
// === STUDY TOOLS V7.2 QUEUE END ===


// === MOBILE COLLAPSE START ===
function setupAutoCollapseBlocks() {
  function enhance() {
    var blocks = document.querySelectorAll("pre, .code-block, .card-code, code");
    blocks.forEach(function(block) {
      if (block.dataset && block.dataset.collapseReady === "1") return;
      var text = block.innerText || block.textContent || "";
      var lineCount = text.split("\n").length;
      if (text.length < 500 && lineCount < 10) return;
      if (!block.dataset) return;
      block.dataset.collapseReady = "1";
      block.classList.add("collapsible-code-block");
      block.classList.add("is-collapsed");

      var button = document.createElement("button");
      button.type = "button";
      button.className = "collapse-code-toggle";
      button.textContent = "긴 코드 펼치기";
      button.addEventListener("click", function() {
        var collapsed = block.classList.toggle("is-collapsed");
        button.textContent = collapsed ? "긴 코드 펼치기" : "긴 코드 접기";
      });
      block.parentNode.insertBefore(button, block);
    });
  }

  enhance();
  var observer = new MutationObserver(function() { enhance(); });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupAutoCollapseBlocks);
} else {
  setupAutoCollapseBlocks();
}
// === MOBILE COLLAPSE END ===


// === MOBILE STUDY TOOLS COMPACT V27.2 START ===
(function() {
  const toolsStateKey = "python-reading-trainer-study-tools-v7";
  const compactKey = "python-reading-trainer-study-tools-compact-v27-2";

  function getProgressForRecommend() {
    try {
      if (typeof loadProgress === "function") {
        return loadProgress();
      }
    } catch (error) {
      console.warn("recommend progress load failed", error);
    }
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function loadToolsStateForRecommend() {
    try {
      const raw = localStorage.getItem(toolsStateKey);
      if (!raw) {
        return { query: "", level: "all", mode: "wrong_or_unseen", queueIds: [] };
      }
      const parsed = JSON.parse(raw);
      parsed.query = parsed.query || "";
      parsed.level = parsed.level || "all";
      parsed.mode = parsed.mode || "wrong_or_unseen";
      parsed.queueIds = Array.isArray(parsed.queueIds) ? parsed.queueIds : [];
      return parsed;
    } catch (error) {
      return { query: "", level: "all", mode: "wrong_or_unseen", queueIds: [] };
    }
  }

  function saveToolsStateForRecommend(state) {
    localStorage.setItem(toolsStateKey, JSON.stringify(state));
  }

  function getRecommendedLevel() {
    const progress = getProgressForRecommend();
    if (!Array.isArray(cards) || cards.length === 0) {
      return "all";
    }

    const byLevel = new Map();
    cards.forEach(function(card) {
      if (!byLevel.has(card.level)) {
        byLevel.set(card.level, { total: 0, seen: 0, correct: 0, confused: 0, unseen: 0 });
      }
      const row = byLevel.get(card.level);
      row.total += 1;
      if (progress.seen[card.id]) row.seen += 1;
      if (progress.correct[card.id]) row.correct += 1;
      if (progress.confused[card.id]) row.confused += 1;
    });

    Array.from(byLevel.keys()).forEach(function(level) {
      const row = byLevel.get(level);
      row.unseen = Math.max(row.total - row.seen, 0);
    });

    const levels = Array.from(byLevel.keys()).sort(function(a, b) { return a - b; });

    const confusedLevel = levels.find(function(level) {
      return byLevel.get(level).confused > 0;
    });
    if (confusedLevel !== undefined) {
      return String(confusedLevel);
    }

    const activeLevel = levels.find(function(level) {
      const row = byLevel.get(level);
      const seenRatio = row.total === 0 ? 1 : row.seen / row.total;
      const correctRatio = row.total === 0 ? 1 : row.correct / row.total;
      return row.unseen > 0 && (seenRatio < 0.85 || correctRatio < 0.6);
    });
    if (activeLevel !== undefined) {
      return String(activeLevel);
    }

    const nextUnseen = levels.find(function(level) {
      return byLevel.get(level).unseen > 0;
    });
    if (nextUnseen !== undefined) {
      return String(nextUnseen);
    }

    return "all";
  }

  function getRecommendSummary(level) {
    const progress = getProgressForRecommend();
    const targetCards = String(level) === "all"
      ? cards
      : cards.filter(function(card) { return String(card.level) === String(level); });

    const total = targetCards.length;
    const unseen = targetCards.filter(function(card) { return !progress.seen[card.id]; }).length;
    const confused = targetCards.filter(function(card) { return progress.confused[card.id]; }).length;
    const correct = targetCards.filter(function(card) { return progress.correct[card.id]; }).length;

    return isEnglishLocaleV334A10N()
  ? "Recommended L" + level + " · unseen " + unseen + " · not sure " + confused + " · correct " + correct + " / " + total
  : "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;
  }

  function applyRecommendedProgress(startQueue) {
    const level = getRecommendedLevel();
    const state = loadToolsStateForRecommend();
    state.level = level;
    state.mode = "wrong_or_unseen";

    const levelEl = document.getElementById("studyToolsLevel");
    const modeEl = document.getElementById("studyToolsMode");
    if (levelEl) levelEl.value = level;
    if (modeEl) modeEl.value = "wrong_or_unseen";

    saveToolsStateForRecommend(state);

    const applyBtn = document.getElementById("studyToolsApply");
    const todayBtn = document.getElementById("studyToolsToday");

    if (startQueue && todayBtn) {
      todayBtn.click();
    } else if (applyBtn) {
      applyBtn.click();
    }

    window.setTimeout(updateCompactSummary, 80);
  }

  function isSmallScreen() {
    return window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
  }

  function getCollapsedDefault() {
    const saved = localStorage.getItem(compactKey);
    if (saved === "open") return false;
    if (saved === "closed") return true;
    return isSmallScreen();
  }

  function setCollapsed(panel, collapsed) {
    if (!panel) return;
    panel.classList.toggle("study-tools-collapsed-v272", collapsed);
    localStorage.setItem(compactKey, collapsed ? "closed" : "open");

    const toggle = document.getElementById("studyToolsToggleV272");
    if (toggle) {
      toggle.textContent = collapsed ? "설정 펼치기" : "설정 접기";
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  }

  function updateCompactSummary() {
    const summary = document.getElementById("studyToolsRecommendSummaryV272");
    if (!summary || !Array.isArray(cards)) {
      return;
    }

    const levelEl = document.getElementById("studyToolsLevel");
    const currentLevel = levelEl ? levelEl.value : getRecommendedLevel();
    const recommended = getRecommendedLevel();

    if (isEnglishLocaleV334A10N()) {
      summary.textContent =
        "Current " + (currentLevel === "all" ? "All levels" : "L" + currentLevel) +
        " · recommended " + (recommended === "all" ? "All" : "L" + recommended) +
        " · " + getRecommendSummary(recommended);
    } else {
      summary.textContent =
        "현재 " + (currentLevel === "all" ? "전체 레벨" : "L" + currentLevel) +
        " · 추천 " + (recommended === "all" ? "전체" : "L" + recommended) +
        " · " + getRecommendSummary(recommended);
    }
  }

  function enhanceStudyToolsPanel() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      return false;
    }

    const title = panel.querySelector(".study-tools-title");
    const levelEl = document.getElementById("studyToolsLevel");
    const modeEl = document.getElementById("studyToolsMode");

    if (!title || !levelEl || !modeEl) {
      return false;
    }

    if (!document.getElementById("studyToolsQuickV272")) {
      const quick = document.createElement("div");
      quick.id = "studyToolsQuickV272";
      quick.className = "study-tools-quick-v272";
      quick.innerHTML = `
        <div class="study-tools-quick-main-v272">
          <button type="button" id="studyToolsRecommendStartV272">${studyToolsTextV334A10N("추천 진도로 오늘 10장", "Today 10 from recommended level")}</button>
          <button type="button" id="studyToolsRecommendApplyV272" class="secondary">${studyToolsTextV334A10N("추천만 적용", "Apply recommendation")}</button>
          <button type="button" id="studyToolsToggleV272" class="secondary">${studyToolsTextV334A10N("설정 펼치기", "Open settings")}</button>
        </div>
        <div id="studyToolsRecommendSummaryV272" class="study-tools-recommend-summary-v272"></div>
      `;

      title.insertAdjacentElement("afterend", quick);

      document.getElementById("studyToolsRecommendStartV272").onclick = function() {
        applyRecommendedProgress(true);
        setCollapsed(panel, true);
      };
      document.getElementById("studyToolsRecommendApplyV272").onclick = function() {
        applyRecommendedProgress(false);
      };
      document.getElementById("studyToolsToggleV272").onclick = function() {
        setCollapsed(panel, !panel.classList.contains("study-tools-collapsed-v272"));
      };
    }

    const state = loadToolsStateForRecommend();
    const hasSavedManualLevel = state.level && state.level !== "all";
    const hasSavedManualMode = state.mode && state.mode !== "all" && state.mode !== "wrong_or_unseen";
    const noQueue = !state.queueIds || state.queueIds.length === 0;

    if (!hasSavedManualLevel && !hasSavedManualMode && noQueue) {
      const recommended = getRecommendedLevel();
      levelEl.value = recommended;
      modeEl.value = "wrong_or_unseen";
      state.level = recommended;
      state.mode = "wrong_or_unseen";
      saveToolsStateForRecommend(state);
    }

    if (!panel.dataset.compactV272Ready) {
      panel.dataset.compactV272Ready = "1";
      setCollapsed(panel, getCollapsedDefault());
    }

    updateCompactSummary();

    levelEl.addEventListener("change", updateCompactSummary);
    modeEl.addEventListener("change", updateCompactSummary);

    return true;
  }

  const timer = setInterval(function() {
    try {
      if (enhanceStudyToolsPanel()) {
        clearInterval(timer);
      }
    } catch (error) {
      console.warn("study tools compact patch failed", error);
      clearInterval(timer);
    }
  }, 200);

  window.addEventListener("resize", function() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) return;

    const saved = localStorage.getItem(compactKey);
    if (!saved) {
      setCollapsed(panel, isSmallScreen());
    }
  });

  document.addEventListener("click", function(event) {
    const id = event.target && event.target.id;
    if (id === "studyToolsApply" || id === "studyToolsToday" || id === "studyToolsRandom" || id === "studyToolsClear") {
      window.setTimeout(updateCompactSummary, 80);
    }
  });
})();
// === MOBILE STUDY TOOLS COMPACT V27.2 END ===


// === MOBILE STUDY TOOLS DEFAULT COLLAPSED V27.3 START ===
(function() {
  const compactKey = "python-reading-trainer-study-tools-compact-v27-2";
  const appliedKey = "python-reading-trainer-study-tools-default-collapsed-v27-3-session";

  function isSmallScreen() {
    return window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
  }

  function forceCollapsedOnMobileDefault() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      return false;
    }

    if (isSmallScreen() && !sessionStorage.getItem(appliedKey)) {
      localStorage.setItem(compactKey, "closed");
      sessionStorage.setItem(appliedKey, "1");
    }

    if (isSmallScreen() && localStorage.getItem(compactKey) !== "open") {
      panel.classList.add("study-tools-collapsed-v272");
      const toggle = document.getElementById("studyToolsToggleV272");
      if (toggle) {
        toggle.textContent = "설정 펼치기";
        toggle.setAttribute("aria-expanded", "false");
      }
    }

    const summary = document.getElementById("studyToolsRecommendSummaryV272");
    if (summary) {
      summary.classList.add("compact-summary-v273");
    }

    const title = panel.querySelector(".study-tools-title");
    if (title) {
      title.classList.add("compact-title-v273");
      if (title.textContent.length > 8 && isSmallScreen()) {
        title.textContent = "학습 설정";
      }
    }

    return true;
  }

  const timer = setInterval(function() {
    if (forceCollapsedOnMobileDefault()) {
      clearInterval(timer);
    }
  }, 150);

  window.addEventListener("resize", function() {
    window.setTimeout(forceCollapsedOnMobileDefault, 60);
  });
})();
// === MOBILE STUDY TOOLS DEFAULT COLLAPSED V27.3 END ===


// === MOBILE STUDY TOOLS MICRO SUMMARY V27.4 START ===
(function() {
  const toolsStateKey = "python-reading-trainer-study-tools-v7";
  const compactKey = "python-reading-trainer-study-tools-compact-v27-2";

  function isSmallScreen() {
    return window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
  }

  function getProgressSafeV274() {
    try {
      if (typeof loadProgress === "function") {
        return loadProgress();
      }
    } catch (error) {
      console.warn("v27.4 progress load failed", error);
    }
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function loadToolsStateSafeV274() {
    try {
      const raw = localStorage.getItem(toolsStateKey);
      if (!raw) {
        return { query: "", level: "all", mode: "wrong_or_unseen", queueIds: [] };
      }
      const parsed = JSON.parse(raw);
      parsed.query = parsed.query || "";
      parsed.level = parsed.level || "all";
      parsed.mode = parsed.mode || "wrong_or_unseen";
      parsed.queueIds = Array.isArray(parsed.queueIds) ? parsed.queueIds : [];
      return parsed;
    } catch (error) {
      return { query: "", level: "all", mode: "wrong_or_unseen", queueIds: [] };
    }
  }

  function recommendLevelV274() {
    const progress = getProgressSafeV274();
    if (!Array.isArray(cards) || cards.length === 0) {
      return "all";
    }

    const levels = Array.from(new Set(cards.map(function(card) { return card.level; })))
      .sort(function(a, b) { return a - b; });

    const confusedLevel = levels.find(function(level) {
      return cards.some(function(card) {
        return String(card.level) === String(level) && progress.confused[card.id];
      });
    });
    if (confusedLevel !== undefined) {
      return String(confusedLevel);
    }

    const unfinishedLevel = levels.find(function(level) {
      const same = cards.filter(function(card) { return String(card.level) === String(level); });
      const seen = same.filter(function(card) { return progress.seen[card.id]; }).length;
      const correct = same.filter(function(card) { return progress.correct[card.id]; }).length;
      const seenRatio = same.length === 0 ? 1 : seen / same.length;
      const correctRatio = same.length === 0 ? 1 : correct / same.length;
      return same.length > 0 && (seenRatio < 0.85 || correctRatio < 0.6);
    });
    if (unfinishedLevel !== undefined) {
      return String(unfinishedLevel);
    }

    return "all";
  }

  function makeMicroSummary() {
    const progress = getProgressSafeV274();
    const state = loadToolsStateSafeV274();
    const recommended = recommendLevelV274();

    const target = recommended === "all"
      ? cards
      : cards.filter(function(card) { return String(card.level) === String(recommended); });

    const unseen = target.filter(function(card) { return !progress.seen[card.id]; }).length;
    const confused = target.filter(function(card) { return progress.confused[card.id]; }).length;
    const remaining = unseen + confused;
    const queueLen = Array.isArray(state.queueIds) ? state.queueIds.length : 0;

    const levelText = recommended === "all" ? "전체" : "L" + recommended;
    return isEnglishLocaleV334A10N()
  ? "Recommended " + (recommended === "all" ? "All" : "L" + recommended) + " · remaining " + remaining + " · queue " + queueLen + "/10"
  : "추천 " + levelText + " · 남은 " + remaining + " · 큐 " + queueLen + "/10";
  }

  function applyMicroUi() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      return false;
    }

    if (isSmallScreen() && localStorage.getItem(compactKey) !== "open") {
      localStorage.setItem(compactKey, "closed");
      panel.classList.add("study-tools-collapsed-v272");
    }

    const summary = document.getElementById("studyToolsRecommendSummaryV272");
    if (summary) {
      summary.textContent = makeMicroSummary();
      summary.classList.add("micro-summary-v274");
    }

    const startBtn = document.getElementById("studyToolsRecommendStartV272");
    if (startBtn && isSmallScreen()) {
      startBtn.textContent = studyToolsTextV334A10N("추천 10장", "Recommended 10");
    }

    const applyBtn = document.getElementById("studyToolsRecommendApplyV272");
    if (applyBtn && isSmallScreen()) {
      applyBtn.textContent = studyToolsTextV334A10N("추천 적용", "Apply recommendation");
    }

    const toggleBtn = document.getElementById("studyToolsToggleV272");
    if (toggleBtn && isSmallScreen()) {
      const collapsed = panel.classList.contains("study-tools-collapsed-v272");
      toggleBtn.textContent = collapsed ? studyToolsTextV334A10N("설정 펼치기", "Open settings") : studyToolsTextV334A10N("설정 접기", "Collapse settings");
    }

    const status = document.getElementById("studyToolsStatus");
    if (status && isSmallScreen()) {
      status.classList.add("micro-status-v274");
    }

    return true;
  }

  const timer = setInterval(function() {
    if (applyMicroUi()) {
      clearInterval(timer);
    }
  }, 150);

  const refreshEvents = ["click", "change", "keyup"];
  refreshEvents.forEach(function(eventName) {
    document.addEventListener(eventName, function(event) {
      const target = event.target;
      if (!target) return;
      if (
        target.id === "studyToolsRecommendStartV272" ||
        target.id === "studyToolsRecommendApplyV272" ||
        target.id === "studyToolsToggleV272" ||
        target.id === "studyToolsApply" ||
        target.id === "studyToolsToday" ||
        target.id === "studyToolsClear" ||
        target.id === "studyToolsLevel" ||
        target.id === "studyToolsMode" ||
        target.id === "studyToolsQuery"
      ) {
        window.setTimeout(applyMicroUi, 80);
      }
    });
  });

  window.addEventListener("resize", function() {
    window.setTimeout(applyMicroUi, 80);
  });
})();
// === MOBILE STUDY TOOLS MICRO SUMMARY V27.4 END ===


