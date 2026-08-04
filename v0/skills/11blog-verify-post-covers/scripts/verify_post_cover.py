#!/usr/bin/env python3
"""Verify one post cover through the 11blog-to-11brands bridge."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
PUBLICATION_VERIFIER = (
    BLOG_ROOT
    / "v0/skills/11blog-verify-publication-covers/scripts/verify_publication_cover.py"
)


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
    assets = posts_dir / post / "assets" if matches[0] == module_post else publication_dir / "assets"
    return assets / filename


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication", required=True)
    parser.add_argument("--post", required=True, help="post slug and content filename")
    parser.add_argument("--version", required=True, help="version such as v1 or v3")
    parser.add_argument("--source", required=True, help="11brands-relative source PNG")
    parser.add_argument("--filename", help="consumer filename override")
    args = parser.parse_args()

    slug_pattern = r"[a-z0-9]+(?:-[a-z0-9]+)*"
    if not re.fullmatch(slug_pattern, args.publication):
        parser.error("--publication must be a lowercase URL-safe slug")
    if not re.fullmatch(slug_pattern, args.post):
        parser.error("--post must be a lowercase URL-safe slug")
    if not re.fullmatch(r"v[1-9][0-9]*", args.version):
        parser.error("--version must look like v1")

    filename = args.filename or f"{args.post}-og-cover-{args.version}.png"
    if Path(filename).name != filename or not filename.endswith(".png"):
        parser.error("--filename must be one PNG filename")
    target = post_target(args.publication, args.post, filename)
    if not PUBLICATION_VERIFIER.is_file():
        raise SystemExit(f"missing publication cover verifier: {PUBLICATION_VERIFIER}")

    subprocess.run(
        [
            sys.executable,
            str(PUBLICATION_VERIFIER),
            "--source",
            args.source,
            "--target",
            str(target.relative_to(BLOG_ROOT)),
        ],
        cwd=BLOG_ROOT,
        check=True,
    )


if __name__ == "__main__":
    main()
