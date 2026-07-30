import { Link } from "@tanstack/react-router";

export function ConventionBanner() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 220px 180px at 50% 24%, rgba(253,186,116,0.55), transparent 60%), radial-gradient(ellipse 480px 420px at 50% 24%, rgba(234,88,12,0.35), transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 200px 170px at 14% 46%, rgba(253,186,116,0.55), transparent 60%), radial-gradient(ellipse 560px 460px at 14% 46%, rgba(234,88,12,0.32), transparent 72%)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 pb-10 pt-6 text-center sm:gap-8 md:flex-row md:items-center md:gap-10 md:px-8 md:pb-12 md:pt-8 md:text-left">
        <div className="relative h-52 w-auto shrink-0 sm:h-64 md:ml-2 md:h-72">
          <div className="absolute -bottom-1 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-black/70 blur-lg sm:h-6 sm:w-24" />
          <img
            src="/telephone-cutout.png"
            alt=""
            className="relative h-full w-auto object-contain"
          />
        </div>

        <div className="flex-1 md:ml-4">
          <h2 className="display text-2xl tracking-[calc(0.025em+1px)] sm:text-3xl">
            Référence de la convention
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-400 md:mx-0">
            Convention N°23-027/HAAC/CLC/CMSPr/SG/SGA/DAJDC/DM/ SAJ/SCML/SCS du 13 décembre 2023
          </p>
        </div>

        <Link
          to="/infos-officielles"
          className="shrink-0 rounded-lg border-2 border-live bg-live px-6 py-3 text-sm font-bold uppercase tracking-[calc(0.025em+1px)] text-white transition-colors hover:bg-live/90"
        >
          Informations administratives
        </Link>
      </div>
    </section>
  );
}
