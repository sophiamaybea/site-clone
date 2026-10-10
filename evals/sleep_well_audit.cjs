const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
 const sites = { reference: 'https://sleep-well-creatives.com/', replica: 'https://sleep-well-faithful-clone.vercel.app/' };
 const findings = {};
 for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const records = {};
  for (const [name, url] of Object.entries(sites)) {
   const context = await browser.newContext({ viewport, reducedMotion: 'reduce', deviceScaleFactor: 1, ignoreHTTPSErrors: true });
   const page = await context.newPage();
   const pageErrors = [], failing = [];
   page.on('pageerror', error => pageErrors.push(error.message.slice(0, 120)));
   page.on('response', response => { if (response.status() >= 400) failing.push(response.status() + ' ' + response.url().slice(0, 120)); });
   const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
   await page.waitForTimeout(6500);
   const dom = await page.evaluate(() => ({
     title: document.title, textLength: document.body.innerText.length,
     pageHeight: document.body.scrollHeight, images: document.images.length,
     canvases: document.querySelectorAll('canvas').length,
     brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
     h1: [...document.querySelectorAll('h1')].map(x=>x.textContent.trim()).slice(0,5),
     css: [...document.styleSheets].length,
     scripts: [...document.scripts].filter(x=>x.src.includes('visuals.js')||x.src.includes('index-8YjIcPvu')).map(x=>x.src)
   }));
   await page.screenshot({ path: `audit-${name}-${viewport.width}.png`, animations: 'disabled' });
   await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.42, behavior: 'instant' }));
   await page.waitForTimeout(1800);
   await page.screenshot({ path: `audit-${name}-${viewport.width}-mid.png`, animations: 'disabled' });
   records[name] = { http: response.status(), dom, pageErrors, failing: failing.slice(0, 10), failingCount: failing.length };
   await context.close();
  }
  const { default: pixelmatch } = await import('pixelmatch');
  const diffs = {};
  for (const suffix of ['', '-mid']) {
    const a = PNG.sync.read(fs.readFileSync(`audit-reference-${viewport.width}${suffix}.png`));
    const b = PNG.sync.read(fs.readFileSync(`audit-replica-${viewport.width}${suffix}.png`));
    const diff = new PNG({ width: a.width, height: a.height });
    const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.12, includeAA: false });
    diffs[suffix || 'hero'] = { differentPixels: changed, percent: Math.round(changed/(a.width*a.height)*10000)/100 };
    fs.writeFileSync(`audit-diff-${viewport.width}${suffix}.png`, PNG.sync.write(diff));
  }
  findings[viewport.width] = { records, diffs };
  console.log('AUDIT '+JSON.stringify({ viewport: viewport.width, reference: records.reference, replica: records.replica, pixelDiff: diffs }));
  if(records.replica.http !== 200 || records.replica.dom.textLength < 1000) process.exitCode = 1;
 }
 await browser.close();
})().catch(e=>{console.error('AUDIT_FAILURE',e.stack);process.exitCode=1});