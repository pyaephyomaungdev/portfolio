import { useState } from "react";
import { AdminModal } from "../AdminModal";
import type { License } from "../../../types/portfolio";

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (license: License) => void;
}

export function AddLicenseModal({ isOpen, onClose, onAdd }: AddLicenseModalProps) {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    const newLic: License = {
      id: `lic-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim() || null,
      issueDate: issueDate.trim() || null,
      expiryDate: null,
      credentialId: credentialId.trim() || null,
      url: url.trim() || null,
    };
    onAdd(newLic);
    setName("");
    setIssuer("");
    setIssueDate("");
    setCredentialId("");
    setUrl("");
    onClose();
  }

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Certification"
      eyebrow="// NEW CREDENTIAL"
      onSubmit={handleSubmit}
      submitLabel="Add Certification"
      submitDisabled={!name.trim()}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">
            Certification Name *
          </label>
          <input
            type="text"
            placeholder="e.g. AWS Certified Solutions Architect"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Issuing Organization
            </label>
            <input
              type="text"
              placeholder="e.g. Amazon Web Services"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Issue Date / Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2024"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Credential ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. AWS-12345"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink transition font-mono"
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
      </div>
    </AdminModal>
  );
}
