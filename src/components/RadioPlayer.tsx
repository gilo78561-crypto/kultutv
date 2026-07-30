import { Loader2, Pause, Play, Radio, Volume2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRadio } from "@/hooks/use-radio";

export function RadioPlayer() {
  const { current, isPlaying, isLoading, volume, toggle, stop, setVolume } = useRadio();

  return (
    <AnimatePresence>
      {current && (
        <motion.aside
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-6 md:w-[380px]"
          aria-label="Lecteur radio"
        >
          <div className="glass-panel flex items-center gap-3 rounded-2xl p-3 shadow-glow">
            <img
              src={current.cover}
              alt=""
              loading="lazy"
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Radio className="h-3 w-3" /> En direct
              </p>
              <p className="truncate text-sm font-semibold">{current.name}</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Pause radio" : "Lecture radio"}
              className="gradient-ember flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-transform hover:scale-110 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                aria-label="Volume radio"
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-16 accent-primary"
              />
            </div>
            <button
              type="button"
              onClick={stop}
              aria-label="Fermer le lecteur"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
