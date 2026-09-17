import { Plus } from "lucide-react";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Hero Metrics</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Key Stats ({stats.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Metrics and milestones highlighted on the homepage header.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
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
            <div key={s.id} className="p-4 rounded-xl border border-rule bg-paper flex items-center justify-between gap-3 shadow-2xs">
              <ReorderButtons
                canMoveUp={idx > 0}
                canMoveDown={idx < stats.length - 1}
                onMoveUp={() => moveStat(idx, "up")}
                onMoveDown={() => moveStat(idx, "down")}
                onDelete={() => handleDeleteStat(idx, s.label)}
                deleteTitle="Delete stat"
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
                    className="w-full bg-transparent font-sans text-sm text-ink border-b border-transparent focus:border-ink outline-none"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
