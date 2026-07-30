import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | KULTU TV" },
      {
        name: "description",
        content:
          "Éditeur, hébergement, propriété intellectuelle et données personnelles de KULTU TV.",
      },
      { property: "og:title", content: "Mentions légales KULTU TV" },
      { property: "og:description", content: "Informations légales du site KULTU TV." },
    ],
  }),
  component: LegalPage,
});

const sections = [
  ["Éditeur", "KULTU TV SAS, Studios KULTU, Paris. Directrice de la publication : Awa Diarra."],
  ["Hébergement", "Le site est hébergé sur une infrastructure cloud européenne."],
  [
    "Propriété intellectuelle",
    "L'ensemble des contenus (vidéos, sons, textes, images) est protégé. Toute reproduction sans autorisation est interdite.",
  ],
  [
    "Données personnelles",
    "Les données transmises via les formulaires sont utilisées uniquement pour répondre aux demandes et gérer la newsletter.",
  ],
  ["Cookies", "Des cookies de mesure d'audience anonymisée peuvent être déposés."],
];

function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-8">
      <Reveal>
        <h1 className="text-5xl tracking-[calc(0.025em+1px)] md:text-6xl">Mentions légales</h1>
      </Reveal>
      <div className="mt-10 space-y-8">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="display text-2xl tracking-[calc(0.025em+1px)]">{title}</h2>
            <p className="mt-2 text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
