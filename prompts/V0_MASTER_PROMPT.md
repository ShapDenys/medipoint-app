# Główny Prompt dla v0.dev (Master Prompt)

> **Instrukcja użycia:**  
> Skopiuj poniższy blok tekstu (od sekcji *Prompt dla v0*) i wklej go bezpośrednio w pole tekstowe na stronie [v0.dev](https://v0.dev). Narzędzie v0 wygeneruje kompletny, interaktywny prototyp aplikacji webowej w Next.js + Tailwind CSS + shadcn/ui.

---

```markdown
Create an accessible, modern, and empathetic web application in Next.js 14 (App Router) called "MediBlisko" (NearClinic) designed specifically to solve a major UX flaw in healthcare booking: elderly and non-tech-savvy users struggle to find the booking buttons and get lost in complicated clinic menus.

### Core UX Objectives & Problem Solution:
1. IMPOSSIBLE TO MISS CTA BUTTONS: Every clinic card and detail view MUST have a huge, prominent, high-contrast, vibrantly styled "Umów wizytę" (Book Appointment) button (min height 48px, bold text, contrasting color like vibrant emerald green or vivid medical blue). On mobile, when a clinic is selected, a sticky bottom action bar keeps the "Umów wizytę teraz" button permanently visible.
2. ACCESSIBILITY / SENIOR MODE: Include an easily visible toggle in the header: "👁️ Tryb Seniora / Duży Tekst" (Senior Mode) that instantly enlarges fonts by 25%, increases button targets, simplifies the layout, and applies high-contrast styling (WCAG 2.1 AAA compliance).
3. AI-POWERED CLINIC & SPECIALIST MATCHER: A friendly AI Assistant card on the homepage: "Opisz swoje objawy lub powiedz, co Ci dolega" (e.g. "Boli mnie gardło i mam gorączkę od wczoraj") with an interactive input that suggests the right specialist (np. "Internista / Lekarz POZ") and instantly filters clinics with the nearest open slots.
4. ULTRA-SIMPLE 3-STEP BOOKING WIZARD:
   - Step 1: Pick Date & Time Slot (Clear cards: "DZISIAJ (19 Lis)", "JUTRO (20 Lis)", with clear time badges: "14:30", "15:15", "16:00", showing doctor's name and room number).
   - Step 2: Patient Info (Only essential fields: Full Name, Phone Number, PESEL optional).
   - Step 3: Immediate Confirmation screen with a big green checkmark, appointment summary card, free SMS reminder notification badge, and a button to print or download a large-print receipt.

### Application Layout & Key Components:
- Header:
  - Logo "MediBlisko" with a health heart/cross icon.
  - Location badge: "📍 Twoja lokalizacja: Poznań, Winogrady" (with an option to change).
  - Senior Mode switch ("Większe litery i kontrast").
  - Emergency 112 quick dial alert banner ("W stanie zagrożenia życia zadzwoń pod 112").
- Hero Section:
  - Large friendly search bar with auto-detect GPS button ("Znajdź najbliższą przychodnię").
  - Quick filter pills: "Wszystkie", "NFZ (Bezpłatne)", "Otwarte teraz", "Wolne terminy dzisiaj".
- AI Symptom Concierge Banner:
  - Interactive input field with pre-made chips ("Ból gardła i gorączka", "Recepta na nadciśnienie", "Ból kręgosłupa", "Szczepienie"). Clicking or typing triggers a simulated AI diagnosis and filters the list.
- Clinic Listings (Interactive List + Mock Map Toggle):
  - Mock interactive clinic cards with:
    1. Clinic name (e.g., "NZOZ Zdrowie - Winogrady", "Przychodnia Rejonowa nr 4", "Centrum Medyczne Medica").
    2. Distance and walking time ("450 m stąd • 6 min pieszo").
    3. Status pill: "🟢 Wolne terminy DZISIAJ: 14:30, 15:15".
    4. Contract badge ("NFZ - bezpłatnie").
    5. THE HERO ELEMENT: Massive, vibrant button: "👉 [ UMÓW WIZYTĘ W TEJ PRZYCHODNI ]" that opens the booking modal or drawer.
- Interactive Booking Flow (Modal/Dialog or Step-by-step Drawer):
  - State management in React: tracks selected clinic, doctor, date, time slot, and patient info.
  - Clear progress bar: "Krok 1: Termin -> Krok 2: Dane pacjenta -> Krok 3: Potwierdzenie".
  - Success state: Displays appointment ticket with number (e.g., "#PL-8421"), calendar export button, and return home button.

### Design & Tech Stack:
- Framework: Next.js 14 App Router, React with hooks (`useState`, `useMemo`).
- Styling: Tailwind CSS (with smooth transitions, accessible contrast ratios, generous padding, clean borders).
- UI Components: shadcn/ui inspired primitives (Button, Card, Dialog, Badge, Tabs, Input, Switch, Alert).
- Icons: `lucide-react` (Stethoscope, MapPin, Calendar, Clock, Phone, CheckCircle2, Bot, Sparkles, Eye, ShieldCheck).
- Polish language for all UI copy, written in simple, welcoming, jargon-free phrasing.
```
