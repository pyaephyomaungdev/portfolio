import { Plus, GraduationCap, ExternalLink, Edit3 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { Education } from "../../../../types/portfolio";

interface EducationCardListProps {
  education: Education[];
  onSelectEducation: (id: string) => void;
  onAddEducation: () => void;
  onChange: (education: Education[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function EducationCardList({
  education,
  onSelectEducation,
  onAddEducation,
  onChange,
  onRequestDelete,
}: EducationCardListProps) {
  function moveEducation(index: number, direction: "up" | "down") {
    onChange(reorderArray(education, index, direction));
  }

  function handleDelete(edu: Education) {
    const doDelete = () => onChange(education.filter((e) => e.id !== edu.id));
    if (onRequestDelete) {
      onRequestDelete(edu.degree || edu.school || "Education", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Education</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Academic Background ({education.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Degrees, universities, fields of study, and academic timelines.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddEducation}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <GraduationCap className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No education records yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Click &ldquo;Add Education&rdquo; to record university degrees and academic achievements.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {education.map((edu, idx) => (
              <div
                key={edu.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < education.length - 1}
                  onMoveUp={() => moveEducation(idx, "up")}
                  onMoveDown={() => moveEducation(idx, "down")}
                  onDelete={() => handleDelete(edu)}
                  deleteTitle="Delete education record"
                />

                {/* Top Row: School & Timeline */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 pr-32">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {edu.school}
                  </span>
                  {edu.startDate || edu.endDate ? (
                     <span className="font-mono text-xs text-muted shrink-0">
                      • {[edu.startDate, edu.endDate || "Present"].filter(Boolean).join(" — ")}
                    </span>
                  ) : null}
                  {edu.field ? (
                    <span className="rounded bg-soft px-1.5 py-0.5 text-xs font-mono text-muted border border-rule">
                      {edu.field}
                    </span>
                  ) : null}
                </div>

                {/* Middle Row: Degree, Description & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                        {edu.degree || "Degree Unspecified"}
                      </h3>
                      {edu.description ? (
                        <p className="text-xs text-muted leading-relaxed line-clamp-1 truncate max-w-xl">
                          — {edu.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    {edu.url ? (
                      <a
                        href={edu.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition"
                        title="Open university website"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onSelectEducation(edu.id)}
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
