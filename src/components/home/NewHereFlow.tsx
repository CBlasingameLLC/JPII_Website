"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pill } from "@/components/ui/Pill";
import { INVOLVED } from "@/content/involved";

type Step = "q1" | "q2" | "result";

const byOrdinal = (ordinal: string) => INVOLVED.find((c) => c.ordinal === ordinal)!;

/**
 * A short, warm alternative to picking cold off the Get Involved grid — two
 * quick questions, one recommendation. Plain `key`-based remounts (no
 * AnimatePresence/exit) so an answer always lands immediately, matching the
 * correctness-over-animation convention documented in CLAUDE.md for
 * DayTabs.tsx/NextMassCard.tsx.
 */
export function NewHereFlow() {
  const [step, setStep] = useState<Step>("q1");
  const [resultOrdinal, setResultOrdinal] = useState<string | null>(null);

  function reset() {
    setStep("q1");
    setResultOrdinal(null);
  }

  function chooseNotCatholicYet() {
    setResultOrdinal("03");
    setStep("result");
  }

  function chooseCatholic() {
    setStep("q2");
  }

  function pickResult(ordinal: string) {
    setResultOrdinal(ordinal);
    setStep("result");
  }

  const result = resultOrdinal ? byOrdinal(resultOrdinal) : null;

  return (
    <div className="mx-auto mt-10 max-w-[560px] rounded-panel border border-border bg-paper p-[30px] text-center sm:p-9">
      {step === "q1" && (
        <motion.div key="q1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <div className="font-ui text-[11px] font-semibold uppercase tracking-[.25em] text-orange">
            Not sure where to start?
          </div>
          <h3 className="mt-3 font-display text-[21px] font-bold text-navy-deep">
            Are you Catholic already?
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Pill onClick={chooseCatholic} variant="orange" size="sm">
              Yes, already Catholic
            </Pill>
            <Pill onClick={chooseNotCatholicYet} variant="ghost" size="sm" className="border-navy/25 text-navy hover:border-orange hover:text-orange">
              Not yet, or not sure
            </Pill>
          </div>
        </motion.div>
      )}

      {step === "q2" && (
        <motion.div key="q2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <div className="font-ui text-[11px] font-semibold uppercase tracking-[.25em] text-orange">
            One more question
          </div>
          <h3 className="mt-3 font-display text-[21px] font-bold text-navy-deep">
            What sounds good right now?
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Pill onClick={() => pickResult("01")} variant="orange" size="sm">
              A small weekly group
            </Pill>
            <Pill onClick={() => pickResult("02")} variant="orange" size="sm">
              Serving at Mass
            </Pill>
            <Pill onClick={() => pickResult("04")} variant="orange" size="sm">
              Leading something
            </Pill>
          </div>
        </motion.div>
      )}

      {step === "result" && result && (
        <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <div className="font-ui text-[11px] font-semibold uppercase tracking-[.25em] text-orange">
            Start here
          </div>
          <h3 className="mt-3 font-display text-[23px] font-bold text-navy-deep">{result.title}</h3>
          <p className="mt-[10px] text-sm leading-[1.7] text-ink-warm">{result.body}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Pill href="/#involved" variant="orange" size="sm">
              See it in Get Involved
            </Pill>
            <button
              type="button"
              onClick={reset}
              className="font-ui text-xs font-semibold uppercase tracking-[.12em] text-muted underline decoration-border underline-offset-4 hover:text-orange"
            >
              Start over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
