import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArticleCard } from "@/components/ArticleCard";
import { CardSkeletonGrid } from "@/components/Skeleton";
import { Reveal } from "@/components/Reveal";
import { CubeCarousel } from "@/components/CubeCarousel";
import { api, queryKeys } from "@/services/api";

export const Route = createFileRoute("/webzine/")({
  head: () => ({
    meta: [
      { title: "Kultu Webzine — Enquêtes et portraits | KULTU TV" },
      {
        name: "description",
        content:
          "Le Kultu Webzine : enquêtes, portraits et reportages sur la musique, le cinéma, la mode et la société.",
      },
      { property: "og:title", content: "Le Kultu Webzine" },
      { property: "og:description", content: "Enquêtes, portraits et reportages culturels." },
    ],
  }),
  component: WebzinePage,
});

function WebzinePage() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.articles, queryFn: api.getArticles });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Kultu Webzine</p>
        <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">
          La culture décryptée
        </h1>
      </Reveal>

      <div className="mt-10">
        {isLoading ? (
          <CardSkeletonGrid count={6} />
        ) : (
          <>
            {data?.[0] && (
              <Reveal className="mb-6">
                <ArticleCard article={data[0]} featured />
              </Reveal>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.slice(1).map((a, i) => (
                <Reveal key={a.id} delay={i * 0.05}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>

      <CubeCarousel
        title="À la une en 3D"
        items={(data ?? []).map((a) => ({
          id: a.id,
          title: a.title,
          subtitle: a.category,
          cover: a.cover,
          to: "/webzine/$slug",
          params: { slug: a.slug },
        }))}
      />
    </div>
  );
}
