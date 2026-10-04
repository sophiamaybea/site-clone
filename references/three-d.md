---
description: "How to save public 3D files and when to generate an original stand-in."
connections: [boundaries, stack-catalog, design-dna]
---

# 3D capture and generation

Save public .glb, .gltf, .obj, .fbx, .usdz, .hdr, and splat files that the page already references. Leave Sketchfab and Spline embeds remote; record the embed URL in SCENE.md.

If the page is only a canvas and no model downloaded, run `scripts/generate_standin.py`. That writes an original glTF, a Blender script, and `viewer.html`. Do not copy a trademarked mesh. The stand-in is a geometric placeholder so the rebuild has a file to replace.

A wild WebGL page is still a design clone: record camera, materials, and scroll coupling in DESIGN-DNA.json `motion`. Hand a full scene rebuild to `self-learning-3d-design` after the DNA exists.
