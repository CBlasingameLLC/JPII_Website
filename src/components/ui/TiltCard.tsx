"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const MAX_TILT_POINTER_DEG = 7;
/* Phones need far more than the pointer value to read as tilting at all: the
   card is small on screen, the motion is peripheral, and a wrist-flick covers
   only a few degrees of device rotation. */
const MAX_TILT_GYRO_DEG = 18;

/* Degrees of device lean that map to the full tilt range — deliberately small
   so a normal wrist movement reaches the extremes instead of needing the phone
   turned sideways. Beta is offset by a typical hand-hold angle so "neutral" is
   how someone actually holds a phone, not flat on a table. */
const GYRO_GAMMA_RANGE = 18;
const GYRO_BETA_CENTER = 30;
const GYRO_BETA_RANGE = 22;

const SPRING = { stiffness: 220, damping: 24, mass: 0.4 };

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type GyroCapability = "none" | "needs-permission" | "available";

function getGyroCapability(): GyroCapability {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return "none";
  if (!window.matchMedia("(pointer: coarse)").matches) return "none";
  const DOE = DeviceOrientationEvent as DeviceOrientationEventIOS;
  return typeof DOE.requestPermission === "function" ? "needs-permission" : "available";
}

function subscribe() {
  // Nothing external to subscribe to — capability is a one-time environment
  // read (navigator/matchMedia), not a value that changes on its own.
  // useSyncExternalStore is used purely for its SSR-safe snapshot split, same
  // pattern as InstallPrompt.tsx's platform detection.
  return () => {};
}

function getServerSnapshot(): GyroCapability {
  return "none";
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps children in a 3D tilt (mouse position on desktop, device orientation
 * on mobile) over a liquid-glass surface: drifting caustics, a periodic
 * shimmer sweep, a pointer-tracked specular highlight, and a conic shine
 * travelling around the border. iOS gates device orientation behind an
 * explicit permission prompt (a browser requirement, not a choice) — shown as
 * a tiny tap hint only when that gate is actually in play; Android and desktop
 * need no such gesture.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const gyroCapability = useSyncExternalStore(subscribe, getGyroCapability, getServerSnapshot);
  const [gyroGranted, setGyroGranted] = useState(false);

  const usingGyro = gyroCapability === "available" || gyroGranted;
  const maxTilt = usingGyro ? MAX_TILT_GYRO_DEG : MAX_TILT_POINTER_DEG;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), SPRING);
  const sheenBackground = useTransform([px, py], ([x, y]: number[]) =>
    `radial-gradient(220px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.16), transparent 60%)`
  );

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const gamma = clamp(e.gamma, GYRO_GAMMA_RANGE);
      const beta = clamp(e.beta - GYRO_BETA_CENTER, GYRO_BETA_RANGE);
      px.set((gamma + GYRO_GAMMA_RANGE) / (GYRO_GAMMA_RANGE * 2));
      py.set((beta + GYRO_BETA_RANGE) / (GYRO_BETA_RANGE * 2));
    },
    [px, py]
  );

  useEffect(() => {
    if (gyroCapability !== "available") return;
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroCapability, handleOrientation]);

  async function enableGyro() {
    const DOE = DeviceOrientationEvent as DeviceOrientationEventIOS;
    try {
      const result = await DOE.requestPermission?.();
      if (result === "granted") {
        setGyroGranted(true);
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch {
      // Not supported, or the user said no — card just stays flat, which is fine.
    }
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    // Touch devices synthesize mouse events on tap; letting those through would
    // fight the gyroscope over the same two motion values.
    if (usingGyro) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    if (usingGyro) return;
    px.set(0.5);
    py.set(0.5);
  }

  const showTapHint = gyroCapability === "needs-permission" && !gyroGranted;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
    >
      <div className="shine-border relative overflow-hidden rounded-panel">
        {children}
        {/* Drifting caustics — the "liquid" in the glass. Inset past the edges
            so its own blur never reads as a soft rectangle. */}
        <div aria-hidden="true" className="glass-flow pointer-events-none absolute -inset-[15%]" />
        {/* Shimmer sweeping periodically across the face. */}
        <div aria-hidden="true" className="glass-shimmer pointer-events-none absolute inset-0" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: sheenBackground, mixBlendMode: "overlay" }}
        />
        {showTapHint && (
          <button
            type="button"
            onClick={enableGyro}
            className="absolute bottom-3 right-4 rounded-pill bg-navy-black/40 px-2 py-1 font-ui text-[9px] font-semibold uppercase tracking-[.1em] text-gold-light/80 backdrop-blur-sm"
          >
            Tap for tilt ✦
          </button>
        )}
      </div>
    </motion.div>
  );
}
