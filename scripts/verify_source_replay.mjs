#!/usr/bin/env node
/**
 * Verify that the public HTML shell can boot its external WebGL runtime from a
 * temporary local HTTP server. Does NOT save or republish the creator's HTML.
 *
 * Usage: node scripts/verify_source_replay.mjs https://example.com ./interactive-capture
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const url = new URL(process.argv[2] || 'https://sleep-well-creatives.com/');
const out = resolve(process.argv[3] || './interactive-capture');
await mkdir(out, { recursive: true });
const resp = await fetch(url);
if (!resp.ok) throw new Error('Source HTML not available: HTTP ' + resp.status);
const html = await resp.text();
const server = createServer((req, res) => {
  if (req.url !== '/' && req.url !== '/index.html') {
    res.writeHead(404); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const localUrl = 'http://127.0.0.1:' + server.address().port + '/';
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader',
         '--enable-unsafe-swiftshader', '--no-sandbox']
});
const errors = [];
const failed = [];
const sceneRequests = [];
let report = {};
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => errors.push(String(e).slice(0, 500)));
  page.on('requestfailed', request => failed.push({
    url: request.url(), message: request.failure()?.errorText
  }));
  page.on('response', response => {
    if (/\.(glb|gltf|wasm)(?:\?|$)/i.test(response.url())) {
      sceneRequests.push({ url: response.url(), status: response.status() });
    }
  });
  const nav = await page.goto(localUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(14000);
  const state = await page.evaluate(() => ({
    classes: document.body.className,
    canvasCount: document.querySelectorAll('canvas.webgl').length,
    canvasDimensions: [...document.querySelectorAll('canvas.webgl')].map(c => [c.width, c.height]),
    videos: document.querySelectorAll('video').length,
    audio: document.querySelectorAll('audio').length
  }));
  report = {
    referenceUrl: url.href,
    mode: 'temporary source-backed replay; not standalone or republished',
    localStatus: nav.status(),
    webglReady: state.classes.includes('webgl-ready'),
    state, sceneRequests, errors, failed
  };
  report.replayOk = report.localStatus === 200 && report.webglReady &&
                    state.canvasCount > 0 && sceneRequests.some(r => r.status === 200);
  await page.close();
} finally {
  await browser.close();
  await new Promise(ok => server.close(ok));
}
await writeFile(resolve(out, 'replay-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  source: url.href, htmlBytes: Buffer.byteLength(html),
  replayOk: report.replayOk, webglReady: report.webglReady,
  sceneRequests: sceneRequests.length, errors: errors.length,
  failedRequests: failed.length
}, null, 2));
// Nonzero only if the source-backed local replay truly failed.
if (!report.replayOk) process.exitCode = 1;
