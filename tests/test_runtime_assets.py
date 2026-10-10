"""Regression: a 3D model referenced only inside bundled JS must be discovered."""
import http.server
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Fixture(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            body = b'<html><head></head><body><canvas class="webgl"></canvas><script src="/app.js"></script></body></html>'
            kind = "text/html"
        elif self.path == "/app.js":
            body = ('const SceneWoman="http://127.0.0.1:' + str(self.server.server_port) +
                    '/models/SceneWoman.glb"; class WebGLRenderer {}').encode()
            kind = "text/javascript"
        elif self.path == "/models/SceneWoman.glb":
            body = b"glTF\x02\x00\x00\x00"
            kind = "model/gltf-binary"
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        return


class InteractiveRuntimeTest(unittest.TestCase):
    def test_nested_glb_is_harvested(self):
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Fixture)
        thread = threading.Thread(target=srv.serve_forever, daemon=True)
        thread.start()
        try:
            with tempfile.TemporaryDirectory() as tmp:
                out = Path(tmp) / "capture"
                proc = subprocess.run(
                    [sys.executable, str(ROOT / "scripts/clone_site.py"),
                     "http://127.0.0.1:" + str(srv.server_port) + "/",
                     "--out", str(out)],
                    capture_output=True, text=True, timeout=15
                )
                self.assertEqual(proc.returncode, 0, proc.stderr)
                manifest = json.loads((out / "MANIFEST.json").read_text())
                models = [x["url"] for x in manifest["models"]]
                self.assertTrue(any("SceneWoman.glb" in url for url in models), manifest)
                self.assertIn("Three.js", manifest["stack"])
        finally:
            srv.shutdown()
            srv.server_close()


if __name__ == "__main__":
    unittest.main()
