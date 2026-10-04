---
description: "Public cloner repos to study. Classify before use. Do not vendor."
connections: [boundaries, design-dna, qa-loop]
---

# Tool class

These repos measure a live site, extract computed CSS and assets, rebuild, then pixel-diff. They are references. Omega rule: STUDY ONLY or BORROW THE PATTERN. Do not copy their code into the rebuild.

| Repo | Borrow | Class |
| --- | --- | --- |
| Mahanaicoach/ai-site-cloner | Playwright `getComputedStyle`, fonts, hover, 390/768/1440, asset extract, section pixel threshold. Published Plausible note: 99.71% average — do not cite unless you measured it. | static, app UI |
| SkyNotSilent/true-web-clone | Source first, assets first, runtime first. GSAP, ScrollTrigger, Lenis, Swiper, Lottie, Rive, Three.js, canvas, glb, shaders, fonts, video. Second pass for late assets. | wild |
| minosdevs/copycat-skill | Fold screenshots, hover, keyframes, CSS variables, then repeat pixel-diff under 2% with a clean console. | any, agent loop |
| azeembuilds/website-cloner | Extractor writes site-dna, reconstructor implements, comparator diffs. | any |
| jongko54/webEmbedding | DOM, computed style, HAR, interaction states, responsive checks. Study if building a product. | product engine |
| bgddo/designreplicator | Tokens plus pixelmatch. Published examples ~93–97%. Use for transfer mode. | transfer |
| openwarehq/calque | Screenshot to measured HTML without a vision LLM, then `calque check`. Use as a verifier, not the designer. | verify |
| ericshang98/Perfect-Web-Clone-IDE | MCP/IDE workflow. Study only if the user is already in that IDE. | IDE |

## Pipeline to borrow

URL → capture DOM, CSS, JS, fonts, assets → measure 390/768/1440 → write DNA → rebuild → screenshot → pixel-diff → worst region → fix → repeat.

Static marketing: ai-site-cloner pattern is enough. Wild scroll, shader, cursor, kinetic type: true-web-clone pattern first, then the same diff loop. Transfer: designreplicator pattern, stop chasing their photographs.

Local tools already here: `scripts/clone_site.py` for the mirror, `scripts/pixel_diff.py` for the check, `scripts/write_design_dna.py` for the file. Use a browser snapshot for computed style when Playwright is not installed. Do not pretend a missing measure happened.
