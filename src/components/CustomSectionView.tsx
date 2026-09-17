import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { CustomSection } from "../types/portfolio";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface CustomSectionViewProps {
  section: CustomSection;
}

export function CustomSectionView({ section }: CustomSectionViewProps) {
  if (!section.visible) return null;

  const kicker =
    section.id === "writing-labs" || section.title.toLowerCase().includes("writing")
      ? "Writing & Research"
      : "Featured Collection";

  return (
    <section id={`section-${section.id}`} className="mt-16 scroll-mt-24">
      {/* Section Kicker & Header matching HomePage standard */}
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {kicker}
      </p>
      <h2 className="mt-1 font-display text-3xl tracking-tight text-ink">
        {section.title}
      </h2>

      {section.subtitle ? (
        <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
          {section.subtitle}
        </p>
      ) : null}

      {/* Intro Prose (if available for cards/list, or main body for prose) */}
      {section.content ? (
        <div
          className={`mt-4 ${section.layout === "prose"
            ? "rounded-xl border border-rule bg-white p-5 sm:p-6 shadow-xs"
            : "text-sm text-muted"
            }`}
        >
          <MarkdownRenderer content={section.content} />
        </div>
      ) : null}

      {/* Cards Layout */}
      {section.layout === "cards" && section.items && section.items.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {section.items.map((item, index) => {
            const hasDetailPage = Boolean(item.slug);
            const hasExternalUrl = Boolean(item.url);
            const detailUrl = `/custom/${section.id}/${item.slug}`;

            if (hasDetailPage) {
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-rule bg-white p-4 transition-all hover:border-accent/50 hover:shadow-xs text-left"
                >
                  <div>
                    {/* Border-Integrated Corner Date/Index Notch */}
                    <div className="absolute -top-px -right-px flex items-center rounded-tr-xl rounded-bl-xl border-b border-l border-rule bg-soft/80 px-2.5 py-1 text-xs font-mono text-muted shadow-2xs transition-colors group-hover:border-accent/50 group-hover:text-accent z-10">
                      <span className="font-semibold text-ink/90 group-hover:text-accent transition-colors">
                        {item.date || `#${index + 1}`}
                      </span>
                    </div>

                    <h3 className="pr-16 font-semibold tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                      <Link to={detailUrl} className="focus:outline-none">
                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                        {item.title}
                      </Link>
                    </h3>

                    {item.subtitle ? (
                      <p className="mt-1 font-mono text-xs text-muted">{item.subtitle}</p>
                    ) : null}

                    {item.description ? (
                      <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    ) : null}

                    {item.tag ? (
                      <div className="mt-2.5 flex flex-wrap gap-1 relative z-10">
                        <span className="inline-block rounded border border-rule/70 bg-soft/60 px-1.5 py-0.5 font-mono text-xs text-muted">
                          {item.tag}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3 text-xs">
                    <div className="relative z-10">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Source publication for ${item.title}`}
                          className="inline-flex items-center gap-1 font-medium text-muted hover:text-accent transition-colors"
                        >
                          <span>Source</span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                    <div className="relative z-10">
                      <Link
                        to={detailUrl}
                        aria-label={`Read article: ${item.title}`}
                        className="inline-flex items-center gap-1 font-medium text-ink group-hover:text-accent group-hover:underline transition-colors"
                      >
                        <span>Read article</span>
                        <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // Fallback to external link if no detail slug
            const CardTag = hasExternalUrl ? "a" : "div";
            const linkProps = hasExternalUrl
              ? {
                  href: item.url,
                  target: item.url?.startsWith("http") ? "_blank" : undefined,
                  rel: item.url?.startsWith("http") ? "noopener noreferrer" : undefined,
                }
              : {};

            return (
              <CardTag
                key={item.id}
                {...linkProps}
                className={`group relative flex flex-col justify-between rounded-xl border border-rule bg-white p-4 transition-all hover:border-accent/50 hover:shadow-xs text-left ${
                  hasExternalUrl ? "cursor-pointer" : ""
                }`}
              >
                <div>
                  {/* Border-Integrated Corner Date/Index Notch */}
                  <div className="absolute -top-px -right-px flex items-center rounded-tr-xl rounded-bl-xl border-b border-l border-rule bg-soft/80 px-2.5 py-1 text-xs font-mono text-muted shadow-2xs transition-colors group-hover:border-accent/50 group-hover:text-accent z-10">
                    <span className="font-semibold text-ink/90 group-hover:text-accent transition-colors">
                      {item.date || `#${index + 1}`}
                    </span>
                  </div>

                  <h3 className="pr-16 font-semibold tracking-tight text-ink group-hover:text-accent group-hover:underline transition-colors">
                    {item.title}
                  </h3>

                  {item.subtitle ? (
                    <p className="mt-1 font-mono text-xs text-muted">{item.subtitle}</p>
                  ) : null}

                  {item.description ? (
                    <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  ) : null}

                  {item.tag ? (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="inline-block rounded border border-rule/70 bg-soft/60 px-1.5 py-0.5 font-mono text-xs text-muted">
                        {item.tag}
                      </span>
                    </div>
                  ) : null}
                </div>

                {hasExternalUrl ? (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3 text-xs">
                    <span className="font-mono text-muted">
                      {item.subtitle || "Publication"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-ink group-hover:text-accent group-hover:underline transition-colors">
                      <span>Read publication</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </span>
                  </div>
                ) : null}
              </CardTag>
            );
          })}
        </div>
      ) : null}

      {/* List Layout */}
      {section.layout === "list" && section.items && section.items.length > 0 ? (
        <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white overflow-hidden shadow-xs">
          {section.items.map((item) => {
            const hasDetailPage = Boolean(item.slug);
            const hasExternalUrl = Boolean(item.url);
            const detailUrl = `/custom/${section.id}/${item.slug}`;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 p-5 transition hover:bg-soft/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-semibold text-ink">
                      {hasDetailPage ? (
                        <Link
                          to={detailUrl}
                          className="inline-flex items-center gap-1.5 hover:text-accent transition"
                        >
                          <span>{item.title}</span>
                          <ArrowRight className="h-3 w-3 shrink-0 opacity-60" />
                        </Link>
                      ) : hasExternalUrl ? (
                        <a
                          href={item.url}
                          target={item.url?.startsWith("http") ? "_blank" : undefined}
                          rel={
                            item.url?.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-1.5 hover:text-accent transition"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    {item.tag ? (
                      <span className="inline-block rounded border border-rule/70 bg-soft/60 px-1.5 py-0.5 font-mono text-xs text-muted">
                        {item.tag}
                      </span>
                    ) : null}
                  </div>
                  {item.subtitle ? (
                    <p className="mt-0.5 font-mono text-xs text-muted">{item.subtitle}</p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                {item.date ? (
                  <span className="shrink-0 font-mono text-xs text-muted sm:text-right">
                    {item.date}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
