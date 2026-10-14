# Design review — 14 October 2026

**Build:** Editorial photographic collage redesign / Vercel production.
**Reference sources:** the user's Shuffles collage example, umbrella character cutouts, Sleep Well Creatives, Pear and Montfort.

## What was wrong with the previous version
- CSS-drawn skies, skyline shapes and props looked synthetic and damaged the credibility of the art direction.
- Existing 3D attempts prized movement over sophisticated compositions.
- The opening story sometimes had a silent area between title and city; a user could scroll through an empty visual beat.
- Huge moving umbrella elements could occlude mobile headlines.
- The old project did not properly explain the creative studio or give a clear enquiry path.

## What has been materially redesigned
- Actual atmospheric photographs sourced under an explicit image-licence workflow, with provenance stored in \`assets/cinema/PHOTO-CREDITS.md\`, replace fake scenic geometry.
- Real scanned ink umbrella puppets with transparent backgrounds are integrated at multiple depths, with vermilion as the one controlled colour interruption.
- Full-screen photographic scenes interpolate in scale and position as scroll progresses, including a spatial transition to warm editorial paper.
- The real Page Gallery is introduced as an evidence-based studio project, followed by specific offerings and a contact call-to-action.
- Desktop/mobile typography separately art-directed, including safe overlaps and viewport-sensitive figure positions.
- The original astronaut was initially too dark on the night sky, then corrected to a luminous ink treatment; an overlong gap in the city caption and a mobile red-umbrella text clash were also corrected.

## Browser verification performed
Playwright runs a real Chromium browser at **1440x900** and **390x844**. Each run tests story checkpoints **0%, 27%, 50%, 72%, 98%** plus work and contact. The automated check confirms:
- 200 response, assets loaded and no browser errors.
- Astronaut atlas cutout and a minimum number of figures render.
- No unintended horizontal overflow.
- Real Page Gallery and enquiry links exist.

This is **not** a claim that subjective visual quality, full puppet animation, production performance and WCAG auditing are complete. Further design iteration remains valuable.

## Next experiments worth considering
1. Split a single umbrella image into limbs/canopy and compare an articulated PixiJS puppet against the single-sprite design.
2. Compare a clean R3F camera-rig transition from one photographic composition to the gallery against the current CSS clip reveal.
3. Audit actual iPad Safari video frame pacing; Playwright Chromium is not the same as Safari/WebKit.
4. Add case study pages for real work only, and verify the enquiry email destination.

## Versioning
Production redesign: \`index.html\`.
Staging code: \`v3/index.html\`.
First concept preserved in \`archive/2026-10-14-first-prototype.html\`.
