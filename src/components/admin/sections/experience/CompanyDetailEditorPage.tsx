import { useState } from "react";
import { ArrowLeft, Save, Trash2, Briefcase, Plus, MapPin } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { ExperienceCompany, ExperienceRole } from "../../../../types/portfolio";

interface CompanyDetailEditorPageProps {
  company: ExperienceCompany;
  onSave: (updated: ExperienceCompany) => void;
  onCancel: () => void;
  onDelete?: (company: ExperienceCompany) => void;
}

export function CompanyDetailEditorPage({
  company,
  onSave,
  onCancel,
  onDelete,
}: CompanyDetailEditorPageProps) {
  const [draft, setDraft] = useState<ExperienceCompany>({ ...company });

  function handleSave() {
    onSave(draft);
  }

  function handleAddRole() {
    const newRole: ExperienceRole = {
      id: `role-${Date.now()}`,
      companyId: draft.id,
      title: "Software Engineer",
      employmentType: "Full-Time",
      startDate: `${new Date().getFullYear()}`,
      endDate: null,
      location: draft.location || "Remote",
      description: "",
      skills: [],
      sortOrder: draft.roles.length + 1,
    };
    setDraft({ ...draft, roles: [...draft.roles, newRole] });
  }

  function handleUpdateRole(index: number, updates: Partial<ExperienceRole>) {
    const updatedRoles = draft.roles.map((r, i) => (i === index ? { ...r, ...updates } : r));
    setDraft({ ...draft, roles: updatedRoles });
  }

  function handleDeleteRole(index: number) {
    const updatedRoles = draft.roles.filter((_, i) => i !== index);
    setDraft({ ...draft, roles: updatedRoles });
  }

  function handleMoveRole(index: number, direction: "up" | "down") {
    setDraft({ ...draft, roles: reorderArray(draft.roles, index, direction) });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rule">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono font-medium text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Experience List</span>
          </button>
          <span className="text-muted text-xs">/</span>
          <h2 className="font-display text-xl font-bold text-ink truncate max-w-sm sm:max-w-md">
            {draft.name || "New Company"}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(draft)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive-soft px-3 py-1.5 text-xs font-mono font-medium text-destructive hover:bg-destructive-soft/80 transition cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-rule bg-paper px-3 py-1.5 text-xs font-mono font-medium text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 1. Company Core Info Card */}
      <div className="rounded-xl border border-rule bg-paper p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-rule">
          <Briefcase className="size-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono">
            Company Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Acme Systems"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Headquarters / Location
            </label>
            <input
              type="text"
              value={draft.location || ""}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="e.g. Bangkok, Thailand (Hybrid)"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Logo / Icon URL
            </label>
            <input
              type="text"
              value={draft.logoUrl || ""}
              onChange={(e) => setDraft({ ...draft, logoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>
        </div>
      </div>

      {/* 2. Roles Sub-Editor Card */}
      <div className="rounded-xl border border-rule bg-paper p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-rule">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono">
              Employment Roles ({draft.roles.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={handleAddRole}
            className="inline-flex items-center gap-1 text-xs text-accent hover:opacity-80 transition cursor-pointer font-medium font-mono"
          >
            <Plus className="size-3" />
            <span>Add Role</span>
          </button>
        </div>

        {draft.roles.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted border border-dashed border-rule rounded-lg">
            No roles recorded. Click &ldquo;Add Role&rdquo; to add a job position.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {draft.roles.map((role, idx) => (
              <div
                key={role.id}
                className="group relative rounded-xl border border-rule bg-paper p-4 flex flex-col gap-3 hover:border-ink/30 transition shadow-2xs"
              >
                {/* Border-Integrated Corner Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < draft.roles.length - 1}
                  onMoveUp={() => handleMoveRole(idx, "up")}
                  onMoveDown={() => handleMoveRole(idx, "down")}
                  onDelete={() => handleDeleteRole(idx)}
                  deleteTitle="Delete role"
                />

                {/* Top Row: Role Header */}
                <div className="flex items-center gap-2 pr-32">
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    Role #{idx + 1}
                  </span>
                  {role.title ? (
                    <span className="font-medium text-xs text-ink truncate">
                      — {role.title}
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleUpdateRole(idx, { title: e.target.value })}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      Employment Type
                    </label>
                    <input
                      type="text"
                      value={role.employmentType || ""}
                      onChange={(e) => handleUpdateRole(idx, { employmentType: e.target.value })}
                      placeholder="e.g. Full-Time / Contract"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono text-ink focus:border-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      Role Location
                    </label>
                    <input
                      type="text"
                      value={role.location || ""}
                      onChange={(e) => handleUpdateRole(idx, { location: e.target.value })}
                      placeholder="e.g. Remote (Asia/Bangkok)"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono text-ink focus:border-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={role.startDate}
                      onChange={(e) => handleUpdateRole(idx, { startDate: e.target.value })}
                      placeholder="e.g. Oct 2024"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono text-ink focus:border-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={role.endDate || ""}
                      onChange={(e) => handleUpdateRole(idx, { endDate: e.target.value })}
                      placeholder="e.g. Present or Dec 2025"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono text-ink focus:border-ink outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                      Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={(role.skills || []).join(", ")}
                      onChange={(e) =>
                        handleUpdateRole(idx, {
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="React, TypeScript, Node.js"
                      className="w-full rounded border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono text-ink focus:border-ink outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                    Responsibilities & Achievements Description
                  </label>
                  <textarea
                    value={role.description || ""}
                    onChange={(e) => handleUpdateRole(idx, { description: e.target.value })}
                    rows={3}
                    placeholder="Key architectural impact, platforms engineered, or team leadership..."
                    className="w-full rounded border border-rule bg-paper p-2.5 text-xs text-ink focus:border-ink outline-none resize-y"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
