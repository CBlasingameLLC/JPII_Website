/**
 * Turns raw leadership portraits into uniform, web-sized card images.
 *
 * The source set is not internally consistent: most frames are landscape 3:2
 * DSLR shots against grey-brown wood, but a couple are portrait 3:4 phone
 * shots against red-orange slats. Cropping alone can't reconcile that, so this
 * script does two things — a uniform 4:5 crop centred on the subject, and a
 * colour grade that pulls both backdrops toward the same muted register. The
 * off-set frames get a stronger grade (see GRADE_OVERRIDES) so they sit closer
 * to the studio set instead of reading as a different photoshoot.
 *
 * Re-runnable: drop new files in the source directory, add them to SUBJECTS,
 * and run `npm run photos:leadership`. Source images are never modified.
 *
 * Usage:
 *   npm run photos:leadership
 *   npm run photos:leadership -- "D:/some/other/folder"
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const DEFAULT_SRC = "C:/Users/19035/Documents/jp2 leadership";
const SRC_DIR = process.argv[2] || DEFAULT_SRC;
const OUT_DIR = path.join(process.cwd(), "public", "leadership");

/** Output geometry. 4:5 portrait at 2x the largest card width the grid uses. */
const OUT_W = 900;
const OUT_H = 1125;

/**
 * `file` is the source name; `slug` becomes the public filename and the key
 * student-leaders.ts refers to. Everything here is a straight file mapping —
 * names/roles live in the content module, not in the build script.
 */
const SUBJECTS = [
  { file: "alvaro.png", slug: "alvaro" },
  { file: "gabe.png", slug: "gabe" },
  { file: "sarah.png", slug: "sarah" },
  { file: "marissa.png", slug: "marissa" },
  { file: "matthew.png", slug: "matthew" },
  { file: "paul.png", slug: "paul" },
  { file: "_MG_4495 copy.png", slug: "unidentified" },
  { file: "huh_jp2.jpg", slug: "huh" },
  { file: "mary_sue_jp2.jpg", slug: "mary-sue" },
];

/**
 * Horizontal focal point as a fraction of source width, used to place the 4:5
 * window. sharp has no face detection and its `attention` strategy is drawn to
 * high-contrast shirt graphics as readily as to faces, so these are set by eye
 * against the actual frames. Vertical is handled by FOCAL_Y below.
 */
const FOCAL_X = {
  alvaro: 0.42,
  gabe: 0.44,
  sarah: 0.42,
  marissa: 0.44,
  matthew: 0.45,
  paul: 0.45,
  unidentified: 0.45,
  huh: 0.5,
  "mary-sue": 0.5,
};

/**
 * Vertical focal point. The studio frames leave a lot of headroom, so the crop
 * sits high in frame; the phone frames are already tight and need almost none.
 */
const FOCAL_Y = {
  huh: 0.42,
  "mary-sue": 0.42,
};
const DEFAULT_FOCAL_Y = 0.46;

/**
 * Tightens the crop on frames where the subject stands further from the
 * camera, so heads occupy roughly the same share of every card. The phone
 * frames need this; the studio set was shot at a consistent distance and does
 * not. Values above 1 upscale on output — fine at these modest ratios.
 */
const ZOOM = {
  huh: 1.24,
  "mary-sue": 1.24,
};

/** Baseline grade applied to every frame — a small, shared calming pass. */
const BASE_GRADE = { saturation: 0.92, brightness: 1.01, hue: 0 };

/**
 * The two phone frames are brighter, far more saturated, and shot against
 * orange slats rather than grey-brown plank. Saturation and brightness do most
 * of the convergence; the small negative hue rotation walks the backdrop off
 * orange toward the brown of the studio wall. Kept deliberately mild — pushed
 * further, skin tone goes grey before the wall finishes matching.
 */
const GRADE_OVERRIDES = {
  huh: { saturation: 0.6, brightness: 0.94, hue: -6 },
  "mary-sue": { saturation: 0.6, brightness: 0.94, hue: -6 },
};

/**
 * Crops a `targetRatio` window from the source, positioned by focal point and
 * clamped so the window never runs past an edge.
 */
function cropWindow(width, height, targetRatio, fx, fy, zoom = 1) {
  let cw = width;
  let ch = Math.round(cw / targetRatio);
  if (ch > height) {
    ch = height;
    cw = Math.round(ch * targetRatio);
  }
  cw = Math.round(cw / zoom);
  ch = Math.round(ch / zoom);
  const left = Math.max(0, Math.min(width - cw, Math.round(width * fx - cw / 2)));
  const top = Math.max(0, Math.min(height - ch, Math.round(height * fy - ch / 2)));
  return { left, top, width: cw, height: ch };
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const ratio = OUT_W / OUT_H;
  let done = 0;

  for (const { file, slug } of SUBJECTS) {
    const src = path.join(SRC_DIR, file);
    if (!existsSync(src)) {
      console.warn(`  skip  ${slug.padEnd(13)} (missing ${file})`);
      continue;
    }

    const { width, height } = await sharp(src).metadata();
    const region = cropWindow(
      width,
      height,
      ratio,
      FOCAL_X[slug] ?? 0.5,
      FOCAL_Y[slug] ?? DEFAULT_FOCAL_Y,
      ZOOM[slug] ?? 1
    );
    const grade = { ...BASE_GRADE, ...(GRADE_OVERRIDES[slug] ?? {}) };

    await sharp(src)
      .extract(region)
      .resize(OUT_W, OUT_H)
      .modulate(grade)
      .webp({ quality: 82 })
      .toFile(path.join(OUT_DIR, `${slug}.webp`));

    console.log(
      `  ok    ${slug.padEnd(13)} ${width}x${height} -> ${OUT_W}x${OUT_H}  sat=${grade.saturation}`
    );
    done += 1;
  }

  console.log(`\n${done}/${SUBJECTS.length} portraits written to public/leadership/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
