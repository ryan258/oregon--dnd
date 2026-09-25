/* Small synchronous storage core; the UI wraps writes in a Web Lock. */
(function(root,factory){const api=factory(typeof module==='object'?require('./model.js'):root.TrailModel);if(typeof module==='object')module.exports=api;else root.TrailStorage=api;})(globalThis,function(M){
  'use strict';
  const KEY='oregon-trail-player-v1', PREVIOUS=KEY+'-previous';
  function open(storage) {
    let expected;
    function read() {
      const raw=storage.getItem(KEY);
      const state=raw===null?M.empty():M.validateState(JSON.parse(raw));
      expected=raw;return state;
    }
    function save(value,{snapshot=false}={}) {
      if(expected===undefined)throw new Error('Saved data could not be read. Export the unreadable data before recovery.');
      const actual=storage.getItem(KEY);
      if(actual!==expected){const e=new Error('Another window changed this sheet. Export your visible work, then load the saved version.');e.code='CONFLICT';throw e;}
      const next=M.validateState(value);
      next.revision=expected===null?1:M.validateState(JSON.parse(expected)).revision+1;
      const raw=JSON.stringify(next);
      if(snapshot&&expected!==null)storage.setItem(PREVIOUS,expected); // fail before replacing current
      storage.setItem(KEY,raw);
      expected=raw;
      return next;
    }
    function previous(){const raw=storage.getItem(PREVIOUS);if(raw===null)throw new Error('No previous action is saved.');return M.validateState(JSON.parse(raw));}
    function recoverEmpty(){
      const raw=storage.getItem(KEY);
      let valid=false;
      if(raw!==null){try{M.validateState(JSON.parse(raw));valid=true;}catch{}}
      if(valid)throw new Error('The stored save is now valid. Load it instead of replacing it.');
      if(raw!==null)storage.setItem(KEY+'-unreadable',raw);
      const next=M.empty();next.revision=1;
      const encoded=JSON.stringify(next);storage.setItem(KEY,encoded);expected=encoded;return next;
    }
    return {read,save,previous,recoverEmpty,raw:()=>storage.getItem(KEY),get expected(){return expected;}};
  }
  return {KEY,PREVIOUS,open};
});
