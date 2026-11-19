import { CalendarCheck, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDistance, walkingMinutes, type ClinicResult, type District, type Specialty } from "@/lib/clinics";
import { cn } from "@/lib/utils";

import { ContractBadge, SlotStatus } from "./ClinicCard";

interface ClinicMapProps {
  results: ClinicResult[];
  district: District;
  selectedId: string | null;
  specialty?: Specialty | null | undefined;
  onSelect: (id: string) => void;
  onBook: (id: string) => void;
}

/** Illustrative map of Poznań – not to scale. */
export function ClinicMap({ results, district, selectedId, specialty, onSelect, onBook }: ClinicMapProps) {
  const selected = results.find((r) => r.clinic.id === selectedId) ?? results[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 bg-map-land shadow-card">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full">
          <ellipse cx="20" cy="25" rx="14" ry="10" className="fill-map-park" />
          <ellipse cx="78" cy="30" rx="10" ry="14" className="fill-map-park" />
          <ellipse cx="35" cy="85" rx="12" ry="7" className="fill-map-park" />
          <path d="M70 0 C 68 20, 60 30, 68 45 S 74 70, 64 85 S 66 100, 70 100 L 76 100 C 72 90, 80 75, 76 60 S 70 35, 76 20 S 78 5, 76 0 Z" className="fill-map-water" />
          <path d="M0 50 H100 M48 0 V100 M0 78 C 30 70, 60 82, 100 74 M20 0 C 25 40, 30 70, 22 100" className="stroke-map-road" strokeWidth="1.6" fill="none" />
        </svg>
        <span className="absolute left-[73%] top-[8%] rotate-[78deg] text-xs font-semibold italic text-primary/70 senior:hidden">Warta</span>

        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${district.pos.x}%`, top: `${district.pos.y}%` }}
        >
          <span className="relative flex size-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <span className="relative size-4 rounded-full border-[3px] border-card bg-primary" />
          </span>
          <span className="absolute right-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            Jesteś tutaj
          </span>
        </div>

        {results.map(({ clinic }, i) => {
          const active = clinic.id === selected?.clinic.id;
          return (
            <button
              key={clinic.id}
              type="button"
              onClick={() => onSelect(clinic.id)}
              aria-pressed={active}
              aria-label={`${clinic.name} – pokaż na mapie`}
              className={cn(
                "absolute flex size-11 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-br-none rotate-45 border-[3px] border-card font-display text-base font-bold shadow-card transition-transform hover:scale-110",
                active ? "z-10 scale-110 bg-cta text-cta-foreground" : "bg-card text-primary",
              )}
              style={{ left: `${clinic.pos.x}%`, top: `${clinic.pos.y}%` }}
            >
              <span className="-rotate-45">{i + 1}</span>
            </button>
          );
        })}
        <p className="absolute bottom-2 left-3 rounded bg-card/80 px-2 text-xs text-muted-foreground">Mapa poglądowa</p>
      </div>

      {selected ? (
        <div className="flex flex-col gap-4 rounded-3xl border-2 border-cta bg-card p-5 shadow-card" aria-live="polite">
          <div className="space-y-2">
            <ContractBadge clinic={selected.clinic} />
            <h3 className="text-2xl font-bold leading-snug">{selected.clinic.name}</h3>
            <p className="text-muted-foreground">{selected.clinic.address}</p>
            <p className="flex items-center gap-1.5 font-semibold">
              <Navigation aria-hidden="true" className="size-5 text-primary" />
              {formatDistance(selected.metres)} • {walkingMinutes(selected.metres)} min pieszo
            </p>
          </div>
          <SlotStatus clinic={selected.clinic} specialty={specialty} />
          <Button variant="cta" size="hero" className="mt-auto" onClick={() => onBook(selected.clinic.id)}>
            <CalendarCheck aria-hidden="true" />
            UMÓW WIZYTĘ TUTAJ
          </Button>
        </div>
      ) : (
        <p className="rounded-3xl bg-muted p-6">Brak przychodni dla wybranych filtrów.</p>
      )}
    </div>
  );
}
