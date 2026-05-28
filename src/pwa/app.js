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

function renderSideCards(card) {
  const sideEl = document.getElementById("sideCards");
  sideEl.innerHTML = "";

  const directIds = card.side_card_ids || [];
  const directCards = directIds.map(getSideCardById).filter(Boolean);
  const bonusCards = getBonusSideCards(card, directIds);
  const displayCards = directCards.concat(bonusCards);

  displayCards.forEach(function(sc) {
    const box = document.createElement("div");
    box.className = "side-card";

    const type = document.createElement("div");
    type.className = "side-card-type";
    type.textContent = sc.type;

    const title = document.createElement("div");
    title.className = "side-card-title";
    title.textContent = sc.title;

    const body = document.createElement("div");
    body.className = "side-card-body";
    body.textContent = sc.body;

    box.appendChild(type);
    box.appendChild(title);
    box.appendChild(body);
    sideEl.appendChild(box);

    markSideSeen(sc.id);
  });
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
  const curriculumRes = await fetch("../../data/curriculum/curriculum_v1.json");
  const lessonFiles = [
    "../../data/lessons/cards_seed_v1.json",
    "../../data/lessons/python_core_expansion_v1.json",
    "../../data/lessons/python_practical_expansion_v2.json",
    "../../data/lessons/python_broad_expansion_v3.json",
    "../../data/lessons/python_deep_expansion_v4.json"
  ];

  const lessonResults = await Promise.all(lessonFiles.map(function(path) {
    return fetch(path).then(function(res) {
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
    "../../data/side_cards/dev_environment_cards_v1.json"
  ];

  const sideResults = await Promise.all(sideFiles.map(function(path) {
    return fetch(path).then(function(res) {
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


























