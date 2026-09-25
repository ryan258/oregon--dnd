# Trail companion

A static, offline-capable player character sheet for Oregon Trail RPG v0.10.

Serve this entire folder at an HTTPS address. In Safari on each iPad, add the page to the Home Screen and open the installed app before choosing a traveler. Wait for “Offline copy ready,” make an edit, wait for “Saved on this device,” and close/reopen in Airplane Mode to test. Keep a JSON export in Files before and after playing. No hosting or device installation is performed by this folder alone.

All four pregens are built in. Each device stores its own sheets; there is no shared party synchronization or account. Backups import as separate copies. Shared wagon supplies and the authoritative day remain with the GM. The character tracker applies HP/wound changes, caps daily Exhaustion gains, and records rest; conditions, shared costs, and recovery rolls still require the table's decision.

Source-check/rebuild from the repository root: `python3 tools/build_player_rules.py --check` / `python3 tools/build_player_rules.py`. See `docs/PLAYER_APP.md` in the repository, or `PLAYER_APP.md` in the packaged ZIP, for installation, recovery, update, and validation instructions.
