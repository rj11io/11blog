#!/usr/bin/env python3
"""Generate one post cover through the 11blog-to-11brands bridge."""

from __future__ import annotations

import argparse
import re
import shlex
import subprocess
import sys
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
PUBLICATION_GENERATOR = (
    BLOG_ROOT
    / "v0/skills/11blog-generate-publication-covers/scripts/generate_publication_cover.py"
)


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


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication", required=True)
    parser.add_argument("--post", required=True, help="post slug and content filename")
    parser.add_argument("--title", required=True)
    parser.add_argument("--style", choices=("11ai", "11blog"), default="11blog")
    parser.add_argument("--version", required=True, help="version such as v1 or v3")
    parser.add_argument("--filename", help="destination filename override")
    parser.add_argument("--stamp", help="generation stamp; defaults to current time")
    parser.add_argument("--dry-run", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    slug_pattern = r"[a-z0-9]+(?:-[a-z0-9]+)*"
    if not re.fullmatch(slug_pattern, args.publication):
        parser.error("--publication must be a lowercase URL-safe slug")
    if not re.fullmatch(slug_pattern, args.post):
        parser.error("--post must be a lowercase URL-safe slug")
    if not re.fullmatch(r"v[1-9][0-9]*", args.version):
        parser.error("--version must look like v1")

    target_assets = post_assets(args.publication, args.post)
    filename = args.filename or f"{args.post}-og-cover-{args.version}.png"
    command = [
        sys.executable,
        str(PUBLICATION_GENERATOR),
        "--publication",
        args.publication,
        "--title",
        args.title,
        "--style",
        args.style,
        "--version",
        args.version,
        "--filename",
        filename,
        "--target-assets",
        target_assets,
    ]
    if args.stamp:
        command.extend(("--stamp", args.stamp))

    if args.dry_run:
        print(f"target_assets={target_assets}")
        print(f"filename={filename}")
        print(f"command={shlex.join(command)}")
        return

    if not PUBLICATION_GENERATOR.is_file():
        raise SystemExit(f"missing publication cover bridge: {PUBLICATION_GENERATOR}")
    subprocess.run(command, cwd=BLOG_ROOT, check=True)


if __name__ == "__main__":
    main()
