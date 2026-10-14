const {chromium}=require('playwright');const fs=require('node:fs');
const SITE='https://studio-bea-pear-hybrid.vercel.app/';
const OUT='pear-hybrid-evidence';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report=[];
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'no-preference',ignoreHTTPSErrors:true});
   const page=await context.newPage();const errors=[],failures=[];
   page.on('pageerror',e=>errors.push(String(e.message)));
   page.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});
   const result=await page.goto(SITE,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>document.getElementById('loading').classList.contains('is-hidden'),null,{timeout:20000});
   await page.waitForTimeout(650);
   const umbrellaCount=await page.evaluate(()=>window.__studioUmbrellaCount||0);
   const spriteFiles=await Promise.all([
     'woman-white','man-back-black','woman-front-black','woman-green','man-green-back',
     'woman-red','woman-blue-back','man-side-grey','woman-dark-side','man-front-black'
   ].map(async name=>{
     const response=await page.request.get(SITE+'assets/umbrellas/'+name+'.webp');
     return {name,status:response.status()};
   }));
   if(umbrellaCount!==10||spriteFiles.some(f=>f.status!==200)){
     throw new Error('Supplied umbrella sprites not loaded: '+JSON.stringify({umbrellaCount,spriteFiles}));
   }
   const checks=[];
   for(const f of [0,.13,.30,.47,.57,.71,.87,.98]){
    await page.evaluate(f=>{
     const film=document.getElementById('story');window.scrollTo({top:(film.offsetHeight-innerHeight)*f,behavior:'instant'});
    },f);
    await page.waitForTimeout(900);
    const snap=await page.evaluate(()=>{
     const c=document.getElementById('filmCanvas'),ctx=c.getContext('2d'),W=c.width,H=c.height;
     const p=ctx.getImageData(Math.floor(W*.42),Math.floor(H*.41),1,1).data;
     return {chapter:document.getElementById('chapterNo').textContent,
      canvas:{w:W,h:H,pixel:[...p]},
      overlays:[...document.querySelectorAll('.film-cue')].map(n=>Number(getComputedStyle(n).opacity))};
    });
    const file=`${OUT}/${viewport.width}-${Math.round(f*100)}.png`;
    await page.screenshot({path:file,animations:'disabled',timeout:18000});
    checks.push({fraction:f,...snap,file});
   }
   await page.evaluate(()=>document.querySelector('#work').scrollIntoView({behavior:'instant'}));
   await page.waitForTimeout(400);
   await page.screenshot({path:`${OUT}/${viewport.width}-work.png`,animations:'disabled'});
   const data={viewport,http:result.status(),checks,umbrellaCount,spriteFiles,errors,failures,
     workLink:await page.locator('.work-case a[href*="pagegalleryjournal.com"]').count(),
     contactLink:await page.locator('.contact a[href^="mailto:"]').count()};
   console.log('RESULT',JSON.stringify({width:viewport.width,http:data.http,chapters:checks.map(x=>x.chapter),
   errors:data.errors,failures:data.failures,case:data.workLink,contact:data.contactLink}));
   if(data.http!==200||data.errors.length||data.failures.length||!data.workLink||!data.contactLink||
      checks.some(x=>!x.canvas.w||x.overlays.every(v=>v===0))){process.exitCode=1;}
   report.push(data);await context.close();
  }
  fs.writeFileSync(`${OUT}/report.json`,JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error('AUDIT_FAILURE',e.stack||e);process.exitCode=1;});
