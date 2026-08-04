#!/usr/bin/env python3
"""Generate one or a cohesive batch of post covers through 11brands."""

from __future__ import annotations

import argparse
import json
import re
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
PUBLICATION_GENERATOR = (
    BLOG_ROOT
    / "v0/skills/11blog-generate-publication-covers/scripts/generate_publication_cover.py"
)
SLUG_PATTERN = r"[a-z0-9]+(?:-[a-z0-9]+)*"


def post_assets(publication: str, post: str) -> str:
    posts_dir = BLOG_ROOT / "content/publications" / publication / "posts"
    file_post = posts_dir / f"{post}.ts"
    module_post = posts_dir / post / "index.ts"
    matches = [path for path in (file_post, module_post) if path.is_file()]
    if not matches:
        raise SystemExit(f"post does not exist: {file_post} or {module_post}")
    if len(matches) > 1:
        raise SystemExit(f"ambiguous post has both supported shapes: {post}")
    return f"posts/{post}/assets" if matches[0] == module_post else "assets"


def validate_item(parser: argparse.ArgumentParser, raw: dict) -> dict[str, str]:
    allowed = {"publication", "post", "title", "version", "filename"}
    unknown = set(raw) - allowed
    if unknown:
        parser.error(f"unknown batch fields: {', '.join(sorted(unknown))}")
    publication = raw.get("publication")
    post = raw.get("post")
    title = raw.get("title")
    version = raw.get("version")
    if not isinstance(publication, str) or not re.fullmatch(SLUG_PATTERN, publication):
        parser.error("each publication must be a lowercase URL-safe slug")
    if not isinstance(post, str) or not re.fullmatch(SLUG_PATTERN, post):
        parser.error("each post must be a lowercase URL-safe slug")
    if not isinstance(title, str) or not title.strip():
        parser.error("each title must be a non-empty string")
    if not isinstance(version, str) or not re.fullmatch(r"v[1-9][0-9]*", version):
        parser.error("each version must look like v1")
    filename = raw.get("filename") or f"{post}-og-cover-{version}.png"
    if not isinstance(filename, str) or Path(filename).name != filename:
        parser.error("each filename must be one PNG filename")
    if not filename.endswith(".png"):
        parser.error("each filename must be one PNG filename")
    return {
        "publication": publication,
        "title": title,
        "version": version,
        "filename": filename,
        "target_assets": post_assets(publication, post),
    }


def load_items(parser: argparse.ArgumentParser, args: argparse.Namespace) -> list[dict[str, str]]:
    single_values = (args.publication, args.post, args.title, args.version, args.filename)
    if args.batch_file:
        if any(value is not None for value in single_values):
            parser.error("--batch-file cannot be combined with single-cover arguments")
        try:
            raw_batch = json.loads(Path(args.batch_file).read_text())
        except (OSError, json.JSONDecodeError) as error:
            parser.error(f"cannot read --batch-file: {error}")
        if not isinstance(raw_batch, list) or not raw_batch:
            parser.error("--batch-file must contain a non-empty JSON array")
        if not all(isinstance(item, dict) for item in raw_batch):
            parser.error("every batch item must be a JSON object")
        return [validate_item(parser, item) for item in raw_batch]

    if not args.publication or not args.post or not args.title or not args.version:
        parser.error("single mode requires --publication, --post, --title, and --version")
    return [
        validate_item(
            parser,
            {
                "publication": args.publication,
                "post": args.post,
                "title": args.title,
                "version": args.version,
                "filename": args.filename,
            },
        )
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication")
    parser.add_argument("--post", help="post slug and content filename")
    parser.add_argument("--title")
    parser.add_argument("--version", help="version such as v1 or v3")
    parser.add_argument("--filename", help="destination filename override")
    parser.add_argument("--batch-file", help="JSON array of cohesive post requests")
    parser.add_argument("--style", choices=("11ai", "11blog"), default="11blog")
    parser.add_argument("--stamp", help="generation stamp; defaults to current time")
    parser.add_argument("--dry-run", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    items = load_items(parser, args)

    command = [
        sys.executable,
        str(PUBLICATION_GENERATOR),
        "--batch-file",
        "<temporary-batch-file>",
        "--style",
        args.style,
    ]
    if args.stamp:
        command.extend(("--stamp", args.stamp))
    if args.dry_run:
        print(json.dumps(items, indent=2))
        print(f"command={shlex.join(command)}")
        return

    if not PUBLICATION_GENERATOR.is_file():
        raise SystemExit(f"missing publication cover bridge: {PUBLICATION_GENERATOR}")
    with tempfile.TemporaryDirectory(prefix="11blog-post-covers-") as temporary:
        batch_path = Path(temporary) / "batch.json"
        batch_path.write_text(json.dumps(items, indent=2) + "\n")
        command[command.index("<temporary-batch-file>")] = str(batch_path)
        result = subprocess.run(command, cwd=BLOG_ROOT, check=False)
        if result.returncode:
            raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
