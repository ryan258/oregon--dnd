#!/usr/bin/env python3
"""Package static player files only. Never includes browser character saves."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
FILES=['index.html','styles.css','rules.js','model.js','storage.js','app.js','sw.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','README.md']
out=ROOT/'dist/oregon-trail-player.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out,'w',compression=ZIP_DEFLATED) as archive:
    for name in FILES: archive.write(ROOT/'player'/name,name)
    archive.write(ROOT/'docs/PLAYER_APP.md','PLAYER_APP.md')
print(f'Packaged {len(FILES)+1} files: {out}')
