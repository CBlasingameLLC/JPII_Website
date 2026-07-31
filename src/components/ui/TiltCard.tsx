"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const MAX_TILT_DEG = 7;
const SPRING = { stiffness: 220, damping: 24, mass: 0.4 };

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
 * Wraps children in a subtle 3D tilt (mouse position on desktop, device
 * orientation on mobile) plus a specular sheen that tracks the same
 * pointer/tilt source — a restrained, single mechanism driving both
 * effects rather than two unrelated ones. iOS gates device orientation
 * behind an explicit permission prompt (a browser requirement, not a
 * choice) — shown as a tiny tap hint only when that gate is actually in
 * play; Android and desktop need no such gesture.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const gyroCapability = useSyncExternalStore(subscribe, getGyroCapability, getServerSnapshot);
  const [gyroGranted, setGyroGranted] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), SPRING);
  const sheenBackground = useTransform([px, py], ([x, y]: number[]) =>
    `radial-gradient(220px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.16), transparent 60%)`
  );

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const gamma = Math.max(-30, Math.min(30, e.gamma)); // left-right lean
      const beta = Math.max(-30, Math.min(60, e.beta - 30)); // front-back lean, offset for a natural hand-hold angle
      px.set((gamma + 30) / 60);
      py.set((beta + 30) / 90);
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
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
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
      <div className="relative overflow-hidden rounded-panel">
        {children}
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
