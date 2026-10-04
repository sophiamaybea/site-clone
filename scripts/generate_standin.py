#!/usr/bin/env python3
"""Write an original 3D stand-in. Not a copy of a source mesh."""
from __future__ import annotations

import argparse
import json
import struct
import sys
from pathlib import Path

def box_gltf() -> dict:
    # Unit cube, original geometry. Positions and indices only.
    positions = [
        -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    ]
    indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 3, 2, 6, 3, 6, 5, 0, 7, 1, 0, 4, 7, 1, 7, 6, 1, 6, 2, 0, 3, 5, 0, 5, 4]
    pos = struct.pack("<" + "f" * len(positions), *positions)
    idx = struct.pack("<" + "H" * len(indices), *indices)
    blob = pos + idx
    return {
        "asset": {"version": "2.0", "generator": "site-clone-standin"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": "original-stand-in"}],
        "meshes": [{"primitives": [{"attributes": {"POSITION": 0}, "indices": 1}]}],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": 8, "type": "VEC3", "min": [-0.5, -0.5, -0.5], "max": [0.5, 0.5, 0.5]},
            {"bufferView": 1, "componentType": 5123, "count": len(indices), "type": "SCALAR"},
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(pos), "target": 34962},
            {"buffer": 0, "byteOffset": len(pos), "byteLength": len(idx), "target": 34963},
        ],
        "buffers": [{"byteLength": len(blob), "uri": "standin.bin"}],
    }, blob


VIEWER = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Original stand-in</title>
  <style>html,body{margin:0;height:100%;background:#111;color:#eee;font:14px sans-serif} canvas{display:block;width:100%;height:100%}</style>
</head>
<body>
  <canvas id="c"></canvas>
  <script type="module">
    const canvas = document.querySelector('#c');
    const gl = canvas.getContext('webgl');
    if (!gl) { document.body.textContent = 'WebGL unavailable'; }
    const vs = `attribute vec3 p; uniform float t; void main(){ gl_Position = vec4(p.xy * 0.6, p.z, 1.0); gl_Position.x += sin(t)*0.05; }`;
    const fs = `precision mediump float; void main(){ gl_FragColor = vec4(0.75, 0.55, 0.35, 1.0); }`;
    function sh(type, src){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5,-0.5,0, 0.5,-0.5,0, 0,0.5,0]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    const tloc = gl.getUniformLocation(prog, 't');
    function frame(now){
      canvas.width = innerWidth; canvas.height = innerHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform1f(tloc, now/1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  </script>
</body>
</html>
"""

BLENDER = '''import bpy
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
bpy.context.active_object.name = "original_stand_in"
'''


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Write an original 3D stand-in")
    parser.add_argument("--out", default="scene")
    parser.add_argument("--note", default="Original geometric stand-in. Not a copy of a source mesh.")
    args = parser.parse_args(argv)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    gltf, blob = box_gltf()
    (out / "standin.gltf").write_text(json.dumps(gltf, indent=2), encoding="utf-8")
    (out / "standin.bin").write_bytes(blob)
    (out / "standin_blender.py").write_text(BLENDER, encoding="utf-8")
    (out / "viewer.html").write_text(VIEWER, encoding="utf-8")
    (out / "README.md").write_text(args.note + "\n", encoding="utf-8")
    print(json.dumps({"out": str(out), "files": ["standin.gltf", "standin.bin", "standin_blender.py", "viewer.html"]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
