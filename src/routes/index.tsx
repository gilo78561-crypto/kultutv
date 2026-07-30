import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CubeCarousel } from "@/components/CubeCarousel";
import { RadioSection } from "@/components/RadioSection";
import { PodcastGrid } from "@/components/PodcastGrid";
import { ArticleCard } from "@/components/ArticleCard";
import { ProgramCard } from "@/components/ProgramCard";
import { Reveal } from "@/components/Reveal";
import { CardSkeletonGrid } from "@/components/Skeleton";
import { api, queryKeys } from "@/services/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KULTU TV — TV en direct, radio, Kultu Webzine et podcasts" },
      {
        name: "description",
        content:
          "KULTU TV : la plateforme média premium. TV en direct, replays, radio continue, Kultu Webzine, podcasts et flash infos.",
      },
      {
        property: "og:title",
        content: "KULTU TV — TV en direct, radio, Kultu Webzine et podcasts",
      },
      {
        property: "og:description",
        content:
          "KULTU TV : la plateforme média premium. TV en direct, replays, radio continue, Kultu Webzine, podcasts et flash infos.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const replays = useQuery({ queryKey: queryKeys.replays, queryFn: api.getReplays });
  const articles = useQuery({ queryKey: queryKeys.articles, queryFn: api.getArticles });
  const emissions = useQuery({ queryKey: queryKeys.emissions, queryFn: api.getEmissions });

  return (
    <div>
      <Hero />

      <CubeCarousel
        title="Replays à la une"
        items={(replays.data ?? []).slice(0, 6).map((r) => ({
          id: r.id,
          title: r.title,
          subtitle: r.emission,
          cover: r.cover,
          to: "/tv/emissions/$slug",
          params: { slug: r.slug },
        }))}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <h2 className="display text-4xl tracking-[calc(0.025em+1px)] md:text-5xl">
            Nos émissions
          </h2>
          <Link
            to="/tv"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {emissions.isLoading ? (
          <CardSkeletonGrid count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {emissions.data?.slice(0, 4).map((e, i) => (
              <Reveal key={e.id} delay={i * 0.06}>
                <ProgramCard
                  title={e.title}
                  subtitle={e.category}
                  meta={e.schedule}
                  cover={e.cover}
                  to="/emissions/$slug"
                  params={{ slug: e.slug }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <RadioSection />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <h2 className="display text-4xl tracking-[calc(0.025em+1px)] md:text-5xl">
            Le Kultu Webzine
          </h2>
          <Link
            to="/webzine"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Tous les articles <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {articles.isLoading ? (
          <CardSkeletonGrid count={3} />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {articles.data?.slice(0, 3).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <PodcastGrid />
    </div>
  );
}
