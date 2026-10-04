#!/usr/bin/env python3
"""Write a DESIGN-DNA.json skeleton. Fill fields from measurement, not from memory."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

MODES = {"transfer", "rebuild", "owned", "inspect"}
CLASSES = {"static", "editorial", "app", "wild", ""}


def skeleton(url: str, mode: str, site_class: str) -> dict:
    return {
        "meta": {
            "url": url,
            "mode": mode,
            "class": site_class,
            "owned": mode == "owned",
            "note": "Blank means unmeasured. Do not guess.",
        },
        "viewports": {
            "390": {"reflow": "", "pinned": "", "hidden": ""},
            "768": {"reflow": "", "pinned": "", "hidden": ""},
            "1440": {"reflow": "", "pinned": "", "hidden": ""},
        },
        "color": {"background": "", "text": "", "accent": "", "border": ""},
        "type": {
            "display": {"family": "", "size": "", "weight": "", "lineHeight": "", "letterSpacing": ""},
            "body": {"family": "", "size": "", "weight": "", "lineHeight": "", "letterSpacing": ""},
        },
        "space": {"sectionPadding": "", "stackGap": "", "maxWidth": "", "columns": ""},
        "layout": [],
        "motion": [],
        "interaction": [],
        "assets": {"structural": [], "brand_excluded": []},
        "stack": [],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Write a DESIGN-DNA.json skeleton")
    parser.add_argument("--url", required=True)
    parser.add_argument("--mode", default="transfer", choices=sorted(MODES))
    parser.add_argument("--class", dest="site_class", default="", choices=sorted(CLASSES))
    parser.add_argument("--out", required=True)
    args = parser.parse_args(argv)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    data = skeleton(args.url, args.mode, args.site_class)
    out.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"out": str(out), "mode": args.mode, "class": args.site_class}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
