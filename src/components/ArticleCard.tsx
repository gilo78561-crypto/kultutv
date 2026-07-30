import { Link } from "@tanstack/react-router";
import type { Article } from "@/services/mock-data";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <Link
      to="/webzine/$slug"
      params={{ slug: article.slug }}
      className="card-hover group block overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div
        className={`relative overflow-hidden bg-muted/40 ${featured ? "aspect-[16/9]" : "aspect-[4/5]"}`}
      >
        <img
          src={article.cover}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
          {article.category}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3
          className={`leading-tight tracking-[calc(0.025em+1px)] ${featured ? "text-2xl" : "text-lg"} transition-colors group-hover:text-primary`}
        >
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <p className="text-xs text-muted-foreground">
          {article.author} · {article.readTime} de lecture
        </p>
      </div>
    </Link>
  );
}
