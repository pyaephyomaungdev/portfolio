import { useState } from "react";
import { ArrowLeft, Save, Trash2, BadgeCheck } from "lucide-react";
import type { License } from "../../../../types/portfolio";

interface LicenseDetailEditorPageProps {
  license: License;
  onSave: (updated: License) => void;
  onCancel: () => void;
  onDelete?: (license: License) => void;
}

export function LicenseDetailEditorPage({
  license,
  onSave,
  onCancel,
  onDelete,
}: LicenseDetailEditorPageProps) {
  const [draft, setDraft] = useState<License>({ ...license });

  function handleSave() {
    onSave(draft);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rule">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-xs font-mono font-medium text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Certifications List</span>
          </button>
          <span className="text-muted text-xs">/</span>
          <h2 className="font-display text-xl font-bold text-ink truncate max-w-sm sm:max-w-md">
            {draft.name || "New Certification"}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(draft)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive-soft px-3 py-1.5 text-xs font-mono font-medium text-destructive hover:bg-destructive-soft/80 transition cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-rule bg-paper px-3 py-1.5 text-xs font-mono font-medium text-muted hover:text-ink hover:border-ink/40 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Editor Form Card */}
      <div className="rounded-xl border border-rule bg-paper p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-rule">
          <BadgeCheck className="size-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono">
            Credential Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Certificate / License Name *
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Issuing Organization *
            </label>
            <input
              type="text"
              value={draft.issuer || ""}
              onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services (AWS)"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Credential ID / Serial
            </label>
            <input
              type="text"
              value={draft.credentialId || ""}
              onChange={(e) => setDraft({ ...draft, credentialId: e.target.value })}
              placeholder="e.g. AWS-PSA-12345"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Issue Date
            </label>
            <input
              type="text"
              value={draft.issueDate || ""}
              onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
              placeholder="e.g. 2024"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Expiration Date (Optional)
            </label>
            <input
              type="text"
              value={draft.expiryDate || ""}
              onChange={(e) => setDraft({ ...draft, expiryDate: e.target.value })}
              placeholder="e.g. 2027 or leave blank if perpetual"
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-wider mb-1">
              Verification Link URL
            </label>
            <input
              type="text"
              value={draft.url || ""}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-rule bg-soft/40 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-ink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
