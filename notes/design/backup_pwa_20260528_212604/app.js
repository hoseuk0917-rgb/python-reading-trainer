let cards = [];
let sideCards = [];
let currentIndex = 0;
let selectedChoice = null;

const progressKey = "python-reading-trainer-progress-v1";

function loadProgress() {
  const raw = localStorage.getItem(progressKey);
  if (!raw) {
    return { seen: {}, correct: {}, confused: {} };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { seen: {}, correct: {}, confused: {} };
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

function renderCard() {
  const card = cards[currentIndex];
  selectedChoice = null;

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

  const sideEl = document.getElementById("sideCards");
  sideEl.innerHTML = "";

  const ids = card.side_card_ids || [];
  ids.forEach(function(id) {
    const sc = getSideCardById(id);
    if (!sc) {
      return;
    }

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
  });

  markSeen(card.id);
}

function markSeen(cardId) {
  const progress = loadProgress();
  progress.seen[cardId] = (progress.seen[cardId] || 0) + 1;
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
  const card = cards[currentIndex];
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
  const card = cards[currentIndex];
  markConfused(card.id);
  nextCard();
}

function markKnowAndNext() {
  const card = cards[currentIndex];
  markCorrect(card.id);
  nextCard();
}

function resetProgress() {
  localStorage.removeItem(progressKey);
  alert("진도를 초기화했습니다.");
  renderCard();
}

async function init() {
  const cardsRes = await fetch("../../data/lessons/cards_seed_v1.json");
  const sideRes = await fetch("../../data/side_cards/side_cards_seed_v1.json");

  cards = await cardsRes.json();
  sideCards = await sideRes.json();

  cards.sort(function(a, b) {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.id.localeCompare(b.id);
  });

  document.getElementById("nextBtn").onclick = nextCard;
  document.getElementById("prevBtn").onclick = prevCard;
  document.getElementById("againBtn").onclick = jumpToConfusedOrNext;
  document.getElementById("knowBtn").onclick = markKnowAndNext;
  document.getElementById("resetBtn").onclick = resetProgress;

  renderCard();
}

init().catch(function(err) {
  document.getElementById("cardTitle").textContent = "데이터 로딩 실패";
  document.getElementById("readingGoal").textContent = String(err);
});
