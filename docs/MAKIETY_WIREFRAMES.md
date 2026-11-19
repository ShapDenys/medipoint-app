# Makiety i Architektura Informacji UI/UX: MediPoint

## 1. Porównanie: Przed vs Po Redesignie

### ❌ STARA WERSJA (Przeładowana, zdezorientowana):
* Przycisk rezerwacji ukryty na samym dole strony pod regulaminami i opiniami.
* Szary kolor przycisku (`#94a3b8`) zlewający się z tłem aplikacji (`#f8fafc`).
* Brak wyraźnego oznaczenia, czy przychodnia ma wolne terminy dzisiaj/jutro.
* Złożone menu z 5 podkategoriami świadczeń zanim użytkownik zobaczy kalendarz.
* Małe ikony nawigacyjne (rozmiar 16px), zbyt mały obszar klikalny (tzw. touch target poniżej 28px).

### ✅ NOWA WERSJA (MediPoint – Dostępna i Przejrzysta):
* **Gigantyczny przycisk CTA:** Wysoki kontrast (zielony `#16a34a` lub błękit `#0284c7`), wysokość min. 54px, tekst 18px pogrubiony: `[ ZAREZERWUJ WIZYTĘ TERAZ ]`.
* **Sticky Floating Bar:** Na urządzeniach mobilnych przycisk rezerwacji jest na stałe zakotwiczony u dołu ekranu wraz z informacją o najbliższym wolnym terminie (`„Najbliższy termin: Dzisiaj, 14:15”`).
* **Tryb Seniora:** Przycisk w prawym górnym rogu podmienia wielkość fontu (+25%) i włącza tryb wysokiego kontrastu (WCAG AAA).
* **Asystent AI:** Inteligentne okienko tekstowo-głosowe na stronie głównej: *„Wpisz co Ci dolega, a dobierzemy lekarza i termin”*.
* **Rezerwacja w 3 prostych krokach:** Krok 1 (Kiedy i u kogo) -> Krok 2 (Telefon i imię) -> Krok 3 (Potwierdzenie z kodem SMS).

---

## 2. Makiety Wireframe (ASCII UI)

### Ekran 1: Strona Główna i Wyszukiwarka Najbliższej Przychodni

```text
┌──────────────────────────────────────────────────────────┐
│  🏥 MediPoint                       [ 👁️ Tryb Seniora ] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Znajdź najbliższą przychodnię i umów wizytę w 1 minutę │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │ 📍 [ Twoja lokalizacja: Poznań, Winogrady     ] │   │
│   └──────────────────────────────────────────────────┘   │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │ 🤖 AI Asystent: Wpisz objawy lub powiedz głosem   │   │
│   │    "Boli mnie gardło i mam gorączkę od wczoraj"  │   │
│   │                                   [ 🔍 Dopasuj ] │   │
│   └──────────────────────────────────────────────────┘   │
│                                                          │
│  NAJBLIŻSZE PRZYCHODNIE W POBLIŻU:                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🏥 NZOZ Zdrowie Winogrady              450 m stąd  │  │
│  │ 📍 os. Przyjaźni 12, Poznań                        │  │
│  │ 🟢 Wolny termin: DZISIAJ, godz. 14:30 (POZ)        │  │
│  │                                                    │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │     👉 [ UMÓW WIZYTĘ W TEJ PLACÓWCE ]          │ │  │
│  │ └────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🏥 Przychodnia Rejonowa nr 4           800 m stąd  │  │
│  │ 📍 os. Pod Lipami 4, Poznań                        │  │
│  │ 🟢 Wolny termin: JUTRO, godz. 09:15                │  │
│  │                                                    │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │     👉 [ UMÓW WIZYTĘ W TEJ PLACÓWCE ]          │ │  │
│  │ └────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

### Ekran 2: 3-Krokowy Formularz Rezerwacji (Modal / Podstrona)

```text
┌──────────────────────────────────────────────────────────┐
│  ← Powrót do listy                   🏥 NZOZ Zdrowie     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   KROK 1 z 3: WYBIERZ LEKARZA I TERMIN                   │
│   ══════════════════════════════════════════             │
│                                                          │
│   Specjalizacja:                                         │
│   [● Internista / Lekarz POZ]   [  Pediatra  ]           │
│                                                          │
│   Dostępne dni:                                          │
│   ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│   │   ★ DZISIAJ    │ │     JUTRO      │ │ Inny termin  │ │
│   │    19 Lis      │ │    20 Lis      │ │   Kalendarz  │ │
│   └────────────────┘ └────────────────┘ └──────────────┘ │
│                                                          │
│   Dostępne godziny:                                      │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐         │
│   │ 14:30  │  │ 15:00  │  │ 15:45  │  │ 16:30  │         │
│   └────────┘  └────────┘  └────────┘  └────────┘         │
│                                                          │
│   Lekarz: lek. med. Barbara Wiśniewska (Gabinet 14)      │
│                                                          │
│   KROK 2 z 3: TWOJE DANE                                 │
│   ──────────────────────────────────────────             │
│   Imię i Nazwisko: [ Janina Nowak                      ] │
│   Numer telefonu:  [ 601 234 567                       ] │
│                                                          │
│   ┌────────────────────────────────────────────────────┐ │
│   │                                                    │ │
│   │   ✅ [ ZATWIERDŹ I POTWIERDŹ WIZYTĘ (SMS) ]        │ │
│   │                                                    │ │
│   └────────────────────────────────────────────────────┘ │
│   🔒 Rezerwacja bezpłatna w ramach kontraktu z NFZ       │
└──────────────────────────────────────────────────────────┘
```

---

### Ekran 3: Potwierdzenie i Sukces (Czytelny Komunikat dla Seniora)

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                     🎉 SUKCES!                           │
│              WIZYTA ZOSTAŁA POTWIERDZONA                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  🏥 NZOZ Zdrowie Winogrady, os. Przyjaźni 12       │  │
│  │  👨‍⚕️ Lekarz: lek. Barbara Wiśniewska                │  │
│  │  🗓️ Data: Dzisiaj, 19 Listopada                    │  │
│  │  ⏰ Godzina: 14:30 (Gabinet nr 14)                 │  │
│  │  🎫 Numer wizyty: #PL-8421                         │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  📱 Wysłaliśmy bezpłatny SMS z przypomnieniem            │
│     na numer: 601 234 567                                │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │   🖨️ [ POBIERZ POTWIERDZENIE W DUŻYM DRUKU ]       │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │   🏠 [ WRÓĆ DO STRONY GŁÓWNEJ ]                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```
