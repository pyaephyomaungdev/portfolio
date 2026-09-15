import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { fetchPortfolio, fetchProject, type Project } from "../lib/api";
import { scrollToId } from "../lib/scrollToId";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
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
        if (!cancelled) setSiteName(d.profile?.name ?? null);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const paragraphs = (project?.body || project?.summary || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

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
          ← Projects
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Project
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            {project.period ? (
              <p className="mt-2 text-sm text-muted">{project.period}</p>
            ) : null}

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
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
                >
                  <span>Source code</span>
                  <span aria-hidden>↗</span>
                </a>
              ) : null}
              {!project.url && !project.repoUrl ? (
                <span className="inline-flex items-center rounded-md border border-rule bg-soft px-3 py-1.5 text-xs font-medium text-muted">
                  Internal Platform
                </span>
              ) : null}
            </div>

            {project.techStack?.length ? (
              <section className="mt-10">
                <h2 className="text-sm font-semibold tracking-tight">Tech stack</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-rule bg-white px-2.5 py-1 text-xs font-medium text-ink"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            ) : project.language ? (
              <p className="mt-8 text-sm text-muted">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-ink" />
                {project.language}
              </p>
            ) : null}

            <section className="mt-10 space-y-4 text-base leading-relaxed text-ink">
              {paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line text-muted first:text-ink">
                  {para}
                </p>
              ))}
            </section>
          </article>
        )}
      </main>

      <SiteFooter name={siteName || "Pyae Phyo Maung"} />
    </div>
  );
}
