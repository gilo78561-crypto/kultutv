import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/services/api";
import { ProgramCard } from "@/components/ProgramCard";
import { CubeCarousel } from "@/components/CubeCarousel";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Reveal } from "@/components/Reveal";
import { CardSkeletonGrid, Skeleton } from "@/components/Skeleton";

export const Route = createFileRoute("/tv/")({
  head: () => ({
    meta: [
      { title: "TV — Direct, émissions et replays | KULTU TV" },
      {
        name: "description",
        content:
          "Regardez KULTU TV en direct, retrouvez toutes les émissions et les replays disponibles à la demande.",
      },
      { property: "og:title", content: "TV KULTU — Direct et replays" },
      {
        property: "og:description",
        content: "Le direct, les émissions et les replays de KULTU TV.",
      },
    ],
  }),
  component: TvPage,
});

function TvPage() {
  const emissions = useQuery({ queryKey: queryKeys.emissions, queryFn: api.getEmissions });
  const replays = useQuery({ queryKey: queryKeys.replays, queryFn: api.getReplays });
  const streams = useQuery({ queryKey: queryKeys.tvStreams, queryFn: api.getTvStreams });
  const main = streams.data?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Télévision</p>
        <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">KULTU TV</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Le direct 24/7, nos émissions signature et l'intégralité des replays.
        </p>
      </Reveal>

      <div className="mx-auto mt-6 w-1/2">
        {!main ? (
          <Skeleton className="aspect-video w-full" />
        ) : (
          <VideoPlayer src={main.url} poster={main.cover} title={main.name} watchOnly />
        )}
      </div>

      <h2 className="display mt-14 text-3xl tracking-[calc(0.025em+1px)] md:text-4xl">Émissions</h2>
      <div className="mt-6">
        {emissions.isLoading ? (
          <CardSkeletonGrid count={6} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emissions.data?.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.05}>
                <ProgramCard
                  title={e.title}
                  subtitle={e.category}
                  meta={`${e.schedule} · ${e.host}`}
                  cover={e.cover}
                  to="/emissions/$slug"
                  params={{ slug: e.slug }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <CubeCarousel
        title="Replays"
        items={(replays.data ?? []).slice(0, 6).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: `${r.emission} · ${r.duration}`,
          cover: r.cover,
          to: "/tv/emissions/$slug",
          params: { slug: r.slug },
        }))}
      />
    </div>
  );
}
