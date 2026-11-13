# Install themes with Claude Code

Open the standup-bot page, click the **Theme** button, then choose the **Marketplace** tab. The default source is `tfabien/standup-bot-themes`. Select a theme and install it.

Alternatively, use the local API:

```bash
curl -X POST http://127.0.0.1:8765/market/install \
  -H 'Content-Type: application/json' \
  -d '{"source":"tfabien/standup-bot-themes","name":"cat"}'
```

## Create a theme

Create `<name>/theme.json` and `<name>/icons/` at the repository root. Add an optional `<name>/preview.png` (or webp, jpg, gif). The JSON needs `name` (matching folder), `label`, a one-sentence `description` (up to 200 characters), `keywords` (3–8 lowercase words), `author`, dotted `version` (start with `1.0.0`) and unchanged `colors` keys. Do not add `iconPack`. Provide at least one icon for each role: `lead`, `general`, `explore`, `plan`, `review`, `test`, `code`, `generic`. Optional variants are `-2` to `-99`, and `-blink` variants are allowed. Run `node tools/check.mjs` before opening a PR.
