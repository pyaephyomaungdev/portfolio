import { Plus, Trash2 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { Stat } from "../../../types/portfolio";

interface StatsSectionProps {
  stats: Stat[];
  onChange: (stats: Stat[]) => void;
  onOpenAddModal: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function StatsSection({
  stats,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: StatsSectionProps) {
  function moveStat(index: number, direction: "up" | "down") {
    onChange(reorderArray(stats, index, direction));
  }

  function handleDeleteStat(idx: number, label: string) {
    const doDelete = () => onChange(stats.filter((_, i) => i !== idx));
    if (onRequestDelete) {
      onRequestDelete(label || "Stat", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Key Stats ({stats.length})</h2>
          <p className="text-xs text-muted mt-0.5">Metrics displayed on the home page header.</p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Stat</span>
        </button>
      </div>

      {stats.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
          No key stats configured yet. Click "Add Stat" above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((s, idx) => (
            <div key={s.id} className="p-3.5 rounded-lg border border-rule bg-paper flex items-center justify-between gap-3">
              <ReorderButtons
                canMoveUp={idx > 0}
                canMoveDown={idx < stats.length - 1}
                onMoveUp={() => moveStat(idx, "up")}
                onMoveDown={() => moveStat(idx, "down")}
              />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-mono text-muted uppercase">Label</span>
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx] = { ...s, label: e.target.value };
                      onChange(updated);
                    }}
                    className="w-full bg-transparent font-medium text-sm text-ink border-b border-transparent focus:border-ink outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono text-muted uppercase">Value</span>
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx] = { ...s, value: e.target.value };
                      onChange(updated);
                    }}
                    className="w-full bg-transparent font-mono text-sm text-ink border-b border-transparent focus:border-ink outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                title="Delete stat"
                onClick={() => handleDeleteStat(idx, s.label)}
                className="p-1 text-muted hover:text-destructive cursor-pointer transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
