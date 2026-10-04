---
description: "How to save public 3D files and when to generate an original stand-in."
connections: [boundaries, stack-catalog]
---

# 3D capture and generation

Save public .glb, .gltf, .obj, .fbx, .usdz, .hdr, and splat files that the page already references. Leave Sketchfab and Spline embeds remote; record the embed URL in SCENE.md.

If the page is only a canvas and no model downloaded, run `scripts/generate_standin.py`. That writes an original glTF, a Blender script, and `viewer.html`. Do not copy a trademarked mesh. The stand-in is a geometric placeholder so the rebuild has a file to replace.
