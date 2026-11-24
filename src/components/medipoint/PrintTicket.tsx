import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { longDate } from "@/lib/booking";
import { SPECIALTY_LABELS, type Specialty } from "@/lib/clinics";

export interface PrintTicketData {
  ticket: string;
  when: Date;
  time: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorRoom: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  patientName: string;
  patientPhone?: string;
  nfz: boolean;
  priceFrom?: number;
}

export function PrintTicket({ data }: { data: PrintTicketData | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data) return null;

  return createPortal(
    <div id="print-ticket-root" className="print-ticket-root" aria-hidden="true">
      <div className="rounded-2xl border-2 border-black bg-white text-black">
        <div className="flex items-center justify-between border-b-2 border-black bg-emerald-700 px-6 py-4 text-white">
          <div>
            <p className="text-xl font-bold">MediPoint · Potwierdzenie wizyty</p>
            <p className="text-sm opacity-90">Wydruk dużym drukiem</p>
          </div>
          <span className="text-2xl font-bold tabular-nums">{data.ticket}</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 p-6 text-lg">
          <div className="col-span-2 border-b border-gray-300 pb-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Kiedy</dt>
            <dd className="mt-1 text-2xl font-bold first-letter:uppercase">
              {longDate(data.when)}, godz. {data.time}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Pacjent</dt>
            <dd className="mt-1 text-xl font-bold">{data.patientName}</dd>
            {data.patientPhone && <dd className="text-base text-gray-700">tel. {data.patientPhone}</dd>}
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Koszt</dt>
            <dd className="mt-1 text-xl font-bold">
              {data.nfz ? "NFZ – bezpłatnie" : `Prywatnie · od ${data.priceFrom ?? 0} zł`}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Lekarz</dt>
            <dd className="mt-1 font-bold">{data.doctorName}</dd>
            <dd className="text-base text-gray-700">{SPECIALTY_LABELS[data.doctorSpecialty]}</dd>
          </div>

          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Gabinet</dt>
            <dd className="mt-1 text-xl font-bold">nr {data.doctorRoom}</dd>
          </div>

          <div className="col-span-2 border-t border-gray-300 pt-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-600">Gdzie</dt>
            <dd className="mt-1 font-bold">{data.clinicName}</dd>
            <dd className="text-base text-gray-800">
              {data.clinicAddress} · tel. {data.clinicPhone}
            </dd>
          </div>
        </dl>
      </div>
    </div>,
    document.body,
  );
}
