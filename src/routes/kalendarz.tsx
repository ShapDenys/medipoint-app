import { Link, createFileRoute } from "@tanstack/react-router";
import { pl } from "date-fns/locale";
import { ArrowLeft, CalendarCheck, CalendarDays, DoorOpen, MapPin, Phone, Printer, Stethoscope, Trash2, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PrintTicket, type PrintTicketData } from "@/components/medipoint/PrintTicket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { appointmentsOnDay, sameCalendarDay, useAppointments, type BookedAppointment } from "@/lib/appointments";
import { longDate } from "@/lib/booking";
import { SPECIALTY_LABELS } from "@/lib/clinics";

export const Route = createFileRoute("/kalendarz")({
  head: () => ({
    meta: [
      { title: "Moje wizyty – kalendarz rejestracji | MediPoint" },
      {
        name: "description",
        content: "Kalendarz zarejestrowanych wizyt lekarskich w MediPoint. Zobacz terminy, wydrukuj potwierdzenie lub odwołaj wizytę.",
      },
    ],
  }),
  component: CalendarPage,
});

function toPrintData(a: BookedAppointment): PrintTicketData {
  return {
    ticket: a.id,
    when: new Date(a.dateIso),
    time: a.time,
    doctorName: a.doctorName,
    doctorSpecialty: a.doctorSpecialty,
    doctorRoom: a.doctorRoom,
    clinicName: a.clinicName,
    clinicAddress: a.clinicAddress,
    clinicPhone: a.clinicPhone,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    nfz: a.nfz,
    ...(a.priceFrom !== undefined ? { priceFrom: a.priceFrom } : {}),
  };
}

function CalendarPage() {
  const { appointments, removeAppointment } = useAppointments();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [printing, setPrinting] = useState<BookedAppointment | null>(null);

  useEffect(() => {
    if (!printing) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.print();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [printing]);

  useEffect(() => {
    const onAfterPrint = () => setPrinting(null);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  const bookedDays = useMemo(() => appointments.map((a) => new Date(a.dateIso)), [appointments]);

  const visibleAppointments = useMemo(() => {
    if (!selectedDay) return appointments;
    return appointmentsOnDay(appointments, selectedDay);
  }, [appointments, selectedDay]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Wróć do przychodni
          </Link>
        </Button>
      </div>

      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-success-soft text-cta">
            <CalendarDays aria-hidden="true" className="size-7" />
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl">Kalendarz rejestracji (Moje wizyty)</h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Każda potwierdzona wizyta trafia tu automatycznie. Możesz sprawdzić terminy, wydrukować potwierdzenie dużym drukiem lub odwołać rezerwację.
        </p>
      </header>

      {appointments.length === 0 ? (
        <section className="space-y-5 rounded-3xl border-2 border-dashed bg-card p-8 text-center shadow-card sm:p-12">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-secondary text-primary">
            <CalendarCheck aria-hidden="true" className="size-9" />
          </span>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold">Nie masz jeszcze zapisanych wizyt</h2>
            <p className="mx-auto max-w-md text-lg text-muted-foreground">
              Wybierz najbliższą przychodnię i potwierdź rezerwację – wizyta pojawi się w tym kalendarzu automatycznie.
            </p>
          </div>
          <Button asChild variant="cta" size="xl">
            <Link to="/">Znajdź przychodnię i umów wizytę</Link>
          </Button>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
          <aside className="rounded-3xl border-2 bg-card p-4 shadow-card sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">Wybierz dzień</h2>
              {selectedDay && (
                <Button variant="link" size="sm" onClick={() => setSelectedDay(undefined)}>
                  Pokaż wszystkie ({appointments.length})
                </Button>
              )}
            </div>
            <Calendar
              mode="single"
              locale={pl}
              selected={selectedDay}
              onSelect={(day) => setSelectedDay((prev) => (day && prev && sameCalendarDay(prev, day) ? undefined : day))}
              modifiers={{ booked: bookedDays }}
              modifiersClassNames={{
                booked: "bg-success-soft text-success-foreground font-bold ring-2 ring-cta/50 rounded-md",
              }}
              className="mx-auto [--cell-size:2.75rem]"
            />
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden="true" className="inline-block size-3.5 rounded-sm bg-success-soft ring-2 ring-cta/50" />
              Dni z zaplanowaną wizytą
            </p>
          </aside>

          <section aria-label="Lista zarejestrowanych wizyt" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl font-bold">
                {selectedDay ? `Wizyty: ${longDate(selectedDay)}` : `Wszystkie zapisane wizyty (${appointments.length})`}
              </h2>
            </div>

            {visibleAppointments.length === 0 ? (
              <div className="space-y-3 rounded-3xl border-2 border-dashed bg-card p-6 text-center">
                <p className="text-lg font-semibold">Brak wizyt w wybranym dniu.</p>
                <Button variant="outline" onClick={() => setSelectedDay(undefined)}>
                  Pokaż wszystkie wizyty
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {visibleAppointments.map((a) => {
                  const when = new Date(a.dateIso);
                  return (
                    <li key={a.id} className="overflow-hidden rounded-3xl border-2 border-cta/60 bg-card shadow-card">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-cta px-5 py-3 text-cta-foreground">
                        <span className="font-display text-lg font-bold first-letter:uppercase">
                          {longDate(when)}, godz. {a.time}
                        </span>
                        <span className="rounded-full bg-background/20 px-3 py-0.5 font-display text-base font-bold tabular-nums">
                          {a.id}
                        </span>
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="font-display text-xl font-bold">{a.clinicName}</h3>
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin aria-hidden="true" className="size-4 shrink-0" />
                              {a.clinicAddress} ·{" "}
                              <a href={`tel:${a.clinicPhone.replace(/\s/g, "")}`} className="underline underline-offset-2">
                                {a.clinicPhone}
                              </a>
                            </p>
                          </div>
                          <Badge variant={a.nfz ? "nfz" : "private"}>
                            {a.nfz ? "NFZ – bezpłatnie" : `Prywatnie · od ${a.priceFrom ?? 0} zł`}
                          </Badge>
                        </div>

                        <dl className="grid gap-3 rounded-2xl bg-muted/60 p-4 text-base sm:grid-cols-3">
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pacjent</dt>
                            <dd className="mt-0.5 flex items-center gap-1.5 font-semibold">
                              <User aria-hidden="true" className="size-4 shrink-0 text-primary" />
                              {a.patientName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lekarz</dt>
                            <dd className="mt-0.5 flex items-start gap-1.5 font-semibold">
                              <Stethoscope aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                              <span>
                                {a.doctorName}
                                <span className="block text-sm font-normal text-muted-foreground">
                                  {SPECIALTY_LABELS[a.doctorSpecialty]}
                                </span>
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gabinet</dt>
                            <dd className="mt-0.5 flex items-center gap-1.5 font-semibold">
                              <DoorOpen aria-hidden="true" className="size-4 shrink-0 text-primary" />
                              nr {a.doctorRoom}
                            </dd>
                          </div>
                        </dl>

                        <div className="flex flex-wrap gap-3">
                          <Button variant="default" size="lg" onClick={() => setPrinting(a)}>
                            <Printer aria-hidden="true" />
                            Drukuj potwierdzenie
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => {
                              removeAppointment(a.id);
                              toast("Wizyta została odwołana", {
                                description: `${a.clinicName}, ${longDate(when)} o ${a.time}.`,
                              });
                            }}
                          >
                            <Trash2 aria-hidden="true" />
                            Odwołaj wizytę
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      <PrintTicket data={printing ? toPrintData(printing) : null} />
    </div>
  );
}
