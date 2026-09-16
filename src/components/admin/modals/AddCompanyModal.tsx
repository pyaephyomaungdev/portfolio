import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { ExperienceCompany } from "../../../types/portfolio";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (company: ExperienceCompany) => void;
}

export function AddCompanyModal({ isOpen, onClose, onAdd }: AddCompanyModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [initialRoleTitle, setInitialRoleTitle] = useState("");
  const [initialRoleDescription, setInitialRoleDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [skills, setSkills] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    const companyId = `comp-${Date.now()}`;
    const newCompany: ExperienceCompany = {
      id: companyId,
      name: name.trim(),
      logoUrl: null,
      location: location.trim() || null,
      sortOrder: 0,
      roles: initialRoleTitle.trim()
        ? [
            {
              id: `role-${Date.now()}`,
              companyId,
              title: initialRoleTitle.trim(),
              employmentType: null,
              startDate: startDate.trim() || "Present",
              endDate: endDate.trim() || null,
              location: location.trim() || null,
              description: initialRoleDescription.trim() || null,
              skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
              sortOrder: 0,
            },
          ]
        : [],
    };

    onAdd(newCompany);
    setName("");
    setLocation("");
    setInitialRoleTitle("");
    setInitialRoleDescription("");
    setStartDate("");
    setEndDate("");
    setSkills("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Work Experience"
      eyebrow="// NEW COMPANY"
      onSubmit={handleSubmit}
      submitLabel="Add Company"
      submitDisabled={!name.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Company / Organization *</label>
          <input
            type="text"
            placeholder="e.g. Studio Next Steps Pte. Ltd"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Singapore (Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>

        <div className="border-t border-rule pt-3 mt-3">
          <span className="block text-xs font-mono uppercase tracking-wider text-ink font-semibold mb-2">
            Initial Position / Role (Optional)
          </span>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">Role Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={initialRoleTitle}
                onChange={(e) => setInitialRoleTitle(e.target.value)}
                className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Jun 2023"
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
              <label className="block text-xs font-mono uppercase text-muted mb-1">
                Description / Responsibilities (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe key responsibilities or achievements..."
                value={initialRoleDescription}
                onChange={(e) => setInitialRoleDescription(e.target.value)}
                className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition resize-y font-sans leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">Skills (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, TypeScript, Node.js"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
