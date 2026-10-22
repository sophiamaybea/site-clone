'use client';
import {useEffect,useRef,useState} from 'react';
import {Play,Pause,Volume2} from 'lucide-react';
export function MusicPlayer(){
 const [playing,setPlaying]=useState(false);const [volume,setVolume]=useState(.15);const audio=useRef<AudioContext|null>(null);const oscillators=useRef<OscillatorNode[]>([]);const gains=useRef<GainNode[]>([]);
 function stop(){for(const oscillator of oscillators.current){try{oscillator.stop()}catch{}}oscillators.current=[];gains.current=[];if(audio.current){audio.current.close().catch(()=>{});audio.current=null}}
 function toggle(){if(playing){stop();setPlaying(false);return}try{const ac=new AudioContext();audio.current=ac;const fundamental=[174.61,220,261.63,349.23];fundamental.forEach((hz,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=hz;o.detune.value=i%2?3:-4;g.gain.value=volume*[.075,.045,.03,.026][i];o.connect(g).connect(ac.destination);o.start();oscillators.current.push(o);gains.current.push(g)});setPlaying(true)}catch{setPlaying(false)}}
 useEffect(()=>{gains.current.forEach((g,i)=>g.gain.setTargetAtTime(volume*[.075,.045,.03,.026][i],audio.current?.currentTime??0,.05))},[volume]);
 useEffect(()=>()=>stop(),[]);
 return <div className="radio"><div className={`vinyl ${playing?'vinyl-playing':''}`} aria-hidden="true"><div className="vinyl-label"><span>CORNER</span><strong>RADIO</strong><small>SIDE A / AMBIENCE</small></div></div><div className="radio-controls"><button type="button" className="radio-play" onClick={toggle} aria-pressed={playing}>{playing?<Pause size={18} fill="currentColor"/>:<Play size={18} fill="currentColor"/>}{playing?'PAUSE':'PLAY'} RADIO</button><label className="radio-volume"><Volume2 size={15}/><input type="range" min="0" max="0.5" step="0.01" value={volume} onChange={e=>setVolume(Number(e.target.value))} aria-label="Volume"/></label></div><p className="radio-disclaimer">An original ambient sound sketch, not audio from Julia&apos;s website.</p></div>
}
