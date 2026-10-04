#!/usr/bin/env python3
"""Find 3D files already saved in a site-clone folder."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
EXTS = {".glb", ".gltf", ".obj", ".fbx", ".usdz", ".hdr", ".exr", ".ktx2", ".basis", ".splat", ".spz", ".ply", ".stl"}

def from_clone(clone: Path) -> dict:
    found = []
    if not clone.exists():
        return {"clone": str(clone), "models": [], "error": "clone folder missing"}
    manifest = clone / "MANIFEST.json"
    if manifest.exists():
        data = json.loads(manifest.read_text(encoding="utf-8"))
        found.extend(data.get("models") or [])
    for path in clone.rglob("*"):
        if path.is_file() and path.suffix.lower() in EXTS:
            rel = path.relative_to(clone).as_posix()
            if not any(item.get("local") == rel for item in found):
                found.append({"local": rel, "url": None, "bytes": path.stat().st_size})
    return {"clone": str(clone), "models": found, "scene": (clone / "SCENE.md").exists()}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--clone")
    ap.add_argument("--url")
    ap.add_argument("--out")
    args = ap.parse_args()
    if args.url:
        cloner = Path(__file__).with_name("clone_site.py")
        out = Path(args.out or "site-clone-out")
        import subprocess
        subprocess.check_call([sys.executable, str(cloner), args.url, "--out", str(out), "--depth", "0"])
        print(json.dumps(from_clone(out), indent=2))
        return 0
    if not args.clone:
        print("pass --clone or --url", file=sys.stderr)
        return 2
    print(json.dumps(from_clone(Path(args.clone)), indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
