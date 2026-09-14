import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContributionHeatmap } from "../components/ContributionHeatmap";
import { ExperienceSection } from "../components/ExperienceSection";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { initialPortfolioData } from "../data/portfolioData";
import { fetchPortfolio, type Portfolio } from "../lib/api";
import { scrollToId } from "../lib/scrollToId";

export function HomePage() {
  const [data, setData] = useState<Portfolio>(initialPortfolioData);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    void fetchPortfolio().then(setData);
  }, []);

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    scrollToId(id);
  }, [location.hash, data]);

  const p = data.profile;

  return (
    <div className="min-h-screen">
      <SiteHeader name={p?.name || "Pyae Phyo Maung"} />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <section className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
          {p?.avatarUrl ? (
            <div className="relative shrink-0">
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[var(--rule)] object-cover shadow-sm ring-1 ring-black/5"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border border-[var(--rule)] bg-[var(--soft)] text-3xl font-semibold text-[var(--muted)]">
              {(p?.name || "P").slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-[family-name:var(--display)] text-4xl tracking-tight sm:text-5xl">
              {p?.name || "Pyae Phyo Maung"}
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              @{p?.handle || "pyaephyomaung"}
              {p?.headline ? ` · ${p.headline}` : ""}
            </p>
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[var(--muted)]">
              {p?.location ? <span>{p.location}</span> : null}
              {p?.githubUrl ? (
                <a
                  href={p.githubUrl}
                  className="underline-offset-2 hover:underline hover:text-[var(--ink)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
              {p?.emailPublic ? (
                <a
                  href={`mailto:${p.emailPublic}`}
                  title={p.emailPublic}
                  className="underline-offset-2 hover:underline hover:text-[var(--ink)]"
                >
                  {p.emailPublic}
                </a>
              ) : null}
            </div>
            {p?.bio ? <p className="mt-4 max-w-xl text-[15px] leading-relaxed">{p.bio}</p> : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
              >
                <span>Get in touch</span>
                <span aria-hidden>↓</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToId("projects")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)] cursor-pointer"
              >
                <span>View work</span>
              </button>
            </div>
          </div>
        </section>

        {data.stats?.length ? (
          <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {data.stats.map((s) => (
              <div key={s.id}>
                <p className="text-xs font-medium text-[var(--muted)]">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
              </div>
            ))}
          </section>
        ) : null}

        <ContributionHeatmap />

        {data.projects?.length ? (
          <section id="projects" className="mt-16 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Projects
            </p>
            <h2 className="mt-1 font-[family-name:var(--display)] text-3xl tracking-tight">
              Selected work
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.projects.map((proj, i) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.slug}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-white p-4 transition hover:border-[color-mix(in_oklab,var(--ink)_25%,var(--rule))]"
                >
                  <div>
                    <span className="absolute right-3 top-3 text-xs text-[var(--muted)]">{i + 1}</span>
                    <h3 className="pr-6 font-semibold tracking-tight group-hover:underline">
                      {proj.title}
                    </h3>
                    {proj.period ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">{proj.period}</p>
                    ) : null}
                    {proj.summary ? (
                      <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{proj.summary}</p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule)] pt-3">
                    {proj.language ? (
                      <p className="text-xs text-[var(--muted)]">
                        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--ink)]" />
                        {proj.language}
                      </p>
                    ) : (
                      <span />
                    )}
                    <div>
                      {proj.url ? (
                        <span className="text-xs font-medium text-[var(--ink)]">Live ↗</span>
                      ) : proj.repoUrl ? (
                        <span className="text-xs font-medium text-[var(--muted)] group-hover:text-[var(--ink)]">Source ↗</span>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">Overview →</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <ExperienceSection companies={data.experience ?? []} />

        {data.education?.length ? (
          <section id="education" className="mt-16 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Education
            </p>
            <ul className="mt-4 space-y-4">
              {data.education.map((e) => (
                <li key={e.id} className="border-b border-[var(--rule)] pb-4 last:border-0">
                  <h3 className="font-semibold">{e.school}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {[e.degree, e.field].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.honors?.length ? (
          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Honors & awards
            </p>
            <ul className="mt-4 space-y-4">
              {data.honors.map((h) => (
                <li key={h.id}>
                  <h3 className="font-semibold">{h.title}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {[h.issuer, h.date].filter(Boolean).join(" · ")}
                  </p>
                  {h.description ? <p className="mt-1 text-sm">{h.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.licenses?.length ? (
          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Licenses & certifications
            </p>
            <ul className="mt-4 space-y-4">
              {data.licenses.map((l) => (
                <li key={l.id}>
                  <h3 className="font-semibold">{l.name}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {[l.issuer, l.issueDate].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section id="contact" className="mt-16 scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Contact
          </p>
          <h2 className="mt-1 font-[family-name:var(--display)] text-3xl tracking-tight">
            Let's build together
          </h2>

          <div className="mt-6 rounded-xl border border-[var(--rule)] bg-white p-6 sm:p-8">
            <p className="text-base text-[var(--ink)]">
              I'm open to full-stack engineering opportunities, web platform development, and technical collaboration.
            </p>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              Based in Thailand · Available for remote work across global teams.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {p?.emailPublic ? (
                <>
                  <a
                    href={`mailto:${p.emailPublic}`}
                    className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer"
                  >
                    <span>Send email</span>
                    <span aria-hidden>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (p?.emailPublic) {
                        navigator.clipboard.writeText(p.emailPublic);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--rule)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)] cursor-pointer"
                  >
                    <span>{copied ? "Copied to clipboard! ✓" : "Copy email address"}</span>
                  </button>
                </>
              ) : null}
              {p?.githubUrl ? (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--rule)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  <span>GitHub</span>
                  <span aria-hidden>↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter name={p?.name || "Pyae Phyo Maung"} />
    </div>
  );
}
