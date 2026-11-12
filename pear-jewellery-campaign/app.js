(() => {
'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const stage = document.getElementById('stage');
const story = document.getElementById('experience');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const marker = document.getElementById('smallMarker');
const chapterName = document.getElementById('chapterName');
const percent = document.getElementById('progressPercent');
const fill = document.getElementById('trackFill');
const side = document.getElementById('sideCounter');
const headline = document.querySelector('.story-headline');
const sceneData = [
 {name:'01 / THE INTRODUCTION', marker:'THE BEGINNING OF EXCESS', title:'MORE IS<br><em>MORE.</em>', text:'A jewellery house for the woman who has never once said, “Perhaps I should take something off.”', number:'I — V'},
 {name:'02 / THE OBSESSION', marker:'ANATOMY OF AN EXCELLENT IDEA', title:'ONE<br><em>MORE.</em>', text:'A ring for every finger. Then another one, just in case.', number:'II — V'},
 {name:'03 / THE ICONS', marker:'YOUTH WAS NEVER THE POINT', title:'GOLD<br><em>OLD.</em>', text:'The best-dressed woman in the room might be seventy-eight. Ask her where she got that ring.', number:'III — V'},
 {name:'04 / THE INHERITANCE', marker:'FOR AN IMPROPER LIFE', title:'NOT<br><em>SORRY.</em>', text:'Keep the stories. Keep the jewellery. Wear both all at once.', number:'IV — V'},
 {name:'05 / THE AFTERPARTY', marker:'A COMPLETELY UNNECESSARY AMOUNT', title:'ALL OF<br><em>IT.</em>', text:'The only rule: never confuse being noticed with asking permission.', number:'V — V'}
];
let active = -1;
let target = 0;
let current = 0;
let raf = 0;
let scrollHeight = 0;
let scrollTop = 0;
let viewport = innerHeight;
let dust = null, ctx = null, seedParticles = [];
const initMedia = async () => {
 const names = ['hero','elders','solo'];
 await Promise.all(names.map(async name => {
  try {
   const response = await fetch('./assets/' + name + '.b64.txt');
   if (!response.ok) throw new Error('Missing asset');
   const value = (await response.text()).trim();
   if (!/^[A-Za-z0-9+/]+=*$/.test(value)) throw new Error('Invalid asset');
   document.querySelectorAll('[data-photo="' + name + '"]').forEach(img => {
    img.src = 'data:image/webp;base64,' + value;
    img.decoding='async';
   });
  } catch(e) {
   console.warn('Campaign photograph could not be loaded',name,e);
   document.querySelectorAll('[data-photo="' + name + '"]').forEach(img => { img.alt='Photographic campaign preview temporarily unavailable'; img.style.opacity='0';});
  }
 }));
};
function setupCanvas() {
 dust=document.createElement('canvas');
 dust.setAttribute('aria-hidden','true');
 dust.style.cssText='pointer-events:none;position:absolute;inset:0;width:100%;height:100%;z-index:2;opacity:.24;';
 stage.insertBefore(dust,stage.firstChild);
 ctx=dust.getContext('2d', {alpha:true});
 seedParticles=Array.from({length:175},(_,i)=>({
  x:Math.sin(i*127.1)*43758.5453%1,
  y:Math.sin(i*411.4)*94813.45%1,
  size:1+(i%5)*.85,
  phase:(i%11)*.8
 }));
 seedParticles.forEach(d=>{d.x=Math.abs(d.x);d.y=Math.abs(d.y)});
 resizeCanvas();
}
function resizeCanvas(){
 if(!dust)return;
 const scale=Math.min(devicePixelRatio||1,2);
 dust.width=Math.round(innerWidth*scale);dust.height=Math.round(innerHeight*scale);
 ctx.setTransform(scale,0,0,scale,0,0);
}
function renderDust(value){
 if(!ctx)return;
 ctx.clearRect(0,0,innerWidth,innerHeight);
 ctx.fillStyle=(active===1||active===3)?'#151515':'#fff6e5';
 const swirl=value*Math.PI*5;
 for(const d of seedParticles){
  const x=(d.x*innerWidth + Math.sin(d.phase+swirl)*28);
  const y=(d.y*innerHeight + Math.cos(d.phase+swirl)*18);
  ctx.beginPath();ctx.arc(x,y,d.size,0,Math.PI*2);ctx.fill();
 }
}
function measure(){
 viewport=innerHeight;
 scrollTop=story.getBoundingClientRect().top+scrollY;
 scrollHeight=Math.max(1,story.offsetHeight-viewport);
 resizeCanvas();
 updateTarget();
}
function updateTarget(){
 target=Math.max(0,Math.min(1,(scrollY-scrollTop)/scrollHeight));
 if(reduced.matches)current=target;
 if(!raf)raf=requestAnimationFrame(tick);
}
function switchScene(index){
 if(index===active)return;
 active=index;
 stage.dataset.chapter=String(index);
 headline.classList.add('swap');
 // No content is hidden permanently when motion is reduced.
 const apply=()=>{
  const scene=sceneData[index];
  chapterName.textContent=scene.name;
  marker.textContent=scene.marker;
  storyTitle.innerHTML=scene.title;
  storyText.textContent=scene.text;
  side.textContent=scene.number;
  headline.classList.remove('swap');
 };
 if(reduced.matches)apply();
 else setTimeout(apply,135);
}
function tick(){
 raf=0;
 current+= (target-current)*(reduced.matches?1:.15);
 if(Math.abs(target-current)<.00035)current=target;
 const segment=Math.min(4,Math.floor(current*5));
 switchScene(segment);
 percent.textContent=String(Math.round(current*100)).padStart(3,'0')+'%';
 fill.style.width=(current*100).toFixed(2)+'%';
 if(!reduced.matches)renderDust(current);
 if(current!==target)raf=requestAnimationFrame(tick);
}
const menuButton=document.getElementById('menuToggle');
const menu=document.getElementById('mainMenu');
const setMenu=(open)=>{
 menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));
 menuButton.querySelector('.menu-glyph').textContent=open?'×':'↗';
 document.body.style.overflow=open?'hidden':'';
 if(open)menu.querySelector('a').focus();else menuButton.focus();
};
menuButton.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&!menu.hidden)setMenu(false)});
window.addEventListener('scroll',updateTarget,{passive:true});
window.addEventListener('resize',measure,{passive:true});
reduced.addEventListener('change',()=>{if(reduced.matches && ctx)ctx.clearRect(0,0,dust.width,dust.height); updateTarget()});
setupCanvas();
measure();
initMedia();
})();
