import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Specialty } from "./clinics";

export interface BookedAppointment {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  nfz: boolean;
  priceFrom?: number;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorRoom: string;
  dateIso: string;
  time: string;
  patientName: string;
  patientPhone: string;
  createdAtIso: string;
}

const STORAGE_KEY = "medipoint:appointments";

export function sortAppointments(items: BookedAppointment[]): BookedAppointment[] {
  return [...items].sort((a, b) => a.dateIso.localeCompare(b.dateIso));
}

export function sameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function appointmentsOnDay(items: BookedAppointment[], day: Date): BookedAppointment[] {
  return sortAppointments(items).filter((item) => sameCalendarDay(new Date(item.dateIso), day));
}

export function loadAppointments(): BookedAppointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sortAppointments(parsed);
  } catch {
    return [];
  }
}

export function saveAppointments(items: BookedAppointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
}

interface AppointmentsContextValue {
  appointments: BookedAppointment[];
  addAppointment: (item: BookedAppointment) => void;
  removeAppointment: (id: string) => void;
}

const Ctx = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);

  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  const addAppointment = useCallback((item: BookedAppointment) => {
    setAppointments((prev) => {
      const next = sortAppointments([...prev.filter((x) => x.id !== item.id), item]);
      saveAppointments(next);
      return next;
    });
  }, []);

  const removeAppointment = useCallback((id: string) => {
    setAppointments((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveAppointments(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ appointments, addAppointment, removeAppointment }),
    [appointments, addAppointment, removeAppointment],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppointments must be used inside AppointmentsProvider");
  return ctx;
}
