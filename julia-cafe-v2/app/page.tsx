import {WorldHero} from '@/components/WorldHero';
import {BioSection} from '@/components/BioSection';
import {CoffeeExperience} from '@/components/CoffeeExperience';
import {CafeScene} from '@/components/CafeScene';
import {ArrowUpRight} from 'lucide-react';
export default function Home(){return <><a className="skip" href="#cafe">Skip to interactive café</a><header className="floating-brand"><a href="#top" className="brand-stamp" aria-label="Back to the beginning"><span>J<span className="brand-suit">A</span></span></a><a href="#cafe" className="floating-index">EXPLORE THE CAFÉ <ArrowUpRight size={15}/></a></header><main><WorldHero/><BioSection/><CoffeeExperience/><CafeScene/></main><footer className="site-footer"><div>INDEPENDENT INTERACTION STUDY / VERSION 2</div><p>This is a technical reconstruction exercise, not Julia Alvarenga&apos;s official site.</p><a href="https://www.juliaalvarenga.com/" target="_blank" rel="noreferrer">Visit Julia&apos;s original portfolio <ArrowUpRight size={14}/></a></footer></>}
