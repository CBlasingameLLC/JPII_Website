"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { chicagoDateKey, getChicagoNow } from "@/lib/time";

/**
 * Re-fetches the page when the Tyler-local date rolls over.
 *
 * Three things on the homepage are computed from today's date on the server —
 * the liturgical band, the history strip, and the Mass card's starting state.
 * Server components render once and never again, so a tab left open overnight
 * kept showing yesterday until someone manually reloaded. (The Mass card was
 * the exception: it recomputes on its own 30-second tick, so it was already
 * correct while the two bands above it were not.)
 *
 * `renderedFor` is the day the server actually rendered, passed down rather
 * than captured on the client at hydration. That matters for the second, less
 * obvious case: a page cached before midnight and served after it arrives
 * already stale, and a client that only watched for a *change* from its own
 * start would sit there agreeing with itself.
 *
 * Checks on mount, on a slow interval, and whenever the tab is refocused —
 * that last one covers the common case of a phone waking up the next morning
 * without waiting up to a minute for the timer.
 */

/**
 * The page's own `revalidate` means a refresh just after midnight can still be
 * served the previous day's cached render. Retrying on a slow cadence lets it
 * correct itself once that cache regenerates, instead of either giving up
 * after one attempt or hammering the server every minute until it does.
 */
const RETRY_MS = 5 * 60_000;
const CHECK_MS = 60_000;

export function DailyRefresh({ renderedFor }: { renderedFor: string }) {
  const router = useRouter();
  const lastAttempt = useRef(0);

  useEffect(() => {
    function check() {
      if (chicagoDateKey(getChicagoNow()) === renderedFor) return;
      const now = Date.now();
      if (now - lastAttempt.current < RETRY_MS) return;
      lastAttempt.current = now;
      router.refresh();
    }

    check();
    const id = setInterval(check, CHECK_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [renderedFor, router]);

  return null;
}
