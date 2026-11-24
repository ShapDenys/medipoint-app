import { Link } from "@tanstack/react-router";
import { CalendarDays, Check, Eye, HeartPulse, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useAppointments } from "@/lib/appointments";
import { useAppPrefs } from "@/lib/app-prefs";
import { DISTRICTS, getDistrict } from "@/lib/clinics";
import { cn } from "@/lib/utils";

export function EmergencyBanner() {
  return (
    <div role="region" aria-label="Pomoc w nagłych wypadkach" className="no-print bg-emergency-soft border-b border-emergency/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <p className="flex items-center gap-2 font-semibold text-emergency">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-emergency animate-pulse" />
          W stanie zagrożenia życia zadzwoń pod 112
        </p>
        <Button asChild variant="emergency" size="sm" className="min-h-10 px-4">
          <a href="tel:112" aria-label="Zadzwoń pod numer alarmowy 112">
            <Phone aria-hidden="true" />
            Zadzwoń 112
          </a>
        </Button>
      </div>
    </div>
  );
}

function LocationPicker() {
  const { districtId, setDistrictId, gpsDetected, setGpsDetected } = useAppPrefs();
  const [open, setOpen] = useState(false);
  const district = getDistrict(districtId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <MapPin aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <span className="leading-tight">
            <span className="block text-xs text-muted-foreground senior:text-sm">
              Twoja lokalizacja{gpsDetected ? " (GPS)" : ""}
            </span>
            <span className="font-semibold">Poznań, {district.name}</span>
          </span>
          <span className="ml-1 text-sm font-semibold text-primary underline underline-offset-2">Zmień</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-xl p-3">
        <p className="px-2 pb-2 font-display font-semibold">Wybierz swoją dzielnicę</p>
        <ul className="space-y-1">
          {DISTRICTS.map((d) => {
            const active = d.id === districtId;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setDistrictId(d.id);
                    setGpsDetected(false);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-base font-medium transition-colors hover:bg-secondary",
                    active && "bg-secondary text-primary",
                  )}
                >
                  Poznań, {d.name}
                  {active && <Check aria-hidden="true" className="size-5" />}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function SeniorToggle() {
  const { senior, setSenior } = useAppPrefs();
  return (
    <label
      htmlFor="senior-mode"
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-3 rounded-full border-2 px-4 py-1.5 transition-colors",
        senior ? "border-foreground bg-foreground text-background" : "border-primary/30 bg-secondary text-secondary-foreground hover:border-primary",
      )}
    >
      <Eye aria-hidden="true" className="size-6 shrink-0" />
      <span className="leading-tight">
        <span className="block font-bold">Tryb Seniora / Duży Tekst</span>
        <span className={cn("block text-xs senior:text-sm", senior ? "text-background" : "text-muted-foreground")}>
          Większe litery i kontrast
        </span>
      </span>
      <Switch
        id="senior-mode"
        checked={senior}
        onCheckedChange={setSenior}
        className="ml-1 data-[state=checked]:bg-cta"
      />
    </label>
  );
}

function CalendarNavButton() {
  const { appointments } = useAppointments();
  const count = appointments.length;
  return (
    <Link
      to="/kalendarz"
      className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      <CalendarDays aria-hidden="true" className="size-5 shrink-0 text-primary" />
      <span>Moje wizyty</span>
      {count > 0 && (
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-cta px-2 py-0.5 text-xs font-bold tabular-nums text-cta-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="no-print relative z-40 md:sticky md:top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="mr-auto flex items-center gap-2.5 rounded-lg" aria-label="MediPoint – strona główna">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <HeartPulse aria-hidden="true" className="size-6" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl font-bold tracking-tight text-foreground">
              Medi<span className="text-cta">Point</span>
            </span>
            <span className="block text-xs font-medium text-muted-foreground senior:hidden">NearClinic · przychodnie blisko Ciebie</span>
          </span>
        </Link>
        <CalendarNavButton />
        <LocationPicker />
        <SeniorToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1">
          <p className="font-display font-semibold text-foreground">MediPoint</p>
          <p>Podpowiedzi asystenta nie zastępują porady lekarza.</p>
          <p>To wersja pokazowa – terminy i przychodnie są przykładowe.</p>
        </div>
        <p>
          Telefoniczna Informacja Pacjenta NFZ:{" "}
          <a href="tel:800190590" className="font-semibold text-foreground underline underline-offset-2">
            800 190 590
          </a>
        </p>
      </div>
    </footer>
  );
}
