import { describe, expect, it } from "vitest";

import { normalisePhone, validatePatient } from "@/lib/booking";
import { CLINICS, findClinics, getDistrict, isOpenNow, getClinic } from "@/lib/clinics";
import { matchSymptoms } from "@/lib/symptoms";

const winogrady = getDistrict("winogrady").pos;
// 19 Nov 2026, 14:00 in Poznań (13:00 UTC)
const afternoon = new Date("2026-11-19T13:00:00Z");

describe("symptom assistant", () => {
  it("suggests Internista / Lekarz POZ for sore throat and fever", () => {
    expect(matchSymptoms("Boli mnie gardło i mam gorączkę od wczoraj")?.specialty).toBe("poz");
  });

  it("suggests POZ for a blood-pressure prescription", () => {
    expect(matchSymptoms("Recepta na nadciśnienie")?.specialty).toBe("poz");
  });

  it("suggests an orthopaedist for back pain", () => {
    expect(matchSymptoms("Ból kręgosłupa")?.specialty).toBe("ortopeda");
  });

  it("sends vaccinations to the vaccination point", () => {
    expect(matchSymptoms("Szczepienie")?.specialty).toBe("szczepienia");
  });

  it("tells the patient to call 112 for chest pain", () => {
    expect(matchSymptoms("mam silny ból w klatce piersiowej")?.urgent).toBe(true);
  });
});

describe("clinic filters", () => {
  it("'NFZ (Bezpłatne)' hides private clinics", () => {
    const r = findClinics(CLINICS, { filter: "nfz", from: winogrady, now: afternoon });
    expect(r.every((x) => x.clinic.nfz)).toBe(true);
    expect(r.some((x) => x.clinic.id === "medica")).toBe(false);
  });

  it("'Wolne terminy dzisiaj' hides clinics with no slots today", () => {
    const r = findClinics(CLINICS, { filter: "today", from: winogrady, now: afternoon });
    expect(r.some((x) => x.clinic.id === "piatkowo")).toBe(false);
    expect(r.some((x) => x.clinic.id === "zdrowie-winogrady")).toBe(true);
  });

  it("'Otwarte teraz' uses Poznań time: Piątkowo (8–15) is closed at 15:30", () => {
    const at1530 = new Date("2026-11-19T14:30:00Z");
    expect(isOpenNow(getClinic("piatkowo")!, at1530)).toBe(false);
    expect(isOpenNow(getClinic("zdrowie-winogrady")!, at1530)).toBe(true);
  });

  it("lists clinics nearest first, NZOZ Zdrowie about 450 m from Winogrady", () => {
    const r = findClinics(CLINICS, { filter: "all", from: winogrady, now: afternoon });
    expect(r[0]?.clinic.id).toBe("zdrowie-winogrady");
    expect(r[0]?.metres).toBe(440);
  });
});

describe("patient details", () => {
  it("requires full name and phone, PESEL is optional", () => {
    expect(validatePatient({ fullName: "Jan Kowalski", phone: "600 123 456", pesel: "" })).toEqual({});
  });

  it("rejects a phone number without 9 digits", () => {
    expect(validatePatient({ fullName: "Jan Kowalski", phone: "60012", pesel: "" }).phone).toBeDefined();
  });

  it("rejects a PESEL that is not 11 digits when given", () => {
    expect(validatePatient({ fullName: "Jan Kowalski", phone: "600123456", pesel: "123" }).pesel).toBeDefined();
  });

  it("accepts +48 prefixed phone numbers", () => {
    expect(normalisePhone("+48 600 123 456")).toBe("600123456");
  });
});
