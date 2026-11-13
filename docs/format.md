# Theme format

Reference for authors of themes and icon packs for [standup-bot](https://github.com/tfabien/standup-bot). A marketplace theme is one folder of this repository (`<name>/theme.json`, `<name>/icons/`, optional `<name>/preview.png`), see [install.md](../install.md) for installing and for the checklist when you create one. The hub reads the same format from `~/.claude/standup-bot/` for your own themes.

## Theme file

A theme is one JSON file, `themes/<name>.json`. Validation code: [`theme_schema.js`](https://github.com/tfabien/standup-bot/blob/main/plugin/hub/web/theme_schema.js) in standup-bot.

```json
{ "name": "cat", "label": "Cat", "author": "me", "version": "1", "iconPack": "cat",
  "colors": { "FRAME": "#6b4630", "TEXT": "#fbeedd" } }
```

- `name`: 1 to 32 characters among `a-z`, `0-9`, `-`.
- `label` (the title), `author`, `version`: optional text. `label` defaults to `name`.
- `description`: optional text, cut to 200 characters. `keywords`: optional list of words, at most 8, each cut to 24 characters. The marketplace shows and searches them.
- `colors`: an object with keys among `SCREEN BAR FRAME PANEL ROW TEXT LIGHT FAINT WORKING NEEDS ERROR YOURTURN WAITING ACCENT CHIP ACCENT_DIM NEEDS_DIM`, values `#rrggbb`. A missing or invalid key keeps the built-in color.
- `iconPack`: the name of an icon pack. A missing or malformed name gives `robot`.
- `accent`: optional `#rrggbb`, the color that tints the icons of packs that support it (see `pack.json` below).
- `variants`: optional object, at most 12, keyed by `a-z0-9-`. Each variant has an optional `label`, a partial `colors` object (merged over the theme colors) and an optional `accent` (falls back to the theme accent). An invalid variant, color or accent is dropped.

```json
{ "name": "cat", "iconPack": "cat", "accent": "#e8903a", "colors": { "FRAME": "#6b4630" },
  "variants": { "light": { "label": "Light", "colors": { "SCREEN": "#f6f8fa", "TEXT": "#202020" } },
                "blue": { "colors": {}, "accent": "#6e7bf2" } } }
```

The page shows one swatch per variant on the theme card (setting `themeVariant`). Order of application: theme colors, variant colors, then the edits of the user.
- A file over 256 KB, invalid JSON, a bad `name` or a missing `colors` object is skipped. The hub lists the reason in `errors` of the catalog.

## Icon pack folder

A pack is a folder `icons/<pack>/` (name: 1 to 32 characters among `a-z`, `0-9`, `-`) with one SVG per role:

```
icons/mypack/lead.svg      lead-blink.svg
             general.svg   general-blink.svg
             explore.svg   plan.svg   review.svg   test.svg   code.svg   generic.svg
```

- Roles: `lead general explore plan review test code generic`. Other file names are ignored.
- `<role>-blink.svg` is optional. It is the frame shown while the agent blinks. Without it, the plain icon stays.
- A role file can also be a `.png`, `.webp`, `.gif` or `.jpg` (`lead.png`, `plan-blink.gif`). When a role has several files, the order is png, webp, gif, jpg, svg (a picture dropped next to an older SVG replaces it). Raster files are capped at 1 MB (SVG at 256 KB). Draw them at 2x or 3x the 36x42 box (72x84 or 108x126) to stay sharp.
- Several characters for one role: add numbered files, `explore.svg`, `explore-2.png`, `explore-3.gif` (up to `-99`), each with an optional `explore-2-blink.png`. The id of the agent picks the variant (a hash of it), so one agent always looks the same and two explorers of a session usually differ. The lead of a session picks by the session id. A pack with one file per role works as before.
- An animated `.gif` or `.webp` plays on the page where the browser has `ImageDecoder` (Chrome, Edge). Elsewhere the first frame shows. Frame delays under 20 ms count as 20 ms.
- Draw in `viewBox="0 0 36 42"`. The page scales the icon, so the size and the blink timing are the same for every pack.
- A file over 256 KB is skipped. A pack with no valid file is not listed.
- A missing role file falls back to the `robot` pack for that role.

## Looks: several characters, ticked by the user

A palette variant changes the whole page and only one is active. **Looks** change how agents are drawn, and several can be active: each agent takes one of the active looks by a hash of its id (so it keeps its look), the lead of a session by the session id.

```json
{ "looks": {
    "classic": { "label": "Classic" },
    "ember":   { "label": "Ember", "accent": "#f2a33a" },
    "night":   { "label": "Night", "sprite": 2, "accent": "#6e7bf2" } },
  "defaultLooks": ["classic", "ember"] }
```

- `looks`: up to 12 entries (`a-z0-9-` keys). `label`: the chip text. `sprite`: optional integer 1 to 99, the numbered files of the pack (`1` is `lead.png`, `2` is `lead-2.png`); a role without that number draws its plain file. `accent`: optional `#rrggbb`, tints the agent through the pack's tint mode (a pack with `tint: none` ignores it). A look without `accent` uses the theme or variant accent.
- `palette`: optional name of a palette in the pack's `pack.json` (`a-z0-9-`, up to 32 characters, see "Palette swaps" below). A look without it draws the original artwork. A name the pack does not define is accepted and draws the original artwork. A look may combine `sprite`, `palette` and `accent`.
- `defaultLooks`: the looks active until the user chooses. Missing or empty: all of them. Unknown keys are dropped.
- The theme card shows a chip per look when the theme has more than one. A click turns a look on or off (the last active look stays on). The choice is the hub setting `themeLooks` (`{ "<theme>": ["<look>", ...] }`), shared by all pages. **Save as theme** keeps the active looks as `looks` and `defaultLooks` of the new theme.
- A theme without `looks` behaves as before: the hash picks among all the numbered files of each role.

## Icon accent: `pack.json`

An optional `icons/<pack>/pack.json` says how the theme `accent` tints the pack:

```json
{ "tint": "svg" }
{ "tint": "hue", "hue": 30 }
```

- `tint: "svg"`: SVG files marked with `currentColor` take the accent (strokes, fills). Use it for minimal or line packs.
- `tint: "hue"`: pictures (PNG, GIF, WebP, SVG) get a hue rotation from `hue` (the base hue of the artwork in degrees, default 0) to the hue of the accent. It changes every color of the picture, so it suits single-color artwork. It needs a browser with canvas `filter` (Chrome, Edge).
- `tint: "none"` or no file: the accent is ignored.
- The marketplace install copies `pack.json` with the icons (4 KB at most).

## Palette swaps: `pack.json` `palettes`

A look can recolor part of a raster icon (for example only the hair) without a second sprite. `pack.json` names exact-color maps, and a look picks one with `palette`:

```json
{ "tint": "none",
  "palettes": {
    "hair-blond": { "#3b241c": "#6b4b12", "#6e432b": "#b27a22", "#b77848": "#f0c45c" },
    "hair-black": { "#3b241c": "#111218", "#6e432b": "#292b35", "#b77848": "#505462" } } }
```

```json
{ "looks": { "brown": { "label": "Brown" }, "blond": { "label": "Blond", "palette": "hair-blond" } } }
```

- `palettes`: optional object, at most 12 names (`a-z0-9-`). Each palette is a non-empty object of at most 32 `"#rrggbb": "#rrggbb"` replacements (colors are lowercased). A bad palette is dropped and listed in the catalog errors, the rest of the pack still loads. `pack.json` stays under 4 KB.
- Matching is exact: a pixel changes only when its RGB equals a source color. Alpha is kept, every unmapped pixel stays as drawn. The swap runs at the image's own resolution, then the image is scaled and drawn as usual.
- Order for one agent: the look picks the numbered sprite, the palette swap applies to that image, then the `hue` tint (tint mode `hue`) applies on top.
- Use PNG or lossless WebP. Lossy compression (JPEG, lossy WebP) shifts colors by a few units, and antialiased edges blend the source color with its neighbors, so those pixels never match. Draw the recolored areas in flat colors.
- SVG files ignore palettes (use `currentColor` with `tint: svg`). Animated GIF and WebP are drawn unmodified. If the browser cannot read the pixels, the original artwork is drawn.
- Compared to the other tools: `hue` rotates every color of the picture, `currentColor` tints vector files, and a numbered `sprite` is genuinely different artwork. A palette swap changes chosen colors only.
- An uninstalled marketplace card may preview the base artwork. Installed themes draw every palette look.

## Color editor and saved themes

The **Edit colors** button of the active theme card opens an editor: one color input per color key, one for the icon accent, a live preview and a warning when the text contrast against the panel or screen background is under 4.5. Edits are stored in the hub setting `themeOverrides` (key `<theme>` or `<theme>/<variant>`), so every page follows. **Reset edits** drops them.

**Save as theme** writes the look (theme, variant and edits, flattened, without variants) to `~/.claude/standup-bot/themes/<name>.json` through `POST /themes` (`{ name, label?, theme, variant?, override?, overwrite? }`). A built-in name and a name installed from the marketplace are refused (an update would revert it). An existing user theme needs `overwrite: true` (the page asks first, the route answers 409 otherwise). The saved theme is applied and can be deleted with the Delete button.

## Marketplace source layout

One folder per theme at the root of the repository:

```
<name>/theme.json         name equal to the folder name; label, description, keywords, author, version, colors
<name>/preview.png        optional (png, webp, jpg or gif)
<name>/icons/<role>[-N][-blink].<png|webp|gif|jpg|svg>
```

`iconPack` is not written in the source: the pack is the theme's own `icons/` folder. A theme that shares images with another duplicates them. `version` is dotted numbers (`1.2.0`).
