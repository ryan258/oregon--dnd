'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const R=require('../player/rules.js'),M=require('../player/model.js'),S=require('../player/storage.js');
const character=(i=0)=>M.create(R.pregens[i],'traveler-'+i);
const state=()=>({...M.empty(),activeId:'traveler-0',characters:[character()]});
function memory(){const map=new Map();return {map,fail:null,getItem(k){if(this.fail==='read')throw new Error('denied');return map.get(k)??null;},setItem(k,v){if(this.fail===k)throw new Error('quota');map.set(k,v);}};}
test('pregens retain current manuscript scores, statements, and health',()=>{for(let i=0;i<4;i++){const c=character(i);assert.equal(c.hp,9);assert.deepEqual(Object.values(c.scores).sort((a,b)=>a-b),[8,10,10,12,13,15]);assert.ok(c.personal.promise);assert.deepEqual(M.validateCharacter(c),c);}});
test('one overflow hit advances one wound, healing alone keeps wound, later hits advance',()=>{const c=character();M.damage(c,99);assert.equal(c.wound,'Wounded');M.heal(c,1);assert.equal(c.wound,'Wounded');M.damage(c,1);assert.equal(c.wound,'Gravely Injured');M.damage(c,1);assert.equal(c.wound,'Dead');assert.throws(()=>M.heal(c,1),/revive/);});
test('Exhaustion cap survives removal, max HP clamp creates no wound, recovery adds no HP',()=>{const c=character();c.exhaustion=3;M.exhaust(c);assert.equal(c.hp,5);assert.equal(c.wound,'Healthy');M.recoverExhaustion(c,true);assert.equal(M.maxHP(c),9);assert.equal(c.hp,5);assert.throws(()=>M.exhaust(c),/One new/);M.nextDay(c);M.exhaust(c);assert.equal(c.exhaustion,4);});
test('fed rest heals against old maximum then removes Exhaustion; wound needs success',()=>{const c=character();c.exhaustion=4;c.hp=3;c.wound='Wounded';M.rest(c,{fed:true,die:4,woundSuccess:false});assert.equal(c.hp,5);assert.equal(c.exhaustion,3);assert.equal(c.wound,'Wounded');assert.throws(()=>M.rest(c,{fed:true,die:1,woundSuccess:true}),/already/);});
test('unfed rest heals one and cannot remove Exhaustion or wound',()=>{const c=character();c.hp=1;c.wound='Gravely Injured';c.exhaustion=2;M.rest(c,{fed:false,die:4,woundSuccess:true});assert.equal(c.hp,2);assert.equal(c.exhaustion,2);assert.equal(c.wound,'Gravely Injured');assert.throws(()=>M.recoverExhaustion(c,false),/ration/);});
test('new day resets only daily limits and care, preserving story and chapter use',()=>{const c=character();c.gainedToday=true;c.restedToday=true;c.awardUsed=true;c.uses={'day:Treatment':true,'chapter:Intervention':true,'span:Background':true};c.conditions=[{kind:'Dysentery',marks:2,starts:'Tomorrow',care:'treated'}];M.nextDay(c);assert.equal(c.date,'1848-06-03');assert.equal(c.gainedToday,false);assert.equal(c.conditions[0].marks,2);assert.equal(c.conditions[0].care,'');assert.equal(c.uses['day:Treatment'],false);assert.equal(c.uses['chapter:Intervention'],true);assert.equal(c.awardUsed,true);});
test('condition onset is dated and a recovered condition can be contracted again',()=>{
  const c=character();
  M.recordCondition(c,'Dysentery');
  assert.equal(c.conditions[0].starts,'1848-06-03');
  assert.throws(()=>M.recordCondition(c,'Dysentery'),/already active/);
  M.nextDay(c);
  assert.equal(c.conditions[0].starts,'1848-06-03');
  c.conditions[0].marks=0;
  M.recordCondition(c,'Dysentery');
  assert.deepEqual(c.conditions,[{kind:'Dysentery',marks:3,starts:'1848-06-04',care:''}]);
  M.recordCondition(c,'Measles');
  assert.equal(c.conditions[1].starts,'No ongoing HP damage');
});
test('roundtrip retains all character fields, notes, techniques, conditions, flags and reminders',()=>{const s=state(),c=s.characters[0];c.techniques=['Weather Eye','Surveyor'];c.conditions=[{kind:'Cholera',marks:2,starts:'June 4',care:'ordinary treatment succeeded'}];c.notes='Promise → changed → next camp';c.today='Keep the crate';c.gainedToday=true;c.uses={'chapter:Weather Eye':true};assert.deepEqual(M.parseImport(M.exportSave(s)),s);});
test('rejects future versions, wrong game, invalid types, repeated conditions, out-of-range marks and large payloads',()=>{const s=state();assert.throws(()=>M.validateState({...s,version:2}),/version/);assert.throws(()=>M.parseImport('{}'),/different/);assert.throws(()=>M.parseImport('x'.repeat(M.MAX_BACKUP_BYTES+1)),/large/);for(const mutate of [c=>c.hp=999,c=>c.inspiration='true',c=>c.date='1848-02-31',c=>c.techniques=['Surveyor','Surveyor'],c=>c.conditions=[{kind:'Dysentery',marks:999,starts:'',care:''}],c=>c.role='__proto__']){const bad=M.clone(s);mutate(bad.characters[0]);assert.throws(()=>M.validateState(bad));}assert.throws(()=>M.validateState({...s,characters:[s.characters[0],s.characters[0]]}),/Repeated/);});
test('backup preview rejects array values even when they coerce to known rule names',()=>{
  const portable=JSON.parse(M.exportSave(state()));
  for(const [mutate,message] of [
    [c=>c.role=['Guide'],/Unknown role/],
    [c=>c.background=[c.background],/Choose a background/],
    [c=>c.techniques=[['Surveyor'],['Surveyor']],/Unknown role technique/],
    [c=>c.conditions=[{kind:['Dysentery'],marks:2,starts:'',care:''}],/Unknown or repeated condition/],
  ]){
    const backup=M.clone(portable);
    mutate(backup.state.characters[0]);
    assert.throws(()=>M.parseImport(JSON.stringify(backup)),message);
  }
});
test('untrusted markup stays literal text; unknown payload fields are stripped',()=>{const s=state();s.characters[0].notes='<img src=x onerror=alert(1)>';s.characters[0].script='bad';const clean=M.validateState(s);assert.equal(clean.characters[0].notes,'<img src=x onerror=alert(1)>');assert.equal(clean.characters[0].script,undefined);});
test('import adds independent copies without changing existing characters',()=>{const s=state(),other=state();other.characters[0].hp=2;const merged=M.mergeImport(s,other,()=> 'copy-1');assert.equal(merged.characters.length,2);assert.equal(merged.characters[0].hp,9);assert.equal(merged.characters[1].hp,2);assert.equal(merged.activeId,'copy-1');assert.equal(s.characters.length,1);});
test('storage writes survive reopened adapter and previous-save undo survives reload',()=>{const mem=memory(),store=S.open(mem);store.read();store.save(state(),{snapshot:true});const changed=state();changed.characters[0].hp=4;store.save(changed,{snapshot:true});const reopened=S.open(mem);assert.equal(reopened.read().characters[0].hp,4);const restored=reopened.save(reopened.previous(),{snapshot:true});assert.equal(restored.characters[0].hp,9);assert.equal(S.open(mem).read().characters[0].hp,9);});
test('stale writer fails without replacing newer save',()=>{const mem=memory(),a=S.open(mem),b=S.open(mem);a.read();b.read();a.save(state());assert.throws(()=>b.save(state()),/Another window/);assert.equal(JSON.parse(mem.getItem(S.KEY)).revision,1);});
test('failed atomic write preserves both current save and undo history',()=>{const mem=memory(),store=S.open(mem);store.read();store.save(state());const changed=state();changed.characters[0].hp=4;store.save(changed,{snapshot:true,label:'damage'});const old=mem.getItem(S.KEY),label=store.undoLabel;mem.fail=S.KEY;assert.throws(()=>store.save(state(),{snapshot:true,label:'heal'}),/quota/);assert.equal(mem.getItem(S.KEY),old);assert.equal(store.expected,old);assert.equal(store.undoLabel,label);assert.throws(()=>store.undo(),/quota/);assert.equal(store.undoCount,1);mem.fail=null;assert.equal(store.undo().characters[0].hp,9);});
test('malformed data is not replaced on load or save; recovery archives before replacement',()=>{const mem=memory();mem.map.set(S.KEY,'{broken');const store=S.open(mem);assert.throws(()=>store.read());assert.throws(()=>store.save(state()));assert.equal(mem.getItem(S.KEY),'{broken');mem.fail=S.KEY+'-unreadable';assert.throws(()=>store.recoverEmpty(),/quota/);assert.equal(mem.getItem(S.KEY),'{broken');mem.fail=null;store.recoverEmpty();assert.equal(mem.getItem(S.KEY+'-unreadable'),'{broken');assert.equal(store.read().characters.length,0);});
test('recovery cannot overwrite a valid save that arrived after a corrupted read',()=>{const mem=memory();mem.map.set(S.KEY,'bad');const store=S.open(mem);assert.throws(()=>store.read());mem.map.set(S.KEY,JSON.stringify(state()));assert.throws(()=>store.recoverEmpty(),/now valid/);assert.equal(JSON.parse(mem.getItem(S.KEY)).characters.length,1);});
test('local save access denial throws without constructing a replacement',()=>{const mem=memory();mem.fail='read';const store=S.open(mem);assert.throws(()=>store.read(),/denied/);assert.equal(mem.map.size,0);});

test('all 12 maximum-size supported records roundtrip with escaped control and Unicode text',()=>{
  for(const fill of ['\u0000','界']){
    const c=character();c.name=fill.repeat(99)+'x';c.player=fill.repeat(100);c.notes=fill.repeat(20000);c.today=fill.repeat(3000);
    for(const k of M.PERSONAL)c.personal[k]=fill.repeat(3000);
    c.conditions=Object.entries(R.conditions).map(([kind,v])=>({kind,marks:v.marks,starts:fill.repeat(100),care:fill.repeat(1000)}));
    c.uses=Object.fromEntries(Array.from({length:40},(_,i)=>['manual:'+String(i).padStart(100,'x'),true]));
    const s={...M.empty(),activeId:'large-0',characters:Array.from({length:12},(_,i)=>({...M.clone(c),id:'large-'+i}))};
    const raw=M.exportSave(s);assert.ok(M.backupBytes(raw)<M.MAX_BACKUP_BYTES);assert.deepEqual(M.parseImport(raw),M.validateState(s));
  }
});
test('UTF-8 byte rule is shared by exported and pasted JSON, including non-ASCII limits',()=>{
  assert.equal(M.backupBytes('界'),3);
  const raw='界'.repeat(Math.floor(M.MAX_BACKUP_BYTES/3)+1);
  assert.ok(raw.length<M.MAX_BACKUP_BYTES);assert.throws(()=>M.checkBackupSize(raw),/8 MiB/);assert.throws(()=>M.parseImport(raw),/8 MiB/);
});
test('damage then many journal inputs undo as two transactions after reopening',()=>{
  const mem=memory(),store=S.open(mem);store.read();store.save(state());
  const s=state();s.characters[0].hp=4;store.save(s,{snapshot:true,label:'record 5 damage'});
  for(const notes of ['A','A promise','A promise kept']){s.characters[0].notes=notes;store.save(s,{snapshot:true,label:'edit journal',group:'field-visit-1'});}
  const reopened=S.open(mem);assert.equal(reopened.read().characters[0].notes,'A promise kept');assert.equal(reopened.undoCount,2);assert.equal(reopened.undoLabel,'edit journal');
  let restored=reopened.undo();assert.equal(restored.characters[0].notes,'');assert.equal(restored.characters[0].hp,4);assert.equal(reopened.undoLabel,'record 5 damage');
  restored=reopened.undo();assert.equal(restored.characters[0].hp,9);assert.equal(reopened.undoCount,0);assert.throws(()=>reopened.undo(),/No previous/);
});
test('a new field visit, a discrete action, and reload each close a text transaction',()=>{
  const mem=memory(),store=S.open(mem);store.read();store.save(state());const s=state();
  s.characters[0].notes='one';store.save(s,{snapshot:true,label:'edit journal',group:'one'});
  s.characters[0].notes='two';store.save(s,{snapshot:true,label:'edit journal',group:'two'});
  s.characters[0].hp=4;store.save(s,{snapshot:true,label:'damage'});
  s.characters[0].notes='three';store.save(s,{snapshot:true,label:'edit journal',group:'two'});assert.equal(store.undoCount,4);
  store.read();s.characters[0].notes='four';store.save(s,{snapshot:true,label:'edit journal',group:'two'});assert.equal(store.undoCount,5);
});
test('history keeps eight checkpoints and exports omit local history',()=>{
  const mem=memory(),store=S.open(mem);store.read();store.save(state());const s=state();
  for(let i=0;i<12;i++){s.characters[0].notes=String(i);store.save(s,{snapshot:true,label:'edit '+i});}
  assert.equal(store.undoCount,8);assert.equal(store.undoLabel,'edit 11');
  assert.equal(JSON.parse(M.exportSave(store.read())).state._undo,undefined);
  for(let i=0;i<8;i++)store.undo();assert.equal(store.read().characters[0].notes,'3');
});
test('large checkpoints trim older history without dropping the newest recovery point',()=>{
  const mem=memory(),store=S.open(mem);store.read();const s=state();s.characters[0].notes='界'.repeat(20000);for(const k of M.PERSONAL)s.characters[0].personal[k]='界'.repeat(3000);
  s.characters=Array.from({length:12},(_,i)=>({...M.clone(s.characters[0]),id:i?'large-'+i:s.activeId}));store.save(s);
  s.characters[0].hp=4;store.save(s,{snapshot:true,label:'damage'});s.characters[0].hp=5;store.save(s,{snapshot:true,label:'heal'});assert.equal(store.undoCount,1);assert.equal(store.undo().characters[0].hp,4);
});
test('legacy previous save migrates once and undo never resurrects an exhausted old slot',()=>{
  const mem=memory(),before=state(),after=state();after.characters[0].hp=4;mem.map.set(S.KEY,JSON.stringify(after));mem.map.set(S.PREVIOUS,JSON.stringify(before));
  const store=S.open(mem);store.read();assert.equal(store.undoLabel,'previous saved change');assert.equal(store.undo().characters[0].hp,9);const reopened=S.open(mem);reopened.read();assert.equal(reopened.undoCount,0);
});
test('undo refuses stale writers and stale confirmation tokens without changing data',()=>{
  const mem=memory(),a=S.open(mem);a.read();a.save(state(),{snapshot:true});const token=a.expected;const changed=state();changed.characters[0].hp=4;a.save(changed,{snapshot:true});const raw=a.expected;assert.throws(()=>a.undo(token),/after Undo/);assert.equal(mem.getItem(S.KEY),raw);
  const b=S.open(mem);b.read();b.save(state(),{snapshot:true});const newer=b.expected;assert.throws(()=>a.undo(),/Another window/);assert.equal(mem.getItem(S.KEY),newer);
});
