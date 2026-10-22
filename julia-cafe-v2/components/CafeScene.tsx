'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {ArrowDown,Plus,MousePointer2} from 'lucide-react';
import {image,stops,type StopKey} from '@/lib/content';
import {ExperienceOverlay} from './ExperienceOverlay';
export function CafeScene(){const [active,setActive]=useState<StopKey|null>(null);const [failed,setFailed]=useState(false);const section=useRef<HTMLElement>(null);const close=useCallback(()=>setActive(null),[]);
 useEffect(()=>{if(!section.current)return;const observe=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('cafe-visible')})},{threshold:.15});observe.observe(section.current);return()=>observe.disconnect()},[]);
 return <><section className="cafe" ref={section} id="cafe" aria-labelledby="cafe-heading"><header className="cafe-intro"><div className="cafe-mini-kicker">04 / COME ON IN</div><h2 id="cafe-heading">take a look around.</h2><p>Everything here has a little story. Tap an object to explore.</p><ArrowDown size={20} strokeWidth={1.4}/></header><div className="cafe-scene-outer"><div className={`cafe-scene ${failed?'cafe-scene-no-image':''}`}>
 <img className="cafe-main-photo" src={image('/images/cafe/cafe-scene.jpg')} alt="Photographic café counter with a laptop, camera, cup, pastries and personal items" loading="eager" onError={()=>setFailed(true)} draggable={false}/>
 {failed?<div className="cafe-missing"><p>THE CAFÉ</p><strong>an interactive world</strong><span>The original photograph could not load. Use the object menu below to explore.</span></div>:null}
 {stops.map((s,i)=><button type="button" key={s.key} className={`cafe-hotspot cafe-hotspot-${s.key}`} style={{left:`${s.x}%`,top:`${s.y}%`,width:`${s.w}%`,height:`${s.h}%`,'--i':i} as React.CSSProperties} onClick={()=>setActive(s.key)} aria-label={s.label} title={s.label}><span className="cafe-plus"><Plus size={12} strokeWidth={2}/></span><span className="cafe-tooltip">{s.label}</span></button>)}
 <div className="cafe-tap-indicator"><MousePointer2 size={14}/><span>CLICK ANY PLUS TO EXPLORE</span></div></div></div>
 <nav className="cafe-mobile-nav" aria-label="Explore café objects">{stops.map((s,i)=><button type="button" key={s.key} onClick={()=>setActive(s.key)}><span>{String(i+1).padStart(2,'0')}</span>{s.label}</button>)}</nav>
 <div className="cafe-floor"><img src={image('/images/cafe/floor-reveal.webp')} alt="" loading="lazy"/></div></section>
 <ExperienceOverlay active={active} onClose={close} onSwitch={setActive}/></>
}
