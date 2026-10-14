# STUDIO BEA SOPHIA — CREATIVE DIRECTOR & CODING AGENT BRIEF

This file is the source of truth for anyone working on this website. It is meant to cultivate *judgement*, not to mandate the installation of every possible library.

## Objective
An independent creative web studio that feels like entering a richly made illustrated world, while making it immediately intelligible to potential clients who we are, what we make and how to enquire.

## The visual direction (locked until an explicit redesign request)
**Photographic reality meets an eccentric hand-illustrated paper theatre.**
- Make atmospheric photographic scenes from legitimately usable sources; use authentic hand-drawn figures cut out with transparent backgrounds.
- Studio artwork lives under \`assets/umbrellas/\`; do NOT recreate those people with CSS/SVG silhouettes or generic generated people.
- The full-bleed photographed city and night sky live under \`assets/cinema/\`. Credits live in \`PHOTO-CREDITS.md\`.
- Warm chalk-paper backgrounds, very dark indigo, charcoal, controlled vermilion. Never use a random rainbow or neon-only gradients.
- Type system: Italiana for cinematic display, DM Sans for reading, DM Mono for small editorial wayfinding. Serif italics are occasional, not everywhere.
- Genuine cinematic compositions with decisive scale, negative space, legible foregrounds and believable perspective.
- Let hand-painted/paper edges remain visibly imperfect. Avoid vector skyline blocks, smooth cartoon clouds, CSS clip-path mountains or pseudo-3D effects masquerading as real textures.
- Our one starting point is a handmade story, not a cluster of SaaS feature cards.

## Reference principles, not assets to appropriate
- **Sleep Well Creatives**: the story is physically travelled, not replaced by unrelated webpage sections. User reports permission for reference practice; don't republish someone else's IP in a finished studio site.
- **Pear**: one scroll-controlled film with excellent editorial/commercial legibility.
- **Montfort**: chapter-level spatial continuity, purposeful WebGL detail, performance, honest presentation of a real business.
- **Shuffles examples**: found materials, shifts in relative scale, photographic/painterly textures and deliberately visible compositing.
- **The user’s original illustrations** are the visual signature.

## AI design and technical research: adaptive, not library-driven
For each visual problem, write down intended emotional result, state changes, measurable feasibility constraints and 2 alternative approaches before picking technology.

Use these public research and implementation references selectively:
- \`pbakaus/impeccable\` for design craft and critique.
- \`aa-on-ai/agentic-design-system\` for purpose-driven analysis and review loops.
- \`Z4YT0N/awwwards-skill\` to research creative implementations, and \`obra/superpowers\` for scoped hypotheses and iterative testing.
- \`pixijs/pixijs-skills\` and \`pixijs/pixijs\` when 2D collage sprites and image filters dominate.
- \`pmndrs/react-three-fiber\` and \`14islands/r3f-scroll-rig\` if moving a camera through actual 3D geometry is materially better than layered 2D.
- \`theatre-js/theatre\` for editable cinematography or articulated animation when manual timelines become unmanageable.
- \`codrops/interlude\` for thoughtfully directed route-level transitions in Astro.
- \`microsoft/playwright\` for evidence-based visual and functional testing, not aesthetic certification.
- Image source and segmentation tools like museum open collections, ComfyUI/FLUX, SAM2, rembg and image restoration are asset-preparation options, not automatically production dependencies.

Do not add any of the above simply to claim they were used. Inspect their licence and fit and implement only if the user experience actually improves.

## Essential critical reasoning
After EVERY significant visual edit:
1. Render the *actual page* at 1440x900 and 390x844, not code snippets.
2. Capture five active scroll positions (0, 27, 50, 72 and 98 percent) plus selected work and contact.
3. Review one combined contact sheet for: typography, focal point, object cutout quality, shadows, perceived realism, visual narrative, a11y and commercial clarity.
4. Flag P0/P1/P2 issues and **change the design**, not merely the test expectation.
5. Repeat until P1 and P2 issues are addressed. A passing browser check never proves great visual design.
6. Preserve a previous deploy as a reversible archive; ship to Vercel only after responsive browser verification.

## Code and content boundaries
- The canonical production homepage is \`index.html\`. A staging copy lives under \`v3/\`. The previous concept is under \`archive/\`; the independent collage lab remains \`collage-study/\`.
- Responsive HTML content and links MUST remain accessible without WebGL.
- Honesty in case studies: The Page Gallery is an actual user project. Never invent past agency commissions.
- Scroll animation must be reversible and deterministically tied to scroll position.
- Respect \`prefers-reduced-motion\`, keyboard focus and meaningful alt text.
- Any library or media download from external sources must have its usage rights checked before release.
- Never say a site is award-winning merely because it looks stylish or tests pass.
- Vercel project: \`studio-bea-pear-hybrid\`, root \`studio-bea-pear-hybrid/\`, production URL https://studio-bea-pear-hybrid.vercel.app/.

## Known issues / future high-value work
- A walking paper puppet should eventually have independent torso/umbrella/leg states; tiny whole-image translations are not realistic walking.
- The camera currently uses layered photographic parallax, not full 3D navigable geometry. Explore true depth selectively in controlled scene studies.
- Provisional enquiry mailto must be verified with the site owner.
- For launch, optimise assets and fonts and add real project detail pages with representative finished work only.
