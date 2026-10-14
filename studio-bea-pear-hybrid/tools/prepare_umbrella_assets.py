#!/usr/bin/env python3
"""Prepare ten user-supplied umbrella illustrations as true transparent sprites.

The first file was already a transparent PNG; the remaining nine files were
JPEGs with white paper backgrounds, so extract only the corner-connected
near-white field. Preserve enclosed white umbrella fabric, coats, delicate ink
lines and intentional paper texture within the figures.
"""
from pathlib import Path
from urllib.request import urlopen, Request
from io import BytesIO
import cv2
import numpy as np
from PIL import Image

DIR = Path(__file__).resolve().parent.parent / "assets" / "umbrellas"
DIR.mkdir(parents=True, exist_ok=True)
SOURCES = {
    "woman-white": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/4b02d324-bb0b-4ba6-822c-e57cfd6d3b51.png",
    "man-back-black": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/d6feddcb-b579-4768-a46c-28c121c99c34.jpg",
    "woman-front-black": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/fddacd76-8b87-417c-9c98-aafb5f86e35f.jpg",
    "woman-green": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/6a493e3c-121f-4dde-b2d0-85e8e6f8dc1f.jpg",
    "man-green-back": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/9e5ed99f-6f46-4f4a-99ae-6f3bf32f9928.jpg",
    "woman-red": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/9a03aeb6-a9e5-4cf4-be3a-14e880045605.jpg",
    "woman-blue-back": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/6ccc7218-bc4e-48ad-936e-dc747b2b4009.jpg",
    "man-side-grey": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/47e322ad-cc0e-445a-8154-34ced91a489a.jpg",
    "woman-dark-side": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/40f799a8-95ce-4aac-8405-9193adac0206.jpg",
    "man-front-black": "https://d2ol7oe51mr4n9.cloudfront.net/user_3G5i6uGLONMvnj9pHognsDGkDcQ/07c2a11e-23cf-458b-8423-af073ef3905a.jpg",
}
for name, url in SOURCES.items():
    print("Fetching supplied image:", name, flush=True)
    req = Request(url, headers={"User-Agent": "StudioBeaSophia/1.0"})
    with urlopen(req, timeout=45) as response:
        raw = response.read()
    original = Image.open(BytesIO(raw)).convert("RGBA")
    pixels = np.asarray(original).copy()
    if name != "woman-white":
        rgb = pixels[:, :, :3]
        lo = rgb.min(2).astype(np.float32)
        hi = rgb.max(2).astype(np.float32)
        white = ((lo > 234) & ((hi - lo) < 22)).astype(np.uint8)
        _, labels, _, _ = cv2.connectedComponentsWithStats(white, 8)
        border_labels = np.unique(
            np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1]))
        )
        outside = np.isin(labels, border_labels[border_labels != 0])
        outside = cv2.GaussianBlur(outside.astype(np.float32), (3, 3), .5)
        pixels[:, :, 3] = np.clip(255 * (1 - outside), 0, 255).astype(np.uint8)
    cutout = Image.fromarray(pixels, "RGBA")
    bounds = cutout.getbbox()
    if not bounds:
        raise ValueError("Entire sprite has been erased: " + name)
    cutout = cutout.crop(bounds)
    cutout.thumbnail((700, 1140), Image.Resampling.LANCZOS)
    output = DIR / (name + ".webp")
    cutout.save(output, "WEBP", quality=88, method=6)
    print(name, cutout.size, output.stat().st_size, flush=True)
print("Processed", len(SOURCES), "individual transparent illustrations.")
