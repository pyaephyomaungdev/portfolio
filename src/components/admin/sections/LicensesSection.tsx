import { Plus, Trash2 } from "lucide-react";
import { ReorderButtons, reorderArray } from "../ReorderButtons";
import type { License } from "../../../types/portfolio";

interface LicensesSectionProps {
  licenses: License[];
  onChange: (licenses: License[]) => void;
  onOpenAddModal: () => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function LicensesSection({
  licenses,
  onChange,
  onOpenAddModal,
  onRequestDelete,
}: LicensesSectionProps) {
  function moveLicense(index: number, direction: "up" | "down") {
    onChange(reorderArray(licenses, index, direction));
  }

  function handleDeleteLicense(idx: number, name: string) {
    const doDelete = () => onChange(licenses.filter((_, i) => i !== idx));
    if (onRequestDelete) {
      onRequestDelete(name || "Certification", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Certifications & Licenses ({licenses.length})</h2>
          <p className="text-xs text-muted mt-0.5">
            Industry certifications, credentials, and verification links.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {licenses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-rule rounded-xl text-muted text-xs font-mono">
          No certifications or licenses configured yet. Click "Add Certification" above to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {licenses.map((lic, idx) => (
            <div key={lic.id} className="p-4 rounded-xl border border-rule bg-paper flex items-center justify-between gap-3">
              <ReorderButtons
                canMoveUp={idx > 0}
                canMoveDown={idx < licenses.length - 1}
                onMoveUp={() => moveLicense(idx, "up")}
                onMoveDown={() => moveLicense(idx, "down")}
              />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-xs font-mono text-muted uppercase">Name</span>
                  <input
                    type="text"
                    value={lic.name}
                    onChange={(e) => {
                      const updated = [...licenses];
                      updated[idx] = { ...lic, name: e.target.value };
                      onChange(updated);
                    }}
                    className="w-full rounded border border-rule bg-white px-2.5 py-1.5 font-medium text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono text-muted uppercase">Issuer</span>
                  <input
                    type="text"
                    placeholder="Issuer"
                    value={lic.issuer || ""}
                    onChange={(e) => {
                      const updated = [...licenses];
                      updated[idx] = { ...lic, issuer: e.target.value || null };
                      onChange(updated);
                    }}
                    className="w-full rounded border border-rule bg-white px-2.5 py-1.5 text-muted outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono text-muted uppercase">Issue Date</span>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={lic.issueDate || ""}
                    onChange={(e) => {
                      const updated = [...licenses];
                      updated[idx] = { ...lic, issueDate: e.target.value || null };
                      onChange(updated);
                    }}
                    className="w-full rounded border border-rule bg-white px-2.5 py-1.5 font-mono text-muted outline-none focus:border-ink"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteLicense(idx, lic.name)}
                className="p-1.5 text-muted hover:text-destructive hover:bg-destructive-soft rounded transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
