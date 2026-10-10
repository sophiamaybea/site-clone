# Sleep Well Creatives: fidelity-first reconstruction experiment

Date: 10 October 2026. User states permission to reproduce the site.

## Task
Reproduce the public reference at https://sleep-well-creatives.com/ with matching design and function in a separately deployed Vercel project.

## Measured implementation
- Production clone: https://sleep-well-faithful-clone.vercel.app/
- Vercel project: `sleep-well-faithful-clone`, id `prj_kMFvQA5t4ChKsi15ptQzHIDLOK18`.
- Source is versioned in `sleep-well-creatives/` of `sophiamaybea/site-clone`.
- Capture is defined in `.github/workflows/reproduce-sleep-well.yml`.
- Browser tests are defined in `evals/sleep_well_audit.cjs` and `.github/workflows/sleep-well-visual-audit.yml`.
- The exact production page HTML was retrieved from its public endpoint, with its hosted Webflow stylesheet and scripts and its Netlify ES-module/CSS bundle. Four production dependency URLs were rewritten to their local copies.
- External media, fonts and embedded streamed-video assets remain linked to the original public CDNs; this is an important portability dependency.

## First successful browser comparison
GitHub Actions run: https://github.com/sophiamaybea/site-clone/actions/runs/38055238798
Chromium through Playwright 1.64.0, image-diff via Pixelmatch.

| Snapshot | Dimensions | Pixels different |
|---|---:|---:|
| Hero desktop | 1440 × 900 | 51 / 1,296,000 |
| Mid-scroll desktop | 1440 × 900 | 13 / 1,296,000 |
| Hero mobile | 390 × 844 | 0 / 329,160 |
| Mid-scroll mobile | 390 × 844 | 0 / 329,160 |

Total: **64 / 3,250,320 pixels different (0.001969%)**, or **99.998031% pixel agreement across these four sampled frames**, calculated by Wolfram Language. This figure describes the tested captures only and cannot establish identical behaviour in all states.

### Runtime parity
- Reference and clone both returned HTTP 200 in browser.
- Both displayed 1 canvas and 12 images.
- Neither had broken images, failed resource responses, or uncaught JavaScript page errors in those captures.
- Measured page heights matched at both viewport widths.
- All three H1 headings matched.
- Desktop dynamic visible-text length differed slightly (6392 versus 6374) on one sampled visit. Mobile lengths matched at 6061.
- The clone's Vercel production deployment was READY and its local JS asset returned HTTP 200 with the expected 1,028,480-byte content length.

## Problems, root causes, resolutions
1. Local sandbox DNS could not retrieve the reference. The user-authorised Vercel cloud sandbox, with external networking, could. Public HTML was accessible in full without scraping the rendered site.
2. The first GitHub Actions mirror check rejected a commented `localhost:5173` development script. Removed the exact commented snippet rather than excluding the check. A second workflow run passed and committed the captured files.
3. New Vercel project inherited SSO deployment protection. Disabled SSO on this new project only so the clone's public production alias is accessible.
4. Browser automation was unavailable in the local container execution path. GitHub Actions provided an isolated Playwright browser runner with repeatable screenshot comparisons, and produced archived visual evidence.

## Engine lesson
For a reconstruction task, the winning capability is **production-source discovery and measured parity**, not a longer cloning prompt. The source and original runtime assets should be inspected first; only rebuild by hand when source capture cannot supply the behaviour. Test functional states and mobile and desktop displays before claiming complete fidelity.

This single experiment is not a benchmark demonstrating DSPy, GEPA, Promptfoo, Phoenix, or LiteLLM superiority. Those components were not installed or compared in this reproduction. The work does verify a GitHub-first, tool-routing, failure-recovery, quantitative-check workflow.
