# Sleep Well Creative: why the old clone flattened the experience

Target: https://sleep-well-creatives.com/
Mode: **inspect**, not a public re-host of the author's art or assets.

## Measured 10 October 2026

- HTTP 200, Webflow HTML shell ~132 KB.
- External Webflow CSS plus a custom stylesheet from `sleep-well-creatives.netlify.app`.
- Custom Netlify JavaScript bundle `/assets/index-8YjIcPvu.js`, HTTP 200, **1,028,480 bytes**.
- The bundle includes Three.js / WebGL rendering, glTF loading, GSAP and Lenis code. Site DOM has `<canvas class="webgl">`.
- 3D object URL found in the bundle: `https://sleep-well-creatives.netlify.app/models/SceneWoman.glb`. HTTP HEAD was **200**, content-type `model/gltf-binary`, length **304,104 bytes**.
- Site also references Webflow-hosted video and MP3 audio.
- The apparent `http://localhost:5173/main.js` development script is inside an HTML comment, **not** a broken production script.

**Root cause:** a page-HTML or screenshot-only reconstruction misses the externally hosted motion engine and dynamically referenced GLB resources. GitHub repositories are examples or source code, not an active browser integrated into ChatGPT. The earlier Python mirror saved first-level script files, but did not inspect model references inside minified JS, and its 200 KB signature sample was too short.

## Working route for ChatGPT + GitHub

1. Run the hosted Chromium capture workflow in this repository, using its public URL input. It captures desktop/mobile scroll states and records network events and WebGL canvas state.
2. Retrieve the `interactive-reference-capture` artifact from the run. Give `capture.json` and relevant screenshots to the coding assistant. These are *evidence*, not a functioning replica.
3. Use `scripts/clone_site.py` in a suitable network environment to inventory the public CSS, scripts and dynamically referenced model/media paths. It now recursively scans referenced JS as well as CSS, with a 350-asset limit.
4. For **authorised local reconstruction**, first render the actual DOM/CSS/runtime with assets served using proper MIME types, then verify scroll/hover/click/audio states using Playwright. If reuse is not authorised, build original 3D objects and visuals that reproduce the interaction principles instead.
5. Compare each frame and state. Treat a missing canvas, GLB load failure, wrong scroll mapping or a static hero as a failed reconstruction, even if the typography appears similar.

## Run in GitHub

Navigate to **Actions → Inspect interactive reference → Run workflow** and enter the URL. The job uses a hosted Ubuntu browser with the system dependencies that may be absent in a ChatGPT sandbox. The workflow may need to be merged into the default branch before GitHub offers the manual button.

## Limits

This is a capture and verification mechanism, **not an automatic legal right to republish** the creator's full site. Browser capture and direct asset retrieval have been checked separately, but a complete pixel-matched, freely deployable rebuild requires a reconstruction pass and the relevant permissions. Preserve these boundaries when reporting success.
