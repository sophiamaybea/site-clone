// This standalone script can be used with Node 20+ in an environment with internet.
const base='https://www.juliaalvarenga.com';
for(const path of ['/images/cafe/cafe-scene.jpg','/images/cafe/floor-reveal.webp','/images/julias-world.svg','/images/icons/coffee-cd.webp','/images/icons/beautiful-life-ticket.webp']){
 try{const r=await fetch(base+path,{method:'HEAD'});console.log(path,r.status,r.headers.get('content-type'))}catch(e){console.error(path,String(e))}
}
