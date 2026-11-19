export type Specialty =
  | "poz"
  | "pediatra"
  | "kardiolog"
  | "laryngolog"
  | "ortopeda"
  | "dermatolog"
  | "szczepienia";

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  poz: "Internista / Lekarz POZ",
  pediatra: "Pediatra",
  kardiolog: "Kardiolog",
  laryngolog: "Laryngolog",
  ortopeda: "Ortopeda",
  dermatolog: "Dermatolog",
  szczepienia: "Punkt szczepień",
};

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  room: string;
}

/** day: 0 = today, 1 = tomorrow, 2 = the day after tomorrow */
export interface Slot {
  id: string;
  day: 0 | 1 | 2;
  time: string;
  doctorId: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  nfz: boolean;
  priceFrom?: number;
  /** Opening hours, Europe/Warsaw, 24h clock: [from, to) */
  hours: [number, number];
  /** Position on the 100x100 mock map of Poznań */
  pos: { x: number; y: number };
  doctors: Doctor[];
  slots: Slot[];
}

export interface District {
  id: string;
  name: string;
  pos: { x: number; y: number };
}

export const DISTRICTS: District[] = [
  { id: "winogrady", name: "Winogrady", pos: { x: 50, y: 40 } },
  { id: "piatkowo", name: "Piątkowo", pos: { x: 45, y: 16 } },
  { id: "jezyce", name: "Jeżyce", pos: { x: 26, y: 55 } },
  { id: "stare-miasto", name: "Stare Miasto", pos: { x: 55, y: 70 } },
  { id: "rataje", name: "Rataje", pos: { x: 80, y: 82 } },
];

export const DEFAULT_DISTRICT_ID = "winogrady";

const s = (clinic: string, day: 0 | 1 | 2, time: string, doctorId: string): Slot => ({
  id: `${clinic}-${day}-${time}-${doctorId}`,
  day,
  time,
  doctorId,
});

export const CLINICS: Clinic[] = [
  {
    id: "zdrowie-winogrady",
    name: "NZOZ Zdrowie – Winogrady",
    address: "os. Wichrowe Wzgórze 20, Poznań",
    phone: "61 820 14 30",
    nfz: true,
    hours: [7, 20],
    pos: { x: 54, y: 47 },
    doctors: [
      { id: "d1", name: "lek. Anna Nowak", specialty: "poz", room: "12" },
      { id: "d2", name: "lek. Piotr Wiśniewski", specialty: "pediatra", room: "5" },
      { id: "d3", name: "piel. Ewa Kaczmarek", specialty: "szczepienia", room: "2" },
    ],
    slots: [
      s("zw", 0, "14:30", "d1"),
      s("zw", 0, "15:15", "d1"),
      s("zw", 0, "16:00", "d2"),
      s("zw", 0, "17:20", "d3"),
      s("zw", 1, "08:15", "d1"),
      s("zw", 1, "09:00", "d3"),
      s("zw", 1, "12:40", "d2"),
      s("zw", 2, "10:30", "d1"),
      s("zw", 2, "13:00", "d1"),
    ],
  },
  {
    id: "rejonowa-4",
    name: "Przychodnia Rejonowa nr 4",
    address: "os. Pod Lipami 105, Poznań",
    phone: "61 877 40 04",
    nfz: true,
    hours: [8, 18],
    pos: { x: 40, y: 35 },
    doctors: [
      { id: "d1", name: "lek. Marek Zieliński", specialty: "poz", room: "3" },
      { id: "d2", name: "dr n. med. Joanna Lewandowska", specialty: "kardiolog", room: "14" },
    ],
    slots: [
      s("r4", 0, "11:45", "d1"),
      s("r4", 0, "13:00", "d2"),
      s("r4", 1, "08:30", "d1"),
      s("r4", 1, "10:15", "d2"),
      s("r4", 2, "09:45", "d1"),
    ],
  },
  {
    id: "medica",
    name: "Centrum Medyczne Medica",
    address: "ul. Słowiańska 47, Poznań",
    phone: "61 222 33 44",
    nfz: false,
    priceFrom: 180,
    hours: [7, 21],
    pos: { x: 62, y: 52 },
    doctors: [
      { id: "d1", name: "dr Tomasz Kowalczyk", specialty: "laryngolog", room: "21" },
      { id: "d2", name: "dr Magdalena Wójcik", specialty: "ortopeda", room: "8" },
      { id: "d3", name: "dr Karolina Mazur", specialty: "dermatolog", room: "17" },
      { id: "d4", name: "lek. Paweł Krawczyk", specialty: "poz", room: "4" },
    ],
    slots: [
      s("md", 0, "15:15", "d1"),
      s("md", 0, "17:30", "d2"),
      s("md", 0, "18:10", "d4"),
      s("md", 1, "09:20", "d3"),
      s("md", 1, "11:00", "d1"),
      s("md", 1, "16:40", "d2"),
      s("md", 2, "08:00", "d4"),
    ],
  },
  {
    id: "piatkowo",
    name: "Przychodnia Piątkowo",
    address: "os. Bolesława Śmiałego 107, Poznań",
    phone: "61 823 10 07",
    nfz: true,
    hours: [8, 15],
    pos: { x: 44, y: 19 },
    doctors: [
      { id: "d1", name: "lek. Barbara Szymańska", specialty: "poz", room: "1" },
      { id: "d2", name: "piel. Irena Dąbrowska", specialty: "szczepienia", room: "6" },
    ],
    slots: [
      s("pt", 1, "08:00", "d1"),
      s("pt", 1, "10:30", "d2"),
      s("pt", 2, "09:15", "d1"),
      s("pt", 2, "11:45", "d2"),
    ],
  },
  {
    id: "ruch",
    name: "Poradnia Ortopedyczna „Ruch”",
    address: "ul. Szelągowska 18, Poznań",
    phone: "61 855 18 18",
    nfz: true,
    hours: [9, 19],
    pos: { x: 66, y: 60 },
    doctors: [{ id: "d1", name: "dr Andrzej Jankowski", specialty: "ortopeda", room: "9" }],
    slots: [s("ru", 0, "16:00", "d1"), s("ru", 1, "13:30", "d1"), s("ru", 2, "15:00", "d1")],
  },
  {
    id: "laryngologia-jezyce",
    name: "Poradnia Laryngologiczna Jeżyce",
    address: "ul. Dąbrowskiego 77, Poznań",
    phone: "61 847 77 70",
    nfz: false,
    priceFrom: 160,
    hours: [10, 18],
    pos: { x: 28, y: 58 },
    doctors: [{ id: "d1", name: "dr Agnieszka Pawlak", specialty: "laryngolog", room: "2" }],
    slots: [s("lj", 0, "12:30", "d1"), s("lj", 0, "16:45", "d1"), s("lj", 1, "11:15", "d1")],
  },
  {
    id: "centrum-stare-miasto",
    name: "Przychodnia Centrum – Stare Miasto",
    address: "ul. Wrocławska 12, Poznań",
    phone: "61 851 12 12",
    nfz: true,
    hours: [7, 19],
    pos: { x: 52, y: 73 },
    doctors: [
      { id: "d1", name: "lek. Krzysztof Grabowski", specialty: "poz", room: "7" },
      { id: "d2", name: "dr Monika Michalska", specialty: "dermatolog", room: "11" },
      { id: "d3", name: "dr Jan Król", specialty: "kardiolog", room: "15" },
    ],
    slots: [
      s("cs", 0, "13:40", "d1"),
      s("cs", 1, "09:30", "d2"),
      s("cs", 1, "14:20", "d3"),
      s("cs", 2, "08:45", "d1"),
    ],
  },
];

export function getClinic(id: string): Clinic | undefined {
  return CLINICS.find((c) => c.id === id);
}

export function getDistrict(id: string): District {
  return DISTRICTS.find((d) => d.id === id) ?? DISTRICTS[0]!;
}

/** One mock-map unit equals 55 metres. */
const METRES_PER_UNIT = 55;
const WALK_METRES_PER_MIN = 80;

export function distanceMetres(from: { x: number; y: number }, clinic: Clinic): number {
  const d = Math.hypot(clinic.pos.x - from.x, clinic.pos.y - from.y) * METRES_PER_UNIT;
  return Math.round(d / 10) * 10;
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${metres} m stąd`;
  return `${(metres / 1000).toFixed(1).replace(".", ",")} km stąd`;
}

export function walkingMinutes(metres: number): number {
  return Math.max(1, Math.round(metres / WALK_METRES_PER_MIN));
}

/** Current hour in Poznań, independent of the device or server time zone. */
export function warsawHour(now: Date): number {
  const h = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Europe/Warsaw",
  }).format(now);
  return Number(h) % 24;
}

export function isOpenNow(clinic: Clinic, now: Date): boolean {
  const h = warsawHour(now);
  return h >= clinic.hours[0] && h < clinic.hours[1];
}

export function slotsForDay(clinic: Clinic, day: 0 | 1 | 2, specialty?: Specialty | null): Slot[] {
  return clinic.slots
    .filter((sl) => sl.day === day)
    .filter((sl) => !specialty || doctorOf(clinic, sl.doctorId)?.specialty === specialty)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function doctorOf(clinic: Clinic, doctorId: string): Doctor | undefined {
  return clinic.doctors.find((d) => d.id === doctorId);
}

export function hasSpecialty(clinic: Clinic, specialty: Specialty): boolean {
  return clinic.doctors.some((d) => d.specialty === specialty);
}

export type QuickFilter = "all" | "nfz" | "open" | "today";

export const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "nfz", label: "NFZ (Bezpłatne)" },
  { id: "open", label: "Otwarte teraz" },
  { id: "today", label: "Wolne terminy dzisiaj" },
];

export interface ClinicQuery {
  filter: QuickFilter;
  specialty?: Specialty | null;
  text?: string;
  from: { x: number; y: number };
  now: Date;
}

function normalise(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
}

export interface ClinicResult {
  clinic: Clinic;
  metres: number;
}

/** Filters clinics and sorts them nearest first. */
export function findClinics(clinics: Clinic[], q: ClinicQuery): ClinicResult[] {
  const text = q.text ? normalise(q.text.trim()) : "";
  return clinics
    .filter((c) => {
      if (q.filter === "nfz" && !c.nfz) return false;
      if (q.filter === "open" && !isOpenNow(c, q.now)) return false;
      if (q.filter === "today" && slotsForDay(c, 0, q.specialty).length === 0) return false;
      if (q.specialty && !hasSpecialty(c, q.specialty)) return false;
      if (text) {
        const haystack = normalise(
          [c.name, c.address, ...c.doctors.map((d) => `${d.name} ${SPECIALTY_LABELS[d.specialty]}`)].join(" "),
        );
        if (!haystack.includes(text)) return false;
      }
      return true;
    })
    .map((clinic) => ({ clinic, metres: distanceMetres(q.from, clinic) }))
    .sort((a, b) => a.metres - b.metres);
}
