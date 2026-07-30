import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

export type CubeItem = {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  to?: string;
  params?: Record<string, string>;
};

/**
 * CubeCarousel — 3D rotating carousel (cover-flow / cube hybrid).
 * Auto-rotates, supports drag and arrow controls.
 */
export function CubeCarousel({
  items,
  autoRotate = true,
  title,
}: {
  items: CubeItem[];
  autoRotate?: boolean;
  title?: string;
}) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (!autoRotate || count < 2) return;
    const t = setInterval(() => setIndex((i) => i + 1), 4200);
    return () => clearInterval(t);
  }, [autoRotate, count]);

  if (!count) return null;

  const angle = 360 / count;
  const perspective = 1400;
  const radius = Math.round(280 / Math.tan(Math.PI / Math.max(count, 3)));
  // The front card is pushed toward the camera (translateZ), so perspective
  // magnifies it beyond its declared width — account for that when clearing
  // the nav buttons so they never sit on top of the card.
  const scale = perspective / (perspective - radius);
  const cardWidthMobile = 180;
  const cardWidthDesktop = 260;
  const btnHalfMobile = 18; // h-9 w-9
  const btnHalfDesktop = 20; // h-10 w-10
  const gapMobile = 24;
  const gapDesktop = 66;
  const btnOffsetMobile = Math.round((cardWidthMobile / 2) * scale + gapMobile + btnHalfMobile);
  const btnOffsetDesktop = Math.round((cardWidthDesktop / 2) * scale + gapDesktop + btnHalfDesktop);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      {title && (
        <h2 className="display mb-6 text-4xl tracking-[calc(0.025em+1px)] md:text-5xl">{title}</h2>
      )}

      <div
        className="relative overflow-x-hidden"
        style={
          {
            perspective: `${perspective}px`,
            "--btn-offset-mobile": `${btnOffsetMobile}px`,
            "--btn-offset-desktop": `${btnOffsetDesktop}px`,
          } as CSSProperties
        }
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, info) => setIndex((i) => i + (info.offset.x < 0 ? 1 : -1))}
          className="relative mx-auto h-[220px] w-full cursor-grab active:cursor-grabbing md:h-[260px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: -index * angle }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          {items.map((item, i) => {
            const content = (
              <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-border shadow-soft">
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  {item.subtitle && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
                </div>
              </div>
            );

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 aspect-video w-[180px] -translate-x-1/2 -translate-y-1/2 md:w-[260px]"
                style={{
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                {item.to ? (
                  <Link
                    to={item.to}
                    params={item.params}
                    draggable={false}
                    className="block h-full w-full"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </motion.div>

        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Précédent"
          className="glass-panel absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 translate-x-[calc(-50%-min(var(--btn-offset-mobile),calc(50vw_-_22px)))] items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-10 sm:w-10 md:translate-x-[calc(-50%-min(var(--btn-offset-desktop),calc(50vw_-_24px)))]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label="Suivant"
          className="glass-panel absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 translate-x-[calc(-50%+min(var(--btn-offset-mobile),calc(50vw_-_22px)))] items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-10 sm:w-10 md:translate-x-[calc(-50%+min(var(--btn-offset-desktop),calc(50vw_-_24px)))]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {(((index % count) + count) % count) + 1} / {count}
      </p>
    </section>
  );
}
