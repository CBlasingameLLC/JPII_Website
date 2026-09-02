/**
 * Turns the staff portraits into matched circular-card images.
 *
 * Different problem from the leadership set, so this is a separate script
 * rather than another entry in that one: staff photos render inside
 * `rounded-full` circles, not 4:5 cards, so the output is square and the face
 * has to sit centred in the *inscribed* circle. The two sources also have
 * nothing in common — a 300x300 studio headshot and a 4284x5712 phone portrait
 * shot outdoors — where the leadership set was at least one photoshoot.
 *
 * Re-runnable and non-destructive: sources are never modified.
 *
 * Usage:
 *   npm run photos:staff
 *   npm run photos:staff -- "D:/some/other/folder"
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const DEFAULT_SRC = "C:/Users/19035/Documents/jp2 staff";
const SRC_DIR = process.argv[2] || DEFAULT_SRC;
const OUT_DIR = path.join(process.cwd(), "public", "staff");

/**
 * 300px square. This is not a design choice — it is the ceiling of the worst
 * source. Father's headshot is supplied at 300x300, and upscaling past that
 * invents detail rather than adding it. The cards render at 140px, so 300
 * covers a 2x display with a little headroom and falls slightly soft at 3x.
 * Raise this the day a larger headshot of Father exists; Erin's frame has
 * resolution to spare either way.
 */
const OUT = 300;

/**
 * Crop windows in source pixels, measured off a percentage-grid overlay of
 * each photo rather than estimated by eye.
 *
 * Read from that grid — Father: hair top 8%, eyes 33%, chin 63%, face centre
 * x≈47.5%, head spanning 55% of frame height. Erin: hair top 24%, eyes 41%,
 * chin 55%, face centre x≈52.5%, head spanning 31%.
 *
 * Erin's window is sized and placed so her eyes land on the same line as his,
 * at 33% down the circle, with her face filling a matching share of the width.
 *
 * Both numbers are corrections, not first guesses. Sizing off her head outline
 * put her eyes at 38% — visibly lower than his in a side-by-side circle — and
 * left her face slightly small, because the sunglasses parked on her head read
 * as hairline and inflated the outline. Eyes and face width are the landmarks
 * that actually survive that; the window was re-derived from those and checked
 * against a rendered pair rather than against the source.
 *
 * The crop also lands entirely on fence: the sky and autumn leaves along the
 * top of her frame end by 13%, well above the window, so her backdrop and his
 * are both plain and muted before grading even starts.
 *
 * `null` means use the whole frame.
 */
const SUBJECTS = [
  { file: "Priest2025-Chabarria-300x300.JPEG", slug: "steven", crop: null },
  { file: "erin.JPEG", slug: "erin", crop: { left: 761, top: 1385, width: 2900, height: 2900 } },
  { file: "frhank.jpg", slug: "hank", crop: null },
];

/** Whichever subject the others are graded toward. */
const REFERENCE_SLUG = "steven";

/**
 * Mean luminance and mean saturation of a crop, on the finished framing rather
 * than the source, so the numbers describe what actually reaches the card.
 * HSL-style saturation, averaged over pixels — bright outdoor frames read high
 * here and flat studio ones read low, which is exactly the gap being closed.
 */
async function measureTone(pipeline) {
  const { data, info } = await pipeline
    .clone()
    .resize(160, 160, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = info.width * info.height;
  let lum = 0;
  let sat = 0;
  for (let i = 0; i < px; i++) {
    const r = data[i * info.channels] / 255;
    const g = data[i * info.channels + 1] / 255;
    const b = data[i * info.channels + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    lum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sat += max === min ? 0 : (max - min) / (l > 0.5 ? 2 - max - min : max + min);
  }
  return { lum: lum / px, sat: sat / px };
}

function windowFor(subject, meta) {
  if (subject.crop) return subject.crop;
  const side = Math.min(meta.width, meta.height);
  return {
    left: Math.round((meta.width - side) / 2),
    top: Math.round((meta.height - side) / 2),
    width: side,
    height: side,
  };
}

/** Keeps a computed grade mild enough that skin tone survives it. */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const framed = [];
  for (const subject of SUBJECTS) {
    const src = path.join(SRC_DIR, subject.file);
    if (!existsSync(src)) {
      console.warn(`  skip  ${subject.slug.padEnd(8)} (missing ${subject.file})`);
      continue;
    }
    const meta = await sharp(src).metadata();
    const region = windowFor(subject, meta);
    const pipeline = sharp(src).extract(region);
    framed.push({ ...subject, src, region, pipeline, tone: await measureTone(pipeline) });
  }

  const reference = framed.find((f) => f.slug === REFERENCE_SLUG) ?? framed[0];
  if (!reference) {
    console.error("No source images found.");
    process.exit(1);
  }

  for (const subject of framed) {
    // Grade toward the reference rather than to fixed constants, so replacing
    // either photo re-derives the match instead of needing new magic numbers.
    const isRef = subject.slug === reference.slug;
    const brightness = isRef ? 1 : clamp(reference.tone.lum / subject.tone.lum, 0.82, 1.18);
    const saturation = isRef ? 1 : clamp(reference.tone.sat / subject.tone.sat, 0.55, 1.45);

    await subject.pipeline
      .clone()
      .resize(OUT, OUT, { fit: "cover" })
      .modulate({ brightness, saturation })
      .webp({ quality: 88 })
      .toFile(path.join(OUT_DIR, `${subject.slug}.webp`));

    console.log(
      `  ok    ${subject.slug.padEnd(8)} ${subject.region.width}x${subject.region.height}` +
        ` -> ${OUT}x${OUT}   lum=${subject.tone.lum.toFixed(3)} sat=${subject.tone.sat.toFixed(3)}` +
        `   bright=${brightness.toFixed(3)} sat=${saturation.toFixed(3)}`
    );
  }
}

main();
