/* Browser controller. Character saves and their service worker remain independent. */
(() => {
  'use strict';
  const M = window.TrailLedger;
  const KEY = `oregon-trail-trailmaster-v1:${location.pathname.replace(/\/+$/, '')}`;
  const DAY_KEY = `${KEY}:day-draft`;
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
  let confirming = false;
  let returnFocus = null;
  let pendingWrites = 0;
  const fieldDrafts = new Map();
  const fields = new Map([...document.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input]));
  const dayFields = ['day-action', 'day-miles', 'day-to', 'day-food', 'day-water', 'day-note'];
  let dayDirty = false;
  let dayCustomized = false;
  let dayToManual = false;
  let dayStartDate = '';

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
    else if (fieldDrafts.size) status(`${label}. Other unfinished field edits are still open in this page.`, true);
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
        state = M.restore(save.state);
        if (!Number.isSafeInteger(save.revision) || save.revision < 0) throw new Error('Invalid save revision.');
        revision = save.revision;
        // Bad optional history must not make a valid current campaign inaccessible.
        try {
          if (!Array.isArray(save.history) || save.history.length > 10) throw new Error('Bad history.');
          history = save.history.map(entry => {
            if (typeof entry.label !== 'string' || entry.label.length > 120) throw new Error('Bad undo label.');
            return {label: entry.label, state: M.restore(entry.state)};
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
  function syncField(key) {
    if (!state || fieldDrafts.has(key)) return;
    const input = fields.get(key);
    if (input.type === 'checkbox') input.checked = state[key];
    else input.value = state[key];
  }
  function hydrate() {
    for (const [key, input] of fields) {
      if (M.numbers[key]) [input.min, input.max, input.step] = M.numbers[key];
      if (M.texts[key]) input.maxLength = M.texts[key];
      syncField(key);
    }
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
    syncDayMarker();
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
    if (state.peopleCount !== 5) warnings.push('The day estimate buttons assume five travelers. Adjust food for everyone actually being fed.');
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
      const entry = options.undo ? history[history.length - 1] : null;
      if (options.undo && !entry) return false;
      const updated = options.undo ? entry.state : change(state ? M.clone(state) : null);
      if (updated === undefined) {
        options.finish?.();
        announceSaved('No change');
        return true;
      }
      const candidate = M.validate(updated);
      let nextHistory = options.undo ? history.slice(0, -1) : [...history, ...(state ? [{label, state: M.clone(state)}] : [])].slice(-10);
      // Bound optional history independently from the current campaign.
      while (nextHistory.length && M.bytes(JSON.stringify(nextHistory)) > M.MAX_BYTES) nextHistory.shift();
      if (!memoryOnly) {
        const nextRevision = revision === Number.MAX_SAFE_INTEGER ? 1 : revision + 1;
        const raw = JSON.stringify({format: 'oregon-trail-trailmaster-storage', version: 1, revision: nextRevision, state: candidate, history: nextHistory});
        try { localStorage.setItem(KEY, raw); expected = raw; revision = nextRevision; unsaved = false; rawUnreadable = null; $('raw-export').hidden = true; }
        catch { unsaved = true; }
      }
      state = candidate;
      history = nextHistory;
      if (options.replace) fieldDrafts.clear();
      options.finish?.();
      if (options.hydrate) hydrate(); else render();
      announceSaved(options.undo ? `Undid ${entry.label}` : label);
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
    if (confirming) return;
    pendingConfirm = null;
    $('confirm-dialog').close();
    if (returnFocus?.isConnected) returnFocus.focus();
  }
  $('confirm-no').addEventListener('click', closeConfirm);
  $('confirm-dialog').addEventListener('cancel', event => { event.preventDefault(); closeConfirm(); });
  $('confirm-yes').addEventListener('click', async () => {
    const callback = pendingConfirm;
    if (!callback || confirming) return;
    confirming = true;
    $('confirm-yes').disabled = true;
    $('confirm-no').disabled = true;
    try { await callback(); } catch (error) { status(error.message, true); }
    finally {
      confirming = false;
      $('confirm-yes').disabled = false;
      $('confirm-no').disabled = false;
      closeConfirm();
    }
  });
  function fieldValue(input) {
    if (input.type === 'checkbox') return input.checked;
    if (input.type === 'number') return input.value === '' ? NaN : Number(input.value);
    return input.value;
  }
  function rememberField(key, input) {
    const draft = {value: fieldValue(input)};
    if (!fieldDrafts.size && !blocked && !memoryOnly && !unsaved) status('Editing a field. Leave it to save the change.');
    fieldDrafts.set(key, draft);
    return draft;
  }
  function finishField(key, draft) {
    if (fieldDrafts.get(key) === draft) fieldDrafts.delete(key);
    syncField(key);
    if (key === 'fresh1' || key === 'fresh2') syncField(`${key}Expiry`);
  }
  function fieldName(key) { return key.replace(/([A-Z])/g, ' $1').toLowerCase(); }
  for (const [key, input] of fields) {
    input.addEventListener('input', () => rememberField(key, input));
    input.addEventListener('change', async () => {
      if (!state) return;
      const current = fieldDrafts.get(key);
      const draft = current && Object.is(current.value, fieldValue(input)) ? current : rememberField(key, input);
      await mutate(`Edit ${fieldName(key)}`, next => {
        if (next[key] !== draft.value) return M.setField(next, key, draft.value);
      }, {finish: () => finishField(key, draft)});
    });
  }
  for (const button of document.querySelectorAll('[data-step]')) button.addEventListener('click', async () => {
    const key = button.dataset.target;
    const draft = fieldDrafts.get(key);
    const delta = Number(button.dataset.step) * (key === 'money' ? 1 : ['cured', 'fresh1', 'fresh2', 'water'].includes(key) ? 1 : M.numbers[key][2]);
    await mutate(`Change ${key}`, next => M.setField(next, key, Math.round((next[key] + delta) * 100) / 100), {finish: () => finishField(key, draft)});
  });
  for (const preset of ['river', 'campaign']) $(`new-${preset}`).addEventListener('click', async () => {
    await queue;
    if (blocked) { status('Load the latest saved ledger before starting another journey.', true); return; }
    const candidate = M.create(preset);
    const base = JSON.stringify(state);
    const begin = async () => { if (await mutate(`Start ${preset}`, () => candidate, {hydrate: true, base, replace: true})) resetDayDraft(); };
    if (state || rawUnreadable !== null) {
      const title = preset === 'river' ? 'Start the river session?' : 'Start a full campaign?';
      confirm(title, 'This replaces the current shared ledger and discards unfinished edits. Download a backup first if you want a separate copy. A readable previous ledger is available in Undo.', 'Start new journey', begin);
    }
    else await begin();
  });
  $('undo').addEventListener('click', async () => {
    await mutate('Undo', null, {undo: true, hydrate: true});
  });
  $('export').addEventListener('click', async () => {
    await queue;
    if (!state) return;
    const candidate = M.clone(state);
    for (const [key, draft] of fieldDrafts) M.setField(candidate, key, draft.value);
    let raw;
    try { raw = M.exportBackup(candidate); }
    catch {
      let recovered = state;
      let skipped = [...fieldDrafts];
      let count;
      do {
        count = skipped.length;
        skipped = skipped.filter(([key, draft]) => {
          try { recovered = M.validate(M.setField(M.clone(recovered), key, draft.value)); return false; }
          catch { return true; }
        });
      } while (skipped.length && skipped.length < count);
      raw = M.exportBackup(recovered);
      if (skipped.length) status(`Backup excludes edits that need correction: ${skipped.map(([key]) => fieldName(key)).join(', ')}. They are still visible in this page.`, true);
    }
    download(raw, `oregon-trail-ledger-${state.date}.json`);
  });
  $('raw-export').addEventListener('click', () => { if (rawUnreadable !== null) download(rawUnreadable, 'oregon-trail-unreadable-ledger.json'); });
  $('reload').addEventListener('click', () => confirm('Load the latest saved ledger?', 'This discards this page’s unsaved ledger changes and unfinished day entry. Download a backup first to keep this page’s campaign record.', 'Load latest', async () => { await queue; unsaved = false; fieldDrafts.clear(); load(); resetDayDraft(); }));
  $('import').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', async event => {
    const file = event.target.files[0]; event.target.value = '';
    if (!file) return;
    try {
      if (file.size > M.MAX_BYTES) throw new Error('Choose a backup no larger than 2 MiB.');
      const candidate = M.parseBackup(await file.text());
      await queue;
      const base = JSON.stringify(state);
      confirm('Import this journey?', `${candidate.name}\n${candidate.date} · marker ${candidate.marker} · ${candidate.log.length} daily entries\n\nThis replaces the shared ledger and discards unfinished edits. Your current readable journey will be kept in Undo.`, 'Import journey', async () => { if (await mutate('Import backup', () => candidate, {hydrate: true, base, replace: true})) resetDayDraft(); });
    } catch (error) { status(error.message, true); }
  });
  for (const button of document.querySelectorAll('[data-person]')) button.addEventListener('click', async () => {
    if (await mutate(`Add ${button.dataset.person}`, next => { next.people += `${next.people ? '\n\n' : ''}${button.dataset.person} → Choice: … → Change: … → Next appearance / deadline: …`; return next; })) {
      if (fieldDrafts.has('people')) return;
      syncField('people');
      const input = fields.get('people'); input.focus(); input.setSelectionRange(input.value.length, input.value.length);
    }
  });
  function syncDayMarker() {
    if (!state || dayToManual) return;
    const miles = Number($('day-miles').value);
    $('day-to').value = state.marker + (Number.isFinite(miles) && miles > 0 ? Math.min(2000 - state.marker, miles) : 0);
  }
  function dayValues() { return dayFields.map(id => String($(id).value)); }
  function saveDayDraft() {
    try {
      if (!dayDirty) window.sessionStorage.removeItem(DAY_KEY);
      else window.sessionStorage.setItem(DAY_KEY, JSON.stringify({date: dayStartDate, values: dayValues(), manual: dayToManual, customized: dayCustomized}));
    } catch {
      // Draft still stays in this page if this tab cannot save it across refresh.
    }
  }
  function restoreDayDraft() {
    if (!state) return;
    try {
      const raw = window.sessionStorage.getItem(DAY_KEY);
      if (!raw || raw.length > 32000) return;
      const draft = JSON.parse(raw);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(draft?.date) || typeof draft.manual !== 'boolean' || typeof draft.customized !== 'boolean' ||
          !Array.isArray(draft.values) || draft.values.length !== dayFields.length || !draft.values.every(value => typeof value === 'string')) return;
      dayStartDate = draft.date;
      dayDirty = true;
      dayCustomized = draft.customized;
      dayToManual = draft.manual;
      dayFields.forEach((id, index) => { $(id).value = draft.values[index]; });
      syncDayMarker();
    } catch {
      // The saved ledger remains usable if the tab draft cannot be read.
    }
  }
  function resetDayDraft() {
    $('day-action').value = 'Travel'; $('day-miles').value = 0;
    $('day-food').value = 4; $('day-water').value = 0; $('day-note').value = '';
    dayDirty = dayCustomized = dayToManual = false;
    dayStartDate = '';
    syncDayMarker();
    saveDayDraft();
  }
  for (const id of dayFields) $(id).addEventListener('input', () => {
    if (!state) return;
    if (!dayDirty) dayStartDate = state.date;
    dayDirty = true;
    if (id !== 'day-note') dayCustomized = true;
    if (id === 'day-to') dayToManual = true;
    if (id === 'day-miles') syncDayMarker();
    saveDayDraft();
  });
  $('day-to').addEventListener('change', () => {
    if ($('day-to').value !== '') return;
    dayToManual = false;
    syncDayMarker();
    saveDayDraft();
  });
  function readyForDay() {
    if (!state || blocked) return false;
    if (!fieldDrafts.size) return true;
    const names = [...fieldDrafts.keys()].map(fieldName).join(', ');
    status(`Finish editing these shared ledger fields first: ${names}.`, true);
    return false;
  }
  for (const button of document.querySelectorAll('[data-day]')) button.addEventListener('click', async () => {
    await queue;
    if (!readyForDay()) return;
    const presets = {standard: ['Standard travel', 18, 5], rest: ['Rest', 0, 2.5], labor: ['River ramp labor (two workers, three resting)', 0, 3.5], crossing: ['River crossing', 18, 5], other: ['Other action', 0, 5]};
    const [action, miles, food] = presets[button.dataset.day];
    const fill = () => {
      if (!readyForDay()) return;
      $('day-action').value = action; $('day-miles').value = miles; $('day-food').value = food; $('day-water').value = state.waterTracked ? 2 : 0;
      dayDirty = true;
      dayCustomized = dayToManual = false;
      dayStartDate = state.date;
      syncDayMarker();
      saveDayDraft();
      status('Estimate filled. Adjust for actual travelers, weather, stance, teams, scene rules, and any food-saving ability before previewing.');
    };
    if (dayCustomized) confirm('Replace your day estimate?', 'This replaces the action, distance, and costs you entered. Your day note stays in place.', 'Fill estimate', fill);
    else fill();
  });
  $('preview-day').addEventListener('click', async () => {
    await queue;
    if (!readyForDay()) return;
    try {
      const value = id => $(id).value === '' ? NaN : Number($(id).value);
      const draft = {action: $('day-action').value, miles: value('day-miles'), to: value('day-to'), food: value('day-food'), water: value('day-water'), note: $('day-note').value};
      const result = M.recordDay(state, draft);
      const base = JSON.stringify(state);
      const inputs = dayValues();
      const row = result.row;
      const dateWarning = dayDirty && dayStartDate !== state.date ? `You started this entry for ${dayStartDate}. Review the current date before recording.\n` : '';
      const markerWarning = row.to < row.from ? 'This moves the route marker backward. Review that change before recording.\n' : '';
      confirm(`Close ${state.date}?`, `${dateWarning}${markerWarning}${row.action}\n${row.miles} actual miles; route marker ${row.from} → ${row.to}.\nEat ${row.food} lbs food; use ${row.water} gallons water.\nDiscard ${row.spoiled} lbs fresh food after this evening.\nNext date: ${result.state.date}. Weather days left: ${result.state.weatherDays}.\n\nHealth, recovery, damage, money, Morale, chapter entry, and promises must already be resolved separately. No dice or character sheets will change.`, 'Record & advance one day', async () => {
        if (await mutate('Close day', () => {
          if (fieldDrafts.size || dayValues().some((value, index) => value !== inputs[index])) throw new Error('The inputs changed after this preview. Review the day again.');
          return result.state;
        }, {hydrate: true, base})) resetDayDraft();
      });
    } catch (error) { status(error.message, true); }
  });
  window.addEventListener('storage', event => {
    if (!memoryOnly && (event.key === null || (event.key === KEY && event.newValue !== expected))) {
      blocked = true; $('reload').hidden = false; render(); status('This ledger changed in another tab. Your page is preserved; download it or load the latest saved ledger before editing.', true);
    }
  });
  window.addEventListener('beforeunload', event => {
    if (unsaved || pendingWrites || fieldDrafts.size || (memoryOnly && state) || dayDirty) { event.preventDefault(); event.returnValue = ''; }
  });
  $('ledger-app').hidden = false;
  load();
  restoreDayDraft();
})();
