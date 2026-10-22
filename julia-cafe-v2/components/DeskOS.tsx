'use client';
import {useState,useRef,useEffect} from 'react';
import {FolderOpen,Camera,NotebookPen,Disc3,Mail,X,Maximize2,Minus,ArrowUpRight} from 'lucide-react';
import {PhotoGallery} from './PhotoGallery';
import {MusicPlayer} from './MusicPlayer';
type AppId='projects'|'photos'|'notes'|'music'|'hello';
type WindowState={id:AppId;x:number;y:number;z:number};
const programs:[AppId,string,typeof FolderOpen][]=[['projects','projects',FolderOpen],['photos','photographs',Camera],['notes','notes',NotebookPen],['music','radio',Disc3],['hello','say hello',Mail]];
export function DeskOS(){
 const [windows,setWindows]=useState<WindowState[]>([{id:'projects',x:17,y:14,z:1}]);
 const seq=useRef(2);
 const [time,setTime]=useState('');
 useEffect(()=>{const update=()=>setTime(new Intl.DateTimeFormat('en',{hour:'numeric',minute:'2-digit'}).format(new Date()));update();const t=setInterval(update,60000);return()=>clearInterval(t)},[]);
 function openApp(id:AppId){const z=seq.current++;setWindows(w=>w.some(item=>item.id===id)?w.map(item=>item.id===id?{...item,z}:item):[...w,{id,x:14+(z%4)*7,y:14+(z%3)*8,z}])}
 function close(id:AppId){setWindows(w=>w.filter(x=>x.id!==id))}
 function moveWindow(id:AppId,dx:number,dy:number){setWindows(w=>w.map(x=>x.id===id?{...x,x:Math.max(1,Math.min(68,x.x+dx)),y:Math.max(8,Math.min(68,x.y+dy))}:x))}
 function focus(id:AppId){const z=seq.current++;setWindows(w=>w.map(x=>x.id===id?{...x,z}:x))}
 return <div className="desk-os"><div className="os-menubar"><span className="os-brand">JULIA / DESKTOP</span><span className="os-date">A LITTLE BIT OF EVERYTHING</span><time>{time}</time></div>
 <div className="os-wallpaper"><div className="wallpaper-frame"><span>WELCOME TO</span><strong>the little<br/>desktop.</strong><span>feel free to look around</span></div>
 <div className="os-apps">{programs.map(([id,label,Icon])=><button type="button" className="os-app" onDoubleClick={()=>openApp(id)} onClick={()=>openApp(id)} key={id}><span className="os-app-graphic"><Icon size={27} strokeWidth={1.45}/></span><span>{label}</span></button>)}</div>
 {windows.map(w=><DeskWindow key={w.id} item={w} onClose={()=>close(w.id)} onFocus={()=>focus(w.id)} onMove={(dx,dy)=>moveWindow(w.id,dx,dy)}/>)}
 </div><div className="os-taskbar"><button type="button" className="os-start" onClick={()=>openApp('projects')}>J / WORLD</button><div className="os-tabs">{windows.map(w=><button type="button" key={w.id} onClick={()=>focus(w.id)}>{w.id}</button>)}</div><span>CLICK TO OPEN</span></div></div>
}
function DeskWindow({item,onClose,onFocus,onMove}:{item:WindowState;onClose:()=>void;onFocus:()=>void;onMove:(dx:number,dy:number)=>void}){
 const drag=useRef<{x:number;y:number}|null>(null);const [full,setFull]=useState(false);
 function move(e:React.PointerEvent){if(!drag.current)return;const rect=e.currentTarget.closest('.os-wallpaper')?.getBoundingClientRect();if(!rect)return;onMove((e.clientX-drag.current.x)/rect.width*100,(e.clientY-drag.current.y)/rect.height*100);drag.current={x:e.clientX,y:e.clientY}}
 const program=programs.find(x=>x[0]===item.id);const Icon=program?.[2]??FolderOpen;
 return <section className={`os-window ${full?'os-window-max':''}`} aria-label={`${item.id} window`} style={{left:`${item.x}%`,top:`${item.y}%`,zIndex:item.z}} onPointerDown={onFocus}>
 <div className="os-window-bar" onPointerDown={e=>{if((e.target as HTMLElement).closest('button'))return;drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);onFocus()}} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><div className="os-window-controls"><button type="button" aria-label="Close window" onClick={onClose}><X size={12}/></button><button type="button" aria-label="Minimise window" onClick={onClose}><Minus size={12}/></button><button type="button" aria-label="Toggle maximize" onClick={()=>setFull(p=>!p)}><Maximize2 size={10}/></button></div><strong><Icon size={13}/> {program?.[1]??item.id}</strong><span>JULIA.EXE</span></div>
 <div className="os-window-body">{item.id==='projects'?<><div className="os-window-kicker">SELECTED WORK / THINGS IN PROGRESS</div><h3>things I&apos;m making</h3><div className="project-stack"><article><span>01 / CREATIVE WORK</span><strong>Ideas that became things.</strong><p>A notebook of experiments, research and little obsessions.</p></article><article><span>02 / WORDS</span><strong>Stories from everywhere.</strong><p>Essays, observations and the things we almost forget.</p></article><article><span>03 / STUDY</span><strong>Making sense of things.</strong><p>Economics, code and creative questions.</p></article></div></>:null}
 {item.id==='photos'?<PhotoGallery compact/>:null}
 {item.id==='notes'?<><div className="os-window-kicker">UNFINISHED THOUGHTS</div><h3>notes to self</h3><div className="hand-notes">notice the small things<br/>leave room for the unexpected<br/>start before you feel ready<br/>take the scenic route</div></>:null}
 {item.id==='music'?<MusicPlayer/>:null}
 {item.id==='hello'?<><div className="os-window-kicker">INBOX / OPEN</div><h3>say hello.</h3><p>For the original portfolio and Julia&apos;s real contact details, visit the source website.</p><a href="https://www.juliaalvarenga.com/" target="_blank" rel="noreferrer" className="pill-link">Visit the original <ArrowUpRight size={16}/></a></>:null}
 </div></section>
}
