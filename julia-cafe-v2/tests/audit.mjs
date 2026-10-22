/** Browser audit: run with Playwright installed and NEXT_PUBLIC_BASE_URL set. */
import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const base=process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
for (const [label,width,height] of [['desktop',1440,900],['tablet',820,1100],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 const issues=[];page.on('pageerror',e=>issues.push(e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('#cafe').scrollIntoViewIfNeeded();
 await page.screenshot({path:`tests/${label}-cafe.png`,animations:'disabled'});
 for(const key of ['machine','camera','cup','music','pastry','notebook','phone','desktop']){
  await page.locator(`.cafe-hotspot-${key}`).click({force:true});
  if(!await page.locator('.experience-panel').isVisible())issues.push(`${key} modal missing`);
  await page.keyboard.press('Escape');
  if(await page.locator('.experience-panel').count())issues.push(`${key} modal did not close`);
 }
 const laptop=await page.locator('.cafe-laptop-screen').count(); if(!laptop)issues.push('Photographic laptop screen missing');\n const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
 console.log(JSON.stringify({label,overflow,issues}));
 await page.close();
}
await browser.close();
