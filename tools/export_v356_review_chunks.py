#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
OUT_DIR = ROOT / "docs/audit/v356_review_chunks"
MANIFEST = OUT_DIR / "manifest.json"
CHUNK_SIZE = 20
EXPECTED = {3: 206, 4: 97, 5: 110, 6: 162, 7: 176, 8: 306, 9: 288, 10: 274}


def text(value) -> str:
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return str(value).replace("\r", "").strip()


def load_rows():
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if not isinstance(card, dict) or not card.get("id"):
                continue
            raw_level = str(card.get("level", ""))
            if not raw_level.isdigit():
                continue
            level = int(raw_level)
            if level not in EXPECTED:
                continue
            rows.append((level, path.name, card))
    rows.sort(key=lambda item: (item[0], item[1], str(item[2]["id"])))
    return rows


def render_card(level: int, filename: str, card: dict) -> str:
    lines = [
        f"## {text(card.get('id'))}",
        f"- level: {level}",
        f"- file: {filename}",
        f"- title: {text(card.get('title'))}",
        f"- question_type: {text(card.get('question_type'))}",
        f"- concepts: {text(card.get('concepts'))}",
        f"- reading_goal: {text(card.get('reading_goal'))}",
        "- code:",
        "```python",
        text(card.get("code")),
        "```",
        f"- question: {text(card.get('question'))}",
        f"- answer: {text(card.get('answer'))}",
        f"- explanation: {text(card.get('explanation'))}",
        f"- project_context: {text(card.get('project_context'))}",
        "",
    ]
    return "\n".join(lines)


def main():
    rows = load_rows()
    counts = Counter(level for level, _, _ in rows)
    if dict(sorted(counts.items())) != EXPECTED:
        raise SystemExit(f"V356_CHUNK_COUNT_MISMATCH expected={EXPECTED} actual={dict(sorted(counts.items()))}")

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest = {"version": "v356", "chunk_size": CHUNK_SIZE, "levels": {}}
    for level in sorted(EXPECTED):
        level_rows = [row for row in rows if row[0] == level]
        chunk_files = []
        for start in range(0, len(level_rows), CHUNK_SIZE):
            chunk = level_rows[start:start + CHUNK_SIZE]
            index = start // CHUNK_SIZE + 1
            name = f"level{level}_{index:02d}.md"
            path = OUT_DIR / name
            body = [
                f"# V356 semantic review — Level {level} chunk {index}",
                "",
                f"Cards {start + 1}-{start + len(chunk)} of {len(level_rows)}.",
                "Review each card as title → reading goal → code → question → answer → explanation → project context.",
                "",
            ]
            for _, filename, card in chunk:
                body.append(render_card(level, filename, card))
            path.write_text("\n".join(body).rstrip() + "\n", encoding="utf-8")
            chunk_files.append({
                "file": name,
                "start": start + 1,
                "end": start + len(chunk),
                "count": len(chunk),
                "ids": [str(card["id"]) for _, _, card in chunk],
            })
        manifest["levels"][str(level)] = {
            "count": len(level_rows),
            "chunks": chunk_files,
        }

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("V356_REVIEW_CHUNK_COUNTS=" + ",".join(f"{level}:{counts[level]}" for level in sorted(EXPECTED)))
    print(f"V356_REVIEW_CHUNKS={sum(len(v['chunks']) for v in manifest['levels'].values())}")
    print(f"V356_REVIEW_CHUNK_ROWS={len(rows)}")
    print("RESULT=PASS_V356_REVIEW_CHUNK_EXPORT")


if __name__ == "__main__":
    main()
