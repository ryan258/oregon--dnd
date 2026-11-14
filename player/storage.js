/* Synchronous storage core; callers serialize writes and undo with a Web Lock. */
(function(root,factory){const api=factory(typeof module==='object'?require('./model.js'):root.TrailModel);if(typeof module==='object')module.exports=api;else root.TrailStorage=api;})(globalThis,function(M){
  'use strict';
  const KEY='oregon-trail-player-v1', PREVIOUS=KEY+'-previous', ARCHIVE=KEY+'-unreadable';
  const HISTORY_LIMIT=8, HISTORY_BYTES=1024*1024;
  const nextRevision=revision=>revision===M.MAX_REVISION?1:revision+1;
  function readHistory(parsed) {
    if (!Object.hasOwn(parsed, '_undo')) return [];
    if (!Array.isArray(parsed._undo) || parsed._undo.length > HISTORY_LIMIT) throw new Error('Unreadable undo history.');
    return parsed._undo.map(entry => {
      if (!entry || typeof entry.label !== 'string' || entry.label.length > 160) throw new Error('Unreadable undo label.');
      return {label: entry.label, state: M.validateState(entry.state)};
    });
  }
  function decode(raw) {
    let state=null;
    try {
      const parsed=JSON.parse(raw);
      state=M.validateState(parsed);
      return {state,entries:readHistory(parsed),legacy:!Object.hasOwn(parsed,'_undo')};
    } catch (error) {
      error.code='DAMAGED_SAVE';
      error.savedState=state;
      throw error;
    }
  }
  // Encode the original string losslessly, including unusual line endings and UTF-16 code units.
  function exportRaw(raw) {
    return JSON.stringify({format:'oregon-trail-player-recovery',version:1,raw},null,2);
  }
  function open(storage) {
    let expected, damagedRaw, history=[], lastGroup=null;
    function read() {
      expected=undefined;damagedRaw=undefined;history=[];lastGroup=null;
      const raw=storage.getItem(KEY);
      if(raw===null){expected=null;return M.empty();}
      let decoded;
      try{decoded=decode(raw);}catch(error){damagedRaw=raw;throw error;}
      let {state,entries}=decoded;
      if(decoded.legacy){
        // Preserve the old app's previous-save slot on first successful write.
        // An unavailable legacy slot must not prevent reading a valid current save.
        try{const old=storage.getItem(PREVIOUS);if(old!==null)entries=[{label:'previous saved change',state:M.validateState(JSON.parse(old))}];}catch{}
      }
      expected=raw;history=entries;lastGroup=null;return state;
    }
    function checkCurrent() {
      if(expected===undefined)throw new Error('Saved data could not be read. Export the unreadable data before recovery.');
      if(storage.getItem(KEY)!==expected){const e=new Error('Another window changed this sheet. Export your visible work, then load the saved version.');e.code='CONFLICT';throw e;}
    }
    function write(value,entries,group) {
      const next=M.validateState(value);
      next.revision=expected===null?1:nextRevision(M.validateState(JSON.parse(expected)).revision);
      const raw=JSON.stringify({...next,_undo:entries});
      // One atomic write: a failed save cannot replace its undo checkpoint.
      storage.setItem(KEY,raw);
      expected=raw;history=entries;lastGroup=group;return next;
    }
    function save(value,{snapshot=false,label='sheet change',group=null}={}) {
      checkCurrent();
      let entries=history.slice();
      if(snapshot && !(group && group===lastGroup)) {
        const before=expected===null?M.empty():M.validateState(JSON.parse(expected));
        entries.push({label:String(label).slice(0,160),state:before});
        // Keep the newest checkpoint even when a large save alone exceeds the budget.
        while(entries.length>1&&(entries.length>HISTORY_LIMIT||M.backupBytes(JSON.stringify(entries))>HISTORY_BYTES))entries.shift();
      }
      return write(value,entries,group);
    }
    function previous(){if(!history.length)throw new Error('No previous action is saved.');return M.clone(history.at(-1).state);}
    function undo(token=expected) {
      checkCurrent();
      if(token!==expected)throw new Error('The save changed after Undo was opened. Review the latest action first.');
      return write(previous(),history.slice(0,-1),null);
    }
    function recoverEmpty(reviewedRaw=damagedRaw){
      const raw=storage.getItem(KEY);
      let failure;
      if(raw!==null){try{decode(raw);}catch(error){failure=error;}}
      if(!failure)throw new Error('The stored save is now valid. Load it instead of replacing it.');
      if(raw!==damagedRaw || raw!==reviewedRaw)throw new Error('Stored data changed since the failed read. Load it before recovering.');
      const archived=storage.getItem(ARCHIVE);
      if(archived!==null && archived!==raw)throw new Error('A different recovery archive already exists. Save it outside the browser, then remove its local copy before recovering.');
      // A damaged history must not discard otherwise valid traveler records.
      const next=failure.savedState||M.empty();
      next.revision=nextRevision(next.revision);
      const encoded=JSON.stringify({...next,_undo:[]});
      if(archived!==raw)storage.setItem(ARCHIVE,raw);
      storage.setItem(KEY,encoded);
      expected=encoded;damagedRaw=undefined;history=[];lastGroup=null;return next;
    }
    function removeArchive(archived){
      if(storage.getItem(ARCHIVE)!==archived)throw new Error('The archive changed. Reopen Back up / restore before removing it.');
      storage.removeItem(ARCHIVE);
    }
    return {read,save,previous,undo,recoverEmpty,removeArchive,archive:()=>storage.getItem(ARCHIVE),get damagedRaw(){return damagedRaw;},get expected(){return expected;},get undoLabel(){return history.at(-1)?.label||null;},get undoCount(){return history.length;}};
  }
  return {KEY,PREVIOUS,ARCHIVE,HISTORY_LIMIT,HISTORY_BYTES,exportRaw,open};
});
