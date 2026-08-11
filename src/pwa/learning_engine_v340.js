(function(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.LearningEngineV340 = api;
})(typeof window !== "undefined" ? window : globalThis, function() {
  "use strict";

  const VERSION = "v340_a1";
  const DAY = 24 * 60 * 60 * 1000;
  const REVIEW_INTERVALS = [DAY, 3 * DAY, 7 * DAY, 14 * DAY];

  const SYNTAX_RULES = [
    { pattern: /\bjson\.loads\b/g, concept: "json.loads", label: "json.loads" },
    { pattern: /\bjson\.dumps\b/g, concept: "json.dumps", label: "json.dumps" },
    { pattern: /\bprint\b/g, concept: "print", label: "print" },
    { pattern: /\blen\b/g, concept: "len", label: "len" },
    { pattern: /\brange\b/g, concept: "range", label: "range" },
    { pattern: /\bappend\b/g, concept: "append", label: "append" },
    { pattern: /\bget\b/g, concept: "get", label: "get" },
    { pattern: /\bopen\b/g, concept: "open", label: "open" },
    { pattern: /\bwith\b/g, concept: "with", label: "with" },
    { pattern: /\bdef\b/g, concept: "def", label: "def" },
    { pattern: /\breturn\b/g, concept: "return", label: "return" },
    { pattern: /\bfor\b/g, concept: "for", label: "for" },
    { pattern: /\bwhile\b/g, concept: "while", label: "while" },
    { pattern: /\bif\b/g, concept: "if", label: "if" },
    { pattern: /\belif\b/g, concept: "if", label: "elif" },
    { pattern: /\belse\b/g, concept: "if", label: "else" },
    { pattern: /\bclass\b/g, concept: "class", label: "class" },
    { pattern: /\bimport\b/g, concept: "import", label: "import" },
    { pattern: /\btry\b/g, concept: "try_except", label: "try" },
    { pattern: /\bexcept\b/g, concept: "try_except", label: "except" },
    { pattern: /\bTrue\b/g, concept: "bool", label: "True" },
    { pattern: /\bFalse\b/g, concept: "bool", label: "False" },
    { pattern: /\bNone\b/g, concept: "None", label: "None" }
  ];

  function listConcepts(card) {
    return Array.isArray(card && card.concepts) ? card.concepts.filter(Boolean) : [];
  }

  function firstUnseenIndex(cards, progress) {
    const seen = progress && progress.seen ? progress.seen : {};
    for (let i = 0; i < cards.length; i += 1) {
      if (!seen[cards[i].id]) return i;
    }
    return cards.length;
  }

  function conceptFirstIndex(cards) {
    const out = Object.create(null);
    cards.forEach(function(card, index) {
      listConcepts(card).forEach(function(concept) {
        if (out[concept] === undefined) out[concept] = index;
      });
    });
    return out;
  }

  function allowedConceptsAt(cards, index) {
    const out = new Set();
    const end = Math.min(Math.max(index, 0), Math.max(cards.length - 1, 0));
    for (let i = 0; i <= end; i += 1) {
      listConcepts(cards[i]).forEach(function(concept) { out.add(concept); });
    }
    return out;
  }

  function dueReviewIds(reviewState, now) {
    const when = Number(now == null ? Date.now() : now);
    return Object.keys(reviewState || {}).filter(function(cardId) {
      const row = reviewState[cardId] || {};
      return !row.mastered && Number(row.dueAt || 0) <= when;
    }).sort(function(a, b) {
      return Number(reviewState[a].dueAt || 0) - Number(reviewState[b].dueAt || 0) || a.localeCompare(b);
    });
  }

  function buildSequentialSession(cards, progress, reviewState, options) {
    const opts = options || {};
    const size = Math.max(1, Number(opts.size || 10));
    const reviewSlots = Math.max(0, Math.min(size, Number(opts.reviewSlots == null ? 3 : opts.reviewSlots)));
    const now = Number(opts.now == null ? Date.now() : opts.now);
    const nextIndex = firstUnseenIndex(cards, progress || {});
    const byId = new Map(cards.map(function(card, index) { return [card.id, { card: card, index: index }]; }));
    const due = dueReviewIds(reviewState || {}, now).filter(function(id) {
      const hit = byId.get(id);
      return hit && progress && progress.seen && progress.seen[id];
    });

    const items = [];
    due.slice(0, reviewSlots).forEach(function(id) {
      const hit = byId.get(id);
      items.push({ type: "review", cardId: id, index: hit.index });
    });

    let i = nextIndex;
    while (items.length < size && i < cards.length) {
      items.push({ type: "new", cardId: cards[i].id, index: i });
      i += 1;
    }

    if (items.length < size) {
      due.slice(reviewSlots).forEach(function(id) {
        if (items.length >= size) return;
        const hit = byId.get(id);
        if (!items.some(function(item) { return item.cardId === id && item.type === "review"; })) {
          items.push({ type: "review", cardId: id, index: hit.index });
        }
      });
    }

    return { nextIndex: nextIndex, items: items, dueReviewCount: due.length };
  }

  function simpleHash(text) {
    let h = 2166136261;
    const value = String(text || "");
    for (let i = 0; i < value.length; i += 1) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededOrder(items, seed) {
    return items.map(function(value, index) {
      return { value: value, score: simpleHash(String(seed) + "|" + index + "|" + String(value)) };
    }).sort(function(a, b) { return a.score - b.score; }).map(function(row) { return row.value; });
  }

  function firstSentence(text) {
    const value = String(text || "").replace(/\s+/g, " ").trim();
    if (!value) return "";
    const match = value.match(/^.*?[.!?。]|^.{1,120}(?:\s|$)/);
    return (match ? match[0] : value.slice(0, 120)).trim();
  }

  function pickPrimaryConcept(card, conceptInfo) {
    const concepts = listConcepts(card);
    return concepts.find(function(concept) {
      return conceptInfo && conceptInfo[concept] && conceptInfo[concept].definition;
    }) || concepts[0] || "";
  }

  function pickSafeExample(card, cards, index, conceptInfo) {
    const allowed = allowedConceptsAt(cards, index);
    const candidates = [];
    listConcepts(card).forEach(function(concept) {
      const info = conceptInfo && conceptInfo[concept];
      if (info && info.example) candidates.push({ concept: concept, code: info.example, source: "current" });
    });

    for (let i = index - 1; i >= 0 && candidates.length < 12; i -= 1) {
      listConcepts(cards[i]).forEach(function(concept) {
        const info = conceptInfo && conceptInfo[concept];
        if (info && info.example && !candidates.some(function(row) { return row.concept === concept; })) {
          candidates.push({ concept: concept, code: info.example, source: "previous" });
        }
      });
    }

    const safe = candidates.find(function(candidate) {
      return exampleUsesOnlyKnownNamedSyntax(candidate.code, allowed);
    });
    if (safe) return safe;

    return {
      concept: pickPrimaryConcept(card, conceptInfo),
      code: String(card && card.code || ""),
      source: "current-card"
    };
  }

  function exampleUsesOnlyKnownNamedSyntax(code, allowedConcepts) {
    const text = String(code || "");
    return SYNTAX_RULES.every(function(rule) {
      rule.pattern.lastIndex = 0;
      const found = rule.pattern.test(text);
      rule.pattern.lastIndex = 0;
      return !found || allowedConcepts.has(rule.concept) || rule.concept === "bool" || rule.concept === "None";
    });
  }

  function syntaxHits(code, allowedConcepts) {
    const text = String(code || "");
    const hits = [];
    SYNTAX_RULES.forEach(function(rule) {
      if (!(allowedConcepts.has(rule.concept) || rule.concept === "bool" || rule.concept === "None")) return;
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(text))) {
        hits.push({ start: match.index, end: match.index + match[0].length, concept: rule.concept, label: match[0] });
        if (match[0].length === 0) rule.pattern.lastIndex += 1;
      }
      rule.pattern.lastIndex = 0;
    });
    return hits.sort(function(a, b) { return a.start - b.start || (b.end - b.start) - (a.end - a.start); })
      .filter(function(hit, index, all) {
        return !all.slice(0, index).some(function(prev) { return hit.start < prev.end && hit.end > prev.start; });
      });
  }

  function makeReviewVariant(card, cards, index, conceptInfo, reviewRow) {
    const primary = pickPrimaryConcept(card, conceptInfo);
    const allowed = Array.from(allowedConceptsAt(cards, index)).filter(function(concept) {
      return concept !== primary && conceptInfo && conceptInfo[concept] && conceptInfo[concept].definition;
    });
    const stage = Number(reviewRow && reviewRow.stage || 0);
    const seed = String(card && card.id || "") + ":" + stage + ":" + Number(reviewRow && reviewRow.lapses || 0);
    const primaryInfo = conceptInfo && conceptInfo[primary];
    const correctDefinition = firstSentence(primaryInfo && primaryInfo.definition);

    if (correctDefinition && allowed.length >= 3) {
      const distractors = seededOrder(allowed, seed).slice(0, 3).map(function(concept) {
        return firstSentence(conceptInfo[concept].definition);
      }).filter(Boolean);
      const choices = seededOrder([correctDefinition].concat(distractors), seed + ":choices");
      return {
        type: "definition_pick",
        primaryConcept: primary,
        question: "다음 설명 중 이 코드의 핵심 개념을 가장 정확히 설명한 것은?",
        choices: choices,
        answer: correctDefinition
      };
    }

    const conceptChoices = seededOrder([primary].concat(allowed.slice(0, 3)), seed + ":concepts");
    return {
      type: "concept_pick",
      primaryConcept: primary,
      question: "이 코드를 읽을 때 가장 먼저 떠올려야 할 핵심 개념은?",
      choices: conceptChoices,
      answer: primary
    };
  }

  function scheduleWrong(reviewState, cardId, now) {
    const state = Object.assign({}, reviewState || {});
    const previous = state[cardId] || {};
    state[cardId] = {
      stage: 0,
      dueAt: Number(now == null ? Date.now() : now),
      lapses: Number(previous.lapses || 0) + 1,
      mastered: false,
      lastResult: "wrong"
    };
    return state;
  }

  function scheduleReviewResult(reviewState, cardId, correct, now) {
    const state = Object.assign({}, reviewState || {});
    const previous = state[cardId] || { stage: 0, lapses: 0 };
    const when = Number(now == null ? Date.now() : now);
    if (!correct) {
      state[cardId] = {
        stage: 0,
        dueAt: when + 10 * 60 * 1000,
        lapses: Number(previous.lapses || 0) + 1,
        mastered: false,
        lastResult: "wrong-review"
      };
      return state;
    }

    const nextStage = Number(previous.stage || 0) + 1;
    const interval = REVIEW_INTERVALS[Math.min(nextStage - 1, REVIEW_INTERVALS.length - 1)];
    state[cardId] = {
      stage: nextStage,
      dueAt: when + interval,
      lapses: Number(previous.lapses || 0),
      mastered: nextStage >= REVIEW_INTERVALS.length,
      lastResult: "correct-review"
    };
    return state;
  }

  return {
    VERSION: VERSION,
    REVIEW_INTERVALS: REVIEW_INTERVALS.slice(),
    firstUnseenIndex: firstUnseenIndex,
    conceptFirstIndex: conceptFirstIndex,
    allowedConceptsAt: allowedConceptsAt,
    dueReviewIds: dueReviewIds,
    buildSequentialSession: buildSequentialSession,
    pickPrimaryConcept: pickPrimaryConcept,
    pickSafeExample: pickSafeExample,
    exampleUsesOnlyKnownNamedSyntax: exampleUsesOnlyKnownNamedSyntax,
    syntaxHits: syntaxHits,
    makeReviewVariant: makeReviewVariant,
    scheduleWrong: scheduleWrong,
    scheduleReviewResult: scheduleReviewResult,
    firstSentence: firstSentence
  };
});
