# Oregon Trail RPG — Project Roadmap

> **What are we willing to spend, and what do we refuse to lose, to get these people to Oregon?**

This document outlines the development trajectory of the Oregon Trail RPG from the current **v0.9 Playtest Edition** through human table testing, specialist reviews, and eventual v1.0 release.

---

## Roadmap at a glance

| Phase | Milestone | Focus | Status |
| --- | --- | --- | --- |
| **Phase 1** | **v0.9 Playtest Edition** | Core rewrite, 7-chapter campaign, pregens, river adventure, handbook compiler, verification suite | **Complete (Current)** |
| **Phase 2** | **First Table Playtest** | Run *The River Between*, measure player participation, test 5-minute onboarding and starter budget | **Up Next** |
| **Phase 3** | **Blind GM & Stress Tests** | Independent GM run with zero designer coaching; desert stress test (mile 900+); finale payoff audit | Planned |
| **Phase 4** | **Specialist & Provenance Reviews** | Historical accuracy check, Indigenous perspective review, legal licensing/SRD provenance review | Planned |
| **Phase 5** | **v1.0 Production Edition** | Final rule adjustments based on table evidence, print-ready PDF layout, accessible typography | Planned |
| **Backlog** | **Deferred Features** | Digital companion tracker, VTT export modules, procedural data generator | Deferred |

---

## Phase 1: v0.9 Playtest Edition (Current state)

The manuscript underwent a comprehensive structural overhaul in September 2026, replacing punitive, ambiguous d20/5e legacy mechanics with grounded, predictable survival systems.

### Key accomplishments
- **Deterministic starting math:** Established the $800 starting budget ($550 spent on optimal loadout, $250 reserve cash), 60-gallon starter water capacity, and fixed ability arrays (15, 13, 12, 10, 10, 8).
- **Core mechanical stability:** Defined explicit 0 HP transitions, two-traveler Exhaustion threshold, clear travel stances (Cautious, Standard, Reckless), 3-day batch travel legs, and guaranteed same-scene reserve traveler substitutions.
- **Fair hazard architecture:** Replaced instant party wipes and automatic ox deaths with 42 sensory read-aloud warnings offering both dependable (cost/time) and risky (roll) approaches across all 7 chapters.
- **Role expertise & advancement:** Replaced generic d20 proficiency with reliable non-roll services and crisis interventions. Character growth grants situational techniques after chapters 2 and 5 without level-ups or stat inflation.
- **Complete playable packet:** Authored the standalone introductory adventure [*The River Between*](docs/RIVER_CHAPTER.md), four ready-to-run [pregens](docs/PREGENS.md), recurring [people](docs/PEOPLE.md), route [trail map](docs/TRAIL_MAP.md), session zero [boundaries](docs/SESSION_ZERO.md), and [solo play](docs/SOLO.md) support.
- **Tooling & verification:** Implemented `tools/build_handbook.py` for standalone offline HTML reading and `tools/check_packet.py` for link, anchor, arithmetic, and table integrity gates.

---

## Phase 2: Table playtesting & first evidence

The design is internally consistent and verified by automated document checks, but table fun, emotional stakes, spotlight balance, and session pacing can only be validated by human play.

### Objectives & protocols
1. **Run the introductory packet:** Run [*The River Between*](docs/RIVER_CHAPTER.md) with 1 GM and 1–4 players using the standard pregens.
2. **Measure against acceptance targets:**
   - First consequential decision reached within 15 minutes of start.
   - Every player exercises at least one consequential choice affecting supplies, time, or relationships.
   - No player experiences participation loss due to sickness, injury, or lack of replacement funds.
   - No surprise instakills or unavoidable wipes.
3. **Capture evidence:** Follow the observation rubric in [docs/PLAYTEST.md](docs/PLAYTEST.md) to record exact rules lookups, decision choke-points, and post-session player feedback.

---

## Phase 3: Blind GM & stress testing

Once initial designer-led tables validate basic usability, test the system under edge conditions and without designer guidance.

### Focus areas
- **Independent GM trial:** Deliver the packet to an external GM without designer explanation or coaching. Observe where the GM is forced to improvise missing rules or clarify ambiguities.
- **Desert stress test:** Stage a mid-campaign playtest at mile 900+ (Sublette Cutoff / Snake River Plain) with an injured team, constrained water stores, and active conditions to pressure-test water planning, the Doctor's Stabilize intervention, and Hunter ration-stretching.
- **Finale payoff audit:** Run Chapter 7 (Columbia River rafting vs. Barlow Road mountain pass) carrying actual NPC debts, promises, and physical wear from earlier play to verify narrative resolution and player-authored epilogues ([docs/ARRIVAL.md](docs/ARRIVAL.md)).

---

## Phase 4: Specialist, cultural & legal reviews

Before any broader or commercial release, the manuscript must be scrutinized by external domain specialists.

### Action items
- **Indigenous cultural review:** Engage specialist cultural review with representatives or consultants from regional Indigenous nations (including Cayuse, Umatilla, Walla Walla, and Shoshone-Bannock contexts) to review framing, prevent harmful tropes, and ensure historical integrity ([docs/HISTORY.md](docs/HISTORY.md)).
- **Historical accuracy audit:** Cross-reference wagon freight dynamics, fort economic pricing, disease trajectories, and seasonal weather windows against documented Oregon Trail archival records.
- **Legal provenance & licensing audit:** Review CC BY-SA 4.0 licensing compatibility, evaluate legacy d20 SRD mechanics separation, and ensure proper third-party attribution declarations.

---

## Phase 5: v1.0 Production Edition

Consolidate table evidence and expert feedback into the definitive release of the game.

### Deliverables
- **Rules freeze:** Finalize numbers, DCs, and procedures; deprecate temporary playtest notices.
- **Publication layout & typography:** Create a professional print-ready PDF with accessible font scales, screen-reader tagging, high-contrast sheet variants, and clean two-page spreads.
- **Complete GM kit:** Printable physical sheets, pocket GM screen reference, and laminated quick-reference cards for roles, travel stances, and weather tables.

---

## Deferred backlog (Post-v1.0)

The following items are intentionally deferred until the physical pen-and-paper tabletop experience is fully proven:
- **Digital companion web app:** Interactive supply ledger, water calculator, and log tracker.
- **VTT integration packages:** Foundry VTT and Roll20 character sheets and adventure modules.
- **Procedural route generator:** Dynamic alternate historical routes and random expedition builders.
