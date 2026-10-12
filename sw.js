// Bump CACHE_VERSION whenever you upload a new index.html so tablets pick it up.
const CACHE_VERSION='dplus-sketchy-v3';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Serve from cache instantly (works offline), refresh the cache in the background.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE_VERSION).then(c=>c.put(e.request,copy))}return r}).catch(()=>hit);
  return hit||net}))});
