# Podsumowanie Dokumentacji MediPoint (Moduł 13 – Design Thinking)

Krótka ściągawka z najważniejszych wniosków, pomysłów i wyników z całego folderu `docs/`.

## 1. Problem wyjściowy
Użytkowników irytuje układ graficzny starej aplikacji medycznej – po wyszukaniu przychodni nie mogą znaleźć przycisku do rezerwacji wizyty.

## 2. Empatia (Wywiad i Persona)
* **Persona:** **Janina Nowak** (68 lat, Poznań – Winogrady, emerytowana nauczycielka, leczy się na nadciśnienie).
* **Główne obserwacje z wywiadu:**
  * Przycisk rezerwacji w starej aplikacji był mały, szary i ukryty na samym dole pod regulaminem.
  * Pani Janina klikała przypadkowo w numer telefonu lub mapę, bała się błędu i ostatecznie rezygnowała, wracając do długiego dzwonienia do rejestracji.
  * Czego oczekuje: **dużego zielonego przycisku „UMÓW WIZYTĘ”**, większych liter, prostego języka i jasnego potwierdzenia.

## 3. Definicja Perspektywy (POV)
> **Starsza pacjentka z podstawową znajomością smartfona i słabszym wzrokiem potrzebuje szybko znaleźć najbliższą przychodnię oraz umówić wizytę jednym dużym, wyraźnym przyciskiem, ponieważ ukryte i mało kontrastowe elementy obecnej aplikacji wywołują u niej frustrację i zmuszają ją do powrotu do trudnego kontaktu telefonicznego.**

## 4. Najważniejsze pomysły (Burza mózgów)
* **Duży, kontrastowy przycisk CTA** (`UMÓW WIZYTĘ W TEJ PRZYCHODNI`) na każdej karcie przychodni + stały pasek dolny (**Sticky Bar**) na telefonie.
* **Tryb Seniora / Duży Tekst** (1 klik w nagłówku: czcionka +25%, wysoki kontrast, uproszczony widok).
* **Asystent objawów:** wpisanie objawów własnymi słowami → podpowiedź specjalizacji lekarza i odfiltrowanie przychodni (+ ostrzeżenie `112`).
* **Szybkie filtry i GPS:** *Wolne terminy dzisiaj*, *NFZ (Bezpłatne)*, *Otwarte teraz* oraz wykrywanie lokalizacji.
* **3-krokowa rezerwacja:** *Termin → Dane pacjenta → Potwierdzenie*.
* **Automatyczny kalendarz („Moje wizyty”):** każda potwierdzona wizyta od razu zapisuje się w kalendarzu w aplikacji.
* **Wydruk dużym drukiem (PDF):** jednostronicowe potwierdzenie z wyraźnym imieniem pacjenta, terminem, lekarzem i adresem.

## 5. Prototyp i Finalna Aplikacja
* **Wstępne szkice:** `docs/images/` (3 podpisane ekrany koncepcyjne).
* **Działająca aplikacja MediPoint:** `docs/screenshots/` (strona główna, Tryb Seniora, potwierdzenie rezerwacji, kalendarz `/kalendarz`).

## 6. Pliki w `/docs`
* `Module_13_Persona_Wypelniona.pptx` – wypełniony szablon Persony (PowerPoint)
* `RAPORT_DESIGN_THINKING_MODUL_13.md` – pełny raport z procesu Design Thinking
* `PERSONA_SZABLON.md` – tekstowa wersja Persony
* `TRANSKRYPCJA_WYWIADU.md` – zapis wywiadu z Panią Janiną
* `MAKIETY_WIREFRAMES.md` – porównanie przed/po i linki do szkiców
* `PODSUMOWANIE_DOKUMENTACJI.md` – ten skrót najważniejszych rzeczy
