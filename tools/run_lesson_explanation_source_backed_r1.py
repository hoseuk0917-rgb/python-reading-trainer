#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import audit_explanation_readiness_r1 as readiness
import plan_source_backed_explanation_r1 as source_plan
import run_lesson_explanation_api_pilot_r1 as base

SOURCE_PROMPT_VERSION = "lesson-explanation-source-backed-r1-v1"
SOURCE_RESULT_SCHEMA = "python-reading-trainer/lesson-explanation-source-backed-r1"
SOURCE_READY_AUTHORITIES = {
    "STDLIB_API_AUTHORITY",
    "THIRD_PARTY_API_AUTHORITY",
}


def official_source_info(card: dict[str, Any]) -> dict[str, Any]:
    record = source_plan.source_record(card)
    if not record["source_ready"]:
        raise RuntimeError(f"{card['id']}: card is not source-ready")

    authority = str(record["authority"])
    sources: list[dict[str, str]] = []
    required_domains: set[str] = set()
    required_prefixes: set[str] = set()

    for item in record["source_urls"]:
        bundle = str(item["bundle"])
        url = str(item["url"])
        role = "primary"
        if authority == "STDLIB_API_AUTHORITY" and bundle.startswith("PY_STDLIB_"):
            role = "authority"
        elif authority == "THIRD_PARTY_API_AUTHORITY" and bundle.startswith("THIRD_PARTY_"):
            role = "authority"

        parsed = urllib.parse.urlparse(url)
        domain = parsed.hostname or ""
        if not domain:
            raise RuntimeError(f"{card['id']}: source URL has no domain: {url}")

        sources.append(
            {
                "bundle": bundle,
                "url": url,
                "domain": domain,
                "role": role,
            }
        )
        if role == "authority":
            required_domains.add(domain)
            if domain == "github.com":
                required_prefixes.add(url.rstrip("/"))

    if not required_domains:
        raise RuntimeError(f"{card['id']}: authority-specific official source missing")

    allowed_domains = sorted({item["domain"] for item in sources})
    return {
        "sources": sources,
        "allowed_domains": allowed_domains,
        "required_domains": sorted(required_domains),
        "required_prefixes": sorted(required_prefixes),
    }


def collect_source_ready() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for card in readiness.load_cards():
        record = source_plan.source_record(card)
        if not record["source_ready"]:
            continue
        if record["disposition"] not in base.TARGET_DISPOSITIONS:
            continue

        row = dict(card)
        row["_authority"] = record["authority"]
        row["_reasons"] = list(record["quality_reasons"])
        row["_disposition"] = record["disposition"]
        row["_patch_targets"] = base.patch_targets_for(row["_reasons"])
        row["_official_source_info"] = official_source_info(card)
        if not row["_patch_targets"]:
            raise SystemExit(f"no patch target for source-ready card: {row['id']}")
        rows.append(row)
    return rows


def select_source_ready(
    limit: int,
    *,
    selection_ids: list[str] | None = None,
) -> list[dict[str, Any]]:
    rows = collect_source_ready()
    inventory = len(rows)
    if inventory < 1:
        raise SystemExit("source-backed inventory is empty")

    if selection_ids is not None:
        if not selection_ids:
            raise SystemExit("explicit source-backed selection is empty")
        if len(selection_ids) != len(set(selection_ids)):
            raise SystemExit("explicit source-backed selection contains duplicate ids")
        if limit != len(selection_ids):
            raise SystemExit(
                f"explicit source-backed selection size mismatch: limit={limit} ids={len(selection_ids)}"
            )

        by_id = {str(row["id"]): row for row in rows}
        missing = [cid for cid in selection_ids if cid not in by_id]
        if missing:
            raise SystemExit(
                "explicit source-backed selection is not currently source-ready: "
                + ",".join(missing)
            )
        return [by_id[cid] for cid in selection_ids]

    if limit < 1 or limit > inventory:
        raise SystemExit(
            f"source-backed batch limit must be between 1 and current inventory {inventory}"
        )

    by_authority: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        by_authority[str(row["_authority"])].append(row)

    for values in by_authority.values():
        values.sort(
            key=lambda row: (
                str(row.get("primary_concept") or ""),
                int(row.get("level") or 999),
                str(row["id"]),
            )
        )

    if limit == len(rows):
        selected = list(rows)
    else:
        third_count = len(by_authority["THIRD_PARTY_API_AUTHORITY"])
        third_target = max(1, round(limit * third_count / len(rows))) if third_count else 0
        third_target = min(third_target, third_count, limit)
        stdlib_target = limit - third_target

        selected = (
            base.round_robin(
                list(by_authority["THIRD_PARTY_API_AUTHORITY"]),
                third_target,
            )
            + base.round_robin(
                list(by_authority["STDLIB_API_AUTHORITY"]),
                stdlib_target,
            )
        )

        if len(selected) < limit:
            selected_ids = {str(row["id"]) for row in selected}
            leftovers = [
                row for row in rows
                if str(row["id"]) not in selected_ids
            ]
            selected.extend(base.round_robin(leftovers, limit - len(selected)))

    if len(selected) != limit:
        raise SystemExit(
            f"not enough source-ready candidates: requested={limit} selected={len(selected)}"
        )

    authority_order = {
        "THIRD_PARTY_API_AUTHORITY": 0,
        "STDLIB_API_AUTHORITY": 1,
    }
    selected.sort(
        key=lambda row: (
            authority_order.get(str(row["_authority"]), 9),
            str(row["_disposition"]),
            str(row.get("primary_concept") or ""),
            int(row.get("level") or 999),
            str(row["id"]),
        )
    )
    return selected


def selection_sha(selected: list[dict[str, Any]]) -> str:
    return hashlib.sha256(
        "\n".join(str(row["id"]) for row in selected).encode("utf-8")
    ).hexdigest()


def build_source_prompt(
    *,
    contract: str,
    ko_card: dict[str, Any],
    en_card: dict[str, Any],
    selected_row: dict[str, Any],
    ko_support: list[dict[str, Any]],
    en_support: list[dict[str, Any]],
    gold_reference: dict[str, Any] | None,
) -> str:
    prompt = base.build_prompt(
        contract=contract,
        ko_card=ko_card,
        en_card=en_card,
        authority=str(selected_row["_authority"]),
        reasons=list(selected_row["_reasons"]),
        targets=list(selected_row["_patch_targets"]),
        ko_support=ko_support,
        en_support=en_support,
        gold_reference=gold_reference,
    )
    source_info = selected_row["_official_source_info"]
    source_lines = [
        "",
        "SOURCE-BACKED MODE — MANDATORY:",
        "- You MUST use the web search tool before producing the JSON answer.",
        "- Consult at least one authority-specific official source listed below.",
        "- Use only the allowed official domains enforced by the tool.",
        "- Ground external-library/API behavior in the consulted official source.",
        "- If the official source does not support a claim, omit that claim rather than guessing.",
        "- Do not put URLs, citations, citation markers, or source names inside the explanation fields.",
        "- Keep the final JSON focused on teaching this frozen card; web evidence is provenance, not learner-facing prose.",
        "",
        "OFFICIAL SOURCE BUNDLES:",
        json.dumps(source_info["sources"], ensure_ascii=False, indent=2),
    ]
    return prompt + "\n" + "\n".join(source_lines)


def extract_web_source_urls(response: dict[str, Any]) -> list[str]:
    urls: list[str] = []

    def add_url(value: Any) -> None:
        if isinstance(value, str):
            value = value.strip()
            if value and value not in urls:
                urls.append(value)

    for item in response.get("output") or []:
        if not isinstance(item, dict):
            continue

        if item.get("type") == "web_search_call":
            action = item.get("action") or {}
            add_url(action.get("url"))

            candidates = action.get("sources") or item.get("sources") or []
            for source in candidates:
                if isinstance(source, dict):
                    add_url(source.get("url"))

        if item.get("type") == "message":
            for content in item.get("content") or []:
                if not isinstance(content, dict):
                    continue
                for annotation in content.get("annotations") or []:
                    if not isinstance(annotation, dict):
                        continue
                    if annotation.get("type") == "url_citation":
                        add_url(annotation.get("url"))
                    nested = annotation.get("url_citation")
                    if isinstance(nested, dict):
                        add_url(nested.get("url"))

    return urls


def validate_web_sources(
    *,
    cid: str,
    web_sources: list[str],
    source_info: dict[str, Any],
) -> None:
    if not web_sources:
        raise RuntimeError(f"{cid}: required web search produced no source URLs")

    def domain_matches(host: str, authority_domain: str) -> bool:
        host = host.lower().rstrip(".")
        authority_domain = authority_domain.lower().rstrip(".")
        return host == authority_domain or host.endswith("." + authority_domain)

    allowed = set(source_info["allowed_domains"])
    observed_domains: set[str] = set()
    for url in web_sources:
        domain = (urllib.parse.urlparse(url).hostname or "").lower().rstrip(".")
        if not any(domain_matches(domain, authority_domain) for authority_domain in allowed):
            raise RuntimeError(f"{cid}: non-allowlisted web source used: {url}")
        observed_domains.add(domain)

    required_domains = set(source_info["required_domains"])
    if not any(
        domain_matches(observed_domain, required_domain)
        for observed_domain in observed_domains
        for required_domain in required_domains
    ):
        raise RuntimeError(
            f"{cid}: authority-specific source domain not consulted: "
            f"required={sorted(required_domains)} observed={sorted(observed_domains)}"
        )

    for prefix in source_info.get("required_prefixes") or []:
        if not any(url.startswith(prefix) for url in web_sources):
            raise RuntimeError(
                f"{cid}: required official repository source not consulted: {prefix}"
            )


def validate_no_citation_artifacts(patch: dict[str, Any], cid: str, language: str) -> None:
    text = json.dumps(patch, ensure_ascii=False)
    forbidden = ("http://", "https://", "cite", "【", "】")
    found = [token for token in forbidden if token in text]
    if found:
        raise RuntimeError(
            f"{cid} {language}: learner-facing explanation contains citation artifacts: {found}"
        )


def response_citation_artifacts(response: dict[str, Any]) -> list[str]:
    try:
        text = base.extract_output_text(response)
    except RuntimeError:
        return []
    forbidden = ("http://", "https://", "cite", "【", "】")
    return [token for token in forbidden if token in text]


def openai_source_request(
    *,
    api_key: str,
    model: str,
    prompt: str,
    schema: dict[str, Any],
    timeout: int,
    allowed_domains: list[str],
) -> dict[str, Any]:
    last_error: Exception | None = None
    cumulative_input_tokens = 0
    cumulative_output_tokens = 0
    cumulative_reasoning_tokens = 0
    cumulative_total_tokens = 0

    for attempt in range(1, 4):
        attempt_prompt = prompt
        if attempt > 1:
            attempt_prompt += (
                "\n\nRECOVERY NOTE: A previous generation failed or exceeded the output budget. "
                "Search the required official source again, then return only the required JSON schema. "
                "Keep every explanation field concise and do not include citations in the JSON."
            )
            if last_error and "citation artifacts" in str(last_error):
                attempt_prompt += (
                    " The previous JSON included learner-facing citation artifacts. "
                    "Do not write literal URLs, URI schemes such as http:// or https://, "
                    "domain names, source names, or citation markers in any explanation field."
                )

        body = {
            "model": model,
            "input": [
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": attempt_prompt}],
                }
            ],
            "reasoning": {"effort": "low"},
            "tools": [
                {
                    "type": "web_search",
                    "search_context_size": "low",
                    "filters": {"allowed_domains": allowed_domains},
                }
            ],
            "tool_choice": "required",
            "include": ["web_search_call.action.sources"],
            "text": {
                "verbosity": "low",
                "format": {
                    "type": "json_schema",
                    "name": "lesson_explanation_source_backed_r1",
                    "description": "Bilingual source-backed V1 lesson explanation patch for one frozen card.",
                    "strict": True,
                    "schema": schema,
                },
            },
            "max_output_tokens": 4000,
        }
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
        request = urllib.request.Request(
            base.OPENAI_RESPONSES_URL,
            data=encoded,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "python-reading-trainer-source-backed-explanation/1.0",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))

            usage = payload.get("usage") or {}
            details = usage.get("output_tokens_details") or {}
            cumulative_input_tokens += int(usage.get("input_tokens") or 0)
            cumulative_output_tokens += int(usage.get("output_tokens") or 0)
            cumulative_reasoning_tokens += int(details.get("reasoning_tokens") or 0)
            cumulative_total_tokens += int(
                usage.get("total_tokens")
                or (
                    int(usage.get("input_tokens") or 0)
                    + int(usage.get("output_tokens") or 0)
                )
            )

            payload["_source_request_attempts"] = attempt
            payload["_source_cumulative_usage"] = {
                "input_tokens": cumulative_input_tokens,
                "output_tokens": cumulative_output_tokens,
                "total_tokens": cumulative_total_tokens,
                "output_tokens_details": {
                    "reasoning_tokens": cumulative_reasoning_tokens,
                },
            }

            if payload.get("status") == "incomplete":
                incomplete = payload.get("incomplete_details") or {}
                reason = incomplete.get("reason") or "unknown"
                last_error = RuntimeError(
                    f"OpenAI incomplete response: reason={reason} attempt={attempt}"
                )
                if reason == "max_output_tokens" and attempt < 3:
                    time.sleep((2, 5, 10)[attempt - 1])
                    continue

            citation_artifacts = response_citation_artifacts(payload)
            if citation_artifacts:
                last_error = RuntimeError(
                    f"OpenAI learner-facing citation artifacts: {citation_artifacts}"
                )
                if attempt < 3:
                    time.sleep((2, 5, 10)[attempt - 1])
                    continue

            return payload
        except urllib.error.HTTPError as exc:
            body_text = exc.read().decode("utf-8", errors="replace")
            message = f"OpenAI HTTP {exc.code}: {base.clean_space(body_text)[:1200]}"
            last_error = RuntimeError(message)
            if exc.code not in {408, 409, 429, 500, 502, 503, 504} or attempt == 3:
                raise last_error from exc
        except TimeoutError as exc:
            last_error = RuntimeError(f"OpenAI read timeout: {exc}")
            if attempt == 3:
                raise last_error from exc
        except urllib.error.URLError as exc:
            last_error = RuntimeError(f"OpenAI URL error: {exc}")
            if attempt == 3:
                raise last_error from exc

        time.sleep((2, 5, 10)[attempt - 1])

    raise RuntimeError(f"OpenAI source-backed request failed: {last_error}")


def validate_resume_results(
    *,
    rows: list[dict[str, Any]],
    selected: list[dict[str, Any]],
    ko_cards: dict[str, dict[str, Any]],
    en_cards: dict[str, dict[str, Any]],
    selection_hash: str,
    model: str,
) -> list[dict[str, Any]]:
    if len(rows) > len(selected):
        raise RuntimeError("resume result count exceeds source-backed selection")

    by_index = {int(row.get("index") or 0): row for row in rows}
    if len(by_index) != len(rows):
        raise RuntimeError("duplicate source-backed resume indexes")

    validated: list[dict[str, Any]] = []
    for index in sorted(by_index):
        if index < 1 or index > len(selected):
            raise RuntimeError(f"source-backed resume index out of range: {index}")
        row = by_index[index]
        selected_row = selected[index - 1]
        cid = str(selected_row["id"])
        targets = list(selected_row["_patch_targets"])

        if row.get("schema") != SOURCE_RESULT_SCHEMA:
            raise RuntimeError(f"{cid}: source-backed resume schema mismatch")
        if row.get("prompt_version") != SOURCE_PROMPT_VERSION:
            raise RuntimeError(f"{cid}: source-backed resume prompt version mismatch")
        if row.get("selection_sha256") != selection_hash:
            raise RuntimeError(f"{cid}: source-backed resume selection mismatch")
        if str(row.get("id") or "") != cid:
            raise RuntimeError(f"{cid}: source-backed resume id mismatch")
        if row.get("model") != model:
            raise RuntimeError(f"{cid}: source-backed resume model mismatch")
        if list(row.get("patch_targets") or []) != targets:
            raise RuntimeError(f"{cid}: source-backed resume targets mismatch")
        if row.get("authority") != selected_row["_authority"]:
            raise RuntimeError(f"{cid}: source-backed resume authority mismatch")

        expected_sources = selected_row["_official_source_info"]["sources"]
        if row.get("official_sources") != expected_sources:
            raise RuntimeError(f"{cid}: official source mapping changed")

        web_sources = list(row.get("web_sources") or [])
        validate_web_sources(
            cid=cid,
            web_sources=web_sources,
            source_info=selected_row["_official_source_info"],
        )

        ko_card = ko_cards[cid]
        en_card = en_cards[cid]
        base.validate_patch(
            patch=row.get("ko") or {},
            card=ko_card,
            targets=targets,
            language="ko",
        )
        base.validate_patch(
            patch=row.get("en") or {},
            card=en_card,
            targets=targets,
            language="en",
        )
        base.validate_generated_target_quality(
            card=ko_card,
            patch=row.get("ko") or {},
            targets=targets,
            language="ko",
        )
        base.validate_generated_target_quality(
            card=en_card,
            patch=row.get("en") or {},
            targets=targets,
            language="en",
        )
        validate_no_citation_artifacts(row.get("ko") or {}, cid, "ko")
        validate_no_citation_artifacts(row.get("en") or {}, cid, "en")

        usage = row.get("usage") or {}
        if int(usage.get("input_tokens") or 0) + int(usage.get("output_tokens") or 0) <= 0:
            raise RuntimeError(f"{cid}: source-backed resume usage missing")

        validated.append(row)

    return validated


def load_resume_results(
    *,
    path: Path | None,
    selected: list[dict[str, Any]],
    ko_cards: dict[str, dict[str, Any]],
    en_cards: dict[str, dict[str, Any]],
    selection_hash: str,
    model: str,
) -> list[dict[str, Any]]:
    if path is None:
        return []
    if not path.exists():
        raise RuntimeError(f"source-backed resume result not found: {path}")
    rows = [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    return validate_resume_results(
        rows=rows,
        selected=selected,
        ko_cards=ko_cards,
        en_cards=en_cards,
        selection_hash=selection_hash,
        model=model,
    )


def plan(
    limit: int,
    *,
    selection_ids: list[str] | None = None,
) -> int:
    inventory = len(collect_source_ready())
    selected = select_source_ready(limit, selection_ids=selection_ids)
    authority_counts = Counter(str(row["_authority"]) for row in selected)
    disposition_counts = Counter(str(row["_disposition"]) for row in selected)
    digest = selection_sha(selected)

    print(f"SOURCE_READY_INVENTORY={inventory}")
    print(f"SOURCE_BACKED_LIMIT={limit}")
    print(f"SOURCE_BACKED_EXPLICIT_SELECTION={'YES' if selection_ids is not None else 'NO'}")
    print("SOURCE_BACKED_AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), sort_keys=True))
    print("SOURCE_BACKED_DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), sort_keys=True))
    print(f"SOURCE_BACKED_SELECTION_SHA256={digest}")

    for index, row in enumerate(selected, start=1):
        info = row["_official_source_info"]
        print(
            "SOURCE_BACKED_ITEM="
            f"{index}|{row['id']}|{row['_authority']}|{row['_disposition']}|"
            f"{'+'.join(row['_patch_targets'])}|"
            f"{'+'.join(info['allowed_domains'])}"
        )

    print("API_CALL_PERFORMED=NO")
    print("LESSON_EXPLANATION_SOURCE_BACKED_R1_PLAN=PASS")
    return 0


def self_test() -> int:
    rows = collect_source_ready()
    if not rows:
        raise RuntimeError("source-backed self-test inventory is empty")
    sample = rows[: min(10, len(rows))]
    for row in sample:
        info = row["_official_source_info"]
        if not info["allowed_domains"] or not info["required_domains"]:
            raise RuntimeError(f"{row['id']}: source-backed source info incomplete")

    search_urls = extract_web_source_urls({
        "output": [{
            "type": "web_search_call",
            "action": {
                "type": "search",
                "sources": [{"type": "url", "url": "https://docs.python.org/3.10/library/pathlib.html"}],
            },
        }]
    })
    if search_urls != ["https://docs.python.org/3.10/library/pathlib.html"]:
        raise RuntimeError(f"source-backed search source extraction failed: {search_urls}")

    open_page_urls = extract_web_source_urls({
        "output": [{
            "type": "web_search_call",
            "action": {
                "type": "open_page",
                "url": "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html",
            },
        }]
    })
    if open_page_urls != ["https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html"]:
        raise RuntimeError(f"source-backed open_page source extraction failed: {open_page_urls}")

    citation_urls = extract_web_source_urls({
        "output": [{
            "type": "message",
            "content": [{
                "type": "output_text",
                "text": "grounded answer",
                "annotations": [{
                    "type": "url_citation",
                    "url": "https://numpy.org/doc/stable/reference/generated/numpy.array.html",
                }],
            }],
        }]
    })
    if citation_urls != ["https://numpy.org/doc/stable/reference/generated/numpy.array.html"]:
        raise RuntimeError(f"source-backed citation source extraction failed: {citation_urls}")

    validate_web_sources(
        cid="SELF_TEST_OFFICIAL_SUBDOMAIN",
        web_sources=["https://cdn-media.huggingface.co/landing/assets/official.pdf"],
        source_info={
            "allowed_domains": ["huggingface.co"],
            "required_domains": ["huggingface.co"],
            "required_prefixes": [],
        },
    )
    citation_retry_probe = {
        "output": [{
            "type": "message",
            "content": [{
                "type": "output_text",
                "text": '{"ko":{"answer_explanation":"See https://example.com"}}',
            }],
        }]
    }
    if response_citation_artifacts(citation_retry_probe) != ["https://"]:
        raise RuntimeError("source-backed citation retry detector failed")

    try:
        validate_web_sources(
            cid="SELF_TEST_LOOKALIKE_DOMAIN",
            web_sources=["https://evil-huggingface.co/not-official"],
            source_info={
                "allowed_domains": ["huggingface.co"],
                "required_domains": ["huggingface.co"],
                "required_prefixes": [],
            },
        )
    except RuntimeError:
        pass
    else:
        raise RuntimeError("source-backed lookalike domain guard failed")

    print(f"SOURCE_BACKED_SELF_TEST_INVENTORY={len(rows)}")
    print("SOURCE_BACKED_WEB_PROVENANCE_EXTRACTION=PASS")
    print("LESSON_EXPLANATION_SOURCE_BACKED_R1_SELF_TEST=PASS")
    return 0


def live(
    *,
    limit: int,
    model: str,
    timeout: int,
    result_path: Path,
    hold_path: Path,
    resume_result_path: Path | None,
    selection_ids: list[str] | None,
    max_total_tokens: int,
    max_holds: int,
) -> int:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required for source-backed --live")

    selected = select_source_ready(limit, selection_ids=selection_ids)
    selection_hash = selection_sha(selected)
    ko_cards, _ = base.load_all_cards(base.LESSON_ROOT_KO)
    en_cards, _ = base.load_all_cards(base.LESSON_ROOT_EN)
    ko_support_index = base.load_support_index(base.SUPPORT_KO)
    en_support_index = base.load_support_index(base.SUPPORT_EN)
    ko_gold = base.build_gold_by_primary(ko_cards)
    contract = base.CONTRACT_PATH.read_text(encoding="utf-8-sig")

    resume_results = load_resume_results(
        path=resume_result_path,
        selected=selected,
        ko_cards=ko_cards,
        en_cards=en_cards,
        selection_hash=selection_hash,
        model=model,
    )

    result_path.parent.mkdir(parents=True, exist_ok=True)
    hold_path.parent.mkdir(parents=True, exist_ok=True)
    if result_path.exists():
        result_path.unlink()
    if hold_path.exists():
        hold_path.unlink()

    results = list(resume_results)
    result_by_index = {int(row["index"]): row for row in results}
    holds: list[dict[str, Any]] = []
    total_input_tokens = sum(int((row.get("usage") or {}).get("input_tokens") or 0) for row in results)
    total_output_tokens = sum(int((row.get("usage") or {}).get("output_tokens") or 0) for row in results)
    total_reasoning_tokens = sum(int((row.get("usage") or {}).get("reasoning_tokens") or 0) for row in results)

    if results:
        with result_path.open("w", encoding="utf-8", newline="\n") as handle:
            for row in results:
                handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")
        print(f"SOURCE_BACKED_RESUME_COUNT={len(results)}")

    if total_input_tokens + total_output_tokens > max_total_tokens:
        raise RuntimeError("source-backed token guard exceeded before resume")

    for index, selected_row in enumerate(selected, start=1):
        if index in result_by_index:
            print(f"SOURCE_BACKED_SKIP={index}/{limit}|{selected_row['id']}|RESUME_VALIDATED")
            continue

        cid = str(selected_row["id"])
        ko_card = ko_cards[cid]
        en_card = en_cards.get(cid)
        if not en_card:
            raise RuntimeError(f"{cid}: English card missing")

        targets = list(selected_row["_patch_targets"])
        info = selected_row["_official_source_info"]
        prompt = build_source_prompt(
            contract=contract,
            ko_card=ko_card,
            en_card=en_card,
            selected_row=selected_row,
            ko_support=base.support_for(ko_card, ko_support_index),
            en_support=base.support_for(en_card, en_support_index),
            gold_reference=base.one_gold_reference(selected_row, ko_gold, en_cards),
        )

        response: dict[str, Any] | None = None
        try:
            response = openai_source_request(
                api_key=api_key,
                model=model,
                prompt=prompt,
                schema=base.response_schema(targets),
                timeout=timeout,
                allowed_domains=info["allowed_domains"],
            )
            if response.get("status") not in {"completed", None}:
                incomplete = response.get("incomplete_details") or {}
                usage = response.get("_source_cumulative_usage") or response.get("usage") or {}
                raise RuntimeError(
                    f"{cid}: response status={response.get('status')} "
                    f"reason={incomplete.get('reason') or 'unknown'} "
                    f"attempts={response.get('_source_request_attempts') or 1} "
                    f"input_tokens={usage.get('input_tokens')} "
                    f"output_tokens={usage.get('output_tokens')}"
                )

            web_sources = extract_web_source_urls(response)
            validate_web_sources(cid=cid, web_sources=web_sources, source_info=info)

            generated = json.loads(base.extract_output_text(response))
            base.validate_patch(patch=generated["ko"], card=ko_card, targets=targets, language="ko")
            base.validate_patch(patch=generated["en"], card=en_card, targets=targets, language="en")
            base.validate_generated_target_quality(card=ko_card, patch=generated["ko"], targets=targets, language="ko")
            base.validate_generated_target_quality(card=en_card, patch=generated["en"], targets=targets, language="en")
            validate_no_citation_artifacts(generated["ko"], cid, "ko")
            validate_no_citation_artifacts(generated["en"], cid, "en")
        except (RuntimeError, json.JSONDecodeError) as exc:
            usage = {}
            if response is not None:
                usage = response.get("_source_cumulative_usage") or response.get("usage") or {}
            input_tokens = int(usage.get("input_tokens") or 0)
            output_tokens = int(usage.get("output_tokens") or 0)
            reasoning_tokens = int((usage.get("output_tokens_details") or {}).get("reasoning_tokens") or 0)
            total_input_tokens += input_tokens
            total_output_tokens += output_tokens
            total_reasoning_tokens += reasoning_tokens
            hold = {
                "schema": SOURCE_RESULT_SCHEMA,
                "prompt_version": SOURCE_PROMPT_VERSION,
                "selection_sha256": selection_hash,
                "index": index,
                "id": cid,
                "file": str(selected_row["_file"]),
                "authority": selected_row["_authority"],
                "disposition_before": selected_row["_disposition"],
                "quality_reasons_before": selected_row["_reasons"],
                "patch_targets": targets,
                "official_sources": info["sources"],
                "model": model,
                "status": "HOLD",
                "error_type": type(exc).__name__,
                "error": base.clean_space(str(exc))[:2000],
                "usage": {
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens,
                    "reasoning_tokens": reasoning_tokens,
                    "total_tokens": int(usage.get("total_tokens") or 0),
                },
            }
            holds.append(hold)
            with hold_path.open("a", encoding="utf-8", newline="\n") as handle:
                handle.write(json.dumps(hold, ensure_ascii=False, separators=(",", ":")) + "\n")
            print(f"SOURCE_BACKED_HOLD={index}/{limit}|{cid}|{type(exc).__name__}|{base.clean_space(str(exc))[:500]}")
            if len(holds) > max_holds:
                raise RuntimeError(f"source-backed hold limit exceeded: {len(holds)}>{max_holds}") from exc
            if total_input_tokens + total_output_tokens > max_total_tokens:
                raise RuntimeError("source-backed token guard exceeded")
            continue

        usage = response.get("_source_cumulative_usage") or response.get("usage") or {}
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)
        reasoning_tokens = int((usage.get("output_tokens_details") or {}).get("reasoning_tokens") or 0)
        total_input_tokens += input_tokens
        total_output_tokens += output_tokens
        total_reasoning_tokens += reasoning_tokens

        result = {
            "schema": SOURCE_RESULT_SCHEMA,
            "prompt_version": SOURCE_PROMPT_VERSION,
            "selection_sha256": selection_hash,
            "index": index,
            "id": cid,
            "file": str(selected_row["_file"]),
            "primary_concept": selected_row.get("primary_concept"),
            "authority": selected_row["_authority"],
            "disposition_before": selected_row["_disposition"],
            "quality_reasons_before": selected_row["_reasons"],
            "patch_targets": targets,
            "side_card_ids": ko_card.get("side_card_ids") or [],
            "official_sources": info["sources"],
            "web_sources": web_sources,
            "model": model,
            "response_id": response.get("id") or "",
            "request_attempts": int(response.get("_source_request_attempts") or 1),
            "usage": {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "reasoning_tokens": reasoning_tokens,
                "total_tokens": int(usage.get("total_tokens") or 0),
            },
            "ko": generated["ko"],
            "en": generated["en"],
            "quality": generated["quality"],
        }
        results.append(result)
        result_by_index[index] = result
        with result_path.open("a", encoding="utf-8", newline="\n") as handle:
            handle.write(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n")

        print(
            f"SOURCE_BACKED_RESULT={index}/{limit}|{cid}|{selected_row['_authority']}|"
            f"{'+'.join(targets)}|WEB_SOURCES={len(web_sources)}|"
            f"INPUT_TOKENS={input_tokens}|OUTPUT_TOKENS={output_tokens}"
        )
        if total_input_tokens + total_output_tokens > max_total_tokens:
            raise RuntimeError("source-backed token guard exceeded")

    results.sort(key=lambda row: int(row["index"]))
    successful_selected = [selected[int(row["index"]) - 1] for row in results]

    en_before = {cid: dict(card) for cid, card in en_cards.items()}
    by_file: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for result in results:
        by_file[str(result["file"])].append(result)

    for filename, file_results in sorted(by_file.items()):
        base.apply_file_patches(
            path=base.LESSON_ROOT_KO / filename,
            results=file_results,
            language="ko",
        )
        base.apply_file_patches(
            path=base.LESSON_ROOT_EN / filename,
            results=file_results,
            language="en",
        )

    base.validate_after_apply(selected=successful_selected, en_cards_before=en_before)

    print(f"SOURCE_BACKED_RESULT_COUNT={len(results)}")
    print(f"SOURCE_BACKED_HOLD_COUNT={len(holds)}")
    if holds:
        print("SOURCE_BACKED_HOLD_IDS=" + ",".join(str(row["id"]) for row in holds))
    print(f"SOURCE_BACKED_TOTAL_INPUT_TOKENS={total_input_tokens}")
    print(f"SOURCE_BACKED_TOTAL_OUTPUT_TOKENS={total_output_tokens}")
    print(f"SOURCE_BACKED_TOTAL_REASONING_TOKENS={total_reasoning_tokens}")
    print(f"SOURCE_BACKED_RESULT_PATH={result_path}")
    if holds:
        print("LESSON_EXPLANATION_SOURCE_BACKED_R1_LIVE=PASS_WITH_HOLDS")
    else:
        print("LESSON_EXPLANATION_SOURCE_BACKED_R1_LIVE=PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--model", default=base.DEFAULT_MODEL)
    parser.add_argument("--timeout", type=int, default=300)
    parser.add_argument("--result-path", type=Path, default=Path("lesson-explanation-source-backed-r1.jsonl"))
    parser.add_argument("--hold-path", type=Path, default=Path("lesson-explanation-source-backed-r1-holds.jsonl"))
    parser.add_argument("--resume-result-path", type=Path)
    parser.add_argument(
        "--selection-ids",
        default="",
        help="Optional comma-separated current source-ready card IDs to process in the given order.",
    )
    parser.add_argument("--max-total-tokens", type=int, default=400_000)
    parser.add_argument("--max-holds", type=int, default=3)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--plan", action="store_true")
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()

    selection_ids = [
        value.strip()
        for value in args.selection_ids.split(",")
        if value.strip()
    ] or None

    modes = sum(bool(value) for value in (args.self_test, args.plan, args.live))
    if modes != 1:
        parser.error("choose exactly one of --self-test, --plan, or --live")
    if args.self_test:
        return self_test()
    if args.plan:
        return plan(args.limit, selection_ids=selection_ids)
    return live(
        limit=args.limit,
        model=args.model,
        timeout=args.timeout,
        result_path=args.result_path,
        hold_path=args.hold_path,
        resume_result_path=args.resume_result_path,
        selection_ids=selection_ids,
        max_total_tokens=args.max_total_tokens,
        max_holds=args.max_holds,
    )


if __name__ == "__main__":
    raise SystemExit(main())
