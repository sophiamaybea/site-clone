/**
 * WebGL / scroll-state parity diagnostic for the author's authorised practice clone.
 *
 * Unlike hero screenshots, this compares the *entered*, active WebGL story at
 * multiple scroll positions on desktop and mobile. It is a diagnostic: exact
 * pixels vary with GPU drivers, frame timing, and browser environment.
 */
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const ORIGINAL = 'https://sleep-well-creatives.com/';
const CLONE = 'https://sleep-well-faithful-clone.vercel.app/';
const STOPS = [0.12, 0.34, 0.57, 0.79, 0.94];
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 }
];
const outputDir = path.resolve('audit-motion');
fs.mkdirSync(outputDir, { recursive: true });

async function capture(browser, url, viewport, name) {
  const context = await browser.newContext({
    viewport, deviceScaleFactor: 1, reducedMotion: 'reduce',
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();
  const pageErrors = [];
  const badResponses = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push({
      status: response.status(), url: response.url()
    });
  });
  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded', timeout: 60000
    });
    await page.waitForTimeout(6500);
    const entry = page.locator('.preloader__content');
    if (await entry.count()) {
      await entry.click({ force: true, timeout: 10000 });
      await page.waitForTimeout(2700);
    }
    const runtime = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const height = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
      );
      let hasWebGLContext = false;
      if (canvas) {
        try {
          hasWebGLContext = !!(
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')
          );
        } catch (_) {
          // Browsers can forbid re-fetching the active context.
        }
      }
      return {
        documentHeight: height,
        canvasCount: document.querySelectorAll('canvas').length,
        ready: !!document.querySelector('.webgl-ready'),
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        hasWebGLContext
      };
    });
    const snapshots = [];
    for (const fraction of STOPS) {
      const position = await page.evaluate(value => {
        const full = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight
        );
        const target = Math.max(0, full - innerHeight) * value;
        window.scrollTo({ top: target, behavior: 'instant' });
        return target;
      }, fraction);
      await page.waitForTimeout(1850);
      const actualScroll = await page.evaluate(() => window.scrollY);
      const file = path.join(
        outputDir, `${name}-${viewport.width}-${Math.round(fraction * 100)}.png`
      );
      await page.screenshot({ path: file, animations: 'disabled' });
      snapshots.push({
        fraction, targetScroll: Math.round(position),
        actualScroll: Math.round(actualScroll), file
      });
    }
    return {
      http: response ? response.status() : 0,
      runtime, pageErrors: pageErrors.slice(0, 8),
      badResponses: badResponses.slice(0, 12), snapshots
    };
  } finally {
    await context.close();
  }
}

(async () => {
  const { default: pixelmatch } = await import('pixelmatch');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage',
      '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader']
  });
  const report = { date: new Date().toISOString(), site: ORIGINAL,
    replica: CLONE, viewports: [], warnings: [] };
  try {
    for (const viewport of VIEWPORTS) {
      const original = await capture(browser, ORIGINAL, viewport, 'original');
      const replica = await capture(browser, CLONE, viewport, 'clone');
      const stops = [];
      for (let i = 0; i < STOPS.length; i++) {
        const a = PNG.sync.read(fs.readFileSync(original.snapshots[i].file));
        const b = PNG.sync.read(fs.readFileSync(replica.snapshots[i].file));
        const diff = new PNG({ width: a.width, height: a.height });
        const pixels = pixelmatch(
          a.data, b.data, diff.data, a.width, a.height,
          { threshold: 0.12, includeAA: false }
        );
        const percent = Number((100 * pixels / (a.width * a.height)).toFixed(4));
        const target = path.join(
          outputDir, `diff-${viewport.width}-${Math.round(STOPS[i] * 100)}.png`
        );
        fs.writeFileSync(target, PNG.sync.write(diff));
        stops.push({
          fraction: STOPS[i], differingPixels: pixels,
          percent, scrollDelta: Math.abs(
            original.snapshots[i].actualScroll -
            replica.snapshots[i].actualScroll
          )
        });
        if (percent > 20) report.warnings.push(
          `Visual drift at ${viewport.width}px / ${STOPS[i]}: ${percent}%`
        );
      }
      if (replica.http !== 200 || !replica.runtime.canvasCount) {
        throw new Error(`Clone missing page or canvas at ${viewport.width}px`);
      }
      if (replica.pageErrors.length) {
        report.warnings.push(
          `Clone page errors at ${viewport.width}px: ${replica.pageErrors.join('; ')}`
        );
      }
      report.viewports.push({ viewport, original, replica, stops });
      console.log('SCROLL_PARITY', JSON.stringify({
        width: viewport.width,
        original: original.runtime,
        replica: replica.runtime,
        checkpoints: stops
      }));
    }
    fs.writeFileSync(
      path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2)
    );
    console.log('SCROLL_PARITY_SUMMARY', JSON.stringify({
      warnings: report.warnings,
      output: path.join(outputDir, 'report.json')
    }));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error('SCROLL_PARITY_FAILURE', error.stack || error);
  process.exitCode = 1;
});
