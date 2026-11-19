import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck, Clock, DoorOpen, Footprints, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { BookingDialog } from "@/components/medipoint/BookingDialog";
import { ContractBadge, OpenStatus, SlotStatus } from "@/components/medipoint/ClinicCard";
import { StickyBookBar } from "@/components/medipoint/StickyBookBar";
import { Button } from "@/components/ui/button";
import { useAppPrefs, useNow } from "@/lib/app-prefs";
import {
  SPECIALTY_LABELS,
  distanceMetres,
  formatDistance,
  getClinic,
  getDistrict,
  slotsForDay,
  walkingMinutes,
} from "@/lib/clinics";

export const Route = createFileRoute("/przychodnia/$clinicId")({
  loader: ({ params }) => {
    const clinic = getClinic(params.clinicId);
    if (!clinic) throw notFound();
    return { clinic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Nie znaleziono przychodni – MediPoint" }, { name: "robots", content: "noindex" }] };
    }
    const { clinic } = loaderData;
    const title = `${clinic.name} – umów wizytę | MediPoint`;
    const description = `${clinic.name}, ${clinic.address}. ${clinic.nfz ? "NFZ – bezpłatnie" : `Prywatnie od ${clinic.priceFrom} zł`}. Sprawdź wolne terminy i umów wizytę w 3 krokach.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Nie znaleźliśmy tej przychodni</h1>
      <Button asChild size="xl">
        <Link to="/">Wróć do listy przychodni</Link>
      </Button>
    </div>
  ),
  component: ClinicPage,
});

function ClinicPage() {
  const { clinic } = Route.useLoaderData();
  const { districtId } = useAppPrefs();
  const now = useNow();
  const [booking, setBooking] = useState(false);
  const metres = distanceMetres(getDistrict(districtId).pos, clinic);

  return (
    <div className="pb-40 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Wszystkie przychodnie
          </Link>
        </Button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-4 lg:grid-cols-[1.3fr_1fr] senior:lg:grid-cols-1">
        <div className="space-y-6">
          <div className="space-y-3">
            <ContractBadge clinic={clinic} />
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{clinic.name}</h1>
            <p className="flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin aria-hidden="true" className="size-5 shrink-0" />
              {clinic.address}
            </p>
          </div>

          <dl className="grid gap-4 rounded-3xl border-2 bg-card p-5 text-lg shadow-card sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Footprints aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Odległość</dt>
                <dd className="font-semibold">
                  {formatDistance(metres)} • {walkingMinutes(metres)} min pieszo
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Godziny</dt>
                <dd>
                  <OpenStatus clinic={clinic} now={now} />
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <Phone aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Rejestracja telefoniczna</dt>
                <dd>
                  <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="font-semibold underline underline-offset-4">
                    {clinic.phone}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <section aria-labelledby="doctors-title" className="space-y-4">
            <h2 id="doctors-title" className="text-2xl font-bold">
              Lekarze i gabinety
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {clinic.doctors.map((d) => {
                const next = slotsForDay(clinic, 0).find((s) => s.doctorId === d.id) ?? slotsForDay(clinic, 1).find((s) => s.doctorId === d.id);
                return (
                  <li key={d.id} className="rounded-2xl border-2 bg-card p-4">
                    <p className="font-display text-lg font-semibold">{d.name}</p>
                    <p className="text-muted-foreground">{SPECIALTY_LABELS[d.specialty]}</p>
                    <p className="mt-2 flex items-center gap-2 font-semibold">
                      <DoorOpen aria-hidden="true" className="size-5 text-primary" />
                      Gabinet {d.room}
                    </p>
                    {next && (
                      <p className="mt-1 text-success-foreground font-semibold">
                        Wolny termin: {next.day === 0 ? "dziś" : "jutro"} {next.time}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-5 rounded-3xl border-2 border-cta bg-card p-6 shadow-card">
            <p className="font-display text-2xl font-bold">Umów się w 3 krokach</p>
            <ol className="space-y-2 text-lg">
              <li>1. Wybierz dzień i godzinę</li>
              <li>2. Podaj imię i telefon</li>
              <li>3. Gotowe – przyślemy SMS</li>
            </ol>
            <SlotStatus clinic={clinic} />
            <Button variant="cta" size="hero" onClick={() => setBooking(true)}>
              <CalendarCheck aria-hidden="true" />
              UMÓW WIZYTĘ
            </Button>
          </div>
        </aside>
      </div>

      {!booking && <StickyBookBar clinicName={clinic.name} onBook={() => setBooking(true)} />}
      <BookingDialog clinic={clinic} open={booking} onOpenChange={setBooking} />
    </div>
  );
}
