import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Headphones, Play } from "lucide-react";
import { useEffect, useState } from "react";
import heroCotonou from "@/assets/hero/Benin-Cotonou-Place_de_amazone-Pietra_Giallo-40x80x3.jpg";
import heroVodun from "@/assets/hero/Grand-Vodun-Ceremonies-Rituals.jpg";
import heroCotonouView from "@/assets/hero/55037969967_30e5450c6c_o.jpg";
import heroStudio from "@/assets/hero/Screenshot_20260729-115138.jpg";
import heroPortrait from "@/assets/hero/Screenshot_20260729-123358.jpg";
import heroBenin from "@/assets/hero/Un_voyage_au_Benin___mes_incontournables.jpg";
import { useRadio } from "@/hooks/use-radio";
import { radioStreams, tvStreams, podcasts, articles } from "@/services/mock-data";

const heroBackgrounds = [
  heroVodun,
  heroCotonou,
  heroCotonouView,
  heroStudio,
  heroPortrait,
  heroBenin,
];

const previewCards = [
  {
    label: "Kultu TV Live",
    sub: "En direct",
    live: true,
    cover: tvStreams[0].cover,
    to: "/tv/direct" as const,
  },
  {
    label: "Radio Kultu",
    sub: "24h/24 et 7j/7",
    live: false,
    cover: radioStreams[0].cover,
    to: "/radio" as const,
  },
  {
    label: "Podcasts",
    sub: "Écoutez, apprenez",
    live: false,
    cover: podcasts[0].cover,
    to: "/" as const,
  },
  {
    label: "Kultu Webzine",
    sub: "Actualités & culture",
    live: false,
    cover: articles[0].cover,
    to: "/webzine" as const,
  },
];

function PreviewCardItem({ card }: { card: (typeof previewCards)[number] }) {
  return (
    <Link
      to={card.to}
      className="card-hover group w-[70vw] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/60 backdrop-blur sm:w-[220px] md:w-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={card.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {card.live && (
          <span className="absolute left-2 top-2 rounded bg-live px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Live
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-white">
            {card.label}
          </p>
          <p className="truncate text-xs text-white/60">{card.sub}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function Hero() {
  const { play } = useRadio();
  const [bgIndex, setBgIndex] = useState(0);
  const count = heroBackgrounds.length;

  useEffect(() => {
    const t = setInterval(() => setBgIndex((i) => (i + 1) % count), 8000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section className="relative min-h-[86vh] w-full overflow-hidden bg-black pb-56 md:pb-64">
      <AnimatePresence>
        <motion.img
          key={heroBackgrounds[bgIndex]}
          src={heroBackgrounds[bgIndex]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent md:bg-gradient-to-l" />

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-start justify-end px-4 pb-10 pt-28 md:items-end md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-left"
        >
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/70">
            <span className="gradient-ember h-3.5 w-[3px] rounded-full" /> Bienvenue sur Kultu TV
          </p>
          <h1 className="mt-4 text-6xl leading-[0.95] tracking-[calc(0.025em+1px)] md:text-8xl">
            <span className="block text-white">La culture</span>
            <span className="text-gradient-ember block">en continu</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80">
            Télévision en direct, radio continue, webzine culturel, podcasts et documentaires.
            <br className="hidden sm:block" />
            Le meilleur de la culture béninoise et africaine, partout et à tout moment.
          </p>

          <div className="mt-5 h-[3px] w-10 rounded-full gradient-ember" />

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tv/direct"
              className="gradient-ember inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4" /> Voir la télé en direct
            </Link>
            <button
              type="button"
              onClick={() =>
                play({
                  id: radioStreams[0].id,
                  name: radioStreams[0].name,
                  url: radioStreams[0].url,
                  cover: radioStreams[0].cover,
                })
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Écouter la radio <Headphones className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 md:hidden">
            {heroBackgrounds.map((bg, i) => (
              <button
                key={bg}
                type="button"
                onClick={() => setBgIndex(i)}
                aria-label={`Aller à l'image ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === bgIndex ? "w-6 gradient-ember" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Desktop-only slide indicator: vertical dots on the right edge */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <div className="absolute left-1/2 top-1 h-[calc(100%-8px)] w-px -translate-x-1/2 bg-white/20" />
        {heroBackgrounds.map((bg, i) => (
          <button
            key={bg}
            type="button"
            onClick={() => setBgIndex(i)}
            aria-label={`Aller à l'image ${i + 1}`}
            className={`relative z-10 rounded-full transition-all ${
              i === bgIndex ? "h-3 w-3 bg-primary" : "h-2 w-2 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Bottom bar: arrows/counter/progress (desktop) + preview cards */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 py-6 md:mx-auto md:max-w-7xl md:flex-row md:items-end md:px-8">
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setBgIndex((i) => (i - 1 + count) % count)}
            aria-label="Image précédente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-transform hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setBgIndex((i) => (i + 1) % count)}
            aria-label="Image suivante"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-transform hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-sm text-white/70">
            {String(bgIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {heroBackgrounds.map((bg, i) => (
              <span
                key={bg}
                className={`h-1 rounded-full transition-all ${
                  i === bgIndex ? "w-9 gradient-ember" : "w-6 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden md:overflow-visible">
          <div className="animate-ticker flex gap-4 md:hidden">
            {[...previewCards, ...previewCards].map((card, i) => (
              <PreviewCardItem key={`${card.label}-${i}`} card={card} />
            ))}
          </div>
          <div className="hidden gap-4 md:grid md:grid-cols-4">
            {previewCards.map((card) => (
              <PreviewCardItem key={card.label} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
