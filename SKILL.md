---
name: site-clone
description: "Clone any public site into a local mirror with images, CSS, JS, fonts, 3D files, and a technology inventory, and generate original 3D stand-ins when the scene has no downloadable model. Use when the user says clone this site, mirror this website, extract the glb, save the webgl scene, or generate a 3d stand-in. Not for login bypass, phishing, or republishing a brand as your own."
type: workflow
lifecycle: active
---

# Site Clone

Mirror a public URL. Save HTML, images, CSS, JS, fonts, and public 3D files. Identify the stack only from source evidence. If no model file exists, generate an original stand-in.

Do not log in, bypass a paywall, harvest cookies, or host the clone as the source brand. Read `references/boundaries.md` before a fetch that looks authenticated.

## Workflow

1. Confirm the seed is a public http(s) URL the user named. Refuse login, CAPTCHA, DRM, or impersonation asks.
2. Mirror it:

```bash
python3 scripts/clone_site.py "https://example.com" --out /workspace/artifacts/site-clone-out --depth 0
```

Same-origin crawl: `--depth 1 --max-pages 12`. SPA already saved as HTML: `--html snapshot.html`.
3. Read `MANIFEST.json`, `TECH.md`, and `SCENE.md` in the output folder. Report image count, failed assets, and stack only from those files.
4. Harvest models already saved:

```bash
python3 scripts/harvest_models.py --clone /workspace/artifacts/site-clone-out
```

5. If `SCENE.md` lists no glTF, GLB, OBJ, FBX, USDZ, HDR, or splat, and the page is a canvas or WebGL scene, write an original stand-in. Do not copy a trademarked mesh.

```bash
python3 scripts/generate_standin.py --out /workspace/artifacts/site-clone-out/scene
```

6. Deliver the folder. State what was fetched, what failed, and that the mirror is for inspection or a rebuild the user owns.

Scripts live next to this file. Stack signatures: `references/stack-catalog.md`. 3D rules: `references/three-d.md`.

## Output contract

| File | Meaning |
|---|---|
| `index.html` / `pages/` | Saved HTML, not a rewritten brand site |
| `assets/` | Images, CSS, JS, fonts, public models |
| `MANIFEST.json` | Pages, assets, models, failures, stack |
| `TECH.md` | Stack detected from source and headers |
| `SCENE.md` | Model files, or the stand-in instruction |
| `scene/` | Original glTF, Blender script, viewer — only if generated |

## Knowledge graph

Start at `references/INDEX.md`.
