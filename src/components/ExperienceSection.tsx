import { ExpandableText } from "./ExpandableText";
import type { ExperienceCompany } from "../lib/api";

function rolePeriod(start: string, end: string | null) {
  return end ? `${start} – ${end}` : `${start} – Present`;
}

export function ExperienceSection({ companies }: { companies: ExperienceCompany[] }) {
  if (!companies.length) return null;

  return (
    <section id="experience" className="mt-16 scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Experience
      </p>
      <h2 className="mt-1 font-display text-3xl tracking-tight">Career</h2>

      <div className="mt-6 divide-y divide-rule rounded-xl border border-rule bg-white">
        {companies.map((co) => {
          const multi = co.roles.length > 1;
          if (!multi && co.roles[0]) {
            const role = co.roles[0];
            return (
              <article key={co.id} className="flex gap-4 p-5">
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

          return (
            <article key={co.id} className="p-5">
              <div className="flex gap-4">
                <Logo name={co.name} url={co.logoUrl} />
                <div>
                  <h3 className="text-base font-semibold">{co.name}</h3>
                  {co.location ? (
                    <p className="text-sm text-muted">{co.location}</p>
                  ) : null}
                </div>
              </div>
              <ol className="relative ml-5 mt-4 border-l border-rule pl-6">
                {co.roles.map((role) => (
                  <li key={role.id} className="relative pb-5 last:pb-0">
                    <span className="absolute -left-6 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-rule bg-white" />
                    <h4 className="font-semibold">{role.title}</h4>
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
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
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
