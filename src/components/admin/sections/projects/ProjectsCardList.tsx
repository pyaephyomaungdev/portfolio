import { useState } from "react";
import { Plus, Search, Layers, Star, ExternalLink, Code2, Copy, Edit3, Sparkles } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import { BuyMeACoffeeIcon } from "../../../BuyMeACoffeeButton";
import type { Project } from "../../../../types/portfolio";

interface ProjectsCardListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onAddProject: () => void;
  onChange: (projects: Project[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function ProjectsCardList({
  projects,
  onSelectProject,
  onAddProject,
  onChange,
  onRequestDelete,
}: ProjectsCardListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "featured" | "casestudy">("all");

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Selected Projects</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Selected Projects ({projects.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage your engineering projects, architectural case studies, and live links.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted pointer-events-none" />
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="inline-flex rounded-lg border border-rule bg-paper p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`rounded px-2.5 py-1 transition cursor-pointer ${
              filterMode === "all" ? "bg-soft font-bold text-ink" : "text-muted hover:text-ink"
            }`}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("featured")}
            className={`rounded px-2.5 py-1 transition cursor-pointer ${
              filterMode === "featured" ? "bg-soft font-bold text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Featured ({projects.filter((p) => p.featured).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("casestudy")}
            className={`rounded px-2.5 py-1 transition cursor-pointer ${
              filterMode === "casestudy" ? "bg-soft font-bold text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Case Studies ({projects.filter((p) => p.caseStudy).length})
          </button>
        </div>
      </div>

      {/* Projects Card List Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <Layers className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No projects match your query</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Try adjusting your search filters or click &ldquo;Add Project&rdquo; to create a new one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((proj) => {
            const rawIdx = projects.findIndex((p) => p.id === proj.id);

            return (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={rawIdx}
                  canMoveUp={rawIdx > 0}
                  canMoveDown={rawIdx < projects.length - 1}
                  onMoveUp={() => moveProject(rawIdx, "up")}
                  onMoveDown={() => moveProject(rawIdx, "down")}
                  onDelete={() => handleDeleteProject(proj)}
                  deleteTitle="Delete project"
                />

                {/* Top Row: Meta Tags */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 pr-32">
                  <span className="font-mono text-xs font-semibold text-accent truncate max-w-40">
                    /{proj.slug}
                  </span>
                  {proj.language ? (
                    <span className="inline-flex items-center gap-1 rounded bg-soft px-1.5 py-0.5 text-xs font-mono text-muted border border-rule">
                      <Code2 className="size-3" />
                      {proj.language}
                    </span>
                  ) : null}
                  {proj.period ? (
                    <span className="font-mono text-xs text-muted shrink-0">
                      • {proj.period}
                    </span>
                  ) : null}

                  {proj.featured ? (
                    <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-xs font-mono font-medium text-accent border border-accent/20">
                      <Star className="size-3 fill-accent" />
                      Featured
                    </span>
                  ) : null}

                  {proj.caseStudy ? (
                    <span className="inline-flex items-center gap-1 rounded bg-success/10 px-2 py-0.5 text-xs font-mono font-medium text-success border border-success/20">
                      <Sparkles className="size-3" />
                      Case Study
                    </span>
                  ) : null}

                  {proj.isOpenSource ? (
                    <span className="inline-flex items-center gap-1 rounded bg-soft px-2 py-0.5 text-xs font-mono text-muted border border-rule">
                      Open Source
                    </span>
                  ) : null}

                  {proj.buyMeACoffee ? (
                    <span className="inline-flex items-center gap-1 rounded bg-soft px-2 py-0.5 text-xs font-mono text-accent border border-rule">
                      <BuyMeACoffeeIcon className="size-3 text-accent" />
                      BMC
                    </span>
                  ) : null}
                </div>

                {/* Middle Row: Title, Summary & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                        {proj.title}
                      </h3>
                      {proj.summary ? (
                        <p className="text-xs text-muted leading-relaxed line-clamp-1 truncate max-w-xl">
                          — {proj.summary}
                        </p>
                      ) : null}
                    </div>

                    {/* Tech Stack Chips */}
                    {proj.techStack && proj.techStack.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {proj.techStack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-soft/80 px-1.5 py-0.5 text-xs font-mono text-muted border border-rule"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.techStack.length > 6 ? (
                          <span className="text-xs font-mono text-muted">
                            +{proj.techStack.length - 6} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {/* Clean Action Cluster */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    {proj.url ? (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition"
                        title="Open external live site"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDuplicateProject(proj)}
                      className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProject(proj.id)}
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
