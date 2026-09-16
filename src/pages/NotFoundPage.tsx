import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { initialPortfolioData } from "../data/portfolioData";

export function NotFoundPage() {
  const p = initialPortfolioData.profile;

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <SiteHeader name={p?.name} profile={p} />

      <main id="main-content" className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="relative rounded-2xl border border-rule bg-white p-8 sm:p-12 shadow-xs">
          {/* Drafting crosshairs */}
          <span className="pointer-events-none absolute left-3 top-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs text-muted/40">+</span>

          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            // 404 ERROR
          </span>

          <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight text-ink font-normal">
            Page Not Found
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
            The page or project you requested could not be located. It might have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
            >
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
            >
              <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter name={p?.name} websiteUrl={p?.websiteUrl} />
    </div>
  );
}
