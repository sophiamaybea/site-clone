'use client';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Maximize2,X} from 'lucide-react';
import {photos} from '@/lib/content';
export function PhotoGallery({compact=false}:{compact?:boolean}){
 const [selected,setSelected]=useState<number|null>(null);
 useEffect(()=>{if(selected===null)return;const key=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft')setSelected(x=>x===null?null:(x+photos.length-1)%photos.length);if(e.key==='ArrowRight')setSelected(x=>x===null?null:(x+1)%photos.length);if(e.key==='Escape'){e.stopPropagation();setSelected(null)}};window.addEventListener('keydown',key,true);return()=>window.removeEventListener('keydown',key,true)},[selected]);
 return <div className={`gallery ${compact?'gallery-compact':''}`}><div className="gallery-intro"><span>AN ANALOG LITTLE ARCHIVE</span><p>Fragments, photographs and the things worth keeping.</p></div>
 <div className="photo-board">{photos.map((p,i)=><button className="photo-card" type="button" key={p.src} style={{'--r':`${[-8,5,-4,7,-6,4][i]}deg`,'--delay':`${i*50}ms`} as React.CSSProperties} onClick={()=>setSelected(i)} aria-label={`Enlarge photograph: ${p.caption}`}><span className="photo-card-img"><img loading="lazy" src={p.src} alt={p.caption}/><Maximize2 className="photo-zoom" size={18}/></span><span className="photo-caption">{p.caption}</span></button>)}</div>
 {selected!==null&&<div className="lightbox" role="dialog" aria-label="Photograph viewer" aria-modal="true" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><button className="lightbox-close" aria-label="Close photo" onClick={()=>setSelected(null)}><X/></button><button className="lightbox-prev" aria-label="Previous photograph" onClick={()=>setSelected((selected+photos.length-1)%photos.length)}><ArrowLeft/></button><figure><img src={photos[selected].src} alt={photos[selected].caption}/><figcaption>{photos[selected].caption} / {photos[selected].place}</figcaption></figure><button className="lightbox-next" aria-label="Next photograph" onClick={()=>setSelected((selected+1)%photos.length)}><ArrowRight/></button><span className="lightbox-counter">{String(selected+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span></div>}
 </div>
}
