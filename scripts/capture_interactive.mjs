#!/usr/bin/env node
/**
 * Inspect a public interactive site with a real Chromium browser.
 * Evidence-only: captures screenshots, network manifests, and WebGL/scroll state.
 * Does not mirror/publish someone else's assets or execute arbitrary shell code.
 *
 * Usage: node scripts/capture_interactive.mjs https://example.com ./capture
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = process.argv[2];
const out = resolve(process.argv[3] || './interactive-capture');
if (!target) {
  console.error('Usage: node scripts/capture_interactive.mjs https://example.com [output-dir]');
  process.exit(2);
}
const url = new URL(target);
if (!['http:', 'https:'].includes(url.protocol) || !url.hostname ||
    ['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
  console.error('Pass a public HTTP(S) URL.');
  process.exit(2);
}
await mkdir(out, { recursive: true });

const resources = new Map();
const failures = [];
const pageErrors = [];
const captures = [];
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader',
         '--enable-unsafe-swiftshader', '--no-sandbox']
});

try {
  for (const viewport of [
    { width: 1440, height: 900, label: 'desktop' },
    { width: 390, height: 844, label: 'mobile' }
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
      acceptDownloads: false
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      // Observe context creation without replacing or modifying the renderer.
      window.__captureWebglRequests = [];
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        if (String(type).toLowerCase().includes('webgl')) {
          window.__captureWebglRequests.push(String(type));
        }
        return original.call(this, type, ...args);
      };
    });
    page.on('response', response => {
      const request = response.request();
      resources.set(response.url(), {
        url: response.url(),
        status: response.status(),
        type: request.resourceType(),
        contentType: response.headers()['content-type'] || ''
      });
    });
    page.on('requestfailed', req => failures.push({
      viewport: viewport.label,
      url: req.url(),
      error: req.failure()?.errorText || 'request failed'
    }));
    page.on('pageerror', error => pageErrors.push({
      viewport: viewport.label,
      message: String(error).slice(0, 500)
    }));
    let navStatus = null;
    try {
      const response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 45000 });
      navStatus = response?.status() ?? null;
      // Allow Webflow, module JS, GLTF and media preloaders to initialize.
      await page.waitForTimeout(8500);
      const enter = page.locator('.preloader__content').first();
      if (await enter.count() && await enter.isVisible().catch(() => false)) {
        await enter.click({ timeout: 3500 }).catch(() => {});
        await page.waitForTimeout(4000);
      }
      for (let step = 0; step < 7; step++) {
        if (step > 0) {
          await page.mouse.wheel(0, Math.round(viewport.height * 1.15));
          await page.waitForTimeout(1150);
        }
        if ([0, 2, 4, 6].includes(step)) {
          const file = viewport.label + '-step-' + step + '.png';
          // Always save the browser state, even if a GPU screenshot times out.
          const state = await page.evaluate(() => ({
            y: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            bodyClasses: document.body.className,
            canvases: [...document.querySelectorAll('canvas')].map(c => ({
              className: c.className, width: c.width, height: c.height
            })),
            contextRequests: window.__captureWebglRequests || [],
            videos: document.querySelectorAll('video').length,
            audio: document.querySelectorAll('audio').length,
            preloader: !!document.querySelector('.preloader'),
            gsapGlobal: !!window.gsap,
            lenisGlobal: !!window.lenis
          }));
          let screenshot = null;
          let screenshotError = null;
          try {
            // DevTools capture bypasses Playwright's expensive font/animation wait.
            const cdp = await context.newCDPSession(page);
            const shot = await Promise.race([
              cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('CDP screenshot timed out')), 10000))
            ]);
            await writeFile(resolve(out, file), Buffer.from(shot.data, 'base64'));
            screenshot = file;
            await cdp.detach();
          } catch (err) {
            screenshotError = String(err).slice(0, 250);
          }
          captures.push({ viewport: viewport.label, step, screenshot, screenshotError, ...state });
        }
      }
    } catch (err) {
      pageErrors.push({ viewport: viewport.label, message: 'Capture exception: ' + String(err) });
    }
    captures.push({ viewport: viewport.label, navigationStatus: navStatus });
    await context.close();
  }
} finally {
  await browser.close();
}

const network = [...resources.values()];
const assetPattern = /\.(glb|gltf|ktx2|bin|wasm|riv|sog|hdr|exr|mp4|webm|mp3|woff2?)(?:\?|$)/i;
const sceneAssets = network.filter(item => assetPattern.test(new URL(item.url).pathname));
const report = {
  source: url.href,
  capturedAt: new Date().toISOString(),
  mode: 'inspect only: original assets not redistributed',
  captures,
  assets: sceneAssets,
  network,
  requestFailures: failures,
  pageErrors
};
await writeFile(resolve(out, 'capture.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  source: url.href,
  screenshots: captures.filter(c => c.screenshot).length,
  networkRequests: network.length,
  sceneAssets: sceneAssets.length,
  pageErrors: pageErrors.length,
  requestFailures: failures.length,
  output: out
}, null, 2));
if (!captures.some(c => c.screenshot)) process.exitCode = 1;
