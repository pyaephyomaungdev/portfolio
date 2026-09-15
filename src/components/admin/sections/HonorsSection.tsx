import { Plus, Trash2 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { Honor } from "../../../types/portfolio";

interface HonorsSectionProps {
  honors: Honor[];
  onChange: (honors: Honor[]) => void;
  onOpenAddModal: () => void;
}

export function HonorsSection({ honors, onChange, onOpenAddModal }: HonorsSectionProps) {
  function moveHonor(index: number, direction: "up" | "down") {
    onChange(reorderArray(honors, index, direction));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Honors & Awards ({honors.length})</h2>
          <p className="text-xs text-muted mt-0.5">
            Recognitions, hackathons, and professional distinctions.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Honor</span>
        </button>
      </div>

      <div className="space-y-3">
        {honors.map((h, idx) => (
          <div key={h.id} className="p-4 rounded-xl border border-rule bg-paper space-y-2">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <ReorderButtons
                  canMoveUp={idx > 0}
                  canMoveDown={idx < honors.length - 1}
                  onMoveUp={() => moveHonor(idx, "up")}
                  onMoveDown={() => moveHonor(idx, "down")}
                />
                <input
                  type="text"
                  value={h.title}
                  onChange={(e) => {
                    const updated = [...honors];
                    updated[idx] = { ...h, title: e.target.value };
                    onChange(updated);
                  }}
                  className="font-semibold text-base text-ink bg-transparent border-b border-transparent focus:border-ink outline-none flex-1 min-w-0"
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(honors.filter((_, i) => i !== idx))}
                className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-soft rounded transition cursor-pointer shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-xs font-mono text-muted uppercase">Issuer</span>
                <input
                  type="text"
                  value={h.issuer || ""}
                  placeholder="Issuer or organization"
                  onChange={(e) => {
                    const updated = [...honors];
                    updated[idx] = { ...h, issuer: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-white px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">Date / Year</span>
                <input
                  type="text"
                  value={h.date || ""}
                  placeholder="e.g. 2024"
                  onChange={(e) => {
                    const updated = [...honors];
                    updated[idx] = { ...h, date: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-white px-2.5 py-1.5 font-mono outline-none focus:border-ink"
                />
              </div>
            </div>
            <div>
              <span className="text-xs font-mono text-muted uppercase">Description</span>
              <textarea
                rows={2}
                value={h.description || ""}
                onChange={(e) => {
                  const updated = [...honors];
                  updated[idx] = { ...h, description: e.target.value || null };
                  onChange(updated);
                }}
                className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-xs outline-none focus:border-ink"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
