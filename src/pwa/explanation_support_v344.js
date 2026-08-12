// === EXPLANATION SUPPORT V344 ===
(function () {
  "use strict";

  const VERSION = "v344_explanation_support_r5";
  const MAX_TERMS_PER_BLOCK = 4;
  const EXCLUDED_SELECTOR = "code, pre, button, a, input, textarea, select, option, script, style, [contenteditable='true'], .syntax-token-v340, .explanation-term-v344, #explanationRefresherV344";
  const TARGET_SELECTORS = [
    "#conceptIntro",
    "#readingGoal",
    "#resultBox",
    "#sideCards .side-card",
    "#sideCards .side-card-body",
    "#sideCards .side-card-detail",
    "#projectContext",
    "#conceptDefinition",
    "#codeSummary",
    "#codeQuickReport",
    "#codeConfidenceReport",
    "#codeFlowAnalysisReport",
    "#codeStructureOverview",
    "#codeWarnings",
    "#codeSteps .code-step p",
    "#codeRelatedCards"
  ];

  const GLOSSARY = {
    bytecode: {
      aliases: ["bytecode", "바이트코드"],
      ko: ["바이트코드는 Python 소스와 실제 실행 사이에서 사용하는 중간 명령 형태다.", "예: CPython은 .py 코드를 먼저 bytecode 형태로 바꾼 뒤 실행할 수 있다.", "여기서는 ‘Python도 실행 전에 중간 변환 단계를 거칠 수 있다’는 점을 설명하기 위해 나온 말이다."],
      en: ["Bytecode is an intermediate instruction form used between Python source code and execution.", "Example: CPython can turn .py code into bytecode before executing it.", "Here it explains that Python may use an intermediate conversion step before execution."]
    },
    cpython: {
      aliases: ["CPython", "씨파이썬"],
      ko: ["CPython은 가장 널리 쓰이는 Python 구현으로, Python 코드를 실제로 실행하는 프로그램이다.", "예: 일반적으로 python 명령으로 실행하는 환경은 CPython인 경우가 많다.", "Python 언어 자체와 그것을 실행하는 대표 프로그램을 구분할 때 나온다."],
      en: ["CPython is the most widely used Python implementation: a program that actually executes Python code.", "Example: the python command commonly runs CPython.", "It appears when distinguishing the Python language from a particular program that runs it."]
    },
    compile: {
      aliases: ["compile", "compiler", "compiled", "컴파일", "컴파일러"],
      ko: ["컴파일은 사람이 쓴 코드를 실행하기 쉬운 다른 형태로 미리 바꾸는 과정이다.", "예: 소스 코드 → 중간 코드 또는 기계가 실행할 수 있는 코드.", "실행 전에 어떤 변환이 일어나는지 설명할 때 쓰는 말이다."],
      en: ["Compilation converts source code into another form that is easier to execute.", "Example: source code → intermediate code or executable machine-oriented code.", "It appears when explaining what transformation happens before execution."]
    },
    interpreter: {
      aliases: ["interpreter", "interpreted", "인터프리터", "인터프리트"],
      ko: ["인터프리터는 프로그램을 실행하면서 코드를 읽고 처리하는 실행 방식 또는 그 프로그램을 뜻한다.", "예: Python 실행기가 준비된 명령을 차례로 처리한다.", "컴파일과 실행 단계의 차이를 설명할 때 나온다."],
      en: ["An interpreter is a program or execution style that reads and processes code while running it.", "Example: a Python runtime processes prepared instructions step by step.", "It appears when comparing conversion and execution stages."]
    },
    iterable: {
      aliases: ["iterable", "이터러블"],
      ko: ["iterable은 for문처럼 값을 하나씩 꺼내 볼 수 있는 대상을 뜻한다.", "예: list, string, tuple은 차례로 값을 꺼낼 수 있다.", "반복문이나 여러 값을 받는 함수가 어떤 값을 다룰 수 있는지 설명할 때 나온다."],
      en: ["An iterable is something whose values can be taken one at a time, as in a for loop.", "Example: lists, strings, and tuples can provide values one by one.", "It appears when describing what a loop or multi-value operation can consume."]
    },
    iterator: {
      aliases: ["iterator", "이터레이터"],
      ko: ["iterator는 다음 값을 하나씩 꺼내 주는 반복 진행 객체다.", "예: iter(items)로 iterator를 만들고 next()로 다음 값을 받을 수 있다.", "반복이 내부에서 어떻게 한 단계씩 진행되는지 설명할 때 나온다."],
      en: ["An iterator is an object that supplies the next value one step at a time.", "Example: iter(items) creates one and next() asks for the next value.", "It appears when explaining how iteration advances internally."]
    },
    object: {
      aliases: ["object", "객체"],
      ko: ["객체는 Python에서 값과 그 값이 할 수 있는 동작을 함께 표현하는 하나의 실체다.", "예: 문자열 \"hi\"도 문자열 객체이고, 리스트 [1, 2]도 리스트 객체다.", "값의 종류나 속성·메서드가 어디에 붙어 있는지 설명할 때 나온다."],
      en: ["An object is a Python value together with the behavior associated with that value.", "Example: \"hi\" is a string object and [1, 2] is a list object.", "It appears when explaining where a value's type, attributes, or methods belong."]
    },
    reference: {
      aliases: ["reference", "참조"],
      ko: ["참조는 값 자체를 복사해 넣는다는 뜻보다, 어떤 객체를 가리키는 연결을 뜻한다.", "예: b = a 뒤에 a와 b가 같은 리스트 객체를 가리킬 수 있다.", "변수 대입 뒤에 두 이름이 같은 변경을 볼 수 있는 이유를 설명할 때 나온다."],
      en: ["A reference is a link to an object rather than a statement that the object itself was copied.", "Example: after b = a, both names may point to the same list object.", "It appears when explaining why two names can observe the same mutable object."]
    },
    protocol: {
      aliases: ["protocol", "프로토콜"],
      ko: ["프로토콜은 여러 객체가 같은 방식으로 동작하기 위해 따르는 공통 약속이다.", "예: 길이를 알려 주는 약속을 지원하면 len()으로 길이를 물을 수 있다.", "서로 다른 자료형이 같은 문법을 지원하는 이유를 설명할 때 나온다."],
      en: ["A protocol is a shared behavioral agreement that different objects can follow.", "Example: objects that support the length behavior can be used with len().", "It appears when explaining why different types can support the same syntax."]
    },
    argument: {
      aliases: ["argument", "arguments", "인자"],
      ko: ["인자는 함수를 호출할 때 실제로 건네는 값이다.", "예: greet(\"Mina\")에서 \"Mina\"가 인자다.", "함수를 정의할 때 쓰는 매개변수와 실제 호출 값을 구분할 때 나온다."],
      en: ["An argument is an actual value passed when a function is called.", "Example: in greet(\"Mina\"), \"Mina\" is an argument.", "It appears when distinguishing call-time values from parameters in a function definition."]
    },
    parameter: {
      aliases: ["parameter", "parameters", "매개변수"],
      ko: ["매개변수는 함수가 호출될 때 받을 값에 붙여 둔 이름이다.", "예: def greet(name): 에서 name이 매개변수다.", "함수 안에서 호출자가 준 값을 어떤 이름으로 사용하는지 설명할 때 나온다."],
      en: ["A parameter is a name in a function definition that receives a value when the function is called.", "Example: in def greet(name):, name is a parameter.", "It appears when explaining how a function names and uses a caller-provided value."]
    },
    scope: {
      aliases: ["scope", "스코프", "범위"],
      ko: ["scope는 어떤 이름을 코드의 어느 위치에서 사용할 수 있는지를 뜻한다.", "예: 함수 안에서 만든 지역 변수는 보통 그 함수 안에서 사용한다.", "같은 변수 이름이 위치에 따라 왜 다르게 보일 수 있는지 설명할 때 나온다."],
      en: ["Scope describes where in code a name can be used.", "Example: a local variable created inside a function is normally used inside that function.", "It appears when explaining why the same name can behave differently in different locations."]
    },
    module: {
      aliases: ["module", "모듈"],
      ko: ["모듈은 관련된 Python 코드와 이름을 한 파일이나 불러올 수 있는 단위로 묶은 것이다.", "예: import json은 json 모듈을 불러온다.", "기능이 어느 코드 묶음에서 오는지 설명할 때 나온다."],
      en: ["A module is an importable unit, often a file, that groups related Python code and names.", "Example: import json loads the json module.", "It appears when explaining where a function or feature comes from."]
    },
    exception: {
      aliases: ["exception", "예외"],
      ko: ["예외는 코드를 실행하는 도중 정상 흐름을 계속할 수 없을 때 Python이 알리는 오류 상황이다.", "예: 없는 dict 키를 대괄호로 읽으면 KeyError 예외가 날 수 있다.", "오류가 어디서 생기고 try/except가 무엇을 처리하는지 설명할 때 나온다."],
      en: ["An exception is an error condition Python raises when normal execution cannot continue as written.", "Example: reading a missing dictionary key with brackets can raise KeyError.", "It appears when explaining failures and what try/except handles."]
    },
    serialization: {
      aliases: ["serialization", "serialize", "serialized", "직렬화"],
      ko: ["직렬화는 메모리의 값을 저장하거나 전송하기 쉬운 문자열·바이트 형태로 바꾸는 과정이다.", "예: json.dumps({\"x\": 1})은 dict를 JSON 문자열로 바꾼다.", "Python 값과 JSON 같은 저장 형식 사이의 변환을 설명할 때 나온다."],
      en: ["Serialization converts an in-memory value into a string or byte form that is easier to store or transmit.", "Example: json.dumps({\"x\": 1}) converts a dict to a JSON string.", "It appears when explaining conversion between Python values and storage formats such as JSON."]
    },
    runtime: {
      aliases: ["runtime", "런타임", "실행 환경"],
      ko: ["runtime은 프로그램이 실제로 실행되는 동안의 환경이나 실행 시스템을 뜻한다.", "예: 브라우저 JavaScript runtime이나 Python runtime이 코드를 실행한다.", "코드 자체와 실제 실행 환경의 차이를 설명할 때 나온다."],
      en: ["A runtime is the environment or execution system active while a program is running.", "Example: a browser JavaScript runtime or a Python runtime executes code.", "It appears when distinguishing source code from the environment that executes it."]
    },
    cache: {
      aliases: ["cache", "캐시"],
      ko: ["캐시는 다시 필요할 데이터를 더 빨리 쓰기 위해 잠시 저장해 두는 공간이나 복사본이다.", "예: 브라우저가 이미 받은 파일을 캐시에 두었다가 다시 사용할 수 있다.", "새 파일이 바로 보이지 않거나 이전 결과가 재사용되는 이유를 설명할 때 나온다."],
      en: ["A cache stores reusable data or copies so they can be used more quickly later.", "Example: a browser can reuse a previously downloaded file from cache.", "It appears when explaining why an older result or file may be reused."]
    },
    dependency: {
      aliases: ["dependency", "dependencies", "의존성"],
      ko: ["의존성은 내 코드가 동작하기 위해 필요로 하는 다른 라이브러리·패키지·구성 요소다.", "예: requests를 쓰는 프로그램은 requests 패키지에 의존한다.", "설치 목록이나 실행 환경을 재현할 때 무엇이 필요한지 설명할 때 나온다."],
      en: ["A dependency is another library, package, or component that your code needs in order to work.", "Example: a program that imports requests depends on the requests package.", "It appears when explaining what must be installed or reproduced for a program to run."]
    },
    package: {
      aliases: ["package", "packages", "패키지"],
      ko: ["패키지는 설치하거나 불러와 사용할 수 있도록 관련 코드를 묶어 배포하는 단위다.", "예: pip install requests로 requests 패키지를 설치할 수 있다.", "외부 기능을 어떻게 설치하고 관리하는지 설명할 때 나온다."],
      en: ["A package is a distributable bundle of related code that can be installed and used.", "Example: pip install requests installs the requests package.", "It appears when explaining how external code is installed and managed."]
    },
    venv: {
      aliases: ["virtual environment", "venv", "가상환경", "가상 환경"],
      ko: ["가상환경은 프로젝트마다 Python 패키지 설치 공간을 따로 나누는 환경이다.", "예: python -m venv .venv로 프로젝트용 환경을 만들 수 있다.", "프로젝트마다 서로 다른 패키지 버전을 안전하게 관리하는 이유를 설명할 때 나온다."],
      en: ["A virtual environment keeps Python package installations separated for a project.", "Example: python -m venv .venv creates a project-specific environment.", "It appears when explaining how projects can safely use different package versions."]
    },
    api: {
      aliases: ["API", "api"],
      ko: ["API는 한 프로그램이 다른 프로그램의 기능이나 데이터를 정해진 방식으로 요청하는 접점이다.", "예: 웹 API에 요청을 보내 JSON 데이터를 받을 수 있다.", "코드가 외부 서비스와 어떤 규칙으로 통신하는지 설명할 때 나온다."],
      en: ["An API is a defined interface through which one program requests another program's functions or data.", "Example: a web API request can return JSON data.", "It appears when explaining how code communicates with an external service."]
    },
    attribute: {
      aliases: ["attribute", "attributes", "속성"],
      ko: ["속성은 객체가 가지고 있는 이름 붙은 값이나 상태다.", "예: user.name에서 name은 user 객체의 속성이다.", "점(.) 뒤의 값이 객체와 어떤 관계인지 설명할 때 나온다."],
      en: ["An attribute is a named value or piece of state belonging to an object.", "Example: in user.name, name is an attribute of user.", "It appears when explaining what a name after a dot belongs to."]
    },
    method: {
      aliases: ["method", "methods", "메서드"],
      ko: ["메서드는 특정 객체나 클래스에 연결되어 그 대상과 함께 사용하는 함수다.", "예: text.strip()에서 strip은 문자열 객체의 메서드다.", "점(.) 뒤의 함수 호출이 어떤 대상의 기능인지 설명할 때 나온다."],
      en: ["A method is a function associated with an object or class and used through that target.", "Example: in text.strip(), strip is a string method.", "It appears when explaining a function call written after a dot."]
    },
    instance: {
      aliases: ["instance", "인스턴스"],
      ko: ["인스턴스는 클래스를 바탕으로 실제로 만들어진 개별 객체다.", "예: user = User(\"Mina\")에서 user가 가리키는 객체는 User의 인스턴스다.", "클래스라는 설계와 실제 생성된 객체를 구분할 때 나온다."],
      en: ["An instance is an individual object created from a class.", "Example: in user = User(\"Mina\"), the object referenced by user is an instance of User.", "It appears when distinguishing a class definition from an actual created object."]
    },
    mutable: {
      aliases: ["mutable", "가변"],
      ko: ["mutable은 객체를 새로 만들지 않고도 내부 내용을 바꿀 수 있다는 뜻이다.", "예: list는 append()로 같은 리스트의 내용을 바꿀 수 있다.", "대입과 수정 뒤에 같은 객체의 상태가 왜 달라지는지 설명할 때 나온다."],
      en: ["Mutable means an object's contents can be changed without replacing the object with a new one.", "Example: a list can be changed with append().", "It appears when explaining why the state of the same object can change."]
    },
    immutable: {
      aliases: ["immutable", "불변"],
      ko: ["immutable은 만들어진 객체의 내부 값을 그 자리에서 바꿀 수 없다는 뜻이다.", "예: 문자열을 바꾸는 연산은 보통 새 문자열을 만든다.", "문자열·숫자의 변경이 리스트 변경과 왜 다른지 설명할 때 나온다."],
      en: ["Immutable means an object's internal value cannot be changed in place after creation.", "Example: string-changing operations normally create a new string.", "It appears when comparing string or number updates with mutable containers such as lists."]
    },
    encoding: {
      aliases: ["encoding", "인코딩"],
      ko: ["인코딩은 글자를 파일이나 통신에서 저장할 숫자·바이트 규칙으로 바꾸고 되돌리는 약속이다.", "예: UTF-8 인코딩으로 한글 텍스트 파일을 저장하고 읽을 수 있다.", "파일에서 글자가 깨지지 않게 같은 문자 규칙을 쓰는 이유를 설명할 때 나온다."],
      en: ["Encoding is an agreement for representing text as stored or transmitted bytes and converting it back.", "Example: a Korean text file can be read and written using UTF-8.", "It appears when explaining why text files need a consistent character representation."]
    },
    utf8: {
      aliases: ["UTF-8", "utf-8", "UTF8"],
      ko: ["UTF-8은 한글을 포함한 많은 문자를 표현할 수 있는 널리 쓰이는 문자 인코딩 방식이다.", "예: open(path, encoding=\"utf-8\")처럼 파일 읽기 규칙을 지정한다.", "텍스트 파일의 문자 해석 규칙을 명확하게 지정할 때 나온다."],
      en: ["UTF-8 is a widely used text encoding that can represent Korean and many other characters.", "Example: open(path, encoding=\"utf-8\") specifies how file bytes should be interpreted as text.", "It appears when making the text-file encoding rule explicit."]
    },
    stdlib: {
      aliases: ["standard library", "stdlib", "표준 라이브러리"],
      ko: ["표준 라이브러리는 Python을 설치하면 함께 제공되는 기본 모듈 모음이다.", "예: json, pathlib, logging은 표준 라이브러리에 포함된다.", "별도 패키지 설치 없이 사용할 수 있는 기능인지 설명할 때 나온다."],
      en: ["The standard library is the collection of modules included with Python itself.", "Example: json, pathlib, and logging are standard-library modules.", "It appears when explaining whether a feature needs a separate package installation."]
    },
    envvar: {
      aliases: ["environment variable", "environment variables", "환경변수", "환경 변수"],
      ko: ["환경변수는 운영체제가 실행 중인 프로그램에 이름과 값 형태로 전달하는 설정이다.", "예: os.environ.get(\"API_KEY\")로 환경변수 값을 읽을 수 있다.", "코드 밖에서 실행 설정이나 비밀값 위치를 정하는 방법을 설명할 때 나온다."],
      en: ["An environment variable is a named setting supplied by the operating system to a running program.", "Example: os.environ.get(\"API_KEY\") reads one.", "It appears when explaining how runtime configuration can be supplied outside source code."]
    },
    process: {
      aliases: ["process", "프로세스"],
      ko: ["프로세스는 실행 중인 프로그램 하나의 실행 단위다.", "예: Python 스크립트를 실행하면 Python 프로세스가 만들어진다.", "환경변수·메모리·실행 상태가 어느 실행에 속하는지 설명할 때 나온다."],
      en: ["A process is one running instance of a program.", "Example: running a Python script creates a Python process.", "It appears when explaining which execution owns environment variables, memory, or runtime state."]
    }
  };

  function isEnglish() {
    try {
      const params = new URLSearchParams(location.search || "");
      const q = params.get("lang") || params.get("locale") || "";
      const html = (document.documentElement.lang || "").toLowerCase();
      const stored = localStorage.getItem("pythonTrainerLang") || localStorage.getItem("language") || localStorage.getItem("lang") || "";
      return /^en/i.test(q) || /^en/i.test(html) || /^en/i.test(stored);
    } catch (_) {
      return /^en/i.test(document.documentElement.lang || "");
    }
  }

  function injectStyles() {
    if (document.getElementById("explanationSupportStyleV344")) return;
    const style = document.createElement("style");
    style.id = "explanationSupportStyleV344";
    style.textContent = `
      .explanation-term-v344{border:0;background:transparent;color:#2459d3;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;font:inherit;font-weight:700;padding:0 1px;cursor:pointer;white-space:normal;overflow-wrap:anywhere;word-break:normal;max-width:100%;vertical-align:baseline}
      .explanation-term-v344:hover,.explanation-term-v344:focus{background:#eaf1ff;border-radius:4px;outline:none}
      #explanationRefresherV344{position:fixed;inset:0;z-index:10050;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:18px}
      #explanationRefresherV344.hidden{display:none}
      .explanation-refresher-card-v344{width:min(520px,100%);max-height:min(78vh,680px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(15,23,42,.25);padding:20px;overflow-wrap:anywhere}
      .explanation-refresher-head-v344{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
      .explanation-refresher-head-v344 h2{font-size:1.18rem;margin:0}
      .explanation-refresher-close-v344{border:1px solid #d6dfec;background:#f8fafc;border-radius:10px;padding:7px 10px;cursor:pointer}
      .explanation-refresher-term-v344{display:inline-block;font-weight:800;color:#2459d3;background:#eef4ff;border-radius:999px;padding:5px 9px;margin-bottom:10px}
      .explanation-refresher-section-v344{margin:10px 0 0}
      .explanation-refresher-section-v344 strong{display:block;margin-bottom:4px}
      .explanation-refresher-example-v344{background:#f6f8fb;border-radius:10px;padding:10px;white-space:pre-wrap;overflow-wrap:anywhere}
      #learnView .external-resource-card .side-card-detail,
      #learnView .external-resource-card .side-card-detail *{min-width:0;max-width:100%;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word}
      @media(max-width:520px){#explanationRefresherV344{padding:10px}.explanation-refresher-card-v344{border-radius:14px;padding:16px;max-height:84vh}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = document.getElementById("explanationRefresherV344");
    if (modal) return modal;
    injectStyles();
    modal = document.createElement("div");
    modal.id = "explanationRefresherV344";
    modal.className = "hidden";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="explanation-refresher-card-v344" role="dialog" aria-modal="true" aria-labelledby="explanationRefresherTitleV344">
        <div class="explanation-refresher-head-v344">
          <h2 id="explanationRefresherTitleV344">빠른 복습</h2>
          <button type="button" class="explanation-refresher-close-v344" aria-label="닫기">닫기</button>
        </div>
        <div class="explanation-refresher-term-v344"></div>
        <div class="explanation-refresher-section-v344"><strong data-label="definition">한 줄 정의</strong><div data-value="definition"></div></div>
        <div class="explanation-refresher-section-v344"><strong data-label="example">작은 예</strong><div class="explanation-refresher-example-v344" data-value="example"></div></div>
        <div class="explanation-refresher-section-v344"><strong data-label="context">지금 왜 나왔나요?</strong><div data-value="context"></div></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector(".explanation-refresher-close-v344").addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    return modal;
  }

  let returnFocus = null;
  let returnTermId = "";
  function openTerm(termId, sourceButton) {
    const entry = GLOSSARY[termId];
    if (!entry) return;
    const modal = ensureModal();
    const en = isEnglish();
    const values = en ? entry.en : entry.ko;
    returnFocus = sourceButton || document.activeElement;
    returnTermId = sourceButton && sourceButton.dataset ? (sourceButton.dataset.term || "") : "";
    modal.querySelector("#explanationRefresherTitleV344").textContent = en ? "Quick refresher" : "빠른 복습";
    modal.querySelector(".explanation-refresher-close-v344").textContent = en ? "Close" : "닫기";
    modal.querySelector("[data-label='definition']").textContent = en ? "One-line definition" : "한 줄 정의";
    modal.querySelector("[data-label='example']").textContent = en ? "Tiny example" : "작은 예";
    modal.querySelector("[data-label='context']").textContent = en ? "Why is it here?" : "지금 왜 나왔나요?";
    modal.querySelector(".explanation-refresher-term-v344").textContent = sourceButton ? sourceButton.textContent : entry.aliases[0];
    modal.querySelector("[data-value='definition']").textContent = values[0];
    modal.querySelector("[data-value='example']").textContent = values[1];
    modal.querySelector("[data-value='context']").textContent = values[2];
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector(".explanation-refresher-close-v344").focus();
  }

  function closeModal() {
    const modal = document.getElementById("explanationRefresherV344");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    const focus = returnFocus;
    const termId = returnTermId;
    returnFocus = null;
    returnTermId = "";
    const active = document.activeElement;
    if (active && modal.contains(active) && typeof active.blur === "function") active.blur();
    const restoreFocus = function () {
      let candidate = focus && document.contains(focus) ? focus : null;
      if (!candidate && termId) {
        candidate = document.querySelector('.explanation-term-v344[data-term="' + CSS.escape(termId) + '"]');
      }
      if (!candidate || typeof candidate.focus !== "function") return;
      if (document.activeElement === candidate) return;
      try { candidate.focus({ preventScroll: true }); }
      catch (_) { candidate.focus(); }
    };
    restoreFocus();
    if (typeof queueMicrotask === "function") queueMicrotask(restoreFocus);
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(function () {
        restoreFocus();
        window.setTimeout(restoreFocus, 0);
      });
    } else {
      window.setTimeout(restoreFocus, 0);
    }
  }

  function currentTopicText() {
    return [
      document.getElementById("cardTitle")?.textContent || "",
      document.getElementById("conceptIntro")?.querySelector("h2,h3,strong")?.textContent || ""
    ].join(" ").toLowerCase();
  }

  const TERM_INDEX = Object.keys(GLOSSARY).flatMap(function (id) {
    return GLOSSARY[id].aliases.map(function (alias) { return { id, alias }; });
  }).sort(function (a, b) { return b.alias.length - a.alias.length; });

  function asciiBoundaryOkay(text, start, alias) {
    if (!/^[A-Za-z0-9_. -]+$/.test(alias)) return true;
    const first = alias[0];
    const last = alias[alias.length - 1];
    const before = start > 0 ? text[start - 1] : "";
    const after = start + alias.length < text.length ? text[start + alias.length] : "";
    if (/[A-Za-z0-9_]/.test(first) && /[A-Za-z0-9_]/.test(before)) return false;
    if (/[A-Za-z0-9_]/.test(last) && /[A-Za-z0-9_]/.test(after)) return false;
    return true;
  }

  function findMatch(text, skipIds) {
    const lower = text.toLowerCase();
    let best = null;
    TERM_INDEX.forEach(function (term) {
      if (skipIds.has(term.id)) return;
      const needle = term.alias.toLowerCase();
      let at = lower.indexOf(needle);
      while (at >= 0 && !asciiBoundaryOkay(text, at, term.alias)) at = lower.indexOf(needle, at + 1);
      if (at < 0) return;
      if (!best || at < best.at || (at === best.at && term.alias.length > best.alias.length)) best = { id: term.id, alias: term.alias, at };
    });
    return best;
  }

  function annotateTextNode(node, skipIds) {
    const text = node.nodeValue || "";
    const match = findMatch(text, skipIds);
    if (!match) return false;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "explanation-term-v344";
    button.dataset.term = match.id;
    button.setAttribute("aria-haspopup", "dialog");
    button.title = isEnglish() ? "Open a quick refresher" : "빠른 복습 보기";
    button.textContent = text.slice(match.at, match.at + match.alias.length);
    button.addEventListener("click", function () { openTerm(match.id, button); });
    const frag = document.createDocumentFragment();
    if (match.at > 0) frag.appendChild(document.createTextNode(text.slice(0, match.at)));
    frag.appendChild(button);
    const tail = text.slice(match.at + match.alias.length);
    if (tail) frag.appendChild(document.createTextNode(tail));
    node.parentNode.replaceChild(frag, node);
    skipIds.add(match.id);
    return true;
  }

  function annotateRoot(root) {
    if (!root || root.closest("#explanationRefresherV344")) return;
    const skipIds = new Set();
    const topic = currentTopicText();
    Object.keys(GLOSSARY).forEach(function (id) {
      if (GLOSSARY[id].aliases.some(function (a) { return topic.includes(a.toLowerCase()); })) skipIds.add(id);
    });
    root.querySelectorAll(".explanation-term-v344").forEach(function (el) {
      if (el.dataset.term) skipIds.add(el.dataset.term);
    });
    let count = root.querySelectorAll(".explanation-term-v344").length;
    if (count >= MAX_TERMS_PER_BLOCK) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest(EXCLUDED_SELECTOR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (count >= MAX_TERMS_PER_BLOCK) break;
      if (!node.isConnected) continue;
      if (annotateTextNode(node, skipIds)) count += 1;
    }
  }

  function annotateAll() {
    TARGET_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(annotateRoot);
    });
  }

  let scheduled = false;
  function scheduleAnnotate() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(function () {
      scheduled = false;
      annotateAll();
    }, 30);
  }

  function init() {
    injectStyles();
    ensureModal();
    annotateAll();
    const observer = new MutationObserver(function (mutations) {
      if (mutations.some(function (m) {
        const t = m.target && m.target.nodeType === 1 ? m.target : m.target && m.target.parentElement;
        return t && !t.closest("#explanationRefresherV344");
      })) scheduleAnnotate();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });
  }

  window.ExplanationSupportV344 = Object.freeze({
    version: VERSION,
    glossary: GLOSSARY,
    maxTermsPerBlock: MAX_TERMS_PER_BLOCK,
    targetSelectors: TARGET_SELECTORS.slice(),
    annotateAll,
    openTerm
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
