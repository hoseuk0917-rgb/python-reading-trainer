(function () {
  "use strict";

  const VERSION =
    "V400.2_DIAGNOSTIC_REMEDIATION_R1";

  const DIAG_KEY =
    "python-reading-trainer-diagnostic-v400-2";

  const REMEDIATION_KEY =
    "python-reading-trainer-diagnostic-remediation-v400-2";

  const TOOLS_KEY =
    "python-reading-trainer-study-tools-v7";

  const QUEUE_PROGRESS_KEY =
    "python-reading-trainer-study-queue-progress-v7-2";

  const AXES = [
    {
      id: "value_flow",
      ko: "값·대입 추적",
      en: "Values & assignment",
      keywords: [
        "assignment",
        "name_reference",
        "subscription",
        "variable",
        "value",
        "literal",
        "index",
        "len",
        "item_count"
      ]
    },
    {
      id: "branch_condition",
      ko: "조건·분기",
      en: "Conditions & branching",
      keywords: [
        "if",
        "else",
        "elif",
        "boolean",
        "condition",
        "branch",
        "guard",
        "comparison",
        "truth"
      ]
    },
    {
      id: "loop_collection",
      ko: "반복·컬렉션",
      en: "Loops & collections",
      keywords: [
        "for",
        "while",
        "loop",
        "iteration",
        "list",
        "dict",
        "set",
        "tuple",
        "comprehension",
        "enumerate",
        "zip"
      ]
    },
    {
      id: "function_call_return",
      ko: "함수 호출·반환",
      en: "Calls & returns",
      keywords: [
        "call",
        "function",
        "return",
        "def",
        "parameter",
        "argument",
        "scope",
        "lambda"
      ]
    },
    {
      id: "file_error_path",
      ko: "파일·예외·경로",
      en: "Files, errors & paths",
      keywords: [
        "file",
        "path",
        "open",
        "exception",
        "try",
        "except",
        "error",
        "encoding",
        "mkdir"
      ]
    },
    {
      id: "object_module",
      ko: "객체·모듈",
      en: "Objects & modules",
      keywords: [
        "class",
        "object",
        "self",
        "method",
        "inheritance",
        "import",
        "module",
        "package",
        "dataclass"
      ]
    },
    {
      id: "data_processing",
      ko: "데이터 처리",
      en: "Data processing",
      keywords: [
        "pandas",
        "numpy",
        "dataframe",
        "groupby",
        "merge",
        "regex",
        "jsonl",
        "csv",
        "dedup",
        "sort",
        "filter"
      ]
    },
    {
      id: "project_flow",
      ko: "프로젝트 코드 흐름",
      en: "Project code flow",
      keywords: [
        "api",
        "http",
        "async",
        "database",
        "sql",
        "git",
        "test",
        "pipeline",
        "architecture",
        "repository",
        "rag",
        "cli",
        "deploy"
      ]
    }
  ];

  let diagnosticData = null;
  let diagnosticLanguage = "";
  let bannerTimer = null;

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

  function axisLabel(axis) {
    return isEnglish()
      ? axis.en
      : axis.ko;
  }

  function readJson(key, fallback) {
    try {
      const raw =
        localStorage.getItem(key);

      if (!raw) {
        return fallback;
      }

      const parsed =
        JSON.parse(raw);

      return parsed == null
        ? fallback
        : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;
    } catch (_) {
      return false;
    }
  }

  function cycle() {
    return readJson(
      DIAG_KEY,
      null
    );
  }

  function remediationState() {
    const value =
      readJson(
        REMEDIATION_KEY,
        null
      );

    if (
      value
      && value.version === VERSION
    ) {
      return value;
    }

    return {
      version: VERSION,
      generated_count: 0,
      completed_count: 0,
      recent_ids: [],
      last_queue: null
    };
  }

  function saveRemediationState(
    value
  ) {
    writeJson(
      REMEDIATION_KEY,
      value
    );
  }

  function progress() {
    try {
      if (
        typeof loadProgress
          === "function"
      ) {
        const value =
          loadProgress();

        if (value) {
          return value;
        }
      }
    } catch (_) {}

    return {
      seen: {},
      correct: {},
      confused: {},
      lastSeenAt: {}
    };
  }

  function availableCards() {
    try {
      if (Array.isArray(cards)) {
        return cards;
      }
    } catch (_) {}

    return [];
  }

  function diagnosticUrl() {
    return isEnglish()
      ? "../../data_i18n/en/diagnostic/diagnostic_v400_2.json"
      : "../../data/diagnostic/diagnostic_v400_2.json";
  }

  function loadDiagnosticData() {
    const lang = language();

    if (
      diagnosticData
      && diagnosticLanguage === lang
    ) {
      return Promise.resolve(
        diagnosticData
      );
    }

    return fetch(
      diagnosticUrl(),
      {
        cache: "no-store"
      }
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "diagnostic data fetch failed"
          );
        }

        return response.json();
      })
      .then(function (payload) {
        diagnosticData = payload;
        diagnosticLanguage = lang;
        return payload;
      });
  }

  function diagnosticQuestionIds() {
    const ids = new Set();

    if (!diagnosticData) {
      return ids;
    }

    const stages =
      diagnosticData.stages || {};

    const baseline =
      stages.baseline
      && Array.isArray(
        stages.baseline.questions
      )
        ? stages.baseline.questions
        : [];

    const retest =
      stages.retest
      && Array.isArray(
        stages.retest.questions
      )
        ? stages.retest.questions
        : [];

    baseline
      .concat(retest)
      .forEach(function (row) {
        if (row.source_card_id) {
          ids.add(
            row.source_card_id
          );
        }
      });

    const pool =
      stages.checkpoint
      && stages.checkpoint.pool
        ? stages.checkpoint.pool
        : {};

    Object.keys(pool)
      .forEach(function (axisId) {
        const rows =
          Array.isArray(pool[axisId])
            ? pool[axisId]
            : [];

        rows.forEach(
          function (row) {
            if (
              row.source_card_id
            ) {
              ids.add(
                row.source_card_id
              );
            }
          }
        );
      });

    return ids;
  }

  function effectiveScores(
    currentCycle
  ) {
    if (
      !currentCycle
      || !currentCycle.baseline
    ) {
      return null;
    }

    const source = {};

    AXES.forEach(
      function (axis) {
        const base =
          currentCycle
            .baseline
            .axis_scores[
              axis.id
            ];

        source[axis.id] =
          base
            ? {
                correct:
                  Number(
                    base.correct || 0
                  ),
                total:
                  Number(
                    base.total || 3
                  ),
                source:
                  "baseline"
              }
            : {
                correct: 0,
                total: 3,
                source:
                  "baseline"
              };
      }
    );

    if (
      currentCycle.checkpoint
      && currentCycle
        .checkpoint
        .axis_scores
    ) {
      Object.keys(
        currentCycle
          .checkpoint
          .axis_scores
      ).forEach(
        function (axisId) {
          const row =
            currentCycle
              .checkpoint
              .axis_scores[
                axisId
              ];

          source[axisId] = {
            correct:
              Number(
                row.correct || 0
              ),
            total:
              Number(
                row.total || 2
              ),
            source:
              "checkpoint"
          };
        }
      );
    }

    if (
      currentCycle.retest
      && currentCycle
        .retest
        .axis_scores
    ) {
      Object.keys(
        currentCycle
          .retest
          .axis_scores
      ).forEach(
        function (axisId) {
          const row =
            currentCycle
              .retest
              .axis_scores[
                axisId
              ];

          source[axisId] = {
            correct:
              Number(
                row.correct || 0
              ),
            total:
              Number(
                row.total || 3
              ),
            source:
              "retest"
          };
        }
      );
    }

    return source;
  }

  function ratio(row) {
    if (
      !row
      || !Number(row.total)
    ) {
      return 0;
    }

    return (
      Number(row.correct || 0)
      / Number(row.total)
    );
  }

  function weaknessWeight(row) {
    const value = ratio(row);

    if (value >= 0.99) {
      return 0.5;
    }

    if (value >= 0.66) {
      return 1.5;
    }

    if (value >= 0.33) {
      return 3.0;
    }

    return 5.0;
  }

  function buildAllocation(
    scores,
    total
  ) {
    const result = {};
    const entries =
      AXES.map(
        function (axis) {
          return {
            id: axis.id,
            weight:
              weaknessWeight(
                scores[
                  axis.id
                ]
              )
          };
        }
      );

    entries.forEach(
      function (entry) {
        result[entry.id] = 0;
      }
    );

    const strong =
      entries.filter(
        function (entry) {
          return (
            ratio(
              scores[entry.id]
            ) >= 0.99
          );
        }
      );

    let remaining = total;

    if (
      strong.length > 0
      && total >= 5
    ) {
      const state =
        remediationState();

      const pick =
        strong[
          state.generated_count
          % strong.length
        ];

      result[pick.id] += 1;
      remaining -= 1;
    }

    if (remaining <= 0) {
      return result;
    }

    const weightTotal =
      entries.reduce(
        function (sum, entry) {
          return (
            sum
            + entry.weight
          );
        },
        0
      ) || 1;

    const fractions = [];

    entries.forEach(
      function (entry) {
        const exact =
          remaining
          * entry.weight
          / weightTotal;

        const whole =
          Math.floor(exact);

        result[entry.id] +=
          whole;

        fractions.push({
          id: entry.id,
          value:
            exact - whole,
          weight:
            entry.weight
        });
      }
    );

    let assigned =
      Object.values(result)
        .reduce(
          function (sum, value) {
            return sum + value;
          },
          0
        );

    fractions.sort(
      function (a, b) {
        if (
          b.value !== a.value
        ) {
          return (
            b.value - a.value
          );
        }

        if (
          b.weight !== a.weight
        ) {
          return (
            b.weight - a.weight
          );
        }

        return a.id.localeCompare(
          b.id
        );
      }
    );

    let index = 0;

    while (assigned < total) {
      const entry =
        fractions[
          index
          % fractions.length
        ];

      result[entry.id] += 1;
      assigned += 1;
      index += 1;
    }

    return result;
  }

  function cardBlob(card) {
    const parts = [
      card.id,
      card.title,
      card.primary_concept,
      card.coverage_domain,
      card.pedagogical_intent,
      card.reading_goal,
      card.question
    ];

    if (
      Array.isArray(
        card.concepts
      )
    ) {
      parts.push(
        card.concepts.join(" ")
      );
    }

    if (
      Array.isArray(
        card.coverage_topics
      )
    ) {
      parts.push(
        card.coverage_topics
          .join(" ")
      );
    }

    return parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function keywordHits(
    card,
    axis
  ) {
    const blob =
      cardBlob(card);

    let hits = 0;

    axis.keywords.forEach(
      function (keyword) {
        if (
          blob.indexOf(
            String(keyword)
              .toLowerCase()
          ) >= 0
        ) {
          hits += 1;
        }
      }
    );

    return hits;
  }

  function overallRatio(scores) {
    let correct = 0;
    let total = 0;

    AXES.forEach(
      function (axis) {
        const row =
          scores[axis.id];

        if (!row) {
          return;
        }

        correct +=
          Number(
            row.correct || 0
          );

        total +=
          Number(
            row.total || 0
          );
      }
    );

    return total
      ? correct / total
      : 0;
  }

  function targetLevel(scores) {
    const value =
      overallRatio(scores);

    if (value < 0.35) {
      return 3;
    }

    if (value < 0.55) {
      return 5;
    }

    if (value < 0.75) {
      return 7;
    }

    return 9;
  }

  function candidateScore(
    card,
    axis,
    target,
    learningProgress,
    recent
  ) {
    const hits =
      keywordHits(
        card,
        axis
      );

    if (hits <= 0) {
      return null;
    }

    const id = card.id;
    const seen =
      Number(
        learningProgress
          .seen[id] || 0
      );

    const correct =
      Number(
        learningProgress
          .correct[id] || 0
      );

    const confused =
      Number(
        learningProgress
          .confused[id] || 0
      );

    const level =
      Number(
        card.level || target
      );

    let score =
      hits * 100;

    score +=
      confused * 14;

    if (seen === 0) {
      score += 10;
    }

    score -=
      Math.min(
        correct * 3,
        15
      );

    score -=
      Math.abs(
        level - target
      ) * 3;

    if (recent.has(id)) {
      score -= 45;
    }

    return score;
  }

  function rankedCandidates(
    axis,
    target,
    excluded,
    recent,
    picked
  ) {
    const learningProgress =
      progress();

    return availableCards()
      .filter(
        function (card) {
          return (
            card
            && card.id
            && !excluded.has(
              card.id
            )
            && !picked.has(
              card.id
            )
          );
        }
      )
      .map(
        function (card) {
          return {
            card: card,
            score:
              candidateScore(
                card,
                axis,
                target,
                learningProgress,
                recent
              )
          };
        }
      )
      .filter(
        function (row) {
          return (
            row.score !== null
          );
        }
      )
      .sort(
        function (a, b) {
          if (
            b.score !== a.score
          ) {
            return (
              b.score
              - a.score
            );
          }

          return String(
            a.card.id
          ).localeCompare(
            String(
              b.card.id
            )
          );
        }
      );
  }

  function buildWeightedQueue(
    focusAxisId
  ) {
    const currentCycle =
      cycle();

    const scores =
      effectiveScores(
        currentCycle
      );

    if (!scores) {
      throw new Error(
        "baseline required"
      );
    }

    const allocation =
      focusAxisId
        ? AXES.reduce(
            function (
              value,
              axis
            ) {
              value[axis.id] =
                axis.id
                  === focusAxisId
                  ? 10
                  : 0;

              return value;
            },
            {}
          )
        : buildAllocation(
            scores,
            10
          );

    const state =
      remediationState();

    const recent =
      new Set(
        Array.isArray(
          state.recent_ids
        )
          ? state.recent_ids
          : []
      );

    const excluded =
      diagnosticQuestionIds();

    const picked =
      new Set();

    const rows = [];

    const target =
      targetLevel(scores);

    const orderedAxes =
      AXES.slice()
        .sort(
          function (a, b) {
            const countA =
              allocation[a.id]
              || 0;

            const countB =
              allocation[b.id]
              || 0;

            if (
              countB !== countA
            ) {
              return (
                countB
                - countA
              );
            }

            return (
              weaknessWeight(
                scores[b.id]
              )
              - weaknessWeight(
                scores[a.id]
              )
            );
          }
        );

    orderedAxes.forEach(
      function (axis) {
        const count =
          allocation[
            axis.id
          ] || 0;

        if (count <= 0) {
          return;
        }

        const candidates =
          rankedCandidates(
            axis,
            target,
            excluded,
            recent,
            picked
          );

        for (
          let index = 0;
          index < count
            && index
              < candidates.length;
          index += 1
        ) {
          const card =
            candidates[
              index
            ].card;

          picked.add(
            card.id
          );

          rows.push({
            id: card.id,
            axis: axis.id
          });
        }
      }
    );

    if (rows.length < 10) {
      const weakest =
        AXES.slice()
          .sort(
            function (a, b) {
              return (
                weaknessWeight(
                  scores[b.id]
                )
                - weaknessWeight(
                  scores[a.id]
                )
              );
            }
          );

      for (
        let axisIndex = 0;
        axisIndex < weakest.length
          && rows.length < 10;
        axisIndex += 1
      ) {
        const axis =
          weakest[axisIndex];

        const candidates =
          rankedCandidates(
            axis,
            target,
            excluded,
            recent,
            picked
          );

        for (
          let index = 0;
          index < candidates.length
            && rows.length < 10;
          index += 1
        ) {
          const card =
            candidates[
              index
            ].card;

          if (
            picked.has(card.id)
          ) {
            continue;
          }

          picked.add(
            card.id
          );

          rows.push({
            id: card.id,
            axis: axis.id
          });
        }
      }
    }

    if (rows.length !== 10) {
      throw new Error(
        "could not build 10-card remediation queue"
      );
    }

    return {
      rows: rows,
      allocation: allocation,
      targetLevel: target
    };
  }

  function queueAxisCounts(rows) {
    const counts = {};

    AXES.forEach(
      function (axis) {
        counts[axis.id] = 0;
      }
    );

    rows.forEach(
      function (row) {
        counts[row.axis] =
          (
            counts[row.axis]
            || 0
          ) + 1;
      }
    );

    return counts;
  }

  function saveQueue(
    built,
    focusAxisId
  ) {
    const ids =
      built.rows.map(
        function (row) {
          return row.id;
        }
      );

    writeJson(
      TOOLS_KEY,
      {
        query: "",
        level: "all",
        mode: "all",
        queueIds: ids
      }
    );

    writeJson(
      QUEUE_PROGRESS_KEY,
      {
        doneIds: []
      }
    );

    const state =
      remediationState();

    state.generated_count += 1;

    state.recent_ids =
      state.recent_ids
        .concat(ids)
        .slice(-40);

    state.last_queue = {
      generated_at:
        new Date()
          .toISOString(),
      queue_ids: ids,
      axis_counts:
        queueAxisCounts(
          built.rows
        ),
      target_level:
        built.targetLevel,
      focus_axis:
        focusAxisId || null,
      completed: false
    };

    saveRemediationState(
      state
    );

    return ids;
  }

  function openFirstQueueCard(
    ids
  ) {
    if (
      !Array.isArray(ids)
      || ids.length === 0
    ) {
      return false;
    }

    try {
      const index =
        cards.findIndex(
          function (card) {
            return (
              card.id === ids[0]
            );
          }
        );

      if (index < 0) {
        return false;
      }

      currentIndex = index;

      if (
        typeof renderCard
          === "function"
      ) {
        renderCard();
      }

      if (
        typeof renderProgress
          === "function"
      ) {
        renderProgress();
      }

      if (
        typeof setView
          === "function"
      ) {
        setView("learn");
      }

      window.setTimeout(
        refreshLearningPrompt,
        80
      );

      return true;
    } catch (_) {
      return false;
    }
  }

  function startWeightedLearning(
    focusAxisId
  ) {
    loadDiagnosticData()
      .then(
        function () {
          const built =
            buildWeightedQueue(
              focusAxisId
            );

          const ids =
            saveQueue(
              built,
              focusAxisId
            );

          if (
            !openFirstQueueCard(
              ids
            )
          ) {
            throw new Error(
              "queue navigation failed"
            );
          }
        }
      )
      .catch(
        function (error) {
          window.alert(
            text(
              "맞춤학습 큐를 만들지 못했습니다: ",
              "Could not build the tailored study queue: "
            )
            + (
              error
              && error.message
                ? error.message
                : String(error)
            )
          );
        }
      );
  }

  function goDiagnostic() {
    const button =
      document.querySelector(
        '[data-view="diagnostic"]'
      );

    if (button) {
      button.click();
    }
  }

  function markCompletedQueueIfNeeded() {
    const state =
      remediationState();

    const last =
      state.last_queue;

    if (
      !last
      || last.completed
      || !Array.isArray(
        last.queue_ids
      )
      || last.queue_ids.length
        === 0
    ) {
      return false;
    }

    const queueProgress =
      readJson(
        QUEUE_PROGRESS_KEY,
        {
          doneIds: []
        }
      );

    const done =
      new Set(
        Array.isArray(
          queueProgress.doneIds
        )
          ? queueProgress.doneIds
          : []
      );

    const complete =
      last.queue_ids.every(
        function (id) {
          return done.has(id);
        }
      );

    if (!complete) {
      return false;
    }

    last.completed = true;
    last.completed_at =
      new Date().toISOString();

    state.completed_count += 1;

    saveRemediationState(
      state
    );

    return true;
  }

  function nextLearningAction(
    currentCycle
  ) {
    const state =
      remediationState();

    const lastCompleted =
      state.last_queue
      && state.last_queue
        .completed;

    if (
      !currentCycle
      || !currentCycle.baseline
    ) {
      return {
        type: "baseline"
      };
    }

    if (
      !currentCycle.checkpoint
    ) {
      return lastCompleted
        ? {
            type:
              "checkpoint_ready"
          }
        : {
            type:
              "tailored"
          };
    }

    if (
      !currentCycle.retest
    ) {
      const last =
        state.last_queue;

      const generatedAfterCheckpoint =
        last
        && last.generated_at
        && currentCycle
          .checkpoint
          .completed_at
        && (
          new Date(
            last.generated_at
          ).getTime()
          > new Date(
            currentCycle
              .checkpoint
              .completed_at
          ).getTime()
        );

      return (
        generatedAfterCheckpoint
        && last.completed
      )
        ? {
            type:
              "retest_ready"
          }
        : {
            type:
              "tailored"
          };
    }

    return {
      type: "cycle_complete"
    };
  }

  function ensureLearningPrompt() {
    const learnView =
      document.getElementById(
        "learnView"
      );

    if (!learnView) {
      return null;
    }

    let panel =
      document.getElementById(
        "diagnosticLearningPromptV4002"
      );

    if (!panel) {
      panel =
        document.createElement(
          "section"
        );

      panel.id =
        "diagnosticLearningPromptV4002";

      panel.className =
        "diagnostic-learning-prompt-v4002";

      learnView.insertBefore(
        panel,
        learnView.firstChild
      );
    }

    return panel;
  }

  function refreshLearningPrompt() {
    markCompletedQueueIfNeeded();

    const panel =
      ensureLearningPrompt();

    if (!panel) {
      return;
    }

    const currentCycle =
      cycle();

    const action =
      nextLearningAction(
        currentCycle
      );

    if (
      action.type
        === "baseline"
    ) {
      panel.innerHTML = `
        <div>
          <strong>
            ${text(
              "내 수준부터 확인해볼까요?",
              "Check your current level first"
            )}
          </strong>
          <p>
            ${text(
              "24문항 최초 진단으로 약한 영역과 강한 영역을 먼저 찾을 수 있습니다.",
              "A 24-question baseline can identify your weaker and stronger areas."
            )}
          </p>
        </div>
        <button
          type="button"
          id="diagnosticPromptActionV4002"
        >
          ${text(
            "최초 진단",
            "Take baseline"
          )}
        </button>
      `;

      document
        .getElementById(
          "diagnosticPromptActionV4002"
        )
        .onclick =
          goDiagnostic;

      return;
    }

    if (
      action.type
        === "checkpoint_ready"
    ) {
      panel.innerHTML = `
        <div>
          <strong>
            ${text(
              "맞춤학습 10장을 완료했습니다",
              "You completed 10 tailored cards"
            )}
          </strong>
          <p>
            ${text(
              "이제 약점 영역이 개선됐는지 6~8문항 중간점검으로 확인할 때입니다.",
              "Now check whether your weak areas improved with the 6–8 question checkpoint."
            )}
          </p>
        </div>
        <button
          type="button"
          id="diagnosticPromptActionV4002"
        >
          ${text(
            "중간 점검",
            "Checkpoint"
          )}
        </button>
      `;

      document
        .getElementById(
          "diagnosticPromptActionV4002"
        )
        .onclick =
          goDiagnostic;

      return;
    }

    if (
      action.type
        === "retest_ready"
    ) {
      panel.innerHTML = `
        <div>
          <strong>
            ${text(
              "재학습도 완료했습니다",
              "You completed the follow-up study"
            )}
          </strong>
          <p>
            ${text(
              "Form B 최종 재진단으로 최초 진단 대비 향상도를 확인할 수 있습니다.",
              "Use the Form B final retest to measure improvement from your baseline."
            )}
          </p>
        </div>
        <button
          type="button"
          id="diagnosticPromptActionV4002"
        >
          ${text(
            "최종 재진단",
            "Final retest"
          )}
        </button>
      `;

      document
        .getElementById(
          "diagnosticPromptActionV4002"
        )
        .onclick =
          goDiagnostic;

      return;
    }

    if (
      action.type
        === "cycle_complete"
    ) {
      panel.innerHTML = `
        <div>
          <strong>
            ${text(
              "진단 사이클 완료",
              "Diagnostic cycle complete"
            )}
          </strong>
          <p>
            ${text(
              "최종 결과보고서에서 향상도와 남은 보완 영역을 확인할 수 있습니다.",
              "Open the final report to review improvement and remaining weak areas."
            )}
          </p>
        </div>
        <button
          type="button"
          id="diagnosticPromptActionV4002"
        >
          ${text(
            "결과보고서",
            "View report"
          )}
        </button>
      `;

      document
        .getElementById(
          "diagnosticPromptActionV4002"
        )
        .onclick =
          goDiagnostic;

      return;
    }

    panel.innerHTML = `
      <div>
        <strong>
          ${text(
            "진단 결과 기반 맞춤학습",
            "Diagnostic-based tailored study"
          )}
        </strong>
        <p>
          ${text(
            "강점은 소량 유지하고 약한 영역일수록 더 많이 포함한 10장 큐를 만듭니다.",
            "Build a 10-card queue that keeps a little strength review and gives more weight to weaker areas."
          )}
        </p>
      </div>
      <button
        type="button"
        id="diagnosticPromptActionV4002"
      >
        ${text(
          "맞춤학습 10장",
          "Tailored 10"
        )}
      </button>
    `;

    document
      .getElementById(
        "diagnosticPromptActionV4002"
      )
      .onclick =
        function () {
          startWeightedLearning(
            null
          );
        };
  }

  function reportStage(
    currentCycle
  ) {
    if (
      currentCycle
      && currentCycle.retest
    ) {
      return "retest";
    }

    if (
      currentCycle
      && currentCycle.checkpoint
    ) {
      return "checkpoint";
    }

    return "baseline";
  }

  function stageScore(
    currentCycle,
    stage
  ) {
    if (
      !currentCycle
      || !currentCycle[stage]
    ) {
      return null;
    }

    return currentCycle[
      stage
    ];
  }

  function reportSummary(
    scores
  ) {
    return AXES.map(
      function (axis) {
        const row =
          scores[axis.id];

        return {
          axis: axis,
          correct:
            Number(
              row.correct || 0
            ),
          total:
            Number(
              row.total || 0
            ),
          ratio:
            ratio(row)
        };
      }
    ).sort(
      function (a, b) {
        if (
          a.ratio !== b.ratio
        ) {
          return (
            a.ratio - b.ratio
          );
        }

        return a.axis.id
          .localeCompare(
            b.axis.id
          );
      }
    );
  }

  function bandLabel(value) {
    if (value >= 0.85) {
      return text(
        "탄탄함",
        "Strong"
      );
    }

    if (value >= 0.65) {
      return text(
        "실전 보강",
        "Practice-ready"
      );
    }

    if (value >= 0.4) {
      return text(
        "기초 보강",
        "Foundation reinforcement"
      );
    }

    return text(
      "기초 재정비",
      "Rebuild foundations"
    );
  }

  function allocationMarkup(
    allocation
  ) {
    return AXES
      .filter(
        function (axis) {
          return (
            allocation[
              axis.id
            ] > 0
          );
        }
      )
      .sort(
        function (a, b) {
          return (
            allocation[
              b.id
            ]
            - allocation[
              a.id
            ]
          );
        }
      )
      .map(
        function (axis) {
          return `
            <li>
              ${axisLabel(axis)}
              ·
              ${allocation[axis.id]}
              ${text("장", " cards")}
            </li>
          `;
        }
      )
      .join("");
  }

  function injectReport() {
    const root =
      document.getElementById(
        "diagnosticRootV4002"
      );

    const currentCycle =
      cycle();

    if (
      !root
      || !currentCycle
      || !currentCycle.baseline
    ) {
      return;
    }

    const scores =
      effectiveScores(
        currentCycle
      );

    if (!scores) {
      return;
    }

    const summary =
      reportSummary(scores);

    const weak =
      summary.filter(
        function (row) {
          return (
            row.ratio <= 0.5
          );
        }
      );

    const strong =
      summary.filter(
        function (row) {
          return (
            row.ratio >= 0.99
          );
        }
      );

    const allocation =
      buildAllocation(
        scores,
        10
      );

    const signature =
      JSON.stringify({
        stage:
          reportStage(
            currentCycle
          ),
        baseline:
          currentCycle
            .baseline
            .completed_at,
        checkpoint:
          currentCycle
            .checkpoint
            && currentCycle
              .checkpoint
              .completed_at,
        retest:
          currentCycle
            .retest
            && currentCycle
              .retest
              .completed_at
      });

    let report =
      document.getElementById(
        "diagnosticFullReportV4002"
      );

    if (
      report
      && report.dataset.signature
        === signature
    ) {
      return;
    }

    if (report) {
      report.remove();
    }

    report =
      document.createElement(
        "section"
      );

    report.id =
      "diagnosticFullReportV4002";

    report.className =
      "diagnostic-full-report-v4002";

    report.dataset.signature =
      signature;

    const fullRatio =
      overallRatio(scores);

    const baselineScore =
      stageScore(
        currentCycle,
        "baseline"
      );

    const retestScore =
      stageScore(
        currentCycle,
        "retest"
      );

    const changeText =
      retestScore
        ? (
            baselineScore.score
            + "/24 → "
            + retestScore.score
            + "/24"
            + " · "
            + text(
                "변화 ",
                "change "
              )
            + (
                retestScore.score
                - baselineScore.score
                >= 0
                  ? "+"
                  : ""
              )
            + (
                retestScore.score
                - baselineScore.score
              )
          )
        : (
            baselineScore.score
            + "/24"
          );

    report.innerHTML = `
      <div class="diagnostic-report-heading-v4002">
        <div>
          <div class="diagnostic-report-kicker-v4002">
            ${text(
              "진단 결과보고서",
              "Diagnostic report"
            )}
          </div>
          <h3>
            ${bandLabel(fullRatio)}
          </h3>
          <p>${changeText}</p>
        </div>

        <button
          type="button"
          id="diagnosticTailoredStartV4002"
        >
          ${text(
            "내 결과로 맞춤학습 10장",
            "Tailored 10 from my results"
          )}
        </button>
      </div>

      <div class="diagnostic-report-grid-v4002">
        <article>
          <strong>
            ${text(
              "우선 보완",
              "Priority areas"
            )}
          </strong>
          <ul>
            ${
              weak.length
                ? weak
                    .slice(0, 4)
                    .map(
                      function (row) {
                        return `
                          <li>
                            ${axisLabel(row.axis)}
                            ·
                            ${row.correct}/${row.total}
                          </li>
                        `;
                      }
                    )
                    .join("")
                : `
                  <li>
                    ${text(
                      "뚜렷한 취약 영역 없음",
                      "No clear priority weakness"
                    )}
                  </li>
                `
            }
          </ul>
        </article>

        <article>
          <strong>
            ${text(
              "강점",
              "Strengths"
            )}
          </strong>
          <ul>
            ${
              strong.length
                ? strong
                    .slice(0, 4)
                    .map(
                      function (row) {
                        return `
                          <li>
                            ${axisLabel(row.axis)}
                            ·
                            ${row.correct}/${row.total}
                          </li>
                        `;
                      }
                    )
                    .join("")
                : `
                  <li>
                    ${text(
                      "아직 3/3 강점 영역 없음",
                      "No 3/3 strength area yet"
                    )}
                  </li>
                `
            }
          </ul>
        </article>

        <article>
          <strong>
            ${text(
              "다음 10장 예상 비중",
              "Next 10-card mix"
            )}
          </strong>
          <ul>
            ${allocationMarkup(
              allocation
            )}
          </ul>
        </article>
      </div>

      <div class="diagnostic-focus-list-v4002">
        ${summary
          .slice(0, 4)
          .map(
            function (row) {
              return `
                <button
                  type="button"
                  class="diagnostic-focus-btn-v4002"
                  data-axis="${row.axis.id}"
                >
                  ${axisLabel(row.axis)}
                  ·
                  ${row.correct}/${row.total}
                  ·
                  ${text(
                    "집중 10장",
                    "Focus 10"
                  )}
                </button>
              `;
            }
          )
          .join("")}
      </div>
    `;

    root.appendChild(report);

    document
      .getElementById(
        "diagnosticTailoredStartV4002"
      )
      .onclick =
        function () {
          startWeightedLearning(
            null
          );
        };

    Array.from(
      report.querySelectorAll(
        ".diagnostic-focus-btn-v4002"
      )
    ).forEach(
      function (button) {
        button.onclick =
          function () {
            startWeightedLearning(
              button.dataset.axis
            );
          };
      }
    );
  }

  function observeDiagnostic() {
    const root =
      document.getElementById(
        "diagnosticRootV4002"
      );

    if (!root) {
      return;
    }

    const observer =
      new MutationObserver(
        function () {
          window.setTimeout(
            injectReport,
            20
          );
        }
      );

    observer.observe(
      root,
      {
        childList: true,
        subtree: true
      }
    );

    injectReport();
  }

  function init() {
    loadDiagnosticData()
      .catch(function () {
      })
      .finally(
        function () {
          observeDiagnostic();
          refreshLearningPrompt();

          bannerTimer =
            window.setInterval(
              refreshLearningPrompt,
              1000
            );
        }
      );

    window
      .addEventListener(
        "storage",
        function () {
          refreshLearningPrompt();
          injectReport();
        }
      );

    document
      .addEventListener(
        "click",
        function (event) {
          const target =
            event.target;

          if (!target) {
            return;
          }

          if (
            target.id
              === "studyToolsQueueDoneV72"
            || target.id
              === "studyToolsQueueNextV72"
          ) {
            window.setTimeout(
              refreshLearningPrompt,
              100
            );
          }
        }
      );

    window.PRTDiagnosticRemediationV4002 =
      Object.freeze({
        version: VERSION,
        refresh:
          refreshLearningPrompt,
        startTailored:
          function () {
            startWeightedLearning(
              null
            );
          },
        startFocus:
          function (axisId) {
            startWeightedLearning(
              axisId
            );
          }
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