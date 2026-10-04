#!/usr/bin/env python3
"""Pixel-diff two screenshots. Prints mismatch ratio. Does not decide the mode bar."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops


def diff(original: Path, clone: Path, out: Path | None) -> dict:
    a = Image.open(original).convert("RGB")
    b = Image.open(clone).convert("RGB")
    if a.size != b.size:
        b = b.resize(a.size, Image.Resampling.LANCZOS)
    delta = ImageChops.difference(a, b)
    hist = delta.histogram()
    total = a.size[0] * a.size[1]
    per_channel = []
    for channel in range(3):
        bins = hist[channel * 256 : (channel + 1) * 256]
        per_channel.append(sum(bins[1:]) / total)
    ratio = max(per_channel)
    w, h = a.size
    quadrants = {}
    boxes = {
        "nw": (0, 0, w // 2, h // 2),
        "ne": (w // 2, 0, w, h // 2),
        "sw": (0, h // 2, w // 2, h),
        "se": (w // 2, h // 2, w, h),
    }
    worst = "nw"
    worst_ratio = -1.0
    for name, box in boxes.items():
        crop = delta.crop(box)
        ch = crop.histogram()
        pixels = max(1, (box[2] - box[0]) * (box[3] - box[1]))
        q = max(sum(ch[c * 256 + 1 : (c + 1) * 256]) / pixels for c in range(3))
        quadrants[name] = round(q, 4)
        if q > worst_ratio:
            worst_ratio = q
            worst = name
    if out:
        out.parent.mkdir(parents=True, exist_ok=True)
        delta.save(out)
    return {
        "mismatch": round(ratio, 4),
        "worst_quadrant": worst,
        "quadrants": quadrants,
        "size": [w, h],
        "diff": str(out) if out else None,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Pixel-diff two screenshots")
    parser.add_argument("original")
    parser.add_argument("clone")
    parser.add_argument("--out")
    args = parser.parse_args(argv)
    result = diff(Path(args.original), Path(args.clone), Path(args.out) if args.out else None)
    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
