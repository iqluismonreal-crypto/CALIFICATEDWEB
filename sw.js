// CALIFICATED · funciona sin internet: guarda la app en el dispositivo la primera vez que se abre.
const CACHE='calificated-v20';
const ARCHIVOS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png','icons/favicon-64.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin) return;
  // con internet: toma la versión más nueva y la guarda; sin internet: usa la guardada
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const copia=res.clone(); caches.open(CACHE).then(c=>c.put(r,copia))} return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('index.html'))));
});
