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
  state.fresh2Expiry = '1848-06-01'; assert.throws(() => M.recordDay(state, day()), /already expired/);
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
function harness(initial = null, {quota = false, locks = true} = {}) {
  const elements = new Map(), listeners = {};
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
  document.querySelectorAll = selector => selector === '[data-field]' ? fields : [];
  document.querySelector = selector => fields.find(field => selector.includes(`"${field.dataset.field}"`));
  document.createElement = () => new Element();
  const window = {TrailLedger: M, addEventListener(name, fn) { listeners[name] = fn; }};
  const storage = {getItem() { return stored; }, setItem(key, value) { if (quota) throw new Error('Quota exceeded'); stored = value; }};
  vm.runInNewContext(fs.readFileSync(require.resolve('../static/js/trailmaster.js'), 'utf8'), {window, document, navigator: locks ? {locks: {request: async (key, fn) => fn()}} : {}, location: {pathname: '/trailmaster/'}, localStorage: storage, Blob, URL, setTimeout() {}});
  return {get, read: () => stored && JSON.parse(stored), raw: () => stored, replace: value => { stored = value; }, listeners, async click(id) { await get(id).click(); }, async edit(key, value) { const input = get(`field-${key}`); input.value = String(value); await input.fire('change'); }};
}
test('controller persists field edits and labeled undo across reload', async () => {
  const ui = harness(); await ui.click('new-river'); await ui.edit('money', 15);
  assert.equal(ui.read().state.money, 15);
  const reloaded = harness(ui.raw()); await reloaded.click('undo');
  assert.equal(reloaded.read().state.money, 25);
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
