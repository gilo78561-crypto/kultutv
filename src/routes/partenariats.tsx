import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Megaphone, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/partenariats")({
  head: () => ({
    meta: [
      { title: "Partenariats & annonceurs | KULTU TV" },
      {
        name: "description",
        content:
          "Devenez partenaire de KULTU TV : sponsoring d'émissions, campagnes display, contenus de marque et événements.",
      },
      { property: "og:title", content: "Partenariats KULTU TV" },
      { property: "og:description", content: "Sponsoring, brand content et événements." },
    ],
  }),
  component: PartenariatsPage,
});

const offers = [
  {
    icon: Megaphone,
    title: "Sponsoring d'antenne",
    text: "Associez votre marque à nos émissions phares, en TV comme en radio.",
  },
  {
    icon: Sparkles,
    title: "Brand content",
    text: "Formats sur-mesure produits par notre studio créatif interne.",
  },
  {
    icon: Handshake,
    title: "Événements",
    text: "Festivals, scènes ouvertes et captations live à votre image.",
  },
];

function PartenariatsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Partenariats</p>
        <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-7xl">
          Construisons ensemble
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Plus de 2 millions de vues mensuelles, une audience jeune et engagée sur toute la chaîne
          culturelle.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.07}>
            <div className="glass-panel card-hover h-full rounded-2xl p-6">
              <o.icon className="h-7 w-7 text-primary" />
              <h2 className="display mt-3 text-2xl tracking-[calc(0.025em+1px)]">{o.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{o.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <h2 className="display mt-16 text-3xl tracking-[calc(0.025em+1px)]">
        Parlons de votre projet
      </h2>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
