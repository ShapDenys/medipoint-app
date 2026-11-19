import { Crosshair, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-care.jpg";
import { Button } from "@/components/ui/button";
import { useAppPrefs } from "@/lib/app-prefs";
import { DISTRICTS, QUICK_FILTERS, type QuickFilter } from "@/lib/clinics";
import { cn } from "@/lib/utils";

const DISTRICT_GEO: Record<string, [number, number]> = {
  winogrady: [52.429, 16.935],
  piatkowo: [52.461, 16.914],
  jezyce: [52.414, 16.89],
  "stare-miasto": [52.408, 16.934],
  rataje: [52.392, 16.965],
};

interface HeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  filter: QuickFilter;
  onFilterChange: (f: QuickFilter) => void;
  onSearch: () => void;
}

export function Hero({ query, onQueryChange, filter, onFilterChange, onSearch }: HeroProps) {
  const { setDistrictId, setGpsDetected } = useAppPrefs();
  const [locating, setLocating] = useState(false);

  const detect = () => {
    if (!("geolocation" in navigator)) {
      toast.error("To urządzenie nie pozwala wykryć lokalizacji. Wybierz dzielnicę u góry strony.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        let best = "winogrady";
        let bestD = Infinity;
        for (const d of DISTRICTS) {
          const geo = DISTRICT_GEO[d.id];
          if (!geo) continue;
          const [lat, lng] = geo;
          const dist = Math.hypot(lat - coords.latitude, (lng - coords.longitude) * 0.61);
          if (dist < bestD) {
            bestD = dist;
            best = d.id;
          }
        }
        // ~0.2° ≈ 20 km
        if (bestD > 0.2) {
          toast("Jesteś poza Poznaniem", {
            description: "Na razie pokazujemy przychodnie w Poznaniu. Wybierz dzielnicę u góry strony.",
          });
          return;
        }
        setDistrictId(best);
        setGpsDetected(true);
        toast.success("Znaleźliśmy Twoją lokalizację", {
          description: `Pokazujemy przychodnie najbliżej: ${DISTRICTS.find((d) => d.id === best)?.name}.`,
        });
        onSearch();
      },
      () => {
        setLocating(false);
        toast.error("Nie udało się wykryć lokalizacji", {
          description: "Nic się nie stało – wybierz swoją dzielnicę u góry strony.",
        });
      },
      { timeout: 10_000 },
    );
  };

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-hero-gradient">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14 senior:lg:grid-cols-1">
        <div className="space-y-7">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground senior:hidden">
              Bez logowania · bez zbędnych pytań
            </p>
            <h1 id="hero-title" className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Lekarz blisko domu.
              <br />
              <span className="text-cta">Wizyta w 3 prostych krokach.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
              Wpisz nazwę przychodni albo lekarza – lub po prostu pokaż najbliższe. Duży zielony przycisk umówi Cię na wizytę.
            </p>
          </div>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
            className="space-y-3 rounded-3xl border-2 bg-card p-3 shadow-card sm:p-4"
          >
            <label htmlFor="clinic-search" className="block px-1 font-display text-lg font-semibold">
              Czego szukasz?
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-muted-foreground" />
              <input
                id="clinic-search"
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="np. Winogrady, kardiolog, Medica"
                className="min-h-16 w-full rounded-2xl border-2 border-input bg-background pl-14 pr-4 text-xl text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
              <Button type="button" variant="outline" size="xl" onClick={detect} disabled={locating}>
                {locating ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Crosshair aria-hidden="true" />}
                {locating ? "Szukam…" : "Wykryj moją lokalizację"}
              </Button>
              <Button type="submit" variant="default" size="xl">
                <Search aria-hidden="true" />
                Znajdź najbliższą przychodnię
              </Button>
            </div>
          </form>

          <div role="group" aria-label="Szybkie filtry" className="flex flex-wrap gap-2.5">
            {QUICK_FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFilterChange(f.id)}
                  className={cn(
                    "min-h-12 rounded-full border-2 px-5 text-base font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative hidden lg:block senior:!hidden">
          <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-accent" aria-hidden="true" />
          <img
            src={heroImage}
            alt="Uśmiechnięta seniorka rozmawia z lekarką w przychodni"
            width={1024}
            height={896}
            className="relative aspect-[8/7] w-full rounded-[2rem] object-cover shadow-card"
          />
        </div>
      </div>
    </section>
  );
}
