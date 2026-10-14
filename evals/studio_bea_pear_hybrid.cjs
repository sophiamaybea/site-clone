const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');
const URL='https://studio-bea-pear-hybrid.vercel.app/';
const OUT='pear-hybrid-evidence';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report=[];
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'no-preference',ignoreHTTPSErrors:true});
  const page=await context.newPage();const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.getElementById('load-shield').classList.contains('out'),null,{timeout:20000});
  await page.waitForTimeout(900);
  const scene=[];
  for(const progress of [0,.27,.50,.72,.98]){
   await page.evaluate(p=>scrollTo({top:(document.querySelector('#story').offsetHeight-innerHeight)*p,behavior:'instant'}),progress);
   await page.waitForTimeout(1600);
   const state=await page.evaluate(()=>({
     chapter:document.getElementById('count').innerText,
     city:getComputedStyle(document.getElementById('city-scene')).opacity,
     rain:getComputedStyle(document.getElementById('rain-scene')).opacity,
     cutouts:[...document.querySelectorAll('.figure')].filter(el=>Number(getComputedStyle(el).opacity)>.05).length,
     astronautLoaded:document.querySelector('#astronaut').naturalWidth>0,
     clipping:getComputedStyle(document.getElementById('gallery-reveal')).clipPath,
     imageErrors:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src)
   }));
   const file=path.join(OUT,'scene-'+viewport.width+'-'+Math.round(progress*100)+'.png');
   await page.screenshot({path:file,animations:'disabled',timeout:25000});
   scene.push({progress,...state,file});
  }
  await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(450);
  await page.screenshot({path:path.join(OUT,'work-'+viewport.width+'.png'),timeout:25000});
  await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(450);
  await page.screenshot({path:path.join(OUT,'contact-'+viewport.width+'.png'),timeout:25000});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  const p={viewport,http:response.status(),scene,overflow,errors,failed,
  contact:await page.locator('a[href^="mailto:"]').count(),
  pagegallery:await page.locator('a[href*="pagegalleryjournal.com"]').count()};
  report.push(p);
  console.log('ATELIER_V3',JSON.stringify({viewport,http:p.http,errors,failed,overflow,contact:p.contact,pagegallery:p.pagegallery,stages:scene.map(x=>({p:x.progress,chapter:x.chapter,city:x.city,rain:x.rain,cutouts:x.cutouts,astronaut:x.astronautLoaded,imageErrors:x.imageErrors}))}));
  if(p.http!==200||p.errors.length||p.failed.length||overflow>4||!p.contact||!p.pagegallery||scene.some(s=>s.imageErrors.length)||!scene[0].astronautLoaded||scene[2].cutouts<3)process.exitCode=1;
  await context.close();
 }
 fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));
}finally{await browser.close()}
})().catch(e=>{console.error('ATELIER_V3_ERROR',e.stack);process.exitCode=1});