import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Reveal } from "@/components/Reveal";
import { api } from "@/services/api";

export const Route = createFileRoute("/tv/emissions/$slug")({
  loader: async ({ params }) => {
    const replay = await api.getReplay(params.slug);
    if (!replay) throw notFound();
    return { replay };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Replay indisponible | KULTU TV" }, { name: "robots", content: "noindex" }],
      };
    }
    const { replay } = loaderData;
    return {
      meta: [
        { title: `${replay.title} — Replay | KULTU TV` },
        { name: "description", content: replay.description },
        { property: "og:title", content: replay.title },
        { property: "og:description", content: replay.description },
      ],
    };
  },
  component: ReplayPage,
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-muted-foreground" role="alert">
      {error.message}
    </p>
  ),
  notFoundComponent: ReplayNotFound,
});

function ReplayNotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="display text-4xl">Replay introuvable</h1>
      <Link to="/tv" className="mt-4 inline-block text-primary hover:underline">
        Retour à la TV
      </Link>
    </div>
  );
}

function ReplayPage() {
  const { replay } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Replay · {replay.emission}
        </p>
        <h1 className="mt-2 text-4xl tracking-[calc(0.025em+1px)] md:text-6xl">{replay.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {replay.duration}
          {replay.date && ` · diffusé le ${replay.date}`}
        </p>
      </Reveal>
      <div className="mt-8">
        <VideoPlayer
          src={replay.streamUrl}
          poster={replay.cover}
          title={replay.title}
          live={false}
        />
      </div>
      <p className="mt-8 max-w-2xl text-muted-foreground">{replay.description}</p>
    </div>
  );
}
