import type { Specialty } from "./clinics";

export interface SymptomMatch {
  specialty: Specialty;
  /** Plain-language explanation shown to the patient */
  reason: string;
  /** True when the description suggests calling 112 instead of booking */
  urgent: boolean;
}

export const SYMPTOM_CHIPS = [
  "Ból gardła i gorączka",
  "Recepta na nadciśnienie",
  "Ból kręgosłupa",
  "Szczepienie",
];

function normalise(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");
}

const URGENT = [
  "bol w klatce",
  "bol klatki",
  "duszno",
  "dusznos",
  "nie moge oddychac",
  "stracil przytomnosc",
  "utrata przytomnosci",
  "zemdlal",
  "paraliz",
  "opadniety kacik",
  "krwotok",
  "udar",
  "zawal",
];

const RULES: { specialty: Specialty; words: string[]; reason: string }[] = [
  {
    specialty: "szczepienia",
    words: ["szczepi", "szczepionk", "zaszczep"],
    reason: "Szczepienie wykona pielęgniarka w punkcie szczepień. Weź ze sobą dowód osobisty.",
  },
  {
    specialty: "pediatra",
    words: ["dziecko", "dziecka", "synek", "corka", "corke", "niemowl", "wnuk", "wnuczk"],
    reason: "Dzieckiem najlepiej zajmie się pediatra.",
  },
  {
    specialty: "kardiolog",
    words: ["serce", "serca", "kolatani", "arytmi", "kardiolog"],
    reason: "Kłopoty z sercem warto skonsultować z kardiologiem.",
  },
  {
    specialty: "ortopeda",
    words: ["kregoslup", "plecy", "plecow", "kolano", "kolana", "staw", "biodr", "skrecen", "zlaman", "bark"],
    reason: "Bóle kręgosłupa, stawów i kolan leczy ortopeda.",
  },
  {
    specialty: "dermatolog",
    words: ["skora", "skory", "wysypk", "swedz", "pieprzyk", "tradzik", "znamie"],
    reason: "Zmiany na skórze obejrzy dermatolog.",
  },
  {
    specialty: "laryngolog",
    words: ["ucho", "uszu", "uszy", "zatok", "slyszen", "nos zatkany", "migdal"],
    reason: "Uszy, nos i zatoki bada laryngolog.",
  },
  {
    specialty: "poz",
    words: ["gardl", "goraczk", "kaszel", "kaszl", "katar", "przezieb", "gryp", "temperatur", "recept", "cisnieni", "nadcisnien", "skierowan", "zwolnieni", "l4", "bol glowy", "brzuch"],
    reason: "Lekarz rodzinny (POZ) pomoże przy przeziębieniu, gorączce, receptach i skierowaniach.",
  },
];

const FALLBACK_REASON =
  "Najlepiej zacząć od lekarza rodzinnego (POZ). W razie potrzeby skieruje Cię do specjalisty.";

/**
 * Simple, offline "assistant" that suggests which doctor to see.
 * Returns null for empty input. Never a diagnosis.
 */
export function matchSymptoms(input: string): SymptomMatch | null {
  const text = normalise(input.trim());
  if (!text) return null;

  if (URGENT.some((w) => text.includes(w))) {
    return {
      specialty: "poz",
      urgent: true,
      reason: "Te objawy mogą być groźne. Nie czekaj na wizytę – zadzwoń pod numer 112.",
    };
  }

  const rule = RULES.find((r) => r.words.some((w) => text.includes(w)));
  if (rule) return { specialty: rule.specialty, reason: rule.reason, urgent: false };
  return { specialty: "poz", reason: FALLBACK_REASON, urgent: false };
}
