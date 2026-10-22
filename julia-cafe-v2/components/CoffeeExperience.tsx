'use client';
import {useEffect,useRef} from 'react';
export function CoffeeExperience(){
 const canvas=useRef<HTMLCanvasElement>(null);const wrap=useRef<HTMLElement>(null);
 useEffect(()=>{
 const node=canvas.current, section=wrap.current;if(!node||!section) return;
 const context=node.getContext('2d');if(!context) return;
 let animation=0;let inView=true;let progress=0;let last=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function size(){if(!node)return;const d=Math.min(devicePixelRatio||1,2);node.width=Math.round(node.clientWidth*d);node.height=Math.round(node.clientHeight*d)}
 const ro=new ResizeObserver(size);ro.observe(node);size();
 const io=new IntersectionObserver(e=>inView=e[0]?.isIntersecting??false,{rootMargin:'100px'});io.observe(section);
 function frame(t:number){animation=requestAnimationFrame(frame);if(!context||!node||!section||!inView||t-last<24)return;last=t;
 const rect=section.getBoundingClientRect();progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));
 const w=node.width,h=node.height,cx=w*.5,cy=h*.50,r=Math.min(w*.31,h*.38),wave=reduced?0:t*.00035;
 context.clearRect(0,0,w,h);
 let halo=context.createRadialGradient(cx,cy,r*.42,cx,cy,r*1.9);halo.addColorStop(0,'#c2a07f2a');halo.addColorStop(1,'#c2a07f00');context.fillStyle=halo;context.beginPath();context.arc(cx,cy,r*2,0,Math.PI*2);context.fill();
 context.save();context.translate(cx,cy);context.rotate(progress*.25);
 context.shadowColor='#170d0b7a';context.shadowBlur=r*.25;context.shadowOffsetY=r*.12;
 context.fillStyle='#e6d5c2';context.beginPath();context.arc(0,0,r*1.12,0,Math.PI*2);context.fill();context.shadowBlur=0;context.shadowOffsetY=0;
 context.strokeStyle='#e0c4ab';context.lineWidth=r*.13;context.beginPath();context.arc(r*.94,r*.05,r*.34,-Math.PI*.65,Math.PI*.65);context.stroke();
 context.fillStyle='#f4eadd';context.beginPath();context.arc(0,0,r,0,Math.PI*2);context.fill();
 const crema=context.createRadialGradient(-r*.2,-r*.28,0,0,0,r*.94);crema.addColorStop(0,'#ac6a36');crema.addColorStop(.6,'#68331d');crema.addColorStop(.95,'#3d1e12');crema.addColorStop(1,'#aa7448');context.fillStyle=crema;context.beginPath();context.arc(0,0,r*.88,0,Math.PI*2);context.fill();
 context.save();context.beginPath();context.arc(0,0,r*.84,0,Math.PI*2);context.clip();
 for(let j=0;j<11;j++){context.strokeStyle=j%2?'#f6d3a6bb':'#e4ab70b0';context.lineWidth=r*(.016+j*.001);context.beginPath();const start=j*.55+progress*4;for(let i=0;i<140;i++){let a=i/140*Math.PI*4+start+wave,rad=r*(.16+i/140*.5);const x=Math.cos(a+rad/r*.45)*rad,y=Math.sin(a)*rad*.82;if(i===0)context.moveTo(x,y);else context.lineTo(x,y)}context.stroke()}
 const bright=context.createRadialGradient(-r*.24,-r*.36,0,0,0,r*.9);bright.addColorStop(0,'#ffffff2a');bright.addColorStop(1,'#ffffff00');context.fillStyle=bright;context.beginPath();context.arc(0,0,r*.9,0,Math.PI*2);context.fill();context.restore();context.restore();
 }
 animation=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(animation);io.disconnect();ro.disconnect()}
 },[])
 useEffect(()=>{const node=wrap.current;if(!node)return;const els=node.querySelectorAll('.reveal-line');const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('appeared')}),{threshold:.4});els.forEach(el=>obs.observe(el));return()=>obs.disconnect()},[])
 return <><section className="coffee-experience" ref={wrap} aria-label="Scroll-controlled coffee scene"><div className="coffee-pin"><div className="coffee-noise"/><canvas className="coffee-canvas" ref={canvas} aria-label="Animated overhead illustration of coffee swirling in a cup" role="img"/><span className="coffee-note">GOOD THINGS ARE BREWING</span><span className="coffee-side coffee-side-left">A MOMENT TO PAUSE</span><span className="coffee-side coffee-side-right">03 / FRESHLY MADE</span></div></section>
 <section className="coffee-reveal" aria-label="A coffee-inspired phrase"><div className="reveal-sticky"><div className="reveal-lines"><p className="reveal-line">One big cup,</p><p className="reveal-line">one small leap.</p><p className="reveal-line"><strong>Sip, then conquer.</strong></p></div></div></section><div className="paper-to-floor" aria-hidden="true"/></>
}
