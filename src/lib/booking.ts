export interface PatientInfo {
  fullName: string;
  phone: string;
  pesel: string;
}

export type PatientErrors = Partial<Record<keyof PatientInfo, string>>;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Accepts a Polish 9-digit number, optionally with +48 / 0048 prefix and spaces. */
export function normalisePhone(value: string): string | null {
  let d = digitsOnly(value);
  if (d.startsWith("0048")) d = d.slice(4);
  else if (d.length === 11 && d.startsWith("48")) d = d.slice(2);
  return d.length === 9 ? d : null;
}

export function formatPhone(nine: string): string {
  return `${nine.slice(0, 3)} ${nine.slice(3, 6)} ${nine.slice(6)}`;
}

export function validatePatient(p: PatientInfo): PatientErrors {
  const errors: PatientErrors = {};
  const name = p.fullName.trim();
  if (name.length < 3 || !name.includes(" ")) {
    errors.fullName = "Wpisz imię i nazwisko, np. Jan Kowalski.";
  }
  if (!normalisePhone(p.phone)) {
    errors.phone = "Wpisz 9 cyfr numeru telefonu, np. 600 123 456.";
  }
  const pesel = digitsOnly(p.pesel);
  if (p.pesel.trim() && pesel.length !== 11) {
    errors.pesel = "PESEL ma 11 cyfr. Możesz też zostawić to pole puste.";
  }
  return errors;
}

export function ticketNumber(random: () => number = Math.random): string {
  return `#PL-${1000 + Math.floor(random() * 9000)}`;
}

/** Date for a slot: day offset from today, at HH:MM local time. */
export function slotDate(base: Date, dayOffset: number, time: string): Date {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

export function dayLabel(base: Date, dayOffset: number): { top: string; date: string } {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  const date = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" })
    .format(d)
    .replace(".", "");
  const top =
    dayOffset === 0
      ? "DZISIAJ"
      : dayOffset === 1
        ? "JUTRO"
        : new Intl.DateTimeFormat("pl-PL", { weekday: "long" }).format(d).toUpperCase();
  return { top, date };
}

export function longDate(d: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildIcs(opts: {
  start: Date;
  minutes: number;
  title: string;
  location: string;
  description: string;
  uid: string;
}): string {
  const end = new Date(opts.start.getTime() + opts.minutes * 60_000);
  const esc = (t: string) => t.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediPoint//PL",
    "BEGIN:VEVENT",
    `UID:${opts.uid}@medipoint`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(opts.start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${esc(opts.title)}`,
    `LOCATION:${esc(opts.location)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Przypomnienie o wizycie",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
