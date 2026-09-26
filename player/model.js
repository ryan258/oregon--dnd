/* Pure character rules and a strict, portable save contract. */
(function (root, factory) {
  const api = factory(typeof module === 'object' ? require('./rules.js') : root.TrailRules);
  if (typeof module === 'object') module.exports = api;
  else root.TrailModel = api;
})(globalThis, function (rules) {
  'use strict';
  // Includes the worst-case escaped text allowed by the 12-traveler schema.
  const MAX_BACKUP_BYTES = 8 * 1024 * 1024;
  const backupBytes = raw => new TextEncoder().encode(raw).byteLength;
  function checkBackupSize(raw) {
    if(typeof raw!=='string'||raw.length>MAX_BACKUP_BYTES||backupBytes(raw)>MAX_BACKUP_BYTES)fail('Backup is too large (maximum 8 MiB of UTF-8 data).');
    return raw;
  }
  const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const WOUNDS = ['Healthy', 'Wounded', 'Gravely Injured', 'Dead'];
  const PERSONAL = ['dream','promise','boundary','bond','keepsake','cargo','voice','reserve','opening question','on the road'];
  const clone = x => JSON.parse(JSON.stringify(x));
  const mod = n => Math.floor((n - 10) / 2);
  const maxHP = c => c.exhaustion >= 4 ? Math.ceil((8 + mod(c.scores.CON)) / 2) : 8 + mod(c.scores.CON);
  const dead = c => c.wound === 'Dead' || c.exhaustion === 6;
  const fail = message => { throw new Error(message); };
  function record(x, name) { if (!x || typeof x !== 'object' || Array.isArray(x)) fail(`${name} must be an object.`); }
  function text(x, max, name) { if (typeof x !== 'string' || x.length > max) fail(`${name} is missing or too long.`); return x; }
  function int(x, min, max, name) { if (!Number.isInteger(x) || x < min || x > max) fail(`${name} must be ${min}–${max}.`); return x; }
  function bool(x, name) { if (typeof x !== 'boolean') fail(`${name} must be true or false.`); return x; }
  function date(x) {
    text(x,10,'Date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x) || !Number.isFinite(Date.parse(x+'T12:00:00Z')) || new Date(x+'T12:00:00Z').toISOString().slice(0,10)!==x) fail('Use a valid date.');
    return x;
  }
  function validateCharacter(x) {
    record(x,'Character');
    const c = {};
    c.id=text(x.id,80,'Character ID'); if (!/^[a-zA-Z0-9_-]+$/.test(c.id)) fail('Invalid character ID.');
    c.name=text(x.name,100,'Name'); if (!c.name.trim()) fail('A traveler needs a name.');
    c.player=text(x.player,100,'Player');
    if (!Object.hasOwn(rules.roles,x.role)) fail('Unknown role.'); c.role=x.role;
    if (!Object.hasOwn(rules.roles[c.role].backgrounds,x.background)) fail('Choose a background for this role.'); c.background=x.background;
    record(x.scores,'Scores'); c.scores={};
    for (const a of ABILITIES) c.scores[a]=int(x.scores[a],3,18,a);
    c.exhaustion=int(x.exhaustion,0,6,'Exhaustion');
    if (!WOUNDS.includes(x.wound)) fail('Unknown wound state.'); c.wound=x.wound;
    c.hp=int(x.hp,0,maxHP(c),'HP');
    if (c.exhaustion===6 && c.wound!=='Dead') fail('Exhaustion 6 requires Dead.');
    c.date=date(x.date); c.chapter=int(x.chapter,1,7,'Chapter');
    for (const key of ['gainedToday','inspiration','awardUsed','restedToday']) c[key]=bool(x[key],key);
    record(x.personal,'Personal statements'); c.personal={};
    for (const key of PERSONAL) c.personal[key]=text(x.personal[key],3000,key);
    c.notes=text(x.notes,20000,'Journal'); c.today=text(x.today,3000,'Today’s plan');
    if (!Array.isArray(x.techniques) || x.techniques.length>2 || new Set(x.techniques).size!==x.techniques.length) fail('Choose at most two different techniques.');
    c.techniques=x.techniques.map(t=> {if(!Object.hasOwn(rules.roles[c.role].techniques,t)) fail('Unknown role technique.');return t;});
    if (!Array.isArray(x.conditions) || x.conditions.length>9) fail('Invalid conditions.');
    const kinds=new Set();
    c.conditions=x.conditions.map(v=> {
      record(v,'Condition'); if(!Object.hasOwn(rules.conditions,v.kind)||kinds.has(v.kind)) fail('Unknown or repeated condition.'); kinds.add(v.kind);
      return {kind:v.kind, marks:int(v.marks,0,rules.conditions[v.kind].marks,'Recovery marks'), starts:text(v.starts,100,'Damage start'), care:text(v.care,1000,'Treatment')};
    });
    record(x.uses,'Use reminders'); c.uses={};
    if(Object.keys(x.uses).length>40) fail('Too many reminders.');
    for(const [key,value] of Object.entries(x.uses)) {
      if(!/^(day|span|chapter|session|manual):[\w '’&-]{1,100}$/.test(key)) fail('Invalid reminder.');
      c.uses[key]=bool(value,'Use reminder');
    }
    return c;
  }
  function validateState(x) {
    record(x,'Save'); if(x.version!==1) fail('Unsupported save version. Keep the original file.');
    if(!Array.isArray(x.characters)||x.characters.length>12) fail('A device can hold up to 12 travelers.');
    const characters=x.characters.map(validateCharacter);
    if(new Set(characters.map(c=>c.id)).size!==characters.length) fail('Repeated character IDs.');
    if(x.activeId!==null&&!characters.some(c=>c.id===x.activeId)) fail('The selected traveler is missing.');
    if(characters.length&&x.activeId===null) fail('Select a traveler.');
    return {version:1,revision:int(x.revision,0,Number.MAX_SAFE_INTEGER,'Revision'),activeId:x.activeId,characters};
  }
  const empty = () => ({version:1,revision:0,activeId:null,characters:[]});
  function create(template,id,when='1848-06-02') {
    const c={id,name:template.name,player:'',role:template.role,background:template.background,scores:clone(template.scores),hp:8+mod(template.scores.CON),exhaustion:0,wound:'Healthy',date:when,chapter:when==='1848-06-02'?2:1,gainedToday:false,inspiration:true,awardUsed:false,restedToday:false,personal:{},notes:'',today:'',conditions:[],techniques:[],uses:{}};
    for(const key of PERSONAL)c.personal[key]=template.personal?.[key]||'';
    return validateCharacter(c);
  }
  function damage(c,n) {
    int(n,1,99,'Damage'); if(dead(c)) fail('This traveler is dead. Keep their record and choose a reserve.');
    c.hp=Math.max(0,c.hp-n);
    if(c.hp===0)c.wound=WOUNDS[Math.min(3,WOUNDS.indexOf(c.wound)+1)];
  }
  function heal(c,n) { int(n,1,99,'Healing'); if(dead(c)) fail('Healing cannot revive a dead traveler.'); c.hp=Math.min(maxHP(c),c.hp+n); }
  function exhaust(c) {
    if(dead(c)) fail('This traveler is dead.'); if(c.gainedToday)fail('One new Exhaustion per day, from all sources.');
    c.exhaustion++;c.gainedToday=true;c.hp=Math.min(c.hp,maxHP(c));if(c.exhaustion===6)c.wound='Dead';
  }
  function recoverExhaustion(c,fed) {
    if(dead(c)) fail('Recovery cannot revive a dead traveler.');
    if(!fed) fail('Exhaustion removal requires a full ration.');
    c.exhaustion=Math.max(0,c.exhaustion-1);
  }
  function rest(c,{fed,die,woundSuccess}) {
    if(dead(c)) fail('Rest cannot revive a dead traveler.');if(c.restedToday)fail('Rest already recorded today. Undo or use Correct sheet for a table correction.');
    int(die,1,4,'Rest d4');
    heal(c,fed?die+1:1);
    if(fed)recoverExhaustion(c,true);
    if(fed&&woundSuccess&&c.wound!=='Healthy')c.wound=WOUNDS[WOUNDS.indexOf(c.wound)-1];
    c.restedToday=true;
  }
  function resetUses(c,period) {for(const k of Object.keys(c.uses))if(k.startsWith(period+':'))c.uses[k]=false;}
  function nextDay(c) {
    const d=new Date(c.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);c.date=d.toISOString().slice(0,10);
    c.gainedToday=false;c.restedToday=false;resetUses(c,'day');
    for(const condition of c.conditions)condition.care='';
  }
  function exportSave(state) { return checkBackupSize(JSON.stringify({format:'oregon-trail-player',version:1,rulesEdition:rules.edition,exportedAt:new Date().toISOString(),state:validateState(state)},null,2)); }
  function parseImport(raw) {
    checkBackupSize(raw);
    let x;try{x=JSON.parse(raw);}catch{fail('This is not a readable JSON backup.');}
    record(x,'Backup');if(x.format!=='oregon-trail-player'||x.version!==1||x.rulesEdition!==rules.edition)fail('This backup is for a different app or rules edition.');
    const state=validateState(x.state); if(!state.characters.length)fail('The backup contains no travelers.');return state;
  }
  function mergeImport(current,incoming,id) {
    const next=validateState(current), other=validateState(incoming);
    if(next.characters.length+other.characters.length>12)fail('Import would exceed the 12-traveler limit. Export and remove an unused traveler first.');
    const copies=other.characters.map(c=>({...clone(c),id:id()}));next.characters.push(...copies);next.activeId=copies[0].id;return validateState(next);
  }
  return {MAX_BACKUP_BYTES,backupBytes,checkBackupSize,ABILITIES,WOUNDS,PERSONAL,clone,mod,maxHP,dead,empty,create,validateCharacter,validateState,damage,heal,exhaust,recoverExhaustion,rest,nextDay,resetUses,exportSave,parseImport,mergeImport};
});
