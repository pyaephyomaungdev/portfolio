import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { Stat } from "../../../types/portfolio";

interface AddStatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stat: Stat) => void;
  currentCount: number;
}

export function AddStatModal({ isOpen, onClose, onAdd, currentCount }: AddStatModalProps) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!label.trim() || !value.trim()) return;
    const newStat: Stat = {
      id: `stat-${Date.now()}`,
      label: label.trim(),
      value: value.trim(),
      sortOrder: currentCount,
    };
    onAdd(newStat);
    setLabel("");
    setValue("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Header Metric"
      eyebrow="// NEW STAT"
      onSubmit={handleSubmit}
      submitLabel="Add Stat"
      submitDisabled={!label.trim() || !value.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Stat Label *
          </label>
          <input
            type="text"
            placeholder="e.g. Years building"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Display Value *
          </label>
          <input
            type="text"
            placeholder="e.g. 6+"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
          />
        </div>
      </div>
    </AdminModal>
  );
}
