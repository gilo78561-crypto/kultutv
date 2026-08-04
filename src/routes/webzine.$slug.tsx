import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { api } from "@/services/api";
import { ArticleCard } from "@/components/ArticleCard";

export const Route = createFileRoute("/webzine/$slug")({
  loader: async ({ params }) => {
    const article = await api.getArticle(params.slug);
    if (!article) throw notFound();
    const articles = await api.getArticles();
    return { article, more: articles.filter((a) => a.slug !== params.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article indisponible | KULTU TV" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} | Kultu Webzine` },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
      ],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-muted-foreground" role="alert">
      {error.message}
    </p>
  ),
  notFoundComponent: ArticleNotFound,
});

function ArticleNotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="display text-4xl">Article introuvable</h1>
      <Link to="/webzine" className="mt-4 inline-block text-primary hover:underline">
        Retour au Kultu Webzine
      </Link>
    </div>
  );
}

function ArticlePage() {
  const { article, more } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {article.category}
        </p>
        <h1 className="mt-2 text-4xl leading-tight tracking-[calc(0.025em+1px)] md:text-6xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Par {article.author} · {article.date} · {article.readTime} de lecture
        </p>
        <img
          src={article.cover}
          alt={article.title}
          className="mt-8 aspect-[4/5] w-full rounded-2xl bg-muted/40 object-contain p-1 shadow-soft"
        />
      </Reveal>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
        <p className="text-xl text-foreground">{article.excerpt}</p>
        {article.body.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="display mt-16 text-3xl tracking-[calc(0.025em+1px)]">À lire ensuite</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {more.map((a: typeof article) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </article>
  );
}
