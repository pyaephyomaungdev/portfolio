import { useState } from "react";
import { Plus, PenTool, Edit3, Eye, EyeOff, FileText, Grid, ListFilter, Search } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { CustomSection } from "../../../../types/portfolio";

interface CustomSectionsCardListProps {
  sections: CustomSection[];
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  onChange: (sections: CustomSection[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function CustomSectionsCardList({
  sections,
  onSelectSection,
  onAddSection,
  onChange,
  onRequestDelete,
}: CustomSectionsCardListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function moveSection(index: number, direction: "up" | "down") {
    onChange(reorderArray(sections, index, direction));
  }

  function handleToggleVisible(sec: CustomSection) {
    const updated = sections.map((s) => (s.id === sec.id ? { ...s, visible: !s.visible } : s));
    onChange(updated);
  }

  function handleDelete(sec: CustomSection) {
    const doDelete = () => onChange(sections.filter((s) => s.id !== sec.id));
    if (onRequestDelete) {
      onRequestDelete(sec.title || "Custom section", doDelete);
    } else {
      doDelete();
    }
  }

  const filteredSections = sections.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      (sec.subtitle && sec.subtitle.toLowerCase().includes(q)) ||
      (sec.content && sec.content.toLowerCase().includes(q)) ||
      sec.id.toLowerCase().includes(q) ||
      sec.layout.toLowerCase().includes(q) ||
      (sec.items && sec.items.some((it) => it.title.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Custom Content</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Custom Content Blocks ({sections.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Modular homepage sections (Writing, Speaking, Open Source Labs, or personal essays).
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSection}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Search Input */}
      {sections.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Filter custom sections by title, description, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-rule bg-paper pl-9 pr-3 py-1.5 text-xs text-ink outline-none focus:border-ink font-mono placeholder:text-muted/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-mono cursor-pointer"
            >
              clear
            </button>
          )}
        </div>
      )}

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <PenTool className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No custom sections yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Click &ldquo;Add Section&rdquo; to build custom writing, speaking, or essay modules.
          </p>
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-rule text-center">
          <p className="text-sm text-muted">No custom sections match &ldquo;{searchQuery}&rdquo;</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredSections.map((sec, idx) => {
            const LayoutIcon =
              sec.layout === "prose" ? FileText : sec.layout === "list" ? ListFilter : Grid;

            return (
              <div
                key={sec.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < sections.length - 1}
                  onMoveUp={() => moveSection(idx, "up")}
                  onMoveDown={() => moveSection(idx, "down")}
                  onDelete={() => handleDelete(sec)}
                  deleteTitle="Delete section"
                />

                {/* Top Row: Meta Tags & Visibility */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 pr-32">
                  <span className="inline-flex items-center gap-1 rounded bg-soft px-2 py-0.5 text-xs font-mono text-muted border border-rule">
                    <LayoutIcon className="size-3 text-accent" />
                    {sec.layout}
                  </span>
                  {sec.layout !== "prose" ? (
                    <span className="text-xs font-mono text-muted">
                      • {sec.items?.length || 0} {sec.items?.length === 1 ? "entry" : "entries"}
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleToggleVisible(sec)}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono border transition cursor-pointer ${
                      sec.visible
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted/10 text-muted border-muted/20"
                    }`}
                    title="Toggle section visibility"
                  >
                    {sec.visible ? (
                      <>
                        <Eye className="size-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Middle Row: Title, Content & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2 flex-wrap min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                      {sec.title}
                    </h3>
                    {sec.subtitle ? (
                      <span className="text-xs text-muted font-mono">({sec.subtitle})</span>
                    ) : null}
                    {sec.content ? (
                      <p className="text-xs text-muted leading-relaxed line-clamp-1 truncate max-w-xl">
                        — {sec.content}
                      </p>
                    ) : null}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    <button
                      type="button"
                      onClick={() => onSelectSection(sec.id)}
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
