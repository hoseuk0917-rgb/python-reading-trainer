// V400 V2.3 PEDAGOGICAL RUNTIME OVERLAY
// Learner-facing quality layer for Korean/English rich cards.
// Backward-compatible: legacy cards fall back to the existing renderers.
(function () {
  "use strict";

  const VERSION = "v400_v2_3_quality4";
  const INPUT_BEGINNER_CARD_ID = "PYF94_A1_L01_INPUT_001";
  const oldRenderConceptIntro = window.renderConceptIntroV306;
  const oldRenderReadingGoal = window.renderReadingGoalV306;
  const oldCheckAnswer = window.checkAnswer;
  const oldJumpToConfusedOrNext = window.jumpToConfusedOrNext;

  function isEnglish() {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function t(ko, en) {
    return isEnglish() ? en : ko;
  }

  function isV400RichCard(card) {
    return Boolean(
      card &&
      card.authoring_version === "V2.3" &&
      card.concept_explanation &&
      card.teaching_example &&
      card.answer_explanation
    );
  }

  const CONCEPT_LABELS_KO = Object.freeze({
    call: "함수 호출하기",
    assignment: "변수에 값 저장하기",
    arithmetic: "숫자 계산하기",
    sequence_operation: "값을 순서대로 처리하기",
    name_reference: "변수의 현재 값 읽기",
    subscription: "대괄호로 값 꺼내기",
    attribute_access: "점(.)으로 속성 읽기",
    argument_passing: "함수에 값 전달하기",
    parameter_definition: "함수가 받을 값 정하기",
    function_definition: "함수 만들기",
    return_statement: "함수 결과 돌려주기",
    if_statement: "if 조건문",
    else_clause: "else 분기",
    for_statement: "for 반복문",
    while_statement: "while 반복문",
    break_statement: "반복 멈추기",
    continue_statement: "현재 반복 건너뛰기",
    comparison: "값 비교하기",
    membership_test: "포함되어 있는지 확인하기",
    identity_test: "None인지 확인하기",
    boolean_operation: "참·거짓 조건 묶기",
    unary_operation: "not 같은 단항 연산",
    conditional_expression: "조건에 따라 값 고르기",
    f_string: "f-string에 값 넣기",
    slice: "일부 구간 잘라 가져오기",
    tuple_literal: "튜플 만들기",
    list_literal: "리스트 만들기",
    dict_literal: "딕셔너리 만들기",
    set_literal: "집합 만들기",
    list_comprehension: "리스트 컴프리헨션",
    dict_comprehension: "딕셔너리 컴프리헨션",
    set_comprehension: "집합 컴프리헨션",
    generator_expression: "값을 하나씩 만드는 제너레이터",
    yield_expression: "yield로 값을 하나씩 내보내기",
    import_statement: "모듈 불러오기",
    from_import_statement: "모듈에서 이름 가져오기",
    try_statement: "오류가 날 수 있는 코드 시도하기",
    except_clause: "특정 오류 처리하기",
    finally_clause: "마지막에 항상 실행하기",
    raise_statement: "오류 직접 발생시키기",
    assert_statement: "기대 결과 확인하기",
    class_definition: "클래스 만들기",
    decorator: "함수에 데코레이터 적용하기",
    type_annotation: "타입 힌트 읽기",
    lambda_expression: "짧은 함수(lambda) 읽기",
    with_statement: "with로 자원 안전하게 사용하기",
    await_expression: "비동기 작업 결과 기다리기",
    async_function_definition: "비동기 함수 만들기",
    literal: "코드에 직접 적은 값 읽기",
    augmented_assignment: "값을 계산해 다시 저장하기",
    unpacking: "여러 값을 나누어 받기",
    match_statement: "패턴에 따라 분기하기",
    case_clause: "match의 경우 나누기"
  });

  const CONCEPT_LABELS_EN = Object.freeze({
    call: "Calling a function",
    assignment: "Storing a value in a variable",
    arithmetic: "Doing arithmetic",
    sequence_operation: "Processing values in order",
    name_reference: "Reading a variable's current value",
    subscription: "Getting a value with square brackets",
    attribute_access: "Reading an attribute with a dot",
    argument_passing: "Passing a value to a function",
    parameter_definition: "Defining a function parameter",
    function_definition: "Defining a function",
    return_statement: "Returning a result from a function",
    if_statement: "Using an if statement",
    else_clause: "Using an else branch",
    for_statement: "Using a for loop",
    while_statement: "Using a while loop",
    break_statement: "Stopping a loop",
    continue_statement: "Skipping the rest of one loop iteration",
    comparison: "Comparing values",
    membership_test: "Checking whether a value is included",
    identity_test: "Checking for None or object identity",
    boolean_operation: "Combining True/False conditions",
    unary_operation: "Using a unary operator such as not",
    conditional_expression: "Choosing a value with a condition",
    f_string: "Putting values into an f-string",
    slice: "Taking part of a sequence with slicing",
    tuple_literal: "Creating a tuple",
    list_literal: "Creating a list",
    dict_literal: "Creating a dictionary",
    set_literal: "Creating a set",
    list_comprehension: "Building a list with a comprehension",
    dict_comprehension: "Building a dictionary with a comprehension",
    set_comprehension: "Building a set with a comprehension",
    generator_expression: "Producing values with a generator expression",
    yield_expression: "Producing values with yield",
    import_statement: "Importing a module",
    from_import_statement: "Importing a name from a module",
    try_statement: "Trying code that may fail",
    except_clause: "Handling a specific error",
    finally_clause: "Running cleanup code with finally",
    raise_statement: "Raising an error",
    assert_statement: "Checking an expected result with assert",
    class_definition: "Defining a class",
    decorator: "Applying a decorator",
    type_annotation: "Reading a type hint",
    lambda_expression: "Reading a lambda function",
    with_statement: "Managing a resource with with",
    await_expression: "Waiting for an async result",
    async_function_definition: "Defining an async function",
    literal: "Reading a literal value",
    augmented_assignment: "Updating a value with an augmented assignment",
    unpacking: "Unpacking multiple values",
    match_statement: "Branching with match",
    case_clause: "Reading a match case"
  });

  function friendlyConceptLabel(card) {
    if (!card) return t("Python 개념", "Python concept");
    if (card.id === INPUT_BEGINNER_CARD_ID) return "input()";

    const raw = String(card.primary_concept || "").trim();
    if (!raw) return card.title || t("Python 개념", "Python concept");

    const labels = isEnglish() ? CONCEPT_LABELS_EN : CONCEPT_LABELS_KO;
    if (labels[raw]) return labels[raw];

    // Never expose authoring IDs such as for_statement directly to learners.
    if (/^[a-z0-9_]+$/i.test(raw) && raw.indexOf("_") >= 0) {
      if (isEnglish()) {
        return raw
          .split("_")
          .filter(Boolean)
          .map(function (part) {
            const map = {
              statement: "statement",
              expression: "expression",
              operation: "operation",
              definition: "definition",
              access: "access",
              passing: "passing",
              reference: "reference",
              literal: "value"
            };
            return map[part] || part;
          })
          .join(" ")
          .replace(/^./, function (ch) { return ch.toUpperCase(); });
      }
      return t("Python 핵심 개념", "Python concept");
    }

    return raw;
  }

  function stripLearnerMarkdown(value) {
    return String(value == null ? "" : value)
      .replace(/``([^`]+)``/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();
  }

  function polishBeginnerKorean(value) {
    let text = value;
    const replacements = [
      [/\bname_reference\b/g, "변수의 현재 값 읽기"],
      [/\bsubscription\b/g, "대괄호로 값 꺼내기"],
      [/\bif_statement\b/g, "if 조건문"],
      [/\belse_clause\b/g, "else 분기"],
      [/\bfor_statement\b/g, "for 반복문"],
      [/\breturn_statement\b/g, "return으로 결과 돌려주기"],
      [/\battribute_access\b/g, "점(.)으로 속성 읽기"],
      [/\bargument_passing\b/g, "함수에 값 전달하기"],
      [/\bparameter_definition\b/g, "함수가 받을 값 정하기"],
      [/\bmembership_test\b/g, "포함 여부 확인"],
      [/\bidentity_test\b/g, "None인지 확인"],
      [/\bsequence_operation\b/g, "값을 순서대로 처리하기"],
      [/\biterable\b/gi, "반복해서 값을 꺼낼 수 있는 대상"],
      [/\bnamespace\b/gi, "현재 코드에서 이름을 사용하는 범위"],
      [/\breceiver\b/gi, "점(.) 왼쪽의 대상 객체"],
      [/\barguments?\b/gi, "함수에 전달하는 값(인자)"],
      [/\bparameters?\b/gi, "함수가 받는 이름(매개변수)"]
    ];

    replacements.forEach(function (pair) {
      text = text.replace(pair[0], pair[1]);
    });
    return text;
  }

  function polishBeginnerEnglish(value) {
    let text = value;
    // Only replace unmistakable internal authoring tokens. Do not replace ordinary
    // English words such as call, assignment, comparison, literal, or slice.
    const tokenLabels = {
      sequence_operation: "processing values in order",
      name_reference: "reading a variable's current value",
      attribute_access: "attribute access with a dot",
      argument_passing: "passing an argument",
      parameter_definition: "defining a parameter",
      function_definition: "defining a function",
      return_statement: "returning a result",
      if_statement: "an if statement",
      else_clause: "an else branch",
      for_statement: "a for loop",
      while_statement: "a while loop",
      break_statement: "stopping a loop",
      continue_statement: "skipping the rest of one loop iteration",
      membership_test: "checking whether a value is included",
      identity_test: "checking object identity",
      boolean_operation: "a Boolean operation",
      unary_operation: "a unary operation",
      conditional_expression: "a conditional expression",
      f_string: "an f-string",
      tuple_literal: "a tuple value",
      list_literal: "a list value",
      dict_literal: "a dictionary value",
      set_literal: "a set value",
      list_comprehension: "a list comprehension",
      dict_comprehension: "a dictionary comprehension",
      set_comprehension: "a set comprehension",
      generator_expression: "a generator expression",
      yield_expression: "a yield expression",
      import_statement: "an import statement",
      from_import_statement: "a from-import statement",
      try_statement: "a try statement",
      except_clause: "an except clause",
      finally_clause: "a finally clause",
      raise_statement: "a raise statement",
      assert_statement: "an assert statement",
      class_definition: "a class definition",
      type_annotation: "a type hint",
      lambda_expression: "a lambda expression",
      with_statement: "a with statement",
      await_expression: "an await expression",
      async_function_definition: "an async function definition",
      augmented_assignment: "an augmented assignment",
      match_statement: "a match statement",
      case_clause: "a match case"
    };

    Object.keys(tokenLabels).forEach(function (token) {
      const pattern = new RegExp("\\b" + token + "\\b", "g");
      text = text.replace(pattern, tokenLabels[token]);
    });

    return text
      .replace(/^([A-Za-z_][A-Za-z0-9_.]*\([^)]*\))\s+This is a function that\b/g, "$1 is a function that")
      .replace(/^([A-Za-z_][A-Za-z0-9_.]*\([^)]*\))\s+As you can see,\s*it first counts\b/g, "For $1, first count")
      .replace(/^([A-Za-z_][A-Za-z0-9_.]*\([^)]*\))\s+When I look at this,\s*I interpret it as\b/g, "Read $1 as")
      .replace(/\bI explicitly specified\b/g, "The code explicitly specifies")
      .replace(/\bAs you can see,\s*/g, "")
      .replace(/\bYou can interpret this as\b/g, "Read this as")
      .replace(/\bWhen I look at this,\s*I interpret it as\b/g, "Read this as")
      .replace(/\bPoint of Misinterpretation:\s*/g, "Where it went wrong: ")
      .replace(/\bA common source of confusion:\s*/g, "Common mistake: ");
  }

  function learnerText(card, value) {
    let text = stripLearnerMarkdown(value);
    const level = Number(card && card.level);
    if (!Number.isFinite(level) || level > 3) return text;
    return isEnglish() ? polishBeginnerEnglish(text) : polishBeginnerKorean(text);
  }

  function appendTextBlock(parent, card, text, className, marginTop) {
    const value = learnerText(card, text);
    if (!value) return;

    const node = document.createElement("div");
    if (className) node.className = className;
    if (marginTop) node.style.marginTop = marginTop;
    node.textContent = value;
    parent.appendChild(node);
  }

  window.renderConceptIntroV306 = function renderConceptIntroV400(card) {
    if (!isV400RichCard(card)) {
      return typeof oldRenderConceptIntro === "function"
        ? oldRenderConceptIntro(card)
        : "";
    }

    const box = document.getElementById("conceptIntro");
    if (!box) return "";

    box.innerHTML = "";
    box.classList.remove("hidden");
    box.removeAttribute("data-side-card-id");

    const label = document.createElement("div");
    label.className = "concept-intro-label-v306";
    label.textContent = t("개념 설명", "Concept explanation");
    box.appendChild(label);

    const title = document.createElement("div");
    title.className = "concept-intro-title-v306";
    title.textContent = friendlyConceptLabel(card);
    box.appendChild(title);

    const ce = card.concept_explanation || {};
    appendTextBlock(box, card, ce.what_it_is, "concept-intro-body-v306");
    appendTextBlock(
      box,
      card,
      ce.how_to_read ? t("코드 읽기: ", "Read it like this: ") + ce.how_to_read : "",
      "concept-intro-note-v306",
      "8px"
    );
    appendTextBlock(
      box,
      card,
      ce.key_point ? t("기억할 것: ", "Remember: ") + ce.key_point : "",
      "concept-intro-note-v306",
      "6px"
    );
    appendTextBlock(
      box,
      card,
      ce.common_mistake ? t("헷갈리기 쉬운 점: ", "Easy mistake: ") + ce.common_mistake : "",
      "concept-intro-note-v306",
      "6px"
    );

    const example = card.teaching_example || {};
    const exampleCode = String(example.code || "").trim();

    if (exampleCode) {
      const exampleTitle = document.createElement("div");
      exampleTitle.className = "concept-intro-title-v306";
      exampleTitle.style.marginTop = "14px";
      exampleTitle.textContent = t("같은 개념을 다른 예제로 보기", "See the same idea in another example");
      box.appendChild(exampleTitle);

      const pre = document.createElement("pre");
      pre.className = "code-block small-code";
      pre.textContent = exampleCode;
      box.appendChild(pre);

      appendTextBlock(box, card, example.walkthrough, "concept-intro-body-v306", "8px");
    }

    return "";
  };

  window.renderReadingGoalV306 = function renderReadingGoalV400(card) {
    if (!isV400RichCard(card)) {
      if (typeof oldRenderReadingGoal === "function") {
        oldRenderReadingGoal(card);
      }
      return;
    }

    // reading_goal_internal is author metadata, not learner-facing content.
    const goal = document.getElementById("readingGoal");
    const wrap = document.getElementById("readingGoalWrap");

    if (goal) goal.textContent = "";
    if (wrap) {
      wrap.classList.add("hidden");
      wrap.open = false;
    }
  };

  function renderStructuredAnswer(card, prefix, expected) {
    const resultBox = document.getElementById("resultBox");
    if (!resultBox) return;

    resultBox.innerHTML = "";

    const head = document.createElement("div");
    head.style.fontWeight = "800";
    head.textContent = prefix === "correct"
      ? t("정답이에요.", "Correct.")
      : prefix === "confused"
        ? t("모르겠음으로 표시했어요. 정답: ", "Marked as unsure. Answer: ") + expected
        : t("아쉬워요. 정답: ", "Not quite. Answer: ") + expected;
    resultBox.appendChild(head);

    const ae = card.answer_explanation || {};

    appendTextBlock(resultBox, card, ae.step_by_step, "", "8px");
    appendTextBlock(
      resultBox,
      card,
      ae.why_correct ? t("정답인 이유: ", "Why it is correct: ") + ae.why_correct : "",
      "",
      "8px"
    );

    const wrong = ae.common_wrong_choice;
    if (wrong && typeof wrong === "object") {
      const wrongParts = [];
      if (wrong.choice) {
        wrongParts.push(t("헷갈리기 쉬운 오답: ", "Common wrong answer: ") + wrong.choice);
      }
      if (wrong.why_wrong) {
        wrongParts.push(wrong.why_wrong);
      }
      if (wrong.misread_step) {
        wrongParts.push(t("다시 볼 부분: ", "Check this step: ") + wrong.misread_step);
      }
      appendTextBlock(resultBox, card, wrongParts.join(" "), "", "8px");
    }

    appendTextBlock(
      resultBox,
      card,
      ae.takeaway ? t("기억할 규칙: ", "Rule to remember: ") + ae.takeaway : "",
      "",
      "8px"
    );
  }

  window.checkAnswer = function checkAnswerV400(choice, btn) {
    const card = typeof window.getCurrentCard === "function"
      ? window.getCurrentCard()
      : null;

    if (!isV400RichCard(card)) {
      if (typeof oldCheckAnswer === "function") {
        oldCheckAnswer(choice, btn);
      }
      return;
    }

    const resultBox = document.getElementById("resultBox");
    const expected = window.normalizeAnswer(card.answer);
    const actual = window.normalizeAnswer(choice);
    const ok = actual === expected;

    document.querySelectorAll(".choice-btn").forEach(function (button) {
      button.disabled = true;
    });

    if (ok) {
      btn.classList.add("correct");
      resultBox.className = "result-box good";
      renderStructuredAnswer(card, "correct", expected);
      window.markCorrect(card.id);
    } else {
      btn.classList.add("wrong");
      resultBox.className = "result-box bad";
      renderStructuredAnswer(card, "wrong", expected);
      window.markConfused(card.id);
    }

    document.getElementById("nextBtn").classList.add("primary-next");
  };

  window.jumpToConfusedOrNext = function jumpToConfusedOrNextV400() {
    const card = typeof window.getCurrentCard === "function"
      ? window.getCurrentCard()
      : null;

    if (!isV400RichCard(card)) {
      if (typeof oldJumpToConfusedOrNext === "function") {
        oldJumpToConfusedOrNext();
      }
      return;
    }

    const resultBox = document.getElementById("resultBox");
    const expected = window.normalizeAnswer(card.answer);

    window.markConfused(card.id);
    resultBox.className = "result-box bad";
    renderStructuredAnswer(card, "confused", expected);

    document.getElementById("nextBtn").classList.add("primary-next");

    document.querySelectorAll(".choice-btn").forEach(function (button) {
      button.disabled = true;
    });
  };

  window.V400PedagogyRuntime = Object.freeze({
    version: VERSION,
    isRichCard: isV400RichCard,
    conceptLabel: friendlyConceptLabel,
    learnerText: learnerText
  });
})();