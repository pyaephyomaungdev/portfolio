import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GitHubStarButton } from "../components/GitHubStarButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { TechIcon } from "../components/TechIcon";
import { ExpandableText } from "../components/ExpandableText";
import { BuyMeACoffeeButton, BuyMeACoffeeCard } from "../components/BuyMeACoffeeButton";
import { ArchitectureBlueprint } from "../components/ArchitectureBlueprint";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, Share2, Check } from "lucide-react";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { calculateReadingTime } from "../lib/readingTime";
import { fetchPortfolio, fetchProject, type Project, type Profile } from "../lib/api";
import { initialPortfolioData } from "../data/portfolioData";
import { scrollToId } from "../lib/scrollToId";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(() => initialPortfolioData.projects ?? []);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(() => initialPortfolioData.profile);
  const [siteName, setSiteName] = useState<string | null>(() => initialPortfolioData.profile?.name ?? null);
  const [buyMeACoffeeUrl, setBuyMeACoffeeUrl] = useState<string | null>(() => initialPortfolioData.profile?.buyMeACoffeeUrl ?? null);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(() => initialPortfolioData.profile?.websiteUrl ?? null);

  function handleShare() {
    void navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

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
        if (cancelled) return;
        setProfile(d.profile ?? null);
        setSiteName(d.profile?.name ?? null);
        setBuyMeACoffeeUrl(d.profile?.buyMeACoffeeUrl ?? null);
        setWebsiteUrl(d.profile?.websiteUrl ?? null);
        setAllProjects(d.projects ?? []);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Inject dynamic Schema.org JSON-LD for Technical Case Study
  useEffect(() => {
    if (!project) return;
    const scriptId = "project-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: project.title,
      description: project.summary || project.title,
      author: {
        "@type": "Person",
        name: profile?.name || "Pyae Phyo Maung",
        url: "https://pyaephyomaung.dev",
      },
      url: `https://pyaephyomaung.dev/projects/${project.slug}`,
      ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
      ...(project.techStack?.length ? { keywords: project.techStack.join(", ") } : {}),
    };
    script.textContent = JSON.stringify(schemaData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [project, profile]);

  useEffect(() => {
    if (!project) return;
    const prevTitle = document.title;
    document.title = `${project.title} — ${siteName || "Pyae Phyo Maung"}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    if (metaDesc && project.summary) {
      metaDesc.setAttribute("content", project.summary);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, [project, siteName]);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    currentIndex >= 0 && allProjects.length > 1
      ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
      : null;
  const nextProject =
    currentIndex >= 0 && allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  const paragraphs = (project?.body || project?.summary || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const cs = project?.caseStudy;

  const readingTime = calculateReadingTime(
    [
      project?.title,
      project?.summary,
      project?.body,
      cs?.headline,
      cs?.problem,
      cs?.constraints,
      cs?.outcome,
      ...(cs?.decisions ?? []),
      ...(cs?.architectureHighlights ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );

  return (
    <div className="min-h-screen">
      <ReadingProgressBar />
      <SiteHeader name={siteName} profile={profile} />

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-2 hover:text-ink hover:underline cursor-pointer"
          onClick={() => {
            navigate({ pathname: "/", hash: "projects" });
            queueMicrotask(() => scrollToId("projects"));
          }}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Back to Selected Work</span>
        </button>

        {error ? (
          <div className="mt-12 rounded-2xl border border-rule bg-white p-8 sm:p-12 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-accent block">
              // NOT FOUND
            </span>
            <h2 className="mt-2 font-display text-3xl text-ink font-normal">
              Project Not Found
            </h2>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              We could not find a case study with slug <code className="font-mono bg-soft px-1.5 py-0.5 rounded text-ink">{slug}</code>.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/#projects"
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
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
            {/* Header / Meta & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-soft px-3 py-1 text-xs font-medium text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {project.badge ?? "Case Study"}
                </span>
                {project.period ? (
                  <span className="font-mono text-xs text-muted">{project.period}</span>
                ) : null}
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                  <Clock className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
                  <span>{readingTime}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share case study link"
                className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-white px-2.5 py-1 font-mono text-xs text-muted hover:border-accent/50 hover:text-accent shadow-2xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3 w-3 text-accent" />
                    <span className="text-accent">Copied link</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3 w-3" />
                    <span>Share</span>
                  </>
                )}
              </button>
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
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
              {project.buyMeACoffee ? (
                <BuyMeACoffeeButton size="sm" url={buyMeACoffeeUrl || undefined} />
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

            {/* Project Narrative & Detailed Documentation (Markdown, Tables & Transparent Excalidraw) */}
            {project.body ? (
              <section className="mt-10 border-t border-rule pt-8">
                <MarkdownRenderer content={project.body} />
              </section>
            ) : paragraphs.length && !cs ? (
              <section className="mt-10 space-y-4 text-base leading-relaxed text-ink">
                {paragraphs.map((para, i) => (
                  <p key={i} className="whitespace-pre-line text-muted first:text-ink">
                    {para}
                  </p>
                ))}
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
                  <ExpandableText
                    text={cs.problem}
                    bg="paper"
                    className="mt-3 text-base text-muted leading-relaxed"
                    threshold={180}
                  />
                </section>

                {/* 2. Technical Constraints */}
                <section className="border-t border-rule pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Engineering Challenges
                  </p>
                  <h2 className="mt-1 font-display text-2xl tracking-tight text-ink">
                    Technical Constraints
                  </h2>
                  <ExpandableText
                    text={cs.constraints}
                    bg="paper"
                    className="mt-3 text-base text-muted leading-relaxed"
                    threshold={180}
                  />
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

                  {cs.blueprint ? (
                    <div className="mt-8">
                      <ArchitectureBlueprint blueprint={cs.blueprint} />
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
                    <ExpandableText
                      text={cs.outcome}
                      bg="white"
                      className="text-base font-medium text-ink leading-relaxed"
                      threshold={180}
                    />
                  </div>
                </section>
              </div>
            ) : null}

            {/* Tech Stack */}
            {project.techStack?.length ? (
              <section className="mt-12 border-t border-rule pt-8">
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

            {/* Support the Project Card */}
            {project.buyMeACoffee ? (
              <BuyMeACoffeeCard className="mt-14" url={buyMeACoffeeUrl || undefined} />
            ) : null}

            {/* Two-Way Case Study Navigation */}
            {allProjects.length > 1 && (prevProject || nextProject) ? (
              <div className="mt-16 border-t border-rule pt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  More Case Studies
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {prevProject ? (
                    <Link
                      to={`/projects/${prevProject.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-rule bg-white p-5 transition-all hover:border-accent/50 hover:shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                        <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-1 group-hover:text-accent" aria-hidden="true" />
                        <span>Previous Case Study</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block mb-1">
                          {prevProject.badge ?? "Case Study"}
                        </span>
                        <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                          {prevProject.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {prevProject.caseStudy?.headline ?? prevProject.summary}
                        </p>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextProject ? (
                    <Link
                      to={`/projects/${nextProject.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-rule bg-white p-5 transition-all hover:border-accent/50 hover:shadow-xs sm:text-right"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2 sm:justify-end">
                        <span>Next Case Study</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="text-xs text-muted block mb-1">
                          {nextProject.badge ?? "Case Study"}
                        </span>
                        <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                          {nextProject.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {nextProject.caseStudy?.headline ?? nextProject.summary}
                        </p>
                      </div>
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>
        )}
      </main>

      <SiteFooter name={siteName} websiteUrl={websiteUrl} />
    </div>
  );
}
