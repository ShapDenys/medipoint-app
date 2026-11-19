# MediPoint Development Rules

## Project rules

- MediPoint UI lives in `src/components/medipoint/`; pure rules (clinic filters, symptom matcher, patient validation) live in `src/lib/` and are covered by `src/test/medipoint-rules.test.ts` — keep logic out of components so it stays testable.
- Senior Mode is the `.senior` class on `<html>` (set by `AppPrefsProvider`), with token overrides in `src/styles.css` and the `senior:` variant for layout simplification — never branch styles in JS for it.
- Time-dependent UI ("open now") uses `useNow()` (null during SSR) and Europe/Warsaw hours to avoid hydration mismatches.
- Clinic data is mock/static in `src/lib/clinics.ts`; the symptom assistant is an offline keyword matcher (no AI calls yet).
