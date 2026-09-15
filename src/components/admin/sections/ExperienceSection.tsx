import { Plus, Trash2 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { ExperienceCompany, ExperienceRole } from "../../../types/portfolio";

interface ExperienceSectionProps {
  companies: ExperienceCompany[];
  onChange: (companies: ExperienceCompany[]) => void;
  onOpenAddCompanyModal: () => void;
  onOpenAddRoleModal: (companyId: string, companyName: string) => void;
}

export function ExperienceSection({
  companies,
  onChange,
  onOpenAddCompanyModal,
  onOpenAddRoleModal,
}: ExperienceSectionProps) {
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

  function handleUpdateRole(
    companyIdx: number,
    roleIdx: number,
    updatedRole: ExperienceRole
  ) {
    const updated = [...companies];
    const roles = [...updated[companyIdx].roles];
    roles[roleIdx] = updatedRole;
    updated[companyIdx] = { ...updated[companyIdx], roles };
    onChange(updated);
  }

  function handleDeleteRole(companyIdx: number, roleIdx: number) {
    const updated = [...companies];
    const roles = updated[companyIdx].roles.filter((_, i) => i !== roleIdx);
    updated[companyIdx] = { ...updated[companyIdx], roles };
    onChange(updated);
  }

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
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Company</span>
        </button>
      </div>

      <div className="space-y-4">
        {companies.map((comp, cIdx) => (
          <div key={comp.id} className="p-4 rounded-xl border border-rule bg-paper space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2.5 flex-wrap sm:flex-nowrap">
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
                  className="font-display text-lg font-bold text-ink bg-transparent border-b border-transparent focus:border-ink outline-none"
                />
                <input
                  type="text"
                  value={comp.location || ""}
                  placeholder="Location"
                  onChange={(e) => {
                    const updated = [...companies];
                    updated[cIdx] = { ...comp, location: e.target.value || null };
                    onChange(updated);
                  }}
                  className="text-xs font-mono text-muted bg-white border border-rule rounded px-2 py-0.5 outline-none focus:border-ink"
                />
              </div>

              {/* Action Buttons: Add Role & Delete Company */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenAddRoleModal(comp.id, comp.name)}
                  className="inline-flex items-center gap-1 rounded-md border border-rule bg-white px-2.5 py-1 text-xs font-mono font-medium text-ink hover:border-ink transition cursor-pointer shadow-2xs"
                  title="Add another role to this company"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Role</span>
                </button>
                <button
                  type="button"
                  title="Delete company"
                  onClick={() => onChange(companies.filter((_, i) => i !== cIdx))}
                  className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-soft rounded transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Roles inside Company */}
            <div className="space-y-2">
              {comp.roles.map((role, rIdx) => (
                <div key={role.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs border-t border-rule/60 pt-2.5 items-center">
                  <div className="sm:col-span-4">
                    <span className="text-xs font-mono text-muted uppercase block mb-1">Role Title</span>
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleUpdateRole(cIdx, rIdx, { ...role, title: e.target.value })}
                      className="w-full rounded border border-rule bg-white px-2.5 py-1 font-medium text-ink outline-none focus:border-ink"
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
                        className="w-1/2 rounded border border-rule bg-white px-2 py-1 font-mono text-muted outline-none focus:border-ink"
                      />
                      <input
                        type="text"
                        value={role.endDate || ""}
                        placeholder="Present"
                        onChange={(e) => handleUpdateRole(cIdx, rIdx, { ...role, endDate: e.target.value || null })}
                        className="w-1/2 rounded border border-rule bg-white px-2 py-1 font-mono text-muted outline-none focus:border-ink"
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
                      className="w-full rounded border border-rule bg-white px-2.5 py-1 font-mono text-muted outline-none focus:border-ink"
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
                      title="Remove role"
                      onClick={() => handleDeleteRole(cIdx, rIdx)}
                      className="p-1 text-muted hover:text-destructive cursor-pointer transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
