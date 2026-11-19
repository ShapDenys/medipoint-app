import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { EmergencyBanner, SiteFooter, SiteHeader } from "@/components/medipoint/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { AppPrefsProvider } from "@/lib/app-prefs";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Nie ma takiej strony</h2>
        <p className="mt-2 text-muted-foreground">
          Ta strona nie istnieje albo została przeniesiona.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Strona się nie wczytała
        </h1>
        <p className="mt-2 text-muted-foreground">
          Coś poszło nie tak po naszej stronie. Spróbuj ponownie albo wróć na stronę główną.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Spróbuj ponownie
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Strona główna
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Each content route, / included, sets its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "MediPoint – umów wizytę w najbliższej przychodni" },
      {
        name: "description",
        content: "Znajdź przychodnię blisko domu i umów wizytę w 3 prostych krokach. Tryb Seniora z dużym tekstem.",
      },
      { property: "og:title", content: "MediPoint – umów wizytę w najbliższej przychodni" },
      {
        property: "og:description",
        content: "Znajdź przychodnię blisko domu i umów wizytę w 3 prostych krokach. Tryb Seniora z dużym tekstem.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pl_PL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1f5f73" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700;800&family=Lexend:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppPrefsProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:font-semibold focus:text-primary-foreground"
        >
          Przejdź do treści
        </a>
        <EmergencyBanner />
        <SiteHeader />
        <main id="main">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster position="top-center" richColors closeButton />
      </AppPrefsProvider>
    </QueryClientProvider>
  );
}
