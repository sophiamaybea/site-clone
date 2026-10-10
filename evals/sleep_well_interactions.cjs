const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const result={};
 for(const [key,url] of Object.entries({original:'https://sleep-well-creatives.com/',clone:'https://sleep-well-faithful-clone.vercel.app/'})){
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',ignoreHTTPSErrors:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6500);
  const beforeEnter = await page.evaluate(() => ({ready:!!document.querySelector('.webgl-ready'), preloaderOpacity:getComputedStyle(document.querySelector('.preloader')).opacity}));
  await page.locator('.preloader__content').click({force:true,timeout:10000});
  await page.waitForTimeout(2700);
  const afterEnter = await page.evaluate(() => ({ready:!!document.querySelector('.webgl-ready'), preloaderOpacity:getComputedStyle(document.querySelector('.preloader')).opacity}));
  console.log('ENTER '+key+' '+JSON.stringify({beforeEnter,afterEnter}));
  const note=page.getByText('THE NOTE',{exact:true});
  const bodyNote=page.getByText('This website isn’t a product.',{exact:false});
  const before=(await bodyNote.count())?await bodyNote.first().isVisible():null;
  let clicked=false,open=null,closed=null,error=null;
  try{
   const trigger=page.locator('.trg-note');
   await trigger.click({force:true,timeout:6000});
   await page.waitForTimeout(700);
   clicked=true;
   open=(await bodyNote.count())?await bodyNote.first().isVisible():null;
   const close=page.locator('.note__close');
   await close.click({force:true,timeout:6000});
   await page.waitForTimeout(700);
   closed=(await bodyNote.count())?await bodyNote.first().isVisible():null;
  }catch(e){error=e.message.slice(0,150)}
  const details={noteTriggerCount:await note.count(),beforeEnter,afterEnter,before,clicked,open,closed,error,scrollHeight:await page.evaluate(()=>document.body.scrollHeight),errors:errors.slice(0,3)};
  result[key]=details;
  console.log('INTERACTION '+key+' '+JSON.stringify(details));
  await context.close();
 }
 await browser.close();
 if(result.original.open!==result.clone.open || result.original.closed!==result.clone.closed || result.original.before!==result.clone.before){
  console.error('INTERACTION_MISMATCH',JSON.stringify(result));process.exitCode=1;
 }
})().catch(e=>{console.error('INTERACTION_ERROR',e.message);process.exitCode=1})