import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { Education } from "../../../types/portfolio";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (education: Education) => void;
}

export function AddEducationModal({ isOpen, onClose, onAdd }: AddEducationModalProps) {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit() {
    if (!school.trim()) return;
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: school.trim(),
      degree: degree.trim() || null,
      field: field.trim() || null,
      startDate: startDate.trim() || null,
      endDate: endDate.trim() || null,
      description: description.trim() || null,
      url: url.trim() || null,
    };
    onAdd(newEdu);
    setSchool("");
    setDegree("");
    setField("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setUrl("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Education"
      eyebrow="// NEW EDUCATION"
      onSubmit={handleSubmit}
      submitLabel="Add Education"
      submitDisabled={!school.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            School / University *
          </label>
          <input
            type="text"
            placeholder="e.g. University of Computer Studies, Yangon"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Degree
            </label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Computer Science"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Field of Study
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineering"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Start Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2017"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              End Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2021"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Description / Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Activities, societies, honors, thesis, or coursework..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition resize-y font-sans leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Website / URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
      </div>
    </AdminModal>
  );
}
