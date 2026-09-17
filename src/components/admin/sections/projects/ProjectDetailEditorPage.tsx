import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  Star,
  Code2,
} from "lucide-react";
import { Checkbox } from "../../Checkbox";
import { WebEditor } from "../../WebEditor";
import { ProjectDetailEditor } from "../../ProjectDetailEditor";
import { BuyMeACoffeeIcon } from "../../../BuyMeACoffeeButton";
import type { Project } from "../../../../types/portfolio";

interface ProjectDetailEditorPageProps {
  project: Project;
  onSave: (updated: Project) => void;
  onCancel: () => void;
  onDelete?: (project: Project) => void;
}

export function ProjectDetailEditorPage({
  project,
  onSave,
  onCancel,
  onDelete,
}: ProjectDetailEditorPageProps) {
  const [draft, setDraft] = useState<Project>({ ...project });
  const [categoryInput, setCategoryInput] = useState(
    (draft.categories || []).join(", ")
  );
  const [techInput, setTechInput] = useState(draft.techStack.join(", "));

  function handleSave() {
    const categories = categoryInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const techStack = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      ...draft,
      categories,
      techStack,
    });
  }

  const [activeTab, setActiveTab] = useState<"general" | "narrative" | "casestudy">("general");

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky Header with Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rule">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono font-medium text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Projects List</span>
          </button>
          <span className="text-muted text-xs">/</span>
          <h2 className="font-display text-xl font-bold text-ink truncate max-w-sm sm:max-w-md">
            {draft.title || "Untitled Project"}
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

      {/* Tab Navigation (Underline Tabs) */}
      <div className="flex items-center gap-6 border-b border-rule font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`inline-flex items-center gap-2 pb-2.5 font-medium transition cursor-pointer border-b-2 -mb-px ${
            activeTab === "general"
              ? "border-accent text-ink font-semibold"
              : "border-transparent text-muted hover:text-ink hover:border-rule"
          }`}
        >
          <Layers className="size-3.5 text-accent" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("narrative")}
          className={`inline-flex items-center gap-2 pb-2.5 font-medium transition cursor-pointer border-b-2 -mb-px ${
            activeTab === "narrative"
              ? "border-accent text-ink font-semibold"
              : "border-transparent text-muted hover:text-ink hover:border-rule"
          }`}
        >
          <Sparkles className="size-3.5 text-accent" />
          <span>Narrative</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("casestudy")}
          className={`inline-flex items-center gap-2 pb-2.5 font-medium transition cursor-pointer border-b-2 -mb-px ${
            activeTab === "casestudy"
              ? "border-accent text-ink font-semibold"
              : "border-transparent text-muted hover:text-ink hover:border-rule"
          }`}
        >
          <Code2 className="size-3.5 text-accent" />
          <span>Case Study & Blueprint</span>
          {draft.caseStudy ? (
            <span className="size-1.5 rounded-full bg-accent" />
          ) : null}
        </button>
      </div>

      {/* Tab 1: General Information & Configuration */}
      {activeTab === "general" ? (
        <div className="rounded-xl border border-rule bg-paper p-5 sm:p-7 shadow-xs space-y-6">
          {/* 1. Core Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-accent" />
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                Core Project Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. DeskKit Vault"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="e.g. deskkit-vault"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Timeline / Period
                </label>
                <input
                  type="text"
                  value={draft.period || ""}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                  placeholder="e.g. 2025 — Present"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Primary Language
                </label>
                <input
                  type="text"
                  value={draft.language || ""}
                  onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                  placeholder="e.g. TypeScript"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>

          {/* 2. Links & Deployment */}
          <div className="space-y-4 pt-6 border-t border-rule/50">
            <div className="flex items-center gap-2">
              <ExternalLink className="size-4 text-accent" />
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                Links & Deployment
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Live Application URL
                </label>
                <input
                  type="text"
                  value={draft.url || ""}
                  onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Source Code Repository URL
                </label>
                <input
                  type="text"
                  value={draft.repoUrl || ""}
                  onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>

          {/* 3. Flags & Badges */}
          <div className="space-y-4 pt-6 border-t border-rule/50">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-accent" />
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                Flags & Badges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2.5 rounded-lg border border-rule p-3 bg-soft/20 cursor-pointer hover:border-ink/40 transition">
                <Checkbox
                  checked={draft.featured}
                  onChange={(val) => setDraft({ ...draft, featured: val })}
                />
                <div>
                  <span className="text-xs font-semibold text-ink block">Featured Project</span>
                  <span className="text-xs text-muted block">Showcase prominently on homepage</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 rounded-lg border border-rule p-3 bg-soft/20 cursor-pointer hover:border-ink/40 transition">
                <Checkbox
                  checked={Boolean(draft.isOpenSource)}
                  onChange={(val) => setDraft({ ...draft, isOpenSource: val })}
                />
                <div>
                  <span className="text-xs font-semibold text-ink block">Open Source</span>
                  <span className="text-xs text-muted block">Display public repo badge</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 rounded-lg border border-rule p-3 bg-soft/20 cursor-pointer hover:border-ink/40 transition">
                <Checkbox
                  checked={Boolean(draft.buyMeACoffee)}
                  onChange={(val) => setDraft({ ...draft, buyMeACoffee: val })}
                />
                <div className="flex items-center gap-2">
                  <BuyMeACoffeeIcon className="size-4 text-accent shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-ink block">Buy Me A Coffee</span>
                    <span className="text-xs text-muted block">Show support button on detail</span>
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                Custom Badge Label (Optional)
              </label>
              <input
                type="text"
                value={draft.badge || ""}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                placeholder="e.g. In Production, Beta, Award Winner"
                className="w-full sm:w-80 rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
              />
            </div>
          </div>

          {/* 4. Taxonomy & Tech Stack */}
          <div className="space-y-4 pt-6 border-t border-rule/50">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-accent" />
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                Taxonomy & Tech Stack
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Categories (Comma Separated)
                </label>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="e.g. Systems Architecture, Developer Tools, Privacy"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
                  Tech Stack Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, Tailwind CSS, Vite"
                  className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tab 2: Narrative & Deep-Dive Documentation */}
      {activeTab === "narrative" ? (
        <div className="rounded-xl border border-rule bg-paper p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
              Summary & Markdown Narrative
            </h3>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Elevator Pitch Summary
            </label>
            <textarea
              value={draft.summary || ""}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              rows={2}
              placeholder="A concise, high-impact one-sentence description of the project..."
              className="w-full rounded-lg border border-rule bg-soft/40 p-3 text-xs text-ink outline-none focus:border-ink resize-y"
            />
          </div>

          <div className="pt-6 border-t border-rule/50">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-2">
              Full Project Narrative / Documentation
            </label>
            <WebEditor
              value={draft.body || ""}
              onChange={(body) => setDraft({ ...draft, body })}
              placeholder="Deep dive documentation in markdown..."
              minHeight="min-h-64"
            />
          </div>
        </div>
      ) : null}

      {/* Tab 3: Case Study & Technical Architecture */}
      {activeTab === "casestudy" ? (
        <div className="rounded-xl border border-rule bg-paper p-5 sm:p-6 shadow-xs">
          <ProjectDetailEditor
            project={draft}
            onChange={(updated) => setDraft(updated)}
          />
        </div>
      ) : null}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-rule">
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
  );
}
