import { Plus, Trash2 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { Education } from "../../../types/portfolio";

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  onOpenAddModal: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function EducationSection({
  education,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: EducationSectionProps) {
  function moveEducation(index: number, direction: "up" | "down") {
    onChange(reorderArray(education, index, direction));
  }

  function handleDeleteEducation(idx: number, school: string) {
    const doDelete = () => onChange(education.filter((_, i) => i !== idx));
    if (onRequestDelete) {
      onRequestDelete(school || "Education entry", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Education ({education.length})</h2>
          <p className="text-xs text-muted mt-0.5">
            Degrees, universities, fields of study, and academic timelines.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
          No education entries configured yet. Click "Add Education" above to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={edu.id} className="p-4 rounded-xl border border-rule bg-paper space-y-2">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <ReorderButtons
                    canMoveUp={idx > 0}
                    canMoveDown={idx < education.length - 1}
                    onMoveUp={() => moveEducation(idx, "up")}
                    onMoveDown={() => moveEducation(idx, "down")}
                  />
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, school: e.target.value };
                      onChange(updated);
                    }}
                    className="font-semibold text-base text-ink bg-transparent border-b border-transparent focus:border-ink outline-none flex-1 min-w-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(idx, edu.school)}
                  className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-soft rounded transition cursor-pointer shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-xs font-mono text-muted uppercase">Degree</span>
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree || ""}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx] = { ...edu, degree: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-white px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">Field of Study</span>
                <input
                  type="text"
                  placeholder="Field of study"
                  value={edu.field || ""}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx] = { ...edu, field: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-white px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">Timeline (Start – End)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Start year"
                    value={edu.startDate || ""}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, startDate: e.target.value || null };
                      onChange(updated);
                    }}
                    className="w-1/2 rounded border border-rule bg-white px-2.5 py-1.5 font-mono outline-none focus:border-ink"
                  />
                  <input
                    type="text"
                    placeholder="End year"
                    value={edu.endDate || ""}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx] = { ...edu, endDate: e.target.value || null };
                      onChange(updated);
                    }}
                    className="w-1/2 rounded border border-rule bg-white px-2.5 py-1.5 font-mono outline-none focus:border-ink"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-mono text-muted uppercase">Website / URL</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={edu.url || ""}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx] = { ...edu, url: e.target.value || null };
                    onChange(updated);
                  }}
                  className="w-full rounded border border-rule bg-white px-2.5 py-1.5 outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="text-xs pt-1">
              <span className="text-xs font-mono text-muted uppercase block mb-1">
                Description / Notes (supports ExpandableText)
              </span>
              <textarea
                rows={2}
                placeholder="Activities, societies, honors, thesis, or coursework..."
                value={edu.description || ""}
                onChange={(e) => {
                  const updated = [...education];
                  updated[idx] = { ...edu, description: e.target.value || null };
                  onChange(updated);
                }}
                className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink resize-y font-sans leading-relaxed"
              />
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
