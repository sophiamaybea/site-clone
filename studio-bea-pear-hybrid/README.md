# Studio Bea Sophia — an immersive agency / story hybrid
A new, original studio site combining the *motion principle* behind Pear (a pinned scroll-film, with typography and navigation remaining searchable HTML) and the narrative world-building of the authorised Sleep Well Creatives practice prototype.

**Standalone Vercel project:** `studio-bea-pear-hybrid`, root directory `studio-bea-pear-hybrid/`.

## Five chapters
1. **Somewhere, down there:** astronaut floating through stars.
2. **Things worth noticing:** clouds and atmospheric descent.
3. **Every stranger has a story:** illustrated, layered city of umbrella people.
4. **The Page Gallery:** the page of paper leads towards a door and a poem.
5. **Other worlds:** independent Studio Bea Sophia. A conventional, readable agency experience then presents the journal, services and a real contact invitation.

## How it works
A single inline Canvas 2D renderer uses an image atlas of the user's own cutouts to animate a scroll-controlled film. The film is pinned by CSS and its playhead tracks a real scroll interval. Text overlays remain semantic HTML, along with agency case studies, services and contact information. This is a hybrid prototype, not an exact clone of Pear's film frames or Sleep Well's private WebGL composition.

## Relevant repos investigated
- [oosuhada/pear.no](https://github.com/oosuhada/pear.no): independent detailed technical reconstruction of Pear's pinned scroll-film system and progressive frame loading. No code or media from this repo was included.
- [IsmoiljonVahobjonov/orbital-portfolio](https://github.com/IsmoiljonVahobjonov/orbital-portfolio): deterministic GSAP-to-R3F scroll synchronisation and an agency-friendly information hierarchy.
- [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig): possible future approach when replacing rasterised puppets with true 3D camera traversal.
- [BabylonJS/Spector.js](https://github.com/BabylonJS/Spector.js): inspect original WebGL rendering.
- [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) and [theatre-js/theatre](https://github.com/theatre-js/theatre): future production-quality puppet rigging, depth and animation timelines.

## What this is not
A client-facing publication of Pear's original branding, figures or copyrighted video frames; those remain with Pear. The original user-provided drawings have been staged as the creative source instead. The public mailto CTA is `hello@studiobeasophia.com` and should be verified with the site owner before relying on it.

## Quality bar
Before describing the visual motion as production quality: browser-test chapter changes on desktop and iPad/mobile, review the cutout outlines at full resolution, check scroll reversal, test colour contrast, and add a genuine project enquiry endpoint.