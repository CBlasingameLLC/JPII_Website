# Today in Catholic History — research agent brief

You are filling in `src/content/catholic-history.json`, the dataset behind the
"Today in Catholic History" strip on the homepage. It ships partially complete
on purpose and is meant to fill in over many runs. Do one batch per run and
stop.

## Two phases — finish Phase 1 before starting Phase 2

### Phase 1 — back-verify the seed entries

The dataset shipped with 37 hand-written seed entries. They were drawn from
well-established dates but were **never individually source-checked**, and they
carry no `source` field. Until every entry has one, the job each run is
verification, not expansion. **Add no new dates during Phase 1.**

Each run, take **8 to 10 entries that have no `source`** and check each one:

- **Confirmed, date correct** → add the `source` URL. Leave the text alone
  unless something in it is actually wrong.
- **Event is real but on a different day** → move it to the correct `MM-DD`
  key, if that key is free. If the correct key is already taken, drop the entry
  rather than doubling up. Report the move either way.
- **Cannot verify against a reliable source** → **delete the entry.** An
  unverifiable claim should not sit on a parish website. Report every deletion.
- **Detail is wrong but the event and date hold** → fix the detail, add the
  source, and say what you changed.

Be especially suspicious of death dates that may actually be feast days, and of
anything where "announced", "opened", "promulgated" or "took effect" could have
been conflated.

Phase 1 is complete when every entry in the file has a `source`.

### Phase 2 — expand

Only once Phase 1 is done:

1. Read `src/content/catholic-history.json` and list which `MM-DD` keys already
   exist. **Never overwrite or rewrite an existing entry** — you are only adding
   keys that are missing.
2. Choose **8 to 10 missing dates**, preferring dates falling in the **next 60
   days**, so the strip appears on the site sooner. Once the next 60 days are
   covered, work through the remaining gaps in calendar order.
3. Research each date and find one genuinely notable event in Catholic history
   that happened on that calendar day.
4. Add them to `entries`, then commit and push.

## Accuracy rules — these matter more than coverage

This ships on a parish website under the ministry's name, so a confidently
wrong date is worse than a missing one.

- Only include events you can **verify against a reliable source**, and record
  that URL in the `source` field. Prefer encyclopedic, academic, Vatican, or
  major reference sources.
- If the day of the month is disputed between sources, **skip the date** and
  pick another. Do not average, guess, or pick the more interesting version.
- Be careful with saints: the **feast day is frequently not the death date**.
  Only record a death if the death date itself is attested.
- Beware traditional or devotional dates that are pious tradition rather than
  documented history. If sources describe it as traditional or legendary,
  either skip it or say so plainly in the text.
- Distinguish "announced", "opened", "signed", "promulgated", and "took effect"
  — these are often different days for the same event.
- If a run turns up fewer than 8 dates you can verify, **add fewer**. Never pad.

## Writing the entries

Match the voice of what's already there. Read a few existing entries first.

- One or two sentences. Plain, concrete, unsentimental.
- Lead with what happened, then one specific human detail if there is a good
  one — the cannonball, the jail cell, the borrowed Italian. Avoid adjectives
  doing the work of facts.
- No exhortation, no devotional framing, no "let us remember". The strip sits
  on a student-facing page; it should read like a good museum caption.
- Assume no prior knowledge. "St. Boniface" needs a clause saying who he was.

## Format

Keys are `MM-DD`, zero-padded. Each key holds an array, oldest year first.
`year` is a number. `source` is optional in the schema but you should always
include one.

```json
"03-13": [
  {
    "year": 2013,
    "text": "Jorge Mario Bergoglio was elected pope and took the name Francis.",
    "source": "https://example.org/verifiable-page"
  }
]
```

A date may hold two entries if both are genuinely significant, but prefer one.

## Finishing

- Run `npx tsc --noEmit` — the JSON is typed through `src/lib/catholic-history.ts`
  and a malformed file will fail there.
- Commit only `src/content/catholic-history.json`. Nothing else should change.
- Commit message: in Phase 1, `Verify Today in Catholic History entries for
  <dates>`; in Phase 2, `Add Today in Catholic History entries for <dates>`.
  List the `MM-DD` keys touched either way.
- Push to `main`.
- In your final message, report:
  - **Which phase you were in**, and how many entries still lack a `source`.
  - Phase 1: what you verified, what you corrected or moved, and **what you
    deleted and why** — call deletions out plainly, they are the ones a human
    may want to second-guess.
  - Phase 2: which dates you added, and which you attempted and skipped for
    lack of a reliable source.
  - Current coverage out of 366.
