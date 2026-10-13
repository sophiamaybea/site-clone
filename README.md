# site-clone

Skill that measures a public page and rebuilds its design: computed style, type, motion, layout, then a pixel-diff. The mirror scripts still save HTML, images, CSS, JS, fonts, and public 3D files.

Default mode is transfer: tokens and rhythm into a site the user owns. Logos and photo sets stay out unless they own the seed.

Install by copying this folder to `~/.grok/skills/site-clone`, then start a new session.

Do not use it to bypass a login or republish someone else's brand.

## Working example: Sleep Well Creatives (author-permitted practice)

**Live replica:** https://sleep-well-faithful-clone.vercel.app/  
**Original:** https://sleep-well-creatives.com/  
**Vercel project:** `sleep-well-faithful-clone`  
**Source:** [sleep-well-creatives/](./sleep-well-creatives/)  
**Technical replication report:** [references/sleep-well-replication-report.md](./references/sleep-well-replication-report.md)

The source folder contains a captured public Webflow page and locally hosted production JS/CSS bundles, including the original WebGL runtime bundle. Public media and fonts currently depend on external CDNs. This is a technical learning reproduction with permission reported by the user, not a new original design or a full recovery of private 3D project files.

A conventional static HTML screenshot clone could not recreate the immersive scroll. This approach preserves the *actual rendering bundle* and couples it to the original Webflow structure.

### Verifying the 3D scrolling

CI runs screenshot and interaction comparisons. `evals/sleep_well_motion_parity.cjs` additionally enters the experience and compares five active scroll checkpoints at desktop and mobile widths, saving PNG diffs and machine-readable JSON in an Actions artifact. Animated WebGL pixels can vary by hardware and timing; do not treat identical hero frames as sufficient evidence of identical scroll behaviour.

To reproduce the captured webpage locally, serve `sleep-well-creatives/` as a static directory. For a Vercel Git deployment, set the project's root directory to `sleep-well-creatives` with no build command.
