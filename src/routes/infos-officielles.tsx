import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/infos-officielles")({
  head: () => ({
    meta: [
      { title: "Infos officielles — La chaîne KULTU TV" },
      {
        name: "description",
        content: "Communiqués, gouvernance, chiffres clés et informations officielles de KULTU TV.",
      },
      { property: "og:title", content: "Infos officielles KULTU TV" },
      { property: "og:description", content: "Communiqués et informations officielles." },
    ],
  }),
  component: InfosPage,
});

const facts = [
  ["2018", "Création de la chaîne"],
  ["2,4 M", "Vues mensuelles"],
  ["6", "Émissions hebdomadaires"],
  ["24/7", "Radio en continu"],
];

function InfosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Institution</p>
        <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">
          Infos officielles
        </h1>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {facts.map(([value, label]) => (
          <div key={label} className="glass-panel rounded-2xl p-5 text-center">
            <p className="display text-3xl text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4 text-muted-foreground">
        <p>
          KULTU TV est un média indépendant dédié à la culture contemporaine. La chaîne diffuse en
          continu sur ses canaux numériques et produit ses contenus dans ses propres studios.
        </p>
        <p>
          Direction de la publication : Awa Diarra. Rédaction en chef : Nadia Sissoko. Toute demande
          presse peut être adressée à la rédaction via la page contact.
        </p>
        <p className="text-sm">
          Convention N°23-027/HAAC/CLC/CMSPr/SG/SGA/DAJDC/DM/ SAJ/SCML/SCS du 13 décembre 2023.
        </p>
      </div>
    </div>
  );
}
