import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  DoorOpen,
  Home,
  MessageSquareText,
  Printer,
  Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppointments } from "@/lib/appointments";
import {
  dayLabel,
  formatPhone,
  longDate,
  normalisePhone,
  slotDate,
  ticketNumber,
  validatePatient,
  type PatientErrors,
  type PatientInfo,
} from "@/lib/booking";
import {
  SPECIALTY_LABELS,
  doctorOf,
  hasSpecialty,
  slotsForDay,
  type Clinic,
  type Slot,
  type Specialty,
} from "@/lib/clinics";
import { cn } from "@/lib/utils";

import { ContractBadge } from "./ClinicCard";
import { PrintTicket } from "./PrintTicket";

type Step = 1 | 2 | 3;
const STEPS = ["Termin", "Dane pacjenta", "Potwierdzenie"] as const;
const DAYS = [0, 1, 2] as const;

interface BookingDialogProps {
  clinic: Clinic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty?: Specialty | null | undefined;
}

function StepProgress({ step }: { step: Step }) {
  return (
    <nav aria-label="Postęp rezerwacji" className="no-print">
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((label, i) => {
          const n = (i + 1) as Step;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} aria-current={current ? "step" : undefined} className="space-y-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-colors",
                  done || current ? "bg-cta" : "bg-muted senior:bg-border",
                )}
              />
              <p
                className={cn(
                  "text-sm leading-tight sm:text-base",
                  current ? "font-bold text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="block text-xs font-semibold uppercase tracking-wide senior:text-sm">
                  Krok {n}
                </span>
                {label}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BookingDialog({ clinic, open, onOpenChange, specialty }: BookingDialogProps) {
  const navigate = useNavigate();
  const { addAppointment } = useAppointments();
  const [step, setStep] = useState<Step>(1);
  const [day, setDay] = useState<0 | 1 | 2>(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [onlySpecialty, setOnlySpecialty] = useState(true);
  const [patient, setPatient] = useState<PatientInfo>({ fullName: "", phone: "", pesel: "" });
  const [errors, setErrors] = useState<PatientErrors>({});
  const [ticket, setTicket] = useState("");
  const [base] = useState(() => new Date());

  const filterBySpecialty = !!(specialty && clinic && hasSpecialty(clinic, specialty) && onlySpecialty);
  const activeSpecialty = filterBySpecialty ? specialty : null;

  // Reset whenever a new booking starts
  useEffect(() => {
    if (!open || !clinic) return;
    setStep(1);
    setSlot(null);
    setErrors({});
    setTicket("");
    setOnlySpecialty(true);
    const first = DAYS.find((d) => slotsForDay(clinic, d, specialty && hasSpecialty(clinic, specialty) ? specialty : null).length > 0);
    setDay(first ?? 0);
  }, [open, clinic, specialty]);

  const daySlots = useMemo(
    () => (clinic ? slotsForDay(clinic, day, activeSpecialty) : []),
    [clinic, day, activeSpecialty],
  );

  if (!clinic) return null;

  const doctor = slot ? doctorOf(clinic, slot.doctorId) : undefined;
  const when = slot ? slotDate(base, slot.day, slot.time) : null;

  const submitPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validatePatient(patient);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstField = (Object.keys(errs) as (keyof PatientInfo)[])[0];
      document.getElementById(`patient-${firstField}`)?.focus();
      return;
    }
    const newTicket = ticketNumber();
    if (slot && doctor && when) {
      addAppointment({
        id: newTicket,
        clinicId: clinic.id,
        clinicName: clinic.name,
        clinicAddress: clinic.address,
        clinicPhone: clinic.phone,
        nfz: clinic.nfz,
        ...(clinic.priceFrom !== undefined ? { priceFrom: clinic.priceFrom } : {}),
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorRoom: doctor.room,
        dateIso: when.toISOString(),
        time: slot.time,
        patientName: patient.fullName.trim(),
        patientPhone: formatPhone(normalisePhone(patient.phone) ?? ""),
        createdAtIso: new Date().toISOString(),
      });
    }
    setTicket(newTicket);
    setStep(3);
  };

  const field = (key: keyof PatientInfo) => ({
    id: `patient-${key}`,
    value: patient[key],
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `patient-${key}-error` : `patient-${key}-hint`,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setPatient((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] max-w-2xl flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[92vh] sm:rounded-3xl">
        <div className="no-print space-y-4 border-b bg-muted/60 px-5 pb-4 pt-5 pr-16 sm:px-7">
          <div>
            <DialogTitle className="font-display text-2xl font-bold leading-tight">
              {step === 3 ? "Wizyta umówiona!" : "Umów wizytę"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-base text-muted-foreground">
              {clinic.name} · {clinic.address}
            </DialogDescription>
          </div>
          <StepProgress step={step} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              {specialty && hasSpecialty(clinic, specialty) && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3">
                  <p className="font-semibold text-secondary-foreground">
                    {onlySpecialty
                      ? `Pokazujemy terminy: ${SPECIALTY_LABELS[specialty]}`
                      : "Pokazujemy terminy wszystkich lekarzy"}
                  </p>
                  <Button variant="link" className="min-h-10 px-1" onClick={() => setOnlySpecialty((v) => !v)}>
                    {onlySpecialty ? "Pokaż wszystkich lekarzy" : `Tylko ${SPECIALTY_LABELS[specialty]}`}
                  </Button>
                </div>
              )}

              <fieldset>
                <legend className="mb-3 font-display text-lg font-semibold">1. Wybierz dzień</legend>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {DAYS.map((d) => {
                    const { top, date } = dayLabel(base, d);
                    const count = slotsForDay(clinic, d, activeSpecialty).length;
                    const active = d === day;
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={active}
                        disabled={count === 0}
                        onClick={() => {
                          setDay(d);
                          setSlot(null);
                        }}
                        className={cn(
                          "flex min-h-20 flex-col items-center justify-center rounded-2xl border-2 px-2 py-3 text-center transition-all disabled:cursor-not-allowed disabled:opacity-50",
                          active
                            ? "border-cta bg-success-soft text-success-foreground shadow-card"
                            : "border-border bg-card hover:border-primary",
                        )}
                      >
                        <span className="text-sm font-bold tracking-wide sm:text-base">{top}</span>
                        <span className="font-display text-lg font-semibold">({date})</span>
                        <span className="text-xs text-muted-foreground senior:text-sm">
                          {count === 0 ? "brak terminów" : `${count} ${count === 1 ? "termin" : count < 5 ? "terminy" : "terminów"}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-display text-lg font-semibold">2. Wybierz godzinę</legend>
                {daySlots.length === 0 ? (
                  <p className="rounded-xl bg-muted px-4 py-3">Tego dnia nie ma wolnych terminów. Wybierz inny dzień.</p>
                ) : (
                  <div role="radiogroup" aria-label="Wolne godziny" className="grid gap-3 sm:grid-cols-2">
                    {daySlots.map((sl) => {
                      const doc = doctorOf(clinic, sl.doctorId);
                      const active = slot?.id === sl.id;
                      return (
                        <button
                          key={sl.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSlot(sl)}
                          className={cn(
                            "flex min-h-16 items-center gap-4 rounded-2xl border-2 p-3 text-left transition-all",
                            active ? "border-cta bg-success-soft shadow-card" : "border-border bg-card hover:border-primary",
                          )}
                        >
                          <span
                            className={cn(
                              "rounded-xl px-3 py-2 font-display text-xl font-bold tabular-nums",
                              active ? "bg-cta text-cta-foreground" : "bg-secondary text-secondary-foreground",
                            )}
                          >
                            {sl.time}
                          </span>
                          <span className="min-w-0 leading-snug">
                            <span className="block font-semibold">{doc?.name}</span>
                            <span className="block text-sm text-muted-foreground">
                              {doc && SPECIALTY_LABELS[doc.specialty]} · gabinet {doc?.room}
                            </span>
                          </span>
                          {active && <CheckCircle2 aria-hidden="true" className="ml-auto size-7 shrink-0 text-cta" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <form id="patient-form" noValidate onSubmit={submitPatient} className="space-y-6 animate-fade-up">
              {slot && doctor && when && (
                <p className="rounded-xl bg-secondary px-4 py-3 font-semibold text-secondary-foreground">
                  {longDate(when)}, godz. {slot.time} · {doctor.name}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="patient-fullName" className="text-lg font-semibold">
                  Imię i nazwisko
                </Label>
                <Input {...field("fullName")} autoComplete="name" placeholder="np. Jan Kowalski" className="min-h-14 text-xl" />
                {errors.fullName ? (
                  <p id="patient-fullName-error" className="font-semibold text-destructive">{errors.fullName}</p>
                ) : (
                  <p id="patient-fullName-hint" className="text-muted-foreground">Osoba, która przyjdzie na wizytę.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-phone" className="text-lg font-semibold">
                  Numer telefonu
                </Label>
                <Input
                  {...field("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="np. 600 123 456"
                  className="min-h-14 text-xl tracking-wide"
                />
                {errors.phone ? (
                  <p id="patient-phone-error" className="font-semibold text-destructive">{errors.phone}</p>
                ) : (
                  <p id="patient-phone-hint" className="text-muted-foreground">Wyślemy SMS z przypomnieniem. Za darmo.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-pesel" className="text-lg font-semibold">
                  PESEL <span className="font-normal text-muted-foreground">(nieobowiązkowo)</span>
                </Label>
                <Input {...field("pesel")} inputMode="numeric" autoComplete="off" placeholder="11 cyfr" className="min-h-14 text-xl tracking-widest" />
                {errors.pesel ? (
                  <p id="patient-pesel-error" className="font-semibold text-destructive">{errors.pesel}</p>
                ) : (
                  <p id="patient-pesel-hint" className="text-muted-foreground">Przyspieszy rejestrację w okienku. Możesz pominąć.</p>
                )}
              </div>
            </form>
          )}

          {step === 3 && slot && doctor && when && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center" role="status">
                <span className="grid size-24 place-items-center rounded-full bg-success-soft animate-pop">
                  <CheckCircle2 aria-hidden="true" className="size-16 text-cta" strokeWidth={2.25} />
                </span>
                <p className="mt-4 font-display text-2xl font-bold">Gotowe! Czekamy na Ciebie.</p>
                <p className="text-muted-foreground">Nie musisz nic więcej robić.</p>
              </div>

              <section aria-label="Podsumowanie wizyty" className="overflow-hidden rounded-3xl border-2 border-cta bg-card">
                <div className="flex items-center justify-between gap-2 bg-cta px-5 py-3 text-cta-foreground">
                  <span className="font-display text-lg font-semibold">MediPoint · potwierdzenie</span>
                  <span className="font-display text-xl font-bold tabular-nums">{ticket}</span>
                </div>
                <dl className="grid gap-4 p-5 text-lg sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Kiedy</dt>
                    <dd className="font-display text-2xl font-bold first-letter:uppercase">
                      {longDate(when)}, godz. {slot.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Lekarz</dt>
                    <dd className="flex items-start gap-2 font-semibold">
                      <Stethoscope aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                      <span>
                        {doctor.name}
                        <span className="block font-normal text-muted-foreground">{SPECIALTY_LABELS[doctor.specialty]}</span>
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Gabinet</dt>
                    <dd className="flex items-center gap-2 font-semibold">
                      <DoorOpen aria-hidden="true" className="size-5 text-primary" />
                      nr {doctor.room}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Gdzie</dt>
                    <dd className="font-semibold">
                      {clinic.name}
                      <span className="block font-normal">{clinic.address} · tel. {clinic.phone}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pacjent</dt>
                    <dd className="font-semibold">{patient.fullName.trim()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Koszt</dt>
                    <dd className="pt-1">
                      <ContractBadge clinic={clinic} />
                    </dd>
                  </div>
                </dl>
              </section>

              <p className="no-print flex items-start gap-3 rounded-2xl bg-success-soft px-4 py-3 text-success-foreground">
                <CalendarCheck aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-cta" />
                <span>
                  Wizyta została <strong>automatycznie zapisana</strong> w Twoim kalendarzu{" "}
                  <strong>Moje wizyty</strong> w MediPoint.
                </span>
              </p>

              <p className="no-print flex items-start gap-3 rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
                <MessageSquareText aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary" />
                <span>
                  <span className="mr-2 inline-block rounded-full bg-cta px-2.5 py-0.5 text-sm font-bold text-cta-foreground">
                    BEZPŁATNIE
                  </span>
                  Dzień przed wizytą wyślemy SMS z przypomnieniem na numer{" "}
                  <strong className="whitespace-nowrap">{formatPhone(normalisePhone(patient.phone) ?? "")}</strong>.
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="no-print border-t bg-card px-5 py-4 sm:px-7">
          {step === 1 && (
            <Button variant="cta" size="hero" disabled={!slot} onClick={() => setStep(2)}>
              {slot ? `Dalej: Twoje dane` : "Wybierz godzinę, aby przejść dalej"}
              {slot && <ArrowRight aria-hidden="true" />}
            </Button>
          )}
          {step === 2 && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button variant="outline" size="xl" onClick={() => setStep(1)} className="sm:w-auto">
                <ArrowLeft aria-hidden="true" />
                Wstecz
              </Button>
              <Button variant="cta" size="hero" type="submit" form="patient-form" className="sm:flex-1">
                <CheckCircle2 aria-hidden="true" />
                POTWIERDŹ WIZYTĘ
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="default" size="xl" onClick={() => window.print()}>
                <Printer aria-hidden="true" />
                Drukuj (duży druk)
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  onOpenChange(false);
                  navigate({ to: "/kalendarz" });
                  window.scrollTo({ top: 0 });
                }}
              >
                <CalendarCheck aria-hidden="true" />
                Kalendarz wizyt
              </Button>
              <Button
                variant="cta"
                size="xl"
                className="sm:col-span-2"
                onClick={() => {
                  onOpenChange(false);
                  navigate({ to: "/" });
                  window.scrollTo({ top: 0 });
                }}
              >
                <Home aria-hidden="true" />
                Wróć na stronę główną
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
      {open && step === 3 && slot && doctor && when && (
        <PrintTicket
          data={{
            ticket,
            when,
            time: slot.time,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            doctorRoom: doctor.room,
            clinicName: clinic.name,
            clinicAddress: clinic.address,
            clinicPhone: clinic.phone,
            patientName: patient.fullName.trim(),
            patientPhone: formatPhone(normalisePhone(patient.phone) ?? ""),
            nfz: clinic.nfz,
            ...(clinic.priceFrom !== undefined ? { priceFrom: clinic.priceFrom } : {}),
          }}
        />
      )}
    </Dialog>
  );
}
