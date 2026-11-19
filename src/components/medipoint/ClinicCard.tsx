import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, Clock, Footprints, MapPin, Phone, ShieldCheck, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SPECIALTY_LABELS,
  doctorOf,
  formatDistance,
  isOpenNow,
  slotsForDay,
  walkingMinutes,
  type Clinic,
  type Specialty,
} from "@/lib/clinics";
import { cn } from "@/lib/utils";

export function ContractBadge({ clinic }: { clinic: Clinic }) {
  return clinic.nfz ? (
    <Badge variant="nfz">
      <ShieldCheck aria-hidden="true" />
      NFZ – bezpłatnie
    </Badge>
  ) : (
    <Badge variant="private">
      <Wallet aria-hidden="true" />
      Prywatnie · od {clinic.priceFrom} zł
    </Badge>
  );
}

export function SlotStatus({ clinic, specialty }: { clinic: Clinic; specialty?: Specialty | null | undefined }) {
  const today = slotsForDay(clinic, 0, specialty);
  if (today.length > 0) {
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-success-soft px-4 py-2.5 font-semibold text-success-foreground senior:border-2 senior:border-success">
        <span aria-hidden="true" className="inline-block size-3 rounded-full bg-success" />
        Wolne terminy DZISIAJ:
        <span className="font-bold">{today.slice(0, 3).map((s) => s.time).join(", ")}</span>
      </p>
    );
  }
  const tomorrow = slotsForDay(clinic, 1, specialty);
  const next = tomorrow[0] ?? slotsForDay(clinic, 2, specialty)[0];
  return (
    <p className="flex flex-wrap items-center gap-2 rounded-xl bg-muted px-4 py-2.5 font-semibold text-foreground">
      <Clock aria-hidden="true" className="size-5 text-muted-foreground" />
      {next ? (
        <>
          Najbliższy wolny termin: <span className="font-bold">{tomorrow[0] ? "JUTRO" : "POJUTRZE"} {next.time}</span>
        </>
      ) : (
        "Brak wolnych terminów w tym tygodniu"
      )}
    </p>
  );
}

export function OpenStatus({ clinic, now }: { clinic: Clinic; now: Date | null }) {
  const hours = `${clinic.hours[0]}:00–${clinic.hours[1]}:00`;
  if (!now) return <span className="text-muted-foreground">Godziny otwarcia: {hours}</span>;
  const open = isOpenNow(clinic, now);
  return (
    <span className={cn("font-semibold", open ? "text-success-foreground" : "text-muted-foreground")}>
      {open ? `Otwarte teraz · do ${clinic.hours[1]}:00` : `Teraz zamknięte · czynne ${hours}`}
    </span>
  );
}

interface ClinicCardProps {
  clinic: Clinic;
  metres: number;
  specialty?: Specialty | null | undefined;
  now: Date | null;
  selected: boolean;
  onSelect: () => void;
  onBook: () => void;
}

export function ClinicCard({ clinic, metres, specialty, now, selected, onSelect, onBook }: ClinicCardProps) {
  const specialties = Array.from(new Set(clinic.doctors.map((d) => d.specialty)));
  const firstToday = slotsForDay(clinic, 0, specialty)[0];
  const firstDoctor = firstToday ? doctorOf(clinic, firstToday.doctorId) : undefined;

  return (
    <article
      aria-labelledby={`clinic-${clinic.id}`}
      onClick={onSelect}
      onFocus={onSelect}
      className={cn(
        "group flex flex-col gap-4 rounded-3xl border-2 bg-card p-5 shadow-card transition-all sm:p-6",
        selected ? "border-cta ring-4 ring-cta/15" : "border-transparent hover:border-border",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 id={`clinic-${clinic.id}`} className="text-xl font-bold leading-snug sm:text-2xl">
            <Link
              to="/przychodnia/$clinicId"
              params={{ clinicId: clinic.id }}
              className="rounded-sm underline-offset-4 hover:underline"
            >
              {clinic.name}
            </Link>
          </h3>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {clinic.address}
          </p>
        </div>
        <ContractBadge clinic={clinic} />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-base">
        <span className="flex items-center gap-1.5 font-semibold">
          <Footprints aria-hidden="true" className="size-5 text-primary" />
          {formatDistance(metres)} • {walkingMinutes(metres)} min pieszo
        </span>
        <OpenStatus clinic={clinic} now={now} />
      </div>

      <SlotStatus clinic={clinic} specialty={specialty} />

      <ul className="flex flex-wrap gap-2 senior:hidden" aria-label="Lekarze w przychodni">
        {specialties.map((sp) => (
          <li key={sp}>
            <Badge variant={sp === specialty ? "success" : "muted"} className="font-medium">
              {SPECIALTY_LABELS[sp]}
            </Badge>
          </li>
        ))}
      </ul>

      <Button
        variant="cta"
        size="hero"
        onClick={(e) => {
          e.stopPropagation();
          onBook();
        }}
        aria-label={`Umów wizytę w przychodni ${clinic.name}`}
        className="mt-1"
      >
        <CalendarCheck aria-hidden="true" />
        UMÓW WIZYTĘ W TEJ PRZYCHODNI
      </Button>
      {firstDoctor && (
        <p className="-mt-2 text-center text-sm text-muted-foreground">
          Najbliżej: dziś {firstToday!.time} · {firstDoctor.name}, gabinet {firstDoctor.room}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <Link
          to="/przychodnia/$clinicId"
          params={{ clinicId: clinic.id }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-semibold text-primary hover:bg-secondary"
        >
          Lekarze i godziny otwarcia
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
        <a
          href={`tel:${clinic.phone.replace(/\s/g, "")}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-semibold text-foreground hover:bg-secondary"
        >
          <Phone aria-hidden="true" className="size-5 text-primary" />
          {clinic.phone}
        </a>
      </div>
    </article>
  );
}
