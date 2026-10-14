# Studio Bea Sophia — Sleep Well Creatives prototype

## Purpose

**Preserve the real functioning site before redesigning it.** This is an author-permitted learning prototype built from the public runtime of [Sleep Well Creatives](https://sleep-well-creatives.com/). It is separate from the unchanged faithful-reference capture at `../sleep-well-creatives/`.

The starter prototype deliberately retains the reference Webflow HTML, the actual WebGL bundle, its shaders, preloader, GSAP-driven interactions and its original local CSS/JS assets. The public illustrations, fonts, video and audio are currently CDN dependencies. At this stage, the Studio Bea Sophia art and writing have **not** been substituted into the rendered film. We will do that scene-by-scene without flattening the movement.

## Desired new story

1. **Outside Earth:** one of the user's ink-drawn astronauts, paper stars, moon, unexpected scale, `Studio Bea Sophia`.
2. **Atmospheric descent:** hand-drawn clouds, illustrated paper travelling down, light becomes city windows.
3. **City of umbrellas:** 3D parallax and camera passage through the original umbrella drawings, isolated without rectangular backgrounds.
4. **The Page Gallery:** follow one page of paper through a door; poems inhabit the rooms; link to https://pagegalleryjournal.com.
5. **Studio Bea Sophia:** independent creative web design, illustrated working studio, genuine contact invitation.

## Existing technical materials

- `index.html`: original captured Webflow page structure, preloader, narrative panels, audio controls and normal DOM content.
- `assets/visuals.js`: the minified original WebGL engine shipped by the author, used to preserve scene timing and shaders.
- `assets/visuals.css`: original WebGL-associated styling.
- `assets/webflow.css` and `assets/webflow.js`: Webflow layout and interactions.
- `assets/illustration-atlas.b64`: the transparent hand-illustration collage atlas from the user's supplied drawings. It is staged and deliberately **not** superimposed on the original film before its camera/scene choreography is mapped.

## Replacement discipline

Never treat each scroll chapter as a standalone website panel. Do not place a text card on top of the original 3D canvas and claim success. Preserve real camera and object movement. For each chapter: (a) record entered browser frames, (b) map original section DOM and related WebGL timeline, (c) isolate user artwork, (d) replace the relevant 3D geometry/textures and text, (e) compare the behaviour while scrolling forward and backwards, (f) test on iPad/mobile, (g) move to the next chapter only after visual review.

## Source and permission

The user reports permission from Victor Work to practise recreating the reference. The original work and design credit remain Victor's. The user's drawings are their own input. This is a working study, **not an original production-ready Studio Bea Sophia website**. Reuse/republication of third-party resources is subject to the actual scope of granted permission. Retain attribution during prototyping.
