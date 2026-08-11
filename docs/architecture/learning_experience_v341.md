# Learning Experience V341

## Goal

Improve motivation and real developer thinking without turning Python Reading Trainer into an XP/badge game.

## Fixed product decisions

- New lesson cards keep the existing fixed sequential order.
- Checkpoint interval: every 30 attempted lesson cards.
- Practical developer learning lives in a separate `실전` / `Practice` tab.
- Practice modules unlock from actual sequential-learning progress.
- No badges, XP, coins, rank, streak-loss pressure, loot, or artificial scarcity.
- Achievement feedback must describe evidence: what the learner has actually demonstrated.
- Missing a day never destroys progress.

## Learning layers

### 1. Core sequential learning

Owned by V340. V341 must not reorder unseen lesson cards.

### 2. Concept mastery map

Concept states are evidence-oriented:

1. 미학습 / Not started
2. 처음 봄 / Introduced
3. 이해함 / Understood
4. 변형 성공 / Variant passed
5. 간격 복습 중 / Spaced review
6. 정착 / Consolidated

The map is derived from existing lesson attempts and variant-review state. It is not a score and does not award points.

### 3. Checkpoint missions

A checkpoint becomes available every 30 attempted cards. Missions rotate through real developer reasoning instead of repeating the original multiple-choice question:

- bug hunt
- change procedure
- unit / integration / smoke test distinction
- regression test selection
- idempotence / safe rerun
- diff / PR review
- CI quality gate
- reproducibility / pinned inputs
- baseline / before-after comparison
- rollback / safe release

Checkpoint completion is recorded, but there is no badge.

### 4. Practice tab

Developer-practice modules unlock gradually from current lesson progress. Initial unlock thresholds:

- 30: safe change procedure
- 60: regression testing
- 90: idempotence and rerun safety
- 120: test layers (unit/integration/smoke)
- 150: Git branch, diff and PR review
- 180: CI quality gates
- 240: reproducibility and pinned inputs
- 300: baseline comparison and rollback

Locked modules show the concrete lesson-card threshold, not a vague level.

### 5. Weekly progress

Default weekly target:

- 50 attempted lesson cards
- 5 study days

Show progress such as `이번 주 32/50 · 3/5일`. No streak reset and no penalty for a missed day.

### 6. Small completion feedback

Use a short, quiet toast for events such as:

- checkpoint unlocked
- checkpoint mission passed
- concept reached a stronger evidence state
- weekly target completed

No confetti requirement, sound, random reward, badge, XP, or streak pressure.

## Side-card quality gate

V341 adds an educational-quality audit on top of V339 semantic alignment. The gate checks both KO and EN side cards for:

- non-empty learner-facing explanation
- beginner first-sentence density
- body/detail exact or near duplication
- duplicate bodies across cards
- leftover authoring/meta boilerplate
- excessive jargon in a beginner opening
- direct-link semantic relevance
- beginner body/detail length limits

Warnings are reported separately from hard errors so a card is not automatically rewritten merely to satisfy a crude text heuristic. High-risk cards are reviewed and curated rather than padded with generic prose.

## Regression requirements

Before main integration:

- existing lesson validator passes (1785 lessons / 440 side cards per language baseline)
- V339 content quality gates pass
- V340 learning-loop audit passes
- V341 pure-engine audit passes
- desktop real-browser smoke passes
- 390 px real-browser smoke passes
- no duplicate practice view/modal/summary elements
- no horizontal overflow
- fixed new-card sequence remains unchanged
- reset clears V340 + V341 learning state but keeps user notes
- all V341 integration patchers are idempotent
- final zero-change rerun produces no tracked diff

## Release rule

`main` remains untouched until the feature branch is ahead of main, behind by zero, all gates pass, and the final integration rerun is clean. Pages must build the exact final main SHA.
