# Sleep Well Creatives — authorised scroll-experience study

A practice reconstruction of [Sleep Well Creatives](https://sleep-well-creatives.com/), originally designed and developed by **Victor Work (Victor Costa)**. The site owner has granted the requester permission to attempt this recreation. This copy is a learning experiment, not a claim of authorship.

**Live study:** https://sleep-well-faithful-clone.vercel.app/

## What this actually is

This is a **runtime mirror** of the publicly delivered page, not a visually guessed replacement. It preserves the original Webflow document, its CSS, and the client-side Three.js/WebGL/GSAP-driven visual experience. Publicly served core JS and CSS dependencies have been copied into `assets/` so the experience can run on the study domain. Images, fonts and other media may still be served from external CDNs.

### Files

- `index.html`: captured production Webflow markup, with local references for the copied bundles.
- `assets/visuals.js`: the public, production visual-effects JavaScript bundle (minified).
- `assets/visuals.css`: associated visual CSS.
- `assets/webflow.css` and `assets/webflow.js`: production Webflow runtime styling and JavaScript.

The capture workflow is in `../.github/workflows/reproduce-sleep-well.yml`. Source-to-replica screenshot testing is in `../evals/sleep_well_audit.cjs`; interaction tests are in `../evals/sleep_well_interactions.cjs`.

## Run locally

Serve **this folder**, not the repository root. A local HTTP server is important for module scripts.

```bash
cd sleep-well-creatives
python3 -m http.server 8080
```

Open http://localhost:8080. An internet connection is required for CDN-linked assets.

## How to learn from this

1. Open the original and this deployment at the same viewport dimensions.
2. Enter the opening experience (the preloader is interactive).
3. Scroll in small increments and inspect the fixed WebGL canvas separately from the text/layout layers.
4. In browser DevTools, compare network requests, CSS computed styles, and the original and mirrored WebGL runtime.
5. To understand the technique, rebuild **one section** independently with Three.js and GSAP ScrollTrigger, then compare multiple scroll positions. A static screenshot match is not a motion test.
6. Inspect draw calls and shaders with Spector.js where practical. A capture is not a recovery of original authored project files.

## Verification, limitations and attribution

A 10 October 2026 Playwright comparison of the entered experience reported 64 changed pixels across four captured desktop/mobile frames (3,250,320 pixels total). That is evidence of visual parity **at those selected frames**, not proof of complete independence, or every interaction working on every device. See `../references/sleep-well-replication-report.md`.

- The 3D motion is produced by the captured runtime; it has not been re-authored into an independent set of readable scene components.
- The mirror depends on externally hosted Webflow/media/fonts/videos and may change if those resources are removed.
- The canonical metadata continues to reference the original author's website.
- Respect the original creator's credits and permission when sharing or adapting this study. No original authorship is claimed.

**Original:** https://sleep-well-creatives.com/  
**Creator:** https://vwlab.io/
