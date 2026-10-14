const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');
const ROOT='https://studio-bea-pear-hybrid.vercel.app/collage-study/';
const DIR='collage-study-evidence';fs.mkdirSync(DIR,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const report=[];
 for(const v of [{width:1440,height:900},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:v,deviceScaleFactor:1,reducedMotion:'no-preference',ignoreHTTPSErrors:true});
  const page=await ctx.newPage();let errors=[],requests=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('response',resp=>{if(resp.status()>=400)requests.push({url:resp.url(),status:resp.status()})});
  const r=await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#loading').classList.contains('hidden'),{timeout:30000});
  await page.waitForTimeout(1100);
  const sprites=await page.locator('.walker').count();
  const buildings=await page.evaluate(()=>[...document.querySelectorAll('.building')].filter(x=>x.complete&&x.naturalWidth).length);
  const walkersLoaded=await page.evaluate(()=>[...document.querySelectorAll('.walker')].filter(x=>x.complete&&x.naturalWidth).length);
  const scenes=[];
  for(const percent of [0,.32,.52,.72,.96]){
   await page.evaluate(p=>scrollTo({top:p*(document.querySelector('#journey').offsetHeight-innerHeight),behavior:'instant'}),percent);
   await page.waitForTimeout(1100);
   const state=await page.evaluate(()=>({chapter:document.querySelector('#chapter').textContent,
    cityOpacity:getComputedStyle(document.querySelector('.building')).opacity,
    walkerOpacity:getComputedStyle(document.querySelector('.walker')).opacity,
    galleryOpacity:getComputedStyle(document.querySelector('#gallery-room')).opacity
   }));
   const file=path.join(DIR,'city-'+v.width+'-'+Math.round(percent*100)+'.png');
   await page.screenshot({path:file,timeout:30000,animations:'disabled'});
   scenes.push({percent,state,file});
  }
  const item={viewport:v,http:r.status(),sprites,walkersLoaded,buildings,errors,requests,scenes};
  report.push(item);
  console.log('COLLAGE_QA',JSON.stringify({viewport:v,respond:r.status(),walkersLoaded,buildings,errors,requests,states:scenes.map(s=>s.state)}));
  if(item.http!==200||item.sprites!==10||item.walkersLoaded!==10||item.buildings!==4||item.errors.length||item.requests.length)process.exitCode=1;
  if(+scenes[2].state.walkerOpacity<.01||+scenes[4].state.galleryOpacity<.8)process.exitCode=1;
  await ctx.close();
 }
 fs.writeFileSync(path.join(DIR,'report.json'),JSON.stringify(report,null,2));
}finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exitCode=1});