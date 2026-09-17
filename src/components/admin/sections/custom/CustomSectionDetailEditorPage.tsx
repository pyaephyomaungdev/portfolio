import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
  PenTool,
  Plus,
  Grid,
  ListFilter,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { WebEditor } from "../../WebEditor";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { CustomSection, CustomSectionItem } from "../../../../types/portfolio";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateMiddle(text: string, maxLength = 17): string {
  if (!text || text.length <= maxLength) return text;
  const frontChars = 6;
  const backChars = Math.max(4, maxLength - frontChars - 3);
  return `${text.slice(0, frontChars)}...${text.slice(-backChars)}`;
}

interface CustomSectionDetailEditorPageProps {
  section: CustomSection;
  onSave: (updated: CustomSection) => void;
  onCancel: () => void;
  onDelete?: (section: CustomSection) => void;
}

export function CustomSectionDetailEditorPage({
  section,
  onSave,
  onCancel,
  onDelete,
}: CustomSectionDetailEditorPageProps) {
  const [draft, setDraft] = useState<CustomSection>({ ...section });
  const [expandedContentIds, setExpandedContentIds] = useState<Record<string, boolean>>({});

  function toggleExpandedContent(id: string) {
    setExpandedContentIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSave() {
    onSave(draft);
  }

  function handleAddItem() {
    const defaultTitle = "New Item Title";
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: defaultTitle,
      slug: slugify(defaultTitle) || `item-${Date.now()}`,
      subtitle: "Category / Subtitle",
      description: "Brief summary or key takeaways for this item.",
      content: "",
      url: "",
      tag: "Featured",
      date: `${new Date().getFullYear()}`,
    };
    setDraft({ ...draft, items: [...(draft.items || []), newItem] });
  }

  function handleUpdateItem(index: number, updates: Partial<CustomSectionItem>) {
    const updatedItems = (draft.items || []).map((it, idx) =>
      idx === index ? { ...it, ...updates } : it
    );
    setDraft({ ...draft, items: updatedItems });
  }

  function handleDeleteItem(index: number) {
    const updatedItems = (draft.items || []).filter((_, idx) => idx !== index);
    setDraft({ ...draft, items: updatedItems });
  }

  function handleMoveItem(index: number, direction: "up" | "down") {
    if (!draft.items) return;
    setDraft({ ...draft, items: reorderArray(draft.items, index, direction) });
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
            <span>Custom Sections List</span>
          </button>
          <span className="text-muted text-xs">/</span>
          <h2 className="font-display text-xl font-bold text-ink truncate max-w-sm sm:max-w-md">
            {draft.title || "New Custom Section"}
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

      {/* 1. Core Section Settings Card */}
      <div className="rounded-xl border border-rule bg-paper p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-rule">
          <PenTool className="size-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono">
            Section Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1.5">
              Section Title *
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Architectural Writing & Research"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-xs font-medium text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1.5">
              Descriptive Subtitle
            </label>
            <input
              type="text"
              value={draft.subtitle || ""}
              onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
              placeholder="e.g. Technical essays on zero-backend architecture"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-xs font-medium text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        {/* Layout Mode Selector */}
        <div>
          <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-2">
            Presentation Layout
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "cards",
                name: "Cards Grid",
                desc: "2-column responsive cards",
                icon: Grid,
              },
              {
                id: "list",
                name: "Item List",
                desc: "Chronological vertical list",
                icon: ListFilter,
              },
              {
                id: "prose",
                name: "Prose Document",
                desc: "Long-form markdown essay",
                icon: FileText,
              },
            ].map((layoutOption) => {
              const Icon = layoutOption.icon;
              const isSelected = draft.layout === layoutOption.id;

              return (
                <button
                  key={layoutOption.id}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      layout: layoutOption.id as "cards" | "list" | "prose",
                    })
                  }
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "border-ink bg-soft/80 shadow-xs"
                      : "border-rule bg-paper hover:border-ink/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-accent" />
                    <span className="text-xs font-semibold text-ink">
                      {layoutOption.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted mt-1 leading-snug">
                    {layoutOption.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Web Editor for Section Content */}
        <div>
          <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1.5">
            {draft.layout === "prose" ? "Document Content (Markdown) *" : "Introductory Context (Optional)"}
          </label>
          <WebEditor
            value={draft.content || ""}
            onChange={(content) => setDraft({ ...draft, content })}
            placeholder={
              draft.layout === "prose"
                ? "Draft your essay or thoughts in markdown format..."
                : "Optional brief context note displayed above the cards or list..."
            }
            minHeight={draft.layout === "prose" ? "min-h-56" : "min-h-32"}
          />
        </div>
      </div>

      {/* 2. Items Manager (Cards or List Layout) */}
      {draft.layout !== "prose" ? (
        <div className="rounded-xl border border-rule bg-paper p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-rule">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono">
              Section Items ({draft.items?.length || 0})
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs text-accent hover:opacity-80 transition cursor-pointer font-medium font-mono"
            >
              <Plus className="size-3" />
              <span>Add Item</span>
            </button>
          </div>

          {!draft.items || draft.items.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted border border-dashed border-rule rounded-lg">
              No items added yet. Click &ldquo;Add Item&rdquo; to populate this {draft.layout}.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {draft.items.map((item, idx) => {
                const isContentExpanded = Boolean(expandedContentIds[item.id]);
                const wordCount = item.content?.trim()
                  ? item.content.trim().split(/\s+/).length
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-rule bg-paper p-4 flex flex-col gap-3 text-xs hover:border-ink/30 transition shadow-2xs"
                  >
                    {/* Border-Integrated Corner Management Notch */}
                    <ReorderButtons
                      variant="corner"
                      index={idx}
                      canMoveUp={idx > 0}
                      canMoveDown={idx < (draft.items?.length || 0) - 1}
                      onMoveUp={() => handleMoveItem(idx, "up")}
                      onMoveDown={() => handleMoveItem(idx, "down")}
                      onDelete={() => handleDeleteItem(idx)}
                      deleteTitle="Delete entry"
                    />

                    {/* Top Row: Entry Label and Badges */}
                    <div className="flex flex-wrap items-center gap-2 pr-32">
                      <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                        Entry #{idx + 1}
                      </span>
                      {item.title ? (
                        <span className="font-medium text-xs text-ink truncate max-w-xs">
                          — {item.title}
                        </span>
                      ) : null}
                      {item.content ? (
                        <span className="rounded border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-accent font-mono text-xs">
                          Detail Page Active ({wordCount} words)
                        </span>
                      ) : item.url ? (
                        <span className="rounded border border-rule bg-soft px-1.5 py-0.5 text-muted font-mono text-xs">
                          External Link Only
                        </span>
                      ) : null}
                    </div>

                    {/* Row 1: Title and Tag */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-muted mb-1">
                          Item Title *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            // If slug matches old slugified title or is empty, keep them in sync
                            const updates: Partial<CustomSectionItem> = { title: newTitle };
                            if (!item.slug || item.slug === slugify(item.title)) {
                              updates.slug = slugify(newTitle);
                            }
                            handleUpdateItem(idx, updates);
                          }}
                          placeholder="Item Title *"
                          className="w-full h-9 rounded-lg border border-rule bg-paper px-3 text-xs text-ink focus:border-ink outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-muted mb-1">
                          Tag / Pill Badge
                        </label>
                        <input
                          type="text"
                          value={item.tag || ""}
                          onChange={(e) => handleUpdateItem(idx, { tag: e.target.value })}
                          placeholder="e.g. Architecture"
                          className="w-full h-9 rounded-lg border border-rule bg-paper px-3 text-xs text-ink focus:border-ink outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Row 2: Subtitle and Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-muted mb-1">
                          Subtitle / Category
                        </label>
                        <input
                          type="text"
                          value={item.subtitle || ""}
                          onChange={(e) => handleUpdateItem(idx, { subtitle: e.target.value })}
                          placeholder="e.g. Client-Side Engineering"
                          className="w-full h-9 rounded-lg border border-rule bg-paper px-3 text-xs text-ink focus:border-ink outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-muted mb-1">
                          Date / Year
                        </label>
                        <input
                          type="text"
                          value={item.date || ""}
                          onChange={(e) => handleUpdateItem(idx, { date: e.target.value })}
                          placeholder="e.g. 2026"
                          className="w-full h-9 rounded-lg border border-rule bg-paper px-3 text-xs font-mono text-ink focus:border-ink outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 3: Slug and External URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono text-muted mb-1 flex items-center justify-between">
                          <span>Detail Page Slug</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(idx, {
                                slug: slugify(item.title) || `item-${Date.now()}`,
                              })
                            }
                            className="text-accent hover:underline font-mono text-xs cursor-pointer"
                          >
                            Sync with title
                          </button>
                        </label>
                        <div className="flex items-center h-9 rounded-lg border border-rule bg-paper px-3 text-xs focus-within:border-ink overflow-hidden">
                          <span
                            className="text-muted font-mono text-xs select-none shrink-0"
                            title={`/custom/${draft.id}/`}
                          >
                            {truncateMiddle(`/custom/${draft.id}/`, 17)}
                          </span>
                          <input
                            type="text"
                            value={item.slug || ""}
                            onChange={(e) =>
                              handleUpdateItem(idx, { slug: slugify(e.target.value) })
                            }
                            placeholder="article-slug"
                            className="min-w-0 flex-1 h-full bg-transparent font-mono text-xs text-ink outline-none pl-1.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted mb-1">
                          External URL (Optional link)
                        </label>
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => handleUpdateItem(idx, { url: e.target.value })}
                          placeholder="https://..."
                          className="w-full h-9 rounded-lg border border-rule bg-paper px-3 text-xs font-mono text-ink focus:border-ink outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 4: Summary description */}
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1">
                        Short Summary / Card Description
                      </label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => handleUpdateItem(idx, { description: e.target.value })}
                        rows={2}
                        placeholder="Brief description or key takeaways shown on the card preview..."
                        className="w-full rounded-lg border border-rule bg-paper p-2.5 text-xs text-ink focus:border-ink outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Row 5: Dedicated Long-form Detail Page Editor */}
                    <div className="border-t border-rule pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpandedContent(item.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rule bg-soft/40 px-3 py-1.5 text-xs font-mono font-medium text-ink hover:border-ink/40 transition cursor-pointer self-start sm:self-auto"
                        >
                          <FileText className="size-3.5 text-accent" />
                          <span>
                            {item.content?.trim()
                              ? `Edit Long-form Article (${wordCount} words)`
                              : "Write Long-form Article (Markdown)"}
                          </span>
                          {isContentExpanded ? (
                            <ChevronUp className="size-3 text-muted" />
                          ) : (
                            <ChevronDown className="size-3 text-muted" />
                          )}
                        </button>

                        <div className="flex items-center gap-2 text-xs font-mono text-muted">
                          {item.slug ? (
                            <span
                              className="truncate max-w-xs whitespace-nowrap"
                              title={`/custom/${draft.id}/${item.slug}`}
                            >
                              URL: /custom/{draft.id}/{item.slug}
                            </span>
                          ) : (
                            <span>Slug required for detail page</span>
                          )}
                        </div>
                      </div>

                      {isContentExpanded ? (
                        <div className="mt-3 p-3.5 rounded-xl border border-rule bg-soft/20 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-mono text-muted">
                            <span className="flex items-center gap-1.5 text-ink font-semibold">
                              <Sparkles className="size-3 text-accent" />
                              <span>Detail Page Content Editor</span>
                            </span>
                            <span>Full Markdown Supported</span>
                          </div>
                          <WebEditor
                            value={item.content || ""}
                            onChange={(content) => handleUpdateItem(idx, { content })}
                            placeholder="Draft your long-form article, architectural breakdown, or research paper in Markdown..."
                            minHeight="min-h-48"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
