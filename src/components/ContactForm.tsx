import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Votre nom est requis"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(3, "Objet trop court"),
  message: z.string().min(20, "Message trop court (20 caractères minimum)"),
});

type Values = z.infer<typeof schema>;

const field =
  "glass-panel w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

const subjectOptions = [
  "Demande d'information",
  "Demande de partenariat",
  "Proposition de collaboration",
  "Demande de couverture médiatique",
  "Invitation à un événement",
  "Proposition d'interview",
  "Demande d'interview",
  "Proposition d'émission",
  "Demande de diffusion d'un contenu",
  "Demande de publicité",
  "Demande de sponsoring",
  "Demande de devis publicitaire",
  "Candidature à un emploi",
  "Demande de stage",
  "Proposition de bénévolat",
  "Proposition de chronique",
  "Proposition de reportage",
  "Envoi d'un communiqué de presse",
  "Demande de droit de diffusion",
  "Demande d'accréditation",
  "Réclamation",
  "Signalement d'un problème technique",
  "Suggestion d'amélioration",
  "Demande d'assistance",
  "Demande de rendez-vous",
  "Demande d'entretien",
  "Proposition de contenu audiovisuel",
  "Demande de retransmission en direct",
  "Demande de publication d'une annonce",
  "Félicitations ou remerciements",
  "Demande de rectification d'une information",
  "Demande d'abonnement ou d'adhésion",
  "Demande de renseignements commerciaux",
  "Proposition de sponsoring d'une émission",
  "Demande de participation à une émission",
  "Proposition de projet audiovisuel",
  "Demande de collaboration avec un influenceur ou un média partenaire",
  "Demande de témoignage",
  "Demande de promotion d'un produit, d'un service ou d'un événement",
  "Autre demande générale",
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message envoyé", { description: "La rédaction vous répond sous 48 h." });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input {...register("name")} placeholder="Nom complet" className={field} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register("email")} placeholder="Email" className={field} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <select {...register("subject")} defaultValue="" className={field}>
          <option value="" disabled>
            Objet
          </option>
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <textarea {...register("message")} rows={6} placeholder="Votre message" className={field} />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="gradient-ember rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {isSubmitting ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
