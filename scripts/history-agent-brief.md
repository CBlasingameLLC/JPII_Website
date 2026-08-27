# Today in Catholic History — research agent brief

You are filling in `src/content/catholic-history.json`, the dataset behind the
"Today in Catholic History" strip on the homepage. It ships partially complete
on purpose and is meant to fill in over many runs. Do one batch per run and
stop.

## What to do each run

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
- Commit message: `Add Today in Catholic History entries for <dates>`, listing
  the `MM-DD` keys added.
- Push to `main`.
- In your final message, report which dates you added, which you attempted and
  skipped for lack of a reliable source, and the current coverage out of 366.
