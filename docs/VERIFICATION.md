# Local verification — v0.10

Updated October 3, 2026. This edition implements a manuscript critique and local play aids. Human play, specialist review, campaign balance, and player rating remain unmeasured.

## October 3, 2026 — local game website and Trailmaster ledger

- The focused Trailmaster model and storage suite passed all 22 tests (`website/tests/trail-ledger.test.cjs`). Checks cover starter presets (river and full campaign), date progression, daily close calculations (earliest fresh food expiry, cured food consumption, miles and markers), Web Locks write concurrency protection, dirty-state preservation, quota and write failures, 2 MiB UTF-8 backup envelope export/import validation, corrupted save handling, and 10-step bounded undo across reloads.
- The static site builder (`hugo`) generated 8 HTML pages into `dist/site/` with mounts for the complete character companion (`player/`), generated single-file handbook (`docs/handbook.html`), and custom assets.
- The site integrity checker (`website/tests/check_site.py`) verified all local links, anchors, mounting integrity for player files and handbook, and the build-time extraction of all four pregenerated travelers from `docs/PREGENS.md`.
- Local launch command `./trail` binds strictly to `127.0.0.1:1313`. No external theme, analytics, fonts, CDN, backend, or cloud sync are used.
- Browser smoke testing confirmed responsive layout, daily preview modal, save/reload persistence, Web Locks concurrency lockout on competing tabs, and backup export/import. Completed browser download-event capture was not independently automated. Assistive-technology and iPad device acceptance remain unverified.

## September 26 — readiness fixes

- The focused player model/storage/offline suite passed 28 tests. New checks cover all 12 maximum-size supported records with escaped control characters and Unicode, a shared UTF-8 byte limit, grouped text undo followed by gameplay undo after reopening, bounded history, legacy previous-save migration, stale confirmations/writers, and atomic write/undo failure. Failures and storage limits are injected; this is not a Safari quota measurement.
- Player rules were regenerated and their source check passed. The handbook was rebuilt with 36 source sections, unique heading anchors, an 11-section Play tonight selection, and the new travel/observation sheets. Bounded packet and whitespace checks passed; these do not prove every rules interaction.
- In the Codex desktop browser, created a traveler, recorded 3 damage, typed a journal sentence, and reloaded. HP was 6/9 and the grouped edit remained recoverable. One Undo removed the whole journal edit; the next restored 9/9 HP and exposed the earlier creation checkpoint. The history no longer toggles between the final two keystrokes.
- In the generated handbook, confirmed Play tonight shows its 11 intended sections, a core-rule reference reveals the full handbook, and the HP and wounds subsection link reaches its exact heading. At the checked 1280-pixel viewport the document also measured 1280 pixels wide. The handbook browser error log was empty. Print output and physical iPad behavior were not tested in this pass.
- An existing root-scoped service worker on the development localhost origin intercepted a handbook navigation. Handbook checks used the separate 127.0.0.1 origin; existing browser storage was not cleared. This does not establish deployment behavior.
- Starting resources, damage, base DCs, and technique counts remain the v0.10 baseline. River advancement now consistently requires reaching Laramie. No human test or player rating has been obtained. No commit, push, hosting, or publication was performed.

## September 25 — earlier revision checks

- Rebuilt the offline handbook from all 34 source sections, including the player-app guide. The bounded packet check passed for 34 Markdown files, 126 local links, 162 handbook anchor references, four printed pregen arrays/modifiers/HP, all 42 chapter event entries, and the $550 purchases / $250 remainder. These are file-level checks, not a claim of complete rules consistency.
- Ten focused arithmetic/printed-table checks passed: four river approach food/timing cells; their combined food comparison; the ramp example's food, wagon, teams, and cash endpoint; the weather-change example; the desert forecast; ford no-success probabilities; and sledge progress. The calculations are reproducible from the operands in Sample Day and Playtest; no campaign simulator was run.
- Manually traced river labor completion/abandonment, one/no-worker passage recovery, the missed meeting and letter, per-person mixed-day rest, daily weather checkpoints, independent NPC departures and carried news, retained favor redemption, technique action/capacity limits, and safe carrier arrival. Corrected conflicting extra-treatment wording and the initial sledge tradeoff during that review.
- Git whitespace checks passed. All revision edits remain unstaged; no commit, push, deployment, publication, or outside messages were performed.
- The request to open the handbook as a Codex file panel was queued. The separate handbook browser visual-inspection attempt was blocked by the browser's local-file URL security policy. No workaround was attempted. The handbook's browser rendering and printed-page appearance are therefore not visually verified in this revision. The separate player-app preview was inspected as described below.

## September 25 — earlier player companion checks

- Generated rules match the three current manuscript sources: four pregens, four roles, 16 backgrounds, 16 techniques, and nine conditions. JavaScript syntax checks passed.
- All 20 targeted Node tests passed. They cover wound transitions, daily Exhaustion limits, maximum HP, rest ordering, date/reset behavior, complete backup round trips, rejected imports, independent imported copies, previous-save undo after reopening, stale writers, denied storage reads, quota/archive failures, corrupt-save recovery, and the service worker's offline cache and scope-limited cleanup. Storage failures and Cache API behavior in these tests are injected, not measurements of Safari storage limits.
- In the Codex desktop browser, confirmed damage, notes, Exhaustion, and condition marks persisted after reload; Undo restored a previous save after reload; a pasted backup imported as a separate copy; learned techniques and use reminders saved; and a second window paused editing when another window changed the save.
- With the local preview server stopped, reloaded the cached app, changed a note, and reloaded again. The app and reference remained available and the note persisted. The checked browser error log was empty. This verifies an unavailable-origin scenario in that desktop browser, not a physical iPad Airplane Mode session.
- Visually checked the app at tablet and narrow-screen viewport sizes. At 375 pixels wide, the document width also measured 375 pixels. This is a responsive layout check, not a full accessibility audit.
- The deployment ZIP contains static assets and setup instructions only; browser saves are not part of the package. Hosting, publication, and installation on players' devices have not been performed.

Physical iPad Safari and Home Screen installation, Files download/import, and the device's offline reopening behavior remain unverified. Complete the six preload steps in [the player-app guide](PLAYER_APP.md) on each iPad before game-night reliance. Local storage and a previous-save slot are not independent backups.

## Reproduce the bounded document checks

```sh
python3 tools/build_handbook.py
python3 tools/check_packet.py
python3 tools/build_player_rules.py --check
node --test tests/player.test.cjs tests/player-offline.test.cjs
node --test website/tests/trail-ledger.test.cjs
hugo
python3 website/tests/check_site.py
git diff --check
```

These commands check files and printed starting arithmetic, not player experience. Constructed examples in Sample Day and Playtest identify their assumptions; none is an observed human session.

## Earlier evidence

The v0.9 verification recorded local structure, starting purchases, four pregens, 42 events, and selected arithmetic/manual procedure checks. Those historical checks do not validate v0.10's new choices or techniques. Earlier browser/print inspection was not completed; no later visual acceptance should be inferred from that record.

## Still required

Use the Playtest protocol for the first river table, independent GM, desert stress session, and earned finale. The Hall stock keeper's regional basis was checked against the Shoshone-Bannock Tribes' own pages; the character and work scenes are fiction, with no specialist endorsement. Publication provenance and accessibility/print acceptance remain separate work.
