import { useState } from "react";
import { Plus, Trash2, Search, FileText, ChevronDown, Copy } from "lucide-react";
import { Checkbox } from "../Checkbox";
import { BuyMeACoffeeIcon } from "../../BuyMeACoffeeButton";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import { ProjectDetailEditor } from "../ProjectDetailEditor";
import type { Project } from "../../../types/portfolio";

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  onOpenAddModal: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ProjectsSection({
  projects,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "featured" | "casestudy">("all");
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);

  function moveProject(index: number, direction: "up" | "down") {
    onChange(reorderArray(projects, index, direction));
  }

  function handleDuplicateProject(proj: Project) {
    const newId = `proj-${Date.now()}`;
    const newSlug = `${proj.slug}-copy`;
    const duplicate: Project = {
      ...proj,
      id: newId,
      slug: newSlug,
      title: `${proj.title} (Copy)`,
    };
    const idx = projects.findIndex((p) => p.id === proj.id);
    const updated = [...projects];
    updated.splice(idx + 1, 0, duplicate);
    onChange(updated);
  }

  function handleDeleteProject(proj: Project) {
    const doDelete = () => onChange(projects.filter((p) => p.id !== proj.id));
    if (onRequestDelete) {
      onRequestDelete(proj.title || "Project", doDelete);
    } else {
      doDelete();
    }
  }

  const filteredProjects = projects.filter((proj) => {
    if (filterMode === "featured" && !proj.featured) return false;
    if (filterMode === "casestudy" && !proj.caseStudy) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      proj.title.toLowerCase().includes(q) ||
      proj.slug.toLowerCase().includes(q) ||
      proj.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Selected Projects ({projects.length})</h2>
          <p className="text-xs text-muted mt-0.5">Showcase work, technical case studies, and live repositories.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Filter projects by title, slug, or tech stack..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`rounded-lg px-2.5 py-1.5 border transition cursor-pointer ${
              filterMode === "all"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-muted border-rule hover:border-ink/40 hover:text-ink"
            }`}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("featured")}
            className={`rounded-lg px-2.5 py-1.5 border transition cursor-pointer ${
              filterMode === "featured"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-muted border-rule hover:border-ink/40 hover:text-ink"
            }`}
          >
            Featured ({projects.filter((p) => p.featured).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("casestudy")}
            className={`rounded-lg px-2.5 py-1.5 border transition cursor-pointer ${
              filterMode === "casestudy"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-muted border-rule hover:border-ink/40 hover:text-ink"
            }`}
          >
            Case Study ({projects.filter((p) => p.caseStudy).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
            {searchQuery ? `No projects match "${searchQuery}"` : "No projects configured yet."}
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const realIdx = projects.findIndex((p) => p.id === proj.id);
            return (
              <div key={proj.id} className="p-4 rounded-xl border border-rule bg-paper space-y-3 transition hover:border-ink/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Reorder Buttons */}
                    <ReorderButtons
                      canMoveUp={realIdx > 0}
                      canMoveDown={realIdx < projects.length - 1}
                      onMoveUp={() => moveProject(realIdx, "up")}
                      onMoveDown={() => moveProject(realIdx, "down")}
                    />

                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[realIdx] = { ...proj, title: e.target.value };
                        onChange(updated);
                      }}
                      className="font-display text-lg font-bold bg-transparent border-b border-transparent focus:border-ink outline-none"
                    />
                    {proj.featured && (
                      <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-mono text-accent">
                        Featured
                      </span>
                    )}
                    {proj.buyMeACoffee && (
                      <span className="rounded bg-accent-soft text-accent px-1.5 py-0.5 text-xs font-mono border border-accent/20 flex items-center gap-1.5">
                        <BuyMeACoffeeIcon className="h-3 w-3 shrink-0" />
                        <span>BMC</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Checkbox
                      checked={proj.featured}
                      onChange={(checked) => {
                        const updated = [...projects];
                        updated[realIdx] = { ...proj, featured: checked };
                        onChange(updated);
                      }}
                      label="Featured"
                    />
                    <Checkbox
                      checked={Boolean(proj.buyMeACoffee)}
                      onChange={(checked) => {
                        const updated = [...projects];
                        updated[realIdx] = { ...proj, buyMeACoffee: checked };
                        onChange(updated);
                      }}
                      label="Buy Me a Coffee"
                    />
                    <button
                      type="button"
                      onClick={() => handleDuplicateProject(proj)}
                      title="Duplicate Project (Clone)"
                      className="p-1 text-muted hover:text-ink cursor-pointer transition"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj)}
                      title="Delete Project"
                      className="p-1 text-muted hover:text-destructive cursor-pointer transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-xs font-mono text-muted uppercase">Slug</span>
                <input
                  type="text"
                  value={proj.slug}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[realIdx] = { ...proj, slug: e.target.value };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-soft px-2 py-1 font-mono text-ink outline-none focus:border-ink"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">Live URL</span>
                <input
                  type="text"
                  value={proj.url || ""}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[realIdx] = { ...proj, url: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-soft px-2 py-1 text-ink outline-none focus:border-ink"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">GitHub Repo URL</span>
                <input
                  type="text"
                  value={proj.repoUrl || ""}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[realIdx] = { ...proj, repoUrl: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-soft px-2 py-1 text-ink outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-muted uppercase">Summary</span>
              <textarea
                rows={2}
                value={proj.summary || ""}
                onChange={(e) => {
                  const updated = [...projects];
                  updated[realIdx] = { ...proj, summary: e.target.value || null };
                  onChange(updated);
                }}
                className="w-full rounded border border-rule bg-soft px-2 py-1 text-xs text-ink outline-none focus:border-ink resize-y"
              />
            </div>

            <div>
              <span className="text-xs font-mono text-muted uppercase">Tech Stack (comma separated)</span>
              <input
                type="text"
                value={proj.techStack.join(", ")}
                onChange={(e) => {
                  const updated = [...projects];
                  updated[realIdx] = {
                    ...proj,
                    techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  };
                  onChange(updated);
                }}
                className="w-full rounded border border-rule bg-soft px-2 py-1 text-xs font-mono text-ink outline-none focus:border-ink"
              />
            </div>

            {/* Toggle Project Detail & Case Study Editor */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setExpandedDetailId(expandedDetailId === proj.id ? null : proj.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition cursor-pointer shadow-2xs ${
                  expandedDetailId === proj.id
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink border-rule hover:border-ink"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{expandedDetailId === proj.id ? "Hide Details & Case Study" : "Edit Details & Case Study"}</span>
                {proj.caseStudy && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                      expandedDetailId === proj.id ? "bg-white/20 text-paper" : "bg-accent-soft text-accent"
                    }`}
                  >
                    Case Study
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    expandedDetailId === proj.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Expanded Project Details & Case Study Editor */}
            {expandedDetailId === proj.id && (
              <div className="pt-2 border-t border-rule/60">
                <ProjectDetailEditor
                  project={proj}
                  onChange={(updated) => {
                    const next = [...projects];
                    next[realIdx] = updated;
                    onChange(next);
                  }}
                />
              </div>
            )}
          </div>
        );
      }))}
      </div>
    </div>
  );
}
