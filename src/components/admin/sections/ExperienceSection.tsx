import { Plus, Trash2 } from "lucide-react";
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
  function handleUpdateRole(companyIdx: number, roleIdx: number, updatedRole: ExperienceRole) {
    const updated = [...companies];
    updated[companyIdx].roles[roleIdx] = updatedRole;
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

      {companies.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
          No work experience configured yet. Click "Add Company" above to create one.
        </div>
      ) : (
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
                      className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink resize-y font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
