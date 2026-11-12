# Garden / an immersive study

An original and editable creative-portfolio recreation **inspired by the publicly observable visual and interaction language** of https://immersive-g.com/ (studied 12 November 2026). This is **not** the original Immersive Garden source code or a pixel-perfect mirror, and it is not affiliated with Immersive Garden. No third-party site images, code bundles, proprietary fonts, logos or GLB assets are included.

## Features

- Original botanical bas-relief hero SVG (no external media requests)
- Sculptural editorial aesthetic, serif/sans contrast, asymmetrical 12-column project sequence
- Scroll-responsive hero depth, scroll-triggered entrance choreography, trailing cursor on devices with fine pointers
- Six original project illustrations and keyboard-operable case-study overlay
- Full-screen project index, motion on/off switch, `prefers-reduced-motion` support
- Fluid desktop / tablet / iPad / mobile layout, accessible button labels and focus-visible controls
- Static HTML, CSS, and JavaScript with zero dependencies or build tools

## Preview

Run any static HTTP server from this folder, or open `index.html` locally. On Vercel, set project root directory to `immersive-g-study`, Framework Preset = Other and Build Command = blank.

## Scope and limitations

The reference uses Nuxt, Three.js, bespoke GLSL shaders, WebGL relief meshes and proprietary image/video assets. This version reimplements observable **design principles** with lightweight original SVG, CSS and JavaScript. It does not reproduce the proprietary 3D sculpture, original projects, audio, newsletter integration, 51 project pages or case-study routes. Motion and visual similarity have not been measured pixel-by-pixel against the original because its live browser state wasn't accessible to this executor.

Original illustration and code in this subdirectory are available to the repository owner to modify or deploy. Replace the example mailto address and fictitious portfolio entries with authorised content before professional use.