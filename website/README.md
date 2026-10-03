# The Oregon Trail site

A small local Hugo site for explaining the game, meeting its travelers, reading the instructions, and managing the shared wagon record. No external theme, JavaScript package install, account, analytics, web font, or backend is required. This addition does not publish the project or change the v0.10 rules.

## Open it

From the repository root:

```sh
./trail
```

Open `http://localhost:1313/`. Keep the same address and browser for your saves: `localhost`, `127.0.0.1`, another port, and another host are separate browser storage locations. Use Download backup and Import backup to move a ledger. The launcher binds only to this Mac; sharing it with another device or publishing it is a separate action.

The launcher runs `hugo server --bind 127.0.0.1 --port 1313 --disableFastRender`. Stop with Control-C. Hugo 0.166.0 was used for this implementation; the configuration uses its current `locale` and mount `files` settings.

Build the static files locally:

```sh
hugo
```

Output: `dist/site/`. Before hosting under a path, build with the intended base URL, for example `hugo --baseURL https://example.org/oregon/`. Hosting is not configured or authorized by this addition.

## Pages

- `/` — the game introduction and original illustrated cover.
- `/game/` — the premise, table procedures, roles, campaign, and participation promise.
- `/characters/` — the four pregens rendered directly from `docs/PREGENS.md`, plus an introduction to recurring people.
- `/instructions/` — entry points into the handbook and a printable cover.
- `/cover/` — print just the illustrated cover as a front sheet; turn browser headers/footers off and fit to page.
- `/trailmaster/` — the shared ledger.
- `/player/` — the existing character companion served unchanged.
- `/docs/handbook.html` — the existing generated single-file handbook, served at its original relative path.

## Trailmaster workflow

1. Choose **Start river session** or **Start full campaign**. Both match their separate v0.10 supply snapshots. Import an existing backup to resume instead.
2. Put the next decision, checkpoint, deadline, and water source where the table can see them. Use the section links to jump around.
3. Adjust shared resources with large plus/minus controls or direct entry. Fields save when you leave them; checkbox and button actions save immediately. The save status reports whether changes reached browser storage. Individual conditions, wounds, and role abilities remain on the character sheets.
4. Resolve a day at the table. Use an estimate button to fill the arithmetic, then correct it for actual travelers, weather, strain, delays, and scene exceptions. Estimates assume four travelers; they do not calculate movement modifiers or rules consequences.
5. **Preview & close this day** shows the exact expenditure, actual miles, route-marker change, fresh food expiring, and next date before applying it. This eats the earliest-expiring fresh batch first, then cured food, and discards expiring fresh food only after that evening. A past-expiry batch must be removed first. If you need cured food first or more than two different fresh batches, resolve those inventories manually and record the day in your notes.
6. If today's costs are already recorded manually, the daily-close control refuses to charge them again. Manually finish the date, weather span, expiry, recovery markers, and log notes instead. Chapter entry, money, health, ox strain/recovery, care, Morale, and favors always remain explicit manual changes.
7. Download a backup at the end of the session. Undo retains up to ten changes across reload, with a size cap. It has no redo. Downloaded backups contain the entire campaign and log, without undo history. The page displays the latest 30 daily entries; backups retain up to 1,000.

Two personal cargo bundles and one entrusted bundle are recorded as notes. Three ox teams have controls; additional teams go in cargo notes and require manual accounting. No hidden dice rolls, automatic character-sheet edits, real-time sharing, or ledger offline installation is implemented. The pre-existing player app retains its own scoped offline support.

## Saving and recovery

The ledger's separate, path-scoped localStorage key starts with `oregon-trail-trailmaster-v1:`. Web Locks serialize writes, and each save checks the previously loaded bytes. A competing tab blocks edits and offers **Load latest saved ledger**; download the visible version first if it has changes you need. A storage failure keeps the visible campaign in memory and explicitly asks for a backup. Browsers without Web Locks use memory only.

Imports validate a versioned Trailmaster JSON envelope, every recognized field, real calendar dates, category limits, and log rows before showing a replacement preview. Player backups are a different format. Backups are bounded to 2 MiB UTF-8. Invalid saves remain untouched until an explicit replacement; the original bytes can be downloaded. Invalid optional undo history does not prevent loading a valid current campaign. There is no automatic synchronization between player and Trailmaster saves.

## Source map

- `hugo.toml` mounts website content/templates/assets, the original player directory, and the original handbook.
- `website/layouts/characters.html` reads `docs/PREGENS.md` at build time; the Markdown link hook routes its references into the handbook.
- `website/static/js/trail-model.js` owns the ledger schema, presets, validation, pure day preview, and backup format.
- `website/static/js/trailmaster.js` owns the accessible controls, save queue, conflict handling, dialogs, and rendering using text nodes.
- `website/assets/site.css` provides the responsive paper/forest-green design, focus treatment, large controls, reduced-motion behavior, and print styles.
- `website/static/art/` contains the two original PNG illustrations. Prompts and provenance are in `website/ARTWORK.md`.

If the manuscript changes, rebuild its existing generated assets as appropriate with `python3 tools/build_handbook.py` and `python3 tools/build_player_rules.py`, then rebuild Hugo. The site mounts those files; it does not silently regenerate them. The ledger snapshots and arithmetic are separately maintained against the v0.10 manuscript and need review if those rules change.

## Targeted checks

```sh
node --test website/tests/trail-ledger.test.cjs
hugo
python3 website/tests/check_site.py
```

The Node tests cover the new model and controller's data safety with injected storage failures; they are not a full browser or assistive-technology suite. The site checker validates generated local links and fragments, original asset mounts, and presence of all four travelers. A browser smoke pass covers the visible day preview, save/reload/undo, backup import, and responsive rendering. The automated browser download-event capture timed out, so a completed browser download was not independently confirmed; backup serialization and validation passed the targeted tests. Real-iPad and assistive-technology acceptance remain unverified.
