/* Shared ledger only. The manuscript, not this bookkeeping model, resolves the game. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TrailLedger = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1;
  const MAX_BYTES = 2 * 1024 * 1024;
  const numbers = {
    marker: [0, 2000, 1], chapter: [1, 7, 1], morale: [0, 10, 1], weatherDays: [0, 3, 1],
    cured: [0, 800, .5], fresh1: [0, 100, .5], fresh2: [0, 100, .5], water: [0, 80, .5], capacity: [0, 80, 10],
    medicine: [0, 10, 1], ammo: [0, 200, 1], parts: [0, 5, 1], money: [0, 100000, .01],
    wagon: [0, 30, 1], oxA: [0, 10, 1], oxB: [0, 10, 1], oxC: [0, 10, 1],
    peopleCount: [1, 20, 1], ableCount: [0, 4, 1], exhaustedCount: [0, 4, 1]
  };
  const texts = {name: 120, weather: 120, nextDecision: 3000, checkpoint: 1000, nextWater: 1000, deadline: 1000, cargo: 6000, people: 16000, notes: 24000};
  const booleans = ['oxALame', 'oxBLame', 'oxCLame', 'bedding', 'tools', 'waterTracked', 'moraleBonus', 'foodThreshold', 'wagonThreshold', 'eventDone', 'costsDone', 'recoveryDone'];
  const dates = ['date', 'fresh1Expiry', 'fresh2Expiry'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const bytes = value => new TextEncoder().encode(value).length;
  function fail(message) { throw new Error(message); }
  function text(value, limit, label) {
    if (typeof value !== 'string' || value.length > limit) fail(`${label} must be text of at most ${limit} characters.`);
    return value;
  }
  function number(value, min, max, step, label) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || Math.abs(value / step - Math.round(value / step)) > .00001) fail(`${label} must be ${min}–${max}, in steps of ${step}.`);
    return value;
  }
  function validDate(value, optional = false) {
    if (optional && value === '') return value;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1800-01-01' || value > '1899-12-31') fail('Use a valid date between 1800 and 1899.');
    const date = new Date(`${value}T12:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail('That calendar date does not exist.');
    return value;
  }
  function nextDate(value) {
    const date = new Date(`${validDate(value)}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return validDate(date.toISOString().slice(0, 10));
  }
  function validate(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input) || input.version !== VERSION) fail('This is not a supported Trailmaster ledger (version 1).');
    const state = {version: VERSION};
    for (const [key, range] of Object.entries(numbers)) state[key] = number(input[key], ...range, key);
    for (const [key, limit] of Object.entries(texts)) state[key] = text(input[key], limit, key);
    for (const key of booleans) {
      if (typeof input[key] !== 'boolean') fail(`${key} must be checked or unchecked.`);
      state[key] = input[key];
    }
    for (const key of dates) state[key] = validDate(input[key], key !== 'date');
    if (state.fresh1 + state.fresh2 > 100 || state.cured + state.fresh1 + state.fresh2 > 800) fail('Food capacity is 800 lbs total, including at most 100 lbs fresh.');
    if (state.water > state.capacity) fail('Water cannot exceed the current barrel capacity. Reduce water before lowering capacity.');
    for (const n of [1, 2]) if (state[`fresh${n}`] && !state[`fresh${n}Expiry`]) fail(`Set batch ${n}'s last edible date before adding fresh food.`);
    if (!Array.isArray(input.log) || input.log.length > 1000) fail('A ledger can hold up to 1,000 daily entries. Export before starting another ledger.');
    state.log = input.log.map(row => {
      if (!row || typeof row !== 'object') fail('Invalid journey entry.');
      return {date: validDate(row.date), action: text(row.action, 100, 'Action'), from: number(row.from, 0, 2000, 1, 'Starting marker'), to: number(row.to, 0, 2000, 1, 'Ending marker'), miles: number(row.miles, 0, 500, 1, 'Actual miles'), food: number(row.food, 0, 800, .5, 'Food spent'), water: number(row.water, 0, 80, .5, 'Water spent'), spoiled: number(row.spoiled, 0, 100, .5, 'Spoiled food'), note: text(row.note, 3000, 'Daily note')};
    });
    if (bytes(JSON.stringify({format: 'oregon-trail-trailmaster', version: VERSION, state})) > MAX_BYTES) fail('This ledger exceeds the 2 MiB backup limit.');
    return state;
  }
  function restore(input) {
    const state = validate(input);
    for (const n of [1, 2]) {
      if (!state[`fresh${n}`]) state[`fresh${n}Expiry`] = '';
    }
    return state;
  }
  function create(preset) {
    if (!['campaign', 'river'].includes(preset)) fail('Choose campaign or river.');
    const river = preset === 'river';
    const state = {version: VERSION};
    for (const key of Object.keys(numbers)) state[key] = 0;
    for (const key of Object.keys(texts)) state[key] = '';
    for (const key of booleans) state[key] = false;
    Object.assign(state, {
      name: river ? 'The River Between' : 'Our road to Oregon', date: river ? '1848-06-02' : '1848-04-20', marker: river ? 340 : 0,
      chapter: river ? 2 : 1, morale: river ? 6 : 7, weather: river ? 'Clear and Mild' : 'Roll before the first day', weatherDays: river ? 3 : 0,
      cured: river ? 140 : 700, fresh1Expiry: '', fresh2Expiry: '', water: 60, capacity: 60, medicine: river ? 4 : 7,
      ammo: river ? 40 : 160, parts: river ? 2 : 3, money: river ? 25 : 250, wagon: river ? 22 : 30,
      oxA: river ? 8 : 10, oxB: river ? 8 : 10, oxC: river ? 8 : 10, bedding: true, tools: true,
      peopleCount: 4, ableCount: 4, exhaustedCount: 0,
      nextDecision: river ? 'Ferry on day 2 ($10), risky ford today, two ramp labor days then cross, or prepare a rope line for a safe day-2 crossing (1 part)? Show each cost and Nessa’s deadline before choosing.' : 'Name dreams and promises. Choose the first day’s action.',
      checkpoint: river ? 'Far bank: marker 358. Stop after the crossing.' : 'Mercy’s crate and the book scene: marker 120.',
      deadline: river ? 'Nessa and Mara depart at dawn June 4, unless their own travel is weather-delayed.' : '',
      cargo: 'Eliza’s book crate · Mae’s tool chest · Warm Bedding · ordinary tools, rope, cooking gear, canvas.', log: []
    });
    return validate(state);
  }
  function setField(state, key, value) {
    if ((key === 'fresh1' || key === 'fresh2') && state[key] > 0 && value === 0) state[`${key}Expiry`] = '';
    state[key] = value;
    return state;
  }
  function recordDay(input, draft) {
    const state = validate(input);
    const action = text(draft.action, 100, 'Action').trim();
    if (!action) fail('Name the resolved action.');
    const food = number(draft.food, 0, 800, .5, 'Actual food spent');
    const water = number(draft.water, 0, 80, .5, 'Actual water spent');
    const miles = number(draft.miles, 0, 500, 1, 'Actual miles traveled');
    const to = number(draft.to, 0, 2000, 1, 'Ending route marker');
    const note = text(draft.note, 3000, 'Daily note');
    if (food > state.cured + state.fresh1 + state.fresh2 || water > state.water) fail('Not enough supplies for those actual costs. Enter what was available and resolve short-ration or water consequences at the table.');
    if (!state.waterTracked && water > 0) fail('Enable water tracking for this stretch before spending water.');
    if (state.costsDone) fail('Today’s costs are already marked complete. Uncheck that marker only if these costs have not already been recorded.');
    for (const n of [1, 2]) if (state[`fresh${n}`] && state[`fresh${n}Expiry`] < state.date) fail(`Fresh batch ${n} has already expired. Remove it from supplies before recording today.`);
    const row = {date: state.date, action, from: state.marker, to, miles, food, water, spoiled: 0, note};
    let remaining = food;
    const batches = [1, 2].sort((a, b) => state[`fresh${a}Expiry`].localeCompare(state[`fresh${b}Expiry`]));
    for (const n of batches) {
      const take = Math.min(remaining, state[`fresh${n}`]);
      state[`fresh${n}`] -= take;
      remaining -= take;
      if (state[`fresh${n}Expiry`] && state[`fresh${n}Expiry`] <= state.date) {
        row.spoiled += state[`fresh${n}`];
        state[`fresh${n}`] = 0;
      }
      if (!state[`fresh${n}`]) state[`fresh${n}Expiry`] = '';
    }
    state.cured -= remaining;
    state.water -= water;
    state.marker = to;
    state.date = nextDate(state.date);
    state.weatherDays = Math.max(0, state.weatherDays - 1);
    state.eventDone = state.costsDone = state.recoveryDone = false;
    state.log.push(row);
    return {state: validate(state), row};
  }
  function parseBackup(raw) {
    if (typeof raw !== 'string' || bytes(raw) > MAX_BYTES) fail('Choose a Trailmaster JSON backup no larger than 2 MiB.');
    let data;
    try { data = JSON.parse(raw); } catch { fail('The backup is not readable JSON.'); }
    if (data?.format !== 'oregon-trail-trailmaster' || data?.version !== VERSION) fail('Use a Trailmaster backup, not a player character backup.');
    return restore(data.state);
  }
  function exportBackup(state) { return JSON.stringify({format: 'oregon-trail-trailmaster', version: VERSION, state: restore(state)}); }
  return {VERSION, MAX_BYTES, numbers, texts, booleans, dates, clone, bytes, validate, restore, create, setField, recordDay, parseBackup, exportBackup, nextDate};
});
