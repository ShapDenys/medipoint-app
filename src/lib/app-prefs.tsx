import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_DISTRICT_ID } from "./clinics";

interface AppPrefs {
  senior: boolean;
  setSenior: (on: boolean) => void;
  districtId: string;
  setDistrictId: (id: string) => void;
  gpsDetected: boolean;
  setGpsDetected: (v: boolean) => void;
}

const Ctx = createContext<AppPrefs | null>(null);
const SENIOR_KEY = "medipoint:senior";
const DISTRICT_KEY = "medipoint:district";

export function AppPrefsProvider({ children }: { children: ReactNode }) {
  const [senior, setSeniorState] = useState(false);
  const [districtId, setDistrictState] = useState(DEFAULT_DISTRICT_ID);
  const [gpsDetected, setGpsDetected] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SENIOR_KEY) === "1") setSeniorState(true);
      const d = localStorage.getItem(DISTRICT_KEY);
      if (d) setDistrictState(d);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("senior", senior);
  }, [senior]);

  const setSenior = useCallback((on: boolean) => {
    setSeniorState(on);
    try {
      localStorage.setItem(SENIOR_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const setDistrictId = useCallback((id: string) => {
    setDistrictState(id);
    try {
      localStorage.setItem(DISTRICT_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ senior, setSenior, districtId, setDistrictId, gpsDetected, setGpsDetected }),
    [senior, setSenior, districtId, setDistrictId, gpsDetected],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppPrefs(): AppPrefs {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppPrefs must be used inside AppPrefsProvider");
  return ctx;
}

/** Current time, available only after hydration (null during SSR) to avoid mismatches. */
export function useNow(intervalMs = 60_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
