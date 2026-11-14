const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../static/js/trail-model.js');

const day = (overrides = {}) => ({action: 'Travel', miles: 18, to: 358, food: 4, water: 0, note: '', ...overrides});
test('starting snapshots match the campaign and standalone river loadouts', () => {
  const campaign = M.create('campaign'), river = M.create('river');
  assert.deepEqual([campaign.date, campaign.marker, campaign.morale, campaign.cured, campaign.money, campaign.wagon, campaign.medicine, campaign.ammo, campaign.parts], ['1848-04-20', 0, 7, 700, 250, 30, 7, 160, 3]);
  assert.deepEqual([river.date, river.marker, river.morale, river.cured, river.money, river.wagon, river.oxA, river.medicine, river.ammo, river.parts], ['1848-06-02', 340, 6, 140, 25, 22, 8, 4, 40, 2]);
});
test('daily close is a pure preview, advances once, and keeps actual miles separate from route markers', () => {
  const original = M.create('campaign'); original.marker = 790;
  const result = M.recordDay(original, day({miles: 40, to: 900}));
  assert.equal(original.marker, 790); assert.equal(original.cured, 700);
  assert.equal(result.state.date, '1848-04-21'); assert.equal(result.state.marker, 900);
  assert.equal(result.row.miles, 40); assert.equal(result.state.cured, 696);
});
test('fresh food is spent by expiry, then leftovers expire only after their last evening', () => {
  const state = M.create('river');
  Object.assign(state, {fresh1: 8, fresh1Expiry: '1848-06-05', fresh2: 10, fresh2Expiry: '1848-06-02'});
  const result = M.recordDay(state, day());
  assert.equal(result.state.cured, 140); assert.equal(result.state.fresh1, 8); assert.equal(result.state.fresh2, 0);
  assert.equal(result.row.spoiled, 6);
  assert.equal(result.state.fresh2Expiry, '');
  state.fresh2Expiry = '1848-06-01'; assert.throws(() => M.recordDay(state, day()), /already expired/);
});
test('an emptied batch requires a new expiry before accepting more fresh food', () => {
  const state = M.create('river');
  Object.assign(state, {fresh1: 4, fresh1Expiry: '1848-06-03'});
  const next = M.recordDay(state, day()).state;
  assert.equal(next.fresh1, 0);
  assert.equal(next.fresh1Expiry, '');
  assert.throws(() => M.validate({...next, fresh1: 30}), /last edible date/);
  assert.equal(M.setField(state, 'fresh1', 0).fresh1Expiry, '');
});
test('shortages, duplicate costs, invalid dates and category caps cannot silently corrupt totals', () => {
  const state = M.create('river');
  assert.throws(() => M.recordDay(state, day({food: 141})), /Not enough/);
  assert.throws(() => M.recordDay(state, day({water: 2})), /Enable water/);
  state.costsDone = true; assert.throws(() => M.recordDay(state, day()), /already marked/);
  assert.throws(() => M.validate({...state, date: '1848-02-30'}), /does not exist/);
  assert.throws(() => M.validate({...state, water: 70}), /capacity/);
  assert.throws(() => M.validate({...state, fresh1: 1}), /last edible date/);
  assert.throws(() => M.validate({...state, cured: 801}), /0–800/);
  assert.equal(M.nextDate('1848-02-28'), '1848-02-29');
});
test('backup round trip preserves text and rejects wrong formats and nonfinite values', () => {
  const state = M.create('river'); state.people = '<img src=x onerror=alert(1)> · Promise: books';
  assert.deepEqual(M.parseBackup(M.exportBackup(state)), state);
  assert.throws(() => M.parseBackup('{"version":1,"characters":[]}'), /Trailmaster backup/);
  assert.throws(() => M.parseBackup('{bad'), /readable JSON/);
  assert.throws(() => M.validate({...state, money: NaN}), /money/);
});

// A small controller harness injects storage failures and competing writes without browser state access.
function harness(initial = null, {quota = false, locks = true, session = new Map()} = {}) {
  const elements = new Map(), listeners = {};
  const downloads = [];
  let stored = initial;
  const document = {activeElement: null};
  class Element {
    constructor(id = '') { this.id = id; this.dataset = {}; this.value = ''; this.checked = false; this.handlers = {}; this.style = {}; this.isConnected = true; this.classList = {toggle() {}}; }
    addEventListener(event, callback) { this.handlers[event] = callback; }
    async fire(event, extra = {}) { return this.handlers[event]?.({target: this, ...extra}); }
    setAttribute() {}
    replaceChildren(...children) { this.children = children; }
    append(...children) { this.children = children; }
    focus() { document.activeElement = this; }
    setSelectionRange() {}
    showModal() { this.open = true; }
    close() { this.open = false; }
    click() { return this.fire('click'); }
  }
  const get = id => { if (!elements.has(id)) elements.set(id, new Element(id)); return elements.get(id); };
  const fields = [...Object.keys(M.numbers), ...Object.keys(M.texts), ...M.booleans, ...M.dates].map(key => {
    const input = get(`field-${key}`); input.dataset.field = key;
    input.type = M.numbers[key] ? 'number' : M.booleans.includes(key) ? 'checkbox' : 'text'; return input;
  });
  document.getElementById = get;
  const presets = ['standard', 'rest', 'labor', 'crossing', 'other'].map(name => {
    const button = get(`preset-${name}`); button.dataset.day = name; return button;
  });
  document.querySelectorAll = selector => ({'[data-field]': fields, '[data-day]': presets})[selector] || [];
  get('day-action').value = 'Travel'; get('day-miles').value = '0'; get('day-food').value = '4'; get('day-water').value = '0';
  document.createElement = () => new Element();
  const window = {
    TrailLedger: M,
    addEventListener(name, fn) { listeners[name] = fn; },
    sessionStorage: {getItem: key => session.get(key), setItem: (key, value) => session.set(key, value), removeItem: key => session.delete(key)}
  };
  const storage = {getItem() { return stored; }, setItem(key, value) { if (quota) throw new Error('Quota exceeded'); stored = value; }};
  const navigator = locks ? {locks: {request: typeof locks === 'function' ? locks : async (key, fn) => fn()}} : {};
  const URL = {createObjectURL(blob) { downloads.push(blob); return 'blob:backup'; }, revokeObjectURL() {}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../static/js/trailmaster.js'), 'utf8'), {window, document, navigator, location: {pathname: '/trailmaster/'}, localStorage: storage, Blob, URL, setTimeout() {}});
  async function type(id, value) {
    const input = get(id);
    if (input.type === 'checkbox') input.checked = value; else input.value = String(value);
    await input.fire('input');
    return input;
  }
  return {get, downloads, session, type, read: () => stored && JSON.parse(stored), raw: () => stored, replace: value => { stored = value; }, listeners, async click(id) { await get(id).click(); }, async edit(key, value) { await (await type(`field-${key}`, value)).fire('change'); }};
}
test('controller persists field edits and labeled undo across reload', async () => {
  const ui = harness(); await ui.click('new-river'); await ui.edit('money', 15);
  assert.equal(ui.read().state.money, 15);
  const reloaded = harness(ui.raw()); await reloaded.click('undo');
  assert.equal(reloaded.read().state.money, 25);
});
test('legacy saves, undo checkpoints, and backups clear expiry only for empty batches', async () => {
  const original = harness(); await original.click('new-river');
  const saved = original.read();
  const oldBatches = {fresh1Expiry: '1848-06-03', fresh2: 8, fresh2Expiry: '1848-06-05'};
  Object.assign(saved.state, oldBatches);
  saved.history.push({label: 'Older batch state', state: {...saved.state, money: 24}});
  const ui = harness(JSON.stringify(saved));
  assert.equal(ui.get('field-fresh1Expiry').value, '');
  assert.equal(ui.get('field-fresh2Expiry').value, '1848-06-05');
  await ui.edit('fresh1', 30);
  assert.match(ui.get('save-status').textContent, /last edible date/);
  await ui.edit('fresh1', 0);
  await ui.click('undo');
  assert.equal(ui.read().state.fresh1Expiry, '');
  assert.equal(ui.read().state.fresh2Expiry, '1848-06-05');
  const backup = JSON.stringify({format: 'oregon-trail-trailmaster', version: 1, state: saved.state});
  assert.equal(M.parseBackup(backup).fresh1Expiry, '');
  assert.equal(M.parseBackup(backup).fresh2Expiry, '1848-06-05');
  assert.equal(JSON.parse(M.exportBackup(saved.state)).state.fresh1Expiry, '');
});
test('overlapping Undo operations restore successive checkpoints', async () => {
  const ui = harness(); await ui.click('new-river');
  for (const cash of [24, 23, 22]) await ui.edit('money', cash);
  await Promise.all([ui.click('undo'), ui.click('undo')]);
  assert.equal(ui.read().state.money, 24);
  assert.deepEqual(ui.read().history.map(entry => entry.state.money), [25]);
});
test('a delayed field save keeps newer typing visible and recoverable', async () => {
  const first = harness(); await first.click('new-river');
  let release;
  const ui = harness(first.raw(), {locks: (key, fn) => new Promise(resolve => { release = () => resolve(fn()); })});
  const field = await ui.type('field-nextDecision', 'first decision');
  const writing = field.fire('change');
  await ui.type('field-nextDecision', 'newer focused decision');
  release();
  await writing;
  assert.equal(ui.read().state.nextDecision, 'first decision');
  assert.equal(field.value, 'newer focused decision');
  assert.match(ui.get('save-status').textContent, /unfinished field edits/);
  let warned = false;
  ui.listeners.beforeunload({preventDefault() { warned = true; }});
  assert.equal(warned, true);
  await ui.click('export');
  assert.equal(M.parseBackup(await ui.downloads[0].text()).nextDecision, 'newer focused decision');
});
test('quota failure preserves the last disk save and visible changes with an explicit backup warning', async () => {
  const original = harness(); await original.click('new-river');
  const ui = harness(original.raw(), {quota: true}); await ui.edit('money', 15);
  assert.equal(ui.read().state.money, 25); assert.equal(ui.get('field-money').value, 15);
  assert.match(ui.get('save-status').textContent, /open page only/);
});
test('stale writes are blocked without replacing another tab’s saved campaign', async () => {
  const first = harness(); await first.click('new-river');
  const ui = harness(first.raw()); const newer = first.read(); newer.state.money = 20; newer.revision++;
  ui.replace(JSON.stringify(newer)); await ui.edit('money', 10);
  assert.equal(ui.read().state.money, 20); assert.match(ui.get('save-status').textContent, /Another tab/);
  assert.equal(ui.get('field-money').value, '10');
  await ui.click('export');
  assert.equal(M.parseBackup(await ui.downloads[0].text()).money, 10);
  await ui.click('reload');
  await ui.click('confirm-yes');
  assert.equal(ui.get('field-money').value, 20);
  ui.listeners.storage({key: 'oregon-trail-trailmaster-v1:/trailmaster', newValue: ui.raw()});
  assert.equal(ui.get('ledger-fields').disabled, false);
  ui.listeners.storage({key: null, newValue: null});
  assert.equal(ui.get('ledger-fields').disabled, true);
});
test('recovery backup includes valid edits and reports excluded invalid values', async () => {
  const ui = harness(); await ui.click('new-river');
  await ui.edit('money', -4);
  await ui.type('field-nextDecision', 'Read back the ferry terms');
  await ui.click('export');
  const recovered = M.parseBackup(await ui.downloads[0].text());
  assert.equal(recovered.nextDecision, 'Read back the ferry terms');
  assert.equal(recovered.money, 25);
  assert.equal(ui.get('field-money').value, '-4');
  assert.match(ui.get('save-status').textContent, /excludes edits that need correction: money/);
  await ui.click('preview-day');
  assert.match(ui.get('save-status').textContent, /Finish editing.*money/);
  assert.notEqual(ui.get('confirm-dialog').open, true);
});
test('ending marker and estimate use the latest shared marker and water setting', async () => {
  const ui = harness(); await ui.click('new-river');
  await ui.edit('marker', 358);
  await ui.click('preview-day');
  assert.match(ui.get('confirm-body').textContent, /marker 358 → 358/);
  await ui.click('confirm-no');
  const water = await ui.type('field-waterTracked', true);
  await Promise.all([water.fire('change'), ui.click('preset-standard')]);
  assert.equal(ui.get('day-to').value, 376);
  assert.equal(ui.get('day-water').value, 2);
});
test('a custom day draft survives Undo, tab refresh, and canceling a preset replacement', async () => {
  const ui = harness(); await ui.click('new-river'); await ui.edit('marker', 345);
  await ui.type('day-miles', '16');
  await ui.type('day-to', '390');
  await ui.type('day-note', 'Saved before reaching the far bank.');
  await ui.click('undo');
  assert.equal(ui.read().state.marker, 340);
  assert.equal(ui.get('day-to').value, '390');
  const refreshed = harness(ui.raw(), {session: ui.session});
  assert.equal(refreshed.get('day-miles').value, '16');
  assert.equal(refreshed.get('day-to').value, '390');
  await refreshed.click('preset-crossing');
  assert.match(refreshed.get('confirm-title').textContent, /Replace your day estimate/);
  await refreshed.click('confirm-no');
  assert.equal(refreshed.get('day-to').value, '390');
  await refreshed.click('preset-crossing');
  await refreshed.click('confirm-yes');
  assert.equal(refreshed.get('day-to').value, 358);
  assert.equal(refreshed.get('day-note').value, 'Saved before reaching the far bank.');
  await refreshed.click('preview-day');
  await refreshed.click('confirm-yes');
  assert.equal(refreshed.read().state.log[0].note, 'Saved before reaching the far bank.');
  assert.equal(refreshed.session.size, 0);
});
test('an input change after the day preview prevents committing the old preview', async () => {
  const ui = harness(); await ui.click('new-river'); await ui.click('preview-day');
  await ui.type('day-note', 'Still deciding');
  await ui.click('confirm-yes');
  assert.equal(ui.read().state.log.length, 0);
  assert.equal(ui.get('day-note').value, 'Still deciding');
  assert.match(ui.get('save-status').textContent, /inputs changed after this preview/);
});
test('a boundary save revision remains readable after the next write', async () => {
  const original = harness(); await original.click('new-river');
  const save = {...original.read(), revision: Number.MAX_SAFE_INTEGER};
  const ui = harness(JSON.stringify(save)); await ui.edit('money', 24);
  assert.equal(ui.read().revision, 1);
  assert.equal(harness(ui.raw()).get('field-money').value, 24);
});
test('a confirmed replacement stays modal until the pending write finishes', async () => {
  const original = harness(); await original.click('new-river');
  let release;
  const ui = harness(original.raw(), {locks: (key, fn) => new Promise(resolve => { release = () => resolve(fn()); })});
  await ui.click('new-campaign');
  const writing = ui.click('confirm-yes');
  await ui.get('confirm-dialog').fire('cancel', {preventDefault() {}});
  assert.equal(ui.get('confirm-dialog').open, true);
  assert.equal(ui.read().state.marker, 340);
  release();
  await writing;
  assert.equal(ui.read().state.marker, 0);
  assert.equal(ui.get('confirm-dialog').open, false);
});
test('unreadable undo history leaves a valid current campaign usable and original bytes downloadable', async () => {
  const first = harness(); await first.click('new-river');
  const save = first.read(); save.history = 'damaged';
  const ui = harness(JSON.stringify(save));
  assert.equal(ui.get('ledger-fields').disabled, false);
  assert.equal(ui.get('raw-export').hidden, false);
  assert.match(ui.get('save-status').textContent, /undo history was unreadable/);
  await ui.edit('money', 24); assert.equal(ui.read().state.money, 24);
});
test('unsupported current saves stay intact, and no-lock browsers never overwrite storage', async () => {
  const raw = '{"version":999}'; const bad = harness(raw);
  assert.equal(bad.raw(), raw); assert.equal(bad.get('ledger-fields').disabled, true);
  const ui = harness(null, {locks: false}); await ui.click('new-river');
  assert.equal(ui.raw(), null); assert.match(ui.get('save-status').textContent, /open page only/);
});
