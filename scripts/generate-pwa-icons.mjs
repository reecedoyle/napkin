#!/usr/bin/env node
/**
 * Generates PWA icon PNGs in public/ from a single in-memory SVG. Run once
 * (or whenever the icon design changes); commit the resulting PNGs.
 *
 *   node scripts/generate-pwa-icons.mjs
 *
 * Outputs:
 *   public/pwa-192.png            (192×192, purpose="any")
 *   public/pwa-512.png            (512×512, purpose="any")
 *   public/pwa-512-maskable.png   (512×512, purpose="maskable", with safe-area padding)
 *   public/apple-touch-icon.png   (180×180, for iOS home-screen)
 *   public/favicon.svg            (vector, for the desktop tab)
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PUBLIC = resolve(import.meta.dirname, '..', 'public');

const BG = '#1c1917'; // stone-900
const FG = '#fafaf9'; // stone-50
const ACCENT = '#d97706'; // amber-600

function iconSvg({ size, safeArea }) {
  // safeArea = how much margin to leave around the glyph as a fraction (0–0.5).
  // Maskable icons need ~10% safe area on each side so the OS can mask the
  // edges into a circle/squircle without clipping the glyph.
  const pad = Math.round(size * safeArea);
  const inner = size - pad * 2;
  const fontSize = Math.round(inner * 0.74);
  const stripe = Math.max(2, Math.round(size * 0.012));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${BG}"/>
    <rect x="${pad}" y="${size - pad - stripe}" width="${inner}" height="${stripe}" fill="${ACCENT}"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
          font-family="Georgia, 'Times New Roman', serif" font-weight="700"
          font-size="${fontSize}" fill="${FG}">N</text>
  </svg>`;
}

async function renderPng(svg, outPath) {
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`  ${outPath}`);
}

const tasks = [
  { name: 'pwa-192.png', size: 192, safeArea: 0 },
  { name: 'pwa-512.png', size: 512, safeArea: 0 },
  { name: 'pwa-512-maskable.png', size: 512, safeArea: 0.1 },
  { name: 'apple-touch-icon.png', size: 180, safeArea: 0 },
];

console.log('Generating PWA icons in public/');
for (const t of tasks) {
  await renderPng(iconSvg(t), resolve(PUBLIC, t.name));
}

// Bonus: a vector favicon for the tab. No safe-area concern.
await writeFile(resolve(PUBLIC, 'favicon.svg'), iconSvg({ size: 64, safeArea: 0 }));
console.log(`  ${resolve(PUBLIC, 'favicon.svg')}`);
console.log('Done.');
