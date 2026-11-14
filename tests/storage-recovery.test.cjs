"use strict";
const test=require('node:test'), assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const R=require('../player/rules.js'), M=require('../player/model.js'), S=require('../player/storage.js');
const state=()=>({...M.empty(),revision:3,activeId:'fixture',characters:[M.create(R.pregens[0],'fixture')]});
function memory(){
  const map=new Map();
  return {
    map, fail:null, denied:false,
    getItem(key){if(this.denied)throw new Error('access denied');return map.get(key)??null;},
    setItem(key,value){if(this.fail===key)throw new Error('quota');map.set(key,value);},
    removeItem(key){map.delete(key);},
  };
}
function malformed(mem,changed=false){const value=state();if(changed)value.characters[0].notes='Newer owner note';const raw=JSON.stringify({...value,_undo:[{label:42,state:value}]});mem.map.set(S.KEY,raw);return raw;}
test('damaged undo recovery archives bytes and preserves valid travelers',()=>{
  const mem=memory(), raw=malformed(mem), store=S.open(mem);assert.throws(()=>store.read(),/undo label/);
  const recovered=store.recoverEmpty();assert.deepEqual(recovered.characters,state().characters);assert.equal(recovered.revision,4);
  const reopened=S.open(mem);
  assert.equal(reopened.archive(),raw);
  assert.equal(reopened.read().characters[0].id,'fixture');
  assert.equal(reopened.undoCount,0);
  assert.deepEqual(JSON.parse(mem.getItem(S.KEY))._undo,[]);
});
test('failed damaged undo archive leaves original save intact',()=>{
  const mem=memory(),raw=malformed(mem),store=S.open(mem);assert.throws(()=>store.read());mem.fail=S.ARCHIVE;assert.throws(()=>store.recoverEmpty(),/quota/);assert.equal(mem.getItem(S.KEY),raw);
});
test('damaged undo recovery refuses bytes changed since failed read',()=>{
  const mem=memory(),raw=malformed(mem),store=S.open(mem);
  assert.throws(()=>store.read());
  const newer=malformed(mem,true);
  assert.throws(()=>store.recoverEmpty(raw),/changed/);
  assert.equal(mem.getItem(S.KEY),newer);
  assert.equal(store.archive(),null);
  assert.throws(()=>store.read());
  assert.throws(()=>store.recoverEmpty(raw),/changed/);
});
test('a stored null is damaged; only a missing key is empty',()=>{
  const mem=memory(),store=S.open(mem);
  assert.deepEqual(store.read(),M.empty());
  mem.setItem(S.KEY,'null');
  assert.throws(()=>store.read(),error=>error.code==='DAMAGED_SAVE' && error.savedState===null);
  assert.equal(store.damagedRaw,'null');
  assert.equal(store.recoverEmpty().characters.length,0);
  assert.equal(store.archive(),'null');
});
test('a failed replacement preserves the active bytes and archive and can be retried',()=>{
  const mem=memory(),raw=malformed(mem),store=S.open(mem);
  assert.throws(()=>store.read());
  mem.fail=S.KEY;
  assert.throws(()=>store.recoverEmpty(),/quota/);
  assert.equal(mem.getItem(S.KEY),raw);
  assert.equal(store.archive(),raw);
  mem.fail=S.ARCHIVE;
  assert.equal(store.recoverEmpty().characters[0].id,'fixture');
});
test('an existing archive is kept until its reviewed bytes are explicitly removed',()=>{
  const mem=memory(),original=malformed(mem),store=S.open(mem);
  assert.throws(()=>store.read());
  store.recoverEmpty();
  const newer=malformed(mem,true);
  assert.throws(()=>store.read());
  assert.throws(()=>store.recoverEmpty(),/different recovery archive/);
  assert.throws(()=>store.removeArchive(newer),/archive changed/);
  assert.equal(mem.getItem(S.KEY),newer);
  assert.equal(store.archive(),original);
  store.removeArchive(original);
  store.recoverEmpty();
  assert.equal(store.archive(),newer);
});
test('ordinary save and damaged-history recovery both roll over a maximal revision',()=>{
  const mem=memory(),store=S.open(mem);
  const value={...state(),revision:M.MAX_REVISION};
  mem.setItem(S.KEY,JSON.stringify(value));
  assert.equal(store.save(store.read()).revision,1);
  assert.equal(S.open(mem).read().revision,1);
  mem.setItem(S.KEY,JSON.stringify({...value,_undo:null}));
  assert.throws(()=>store.read());
  assert.equal(store.recoverEmpty().revision,1);
  assert.deepEqual(S.open(mem).read().characters,value.characters);
});

function openApp(localStorage){
  const events=new Map(),elements=new Map(),clipboard=[];
  const element=()=>({
    contains:()=>false, addEventListener(){},
    showModal(){this.open=true;}, close(){this.open=false;},
  });
  function get(selector){
    if(!elements.has(selector))elements.set(selector,element());
    return elements.get(selector);
  }
  runInNewContext(readFileSync(require.resolve('../player/app.js'),'utf8'),{
    TrailRules:R,TrailModel:M,TrailStorage:S,
    document:{body:{dataset:{}},activeElement:null,querySelector:get},
    localStorage,
    navigator:{
      locks:{request:async (_key,fn)=>fn()},
      clipboard:{writeText:async value=>clipboard.push(value)},
    },
    window:{addEventListener:(event,fn)=>events.set(event,fn)},
    FormData:class {},
    isSecureContext:false,
  });
  return {
    get,events,clipboard,
    click(selector){return get(selector).onclick();},
    async confirm(){
      get('#dialog-form').onsubmit({preventDefault(){}});
      await new Promise(resolve=>setImmediate(resolve));
    },
  };
}
test('a failed reload offers separate portable and raw exports and recovers without reopening',async()=>{
  const mem=memory(),visible=state();
  visible.characters[0].notes='Visible work';
  mem.setItem(S.KEY,JSON.stringify(visible));
  const app=openApp(mem);
  const raw=malformed(mem,true);
  app.events.get('storage')({key:S.KEY,newValue:raw});
  app.click('#load-saved');
  await app.confirm();
  assert.match(app.get('#save-status').textContent,/recovery available/);
  app.click('#backup');
  await app.click('#copy-visible');
  await app.click('#copy-saved');
  await app.click('#copy-raw');
  assert.equal(M.parseImport(app.clipboard[0]).characters[0].notes,'Visible work');
  assert.equal(M.parseImport(app.clipboard[1]).characters[0].notes,'Newer owner note');
  assert.equal(JSON.parse(app.clipboard[2]).raw,raw);
  app.click('#recover-save');
  await app.confirm();
  assert.match(app.get('#save-status').textContent,/Recovered travelers/);
  assert.equal(S.open(mem).read().characters[0].notes,'Newer owner note');
  app.click('#backup');
  await app.click('#copy-archive');
  assert.equal(JSON.parse(app.clipboard[3]).raw,raw);
});
test('storage access denial can be retried and never exposes a replacement action',async()=>{
  const mem=memory();
  mem.setItem(S.KEY,JSON.stringify(state()));
  mem.denied=true;
  const app=openApp(mem);
  app.click('#backup');
  assert.doesNotMatch(app.get('#dialog-body').innerHTML,/recover-save/);
  app.click('#cancel');
  mem.denied=false;
  app.click('#load-saved');
  await app.confirm();
  assert.match(app.get('#save-status').textContent,/Loaded saved version/);
});
test('a raw export round-trips original whitespace and lone UTF-16 code units',()=>{
  const raw='\r\n\u0000\ud800{bad}\r';
  assert.equal(JSON.parse(S.exportRaw(raw)).raw,raw);
});
