"""One brand's Open Graph card and its complete favicon package.

Adds intel.rj11.io on 2026-08-02, the third sub-brand after www.rj11.io in
orange and ai.rj11.io in inverted green. Dark ground, red signal.

Why this generator exists
-------------------------

The sub-brand cards were previously made by copying the card generator and
editing its colour constants, which left no record of which colours produced
which file. This takes the brand as data instead: a name, a domain, and three
colours. Adding a fourth sub-brand is a new entry in BRANDS, not a new script.

It draws the same card the post covers use, at the same geometry, so a sub-brand
card and a post card are the same object with different text. That was verified
rather than assumed: rendering "blog.rj11.io" through the v1 generator
reproduces 11blog-favicon-style-og-v4.png byte for byte.

The one difference from a post card is the row. A post card puts its title
between two squares and the domain above the mark as a masthead. A sub-brand
card is *about* the domain, so the domain takes the title row and there is no
masthead; repeating it would be the only thing on the card said twice.

Recolouring the mark
--------------------

The mark master is white on near-black with a green square. Three colours have
to change at once, so each pixel is sorted into glyph or square by hue rather
than by position: the square is the only part of the artwork where green leads,
at any opacity, including its anti-aliased edge. Coverage is read from the
channel that carries the colour, which keeps the edges smooth instead of
stair-stepping them.

Run with a Python that has Pillow installed:

    python3 -m venv .venv
    .venv/bin/pip install Pillow
    .venv/bin/python v0/branding/generators/brand-og-and-favicons-v1.py
"""

from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BRANDING_DIR = Path(__file__).resolve().parents[1]
GENERATOR_V1 = Path(__file__).resolve().parent / "blog-platform-og-covers-v1.py"
MARK_PATH = BRANDING_DIR / "images/logos/11blog-mark-xl-dot-centered.png"
OG_DIR = BRANDING_DIR / "images/og"
FAVICON_DIR = BRANDING_DIR / "images/favicons"

# Card geometry, all from the v1 generator, with the second square added.
SQUARE = 18
GAP = 20
MAX_ROW = 1040
TITLE_TOP = 477
TITLE_MIDDLE = 486
KEYWORD_MIDDLE = 574
MARK_ORIGIN = (425, 42)
MARK_SIZE = 350
MARK_CROP = (247, 247, 1007, 1007)

# Favicon geometry, measured off the two existing packages so a new one lands in
# the same place: the artwork scaled to fit a 462 by 368 box inside 512, which
# leaves roughly 25 pixels either side and 72 above and below.
ICON_MASTER = 512
ICON_BOX = (462, 368)
ICON_SIZES = [512, 192, 180, 32, 16]
ICO_SIZES = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]


def load_v1():
    spec = importlib.util.spec_from_file_location("og_covers_v1", GENERATOR_V1)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"could not load {GENERATOR_V1}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


v1 = load_v1()


class Brand:
    def __init__(self, key, domain, background, foreground, accent, note):
        self.key = key
        self.domain = domain
        self.background = background
        self.foreground = foreground
        self.accent = accent
        self.note = note


BRANDS = [
    Brand(
        key="intel-rj11io",
        domain="intel.rj11.io",
        background=(10, 10, 10),
        foreground=(250, 250, 250),
        # A clear red rather than a deep one. The sibling sub-brand is orange at
        # #F97316, and at 16 pixels a dark crimson would read as brown beside
        # it; this stays separable at favicon size. Measures 5.26:1 against the
        # ground, comfortably past the 3:1 a non-text graphic needs.
        accent=(239, 68, 68),
        note="Dark intel sub-brand OG with a red signal",
    ),
]


def recolour_mark(foreground, accent):
    """The mark master, repainted in a brand's colours, as RGBA.

    Returns a transparent image so the same mark can sit on any ground. Pixels
    are sorted by hue: green leading means the signal square, anything else
    bright means the glyph.
    """
    source = Image.open(MARK_PATH).convert("RGB")
    pixels = source.load()
    mark = Image.new("RGBA", source.size, (0, 0, 0, 0))
    out = mark.load()

    for y in range(source.height):
        for x in range(source.width):
            red, green, blue = pixels[x, y]
            brightest = max(red, green, blue)
            if brightest <= 12:
                continue

            is_square = green > red + 18 and green > blue + 8
            if is_square:
                # Full strength square reads 200 on the green channel.
                alpha = min(255, round(green * 255 / 200))
                out[x, y] = (*accent, alpha)
            else:
                alpha = min(255, round(brightest * 255 / 250))
                out[x, y] = (*foreground, alpha)

    return mark


def og_mark(mark):
    return mark.crop(MARK_CROP).resize(
        (MARK_SIZE, MARK_SIZE), Image.Resampling.LANCZOS
    )


def font(size):
    return ImageFont.truetype(v1.SANS_MONO, size)


def text_width(draw, value, size):
    box = draw.textbbox((0, 0), value, font=font(size))
    return box[2] - box[0]


def render_og(brand: Brand, mark, destination: Path) -> None:
    image = Image.new("RGB", (v1.WIDTH, v1.HEIGHT), brand.background)
    draw = ImageDraw.Draw(image)
    image.paste(og_mark(mark), MARK_ORIGIN, og_mark(mark))

    fixed = SQUARE + GAP + GAP + SQUARE
    for size in range(42, 27, -1):
        width = text_width(draw, brand.domain, size)
        if fixed + width <= MAX_ROW:
            break

    row_start = round(v1.WIDTH / 2 - (fixed + width) / 2)
    draw.rectangle(
        (row_start, TITLE_TOP, row_start + SQUARE - 1, TITLE_TOP + SQUARE - 1),
        fill=brand.accent,
    )
    text_left = row_start + SQUARE + GAP
    draw.text(
        (text_left, TITLE_MIDDLE),
        brand.domain,
        font=font(size),
        fill=brand.foreground,
        anchor="lm",
    )
    right = text_left + width + GAP
    draw.rectangle(
        (right, TITLE_TOP, right + SQUARE - 1, TITLE_TOP + SQUARE - 1),
        fill=brand.accent,
    )

    draw.text(
        (v1.WIDTH / 2, KEYWORD_MIDDLE),
        v1.KEYWORDS,
        font=font(15),
        fill=v1.MUTED,
        anchor="mm",
    )

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)


def render_favicons(brand: Brand, mark, directory: Path) -> list[Path]:
    """The icon at 512, then every smaller size resampled down from it.

    Resampling from one master rather than redrawing per size is what keeps the
    16 pixel icon recognisably the same shape as the 512.
    """
    artwork = mark.crop(mark.getbbox())
    scale = min(ICON_BOX[0] / artwork.width, ICON_BOX[1] / artwork.height)
    scaled = artwork.resize(
        (round(artwork.width * scale), round(artwork.height * scale)),
        Image.Resampling.LANCZOS,
    )

    master = Image.new("RGB", (ICON_MASTER, ICON_MASTER), brand.background)
    master.paste(
        scaled,
        (
            (ICON_MASTER - scaled.width) // 2,
            (ICON_MASTER - scaled.height) // 2,
        ),
        scaled,
    )

    directory.mkdir(parents=True, exist_ok=True)
    names = {
        512: "icon-512.png",
        192: "icon-192.png",
        180: "apple-touch-icon.png",
        32: "favicon-32x32.png",
        16: "favicon-16x16.png",
    }

    written = []
    for size in ICON_SIZES:
        path = directory / names[size]
        resized = (
            master
            if size == ICON_MASTER
            else master.resize((size, size), Image.Resampling.LANCZOS)
        )
        palettise(resized).save(path, optimize=True)
        written.append(path)

    ico = directory / "favicon.ico"
    palettise(master).save(ico, format="ICO", sizes=ICO_SIZES)
    written.append(ico)
    return written


def palettise(image: Image.Image) -> Image.Image:
    """Down to a 256 colour palette, which for this artwork loses nothing.

    Three flat colours and their anti-aliased edges never reach 256 distinct
    values, so the palette is lossless here and was checked to be: every channel
    of every pixel is unchanged. It is worth doing because a favicon is fetched
    on every visit, and it takes about a third off each file.
    """
    return image.quantize(
        colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE
    )


def main() -> None:
    for brand in BRANDS:
        mark = recolour_mark(brand.foreground, brand.accent)

        og = OG_DIR / f"{brand.key}-favicon-style-red-og-v1.png"
        render_og(brand, mark, og)
        print(og)

        for path in render_favicons(brand, mark, FAVICON_DIR / f"{brand.key}-v1"):
            print(path)


if __name__ == "__main__":
    main()
