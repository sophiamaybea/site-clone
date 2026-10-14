/**
 * Baseline verification only. We are deliberately NOT judging a Studio Bea reskin yet.
 * Checks that the author's original WebGL and scroll experience has survived
 * duplication into the separate Bea Sophia working prototype.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT='bea-prototype-evidence';
const SITES={
  original:'https://sleep-well-creatives.com/',
  prototype:'https://studio-bea-sleepwell-prototype.vercel.app/'
};
fs.mkdirSync(OUT,{recursive:true});
async function inspect(browser,url,name,viewport){
  const context=await browser.newContext({
    viewport,deviceScaleFactor:1,reducedMotion:'reduce',ignoreHTTPSErrors:true
  });
  const page=await context.newPage(),errors=[],failures=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});
  try{
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(6500);
    const enter=page.locator('.preloader__content');
    if(await enter.count()) {await enter.click({force:true,timeout:10000});await page.waitForTimeout(2500);}
    const stats=await page.evaluate(()=>({
      height:document.documentElement.scrollHeight,
      canvases:document.querySelectorAll('canvas').length,
      images:document.images.length,
      brokenImages:[...document.images].filter(x=>x.complete&&!x.naturalWidth).length,
      entered:document.querySelector('.preloader')?getComputedStyle(document.querySelector('.preloader')).opacity:'none',
      heading:document.querySelector('h1')?.textContent?.trim()
    }));
    const screenshots=[];
    for(const fraction of [0,.2,.45,.7,.9]){
      await page.evaluate(f=>window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*f),fraction);
      await page.waitForTimeout(1700);
      const filename=path.join(OUT,name+'-'+viewport.width+'-'+Math.round(fraction*100)+'.png');
      await page.screenshot({path:filename,animations:'disabled'});
      screenshots.push(filename);
    }
    return{status:response?.status(),...stats,errors:errors.slice(0,5),failures:failures.slice(0,5),screenshots};
  }finally{await context.close();}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const report=[];
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
    const original=await inspect(browser,SITES.original,'original',viewport);
    const prototype=await inspect(browser,SITES.prototype,'prototype',viewport);
    const entry={viewport,original,prototype};
    report.push(entry);
    console.log('BASELINE',JSON.stringify({
      width:viewport.width,
      original:{status:original.status,canvases:original.canvases,images:original.images,height:original.height},
      prototype:{status:prototype.status,canvases:prototype.canvases,images:prototype.images,height:prototype.height,errors:prototype.errors,failures:prototype.failures}
    }));
    if(prototype.status!==200||prototype.canvases<1||prototype.brokenImages||prototype.errors.length||prototype.failures.length)process.exitCode=1;
    if(prototype.canvases!==original.canvases||Math.abs(prototype.height-original.height)>20)process.exitCode=1;
  }
  fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(err=>{console.error('BASELINE_FAILURE',err.stack);process.exitCode=1});
