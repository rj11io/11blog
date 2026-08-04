#!/usr/bin/env python3
"""Generate one cover in 11brands, then copy it into 11blog."""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
from datetime import datetime
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
CONFIG_PATH = BLOG_ROOT / ".env.brand-assets.local"
STYLE_BRANDS = {
    "11blog": "blog-rj11io",
    "11ai": "blog-rj11io-11ai",
}


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


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--style", choices=sorted(STYLE_BRANDS), default="11blog")
    parser.add_argument("--version", required=True, help="version such as v1 or v3")
    parser.add_argument("--filename", help="destination filename override")
    parser.add_argument(
        "--target-assets",
        default="assets",
        help="publication-relative asset directory; defaults to assets",
    )
    parser.add_argument("--stamp", help="generation stamp; defaults to current time")
    args = parser.parse_args()

    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", args.publication):
        parser.error("--publication must be a lowercase URL-safe slug")
    if not re.fullmatch(r"v[1-9][0-9]*", args.version):
        parser.error("--version must look like v1")

    config = load_config()
    brands_value = os.environ.get("ELEVENBRANDS_DIR") or config.get(
        "ELEVENBRANDS_DIR"
    )
    if not brands_value:
        raise SystemExit(f"ELEVENBRANDS_DIR is missing from {CONFIG_PATH}")

    brands_root = Path(brands_value).expanduser().resolve()
    scripts_dir = brands_root / "v0/asset-generation-scripts"
    generator = scripts_dir / "generate-content-og.py"
    python = scripts_dir / ".venv/bin/python"
    brand_key = STYLE_BRANDS[args.style]
    brand_file = brands_root / f"v0/brands/{brand_key}/brand.md"
    publication_dir = BLOG_ROOT / f"content/publications/{args.publication}"
    target_assets = Path(args.target_assets)
    if target_assets.is_absolute() or ".." in target_assets.parts:
        parser.error("--target-assets must stay inside the publication directory")
    assets_dir = (publication_dir / target_assets).resolve()
    if assets_dir != publication_dir and publication_dir not in assets_dir.parents:
        parser.error("--target-assets must stay inside the publication directory")

    for path, label in (
        (brands_root, "11brands checkout"),
        (generator, "content OG generator"),
        (python, "11brands virtual-environment Python"),
        (brand_file, f"{args.style} brand definition"),
        (publication_dir, "11blog publication"),
    ):
        if not path.exists():
            raise SystemExit(f"missing {label}: {path}")

    stamp = args.stamp or datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    output_dir = brands_root / f"v0/brands/{brand_key}/content-og/gen-{stamp}"
    if output_dir.exists():
        raise SystemExit(f"source generation already exists: {output_dir}")

    filename = args.filename or f"{args.publication}-og-cover-{args.version}.png"
    if Path(filename).name != filename or not filename.endswith(".png"):
        parser.error("--filename must be one PNG filename")
    destination = assets_dir / filename
    if destination.exists():
        raise SystemExit(f"refusing to overwrite consumer asset: {destination}")

    subprocess.run(
        [
            str(python),
            str(generator),
            brand_key,
            "--title",
            args.title,
            "--stamp",
            stamp,
        ],
        cwd=scripts_dir,
        check=True,
    )

    source = output_dir / f"{slugify(args.title)}-content-og.png"
    if not source.is_file():
        raise SystemExit(f"generator did not create expected file: {source}")

    assets_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    print(f"source={source}")
    print(f"destination={destination}")


if __name__ == "__main__":
    main()
