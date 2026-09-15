import type { ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  eyebrow = "// NEW ENTRY",
  children,
  onSubmit,
  submitLabel = "Create Entry",
  submitDisabled = false,
}: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-rule bg-paper shadow-2xl overflow-hidden flex flex-col max-h-full">
        {/* Precision corner marks */}
        <span className="pointer-events-none absolute left-2 top-2 font-mono text-xs text-muted/40">+</span>
        <span className="pointer-events-none absolute right-2 top-2 font-mono text-xs text-muted/40">+</span>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rule bg-white px-6 py-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {eyebrow}
            </span>
            <h3 id="modal-title" className="font-display text-2xl font-normal text-ink">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-soft transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-sm">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-rule bg-soft/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-rule bg-white px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink hover:border-ink transition cursor-pointer"
          >
            Cancel
          </button>
          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled}
              className="rounded-lg bg-ink text-paper hover:opacity-90 px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition cursor-pointer disabled:opacity-40"
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
