# Standup Bot Themes

A focused Marketplace collection for Standup Bot. Each core theme is polished for small screens and demonstrates a different rendering capability.

| Preview | Theme | Format | Showcase |
|---|---|---|---|
| ![Robot](robot/preview.png) | **Robot** | PNG sprites | Default pixel-art experience |
| ![Robot Line](robot-line/preview.png) | **Robot Line** | SVG | Runtime accent tint and color variants |
| ![Office](office/preview.png) | **Office** | Lossless WebP | Localized hair palette swaps |
| ![Office Retro](office-retro/preview.png) | **Office Retro** | PNG sprites | Retro pixel-art alternative |
| ![Cat Minimal](cat-minimal/preview.png) | **Cat Minimal** | PNG sprites | Three complete, small-screen cat looks |
| ![Fantasy RPG](fantasy-rpg/preview.png) | **Fantasy RPG** | PNG sprites | Five genuinely different character teams |

## Theme capabilities

- **Variants** change interface colors and, when supported, the theme accent.
- **Looks** change character rendering independently of the interface variant.
- **SVG tint** uses `currentColor` with `icons/pack.json`.
- **Palette swaps** replace exact raster colors defined in `icons/pack.json`.
- **Sprite looks** select complete alternate role sprites through `look.sprite`.

## Repository layout

```text
<theme>/theme.json
<theme>/preview.png
<theme>/icons/pack.json                    # optional rendering metadata
<theme>/icons/<role>[-N][-blink].<format>
archive/                                   # preserved, not published
```

The active roles are `lead`, `general`, `explore`, `plan`, `review`, `test`, `code`, and `generic`. The `archive/` directory preserves former themes and source assets but is excluded from Marketplace validation.

Run the collection checker before submitting changes:

```bash
node tools/check.mjs
```

See [install.md](install.md) for installation notes and [docs/format.md](docs/format.md) for the full theme, icon pack, looks, accent, and palette-swap format.
