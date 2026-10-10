---
name: site-clone
description: "Measure a public site and rebuild its design — computed styles, type, motion, and layout — then pixel-diff the recreation. Use when the user says clone this site design, extract the visual language, paste a URL and recreate the aesthetic, pixel-match this page, or design-system transfer. Not for login bypass, phishing, brand republishing, pink-paper scrapbooks, or GitHub parts foraging."
type: workflow
lifecycle: active
metadata:
  department: Engineering
  desk_role: method
  principal: engineering-technology
  os: universal-living-genius-os
---

# Site Clone — measured design recreation

Paste a public URL. Measure the live page. Extract the visual system. Rebuild it as a site the user owns. Prove the rebuild with a pixel-diff, not a vibe check.

This is not screenshot-to-code. Do not ask a vision model to guess padding. Read computed style, assets, and runtime, then correct against a diff.

Desk: Engineering. Principal: `engineering-technology`. Build protocol when the ask is a product, not a one-page study: `omega-builder`. Asset mirror and 3D stand-in stay in this skill's scripts. Parts foraging is `github-aspect-forager`. A pink-paper scrapbook is `poetic-pink-paper-sites`. An Edolus-grammar scroll film is `edolus-site`.

Read `references/boundaries.md` before any fetch.

## Mode

Pick one. Do not mix a brand republish into a transfer.

| Mode | User said | Ship |
| --- | --- | --- |
| transfer | give my app this aesthetic / visual language | Tokens, type, rhythm, motion grammar. New copy. No logo, no photo set, no trademark. |
| rebuild | rebuild this page for my product | Layout and interaction grammar, original assets, their words. |
| owned | I own this URL / I have permission | Mirror plus measured recreation. Their assets may stay. |
| inspect | study it, do not ship a clone | `DESIGN-DNA.json`, `TECH.md`, screenshots. No public replica. |

If they did not say they own it, default to transfer or inspect. Say which mode you picked.

## Workflow

1. Confirm a public http(s) URL they named. Refuse login, CAPTCHA, DRM, paywall bypass, phishing, and impersonation. See `references/boundaries.md`.
2. Name the site class before tools: static marketing, editorial, app UI, or wild (GSAP, Lenis, ScrollTrigger, Lottie, Rive, Three.js, canvas, shaders, custom cursor). Class picks the method in `references/tool-class.md`. Do not vendor those repos.
3. Capture evidence, do not invent it.

```bash
python3 scripts/clone_site.py "https://example.com" --out /workspace/artifacts/site-clone-out --depth 0
```

Same-origin crawl: `--depth 1 --max-pages 12`. SPA already saved: `--html snapshot.html`. Then open the live page and record computed style at 390, 768, and 1440. Screenshots of the original are the diff baseline, not the design source.

**Wild motion / WebGL gate:** HTML fetches are insufficient. Run `.github/workflows/capture-interactive.yml` in GitHub-hosted Chromium (or `node scripts/capture_interactive.mjs <url> <out>` where Playwright/Chromium works). Inspect `capture.json`, network/model requests, errors, WebGL canvas, and multiple scroll-state screenshots before coding. See `references/sleepwell-runtime-case.md` for a verified Webflow + separate Netlify Three.js runtime case. Missing browser dependencies mean capture is **unverified**, not impossible and not completed.
4. Write the DNA. Fill every field from measurement. Empty is better than a guess.

```bash
python3 scripts/write_design_dna.py --url "https://example.com" --mode transfer --out /workspace/artifacts/site-clone-out/DESIGN-DNA.json
```

Schema and what each field means: `references/design-dna.md`.
5. Rebuild the smallest vertical slice that proves the system: one section, real type, real tokens, real motion trigger. No disconnected component library. On a product ask, frame it with `omega-builder` first (`scripts/omega_frame.py` in that skill).
6. Diff and correct. Loop until the bar in `references/qa-loop.md` is met or you state the residual.

```bash
python3 scripts/pixel_diff.py original.png clone.png --out diff.png
```

7. 3D only if the page is a canvas or WebGL scene. Harvest public models, else an original stand-in. Do not copy a trademarked mesh.

```bash
python3 scripts/harvest_models.py --clone /workspace/artifacts/site-clone-out
python3 scripts/generate_standin.py --out /workspace/artifacts/site-clone-out/scene
```

Spatial craft beyond a stand-in: `self-learning-3d-design`.
8. Deliver the folder. State mode, what was measured, mismatch per viewport, what was deliberately not copied, and that the output is a rebuild they own.

## Method pick

| Class | Borrow the pattern from | Do not |
| --- | --- | --- |
| Static marketing | ai-site-cloner: computed style, then Next components, then pixel threshold | Guess from one screenshot |
| Wild motion / WebGL | true-web-clone: source, assets, runtime first; reconstruct only where the runtime cannot ship | Flatten a scroll film into cards |
| Design system only | designreplicator: tokens, then implementation, then pixelmatch | Copy the logo lockup |
| Agent loop | copycat-skill / website-cloner: extract → reconstruct → compare → worst region → fix | Stop after the first render |
| Verification layer | calque check, or `scripts/pixel_diff.py` | Treat a vision-model "looks close" as a pass |

Full classify table: `references/tool-class.md`. Omega rule: STUDY ONLY or BORROW THE PATTERN. Never copy repository code blindly.

## Output contract

| File | Meaning |
| --- | --- |
| `DESIGN-DNA.json` | Measured tokens, type, space, motion, breakpoints |
| `index.html` or app source | The rebuild, not a republished brand |
| `assets/` | Fetched public files, source URL on each |
| `MANIFEST.json` / `TECH.md` | What the mirror actually saved and detected |
| `diff-390.png` `diff-768.png` `diff-1440.png` | Pixel diffs, or an explicit skip |
| `SCENE.md` / `scene/` | Models or original stand-in, only if the page is 3D |

## Done when

- Mode is named, and brand assets are absent unless mode is owned.
- Type, color, and space came from computed style or saved CSS, not memory of the brand.
- Three viewports were compared, or the skip is written down.
- Motion still communicates the same trigger (scroll, hover, load). Decorative motion was not added.
- Console is clean on the rebuild. A failed asset is listed, not hidden.

## Knowledge graph

Start at `references/INDEX.md`.
