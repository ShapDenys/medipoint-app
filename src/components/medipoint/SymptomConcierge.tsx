import { Bot, Phone, RotateCcw, Sparkles, Stethoscope } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { SPECIALTY_LABELS } from "@/lib/clinics";
import { SYMPTOM_CHIPS, matchSymptoms, type SymptomMatch } from "@/lib/symptoms";

interface SymptomConciergeProps {
  match: SymptomMatch | null;
  matchingCount: number;
  onMatch: (m: SymptomMatch | null) => void;
  onShowClinics: () => void;
}

export function SymptomConcierge({ match, matchingCount, onMatch, onShowClinics }: SymptomConciergeProps) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ask = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setText(v);
    setThinking(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setThinking(false);
      onMatch(matchSymptoms(v));
    }, 900);
  };

  const reset = () => {
    setText("");
    onMatch(null);
  };

  return (
    <section aria-labelledby="concierge-title" className="mx-auto max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-concierge p-6 text-primary-foreground shadow-card sm:p-9">
        <Sparkles aria-hidden="true" className="absolute -right-6 -top-6 size-40 text-primary-foreground/10 senior:hidden" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/15">
                <Bot aria-hidden="true" className="size-7" />
              </span>
              <p className="font-semibold uppercase tracking-wider text-primary-foreground/85">Asystent MediPoint</p>
            </div>
            <h2 id="concierge-title" className="text-3xl font-bold leading-tight sm:text-4xl">
              Opisz swoje objawy lub powiedz, co Ci dolega
            </h2>
            <p className="text-lg text-primary-foreground/85">
              Podpowiemy, do jakiego lekarza się zapisać, i pokażemy przychodnie z najbliższymi wolnymi terminami.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(text);
              }}
              className="space-y-3"
            >
              <label htmlFor="symptoms" className="sr-only">
                Twoje objawy
              </label>
              <textarea
                id="symptoms"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="np. Boli mnie gardło i mam gorączkę od wczoraj"
                className="w-full resize-none rounded-2xl border-2 border-transparent bg-card px-4 py-3 text-xl text-card-foreground placeholder:text-muted-foreground focus-visible:border-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
              />
              <Button type="submit" variant="onDark" size="xl" disabled={thinking || !text.trim()} className="w-full sm:w-auto">
                <Sparkles aria-hidden="true" />
                {thinking ? "Asystent myśli…" : "Zapytaj asystenta"}
              </Button>
            </form>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary-foreground/80 senior:text-base">Albo kliknij gotowy przykład:</p>
              <ul className="flex flex-wrap gap-2">
                {SYMPTOM_CHIPS.map((chip) => (
                  <li key={chip}>
                    <button
                      type="button"
                      onClick={() => ask(chip)}
                      className="min-h-11 rounded-full border-2 border-primary-foreground/40 px-4 font-semibold transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
                    >
                      {chip}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div aria-live="polite" className="flex">
            {thinking ? (
              <div className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary-foreground/40 p-8 text-center">
                <span className="flex gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-3 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
                <p className="text-lg font-semibold">Szukam odpowiedniego lekarza…</p>
              </div>
            ) : match?.urgent ? (
              <div className="w-full space-y-4 rounded-3xl bg-card p-6 text-card-foreground animate-fade-up">
                <p className="font-display text-2xl font-bold text-emergency">To może być nagły przypadek</p>
                <p className="text-lg">{match.reason}</p>
                <Button asChild variant="emergency" size="hero">
                  <a href="tel:112">
                    <Phone aria-hidden="true" />
                    ZADZWOŃ 112
                  </a>
                </Button>
                <Button variant="link" onClick={reset}>Wyczyść</Button>
              </div>
            ) : match ? (
              <div className="w-full space-y-5 rounded-3xl bg-card p-6 text-card-foreground animate-fade-up">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Proponujemy wizytę u:</p>
                  <p className="mt-1 flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
                    <Stethoscope aria-hidden="true" className="size-8 shrink-0 text-cta" />
                    {SPECIALTY_LABELS[match.specialty]}
                  </p>
                </div>
                <p className="text-lg">{match.reason}</p>
                <p className="rounded-xl bg-success-soft px-4 py-2 font-semibold text-success-foreground">
                  {matchingCount > 0
                    ? `Znaleźliśmy ${matchingCount} ${matchingCount === 1 ? "przychodnię" : matchingCount < 5 ? "przychodnie" : "przychodni"} z tym lekarzem w pobliżu.`
                    : "W pobliżu brak przychodni z tym lekarzem – zmień dzielnicę."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="cta" size="xl" onClick={onShowClinics} className="flex-1">
                    Pokaż przychodnie
                  </Button>
                  <Button variant="outline" size="xl" onClick={reset}>
                    <RotateCcw aria-hidden="true" />
                    Wyczyść
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground senior:text-base">To tylko podpowiedź, a nie diagnoza. Decyzję podejmie lekarz.</p>
              </div>
            ) : (
              <ul className="w-full space-y-3 self-center text-lg senior:hidden">
                {["Piszesz własnymi słowami – jak do znajomego.", "Podpowiadamy właściwego lekarza.", "Pokazujemy najbliższe wolne terminy."].map((t, i) => (
                  <li key={t} className="flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground font-display font-bold text-primary">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
