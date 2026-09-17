import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContributionHeatmap } from "../components/ContributionHeatmap";
import { ExperienceSection } from "../components/ExperienceSection";
import { GitHubStarBadge } from "../components/GitHubStarButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { TechIcon } from "../components/TechIcon";
import { ExpandableText } from "../components/ExpandableText";
import { BackToTopButton } from "../components/BackToTopButton";
import { AvailabilityBadge } from "../components/AvailabilityBadge";
import { ContactModal } from "../components/ContactModal";
import { ContactForm } from "../components/ContactForm";
import { ProjectCategoryFilter } from "../components/ProjectCategoryFilter";
import { CustomSectionView } from "../components/CustomSectionView";
import { initialPortfolioData } from "../data/portfolioData";
import { ArrowRight, Check, ExternalLink, Printer } from "lucide-react";
import { fetchPortfolio, type Portfolio } from "../lib/api";
import { scrollToId } from "../lib/scrollToId";
import { applyThemeConfig } from "../lib/theme";
import { useTheme } from "../context/ThemeContext";

export function HomePage() {
  const { resolvedTheme, setThemeConfig } = useTheme();
  const [data, setData] = useState<Portfolio>(initialPortfolioData);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const location = useLocation();

  const categories = useMemo(() => {
    if (!data.projects?.length) return [];
    const counts = new Map<string, number>();
    for (const proj of data.projects) {
      if (proj.categories?.length) {
        for (const cat of proj.categories) {
          counts.set(cat, (counts.get(cat) || 0) + 1);
        }
      }
    }
    return [
      { name: "All", count: data.projects.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
    ];
  }, [data.projects]);

  const filteredProjects = useMemo(() => {
    if (!data.projects?.length) return [];
    if (selectedCategory === "All") return data.projects;
    return data.projects.filter((p) => p.categories?.includes(selectedCategory));
  }, [data.projects, selectedCategory]);

  useEffect(() => {
    void fetchPortfolio().then((d) => {
      setData(d);
      if (d.themeConfig) {
        setThemeConfig(d.themeConfig);
      }
    });
  }, [setThemeConfig]);

  useEffect(() => {
    if (data.profile?.name) {
      document.title =
        data.seo?.metaTitle ||
        `${data.profile.name} — ${data.profile.headline || "Software Engineer & Full-Stack Developer"}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", data.seo?.metaDescription || data.profile.bio || "");
      }
    }
  }, [data.profile, data.seo]);

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    scrollToId(id);
  }, [location.hash, data]);

  useEffect(() => {
    applyThemeConfig(data.themeConfig, resolvedTheme === "dark");
  }, [data.themeConfig, resolvedTheme]);

  const p = data.profile;
  const vis = {
    stats: true,
    heatmap: true,
    projects: true,
    experience: true,
    education: true,
    honors: true,
    licenses: true,
    contact: true,
    custom: true,
    ...data.sectionVisibility,
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        name={p?.name}
        profile={p}
        onOpenContact={() => setContactModalOpen(true)}
        sectionVisibility={vis}
      />

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <section className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
          {p?.avatarUrl ? (
            <div className="relative shrink-0">
              <picture>
                <source srcSet="/avatar.webp" type="image/webp" />
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  width={112}
                  height={112}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-rule object-cover shadow-xs ring-1 ring-black/5"
                />
              </picture>
              <AvailabilityBadge config={p?.availability} onOpenContact={() => setContactModalOpen(true)} variant="corner" />
            </div>
          ) : (
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border border-rule bg-soft text-3xl font-semibold text-muted">
                {(p?.name || "P").slice(0, 1)}
              </div>
              <AvailabilityBadge config={p?.availability} onOpenContact={() => setContactModalOpen(true)} variant="corner" />
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


            {/* Print-Only Recruiter Contact Bar */}
            <div className="hidden print:flex print:flex-wrap print:items-center print:gap-4 print:mt-4 print:pt-3 print:border-t print:border-rule print:text-xs print:font-mono print:text-ink">
              {p?.emailPublic && <span>Email: {p.emailPublic}</span>}
              {p?.githubUrl && <span>GitHub: {p.githubUrl.replace(/^https?:\/\//, "")}</span>}
              {p?.websiteUrl && <span>Portfolio: {p.websiteUrl.replace(/^https?:\/\//, "")}</span>}
              {p?.location && <span>Location: {p.location}</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
              >
                <span>Get in touch</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId("projects")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer"
              >
                <span>View work</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                title="Print or Save as PDF Resume (A4 CV)"
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer group"
              >
                <Printer className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-ink transition-colors" aria-hidden="true" />
                <span>Print / Save CV</span>
              </button>
            </div>
          </div>
        </section>

        {vis.stats && data.stats?.length ? (
          <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {data.stats.map((s) => (
              <div key={s.id}>
                <p className="text-xs font-medium text-muted">{s.label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-ink">{s.value}</p>
              </div>
            ))}
          </section>
        ) : null}

        {vis.heatmap && p?.githubUrl?.trim() ? (
          <div data-no-print className="print:hidden">
            <ContributionHeatmap githubUrl={p.githubUrl} />
          </div>
        ) : null}

        {vis.projects && data.projects?.length ? (
          <section id="projects" className="mt-16 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Projects
            </p>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h2 className="font-display text-3xl tracking-tight">
                Selected work
              </h2>
              {selectedCategory !== "All" && (
                <span className="font-mono text-xs text-muted">
                  Showing {filteredProjects.length} of {data.projects.length} projects
                </span>
              )}
            </div>

            {/* Horizontally Scrollable Filter Chips with Gradient Blur Navigation */}
            <ProjectCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {filteredProjects.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-rule p-8 text-center">
                <p className="text-sm text-muted">
                  No projects found matching category &ldquo;{selectedCategory}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-3 text-xs font-medium text-accent underline-offset-2 hover:underline cursor-pointer"
                >
                  Reset filter to All
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {filteredProjects.map((proj, i) => (
                  <div
                    key={proj.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-rule bg-white p-4 transition-all hover:border-accent/50 hover:shadow-xs"
                  >
                    <div>
                      {/* Border-Integrated Corner Index Notch */}
                      <div className="absolute -top-px -right-px flex items-center rounded-tr-xl rounded-bl-xl border-b border-l border-rule bg-soft/80 px-2.5 py-1 text-xs font-mono text-muted shadow-2xs transition-colors group-hover:border-accent/50 group-hover:text-accent z-10">
                        <span className="font-semibold text-ink/90 group-hover:text-accent transition-colors">
                          #{i + 1}
                        </span>
                      </div>

                      <h3 className="pr-16 font-semibold tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                        <Link to={`/projects/${proj.slug}`} className="focus:outline-none">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          {proj.title}
                        </Link>
                      </h3>
                      {proj.period ? (
                        <p className="mt-1 text-xs text-muted">{proj.period}</p>
                      ) : null}
                      {proj.summary ? (
                        <div className="relative z-10">
                          <ExpandableText
                            text={proj.summary}
                            className="mt-2 text-sm text-muted leading-relaxed"
                            threshold={110}
                          />
                        </div>
                      ) : null}
                      {proj.categories?.length ? (
                        <div className="mt-2.5 flex flex-wrap gap-1 relative z-10">
                          {proj.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-block rounded border border-rule/70 bg-soft/60 px-1.5 py-0.5 font-mono text-xs text-muted"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
                      <div className="flex items-center gap-2.5 relative z-10">
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
                      <div className="relative z-10">
                        {proj.url ? (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Live demo of ${proj.title}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-accent transition-colors cursor-pointer"
                          >
                            <span>Live</span>
                            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        ) : proj.repoUrl ? (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Source repository of ${proj.title}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-accent transition-colors cursor-pointer"
                          >
                            <span>Source</span>
                            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            to={`/projects/${proj.slug}`}
                            aria-label={`Project overview: ${proj.title}`}
                            className="inline-flex items-center gap-1 text-xs text-muted group-hover:text-accent transition-colors"
                          >
                            <span>Overview</span>
                            <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {vis.experience ? <ExperienceSection companies={data.experience ?? []} /> : null}

        {vis.education && data.education?.length ? (
          <section id="education" className="mt-16 scroll-mt-24">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Education
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Academic background
            </h2>
            <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
              {data.education.map((e) => (
                <div key={e.id} className="group/edu p-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 transition-colors hover:bg-soft/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink group-hover/edu:text-accent transition-colors">{e.school}</h3>
                      {e.url ? (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted hover:text-accent transition-colors"
                          aria-label={`Visit ${e.school}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {[e.degree, e.field].filter(Boolean).join(" · ")}
                    </p>
                    {e.description ? (
                      <ExpandableText
                        text={e.description}
                        className="mt-2 text-sm text-muted leading-relaxed"
                        threshold={140}
                      />
                    ) : null}
                  </div>
                  <p className="font-mono text-xs text-muted shrink-0">
                    {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {vis.honors && data.honors?.length ? (
          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Recognition
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">
              Honors & awards
            </h2>
            <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
              {data.honors.map((h) => (
                <div key={h.id} className="group/honor p-5 transition-colors hover:bg-soft/30">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink group-hover/honor:text-accent transition-colors">{h.title}</h3>
                        {h.url ? (
                          <a
                            href={h.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted hover:text-accent transition-colors"
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

        {vis.licenses && data.licenses?.length ? (
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

        {/* Custom Content & Sections */}
        {vis.custom && data.customSections && data.customSections.length > 0 ? (
          <div className="space-y-12">
            {data.customSections.map((sec) => (
              <CustomSectionView key={sec.id} section={sec} />
            ))}
          </div>
        ) : null}

        {vis.contact ? (
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
              {[
                p?.location ? `Based in ${p.location}` : null,
                "Available for remote work across global teams.",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer"
              >
                <span>Direct Channels Hub</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              {p?.emailPublic ? (
                <button
                  type="button"
                  onClick={() => {
                    if (p?.emailPublic) {
                      void navigator.clipboard.writeText(p.emailPublic);
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
              ) : null}

              {p?.telegramUrl ? (
                <a
                  href={p.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm font-medium text-muted transition hover:border-ink hover:text-ink"
                >
                  <span>Telegram</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
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

          {/* Direct Note Form - Only rendered when Telegram dispatch is configured, hidden in print */}
          {p?.telegramConfigured ? <ContactForm profile={p} className="mt-6 print:hidden" /> : null}
        </section>
        ) : null}
      </main>

      <SiteFooter name={p?.name} websiteUrl={p?.websiteUrl} />
      <BackToTopButton />

      {/* Direct Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        profile={p}
      />
    </div>
  );
}
