/* No remote services. Character actions are local; party costs stay with the GM. */
'use strict';
(() => {
  const R=globalThis.TrailRules, M=globalThis.TrailModel, S=globalThis.TrailStorage;
  const $=s=>document.querySelector(s), app=$('#app'), dialog=$('#dialog');
  const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const rich=s=>esc(s).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  const checked=x=>x?' checked':'';
  const opt=(value,current,label=value)=>`<option value="${esc(value)}"${value===current?' selected':''}>${esc(label)}</option>`;
  const id=()=>crypto.randomUUID ? crypto.randomUUID() : 't'+Date.now().toString(36)+Math.random().toString(36).slice(2);
  let state=M.empty(), store, damaged, queue=Promise.resolve(), blocked=false, memoryOnly=false, tab='play', pending=0, generation=0;
  let editGroup=null, undoing=false;
  function changeLabel(){
    const title=$('#dialog-title');
    if(dialog.open && title)return title.textContent;
    return document.activeElement?.textContent?.trim().slice(0,120)||'sheet change';
  }
  const current=()=>state.characters.find(c=>c.id===state.activeId);
  const say=s=>{$('#save-status').textContent=s;};
  const warn=s=>{$('#alert').textContent=s;$('#alert').hidden=!s;};
  function updateLock(){app.inert=blocked||undoing;$('#load-saved').hidden=!blocked;$('#undo').disabled=blocked||memoryOnly||pending>0||!store?.undoCount;$('#undo').textContent=store?.undoLabel?'Undo: '+store.undoLabel:'Undo · no saved actions';}
  function readSaved(){
    store??=S.open(localStorage);
    state=store.read();
    blocked=false;damaged=null;editGroup=null;
  }
  function readFailed(error){
    blocked=true;
    damaged=error.code==='DAMAGED_SAVE'?error:null;
    say(damaged?'Saved data damaged · recovery available':'Saved data unavailable · try loading again');
    const advice=damaged?(memoryOnly?'Open Back up / restore to export. Recovery requires a browser with Web Locks.':'Open Back up / restore to export or recover.'):'Try Load saved version. You can export any visible travelers in Back up / restore.';
    warn('Could not read saved data: '+error.message+'. '+advice);
    updateLock();
  }
  function save({snapshot=true,label='sheet change',group=null}={}) {
    const captured=M.clone(state), own=++generation;
    if(memoryOnly){say('Not saved · changes are in this window only');return;}
    pending++;say('Saving on this device…');updateLock();
    queue=queue.then(async()=>{
      if(blocked)throw new Error('Saving paused. Export your visible work before reloading.');
      const saved=await navigator.locks.request(S.KEY,()=>store.save(captured,{snapshot,label,group}));
      if(own===generation){state.revision=saved.revision;say('Saved on this device · '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}));}
    }).catch(error=>{
      blocked=true;warn(error.message+' Your visible changes are still available in Back up / restore.');say('Not saved · action needed');updateLock();
    }).finally(()=>{pending--;updateLock();});
  }
  function change(fn,{redraw=true,label=changeLabel(),group=null,snapshot=true}={}) {
    if(blocked||undoing)return;
    try{
      const next=M.clone(state);fn(next,next.characters.find(c=>c.id===next.activeId));state=M.validateState(next);save({snapshot,label,group});if(redraw)render();
    }catch(error){warn(error.message);}
  }
  const CRESTS={
    Guide:`<svg class="character-crest" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 2.5"/><circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="1.2"/><path d="M50 8 L54 44 L50 48 L46 44 Z" fill="currentColor"/><path d="M50 92 L54 56 L50 52 L46 56 Z" fill="currentColor" opacity="0.6"/><path d="M8 50 L44 46 L48 50 L44 54 Z" fill="currentColor" opacity="0.6"/><path d="M92 50 L56 46 L52 50 L56 54 Z" fill="currentColor" opacity="0.6"/><path d="M21 21 L45 45 M79 79 L55 55 M79 21 L55 45 M21 79 L45 55" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="50" cy="50" r="4.5" fill="var(--paper)" stroke="currentColor" stroke-width="2"/><text x="50" y="24" text-anchor="middle" font-size="8" font-family="serif" font-weight="bold" fill="currentColor">N</text></svg>`,
    Doctor:`<svg class="character-crest" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2.5"/><circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/><path d="M30 52 C30 74 70 74 70 52 L30 52 Z" fill="currentColor" opacity="0.85"/><rect x="26" y="48" width="48" height="5" rx="2" fill="currentColor"/><line x1="38" y1="74" x2="62" y2="74" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M42 50 L64 26 C66 24 70 26 68 30 L52 52 Z" fill="currentColor"/><path d="M22 42 C20 30 32 24 38 28 C34 36 26 38 22 42 Z" fill="currentColor" opacity="0.7"/><path d="M78 42 C80 30 68 24 62 28 C66 36 74 38 78 42 Z" fill="currentColor" opacity="0.7"/><path d="M50 78 L50 88 M45 83 L55 83" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    Hunter:`<svg class="character-crest" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2.5"/><circle cx="50" cy="50" r="36" stroke="currentColor" stroke-width="1.2" stroke-dasharray="14 4"/><line x1="50" y1="6" x2="50" y2="20" stroke="currentColor" stroke-width="2"/><line x1="50" y1="80" x2="50" y2="94" stroke="currentColor" stroke-width="2"/><line x1="6" y1="50" x2="20" y2="50" stroke="currentColor" stroke-width="2"/><line x1="80" y1="50" x2="94" y2="50" stroke="currentColor" stroke-width="2"/><path d="M30 60 C38 48 54 44 72 34 C64 42 58 54 48 64 C42 66 34 66 30 60 Z" fill="currentColor"/><path d="M48 46 C52 30 68 22 76 20 C72 32 60 40 48 46 Z" fill="currentColor" opacity="0.85"/><path d="M42 56 C34 68 24 74 16 78 C24 74 34 70 42 56 Z" fill="currentColor" opacity="0.7"/><circle cx="71" cy="31" r="2" fill="var(--paper)"/></svg>`,
    Teamster:`<svg class="character-crest" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.8"/><circle cx="50" cy="50" r="8" fill="var(--paper)"/><line x1="50" y1="10" x2="50" y2="34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="50" y1="66" x2="50" y2="90" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="10" y1="50" x2="34" y2="50" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="66" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="22" y1="22" x2="38" y2="38" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="62" y1="62" x2="78" y2="78" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="78" y1="22" x2="62" y2="38" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="38" y1="62" x2="22" y2="78" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="6" r="2" fill="currentColor"/><circle cx="50" cy="94" r="2" fill="currentColor"/><circle cx="6" cy="50" r="2" fill="currentColor"/><circle cx="94" cy="50" r="2" fill="currentColor"/></svg>`
  };
  function render(){
    const focused=document.activeElement, focusKey=app.contains(focused)?{id:focused.id,action:focused.dataset.action,tab:focused.dataset.tab}:null;
    const c=current();
    if(!c){
      document.body.dataset.role='none';delete document.body.dataset.traveler;
      app.innerHTML=`<section class="welcome"><p class="eyebrow">Your place in the wagon</p><h1>Who are you<br>bringing west?</h1><p>Choose a traveler. Their abilities, promises, and reasons for leaving are ready. Your changes stay on this iPad.</p><div class="cards">${R.pregens.map((p,i)=>`<button class="choice choice-${p.role.toLowerCase()}" data-action="choose" data-index="${i}"><div class="choice-top"><span class="eyebrow">${esc(p.role)} · ${esc(p.background)}</span><div class="choice-crest">${CRESTS[p.role]||''}</div></div><strong>${esc(p.name)}</strong><span class="choice-dream">${esc(p.personal.dream)}</span><div class="choice-badges">${p.personal.keepsake?`<span class="pill pill-keepsake">📜 ${esc(p.personal.keepsake)}</span>`:''}${p.personal.cargo?`<span class="pill pill-cargo">📦 ${esc(p.personal.cargo)}</span>`:''}${p.personal.voice?`<span class="pill pill-voice">“${esc(p.personal.voice)}”</span>`:''}</div></button>`).join('')}</div><div class="welcome-actions"><button data-action="custom" class="primary">Create your own traveler</button></div><p class="muted compact">Already started elsewhere? Use Back up / restore to import your saved characters. Each iPad keeps a separate copy.</p></section>`;
      updateLock();return;
    }
    document.body.dataset.role=c.role.toLowerCase();
    document.body.dataset.traveler=c.name.toLowerCase().replace(/[^a-z0-9]/g,'-');
    const inactive=M.dead(c)||c.wound==='Gravely Injured'||c.exhaustion>=5;
    app.innerHTML=`<section class="hero hero-${esc(c.role.toLowerCase())}"><div class="hero-left"><div class="hero-crest-container">${CRESTS[c.role]||''}</div><div class="hero-meta"><div class="hero-tag-row"><span class="eyebrow">${esc(c.role)} · ${esc(c.background)}</span>${c.personal?.keepsake?`<span class="pill pill-keepsake" title="Keepsake carried on person">📜 ${esc(c.personal.keepsake)}</span>`:''}${c.personal?.cargo?`<span class="pill pill-cargo" title="Named cargo in wagon">📦 ${esc(c.personal.cargo)}</span>`:''}</div><h1>${esc(c.name)}</h1><div class="pills"><span class="pill pill-date">${esc(c.date)}</span><span class="pill pill-chapter">Chapter ${c.chapter}</span><span class="pill pill-player">${esc(c.player||'Your traveler')}</span>${c.personal?.voice?`<span class="pill pill-voice" title="Demeanor & manner">“${esc(c.personal.voice)}”</span>`:''}</div><p class="hero-dream">${esc(c.personal?.dream||'Give this traveler a reason to reach Oregon in Story.')}</p></div></div><div class="hero-select"><label for="traveler">Traveler on this device</label><select id="traveler">${state.characters.map(p=>opt(p.id,c.id,p.name)).join('')}</select><div class="row"><button data-action="add">Add / reserve</button><button data-action="edit">Correct sheet</button></div></div></section>
      ${inactive?'<aside class="notice">This traveler cannot take actions. Keep their story here and choose or add a reserve so you can keep playing. Coordinate active slots and extra rations with the GM.</aside>':''}
      <nav class="tabs" aria-label="Character sections">${[['play','At the table'],['story','Story & journal'],['abilities','Abilities & learning']].map(([key,label])=>`<button data-action="tab" data-tab="${key}" aria-pressed="${tab===key}">${label}</button>`).join('')}</nav>
      ${tab==='play'?play(c):tab==='story'?story(c):abilities(c)}`;
    updateLock();
    if(focusKey){const replacement=focusKey.id?document.getElementById(focusKey.id):Array.from(app.querySelectorAll('button[data-action]')).find(b=>b.dataset.action===focusKey.action&&b.dataset.tab===focusKey.tab);replacement?.focus();}
  }
  const effects=[
    'No Exhaustion penalty.', '−1 on checks (recovery checks ignore this).',
    'Disadvantage on STR / DEX / CON, replacing −1.',
    'Disadvantage on all checks. Advantage cannot cancel it.',
    'All checks at uncancelable Disadvantage; maximum HP halved.',
    'Incapacitated. Choose a reserve; maximum HP remains halved.',
    'Dead. Keep this record and introduce a replacement.'
  ];
  function play(c){const primary=R.roles[c.role].primary;return `<div class="grid"><div class="stack"><section class="card card-health"><div class="card-head"><h2>Keep going</h2><span class="eyebrow">Health</span></div><div class="health-number"><span class="big-number">${c.hp}<small> / ${M.maxHP(c)} HP</small></span><span class="pill pill-wound">${esc(c.wound)}</span></div><meter min="0" max="${M.maxHP(c)}" value="${c.hp}" aria-label="Current hit points"></meter><label for="hp-amount">Damage or healing amount</label><div class="row"><input id="hp-amount" type="number" inputmode="numeric" min="1" max="99" value="1"><button data-action="damage" class="danger">Take damage</button><button data-action="heal">Heal HP</button></div><p class="muted compact">One damage action is one hit. Healing HP does not remove wounds. Record condition damage here when the GM resolves it.</p><div class="row"><button data-action="stabilize">Stabilize at 0 HP</button><button data-action="rest">Record a Rest Day</button></div><details><summary>Wounds & recovery</summary><p class="rule">First reaching 0 HP: Wounded. Later separate damage at 0, or returning to 0 after healing: Gravely Injured, then Dead. One hit advances only one step. Wounded: STR/DEX Disadvantage; at 0, no physical tasks. Gravely Injured: no actions or checks. An able companion uses their action to stabilize you at 1 HP; this is separate from the Doctor’s condition intervention.</p></details></section>
      <section class="card card-exhaustion"><div class="card-head"><h2>Exhaustion</h2><span class="big-number">${c.exhaustion}<small> / 6</small></span></div><div class="exhaust" aria-hidden="true">${[1,2,3,4,5,6].map(n=>`<span class="${n<=c.exhaustion?'filled':''}">${n}</span>`).join('')}</div><p>${effects[c.exhaustion]}</p><div class="row"><button data-action="exhaust" ${c.gainedToday?'disabled':''}>Gain 1 Exhaustion</button><button data-action="recover">Remove 1 — full ration</button></div><p class="muted compact">${c.gainedToday?'Today’s gain is already recorded. Recovery does not reset that limit.':'At most one new level per calendar day, from all sources.'} Two party members at Exhaustion 2+ halve wagon travel; tell the GM.</p></section>
      <section class="card card-abilities"><h2>Your abilities</h2><div class="abilities">${M.ABILITIES.map(a=>`<div class="ability ${a===primary?'ability-primary':''}"><span>${a}${a===primary?' ★':''}</span><strong>${M.mod(c.scores[a])>=0?'+':''}${M.mod(c.scores[a])}</strong><small>score ${c.scores[a]}</small></div>`).join('')}</div><p class="rule">Roll d20 + the modifier. The GM states the DC and stakes first. These are base modifiers; apply wounds, conditions, Exhaustion, help, and Advantage at the table. Recovery checks ignore condition, Exhaustion, and Morale penalties.</p></section></div>
      <div class="stack"><section class="card card-today"><h2>What matters today?</h2><label for="today" class="muted compact">The decision, promise, or person on your mind</label><textarea id="today" data-field="today" maxlength="3000" placeholder="What are you unwilling to leave behind?">${esc(c.today)}</textarea><label class="check"><input type="checkbox" data-flag="inspiration"${checked(c.inspiration)}> Inspiration available</label><label class="check"><input type="checkbox" data-flag="awardUsed"${checked(c.awardUsed)}> Personal-stakes award used this session</label><p class="rule">Hold one Inspiration. Spend before a check for Advantage. Earn at most one personal-stakes award per session when a meaningful cost arises from your Dream, Promise, Bond, or Boundary.</p><div class="row"><button data-action="day">Next day</button><button data-action="session">New session</button></div></section>
      <section class="card card-conditions"><div class="card-head"><h2>Conditions & care</h2><button data-action="condition-add">Add condition</button></div>${c.conditions.length?c.conditions.map(conditionCard).join(''):'<p class="muted">No conditions recorded. Add only after resolving exposure with the GM.</p>'}<details><summary>How to record a condition</summary><p class="rule">Adding a condition does not apply damage or Exhaustion. Resolve any immediate effect once, then record it using the health controls. Ongoing damage normally starts tomorrow. Resolve one recovery roll per active condition each day; success removes one mark. Doctor Stabilize removes two instead of that roll. Zero marks ends the condition. Mark changes are manual so you can record treatment or correct a ruling.</p></details></section></div></div>`;}
  function conditionCard(condition,index){
    const {kind,marks,starts,care}=condition;
    const rule=R.conditions[kind];
    const onset=starts==='Tomorrow, if the condition has ongoing damage'?'':starts;
    const details=marks>0?`<p class="rule">${esc(rule.effect)} Recovery CON DC ${rule.dc}.</p><label for="starts-${index}">Damage starts / next effect</label><input id="starts-${index}" data-condition="${index}" data-key="starts" maxlength="100" placeholder="Confirm the onset date with the GM" value="${esc(onset)}"><label for="care-${index}">Today’s treatment and recovery result</label><input id="care-${index}" data-condition="${index}" data-key="care" maxlength="1000" value="${esc(care)}">`:'<p class="rule">This condition has ended. Add it again if you contract it later.</p>';
    return `<div class="condition"><h3>${esc(kind)}${marks===0?' · recovered':''}</h3>${details}<label for="marks-${index}">${marks===0?'Correct recovery marks':'Recovery marks remaining'}</label><select id="marks-${index}" data-marks="${index}">${Array.from({length:rule.marks+1},(_,n)=>opt(n,marks)).join('')}</select><button data-action="condition-remove" data-index="${index}">Remove ${esc(kind)}</button></div>`;
  }
  function story(c){return `<div class="grid"><section class="card"><h2>The reason you left</h2>${M.PERSONAL.filter(k=>!['on the road','opening question','voice'].includes(k)).map(k=>`<div class="field"><label for="personal-${k}">${esc(k[0].toUpperCase()+k.slice(1))}</label><textarea id="personal-${k}" data-personal="${esc(k)}" maxlength="3000">${esc(c.personal[k])}</textarea></div>`).join('')}</section><div class="stack"><section class="card"><h2>Along the way</h2><p class="quote">${esc(c.personal['opening question']||'What did you believe when you left that you no longer believe?')}</p><p>${esc(c.personal['on the road'])}</p><label for="voice">Voice / manner</label><input id="voice" data-personal="voice" maxlength="3000" value="${esc(c.personal.voice)}"></section><section class="card"><h2>Your trail journal</h2><p class="muted compact">Record a choice → what changed → who you will meet again. Keep chapter changes, debts, and memories here.</p><label for="notes">Promises, opportunities & memories</label><textarea id="notes" data-field="notes" maxlength="20000" rows="18">${esc(c.notes)}</textarea></section></div></div>`;}
  function resetPeriod(text){if(/once per (three-day|3-day)/i.test(text))return 'span';if(/once per chapter/i.test(text))return 'chapter';return 'manual';}
  function abilityCard(name,text,key){const c=current();return `<div class="condition"><h3>${esc(name)}</h3><p class="rule">${rich(text)}</p>${key?`<label class="check"><input type="checkbox" data-use="${esc(key)}"${checked(c.uses[key])}> Used / accounted for ${key.startsWith('chapter:')?'this chapter':key.startsWith('span:')?'this weather span':key.startsWith('day:')?'today':'(manual reminder)'}</label>`:''}</div>`;}
  function abilities(c){const role=R.roles[c.role], interventionKey=(c.role==='Hunter'?'chapter:':'day:')+'Intervention';return `<div class="grid"><div class="stack"><section class="card"><h2>Your ${esc(c.role.toLowerCase())} expertise</h2>${abilityCard('Reliable service',role.service,c.role==='Doctor'?'day:Identify':null)}${abilityCard('Crisis intervention',role.intervention,interventionKey)}<p class="muted compact">Use reminders do not spend shared supplies or take an action for you. Coordinate those costs with the GM.</p>${c.role==='Doctor'?'<label class="check"><input type="checkbox" data-use="day:Treatment"'+checked(c.uses['day:Treatment'])+'> Daily treatment accounted for</label>':''}</section><section class="card"><h2>${esc(c.background)}</h2>${abilityCard('Background',role.backgrounds[c.background],/once per/i.test(role.backgrounds[c.background])?resetPeriod(role.backgrounds[c.background])+':Background':null)}</section></div><section class="card"><div class="card-head"><h2>What the trail taught you</h2><button data-action="techniques">Choose techniques</button></div><p class="muted compact">One after chapter 2, another after chapter 5. Choose only what the table has earned.</p>${c.techniques.length?c.techniques.map(t=>abilityCard(t,role.techniques[t],/once per/i.test(role.techniques[t])?resetPeriod(role.techniques[t])+':'+t:null)).join(''):'<p>No techniques selected yet.</p>'}<hr class="divider"><div class="row"><button data-action="chapter">New chapter</button><button data-action="span">New weather span</button></div><p class="source-note">Reference copied from the v0.10 manuscript. New chapter resets chapter reminders only. Weather span resets span reminders only; neither advances the date or grants learning automatically.</p></section></div>`;}
  function show(title,body,onSubmit,submit='Save'){
    $('#dialog-body').innerHTML=`<h2 id="dialog-title">${esc(title)}</h2><form id="dialog-form">${body}<p id="dialog-error" class="dialog-error" role="alert"></p><div class="dialog-actions"><button type="button" id="cancel">Close</button>${onSubmit?`<button type="submit" class="primary">${esc(submit)}</button>`:''}</div></form>`;
    $('#cancel').onclick=()=>dialog.close();
    if(onSubmit)$('#dialog-form').onsubmit=e=>{e.preventDefault();try{onSubmit(new FormData(e.currentTarget));}catch(err){$('#dialog-error').textContent=err.message;}};
    if(!dialog.open)dialog.showModal();
  }
  function confirmAction(title,body,fn,label='Confirm'){show(title,`<p>${body}</p>`,()=>{fn();dialog.close();},label);}
  function start(template){
    show('Bring '+template.name+' west',`<label for="start-date">Starting point</label><select name="start-date" id="start-date"><option value="1848-06-02">The river introduction · June 2 · chapter 2</option><option value="1848-04-20">Full journey · April 20 · chapter 1</option></select><p class="muted">This adds a separate sheet. Existing travelers remain available.</p>`,f=>{change(s=>{if(s.characters.length>=12)throw new Error('This device already has 12 travelers.');const c=M.create(template,id(),f.get('start-date'));s.characters.push(c);s.activeId=c.id;});dialog.close();},'Start this traveler');
  }
  function add(){show('Choose another traveler',`<div class="cards">${R.pregens.map((p,i)=>`<button type="button" data-new="${i}" class="choice"><span>${esc(p.role)}</span><strong>${esc(p.name)}</strong></button>`).join('')}</div><button type="button" id="custom-new">Create your own</button><p class="muted compact">A reserve uses one of the party’s four active slots. Keep the patient or departed traveler’s sheet. This app does not add supplies or count extra rations.</p>`,null);document.querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>start(R.pregens[Number(b.dataset.new)]));$('#custom-new').onclick=custom;}
  function custom(){show('A new traveler',`<div class="field"><label for="new-name">Name</label><input id="new-name" name="name" required maxlength="100" value=""></div><label for="new-role">Role</label><select id="new-role" name="role">${Object.keys(R.roles).map(r=>opt(r,'Guide')).join('')}</select><p class="muted">Begins with the fixed array and the role’s first background. Use Correct sheet to choose a background, assign scores, or record a replacement’s earned techniques and Exhaustion 1. No supplies are created.</p>`,f=>{const role=f.get('role');const scores={STR:10,DEX:10,CON:13,INT:10,WIS:12,CHA:8};const primary=R.roles[role].primary;const old=scores[primary];scores[primary]=15;if(old===12)scores.DEX=12;const sorted=Object.values(scores).sort((a,b)=>a-b);if(sorted.join(',')!=='8,10,10,12,13,15'){scores.WIS=12;}start({name:f.get('name').trim(),role,background:Object.keys(R.roles[role].backgrounds)[0],scores,personal:{}});},'Choose starting point');}
  function edit(){const c=current();show('Correct this sheet',`<p class="muted compact">Record a table ruling or customize creation. This can override wounds and daily flags; ordinary damage and recovery use the main controls.</p><div class="two-fields"><div><label for="edit-name">Name</label><input id="edit-name" name="name" value="${esc(c.name)}" maxlength="100" required></div><div><label for="edit-player">Player</label><input id="edit-player" name="player" value="${esc(c.player)}" maxlength="100"></div><div class="full"><label for="background">Background</label><select id="background" name="background">${Object.keys(R.roles[c.role].backgrounds).map(b=>opt(b,c.background)).join('')}</select></div>${M.ABILITIES.map(a=>`<div><label for="edit-${a}">${a}</label><input id="edit-${a}" name="${a}" type="number" min="3" max="18" value="${c.scores[a]}" required></div>`).join('')}<div><label for="edit-hp">Current HP</label><input id="edit-hp" name="hp" type="number" min="0" max="12" value="${c.hp}" required></div><div><label for="edit-ex">Exhaustion</label><input id="edit-ex" name="exhaustion" type="number" min="0" max="6" value="${c.exhaustion}" required></div><div><label for="wound">Wound</label><select id="wound" name="wound">${M.WOUNDS.map(w=>opt(w,c.wound)).join('')}</select></div><div><label for="edit-date">Trail date</label><input id="edit-date" name="date" type="date" value="${c.date}" required></div><div><label for="edit-chapter">Chapter</label><input id="edit-chapter" name="chapter" type="number" min="1" max="7" value="${c.chapter}" required></div></div><label class="check"><input type="checkbox" name="gained"${checked(c.gainedToday)}> Exhaustion gained today</label><label class="check"><input type="checkbox" name="rested"${checked(c.restedToday)}> Rest recorded today</label><button type="button" class="danger" id="remove-traveler">Remove this traveler</button>`,f=>{
      const candidate=M.clone(current());for(const k of ['name','player','background','wound','date'])candidate[k]=f.get(k);for(const k of ['hp','exhaustion','chapter'])candidate[k]=Number(f.get(k));for(const a of M.ABILITIES)candidate.scores[a]=Number(f.get(a));candidate.gainedToday=f.has('gained');candidate.restedToday=f.has('rested');M.validateCharacter(candidate);change((s)=>{s.characters[s.characters.findIndex(x=>x.id===candidate.id)]=candidate;});dialog.close();});
    $('#remove-traveler').onclick=()=>confirmAction('Remove this traveler?',`Remove ${esc(c.name)} from this device? Export a backup first to keep their story. This does not affect another iPad. Undo can restore the last saved change.`,()=>change(s=>{s.characters=s.characters.filter(x=>x.id!==c.id);s.activeId=s.characters[0]?.id||null;}),'Remove traveler');
  }
  function rest(){show('Record a Rest Day',`<p>Resolve today’s condition damage and recovery with the GM first. This records your HP, Exhaustion, and wound recovery only; it does not advance the date or spend wagon supplies.</p><label class="check"><input type="checkbox" name="fed"> I received my full Rest Day ration</label><label for="rest-die">Your d4 healing roll</label><input name="die" id="rest-die" type="number" min="1" max="4" value="1" required><label class="check"><input type="checkbox" name="wound"> My CON DC 10 wound recovery succeeded</label><p class="muted compact">Unfed rest heals 1 HP only. Fed rest heals d4 + 1 HP, removes 1 Exhaustion, and can improve one wound step. HP healing uses your current maximum before Exhaustion removal.</p>`,f=>{const options={fed:f.has('fed'),die:Number(f.get('die')),woundSuccess:f.has('wound')};M.rest(M.clone(current()),options);change((s,c)=>M.rest(c,options));dialog.close();},'Record rest');}
  function conditionAdd(){
    const available=Object.keys(R.conditions).filter(kind=>!current().conditions.some(condition=>condition.kind===kind && condition.marks>0));
    show('Record a condition',`<label for="kind">Condition</label><select id="kind" name="kind">${available.map(kind=>opt(kind,'')).join('')}</select><p class="muted compact">Resolve exposure first. Record any immediate damage or Exhaustion separately. Use the Exhaustion control for “Exhaustion illness.”</p>`,form=>{
      const kind=form.get('kind');
      if(!kind)throw new Error('All available conditions are already active.');
      change((state,character)=>M.recordCondition(character,kind));
      dialog.close();
    },'Add tracker');
  }
  function techniques(){const c=current();show('Choose learned techniques',`<p>One choice after chapter 2; another after chapter 5. Replacements inherit the earned number. Select up to two different options agreed at your table.</p>${Object.entries(R.roles[c.role].techniques).map(([name,text])=>`<label class="check"><input type="checkbox" name="technique" value="${esc(name)}"${checked(c.techniques.includes(name))}> ${esc(name)}</label><p class="rule">${rich(text)}</p>`).join('')}`,f=>{const ts=f.getAll('technique');if(ts.length>2)throw new Error('Select at most two techniques.');change((s,c)=>{c.techniques=ts;});dialog.close();});}
  function exportControls(id,label){
    return `<div class="row"><button type="button" id="download-${id}">Download ${label}</button><button type="button" id="copy-${id}">Copy ${label}</button></div>`;
  }
  function wireExport(id,text,filename){
    $('#download-'+id).onclick=()=>download(text,filename);
    $('#copy-'+id).onclick=async()=>{
      try{
        await navigator.clipboard.writeText(text);
        const status=$('#dialog-error');
        if(status)status.textContent='Copied. Paste into a file or note you keep.';
      }catch{
        const fallback=$('#copy-fallback');
        if(!fallback)return;
        fallback.hidden=false;
        const area=$('#copy-text');
        area.value=text;
        area.focus();
        area.select();
        $('#dialog-error').textContent='Use Copy on the selected text, then save it outside the browser.';
      }
    };
  }
  function backup(){
    const visible=state.characters.length?M.exportSave(state):null;
    const saved=damaged?.savedState?.characters.length?M.exportSave(damaged.savedState):null;
    const raw=damaged?store.damagedRaw:null;
    let archive=null, archiveError='';
    try{archive=store?.archive()??null;}catch(error){archiveError=error.message;}
    show('Keep a copy of the journey',`<p>Keep portable backups in Files or another location outside the browser. After a download request, check Files to confirm it was saved.</p>
      ${visible?exportControls('visible','visible travelers'):'<p>No visible travelers to export.</p>'}
      ${damaged?`<hr class="divider"><h3>Damaged save</h3>${saved?`<p>The saved travelers passed validation. Export them in an importable backup before recovery.</p>${exportControls('saved','recoverable travelers')}`:'<p>The stored traveler data could not be validated.</p>'}<p>The raw recovery file contains the original stored text for manual repair.</p>${exportControls('raw','current raw save')}${memoryOnly?'':'<button type="button" id="recover-save">Preserve raw data &amp; recover</button>'}`:''}
      ${archive!==null?`<hr class="divider"><h3>Local recovery archive</h3><p>This archive holds the original stored text from an earlier recovery attempt.</p>${exportControls('archive','raw archive')}${memoryOnly?'':'<button type="button" id="remove-archive">Remove local archive</button>'}`:''}
      ${archiveError?`<p>Could not read the local archive: ${esc(archiveError)}</p>`:''}
      <div id="copy-fallback" hidden><label for="copy-text">Selected backup text</label><textarea id="copy-text" class="backup-text" readonly></textarea></div>
      <hr class="divider"><label for="import-file">Import a portable backup (adds copies)</label><input type="file" id="import-file" accept="application/json,.json"><label for="import-text">Or paste a portable backup</label><textarea id="import-text" class="backup-text" maxlength="${M.MAX_BACKUP_BYTES}"></textarea><button type="button" id="preview-import">Preview import</button><hr class="divider"><p class="compact">For iPad: open the HTTPS app in Safari, add it to the Home Screen, then choose/import your traveler in the Home Screen app. Wait for “Offline copy ready” and reopen once in Airplane Mode before play. Safari and the installed app may keep separate data.</p><button type="button" id="persist">Request persistent storage</button><p id="persist-status" class="compact"></p>`,null);
    const today=new Date().toISOString().slice(0,10);
    if(visible)wireExport('visible',visible,`oregon-trail-backup-${today}.json`);
    if(saved)wireExport('saved',saved,`oregon-trail-recoverable-travelers-${today}.json`);
    if(damaged)wireExport('raw',S.exportRaw(raw),`oregon-trail-current-raw-${today}.json`);
    if(archive!==null)wireExport('archive',S.exportRaw(archive),`oregon-trail-archived-raw-${today}.json`);
    $('#preview-import').onclick=()=>previewImport($('#import-text').value);
    $('#import-file').onchange=async e=>{
      const input=e.target, file=input.files[0];
      if(!file)return;
      if(file.size>M.MAX_BACKUP_BYTES){$('#dialog-error').textContent='Backup is larger than 8 MiB.';return;}
      try{
        const text=await file.text();
        if(dialog.open && input.isConnected && input.files[0]===file)previewImport(text);
      }catch(error){if(dialog.open && input.isConnected && input.files[0]===file)$('#dialog-error').textContent=error.message;}
    };
    $('#persist').onclick=async()=>{try{const supported=Boolean(navigator.storage?.persist);const granted=supported&&await navigator.storage.persist();$('#persist-status').textContent=granted?'Persistent storage granted. Keep an external backup anyway.':supported?'Persistent storage was not granted. Keep an external backup.':'This browser does not offer persistent storage requests. Keep an external backup.';}catch{$('#persist-status').textContent='Storage request failed. Your existing save was not changed.';}};
    if(damaged && !memoryOnly)$('#recover-save').onclick=()=>confirmAction('Preserve and recover','This replaces the visible sheets and archives the damaged save locally. If the saved travelers passed validation, recovery keeps them and clears undo history. Otherwise recovery starts empty. Export any visible work and the current raw save first. A different existing archive or an archive write failure stops recovery.',async()=>{
      try{
        await queue;
        state=await navigator.locks.request(S.KEY,()=>store.recoverEmpty(raw));
        blocked=false;damaged=null;editGroup=null;warn('');
        say(state.characters.length?'Recovered travelers · cleared damaged undo history':'Recovered empty save · import a backup or choose a traveler');
        render();
      }catch(error){warn('Recovery stopped: '+error.message);}
    },'Preserve & recover');
    if(archive!==null && !memoryOnly)$('#remove-archive').onclick=()=>confirmAction('Remove local recovery archive?','Check that you have saved a copy outside the browser. Removing the archive leaves the current save available.',async()=>{
      try{
        await navigator.locks.request(S.KEY,()=>store.removeArchive(archive));
        if(!dialog.open)backup();
      }catch(error){warn('Could not remove archive: '+error.message);}
    },'Remove local archive');
  }
  function download(text,name){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#dialog-error').textContent='Download requested. Check Files to confirm it was saved.';}
  function previewImport(raw){try{const candidate=M.parseImport(raw);if(blocked)throw new Error('Resolve the save warning first; the imported backup has not changed any data.');show('Import these travelers?',`<p>These will be added as separate copies. Your current sheets remain intact.</p><ul>${candidate.characters.map(c=>`<li>${esc(c.name)} · ${esc(c.role)} · ${c.hp}/${M.maxHP(c)} HP · ${esc(c.date)}</li>`).join('')}</ul>`,()=>{const next=M.mergeImport(state,candidate,id);change(s=>Object.assign(s,next));dialog.close();},'Add copies');}catch(err){$('#dialog-error').textContent=err.message;}}
  app.addEventListener('click',e=>{
    const b=e.target.closest('button[data-action]');if(!b||blocked)return;
    const action=b.dataset.action,c=current();warn('');
    if(action==='choose')return start(R.pregens[Number(b.dataset.index)]);
    if(action==='custom')return custom();if(action==='add')return add();if(action==='edit')return edit();
    if(action==='tab'){tab=b.dataset.tab;render();return;}
    if(action==='damage'||action==='heal'){const n=Number($('#hp-amount').value);if(action==='damage'&&c.hp-n<=0){confirmAction('Damage reaches zero',`Record ${n} damage as one separate hit? Wound state advances at most once. Undo is available afterward.`,()=>change((s,c)=>M.damage(c,n),{label:'record '+n+' damage'}),'Record damage');}else change((s,c)=>M[action](c,n),{label:action==='damage'?'record '+n+' damage':'heal '+n+' HP'});return;}
    if(action==='exhaust')return change((s,c)=>M.exhaust(c));
    if(action==='recover')return confirmAction('Remove one Exhaustion','Confirm that this traveler received their full daily ration and a rule or table ruling permits this recovery. This does not reset today’s gain limit.',()=>change((s,c)=>M.recoverExhaustion(c,true)),'Record recovery');
    if(action==='stabilize')return confirmAction('Ordinary stabilization','An able companion must spend their action. This restores 1 HP at zero; it does not clear a wound or prevent condition damage.',()=>change((s,c)=>{if(c.hp!==0)throw new Error('Ordinary stabilization is for a patient at 0 HP.');M.heal(c,1);}),'Record stabilization');
    if(action==='rest')return rest();
    if(action==='day')return confirmAction('Start the next trail day','First resolve today’s food, water, condition damage, recovery, and evening with the GM. This advances the date by one, clears daily use and care reminders, and permits a new Exhaustion gain. It applies no supplies, damage, or healing.',()=>change((s,c)=>M.nextDay(c)),'Start next day');
    if(action==='session')return confirmAction('New play session','Clear this traveler’s personal-stakes award and session-use reminders. Held Inspiration, health, date, and chapter uses stay as they are.',()=>change((s,c)=>{c.awardUsed=false;M.resetUses(c,'session');}),'Start session');
    if(action==='span')return confirmAction('New weather span','Clear weather-span use reminders only. The GM controls weather; this does not advance the date.',()=>change((s,c)=>M.resetUses(c,'span')),'Reset span reminders');
    if(action==='chapter')return show('Start a chapter',`<label for="next-chapter">Chapter</label><select name="chapter" id="next-chapter">${[1,2,3,4,5,6,7].map(n=>opt(n,Math.min(7,c.chapter+1))).join('')}</select><p>Resets chapter-use reminders only. No date, supplies, healing, or techniques are granted automatically.</p>`,f=>{change((s,c)=>{c.chapter=Number(f.get('chapter'));M.resetUses(c,'chapter');});dialog.close();},'Start chapter');
    if(action==='condition-add')return conditionAdd();
    if(action==='condition-remove')return confirmAction('Remove condition tracker',`Remove ${esc(c.conditions[Number(b.dataset.index)].kind)}? This records a resolved condition or corrects an entry; it does not heal HP.`,()=>change((s,c)=>c.conditions.splice(Number(b.dataset.index),1)),'Remove tracker');
    if(action==='techniques')return techniques();
  });
  app.addEventListener('focusin',e=>{const t=e.target;if(t.dataset.field||t.dataset.personal||t.dataset.condition!==undefined)editGroup=id();});
  app.addEventListener('focusout',()=>{editGroup=null;});
  app.addEventListener('input',e=>{
    const t=e.target, field=t.dataset.field||t.dataset.personal||t.dataset.key;
    if(!field)return;
    if(!editGroup)editGroup=id();
    const label='edit '+(field==='notes'?'journal':field==='today'?"today’s plan":field);
    const options={redraw:false,label,group:editGroup};
    if(t.dataset.field)change((s,c)=>{c[t.dataset.field]=t.value;},options);
    if(t.dataset.personal)change((s,c)=>{c.personal[t.dataset.personal]=t.value;},options);
    if(t.dataset.condition!==undefined)change((s,c)=>{c.conditions[Number(t.dataset.condition)][t.dataset.key]=t.value;},options);
  });
  app.addEventListener('change',e=>{const t=e.target;if(t.id==='traveler')change(s=>{s.activeId=t.value;},{label:'select traveler'});if(t.dataset.flag)change((s,c)=>{c[t.dataset.flag]=t.checked;},{redraw:false,label:'change '+t.dataset.flag});if(t.dataset.use)change((s,c)=>{c.uses[t.dataset.use]=t.checked;},{redraw:false,label:'change use reminder'});if(t.dataset.marks!==undefined)change((s,c)=>{c.conditions[Number(t.dataset.marks)].marks=Number(t.value);},{label:'change recovery marks'});});
  $('#backup').onclick=backup;
  $('#undo').onclick=async()=>{
    await queue;
    if(blocked||memoryOnly||!store?.undoCount)return;
    const token=store.expected, label=store.undoLabel;
    confirmAction('Undo: '+label,`Restore all sheets to immediately before “${esc(label)}”? Typing during one field visit is one edit. Undo steps backward through up to eight recent checkpoints; older ones may expire for space. There is no Redo. Export first to keep the current version.`,async()=>{
      undoing=true;pending++;updateLock();
      try{state=await navigator.locks.request(S.KEY,()=>store.undo(token));editGroup=null;say('Undone: '+label);render();}
      catch(err){blocked=true;warn(err.message+' Your visible sheets remain exportable.');say('Undo stopped · action needed');}
      finally{undoing=false;pending--;updateLock();}
    },'Undo this change');
  };
  $('#load-saved').onclick=()=>confirmAction('Load the saved version','Your visible unsaved changes will be replaced. Export them first from Back up / restore if you need to keep them.',async()=>{
    await queue;
    try{readSaved();warn('');say(memoryOnly?'Loaded · this window cannot save changes':'Loaded saved version');render();}
    catch(error){readFailed(error);}
  },'Load saved version');
  window.addEventListener('storage',e=>{if(e.key!==S.KEY&&e.key!==null)return;if(e.newValue!==store?.expected){blocked=true;warn('Another window changed the saved data. Your visible work is preserved here. Export it, then load the saved version.');say('Saving paused · another window changed the save');updateLock();}});
  window.addEventListener('beforeunload',e=>{if(pending||blocked||memoryOnly&&state.characters.length){e.preventDefault();e.returnValue='';}});
  async function offline(){
    const badge=$('#offline-status');
    if(!isSecureContext||!('serviceWorker' in navigator)){badge.textContent='Offline install needs HTTPS (or localhost for development)';return;}
    const service=navigator.serviceWorker;
    let registration, checkNumber=0;
    function status(message){badge.textContent=message+(registration?.waiting?' · update ready after all app windows close':'');}
    const installTimer=setTimeout(()=>{if(!service.controller)status('Offline copy not confirmed · reopen while online');},10000);
    function check(){
      const worker=service.controller;
      if(!worker)return;
      clearTimeout(installTimer);
      const number=++checkNumber;
      const channel=new MessageChannel();
      const finish=message=>{
        clearTimeout(timer);
        channel.port1.close();
        if(number===checkNumber && worker===service.controller)status(message);
      };
      const timer=setTimeout(()=>finish('Offline copy not confirmed · reopen while online'),5000);
      channel.port1.onmessage=event=>finish(event.data.complete?'Offline copy ready · test once in Airplane Mode':'Offline copy incomplete · reopen while online');
      try{worker.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);}
      catch{finish('Offline copy not confirmed · reopen while online');}
    }
    function watchInstall(){
      const worker=registration.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed')check();
        if(worker.state==='redundant' && !service.controller){
          clearTimeout(installTimer);
          status('Offline copy failed · reconnect and reopen before play');
        }
      });
    }
    service.addEventListener('controllerchange',check);
    try{
      registration=await service.register('./sw.js',{scope:'./'});
      registration.addEventListener('updatefound',watchInstall);
      watchInstall();
      check();
    }catch{
      clearTimeout(installTimer);
      if(service.controller)check();
      else status('Offline copy failed · reconnect and reopen before play');
    }
  }
  memoryOnly=!navigator.locks;
  try{readSaved();say(state.characters.length?'Loaded from this device':'Ready · choose a traveler');}catch(error){readFailed(error);}
  if(memoryOnly && !blocked){warn('This context cannot safely coordinate local saves. Use the app over HTTPS in a current Safari version. You can work here and export a backup, but changes will not be saved to this browser.');say('Memory only · export before closing');}
  render();offline();
})();
