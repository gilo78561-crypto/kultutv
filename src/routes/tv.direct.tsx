import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Skeleton } from "@/components/Skeleton";
import { api, queryKeys } from "@/services/api";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/tv/direct")({
  head: () => ({
    meta: [
      { title: "Direct TV en HLS | KULTU TV" },
      {
        name: "description",
        content: "Le direct KULTU TV en streaming HLS : programme en cours et grille de la soirée.",
      },
      { property: "og:title", content: "KULTU TV en direct" },
      { property: "og:description", content: "Regardez le direct KULTU TV en streaming HLS." },
    ],
  }),
  component: DirectPage,
});

function DirectPage() {
  const streams = useQuery({ queryKey: queryKeys.tvStreams, queryFn: api.getTvStreams });
  const programme = useQuery({ queryKey: queryKeys.programme, queryFn: api.getProgrammeEnCours });
  const main = streams.data?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Direct</p>
        <h1 className="mt-2 text-4xl tracking-[calc(0.025em+1px)] md:text-6xl">
          {programme.data?.title ?? "KULTU TV en direct"}
        </h1>
      </Reveal>

      <div className="mt-8">
        {!main ? (
          <Skeleton className="aspect-video w-full" />
        ) : (
          <VideoPlayer src={main.url} poster={main.cover} title={main.name} watchOnly />
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="display text-2xl tracking-[calc(0.025em+1px)]">À l'antenne</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {programme.data?.description ?? "Chargement du programme…"}
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="display text-2xl tracking-[calc(0.025em+1px)]">À suivre</h2>
          <ul className="mt-3 space-y-3">
            {programme.data?.next.map((n) => (
              <li key={n.title} className="flex gap-3 text-sm">
                <span className="font-semibold text-primary">{n.startsAt}</span>
                <span className="text-muted-foreground">{n.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
