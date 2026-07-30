/**
 * One-time (re-runnable) generation of the PWA icon set from the brand
 * handoff's favicon.svg (navy rounded square, gold cross). Run again if the
 * favicon source changes: `node scripts/generate-pwa-icons.mjs`.
 * Outputs to public/icons/, referenced from src/app/manifest.ts.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const CROSS_PATH =
  "M38,6 L62,6 L58,18 L58,40 L80,40 L92,34 L92,62 L80,56 L58,56 L58,124 L64,136 L36,136 L42,124 L42,56 L20,56 L8,62 L8,34 L20,40 L42,40 L42,18 Z";

const STANDARD_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#003876"/>
  <g transform="translate(19.2,10) scale(0.2535)"><path d="${CROSS_PATH}" fill="#E7C877"/></g>
</svg>`.trim();

// Full-bleed, no rounded corners, cross kept well within the ~80% maskable safe zone
// so OS-applied circle/squircle masks never clip it.
const MASKABLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#003876"/>
  <g transform="translate(21.9,16.4) scale(0.22)"><path d="${CROSS_PATH}" fill="#E7C877"/></g>
</svg>`.trim();

async function render(svg, size, outFile) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png()
    .toFile(outFile);
  console.log(`Wrote ${outFile}`);
}

async function main() {
  const outDir = path.join(process.cwd(), "public/icons");
  await mkdir(outDir, { recursive: true });

  await render(STANDARD_SVG, 192, path.join(outDir, "icon-192.png"));
  await render(STANDARD_SVG, 512, path.join(outDir, "icon-512.png"));
  await render(MASKABLE_SVG, 192, path.join(outDir, "icon-maskable-192.png"));
  await render(MASKABLE_SVG, 512, path.join(outDir, "icon-maskable-512.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
