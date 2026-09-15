import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContributionHeatmap } from "../components/ContributionHeatmap";
import { ExperienceSection } from "../components/ExperienceSection";
import { GitHubStarBadge } from "../components/GitHubStarButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { TechIcon } from "../components/TechIcon";
import { ExpandableText } from "../components/ExpandableText";
import { initialPortfolioData } from "../data/portfolioData";
import { ArrowDown, ArrowRight, Check, ExternalLink } from "lucide-react";
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
    if (data.profile?.name) {
      document.title = `${data.profile.name} — ${data.profile.headline || "Software Engineer & Full-Stack Developer"}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.profile.bio) {
        metaDesc.setAttribute("content", data.profile.bio);
      }
    }
  }, [data.profile]);

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
                width={112}
                height={112}
                loading="eager"
                decoding="async"
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
            {p?.bio ? (
              <ExpandableText
                text={p.bio}
                bg="paper"
                className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-ink/90"
              />
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
              >
                <span>Get in touch</span>
                <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
                      <ExpandableText
                        text={proj.summary}
                        className="mt-2 text-sm text-muted leading-relaxed"
                        threshold={110}
                      />
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
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-ink">
                          <span>Live</span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </span>
                      ) : proj.repoUrl ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted group-hover:text-ink">
                          <span>Source</span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <span>Overview</span>
                          <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </span>
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
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Education
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Academic background
            </h2>
            <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
              {data.education.map((e) => (
                <div key={e.id} className="p-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink">{e.school}</h3>
                      {e.url ? (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted hover:text-ink transition"
                          aria-label={`Visit ${e.school}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {[e.degree, e.field].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted shrink-0">
                    {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.honors?.length ? (
          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Recognition
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Honors & awards
            </h2>
            <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
              {data.honors.map((h) => (
                <div key={h.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink">{h.title}</h3>
                        {h.url ? (
                          <a
                            href={h.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted hover:text-ink transition"
                            aria-label={`View honor details for ${h.title}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                      {h.issuer ? <p className="mt-0.5 text-xs text-muted">{h.issuer}</p> : null}
                    </div>
                    {h.date ? (
                      <p className="font-mono text-xs text-muted shrink-0">{h.date}</p>
                    ) : null}
                  </div>
                  {h.description ? <ExpandableText text={h.description} className="mt-2.5" /> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.licenses?.length ? (
          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Credentials
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Licenses & certifications
            </h2>
            <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
              {data.licenses.map((l) => (
                <div key={l.id} className="p-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink">{l.name}</h3>
                      {l.url ? (
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted hover:text-ink transition"
                          aria-label={`Verify certification: ${l.name}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    {l.issuer ? <p className="mt-0.5 text-sm text-muted">{l.issuer}</p> : null}
                  </div>
                  {l.issueDate ? (
                    <p className="font-mono text-xs text-muted shrink-0">{l.issueDate}</p>
                  ) : null}
                </div>
              ))}
            </div>
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
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>Copied to clipboard!</span>
                      </>
                    ) : (
                      <span>Copy email address</span>
                    )}
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
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
