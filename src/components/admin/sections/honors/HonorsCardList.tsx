import { Plus, Award, ExternalLink, Edit3 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { Honor } from "../../../../types/portfolio";

interface HonorsCardListProps {
  honors: Honor[];
  onSelectHonor: (id: string) => void;
  onAddHonor: () => void;
  onChange: (honors: Honor[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function HonorsCardList({
  honors,
  onSelectHonor,
  onAddHonor,
  onChange,
  onRequestDelete,
}: HonorsCardListProps) {
  function moveHonor(index: number, direction: "up" | "down") {
    onChange(reorderArray(honors, index, direction));
  }

  function handleDelete(honor: Honor) {
    const doDelete = () => onChange(honors.filter((h) => h.id !== honor.id));
    if (onRequestDelete) {
      onRequestDelete(honor.title || "Honor entry", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Honors &amp; Distinctions</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Honors &amp; Awards ({honors.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Hackathon championships, competitive achievements, and technical honors.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddHonor}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Award</span>
        </button>
      </div>

      {honors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <Award className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No honors or awards yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Click &ldquo;Add Award&rdquo; to highlight hackathons, technical recognitions, and distinctions.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {honors.map((honor, idx) => (
              <div
                key={honor.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < honors.length - 1}
                  onMoveUp={() => moveHonor(idx, "up")}
                  onMoveDown={() => moveHonor(idx, "down")}
                  onDelete={() => handleDelete(honor)}
                  deleteTitle="Delete award record"
                />

                {/* Top Row: Issuer & Date */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 pr-32">
                  <span className="font-mono text-xs font-semibold text-accent truncate max-w-48">
                    {honor.issuer || "Independent Award"}
                  </span>
                  {honor.date ? (
                    <span className="font-mono text-xs text-muted shrink-0">
                      • {honor.date}
                    </span>
                  ) : null}
                </div>

                {/* Middle Row: Title, Description & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                        {honor.title}
                      </h3>
                      {honor.description ? (
                        <p className="text-xs text-muted leading-relaxed line-clamp-1 truncate max-w-xl">
                          — {honor.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    {honor.url ? (
                      <a
                        href={honor.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition"
                        title="Open verification or announcement URL"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onSelectHonor(honor.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs ml-1"
                    >
                      <Edit3 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
