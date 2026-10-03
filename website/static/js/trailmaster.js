/* Browser controller. Character saves and their service worker remain independent. */
(() => {
  'use strict';
  const M = window.TrailLedger;
  const KEY = `oregon-trail-trailmaster-v1:${location.pathname.replace(/\/+$/, '')}`;
  const $ = id => document.getElementById(id);
  let state = null;
  let history = [];
  let expected = null;
  let revision = 0;
  let queue = Promise.resolve();
  let blocked = false;
  let unsaved = false;
  let memoryOnly = !navigator.locks;
  let rawUnreadable = null;
  let pendingConfirm = null;
  let returnFocus = null;
  let pendingWrites = 0;
  const dirtyFields = new Set();
  let dayDirty = false;
  const fields = [...document.querySelectorAll('[data-field]')];

  function status(message, error = false) {
    $('save-status').textContent = message;
    $('save-status').classList.toggle('error', error);
  }
  function download(raw, filename) {
    const url = URL.createObjectURL(new Blob([raw], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function announceSaved(label) {
    if (memoryOnly || unsaved) status(`${label}. Kept in this open page only — download a backup before leaving. Browser saving is unavailable.`, true);
    else status(`${label}. Saved in this browser.`);
  }
  function load() {
    let raw;
    try { raw = localStorage.getItem(KEY); } catch { memoryOnly = true; raw = null; }
    expected = raw;
    blocked = false;
    rawUnreadable = null;
    state = null;
    history = [];
    revision = 0;
    let repairedHistory = false;
    if (raw !== null) {
      try {
        const save = JSON.parse(raw);
        if (save.format !== 'oregon-trail-trailmaster-storage' || save.version !== 1) throw new Error('Unsupported saved ledger format.');
        state = M.validate(save.state);
        if (!Number.isSafeInteger(save.revision) || save.revision < 0) throw new Error('Invalid save revision.');
        revision = save.revision;
        // Bad optional history must not make a valid current campaign inaccessible.
        try {
          if (!Array.isArray(save.history) || save.history.length > 10) throw new Error('Bad history.');
          history = save.history.map(entry => {
            if (typeof entry.label !== 'string' || entry.label.length > 120) throw new Error('Bad undo label.');
            return {label: entry.label, state: M.validate(entry.state)};
          });
        } catch { history = []; repairedHistory = true; rawUnreadable = raw; }
      } catch (error) {
        state = null;
        rawUnreadable = raw;
        status(`The saved ledger could not be read: ${error.message} Download its original bytes before replacing it, or import a known backup.`, true);
      }
    }
    hydrate();
    $('reload').hidden = true;
    $('raw-export').hidden = rawUnreadable === null;
    if (repairedHistory) status('Your current campaign loaded, but its undo history was unreadable and has been ignored. You can download the original save.', true);
    else if (state) announceSaved('Ledger loaded');
    else if (rawUnreadable === null) status(memoryOnly ? 'Choose a starting snapshot. This browser supports an open-page ledger only; download backups to keep your work.' : 'Choose a starting snapshot, or import your Trailmaster backup.');
  }
  function hydrate() {
    for (const input of fields) {
      const key = input.dataset.field;
      if (M.numbers[key]) [input.min, input.max, input.step] = M.numbers[key];
      if (M.texts[key]) input.maxLength = M.texts[key];
      if (state) {
        if (input.type === 'checkbox') input.checked = state[key];
        else input.value = state[key];
      }
    }
    if (state) $('day-to').value = state.marker;
    render();
  }
  function render() {
    $('ledger-fields').hidden = !state;
    $('ledger-fields').disabled = !state || blocked;
    $('empty-ledger').hidden = !!state;
    $('export').disabled = !state;
    $('undo').disabled = !state || !history.length || blocked;
    $('undo').textContent = history.length ? `Undo: ${history[history.length - 1].label}` : 'Undo';
    if (!state) return;
    const total = state.cured + state.fresh1 + state.fresh2;
    const teams = ['A', 'B', 'C'].filter(key => state[`ox${key}`] > 0 && !state[`ox${key}Lame`]).length;
    $('summary-date').textContent = new Date(`${state.date}T12:00:00Z`).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
    $('summary-marker').textContent = `${state.marker.toLocaleString()} / 2,000`;
    $('summary-food').textContent = `${total} lbs`;
    $('summary-morale').textContent = `${state.morale} / 10`;
    $('progress').setAttribute('aria-valuenow', state.marker);
    $('progress-fill').style.width = `${state.marker / 20}%`;
    const warnings = [];
    if (!state.weatherDays) warnings.push('Weather span ended. Roll and record the next span before acting.');
    if (total < 50 && !state.foodThreshold) warnings.push('Food is below 50 lbs. Resolve the once-per-chapter Morale loss if newly crossed, then mark it.');
    if (state.wagon < 5 && !state.wagonThreshold) warnings.push('Wagon is below 5 HP. Resolve the once-per-chapter Morale loss if newly crossed, then mark it.');
    if (state.morale === 0) warnings.push('Morale 0: stop at the next safe camp for regrouping or a player-agreed ending.');
    else if (state.morale <= 2) warnings.push('Morale 1–2: make room for a breaking-point scene.');
    else if (state.morale <= 4) warnings.push('Morale 3–4: start the next camp conversation with a disagreement.');
    for (const n of [1, 2]) if (state[`fresh${n}`] && state[`fresh${n}Expiry`] <= state.date) warnings.push(`Fresh batch ${n}: ${state[`fresh${n}Expiry`] < state.date ? 'already expired; remove it before using supplies' : 'last edible day is today'}.`);
    if (state.waterTracked && state.water < 4) warnings.push('Less than 4 gallons remain. Check today’s actual weather, consumption, and next safe source.');
    if (state.peopleCount !== 4) warnings.push('The day estimate buttons assume four travelers. Adjust food for everyone actually being fed.');
    $('warnings').replaceChildren(...warnings.map(message => { const li = document.createElement('li'); li.textContent = message; return li; }));
    $('team-summary').textContent = `${teams} usable tracked ox team${teams === 1 ? '' : 's'}. ${!teams || !state.wagon || state.ableCount < 2 ? 'Wagon travel is stopped.' : teams === 1 ? 'Ox speed modifier: ×0.75.' : 'Ox speed modifier: full speed.'} ${state.exhaustedCount >= 2 ? 'Two or more travelers at Exhaustion 2+: apply ×0.5 once.' : ''} Apply weather and scene effects, then round miles once, upward. Record additional teams in cargo notes and account for them manually.`;
    $('journal-count').textContent = `${state.log.length} daily entries. Showing the most recent 30; every entry stays in the backup.`;
    const rows = state.log.slice(-30).reverse().map(row => {
      const article = document.createElement('article'); article.className = 'log-entry';
      const title = document.createElement('h3'); title.textContent = `${row.date} · ${row.action}`;
      const detail = document.createElement('p'); detail.textContent = `${row.miles} actual miles · marker ${row.from} → ${row.to} · ${row.food} lbs eaten · ${row.water} gallons used${row.spoiled ? ` · ${row.spoiled} lbs expired` : ''}`;
      const note = document.createElement('p'); note.textContent = row.note;
      article.append(title, detail, note); return article;
    });
    $('journey-log').replaceChildren(...rows);
  }
  function mutate(label, change, options = {}) {
    pendingWrites++;
    const operation = async () => {
      if (blocked) throw new Error('Another tab changed this ledger. Download this page’s backup if needed, then load the latest saved ledger.');
      if (options.base !== undefined && options.base !== JSON.stringify(state)) throw new Error('The ledger changed after this preview. Review the action again.');
      if (!memoryOnly) {
        let current;
        try { current = localStorage.getItem(KEY); } catch { memoryOnly = true; }
        if (!memoryOnly && current !== expected) {
          blocked = true; $('reload').hidden = false; render();
          throw new Error('Another tab changed this ledger. Your visible record is preserved. Download a backup or load the latest saved ledger.');
        }
      }
      const candidate = M.validate(change(state ? M.clone(state) : null));
      let nextHistory = options.undo ? history.slice(0, -1) : [...history, ...(state ? [{label, state: M.clone(state)}] : [])].slice(-10);
      // Bound optional history independently from the current campaign.
      while (nextHistory.length && M.bytes(JSON.stringify(nextHistory)) > M.MAX_BYTES) nextHistory.shift();
      if (!memoryOnly) {
        const raw = JSON.stringify({format: 'oregon-trail-trailmaster-storage', version: 1, revision: revision + 1, state: candidate, history: nextHistory});
        try { localStorage.setItem(KEY, raw); expected = raw; revision++; unsaved = false; rawUnreadable = null; $('raw-export').hidden = true; }
        catch { unsaved = true; }
      }
      state = candidate;
      history = nextHistory;
      if (options.hydrate) hydrate(); else render();
      announceSaved(label);
      return true;
    };
    const result = queue.then(() => navigator.locks ? navigator.locks.request(KEY, operation) : operation());
    queue = result.catch(error => { status(error.message, true); return false; }).finally(() => { pendingWrites--; });
    return queue;
  }
  function confirm(title, message, label, callback) {
    returnFocus = document.activeElement;
    $('confirm-title').textContent = title;
    $('confirm-body').textContent = message;
    $('confirm-yes').textContent = label;
    pendingConfirm = callback;
    $('confirm-dialog').showModal();
    $('confirm-no').focus();
  }
  function closeConfirm() {
    pendingConfirm = null;
    $('confirm-dialog').close();
    if (returnFocus?.isConnected) returnFocus.focus();
  }
  $('confirm-no').addEventListener('click', closeConfirm);
  $('confirm-dialog').addEventListener('cancel', event => { event.preventDefault(); closeConfirm(); });
  $('confirm-yes').addEventListener('click', async () => {
    const callback = pendingConfirm;
    $('confirm-yes').disabled = true;
    try { if (callback) await callback(); } catch (error) { status(error.message, true); }
    finally { $('confirm-yes').disabled = false; closeConfirm(); }
  });
  for (const input of fields) input.addEventListener('input', () => { dirtyFields.add(input.dataset.field); });
  for (const input of fields) input.addEventListener('change', async () => {
    const key = input.dataset.field;
    const value = input.type === 'checkbox' ? input.checked : input.type === 'number' ? (input.value === '' ? NaN : Number(input.value)) : input.value;
    if (!state || value === state[key]) { dirtyFields.delete(key); return; }
    const label = `Edit ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    const okay = await mutate(label, next => { next[key] = value; return next; });
    if (state) { if (input.type === 'checkbox') input.checked = state[key]; else input.value = state[key]; }
    dirtyFields.delete(key);
    if (!okay) input.focus();
  });
  for (const button of document.querySelectorAll('[data-step]')) button.addEventListener('click', async () => {
    const key = button.dataset.target;
    const delta = Number(button.dataset.step) * (key === 'money' ? 1 : ['cured', 'fresh1', 'fresh2', 'water'].includes(key) ? 1 : M.numbers[key][2]);
    await mutate(`Change ${key}`, next => { next[key] = Math.round((next[key] + delta) * 100) / 100; return next; });
    if (state) document.querySelector(`[data-field="${key}"]`).value = state[key];
  });
  for (const preset of ['river', 'campaign']) $(`new-${preset}`).addEventListener('click', async () => {
    await queue;
    if (blocked) { status('Load the latest saved ledger before starting another journey.', true); return; }
    const candidate = M.create(preset);
    const begin = async () => { if (await mutate(`Start ${preset}`, () => candidate, {hydrate: true})) resetDayDraft(); };
    if (state || rawUnreadable !== null) confirm('Start a new journey?', 'This replaces the current shared ledger in this browser. Download a backup first if you want a separate copy. Character sheets are separate. A readable previous ledger is available in Undo.', 'Start new journey', begin);
    else await begin();
  });
  $('undo').addEventListener('click', async () => {
    await queue;
    if (!history.length) return;
    const entry = history[history.length - 1];
    await mutate(`Undid ${entry.label}`, () => entry.state, {undo: true, hydrate: true});
  });
  $('export').addEventListener('click', async () => { await queue; if (state) download(M.exportBackup(state), `oregon-trail-ledger-${state.date}.json`); });
  $('raw-export').addEventListener('click', () => { if (rawUnreadable !== null) download(rawUnreadable, 'oregon-trail-unreadable-ledger.json'); });
  $('reload').addEventListener('click', () => confirm('Load the latest saved ledger?', 'This discards this page’s unsaved changes and unfinished day estimate. Download a backup first to keep this page’s campaign record.', 'Load latest', async () => { await queue; unsaved = false; load(); resetDayDraft(); }));
  $('import').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', async event => {
    const file = event.target.files[0]; event.target.value = '';
    if (!file) return;
    try {
      if (file.size > M.MAX_BYTES) throw new Error('Choose a backup no larger than 2 MiB.');
      const candidate = M.parseBackup(await file.text());
      await queue;
      const base = JSON.stringify(state);
      confirm('Import this journey?', `${candidate.name}\n${candidate.date} · marker ${candidate.marker} · ${candidate.log.length} daily entries\n\nThis replaces the shared ledger. Your current readable journey will be kept in Undo.`, 'Import journey', async () => { if (await mutate('Import backup', () => candidate, {hydrate: true, base})) resetDayDraft(); });
    } catch (error) { status(error.message, true); }
  });
  for (const button of document.querySelectorAll('[data-person]')) button.addEventListener('click', async () => {
    if (await mutate(`Add ${button.dataset.person}`, next => { next.people += `${next.people ? '\n\n' : ''}${button.dataset.person} → Choice: … → Change: … → Next appearance / deadline: …`; return next; })) {
      const input = document.querySelector('[data-field="people"]'); input.value = state.people; input.focus(); input.setSelectionRange(input.value.length, input.value.length);
    }
  });
  function resetDayDraft() {
    $('day-action').value = 'Travel'; $('day-miles').value = 0; $('day-to').value = state?.marker ?? 0;
    $('day-food').value = 4; $('day-water').value = 0; $('day-note').value = '';
    dayDirty = false;
  }
  for (const id of ['day-action', 'day-miles', 'day-to', 'day-food', 'day-water', 'day-note']) $(id).addEventListener('input', () => { dayDirty = true; });
  for (const button of document.querySelectorAll('[data-day]')) button.addEventListener('click', () => {
    const presets = {standard: ['Standard travel', 18, 4], rest: ['Rest', 0, 2], labor: ['River ramp labor (two workers, two resting)', 0, 3], crossing: ['River crossing', 18, 4], other: ['Other action', 0, 4]};
    const [action, miles, food] = presets[button.dataset.day];
    $('day-action').value = action; $('day-miles').value = miles; $('day-to').value = Math.min(2000, state.marker + miles); $('day-food').value = food; $('day-water').value = state.waterTracked ? 2 : 0;
    dayDirty = true;
    status('Estimate filled. Adjust for actual travelers, weather, stance, teams, scene rules, and any food-saving ability before previewing.');
  });
  $('preview-day').addEventListener('click', async () => {
    await queue;
    try {
      const value = id => $(id).value === '' ? NaN : Number($(id).value);
      const draft = {action: $('day-action').value, miles: value('day-miles'), to: value('day-to'), food: value('day-food'), water: value('day-water'), note: $('day-note').value};
      const result = M.recordDay(state, draft);
      const base = JSON.stringify(state);
      const row = result.row;
      confirm(`Close ${state.date}?`, `${row.action}\n${row.miles} actual miles; route marker ${row.from} → ${row.to}.\nEat ${row.food} lbs food; use ${row.water} gallons water.\nDiscard ${row.spoiled} lbs fresh food after this evening.\nNext date: ${result.state.date}. Weather days left: ${result.state.weatherDays}.\n\nHealth, recovery, damage, money, Morale, chapter entry, and promises must already be resolved separately. No dice or character sheets will change.`, 'Record & advance one day', async () => {
        if (await mutate('Close day', () => result.state, {hydrate: true, base})) resetDayDraft();
      });
    } catch (error) { status(error.message, true); }
  });
  window.addEventListener('storage', event => {
    if ((event.key === KEY || event.key === null) && !memoryOnly) {
      blocked = true; $('reload').hidden = false; render(); status('This ledger changed in another tab. Your page is preserved; download it or load the latest saved ledger before editing.', true);
    }
  });
  window.addEventListener('beforeunload', event => {
    if (unsaved || pendingWrites || dirtyFields.size || (memoryOnly && state) || dayDirty) { event.preventDefault(); event.returnValue = ''; }
  });
  $('ledger-app').hidden = false;
  load();
})();
