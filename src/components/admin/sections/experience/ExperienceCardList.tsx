import { useState } from "react";
import { Plus, Briefcase, MapPin, Copy, Edit3, Search } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { ExperienceCompany, ExperienceRole } from "../../../../types/portfolio";

interface ExperienceCardListProps {
  companies: ExperienceCompany[];
  onSelectCompany: (id: string) => void;
  onAddCompany: () => void;
  onChange: (companies: ExperienceCompany[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ExperienceCardList({
  companies,
  onSelectCompany,
  onAddCompany,
  onChange,
  onRequestDelete,
}: ExperienceCardListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function moveCompany(index: number, direction: "up" | "down") {
    onChange(reorderArray(companies, index, direction));
  }

  function handleDuplicateCompany(comp: ExperienceCompany, companyIdx: number) {
    const duplicated: ExperienceCompany = {
      ...comp,
      id: `exp-${Date.now()}`,
      name: `${comp.name} (Copy)`,
      roles: comp.roles.map((r, i) => ({
        ...r,
        id: `role-${Date.now()}-${i}`,
      })),
    };
    const updated = [...companies];
    updated.splice(companyIdx + 1, 0, duplicated);
    onChange(updated);
  }

  function handleDeleteCompany(comp: ExperienceCompany) {
    const doDelete = () => onChange(companies.filter((c) => c.id !== comp.id));
    if (onRequestDelete) {
      onRequestDelete(comp.name || "Company", doDelete);
    } else {
      doDelete();
    }
  }

  const filteredCompanies = companies.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesCompany =
      c.name.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q));
    const matchesRole = c.roles.some(
      (r: ExperienceRole) =>
        r.title.toLowerCase().includes(q) ||
        r.skills.some((s: string) => s.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
    return matchesCompany || matchesRole;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Career &amp; Roles</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Career Experience ({companies.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Employment history, company roles, engineering responsibilities, and skill sets.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddCompany}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by company, role title, location, or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-rule bg-paper pl-9 pr-3 py-1.5 text-xs text-ink outline-none focus:border-ink font-mono placeholder:text-muted/60"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <Briefcase className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No experience records found</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Click &ldquo;Add Company&rdquo; to begin documenting career milestones.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredCompanies.map((comp) => {
            const rawIdx = companies.findIndex((c) => c.id === comp.id);
            const allSkills = Array.from(new Set(comp.roles.flatMap((r) => r.skills || [])));

            return (
              <div
                key={comp.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={rawIdx}
                  canMoveUp={rawIdx > 0}
                  canMoveDown={rawIdx < companies.length - 1}
                  onMoveUp={() => moveCompany(rawIdx, "up")}
                  onMoveDown={() => moveCompany(rawIdx, "down")}
                  onDelete={() => handleDeleteCompany(comp)}
                  deleteTitle="Delete company"
                />

                {/* Top Row: Company Info */}
                <div className="flex items-center gap-3 min-w-0 pr-32">
                  <div className="size-9 rounded-xl border border-rule bg-soft flex items-center justify-center font-bold text-ink text-sm shadow-2xs shrink-0">
                    {comp.logoUrl ? (
                      <img
                        src={comp.logoUrl}
                        alt={comp.name}
                        className="size-full object-cover rounded-xl"
                      />
                    ) : (
                      comp.name.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                      {comp.name}
                    </h3>
                    {comp.location ? (
                      <span className="flex items-center gap-1 text-xs text-muted font-mono">
                        • <MapPin className="size-3" />
                        <span>{comp.location}</span>
                      </span>
                    ) : null}
                    <span className="rounded bg-soft px-1.5 py-0.5 text-xs font-mono text-muted border border-rule">
                      {comp.roles.length} {comp.roles.length === 1 ? "role" : "roles"}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Roles, Skills & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pl-0 sm:pl-12">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    {/* Clean inline roles without nested cards */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
                      {comp.roles.map((role, rIdx) => (
                        <span key={role.id} className="inline-flex items-center gap-1 text-ink font-medium">
                          {rIdx > 0 ? <span className="text-muted/60 mr-1">•</span> : null}
                          <span>{role.title}</span>
                          <span className="text-muted font-normal">
                            ({[role.startDate, role.endDate || "Present"].filter(Boolean).join(" — ")})
                          </span>
                        </span>
                      ))}
                    </div>

                    {/* Skills chips */}
                    {allSkills.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {allSkills.slice(0, 6).map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-soft/80 px-1.5 py-0.5 text-xs font-mono text-muted border border-rule"
                          >
                            {skill}
                          </span>
                        ))}
                        {allSkills.length > 6 ? (
                          <span className="text-xs font-mono text-muted">
                            +{allSkills.length - 6} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    <button
                      type="button"
                      onClick={() => handleDuplicateCompany(comp, rawIdx)}
                      className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
                      title="Duplicate company entry"
                    >
                      <Copy className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectCompany(comp.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs ml-1"
                    >
                      <Edit3 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
