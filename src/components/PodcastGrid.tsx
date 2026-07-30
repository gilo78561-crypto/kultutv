import { useQuery } from "@tanstack/react-query";
import { Headphones, Play } from "lucide-react";
import { api, queryKeys } from "@/services/api";
import { useRadio } from "@/hooks/use-radio";
import { Skeleton } from "./Skeleton";
import { Reveal } from "./Reveal";

export function PodcastGrid({ title = "Podcasts" }: { title?: string }) {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.podcasts, queryFn: api.getPodcasts });
  const { play } = useRadio();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <h2 className="display flex items-center gap-3 text-4xl tracking-[calc(0.025em+1px)] md:text-5xl">
          <Headphones className="h-8 w-8 text-primary" /> {title}
        </h2>
      </Reveal>

      <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] md:gap-4 md:overflow-visible md:pb-0">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[9/16] w-[38vw] shrink-0 sm:w-[160px] md:w-full"
              />
            ))
          : data?.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 0.05}
                className="w-[38vw] shrink-0 snap-start sm:w-[160px] md:w-full"
              >
                <button
                  type="button"
                  onClick={() => play({ id: p.id, name: p.title, url: p.audioUrl, cover: p.cover })}
                  className="card-hover group w-full overflow-hidden rounded-2xl border border-border bg-card text-left"
                >
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Play className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.show} · {p.duration}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
