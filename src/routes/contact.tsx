import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Écrire à la rédaction | KULTU TV" },
      {
        name: "description",
        content: "Contactez la rédaction KULTU TV : questions, propositions de sujets et médias.",
      },
      { property: "og:title", content: "Contacter KULTU TV" },
      { property: "og:description", content: "Écrivez à la rédaction KULTU TV." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_340px] md:px-8">
      <div>
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Contact</p>
          <h1 className="mt-2 text-5xl tracking-[calc(0.025em+1px)] md:text-6xl">On vous écoute</h1>
        </Reveal>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
      <aside className="glass-panel h-fit space-y-4 rounded-2xl p-6 text-sm">
        <p className="flex items-center gap-3">
          <UserRound className="h-4 w-4 text-primary" /> Abdel HAKIM A. LALEYE
        </p>
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-primary" /> lahakimfn1@gmail.com
        </p>
        <p className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-primary" /> +229 0196386907
        </p>
        <p className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-primary" /> 01 BP : 5521 Cotonou, Benin
        </p>
      </aside>
    </div>
  );
}
