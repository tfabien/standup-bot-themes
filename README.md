# Standup Bot Themes

Marketplace themes for standup-bot.

| Preview | Label | Description | Keywords | Version |
|---|---|---|---|---|
| ![Cat Cozy](cat-cozy/preview.png) | Cat Cozy | Soft, rounded cats in a cozy illustrated style. | cat, cozy, soft, 3d | 1.0.0 |
| ![Cat Line](cat-line/preview.png) | Cat Line | Simple outlined cats with restrained purple accents. | cat, line, minimal | 1.0.0 |
| ![Cat Minimal](cat-minimal/preview.png) | Cat Minimal | Clean, expressive cat illustrations with simplified shapes. | cat, minimal, vector | 1.0.0 |
| ![Cat Pixel](cat-pixel/preview.png) | Cat Pixel | Retro pixel-art cats with playful accessories. | cat, pixel, retro | 1.0.0 |
| ![Cat](cat/preview.png) | Cat | Expressive cats with warm colors and role-specific accessories. | cat, animals, cozy | 1.0.0 |
| ![Cozy Farm](cozy-farm/preview.png) | Cozy Farm | Friendly pixel-art villagers and farm animals in a sunny countryside. | farm, cozy, pixel | 1.0.0 |
| ![Default / Robot](robot/preview.png) | Default / Robot | Pixel-art robot assistants with glowing screens and role-specific gear. | robot, pixel, technology | 1.0.0 |
| ![Fantasy RPG](fantasy-rpg/preview.png) | Fantasy RPG | Pixel-art fantasy adventurers, mages and guild characters. | fantasy, rpg, pixel | 1.0.0 |
| ![Insect Kingdom](insect-kingdom/preview.png) | Insect Kingdom | Tiny insect adventurers from a glowing underground kingdom. | insects, fantasy, pixel | 1.0.0 |
| ![Lemmings](lemmings/preview.png) | Lemmings | Retro pixel-art lemmings with distinct role accessories. | lemmings, retro, pixel | 1.0.0 |
| ![Noël · Atelier du Père Noël](noel/preview.png) | Noël · Atelier du Père Noël | Festive pixel-art characters from Santa’s snowy workshop. | christmas, winter, pixel | 1.0.0 |
| ![Office Line](office-line/preview.png) | Office Line | Friendly office workers drawn with simple lines and orange accents. | office, line, minimal | 1.0.0 |
| ![Office Minimal](office-minimal/preview.png) | Office Minimal | Minimal vector-style office characters with clear silhouettes. | office, minimal, vector | 1.0.0 |
| ![Office Modern](office-modern/preview.png) | Office Modern | Soft illustrated office characters in a contemporary workspace. | office, modern, soft | 1.0.0 |
| ![Office Retro](office-retro/preview.png) | Office Retro | Retro pixel-art office workers inspired by early computers. | office, retro, pixel | 1.0.0 |
| ![Office](office/preview.png) | Office | Office-themed characters with workplace accessories. | office, work, pixel | 1.0.0 |
| ![Pirates](pirates/preview.png) | Pirates | A colorful pixel-art pirate crew with nautical accessories. | pirates, adventure, pixel | 1.0.0 |
| ![Robot · Clean Tech](robot-clean-tech/preview.png) | Robot · Clean Tech | Rounded, polished tech robots in white with cyan highlights. | robot, clean, 3d | 1.0.0 |
| ![Robot Line](robot-line/preview.png) | Robot Line | Outline-style robot mascots with minimal blue accents. | robot, line, minimal | 1.0.0 |
| ![Robot · Minimal](robot-minimal/preview.png) | Robot · Minimal | Simple robot illustrations with high-contrast shapes. | robot, minimal, vector | 1.0.0 |
| ![Robot · Retro Future](robot-retro-future/preview.png) | Robot · Retro Future | Arcade-style pixel robots with cyan and orange highlights. | robot, retro, pixel | 1.0.0 |
| ![Spelunky](spelunky/preview.png) | Spelunky | Pixel-art cave explorers equipped for underground adventures. | spelunky, caves, pixel | 1.0.0 |
| ![Yokai](yokai/preview.png) | Yokai | Japanese folklore spirits and creatures in colorful pixel art. | yokai, japan, pixel | 1.0.0 |

## Layout

```text
<name>/theme.json
<name>/preview.png          # optional: png, webp, jpg or gif
<name>/icons/<role>[-N][-blink].<png|webp|gif|jpg|svg>
```

Each theme has its own `icons/` directory. The `name` in `theme.json` must match its folder. Use lowercase names, 3–8 keywords, and a dotted numeric version. Preserve theme color keys and use `node tools/check.mjs` before submitting changes.
