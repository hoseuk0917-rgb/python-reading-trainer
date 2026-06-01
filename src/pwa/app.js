// === CACHE BUST START ===
const APP_DATA_VERSION = "20260601_v96_a2";
function withDataVersion(path) {
  if (typeof path !== "string") return path;
  if (path.indexOf("?") >= 0) return path + "&v=" + APP_DATA_VERSION;
  return path + "?v=" + APP_DATA_VERSION;
}
// === CACHE BUST END ===
let curriculum = null;
let cards = [];
let sideCards = [];
let currentIndex = 0;
let selectedChoice = null;
let activeConcept = null;

const progressKey = "python-reading-trainer-progress-v1";
const cardMemoPrefix = "python-reading-trainer-card-memo:";
const conceptMemoPrefix = "python-reading-trainer-concept-memo:";

const conceptInfo = {
  "print": {
    definition: "값을 화면에 출력하는 기본 함수다. 코드 흐름을 확인하거나 간단한 결과를 볼 때 자주 쓴다.",
    example: "name = \"LiDAR\"\nprint(name)"
  },
  "len": {
    definition: "리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(len(items))"
  },
  "variable": {
    definition: "값에 이름표를 붙여두는 방식이다. 코드 독해에서는 값이 변수 이름을 바꿔 이동하는 흐름을 따라가는 것이 중요하다.",
    example: "label = \"LiDAR\"\nname = label\nprint(name)"
  },
  "list": {
    definition: "여러 값을 순서대로 담는 자료구조다. 노드 목록, 파일 목록, 카드 목록처럼 여러 항목을 처리할 때 자주 쓴다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(items[0])"
  },
  "dict": {
    definition: "key와 value로 이루어진 자료구조다. JSON, API 응답, KG 노드 데이터는 dict처럼 읽는 경우가 많다.",
    example: "node = {\"label\": \"LiDAR\", \"kind\": \"Sensor\"}\nprint(node[\"label\"])"
  },
  "get": {
    definition: "dict에서 값을 꺼내되, key가 없을 때 기본값을 줄 수 있는 메서드다.",
    example: "row = {\"label\": \"Radar\"}\nprint(row.get(\"doc_id\", \"NO_DOC\"))"
  },
  "set": {
    definition: "중복을 허용하지 않는 자료구조다. label 중복 제거, 처리한 파일 확인 등에 자주 쓴다.",
    example: "seen = set()\nseen.add(\"lidar\")\nprint(\"lidar\" in seen)"
  },
  "for": {
    definition: "여러 항목을 하나씩 꺼내 반복 처리한다.",
    example: "items = [\"UAM\", \"ADAS\"]\nfor item in items:\n    print(item)"
  },
  "if": {
    definition: "조건이 맞을 때만 특정 코드를 실행한다.",
    example: "kind = \"Sensor\"\nif kind == \"Sensor\":\n    print(\"센서 노드\")"
  },
  "append": {
    definition: "리스트 끝에 새 값을 추가한다. 필터링 결과를 모을 때 자주 쓴다.",
    example: "selected = []\nselected.append(\"LiDAR\")\nprint(selected)"
  },
  "def": {
    definition: "함수를 정의할 때 쓴다. 반복되는 처리나 하나의 기능 단위를 이름 붙여 분리한다.",
    example: "def normalize_label(label):\n    return label.strip().lower()"
  },
  "return": {
    definition: "함수 안에서 처리한 결과를 함수 밖으로 돌려준다.",
    example: "def add_one(x):\n    return x + 1\n\nprint(add_one(3))"
  },
  "open": {
    definition: "파일을 열 때 쓴다. 실제 데이터 처리 스크립트에서 매우 자주 나온다.",
    example: "with open(\"nodes.jsonl\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "with": {
    definition: "파일이나 리소스를 안전하게 열고 닫는 구조다. with open은 파일 처리의 기본 패턴이다.",
    example: "with open(\"input.txt\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "json.loads": {
    definition: "JSON 문자열을 파이썬 dict/list로 바꾼다. JSONL을 한 줄씩 읽을 때 핵심이다.",
    example: "import json\nline = \"{\\\"label\\\": \\\"LiDAR\\\"}\"\nrow = json.loads(line)\nprint(row[\"label\"])"
  },
  "json.dumps": {
    definition: "파이썬 dict/list를 JSON 문자열로 바꾼다. JSONL 저장 시 자주 쓴다.",
    example: "import json\nrow = {\"label\": \"LiDAR\"}\nprint(json.dumps(row, ensure_ascii=False))"
  },
  "jsonl": {
    definition: "한 줄에 JSON 하나씩 저장하는 형식이다. LLM 학습 데이터, 로그, KG chunks/nodes/edges에 자주 쓰인다.",
    example: "{\"id\":\"n001\",\"label\":\"LiDAR\"}\n{\"id\":\"n002\",\"label\":\"Radar\"}"
  },
  "pathlib": {
    definition: "파일 경로를 문자열보다 안전하게 다루는 표준 라이브러리다. Windows/Linux 경로 차이를 줄이는 데 도움이 된다.",
    example: "from pathlib import Path\nfor path in Path(\"data\").glob(\"*.jsonl\"):\n    print(path.name)"
  },
  "argparse": {
    definition: "명령어 옵션을 받는 표준 라이브러리다. --input, --output 같은 배치 스크립트 옵션에 쓰인다.",
    example: "import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument(\"--input\")"
  },
  "try_except": {
    definition: "에러가 나도 프로그램이 바로 죽지 않도록 처리하는 구조다.",
    example: "try:\n    value = row[\"doc_id\"]\nexcept KeyError:\n    value = \"NO_DOC\""
  },
  "logging": {
    definition: "print보다 체계적으로 실행 기록을 남기는 방법이다. 오래 도는 배치 작업에서 중요하다.",
    example: "import logging\nlogging.info(\"start job\")"
  },
  "env": {
    definition: "API 키 같은 민감한 값을 코드에 직접 쓰지 않고 환경변수로 읽는 방식이다.",
    example: "import os\napi_key = os.environ.get(\"GOOGLE_API_KEY\")"
  },
  "api_key": {
    definition: "API를 호출할 때 사용하는 비밀 키다. 코드에 직접 넣어 GitHub에 올리면 위험하다.",
    example: "api_key = os.environ.get(\"GOOGLE_API_KEY\")"
  },
  "pipeline": {
    definition: "입력, 처리, 출력으로 이어지는 프로그램 흐름이다. 데이터 처리 스크립트는 대부분 이 구조로 읽을 수 있다.",
    example: "rows = load_jsonl(\"input.jsonl\")\nselected = filter_rows(rows)\nwrite_jsonl(selected, \"output.jsonl\")"
  },
  "main": {
    definition: "스크립트의 실행 시작점을 모아두는 함수 이름으로 자주 쓰인다.",
    example: "def main():\n    print(\"start\")\n\nif __name__ == \"__main__\":\n    main()"
  }
};

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
  const concepts = card.concepts || [];

  const pool = sideCards.filter(function(sc) {
    if (alreadyIds.includes(sc.id)) {
      return false;
    }

    const related = sc.related_concepts || [];
    const hasOverlap = related.some(function(concept) {
      return concepts.includes(concept);
    });

    const isGeneral = ["language", "cs_basic", "ai_basic", "platform_basic", "web_app_basic", "ai_architecture", "data_system", "dev_environment"].includes(sc.type);
    const seenCount = seen[sc.id] || 0;

    return seenCount < 3 && (hasOverlap || isGeneral);
  });

  pool.sort(function(a, b) {
    const ac = seen[a.id] || 0;
    const bc = seen[b.id] || 0;
    if (ac !== bc) {
      return ac - bc;
    }
    return a.id.localeCompare(b.id);
  });

  return pool.slice(0, 2);
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
}

function renderCard() {
  const card = getCurrentCard();
  selectedChoice = null;
  document.getElementById("nextBtn").classList.remove("primary-next");

  document.getElementById("levelBadge").textContent = "Level " + card.level;
  document.getElementById("progressText").textContent = (currentIndex + 1) + " / " + cards.length;
  document.getElementById("cardTitle").textContent = card.title;
  document.getElementById("readingGoal").textContent = card.reading_goal || "";
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

  renderSideCards(card);
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

  teaser.className = "mobile-side-teaser";

  const head = document.createElement("div");
  head.className = "mobile-side-teaser-head";
  head.textContent = "보너스 개념 미리보기";

  const note = document.createElement("div");
  note.className = "mobile-side-teaser-note";
  note.textContent = "아래 보조카드 영역으로 내려가기 전에 핵심 연결 개념을 먼저 보여줍니다.";

  const list = document.createElement("div");
  list.className = "mobile-side-teaser-list";

  cardsForTeaser.forEach(function(sc, idx) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "mobile-side-teaser-item";

    const label = document.createElement("span");
    label.className = "mobile-side-teaser-label";
    label.textContent = idx === 0 ? "관련" : "보너스";

    const title = document.createElement("span");
    title.className = "mobile-side-teaser-title";
    title.textContent = sc.title || sc.id || "개념 카드";

    const body = document.createElement("span");
    body.className = "mobile-side-teaser-body";
    body.textContent = sc.summary || sc.body || sc.description || "";

    item.appendChild(label);
    item.appendChild(title);
    if (body.textContent) {
      item.appendChild(body);
    }

    item.addEventListener("click", function() {
      const sideEl = document.getElementById("sideCards");
      if (sideEl) {
        sideEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    list.appendChild(item);
  });

  teaser.appendChild(head);
  teaser.appendChild(note);
  teaser.appendChild(list);
}
function renderSideCards(card) {
  const sideEl = document.getElementById("sideCards");
  sideEl.innerHTML = "";

  const directIds = card.side_card_ids || [];
  const directCards = directIds.map(getSideCardById).filter(Boolean);
  const bonusCards = getBonusSideCards(card, directIds);
  renderMobileSideTeaser(card, directCards, bonusCards);

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
      detailBtn.textContent = "자세히 보기";

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
          detailBtn.textContent = "자세히 보기";
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
    "현재 문제와 직접 연결된 보조 개념입니다."
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
      makeSideCard(sc, "연관 추천");
    });
  }

  const excludeIds = directCards.concat(bonusCards).map(function(sc) {
    return sc.id;
  });

  const randomCard = pickRandomBackgroundCard(excludeIds);

  if (randomCard) {
    makeSectionTitle(
      "랜덤 배경지식",
      "퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다."
    );

    makeSideCard(randomCard, "랜덤 상식");

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "side-random-next";
    nextBtn.textContent = "다른 배경지식";
    nextBtn.addEventListener("click", function() {
      renderSideCards(card);
    });
    sideEl.appendChild(nextBtn);
  }
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
    meta.textContent = "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;

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
    box.innerHTML = '<p class="muted">아직 저장된 메모가 없습니다.</p>';
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
    '<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">전체 카드</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">본 카드</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">맞힌 카드</div></div>' +
    '<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">헷갈린 카드</div></div>';

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
      '<div class="level-row-meta">본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused + '</div>';

    table.appendChild(div);
  });

  dash.appendChild(table);
}

async function init() {
  const curriculumRes = await fetch(withDataVersion("../../data/curriculum/curriculum_v1.json"));
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
    "../../data/lessons/python_beginner_reading_notes_v96_a2.json"
  ];

  const lessonResults = await Promise.all(lessonFiles.map(function(path) {
    return fetch(withDataVersion(path)).then(function(res) {
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
    "../../data/side_cards/python_beginner_reading_notes_side_cards_v96_a2.json"
  ];

  const sideResults = await Promise.all(sideFiles.map(function(path) {
    return fetch(withDataVersion(path)).then(function(res) {
      if (!res.ok) {
        return [];
      }
      return res.json();
    });
  }));

  curriculum = await curriculumRes.json();
  cards = lessonResults.flat();
  sideCards = sideResults.flat();

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
      box.innerHTML = '<div class="study-tools-empty">오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div>';
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
          <option value="unseen">안 본 카드</option>
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
    status.textContent = "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";
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
      alert("조건에 맞는 카드가 없습니다.");
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
      alert("조건에 맞는 카드가 없습니다.");
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
        content: " · 현재 필터 기준으로 검색/오늘 큐 생성";
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

    todayBtn.textContent = "현재 조건으로 오늘 최대 10장";

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

      help.innerHTML = "현재 조건: <b>" + levelText + "</b> · <b>" + modeText + "</b> · 오늘 큐 <b>" + queueCount + "장</b>." + warning + " 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요.";
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
      alert("현재 카드는 오늘 큐 안의 카드가 아닙니다.");
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
      alert("오늘 큐가 비어 있습니다.");
      return;
    }
    setCurrentCardByIdSafe(queueCards[0].id);
  }

  function jumpQueueNext() {
    const queueCards = getQueueCards();
    if (queueCards.length === 0) {
      alert("오늘 큐가 비어 있습니다.");
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
      alert("오늘 큐를 모두 완료했습니다.");
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

    status.textContent = "오늘 큐 " + doneCount + " / " + queueCards.length + " 완료" + (idx >= 0 ? " · 현재 " + (idx + 1) + "번째" : "");

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
      box.innerHTML = '<div class="study-tools-empty">오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div>';
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
          <option value="unseen">안 본 카드</option>
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
    status.textContent = "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";
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
      alert("조건에 맞는 카드가 없습니다.");
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
      alert("조건에 맞는 카드가 없습니다.");
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

    return "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;
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

    summary.textContent =
      "현재 " + (currentLevel === "all" ? "전체 레벨" : "L" + currentLevel) +
      " · 추천 " + (recommended === "all" ? "전체" : "L" + recommended) +
      " · " + getRecommendSummary(recommended);
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
          <button type="button" id="studyToolsRecommendStartV272">추천 진도로 오늘 10장</button>
          <button type="button" id="studyToolsRecommendApplyV272" class="secondary">추천만 적용</button>
          <button type="button" id="studyToolsToggleV272" class="secondary">설정 펼치기</button>
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
    return "추천 " + levelText + " · 남은 " + remaining + " · 큐 " + queueLen + "/10";
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
      startBtn.textContent = "추천 10장";
    }

    const applyBtn = document.getElementById("studyToolsRecommendApplyV272");
    if (applyBtn && isSmallScreen()) {
      applyBtn.textContent = "추천 적용";
    }

    const toggleBtn = document.getElementById("studyToolsToggleV272");
    if (toggleBtn && isSmallScreen()) {
      const collapsed = panel.classList.contains("study-tools-collapsed-v272");
      toggleBtn.textContent = collapsed ? "설정" : "접기";
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
