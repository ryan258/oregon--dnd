#!/usr/bin/env python3
"""Build the local, printable review handbook. No network or browser required."""
from pathlib import Path
import html
import re
import posixpath
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
ORDER = ['docs/QUICKSTART.md', 'docs/sheets/river_decision_card.md',
         'docs/RIVER_CHAPTER.md', 'docs/PREGENS.md',
         'docs/TRAIL_MAP.md', 'docs/sheets/gm_reference.md', 'seed.md',
         'docs/CAMPAIGN.md', 'docs/PEOPLE.md',
         '01_events_and_hazards.md', '02_character_backgrounds.md',
         '03_settlements_and_trading.md', '04_native_encounters.md',
         '05_camp_life.md', '06_weather_and_environment.md', '07_route_variants.md',
         'docs/ARRIVAL.md', 'docs/SAMPLE_DAY.md', 'docs/SESSION_ZERO.md',
         'docs/SOLO.md', 'docs/PLAYER_APP.md', 'docs/sheets/character_sheet.md',
         'docs/sheets/party_wagon_sheet.md', 'docs/sheets/people_ledger.md',
         'docs/sheets/trail_log.md', 'docs/sheets/travel_procedure.md',
         'docs/sheets/playtest_observer.md', 'docs/sheets/fort_trading_sheet.md',
         'docs/glossary.md', 'docs/PLAYTEST.md', 'docs/HISTORY.md',
         'docs/UPDATE-IDEAS.md', 'roadmap.md', 'CHANGELOG.md', 'docs/VERIFICATION.md',
         'docs/README.md', 'README.md']

def anchor(path):
    return re.sub(r'[^a-zA-Z0-9_-]', '-', path)

TONIGHT = {'docs/QUICKSTART.md', 'docs/sheets/river_decision_card.md',
           'docs/RIVER_CHAPTER.md', 'docs/PREGENS.md', 'docs/sheets/character_sheet.md',
           'docs/TRAIL_MAP.md', 'docs/sheets/gm_reference.md', 'docs/SESSION_ZERO.md',
           'docs/sheets/party_wagon_sheet.md', 'docs/sheets/people_ledger.md',
           'docs/sheets/trail_log.md', 'docs/sheets/travel_procedure.md',
           'docs/sheets/playtest_observer.md'}

def slug(title):
    return re.sub(r'[^\w -]', '', title.lower()).replace(' ', '-')

md = MarkdownIt('commonmark', {'html': False}).enable('table')
parsed = {}
headings = {}
for source in ORDER:
    tokens = md.parse((ROOT / source).read_text())
    entries = []
    used = {}
    for index, token in enumerate(tokens):
        if token.type != 'heading_open':
            continue
        title = tokens[index + 1].content
        base = slug(title)
        count = used.get(base, 0)
        used[base] = count + 1
        fragment = base if not count else f'{base}-{count}'
        ident = anchor(source) + '--' + fragment
        token.attrSet('id', ident)
        entries.append((token.tag, title, fragment, ident))
    parsed[source] = tokens
    headings[source] = entries

def links(tokens, idx, options, env):
    href = tokens[idx].attrGet('href') or ''
    if not re.match(r'^[a-z]+:', href):
        target, _, fragment = href.partition('#')
        normalized = posixpath.normpath(posixpath.join(posixpath.dirname(env['source']), target)) if target else env['source']
        if normalized == 'docs/handbook.html':
            tokens[idx].attrSet('href', '#reading')
        elif normalized in ORDER:
            destination = anchor(normalized)
            if fragment:
                destination = next((ident for _, _, key, ident in headings[normalized] if key == fragment), destination)
            tokens[idx].attrSet('href', '#' + destination)
    return md.renderer.renderToken(tokens, idx, options, env)
md.renderer.rules['link_open'] = links

def render_source(source):
    tokens = parsed[source]
    env = {'source': source}
    if source != 'docs/PREGENS.md':
        return md.renderer.render(tokens, md.options, env)
    boundaries = [i for i, token in enumerate(tokens)
                  if token.type == 'heading_open' and token.tag == 'h2']
    body = md.renderer.render(tokens[:boundaries[0]], md.options, env)
    for start, end in zip(boundaries, boundaries[1:] + [len(tokens)]):
        block = md.renderer.render(tokens[start:end], md.options, env)
        role = tokens[start + 1].content.rpartition(' — ')[2]
        if role in ('Guide', 'Doctor', 'Hunter', 'Teamster', 'Steward'):
            block = f'<section class="pregen-sheet">{block}{PREGEN_RECORD}</section>'
        body += block
    return body

PREGEN_RECORD = '''
<div class="pregen-record">
  <h3>During play</h3>
  <p>Start Healthy, with Exhaustion 0 and one Inspiration. Use the starting HP above.</p>
  <table aria-label="Traveler record">
    <thead><tr><th>Player</th><th>Current HP</th><th>Wound</th><th>Exhaustion</th><th>Inspiration</th></tr></thead>
    <tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody>
  </table>
  <table aria-label="Traveler notes">
    <thead><tr><th>Condition / marks / care</th><th>Decision / promise to carry forward</th></tr></thead>
    <tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody>
  </table>
</div>'''

sections = []
nav = []
for source in ORDER:
    title = next(title for tag, title, _, _ in headings[source] if tag == 'h1')
    ident = anchor(source)
    packet = 'tonight' if source in TONIGHT else 'full'
    subsections = ''.join(f'<a class="subsection" href="#{key}">{html.escape(title)}</a>'
                          for tag, title, _, key in headings[source] if tag in ('h2', 'h3'))
    nav.append(f'<details data-packet="{packet}"><summary>{html.escape(title)}</summary><a href="#{ident}">Open section</a>{subsections}</details>')
    body = render_source(source)
    sections.append(f'<article id="{ident}" data-packet="{packet}"><p class="source">{html.escape(source)}</p>{body}</article>')
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
nav summary{cursor:pointer;padding:10px 0;font-weight:650}nav .subsection{padding-left:14px}h2,h3{scroll-margin-top:20px}
body[data-mode="tonight"] [data-packet="full"]:not([data-reference]){display:none}
.actions button[aria-pressed="true"]{outline:3px solid #e5b777;outline-offset:3px}
main{min-width:0;padding:0 5vw 70px}article{padding:40px 0;border-bottom:2px solid var(--line);scroll-margin-top:12px}
h1,h2,h3{font-family:Georgia,serif;line-height:1.2}article h1{font-size:2.2rem}h2{margin-top:2em;font-size:1.65rem}h3{margin-top:1.7em;font-size:1.25rem}.source{color:#645d50;font:12px ui-monospace,monospace}
p,li{max-width:85ch}li{margin:.35em 0}table{border-collapse:collapse;width:100%;font-size:14px;margin:24px 0;overflow-wrap:anywhere}th{text-align:left;background:#e8dfce}td,th{padding:10px 12px;border:1px solid var(--line);vertical-align:top}tr:nth-child(even){background:#f1eadc}
pre{overflow:auto;background:#eee6d7;padding:18px;font-size:13px;line-height:1.5}code{font-size:.9em}blockquote{border-left:4px solid var(--accent);padding-left:18px;margin-left:0}
footer{padding:25px 5vw;font-size:14px;border-top:1px solid var(--line)}
.pregen-record{display:none}
@media(max-width:850px){.layout{display:block}nav{position:relative;max-height:270px;border-bottom:1px solid var(--line);border-right:0}main{padding:0 20px 40px}header{padding:30px 20px}table{font-size:12px}td,th{padding:6px}article h1{font-size:1.8rem}}
@media print{
  @page{margin:14mm}
  body{--line:#999;background:#fff;color:#000;font-size:10.5pt;line-height:1.32}
  header{background:#fff;color:#000;padding:0 0 12pt}
  .layout{display:block}
  nav,.actions,.skip,footer{display:none}
  main{padding:0}
  article{break-before:page;border:0;padding:0}
  article h1{font-size:21pt;margin:0 0 8pt}
  h2{font-size:14pt;margin:11pt 0 5pt}
  h3{font-size:11.5pt;margin:8pt 0 4pt}
  h1,h2,h3{break-after:avoid}
  p,li{max-width:none;orphans:2;widows:2}
  p{margin:0 0 6pt}
  ul,ol{margin:4pt 0 7pt;padding-left:17pt}
  li{margin:2pt 0}
  table{font-size:9.5pt;margin:6pt 0 8pt}
  tr{break-inside:avoid}
  thead{display:table-header-group}
  td,th{padding:3pt 5pt}
  a{color:#000}
  pre{white-space:pre-wrap;font-size:9pt;line-height:1.3;margin:7pt 0;padding:7pt}
  .source{font-size:8pt}

  body[data-mode="tonight"] header,
  body[data-mode="tonight"] [data-packet="full"],
  body[data-mode="tonight"] .source,
  body[data-mode="tonight"] #docs-QUICKSTART-md--campaign-starter-purchases,
  body[data-mode="tonight"] #docs-QUICKSTART-md--campaign-starter-purchases + p{display:none}
  body[data-mode="tonight"] article:first-child{break-before:auto}
  body[data-mode="tonight"] #docs-sheets-river_decision_card-md > table:first-of-type{break-inside:avoid}
  body[data-mode="tonight"] #docs-sheets-river_decision_card-md--trailmaster-reference,
  body[data-mode="tonight"] .pregen-sheet + .pregen-sheet{
    break-before:page;margin-top:0
  }
  body[data-mode="tonight"] .pregen-sheet > h2:first-child{margin-top:0}
  body[data-mode="tonight"] .pregen-record{display:block;margin-top:12pt}
  #docs-sheets-character_sheet-md table:first-of-type{table-layout:fixed}
  .pregen-record td,
  #docs-sheets-character_sheet-md td,
  #docs-sheets-playtest_observer-md td{height:20pt}
  #docs-sheets-playtest_observer-md td:last-child{width:64%}
  #docs-sheets-travel_procedure-md th:first-child{width:14%}
  #docs-sheets-river_decision_card-md > p{break-inside:avoid}
  body[data-mode="tonight"] #docs-QUICKSTART-md{line-height:1.25}
  :is(#docs-QUICKSTART-md,#docs-sheets-travel_procedure-md,#docs-sheets-playtest_observer-md) h2{margin-top:7pt}
  :is(#docs-QUICKSTART-md,#docs-sheets-travel_procedure-md,#docs-sheets-playtest_observer-md) p{margin-bottom:4pt}
  :is(#docs-QUICKSTART-md,#docs-sheets-travel_procedure-md,#docs-sheets-playtest_observer-md) table{margin:4pt 0 6pt}
  :is(#docs-QUICKSTART-md,#docs-sheets-travel_procedure-md) :is(td,th){padding-block:2pt}
}
'''
out = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Oregon Trail RPG — Playtest Handbook v0.10</title><style>'+css+'</style></head><body>'
out += '<a class="skip" href="#reading">Skip to handbook</a><header><p class="kicker">Oregon Trail RPG · v0.10 · Playtest edition</p><h1>Five people. One wagon.<br>Promises worth carrying.</h1><p>A complete local play packet. Start at the river, then follow the journey west. The design aims for memorable decisions; human playtesting is still pending.</p><div class="actions"><button type="button" id="tonight" aria-pressed="false">Play tonight</button><a href="#docs-sheets-river_decision_card-md">River decision card</a><a href="#docs-RIVER_CHAPTER-md">Play the river chapter</a><a href="#docs-PREGENS-md">Meet the five travelers</a><button type="button" id="complete" aria-pressed="true">Complete handbook</button><button type="button" onclick="window.print()">Print selected packet / save PDF</button></div><p id="selection-status" role="status">Complete handbook selected. Print includes all sections, including development records.</p></header>'
out += '<div class="layout"><nav aria-label="Handbook sections">'+''.join(nav)+'</nav><main id="reading" tabindex="-1">'+''.join(sections)+'</main></div><footer>Generated from the Markdown packet. No network requests, accounts, or data collection. Rebuild with python3 tools/build_handbook.py.</footer></body></html>'
# An out-of-packet reference is visible on screen while the short print selection stays active.
script = """<script>
const tonight=document.getElementById('tonight');
const complete=document.getElementById('complete');
const selectionStatus=document.getElementById('selection-status');
let screenReference=null;
function setMode(mode){
  document.body.dataset.mode=mode;
  tonight.setAttribute('aria-pressed',String(mode==='tonight'));
  complete.setAttribute('aria-pressed',String(mode==='full'));
  revealHash();
}
function revealHash(){
  let fragment=location.hash.slice(1);
  try{fragment=decodeURIComponent(fragment);}catch{}
  const shortPacket=document.body.dataset.mode==='tonight';
  const target=document.getElementById(fragment);
  const article=target?.closest('article');
  const reference=shortPacket&&article?.dataset.packet==='full'?article:null;
  if(reference!==screenReference){
    screenReference?.removeAttribute('data-reference');
    screenReference=reference;
    screenReference?.setAttribute('data-reference','');
  }
  if(reference)target.scrollIntoView();
  const message=shortPacket
    ?(reference?'Reference open on screen. Printing still uses Play tonight.':'Play tonight selected. Print includes the river adventure, decision card, travelers, table sheets, and playtest notes.')
    :'Complete handbook selected. Print includes all sections, including development records.';
  if(selectionStatus.textContent!==message)selectionStatus.textContent=message;
}
tonight.onclick=()=>{location.hash='tonight';setMode('tonight');};
complete.onclick=()=>{location.hash='complete';setMode('full');};
window.addEventListener('hashchange',()=>{
  if(location.hash==='#tonight')setMode('tonight');
  else if(location.hash==='#complete')setMode('full');
  else revealHash();
});
setMode(location.hash==='#tonight'?'tonight':'full');
</script>"""
out = out.replace('</body>', script + '</body>')
destination = ROOT / 'docs/handbook.html'
destination.write_text(out)
print(f'Built {destination}: {len(ORDER)} sections, {len(out):,} characters')
