import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { Honor } from "../../../types/portfolio";

interface AddHonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (honor: Honor) => void;
}

export function AddHonorModal({ isOpen, onClose, onAdd }: AddHonorModalProps) {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;
    const newHonor: Honor = {
      id: `honor-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim() || null,
      date: date.trim() || null,
      description: description.trim() || null,
      url: url.trim() || null,
    };
    onAdd(newHonor);
    setTitle("");
    setIssuer("");
    setDate("");
    setDescription("");
    setUrl("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Honor or Award"
      eyebrow="// NEW RECOGNITION"
      onSubmit={handleSubmit}
      submitLabel="Add Award"
      submitDisabled={!title.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Award / Honor Title *
          </label>
          <input
            type="text"
            placeholder="e.g. 1st Prize — National Hackathon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Issuer / Organization
            </label>
            <input
              type="text"
              placeholder="e.g. Ministry of Transport"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Date / Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2024"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Context, project details, or distinction..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Verification URL (Optional)
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
