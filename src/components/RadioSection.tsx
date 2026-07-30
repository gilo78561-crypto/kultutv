import { useQuery } from "@tanstack/react-query";
import { Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { api, queryKeys } from "@/services/api";
import { useRadio } from "@/hooks/use-radio";
import { Skeleton } from "./Skeleton";
import { Reveal } from "./Reveal";

const EQ_BARS = [0, 0.15, 0.3, 0.1, 0.25];

export function RadioSection() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.radioStreams,
    queryFn: api.getRadioStreams,
  });
  const {
    current,
    isPlaying,
    isLoading: streamLoading,
    volume,
    play,
    toggle,
    setVolume,
  } = useRadio();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <h2 className="display text-4xl tracking-[calc(0.025em+1px)] md:text-5xl">
          Radio en direct
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Un flux continu, une lecture qui vous suit de page en page.
        </p>
      </Reveal>

      <div className="mt-8 flex justify-center">
        {isLoading ? (
          <Skeleton className="h-20 w-full max-w-3xl md:h-24" />
        ) : (
          data?.map((stream) => {
            const active = current?.id === stream.id;
            const playing = active && isPlaying;
            return (
              <Reveal key={stream.id} className="w-full max-w-3xl">
                <article className="gradient-ember relative overflow-hidden rounded-3xl p-4 text-primary-foreground shadow-glow md:p-5">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 8px)",
                    }}
                  />

                  <div className="relative flex items-center gap-4 md:gap-5">
                    <button
                      type="button"
                      onClick={() => (active ? toggle() : play(stream))}
                      aria-label={`Écouter ${stream.name}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/70 text-white transition-transform hover:scale-110 active:scale-95 md:h-16 md:w-16"
                    >
                      {active && streamLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : playing ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 translate-x-0.5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                        Direct
                      </p>
                      <h3 className="truncate text-lg font-semibold md:text-2xl">{stream.name}</h3>
                      <div className="mt-1.5 flex h-3 items-end gap-0.5" aria-hidden="true">
                        {EQ_BARS.map((delay, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full bg-white/80 ${playing ? "animate-eq" : "h-1"}`}
                            style={
                              playing ? { animationDelay: `${delay}s`, height: "100%" } : undefined
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 sm:flex sm:w-28 md:w-36">
                      {volume > 0 ? (
                        <Volume2 className="h-4 w-4 shrink-0 text-white/80" />
                      ) : (
                        <VolumeX className="h-4 w-4 shrink-0 text-white/80" />
                      )}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={volume}
                        aria-label="Volume radio"
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="h-1 w-full accent-white"
                      />
                    </div>

                    <img
                      src={stream.cover}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full border-4 border-white/30 object-cover shadow-lg md:h-16 md:w-16"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })
        )}
      </div>
    </section>
  );
}
