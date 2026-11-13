import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2] ?? '.');
const roles = ['lead', 'general', 'explore', 'plan', 'review', 'test', 'code', 'generic'];
const iconPattern = /^(lead|general|explore|plan|review|test|code|generic)(?:-([2-9]|[1-9][0-9]))?(?:-blink)?\.(png|webp|gif|jpg|svg)$/;
const namePattern = /^[a-z0-9-]{1,32}$/;
const hexPattern = /^#[0-9a-f]{6}$/i;
const colorKeys = new Set(['SCREEN', 'BAR', 'FRAME', 'PANEL', 'ROW', 'TEXT', 'LIGHT', 'FAINT', 'WORKING', 'NEEDS', 'ERROR', 'YOURTURN', 'WAITING', 'ACCENT', 'CHIP', 'ACCENT_DIM', 'NEEDS_DIM']);
const fail = [];
let count = 0;

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255].reduce((sum, value, index) => {
    const channel = value / 255;
    const linear = channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return sum + [0.2126, 0.7152, 0.0722][index] * linear;
  }, 0);
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || ['tools', 'docs', 'archive'].includes(entry.name) || entry.name.startsWith('.')) continue;
  const dir = path.join(root, entry.name);
  const jsonPath = path.join(dir, 'theme.json');
  let theme;
  try {
    const info = await stat(jsonPath);
    if (info.size > 256 * 1024) throw Error('theme.json too large');
    theme = JSON.parse(await readFile(jsonPath, 'utf8'));
  } catch (error) {
    fail.push(`${entry.name}: ${error.message}`);
    continue;
  }

  count++;
  const error = (message) => fail.push(`${entry.name}: ${message}`);
  if (!namePattern.test(entry.name) || theme.name !== entry.name) error('invalid/mismatched name');
  if (!theme.label || typeof theme.label !== 'string') error('missing label');
  if (typeof theme.description !== 'string' || !theme.description || theme.description.length > 200) error('invalid description');
  if (!Array.isArray(theme.keywords) || theme.keywords.length < 3 || theme.keywords.length > 8 || theme.keywords.some((keyword) => typeof keyword !== 'string' || !/^[a-z0-9-]{1,24}$/.test(keyword))) error('invalid keywords');
  if (typeof theme.author !== 'string' || !theme.author) error('missing author');
  if (!/^\d+(?:\.\d+)+$/.test(theme.version ?? '')) error('invalid version');
  if ('iconPack' in theme) error('iconPack forbidden');

  const validateColors = (colors, where) => {
    if (!colors || typeof colors !== 'object' || Array.isArray(colors)) {
      error(`${where}: colors must be an object`);
      return {};
    }
    for (const [key, value] of Object.entries(colors)) {
      if (!colorKeys.has(key)) error(`${where}: unknown color ${key}`);
      else if (typeof value !== 'string' || !hexPattern.test(value)) error(`${where}: invalid color ${key}`);
    }
    return colors;
  };
  const baseColors = validateColors(theme.colors, 'theme');
  if ('accent' in theme && (typeof theme.accent !== 'string' || !hexPattern.test(theme.accent))) error('invalid accent');

  const checkContrast = (colors, where) => {
    for (const background of ['PANEL', 'SCREEN']) {
      if (!hexPattern.test(colors.TEXT ?? '') || !hexPattern.test(colors[background] ?? '')) error(`${where}: TEXT and ${background} are required for contrast`);
      else {
        const ratio = contrast(colors.TEXT, colors[background]);
        if (ratio < 4.5) error(`${where}: TEXT/${background} contrast ${ratio.toFixed(2)} is below 4.5`);
      }
    }
  };
  checkContrast(baseColors, 'theme');

  const variants = theme.variants ?? {};
  if (!variants || typeof variants !== 'object' || Array.isArray(variants)) error('variants must be an object');
  else {
    if (Object.keys(variants).length > 12) error('more than 12 variants');
    for (const [key, variant] of Object.entries(variants)) {
      if (!namePattern.test(key)) error(`invalid variant key ${key}`);
      if (!variant || typeof variant !== 'object' || Array.isArray(variant)) { error(`variant ${key} must be an object`); continue; }
      const colors = validateColors(variant.colors ?? {}, `variant ${key}`);
      if ('accent' in variant && (typeof variant.accent !== 'string' || !hexPattern.test(variant.accent))) error(`variant ${key}: invalid accent`);
      checkContrast({ ...baseColors, ...colors }, `variant ${key}`);
    }
  }

  const looks = theme.looks ?? {};
  if (!looks || typeof looks !== 'object' || Array.isArray(looks)) error('looks must be an object');
  else {
    if (Object.keys(looks).length > 12) error('more than 12 looks');
    for (const [key, look] of Object.entries(looks)) {
      if (!namePattern.test(key)) error(`invalid look key ${key}`);
      if (!look || typeof look !== 'object' || Array.isArray(look)) { error(`look ${key} must be an object`); continue; }
      if ('sprite' in look && (!Number.isInteger(look.sprite) || look.sprite < 1 || look.sprite > 99)) error(`look ${key}: invalid sprite`);
      if ('accent' in look && (typeof look.accent !== 'string' || !hexPattern.test(look.accent))) error(`look ${key}: invalid accent`);
      if ('palette' in look && (typeof look.palette !== 'string' || !namePattern.test(look.palette))) error(`look ${key}: invalid palette`);
    }
  }
  if ('defaultLooks' in theme && (!Array.isArray(theme.defaultLooks) || theme.defaultLooks.some((key) => typeof key !== 'string' || !(key in looks)))) error('invalid defaultLooks');

  let bytes = 0;
  let files = 0;
  const found = new Set();
  const iconsDir = path.join(dir, 'icons');
  let pack = null;
  try {
    const packPath = path.join(iconsDir, 'pack.json');
    try {
      const info = await stat(packPath);
      bytes += info.size;
      files++;
      if (info.size > 4096) error('pack.json over 4 KB');
      pack = JSON.parse(await readFile(packPath, 'utf8'));
    } catch (packError) {
      if (packError.code !== 'ENOENT') error(`pack.json: ${packError.message}`);
    }

    const paletteNames = new Set();
    if (pack) {
      if (!['svg', 'hue', 'none'].includes(pack.tint)) error('pack.json: invalid tint');
      if ('hue' in pack && (!Number.isInteger(pack.hue) || pack.hue < 0 || pack.hue > 359)) error('pack.json: invalid hue');
      if ('palettes' in pack) {
        if (!pack.palettes || typeof pack.palettes !== 'object' || Array.isArray(pack.palettes)) error('pack.json: palettes must be an object');
        else {
          if (Object.keys(pack.palettes).length > 12) error('pack.json: more than 12 palettes');
          for (const [name, map] of Object.entries(pack.palettes)) {
            paletteNames.add(name);
            if (!namePattern.test(name)) error(`pack.json: invalid palette name ${name}`);
            if (!map || typeof map !== 'object' || Array.isArray(map) || !Object.keys(map).length || Object.keys(map).length > 32) error(`pack.json: invalid palette ${name}`);
            else for (const [from, to] of Object.entries(map)) if (!hexPattern.test(from) || typeof to !== 'string' || !hexPattern.test(to)) error(`pack.json: invalid replacement in ${name}`);
          }
        }
      }
    }
    for (const look of Object.values(looks)) if (look?.palette && !paletteNames.has(look.palette)) error(`look palette ${look.palette} is missing from pack.json`);

    let svgUsesCurrentColor = false;
    for (const icon of await readdir(iconsDir, { withFileTypes: true })) {
      if (!icon.isFile() || icon.name === 'pack.json') continue;
      const file = path.join(iconsDir, icon.name);
      const info = await stat(file);
      bytes += info.size;
      files++;
      const match = iconPattern.exec(icon.name);
      if (!match) { error(`invalid icon filename ${icon.name}`); continue; }
      found.add(match[1]);
      if (icon.name.endsWith('.svg')) {
        if (info.size > 256 * 1024) error(`SVG too large ${icon.name}`);
        if ((await readFile(file, 'utf8')).includes('currentColor')) svgUsesCurrentColor = true;
      } else if (info.size > 1024 * 1024) error(`raster too large ${icon.name}`);
    }
    if (pack?.tint === 'svg' && !svgUsesCurrentColor) error('tint svg but no SVG uses currentColor');
  } catch (scanError) {
    error(scanError.message);
  }

  for (const role of roles) if (!found.has(role)) error(`missing ${role}`);
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.isDirectory()) { if (item.name !== 'icons') error(`unexpected directory ${item.name}`); continue; }
    const file = path.join(dir, item.name);
    const info = await stat(file);
    if (item.name === 'theme.json') { bytes += info.size; files++; continue; }
    if (/^preview\.(png|webp|gif|jpg)$/.test(item.name)) {
      bytes += info.size; files++;
      if (info.size > 1024 * 1024) error('preview too large');
    } else error(`unexpected file ${item.name}`);
  }
  if (files > 100) error('more than 100 files');
  if (bytes > 20 * 1024 * 1024) error('over 20 MB');
}

if (count === 0) fail.push('no themes');
if (fail.length) {
  for (const item of fail) console.error('FAIL', item);
  process.exitCode = 1;
} else console.log(`PASS ${count} marketplace themes`);
