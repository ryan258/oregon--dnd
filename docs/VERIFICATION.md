# Local verification — v0.9

September 25, 2026. This records the scope of agent-run local checks. It is not a playtest report or a claim of a measured 9/10 rating.

## Completed checks

- The packet checker validates relative Markdown links, parsed table row structure, final newlines/whitespace, handbook section anchors, four pregens' actual printed arrays/modifiers/HP, all seven six-result event tables, and the actual printed starting-purchase arithmetic.
- Starter purchases total **$550**, leaving **$250** from $800. Four extra barrels plus the included capacity give 60 gallons.
- Eight focused arithmetic probes checked shortcut progress (790 + 40 + 70 = 900), detour source marker (900 + 72 − 36 = 936), direct-desert travel and water allowance, remaining river-chapter days, stacked slow travel, trading/credit, the Rest example, and the three-day leg example.
- A manual rules pass traced full/partial/failed crossings, unaffordable passage, damage at zero HP, condition treatment duration, immediate player substitution, extra-body rations, short/interrupted travel legs, lost stock, cargo capacity, and finale days replacing final mileage.
- The generated handbook contains the complete packet with local section navigation, responsive CSS, and print CSS. It contains no remote assets or network-dependent behavior.
- Git whitespace checks were run on tracked edits. The packet checker also checks new Markdown files that Git's unstaged diff does not cover.

## Reproduce the bounded checks

From the repository root, with the dependency in `tools/requirements.txt` available:

```sh
python3 tools/build_handbook.py
python3 tools/check_packet.py
git diff --check
```

These are small document checks, not a game simulation or broad test suite. The eight arithmetic probes were one-off calculations; their operands and expected results are recorded above and in the worked procedures.

## Not established

- No human table or independent GM has run this edition in this task. Actual fun, spotlight distribution, campaign balance, and session duration remain unmeasured.
- Visual browser and printed-page inspection were not completed: the local server bind was denied by the sandbox, and the browser's URL policy blocked opening the local HTML file. No alternate route around that browser restriction was used. HTML structure and navigation were checked from the generated file only.
- Historical source checks inform framing; specialist historical/Indigenous review and publishing provenance review remain pending. No outside reviewer was contacted.
- Prior to the authorized commit bundling, no push, release, external deployment, or publication was performed.

Use the Playtest protocol for the next kind of evidence. If a live rule problem appears, record the exact scene and smallest correction rather than treating a passing file check as proof the rule works at the table.
