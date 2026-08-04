#!/usr/bin/env python3
"""Verify one cover or a cohesive source generation against 11blog copies."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
BLOG_ROOT = SCRIPT_PATH.parents[4]
CONFIG_PATH = BLOG_ROOT / ".env.brand-assets.local"


@dataclass(frozen=True)
class VerifyRequest:
    source: str
    target: str


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


def load_requests(parser: argparse.ArgumentParser, args: argparse.Namespace) -> list[VerifyRequest]:
    if args.batch_file:
        if args.source or args.target:
            parser.error("--batch-file cannot be combined with --source or --target")
        try:
            raw_batch = json.loads(Path(args.batch_file).read_text())
        except (OSError, json.JSONDecodeError) as error:
            parser.error(f"cannot read --batch-file: {error}")
        if not isinstance(raw_batch, list) or not raw_batch:
            parser.error("--batch-file must contain a non-empty JSON array")
        requests = []
        for item in raw_batch:
            if not isinstance(item, dict) or set(item) != {"source", "target"}:
                parser.error("each batch item must contain only source and target")
            if not all(isinstance(item[key], str) and item[key] for key in item):
                parser.error("each source and target must be a non-empty string")
            requests.append(VerifyRequest(item["source"], item["target"]))
        return requests
    if not args.source or not args.target:
        parser.error("single mode requires --source and --target")
    return [VerifyRequest(args.source, args.target)]


def resolve_beneath(root: Path, value: str) -> Path:
    candidate = Path(value).expanduser()
    return candidate.resolve() if candidate.is_absolute() else (root / candidate).resolve()


def parse_hex(value: str) -> tuple[int, int, int]:
    text = value.lstrip("#")
    return tuple(int(text[index : index + 2], 16) for index in (0, 2, 4))


def manifest_colours(path: Path) -> tuple[tuple[int, int, int], ...]:
    manifest = path.parent / "MANIFEST.md"
    if not manifest.is_file():
        raise SystemExit(f"missing source manifest: {manifest}")
    text = manifest.read_text()
    colours = []
    for name in ("Ground", "Ink", "Signal"):
        match = re.search(rf"\| {name} \| `(#?[0-9A-Fa-f]{{6}})` \|", text)
        if not match:
            raise SystemExit(f"manifest has no {name} colour: {manifest}")
        colours.append(parse_hex(match.group(1)))
    return tuple(colours)


def outside_triangle(
    path: Path,
    ground: tuple[int, int, int],
    ink: tuple[int, int, int],
    signal: tuple[int, int, int],
) -> int:
    from PIL import Image

    image = Image.open(path).convert("RGB")
    u = [ink[index] - ground[index] for index in range(3)]
    v = [signal[index] - ground[index] for index in range(3)]
    uu = sum(value * value for value in u)
    vv = sum(value * value for value in v)
    uv = sum(a * b for a, b in zip(u, v))
    determinant = uu * vv - uv * uv
    bad = 0
    for colour in set(image.get_flattened_data()):
        w = [colour[index] - ground[index] for index in range(3)]
        wu = sum(a * b for a, b in zip(w, u))
        wv = sum(a * b for a, b in zip(w, v))
        ink_weight = (wu * vv - wv * uv) / determinant
        signal_weight = (wv * uu - wu * uv) / determinant
        reconstructed = [
            ground[index] + ink_weight * u[index] + signal_weight * v[index]
            for index in range(3)
        ]
        if (
            ink_weight < -0.01
            or signal_weight < -0.01
            or ink_weight + signal_weight > 1.01
            or max(
                abs(reconstructed[index] - colour[index]) for index in range(3)
            )
            > 1.5
        ):
            bad += 1
    return bad


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(source: Path, target: Path) -> bool:
    from PIL import Image

    for path in (source, target):
        if not path.is_file():
            raise SystemExit(f"missing image: {path}")
    source_hash = digest(source)
    target_hash = digest(target)
    identical = source_hash == target_hash
    size = Image.open(target).size
    ground, ink, signal = manifest_colours(source)
    bad_colours = outside_triangle(target, ground, ink, signal)

    print(f"source={source}")
    print(f"target={target}")
    print(f"identical_bytes={str(identical).lower()}")
    print(f"size={size[0]}x{size[1]}")
    print(f"outside_palette_triangle={bad_colours}")
    print(f"sha256={target_hash}")
    return identical and size == (1200, 630) and bad_colours == 0


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source")
    parser.add_argument("--target")
    parser.add_argument("--batch-file", help="JSON array from one source generation")
    args = parser.parse_args()
    requests = load_requests(parser, args)

    config = load_config()
    brands_value = os.environ.get("ELEVENBRANDS_DIR") or config.get("ELEVENBRANDS_DIR")
    if not brands_value:
        raise SystemExit(f"ELEVENBRANDS_DIR is missing from {CONFIG_PATH}")
    brands_root = Path(brands_value).expanduser().resolve()

    try:
        import PIL  # noqa: F401
    except ModuleNotFoundError:
        external_python = brands_root / "v0/asset-generation-scripts/.venv/bin/python"
        if not external_python.is_file():
            raise SystemExit(
                f"Pillow is unavailable and 11brands Python is missing: {external_python}"
            )
        os.execv(external_python, [str(external_python), str(SCRIPT_PATH), *sys.argv[1:]])

    resolved = [
        (
            resolve_beneath(brands_root, request.source),
            resolve_beneath(BLOG_ROOT, request.target),
        )
        for request in requests
    ]
    source_generations = {source.parent for source, _ in resolved}
    if len(requests) > 1 and len(source_generations) != 1:
        parser.error("a verification batch must come from one source generation")

    print(f"covers={len(resolved)}")
    results = [verify(source, target) for source, target in resolved]
    if not all(results):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
