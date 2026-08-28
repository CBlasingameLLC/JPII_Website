import { NextResponse } from "next/server";
import { z } from "zod";
import { INTERESTS, CLASS_YEARS, FAITH_STATUS, SCHOOLS } from "@/content/interests";

const interestIds = INTERESTS.map((i) => i.id);

const RegistrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("That email doesn't look right").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  school: z.enum(SCHOOLS),
  classYear: z.enum(CLASS_YEARS),
  major: z.string().trim().max(120).optional().or(z.literal("")),
  faithStatus: z.enum(FAITH_STATUS),
  interests: z.array(z.string()).max(interestIds.length),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  /**
   * Honeypot — real people never fill this; bots usually do. Deliberately
   * permissive: rejecting a filled value here would fail validation and hand
   * back an error naming the field, which tells a bot exactly what caught it.
   * It's accepted, then silently dropped in the handler instead.
   */
  website: z.string().max(200).optional(),
});

/**
 * Receives a new-student registration and forwards it to the ministry's
 * Google Sheet.
 *
 * The forward happens server-side on purpose. Posting to Apps Script straight
 * from the browser means either a CORS preflight the Apps Script runtime
 * doesn't answer cleanly, or an opaque `no-cors` request that can't report
 * whether it actually worked — and a signup form that silently fails is worse
 * than one that's honestly unavailable. Going through here also keeps the
 * endpoint URL out of the page source.
 *
 * REGISTRATION_WEBHOOK_URL is a plain Apps Script web-app URL, not an API key
 * — nothing to rotate, and a new one can be swapped in from the Vercel
 * dashboard without a deploy.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = RegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Silently accept honeypot hits so a bot gets no signal it was caught.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const endpoint = process.env.REGISTRATION_WEBHOOK_URL;
  if (!endpoint) {
    // Deliberately explicit rather than a fake success — see the fallback
    // copy in RegistrationFlow, which shows the ministry's email instead.
    return NextResponse.json(
      { error: "not_configured" },
      { status: 503 }
    );
  }

  const known = new Set(interestIds);
  const record = {
    submittedAt: new Date().toISOString(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone ?? "",
    school: data.school,
    classYear: data.classYear,
    major: data.major ?? "",
    faithStatus: data.faithStatus,
    // Stored as readable labels so the Sheet is legible to a human without
    // needing to know the internal ids.
    interests: data.interests
      .filter((id) => known.has(id))
      .map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id)
      .join(", "),
    notes: data.notes ?? "",
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      // text/plain keeps Apps Script from triggering a CORS preflight and is
      // what its doPost(e) handler reads via e.postData.contents.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Sheet endpoint returned ${res.status}`);
  } catch (err) {
    console.error("Registration forward failed:", err);
    return NextResponse.json({ error: "forward_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
