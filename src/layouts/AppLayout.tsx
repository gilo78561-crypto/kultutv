import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { RadioPlayer } from "@/components/RadioPlayer";
import { IntroSplash } from "@/components/IntroSplash";
import { FlashInfoTicker } from "@/components/FlashInfoTicker";
import { ConventionBanner } from "@/components/ConventionBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ThemeProvider } from "@/hooks/use-theme";
import { RadioProvider } from "@/hooks/use-radio";

export function AppLayout({ children }: { children: ReactNode }) {
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
        <InstallPrompt />
        <Toaster position="top-center" richColors />
      </RadioProvider>
    </ThemeProvider>
  );
}
