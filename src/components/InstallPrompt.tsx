import { Download, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type PromptEvent = Event & { prompt: () => Promise<void> };

export function InstallPrompt() {
  const [event, setEvent] = useState<PromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as PromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const visible = Boolean(event) && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="glass-panel fixed inset-x-3 bottom-24 z-40 flex items-center gap-3 rounded-2xl p-3 shadow-soft md:inset-x-auto md:left-6 md:w-[340px]"
        >
          <Download className="h-5 w-5 text-primary" />
          <p className="flex-1 text-sm">Installer KULTU TV sur votre appareil</p>
          <button
            type="button"
            onClick={() => event?.prompt()}
            className="gradient-ember rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Installer
          </button>
          <button type="button" onClick={() => setDismissed(true)} aria-label="Fermer">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
