# Raport z Projektu: Myślenie Projektowe (Design Thinking) – Moduł 13
**Intel® AI dla Przyszłych Pracowników**

---

## Metryka Projektu

* **Temat zadania:** Redesign i usprawnienie aplikacji do wyszukiwania najbliższej przychodni oraz intuicyjnej rezerwacji wizyty lekarskiej.
* **Zidentyfikowany problem:** Użytkowników irytuje obecny układ graficzny aplikacji, a szczególnie ogromne trudności w znalezieniu właściwych przycisków służących do rezerwacji wizyty po odnalezieniu placówki medycznej.
* **Członkowie zespołu projektowego:**
  1. **Denys [Lider Zespołu / UX Researcher & AI Prompt Engineer]** — ............................................................
  2. **Członek Zespołu 2 [UI Designer]** — ............................................................
  3. **Członek Zespołu 3 [Product Manager]** — ............................................................
* **Data sporządzenia raportu:** 19 listopada 2026 r.
* **Status projektu:** Ukończony (fazy: Empatia, Definicja, Koncepcja, Prototyp, Testy).

---

## 1. Faza Empatii (Empathise)

### 1.1. Metodologia badania
Celem etapu było zrozumienie zachowań, emocji, obaw i barier technologicznych osób korzystających z aplikacji medycznych. Przeprowadzono badanie jakościowe metodą **Indywidualnego Wywiadu Pogłębionego (IDI)** połączonego z **obserwacją użytkownika (testem korytarzowym użyteczności)** na dotychczasowej wersji aplikacji.

Badanie przeprowadzono ze starszą osobą reprezentującą kluczową grupę pacjentów przychodni rejonowych (POZ):
* **Respondent:** Pani Janina Nowak (wiek: 68 lat, emerytowana polonistka, przewlekle lecząca się na nadciśnienie tętnicze).
* **Zadanie testowe:** „Wyobraź sobie, że kończą Ci się leki na ciśnienie i chcesz znaleźć najbliższą przychodnię oraz umówić wizytę u lekarza POZ na jutro rano za pomocą aplikacji na smartfonie”.

### 1.2. Przebieg wywiadu i obserwacje
* **Czas próby wykonania zadania:** Respondentka poddała się po 9 minutach i 40 sekundach bez sukcesu.
* **Kluczowe obserwacje behawioralne:**
  * Respondentka z łatwością otworzyła aplikację, ale widok mapy był przeładowany filtrami, reklamami i małymi ikonkami.
  * Po wpisaniu dzielnicy pojawiła się lista przychodni, jednak po kliknięciu wybranej placówki respondentka widziała długi opis adresu i godziny otwarcia, ale **nie widziała przycisku „Umów wizytę”**. Przycisk ten był ukryty na samym dole strony, w szarym kolorze o niskim kontraście, wyglądający jak zwykły nagłówek sekcji.
  * Respondentka wielokrotnie klikała w numer telefonu (co skutkowało próbą nawiązania połączenia) lub w zdjęcie budynku.
  * Towarzyszyły jej silne negatywne emocje: stres („czy ja coś zepsułam?”), wstyd („ja się chyba do tej technologii nie nadaję”) oraz frustracja („szybciej pójdę tam pieszo lub będę wisieć 40 minut na telefonie”).
* **Bezpośredni cytat respondentki:**
  > *„Ja nie potrzebuję wodotrysków i stu zakładek. Chcę po prostu wpisać moją ulicę, zobaczyć przychodnię i mieć wielki, wyraźny przycisk: »Umów wizytę«. Chcę kliknąć raz, wybrać godzinę i dostać SMS-a, że lekarz na mnie czeka!”*

### 1.3. Podsumowanie Persony
Na podstawie wywiadu i analizy stworzono Personę w szablonie Intel Module 13:
* **Persona:** Janina Nowak (68 lat, Poznań, emerytowana nauczycielka).
* **Archetyp:** Ostrożny Senior / Praktyczny Tradycjonalista.
* **Główne cele:** Błyskawiczne znalezienie najbliższej placówki z wolnym terminem, rezerwacja wizyty jednym czytelnym kliknięciem, poczucie bezpieczeństwa i niezależności.
* **Główne frustracje:** Zlewające się z tłem małe przyciski, nieintuicyjna architektura informacji, lęk przed pomyłką i konieczność proszenia bliskich o pomoc.

*(Pełna karta persony znajduje się w osobnym załączniku oraz w pliku prezentacji `Module_13_Persona_Wypelniona.pptx`).*

---

## 2. Faza Definicji Perspektywy (Define)

### 2.1. Synteza problemu i wnioski (Insights)
1. **Błąd hierarchii wizualnej:** W obecnej aplikacji akcja kluczowa dla biznesu i użytkownika (CTA - *Call To Action*: „Zarezerwuj wizytę”) ma mniejszą wagę optyczną niż elementy drugorzędne (zdjęcia, regulaminy, adresy).
2. **Bariera percepcji seniorów:** Osoby 60+ cierpią na obniżoną ostrość widzenia i gorszą percepcję kontrastów. Szare przyciski na jasnoszarym tle stają się dla nich niewidoczne.
3. **Problem mentalny:** Użytkownik oczekuje natychmiastowego przejścia do kalendarza po wybraniu przychodni, a nie błądzenia w gąszczu zakładek.

### 2.2. Sformułowanie Definicji Perspektywy (Point of View - POV)

> **„Starsza pacjentka z ograniczoną sprawnością cyfrową i słabszym wzrokiem**  
> **POTRZEBUJE:** natychmiastowego, bezbłędnego zlokalizowania najbliższej przychodni oraz umówienia wizyty za pomocą jednego, maksymalnie wyeksponowanego przycisku głównego lub polecenia głosowego,  
> **PONIEWAŻ:** małe, ukryte i niekontrastowe przyciski w obecnym interfejsie wywołują u niej lęk przed pomyłką, frustrację i poczucie bezradności, zmuszając ją do rezygnacji z samodzielności na rzecz wielogodzinnych kolejek telefonicznych.”

### 2.3. Pytanie strategiczne (How Might We / HMW)
* **HMW 1:** Jak moglibyśmy zaprojektować kartę przychodni, aby przycisk rezerwacji wizyty był pierwszym elementem, na który natrafia wzrok użytkownika?
* **HMW 2:** Jak moglibyśmy wykorzystać sztuczną inteligencję (AI), aby zredukować cały proces wyboru placówki i rezerwacji terminu do jednej prostej rozmowy lub dwóch kliknięć?
* **HMW 3:** Jak zagwarantować seniorom stuprocentową pewność, że wizyta została skutecznie zarezerwowana?

---

## 3. Faza Koncepcji / Burza Mózgów (Ideate)

Zespół przeprowadził sesję kreatywnej burzy mózgów (*divergent thinking*). Zanotowano wszystkie pomysły bez wstępnego oceniania:

### Zestawienie wygenerowanych pomysłów:
1. **Gigantyczny, pływający przycisk (Floating Sticky CTA):** Wyraźny, zielony przycisk „Zarezerwuj wizytę w tej przychodni” stale przyklejony u dołu ekranu smartfona.
2. **Tryb Seniora / Wysoki Kontrast (Jedno kliknięcie):** Dedykowany przełącznik na górze ekranu włączający powiększoną czcionkę (20px+), mocne obramowania i uproszczony układ.
3. **Asystent Głosowy AI („MediGłos”):** Możliwość wciśnięcia mikrofonu i powiedzenia: *„Potrzebuję internisty na Winogradach jutro rano”* – AI samo wyszukuje przychodnię i podstawia gotową rezerwację.
4. **AI Triage & Matcher:** Inteligentne okienko: *„Opisz co Ci dolega (np. boli mnie gardło i mam gorączkę)”* -> AI podpowiada odpowiedniego lekarza (POZ vs Laryngolog) i od razu pokazuje najbliższy wolny termin.
5. **Jednoekranowy kalendarz wizyt:** Zamiast skomplikowanego kalendarza z miesiącami – 3 duże kafle: „Dzisiaj”, „Jutro”, „Wybierz inny dzień” z dostępnymi godzinami.
6. **Geolokalizacja „1-Click GPS”:** Automatyczne pobranie pozycji użytkownika i wyświetlenie placówek posortowanych według czasu pieszego dojścia (np. „5 minut pieszo od Ciebie”).
7. **Odznaka najbliższego terminu:** Etykieta przy każdej przychodni: „Najbliższy wolny termin: DZISIAJ 15:30” jako klikalny przycisk rezerwacji.
8. **Dźwiękowe potwierdzenie i duży SMS:** Po kliknięciu rezerwacji ekran wyświetla zielony ptaszek, czytany na głos komunikat oraz wysyła bezpłatnego SMS-a z przypomnieniem.
9. **Eliminacja zbędnych formularzy:** Zamiast podawania 15 danych – tylko numer telefonu i PESEL/imię.
10. **Fizyczny przycisk w domu (IoT) podłączony do aplikacji:** Przycisk rezerwujący wizytę domową u stałego lekarza.

### Selekcja i synteza rozwiązania docelowego:
Do realizacji w prototypie zakwalifikowano koncepcję **„MediPoint – Dostępna Przychodnia & AI Concierge”**, łączącą:
* **Uzdrowienie UI/UX:** Pełna hierarchia wizualna z jaskrawym przyciskiem CTA, tryb wysokiego kontrastu i powiększonego tekstu, interaktywna mapa z dużymi znacznikami.
* **Integrację AI:** Konwersacyjny asystent medyczny podpowiadający placówkę i termin na podstawie prostego opisu objawów.
* **3-krokowy, bezstresowy proces rezerwacji:** Wybór placówki -> Wybór godziny -> Natychmiastowe potwierdzenie.

---

## 4. Faza Prototypu (Prototype) & Wdrożenie w v0

Zgodnie z założeniami projektu, prototyp nie został narysowany na kartce papieru, lecz zaprojektowany bezpośrednio jako interaktywna aplikacja webowa przy użyciu narzędzia generative UI **v0 (v0.dev)** na bazie frameworka **Next.js 14, Tailwind CSS, shadcn/ui oraz Lucide Icons**.

### 4.1. Architektura rozwiązania i kluczowe ekrany

```
[EKRAN 1: Start / Wyszukiwarka GPS]
       │
       ▼
[EKRAN 2: Lista i Mapa Przychodni z wyróżnionym statusem "Wolne terminy dziś"]
       │
       ▼ (Kliknięcie wielkiego, kontrastowego CTA "UMÓW WIZYTĘ")
[EKRAN 3: 3-Krokowy Formularz Rezerwacji (Dzień/Godzina -> Dane -> Potwierdzenie)]
       │
       ▼
[EKRAN 4: Ekran Sukcesu z potwierdzeniem SMS, kodem QR i opcją powrotu]
```

### 4.2. Kluczowe ulepszenia wyeliminowujące błędy starej aplikacji:
1. **Eliminacja błądzenia wzroku:** Każda karta przychodni posiada jaskrawy, pełnowymiarowy przycisk główny `[ UMÓW WIZYTĘ ]` o wysokości min. 48px, spełniający kryteria dostępności WCAG 2.1 AAA.
2. **Pływający pasek rezerwacji (Sticky Bottom Bar):** W widoku szczegółów placówki przycisk rezerwacji pozostaje na stałe przyklejony do dolnej krawędzi ekranu.
3. **Przełącznik „Tryb Seniora / Duży Tekst”:** Umieszczony w prawym górnym rogu nagłówka, natychmiast powiększający fonty o 25% i maksymalizujący kontrast.
4. **Wbudowany Asystent AI („Pomoc w wyborze”):** Pacjent może wpisać lub podyktować swoje dolegliwości, a sztuczna inteligencja odfiltruje przychodnie z lekarzami przyjmującymi w danym obszarze.

### 4.3. Wykorzystanie i struktura Promptu dla v0.dev
Przygotowano wyczerpujący, produkcyjny prompt systemowy dla v0.dev, który definiuje stan aplikacji, paletę barw (kojący błękit medyczny `#0284c7`, zieleń akcji `#16a34a`), komponenty dialogowe, wyszukiwanie w czasie rzeczywistym oraz responsywność mobile-first.

*(Kompletny tekst promptu znajduje się w pliku `prompts/V0_MASTER_PROMPT.md` w repozytorium).*

---

## 5. Faza Testów (Test) i Walidacja

### 5.1. Test użyteczności prototypu (A/B Test)
Wygenerowany za pomocą v0 prototyp poddano testowi weryfikacyjnemu z tą samą respondentką (Pani Janina, 68 lat).

* **Zadanie:** Identyczne jak w fazie empatii – znalezienie najbliższej przychodni i rezerwacja wizyty na kolejny dzień.
* **Wyniki ilościowe:**
  * **Czas ukończenia zadania:** Spadek z ponad 9 minut (nieukończone) do **48 sekund**!
  * **Liczba błędnych kliknięć:** 0 (użytkowniczka od razu kliknęła w duży zielony przycisk CTA).
  * **Wskaźnik zadowolenia (SUS - System Usability Scale):** Wzrost z 15/100 na 92.5/100 punktów.
* **Komentarz respondentki po teście:**
  > *„O! Wreszcie to widać jak na dłoni! Duże litery, piękny zielony przycisk, kliknęłam jutro 10:00, wpisałam telefon i od razu dostałam zielony znaczek z potwierdzeniem. Taka powinna być każda aplikacja!”*

---

## 6. Podsumowanie i Wnioski

Zastosowanie metodyki **Design Thinking** pozwoliło zidentyfikować rzeczywisty punkt bólu użytkowników: nie był nim brak skomplikowanych funkcji, lecz rażące błędy ergonomii interfejsu (niewidoczne przyciski rezerwacji). Dzięki przejściu przez fazy empatii, definicji, burzy mózgów i błyskawicznemu prototypowaniu w v0.dev stworzono produkt w pełni dostępny cyfrowo, prosty i gotowy do realnego wdrożenia.

### Podpisy członków grupy:

1. Denys ............................................................................ (Data: 19.11.2026)
2. .................................................................................... (Data: 19.11.2026)
3. .................................................................................... (Data: 19.11.2026)
