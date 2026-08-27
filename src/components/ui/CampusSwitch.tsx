"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

export type Campus = "uttyler" | "tjc";

export const CAMPUS_STORAGE_KEY = "jpii-campus";
const CHANGE_EVENT = "jpii-campus-change";

const CAMPUSES: { id: Campus; short: string; full: string }[] = [
  { id: "uttyler", short: "UT Tyler", full: "The University of Texas at Tyler" },
  { id: "tjc", short: "TJC", full: "Tyler Junior College" },
];

/**
 * The selected campus lives on `document.documentElement`, not in React state.
 *
 * Two reasons. The inline script in the root layout has already set it before
 * first paint to avoid a flash of the wrong accent, so the DOM is the earliest
 * source of truth. And the switch appears in both the header and the footer —
 * backing both with one external store keeps them in step, where two copies of
 * local state would silently drift apart.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function getSnapshot(): Campus {
  return document.documentElement.dataset.campus === "tjc" ? "tjc" : "uttyler";
}

function getServerSnapshot(): Campus {
  return "uttyler";
}

function selectCampus(campus: Campus) {
  if (campus === "uttyler") {
    delete document.documentElement.dataset.campus;
  } else {
    document.documentElement.dataset.campus = campus;
  }
  try {
    window.localStorage.setItem(CAMPUS_STORAGE_KEY, campus);
  } catch {
    // Private browsing or blocked storage — the choice just won't persist,
    // which is a fine outcome for a preference this small.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Switches the campus accent colour between UT Tyler and Tyler Junior College.
 * Accent only — grounds, neutrals, and the sacred gold are identical in both.
 */
export function CampusSwitch({ className }: { className?: string }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      className={cn("campus-switch", className)}
      role="group"
      aria-label="Campus colours"
    >
      {CAMPUSES.map((campus) => (
        <button
          key={campus.id}
          type="button"
          onClick={() => selectCampus(campus.id)}
          aria-pressed={active === campus.id}
          title={`Show ${campus.full} colours`}
        >
          {campus.short}
        </button>
      ))}
    </div>
  );
}
