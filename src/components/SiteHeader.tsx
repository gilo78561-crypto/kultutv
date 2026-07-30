import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { navLinks } from "@/utils/nav";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`relative transition-all duration-300 ${
          scrolled ? "glass-panel shadow-soft" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-8">
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <img src="/logo-icon.png" alt="" className="h-8 w-auto shrink-0" />
            <span className="display truncate text-lg leading-none tracking-[calc(0.1em+1px)] sm:text-2xl">
              KULTU TV
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden w-64 xl:block">
              <SearchBar />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              aria-label="Ouvrir la recherche"
              className="glass-panel flex h-9 w-9 shrink-0 items-center justify-center rounded-full xl:hidden"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setSearchOpen(false);
              }}
              aria-label="Ouvrir le menu"
              className="glass-panel flex h-9 w-9 shrink-0 items-center justify-center rounded-full lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel absolute inset-x-0 top-full overflow-hidden border-t border-border/60 shadow-soft xl:hidden"
            >
              <div className="px-3 py-3 sm:px-4">
                <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md lg:hidden"
          >
            <div className="flex h-16 items-center justify-end px-4">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <MobileNav onNavigate={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
