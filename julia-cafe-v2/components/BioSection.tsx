'use client';
import {useEffect,useRef} from 'react';
import {image} from '@/lib/content';
const chips={SF:{img:'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=520&q=85',label:'san francisco',sub:'a little place to call home'},Economics:{img:image('/images/icons/harvard-cap.webp'),label:'economics',sub:'questions, numbers and curiosity'},writing:{img:image('/images/icons/pen.webp'),label:'all the little stories',sub:'and everything in between'}};
export function BioSection(){
 const section=useRef<HTMLElement>(null);
 useEffect(()=>{if(!section.current)return;const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting) x.target.classList.add('is-shown')})},{threshold:.25});obs.observe(section.current);return()=>obs.disconnect()},[])
 return <section className="bio" ref={section} id="bio" aria-label="About Julia"><div className="bio-inner">
  <p className="bio-statement">Made in Brazil, now in <Word k="SF"/>.<br/><Word k="Economics"/> at Harvard.<br/>Loves creating things,<br/><Word k="writing"/>, and, duh, coffee.</p>
  <p className="bio-hint">(hover over the bold stuff)</p>
  </div><div className="bio-index">02 — AN INTRODUCTION</div></section>
}
function Word({k}:{k:keyof typeof chips}){const item=chips[k];return <span className="bio-word" tabIndex={0} role="button" aria-label={`${k}: ${item.sub}`}>{k}<span className="bio-card"><span className="bio-card-photo"><img src={item.img} alt="" /></span><strong>{item.label}</strong><small>{item.sub}</small></span></span>}
