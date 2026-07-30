import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "./NewsletterForm";
import { footerLinks, navLinks } from "@/utils/nav";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="" className="h-8 w-auto" />
            <span className="display text-2xl tracking-[calc(0.1em+1px)]">KULTU TV</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            La plateforme média premium : TV en direct, radio continue, Kultu Webzine, podcasts et
            flash infos. Une culture, tous les écrans.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="display text-lg tracking-[calc(0.025em+1px)]">Navigation</p>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <p className="display text-lg tracking-[calc(0.025em+1px)]">Informations</p>
            {footerLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="display text-lg tracking-[calc(0.025em+1px)]">Newsletter</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Le meilleur de la culture chaque vendredi.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} KULTU TV — Tous droits réservés.
      </div>
    </footer>
  );
}
