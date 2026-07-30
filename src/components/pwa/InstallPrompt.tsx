"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DISMISSED_KEY = "jpii-install-prompt-dismissed";
const SHOW_DELAY_MS = 3000;

type Platform = "android" | "ios" | null;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getEligiblePlatform(): Platform {
  if (window.localStorage.getItem(DISMISSED_KEY)) return null;
  if (isStandalone()) return null;

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  const isAndroid = /Android/.test(ua);
  if (isIOS) return "ios";
  if (isAndroid) return "android";
  return null;
}

function subscribe() {
  // Nothing external to subscribe to — platform/eligibility is derived once
  // per mount from navigator/localStorage, not a value that changes on its
  // own. useSyncExternalStore is used here purely for its SSR-safe snapshot
  // split (server always gets null, client gets the real read on hydration)
  // without needing an effect to setState.
  return () => {};
}

function getServerSnapshot(): Platform {
  return null;
}

/**
 * Understated bottom banner nudging mobile visitors to install the PWA.
 * Android/Chrome gets a real one-tap install via `beforeinstallprompt`; iOS
 * Safari has no such API, so it gets manual Share-sheet instructions
 * instead. Shows once per browser (localStorage), after a short delay so
 * it doesn't ambush a first-time visitor on load.
 */
export function InstallPrompt() {
  const platform = useSyncExternalStore(subscribe, getEligiblePlatform, getServerSnapshot);
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!platform) return;

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [platform]);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISSED_KEY, "1");
  }

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  }

  if (!platform) return null;
  // Android without a captured beforeinstallprompt event means the browser
  // already handles installability itself (or doesn't support it) — nothing
  // useful for our banner to do.
  if (platform === "android" && !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: "tween", duration: 0.25 }}
          role="dialog"
          aria-label="Install this app"
          className="fixed inset-x-0 bottom-0 z-[80] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] sm:hidden"
        >
          <div className="flex w-full max-w-[420px] items-center gap-3 rounded-panel border border-gold-light/40 bg-navy-deep/95 p-4 shadow-lift backdrop-blur-[10px]">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-tile bg-navy">
              <svg viewBox="0 0 100 142" width={16} height={23} aria-hidden="true">
                <path
                  d="M38,6 L62,6 L58,18 L58,40 L80,40 L92,34 L92,62 L80,56 L58,56 L58,124 L64,136 L36,136 L42,124 L42,56 L20,56 L8,62 L8,34 L20,40 L42,40 L42,18 Z"
                  fill="#E7C877"
                />
              </svg>
            </span>

            <div className="flex-1 text-[13px] leading-[1.5] text-onnavy">
              {platform === "ios" ? (
                <>
                  <span className="font-semibold text-ivory">Add JPII to your Home Screen.</span>{" "}
                  Tap <span className="font-semibold text-gold-light">Share</span>, then{" "}
                  <span className="font-semibold text-gold-light">Add to Home Screen</span>.
                </>
              ) : (
                <span className="font-semibold text-ivory">
                  Install JPII for one-tap access to Mass times and events.
                </span>
              )}
            </div>

            <div className="flex flex-none items-center gap-2">
              {platform === "android" && (
                <button
                  type="button"
                  onClick={handleAndroidInstall}
                  className="rounded-pill bg-gold-light px-3 py-2 font-ui text-xs font-bold uppercase tracking-[.08em] text-navy transition-colors hover:bg-paper"
                >
                  Install
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="flex h-8 w-8 flex-none items-center justify-center text-onnavy-dim transition-colors hover:text-gold-light"
              >
                &times;
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
