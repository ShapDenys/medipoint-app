import { CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Mobile-only bar that keeps the booking button permanently visible. */
export function StickyBookBar({ clinicName, onBook }: { clinicName: string; onBook: () => void }) {
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-cta/30 bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-18px] shadow-foreground/40 backdrop-blur md:hidden animate-fade-up">
      <p className="mb-2 truncate text-sm font-semibold text-muted-foreground">
        Wybrana przychodnia: <span className="text-foreground">{clinicName}</span>
      </p>
      <Button variant="cta" size="hero" onClick={onBook}>
        <CalendarCheck aria-hidden="true" />
        UMÓW WIZYTĘ TERAZ
      </Button>
    </div>
  );
}
