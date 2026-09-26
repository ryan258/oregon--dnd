'use strict';
// Bump BUILD whenever any precached asset changes. An open session keeps its current worker.
const BUILD='v1-20260926-readiness';
const PREFIX='oregon-trail-player:'+self.registration.scope+':';
const CACHE=PREFIX+BUILD;
const FILES=['./','index.html','styles.css','rules.js','model.js','storage.js','app.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})))));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(event.request.mode==='navigate')return (await cache.match(new URL('./',self.registration.scope)))||fetch(event.request);
    return (await cache.match(event.request,{ignoreSearch:true}))||fetch(event.request);
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='CHECK_OFFLINE')event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const complete=(await Promise.all(FILES.map(path=>cache.match(new URL(path,self.registration.scope))))).every(Boolean);
    event.ports[0]?.postMessage({complete,build:BUILD});
  })());
});
