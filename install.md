# Install and create themes

## Install from the Marketplace

Open the Standup Bot page, choose **Theme**, then open the **Marketplace** tab. The default source is `tfabien/standup-bot-themes`.

The local API can also install a theme directly:

```bash
curl -X POST http://127.0.0.1:8765/market/install \
  -H 'Content-Type: application/json' \
  -d '{"source":"tfabien/standup-bot-themes","name":"fantasy-rpg"}'
```

## Create a theme

Create `<name>/theme.json`, `<name>/icons/`, and an optional preview. The `name` must match the folder. Provide at least one icon for each role: `lead`, `general`, `explore`, `plan`, `review`, `test`, `code`, and `generic`.

Supported icon formats are PNG, lossless WebP, JPG, GIF, and SVG. Alternate sprites use `-2` through `-99`; blink frames add `-blink`.

### Interface variants

Add named entries under `variants` to override interface colors or the accent. Variants inherit unspecified values from the base theme.

### Character looks

Add named entries under `looks`, then list the suggested choices in `defaultLooks`.

- `sprite: 2` selects the `-2` role sprites.
- `palette: "hair-blond"` applies an exact raster palette declared in `icons/pack.json`.
- SVG themes can expose accent colors when their tintable paths use `currentColor` and the pack declares `{"tint":"svg"}`.

Keep `icons/pack.json` small and limited to rendering metadata. Run `node tools/check.mjs` before opening a pull request. See [docs/format.md](docs/format.md) for the complete reference.
