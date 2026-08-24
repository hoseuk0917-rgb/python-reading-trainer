// V400 V2.3 PEDAGOGICAL RUNTIME OVERLAY
// Shadow integration only. Load immediately after app.js.
// It is backward-compatible: legacy cards fall back to the existing renderers.
(function () {
  "use strict";

  const oldRenderConceptIntro = window.renderConceptIntroV306;
  const oldRenderReadingGoal = window.renderReadingGoalV306;
  const oldCheckAnswer = window.checkAnswer;
  const oldJumpToConfusedOrNext = window.jumpToConfusedOrNext;

  function t(ko, en) {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? en : ko;
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

  function appendTextBlock(parent, text, className, marginTop) {
    const value = String(text || "").trim();
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
    title.textContent = card.primary_concept || card.title || t("Python 개념", "Python concept");
    box.appendChild(title);

    const ce = card.concept_explanation || {};
    appendTextBlock(
      box,
      ce.what_it_is,
      "concept-intro-body-v306"
    );
    appendTextBlock(
      box,
      ce.how_to_read ? t("읽는 순서: ", "How to read: ") + ce.how_to_read : "",
      "concept-intro-note-v306",
      "8px"
    );
    appendTextBlock(
      box,
      ce.key_point ? t("핵심: ", "Key point: ") + ce.key_point : "",
      "concept-intro-note-v306",
      "6px"
    );
    appendTextBlock(
      box,
      ce.common_mistake ? t("주의: ", "Common mistake: ") + ce.common_mistake : "",
      "concept-intro-note-v306",
      "6px"
    );

    const example = card.teaching_example || {};
    const exampleCode = String(example.code || "").trim();

    if (exampleCode) {
      const exampleTitle = document.createElement("div");
      exampleTitle.className = "concept-intro-title-v306";
      exampleTitle.style.marginTop = "14px";
      exampleTitle.textContent = t("다른 예제로 먼저 보기", "See another example first");
      box.appendChild(exampleTitle);

      const pre = document.createElement("pre");
      pre.className = "code-block small-code";
      pre.textContent = exampleCode;
      box.appendChild(pre);

      appendTextBlock(
        box,
        example.walkthrough,
        "concept-intro-body-v306",
        "8px"
      );
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

    // V2.3 reading_goal_internal is author metadata, not a learner-facing
    // pre-question block. Keep it in the card for search/audit but hide the
    // legacy reading-goal UI so the learner flow remains:
    // title -> concept explanation -> teaching example -> question.
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
      ? t("정답.", "Correct.")
      : prefix === "confused"
        ? t("모르겠음 처리. 정답: ", "Marked as unsure. Answer: ") + expected
        : t("오답. 정답: ", "Incorrect. Answer: ") + expected;
    resultBox.appendChild(head);

    const ae = card.answer_explanation || {};

    appendTextBlock(
      resultBox,
      ae.step_by_step,
      "",
      "8px"
    );
    appendTextBlock(
      resultBox,
      ae.why_correct ? t("왜 맞는가: ", "Why this is correct: ") + ae.why_correct : "",
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
        wrongParts.push(t("오독 지점: ", "Where the reading went wrong: ") + wrong.misread_step);
      }
      appendTextBlock(
        resultBox,
        wrongParts.join(" "),
        "",
        "8px"
      );
    }

    appendTextBlock(
      resultBox,
      ae.takeaway ? t("다음에도 쓰는 규칙: ", "Rule to reuse: ") + ae.takeaway : "",
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

  window.V400PedagogyRuntime = {
    version: "v400_v2_3_shadow1",
    isRichCard: isV400RichCard
  };
})();