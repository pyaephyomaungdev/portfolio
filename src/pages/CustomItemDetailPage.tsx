import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, Share2, Check } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { calculateReadingTime } from "../lib/readingTime";
import {
  fetchCustomItem,
  fetchPortfolio,
  type CustomSection,
  type CustomSectionItem,
  type Profile,
} from "../lib/api";
import { initialPortfolioData } from "../data/portfolioData";
import { scrollToId } from "../lib/scrollToId";

export function CustomItemDetailPage() {
  const { sectionId, slug } = useParams<{ sectionId: string; slug: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<CustomSection | null>(null);
  const [item, setItem] = useState<CustomSectionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(
    () => initialPortfolioData.profile,
  );
  const [siteName, setSiteName] = useState<string | null>(
    () => initialPortfolioData.profile?.name ?? null,
  );
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(
    () => initialPortfolioData.profile?.websiteUrl ?? null,
  );

  function handleShare() {
    void navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  useEffect(() => {
    if (!sectionId || !slug) return;
    let cancelled = false;
    setError(null);
    setItem(null);
    setSection(null);

    void fetchCustomItem(sectionId, slug)
      .then((res) => {
        if (!cancelled) {
          setSection(res.section);
          setItem(res.item);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Article not found");
      });

    void fetchPortfolio()
      .then((d) => {
        if (!cancelled) {
          setProfile(d.profile ?? null);
          setSiteName(d.profile?.name ?? null);
          setWebsiteUrl(d.profile?.websiteUrl ?? null);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [sectionId, slug]);

  useEffect(() => {
    if (!item) return;
    const prevTitle = document.title;
    document.title = `${item.title} — ${siteName || "Pyae Phyo Maung"}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    const descriptionContent = item.description || item.subtitle || "";
    if (metaDesc && descriptionContent) {
      metaDesc.setAttribute("content", descriptionContent);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, [item, siteName]);

  const itemsList = section?.items ?? [];
  const currentIndex = itemsList.findIndex((it) => it.slug === slug);
  const prevItem =
    currentIndex >= 0 && itemsList.length > 1
      ? itemsList[(currentIndex - 1 + itemsList.length) % itemsList.length]
      : null;
  const nextItem =
    currentIndex >= 0 && itemsList.length > 1
      ? itemsList[(currentIndex + 1) % itemsList.length]
      : null;

  function handleBackToSection() {
    if (sectionId) {
      navigate({ pathname: "/", hash: `section-${sectionId}` });
      queueMicrotask(() => scrollToId(`section-${sectionId}`));
    } else {
      navigate("/");
    }
  }

  const readingTime = calculateReadingTime(
    [item?.content, item?.description, item?.subtitle].filter(Boolean).join(" "),
  );

  return (
    <div className="min-h-screen">
      <ReadingProgressBar />
      <SiteHeader name={siteName} profile={profile} />

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        {/* Back Link */}
        <button
          type="button"
          onClick={handleBackToSection}
          className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-2 hover:text-ink hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {section?.title ? `Back to ${section.title}` : "Back to Home"}
          </span>
        </button>

        {error ? (
          <div className="mt-12 rounded-2xl border border-rule bg-white p-8 sm:p-12 text-center shadow-xs">
            <span className="font-mono text-xs uppercase tracking-widest text-accent block">
              // NOT FOUND
            </span>
            <h2 className="mt-2 font-display text-3xl text-ink font-normal">
              Article Not Found
            </h2>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              We could not find the requested entry with slug{" "}
              <code className="font-mono bg-soft px-1.5 py-0.5 rounded text-ink">
                {slug}
              </code>
              .
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/"
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
              >
                <span>Return to Portfolio</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : item ? (
          <article className="mt-8">
            {/* Metadata Bar & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-soft px-3 py-1 text-xs font-semibold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item.tag || section?.title || "Article"}
                </span>
                {item.date ? (
                  <span className="font-mono text-xs text-muted">{item.date}</span>
                ) : null}
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                  <Clock className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
                  <span>{readingTime}</span>
                </span>
                {section?.title ? (
                  <span className="font-mono text-xs text-muted">
                    · {section.title}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share article link"
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

            {/* Headline */}
            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl text-ink font-normal leading-tight">
              {item.title}
            </h1>

            {item.subtitle ? (
              <p className="mt-3 text-lg font-medium text-ink leading-snug">
                {item.subtitle}
              </p>
            ) : null}

            {item.description ? (
              <p className="mt-2 text-base text-muted leading-relaxed">
                {item.description}
              </p>
            ) : null}

            {/* External publication link button if present */}
            {item.url ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.url.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer"
                >
                  <span>Visit external publication</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </div>
            ) : null}

            {/* Long-form Content / Markdown Body */}
            {item.content ? (
              <div className="mt-10 border-t border-rule pt-8">
                <MarkdownRenderer content={item.content} />
              </div>
            ) : null}

            {/* Adjacent Items Pagination (Previous / Next) */}
            {itemsList.length > 1 && (prevItem || nextItem) ? (
              <div className="mt-16 border-t border-rule pt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 font-mono">
                  More in {section?.title || "this collection"}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {prevItem && prevItem.slug ? (
                    <Link
                      to={`/custom/${sectionId}/${prevItem.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-rule bg-white p-5 transition-all hover:border-accent/50 hover:shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                        <ArrowLeft
                          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-1 group-hover:text-accent"
                          aria-hidden="true"
                        />
                        <span className="font-mono">Previous Entry</span>
                      </div>
                      <div>
                        {prevItem.tag ? (
                          <span className="text-xs font-mono text-accent block mb-1">
                            {prevItem.tag}
                          </span>
                        ) : null}
                        <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                          {prevItem.title}
                        </h3>
                        {prevItem.description ? (
                          <p className="mt-1 line-clamp-2 text-xs text-muted">
                            {prevItem.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextItem && nextItem.slug ? (
                    <Link
                      to={`/custom/${sectionId}/${nextItem.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-rule bg-white p-5 transition-all hover:border-accent/50 hover:shadow-xs sm:text-right"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-2 sm:justify-end">
                        <span className="font-mono">Next Entry</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        {nextItem.tag ? (
                          <span className="text-xs font-mono text-accent block mb-1">
                            {nextItem.tag}
                          </span>
                        ) : null}
                        <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                          {nextItem.title}
                        </h3>
                        {nextItem.description ? (
                          <p className="mt-1 line-clamp-2 text-xs text-muted">
                            {nextItem.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>
        ) : (
          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-4 w-20 rounded bg-soft" />
            <div className="h-10 w-2/3 rounded-lg bg-soft" />
            <div className="h-4 w-32 rounded bg-soft" />
            <div className="mt-8 space-y-2.5">
              <div className="h-4 w-full rounded bg-soft" />
              <div className="h-4 w-5/6 rounded bg-soft" />
              <div className="h-4 w-4/6 rounded bg-soft" />
            </div>
          </div>
        )}
      </main>

      <SiteFooter name={siteName} websiteUrl={websiteUrl} />
    </div>
  );
}
