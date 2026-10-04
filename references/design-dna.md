---
description: "DESIGN-DNA.json fields. Read when filling or judging a measured design extract."
connections: [boundaries, qa-loop, tool-class]
---

# Design DNA

`scripts/write_design_dna.py` writes the skeleton. Fill it from the live page. A blank field means unmeasured. Do not backfill from brand memory.

## Fields

| Key | Measure |
| --- | --- |
| `meta.url` / `meta.mode` / `meta.class` | Seed, transfer\|rebuild\|owned\|inspect, static\|editorial\|app\|wild |
| `viewports` | 390, 768, 1440. Record what reflows, what pins, what disappears. |
| `color` | Computed background, text, accent, border. Role, not a palette dump. |
| `type` | Family, size, weight, line-height, letter-spacing, for display and body. |
| `space` | Section padding, stack gap, container max-width, grid columns. |
| `layout` | One sentence per region: what aligns, what overlaps, what sticks. |
| `motion` | Trigger (load, hover, scroll), duration, easing, property. What it tells the reader. |
| `interaction` | Cursor, hover, sticky, magnetic, custom scrollbar. Skip if absent. |
| `assets` | Structural (icons, grain) vs brand (logo, photos). Brand stays out of transfer. |
| `stack` | Copy from TECH.md. Do not add frameworks the catalog missed. |

## Wild pages

Record the runtime before rewriting it: GSAP, ScrollTrigger, Lenis, Swiper, Lottie, Rive, Three.js, canvas, shader, `.glb`, video. A scroll film is a sequence of camera and type states, not a stack of cards. If the runtime cannot ship, reconstruct the sequence and say so.

## Transfer rule

The DNA is the design system. The rebuild uses the user's name, offer, and images. Matching their hex values is allowed. Matching their lockup is not.
