import { useEffect, useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, Heart, Printer } from "lucide-react";
import { scrollToId } from "../lib/scrollToId";
import { initialPortfolioData } from "../data/portfolioData";
import { ThemeToggle } from "./ThemeToggle";
import type { Profile } from "../types/portfolio";

const NAV = [
  {
    id: "projects",
    label: "Projects",
    sub: "Selected work & case studies",
  },
  {
    id: "experience",
    label: "Experience",
    sub: "Career roles & timeline",
  },
  {
    id: "education",
    label: "Education",
    sub: "Degrees & certifications",
  },
  {
    id: "contact",
    label: "Contact",
    sub: "Let's build together",
  },
] as const;

interface SiteHeaderProps {
  name?: string | null;
  profile?: Profile | null;
  onOpenContact?: () => void;
}

export function SiteHeader({ name, profile, onOpenContact }: SiteHeaderProps) {
  const p = profile ?? initialPortfolioData.profile;
  const displayName = name || p?.name || "Portfolio";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goSection(id: string) {
    if (id === "contact" && onOpenContact) {
      setOpen(false);
      onOpenContact();
      return;
    }
    setOpen(false);
    const hash = `#${id}`;
    if (location.pathname === "/") {
      if (location.hash !== hash) {
        navigate({ pathname: "/", hash: id });
      }
      scrollToId(id);
      return;
    }
    navigate({ pathname: "/", hash: id });
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-md focus:border focus:border-rule focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-paper focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b border-rule backdrop-blur-md transition-colors ${
          open ? "bg-paper" : "bg-paper/90"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link
            to="/"
            className="font-semibold tracking-tight"
            onClick={() => setOpen(false)}
          >
            {displayName}
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-muted sm:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className="hover:text-ink cursor-pointer"
                onClick={() => goSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div className="h-4 w-px bg-rule" aria-hidden="true" />
            <button
              type="button"
              onClick={() => window.print()}
              title="Print or Save Resume as PDF"
              className="inline-flex items-center gap-1.5 hover:text-ink cursor-pointer transition-colors"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Resume</span>
            </button>
            <div className="h-4 w-px bg-rule" aria-hidden="true" />
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink cursor-pointer"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3.5 w-5" aria-hidden>
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Page Apple-Style Mobile Menu Overlay */}
      <div
        id={menuId}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-paper px-6 pb-8 pt-20 transition-all duration-500 ease-out sm:hidden ${open
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-4"
          }`}
      >
        {/* Navigation items with Apple-style staggered slide-in */}
        <nav className="mt-4 flex flex-col divide-y divide-rule">
          {NAV.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`group flex items-start justify-between py-5 text-left transition-all duration-500 cursor-pointer ${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
              style={{
                transitionDelay: `${open ? 100 + idx * 70 : 0}ms`,
              }}
              onClick={() => goSection(item.id)}
            >
              <div>
                <span className="font-display text-3xl tracking-tight text-ink transition-colors group-hover:text-accent">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {item.sub}
                </span>
              </div>
              <ArrowRight className="h-6 w-6 text-muted/50 transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
            </button>
          ))}
        </nav>

        {/* Bottom Tray */}
        <div
          className={`border-t border-rule pt-6 transition-all duration-500 delay-300 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          {/* Theme switch row */}
          <div className="flex items-center justify-between pb-4 border-b border-rule">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">Theme</span>
            <ThemeToggle showLabel />
          </div>

          {/* Print / Save CV row for mobile */}
          <div className="flex items-center justify-between py-3 border-b border-rule">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">Executive CV</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(() => window.print(), 350);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3 py-1.5 text-xs font-mono text-ink shadow-2xs hover:border-ink/40 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Direct contact and quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {p?.emailPublic ? (
              <a
                href={`mailto:${p.emailPublic}`}
                className="text-xs font-semibold text-ink underline-offset-2 hover:underline"
              >
                {p.emailPublic}
              </a>
            ) : null}

            <div className="flex items-center gap-4 text-xs font-medium text-muted">
              {p?.githubUrl ? (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
              ) : null}
              {p?.websiteUrl ? (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition"
                >
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface SiteFooterProps {
  name?: string | null;
  websiteUrl?: string | null;
}

export function SiteFooter({ name }: SiteFooterProps) {
  const p = initialPortfolioData.profile;
  const displayName = name || p?.name || "Portfolio";

  return (
    <footer className="border-t border-rule py-8 text-center text-sm text-muted">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-xs">
        <span>© {new Date().getFullYear()} {displayName}</span>
        <span className="hidden sm:inline text-muted/40">•</span>
        <div className="inline-flex items-center gap-2">
          <Link to="/privacy" className="hover:text-ink transition underline underline-offset-4">
            Privacy
          </Link>
          <span className="text-muted/40">•</span>
          <Link to="/terms" className="hover:text-ink transition underline underline-offset-4">
            Terms
          </Link>
          <span className="text-muted/40">•</span>
          <Link to="/cookies" className="hover:text-ink transition underline underline-offset-4">
            Cookies
          </Link>
        </div>
        <span className="hidden sm:inline text-muted/40">•</span>
        <span className="inline-flex items-center gap-1.5">
          Developed with <Heart className="h-3.5 w-3.5 fill-accent text-accent inline" aria-label="love" /> by{" "}
          <a
            href="https://pyaephyomaung.dev"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline underline-offset-4 hover:text-accent transition font-medium"
          >
            Pyae Phyo Maung
          </a>
        </span>
      </div>
    </footer>
  );
}
