#!/usr/bin/env python3
"""Verify local Hugo output links, fragments, mounted assets, and character source reuse."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[2]
SITE = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / 'dist/site'
PREFIX = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else ''

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.links = set(), []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate id: {attrs["id"]}'
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])

pages = {path: Page(path.read_text()) for path in SITE.rglob('*.html')}
assert len(pages) >= 8, 'Build the Hugo site before checking it.'
checks = 0
for source, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        local_path = url.path
        if PREFIX and local_path.startswith(PREFIX + '/'):
            local_path = local_path[len(PREFIX):]
        target = ((SITE / unquote(local_path.lstrip('/'))) if local_path.startswith('/') else (source.parent / unquote(local_path))).resolve() if local_path else source
        if target.is_dir():
            target /= 'index.html'
        assert target.exists(), f'{source.relative_to(SITE)}: missing {link}'
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f'{source.relative_to(SITE)}: missing anchor {link}'
        checks += 1
for name in ('index.html', 'app.js', 'model.js', 'storage.js', 'sw.js', 'rules.js'):
    assert (SITE / 'player' / name).read_bytes() == (ROOT / 'player' / name).read_bytes(), f'Player mount drift: {name}'
assert (SITE / 'docs/handbook.html').read_bytes() == (ROOT / 'docs/handbook.html').read_bytes()
characters = (SITE / 'characters/index.html').read_text()
for name in ('Eliza Marsh', 'Thomas Pruitt', 'Cal Marsh', 'Mae Sorensen', 'Clara Vance'):
    assert name in characters, f'Missing traveler {name}'
print(f'Site checked: {len(pages)} HTML pages, {checks} local references, matching player/handbook mounts, five travelers.')
