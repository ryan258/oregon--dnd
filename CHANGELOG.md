# Change record

## Five-traveler table and streamlined GM Dashboard — November 15, 2026

- Expanded the party from four to five travelers (1 GM and 1–5 players, 6 people at the full table). Added the fifth profession **Steward (CHA)** (`Fair Bargain` expertise, `Hold the Wagon Together` crisis intervention, four backgrounds, and four techniques) and fifth pregenerated traveler **Clara Vance** (with reserve **Martha Holt**).
- Updated five-traveler rations (`5 lbs` ordinary travel, `10 lbs` hard travel, `2.5 lbs` Rest Day), five-roller group checks (`3–5` full, `1–2` partial, `0` failure), river decision card food costs (`7.5 / 12 / 5 / 10` lbs), and worked examples across the manuscript, handbook, player companion (`player/`), and Trailmaster ledger (`website/`).
- Added a streamlined, accessible **GM Dashboard** (`/dashboard/`) in the local Hugo site for first-time GMs and 5 first-time players: 4-Act Story Teleprompter for *The River Between*, first-time GM setup checklist, quick FAQ, act-by-act coaching boxes, toggleable help mode (`💡 Help: ON/OFF`), one-tap river crossing actions with target-aware dice targets (`10+` standard, `12+` ford), 5-traveler cards with plain-English `+2` / `+1` skill badges, Large Text (`A+`) mode, one-click printable large-type handouts (5 character cards + 1 center-of-table River Crossing Menu), and auto-saving playtest notes with Markdown download/copy.

## Save recovery and first river packet — November 12, 2026

- Player recovery now distinguishes damaged storage from unavailable storage, preserves validated travelers when only Undo is damaged, and offers separate portable backups and raw recovery exports. An existing raw archive requires explicit removal before a different archive can replace it.
- Trailmaster keeps field drafts through delayed and conflicting saves, serializes Undo, and protects unfinished day entries and their route-marker defaults. Empty fresh-food slots clear their used expiry dates.
- The Play tonight packet now includes a river decision card with four crossings, optional scouting, the departure clock, and a Trailmaster reference. It includes a blank character sheet and keeps the print selection when an outside reference is open on screen. The starting supplies, crossing prices, and damage values follow v0.10.

## Local game website and Trailmaster ledger — October 3, 2026

Added a local Hugo site (`./trail`) and browser-saved Trailmaster ledger to support table play and shared party management alongside the single-player companion:

- Hugo site with zero external runtime dependencies, themes, web fonts, analytics, or CDNs, binding strictly to `127.0.0.1:1313`.
- Pages for game overview, rules and table contracts, traveler pregen showcase (extracted at build time from `docs/PREGENS.md`), handbook links, and printable cover.
- Two original illustrations: cover art and camp companion scene (`website/ARTWORK.md`).
- Browser-based Trailmaster wagon ledger (`website/static/js/trailmaster.js` and `website/static/js/trail-model.js`) featuring preset configurations (River and Full Campaign), real-time arithmetic estimates, day-close calculations (earliest-expiring fresh food first, cured food, mileage, and date advance), Web Locks write concurrency protection across tabs, 10-step bounded undo, and 2 MiB validated JSON backup export/import.
- Targeted tests covering data safety, storage failure injection, quota handling, Hugo static generation, mount integrity, and page reference verification (`website/tests/trail-ledger.test.cjs` and `website/tests/check_site.py`).

## Playtest readiness — September 26, 2026

Kept the v0.10 resource and danger baseline. Fixed the river advancement contradiction: first technique at Laramie, not the far-bank session ending. Added a travel checkpoint card, a short observation sheet, handbook subsection navigation, and a focused Play tonight reading/print selection generated from the same manuscript.

Player backups now share an 8 MiB UTF-8 limit across export and both import paths. Undo uses labeled, bounded history with grouped text edits and atomic state/history writes; legacy saves remain readable. Human table performance and physical-iPad acceptance remain pending. See the dated verification record for checks actually performed.

## Player companion 1 — September 25, 2026

Added a static single-page player app for the unchanged v0.10 game: generated pregens and role references, local character saves, custom/reserve sheets, health/wounds/Exhaustion/rest, condition and use reminders, story/journal, portable backup/import, previous-save undo, stale-window protection, and install-time offline caching. Includes bounded model/storage/offline tests, packaging, and iPad setup/recovery instructions. No accounts, cloud sync, shared-wagon automation, publication, or device installation. Actual verification is recorded separately.

## 0.10 — September 25, 2026 — choices and consequences

Implemented the accepted manuscript critique as a new playtest edition. No human session or score is claimed.

- River work now takes two labor days before crossing, with an announced carrier departure, personal workshop opportunity, letter alternative, role-specific choices, quoted route costs, and explicit recovery for incomplete work or unavailable workers.
- Campaign scenes now include a coordinated rescue, comparison of route reports, a negotiated shared work area, a provisioning opportunity, and a relationship reckoning before arrival. Prepared joy and quiet occupy existing evenings.
- Personal opportunities/conflicts are linked to later concrete changes through the existing ledger, with custom-character and replacement guidance; no new reward currency.
- Mercy, Tomas, and Nessa have differing ambitions and announced plans. Added Mara's optional connection and a fictional Hall stock keeper with regional source notes, autonomous household work, and later correspondence.
- One additional technique option per role enables a different plan; characters still choose only two techniques across the campaign.
- Wagon decision panel, checkpoint-based accounting, and compact trail log remove duplicate transcription while preserving daily costs, checks, and interruption.
- Kept starter resources, basic checks, and damage values as a baseline. Added exact river timing/food and weather-change examples, economy observations, and a desert stress snapshot.
- Updated the handbook, reading index, roadmap, and verification boundaries; removed unsupported “optimal” and internal-consistency claims from the roadmap.

**Migration:** adopt between sessions with the table's agreement. Keep actual supplies, conditions, role abilities, and earned techniques. Existing characters may exchange one learned technique for a new option if the table wants; do not award extra technique slots. Keep already completed crossings and negotiated prices as played. Apply new river timing only to an unstarted scene. Adopt NPC plans prospectively after announcing them; never turn an earlier refusal into a newly invented broken promise. An already established NPC identity or goal takes precedence over revised defaults. Preserve earned favors through named contacts. Compact logs may begin with current state; do not reconstruct old days.

**Evidence:** see [local verification](docs/VERIFICATION.md). Human tests, specialist review, and release remain separate. No staging, commit, push, publication, or contact with outside reviewers was performed for this revision.


## 0.9 — September 25, 2026 — local playtest redesign

Reworked the existing manuscript with authorization to apply the full design review. Preserved the Oregon journey, shared wagon, four professions, permanent death, resource pressure, seasons, backgrounds, trading, rest, and route finale. Replaced procedures that undermined preparation or excluded players.

- Fixed starting arrays; explicit Dream/Promise/Boundary/Bond and personal cargo.
- Reliable expertise, resource-priced interventions, and two technique choices.
- Warnings and alternatives on 42 chapter events; specific full/partial/failure outcomes.
- Three-day legs in all weather, with daily accounting and explicit interruption rules.
- New Exhaustion and condition pacing; exact zero-HP sequence and same-scene substitutes.
- Removed Ghost Tax, role lockout, automatic desertion, blanket reputation, and automatic failed-diplomacy violence.
- Absolute usable-team speed, 60-gallon starter capacity, visible water forecasting, no undefined cargo weights.
- Seven-chapter campaign, complete river introduction, four pregens, recurring people, map, ledger, solo support, and player-authored endings.
- Rewritten quickstart, glossary, examples, reference, and sheets to match the new core.
- Editorial pass for voice and theme: the central question now recurs across the packet; each module, chapter, and sheet opens on what it is about rather than on its procedure; the 42 event warnings rewritten as sensory read-aloud lines. No rule, number, DC, or outcome was changed by that pass.
- Documented fictional abstractions, source pointers, and unresolved human review needs.

**Migration:** This is a substantial rules change. Do not silently change a campaign mid-session. Between sessions, ask the table to adopt it, retain actual date/resources/wounds/promises, map existing roles to new expertise, replace ability arrays only if the player wants, and choose techniques already earned by completed chapters. Convert active disease to the new listed maximum marks or the old remaining marks, whichever is lower. Remove old automatic incapacitation if new condition does not impose it, but retain actual wound state. Convert an old max-Wagon-HP penalty back to max 30 without healing current HP. Existing barrels retain actual capacity; extra starter barrels are not added for free mid-journey. Retire obsolete player sheets.

Existing uncommitted manuscript work was read before redesign. A pre-redesign local snapshot was retained outside the repository during this edit; no Git commit, push, or publication was performed.

**Evidence:** The playtest protocol lists what human testing still needs to establish. Local verification results are recorded in [verification](docs/VERIFICATION.md).
