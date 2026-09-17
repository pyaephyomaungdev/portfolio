import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ExpandableText } from "./ExpandableText";
import type { ExperienceCompany } from "../lib/api";

function rolePeriod(start: string, end: string | null) {
  return end ? `${start} – ${end}` : `${start} – Present`;
}

export function ExperienceSection({ companies }: { companies: ExperienceCompany[] }) {
  if (!companies.length) return null;

  return (
    <section id="experience" className="mt-16 print:mt-6 scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Experience
      </p>
      <h2 className="mt-1 font-display text-3xl tracking-tight">Career</h2>

      <div className="mt-6 print:mt-3 divide-y divide-rule rounded-xl border border-rule bg-white print:rounded-xl overflow-hidden print:overflow-hidden">
        {companies.map((co) => (
          <ExperienceCompanyArticle key={co.id} co={co} />
        ))}
      </div>
    </section>
  );
}

function ExperienceCompanyArticle({ co }: { co: ExperienceCompany }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const multi = co.roles.length > 1;

  if (!multi && co.roles[0]) {
    const role = co.roles[0];
    return (
      <article className="flex gap-4 p-5 print:p-4">
        <Logo name={co.name} url={co.logoUrl} />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{role.title}</h3>
          <p className="text-sm text-ink">
            {co.name}
            {role.employmentType ? ` · ${role.employmentType}` : ""}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {rolePeriod(role.startDate, role.endDate)}
            {role.location || co.location
              ? ` · ${role.location || co.location}`
              : ""}
          </p>
          {role.description ? (
            <ExpandableText
              text={role.description}
              className="mt-2 text-sm text-muted leading-relaxed"
              threshold={140}
            />
          ) : null}
          {role.skills?.length ? (
            <p className="mt-2 text-sm text-muted">
              <span className="mr-1 text-ink">◆</span>
              {role.skills.join(", ")}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  const hasExpandableRoles = co.roles.length > 2;
  const hiddenCount = co.roles.length - 2;

  return (
    <article className="p-5 print:p-4">
      <div className="flex gap-4">
        <Logo name={co.name} url={co.logoUrl} />
        <div>
          <h3 className="text-base font-semibold">{co.name}</h3>
          {co.location ? (
            <p className="text-sm text-muted">{co.location}</p>
          ) : null}
        </div>
      </div>
      <ol className="relative ml-5 mt-4 border-l border-rule pl-6 print:mt-3">
        {co.roles.map((role, rIdx) => {
          const isHidden = !isExpanded && rIdx >= 2;
          return (
            <li
              key={role.id}
              className={`group/role relative pb-5 last:pb-0 print:pb-3 ${
                isHidden ? "hidden print:block" : ""
              }`}
            >
              <span className="absolute -left-6 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-rule bg-white transition-colors group-hover/role:border-accent group-hover/role:bg-accent/20" />
              <h4 className="font-semibold transition-colors group-hover/role:text-accent">{role.title}</h4>
              {role.employmentType ? (
                <p className="text-sm">{role.employmentType}</p>
              ) : null}
              <p className="text-sm text-muted">
                {rolePeriod(role.startDate, role.endDate)}
                {role.location ? ` · ${role.location}` : ""}
              </p>
              {role.description ? (
                <ExpandableText
                  text={role.description}
                  className="mt-2 text-sm text-muted leading-relaxed"
                  threshold={140}
                />
              ) : null}
              {role.skills?.length ? (
                <p className="mt-1.5 text-sm text-muted">
                  <span className="mr-1 text-ink">◆</span>
                  {role.skills.join(", ")}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {hasExpandableRoles && (
        <div className="mt-2 flex justify-center print:hidden">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-rule bg-white px-3 py-1 text-xs font-mono text-muted hover:text-accent hover:border-accent/40 hover:bg-soft shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            aria-expanded={isExpanded}
            aria-label={
              isExpanded
                ? "Show fewer roles"
                : `Show ${hiddenCount} more ${hiddenCount === 1 ? "role" : "roles"}`
            }
          >
            <span className="transition-colors group-hover:text-accent">
              {isExpanded
                ? "Show fewer roles"
                : `Show ${hiddenCount} more ${hiddenCount === 1 ? "role" : "roles"}`}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:text-accent ${
                isExpanded ? "rotate-180 text-accent" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </article>
  );
}

function Logo({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg border border-rule object-cover"
      />
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-rule bg-soft text-sm font-semibold text-muted">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
