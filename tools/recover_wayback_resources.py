#!/usr/bin/env python3
"""Recover exact locally-missing site files from the Internet Archive CDX index.

Every network request is restricted to web.archive.org. Historical source URLs
are never requested from the live ArtisanShop host.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

ARCHIVE_HOST = "web.archive.org"
ORIGINAL_HOST = "www.artisanshop.ch"
SNAPSHOT = "20250825132536"
CDX_ENDPOINT = "https://web.archive.org/cdx/search/cdx"


class ArchiveOnlyRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urllib.parse.urlsplit(newurl).hostname != ARCHIVE_HOST:
            raise urllib.error.HTTPError(newurl, code, "Refused redirect away from archive", headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(ArchiveOnlyRedirect)


def fetch(url: str, timeout: int = 60) -> tuple[bytes, dict[str, str], str]:
    if urllib.parse.urlsplit(url).hostname != ARCHIVE_HOST:
        raise ValueError(f"Refusing non-archive URL: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "ArtisanShop-recovery/1.0"})
    with OPENER.open(req, timeout=timeout) as response:
        final = response.geturl()
        if urllib.parse.urlsplit(final).hostname != ARCHIVE_HOST:
            raise ValueError(f"Archive request ended outside archive: {final}")
        return response.read(), dict(response.headers.items()), final


def get_cdx(year: str, cache_dir: Path) -> list[list[str]]:
    cache = cache_dir / f"cdx-{year}.json"
    if cache.is_file():
        return json.loads(cache.read_bytes())
    cache_dir.mkdir(parents=True, exist_ok=True)
    params = [
        ("url", f"{ORIGINAL_HOST}/*"),
        ("output", "json"),
        ("filter", "statuscode:200"),
        ("filter", f"timestamp:{year}"),
        ("fl", "timestamp,original,mimetype,statuscode,length"),
    ]
    url = CDX_ENDPOINT + "?" + urllib.parse.urlencode(params)
    body, _, _ = fetch(url)
    cache.write_bytes(body)
    return json.loads(body)


def safe_local_path(root: Path, web_path: str, *, route: bool) -> Path:
    decoded = urllib.parse.unquote(web_path)
    relative = decoded.lstrip("/")
    if not relative or ".." in Path(relative).parts:
        raise ValueError(f"Unsafe archived path: {web_path}")
    path = root / relative
    if route and (decoded.endswith("/") or not path.suffix):
        path = path / "index.html"
    path.resolve().relative_to(root.resolve())
    return path


def normalize_archived_html(body: bytes, destination: Path) -> bytes:
    text = body.decode("utf-8", errors="replace")
    # Convert the archived origin only when it appears as a URL prefix. External
    # integrations and plain historical brand copy are intentionally untouched.
    replacements = (
        (r"https:\\/\\/www\.artisanshop\.ch\\/", r"\/"),
        (r"http:\\/\\/www\.artisanshop\.ch\\/", r"\/"),
        (r"https:\\/\\/artisanshop\.ch\\/", r"\/"),
        (r"http:\\/\\/artisanshop\.ch\\/", r"\/"),
        (r"https://www\.artisanshop\.ch/", "/"),
        (r"http://www\.artisanshop\.ch/", "/"),
        (r"https://artisanshop\.ch/", "/"),
        (r"http://artisanshop\.ch/", "/"),
        (r"//www\.artisanshop\.ch/", "/"),
        (r"//artisanshop\.ch/", "/"),
    )
    for old, new in replacements:
        text = re.sub(old, new, text, flags=re.I)
    # Restore Sentry's same-origin trace allow-list without a fixed domain.
    text = re.sub(
        r"tracePropagationTargets\s*:\s*\[[^\]]*\]",
        "tracePropagationTargets: [window.SITE_BASE_URL]",
        text,
    )
    if "<head" in text.lower() and "/site-base.js" not in text:
        text = re.sub(r"(<head\b[^>]*>)", r'\1\n<script src="/site-base.js"></script>', text, count=1, flags=re.I)
    return text.encode("utf-8")


def valid_payload(body: bytes, expected_mime: str) -> bool:
    mime = expected_mime.split(";", 1)[0].lower()
    if mime == "text/html":
        sample = body[:8192].lower()
        return b"<html" in sample or b"<!doctype html" in sample
    if mime == "image/webp":
        return len(body) > 16 and body[:4] == b"RIFF" and body[8:12] == b"WEBP"
    if mime == "image/jpeg":
        return body.startswith(b"\xff\xd8\xff")
    if mime == "image/png":
        return body.startswith(b"\x89PNG\r\n\x1a\n")
    if mime == "image/svg+xml":
        return b"<svg" in body[:4096].lower()
    if mime.startswith("image/"):
        return len(body) > 32
    if mime.startswith("font/") or mime in {"application/font-woff", "application/vnd.ms-fontobject"}:
        return len(body) > 64
    return bool(body)


def cdx_candidates(
    root: Path,
    cache_dir: Path,
    inventory: Path,
    kind: str,
    *,
    include_existing: bool = False,
) -> list[dict[str, Any]]:
    captures: dict[str, dict[str, Any]] = {}
    for year in ("2024", "2025"):
        rows = get_cdx(year, cache_dir)
        for row in rows[1:]:
            timestamp, original, mime, status, length = row
            if timestamp >= SNAPSHOT or status != "200":
                continue
            parsed = urllib.parse.urlsplit(original)
            if parsed.hostname != ORIGINAL_HOST or parsed.scheme not in {"http", "https"}:
                continue
            path = urllib.parse.unquote(parsed.path)
            previous = captures.get(path)
            if previous is None or timestamp > previous["timestamp"]:
                captures[path] = {
                    "timestamp": timestamp,
                    "original": original,
                    "mime": mime,
                    "length": int(length),
                }

    rows: list[dict[str, Any]] = []
    with inventory.open(newline="", encoding="utf-8") as stream:
        for item in csv.DictReader(stream):
            url_path = item["url_path"]
            web_path = urllib.parse.urlsplit(url_path).path
            if not web_path.startswith("/"):
                continue
            capture = captures.get(urllib.parse.unquote(web_path))
            if not capture:
                continue
            mime = capture["mime"].split(";", 1)[0].lower()
            is_page = mime == "text/html"
            is_asset = mime.startswith(("image/", "font/")) or mime in {"application/font-woff", "application/vnd.ms-fontobject"}
            if kind == "routes" and not is_page:
                continue
            if kind == "assets" and not is_asset:
                continue
            destination = safe_local_path(root, web_path, route=(kind == "routes"))
            if destination.is_file() and not include_existing:
                continue
            rows.append({
                "kind": kind,
                "url_path": url_path,
                "reference_count": int(item.get("reference_count", "0") or 0),
                "timestamp": capture["timestamp"],
                "original_path": urllib.parse.urlsplit(capture["original"]).path,
                "original_query": urllib.parse.urlsplit(capture["original"]).query,
                "mime": capture["mime"],
                "expected_bytes": capture["length"],
                "archive_url": f"https://{ARCHIVE_HOST}/web/{capture['timestamp']}id_/{capture['original']}",
                "destination": destination,
            })
    return rows


def download_one(item: dict[str, Any], root: Path) -> dict[str, Any]:
    destination: Path = item["destination"]
    if urllib.parse.urlsplit(item["archive_url"]).hostname != ARCHIVE_HOST:
        raise ValueError("Archive URL escaped allow-list")
    last_error = ""
    for attempt in range(4):
        try:
            body, headers, final_url = fetch(item["archive_url"])
            content_type = headers.get("Content-Type", "").split(";", 1)[0].lower()
            if content_type and content_type != item["mime"].split(";", 1)[0].lower():
                raise ValueError(f"Content-Type mismatch: got {content_type}, expected {item['mime']}")
            if not valid_payload(body, item["mime"]):
                raise ValueError("Response body did not match expected resource type")
            if item["kind"] == "routes":
                body = normalize_archived_html(body, destination)
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(body)
            return {**item, "result": "RECOVERED", "actual_bytes": len(body), "final_archive_url": final_url, "error": ""}
        except Exception as error:  # keep auditing other valid candidates
            last_error = f"{type(error).__name__}: {error}"
            if attempt < 3:
                time.sleep(1.5 * (attempt + 1))
    return {**item, "result": "FAILED", "actual_bytes": 0, "final_archive_url": "", "error": last_error}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--cache-dir", type=Path, default=Path("/tmp/artisanshop-wayback-cdx"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    assets = cdx_candidates(root, args.cache_dir, root / "WEBSITE_MISSING_ASSETS.csv", "assets", include_existing=True)
    linked_assets = cdx_candidates(root, args.cache_dir, root / "WEBSITE_UNRESOLVED_ROUTES.csv", "assets", include_existing=True)
    routes = cdx_candidates(root, args.cache_dir, root / "WEBSITE_UNRESOLVED_ROUTES.csv", "routes", include_existing=True)
    by_key: dict[tuple[str, str], dict[str, Any]] = {}
    for row in assets + linked_assets + routes:
        key = (row["kind"], urllib.parse.unquote(urllib.parse.urlsplit(row["url_path"]).path))
        if key in by_key:
            by_key[key]["reference_count"] += row["reference_count"]
        else:
            by_key[key] = row

    # Preserve previous run results so retries are cumulative and the final
    # inventory includes both direct media references and image links.
    inventory_path = root / "WAYBACK_RECOVERY_INVENTORY.csv"
    if inventory_path.is_file():
        with inventory_path.open(newline="", encoding="utf-8") as stream:
            previous = list(csv.DictReader(stream))
        for old in previous:
            key = (old["kind"], urllib.parse.unquote(urllib.parse.urlsplit(old["url_path"]).path))
            if key not in by_key:
                destination = root / old["destination"]
                by_key[key] = {
                    **old,
                    "destination": destination,
                    "expected_bytes": int(old["expected_bytes"] or 0),
                    "actual_bytes": int(old["actual_bytes"] or 0),
                    "reference_count": int(old["reference_count"] or 0),
                }
            else:
                merged = {**by_key[key], **old}
                merged["destination"] = root / old["destination"]
                merged["reference_count"] = max(
                    int(by_key[key].get("reference_count", 0) or 0),
                    int(old.get("reference_count", 0) or 0),
                )
                by_key[key] = merged
    all_candidates = list(by_key.values())
    candidates = [row for row in all_candidates if not Path(row["destination"]).is_file()]
    print(f"Exact archive candidates: {sum(row['kind']=='assets' for row in all_candidates)} assets, {sum(row['kind']=='routes' for row in all_candidates)} HTML routes; {len(candidates)} still need downloading")
    if args.dry_run:
        for row in all_candidates[:25]:
            print(row["kind"], row["url_path"], row["timestamp"], row["mime"], row["destination"])
        return 0
    outcomes: list[dict[str, Any]] = []
    for row in all_candidates:
        destination: Path = row["destination"]
        if destination.is_file():
            body = destination.read_bytes()
            if valid_payload(body, row["mime"]):
                outcomes.append({**row, "result": "RECOVERED", "actual_bytes": len(body), "final_archive_url": "", "error": ""})
            else:
                outcomes.append({**row, "result": "INVALID_LOCAL_FILE", "actual_bytes": len(body), "final_archive_url": "", "error": "Existing local path failed content-signature validation"})
    with ThreadPoolExecutor(max_workers=max(1, min(args.workers, 8))) as pool:
        futures = [pool.submit(download_one, row, root) for row in candidates]
        for future in as_completed(futures):
            result = future.result()
            outcomes.append(result)
            print(result["result"], result["kind"], result["url_path"])
    report = inventory_path
    fields = ["result", "kind", "url_path", "reference_count", "timestamp", "original_path", "original_query", "mime", "expected_bytes", "actual_bytes", "destination", "final_archive_url", "error"]
    with report.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for row in outcomes:
            data = {field: str(row.get(field, "")) for field in fields}
            destination = Path(row["destination"])
            data["destination"] = destination.relative_to(root).as_posix()
            writer.writerow(data)
    print(f"Recovered {sum(row['result']=='RECOVERED' for row in outcomes)} / {len(outcomes)}; report: {report}")
    return int(any(row["result"] == "FAILED" for row in outcomes))


if __name__ == "__main__":
    raise SystemExit(main())
