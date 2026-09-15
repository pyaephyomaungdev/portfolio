import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GitHubStarButton } from "../components/GitHubStarButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { TechIcon } from "../components/TechIcon";
import { fetchPortfolio, fetchProject, type Project } from "../lib/api";
import { scrollToId } from "../lib/scrollToId";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [siteName, setSiteName] = useState<string | null>("Pyae Phyo Maung");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setError(null);
    setProject(null);

    void fetchProject(slug)
      .then((p) => {
        if (!cancelled) setProject(p);
      })
      .catch(() => {
        if (!cancelled) setError("Project not found");
      });

    void fetchPortfolio()
      .then((d) => {
        if (!cancelled) {
          setSiteName(d.profile?.name ?? null);
          setAllProjects(d.projects ?? []);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex >= 0 && allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  const paragraphs = (project?.body || project?.summary || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const cs = project?.caseStudy;

  return (
    <div className="min-h-screen">
      <SiteHeader name={siteName || "Pyae Phyo Maung"} />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <button
          type="button"
          className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline cursor-pointer"
          onClick={() => {
            navigate({ pathname: "/", hash: "projects" });
            queueMicrotask(() => scrollToId("projects"));
          }}
        >
          ← Back to Selected Work
        </button>

        {error ? (
          <p className="mt-8 text-sm text-destructive">{error}</p>
        ) : !project ? (
          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-4 w-16 rounded bg-soft" />
            <div className="h-10 w-2/3 rounded-lg bg-soft" />
            <div className="h-4 w-32 rounded bg-soft" />
            <div className="mt-6 flex gap-3">
              <div className="h-9 w-24 rounded-lg bg-soft" />
              <div className="h-9 w-24 rounded-lg bg-soft" />
            </div>
            <div className="mt-8 space-y-2.5">
              <div className="h-4 w-full rounded bg-soft" />
              <div className="h-4 w-5/6 rounded bg-soft" />
              <div className="h-4 w-4/6 rounded bg-soft" />
            </div>
          </div>
        ) : (
          <article className="mt-8">
            {/* Header / Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-soft px-3 py-1 text-xs font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {project.badge ?? "Case Study"}
              </span>
              {project.period ? (
                <span className="text-xs text-muted">{project.period}</span>
              ) : null}
            </div>

            <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              {project.title}
            </h1>

            {cs?.headline ? (
              <p className="mt-3 text-lg font-medium text-ink leading-snug">
                {cs.headline}
              </p>
            ) : project.summary ? (
              <p className="mt-2 text-base text-muted">{project.summary}</p>
            ) : null}

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
                >
                  <span>View live</span>
                  <span aria-hidden>↗</span>
                </a>
              ) : null}
              {project.repoUrl ? (
                <>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
                  >
                    <span>Source code</span>
                    <span aria-hidden>↗</span>
                  </a>
                  {project.isOpenSource ? (
                    <GitHubStarButton repoUrl={project.repoUrl} />
                  ) : null}
                </>
              ) : null}
              {!project.url && !project.repoUrl ? (
                <span className="inline-flex items-center rounded-md border border-rule bg-soft px-3 py-1.5 text-xs font-medium text-muted">
                  Internal Platform
                </span>
              ) : null}
            </div>

            {/* Metrics & Proof Callout Strip */}
            {cs?.metrics?.length ? (
              <section className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Key Metrics & Engineering Proof
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {cs.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-rule bg-white p-3.5"
                    >
                      <p className="font-display text-2xl tracking-tight text-ink">
                        {m.value}
                      </p>
                      <p className="text-xs font-semibold text-ink">{m.label}</p>
                      <p className="mt-0.5 text-xs text-muted leading-tight">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Case Study Core Narrative Sections */}
            {cs ? (
              <div className="mt-12 space-y-8 border-t border-rule pt-8">
                {/* 1. Problem */}
                <section>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Problem & Context
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight text-ink">
                    The Problem & Status Quo
                  </h2>
                  <p className="mt-3 text-base text-muted leading-relaxed">
                    {cs.problem}
                  </p>
                </section>

                {/* 2. Technical Constraints */}
                <section className="border-t border-rule pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Engineering Challenges
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight text-ink">
                    Technical Constraints
                  </h2>
                  <p className="mt-3 text-base text-muted leading-relaxed">
                    {cs.constraints}
                  </p>
                </section>

                {/* 3. Core Decisions & Architecture */}
                <section className="border-t border-rule pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    System Architecture
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight text-ink">
                    Core Decisions & Implementation
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {cs.decisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-base text-ink">
                        <span className="mt-1.5 text-xs text-ink">◆</span>
                        <span className="leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>

                  {cs.architectureHighlights?.length ? (
                    <div className="mt-6 rounded-xl border border-rule bg-soft/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Architecture Highlights
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {cs.architectureHighlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-ink"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>

                {/* 4. Verifiable Outcome */}
                <section className="border-t border-rule pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Results & Proof
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight text-ink">
                    Outcome & Measurable Impact
                  </h2>
                  <div className="mt-3 rounded-xl border border-rule bg-white p-5">
                    <p className="text-base font-medium text-ink leading-relaxed">
                      {cs.outcome}
                    </p>
                  </div>
                </section>
              </div>
            ) : null}

            {/* Tech Stack */}
            {project.techStack?.length ? (
              <section className="mt-12">
                <h2 className="text-sm font-semibold tracking-tight">Tech Stack</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <li
                      key={t}
                      className="group inline-flex items-center gap-1.5 rounded-md border border-rule bg-white px-2.5 py-1.5 text-xs font-medium text-ink transition hover:border-ink/40"
                    >
                      <TechIcon name={t} className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:text-ink" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Additional Detailed Narrative / Breakdown */}
            {paragraphs.length && !cs ? (
              <section className="mt-10 space-y-4 text-base leading-relaxed text-ink">
                {paragraphs.map((para, i) => (
                  <p key={i} className="whitespace-pre-line text-muted first:text-ink">
                    {para}
                  </p>
                ))}
              </section>
            ) : null}

            {/* Next Case Study Navigation */}
            {nextProject ? (
              <div className="mt-16 border-t border-rule pt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Next Case Study
                </p>
                <Link
                  to={`/projects/${nextProject.slug}`}
                  className="group mt-2 block rounded-xl border border-rule bg-white p-5 transition hover:border-ink/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted">
                        {nextProject.badge ?? "Case Study"}
                      </span>
                      <h3 className="font-display text-2xl tracking-tight text-ink group-hover:underline">
                        {nextProject.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {nextProject.caseStudy?.headline ?? nextProject.summary}
                      </p>
                    </div>
                    <span className="text-xl text-muted group-hover:text-ink">
                      →
                    </span>
                  </div>
                </Link>
              </div>
            ) : null}
          </article>
        )}
      </main>

      <SiteFooter name={siteName || "Pyae Phyo Maung"} />
    </div>
  );
}
