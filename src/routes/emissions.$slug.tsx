import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Reveal } from "@/components/Reveal";
import { api } from "@/services/api";
import { ProgramCard } from "@/components/ProgramCard";

export const Route = createFileRoute("/emissions/$slug")({
  loader: async ({ params }) => {
    const emission = await api.getEmission(params.slug);
    if (!emission) throw notFound();
    const replays = await api.getReplays();
    return {
      emission,
      related: replays.filter((r) => r.emission === emission.title).slice(0, 3),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Émission indisponible | KULTU TV" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { emission } = loaderData;
    return {
      meta: [
        { title: `${emission.title} — Émission | KULTU TV` },
        { name: "description", content: emission.description },
        { property: "og:title", content: emission.title },
        { property: "og:description", content: emission.description },
      ],
    };
  },
  component: EmissionPage,
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-muted-foreground" role="alert">
      {error.message}
    </p>
  ),
  notFoundComponent: EmissionNotFound,
});

function EmissionNotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="display text-4xl">Émission introuvable</h1>
      <Link to="/tv" className="mt-4 inline-block text-primary hover:underline">
        Voir toutes les émissions
      </Link>
    </div>
  );
}

function EmissionPage() {
  const { emission, related } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <Reveal className="grid gap-8 md:grid-cols-[280px_1fr]">
        <img
          src={emission.cover}
          alt={emission.title}
          className="aspect-[3/4] w-full rounded-2xl object-cover shadow-soft"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            {emission.category}
          </p>
          <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-6xl">
            {emission.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {emission.schedule} · animé par {emission.host}
          </p>
          <p className="mt-4 max-w-xl text-muted-foreground">{emission.description}</p>
          <Link
            to="/tv/emissions/$slug"
            params={{ slug: emission.slug }}
            className="gradient-ember mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" /> Voir le dernier replay
          </Link>
        </div>
      </Reveal>

      <h2 className="display mt-14 text-3xl tracking-[calc(0.025em+1px)]">Extrait en direct</h2>
      <div className="mt-4">
        <VideoPlayer src={emission.streamUrl} poster={emission.cover} title={emission.title} />
      </div>

      <h2 className="display mt-14 text-3xl tracking-[calc(0.025em+1px)]">À voir aussi</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {related.map((r: (typeof related)[number]) => (
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
    </div>
  );
}
