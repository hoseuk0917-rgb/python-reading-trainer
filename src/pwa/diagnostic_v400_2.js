(function () {
  "use strict";

  const VERSION = "V400.2_DIAGNOSTIC_V2";
  const STORAGE_KEY =
    "python-reading-trainer-diagnostic-v400-2";

  let data = null;
  let loadedLanguage = "";
  let activeStage = "";
  let activeQuestions = [];
  let currentIndex = 0;
  let responses = {};

  function isEnglish() {
    return String(
      document.documentElement.lang || ""
    )
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
    return document.getElementById(
      "diagnosticRootV4002"
    );
  }

  function newCycle() {
    return {
      version: VERSION,
      cycle_started_at:
        new Date().toISOString(),
      baseline: null,
      checkpoint: null,
      retest: null
    };
  }

  function loadCycle() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "null"
      );

      if (
        parsed &&
        parsed.version === VERSION
      ) {
        return parsed;
      }
    } catch (_) {}

    return newCycle();
  }

  function saveCycle(cycle) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cycle)
      );
    } catch (_) {}
  }

  function loadData() {
    const lang = language();

    if (
      data &&
      loadedLanguage === lang
    ) {
      return Promise.resolve(data);
    }

    return fetch(
      dataUrl(),
      {
        cache: "no-store"
      }
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "diagnostic fetch failed: "
            + response.status
          );
        }

        return response.json();
      })
      .then(function (payload) {
        if (
          payload.version
            !== VERSION
          || payload.axis_count
            !== 8
          || payload.stages
            .baseline
            .question_count
            !== 24
          || payload.stages
            .retest
            .question_count
            !== 24
        ) {
          throw new Error(
            "diagnostic authority mismatch"
          );
        }

        data = payload;
        loadedLanguage = lang;

        return payload;
      });
  }

  function axisMap() {
    const map = {};

    data.axes.forEach(
      function (axis) {
        map[axis.id] = axis;
      }
    );

    return map;
  }

  function scoreQuestions(
    questions,
    answerRows
  ) {
    const axisScores = {};
    let totalCorrect = 0;

    questions.forEach(
      function (question) {
        if (
          !axisScores[
            question.axis
          ]
        ) {
          axisScores[
            question.axis
          ] = {
            correct: 0,
            total: 0
          };
        }

        const row =
          answerRows[
            question.id
          ];

        const ok = (
          row
          && Number(row.index)
            === Number(
              question.correct_index
            )
        );

        axisScores[
          question.axis
        ].total += 1;

        if (ok) {
          totalCorrect += 1;

          axisScores[
            question.axis
          ].correct += 1;
        }
      }
    );

    return {
      score: totalCorrect,
      total: questions.length,
      axis_scores: axisScores
    };
  }

  function stageLabel(stage) {
    if (stage === "baseline") {
      return text(
        "최초 진단 · Form A",
        "Baseline Diagnostic · Form A"
      );
    }

    if (stage === "checkpoint") {
      return text(
        "중간 점검",
        "Checkpoint Test"
      );
    }

    return text(
      "최종 재진단 · Form B",
      "Final Retest · Form B"
    );
  }

  function progressMarkup(cycle) {
    const rows = [
      {
        id: "baseline",
        ko: "최초 진단",
        en: "Baseline",
        done: !!cycle.baseline
      },
      {
        id: "checkpoint",
        ko: "중간 점검",
        en: "Checkpoint",
        done: !!cycle.checkpoint
      },
      {
        id: "retest",
        ko: "최종 재진단",
        en: "Final retest",
        done: !!cycle.retest
      }
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
    if (!cycle.baseline) {
      return "baseline";
    }

    if (!cycle.checkpoint) {
      return "checkpoint";
    }

    if (!cycle.retest) {
      return "retest";
    }

    return "complete";
  }

  function lowestAxes(
    baseline
  ) {
    const rows = data.axes.map(
      function (axis) {
        const score =
          baseline.axis_scores[
            axis.id
          ] || {
            correct: 0,
            total: 3
          };

        return {
          id: axis.id,
          correct:
            Number(
              score.correct || 0
            ),
          total:
            Number(
              score.total || 3
            )
        };
      }
    );

    rows.sort(
      function (a, b) {
        const ratioA =
          a.correct / a.total;

        const ratioB =
          b.correct / b.total;

        if (ratioA !== ratioB) {
          return ratioA - ratioB;
        }

        if (
          a.correct !== b.correct
        ) {
          return (
            a.correct - b.correct
          );
        }

        return a.id.localeCompare(
          b.id
        );
      }
    );

    const priority =
      rows.filter(
        function (row) {
          return (
            row.correct <= 1
          );
        }
      );

    let count = Math.max(
      3,
      Math.min(
        4,
        priority.length
      )
    );

    if (count > rows.length) {
      count = rows.length;
    }

    return rows
      .slice(0, count)
      .map(function (row) {
        return row.id;
      });
  }

  function checkpointQuestions(
    baseline
  ) {
    const axes = lowestAxes(
      baseline
    );

    const questions = [];

    axes.forEach(
      function (axisId) {
        const pool =
          data.stages
            .checkpoint
            .pool[
              axisId
            ] || [];

        const score =
          baseline.axis_scores[
            axisId
          ] || {
            correct: 0
          };

        const start =
          Number(
            score.correct || 0
          ) % 4;

        const indices = [
          start,
          (start + 2) % 4
        ];

        indices.forEach(
          function (index) {
            if (pool[index]) {
              questions.push(
                pool[index]
              );
            }
          }
        );
      }
    );

    return questions;
  }

  function renderHome() {
    const el = root();

    if (!el || !data) {
      return;
    }

    const cycle = loadCycle();
    const stage =
      nextStage(cycle);

    let title;
    let body;
    let action;

    if (stage === "baseline") {
      title = text(
        "현재 실력을 먼저 측정합니다",
        "Measure your current skill first"
      );

      body = text(
        "8개 영역을 3문제씩, 총 24문제로 확인합니다. 정답은 시험 중 공개하지 않습니다.",
        "The baseline uses 24 questions: three questions across each of eight areas. Answers are not revealed during the test."
      );

      action = text(
        "최초 진단 시작",
        "Start baseline"
      );
    } else if (
      stage === "checkpoint"
    ) {
      title = text(
        "이제 약점 영역을 중간 점검합니다",
        "Check the areas that need work"
      );

      body = text(
        "최초 진단에서 점수가 낮았던 3~4개 영역만 골라 6~8문제로 다시 확인합니다.",
        "The checkpoint selects the three or four lowest baseline areas and tests them with 6–8 new questions."
      );

      action = text(
        "중간 점검 시작",
        "Start checkpoint"
      );
    } else if (
      stage === "retest"
    ) {
      title = text(
        "마지막으로 전체 영역을 다시 측정합니다",
        "Measure all areas again"
      );

      body = text(
        "최초 진단과 겹치지 않는 Form B 24문제로 전체 영역을 다시 평가하고 향상도를 비교합니다.",
        "The final retest uses 24 non-overlapping Form B questions and compares the result with your baseline."
      );

      action = text(
        "최종 재진단 시작",
        "Start final retest"
      );
    } else {
      title = text(
        "이번 진단 사이클을 완료했습니다",
        "This diagnostic cycle is complete"
      );

      const before =
        cycle.baseline
          ? cycle.baseline.score
          : 0;

      const after =
        cycle.retest
          ? cycle.retest.score
          : 0;

      const delta =
        after - before;

      body = text(
        "최초 "
          + before
          + "/24 → 최종 "
          + after
          + "/24 · 변화 "
          + (delta >= 0 ? "+" : "")
          + delta,
        "Baseline "
          + before
          + "/24 → final "
          + after
          + "/24 · change "
          + (delta >= 0 ? "+" : "")
          + delta
      );

      action = text(
        "새 진단 사이클 시작",
        "Start a new cycle"
      );
    }

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        ${progressMarkup(cycle)}
        <div class="diagnostic-kicker-v4002">
          ${text(
            "Python 독해 단계형 진단",
            "Staged Python Reading Diagnostic"
          )}
        </div>
        <h2>${title}</h2>
        <p>${body}</p>
        <div class="diagnostic-home-actions-v4002">
          <button type="button" id="diagnosticPrimaryV4002">
            ${action}
          </button>
          ${
            cycle.baseline
              ? `
                <button
                  type="button"
                  id="diagnosticLearnV4002"
                  class="secondary"
                >
                  ${text(
                    "학습으로 이동",
                    "Go to learning"
                  )}
                </button>
              `
              : ""
          }
        </div>
      </section>
    `;

    document
      .getElementById(
        "diagnosticPrimaryV4002"
      )
      .addEventListener(
        "click",
        function () {
          if (
            stage
              === "complete"
          ) {
            const ok =
              window.confirm(
                text(
                  "현재 진단 기록을 새 사이클로 바꿀까요?",
                  "Start a new diagnostic cycle?"
                )
              );

            if (!ok) {
              return;
            }

            const fresh =
              newCycle();

            saveCycle(fresh);
            startStage(
              "baseline"
            );

            return;
          }

          startStage(stage);
        }
      );

    const learn =
      document.getElementById(
        "diagnosticLearnV4002"
      );

    if (learn) {
      learn.addEventListener(
        "click",
        goToLearning
      );
    }
  }

  function startStage(stage) {
    const cycle = loadCycle();

    if (
      stage === "checkpoint"
      && !cycle.baseline
    ) {
      stage = "baseline";
    }

    if (
      stage === "retest"
      && !cycle.checkpoint
    ) {
      stage = cycle.baseline
        ? "checkpoint"
        : "baseline";
    }

    if (stage === "baseline") {
      activeQuestions =
        data.stages
          .baseline
          .questions
          .slice();
    } else if (
      stage === "checkpoint"
    ) {
      activeQuestions =
        checkpointQuestions(
          cycle.baseline
        );
    } else {
      activeQuestions =
        data.stages
          .retest
          .questions
          .slice();
    }

    if (
      stage === "checkpoint"
      && (
        activeQuestions.length < 6
        || activeQuestions.length > 8
      )
    ) {
      throw new Error(
        "checkpoint question count mismatch"
      );
    }

    activeStage = stage;
    currentIndex = 0;
    responses = {};

    renderQuestion();
  }

  function renderQuestion() {
    const el = root();
    const question =
      activeQuestions[
        currentIndex
      ];

    if (!el) {
      return;
    }

    if (!question) {
      finishStage();
      return;
    }

    const axes = axisMap();
    const axis =
      axes[question.axis];

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        <div class="diagnostic-progress-v4002">
          ${currentIndex + 1}
          /
          ${activeQuestions.length}
        </div>
        <div class="diagnostic-stage-label-v4002">
          ${stageLabel(activeStage)}
        </div>
        <div class="diagnostic-axis-v4002">
          ${axis ? axis.label : question.axis}
        </div>
        <h2></h2>
        ${
          question.code
            ? `
              <pre class="diagnostic-code-v4002"><code></code></pre>
            `
            : ""
        }
        <p class="diagnostic-question-v4002"></p>
        <div
          id="diagnosticChoicesV4002"
          class="diagnostic-choices-v4002"
        ></div>
      </section>
    `;

    el.querySelector("h2")
      .textContent =
        question.title || "";

    const code =
      el.querySelector("code");

    if (code) {
      code.textContent =
        question.code;
    }

    el.querySelector(
      ".diagnostic-question-v4002"
    ).textContent =
      question.question || "";

    const choices =
      document.getElementById(
        "diagnosticChoicesV4002"
      );

    question.choices.forEach(
      function (
        choice,
        choiceIndex
      ) {
        const button =
          document.createElement(
            "button"
          );

        button.type = "button";
        button.className =
          "diagnostic-choice-v4002";

        button.textContent =
          Array.isArray(choice)
            ? choice.join(", ")
            : String(choice);

        button.addEventListener(
          "click",
          function () {
            responses[
              question.id
            ] = {
              index:
                choiceIndex
            };

            currentIndex += 1;

            if (
              currentIndex
                >= activeQuestions
                  .length
            ) {
              finishStage();
            } else {
              renderQuestion();
            }
          }
        );

        choices.appendChild(
          button
        );
      }
    );
  }

  function finishStage() {
    const cycle = loadCycle();

    const score =
      scoreQuestions(
        activeQuestions,
        responses
      );

    const result = {
      completed_at:
        new Date().toISOString(),
      score: score.score,
      total: score.total,
      axis_scores:
        score.axis_scores,
      question_ids:
        activeQuestions.map(
          function (question) {
            return question.id;
          }
        ),
      responses: responses
    };

    cycle[
      activeStage
    ] = result;

    saveCycle(cycle);

    renderResult(
      activeStage,
      result,
      cycle
    );
  }

  function statusLabel(
    correct,
    total
  ) {
    const ratio =
      total
        ? correct / total
        : 0;

    if (ratio >= 0.99) {
      return text(
        "강점",
        "Strong"
      );
    }

    if (ratio >= 0.66) {
      return text(
        "보통",
        "Developing"
      );
    }

    return text(
      "우선 보완",
      "Priority"
    );
  }

  function axisResultRows(
    result,
    showRemediation
  ) {
    return data.axes
      .filter(
        function (axis) {
          return !!result
            .axis_scores[
              axis.id
            ];
        }
      )
      .map(
        function (axis) {
          const row =
            result.axis_scores[
              axis.id
            ];

          const ratio =
            row.total
              ? (
                  row.correct
                  / row.total
                )
              : 0;

          const weak =
            ratio <= 0.5;

          const review =
            showRemediation
            && weak
            ? `
              <div class="diagnostic-remediation-v4002">
                <strong>
                  ${text(
                    "추천 복습 카드",
                    "Recommended review cards"
                  )}
                </strong>
                <ul>
                  ${axis.remediation
                    .slice(0, 4)
                    .map(
                      function (
                        card
                      ) {
                        return `
                          <li>
                            Level ${card.level}
                            ·
                            ${card.title}
                          </li>
                        `;
                      }
                    )
                    .join("")}
                </ul>
              </div>
            `
            : "";

          return `
            <article
              class="diagnostic-axis-result-v4002 ${weak ? "weak" : ""}"
            >
              <div>
                <strong>
                  ${axis.label}
                </strong>
                <span>
                  ${row.correct}
                  /
                  ${row.total}
                </span>
              </div>
              <p>
                ${statusLabel(
                  row.correct,
                  row.total
                )}
              </p>
              ${review}
            </article>
          `;
        }
      )
      .join("");
  }

  function comparisonMarkup(
    stage,
    cycle
  ) {
    if (
      stage === "checkpoint"
      && cycle.baseline
    ) {
      const rows =
        data.axes
          .filter(
            function (axis) {
              return !!cycle
                .checkpoint
                .axis_scores[
                  axis.id
                ];
            }
          )
          .map(
            function (axis) {
              const before =
                cycle.baseline
                  .axis_scores[
                    axis.id
                  ];

              const after =
                cycle.checkpoint
                  .axis_scores[
                    axis.id
                  ];

              const beforePct =
                Math.round(
                  100
                  * before.correct
                  / before.total
                );

              const afterPct =
                Math.round(
                  100
                  * after.correct
                  / after.total
                );

              return `
                <li>
                  ${axis.label}:
                  ${beforePct}%
                  →
                  ${afterPct}%
                </li>
              `;
            }
          )
          .join("");

      return `
        <div class="diagnostic-comparison-v4002">
          <strong>
            ${text(
              "최초 진단 대비",
              "Compared with baseline"
            )}
          </strong>
          <ul>${rows}</ul>
        </div>
      `;
    }

    if (
      stage === "retest"
      && cycle.baseline
    ) {
      const delta =
        cycle.retest.score
        - cycle.baseline.score;

      const rows =
        data.axes
          .map(
            function (axis) {
              const before =
                cycle.baseline
                  .axis_scores[
                    axis.id
                  ];

              const after =
                cycle.retest
                  .axis_scores[
                    axis.id
                  ];

              return `
                <li>
                  ${axis.label}:
                  ${before.correct}/3
                  →
                  ${after.correct}/3
                </li>
              `;
            }
          )
          .join("");

      return `
        <div class="diagnostic-comparison-v4002">
          <strong>
            ${text(
              "최초 진단과 최종 재진단 비교",
              "Baseline vs final retest"
            )}
          </strong>
          <p>
            ${cycle.baseline.score}/24
            →
            ${cycle.retest.score}/24
            ·
            ${text(
              "변화",
              "Change"
            )}
            ${delta >= 0 ? "+" : ""}${delta}
          </p>
          <ul>${rows}</ul>
        </div>
      `;
    }

    return "";
  }

  function renderResult(
    stage,
    result,
    cycle
  ) {
    const el = root();

    if (!el) {
      return;
    }

    const next =
      stage === "baseline"
        ? "checkpoint"
        : stage === "checkpoint"
          ? "retest"
          : "complete";

    let nextLabel;

    if (next === "checkpoint") {
      nextLabel = text(
        "중간 점검 시작",
        "Start checkpoint"
      );
    } else if (
      next === "retest"
    ) {
      nextLabel = text(
        "최종 재진단 시작",
        "Start final retest"
      );
    } else {
      nextLabel = text(
        "진단 요약 보기",
        "View diagnostic summary"
      );
    }

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        ${progressMarkup(cycle)}
        <div class="diagnostic-kicker-v4002">
          ${stageLabel(stage)}
        </div>
        <h2>
          ${result.score}
          /
          ${result.total}
        </h2>

        ${comparisonMarkup(
          stage,
          cycle
        )}

        <div class="diagnostic-results-v4002">
          ${axisResultRows(
            result,
            true
          )}
        </div>

        <div class="diagnostic-actions-v4002">
          <button
            type="button"
            id="diagnosticLearnResultV4002"
          >
            ${text(
              "학습으로 이동",
              "Go to learning"
            )}
          </button>

          <button
            type="button"
            id="diagnosticNextStageV4002"
            class="secondary"
          >
            ${nextLabel}
          </button>
        </div>
      </section>
    `;

    document
      .getElementById(
        "diagnosticLearnResultV4002"
      )
      .addEventListener(
        "click",
        goToLearning
      );

    document
      .getElementById(
        "diagnosticNextStageV4002"
      )
      .addEventListener(
        "click",
        function () {
          if (
            next === "complete"
          ) {
            renderHome();
          } else {
            startStage(next);
          }
        }
      );
  }

  function goToLearning() {
    const button =
      document.querySelector(
        '[data-view="learn"]'
      );

    if (button) {
      button.click();
    }
  }

  function renderError(error) {
    const el = root();

    if (!el) {
      return;
    }

    el.innerHTML = `
      <section class="diagnostic-shell-v4002">
        <h2>
          ${text(
            "진단을 불러오지 못했습니다",
            "Could not load the diagnostic"
          )}
        </h2>
        <p></p>
      </section>
    `;

    el.querySelector("p")
      .textContent =
        error
        && error.message
          ? error.message
          : String(error);
  }

  function activate() {
    loadData()
      .then(renderHome)
      .catch(renderError);
  }

  function init() {
    const tab =
      document.querySelector(
        '[data-view="diagnostic"]'
      );

    if (!tab) {
      return;
    }

    tab.textContent =
      text(
        "진단",
        "Diagnostic"
      );

    tab.addEventListener(
      "click",
      activate
    );

    window.PRTDiagnosticV4002 =
      Object.freeze({
        version: VERSION,
        activate: activate
      });
  }

  if (
    document.readyState
      === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();