import sharp from 'sharp';
import { readdir, writeFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const imgDir = path.join(root, 'src/assets/img');
const urlOf = (abs) => '/' + path.relative(path.join(root, 'src'), abs).split(path.sep).join('/');
const manifest = {};

async function originals(dir) {
  const names = (await readdir(dir)).filter((n) => n.endsWith('.webp') && !/-(160|320|480|800|1200)\.webp$/.test(n));
  return names.sort().map((n) => path.join(dir, n));
}

async function handle(file, plan) {
  const meta = await sharp(file).metadata();
  const { width: w, height: h } = meta;
  const base = file.replace(/\.[^.]+$/, '');
  const variants = [];
  for (const { suffix, resize, opts } of plan(w, h)) {
    const out = `${base}-${suffix}.webp`;
    const info = await sharp(file)
      .resize(resize)
      .webp(opts)
      .toFile(out);
    // A same-size re-encode only counts if it is smaller than the original.
    if (info.width === w && info.height === h && (await stat(out)).size >= (await stat(file)).size) {
      await unlink(out);
      continue;
    }
    variants.push({ src: urlOf(out), w: info.width, h: info.height });
  }
  variants.sort((a, b) => a.w - b.w);
  manifest[urlOf(file)] = { w, h, variants };
}

const photoOpts = { quality: 72, effort: 6 };
for (const f of await originals(path.join(imgDir, 'photos'))) {
  await handle(f, (w) => [480, 800, 1200].filter((x) => x < w).map((width) => ({ suffix: width, resize: { width, withoutEnlargement: true }, opts: photoOpts })));
}

const logoOpts = { quality: 80, effort: 6 };
for (const f of await originals(path.join(imgDir, 'logos'))) {
  await handle(f, (w, h) =>
    Math.max(w, h) <= 160
      ? []
      : [
          { suffix: 160, resize: { width: 160, height: 160, fit: 'inside', withoutEnlargement: true }, opts: logoOpts },
          { suffix: 320, resize: { width: 320, height: 320, fit: 'inside', withoutEnlargement: true }, opts: logoOpts },
        ]
  );
}

// News photos moved from WordPress (JPG and PNG): WebP copies at 480, 800 and 1200,
// plus a full-size WebP that replaces the original in srcset when it is smaller.
const wpDir = path.join(root, 'src/assets/wp');
const wpOpts = { quality: 80, effort: 6 };
for (const f of (await readdir(wpDir)).filter((n) => /\.(jpe?g|png)$/i.test(n)).sort().map((n) => path.join(wpDir, n))) {
  await handle(f, (w) => [
    ...[480, 800, 1200].filter((x) => x < w).map((width) => ({ suffix: width, resize: { width, withoutEnlargement: true }, opts: wpOpts })),
    { suffix: 'full', resize: { width: w }, opts: wpOpts },
  ]);
}

for (const name of ['pnworca-logo-white', 'pnworca-logo-ink']) {
  const file = path.join(imgDir, `${name}.png`);
  const meta = await sharp(file).metadata();
  const out = path.join(imgDir, `${name}-420.webp`);
  const info = await sharp(file)
    .resize({ width: 420, withoutEnlargement: true })
    .webp({ lossless: false, quality: 85, alphaQuality: 100 })
    .toFile(out);
  manifest[urlOf(file)] = { w: meta.width, h: meta.height, variants: [{ src: urlOf(out), w: info.width, h: info.height }] };
}

const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
await writeFile(path.join(root, 'src/_data/images.json'), JSON.stringify(sorted, null, 2) + '\n');
console.log(`Handled ${Object.keys(sorted).length} originals`);
