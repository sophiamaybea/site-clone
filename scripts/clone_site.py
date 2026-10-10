#!/usr/bin/env python3
"""Mirror a public page. Save HTML, images, CSS, JS, fonts, and public 3D files.

Stdlib only. Same-origin crawl. Does not log in, submit forms, or bypass a paywall.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urldefrag, urljoin, urlparse
from urllib.request import Request, urlopen

ASSET_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".ico", ".bmp",
    ".css", ".js", ".mjs", ".woff", ".woff2", ".ttf", ".otf", ".eot",
    ".glb", ".gltf", ".obj", ".fbx", ".usdz", ".hdr", ".exr", ".ktx2",
    ".basis", ".splat", ".spz", ".ply", ".stl", ".mp4", ".webm", ".mp3",
    ".wasm", ".bin", ".riv", ".sog", ".json",
}
MODEL_EXT = {".glb", ".gltf", ".obj", ".fbx", ".usdz", ".hdr", ".exr", ".ktx2", ".basis", ".splat", ".spz", ".ply", ".stl"}
SKIP_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}
UA = "site-clone/1.0 (public mirror; no login)"
URL_IN_TEXT = re.compile(r"""(?:https?:)?//[^\s"'<>]+|(?:\./|\.\./|/)[^\s"'<>]+\.(?:glb|gltf|obj|fbx|usdz|hdr|png|jpe?g|webp|svg|css|js|woff2?)""", re.I)
CSS_URL = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""", re.I)

STACK = [
    ("Next.js", (r"__NEXT_DATA__", r"/_next/", r"next/dist")),
    ("React", (r"data-reactroot", r"react-dom", r"__REACT", r"react\.production")),
    ("Vue", (r"__vue__", r"vue\.runtime", r"vue\.global")),
    ("Nuxt", (r"__NUXT__", r"/_nuxt/")),
    ("Svelte", (r"svelte-", r"__svelte")),
    ("Three.js", (r"THREE\.", r"three\.module", r"WebGLRenderer", r"from ['\"]three['\"]")),
    ("React Three Fiber", (r"@react-three/fiber", r"react-three-fiber")),
    ("PlayCanvas", (r"pc\.Application", r"playcanvas")),
    ("Babylon.js", (r"BABYLON\.", r"babylonjs")),
    ("Spline", (r"spline\.design", r"@splinetool")),
    ("Sketchfab", (r"sketchfab\.com", r"Sketchfab")),
    ("model-viewer", (r"<model-viewer", r"model-viewer")),
    ("GSAP", (r"\bgsap\b", r"ScrollTrigger")),
    ("Framer Motion", (r"framer-motion", r"framer\.com")),
    ("WebGL", (r"getContext\(\s*['\"]webgl", r"WebGLRenderingContext")),
    ("WebGPU", (r"navigator\.gpu", r"GPUCanvasContext")),
    ("Tailwind", (r"tailwind", r"--tw-")),
    ("WordPress", (r"wp-content", r"wp-includes")),
    ("Shopify", (r"cdn\.shopify\.com", r"Shopify\.theme")),
    ("Webflow", (r"webflow", r"w-nav")),
    ("Framer Sites", (r"framerusercontent\.com", r"data-framer-")),
]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.assets = []
        self.links = []
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attr = {k.lower(): v or "" for k, v in attrs}
        if tag == "title":
            self._in_title = True
        for key in ("src", "href", "poster", "data-src"):
            if attr.get(key):
                self._keep(tag, key, attr[key])
        srcset = attr.get("srcset") or ""
        for part in srcset.split(","):
            url = part.strip().split(" ")[0]
            if url:
                self._keep(tag, "srcset", url)
        if tag == "a" and attr.get("href"):
            self.links.append(attr["href"])

    def handle_data(self, data):
        if self._in_title and not self.title:
            self.title = data.strip()

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def _keep(self, tag, key, url):
        self.assets.append({"tag": tag, "attr": key, "url": url})


def origin(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def same_origin(seed: str, url: str) -> bool:
    return urlparse(url).netloc == urlparse(seed).netloc and urlparse(url).scheme in {"http", "https"}


def safe_name(url: str, fallback: str) -> str:
    path = urlparse(url).path
    name = Path(path).name or fallback
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)[:120]
    digest = hashlib.sha1(url.encode()).hexdigest()[:8]
    return f"{digest}-{name}"


def fetch(url: str, timeout: int) -> tuple[bytes, str, dict]:
    req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urlopen(req, timeout=timeout) as resp:
        body = resp.read()
        headers = {k.lower(): v for k, v in resp.headers.items()}
        final = resp.geturl()
    return body, final, headers


def looks_like_asset(url: str) -> bool:
    path = urlparse(url).path.lower()
    return Path(path).suffix in ASSET_EXT


def extract_urls(text: str, base: str) -> list[str]:
    found = []
    for match in URL_IN_TEXT.findall(text):
        found.append(urljoin(base, match))
    for match in CSS_URL.findall(text):
        if not match.startswith("data:"):
            found.append(urljoin(base, match))
    return found


def detect_stack(blobs: list[str], headers: dict) -> list[str]:
    hay = "\n".join(blobs)
    server = headers.get("server", "") + " " + headers.get("x-powered-by", "")
    hits = []
    for name, patterns in STACK:
        if any(re.search(pat, hay, re.I) for pat in patterns):
            hits.append(name)
    if server.strip():
        hits.append(f"server header: {server.strip()[:80]}")
    return hits


def write_docs(out: Path, seed: str, pages: list[dict], assets: list[dict], failed: list[dict], models: list[dict], stack: list[str]) -> None:
    manifest = {
        "seed": seed,
        "pages": pages,
        "assets": assets,
        "models": models,
        "failed": failed,
        "stack": stack,
    }
    (out / "MANIFEST.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    tech = ["# Technology inventory", "", f"Seed: {seed}", "", "Detected only from saved source and response headers.", ""]
    tech += [f"- {item}" for item in stack] or ["- No catalog signature matched."]
    tech += ["", "Do not treat this as a license to republish the brand."]
    (out / "TECH.md").write_text("\n".join(tech) + "\n", encoding="utf-8")
    scene = ["# Scene", "", f"Seed: {seed}", ""]
    if models:
        scene.append("Public model files saved:")
        scene += [f"- {item['local']} ({item['url']})" for item in models]
    else:
        scene.append("No public glTF, GLB, OBJ, FBX, USDZ, HDR, or splat file was referenced.")
        scene.append("Run scripts/generate_standin.py --out <this folder>/scene to write an original stand-in.")
    (out / "SCENE.md").write_text("\n".join(scene) + "\n", encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Mirror a public page")
    parser.add_argument("url", nargs="?", help="Public seed URL")
    parser.add_argument("--out", default="site-clone-out")
    parser.add_argument("--depth", type=int, default=0)
    parser.add_argument("--max-pages", type=int, default=12)
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--html", help="Saved SPA HTML to inventory instead of fetching")
    args = parser.parse_args(argv)
    if not args.url and not args.html:
        print("pass a url or --html", file=sys.stderr)
        return 2
    seed = args.url or "https://local.invalid/spa"
    parsed = urlparse(seed)
    if args.url and parsed.scheme not in {"http", "https"}:
        print("only http and https seeds", file=sys.stderr)
        return 2
    out = Path(args.out)
    (out / "assets").mkdir(parents=True, exist_ok=True)
    pages, assets, failed, models = [], [], [], []
    seen_pages, seen_assets = set(), set()
    queue = [(seed, 0)] if args.url else []
    blobs = []
    headers: dict = {}

    if args.html:
        html = Path(args.html).read_text(encoding="utf-8", errors="replace")
        (out / "index.html").write_text(html, encoding="utf-8")
        pages.append({"url": seed, "local": "index.html", "title": "", "from": "--html"})
        blobs.append(html)

    while queue and len(pages) < args.max_pages:
        url, depth = queue.pop(0)
        url, _frag = urldefrag(url)
        if url in seen_pages or not same_origin(seed, url):
            continue
        seen_pages.add(url)
        try:
            body, final, headers = fetch(url, args.timeout)
        except (HTTPError, URLError, TimeoutError) as exc:
            failed.append({"url": url, "error": str(exc)})
            continue
        text = body.decode("utf-8", errors="replace")
        local = "index.html" if not pages else f"pages/{len(pages)}.html"
        dest = out / local
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(text, encoding="utf-8")
        parser_html = PageParser()
        parser_html.feed(text)
        pages.append({"url": final, "local": local, "title": parser_html.title})
        blobs.append(text[:200000])
        candidates = [urljoin(final, item["url"]) for item in parser_html.assets]
        candidates += extract_urls(text, final)
        # Bounded recursive asset discovery: bundled WebGL runtimes often hold the GLB URLs.
        for asset_url in candidates:
            if len(seen_assets) >= 350:
                break
            asset_url, _frag = urldefrag(asset_url)
            if urlparse(asset_url).scheme in SKIP_SCHEMES or asset_url in seen_assets:
                continue
            if not looks_like_asset(asset_url):
                continue
            seen_assets.add(asset_url)
            try:
                data, final_asset, asset_headers = fetch(asset_url, args.timeout)
            except (HTTPError, URLError, TimeoutError) as exc:
                failed.append({"url": asset_url, "error": str(exc)})
                continue
            name = safe_name(final_asset, "asset.bin")
            (out / "assets" / name).write_bytes(data)
            record = {"url": final_asset, "local": f"assets/{name}", "bytes": len(data), "type": asset_headers.get("content-type", "")}
            assets.append(record)
            if Path(urlparse(final_asset).path).suffix.lower() in MODEL_EXT:
                models.append(record)
            if Path(name).suffix.lower() in {".css", ".js", ".mjs", ".gltf", ".json"}:
                source = data.decode("utf-8", errors="replace")
                # Minified WebGL engines can exceed 1 MB: avoid cutting off stack signatures.
                blobs.append(source[:2000000])
                # CSS AND bundled JS may contain scene URLs loaded only after scrolling.
                for nested in extract_urls(source, final_asset):
                    if looks_like_asset(nested) and urlparse(nested).scheme in {"http", "https"}:
                        candidates.append(nested)
        if depth < args.depth:
            for href in parser_html.links:
                nxt = urljoin(final, href)
                if same_origin(seed, nxt) and not looks_like_asset(nxt):
                    queue.append((nxt, depth + 1))

    stack = detect_stack(blobs, headers)
    write_docs(out, seed, pages, assets, failed, models, stack)
    print(json.dumps({"out": str(out), "pages": len(pages), "assets": len(assets), "models": len(models), "failed": len(failed), "stack": stack}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
