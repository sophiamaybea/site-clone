#!/usr/bin/env python3
"""Build licensed photographic collage sources for Studio Bea Sophia.

Unsplash assets are used under https://unsplash.com/license. Credit stays in
assets/PHOTO-CREDITS.md. Never use these as a stock-photo redistribution pack:
they are transformed, combined and distributed only within the site.
"""
from pathlib import Path
import urllib.request
import io
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
BASE=Path(__file__).resolve().parent.parent/"assets"/"cinema"
BASE.mkdir(parents=True,exist_ok=True)
SOURCES=[
 ("sky","https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=2200&q=82",2100),
 ("city","https://images.unsplash.com/photo-1690741818722-3f96fc94f678?auto=format&fit=crop&w=2300&q=82",2200),
 ("rain","https://images.unsplash.com/photo-1571366657709-88005f3a2e0a?auto=format&fit=crop&w=2000&q=82",2000)
]
credits=["# Photograph attribution and usage","",
"These photographs are incorporated into composed site scenes under the Unsplash License (https://unsplash.com/license).",
"Please retain this attribution file and independently review any licence changes before reuse.","",
"- \`sky.webp\`: Unsplash photograph from https://unsplash.com/photos/ via photo-1419242902214-272b3f66ee7a.",
"- \`city.webp\`: Ryan Geller, *New York City skyline on a summer night* (2023), https://unsplash.com/photos/FXKohzaR3Uo.",
"- \`rain.webp\`: Lerone Pieters, *A city street at night in the rain* (2020), https://unsplash.com/photos/CrHhvF8qotQ."]
for name,url,maxwidth in SOURCES:
 print("DOWNLOAD",name,url,flush=True)
 try:
  req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"})
  with urllib.request.urlopen(req,timeout=65) as response: raw=response.read()
  im=Image.open(io.BytesIO(raw)).convert("RGB")
  if im.width>maxwidth: im.resize((maxwidth,round(maxwidth*im.height/im.width)),Image.Resampling.LANCZOS)
  im.thumbnail((maxwidth,2000),Image.Resampling.LANCZOS)
  if name=="city":
   im=ImageEnhance.Color(im).enhance(.80)
   im=ImageEnhance.Contrast(im).enhance(1.05)
  if name=="rain":im=ImageEnhance.Color(im).enhance(.78)
  im.save(BASE/f"{name}.webp","WEBP",quality=82,method=6)
  print("READY",name,im.size,(BASE/f"{name}.webp").stat().st_size,flush=True)
 except Exception as e:
  print("FAILED",name,repr(e),flush=True)
  if name!="sky": raise
  # Fallback still contains authentic photographic sky if initial source disappears;
  # the page's CSS colour grading will carry the atmosphere.
(BASE/"PHOTO-CREDITS.md").write_text("\n".join(credits)+"\n")
