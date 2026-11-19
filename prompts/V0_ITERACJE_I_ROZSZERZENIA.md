# Zestaw Promptów Uzupełniających dla v0.dev (Iteracje i Ulepszenia)

Po wygenerowaniu pierwszej wersji w v0.dev, możesz wpisywać w czacie v0 poniższe prompty iteracyjne, aby krok po kroku dopracować poszczególne elementy aplikacji.

---

## Iteracja 1: Wzmocnienie Dostępności i Trybu Seniora

```text
Dopracuj "Tryb Seniora" (Senior Mode):
1. Gdy przełącznik w nagłówku jest włączony:
   - Zwiększ rozmiar całego tekstu o kolejne 20%, a przyciski niech mają minimalną wysokość 56px z pogrubioną czcionką.
   - Zamień tła kart na białe z grubym obramowaniem 2px w kolorze ciemnogranatowym (#0f172a), aby zlikwidować wszelkie cienie, które mogą rozpraszać starsze osoby.
   - Dodaj pod każdym przyciskiem jednoznaczną podpowiedź tekstową, np. "Kliknij tutaj, aby wybrać godzinę wizyty".
2. Dodaj syntezator mowy (mock audio): przycisk "🔊 Przeczytaj na głos" obok podsumowania potwierdzenia wizyty.
```

---

## Iteracja 2: Ulepszenie Asystenta AI (Symptom Checker & Triage)

```text
Rozbuduj sekcję "AI Asystent Medyczny":
1. Dodaj animację myślenia AI (pulsująca ikona Sparkles i tekst "Analizuję objawy i szukam wolnego lekarza w pobliżu...").
2. Po wpisaniu objawów (np. "Boli mnie ucho i mam katar"):
   - Wyświetl czytelną kartę rekomendacji: "Rekomendowany specjalista: Laryngolog lub Lekarz Rodzinny POZ".
   - Pokaż bezpośredni boks: "Najbliższy wolny gabinet: Przychodnia Zdrowie (1.2 km stąd, wolny termin dziś o 16:30)".
   - Umieść wielki zielony przycisk "Zarezerwuj ten termin od razu".
```

---

## Iteracja 3: Dodanie Interaktywnej Mapy z Pinezkami

```text
Dodaj przełącznik widoku: "Widok Listy" oraz "Widok Mapy":
1. W widoku mapy stwórz estetyczną, stylizowaną mapę wektorową (lub mock z siatką ulic i wyraźnymi, dużymi pinezkami przychodni).
2. Pinezki na mapie powinny mieć wyraźne etykiety:
   - Zielona pinezka = "Wolne terminy dzisiaj".
   - Niebieska pinezka = "Wolne terminy jutro".
3. Kliknięcie w pinezkę wysuwa od dołu kartę przychodni (Bottom Sheet Drawer) z wielkim przyciskiem "Umów wizytę".
```

---

## Iteracja 4: Eksport i Powiadomienia (SMS & PDF)

```text
Dopracuj ekran końcowy rezerwacji (Sukces):
1. Dodaj pole "Wpisz numer telefonu, jeśli chcesz wysłać SMS także opiekunowi / córce".
2. Dodaj przycisk "Pobierz bilet wizyty (PDF)" generujący estetyczny widok do druku z kodem kreskowym/QR, adresem gabinetu i wskazówkami dojazdu autobusem.
3. Dodaj przycisk "Dodaj do Kalendarza Google / Apple Calendar".
```
