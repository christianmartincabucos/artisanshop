#!/usr/bin/env python3
"""Serve the recovered site with route aliases and its own not-found page."""
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class RecoveryHandler(SimpleHTTPRequestHandler):
    """Serve files, directory indexes, and matching extensionless HTML routes."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path: str) -> str:
        # Keep the standard handler's URL decoding and traversal protection.
        translated = Path(super().translate_path(path))
        try:
            translated.resolve().relative_to(ROOT)
        except ValueError:
            return str(ROOT / "__not_found__")
        if translated.exists():
            return str(translated)

        # Static mirrors often link a saved `name.html` as `/name` or `/name/`.
        candidates = []
        if translated.suffix == "":
            candidates.extend((translated.with_suffix(".html"), translated / "index.html"))
        elif translated.suffix.lower() == ".html":
            candidates.append(translated.with_suffix("") / "index.html")
        for candidate in candidates:
            try:
                candidate.resolve().relative_to(ROOT)
            except ValueError:
                continue
            if candidate.is_file():
                return str(candidate)
        return str(translated)

    def send_error(self, code: int, message=None, explain=None) -> None:
        if code != 404:
            return super().send_error(code, message, explain)
        page = ROOT / "404.html"
        try:
            body = page.read_bytes()
        except OSError:
            return super().send_error(code, message, explain)
        self.log_error("code 404, message %s", message or "File not found")
        self.send_response(404, "Not Found")
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1", help="bind address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8081, help="port (default: 8081)")
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), RecoveryHandler)
    print(f"Serving {ROOT} at http://{args.host}:{args.port}/ (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
