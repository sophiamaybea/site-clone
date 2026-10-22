'use client';
import {useEffect, useRef} from 'react';
import {ArrowDown} from 'lucide-react';
import {image, icons} from '@/lib/content';
export function WorldHero() {
 const root = useRef<HTMLElement>(null);
 useEffect(()=>{
  let ctx: {revert:()=>void}|undefined;
  let cancelled = false;
  Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
   if(cancelled||!root.current) return;
   gsap.registerPlugin(ScrollTrigger);
   ctx=gsap.context(()=>{
    gsap.set('.world-icon',{opacity:0,scale:.22,rotation:(i:number)=>i%2?30:-30});
    gsap.to('.world-icon',{opacity:1,scale:1,rotation:(i:number)=>icons[i].r,duration:1.45,ease:'expo.out',stagger:{from:'random',amount:.48},delay:.12});
    gsap.fromTo('.world-logo',{clipPath:'inset(0 100% 0 0)',opacity:1},{clipPath:'inset(0 0% 0 0)',duration:1.5,ease:'steps(28)',delay:.3});
    gsap.to('.world-icon',{y:(i:number)=>i%2?'-24vh':'26vh',x:(i:number)=>i%3?'9vw':'-12vw',rotation:(i:number)=>icons[i].r+(i%2?115:-95),scale:.72,opacity:.2,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom bottom',scrub:true}});
    gsap.to('.world-logo',{scale:.8,opacity:0,ease:'none',scrollTrigger:{trigger:root.current,start:'25% top',end:'90% top',scrub:true}});
   },root);
  }).catch(()=>{});
  return()=>{cancelled=true;ctx?.revert()};
 },[]);
 return <section className="world" ref={root} id="top" aria-label="Introductory illustrated world">
  <div className="world-pin"><div className="world-glow" aria-hidden="true"/>
   <div className="world-icons" aria-hidden="true">{icons.map((obj,i)=><img className="world-icon" key={obj.file} src={image(`/images/icons/${obj.file}`)} loading={i<8?'eager':'lazy'} style={{'--x':`${obj.x}%`,'--y':`${obj.y}%`,'--w':`${obj.w}px`,'--rotate':`${obj.r}deg`} as React.CSSProperties} alt=""/>)}</div>
   <div className="world-centre"><p className="world-overline">MADE UP OF A LITTLE BIT OF EVERYTHING</p><img className="world-logo" src={image('/images/julias-world.svg')} alt="Julia’s World"/><p className="world-desc">an internet corner, made with curiosity.</p></div>
   <div className="world-bottom"><span>001 / A LITTLE INTRODUCTION</span><a href="#bio" aria-label="Scroll to the introduction">KEEP SCROLLING <ArrowDown size={18} strokeWidth={1.5}/></a><span>AN INTERACTIVE PORTFOLIO STUDY</span></div>
  </div></section>
}
