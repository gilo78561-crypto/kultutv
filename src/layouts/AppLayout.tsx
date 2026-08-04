import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { RadioPlayer } from "@/components/RadioPlayer";
import { IntroSplash } from "@/components/IntroSplash";
import { FlashInfoTicker } from "@/components/FlashInfoTicker";
import { ConventionBanner } from "@/components/ConventionBanner";
import { ThemeProvider } from "@/hooks/use-theme";
import { RadioProvider } from "@/hooks/use-radio";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  // The admin has its own shell (sidebar, topbar) — skip the public site's
  // nav, ticker, footer and radio player there.
  if (isAdmin) {
    return (
      <ThemeProvider storageKey="kultu-admin-theme">
        <RadioProvider>
          {children}
          <Toaster position="top-center" richColors />
        </RadioProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <RadioProvider>
        <IntroSplash />
        <div className="sticky top-0 z-50">
          <FlashInfoTicker />
          <SiteHeader />
        </div>
        <main className="min-h-screen">{children}</main>
        <ConventionBanner />
        <Footer />
        <RadioPlayer />
        <Toaster position="top-center" richColors />
      </RadioProvider>
    </ThemeProvider>
  );
}
