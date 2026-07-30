import { createFileRoute } from "@tanstack/react-router";
import { RadioSection } from "@/components/RadioSection";
import { PodcastGrid } from "@/components/PodcastGrid";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "Radio en direct et podcasts | KULTU TV" },
      {
        name: "description",
        content:
          "Écoutez KULTU Radio en direct : un flux continu, une lecture persistante et tous les podcasts de la station.",
      },
      { property: "og:title", content: "KULTU Radio — Le direct" },
      { property: "og:description", content: "Un flux en continu et tous nos podcasts." },
    ],
  }),
  component: RadioPage,
});

function RadioPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-20 md:px-8">
        <div className="gradient-ember absolute -left-24 top-0 h-72 w-72 rounded-full opacity-25 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Radio</p>
            <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">
              Le son ne s'arrête jamais
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Lancez un flux : la lecture continue pendant que vous naviguez sur toute la
              plateforme, grâce au mini-player flottant.
            </p>
          </Reveal>
        </div>
      </section>
      <RadioSection />
      <PodcastGrid title="Nos podcasts" />
    </div>
  );
}
