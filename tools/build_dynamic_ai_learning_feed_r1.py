from __future__ import annotations

import argparse
import email.utils
import hashlib
import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY = ROOT / "data" / "dynamic_feed" / "source_registry_r1.json"
DEFAULT_ARCHIVE = ROOT / "data" / "dynamic_feed" / "items_r1.jsonl"
DEFAULT_RUNTIME = ROOT / "data" / "runtime" / "dynamic_ai_learning_feed_r1.json"

REGISTRY_SCHEMA = "python-reading-trainer/dynamic-ai-source-registry-v1"
RUNTIME_SCHEMA = "python-reading-trainer/dynamic-ai-learning-feed-v1"

WEIGHTED_TERMS = {
    "gpt": 4,
    "claude": 4,
    "gemini": 4,
    "model": 3,
    "agent": 3,
    "copilot": 3,
    "api": 3,
    "sdk": 3,
    "reasoning": 3,
    "multimodal": 3,
    "inference": 3,
    "fine-tun": 3,
    "embedding": 3,
    "rag": 3,
    "mcp": 3,
    "transformer": 3,
    "pytorch": 3,
    "hugging face": 3,
    "quantization": 3,
    "llm": 3,
    "tool use": 3,
    "open source": 2,
    "benchmark": 2,
    "eval": 2,
    "coding": 2,
    "developer": 2,
    "python": 2,
    "github": 2,
    "git": 2,
    "training": 2,
}

NEGATIVE_TERMS = {
    "hiring": -3,
    "job opening": -3,
    "acquisition": -3,
    "acquire": -3,
    "office": -2,
    "award": -2,
    "roadshow": -2,
    "government affairs": -2,
    "partnership": -1,
    "policy": -1,
}

AI_SIGNAL_TERMS = (
    "ai",
    "artificial intelligence",
    "chatgpt",
    "gpt",
    "claude",
    "gemini",
    "llm",
    "language model",
    "model",
    "agent",
    "copilot",
    "reasoning",
    "multimodal",
    "inference",
    "embedding",
    "rag",
    "mcp",
    "transformer",
    "pytorch",
    "quantization",
)

LEARNING_SIGNAL_TERMS = (
    "api",
    "sdk",
    "developer",
    "coding",
    "python",
    "agent",
    "tool use",
    "reasoning",
    "multimodal",
    "inference",
    "training",
    "fine-tun",
    "embedding",
    "rag",
    "mcp",
    "transformer",
    "pytorch",
    "quantization",
    "benchmark",
    "eval",
    "open source",
    "open-source",
    "weights",
    "architecture",
    "research",
)

LOW_VALUE_CONTEXT_TERMS = (
    "veteran",
    "servicemember",
    "caregiver",
    "carplay",
    "pixel drop",
    "seat management",
    "billing",
    "travel",
    "office",
    "hiring",
)

TOPIC_RULES = (
    ("model_release", ("gpt", "claude", "gemini", "model")),
    ("agent_tooling", ("agent", "copilot", "mcp", "tool use")),
    ("api_sdk", ("api", "sdk", "endpoint")),
    ("training_inference", ("training", "fine-tun", "inference", "pytorch", "transformer")),
    ("retrieval_data", ("rag", "embedding", "vector", "retrieval")),
    ("eval_benchmark", ("eval", "benchmark")),
    ("developer_tooling", ("coding", "developer", "github", "git", "python")),
)

CONCEPTS_BY_TOPIC = {
    "model_release": ("call", "argument_passing", "subscription"),
    "agent_tooling": ("call", "argument_passing", "conditional_expression", "assignment"),
    "api_sdk": ("call", "argument_passing", "assignment", "subscription", "except_clause"),
    "training_inference": ("call", "argument_passing", "assignment", "with_statement"),
    "retrieval_data": ("call", "subscription", "assignment", "list_comprehension"),
    "eval_benchmark": ("comparison", "call", "subscription"),
    "developer_tooling": ("call", "if_statement", "assignment", "except_clause"),
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def clean_text(value: str | None, limit: int = 1200) -> str:
    text = html.unescape(value or "")
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        return text[: limit - 1].rstrip() + "…"
    return text


def canonical_url(url: str, base: str = "") -> str:
    absolute = urllib.parse.urljoin(base, (url or "").strip())
    parts = urllib.parse.urlsplit(absolute)
    kept = []
    for key, value in urllib.parse.parse_qsl(parts.query, keep_blank_values=True):
        low = key.lower()
        if low.startswith("utm_") or low in {"ref", "source", "campaign"}:
            continue
        kept.append((key, value))
    query = urllib.parse.urlencode(kept, doseq=True)
    return urllib.parse.urlunsplit(
        (parts.scheme.lower(), parts.netloc.lower(), parts.path or "/", query, "")
    )


def parse_date(value: str | None) -> str | None:
    raw = (value or "").strip()
    if not raw:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(raw)
        if dt:
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    except ValueError:
        return None


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def child_text(node: ET.Element, *names: str) -> str:
    wanted = set(names)
    for child in list(node):
        if local_name(child.tag) in wanted and child.text:
            return child.text
    return ""


def entry_link(node: ET.Element) -> str:
    fallback = ""
    for child in list(node):
        if local_name(child.tag) != "link":
            continue
        href = (child.attrib.get("href") or "").strip()
        if href:
            if (child.attrib.get("rel") or "alternate") == "alternate":
                return href
            if not fallback:
                fallback = href
        elif child.text and not fallback:
            fallback = child.text
    return fallback


def parse_feed(xml_bytes: bytes, source_url: str) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    rows = []

    for item in root.iter():
        if local_name(item.tag) != "item":
            continue
        title = clean_text(child_text(item, "title"))
        link = canonical_url(child_text(item, "link"), source_url)
        published = parse_date(child_text(item, "pubDate", "date", "published", "updated"))
        summary = clean_text(child_text(item, "description", "summary", "content", "encoded"))
        if title and link:
            rows.append(
                {
                    "title": title,
                    "url": link,
                    "published_at": published,
                    "summary": summary,
                }
            )

    if rows:
        return rows

    for entry in root.iter():
        if local_name(entry.tag) != "entry":
            continue
        title = clean_text(child_text(entry, "title"))
        link = canonical_url(entry_link(entry), source_url)
        published = parse_date(child_text(entry, "published", "updated"))
        summary = clean_text(child_text(entry, "summary", "content"))
        if title and link:
            rows.append(
                {
                    "title": title,
                    "url": link,
                    "published_at": published,
                    "summary": summary,
                }
            )
    return rows


def classify(text: str, base_score: int, threshold: int) -> dict:
    lowered = text.lower()
    score = int(base_score)
    matched_terms = []
    negative_terms = []

    for term, weight in WEIGHTED_TERMS.items():
        if term in lowered:
            score += weight
            matched_terms.append(term)

    for term, weight in NEGATIVE_TERMS.items():
        if term in lowered:
            score += weight
            negative_terms.append(term)

    ai_signals = [term for term in AI_SIGNAL_TERMS if term in lowered]
    learning_signals = [term for term in LEARNING_SIGNAL_TERMS if term in lowered]
    low_value_signals = [term for term in LOW_VALUE_CONTEXT_TERMS if term in lowered]

    if low_value_signals and not any(
        term in lowered
        for term in (
            "api",
            "sdk",
            "developer",
            "research",
            "benchmark",
            "training",
            "inference",
            "architecture",
            "open source",
            "open-source",
        )
    ):
        score -= 3

    topics = []
    for topic, terms in TOPIC_RULES:
        if any(term in lowered for term in terms):
            topics.append(topic)

    linked_concepts = []
    for topic in topics:
        for concept in CONCEPTS_BY_TOPIC.get(topic, ()):
            if concept not in linked_concepts:
                linked_concepts.append(concept)

    is_candidate = (
        score >= threshold
        and bool(linked_concepts)
        and bool(ai_signals)
        and bool(learning_signals)
    )
    status = "CANDIDATE" if is_candidate else "WATCH_ONLY"
    return {
        "score": max(0, score),
        "status": status,
        "matched_terms": matched_terms[:12],
        "negative_terms": negative_terms[:8],
        "ai_signals": ai_signals[:10],
        "learning_signals": learning_signals[:10],
        "low_value_signals": low_value_signals[:8],
        "topics": topics,
        "linked_concepts": linked_concepts[:8],
    }


def stable_id(source_id: str, url: str, title: str, published_at: str | None) -> str:
    basis = url or f"{source_id}|{title}|{published_at or ''}"
    digest = hashlib.sha256(basis.encode("utf-8")).hexdigest()[:16].upper()
    return f"AIFR1_{digest}"


def load_registry(path: Path) -> dict:
    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    if payload.get("schema") != REGISTRY_SCHEMA:
        raise SystemExit(f"unexpected registry schema: {payload.get('schema')}")
    sources = payload.get("sources")
    if not isinstance(sources, list) or not sources:
        raise SystemExit("registry sources must be a non-empty list")

    seen_ids = set()
    seen_urls = set()
    for source in sources:
        sid = source.get("id")
        url = source.get("url")
        if not isinstance(sid, str) or not sid:
            raise SystemExit("source id missing")
        if sid in seen_ids:
            raise SystemExit(f"duplicate source id: {sid}")
        seen_ids.add(sid)
        if not isinstance(url, str) or not url.startswith("https://"):
            raise SystemExit(f"source must use https: {sid}")
        if url in seen_urls:
            raise SystemExit(f"duplicate source url: {url}")
        seen_urls.add(url)
        if source.get("format") != "rss":
            raise SystemExit(f"unsupported source format: {sid}")
        if source.get("authority") != "official":
            raise SystemExit(f"R1 only allows official sources: {sid}")
        if not isinstance(source.get("base_score"), int):
            raise SystemExit(f"base_score must be int: {sid}")

    return payload


def fetch_bytes(url: str, timeout: int) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "python-reading-trainer-dynamic-feed-r1/1.0 "
                "(+https://github.com/hoseuk0917-rgb/python-reading-trainer)"
            )
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def read_archive(path: Path) -> tuple[list[dict], set[str]]:
    if not path.is_file():
        return [], set()

    rows = []
    ids = set()
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        row = json.loads(line)
        item_id = row.get("id")
        if not isinstance(item_id, str) or not item_id:
            raise SystemExit(f"archive item id missing at line {line_number}")
        if item_id in ids:
            raise SystemExit(f"duplicate archive id: {item_id}")
        ids.add(item_id)
        rows.append(row)
    return rows, ids


def write_archive(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = "".join(
        json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n"
        for row in rows
    )
    path.write_text(text, encoding="utf-8")


def build_runtime(rows: list[dict], limit: int) -> dict:
    candidates = [row for row in rows if row.get("status") == "CANDIDATE"]
    candidates.sort(
        key=lambda row: (
            row.get("published_at") or "",
            row.get("first_seen_at") or "",
            row.get("id") or "",
        ),
        reverse=True,
    )
    selected = candidates[:limit]
    return {
        "schema": RUNTIME_SCHEMA,
        "contract": "DISCOVERY_ONLY_NO_CORE_LESSON_MUTATION",
        "item_count": len(selected),
        "archive_candidate_count": len(candidates),
        "latest_published_at": selected[0].get("published_at") if selected else None,
        "items": [
            {
                key: row.get(key)
                for key in (
                    "id",
                    "source_id",
                    "source_name",
                    "title",
                    "url",
                    "published_at",
                    "summary",
                    "relevance_score",
                    "matched_topics",
                    "linked_concepts",
                    "first_seen_at",
                )
            }
            for row in selected
        ],
    }


def write_runtime(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def collect(
    registry_path: Path,
    archive_path: Path,
    runtime_path: Path,
    max_new_per_source: int,
    runtime_limit: int,
    threshold: int,
    timeout: int,
    lookback_days: int,
) -> int:
    registry = load_registry(registry_path)
    archive, known_ids = read_archive(archive_path)
    new_rows = []
    source_success_count = 0
    cutoff = datetime.now(timezone.utc).timestamp() - (lookback_days * 86400)

    for source in registry["sources"]:
        if source.get("enabled") is not True:
            continue

        sid = source["id"]
        try:
            entries = parse_feed(fetch_bytes(source["url"], timeout), source["url"])
            source_success_count += 1
            print(f"SOURCE={sid}|FETCH=PASS|ITEMS={len(entries)}")
        except Exception as exc:
            print(
                f"SOURCE={sid}|FETCH=ERROR|TYPE={type(exc).__name__}"
                f"|MESSAGE={clean_text(str(exc), 240)}"
            )
            continue

        new_for_source = 0
        for entry in entries:
            published_at = entry.get("published_at")
            if published_at:
                published_dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
                if published_dt.timestamp() < cutoff:
                    continue

            item_id = stable_id(sid, entry["url"], entry["title"], published_at)
            if item_id in known_ids:
                continue

            combined = f"{entry['title']} {entry.get('summary') or ''}"
            result = classify(combined, source["base_score"], threshold)
            row = {
                "id": item_id,
                "source_id": sid,
                "source_name": source["name"],
                "source_authority": source["authority"],
                "title": entry["title"],
                "url": entry["url"],
                "published_at": entry.get("published_at"),
                "summary": entry.get("summary") or "",
                "relevance_score": result["score"],
                "status": result["status"],
                "matched_terms": result["matched_terms"],
                "negative_terms": result["negative_terms"],
                "ai_signals": result["ai_signals"],
                "learning_signals": result["learning_signals"],
                "low_value_signals": result["low_value_signals"],
                "matched_topics": result["topics"],
                "linked_concepts": result["linked_concepts"],
                "first_seen_at": utc_now(),
                "requires_llm_enrichment": result["status"] == "CANDIDATE",
            }
            new_rows.append(row)
            known_ids.add(item_id)
            new_for_source += 1

            if new_for_source >= max_new_per_source:
                break

    if source_success_count == 0:
        raise SystemExit("all enabled sources failed")

    if new_rows:
        archive.extend(new_rows)
        write_archive(archive_path, archive)

    runtime = build_runtime(archive, runtime_limit)
    new_runtime = json.dumps(runtime, ensure_ascii=False, indent=2) + "\n"
    old_runtime = runtime_path.read_text(encoding="utf-8") if runtime_path.is_file() else None
    if new_runtime != old_runtime:
        runtime_path.parent.mkdir(parents=True, exist_ok=True)
        runtime_path.write_text(new_runtime, encoding="utf-8")

    new_candidate_count = sum(1 for row in new_rows if row["status"] == "CANDIDATE")
    print(f"SOURCE_SUCCESS_COUNT={source_success_count}")
    print(f"NEW_ITEM_COUNT={len(new_rows)}")
    print(f"NEW_CANDIDATE_COUNT={new_candidate_count}")
    print(f"NEW_WATCH_ONLY_COUNT={len(new_rows) - new_candidate_count}")
    print(f"ARCHIVE_ITEM_COUNT={len(archive)}")
    print(f"RUNTIME_ITEM_COUNT={runtime['item_count']}")
    print("DYNAMIC_AI_FEED_COLLECT_R1=PASS")
    return 0


def self_test() -> int:
    sample = b"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Introducing GPT Example API and agent tools</title>
      <link>https://example.com/release?utm_source=test</link>
      <pubDate>Tue, 10 Nov 2026 10:00:00 GMT</pubDate>
      <description>New SDK for Python developers with tool use and reasoning.</description>
    </item>
    <item>
      <title>We are hiring for a new office</title>
      <link>https://example.com/jobs</link>
      <pubDate>Tue, 10 Nov 2026 09:00:00 GMT</pubDate>
      <description>Company hiring update.</description>
    </item>
  </channel>
</rss>
"""

    rows = parse_feed(sample, "https://example.com/feed.xml")
    assert len(rows) == 2
    assert rows[0]["url"] == "https://example.com/release"

    first = classify(f"{rows[0]['title']} {rows[0]['summary']}", 3, 5)
    second = classify(f"{rows[1]['title']} {rows[1]['summary']}", 3, 5)
    consumer = classify(
        "ChatGPT Plus for veterans and servicemembers. Product access update.",
        3,
        5,
    )
    generic_dev = classify(
        "A more informative GitHub dashboard for developers.",
        1,
        5,
    )
    technical = classify(
        "Gemini Decisions API for developers with multimodal model evaluation.",
        1,
        5,
    )

    assert first["status"] == "CANDIDATE"
    assert "api_sdk" in first["topics"]
    assert "call" in first["linked_concepts"]
    assert second["status"] == "WATCH_ONLY"
    assert consumer["status"] == "WATCH_ONLY"
    assert generic_dev["status"] == "WATCH_ONLY"
    assert technical["status"] == "CANDIDATE"
    assert stable_id(
        "x", rows[0]["url"], rows[0]["title"], rows[0]["published_at"]
    ).startswith("AIFR1_")

    runtime = build_runtime(
        [
            {
                "id": "AIFR1_TEST",
                "status": "CANDIDATE",
                "published_at": "2026-11-10T10:00:00Z",
                "first_seen_at": "2026-11-10T10:01:00Z",
            }
        ],
        10,
    )
    assert runtime["item_count"] == 1
    assert runtime["contract"] == "DISCOVERY_ONLY_NO_CORE_LESSON_MUTATION"

    print("DYNAMIC_AI_FEED_SELF_TEST_R1=PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    parser.add_argument("--archive", type=Path, default=DEFAULT_ARCHIVE)
    parser.add_argument("--runtime", type=Path, default=DEFAULT_RUNTIME)
    parser.add_argument("--max-new-per-source", type=int, default=25)
    parser.add_argument("--runtime-limit", type=int, default=60)
    parser.add_argument("--threshold", type=int, default=5)
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--lookback-days", type=int, default=14)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--registry-check", action="store_true")
    parser.add_argument("--collect", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    if args.registry_check:
        registry = load_registry(args.registry)
        enabled = sum(1 for source in registry["sources"] if source.get("enabled") is True)
        print(f"SOURCE_COUNT={len(registry['sources'])}")
        print(f"ENABLED_SOURCE_COUNT={enabled}")
        print("DYNAMIC_AI_FEED_REGISTRY_R1=PASS")
        return 0

    if args.collect:
        return collect(
            args.registry,
            args.archive,
            args.runtime,
            args.max_new_per_source,
            args.runtime_limit,
            args.threshold,
            args.timeout,
            args.lookback_days,
        )

    parser.error("choose --self-test, --registry-check, or --collect")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
