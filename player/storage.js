/* Synchronous storage core; callers serialize writes and undo with a Web Lock. */
(function(root,factory){const api=factory(typeof module==='object'?require('./model.js'):root.TrailModel);if(typeof module==='object')module.exports=api;else root.TrailStorage=api;})(globalThis,function(M){
  'use strict';
  const KEY='oregon-trail-player-v1', PREVIOUS=KEY+'-previous';
  const HISTORY_LIMIT=8, HISTORY_BYTES=1024*1024;
  function open(storage) {
    let expected, history=[], lastGroup=null;
    function read() {
      const raw=storage.getItem(KEY), parsed=raw===null?null:JSON.parse(raw);
      const state=parsed===null?M.empty():M.validateState(parsed);
      let entries=[];
      if(parsed && Object.hasOwn(parsed,'_undo')) {
        if(!Array.isArray(parsed._undo)||parsed._undo.length>HISTORY_LIMIT)throw new Error('Unreadable undo history.');
        entries=parsed._undo.map(entry=>{
          if(!entry||typeof entry.label!=='string'||entry.label.length>160)throw new Error('Unreadable undo label.');
          return {label:entry.label,state:M.validateState(entry.state)};
        });
      } else if(parsed) {
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
      next.revision=expected===null?1:M.validateState(JSON.parse(expected)).revision+1;
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
    function recoverEmpty(){
      const raw=storage.getItem(KEY);
      let valid=false;
      if(raw!==null){try{M.validateState(JSON.parse(raw));valid=true;}catch{}}
      if(valid)throw new Error('The stored save is now valid. Load it instead of replacing it.');
      if(raw!==null)storage.setItem(KEY+'-unreadable',raw);
      const next=M.empty();next.revision=1;
      const encoded=JSON.stringify({...next,_undo:[]});storage.setItem(KEY,encoded);expected=encoded;history=[];lastGroup=null;return next;
    }
    return {read,save,previous,undo,recoverEmpty,raw:()=>storage.getItem(KEY),get expected(){return expected;},get undoLabel(){return history.at(-1)?.label||null;},get undoCount(){return history.length;}};
  }
  return {KEY,PREVIOUS,HISTORY_LIMIT,HISTORY_BYTES,open};
});
