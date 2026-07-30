import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

export function ProgramCard({
  title,
  subtitle,
  cover,
  meta,
  to,
  params,
}: {
  title: string;
  subtitle?: string;
  cover: string;
  meta?: string;
  to: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="card-hover group relative block overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        <span className="absolute right-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-4 w-4" />
        </span>
      </div>
      <div className="p-4">
        {subtitle && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{subtitle}</p>
        )}
        <h3 className="mt-1 line-clamp-2 text-lg leading-tight tracking-[calc(0.025em+1px)]">
          {title}
        </h3>
        {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
      </div>
    </Link>
  );
}
