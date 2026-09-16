import { useState } from "react";
import { Plus, Trash2, Search, Copy } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { ExperienceCompany, ExperienceRole } from "../../../types/portfolio";

interface ExperienceSectionProps {
  companies: ExperienceCompany[];
  onChange: (companies: ExperienceCompany[]) => void;
  onOpenAddCompanyModal: () => void;
  onOpenAddRoleModal: (companyId: string, companyName: string) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ExperienceSection({
  companies,
  onChange,
  onOpenAddCompanyModal,
  onOpenAddRoleModal,
  onRequestDelete,
}: ExperienceSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleUpdateRole(companyIdx: number, roleIdx: number, updatedRole: ExperienceRole) {
    const updated = [...companies];
    updated[companyIdx].roles[roleIdx] = updatedRole;
    onChange(updated);
  }

  function handleDuplicateRole(companyIdx: number, roleIdx: number) {
    const role = companies[companyIdx].roles[roleIdx];
    const duplicated: ExperienceRole = {
      ...role,
      id: `role-${Date.now()}`,
      title: `${role.title} (Copy)`,
    };
    const updated = [...companies];
    updated[companyIdx].roles.splice(roleIdx + 1, 0, duplicated);
    onChange(updated);
  }

  function handleDuplicateCompany(companyIdx: number) {
    const comp = companies[companyIdx];
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

  function handleDeleteRole(companyIdx: number, roleIdx: number, roleTitle: string) {
    const doDelete = () => {
      const updated = [...companies];
      updated[companyIdx].roles = updated[companyIdx].roles.filter((_, i) => i !== roleIdx);
      onChange(updated);
    };
    if (onRequestDelete) {
      onRequestDelete(roleTitle || "Role", doDelete);
    } else {
      doDelete();
    }
  }

  function handleDeleteCompany(companyIdx: number, companyName: string) {
    const doDelete = () => onChange(companies.filter((_, i) => i !== companyIdx));
    if (onRequestDelete) {
      onRequestDelete(companyName || "Company", doDelete);
    } else {
      doDelete();
    }
  }

  function moveCompany(index: number, direction: "up" | "down") {
    onChange(reorderArray(companies, index, direction));
  }

  function moveRole(companyIdx: number, roleIdx: number, direction: "up" | "down") {
    const updated = [...companies];
    updated[companyIdx] = {
      ...updated[companyIdx],
      roles: reorderArray(updated[companyIdx].roles, roleIdx, direction),
    };
    onChange(updated);
  }

  const filteredCompanies = companies.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesCompany = c.name.toLowerCase().includes(q) || (c.location && c.location.toLowerCase().includes(q));
    const matchesRole = c.roles.some((r) => 
      r.title.toLowerCase().includes(q) || 
      r.skills.some((s) => s.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
    return matchesCompany || matchesRole;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Work Experience ({companies.length})</h2>
          <p className="text-xs text-muted mt-0.5">Companies, positions, dates, and core responsibilities.</p>
        </div>
        <button
          type="button"
          onClick={onOpenAddCompanyModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Filter experience by company, role title, skills, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-rule bg-paper pl-9 pr-3 py-1.5 text-xs text-ink outline-none focus:border-ink font-mono placeholder:text-muted/60"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted hover:text-ink cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
          {searchQuery ? `No experience entries match "${searchQuery}"` : "No work experience configured yet. Click 'Add Company' above to create one."}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCompanies.map((comp) => {
            const cIdx = companies.findIndex((c) => c.id === comp.id);
            return (
              <div key={comp.id} className="p-4 rounded-xl border border-rule bg-paper space-y-4">
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ReorderButtons
                      canMoveUp={cIdx > 0}
                      canMoveDown={cIdx < companies.length - 1}
                      onMoveUp={() => moveCompany(cIdx, "up")}
                      onMoveDown={() => moveCompany(cIdx, "down")}
                    />
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => {
                        const updated = [...companies];
                        updated[cIdx] = { ...comp, name: e.target.value };
                        onChange(updated);
                      }}
                      placeholder="Company Name"
                      className="font-display text-lg font-bold bg-transparent border-b border-transparent focus:border-ink outline-none"
                    />
                    <input
                      type="text"
                      value={comp.location || ""}
                      onChange={(e) => {
                        const updated = [...companies];
                        updated[cIdx] = { ...comp, location: e.target.value || null };
                        onChange(updated);
                      }}
                      placeholder="Location (e.g. Remote)"
                      className="text-xs font-mono text-muted bg-transparent border-b border-transparent focus:border-ink outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onOpenAddRoleModal(comp.id, comp.name)}
                      className="inline-flex items-center gap-1 rounded-md border border-rule bg-paper px-2.5 py-1 text-xs font-mono font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                      title="Add another role to this company"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Role</span>
                    </button>
                    <button
                      type="button"
                      title="Duplicate Company (Clone)"
                      onClick={() => handleDuplicateCompany(cIdx)}
                      className="p-1.5 text-muted hover:text-ink hover:bg-soft rounded transition cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete company"
                      onClick={() => handleDeleteCompany(cIdx, comp.name)}
                      className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-soft rounded transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

            {/* Roles inside Company */}
            <div className="space-y-3">
              {comp.roles.map((role, rIdx) => (
                <div key={role.id} className="border-t border-rule/60 pt-2.5 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-4">
                      <span className="text-xs font-mono text-muted uppercase block mb-1">Role Title</span>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => handleUpdateRole(cIdx, rIdx, { ...role, title: e.target.value })}
                        className="w-full rounded border border-rule bg-soft px-2.5 py-1 font-medium text-ink outline-none focus:border-ink"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-xs font-mono text-muted uppercase block mb-1">Timeline (Start – End)</span>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={role.startDate}
                          placeholder="Start"
                          onChange={(e) => handleUpdateRole(cIdx, rIdx, { ...role, startDate: e.target.value })}
                          className="w-1/2 rounded border border-rule bg-soft px-2 py-1 font-mono text-muted outline-none focus:border-ink"
                        />
                        <input
                          type="text"
                          value={role.endDate || ""}
                          placeholder="Present"
                          onChange={(e) => handleUpdateRole(cIdx, rIdx, { ...role, endDate: e.target.value || null })}
                          className="w-1/2 rounded border border-rule bg-soft px-2 py-1 font-mono text-muted outline-none focus:border-ink"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-xs font-mono text-muted uppercase block mb-1">Skills (comma separated)</span>
                      <input
                        type="text"
                        value={role.skills.join(", ")}
                        onChange={(e) =>
                          handleUpdateRole(cIdx, rIdx, {
                            ...role,
                            skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full rounded border border-rule bg-soft px-2.5 py-1 font-mono text-muted outline-none focus:border-ink"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-3 sm:pt-0">
                      <ReorderButtons
                        size="sm"
                        canMoveUp={rIdx > 0}
                        canMoveDown={rIdx < comp.roles.length - 1}
                        onMoveUp={() => moveRole(cIdx, rIdx, "up")}
                        onMoveDown={() => moveRole(cIdx, rIdx, "down")}
                      />
                      <button
                        type="button"
                        title="Duplicate Role (Clone)"
                        onClick={() => handleDuplicateRole(cIdx, rIdx)}
                        className="p-1 text-muted hover:text-ink cursor-pointer transition"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remove role"
                        onClick={() => handleDeleteRole(cIdx, rIdx, role.title)}
                        className="p-1 text-muted hover:text-destructive cursor-pointer transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-muted uppercase block mb-1">
                      Description / Responsibilities (supports ExpandableText)
                    </span>
                    <textarea
                      rows={2}
                      value={role.description || ""}
                      placeholder="Key achievements, projects delivered, leadership responsibilities..."
                      onChange={(e) =>
                        handleUpdateRole(cIdx, rIdx, {
                          ...role,
                          description: e.target.value || null,
                        })
                      }
                      className="w-full rounded border border-rule bg-soft px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink resize-y font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
        </div>
      )}
    </div>
  );
}
