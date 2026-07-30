import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { api, queryKeys } from "@/services/api";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/Skeleton";

export const Route = createFileRoute("/flash-info")({
  head: () => ({
    meta: [
      { title: "Flash info — L'actualité en continu | KULTU TV" },
      {
        name: "description",
        content: "Toutes les brèves KULTU TV : culture, musique, société et sport, en temps réel.",
      },
      { property: "og:title", content: "Flash info KULTU TV" },
      { property: "og:description", content: "L'actualité culturelle en continu." },
    ],
  }),
  component: FlashInfoPage,
});

function FlashInfoPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.flashInfo,
    queryFn: api.getFlashInfo,
    refetchInterval: 30_000,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Temps réel</p>
        <h1 className="mt-2 flex items-center gap-3 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">
          <AlertCircle className="h-10 w-10 text-live" /> Flash info
        </h1>
      </Reveal>

      <div className="mt-10 space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          : data?.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.05}>
                <div className="glass-panel card-hover flex gap-4 rounded-2xl p-5">
                  <div className="shrink-0 text-center">
                    <p className="display text-2xl text-primary">{f.time}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {f.label}
                    </p>
                  </div>
                  <p className="text-base">{f.text}</p>
                </div>
              </Reveal>
            ))}
      </div>
    </div>
  );
}
