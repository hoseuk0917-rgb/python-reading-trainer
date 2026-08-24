(function () {
  "use strict";

  const VERSION = "V400.2_DIAGNOSTIC_V2";
  const STORAGE_KEY = "python-reading-trainer-diagnostic-v400-2";

  let data = null;
  let loadedLanguage = "";
  let activeStage = "";
  let activeQuestions = [];
  let currentIndex = 0;
  let responses = {};
  let profileIndex = 0;
  let profileResponses = {};

  function isEnglish() {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en");
  }

  function language() {
    return isEnglish() ? "en" : "ko";
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function dataUrl() {
    return isEnglish()
      ? "../../data_i18n/en/diagnostic/diagnostic_v400_2.json"
      : "../../data/diagnostic/diagnostic_v400_2.json";
  }

  function root() {
    return document.getElementById("diagnosticRootV4002");
  }

  function newCycle() {
    return {
      version: VERSION,
      cycle_started_at: new Date().toISOString(),
      profile: null,
      screening: null,
      placement: null,
      baseline: null,
      checkpoint: null,
      retest: null
    };
  }

  function normalizeCycle(parsed) {
    if (!parsed || parsed.version !== VERSION) {
      return newCycle();
    }

    const cycle = parsed;
    const legacyStarted = !!(
      cycle.baseline || cycle.checkpoint || cycle.retest
    );

    if (!("profile" in cycle)) {
      cycle.profile = legacyStarted
        ? {
            completed_at: cycle.cycle_started_at || new Date().toISOString(),
            legacy: true,
            answers: {}
          }
        : null;
    }

    if (!("screening" in cycle)) {
      cycle.screening = legacyStarted
        ? {
            completed_at: cycle.cycle_started_at || new Date().toISOString(),
            legacy: true,
            score: null,
            total: 0,
            unknown_count: 0,
            responses: {}
          }
        : null;
    }

    if (!("placement" in cycle)) {
      cycle.placement = legacyStarted
        ? {
            decided_at: cycle.cycle_started_at || new Date().toISOString(),
            path: "deep",
            reasons: ["legacy_cycle"]
          }
        : null;
    }

    if (!("baseline" in cycle)) cycle.baseline = null;
    if (!("checkpoint" in cycle)) cycle.checkpoint = null;
    if (!("retest" in cycle)) cycle.retest = null;

    return cycle;
  }

  function loadCycle() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeCycle(parsed);
    } catch (_) {
      return newCycle();
    }
  }

  function saveCycle(cycle) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
    } catch (_) {}
  }

  function loadData() {
    const lang = language();

    if (data && loadedLanguage === lang) {
      return Promise.resolve(data);
    }

    return fetch(dataUrl(), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("diagnostic fetch failed: " + response.status);
        }
        return response.json();
      })
      .then(function (payload) {
        if (
          payload.version !== VERSION
          || payload.axis_count !== 8
          || payload.stages.baseline.question_count !== 24
          || payload.stages.retest.question_count !== 24
        ) {
          throw new Error("diagnostic authority mismatch");
        }

        data = payload;
        loadedLanguage = lang;
        return payload;
      });
  }

  function axisMap() {
    const map = {};
    data.axes.forEach(function (axis) {
      map[axis.id] = axis;
    });
    return map;
  }

  function profileQuestions() {
    return [
      {
        id: "vibe_coding",
        ko: "AI를 이용한 바이브코딩을 어느 정도 해봤나요?",
        en: "How much AI-assisted vibe coding have you done?",
        options: [
          [0, "해본 적 없음", "Never"],
          [1, "AI에게 간단한 코드만 요청해봄", "Asked AI for small code snippets"],
          [2, "AI로 작은 프로그램을 만들어봄", "Built a small program with AI"],
          [3, "여러 파일로 된 프로젝트를 만들어봄", "Built a multi-file project"],
          [4, "AI와 함께 수정·디버깅하며 프로젝트를 진행함", "Built and debugged projects with AI"]
        ]
      },
      {
        id: "direct_coding",
        ko: "AI 도움 없이 직접 코드를 작성하는 수준은 어느 정도인가요?",
        en: "How much code can you write without AI assistance?",
        options: [
          [0, "직접 작성해본 적 없음", "I have not written code myself"],
          [1, "예제를 보고 따라 쓸 수 있음", "I can copy and adapt examples"],
          [2, "간단한 코드는 혼자 작성할 수 있음", "I can write simple code myself"],
          [3, "함수와 여러 단계 로직을 직접 작성할 수 있음", "I can write functions and multi-step logic"],
          [4, "프로그램 구조를 잡고 구현할 수 있음", "I can structure and implement a program"]
        ]
      },
      {
        id: "python_use",
        ko: "Python을 실제로 사용해본 정도는 어느 정도인가요?",
        en: "How much have you actually used Python?",
        options: [
          [0, "써본 적 없음", "Never used it"],
          [1, "예제를 실행하거나 조금 고쳐본 적 있음", "Ran or lightly edited examples"],
          [2, "간단한 스크립트를 만들어봄", "Built simple scripts"],
          [3, "함수·파일·라이브러리를 사용해봄", "Used functions, files, and libraries"],
          [4, "Python 프로젝트를 직접 진행해봄", "Built a Python project"]
        ]
      },
      {
        id: "development_planning",
        ko: "개발 기획이나 기능 설계를 해본 정도는 어느 정도인가요?",
        en: "How much development planning or feature design have you done?",
        options: [
          [0, "해본 적 없음", "Never"],
          [1, "만들고 싶은 기능을 설명해본 정도", "Described features I wanted"],
          [2, "필요한 기능을 목록으로 나눠봄", "Broken work into feature lists"],
          [3, "화면·데이터·기능 흐름을 설계해봄", "Designed UI, data, and feature flows"],
          [4, "요구사항을 구현 작업 단위까지 나눠봄", "Turned requirements into implementation tasks"]
        ]
      },
      {
        id: "ai_code_control",
        ko: "AI가 만든 코드를 받았을 때 보통 어디까지 할 수 있나요?",
        en: "What can you usually do with AI-generated code?",
        options: [
          [0, "AI 코드를 사용해본 적 없음", "I have not used AI-generated code"],
          [1, "거의 그대로 실행함", "Mostly run it as-is"],
          [2, "대략 어떤 코드인지 읽어봄", "Read it at a high level"],
          [3, "문제가 생기면 일부를 직접 수정·디버깅함", "Modify or debug parts when needed"],
          [4, "구조·구현을 검토하고 AI에게 수정 방향을 지시함", "Review the design and direct AI changes"]
        ]
      }
    ];
  }

  function screeningQuestions() {
    return [
      {
        id: "screen_value_flow_1",
        axis: "value_flow",
        title: text("짧은 코드 읽기", "Quick code reading"),
        code: "x = 2\nx = x + 3\nprint(x)",
        question: text("마지막에 출력되는 값은 무엇인가요?", "What value is printed at the end?"),
        choices: ["2", "3", "5", "23"],
        correct_index: 2
      },
      {
        id: "screen_branch_1",
        axis: "branch_condition",
        title: text("짧은 코드 읽기", "Quick code reading"),
        code: "age = 17\nif age >= 18:\n    print(\"A\")\nelse:\n    print(\"B\")",
        question: text("출력되는 문자는 무엇인가요?", "Which letter is printed?"),
        choices: ["A", "B", "A와 B 모두", "아무것도 출력되지 않음"],
        correct_index: 1
      },
      {
        id: "screen_collection_1",
        axis: "loop_collection",
        title: text("짧은 코드 읽기", "Quick code reading"),
        code: "items = [\"a\", \"b\", \"c\"]\nprint(len(items))",
        question: text("출력되는 값은 무엇인가요?", "What value is printed?"),
        choices: ["1", "2", "3", "abc"],
        correct_index: 2
      },
      {
        id: "screen_function_1",
        axis: "function_call_return",
        title: text("짧은 코드 읽기", "Quick code reading"),
        code: "def add_one(n):\n    return n + 1\n\nresult = add_one(4)\nprint(result)",
        question: text("마지막에 출력되는 값은 무엇인가요?", "What value is printed at the end?"),
        choices: ["1", "4", "5", "add_one"],
        correct_index: 2
      }
    ];
  }

  function scoreQuestions(questions, answerRows) {
    const axisScores = {};
    let totalCorrect = 0;
    let unknownCount = 0;

    questions.forEach(function (question) {
      if (!axisScores[question.axis]) {
        axisScores[question.axis] = {
          correct: 0,
          total: 0,
          unknown: 0
        };
      }

      const row = answerRows[question.id];
      const unknown = !!(row && row.unknown);
      const ok = !!(
        row
        && !unknown
        && Number(row.index) === Number(question.correct_index)
      );

      axisScores[question.axis].total += 1;

      if (unknown) {
        unknownCount += 1;
        axisScores[question.axis].unknown += 1;
      }

      if (ok) {
        totalCorrect += 1;
        axisScores[question.axis].correct += 1;
      }
    });

    return {
      score: totalCorrect,
      total: questions.length,
      unknown_count: unknownCount,
      axis_scores: axisScores
    };
  }

  function profileHasDeepSignal(profile) {
    const answers = profile && profile.answers ? profile.answers : {};
    return (
      Number(answers.python_use || 0) >= 1
      || Number(answers.direct_coding || 0) >= 2
      || Number(answers.vibe_coding || 0) >= 2
      || Number(answers.ai_code_control || 0) >= 3
    );
  }

  function determinePlacement(profile, screening) {
    const experience = profileHasDeepSignal(profile);
    const score = Number(screening.score || 0);
    const reasons = [];

    if (experience) reasons.push("experience_signal");
    if (score >= 2) reasons.push("screening_ready");
    if (experience && score <= 1) reasons.push("experience_result_gap");
    if (!experience && score >= 3) reasons.push("self_report_result_gap");

    return {
      decided_at: new Date().toISOString(),
      path: (experience || score >= 2) ? "deep" : "foundation",
      reasons: reasons
    };
  }

  function stageLabel(stage) {
    if (stage === "screening") {
      return text("초기 코드 스크리닝", "Initial code screening");
    }
    if (stage === "baseline") {
      return text("초기 심화진단 · Form A", "Initial Deep Diagnostic · Form A");
    }
    if (stage === "checkpoint") {
      return text("중간 점검", "Checkpoint Test");
    }
    return text("최종 재진단 · Form B", "Final Retest · Form B");
  }

  function progressMarkup(cycle) {
    const entryDone = !!(cycle.profile && cycle.screening);
    const rows = [
      { ko: "초기 진단", en: "Initial check", done: entryDone },
      { ko: "심화 진단", en: "Deep diagnostic", done: !!cycle.baseline },
      { ko: "중간 점검", en: "Checkpoint", done: !!cycle.checkpoint },
      { ko: "재진단", en: "Retest", done: !!cycle.retest }
    ];

    return `
      <div class="diagnostic-stage-track-v4002">
        ${rows.map(function (row, index) {
          return `
            <div class="diagnostic-stage-step-v4002 ${row.done ? "done" : ""}">
              <span>${index + 1}</span>
              <strong>${text(row.ko, row.en)}</strong>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function nextStage(cycle) {
    if (!cycle.profile) return "profile";
    if (!cycle.screening) return "screening";
    if (!cycle.baseline) {
      return cycle.placement && cycle.placement.path === "foundation"
        ? "foundation_ready"
        : "baseline";
    }
    if (!cycle.checkpoint) return "checkpoint";
    if (!cycle.retest) return "retest";
    return "complete";
  }

  function lowestAxes(baseline) {
    const rows = data.axes.map(function (axis) {
      const score = baseline.axis_scores[axis.id] || { correct: 0, total: 3 };
      return {
        id: axis.id,
        correct: Number(score.correct || 0),
        total: Number(score.total || 3)
      };
    });

    rows.sort(function (a, b) {
      const ratioA = a.correct / a.total;
      const ratioB = b.correct / b.total;
      if (ratioA !== ratioB) return ratioA - ratioB;
      if (a.correct !== b.correct) return a.correct - b.correct;
      return a.id.localeCompare(b.id);
    });

    const priority = rows.filter(function (row) {
      return row.correct <= 1;
    });

    let count = Math.max(3, Math.min(4, priority.length));
    if (count > rows.length) count = rows.length;

    return rows.slice(0, count).map(function (row) {
      return row.id;
    });
  }

  function checkpointQuestions(baseline) {
    const axes = lowestAxes(baseline);
    const questions = [];

    axes.forEach(function (axisId) {
      const pool = data.stages.checkpoint.pool[axisId] || [];
      const score = baseline.axis_scores[axisId] || { correct: 0 };
      const start = Number(score.correct || 0) % 4;
      const indices = [start, (start + 2) % 4];

      indices.forEach(function (index) {
        if (pool[index]) questions.push(pool[index]);
      });
    });

    return questions;
  }

  function renderHome() {
    const el = root();
    if (!el || !data) return;

    const cycle = loadCycle();
    const stage = nextStage(cycle);
    let title = "";
    let body = "";
    let action = "";

    if (stage === "profile") {
      title = text(
        "먼저 개발 경험을 짧게 확인합니다",
        "First, tell us briefly about your development experience"
      );
      body = text(
        "바이브코딩, 직접 코딩, Python 사용, 개발기획, AI 코드 통제 경험을 확인합니다. 이 응답 자체를 Python 실력 점수에 더하지는 않습니다.",
        "We check vibe coding, direct coding, Python use, planning, and AI-code control. These answers are not added directly to your Python skill score."
      );
      action = text("경험 프로필 시작", "Start experience profile");
    } else if (stage === "screening") {
      title = text(
        "아주 짧은 코드 4개만 먼저 읽어봅니다",
        "Read just four short code samples first"
      );
      body = text(
        "모르면 반드시 ‘모르겠음’을 선택해도 됩니다. 찍기보다 모른다고 답하는 것이 학습 시작점을 더 정확히 잡는 데 도움이 됩니다.",
        "Choose ‘I don't know’ whenever you are unsure. That gives a more accurate starting point than guessing."
      );
      action = text("초기 스크리닝 시작", "Start initial screening");
    } else if (stage === "foundation_ready") {
      title = text(
        "지금은 입문부터 시작하는 편이 적합합니다",
        "Starting from the foundations is the best fit right now"
      );
      body = text(
        "짧은 초기진단만으로 시작점을 잡기에 충분해 24문제 심화진단은 건너뛸 수 있습니다. 원하면 심화진단도 바로 진행할 수 있습니다.",
        "The short initial check is enough to choose a starting point, so you can skip the 24-question deep diagnostic. You can still take it if you want."
      );
      action = text("기초 학습 시작", "Start foundation learning");
    } else if (stage === "baseline") {
      title = text(
        "초기 심화진단으로 실제 범위를 확인합니다",
        "Use the deep diagnostic to verify your actual range"
      );
      body = text(
        "경험 응답 또는 초기 코드 읽기 결과를 바탕으로 8개 영역을 3문제씩, 총 24문제로 확인합니다. 모든 문제에서 ‘모르겠음’을 선택할 수 있습니다.",
        "Based on your experience or screening result, this 24-question diagnostic checks eight areas with three questions each. ‘I don't know’ is available on every question."
      );
      action = text("초기 심화진단 시작", "Start deep diagnostic");
    } else if (stage === "checkpoint") {
      title = text("이제 약점 영역을 중간 점검합니다", "Check the areas that need work");
      body = text(
        "초기 심화진단에서 점수가 낮았던 3~4개 영역만 골라 6~8문제로 다시 확인합니다.",
        "The checkpoint selects the three or four lowest deep-diagnostic areas and tests them with 6–8 new questions."
      );
      action = text("중간 점검 시작", "Start checkpoint");
    } else if (stage === "retest") {
      title = text("마지막으로 전체 영역을 다시 측정합니다", "Measure all areas again");
      body = text(
        "초기 심화진단과 겹치지 않는 Form B 24문제로 전체 영역을 다시 평가하고 향상도를 비교합니다.",
        "The final retest uses 24 non-overlapping Form B questions and compares the result with your deep baseline."
      );
      action = text("최종 재진단 시작", "Start final retest");
    } else {
      const before = cycle.baseline ? cycle.baseline.score : 0;
      const after = cycle.retest ? cycle.retest.score : 0;
      const delta = after - before;
      title = text("이번 진단 사이클을 완료했습니다", "This diagnostic cycle is complete");
      body = text(
        "심화진단 " + before + "/24 → 최종 " + after + "/24 · 변화 " + (delta >= 0 ? "+" : "") + delta,
        "Deep baseline " + before + "/24 → final " + after + "/24 · change " + (delta >= 0 ? "+" : "") + delta
      );
      action = text("새 진단 사이클 시작", "Start a new cycle");
    }

    const showLearn = !!(cycle.screening || cycle.baseline);
    const showOptionalDeep = stage === "foundation_ready";

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        ${progressMarkup(cycle)}
        <div class="diagnostic-kicker-v4002">
          ${text("Python 맞춤형 시작 진단", "Personalized Python Entry Diagnostic")}
        </div>
        <h2>${title}</h2>
        <p>${body}</p>
        <div class="diagnostic-home-actions-v4002">
          <button type="button" id="diagnosticPrimaryV4002">${action}</button>
          ${showOptionalDeep ? `
            <button type="button" id="diagnosticOptionalDeepV4002" class="secondary">
              ${text("심화진단도 해보기", "Take the deep diagnostic")}
            </button>
          ` : ""}
          ${showLearn && stage !== "foundation_ready" ? `
            <button type="button" id="diagnosticLearnV4002" class="secondary">
              ${text("학습으로 이동", "Go to learning")}
            </button>
          ` : ""}
        </div>
      </section>
    `;

    document.getElementById("diagnosticPrimaryV4002").addEventListener("click", function () {
      if (stage === "profile") {
        startProfile();
      } else if (stage === "screening") {
        startScreening();
      } else if (stage === "foundation_ready") {
        goToLearning();
      } else if (stage === "complete") {
        const ok = window.confirm(text(
          "현재 진단 기록을 새 사이클로 바꿀까요?",
          "Start a new diagnostic cycle?"
        ));
        if (!ok) return;
        const fresh = newCycle();
        saveCycle(fresh);
        startProfile();
      } else {
        startStage(stage);
      }
    });

    const optionalDeep = document.getElementById("diagnosticOptionalDeepV4002");
    if (optionalDeep) {
      optionalDeep.addEventListener("click", function () {
        const current = loadCycle();
        current.placement = Object.assign({}, current.placement || {}, {
          decided_at: new Date().toISOString(),
          path: "deep",
          optional_override: true
        });
        saveCycle(current);
        startStage("baseline");
      });
    }

    const learn = document.getElementById("diagnosticLearnV4002");
    if (learn) learn.addEventListener("click", goToLearning);
  }

  function startProfile() {
    profileIndex = 0;
    profileResponses = {};
    renderProfileQuestion();
  }

  function renderProfileQuestion() {
    const el = root();
    const questions = profileQuestions();
    const question = questions[profileIndex];

    if (!el) return;
    if (!question) {
      finishProfile();
      return;
    }

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        <div class="diagnostic-progress-v4002">${profileIndex + 1} / ${questions.length}</div>
        <div class="diagnostic-stage-label-v4002">${text("개발 경험 프로필", "Development experience profile")}</div>
        <h2></h2>
        <p class="diagnostic-question-v4002"></p>
        <div id="diagnosticChoicesV4002" class="diagnostic-choices-v4002"></div>
      </section>
    `;

    el.querySelector("h2").textContent = text(question.ko, question.en);
    el.querySelector(".diagnostic-question-v4002").textContent = text(
      "가장 가까운 항목 하나를 골라주세요. 정답이 있는 질문이 아닙니다.",
      "Choose the closest option. There is no correct answer here."
    );

    const choices = document.getElementById("diagnosticChoicesV4002");
    question.options.forEach(function (option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "diagnostic-choice-v4002";
      button.textContent = text(option[1], option[2]);
      button.addEventListener("click", function () {
        profileResponses[question.id] = Number(option[0]);
        profileIndex += 1;
        renderProfileQuestion();
      });
      choices.appendChild(button);
    });
  }

  function finishProfile() {
    const cycle = loadCycle();
    cycle.profile = {
      completed_at: new Date().toISOString(),
      answers: Object.assign({}, profileResponses)
    };
    cycle.screening = null;
    cycle.placement = null;
    cycle.baseline = null;
    cycle.checkpoint = null;
    cycle.retest = null;
    saveCycle(cycle);
    renderHome();
  }

  function startScreening() {
    activeStage = "screening";
    activeQuestions = screeningQuestions();
    currentIndex = 0;
    responses = {};
    renderQuestion();
  }

  function finishScreening() {
    const cycle = loadCycle();
    const score = scoreQuestions(activeQuestions, responses);
    const result = {
      completed_at: new Date().toISOString(),
      score: score.score,
      total: score.total,
      unknown_count: score.unknown_count,
      axis_scores: score.axis_scores,
      question_ids: activeQuestions.map(function (question) { return question.id; }),
      responses: responses
    };

    cycle.screening = result;
    cycle.placement = determinePlacement(cycle.profile, result);
    saveCycle(cycle);
    renderScreeningResult(result, cycle);
  }

  function renderScreeningResult(result, cycle) {
    const el = root();
    if (!el) return;

    const deep = cycle.placement && cycle.placement.path === "deep";
    const experience = profileHasDeepSignal(cycle.profile);
    let explanation;

    if (!deep) {
      explanation = text(
        "현재 응답에서는 기초부터 시작하는 편이 효율적입니다. 모르는 문제를 억지로 더 풀지 않아도 됩니다.",
        "Your responses suggest starting from the foundations. You do not need to force your way through harder questions."
      );
    } else if (experience && result.score <= 1) {
      explanation = text(
        "개발·Python 경험 응답과 짧은 코드 읽기 결과 사이에 차이가 있어, 기존 24문제 심화진단으로 실제 학습 범위를 확인하는 편이 좋습니다.",
        "Your experience profile and quick code-reading result differ, so the 24-question deep diagnostic will verify your actual learning range."
      );
    } else if (experience) {
      explanation = text(
        "Python·직접 코딩·바이브코딩·AI 코드 수정 경험이 확인되어 기존 24문제 심화진단으로 실제 범위를 확인합니다.",
        "Your Python, direct-coding, vibe-coding, or AI-code editing experience indicates that the 24-question deep diagnostic is useful."
      );
    } else {
      explanation = text(
        "짧은 코드 읽기에서 기초 이해가 확인되어 기존 24문제 심화진단으로 어디까지 알고 있는지 더 확인합니다.",
        "The quick screening shows enough code-reading familiarity to continue with the 24-question deep diagnostic."
      );
    }

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        ${progressMarkup(cycle)}
        <div class="diagnostic-kicker-v4002">${text("초기 스크리닝 결과", "Initial screening result")}</div>
        <h2>${result.score} / ${result.total}</h2>
        <p>${text("‘모르겠음’ 선택", "‘I don't know’ answers")} ${result.unknown_count}${text("개", "")}</p>
        <p>${explanation}</p>
        <div class="diagnostic-actions-v4002">
          <button type="button" id="diagnosticScreeningNextV4002">
            ${deep ? text("초기 심화진단 시작", "Start deep diagnostic") : text("기초 학습 시작", "Start foundation learning")}
          </button>
          ${!deep ? `
            <button type="button" id="diagnosticScreeningDeepV4002" class="secondary">
              ${text("심화진단도 해보기", "Take the deep diagnostic")}
            </button>
          ` : `
            <button type="button" id="diagnosticScreeningLearnV4002" class="secondary">
              ${text("학습으로 이동", "Go to learning")}
            </button>
          `}
        </div>
      </section>
    `;

    document.getElementById("diagnosticScreeningNextV4002").addEventListener("click", function () {
      if (deep) startStage("baseline");
      else goToLearning();
    });

    const deepButton = document.getElementById("diagnosticScreeningDeepV4002");
    if (deepButton) {
      deepButton.addEventListener("click", function () {
        const current = loadCycle();
        current.placement = Object.assign({}, current.placement || {}, {
          decided_at: new Date().toISOString(),
          path: "deep",
          optional_override: true
        });
        saveCycle(current);
        startStage("baseline");
      });
    }

    const learn = document.getElementById("diagnosticScreeningLearnV4002");
    if (learn) learn.addEventListener("click", goToLearning);
  }

  function startStage(stage) {
    const cycle = loadCycle();

    if (stage === "checkpoint" && !cycle.baseline) stage = "baseline";
    if (stage === "retest" && !cycle.checkpoint) {
      stage = cycle.baseline ? "checkpoint" : "baseline";
    }

    if (stage === "baseline") {
      activeQuestions = data.stages.baseline.questions.slice();
    } else if (stage === "checkpoint") {
      activeQuestions = checkpointQuestions(cycle.baseline);
    } else {
      activeQuestions = data.stages.retest.questions.slice();
    }

    if (
      stage === "checkpoint"
      && (activeQuestions.length < 6 || activeQuestions.length > 8)
    ) {
      throw new Error("checkpoint question count mismatch");
    }

    activeStage = stage;
    currentIndex = 0;
    responses = {};
    renderQuestion();
  }

  function answerQuestion(question, value) {
    responses[question.id] = value;
    currentIndex += 1;

    if (currentIndex >= activeQuestions.length) {
      if (activeStage === "screening") finishScreening();
      else finishStage();
    } else {
      renderQuestion();
    }
  }

  function renderQuestion() {
    const el = root();
    const question = activeQuestions[currentIndex];
    if (!el) return;

    if (!question) {
      if (activeStage === "screening") finishScreening();
      else finishStage();
      return;
    }

    const axes = axisMap();
    const axis = axes[question.axis];

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        <div class="diagnostic-progress-v4002">${currentIndex + 1} / ${activeQuestions.length}</div>
        <div class="diagnostic-stage-label-v4002">${stageLabel(activeStage)}</div>
        <div class="diagnostic-axis-v4002">${axis ? axis.label : question.axis}</div>
        <h2></h2>
        ${question.code ? `<pre class="diagnostic-code-v4002"><code></code></pre>` : ""}
        <p class="diagnostic-question-v4002"></p>
        <div id="diagnosticChoicesV4002" class="diagnostic-choices-v4002"></div>
      </section>
    `;

    el.querySelector("h2").textContent = question.title || "";
    const code = el.querySelector("code");
    if (code) code.textContent = question.code;
    el.querySelector(".diagnostic-question-v4002").textContent = question.question || "";

    const choices = document.getElementById("diagnosticChoicesV4002");
    question.choices.forEach(function (choice, choiceIndex) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "diagnostic-choice-v4002";
      button.textContent = Array.isArray(choice) ? choice.join(", ") : String(choice);
      button.addEventListener("click", function () {
        answerQuestion(question, {
          index: choiceIndex,
          unknown: false
        });
      });
      choices.appendChild(button);
    });

    const unknownButton = document.createElement("button");
    unknownButton.type = "button";
    unknownButton.className = "diagnostic-choice-v4002 secondary";
    unknownButton.textContent = text(
      "모르겠음 · 찍지 않고 넘어가기",
      "I don't know · skip without guessing"
    );
    unknownButton.addEventListener("click", function () {
      answerQuestion(question, {
        index: null,
        unknown: true
      });
    });
    choices.appendChild(unknownButton);
  }

  function finishStage() {
    const cycle = loadCycle();
    const score = scoreQuestions(activeQuestions, responses);
    const result = {
      completed_at: new Date().toISOString(),
      score: score.score,
      total: score.total,
      unknown_count: score.unknown_count,
      axis_scores: score.axis_scores,
      question_ids: activeQuestions.map(function (question) { return question.id; }),
      responses: responses
    };

    cycle[activeStage] = result;
    saveCycle(cycle);
    renderResult(activeStage, result, cycle);
  }

  function statusLabel(correct, total) {
    const ratio = total ? correct / total : 0;
    if (ratio >= 0.99) return text("강점", "Strong");
    if (ratio >= 0.66) return text("보통", "Developing");
    return text("우선 보완", "Priority");
  }

  function axisResultRows(result, showRemediation) {
    return data.axes
      .filter(function (axis) {
        return !!result.axis_scores[axis.id];
      })
      .map(function (axis) {
        const row = result.axis_scores[axis.id];
        const ratio = row.total ? row.correct / row.total : 0;
        const weak = ratio <= 0.5;
        const remediation = Array.isArray(axis.remediation) ? axis.remediation : [];
        const review = showRemediation && weak && remediation.length
          ? `
            <div class="diagnostic-remediation-v4002">
              <strong>${text("추천 복습 카드", "Recommended review cards")}</strong>
              <ul>
                ${remediation.slice(0, 4).map(function (card) {
                  return `<li>Level ${card.level} · ${card.title}</li>`;
                }).join("")}
              </ul>
            </div>
          `
          : "";
        const unknown = Number(row.unknown || 0);

        return `
          <article class="diagnostic-axis-result-v4002 ${weak ? "weak" : ""}">
            <div>
              <strong>${axis.label}</strong>
              <span>${row.correct} / ${row.total}</span>
            </div>
            <p>${statusLabel(row.correct, row.total)}${unknown ? ` · ${text("모르겠음", "Unknown")} ${unknown}` : ""}</p>
            ${review}
          </article>
        `;
      })
      .join("");
  }

  function comparisonMarkup(stage, cycle) {
    if (stage === "checkpoint" && cycle.baseline) {
      const rows = data.axes
        .filter(function (axis) {
          return !!cycle.checkpoint.axis_scores[axis.id];
        })
        .map(function (axis) {
          const before = cycle.baseline.axis_scores[axis.id];
          const after = cycle.checkpoint.axis_scores[axis.id];
          const beforePct = Math.round(100 * before.correct / before.total);
          const afterPct = Math.round(100 * after.correct / after.total);
          return `<li>${axis.label}: ${beforePct}% → ${afterPct}%</li>`;
        })
        .join("");

      return `
        <div class="diagnostic-comparison-v4002">
          <strong>${text("초기 심화진단 대비", "Compared with deep baseline")}</strong>
          <ul>${rows}</ul>
        </div>
      `;
    }

    if (stage === "retest" && cycle.baseline) {
      const delta = cycle.retest.score - cycle.baseline.score;
      const rows = data.axes.map(function (axis) {
        const before = cycle.baseline.axis_scores[axis.id];
        const after = cycle.retest.axis_scores[axis.id];
        return `<li>${axis.label}: ${before.correct}/3 → ${after.correct}/3</li>`;
      }).join("");

      return `
        <div class="diagnostic-comparison-v4002">
          <strong>${text("초기 심화진단과 최종 재진단 비교", "Deep baseline vs final retest")}</strong>
          <p>${cycle.baseline.score}/24 → ${cycle.retest.score}/24 · ${text("변화", "Change")} ${delta >= 0 ? "+" : ""}${delta}</p>
          <ul>${rows}</ul>
        </div>
      `;
    }

    return "";
  }

  function renderResult(stage, result, cycle) {
    const el = root();
    if (!el) return;

    const next = stage === "baseline"
      ? "checkpoint"
      : stage === "checkpoint"
        ? "retest"
        : "complete";

    let nextLabel;
    if (next === "checkpoint") nextLabel = text("중간 점검 시작", "Start checkpoint");
    else if (next === "retest") nextLabel = text("최종 재진단 시작", "Start final retest");
    else nextLabel = text("진단 요약 보기", "View diagnostic summary");

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        ${progressMarkup(cycle)}
        <div class="diagnostic-kicker-v4002">${stageLabel(stage)}</div>
        <h2>${result.score} / ${result.total}</h2>
        <p>${text("‘모르겠음’ 선택", "‘I don't know’ answers")} ${Number(result.unknown_count || 0)}${text("개", "")}</p>
        ${comparisonMarkup(stage, cycle)}
        <div class="diagnostic-results-v4002">${axisResultRows(result, true)}</div>
        <div class="diagnostic-actions-v4002">
          <button type="button" id="diagnosticLearnResultV4002">${text("학습으로 이동", "Go to learning")}</button>
          <button type="button" id="diagnosticNextStageV4002" class="secondary">${nextLabel}</button>
        </div>
      </section>
    `;

    document.getElementById("diagnosticLearnResultV4002").addEventListener("click", goToLearning);
    document.getElementById("diagnosticNextStageV4002").addEventListener("click", function () {
      if (next === "complete") renderHome();
      else startStage(next);
    });
  }

  function syncFoundationLearningPrompt() {
    const cycle = loadCycle();
    if (
      !cycle.placement
      || cycle.placement.path !== "foundation"
      || cycle.baseline
    ) {
      return;
    }

    const panel = document.getElementById("diagnosticLearningPromptV4002");
    if (!panel || panel.querySelector("[data-foundation-entry-v4002]")) {
      return;
    }

    panel.innerHTML = `
      <div data-foundation-entry-v4002="true">
        <strong>${text("초기진단 결과: 기초부터 시작", "Initial result: start with foundations")}</strong>
        <p>${text(
          "지금은 24문제 심화진단보다 기초 학습을 먼저 진행하는 편이 적합합니다. 학습 후 원할 때 심화진단을 다시 선택할 수 있습니다.",
          "Foundation study is a better next step than the 24-question deep diagnostic right now. You can choose the deep diagnostic later."
        )}</p>
      </div>
      <button type="button" id="diagnosticFoundationPromptV4002">
        ${text("초기진단 결과 보기", "View initial result")}
      </button>
    `;

    const action = document.getElementById("diagnosticFoundationPromptV4002");
    if (action) {
      action.addEventListener("click", function () {
        const button = document.querySelector('[data-view="diagnostic"]');
        if (button) button.click();
      });
    }
  }

  function observeFoundationLearningPrompt() {
    const learnView = document.getElementById("learnView");
    if (!learnView || typeof MutationObserver !== "function") {
      return;
    }

    const observer = new MutationObserver(function () {
      syncFoundationLearningPrompt();
    });

    observer.observe(learnView, { childList: true, subtree: true });
    window.setTimeout(syncFoundationLearningPrompt, 0);
  }

  function goToLearning() {
    const button = document.querySelector('[data-view="learn"]');
    if (button) button.click();
    window.setTimeout(syncFoundationLearningPrompt, 0);
  }

  function renderError(error) {
    const el = root();
    if (!el) return;
    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        <h2>${text("진단을 불러오지 못했습니다", "Could not load the diagnostic")}</h2>
        <p></p>
      </section>
    `;
    el.querySelector("p").textContent = error && error.message ? error.message : String(error);
  }

  function activate() {
    loadData().then(renderHome).catch(renderError);
  }

  function init() {
    const tab = document.querySelector('[data-view="diagnostic"]');
    if (!tab) return;

    tab.textContent = text("진단", "Diagnostic");
    tab.addEventListener("click", activate);
    observeFoundationLearningPrompt();

    window.PRTDiagnosticV4002 = Object.freeze({
      version: VERSION,
      activate: activate
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
