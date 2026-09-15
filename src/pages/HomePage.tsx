import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContributionHeatmap } from "../components/ContributionHeatmap";
import { ExperienceSection } from "../components/ExperienceSection";
import { GitHubStarBadge } from "../components/GitHubStarButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { TechIcon } from "../components/TechIcon";
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
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-rule object-cover shadow-xs ring-1 ring-black/5"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border border-rule bg-soft text-3xl font-semibold text-muted">
              {(p?.name || "P").slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              {p?.name || "Pyae Phyo Maung"}
            </h1>
            <p className="mt-1 text-muted">
              @{p?.handle || "pyaephyomaung"}
              {p?.headline ? ` · ${p.headline}` : ""}
            </p>
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
              {p?.location ? <span>{p.location}</span> : null}
              {p?.githubUrl ? (
                <a
                  href={p.githubUrl}
                  className="underline-offset-2 hover:underline hover:text-ink"
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
                  className="underline-offset-2 hover:underline hover:text-ink"
                >
                  {p.emailPublic}
                </a>
              ) : null}
            </div>
            {p?.bio ? <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-ink/90">{p.bio}</p> : null}

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
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
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
                <p className="text-xs font-medium text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
              </div>
            ))}
          </section>
        ) : null}

        <ContributionHeatmap />

        {data.projects?.length ? (
          <section id="projects" className="mt-16 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Projects
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Selected work
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.projects.map((proj, i) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.slug}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-rule bg-white p-4 transition hover:border-ink/30"
                >
                  <div>
                    <span className="absolute right-3 top-3 text-xs text-muted">{i + 1}</span>
                    <h3 className="pr-6 font-semibold tracking-tight group-hover:underline">
                      {proj.title}
                    </h3>
                    {proj.period ? (
                      <p className="mt-1 text-xs text-muted">{proj.period}</p>
                    ) : null}
                    {proj.summary ? (
                      <p className="mt-2 text-sm text-muted leading-relaxed">{proj.summary}</p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
                    <div className="flex items-center gap-2.5">
                      {proj.language ? (
                        <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <TechIcon name={proj.language} className="h-3 w-3 shrink-0 text-muted" />
                          <span>{proj.language}</span>
                        </p>
                      ) : null}
                      {proj.isOpenSource && proj.repoUrl ? (
                        <GitHubStarBadge repoUrl={proj.repoUrl} />
                      ) : null}
                    </div>
                    <div>
                      {proj.url ? (
                        <span className="text-xs font-medium text-ink">Live ↗</span>
                      ) : proj.repoUrl ? (
                        <span className="text-xs font-medium text-muted group-hover:text-ink">Source ↗</span>
                      ) : (
                        <span className="text-xs text-muted">Overview →</span>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Education
            </p>
            <ul className="mt-4 space-y-4">
              {data.education.map((e) => (
                <li key={e.id} className="border-b border-rule pb-4 last:border-0">
                  <h3 className="font-semibold">{e.school}</h3>
                  <p className="text-sm text-muted">
                    {[e.degree, e.field].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-sm text-muted">
                    {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.honors?.length ? (
          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Honors & awards
            </p>
            <ul className="mt-4 space-y-4">
              {data.honors.map((h) => (
                <li key={h.id}>
                  <h3 className="font-semibold">{h.title}</h3>
                  <p className="text-sm text-muted">
                    {[h.issuer, h.date].filter(Boolean).join(" · ")}
                  </p>
                  {h.description ? <p className="mt-1 text-sm text-ink/90">{h.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.licenses?.length ? (
          <section className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Licenses & certifications
            </p>
            <ul className="mt-4 space-y-4">
              {data.licenses.map((l) => (
                <li key={l.id}>
                  <h3 className="font-semibold">{l.name}</h3>
                  <p className="text-sm text-muted">
                    {[l.issuer, l.issueDate].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section id="contact" className="mt-16 scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Contact
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">
            Let's build together
          </h2>

          <div className="mt-6 rounded-xl border border-rule bg-white p-6 sm:p-8">
            <p className="text-base text-ink">
              I'm open to full-stack engineering opportunities, web platform development, and technical collaboration.
            </p>
            <p className="mt-1.5 text-sm text-muted">
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
                    className="inline-flex items-center gap-2 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm font-medium text-muted transition hover:border-ink hover:text-ink"
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
