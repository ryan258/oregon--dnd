# Oregon Trail RPG — Project Roadmap

The current artifact is **v0.10, a revised playtest edition**. Its content is implemented; table fun, duration, balance, and historical portrayal have not been certified. Local file checks establish only their recorded scope.

| Step | Concrete deliverable | Status / next evidence |
| --- | --- | --- |
| Playable revision | Revised river choice, seven varied chapters, five roles and five pregens (`Guide`, `Doctor`, `Hunter`, `Teamster`, `Steward`), personal opportunities and returns, independent NPC plans, four technique options per role, simpler sheets, river decision card with four crossing offers and Trailmaster reference, rebuilt handbook with subsection navigation and 13-section "Play tonight" selection, travel procedure card, and quick observation sheet | Implemented; see verification |
| Player companion | Static offline character sheet app for five roles/pregens, manuscript rules generator, local storage with bounded labeled undo, raw recovery exports and damaged-save preservation, 8 MiB shared UTF-8 import/export limits, and packaging | Implemented locally; HTTPS hosting and iPad device acceptance pending |
| Local game website, GM Dashboard & Trailmaster ledger | Local Hugo site (`./trail`), streamlined GM Dashboard (`/dashboard/`) with 4-Act Story Teleprompter, first-time GM coaching guidance and quick FAQ, five-traveler tracker, printable large-type handouts, and playtest notes export, plus illustrated cover and camp scene, traveler showcase from five pregens, handbook links, and browser-saved Trailmaster ledger with day-close calculations, draft persistence, and Web Locks concurrency control | Implemented locally; see website/README.md and verification |
| First table | Run the river with current pregens, printed state, and the quick observation sheet; record decisions, participation, accounting, and recall | Awaiting human play |
| Revise observed problems | Exact scene, observation, smallest change, retest | Depends on first table |
| Independent GM | Run without designer coaching; capture missing rules and preparation burden | Pending |
| Desert and finale | Stress snapshot, then an ending using real earlier agreements and resources | Pending |
| Campaign evidence | Actual session count, role usefulness, supplies, repeated-scene fatigue, emotional range | Pending |
| Specialist review | Actual historical/community portrayals and publication provenance | Pending; no reviewer contacted |
| Production edition | Evidence-led rules freeze and measured accessible print/screen layout | After review and play |

## Preserve the baseline until there is a finding

The $800 budget, $550 starter purchases, $250 remaining cash, 700 lbs food, 60-gallon capacity, ability arrays, base DCs, and damage values remain the baseline. New scene prices and technique options are identified as v0.10 design changes. No “optimal loadout,” proven internal consistency, or player score is established by document checks.

Use the [playtest protocol](docs/PLAYTEST.md) one session at a time. Do not reduce food because the premise sounds harsher than a calculation, or increase damage because a prepared group crossed safely. Identify which decisions were missing and which values caused that outcome first.

## Production scope

Use the [single-file handbook](docs/handbook.html), existing sheets, and [quickstart](docs/QUICKSTART.md) as the review surface. A bounded player companion is now implemented at Ryan's request: local character sheets for all five roles and pregens, offline caching, bounded labeled undo, raw recovery exports, and 8 MiB backup/import. In addition, a local game website, streamlined GM Dashboard (`/dashboard/`), and Trailmaster ledger (`/trailmaster/`) are implemented locally via `./trail`: local Hugo site, original cover and camp artwork, five-pregen showcase, step-by-step river session teleprompter with printable large-type handouts and playtest notes export, and browser-saved wagon ledger with day draft preservation, Web Locks storage protection, and 2 MiB backup/import. The river packet includes a dedicated river decision card and 13-section Play tonight print selection. HTTPS hosting and actual iPad acceptance remain pending. Shared-party synchronization, VTT integration, a procedural generator, and a larger campaign remain deferred. The next edition should answer evidence, not add features to hit a rating.
