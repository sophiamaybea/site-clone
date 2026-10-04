---
description: "Pixel-diff bar and the correction loop. Read before calling a recreation done."
connections: [design-dna, boundaries, tool-class]
---

# QA loop

Separate generation from verification. A model does not own the match. `scripts/pixel_diff.py` does.

## Loop

1. Screenshot original and rebuild at 390, 768, 1440. Same scroll position per section.
2. Diff. Read the mismatch ratio and the worst quadrant.
3. Fix the worst region from computed style, not from a new guess.
4. Re-render. Repeat. Cap at 6 passes per section, then write the residual.

## Bar

| Mode | Pass |
| --- | --- |
| owned, rebuild | Under 2% mismatch on compared sections, clean console. Their photos may remain. |
| transfer | Tokens, type metrics, and layout rhythm match. Ignore photo and logo regions. Say they were masked. |
| inspect | No pass required. Deliver DNA and the original screenshots. |

Do not claim 99.71% or 93–97% from another project's writeup. Report the ratio this run printed.

## Failures that are not style

- Webfont blocked: name the fallback and the metric delta.
- Canvas or video: diff the still frame, and say motion was judged by trigger, not by pixels.
- Sticky or scrub: compare two scroll stops, not one hero.
- Anti-alias and subpixel text: mask the text band if the ratio is only glyph fringe. Do not "fix" it by changing the type size.

A green diff on the wrong copy is still a failed transfer.
