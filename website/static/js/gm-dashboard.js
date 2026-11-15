/* Streamlined GM Dashboard for 1 GM + 5 travelers (Essentials Only, MS & First-Time GM Friendly). */
(function () {
  'use strict';
  const R = globalThis.TrailRules;
  if (!R || !Array.isArray(R.pregens)) return;

  const PARTY_KEY = 'oregon-trail-gm-dashboard-v1';
  const WAGON_KEY = 'oregon-trail-gm-wagon-v1';
  const NOTES_KEY = 'oregon-trail-gm-playtest-v1';
  const UI_KEY = 'oregon-trail-gm-ui-v1';
  const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const ACT_TITLES = [
    'Act I of 4 · Arrival at the River',
    'Act II of 4 · The Crossing Vote',
    'Act III of 4 · Mid-River Action (Everyone Rolls!)',
    'Act IV of 4 · Far-Bank Campfire'
  ];
  const PLAIN_SKILLS = {
    Guide: 'Specialty (+2): Spotting trails, weather & campsites · Good (+1): Footing, Stamina',
    Doctor: 'Specialty (+2): Medicine, diagnosis & reading · Good (+1): Spotting symptoms, Stamina',
    Hunter: 'Specialty (+2): Shooting, stealth & steady hands · Good (+1): Lifting/hauling, Stamina',
    Teamster: 'Specialty (+2): Hauling, oxen & wagon repair · Good (+1): Driving/ropes, Stamina',
    Steward: 'Specialty (+2): Talking, trading & keeping peace · Good (+1): Noticing needs, Stamina'
  };

  const mod = score => Math.floor((score - 10) / 2);
  const fmtMod = n => (n >= 0 ? `+${n}` : `${n}`);
  const $ = id => document.getElementById(id);
  const clone = obj => JSON.parse(JSON.stringify(obj));

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function defaultParty() {
    return R.pregens.map((p, index) => {
      const maxHp = 8 + mod(p.scores.CON);
      return {
        index,
        name: p.name,
        role: p.role,
        background: p.background,
        scores: Object.assign({}, p.scores),
        maxHp,
        hp: maxHp,
        wound: 'Healthy',
        exhaustion: 0,
        crisisUsed: false,
        passedCheck: false,
        personal: Object.assign({}, p.personal)
      };
    });
  }

  function defaultWagon() {
    return {
      date: '1848-06-02',
      dayNum: 1,
      marker: 340,
      food: 140,
      money: 25,
      parts: 2,
      medicine: 4,
      morale: 6,
      wagonHp: 22
    };
  }

  function defaultNotes() {
    return {
      entries: [],
      fields: { crossing: '', unclear: '', summary: '' }
    };
  }

  function loadJSON(key, fallbackFn) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallbackFn();
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallbackFn();
    } catch {
      return fallbackFn();
    }
  }

  let party = loadJSON(PARTY_KEY, defaultParty);
  if (!Array.isArray(party) || party.length !== R.pregens.length) party = defaultParty();
  let wagon = Object.assign(defaultWagon(), loadJSON(WAGON_KEY, defaultWagon));
  let pt = Object.assign(defaultNotes(), loadJSON(NOTES_KEY, defaultNotes));
  pt.fields = Object.assign(defaultNotes().fields, pt.fields || {});
  if (!Array.isArray(pt.entries)) pt.entries = [];

  let ui = Object.assign({ act: 0, comfort: true, help: true, target: 10 }, loadJSON(UI_KEY, () => ({ act: 0, comfort: true, help: true, target: 10 })));
  const undoStack = [];

  function pushUndo(label) {
    undoStack.push({ label, party: clone(party), wagon: clone(wagon) });
    if (undoStack.length > 12) undoStack.shift();
    updateUndoBtn();
  }

  function updateUndoBtn() {
    const btn = $('gm-undo');
    if (!btn) return;
    btn.disabled = undoStack.length === 0;
    btn.textContent = undoStack.length ? `↶ Undo: ${undoStack[undoStack.length - 1].label}` : '↶ Undo';
  }

  function saveAll() {
    try {
      localStorage.setItem(PARTY_KEY, JSON.stringify(party));
      localStorage.setItem(WAGON_KEY, JSON.stringify(wagon));
      localStorage.setItem(NOTES_KEY, JSON.stringify(pt));
      localStorage.setItem(UI_KEY, JSON.stringify(ui));
    } catch {
      /* Ignore storage quota errors */
    }
    updateUndoBtn();
  }

  function nextDate(iso) {
    const d = new Date(`${iso}T12:00:00Z`);
    if (!Number.isFinite(d.getTime())) return iso;
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  function fmtDate(iso) {
    const d = new Date(`${iso}T12:00:00Z`);
    if (!Number.isFinite(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  function announceAction(msg) {
    const banner = $('gm-action-banner');
    if (!banner) return;
    banner.hidden = false;
    banner.textContent = msg;
  }

  function addLogEntry(text, auto = false) {
    const clean = String(text || '').trim();
    if (!clean) return;
    const clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    pt.entries.unshift({
      time: clock,
      gameDate: `${fmtDate(wagon.date)} (mi ${wagon.marker})`,
      text: clean,
      auto
    });
    saveAll();
    renderPlaytest();
  }

  function renderActAndComfort() {
    document.body.classList.toggle('gm-comfort-mode', !!ui.comfort);
    document.body.classList.toggle('gm-help-off', ui.help === false);
    const helpBtn = $('gm-help-toggle');
    if (helpBtn) {
      helpBtn.setAttribute('aria-pressed', ui.help === false ? 'false' : 'true');
      helpBtn.textContent = ui.help === false ? '💡 Help: OFF' : '💡 Help: ON';
    }
    const comfortBtn = $('gm-comfort-toggle');
    if (comfortBtn) {
      comfortBtn.setAttribute('aria-pressed', ui.comfort ? 'true' : 'false');
      comfortBtn.textContent = ui.comfort ? 'A+ Large Text: ON' : 'A+ Large Text: OFF';
    }

    const actIdx = Math.max(0, Math.min(3, Number(ui.act) || 0));
    const title = $('gm-act-title');
    if (title) title.textContent = ACT_TITLES[actIdx];

    for (const tab of document.querySelectorAll('.gm-act-tab')) {
      const isCurrent = Number(tab.dataset.act) === actIdx;
      tab.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      tab.classList.toggle('active-act', isCurrent);
    }
    for (const stage of document.querySelectorAll('.gm-act-stage')) {
      stage.hidden = Number(stage.dataset.stage) !== actIdx;
    }
    $('gm-act-prev').disabled = actIdx === 0;
    $('gm-act-next').disabled = actIdx === 3;
  }

  function renderWagon() {
    const daysLeft = (wagon.food / 5).toFixed(1).replace(/\.0$/, '');
    $('gm-plain-summary').textContent =
      `Day ${wagon.dayNum} (${fmtDate(wagon.date)}) · Mile ${wagon.marker} · ` +
      `Tell the table: “We have ${daysLeft} days of food (${wagon.food} lbs), $${wagon.money} cash, ${wagon.parts} spare parts, and Morale is ${wagon.morale}/10.”`;

    const sticky = $('gm-sticky-status');
    if (sticky) {
      sticky.textContent = `${fmtDate(wagon.date)} · ${daysLeft}d food (${wagon.food} lbs) · $${wagon.money} · ${wagon.parts} parts · ${wagon.medicine} med · Morale ${wagon.morale}/10`;
    }

    const grid = $('gm-supply-grid');
    grid.replaceChildren();

    const controls = [
      { key: 'food', label: `Food lbs (${daysLeft}d)`, step: 2.5, min: 0, max: 800 },
      { key: 'money', label: 'Cash ($)', step: 1, min: 0, max: 10000 },
      { key: 'parts', label: 'Spare parts', step: 1, min: 0, max: 5 },
      { key: 'medicine', label: 'Medicine', step: 1, min: 0, max: 10 },
      { key: 'morale', label: 'Morale (/10)', step: 1, min: 0, max: 10 }
    ];

    for (const c of controls) {
      const box = el('div', 'gm-supply-cell');
      box.append(el('span', 'gm-mini-label', c.label));
      const row = el('div', 'gm-mini-stepper');
      const minus = el('button', 'secondary', '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', `Decrease ${c.label}`);
      minus.addEventListener('click', () => {
        pushUndo(`${c.label} −${c.step}`);
        wagon[c.key] = Math.max(c.min, Number((wagon[c.key] - c.step).toFixed(1)));
        saveAll(); renderWagon();
      });
      const val = el('strong', '', c.key === 'money' ? `$${wagon[c.key]}` : `${wagon[c.key]}`);
      const plus = el('button', 'secondary', '+');
      plus.type = 'button';
      plus.setAttribute('aria-label', `Increase ${c.label}`);
      plus.addEventListener('click', () => {
        pushUndo(`${c.label} +${c.step}`);
        wagon[c.key] = Math.min(c.max, Number((wagon[c.key] + c.step).toFixed(1)));
        saveAll(); renderWagon();
      });
      row.append(minus, val, plus);
      box.append(row);
      grid.append(box);
    }
  }

  function advanceDay(kind) {
    pushUndo(`Advance day (${kind})`);
    if (kind === 'rest') {
      wagon.food = Math.max(0, wagon.food - 2.5);
      for (const t of party) {
        t.exhaustion = Math.max(0, t.exhaustion - 1);
        t.hp = Math.min(t.maxHp, t.hp + 3);
      }
      wagon.date = nextDate(wagon.date);
      wagon.dayNum += 1;
      announceAction(`Rest Day complete → −2.5 lbs food, all travelers healed +3 HP and −1 Exhaustion.`);
      addLogEntry(`Rest Day (−2.5 lbs food, party healed).`, true);
    } else if (kind === 'cross') {
      wagon.food = Math.max(0, wagon.food - 5);
      wagon.marker = Math.min(2000, wagon.marker + 18);
      wagon.date = nextDate(wagon.date);
      wagon.dayNum += 1;
      announceAction(`Traveled +18 miles to Mile ${wagon.marker} (−5 lbs food).`);
      addLogEntry(`Traveled +18 miles to Mile ${wagon.marker} (−5 lbs food).`, true);
    }
    saveAll();
    render();
  }

  function applyOffer(offer) {
    pushUndo(`Crossing choice`);
    ui.target = offer === 'ford' ? 12 : 10;
    if (offer === 'ferry-clara') {
      wagon.money = Math.max(0, wagon.money - 8);
      wagon.food = Math.max(0, wagon.food - 7.5);
      wagon.marker = 358;
      wagon.date = '1848-06-04';
      wagon.dayNum = 3;
      ui.act = 2;
      pt.fields.crossing = 'Ferry w/ Clara Fair Bargain ($8 + 7.5 lbs food)';
      addLogEntry('Voted for 1A: Ferry w/ Clara’s $8 bargain.', true);
    } else if (offer === 'ferry-full') {
      wagon.money = Math.max(0, wagon.money - 10);
      wagon.food = Math.max(0, wagon.food - 7.5);
      wagon.marker = 358;
      wagon.date = '1848-06-04';
      wagon.dayNum = 3;
      ui.act = 2;
      pt.fields.crossing = 'Ferry full price ($10 + 7.5 lbs food)';
      addLogEntry('Voted for 1B: Ferry at $10.', true);
    } else if (offer === 'ramp') {
      wagon.food = Math.max(0, wagon.food - 12);
      wagon.marker = 358;
      wagon.date = '1848-06-05';
      wagon.dayNum = 4;
      ui.act = 2;
      pt.fields.crossing = 'Worked ramp 2 days ($0 + 12 lbs food, Mercy free)';
      addLogEntry('Voted for 2: Ramp labor 2 days ($0 + 12 lbs food).', true);
    } else if (offer === 'ford') {
      wagon.food = Math.max(0, wagon.food - 5);
      ui.act = 2;
      pt.fields.crossing = 'Risked Upper Ford Today ($0 + 5 lbs food)';
      addLogEntry('Voted for 3: Risk Upper Ford Today (5 lbs food).', true);
    } else if (offer === 'rope') {
      wagon.parts = Math.max(0, wagon.parts - 1);
      wagon.food = Math.max(0, wagon.food - 10);
      wagon.marker = 358;
      wagon.date = '1848-06-04';
      wagon.dayNum = 3;
      ui.act = 2;
      pt.fields.crossing = 'Rope Line Ford (1 part + 10 lbs food)';
      addLogEntry('Voted for 4: Rope Line Ford (1 part + 10 lbs food).', true);
    }
    saveAll();
    render();
  }

  function renderRoster() {
    const container = $('gm-roster');
    container.replaceChildren();

    for (const t of party) {
      const roleInfo = R.roles[t.role] || {};
      const card = el('article', 'gm-card');

      const head = el('div', 'gm-card-head');
      const titleWrap = el('div');
      titleWrap.append(
        el('p', 'eyebrow', `${t.role} · ${t.background}`),
        el('h3', '', t.name)
      );
      head.append(titleWrap);
      card.append(head);

      // Plain-English skill line
      card.append(el('p', 'gm-plain-skill', PLAIN_SKILLS[t.role] || ''));

      // Simple HP & Tiredness (Exhaustion) steppers
      const stats = el('div', 'gm-stat-row');

      const hpBox = el('div', 'gm-mini-stepper');
      hpBox.append(el('span', 'gm-mini-label', 'HP'));
      const hpMinus = el('button', 'secondary', '−');
      hpMinus.type = 'button';
      hpMinus.setAttribute('aria-label', `Decrease ${t.name} HP`);
      hpMinus.addEventListener('click', () => {
        pushUndo(`${t.name.split(' ')[0]} HP −1`);
        t.hp = Math.max(0, t.hp - 1);
        saveAll(); render();
      });
      const hpVal = el('strong', '', `${t.hp}/${t.maxHp}`);
      const hpPlus = el('button', 'secondary', '+');
      hpPlus.type = 'button';
      hpPlus.setAttribute('aria-label', `Increase ${t.name} HP`);
      hpPlus.addEventListener('click', () => {
        pushUndo(`${t.name.split(' ')[0]} HP +1`);
        t.hp = Math.min(t.maxHp, t.hp + 1);
        saveAll(); render();
      });
      hpBox.append(hpMinus, hpVal, hpPlus);

      const exBox = el('div', 'gm-mini-stepper');
      exBox.append(el('span', 'gm-mini-label', 'Tired'));
      const exMinus = el('button', 'secondary', '−');
      exMinus.type = 'button';
      exMinus.setAttribute('aria-label', `Decrease ${t.name} Tiredness`);
      exMinus.addEventListener('click', () => {
        pushUndo(`${t.name.split(' ')[0]} Tired −1`);
        t.exhaustion = Math.max(0, t.exhaustion - 1);
        saveAll(); render();
      });
      const exVal = el('strong', '', `${t.exhaustion}`);
      const exPlus = el('button', 'secondary', '+');
      exPlus.type = 'button';
      exPlus.setAttribute('aria-label', `Increase ${t.name} Tiredness`);
      exPlus.addEventListener('click', () => {
        pushUndo(`${t.name.split(' ')[0]} Tired +1`);
        t.exhaustion = Math.min(6, t.exhaustion + 1);
        saveAll(); render();
      });
      exBox.append(exMinus, exVal, exPlus);

      stats.append(hpBox, exBox);
      card.append(stats);

      const crisisLabel = el('label', 'check');
      const crisisBox = document.createElement('input');
      crisisBox.type = 'checkbox';
      crisisBox.checked = !!t.crisisUsed;
      crisisBox.addEventListener('change', () => {
        pushUndo(`${t.name.split(' ')[0]} power used`);
        t.crisisUsed = crisisBox.checked;
        saveAll();
      });
      crisisLabel.append(crisisBox, document.createTextNode('Chapter power used'));
      card.append(crisisLabel);

      // Optional collapsible details
      const details = document.createElement('details');
      const summary = el('summary', '', 'Story & powers');
      const body = el('div', 'gm-stakes');
      const p = t.personal || {};
      const lines = [
        ['Always works', roleInfo.service],
        ['Chapter power', roleInfo.intervention],
        ['Dream', p.dream],
        ['Promise', p.promise],
        ['Bond', p.bond],
        ['Opening Q', p['opening question']]
      ];
      for (const [k, v] of lines) {
        if (!v) continue;
        const row = el('p', 'small');
        row.append(el('strong', '', `${k}: `), document.createTextNode(v));
        body.append(row);
      }
      details.append(summary, body);
      card.append(details);

      container.append(card);
    }
  }

  function renderGroupCheck() {
    const wrap = $('gm-check-toggles');
    if (!wrap) return;
    wrap.replaceChildren();
    const target = Number(ui.target) === 12 ? 12 : 10;
    for (const t of party) {
      const btn = el('button', `gm-check-btn${t.passedCheck ? ' passed' : ''}`, `${t.name.split(' ')[0]} ${t.passedCheck ? '✓ Succeeded' : `(Tap if ${target}+)`}`);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', t.passedCheck ? 'true' : 'false');
      btn.addEventListener('click', () => {
        t.passedCheck = !t.passedCheck;
        saveAll();
        renderGroupCheck();
      });
      wrap.append(btn);
    }
    const passed = party.filter(t => t.passedCheck).length;
    const out = $('gm-check-result');
    if (!out) return;
    if (passed >= 3) out.textContent = `${passed}/5 succeeded — Full Success! Everyone crosses safely to cheers from the bank (+1 Morale). 💡 Press + on Morale, then Next ▶.`;
    else if (passed >= 1) out.textContent = `${passed}/5 succeeded — Partial Success! You make it across, but lose 1 cargo bundle or take a minor scrape (1–2 HP). 💡 Let the players choose which, then press − on that number.`;
    else out.textContent = `Tap each player who rolled ${target}+ (need 3 of 5 for Full Success). 💡 If nobody succeeds, the wagon stays on this bank. Offer the ferry or the ramp work instead.`;
  }

  function renderPlaytest() {
    for (const input of document.querySelectorAll('[data-pt]')) {
      const key = input.dataset.pt;
      if (document.activeElement !== input) {
        input.value = pt.fields[key] || '';
      }
    }

    const stream = $('gm-notes-stream');
    stream.replaceChildren();
    if (!pt.entries.length) {
      stream.append(el('p', 'small', 'No notes yet.'));
      return;
    }
    for (let i = 0; i < pt.entries.length; i++) {
      const item = pt.entries[i];
      const row = el('div', `gm-note-row${item.auto ? ' is-auto' : ''}`);
      const meta = el('span', 'gm-note-meta', `${item.time}`);
      const txt = el('span', 'gm-note-text', item.text);
      const del = el('button', 'secondary gm-note-del', 'Delete');
      del.type = 'button';
      del.setAttribute('aria-label', `Delete note from ${item.time}`);
      del.addEventListener('click', () => {
        pt.entries.splice(i, 1);
        saveAll();
        renderPlaytest();
      });
      row.append(meta, txt, del);
      stream.append(row);
    }
  }

  function buildMarkdownReport() {
    const today = new Date().toISOString().slice(0, 10);
    const f = pt.fields;
    const lines = [
      `# Oregon Trail RPG — Playtest Notes (${today})`,
      '',
      `- **Ending State:** ${wagon.date}, Mile ${wagon.marker}, Food ${wagon.food} lbs, Cash $${wagon.money}, Parts ${wagon.parts}, Morale ${wagon.morale}/10`,
      `- **Crossing Chosen:** ${f.crossing || '—'}`,
      `- **Anything confusing / to change:** ${f.unclear || '—'}`,
      `- **Favorite moments:** ${f.summary || '—'}`,
      '',
      '## Travelers',
      ...party.map(t => `- **${t.name} (${t.role}):** HP ${t.hp}/${t.maxHp}, Tiredness ${t.exhaustion}`),
      '',
      '## Session Log',
      ...(pt.entries.length ? pt.entries.slice().reverse().map(e => `- **${e.time}** ${e.text}`) : ['- *(No entries)*'])
    ];
    return lines.join('\n') + '\n';
  }

  function showPtStatus(msg) {
    const box = $('gm-pt-status');
    box.hidden = false;
    box.textContent = msg;
  }

  function renderPrintCards() {
    const sheet = $('gm-print-sheet');
    if (!sheet) return;
    sheet.replaceChildren();
    for (const t of party) {
      const roleInfo = R.roles[t.role] || {};
      const p = t.personal || {};
      const card = el('article', 'gm-print-card');
      card.append(
        el('p', 'eyebrow', `OREGON TRAIL · ${t.role.toUpperCase()} · ${t.background.toUpperCase()}`),
        el('h2', '', t.name),
        el('p', 'gm-print-how', 'How to play: Just say what your character wants to do. When there is a risk, roll the 20-sided die and add your skill number below (10+ usually succeeds).'),
        el('p', 'gm-print-skill', PLAIN_SKILLS[t.role] || '')
      );
      const abLine = ABILITIES.map(ab => `${ab} ${fmtMod(mod(t.scores[ab]))}`).join('   ·   ');
      card.append(el('p', 'gm-print-abs', `Numbers:  ${abLine}   ·   Health (HP): ${t.maxHp}/${t.maxHp}`));

      const block = el('div', 'gm-print-stakes');
      const items = [
        ['Why I am going (Dream)', p.dream],
        ['My Promise', p.promise],
        ['My Boundary', p.boundary],
        ['My Bond at the table', p.bond],
        ['Keepsake & Voice', `${p.keepsake || ''}${p.voice ? ' — ' + p.voice : ''}`],
        ['Always works', roleInfo.service],
        ['Once-per-chapter power', roleInfo.intervention],
        ['Opening question', p['opening question']]
      ];
      for (const [k, v] of items) {
        if (!v) continue;
        const row = el('p', '');
        row.append(el('strong', '', `${k}: `), document.createTextNode(v));
        block.append(row);
      }
      card.append(block);
      sheet.append(card);
    }

    const menu = el('article', 'gm-print-card');
    menu.append(
      el('p', 'eyebrow', 'CENTER OF THE TABLE · PLATTE RIVER CROSSING MENU'),
      el('h2', '', 'How Do We Cross the River?'),
      el('p', 'gm-print-how', 'We have 28 days of food (140 lbs), $25 Cash, and 2 Spare Wagon Parts. Across the river, Mae’s friend Mara leaves with the freight train at dawn on Day 3.')
    );
    const offers = el('div', 'gm-print-stakes');
    const offerRows = [
      ['Option 1 · Pay for the Ferry (Cross Tomorrow, Day 2)', '$10 cash — or $8 if Clara uses Fair Bargain! — plus 7.5 lbs food. Safe crossing. Arrives in time to meet Mara.'],
      ['Option 2 · Work on the Ferry Ramp for 2 Days (Cross Day 3)', '$0 cash and 12 lbs food. Earns safe ferry passage for both our wagon AND schoolteacher Mercy’s wagon for free!'],
      ['Option 3 · Risk the Upper Ford Today (Cross Day 1)', '$0 cash and 5 lbs food. Everyone rolls the 20-sided die (need 12+).'],
      ['Option 4 · Rig a Heavy Rope Line at the Ford (Cross Tomorrow, Day 2)', 'Spend 1 Spare Wagon Part and 10 lbs food. Cross safely tomorrow with no dice roll needed.']
    ];
    for (const [k, v] of offerRows) {
      const r = el('p', '');
      r.append(el('strong', '', `${k}: `), document.createTextNode(v));
      offers.append(r);
    }
    menu.append(offers);
    sheet.append(menu);
  }

  function bindEvents() {
    $('gm-quick-d20').addEventListener('click', () => {
      const r = Math.floor(Math.random() * 20) + 1;
      $('gm-quick-d20').textContent = `🎲 Rolled d20: ${r}`;
    });

    $('gm-undo').addEventListener('click', () => {
      const prev = undoStack.pop();
      if (!prev) return;
      party = prev.party;
      wagon = prev.wagon;
      saveAll();
      announceAction(`Undid: ${prev.label}.`);
      render();
    });

    $('gm-comfort-toggle').addEventListener('click', () => {
      ui.comfort = !ui.comfort;
      saveAll();
      renderActAndComfort();
    });

    $('gm-help-toggle').addEventListener('click', () => {
      ui.help = ui.help === false;
      saveAll();
      renderActAndComfort();
    });

    $('gm-act-prev').addEventListener('click', () => {
      ui.act = Math.max(0, (Number(ui.act) || 0) - 1);
      saveAll();
      renderActAndComfort();
    });

    $('gm-act-next').addEventListener('click', () => {
      ui.act = Math.min(3, (Number(ui.act) || 0) + 1);
      saveAll();
      renderActAndComfort();
    });

    for (const tab of document.querySelectorAll('.gm-act-tab')) {
      tab.addEventListener('click', () => {
        ui.act = Number(tab.dataset.act) || 0;
        saveAll();
        renderActAndComfort();
      });
    }

    $('gm-print-cards').addEventListener('click', () => {
      renderPrintCards();
      window.print();
    });

    $('gm-load-river').addEventListener('click', () => {
      pushUndo('Reset River');
      wagon = defaultWagon();
      ui.act = 0;
      ui.target = 10;
      saveAll();
      announceAction('Reset to June 2 at the river (28 days food, $25, 2 parts).');
      render();
    });

    for (const btn of document.querySelectorAll('[data-advance]')) {
      btn.addEventListener('click', () => advanceDay(btn.dataset.advance));
    }
    for (const btn of document.querySelectorAll('[data-offer]')) {
      btn.addEventListener('click', () => applyOffer(btn.dataset.offer));
    }

    $('gm-proper-meal').addEventListener('click', () => {
      pushUndo('Proper Meal');
      wagon.food = Math.max(0, wagon.food - 2.5);
      wagon.morale = Math.min(10, wagon.morale + 2);
      saveAll();
      announceAction('Served Clara’s Proper Meal: −2.5 lbs food, +2 Morale!');
      addLogEntry('Served Proper Meal (−2.5 lbs food, +2 Morale).', true);
      render();
    });

    $('gm-reset').addEventListener('click', () => {
      pushUndo('Reset travelers');
      party = defaultParty();
      saveAll();
      render();
    });

    const submitNote = () => {
      const input = $('gm-note-input');
      if (!input.value.trim()) return;
      addLogEntry(input.value, false);
      input.value = '';
    };
    $('gm-note-add').addEventListener('click', submitNote);
    $('gm-note-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submitNote(); }
    });

    for (const input of document.querySelectorAll('[data-pt]')) {
      input.addEventListener('input', () => {
        pt.fields[input.dataset.pt] = input.value;
        saveAll();
      });
    }

    $('gm-copy-md').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(buildMarkdownReport());
        showPtStatus('Copied notes to clipboard!');
      } catch {
        showPtStatus('Use Download Notes (.md).');
      }
    });

    $('gm-export-md').addEventListener('click', () => {
      const blob = new Blob([buildMarkdownReport()], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oregon-trail-playtest-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showPtStatus('Downloaded notes.');
    });

    $('gm-clear-notes').addEventListener('click', () => {
      pt = defaultNotes();
      saveAll();
      renderPlaytest();
    });
  }

  function render() {
    renderActAndComfort();
    renderWagon();
    renderRoster();
    renderGroupCheck();
    renderPlaytest();
    renderPrintCards();
    updateUndoBtn();
  }

  bindEvents();
  render();
})();
