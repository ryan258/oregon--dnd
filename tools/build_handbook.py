#!/usr/bin/env python3
"""Build the local, printable review handbook. No network or browser required."""
from pathlib import Path
import html
import re
import posixpath
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
ORDER = ['docs/QUICKSTART.md', 'docs/RIVER_CHAPTER.md', 'docs/PREGENS.md',
         'docs/TRAIL_MAP.md', 'docs/sheets/gm_reference.md', 'seed.md',
         'docs/CAMPAIGN.md', 'docs/PEOPLE.md',
         '01_events_and_hazards.md', '02_character_backgrounds.md',
         '03_settlements_and_trading.md', '04_native_encounters.md',
         '05_camp_life.md', '06_weather_and_environment.md', '07_route_variants.md',
         'docs/ARRIVAL.md', 'docs/SAMPLE_DAY.md', 'docs/SESSION_ZERO.md',
         'docs/SOLO.md', 'docs/PLAYER_APP.md', 'docs/sheets/character_sheet.md',
         'docs/sheets/party_wagon_sheet.md', 'docs/sheets/people_ledger.md',
         'docs/sheets/trail_log.md', 'docs/sheets/fort_trading_sheet.md',
         'docs/glossary.md', 'docs/PLAYTEST.md', 'docs/HISTORY.md',
         'docs/UPDATE-IDEAS.md', 'roadmap.md', 'CHANGELOG.md', 'docs/VERIFICATION.md',
         'docs/README.md', 'README.md']

def anchor(path):
    return re.sub(r'[^a-zA-Z0-9_-]', '-', path)

md = MarkdownIt('commonmark', {'html': False}).enable('table')
def links(tokens, idx, options, env):
    href = tokens[idx].attrGet('href') or ''
    if not re.match(r'^[a-z]+:', href) and not href.startswith('#'):
        target, _, fragment = href.partition('#')
        normalized = posixpath.normpath(posixpath.join(posixpath.dirname(env['source']), target))
        if normalized == 'docs/handbook.html':
            tokens[idx].attrSet('href', '#reading')
        elif normalized in ORDER:
            tokens[idx].attrSet('href', '#' + anchor(normalized))
    return md.renderer.renderToken(tokens, idx, options, env)
md.renderer.rules['link_open'] = links
sections = []
nav = []
for source in ORDER:
    raw = (ROOT / source).read_text()
    title = next(line[2:] for line in raw.splitlines() if line.startswith('# '))
    ident = anchor(source)
    nav.append(f'<a href="#{ident}">{html.escape(title)}</a>')
    body = md.render(raw, {'source': source})
    sections.append(f'<article id="{ident}"><p class="source">{html.escape(source)}</p>{body}</article>')
css = '''
:root{color-scheme:light;--paper:#faf6ed;--ink:#282b26;--accent:#784d2b;--line:#c8c0ae}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 system-ui,sans-serif}
a{color:#68431e;text-underline-offset:3px}a:focus-visible,button:focus-visible{outline:3px solid #1c6a77;outline-offset:4px}
.skip{position:absolute;top:-100px}.skip:focus{top:8px;left:8px;background:white;padding:12px;z-index:5}
header{padding:48px max(28px,6vw);border-bottom:1px solid var(--line);background:#283b32;color:#fff8e7}
header p{max-width:760px}header h1{font:700 clamp(2.2rem,5vw,4.3rem)/1.1 Georgia,serif;margin:14px 0}
.kicker{letter-spacing:.12em;text-transform:uppercase;font-size:13px;font-weight:700}
.actions{display:flex;flex-wrap:wrap;gap:12px}.actions a,.actions button{background:#f8edcf;color:#25362e;border:0;border-radius:4px;padding:12px 18px;font:600 15px system-ui;text-decoration:none;cursor:pointer}
.layout{display:grid;grid-template-columns:270px minmax(0,1fr);max-width:1500px;margin:auto}
nav{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto;padding:28px 20px;border-right:1px solid var(--line)}nav a{display:block;font-size:14px;line-height:1.35;padding:8px 4px}
main{min-width:0;padding:0 5vw 70px}article{padding:40px 0;border-bottom:2px solid var(--line);scroll-margin-top:12px}
h1,h2,h3{font-family:Georgia,serif;line-height:1.2}article h1{font-size:2.2rem}h2{margin-top:2em;font-size:1.65rem}h3{margin-top:1.7em;font-size:1.25rem}.source{color:#645d50;font:12px ui-monospace,monospace}
p,li{max-width:85ch}li{margin:.35em 0}table{border-collapse:collapse;width:100%;font-size:14px;margin:24px 0;overflow-wrap:anywhere}th{text-align:left;background:#e8dfce}td,th{padding:10px 12px;border:1px solid var(--line);vertical-align:top}tr:nth-child(even){background:#f1eadc}
pre{overflow:auto;background:#eee6d7;padding:18px;font-size:13px;line-height:1.5}code{font-size:.9em}blockquote{border-left:4px solid var(--accent);padding-left:18px;margin-left:0}
footer{padding:25px 5vw;font-size:14px;border-top:1px solid var(--line)}
@media(max-width:850px){.layout{display:block}nav{position:relative;max-height:270px;border-bottom:1px solid var(--line);border-right:0}main{padding:0 20px 40px}header{padding:30px 20px}table{font-size:12px}td,th{padding:6px}article h1{font-size:1.8rem}}
@media print{@page{size:A4;margin:16mm}body{background:#fff;color:#000;font-size:10pt;line-height:1.45}header{background:#fff;color:#000;padding:0 0 16pt}.layout{display:block}nav,.actions,.skip,footer{display:none}main{padding:0}article{break-before:page;border:0;padding:0}article h1{font-size:23pt}h2{font-size:16pt}h3{font-size:12pt}h1,h2,h3{break-after:avoid}p,li{orphans:3;widows:3}table{font-size:8pt}tr{break-inside:avoid}thead{display:table-header-group}td,th{padding:5pt}a{color:#000}pre{white-space:pre-wrap;font-size:8pt}.source{font-size:8pt}}
'''
out = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Oregon Trail RPG — Playtest Handbook v0.10</title><style>'+css+'</style></head><body>'
out += '<a class="skip" href="#reading">Skip to handbook</a><header><p class="kicker">Oregon Trail RPG · v0.10 · Playtest edition</p><h1>Four people. One wagon.<br>Promises worth carrying.</h1><p>A complete local play packet. Start at the river, then follow the journey west. The design aims for memorable decisions; human playtesting is still pending.</p><div class="actions"><a href="#docs-RIVER_CHAPTER-md">Play the river chapter</a><a href="#docs-PREGENS-md">Meet the four travelers</a><button type="button" onclick="window.print()">Print / save PDF</button></div></header>'
out += '<div class="layout"><nav aria-label="Handbook sections">'+''.join(nav)+'</nav><main id="reading">'+''.join(sections)+'</main></div><footer>Generated from the Markdown packet. No network requests, accounts, or data collection. Rebuild with python3 tools/build_handbook.py.</footer></body></html>'
destination = ROOT / 'docs/handbook.html'
destination.write_text(out)
print(f'Built {destination}: {len(ORDER)} sections, {len(out):,} characters')
