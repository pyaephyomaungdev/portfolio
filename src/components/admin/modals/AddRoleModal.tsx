import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { ExperienceRole } from "../../../types/portfolio";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string;
  onAdd: (companyId: string, role: ExperienceRole) => void;
}

export function AddRoleModal({
  isOpen,
  onClose,
  companyName,
  companyId,
  onAdd,
}: AddRoleModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");

  function handleSubmit() {
    if (!title.trim() || !companyId) return;
    const newRole: ExperienceRole = {
      id: `role-${Date.now()}`,
      companyId,
      title: title.trim(),
      employmentType: null,
      startDate: startDate.trim() || "Present",
      endDate: endDate.trim() || null,
      location: location.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      sortOrder: 0,
    };

    onAdd(companyId, newRole);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setSkills("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Role at ${companyName}`}
      eyebrow="// NEW POSITION"
      onSubmit={handleSubmit}
      submitLabel="Add Position"
      submitDisabled={!title.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Position / Role Title *</label>
          <input
            type="text"
            placeholder="e.g. Lead Frontend Architect"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">Start Date *</label>
            <input
              type="text"
              placeholder="e.g. Jan 2024"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">End Date</label>
            <input
              type="text"
              placeholder="e.g. Present"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Location / Working Style</label>
          <input
            type="text"
            placeholder="e.g. Remote / Bangkok"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Skills (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. React, Next.js, Tailwind CSS, TypeScript"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
          />
        </div>
      </div>
    </AdminModal>
  );
}
