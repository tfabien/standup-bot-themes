# Install or create standup-bot themes

> **For Claude Code.** A user asked you to install themes, or to create one, and pointed you to this file. Follow the steps in order, run the commands yourself, check each result and report at the end. Do not edit the user's settings files. Stop and tell the user when a step fails.

The hub of standup-bot reads themes from `~/.claude/standup-bot/` (on Windows `%USERPROFILE%\.claude\standup-bot\`). Nothing else needs installing: no restart, no plugin.

```
~/.claude/standup-bot/themes/<name>.json
~/.claude/standup-bot/icons/<pack>/<role>[-blink].<svg|png|webp|gif|jpg>
```

## Install

1. Check that standup-bot is installed and the hub runs. The reply must be `{"ok":true}`; if not, follow https://github.com/tfabien/standup-bot/blob/main/INSTALL.md first.

   ```bash
   curl -s http://127.0.0.1:8765/health
   ```

2. Download this repository to a temporary folder.

   ```bash
   git clone --depth 1 https://github.com/tfabien/standup-bot-themes.git "$TMPDIR/standup-bot-themes"
   ```

   `$TMPDIR` is any empty temporary folder. Without git, download and unzip `https://github.com/tfabien/standup-bot-themes/archive/refs/heads/main.zip`.

3. Ask the user which themes they want (the table in `README.md`), or all of them. For each chosen `<name>`, read `themes/<name>.json`, take its `iconPack`, and copy both:

   ```bash
   DEST="$HOME/.claude/standup-bot"
   mkdir -p "$DEST/themes" "$DEST/icons"
   cp "$TMPDIR/standup-bot-themes/themes/<name>.json" "$DEST/themes/"
   cp -r "$TMPDIR/standup-bot-themes/icons/<pack>" "$DEST/icons/"
   ```

   A file with the same name in the destination is replaced: say so before overwriting a theme the user made themselves (compare `author`).

4. Reload the hub catalog and check the result. `errors` must be empty and the new themes must be listed.

   ```bash
   curl -s -X POST http://127.0.0.1:8765/reload
   curl -s http://127.0.0.1:8765/state | node -e "const s=JSON.parse(require('fs').readFileSync(0,'utf8')).catalog;console.log(s.themes.map(t=>t.name).join(' '),'| errors:',JSON.stringify(s.errors))"
   ```

5. Tell the user to open the palette button of the bottom bar of http://127.0.0.1:8765/ and pick the theme.

Update: repeat steps 2 to 4. Remove: delete `~/.claude/standup-bot/themes/<name>.json` and `~/.claude/standup-bot/icons/<pack>/`, then reload.

## Create a theme

Ask the user for the look they want, then write the two parts below into `~/.claude/standup-bot/` (or into a clone of this repository to share the theme). Reload as in step 4 and check `errors`.

### Theme file: `themes/<name>.json`

```json
{ "name": "cat", "label": "Cat", "author": "me", "version": "1", "iconPack": "cat",
  "colors": { "FRAME": "#6b4630", "TEXT": "#fbeedd" } }
```

- `name`: required, 1 to 32 characters among `a-z`, `0-9`, `-`. It must equal the file name without `.json`.
- `label`, `author`, `version`: optional text. `label` defaults to `name`.
- `colors`: required object. Keys among `SCREEN BAR FRAME PANEL ROW TEXT LIGHT FAINT WORKING NEEDS ERROR YOURTURN WAITING ACCENT CHIP ACCENT_DIM NEEDS_DIM`, values `#rrggbb`. A missing or invalid key keeps the `default` color, so give them all for a full theme. Keep `TEXT` readable on `PANEL` and `ROW`, and `NEEDS` (orange), `ERROR` (red) and `WORKING` (green) distinct from each other.
- `iconPack`: the name of an icon pack (same character rules as `name`). Missing or malformed gives `robot`.
- A file over 256 KB, invalid JSON, a bad `name` or a missing `colors` object is skipped. The hub lists the reason in `errors` of the catalog.

### Icon pack: `icons/<pack>/`

- Folder name: 1 to 32 characters among `a-z`, `0-9`, `-`.
- Eight roles: `lead general explore plan review test code generic`. One image per role, named `<role>.<ext>` with `ext` among `svg png webp gif jpg`. Other file names are ignored. A missing role falls back to the `robot` pack.
- `<role>-blink.<ext>` is optional: the frame shown while the agent blinks. Without it the plain icon stays.
- Several characters for one role: `explore.png`, `explore-2.png`, `explore-3.png` (up to `-99`), each with an optional `explore-2-blink.png`. The agent id picks the variant, so one agent always looks the same.
- When a role has several files the order is svg, png, webp, gif, jpg: the first one wins.
- Size limits: SVG 256 KB, raster 1 MB per file.
- Raster: draw at 72x84 or 108x126 pixels (2x or 3x the 36x42 box), transparent background. SVG: `viewBox="0 0 36 42"`. The page scales every icon, so size and blink timing are the same for every pack.
- An animated `.gif` or `.webp` plays on browsers with `ImageDecoder` (Chrome, Edge). Elsewhere the first frame shows.
- A pack with no valid file is not listed.

### Check

```bash
curl -s -X POST http://127.0.0.1:8765/reload
```

Then read `catalog.errors` as in step 4. Show the theme on the page and ask the user if the eight roles are readable on the panel color.
