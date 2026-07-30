import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { api, queryKeys } from "@/services/api";
import { SearchBar } from "@/components/SearchBar";
import { ArticleCard } from "@/components/ArticleCard";
import { ProgramCard } from "@/components/ProgramCard";
import { CardSkeletonGrid } from "@/components/Skeleton";
import { Reveal } from "@/components/Reveal";

const searchSchema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/recherche")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Recherche globale | KULTU TV" },
      {
        name: "description",
        content: "Recherchez une émission, un replay, un article ou un podcast sur KULTU TV.",
      },
      { property: "og:title", content: "Recherche KULTU TV" },
      { property: "og:description", content: "Trouvez émissions, replays, articles et podcasts." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.search(q),
    queryFn: () => api.search(q),
    enabled: q.length > 0,
  });

  const total =
    (data?.articles.length ?? 0) +
    (data?.emissions.length ?? 0) +
    (data?.replays.length ?? 0) +
    (data?.podcasts.length ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <h1 className="text-5xl tracking-[calc(0.025em+1px)] md:text-6xl">Recherche</h1>
        <div className="mt-6 max-w-xl">
          <SearchBar defaultValue={q} />
        </div>
        {q && (
          <p className="mt-4 text-sm text-muted-foreground">
            {isLoading ? "Recherche en cours…" : `${total} résultat(s) pour « ${q} »`}
          </p>
        )}
      </Reveal>

      {isLoading && <div className="mt-10">{<CardSkeletonGrid count={4} />}</div>}

      {data && (
        <div className="mt-10 space-y-12">
          {data.emissions.length > 0 && (
            <section>
              <h2 className="display text-3xl tracking-[calc(0.025em+1px)]">Émissions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.emissions.map((e) => (
                  <ProgramCard
                    key={e.id}
                    title={e.title}
                    subtitle={e.category}
                    meta={e.schedule}
                    cover={e.cover}
                    to="/emissions/$slug"
                    params={{ slug: e.slug }}
                  />
                ))}
              </div>
            </section>
          )}

          {data.replays.length > 0 && (
            <section>
              <h2 className="display text-3xl tracking-[calc(0.025em+1px)]">Replays</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.replays.map((r) => (
                  <ProgramCard
                    key={r.id}
                    title={r.title}
                    subtitle={r.emission}
                    meta={r.duration}
                    cover={r.cover}
                    to="/tv/emissions/$slug"
                    params={{ slug: r.slug }}
                  />
                ))}
              </div>
            </section>
          )}

          {data.articles.length > 0 && (
            <section>
              <h2 className="display text-3xl tracking-[calc(0.025em+1px)]">Articles</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}

          {data.podcasts.length > 0 && (
            <section>
              <h2 className="display text-3xl tracking-[calc(0.025em+1px)]">Podcasts</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.podcasts.map((p) => (
                  <li key={p.id} className="glass-panel flex items-center gap-3 rounded-2xl p-3">
                    <img src={p.cover} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.show}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {q && total === 0 && (
            <p className="text-muted-foreground">Aucun résultat. Essayez un autre mot-clé.</p>
          )}
        </div>
      )}
    </div>
  );
}
