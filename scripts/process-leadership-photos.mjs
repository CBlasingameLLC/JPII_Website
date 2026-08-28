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
  { file: "matthew.png", slug: "matthew" },
  { file: "_MG_4495 copy.png", slug: "mariana" },
  { file: "paul.png", slug: "paul" },
  { file: "alvaro.png", slug: "alvaro" },
  { file: "gabe.png", slug: "gabriel" },
  { file: "huh_jp2.jpg", slug: "andrea" },
  { file: "mary_sue_jp2.jpg", slug: "marysue" },
  { file: "marissa.png", slug: "linda" },
  { file: "sarah.png", slug: "sarah" },
];

/**
 * Horizontal focal point, measured rather than eyeballed.
 *
 * These were originally set by eye and every one of them was wrong — by up to
 * 11% of frame width — which left subjects visibly off-centre in their cards.
 * sharp has no face detection, and its `attention` strategy latches onto
 * high-contrast shirt graphics as readily as faces, so neither was usable.
 *
 * What works is exploiting the backdrop: it is uniform along any given row
 * (horizontal planks, whatever the lighting), so the person is simply whatever
 * deviates from that row's median. Summing that deviation per column gives a
 * mass distribution whose centroid is the subject. Measuring instead of
 * guessing also means new photos self-centre without anyone tuning numbers.
 *
 * Override only if detection visibly fails on a particular frame.
 */
const FOCAL_X_OVERRIDE = {};

/**
 * Correction from centred-body to centred-face, as a fraction of the finished
 * card's width. Positive means the face currently sits right of centre.
 *
 * solveFocalX centres the subject's total mass, which is the right target for
 * framing but not for a portrait: crossed arms, a thumbs-up, or a turned
 * shoulder drag that centroid several percent away from the head, and a viewer
 * only ever looks at the face. Automatic head-finding was tried and is not
 * dependable on this set — where dark hair meets a dark plank seam the crown
 * detection either misses the head entirely or latches onto the seam, which is
 * worse than no correction at all.
 *
 * So these are measured off the rendered cards rather than detected. They only
 * need revisiting if a photo is re-shot; a new photo with no entry here simply
 * gets the body-centred crop, which is already close.
 */
const FACE_NUDGE = {
  matthew: 0.069,
  mariana: -0.065,
  paul: 0.06,
  alvaro: -0.031,
  gabriel: -0.08,
  andrea: -0.01,
  marysue: 0.045,
  linda: -0.05,
  sarah: -0.02,
};

const MEASURE_WIDTH = 300;
/** Band to measure: below the headroom, above where arms and hips spread out. */
const MEASURE_TOP = 0.15;
const MEASURE_BOTTOM = 0.78;
/** Columns quieter than this share of the peak are treated as backdrop. */
const MEASURE_FLOOR = 0.35;
/** Refinement stops once the subject is within this fraction of dead centre. */
const CENTER_TOLERANCE = 0.004;
const MAX_PASSES = 14;
/**
 * Moving the window changes how much backdrop is in shot, which nudges the
 * measurement itself — so a full-size correction overshoots and the estimate
 * oscillates instead of settling. Taking a partial step each pass converges.
 */
const CORRECTION_DAMPING = 0.6;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[sorted.length >> 1];
}

/**
 * Where the subject sits horizontally within a given image, 0–1.
 *
 * The backdrop is uniform along any given row — whatever the lighting or the
 * plank colour — so a pixel's deviation from its own row's median is a good
 * proxy for "this is the person". Summing that per column gives a mass
 * distribution whose centroid is the subject.
 */
async function measureSubjectCenter(pipeline) {
  const { data, info } = await pipeline
    .resize(MEASURE_WIDTH)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const colMass = new Float64Array(width);
  const row = new Array(width);

  for (let y = Math.floor(height * MEASURE_TOP); y < Math.floor(height * MEASURE_BOTTOM); y++) {
    for (let x = 0; x < width; x++) row[x] = data[y * width + x];
    const rowMedian = median(row);
    for (let x = 0; x < width; x++) colMass[x] += Math.abs(row[x] - rowMedian);
  }

  const peak = Math.max(...colMass);
  if (peak === 0) return 0.5;

  let weighted = 0;
  let total = 0;
  for (let x = 0; x < width; x++) {
    if (colMass[x] < peak * MEASURE_FLOOR) continue;
    weighted += x * colMass[x];
    total += colMass[x];
  }
  return total === 0 ? 0.5 : weighted / total / width;
}

/**
 * Finds the focal point that actually lands the subject in the middle of the
 * finished card, by cropping, measuring the result, and correcting.
 *
 * Measuring the source once and using that as the focal point sounds
 * equivalent but isn't: cropWindow clamps the window at the frame edges, so on
 * the tighter portrait frames the window can't always sit where the maths
 * wants it, and the subject drifts. Closing the loop on the *output* is the
 * only version that's actually checkable — it optimises the thing we care
 * about rather than a proxy for it, and it converges for new photos without
 * anyone hand-tuning numbers.
 */
async function solveFocalX(srcPath, width, height, ratio, focalY, zoom) {
  let focal = 0.5;
  // Keep the best pass rather than whatever the last one happened to be, so a
  // frame that never fully settles still ships its closest crop.
  let best = { focal, center: 0.5, error: Infinity };

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const region = cropWindow(width, height, ratio, focal, focalY, zoom);
    const center = await measureSubjectCenter(sharp(srcPath).extract(region));
    const error = center - 0.5;

    if (Math.abs(error) < Math.abs(best.error)) best = { focal, center, error };
    if (Math.abs(error) < CENTER_TOLERANCE) break;

    // Convert the miss (a fraction of the crop) back into source coordinates.
    focal += error * (region.width / width) * CORRECTION_DAMPING;
  }

  return best;
}

/**
 * Vertical focal point. The studio frames leave a lot of headroom, so the crop
 * sits high in frame; the phone frames are already tight and need almost none.
 */
const FOCAL_Y = {
  andrea: 0.42,
  marysue: 0.42,
};
const DEFAULT_FOCAL_Y = 0.46;

/**
 * Tightens the crop on frames where the subject stands further from the
 * camera, so heads occupy roughly the same share of every card. The phone
 * frames need this; the studio set was shot at a consistent distance and does
 * not. Values above 1 upscale on output — fine at these modest ratios.
 */
const ZOOM = {
  andrea: 1.24,
  marysue: 1.24,
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
  andrea: { saturation: 0.6, brightness: 0.94, hue: -6 },
  marysue: { saturation: 0.6, brightness: 0.94, hue: -6 },
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
    const focalY = FOCAL_Y[slug] ?? DEFAULT_FOCAL_Y;
    const zoom = ZOOM[slug] ?? 1;

    const override = FOCAL_X_OVERRIDE[slug];
    let solved =
      override === undefined
        ? await solveFocalX(src, width, height, ratio, focalY, zoom)
        : { focal: override, center: null };
    let focalX = solved.focal;

    // Convert the face offset (a fraction of the output) into source
    // coordinates before applying it, same conversion solveFocalX uses.
    const probe = cropWindow(width, height, ratio, focalX, focalY, zoom);
    focalX += (FACE_NUDGE[slug] ?? 0) * (probe.width / width);

    const region = cropWindow(width, height, ratio, focalX, focalY, zoom);
    const grade = { ...BASE_GRADE, ...(GRADE_OVERRIDES[slug] ?? {}) };

    await sharp(src)
      .extract(region)
      .resize(OUT_W, OUT_H)
      .modulate(grade)
      .webp({ quality: 82 })
      .toFile(path.join(OUT_DIR, `${slug}.webp`));

    // `subject` is where the person's mass ended up. A frame with a FACE_NUDGE
    // is *meant* to land off 0.500 by roughly that much — the body shifts so
    // the face doesn't — so only an unnudged frame drifting here is a fault.
    const landed =
      solved.center === null
        ? "override"
        : `subject=${solved.center.toFixed(3)}${
            Math.abs(solved.center - 0.5) < 0.01 || FACE_NUDGE[slug] ? "" : "  <-- OFF-CENTRE"
          }${FACE_NUDGE[slug] ? `  face-nudge=${FACE_NUDGE[slug] > 0 ? "+" : ""}${FACE_NUDGE[slug]}` : ""}`;
    console.log(
      `  ok    ${slug.padEnd(13)} focalX=${focalX.toFixed(3)}  ${landed}  sat=${grade.saturation}`
    );
    done += 1;
  }

  console.log(`\n${done}/${SUBJECTS.length} portraits written to public/leadership/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
