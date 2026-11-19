import { createFileRoute } from "@tanstack/react-router";
import { List, Map as MapIcon, X } from "lucide-react";
import { useMemo, useState } from "react";

import { BookingDialog } from "@/components/medipoint/BookingDialog";
import { ClinicCard } from "@/components/medipoint/ClinicCard";
import { ClinicMap } from "@/components/medipoint/ClinicMap";
import { Hero } from "@/components/medipoint/Hero";
import { StickyBookBar } from "@/components/medipoint/StickyBookBar";
import { SymptomConcierge } from "@/components/medipoint/SymptomConcierge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppPrefs, useNow } from "@/lib/app-prefs";
import { CLINICS, QUICK_FILTERS, SPECIALTY_LABELS, findClinics, getClinic, getDistrict, type QuickFilter } from "@/lib/clinics";
import type { SymptomMatch } from "@/lib/symptoms";

const TITLE = "MediPoint – znajdź przychodnię i umów wizytę w 3 krokach";
const DESCRIPTION =
  "Najbliższe przychodnie w Poznaniu z wolnymi terminami na dziś. Duże przyciski, Tryb Seniora i asystent, który podpowie, do jakiego lekarza się zapisać.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function scrollToClinics() {
  document.getElementById("przychodnie")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HomePage() {
  const { districtId, senior } = useAppPrefs();
  const district = getDistrict(districtId);
  const now = useNow();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<QuickFilter>("all");
  const [match, setMatch] = useState<SymptomMatch | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const specialty = match && !match.urgent ? match.specialty : null;

  const results = useMemo(
    () => findClinics(CLINICS, { filter, specialty, text: query, from: district.pos, now: now ?? new Date() }),
    [filter, specialty, query, district, now],
  );

  const selected = selectedId ? getClinic(selectedId) : undefined;
  const bookingClinic = bookingId ? (getClinic(bookingId) ?? null) : null;

  const openBooking = (id: string) => {
    setSelectedId(id);
    setBookingId(id);
  };

  return (
    <div className={selected ? "pb-40 md:pb-0" : undefined}>
      <Hero
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        onSearch={scrollToClinics}
      />

      <SymptomConcierge
        match={match}
        matchingCount={results.length}
        onMatch={(m) => {
          setMatch(m);
          if (m && !m.urgent) setFilter((f) => (f === "all" ? "today" : f));
        }}
        onShowClinics={scrollToClinics}
      />

      <section id="przychodnie" aria-labelledby="clinics-title" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-14">
        <Tabs value={senior ? "list" : view} onValueChange={(v) => setView(v as "list" | "map")}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 id="clinics-title" className="text-3xl font-bold sm:text-4xl">
                Przychodnie w pobliżu
              </h2>
              <p className="text-lg text-muted-foreground" aria-live="polite">
                {results.length} {results.length === 1 ? "przychodnia" : results.length < 5 ? "przychodnie" : "przychodni"} · najbliżej: Poznań, {district.name}
                {filter !== "all" && ` · ${QUICK_FILTERS.find((f) => f.id === filter)?.label}`}
              </p>
              {specialty && (
                <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-success-soft py-1 pl-4 pr-1 font-semibold text-success-foreground">
                  Lekarz: {SPECIALTY_LABELS[specialty]}
                  <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setMatch(null)}>
                    <X aria-hidden="true" />
                    Usuń
                  </Button>
                </p>
              )}
            </div>
            <TabsList className="h-auto rounded-2xl p-1.5 senior:hidden">
              <TabsTrigger value="list" className="min-h-11 gap-2 rounded-xl px-5 text-base">
                <List aria-hidden="true" className="size-5" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="map" className="min-h-11 gap-2 rounded-xl px-5 text-base">
                <MapIcon aria-hidden="true" className="size-5" />
                Mapa
              </TabsTrigger>
            </TabsList>
          </div>

          {results.length === 0 ? (
            <div className="space-y-4 rounded-3xl border-2 border-dashed bg-card p-8 text-center">
              <p className="font-display text-xl font-semibold">Nie znaleźliśmy przychodni dla tych ustawień.</p>
              <Button
                variant="default"
                size="xl"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                  setMatch(null);
                }}
              >
                Pokaż wszystkie przychodnie
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="list" className="mt-0">
                <ul className="grid gap-6 md:grid-cols-2 senior:md:grid-cols-1">
                  {results.map(({ clinic, metres }) => (
                    <li key={clinic.id}>
                      <ClinicCard
                        clinic={clinic}
                        metres={metres}
                        specialty={specialty}
                        now={now}
                        selected={selectedId === clinic.id}
                        onSelect={() => setSelectedId(clinic.id)}
                        onBook={() => openBooking(clinic.id)}
                      />
                    </li>
                  ))}
                </ul>
              </TabsContent>
              {!senior && (
                <TabsContent value="map" className="mt-0">
                  <ClinicMap
                    results={results}
                    district={district}
                    selectedId={selectedId}
                    specialty={specialty}
                    onSelect={setSelectedId}
                    onBook={openBooking}
                  />
                </TabsContent>
              )}
            </>
          )}
        </Tabs>
      </section>

      {selected && !bookingId && <StickyBookBar clinicName={selected.name} onBook={() => openBooking(selected.id)} />}

      <BookingDialog
        clinic={bookingClinic}
        open={!!bookingId}
        onOpenChange={(o) => !o && setBookingId(null)}
        specialty={specialty}
      />
    </div>
  );
}
