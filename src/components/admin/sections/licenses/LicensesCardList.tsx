import { Plus, BadgeCheck, ExternalLink, Edit3, KeyRound } from "lucide-react";
import { ReorderButtons, reorderArray } from "../../ReorderButtons";
import type { License } from "../../../../types/portfolio";

interface LicensesCardListProps {
  licenses: License[];
  onSelectLicense: (id: string) => void;
  onAddLicense: () => void;
  onChange: (licenses: License[]) => void;
  onRequestDelete?: (title: string, onConfirm: () => void) => void;
}

export function LicensesCardList({
  licenses,
  onSelectLicense,
  onAddLicense,
  onChange,
  onRequestDelete,
}: LicensesCardListProps) {
  function moveLicense(index: number, direction: "up" | "down") {
    onChange(reorderArray(licenses, index, direction));
  }

  function handleDelete(license: License) {
    const doDelete = () => onChange(licenses.filter((l) => l.id !== license.id));
    if (onRequestDelete) {
      onRequestDelete(license.name || "Certification", doDelete);
    } else {
      doDelete();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-rule">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Admin · Verified Credentials</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Certifications &amp; Credentials ({licenses.length})
          </h2>
          <p className="text-sm text-muted mt-1">
            Verified industry credentials, issuing authorities, IDs, and public URLs.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddLicense}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-mono font-medium text-paper hover:opacity-90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {licenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-rule bg-soft/20 text-center">
          <BadgeCheck className="size-8 text-muted opacity-40 mb-2" />
          <p className="text-sm font-semibold text-ink">No certifications recorded yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Click &ldquo;Add Certification&rdquo; to showcase verified credentials and licenses.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {licenses.map((license, idx) => (
              <div
                key={license.id}
                className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper p-4 hover:border-ink/40 transition shadow-xs gap-3"
              >
                {/* Border-Integrated Corner Reorder & Management Notch */}
                <ReorderButtons
                  variant="corner"
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < licenses.length - 1}
                  onMoveUp={() => moveLicense(idx, "up")}
                  onMoveDown={() => moveLicense(idx, "down")}
                  onDelete={() => handleDelete(license)}
                  deleteTitle="Delete credential"
                />

                {/* Top Row: Issuer & Date */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 pr-32">
                  <span className="font-mono text-xs font-semibold text-accent truncate max-w-48">
                    {license.issuer || "Independent Authority"}
                  </span>
                  {license.issueDate ? (
                    <span className="font-mono text-xs text-muted shrink-0">
                      • {[license.issueDate, license.expiryDate ? `Exp: ${license.expiryDate}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                  {license.credentialId ? (
                    <span className="inline-flex items-center gap-1 rounded bg-soft/80 px-1.5 py-0.5 text-xs font-mono text-muted border border-rule">
                      <KeyRound className="size-3 text-muted" />
                      <span className="truncate max-w-48">{license.credentialId}</span>
                    </span>
                  ) : null}
                </div>

                {/* Middle Row: Name & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2 flex-wrap min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold text-ink group-hover:text-accent transition">
                      {license.name}
                    </h3>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-auto">
                    {license.url ? (
                      <a
                        href={license.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 text-muted hover:text-ink hover:bg-soft transition"
                        title="Open verification URL"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onSelectLicense(license.id)}
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
