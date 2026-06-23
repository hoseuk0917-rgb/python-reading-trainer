const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

let text = fs.readFileSync(APP, "utf8");

const oldFnRe = /function applyKnownPhraseReplacementsV334A10B\(value\) \{[\s\S]*?\n\}/;

const newFn = `function applyKnownPhraseReplacementsV334A10B(value) {
  if (typeof value !== "string" || !/[가-힣]/.test(value)) {
    return value;
  }

  const exact = new Map(Object.entries({
    "자세히 보기": "View details",
    "랜덤 배경지식": "Random background knowledge",
    "퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다.": "Useful AI and development background knowledge, even when it is not directly linked to one quiz.",
    "랜덤 상식": "Random tip",
    "다른 배경지식": "More background knowledge",
    "더 읽어보기": "Further reading",
    "외부 자료": "External resource",
    "외부 자료 · A · en": "External resource · A · en",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "Today's queue가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "Today's queue가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "현재 조건: Lv.1 · 복습 우선 · 오늘 큐 0장. 10장을 원하면 레벨을 전체 레벨로 바꾸세요.": "Current filters: Lv.1 · Review first · Today's queue 0 cards. To create 10 cards, switch the level to All levels.",
    "Current filters: Lv.1 · Review first · Today's queue 0장. 10장을 원하면 레벨을 All levels로 바꾸세요.": "Current filters: Lv.1 · Review first · Today's queue 0 cards. To create 10 cards, switch the level to All levels."
  }));

  const trimmed = value.replace(/\\s+/g, " ").trim();
  if (exact.has(trimmed)) {
    return value.replace(trimmed, exact.get(trimmed));
  }

  let next = value;

  next = next.replace(
    /현재 조건: (.+?) · 복습 우선 · 오늘 큐 (\\d+)장\\. 10장을 원하면 레벨을 전체 레벨로 바꾸세요\\./g,
    "Current filters: $1 · Review first · Today's queue $2 cards. To create 10 cards, switch the level to All levels."
  );

  next = next.replace(
    /Current filters: (.+?) · Review first · Today's queue (\\d+)장\\. 10장을 원하면 레벨을 All levels로 바꾸세요\\./g,
    "Current filters: $1 · Review first · Today's queue $2 cards. To create 10 cards, switch the level to All levels."
  );

  next = next.replace(
    /오늘 큐가 비어 있습니다\\. 조건을 바꾸거나 오늘 10장 만들기를 눌러\\s*보세요\\./g,
    "Today's queue is empty. Change filters or press Today 10."
  );

  next = next.replace(
    /Today's queue가 비어 있습니다\\. 조건을 바꾸거나 오늘 10장 만들기를 눌러\\s*보세요\\./g,
    "Today's queue is empty. Change filters or press Today 10."
  );

  next = next.replace(/(\\d+)장을 원하면/g, "To create $1 cards,");
  next = next.replace(/(\\d+)장/g, "$1 cards");

  const phrases = [
    ["학습 도구", "Study tools"],
    ["현재 필터 기준으로 검색/오늘 큐 생성", "Search and build today's queue from current filters"],
    ["현재 조건", "Current filters"],
    ["복습 우선", "Review first"],
    ["오늘 큐", "Today's queue"],
    ["큐", "queue"],
    ["남은", "remaining"],
    ["안 본", "unseen"],
    ["모르겠음", "not sure"],
    ["맞힘", "correct"],
    ["본 카드", "seen cards"],
    ["전체", "all"],
    ["조건 일치", "Matches"],
    ["조건을 바꾸거나", "Change filters or"],
    ["오늘 10장 만들기", "press Today 10"],
    ["눌러보세요", ""],
    ["눌러 보세요", ""],
    ["레벨을 전체 레벨로 바꾸세요.", "switch the level to All levels."],
    ["레벨을 All levels로 바꾸세요.", "switch the level to All levels."],
    ["자세히 보기", "View details"],
    ["랜덤 배경지식", "Random background knowledge"],
    ["랜덤 상식", "Random tip"],
    ["다른 배경지식", "More background knowledge"],
    ["더 읽어보기", "Further reading"],
    ["외부 자료", "External resource"]
  ];

  phrases.forEach(function(pair) {
    next = next.split(pair[0]).join(pair[1]);
  });

  next = next.replace(/Today's queue가/g, "Today's queue is");
  next = next.replace(/queue가/g, "queue is");
  next = next.replace(/\\s+\\./g, ".");
  next = next.replace(/\\s{2,}/g, " ").trim();

  return next;
}`;

if (!oldFnRe.test(text)) {
  throw new Error("applyKnownPhraseReplacementsV334A10B function not found");
}

text = text.replace(oldFnRe, newFn);

fs.writeFileSync(APP, text, "utf8");

for (const file of [ROOT_INDEX, INDEX, APP]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replaceAll("20260622_v334_a10b", "20260622_v334_a10c");
  value = value.replaceAll("20260622_v334_a10", "20260622_v334_a10c");
  value = value.replaceAll("20260622_v334_a9", "20260622_v334_a10c");
  fs.writeFileSync(file, value, "utf8");
}

console.log("V334_A10C_RESIDUAL_MIXED_KOREAN_UI_PATCHED");
console.log("version=20260622_v334_a10c");
