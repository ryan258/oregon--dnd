'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function harness({missing=false}={}){
  const scope='https://example.test/games/oregon/player/',handlers={},stores=new Map(),network=[];
  const url=x=>typeof x==='string'?x:(x.url||String(x));
  const caches={async open(key){if(!stores.has(key))stores.set(key,new Map());const map=stores.get(key);return {
    async addAll(requests){if(missing)throw new Error('asset unavailable');for(const r of requests)map.set(url(r),new Response('cached:'+url(r)));},
    async match(request,options){let u=url(request);if(options?.ignoreSearch)u=u.split('?')[0];const response=map.get(u);return response?.clone();}
  };},async keys(){return [...stores.keys()];},async delete(key){return stores.delete(key);}};
  const self={registration:{scope},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn};
  vm.runInNewContext(fs.readFileSync('player/sw.js','utf8'),{self,caches,Request,URL,fetch:async r=>{network.push(url(r));throw new Error('offline');}});
  async function lifetime(name,extra={}){let promise;handlers[name]({...extra,waitUntil:p=>promise=p});await promise;}
  async function request(path,navigate=false){let promise;handlers.fetch({request:{url:new URL(path,scope).href,method:'GET',mode:navigate?'navigate':'same-origin'},respondWith:p=>promise=p});return promise;}
  return {scope,stores,network,lifetime,request,handlers};
}
test('completed install supplies navigation and all runtime files with network unavailable',async()=>{
  const h=harness();await h.lifetime('install');await h.lifetime('activate');
  for(const path of ['','index.html','styles.css','rules.js','model.js','storage.js','app.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png']){const response=await h.request(path,path==='');assert.match(await response.text(),/^cached:/);}
  assert.equal(h.network.length,0);
  let status;await h.lifetime('message',{data:{type:'CHECK_OFFLINE'},ports:[{postMessage:x=>status=x}]});assert.equal(status.complete,true);
});
test('install failure is rejected; readiness requires every asset',async()=>{
  const h=harness({missing:true});await assert.rejects(h.lifetime('install'),/unavailable/);let status;
  await h.lifetime('message',{data:{type:'CHECK_OFFLINE'},ports:[{postMessage:x=>status=x}]});assert.equal(status.complete,false);
});
test('activation removes only older caches for this exact app scope',async()=>{
  const h=harness();h.stores.set('some-other-app',new Map());h.stores.set('oregon-trail-player:https://example.test/other/:old',new Map());const old='oregon-trail-player:'+h.scope+':old';h.stores.set(old,new Map());await h.lifetime('install');await h.lifetime('activate');assert.equal(h.stores.has(old),false);assert.equal(h.stores.has('some-other-app'),true);assert.equal(h.stores.has('oregon-trail-player:https://example.test/other/:old'),true);
});
test('offline readiness falls back to incomplete if a cached runtime file disappears',async()=>{
  const h=harness();await h.lifetime('install');const cache=[...h.stores.values()][0];cache.delete(h.scope+'model.js');let status;await h.lifetime('message',{data:{type:'CHECK_OFFLINE'},ports:[{postMessage:x=>status=x}]});assert.equal(status.complete,false);
});
