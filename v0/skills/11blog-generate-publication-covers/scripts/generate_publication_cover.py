#!/usr/bin/env python3
"""Generate one or a cohesive batch of covers, then copy them into 11blog."""

from __future__ import annotations

import argparse
import json
import os
import re
import shlex
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
CONFIG_PATH = BLOG_ROOT / ".env.brand-assets.local"
STYLE_BRANDS = {
    "11blog": "blog-rj11io",
    "11ai": "blog-rj11io-11ai",
}
SLUG_PATTERN = r"[a-z0-9]+(?:-[a-z0-9]+)*"


@dataclass(frozen=True)
class CoverRequest:
    publication: str
    title: str
    version: str
    filename: str
    target_assets: str


def load_config() -> dict[str, str]:
    values: dict[str, str] = {}
    if CONFIG_PATH.exists():
        for raw_line in CONFIG_PATH.read_text().splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "untitled"


def validate_request(parser: argparse.ArgumentParser, raw: dict) -> CoverRequest:
    allowed = {"publication", "title", "version", "filename", "target_assets"}
    unknown = set(raw) - allowed
    if unknown:
        parser.error(f"unknown batch fields: {', '.join(sorted(unknown))}")

    publication = raw.get("publication")
    title = raw.get("title")
    version = raw.get("version")
    target_assets = raw.get("target_assets", "assets")
    if not isinstance(publication, str) or not re.fullmatch(SLUG_PATTERN, publication):
        parser.error("each publication must be a lowercase URL-safe slug")
    if not isinstance(title, str) or not title.strip():
        parser.error("each title must be a non-empty string")
    if not isinstance(version, str) or not re.fullmatch(r"v[1-9][0-9]*", version):
        parser.error("each version must look like v1")
    if not isinstance(target_assets, str) or not target_assets:
        parser.error("each target_assets value must be a relative directory")

    filename = raw.get("filename") or f"{publication}-og-cover-{version}.png"
    if not isinstance(filename, str) or Path(filename).name != filename:
        parser.error("each filename must be one PNG filename")
    if not filename.endswith(".png"):
        parser.error("each filename must be one PNG filename")
    return CoverRequest(publication, title, version, filename, target_assets)


def load_requests(parser: argparse.ArgumentParser, args: argparse.Namespace) -> list[CoverRequest]:
    single_values = (args.publication, args.title, args.version, args.filename, args.target_assets)
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
        return [validate_request(parser, item) for item in raw_batch]

    if not args.publication or not args.title or not args.version:
        parser.error("single mode requires --publication, --title, and --version")
    return [
        validate_request(
            parser,
            {
                "publication": args.publication,
                "title": args.title,
                "version": args.version,
                "filename": args.filename,
                "target_assets": args.target_assets or "assets",
            },
        )
    ]


def destination_for(parser: argparse.ArgumentParser, request: CoverRequest) -> Path:
    publication_dir = (BLOG_ROOT / "content/publications" / request.publication).resolve()
    if not publication_dir.is_dir():
        parser.error(f"missing 11blog publication: {publication_dir}")
    target_assets = Path(request.target_assets)
    if target_assets.is_absolute() or ".." in target_assets.parts:
        parser.error("target_assets must stay inside its publication directory")
    assets_dir = (publication_dir / target_assets).resolve()
    if assets_dir != publication_dir and publication_dir not in assets_dir.parents:
        parser.error("target_assets must stay inside its publication directory")
    return assets_dir / request.filename


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication")
    parser.add_argument("--title")
    parser.add_argument("--version", help="version such as v1 or v3")
    parser.add_argument("--filename", help="destination filename override")
    parser.add_argument("--target-assets", help="publication-relative asset directory")
    parser.add_argument("--batch-file", help="JSON array of cohesive cover requests")
    parser.add_argument("--style", choices=sorted(STYLE_BRANDS), default="11blog")
    parser.add_argument("--stamp", help="generation stamp; defaults to current time")
    parser.add_argument("--dry-run", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    requests = load_requests(parser, args)

    source_slugs = [slugify(request.title) for request in requests]
    if len(source_slugs) != len(set(source_slugs)):
        parser.error("titles in one batch must produce unique source filenames")

    destinations = [destination_for(parser, request) for request in requests]
    if len(destinations) != len(set(destinations)):
        parser.error("a batch cannot target the same consumer file twice")
    existing = [path for path in destinations if path.exists()]
    if existing:
        raise SystemExit(f"refusing to overwrite consumer asset: {existing[0]}")

    config = load_config()
    brands_value = os.environ.get("ELEVENBRANDS_DIR") or config.get("ELEVENBRANDS_DIR")
    if not brands_value:
        raise SystemExit(f"ELEVENBRANDS_DIR is missing from {CONFIG_PATH}")

    brands_root = Path(brands_value).expanduser().resolve()
    scripts_dir = brands_root / "v0/asset-generation-scripts"
    generator = scripts_dir / "generate-content-og.py"
    python = scripts_dir / ".venv/bin/python"
    brand_key = STYLE_BRANDS[args.style]
    brand_file = brands_root / "v0/brands" / brand_key / "brand.md"
    for path, label in (
        (brands_root, "11brands checkout"),
        (generator, "content OG generator"),
        (python, "11brands virtual-environment Python"),
        (brand_file, f"{args.style} brand definition"),
    ):
        if not path.exists():
            raise SystemExit(f"missing {label}: {path}")

    stamp = args.stamp or datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    output_dir = brands_root / "v0/brands" / brand_key / "content-og" / f"gen-{stamp}"
    if output_dir.exists():
        raise SystemExit(f"source generation already exists: {output_dir}")

    command = [str(python), str(generator), brand_key, "--stamp", stamp]
    for request in requests:
        command.extend(("--title", request.title))
    if args.dry_run:
        print(f"generation={output_dir}")
        print(f"covers={len(requests)}")
        print(f"command={shlex.join(command)}")
        for request, destination in zip(requests, destinations):
            source = output_dir / f"{slugify(request.title)}-content-og.png"
            print(f"source={source}")
            print(f"destination={destination}")
        return
    subprocess.run(command, cwd=scripts_dir, check=True)

    sources = [
        output_dir / f"{slugify(request.title)}-content-og.png"
        for request in requests
    ]
    missing = [path for path in sources if not path.is_file()]
    if missing:
        raise SystemExit(f"generator did not create expected file: {missing[0]}")

    print(f"generation={output_dir}")
    print(f"covers={len(requests)}")
    for source, destination in zip(sources, destinations):
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        print(f"source={source}")
        print(f"destination={destination}")


if __name__ == "__main__":
    main()
