# UPDATE IDEAS — Roadmap to a Professional-Grade TTRPG Product

A full-project review of the Oregon Trail RPG (core rules, all 7 modules, quickstart, glossary, sample day, and sheets), with proposals for turning it from a very solid rules document into a tool that working GMs, designers, and publishers would consider exceptional.

**Current state, honestly assessed:** The rules core is unusually complete for a project this size. The trail-day loop is tight, the math has clearly been balanced in passes (rounding rules, stacking order, exhaustion caps), and the writing voice is strong. The Native Encounters module handles a hard topic with real care. The biggest gaps are not in the rules — they are in *tooling*: there is no map, no pre-generated characters, no GM-facing generators, no data layer, and no print/VTT pipeline. That's what separates "great rules doc" from "professional tool."

---

## How this document is organized

| Tier | Theme | Summary |
| :-: | :-- | :-- |
| **P1** | Rules completeness & consistency | Contradictions and undefined mechanics found in review — fix before anything else |
| **P2** | Table-readiness | Pregens, trail map, generators, missing subsystems — biggest play-experience wins |
| **P3** | Data layer & digital tooling | Single-source data, campaign tracker, VTT exports |
| **P4** | Print & publishing | PDF pipeline, layout, licensing, art direction |
| **P5** | Professional polish & community | Playtest program, versioning, sensitivity review, accessibility |

Each item: **Problem → Proposal → Effort** (S = under an hour, M = a session, L = multi-day).

---

## P1 — Rules Completeness & Consistency (fix first)

These are concrete defects found during review. They are cheap to fix and they are exactly what a professional reviewer or experienced GM will trip over first.

### 1.1 Cautious stance contradiction (glossary vs. everything else)
- **Problem:** `docs/glossary.md` ("Travel Stance") says Cautious grants the double-event-roll benefit *only on the first travel day of the current 3-day weather span*. `seed.md`, `QUICKSTART.md`, `gm_reference.md`, and `SAMPLE_DAY.md` all say it applies on *any* Cautious day. One of these is stale.
- **Proposal:** Decide which is canon (the every-day version is what the sample day demonstrates) and align the glossary. If the once-per-span limit was a deliberate balance nerf, it needs to live in `seed.md`, not hide in the glossary.
- **Effort:** S

### 1.2 River crossing DCs "vary by segment" — but no table exists
- **Problem:** Universal Event 5 says "Group check (CON/STR DC varies by segment)" and never says what the DCs are. This is a mandatory event that fires ~5% of all days and the GM has to invent the number.
- **Proposal:** Add a one-line table to `seed.md` (and gm_reference): e.g. Segments 1/3/4/7 = DC 10, Segment 2 = DC 12, Segment 5 = n/a (reroll), Segment 6 = DC 13. Tune to taste; the point is the number must exist.
- **Effort:** S

### 1.3 Desertion is threatened but never defined
- **Problem:** Morale 1–2 says "risk of desertion." No rule anywhere says what desertion is, who deserts, or how it resolves. This is a named mechanic with no mechanics.
- **Proposal:** Add a Desertion rule to the Morale section: e.g. *each morning at Morale 1–2, roll 1d6; on a 1, one random character (or named NPC/livestock) attempts to leave — resolve with a CHA check (DC 12) to talk them down; failure means they depart with 1 day's rations, or (for the softer table) suffer −2 on all checks until Morale reaches 3+.* Any version works; pick one and write it.
- **Effort:** S

### 1.4 Epilogues are promised but don't exist
- **Problem:** `seed.md` Winning & Losing says "the GM reads a brief epilogue… adapted from the original game's tradition" — there is no epilogue content anywhere in the repo.
- **Proposal:** Add an Epilogue module (could live in `07_route_variants.md` or a new `08_arrival_and_epilogues.md`): a d10 epilogue table per role, modified by arrival date (before/after October), final Morale, and whether the character's bonds/Inherited Burden were fulfilled. This is the emotional payoff of the whole campaign — it deserves real material. See also P2.5 (Arrival module).
- **Effort:** M

### 1.5 Vestigial contested-check examples
- **Problem:** `seed.md` says trading is a Contested Check ("INT vs. INT") — but module 03 resolves all trading with the DC-based negotiation system. "Perception vs. Stealth" is also cited, though no event actually uses a contested ambush roll (Stolen Stock is WIS DC 13).
- **Proposal:** Either cut Contested Checks entirely (nothing uses them — the lazy fix) or repoint the examples at something real (e.g., the thief event as WIS vs. a flat GM roll).
- **Effort:** S

### 1.6 "Repairing a broken wagon wheel (DC 12, extended)" contradicts Field Repair
- **Problem:** The Key Skill Uses list in `seed.md` describes wagon-wheel repair as a DC 12 *extended* check. The actual Field Repair rule is a single check (DC 11 without parts / DC 12 with parts). Two repair procedures for the same fiction.
- **Proposal:** Update the Key Skill Uses example to match Field Repair, or reword it as "Extended repairs after catastrophic damage (GM option)."
- **Effort:** S

### 1.7 Undefined check tags and vague event mechanics
- **Problem:** Small dangling threads: Universal 16 calls for "Investigation DC 10" (no stat given — INT presumably); Universal 13 "Travelers met" has zero mechanics; Segment 7's "The Axle Snaps" says "repair it (needs parts/str)" with no DC or procedure; Segment 6's "Ford Operator" $10 doesn't say whether fort multipliers apply (the ferry events do specify).
- **Proposal:** One editing pass over all event tables with a checklist: *every event names its stat, its DC, and its currency valuation.* Fix the four above in the same pass.
- **Effort:** S–M

### 1.8 Injury rules referenced but absent
- **Problem:** The Battle Surgeon hook grants Advantage treating "broken bones, gunshot wounds, animal attacks" — no rules exist for traumatic injuries as distinct from disease. The Wolf Pack event threatens an ox but there is no rule for predators attacking people.
- **Proposal:** Add a short **Injuries** block to the Disease section: injuries are HP damage plus (on serious hits) a lingering condition using the existing disease chassis (duration + daily effect + CON recovery), e.g. *Broken Bone: 14 days, Disadvantage on STR/DEX, halved by a successful Doctor's splint (INT DC 11, no medicine cost)*. Reuses machinery that already exists — no new subsystem.
- **Effort:** M

### 1.9 DC ladder oddity
- **Problem:** The DC table steps 6 / 9 / 10 / 12 / 15 / 18 / 23. The 9-vs-10 distinction ("Moderate" vs "Challenging") is a 5% difference with two labels, and 23 is nearly unreachable on 3d6-in-order stats (max realistic mod ~+3 ⇒ needs a natural 20).
- **Proposal:** Either collapse to a clean ladder (6/9/12/15/18/21) with a migration note, or keep as-is but add a designer sidebar explaining that DC 23 is deliberately "only with Advantage + Inspiration + a miracle." Cheap fix, big credibility gain with design-literate readers.
- **Effort:** S

### 1.10 Inspiration is a dead-end economy
- **Problem:** Inspiration has exactly one source (Diaries evening activity) and one sink. It reads like an imported 5e organ that never grew into the body.
- **Proposal:** Either cut it, or make it the *roleplay reward loop* the game is missing: GM awards Inspiration when a player leans into a bond, fear, or Inherited Burden from their character sheet (those fields already exist on the sheet — nothing mechanical references them!). This single change connects the roleplay layer to the survival layer.
- **Effort:** S

---

## P2 — Table-Readiness (highest play-experience ROI)

### 2.1 Pre-generated characters
- **Problem:** "10-Minute Setup" still requires rolling 24 stats and reading 16 background hooks. Professional convention/one-shot play needs zero-setup starts.
- **Proposal:** Add `docs/pregens/` with 4 ready-to-play characters (one per role) as filled character sheets — stats, hook, bonds, fears, a one-line voice note, and the starter loadout already purchased. Add a second "hard mode" set with rough stat arrays. This plus the existing teaching event sequence = a true 5-minute con start.
- **Effort:** M

### 2.2 Trail map
- **Problem:** A 2,000-mile journey game with no map. Mile markers, forts, cutoff junctions, and segment boundaries exist only as table rows.
- **Proposal:** A one-page printable trail strip-map: 7 segments as bands, forts and landmarks at their mile markers, cutoff junctions flagged (Sublette at ~790, The Dalles split), with a wagon token track (1 box = 25 miles, 80 boxes). Even an ASCII/SVG-in-markdown version transforms table play; a designed PDF version belongs in P4. This is the single most-requested artifact for any trail/journey game.
- **Effort:** M (markdown/SVG) → L (designed)

### 2.3 GM generators pack
- **Problem:** Several rules delegate invention to the GM mid-session: Sutler Demands ("GM determines what the Sutler wants"), Travelers Met, NPC names, grave markers passed on the trail.
- **Proposal:** New `08_gm_toolkit.md` with small d12/d20 tables: Sutler Demands (d12), Emigrant Parties Met (d12 — who they are, what they want, what they know, one lie), period-appropriate name lists (d20 × given/family), Graves & Debris flavor (d20), rumor table per segment (true/false ratio). Pure content, no new rules — this is what elevates a rulebook into a *GM tool*.
- **Effort:** M

### 2.4 Full worked examples for the two other subsystems
- **Problem:** `SAMPLE_DAY.md` is excellent — and it only covers the trail-day loop. The two most procedurally complex subsystems (fort negotiation, Native encounter extended checks) have no walkthrough.
- **Proposal:** Add `SAMPLE_FORT.md` (arrival → demand → negotiation → purchase math with multiplier and discount) and `SAMPLE_ENCOUNTER.md` (a Toll Takers encounter through the 3-before-2 extension, including one failure and the Cultural Broker save). Same annotated format as the sample day.
- **Effort:** M

### 2.5 Arrival & aftermath module
- **Problem:** The game ends abruptly at the Willamette Valley. Victory conditions exist; the *arrival* doesn't.
- **Proposal:** `08_arrival_and_epilogues.md`: land claim procedure (a final resource audit turned into a scene), arrival-date consequences (arrive after November 1 = a hard first winter epilogue modifier), the epilogue tables from P1.4, and a campaign scoring summary (miles/days, graves, morale, money) suitable for con play and replay comparison.
- **Effort:** M

### 2.6 Difficulty presets
- **Problem:** One difficulty knob exists as a two-line aside ("banker from Boston": +2 CON checks, +$200).
- **Proposal:** Formalize three named presets in `seed.md` — **Greenhorn** (current soft option + start Morale 8), **Emigrant** (as written), **1846** (start with $600, disease DCs +1, no Background Bump) — each a 3-line diff from the baseline. Presets are how professional GMs pitch a table.
- **Effort:** S

### 2.7 Party-size guidance beyond 4
- **Problem:** Everything assumes exactly 4 characters. Real tables show up with 2, 5, or 6 players. Group-check majorities, food math, and role coverage all silently assume 4.
- **Proposal:** A half-page "Scaling the Wagon" sidebar: 5–6 players = add extra Hunters/Teamsters (secondary role holders don't get the Competence Floor), 2–3 players = each runs one character plus shares a "wagon NPC"; food is already per-person so it self-scales; note how group-check majority works with even counts (ties = partial success).
- **Effort:** S

### 2.8 Solo mode: from guidelines to system
- **Problem:** Solo play gets one good paragraph. Solo TTRPG is now a major market segment, and this game's procedural core (event tables, weather, resource math) is *already* 90% of a solo engine.
- **Proposal:** `docs/SOLO.md`: a simple yes/no oracle (d6, weighted by Morale), guidance for self-adjudicating "GM chooses" moments (roll for it — e.g., random ox team takes strain), a journaling prompt structure tied to the trail log sheet, and the teaching event sequence recast as a solo tutorial. The trail log sheet already doubles as the journaling artifact.
- **Effort:** M

### 2.9 Session-zero page & safety consolidation
- **Problem:** Safety tools are (rightly) covered in module 04, but tone-setting, difficulty pitch, and content flags for the whole game (child death was a trail reality; disease; period racism) are scattered or implicit.
- **Proposal:** One `docs/SESSION_ZERO.md`: what this game is/isn't, the difficulty conversation ("characters will die" is already in Designer Notes — move it forward), content flags with default handling, safety tools reference, and the preset choice from 2.6. Professional GMs run session zeros; give them the handout.
- **Effort:** S

---

## P3 — Data Layer & Digital Tooling

### 3.1 Machine-readable data as the single source of truth
- **Problem:** Prices appear in 3 files, fort DCs in 2, disease stats in 3, event tables in 2 (seed + glossary summaries). The P1 contradictions happened *because* facts are duplicated by hand. Every future edit risks another drift.
- **Proposal:** Create `data/` with YAML files: `events.yaml` (universal + 7 segment tables), `diseases.yaml`, `prices.yaml`, `forts.yaml`, `weather.yaml`. Markdown remains the human-authored rules prose, but all *tables* are generated from data by a small script (`npm run build-tables` — a ~100-line Node script that rewrites fenced regions in the .md files). One fact, one place, every downstream artifact (docs, sheets, VTT exports, tracker app) derives from it.
- **Effort:** L — but it is the foundation for 3.2–3.4 and permanently kills the P1 class of bug.

### 3.2 Companion tracker (single-file web app)
- **Problem:** The bookkeeping load (food/water/ox HP/wagon HP/morale/exhaustion/disease timers/mile marker) is the #1 friction at a real table — the trail log sheet works but is heavy on the GM.
- **Proposal:** One static `tools/tracker.html` — no build step, no framework, localStorage persistence. Panels: party state, daily-loop stepper (weather → stance → event roll with the d20/d10 logic built in → consumption applied automatically), and an end-of-day audit line mirroring SAMPLE_DAY's table. Reads its tables from the `data/` layer (inlined at build time). Deliberately not a rules engine — it's a smart ledger with dice.
- **Effort:** L
- `ponytail:` single HTML file with localStorage; upgrade to a hosted PWA only if real users ask for cross-device sync.

### 3.3 VTT export pack
- **Problem:** A large share of TTRPG play is online. There is nothing importable.
- **Proposal:** Generate from `data/`: Foundry VTT rollable-table JSON (universal + segment events, weather, diseases, encounter tables), plus a plain-text/CSV bundle for Roll20 and Owlbear Rodeo users. The route map (2.2) exported as a scene image. Publish as a downloadable zip per release.
- **Effort:** M (once 3.1 exists)

### 3.4 Dice-math balance harness
- **Problem:** Balance claims (starter loadout survivability, hunting yields vs. consumption, desert crossing water math) are asserted, not verified. A professional design product shows its work.
- **Proposal:** A Monte Carlo simulator (`tools/sim/`, plain Node) that plays thousands of abstract runs: stance policy in, distribution of outcomes out (survival rate, death causes, arrival dates). Publish the headline numbers in Designer Notes ("Standard-stance parties with the safe loadout arrive alive ~X% of the time; the top killer is Y"). This is the kind of artifact that makes designers take a system seriously, and it will immediately reveal if any subsystem is mistuned.
- **Effort:** L

### 3.5 Repo hygiene
- **Problem:** `logs/` (agent run logs) and `.DS_Store` are committed; they're noise for anyone cloning the project. The numbered modules live at repo root while other docs live in `docs/`, splitting the content in two places.
- **Proposal:** gitignore + remove `.DS_Store` and `logs/`; consider moving modules into `docs/` (or everything into a `rules/` dir) with one canonical README as the entry point. Low urgency, do it alongside any restructure.
- **Effort:** S

---

## P4 — Print & Publishing

### 4.1 PDF build pipeline
- **Problem:** Markdown is a fine source format and a poor delivery format. Professionals expect a typeset PDF (screen + printer-friendly versions).
- **Proposal:** Pandoc (or Typst) pipeline: `make pdf` builds (a) a full rulebook PDF with TOC and internal links, (b) a quickstart booklet imposed for duplex printing, (c) the sheets as clean single pages. Keep styling in one template file. Automate via a GitHub Action that attaches PDFs to tagged releases.
- **Effort:** M–L

### 4.2 Form-fillable sheets
- **Problem:** The markdown sheets are print-and-scribble only; online tables can't use them.
- **Proposal:** Rebuild the five sheets as designed one-pagers in the PDF pipeline, then add fillable form fields (pdf-lib or LibreOffice). Character sheet, party/wagon sheet, and trail log are the priority three.
- **Effort:** M

### 4.3 Licensing correctness
- **Problem:** The README says "derived from the d20/5e SRD (OGL/CC)" — that's ambiguous and doesn't satisfy attribution. SRD 5.1 under CC-BY-4.0 requires a specific attribution statement; "OGL/CC" as a phrase conflates two very different licenses.
- **Proposal:** Add a `LICENSE.md` with: the CC BY-SA 4.0 grant for this work, the exact SRD 5.1 attribution paragraph ("This work includes material taken from the System Reference Document 5.1 ('SRD 5.1') by Wizards of the Coast LLC... licensed under CC-BY-4.0"), and a note on compatibility. Five minutes of work; mandatory before any distribution, and the first thing a publisher checks.
- **Effort:** S

### 4.4 Release packaging for itch.io / DriveThruRPG
- **Problem:** No distributable artifact exists — the audience is currently "people who browse a git repo."
- **Proposal:** A release checklist and zip layout: rulebook PDF, quickstart PDF, sheets pack, VTT pack, map, pregens, README-for-buyers. Version-stamped (see 5.2). itch.io first (zero gatekeeping, good for playtest feedback), DriveThruRPG once art/layout exists.
- **Effort:** M

### 4.5 Art & layout direction
- **Problem:** Zero visual identity. For a commercial-grade product this is eventually the largest cost item, so it needs a direction *decision* early even if execution comes late.
- **Proposal:** Document a direction that's achievable without commissioned art at first: period-authentic public-domain material (1840s–60s engravings, emigrant diary facsimiles, Library of Congress/NARA scans are PD), a restrained two-color print look (black + ochre), and typography with period flavor. A `docs/ART_DIRECTION.md` with sources and usage rules keeps every future asset coherent.
- **Effort:** S (direction doc) → L (execution)

---

## P5 — Professional Polish & Community

### 5.1 Structured playtest program
- **Problem:** Balance has been reasoned about (visibly, and well) but there's no evidence of external playtesting, and no way to collect it.
- **Proposal:** `docs/PLAYTEST.md`: a one-page feedback form (party composition, preset, deaths + causes, days elapsed, rules that confused the table, the moment the table talked about after), plus a public issue-template on the repo. Combine with the simulator (3.4): sim finds mathematical outliers, humans find *feel* problems.
- **Effort:** S

### 5.2 Versioning & errata discipline
- **Problem:** No version numbers, no changelog. The P1 glossary drift shows edits are already outrunning consistency. Errata handling is a hallmark of professional support.
- **Proposal:** Semantic-ish versioning (`v0.9`, `v1.0`...), a `CHANGELOG.md` (the git history is already well-written — distill it), a version stamp on the rulebook title page and every sheet, and a public errata section for post-release fixes.
- **Effort:** S

### 5.3 Indigenous sensitivity review for module 04
- **Problem:** Module 04 is thoughtfully framed — and it is still a settler-authored depiction of Pawnee, Lakota, Shoshone, and Cayuse peoples. Professional publishing standard (and the module's own stated values) call for a paid Indigenous consultant/sensitivity reader before wide release.
- **Proposal:** Budget a consultant review of module 04 and the historical notes; credit them; incorporate corrections. Also expand the historical-notes bibliography (primary sources consulted) — it strengthens both credibility and the GM's toolkit.
- **Effort:** M (mostly coordination) — **treat as a release gate for any commercial edition.**

### 5.4 Accessibility pass
- **Problem:** Heavy table-based layout, color-free but symbol-light; no guidance for players who can't roll physical dice or read small print tables.
- **Proposal:** Ensure all tables have header rows and no meaning carried by formatting alone (mostly true already); large-print sheet variants in the PDF pipeline; a note blessing digital rollers; screen-reader-checked HTML export of the rulebook (Pandoc gives this nearly free once 4.1 exists).
- **Effort:** S–M

### 5.5 "What this game is" positioning page
- **Problem:** The README describes contents, not identity. Professionals evaluating systems want the pitch: what it does that nothing else does.
- **Proposal:** Rewrite the README top with the positioning that's already implicit in Designer Notes: *a zero-prep, GM-light survival campaign where the antagonist is arithmetic; 5e-literate players onboard in 10 minutes; 5–7 sessions to a definitive ending.* Add a comparison line (vs. Death on the Reik-style journey play, vs. Forbidden Lands-style hex survival). One screen, no scrolling.
- **Effort:** S

---

## Suggested sequencing

1. **Now (one focused session):** All of P1 (each item is S–M), 4.3 licensing, 5.2 versioning, 3.5 hygiene. Result: internally consistent, legally clean `v0.9`.
2. **Next (the play-experience release):** 2.1 pregens, 2.2 map, 2.3 generators, 2.6 presets, 2.9 session zero, 5.5 positioning. Result: a genuinely exceptional *table tool* — this tier is where perceived quality jumps most.
3. **Then (the platform release):** 3.1 data layer → 3.3 VTT pack → 4.1 PDF pipeline → 4.2 sheets; 2.4/2.5/2.8 content modules in parallel. Result: distributable `v1.0` packages.
4. **Ongoing:** 3.2 tracker, 3.4 simulator, 5.1 playtests, 5.3 sensitivity review (gate for commercial release), 4.5 art.

The through-line: fix the facts (P1), then serve the GM (P2), then make one source of truth feed every format (P3/P4), then earn professional trust (P5).
