#!/usr/bin/env python3
"""Verify one or a cohesive batch of post covers against one 11brands run."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
PUBLICATION_VERIFIER = (
    BLOG_ROOT
    / "v0/skills/11blog-verify-publication-covers/scripts/verify_publication_cover.py"
)
SLUG_PATTERN = r"[a-z0-9]+(?:-[a-z0-9]+)*"


def post_target(publication: str, post: str, filename: str) -> Path:
    publication_dir = BLOG_ROOT / "content/publications" / publication
    posts_dir = publication_dir / "posts"
    file_post = posts_dir / f"{post}.ts"
    module_post = posts_dir / post / "index.ts"
    matches = [path for path in (file_post, module_post) if path.is_file()]
    if not matches:
        raise SystemExit(f"post does not exist: {file_post} or {module_post}")
    if len(matches) > 1:
        raise SystemExit(f"ambiguous post has both supported shapes: {post}")
    assets = (
        posts_dir / post / "assets"
        if matches[0] == module_post
        else publication_dir / "assets"
    )
    return assets / filename


def validate_item(parser: argparse.ArgumentParser, raw: dict) -> dict[str, str]:
    allowed = {"publication", "post", "version", "source", "filename"}
    unknown = set(raw) - allowed
    if unknown:
        parser.error(f"unknown batch fields: {', '.join(sorted(unknown))}")
    publication = raw.get("publication")
    post = raw.get("post")
    version = raw.get("version")
    source = raw.get("source")
    if not isinstance(publication, str) or not re.fullmatch(SLUG_PATTERN, publication):
        parser.error("each publication must be a lowercase URL-safe slug")
    if not isinstance(post, str) or not re.fullmatch(SLUG_PATTERN, post):
        parser.error("each post must be a lowercase URL-safe slug")
    if not isinstance(version, str) or not re.fullmatch(r"v[1-9][0-9]*", version):
        parser.error("each version must look like v1")
    if not isinstance(source, str) or not source:
        parser.error("each source must be a non-empty path")
    filename = raw.get("filename") or f"{post}-og-cover-{version}.png"
    if not isinstance(filename, str) or Path(filename).name != filename:
        parser.error("each filename must be one PNG filename")
    if not filename.endswith(".png"):
        parser.error("each filename must be one PNG filename")
    target = post_target(publication, post, filename)
    return {"source": source, "target": str(target.relative_to(BLOG_ROOT))}


def load_items(parser: argparse.ArgumentParser, args: argparse.Namespace) -> list[dict[str, str]]:
    single_values = (args.publication, args.post, args.version, args.source, args.filename)
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

    if not args.publication or not args.post or not args.version or not args.source:
        parser.error("single mode requires --publication, --post, --version, and --source")
    return [
        validate_item(
            parser,
            {
                "publication": args.publication,
                "post": args.post,
                "version": args.version,
                "source": args.source,
                "filename": args.filename,
            },
        )
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication")
    parser.add_argument("--post", help="post slug and content filename")
    parser.add_argument("--version", help="version such as v1 or v3")
    parser.add_argument("--source", help="11brands-relative source PNG")
    parser.add_argument("--filename", help="consumer filename override")
    parser.add_argument("--batch-file", help="JSON array from one source generation")
    parser.add_argument("--dry-run", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    items = load_items(parser, args)

    if args.dry_run:
        print(json.dumps(items, indent=2))
        return
    if not PUBLICATION_VERIFIER.is_file():
        raise SystemExit(f"missing publication cover verifier: {PUBLICATION_VERIFIER}")
    with tempfile.TemporaryDirectory(prefix="11blog-post-cover-checks-") as temporary:
        batch_path = Path(temporary) / "batch.json"
        batch_path.write_text(json.dumps(items, indent=2) + "\n")
        result = subprocess.run(
            [
                sys.executable,
                str(PUBLICATION_VERIFIER),
                "--batch-file",
                str(batch_path),
            ],
            cwd=BLOG_ROOT,
            check=False,
        )
        if result.returncode:
            raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
