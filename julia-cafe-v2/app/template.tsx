'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * A layer that sits over the reference scene's chroma-green laptop.
 * Positioned with measurements taken from the original site's cafe hotspot.
 * The overlay is rendered into the scene with a portal to preserve React ownership.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [scene, setScene] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = document.querySelector<HTMLElement>('.cafe-scene');
    if (node) setScene(node);
  }, []);
  return <>
    {children}
    <style>{`
      .cafe-laptop-screen{position:absolute;z-index:3;left:35.5414%;top:38.4129%;width:25.33%;height:26.82%;overflow:hidden;pointer-events:none;transform:skew(-.5deg);background:#15375d url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=960&q=88') center 56%/cover no-repeat;border:1px solid #060a10;box-shadow:inset 0 0 20px #0007}
      .cafe-laptop-screen:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0610217a,transparent 30%,#07152a32);pointer-events:none}
      .cafe-laptop-menu{height:8%;display:flex;align-items:center;justify-content:space-between;position:relative;background:#071323b8;color:#dce6f1;font:clamp(2px,.3vw,5px) Arial,sans-serif;padding:0 3%;white-space:nowrap}
      .cafe-laptop-icons{position:absolute;left:5%;top:17%;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:45%}
      .cafe-laptop-icons i{display:block;width:clamp(3px,.75vw,11px);aspect-ratio:1.1;background:#d7e2edcc;border-radius:2px;box-shadow:0 1px 2px #0009}
      .cafe-laptop-icons i:nth-child(3n){background:#c47982}
      .cafe-laptop-icons i:nth-child(5n){background:#f1d392}
      .cafe-laptop-folders{position:absolute;right:6%;top:18%;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;width:19%}
      .cafe-laptop-folders i{display:block;width:clamp(4px,.8vw,13px);aspect-ratio:1.3;background:#8dc5e9;clip-path:polygon(0 15%,30% 15%,40% 0,80% 0,83% 15%,100% 15%,100% 100%,0 100%)}
      .cafe-laptop-dock{position:absolute;bottom:4%;left:50%;transform:translateX(-50%);padding:1.5% 2%;background:#e9eff5b4;border:1px solid #fff8;border-radius:5px;display:flex;gap:3px}
      .cafe-laptop-dock i{display:block;width:clamp(3px,.58vw,9px);aspect-ratio:1;border-radius:2px;background:#db8fa9}
      .cafe-laptop-dock i:nth-child(2n){background:#8baac8}
      .cafe-laptop-dock i:nth-child(3n){background:#e8c772}
      @media(max-width:650px){.cafe-laptop-menu{font-size:2px}.cafe-laptop-icons i{width:3px}.cafe-laptop-folders i{width:4px}.cafe-laptop-dock i{width:3px}.cafe-floor{display:none}}
    `}</style>
    {scene && createPortal(<div className="cafe-laptop-screen" aria-hidden="true">
      <div className="cafe-laptop-menu"><span>Finder&nbsp;&nbsp;File&nbsp;&nbsp;Edit&nbsp;&nbsp;View</span><span>Thu 22&nbsp;&nbsp;10:41 AM</span></div>
      <div className="cafe-laptop-icons">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
      <div className="cafe-laptop-folders">{Array.from({length:4},(_,i)=><i key={i}/>)}</div>
      <div className="cafe-laptop-dock">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>
    </div>, scene)}
  </>;
}