import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Scale, Cookie, ArrowLeft, ExternalLink } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { initialPortfolioData } from "../data/portfolioData";

export type LegalType = "privacy" | "terms" | "cookies";

interface LegalPageProps {
  type: LegalType;
}

export function LegalPage({ type }: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<LegalType>(type);
  const p = initialPortfolioData.profile;

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-paper text-ink font-sans">
      <SiteHeader name={p?.name} profile={p} />

      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Navigation & Tab Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-rule pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-1 border-b border-rule text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`px-3 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "privacy"
                  ? "border-accent text-ink font-semibold -mb-px"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Privacy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={`px-3 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "terms"
                  ? "border-accent text-ink font-semibold -mb-px"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Terms</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cookies")}
              className={`px-3 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "cookies"
                  ? "border-accent text-ink font-semibold -mb-px"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <Cookie className="h-3.5 w-3.5" />
              <span>Cookies</span>
            </button>
          </div>
        </div>

        {/* Content Box with Drafting Crosshairs */}
        <div className="relative rounded-2xl border border-rule bg-white p-6 sm:p-10 shadow-xs">
          {/* Drafting crosshairs */}
          <span className="pointer-events-none absolute left-3 top-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs text-muted/40">+</span>
          <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs text-muted/40">+</span>

          {/* ========================================================================= */}
          {/* 1. PRIVACY POLICY */}
          {/* ========================================================================= */}
          {activeTab === "privacy" && (
            <article className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  // LEGAL & COMPLIANCE
                </span>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                  Privacy Policy
                </h1>
                <p className="mt-2 text-xs font-mono text-muted">
                  Last Updated: September 2026 • Scope: pyaephyomaung.dev
                </p>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                This website is a personal software engineering portfolio, project showcase, and systems architecture laboratory operated by <strong>Pyae Phyo Maung</strong>. Your privacy is respected unconditionally: <strong>zero tracking cookies, zero marketing profiling, and zero third-party analytics scripts</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-rule bg-soft/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-display font-bold text-ink text-sm">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>No Trackers</span>
                  </div>
                  <p className="text-xs text-muted font-mono">
                    Zero Google Analytics, Facebook Pixel, or telemetry scripts.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-rule bg-soft/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-display font-bold text-ink text-sm">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Serverless Forms</span>
                  </div>
                  <p className="text-xs text-muted font-mono">
                    Direct edge Telegram notification with zero database persistence.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-rule bg-soft/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-display font-bold text-ink text-sm">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Local State</span>
                  </div>
                  <p className="text-xs text-muted font-mono">
                    Only theme preferences stored in local storage.
                  </p>
                </div>
              </div>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">1. Information Collection & Usage</h2>
                <p className="text-sm text-muted leading-relaxed">
                  When you visit this portfolio, no personal information is harvested. The site is delivered globally via Cloudflare Pages edge network, which processes standard HTTP request headers strictly for edge routing and DDoS mitigation.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">2. Contact Modal & Direct Messaging</h2>
                <p className="text-sm text-muted leading-relaxed">
                  If you submit a project inquiry through the "Let's build together" contact modal:
                </p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1 pl-2">
                  <li>The sender name, email address, and project note you provide are relayed via a serverless edge webhook directly to Pyae Phyo Maung's private Telegram bot.</li>
                  <li>Your inquiry is not retained in any marketing database or mailing list.</li>
                  <li>Your contact information is used exclusively to respond to your engineering inquiry.</li>
                </ul>
              </section>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">3. Security Disclosures</h2>
                <p className="text-sm text-muted leading-relaxed">
                  For responsible security vulnerability disclosures, please review our published <a href="/.well-known/security.txt" className="text-ink underline underline-offset-4 hover:text-accent font-medium">security.txt</a> or email <a href="mailto:contact@pyaephyomaung.dev" className="text-ink underline underline-offset-4 hover:text-accent font-medium">contact@pyaephyomaung.dev</a>.
                </p>
              </section>
            </article>
          )}

          {/* ========================================================================= */}
          {/* 2. TERMS OF SERVICE */}
          {/* ========================================================================= */}
          {activeTab === "terms" && (
            <article className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  // LEGAL & COMPLIANCE
                </span>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                  Terms of Service
                </h1>
                <p className="mt-2 text-xs font-mono text-muted">
                  Last Updated: September 2026 • Scope: pyaephyomaung.dev
                </p>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                By accessing this website, you agree to these standard conditions of use regarding intellectual property and open-source code artifacts.
              </p>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">1. Content & Intellectual Property</h2>
                <p className="text-sm text-muted leading-relaxed">
                  The textual content, architecture diagrams, case study narratives, and visual design of this website are the intellectual property of Pyae Phyo Maung. Open-source software projects featured on this portfolio (such as JSON Link and DeskKit) are licensed independently under their respective repository licenses (typically the MIT License).
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">2. Code Snippets & Blueprints</h2>
                <p className="text-sm text-muted leading-relaxed">
                  Unless otherwise specified, architectural code snippets, formulas, and configuration patterns published on this site are provided free of charge for developer reference under the MIT License:
                </p>
                <div className="p-3.5 rounded-xl border border-rule bg-soft/30 font-mono text-xs text-muted leading-relaxed">
                  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation... to deal in the Software without restriction...
                </div>
              </section>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">3. Disclaimer of Warranties</h2>
                <p className="text-sm text-muted leading-relaxed">
                  All case studies, metrics, and documentation are provided "as is" for informational and professional demonstration purposes without warranty of any kind, express or implied.
                </p>
              </section>
            </article>
          )}

          {/* ========================================================================= */}
          {/* 3. COOKIE & STORAGE POLICY */}
          {/* ========================================================================= */}
          {activeTab === "cookies" && (
            <article className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  // LEGAL & COMPLIANCE
                </span>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                  Cookie & Storage Policy
                </h1>
                <p className="mt-2 text-xs font-mono text-muted">
                  Last Updated: September 2026 • Scope: pyaephyomaung.dev
                </p>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                This website <strong>does not use tracking cookies</strong> or marketing identifiers. We use only standard browser local storage strictly for essential user interface state.
              </p>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">1. Local Storage Keys</h2>
                <div className="overflow-x-auto rounded-xl border border-rule">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-soft/50 border-b border-rule text-ink font-semibold">
                      <tr>
                        <th className="p-3">Key</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rule text-muted">
                      <tr>
                        <td className="p-3 font-bold text-ink">ppm_theme</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3 font-sans">Saves light/dark mode preference across sessions.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-ink">portfolio_admin_draft</td>
                        <td className="p-3">localStorage</td>
                        <td className="p-3 font-sans">Temporary recovery cache in admin studio to protect unsaved edits.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-3 pt-4 border-t border-rule">
                <h2 className="font-display text-xl font-bold text-ink">2. Zero Third-Party Advertising</h2>
                <p className="text-sm text-muted leading-relaxed">
                  Per our published <a href="/ads.txt" className="text-ink underline underline-offset-4 hover:text-accent font-medium">ads.txt</a>, this domain does not authorize or embed any third-party ad networks or tracking scripts.
                </p>
              </section>
            </article>
          )}

          {/* Bottom Quick Links */}
          <div className="mt-8 pt-6 border-t border-rule flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
            <div className="flex items-center gap-3">
              <Link to="/privacy" onClick={() => setActiveTab("privacy")} className="hover:text-ink transition">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/terms" onClick={() => setActiveTab("terms")} className="hover:text-ink transition">
                Terms
              </Link>
              <span>•</span>
              <Link to="/cookies" onClick={() => setActiveTab("cookies")} className="hover:text-ink transition">
                Cookies
              </Link>
            </div>
            <a
              href="https://github.com/pyaephyomaungdev/portfolio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-ink transition"
            >
              <span>View Source on GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </main>

      <SiteFooter name={p?.name} websiteUrl={p?.websiteUrl} />
    </div>
  );
}
