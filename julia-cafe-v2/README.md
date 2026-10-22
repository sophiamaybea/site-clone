# Julia's World: Interaction Study (v2)

A custom Next.js / React / TypeScript reconstruction study based on the public design and interactions of Julia Alvarenga's portfolio, with bespoke, independently implemented interactions.

## Architecture

- `components/WorldHero.tsx`: Scroll-linked 14-object typographic collage, GSAP + ScrollTrigger
- `components/BioSection.tsx`: Hover/focus photo cards
- `components/CoffeeExperience.tsx`: Original HTML Canvas coffee renderer tied to scroll progress
- `components/CafeScene.tsx`: Source-measured photographic hotspots, responsive accessible menu
- `components/ExperienceOverlay.tsx`: Distinct overlay views, accessible close/focus handling
- `components/PhotoGallery.tsx`: Physical photo cards, responsive grid, keyboard-operated lightbox
- `components/MusicPlayer.tsx`: CSS vinyl plus WebAudio-generated ambient sketch
- `components/DeskOS.tsx`: Windowed desktop, move/focus/close controls, mini-apps
- `lib/content.ts`: data/configuration and source measured hotspot positions
- `app/globals.css`: component-level styles and reduced motion fallbacks

## Development

`npm install && npm run dev`

`npm run build` verifies TypeScript, React and Next.js build.

## Attribution and assets

**Not the official website.** Unaffiliated demonstration of interface reconstruction skills. Source site: https://www.juliaalvarenga.com/.

The original site's café scene, illustrated SVG title and icon assets are externally linked solely for visual evaluation and remain the original creator's copyrighted works. License or replace those assets for independent public/commercial distribution. Gallery photographs use Unsplash-hosted images and represent demonstration content, not Julia's original photography.

## Validation

Check at 1440x900, 390x844 and at least one tablet width. Check all 8 hotspots, modal closure, keyboard Escape/Tab, mobile object index, Desktop applications, image gallery lightbox, ScrollTrigger reduced motion behaviour and the volume control. Pixel-by-pixel equivalence is not claimed without screenshot access to the original under the same conditions.
