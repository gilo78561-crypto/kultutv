import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { useState } from "react";
import { api, queryKeys } from "@/services/api";
import { Reveal } from "@/components/Reveal";
import { Skeleton } from "@/components/Skeleton";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function todayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export const Route = createFileRoute("/programme-tv")({
  head: () => ({
    meta: [
      { title: "Programme TV — Grille des émissions | KULTU TV" },
      {
        name: "description",
        content:
          "Le programme TV de KULTU TV jour par jour : horaires, émissions et catégories de la grille.",
      },
      { property: "og:title", content: "Programme TV KULTU" },
      { property: "og:description", content: "La grille complète des émissions KULTU TV." },
    ],
  }),
  component: ProgrammeTvPage,
});

function ProgrammeTvPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.emissions,
    queryFn: api.getEmissions,
  });
  const [dayIndex, setDayIndex] = useState(todayIndex());
  const selectedDay = DAYS[dayIndex];
  const isToday = dayIndex === todayIndex();
  const currentHour = new Date().getHours();

  const dayEmissions = (data ?? [])
    .filter((e) => e.schedule.startsWith(selectedDay))
    .map((e) => ({ ...e, time: e.schedule.split("—")[1]?.trim() ?? "" }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Grille des programmes
        </p>
        <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">Programme TV</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Toute la grille KULTU TV, jour par jour : horaires, émissions et catégories.
        </p>
      </Reveal>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            type="button"
            onClick={() => setDayIndex(i)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              i === dayIndex
                ? "gradient-ember text-primary-foreground shadow-glow"
                : "glass-panel text-muted-foreground hover:text-foreground"
            }`}
          >
            {day}
            {i === todayIndex() && (
              <span className="ml-1.5 text-[10px] opacity-80">· Aujourd'hui</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : dayEmissions.length ? (
          dayEmissions.map((e, i) => {
            const live = isToday && Number.parseInt(e.time, 10) === currentHour;
            return (
              <Reveal key={e.id} delay={i * 0.05}>
                <Link
                  to="/emissions/$slug"
                  params={{ slug: e.slug }}
                  className="card-hover glass-panel group flex items-center gap-4 rounded-2xl p-4"
                >
                  <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-muted py-2.5 text-center">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold">{e.time}</span>
                  </div>
                  <img
                    src={e.cover}
                    alt=""
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {e.category}
                      {live && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-white">
                          <span className="animate-live h-1.5 w-1.5 rounded-full bg-white" /> En ce
                          moment
                        </span>
                      )}
                    </p>
                    <h3 className="truncate text-base font-semibold">{e.title}</h3>
                    <p className="truncate text-xs text-muted-foreground">Présenté par {e.host}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
            Aucune émission programmée ce jour — profitez du direct et des replays sur{" "}
            <Link to="/tv" className="text-primary hover:underline">
              KULTU TV
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
