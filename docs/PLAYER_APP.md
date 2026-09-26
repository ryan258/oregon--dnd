# Player companion — local character sheets for iPad

The [player app](../player/index.html) is a single-page companion for Oregon Trail RPG v0.10. Each device keeps its own character records. It includes the four pregens, custom and reserve sheets, health and wound tracking, Exhaustion, conditions, Inspiration, personal statements, a journal, and the current role/background/technique reference. The app has no account, analytics, external font, CDN, or cloud synchronization.

## Use it at the table

1. Choose a pregen or create a traveler. Select the river introduction or full-campaign starting date. Existing sheets are kept when another is added.
2. **At the table:** record damage/healing, rest, Exhaustion, Inspiration, today's question, and conditions. A separate hit is a separate damage action. Damage at zero advances wound state once; ordinary healing does not cure wounds.
3. **Story & journal:** edit promises, keepsakes, cargo, reserve connections, and choice → change → return notes.
4. **Abilities & learning:** consult the manuscript-derived reference, record use reminders, and choose only the techniques the table has earned. The app does not grant them just because the chapter counter changed.
5. **Next day:** first resolve supplies, ongoing effects, recovery, and evening with the GM. Then advance the date and clear daily reminders. The app does not silently apply disease damage or spend party supplies. Session, chapter, and weather-span resets have separate scopes.
6. Export a backup at the end of play. Keep it in Files or another location outside browser storage. A download request is not proof the file was saved; check it.

**Correct sheet** records a ruling or custom creation. It permits explicit corrections to HP, ability scores, wound state, background, date, and daily flags. It rejects out-of-range values and HP above the applicable maximum. A new custom character uses the fixed array initially. For a replacement, record Exhaustion 1 and the earned techniques; no supplies are created.

The party's calendar and shared wagon ledger remain the GM/table's responsibility. Changing one device does not update another. Only four travelers occupy active party slots; an extra saved sheet is not extra labor. Record any additional body's rations at the table.

## Preload each iPad

Use a current iPadOS Safari; iPadOS 17 or newer is the intended baseline, pending device testing.

1. Serve the complete `player/` directory at a stable **HTTPS** address. The files are static and need no API or database. Hosting/publication has not been performed as part of the local build.
2. Open that address in Safari. Use Share → Add to Home Screen, then open the installed app **before** selecting or importing the player's character.
3. Wait for **Offline copy ready**. That means the service worker has checked its required cached files; it is not a guarantee against future storage eviction.
4. Choose the traveler inside the Home Screen app. Make a small journal edit and wait for **Saved on this device**. Safari and the installed app can have separate storage; import a backup if switching contexts.
5. Close and reopen the installed app. Verify the edit. Turn on Airplane Mode and reopen it again; verify the sheet and role reference load, make a small change, and reopen to check it persisted.
6. Export a JSON backup to Files and import it as a separate copy. Confirm the copied HP, conditions, statements, and notes, then remove the test copy if desired.

An AirDropped HTML file or a Files preview is not the supported installation route. Service workers require a secure context. A laptop's plain `http://192.168…` address does not provide the iPad's offline installation requirement. For local development only, browsers treat `http://localhost` as secure. [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

WebKit documents storage quotas and possible eviction. Persistent storage is requested only through the backup panel and the app reports whether it was granted. A grant is not a substitute for an external copy. [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/). WebKit also documents that adding a Home Screen app does not copy local storage from Safari. [WebKit 17.2](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/).

## Save and recovery behavior

- The local-storage key is `oregon-trail-player-v1`, scoped to the site's origin and browser/app context. Use a stable address and export before changing it.
- Writes run under a Web Lock and compare the previously read stored value. A stale window pauses saving instead of overwriting a newer save. Export its visible work, then load the saved version; import creates copies rather than merging fields silently.
- A context without Web Locks offers memory-only editing and export, with an explicit warning. It does not claim those edits are locally saved. HTTPS/current Safari is the supported path.
- **Undo** names the latest saved action or text edit. Typing during one uninterrupted field visit is grouped into one edit while every input still autosaves. Repeated Undo walks backward through up to eight checkpoints, including after reopening; it does not toggle or provide Redo. Each checkpoint restores all sheets to that moment, so export first to keep the current version. Older checkpoints are trimmed when their combined UTF-8 JSON exceeds 1 MiB, retaining at least the newest checkpoint. Current state and history are written together; a failed write changes neither. Existing valid saves and their legacy previous-save slot remain readable. Local history is not an independent backup; exported backups contain current sheets only, not undo history.
- Storage-read, archive, quota, and write failures are visible. A failed save leaves the visible sheet exportable and pauses further editing until resolved. Loading saved data replaces the visible unsaved version only after an explicit confirmation.
- Invalid stored data is not silently reset. The recovery panel can show its raw bytes and can archive them locally before starting an empty save. If the archive fails, replacement stops. If another window has supplied a valid save meanwhile, recovery refuses to overwrite it.
- Backup imports validate the app/edition/schema, field types, limits, condition names, technique names, and unique IDs before use. Imports add separate copies and preserve existing travelers. Maximum 12 stored travelers and 8 MiB of UTF-8 JSON per export/import. Files and pasted text use the same size rule, large enough for the schema’s maximum supported records; remove an unused traveler only after exporting anything worth keeping.
- Journal text and imported strings render as text, never executable HTML. There is no automatic external transmission of character data.

## Run and maintain locally

From the project root:

```sh
python3 tools/build_player_rules.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/player/` on the same computer. Keep the same hostname and port for the same local save. This server command is a development preview, not iPad HTTPS hosting.

The generated `player/rules.js` comes from `seed.md`, `02_character_backgrounds.md`, and `docs/PREGENS.md`; editing those sources requires rebuilding it. The game remains v0.10; the app's save format is version 1. For an app asset update, bump `BUILD` in `player/sw.js`; an already-open session keeps its existing worker until all its windows close. Saves use a separate key and are not erased by an app-cache update. Recheck offline loading after updating.

Targeted checks:

```sh
python3 tools/build_player_rules.py --check
node --test tests/player.test.cjs tests/player-offline.test.cjs
```

A deployment ZIP can be rebuilt with `python3 tools/package_player.py`. It contains the static app and its instructions, with no character saves. Upload/extract only when hosting is explicitly authorized.

## Verification boundary

See [local verification](VERIFICATION.md) for actual checks. Node tests exercise the real character model and storage adapter with injected storage failures, plus the service worker with an in-memory Cache API. They do not certify iPad Safari, Home Screen installation, Files download/import, real browser quotas, or a complete offline device session. Run the six iPad steps above before relying on it for a game night.
