#!/usr/bin/env python3
"""Bounded document checks. Does not assert game balance or human acceptance."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
from html.parser import HTMLParser
import re
import sys
from markdown_it import MarkdownIt
ROOT=Path(__file__).resolve().parents[1]
md=MarkdownIt('commonmark').enable('table')
errors=[]
files=sorted([*ROOT.glob('*.md'), *ROOT.glob('docs/**/*.md')])
links=0
for p in files:
    raw=p.read_text()
    if not raw.endswith('\n'): errors.append(f'{p.name}: missing final newline')
    if any(line.rstrip()!=line for line in raw.splitlines()): errors.append(f'{p.name}: trailing whitespace')
    tokens=md.parse(raw)
    for token in tokens:
        for child in token.children or []:
            if child.type!='link_open': continue
            href=child.attrGet('href') or ''
            if urlsplit(href).scheme or href.startswith('#'): continue
            target=(p.parent/unquote(href.split('#')[0])).resolve()
            links+=1
            if not target.is_file(): errors.append(f'{p.relative_to(ROOT)}: broken link {href}')
    # Count table cells using parser tokens rather than naive pipe splitting.
    expected=None; cells=None
    for t in tokens:
        if t.type=='table_open': expected=None
        if t.type=='tr_open': cells=0
        if t.type in ('th_open','td_open'): cells+=1
        if t.type=='tr_close':
            if expected is None: expected=cells
            elif cells!=expected: errors.append(f'{p.name}: uneven table row')

class Handbook(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.local=[]; self.articles=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='article': self.articles+=1
        if tag=='a':
            h=a.get('href','')
            if h.startswith('#'): self.refs.append(h[1:])
            elif h and not urlsplit(h).scheme: self.local.append(h)
html=Handbook(); html.feed((ROOT/'docs/handbook.html').read_text())
if len(html.ids)!=len(set(html.ids)): errors.append('handbook duplicate IDs')
for h in html.refs:
    if h not in html.ids: errors.append(f'handbook missing anchor: {h}')
for h in html.local:
    if not (ROOT/'docs'/h).resolve().exists(): errors.append(f'handbook unresolved local link: {h}')
# Verify the actual stated starting quantities, not an independent fixture.
core=(ROOT/'seed.md').read_text()
rows=re.findall(r'^\| (?:Cured food|Ox teams|Medicine|Spare parts|Ammunition|Extra water barrels|Warm Bedding) \| (.*?) \| (.*?) \| (.*?) \|$',core,re.M)
assert len(rows)==7, 'starter purchase rows missing'
total=0
for qty,unit,stated in rows:
    q=float(re.search(r'[\d.]+',qty).group()); u=float(re.search(r'[\d.]+',unit).group()); s=float(re.search(r'[\d.]+',stated).group())
    if abs(q*u-s)>0.001: errors.append(f'starter arithmetic {qty} × {unit} != {stated}')
    total+=s
if total!=550 or 800-total!=250: errors.append('starter total / remainder mismatch')
pre=(ROOT/'docs/PREGENS.md').read_text()
arrays=re.findall(r'^\| (\d+) \(([+−-]\d+)\) \| (\d+) \(([+−-]\d+)\) \| (\d+) \(([+−-]\d+)\) \| (\d+) \(([+−-]\d+)\) \| (\d+) \(([+−-]\d+)\) \| (\d+) \(([+−-]\d+)\) \| (\d+)/(\d+) \|$',pre,re.M)
if len(arrays)!=4: errors.append(f'expected4 pregen arrays, got {len(arrays)}')
for row in arrays:
    scores=list(map(int,row[:12:2])); mods=[int(x.replace('−','-')) for x in row[1:12:2]]
    if sorted(scores)!=[8,10,10,12,13,15]: errors.append('pregen array mismatch')
    if mods!=[(s-10)//2 for s in scores]: errors.append('pregen modifier mismatch')
    if int(row[12])!=8+mods[2] or row[12]!=row[13]: errors.append('pregen HP mismatch')
events=(ROOT/'01_events_and_hazards.md').read_text()
blocks=re.split(r'^## [1-7] — ',events,flags=re.M)[1:]
if len(blocks)!=7: errors.append('expected7 chapter event blocks')
for n,b in enumerate(blocks,1):
    rolls=re.findall(r'^\| ([1-6]) \|',b,re.M)
    if rolls!=list('123456'): errors.append(f'chapter{n} event roll coverage {rolls}')
print(f'{len(files)} Markdown files; {links} local links; {html.articles} handbook sections; {len(html.refs)} handbook anchors; 4 pregens; 42 events; starter budget $550/$250.')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('PASS: bounded structure and printed arithmetic checks. No playtest/balance claim.')
