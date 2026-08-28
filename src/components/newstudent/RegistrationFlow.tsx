"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";
import { INTERESTS, CLASS_YEARS, FAITH_STATUS, SCHOOLS } from "@/content/interests";
import { SITE_CONFIG } from "@/content/site-config";

type Status = "idle" | "submitting" | "done" | "unavailable" | "error";

const STEPS = ["You", "Your year", "Interests", "Send"];
/** Paired with STEPS on the intro panel so the length of the form is visible before it starts. */
const STEP_BLURBS = [
  "Name and how to reach you.",
  "School, year, where you're at.",
  "The part that decides who calls.",
  "Anything else, then send.",
];

const inputClass =
  "w-full rounded-tile border border-border bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted-light focus:border-orange focus:outline-none";
const labelClass =
  "block font-ui text-[10px] font-semibold uppercase tracking-[.16em] text-muted";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  school: "",
  classYear: "",
  major: "",
  faithStatus: "",
  interests: [] as string[],
  notes: "",
  website: "",
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="mt-[6px]">{children}</div>
      {hint && <span className="mt-1 block text-[12px] text-muted-light">{hint}</span>}
    </label>
  );
}

function ChoiceRow({
  options,
  value,
  onSelect,
}: {
  options: readonly string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          aria-pressed={value === opt}
          className={cn(
            "rounded-pill border px-4 py-2 font-ui text-[13px] font-semibold transition-colors duration-150",
            value === opt
              ? "border-orange bg-orange text-paper"
              : "border-border bg-paper text-ink-warm hover:border-orange hover:text-orange"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function RegistrationFlow() {
  // The page used to open straight onto step 1's name fields, which lands as
  // a demand before anything has been explained. This gate costs one tap and
  // turns the arrival into an answer to "what is this and what happens to it".
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  function toggleInterest(id: string) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((i) => i !== id)
        : [...f.interests, id],
    }));
  }

  function next() {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        return setError("We need your first and last name.");
      }
      if (!EMAIL_RE.test(form.email.trim())) {
        return setError("That email doesn't look right.");
      }
    }
    if (step === 1) {
      if (!form.school) return setError("Which school are you at?");
      if (!form.classYear) return setError("Pick your year so we know who to introduce you to.");
      if (!form.faithStatus) return setError("Pick whichever of these is closest.");
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.error === "not_configured") {
        setStatus("unavailable");
        return;
      }
      setStatus("error");
      setError(
        typeof data?.error === "string" && data.error !== "forward_failed"
          ? data.error
          : "Something went wrong sending that."
      );
    } catch {
      setStatus("error");
      setError("Something went wrong sending that.");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-panel border border-border bg-paper p-9 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy font-display text-[22px] text-gold-light">
          ✦
        </div>
        <h3 className="mt-5 font-display text-[24px] font-bold text-navy-deep">
          You&apos;re on the list, {form.firstName}.
        </h3>
        <p className="mx-auto mt-3 max-w-[420px] text-[15px] leading-[1.7] text-ink-warm">
          Someone from the Center will reach out this week. In the meantime, Sunday at 10:30 AM is
          the easiest door to walk through — no sign-in, no name tag.
        </p>
      </motion.div>
    );
  }

  if (status === "unavailable") {
    return (
      <div className="rounded-panel border border-border bg-paper p-9 text-center">
        <h3 className="font-display text-[22px] font-bold text-navy-deep">
          This form isn&apos;t connected yet
        </h3>
        <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-[1.7] text-ink-warm">
          Rather than pretend that went through — it didn&apos;t. Email us and we&apos;ll get you
          connected the same way.
        </p>
        <div className="mt-6 flex justify-center">
          <Pill href={`mailto:${SITE_CONFIG.email}`} variant="orange" size="sm">
            Email the Center
          </Pill>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-panel border border-border bg-paper p-7 sm:p-10"
      >
        <h2 className="font-display text-[26px] font-bold leading-[1.2] text-navy-deep sm:text-[30px]">
          Here&apos;s what this actually does
        </h2>
        <p className="mt-4 max-w-[520px] text-[16px] leading-[1.7] text-ink-warm">
          You tell us what you&apos;re interested in. We pass your name to the student who runs that
          thing, and they get in touch — usually a text, usually within the week. That&apos;s the
          whole mechanism.
        </p>

        <ol className="mt-8 flex flex-col gap-px overflow-hidden rounded-tile border border-border-soft bg-border-soft">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-4 bg-ivory px-5 py-4">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-navy font-ui text-[12px] font-bold text-gold-light tabular-nums">
                {i + 1}
              </span>
              <span className="font-display text-[15px] font-bold text-navy-deep">{label}</span>
              <span className="text-[13.5px] leading-[1.5] text-ink-warm">{STEP_BLURBS[i]}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Pill onClick={() => setStarted(true)} variant="orange">
            Start
          </Pill>
          <span className="font-ui text-[12.5px] text-muted">
            About a minute. Nothing is public, and nobody is added to a list.
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-panel border border-border bg-paper p-6 sm:p-9">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <div className="h-[3px] overflow-hidden rounded-pill bg-border">
              <motion.div
                className="h-full rounded-pill bg-orange"
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <span
              className={cn(
                "font-ui text-[9px] font-semibold uppercase tracking-[.14em]",
                i <= step ? "text-orange" : "text-muted-light"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* key-based remount, no exit animation — a step must never be gated on
          an animation resolving (CLAUDE.md). */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22 }}
        className="mt-8"
      >
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-[22px] font-bold text-navy-deep">
              First, who are you?
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  autoComplete="family-name"
                />
              </Field>
            </div>
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" hint="Optional — but it's how most people actually get invited to things.">
              <input
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-[22px] font-bold text-navy-deep">
              Where are you at right now?
            </h3>
            <Field label="School">
              <ChoiceRow
                options={SCHOOLS}
                value={form.school}
                onSelect={(v) => set("school", v)}
              />
            </Field>
            <Field label="Year">
              <ChoiceRow
                options={CLASS_YEARS}
                value={form.classYear}
                onSelect={(v) => set("classYear", v)}
              />
            </Field>
            <Field label="Major" hint="Optional.">
              <input
                className={inputClass}
                value={form.major}
                onChange={(e) => set("major", e.target.value)}
              />
            </Field>
            <Field label="Which is closest?">
              <ChoiceRow
                options={FAITH_STATUS}
                value={form.faithStatus}
                onSelect={(v) => set("faithStatus", v)}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-[22px] font-bold text-navy-deep">
              What sounds good?
            </h3>
            <p className="-mt-2 text-[14px] leading-[1.6] text-ink-warm">
              Pick as many as you want. This is what decides who reaches out to you.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTERESTS.map((interest) => {
                const on = form.interests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-tile border p-4 text-left transition-colors duration-150",
                      on
                        ? "border-orange bg-orange/[.07]"
                        : "border-border bg-paper hover:border-orange"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-display text-[15px] font-bold text-navy-deep">
                        {interest.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-[2px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border text-[10px]",
                          on ? "border-orange bg-orange text-paper" : "border-border text-transparent"
                        )}
                      >
                        ✓
                      </span>
                    </div>
                    <span className="mt-1 block text-[12.5px] leading-[1.5] text-ink-warm">
                      {interest.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-[22px] font-bold text-navy-deep">
              Anything else we should know?
            </h3>
            <Field label="Notes" hint="Optional. Questions, dietary stuff, whatever.">
              <textarea
                rows={4}
                className={cn(inputClass, "resize-y")}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>
            <div className="rounded-tile border border-border-soft bg-ivory p-4 text-[13px] leading-[1.6] text-ink-warm">
              Sending as <b className="text-ink">{form.firstName} {form.lastName}</b> · {form.email}
              {form.interests.length > 0 && (
                <>
                  {" "}
                  · interested in{" "}
                  <b className="text-ink">
                    {form.interests
                      .map((id) => INTERESTS.find((i) => i.id === id)?.label)
                      .filter(Boolean)
                      .join(", ")}
                  </b>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Honeypot. Positioned off-screen rather than display:none, which some
          bots specifically skip. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-[13px] font-semibold text-orange">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="font-ui text-[11px] font-semibold uppercase tracking-[.14em] text-muted underline decoration-border underline-offset-4 hover:text-orange disabled:invisible"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <Pill onClick={next} variant="orange" size="sm">
            Continue
          </Pill>
        ) : (
          <Pill onClick={submit} variant="orange" size="sm" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send it"}
          </Pill>
        )}
      </div>
    </div>
  );
}
