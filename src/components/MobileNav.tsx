import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { navLinks, footerLinks } from "@/utils/nav";

export function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-6 pb-16 pt-4">
      {navLinks.map((link, i) => (
        <motion.div
          key={link.to}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i, duration: 0.35 }}
        >
          <Link
            to={link.to}
            onClick={onNavigate}
            activeOptions={{ exact: link.to === "/" }}
            activeProps={{ className: "text-primary" }}
            className="display block border-b border-border py-4 text-3xl tracking-[calc(0.025em+1px)]"
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={onNavigate} className="hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
